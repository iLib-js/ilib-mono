/*
 * Escaper.js - class that escapes and unescapes strings
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

/**
 * @class A class that escape and unescapes strings.
 * @abstract
 */
class Escaper {
    /**
     * The style to use to determine how to escape
     * @type {string}
     */
    style;

    /**
     * A short description of the escaper
     * @type {string}
     */
    description;

    /**
     * Create a new escaper instance.
     * @param {Object} style the style object to use to determine how to escape
     * @constructor
     */
    constructor(style) {
        this.style = style;
    }

    /**
     * Escape the given string for the given style. The escaped string is what
     * the programming language would use in source code.
     *
     * @abstract
     * @param {String} str the string to escape
     * @returns {String} the escaped string
     */
    escape(string) {
        throw new Error("abstract method called");
    }

    /**
     * Unescape the given string for the given style. The unescaped
     * string is what the programming language would use in memory as it is running.
     *
     * @abstract
     * @param {String} str the string to unescape
     * @returns {String} the unescaped string
     */
    unescape(string) {
        throw new Error("abstract method called");
    }
}

export default Escaper;