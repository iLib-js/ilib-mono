/*
 * RuleUtils.test.js - test the rule utility functions
 *
 * Copyright ©  2022-2023JEDLSoft
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
import { stripPlurals } from '../src/rules/utils.js';

describe("testRuleUtils", () => {
    test("StripPlurals", () => {
        expect.assertions(1);

        const actual = stripPlurals("this is a test", "en-US");
        const expected = "this is a test";

        expect(actual).toBe(expected);
    });

    test("StripPluralsStrip", () => {
        expect.assertions(1);

        const actual = stripPlurals("text {count, plural, one {a} other {b}} text", "en-US");
        const expected = "text  text";

        expect(actual).toBe(expected);
    });

    test("StripPluralsStripWithParams", () => {
        expect.assertions(1);

        const actual = stripPlurals("text {count, plural, one {test {x} test} other {tester {y} tester}} text", "en-US");
        const expected = "text  text";

        expect(actual).toBe(expected);
    });

    test("StripPluralsStripWithQuotes", () => {
        expect.assertions(1);

        const actual = stripPlurals("text {count, plural, one {This is 'quoted' text} other {More \"quotes\"}} text", "en-US");
        const expected = "text  text";

        expect(actual).toBe(expected);
    });

    test("StripPluralsStripRussian", () => {
        expect.assertions(1);

        const actual = stripPlurals("text {count, plural, one {a} few{c} other {b}} text", "ru-RU");
        const expected = "text  text";

        expect(actual).toBe(expected);
    });

    test("StripPluralsStripSelect", () => {
        expect.assertions(1);

        const actual = stripPlurals("text {gender, select, male {a} female {c} other {d}} text", "ja-JP");
        const expected = "text  text";

        expect(actual).toBe(expected);
    });
});

