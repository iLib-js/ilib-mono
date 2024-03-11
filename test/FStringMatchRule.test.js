/*
 * FStringMatchRule.test.js - test the substitution parameter rule
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

import FStringMatchRule from '../src/FStringMatchRule.js';

import { Result, IntermediateRepresentation, SourceFile } from 'ilib-lint-common';

describe("testFStringMatchRules", () => {
    test("FStringMatchRuleStyle", () => {
        expect.assertions(1);

        const rule = new FStringMatchRule();
        expect(rule).toBeTruthy();
    });

    test("FStringMatchRuleStyleName", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
        expect(rule).toBeTruthy();

        expect(rule.getName()).toBe("resource-python-fstrings-match");
    });

    test("FStringMatchRuleStyleDescription", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
        expect(rule).toBeTruthy();

        expect(rule.getDescription()).toBe("Test that the f-string substitution parameters match in the source and target strings.");
    });

    test("FStringMatchRuleStyleSourceLocale", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule({
            sourceLocale: "de-DE"
        });
        expect(rule).toBeTruthy();

        expect(rule.getSourceLocale()).toBe("de-DE");
    });

    test("FStringMatchRuleStyleGetRuleType", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule({
            sourceLocale: "de-DE"
        });
        expect(rule).toBeTruthy();

        expect(rule.getRuleType()).toBe("resource");
    });

    test("FStringMatchRuleMatchMissingInTarget", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains a {name} string in it.',
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
            description: "Source string substitution parameter {name} not found in the target string.",
            id: "printf.test",
            source: 'This string contains a {name} string in it.',
            highlight: '<e0>Diese Zeichenfolge enthält keinen anderen Zeichenfolgen.</e0>',
            rule,
            pathName: "a/b/c.xliff"
        });
        expect(actual).toStrictEqual(expected);
    });

    test("FStringMatchRuleMatchNoParams", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
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

    test("FStringMatchRuleMatchExtraParamsInTarget", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains a {name} string in it.',
                    targetLocale: "de-DE",
                    target: "Diese Zeichenfolge enthält {name} anderen Zeichenfolgen {name}.",
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        // if the source contains native quotes, the target must too
        const expected = new Result({
            severity: "error",
            description: "Extra target string substitution parameter {name} not found in the source string.",
            id: "printf.test",
            source: 'This string contains a {name} string in it.',
            highlight: 'Diese Zeichenfolge enthält <e0>{name}</e0> anderen Zeichenfolgen <e0>{name}</e0>.',
            rule,
            pathName: "a/b/c.xliff"
        });
        expect(actual).toStrictEqual(expected);
    });

    test("FStringMatchRuleMatchMatchingParams", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
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
                    source: 'This string contains {name} in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält {name}.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("FStringMatchRuleMatchMatchingParamsIgnoreWhitespaceInSource", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
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
                    source: 'This string contains { name } in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält {name}.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("FStringMatchRuleMatchMatchingParamsIgnoreWhitespaceInTarget1", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
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
                    source: 'This string contains {name} in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält { name }.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("FStringMatchRuleMatchMatchingParamsIgnoreWhitespaceInTarget2", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
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
                    source: 'This string contains {name} in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält { name}.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("FStringMatchRuleMatchMatchingParamsIgnoreWhitespaceInTarget3", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
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
                    source: 'This string contains {name} in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält {name }.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("FStringMatchRuleMatchMatchingParamsMultiple", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
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
                    source: 'This string {number} contains {name} in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält {name} {number}.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("FStringMatchRuleMatchMatchingParamsComplicated", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
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
                    source: 'This string contains {number:.3d} in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält {number:.3d}.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("FStringMatchRuleMatchNonMatchingParamsComplicated", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
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
                    source: 'This string contains {number:.3d} in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält {number:3.3d}.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        const expected = [
            new Result({
                severity: "error",
                description: "Source string substitution parameter {number:.3d} not found in the target string.",
                id: "printf.test",
                source: 'This string contains {number:.3d} in it.',
                highlight: '<e0>Diese Zeichenfolge enthält {number:3.3d}.</e0>',
                rule,
                pathName: "a/b/c.xliff"
            }),
            new Result({
                severity: "error",
                description: "Extra target string substitution parameter {number:3.3d} not found in the source string.",
                id: "printf.test",
                source: 'This string contains {number:.3d} in it.',
                highlight: 'Diese Zeichenfolge enthält <e0>{number:3.3d}</e0>.',
                rule,
                pathName: "a/b/c.xliff"
            })
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("FStringMatchRuleMatchNumericParams", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        // numeric params in source and target is okay
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains {0} in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält {0}.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("FStringMatchRuleNonMatchNumericParams", () => {
        expect.assertions(3);

        const rule = new FStringMatchRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains {0} in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält {name}.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(actual).toBeTruthy();

        const expected = [
            new Result({
                severity: "error",
                description: "Source string substitution parameter {0} not found in the target string.",
                id: "printf.test",
                source: 'This string contains {0} in it.',
                highlight: '<e0>Diese Zeichenfolge enthält {name}.</e0>',
                rule,
                pathName: "a/b/c.xliff"
            }),
            new Result({
                severity: "error",
                description: "Extra target string substitution parameter {name} not found in the source string.",
                id: "printf.test",
                source: 'This string contains {0} in it.',
                highlight: 'Diese Zeichenfolge enthält <e0>{name}</e0>.',
                rule,
                pathName: "a/b/c.xliff"
            }),
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("FStringMatchRuleNonMatchNumericTargetParams", () => {
        expect.assertions(3);

        const rule = new FStringMatchRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains {name} in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält {0}.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(actual).toBeTruthy();

        const expected = [
            new Result({
                severity: "error",
                description: "Source string substitution parameter {name} not found in the target string.",
                id: "printf.test",
                source: 'This string contains {name} in it.',
                highlight: '<e0>Diese Zeichenfolge enthält {0}.</e0>',
                rule,
                pathName: "a/b/c.xliff"
            }),
            new Result({
                severity: "error",
                description: "Extra target string substitution parameter {0} not found in the source string.",
                id: "printf.test",
                source: 'This string contains {name} in it.',
                highlight: 'Diese Zeichenfolge enthält <e0>{0}</e0>.',
                rule,
                pathName: "a/b/c.xliff"
            }),
        ];
        expect(actual).toStrictEqual(expected);
    });

    test("FStringMatchRuleDoNotMatchDoubleCurlies1", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        // Double curly braces render to a single one in the output
        // and do not indicate the presence of a replacement param
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains a {{ and a }} character in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält einen {{ und einen }} Zeichen.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("FStringMatchRuleDoNotMatchDoubleCurlies2", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        // Double curly braces render to a single one in the output
        // and do not indicate the presence of a replacement param
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains a {{and}} character in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält einen {{und}} Zeichen.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("FStringMatchRuleDoNotMatchDoubleCurlies3", () => {
        expect.assertions(2);

        const rule = new FStringMatchRule();
        expect(rule).toBeTruthy();

        const sourceFile = new SourceFile("a/b/c.xliff", {});
        // Double curly braces render to a single one in the output
        // and do not indicate the presence of a replacement param
        const actual = rule.match({
            locale: "de-DE",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "printf.test",
                    sourceLocale: "en-US",
                    source: 'This string contains a {{and }} character in it.',
                    targetLocale: "de-DE",
                    target: 'Diese Zeichenfolge enthält einen {{ und}} Zeichen.',
                    pathName: "a/b/c.xliff"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });
});

