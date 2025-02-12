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
import { escapeU, escapeUBrackets, escapeHex, escapeOctal, escapeJS, unescapeJS } from './JSCommon.js';

/**
 * @class Escaper for Java
 * @extends Escaper
 */
class JavascriptEscaper extends Escaper {
    /**
     * @constructor
     */
    constructor() {
        super("js");
        this.description = "Escapes and unescapes strings in Javascript";
    }

    /**
     * @override
     */
    escape(string) {
        let escaped = string;

        escaped = escapeJS(escaped);

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

        unescaped = escapeU(unescaped);
        unescaped = escapeUBrackets(unescaped);
        unescaped = escapeHex(unescaped);
        unescaped = escapeOctal(unescaped);

        unescaped = unescapeJS(unescaped);

        return unescaped;
    }
}

export default JavascriptEscaper;