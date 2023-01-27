/*
 * testFStringNumberedRule.js - test the substitution parameter numbering rule
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
import { Result } from 'i18nlint-common';

import FStringNumberedRule from '../src/FStringNumberedRule.js';

export const testFStringNumberedRules = {
    testFStringNumberedRuleStyle: function(test) {
        test.expect(1);

        const rule = new FStringNumberedRule();
        test.ok(rule);

        test.done();
    },

    testFStringNumberedRuleStyleName: function(test) {
        test.expect(2);

        const rule = new FStringNumberedRule();
        test.ok(rule);

        test.equal(rule.getName(), "resource-python-fstrings-numbered");

        test.done();
    },

    testFStringNumberedRuleStyleDescription: function(test) {
        test.expect(2);

        const rule = new FStringNumberedRule();
        test.ok(rule);

        test.equal(rule.getDescription(), "Test that f-string substitution parameters in the source are named or numbered if there are multiple.");

        test.done();
    },

    testFStringNumberedRuleStyleSourceLocale: function(test) {
        test.expect(2);

        const rule = new FStringNumberedRule({
            sourceLocale: "de-DE"
        });
        test.ok(rule);

        test.equal(rule.getSourceLocale(), "de-DE");

        test.done();
    },

    testFStringNumberedRuleStyleGetRuleType: function(test) {
        test.expect(2);

        const rule = new FStringNumberedRule({
            sourceLocale: "de-DE"
        });
        test.ok(rule);

        test.equal(rule.getRuleType(), "resource");

        test.done();
    },

    testFStringNumberedRuleMissingNumbering: function(test) {
        test.expect(2);

        const rule = new FStringNumberedRule();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "fstring.test",
                sourceLocale: "en-US",
                source: 'This {} string contains a {} string in it.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
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
        test.deepEqual(actual, expected);

        test.done();
    },

    testFStringNumberedRuleMatchNoParams: function(test) {
        test.expect(2);

        const rule = new FStringNumberedRule();
        test.ok(rule);

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "fstring.test",
                sourceLocale: "en-US",
                source: 'This string contains no substitution parameters in it.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    },

    testFStringNumberedRuleMatchOneNumbered: function(test) {
        test.expect(2);

        const rule = new FStringNumberedRule();
        test.ok(rule);

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "fstring.test",
                sourceLocale: "en-US",
                source: 'This string contains a {name} substitution parameter in it.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    },

    testFStringNumberedRuleMatchOneUnnumbered: function(test) {
        test.expect(2);

        const rule = new FStringNumberedRule();
        test.ok(rule);

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "fstring.test",
                sourceLocale: "en-US",
                source: 'This string contains a {} substitution parameter in it.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    },

    testFStringNumberedRuleMissingOneNumberedOneNot: function(test) {
        test.expect(2);

        const rule = new FStringNumberedRule();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "fstring.test",
                sourceLocale: "en-US",
                source: 'This {name} string contains a {} string in it.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
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
        test.deepEqual(actual, expected);

        test.done();
    },

    testFStringNumberedRuleMissingTwoNumberedOneNot: function(test) {
        test.expect(2);

        const rule = new FStringNumberedRule();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "fstring.test",
                sourceLocale: "en-US",
                source: 'This {name} string contains a {} string in {location}.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
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
        test.deepEqual(actual, expected);

        test.done();
    },

    testFStringNumberedRuleMissingOneNumberedTwoNot: function(test) {
        test.expect(2);

        const rule = new FStringNumberedRule();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "fstring.test",
                sourceLocale: "en-US",
                source: 'This {name} string contains a {} string in {}.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
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
        test.deepEqual(actual, expected);

        test.done();
    }
};
