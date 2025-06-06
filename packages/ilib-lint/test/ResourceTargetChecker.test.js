/*
 * ResourceTargetChecker.test.js - test the built-in regular-expression-based rules
 *
 * Copyright © 2023-2025 JEDLSoft
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

import { IntermediateRepresentation, Result, SourceFile } from 'ilib-lint-common';

import ResourceFixer from '../src/plugins/resource/ResourceFixer.js';

/**
 * Find a rule definition by name in the regexRules array.
 * @param {string} name the name of the rule to find
 * @returns {Object} the rule definition object if found, otherwise undefined
 */
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
            file: "a/b/c.xliff",
            index: 0
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("The full-width characters 'Ｂｏｘ' are not allowed in the target string. Use ASCII letters instead.");
        expect(actual[0].highlight).toBe("Target[0]: <e0>Ｂｏｘ</e0>にアップロード");
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
            file: "a/b/c.xliff",
            category: "other"
        });
        expect(actual).toBeTruthy();
        expect(actual.length).toBe(1);

        expect(actual[0].severity).toBe("error");
        expect(actual[0].id).toBe("matcher.test");
        expect(actual[0].description).toBe("The full-width characters 'Ｂｏｘ' are not allowed in the target string. Use ASCII letters instead.");
        expect(actual[0].highlight).toBe("Target(other): <e0>Ｂｏｘ</e0>にアップロード");
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

    test("ResourceNoFullwidthPunctuation apply fixes correctly", () => {
        expect.assertions(4);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-fullwidth-punctuation-subset"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Really? Yes! 100%",
            targetLocale: "ja-JP",
            target: "本当？ はい！ 100％",
            pathName: "a/b/c.xliff",
            resfile: "a/b/c.xliff"
        });
        const results = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(results).toBeTruthy();
        expect(results.length).toBe(3);
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });
        const fixer = new ResourceFixer();
        fixer.applyFixes(ir, results.map(result => result.fix));

        const fixedResource = ir.getRepresentation()[0];
        expect(fixedResource.getTarget()).toBe("本当? はい! 100%");
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
        expect(result[0]).toEqual(expect.objectContaining({
            rule,
            severity: "warning",
            locale: "ja-JP",
            pathName: "a/b/c.xliff",
            source: "Communication",
            id: "matcher.test",
            description: "The half-width kana characters are not allowed in the target string. Use full-width characters.",
            highlight: "Target: <e0>ｺﾐｭﾆｹｰｼｮﾝ</e0>",
        }));
    });

    test("Apply fixes for the problem with no half width kana", () => {
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

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });
        const fixer = new ResourceFixer();
        fixer.applyFixes(ir, result.map(res => res.fix));

        expect(resource.getTarget()).toBe("コミュニケーション");
    });

    test("ResourceNoDoubleByteSpace", () => {
        const illegalCharacters = "\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029\u202F\u205F\u3000";
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-double-byte-space"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: `test${illegalCharacters}test`,
            targetLocale: "ja-JP",
            target: `テスト${illegalCharacters}テスト`,
            pathName: "a/b/c.xliff",
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(result[0]).toEqual(expect.objectContaining({
            rule,
            severity: "warning",
            pathName: "a/b/c.xliff",
            locale: "ja-JP",
            source: `test${illegalCharacters}test`,
            id: "matcher.test",
            description: "Double-byte space characters should not be used in the target string. Use ASCII symbols instead.",
            highlight: `Target: テスト<e0>${illegalCharacters}</e0>テスト`,
        }));
    });

    test("ResourceNoDoubleByteSpace test rule against array resources", () => {
        const illegalCharacters = "\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029\u202F\u205F\u3000";
        expect.assertions(3);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-double-byte-space"));
        expect(rule).toBeTruthy();

        const resource = new ResourceArray({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: ["foo", `test${illegalCharacters}test`],
            targetLocale: "ja-JP",
            target: ["bar", `テスト${illegalCharacters}テスト`],
            pathName: "a/b/c.xliff",
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "a/b/c.xliff"});
        expect(result).toBeTruthy();
        expect(result).toEqual(expect.objectContaining({
            rule,
            severity: "warning",
            pathName: "a/b/c.xliff",
            locale: "ja-JP",
            source: `test${illegalCharacters}test`,
            id: "matcher.test",
            description: "Double-byte space characters should not be used in the target string. Use ASCII symbols instead.",
            highlight: `Target[1]: テスト<e0>${illegalCharacters}</e0>テスト`,
        }));
    });

    test("ResourceNoDoubleByteSpace test rule against plural resources", () => {
        const illegalCharacters = "\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029\u202F\u205F\u3000";
        expect.assertions(3);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-double-byte-space"));
        expect(rule).toBeTruthy();

        const resource = new ResourcePlural({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: {
                one: "foo",
                other: `test${illegalCharacters}test`
            },
            targetLocale: "ja-JP",
            target: {
                "one": "bar",
                "other": `テスト${illegalCharacters}テスト`
            },
            pathName: "a/b/c.xliff",
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "a/b/c.xliff"});
        expect(result).toBeTruthy();
        expect(result).toEqual(expect.objectContaining({
            rule,
            severity: "warning",
            pathName: "a/b/c.xliff",
            locale: "ja-JP",
            source: `test${illegalCharacters}test`,
            id: "matcher.test",
            description: "Double-byte space characters should not be used in the target string. Use ASCII symbols instead.",
            highlight: `Target(other): テスト<e0>${illegalCharacters}</e0>テスト`,
        }));
    });

    test("apply fixes for no double byte space rule", () => {
        const illegalCharacters = "\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000";
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-double-byte-space"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: `test${illegalCharacters}test`,
            targetLocale: "ja-JP",
            target: `テスト${illegalCharacters}テスト`,
            pathName: "a/b/c.xliff",
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });
        fixer.applyFixes(ir, result.map(res => res.fix));
        const expected = "テスト               テスト"; // 15 spaces to replace the illegal characters
        // should be replaced with a regular ascii space
        expect(resource.getTarget()).toBe(expected);
    });

    test("apply fixes for no double byte space rule in an array resource", () => {
        const illegalCharacters = "\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000";
        expect.assertions(3);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-double-byte-space"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        const resource = new ResourceArray({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: ["foo", `test${illegalCharacters}test`],
            targetLocale: "ja-JP",
            target: ["bar", `テスト${illegalCharacters}テスト`],
            pathName: "a/b/c.xliff",
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "a/b/c.xliff"});
        expect(result).toBeTruthy();
        fixer.applyFixes(ir, [result.fix]);
        // should be replaced with a regular ascii space
        expect(resource.getTarget()).toStrictEqual([
            "bar",
            "テスト               テスト"
        ]);
    });

    test("apply fixes for no double byte space rule in a plural resource", () => {
        const illegalCharacters = "\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000";
        expect.assertions(3);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-double-byte-space"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        const resource = new ResourcePlural({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: {
                one: "foo",
                other: `test${illegalCharacters}test`
            },
            targetLocale: "ja-JP",
            target: {
                "one": "bar",
                "other": `テスト${illegalCharacters}テスト`
            },
            pathName: "a/b/c.xliff",
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });

        const result = rule.match({ir, file: "a/b/c.xliff"});
        expect(result).toBeTruthy();
        fixer.applyFixes(ir, [result.fix]);
        // should be replaced with a regular ascii space
        expect(resource.getTarget()).toStrictEqual({
            "one": "bar",
            "other": "テスト               テスト"
        });
    });

    test("apply fixes for no double byte space rule (line break)", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-double-byte-space"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "test\u2028test",
            targetLocale: "ja-JP",
            target: "テスト\u2028テスト",
            pathName: "a/b/c.xliff",
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });
        fixer.applyFixes(ir, result.map(res => res.fix));
        // should be replaced with a return character
        expect(resource.getTarget()).toBe("テスト\nテスト");
    });

    test("apply fixes for no double byte space rule (paragraph break)", () => {
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-double-byte-space"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "test\u2029test",
            targetLocale: "ja-JP",
            target: "テスト\u2029テスト",
            pathName: "a/b/c.xliff",
        });

        const result = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });
        fixer.applyFixes(ir, result.map(res => res.fix));
        // should be replaced with a double return character
        expect(resource.getTarget()).toBe("テスト\n\nテスト");
    });

    test("ResourceNoDoubleByteSpaceNotInChinese", () => {
        const illegalCharacters = "\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029\u202F\u205F\u3000";
        expect.assertions(2);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-double-byte-space"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: `test${illegalCharacters}test`,
            targetLocale: "zh-Hans-CN",
            target: `テスト${illegalCharacters}テスト`,
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
        expect.assertions(1);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-space-with-fullwidth-punctuation"));
        expect(rule).toBeTruthy();

        test.each(applicableCharacters, (symbol) => {
            expect.assertions(4);
            const resource = new ResourceString({
                key: "matcher.test",
                sourceLocale: "en-US",
                source: `test${symbol} test ${symbol}test`,
                targetLocale: "ja-JP",
                target: `日本語${symbol} 日本語 ${symbol}日本語`, // test spaces before and after the symbol
                pathName: "a/b/c.xliff",
            });

            const results = rule.matchString({
                source: resource.getSource(),
                target: resource.getTarget(),
                resource,
                file: "a/b/c.xliff"
            });
            expect(Array.isArray(results)).toBeTruthy();
            expect(results.length).toBe(2);
            expect(results[0]).toEqual(expect.objectContaining({
                rule,
                severity: "warning",
                pathName: "a/b/c.xliff",
                locale: "ja-JP",
                source: `test${symbol} test ${symbol}test`,
                id: "matcher.test",
                description: `There should be no space adjacent to fullwidth punctuation characters '${symbol} '. Remove it.`,
                highlight: `Target: 日本語<e0>${symbol} </e0>日本語 ${symbol}日本語`,
            }));
            expect(results[1]).toEqual(expect.objectContaining({
                rule,
                severity: "warning",
                pathName: "a/b/c.xliff",
                locale: "ja-JP",
                source: `test${symbol} test ${symbol}test`,
                id: "matcher.test",
                description: `There should be no space adjacent to fullwidth punctuation characters ' ${symbol}'. Remove it.`,
                highlight: `Target: 日本語${symbol} 日本語<e0> ${symbol}</e0>日本語`,
            }));
        });
    });

    test("apply fixes for the no space with fullwidth punct space after rule", () => {
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
        expect.assertions(1);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-space-with-fullwidth-punctuation"));
        expect(rule).toBeTruthy();
        const fixer = new ResourceFixer();

        test.each(applicableCharacters, (symbol) => {
            expect.assertions(1);
            const resource = new ResourceString({
                key: "matcher.test",
                sourceLocale: "en-US",
                source: `test${symbol} test ${symbol}test`,
                targetLocale: "ja-JP",
                target: `日本語${symbol} 日本語 ${symbol}日本語`, // test spaces before and after the symbol
                pathName: "a/b/c.xliff",
            });

            const result = rule.matchString({
                source: resource.getSource(),
                target: resource.getTarget(),
                resource,
                file: "a/b/c.xliff"
            });

            const ir = new IntermediateRepresentation({
                type: "resource",
                ir: [resource],
                sourceFile: new SourceFile("a/b/c.xliff", {}),
                dirty: false
            });
            fixer.applyFixes(ir, result.map(res => res.fix));
            // the spaces should be removed
            expect(resource.getTarget()).toBe(`日本語${symbol}日本語${symbol}日本語`);
        });
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
            expect(result[0]).toEqual(expect.objectContaining({
                rule,
                severity: "warning",
                pathName: "a/b/c.xliff",
                locale: "ja-JP",
                source: `test${illegalSequence}test`,
                id: "matcher.test",
                description: `There should be no space adjacent to fullwidth punctuation characters '${illegalSequence}'. Remove it.`,
                highlight: `Target: テスト<e0>${illegalSequence}</e0>テスト`,
            }));
        }
    });

    test("ResourceNoSpaceBetweenDoubleAndSingleByteCharacter", () => {
        expect.assertions(4);

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

        const results = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(Array.isArray(results)).toBeTruthy();
        expect(results.length).toBe(1);
        const firstResult = results[0];
        expect(firstResult).toEqual(expect.objectContaining({
            rule,
            severity: "warning",
            locale: "ja-JP",
            pathName: "a/b/c.xliff",
            source: "Box Embed Widget",
            id: "matcher.test",
            description: 'The space character is not allowed in the target string between a double- and single-byte character. Remove the space character.',
            highlight: 'Target: Bo<e0>x 埋</e0>め込みウィジェット'
        }));
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

    test("Resource no space between single and double byte character -- fix applied", () => {
        expect.assertions(5);

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

        const results = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(Array.isArray(results)).toBeTruthy();
        expect(results.length).toBe(1);
        const result = results[0];
        expect(result).toEqual(expect.objectContaining({
            rule,
            severity: "warning",
            locale: "ja-JP",
            pathName: "a/b/c.xliff",
            source: "Box Embed Widget",
            id: "matcher.test",
            description: 'The space character is not allowed in the target string between a double- and single-byte character. Remove the space character.',
            highlight: 'Target: Bo<e0>x 埋</e0>め込みウィジェット',
        }));

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });

        const fixer = new ResourceFixer();
        fixer.applyFixes(ir, results.map(res => res.fix));

        expect(resource.getTarget()).toBe("Box埋め込みウィジェット");
    });

    test("Resource no space between double and single byte character -- fix applied", () => {
        expect.assertions(5);

        const rule = new ResourceTargetChecker(findRuleDefinition("resource-no-space-between-double-and-single-byte-character"));
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "matcher.test",
            sourceLocale: "en-US",
            source: "Box Embed Widget",
            targetLocale: "ja-JP",
            target: "埋 Boxめ込みウィジェット",
            pathName: "a/b/c.xliff",
        });

        const results = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(Array.isArray(results)).toBeTruthy();
        expect(results.length).toBe(1);
        const result = results[0];
        expect(result).toEqual(expect.objectContaining({
            rule,
            severity: "warning",
            locale: "ja-JP",
            pathName: "a/b/c.xliff",
            source: "Box Embed Widget",
            id: "matcher.test",
            description: 'The space character is not allowed in the target string between a double- and single-byte character. Remove the space character.',
            highlight: 'Target: <e0>埋 B</e0>oxめ込みウィジェット',
        }));

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff", {}),
            dirty: false
        });

        const fixer = new ResourceFixer();
        fixer.applyFixes(ir, results.map(res => res.fix));

        expect(resource.getTarget()).toBe("埋Boxめ込みウィジェット");
    });

});
