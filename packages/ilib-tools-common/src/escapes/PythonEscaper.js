/*
 * PythonEscaper.js - class that escapes and unescapes strings in Python
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
    escapeUnicode,
    escapeUnicodeExtended,
    escapeHex,
    escapeRules,
    unescapeRules,
    unescapeHex,
    unescapeUnicode,
    unescapeUnicodeExtended,
    escapeRegexes
} from './EscapeCommon.js';

const validStyles = new Set([
    "python",           // defaults to double-quoted strings
    "python-double",    // double-quoted strings (default)
    "python-single",    // single-quoted strings
    "python-heredoc",   // heredoc strings
    "python-nowdoc"     // nowdoc strings
]);

/**
 * @class Escaper for Python
 * @extends Escaper
 */
class PythonEscaper extends Escaper {
    /**
     * Can support the following styles:
     * - python (default): double-quoted strings
     * - python-double: double-quoted strings
     * - python-single: single-quoted strings
     * - python-heredoc: heredoc strings
     * - python-nowdoc: nowdoc strings
     *
     * @param {string} style the style to use for escaping
     * @constructor
     * @throws {Error} if the style is not supported
     */
    constructor(style) {
        super(style);
        this.description = "Escapes and unescapes strings in Python";
        if (!validStyles.has(style)) {
            throw new Error(`invalid python escape style ${style}`);
        }
        this.name = "python-escaper";
        this.description = "Escapes and unescapes various types of strings in Python";
    }

    /**
     * @override
     */
    escape(string) {
        let escaped = string;

        escaped = escapeRules(escaped, escapeRegexes[this.style]);
        if (this.style === "python") {
            escaped = escapeHex(escaped);
            escaped = escapeUnicode(escaped);
            escaped = escapeUnicodeExtended(escaped);
        }
        return escaped;
    }

    /**
     * @override
     */
    unescape(string) {
        let unescaped = string;

        if (this.style === "python") {
            unescaped = unescapeUnicodeExtended(unescaped);
            unescaped = unescapeUnicode(unescaped);
            unescaped = unescapeHex(unescaped);
        }
        unescaped = unescapeRules(unescaped, escapeRegexes[this.style]);
        return unescaped;
    }
}

export default PythonEscaper;