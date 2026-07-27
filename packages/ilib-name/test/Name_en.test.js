/*
 * Name_en.test.js - test the name object in English
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

describe("Name_en", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("en-US");
            await LocaleData.ensureLocale("en-HK");
        }
    });

    test("should parse a simple English name", () => {
        expect.assertions(2);
        const parsed = new Name("John Smith", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "John",
            familyName: "Smith"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an English name with given, middle, and family parts", () => {
        expect.assertions(2);
        const parsed = new Name("John Michael Smith", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "John",
            middleName: "Michael",
            familyName: "Smith"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a hyphenated English name", () => {
        expect.assertions(2);
        const parsed = new Name("John Michael Taylor-Smith", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "John",
            middleName: "Michael",
            familyName: "Taylor-Smith"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an English name with four parts", () => {
        expect.assertions(2);
        const parsed = new Name("John Michael Kevin Smith", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "John",
            middleName: "Michael Kevin",
            familyName: "Smith"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an English name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Dr. John Smith", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Dr.",
            givenName: "John",
            familyName: "Smith"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an English name with an honorific", () => {
        expect.assertions(2);
        const parsed = new Name("Mr. John Smith", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Mr.",
            givenName: "John",
            familyName: "Smith"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an English name with a suffix", () => {
        expect.assertions(2);
        const parsed = new Name("John Smith Jr. Esq.", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "John",
            familyName: "Smith",
            suffix: "Jr. Esq."
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an English name with a suffix containing a comma", () => {
        expect.assertions(2);
        const parsed = new Name("John Smith, PhD", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "John",
            familyName: "Smith",
            suffix: ", PhD"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a European-style multi-part English name", () => {
        expect.assertions(2);
        const parsed = new Name("Pieter van der Meulen", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Pieter",
            familyName: "van der Meulen"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse English name Ben Strong", () => {
        expect.assertions(2);
        const parsed = new Name("Ben Strong", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Ben",
            familyName: "Strong"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete English name", () => {
        expect.assertions(2);
        const parsed = new Name("The Right Honorable Governor General Dr. John Michael Kevin Smith III, DDM", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "The Right Honorable Governor General Dr.",
            givenName: "John",
            middleName: "Michael Kevin",
            familyName: "Smith",
            suffix: "III, DDM"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single English name", () => {
        expect.assertions(2);
        const parsed = new Name("Sting", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Sting"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse English last names only", () => {
        expect.assertions(2);
        const parsed = new Name("Dr. Roberts", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Dr.",
            familyName: "Roberts"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse English compound names", () => {
        expect.assertions(2);
        const parsed = new Name("Mr. and Mrs. Smith", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Mr. and Mrs.",
            familyName: "Smith"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an English compound family name", () => {
        expect.assertions(2);
        const parsed = new Name("John and Mary Smith", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "John and Mary",
            familyName: "Smith"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse English name with by-family option", () => {
        expect.assertions(2);
        const parsed = new Name("The Robertsons", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "The",
            familyName: "Robertsons"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse English name with German auxiliary", () => {
        expect.assertions(2);
        const parsed = new Name("Herbert von Karajan", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Herbert",
            familyName: "von Karajan"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse English name with Dutch auxiliary", () => {
        expect.assertions(2);
        const parsed = new Name("Jan van der Heiden", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jan",
            familyName: "van der Heiden"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse English name with French auxiliary", () => {
        expect.assertions(2);
        const parsed = new Name("Serges du Maurier", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Serges",
            familyName: "du Maurier"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse English name with Italian auxiliary", () => {
        expect.assertions(2);
        const parsed = new Name("Leonardo di Caprio", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Leonardo",
            familyName: "di Caprio"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse English name with Spanish auxiliary", () => {
        expect.assertions(2);
        const parsed = new Name("Jorge de las Cruces", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jorge",
            familyName: "de las Cruces"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse English gibberish as a given name", () => {
        expect.assertions(2);
        const parsed = new Name("Géê ëī a d øö", {locale: 'en-US'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Géê",
            middleName: "ëī a d",
            familyName: "øö"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a normal English (Hong Kong) name", () => {
        expect.assertions(2);
        const parsed = new Name("Chan Ho Yun", {locale: 'en-HK'});
        expect(parsed).toBeTruthy();

        // name in English in Hong Kong are written with Asian order, much like Hungarian
        const expected = {
            givenName: "Ho",
            middleName: "Yun",
            familyName: "Chan"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an English (Hong Kong) name with prefix", () => {
        expect.assertions(2);
        const parsed = new Name("Dr Chan Ho Yun", {locale: 'en-HK'});
        expect(parsed).toBeTruthy();

        // name in English in Hong Kong are written with Asian order, much like Hungarian
        const expected = {
        	prefix: "Dr",
            givenName: "Ho",
            middleName: "Yun",
            familyName: "Chan"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple English name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "John",
            middleName: "Michael",
            familyName: "Smith",
            suffix: ", PhD"
        });
        let fmt = new NameFmt({style: "short", locale: 'en-US'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "John Smith";

        expect(formatted).toBe(expected);
    });

    test("should format a simple English name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "John",
            middleName: "Michael",
            familyName: "Smith",
            suffix: ", PhD"
        });
        let fmt = new NameFmt({style: "medium", locale: 'en-US'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "John Michael Smith";

        expect(formatted).toBe(expected);
    });

    test("should format a simple English name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "John",
            middleName: "Michael",
            familyName: "Smith",
            suffix: ", PhD"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'en-US'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Dr. John Michael Smith";

        expect(formatted).toBe(expected);
    });

    test("should format a simple English name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "John",
            middleName: "Michael",
            familyName: "Smith",
            suffix: ", PhD"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'en-US'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Dr. John Michael Smith, PhD";

        expect(formatted).toBe(expected);
    });

    test("should format a complex English name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Michael Kevin",
            familyName: "von Schmitt",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "short", locale: 'en-US'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "John von Schmitt";

        expect(formatted).toBe(expected);
    });

    test("should format a complex English name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Michael Kevin",
            familyName: "von Schmitt",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "medium", locale: 'en-US'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "John Michael Kevin von Schmitt";

        expect(formatted).toBe(expected);
    });

    test("should format a complex English name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Michael Kevin",
            familyName: "von Schmitt",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "long", locale: 'en-US'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Mr. John Michael Kevin von Schmitt";

        expect(formatted).toBe(expected);
    });

    test("should format a complex English name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Michael Kevin",
            familyName: "von Schmitt",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "full", locale: 'en-US'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Mr. John Michael Kevin von Schmitt III";

        expect(formatted).toBe(expected);
    });

    test("should format an English name with commas in the suffix", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Michael Kevin",
            familyName: "von Schmitt",
            suffix: ", III, PhD"
        });
        let fmt = new NameFmt({style: "full", locale: 'en-US'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Mr. John Michael Kevin von Schmitt, III, PhD";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in short style with English formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "short", locale: 'en-US'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style with English formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "medium", locale: 'en-US'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style with English formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "long", locale: 'en-US'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in full style with English formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "full", locale: 'en-US'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

    test("should format an English name with null parts", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: null,
            givenName: "John",
            middleName: null,
            familyName: "Doe",
            suffix: null
        });

        let fmt = new NameFmt({style: "long", locale: 'en-US'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "John Doe";

        expect(formatted).toBe(expected);
    });

    test("should parse a regular English (Hong Kong) name", () => {
        expect.assertions(2);
        let name = new Name({
            honorific: "Dr",
            givenName: "Min Kee",
            middleName: "John",
            familyName: "Fan",
            suffix: null
        });

        let fmt = new NameFmt({style: "short", locale: 'en-HK'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        // English names in Hong Kong are formatted with family name first, much like Hungarian
        const expected = "Fan Min Kee";

        expect(formatted).toBe(expected);
    });

    test("should format an English (Hong Kong) name in formal short style", () => {
        expect.assertions(2);
        let name = new Name({
            honorific: "Dr",
            givenName: "Min Kee",
            middleName: "John",
            familyName: "Fan",
            suffix: null
        });

        let fmt = new NameFmt({style: "formal_short", locale: 'en-HK'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Dr Fan";

        expect(formatted).toBe(expected);
    });

    test("should format an English (Hong Kong) name in formal long style", () => {
        expect.assertions(2);
        let name = new Name({
            honorific: "Dr",
            givenName: "Min Kee",
            middleName: "John",
            familyName: "Fan",
            suffix: null
        });

        let fmt = new NameFmt({style: "formal_long", locale: 'en-HK'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Dr Fan Min Kee John";

        expect(formatted).toBe(expected);
    });

});
