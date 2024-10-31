/*
 * ResultComparator.test.js - test the Result comparator function
 *
 * Copyright © 2023-2024 JEDLSoft
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
import { Result } from 'ilib-lint-common'

import ResultComparator from '../src/ResultComparator.js';

describe("the result comparator function", () => {
    test("sort by file path", async () => {
        expect.assertions(1);

        const results = [
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "b/b/c.js",
                lineNumber: 12,
                rule: {}
            }),
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "d/b/c.js",
                lineNumber: 10,
                rule: {}
            }),
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "a/b/c.js",
                lineNumber: 2,
                rule: {}
            }),
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "c/b/c.js",
                lineNumber: 5,
                rule: {}
            }),
        ];
        const expected = [
            results[2],
            results[0],
            results[3],
            results[1]
        ];

        // the slice causes the JS engine to make a shallow copy of the
        // array so that we can test against the original results properly
        const actual = results.slice().sort(ResultComparator);
        expect(actual).toStrictEqual(expected);
    });

    test("sort by line number within a file path", async () => {
        expect.assertions(1);

        const results = [
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "a/b/c.js",
                lineNumber: 12,
                rule: {}
            }),
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "a/b/c.js",
                lineNumber: 10,
                rule: {}
            }),
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "a/b/c.js",
                lineNumber: 2,
                rule: {}
            }),
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "a/b/c.js",
                lineNumber: 5,
                rule: {}
            }),
        ];
        const expected = [
            results[2],
            results[3],
            results[1],
            results[0]
        ];
        // the slice causes the JS engine to make a shallow copy of the
        // array so that we can test against the original results properly
        const actual = results.slice().sort(ResultComparator);
        expect(actual).toStrictEqual(expected);
    });

    test("sort by file path and line number", async () => {
        expect.assertions(1);

        const results = [
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "x/b/c.js",
                lineNumber: 12,
                rule: {}
            }),
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "x/b/c.js",
                lineNumber: 1,
                rule: {}
            }),
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "x/b/c.js",
                lineNumber: 10,
                rule: {}
            }),
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "a/b/c.js",
                lineNumber: 2,
                rule: {}
            }),
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "a/b/c.js",
                lineNumber: 18,
                rule: {}
            }),
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "a/b/c.js",
                lineNumber: 5,
                rule: {}
            }),
        ];
        const expected = [
            results[3],
            results[5],
            results[4],
            results[1],
            results[2],
            results[0]
        ];
        // the slice causes the JS engine to make a shallow copy of the
        // array so that we can test against the original results properly
        const actual = results.slice().sort(ResultComparator);
        expect(actual).toStrictEqual(expected);
    });

    test("results with no line number", async () => {
        expect.assertions(1);

        const results = [
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "a/b/c.js",
                lineNumber: 12,
                rule: {}
            }),
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "a/b/c.js",
                rule: {}
            }),
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "a/b/c.js",
                lineNumber: 2,
                rule: {}
            }),
            new Result({
                severity: "error",
                description: "some sort of error",
                pathName: "a/b/c.js",
                lineNumber: 5,
                rule: {}
            }),
        ];
        // the one with no line number goes first
        const expected = [
            results[1],
            results[2],
            results[3],
            results[0]
        ];
        // the slice causes the JS engine to make a shallow copy of the
        // array so that we can test against the original results properly
        const actual = results.slice().sort(ResultComparator);
        expect(actual).toStrictEqual(expected);
    });
});

