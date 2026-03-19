/*
 * utils.js - utility functions to support the other code
 *
 * Copyright © 2022-2023, 2025-2026 JEDLSoft
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
import path from 'path';
import Locale from 'ilib-locale';
import log4js from '@log4js-node/log4js-api';

import { isAlnum, isIdeo } from 'ilib-ctype';

import pluralCategories from './pluralCategories.js';

const logger = log4js.getLogger('tools-common.utils');

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
 * Format a string template with locale-related parameters.
 *
 * This function substitutes locale-related placeholders in a template string
 * without treating the string as a file path (no path normalization).
 * This is useful for formatting headers, footers, or other strings that
 * contain locale placeholders but should not be treated as file paths.
 *
 * This function recognizes and replaces the following strings in
 * templates:
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
 * Unknown keywords are preserved in the output unchanged.
 *
 * @param {string} template the template string to format
 * @param {string|Object} locale the locale specifier, either as a string
 *   or as a Locale object
 * @returns {string} the formatted string with locale placeholders replaced
 */
export function formatLocaleParams(template, locale) {
    if (!template) return "";
    const l = typeof locale === 'string' ? new Locale(locale || "en") : locale;
    const localeSpec = l.getSpec();
    let output = "";

    for (let i = 0; i < template.length; i++) {
        if (template[i] !== '[') {
            output += template[i];
        } else {
            let start = ++i;
            while (i < template.length && template[i] !== ']') {
                i++;
            }
            const keyword = template.substring(start, i);
            switch (keyword) {
                case 'locale':
                    output += localeSpec;
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
                    output += localeSpec.replace(/-/g, '/');
                    break;
                case 'localeUnder':
                    output += localeSpec.replace(/-/g, '_');
                    break;
                case 'localeLower':
                    output += localeSpec.toLowerCase();
                    break;
                default:
                    // unknown keyword, preserve it unchanged
                    output += '[' + keyword + ']';
                    break;
            }
        }
    }
    return output;
}

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
 * @param {string} template the path template string
 * @param {Object} parameters an object containing:
 * @param {string} parameters.sourcepath the path to the source file, relative to the
 *     root of the project (used when path parts are not provided)
 * @param {string} parameters.locale the locale for the output file path
 * @param {string} parameters.resourceDir optional resource directory to substitute
 *     for [resourceDir] in the template
 * @param {string} parameters.dir optional pre-parsed directory (e.g. from parsePath)
 * @param {string} parameters.basename optional pre-parsed basename without extension
 * @param {string} parameters.extension optional pre-parsed file extension
 * @param {string} parameters.filename optional pre-parsed filename (basename + extension)
 *     When any of dir, basename, extension, or filename are provided, they are used
 *     instead of deriving from sourcepath. This allows using parsePath output directly.
 * @returns {string} the formatted file path
 */
export function formatPath(template, parameters) {
    const pathname = parameters.sourcepath || "";
    const locale = parameters.locale || "en";
    const resourceDir = parameters.resourceDir || ".";

    // Use pre-parsed path parts when provided (e.g. from parsePath); otherwise derive from sourcepath
    const pathParts = fillPartialPathParts(pathname);
    const dir = parameters.dir ?? pathParts.dir;
    const basename = parameters.basename ?? pathParts.basename;
    const extension = parameters.extension ?? pathParts.extension;
    const filename = parameters.filename ?? [basename, extension].join(".");

    // First, handle locale-related substitutions without path normalization
    let output = formatLocaleParams(template, locale);

    // Now handle path-specific keywords
    output = output.replace(/\[dir\]/g, dir);
    output = output.replace(/\[filename\]/g, filename);
    output = output.replace(/\[resourceDir\]/g, resourceDir);
    output = output.replace(/\[extension\]/g, extension);
    output = output.replace(/\[basename\]/g, basename);

    return path.normalize(output);
};

