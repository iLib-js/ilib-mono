/*
 * CppEscaper.js - class that escapes and unescapes strings in C++
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
    escapeUnicodeAsSurrogatePairs,
    escapeRules,
    unescapeRules,
    unescapeUnicode,
    escapeRegexes
} from './EscapeCommon.js';

const validStyles = new Set([
    "cpp",           // regular double-quoted strings
    "cpp-char",      // character literals like 'a'
    "cpp-raw",       // raw strings like R"(foo)"
    "cpp-wide",      // wide strings like L"foo"
    "cpp-utf8",      // UTF-8 strings like u8"foo"
    "cpp-utf16",     // UTF-16 strings like u"foo"
    "cpp-utf32"      // UTF-32 strings like U"foo"
]);

/**
 * @class Escaper for C++
 */
class CppEscaper extends Escaper {
    /**
     * Can support the following styles:
     * - cpp: regular double-quoted strings
     * - cpp-char: character literals like 'a'
     * - cpp-raw: raw strings like R"(foo)"
     * - cpp-wide: wide strings like L"foo"
     * - cpp-utf8: UTF-8 strings like u8"foo"
     * - cpp-utf16: UTF-16 strings like u"foo"
     * - cpp-utf32: UTF-32 strings like U"foo"
     *
     * @param {string} style the style to use for escaping
     * @constructor
     * @throws {Error} if the style is not supported
     */
    constructor(style) {
        super(style);
        if (!validStyles.has(style)) {
            throw new Error(`invalid cpp escape style ${style}`);
        }
        this.name = "cpp-escaper";
        this.description = "Escapes and unescapes various types of strings in C++";
    }

    /**
     * @override
     */
    escape(string) {
        let escaped = string;

        escaped = escapeRules(escaped, escapeRegexes[this.style]);

        // Apply Unicode escaping for all C++ string types except raw strings
        // C++ supports Unicode escapes in all string types except raw strings
        if (this.style !== "cpp-raw") {
            escaped = escapeUnicodeAsSurrogatePairs(escaped);
        }

        return escaped;
    }

    /**
     * @override
     */
    unescape(string) {
        let unescaped = string;

        // Apply Unicode unescaping for all C++ string types except raw strings
        if (this.style !== "cpp-raw") {
            unescaped = unescapeUnicode(unescaped);
        }

        unescaped = unescapeRules(unescaped, escapeRegexes[this.style]);

        return unescaped;
    }
}

export default CppEscaper; 