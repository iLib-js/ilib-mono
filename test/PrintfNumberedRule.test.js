/*
 * PrintfNumberedRule.test.js - test the substitution parameter numbering rule
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
import { ResourceString } from 'ilib-tools-common';

import PrintfNumberedRule from '../src/PrintfNumberedRule.js';

import { Result, IntermediateRepresentation, SourceFile } from 'ilib-lint-common';

describe("testPrintfNumberedRules", () => {
    test("PrintfNumberedRuleStyle", () => {
        expect.assertions(1);

        const rule = new PrintfNumberedRule();
        expect(rule).toBeTruthy();
    });

    test("PrintfNumberedRuleStyleName", () => {
        expect.assertions(2);

        const rule = new PrintfNumberedRule();
        expect(rule).toBeTruthy();

        expect(rule.getName()).toBe("resource-printf-params-numbered");
    });

    test("PrintfNumberedRuleStyleDescription", () => {
        expect.assertions(2);

        const rule = new PrintfNumberedRule();
        expect(rule).toBeTruthy();

        expect(rule.getDescription()).toBe("Test that the printf-like substitution parameters in the source are numbered if there are multiple.");
    });

    test("PrintfNumberedRuleStyleSourceLocale", () => {
        expect.assertions(2);

        const rule = new PrintfNumberedRule({
            sourceLocale: "de-DE"
        });
        expect(rule).toBeTruthy();

        expect(rule.getSourceLocale()).toBe("de-DE");
    });

    test("PrintfNumberedRuleStyleGetRuleType", () => {
        expect.assertions(2);

        const rule = new PrintfNumberedRule({
            sourceLocale: "de-DE"
        });
        expect(rule).toBeTruthy();

        expect(rule.getRuleType()).toBe("resource");
    });

    test("PrintfNumberedRuleMissingNumbering", () => {
        expect.assertions(2);

        const rule = new PrintfNumberedRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This %d string contains a %s string in it.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        // if the source contains native quotes, the target must too
        const expected = [
            new Result({
                severity: "error",
                description: "Source string substitution parameter %d must be numbered but it is not.",
                id: "printf.test",
                highlight: 'This <e0>%d</e0> string contains a %s string in it.',
                rule,
                pathName: "a/b/c.xliff"
            }),
            new Result({
                severity: "error",
                description: "Source string substitution parameter %s must be numbered but it is not.",
                id: "printf.test",
                highlight: 'This %d string contains a <e0>%s</e0> string in it.',
                rule,
                pathName: "a/b/c.xliff"
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("PrintfNumberedRuleMatchNoParams", () => {
        expect.assertions(2);

        const rule = new PrintfNumberedRule();
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
                    source: 'This string contains no substitution parameters in it.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("PrintfNumberedRuleMatchOneNumbered", () => {
        expect.assertions(2);

        const rule = new PrintfNumberedRule();
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
                    source: 'This string contains a %3$s substitution parameter in it.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("PrintfNumberedRuleMatchOneUnnumbered", () => {
        expect.assertions(2);

        const rule = new PrintfNumberedRule();
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
                    source: 'This string contains a %s substitution parameter in it.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("PrintfNumberedRuleMissingOneNumberedOneNot", () => {
        expect.assertions(2);

        const rule = new PrintfNumberedRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This %1$d string contains a %s string in it.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        // if the source contains native quotes, the target must too
        const expected = new Result({
            severity: "error",
            description: "Source string substitution parameter %s must be numbered but it is not.",
            id: "printf.test",
            highlight: 'This %1$d string contains a <e0>%s</e0> string in it.',
            rule,
            pathName: "a/b/c.xliff"
        });
        expect(actual).toStrictEqual(expected);
    });

    test("PrintfNumberedRuleMissingTwoNumberedOneNot", () => {
        expect.assertions(2);

        const rule = new PrintfNumberedRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This %1$d string contains a %s string in %2$s.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        // if the source contains native quotes, the target must too
        const expected = new Result({
            severity: "error",
            description: "Source string substitution parameter %s must be numbered but it is not.",
            id: "printf.test",
            highlight: 'This %1$d string contains a <e0>%s</e0> string in %2$s.',
            rule,
            pathName: "a/b/c.xliff"
        });
        expect(actual).toStrictEqual(expected);
    });

    test("PrintfNumberedRuleMissingOneNumberedTwoNot", () => {
        expect.assertions(2);

        const rule = new PrintfNumberedRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This %1$d string contains a %s string in %s.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        // if the source contains native quotes, the target must too
        const expected = [
            new Result({
                severity: "error",
                description: "Source string substitution parameter %s must be numbered but it is not.",
                id: "printf.test",
                highlight: 'This %1$d string contains a <e0>%s</e0> string in <e0>%s</e0>.',
                rule,
                pathName: "a/b/c.xliff"
            }),
            new Result({
                severity: "error",
                description: "Source string substitution parameter %s must be numbered but it is not.",
                id: "printf.test",
                highlight: 'This %1$d string contains a <e0>%s</e0> string in <e0>%s</e0>.',
                rule,
                pathName: "a/b/c.xliff"
            })
        ];
        expect(actual).toStrictEqual(expected);
    });
});
