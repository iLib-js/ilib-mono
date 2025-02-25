/*
 * SwiftEscaper.js - class that escapes and unescapes strings in Swift
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
    escapeUnicodeWithBrackets,
    unescapeRules,
    unescapeUnicodeWithBrackets,
    escapeRegexes
} from './EscapeCommon.js';

const validStyles = new Set([
    "swift",           // regular single or double-quoted strings
    "swift-multi",     // multi-line strings like """foo"""
    "swift-extended"   // extended strings like #"""foo"""#
]);

/**
 * Remove leading whitespace from each line of a string
 * in the same way that the Swift compiler does.
 * This is used for multi-line strings and extended strings
 * to remove the leading whitespace that is used to align
 * the string with the rest of the code.
 * @private
 * @param {string} string the string to unindent
 * @returns {string} the unindented string
 */
function unindent(string) {
    // Remove leading whitespace from each line
    const lines = string.split('\n');
    if (lines.length < 2) {
        return string;
    }
    // Find the minimum indentation level amongst all lines, ignoring empty lines
    // and lines that only contain whitespace, as that will give us the amount
    // of indentation to remove from each line
    const minIndent = Math.min(...lines.map(line => line.search(/\S/)));
    if (minIndent < 0) {
        // No indentation found, so return the original string
        return string;
    }
    // Remove the minimum indentation from each line
    const unindentedLines = lines.map(line => line.slice(minIndent));
    return unindentedLines.join('\n');
}

/**
 * @class Escaper for Swift
 * @extends Escaper
 */
class SwiftEscaper extends Escaper {
    /**
     * Can support the following styles:
     * - swift (default): single or double-quoted strings
     * - swift-multi: swift multi-line strings like """foo"""
     * - swift-extended: swift raw strings like #"foo"#
     *
     * @param {string} style the style to use for escaping
     * @constructor
     * @throws {Error} if the style is not supported
     */
    constructor(style) {
        super(style);
        this.description = "Escapes and unescapes strings in Swift";
        if (!validStyles.has(style)) {
            throw new Error(`invalid swift escape style ${style}`);
        }
        this.name = "swift-escaper";
        this.description = "Escapes and unescapes various types of strings in Swift";
    }

    /**
     * @override
     */
    escape(string) {
        let escaped = string;

        escaped = escapeRules(escaped, escapeRegexes[this.style]);
        if (this.style === "swift") {
            escaped = escapeUnicodeWithBrackets(escaped);
        }
        return escaped;
    }

    /**
     * @override
     */
    unescape(string) {
        let unescaped = string;

        if (this.style === "swift-multi" || this.style === "swift-extended") {
            unescaped = unindent(unescaped);
        }
        unescaped = unescapeUnicodeWithBrackets(unescaped);
        unescaped = unescapeRules(unescaped, escapeRegexes[this.style]);
        return unescaped;
    }
}

export default SwiftEscaper;