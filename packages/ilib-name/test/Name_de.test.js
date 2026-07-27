/*
 * Name_de.test.js - test the name object in German
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

describe("Name_de", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("de-DE");
        }
    });

    test("should parse a simple German name", () => {
        expect.assertions(2);
        const parsed = new Name("Johan Schmidt", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Johan",
            familyName: "Schmidt"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a German name with given, middle, and family parts", () => {
        expect.assertions(2);
        const parsed = new Name("Johan Michael Schmidt", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Johan",
            middleName: "Michael",
            familyName: "Schmidt"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a German name with an adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Ludwig Klaus von Beethoven", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Ludwig",
            middleName: "Klaus",
            familyName: "von Beethoven"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single German name", () => {
        expect.assertions(2);
        const parsed = new Name("Ludwig", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Ludwig",
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single German name with an adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("von Beethoven", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "von",
            familyName: "Beethoven"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single German name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Herr von Beethoven", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Herr",
            familyName: "von Beethoven"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a German name with multiple adjuncts", () => {
        expect.assertions(2);
        const parsed = new Name("Ludwig von den Wiesthal", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Ludwig",
            familyName: "von den Wiesthal"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a hyphenated German name", () => {
        expect.assertions(2);
        const parsed = new Name("Johan Michael Bergische-Schmidt", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Johan",
            middleName: "Michael",
            familyName: "Bergische-Schmidt"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a German name with four parts", () => {
        expect.assertions(2);
        const parsed = new Name("Johan Michael Jürgen Schmidt", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Johan",
            middleName: "Michael Jürgen",
            familyName: "Schmidt"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a German name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Herr Dr. Johan Schmidt", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Herr Dr.",
            givenName: "Johan",
            familyName: "Schmidt"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a German title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("Herr Schmidt", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Herr",
            familyName: "Schmidt"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a German title with family name and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Herr von Schmidt", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Herr",
            familyName: "von Schmidt"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a German name with an honorific", () => {
        expect.assertions(2);
        const parsed = new Name("Fr. Julia Maier", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Fr.",
            givenName: "Julia",
            familyName: "Maier"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete German name", () => {
        expect.assertions(2);
        const parsed = new Name("Herr Präsident Johan Michael Jürgen Schmidt III", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Herr Präsident",
            givenName: "Johan",
            middleName: "Michael Jürgen",
            familyName: "Schmidt",
            suffix: "III"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a German family name", () => {
        expect.assertions(2);
        const parsed = new Name("Die Maiers", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Die",
            familyName: "Maiers"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a German name with a compound honorific", () => {
        expect.assertions(2);
        const parsed = new Name("Herr und Frau Maier", {locale: 'de-DE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Herr und Frau",
            familyName: "Maier"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple German name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Johan",
            middleName: "Michael",
            familyName: "Schmidt"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'de-DE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Johan Schmidt";

        expect(formatted).toBe(expected);
    });

    test("should format a simple German name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Johan",
            middleName: "Michael",
            familyName: "Schmidt"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'de-DE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Johan Michael Schmidt";

        expect(formatted).toBe(expected);
    });

    test("should format a simple German name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Johan",
            middleName: "Michael",
            familyName: "Schmidt",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'de-DE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Johan Michael Schmidt";

        expect(formatted).toBe(expected);
    });

    test("should format a simple German name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Herr Doktor",
            givenName: "Johan",
            middleName: "Michael",
            familyName: "Schmidt",
            suffix: " MdB"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'de-DE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Herr Doktor Johan Michael Schmidt MdB";

        expect(formatted).toBe(expected);
    });

    test("should format a complex German name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Herr Doktor",
            givenName: "Johan",
            middleName: "Michael Uwe",
            familyName: "von Schmidt",
            suffix: "III"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'de-DE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Johan von Schmidt";

        expect(formatted).toBe(expected);
    });

    test("should format a complex German name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Herr Doktor",
            givenName: "Johan",
            middleName: "Michael Uwe",
            familyName: "von Schmidt",
            suffix: "III"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'de-DE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Johan Michael Uwe von Schmidt";

        expect(formatted).toBe(expected);
    });

    test("should format a complex German name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Herr Doktor",
            givenName: "Johan",
            middleName: "Michael Uwe",
            familyName: "von Schmidt",
            suffix: "III"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'de-DE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Herr Doktor Johan Michael Uwe von Schmidt III";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in short style with German formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'de-DE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style with German formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'de-DE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style with German formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'de-DE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

});
