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

import Escaper from './Escaper.js';
import {
    escapeHex,
    escapeRules,
    escapeRegexes,
    escapeUnicodeWithBrackets,
    unescapeRules,
    unescapeHex,
    unescapeUnicodeWithBrackets
} from './EscapeCommon.js';

const validStyles = new Set([
    "php",           // defaults to double-quoted strings
    "php-double",    // double-quoted strings (default)
    "php-single",    // single-quoted strings
    "php-heredoc",   // heredoc strings
    "php-nowdoc"     // nowdoc strings
]);

/**
 * @class Escaper for PHP
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
        if (!validStyles.has(style)) {
            throw new Error(`invalid php escape style ${style}`);
        }
        if (this.style === "php") {
            // use the double-quoted style by default
            this.style = "php-double";
        }
        this.name = "php-escaper";
        this.description = "Escapes and unescapes various types of strings in PHP";
    }

    /**
     * @override
     */
    escape(string) {
        let escaped = string;

        escaped = escapeRules(escaped, escapeRegexes[this.style]);
        if (this.style === "php-double" || this.style === "php-heredoc") {
            escaped = escapeHex(escaped);
            escaped = escapeUnicodeWithBrackets(escaped);
        }
        return escaped;
    }

    /**
     * @override
     */
    unescape(string) {
        let unescaped = string;

        if (this.style === "php-double" || this.style === "php-heredoc") {
            unescaped = unescapeUnicodeWithBrackets(unescaped);
            unescaped = unescapeHex(unescaped);
        }
        unescaped = unescapeRules(unescaped, escapeRegexes[this.style]);
        return unescaped;
    }
}

export default PHPEscaper;