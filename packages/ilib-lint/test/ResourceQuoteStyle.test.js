/*
 * ResourceQuoteStyle.test.js - test the rule that checks the quote style
 * of the translations
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
import { ResourceString } from 'ilib-tools-common';
import { IntermediateRepresentation, Result, SourceFile } from 'ilib-lint-common';

import ResourceQuoteStyle from "../src/rules/ResourceQuoteStyle.js";
import ResourceFixer from "../src/plugins/resource/ResourceFixer.js";

const sourceFile = new SourceFile("a/b/c.xliff", {});

describe("testResourceQuoteStyle", () => {
    test("ResourceQuoteStyle", () => {
        expect.assertions(1);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();
    });

    test("ResourceQuoteStyleName", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        expect(rule.getName()).toBe("resource-quote-style");
    });

    test("ResourceQuoteStyleDescription", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        expect(rule.getDescription()).toBe("Ensure that the proper quote characters are used in translated resources");
    });

    test("ResourceQuoteStyleSourceLocale", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle({
            sourceLocale: "de-DE"
        });
        expect(rule).toBeTruthy();

        expect(rule.getSourceLocale()).toBe("de-DE");
    });

    test("ResourceQuoteStyleGetRuleType", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle({
            sourceLocale: "de-DE"
        });
        expect(rule).toBeTruthy();

        expect(rule.getRuleType()).toBe("resource");
    });

    test("ResourceQuoteStyleMatchSimpleNative", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains “quotes” in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält 'Anführungszeichen'.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "x"
        });
        // if the source contains native quotes, the target must too
        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quote style for the locale de-DE should be „text“",
            id: "quote.test",
            source: 'This string contains “quotes” in it.',
            highlight: 'Target: Diese Zeichenfolge enthält <e0>\'</e0>Anführungszeichen<e1>\'</e1>.',
            rule,
            locale: "de-DE",
            pathName: "x"
        });
        expect(actual).toEqual(expected);
    });

    test("ResourceQuoteStyleMatchSimpleNative -- apply fix", () => {
        expect.assertions(4);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains “quotes” in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält 'Anführungszeichen'.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "x"
        });
        // if the source contains native quotes, the target must too
        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quote style for the locale de-DE should be „text“",
            id: "quote.test",
            source: 'This string contains “quotes” in it.',
            highlight: 'Target: Diese Zeichenfolge enthält <e0>\'</e0>Anführungszeichen<e1>\'</e1>.',
            rule,
            locale: "de-DE",
            pathName: "x"
        });
        expect(actual).toEqual(expected);
        expect(actual.fix).toBeTruthy();

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });

        const fixer = new ResourceFixer();
        fixer.applyFixes(ir, [actual.fix]);

        expect(resource.getTarget()).toBe("Diese Zeichenfolge enthält „Anführungszeichen“.");
    });

    test("ResourceQuoteStyleMatchSimpleNativeLocaleOnlyOptions", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle({
            param: "localeOnly"
        });
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains “quotes” in it.',
            targetLocale: "de-DE",
            target: 'Diese Zeichenfolge enthält "Anführungszeichen".',
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "x"
        });
        // if the source contains native quotes, the target must too
        const expected = expect.objectContaining({
            severity: "error",
            description: "Quote style for the locale de-DE should be „text“",
            id: "quote.test",
            source: 'This string contains “quotes” in it.',
            highlight: 'Target: Diese Zeichenfolge enthält <e0>"</e0>Anführungszeichen<e1>"</e1>.',
            rule,
            locale: "de-DE",
            pathName: "x"
        });
        expect(actual).toEqual(expected);
    });

    test("ResourceQuoteStyleMatchSimpleNativeLocaleOnlyOptions -- apply fixes", () => {
        expect.assertions(3);

        const rule = new ResourceQuoteStyle({
            param: "localeOnly"
        });
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains “quotes” in it.',
            targetLocale: "de-DE",
            target: 'Diese Zeichenfolge enthält "Anführungszeichen".',
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "x"
        });
        // if the source contains native quotes, the target must too
        const expected = expect.objectContaining({
            severity: "error",
            description: "Quote style for the locale de-DE should be „text“",
            id: "quote.test",
            source: 'This string contains “quotes” in it.',
            highlight: 'Target: Diese Zeichenfolge enthält <e0>"</e0>Anführungszeichen<e1>"</e1>.',
            rule,
            locale: "de-DE",
            pathName: "x"
        });
        expect(actual).toEqual(expected);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });

        const fixer = new ResourceFixer();
        fixer.applyFixes(ir, [actual.fix]);

        expect(resource.getTarget()).toBe("Diese Zeichenfolge enthält „Anführungszeichen“.");
    });

    test("ResourceQuoteStyleMatchAsciiToNative", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält „Anführungszeichen“.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "x"
        });
        // if the source contains ASCII quotes, the target is allowed to have native quotes
        expect(!actual).toBeTruthy();
    });

    test("ResourceQuoteStyleMatchAsciiToNativeRussian", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'Click on "My Documents" to see more',
            targetLocale: "ru-RU",
            target: "Click on «Мои документы» to see more",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "x"
        });
        // if the source contains ASCII quotes, the target is allowed to have native quotes
        expect(!actual).toBeTruthy();
    });

    test("ResourceQuoteStyleMatchBeginEndOfWord", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: '"My Documents"',
            targetLocale: "ru-RU",
            target: "«Мои документы»",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "x"
        });
        // if the source contains ASCII quotes, the target is allowed to have native quotes
        expect(!actual).toBeTruthy();
    });

    test("ResourceQuoteStyleMatchAsciiToNativeJapanese", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'Click on "My Documents" to see more',
            targetLocale: "ja-JP",
            target: "「マイドキュメント」をクリックすると詳細が表示されます",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "x"
        });
        // if the source contains ASCII quotes, the target is allowed to have native quotes
        expect(!actual).toBeTruthy();
    });

    test("ResourceQuoteStyleMatchAsciiToNativeJapanese with square brackets", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'Click on "My Documents" to see more',
            targetLocale: "ja-JP",
            target: "[マイドキュメント]をクリックすると詳細が表示されます",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "x"
        });
        // if the source contains ASCII quotes, the target is allowed to have square brackets
        expect(!actual).toBeTruthy();
    });

    test("ResourceQuoteStyleMatchAsciiAlternateToNativeJapanese", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: "Click on 'My Documents' to see more",
            targetLocale: "ja-JP",
            target: "「マイドキュメント」をクリックすると詳細が表示されます",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "x"
        });
        // if the source contains alternate ASCII quotes, the target is allowed to have main native quotes
        expect(!actual).toBeTruthy();
    });

    test("ResourceQuoteStyleMatchAsciiToNativeJapanese with square brackets", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: "Click on 'My Documents' to see more",
            targetLocale: "ja-JP",
            target: "[マイドキュメント]をクリックすると詳細が表示されます",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "x"
        });
        // if the source contains alternate ASCII quotes, the target is allowed to have square brackets
        expect(!actual).toBeTruthy();
    });

    test("ResourceQuoteStyleMatchAltAsciiQuotesMismatch Japanese", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: "Click on 'My Documents' to see more",
            targetLocale: "ja-JP",
            target: "『マイドキュメント』をクリックすると詳細が表示されます",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // if the source contains alternate quotes, the target should still have main quotes only
        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quote style for the locale ja-JP should be 「text」",
            id: "quote.test",
            source: "Click on 'My Documents' to see more",
            highlight: "Target: <e0>『</e0>マイドキュメント<e1>』</e1>をクリックすると詳細が表示されます",
            rule,
            locale: "ja-JP",
            pathName: "a/b/c.xliff"
        });
        expect(actual).toEqual(expected);
    });

    test("ResourceQuoteStyleMatchAltAsciiQuotesMismatch Japanese -- apply fixes", () => {
        expect.assertions(3);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: "Click on 'My Documents' to see more",
            targetLocale: "ja-JP",
            target: "『マイドキュメント』をクリックすると詳細が表示されます",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // if the source contains alternate quotes, the target should still have main quotes only
        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quote style for the locale ja-JP should be 「text」",
            id: "quote.test",
            source: "Click on 'My Documents' to see more",
            highlight: "Target: <e0>『</e0>マイドキュメント<e1>』</e1>をクリックすると詳細が表示されます",
            rule,
            locale: "ja-JP",
            pathName: "a/b/c.xliff"
        });
        expect(actual).toEqual(expected);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });

        const fixer = new ResourceFixer();
        fixer.applyFixes(ir, [actual.fix]);

        expect(resource.getTarget()).toBe("「マイドキュメント」をクリックすると詳細が表示されます");
    });

    test("ResourceQuoteStyleMatchAltAsciiQuotesMismatch Japanese with primary quotes", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'Click on "My Documents" to see more',
            targetLocale: "ja-JP",
            target: "『マイドキュメント』をクリックすると詳細が表示されます",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // if the source contains regular quotes, the target should still have main quotes only
        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quote style for the locale ja-JP should be 「text」",
            id: "quote.test",
            source: 'Click on "My Documents" to see more',
            highlight: "Target: <e0>『</e0>マイドキュメント<e1>』</e1>をクリックすると詳細が表示されます",
            rule,
            locale: "ja-JP",
            pathName: "a/b/c.xliff"
        });
        expect(actual).toEqual(expected);
    });

    test("ResourceQuoteStyleMatchAltAsciiQuotesMismatch Japanese with primary quotes -- apply fixes", () => {
        expect.assertions(3);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'Click on "My Documents" to see more',
            targetLocale: "ja-JP",
            target: "『マイドキュメント』をクリックすると詳細が表示されます",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // if the source contains regular quotes, the target should still have main quotes only
        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quote style for the locale ja-JP should be 「text」",
            id: "quote.test",
            source: 'Click on "My Documents" to see more',
            highlight: "Target: <e0>『</e0>マイドキュメント<e1>』</e1>をクリックすると詳細が表示されます",
            rule,
            locale: "ja-JP",
            pathName: "a/b/c.xliff"
        });
        expect(actual).toEqual(expected);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        const fixer = new ResourceFixer();
        fixer.applyFixes(ir, [actual.fix]);

        expect(resource.getTarget()).toBe("「マイドキュメント」をクリックすると詳細が表示されます");
    });

    test("ResourceQuoteStyleMatchAsciiQuotes", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "de-DE",
            target: 'Diese Zeichenfolge enthält "Anführungszeichen".',
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

    test("ResourceQuoteStyleMatchAsciiQuotesMismatch", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält 'Anführungszeichen'.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // if the source contains ascii quotes, the target should match
        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quote style for the locale de-DE should be „text“",
            id: "quote.test",
            source: 'This string contains "quotes" in it.',
            highlight: "Target: Diese Zeichenfolge enthält <e0>'</e0>Anführungszeichen<e1>'</e1>.",
            rule,
            locale: "de-DE",
            pathName: "a/b/c.xliff"
        });
        expect(actual).toEqual(expected);
    });

    test("ResourceQuoteStyleMatchAsciiQuotesMismatch -- apply fix", () => {
        expect.assertions(3);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält 'Anführungszeichen'.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // if the source contains ascii quotes, the target should match
        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quote style for the locale de-DE should be „text“",
            id: "quote.test",
            source: 'This string contains "quotes" in it.',
            highlight: "Target: Diese Zeichenfolge enthält <e0>'</e0>Anführungszeichen<e1>'</e1>.",
            rule,
            locale: "de-DE",
            pathName: "a/b/c.xliff"
        });
        expect(actual).toEqual(expected);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });

        const fixer = new ResourceFixer();
        fixer.applyFixes(ir, [actual.fix]);

        expect(resource.getTarget()).toBe("Diese Zeichenfolge enthält „Anführungszeichen“.");
    });

    test("ResourceQuoteStyleMatchAsciiQuotesDutch", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "nl-NL",
            target: "Deze string bevat ‘aanhalingstekens’.",
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

    test("ResourceQuoteStyleMatchAlternate", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains ‘quotes’ in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält 'Anführungszeichen'.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b"
        });
        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quote style for the locale de-DE should be ‚text‘",
            id: "quote.test",
            source: "This string contains ‘quotes’ in it.",
            highlight: 'Target: Diese Zeichenfolge enthält <e0>\'</e0>Anführungszeichen<e1>\'</e1>.',
            rule,
            locale: "de-DE",
            pathName: "a/b"
        });
        expect(actual).toEqual(expected);
    });

    test("ResourceQuoteStyleMatchAlternate -- apply fixes", () => {
        expect.assertions(3);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains ‘quotes’ in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält 'Anführungszeichen'.",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b"
        });
        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quote style for the locale de-DE should be ‚text‘",
            id: "quote.test",
            source: "This string contains ‘quotes’ in it.",
            highlight: 'Target: Diese Zeichenfolge enthält <e0>\'</e0>Anführungszeichen<e1>\'</e1>.',
            rule,
            locale: "de-DE",
            pathName: "a/b"
        });
        expect(actual).toEqual(expected);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });

        const fixer = new ResourceFixer();
        fixer.applyFixes(ir, [actual.fix]);

        expect(resource.getTarget()).toBe("Diese Zeichenfolge enthält ‚Anführungszeichen‘.");
    });

    test("ResourceQuoteStyleMatchAlternate2", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: "Please set your PIN code from 'Menu > PIN Code'.",
            targetLocale: "af-ZA",
            target: 'Stel asseblief u PIN-kode vanaf “Kieslys > PIN-kode”.',
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b"
        });
        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quote style for the locale af-ZA should be ‘text’",
            id: "quote.test",
            source: "Please set your PIN code from 'Menu > PIN Code'.",
            highlight: "Target: Stel asseblief u PIN-kode vanaf <e0>“</e0>Kieslys > PIN-kode<e1>”</e1>.",
            rule,
            locale: "af-ZA",
            pathName: "a/b"
        });

        expect(actual).toEqual(expected);
    });

    test("ResourceQuoteStyleMatchAlternate2 -- apply fixes", () => {
        expect.assertions(3);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: "Please set your PIN code from 'Menu > PIN Code'.",
            targetLocale: "af-ZA",
            target: 'Stel asseblief u PIN-kode vanaf “Kieslys > PIN-kode”.',
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b"
        });
        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quote style for the locale af-ZA should be ‘text’",
            id: "quote.test",
            source: "Please set your PIN code from 'Menu > PIN Code'.",
            highlight: "Target: Stel asseblief u PIN-kode vanaf <e0>“</e0>Kieslys > PIN-kode<e1>”</e1>.",
            rule,
            locale: "af-ZA",
            pathName: "a/b"
        });

        expect(actual).toEqual(expected);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });
        const fixer = new ResourceFixer();
        fixer.applyFixes(ir, [actual.fix]);

        expect(resource.getTarget()).toBe('Stel asseblief u PIN-kode vanaf ‘Kieslys > PIN-kode’.');
    });

    test("ResourceQuoteStyleMatchSimpleNoError", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält „Anführungszeichen“.",
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

    test("ResourceQuoteStyleMatchNoQuotesNoError", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains quotes in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält Anführungszeichen.",
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

    test("ResourceQuoteStyleQuotesAdjacentReplacementParamBracket", () => {
        const rule = new ResourceQuoteStyle();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: `Showing {maxAmount} entries, "{sourceName}" has more.`,
            targetLocale: "fr-FR",
            target: `Affichant {maxAmount} entrées, « {sourceName} » en contient davantage.`,
            pathName: "a/b/c.xliff"
        });

        const result = rule.matchString({
            source: /** @type {string} */ (resource.getSource()),
            target: /** @type {string} */ (resource.getTarget()),
            resource,
            file: "a/b/c.xliff"
        });

        expect(result).toBeFalsy();
    });

    test("ResourceQuoteStyleQuotesAdjacentReplacementParamBracket with fancy quotes in source", () => {
        const rule = new ResourceQuoteStyle();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: `Showing {maxAmount} entries, “{sourceName}” has more.`,
            targetLocale: "fr-FR",
            target: `Affichant {maxAmount} entrées, « {sourceName} » en contient davantage.`,
            pathName: "a/b/c.xliff"
        });

        const result = rule.matchString({
            source: /** @type {string} */ (resource.getSource()),
            target: /** @type {string} */ (resource.getTarget()),
            resource,
            file: "a/b/c.xliff"
        });

        expect(result).toBeFalsy();
    });

    test("ResourceQuoteStyleQuotesAdjacentReplacementParamBracket no quotes in translation", () => {
        expect.assertions(3);
        const rule = new ResourceQuoteStyle();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: `Showing {maxAmount} entries, "{sourceName}" has more.`,
            targetLocale: "fr-FR",
            target: `Affichant {maxAmount} entrées, {sourceName} en contient davantage.`,
            pathName: "a/b/c.xliff"
        });

        const result = rule.matchString({
            source: /** @type {string} */ (resource.getSource()),
            target: /** @type {string} */ (resource.getTarget()),
            resource,
            file: "a/b/c.xliff"
        });

        expect(result).toBeTruthy();

        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quotes are missing in the target. Quote style for the locale fr-FR should be «text»",
            id: "quote.test",
            source: 'Showing {maxAmount} entries, "{sourceName}" has more.',
            highlight: 'Target: Affichant {maxAmount} entrées, {sourceName} en contient davantage.<e0></e0>',
            rule,
            locale: "fr-FR",
            pathName: "a/b/c.xliff"
        });

        expect(result).toEqual(expected);

        // if the target does not contain quotes, then we can't fix it
        expect(result.fix).toBeFalsy();
    });

    test("ResourceQuoteStyleQuotesAdjacentReplacementParamBracket fancy quotes in source and no quotes in translation", () => {
        expect.assertions(3);
        const rule = new ResourceQuoteStyle();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: `Showing {maxAmount} entries, “{sourceName}” has more.`,
            targetLocale: "fr-FR",
            target: `Affichant {maxAmount} entrées, {sourceName} en contient davantage.`,
            pathName: "a/b/c.xliff"
        });

        const result = rule.matchString({
            source: /** @type {string} */ (resource.getSource()),
            target: /** @type {string} */ (resource.getTarget()),
            resource,
            file: "a/b/c.xliff"
        });

        expect(result).toBeTruthy();

        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quotes are missing in the target. Quote style for the locale fr-FR should be «text»",
            id: "quote.test",
            source: 'Showing {maxAmount} entries, “{sourceName}” has more.',
            highlight: 'Target: Affichant {maxAmount} entrées, {sourceName} en contient davantage.<e0></e0>',
            rule,
            locale: "fr-FR",
            pathName: "a/b/c.xliff"
        });

        expect(result).toEqual(expected);

        // if the target does not contain quotes, then we can't fix it
        expect(result.fix).toBeFalsy();
    });

    test("ResourceQuoteStyleQuotesAdjacentReplacementParamBracket with single quotes in source", () => {
        const rule = new ResourceQuoteStyle();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: `Showing {maxAmount} entries, '{sourceName}' has more.`,
            targetLocale: "fr-FR",
            target: `Affichant {maxAmount} entrées, « {sourceName} » en contient davantage.`,
            pathName: "a/b/c.xliff"
        });

        const result = rule.matchString({
            source: /** @type {string} */ (resource.getSource()),
            target: /** @type {string} */ (resource.getTarget()),
            resource,
            file: "a/b/c.xliff"
        });

        expect(result).toBeFalsy();
    });

    test("ResourceQuoteStyleQuotesAdjacentReplacementParamBracket with single quotes in translation", () => {
        const rule = new ResourceQuoteStyle();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: `Showing {maxAmount} entries, '{sourceName}' has more.`,
            targetLocale: "fr-FR",
            target: `Affichant {maxAmount} entrées, '{sourceName}' en contient davantage.`,
            pathName: "a/b/c.xliff"
        });

        const result = rule.matchString({
            source: /** @type {string} */ (resource.getSource()),
            target: /** @type {string} */ (resource.getTarget()),
            resource,
            file: "a/b/c.xliff"
        });

        expect(result).toBeFalsy();
    });

    test("ResourceQuoteStyleFrenchGuillemets", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "fr-FR",
            target: "Le string contient de «guillemets».",
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

    test("ResourceQuoteStyleFrenchGuillemetsWithSpace", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "fr-FR",
            target: "Le string contient de « guillemets ».",
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

    test("ResourceQuoteStyleFrenchGuillemetsWithNoBreakSpace", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "fr-FR",
            target: "Le string contient de « guillemets ».",
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

    test("ResourceQuoteStyleItalianGuillemets", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "it-IT",
            target: 'Questa stringa contiene «virgolette».',
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

    test("ResourceQuoteStyleItalianNoGuillemets", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "it-IT",
            target: 'Questa stringa contiene "virgolette".',
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

    test("ResourceQuoteStyleItalianSkipped", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "it-IT",
            target: "Questa stringa non contiene virgolette.",
            pathName: "a/b/c.xliff"
        });

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });

        const actual = rule.match({
            ir,
            file: "a/b/c.xliff"
        });

        expect(!actual).toBeTruthy();
    });

    test("ResourceQuoteStyleMatchQuotesInTargetOnly", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains quotes in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält „Anführungszeichen“.",
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

    test("ResourceQuoteStyleMatchAlternateNoError", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains ‘quotes’ in it.',
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält ‚Anführungszeichen‘.",
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

    test("ResourceQuoteStyleDontMatchApostrophes", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: "This string doesn't contain quotes in it.",
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält nicht Anführungszeichen.",
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

    test("ResourceQuoteStyleDontMatchMultipleApostrophes", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: "This string doesn't contain quotes in it. The user's keyboard is working",
            targetLocale: "de-DE",
            target: "Diese Zeichenfolge enthält nicht Anführungszeichen. Der Tastenbord des Users funktioniert.",
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

    test("ResourceQuoteStyleApostropheInTarget", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "fr-FR",
            target: "L'expression contient de «guillemets». C'est tres bizarre !",
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

    test("ResourceQuoteStyleApostropheInTargetSpace", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "fr-FR",
            target: "L'expression contient de « guillemets ». C'est tres bizarre !",
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

    test("ResourceQuoteStyleApostropheInTargetWithNBSpace", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "fr-FR",
            target: "L'expression contient de « guillemets ». C'est tres bizarre !",
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

    test("ResourceQuoteStyleApostropheInTargetWithNBSpace and wrong type of quotes", () => {
        expect.assertions(3);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "fr-FR",
            target: "L'expression contient de “ quotations incorrectes ”. C'est tres bizarre !",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();
        // should only complain about the incorrect double quotes and not the apostrophes
        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quote style for the locale fr-FR should be «text»",
            id: "quote.test",
            source: 'This string contains "quotes" in it.',
            highlight: 'Target: L\'expression contient de <e0>“ </e0>quotations incorrectes<e1> ”</e1>. C\'est tres bizarre !',
            rule,
            locale: "fr-FR",
            pathName: "a/b/c.xliff"
        });

        expect(actual).toEqual(expected);
    });

    test("ResourceQuoteStyleApostropheInTargetWithNBSpace and wrong type of quotes -- apply fix", () => {
        expect.assertions(4);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "fr-FR",
            target: "L'expression contient de “ quotations incorrectes ”. C'est tres bizarre !",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        expect(actual).toBeTruthy();

        const expected = expect.objectContaining({
            severity: "warning",
            description: "Quote style for the locale fr-FR should be «text»",
            id: "quote.test",
            source: 'This string contains "quotes" in it.',
            highlight: 'Target: L\'expression contient de <e0>“ </e0>quotations incorrectes<e1> ”</e1>. C\'est tres bizarre !',
            rule,
            locale: "fr-FR",
            pathName: "a/b/c.xliff"
        });

        expect(actual).toEqual(expected);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile
        });

        const fixer = new ResourceFixer();
        fixer.applyFixes(ir, [actual.fix]);

        // should only fix the incorrect double quotes and not the apostrophes
        expect(resource.getTarget()).toBe("L'expression contient de « quotations incorrectes ». C'est tres bizarre !");
    });

    test("ResourceQuoteStyleQuoteApostropheInTargetNoneInSource", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string does not contain quotes in it.',
            targetLocale: "fr-FR",
            target: "L'expression ne contient pas de guillemets.",
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

    test("ResourceQuoteStyleRegularApostropheInTargetNoneInSource", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string does not contain quotes in it.',
            targetLocale: "fr-FR",
            target: "L’expression ne contient pas de guillemets.",
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

    test("ResourceQuoteStyleIgnoreQuoteAsApostropheInSource", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: "This string's contents do not contain quotes in it.",
            targetLocale: "fr-FR",
            target: "L'expression ne contient pas de guillemets.",
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

    test("ResourceQuoteStyleIgnoreRegularApostropheInSource", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: "This string’s contents do not contain quotes in it.",
            targetLocale: "fr-FR",
            target: "L'expression ne contient pas de guillemets.",
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

    test("ResourceQuoteStyleIgnoreRegularApostropheInTarget", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: 'This string contains "quotes" in it.',
            targetLocale: "fr-FR",
            target: "L'expression contient de «guillemets». C'est tres bizarre !",
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

    test("ResourceQuoteStyleIgnorePossessiveApostropheInSource", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: "Maintaining your enterprises' security policies. Let's put another quote char used as an apostrophe in here to see if it triggers an error.",
            targetLocale: "zh-CN",
            target: "维护企业的安全策略。",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger quote style errors because "enterprises'" is a possessive apostrophe, not a quote
        expect(!actual).toBeTruthy();
    });

    test("ResourceQuoteStyleIgnoreContractionApostropheInSource", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: "Don't forget to check the user's settings.",
            targetLocale: "zh-CN",
            target: "不要忘记检查用户的设置。",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.matchString({
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        });
        // Should not trigger quote style errors because "Don't" and "user's" are contractions/possessives, not quotes
        expect(!actual).toBeTruthy();
    });

    test("ResourceQuoteStyleIgnoreSApostropheInSource", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: "These strings' contents do not contain quotes in it.",
            targetLocale: "fr-FR",
            target: "L'expressions ne contient pas de guillemets. Quelqu'un a dit ça. Qu'est-ce que c'est ?",
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

    test("ResourceQuoteStyleIgnoreMissingSwedishQuotes", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            locale: "sv-SE",
            resource: new ResourceString({
                key: "quote.test",
                sourceLocale: "en-US",
                source: `This is a "string."`,
                targetLocale: "sv-SE",
                target: "Det här är ett snöre.",
                pathName: "a/b/c.xliff"
            }),
            file: "x/y"
        });
        expect(!actual).toBeTruthy();
    });

    test("ResourceQuoteStyleSourceOnlyResource", () => {
        expect.assertions(2);

        const rule = new ResourceQuoteStyle();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "quote.test",
            sourceLocale: "en-US",
            source: "These 'strings' contents do not contain quotes in it.",
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
});
