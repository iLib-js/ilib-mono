/*
 * testPrintfMatchRule.js - test the substitution parameter rule
 *
 * Copyright © 2022 JEDLSoft
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

import { Result } from 'i18nlint-common';

export const testPrintfMatchRules = {
    testPrintfMatchRuleStyle: function(test) {
        test.expect(1);

        const rule = new PrintfMatchRule();
        test.ok(rule);

        test.done();
    },

    testPrintfMatchRuleStyleName: function(test) {
        test.expect(2);

        const rule = new PrintfMatchRule();
        test.ok(rule);

        test.equal(rule.getName(), "resource-printf-params-match");

        test.done();
    },

    testPrintfMatchRuleStyleDescription: function(test) {
        test.expect(2);

        const rule = new PrintfMatchRule();
        test.ok(rule);

        test.equal(rule.getDescription(), "Test that the printf-like substitution parameters match in the source and target strings.");

        test.done();
    },

    testPrintfMatchRuleStyleSourceLocale: function(test) {
        test.expect(2);

        const rule = new PrintfMatchRule({
            sourceLocale: "de-DE"
        });
        test.ok(rule);

        test.equal(rule.getSourceLocale(), "de-DE");

        test.done();
    },

    testPrintfMatchRuleStyleGetRuleType: function(test) {
        test.expect(2);

        const rule = new PrintfMatchRule({
            sourceLocale: "de-DE"
        });
        test.ok(rule);

        test.equal(rule.getRuleType(), "resource");

        test.done();
    },

    testPrintfMatchRuleMatchMissingInTarget: function(test) {
        test.expect(2);

        const rule = new PrintfMatchRule();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains a %s string in it.',
                targetLocale: "de-DE",
                target: "Diese Zeichenfolge enthält keinen anderen Zeichenfolgen.",
                pathName: "a/b/c.xliff"
            }),
            file: "x"
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
        test.deepEqual(actual, expected);

        test.done();
    },

    testPrintfMatchRuleMatchNoParams: function(test) {
        test.expect(2);

        const rule = new PrintfMatchRule();
        test.ok(rule);

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains “quotes” in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält "Anführungszeichen".',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    },

    testPrintfMatchRuleMatchExtraParamsInTarget: function(test) {
        test.expect(2);

        const rule = new PrintfMatchRule();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains a %s string in it.',
                targetLocale: "de-DE",
                target: "Diese Zeichenfolge enthält %s anderen Zeichenfolgen %s.",
                pathName: "a/b/c.xliff"
            }),
            file: "x"
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
        test.deepEqual(actual, expected);

        test.done();
    },

    testPrintfMatchRuleMatchMatchingParams: function(test) {
        test.expect(2);

        const rule = new PrintfMatchRule();
        test.ok(rule);

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains %s in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält %s.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    },

    testPrintfMatchRuleMatchMatchingParamsMultiple: function(test) {
        test.expect(2);

        const rule = new PrintfMatchRule();
        test.ok(rule);

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string %d contains %s in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält %s %d.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    },

    testPrintfMatchRuleMatchMatchingParamsComplicated: function(test) {
        test.expect(2);

        const rule = new PrintfMatchRule();
        test.ok(rule);

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains %0$-#05.2zd in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält %0$-#05.2zd.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    },

    testPrintfMatchRuleMatchNonMatchingParamsComplicated: function(test) {
        test.expect(2);

        const rule = new PrintfMatchRule();
        test.ok(rule);

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains %0$-#05.2d in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält %0$-#05.2zd.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
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
        test.deepEqual(actual, expected);

        test.done();
    },

    testPrintfMatchRuleMatchMatchingParamsNumbered: function(test) {
        test.expect(2);

        const rule = new PrintfMatchRule();
        test.ok(rule);

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string %0$s contains %1$s in it.',
                targetLocale: "de-DE",
                target: 'Diese %1$s Zeichenfolge enthält %0$s.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    }
};

