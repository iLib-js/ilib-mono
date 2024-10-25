/*
 * LineRegexpChecker.test.js - test the regular-expression-based rule
 * for plain text files
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

import fs from 'node:fs';
import { IntermediateRepresentation, SourceFile, Result } from 'ilib-lint-common';

import LineRegexpChecker from '../src/rules/LineRegexpChecker.js';

const noNormalize = {
    name: "source-no-normalize",
    description: "Make sure we don't have any calls to the deprecated normalize function.",
    note: "Calls to the deprecated normalize function are not allowed.",
    regexps: [ /\.normalize\s*\(/g ]
};

const sourceFile = new SourceFile("x/y", {});

describe("testLineRegexpChecker", () => {
    test("LineRegexpChecker", () => {
        expect.assertions(1);

        const rule = new LineRegexpChecker({
            name: "z",
            description: "a",
            note: "b",
            regexps: [ "c" ]
        });
        expect(rule).toBeTruthy();
    });

    test("LineRegexpCheckerMissingName", () => {
        expect.assertions(1);

        expect(() => {
            const rule = new LineRegexpChecker({
                description: "a",
                note: "b",
                regexps: [ "a" ]
            });
        }).toThrow();
    });

    test("LineRegexpCheckerMissingDescription", () => {
        expect.assertions(1);

        expect(() => {
            const rule = new LineRegexpChecker({
                name: "a",
                note: "b",
                regexps: [ "a" ]
            });
        }).toThrow();
    });

    test("LineRegexpCheckerMissingNote", () => {
        expect.assertions(1);

        expect(() => {
            const rule = new LineRegexpChecker({
                name: "a",
                description: "a",
                regexps: [ "a" ]
            });
        }).toThrow();
    });

    test("LineRegexpCheckerMissingRegexps", () => {
        expect.assertions(1);

        expect(() => {
            const rule = new LineRegexpChecker({
                name: "a",
                description: "a",
                note: "b"
            });
        }).toThrow();
    });

    test("LineRegexpCheckerSimpleRegexp", () => {
        expect.assertions(8);

        const rule = new LineRegexpChecker(noNormalize);
        expect(rule).toBeTruthy();

        const lines = `
            Path.join = function(var_args) {
                var arr = [];
                for (var i = 0; i < arguments.length; i++) {
                    arr.push(arguments[i] && arguments[i].length > 0 ? arguments[i] : ".");
                }
                return Path.normalize(arr.join("/"));
            };`.split(/\n/g);

        const ir = new IntermediateRepresentation({
            type: "line",
            ir: lines,
            sourceFile
        });
        const actual = rule.match({
            ir,
            file: "x/y"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].description).toBe("Calls to the deprecated normalize function are not allowed.");
        expect(actual[0].highlight).toBe('                return Path<e0>.normalize(</e0>arr.join("/"));');
        expect(actual[0].pathName).toBe("x/y");
        expect(actual[0].lineNumber).toBe(6);
    });

    test("LineRegexpCheckerSimpleRegexpNoMatch", () => {
        expect.assertions(2);

        const rule = new LineRegexpChecker(noNormalize);
        expect(rule).toBeTruthy();

        const lines = `
            Path.join = function(var_args) {
                var arr = [];
                for (var i = 0; i < arguments.length; i++) {
                    arr.push(arguments[i] && arguments[i].length > 0 ? arguments[i] : ".");
                }
                return arr.join("/");
            };`.split(/\n/g);

        const ir = new IntermediateRepresentation({
            type: "line",
            ir: lines,
            sourceFile
        });
        const actual = rule.match({
            ir,
            file: "x/y"
        });
        expect(!actual).toBeTruthy();
    });

    test("LineRegexpCheckerSimpleRegexpReallyLongLine", () => {
        expect.assertions(8);

        const rule = new LineRegexpChecker(noNormalize);
        expect(rule).toBeTruthy();

        const lines = [`Path.join = function(var_args) { var arr = []; for (var i = 0; i < arguments.length; i++) { arr.push(arguments[i] && arguments[i].length > 0 ? arguments[i] : "."); } return Path.normalize(arr.join("/")); };                                                                                                                                                                                                           `];

        const ir = new IntermediateRepresentation({
            type: "line",
            ir: lines,
            sourceFile
        });
        const actual = rule.match({
            ir,
            file: "x/y"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        // should truncate the highlight to 100 chars before and after the match and put an ellipsis
        expect(actual[0].severity).toBe("error");
        expect(actual[0].description).toBe("Calls to the deprecated normalize function are not allowed.");
        expect(actual[0].highlight).toBe('...ength; i++) { arr.push(arguments[i] && arguments[i].length > 0 ? arguments[i] : "."); } return Path<e0>.normalize(</e0>arr.join("/")); };                                                                                  ...');
        expect(actual[0].pathName).toBe("x/y");
        expect(actual[0].lineNumber).toBe(0);
    });

    test("LineRegexpCheckerRegexpMultipleMatches", () => {
        expect.assertions(18);

        const rule = new LineRegexpChecker(noNormalize);
        expect(rule).toBeTruthy();

        const source = fs.readFileSync("./test/testfiles/js/Path.js", "utf-8");

        const ir = new IntermediateRepresentation({
            type: "line",
            ir: source.split(/\n/g),
            sourceFile
        });
        const actual = rule.match({
            ir,
            file: "x/y"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(3);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].description).toBe("Calls to the deprecated normalize function are not allowed.");
        expect(actual[0].highlight).toBe('    pathname = Path<e0>.normalize(</e0>pathname);');
        expect(actual[0].pathName).toBe("x/y");
        expect(actual[0].lineNumber).toBe(50);

        expect(actual[1].severity).toBe("error");
        expect(actual[1].description).toBe("Calls to the deprecated normalize function are not allowed.");
        expect(actual[1].highlight).toBe('    return (pathname === ".") ? ".." : Path<e0>.normalize(</e0>pathname + "/..");');
        expect(actual[1].pathName).toBe("x/y");
        expect(actual[1].lineNumber).toBe(51);

        expect(actual[2].severity).toBe("error");
        expect(actual[2].description).toBe("Calls to the deprecated normalize function are not allowed.");
        expect(actual[2].highlight).toBe('    return Path<e0>.normalize(</e0>arr.join("/"));');
        expect(actual[2].pathName).toBe("x/y");
        expect(actual[2].lineNumber).toBe(91);
    });

    test("LineRegexpCheckerTestSeverity", () => {
        expect.assertions(8);

        const rule = new LineRegexpChecker({
            ...noNormalize,
            severity: "warning"
        });
        expect(rule).toBeTruthy();

        const lines = `
            Path.join = function(var_args) {
                var arr = [];
                for (var i = 0; i < arguments.length; i++) {
                    arr.push(arguments[i] && arguments[i].length > 0 ? arguments[i] : ".");
                }
                return Path.normalize(arr.join("/"));
            };`.split(/\n/g);

        const ir = new IntermediateRepresentation({
            type: "line",
            ir: lines,
            sourceFile
        });
        const actual = rule.match({
            ir,
            file: "x/y"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].description).toBe("Calls to the deprecated normalize function are not allowed.");
        expect(actual[0].highlight).toBe('                return Path<e0>.normalize(</e0>arr.join("/"));');
        expect(actual[0].pathName).toBe("x/y");
        expect(actual[0].lineNumber).toBe(6);
        expect(actual[0].severity).toBe("warning");
    });

    test("LineRegexpCheckerTestSeverityDefault", () => {
        expect.assertions(9);

        const rule = new LineRegexpChecker(noNormalize);
        expect(rule).toBeTruthy();

        const lines = `
            Path.join = function(var_args) {
                var arr = [];
                for (var i = 0; i < arguments.length; i++) {
                    arr.push(arguments[i] && arguments[i].length > 0 ? arguments[i] : ".");
                }
                return Path.normalize(arr.join("/"));
            };`.split(/\n/g);

        const ir = new IntermediateRepresentation({
            type: "line",
            ir: lines,
            sourceFile
        });
        const actual = rule.match({
            ir,
            file: "x/y"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].description).toBe("Calls to the deprecated normalize function are not allowed.");
        expect(actual[0].highlight).toBe('                return Path<e0>.normalize(</e0>arr.join("/"));');
        expect(actual[0].pathName).toBe("x/y");
        expect(actual[0].lineNumber).toBe(6);
        expect(actual[0].severity).toBe("error"); // default severity
    });
});
