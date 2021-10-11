/*
 * XmlFile.js - plugin to extract resources from an XML file
 *
 * Copyright © 2021, Box, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fs = require("fs");
var path = require("path");
var log4js = require("log4js");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");
var xmljs = require("xml-js");

/**
 * Create a new XML file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type instance of this file
 */
var XmlFile = function(options) {
    this.project = options.project;
    this.pathName = options.pathName || "";
    this.type = options.type;

    this.API = this.project.getAPI();

    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
    this.mapping = this.type.getMapping(this.pathName);
    this.schema = this.mapping ? this.type.getSchema(this.mapping.schema) : this.type.getDefaultSchema();
    this.resourceIndex = 0;
};

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language. This includes
 * unescaping both special and Unicode characters.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
XmlFile.unescapeString = function(string) {
    var unescaped = string;

    unescaped = he.decode(unescaped);

    unescaped = unescaped.
        replace(/^\\\\/g, "\\").
        replace(/([^\\])\\\\/g, "$1\\").
        replace(/\\(.)/g, "$1");

    return unescaped;
};

/**
 * Clean the string to make a source string. This means
 * removing leading and trailing white space, compressing
 * whitespaces, and unescaping characters. This changes
 * the string from what it looks like in the source
 * code, but it increases the matching between strings
 * that only differ in ways that don't matter.
 *
 * @static
 * @param {String} string the string to clean
 * @returns {String} the cleaned string
 */
XmlFile.cleanString = function(string) {
    var unescaped = XmlFile.unescapeString(string);

    unescaped = unescaped.
        replace(/[ \n\t\r\f]+/g, " ").
        trim();

    return unescaped;
};


