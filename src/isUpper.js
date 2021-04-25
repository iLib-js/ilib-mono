/*
 * isUpper.js - Character type is upper-case letter
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

// !data ctype_l

import { JSUtils } from "ilib-common";

import CType from "./CType";

import ctype_l from "../locale/ctype_l.json";

/**
 * Return whether or not the first character is upper-case. For alphabetic
 * characters in scripts that do not make a distinction between upper- and
 * lower-case, this function always returns true.<p>
 *
 * @static
 * @param {string|IString|number} ch character or code point to examine
 * @return {boolean} true if the first character is upper-case.
 */
export default function isUpper(ch) {
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

    return ctype_l ? CType._inRange(num, 'Lu', ctype_l) : (num >= 0x41 && num <= 0x5A);
};
