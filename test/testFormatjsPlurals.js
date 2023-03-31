/*
 * testFormatjsPlurals.js - test the formatjs plural syntax rule
 *
 * Copyright © 2023 Box, Inc.
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
import { Result } from 'i18nlint-common';

import JSXParser from '../src/JSXParser.js';
import FormatjsPlurals from '../src/rules/FormatjsPlurals.js';

export const testFormatjsPlurals = {
    testFormatjsPluralsMatchNoError: function(test) {
        test.expect(2);

        const rule = new FormatjsPlurals();
        test.ok(rule);
        const parser = new JSXParser();
        const ir = parser.parseString(
            `
            // @flow
            import { defineMessages } from 'react-intl';
            
            const messages = defineMessages({
                message1: {
                    id: "myprogram.message1",
                    description: "this is a test",
                    defaultMessage: "{count, plural, one {This is singular} other {This is plural}}"
                }
            });
            export default messages;
            `);

        const actual = rule.match({
            ir,
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testFormatjsPluralsMatchSyntaxError: function(test) {
        test.expect(3);

        const rule = new FormatjsPlurals();
        test.ok(rule);
        const parser = new JSXParser();
        const ir = parser.parseString(
            `
            // @flow
            import { defineMessages } from 'react-intl';
            
            const messages = defineMessages({
                message1: {
                    id: "myprogram.message1",
                    description: "this is a test",
                    defaultMessage: "{count, plural, one {This is singular} other {This is plural}}"
                },
                "message2": {
                    id: "myprogram.message2",
                    description: "this is a test where the final closing curly brace is missing",
                    defaultMessage: "{count, plural, one {This is singular} other {This is plural}"
                }
            });
            export default messages;
            `);

        //console.log(JSON.stringify(intermediateRepresentation, undefined, 2));

        const actual = rule.match({
            ir,
            file: "x/y"
        });
        test.ok(actual);
        const expected = new Result({
            severity: "error",
            description: "Incorrect plural or select syntax in string: SyntaxError: EXPECT_ARGUMENT_CLOSING_BRACE",
            id: "myprogram.message2",
            highlight: '{count, plural, one {This is singular} other {This is plural}<e0></e0>',
            rule,
            pathName: "x/y",
            lineNumber: 14
        });
        test.deepEqual(actual, expected);

        test.done();
    },

/*
    testFormatjsPluralsMatchNestedNoError: function(test) {
        test.expect(2);

        const rule = new FormatjsPlurals();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: '{count, plural, one {{total, plural, one {There is {count} of {total} item available} other {There is {count} of {total} items available}}} other {{total, plural, one {There are {count} of {total} item available} other {There are {count} of {total} items available}}}}',
                targetLocale: "de-DE",
                target: "{count, plural, one {{total, plural, one {Es gibt {count} von {total} Arkitel verfügbar} other {Es gibt {count} von {total} Arkitel verfügbar}}} other {{total, plural, one {Es gibt {count} von {total} Arkitel verfügbar} other {Es gibt {count} von {total} Arkitel verfügbar}}}}",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testFormatjsPluralsMatchNestedMultiLineNoError: function(test) {
        test.expect(2);

        const rule = new FormatjsPlurals();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
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
            }),
            file: "x/y"
        });
        test.ok(!actual);

        test.done();
    },

    testFormatjsPluralsMatchTooManyOpenBraces: function(test) {
        test.expect(2);

        const rule = new FormatjsPlurals();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: '{count, plural, one {This is singular} other {This is plural}}',
                targetLocale: "de-DE",
                target: "{count, plural, one {{Dies ist einzigartig} other {Dies ist mehrerartig}}",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        const expected = new Result({
            severity: "error",
            description: "Incorrect plural or select syntax in target string: SyntaxError: MALFORMED_ARGUMENT",
            id: "plural.test",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            highlight: 'Target: {count, plural, one {{Dies <e0>ist einzigartig} other {Dies ist mehrerartig}}</e0>',
            rule,
            pathName: "x/y"
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testFormatjsPluralsMatchUnclosedOpenBraces: function(test) {
        test.expect(2);

        const rule = new FormatjsPlurals();
        test.ok(rule);

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: '{count, plural, one {This is singular} other {This is plural}}',
                targetLocale: "de-DE",
                target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        const expected = new Result({
            severity: "error",
            description: "Incorrect plural or select syntax in target string: SyntaxError: EXPECT_ARGUMENT_CLOSING_BRACE",
            id: "plural.test",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            highlight: 'Target: {count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}<e0></e0>',
            rule,
            pathName: "x/y"
        });
        test.deepEqual(actual, expected);

        test.done();
    },

    testFormatjsPluralsMatchMissingCategoriesInSource: function(test) {
        test.expect(2);

        const rule = new FormatjsPlurals();
        test.ok(rule);

        const actual = rule.match({
            locale: "ru-RU",
            resource: new ResourceString({
                key: "plural.test",
                sourceLocale: "en-US",
                source: '{count, plural, other {This is plural}}',
                targetLocale: "de-DE",
                target: "{count, plural, one {Это единственное число} few {это множественное число} other {это множественное число}}",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        const expected = new Result({
            severity: "error",
            description: "Missing plural categories in source string: one. Expecting these: one, other",
            id: "plural.test",
            highlight: 'Source: {count, plural, other {This is plural}}<e0></e0>',
            rule,
            pathName: "x/y",
            source: '{count, plural, other {This is plural}}'
        });
        test.deepEqual(actual, expected);

        test.done();
    },
    */
};

