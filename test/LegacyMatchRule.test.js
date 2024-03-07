/*
 * LegacyMatchRule.test.js - test the substitution parameter rule
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
import { ResourceString } from 'ilib-tools-common';

import LegacyMatchRule from '../src/LegacyMatchRule.js';

import { Result, IntermediateRepresentation, SourceFile } from 'ilib-lint-common';

describe("testLegacyMatchRules", () => {
    test("LegacyMatchRuleStyle", () => {
        expect.assertions(1);

        const rule = new LegacyMatchRule();
        expect(rule).toBeTruthy();
    });

    test("LegacyMatchRuleStyleName", () => {
        expect.assertions(2);

        const rule = new LegacyMatchRule();
        expect(rule).toBeTruthy();

        expect(rule.getName()).toBe("resource-python-legacy-match");
    });

    test("LegacyMatchRuleStyleDescription", () => {
        expect.assertions(2);

        const rule = new LegacyMatchRule();
        expect(rule).toBeTruthy();

        expect(rule.getDescription()).toBe("Test that the legacy substitution parameters match in the source and target strings.");
    });

    test("LegacyMatchRuleStyleSourceLocale", () => {
        expect.assertions(2);

        const rule = new LegacyMatchRule({
            sourceLocale: "de-DE"
        });
        expect(rule).toBeTruthy();

        expect(rule.getSourceLocale()).toBe("de-DE");
    });

    test("LegacyMatchRuleStyleGetRuleType", () => {
        expect.assertions(2);

        const rule = new LegacyMatchRule({
            sourceLocale: "de-DE"
        });
        expect(rule).toBeTruthy();

        expect(rule.getRuleType()).toBe("resource");
    });

    test("LegacyMatchRuleMatchMissingInTarget", () => {
        expect.assertions(2);

        const rule = new LegacyMatchRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains a %(name)s string in it.',
                    targetLocale: "de-DE",
                    target: "Diese Zeichenfolge enthält keinen anderen Zeichenfolgen.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        // if the source contains native quotes, the target must too
        const expected = new Result({
            severity: "error",
            description: "Source string substitution parameter %(name)s not found in the target string.",
            id: "printf.test",
            source: 'This string contains a %(name)s string in it.',
            highlight: '<e0>Diese Zeichenfolge enthält keinen anderen Zeichenfolgen.</e0>',
            rule,
            pathName: "a/b/c.xliff"
        });
        expect(actual).toStrictEqual(expected);
    });

    test("LegacyMatchRuleMatchNoParams", () => {
        expect.assertions(2);

        const rule = new LegacyMatchRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains “quotes” in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält "Anführungszeichen".',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("LegacyMatchRuleMatchExtraParamsInTarget", () => {
        expect.assertions(2);

        const rule = new LegacyMatchRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains a name string in it.',
                    targetLocale: "de-DE",
                    target: "Diese Zeichenfolge enthält %(name)s anderen Zeichenfolgen %(name)s.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        // if the source contains native quotes, the target must too
        const expected = [
            new Result({
                severity: "error",
                description: "Extra target string substitution parameter %(name)s not found in the source string.",
                id: "printf.test",
                source: 'This string contains a name string in it.',
                highlight: 'Diese Zeichenfolge enthält <e0>%(name)s</e0> anderen Zeichenfolgen <e0>%(name)s</e0>.',
                rule,
                pathName: "a/b/c.xliff"
            }),
            new Result({
                severity: "error",
                description: "Extra target string substitution parameter %(name)s not found in the source string.",
                id: "printf.test",
                source: 'This string contains a name string in it.',
                highlight: 'Diese Zeichenfolge enthält <e0>%(name)s</e0> anderen Zeichenfolgen <e0>%(name)s</e0>.',
                rule,
                pathName: "a/b/c.xliff"
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("LegacyMatchRuleMatchMatchingParams", () => {
        expect.assertions(2);

        const rule = new LegacyMatchRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains %(name)s in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält %(name)s.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("LegacyMatchRuleMatchMatchingParamsIgnoreWhitespaceInSource", () => {
        expect.assertions(2);

        const rule = new LegacyMatchRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        // whitespace in parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains %( name )s in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält %(name)s.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("LegacyMatchRuleMatchMatchingParamsIgnoreWhitespaceInTarget", () => {
        expect.assertions(2);

        const rule = new LegacyMatchRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        // whitespace in parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains %(name)s in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält %( name )s.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("LegacyMatchRuleMatchMatchingParamsMultiple", () => {
        expect.assertions(2);

        const rule = new LegacyMatchRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string %(number)d contains %(name)s in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält %(name)s %(number)d.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });
});