const matchExprs = {
    "dir": {
        regex: "(.*)",
        brackets: 1,
        groups: {
            dir: 1
        }
    },
    "basename": {
        regex: "(.*?)",
        brackets: 1,
        groups: {
            basename: 1
        }
    },
    "resourceDir": {
        regex: "(.*?)",
        brackets: 1,
        groups: {
            resourceDir: 1
        }
    },
    "extension": {
        regex: "(.*)",
        brackets: 1,
        groups: {
            extension: 1
        }
    },
    "locale": {
        regex: "(([a-z][a-z][a-z]?)(-([A-Z][a-z][a-z][a-z]))?(-([A-Z][A-Z]|[0-9][0-9][0-9]))?)",
        brackets: 6,
        groups: {
            locale: 1,
            language: 2,
            script: 4,
            region: 6
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
        regex: "(([a-z][a-z][a-z]?)(/([A-Z][a-z][a-z][a-z]))?(/([A-Z][A-Z]|[0-9][0-9][0-9]))?)",
        brackets: 6,
        groups: {
            localeDir: 1,
            language: 2,
            script: 4,
            region: 6
        }
    },
    "localeUnder": {
        regex: "(([a-z][a-z][a-z]?)(_([A-Z][a-z][a-z][a-z]))?(_([A-Z][A-Z]|[0-9][0-9][0-9]))?)",
        brackets: 6,
        groups: {
            localeUnder: 1,
            language: 2,
            script: 4,
            region: 6
        }
    },
    "localeLower": {
        regex: "(([a-z][a-z][a-z]?)(-([a-z][a-z][a-z][a-z]))?(-([a-z][a-z]|[0-9][0-9][0-9]))?)",
        brackets: 6,
        groups: {
            localeUnder: 1,
            language: 2,
            script: 4,
            region: 6
        }
    }
};

/**
 * Derive dir, basename, extension from a pathname using path operations.
 * Used when the template does not match so we can still fill path parts.
 *
 * @param {String} pathname the path name
 * @returns {Object} { dir, basename, extension }
 */
function fillPartialPathParts(pathname) {
    if (!pathname) {
        return { dir: ".", basename: "", extension: "" };
    }
    const dir = path.dirname(pathname) || ".";
    const filename = path.basename(pathname);
    const lastDot = filename.lastIndexOf(".");
    const basename = lastDot > -1 ? filename.substring(0, lastDot) : filename;
    const extension = lastDot > -1 ? filename.substring(lastDot + 1) : "";
    return { dir, basename, extension };
}

/**
 * Fill locale, language, script, region from a source locale string using Locale class.
 *
 * @param {String} sourceLocale BCP-47 locale string
 * @returns {Object} { locale, language, script?, region? }
 */
function fillLocalePartsFromSource(sourceLocale) {
    if (!sourceLocale) {
        return {};
    }
    const l = new Locale(sourceLocale);
    const result = {
        locale: l.getSpec(),
        language: l.language || ""
    };
    if (l.script) {
        result.script = l.script;
    }
    if (l.region) {
        result.region = l.region;
    }
    return result;
}

/**
 * Parse a path according to the given template, and return the parts.
 * The parts can be any of the fields mentioned in the {@link formatPath}
 * documentation. If the template does not match, fills dir, basename, extension
 * from the path. When sourceLocale is provided and no locale is in the path,
 * fills locale, language, script, region from the source locale.
 *
 * @param {String} template the ilib template for matching against the path
 * @param {String} pathname the path name to match against the template
 * @param {String} sourceLocale optional; when no locale in path, use this to fill locale parts
 * @returns {Object} an object mapping the fields to their values in the pathname
 */
export function parsePath(template, pathname, sourceLocale) {
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
                    // escape special characters in the filename so they don't have their special meaning in the regex
                    regex += path.basename(pathname || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                    break;
                default:
                    if (!matchExprs[keyword]) {
                        logger.warning("Warning: template contains unknown substitution parameter " + keyword);
                        return "";
                    }
                    // [basename].[extension]: use last dot to split so "foo.en-US.mdx" -> basename="foo.en-US", extension="mdx"
                    if (keyword === "basename" && template[i + 1] === "." && template[i + 2] === "[") {
                        const nextEnd = template.indexOf("]", i + 2);
                        const nextKeyword = nextEnd > -1 ? template.substring(i + 3, nextEnd) : "";
                        if (nextKeyword === "extension") {
                            regex += "(.*)\\.([^.]+)";
                            matchGroups.basename = totalBrackets + 1;
                            matchGroups.extension = totalBrackets + 2;
                            totalBrackets += 2;
                            i = nextEnd;
                            break;
                        }
                    }
                    // [dir]/ is optional when followed by / and another token. Always capture dir so callers
                    // (e.g. PropertiesParser) can build paths. Use (?:()|(.*?)/) so we require the slash when
                    // dir is non-empty - this prevents "test.properties" from matching as locale "est" with dir "test/testfiles/t".
                    // For "./de.po" the empty alternative matches; for "test/testfiles/de-DE.properties" we capture dir.
                    // Do NOT make optional for [basename], [extension], [resourceDir] - that would break path parsing.
                    let optionalDirSlash = false;
                    if (keyword === "dir" && i + 1 < template.length && template[i + 1] === "/" && i + 2 < template.length && template[i + 2] === "[") {
                        const endBracket = template.indexOf("]", i + 2);
                        const nextKeyword = endBracket > -1 ? template.substring(i + 3, endBracket) : "";
                        const optionalDirTokens = ["filename", "locale", "language", "script", "region", "localeDir", "localeUnder", "localeLower"];
                        optionalDirSlash = optionalDirTokens.includes(nextKeyword);
                    }
                    if (keyword === "dir" && optionalDirSlash) {
                        // (?:()|(.*?)/) - empty dir or (.*?)/ (require slash when dir is non-empty)
                        regex += "(?:()|(.*?)/)";
                        matchGroups.dir = totalBrackets + 2; // second group has dir when present
                        totalBrackets += 2;
                        i++;
                    } else {
                        regex += matchExprs[keyword].regex;
                        for (let prop in matchExprs[keyword].groups) {
                            matchGroups[prop] = totalBrackets + matchExprs[keyword].groups[prop];
                        }
                        totalBrackets += matchExprs[keyword].brackets;
                    }
                    break;
            }
        }
    }

    // Anchor at start. If path starts with "./", allow it so template matches the rest (e.g. "./ja/foo.mdx" matches "[language]/[dir]/[filename]").
    const prefix = (pathname && pathname.startsWith("./")) ? "^\\.\\/" : "^";
    const re = new RegExp(prefix + regex, "u");
    const match = re.exec(pathname || "");
    if (match !== null) {
        let groups = {};
        let found = false;
        for (let groupName in matchGroups) {
            const idx = matchGroups[groupName];
            const value = idx < match.length ? match[idx] : undefined;
            // Capture empty only for dir (so "[dir]/[filename]" with "foo.mdx" gives dir "."); optional locale parts stay omitted.
            if (value !== undefined && (value || (groupName === "dir" && value === ""))) {
                groups[groupName] = value === undefined ? "" : value;
                found = true;
            }
        }
        if (groups.dir === "" || (matchGroups.dir && groups.dir === undefined)) {
            groups.dir = ".";
        }
        // When path started with "./", prefix consumed it; put it back into dir so dir is the full path.
        if (pathname && pathname.startsWith("./") && groups.dir !== undefined && groups.dir !== ".") {
            groups.dir = "./" + groups.dir;
        }
        return groups;
    }

    // Template did not match; fill dir, basename, extension from path
    const partial = fillPartialPathParts(pathname || "");
    if (sourceLocale) {
        Object.assign(partial, fillLocalePartsFromSource(sourceLocale));
    }
    return partial;
}

