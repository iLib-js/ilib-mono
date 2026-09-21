/*
 * RegexBasedEscaper.js - class that escapes and unescapes strings
 * in various styles using regular expressions
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
import { escapeRegexes } from './EscapeCommon.js';

/**
 * @class Escaper for various string formats based on regular expressions.
 */
class RegexBasedEscaper extends Escaper {
    /**
     * Create a new escaper instance that escapes and unescapes strings based
     * on regular expressions.
     * @constructor
     * @param {string} style the style to use to determine how to escape
     * @throws {Error} if the style is not supported
     */
    constructor(style) {
        super(style);
        this.escapeMap = escapeRegexes[style];
        if (!this.escapeMap) {
            throw new Error(`No escape map for style ${style}`);
        }
        this.description = "Escapes and unescapes strings in various styles using regular expressions.";
    }

    /**
     * @override
     */
    escape(string) {
        let escaped = string;
        for (const [key, value] of Object.entries(this.escapeMap.escape)) {
            escaped = escaped.replace(new RegExp(key, "g"), value);
        }
        return escaped;
    }

    /**
     * @override
     * Run unescape rules repeatedly until the string stabilizes. This ensures
     * correct C-string / PO semantics: when rules are ordered with quote rules
     * (e.g. \") before backslash rules (\\), we unescape \" first (to "), then
     * \\ (to \). Multiple passes also reduce consecutive backslashes (e.g. \\\\
     * → \\ → \) correctly.
     */
    unescape(string) {
        let unescaped = string;
        let prev;
        while (prev !== unescaped) {
            prev = unescaped;
            for (const [key, value] of Object.entries(this.escapeMap.unescape)) {
                unescaped = unescaped.replace(new RegExp(key, "g"), value);
            }
        }
        return unescaped;
    }
}

export default RegexBasedEscaper;