/*
 * JsonFile.js - plugin to extract resources from an Json file
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
var JSON5 = require("json5");
var ilib = require("ilib");
var Locale = require("ilib/lib/Locale.js");

var logger = log4js.getLogger("loctool.plugin.JsonFile");

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

JsonFile.prototype.isPrimitive = function(type) {
    return ["boolean", "number", "integer", "string"].indexOf(type) > -1;
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

var typeKeywords = [
    "type",
    "contains",
    "allOf",
    "anyOf",
    "oneOf",
    "not"
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
 * @param {Object} schema the schema to check
 * @returns {boolean} true if the schema contains a type, false otherwise
 */
function hasType(schema) {
    return typeKeywords.find(function(keyword) {
        return typeof(schema[keyword]) !== 'undefined';
    });
}

JsonFile.prototype.parseObj = function(json, schema, ref, name, localizable) {
    if (!json || !schema) return;

    localizable |= schema.localizable;

    if (hasType(schema)) {
        var type = schema.type || typeof(json);
        switch (type) {
        case "boolean":
        case "number":
        case "integer":
        case "string":
            if (localizable) {
                // extract this value
                if (this.isPrimitive(typeof(json))) {
                    this.set.add(this.API.newResource({
                        resType: "string",
                        project: this.project.getProjectId(),
                        key: JsonFile.escapeProp(name),
                        sourceLocale: this.project.sourceLocale,
                        source: String(json),
                        pathName: this.pathName,
                        state: "new",
                        comment: this.comment,
                        datatype: this.type.datatype,
                        index: this.resourceIndex++
                    }));
                } else {
                    // no way to parse the additional items beyond the end of the array,
                    // so just ignore them
                    logger.warn(path.join(this.pathName, ref) + ": value should be type " + type + " but found " + typeof(json));
                }
            }
            break;

        case "array":
            if (!ilib.isArray(json)) {
               logger.warn(path.join(this.pathName, ref) + " is a " +
                   typeof(json) + " but should be an array according to the schema... skipping.");
                return;
            }
            // Convert all items to Strings so we can process them properly
            var sourceArray = json.map(function(item) {
                return String(item);
            });

            this.set.add(this.API.newResource({
                resType: "array",
                project: this.project.getProjectId(),
                key: JsonFile.escapeProp(name),
                sourceLocale: this.project.sourceLocale,
                sourceArray: sourceArray,
                pathName: this.pathName,
                state: "new",
                comment: this.comment,
                datatype: this.type.datatype,
                index: this.resourceIndex++
            }));
            break;

        case "object":
            if (typeof(json) !== "object") {
               logger.warn(path.join(this.pathName, ref) + " is a " +
                   typeof(json) + " but should be an object according to the schema...  skipping.");
                return;
            }
            if (isPlural(json)) {
                // handle this as a single plural resource instance instead
                // of an object that has resources inside of it
                this.set.add(this.API.newResource({
                    resType: "plural",
                    project: this.project.getProjectId(),
                    key: JsonFile.escapeProp(name),
                    sourceLocale: this.project.sourceLocale,
                    sourceStrings: json,
                    pathName: this.pathName,
                    state: "new",
                    comment: this.comment,
                    datatype: this.type.datatype,
                    index: this.resourceIndex++
                }));
            } else {
	            var props = Object.keys(json);
	            props.forEach(function(prop) {
	                if (schema.properties && schema.properties[prop]) {
	                    this.parseObj(
	                        json[prop],
	                        schema.properties[prop],
	                        path.join(ref, JsonFile.escapeRef(prop)),
	                        prop,
	                        localizable);
	                } else if (schema.additionalProperties) {
	                    this.parseObj(
	                        json[prop],
	                        schema.additionalProperties,
	                        path.join(ref, JsonFile.escapeRef(prop)),
	                        prop,
	                        localizable);
	                }
	            }.bind(this));
            }
            break;
        }
    }
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
JsonFile.prototype.parse = function(data) {
    logger.debug("Extracting strings from " + this.pathName);

    var json = JSON5.parse(data);

    // "#" is the root reference
    this.parseObj(json, this.schema, "#", "root", false);
};

/**
 * Extract all the localizable strings from the Json file and add them to the
 * project's translation set.
 */
JsonFile.prototype.extract = function() {
    logger.debug("Extracting strings from " + this.pathName);
    if (this.pathName) {
        var p = path.join(this.project.root, this.pathName);
        try {
            var data = fs.readFileSync(p, "utf8");
            if (data) {
                this.parse(data);
            }
        } catch (e) {
            logger.warn("Could not read file: " + p);
            logger.warn(e);
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

//we don't write Json source files
JsonFile.prototype.write = function() {};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
JsonFile.prototype.getLocalizedPath = function(locale) {
    return this.type.getLocalizedPath(this.mapping.template, this.pathName, this.locale);
};

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
JsonFile.prototype.localizeText = function(translations, locale) {
    this.segments.rewind();
    var segment = this.segments.current();
    var output = "";
    var substitution, replacement;

    this.resourceIndex = 0;

    while (segment) {
        if (segment.localizable) {
            var text = (segment.message && segment.message.getMinimalString()) || segment.text;
            var key = this.makeKey(this.API.utils.escapeInvalidChars(text));
            var tester = this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                sourceLocale: this.project.getSourceLocale(),
                reskey: key,
                datatype: this.type.datatype
            });
            var hashkey = tester.hashKeyForTranslation(locale);
            var translated = translations.getClean(hashkey);

            if (segment.attributeSubstitution) {
                if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
                    substitution = text;
                } else if (!translated && this.type && this.type.pseudos[locale]) {
                    var source, sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
                    if (sourceLocale !== this.project.sourceLocale) {
                        // translation is derived from a different locale's translation instead of from the source string
                        var sourceRes = translations.getClean(tester.hashKeyForTranslation(sourceLocale));
                        source = sourceRes ? sourceRes.getTarget() : text;
                    } else {
                        source = text;
                    }
                    substitution = this.type.pseudos[locale].getString(source);
                } else {
                    substitution = translated ? translated.getTarget() : text;
                }

                replacement = segment.replacement;

                substitution = this.API.utils.escapeQuotes(substitution);
            } else {
                if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
                    additional = text;
                } else if (!translated && this.type && this.type.pseudos[locale]) {
                    var source, sourceLocale = this.type.pseudos[locale].getPseudoSourceLocale();
                    if (sourceLocale !== this.project.sourceLocale) {
                        // translation is derived from a different locale's translation instead of from the source string
                        var sourceRes = translations.getClean(ResourceString.cleanHashKey(
                                this.project.getProjectId(), sourceLocale, this.makeKey(this.API.utils.escapeInvalidChars(text)), this.type.datatype));
                        source = sourceRes ? sourceRes.getTarget() : text;
                    } else {
                        source = text;
                    }
                    additional = this.type.pseudos[locale].getString(source);
                } else {
                    var additional;
                    if (translated) {
                        additional = translated.getTarget();
                    } else {
                        if (this.type && this.API.utils.containsActualText(text)) {
                            logger.trace("New string found: " + text);
                            this.type.newres.add(this.API.newResource({
                                resType: "string",
                                project: this.project.getProjectId(),
                                key: this.makeKey(this.API.utils.escapeInvalidChars(text)),
                                sourceLocale: this.project.sourceLocale,
                                source: this.API.utils.escapeInvalidChars(text),
                                targetLocale: locale,
                                target: this.API.utils.escapeInvalidChars(text),
                                autoKey: true,
                                pathName: this.pathName,
                                state: "new",
                                datatype: this.type.datatype,
                                index: this.resourceIndex++
                            }));
                            additional = this.type && this.type.missingPseudo && !this.project.settings.nopseudo ?
                                    this.type.missingPseudo.getString(text) : text;
                        } else {
                            additional = text;
                        }
                    }
                }

                var ma = MessageAccumulator.create(additional, segment.message);
                additional = ma.root.toArray().map(nodeToString).join('');

                if (substitution) {
                    additional = additional.replace(replacement, substitution);
                    substitution = undefined;
                    replacement = undefined;
                }

                if (this.project.settings.identify) {
                    // make it clear what is the resource is for this string
                    additional = '<span loclang="json" x-locid="' + this.API.utils.escapeQuotes(this.makeKey(this.API.utils.escapeInvalidChars(text))) + '">' + additional + '</span>';
                }

                if (segment.escape) {
                    additional = this.API.utils.escapeQuotes(additional);
                }

                output += additional;
            }
        } else {
            output += segment.text;
        }

        this.segments.next();
        segment = this.segments.current();
    }

    return output;
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
    if (this.segments) {
        for (var i = 0; i < locales.length; i++) {
            if (!this.project.isSourceLocale(locales[i])) {
                // skip variants for now until we can handle them properly
                var l = new Locale(locales[i]);
                if (!l.getVariant()) {
                    var pathName = this.getLocalizedPath(locales[i]);
                    logger.debug("Writing file " + pathName);
                    var p = path.join(this.project.target, pathName);
                    var d = path.dirname(p);
                    this.API.utils.makeDirs(d);

                    fs.writeFileSync(p, this.localizeText(translations, locales[i]), "utf-8");
                }
            }
        }
    } else {
        logger.debug(this.pathName + ": No strings, no localize");
    }
};

module.exports = JsonFile;
