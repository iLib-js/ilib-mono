/*
 * FStringNumberedRule.test.js - test the substitution parameter numbering rule
 *
 * Copyright © 2023 JEDLSoft
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
import { Result, IntermediateRepresentation } from 'i18nlint-common';

import FStringNumberedRule from '../src/FStringNumberedRule.js';

describe("testFStringNumberedRules", () => {
    test("FStringNumberedRuleStyle", () => {
        expect.assertions(1);

        const rule = new FStringNumberedRule();
        expect(rule).toBeTruthy();
    });

    test("FStringNumberedRuleStyleName", () => {
        expect.assertions(2);

        const rule = new FStringNumberedRule();
        expect(rule).toBeTruthy();

        expect(rule.getName()).toBe("resource-python-fstrings-numbered");
    });

    test("FStringNumberedRuleStyleDescription", () => {
        expect.assertions(2);

        const rule = new FStringNumberedRule();
        expect(rule).toBeTruthy();

        expect(rule.getDescription()).toBe("Test that f-string substitution parameters in the source are named or numbered if there are multiple.");
    });

    test("FStringNumberedRuleStyleSourceLocale", () => {
        expect.assertions(2);

        const rule = new FStringNumberedRule({
            sourceLocale: "de-DE"
        });
        expect(rule).toBeTruthy();

        expect(rule.getSourceLocale()).toBe("de-DE");
    });

    test("FStringNumberedRuleStyleGetRuleType", () => {
        expect.assertions(2);

        const rule = new FStringNumberedRule({
            sourceLocale: "de-DE"
        });
        expect(rule).toBeTruthy();

        expect(rule.getRuleType()).toBe("resource");
    });

    test("FStringNumberedRuleMissingNumbering", () => {
        expect.assertions(2);

        const rule = new FStringNumberedRule();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "fstring.test",
                    sourceLocale: "en-US",
                    source: 'This {} string contains a {} string in it.',
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        // if the source contains native quotes, the target must too
        const expected = [
            new Result({
                severity: "error",
                description: "Source string substitution parameter {} must be numbered but it is not.",
                id: "fstring.test",
                highlight: 'This <e0>{}</e0> string contains a <e0>{}</e0> string in it.',
                rule,
                pathName: "x"
            }),
            new Result({
                severity: "error",
                description: "Source string substitution parameter {} must be numbered but it is not.",
                id: "fstring.test",
                highlight: 'This <e0>{}</e0> string contains a <e0>{}</e0> string in it.',
                rule,
                pathName: "x"
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("FStringNumberedRuleMatchNoParams", () => {
        expect.assertions(2);

        const rule = new FStringNumberedRule();
        expect(rule).toBeTruthy();

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "fstring.test",
                    sourceLocale: "en-US",
                    source: 'This string contains no substitution parameters in it.',
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("FStringNumberedRuleMatchOneNumbered", () => {
        expect.assertions(2);

        const rule = new FStringNumberedRule();
        expect(rule).toBeTruthy();

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "fstring.test",
                    sourceLocale: "en-US",
                    source: 'This string contains a {name} substitution parameter in it.',
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("FStringNumberedRuleMatchOneUnnumbered", () => {
        expect.assertions(2);

        const rule = new FStringNumberedRule();
        expect(rule).toBeTruthy();

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "fstring.test",
                    sourceLocale: "en-US",
                    source: 'This string contains a {} substitution parameter in it.',
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("FStringNumberedRuleMissingOneNumberedOneNot", () => {
        expect.assertions(2);

        const rule = new FStringNumberedRule();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "fstring.test",
                    sourceLocale: "en-US",
                    source: 'This {name} string contains a {} string in it.',
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        // if the source contains native quotes, the target must too
        const expected = new Result({
            severity: "error",
            description: "Source string substitution parameter {} must be numbered but it is not.",
            id: "fstring.test",
            highlight: 'This {name} string contains a <e0>{}</e0> string in it.',
            rule,
            pathName: "x"
        });
        expect(actual).toStrictEqual(expected);
    });

    test("FStringNumberedRuleMissingTwoNumberedOneNot", () => {
        expect.assertions(2);

        const rule = new FStringNumberedRule();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "fstring.test",
                    sourceLocale: "en-US",
                    source: 'This {name} string contains a {} string in {location}.',
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        // if the source contains native quotes, the target must too
        const expected = new Result({
            severity: "error",
            description: "Source string substitution parameter {} must be numbered but it is not.",
            id: "fstring.test",
            highlight: 'This {name} string contains a <e0>{}</e0> string in {location}.',
            rule,
            pathName: "x"
        });
        expect(actual).toStrictEqual(expected);
    });

    test("FStringNumberedRuleMissingOneNumberedTwoNot", () => {
        expect.assertions(2);

        const rule = new FStringNumberedRule();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "fstring.test",
                    sourceLocale: "en-US",
                    source: 'This {name} string contains a {} string in {}.',
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        // if the source contains native quotes, the target must too
        const expected = [
            new Result({
                severity: "error",
                description: "Source string substitution parameter {} must be numbered but it is not.",
                id: "fstring.test",
                highlight: 'This {name} string contains a <e0>{}</e0> string in <e0>{}</e0>.',
                rule,
                pathName: "x"
            }),
            new Result({
                severity: "error",
                description: "Source string substitution parameter {} must be numbered but it is not.",
                id: "fstring.test",
                highlight: 'This {name} string contains a <e0>{}</e0> string in <e0>{}</e0>.',
                rule,
                pathName: "x"
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("FStringNumberedRuleIgnoreDoubleCurlies1", () => {
        expect.assertions(2);

        const rule = new FStringNumberedRule();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "fstring.test",
                    sourceLocale: "en-US",
                    source: 'This string contains a {{}} string in it.',
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("FStringNumberedRuleIgnoreDoubleCurlies2", () => {
        expect.assertions(2);

        const rule = new FStringNumberedRule();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "fstring.test",
                    sourceLocale: "en-US",
                    source: 'This string contains a {{ }} string in it.',
                    pathName: "a/b/c.xliff"
                })],
                filePath: "x"
            })
        });
        expect(!actual).toBeTruthy();
    });

});
