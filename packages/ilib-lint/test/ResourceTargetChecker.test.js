/*
 * ResourceTargetChecker.test.js - test the built-in regular-expression-based rules
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
import { regexRules } from '../src/plugins/BuiltinPlugin.js';

import { Result } from 'ilib-lint-common';

function findRuleDefinition(name) {
    return regexRules.find(rule => rule.name === name);
}

describe("testResourceTargetChecker", () => {
    test("ResourceNoFullwidthLatin", () => {
        expect.assertions(9);

        const rule = new ResourceTargetChecker(regexRules[2]);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: 'Upload to Box',
            targetLocale: "ja-JP",
            target: "Ｂｏｘにアップロード",
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
        expect(actual[0].description).toBe("The full-width characters 'Ｂｏｘ' are not allowed in the target string. Use ASCII letters instead.");
        expect(actual[0].highlight).toBe("Target: <e0>Ｂｏｘ</e0>にアップロード");
        expect(actual[0].source).toBe('Upload to Box');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNoFullwidthLatinArray", () => {
        expect.assertions(9);

        const rule = new ResourceTargetChecker(regexRules[2]);
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: [
                'Upload to Box'
            ],
            targetLocale: "ja-JP",
            target: [
                "Ｂｏｘにアップロード"
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
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("The full-width characters 'Ｂｏｘ' are not allowed in the target string. Use ASCII letters instead.");
        expect(actual[0].highlight).toBe("Target: <e0>Ｂｏｘ</e0>にアップロード");
        expect(actual[0].source).toBe('Upload to Box');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNoFullwidthLatinPlural", () => {
        expect.assertions(9);

        const rule = new ResourceTargetChecker(regexRules[2]);
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: {
                one: 'Upload it',
                other: 'Upload to Box'
            },
            targetLocale: "ja-JP",
            target: {
                other: "Ｂｏｘにアップロード"
            },
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource().other,
            target: resource.getTarget().other,
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("The full-width characters 'Ｂｏｘ' are not allowed in the target string. Use ASCII letters instead.");
        expect(actual[0].highlight).toBe("Target: <e0>Ｂｏｘ</e0>にアップロード");
        expect(actual[0].source).toBe('Upload to Box');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNoFullwidthLatinSuccess", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(regexRules[2]);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: 'Upload to Box',
            targetLocale: "ja-JP",
            target: "Boxにアップロード",
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

    test("ResourceNoFullwidthLatinSuccessArray", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(regexRules[2]);
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: [
                'Upload to Box'
            ],
            targetLocale: "ja-JP",
            target: [
                "Boxにアップロード"
            ],
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

    test("ResourceNoFullwidthLatinSuccessPlural", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(regexRules[2]);
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: {
                one: "Upload it",
                other: "Upload to Box"
            },
            targetLocale: "ja-JP",
            target: {
                other: "Boxにアップロード"
            },
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

    test("ResourceNoFullwidthLatinMultiple", () => {
        expect.assertions(15);

        const rule = new ResourceTargetChecker(regexRules[2]);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: 'Upload to Box',
            targetLocale: "ja-JP",
            target: "プロＢｏｘにアップロードＢｏｘ",
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
        expect(actual[0].description).toBe("The full-width characters 'Ｂｏｘ' are not allowed in the target string. Use ASCII letters instead.");
        expect(actual[0].highlight).toBe("Target: プロ<e0>Ｂｏｘ</e0>にアップロードＢｏｘ");
        expect(actual[0].source).toBe('Upload to Box');
        expect(actual[0].pathName).toBe("a/b/c.xliff");

        expect(actual[1].severity).toBe("error");
        expect(actual[1].id).toBe("matcher.test");
        expect(actual[1].description).toBe("The full-width characters 'Ｂｏｘ' are not allowed in the target string. Use ASCII letters instead.");
        expect(actual[1].highlight).toBe("Target: プロＢｏｘにアップロード<e0>Ｂｏｘ</e0>");
        expect(actual[1].source).toBe('Upload to Box');
        expect(actual[1].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNoFullwidthDigits", () => {
        expect.assertions(9);

        const rule = new ResourceTargetChecker(regexRules[3]);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: 'Box12345',
            targetLocale: "ja-JP",
            target: "Box１２３４５",
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
        expect(actual[0].description).toBe("The full-width characters '１２３４５' are not allowed in the target string. Use ASCII digits instead.");
        expect(actual[0].highlight).toBe("Target: Box<e0>１２３４５</e0>");
        expect(actual[0].source).toBe('Box12345');
        expect(actual[0].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNoFullwidthDigitsSuccess", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(regexRules[3]);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: 'Upload to Box',
            targetLocale: "ja-JP",
            target: "Boxにアップロード",
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

    test("ResourceNoFullwidthDigitsMultiple", () => {
        expect.assertions(15);

        const rule = new ResourceTargetChecker(regexRules[3]);
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: '12345Box12345',
            targetLocale: "ja-JP",
            target: "５４３２１Box１２３４５",
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
        expect(actual[0].description).toBe("The full-width characters '５４３２１' are not allowed in the target string. Use ASCII digits instead.");
        expect(actual[0].highlight).toBe("Target: <e0>５４３２１</e0>Box１２３４５");
        expect(actual[0].source).toBe('12345Box12345');
        expect(actual[0].pathName).toBe("a/b/c.xliff");

        expect(actual[1].severity).toBe("error");
        expect(actual[1].id).toBe("matcher.test");
        expect(actual[1].description).toBe("The full-width characters '１２３４５' are not allowed in the target string. Use ASCII digits instead.");
        expect(actual[1].highlight).toBe("Target: ５４３２１Box<e0>１２３４５</e0>");
        expect(actual[1].source).toBe('12345Box12345');
        expect(actual[1].pathName).toBe("a/b/c.xliff");
    });

    test("ResourceNoFullwidthPunctuationSubset", () => {
        const illegalPunctuations = ["？", "！", "％"];
        expect.assertions(1 + illegalPunctuations.length * 8);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-fullwidth-punctuation-subset"));
        expect(rule).toBeTruthy();

        for (const symbol of illegalPunctuations) {
            const resource = new ResourceString({
                key: "matcher.test",
                sourceLocale: "en-US",
                source: `test${symbol} test`,
                targetLocale: "ja-JP",
                target: `テスト${symbol} テスト`,
                pathName: "a/b/c.xliff",
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
            expect(actual[0].description).toBe(
                `The full-width characters '${symbol}' are not allowed in the target string. Use ASCII symbols instead.`
            );
            expect(actual[0].highlight).toBe(`Target: テスト<e0>${symbol}</e0> テスト`);
            expect(actual[0].id).toBe("matcher.test");
            expect(actual[0].source).toBe(`test${symbol} test`);
            expect(actual[0].pathName).toBe("a/b/c.xliff");
        }
    });

    test("ResourceNoFullwidthPunctuationSubsetSuccess", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-fullwidth-punctuation-subset"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Really? Yes! 100%",
            targetLocale: "ja-JP",
            target: "本当? はい! 100%",
            pathName: "a/b/c.xliff",
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff",
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceNoFullwidthPunctuationSubsetMultiple", () => {
        expect.assertions(21);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-fullwidth-punctuation-subset"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Really? Yes! 100%",
            targetLocale: "ja-JP",
            target: "本当？ はい！ 100％",
            pathName: "a/b/c.xliff",
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(3);

        for (const a of actual) {
            expect(a.severity).toBe("error");
            expect(a.id).toBe("matcher.test");
            expect(a.source).toBe("Really? Yes! 100%");
            expect(a.pathName).toBe("a/b/c.xliff");
        }

        expect(actual[0].description).toBe(
            "The full-width characters '？' are not allowed in the target string. Use ASCII symbols instead."
        );
        expect(actual[0].highlight).toBe("Target: 本当<e0>？</e0> はい！ 100％");

        expect(actual[1].description).toBe(
            "The full-width characters '！' are not allowed in the target string. Use ASCII symbols instead."
        );
        expect(actual[1].highlight).toBe("Target: 本当？ はい<e0>！</e0> 100％");

        expect(actual[2].description).toBe(
            "The full-width characters '％' are not allowed in the target string. Use ASCII symbols instead."
        );
        expect(actual[2].highlight).toBe("Target: 本当？ はい！ 100<e0>％</e0>");
    });

    test("ResourceNoFullwidthPunctuationSubsetMultipleNotInChinese", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-fullwidth-punctuation-subset"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Really? Yes! 100%",
            targetLocale: "zh-Hant-TW",
            target: "本当？ はい！ 100％",
            pathName: "a/b/c.xliff",
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceNoHalfWidthKana", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-halfwidth-kana-characters"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Communication",
            targetLocale: "ja-JP",
            target: "ｺﾐｭﾆｹｰｼｮﾝ",
            pathName: "a/b/c.xliff",
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toStrictEqual([new Result({
            rule,
            severity: "warning",
            locale: "ja-JP",
            pathName: "a/b/c.xliff",
            source: "Communication",
            id: "matcher.test",
            description: "The half-width kana characters are not allowed in the target string. Use full-width characters.",
            highlight: "Target: <e0>ｺﾐｭﾆｹｰｼｮﾝ</e0>",
        })]);
    });

    test("ResourceNoDoubleByteSpace", () => {
        const illegalCharacters = [
            "\u1680",
            "\u2000",
            "\u2001",
            "\u2002",
            "\u2003",
            "\u2004",
            "\u2005",
            "\u2006",
            "\u2007",
            "\u2008",
            "\u2009",
            "\u200A",
            "\u2028",
            "\u2029",
            "\u202F",
            "\u205F",
            "\u3000",
        ];
        expect.assertions(1 + illegalCharacters.length);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-double-byte-space"));
        expect(rule).toBeTruthy();

        for (const symbol of illegalCharacters) {
            const resource = new ResourceString({
                key: "matcher.test",
                sourceLocale: "en-US",
                source: `test${symbol}test`,
                targetLocale: "ja-JP",
                target: `テスト${symbol}テスト`,
                pathName: "a/b/c.xliff",
            });

            const result = rule.matchString({
                source: resource.getSource(),
                target: resource.getTarget(),
                resource,
                file: "a/b/c.xliff"
            });
            expect(result).toStrictEqual([new Result({
                rule,
                severity: "warning",
                pathName: "a/b/c.xliff",
                locale: "ja-JP",
                source: `test${symbol}test`,
                id: "matcher.test",
                description: "Double-byte space characters should not be used in the target string. Use ASCII symbols instead.",
                highlight: `Target: テスト<e0>${symbol}</e0>テスト`,
            })]);
        }
    });

    test("ResourceNoDoubleByteSpaceNotInChinese", () => {
        const illegalCharacters = [
            "\u1680",
            "\u2000",
            "\u2001",
            "\u2002",
            "\u2003",
            "\u2004",
            "\u2005",
            "\u2006",
            "\u2007",
            "\u2008",
            "\u2009",
            "\u200A",
            "\u2028",
            "\u2029",
            "\u202F",
            "\u205F",
            "\u3000",
        ];
        expect.assertions(1 + illegalCharacters.length);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-double-byte-space"));
        expect(rule).toBeTruthy();

        for (const symbol of illegalCharacters) {
            const resource = new ResourceString({
                key: "matcher.test",
                sourceLocale: "en-US",
                source: `test${symbol}test`,
                targetLocale: "zh-Hans-CN",
                target: `テスト${symbol}テスト`,
                pathName: "a/b/c.xliff",
            });

            const result = rule.matchString({
                source: resource.getSource(),
                target: resource.getTarget(),
                resource,
                file: "a/b/c.xliff"
            });
            expect(!result).toBeTruthy();
        }
    });

    test("ResourceNoSpaceWithFullwidthPunctSpaceAfter", () => {
        const applicableCharacters = [
            "、",
            "。",
            "〈",
            "〉",
            "《",
            "》",
            "「",
            "」",
            "『",
            "』",
            "【",
            "】",
            "〔",
            "〕",
            "〖",
            "〗",
            "〘",
            "〙",
            "〚",
            "〛",
        ];
        expect.assertions(1 + applicableCharacters.length);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-space-with-fullwidth-punctuation"));
        expect(rule).toBeTruthy();

        for (const symbol of applicableCharacters) {
            const illegalSequence = symbol + " ";
            const resource = new ResourceString({
                key: "matcher.test",
                sourceLocale: "en-US",
                source: `test${illegalSequence}test`,
                targetLocale: "ja-JP",
                target: `テスト${illegalSequence}テスト`,
                pathName: "a/b/c.xliff",
            });

            const result = rule.matchString({
                source: resource.getSource(),
                target: resource.getTarget(),
                resource,
                file: "a/b/c.xliff"
            });
            expect(result).toStrictEqual([new Result({
                rule,
                severity: "warning",
                pathName: "a/b/c.xliff",
                locale: "ja-JP",
                source: `test${illegalSequence}test`,
                id: "matcher.test",
                description: `There should be no space adjacent to fullwidth punctuation characters '${illegalSequence}'. Remove it.`,
                highlight: `Target: テスト<e0>${illegalSequence}</e0>テスト`,
            })]);
        }
    });

    test("ResourceNoSpaceWithFullwidthPunctSpaceAfterChinese", () => {
        const applicableCharacters = [
            "、",
            "。",
            "〈",
            "〉",
            "《",
            "》",
            "「",
            "」",
            "『",
            "』",
            "【",
            "】",
            "〔",
            "〕",
            "〖",
            "〗",
            "〘",
            "〙",
            "〚",
            "〛",
        ];
        expect.assertions(1 + applicableCharacters.length);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-space-with-fullwidth-punctuation"));
        expect(rule).toBeTruthy();

        // rule should only apply to Japanese, not Chinese
        for (const symbol of applicableCharacters) {
            const illegalSequence = symbol + " ";
            const resource = new ResourceString({
                key: "matcher.test",
                sourceLocale: "en-US",
                source: `test${illegalSequence}test`,
                targetLocale: "zh-Hans-CN",
                target: `测试${illegalSequence}测试`,
                pathName: "a/b/c.xliff",
            });

            const result = rule.matchString({
                source: resource.getSource(),
                target: resource.getTarget(),
                resource,
                file: "a/b/c.xliff"
            });
            expect(!result).toBeTruthy();
        }
    });

    test("ResourceNoSpaceWithFullwidthPunctSpaceBefore", () => {
        const applicableCharacters = [
            "、",
            "。",
            "〈",
            "〉",
            "《",
            "》",
            "「",
            "」",
            "『",
            "』",
            "【",
            "】",
            "〔",
            "〕",
            "〖",
            "〗",
            "〘",
            "〙",
            "〚",
            "〛",
        ];
        expect.assertions(1 + applicableCharacters.length);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-space-with-fullwidth-punctuation"));
        expect(rule).toBeTruthy();

        for (const symbol of applicableCharacters) {
            const illegalSequence = " " + symbol;
            const resource = new ResourceString({
                key: "matcher.test",
                sourceLocale: "en-US",
                source: `test${illegalSequence}test`,
                targetLocale: "ja-JP",
                target: `テスト${illegalSequence}テスト`,
                pathName: "a/b/c.xliff",
            });

            const result = rule.matchString({
                source: resource.getSource(),
                target: resource.getTarget(),
                resource,
                file: "a/b/c.xliff"
            });
            expect(result).toStrictEqual([new Result({
                rule,
                severity: "warning",
                pathName: "a/b/c.xliff",
                locale: "ja-JP",
                source: `test${illegalSequence}test`,
                id: "matcher.test",
                description: `There should be no space adjacent to fullwidth punctuation characters '${illegalSequence}'. Remove it.`,
                highlight: `Target: テスト<e0>${illegalSequence}</e0>テスト`,
            })]);
        }
    });

    test("ResourceNoSpaceBetweenDoubleAndSingleByteCharacter", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-space-between-double-and-single-byte-character"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Box Embed Widget",
            targetLocale: "ja-JP",
            target: "Box 埋め込みウィジェット",
            pathName: "a/b/c.xliff",
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toStrictEqual([new Result({
            rule,
            severity: "warning",
            locale: "ja-JP",
            pathName: "a/b/c.xliff",
            source: "Box Embed Widget",
            id: "matcher.test",
            description: 'The space character is not allowed in the target string between a double- and single-byte character. Remove the space character.',
            highlight: 'Target: Bo<e0>x 埋</e0>め込みウィジェット',
        })]);
    });

    test("No Space Between Double And Single Byte Character, but not counting punctuation", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-space-between-double-and-single-byte-character"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Box Embed Widget",
            targetLocale: "ja-JP",
            target: "[EXIF] および (XMP) メタデータ",
            pathName: "a/b/c.xliff",
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

    test("ResourceNoSpaceBetweenDoubleAndSingleByteCharacterNotInChinese", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-space-between-double-and-single-byte-character"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Box Embed Widget",
            targetLocale: "zh-Hans-CN",
            target: "Box 埋め込みウィジェット",
            pathName: "a/b/c.xliff",
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!result).toBeTruthy();
    });

    test("No Space Between Double And Single Byte Character Not In Chinese, including with punctuation", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-space-between-double-and-single-byte-character"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Box Embed Widget",
            targetLocale: "zh-Hans-CN",
            target: "[EXIF] および (XMP) メタデータ",
            pathName: "a/b/c.xliff",
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result).toBeFalsy();
    });

    test("ResourceNoSpaceBetweenDoubleAndSingleByteCharacterSuccess", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-space-between-double-and-single-byte-character"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Box Embed Widget",
            targetLocale: "ja-JP",
            target: "EXIFおよびXMPメタデータ",
            pathName: "a/b/c.xliff",
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(!actual).toBeTruthy();
    });
});
