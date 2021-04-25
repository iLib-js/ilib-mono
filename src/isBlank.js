/*
 * isBlank.js - Character type is blank
 *
 * Copyright © 2012-2015, 2018, 2021 JEDLSoft
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

// !data ctype

import { JSUtils } from "ilib-common";

import CType from "./CType.js";

import ctype from "../locale/ctype.json";

/**
 * Return whether or not the first character is a blank character.<p>
 *
 * @static
 * ie. a space or a tab.
 * @param {string|IString|number} ch character or code point to examine
 * @return {boolean} true if the first character is a blank character.
 */
export default function isBlank(ch) {
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
    return ctype ? CType._inRange(num, 'blank', ctype) : (ch === ' ' || ch === '\t');
};