XmlFile.escapeProp = function(prop) {
    return prop.
        replace(/~/g, "~0").
        replace(/\//g, "~1");
};

XmlFile.unescapeProp = function(prop) {
    return prop.
        replace(/~1/g, "/").
        replace(/~0/g, "~");
};

XmlFile.escapeRef = function(prop) {
    return XmlFile.escapeProp(prop).
        replace(/%/g, "%25").
        replace(/\^/g, "%5E").
        replace(/\|/g, "%7C").
        replace(/\\/g, "%5C").
        replace(/"/g, "%22").
        replace(/ /g, "%20");
};

XmlFile.unescapeRef = function(prop) {
    return XmlFile.unescapeProp(prop.
        replace(/%5E/g, "^").
        replace(/%7C/g, "|").
        replace(/%5C/g, "\\").
        replace(/%22/g, "\"").
        replace(/%20/g, " ").
        replace(/%25/g, "%"));
};

function isPrimitive(type) {
    return ["boolean", "number", "integer", "string"].indexOf(type) > -1;
}

/**
 * Gets type of array based on provided schema.
 *
 * TODO: Add support for "anyOf" and "oneOf" type definitions.
 */
function getArrayTypeFromSchema(schema, root) {
    if (schema.type !== "array") {
        return null;
    }

    if (typeof(schema.items["$ref"]) !== 'undefined') {
        // substitute the referenced schema for this one
        var refname = schema.items["$ref"];
        var otherschema = root["$$refs"][refname];
        if (!otherschema) {
            console.log("Unknown reference " + refname + " while parsing " +
                    this.pathName + " with schema " + root["$id"]);
            return;
        }
        schema = otherschema;
    } else {
        schema = schema.items;
    }

    var allowedTypes = ["string", "integer", "number", "boolean", "object"];

    if (schema.type && allowedTypes.indexOf(schema.type) > -1) {
        return schema.type;
    }

    // Default type is string for compatibility reasons.
    return 'string';
}

/**
 * Converts each element of one-dimensional array to a primitive type.
 */
function convertArrayElementsToType(array, type) {
    if (!ilib.isArray(array)){
        return array;
    }

    return array.map(function (item) {
        return convertValueToType(item, type);
    });
}

/**
 * Converts value to a primitive type.
 */
function convertValueToType(value, type) {
    switch (type) {
        case "boolean":
            return value === "true";
        case "number":
            return Number.parseFloat(value);
        case "integer":
            return Number.parseInt(value);
        default:
            return value;
    }
}

var pluralCategories = {
    "zero": true,
    "one": true,
    "two": true,
    "few": true,
    "many": true,
    "other": true
};

function isNotEmpty(obj) {
    if (!obj) {
        return false;
    } else if (isPrimitive(typeof(obj))) {
        return typeof(obj) !== 'undefined';
    } else if (ilib.isArray(obj)) {
        return obj.length > 0;
    } else {
        for (var prop in obj) {
            if (isNotEmpty(obj[prop])) {
                return true;
            }
        }
        return false;
    }
}

var typeKeywords = [
    "type",
    "contains",
    "allOf",
    "anyOf",
    "oneOf",
    "not",
    "$ref"
];

/**
 * Return true if the schema has a type. The type could be indicated by
 * the presence of any of the following fields:
 * - type
 * - contains
 * - allOf
 * - anyOf
 * - oneOf
 * - not
 * - $ref
 * @param {Object} schema the schema to check
 * @returns {boolean} true if the schema contains a type, false otherwise
 */
XmlFile.prototype.hasType = function(schema) {
    return typeKeywords.find(function(keyword) {
        return typeof(schema[keyword]) !== 'undefined';
    });
};

/**
 * Recursively visit every node in an object and call the visitor on any
 * primitive values.
 * @param {*} object any object, arrary, or primitive
 * @param {Function(*)} visitor function to call on any primitive
 * @returns {*} the same type as the original object, but with every
 * primitive processed by the visitor function
 */
function objectMap(object, visitor) {
    if (isPrimitive(typeof(object))) {
        return visitor(object);
    } else if (ilib.isArray(object)) {
        return object.map(function(item) {
            return objectMap(item, visitor);
        });
    } else {
        var ret = {};
        for (var prop in object) {
            if (object.hasOwnProperty(prop)) {
                ret[prop] = objectMap(object[prop], visitor);
            }
        }
        return ret;
    }
}

XmlFile.prototype.sparseValue = function(value) {
    return (!this.mapping || !this.mapping.method || this.mapping.method !== "sparse") ? value : undefined;
};

function setFieldValue(resource, field, resourceInfo) {
    switch (field) {
        case "key":
            resource.setKey(resourceInfo.value);
            break;

        case "source":
            switch(resource.getType()) {
                case "array":
                    resource.setSourceArray(resource.getSourceArray().push(value));
                    break;
                case "plural":
                    var plurals = resource.getSourcePlurals();
                    plurals[category] = value;
                    resource.setSourcePlurals(plurals);
                    break;
                default:
                case "string":
                    resource.setSource(value);
                    break;
            }
            break;

        case "comment":
            resource.setComment(value);
            break;

        case "locale":
            resource.setSourceLocale(value);
            break;
    }
}

function getValue(value, xml, ref, element) {
    switch (value) {
        case "_value":
            return xml;
        case "_element":
            return element;
        case "_path":
            return ref;
    }
    return value;
}

var mapToSourceField = {
    "array": "sourceArray",
    "plural": "sourcePlurals",
    "string": "source"
};

function hydrateResourceInfo(resourceInfo, schema, text, key, element) {
    ["category", "locale", "source", "key", "comment"].forEach(function(field) {
        if (schema.localizableType[field]) {
            var value = getValue(schema.localizableType[field], text, key, element);
            if (field === "source") {
                switch (resourceInfo.resType) {
                    case "array":
                        if (!resourceInfo.source) {
                            resourceInfo.source = [value];
                        } else {
                            resourceInfo.source.push(value);
                        }
                        break;
                    case "plural":
                        if (!resourceInfo.source) {
                            resourceInfo.source = {};
                        }
                        resourceInfo.source[resourceInfo.category] = value;
                        break;
                    default:
                        resourceInfo.source = value;
                        break;
                }
            } else {
                resourceInfo[field] = value;
            }
        }
    });
}

XmlFile.prototype.parseObj = function(xml, root, schema, ref, name, localizable, translations, locale, resourceInfo) {
    if (!xml || !schema) return;

    if (typeof(schema["$ref"]) !== 'undefined') {
        // substitute the referenced schema for this one
        var refname = schema["$ref"];
        var otherschema = root["$$refs"][refname];
        if (!otherschema) {
            console.log("Unknown reference " + refname + " while parsing " +
                this.pathName + " with schema " + root["$id"]);
            return;
        }
        schema = otherschema;
    }

    var returnValue, text, key;

    // When the schema has localizable = true, then start the construction of
    // an object that we can fill with info about the new resource as the subparts
    // of this schema are parsed
    if (schema.localizable) {
        var resType = "string";
        resourceInfo = {
            resType: resType,
            element: name
        };
        localizable = true;
        if (schema.localizableType) {
            if (typeof(schema.localizableType) === "string") {
                resourceInfo.resType = schema.localizableType;
            } else if (typeof(schema.localizableType) === "object" && schema.localizableType.type) {
                resourceInfo.resType = schema.localizableType.type;
            }
            if (resourceInfo.resType !== "array" && resourceInfo.resType !== "plural") {
                resourceInfo.resType = "string";
            }
            hydrateResourceInfo(resourceInfo, schema, undefined, undefined, ref.substring(ref.lastIndexOf('/')+1));
        }
    }

    var type, typeProperty = this.hasType(schema);
    if (typeProperty) {
        if (typeProperty === "anyOf") {
            // The type of the node needs to be one of the types
            // in the given array of types in the schema. That is, this
            // is an "OR" of types.
            // So, just reparse the current node with each of the
            // subtypes until one of them works. Don't descend into
            // the xml further -- we are only descending into the
            // the type in the schema, and parsing the same xml node
            // each time.
            var sub = schema.anyOf.find(function(subtype) {
                return this.parseObj(
                    xml,
                    root,
                    subtype,
                    ref,
                    name,
                    localizable,
                    translations,
                    locale,
                    resourceInfo);
            }.bind(this));
            if (sub) {
                returnValue = sub;
            }
        } else {
            type = schema[typeProperty] || typeof(xml);
            switch (type) {
            case "boolean":
            case "number":
            case "integer":
            case "string":
                if (localizable) {
                    if (isPrimitive(typeof(xml))) {
                        text = String(xml);
                        key = XmlFile.unescapeRef(ref).substring(2);  // strip off the #/ part

                        if (schema.localizableType && resourceInfo) {
                            hydrateResourceInfo(resourceInfo, schema, text, key, resourceInfo.element);
                        }

                        if (translations) {
                            // localize it
                            var tester = this.API.newResource({
                                resType: "string",
                                project: this.project.getProjectId(),
                                sourceLocale: this.project.getSourceLocale(),
                                reskey: key,
                                datatype: this.type.datatype
                            });
                            var hashkey = tester.hashKeyForTranslation(locale);
                            var translated = translations.getClean(hashkey);
                            var translatedText;
                            if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
                                translatedText = this.sparseValue(text);
                            } else if (!translated && this.type && this.type.pseudos[locale]) {
                                var source, sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
                                if (sourceLocale !== this.project.sourceLocale) {
                                    // translation is derived from a different locale's translation instead of from the source string
                                    var sourceRes = translations.getClean(
                                        tester.cleanHashKey(),
                                        this.type.datatype);
                                    source = sourceRes ? sourceRes.getTarget() : text;
                                } else {
                                    source = text;
                                }
                                translatedText = this.type.pseudos[locale].getString(source);
                            } else {
                                if (translated) {
                                    translatedText = translated.getTarget();
                                } else {
                                    if (this.type && this.API.utils.containsActualText(text)) {
                                        // logger.trace("New string found: " + text);
                                        this.type.newres.add(this.API.newResource({
                                            resType: "string",
                                            project: this.project.getProjectId(),
                                            key: key,
                                            sourceLocale: this.project.sourceLocale,
                                            source: text,
                                            targetLocale: locale,
                                            target: text,
                                            pathName: this.pathName,
                                            state: "new",
                                            datatype: this.type.datatype,
                                            index: this.resourceIndex++
                                        }));
                                        translatedText = this.type && this.type.missingPseudo && !this.project.settings.nopseudo ?
                                                this.type.missingPseudo.getString(text) : text;
                                        translatedText = this.sparseValue(translatedText);
                                    } else {
                                        translatedText = this.sparseValue(text);
                                    }
                                }
                            }
                            if (translatedText) {
                                returnValue = convertValueToType(translatedText, type);
                            }
                        } else {
                            returnValue = this.sparseValue(text);
                        }
                    } else {
                        // no way to parse the additional items beyond the end of the array,
                        // so just ignore them
                        // logger.warn(this.pathName + '/' + ref + ": value should be type " + type + " but found " + typeof(xml));
                        returnValue = this.sparseValue(xml);
                    }
                } else {
                    returnValue = this.sparseValue(xml);
                }
                break;

            case "array":
                returnValue = this.parseObjArray(xml, root, schema, ref, name, localizable, translations, locale, resourceInfo);
                break;

            case "object":
                if (typeof(xml) !== "object") {
                    // logger.warn(this.pathName + '/' + ref + " is a " +
                    //    typeof(xml) + " but should be an object according to the schema...  skipping.");
                    return;
                }
                if (false) {
                    // handle this as a single plural resource instance instead
                    // of an object that has resources inside of it
                    var sourcePlurals = xml;
                    if (localizable) {
                        key = XmlFile.unescapeRef(ref).substring(2);  // strip off the #/ part
                        if (translations) {
                            // localize it
                            var tester = this.API.newResource({
                                resType: "plural",
                                project: this.project.getProjectId(),
                                sourceLocale: this.project.getSourceLocale(),
                                reskey: key,
                                datatype: this.type.datatype
                            });
                            var hashkey = tester.hashKeyForTranslation(locale);
                            var translated = translations.getClean(hashkey);
                            var translatedPlurals;
                            if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
                                translatedPlurals = this.sparseValue(sourcePlurals);
                            } else if (!translated && this.type && this.type.pseudos[locale]) {
                                var source, sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
                                if (sourceLocale !== this.project.sourceLocale) {
                                    // translation is derived from a different locale's translation instead of from the source string
                                    var sourceRes = translations.getClean(
                                        tester.cleanHashKey(),
                                        this.type.datatype);
                                    source = sourceRes ? sourceRes.getTargetPlurals() : sourcePlurals;
                                } else {
                                    source = sourcePlurals;
                                }
                                translatedPlurals = objectMap(source, function(item) {
                                    return this.type.pseudos[locale].getString(item);
                                }.bind(this));
                            } else {
                                if (translated) {
                                    translatedPlurals = translated.getTargetPlurals();
                                } else {
                                    if (this.type) {
                                        // logger.trace("New string found: " + text);
                                        this.type.newres.add(this.API.newResource({
                                            resType: "plural",
                                            project: this.project.getProjectId(),
                                            key: key,
                                            sourceLocale: this.project.sourceLocale,
                                            sourceStrings: sourcePlurals,
                                            targetLocale: locale,
                                            targetStrings: sourcePlurals,
                                            pathName: this.pathName,
                                            state: "new",
                                            datatype: this.type.datatype,
                                            index: this.resourceIndex++
                                        }));
                                        if (this.type && this.type.missingPseudo && !this.project.settings.nopseudo) {
                                            translatedPlurals = objectMap(sourcePlurals, function(item) {
                                                return this.type.missingPseudo.getString(item);
                                            }.bind(this));
                                            translatedPlurals = this.sparseValue(translatedPlurals);
                                        } else {
                                            translatedPlurals = this.sparseValue(sourcePlurals);
                                        }
                                    } else {
                                        translatedPlurals = this.sparseValue(sourcePlurals);
                                    }
                                }
                            }
                            returnValue = translatedPlurals;
                        } else {
                            // extract this value
                            this.set.add(this.API.newResource({
                                resType: "plural",
                                project: this.project.getProjectId(),
                                key: XmlFile.unescapeRef(ref).substring(2),
                                sourceLocale: this.project.sourceLocale,
                                sourceStrings: sourcePlurals,
                                pathName: this.pathName,
                                state: "new",
                                comment: this.comment,
                                datatype: this.type.datatype,
                                index: this.resourceIndex++
                            }));
                            returnValue = this.sparseValue(sourcePlurals);
                        }
                    } else {
                        returnValue = this.sparseValue(sourcePlurals);
                    }
                } else {
                    returnValue = {};
                    var props = Object.keys(xml);
                    props.forEach(function(prop) {
                        if (schema.properties && schema.properties[prop]) {
                            if (resourceInfo && schema.properties[prop].localizable) {
                                // remember the parent element's name
                                resourceInfo.element = prop;
                            }
                            returnValue[prop] = this.parseObj(
                                xml[prop],
                                root,
                                schema.properties[prop],
                                ref + '/' + XmlFile.escapeRef(prop),
                                prop,
                                localizable,
                                translations,
                                locale,
                                resourceInfo);
                        } else if (schema.additionalProperties && prop !== "_attributes") {
                            // don't consider _attributes to be an additional property that
                            // should be examined
                            if (resourceInfo && schema.additionalProperties.localizable) {
                                // remember the parent element's name
                                resourceInfo.element = prop;
                            }
                            returnValue[prop] = this.parseObj(
                                xml[prop],
                                root,
                                schema.additionalProperties,
                                ref + '/' + XmlFile.escapeRef(prop),
                                prop,
                                localizable,
                                translations,
                                locale,
                                resourceInfo);
                        } else {
                            returnValue[prop] = this.sparseValue(xml[prop]);
                        }
                    }.bind(this));
                }
                break;
            }
        }
    }

    if (schema.localizable && resourceInfo && resourceInfo.source) {
        // all the subparts of the xml element have been processed now,
        // so we can create it and add it to the set
        var options = {
            resType: resourceInfo.resType,
            project: this.project.getProjectId(),
            sourceLocale: resourceInfo.locale || this.project.sourceLocale,
            key: resourceInfo.key || XmlFile.unescapeRef(ref).substring(2),  // strips off the #/ part
            pathName: this.pathName,
            state: "new",
            datatype: this.type.datatype,
            comment: resourceInfo.comment,
            index: this.resourceIndex++
        };

        if (resourceInfo.source) {
            options[mapToSourceField[resourceInfo.resType]] = resourceInfo.source;
        }

        this.set.add(this.API.newResource(options));
    }

    return isNotEmpty(returnValue) ? returnValue : undefined;
};

