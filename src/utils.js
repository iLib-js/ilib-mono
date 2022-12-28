/*
 * utils.js - utility functions to support the other code
 *
 * Copyright © 2022 JEDLSoft
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

import path from 'node:path';
import Locale from 'ilib-locale';

import { isAlnum, isIdeo } from 'ilib-ctype';

/**
 * Clean a string for matching against other strings by removing
 * differences that are inconsequential for translation.
 *
 * @param {String} str string to clean
 * @returns {String} the cleaned string
 */
export function cleanString(str) {
    if (typeof(str) !== 'string') {
        return undefined;
    }
    return str.toLowerCase().
        replace(/\\n/g, " ").
        replace(/\\t/g, " ").
        replace(/\\/g, "").
        replace(/\s+/g, " ").
        trim().
        replace(/&apos;/g, "'").
        replace(/&quot;/g, '"').
        replace(/&lt;/g, "<").
        replace(/&gt;/g, ">").
        replace(/&amp;/g, "&").
        replace(/’/g, "'");
};

/**
 * Is an empty object or not
 * @param {Object} obj object to test
 * @returns {Boolean} true if there are no properties, false otherwise
 */
export function isEmpty(obj) {
    let prop = undefined;

    if (!obj) {
        return true;
    }

    for (prop in obj) {
        if (prop && obj[prop]) {
            return false;
        }
    }
    return true;
};

/**
 * Format a file path using a path template and parameters.
 *
 * This function is used to generate an output file path for a given
 * source file path and a locale specifier.
 * The template replaces strings in square brackets with special values,
 * and keeps any characters intact that are not in square brackets.
 * This function recognizes and replaces the following strings in
 * templates:
 * - [dir] the original directory where the source file
 *   came from. This is given as a directory that is relative
 *   to the root of the project. eg. "foo/bar/strings.json" -> "foo/bar"
 * - [filename] the file name of the source file.
 *   eg. "foo/bar/strings.json" -> "strings.json"
 * - [basename] the basename of the source file without any extension
 *   eg. "foo/bar/strings.json" -> "strings"
 * - [extension] the extension part of the file name of the source file.
 *   etc. "foo/bar/strings.json" -> "json"
 * - [locale] the full BCP-47 locale specification for the target locale
 *   eg. "zh-Hans-CN" -> "zh-Hans-CN"
 * - [language] the language portion of the full locale
 *   eg. "zh-Hans-CN" -> "zh"
 * - [script] the script portion of the full locale
 *   eg. "zh-Hans-CN" -> "Hans"
 * - [region] the region portion of the full locale
 *   eg. "zh-Hans-CN" -> "CN"
 * - [localeDir] the full locale where each portion of the locale
 *   is a directory in this order: [langage], [script], [region].
 *   eg, "zh-Hans-CN" -> "zh/Hans/CN", but "en" -> "en".
 * - [localeUnder] the full BCP-47 locale specification, but using
 *   underscores to separate the locale parts instead of dashes.
 *   eg. "zh-Hans-CN" -> "zh_Hans_CN"
 * - [localeLower] the full BCP-47 locale specification, but makes
 *   all locale parts lowercased.
 *   eg. "zh-Hans-CN" -> "zh-hans-cn"
 *
 * The parameters may include the following:
 * - sourcepath - the path to the source file, relative to the root of
 *   the project
 * - locale - the locale for the output file path
 *
 * @param {string} template the string to escape
 * @param {Object} parameters the parameters to format into the template
 * @returns {string} the formatted file path
 */
export function formatPath(template, parameters) {
    const pathname = parameters.sourcepath || "";
    const locale = parameters.locale || "en";
    const l = new Locale(locale);
    let output = "";
    let base;

    for (let i = 0; i < template.length; i++) {
        if ( template[i] !== '[' ) {
            output += template[i];
        } else {
            let start = ++i;
            while (i < template.length && template[i] !== ']') {
                i++;
            }
            const keyword = template.substring(start, i);
            switch (keyword) {
                case 'dir':
                    output += path.dirname(pathname);
                    break;
                case 'filename':
                    output += path.basename(pathname);
                    break;
                case 'extension':
                    base = path.basename(pathname);
                    output += base.indexOf('.') > -1 ? base.substring(base.lastIndexOf('.')+1) : "";
                    break;
                case 'basename':
                    base = path.basename(pathname);
                    output += base.substring(0, base.lastIndexOf('.'));
                    break;
                default:
                case 'locale':
                    output += locale;
                    break;
                case 'language':
                    output += l.getLanguage() || "";
                    break;
                case 'script':
                    output += l.getScript() || "";
                    break;
                case 'region':
                    output += l.getRegion() || "";
                    break;
                case 'localeDir':
                    output += l.getSpec().replace(/-/g, '/');
                    break;
                case 'localeUnder':
                    output += l.getSpec().replace(/-/g, '_');
                    break;
                case 'localeLower':
                    output += l.getSpec().toLowerCase();
                    break;
            }
        }
    }

    return path.normalize(output);
};

