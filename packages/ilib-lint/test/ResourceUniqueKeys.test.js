/*
 * ResourceUniqueKeys.test.js - test the resource unique key checker
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

import { Result, IntermediateRepresentation, SourceFile } from 'ilib-lint-common';
import { ResourceString } from 'ilib-tools-common';

import ResourceUniqueKeys from '../src/rules/ResourceUniqueKeys.js';

const sourceFile = new SourceFile("a/b/c.xliff", {});

describe("testResourceUniqueKeys", () => {
    test("ResourceUniqueKeys", () => {
        expect.assertions(1);

        const rule = new ResourceUniqueKeys();
        expect(rule).toBeTruthy();
    });

    test("ResourceUniqueKeysOneResource", () => {
        expect.assertions(2);

        const rule = new ResourceUniqueKeys();
        expect(rule).toBeTruthy();

        const ir = new IntermediateRepresentation({
            sourceFile,
            type: "resource",
            ir: [new ResourceString({
                key: "resource1",
                sourceLocale: "en-US",
                source: "source string",
                targetLocale: "de-DE",
                target: "target string",
                pathName: "a/b/c.xliff",
                state: "translated",
            })]
        });
        const actual = rule.match({
            ir,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceUniqueKeysTwoResourcesOkay", () => {
        expect.assertions(2);

        const rule = new ResourceUniqueKeys();
        expect(rule).toBeTruthy();

        const ir = new IntermediateRepresentation({
            sourceFile,
            type: "resource",
            ir: [new ResourceString({
                key: "resource1",
                sourceLocale: "en-US",
                source: "source string",
                targetLocale: "de-DE",
                target: "target string",
                pathName: "a/b/c.xliff",
                state: "translated",
            }),new ResourceString({
                key: "resource2",
                sourceLocale: "en-US",
                source: "source string",
                targetLocale: "de-DE",
                target: "target string",
                pathName: "a/b/c.xliff",
                state: "translated",
            })]
        });
        const actual = rule.match({
            ir,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceUniqueKeysTwoResourcesConflicting", () => {
        expect.assertions(7);

        const rule = new ResourceUniqueKeys();
        expect(rule).toBeTruthy();

        const ir = new IntermediateRepresentation({
            sourceFile,
            type: "resource",
            ir: [new ResourceString({
                key: "resource1",
                sourceLocale: "en-US",
                source: "source string",
                targetLocale: "de-DE",
                target: "target string",
                pathName: "a/b/c.xliff",
                state: "translated",
            }),new ResourceString({
                key: "resource1",
                sourceLocale: "en-US",
                source: "source string",
                targetLocale: "de-DE",
                target: "target string",
                pathName: "a/b/c.xliff",
                state: "translated",
            })]
        });
        const actual = rule.match({
            ir,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].description).toBe("Key is not unique within locale de-DE.");
        expect(actual[0].highlight).toBe('Key is also defined in this file: a/b/c.xliff');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceUniqueKeysMultipleResourcesConflicting", () => {
        expect.assertions(11);

        const rule = new ResourceUniqueKeys();
        expect(rule).toBeTruthy();

        const ir = new IntermediateRepresentation({
            sourceFile,
            type: "resource",
            ir: [new ResourceString({
                key: "resource1",
                sourceLocale: "en-US",
                source: "source string",
                targetLocale: "de-DE",
                target: "target string",
                pathName: "a/b/c.xliff",
                state: "translated",
            }),new ResourceString({
                key: "resource1",
                sourceLocale: "en-US",
                source: "source string",
                targetLocale: "de-DE",
                target: "target string",
                pathName: "a/b/c.xliff",
                state: "translated",
            }),new ResourceString({
                key: "resource2",
                sourceLocale: "en-US",
                source: "source string",
                targetLocale: "de-DE",
                target: "target string",
                pathName: "a/b/c.xliff",
                state: "translated",
            }),new ResourceString({
                key: "resource2",
                sourceLocale: "en-US",
                source: "source string",
                targetLocale: "de-DE",
                target: "target string",
                pathName: "a/b/c.xliff",
                state: "translated",
            })]
        });
        const actual = rule.match({
            ir,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(2);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].description).toBe("Key is not unique within locale de-DE.");
        expect(actual[0].highlight).toBe('Key is also defined in this file: a/b/c.xliff');
        expect(actual[0].pathName).toBe("a/b/c.xliff");

        expect(actual[1].severity).toBe("error");
        expect(actual[1].description).toBe("Key is not unique within locale de-DE.");
        expect(actual[1].highlight).toBe('Key is also defined in this file: a/b/c.xliff');
        expect(actual[1].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceUniqueKeysMultipleResourcesOkay", () => {
        expect.assertions(2);

        const rule = new ResourceUniqueKeys();
        expect(rule).toBeTruthy();

        const ir = new IntermediateRepresentation({
            sourceFile,
            type: "resource",
            ir: [new ResourceString({
                key: "resource1",
                sourceLocale: "en-US",
                source: "source string",
                targetLocale: "de-DE",
                target: "target string",
                pathName: "a/b/c.xliff",
                state: "translated",
            }),new ResourceString({
                key: "resource2",
                sourceLocale: "en-US",
                source: "source string",
                targetLocale: "de-DE",
                target: "target string",
                pathName: "a/b/c.xliff",
                state: "translated",
            }),new ResourceString({
                key: "resource3",
                sourceLocale: "en-US",
                source: "source string",
                targetLocale: "de-DE",
                target: "target string",
                pathName: "a/b/c.xliff",
                state: "translated",
            }),new ResourceString({
                key: "resource4",
                sourceLocale: "en-US",
                source: "source string",
                targetLocale: "de-DE",
                target: "target string",
                pathName: "a/b/c.xliff",
                state: "translated",
            })]
        });
        const actual = rule.match({
            ir,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });
});
