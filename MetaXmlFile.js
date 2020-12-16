/*
 * MetaXmlFile.js - plugin to extract resources from a MetaXml source code file
 *
 * Copyright © 2020, Box, Inc.
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

var ilib = require("ilib");
var fs = require("fs");
var path = require("path");
var log4js = require("log4js");
var xmljs = require("xml-js");
var IString = require("ilib/lib/IString");

var logger = log4js.getLogger("loctool.lib.MetaXmlFile");

/**
 * Create a new java file with the given path name and within
 * the given project.
 *
 * @param {Project} project the project object
 * @param {String} pathName path to the file relative to the root
 * of the project file
 * @param {FileType} type the file type instance of this file
 */
var MetaXmlFile = function(options) {
    options = options || {};
    this.project = options.project;
    this.pathName = options.pathName;
    this.type = options.type;
    
    this.API = this.project.getAPI();
    
    this.set = this.API.newTranslationSet(this.project ? this.project.sourceLocale : "zxx-XX");
};

var reUnicodeChar = /\\u([a-fA-F0-9]{1,4})/g;
var reOctalChar = /\\([0-8]{1,3})/g;

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language. This includes
 * unescaping both special and Unicode characters.
 *
 * @static
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
MetaXmlFile.unescapeString = function(string) {
    var unescaped = string;

    while ((match = reUnicodeChar.exec(unescaped))) {
        if (match && match.length > 1) {
            var value = parseInt(match[1], 16);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reUnicodeChar.lastIndex = 0;
        }
    }

    while ((match = reOctalChar.exec(unescaped))) {
        if (match && match.length > 1) {
            var value = parseInt(match[1], 8);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reOctalChar.lastIndex = 0;
        }
    }

    unescaped = unescaped.
        replace(/^\\\\/g, "\\").
        replace(/([^\\])\\\\/g, "$1\\").
        replace(/\\'/g, "'").
        replace(/\\"/g, '"');

    return unescaped;
};

/**
 * Clean the string to make a source string. This means
 * removing leading and trailing white space, compressing
 * whitespaces, and unescaping characters. This changes
 * the string from what it looks like in the source
 * code.
 *
 * @static
 * @param {String} string the string to clean
 * @returns {String} the cleaned string
 */
MetaXmlFile.cleanString = function(string) {
    var unescaped = MetaXmlFile.unescapeString(string);

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
MetaXmlFile.prototype.makeKey = function(source) {
    return this.API.utils.hashKey(MetaXmlFile.cleanString(source));
};

/*
var reGetStringBogusConcatenation1 = new RegExp(/(^R|\WR)B\.getString\s*\(\s*"((\\"|[^"])*)"\s*\+/g);
var reGetStringBogusConcatenation2 = new RegExp(/(^R|\WR)B\.getString\s*\([^\)]*\+\s*"((\\"|[^"])*)"\s*\)/g);
var reGetStringBogusParam = new RegExp(/(^R|\WR)B\.getString\s*\([^"\)]*\)/g);

var reGetString = new RegExp(/(^R|\WR)B\.getString\s*\(\s*"((\\"|[^"])*)"\s*\)/g);
var reGetStringWithId = new RegExp(/(^R|\WR)B\.getString\("((\\"|[^"])*)"\s*,\s*"((\\"|[^"])*)"\)/g);

var reI18nComment = new RegExp("//\\s*i18n\\s*:\\s*(.*)$");
*/

var skipProperties = {
    "_attributes": true,
    "_declaration": true
};

var localizableElements = {
    "label": true,
    "pluralLabel": true
};

/**
 * Walk the node tree looking for properties that have localizable values, then extract
 * them and resourcify them.
 * @private
 */
MetaXmlFile.prototype.walkLayout = function(node) {
    var comment, id, subnodes, subnode, text, autoKey;

    for (var p in node) {
        if (p in localizableElements) {
            subnodes = ilib.isArray(node[p]) ? node[p] : [ node[p] ];
            for (var i = 0; i < subnodes.length; i++) {
                subnode = subnodes[i];
                if (subnode._text) {
                    text = subnode._text.trim();
                    if (text.length) {
                        if (subnode._attributes) {
                            comment = subnode._attributes["x-i18n"];
                            id = subnode._attributes["x-id"];
                        }
                        logger.trace("Found resource " + p + " with string " + subnode + " and comment " + comment);
                        if (!this.API.utils.isDNT(comment)) {
                            var key = id;
                            autoKey = false;
                            if (!key) {
                                key = this.makeKey(text);
                                autoKey = true;
                            }
                            var res = this.API.newResource({
                                datatype: this.type.datatype,
                                resType: "string",
                                key: key,
                                source: text,
                                pathName: this.pathName,
                                sourceLocale: this.locale || this.sourceLocale,
                                project: this.project.getProjectId(),
                                autoKey: autoKey,
                                comment: comment,
                                dnt: this.API.utils.isDNT(comment),
                                datatype: this.type.datatype,
                                index: this.resourceIndex++
                            });
                            this.set.add(res);
                            this.dirty = true;
                        }
                    }
                } else {
                    this.walkLayout(subnode);
                }
            }
        } else if (typeof(node[p]) === "object" && !(p in skipProperties)) {
            this.walkLayout(node[p]);
        }
    }
};

/**
 * Parse the data string looking for the localizable strings and add them to the
 * project's translation set.
 * @param {String} data the string to parse
 */
MetaXmlFile.prototype.parse = function(data) {
    logger.debug("Extracting strings from " + this.pathName);

    this.xml = data;
    this.contents = xmljs.xml2js(data, {
        trim: false,
        nativeTypeAttribute: true,
        compact: true
    });
    this.resourceIndex = 0;

    this.walkLayout(this.contents);
};

/**
 * Extract all the localizable strings from the meta xml file and add them to the
 * project's translation set.
 */
MetaXmlFile.prototype.extract = function() {
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
 * Return the set of resources found in the current MetaXml file.
 *
 * @returns {TranslationSet} The set of resources found in the
 * current MetaXml file.
 */
MetaXmlFile.prototype.getTranslationSet = function() {
    return this.set;
}

//we don't localize or write metaxml source files
MetaXmlFile.prototype.localize = function() {};
MetaXmlFile.prototype.write = function() {};

module.exports = MetaXmlFile;
