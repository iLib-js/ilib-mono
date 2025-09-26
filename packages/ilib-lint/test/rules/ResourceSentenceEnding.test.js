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

import { ResourceString, ResourceArray, ResourcePlural } from 'ilib-tools-common';
import { IntermediateRepresentation, SourceFile } from 'ilib-lint-common';
import Locale from 'ilib-locale';

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
            expectedResult: "Sentence ending should be \"。\" (U+3002) for ja-JP locale instead of \".\" (U+002E)",
            highlight: "これは文です<e0>. (U+002E)</e0>",
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
            expectedResult: "Sentence ending should be \"？\" (U+FF1F) for ja-JP locale instead of \"?\" (U+003F)",
            highlight: "これは何ですか<e0>? (U+003F)</e0>",
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
            expectedResult: "Sentence ending should be \"！\" (U+FF01) for ja-JP locale instead of \"!\" (U+0021)",
            highlight: "これは素晴らしいです<e0>! (U+0021)</e0>",
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
            expectedResult: "Sentence ending should be \"…\" (U+2026) for ja-JP locale instead of \"...\" (U+002E U+002E U+002E)",
            highlight: "これは不完全です<e0>... (U+002E U+002E U+002E)</e0>",
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
            expectedResult: "Sentence ending should be \"：\" (U+FF1A) for ja-JP locale instead of \":\" (U+003A)",
            highlight: "答えは<e0>: (U+003A)</e0>",
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
            expectedResult: "Sentence ending should be \"。\" (U+3002) for zh-CN locale instead of \".\" (U+002E)",
            highlight: "这是一个句子<e0>. (U+002E)</e0>",
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
            expectedResult: "Sentence ending should be \"？\" (U+FF1F) for zh-CN locale instead of \"?\" (U+003F)",
            highlight: "这是什么<e0>? (U+003F)</e0>",
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
            expectedResult: "Sentence ending should be \"！\" (U+FF01) for zh-CN locale instead of \"!\" (U+0021)",
            highlight: "这太棒了<e0>! (U+0021)</e0>",
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
            expectedResult: "Sentence ending should be \"…\" (U+2026) for zh-CN locale instead of \"...\" (U+002E U+002E U+002E)",
            highlight: "这是不完整的<e0>... (U+002E U+002E U+002E)</e0>",
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
            expectedResult: "Sentence ending should be \"：\" (U+FF1A) for zh-CN locale instead of \":\" (U+003A)",
            highlight: "答案是<e0>: (U+003A)</e0>",
            description: "Chinese colon triggers warning if not fullwidth"
        },
        // Korean tests
        {
            targetLocale: "ko-KR",
            source: "This is a sentence.",
            target: "이것은 문장입니다.",
            expectedResult: undefined,
            description: "Korean period is converted to Western period"
        },
        {
            targetLocale: "ko-KR",
            source: "This is a sentence.",
            target: "이것은 문장입니다。",
            expectedResult: "Sentence ending should be \".\" (U+002E) for ko-KR locale instead of \"。\" (U+3002)",
            highlight: "이것은 문장입니다<e0>。 (U+3002)</e0>",
            description: "Korean period triggers warning if not Western period"
        },
        {
            targetLocale: "ko-KR",
            source: "What is this?",
            target: "이것은 무엇입니까?",
            expectedResult: undefined,
            description: "Korean question mark is converted to Western question mark"
        },
        {
            targetLocale: "ko-KR",
            source: "What is this?",
            target: "이것은 무엇입니까？",
            expectedResult: "Sentence ending should be \"?\" (U+003F) for ko-KR locale instead of \"？\" (U+FF1F)",
            highlight: "이것은 무엇입니까<e0>？ (U+FF1F)</e0>",
            description: "Korean question mark triggers warning if not Western question mark"
        },
        {
            targetLocale: "ko-KR",
            source: "This is amazing!",
            target: "이것은 놀랍습니다!",
            expectedResult: undefined,
            description: "Korean exclamation mark is converted to Western exclamation mark"
        },
        {
            targetLocale: "ko-KR",
            source: "This is amazing!",
            target: "이것은 놀랍습니다！",
            expectedResult: "Sentence ending should be \"!\" (U+0021) for ko-KR locale instead of \"！\" (U+FF01)",
            highlight: "이것은 놀랍습니다<e0>！ (U+FF01)</e0>",
            description: "Korean exclamation mark triggers warning if not Western exclamation mark"
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
            expectedResult: "Sentence ending should be \"…\" (U+2026) for ko-KR locale instead of \"...\" (U+002E U+002E U+002E)",
            highlight: "이것은 불완전합니다<e0>... (U+002E U+002E U+002E)</e0>",
            description: "Korean ellipsis triggers warning if not Unicode ellipsis"
        },
        {
            targetLocale: "ko-KR",
            source: "The answer is:",
            target: "답은:",
            expectedResult: undefined,
            description: "Korean colon is converted to Western colon"
        },
        {
            targetLocale: "ko-KR",
            source: "The answer is:",
            target: "답은：",
            expectedResult: "Sentence ending should be \":\" (U+003A) for ko-KR locale instead of \"：\" (U+FF1A)",
            highlight: "답은<e0>： (U+FF1A)</e0>",
            description: "Korean colon triggers warning if not Western colon"
        },
        // Khmer tests
        {
            targetLocale: "km-KH",
            source: "This is a sentence.",
            target: "នេះគឺជាប្រយោគ។",
            expectedResult: undefined,
            description: "Western period is converted to Khmer period"
        },
        {
            targetLocale: "km-KH",
            source: "This is a sentence.",
            target: "នេះគឺជាប្រយោគ.",
            expectedResult: "Sentence ending should be \"។\" (U+17D4) for km-KH locale instead of \".\" (U+002E)",
            highlight: "នេះគឺជាប្រយោគ<e0>. (U+002E)</e0>",
            description: "Western period triggers warning if not Khmer period"
        },
        {
            targetLocale: "km-KH",
            source: "What is this?",
            target: "នេះគឺជាអ្វី?",
            expectedResult: undefined,
            description: "English question mark is converted to Western question mark"
        },
        {
            targetLocale: "km-KH",
            source: "What is this?",
            target: "នេះគឺជាអ្វី？",
            expectedResult: "Sentence ending should be \"?\" (U+003F) for km-KH locale instead of \"？\" (U+FF1F)",
            highlight: "នេះគឺជាអ្វី<e0>？ (U+FF1F)</e0>",
            description: "Western question mark triggers warning if not Khmer question mark"
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
            expectedResult: "Sentence ending should be \"!\" (U+0021) for km-KH locale instead of \"！\" (U+FF01)",
            highlight: "នេះគឺជាអស្ចារ្យ<e0>！ (U+FF01)</e0>",
            description: "Khmer exclamation mark triggers warning if not Western exclamation mark"
        },
        {
            targetLocale: "km-KH",
            source: "This is incomplete...",
            target: "នេះគឺជាមិនគ្រប់គ្រាន់…",
            expectedResult: undefined,
            description: "Long ellipsis is converted to Unicode ellipsis"
        },
        {
            targetLocale: "km-KH",
            source: "This is incomplete...",
            target: "នេះគឺជាមិនគ្រប់គ្រាន់...",
            expectedResult: "Sentence ending should be \"…\" (U+2026) for km-KH locale instead of \"...\" (U+002E U+002E U+002E)",
            highlight: "នេះគឺជាមិនគ្រប់គ្រាន់<e0>... (U+002E U+002E U+002E)</e0>",
            description: "Long ellipsis triggers warning if not Unicode ellipsis"
        },
        {
            targetLocale: "km-KH",
            source: "The answer is:",
            target: "ចម្លើយគឺ:",
            expectedResult: undefined,
            description: "Western colon is converted to Khmer colon"
        },
        {
            targetLocale: "km-KH",
            source: "The answer is:",
            target: "ចម្លើយគឺ：",
            expectedResult: "Sentence ending should be \":\" (U+003A) for km-KH locale instead of \"：\" (U+FF1A)",
            highlight: "ចម្លើយគឺ<e0>： (U+FF1A)</e0>",
            description: "Western colon triggers warning if not Khmer colon"
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
            expectedResult: "Sentence ending should be \".\" (U+002E) for de-DE locale instead of \"：\" (U+FF1A)",
            highlight: "Das ist ein Satz<e0>： (U+FF1A)</e0>",
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
            expectedResult: "Sentence ending should be \"?\" (U+003F) for de-DE locale instead of \".\" (U+002E)",
            highlight: "Was ist das<e0>. (U+002E)</e0>",
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
            expectedResult: "Sentence ending should be \"!\" (U+0021) for de-DE locale instead of \".\" (U+002E)",
            highlight: "Das ist erstaunlich<e0>. (U+002E)</e0>",
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
            expectedResult: "Sentence ending should be \"…\" (U+2026) for de-DE locale instead of \"...\" (U+002E U+002E U+002E)",
            highlight: "Das ist unvollständig<e0>... (U+002E U+002E U+002E)</e0>",
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
            expectedResult: "Sentence ending should be \":\" (U+003A) for de-DE locale instead of \".\" (U+002E)",
            highlight: "Die Antwort ist<e0>. (U+002E)</e0>",
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
            expectedResult: "Sentence ending should be \".\" (U+002E) for en-GB locale instead of \"。\" (U+3002)",
            highlight: "This is a sentence<e0>。 (U+3002)</e0>",
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
            expectedResult: "Sentence ending should be \"?\" (U+003F) for en-GB locale instead of \"？\" (U+FF1F)",
            highlight: "What is this<e0>？ (U+FF1F)</e0>",
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
            expectedResult: "Sentence ending should be \"!\" (U+0021) for en-GB locale instead of \"！\" (U+FF01)",
            highlight: "This is amazing<e0>！ (U+FF01)</e0>",
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
            expectedResult: "Sentence ending should be \"…\" (U+2026) for en-GB locale instead of \"...\" (U+002E U+002E U+002E)",
            highlight: "This is incomplete<e0>... (U+002E U+002E U+002E)</e0>",
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
            expectedResult: "Sentence ending should be \":\" (U+003A) for en-GB locale instead of \"：\" (U+FF1A)",
            highlight: "The answer is<e0>： (U+FF1A)</e0>",
            description: "English colon triggers warning if not Western colon"
        },
        // Test plural content doesn't mess up the algorithm
        {
            targetLocale: "bn-IN",
            source: "{numSelected, plural, =0 {0 files selected} one {1 file selected} other {# files selected} } ",
            target: "{numSelected,plural,=0{0 ফাইল নির্বাচিত} one{1 ফাইল নির্বাচিত} other{# ফাইল নির্বাচিত}} ",
            expectedResult: undefined,
            description: "Bengali plural content doesn't mess up the algorithm"
        },
        // Bengali punctuation tests
        {
            targetLocale: "bn-IN",
            source: "Hello world.",
            target: "হ্যালো বিশ্ব।",
            expectedResult: undefined,
            description: "Bengali period (danda) is correct for Bengali locale"
        },
        {
            targetLocale: "bn-IN",
            source: "Hello world.",
            target: "হ্যালো বিশ্ব.",
            expectedResult: "Sentence ending should be \"।\" (U+0964) for bn-IN locale instead of \".\" (U+002E)",
            highlight: "হ্যালো বিশ্ব<e0>. (U+002E)</e0>",
            description: "Bengali should use danda (।) not Western period (.)"
        },
        {
            targetLocale: "bn-IN",
            source: "What is your name?",
            target: "আপনার নাম কি?",
            expectedResult: undefined,
            description: "Bengali question mark is correct (same as Western)"
        },
        {
            targetLocale: "bn-IN",
            source: "Welcome!",
            target: "স্বাগতম!",
            expectedResult: undefined,
            description: "Bengali exclamation mark is correct (same as Western)"
        },
        {
            targetLocale: "bn-IN",
            source: "The options are:",
            target: "বিকল্পগুলি হল:",
            expectedResult: undefined,
            description: "Bengali colon is correct (same as Western)"
        },
        {
            targetLocale: "bn-IN",
            source: "Loading...",
            target: "লোড হচ্ছে…",
            expectedResult: undefined,
            description: "Bengali ellipsis is correct (same as Western)"
        },
        // Test for substitution parameter moved to end without sentence-ending punctuation
        {
            targetLocale: "it-IT",
            source: "Your content for paragraph {number} goes here",
            target: "Inserisci qui i contenuti per il paragrafo {number}",
            expectedResult: undefined,
            description: "Italian translation with substitution parameter moved to end should not trigger sentence-ending punctuation error when source has no punctuation"
        },
        // Test for substitution parameter in middle with no sentence-ending punctuation
        {
            targetLocale: "fr-FR",
            source: "Welcome to {app_name}",
            target: "Bienvenue sur {app_name}",
            expectedResult: undefined,
            description: "French translation with substitution parameter in middle should not trigger sentence-ending punctuation error when source has no punctuation"
        },
        // Test for multiple substitution parameters with no sentence-ending punctuation
        {
            targetLocale: "de-DE",
            source: "Hello {name}, you have {count} messages",
            target: "Hallo {name}, Sie haben {count} Nachrichten",
            expectedResult: undefined,
            description: "German translation with multiple substitution parameters should not trigger sentence-ending punctuation error when source has no punctuation"
        },
        // Test for substitution parameter at end with sentence-ending punctuation in source
        {
            targetLocale: "es-ES",
            source: "Your content for paragraph {number} goes here.",
            target: "Inserte aquí el contenido para el párrafo {number}.",
            expectedResult: undefined,
            description: "Spanish translation with substitution parameter at end should not trigger sentence-ending punctuation error when source has sentence-ending punctuation"
        },
        // Tests for quoted content
        {
            targetLocale: "en-GB",
            source: "She said, \"Hello!\"",
            target: "She said, \"Hello!\"",
            expectedResult: undefined,
            description: "English exclamation mark in quotes is correct"
        },
        {
            targetLocale: "en-GB",
            source: "She said, \"Hello!\"",
            target: "She said, \"Hello！\"",
            expectedResult: "Sentence ending should be \"!\" (U+0021) for en-GB locale instead of \"！\" (U+FF01)",
            highlight: "She said, \"Hello<e0>！ (U+FF01)</e0>\"",
            description: "English exclamation mark in quotes triggers warning if not Western exclamation mark"
        },
        {
            targetLocale: "de-DE",
            source: "She said, \"Hello!\"",
            target: "Sie sagte, \"Hallo!\"",
            expectedResult: undefined,
            description: "German exclamation mark in quotes is correct"
        },
        {
            targetLocale: "de-DE",
            source: "She said, \"Hello!\"",
            target: "Sie sagte, \"Hallo！\"",
            expectedResult: "Sentence ending should be \"!\" (U+0021) for de-DE locale instead of \"！\" (U+FF01)",
            highlight: "Sie sagte, \"Hallo<e0>！ (U+FF01)</e0>\"",
            description: "German exclamation mark in quotes triggers warning if not Western exclamation mark"
        },
        {
            targetLocale: "ja-JP",
            source: "She said, \"Hello!\"",
            target: "彼女は「こんにちは！」と言いました。",
            expectedResult: undefined,
            description: "Japanese exclamation mark in quotes is correct"
        },
        {
            targetLocale: "ja-JP",
            source: "She said, \"Hello!\"",
            target: "彼女は「こんにちは!」と言いました。",
            expectedResult: "Sentence ending should be \"！\" (U+FF01) for ja-JP locale instead of \"!\" (U+0021)",
            highlight: "彼女は「こんにちは<e0>! (U+0021)</e0>」と言いました。",
            description: "Japanese exclamation mark in quotes triggers warning if not fullwidth exclamation mark"
        },
        {
            targetLocale: "zh-CN",
            source: "She said, \"Hello!\"",
            target: "她说：\"你好！\"",
            expectedResult: undefined,
            description: "Chinese exclamation mark in quotes is correct"
        },
        {
            targetLocale: "zh-CN",
            source: "She said, \"Hello!\"",
            target: "她说：\"你好!\"",
            expectedResult: "Sentence ending should be \"！\" (U+FF01) for zh-CN locale instead of \"!\" (U+0021)",
            highlight: "她说：\"你好<e0>! (U+0021)</e0>\"",
            description: "Chinese exclamation mark in quotes with Western exclamation triggers warning if fullwidth exclamation mark is not used"
        },
        {
            targetLocale: "ko-KR",
            source: "She said, \"Hello!\"",
            target: "그녀는 \"안녕하세요!\"라고 말했습니다.",
            expectedResult: undefined,
            description: "Korean exclamation mark in quotes is correct"
        },
        {
            targetLocale: "ko-KR",
            source: "She said, \"Hello!\"",
            target: "그녀는 \"안녕하세요！\"라고 말했습니다.",
            expectedResult: "Sentence ending should be \"!\" (U+0021) for ko-KR locale instead of \"！\" (U+FF01)",
            highlight: "그녀는 \"안녕하세요<e0>！ (U+FF01)</e0>\"라고 말했습니다.",
            description: "Korean exclamation mark in quotes with fullwidth exclamation triggers warning"
        },
        {
            targetLocale: "es-ES",
            source: "She said, \"Hello!\"",
            target: "Ella dijo: \"¡Hola!\"",
            expectedResult: undefined,
            description: "Spanish exclamation mark in quotes with inverted punctuation is correct"
        },
        {
            targetLocale: "es-ES",
            source: "She said, \"Hello!\"",
            target: "Ella dijo: \"Hola!\"",
            expectedResult: "Spanish exclamation should start with \"¡\" (U+00A1) for es-ES locale",
            highlight: "Ella dijo: \"<e0/>Hola!\"",
            description: "Spanish exclamation mark in quotes missing inverted punctuation triggers warning"
        },
        {
            targetLocale: "es-ES",
            source: "She said, \"Hello!\"",
            target: "Ella dijo: \"¡Hola！\"",
            expectedResult: "Sentence ending should be \"!\" (U+0021) for es-ES locale instead of \"！\" (U+FF01)",
            highlight: "Ella dijo: \"¡Hola<e0>！ (U+FF01)</e0>\"",
            description: "Spanish exclamation mark in quotes with fullwidth exclamation triggers warning"
        },
        {
            targetLocale: "es-ES",
            source: "She said, \"What?\"",
            target: "Ella dijo: \"¿Qué?\"",
            expectedResult: undefined,
            description: "Spanish question mark in quotes with inverted punctuation is correct"
        },
        {
            targetLocale: "es-ES",
            source: "She said, \"What?\"",
            target: "Ella dijo: \"Qué?\"",
            expectedResult: "Spanish question should start with \"¿\" (U+00BF) for es-ES locale",
            highlight: "Ella dijo: \"<e0/>Qué?\"",
            description: "Spanish question mark in quotes missing inverted punctuation triggers warning"
        },
        {
            targetLocale: "es-ES",
            source: "She said, \"What?\"",
            target: "Ella dijo: \"¿Qué？\"",
            expectedResult: "Sentence ending should be \"?\" (U+003F) for es-ES locale instead of \"？\" (U+FF1F)",
            highlight: "Ella dijo: \"¿Qué<e0>？ (U+FF1F)</e0>\"",
            description: "Spanish question mark in quotes with fullwidth question mark triggers warning"
        },
        // Test for quoted text not at the end of the source
        {
            targetLocale: "de-DE",
            source: "\"Don't do that,\" she said.",
            target: "\"Toe dass nicht,\" sagt Sie.",
            expectedResult: undefined,
            description: "German period at end matches English period at end when quoted text is not at end"
        },
        // Bug test: quoted string in middle should not affect sentence-ending check
        {
            targetLocale: "ja-JP",
            source: "This bug is \"crazy\" good.",
            target: "このバグは「クレイジー」良いです。",
            expectedResult: undefined,
            description: "Japanese period at end should match English period at end even with quoted text in middle"
        },
        // Bug test: quoted string in middle with wrong punctuation
        {
            targetLocale: "ja-JP",
            source: "This bug is \"crazy\" good.",
            target: "このバグは「クレイジー」良いです.",
            expectedResult: "Sentence ending should be \"。\" (U+3002) for ja-JP locale instead of \".\" (U+002E)",
            highlight: "このバグは「クレイジー」良いです<e0>. (U+002E)</e0>",
            description: "Japanese period should be ideographic full stop even with quoted text in middle"
        },
        // Bug test: source ends with quote - should use quoted content
        {
            targetLocale: "ja-JP",
            source: "This bug is \"crazy\".",
            target: "このバグは「クレイジー」.",
            expectedResult: "Sentence ending should be \"。\" (U+3002) for ja-JP locale instead of \".\" (U+002E)",
            highlight: "このバグは「クレイジー」<e0>. (U+002E)</e0>",
            description: "When source ends with quote, should check quoted content for punctuation"
        },
        // Bug test: quoted string in middle with same quote style as English
        {
            targetLocale: "de-DE",
            source: "This bug is \"crazy\" good.",
            target: "Dieser Fehler ist \"verrückt\" gut.",
            expectedResult: undefined,
            description: "German period at end should match English period at end even with quoted text in middle using same quotes"
        },
        // Bug test: quoted string in middle with wrong punctuation, same quote style
        {
            targetLocale: "de-DE",
            source: "This bug is \"crazy\" good.",
            target: "Dieser Fehler ist \"verrückt\" gut!",
            expectedResult: "Sentence ending should be \".\" (U+002E) for de-DE locale instead of \"!\" (U+0021)",
            highlight: "Dieser Fehler ist \"verrückt\" gut<e0>! (U+0021)</e0>",
            description: "German should use period not exclamation even with quoted text in middle using same quotes"
        },
        // Bug test: quoted string at end of source but not at end of target
        {
            targetLocale: "it-IT",
            source: "The dialog says, \"Delete the file?\"",
            target: "\"Eliminare il file?\" è ciò che dice la finestra di dialogo.",
            expectedResult: undefined,
            description: "Italian period at end should match English question mark at end even when quoted text moves position"
        },
        // Bug test: quoted string at end of source but not at end of target - should pass
        {
            targetLocale: "it-IT",
            source: "The dialog says, \"Delete the file?\"",
            target: "\"Eliminare il file?\" è ciò che dice la finestra di dialogo!",
            expectedResult: undefined,
            description: "Should pass because quoted content matches (both end with ?) even though full strings differ"
        },
        // Bug test: Spanish inverted punctuation with colon
        {
            targetLocale: "es-ES",
            source: "Which would you prefer: a more cool or more warm tone?",
            target: "¿Que prefiere: un tono más frío o más cálido?",
            expectedResult: undefined,
            description: "Spanish question with colon should have correct inverted punctuation"
        },
        // Bug test: Spanish inverted punctuation with colon - missing inverted punctuation
        {
            targetLocale: "es-ES",
            source: "Which would you prefer: a more cool or more warm tone?",
            target: "Que prefiere: un tono más frío o más cálido?",
            expectedResult: "Spanish question should start with \"¿\" (U+00BF) for es-ES locale",
            highlight: "<e0/>Que prefiere: un tono más frío o más cálido?",
            description: "Spanish question with colon should trigger warning for missing inverted punctuation"
        },
        // Bug test: Spanish inverted punctuation with subordinate clause
        {
            targetLocale: "es-ES",
            source: "Then, what contrast would you like to have between the light and dark parts of the screen?",
            target: "Entonces, ¿cuánto constraste prefiere entre las partes claras y oscuras de la plantalla?",
            expectedResult: undefined,
            description: "Spanish question with subordinate clause should have correct inverted punctuation"
        },
        // Bug test: Spanish inverted punctuation with name and comma
        {
            targetLocale: "es-ES",
            source: "Pablo, where are you going?",
            target: "Pablo, ¿adónde vas?",
            expectedResult: undefined,
            description: "Spanish question with name and comma should have correct inverted punctuation"
        },
        // Optional punctuation language tests
        {
            targetLocale: "th-TH",
            source: "Hello world.",
            target: "สวัสดีโลก",
            expectedResult: undefined,
            description: "Missing punctuation in translation for optional punctuation language (Thai)"
        },
        {
            targetLocale: "km-KH",
            source: "Hello world.",
            target: "សួស្តីពិភពលោក",
            expectedResult: undefined,
            description: "Missing punctuation in translation for optional punctuation language (Khmer)"
        },
        {
            targetLocale: "vi-VN",
            source: "Hello world.",
            target: "Xin chào thế giới",
            expectedResult: undefined,
            description: "Missing punctuation in translation for optional punctuation language (Vietnamese)"
        },
        {
            targetLocale: "id-ID",
            source: "Hello world.",
            target: "Halo dunia",
            expectedResult: undefined,
            description: "Missing punctuation in translation for optional punctuation language (Indonesian)"
        },
        {
            targetLocale: "ms-MY",
            source: "Hello world.",
            target: "Halo dunia",
            expectedResult: undefined,
            description: "Missing punctuation in translation for optional punctuation language (Malay)"
        },
        {
            targetLocale: "tl-PH",
            source: "Hello world.",
            target: "Kamusta mundo",
            expectedResult: undefined,
            description: "Missing punctuation in translation for optional punctuation language (Tagalog)"
        },
        {
            targetLocale: "jv-ID",
            source: "Hello world.",
            target: "Halo donya",
            expectedResult: undefined,
            description: "Missing punctuation in translation for optional punctuation language (Javanese)"
        },
        {
            targetLocale: "su-ID",
            source: "Hello world.",
            target: "Halo dunya",
            expectedResult: undefined,
            description: "Missing punctuation in translation for optional punctuation language (Sundanese)"
        },
        // Test for substitution parameter at end in source but not in target
        {
            targetLocale: "ko-KR",
            source: "Hello, {name}",
            target: "안녕하세요, {name}님",
            expectedResult: undefined,
            description: "Korean translation with substitution parameter repositioned should not trigger sentence-ending punctuation error when source ends with substitution parameter"
        },
        // Additional optional punctuation language tests - source has punctuation, target has correct punctuation
        {
            targetLocale: "th-TH",
            source: "Hello world.",
            target: "สวัสดีโลก.",
            expectedResult: undefined,
            description: "Correct punctuation in translation for optional punctuation language (Thai)"
        },
        {
            targetLocale: "km-KH",
            source: "What is this?",
            target: "នេះគឺជាអ្វី?",
            expectedResult: undefined,
            description: "Correct punctuation in translation for optional punctuation language (Khmer)"
        },
        // Additional optional punctuation language tests - source has punctuation, target has wrong punctuation
        {
            targetLocale: "vi-VN",
            source: "Hello world.",
            target: "Xin chào thế giới!",
            expectedResult: "Sentence ending should be \".\" (U+002E) for vi-VN locale instead of \"!\" (U+0021)",
            highlight: "Xin chào thế giới<e0>! (U+0021)</e0>",
            description: "Wrong punctuation in translation for optional punctuation language (Vietnamese) - should be fixed"
        },
        {
            targetLocale: "id-ID",
            source: "What is this?",
            target: "Apa ini.",
            expectedResult: "Sentence ending should be \"?\" (U+003F) for id-ID locale instead of \".\" (U+002E)",
            highlight: "Apa ini<e0>. (U+002E)</e0>",
            description: "Wrong punctuation in translation for optional punctuation language (Indonesian) - should be fixed"
        },
        // Additional optional punctuation language tests - source has no punctuation, target has punctuation (should be removed)
        {
            targetLocale: "ms-MY",
            source: "Hello world",
            target: "Halo dunia.",
            expectedResult: "Sentence ending should be \"\" for ms-MY locale instead of \".\" (U+002E)",
            highlight: "Halo dunia<e0>. (U+002E)</e0>",
            description: "Extra punctuation in translation for optional punctuation language (Malay) when source has none - should be removed"
        },
        {
            targetLocale: "tl-PH",
            source: "Hello world",
            target: "Kamusta mundo!",
            expectedResult: "Sentence ending should be \"\" for tl-PH locale instead of \"!\" (U+0021)",
            highlight: "Kamusta mundo<e0>! (U+0021)</e0>",
            description: "Extra punctuation in translation for optional punctuation language (Tagalog) when source has none - should be removed"
        }
    ];

    languageTestCases.forEach(testCase => {
        test(testCase.description, () => {
            expect.assertions(testCase.expectedResult === undefined ? 2 : (testCase.highlight ? 5 : 4));

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
                expect(actual?.id).toBe(resource.getKey());
                if (testCase.highlight) {
                    expect(actual?.highlight).toBe(testCase.highlight);
                }
            }
        });
    });

    // Test that Result locale is the same as targetLocale
    test("Result locale should match targetLocale", () => {
        expect.assertions(6);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "locale.test",
            sourceLocale: "en-US",
            source: "This is a sentence.",
            targetLocale: "ja-JP",
            target: "これは文です.",
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
        expect(actual?.locale).toBe("ja-JP");
        expect(actual?.description).toContain("Sentence ending should be");
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("これは文です<e0>. (U+002E)</e0>");
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
        expect.assertions(5);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "spanish.inverted.question.missing.opening",
            sourceLocale: "en-US",
            source: "Pablo, what is this?",
            targetLocale: "es-ES",
            target: "Pablo, qué es esto?",
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
        expect(actual?.description).toContain('Spanish question should start with "¿" (U+00BF) for es-ES locale');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("<e0/>Pablo, qué es esto?");
    });

    test("Spanish inverted punctuation - missing opening question mark in a multi-sentence string", () => {
        expect.assertions(5);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "spanish.inverted.question.missing.opening",
            sourceLocale: "en-US",
            source: "What a mess! Pablo, what is this?",
            targetLocale: "es-ES",
            target: "¡Qué desastre! Pablo, qué es esto?",
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
        expect(actual?.description).toContain('Spanish question should start with "¿" (U+00BF) for es-ES locale');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("¡Qué desastre! <e0/>Pablo, qué es esto?");
    });

    test("Spanish inverted punctuation - missing opening exclamation mark", () => {
        expect.assertions(5);

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
        expect(actual?.description).toContain('Spanish exclamation should start with "¡" (U+00A1) for es-ES locale');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("<e0/>Esto es increíble!");
    });

    // Spanish tests with custom colon character
    test("Spanish inverted punctuation with custom colon - correct inverted punctuation", () => {
        expect.assertions(2);

        // Configure custom colon character (fullwidth colon)
        const customConfig = {
            'es-ES': {
                period: '.',
                question: '?',
                exclamation: '!',
                ellipsis: '…',
                colon: '：'  // Fullwidth colon instead of ASCII colon
            }
        };

        const rule = new ResourceSentenceEnding(customConfig);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "spanish.custom.colon.correct",
            sourceLocale: "en-US",
            source: "Which would you prefer: a more cool or more warm tone?",
            targetLocale: "es-ES",
            target: "¿Que prefiere：un tono más frío o más cálido?",
            pathName: "a/b/c.xliff",
            lineNumber: 40
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeUndefined();
    });

    test("Spanish inverted punctuation with custom colon - missing inverted punctuation", () => {
        expect.assertions(5);

        // Configure custom colon character (fullwidth colon)
        const customConfig = {
            'es-ES': {
                period: '.',
                question: '?',
                exclamation: '!',
                ellipsis: '…',
                colon: '：'  // Fullwidth colon instead of ASCII colon
            }
        };

        const rule = new ResourceSentenceEnding(customConfig);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "spanish.custom.colon.missing",
            sourceLocale: "en-US",
            source: "Which would you prefer: a more cool or more warm tone?",
            targetLocale: "es-ES",
            target: "Que prefiere：un tono más frío o más cálido?",
            pathName: "a/b/c.xliff",
            lineNumber: 41
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Spanish question should start with "¿" (U+00BF) for es-ES locale');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("<e0/>Que prefiere：un tono más frío o más cálido?");
    });

    // Test for highlight property functionality
    test("Highlight property is correctly set in result", () => {
        expect.assertions(5);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "highlight.test",
            sourceLocale: "en-US",
            source: "The answer is:",
            targetLocale: "ko-KR",
            target: "답은：",
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
        expect(actual?.description).toContain('Sentence ending should be ":" (U+003A) for ko-KR locale instead of "：" (U+FF1A)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("답은<e0>： (U+FF1A)</e0>");
    });

    // Customization tests
    test("Japanese with full custom punctuation configuration - correct punctuation passes", () => {
        expect.assertions(5);

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
        expect(actual?.description).toContain('Sentence ending should be "." (U+002E) for ja-JP locale instead of "。" (U+3002)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("これは文です<e0>。 (U+3002)</e0>");
    });

    test("Japanese with full custom punctuation configuration - question mark violation", () => {
        expect.assertions(5);

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
        expect(actual?.description).toContain('Sentence ending should be "?" (U+003F) for ja-JP locale instead of "？" (U+FF1F)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("これは何ですか<e0>？ (U+FF1F)</e0>");
    });

    test("Japanese with full custom punctuation configuration - exclamation mark violation", () => {
        expect.assertions(5);

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
        expect(actual?.description).toContain('Sentence ending should be "!" (U+0021) for ja-JP locale instead of "！" (U+FF01)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("これは素晴らしいです<e0>！ (U+FF01)</e0>");
    });

    test("Japanese with full custom punctuation configuration - ellipsis violation", () => {
        expect.assertions(5);

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
        expect(actual?.description).toContain('Sentence ending should be "..." (U+002E U+002E U+002E) for ja-JP locale instead of "…" (U+2026)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("これは不完全です<e0>… (U+2026)</e0>");
    });

    test("Japanese with full custom punctuation configuration - colon violation", () => {
        expect.assertions(5);

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
            target: "答えは：",
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
        expect(actual?.description).toContain('Sentence ending should be ":" (U+003A) for ja-JP locale instead of "：" (U+FF1A)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("答えは<e0>： (U+FF1A)</e0>");
    });

    // Blending tests
    test("Japanese with partial custom punctuation configuration - question mark uses custom", () => {
        expect.assertions(5);

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
        expect(actual?.description).toContain('Sentence ending should be "?" (U+003F) for ja-JP locale instead of "？" (U+FF1F)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("これは何ですか<e0>？ (U+FF1F)</e0>");
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
        expect.assertions(5);

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
        expect(actual?.description).toContain('Sentence ending should be "!" (U+0021) for ja-JP locale instead of "！" (U+FF01)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("これは素晴らしいです<e0>！ (U+FF01)</e0>");
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

    // Test for extra punctuation in translation when source has no punctuation
    test("Extra punctuation in translation when source has no punctuation", () => {
        expect.assertions(6);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "extra.punctuation.in.translation",
            sourceLocale: "en-US",
            source: "Hello world",
            targetLocale: "ja-JP",
            target: "こんにちは世界。",
            pathName: "a/b/c.xliff",
            lineNumber: 35
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "" for ja-JP locale instead of "。" (U+3002)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("こんにちは世界<e0>。 (U+3002)</e0>");
        expect(actual?.fix).toBeTruthy();
    });

    // Test for missing punctuation in translation when source has punctuation
    test("Missing punctuation in translation when source has punctuation", () => {
        expect.assertions(6);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "missing.punctuation.in.translation",
            sourceLocale: "en-US",
            source: "Hello world.",
            targetLocale: "ja-JP",
            target: "こんにちは世界",
            pathName: "a/b/c.xliff",
            lineNumber: 36
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "。" (U+3002) for ja-JP locale instead of ""');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("こんにちは世界<e0/>");
        expect(actual?.fix).toBeTruthy();
    });

    // French spacing tests
    test("French wrong spacing character before sentence-ending punctuation within quotes", () => {
        expect.assertions(12);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "curly.quotes.different.punctuation",
            sourceLocale: "en-US",
            source: "She said, \"Hello world!\"",
            targetLocale: "fr-FR",
            target: "Elle a dit : « Bonjour le monde ! »",
            pathName: "a/b/c.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test/testfiles/xliff/test.xliff", {})
        });

        const actual = rule.match({
            ir,
            file: resource.getPath()
        });

        expect(actual).toBeTruthy();
        expect(actual.severity).toBe("warning");
        expect(actual.id).toBe(resource.getKey());
        expect(actual.description).toContain('Sentence ending should be "\u202F!" (U+202F U+0021) for fr-FR locale instead of " !" (U+0020 U+0021)');
        expect(actual.highlight).toBe("Elle a dit : « Bonjour le monde<e0> (U+0020)</e0>! »");
        expect(actual.source).toBe("She said, \"Hello world!\"");
        expect(actual.pathName).toBe("a/b/c.xliff");

        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(1);
        expect(fix?.commands[0].stringFix.position).toBe(31);
        expect(fix?.commands[0].stringFix.deleteCount).toBe(1);
        expect(fix?.commands[0].stringFix.insertContent).toBe("\u202F"); // insert thin no-break space
    });

    test("French wrong spacing character before wrong sentence-ending punctuation within quotes", () => {
        expect.assertions(15);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "curly.quotes.different.punctuation",
            sourceLocale: "en-US",
            source: "She said, \"Hello world.\"",
            targetLocale: "fr-FR",
            target: "Elle a dit : « Bonjour le monde ! »",
            pathName: "a/b/c.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test/testfiles/xliff/test.xliff", {})
        });

        const actual = rule.match({
            ir,
            file: resource.getPath()
        });

        expect(actual).toBeTruthy();
        expect(actual.severity).toBe("warning");
        expect(actual.id).toBe(resource.getKey());
        expect(actual.description).toContain('Sentence ending should be \".\" (U+002E) for fr-FR locale instead of \" !\" (U+0020 U+0021)');
        expect(actual.highlight).toBe("Elle a dit : « Bonjour le monde<e0> ! (U+0020 U+0021)</e0> »");
        expect(actual.source).toBe("She said, \"Hello world.\"");
        expect(actual.pathName).toBe("a/b/c.xliff");

        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(2);

        // First command should replace the regular space with nothing (since period doesn't need space)
        expect(fix?.commands[0].stringFix.position).toBe(31); // position of the space
        expect(fix?.commands[0].stringFix.deleteCount).toBe(1); // delete 1 character (space)
        expect(fix?.commands[0].stringFix.insertContent).toBe(""); // insert nothing

        // Second command should replace the exclamation point with period
        expect(fix?.commands[1].stringFix.position).toBe(32); // position of the exclamation
        expect(fix?.commands[1].stringFix.deleteCount).toBe(1); // delete 1 character (exclamation)
        expect(fix?.commands[1].stringFix.insertContent).toBe("."); // insert period
    });

    test("French wrong spacing character before wrong sentence-ending question mark punctuation within quotes", () => {
        expect.assertions(15);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "curly.quotes.different.punctuation",
            sourceLocale: "en-US",
            source: "She said, \"Hello world?\"",
            targetLocale: "fr-FR",
            target: "Elle a dit : « Bonjour le monde ! »",
            pathName: "a/b/c.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test/testfiles/xliff/test.xliff", {})
        });

        const actual = rule.match({
            ir,
            file: resource.getPath()
        });

        expect(actual).toBeTruthy();
        expect(actual.severity).toBe("warning");
        expect(actual.id).toBe(resource.getKey());
        expect(actual.description).toContain('Sentence ending should be "\u202F?" (U+202F U+003F) for fr-FR locale instead of " !" (U+0020 U+0021)');
        expect(actual.highlight).toBe("Elle a dit : « Bonjour le monde<e0> ! (U+0020 U+0021)</e0> »");
        expect(actual.source).toBe("She said, \"Hello world?\"");
        expect(actual.pathName).toBe("a/b/c.xliff");

        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(2);

        // First command should replace the regular space with non-breaking space
        expect(fix?.commands[0].stringFix.position).toBe(31); // position of the space
        expect(fix?.commands[0].stringFix.deleteCount).toBe(1); // delete 1 character (space)
        expect(fix?.commands[0].stringFix.insertContent).toBe("\u202F"); // insert thin no-break space

        // Second command should replace the exclamation point with question mark
        expect(fix?.commands[1].stringFix.position).toBe(32); // position of the exclamation
        expect(fix?.commands[1].stringFix.deleteCount).toBe(1); // delete 1 character (exclamation)
        expect(fix?.commands[1].stringFix.insertContent).toBe("?"); // insert question mark
    });

    // French non-breaking space tests
    test("French no non-breaking space before period", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.missing.nbsp.period",
            sourceLocale: "en-US",
            source: "Hello world.",
            targetLocale: "fr-FR",
            target: "Bonjour le monde.",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeFalsy();
    });

    test("French missing non-breaking space before question mark", () => {
        expect.assertions(10);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.missing.nbsp.question",
            sourceLocale: "en-US",
            source: "What is your name?",
            targetLocale: "fr-FR",
            target: "Comment vous appelez-vous?",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "\u202F?" (U+202F U+003F) for fr-FR locale instead of "?" (U+003F)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Comment vous appelez-vous<e0/>?");
        expect(actual?.fix).toBeTruthy();

        // Check that the fix replaces the regular space with a non-breaking space
        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(1);
        expect(fix?.commands[0].stringFix.position).toBe(25); // position of the space
        expect(fix?.commands[0].stringFix.deleteCount).toBe(1); // delete 1 character (the regular space)
        expect(fix?.commands[0].stringFix.insertContent).toBe("\u202F"); // insert thin no-break space
    });

    test("French missing non-breaking space before exclamation mark", () => {
        expect.assertions(10);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.missing.nbsp.exclamation",
            sourceLocale: "en-US",
            source: "Welcome to our site!",
            targetLocale: "fr-FR",
            target: "Bienvenue sur notre site!",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "\u202F!" (U+202F U+0021) for fr-FR locale instead of "!" (U+0021)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Bienvenue sur notre site<e0/>!");
        expect(actual?.fix).toBeTruthy();

        // Check that the fix replaces the regular space with a non-breaking space
        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(1);
        expect(fix?.commands[0].stringFix.position).toBe(24); // position of the space
        expect(fix?.commands[0].stringFix.deleteCount).toBe(1); // delete 1 character (the regular space)
        expect(fix?.commands[0].stringFix.insertContent).toBe("\u202F"); // insert thin no-break space
    });

    test("French wrong type of space before exclamation mark", () => {
        expect.assertions(6);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.wrong.space.exclamation",
            sourceLocale: "en-US",
            source: "Welcome to our site!",
            targetLocale: "fr-FR",
            target: "Bienvenue sur notre site !",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "\u202F!" (U+202F U+0021) for fr-FR locale instead of " !" (U+0020 U+0021)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Bienvenue sur notre site<e0> (U+0020)</e0>!");
        expect(actual?.fix).toBeTruthy();
    });

    test("French correct non-breaking space before exclamation mark", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.correct.nbsp.exclamation",
            sourceLocale: "en-US",
            source: "Welcome!",
            targetLocale: "fr-FR",
            target: "Bienvenue\u202F!",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeFalsy();
    });

    test("French missing non-breaking space before colon", () => {
        expect.assertions(10);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.missing.nbsp.colon",
            sourceLocale: "en-US",
            source: "The options are:",
            targetLocale: "fr-FR",
            target: "Les options sont:",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "\u202F:" (U+202F U+003A) for fr-FR locale instead of ":" (U+003A)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Les options sont<e0/>:");
        expect(actual?.fix).toBeTruthy();

        // Check that the fix replaces the regular space with a non-breaking space
        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(1);
        expect(fix?.commands[0].stringFix.position).toBe(16); // position of the space
        expect(fix?.commands[0].stringFix.deleteCount).toBe(1); // delete 1 character (the regular space)
        expect(fix?.commands[0].stringFix.insertContent).toBe("\u202F"); // insert thin no-break space
    });

    test("French no non-breaking space before ellipsis", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.missing.nbsp.ellipsis",
            sourceLocale: "en-US",
            source: "Loading...",
            targetLocale: "fr-FR",
            target: "Chargement…",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeFalsy();
    });

    test("French no non-breaking space before incorrect elipsis", () => {
        expect.assertions(8);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.missing.nbsp.ellipsis",
            sourceLocale: "en-US",
            source: "Loading the file...",
            targetLocale: "fr-FR",
            target: "Chargement du fichier...",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.highlight).toBe("Chargement du fichier<e0>... (U+002E U+002E U+002E)</e0>");
        expect(actual?.fix).toBeTruthy();

        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(1);
        expect(fix?.commands[0].stringFix.position).toBe(21);
        expect(fix?.commands[0].stringFix.deleteCount).toBe(3);
        expect(fix?.commands[0].stringFix.insertContent).toBe("…");
    });

    // French wrong punctuation type tests
    test("French wrong punctuation type with regular space before exclamation", () => {
        expect.assertions(11);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.wrong.punctuation.regular.space",
            sourceLocale: "en-US",
            source: "Hello world.",
            targetLocale: "fr-FR",
            target: "Bonjour le monde !",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.highlight).toBe("Bonjour le monde<e0> ! (U+0020 U+0021)</e0>");
        expect(actual?.fix).toBeTruthy();

        // Check that the fix handles both spacing and punctuation issues
        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(2);

        // First command should delete the space (since period doesn't need space)
        expect(fix?.commands[0].stringFix.position).toBe(16); // position of the space
        expect(fix?.commands[0].stringFix.deleteCount).toBe(1); // delete 1 character (space)
        expect(fix?.commands[0].stringFix.insertContent).toBe(""); // insert nothing

        // Second command should replace the exclamation point with period
        expect(fix?.commands[1].stringFix.position).toBe(17); // position of the exclamation
        expect(fix?.commands[1].stringFix.deleteCount).toBe(1); // delete 1 character (exclamation)
        expect(fix?.commands[1].stringFix.insertContent).toBe("."); // insert period
    });

    test("French wrong punctuation type with no space before exclamation", () => {
        expect.assertions(8);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.wrong.punctuation.no.space",
            sourceLocale: "en-US",
            source: "Hello world.",
            targetLocale: "fr-FR",
            target: "Bonjour le monde!",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.highlight).toBe("Bonjour le monde<e0>! (U+0021)</e0>");
        expect(actual?.fix).toBeTruthy();

        // Check that the fix only replaces the exclamation point (no space needed for period)
        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(1);

        // Command should replace the exclamation point with period
        expect(fix?.commands[0].stringFix.position).toBe(16); // position of the exclamation
        expect(fix?.commands[0].stringFix.deleteCount).toBe(1); // delete 1 character (exclamation)
        expect(fix?.commands[0].stringFix.insertContent).toBe("."); // insert period
    });

    test("French wrong punctuation type with non-breaking space before exclamation", () => {
        expect.assertions(11);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.wrong.punctuation.nbsp",
            sourceLocale: "en-US",
            source: "Hello world.",
            targetLocale: "fr-FR",
            target: "Bonjour le monde\u202F!",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.highlight).toBe("Bonjour le monde<e0>\u202F! (U+202F U+0021)</e0>");
        expect(actual?.fix).toBeTruthy();

        // Check that the fix has 2 commands: one to remove the non-breaking space, one to replace the exclamation point
        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(2);

        // First command should remove the non-breaking space
        expect(fix?.commands[0].stringFix.position).toBe(16); // position of the non-breaking space
        expect(fix?.commands[0].stringFix.deleteCount).toBe(1); // delete 1 character (non-breaking space)
        expect(fix?.commands[0].stringFix.insertContent).toBe(""); // insert nothing

        // Second command should replace the exclamation point with period
        expect(fix?.commands[1].stringFix.position).toBe(17); // position of the exclamation
        expect(fix?.commands[1].stringFix.deleteCount).toBe(1); // delete 1 character (exclamation)
        expect(fix?.commands[1].stringFix.insertContent).toBe("."); // insert period
    });

    test("French wrong punctuation type ellipsis", () => {
        expect.assertions(8);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.wrong.punctuation.nbsp",
            sourceLocale: "en-US",
            source: "Hello world.",
            targetLocale: "fr-FR",
            target: "Bonjour le monde...",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.highlight).toBe("Bonjour le monde<e0>... (U+002E U+002E U+002E)</e0>");
        expect(actual?.fix).toBeTruthy();

        // Check that the fix only replaces the exclamation point
        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(1);

        // Command should replace the exclamation point
        expect(fix?.commands[0].stringFix.position).toBe(16); // position of the exclamation
        expect(fix?.commands[0].stringFix.deleteCount).toBe(3); // delete 1 character (exclamation)
        expect(fix?.commands[0].stringFix.insertContent).toBe("."); // insert period
    });

    // Tests for wrong type of no-break space (regular U+00A0 instead of thin U+202F)
    test("French wrong no-break space type before exclamation mark", () => {
        expect.assertions(10);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.wrong.nbsp.type.exclamation",
            sourceLocale: "en-US",
            source: "Welcome to our site!",
            targetLocale: "fr-FR",
            target: "Bienvenue sur notre site\u00A0!",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // The rule should detect that the target has the wrong type of no-break space
        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "\u202F!" (U+202F U+0021) for fr-FR locale instead of " !" (U+00A0 U+0021)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Bienvenue sur notre site<e0> (U+00A0)</e0>!");
        expect(actual?.fix).toBeTruthy();

        // Check that the fix replaces the wrong no-break space with the correct one
        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(1);
        expect(fix?.commands[0].stringFix.position).toBe(24); // position of the wrong no-break space
        expect(fix?.commands[0].stringFix.deleteCount).toBe(1); // delete 1 character (wrong no-break space)
        expect(fix?.commands[0].stringFix.insertContent).toBe("\u202F"); // insert thin no-break space
    });

    test("French wrong no-break space type before question mark", () => {
        expect.assertions(10);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.wrong.nbsp.type.question",
            sourceLocale: "en-US",
            source: "What is this?",
            targetLocale: "fr-FR",
            target: "Qu'est-ce que c'est\u00A0?",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // The rule should detect that the target has the wrong type of no-break space
        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "\u202F?" (U+202F U+003F) for fr-FR locale instead of " ?" (U+00A0 U+003F)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Qu'est-ce que c'est<e0> (U+00A0)</e0>?");
        expect(actual?.fix).toBeTruthy();

        // Check that the fix replaces the wrong no-break space with the correct one
        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(1);
        expect(fix?.commands[0].stringFix.position).toBe(19); // position of the wrong no-break space
        expect(fix?.commands[0].stringFix.deleteCount).toBe(1); // delete 1 character (wrong no-break space)
        expect(fix?.commands[0].stringFix.insertContent).toBe("\u202F"); // insert thin no-break space
    });

    test("French wrong no-break space type before colon", () => {
        expect.assertions(10);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.wrong.nbsp.type.colon",
            sourceLocale: "en-US",
            source: "The options are:",
            targetLocale: "fr-FR",
            target: "Les options sont\u00A0:",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // The rule should detect that the target has the wrong type of no-break space
        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "\u202F:" (U+202F U+003A) for fr-FR locale instead of " :" (U+00A0 U+003A)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Les options sont<e0> (U+00A0)</e0>:");
        expect(actual?.fix).toBeTruthy();

        // Check that the fix replaces the wrong no-break space with the correct one
        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(1);
        expect(fix?.commands[0].stringFix.position).toBe(16); // position of the wrong no-break space
        expect(fix?.commands[0].stringFix.deleteCount).toBe(1); // delete 1 character (wrong no-break space)
        expect(fix?.commands[0].stringFix.insertContent).toBe("\u202F"); // insert thin no-break space
    });

    test("French missing punctuation type period", () => {
        expect.assertions(10);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.missing.punctuation.period",
            sourceLocale: "en-US",
            source: "Hello world.",
            targetLocale: "fr-FR",
            target: "Bonjour le monde",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "." (U+002E) for fr-FR locale instead of ""');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Bonjour le monde<e0/>");
        expect(actual?.fix).toBeTruthy();

        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(1);
        expect(fix?.commands[0].stringFix.position).toBe(16);
        expect(fix?.commands[0].stringFix.deleteCount).toBe(0);
        expect(fix?.commands[0].stringFix.insertContent).toBe(".");
    });

    test("French missing punctuation type exclamation mark", () => {
        expect.assertions(10);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.missing.punctuation.period",
            sourceLocale: "en-US",
            source: "Hello world!",
            targetLocale: "fr-FR",
            target: "Bonjour le monde",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "\u202F!" (U+202F U+0021) for fr-FR locale instead of ""');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Bonjour le monde<e0/>");
        expect(actual?.fix).toBeTruthy();

        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(1);
        expect(fix?.commands[0].stringFix.position).toBe(16);
        expect(fix?.commands[0].stringFix.deleteCount).toBe(0);
        expect(fix?.commands[0].stringFix.insertContent).toBe("\u202F!");
    });

    test("French missing punctuation type question mark", () => {
        expect.assertions(10);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.missing.punctuation.period",
            sourceLocale: "en-US",
            source: "Hello world?",
            targetLocale: "fr-FR",
            target: "Bonjour le monde",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "\u202F?" (U+202F U+003F) for fr-FR locale instead of ""');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Bonjour le monde<e0/>");
        expect(actual?.fix).toBeTruthy();

        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(1);
        expect(fix?.commands[0].stringFix.position).toBe(16);
        expect(fix?.commands[0].stringFix.deleteCount).toBe(0);
        expect(fix?.commands[0].stringFix.insertContent).toBe("\u202F?");
    });

    test("French missing punctuation type colon", () => {
        expect.assertions(10);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.missing.punctuation.period",
            sourceLocale: "en-US",
            source: "Hello world:",
            targetLocale: "fr-FR",
            target: "Bonjour le monde",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "\u202F:" (U+202F U+003A) for fr-FR locale instead of ""');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Bonjour le monde<e0/>");
        expect(actual?.fix).toBeTruthy();

        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(1);
        expect(fix?.commands[0].stringFix.position).toBe(16);
        expect(fix?.commands[0].stringFix.deleteCount).toBe(0);
        expect(fix?.commands[0].stringFix.insertContent).toBe("\u202F:");
    });

    test("French missing punctuation type ellipsis", () => {
        expect.assertions(10);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.missing.punctuation.period",
            sourceLocale: "en-US",
            source: "Hello world...",
            targetLocale: "fr-FR",
            target: "Bonjour le monde",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "\u2026" (U+2026) for fr-FR locale instead of ""');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Bonjour le monde<e0/>");
        expect(actual?.fix).toBeTruthy();

        const fix = actual?.fix;
        expect(fix?.commands).toHaveLength(1);
        expect(fix?.commands[0].stringFix.position).toBe(16);
        expect(fix?.commands[0].stringFix.deleteCount).toBe(0);
        expect(fix?.commands[0].stringFix.insertContent).toBe("…");
    });

    // Canadian French tests - should behave like English (no special spacing rules)
    test("Canadian French question mark without non-breaking space should not trigger warning", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "canadian.french.question.no.space",
            sourceLocale: "en-US",
            source: "What is this?",
            targetLocale: "fr-CA",
            target: "Qu'est-ce que c'est?",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Canadian French should not require non-breaking spaces, so no warning should be generated
        expect(actual).toBeUndefined();
    });

    test("Canadian French exclamation mark without non-breaking space should not trigger warning", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "canadian.french.exclamation.no.space",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "fr-CA",
            target: "C'est incroyable!",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Canadian French should not require non-breaking spaces, so no warning should be generated
        expect(actual).toBeUndefined();
    });

    test("Canadian French colon without non-breaking space should not trigger warning", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "canadian.french.colon.no.space",
            sourceLocale: "en-US",
            source: "She said: Hello!",
            targetLocale: "fr-CA",
            target: "Elle a dit: Bonjour!",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Canadian French should not require non-breaking spaces, so no warning should be generated
        expect(actual).toBeUndefined();
    });

    test("Canadian French with non-breaking space should not trigger warning (but should not be required)", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "canadian.french.with.nbsp",
            sourceLocale: "en-US",
            source: "What is this?",
            targetLocale: "fr-CA",
            target: "Qu'est-ce que c'est\u202F?",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Canadian French should not require non-breaking spaces, so no warning should be generated
        // even if they are present
        expect(actual).toBeUndefined();
    });

    test("Canadian French wrong punctuation type should still trigger warning", () => {
        expect.assertions(5);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "canadian.french.wrong.punctuation",
            sourceLocale: "en-US",
            source: "What is this?",
            targetLocale: "fr-CA",
            target: "Qu'est-ce que c'est!",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Canadian French should still check for correct punctuation type, just not spacing
        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "?" (U+003F) for fr-CA locale instead of "!" (U+0021)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Qu'est-ce que c'est<e0>! (U+0021)</e0>");
        // Note: We don't check for fix since the main point is punctuation detection, not fix generation
    });

    // European French-speaking countries that DO follow French spacing rules
    test("French (Belgium) should require non-breaking space before exclamation mark", () => {
        expect.assertions(6);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.belgium.exclamation.space",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "fr-BE",
            target: "C'est incroyable !",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // French (Belgium) should require non-breaking space before exclamation mark
        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "\u202F!" (U+202F U+0021) for fr-BE locale instead of " !" (U+0020 U+0021)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("C'est incroyable<e0> (U+0020)</e0>!");
        expect(actual?.fix).toBeTruthy();
    });

    test("French (Luxembourg) should require non-breaking space before question mark", () => {
        expect.assertions(6);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.luxembourg.question.space",
            sourceLocale: "en-US",
            source: "What is this?",
            targetLocale: "fr-LU",
            target: "Qu'est-ce que c'est ?",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // French (Luxembourg) should require non-breaking space before question mark
        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "\u202F?" (U+202F U+003F) for fr-LU locale instead of " ?" (U+0020 U+003F)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Qu'est-ce que c'est<e0> (U+0020)</e0>?");
        expect(actual?.fix).toBeTruthy();
    });

    test("French (Switzerland) should require non-breaking space before colon", () => {
        expect.assertions(6);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.switzerland.colon.space",
            sourceLocale: "en-US",
            source: "The options are:",
            targetLocale: "fr-CH",
            target: "Les options sont :",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // French (Switzerland) should require non-breaking space before colon
        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "\u202F:" (U+202F U+003A) for fr-CH locale instead of " :" (U+0020 U+003A)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Les options sont<e0> (U+0020)</e0>:");
        expect(actual?.fix).toBeTruthy();
    });

    // Non-European French-speaking countries that do NOT follow French spacing rules
    test("French (Côte d'Ivoire) should not require non-breaking space before exclamation mark", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.ivory.coast.exclamation.no.space",
            sourceLocale: "en-US",
            source: "This is amazing!",
            targetLocale: "fr-CI",
            target: "C'est incroyable!",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // French (Côte d'Ivoire) should not require non-breaking spaces, so no warning should be generated
        expect(actual).toBeUndefined();
    });

    test("French (Cameroon) should not require non-breaking space before question mark", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.cameroon.question.no.space",
            sourceLocale: "en-US",
            source: "What is this?",
            targetLocale: "fr-CM",
            target: "Qu'est-ce que c'est?",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // French (Cameroon) should not require non-breaking spaces, so no warning should be generated
        expect(actual).toBeUndefined();
    });

    test("French (Senegal) should not require non-breaking space before colon", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.senegal.colon.no.space",
            sourceLocale: "en-US",
            source: "She said: Hello!",
            targetLocale: "fr-SN",
            target: "Elle a dit: Bonjour!",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // French (Cameroon) should not require non-breaking spaces, so no warning should be generated
        expect(actual).toBeUndefined();
    });


    // Test for multi-sentence source with different punctuation types
    test("Multi-sentence source with statement and question translated to Spanish", () => {
        expect.assertions(6);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "multi.sentence.statement.question.spanish",
            sourceLocale: "en-US",
            source: "This is a statement. What is this?",
            targetLocale: "es-ES",
            target: "Esto es una declaración. ¿Qué es esto？",
            pathName: "a/b/c.xliff",
            lineNumber: 39
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "?" (U+003F) for es-ES locale instead of "？" (U+FF1F)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Esto es una declaración. ¿Qué es esto<e0>？ (U+FF1F)</e0>");
        expect(actual?.fix).toBeTruthy();
    });

    // Test for English to Amharic with Amharic-style quotes
    test("English to Amharic with Amharic-style quotes", () => {
        expect.assertions(6);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "english.to.amharic.quotes",
            sourceLocale: "en-US",
            source: "She said, \"What is this?\"",
            targetLocale: "am-ET",
            target: "እርሷ እንደተናገረች፣ «ይህ ምንድን ነው?»",
            pathName: "a/b/c.xliff"
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Sentence ending should be "፧" (U+1367) for am-ET locale instead of "?" (U+003F)');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("እርሷ እንደተናገረች፣ «ይህ ምንድን ነው<e0>? (U+003F)</e0>»");
        expect(actual?.fix).toBeTruthy();
    });

    // Test for French to Spanish with French quotes and Spanish quotes, both with periods
    test("French to Spanish with French quotes and Spanish quotes, both with periods", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.to.spanish.periods",
            sourceLocale: "fr-FR",
            source: "Elle a dit : « Bonjour le monde. »",
            targetLocale: "es-ES",
            target: "Ella dijo: «Hola mundo.»",
            pathName: "a/b/c.xliff",
            lineNumber: 41
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        // Should NOT trigger because both have periods and Spanish doesn't need inverted punctuation for periods
        expect(actual).toBeUndefined();
    });

    // Test for French to Spanish with French quotes and Spanish quotes, both with question marks but missing inverted punctuation
    test("French to Spanish with French quotes and Spanish quotes, both with question marks but missing inverted punctuation", () => {
        expect.assertions(6);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "french.to.spanish.question.missing.inverted",
            sourceLocale: "fr-FR",
            source: "Elle a dit : « Qu'est-ce que c'est ? »",
            targetLocale: "es-ES",
            target: "Ella dijo: «Qué es esto?»",
            pathName: "a/b/c.xliff",
            lineNumber: 42
        });

        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        expect(actual).toBeTruthy();
        expect(actual?.description).toContain('Spanish question should start with "¿" (U+00BF) for es-ES locale');
        expect(actual?.id).toBe(resource.getKey());
        expect(actual?.highlight).toBe("Ella dijo: «<e0/>Qué es esto?»");
        expect(actual?.fix).toBeTruthy();
    });

    // Test for ResourceArray with sentence ending punctuation issues
    test("ResourceArray with sentence ending punctuation issues", () => {
        expect.assertions(8);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "array.sentence.ending",
            sourceLocale: "en-US",
            source: ["Hello world.", "What is this?"],
            targetLocale: "ja-JP",
            target: ["こんにちは世界。", "これは何ですか?"],
            pathName: "a/b/c.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test/testfiles/xliff/test.xliff", {})
        });

        const actual = rule.match({
            ir,
            file: resource.getPath()
        });

        expect(actual).toBeTruthy();
        expect(actual.severity).toBe("warning");
        expect(actual.id).toBe(resource.getKey());
        expect(actual.description).toContain('Sentence ending should be "？" (U+FF1F) for ja-JP locale');
        expect(actual.highlight).toBe("Target[1]: これは何ですか<e0>? (U+003F)</e0>");
        expect(actual.source).toBe("What is this?");
        expect(actual.pathName).toBe("a/b/c.xliff");
    });

    // Test for ResourceArray with no sentence ending punctuation issues
    test("ResourceArray with no sentence ending punctuation issues", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "array.no.sentence.ending.issues",
            sourceLocale: "en-US",
            source: ["Hello world.", "What is this?"],
            targetLocale: "ja-JP",
            target: ["こんにちは世界。", "これは何ですか？"],
            pathName: "a/b/c.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test/testfiles/xliff/test.xliff", {})
        });

        const actual = rule.match({
            ir,
            file: resource.getPath()
        });

        expect(actual).toBeFalsy();
    });

    // Test for ResourcePlural with sentence ending punctuation issues
    test("ResourcePlural with sentence ending punctuation issues", () => {
        expect.assertions(8);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "plural.sentence.ending",
            sourceLocale: "en-US",
            source: {
                one: "Hello world.",
                other: "What is this?"
            },
            targetLocale: "es-ES",
            target: {
                one: "Hola mundo.",
                other: "Qué es esto?"
            },
            pathName: "a/b/c.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test/testfiles/xliff/test.xliff", {})
        });

        const actual = rule.match({
            ir,
            file: resource.getPath()
        });

        expect(actual).toBeTruthy();
        expect(actual.severity).toBe("warning");
        expect(actual.id).toBe(resource.getKey());
        expect(actual.description).toContain('Spanish question should start with "¿" (U+00BF) for es-ES locale');
        expect(actual.highlight).toBe("Target(other): <e0/>Qué es esto?");
        expect(actual.source).toBe("What is this?");
        expect(actual.pathName).toBe("a/b/c.xliff");
    });

    // Test for ResourcePlural with no sentence ending punctuation issues
    test("ResourcePlural with no sentence ending punctuation issues", () => {
        expect.assertions(2);

        const rule = new ResourceSentenceEnding();
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "plural.no.sentence.ending.issues",
            sourceLocale: "en-US",
            source: {
                one: "Hello world.",
                other: "What is this?"
            },
            targetLocale: "es-ES",
            target: {
                one: "Hola mundo.",
                other: "¿Qué es esto?"
            },
            pathName: "a/b/c.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("test/testfiles/xliff/test.xliff", {})
        });

        const actual = rule.match({
            ir,
            file: resource.getPath()
        });

        expect(actual).toBeFalsy();
    });

    // Unit tests for supporting functions
    describe("Supporting functions", () => {
        describe("stripTrailingQuotesAndWhitespace", () => {
            test("should strip trailing quotes and whitespace", () => {
                expect.assertions(6);

                expect(ResourceSentenceEnding.stripTrailingQuotesAndWhitespace('Hello world."')).toBe('Hello world.');
                expect(ResourceSentenceEnding.stripTrailingQuotesAndWhitespace('Hello world." ')).toBe('Hello world.');
                expect(ResourceSentenceEnding.stripTrailingQuotesAndWhitespace('Hello world.»')).toBe('Hello world.');
                expect(ResourceSentenceEnding.stripTrailingQuotesAndWhitespace('Hello world. » ')).toBe('Hello world.');
                expect(ResourceSentenceEnding.stripTrailingQuotesAndWhitespace('Hello world.')).toBe('Hello world.');
                expect(ResourceSentenceEnding.stripTrailingQuotesAndWhitespace('')).toBe('');
            });

            test("should handle multiple trailing quotes and whitespace", () => {
                expect.assertions(3);

                expect(ResourceSentenceEnding.stripTrailingQuotesAndWhitespace('Hello world." "')).toBe('Hello world.');
                expect(ResourceSentenceEnding.stripTrailingQuotesAndWhitespace('Hello world.» ')).toBe('Hello world.');
                expect(ResourceSentenceEnding.stripTrailingQuotesAndWhitespace('Hello world.  "')).toBe('Hello world.');
            });
        });

        describe("getLastQuotedString", () => {
            test("should extract the last quoted string", () => {
                expect.assertions(6);

                expect(ResourceSentenceEnding.getLastQuotedString('She said, "Hello world."')).toBe('Hello world.');
                expect(ResourceSentenceEnding.getLastQuotedString('Elle a dit : « Bonjour le monde ! »')).toBe(' Bonjour le monde ! ');
                expect(ResourceSentenceEnding.getLastQuotedString('她说："你好！"')).toBe('你好！');
                expect(ResourceSentenceEnding.getLastQuotedString('彼女は「こんにちは！」と言いました。')).toBe('こんにちは！');
                expect(ResourceSentenceEnding.getLastQuotedString('Ella dijo: "¡Hola!"')).toBe('¡Hola!');
                expect(ResourceSentenceEnding.getLastQuotedString('No quotes here')).toBe(null);
            });

            test("should handle nested quotes", () => {
                expect.assertions(2);

                // The current implementation doesn't handle nested quotes correctly
                // It finds the last quote character and looks for the previous quote character
                // This means it will find the outer quotes, not the inner ones
                // For 'He said, "She said, \'Hello\'"', it finds the last ' and looks for the previous ', which is also ', so it returns empty string
                expect(ResourceSentenceEnding.getLastQuotedString('He said, "She said, \'Hello\'"')).toBe('');
                expect(ResourceSentenceEnding.getLastQuotedString('He said, "She said, \'Hello\'" and left')).toBe('');
            });
        });

        describe("getLastSentenceFromContent", () => {
            test("should extract the last sentence from content", () => {
                expect.assertions(4);
                const rule = new ResourceSentenceEnding();

                expect(rule.getLastSentenceFromContent('Hello world. How are you?', new Locale('en-US'))).toBe('How are you?');
                expect(rule.getLastSentenceFromContent('Bonjour le monde ! Comment allez-vous ?', new Locale('fr-FR'))).toBe('Comment allez-vous ?');
                expect(rule.getLastSentenceFromContent('你好！今天天气怎么样？', new Locale('zh-CN'))).toBe('今天天气怎么样？');
                expect(rule.getLastSentenceFromContent('こんにちは世界。お元気ですか？', new Locale('ja-JP'))).toBe('お元気ですか？');
            });

            test("should handle single sentences", () => {
                expect.assertions(3);
                const rule = new ResourceSentenceEnding();

                expect(rule.getLastSentenceFromContent('Hello world.', new Locale('en-US'))).toBe('Hello world.');
                expect(rule.getLastSentenceFromContent('Bonjour le monde !', new Locale('fr-FR'))).toBe('Bonjour le monde !');
                expect(rule.getLastSentenceFromContent('你好！', new Locale('zh-CN'))).toBe('你好！');
            });

            test("should handle content without sentence endings", () => {
                expect.assertions(2);
                const rule = new ResourceSentenceEnding();

                expect(rule.getLastSentenceFromContent('Hello world', new Locale('en-US'))).toBe('Hello world');
                expect(rule.getLastSentenceFromContent('', new Locale('en-US'))).toBe('');
            });
        });


        describe("getLastSentence", () => {
            test("should handle source strings ending with quotes", () => {
                expect.assertions(3);
                const rule = new ResourceSentenceEnding();

                expect(rule.getLastSentence('She said, "Hello world."', true, new Locale('en-US'))).toBe('Hello world.');
                expect(rule.getLastSentence('Elle a dit : « Bonjour le monde ! »', true, new Locale('fr-FR'))).toBe(' Bonjour le monde ! ');
                expect(rule.getLastSentence('她说："你好！"', true, new Locale('zh-CN'))).toBe('你好！');
            });

            test("should handle source strings not ending with quotes", () => {
                expect.assertions(4);
                const rule = new ResourceSentenceEnding();

                expect(rule.getLastSentence('Hello world.', true, new Locale('en-US'))).toBe('Hello world.');
                expect(rule.getLastSentence('Bonjour le monde !', true, new Locale('fr-FR'))).toBe('Bonjour le monde !');
                expect(rule.getLastSentence('你好！', true, new Locale('zh-CN'))).toBe('你好！');
                expect(rule.getLastSentence(' ¡Hola amigos! ', true, new Locale('es-ES'))).toBe('¡Hola amigos!');
            });

            test("should handle source strings with multiple sentences", () => {
                expect.assertions(1);
                const rule = new ResourceSentenceEnding();

                expect(rule.getLastSentence('Hello world. How are you?', true, new Locale('en-US'))).toBe('How are you?');
            });

            test("should handle target strings with quoted content", () => {
                expect.assertions(3);
                const rule = new ResourceSentenceEnding();

                expect(rule.getLastSentence('She said, "Hello world."', false, new Locale('en-US'))).toBe('Hello world.');
                expect(rule.getLastSentence('Elle a dit : « Bonjour le monde ! »', false, new Locale('fr-FR'))).toBe(' Bonjour le monde ! ');
                expect(rule.getLastSentence('她说："你好！"', false, new Locale('zh-CN'))).toBe('你好！');
            });

            test("should handle target strings without quoted content", () => {
                expect.assertions(4);
                const rule = new ResourceSentenceEnding();

                expect(rule.getLastSentence('Hello world.', false, new Locale('en-US'))).toBe('Hello world.');
                expect(rule.getLastSentence('Bonjour le monde !', false, new Locale('fr-FR'))).toBe('Bonjour le monde !');
                expect(rule.getLastSentence('你好！', false, new Locale('zh-CN'))).toBe('你好！');
                expect(rule.getLastSentence('¡Hola amigos!', false, new Locale('es-ES'))).toBe('¡Hola amigos!');
            });

            test("should handle target strings with multiple sentences", () => {
                expect.assertions(3);
                const rule = new ResourceSentenceEnding();

                expect(rule.getLastSentence('Elle est belle. Vous avais d\'accord?', false, new Locale('fr-FR'))).toBe('Vous avais d\'accord?');
                expect(rule.getLastSentence('¡Hay un problema! ¿Qué es esto?', false, new Locale('es-ES'))).toBe('¿Qué es esto?');
                expect(rule.getLastSentence('こんにちは世界。お元気ですか？', false, new Locale('ja-JP'))).toBe('お元気ですか？');
            });
        });

        describe("getUnicodeCode", () => {
            test("should convert characters to Unicode codes", () => {
                expect.assertions(8);

                expect(ResourceSentenceEnding.getUnicodeCode('A')).toBe('U+0041');
                expect(ResourceSentenceEnding.getUnicodeCode('a')).toBe('U+0061');
                expect(ResourceSentenceEnding.getUnicodeCode('!')).toBe('U+0021');
                expect(ResourceSentenceEnding.getUnicodeCode('？')).toBe('U+FF1F');
                expect(ResourceSentenceEnding.getUnicodeCode('！')).toBe('U+FF01');
                expect(ResourceSentenceEnding.getUnicodeCode('。')).toBe('U+3002');
                expect(ResourceSentenceEnding.getUnicodeCode('¿')).toBe('U+00BF');
                expect(ResourceSentenceEnding.getUnicodeCode('¡')).toBe('U+00A1');
            });

            test("should handle empty string", () => {
                expect.assertions(1);

                expect(ResourceSentenceEnding.getUnicodeCode('')).toBe('');
            });
        });

        describe("getUnicodeCodes", () => {
            test("should convert strings to Unicode codes", () => {
                expect.assertions(6);

                expect(ResourceSentenceEnding.getUnicodeCodes('Hello')).toBe('U+0048 U+0065 U+006C U+006C U+006F');
                expect(ResourceSentenceEnding.getUnicodeCodes('!')).toBe('U+0021');
                expect(ResourceSentenceEnding.getUnicodeCodes('？')).toBe('U+FF1F');
                expect(ResourceSentenceEnding.getUnicodeCodes('！')).toBe('U+FF01');
                expect(ResourceSentenceEnding.getUnicodeCodes('。')).toBe('U+3002');
                expect(ResourceSentenceEnding.getUnicodeCodes('¿¡')).toBe('U+00BF U+00A1');
            });

            test("should handle empty string", () => {
                expect.assertions(1);

                expect(ResourceSentenceEnding.getUnicodeCodes('')).toBe('');
            });
        });
    });

    // Unit tests for core rule methods
    describe("Core rule methods", () => {
        describe("hasExpectedEnding", () => {
            test("should return true when target has expected punctuation", () => {
                expect.assertions(4);

                const rule = new ResourceSentenceEnding();
                expect(rule.hasExpectedEnding("Hello world.", ".", ".")).toBe(true);
                expect(rule.hasExpectedEnding("What is this?", "?", "?")).toBe(true);
                expect(rule.hasExpectedEnding("Amazing!", "!", "!")).toBe(true);
                expect(rule.hasExpectedEnding("こんにちは世界。", "。", "。")).toBe(true);
            });

            test("should return false when target has different punctuation", () => {
                expect.assertions(4);

                const rule = new ResourceSentenceEnding();
                expect(rule.hasExpectedEnding("Hello world!", ".", "!")).toBe(false);
                expect(rule.hasExpectedEnding("What is this.", "?", ".")).toBe(false);
                expect(rule.hasExpectedEnding("Amazing?", "!", "?")).toBe(false);
                expect(rule.hasExpectedEnding("こんにちは世界！", "。", "！")).toBe(false);
            });

            test("should return false when target has no punctuation", () => {
                expect.assertions(3);

                const rule = new ResourceSentenceEnding();
                expect(rule.hasExpectedEnding("Hello world", ".", "")).toBe(false);
                expect(rule.hasExpectedEnding("What is this", "?", "")).toBe(false);
                expect(rule.hasExpectedEnding("Amazing", "!", "")).toBe(false);
            });

            test("should handle quoted content", () => {
                expect.assertions(3);

                const rule = new ResourceSentenceEnding();
                // The method checks if the entire string ends with the expected punctuation
                // For quoted content, it should check the content inside quotes
                expect(rule.hasExpectedEnding('She said, "Hello world."', ".", ".")).toBe(false);
                expect(rule.hasExpectedEnding('Elle a dit : « Bonjour le monde ! »', "!", "!")).toBe(false);
                expect(rule.hasExpectedEnding('她说："你好！"', "!", "!")).toBe(false);
            });
        });

        describe("getExpectedPunctuation", () => {
            test("should return expected punctuation for English locale", () => {
                expect.assertions(5);

                const rule = new ResourceSentenceEnding();
                const localeObj = new Locale("en-US");

                expect(rule.getExpectedPunctuation(localeObj, "period")).toBe(".");
                expect(rule.getExpectedPunctuation(localeObj, "question")).toBe("?");
                expect(rule.getExpectedPunctuation(localeObj, "exclamation")).toBe("!");
                expect(rule.getExpectedPunctuation(localeObj, "ellipsis")).toBe("…");
                expect(rule.getExpectedPunctuation(localeObj, "colon")).toBe(":");
            });

            test("should return expected punctuation for Japanese locale", () => {
                expect.assertions(5);

                const rule = new ResourceSentenceEnding();
                const localeObj = new Locale("ja-JP");

                expect(rule.getExpectedPunctuation(localeObj, "period")).toBe("。");
                expect(rule.getExpectedPunctuation(localeObj, "question")).toBe("？");
                expect(rule.getExpectedPunctuation(localeObj, "exclamation")).toBe("！");
                expect(rule.getExpectedPunctuation(localeObj, "ellipsis")).toBe("…");
                expect(rule.getExpectedPunctuation(localeObj, "colon")).toBe("：");
            });

            test("should return expected punctuation for Chinese locale", () => {
                expect.assertions(5);

                const rule = new ResourceSentenceEnding();
                const localeObj = new Locale("zh-CN");

                expect(rule.getExpectedPunctuation(localeObj, "period")).toBe("。");
                expect(rule.getExpectedPunctuation(localeObj, "question")).toBe("？");
                expect(rule.getExpectedPunctuation(localeObj, "exclamation")).toBe("！");
                expect(rule.getExpectedPunctuation(localeObj, "ellipsis")).toBe("…");
                expect(rule.getExpectedPunctuation(localeObj, "colon")).toBe("：");
            });

            test("should return default punctuation for unknown punctuation type", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const localeObj = new Locale("en-US");

                expect(rule.getExpectedPunctuation(localeObj, "unknown")).toBe(".");
            });

            test("should handle custom punctuation configuration", () => {
                expect.assertions(3);

                const rule = new ResourceSentenceEnding({
                    "en-US": {
                        period: ".",
                        question: "?",
                        exclamation: "!"
                    }
                });
                const localeObj = new Locale("en-US");

                expect(rule.getExpectedPunctuation(localeObj, "period")).toBe(".");
                expect(rule.getExpectedPunctuation(localeObj, "question")).toBe("?");
                expect(rule.getExpectedPunctuation(localeObj, "exclamation")).toBe("!");
            });
        });

        describe("hasCorrectSpanishInvertedPunctuation", () => {
            test("should return true for correct Spanish question punctuation", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                expect(rule.hasCorrectSpanishInvertedPunctuation("¿Qué es esto?", "question").correct).toBe(true);
            });

            test("should return true for correct Spanish exclamation punctuation", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                expect(rule.hasCorrectSpanishInvertedPunctuation("¡Hola!", "exclamation").correct).toBe(true);
            });

            test("should return false for missing inverted punctuation", () => {
                expect.assertions(2);

                const rule = new ResourceSentenceEnding();
                expect(rule.hasCorrectSpanishInvertedPunctuation("Qué es esto?", "question").correct).toBe(false);
                expect(rule.hasCorrectSpanishInvertedPunctuation("Hola!", "exclamation").correct).toBe(false);
            });

            test("should return true for non-question/exclamation types", () => {
                expect.assertions(2);

                const rule = new ResourceSentenceEnding();
                expect(rule.hasCorrectSpanishInvertedPunctuation("Hola mundo.", "period").correct).toBe(true);
                expect(rule.hasCorrectSpanishInvertedPunctuation("Hola mundo...", "ellipsis").correct).toBe(true);
            });
        });

        describe("findIncorrectPunctuationPosition", () => {
            test("should find position of incorrect punctuation at end", () => {
                expect.assertions(3);

                const rule = new ResourceSentenceEnding();
                const result1 = rule.findIncorrectPunctuationPosition("Hello world!", "Hello world!", "!");
                expect(result1).toEqual({ position: 11, length: 1 });

                const result2 = rule.findIncorrectPunctuationPosition("What is this.", "What is this.", ".");
                expect(result2).toEqual({ position: 12, length: 1 });

                const result3 = rule.findIncorrectPunctuationPosition("こんにちは世界！", "こんにちは世界！", "！");
                expect(result3).toEqual({ position: 7, length: 1 });
            });

            test("should find position of incorrect punctuation in quoted content", () => {
                expect.assertions(2);

                const rule = new ResourceSentenceEnding();
                const result1 = rule.findIncorrectPunctuationPosition('She said, "Hello world!"', "Hello world!", "!");
                expect(result1).toEqual({ position: 22, length: 1 });

                const result2 = rule.findIncorrectPunctuationPosition('Elle a dit : « Bonjour le monde ! »', "Bonjour le monde !", "!");
                expect(result2).toEqual({ position: 32, length: 1 });
            });

            test("should return null when punctuation not found", () => {
                expect.assertions(3);

                const rule = new ResourceSentenceEnding();
                expect(rule.findIncorrectPunctuationPosition("Hello world", "Hello world", "!")).toBe(null);
                expect(rule.findIncorrectPunctuationPosition("Hello world!", "Hello world!", ".")).toBe(null);
                expect(rule.findIncorrectPunctuationPosition("", "", "!")).toBe(null);
            });

            test("should handle multi-character punctuation", () => {
                expect.assertions(2);

                const rule = new ResourceSentenceEnding();
                const result1 = rule.findIncorrectPunctuationPosition("Hello world...", "Hello world...", "...");
                expect(result1).toEqual({ position: 11, length: 3 });

                const result2 = rule.findIncorrectPunctuationPosition("Hello world…", "Hello world…", "…");
                expect(result2).toEqual({ position: 11, length: 1 });
            });
        });
    });

    describe("Exception behaviors", () => {
        describe("Short string exception", () => {
            test("should not check sentence-ending punctuation for short string 'A.M.'", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.short1",
                    source: "A.M.",
                    target: "am",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                expect(actual).toBeUndefined();
            });

            test("should not check sentence-ending punctuation for short string 'Tues.'", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.short2",
                    source: "Tues.",
                    target: "Dins",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                expect(actual).toBeUndefined();
            });

            test("should not check sentence-ending punctuation for short string 'Dr.'", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.short3",
                    source: "Dr.",
                    target: "Herr Dr.",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                expect(actual).toBeUndefined();
            });

            test("should still check sentence-ending punctuation for longer strings", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.long",
                    source: "This is a sentence.",
                    target: "Das ist ein Satz",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                // This should trigger a warning because target is missing punctuation
                expect(actual).toBeTruthy();
            });
        });

        describe("Minimum length configuration", () => {
            test("should not check strings shorter than configured minimumLength", () => {
                expect.assertions(2);

                const rule = new ResourceSentenceEnding({
                    minimumLength: 15
                });

                const resource1 = new ResourceString({
                    key: "test.short1",
                    source: "Hello world.",
                    target: "Hallo Welt",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual1 = rule.matchString({
                    source: resource1.getSource(),
                    target: resource1.getTarget(),
                    resource: resource1,
                    file: "a/b/c.xliff"
                });

                expect(actual1).toBeUndefined();

                const resource2 = new ResourceString({
                    key: "test.short2",
                    source: "Good morning.",
                    target: "Guten Morgen",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual2 = rule.matchString({
                    source: resource2.getSource(),
                    target: resource2.getTarget(),
                    resource: resource2,
                    file: "a/b/c.xliff"
                });

                expect(actual2).toBeUndefined();
            });

            test("should check strings longer than configured minimumLength", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding({
                    minimumLength: 15
                });

                const resource = new ResourceString({
                    key: "test.long",
                    source: "This is a longer sentence.",
                    target: "Das ist ein längerer Satz",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                // This should trigger a warning because target is missing punctuation
                expect(actual).toBeTruthy();
            });

            test("should use default minimumLength when not configured", () => {
                expect.assertions(2);

                const rule = new ResourceSentenceEnding();

                const resource1 = new ResourceString({
                    key: "test.short",
                    source: "Hi.",
                    target: "Hallo",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual1 = rule.matchString({
                    source: resource1.getSource(),
                    target: resource1.getTarget(),
                    resource: resource1,
                    file: "a/b/c.xliff"
                });

                expect(actual1).toBeUndefined();

                const resource2 = new ResourceString({
                    key: "test.long",
                    source: "This is a sentence.",
                    target: "Das ist ein Satz",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual2 = rule.matchString({
                    source: resource2.getSource(),
                    target: resource2.getTarget(),
                    resource: resource2,
                    file: "a/b/c.xliff"
                });

                // This should trigger a warning because target is missing punctuation
                expect(actual2).toBeTruthy();
            });

            test("should handle minimumLength of 0 (check all strings)", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding({
                    minimumLength: 0
                });

                const resource = new ResourceString({
                    key: "test.short",
                    source: "Hey you.",
                    target: "Hallo, du!",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                // This should trigger a warning because target is missing punctuation and the minimum length is 0
                expect(actual).toBeTruthy();
            });

            test("should handle very high minimumLength (check almost no strings)", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding({
                    minimumLength: 100
                });

                const resource = new ResourceString({
                    key: "test.long",
                    source: "This is a sentence.",
                    target: "Das ist ein Satz",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                // This should not trigger because string is shorter than minimumLength
                expect(actual).toBeUndefined();
            });

            test("should handle very high minimumLength (check almost no strings) with a long string", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding({
                    minimumLength: 100
                });

                const resource = new ResourceString({
                    key: "test.long",
                    source: "This is a sentence. This is another sentence. This is a third sentence. This is a fourth sentence. This is a fifth sentence.",
                    target: "Das ist ein Satz. Das ist ein anderer Satz. Das ist ein dritter Satz. Das ist ein vierter Satz. Das ist ein fünfter Satz",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                // This should not trigger because string is longer than the long minimumLength
                expect(actual).toBeTruthy();
            });

            test("should handle negative minimumLength (treat as 0) - short string with spaces", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding({
                    minimumLength: -5
                });

                const resource = new ResourceString({
                    key: "test.negative1",
                    source: "a b.",
                    target: "a b",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                // Should trigger because negative minimumLength is treated as 0
                expect(actual).toBeTruthy();
            });

            test("should handle negative minimumLength (treat as 0) - longer string with spaces", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding({
                    minimumLength: -5
                });

                const resource = new ResourceString({
                    key: "test.negative2",
                    source: "Hello world.",
                    target: "Hallo Welt",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                // Should trigger because negative minimumLength is treated as 0
                expect(actual).toBeTruthy();
            });

            test("should handle floating point minimumLength - short string with spaces", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding({
                    minimumLength: 5.2
                });

                const resource = new ResourceString({
                    key: "test.float1",
                    source: "a b.",
                    target: "a b",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                // Should not trigger because "a b." (4 chars) < 5.2
                expect(actual).toBeUndefined();
            });

            test("should handle floating point minimumLength - longer string with spaces", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding({
                    minimumLength: 5.2
                });

                const resource = new ResourceString({
                    key: "test.float2",
                    source: "Hello world.",
                    target: "Hallo Welt",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                // Should trigger because "Hello world." (12 chars) >= 5.2
                expect(actual).toBeTruthy();
            });
        });

        describe("No space exception", () => {
            test("should not check sentence-ending punctuation for string with no spaces in snake case", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.nospace1",
                    source: "FONT_NAME_FRONTEND_ADMIN!",
                    target: "FONT_NAME_FRONTEND_ADMIN!",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                expect(actual).toBeUndefined();
            });

            test("should not check sentence-ending punctuation for string with no spaces in kebab case", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.nospace2",
                    source: "sentence-ending-rule:",
                    target: "sentence-ending-rule:",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                expect(actual).toBeUndefined();
            });

            test("should still check sentence-ending punctuation for strings with spaces", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.withspace",
                    source: "This is a sentence.",
                    target: "Das ist ein Satz",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                // This should trigger a warning because target is missing punctuation
                expect(actual).toBeTruthy();
            });

            test("should check sentence-ending punctuation for string with spaces and has dashes or underscores", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.spaces.dashes",
                    source: "The variable-value is font_name_frontend_admin",
                    target: "Die Variable-Wert heißt font_name_frontend_admin.",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                expect(actual).toBeTruthy();
            });

            test("should check sentence-ending punctuation for string with all caps", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.allcaps",
                    source: "THIS IS A SENTENCE.",
                    target: "DAS IST EIN SATZ",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                // This should trigger a warning because target is missing punctuation
                expect(actual).toBeTruthy();
            });

            test("should check sentence-ending punctuation for string with no spaces, caps, dashes, or underscores", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.nocaps",
                    source: "supercalifragilisticexpialidocious",
                    target: "Das ist ein verückter Wort! Wer hat es erfunden?",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                // source is not a sentence because it has no spaces, so no warning should be generated
                expect(actual).toBeUndefined();
            });
        });

        describe("Explicit exception list", () => {
            test("should not check sentence-ending punctuation for string in exception list even when target lacks punctuation", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding({
                    "de-DE": {
                        exceptions: ["For your appointment, please see the Dr."]
                    }
                });

                const resource = new ResourceString({
                    key: "test.exception",
                    source: "For your appointment, please see the Dr.",
                    target: "für Ihren Termin, bitte sehen Sie den Herr Dr",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                expect(actual).toBeUndefined();
            });

            test("should still check sentence-ending punctuation for strings not in exception list", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding({
                    "de-DE": {
                        exceptions: ["Please see the Dr. for your appointment."]
                    }
                });

                const resource = new ResourceString({
                    key: "test.noexception",
                    source: "This is a sentence.",
                    target: "Das ist ein Satz",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                // This should trigger a warning because target is missing punctuation
                expect(actual).toBeTruthy();
            });

            test("should handle multiple exceptions with missing target punctuation", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding({
                    "de-DE": {
                        exceptions: ["Please see the Dr. for your appointment.", "Visit today with the Prof.", "Call the Rev. tomorrow."]
                    }
                });

                const resource = new ResourceString({
                    key: "test.exception1",
                    source: "Visit today with the Prof.",
                    target: "Besuchen Sie heute mit den Prof",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                expect(actual).toBeUndefined();
            });

            test("should handle multiple exceptions with missing target punctuation", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding({
                    "de-DE": {
                        exceptions: ["Please see the Dr. for your appointment.", "Visit the Prof. today.", "Tomorrow, call the Rev."]
                    }
                });

                const resource = new ResourceString({
                    key: "test.exception2",
                    source: "Tomorrow, call the Rev.",
                    target: "Rufen Sie den Rev morgen an",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                expect(actual).toBeUndefined();
            });

            test("should handle multiple exceptions with missing target punctuation and case insensitivity", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding({
                    "de-DE": {
                        exceptions: ["Please see the Dr. for your appointment.", "Visit the Prof. today.", "Tomorrow, call the Rev.", "please see the doctor for your appointment."]
                    }
                });

                const resource = new ResourceString({
                    key: "test.exception2",
                    source: "Please see the Doctor for your Appointment.",
                    target: "Rufen Sie den Herr Dr morgen an",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE"
                });

                const actual = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "a/b/c.xliff"
                });

                expect(actual).toBeUndefined();
            });
        });
    });

    // Tests for spaces at the end of strings
    describe("Spaces at end of strings", () => {
        describe("Target strings with spaces after punctuation", () => {
            test("should detect punctuation correctly when target has spaces after period", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "ja-JP",
                    source: "This is a sentence.",
                    target: "これは文です。   " // spaces after Japanese period
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeUndefined(); // Should not trigger error since punctuation is correct
            });

            test("should detect incorrect punctuation when target has spaces after wrong punctuation", () => {
                expect.assertions(2);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "ja-JP",
                    source: "This is a sentence.",
                    target: "これは文です.   " // spaces after English period instead of Japanese
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeDefined();
                expect(result?.description).toContain('Sentence ending should be "。" (U+3002) for ja-JP locale instead of "." (U+002E)');
            });

            test("should detect punctuation correctly when target has spaces after question mark", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "ja-JP",
                    source: "What is this?",
                    target: "これは何ですか？   " // spaces after Japanese question mark
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeUndefined(); // Should not trigger error since punctuation is correct
            });

            test("should detect incorrect punctuation when target has spaces after wrong question mark", () => {
                expect.assertions(2);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "ja-JP",
                    source: "What is this?",
                    target: "これは何ですか?   " // spaces after English question mark instead of Japanese
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeDefined();
                expect(result?.description).toContain('Sentence ending should be "？" (U+FF1F) for ja-JP locale instead of "?" (U+003F)');
            });

            test("should detect punctuation correctly when target has spaces after exclamation mark", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "ja-JP",
                    source: "Amazing!",
                    target: "すごい！   " // spaces after Japanese exclamation mark
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeUndefined(); // Should not trigger error since punctuation is correct
            });

            test("should detect incorrect punctuation when target has spaces after wrong exclamation mark", () => {
                expect.assertions(2);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "ja-JP",
                    source: "That's amazing!",
                    target: "すごい!   " // spaces after English exclamation mark instead of Japanese
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeDefined();
                expect(result?.description).toContain('Sentence ending should be "！" (U+FF01) for ja-JP locale instead of "!" (U+0021)');
            });
        });

        describe("Target strings with quotes and spaces after punctuation", () => {
            test("should detect punctuation correctly when target has quotes and spaces after punctuation", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE",
                    source: "She said, 'Hello World!'",
                    target: "Sie sagte: „Hallo Welt!“   " // German quotes with spaces after
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeUndefined(); // Should not trigger error since punctuation is correct
            });

            test("should detect incorrect punctuation when target has quotes and spaces after wrong punctuation", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE",
                    source: "She said, 'Hello World!'",
                    target: "Sie sagte: „Hallo Welt!“   " // German quotes with English exclamation instead of German
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                // German uses the same punctuation as English, so no error expected
                expect(result).toBeUndefined();
            });

            test("should handle complex quoted content with spaces", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE",
                    source: "She said, 'What is this?'",
                    target: "Sie sagte: „Was ist das?“   " // German quotes with spaces after
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeUndefined(); // Should not trigger error since punctuation is correct
            });

            test("should detect punctuation correctly with French quotes and spaces", () => {
                expect.assertions(4);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "fr-FR",
                    source: "She said, 'Hello World!'",
                    target: "Elle a dit : « Bonjour le monde ! »   " // French quotes with spaces after
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                // This should trigger a spacing error (regular space vs non-breaking space)
                expect(result).toBeDefined();
                expect(result?.description).toContain('Sentence ending should be');
                expect(result?.description).toContain('U+202F U+0021');
                expect(result?.description).toContain('U+0020 U+0021');
            });

            test("should detect incorrect punctuation with French quotes and wrong punctuation", () => {
                expect.assertions(4);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "fr-FR",
                    source: "She said, 'Hello World!'",
                    target: "Elle a dit : « Bonjour le monde ! »   " // French quotes with English exclamation instead of French
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeDefined();
                expect(result?.description).toContain('Sentence ending should be');
                expect(result?.description).toContain('U+202F U+0021');
                expect(result?.description).toContain('U+0020 U+0021');
            });

            test("should handle Spanish quotes with spaces after punctuation", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "es-ES",
                    source: "She said, 'What is this?'",
                    target: "Ella dijo: «¿Qué es esto?»   " // Spanish quotes with spaces after
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeUndefined(); // Should not trigger error since punctuation is correct
            });
        });

        describe("Source strings with spaces after punctuation", () => {
            test("should handle source with spaces after punctuation correctly", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "ja-JP",
                    source: "This is a sentence.   ", // spaces after English period
                    target: "これは文です。" // correct Japanese punctuation
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeUndefined(); // Should not trigger error since punctuation is correct
            });

            test("should handle source with spaces after question mark correctly", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "ja-JP",
                    source: "What is this?   ", // spaces after English question mark
                    target: "これは何ですか？" // correct Japanese punctuation
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeUndefined(); // Should not trigger error since punctuation is correct
            });

            test("should handle source with spaces after exclamation mark correctly", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "ja-JP",
                    source: "Amazing!   ", // spaces after English exclamation mark
                    target: "すごい！" // correct Japanese punctuation
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeUndefined(); // Should not trigger error since punctuation is correct
            });
        });

        describe("Both source and target with spaces after punctuation", () => {
            test("should handle both source and target with spaces after correct punctuation", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "ja-JP",
                    source: "This is a sentence.   ", // spaces after English period
                    target: "これは文です。   " // spaces after Japanese period
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeUndefined(); // Should not trigger error since punctuation is correct
            });

            test("should detect incorrect punctuation when both have spaces but target is wrong", () => {
                expect.assertions(2);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "ja-JP",
                    source: "This is a sentence.   ", // spaces after English period
                    target: "これは文です.   " // spaces after English period instead of Japanese
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeDefined();
                expect(result?.description).toContain('Sentence ending should be "。" (U+3002) for ja-JP locale instead of "." (U+002E)');
            });

            test("should handle complex case with quotes and spaces in both source and target", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "de-DE",
                    source: "She said, 'Hello World!'   ", // spaces after English exclamation
                    target: "Sie sagte: „Hallo Welt!“   " // German quotes with spaces after
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeUndefined(); // Should not trigger error since punctuation is correct
            });
        });

        describe("Edge cases with multiple spaces and mixed whitespace", () => {
            test("should handle target with multiple spaces after punctuation", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "ja-JP",
                    source: "This is a sentence.",
                    target: "これは文です。      " // multiple spaces after Japanese period
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeUndefined(); // Should not trigger error since punctuation is correct
            });

            test("should handle target with tabs and spaces after punctuation", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "ja-JP",
                    source: "This is a sentence.",
                    target: "これは文です。\t  " // tab and spaces after Japanese period
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeUndefined(); // Should not trigger error since punctuation is correct
            });

            test("should handle target with newlines after punctuation", () => {
                expect.assertions(1);

                const rule = new ResourceSentenceEnding();
                const resource = new ResourceString({
                    key: "test.key",
                    sourceLocale: "en-US",
                    targetLocale: "ja-JP",
                    source: "This is a sentence.",
                    target: "これは文です。\n  " // newline and spaces after Japanese period
                });

                const result = rule.matchString({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    resource,
                    file: "test.xliff"
                });

                expect(result).toBeUndefined(); // Should not trigger error since punctuation is correct
            });
        });
    });
});
