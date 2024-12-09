/*
 * RegexFile.js - plugin to extract resources from a Regex source code file
 *
 * Copyright © 2024 JEDLSoft
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
var Locale = require("ilib/lib/Locale");


var strGetStringBogusConcatenation1 = "\\s*\\(\\s*(\"[^\"]*\"|'[^']*')\\s*\\+";
var strGetStringBogusConcatenation2 = "\\s*\\([^\\)]*\\+\\s*(\"[^\"]*\"|'[^']*')\\s*\\)";
var strGetStringBogusParam = "\\s*\\([^\"'\\)]*\\)/";

var strGetString = "\\s*\\(\\s*(\"((\\\\\"|[^\"])*)\"|'((\\\\'|[^'])*)')\\s*\\)";
var strGetStringWithId = "\\s*\\(\\s*(\"((\\\\\"|[^\"])*)\"|'((\\\\'|[^'])*)')\\s*,\\s*(\"((\\\\\"|[^\"])*)\"|'((\\\\'|[^'])*)')?\\s*,?\\s*\\)";

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

    // get the regexp that finds the function call that wraps strings to translate
    var jsSettings = this.project.settings && this.project.settings.Regex;
    var wrapper = (jsSettings && jsSettings.wrapper) || "(^R|\\WR)B\\s*\\.\\s*getString(JS)?";

    if (wrapper) {
        this.wrapperCaptureGroupCount = 0;
        for (var i = 0; i < wrapper.length; i++) {
            if (wrapper[i] === '\\') {
                i++;
            } else if (wrapper[i] === '(') {
                this.wrapperCaptureGroupCount++;
            }
        }
    }
    this.reGetString = new RegExp(wrapper + strGetString, "g");
    this.reGetStringWithId = new RegExp(wrapper + strGetStringWithId, "g");
    this.reGetStringBogusConcatenation1 = new RegExp(wrapper + strGetStringBogusConcatenation1, "g");
    this.reGetStringBogusConcatenation2 = new RegExp(wrapper + strGetStringBogusConcatenation2, "g");
    this.reGetStringBogusParam = new RegExp(wrapper + strGetStringBogusParam, "g");

    this.resourceIndex = 0;
};

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
RegexFile.unescapeString = function(string) {
    var unescaped = string;

    unescaped = unescaped.
        replace(/\\\\n/g, "").                // line continuation
        replace(/\\\n/g, "").                // line continuation
        replace(/^\\\\/, "\\").             // unescape backslashes
        replace(/([^\\])\\\\/g, "$1\\").
        replace(/^\\'/, "'").               // unescape quotes
        replace(/([^\\])\\'/g, "$1'").
        replace(/^\\"/, '"').
        replace(/([^\\])\\"/g, '$1"');

    return unescaped;
};

/**
 * Clean the string to make a resource name string. This means
 * removing leading and trailing white space, compressing
 * whitespaces, and unescaping characters. This changes
 * the string from what it looks like in the source
 * code but increases matching.
 *
 * @static
 * @param {String} string the string to clean
 * @returns {String} the cleaned string
 */
RegexFile.cleanString = function(string) {
    var unescaped = RegexFile.unescapeString(string);

    unescaped = unescaped.
        replace(/\\[btnfr]/g, " ").
        replace(/[ \n\t\r\f]+/g, " ").
        trim();

    return unescaped;
};

/**
 * Make a new key for the given string. This must correspond
 * exactly with the code in htglob jar file so that the
 * resources match up. See the class IResourceBundle in
 * this project under the java directory for the corresponding
 * code.
 *
 * @private
 * @param {String} source the source string to make a resource
 * key for
 * @returns {String} a unique key for this string
 */
RegexFile.prototype.makeKey = function(source) {
    return RegexFile.unescapeString(source);
};

