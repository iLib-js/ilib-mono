/*
 * SmartyEscaper.js - class that escapes and unescapes strings in Smarty
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
    unescapeRules,
    escapeRegexes
} from './EscapeCommon.js';

const validStyles = new Set([
    "smarty",           // defaults to double-quoted strings
    "smarty-double",    // double-quoted strings (default)
    "smarty-single",    // single-quoted strings
]);


/**
 * @class Escaper for Smarty
 * @extends Escaper
 */
class SmartyEscaper extends Escaper {
    /**
     * Can support the following styles:
     * - smarty (default): double-quoted strings
     * - smarty-double: double-quoted strings
     * - smarty-single: single-quoted strings
     *
     * @param {string} style the style to use for escaping
     * @constructor
     * @throws {Error} if the style is not supported
     */
    constructor(style) {
        super(style);
        this.description = "Escapes and unescapes strings in Smarty";
        if (!validStyles.has(style)) {
            throw new Error(`invalid smarty escape style ${style}`);
        }
        if (this.style === "smarty") {
            // use the double-quoted style by default
            this.style = "smarty-double";
        }
        // Smarty uses php underneath, so we can reuse the php rules
        switch (this.style) {
            default:
            case 'smarty-double':
                this.regexName = "php-double";
                break;
            case 'smarty-single':
                this.regexName = "php-single";
                break;
        }
        this.name = "smarty-escaper";
        this.description = "Escapes and unescapes various types of strings in Smarty";
    }

    /**
     * @override
     */
    escape(string) {
        let escaped = string;

        escaped = escapeRules(escaped, escapeRegexes[this.regexName]);
        return escaped;
    }

    /**
     * @override
     */
    unescape(string) {
        let unescaped = string;

        unescaped = unescapeRules(unescaped, escapeRegexes[this.regexName]);
        return unescaped;
    }
}

export default SmartyEscaper;