XmlFile.prototype.parseObjArray = function(xml, root, schema, ref, name, localizable, translations, locale, resourceInfo) {
    if (!ilib.isArray(xml)) {
        // logger.warn(this.pathName + '/' + ref + " is a " +
        //        typeof(xml) + " but should be an array according to the schema... skipping.");
        return null;
    }

    var arrayType = getArrayTypeFromSchema(schema, root);

    if (arrayType === null) {
        return this.sparseValue(xml);
    }

    if (arrayType === 'object') {
        // Continue parsing and treat array as a set of regular elements.
        var returnValue = [];
        for (var i = 0; i < xml.length; i++) {
            returnValue.push(
                this.parseObj(
                    xml[i],
                    root,
                    schema.items,
                    ref + '/' + XmlFile.escapeRef("item_" + i),
                    // "item_" + i,
                    name,
                    localizable,
                    translations,
                    locale,
                    resourceInfo
                )
            )
        }

        return returnValue;
    }

    // Convert all items to Strings so we can process them properly
    var sourceArray = xml.map(function(item) {
        return String(item);
    });

    if (!localizable) {
        return convertArrayElementsToType(this.sparseValue(sourceArray), arrayType);
    }

    if (resourceInfo && !translations) {
        // extract this value
        resourceInfo.source = sourceArray;
        return convertArrayElementsToType(this.sparseValue(sourceArray), arrayType);
    }

    if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
        return convertArrayElementsToType(this.sparseValue(sourceArray), arrayType);
    }

    var key = XmlFile.unescapeRef(ref).substring(2);  // strip off the #/ part
    var tester = this.API.newResource({
        resType: "array",
        project: this.project.getProjectId(),
        sourceLocale: this.project.getSourceLocale(),
        reskey: key,
        datatype: this.type.datatype
    });
    var hashkey = tester.hashKeyForTranslation(locale);
    var translated = translations.getClean(hashkey);
    var translatedArray;

    if (!translated && this.type && this.type.pseudos[locale]) {
        var source, sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
        if (sourceLocale !== this.project.sourceLocale) {
            // translation is derived from a different locale's translation instead of from the source string
            var sourceRes = translations.getClean(
                    tester.cleanHashKey(),
                    this.type.datatype);
            source = sourceRes ? sourceRes.getTargetArray() : sourceArray;
        } else {
            source = sourceArray;
        }
        translatedArray = source.map(function(item) {
            return this.type.pseudos[locale].getString(item);
        }.bind(this));

        return convertArrayElementsToType(translatedArray, arrayType);
    }

    if (translated) {
        return convertArrayElementsToType(translated.getTargetArray(), arrayType);
    }

    if (!this.type) {
        return convertArrayElementsToType(this.sparseValue(sourceArray), arrayType);
    }

    // logger.trace("New strings found: " + sourceArray.toString());

    this.type.newres.add(this.API.newResource({
        resType: "array",
        project: this.project.getProjectId(),
        key: key,
        sourceLocale: this.project.sourceLocale,
        sourceArray: sourceArray,
        targetLocale: locale,
        targetArray: sourceArray,
        pathName: this.pathName,
        state: "new",
        datatype: this.type.datatype,
        index: this.resourceIndex++
    }));

    if (this.type.missingPseudo && !this.project.settings.nopseudo) {
        translatedArray = sourceArray.map(function(item) {
            return this.type.missingPseudo.getString(item);
        }.bind(this));
        translatedArray = this.sparseValue(translatedArray);
    } else {
        translatedArray = this.sparseValue(sourceArray);
    }

    return convertArrayElementsToType(translatedArray, arrayType);
}

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
XmlFile.prototype.parse = function(data) {
    // logger.debug("Extracting strings from " + this.pathName);

    this.xml = data;
    this.resourceIndex = 0;

    this.json = xmljs.xml2js(data, {
        trim: false,
        nativeTypeAttribute: true,
        compact: true
    });

    // "#" is the root reference
    this.parseObj(this.json, this.schema, this.schema, "#", "root", false, undefined);
};

