/*
 * JsonFile.js - plugin to extract resources from an Json file
 *
 * Copyright © 2021-2022, Box, Inc.
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
var JSON5 = require("json5");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");

/**
 * Create a new Json file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type instance of this file
 */
var JsonFile = function(options) {
    this.project = options.project;
    this.pathName = path.normalize(options.pathName || "");
    this.type = options.type;

    this.API = this.project.getAPI();
    this.mapping = this.type.getMapping(this.pathName);
    this.localeSpec = (options && options.locale) ||
        (this.mapping && this.pathName && this.API.utils.getLocaleFromPath(this.mapping.template, this.pathName)) ||
        this.project.sourceLocale ||
        "en-US";
    this.locale = new Locale(this.localeSpec);
    this.logger = this.API.getLogger("loctool.plugin.JsonFile");
    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
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
JsonFile.unescapeString = function(string) {
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
JsonFile.cleanString = function(string) {
    var unescaped = JsonFile.unescapeString(string);

    unescaped = unescaped.
        replace(/[ \n\t\r\f]+/g, " ").
        trim();

    return unescaped;
};


JsonFile.escapeProp = function(prop) {
    return prop.
        replace(/~/g, "~0").
        replace(/\//g, "~1");
};

JsonFile.unescapeProp = function(prop) {
    return prop.
        replace(/~1/g, "/").
        replace(/~0/g, "~");
};

JsonFile.escapeRef = function(prop) {
    return JsonFile.escapeProp(prop).
        replace(/%/g, "%25").
        replace(/\^/g, "%5E").
        replace(/\|/g, "%7C").
        replace(/\\/g, "%5C").
        replace(/"/g, "%22").
        replace(/ /g, "%20");
};

JsonFile.unescapeRef = function(prop) {
    return JsonFile.unescapeProp(prop.
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

/**
 * Return true if every property in the node is one of the the Unicode
 * plural categories, which lets us know to treat this node as a plural
 * resource.
 */
function isPlural(node) {
    if (!node) return false;
    var props = Object.keys(node);
    return props.every(function(prop) {
        return pluralCategories[prop] && typeof(node[prop]) === "string";
    });
}

function isNotEmpty(obj) {
    if (isPrimitive(typeof(obj))) {
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

JsonFile.prototype.sparseValue = function(value) {
    return (!this.mapping || !this.mapping.method || this.mapping.method !== "sparse") ? value : undefined;
};

JsonFile.prototype.parseObj = function(json, root, schema, ref, name, localizable, translations, locale) {
    if (!json || !schema) return;

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

    var returnValue;

    localizable |= schema.localizable;

    if (this.type.hasType(schema)) {
        var type = schema.type || typeof(json);
        switch (type) {
        case "boolean":
        case "number":
        case "integer":
        case "string":
            if (localizable) {
                if (isPrimitive(typeof(json))) {
                    var text = String(json);
                    var key = JsonFile.unescapeRef(ref).substring(2);  // strip off the #/ part
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
                                    this.logger.trace("New string found: " + text);
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
                        // extract this new string
                        var opts = {
                            resType: "string",
                            project: this.project.getProjectId(),
                            key: key,
                            sourceLocale: this.project.sourceLocale,
                            pathName: this.pathName,
                            state: "new",
                            comment: this.comment,
                            datatype: this.type.datatype,
                            index: this.resourceIndex++
                        };
                        if (locale !== this.project.sourceLocale) {
                            opts.target = text;
                            opts.targetLocale = locale;
                        } else {
                            opts.source = text;
                        }
                        this.set.add(this.API.newResource(opts));
                        returnValue = this.sparseValue(text);
                    }
                } else {
                    // no way to parse the additional items beyond the end of the array,
                    // so just ignore them
                    this.logger.warn(this.pathName + '/' + ref + ": value should be type " + type + " but found " + typeof(json));
                    returnValue = this.sparseValue(json);
                }
            } else {
                returnValue = this.sparseValue(json);
            }
            break;

        case "array":
            returnValue = this.parseObjArray(json, root, schema, ref, name, localizable, translations, locale);
            break;

        case "object":
            if (typeof(json) !== "object") {
               this.logger.warn(this.pathName + '/' + ref + " is a " +
                   typeof(json) + " but should be an object according to the schema...  skipping.");
                return;
            }
            if (isPlural(json)) {
                // handle this as a single plural resource instance instead
                // of an object that has resources inside of it
                var sourcePlurals = json;
                if (localizable) {
                    var key = JsonFile.unescapeRef(ref).substring(2);  // strip off the #/ part
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
                                    this.logger.trace("New string found: " + text);
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
                        // extract this new resource
                        var opts = {
                            resType: "plural",
                            project: this.project.getProjectId(),
                            key: JsonFile.unescapeRef(ref).substring(2),
                            sourceLocale: this.project.sourceLocale,
                            pathName: this.pathName,
                            state: "new",
                            comment: this.comment,
                            datatype: this.type.datatype,
                            index: this.resourceIndex++
                        }
                        if (locale !== this.project.sourceLocale) {
                            opts.targetStrings = sourcePlurals;
                            opts.targetLocale = locale;
                        } else {
                            opts.sourceStrings = sourcePlurals;
                        }
                        this.set.add(this.API.newResource(opts));
                        returnValue = this.sparseValue(sourcePlurals);
                    }
                } else {
                    returnValue = this.sparseValue(sourcePlurals);
                }
            } else {
                returnValue = {};
                var props = Object.keys(json);
                props.forEach(function(prop) {
                    if (schema.properties && schema.properties[prop]) {
                        returnValue[prop] = this.parseObj(
                            json[prop],
                            root,
                            schema.properties[prop],
                            ref + '/' + JsonFile.escapeRef(prop),
                            prop,
                            localizable,
                            translations,
                            locale);
                    } else if (schema.additionalProperties) {
                        returnValue[prop] = this.parseObj(
                            json[prop],
                            root,
                            schema.additionalProperties,
                            ref + '/' + JsonFile.escapeRef(prop),
                            prop,
                            localizable,
                            translations,
                            locale);
                    } else {
                        returnValue[prop] = this.sparseValue(json[prop]);
                    }
                }.bind(this));
            }
            break;
        }
    }

    return isNotEmpty(returnValue) ? returnValue : undefined;
};

JsonFile.prototype.parseObjArray = function(json, root, schema, ref, name, localizable, translations, locale) {
    if (!ilib.isArray(json)) {
        this.logger.warn(this.pathName + '/' + ref + " is a " +
                typeof(json) + " but should be an array according to the schema... skipping.");
        return null;
    }

    var arrayType = getArrayTypeFromSchema(schema, root);

    if (arrayType === null) {
        return this.sparseValue(json);
    }

    if (arrayType === 'object') {
        // Continue parsing and treat array as a set of regular elements.
        var returnValue = [];
        for (var i = 0; i < json.length; i++) {
            returnValue.push(
                this.parseObj(
                        json[i],
                        root,
                        schema.items,
                        ref + '/' + JsonFile.escapeRef("item_" + i),
                        "item_" + i,
                        localizable,
                        translations,
                        locale
                )
            )
        }

        return returnValue;
    }

    // Convert all items to Strings so we can process them properly
    var sourceArray = json.map(function(item) {
        return String(item);
    });

    if (!localizable) {
        return convertArrayElementsToType(this.sparseValue(sourceArray), arrayType);
    }

    if (!translations) {
        // extract this value
        var opts = {
            resType: "array",
            project: this.project.getProjectId(),
            key: JsonFile.unescapeRef(ref).substring(2),
            sourceLocale: this.project.sourceLocale,
            pathName: this.pathName,
            state: "new",
            comment: this.comment,
            datatype: this.type.datatype,
            index: this.resourceIndex++
        };
        if (locale !== this.project.sourceLocale) {
            opts.targetArray = sourceArray;
            opts.targetLocale = locale;
        } else {
            opts.sourceArray = sourceArray;
        }
        this.set.add(this.API.newResource(opts));
        return convertArrayElementsToType(this.sparseValue(sourceArray), arrayType);
    }

    if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
        return convertArrayElementsToType(this.sparseValue(sourceArray), arrayType);
    }

    var key = JsonFile.unescapeRef(ref).substring(2);  // strip off the #/ part
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

    this.logger.trace("New strings found: " + sourceArray.toString());

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
JsonFile.prototype.parse = function(data) {
    this.logger.debug("Extracting strings from " + this.pathName);

    this.json = JSON5.parse(data);

    // "#" is the root reference
    this.parseObj(this.json, this.schema, this.schema, "#", "root", false, undefined, this.localeSpec);
};

/**
 * Extract all the localizable strings from the Json file and add them to the
 * project's translation set.
 */
JsonFile.prototype.extract = function() {
    this.logger.debug("Extracting strings from " + this.pathName);
    if (this.pathName) {
        var p = path.join(this.project.root, this.pathName);
        try {
            var data = fs.readFileSync(p, "utf8");
            if (data) {
                this.parse(data);
            }
        } catch (e) {
            this.logger.warn("Could not read file: " + p);
            this.logger.warn(e);
        }
    }
};

/**
 * Return the set of resources found in the current Json file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Json file.
 */
JsonFile.prototype.getTranslationSet = function() {
    return this.set;
}

JsonFile.prototype.write = function() {
    if (!this.json && this.isDirty()) {
        var locale = this.locale.getSpec();
        var pathName = this.pathName || this.getLocalizedPath(locale);
        this.logger.debug("Writing file " + pathName);
        var p = path.join(this.project.target, pathName);
        var d = path.dirname(p);
        this.API.utils.makeDirs(d);

        fs.writeFileSync(p, this.localizeText(undefined, locale), "utf-8");
    }
};


/**
 * Get all resources from this file. This will return all resources
 * of mixed types (strings, arrays, or plurals).
 *
 * @returns {Resource} all of the resources available in this resource file.
 */
JsonFile.prototype.getAll = function() {
    return this.set.getAll();
};

/**
 * Add a resource to this file. The locale of the resource
 * should correspond to the locale of the file, and the
 * context of the resource should match the context of
 * the file.
 *
 * @param {Resource} res a resource to add to this file
 */
JsonFile.prototype.addResource = function(res) {
    this.logger.trace("JsonFile.addResource: " + JSON.stringify(res) + " to " + this.project.getProjectId() + ", " + this.locale + ", " + JSON.stringify(this.context));
    var resLocale = res.getTargetLocale() || res.getSourceLocale();
    if (res && res.getProject() === this.project.getProjectId() && resLocale === this.locale.getSpec()) {
        this.logger.trace("correct project, context, and locale. Adding.");
        this.set.add(res);
    } else {
        if (res) {
            if (res.getProject() !== this.project.getProjectId()) {
                this.logger.warn("Attempt to add a resource to a resource file with the incorrect project.");
            } else {
                this.logger.warn("Attempt to add a resource to a resource file with the incorrect locale. " + resLocale + " vs. " + this.locale.getSpec());
            }
        } else {
            this.logger.warn("Attempt to add an undefined resource to a resource file.");
        }
    }
};

/**
 * Return true if this resource file has been modified
 * since it was loaded from disk.
 *
 * @returns {boolean} true if this resource file has been
 * modified since it was loaded
 */
JsonFile.prototype.isDirty = function() {
    return this.set.isDirty();
};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
JsonFile.prototype.getLocalizedPath = function(locale) {
    return this.type.getLocalizedPath(this.mapping, this.pathName, locale);
};


JsonFile.prototype.generateText = function(locale) {
    var returnValue = {};
    var resources = this.set.getAll();
    resources.forEach(function(res) {
        switch (res.getType()) {
            case 'plural':
                var strings = res.getTargetPlurals() || res.getSourcePlurals();
                var categories = Object.keys(pluralCategories);
                returnValue[res.getKey()] = categories.filter(function(cat) {
                    return strings[cat];
                }).map(function(cat) {
                    return (cat !== "other" ? cat : "") + "#" + strings[cat];
                }).join("|");
                break;

            case 'array':
                returnValue[res.getKey()] = res.getTargetArray();
                break;

            default:
                returnValue[res.getKey()] = res.getTarget();
                break;
        }
    });
    return returnValue;
}

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
JsonFile.prototype.localizeText = function(translations, locale) {
    // "#" is the root reference
    var returnValue = (!this.json && this.set.size() > 0) ?
        this.generateText(locale) :
        this.parseObj(this.json, this.schema, this.schema, "#", "root", false, translations, locale);
    return JSON.stringify(returnValue, undefined, 4) + '\n';
};

/**
 * Localize the contents of this Json file and write out the
 * localized Json file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
JsonFile.prototype.localize = function(translations, locales) {
    // don't localize if there is no text
    for (var i = 0; i < locales.length; i++) {
        if (!this.project.isSourceLocale(locales[i])) {
            // skip variants for now until we can handle them properly
            var l = new Locale(locales[i]);
            if (!l.getVariant()) {
                var pathName = this.getLocalizedPath(locales[i]);
                this.logger.debug("Writing file " + pathName);
                var p = path.join(this.project.target, pathName);
                var d = path.dirname(p);
                this.API.utils.makeDirs(d);

                fs.writeFileSync(p, this.localizeText(translations, locales[i]), "utf-8");
            }
        }
    }
};

module.exports = JsonFile;
