/*
 * Name_da.test.js - test the name object in Danish
 *
 * Copyright © 2013-2015,2017,2022 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Udaess required by applicable law or agreed to in writing, software
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

describe("Name_da", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("da-DK");
        }
    });

    test("should parse a simple Danish name", () => {
        expect.assertions(2);
        const parsed = new Name("Maren Jensdatter", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Maren",
            familyName: "Jensdatter"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Danish name with given, middle, and family parts", () => {
        expect.assertions(2);
        const parsed = new Name("Jan Michael Jensdatter", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Jensdatter"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Danish name with an adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Jan Michael Jensdatter", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Jensdatter"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Danish name with multiple adjuncts", () => {
        expect.assertions(2);
        const parsed = new Name("Jan Michael Jensdatter", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jan",
            familyName: "Jensdatter"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a hyphenated Danish name", () => {
        expect.assertions(2);
        const parsed = new Name("Jan Michael Bergische-Jensdatter", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Bergische-Jensdatter"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Danish name with four parts", () => {
        expect.assertions(2);
        const parsed = new Name("Jan Michael Jürgen Jensdatter", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jan",
            middleName: "Michael Jürgen",
            familyName: "Jensdatter"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Danish name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Dr. Jan Jensdatter", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Dr.",
            givenName: "Jan",
            familyName: "Jensdatter"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Danish name with an honorific", () => {
        expect.assertions(2);
        const parsed = new Name("Fru Julia Jensdatter", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Fru",
            givenName: "Julia",
            familyName: "Jensdatter"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Danish name", () => {
        expect.assertions(2);
        const parsed = new Name("Præsident Jan Michael Jürgen Jensdatter Jr.", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Præsident",
            givenName: "Jan",
            middleName: "Michael Jürgen",
            familyName: "Jensdatter",
            suffix: "Jr."
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Danish name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Jensdatter"
        });
        let fmt = new NameFmt({style: "short", locale: 'da-DK'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Jan Jensdatter";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Danish name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Jensdatter"
        });
        let fmt = new NameFmt({style: "medium", locale: 'da-DK'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Jan Michael Jensdatter";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Danish name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Jensdatter"
        });
        let fmt = new NameFmt({style: "long", locale: 'da-DK'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Jan Michael Jensdatter";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Danish name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Jensdatter"
        });
        let fmt = new NameFmt({style: "full", locale: 'da-DK'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Jan Michael Jensdatter";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Danish name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "Jensdatter",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "short", locale: 'da-DK'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Jan Jensdatter";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Danish name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "Jensdatter",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "medium", locale: 'da-DK'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Jan Michael Pieter Jensdatter";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Danish name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "Jensdatter",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "long", locale: 'da-DK'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Dr. Jan Michael Pieter Jensdatter";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Danish name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "Jensdatter",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "full", locale: 'da-DK'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Dr. Jan Michael Pieter Jensdatter III";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in short style with Danish formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "short", locale: 'da-DK'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style with Danish formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "medium", locale: 'da-DK'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style with Danish formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "long", locale: 'da-DK'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in full style with Danish formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "full", locale: 'da-DK'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

    test("should parse a simple Danish name (alternate)", () => {
        expect.assertions(2);
        const parsed = new Name("Raeburn van Buren", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Raeburn",
            familyName: "van Buren"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Danish name with an adjunct (alternate)", () => {
        expect.assertions(2);
        const parsed = new Name("Humphrey Dallas Bogart", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Humphrey",
            middleName: "Dallas",
            familyName: "Bogart"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Danish name", () => {
        expect.assertions(2);
        const parsed = new Name("Armin", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Armin",
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Danish name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("meneer Raeburn van Buren", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "meneer",
            familyName: "van Buren"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a hyphenated Danish name (alternate)", () => {
        expect.assertions(2);
        const parsed = new Name("Raeburn van Buren", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Raeburn",
            familyName: "van Buren"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Danish name with four parts (alternate)", () => {
        expect.assertions(2);
        const parsed = new Name("Raeburn Jürgen van Buren", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Raeburn",
            middleName: "Jürgen",
            familyName: "van Buren"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Danish name with a title (alternate)", () => {
        expect.assertions(2);
        const parsed = new Name("meneer Dr. Raeburn van Buren", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "meneer Dr.",
            givenName: "Raeburn",
            familyName: "van Buren"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Danish name with a title (second alternate)", () => {
        expect.assertions(2);
        const parsed = new Name("meneer Dr. Raeburn van Buren", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "meneer Dr.",
            givenName: "Raeburn",
            familyName: "van Buren"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Danish title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("meneer van Buren", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "meneer",
            familyName: "van Buren"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Danish name with an honorific (alternate)", () => {
        expect.assertions(2);
        const parsed = new Name("Fr. Julia Maier", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Fr.",
            givenName: "Julia",
            familyName: "Maier"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Danish name (alternate)", () => {
        expect.assertions(2);
        const parsed = new Name("guvernør Raeburn Jürgen van Buren pensioneret", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "guvernør",
            givenName: "Raeburn",
            middleName: "Jürgen",
            familyName: "van Buren",
            suffix: "pensioneret"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Danish name with a compound honorific", () => {
        expect.assertions(2);
        const parsed = new Name("Mr. Buren", {locale: 'da-DK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Mr.",
            familyName: "Buren"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Danish name in short style (alternate)", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Raeburn",
            middleName: "Michael",
            familyName: "van Buren"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Raeburn van Buren";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Danish name in medium style (alternate)", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Raeburn",
            familyName: "van Buren"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Raeburn van Buren";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Danish name in long style (alternate)", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Raeburn",
            familyName: "van Buren",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Raeburn van Buren";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Danish name in full style (alternate)", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "meneer Dr.",
            givenName: "Raeburn",
            familyName: "van Buren",
            suffix: "pensioneret"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "meneer Dr. Raeburn van Buren pensioneret";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Danish name in short style (alternate)", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "meneer Dr.",
            givenName: "Raeburn",
            middleName: "Michael Uwe",
            familyName: "von van Buren",
            suffix: "pensioneret"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Raeburn von van Buren";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Danish name in long style (alternate)", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "meneer Dr.",
            givenName: "Raeburn",
            middleName: "Michael Uwe",
            familyName: "von van Buren",
            suffix: "pensioneret"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "meneer Dr. Raeburn Michael Uwe von van Buren pensioneret";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in short style with Danish formatter (alternate)", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style with Danish formatter (alternate)", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style with Danish formatter (alternate)", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'da-DK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

});
