/*
 * ctype.test.js - test the character type information functions
 *
 * Copyright © 2024 JEDLSoft
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

import ilib from '../src/ilib.js';
import isXdigit from "../src/isXdigit.js";
import isUpper from "../src/isUpper.js";
import isSpace from "../src/isSpace.js";
import isScript from "../src/isScript.js";
import isPunct from "../src/isPunct.js";
import isPrint from "../src/isPrint.js";
import isLower from "../src/isLower.js";
import isIdeo from "../src/isIdeo.js";
import isGraph from "../src/isGraph.js";
import isDigit from "../src/isDigit.js";
import isCntrl from "../src/isCntrl.js";
import isBlank from "../src/isBlank.js";
import isAscii from "../src/isAscii.js";
import isAlpha from "../src/isAlpha.js";
import isAlnum from "../src/isAlnum.js";
import CType from "../src/CType.js";

describe("test ctype synchronously", () => {
    beforeEach(() => {
        ilib.clearCache();
        ilib.data.ctype = null;
        ilib.data.ctype_c = null;
        ilib.data.ctype_l = null;
        ilib.data.ctype_m = null;
        ilib.data.ctype_p = null;
        ilib.data.ctype_z = null;
        ilib.data.scriptToRange = null;
    });

    test("CType functions do not work if not initialized first", () => {
        expect.assertions(2);

        expect(isIdeo('碗')).toBeFalsy();
        expect(isIdeo('人')).toBeFalsy();
    });

    test("IsAlphaTrue", () => {
        expect.assertions(5);
        isAlpha._init();
        expect(isAlpha('a')).toBeTruthy();
        expect(isAlpha('m')).toBeTruthy();
        expect(isAlpha('z')).toBeTruthy();
        expect(isAlpha('A')).toBeTruthy();
        expect(isAlpha('Q')).toBeTruthy();
    });

    test("IsLowerTrue", () => {
        expect.assertions(11);

        isLower._init();
        expect(isLower('a')).toBeTruthy();
        expect(isLower('m')).toBeTruthy();
        expect(isLower('щ')).toBeTruthy();
        expect(isLower('λ')).toBeTruthy();
        expect(!isLower(' ')).toBeTruthy();
        expect(!isLower('$')).toBeTruthy();
        expect(!isLower('A')).toBeTruthy();
        expect(!isLower('M')).toBeTruthy();
        expect(!isLower('0')).toBeTruthy();
        expect(!isLower('Щ')).toBeTruthy();
        expect(!isLower('Λ')).toBeTruthy();
    });

    test("IsUpperTrue", () => {
        expect.assertions(11);
        isUpper._init();
        expect(isUpper('A')).toBeTruthy();
        expect(isUpper('M')).toBeTruthy();
        expect(isUpper('Щ')).toBeTruthy();
        expect(isUpper('Λ')).toBeTruthy();
        expect(!isUpper(' ')).toBeTruthy();
        expect(!isUpper('$')).toBeTruthy();
        expect(!isUpper('a')).toBeTruthy();
        expect(!isUpper('m')).toBeTruthy();
        expect(!isUpper('щ')).toBeTruthy();
        expect(!isUpper('λ')).toBeTruthy();
        expect(!isUpper('0')).toBeTruthy();
    });

    test("IsPrintTrue", () => {
        expect.assertions(7);
        isPrint._init();
        expect(isPrint(' ')).toBeTruthy();
        expect(isPrint('A')).toBeTruthy();
        expect(isPrint('M')).toBeTruthy();
        expect(isPrint('Щ')).toBeTruthy();
        expect(isPrint('Λ')).toBeTruthy();
        expect(!isPrint('\u0001')).toBeTruthy();
        expect(!isPrint('\u0085')).toBeTruthy();
    });

    test("IsAsciiTrue", () => {
        expect.assertions(13);
        isAscii._init();
        expect(isAscii('a')).toBeTruthy();
        expect(isAscii('m')).toBeTruthy();
        expect(isAscii('z')).toBeTruthy();
        expect(isAscii('A')).toBeTruthy();
        expect(isAscii('Q')).toBeTruthy();
        expect(isAscii(' ')).toBeTruthy();
        expect(isAscii('$')).toBeTruthy();
        expect(isAscii('0')).toBeTruthy();
        expect(isAscii('1')).toBeTruthy();
        expect(isAscii('8')).toBeTruthy();
        expect(!isAscii('ü')).toBeTruthy();
        expect(!isAscii('ó')).toBeTruthy();
        expect(!isAscii('Д')).toBeTruthy();
    });

    test("IsBlankTrue", () => {
        expect.assertions(13);
        isBlank._init();
        expect(isBlank(' ')).toBeTruthy();
        expect(!isBlank('a')).toBeTruthy();
        expect(!isBlank('m')).toBeTruthy();
        expect(!isBlank('z')).toBeTruthy();
        expect(!isBlank('A')).toBeTruthy();
        expect(!isBlank('Q')).toBeTruthy();
        expect(!isBlank('$')).toBeTruthy();
        expect(!isBlank('0')).toBeTruthy();
        expect(!isBlank('1')).toBeTruthy();
        expect(!isBlank('8')).toBeTruthy();
        expect(!isBlank('ü')).toBeTruthy();
        expect(!isBlank('ó')).toBeTruthy();
        expect(!isBlank('Д')).toBeTruthy();
    });

    test("IsSpaceTrue", () => {
        expect.assertions(11);
        isSpace._init();
        expect(isSpace(' ')).toBeTruthy();
        expect(isSpace('\t')).toBeTruthy();
        expect(isSpace('\n')).toBeTruthy();
        expect(isSpace('\u2000')).toBeTruthy();
        expect(!isSpace('a')).toBeTruthy();
        expect(!isSpace('A')).toBeTruthy();
        expect(!isSpace('$')).toBeTruthy();
        expect(!isSpace('0')).toBeTruthy();
        expect(!isSpace('ü')).toBeTruthy();
        expect(!isSpace('ó')).toBeTruthy();
        expect(!isSpace('Д')).toBeTruthy();
    });

    test("IsPunctTrue", () => {
        expect.assertions(17);
        isPunct._init();
        expect(isPunct('?')).toBeTruthy();
        expect(isPunct('.')).toBeTruthy();
        expect(isPunct('\u2010')).toBeTruthy(); // hyphen
        expect(isPunct('\u037E')).toBeTruthy(); // Greek question mark
        expect(isPunct('\u3001')).toBeTruthy(); // ideographic comma
        expect(!isPunct('a')).toBeTruthy();
        expect(!isPunct('m')).toBeTruthy();
        expect(!isPunct('z')).toBeTruthy();
        expect(!isPunct('A')).toBeTruthy();
        expect(!isPunct('Q')).toBeTruthy();
        expect(!isPunct(' ')).toBeTruthy();
        expect(!isPunct('0')).toBeTruthy();
        expect(!isPunct('1')).toBeTruthy();
        expect(!isPunct('8')).toBeTruthy();
        expect(!isPunct('ü')).toBeTruthy();
        expect(!isPunct('ó')).toBeTruthy();
        expect(!isPunct('Д')).toBeTruthy();
    });

    test("IsIdeoTrue", () => {
        expect.assertions(10);

        isIdeo._init();
        expect(isIdeo('碗')).toBeTruthy();
        expect(isIdeo('人')).toBeTruthy();
        expect(!isIdeo(' ')).toBeTruthy();
        expect(!isIdeo('$')).toBeTruthy();
        expect(!isIdeo('a')).toBeTruthy();
        expect(!isIdeo('m')).toBeTruthy();
        expect(!isIdeo('z')).toBeTruthy();
        expect(!isIdeo('0')).toBeTruthy();
        expect(!isIdeo('1')).toBeTruthy();
        expect(!isIdeo('8')).toBeTruthy();
    });

    test("IsCntrlTrue", () => {
        expect.assertions(10);
        isCntrl._init();
        expect(isCntrl('\u0001')).toBeTruthy();
        expect(isCntrl('\u0085')).toBeTruthy();
        expect(!isCntrl(' ')).toBeTruthy();
        expect(!isCntrl('$')).toBeTruthy();
        expect(!isCntrl('a')).toBeTruthy();
        expect(!isCntrl('m')).toBeTruthy();
        expect(!isCntrl('z')).toBeTruthy();
        expect(!isCntrl('0')).toBeTruthy();
        expect(!isCntrl('1')).toBeTruthy();
        expect(!isCntrl('8')).toBeTruthy();
    });

    test("IsDigitTrue", () => {
        expect.assertions(20);
        isDigit._init();
        expect(isDigit('0')).toBeTruthy();
        expect(isDigit('1')).toBeTruthy();
        expect(isDigit('2')).toBeTruthy();
        expect(isDigit('3')).toBeTruthy();
        expect(isDigit('4')).toBeTruthy();
        expect(isDigit('5')).toBeTruthy();
        expect(isDigit('6')).toBeTruthy();
        expect(isDigit('7')).toBeTruthy();
        expect(isDigit('8')).toBeTruthy();
        expect(isDigit('9')).toBeTruthy();
        expect(!isDigit(' ')).toBeTruthy();
        expect(!isDigit('a')).toBeTruthy();
        expect(!isDigit('m')).toBeTruthy();
        expect(!isDigit('z')).toBeTruthy();
        expect(!isDigit('A')).toBeTruthy();
        expect(!isDigit('Q')).toBeTruthy();
        expect(!isDigit('$')).toBeTruthy();
        expect(!isDigit('ü')).toBeTruthy();
        expect(!isDigit('ó')).toBeTruthy();
        expect(!isDigit('Д')).toBeTruthy();
    });
    test("IsXdigitTrue", () => {
        expect.assertions(32);
        isXdigit._init();
        expect(isXdigit('0')).toBeTruthy();
        expect(isXdigit('1')).toBeTruthy();
        expect(isXdigit('2')).toBeTruthy();
        expect(isXdigit('3')).toBeTruthy();
        expect(isXdigit('4')).toBeTruthy();
        expect(isXdigit('5')).toBeTruthy();
        expect(isXdigit('6')).toBeTruthy();
        expect(isXdigit('7')).toBeTruthy();
        expect(isXdigit('8')).toBeTruthy();
        expect(isXdigit('9')).toBeTruthy();
        expect(isXdigit('A')).toBeTruthy();
        expect(isXdigit('B')).toBeTruthy();
        expect(isXdigit('C')).toBeTruthy();
        expect(isXdigit('D')).toBeTruthy();
        expect(isXdigit('E')).toBeTruthy();
        expect(isXdigit('F')).toBeTruthy();
        expect(isXdigit('a')).toBeTruthy();
        expect(isXdigit('b')).toBeTruthy();
        expect(isXdigit('c')).toBeTruthy();
        expect(isXdigit('d')).toBeTruthy();
        expect(isXdigit('e')).toBeTruthy();
        expect(isXdigit('f')).toBeTruthy();
        expect(!isXdigit('G')).toBeTruthy();
        expect(!isXdigit('g')).toBeTruthy();
        expect(!isXdigit(' ')).toBeTruthy();
        expect(!isXdigit('m')).toBeTruthy();
        expect(!isXdigit('z')).toBeTruthy();
        expect(!isXdigit('Q')).toBeTruthy();
        expect(!isXdigit('$')).toBeTruthy();
        expect(!isXdigit('ü')).toBeTruthy();
        expect(!isXdigit('ó')).toBeTruthy();
        expect(!isXdigit('Д')).toBeTruthy();
    });

    test("WithinRangeTrue", () => {
        expect.assertions(5);
        CType._init();
        expect(CType.withinRange('a', 'ascii')).toBeTruthy();
        expect(!CType.withinRange('\u2000a', 'ascii')).toBeTruthy();
        expect(CType.withinRange('a', 'ASCII')).toBeTruthy();
        expect(!CType.withinRange('G', 'arabic')).toBeTruthy();
        expect(CType.withinRange('a', 'latin')).toBeTruthy();
    });

    test("IsScriptTrue", () => {
        expect.assertions(16);
        isScript._init();
        expect(isScript("a", "Latn")).toBeTruthy();
        expect(isScript("Д", "Cyrl")).toBeTruthy();
        expect(isScript("ώ", "Grek")).toBeTruthy();
        expect(isScript("귋", "Hang")).toBeTruthy();
        expect(isScript("㜴", "Hani")).toBeTruthy();
        expect(isScript("ש", "Hebr")).toBeTruthy();
        expect(isScript("ش", "Arab")).toBeTruthy();
        expect(isScript("झ", "Deva")).toBeTruthy();
        expect(!isScript("a", "Cyrl")).toBeTruthy();
        expect(!isScript("Д", "Grek")).toBeTruthy();
        expect(!isScript("ώ", "Hang")).toBeTruthy();
        expect(!isScript("귋", "Hani")).toBeTruthy();
        expect(!isScript("㜴", "Hebr")).toBeTruthy();
        expect(!isScript("ש", "Arab")).toBeTruthy();
        expect(!isScript("ش", "Deva")).toBeTruthy();
        expect(!isScript("झ", "Latn")).toBeTruthy();
    });

    test("IsAlnum", () => {
        expect.assertions(11);
        isAlnum._init();
        expect(isAlnum('a')).toBeTruthy();
        expect(isAlnum('m')).toBeTruthy();
        expect(isAlnum('z')).toBeTruthy();
        expect(isAlnum('A')).toBeTruthy();
        expect(isAlnum('Q')).toBeTruthy();
        expect(isAlnum('0')).toBeTruthy();
        expect(isAlnum('1')).toBeTruthy();
        expect(isAlnum('8')).toBeTruthy();
        expect(isAlnum('Ꞛ')).toBeTruthy();
        expect(!isAlnum(' ')).toBeTruthy();
        expect(!isAlnum('$')).toBeTruthy();
    });

    test("IsGraphTrue", () => {
        expect.assertions(5);
        isGraph._init();
        expect(isGraph('A')).toBeTruthy();
        expect(isGraph('Q')).toBeTruthy();
        expect(isGraph('碗')).toBeTruthy();
        expect(!isGraph(' ')).toBeTruthy();
        expect(!isGraph('\u0002')).toBeTruthy();
    });
});
