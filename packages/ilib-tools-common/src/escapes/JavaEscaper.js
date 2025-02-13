/*
 * JavaEscaper.js - class that escapes and unescapes strings in Java
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
import { escapeUnicode, unescapeUnicode, unescapeOctal } from './EscapeCommon.js';

var reUnicodeChar = /\\u([a-fA-F0-9]{1,6})/g;
var reOctalChar = /\\([0-8]{1,3})/g;

/**
 * @class Escaper for Java
 * @extends Escaper
 */
class JavaEscaper extends Escaper {
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

        escaped = escaped.
            replace(/\\/g, "\\\\").
            replace(/"/g, '\\"').
            replace(/'/g, "\\'");

        return escapeUnicode(escaped);
    }

    /**
     * @override
     */
    unescape(string) {
        let unescaped = string;

        unescaped = unescapeUnicode(unescaped);
        unescaped = unescapeOctal(unescaped);

        unescaped = unescaped.
            replace(/^\\\\/g, "\\").
            replace(/([^\\])\\\\/g, "$1\\").
            replace(/\\'/g, "'").
            replace(/\\"/g, '"');

        return unescaped;
    }
}

export default JavaEscaper;