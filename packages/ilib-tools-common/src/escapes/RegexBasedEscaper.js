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

const escapeMap = {
    "js": {
        "unescape": {
            "\\\\\\\\n": "",               // line continuation
            "\\\\\n": "",                  // line continuation
            "^\\\\\\\\": "\\\\",           // unescape backslashes
            "([^\\])\\\\\\\\": "$1\\\\",
            "^\\'": "'",                   // unescape quotes
            "([^\\])\\'": "$1'",
            '^\\\\"': '"',
            '([^\\\\])\\\\"': '$1"'
        },
        "escape": {
            "\\\\": "\\\\\\\\",
            "'": "\\\\'",
            '"': '\\\\"',
            "\0": "\\\\0",
            "\b": "\\\\b",
            "\f": "\\\\f",
            "\n": "\\\\n",
            "\r": "\\\\r",
            "\t": "\\\\t",
            "\v": "\\\\v",
        }
    },
};

/**
 * @class Escaper for various string formats based on regular expressions.
 * @extends Escaper
 */
class RegexBasedEscaper extends Escaper {
    /**
     * @constructor
     */
    constructor(style) {
        super(style);
        this.description = "Escapes and unescapes strings in various styles using regular expressions.";

        this.escapeMap = escapeMap[style];
        if (!this.escapeMap) {
            throw new Error("No escape map for style " + style);
        }
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
     */
    unescape(string) {
        let unescaped = string;
        for (const [key, value] of Object.entries(this.escapeMap.unescape)) {
            unescaped = unescaped.replace(new RegExp(key, "g"), value);
        }
        return unescaped;
    }
}

export default RegexBasedEscaper;