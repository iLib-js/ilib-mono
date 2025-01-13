/*
 * ctype.test.js - test the character type information functions
 *
 * Copyright © 2012-2015, 2017-2018, 2020, 2022-2024 JEDLSoft
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
import withinRange from "../src/CType.js";
import { JSUtils } from "ilib-common";

describe("testctype", function() {
    test("IsAlnumTrue", function() {
        expect.assertions(9);
        expect(isAlnum('a')).toBeTruthy();
        expect(isAlnum('m')).toBeTruthy();
        expect(isAlnum('z')).toBeTruthy();
        expect(isAlnum('A')).toBeTruthy();
        expect(isAlnum('Q')).toBeTruthy();
        expect(isAlnum('0')).toBeTruthy();
        expect(isAlnum('1')).toBeTruthy();
        expect(isAlnum('8')).toBeTruthy();
        expect(isAlnum('Ꞛ')).toBeTruthy();
    });

    test("IsAlnumFalse", function() {
        expect.assertions(2);
        expect(!isAlnum(' ')).toBeTruthy();
        expect(!isAlnum('$')).toBeTruthy();

    });

    test("IsAlnumOnlyFirstChar", function() {
        expect.assertions(1);
        expect(!isAlnum(' a')).toBeTruthy();
    });

    test("IsAlnumEmpty", function() {
        expect.assertions(1);
        expect(!isAlnum('')).toBeTruthy();
    });

    test("IsAlnumUndefined", function() {
        expect.assertions(1);
        expect(!isAlnum()).toBeTruthy();
    });

    test("IsAlphaTrue", function() {
        expect.assertions(5);
        expect(isAlpha('a')).toBeTruthy();
        expect(isAlpha('m')).toBeTruthy();
        expect(isAlpha('z')).toBeTruthy();
        expect(isAlpha('A')).toBeTruthy();
        expect(isAlpha('Q')).toBeTruthy();
    });

    test("IsAlphaFalse", function() {
        expect.assertions(5);
        expect(!isAlpha(' ')).toBeTruthy();
        expect(!isAlpha('$')).toBeTruthy();
        expect(!isAlpha('0')).toBeTruthy();
        expect(!isAlpha('1')).toBeTruthy();
        expect(!isAlpha('8')).toBeTruthy();
    });

    test("IsAlphaOnlyFirstChar", function() {
        expect.assertions(1);
        expect(!isAlpha(' a')).toBeTruthy();
    });

    test("IsAlphaEmpty", function() {
        expect.assertions(1);
        expect(!isAlpha('')).toBeTruthy();
    });

    test("IsAlphaUndefined", function() {
        expect.assertions(1);
        expect(!isAlpha()).toBeTruthy();
    });

    test("IsLowerTrue", function() {
        expect.assertions(4);
        expect(isLower('a')).toBeTruthy();
        expect(isLower('m')).toBeTruthy();
        expect(isLower('щ')).toBeTruthy();
        expect(isLower('λ')).toBeTruthy();
    });

    test("IsLowerFalse", function() {
        expect.assertions(7);
        expect(!isLower(' ')).toBeTruthy();
        expect(!isLower('$')).toBeTruthy();
        expect(!isLower('A')).toBeTruthy();
        expect(!isLower('M')).toBeTruthy();
        expect(!isLower('0')).toBeTruthy();
        expect(!isLower('Щ')).toBeTruthy();
        expect(!isLower('Λ')).toBeTruthy();
    });

    test("IsLowerOnlyFirstChar", function() {
        expect.assertions(1);
        expect(!isLower(' a')).toBeTruthy();
    });

    test("IsLowerEmpty", function() {
        expect.assertions(1);
        expect(!isLower('')).toBeTruthy();
    });

    test("IsLowerUndefined", function() {
        expect.assertions(1);
        expect(!isLower()).toBeTruthy();
    });

    test("IsUpperTrue", function() {
        expect.assertions(4);
        expect(isUpper('A')).toBeTruthy();
        expect(isUpper('M')).toBeTruthy();
        expect(isUpper('Щ')).toBeTruthy();
        expect(isUpper('Λ')).toBeTruthy();
    });

    test("IsUpperFalse", function() {
        expect.assertions(7);
        expect(!isUpper(' ')).toBeTruthy();
        expect(!isUpper('$')).toBeTruthy();
        expect(!isUpper('a')).toBeTruthy();
        expect(!isUpper('m')).toBeTruthy();
        expect(!isUpper('щ')).toBeTruthy();
        expect(!isUpper('λ')).toBeTruthy();
        expect(!isUpper('0')).toBeTruthy();
    });

    test("IsUpperOnlyFirstChar", function() {
        expect.assertions(1);
        expect(!isUpper(' A')).toBeTruthy();
    });

    test("IsUpperEmpty", function() {
        expect.assertions(1);
        expect(!isUpper('')).toBeTruthy();
    });

    test("IsUpperUndefined", function() {
        expect.assertions(1);
        expect(!isUpper()).toBeTruthy();
    });

    test("IsPrintTrue", function() {
        expect.assertions(5);
        expect(isPrint(' ')).toBeTruthy();
        expect(isPrint('A')).toBeTruthy();
        expect(isPrint('M')).toBeTruthy();
        expect(isPrint('Щ')).toBeTruthy();
        expect(isPrint('Λ')).toBeTruthy();
    });

    test("IsPrintFalse", function() {
        expect.assertions(2);
        expect(!isPrint('\u0001')).toBeTruthy();
        expect(!isPrint('\u0085')).toBeTruthy();
    });

    test("IsPrintOnlyFirstChar", function() {
        expect.assertions(1);
        expect(!isPrint('\u0001X')).toBeTruthy();
    });

    test("IsPrintEmpty", function() {
        expect.assertions(1);
        expect(!isPrint('')).toBeTruthy();
    });

    test("IsPrintUndefined", function() {
        expect.assertions(1);
        expect(!isPrint()).toBeTruthy();
    });

    test("IsAsciiTrue", function() {
        expect.assertions(10);
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
    });

    test("IsAsciiFalse", function() {
        expect.assertions(3);
        expect(!isAscii('ü')).toBeTruthy();
        expect(!isAscii('ó')).toBeTruthy();
        expect(!isAscii('Д')).toBeTruthy();
    });

    test("IsAsciiOnlyFirstChar", function() {
        expect.assertions(1);
        expect(!isAscii('Дa')).toBeTruthy();
    });

    test("IsAsciiEmpty", function() {
        expect.assertions(1);
        expect(!isAscii('')).toBeTruthy();
    });

    test("IsAsciiUndefined", function() {
        expect.assertions(1);
        expect(!isAscii()).toBeTruthy();
    });

    test("IsBlankTrue", function() {
        expect.assertions(1);
        expect(isBlank(' ')).toBeTruthy();
    });

    test("IsBlankFalse", function() {
        expect.assertions(12);
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

    test("IsBlankOnlyFirstChar", function() {
        expect.assertions(1);
        expect(!isBlank('a ')).toBeTruthy();
    });

    test("IsBlankEmpty", function() {
        expect.assertions(1);
        expect(!isBlank('')).toBeTruthy();
    });

    test("IsBlankUndefined", function() {
        expect.assertions(1);
        expect(!isBlank()).toBeTruthy();
    });

    test("IsSpaceTrue", function() {
        expect.assertions(4);
        expect(isSpace(' ')).toBeTruthy();
        expect(isSpace('\t')).toBeTruthy();
        expect(isSpace('\n')).toBeTruthy();
        expect(isSpace('\u2000')).toBeTruthy();
    });

    test("IsSpaceFalse", function() {
        expect.assertions(7);
        expect(!isSpace('a')).toBeTruthy();
        expect(!isSpace('A')).toBeTruthy();
        expect(!isSpace('$')).toBeTruthy();
        expect(!isSpace('0')).toBeTruthy();
        expect(!isSpace('ü')).toBeTruthy();
        expect(!isSpace('ó')).toBeTruthy();
        expect(!isSpace('Д')).toBeTruthy();
    });

    test("IsSpaceOnlyFirstChar", function() {
        expect.assertions(1);
        expect(!isSpace('a ')).toBeTruthy();
    });

    test("IsSpaceEmpty", function() {
        expect.assertions(1);
        expect(!isSpace('')).toBeTruthy();
    });

    test("IsSpaceUndefined", function() {
        expect.assertions(1);
        expect(!isSpace()).toBeTruthy();
    });

    test("IsPunctTrue", function() {
        expect.assertions(5);
        expect(isPunct('?')).toBeTruthy();
        expect(isPunct('.')).toBeTruthy();
        expect(isPunct('\u2010')).toBeTruthy(); // hyphen
        expect(isPunct('\u037E')).toBeTruthy(); // Greek question mark
        expect(isPunct('\u3001')).toBeTruthy(); // ideographic comma
    });

    test("IsPunctFalse", function() {
        expect.assertions(12);
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

    test("IsPunctOnlyFirstChar", function() {
        expect.assertions(1);
        expect(!isPunct(' ,')).toBeTruthy();
    });

    test("IsPunctEmpty", function() {
        expect.assertions(1);
        expect(!isPunct('')).toBeTruthy();
    });

    test("IsPunctUndefined", function() {
        expect.assertions(1);
        expect(!isPunct()).toBeTruthy();
    });

    test("IsGraphTrue", function() {
        expect.assertions(3);
        expect(isGraph('A')).toBeTruthy();
        expect(isGraph('Q')).toBeTruthy();
        expect(isGraph('碗')).toBeTruthy();
    });

    test("IsGraphFalse", function() {
        expect.assertions(2);
        expect(!isGraph(' ')).toBeTruthy();
        expect(!isGraph('\u0002')).toBeTruthy();
    });

    test("IsGraphOnlyFirstChar", function() {
        expect.assertions(1);
        expect(!isGraph(' A')).toBeTruthy();
    });

    test("IsGraphEmpty", function() {
        expect.assertions(1);
        expect(!isGraph('')).toBeTruthy();
    });

    test("IsGraphUndefined", function() {
        expect.assertions(1);
        expect(!isGraph()).toBeTruthy();
    });

    test("IsIdeoTrue", function() {
        expect.assertions(2);
        expect(isIdeo('碗')).toBeTruthy();
        expect(isIdeo('人')).toBeTruthy();
    });

    test("IsIdeoFalse", function() {
        expect.assertions(8);
        expect(!isIdeo(' ')).toBeTruthy();
        expect(!isIdeo('$')).toBeTruthy();
        expect(!isIdeo('a')).toBeTruthy();
        expect(!isIdeo('m')).toBeTruthy();
        expect(!isIdeo('z')).toBeTruthy();
        expect(!isIdeo('0')).toBeTruthy();
        expect(!isIdeo('1')).toBeTruthy();
        expect(!isIdeo('8')).toBeTruthy();
    });

    test("IsIdeoOnlyFirstChar", function() {
        expect.assertions(1);
        expect(!isIdeo(' 人')).toBeTruthy();
    });

    test("IsIdeoEmpty", function() {
        expect.assertions(1);
        expect(!isIdeo('')).toBeTruthy();
    });

    test("IsIdeoUndefined", function() {
        expect.assertions(1);
        expect(!isIdeo()).toBeTruthy();
    });

    test("IsCntrlTrue", function() {
        expect.assertions(2);
        expect(isCntrl('\u0001')).toBeTruthy();
        expect(isCntrl('\u0085')).toBeTruthy();
    });

    test("IsCntrlFalse", function() {
        expect.assertions(8);
        expect(!isCntrl(' ')).toBeTruthy();
        expect(!isCntrl('$')).toBeTruthy();
        expect(!isCntrl('a')).toBeTruthy();
        expect(!isCntrl('m')).toBeTruthy();
        expect(!isCntrl('z')).toBeTruthy();
        expect(!isCntrl('0')).toBeTruthy();
        expect(!isCntrl('1')).toBeTruthy();
        expect(!isCntrl('8')).toBeTruthy();
    });

    test("IsCntrlOnlyFirstChar", function() {
        expect.assertions(1);
        expect(!isCntrl(' \u0001')).toBeTruthy();
    });

    test("IsCntrlEmpty", function() {
        expect.assertions(1);
        expect(!isCntrl('')).toBeTruthy();
    });

    test("IsCntrlUndefined", function() {
        expect.assertions(1);
        expect(!isCntrl()).toBeTruthy();
    });

    test("IsDigitTrue", function() {
        expect.assertions(10);
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
    });

    test("IsDigitFalse", function() {
        expect.assertions(10);
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

    test("IsDigitOnlyFirstChar", function() {
        expect.assertions(1);
        expect(!isDigit('a4')).toBeTruthy();
    });

    test("IsDigitEmpty", function() {
        expect.assertions(1);
        expect(!isDigit('')).toBeTruthy();
    });

    test("IsDigitUndefined", function() {
        expect.assertions(1);
        expect(!isDigit()).toBeTruthy();
    });

    test("IsXdigitTrue", function() {
        expect.assertions(22);
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
    });

    test("IsXdigitFalse", function() {
        expect.assertions(10);
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

    test("IsXdigitOnlyFirstChar", function() {
        expect.assertions(1);
        expect(!isXdigit('ta')).toBeTruthy();
    });

    test("IsXdigitEmpty", function() {
        expect.assertions(1);
        expect(!isXdigit('')).toBeTruthy();
    });

    test("IsXdigitUndefined", function() {
        expect.assertions(1);
        expect(!isXdigit()).toBeTruthy();
    });

    /*
    isIdeo: function (ch) {
    withinRange: function(ch, rangeName) {
    */

    test("WithinRangeTrue", function() {
        expect.assertions(1);
        expect(withinRange('a', 'ascii')).toBeTruthy();
    });

    test("WithinRangeOnlyFirstChar", function() {
        expect.assertions(1);
        expect(!withinRange('\u2000a', 'ascii')).toBeTruthy();
    });

    test("WithinRangeLowerCaseTheRangeName", function() {
        expect.assertions(1);
        expect(withinRange('a', 'ASCII')).toBeTruthy();
    });

    test("WithinRangeFalse", function() {
        expect.assertions(1);
        expect(!withinRange('G', 'arabic')).toBeTruthy();
    });

    test("WithinRangeMultirange1", function() {
        expect.assertions(1);
        expect(withinRange('a', 'latin')).toBeTruthy();
    });

    test("WithinRangeMultirange2", function() {
        expect.assertions(1);
        expect(withinRange('\u1E0F', 'latin')).toBeTruthy();
    });

    test("WithinRangeMultirange3", function() {
        expect.assertions(1);
        expect(withinRange('\u2C61', 'latin')).toBeTruthy();
    });

    test("WithinRangeMultirange4", function() {
        expect.assertions(1);
        expect(withinRange('\uA720', 'latin')).toBeTruthy();
    });

    test("WithinRangeMultirangeFalse", function() {
        expect.assertions(1);
        expect(!withinRange('\u2190', 'latin')).toBeTruthy();
    });

    test("WithinRangeEmpty", function() {
        expect.assertions(1);
        expect(!withinRange('', 'latin')).toBeTruthy();
    });

    test("WithinRangeUndefined", function() {
        expect.assertions(1);
        expect(!withinRange()).toBeTruthy();
    });


    /* test each range */

    test("WithinRangeLatin1", function() {
        expect.assertions(1);
        expect(withinRange("\u000A", "Latin")).toBeTruthy();
    });

    test("WithinRangeLatin2", function() {
        expect.assertions(1);
        expect(withinRange("\u1E0A", "Latin")).toBeTruthy();
    });

    test("WithinRangeLatin3", function() {
        expect.assertions(1);
        expect(withinRange("\u2C6A", "Latin")).toBeTruthy();
    });

    test("WithinRangeLatin4", function() {
        expect.assertions(1);
        expect(withinRange("\uA72A", "Latin")).toBeTruthy();
    });

    test("WithinRangeIPA1", function() {
        expect.assertions(1);
        expect(withinRange("\u025A", "IPA")).toBeTruthy();
    });

    test("WithinRangeIPA2", function() {
        expect.assertions(1);
        expect(withinRange("\u1D0A", "IPA")).toBeTruthy();
    });

    test("WithinRangeIPA3", function() {
        expect.assertions(1);
        expect(withinRange("\u1D8A", "IPA")).toBeTruthy();
    });

    test("WithinRangeOperators1", function() {
        expect.assertions(1);
        expect(withinRange("\u220A", "Operators")).toBeTruthy();
    });

    test("WithinRangeOperators2", function() {
        expect.assertions(1);
        expect(withinRange("\u2A0A", "Operators")).toBeTruthy();
    });

    test("WithinRangeGreek1", function() {
        expect.assertions(1);
        expect(withinRange("\u037A", "Greek")).toBeTruthy();
    });

    test("WithinRangeGreek2", function() {
        expect.assertions(1);
        expect(withinRange("\u1F0A", "Greek")).toBeTruthy();
    });

    test("WithinRangeCyrillic1", function() {
        expect.assertions(1);
        expect(withinRange("\u040A", "Cyrillic")).toBeTruthy();
    });

    test("WithinRangeCyrillic2", function() {
        expect.assertions(1);
        expect(withinRange("\u2DEA", "Cyrillic")).toBeTruthy();
    });

    test("WithinRangeCyrillic3", function() {
        expect.assertions(1);
        expect(withinRange("\uA64A", "Cyrillic")).toBeTruthy();
    });

    test("WithinRangeArabic1", function() {
        expect.assertions(1);
        expect(withinRange("\u060A", "Arabic")).toBeTruthy();
    });

    test("WithinRangeArabic2", function() {
        expect.assertions(1);
        expect(withinRange("\u075A", "Arabic")).toBeTruthy();
    });

    test("WithinRangeArabic3", function() {
        expect.assertions(1);
        expect(withinRange("\uFB5A", "Arabic")).toBeTruthy();
    });

    test("WithinRangeArabic4", function() {
        expect.assertions(1);
        expect(withinRange("\uFE7A", "Arabic")).toBeTruthy();
    });

    test("WithinRangeDevanagari1", function() {
        expect.assertions(1);
        expect(withinRange("\u090A", "Devanagari")).toBeTruthy();
    });

    test("WithinRangeDevanagari2", function() {
        expect.assertions(1);
        expect(withinRange("\uA8EA", "Devanagari")).toBeTruthy();
    });

    test("WithinRangeMyanmar1", function() {
        expect.assertions(1);
        expect(withinRange("\u100A", "Myanmar")).toBeTruthy();
    });

    test("WithinRangeMyanmar2", function() {
        expect.assertions(1);
        expect(withinRange("\uAA6A", "Myanmar")).toBeTruthy();
    });

    test("WithinRangeHangul1", function() {
        expect.assertions(1);
        expect(withinRange("\u110A", "Hangul")).toBeTruthy();
    });

    test("WithinRangeHangul2", function() {
        expect.assertions(1);
        expect(withinRange("\uAC0A", "Hangul")).toBeTruthy();
    });

    test("WithinRangeHangul3", function() {
        expect.assertions(1);
        expect(withinRange("\uA96A", "Hangul")).toBeTruthy();
    });

    test("WithinRangeHangul4", function() {
        expect.assertions(1);
        expect(withinRange("\uD7BA", "Hangul")).toBeTruthy();
    });

    test("WithinRangeHangul5", function() {
        expect.assertions(1);
        expect(withinRange("\u313A", "Hangul")).toBeTruthy();
    });

    test("WithinRangeEthiopic1", function() {
        expect.assertions(1);
        expect(withinRange("\u120A", "Ethiopic")).toBeTruthy();
    });

    test("WithinRangeEthiopic2", function() {
        expect.assertions(1);
        expect(withinRange("\u2D8A", "Ethiopic")).toBeTruthy();
    });

    test("WithinRangeEthiopic3", function() {
        expect.assertions(1);
        expect(withinRange("\uAB0A", "Ethiopic")).toBeTruthy();
    });

    test("WithinRangeCanadian1", function() {
        expect.assertions(1);
        expect(withinRange("\u140A", "Canadian")).toBeTruthy();
    });

    test("WithinRangeCanadian2", function() {
        expect.assertions(1);
        expect(withinRange("\u18BA", "Canadian")).toBeTruthy();
    });

    test("WithinRangeCombining1", function() {
        expect.assertions(1);
        expect(withinRange("\u030A", "Combining")).toBeTruthy();
    });

    test("WithinRangeCombining2", function() {
        expect.assertions(1);
        expect(withinRange("\u1DCA", "Combining")).toBeTruthy();
    });

    test("WithinRangeCombining3", function() {
        expect.assertions(1);
        expect(withinRange("\u20DA", "Combining")).toBeTruthy();
    });

    test("WithinRangeArrows1", function() {
        expect.assertions(1);
        expect(withinRange("\u219A", "Arrows")).toBeTruthy();
    });

    test("WithinRangeArrows2", function() {
        expect.assertions(1);
        expect(withinRange("\u2B0A", "Arrows")).toBeTruthy();
    });

    test("WithinRangeArrows3", function() {
        expect.assertions(1);
        expect(withinRange("\u27FA", "Arrows")).toBeTruthy();
    });

    test("WithinRangeArrows4", function() {
        expect.assertions(1);
        expect(withinRange("\u290A", "Arrows")).toBeTruthy();
    });

    test("WithinRangeCJK1", function() {
        expect.assertions(1);
        expect(withinRange("\u4E0A", "CJK")).toBeTruthy();
    });

    test("WithinRangeCJK2", function() {
        expect.assertions(1);
        expect(withinRange("\u340A", "CJK")).toBeTruthy();
    });

    test("WithinRangeCJK3", function() {
        expect.assertions(1);
        expect(withinRange("\u2FFA", "CJK")).toBeTruthy();
    });

    test("WithinRangeCJKCompatibility1", function() {
        expect.assertions(1);
        expect(withinRange("\u330A", "CJKCompatibility")).toBeTruthy();
    });

    test("WithinRangeCJKCompatibility2", function() {
        expect.assertions(1);
        expect(withinRange("\uF90A", "CJKCompatibility")).toBeTruthy();
    });

    test("WithinRangeCJKCompatibility3", function() {
        expect.assertions(1);
        expect(withinRange("\uFE3A", "CJKCompatibility")).toBeTruthy();
    });

    test("WithinRangeMathematical1", function() {
        expect.assertions(1);
        expect(withinRange("\u27CA", "Mathematical")).toBeTruthy();
    });

    test("WithinRangeMathematical2", function() {
        expect.assertions(1);
        expect(withinRange("\u298A", "Mathematical")).toBeTruthy();
    });

    test("WithinRangePrivateUse", function() {
        expect.assertions(1);
        expect(withinRange("\uE00A", "PrivateUse")).toBeTruthy();
    });

    test("WithinRangeVariations", function() {
        expect.assertions(1);
        expect(withinRange("\uFE0A", "Variations")).toBeTruthy();
    });

    test("WithinRangeBamum", function() {
        expect.assertions(1);
        expect(withinRange("\uA6AA", "Bamum")).toBeTruthy();
    });

    test("WithinRangeGeorgian", function() {
        expect.assertions(1);
        expect(withinRange("\u10AA", "Georgian")).toBeTruthy();
    });

    test("WithinRangeGeorgian", function() {
        expect.assertions(1);
        expect(withinRange("\u2D0A", "Georgian")).toBeTruthy();
    });

    test("WithinRangePunctuation1", function() {
        expect.assertions(1);
        expect(withinRange("\u200A", "Punctuation")).toBeTruthy();
    });

    test("WithinRangePunctuation2", function() {
        expect.assertions(1);
        expect(withinRange("\u2E0A", "Punctuation")).toBeTruthy();
    });

    test("WithinRangeKatakana1", function() {
        expect.assertions(1);
        expect(withinRange("\u30AA", "Katakana")).toBeTruthy();
    });

    test("WithinRangeKatakana2", function() {
        expect.assertions(1);
        expect(withinRange("\u31FA", "Katakana")).toBeTruthy();
    });

    test("WithinRangeBopomofo1", function() {
        expect.assertions(1);
        expect(withinRange("\u310A", "Bopomofo")).toBeTruthy();
    });

    test("WithinRangeBopomofo2", function() {
        expect.assertions(1);
        expect(withinRange("\u31AA", "Bopomofo")).toBeTruthy();
    });

    test("WithinRangeEnclosedAlpha", function() {
        expect.assertions(1);
        expect(withinRange("\u246A", "EnclosedAlpha")).toBeTruthy();
    });

    test("WithinRangeCJKRadicals1", function() {
        expect.assertions(1);
        expect(withinRange("\u2E8A", "CJKRadicals")).toBeTruthy();
    });

    test("WithinRangeCJKRadicals2", function() {
        expect.assertions(1);
        expect(withinRange("\u2F0A", "CJKRadicals")).toBeTruthy();
    });

    test("WithinRangeYi1", function() {
        expect.assertions(1);
        expect(withinRange("\uA00A", "Yi")).toBeTruthy();
    });

    test("WithinRangeYi2", function() {
        expect.assertions(1);
        expect(withinRange("\uA49A", "Yi")).toBeTruthy();
    });

    test("WithinRangeEnclosedCJK", function() {
        expect.assertions(1);
        expect(withinRange("\u320A", "EnclosedCJK")).toBeTruthy();
    });

    test("WithinRangeSpacing", function() {
        expect.assertions(1);
        expect(withinRange("\u02BA", "Spacing")).toBeTruthy();
    });

    test("WithinRangeArmenian", function() {
        expect.assertions(1);
        expect(withinRange("\u053A", "Armenian")).toBeTruthy();
    });

    test("WithinRangeHebrew", function() {
        expect.assertions(1);
        expect(withinRange("\u059A", "Hebrew")).toBeTruthy();
    });

    test("WithinRangeSyriac", function() {
        expect.assertions(1);
        expect(withinRange("\u070A", "Syriac")).toBeTruthy();
    });

    test("WithinRangeThaana", function() {
        expect.assertions(1);
        expect(withinRange("\u078A", "Thaana")).toBeTruthy();
    });

    test("WithinRangeNKo", function() {
        expect.assertions(1);
        expect(withinRange("\u07CA", "NKo")).toBeTruthy();
    });

    test("WithinRangeSamaritan", function() {
        expect.assertions(1);
        expect(withinRange("\u080A", "Samaritan")).toBeTruthy();
    });

    test("WithinRangeMandaic", function() {
        expect.assertions(1);
        expect(withinRange("\u084A", "Mandaic")).toBeTruthy();
    });

    test("WithinRangeBengali", function() {
        expect.assertions(1);
        expect(withinRange("\u098A", "Bengali")).toBeTruthy();
    });

    test("WithinRangeGurmukhi", function() {
        expect.assertions(1);
        expect(withinRange("\u0A0A", "Gurmukhi")).toBeTruthy();
    });

    test("WithinRangeGujarati", function() {
        expect.assertions(1);
        expect(withinRange("\u0A8A", "Gujarati")).toBeTruthy();
    });

    test("WithinRangeOriya", function() {
        expect.assertions(1);
        expect(withinRange("\u0B0A", "Oriya")).toBeTruthy();
    });

    test("WithinRangeTamil", function() {
        expect.assertions(1);
        expect(withinRange("\u0B8A", "Tamil")).toBeTruthy();
    });

    test("WithinRangeTelugu", function() {
        expect.assertions(1);
        expect(withinRange("\u0C0A", "Telugu")).toBeTruthy();
    });

    test("WithinRangeKannada", function() {
        expect.assertions(1);
        expect(withinRange("\u0C8A", "Kannada")).toBeTruthy();
    });

    test("WithinRangeMalayalam", function() {
        expect.assertions(1);
        expect(withinRange("\u0D0A", "Malayalam")).toBeTruthy();
    });

    test("WithinRangeSinhala", function() {
        expect.assertions(1);
        expect(withinRange("\u0D8A", "Sinhala")).toBeTruthy();
    });

    test("WithinRangeThai", function() {
        expect.assertions(1);
        expect(withinRange("\u0E0A", "Thai")).toBeTruthy();
    });

    test("WithinRangeLao", function() {
        expect.assertions(1);
        expect(withinRange("\u0E8A", "Lao")).toBeTruthy();
    });

    test("WithinRangeTibetan", function() {
        expect.assertions(1);
        expect(withinRange("\u0F0A", "Tibetan")).toBeTruthy();
    });

    test("WithinRangeCherokee", function() {
        expect.assertions(1);
        expect(withinRange("\u13AA", "Cherokee")).toBeTruthy();
    });

    test("WithinRangeOgham", function() {
        expect.assertions(1);
        expect(withinRange("\u168A", "Ogham")).toBeTruthy();
    });

    test("WithinRangeRunic", function() {
        expect.assertions(1);
        expect(withinRange("\u16AA", "Runic")).toBeTruthy();
    });

    test("WithinRangeTagalog", function() {
        expect.assertions(1);
        expect(withinRange("\u170A", "Tagalog")).toBeTruthy();
    });

    test("WithinRangeHanunoo", function() {
        expect.assertions(1);
        expect(withinRange("\u172A", "Hanunoo")).toBeTruthy();
    });

    test("WithinRangeBuhid", function() {
        expect.assertions(1);
        expect(withinRange("\u174A", "Buhid")).toBeTruthy();
    });

    test("WithinRangeTagbanwa", function() {
        expect.assertions(1);
        expect(withinRange("\u176A", "Tagbanwa")).toBeTruthy();
    });

    test("WithinRangeKhmer", function() {
        expect.assertions(1);
        expect(withinRange("\u178A", "Khmer")).toBeTruthy();
    });

    test("WithinRangeMongolian", function() {
        expect.assertions(1);
        expect(withinRange("\u180A", "Mongolian")).toBeTruthy();
    });

    test("WithinRangeLimbu", function() {
        expect.assertions(1);
        expect(withinRange("\u190A", "Limbu")).toBeTruthy();
    });

    test("WithinRangeTaiLe", function() {
        expect.assertions(1);
        expect(withinRange("\u195A", "TaiLe")).toBeTruthy();
    });

    test("WithinRangeNewTaiLue", function() {
        expect.assertions(1);
        expect(withinRange("\u198A", "NewTaiLue")).toBeTruthy();
    });

    test("WithinRangeKhmerSymbols", function() {
        expect.assertions(1);
        expect(withinRange("\u19EA", "KhmerSymbols")).toBeTruthy();
    });

    test("WithinRangeBuginese", function() {
        expect.assertions(1);
        expect(withinRange("\u1A0A", "Buginese")).toBeTruthy();
    });

    test("WithinRangeTaiTham", function() {
        expect.assertions(1);
        expect(withinRange("\u1A2A", "TaiTham")).toBeTruthy();
    });

    test("WithinRangeBalinese", function() {
        expect.assertions(1);
        expect(withinRange("\u1B0A", "Balinese")).toBeTruthy();
    });

    test("WithinRangeSundanese", function() {
        expect.assertions(1);
        expect(withinRange("\u1B8A", "Sundanese")).toBeTruthy();
    });

    test("WithinRangeBatak", function() {
        expect.assertions(1);
        expect(withinRange("\u1BCA", "Batak")).toBeTruthy();
    });

    test("WithinRangeLepcha", function() {
        expect.assertions(1);
        expect(withinRange("\u1C0A", "Lepcha")).toBeTruthy();
    });

    test("WithinRangeOlChiki", function() {
        expect.assertions(1);
        expect(withinRange("\u1C5A", "OlChiki")).toBeTruthy();
    });

    test("WithinRangeVedic", function() {
        expect.assertions(1);
        expect(withinRange("\u1CDA", "Vedic")).toBeTruthy();
    });

    test("WithinRangeSuperSub", function() {
        expect.assertions(1);
        expect(withinRange("\u207A", "SuperSub")).toBeTruthy();
    });

    test("WithinRangeCurrency", function() {
        expect.assertions(1);
        expect(withinRange("\u20AA", "Currency")).toBeTruthy();
    });

    test("WithinRangeLetterlike", function() {
        expect.assertions(1);
        expect(withinRange("\u210A", "Letterlike")).toBeTruthy();
    });

    test("WithinRangeNumbers", function() {
        expect.assertions(1);
        expect(withinRange("\u215A", "Numbers")).toBeTruthy();
    });

    test("WithinRangeMisc", function() {
        expect.assertions(1);
        expect(withinRange("\u230A", "Misc")).toBeTruthy();
    });

    test("WithinRangeControlPictures", function() {
        expect.assertions(1);
        expect(withinRange("\u240A", "ControlPictures")).toBeTruthy();
    });

    test("WithinRangeOCR", function() {
        expect.assertions(1);
        expect(withinRange("\u244A", "OCR")).toBeTruthy();
    });

    test("WithinRangeBox", function() {
        expect.assertions(1);
        expect(withinRange("\u250A", "Box")).toBeTruthy();
    });

    test("WithinRangeBlock", function() {
        expect.assertions(1);
        expect(withinRange("\u258A", "Block")).toBeTruthy();
    });

    test("WithinRangeGeometric", function() {
        expect.assertions(1);
        expect(withinRange("\u25AA", "Geometric")).toBeTruthy();
    });

    test("WithinRangeMiscSymbols", function() {
        expect.assertions(1);
        expect(withinRange("\u260A", "MiscSymbols")).toBeTruthy();
    });

    test("WithinRangeDingbats", function() {
        expect.assertions(1);
        expect(withinRange("\u270A", "Dingbats")).toBeTruthy();
    });

    test("WithinRangeBraille", function() {
        expect.assertions(1);
        expect(withinRange("\u280A", "Braille")).toBeTruthy();
    });

    test("WithinRangeGlagolitic", function() {
        expect.assertions(1);
        expect(withinRange("\u2C0A", "Glagolitic")).toBeTruthy();
    });

    test("WithinRangeCoptic", function() {
        expect.assertions(1);
        expect(withinRange("\u2C8A", "Coptic")).toBeTruthy();
    });

    test("WithinRangeTifinagh", function() {
        expect.assertions(1);
        expect(withinRange("\u2D3A", "Tifinagh")).toBeTruthy();
    });

    test("WithinRangeCJKPunct", function() {
        expect.assertions(1);
        expect(withinRange("\u300A", "CJKPunct")).toBeTruthy();
    });

    test("WithinRangeHiragana", function() {
        expect.assertions(1);
        expect(withinRange("\u304A", "Hiragana")).toBeTruthy();
    });

    test("WithinRangeKanbun", function() {
        expect.assertions(1);
        expect(withinRange("\u319A", "Kanbun")).toBeTruthy();
    });

    test("WithinRangeYijing", function() {
        expect.assertions(1);
        expect(withinRange("\u4DCA", "Yijing")).toBeTruthy();
    });

    test("WithinRangeCJKStrokes", function() {
        expect.assertions(1);
        expect(withinRange("\u31CA", "CJKStrokes")).toBeTruthy();
    });

    test("WithinRangeLisu", function() {
        expect.assertions(1);
        expect(withinRange("\uA4DA", "Lisu")).toBeTruthy();
    });

    test("WithinRangeVai", function() {
        expect.assertions(1);
        expect(withinRange("\uA50A", "Vai")).toBeTruthy();
    });

    test("WithinRangeModifierTone", function() {
        expect.assertions(1);
        expect(withinRange("\uA70A", "ModifierTone")).toBeTruthy();
    });

    test("WithinRangeSylotiNagri", function() {
        expect.assertions(1);
        expect(withinRange("\uA80A", "SylotiNagri")).toBeTruthy();
    });

    test("WithinRangeIndicNumber", function() {
        expect.assertions(1);
        expect(withinRange("\uA83A", "IndicNumber")).toBeTruthy();
    });

    test("WithinRangePhagspa", function() {
        expect.assertions(1);
        expect(withinRange("\uA84A", "Phagspa")).toBeTruthy();
    });

    test("WithinRangeSaurashtra", function() {
        expect.assertions(1);
        expect(withinRange("\uA88A", "Saurashtra")).toBeTruthy();
    });

    test("WithinRangeKayahLi", function() {
        expect.assertions(1);
        expect(withinRange("\uA90A", "KayahLi")).toBeTruthy();
    });

    test("WithinRangeRejang", function() {
        expect.assertions(1);
        expect(withinRange("\uA93A", "Rejang")).toBeTruthy();
    });

    test("WithinRangeJavanese", function() {
        expect.assertions(1);
        expect(withinRange("\uA98A", "Javanese")).toBeTruthy();
    });

    test("WithinRangeCham", function() {
        expect.assertions(1);
        expect(withinRange("\uAA0A", "Cham")).toBeTruthy();
    });

    test("WithinRangeTaiViet", function() {
        expect.assertions(1);
        expect(withinRange("\uAA8A", "TaiViet")).toBeTruthy();
    });

    test("WithinRangeMeeteiMayek", function() {
        expect.assertions(1);
        expect(withinRange("\uABCA", "MeeteiMayek")).toBeTruthy();
    });

    test("WithinRangePresentation", function() {
        expect.assertions(1);
        expect(withinRange("\uFB0A", "Presentation")).toBeTruthy();
    });

    test("WithinRangeVertical", function() {
        expect.assertions(1);
        expect(withinRange("\uFE1A", "Vertical")).toBeTruthy();
    });

    test("WithinRangeHalfMarks", function() {
        expect.assertions(1);
        expect(withinRange("\uFE2A", "HalfMarks")).toBeTruthy();
    });

    test("WithinRangeSmall", function() {
        expect.assertions(1);
        expect(withinRange("\uFE5A", "Small")).toBeTruthy();
    });

    test("WithinRangeWidth", function() {
        expect.assertions(1);
        expect(withinRange("\uFF0A", "Width")).toBeTruthy();
    });

    test("WithinRangeSpecials", function() {
        expect.assertions(1);
        expect(withinRange("\uFFFA", "Specials")).toBeTruthy();
    });
    test("WithinRangedivesakuru", function() {
        expect.assertions(1);
        expect(withinRange("\uD806\uDD10", "dives akuru")).toBeTruthy();
    });
    test("WithinRangeegyptianhieroglyphcontrols", function() {
        expect.assertions(1);
        expect(withinRange("\uD80D\uDC32", "egyptian hieroglyph format controls")).toBeTruthy();
    });
    test("WithinRangeCopticnumber", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x102e0);
        expect(withinRange(str, "copticnumber")).toBeTruthy();
    });

    test("WithinRangeOldpermic", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x10350);
        expect(withinRange(str, "oldpermic")).toBeTruthy();
    });

    test("WithinRangeAlbanian", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x10530);
        expect(withinRange(str, "albanian")).toBeTruthy();
    });

    test("WithinRangeLineara", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x10600);
        expect(withinRange(str, "lineara")).toBeTruthy();
    });

    test("WithinRangeMeroitic", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x109a0);
        expect(withinRange(str, "meroitic")).toBeTruthy();
    });

    test("WithinRangeLowsurrogates", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0xdc00);
        expect(withinRange(str, "lowsurrogates")).toBeTruthy();
    });

    test("WithinRangeOldhungarian", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x10c80);
        expect(withinRange(str, "oldhungarian")).toBeTruthy();
    });

    test("WithinRangeSorasopeng", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x110d0);
        expect(withinRange(str, "sorasompeng")).toBeTruthy();
    });

    test("WithinRangeWarangciti", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x118a0);
        expect(withinRange(str, "warangciti")).toBeTruthy();
    });

    test("WithinRangePaucinhau", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x11ac0);
        expect(withinRange(str, "paucinhau")).toBeTruthy();
    });

    test("WithinRangeBassavah", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x16ad0);
        expect(withinRange(str, "bassavah")).toBeTruthy();
    });

    test("WithinRangePahawhhmong", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x16b00);
        expect(withinRange(str, "pahawhhmong")).toBeTruthy();
    });

    test("WithinRangeShorthandformat", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x1bca0);
        expect(withinRange(str, "shorthandformat")).toBeTruthy();
    });

    test("WithinRangeSurronsingwriting", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x1d800);
        expect(withinRange(str, "suttonsignwriting")).toBeTruthy();
    });

    test("WithinRangePictographs1", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x1f300);
        expect(withinRange(str, "pictographs")).toBeTruthy();
    });

    test("WithinRangePictographs2", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x1f9ff);
        expect(withinRange(str, "pictographs")).toBeTruthy();
    });

    test("WithinRangeOrnamentaldingbats", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x1f650);
        expect(withinRange(str, "ornamentaldingbats")).toBeTruthy();
    });

    test("WithinRangeCyrillic", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x1c80);
        expect(withinRange(str, "cyrillic")).toBeTruthy();
    });

    test("WithinRangeMongolian", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x11660);
        expect(withinRange(str, "mongolian")).toBeTruthy();
    });

    test("WithinRangeTangut1", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x16fe0);
        expect(withinRange(str, "tangut")).toBeTruthy();
    });

    test("WithinRangeTangut2", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x17000);
        expect(withinRange(str, "tangut")).toBeTruthy();
    });

    test("WithinRangeTangut3", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x18800);
        expect(withinRange(str, "tangut")).toBeTruthy();
    });

    test("WithinRangeGlagolitic", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x1e000);
        expect(withinRange(str, "glagolitic")).toBeTruthy();
    });
    test("WithinRangeElymaic", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x10feb);
        expect(withinRange(str, "elymaic")).toBeTruthy();
    });
    test("WithinRangechorasmian", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x10fb3);
        expect(withinRange(str, "chorasmian")).toBeTruthy();
    });
    test("WithinRangedivesAkuru", function() {
        expect.assertions(1);
        var str = JSUtils.fromCodePoint(0x11911);
        expect(withinRange(str, "dives akuru")).toBeTruthy();
    });
    test("IsScriptTrue", function() {
        expect.assertions(8);
        expect(isScript("a", "Latn")).toBeTruthy();
        expect(isScript("Д", "Cyrl")).toBeTruthy();
        expect(isScript("ώ", "Grek")).toBeTruthy();
        expect(isScript("귋", "Hang")).toBeTruthy();
        expect(isScript("㜴", "Hani")).toBeTruthy();
        expect(isScript("ש", "Hebr")).toBeTruthy();
        expect(isScript("ش", "Arab")).toBeTruthy();
        expect(isScript("झ", "Deva")).toBeTruthy();
    });

    test("IsScriptFalse", function() {
        expect.assertions(8);
        expect(!isScript("a", "Cyrl")).toBeTruthy();
        expect(!isScript("Д", "Grek")).toBeTruthy();
        expect(!isScript("ώ", "Hang")).toBeTruthy();
        expect(!isScript("귋", "Hani")).toBeTruthy();
        expect(!isScript("㜴", "Hebr")).toBeTruthy();
        expect(!isScript("ש", "Arab")).toBeTruthy();
        expect(!isScript("ش", "Deva")).toBeTruthy();
        expect(!isScript("झ", "Latn")).toBeTruthy();
    });

    test("IsScriptEmptyScriptName", function() {
        expect.assertions(1);
        expect(!isScript("a", "")).toBeTruthy();
    });

    test("IsScriptNoScriptName", function() {
        expect.assertions(1);
        expect(!isScript("a")).toBeTruthy();
    });

    test("IsScriptEmptyChar", function() {
        expect.assertions(1);
        expect(!isScript("", "Cyrl")).toBeTruthy();
    });

    test("IsScriptNoChar", function() {
        expect.assertions(1);
        expect(!isScript(undefined, "Cyrl")).toBeTruthy();
    });

    test("IsScriptNoNothing", function() {
        expect.assertions(1);
        expect(!isScript(undefined, undefined)).toBeTruthy();
    });
});
