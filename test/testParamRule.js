/*
 * testParamRule.js - test the substitution parameter rule
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

import ParamRule from '../src/ParamRule.js';

import { Result } from 'i18nlint-common';

export const testParamRules = {
    testParamRuleStyle: function(test) {
        test.expect(1);

        const rule = new ParamRule();
        test.ok(rule);

        test.done();
    },

    testParamRuleStyleName: function(test) {
        test.expect(2);

        const rule = new ParamRule();
        test.ok(rule);

        test.equal(rule.getName(), "resource-printf-params-match");

        test.done();
    },

    testParamRuleStyleDescription: function(test) {
        test.expect(2);

        const rule = new ParamRule();
        test.ok(rule);

        test.equal(rule.getDescription(), "Test that the printf-like substitution parameters match in the source and target strings.");

        test.done();
    },

    testParamRuleStyleSourceLocale: function(test) {
        test.expect(2);

        const rule = new ParamRule({
            sourceLocale: "de-DE"
        });
        test.ok(rule);

        test.equal(rule.getSourceLocale(), "de-DE");

        test.done();
    },

    testParamRuleStyleGetRuleType: function(test) {
        test.expect(2);

        const rule = new ParamRule({
            sourceLocale: "de-DE"
        });
        test.ok(rule);

        test.equal(rule.getRuleType(), "resource");

        test.done();
    },

    testParamRuleMatchMissingInTarget: function(test) {
        test.expect(2);

        const rule = new ParamRule();
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

    testParamRuleMatchNoParams: function(test) {
        test.expect(2);

        const rule = new ParamRule();
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

    testParamRuleMatchExtraParamsInTarget: function(test) {
        test.expect(2);

        const rule = new ParamRule();
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

    testParamRuleMatchMatchingParams: function(test) {
        test.expect(2);

        const rule = new ParamRule();
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

    testParamRuleMatchMatchingParamsMultiple: function(test) {
        test.expect(2);

        const rule = new ParamRule();
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

    testParamRuleMatchMatchingParamsComplicated: function(test) {
        test.expect(2);

        const rule = new ParamRule();
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

    testParamRuleMatchNonMatchingParamsComplicated: function(test) {
        test.expect(2);

        const rule = new ParamRule();
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

    testParamRuleMatchMatchingParamsNumbered: function(test) {
        test.expect(2);

        const rule = new ParamRule();
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