var reI18nComment = new RegExp("//\\s*i18n\\s*:\\s*(.*)$");

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
RegexFile.prototype.parse = function(data) {
    this.logger.debug("Extracting strings from " + this.pathName);
    this.resourceIndex = 0;

    var comment, match, key;

    reI18nComment.lastIndex = 0;
    this.reGetString.lastIndex = 0; // just to be safe

    var result = this.reGetString.exec(data);
    while (result && result.length > 1 && result[this.wrapperCaptureGroupCount+1]) {
        // different matches for single and double quotes
        match = (result[this.wrapperCaptureGroupCount+1][0] === '"') ?
            result[this.wrapperCaptureGroupCount+2] :
            result[this.wrapperCaptureGroupCount+4];

        if (match && match.length) {
            this.logger.trace("Found string key: " + this.makeKey(match) + ", string: '" + match + "'");

            var last = data.indexOf('\n', this.reGetString.lastIndex);
            last = (last === -1) ? data.length : last;
            var line = data.substring(this.reGetString.lastIndex, last);
            var commentResult = reI18nComment.exec(line);
            comment = (commentResult && commentResult.length > 1) ? commentResult[1] : undefined;

            var r = this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                key: RegexFile.unescapeString(match),
                sourceLocale: this.project.sourceLocale,
                source: RegexFile.cleanString(match),
                autoKey: true,
                pathName: this.pathName,
                state: "new",
                comment: comment,
                datatype: this.type.datatype,
                index: this.resourceIndex++
            });
            // for use later when we write out resources
            r.mapping = this.mapping;
            this.set.add(r);
        } else {
            this.logger.warn("Warning: Bogus empty string in get string call: ");
            this.logger.warn("... " + data.substring(result.index, this.reGetString.lastIndex) + " ...");
        }
        result = this.reGetString.exec(data);
    }

    // just to be safe
    reI18nComment.lastIndex = 0;
    this.reGetStringWithId.lastIndex = 0;

    result = this.reGetStringWithId.exec(data);
    while (result && result.length > 2 && result[this.wrapperCaptureGroupCount+1]) {
        // different matches for single and double quotes
        var autoKey = false;
        match = (result[this.wrapperCaptureGroupCount+1][0] === '"') ?
            result[this.wrapperCaptureGroupCount+2] :
            result[this.wrapperCaptureGroupCount+4];
        key = (result[this.wrapperCaptureGroupCount+6] && result[this.wrapperCaptureGroupCount+6][0] === '"') ?
            result[this.wrapperCaptureGroupCount+7] :
            result[this.wrapperCaptureGroupCount+9];
        if (!key) {
            key = RegexFile.unescapeString(match);
            autoKey = true;
        }

        if (match && key && match.length && key.length) {
            var last = data.indexOf('\n', this.reGetStringWithId.lastIndex);
            last = (last === -1) ? data.length : last;
            var line = data.substring(this.reGetStringWithId.lastIndex, last);
            var commentResult = reI18nComment.exec(line);
            comment = (commentResult && commentResult.length > 1) ? commentResult[1] : undefined;

            this.logger.trace("Found string '" + match + "' with unique key " + key + ", comment: " + comment);

            var r = this.API.newResource({
                resType: "string",
                project: this.project.getProjectId(),
                key: key,
                sourceLocale: this.project.sourceLocale,
                source: RegexFile.cleanString(match),
                pathName: this.pathName,
                state: "new",
                comment: comment,
                datatype: this.type.datatype,
                index: this.resourceIndex++,
                autoKey: autoKey
            });
            // for use later when we write out resources
            r.mapping = this.mapping;
            this.set.add(r);
        } else {
            this.logger.warn("Warning: Bogus empty string in get string call: ");
            this.logger.warn("... " + data.substring(result.index, this.reGetString.lastIndex) + " ...");
        }
        result = this.reGetStringWithId.exec(data);
    }

    // now check for and report on errors in the source
    this.API.utils.generateWarnings(data, this.reGetStringBogusConcatenation1,
        "Warning: string concatenation is not allowed in the RB.getString() parameters:",
        this.logger,
        this.pathName);

    this.API.utils.generateWarnings(data, this.reGetStringBogusConcatenation2,
        "Warning: string concatenation is not allowed in the RB.getString() parameters:",
        this.logger,
        this.pathName);

    this.API.utils.generateWarnings(data, this.reGetStringBogusParam,
        "Warning: non-string arguments are not allowed in the RB.getString() parameters:",
        this.logger,
        this.pathName);
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
