/*
 * testRules.js - test the built-in rules
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
import { ResourceArray, ResourcePlural, ResourceString } from 'ilib-tools-common';

import ResourceICUPlurals from '../src/rules/ResourceICUPlurals.js';
import ResourceStateChecker from '../src/rules/ResourceStateChecker.js';
import ResourceEdgeWhitespace from '../src/rules/ResourceEdgeWhitespace.js';
import ResourceCompleteness from "../src/rules/ResourceCompleteness.js";
import ResourceDNTTerms from '../src/rules/ResourceDNTTerms.js';
import ResourceNoTranslation from '../src/rules/ResourceNoTranslation.js';

import { Result, IntermediateRepresentation } from 'i18nlint-common';

export const testRules = {
    testResourceICUPluralsMatchNoError: function(test) {
        test.expect(2);

        const rule = new ResourceICUPlurals();
        test.ok(rule);

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            targetLocale: "de-DE",
            target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceICUPluralsMatchNestedNoError: function(test) {
        test.expect(2);

        const rule = new ResourceICUPlurals();
        test.ok(rule);

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {{total, plural, one {There is {count} of {total} item available} other {There is {count} of {total} items available}}} other {{total, plural, one {There are {count} of {total} item available} other {There are {count} of {total} items available}}}}',
            targetLocale: "de-DE",
            target: "{count, plural, one {{total, plural, one {Es gibt {count} von {total} Arkitel verfügbar} other {Es gibt {count} von {total} Arkitel verfügbar}}} other {{total, plural, one {Es gibt {count} von {total} Arkitel verfügbar} other {Es gibt {count} von {total} Arkitel verfügbar}}}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceICUPluralsMatchNestedMultiLineNoError: function(test) {
        test.expect(2);

        const rule = new ResourceICUPlurals();
        test.ok(rule);

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: `{count, plural,
                one {
                    {total, plural,
                        one {There is {count} of {total} item available}
                        other {There is {count} of {total} items available}
                    }
                }
                other {
                    {total, plural,
                        one {There are {count} of {total} item available}
                        other {There are {count} of {total} items available}
                    }
                }
            }`,
            targetLocale: "de-DE",
            target: `{count, plural,
                one {
                    {total, plural,
                        one {Es gibt {count} von {total} Arkitel verfügbar}
                        other {Es gibt {count} von {total} Arkitel verfügbar}
                    }
                }
                other {
                    {total, plural,
                        one {Es gibt {count} von {total} Arkitel verfügbar}
                        other {Es gibt {count} von {total} Arkitel verfügbar}
                    }
                }
            }`,
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceICUPluralsMatchTooManyOpenBraces: function(test) {
        test.expect(2);

        const rule = new ResourceICUPlurals();
        test.ok(rule);

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            targetLocale: "de-DE",
            target: "{count, plural, one {{Dies ist einzigartig} other {Dies ist mehrerartig}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "error",
            description: "Incorrect plural or select syntax in target string: SyntaxError: MALFORMED_ARGUMENT",
            id: "plural.test",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            highlight: 'Target: {count, plural, one {{Dies <e0>ist einzigartig} other {Dies ist mehrerartig}}</e0>',
            rule,
            locale: "de-DE",
            pathName: "a/b/c.xliff"
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralsMatchUnclosedOpenBraces: function(test) {
        test.expect(2);

        const rule = new ResourceICUPlurals();
        test.ok(rule);

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            targetLocale: "de-DE",
            target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "error",
            description: "Incorrect plural or select syntax in target string: SyntaxError: EXPECT_ARGUMENT_CLOSING_BRACE",
            id: "plural.test",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            highlight: 'Target: {count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}<e0></e0>',
            rule,
            locale: "de-DE",
            pathName: "a/b/c.xliff"
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralsMatchTranslatedCategories: function(test) {
        test.expect(2);

        const rule = new ResourceICUPlurals();
        test.ok(rule);

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            targetLocale: "de-DE",
            target: "{count, plural, eins {Dies ist einzigartig} andere {Dies ist mehrerartig}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "error",
            description: "Incorrect plural or select syntax in target string: SyntaxError: MISSING_OTHER_CLAUSE",
            id: "plural.test",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            highlight: 'Target: {count, plural, eins {Dies ist einzigartig} andere {Dies ist mehrerartig}<e0>}</e0>',
            rule,
            locale: "de-DE",
            pathName: "a/b/c.xliff"
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralsMatchMissingCategoriesInTarget: function(test) {
        test.expect(2);

        const rule = new ResourceICUPlurals();
        test.ok(rule);

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            targetLocale: "ru-RU",
            target: "{count, plural, one {Это единственное число} other {это множественное число}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "error",
            description: "Missing plural categories in target string: few. Expecting these: one, few, other",
            id: "plural.test",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            highlight: 'Target: {count, plural, one {Это единственное число} other {это множественное число}}<e0></e0>',
            rule,
            locale: "ru-RU",
            pathName: "a/b/c.xliff"
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralsMatchMissingCategoriesInSource: function(test) {
        test.expect(2);

        const rule = new ResourceICUPlurals();
        test.ok(rule);

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, other {This is plural}}',
            targetLocale: "ru-RU",
            target: "{count, plural, one {Это единственное число} few {это множественное число} other {это множественное число}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.match({
            locale: "ru-RU",
            file: "a/b/c.xliff"
        });
        // this rule does not test for problems in the source string
        test.ok(!actual);

        test.done();
    },

    testResourceICUPluralsMatchExtraCategoriesInTarget: function(test) {
        test.expect(2);

        const rule = new ResourceICUPlurals();
        test.ok(rule);

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            targetLocale: "de-DE",
            target: "{count, plural, one {Dies ist einzigartig} few {This is few} other {Dies ist mehrerartig}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "warning",
            description: "Extra plural categories in target string: few. Expecting only these: one, other",
            id: "plural.test",
            highlight: 'Target: {count, plural, one {Dies ist einzigartig} few {This is few} other {Dies ist mehrerartig}}<e0></e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: '{count, plural, one {This is singular} other {This is plural}}'
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralsMatchSameCategoriesInSourceAndTargetNoError: function(test) {
        test.expect(2);

        const rule = new ResourceICUPlurals();
        test.ok(rule);

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, =1 {This is one} one {This is singular} other {This is plural}}',
            targetLocale: "de-DE",
            target: "{count, plural, =1 {Dies is eins} one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        test.ok(!actual);

        test.done();
    },

    testResourceICUPluralsMatchTargetIsMissingCategoriesInTarget: function(test) {
        test.expect(2);

        const rule = new ResourceICUPlurals();
        test.ok(rule);

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, =1 {This is one} one {This is singular} other {This is plural}}',
            targetLocale: "de-DE",
            target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "error",
            description: "Missing plural categories in target string: =1. Expecting these: one, other, =1",
            id: "plural.test",
            highlight: 'Target: {count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}<e0></e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: '{count, plural, =1 {This is one} one {This is singular} other {This is plural}}'
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralsMatchMissingCategoriesNested: function(test) {
        test.expect(2);

        const rule = new ResourceICUPlurals();
        test.ok(rule);

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: `{count, plural,
                one {
                    {total, plural,
                        one {There is {count} of {total} item available}
                        other {There is {count} of {total} items available}
                    }
                }
                other {
                    {total, plural,
                        one {There are {count} of {total} item available}
                        other {There are {count} of {total} items available}
                    }
                }
            }`,
            targetLocale: "ru-RU",
            target: `{count, plural,
                one {
                    {total, plural,
                        one {Есть {count} из {total} статьи}
                        few {Есть {count} из {total} статей}
                        other {Есть {count} из {total} статей}
                    }
                }
                few {
                    {total, plural,
                        one {Есть {count} из {total} статьи}
                        other {Есть {count} из {total} статей}
                    }
                }
                other {
                    {total, plural,
                        one {Есть {count} из {total} статьи}
                        few {Есть {count} из {total} статей}
                        other {Есть {count} из {total} статей}
                    }
                }
            }`,
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "error",
            description: "Missing plural categories in target string: few. Expecting these: one, few, other",
            id: "plural.test",
            highlight: 'Target: {count, plural,\n' +
                '                one {\n' +
                '                    {total, plural,\n' +
                '                        one {Есть {count} из {total} статьи}\n' +
                '                        few {Есть {count} из {total} статей}\n' +
                '                        other {Есть {count} из {total} статей}\n' +
                '                    }\n' +
                '                }\n' +
                '                few {\n' +
                '                    {total, plural,\n' +
                '                        one {Есть {count} из {total} статьи}\n' +
                '                        other {Есть {count} из {total} статей}\n' +
                '                    }\n' +
                '                }\n' +
                '                other {\n' +
                '                    {total, plural,\n' +
                '                        one {Есть {count} из {total} статьи}\n' +
                '                        few {Есть {count} из {total} статей}\n' +
                '                        other {Есть {count} из {total} статей}\n' +
                '                    }\n' +
                '                }\n' +
                '            }<e0></e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "ru-RU",
            source: `{count, plural,
                one {
                    {total, plural,
                        one {There is {count} of {total} item available}
                        other {There is {count} of {total} items available}
                    }
                }
                other {
                    {total, plural,
                        one {There are {count} of {total} item available}
                        other {There are {count} of {total} items available}
                    }
                }
            }`
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceICUPluralsMatchMultipleMissingCategoriesNested: function(test) {
        test.expect(2);

        const rule = new ResourceICUPlurals();
        test.ok(rule);

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: `{count, plural,
                one {
                    {total, plural,
                        one {There is {count} of {total} item available}
                        other {There is {count} of {total} items available}
                    }
                }
                other {
                    {total, plural,
                        one {There are {count} of {total} item available}
                        other {There are {count} of {total} items available}
                    }
                }
            }`,
            targetLocale: "ru-RU",
            target: `{count, plural,
                one {
                    {total, plural,
                        one {Есть {count} из {total} статьи}
                        few {Есть {count} из {total} статей}
                        other {Есть {count} из {total} статей}
                    }
                }
                few {
                    {total, plural,
                        one {Есть {count} из {total} статьи}
                        other {Есть {count} из {total} статей}
                    }
                }
                other {
                    {total, plural,
                        one {Есть {count} из {total} статьи}
                        other {Есть {count} из {total} статей}
                    }
                }
            }`,
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = [
            new Result({
                severity: "error",
                description: "Missing plural categories in target string: few. Expecting these: one, few, other",
                id: "plural.test",
                highlight: 'Target: {count, plural,\n' +
                    '                one {\n' +
                    '                    {total, plural,\n' +
                    '                        one {Есть {count} из {total} статьи}\n' +
                    '                        few {Есть {count} из {total} статей}\n' +
                    '                        other {Есть {count} из {total} статей}\n' +
                    '                    }\n' +
                    '                }\n' +
                    '                few {\n' +
                    '                    {total, plural,\n' +
                    '                        one {Есть {count} из {total} статьи}\n' +
                    '                        other {Есть {count} из {total} статей}\n' +
                    '                    }\n' +
                    '                }\n' +
                    '                other {\n' +
                    '                    {total, plural,\n' +
                    '                        one {Есть {count} из {total} статьи}\n' +
                    '                        other {Есть {count} из {total} статей}\n' +
                    '                    }\n' +
                    '                }\n' +
                    '            }<e0></e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "ru-RU",
                source: `{count, plural,
                one {
                    {total, plural,
                        one {There is {count} of {total} item available}
                        other {There is {count} of {total} items available}
                    }
                }
                other {
                    {total, plural,
                        one {There are {count} of {total} item available}
                        other {There are {count} of {total} items available}
                    }
                }
            }`
            }),
            new Result({
                severity: "error",
                description: "Missing plural categories in target string: few. Expecting these: one, few, other",
                id: "plural.test",
                highlight: 'Target: {count, plural,\n' +
                    '                one {\n' +
                    '                    {total, plural,\n' +
                    '                        one {Есть {count} из {total} статьи}\n' +
                    '                        few {Есть {count} из {total} статей}\n' +
                    '                        other {Есть {count} из {total} статей}\n' +
                    '                    }\n' +
                    '                }\n' +
                    '                few {\n' +
                    '                    {total, plural,\n' +
                    '                        one {Есть {count} из {total} статьи}\n' +
                    '                        other {Есть {count} из {total} статей}\n' +
                    '                    }\n' +
                    '                }\n' +
                    '                other {\n' +
                    '                    {total, plural,\n' +
                    '                        one {Есть {count} из {total} статьи}\n' +
                    '                        other {Есть {count} из {total} статей}\n' +
                    '                    }\n' +
                    '                }\n' +
                    '            }<e0></e0>',
                rule,
                pathName: "a/b/c.xliff",
                locale: "ru-RU",
                source: `{count, plural,
                one {
                    {total, plural,
                        one {There is {count} of {total} item available}
                        other {There is {count} of {total} items available}
                    }
                }
                other {
                    {total, plural,
                        one {There are {count} of {total} item available}
                        other {There are {count} of {total} items available}
                    }
                }
            }`
            }),
        ]
        test.deepEqual(actual, expected);

        test.done();
    },

    testResourceEdgeWhitespaceEdgesMatch: function(test) {
        test.expect(2);

        const rule = new ResourceEdgeWhitespace();
        test.ok(rule);

        const resource = new ResourceString({
            key: "resource-edge-whitespace.both-edges-match",
            sourceLocale: "en-US",
            source: "Some source string. ",
            targetLocale: "de-DE",
            target: "Some target string. ",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };

        const result = rule.matchString(subject);
        test.equal(result, undefined); // for a valid resource match result should not be produced
        test.done();
    },

    testResourceEdgeWhitespaceLeadingSpaceMissing: function(test) {
        test.expect(2);

        const rule = new ResourceEdgeWhitespace();
        test.ok(rule);

        const resource = new ResourceString({
            key: "resource-edge-whitespace.leading-space-missing",
            sourceLocale: "en-US",
            source: " some source string.",
            targetLocale: "de-DE",
            target: "some target string.",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // accidentally ommited space in front of target string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);
        test.deepEqual(
            result,
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: " some source string.",
                id: "resource-edge-whitespace.leading-space-missing",
                description: "Leading whitespace in target does not match leading whitespace in source",
                highlight: `Source: <e0>⎵</e0>some… Target: <e1></e1>some…`,
            })
        );
        test.done();
    },

    testResourceEdgeWhitespaceLeadingSpaceExtra: function(test) {
        test.expect(2);

        const rule = new ResourceEdgeWhitespace();
        test.ok(rule);

        const resource = new ResourceString({
            key: "resource-edge-whitespace.leading-space-extra",
            sourceLocale: "en-US",
            source: "Some source string.",
            targetLocale: "de-DE",
            target: " Some target string.",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // accidentally added space in front of target string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);
        test.deepEqual(
            result,
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: "Some source string.",
                id: "resource-edge-whitespace.leading-space-extra",
                description: "Leading whitespace in target does not match leading whitespace in source",
                highlight: `Source: <e0></e0>Some… Target: <e1>⎵</e1>Some…`,
            })
        );
        test.done();
    },

    testResourceEdgeWhitespaceTrailingSpaceMissing: function(test) {
        test.expect(2);

        const rule = new ResourceEdgeWhitespace();
        test.ok(rule);

        const resource = new ResourceString({
            key: "resource-edge-whitespace.trailing-space-missing",
            sourceLocale: "en-US",
            source: "Some source string ",
            targetLocale: "de-DE",
            target: "Some target string",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // accidentally ommited space in the end of target string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);
        test.deepEqual(
            result,
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: "Some source string ",
                id: "resource-edge-whitespace.trailing-space-missing",
                description: "Trailing whitespace in target does not match trailing whitespace in source",
                highlight: `Source: …ring<e0>⎵</e0> Target: …ring<e1></e1>`,
            })
        );
        test.done();
    },

    testResourceEdgeWhitespaceTrailingSpaceExtra: function(test) {
        test.expect(2);

        const rule = new ResourceEdgeWhitespace();
        test.ok(rule);

        const resource = new ResourceString({
            key: "resource-edge-whitespace.trailing-space-extra",
            sourceLocale: "en-US",
            source: "Some source string.",
            targetLocale: "de-DE",
            target: "Some target string. ",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // accidentally added space in the end of target string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);
        test.deepEqual(
            result,
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: "Some source string.",
                id: "resource-edge-whitespace.trailing-space-extra",
                description: "Trailing whitespace in target does not match trailing whitespace in source",
                highlight: `Source: …ing.<e0></e0> Target: …ing.<e1>⎵</e1>`,
            })
        );
        test.done();
    },

    testResourceEdgeWhitespaceTrailingSpaceExtraMore: function(test) {
        test.expect(2);

        const rule = new ResourceEdgeWhitespace();
        test.ok(rule);

        const resource = new ResourceString({
            key: "resource-edge-whitespace.trailing-space-extra-more",
            sourceLocale: "en-US",
            source: "Some source string ",
            targetLocale: "de-DE",
            target: "Some target string  ",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // accidentally added space in the end of target string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);
        test.deepEqual(
            result,
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: "Some source string ",
                id: "resource-edge-whitespace.trailing-space-extra-more",
                description: "Trailing whitespace in target does not match trailing whitespace in source",
                highlight: `Source: …ring<e0>⎵</e0> Target: …ring<e1>⎵⎵</e1>`,
            })
        );
        test.done();
    },

    testResourceEdgeWhitespaceBothEdgesSpaceMissing: function(test) {
        test.expect(2);

        const rule = new ResourceEdgeWhitespace();
        test.ok(rule);

        const resource = new ResourceString({
            key: "resource-edge-whitespace.both-spaces-missing",
            sourceLocale: "en-US",
            source: " some source string ",
            targetLocale: "de-DE",
            target: "some target string",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // accidentally ommited space in front and in the end of target string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);
        test.deepEqual(result, [
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: " some source string ",
                id: "resource-edge-whitespace.both-spaces-missing",
                description: "Leading whitespace in target does not match leading whitespace in source",
                highlight: `Source: <e0>⎵</e0>some… Target: <e1></e1>some…`,
            }),
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: " some source string ",
                id: "resource-edge-whitespace.both-spaces-missing",
                description: "Trailing whitespace in target does not match trailing whitespace in source",
                highlight: `Source: …ring<e0>⎵</e0> Target: …ring<e1></e1>`,
            }),
        ]);
        test.done();
    },

    testResourceEdgeWhitespaceSpacesOnlyMatch: function(test) {
        test.expect(2);

        const rule = new ResourceEdgeWhitespace();
        test.ok(rule);

        const resource = new ResourceString({
            key: "resource-edge-whitespace.spaces-only-match",
            sourceLocale: "en-US",
            source: " ",
            targetLocale: "de-DE",
            target: " ",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // all-whitespace string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);
        test.equal(result, undefined); // for a valid resource match result should not be produced
        test.done();
    },

    testResourceEdgeWhitespaceSpacesOnlyExtra: function(test) {
        test.expect(2);

        const rule = new ResourceEdgeWhitespace();
        test.ok(rule);

        const resource = new ResourceString({
            key: "resource-edge-whitespace.spaces-only-extra",
            sourceLocale: "en-US",
            source: " ",
            targetLocale: "de-DE",
            target: "  ",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // all-whitespace string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);
        test.deepEqual(
            result,
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: " ",
                id: "resource-edge-whitespace.spaces-only-extra",
                description: "Leading whitespace in target does not match leading whitespace in source",
                highlight: `Source: <e0>⎵</e0> Target: <e1>⎵⎵</e1>`,
            })
        );
        test.done();
    },

    testResourceEdgeWhitespaceUndefinedSource: function(test) {
        test.expect(2);

        const rule = new ResourceEdgeWhitespace();
        test.ok(rule);

        const resource = new ResourceString({
            key: "resource-edge-whitespace.undefined-source",
            sourceLocale: "en-US",
            source: undefined,
            targetLocale: "de-DE",
            target: " ",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // missing source
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);
        test.equal(result, undefined); // this rule should not process a resource where source is not a string
        test.done();
    },

    testResourceEdgeWhitespaceUndefinedTarget: function(test) {
        test.expect(2);

        const rule = new ResourceEdgeWhitespace();
        test.ok(rule);

        const resource = new ResourceString({
            key: "resource-edge-whitespace.undefined-target",
            sourceLocale: "en-US",
            source: " ",
            targetLocale: "de-DE",
            target: undefined,
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // missing target
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);
        test.equal(result, undefined); // this rule should not process a resource where target is not a string
        test.done();
    },

    testResourceCompletenessResourceComplete: function(test) {
        test.expect(2);

        const rule = new ResourceCompleteness();
        test.ok(rule);

        const resource = new ResourceString({
            key: "resource-completeness-test.complete",
            sourceLocale: "en-US",
            source: "Some source string.",
            targetLocale: "de-DE",
            target: "Some target string.",
            pathName: "completeness-test.xliff",
            state: "translated",
        });
        const subject = {
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };

        const result = rule.matchString(subject);
        test.equal(result, undefined); // for a valid resource match result should not be produced
        test.done();
    },

    testResourceCompletenessResourceExtraTarget: function(test) {
        test.expect(2);

        const rule = new ResourceCompleteness();
        test.ok(rule);

        const resource = new ResourceString({
            key: "resource-completeness-test.extra-target",
            sourceLocale: "en-US",
            source: undefined,
            targetLocale: "de-DE",
            target: "Some target string.",
            pathName: "completeness-test.xliff",
            state: "translated",
        });
        const subject = {
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };

        const result = rule.matchString(subject);
        test.deepEqual(
            result,
            new Result({
                rule,
                severity: "warning",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: undefined,
                id: "resource-completeness-test.extra-target",
                description: "Extra target string in resource",
                highlight: "<e0>Some target string.</e0>",
            })
        );
        test.done();
    },

    testResourceCompletenessResourceTargetMissing: function(test) {
        test.expect(2);

        const rule = new ResourceCompleteness();
        test.ok(rule);

        const resource = new ResourceString({
            key: "resource-completeness-test.target-missing",
            sourceLocale: "en-US",
            source: "Some source string.",
            targetLocale: "de-DE",
            target: undefined,
            pathName: "completeness-test.xliff",
            state: "translated",
        });
        const subject = {
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };

        const result = rule.matchString(subject);
        test.deepEqual(
            result,
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: "Some source string.",
                id: "resource-completeness-test.target-missing",
                description: "Missing target string in resource",
                highlight: undefined,
            })
        );
        test.done();
    },

    testResourceCompletenessResourceTargetMissingSameLanguage: function(test) {
        test.expect(2);

        const rule = new ResourceCompleteness();
        test.ok(rule);

        const resource = new ResourceString({
            key: "resource-completeness-test.target-missing-same-language",
            sourceLocale: "en-US",
            source: "Some source string.",
            targetLocale: "en-GB",
            target: undefined,
            pathName: "completeness-test.xliff",
            state: "translated",
        });
        const subject = {
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };

        const result = rule.matchString(subject);
        // no error should be produced -
        // en-US and en-GB have same language so target value is optional in this case
        // (it can be ommited for those resources where target is equal to source)
        test.equal(result, undefined);
        test.done()
    },

    testResourceDNTTerms: function(test) {
        test.expect(2);

        const rule = new ResourceDNTTerms({
            terms: [
                "Some DNT term"
            ]
        });
        test.ok(rule);

        const subject = new IntermediateRepresentation({
            filePath: "a/b/c.xliff",
            type: "resource",
            ir: [new ResourceString({
                key: "resource-dnt-test.dnt-missing",
                sourceLocale: "en-US",
                source: "Some source string with Some DNT term in it.",
                targetLocale: "de-DE",
                target: "Some target string with an incorrecly translated DNT term in it.",
                pathName: "dnt-test.xliff",
                state: "translated",
            })]
        });

        const result = rule.match({
            ir: subject,
            file: "a/b/c.xliff"
        });
        test.deepEqual(
            result,
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: "Some source string with Some DNT term in it.",
                id: "resource-dnt-test.dnt-missing",
                description: "A DNT term is missing in target string.",
                highlight: `Missing term: <e0>Some DNT term</e0>`,
            })
        );
        test.done();
    },

    testResourceDNTTermsWithTermsFromTxtFile: function(test) {
        test.expect(2);

        // "Some DNT term" from TXT file should be matched

        const rule = new ResourceDNTTerms({
            termsFilePath: "./test/testfiles/dnt-test.txt",
        });
        test.ok(rule);

        const subject = new IntermediateRepresentation({
            filePath: "a/b/c.xliff",
            type: "resource",
            ir: [new ResourceString({
                key: "resource-dnt-test.dnt-terms-from-txt",
                sourceLocale: "en-US",
                source: "Some source string with Some DNT term in it.",
                targetLocale: "de-DE",
                target: "Some target string with an incorrecly translated DNT term in it.",
                pathName: "dnt-test.xliff",
                state: "translated",
            })]
        });

        const result = rule.match({
            ir: subject,
            file: "a/b/c.xliff"
        });
        test.deepEqual(
            result,
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: "Some source string with Some DNT term in it.",
                id: "resource-dnt-test.dnt-terms-from-txt",
                description: "A DNT term is missing in target string.",
                highlight: `Missing term: <e0>Some DNT term</e0>`,
            })
        );
        test.done();
    },

    testResourceDNTTermsWithTermsFromJsonFile: function(test) {
        test.expect(2);

        // "Some DNT term" from JSON file should be matched

        const rule = new ResourceDNTTerms({
            termsFilePath: "./test/testfiles/dnt-test.json",
        });
        test.ok(rule);

        const subject = new IntermediateRepresentation({
            filePath: "a/b/c.xliff",
            type: "resource",
            ir: [new ResourceString({
                key: "resource-dnt-test.dnt-terms-from-json",
                sourceLocale: "en-US",
                source: "Some source string with Some DNT term in it.",
                targetLocale: "de-DE",
                target: "Some target string with an incorrecly translated DNT term in it.",
                pathName: "dnt-test.xliff",
                state: "translated",
            })]
        });

        const result = rule.match({
            ir: subject,
            file: "a/b/c.xliff"
        });
        test.deepEqual(
            result,
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: "Some source string with Some DNT term in it.",
                id: "resource-dnt-test.dnt-terms-from-json",
                description: "A DNT term is missing in target string.",
                highlight: `Missing term: <e0>Some DNT term</e0>`,
            })
        );
        test.done();
    },

    testResourceDNTTermsMultiple: function(test) {
        test.expect(2);

        const rule = new ResourceDNTTerms({
            terms: [
                "Some DNT term",
                "Another DNT term",
                "Yet another DNT term",
            ]
        });
        test.ok(rule);

        const subject = new IntermediateRepresentation({
            filePath: "a/b/c.xliff",
            type: "resource",
            ir: [new ResourceString({
                key: "resource-dnt-test.dnt-missing-multiple",
                sourceLocale: "en-US",
                source: "Some source string with Some DNT term and Another DNT term in it.",
                targetLocale: "de-DE",
                target: "Some target string with an incorrecly translated DNT term and another incorrecly translated DNT term in it.",
                pathName: "dnt-test.xliff",
                state: "translated",
            })]
        });

        const result = rule.match({
            ir: subject,
            file: "a/b/c.xliff"
        });
        test.deepEqual(
            result,
            [
                new Result({
                    rule,
                    severity: "error",
                    pathName: "a/b/c.xliff",
                    locale: "de-DE",
                    source: "Some source string with Some DNT term and Another DNT term in it.",
                    id: "resource-dnt-test.dnt-missing-multiple",
                    description: "A DNT term is missing in target string.",
                    highlight: `Missing term: <e0>Some DNT term</e0>`,
                }),
                new Result({
                    rule,
                    severity: "error",
                    pathName: "a/b/c.xliff",
                    locale: "de-DE",
                    source: "Some source string with Some DNT term and Another DNT term in it.",
                    id: "resource-dnt-test.dnt-missing-multiple",
                    description: "A DNT term is missing in target string.",
                    highlight: `Missing term: <e0>Another DNT term</e0>`,
                })
            ]
        );
        test.done();
    },

    testResourceDNTTermsResourceArray: function(test) {
        test.expect(2);

        const rule = new ResourceDNTTerms({
            terms: [
                "Some DNT term"
            ]
        });
        test.ok(rule);

        const subject = new IntermediateRepresentation({
            filePath: "a/b/c.xliff",
            type: "resource",
            ir: [new ResourceArray({
                key: "resource-dnt-test.dnt-missing-resource-array",
                sourceLocale: "en-US",
                source: ["not a DNT term item", "Some DNT term item"],
                targetLocale: "de-DE",
                target: ["translated term item", "incorrecly translated DNT term item"],
                pathName: "dnt-test.xliff",
                state: "translated",
            })]
        });

        const result = rule.match({
            ir: subject,
            file: "a/b/c.xliff"
        });
        test.deepEqual(
            result,
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: "Some DNT term item",
                id: "resource-dnt-test.dnt-missing-resource-array",
                description: "A DNT term is missing in target string.",
                highlight: `Missing term: <e0>Some DNT term</e0>`,
            })
        );
        test.done();
    },

    testResourceDNTTermsResourcePluralAllCategories: function(test) {
        test.expect(2);

        const rule = new ResourceDNTTerms({
            terms: [
                "Some DNT term",
                "Another DNT term"
            ]
        });
        test.ok(rule);

        const subject = new IntermediateRepresentation({
            filePath: "a/b/c.xliff",
            type: "resource",
            ir: [new ResourcePlural({
                key: "resource-dnt-test.dnt-missing-resource-plural-all-categories",
                sourceLocale: "en-US",
                source: {
                    "one": "This is Some DNT term singular",
                    "other": "This is Some DNT term many"
                },
                targetLocale: "de-DE",
                target: {
                    "one": "This is incorrectly translated DNT term singular",
                    "two": "This is incorrectly translated DNT term double",
                    "many": "This is correctly translated Some DNT term many"
                },
                pathName: "dnt-test.xliff",
                state: "translated",
            })]
        });

        const result = rule.match({
            ir: subject,
            file: "a/b/c.xliff"
        });
        test.deepEqual(result, [
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: "This is Some DNT term singular",
                id: "resource-dnt-test.dnt-missing-resource-plural-all-categories",
                description: "A DNT term is missing in target string.",
                highlight: `Missing term: <e0>Some DNT term</e0>`,
            }),
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                // no category `two` defined in source, so use "other"
                source: "This is Some DNT term many",
                id: "resource-dnt-test.dnt-missing-resource-plural-all-categories",
                description: "A DNT term is missing in target string.",
                highlight: `Missing term: <e0>Some DNT term</e0>`,
            }),
        ]);
        test.done();
    },

    testResourceDNTTermsResourcePluralSomeCategories: function(test) {
        test.expect(2);

        const rule = new ResourceDNTTerms({
            terms: [
                "Some DNT term",
                "Another DNT term"
            ]
        });
        test.ok(rule);

        const subject = new IntermediateRepresentation({
            filePath: "a/b/c.xliff",
            type: "resource",
            ir: [new ResourcePlural({
                key: "resource-dnt-test.dnt-missing-resource-plural-some-categories",
                sourceLocale: "en-US",
                source: {
                    "one": "This is Some DNT term singular",
                    "many": "This is not a DNT term many"
                },
                targetLocale: "de-DE",
                target: {
                    "one": "This is incorrectly translated DNT term singular",
                    "two": "This is incorrectly translated DNT term double",
                    "many": "This is correctly translated Some DNT term many"
                },
                pathName: "dnt-test.xliff",
                state: "translated",
            })]
        });

        const result = rule.match({
            ir: subject,
            file: "a/b/c.xliff"
        });
        test.deepEqual(result, new Result({
            rule,
            severity: "error",
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: "This is Some DNT term singular",
            id: "resource-dnt-test.dnt-missing-resource-plural-some-categories",
            description: "A DNT term is missing in target string.",
            highlight: `Missing term: <e0>Some DNT term</e0>`,
        }));
        test.done();
    },

    testResourceDNTTermsOk: function(test) {
        test.expect(2);

        const rule = new ResourceDNTTerms({
            terms: [
                "Some DNT term"
            ]
        });
        test.ok(rule);

        const subject = new IntermediateRepresentation({
            filePath: "a/b/c.xliff",
            type: "resource",
            ir: [new ResourceString({
                key: "resource-dnt-test.dnt-ok",
                sourceLocale: "en-US",
                source: "Some source string with Some DNT term in it.",
                targetLocale: "de-DE",
                target: "Some target string with Some DNT term in it.",
                pathName: "dnt-test.xliff",
                state: "translated",
            })]
        });

        const result = rule.match({
            ir: subject,
            file: "a/b/c.xliff"
        });
        test.ok(!result);
        test.done();
    },

    testResourceDNTTermsOkArray: function(test) {
        test.expect(2);

        const rule = new ResourceDNTTerms({
            terms: [
                "Some DNT term"
            ]
        });
        test.ok(rule);

        const subject = new IntermediateRepresentation({
            filePath: "a/b/c.xliff",
            type: "resource",
            ir: [new ResourceArray({
                key: "resource-dnt-test.dnt-ok-resource-array",
                sourceLocale: "en-US",
                source: ["not a DNT term item", "Some DNT term item"],
                targetLocale: "de-DE",
                target: ["translated term item", "correctly translated Some DNT term item"],
                pathName: "dnt-test.xliff",
                state: "translated",
            })]
        });

        const result = rule.match({
            ir: subject,
            file: "a/b/c.xliff"
        });
        test.ok(!result);
        test.done();
    },

    testResourceDNTTermsOkPluralAllCategories: function(test) {
        test.expect(2);

        const rule = new ResourceDNTTerms({
            terms: [
                "Some DNT term"
            ]
        });
        test.ok(rule);

        const subject = new IntermediateRepresentation({
            filePath: "a/b/c.xliff",
            type: "resource",
            ir: [new ResourcePlural({
                key: "resource-dnt-test.dnt-ok-resource-plural-all-categories",
                sourceLocale: "en-US",
                source: {
                    "one": "This is Some DNT term singular",
                    "many": "This is Some DNT term many"
                },
                targetLocale: "de-DE",
                target: {
                    "one": "This is correctly translated Some DNT term singular",
                    "two": "This is correctly translated Some DNT term double",
                    "many": "This is correctly translated Some DNT term many"
                },
                pathName: "dnt-test.xliff",
                state: "translated",
            })]
        });

        const result = rule.match({
            ir: subject,
            file: "a/b/c.xliff"
        });
        test.ok(!result);
        test.done();
    },

    testResourceDNTTermsOkPluralSomeCategories: function(test) {
        test.expect(2);

        const rule = new ResourceDNTTerms({
            terms: [
                "Some DNT term"
            ]
        });
        test.ok(rule);

        const subject = new IntermediateRepresentation({
            filePath: "a/b/c.xliff",
            type: "resource",
            ir: [new ResourcePlural({
                key: "resource-dnt-test.dnt-ok-resource-plural-some-categories",
                sourceLocale: "en-US",
                source: {
                    "one": "This is Some DNT term singular",
                    "many": "This is not a DNT term many"
                },
                targetLocale: "de-DE",
                target: {
                    "one": "This is correctly translated Some DNT term singular",
                    "two": "This is correctly translated not a DNT term double",
                    "many": "This is correctly translated not a DNT term many"
                },
                pathName: "dnt-test.xliff",
                state: "translated",
            })]
        });

        const result = rule.match({
            ir: subject,
            file: "a/b/c.xliff"
        });
        test.ok(!result);
        test.done();
    },
    
    testResourceDNTTermsParseTermsFromJSONFile: function(test) {
        test.expect(1);

        const terms = ResourceDNTTerms.parseTermsFromJsonFile("./test/testfiles/dnt-test.json");

        test.deepEqual(terms, [
            "Some DNT term",
            "Another DNT term"
        ]);

        test.done();
    },

    testResourceDNTTermsParseTermsFromTxtFile: function(test) {
        test.expect(1);

        const terms = ResourceDNTTerms.parseTermsFromTxtFile("./test/testfiles/dnt-test.txt");

        test.deepEqual(terms, [
            "Some DNT term",
            "Another DNT term",
            "A DNT term that should be trimmed",
            "Yet another DNT term that should be trimmed",
            "A DNT term after an empty line",
        ]);

        test.done();
    },
};

