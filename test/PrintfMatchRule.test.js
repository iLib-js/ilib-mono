/*
 * PrintfMatchRule.test.js - test the substitution parameter rule
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
import { ResourceString } from 'ilib-tools-common';

import PrintfMatchRule from '../src/PrintfMatchRule.js';

import { Result, IntermediateRepresentation } from 'i18nlint-common';

describe("testPrintfMatchRules", () => {
    test("PrintfMatchRuleStyle", () => {
        expect.assertions(1);

        const rule = new PrintfMatchRule();
        expect(rule).toBeTruthy();
    });

    test("PrintfMatchRuleStyleName", () => {
        expect.assertions(2);

        const rule = new PrintfMatchRule();
        expect(rule).toBeTruthy();

        expect(rule.getName()).toBe("resource-printf-params-match");
    });

    test("PrintfMatchRuleStyleDescription", () => {
        expect.assertions(2);

        const rule = new PrintfMatchRule();
        expect(rule).toBeTruthy();

        expect(rule.getDescription()).toBe("Test that the printf-like substitution parameters match in the source and target strings.");
    });

    test("PrintfMatchRuleStyleSourceLocale", () => {
        expect.assertions(2);

        const rule = new PrintfMatchRule({
            sourceLocale: "de-DE"
        });
        expect(rule).toBeTruthy();

        expect(rule.getSourceLocale()).toBe("de-DE");
    });

    test("PrintfMatchRuleStyleGetRuleType", () => {
        expect.assertions(2);

        const rule = new PrintfMatchRule({
            sourceLocale: "de-DE"
        });
        expect(rule).toBeTruthy();

        expect(rule.getRuleType()).toBe("resource");
    });

    test("PrintfMatchRuleMatchMissingInTarget", () => {
        expect.assertions(2);

        const rule = new PrintfMatchRule();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains a %s string in it.',
                    targetLocale: "de-DE",
                    target: "Diese Zeichenfolge enthält keinen anderen Zeichenfolgen.",
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        // if the source contains native quotes, the target must too
        const expected = new Result({
            severity: "error",
            description: "Source string substitution parameter %s not found in the target string.",
            id: "printf.test",
            source: 'This string contains a %s string in it.',
            highlight: '<e0>Diese Zeichenfolge enthält keinen anderen Zeichenfolgen.</e0>',
            rule,
            pathName: "x"
        });
        expect(actual).toStrictEqual(expected);
    });

    test("PrintfMatchRuleMatchNoParams", () => {
        expect.assertions(2);

        const rule = new PrintfMatchRule();
        expect(rule).toBeTruthy();

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
                filePath: "x"
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("PrintfMatchRuleMatchExtraParamsInTarget", () => {
        expect.assertions(2);

        const rule = new PrintfMatchRule();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains a %s string in it.',
                    targetLocale: "de-DE",
                    target: "Diese Zeichenfolge enthält %s anderen Zeichenfolgen %s.",
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        // if the source contains native quotes, the target must too
        const expected = new Result({
            severity: "error",
            description: "Extra target string substitution parameter %s not found in the source string.",
            id: "printf.test",
            source: 'This string contains a %s string in it.',
            highlight: 'Diese Zeichenfolge enthält <e0>%s</e0> anderen Zeichenfolgen <e0>%s</e0>.',
            rule,
            pathName: "x"
        });
        expect(actual).toStrictEqual(expected);
    });

    test("PrintfMatchRuleMatchMatchingParams", () => {
        expect.assertions(2);

        const rule = new PrintfMatchRule();
        expect(rule).toBeTruthy();

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains %s in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält %s.',
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("PrintfMatchRuleMatchMatchingParamsMultiple", () => {
        expect.assertions(2);

        const rule = new PrintfMatchRule();
        expect(rule).toBeTruthy();

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string %d contains %s in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält %s %d.',
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("PrintfMatchRuleMatchMatchingParamsComplicated", () => {
        expect.assertions(2);

        const rule = new PrintfMatchRule();
        expect(rule).toBeTruthy();

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains %0$-#05.2zd in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält %0$-#05.2zd.',
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("PrintfMatchRuleMatchNonMatchingParamsComplicated", () => {
        expect.assertions(2);

        const rule = new PrintfMatchRule();
        expect(rule).toBeTruthy();

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains %0$-#05.2d in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält %0$-#05.2zd.',
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        const expected = [
            new Result({
                severity: "error",
                description: "Source string substitution parameter %0$-#05.2d not found in the target string.",
                id: "printf.test",
                source: 'This string contains %0$-#05.2d in it.',
                highlight: '<e0>Diese Zeichenfolge enthält %0$-#05.2zd.</e0>',
                rule,
                pathName: "x"
            }),
            new Result({
                severity: "error",
                description: "Extra target string substitution parameter %0$-#05.2zd not found in the source string.",
                id: "printf.test",
                source: 'This string contains %0$-#05.2d in it.',
                highlight: 'Diese Zeichenfolge enthält <e0>%0$-#05.2zd</e0>.',
                rule,
                pathName: "x"
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("PrintfMatchRuleMatchMatchingParamsNumbered", () => {
        expect.assertions(2);

        const rule = new PrintfMatchRule();
        expect(rule).toBeTruthy();

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string %0$s contains %1$s in it.',
                    targetLocale: "de-DE",
                    target: 'Diese %1$s Zeichenfolge enthält %0$s.',
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        expect(!actual).toBeTruthy();
    });
});

