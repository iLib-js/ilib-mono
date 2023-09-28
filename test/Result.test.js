/*
 * Result.test.js - test the result object
 *
 * Copyright © 2022-2023 JEDLSoft
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

import Result from '../src/Result.js';
import Rule from '../src/Rule.js';

class MockRule extends Rule {
    constructor() {
        super();
        this.name = "mock";
        this.description = "mock";
        this.type = "resource";
    }

    match(options) {
        return undefined;
    }
}

const rule = new MockRule();

describe("testResult", () => {
    test("ResultNormal", () => {
        expect.assertions(1);

        const result = new Result({
            severity: "warning",
            pathName: "a/b/c.js",
            description: "test",
            rule
        });

        expect(result).toBeTruthy();
    });

    test("ResultFull", () => {
        expect.assertions(11);

        const result = new Result({
            severity: "warning",
            pathName: "a/b/c.js",
            description: "test",
            id: "x",
            highlight: "test<e0/>",
            lineNumber: 23,
            charNumber: 14,
            endLineNumber: 24,
            endCharNumber: 5,
            locale: "de-DE",
            rule
        });

        expect(result).toBeTruthy();

        expect(result.severity).toBe("warning");
        expect(result.pathName).toBe("a/b/c.js");
        expect(result.description).toBe("test");
        expect(result.id).toBe("x");
        expect(result.highlight).toBe("test<e0/>");
        expect(result.lineNumber).toBe(23);
        expect(result.charNumber).toBe(14);
        expect(result.endLineNumber).toBe(24);
        expect(result.endCharNumber).toBe(5);
        expect(result.locale).toBe("de-DE");
    });

    test("ResultLineZero", () => {
        expect.assertions(2);

        const result = new Result({
            severity: "warning",
            pathName: "a/b/c.js",
            description: "test",
            id: "x",
            highlight: "test<e0/>",
            lineNumber: 23,
            charNumber: 14,
            locale: "de-DE",
            rule,
            lineNumber: 0
        });

        expect(result).toBeTruthy();

        expect(result.lineNumber).toBe(0);
    });

    test("ResultNormalizeSeverity", () => {
        expect.assertions(4);

        const result = new Result({
            severity: "issue",
            pathName: "a/b/c.js",
            description: "test",
            rule
        });

        expect(result).toBeTruthy();
        expect(result.severity).toBe("warning");
        expect(result.pathName).toBe("a/b/c.js");
        expect(result.description).toBe("test");
    });

    test("ResultMissingSeverity", () => {
        expect.assertions(1);

        expect(test => {
            new Result({
                pathName: "a/b/c.js",
                description: "test",
                rule
            });
        }).toThrow();
    });

    test("ResultMissingPathName", () => {
        expect.assertions(1);

        expect(test => {
            new Result({
                severity: "issue",
                description: "test",
                rule
            });
        }).toThrow();
    });

    test("ResultMissingDescription", () => {
        expect.assertions(1);

        expect(test => {
            new Result({
                severity: "issue",
                pathName: "a/b/c.js",
                rule
            });
        }).toThrow();
    });

    test("ResultMissingRule", () => {
        expect.assertions(1);

        expect(test => {
            new Result({
                severity: "issue",
                pathName: "a/b/c.js",
                description: "test"
            });
        }).toThrow();
    });

    test("ResultMissingEverything", () => {
        expect.assertions(1);

        expect(test => {
            new Result({});
        }).toThrow();
    });

    test("ResultMissingParameter", () => {
        expect.assertions(1);

        expect(test => {
            new Result();
        }).toThrow();
    });
});

