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
        expect(rule.description).toBe("Checks that sentence-ending punctuation is appropriate for the locale of the target string and matches the punctuation in the source string");
    });

    // Parameterized tests for different languages
    const languageTestCases = [
        // Japanese tests
        {
            targetLocale: "ja-JP",
            source: "This is a sentence.",
            target: "これは文です。",
            expectedResult: undefined,
            description: "Japanese period is converted to maru"
        },
        {
            targetLocale: "ja-JP",
            source: "This is a sentence.",
            target: "これは文です.",
            expectedResult: "Sentence ending punctuation should be \"。\" for ja-JP locale",
            description: "Japanese period triggers warning if not maru"
        },
        {
            targetLocale: "ja-JP",
            source: "What is this?",
            target: "これは何ですか？",
            expectedResult: undefined,
            description: "Japanese question mark is converted to fullwidth"
        },
        {
            targetLocale: "ja-JP",
            source: "What is this?",
            target: "これは何ですか?",
            expectedResult: "Sentence ending punctuation should be \"？\" for ja-JP locale",
            description: "Japanese question mark triggers warning if not fullwidth"
        },
        {
            targetLocale: "ja-JP",
            source: "This is amazing!",
            target: "これは素晴らしいです！",
            expectedResult: undefined,
            description: "Japanese exclamation mark is converted to fullwidth"
        },
        {
            targetLocale: "ja-JP",
            source: "This is amazing!",
            target: "これは素晴らしいです!",
            expectedResult: "Sentence ending punctuation should be \"！\" for ja-JP locale",
            description: "Japanese exclamation mark triggers warning if not fullwidth"
        },
        {
            targetLocale: "ja-JP",
            source: "This is incomplete...",
            target: "これは不完全です…",
            expectedResult: undefined,
            description: "Japanese ellipsis is converted to Unicode ellipsis"
        },
        {
            targetLocale: "ja-JP",
            source: "This is incomplete...",
            target: "これは不完全です...",
            expectedResult: "Sentence ending punctuation should be \"…\" for ja-JP locale",
            description: "Japanese ellipsis triggers warning if not Unicode ellipsis"
        },
        {
            targetLocale: "ja-JP",
            source: "The answer is: yes.",
            target: "答えは: はい。",
            expectedResult: undefined,
            description: "Japanese colon is converted to fullwidth"
        },
        {
            targetLocale: "ja-JP",
            source: "The answer is: yes.",
            target: "答えは: はい。",
            expectedResult: undefined,
            description: "Japanese colon triggers warning if not fullwidth"
        },

        // Chinese tests
        {
            targetLocale: "zh-CN",
            source: "This is a sentence.",
            target: "这是一个句子。",
            expectedResult: undefined,
            description: "Chinese period is converted to ideographic full stop"
        },
        {
            targetLocale: "zh-CN",
            source: "This is a sentence.",
            target: "这是一个句子.",
            expectedResult: "Sentence ending punctuation should be \"。\" for zh-CN locale",
            description: "Chinese period triggers warning if not ideographic full stop"
        },
        {
            targetLocale: "zh-CN",
            source: "What is this?",
            target: "这是什么？",
            expectedResult: undefined,
            description: "Chinese question mark is converted to fullwidth"
        },
        {
            targetLocale: "zh-CN",
            source: "What is this?",
            target: "这是什么?",
            expectedResult: "Sentence ending punctuation should be \"？\" for zh-CN locale",
            description: "Chinese question mark triggers warning if not fullwidth"
        },
        {
            targetLocale: "zh-CN",
            source: "This is amazing!",
            target: "这太棒了！",
            expectedResult: undefined,
            description: "Chinese exclamation mark is converted to fullwidth"
        },
        {
            targetLocale: "zh-CN",
            source: "This is amazing!",
            target: "这太棒了!",
            expectedResult: "Sentence ending punctuation should be \"！\" for zh-CN locale",
            description: "Chinese exclamation mark triggers warning if not fullwidth"
        },
        {
            targetLocale: "zh-CN",
            source: "This is incomplete...",
            target: "这是不完整的…",
            expectedResult: undefined,
            description: "Chinese ellipsis is converted to Unicode ellipsis"
        },
        {
            targetLocale: "zh-CN",
            source: "This is incomplete...",
            target: "这是不完整的...",
            expectedResult: "Sentence ending punctuation should be \"…\" for zh-CN locale",
            description: "Chinese ellipsis triggers warning if not Unicode ellipsis"
        },
        {
            targetLocale: "zh-CN",
            source: "The answer is: yes.",
            target: "答案是: 是的。",
            expectedResult: undefined,
            description: "Chinese colon is converted to fullwidth"
        },
        {
            targetLocale: "zh-CN",
            source: "The answer is: yes.",
            target: "答案是: 是的。",
            expectedResult: undefined,
            description: "Chinese colon triggers warning if not fullwidth"
        },

        // Korean tests
        {
            targetLocale: "ko-KR",
            source: "This is a sentence.",
            target: "이것은 문장입니다.",
            expectedResult: undefined,
            description: "Korean period is the same as a Western period"
        },
        {
            targetLocale: "ko-KR",
            source: "This is a sentence.",
            target: "이것은 문장입니다。",
            expectedResult: "Sentence ending punctuation should be \".\" for ko-KR locale",
            description: "Korean period triggers warning if not Western period"
        },

        // Khmer tests
        {
            targetLocale: "km-KH",
            source: "This is a sentence.",
            target: "នេះគឺជាប្រយោគ។",
            expectedResult: undefined,
            description: "Khmer period is converted to Khmer period"
        },
        {
            targetLocale: "km-KH",
            source: "This is a sentence.",
            target: "នេះគឺជាប្រយោគ.",
            expectedResult: "Sentence ending punctuation should be \"។\" for km-KH locale",
            description: "Khmer period triggers warning if not Khmer period"
        },
        {
            targetLocale: "km-KH",
            source: "What is this?",
            target: "នេះជាអ្វី?",
            expectedResult: undefined,
            description: "Khmer question mark uses standard question mark"
        },
        {
            targetLocale: "km-KH",
            source: "This is amazing!",
            target: "នេះគឺអស្ចារ្យ!",
            expectedResult: undefined,
            description: "Khmer exclamation mark uses standard exclamation mark"
        },
        {
            targetLocale: "km-KH",
            source: "This is incomplete...",
            target: "នេះមិនគ្រប់គ្រាន់…",
            expectedResult: undefined,
            description: "Khmer ellipsis uses Unicode ellipsis"
        },
        {
            targetLocale: "km-KH",
            source: "The answer is: yes.",
            target: "ចម្លើយគឺ: បាទ។",
            expectedResult: undefined,
            description: "Khmer colon uses standard colon"
        },

        // German tests (fallback to default punctuation)
        {
            targetLocale: "de-DE",
            source: "This is a sentence.",
            target: "Das ist ein Satz.",
            expectedResult: undefined,
            description: "German period uses default punctuation"
        },
        {
            targetLocale: "de-DE",
            source: "This is a sentence.",
            target: "Das ist ein Satz。",
            expectedResult: "Sentence ending punctuation should be \".\" for de-DE locale",
            description: "German period triggers warning if not default punctuation"
        },
        {
            targetLocale: "de-DE",
            source: "What is this?",
            target: "Was ist das?",
            expectedResult: undefined,
            description: "German question mark uses default punctuation"
        },
        {
            targetLocale: "de-DE",
            source: "What is this?",
            target: "Was ist das？",
            expectedResult: "Sentence ending punctuation should be \"?\" for de-DE locale",
            description: "German question mark triggers warning if not default punctuation"
        },
        {
            targetLocale: "de-DE",
            source: "This is amazing!",
            target: "Das ist erstaunlich!",
            expectedResult: undefined,
            description: "German exclamation mark uses default punctuation"
        },
        {
            targetLocale: "de-DE",
            source: "This is amazing!",
            target: "Das ist erstaunlich！",
            expectedResult: "Sentence ending punctuation should be \"!\" for de-DE locale",
            description: "German exclamation mark triggers warning if not default punctuation"
        },
        {
            targetLocale: "de-DE",
            source: "This is incomplete...",
            target: "Das ist unvollständig…",
            expectedResult: undefined,
            description: "German ellipsis uses default punctuation"
        },
        {
            targetLocale: "de-DE",
            source: "This is incomplete...",
            target: "Das ist unvollständig...",
            expectedResult: "Sentence ending punctuation should be \"…\" for de-DE locale",
            description: "German ellipsis triggers warning if not default punctuation"
        },
        {
            targetLocale: "de-DE",
            source: "The answer is: yes.",
            target: "Die Antwort ist: ja.",
            expectedResult: undefined,
            description: "German colon uses default punctuation"
        },
        {
            targetLocale: "de-DE",
            source: "The answer is: yes.",
            target: "Die Antwort ist: ja。",
            expectedResult: "Sentence ending punctuation should be \".\" for de-DE locale",
            description: "German colon triggers warning if not default punctuation"
        },

        // English to English tests
        {
            targetLocale: "en-GB",
            source: "This is a sentence.",
            target: "This is a sentence.",
            expectedResult: undefined,
            description: "English to English does not trigger"
        },

        // No ending punctuation tests
        {
            targetLocale: "ja-JP",
            source: "This has no ending punctuation",
            target: "これには終止符がありません",
            expectedResult: undefined,
            description: "No ending punctuation does not trigger"
        },

        // Quoted punctuation tests
        {
            targetLocale: "ja-JP",
            source: "He said \"Hello.\"",
            target: "彼は「こんにちは。」と言いました。",
            expectedResult: undefined,
            description: "Correct punctuation inside quotes is accepted"
        },
        {
            targetLocale: "ja-JP",
            source: "He said \"Hello.\"",
            target: "彼は「こんにちは。」と言いました.",
            expectedResult: "Sentence ending punctuation should be \"。\" for ja-JP locale",
            description: "Incorrect punctuation after quotes triggers warning"
        }
    ];

    test.each(languageTestCases)("$description", ({ targetLocale, source, target, expectedResult }) => {
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "test.key",
            sourceLocale: "en-US",
            source,
            targetLocale,
            target,
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        if (expectedResult === undefined) {
            expect(actual).toBeUndefined();
        } else {
            expect(actual).toBeTruthy();
            expect(actual.description).toContain(expectedResult);
        }
    });

    // Spanish tests (kept separate due to special inverted punctuation handling)
    test("Spanish question mark requires inverted punctuation at beginning", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "spanish.question.test",
            sourceLocale: "en-US",
            source: "What is this?",
            targetLocale: "es-ES",
            target: "¿Qué es esto?",
            pathName: "a/b/c.xliff",
            lineNumber: 13
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: "a/b/c.xliff"
        });

        // Should not trigger because Spanish target has correct inverted question mark at beginning
        expect(actual === undefined).toBeTruthy();
    });

    test("Spanish question mark triggers warning if missing inverted punctuation at beginning", () => {
        expect.assertions(3);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "spanish.question.missing.test",
            sourceLocale: "en-US",
            source: "What is this?",
            targetLocale: "es-ES",
            target: "Qué es esto?",
            pathName: "a/b/c.xliff",
            lineNumber: 14
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: "a/b/c.xliff"
        });

        // Should trigger because Spanish target is missing inverted question mark at beginning
        expect(actual).toBeTruthy();
        expect(actual.description).toContain('Spanish question should start with "¿" for es-ES locale');
    });

    test("Spanish exclamation mark requires inverted punctuation at beginning", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "spanish.exclamation.test",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "es-ES",
            target: "¡Esto es increíble!",
            pathName: "a/b/c.xliff",
            lineNumber: 14
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: "a/b/c.xliff"
        });

        // Should not trigger because Spanish target has correct inverted exclamation mark at beginning
        expect(actual === undefined).toBeTruthy();
    });

    test("Spanish exclamation mark triggers warning if missing inverted punctuation at beginning", () => {
        expect.assertions(3);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "spanish.exclamation.missing.test",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "es-ES",
            target: "Esto es increíble!",
            pathName: "a/b/c.xliff",
            lineNumber: 15
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: "a/b/c.xliff"
        });

        // Should trigger because Spanish target is missing inverted exclamation mark at beginning
        expect(actual).toBeTruthy();
        expect(actual.description).toContain('Spanish exclamation should start with "¡" for es-ES locale');
    });

    test("Spanish period does not require inverted punctuation", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "spanish.period.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "es-ES",
            target: "Esto es una frase.",
            pathName: "a/b/c.xliff",
            lineNumber: 16
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource: resource,
            file: "a/b/c.xliff"
        });

        // Should not trigger because Spanish period doesn't require inverted punctuation
        expect(actual === undefined).toBeTruthy();
    });

    test("Spanish: only last sentence requires inverted question mark", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        // Correct: only last sentence is a question, and has inverted mark at start of last sentence
        const resource = new ResourceString({
            key: "spanish.multisentence.question.correct",
            sourceLocale: "en-US",
            source: "This is a statement. Is this a question?",
            targetLocale: "es-ES",
            target: "Esto es una declaración. ¿Es esto una pregunta?",
            pathName: "a/b/c.xliff",
            lineNumber: 20
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeUndefined();
    });

    test("Spanish: missing inverted question mark at start of last sentence triggers warning", () => {
        expect.assertions(3);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        // Incorrect: last sentence is a question, but missing inverted mark at start of last sentence
        const resource = new ResourceString({
            key: "spanish.multisentence.question.missing",
            sourceLocale: "en-US",
            source: "This is a statement. Is this a question?",
            targetLocale: "es-ES",
            target: "Esto es una declaración. Es esto una pregunta?",
            pathName: "a/b/c.xliff",
            lineNumber: 21
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.description).toContain('Spanish question should start with "¿" for es-ES locale');
    });

    test("Spanish: inverted question mark at start of first sentence does not affect last sentence", () => {
        expect.assertions(3);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        // Incorrect: inverted mark at start of first sentence, not at start of last question sentence
        const resource = new ResourceString({
            key: "spanish.multisentence.question.wrongplace",
            sourceLocale: "en-US",
            source: "This is a statement. Is this a question?",
            targetLocale: "es-ES",
            target: "¿Esto es una declaración. Es esto una pregunta?",
            pathName: "a/b/c.xliff",
            lineNumber: 22
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.description).toContain('Spanish question should start with "¿" for es-ES locale');
    });

    test("Spanish: quoted question at end requires inverted punctuation", () => {
        expect.assertions(2);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();
        // Correct: quoted question at end has inverted mark at start of the quoted question
        const resource = new ResourceString({
            key: "spanish.quoted.question.correct",
            sourceLocale: "en-US",
            source: "She said, \"Where is it?\"",
            targetLocale: "es-ES",
            target: "Ella dijo, \"¿Dónde está?\"",
            pathName: "a/b/c.xliff",
            lineNumber: 23
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeUndefined();
    });

    test("Spanish: quoted question at end missing inverted punctuation triggers warning", () => {
        expect.assertions(3);
        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        // Incorrect: quoted question at end missing inverted mark at start of the quoted question
        const resource = new ResourceString({
            key: "spanish.quoted.question.missing",
            sourceLocale: "en-US",
            source: "She said, \"Where is it?\"",
            targetLocale: "es-ES",
            target: "Ella dijo, \"Dónde está?\"",
            pathName: "a/b/c.xliff",
            lineNumber: 24
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.description).toContain('Spanish question should start with "¿" for es-ES locale');
    });
});