const matchExprs = {
    "dir": {
        regex: ".*?",
        brackets: 0,
    },
    "basename": {
        regex: ".*?",
        brackets: 0,
    },
    "locale": {
        regex: "([a-z][a-z][a-z]?)(-([A-Z][a-z][a-z][a-z]))?(-([A-Z][A-Z]|[0-9][0-9][0-9]))?",
        brackets: 5,
        groups: {
            language: 1,
            script: 3,
            region: 5
        }
    },
    "language": {
        regex: "([a-z][a-z][a-z]?)",
        brackets: 1,
        groups: {
            language: 1
        }
    },
    "script": {
        regex: "([A-Z][a-z][a-z][a-z])",
        brackets: 1,
        groups: {
            script: 1
        }
    },
    "region": {
        regex: "([A-Z][A-Z]|[0-9][0-9][0-9])",
        brackets: 1,
        groups: {
            region: 1
        }
    },
    "localeDir": {
        regex: "([a-z][a-z][a-z]?)(/([A-Z][a-z][a-z][a-z]))?(/([A-Z][A-Z]|[0-9][0-9][0-9]))?",
        brackets: 5,
        groups: {
            language: 1,
            script: 3,
            region: 5
        }
    },
    "localeUnder": {
        regex: "([a-z][a-z][a-z]?)(_([A-Z][a-z][a-z][a-z]))?(_([A-Z][A-Z]|[0-9][0-9][0-9]))?",
        brackets: 5,
        groups: {
            language: 1,
            script: 3,
            region: 5
        }
    },
    "localeLower": {
        regex: "([a-z][a-z][a-z]?)(-([a-z][a-z][a-z][a-z]))?(-([a-z][a-z]|[0-9][0-9][0-9]))?",
        brackets: 5,
        groups: {
            language: 1,
            script: 3,
            region: 5
        }
    }
};

/**
 * Return a locale encoded in the path using template to parse that path.
 * See {#formatPath} for the full description of the syntax of the template.
 * @param {String} template template for the output file
 * @param {String} pathname path to the source file
 * @returns {String} the locale within the path, or undefined if no locale found
 */
export function getLocaleFromPath(template, pathname) {
    let regex = "";
    let matchGroups = {};
    let totalBrackets = 0;
    let base;

    if (!template) {
        template = defaultMappings["**/*.json"].template;
    }

    for (let i = 0; i < template.length; i++) {
        if ( template[i] !== '[' ) {
            regex += template[i];
        } else {
            let start = ++i;
            while (i < template.length && template[i] !== ']') {
                i++;
            }
            const keyword = template.substring(start, i);
            switch (keyword) {
                case 'filename':
                    regex += path.basename(pathname);
                    break;
                case 'extension':
                    base = path.basename(pathname);
                    regex += base.substring(base.lastIndexOf('.')+1);
                    break;
                default:
                    if (!matchExprs[keyword]) {
                        logger.warning("Warning: template contains unknown substitution parameter " + keyword);
                        return "";
                    }
                    regex += matchExprs[keyword].regex;
                    for (let prop in matchExprs[keyword].groups) {
                        matchGroups[prop] = totalBrackets + matchExprs[keyword].groups[prop];
                    }
                    totalBrackets += matchExprs[keyword].brackets;
                    break;
            }
        }
    }

    const re = new RegExp(regex, "u");
    let match;

    if ((match = re.exec(pathname)) !== null) {
        let groups = {};
        let found = false;
        for (let groupName in matchGroups) {
            if (match[matchGroups[groupName]]) {
                groups[groupName] = match[matchGroups[groupName]];
                found = true;
            }
        }
        if (found) {
            // TODO: Remove script transformation once similar change is implemented in iLib/Locale class.
            if (groups.script && groups.script.length) {
                groups.script = groups.script.charAt(0).toUpperCase() + groups.script.slice(1).toLowerCase();
            }

            const l = new Locale(groups.language, groups.region, undefined, groups.script);
            return l.getSpec();
        }
    }

    return "";
};

export function makeDirs(path) {
    const parts = path.split(/[\\\/]/);

    for (let i = 1; i <= parts.length; i++) {
        const p = parts.slice(0, i).join("/");
        if (p && p.length > 0 && !fs.existsSync(p)) {
            fs.mkdirSync(p);
        }
    }
};

/**
 * Return true if the string still contains some text after removing all HTML tags and entities.
 * @param {string} str the string to check
 * @returns {boolean} true if there is text left over, and false otherwise
 */
export function containsActualText(str) {
    // remove the html and entities first
    const cleaned = str.replace(/<("(\\"|[^"])*"|'(\\'|[^'])*'|[^>])*>/g, "").replace(/&[a-zA-Z]+;/g, "");

    for (let i = 0; i < cleaned.length; i++) {
        const c = cleaned.charAt(i);
        if (isAlnum(c) || isIdeo(c)) return true;
    }
    return false;
};

function isPrimitive(type) {
    return ["boolean", "number", "integer", "string"].indexOf(type) > -1;
}

/**
 * Recursively visit every node in an object and call the visitor on any
 * primitive values.
 * @param {*} object any object, arrary, or primitive
 * @param {Function(*)} visitor function to call on any primitive
 * @returns {*} the same type as the original object, but with every
 * primitive processed by the visitor function
 */
export function objectMap(object, visitor) {
    if (!object) return object;
    if (isPrimitive(typeof(object))) {
        return visitor(object);
    } else if (Array.isArray(object)) {
        return object.map(item => {
            return objectMap(item, visitor);
        });
    } else {
        const ret = {};
        for (let prop in object) {
            if (object.hasOwnProperty(prop)) {
                ret[prop] = objectMap(object[prop], visitor);
            }
        }
        return ret;
    }
};
