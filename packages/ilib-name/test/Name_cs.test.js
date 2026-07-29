/*
 * testname_cs_CZ.js - test the name object in Czech
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

describe("Name_cs", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("cs-CZ");
        }
    });

    test("should parse a simple Czech name", () => {
        expect.assertions(2);
        const parsed = new Name("Yana Synkova", {locale: 'cs-CZ'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Yana",
            familyName: "Synkova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Czech name with given, middle, and family parts", () => {
        expect.assertions(2);
        const parsed = new Name("Yana Synkova", {locale: 'cs-CZ'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Yana",
            familyName: "Synkova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Czech name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("prezident Yana Synkova", {locale: 'cs-CZ'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "prezident",
            givenName: "Yana",
            familyName: "Synkova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a hyphenated Czech name", () => {
        expect.assertions(2);
        const parsed = new Name("Yana Synkova", {locale: 'cs-CZ'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Yana",
            familyName: "Synkova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Czech name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("prezident Yana Synkova", {locale: 'cs-CZ'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "prezident",
            givenName: "Yana",
            familyName: "Synkova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Czech title (variant)", () => {
        expect.assertions(2);
        const parsed = new Name("předsedkyně Yana Synkova", {locale: 'cs-CZ'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "předsedkyně",
            givenName: "Yana",
            familyName: "Synkova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Czech title with family name and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("viceprezident Yana Synkova", {locale: 'cs-CZ'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "viceprezident",
            givenName: "Yana",
            familyName: "Synkova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Czech name", () => {
        expect.assertions(2);
        const parsed = new Name("dáma Yana Synkova", {locale: 'cs-CZ'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "dáma",
            givenName: "Yana",
            familyName: "Synkova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Czech name with a compound honorific", () => {
        expect.assertions(2);
        const parsed = new Name("šéfkuchař Synkova", {locale: 'cs-CZ'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "šéfkuchař",
            familyName: "Synkova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Czech compound honorific (variant)", () => {
        expect.assertions(2);
        const parsed = new Name("Dr. Synkova", {locale: 'cs-CZ'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Dr.",
            familyName: "Synkova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Czech family name with compound honorific", () => {
        expect.assertions(2);
        const parsed = new Name("Pan a Paní Synkova", {locale: 'cs-CZ'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Pan a Paní",
            familyName: "Synkova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Czech compound honorific (second variant)", () => {
        expect.assertions(2);
        const parsed = new Name("Paní Yana Synkova", {locale: 'cs-CZ'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Paní",
            givenName: "Yana",
            familyName: "Synkova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Czech name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Yana",
            familyName: "Synkova"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Yana Synkova";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Czech name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Yana",
            familyName: "Synkova"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Yana Synkova";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Czech name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Yana",
            familyName: "Synkova",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Yana Synkova";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Czech name in full style (variant)", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Pan",
            givenName: "Yana",
            familyName: "Synkova",
            suffix: "v důchodu"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Pan Yana Synkova v důchodu";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Czech name in full style with suffix", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Paní",
            givenName: "Yana",
            familyName: "Synkova",
            suffix: "v důchodu"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Paní Yana Synkova v důchodu";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Czech name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "prezidentí ministerský předseda",
            givenName: "Yana",
            familyName: "Synkova",
            suffix: "v důchodu"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "prezidentí ministerský předseda Yana Synkova v důchodu";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Czech name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "prezidentí ministerský",
            givenName: "Yana",
            familyName: "von Synkova"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Yana von Synkova";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Czech name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "prezidentí ministerský",
            givenName: "Yana",
            familyName: "von Synkova"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Yana von Synkova";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Czech name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "prezidentí ministerský",
            givenName: "Yana",
            familyName: "von Synkova"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "prezidentí ministerský Yana von Synkova";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in short style with Czech formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style with Czech formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style with Czech formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'cs-CZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

});
