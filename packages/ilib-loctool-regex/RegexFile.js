/*
 * RegexFile.js - plugin to extract resources from a Regex source code file
 *
 * Copyright © 2024-2025 JEDLSoft
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
var Locale = require("ilib-locale");
var escaperFactory = require("ilib-tools-common").escaperFactory;

// fake escaper for the identity escaper
var identity = {
    escape: function(str) {
        return str;
    },
    unescape: function(str) {
        return str;
    }
};

/**
 * Create a new Regex file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type of this instance
 */
var RegexFile = function(props) {
    this.project = props.project;
    this.pathName = props.pathName;
    this.type = props.type;
    this.API = this.project.getAPI();

    this.logger = this.API.getLogger("loctool.plugin.RegexFile");
    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
    this.mapping = this.type.getMapping(this.pathName);

    this.localeSpec = props.locale || (this.mapping && this.API.utils.getLocaleFromPath(this.mapping.template, this.pathName)) || "en-US";
    this.locale = new Locale(this.localeSpec);

    // get the regexps that finds the strings to translate
    this.mapping = this.type && this.type.getMapping(this.pathName);
    if (this.mapping && this.mapping.expressions) {
        this.mapping.expressions.forEach(function(exp) {
            // make sure the expression string is turned into a real regex
            if (!exp.regex) {
                exp.regex = new RegExp(exp.expression, exp.flags);
            }
            exp.regex.lastIndex = 0;

            // set up the unescaper to use after we have found the strings. The same unescaper
            // is used for all strings that match this expression. Escapers vary by expression
            // because different types of strings might have different escaping rules, even within
            // the same a programming language.
            // (e.g. double quoted strings in PHP are escaped differently than single quoted strings)
            var escapeStyle = exp.escapeStyle || "js";
            exp.escaper = escapeStyle !== "none" ? escaperFactory(escapeStyle) : identity;
        });
    }
    this.resourceIndex = 0;
};

/**
 * If the given string is surrounded by quotes, remove the quotes.
 * Otherwise, return the string unchanged.
 *
 * @param {String} str the string to strip
 * @returns {String} the string without quotes
 */
function stripQuotes(str) {
    var trimmed = str.trim();
    if (trimmed && trimmed.length > 1) {
        if ((trimmed.charAt(0) === "\"" && trimmed.charAt(str.length - 1) === "\"") ||
            (trimmed.charAt(0) === "'" && trimmed.charAt(str.length - 1) === "'")) {
            return trimmed.substring(1, trimmed.length - 1);
        }
    }
    return trimmed;
}

/**
 * Clean the string to make a resource name string. This means
 * removing leading and trailing white space, compressing
 * whitespaces, and unescaping characters. This changes
 * the string from what it looks like in the source
 * code but increases matching.
 *
 * @param {String} string the string to clean
 * @param {Escaper} escaper the escaper to use to unescape
 * @returns {String} the cleaned string
 */
RegexFile.prototype.cleanString = function(string, escaper) {
    if (!string) return string;
    var unescaped = escaper.unescape(string);

    unescaped = unescaped.
        replace(/\\[btnfr]/g, " ").
        replace(/[ \n\t\r\f]+/g, " ").
        trim();

    return stripQuotes(unescaped);
};

/**
 * Make a new key for the given source string. This key is a
 * hash of the source string that is has a high probability of being
 * unique for this source string and can be used to identify the
 * resource.
 *
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
RegexFile.prototype.makeKey = function(source) {
    return this.API.utils.hashKey(source);
};

/**
 * Parse the array of strings from the given data string and return
 * the array of strings as an actual array.
 *
 * @param {String} data the string to parse
 * @param {Escaper} escaper the escaper to use to unescape the strings
 * @returns {Array.<String>} the array of strings
 */
RegexFile.prototype.parseArray = function(data, escaper) {
    var arr;

    if (data) {
        arr = data.split(",");
        arr = arr.map(function(item) {
            return stripQuotes(escaper.unescape(item).trim());
        }.bind(this));
    }

    return arr;
}

/**
 * Match the given data against the given expression. If the expression
 * matches, create a new resource and add it to the set. Then, partition
 * the original data into the parts before and after the match and return
 * them so that the caller can continue to parse the data with the match
 * removed.
 *
 * If the expression does not match, return undefined.
 *
 * @param {String} data the data to match
 * @param {Object} exp the expression to match against
 * @returns {Object|undefined} if the expression matched, return an object
 * with the before and after strings. If the expression did not match, return
 * undefined.
 */
