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

import ResourceSentenceEnding from '../../src/rules/ResourceSentenceEnding.js';
import ResourceFixer from '../../src/plugins/resource/ResourceFixer.js';

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
            description: "Japanese period is converted to ideographic full stop"
        },
        {
            targetLocale: "ja-JP",
            source: "This is a sentence.",
            target: "これは文です.",
            expectedResult: "Sentence ending punctuation should be \"。\" for ja-JP locale",
            description: "Japanese period triggers warning if not ideographic full stop"
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
            source: "The answer is:",
            target: "答えは：",
            expectedResult: undefined,
            description: "Japanese colon is converted to fullwidth"
        },
        {
            targetLocale: "ja-JP",
            source: "The answer is:",
            target: "答えは:",
            expectedResult: "Sentence ending punctuation should be \"：\" for ja-JP locale",
            description: "Japanese colon is converted to fullwidth"
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
            source: "The answer is:",
            target: "答案是：",
            expectedResult: undefined,
            description: "Chinese colon is converted to fullwidth"
        },
        {
            targetLocale: "zh-CN",
            source: "The answer is:",
            target: "答案是:",
            expectedResult: "Sentence ending punctuation should be \"：\" for zh-CN locale",
            description: "Chinese colon triggers warning if not fullwidth"
        },
        // Korean tests
        {
            targetLocale: "ko-KR",
            source: "This is a sentence.",
            target: "이것은 문장입니다.",
            expectedResult: undefined,
            description: "Korean period is converted to ideographic full stop"
        },
        {
            targetLocale: "ko-KR",
            source: "This is a sentence.",
            target: "이것은 문장입니다。",
            expectedResult: "Sentence ending punctuation should be \".\" for ko-KR locale",
            description: "Korean period triggers warning if ideographic full stop"
        },
        {
            targetLocale: "ko-KR",
            source: "What is this?",
            target: "이것은 무엇입니까?",
            expectedResult: undefined,
            description: "Korean question mark is converted to fullwidth"
        },
        {
            targetLocale: "ko-KR",
            source: "What is this?",
            target: "이것은 무엇입니까？",
            expectedResult: "Sentence ending punctuation should be \"?\" for ko-KR locale",
            description: "Korean question mark triggers warning if fullwidth"
        },
        {
            targetLocale: "ko-KR",
            source: "This is amazing!",
            target: "이것은 놀랍습니다!",
            expectedResult: undefined,
            description: "Korean exclamation mark is not converted to fullwidth"
        },
        {
            targetLocale: "ko-KR",
            source: "This is amazing!",
            target: "이것은 놀랍습니다！",
            expectedResult: "Sentence ending punctuation should be \"!\" for ko-KR locale",
            description: "Korean exclamation mark triggers warning if fullwidth"
        },
        {
            targetLocale: "ko-KR",
            source: "This is incomplete...",
            target: "이것은 불완전합니다…",
            expectedResult: undefined,
            description: "Korean ellipsis is converted to Unicode ellipsis"
        },
        {
            targetLocale: "ko-KR",
            source: "This is incomplete...",
            target: "이것은 불완전합니다...",
            expectedResult: "Sentence ending punctuation should be \"…\" for ko-KR locale",
            description: "Korean ellipsis triggers warning if not Unicode ellipsis"
        },
        {
            targetLocale: "ko-KR",
            source: "The answer is:",
            target: "답은:",
            expectedResult: undefined,
            description: "Korean colon is converted to fullwidth"
        },
        {
            targetLocale: "ko-KR",
            source: "The answer is:",
            target: "답은：",
            expectedResult: "Sentence ending punctuation should be \":\" for ko-KR locale",
            description: "Korean colon triggers warning if fullwidth"
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
            target: "នេះគឺជាអ្វី?",
            expectedResult: undefined,
            description: "Khmer question mark is converted to Western question mark"
        },
        {
            targetLocale: "km-KH",
            source: "What is this?",
            target: "នេះគឺជាអ្វី？",
            expectedResult: "Sentence ending punctuation should be \"?\" for km-KH locale",
            description: "Khmer question mark triggers warning if not Western question mark"
        },
        {
            targetLocale: "km-KH",
            source: "This is amazing!",
            target: "នេះគឺជាអស្ចារ្យ!",
            expectedResult: undefined,
            description: "Khmer exclamation mark is converted to Western exclamation mark"
        },
        {
            targetLocale: "km-KH",
            source: "This is amazing!",
            target: "នេះគឺជាអស្ចារ្យ！",
            expectedResult: "Sentence ending punctuation should be \"!\" for km-KH locale",
            description: "Khmer exclamation mark triggers warning if not Western exclamation mark"
        },
        {
            targetLocale: "km-KH",
            source: "This is incomplete...",
            target: "នេះគឺជាមិនគ្រប់គ្រាន់…",
            expectedResult: undefined,
            description: "Khmer ellipsis is converted to Unicode ellipsis"
        },
        {
            targetLocale: "km-KH",
            source: "This is incomplete...",
            target: "នេះគឺជាមិនគ្រប់គ្រាន់...",
            expectedResult: "Sentence ending punctuation should be \"…\" for km-KH locale",
            description: "Khmer ellipsis triggers warning if not Unicode ellipsis"
        },
        {
            targetLocale: "km-KH",
            source: "The answer is:",
            target: "ចម្លើយគឺ:",
            expectedResult: undefined,
            description: "Khmer colon is converted to Western colon"
        },
        {
            targetLocale: "km-KH",
            source: "The answer is:",
            target: "ចម្លើយគឺ：",
            expectedResult: "Sentence ending punctuation should be \":\" for km-KH locale",
            description: "Khmer colon triggers warning if not Western colon"
        },
        // German tests
        {
            targetLocale: "de-DE",
            source: "This is a sentence.",
            target: "Das ist ein Satz.",
            expectedResult: undefined,
            description: "German period is converted to Western period"
        },
        {
            targetLocale: "de-DE",
            source: "This is a sentence.",
            target: "Das ist ein Satz：",
            expectedResult: "Sentence ending punctuation should be \".\" for de-DE locale",
            description: "German period triggers warning if not Western period"
        },
        {
            targetLocale: "de-DE",
            source: "What is this?",
            target: "Was ist das?",
            expectedResult: undefined,
            description: "German question mark is converted to Western question mark"
        },
        {
            targetLocale: "de-DE",
            source: "What is this?",
            target: "Was ist das.",
            expectedResult: "Sentence ending punctuation should be \"?\" for de-DE locale",
            description: "German question mark triggers warning if not Western question mark"
        },
        {
            targetLocale: "de-DE",
            source: "This is amazing!",
            target: "Das ist erstaunlich!",
            expectedResult: undefined,
            description: "German exclamation mark is converted to Western exclamation mark"
        },
        {
            targetLocale: "de-DE",
            source: "This is amazing!",
            target: "Das ist erstaunlich.",
            expectedResult: "Sentence ending punctuation should be \"!\" for de-DE locale",
            description: "German exclamation mark triggers warning if not Western exclamation mark"
        },
        {
            targetLocale: "de-DE",
            source: "This is incomplete...",
            target: "Das ist unvollständig…",
            expectedResult: undefined,
            description: "German ellipsis is converted to Unicode ellipsis"
        },
        {
            targetLocale: "de-DE",
            source: "This is incomplete...",
            target: "Das ist unvollständig...",
            expectedResult: "Sentence ending punctuation should be \"…\" for de-DE locale",
            description: "German ellipsis triggers warning if not Unicode ellipsis"
        },
        {
            targetLocale: "de-DE",
            source: "The answer is:",
            target: "Die Antwort ist:",
            expectedResult: undefined,
            description: "German colon is converted to Western colon"
        },
        {
            targetLocale: "de-DE",
            source: "The answer is:",
            target: "Die Antwort ist.",
            expectedResult: "Sentence ending punctuation should be \":\" for de-DE locale",
            description: "German colon triggers warning if not Western colon"
        },
        // English tests
        {
            targetLocale: "en-GB",
            source: "This is a sentence.",
            target: "This is a sentence.",
            expectedResult: undefined,
            description: "English period is converted to Western period"
        },
        {
            targetLocale: "en-GB",
            source: "This is a sentence.",
            target: "This is a sentence。",
            expectedResult: "Sentence ending punctuation should be \".\" for en-GB locale",
            description: "English period triggers warning if not Western period"
        },
        {
            targetLocale: "en-GB",
            source: "What is this?",
            target: "What is this?",
            expectedResult: undefined,
            description: "English question mark is converted to Western question mark"
        },
        {
            targetLocale: "en-GB",
            source: "What is this?",
            target: "What is this？",
            expectedResult: "Sentence ending punctuation should be \"?\" for en-GB locale",
            description: "English question mark triggers warning if not Western question mark"
        },
        {
            targetLocale: "en-GB",
            source: "This is amazing!",
            target: "This is amazing!",
            expectedResult: undefined,
            description: "English exclamation mark is converted to Western exclamation mark"
        },
        {
            targetLocale: "en-GB",
            source: "This is amazing!",
            target: "This is amazing！",
            expectedResult: "Sentence ending punctuation should be \"!\" for en-GB locale",
            description: "English exclamation mark triggers warning if not Western exclamation mark"
        },
        {
            targetLocale: "en-GB",
            source: "This is incomplete...",
            target: "This is incomplete…",
            expectedResult: undefined,
            description: "English ellipsis is converted to Unicode ellipsis"
        },
        {
            targetLocale: "en-GB",
            source: "This is incomplete...",
            target: "This is incomplete...",
            expectedResult: "Sentence ending punctuation should be \"…\" for en-GB locale",
            description: "English ellipsis triggers warning if not Unicode ellipsis"
        },
        {
            targetLocale: "en-GB",
            source: "The answer is:",
            target: "The answer is:",
            expectedResult: undefined,
            description: "English colon is converted to Western colon"
        },
        {
            targetLocale: "en-GB",
            source: "The answer is:",
            target: "The answer is：",
            expectedResult: "Sentence ending punctuation should be \":\" for en-GB locale",
            description: "English colon triggers warning if not Western colon"
        }
    ];

    languageTestCases.forEach(testCase => {
        test(testCase.description, () => {
            expect.assertions(testCase.expectedResult === undefined ? 2 : 3);

            const rule = new ResourceSentenceEnding();
            expect(rule).toBeTruthy();

            const resource = new ResourceString({
                key: testCase.description.replace(/\s+/g, '.').toLowerCase(),
                sourceLocale: "en-US",
                source: testCase.source,
                targetLocale: testCase.targetLocale,
                target: testCase.target,
                pathName: "a/b/c.xliff",
                lineNumber: 25
            });

            const actual = rule.matchString({
                source: resource.getSource(),
                target: resource.getTarget(),
                resource,
                file: "a/b/c.xliff"
            });

            if (testCase.expectedResult === undefined) {
                expect(actual).toBeUndefined();
            } else {
                expect(actual).toBeTruthy();
                expect(actual?.description).toContain(testCase.expectedResult);
            }
        });
    });


    // Spanish tests for inverted punctuation
    test("Spanish inverted punctuation - question mark", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "spanish.inverted.question",
            sourceLocale: "en-US",
            source: "What is this?",
            targetLocale: "es-ES",
            target: "¿Qué es esto?",
            pathName: "a/b/c.xliff",
            lineNumber: 25
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeUndefined();
    });

    test("Spanish inverted punctuation - exclamation mark", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "spanish.inverted.exclamation",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "es-ES",
            target: "¡Esto es increíble!",
            pathName: "a/b/c.xliff",
            lineNumber: 25
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeUndefined();
    });

    test("Spanish inverted punctuation - missing opening question mark", () => {
        expect.assertions(3);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "spanish.inverted.question.missing.opening",
            sourceLocale: "en-US",
            source: "What is this?",
            targetLocale: "es-ES",
            target: "Qué es esto?",
            pathName: "a/b/c.xliff",
            lineNumber: 25
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Spanish question should start with "¿" for es-ES locale');
    });

    test("Spanish inverted punctuation - missing opening exclamation mark", () => {
        expect.assertions(3);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "spanish.inverted.exclamation.missing.opening",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "es-ES",
            target: "Esto es increíble!",
            pathName: "a/b/c.xliff",
            lineNumber: 25
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Spanish exclamation should start with "¡" for es-ES locale');
    });

    // Customization tests
    test("Japanese with full custom punctuation configuration - correct punctuation passes", () => {
        expect.assertions(3);

        const customConfig = {
            "ja-JP": {
                "period": ".",
                "question": "?",
                "exclamation": "!",
                "ellipsis": "...",
                "colon": ":"
            }
        };

        const rule = new ResourceSentenceEnding(customConfig);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "japanese.full.custom.correct",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "ja-JP",
            target: "これは文です。",
            pathName: "a/b/c.xliff",
            lineNumber: 25
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Should trigger because the target uses Japanese ideographic full stop (。) but custom config expects Western period (.)
        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending punctuation should be "." for ja-JP locale');
    });

    test("Japanese with full custom punctuation configuration - question mark violation", () => {
        expect.assertions(3);

        const customConfig = {
            "ja-JP": {
                "period": ".",
                "question": "?",
                "exclamation": "!",
                "ellipsis": "...",
                "colon": ":"
            }
        };

        const rule = new ResourceSentenceEnding(customConfig);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "japanese.full.custom.question",
            sourceLocale: "en-US",
            source: "What is this?",
            targetLocale: "ja-JP",
            target: "これは何ですか？",
            pathName: "a/b/c.xliff",
            lineNumber: 26
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Should trigger because the target uses Japanese fullwidth question mark (？) but custom config expects Western question mark (?)
        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending punctuation should be "?" for ja-JP locale');
    });

    test("Japanese with full custom punctuation configuration - exclamation mark violation", () => {
        expect.assertions(3);

        const customConfig = {
            "ja-JP": {
                "period": ".",
                "question": "?",
                "exclamation": "!",
                "ellipsis": "...",
                "colon": ":"
            }
        };

        const rule = new ResourceSentenceEnding(customConfig);
            expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "japanese.full.custom.exclamation",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "ja-JP",
            target: "これは素晴らしいです！",
            pathName: "a/b/c.xliff",
            lineNumber: 27
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Should trigger because the target uses Japanese fullwidth exclamation mark (！) but custom config expects Western exclamation mark (!)
        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending punctuation should be "!" for ja-JP locale');
    });

    test("Japanese with full custom punctuation configuration - ellipsis violation", () => {
        expect.assertions(3);

        const customConfig = {
            "ja-JP": {
                "period": ".",
                "question": "?",
                "exclamation": "!",
                "ellipsis": "...",
                "colon": ":"
            }
        };

        const rule = new ResourceSentenceEnding(customConfig);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "japanese.full.custom.ellipsis",
            sourceLocale: "en-US",
            source: "This is incomplete...",
            targetLocale: "ja-JP",
            target: "これは不完全です…",
            pathName: "a/b/c.xliff",
            lineNumber: 28
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Should trigger because the target uses Unicode ellipsis (…) but custom config expects Western ellipsis (...)
        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending punctuation should be "..." for ja-JP locale');
    });

    test("Japanese with full custom punctuation configuration - colon violation", () => {
        expect.assertions(3);

        const customConfig = {
            "ja-JP": {
                "period": ".",
                "question": "?",
                "exclamation": "!",
                "ellipsis": "...",
                "colon": ":"
            }
        };

        const rule = new ResourceSentenceEnding(customConfig);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "japanese.full.custom.colon",
            sourceLocale: "en-US",
            source: "The answer is:",
            targetLocale: "ja-JP",
            target: "答えは: はい。",
            pathName: "a/b/c.xliff",
            lineNumber: 29
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Should trigger because the target uses Japanese fullwidth colon (：) but custom config expects Western colon (:)
        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending punctuation should be ":" for ja-JP locale');
    });

    // Blending tests
    test("Japanese with partial custom punctuation configuration - question mark uses custom", () => {
        expect.assertions(3);

        // Configure Japanese with partial custom punctuation - only override question and exclamation
        const customConfig = {
            "ja-JP": {
                "question": "?",
                "exclamation": "!"
                // Note: period, ellipsis, and colon are not specified, so they use Japanese defaults
            }
        };

        const rule = new ResourceSentenceEnding(customConfig);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "japanese.partial.custom.question",
            sourceLocale: "en-US",
            source: "What is this?",
            targetLocale: "ja-JP",
            target: "これは何ですか？",
            pathName: "a/b/c.xliff",
            lineNumber: 30
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Should trigger because the target uses Japanese fullwidth question mark (？) but custom config expects Western question mark (?)
        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending punctuation should be "?" for ja-JP locale');
    });

    test("Japanese with partial custom punctuation configuration - period uses Japanese default", () => {
        expect.assertions(2);

        // Configure Japanese with partial custom punctuation - only override question and exclamation
        const customConfig = {
            "ja-JP": {
                "question": "?",
                "exclamation": "!"
                // Note: period, ellipsis, and colon are not specified, so they use Japanese defaults
            }
        };

        const rule = new ResourceSentenceEnding(customConfig);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "japanese.partial.custom.period",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "ja-JP",
            target: "これは文です。",
            pathName: "a/b/c.xliff",
            lineNumber: 31
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Should NOT trigger because the target uses Japanese ideographic full stop (。) and Japanese default expects Japanese ideographic full stop (。)
        expect(actual).toBeUndefined();
    });

    test("Japanese with partial custom punctuation configuration - exclamation uses custom", () => {
        expect.assertions(3);

        // Configure Japanese with partial custom punctuation - only override question and exclamation
        const customConfig = {
            "ja-JP": {
                "question": "?",
                "exclamation": "!"
                // Note: period, ellipsis, and colon are not specified, so they use Japanese defaults
            }
        };

        const rule = new ResourceSentenceEnding(customConfig);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "japanese.partial.custom.exclamation",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "ja-JP",
            target: "これは素晴らしいです！",
            pathName: "a/b/c.xliff",
            lineNumber: 32
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Should trigger because the target uses Japanese fullwidth exclamation mark (！) but custom config expects Western exclamation mark (!)
        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending punctuation should be "!" for ja-JP locale');
    });

    test("Japanese with partial custom punctuation configuration - ellipsis uses Japanese default", () => {
        expect.assertions(2);

        // Configure Japanese with partial custom punctuation - only override question and exclamation
        const customConfig = {
            "ja-JP": {
                "question": "?",
                "exclamation": "!"
                // Note: period, ellipsis, and colon are not specified, so they use Japanese defaults
            }
        };

        const rule = new ResourceSentenceEnding(customConfig);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "japanese.partial.custom.ellipsis",
            sourceLocale: "en-US",
            source: "This is incomplete...",
            targetLocale: "ja-JP",
            target: "これは不完全です…",
            pathName: "a/b/c.xliff",
            lineNumber: 33
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Should NOT trigger because the target uses Unicode ellipsis (…) and Japanese default expects Unicode ellipsis (…)
        expect(actual).toBeUndefined();
    });

    test("Japanese with partial custom punctuation configuration - colon uses Japanese default", () => {
        expect.assertions(2);

        // Configure Japanese with partial custom punctuation - only override question and exclamation
        const customConfig = {
            "ja-JP": {
                "question": "?",
                "exclamation": "!"
                // Note: period, ellipsis, and colon are not specified, so they use Japanese defaults
            }
        };

        const rule = new ResourceSentenceEnding(customConfig);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "japanese.partial.custom.colon",
            sourceLocale: "en-US",
            source: "The answer is:",
            targetLocale: "ja-JP",
            target: "答えは：",
            pathName: "a/b/c.xliff",
            lineNumber: 34
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Should NOT trigger because the target uses Japanese fullwidth colon (：) and Japanese default expects Japanese fullwidth colon (：)
        expect(actual).toBeUndefined();
    });
});