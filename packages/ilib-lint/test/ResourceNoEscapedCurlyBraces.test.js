/*
 * ResourceNoEscapedCurlyBraces.test.js - test the built-in regular-expression-based rules
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
import { ResourceString, ResourceArray, ResourcePlural } from 'ilib-tools-common';

import ResourceTargetChecker from '../src/rules/ResourceTargetChecker.js';
import ResourceSourceChecker from '../src/rules/ResourceSourceChecker.js';
import { regexRules } from '../src/plugins/BuiltinPlugin.js';

import { Result } from 'ilib-lint-common';

function findRuleDefinition(name) {
    return regexRules.find(rule => rule.name === name);
}

describe("testResourceNoEscapedCurlyBraces", () => {
    test("ResourceNoEscapedSourceCurlies", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The name is '{name}'.",
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
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("There should be no escaped replacement parameters. Use Unicode quotes ‘like this’ (U+2018 and U+2019) or double quotes instead.");
        expect(actual[0].highlight).toBe("Source: The name is <e0>'{name}'</e0>.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNoEscapedSourceCurliesMultiple", () => {
        expect.assertions(13);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The name is '{name}' and the id is '{id}'.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(2);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("There should be no escaped replacement parameters. Use Unicode quotes ‘like this’ (U+2018 and U+2019) or double quotes instead.");
        expect(actual[0].highlight).toBe("Source: The name is <e0>'{name}'</e0> and the id is '{id}'.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");

        expect(actual[1].severity).toBe("error");
        expect(actual[1].id).toBe("matcher.test");
        expect(actual[1].description).toBe("There should be no escaped replacement parameters. Use Unicode quotes ‘like this’ (U+2018 and U+2019) or double quotes instead.");
        expect(actual[1].highlight).toBe("Source: The name is '{name}' and the id is <e0>'{id}'</e0>.");
        expect(actual[1].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNoEscapedSourceCurliesStart", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "'{blank}' is the word, it's got groove, it's got meaning.",
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
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("There should be no escaped replacement parameters. Use Unicode quotes ‘like this’ (U+2018 and U+2019) or double quotes instead.");
        expect(actual[0].highlight).toBe("Source: <e0>'{blank}'</e0> is the word, it's got groove, it's got meaning.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNoEscapedSourceCurliesEnd", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Say the word I'm thinking of. Have you heard? The word is '{blank}'",
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
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("There should be no escaped replacement parameters. Use Unicode quotes ‘like this’ (U+2018 and U+2019) or double quotes instead.");
        expect(actual[0].highlight).toBe("Source: Say the word I'm thinking of. Have you heard? The word is <e0>'{blank}'</e0>");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceSkipDoubleQuotedCurlies", () => {
        expect.assertions(2);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: 'The name is "{name}".',
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

    test("ResourceDoubleSingleQuotedCurlies", () => {
        expect.assertions(8);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The name is ''{name}''.",
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
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("There should be no escaped replacement parameters. Use Unicode quotes ‘like this’ (U+2018 and U+2019) or double quotes instead.");
        expect(actual[0].highlight).toBe("Source: The name is <e0>''{name}''</e0>.");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceSkipTripledSingleQuotedCurlies", () => {
        expect.assertions(2);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The name is '''{name}'''.",
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

    test("ResourceSkipResourcesWithNoCurlies", () => {
        expect.assertions(2);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The name is a word.",
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

    test("ResourceSkipResourcesWithNoQuotes", () => {
        expect.assertions(2);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The name is a {word}.",
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

    test("ResourceSkipResourcesWithNoReplacementParam", () => {
        expect.assertions(2);

        const rule = new ResourceSourceChecker(findRuleDefinition("source-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The name is a 'word'.",
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

    test("ResourceTargetNoEscapedSourceCurlies", () => {
        expect.assertions(8);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The name is '{name}'.",
            target: "名前は'{name}'です。",
            targetLocale: "ja-JP",
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
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("There should be no escaped replacement parameters in the translation. Use quotes that are native for the target language or use tripled single-quotes instead.");
        expect(actual[0].highlight).toBe("Target: 名前は<e0>'{name}'</e0>です。");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceTargetNoEscapedSourceCurliesMultiple", () => {
        expect.assertions(13);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The name is '{name}' and the id is '{id}'.",
            target: "名前は'{name}'、ID は'{id}'です。",
            targetLocale: "ja-JP",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(2);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("There should be no escaped replacement parameters in the translation. Use quotes that are native for the target language or use tripled single-quotes instead.");
        expect(actual[0].highlight).toBe("Target: 名前は<e0>'{name}'</e0>、ID は'{id}'です。");
        expect(actual[0].pathName).toBe("a/b/c.xliff");

        expect(actual[1].severity).toBe("error");
        expect(actual[1].id).toBe("matcher.test");
        expect(actual[1].description).toBe("There should be no escaped replacement parameters in the translation. Use quotes that are native for the target language or use tripled single-quotes instead.");
        expect(actual[1].highlight).toBe("Target: 名前は'{name}'、ID は<e0>'{id}'</e0>です。");
        expect(actual[1].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceTargetSkipDoubleQuotedCurlies", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: 'The name is "{name}".',
            target: '名前は"{name}"です。',
            targetLocale: "ja-JP",
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

    test("ResourceTargetDoubleSingleQuotedCurlies", () => {
        expect.assertions(8);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The name is ''{name}''.",
            target: "名前は''{name}''です。",
            targetLocale: "ja-JP",
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
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("There should be no escaped replacement parameters in the translation. Use quotes that are native for the target language or use tripled single-quotes instead.");
        expect(actual[0].highlight).toBe("Target: 名前は<e0>''{name}''</e0>です。");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceTargetSkipTripledSingleQuotedCurlies", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The name is '''{name}'''.",
            target: "名前は'''{name}'''です。",
            targetLocale: "ja-JP",
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

    test("ResourceTargetSkipResourcesWithNoCurlies", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The name is a word.",
            target: "名前は言葉です。",
            targetLocale: "ja-JP",
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

    test("ResourceTargetSkipResourcesWithNoQuotes", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The name is a {word}.",
            target: "名前は{言葉}です。",
            targetLocale: "ja-JP",
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

    test("ResourceTargetSkipResourcesWithNoReplacementParam", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The name is a 'word'.",
            target: "名前は'言葉'です。",
            targetLocale: "ja-JP",
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

    test("ResourceTargetProblemInSourceNotInTarget", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "The name is '{name}'.",
            target: "名前は「{名前}」です。",
            targetLocale: "ja-JP",
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

    test("ResourceTargetNoEscapedSourceCurliesStart", () => {
        expect.assertions(8);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "'{blank}' is the word, it's got groove, it's got meaning.",
            target: "'{blank}' ist das Wort",
            targetLocale: "de-DE",
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
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("There should be no escaped replacement parameters in the translation. Use quotes that are native for the target language or use tripled single-quotes instead.");
        expect(actual[0].highlight).toBe("Target: <e0>'{blank}'</e0> ist das Wort");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceTargetNoEscapedSourceCurliesEnd", () => {
        expect.assertions(8);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-escaped-curly-braces"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Say the word I'm thinking of. Have you heard? The word is '{blank}'",
            target: "Das Wort ist '{blank}'",
            targetLocale: "de-DE",
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
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("There should be no escaped replacement parameters in the translation. Use quotes that are native for the target language or use tripled single-quotes instead.");
        expect(actual[0].highlight).toBe("Target: Das Wort ist <e0>'{blank}'</e0>");
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });
});
