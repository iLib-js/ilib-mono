/*
 * CSharpEscaper.js - class that escapes and unescapes strings in CSharp
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
    escapeRules,
    escapeUnicode,
    escapeUnicodeExtended,
    escapeRegexes,
    unescapeRules,
    unescapeUnicode,
    unescapeUnicodeExtended,
    unescapeHex,
    unindent
} from './EscapeCommon.js';

const validStyles = new Set([
    "csharp",           // regular single or double-quoted strings
    "csharp-raw",       // raw strings like """foo"""
    "csharp-verbatim"   // verbatim strings like @"foo"
]);

/**
 * @class Escaper for CSharp
 * @extends Escaper
 */
class CSharpEscaper extends Escaper {
    /**
     * Can support the following styles:
     * - csharp (default): single or double-quoted strings
     * - csharp-raw: csharp multi-line strings like """foo"""
     * - csharp-verbatim: csharp raw strings like @"foo"
     *
     * @param {string} style the style to use for escaping
     * @constructor
     * @throws {Error} if the style is not supported
     */
    constructor(style) {
        super(style);
        if (!validStyles.has(style)) {
            throw new Error(`invalid c# escape style ${style}`);
        }
        this.name = "csharp-escaper";
        this.description = "Escapes and unescapes various types of strings in C#";
    }

    /**
     * @override
     */
    escape(string) {
        let escaped = string;

        escaped = escapeRules(escaped, escapeRegexes[this.style]);
        if (this.style === "csharp" || this.style === "csharp-raw") {
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

        if (this.style === "csharp-raw") {
            unescaped = unindent(unescaped);
        }
        if (this.style === "csharp" || this.style === "csharp-raw") {
            unescaped = unescapeUnicodeExtended(unescaped);
            unescaped = unescapeUnicode(unescaped);
            unescaped = unescapeHex(unescaped);
        }
        unescaped = unescapeRules(unescaped, escapeRegexes[this.style]);
        return unescaped;
    }
}

export default CSharpEscaper;