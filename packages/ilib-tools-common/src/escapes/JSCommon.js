/*
 * JSCommon.js - common functions between JS and JSON that unescape strings
 *
 * Copyright © 2025 JEDLSoft
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

import IString from 'ilib-istring';

var reUnicodeBMPChar = /\\u([a-fA-F0-9]{1,4})/g;
var reUnicodeAstralPlaneChar = /\\u\{([a-fA-F0-9]{1,5})\}/g;
var reHexadecimalChar = /\\x([a-fA-F0-9]{1,2})/g;
var reOctalChar = /\\([0-7]{1,3})/g;

/**
 * Unescape a string that has sequences like \uXXXX
 * @param {string} string the string to unescape
 * @returns {string} the unescaped string
 * @static
 */
export function escapeU(string) {
    let unescaped = string;
    let match;

    while ((match = reUnicodeBMPChar.exec(unescaped))) {
        if (match && match.length > 1) {
            const value = parseInt(match[1], 16);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reUnicodeBMPChar.lastIndex = 0;
        }
    }

    return unescaped;
};

export function escapeUBrackets(string) {
    let unescaped = string;
    let match;

    while ((match = reUnicodeAstralPlaneChar.exec(unescaped))) {
        if (match && match.length > 1) {
            const value = parseInt(match[1], 16);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reUnicodeAstralPlaneChar.lastIndex = 0;
        }
    }

    return unescaped;
};

export function escapeHex(string) {
    let unescaped = string;
    let match;

    while ((match = reHexadecimalChar.exec(unescaped))) {
        if (match && match.length > 1) {
            const value = parseInt(match[1], 16);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reHexadecimalChar.lastIndex = 0;
        }
    }

    return unescaped;
};

export function escapeOctal(string) {
    let unescaped = string;
    let match;

    while ((match = reOctalChar.exec(unescaped))) {
        if (match && match.length > 1) {
            const value = parseInt(match[1], 8);
            unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
            reOctalChar.lastIndex = 0;
        }
    }

    return unescaped;
};

const jsRegexes = {
    "unescape": {
        "\\\\\\\\n": "",                 // line continuation
        "\\\\\\n": "",                   // line continuation
        "^\\\\\\\\": "\\",               // unescape backslashes
        "([^\\\\])\\\\\\\\": "$1\\",
        "^\\\\'": "'",                   // unescape quotes
        "([^\\\\])\\\\'": "$1'",
        '^\\\\"': '"',
        '([^\\\\])\\\\"': '$1"',
        "\\\\0": "\0",
        "\\\\b": "\b",
        "\\\\f": "\f",
        "\\\\n": "\n",
        "\\\\r": "\r",
        "\\\\t": "\t",
        "\\\\v": "\v"
    },
    "escape": {
        "\\\\": "\\\\",
        "'": "\\'",
        '"': '\\"',
        "\\0": "\\0",
        "\x08": "\\b",
        "\\f": "\\f",
        "\\n": "\\n",
        "\\r": "\\r",
        "\\t": "\\t",
        "\\v": "\\v",
    }
};

export function escapeJS(string) {
    let escaped = string;

    for (const [key, value] of Object.entries(jsRegexes.escape)) {
        escaped = escaped.replace(new RegExp(key, "g"), value);
    }

    return escaped;
}

export function unescapeJS(string) {
    let unescaped = string;

    for (const [key, value] of Object.entries(jsRegexes.unescape)) {
        unescaped = unescaped.replace(new RegExp(key, "g"), value);
    }

    return unescaped;
}