/**
 * Return a locale encoded in the path using template to parse that path.
 * See {#formatPath} for the full description of the syntax of the template.
 * @param {String} template template for the output file
 * @param {String} pathname path to the source file
 * @returns {String} the locale within the path, or undefined if no locale found
 */
export function getLocaleFromPath(template, pathname) {
    const groups = parsePath(template, pathname);

    if (groups.locale || groups.language || groups.script || groups.region ) {
        // TODO: Remove script transformation once similar change is implemented in iLib/Locale class.
        if (groups.script && groups.script.length) {
            groups.script = groups.script.charAt(0).toUpperCase() + groups.script.slice(1).toLowerCase();
        }

        const l = groups.locale ?
            new Locale(groups.locale) :
            new Locale(groups.language, groups.region, undefined, groups.script);

        return l.getSpec();
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

/**
 * Return a standard hash of the given source string.
 *
 * @param {String} source the source string as extracted from the
 * source code, unmodified
 * @returns {String} the hash key
 */
export function hashKey(source) {
    if (!source) return undefined;
    let hash = 0;
    // these two numbers together = 46 bits so it won't blow out the precision of an integer in javascript
    const modulus = 1073741789;  // largest prime number that fits in 30 bits
    const multiple = 65521;      // largest prime that fits in 16 bits, co-prime with the modulus

    // logger.trace("hash starts off at " + hash);

    for (let i = 0; i < source.length; i++) {
        // logger.trace("hash " + hash + " char " + source.charCodeAt(i) + "=" + source.charAt(i));
        hash += source.charCodeAt(i);
        hash *= multiple;
        hash %= modulus;
    }
    const value = "r" + hash;

    // System.out.println("String '" + source + "' hashes to " + value);

    return value;
};

/**
 * A hash containing a list of HTML tags that do not
 * cause a break in a resource string. These tags should
 * be included in the middle of the string.
 */
export const nonBreakingTags = {
    "a": true,
    "abbr": true,
    "b": true,
    "bdi": true,
    "bdo": true,
    "br": true,
    "dfn": true,
    "del": true,
    "em": true,
    "i": true,
    "ins": true,
    "mark": true,
    "ruby": true,
    "rt": true,
    "span": true,
    "strong": true,
    "sub": true,
    "sup": true,
    "time": true,
    "u": true,
    "var": true,
    "wbr": true
};

/**
 * A hash containing a list of HTML tags that are
 * typically self-closing. That is, in HTML4 and earlier,
 * the close tag was not needed for these.
 */
export const selfClosingTags = {
    "area": true,
    "base": true,
    "bdi": true,
    "bdo": true,
    "br": true,
    "embed": true,
    "hr": true,
    "img": true,
    "input": true,
    "link": true,
    "option": true,
    "param": true,
    "source": true,
    "track": true
};

/**
 * A hash containing a list of HTML tags where
 * the text content inside of those tags should be
 * ignored for localization purposes. Instead,
 * those contents should just be copied to the
 * localized file unmodified.
 */
export const ignoreTags = {
    "code": true,
    "output": true,
    "samp": true,
    "script": true,
    "style": true
};

/**
 * List of html5 tags and their attributes that contain localizable strings.
 * The "*" indicates it applies to the given attributes on every tag.
 * Also added ARIA attributes to localize for accessibility. For more details,
 * see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/
 */
export const localizableAttributes = {
    "area": {"alt":true},
    "img": {"alt":true},
    "input": {
        "alt": true,
        "placeholder": true
    },
    "optgroup": {"label":true},
    "option": {"label":true},
    "textarea": {"placeholder":true},
    "track": {"label":true},
    "*": {
        "title": true,
        "aria-braillelabel": true,
        "aria-brailleroledescription": true,
        "aria-description": true,
        "aria-label": true,
        "aria-placeholder": true,
        "aria-roledescription": true,
        "aria-rowindextext": true,
        "aria-valuetext": true
    }
};

// this is for English and many other languages
const defaultPluralCategories = [
    "one",
    "other"
];

/**
 * Return the plural categories for the given language.
 * If there is no entry for the given
 * language, then the default English plural categories are returned.
 *
 * @param {string|undefined} language the ISO 639 language code to get the plural
 * categories for
 * @returns {Array} an array of strings containing the names of the plural categories
 */
export function getLanguagePluralCategories(language) {
    // make sure to get the language only if someone accidentally sends in a full locale
    const locale = new Locale(language);
    const lang = locale.getLanguage() ?? "en";
    return pluralCategories[lang] ?? defaultPluralCategories;
}