/**
 * Extract all the localizable strings from the XML file and add them to the
 * project's translation set.
 */
XmlFile.prototype.extract = function() {
    // logger.debug("Extracting strings from " + this.pathName);
    if (this.pathName) {
        var p = path.join(this.project.root, this.pathName);
        try {
            var data = fs.readFileSync(p, "utf8");
            if (data) {
                this.parse(data);
            }
        } catch (e) {
            // logger.warn("Could not read file: " + p);
            // logger.warn(e);
        }
    }
};

/**
 * Return the set of resources found in the current XML file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current XML file.
 */
XmlFile.prototype.getTranslationSet = function() {
    return this.set;
}

//we don't write XML source files
XmlFile.prototype.write = function() {};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
XmlFile.prototype.getLocalizedPath = function(locale) {
    var mapping = this.mapping || this.type.getMapping(this.pathName) || this.type.getDefaultMapping();
    return path.normalize(this.API.utils.formatPath(mapping.template, {
        sourcepath: this.pathName,
        locale: locale
    }));
};

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
XmlFile.prototype.localizeText = function(translations, locale) {
        // "#" is the root reference
    var json = this.parseObj(this.json, this.schema, this.schema, "#", "root", false, translations, locale, undefined);
    return xmljs.js2xml(json, {
        spaces: 4,
        compact: true
    }) + '\n';
};

/**
 * Localize the contents of this Json file and write out the
 * localized Json file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
XmlFile.prototype.localize = function(translations, locales) {
    // don't localize if there is no text
    for (var i = 0; i < locales.length; i++) {
        if (!this.project.isSourceLocale(locales[i])) {
            // skip variants for now until we can handle them properly
            var l = new Locale(locales[i]);
            if (!l.getVariant()) {
                var pathName = this.getLocalizedPath(locales[i]);
                // logger.debug("Writing file " + pathName);
                var p = path.join(this.project.target, pathName);
                var d = path.dirname(p);
                this.API.utils.makeDirs(d);

                fs.writeFileSync(p, this.localizeText(translations, locales[i]), "utf-8");
            }
        }
    }
};

module.exports = XmlFile;
