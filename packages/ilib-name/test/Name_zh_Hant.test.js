/*
 * testname_zh_Hant.js - test the name object in traditional Chinese
 *
 * Copyright © 2013-2015,2017,2022 JEDLSoft
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

import NameFmt from '../src/NameFmt.js';
import Name from '../src/Name.js';
import { LocaleData } from 'ilib-localedata';
import { getPlatform } from 'ilib-env';

describe("Name_zh_Hant", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("zh-Hant-TW");
            await LocaleData.ensureLocale("zh-Hant-HK");
        }
    });

    test("should parse a simple Traditional Chinese name", () => {
        expect.assertions(2);
        const parsed = new Name("仇潔雲", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "潔雲",
            familyName: "仇"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a one-plus-two Traditional Chinese name", () => {
        expect.assertions(2);
        const parsed = new Name("Jay Chóu", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jay",
            familyName: "Chóu"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a two-plus-one Traditional Chinese name", () => {
        expect.assertions(2);
        const parsed = new Name("褚師迪", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "迪",
            familyName: "褚師"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a two-plus-two Traditional Chinese name", () => {
        expect.assertions(2);
        const parsed = new Name("申屠凱瑩", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "凱瑩",
            familyName: "申屠"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Traditional Chinese maiden plus married name", () => {
        expect.assertions(2);
        const parsed = new Name("錢林慧君", {locale: 'zh-Hant-TW', compoundFamilyName: true});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "慧君",
            familyName: "錢林"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Traditional Chinese name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("老錢慧君", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "老",
            givenName: "慧君",
            familyName: "錢"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Traditional Chinese name with multiple titles", () => {
        expect.assertions(2);
        const parsed = new Name("錢首席執行官", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            familyName: "錢",
            suffix: "首席執行官"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a European-style Traditional Chinese name", () => {
        expect.assertions(2);
        const parsed = new Name("Jackie Chan", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jackie",
            familyName: "Chan"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Traditional Chinese name with a suffix", () => {
        expect.assertions(2);
        const parsed = new Name("王媽媽", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "媽媽",
            familyName: "王"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Traditional Chinese name with title and suffix", () => {
        expect.assertions(2);
        const parsed = new Name("李老師", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "老師",
            familyName: "李"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Traditional Chinese name", () => {
        expect.assertions(2);
        const parsed = new Name("老錢林慧君外公", {locale: 'zh-Hant-TW', compoundFamilyName: true});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "老",
            givenName: "慧君",
            familyName: "錢林",
            suffix: "外公"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a Traditional Chinese name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "short", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format a Traditional Chinese name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "medium", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format a Traditional Chinese name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "long", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸";

        expect(formatted).toBe(expected);
    });

    test("should format a Traditional Chinese name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "full", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

    test("should format a European-style Traditional Chinese name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "John",
            middleName: "Robert",
            familyName: "Goffin",
            suffix: "Jr."
        }, {locale: 'zh-Hant-TW'});
        let fmt = new NameFmt({style: "short", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "John Goffin";

        expect(formatted).toBe(expected);
    });

    test("should format a European-style Traditional Chinese name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "John",
            middleName: "Robert",
            familyName: "Goffin",
            suffix: "Jr."
        }, {locale: 'zh-Hant-TW'});
        let fmt = new NameFmt({style: "medium", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "John Robert Goffin";

        expect(formatted).toBe(expected);
    });

    test("should format a European-style Traditional Chinese name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "John",
            middleName: "Robert",
            familyName: "Goffin",
            suffix: "Jr."
        }, {locale: 'zh-Hant-TW'});
        let fmt = new NameFmt({style: "long", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Dr. John Robert Goffin";

        expect(formatted).toBe(expected);
    });

    test("should format a European-style Traditional Chinese name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "John",
            middleName: "Robert",
            familyName: "Goffin",
            suffix: "Jr."
        }, {locale: 'zh-Hant-TW'});
        let fmt = new NameFmt({style: "full", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Dr. John Robert Goffin Jr.";

        expect(formatted).toBe(expected);
    });

    test("should format a European-style Traditional Chinese name from string in long style", () => {
        expect.assertions(2);
        let name = new Name("Dr. John Robert Goffin", {locale: 'zh-Hant-TW'});
        let fmt = new NameFmt({style: "long", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Dr. John Robert Goffin";

        expect(formatted).toBe(expected);
    });

    test("should format a European-style Traditional Chinese name from string in full style", () => {
        expect.assertions(2);
        let name = new Name("Dr. John Robert Goffin Jr.", {locale: 'zh-Hant-TW'});
        let fmt = new NameFmt({style: "full", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Dr. John Robert Goffin Jr.";

        expect(formatted).toBe(expected);
    });

    test("should parse a Traditional Chinese name with parenthetical suffix", () => {
        expect.assertions(2);
        const parsed = new Name("王永慶(Division A)", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "永慶",
            familyName: "王",
            suffix: "(Division A)"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Traditional Chinese name with parenthetical suffix (2)", () => {
        expect.assertions(2);
        const parsed = new Name("王永慶 (Division A)", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "永慶",
            familyName: "王",
            suffix: " (Division A)"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Traditional Chinese name with parenthetical and other suffix", () => {
        expect.assertions(2);
        const parsed = new Name("王永慶外公(Division A)", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "永慶",
            familyName: "王",
            suffix: "外公(Division A)"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Traditional Chinese name with parenthetical and other suffix (2)", () => {
        expect.assertions(2);
        const parsed = new Name("王永慶外公 (Division A)", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "永慶",
            familyName: "王",
            suffix: "外公 (Division A)"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a Traditional Chinese name with parenthetical suffix in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: null,
            givenName: "永慶",
            middleName: null,
            familyName: "王",
            suffix: "(Division A)"
        });

        let fmt = new NameFmt({style: "short", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "王永慶";

        expect(formatted).toBe(expected);
    });

    test("should format a Traditional Chinese name with parenthetical suffix in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: null,
            givenName: "永慶",
            middleName: null,
            familyName: "王",
            suffix: "(Division A)"
        });

        let fmt = new NameFmt({style: "long", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "王永慶";

        expect(formatted).toBe(expected);
    });

    test("should format a Traditional Chinese name with parenthetical suffix in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: null,
            givenName: "永慶",
            middleName: null,
            familyName: "王",
            suffix: "(Division A)"
        });

        let fmt = new NameFmt({style: "full", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "王永慶(Division A)";

        expect(formatted).toBe(expected);
    });

    test("should format a Traditional Chinese name with parenthetical suffix in long style (2)", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: null,
            givenName: "永慶",
            middleName: null,
            familyName: "王",
            suffix: " (Division A)"
        });

        let fmt = new NameFmt({style: "long", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "王永慶";

        expect(formatted).toBe(expected);
    });

    test("should format a Traditional Chinese name with parenthetical suffix in full style (2)", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: null,
            givenName: "永慶",
            middleName: null,
            familyName: "王",
            suffix: " (Division A)"
        });

        let fmt = new NameFmt({style: "full", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "王永慶 (Division A)";

        expect(formatted).toBe(expected);
    });

    test("should format a Traditional Chinese name with multiple parenthetical suffixes in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: null,
            givenName: "永慶",
            middleName: null,
            familyName: "王",
            suffix: "外公(Division A)"
        });

        let fmt = new NameFmt({style: "short", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "王永慶";

        expect(formatted).toBe(expected);
    });

    test("should format a Traditional Chinese name with multiple parenthetical suffixes in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: null,
            givenName: "永慶",
            middleName: null,
            familyName: "王",
            suffix: "外公(Division A)"
        });

        let fmt = new NameFmt({style: "full", locale: 'zh-Hant-TW'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "王永慶外公(Division A)";

        expect(formatted).toBe(expected);
    });

    test("should parse a Traditional Chinese name with spaced parenthetical suffix", () => {
        expect.assertions(2);
        const parsed = new Name("徐小凤 (Division A)", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "小凤",
            familyName: "徐",
            suffix: " (Division A)"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Traditional Chinese compound family name (3)", () => {
        expect.assertions(2);
        const parsed = new Name("司马小凤", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "小凤",
            familyName: "司马"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Traditional Chinese compound family name (4)", () => {
        expect.assertions(2);
        const parsed = new Name("段干小凤", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "小凤",
            familyName: "段干"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an ambiguous-length Traditional Chinese family name (1)", () => {
        expect.assertions(2);
        const parsed = new Name("鍾小凤", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "小凤",
            familyName: "鍾"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an ambiguous-length Traditional Chinese family name (2)", () => {
        expect.assertions(2);
        const parsed = new Name("鐘離小凤", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "小凤",
            familyName: "鐘離"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Traditional Chinese name with missing parts (1)", () => {
        expect.assertions(2);
        const parsed = new Name("曲小凤", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "小凤",
            familyName: "曲"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Traditional Chinese name with missing parts (2)", () => {
        expect.assertions(2);
        const parsed = new Name("揭小凤", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "小凤",
            familyName: "揭"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Traditional Chinese name with missing parts (3)", () => {
        expect.assertions(2);
        const parsed = new Name("关小凤", {locale: 'zh-Hant-TW'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "小凤",
            familyName: "关"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Traditional Chinese dentist name", () => {
        expect.assertions(2);
        const parsed = new Name("关小凤牙科醫生", {locale: 'zh-Hant-HK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "小凤",
            familyName: "关",
            suffix: "牙科醫生"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Traditional Chinese dental hygienist name", () => {
        expect.assertions(2);
        const parsed = new Name("关小凤牙齒衛生員", {locale: 'zh-Hant-HK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "小凤",
            familyName: "关",
            suffix: "牙齒衛生員"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Hong Kong Traditional Chinese name (1)", () => {
        expect.assertions(2);
        const parsed = new Name("温小凤", {locale: 'zh-Hant-HK'});
        expect(parsed).toBeTruthy();

        // 温 is different than the Taiwanese traditional char for
        // the family name Wen which is 溫
        const expected = {
            givenName: "小凤",
            familyName: "温"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Hong Kong Traditional Chinese name (2)", () => {
        expect.assertions(2);
        const parsed = new Name("區小凤", {locale: 'zh-Hant-HK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "小凤",
            familyName: "區"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Hong Kong Traditional Chinese name (3)", () => {
        expect.assertions(2);
        const parsed = new Name("趙文權", {locale: 'zh-Hant-HK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "文權",
            familyName: "趙"
        };

        expect(parsed).toMatchObject(expected);
    });
});
