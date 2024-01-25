/*
 * scan.test.js - test the assemble utility
 *
 * Copyright © 2022, 2024 JEDLSoft
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

import scan, { scanString } from '../src/scan.js';

describe("testscan", () => {
    test("ScanStringImportStatement", () => {
        expect.assertions(2);
        let set = new Set();
        scanString(`import something from 'ilib-something';`, set);
        expect(set.size).toBe(1);
        expect(set.has("ilib-something")).toBeTruthy();
    });

    test("ScanStringImportCall", () => {
        expect.assertions(2);
        let set = new Set();
        scanString(`function foo(asdf) {
                return import("ilib-locale");
            };`, set);
        expect(set.size).toBe(1);
        expect(set.has("ilib-locale")).toBeTruthy();
    });

    test("ScanStringStringRequireCall", () => {
        expect.assertions(2);
        let set = new Set();
        scanString(`function foo(asdf) {
                return require("ilib-locale");
            };`, set);
        expect(set.size).toBe(1);
        expect(set.has("ilib-locale")).toBeTruthy();
    });

    test("ScanStringWhiteSpaceImportStatement", () => {
        expect.assertions(2);
        let set = new Set();
        scanString(
            `import something      from    'ilib-something'   ;
            `, set);
        expect(set.size).toBe(1);
        expect(set.has("ilib-something")).toBeTruthy();
    });

    test("ScanStringWhiteSpaceImportCall", () => {
        expect.assertions(2);
        let set = new Set();
        scanString(
            `function foo(asdf) {
                return import   (    "ilib-locale"  ).then(module => {
                    // do somethign with the module
                });
            };`, set);
        expect(set.size).toBe(1);
        expect(set.has("ilib-locale")).toBeTruthy();
    });

    test("ScanStringWhiteSpaceRequireCall", () => {
        expect.assertions(2);
        let set = new Set();
        scanString(
            `function req(asdf) {
                var name = require   (    "ilib-name"    );
                // do something with name
            };`, set);
        expect(set.size).toBe(1);
        expect(set.has("ilib-name")).toBeTruthy();
    });

    test("ScanStringFalseImportStatement", () => {
        expect.assertions(1);
        let set = new Set();
        scanString(
            `asdfimport something      from    'ilib-something'   ;
            `, set);
        expect(set.size).toBe(0);
    });

    test("ScanStringComplexImportStatement", () => {
        expect.assertions(2);
        let set = new Set();
        scanString(
            `import something, { somethingElse }      from    'ilib-something'   ;
            `, set);
        expect(set.size).toBe(1);
        expect(set.has("ilib-something")).toBeTruthy();
    });

    test("ScanStringFalseImportCall", () => {
        expect.assertions(1);
        let set = new Set();
        scanString(
            `function foo(asdf) {
                return bigimport("ilib-locale").then(module => {
                    // do somethign with the module
                });
            };`, set);
        expect(set.size).toBe(0);
    });

    test("ScanStringFalseRequireCall", () => {
        expect.assertions(1);
        let set = new Set();
        scanString(
            `function req(asdf) {
                var name = bigrequire("ilib-name");
                // do something with name
            };`, set);
        expect(set.size).toBe(0);
    });

    test("ScanImportStatement", () => {
        expect.assertions(3);
        let set = new Set();
        scan("./src/index.js", set);
        expect(set.size).toBe(2);
        expect(set.has("ilib-locale")).toBeTruthy();
        expect(set.has("ilib-common")).toBeTruthy();
    });

    test("ScanImportStatementsMultiple", () => {
        expect.assertions(3);
        let set = new Set();
        scan("./test/testfiles/importtest.js", set);
        expect(set.size).toBe(2);
        expect(set.has("ilib-something")).toBeTruthy();
        expect(set.has("ilib-locale")).toBeTruthy();
    });
});
