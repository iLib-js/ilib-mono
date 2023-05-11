/*
 * testPrintfNumberedRule.js - test the substitution parameter numbering rule
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

import PrintfNumberedRule from '../src/PrintfNumberedRule.js';

import { Result, IntermediateRepresentation } from 'i18nlint-common';

export const testPrintfNumberedRules = {
    testPrintfNumberedRuleStyle: function(test) {
        test.expect(1);

        const rule = new PrintfNumberedRule();
        test.ok(rule);

        test.done();
    },

    testPrintfNumberedRuleStyleName: function(test) {
        test.expect(2);

        const rule = new PrintfNumberedRule();
        test.ok(rule);

        test.equal(rule.getName(), "resource-printf-params-numbered");

        test.done();
    },

    testPrintfNumberedRuleStyleDescription: function(test) {
        test.expect(2);

        const rule = new PrintfNumberedRule();
        test.ok(rule);

        test.equal(rule.getDescription(), "Test that the printf-like substitution parameters in the source are numbered if there are multiple.");

        test.done();
    },

    testPrintfNumberedRuleStyleSourceLocale: function(test) {
        test.expect(2);

        const rule = new PrintfNumberedRule({
            sourceLocale: "de-DE"
        });
        test.ok(rule);

        test.equal(rule.getSourceLocale(), "de-DE");

        test.done();
    },

    testPrintfNumberedRuleStyleGetRuleType: function(test) {
        test.expect(2);

        const rule = new PrintfNumberedRule({
            sourceLocale: "de-DE"
        });
        test.ok(rule);

        test.equal(rule.getRuleType(), "resource");

        test.done();
    },

    testPrintfNumberedRuleMissingNumbering: function(test) {
        test.expect(2);

        const rule = new PrintfNumberedRule();
        test.ok(rule);

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
                filePath: "x"
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
                pathName: "x"
            }),
            new Result({
                severity: "error",
                description: "Source string substitution parameter %s must be numbered but it is not.",
                id: "printf.test",
                highlight: 'This %d string contains a <e0>%s</e0> string in it.',
                rule,
                pathName: "x"
            })
        ];
        test.deepEqual(actual, expected);

        test.done();
    },

    testPrintfNumberedRuleMatchNoParams: function(test) {
        test.expect(2);

        const rule = new PrintfNumberedRule();
        test.ok(rule);

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
                filePath: "x"
            })
        });
        test.ok(!actual);

        test.done();
    },

    testPrintfNumberedRuleMatchOneNumbered: function(test) {
        test.expect(2);

        const rule = new PrintfNumberedRule();
        test.ok(rule);

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
                filePath: "x"
            })
        });
        test.ok(!actual);

        test.done();
    },

    testPrintfNumberedRuleMatchOneUnnumbered: function(test) {
        test.expect(2);

        const rule = new PrintfNumberedRule();
        test.ok(rule);

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
                filePath: "x"
            })
        });
        test.ok(!actual);

        test.done();
    },

    testPrintfNumberedRuleMissingOneNumberedOneNot: function(test) {
        test.expect(2);

        const rule = new PrintfNumberedRule();
        test.ok(rule);

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
                filePath: "x"
            })
        });
        // if the source contains native quotes, the target must too
        const expected = new Result({
            severity: "error",
            description: "Source string substitution parameter %s must be numbered but it is not.",
            id: "printf.test",
            highlight: 'This %1$d string contains a <e0>%s</e0> string in it.',
            rule,
            pathName: "x"
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testPrintfNumberedRuleMissingTwoNumberedOneNot: function(test) {
        test.expect(2);

        const rule = new PrintfNumberedRule();
        test.ok(rule);

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
                filePath: "x"
            })
        });
        // if the source contains native quotes, the target must too
        const expected = new Result({
            severity: "error",
            description: "Source string substitution parameter %s must be numbered but it is not.",
            id: "printf.test",
            highlight: 'This %1$d string contains a <e0>%s</e0> string in %2$s.',
            rule,
            pathName: "x"
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testPrintfNumberedRuleMissingOneNumberedTwoNot: function(test) {
        test.expect(2);

        const rule = new PrintfNumberedRule();
        test.ok(rule);

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
                filePath: "x"
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
                pathName: "x"
            }),
            new Result({
                severity: "error",
                description: "Source string substitution parameter %s must be numbered but it is not.",
                id: "printf.test",
                highlight: 'This %1$d string contains a <e0>%s</e0> string in <e0>%s</e0>.',
                rule,
                pathName: "x"
            })
        ];
        test.deepEqual(actual, expected);

        test.done();
    }
};
