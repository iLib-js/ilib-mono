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

import Escaper from './Escaper.js';
import { escapeUnicode, escapeUnicodeAstral, unescapeUnicode, unescapeOctal } from './EscapeCommon.js';

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
        this.name = "java-escaper";
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

        escaped = escapeUnicode(escaped);
        escaped = escapeUnicodeAstral(escaped);

        return escaped;
    }

    /**
     * @override
     */
    unescape(string) {
        let unescaped = string;

        // unescapeUnicode does the whole range of Unicode
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