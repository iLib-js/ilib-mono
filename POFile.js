/*
 * POFile.js - plugin to extract resources from an PO file
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
var isSpace = require("ilib/lib/isSpace.js");
var isAlpha = require("ilib/lib/isAlpha.js");
var isAlnum = require("ilib/lib/isAlnum.js");
var Locale = require("ilib/lib/Locale.js");
var pluralForms = require("./pluralforms.json");

var logger = log4js.getLogger("loctool.plugin.POFile");

/**
 * Create a new PO file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type instance of this file
 */
var POFile = function(options) {
    this.project = options.project;
    this.pathName = options.pathName || "";
    this.type = options.type;
    this.localeSpec = options.locale || "en-US";
    this.locale = new Locale(this.localeSpec);

    this.API = this.project.getAPI();

    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
    this.mapping = this.type.getMapping(this.pathName);
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
POFile.unescapeString = function(string) {
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
POFile.cleanString = function(string) {
    var unescaped = POFile.unescapeString(string);

    unescaped = unescaped.
        replace(/[ \n\t\r\f]+/g, " ").
        trim();

    return unescaped;
};


POFile.escapeProp = function(prop) {
    return prop.
        replace(/~/g, "~0").
        replace(/\//g, "~1");
};

POFile.unescapeProp = function(prop) {
    return prop.
        replace(/~1/g, "/").
        replace(/~0/g, "~");
};

POFile.escapeRef = function(prop) {
    return POFile.escapeProp(prop).
        replace(/%/g, "%25").
        replace(/\^/g, "%5E").
        replace(/\|/g, "%7C").
        replace(/\\/g, "%5C").
        replace(/"/g, "%22").
        replace(/ /g, "%20");
};

POFile.unescapeRef = function(prop) {
    return POFile.unescapeProp(prop.
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
    } else if (isArray(object)) {
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

POFile.prototype.sparseValue = function(value) {
    return (!this.mapping || !this.mapping.method || this.mapping.method !== "sparse") ? value : undefined;
};

POFile.prototype.parseObj = function(po, root, schema, ref, name, localizable, translations, locale) {
    if (!po || !schema) return;

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
        var type = schema.type || typeof(po);
        switch (type) {
        case "boolean":
        case "number":
        case "integer":
        case "string":
            if (localizable) {
                if (isPrimitive(typeof(po))) {
                    var text = String(po);
                    var key = POFile.unescapeRef(ref).substring(2);  // strip off the #/ part
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
                                    logger.trace("New string found: " + text);
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
                            switch (type) {
                            case "boolean":
                                returnValue = (translatedText === "true");
                                break;
                            case "number":
                                returnValue = Number.parseFloat(translatedText);
                                break;
                            case "integer":
                                returnValue = Number.parseInt(translatedText);
                                break;
                            default:
                                returnValue = translatedText;
                                break;
                            }
                        }
                    } else {
                        // extract this value
                        this.set.add(this.API.newResource({
                            resType: "string",
                            project: this.project.getProjectId(),
                            key: key,
                            sourceLocale: this.project.sourceLocale,
                            source: text,
                            pathName: this.pathName,
                            state: "new",
                            comment: this.comment,
                            datatype: this.type.datatype,
                            index: this.resourceIndex++
                        }));
                        returnValue = this.sparseValue(text);
                    }
                } else {
                    // no way to parse the additional items beyond the end of the array,
                    // so just ignore them
                    logger.warn(this.pathName + '/' + ref + ": value should be type " + type + " but found " + typeof(po));
                    returnValue = this.sparseValue(po);
                }
            } else {
                returnValue = this.sparseValue(po);
            }
            break;

        case "array":
            if (!ilib.isArray(po)) {
               logger.warn(this.pathName + '/' + ref + " is a " +
                   typeof(po) + " but should be an array according to the schema... skipping.");
                return null;
            }
            // Convert all items to Strings so we can process them properly
            var sourceArray = po.map(function(item) {
                return String(item);
            });

            if (localizable) {
                var key = POFile.unescapeRef(ref).substring(2);  // strip off the #/ part
                if (translations) {
                    // localize it
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
                    if (locale === this.project.pseudoLocale && this.project.settings.nopseudo) {
                        translatedArray = this.sparseValue(sourceArray);
                    } else if (!translated && this.type && this.type.pseudos[locale]) {
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
                    } else {
                        if (translated) {
                            translatedArray = translated.getTargetArray();
                        } else {
                            if (this.type) {
                                logger.trace("New string found: " + text);
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
                                if (this.type && this.type.missingPseudo && !this.project.settings.nopseudo) {
                                    translatedArray = sourceArray.map(function(item) {
                                        return this.type.missingPseudo.getString(item);
                                    }.bind(this));
                                    translatedArray = this.sparseValue(translatedArray);
                                } else {
                                    translatedArray = this.sparseValue(sourceArray);
                                }
                            } else {
                                translatedArray = this.sparseValue(sourceArray);
                            }
                        }
                    }
                    returnValue = translatedArray;
                } else {
                    // extract this value
                    this.set.add(this.API.newResource({
                        resType: "array",
                        project: this.project.getProjectId(),
                        key: POFile.unescapeRef(ref).substring(2),
                        sourceLocale: this.project.sourceLocale,
                        sourceArray: sourceArray,
                        pathName: this.pathName,
                        state: "new",
                        comment: this.comment,
                        datatype: this.type.datatype,
                        index: this.resourceIndex++
                    }));
                    returnValue = this.sparseValue(sourceArray);
                }
            } else {
                returnValue = this.sparseValue(sourceArray);
            }
            break;

        case "object":
            if (typeof(po) !== "object") {
               logger.warn(this.pathName + '/' + ref + " is a " +
                   typeof(po) + " but should be an object according to the schema...  skipping.");
                return;
            }
            if (isPlural(po)) {
                // handle this as a single plural resource instance instead
                // of an object that has resources inside of it
                var sourcePlurals = po;
                if (localizable) {
                    var key = POFile.unescapeRef(ref).substring(2);  // strip off the #/ part
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
                                    logger.trace("New string found: " + text);
                                    this.type.newres.add(this.API.newResource({
                                        resType: "array",
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
                            key: POFile.unescapeRef(ref).substring(2),
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
                var props = Object.keys(po);
                props.forEach(function(prop) {
                    if (schema.properties && schema.properties[prop]) {
                        returnValue[prop] = this.parseObj(
                            po[prop],
                            root,
                            schema.properties[prop],
                            ref + '/' + POFile.escapeRef(prop),
                            prop,
                            localizable,
                            translations,
                            locale);
                    } else if (schema.additionalProperties) {
                        returnValue[prop] = this.parseObj(
                            po[prop],
                            root,
                            schema.additionalProperties,
                            ref + '/' + POFile.escapeRef(prop),
                            prop,
                            localizable,
                            translations,
                            locale);
                    }
                }.bind(this));
            }
            break;
        }
    }

    return isNotEmpty(returnValue) ? returnValue : undefined;
};

var tokens = {
    START: 0,
    END: 1,
    STRING: 2,
    COMMENT: 3,
    SPACE: 4,
    BLANKLINE: 5,
    MSGID: 6,
    MSGIDPLURAL: 7,
    MSGSTR: 8,
    MSGCTXT: 9,
    PLURAL: 10,
    UNKNOWN: 11
};

/**
 * Tokenize the file and return the tokens and extra information.
 * @returns {{type: number, value?: string, category?: number}} the next token 
 */
POFile.prototype.getToken = function() {
    var start, value;

    if (this.index >= this.data.length) {
        return {
            type: tokens.END
        };
    } else if (this.data[this.index] === "#") {
        // extract comments
        this.index++;
        start = this.index;
        while (this.index < this.data.length && this.data[this.index] !== '\n') {
            this.index++;
        }
        return {
            type: tokens.COMMENT,
            value: this.data.substring(start, this.index)
        };
    } else if (this.data[this.index] === '"') {
        // string
        value = "";
        while (this.data[this.index] === '"') {
            this.index++;
            start = this.index;
            while (this.index < this.data.length && this.data[this.index] !== '"') {
                if (this.data[this.index] === '\\') {
                   // escape
                   this.index++;
                }
                this.index++;
            }
            value += this.data.substring(start, this.index);
            if (this.index < this.data.length && this.data[this.index] === '"') {
                this.index++;
            }

            while (this.index < this.data.length && isSpace(this.data[this.index])) {
                this.index++;
            }
        }

        return {
            type: tokens.STRING,
            value: value
        };
    } else if (isSpace(this.data[this.index])) {
        if (this.data[this.index] === '\n' && this.index < this.data.length && this.data[this.index+1] === '\n') {
            return {
                type: tokens.BLANKLINE
            };
        }
        while (this.index < this.data.length && isSpace(this.data[this.index])) {
            this.index++;
        }
        return {
            type: tokens.SPACE
        };
    } else if (isAlpha(this.data[this.index])) {
        start = this.index;
        while (this.index < this.data.length && 
                (isAlnum(this.data[this.index]) ||
                 this.data[this.index] === '_' ||
                 this.data[this.index] === '[' ||
                 this.data[this.index] === ']')
              ) {
            this.index++;
        }
        value = this.data.substring(start, this.index);
        switch (value) {
            case 'msgid':
                return {
                    type: tokens.MSGID
                };
            case 'msgid_plural':
                return {
                    type: tokens.MSGIDPLURAL
                };
            case 'msgstr':
                return {
                    type: tokens.MSGSTR
                };
            case 'msgctxt':
                return {
                    type: tokens.MSGCTXT
                };
        }
        if (value.length > 6 && value.startsWith("msgstr")) {
            value = Number.parseInt(value.substring(8));
            return {
                type: tokens.PLURAL,
                category: value
            };
        }
    } else {
        return {
            type: tokens.UNKNOWN,
            value: this.data[this.index]
        };
    }
};

var states = {
    START: 0,
    MSGIDSTR: 1,
    MSGIDPLSTR: 2,
    MSGCTXTSTR: 3,
    MSGSTR: 4,
    PLURALSTR: 5
};

var commentTypeMap = {
    ' ': "translator",
    '.': "extracted",
    ',': "flags",
    '|': "previous"
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
POFile.prototype.parse = function(data) {
    logger.debug("Extracting strings from " + this.pathName);

    this.data = data;
    this.index = 0;
    var state = tokens.START;
    var token;
    var comment, context, source, translation, original, sourcePlurals, translationPlurals, category;

    function restart() {
        comment = context = source = translation = orignal = sourcePlurals = translationPlurals = category = undefined;
        state = states.START;
    }

    while (state !== states.END) {
        token = this.getToken();
        switch (state) {
            case states.START:
                switch (token.type) {
                    case tokens.MSGID:
                        state = states.MSGIDSTR;
                        break;
                    case tokens.MSGIDPLURAL:
                        state = states.MSGIDPLSTR;
                        break;
                    case tokens.MSGCTXT:
                        state = states.MSGCTXTSTR;
                        break;
                    case tokens.MSGSTR:
                        state = states.MSGSTR;
                        break;
                    case tokens.COMMENT:
                        if (!comment) {
                            comment = {};
                        }
                        if (token.value[0] === ':') {
                            original = token.value.substring(2);
                        } else {
                            comment[commentTypeMap[token.value[0]]] = token.value.substring(2);
                        }
                        break;
                    case tokens.PLURAL:
                        var language = this.locale.getLanguage();
                        var forms = pluralForms[language] || pluralForms.en;
                        if (token.category >= forms.length) {
                            console.log("Error: " + this.pathName + ": invalid plural category " + token.category + " for plural " + source);
                            reset();
                        } else {
                            category = forms[token.category];
                            state = states.PLURALSTR;
                        }
                        break;
                    case tokens.END:
                    case tokens.BLANKLINE:
                        if (source || sourcePlurals) {
                            // emit a resource
                            var options;
                            if (sourcePlurals) {
                                options = {
                                    resType: "plural",
                                    project: this.project.getProjectId(),
                                    key: source,
                                    sourceLocale: this.project.sourceLocale,
                                    sourceStrings: sourcePlurals,
                                    pathName: this.pathName,
                                    state: "new",
                                    comment: comment && JSON.stringify(comment),
                                    datatype: this.type.datatype,
                                    index: this.resourceIndex++,
                                    targetLocale
                                };
                                if (translationPlurals) {
                                    options.targetLocale = this.localeSpec;
                                    options.targetStrings = translationPlurals;
                                }
                            } else {
                                options = {
                                    resType: "string",
                                    project: this.project.getProjectId(),
                                    key: source,
                                    sourceLocale: this.project.sourceLocale,
                                    source: source,
                                    pathName: this.pathName,
                                    state: "new",
                                    comment: comment && JSON.stringify(comment),
                                    datatype: this.type.datatype,
                                    index: this.resourceIndex++
                                };
                                if (translation) {
                                    options.targetLocale = this.localeSpec;
                                    options.target = translation;
                                }
                            }
                            this.set.add(this.API.newResource(options));
                        }
                        if (token.type === tokens.END) {
                            state = states.END;
                        } else {
                            restart();
                        }
                        break;
                    case tokens.UNKNOWN:
                        console.log("Error: " + this.pathName + ": syntax error");
                        state = states.END;
                        break;
                }
                break;
            case states.MSGIDSTR:
                switch (token.type) {
                    case tokens.SPACE:
                        // ignore
                        break;
                    case tokens.STRING:
                        if (token.value.length) {
                            source = token.value;
                        }
                        state = states.START;
                        break;
                    default:
                        console.log("Error: msgid entry not followed by a string.");
                        restart();
                        break;
                }
                break;
            case states.MSGIDPLSTR:
                switch (token.type) {
                    case tokens.SPACE:
                        // ignore
                        break;
                    case tokens.STRING:
                        if (token.value.length) {
	                        sourcePlurals = {
	                            one: source,
	                            other: token.value
	                        };
                        }
                        state = states.START;
                        break;
                    default:
                        console.log("Error: msgid_plural entry not followed by a string.");
                        restart();
                        break;
                }
                break;
            case states.MSGCTXTSTR:
                switch (token.type) {
                    case tokens.SPACE:
                        // ignore
                        break;
                    case tokens.STRING:
                        if (token.value.length) {
                            context = token.value;
                        }
                        state = states.START;
                        break;
                    default:
                        console.log("Error: msgid entry not followed by a string.");
                        restart();
                        break;
                }
                break;
            case states.MSGSTR:
                switch (token.type) {
                    case tokens.SPACE:
                        // ignore
                        break;
                    case tokens.STRING:
                        if (token.value.length) {
                            translation = token.value;
                        }
                        state = states.START;
                        break;
                    default:
                        console.log("Error: msgstr entry not followed by a string.");
                        restart();
                        break;
                }
                break;
            case states.PLURALSTR:
                switch (token.type) {
                    case tokens.SPACE:
                        // ignore
                        break;
                    case tokens.STRING:
                        if (token.value.length) {
	                        if (!translationPlurals) {
	                            translationPlurals = {};
	                        }
	                        translationPlurals[category] = token.value;
                        }
                        state = states.START;
                        category = undefined;
                        break;
                    default:
                        console.log("Error: msgstr plural entry not followed by a string.");
                        restart();
                        break;
                }
                break;
        }
    }
};

/**
 * Extract all the localizable strings from the PO file and add them to the
 * project's translation set.
 */
POFile.prototype.extract = function() {
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
 * Return the set of resources found in the current PO file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current PO file.
 */
POFile.prototype.getTranslationSet = function() {
    return this.set;
}

//we don't write PO source files
POFile.prototype.write = function() {};

/**
 * Return the location on disk where the version of this file localized
 * for the given locale should be written.
 * @param {String] locale the locale spec for the target locale
 * @returns {String} the localized path name
 */
POFile.prototype.getLocalizedPath = function(locale) {
    return this.type.getLocalizedPath(this.mapping.template, this.pathName, locale);
};

/**
 * Localize the text of the current file to the given locale and return
 * the results.
 *
 * @param {TranslationSet} translations the current set of translations
 * @param {String} locale the locale to translate to
 * @returns {String} the localized text of this file
 */
POFile.prototype.localizeText = function(translations, locale) {
        // "#" is the root reference
    var returnValue = this.parseObj(this.po, this.schema, this.schema, "#", "root", false, translations, locale);
    return JSON.stringify(returnValue, undefined, 4) + '\n';
};

/**
 * Localize the contents of this PO file and write out the
 * localized PO file to a different file path.
 *
 * @param {TranslationSet} translations the current set of
 * translations
 * @param {Array.<String>} locales array of locales to translate to
 */
POFile.prototype.localize = function(translations, locales) {
    // don't localize if there is no text
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
};

module.exports = POFile;
