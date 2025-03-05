/*
 * JavaEscaper.js - class that escapes and unescapes strings in Java
 * and Kotlin
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
    unescapeUnicode,
    unescapeRules,
    escapeRegexes,
    unindent
} from './EscapeCommon.js';

const validStyles = new Set([
    "java",            // regular single or double-quoted strings
    "java-raw",        // Java raw strings like """foo"""
    "kotlin",          // regular single or double-quoted strings"
    "kotlin-raw",      // Kotlin raw strings like """foo"""
]);

/**
 * @class Escaper for Java and Kotlin
 */
class JavaEscaper extends Escaper {
   /**
    * Can support the following styles:
    * - java: single or double-quoted strings
    * - java-raw: raw strings like """foo"""
    * - kotlin: regular single or double-quoted strings
    * - kotlin-raw: Kotlin raw strings like """foo"""
    *
    * @param {string} style the style to use for escaping
    * @constructor
    * @throws {Error} if the style is not supported
    */
    constructor(style) {
        super(style);
        if (!validStyles.has(style)) {
            throw new Error(`invalid java/kotlin escape style ${style}`);
        }
        this.name = "java-escaper";
        this.description = "Escapes and unescapes strings in Java or Kotlin";
    }

    /**
     * @override
     */
    escape(string) {
        let escaped = string;

        if (this.style === "java" || this.style === "kotlin") {
            // these share the same escape rules
            escaped = escapeRules(escaped, escapeRegexes.java);
            escaped = escapeUnicodeAsSurrogatePairs(escaped);
        } else if (this.style === "java-raw") {
            // java raw strings only support line continuation characters and Unicode
            escaped = escapeRules(escaped, escapeRegexes["java-raw"]);
            escaped = escapeUnicodeAsSurrogatePairs(escaped);
        }

        return escaped;
    }

    /**
     * @override
     */
    unescape(string) {
        let unescaped = string;

        if (this.style === "java-raw" || this.style === "kotlin-raw") {
            unescaped = unindent(unescaped);
        }

        if (this.style === "java" || this.style === "kotlin") {
            // these share the same escape rules
            unescaped = unescapeRules(unescaped, escapeRegexes.java);
            // unescapeUnicode does the whole range of Unicode
            unescaped = unescapeUnicode(unescaped);
        } else if (this.style === "java-raw") {
            // java raw strings only support line continuation characters and Unicode
            unescaped = unescapeRules(unescaped, escapeRegexes["java-raw"]);
            unescaped = unescapeUnicode(unescaped);
        }
        return unescaped;
    }
}

export default JavaEscaper;