/*
 * ResourceStateChecker.test.js - test the rule that checks each resource's
 * state attribute
 *
 * Copyright © 2022-2024 JEDLSoft
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
import { ResourceArray, ResourcePlural, ResourceString } from 'ilib-tools-common';

import ResourceStateChecker from '../src/rules/ResourceStateChecker.js';

import { Result, IntermediateRepresentation, SourceFile } from 'ilib-lint-common';

const sourceFile = new SourceFile("a/b/c.xliff", {});

describe("testResourceStateChecker", () => {
    test("ResourceStateCheckerMatchNoError", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker({
            // all resources should have this state:
            param: "translated"
        });
        expect(rule).toBeTruthy();

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {This is singular} other {This is plural}}',
                    targetLocale: "de-DE",
                    target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
                    pathName: "a/b/c.xliff",
                    state: "translated"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceStateCheckerMatchArrayNoError", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker({
            // all resources should have this state:
            param: [ "translated", "needs-review" ]
        });
        expect(rule).toBeTruthy();

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {This is singular} other {This is plural}}',
                    targetLocale: "de-DE",
                    target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
                    pathName: "a/b/c.xliff",
                    state: "needs-review"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceStateCheckerMatchError", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker({
            // all resources should have this state:
            param: "translated"
        });
        expect(rule).toBeTruthy();

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {This is singular} other {This is plural}}',
                    targetLocale: "de-DE",
                    target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
                    pathName: "a/b/c.xliff",
                    state: "new"
                })],
                sourceFile
            })
        });
        const expected = new Result({
            severity: "error",
            description: "Resources must have the following state: translated",
            id: "plural.test",
            highlight: 'Resource found with disallowed state: <e0>new</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: '{count, plural, one {This is singular} other {This is plural}}'
        });
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceStateCheckerMatchArrayError", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker({
            // all resources should have this state:
            param: [ "translated", "needs-review" ]
        });
        expect(rule).toBeTruthy();

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {This is singular} other {This is plural}}',
                    targetLocale: "de-DE",
                    target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
                    pathName: "a/b/c.xliff",
                    state: "new"
                })],
                sourceFile
            })
        });
        const expected = new Result({
            severity: "error",
            description: "Resources must have one of the following states: translated, needs-review",
            id: "plural.test",
            highlight: 'Resource found with disallowed state: <e0>new</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: '{count, plural, one {This is singular} other {This is plural}}'
        });
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceStateCheckerMatchDefaultNoError", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {This is singular} other {This is plural}}',
                    targetLocale: "de-DE",
                    target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
                    pathName: "a/b/c.xliff",
                    state: "translated"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceStateCheckerMatchDefaultError", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {This is singular} other {This is plural}}',
                    targetLocale: "de-DE",
                    target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
                    pathName: "a/b/c.xliff",
                    state: "new"
                })],
                sourceFile
            })
        });
        const expected = new Result({
            severity: "error",
            description: "Resources must have the following state: translated",
            id: "plural.test",
            highlight: 'Resource found with disallowed state: <e0>new</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: '{count, plural, one {This is singular} other {This is plural}}'
        });
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceStateCheckerNoState", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker({
            // all resources should have this state:
            param: [ "translated" ]
        });
        expect(rule).toBeTruthy();

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {This is singular} other {This is plural}}',
                    targetLocale: "de-DE",
                    target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        const expected = new Result({
            severity: "error",
            description: "Resources must have the following state: translated",
            id: "plural.test",
            highlight: 'Resource found with no state.',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: '{count, plural, one {This is singular} other {This is plural}}'
        });
        expect(actual).toStrictEqual(expected);
    });
});
