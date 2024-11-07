/*
 * PropertiesParser.js - Parser for plain Javascript files
 *
 * Copyright © 2023-2024 Box, Inc.
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

import IString from 'ilib-istring';
import Locale from 'ilib-locale';

import { Parser, IntermediateRepresentation } from 'ilib-lint-common';
import { ResourceString, parsePath } from 'ilib-tools-common';

function skipLine(line) {
    if (!line || !line.length) return true;
    return /^\s*[#!]/.test(line);
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
 * @class Parser for Java style properties files. By default, this parser
 * will parse .properties files. If you put your properties in a file with
 * a different file name extension, you can use the name "PropertiesParser"
 * in your filetype parsers array to use this parser. N.B. This parser does
 * not parse new-style xml properties files, only the older "a = b" style.
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
        this.name = "PropertiesParser";
        this.description = "A parser for properties files.";
        this.type = "resource";
    }

    /**
     * See if the current source file contains target strings or source
     * strings. If it contains target strings, check if there is a file
     * beside it that contains source strings. That way, we can read both
     * files and create whole Resource instances instead of target-only
     * ones. If the locale of the file is already a source locale, we
     * should produce source-only Resource instances.
     *
     * @private
     * @param {SourceFile} sourceFile the properties file to check
     * @returns {{sourcePath: string, sourceLocale: string, targetPath: string, targetLocale: string}} information
     * about the given source file
     */
    guessLocaleAndFindSourcePath(sourceFile) {
        let prefix;
        const filePath = sourceFile.getPath();
        let locale = new Locale(sourceFile.sourceLocale);
        let fileTemplate = "[dir]/[basename]_[locale].properties";
        let parts = parsePath(fileTemplate, filePath);
        let returnValue = {};

        if (parts.locale?.length) {
            returnValue.sourceLocale = sourceFile.sourceLocale ?? this.sourceLocale;
            if (parts.locale === returnValue.sourceLocale || parts.language === locale.getLanguage()) {
                returnValue.sourcePath = filePath;
            } else {
                returnValue.targetPath = filePath;
                returnValue.targetLocale = parts.locale;
                prefix = `${parts.dir}/${parts.basename}_`;
            }
        } else {
            // try again with no basename
            fileTemplate = "[dir]/[locale].properties";
            parts = parsePath(fileTemplate, filePath);

            if (parts.locale?.length) {
                returnValue.sourceLocale = sourceFile.sourceLocale ?? this.sourceLocale;
                if (parts.locale === returnValue.sourceLocale || parts.language === locale.getLanguage()) {
                    returnValue.sourcePath = filePath;
                } else {
                    returnValue.targetPath = filePath;
                    returnValue.targetLocale = parts.locale;
                    prefix = `${parts.dir}/`;
                }
            } else {
                // else try one last time, but this time without the locale. (ie. this is a source file)
                fileTemplate = "[dir]/[basename].properties";
                parts = parsePath(fileTemplate, filePath);

                if (parts.basename) {
                    returnValue.sourcePath = filePath;
                    returnValue.sourceLocale = sourceFile.sourceLocale ?? this.sourceLocale;
                }
            }
        }

        if (returnValue.targetLocale && !returnValue.sourcePath) {
            // This is a translation file. Now we need to guess what the path
            // to the source file is by going up the locale hierarchy:
            returnValue.sourcePath = `${prefix}${returnValue.sourceLocale}.properties`;
            if (!fs.existsSync(returnValue.sourcePath)) {
                returnValue.sourcePath = `${prefix}${locale.getLangSpec()}.properties`;
                if (!fs.existsSync(returnValue.sourcePath)) {
                    returnValue.sourcePath = `${prefix}${locale.getLanguage()}.properties`;
                    if (!fs.existsSync(returnValue.sourcePath)) {
                        returnValue.sourcePath = `${parts.dir}/${parts.basename}.properties`;
                        if (!fs.existsSync(returnValue.sourcePath)) {
                            // no source strings available! I guess we have to produce target-only
                            // resources
                            this.logger.warn(`Could not find source strings for target file ${returnValue.path}`);
                            returnValue.sourcePath = undefined;
                            returnValue.sourceLocale = undefined;
                        }
                    }
                }
            }
        } // else this is a source file, so just read it as such and produce source-only resources

        return returnValue;
    }

    /**
     * @private
     */
    parseString(string) {
        if (!string) return {};

        const lines = string.split(/\r\n|\r|\n/g);
        let id, lineMatch, commentMatch, source, comment = "";
        let strings = {};

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (skipLine(line)) {
                // any comments for the next line?
                commentRe.lastIndex = 0;
                commentMatch = commentRe.exec(line);
                if (commentMatch && commentMatch[1]) {
                    if (comment.length) {
                        comment += ' ';
                    }
                    comment += commentMatch[1];
                }
            } else {
                singleLineRe.lastIndex = 0;
                lineMatch = singleLineRe.exec(line);
                if (lineMatch) {
                    id = unescapeString(lineMatch[1]);
                    source = lineMatch[3];
                    // check for continuation chars. (ie. a backslash at the end of the line)
                    while (source.endsWith("\\") && i < lines.length) {
                        // next line is also part of this same string
                        line = lines[++i];
                        source += '\n' + line;
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
     * @param {SourceFile} sourceFile the source file to parse
     * @returns {Array.<IntermediateRepresentation>} the AST representation
     * of the properties file
     */
    parse(sourceFile) {
        let sourceStrings, targetStrings;
        let res, resources = [];

        // Now figure out if we were given a source or a target properties file
        // If it was a source, just read it. If it was a target, try to figure
        // out what the source was, and then read that as well.
        const pathInfo = this.guessLocaleAndFindSourcePath(sourceFile);

        const strings = this.parseString(sourceFile.getContent());

        if (pathInfo.sourcePath) {
            if (!pathInfo.targetPath) {
                // source-only file
                sourceStrings = strings;
            } else {
                // source and target are both available
                const sourceData = fs.readFileSync(pathInfo.sourcePath, "utf-8");
                sourceStrings = this.parseString(sourceData);
                targetStrings = strings;
            }
        } else {
            // target-only file
            targetStrings = strings;
        }

        if (targetStrings) {
            for (const id in targetStrings) {
                const opts = {
                    key: id,
                    sourceLocale: pathInfo.sourceLocale,
                    targetLocale: pathInfo.targetLocale,
                    target: unescapeString(targetStrings[id].source),
                    pathName: pathInfo.targetPath,
                    state: "new",
                    datatype: "properties"
                };
                if (sourceStrings?.[id]) {
                    opts.source = unescapeString(sourceStrings[id].source);
                }
                opts.comment = sourceStrings?.[id]?.comment ?? targetStrings[id].comment;
                res = new ResourceString(opts);
                resources.push(res);
            }
        } else {
            // this is a source file in the first place, so produce some
            // source-only resources
            for (const id in sourceStrings) {
                const res = new ResourceString({
                    key: id,
                    sourceLocale: pathInfo.sourceLocale,
                    source: unescapeString(sourceStrings[id].source),
                    pathName: pathInfo.sourcePath,
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
            sourceFile
        })];
    }

    getExtensions() {
        return this.extensions;
    }
};

export default PropertiesParser;
