/*
 * math.test.js - test the math utility routines
 *
 * Copyright © 2012-2015, 2017-2019, 2023 2021- 2022-2023JEDLSoft
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

import Locale from 'ilib-locale';

import * as Utils from '../src/Utils.js';
import * as MathUtils from '../src/MathUtils.js';
import * as JSUtils from '../src/JSUtils.js';
import ISet from '../src/ISet.js';

function strcmp(left, right) {
    return left.localeCompare(right);
}

let set = new ISet();

describe("testMathUtils", () => {
    test("ModSimple", () => {
        expect.assertions(1);
        expect(MathUtils.mod(2, 4)).toBe(2);
    });

    test("ModWrap", () => {
        expect.assertions(1);
        expect(MathUtils.mod(6, 4)).toBe(2);
    });

    test("ModWrapNeg", () => {
        expect.assertions(1);
        expect(MathUtils.mod(-6, 4)).toBe(2);
    });

    test("ModZeroModulus", () => {
        expect.assertions(1);
        expect(MathUtils.mod(6, 0)).toBe(0);
    });

    test("ModZeroNum", () => {
        expect.assertions(1);
        expect(MathUtils.mod(0, 6)).toBe(0);
    });

    test("ModReal", () => {
        expect.assertions(1);
        let actual = MathUtils.mod(2.234231, 4);
        expect(actual).toBeCloseTo(2.234231, 0.0000001);
    });

    test("ModRealWrap", () => {
        expect.assertions(1);
        let actual = MathUtils.mod(6.234231, 4);
        expect(actual).toBeCloseTo(2.234231, 0.0000001);
    });

    test("ModRealNeg", () => {
        expect.assertions(1);
        let actual = MathUtils.mod(-6.3, 4);
        expect(actual).toBeCloseTo(1.7, 0.0000001);
    });

    test("AmodSimple", () => {
        expect.assertions(1);
        expect(MathUtils.amod(2, 4)).toBe(2);
    });

    test("AmodWrap", () => {
        expect.assertions(1);
        expect(MathUtils.amod(6, 4)).toBe(2);
    });

    test("AmodWrapNeg", () => {
        expect.assertions(1);
        expect(MathUtils.amod(-6, 4)).toBe(2);
    });

    test("AmodZeroModulus", () => {
        expect.assertions(1);
        expect(MathUtils.amod(6, 0)).toBe(0);
    });

    test("AmodZeroNum", () => {
        expect.assertions(1);
        expect(MathUtils.amod(0, 6)).toBe(6);
    });

    test("AmodReal", () => {
        expect.assertions(1);
        let actual = MathUtils.amod(2.234231, 4);
        expect(actual).toBeCloseTo(2.234231, 0.0000001);
    });

    test("AmodRealWrap", () => {
        expect.assertions(1);
        let actual = MathUtils.amod(6.234231, 4);
        expect(actual).toBeCloseTo(2.234231, 0.0000001);
    });

    test("AmodRealNeg", () => {
        expect.assertions(1);
        let actual = MathUtils.amod(-6.3, 4);
        expect(actual).toBeCloseTo(1.7, 0.0000001);
    });

    test("Log10", () => {
        expect.assertions(1);
        expect(Math.floor(MathUtils.log10(12345))).toBe(4);
    });

    test("Log10two", () => {
        expect.assertions(1);
        expect(Math.floor(MathUtils.log10(987654321))).toBe(8);
    });

    test("Significant1", () => {
        expect.assertions(1);
        expect(MathUtils.significant(12345, 3)).toBe(12300);
    });

    test("Significant2", () => {
        expect.assertions(1);
        expect(MathUtils.significant(12345, 2)).toBe(12000);
    });

    test("Significant3", () => {
        expect.assertions(1);
        expect(MathUtils.significant(12345, 1)).toBe(10000);
    });

    test("SignificantZero", () => {
        expect.assertions(1);
        expect(MathUtils.significant(12345, 0)).toBe(12345);
    });

    test("SignificantNegativeDigits", () => {
        expect.assertions(1);
        expect(MathUtils.significant(12345, -234)).toBe(12345);
    });

    test("SignificantNegativeNumber", () => {
        expect.assertions(1);
        expect(MathUtils.significant(-12345, 4)).toBe(-12340);
    });

    test("SignificantStradleDecimal", () => {
        expect.assertions(1);
        expect(MathUtils.significant(12.345, 4)).toBe(12.35);
    });

    test("SignificantLessThanOne", () => {
        expect.assertions(1);
        expect(MathUtils.significant(0.123456, 2)).toBe(0.12);
    });

    test("SignificantLessThanOneRound", () => {
        expect.assertions(1);
        expect(MathUtils.significant(0.123456, 4)).toBe(0.1235);
    });

    test("SignificantLessThanOneSmall", () => {
        expect.assertions(1);
        expect(MathUtils.significant(0.000123456, 2)).toBe(0.00012);
    });

    test("SignificantZero", () => {
        expect.assertions(1);
        expect(MathUtils.significant(0, 2)).toBe(0);
    });

    test("SignumPositive", () => {
        expect.assertions(1);
        expect(MathUtils.signum(1)).toBe(1);
    });

    test("SignumPositiveLarge", () => {
        expect.assertions(1);
        expect(MathUtils.signum(1345234)).toBe(1);
    });

    test("SignumNegative", () => {
        expect.assertions(1);
        expect(MathUtils.signum(-1)).toBe(-1);
    });

    test("SignumPositiveLarge", () => {
        expect.assertions(1);
        expect(MathUtils.signum(-13234)).toBe(-1);
    });

    test("SignumZero", () => {
        expect.assertions(1);
        expect(MathUtils.signum(0)).toBe(1);
    });

    test("SignumStringNumberPositive", () => {
        expect.assertions(1);
        expect(MathUtils.signum("1345234")).toBe(1);
    });

    test("SignumStringNumberNegative", () => {
        expect.assertions(1);
        expect(MathUtils.signum("-1345234")).toBe(-1);
    });

    test("SignumUndefined", () => {
        expect.assertions(1);
        expect(MathUtils.signum()).toBe(1);
    });

    test("SignumNull", () => {
        expect.assertions(1);
        expect(MathUtils.signum(null)).toBe(1);
    });

    test("SignumStringNonNumber", () => {
        expect.assertions(1);
        expect(MathUtils.signum("rafgasdf")).toBe(1);
    });

    test("SignumBoolean", () => {
        expect.assertions(2);
        expect(MathUtils.signum(true)).toBe(1);
        expect(MathUtils.signum(false)).toBe(1);
    });

    test("SignumFunction", () => {
        expect.assertions(1);
        expect(MathUtils.signum(function () { return -4; })).toBe(1);
    });
});
