/*
 * ResourceMatcher.test.js - test the built-in regular-expression-based rules
 *
 * Copyright © 2022-2024 JEDLSoft
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
            file: "a/b/c.xliff"
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
            file: "a/b/c.xliff"
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
            file: "a/b/c.xliff"
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

describe("resource-snake-case", () => {
    test("defines the built-in declarative resource-matcher rule", () => {
        const rule = new ResourceMatcher(findRuleDefinition("resource-snake-case"));

        expect(rule.name).toBe("resource-snake-case");
        expect(rule).toBeInstanceOf(ResourceMatcher);
    });

    test("sets the rule severity to 'error'", () => {
        const rule = new ResourceMatcher(findRuleDefinition("resource-snake-case"));

        expect(rule.severity).toBe("error");
    });

    test.each([
        {name: "empty", source: ""},
        {name: "undefined", source: undefined},
        {name: "null", source: null},

        {name: "whitespace solely", source: " "},
        {name: "undersocre solely", source: "_"},
        {name: "digits solely (no underscores)", source: "123"},
        {name: "word solely (no uderscores)", source: "word"},

        {name: "leading and trailing undersocre/simple markdown", source: "_italic_"},
        {name: "markdown", source: "This is _italic_ text"},

        {name: "text and whitespace", source: "snake case"},
        {name: "snake case and text", source: "snake_case and text"},
    ])("does not apply if source string is $name", ({source}) => {
        const rule = new ResourceMatcher(findRuleDefinition("resource-snake-case"));
        const resource = createTestSnakeCaseResourceString({source, target: "does not matter"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            resource,
            file: resource.pathName
        });

        expect(result).toBeUndefined();
    });

    test.each(
        [
            {name: "snake case", source: "snake_case"},
            {name: "screaming snake case", source: "SOME_SCREAMING_SNAKE_CASE"},
            {name: "camel snake case", source: "camel_Snake_Case"},
            {name: "mixed case", source: "mixed_CASE"},
            {name: "randomly mixed case", source: "sNake_cASe"},

            {name: "any snake case with leading and trailing whitespace", source: " ANY_sNake_cASe "},
            {name: "any snake case with numbers", source: "ANY_sNake_cASe123_456"},
            {name: "any case with leading underscore", source: "_ANY_sNake_cASe"},
            {name: "any case with trailing underscore", source: "ANY_sNake_cASe_"},

            {name: "single word with leading underscore", source: "_word"},
            {name: "single number with leading underscore", source: "_123"},

            {name: "single word with with trailing undersocre", source: "word_"},
            {name: "single number with with trailing undersocre", source: "123_"},
        ]
    )("applies if source string is $name", ({name, source}) => {
        const rule = new ResourceMatcher(findRuleDefinition("resource-snake-case"));
        const resource = createTestSnakeCaseResourceString({source, target: "does not matter"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).not.toBeUndefined();
    });

    test("returns `undefined` if source and target strings are the same", () => {
        const rule = new ResourceMatcher(findRuleDefinition("resource-snake-case"));
        const resource = createTestSnakeCaseResourceString({
            source: "do_not_translate_me",
            target: "do_not_translate_me"
        });

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns error if source and target strings are different", () => {
        const rule = new ResourceMatcher(findRuleDefinition("resource-snake-case"));
        const resource = createTestSnakeCaseResourceString({
            source: "two_words_in_english",
            target: "dos_palabras_en_español"
        });

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toHaveLength(1);
        expect(result).toEqual(expect.arrayContaining([expect.any(Result)]));
        expect(result).toEqual(expect.arrayContaining([expect.objectContaining({
            severity: "error",
            rule: expect.any(ResourceMatcher),
        })]));
    });

    test.each([
        {name: "empty", target: ""},
        {name: "undefined", target: undefined},
        {name: "null", target: null},

    ])("returns error if target string is $name", ({target}) => {
        const rule = new ResourceMatcher(findRuleDefinition("resource-snake-case"));
        const resource = createTestSnakeCaseResourceString({source: "snake_case", target});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            resource,
            file: resource.pathName
        });

        expect(result).toHaveLength(1);
        expect(result).toEqual(expect.arrayContaining([expect.any(Result)]));
        expect(result).toEqual(expect.arrayContaining([expect.objectContaining({
            severity: "error",
            rule: expect.any(ResourceMatcher),
        })]));
    });
});

describe("resource-camel-case", () => {
    test("defines the built-in declarative resource-matcher rule", () => {
        const rule = new ResourceMatcher(findRuleDefinition("resource-camel-case"));

        expect(rule.name).toBe("resource-camel-case");
        expect(rule).toBeInstanceOf(ResourceMatcher);
    });

    test("sets the rule severity to 'error'", () => {
        const rule = new ResourceMatcher(findRuleDefinition("resource-camel-case"));

        expect(rule.severity).toBe("error");
    });

    test.each([
        {name: "is empty", source: ""},
        {name: "is undefined", source: undefined},
        {name: "is null", source: null},

        {name: "is whitespace solely", source: " "},
        {name: "is digits solely", source: "123"},
        {name: "is lowercase letters word solely", source: "word"},
        {name: "is uppercase letters word solely", source: "WORD"},
        {name: "is uppercase letters word solely", source: "Word"},

        {name: "ends with capitalized letter", source: "CamelCasE"},
        {name: "has more than one consecutive uppercase letters", source: "CAmelCase"},
        {name: "has dot (.)", source: "Camel.Case"},
        {name: "has underscore (_)", source: "Camel_Case"},
        {name: "has dash (-)", source: "Camel-Case"},

        {name: "has camel case and text", source: "camelCase and text"},
    ])("does not apply if source string $name", ({source}) => {
        const rule = new ResourceMatcher(findRuleDefinition("resource-camel-case"));
        const resource = createTestCamelCaseResourceString({source, target: "does not matter"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            resource,
            file: resource.pathName
        });

        expect(result).toBeUndefined();
    });

    test.each(
        [
            {name: "lower camel case", source: "camelCase"},
            {name: "upper camel case a.k.a. pascal case", source: "PascalCase"},
            {name: "randomly mixed camel case", source: "cAmelCaSe"},

            {name: "any camel case with leading and trailing whitespace", source: " AnyCamelCase "},
            {name: "any camel case with digits at any position", source: "C4m3lC4s3W1thD1g1ts"},
        ]
    )("applies if source string is $name", ({name, source}) => {
        const rule = new ResourceMatcher(findRuleDefinition("resource-camel-case"));
        const resource = createTestCamelCaseResourceString({source, target: "does not matter"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).not.toBeUndefined();
    });

    test("returns `undefined` if source and target strings are the same", () => {
        const rule = new ResourceMatcher(findRuleDefinition("resource-camel-case"));
        const resource = createTestCamelCaseResourceString({source: "doNotTranslateMe", target: "doNotTranslateMe"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns error if source and target strings are different", () => {
        const rule = new ResourceMatcher(findRuleDefinition("resource-camel-case"));
        const resource = createTestCamelCaseResourceString({
            source: "TwoWordsInEnglish",
            target: "DosPalabrasEnEspañol"
        });

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toHaveLength(1);
        expect(result).toEqual(expect.arrayContaining([expect.any(Result)]));
        expect(result).toEqual(expect.arrayContaining([expect.objectContaining({
            severity: "error",
            rule: expect.any(ResourceMatcher),
        })]));
    });

    test.each([
        {name: "empty", target: ""},
        {name: "undefined", target: undefined},
        {name: "null", target: null},

    ])("returns error if target string is $name", ({target}) => {
        const rule = new ResourceMatcher(findRuleDefinition("resource-camel-case"));
        const resource = createTestCamelCaseResourceString({source: "camelCase", target});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            resource,
            file: resource.pathName
        });

        expect(result).toHaveLength(1);
        expect(result).toEqual(expect.arrayContaining([expect.any(Result)]));
        expect(result).toEqual(expect.arrayContaining([expect.objectContaining({
            severity: "error",
            rule: expect.any(ResourceMatcher),
        })]));
    });
})

function createTestSnakeCaseResourceString({source, target}) {
    return new ResourceString({
        source,
        target,
        key: "snake.case.test.string.id",
        sourceLocale: "en-US",
        targetLocale: "es-ES",
        pathName: "tests/for/snake_case.xliff"
    });
}

function createTestCamelCaseResourceString({source, target}) {
    return new ResourceString({
        source,
        target,
        key: "camel.case.test.string.id",
        sourceLocale: "en-US",
        targetLocale: "es-ES",
        pathName: "tests/for/camelCase.xliff"
    });
}
