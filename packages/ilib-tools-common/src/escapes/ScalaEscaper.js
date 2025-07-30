/*
 * ScalaEscaper.js - class that escapes and unescapes strings in Scala
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
    "scala",           // regular single or double-quoted strings
    "scala-raw",       // raw strings like raw"foo"
    "scala-triple",    // triple-quoted strings like """foo"""
    "scala-char"       // character literals like 'a'
]);

/**
 * @class Escaper for Scala
 */
class ScalaEscaper extends Escaper {
    /**
     * Can support the following styles:
     * - scala: single or double-quoted strings
     * - scala-raw: raw strings like raw"foo"
     * - scala-triple: triple-quoted strings like """foo"""
     * - scala-char: character literals like 'a'
     *
     * @param {string} style the style to use for escaping
     * @constructor
     * @throws {Error} if the style is not supported
     */
    constructor(style) {
        super(style);
        if (!validStyles.has(style)) {
            throw new Error(`invalid scala escape style ${style}`);
        }
        this.name = "scala-escaper";
        this.description = "Escapes and unescapes various types of strings in Scala";
    }

    /**
     * @override
     */
    escape(string) {
        let escaped = string;

        escaped = escapeRules(escaped, escapeRegexes[this.style]);
        
        // Only apply Unicode escaping for regular strings and character literals
        // Raw strings and triple-quoted strings don't support Unicode escapes
        if (this.style === "scala" || this.style === "scala-char") {
            escaped = escapeUnicodeAsSurrogatePairs(escaped);
        }

        return escaped;
    }

    /**
     * @override
     */
    unescape(string) {
        let unescaped = string;

        // Only apply Unicode unescaping for regular strings and character literals
        // Raw strings and triple-quoted strings don't support Unicode escapes
        if (this.style === "scala" || this.style === "scala-char") {
            unescaped = unescapeUnicode(unescaped);
        }
        
        unescaped = unescapeRules(unescaped, escapeRegexes[this.style]);

        return unescaped;
    }
}

export default ScalaEscaper; 