RegexFile.prototype.matchExpression = function(data, exp, cb) {
    // The cb parameter is a hidden, undocumented parameter that is used for testing only.
    // It is a callback that gets called to give information about regex matches
    var regex = exp.regex;
    regex.lastIndex = 0;
    var result = regex.exec(data);
    if (result && result.length > 1) {
        var r = undefined;
        var key = undefined;
        var source = undefined;
        var sourcePlural = undefined;
        var comment = undefined;
        var context = undefined;
        var flavor = undefined;
        var array = undefined;

        source = result.groups && result.groups.source && result.groups.source.trim();

        if (typeof(cb) === "function") {
            cb({
                expression: exp,
                result: result
            });
        }

        if (!source || source.length < 1) {
            this.logger.warn("Found match with no source string, " + this.pathName);
            return {
                before: data.substring(0, result.index),
                after: data.substring(result.index + result[0].length)
            };
        }

        if (result.groups) {
            if (result.groups.sourcePlural) {
                sourcePlural = exp.escaper.unescape(result.groups.sourcePlural);
            }
            if (result.groups.comment) {
                comment = exp.escaper.unescape(result.groups.comment);
            }
            if (result.groups.context) {
                context = exp.escaper.unescape(result.groups.context);
            }
            if (result.groups.flavor) {
                flavor = exp.escaper.unescape(result.groups.flavor);
            }
            if (result.groups.key) {
                // clean string unescapes the key, but also removes things
                // that foster greater matching, like compressing white space
                key = this.cleanString(result.groups.key, exp.escaper);
            }
        }

        if (exp.resourceType === "array") {
            array = this.parseArray(source, exp.escaper);
        }

        if (!key) {
            // src should contain the source string to use to generate the key
            var src;
            switch (exp.resourceType) {
                default:
                case "string":
                    src = exp.escaper.unescape(source);
                    break;
                case "plural":
                    src = exp.escaper.unescape(sourcePlural);
                    break;
                case "array":
                    src = array.join("");
                    break;
            }

            switch (exp.keyStrategy) {
                default:
                case "hash":
                    key = this.makeKey(src);
                    break;
                case "source":
                    key = src;
                    break;
                case "truncate":
                    key = src.substring(0, 32);
                    break;
            }
        }

        switch (exp.resourceType) {
            case "string":
                source = exp.escaper.unescape(source);
                r = this.API.newResource({
                    resType: exp.resourceType,
                    project: this.project.getProjectId(),
                    key: key,
                    sourceLocale: this.project.sourceLocale,
                    source: source,
                    pathName: this.pathName,
                    state: "new",
                    autoKey: true,
                    comment: comment,
                    datatype: exp.datatype,
                    context: context,
                    flavor: flavor,
                    index: this.resourceIndex++
                });
                break;
            case "plural":
                r = this.API.newResource({
                    resType: exp.resourceType,
                    project: this.project.getProjectId(),
                    key: key,
                    sourceLocale: this.project.sourceLocale,
                    source: source,
                    sourcePlurals: {
                        one: exp.escaper.unescape(source),
                        other: sourcePlural
                    },
                    pathName: this.pathName,
                    state: "new",
                    comment: comment,
                    datatype: exp.datatype,
                    context: context,
                    flavor: flavor,
                    index: this.resourceIndex++
                });
                break;
            case "array":
                r = this.API.newResource({
                    resType: exp.resourceType,
                    project: this.project.getProjectId(),
                    key: key,
                    sourceLocale: this.project.sourceLocale,
                    sourceArray: array,
                    pathName: this.pathName,
                    state: "new",
                    comment: comment,
                    datatype: exp.datatype,
                    context: context,
                    flavor: flavor,
                    index: this.resourceIndex++
                });
                break;
        }
        this.set.add(r);
        return {
            before: data.substring(0, result.index),
            after: data.substring(result.index + result[0].length)
        };
    }

    return undefined;
};

/**
 * Parse the given chunk of data using the given expression. Return
 * an array of chunks that did not match the expression.
 *
 * @param {String} data the data to parse
 * @param {Object} exp the expression to match against
 * @returns {Array.<String>} an array of chunks that did not match the expression
 */
RegexFile.prototype.parseChunk = function(data, exp, cb) {
    var result = this.matchExpression(data, exp, cb);
    if (result) {
        return [result.before].concat(this.parseChunk(result.after, exp, cb));
    } else {
        return [data];
    }
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
RegexFile.prototype.parse = function(data, cb) {
    // The cb parameter is a hidden, undocumented parameter that is used for testing only.
    // It is a callback that gets called to give information about regex matches
    this.logger.debug("Extracting strings from " + this.pathName);
    this.resourceIndex = 0;

    var chunks = [data];

    if (!this.mapping) {
        // report the problem, but continue processing other files
        const msg = "No mapping found in project.json for " + this.pathName;
        this.logger.debug(msg);
        return undefined;
    }

    if (!this.mapping.expressions || this.mapping.expressions.length < 1) {
        // there is a mapping, but it is misconfigured, so throw an exception
        const msg = "No expressions found in project.json for " + this.pathName;
        this.logger.error(msg);
        throw new Error(msg);
    }

    // Parse the chunks of data into smaller and smaller pieces until we have found
    // all the localizable strings. For each chunk, we find all matches of the 
    // regular expression, convert them into resources, and add them to the set.
    // Then, return an array of chunks that did not match the current expression. We
    // then parse each of those chunks with the next expression in the list. This is
    // a recursive process that will eventually terminate when there are no more
    // expressions or when the chunks are empty. The order of the expressions is
    // important because the first expression that matches will be the one that
    // is used to create the resource and subsequent expressions will only match
    // in the parts of the file that did not match the previous expressions.
    this.mapping.expressions.forEach(function(exp) {
        chunks = chunks.flatMap(function(chunk) {
            return this.parseChunk(chunk, exp, cb);
        }.bind(this));
    }.bind(this));

    return this.set;
};

/**
 * Extract all the localizable strings from the java file and add them to the
 * project's translation set.
 */
RegexFile.prototype.extract = function() {
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
        }
    }
};

/**
 * Return the set of resources found in the current Regex file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current Regex file.
 */
RegexFile.prototype.getTranslationSet = function() {
    return this.set;
}

// we don't localize or write Regex source files
RegexFile.prototype.localize = function() {};
RegexFile.prototype.write = function() {};

module.exports = RegexFile;
