/*
 * ctype.islpha.js - Character type is alphabetic
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

import { JSUtils } from "ilib-common";

import { inRange } from "./CType.js";

import { ctype_l } from "./ctype_l.js";

/**
 * Return whether or not the first character is alphabetic.<p>
 *
 * @static
 * @param {string|IString|number} ch character or code point to examine
 * @return {boolean} true if the first character is alphabetic.
 */
export default function isAlpha(ch) {
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
    return ctype_l ?
        (inRange(num, 'Lu', ctype_l) ||
        inRange(num, 'Ll', ctype_l) ||
        inRange(num, 'Lt', ctype_l) ||
        inRange(num, 'Lm', ctype_l) ||
        inRange(num, 'Lo', ctype_l)) :
        ((num >= 0x41 && num <= 0x5A) || (num >= 0x61 && num <= 0x7A));
};
