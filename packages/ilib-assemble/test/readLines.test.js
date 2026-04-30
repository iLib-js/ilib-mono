/*
 * readLines.test.js - test the readLines utility
 *
 * Copyright © 2026 JEDLSoft
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

import readLines from '../src/readLines.js';

describe("testReadLines", () => {
    test("ReadLinesAppendsSuffixToLinesWithoutJs", () => {
        expect.assertions(2);
        const set = new Set();
        readLines("test/testfiles/ilib-all-inc.js", set);
        expect(set.has("DateFmt.js")).toBeTruthy();
        expect(set.has("LocaleInfo.js")).toBeTruthy();
    });

    test("ReadLinesDoesNotDoubleSuffixForLinesWithJs", () => {
        expect.assertions(2);
        const set = new Set();
        readLines("test/testfiles/ilib-inc-mixed.js", set);
        expect(set.has("ilib-mock.js")).toBeTruthy();
        expect(set.has("ilib-mock.js.js")).toBeFalsy();
    });

    test("ReadLinesMixedSuffixNormalized", () => {
        expect.assertions(4);
        const set = new Set();
        readLines("test/testfiles/ilib-inc-mixed.js", set);
        expect(set.has("ilib-mock.js")).toBeTruthy();
        expect(set.has("ilib-common.js")).toBeTruthy();
        expect(set.has("ilib-locale.js")).toBeTruthy();
        expect(set.has("ilib-something.js")).toBeTruthy();
    });

    test("ReadLinesSkipsEmptyLines", () => {
        expect.assertions(3);
        const set = new Set();
        readLines("test/testfiles/ilib-inc-empty.js", set);
        expect(set.size).toBe(3);
        expect(set.has("ilib-mock.js")).toBeTruthy();
        expect(set.has("ilib-common.js")).toBeTruthy();
    });

    test("ReadLinesTrimsWhitespace", () => {
        expect.assertions(3);
        const set = new Set();
        readLines("test/testfiles/ilib-inc-whitespace.js", set);
        expect(set.has("ilib-mock.js")).toBeTruthy();
        expect(set.has("ilib-common.js")).toBeTruthy();
        expect(set.has("ilib-locale.js")).toBeTruthy();
    });

    test("ReadLinesNoUntrimmedKeysInSet", () => {
        expect.assertions(1);
        const set = new Set();
        readLines("test/testfiles/ilib-inc-whitespace.js", set);
        const hasUntrimmed = [...set].some(entry => entry !== entry.trim());
        expect(hasUntrimmed).toBeFalsy();
    });

    test("ReadLinesAddsToExistingSet", () => {
        expect.assertions(3);
        const set = new Set(["existing.js"]);
        readLines("test/testfiles/ilib-all-inc.js", set);
        expect(set.has("existing.js")).toBeTruthy();
        expect(set.has("LocaleInfo.js")).toBeTruthy();
        expect(set.has("DateFmt.js")).toBeTruthy();
    });

    test("ReadLinesDeduplicatesEntries", () => {
        expect.assertions(1);
        const set = new Set();
        readLines("test/testfiles/ilib-all-inc.js", set);
        readLines("test/testfiles/ilib-all-inc.js", set);
        expect(set.size).toBe(2);
    });

    test("ReadLinesThrowsOnNonexistentFile", () => {
        expect.assertions(1);
        const set = new Set();
        expect(() => readLines("test/testfiles/nonexistent.js", set)).toThrow();
    });
});
