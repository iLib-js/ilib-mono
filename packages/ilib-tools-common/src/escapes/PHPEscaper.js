/*
 * PHPEscaper.js - class that escapes and unescapes strings in PHP
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

import Escaper from '../Escaper.js';
import {
    escapeUnicodeWithBracketsOnly,
    escapeHex,
    escapeRules,
    unescapeRules,
    unescapeHex,
    unescapeUnicodeWithBrackets
} from './EscapeCommon.js';

var reUnicodeChar = /\\u([a-fA-F0-9]{1,6})/g;
var reOctalChar = /\\([0-8]{1,3})/g;

const validStyles = new Set([
    "php",           // defaults to double-quoted strings
    "php-double",    // double-quoted strings (default)
    "php-single",    // single-quoted strings
    "php-heredoc",   // heredoc strings
    "php-nowdoc"     // nowdoc strings
]);

const phpRegexes = {
    "php-double": {
        "unescape": {
            "^\\\\\\\\": "\\",               // unescape backslashes
            "([^\\\\])\\\\\\\\": "$1\\",     // unescape backslashes
            '^\\\\"': '"',                   // unescape double quotes only, not single
            '([^\\\\])\\\\"': '$1"',         // unescape double quotes only, not single
            "\\\\\\$": "$",
            "\\\\n": "\n",
            "\\\\r": "\r",
            "\\\\t": "\t",
            "\\\\e": "\u001B",
            "\\\\f": "\f",
            "\\\\v": "\v"
        },
        "escape": {
            "^\\\\": "\\\\",
            "([^\\\\])\\\\": "$1\\\\\\",
            '^"': '\\"',
            '([^\\\\])"': '$1\\"',
            "\\$": "\\$",
            "\\n": "\\n",
            "\\r": "\\r",
            "\\t": "\\t",
            "\u001B": "\\e",
            "\\f": "\\f",
            "\\v": "\\v"
        }
    },
    "php-single": {
        "unescape": {
            "^\\\\'": "'",                   // unescape quotes
            "([^\\\\])\\\\'": "$1'"
        },
        "escape": {
            "'": "\\'"
        }
    }
};

/**
 * @class Escaper for PHP
 * @extends Escaper
 */
class PHPEscaper extends Escaper {
    /**
     * Can support the following styles:
     * - php (default): double-quoted strings
     * - php-double: double-quoted strings
     * - php-single: single-quoted strings
     * - php-heredoc: heredoc strings
     * - php-nowdoc: nowdoc strings
     *
     * @param {string} style the style to use for escaping
     * @constructor
     * @throws {Error} if the style is not supported
     */
    constructor(style) {
        super(style);
        this.description = "Escapes and unescapes strings in PHP";
        if (!validStyles.has(style)) {
            throw new Error(`invalid php escape style ${style}`);
        }
        if (this.style === "php") {
            // use the double-quoted style by default
            this.style = "php-double";
        }
    }

    /**
     * @override
     */
    escape(string) {
        let escaped = string;

        escaped = escapeRules(escaped, phpRegexes[this.style]);
        if (this.style === "php-double") {
            escaped = escapeHex(escaped);
            escaped = escapeUnicodeWithBracketsOnly(escaped);
        }
        return escaped;
    }

    /**
     * @override
     */
    unescape(string) {
        let unescaped = string;

        if (this.style === "php-double") {
            unescaped = unescapeUnicodeWithBrackets(unescaped);
            unescaped = unescapeHex(unescaped);
        }
        unescaped = unescapeRules(unescaped, phpRegexes[this.style]);
        return unescaped;
    }
}

export default PHPEscaper;