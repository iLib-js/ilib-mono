/*
 * ResourceMatcher.test.js - test the built-in regular-expression-based rules
 *
 * Copyright © 2022-2025 JEDLSoft
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
import { ResourceString, ResourceArray, ResourcePlural } from 'ilib-tools-common';

import ResourceMatcher from '../src/rules/ResourceMatcher.js';
import { regexRules } from '../src/plugins/BuiltinPlugin.js';

import { Result } from 'ilib-lint-common';

import {expect, jest, test} from '@jest/globals';

function findRuleDefinition(name) {
    return regexRules.find(rule => rule.name === name);
}

describe("testResourceMatcher", () => {
    test("ResourceMatcher", () => {
        expect.assertions(1);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();
    });

    test("ResourceMatcherMissingName", () => {
        expect.assertions(1);

        expect(() => {
            const rule = new ResourceMatcher({
                description: "a",
                note: "b",
                regexps: [ "a" ]
            });
        }).toThrow();
    });

    test("ResourceMatcherMissingDescription", () => {
        expect.assertions(1);

        expect(() => {
            const rule = new ResourceMatcher({
                name: "a",
                note: "b",
                regexps: [ "a" ]
            });
        }).toThrow();
    });

    test("ResourceMatcherMissingNote", () => {
        expect.assertions(1);

        expect(() => {
            const rule = new ResourceMatcher({
                name: "a",
                description: "a",
                regexps: [ "a" ]
            });
        }).toThrow();
    });

    test("ResourceMatcherMissingRegexps", () => {
        expect.assertions(1);

        expect(() => {
            const rule = new ResourceMatcher({
                name: "a",
                description: "a",
                note: "b"
            });
        }).toThrow();
    });

    test("ResourceURLMatch", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an URL in it http://www.box.com',
            targetLocale: "de-DE",
            target: "Dies hat ein URL http://www.box.com",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceURLMatch with query and hash", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an URL in it http://www.box.com/api?q=asdf&s=34534#hash',
            targetLocale: "de-DE",
            target: "Dies hat ein URL http://www.box.com/api?q=asdf&s=34534#hash",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceURLMatchArray", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "url.test",
            sourceLocale: "en-US",
            source: [
                'This has an URL in it http://www.box.com'
            ],
            targetLocale: "de-DE",
            target: [
                "Dies hat ein URL http://www.box.com"
            ],
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource()[0],
            target: resource.getTarget()[0],
            resource,
            file: "a/b/c.xliff",
            index: 0
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceURLMatchPlural", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "url.test",
            sourceLocale: "en-US",
            source: {
                one: 'This has an URL in it http://www.box.com',
                other: "x"
            },
            targetLocale: "de-DE",
            target: {
                one: "Dies hat ein URL http://www.box.com",
                other: "y"
            },
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource().other,
            target: resource.getTarget().other,
            resource,
            file: "a/b/c.xliff",
            category: "other"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceURLMatchPluralTargetDoesNotUseCategory", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "url.test",
            sourceLocale: "en-US",
            source: {
                one: 'This has an URL in it http://www.box.com',
                other: "x"
            },
            targetLocale: "ja-JP",
            target: {
                other: "y"
            },
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource().other,
            target: resource.getTarget().other,
            resource,
            file: "a/b/c.xliff",
            category: "other"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceURLMatchMismatch", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an URL in it http://www.box.com',
            targetLocale: "de-DE",
            target: "Dies hat ein URL http://www.yahoo.com",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("url.test");
        expect(actual[0].description).toBe("URL 'http://www.box.com' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: Dies hat ein URL http://www.yahoo.com<e0></e0>");
        expect(actual[0].source).toBe('This has an URL in it http://www.box.com');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceURLMatchMismatchArray", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "url.test",
            sourceLocale: "en-US",
            source: [
                'This has an URL in it http://www.box.com',
                'This also has an URL in it http://www.google.com'
            ],
            targetLocale: "de-DE",
            target: [
                "Dies hat ein URL http://www.yahoo.com",
                "Dies hat auch ein URL darin http://www.google.com"
            ],
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource()[0],
            target: resource.getTarget()[0],
            resource,
            file: "a/b/c.xliff",
            index: 0
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("url.test");
        expect(actual[0].description).toBe("URL 'http://www.box.com' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target[0]: Dies hat ein URL http://www.yahoo.com<e0></e0>");
        expect(actual[0].source).toBe('This has an URL in it http://www.box.com');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceURLMatchMismatchPlural", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "url.test",
            sourceLocale: "en-US",
            source: {
                one: "This has an URL in it http://www.box.com",
                other: "This also has an URL in it http://www.google.com"
            },
            targetLocale: "de-DE",
            target: {
                one: "Dies hat ein URL http://www.yahoo.com",
                other: "Dies hat auch ein URL darin http://www.google.com"
            },
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource().one,
            target: resource.getTarget().one,
            resource,
            file: "a/b/c.xliff",
            category: "one"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("url.test");
        expect(actual[0].description).toBe("URL 'http://www.box.com' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target(one): Dies hat ein URL http://www.yahoo.com<e0></e0>");
        expect(actual[0].source).toBe('This has an URL in it http://www.box.com');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceURLMatchMultiple", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has a few URLs in it http://www.box.com http://www.google.com/',
            targetLocale: "de-DE",
            target: "Dies hat ein URL http://www.box.com http://www.google.com/",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceURLMatchMultipleReverseOrder", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has a few URLs in it http://www.box.com http://www.google.com/',
            targetLocale: "de-DE",
            target: "Dies hat ein URL http://www.google.com/ http://www.box.com",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceURLMatchMultipleMissing", () => {
        expect.assertions(3);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has a few URLs in it http://www.box.com http://www.google.com/',
            targetLocale: "de-DE",
            target: "Dies hat ein URL http://www.google.com/",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);
    });

    test("ResourceURLNonMatch1", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'Click on the menu choice "Open with..." to select a different program.',
            targetLocale: "de-DE",
            target: 'Klicken Sie auf die Menüauswahl "Öffnen mit...", um ein anderes Programm auszuwählen.',
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceURLNonMatch2", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'You can remove any of these to reset the association. (e.g. removing an association will allow you to use another acccount.)',
            targetLocale: "de-DE",
            target: 'Sie können diese entfernen, um die Zuordnung zurückzusetzen. (z.B. Wenn Sie eine Verknüpfung entfernen, können Sie ein anderes Konto verwenden.)',
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceURLMatch at the end of a sentence at the end of the string", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an URL in it http://www.box.com.',
            targetLocale: "ja-JP",
            target: "この中にURLがあります http://www.box.com。",
            pathName: "a/b/c.xliff"
        });
        // should not give an error because the period at the end of the source string
        // is not part of the URL. The URL ends with the "m" in "com".
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceURLMatch at the end of a sentence in the middle of the string", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an URL in it http://www.box.com. This sentence does not.',
            targetLocale: "ja-JP",
            target: "この中にURLがあります http://www.box.com。 この文はありません。",
            pathName: "a/b/c.xliff"
        });
        // should not give an error because the period at the end of the URL
        // is not part of the URL. The URL ends with the "m" in "com".
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceURLMatch correctly gives result for mismatch in the query", () => {
        expect.assertions(8);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an URL in it http://www.box.com/api?q=asdf%20&s=34534#hash',
            targetLocale: "de-DE",
            target: "Dies hat ein URL http://www.box.com/api?q=asdf%20&s=34534877#hash",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("url.test");
        expect(actual[0].highlight).toBe("Target: Dies hat ein URL http://www.box.com/api?q=asdf%20&s=34534877#hash<e0></e0>");
        expect(actual[0].source).toBe('This has an URL in it http://www.box.com/api?q=asdf%20&s=34534#hash');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceURLMatch correctly gives result for mismatch in the hash", () => {
        expect.assertions(8);

        const rule = new ResourceMatcher(findRuleDefinition("resource-url-match"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an URL in it http://www.box.com/api?q=asdf%20&s=34534#hashone',
            targetLocale: "de-DE",
            target: "Dies hat ein URL http://www.box.com/api?q=asdf%20&s=34534#hashtwo",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("url.test");
        expect(actual[0].highlight).toBe("Target: Dies hat ein URL http://www.box.com/api?q=asdf%20&s=34534#hashtwo<e0></e0>");
        expect(actual[0].source).toBe('This has an URL in it http://www.box.com/api?q=asdf%20&s=34534#hashone');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNamedParamsMatch", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {URL} in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein {job} drin.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("url.test");
        expect(actual[0].description).toBe("The named parameter '{URL}' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: Dies hat ein {job} drin.<e0></e0>");
        expect(actual[0].source).toBe('This has an {URL} in it.');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNamedParamsNoMatch", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {job} in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein {job} drin.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceNamedParamsNoMatchCapitals", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {URL} in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein {URL} drin.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceNamedParamsMatch", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'This has an {URL} in it.',
            targetLocale: "de-DE",
            target: "Dies hat ein {job} drin.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("url.test");
        expect(actual[0].description).toBe("The named parameter '{URL}' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: Dies hat ein {job} drin.<e0></e0>");
        expect(actual[0].source).toBe('This has an {URL} in it.');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNamedParamsNotInPlurals", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'In {number} {days, plural, one {day} other {days}}',
            targetLocale: "de-DE",
            target: "In {number} {days, plural, one {Tag} other {Tagen}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // {day} is part of the plural, not a replacement param
        expect(!actual).toBeTruthy();
    });

    test("ResourceNamedParamsNotInPluralsButOutsideOfThem", () => {
        expect.assertions(9);

        const rule = new ResourceMatcher(findRuleDefinition("resource-named-params"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "url.test",
            sourceLocale: "en-US",
            source: 'In {number} {days, plural, one {day} other {days}}',
            targetLocale: "de-DE",
            target: "In {num} {days, plural, one {Tag} other {Tagen}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("url.test");
        expect(actual[0].description).toBe("The named parameter '{number}' from the source string does not appear in the target string");
        expect(actual[0].highlight).toBe("Target: In {num} {days, plural, one {Tag} other {Tagen}}<e0></e0>");
        expect(actual[0].source).toBe('In {number} {days, plural, one {day} other {days}}');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNamedParamsInsidePlurals", () => {
        expect.assertions(2);

        const rule = new ResourceMatcher(findRuleDefinition("resource-named-params"));
        expect(rule).toBeTruthy();

        const actual = rule.match({
            locale: "de-DE",
            resource: new ResourceString({
                key: "url.test",
                sourceLocale: "en-US",
                source: '{days, plural, one {{count} day} other {all the days}}',
                targetLocale: "zh-Hans-CN",
                target: "{days, plural, other {所有的日子}}",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });

        // should not match the parameters inside of the plural because sometimes the
        // translation of the plural adds or subtracts plural categories creating false matches
        expect(!actual).toBeTruthy();
    });
});
