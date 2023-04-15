/*
 * testFStringMatchRule.js - test the substitution parameter rule
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

import FStringMatchRule from '../src/FStringMatchRule.js';

import { Result } from 'i18nlint-common';

export const testFStringMatchRules = {
    testFStringMatchRuleStyle: function(test) {
        test.expect(1);

        const rule = new FStringMatchRule();
        test.ok(rule);

        test.done();
    },

    testFStringMatchRuleStyleName: function(test) {
        test.expect(2);

        const rule = new FStringMatchRule();
        test.ok(rule);

        test.equal(rule.getName(), "resource-python-fstrings-match");

        test.done();
    },

    testFStringMatchRuleStyleDescription: function(test) {
        test.expect(2);

        const rule = new FStringMatchRule();
        test.ok(rule);

        test.equal(rule.getDescription(), "Test that the f-string substitution parameters match in the source and target strings.");

        test.done();
    },

    testFStringMatchRuleStyleSourceLocale: function(test) {
        test.expect(2);

        const rule = new FStringMatchRule({
            sourceLocale: "de-DE"
        });
        test.ok(rule);

        test.equal(rule.getSourceLocale(), "de-DE");

        test.done();
    },

    testFStringMatchRuleStyleGetRuleType: function(test) {
        test.expect(2);

        const rule = new FStringMatchRule({
            sourceLocale: "de-DE"
        });
        test.ok(rule);

        test.equal(rule.getRuleType(), "resource");

        test.done();
    },

    testFStringMatchRuleMatchMissingInTarget: function(test) {
        test.expect(2);

        const rule = new FStringMatchRule();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains a {name} string in it.',
                targetLocale: "de-DE",
                target: "Diese Zeichenfolge enthält keinen anderen Zeichenfolgen.",
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        // if the source contains native quotes, the target must too
        const expected = new Result({
            severity: "error",
            description: "Source string substitution parameter {name} not found in the target string.",
            id: "printf.test",
            source: 'This string contains a {name} string in it.',
            highlight: '<e0>Diese Zeichenfolge enthält keinen anderen Zeichenfolgen.</e0>',
            rule,
            pathName: "x"
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testFStringMatchRuleMatchNoParams: function(test) {
        test.expect(2);

        const rule = new FStringMatchRule();
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

    testFStringMatchRuleMatchExtraParamsInTarget: function(test) {
        test.expect(2);

        const rule = new FStringMatchRule();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains a {name} string in it.',
                targetLocale: "de-DE",
                target: "Diese Zeichenfolge enthält {name} anderen Zeichenfolgen {name}.",
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        // if the source contains native quotes, the target must too
        const expected = new Result({
            severity: "error",
            description: "Extra target string substitution parameter {name} not found in the source string.",
            id: "printf.test",
            source: 'This string contains a {name} string in it.',
            highlight: 'Diese Zeichenfolge enthält <e0>{name}</e0> anderen Zeichenfolgen <e0>{name}</e0>.',
            rule,
            pathName: "x"
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testFStringMatchRuleMatchMatchingParams: function(test) {
        test.expect(2);

        const rule = new FStringMatchRule();
        test.ok(rule);

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains {name} in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält {name}.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    },

    testFStringMatchRuleMatchMatchingParamsIgnoreWhitespaceInSource: function(test) {
        test.expect(2);

        const rule = new FStringMatchRule();
        test.ok(rule);

        // whitespace in parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains { name } in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält {name}.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    },

    testFStringMatchRuleMatchMatchingParamsIgnoreWhitespaceInTarget: function(test) {
        test.expect(2);

        const rule = new FStringMatchRule();
        test.ok(rule);

        // whitespace in parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains {name} in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält { name }.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    },

    testFStringMatchRuleMatchMatchingParamsMultiple: function(test) {
        test.expect(2);

        const rule = new FStringMatchRule();
        test.ok(rule);

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string {number} contains {name} in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält {name} {number}.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    },

    testFStringMatchRuleMatchMatchingParamsComplicated: function(test) {
        test.expect(2);

        const rule = new FStringMatchRule();
        test.ok(rule);

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains {number:.3d} in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält {number:.3d}.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    },

    testFStringMatchRuleMatchNonMatchingParamsComplicated: function(test) {
        test.expect(2);

        const rule = new FStringMatchRule();
        test.ok(rule);

        // no parameters in source or target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains {number:.3d} in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält {number:3.3d}.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        const expected = [
            new Result({
                severity: "error",
                description: "Source string substitution parameter {number:.3d} not found in the target string.",
                id: "printf.test",
                source: 'This string contains {number:.3d} in it.',
                highlight: '<e0>Diese Zeichenfolge enthält {number:3.3d}.</e0>',
                rule,
                pathName: "x"
            }),
            new Result({
                severity: "error",
                description: "Extra target string substitution parameter {number:3.3d} not found in the source string.",
                id: "printf.test",
                source: 'This string contains {number:.3d} in it.',
                highlight: 'Diese Zeichenfolge enthält <e0>{number:3.3d}</e0>.',
                rule,
                pathName: "x"
            })
        ];
        test.deepEqual(actual, expected);

        test.done();
    },

    testFStringMatchRuleMatchNumericParams: function(test) {
        test.expect(2);

        const rule = new FStringMatchRule();
        test.ok(rule);

        // numeric params in source and target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains {0} in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält {0}.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(!actual);

        test.done();
    },

    testFStringMatchRuleNonMatchNumericParams: function(test) {
        test.expect(3);

        const rule = new FStringMatchRule();
        test.ok(rule);

        // numeric params in source and target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains {0} in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält {name}.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(actual);
       
        // if the source contains native quotes, the target must too
        const expected = [
	        new Result({
	            severity: "error",
	            description: "Source string substitution parameter {0} not found in the target string.",
	            id: "printf.test",
	            source: 'This string contains {0} in it.',
	            highlight: '<e0>Diese Zeichenfolge enthält {name}.</e0>',
	            rule,
	            pathName: "x"
	        }),
            new Result({
                severity: "error",
                description: "Extra target string substitution parameter {name} not found in the source string.",
                id: "printf.test",
                source: 'This string contains {0} in it.',
                highlight: 'Diese Zeichenfolge enthält <e0>{name}</e0>.',
                rule,
                pathName: "x"
            }),
	    ];
        test.deepEqual(actual, expected);

        test.done();
    },

    testFStringMatchRuleNonMatchNumericTargetParams: function(test) {
        test.expect(3);

        const rule = new FStringMatchRule();
        test.ok(rule);

        // numeric params in source and target is okay
        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "printf.test",
                sourceLocale: "en-US",
                source: 'This string contains {name} in it.',
                targetLocale: "de-DE",
                target: 'Diese Zeichenfolge enthält {0}.',
                pathName: "a/b/c.xliff"
            }),
            file: "x"
        });
        test.ok(actual);
       
        // if the source contains native quotes, the target must too
        const expected = [
            new Result({
                severity: "error",
                description: "Source string substitution parameter {name} not found in the target string.",
                id: "printf.test",
                source: 'This string contains {0} in it.',
                highlight: '<e0>Diese Zeichenfolge enthält {0}.</e0>',
                rule,
                pathName: "x"
            }),
            new Result({
                severity: "error",
                description: "Extra target string substitution parameter {0} not found in the source string.",
                id: "printf.test",
                source: 'This string contains {0} in it.',
                highlight: 'Diese Zeichenfolge enthält <e0>{0}</e0>.',
                rule,
                pathName: "x"
            }),
        ];
        test.deepEqual(actual, expected);

        test.done();
    },
};

