/*
 * search.test.js - test the search utility routines
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

import * as SearchUtils from '../src/SearchUtils.js';

function strcmp(left, right) {
    return left.localeCompare(right);
}

describe("testSearch", () => {
    test("Bsearch", () => {
        expect.assertions(1);
        var array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

        expect(SearchUtils.bsearch(10, array)).toBe(5);
    });

    test("BsearchEmptyArray", () => {
        expect.assertions(1);
        var array = [];

        expect(SearchUtils.bsearch(10, array)).toBe(0);
    });

    test("BsearchUndefinedArray", () => {
        expect.assertions(1);
        expect(SearchUtils.bsearch(10, undefined)).toBe(-1);
    });

    test("BsearchUndefinedTarget", () => {
        expect.assertions(1);
        var array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

        expect(SearchUtils.bsearch(undefined, array)).toBe(-1);
    });

    test("BsearchBefore", () => {
        expect.assertions(1);
        var array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

        expect(SearchUtils.bsearch(0, array)).toBe(0);
    });

    test("BsearchAfter", () => {
        expect.assertions(1);
        var array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

        expect(SearchUtils.bsearch(20, array)).toBe(10);
    });

    test("BsearchExact", () => {
        expect.assertions(1);
        var array = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

        // place it right after the exact match
        expect(SearchUtils.bsearch(15, array)).toBe(7);
    });

    test("BsearchExactBeginning", () => {
        expect.assertions(1);
        var array = [0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

        // place it right after the exact match
        expect(SearchUtils.bsearch(0, array)).toBe(0);
    });

    test("BsearchExactEnd", () => {
        expect.assertions(1);
        var array = [0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];

        // place it right after the exact match
        expect(SearchUtils.bsearch(19, array)).toBe(10);
    });

    test("BsearchMonthEdge", () => {
        expect.assertions(1);
        var array = [0,31,60,91,121,152,182,213,244,274,305,335,366];

        expect(SearchUtils.bsearch(182, array)).toBe(6);
    });

    test("BsearchStrings", () => {
        expect.assertions(1);
        var array = [
            "barley",
            "cardomum",
            "eggs",
            "garlic",
            "jackfruit",
            "limes",
            "orange",
            "quince",
            "spaghetti",
            "veal"
        ];

        expect(SearchUtils.bsearch("mango", array, strcmp)).toBe(6);
    });

    test("BsearchStringsBefore", () => {
        expect.assertions(1);
        var array = [
            "barley",
            "cardomum",
            "eggs",
            "garlic",
            "jackfruit",
            "limes",
            "orange",
            "quince",
            "spaghetti",
            "veal"
        ];

        expect(SearchUtils.bsearch("apple", array, strcmp)).toBe(0);
    });

    test("BsearchStringsAfter", () => {
        expect.assertions(1);
        var array = [
            "barley",
            "cardomum",
            "eggs",
            "garlic",
            "jackfruit",
            "limes",
            "orange",
            "quince",
            "spaghetti",
            "veal"
        ];

        expect(SearchUtils.bsearch("zucchini", array, strcmp)).toBe(10);
    });

    test("BisectionSearchSimple", () => {
        var actual = SearchUtils.bisectionSearch(16, 0, 10, 1e-12, function linear(x) {
            return 2 * x + 5;
        });
        expect.assertions(1);
        expect(actual).toBeCloseTo(5.5, 1e-12);
    });

    test("BisectionSearchMoreComplex", () => {
        var actual = SearchUtils.bisectionSearch(16, 0, 10, 1e-12, function square(x) {
            return x * x;
        });
        expect.assertions(1);
        expect(actual).toBeCloseTo(4, 1e-12);
    });

    test("BisectionSearchTrig", () => {
        var actual = SearchUtils.bisectionSearch(0.5, 0, 90, 1e-11, function sinInDegrees(x) {
            return Math.sin(x * Math.PI / 180);
        });
        expect.assertions(1);
        expect(actual).toBeCloseTo(30, 1e-9);
    });

    test("BisectionSearchVeryComplex", () => {
        var actual = SearchUtils.bisectionSearch(0, -0.9, 0, 1e-13, function polynomial(x) {
            var coeff = [2, 5, 3];
            var xpow = 1;
            var ret = 0;
            for (var i = 0; i < coeff.length; i++) {
                ret += coeff[i] * xpow;
                xpow *= x;
            }
            return ret;
        });
        expect(actual).toBeCloseTo(-0.66666666666666, 1e-13);
    });
});
