/*
 * JavascriptEscaper.js - class that escapes and unescapes strings in JavaScript
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
    escapeUnicode,
    escapeUnicodeWithBrackets,
    escapeRules,
    escapeRegexes,
    unescapeRules,
    unescapeHex,
    unescapeOctal,
    unescapeUnicode,
    unescapeUnicodeWithBrackets
} from './EscapeCommon.js';

const validStyles = new Set([
    "js",                   // regular single or double-quoted strings
    "js-template"           // JS template strings like `foo`
]);

/**
 * @class Escaper for JavaScript
 */
class JavascriptEscaper extends Escaper {
    /**
     * Can support the following styles:
     * - js: single or double-quoted strings
     * - js-template: JS template strings like `foo`
     *
     * @param {string} style the style to use for escaping
     * @constructor
     * @throws {Error} if the style is not supported
     */
    constructor(style) {
        super(style);
        if (style === "javascript") {
            this.style = "js";
        } else if (style === "javascript-template") {
            this.style = "js-template";
        }
        if (!validStyles.has(this.style)) {
            throw new Error(`invalid escape style ${style}`);
        }
        this.name = "javascript-escaper";
        this.description = "Escapes and unescapes strings in Javascript";
    }

    /**
     * @override
     */
    escape(string) {
        let escaped = string;

        escaped = escapeRules(escaped, escapeRegexes[this.style]);
        escaped = escapeUnicode(escaped);
        escaped = escapeUnicodeWithBrackets(escaped);
        if (this.style === "js") {
            escaped = escapeHex(escaped);
        }

        return escaped;
    }

    /**
     * @override
     */
    unescape(string) {
        let unescaped = string;

        unescaped = unescapeUnicode(unescaped);
        unescaped = unescapeUnicodeWithBrackets(unescaped);
        unescaped = unescapeHex(unescaped);
        unescaped = unescapeOctal(unescaped);
        unescaped = unescapeRules(unescaped, escapeRegexes[this.style]);

        return unescaped;
    }
}

export default JavascriptEscaper;