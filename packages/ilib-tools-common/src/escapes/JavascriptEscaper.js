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
import {
    escapeUnicodeWithBrackets,
    escapeJS,
    unescapeJS,
    unescapeHex,
    unescapeOctal,
    unescapeUnicode,
    unescapeUnicodeWithBrackets
} from './EscapeCommon.js';

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

        return escapeUnicodeWithBrackets(escaped);
    }

    /**
     * @override
     */
    unescape(string) {
        let unescaped = string;

        unescaped = unescapeUnicode(unescaped);
        unescaped = unescapeUnicodeWithBrackets(unescaped);
        unescaped = unescapeHex(unescaped);
        unescaped = unescapeOctal(unescaped);
        unescaped = unescapeJS(unescaped);

        return unescaped;
    }
}

export default JavascriptEscaper;