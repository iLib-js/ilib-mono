/*
 * ResourceNoTranslation.test.js - test the built-in rules
 *
 * Copyright © 2023-2024 JEDLSoft
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

import ResourceNoTranslation from '../src/rules/ResourceNoTranslation.js';

import { Result } from 'ilib-lint-common';

describe("testResourceNoTranslation", () => {
    test("ResourceNoTranslationNone", () => {
        expect.assertions(2);

        const rule = new ResourceNoTranslation();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "translation.test",
            sourceLocale: "en-US",
            source: 'This is the source string.',
            pathName: "a/b/c.xliff",
            state: "new"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "warning",
            description: "Target string is missing a translation.",
            id: "translation.test",
            highlight: 'Target: <e0></e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "en-US",
            source: 'This is the source string.'
        });
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceNoTranslationEmptyString", () => {
        expect.assertions(2);

        const rule = new ResourceNoTranslation();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "translation.test",
            sourceLocale: "en-US",
            source: 'This is the source string.',
            targetLocale: "de-DE",
            target: "",
            pathName: "a/b/c.xliff",
            state: "new"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "warning",
            description: "Target string is missing a translation.",
            id: "translation.test",
            highlight: 'Target: <e0></e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: 'This is the source string.'
        });
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceNoTranslationSameAsSource", () => {
        expect.assertions(2);

        const rule = new ResourceNoTranslation();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "translation.test",
            sourceLocale: "en-US",
            source: 'This is the source string.',
            targetLocale: "de-DE",
            target: "This is the source string.",
            pathName: "a/b/c.xliff",
            state: "new"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "warning",
            description: "Target string is the same as the source string. This is probably an untranslated resource.",
            id: "translation.test",
            highlight: 'Target: <e0>This is the source string.</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: 'This is the source string.'
        });
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceNoTranslationSameAsSourceDifferingInWhitespaceOnly", () => {
        expect.assertions(2);

        const rule = new ResourceNoTranslation();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "translation.test",
            sourceLocale: "en-US",
            source: 'This is the source string.',
            targetLocale: "de-DE",
            target: "\nThis is \t the source string.   ",
            pathName: "a/b/c.xliff",
            state: "new"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "warning",
            description: "Target string is the same as the source string. This is probably an untranslated resource.",
            id: "translation.test",
            highlight: 'Target: <e0>\nThis is \t the source string.   </e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: 'This is the source string.'
        });
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceNoTranslationSameAsSourceDifferingInCaseOnly", () => {
        expect.assertions(2);

        const rule = new ResourceNoTranslation();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "translation.test",
            sourceLocale: "en-US",
            source: 'This is the source string.',
            targetLocale: "de-DE",
            target: "This is the Source String.",
            pathName: "a/b/c.xliff",
            state: "new"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        const expected = new Result({
            severity: "warning",
            description: "Target string is the same as the source string. This is probably an untranslated resource.",
            id: "translation.test",
            highlight: 'Target: <e0>This is the Source String.</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: 'This is the source string.'
        });
        expect(actual).toStrictEqual(expected);
    });

    test("ResourceNoTranslationSameAsSourceButSourceLanguage", () => {
        expect.assertions(2);

        const rule = new ResourceNoTranslation();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "translation.test",
            sourceLocale: "en-US",
            source: 'This is the source string.',
            targetLocale: "en-GB",
            target: "This is the source string.",
            pathName: "a/b/c.xliff",
            state: "new"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // no results because the source and target both have the same
        // language, and it is very common for two dialects of a language
        // to use the same words
        expect(!actual).toBeTruthy();
    });

    test("ResourceNoTranslationThereIsTranslation", () => {
        expect.assertions(2);

        const rule = new ResourceNoTranslation();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "translation.test",
            sourceLocale: "en-US",
            source: 'This is the source string.',
            pathName: "a/b/c.xliff",
            targetLocale: "de-DE",
            target: "Dies ist die Zielzeichenfolge.",
            state: "new"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // text is different, so no problem here
        expect(!actual).toBeTruthy();
    });

    test("ResourceNoTranslationDNT", () => {
        expect.assertions(2);

        const rule = new ResourceNoTranslation();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "translation.test",
            sourceLocale: "en-US",
            source: 'This is the source string.',
            dnt: true,
            targetLocale: "en-GB",
            target: "This is the source string.",
            pathName: "a/b/c.xliff",
            state: "new"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // no results because the resource has the Do Not
        // Translate flag (dnt)
        expect(!actual).toBeTruthy();
    });

    test("ResourceNoTranslationSingleWordText1", () => {
        expect.assertions(2);

        const rule = new ResourceNoTranslation();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "translation.test",
            sourceLocale: "en-US",
            source: 'this-is-kabab-text',
            targetLocale: "de-DE",
            target: "this-is-kabab-text",
            pathName: "a/b/c.xliff",
            state: "new"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // no results because single-word text is automatically DNT
        expect(!actual).toBeTruthy();
    });

    test("ResourceNoTranslationSingleWordText2", () => {
        expect.assertions(2);

        const rule = new ResourceNoTranslation();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "translation.test",
            sourceLocale: "en-US",
            source: 'test',
            targetLocale: "de-DE",
            target: "test",
            pathName: "a/b/c.xliff",
            state: "new"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // no results because single word text is automatically DNT
        expect(!actual).toBeTruthy();
    });
});

