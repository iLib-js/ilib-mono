/*
 * testLegacyMatchRule.js - test the substitution parameter rule
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

import LegacyMatchRule from '../src/LegacyMatchRule.js';

import { Result } from 'i18nlint-common';

export const testLegacyMatchRules = {
    testLegacyMatchRuleStyle: function(test) {
        test.expect(1);

        const rule = new LegacyMatchRule();
        test.ok(rule);

        test.done();
    },

    testLegacyMatchRuleStyleName: function(test) {
        test.expect(2);

        const rule = new LegacyMatchRule();
        test.ok(rule);

        test.equal(rule.getName(), "resource-python-legacy-match");

        test.done();
    },

    testLegacyMatchRuleStyleDescription: function(test) {
        test.expect(2);

        const rule = new LegacyMatchRule();
        test.ok(rule);

        test.equal(rule.getDescription(), "Test that the legacy substitution parameters match in the source and target strings.");

        test.done();
    },

    testLegacyMatchRuleStyleSourceLocale: function(test) {
        test.expect(2);

        const rule = new LegacyMatchRule({
            sourceLocale: "de-DE"
        });
        test.ok(rule);

        test.equal(rule.getSourceLocale(), "de-DE");

        test.done();
    },

    testLegacyMatchRuleStyleGetRuleType: function(test) {
        test.expect(2);

        const rule = new LegacyMatchRule({
            sourceLocale: "de-DE"
        });
        test.ok(rule);

        test.equal(rule.getRuleType(), "resource");

        test.done();
    },

    testLegacyMatchRuleMatchMissingInTarget: function(test) {
        test.expect(2);

        const rule = new LegacyMatchRule();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains a %(name)s string in it.',
                targetLocale: "de-DE",
                target: "Diese Zeichenfolge enthält keinen anderen Zeichenfolgen.",
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        // if the source contains native quotes, the target must too
        const expected = new Result({
            severity: "error",
            description: "Source string substitution parameter %(name)s not found in the target string.",
            id: "printf.test",
            source: 'This string contains a %(name)s string in it.',
            highlight: '<e0>Diese Zeichenfolge enthält keinen anderen Zeichenfolgen.</e0>',
            rule,
            pathName: "x"
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testLegacyMatchRuleMatchNoParams: function(test) {
        test.expect(2);

        const rule = new LegacyMatchRule();
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

    testLegacyMatchRuleMatchExtraParamsInTarget: function(test) {
        test.expect(2);

        const rule = new LegacyMatchRule();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains a name string in it.',
                targetLocale: "de-DE",
                target: "Diese Zeichenfolge enthält %(name)s anderen Zeichenfolgen %(name)s.",
                pathName: "a/b/c.xliff"
            }),
            file: "x"
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
                pathName: "x"
            }),
            new Result({
                severity: "error",
                description: "Extra target string substitution parameter %(name)s not found in the source string.",
                id: "printf.test",
                source: 'This string contains a name string in it.',
                highlight: 'Diese Zeichenfolge enthält <e0>%(name)s</e0> anderen Zeichenfolgen <e0>%(name)s</e0>.',
                rule,
                pathName: "x"
            })
        ];
        test.deepEqual(actual, expected);

        test.done();
    },

    testLegacyMatchRuleMatchMatchingParams: function(test) {
        test.expect(2);

        const rule = new LegacyMatchRule();
        test.ok(rule);

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains %(name)s in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält %(name)s.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    },

    testLegacyMatchRuleMatchMatchingParamsMultiple: function(test) {
        test.expect(2);

        const rule = new LegacyMatchRule();
        test.ok(rule);

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string %(number)d contains %(name)s in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält %(name)s %(number)d.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    }
};

