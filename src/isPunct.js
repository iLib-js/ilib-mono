/*
 * isPunct.js - Character type is punctuation
 *
 * Copyright © 2012-2015, 2018, JEDLSoft
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

// !data ctype_p

import { JSUtils } from "ilib-common";

import { inRange } from "./CType.js";

import { ctype_p } from "./ctype_p.js";

/**
 * Return whether or not the first character is punctuation.<p>
 *
 * @static
 * @param {string|IString|number} ch character or code point to examine
 * @return {boolean} true if the first character is punctuation.
 */
export default function isPunct(ch) {
    var num;
    switch (typeof(ch)) {
        case 'number':
            num = ch;
            break;
        case 'string':
            num = JSUtils.toCodePoint(ch, 0);
            break;
        case 'undefined':
            return false;
        default:
            num = ch._toCodePoint(0);
            break;
    }

    return ctype_p ?
        (inRange(num, 'Pd', ctype_p) ||
        inRange(num, 'Ps', ctype_p) ||
        inRange(num, 'Pe', ctype_p) ||
        inRange(num, 'Pc', ctype_p) ||
        inRange(num, 'Po', ctype_p) ||
        inRange(num, 'Pi', ctype_p) ||
        inRange(num, 'Pf', ctype_p)) :
        ((num >= 0x21 && num <= 0x2F) ||
        (num >= 0x3A && num <= 0x40) ||
        (num >= 0x5B && num <= 0x60) ||
        (num >= 0x7B && num <= 0x7E));
};
