/*
 * testscan.js - test the assemble utility
 *
 * Copyright © 2022 JEDLSoft
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

export const testscan = {
    testScanStringImportStatement: function(test) {
        test.expect(2);
        let set = new Set();
        scanString(`import something from 'ilib-something';`, set);
        test.equal(set.size, 1);
        test.ok(set.has("ilib-something"));

        test.done();
    },

    testScanStringImportCall: function(test) {
        test.expect(2);
        let set = new Set();
        scanString(`function foo(asdf) {
                return import("ilib-locale");
            };`, set);
        test.equal(set.size, 1);
        test.ok(set.has("ilib-locale"));

        test.done();
    },

    testScanStringStringRequireCall: function(test) {
        test.expect(2);
        let set = new Set();
        scanString(`function foo(asdf) {
                return require("ilib-locale");
            };`, set);
        test.equal(set.size, 1);
        test.ok(set.has("ilib-locale"));

        test.done();
    },

    testScanStringWhiteSpaceImportStatement: function(test) {
        test.expect(2);
        let set = new Set();
        scanString(
            `import something      from    'ilib-something'   ;
            `, set);
        test.equal(set.size, 1);
        test.ok(set.has("ilib-something"));

        test.done();
    },

    testScanStringWhiteSpaceImportCall: function(test) {
        test.expect(2);
        let set = new Set();
        scanString(
            `function foo(asdf) {
                return import   (    "ilib-locale"  ).then(module => {
                    // do somethign with the module
                });
            };`, set);
        test.equal(set.size, 1);
        test.ok(set.has("ilib-locale"));

        test.done();
    },

    testScanStringWhiteSpaceRequireCall: function(test) {
        test.expect(2);
        let set = new Set();
        scanString(
            `function req(asdf) {
                var name = require   (    "ilib-name"    );
                // do something with name
            };`, set);
        test.equal(set.size, 1);
        test.ok(set.has("ilib-name"));

        test.done();
    },

    testScanStringFalseImportStatement: function(test) {
        test.expect(1);
        let set = new Set();
        scanString(
            `asdfimport something      from    'ilib-something'   ;
            `, set);
        test.equal(set.size, 0);

        test.done();
    },

    testScanStringComplexImportStatement: function(test) {
        test.expect(2);
        let set = new Set();
        scanString(
            `import something, { somethingElse }      from    'ilib-something'   ;
            `, set);
        test.equal(set.size, 1);
        test.ok(set.has("ilib-something"));

        test.done();
    },

    testScanStringFalseImportCall: function(test) {
        test.expect(1);
        let set = new Set();
        scanString(
            `function foo(asdf) {
                return bigimport("ilib-locale").then(module => {
                    // do somethign with the module
                });
            };`, set);
        test.equal(set.size, 0);

        test.done();
    },

    testScanStringFalseRequireCall: function(test) {
        test.expect(1);
        let set = new Set();
        scanString(
            `function req(asdf) {
                var name = bigrequire("ilib-name");
                // do something with name
            };`, set);
        test.equal(set.size, 0);

        test.done();
    },

    testScanImportStatement: function(test) {
        test.expect(3);
        let set = new Set();
        scan("./src/index.js", set);
        test.equal(set.size, 2);
        test.ok(set.has("ilib-locale"));
        test.ok(set.has("ilib-common"));

        test.done();
    },

    testScanImportStatementsMultiple: function(test) {
        test.expect(3);
        let set = new Set();
        scan("./test/testfiles/importtest.js", set);
        test.equal(set.size, 2);
        test.ok(set.has("ilib-something"));
        test.ok(set.has("ilib-locale"));

        test.done();
    }
};
