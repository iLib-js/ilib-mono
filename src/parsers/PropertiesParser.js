/*
 * PropertiesParser.js - Parser for plain Javascript files
 *
 * Copyright © 2023 Box, Inc.
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

import fs from 'fs';

import { isSpace } from 'ilib-ctype';
import IString from 'ilib-istring';
import Locale from 'ilib-locale';

import { Parser, IntermediateRepresentation } from 'i18nlint-common';
import { ResourceString, parsePath } from 'ilib-tools-common';

function skipLine(line) {
    if (!line || !line.length) return true;
    let i = 0;
    while (isSpace(line[i]) && i < line.length) i++;
    if (i >= line.length || line[i] === '#' || line[i] === "!") return true;
    return false;
}

const singleLineRe = /^\s*((\\\s|\S+)+)\s*[=:]\s*(.*)/;
const commentRe = /\s*[#!]\s*(.*)$/;

var reUnicodeChar = /\\u([a-fA-F0-9]{1,4})/g;

/**
 * Unescape the string to make the same string that would be
 * in memory in the target programming language. This includes
 * unescaping both special and Unicode characters.
 *
 * @private
 * @param {String} string the string to unescape
 * @returns {String} the unescaped string
 */
function unescapeString(string) {
    let match, unescaped = string;

    while ((match = reUnicodeChar.exec(unescaped))) {
        if (match && match.length > 1) {
            var value = parseInt(match[1], 16);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reUnicodeChar.lastIndex = 0;
        }
    }

    unescaped = unescaped.
        replace(/^\\\\/g, "\\").
        replace(/\\([^\\])/g, "$1").
        replace(/([^\\])\\\\/g, "$1\\").
        replace(/\\'/g, "'").
        replace(/\\"/g, '"');

    return unescaped;
};

const nullLogger = {
    error: (s) => {},
    warn: (s) => {},
    info: (s) => {},
    debug: (s) => {},
    trace: (s) => {},
};

/**
 * @class Parser for Java style properties files as used with react-intl.
 */
class PropertiesParser extends Parser {
    /**
     * Construct a new plugin.
     * @constructor
     */
    constructor(options = {}) {
        super(options);

        this.sourceLocale = options.sourceLocale;
        this.logger = options.getLogger ? options.getLogger("ilib-lint.plugin.propertiesParser") : nullLogger;

        this.extensions = [ "properties" ];
        this.name = "properties";
        this.description = "A parser for properties files.";

        if (!options.filePath) return;

        // Now figure out if we were given a source or a target properties file
        // If it was a source, just read it. If it was a target, try to figure
        // out what the source was, and then read that as well.

        let prefix;
        let locale = new Locale(this.sourceLocale);
        let fileTemplate = "[dir]/[basename]_[locale].properties";
        let parts = parsePath(fileTemplate, options.filePath);

        if (parts.locale?.length) {
            if (parts.locale === this.sourceLocale || parts.language === locale.getLanguage()) {
                this.sourcePath = options.filePath;
            } else {
                this.path = options.filePath;
                this.targetLocale = parts.locale;
                prefix = `${parts.dir}/${parts.basename}_`;
            }
        } else {
            // try again with no basename
            fileTemplate = "[dir]/[locale].properties";
            parts = parsePath(fileTemplate, options.filePath);

            if (parts.locale?.length) {
                if (parts.locale === this.sourceLocale || parts.language === locale.getLanguage()) {
                    this.sourcePath = options.filePath;
                } else {
                    this.path = options.filePath;
                    this.targetLocale = parts.locale;
                    prefix = `${parts.dir}/`;
                }
            } else {
                // try one last time, but this time without the locale. (ie. this is a source file)
                fileTemplate = "[dir]/[basename].properties";
                parts = parsePath(fileTemplate, options.filePath);

                this.sourcePath = options.filePath;
            }
        }

        if (this.targetLocale && !this.sourcePath) {
            // This is a translation file. Now we need to guess what the path
            // to the source file is by going up the locale hierarchy:
            this.sourcePath = `${prefix}${this.sourceLocale}.properties`;
            if (!fs.existsSync(this.sourcePath)) {
                this.sourcePath = `${prefix}${locale.getLangSpec()}.properties`;
                if (!fs.existsSync(this.sourcePath)) {
                    this.sourcePath = `${prefix}${locale.getLanguage()}.properties`;
                    if (!fs.existsSync(this.sourcePath)) {
                        this.sourcePath = `${parts.dir}/${parts.basename}.properties`;
                        if (!fs.existsSync(this.sourcePath)) {
                            // no source strings available! I guess we have to produce target-only
                            // resources
                            this.logger.warn(`Could not find source strings for target file ${this.path}`);
                            this.sourcePath = undefined;
                        }
                    }
                }
            }
        } // else this is a source file, so just read it as such and produce source-only resources
    }

    /**
     * @private
     */
    parseString(string) {
        if (!string) return {};

        const lines = string.split(/\n/g);
        let id, match, match2, source, comment = "";
        let strings = {};

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (skipLine(line)) {
                // any comments for the next line?
                commentRe.lastIndex = 0;
                match2 = commentRe.exec(line);
                if (match2 && match2[1]) {
                    comment += match2[1];
                }
            } else {
                singleLineRe.lastIndex = 0;
                match = singleLineRe.exec(line);
                if (match) {
                    id = unescapeString(match[1]);
                    source = match[3];
                    commentRe.lastIndex = 0;
                    match2 = commentRe.exec(source);
                    if (match2 && match2[1]) {
                        if (comment.length) comment += ' ';
                        comment += match2[1];
                        source = source.substring(0, match2.index);
                    } else {
                        // check for continuation chars. (ie. a backslash at the end of the line)
                        while (source.endsWith("\\") && i < lines.length) {
                            // next line is also part of this same string
                            line = lines[++i];
                            source += '\n' + line;
                        }
                    }
                    strings[id] = {
                        source: unescapeString(source)
                    };
                    if (comment) {
                        strings[id].comment = comment;
                    }
                    comment = ""; // reset for the next string
                }
            }
        }
        return strings;
    }

    /**
     * Parse the current file into an intermediate representation. If the
     * file is a target (translation) file, then also attempt to read the
     * source locale file in order to get complete resources.
     *
     * @returns {Array.<IntermediateRepresentation>} the AST representation
     * of the properties file
     */
    parse() {
        let sourceStrings = {}, targetStrings;
        let res, resources = [];

        if (this.path) {
            const targetData = fs.readFileSync(this.path, "utf-8");
            targetStrings = this.parseString(targetData);
        }

        if (this.sourcePath) {
            const sourceData = fs.readFileSync(this.sourcePath, "utf-8");
            sourceStrings = this.parseString(sourceData);
        }

        if (targetStrings) {
            for (const id in targetStrings) {
                if (sourceStrings[id]) {
                    res = new ResourceString({
                        key: id,
                        sourceLocale: this.sourceLocale,
                        source: unescapeString(sourceStrings[id].source),
                        targetLocale: this.targetLocale,
                        target: unescapeString(targetStrings[id].source),
                        pathName: this.path,
                        state: "new",
                        comment: sourceStrings[id].comment,
                        datatype: "properties"
                    });
                } else {
                    // target-only resources?
                    res = new ResourceString({
                        key: id,
                        sourceLocale: this.sourceLocale,
                        targetLocale: this.targetLocale,
                        target: unescapeString(targetStrings[id].source),
                        pathName: this.path,
                        state: "new",
                        comment: targetStrings[id].comment,
                        datatype: "properties"
                    });
                }
                resources.push(res);
            }
        } else {
            // this is a source file in the first place, so produce some
            // source-only resources
            for (const id in sourceStrings) {
                const res = new ResourceString({
                    key: id,
                    sourceLocale: this.sourceLocale,
                    source: unescapeString(sourceStrings[id].source),
                    pathName: this.sourcePath,
                    state: "new",
                    comment: sourceStrings[id].comment,
                    datatype: "properties"
                });
                resources.push(res);
            }
        }

        return [new IntermediateRepresentation({
            type: "resource",
            ir: resources,
            filePath: this.path || this.sourcePath
        })];
    }

    getExtensions() {
        return this.extensions;
    }
};

export default PropertiesParser;
