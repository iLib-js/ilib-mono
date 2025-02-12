/*
 * JavascriptEscaper.js - class that escapes and unescapes strings in Java
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

import IString from 'ilib-istring';

import Escaper from '../Escaper.js';

var reUnicodeBMPChar = /\\u([a-fA-F0-9]{1,4})/g;
var reUnicodeAstralPlaneChar = /\\u\{([a-fA-F0-9]{1,5})\}/g;
var reOctalChar = /\\([0-8]{1,3})/g;

var regexes = {
    "unescape": {
        "\\\\\\\\n": "",                 // line continuation
        "\\\\\\n": "",                   // line continuation
        "^\\\\\\\\": "\\",               // unescape backslashes
        "([^\\\\])\\\\\\\\": "$1\\",
        "^\\\\'": "'",                   // unescape quotes
        "([^\\\\])\\\\'": "$1'",
        '^\\\\"': '"',
        '([^\\\\])\\\\"': '$1"'
    },
    "escape": {
        "\\\\": "\\\\",
        "'": "\\'",
        '"': '\\"',
        "\\\\0": "\\0",
        "\\\\b": "\\b",
        "\\\\f": "\\f",
        "\\\\n": "\\n",
        "\\\\r": "\\r",
        "\\\\t": "\\t",
        "\\\\v": "\\v",
    }
};

/**
 * @class Escaper for Java
 * @extends Escaper
 */
class JavascriptEscaper extends Escaper {
    /**
     * @constructor
     */
    constructor() {
        super("java");
        this.description = "Escapes and unescapes strings in Java";
    }
    
    /**
     * @override
     */
    escape(string) {
        // convert all code points above U+FFFF to \uXXXX form
        let escaped = string;

        for (const [key, value] of Object.entries(regexes.escape)) {
            escaped = escaped.replace(new RegExp(key, "g"), value);
        }

        let output = "";
        for (const ch of escaped) {
            const code = IString.toCodePoint(ch, 0);
            if (code > 0x00FF) {
                const str = code.toString(16).toUpperCase();
                if (code > 0xFFFF) {
                    output += "\\u{" + str + "}";
                } else {
                    output += "\\u" + str.padStart(4, "0");
                }
            } else {
                output += ch;
            }
        }
        return output;
    }

    /**
     * @override
     */
    unescape(string) {
        let unescaped = string;
        let match;

        while ((match = reUnicodeBMPChar.exec(unescaped))) {
            if (match && match.length > 1) {
                const value = parseInt(match[1], 16);
                unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
                reUnicodeBMPChar.lastIndex = 0;
            }
        }
    
        while ((match = reUnicodeAstralPlaneChar.exec(unescaped))) {
            if (match && match.length > 1) {
                const value = parseInt(match[1], 16);
                unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
                reUnicodeAstralPlaneChar.lastIndex = 0;
            }
        }

        while ((match = reOctalChar.exec(unescaped))) {
            if (match && match.length > 1) {
                const value = parseInt(match[1], 8);
                unescaped = unescaped.replace(match[0], IString.fromCodePoint(value));
                reOctalChar.lastIndex = 0;
            }
        }
    
        for (const [key, value] of Object.entries(regexes.unescape)) {
            unescaped = unescaped.replace(new RegExp(key, "g"), value);
        }
        
        return unescaped;
    }
}

export default JavascriptEscaper;