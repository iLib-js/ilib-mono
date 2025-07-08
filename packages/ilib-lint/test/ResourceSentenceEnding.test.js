/*
 * ResourceSentenceEnding.test.js - test the ResourceSentenceEnding rule
 *
 * Copyright © 2025 JEDLSoft
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
import { IntermediateRepresentation, SourceFile } from 'ilib-lint-common';

import ResourceSentenceEnding from '../src/rules/ResourceSentenceEnding.js';
import ResourceFixer from '../src/plugins/resource/ResourceFixer.js';

describe("ResourceSentenceEnding rule", function() {
    test("constructs the rule", () => {
        expect.assertions(3);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        expect(rule.name).toBe("resource-sentence-ending");
        expect(rule.description).toBe("Checks that sentence-ending punctuation is appropriate for the target locale");
    });

    test("Japanese period is converted to maru", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "sentence.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "ja-JP",
            target: "これは文です。",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Japanese target already has correct maru (。)
        expect(actual === null).toBeTruthy();
    });

    test("Japanese period triggers warning if not maru", () => {
        expect.assertions(3);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "sentence.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "ja-JP",
            target: "これは文です.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should trigger because Japanese target has English period instead of maru
        expect(actual).toBeTruthy();
        expect(actual.description).toContain("Sentence ending punctuation should be \"。\" for ja-JP locale");
    });

    test("Japanese question mark is converted to fullwidth", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "question.test",
            sourceLocale: "en-US",
            source: "What is this?",
            targetLocale: "ja-JP",
            target: "これは何ですか？",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Japanese target already has correct question mark (？)
        expect(actual === null).toBeTruthy();
    });

    test("Japanese question mark triggers warning if not fullwidth", () => {
        expect.assertions(3);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "question.test",
            sourceLocale: "en-US",
            source: "What is this?",
            targetLocale: "ja-JP",
            target: "これは何ですか?",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should trigger because Japanese target has English question mark instead of Japanese one
        expect(actual).toBeTruthy();
        expect(actual.description).toContain("Sentence ending punctuation should be \"？\" for ja-JP locale");
    });

    test("Japanese exclamation mark is converted to fullwidth", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "exclamation.test",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "ja-JP",
            target: "これは素晴らしいです！",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Japanese target already has correct exclamation mark (！)
        expect(actual === null).toBeTruthy();
    });

    test("Japanese exclamation mark triggers warning if not fullwidth", () => {
        expect.assertions(3);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "exclamation.test",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "ja-JP",
            target: "これは素晴らしいです!",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should trigger because Japanese target has English exclamation mark instead of Japanese one
        expect(actual).toBeTruthy();
        expect(actual.description).toContain("Sentence ending punctuation should be \"！\" for ja-JP locale");
    });

    test("Japanese ellipsis is converted to Unicode ellipsis", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "ellipsis.test",
            sourceLocale: "en-US",
            source: "This is incomplete...",
            targetLocale: "ja-JP",
            target: "これは不完全です…",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Japanese target already has correct ellipsis (…)
        expect(actual === null).toBeTruthy();
    });

    test("Japanese ellipsis triggers warning if not Unicode ellipsis", () => {
        expect.assertions(3);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "ellipsis.test",
            sourceLocale: "en-US",
            source: "This is incomplete...",
            targetLocale: "ja-JP",
            target: "これは不完全です...",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should trigger because Japanese target has English ellipsis instead of Japanese one
        expect(actual).toBeTruthy();
        expect(actual.description).toContain("Sentence ending punctuation should be \"…\" for ja-JP locale");
    });

    test("Japanese Unicode ellipsis is accepted", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "unicode.ellipsis.test",
            sourceLocale: "en-US",
            source: "This is incomplete…",
            targetLocale: "ja-JP",
            target: "これは不完全です…",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because both source and target have Unicode ellipsis
        expect(actual === null).toBeTruthy();
    });

    test("Unicode ellipsis is recognized in English", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();

        const resource = new ResourceString({
            key: "unicode.ellipsis.test",
            sourceLocale: "en-US",
            source: "This is a sentence…",
            targetLocale: "en-US",
            target: "This is a sentence...",
            pathName: "a/b/c.xliff",
            lineNumber: 101
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        // Should trigger a warning because the target uses "..." instead of "…"
        expect(result).toBeTruthy();
        expect(result?.description).toContain('Sentence ending punctuation should be "…" for en-US locale');
    });

    test("Japanese colon is converted to fullwidth", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "colon.test",
            sourceLocale: "en-US",
            source: "The options are:",
            targetLocale: "ja-JP",
            target: "オプションは：",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Japanese target already has correct colon (：)
        expect(actual === null).toBeTruthy();
    });

    test("Japanese colon triggers warning if not fullwidth", () => {
        expect.assertions(3);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "colon.test",
            sourceLocale: "en-US",
            source: "The options are:",
            targetLocale: "ja-JP",
            target: "オプションは:",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should trigger because Japanese target has English colon instead of Japanese one
        expect(actual).toBeTruthy();
        expect(actual.description).toContain("Sentence ending punctuation should be \"：\" for ja-JP locale");
    });

    test("Chinese period is converted to ideographic full stop", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "chinese.period.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "zh-CN",
            target: "这是一个句子。",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Chinese target already has correct period (。)
        expect(actual === null).toBeTruthy();
    });

    test("Chinese period triggers warning if not ideographic full stop", () => {
        expect.assertions(3);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "chinese.period.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "zh-CN",
            target: "这是一个句子.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should trigger because Chinese target has English period instead of Chinese one
        expect(actual).toBeTruthy();
        expect(actual.description).toContain("Sentence ending punctuation should be \"。\" for zh-CN locale");
    });

    test("Korean period is converted to ideographic full stop", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "korean.period.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "ko-KR",
            target: "이것은 문장입니다。",
            pathName: "a/b/c.xliff",
            lineNumber: 1
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Korean target already has correct period (。)
        expect(actual === null).toBeTruthy();
    });

    test("Korean period triggers warning if not ideographic full stop", () => {
        expect.assertions(3);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "korean.period.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "ko-KR",
            target: "이것은 문장입니다.",
            pathName: "a/b/c.xliff",
            lineNumber: 2
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should trigger because Korean target has English period instead of Korean one
        expect(actual).toBeTruthy();
        expect(actual.description).toContain("Sentence ending punctuation should be \"。\" for ko-KR locale");
    });

    test("English to English does not trigger", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "english.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "en-GB",
            target: "This is a sentence.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because English to English uses same punctuation
        expect(actual === null).toBeTruthy();
    });

    test("No ending punctuation does not trigger", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "no.punctuation.test",
            sourceLocale: "en-US",
            source: "This has no ending punctuation",
            targetLocale: "ja-JP",
            target: "これには終止符がありません",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because source has no ending punctuation
        expect(actual === null).toBeTruthy();
    });

    test("Correct punctuation inside quotes is accepted", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quotes.test",
            sourceLocale: "en-US",
            source: "He said \"Hello.\"",
            targetLocale: "ja-JP",
            target: "彼は「こんにちは。」と言いました。",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Japanese target has correct punctuation inside quotes and sentence-ending maru
        expect(actual === null).toBeTruthy();
    });

    test("Incorrect punctuation after quotes triggers warning", () => {
        expect.assertions(3);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quotes.test",
            sourceLocale: "en-US",
            source: "He said \"Hello.\"",
            targetLocale: "ja-JP",
            target: "彼は「こんにちは。」と言いました.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should trigger because Japanese target has English period at the end
        expect(actual).toBeTruthy();
        expect(actual.description).toContain("Sentence ending punctuation should be \"。\" for ja-JP locale");
    });

    test("Correct punctuation with single quotes is accepted", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "single.quotes.test",
            sourceLocale: "en-US",
            source: "He said 'Hello.'",
            targetLocale: "ja-JP",
            target: "彼は「こんにちは。」と言いました。",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Japanese target has correct punctuation and sentence-ending maru
        expect(actual === null).toBeTruthy();
    });

    test("No target locale does not trigger", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "no.locale.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: undefined,
            target: "これは文です。",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because there's no target locale
        expect(actual === null).toBeTruthy();
    });

    test("Empty strings do not trigger", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "empty.test",
            sourceLocale: "en-US",
            source: "",
            targetLocale: "ja-JP",
            target: "",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because strings are empty
        expect(actual === null).toBeTruthy();
    });

    test("Whitespace only does not trigger", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "whitespace.test",
            sourceLocale: "en-US",
            source: "   ",
            targetLocale: "ja-JP",
            target: "   ",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because strings are only whitespace
        expect(actual === null).toBeTruthy();
    });

    test("Greek period is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "greek.period.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "el-GR",
            target: "Αυτή είναι μια πρόταση.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Greek target has correct period
        expect(actual === null).toBeTruthy();
    });

    test("Greek question mark is accepted (semicolon)", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "greek.question.test",
            sourceLocale: "en-US",
            source: "Is this a question?",
            targetLocale: "el-GR",
            target: "Είναι αυτή μια ερώτηση;",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Greek target has correct question mark (semicolon)
        expect(actual === null).toBeTruthy();
    });

    test("Greek exclamation mark is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "greek.exclamation.test",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "el-GR",
            target: "Αυτό είναι καταπληκτικό!",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Greek target has correct exclamation mark
        expect(actual === null).toBeTruthy();
    });

    test("Greek ellipsis is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "greek.ellipsis.test",
            sourceLocale: "en-US",
            source: "This is incomplete...",
            targetLocale: "el-GR",
            target: "Αυτό είναι ημιτελές...",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Greek target has correct ellipsis
        expect(actual === null).toBeTruthy();
    });

    test("Greek colon is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "greek.colon.test",
            sourceLocale: "en-US",
            source: "This is a list:",
            targetLocale: "el-GR",
            target: "Αυτό είναι μια λίστα:",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Greek target has correct colon
        expect(actual === null).toBeTruthy();
    });

    test("Arabic period is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "arabic.period.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "ar-EG",
            target: "هذه جملة.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Arabic target has correct period
        expect(actual === null).toBeTruthy();
    });

    test("Arabic question mark is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "arabic.question.test",
            sourceLocale: "en-US",
            source: "Is this a question?",
            targetLocale: "ar-EG",
            target: "هل هذا سؤال؟",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Arabic target has correct question mark
        expect(actual === null).toBeTruthy();
    });

    test("Arabic exclamation mark is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "arabic.exclamation.test",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "ar-EG",
            target: "هذا مذهل!",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Arabic target has correct exclamation mark
        expect(actual === null).toBeTruthy();
    });

    test("Arabic ellipsis is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "arabic.ellipsis.test",
            sourceLocale: "en-US",
            source: "This is incomplete...",
            targetLocale: "ar-EG",
            target: "هذا غير مكتمل…",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Arabic target has correct ellipsis
        expect(actual === null).toBeTruthy();
    });

    test("Arabic colon is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "arabic.colon.test",
            sourceLocale: "en-US",
            source: "This is a list:",
            targetLocale: "ar-EG",
            target: "هذه قائمة:",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Arabic target has correct colon
        expect(actual === null).toBeTruthy();
    });

    test("Tibetan period is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "tibetan.period.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "bo-CN",
            target: "འདི་ནི་ཚིག་ཡིན།",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Tibetan target has correct period
        expect(actual === null).toBeTruthy();
    });

    test("Tibetan question mark is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "tibetan.question.test",
            sourceLocale: "en-US",
            source: "Is this a question?",
            targetLocale: "bo-CN",
            target: "འདི་ནི་དྲིས་བརྡ་ཡིན།",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Tibetan target has correct question mark (shad)
        expect(actual === null).toBeTruthy();
    });

    test("Tibetan exclamation mark is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "tibetan.exclamation.test",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "bo-CN",
            target: "འདི་ནི་ཧ་ཅང་ཡིན།",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Tibetan target has correct exclamation mark (shad)
        expect(actual === null).toBeTruthy();
    });

    test("Tibetan ellipsis is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "tibetan.ellipsis.test",
            sourceLocale: "en-US",
            source: "This is incomplete...",
            targetLocale: "bo-CN",
            target: "འདི་ནི་མཇུག་མེད…",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Tibetan target has correct ellipsis
        expect(actual === null).toBeTruthy();
    });

    test("Tibetan colon is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "tibetan.colon.test",
            sourceLocale: "en-US",
            source: "This is a list:",
            targetLocale: "bo-CN",
            target: "འདི་ནི་ཐོ།",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Tibetan target has correct colon (shad)
        expect(actual === null).toBeTruthy();
    });

    test("Amharic period is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "amharic.period.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "am-ET",
            target: "ይህ አንድ ዓረፍተ ነገር ነው።",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Amharic target has correct period
        expect(actual === null).toBeTruthy();
    });

    test("Amharic question mark is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "amharic.question.test",
            sourceLocale: "en-US",
            source: "Is this a question?",
            targetLocale: "am-ET",
            target: "ይህ ጥያቄ ነው፧",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Amharic target has correct question mark
        expect(actual === null).toBeTruthy();
    });

    test("Amharic exclamation mark is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "amharic.exclamation.test",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "am-ET",
            target: "ይህ ቆንጆ ነው!",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Amharic target has correct exclamation mark
        expect(actual === null).toBeTruthy();
    });

    test("Amharic ellipsis is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "amharic.ellipsis.test",
            sourceLocale: "en-US",
            source: "This is incomplete...",
            targetLocale: "am-ET",
            target: "ይህ ያልተጠናቀቀ ነው…",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Amharic target has correct ellipsis
        expect(actual === null).toBeTruthy();
    });

    test("Amharic colon is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "amharic.colon.test",
            sourceLocale: "en-US",
            source: "This is a list:",
            targetLocale: "am-ET",
            target: "ይህ ዝርዝር ነው:",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Amharic target has correct colon
        expect(actual === null).toBeTruthy();
    });

    test("Urdu period is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "urdu.period.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "ur-PK",
            target: "یہ ایک جملہ ہے۔",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Urdu target has correct period
        expect(actual === null).toBeTruthy();
    });

    test("Urdu question mark is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "urdu.question.test",
            sourceLocale: "en-US",
            source: "Is this a question?",
            targetLocale: "ur-PK",
            target: "کیا یہ ایک سوال ہے؟",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Urdu target has correct question mark
        expect(actual === null).toBeTruthy();
    });

    test("Urdu exclamation mark is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "urdu.exclamation.test",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "ur-PK",
            target: "یہ حیرت انگیز ہے!",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Urdu target has correct exclamation mark
        expect(actual === null).toBeTruthy();
    });

    test("Urdu ellipsis is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "urdu.ellipsis.test",
            sourceLocale: "en-US",
            source: "This is incomplete...",
            targetLocale: "ur-PK",
            target: "یہ نامکمل ہے…",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Urdu target has correct ellipsis
        expect(actual === null).toBeTruthy();
    });

    test("Urdu colon is accepted", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "urdu.colon.test",
            sourceLocale: "en-US",
            source: "This is a list:",
            targetLocale: "ur-PK",
            target: "یہ ایک فہرست ہے:",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Urdu target has correct colon
        expect(actual === null).toBeTruthy();
    });

    test("Thai punctuation is optional and does not trigger", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "thai.optional.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "th-TH",
            target: "นี่คือประโยค",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Thai punctuation is optional
        expect(actual === null).toBeTruthy();
    });

    test("Lao punctuation is optional and does not trigger", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "lao.optional.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "lo-LA",
            target: "ນີ້ແມ່ນປະໂຫຍກ",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Lao punctuation is optional
        expect(actual === null).toBeTruthy();
    });

    test("Burmese punctuation is optional and does not trigger", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        const resource = new ResourceString({
            key: "burmese.optional.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "my-MM",
            target: "ဒါဟာ ဝါကျဖြစ်တယ်",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Burmese punctuation is optional
        expect(actual === null).toBeTruthy();
    });

    test("Khmer punctuation is optional", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "khmer.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "km-KH",
            target: "នេះគឺជាប្រយោគមួយ។",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because Khmer punctuation is optional
        expect(actual === null).toBeTruthy();
    });

    test("French guillemets at end are handled correctly", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.quotes.test",
            sourceLocale: "en-US",
            source: "He said \"Hello.\"",
            targetLocale: "fr-FR",
            target: "Il a dit « Bonjour. »",
            pathName: "a/b/c.xliff",
            lineNumber: 3
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger because French target has correct punctuation with guillemets at the end
        expect(actual === null).toBeTruthy();
    });

    test("Custom punctuation mappings from configuration are applied", () => {
        expect.assertions(3);

        const customPunctuationConfig = {
            "fr": {
                "period": "!",
                "question": "?",
                "exclamation": "!",
                "ellipsis": "...",
                "colon": ":"
            }
        };

        const rule = new ResourceSentenceEnding({
            param: customPunctuationConfig
        });

        const resource = new ResourceString({
            key: "custom.punctuation.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "fr-FR",
            target: "Ceci est une phrase!",
            pathName: "a/b/c.xliff",
            lineNumber: 4
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: "a/b/c.xliff"
        });

        // Should not trigger a warning because the custom config allows "!" for periods in French
        expect(result).toBeNull();

        // Test with incorrect punctuation
        const resource2 = new ResourceString({
            key: "custom.punctuation.test2",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "fr-FR",
            target: "Ceci est une phrase.",
            pathName: "a/b/c.xliff",
            lineNumber: 5
        });

        const result2 = rule.matchString({
            source: resource2.getSource(),
            target: resource2.getTarget(),
            resource: resource2,
            file: "a/b/c.xliff"
        });

        // Should trigger a warning because the target uses "." instead of "!" (custom config)
        expect(result2).toBeTruthy();
        expect(result2?.description).toContain('Sentence ending punctuation should be "!" for fr-FR locale');
    });

    test("Auto-fix replaces incorrect punctuation with correct punctuation", () => {
        expect.assertions(7);

        const rule = new ResourceSentenceEnding();

        const resource = new ResourceString({
            key: "autofix.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "ja-JP",
            target: "これは文です.",
            pathName: "a/b/c.xliff",
            lineNumber: 6
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        // Should trigger a warning because the target uses "." instead of "。"
        expect(result).toBeTruthy();
        expect(result?.description).toContain('Sentence ending punctuation should be "。" for ja-JP locale');
        
        // Check that auto-fix is available
        expect(result?.fix).toBeTruthy();
        // At this point we know result and result.fix exist
        const fix = result.fix;
        expect(fix.commands).toHaveLength(1);
        expect(fix.commands[0].stringFix.position).toBeGreaterThan(0);
        expect(fix.commands[0].stringFix.deleteCount).toBe(1);
        expect(fix.commands[0].stringFix.insertContent).toBe("。");
    });

    test("ResourceSentenceEnding apply fix to correct the punctuation", () => {
        expect.assertions(5);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "punctuation.fix.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "ja-JP",
            target: "これは文です.",
            pathName: "a/b/c.xliff",
            lineNumber: 7
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: resource.pathName
        });

        expect(actual).toBeTruthy();
        expect(actual?.fix).toBeTruthy();

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff"),
            dirty: false
        });

        const fixer = new ResourceFixer();
        fixer.applyFixes(ir, [actual.fix]);

        const fixedResource = ir.getRepresentation()[0];
        expect(fixedResource).toBeTruthy();
        expect(fixedResource.getTarget()).toBe("これは文です。");
    });
}); 