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
    if (!options) options = {};
    this.project = options.project;
    this.pathName = options.pathName || "";
    this.type = options.type;

    this.API = this.project.getAPI();

    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
    this.mapping = options.mapping || this.type.getMapping(this.pathName);
    if (this.mapping) {
        this.schema = this.type.getSchema(this.mapping.schema);
        this.flavor = this.mapping.flavor;
    } else {
        this.schema = this.type.getDefaultSchema();
    }
    this.resourceIndex = 0;
    this.logger = this.API.getLogger("loctool.lib.XmlFile");
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
 * Converts value to a primitive type.
 */
function convertValueToType(value, type) {
    switch (type) {
        case "boolean":
            switch (value) {
                case "false":
                case "no":
                case "0":
                    return false;
                default:
                    return true;
            }
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
    var type = typeof(obj);
    switch (type) {
        case "string":
            return obj.length > 0;
        case "boolean":
        case "number":
            return true;
        case "undefined":
        case "function":
            return false;
        case "object":
            if (obj === null) {
                return false;
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

XmlFile.prototype.getValue = function(value, xml, ref, element) {
    switch (value) {
        case "_value":
            return xml;
        case "_element":
            return element;
        case "_path":
            return ref;
        case "_pathname":
            return this.pathName;
        case "_basename":
            if (this.pathName) {
                var base = path.basename(this.pathName);
                var firstdot = base.indexOf(".");
                return firstdot > -1 ? base.substring(0, firstdot) : base;
            }
            return undefined;
    }
    return value;
}

var mapToSourceField = {
    "array": "sourceArray",
    "plural": "sourceStrings",
    "string": "source"
};

function getSource(resource) {
    return resource[mapToSourceField[resource.getType()]];
}

var mapToTargetField = {
    "array": "targetArray",
    "plural": "targetStrings",
    "string": "target"
};

function getTarget(resource) {
    return resource[mapToTargetField[resource.getType()]];
}

XmlFile.prototype.localizeNode = function(resourceInfo, schema) {
    switch (resourceInfo.resType) {
        case "plural":
            var category = resourceInfo.category || "other";
            return (schema.localizableType.source === "_value") ?
                resourceInfo.translation[category] :
                this.sparseValue(resourceInfo.source[category]);
        default:
            return (schema.localizableType.source === "_value") ?
                resourceInfo.translation :
                this.sparseValue(resourceInfo.source);
    }
}

XmlFile.prototype.hydrateResourceInfo = function(resourceInfo, schema, text, key, element) {
    ["category", "locale", "source", "key", "comment", "context", "formatted"].forEach(function(field) {
        if ((typeof(schema.localizableType) === "string" && schema.localizableType === field) ||
                schema.localizableType[field]) {
            var value = this.getValue(schema.localizableType[field], text, key, element);
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
                        resourceInfo.source = value || "";
                        break;
                }
            } else if (field === "locale") {
                var l = new Locale(convertValueToType(value, schema.type));
                resourceInfo[field] = l.getSpec();
            } else if (typeof(value) !== 'undefined') {
                resourceInfo[field] = convertValueToType(value, schema.type);
            }
        }
    }.bind(this));
}

XmlFile.prototype.addExtractedResource = function(ref, resourceInfo) {
    var resource = resourceInfo.resource;

    if (!resource) {
        // all the subparts of the xml element have been processed now,
        // so we can create it and add it to the extracted set
        var options = {
            resType: resourceInfo.resType,
            project: this.project.getProjectId(),
            sourceLocale: resourceInfo.locale || this.project.sourceLocale,
            key: resourceInfo.key || XmlFile.unescapeRef(ref).substring(2),  // strips off the #/ part
            pathName: this.pathName,
            state: "new",
            datatype: this.type.datatype,
            comment: resourceInfo.comment,
            index: this.resourceIndex++,
            formatted: resourceInfo.formatted,
            context: resourceInfo.context,
            flavor: (this.mapping && this.mapping.flavor)
        };

        if (typeof(resourceInfo.source) !== 'undefined') {
            options[mapToSourceField[resourceInfo.resType]] = resourceInfo.source;
        }
        var resource = this.API.newResource(options);
        var hashkey = resource.hashKey();
        resourceInfo.resource = this.set.get(hashkey);
        if (!resourceInfo.resource) {
            this.set.add(resource);
            resourceInfo.resource = resource;
        }
    }
    return resource;
}

XmlFile.prototype.getTranslation = function(resourceInfo, locale, translations) {
    var resource = resourceInfo.resource;
    var translation, hashkey = resource.hashKeyForTranslation(locale);
    if (translations) {
        translation = translations.getClean(hashkey);
    }
    if (translation) {
        resourceInfo.translation = getTarget(translation);
    } else if (this.API.isPseudoLocale(locale) && this.type && this.type.pseudos[locale]) {
        var source, pseudoSourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
        if (pseudoSourceLocale !== this.project.sourceLocale) {
            // translation is derived from a different locale's translation instead of from the source string
            var sourceRes = translations.getClean(
                resource.cleanHashKey(),
                this.type.datatype);
            source = sourceRes ? getTarget(sourceRes) : getTarget(resource);
        } else {
            source = getTarget(resource);
        }
        if (source) {
            switch (resource.getType()) {
                case "array":
                    resourceInfo.translation = source.map(function(item) {
                        return this.type.pseudos[locale].getString(item);
                    }.bind(this));
                    break;
                case "plural":
                    resourceInfo.translation = objectMap(source, function(item) {
                        return this.type.pseudos[locale].getString(item);
                    }.bind(this));
                    break;
                default:
                    resourceInfo.translation = this.type.pseudos[locale].getString(source);
                    break;
            }
        }
    } else {
        if (this.type) {
            // this.logger.trace("New string found: " + text);

            var options = {
                resType: resource.getType(),
                project: this.project.getProjectId(),
                key: resource.getKey(),
                sourceLocale: this.project.sourceLocale,
                targetLocale: locale,
                pathName: this.pathName,
                state: "new",
                datatype: this.type.datatype,
                index: this.resourceIndex++,
                formatted: resource.formatted,
                context: resource.getContext(),
                flavor: resource.getFlavor()
            };

            switch (resource.getType()) {
                case "array":
                    options.sourceArray = resource.getSourceArray() || [];
                    options.targetArray = options.sourceArray;
                    if (this.type.missingPseudo && !this.project.settings.nopseudo) {
                        resourceInfo.translation = options.sourceArray.map(function(item) {
                            return this.type.missingPseudo.getString(item);
                        }.bind(this));
                    }
                    break;
                case "plural":
                    options.sourcePlurals = resource.getSourcePlurals() || {};
                    options.targetPlurals = options.sourcePlurals;
                    if (this.type.missingPseudo && !this.project.settings.nopseudo) {
                        resourceInfo.translation = objectMap(options.sourcePlurals, function(item) {
                            return this.type.missingPseudo.getString(item);
                        }.bind(this));
                    }
                    break;
                default:
                    options.source = resource.getSource() || "";
                    options.target = options.source;
                    if (this.type.missingPseudo && !this.project.settings.nopseudo) {
                        resourceInfo.translation = this.type.missingPseudo.getString(options.source);
                    }
                    break;
            }

            this.type.newres.add(this.API.newResource(options));
        }
    }
};

XmlFile.prototype.mapTemplateString = function(string, resourceInfo, plural) {
    switch (string) {
        case "[_category]":
            return plural;
        case "[_source]":
        case "[_target]":
            // record that we did a translation
            resourceInfo.keep = true;
            return resourceInfo.translation[plural];
        case "[_key]":
            return resourceInfo.key;
        case "[_comment]":
            return resourceInfo.comment;
        case "[_locale]":
            return resourceInfo.locale;
        case "[_context]":
            return resourceInfo.context;
        case "[_formatted]":
            return resourceInfo.formatted;
        case "[_flavor]":
            return (this.mapping && this.mapping.flavor) || string
        default:
            return string;
    }
};

function mergeItem(existingItem, newItem) {
    if (existingItem) {
        if (ilib.isArray(existingItem)) {
            existingItem.push(newItem);
            return existingItem;
        } else {
            return [
                existingItem,
                newItem
            ];
        }
    } else {
        return newItem;
    }
}

XmlFile.prototype.formatTemplate = function(template, resourceInfo, plural) {
    var returnValue = {}, item, subitem;
    for (var property in template) {
        var targetProperty = this.mapTemplateString(property, resourceInfo, plural);
        if (property === "[_forEachCategory]") {
            for (var plural in resourceInfo.translation) {
                item = this.formatTemplate(template[property], resourceInfo, plural);
                // now merge the item into any existing items
                for (subitem in item) {
                    returnValue[subitem] = mergeItem(returnValue[subitem], item[subitem]);
                }
            }
        } else {
            returnValue[targetProperty] = (typeof(template[property]) === "object") ?
                this.formatTemplate(template[property], resourceInfo, plural) :
                this.mapTemplateString(template[property], resourceInfo, plural);
        }
    }

    return returnValue;
};

XmlFile.prototype.parseObj = function(xml, root, schema, ref, name, localizable, translations, locale, resourceInfo) {
    if (typeof(xml) === 'undefined' || !schema) return;

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

    var localizeTree = localizable, returnValue, text, key;

    // When the schema has localizable = true, then start the construction of
    // an object that we can fill with info about the new resource as the subparts
    // of this schema are parsed
    if (schema.localizable) {
        localizeTree = true;
        if (xml.resourceInfo) {
            resourceInfo = xml.resourceInfo;
            resourceInfo.keep = undefined;
            resourceInfo.translation = undefined;
            if (translations && locale) {
                // now check if we have a translation or pseudo translation of this string
                this.getTranslation(resourceInfo, locale, translations);
            }
        } else {
            var resType = "string";
            resourceInfo = {
                resType: resType,
                element: name
            };
            if (schema.localizableType) {
                if (typeof(schema.localizableType) === "string") {
                    resourceInfo.resType = schema.localizableType;
                } else if (typeof(schema.localizableType) === "object" && schema.localizableType.type) {
                    resourceInfo.resType = schema.localizableType.type;
                }
                switch (resourceInfo.resType) {
                    case "array":
                       resourceInfo.source = [];
                       break;
                    case "plural":
                       resourceInfo.source = {};
                       break;
                    default:
                       resourceInfo.resType = "string";
                       resourceInfo.source = "";
                       break;
                }
                this.hydrateResourceInfo(resourceInfo, schema, "", undefined, ref.substring(ref.lastIndexOf('/')+1));
            }
            xml.resourceInfo = resourceInfo;
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
            schema.anyOf.find(function(subtype) {
                returnValue = this.parseObj(
                    xml,
                    root,
                    subtype,
                    ref,
                    name,
                    localizeTree,
                    translations,
                    locale,
                    resourceInfo);
                return returnValue;
            }.bind(this));
        } else {
            if (resourceInfo &&
                    resourceInfo.resType === "plural" &&
                    resourceInfo.translation &&
                    schema.localizable &&
                    root["$$refs"]["#/$defs/templates/plurals"]) {
                // If this is a localizable plural and we have a translation and a template available,
                // then generate the plural children from the templates instead of just localizing
                // whatever children are there already. This is how we support expanding or
                // contracting plurals
                var template =
                    root["$$refs"]["#/$defs/templates/plurals/" + name] ||
                    root["$$refs"]["#/$defs/templates/plurals/default"];
                if (template) {
                    return this.formatTemplate(template, resourceInfo);
                }
                // else fall through and localize whatever children are there
            }

            type = schema[typeProperty] || typeof(xml);
            switch (type) {
            case "boolean":
            case "number":
            case "integer":
            case "string":
                if (!localizeTree || !isPrimitive(typeof(xml)) || !schema || !schema.localizableType || !resourceInfo) {
                    returnValue = xml;
                } else {
                    text = String(xml);
                    key = XmlFile.unescapeRef(ref).substring(2);  // strip off the #/ part
                    this.hydrateResourceInfo(resourceInfo, schema, text, key, resourceInfo.element);
                    if (resourceInfo.translation && schema.localizableType.source === "_value") {
                        switch (resourceInfo.resType) {
                        case "plural":
                            var category = resourceInfo.category || "other";
                            returnValue = resourceInfo.translation[category];
                            break;
                        case "array":
                            returnValue = resourceInfo.translation[resourceInfo.index];
                            break;
                        default:
                            returnValue = resourceInfo.translation;
                            break;
                        }
                        // note down that we used an actual translation so that later
                        // when it comes time to prune resources in a sparse XML, we know to keep this one
                        resourceInfo.keep = true;
                    } else {
                        returnValue = text;
                    }
                }
                break;

            case "array":
                returnValue = this.parseObjArray(xml, root, schema, ref, name, localizeTree, translations, locale, resourceInfo);
                break;

            case "object":
                if (typeof(xml) !== "object") {
                    // this.logger.warn(this.pathName + '/' + ref + " is a " +
                    //    typeof(xml) + " but should be an object according to the schema...  skipping.");
                    return;
                }
                returnValue = {};
                var props = Object.keys(xml), subobject;
                props.forEach(function(prop) {
                    if (schema.properties && schema.properties[prop]) {
                        if (resourceInfo && schema.properties[prop].localizable) {
                            // remember the parent element's name
                            resourceInfo.element = prop;
                        }
                        subobject = this.parseObj(
                            xml[prop],
                            root,
                            schema.properties[prop],
                            ref + '/' + XmlFile.escapeRef(prop),
                            prop,
                            localizeTree,
                            translations,
                            locale,
                            resourceInfo);
                        if (isNotEmpty(subobject)) {
                            returnValue[prop] = subobject;
                        }
                    } else if (schema.additionalProperties && prop !== "_attributes") {
                        // don't consider _attributes to be an additional property that
                        // should be examined
                        if (resourceInfo && schema.additionalProperties.localizable) {
                            // remember the parent element's name
                            resourceInfo.element = prop;
                        }
                        subobject = this.parseObj(
                            xml[prop],
                            root,
                            schema.additionalProperties,
                            ref + '/' + XmlFile.escapeRef(prop),
                            prop,
                            localizeTree,
                            translations,
                            locale,
                            resourceInfo);
                        if (isNotEmpty(subobject)) {
                            returnValue[prop] = subobject;
                        }
                    } else if (prop !== "resourceInfo" && prop !== "_comment") {
                       // not in the schema, so don't propegate this node if we're in
                       // sparse mode
                       var obj = (prop !== "_attributes") ? this.sparseValue(xml[prop]) : xml[prop];
                       if (obj) returnValue[prop] = obj;
                    }
                }.bind(this));

                // now look for any required attributes and add them if they are missing
                if (schema.properties && schema.required) {
                    schema.required.forEach(function(prop) {
                        if (typeof(returnValue[prop]) === 'undefined') {
                            var obj, property = schema.properties[prop];
                            if (property && property.type) {
                                switch (property.type) {
                                    case "object":
                                        subobject = {};
                                        break;
                                    case "array":
                                        subobject = [];
                                        break;
                                    default:
                                    case "string":
                                        subobject = "";
                                        break;
                                }
                                obj = this.parseObj(
                                    subobject,
                                    root,
                                    property,
                                    ref + '/' + XmlFile.escapeRef(prop),
                                    prop,
                                    localizeTree,
                                    translations,
                                    locale,
                                    resourceInfo);
                                if (isNotEmpty(obj)) {
                                    returnValue[prop] = obj;
                                }
                            }
                        }
                    }.bind(this));
                }

                // if we are doing sparse, and the current object has no children, then there is
                // no point in returning the current node as well
                if (this.mapping && this.mapping.method && this.mapping.method === "sparse" && this.API.utils.isEmpty(returnValue)) {
                    returnValue = undefined;
                }
                break;
            }
        }

        if (schema.localizable && resourceInfo) {
            this.addExtractedResource(ref, resourceInfo);
            if (translations && !resourceInfo.keep) {
                returnValue = this.sparseValue(returnValue);
            }
        }
    }

    return isNotEmpty(returnValue) ? returnValue : undefined;
};

XmlFile.prototype.parseObjArray = function(xml, root, schema, ref, name, localizable, translations, locale, resourceInfo) {
    if (!ilib.isArray(xml)) {
        // this.logger.warn(this.pathName + '/' + ref + " is a " +
        //        typeof(xml) + " but should be an array according to the schema... skipping.");
        return null;
    }

    // Continue parsing and treat array as a set of regular elements.
    var returnValue = [];
    for (var i = 0; i < xml.length; i++) {
        if (resourceInfo) {
            resourceInfo.index = i;
        }
        var item = this.parseObj(
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
        );
        if (item) returnValue.push(item);
    }
    if (resourceInfo) {
        resourceInfo.index = undefined;
    }

    return returnValue;
}

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
XmlFile.prototype.parse = function(data) {
    // this.logger.debug("Extracting strings from " + this.pathName);

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
    // this.logger.debug("Extracting strings from " + this.pathName);
    if (this.pathName) {
        var p = path.join(this.project.root, this.pathName);
        try {
            var data = fs.readFileSync(p, "utf8");
            if (data) {
                this.parse(data);
            }
        } catch (e) {
            // this.logger.warn("Could not read file: " + p);
            // this.logger.warn(e);
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
    var spec = locale || this.project.sourceLocale;
    if (mapping.localeMap && mapping.localeMap[spec]) {
        spec = mapping.localeMap[spec];
    }

    return path.normalize(this.API.utils.formatPath(mapping.template, {
        sourcepath: this.pathName,
        locale: spec
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
                // this.logger.debug("Writing file " + pathName);
                var p = path.join(this.project.target, pathName);
                var d = path.dirname(p);
                this.API.utils.makeDirs(d);

                fs.writeFileSync(p, this.localizeText(translations, locales[i]), "utf-8");
            }
        }
    }
};

module.exports = XmlFile;
