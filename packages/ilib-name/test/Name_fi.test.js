/*
 * testname_en.js - test the name object in Finnish
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

describe("Name_fi", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("fi-FI");
        }
    });

    test("should parse a Finnish name with given, middle, and family parts", () => {
        expect.assertions(2);
        const parsed = new Name("Pihla Viitala Mikkeli", {locale: 'fi-FI'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Pihla",
            middleName : "Viitala",
            familyName: "Mikkeli"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Finnish name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("Herra Kertu Mikkeli", {locale: 'fi-FI'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "Herra",
            givenName: "Kertu",
            familyName: "Mikkeli"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Finnish name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Pihla Viitala Mikkeli nuorempi", {locale: 'fi-FI'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix : "nuorempi",
            givenName: "Pihla",
            middleName : "Viitala",
            familyName: "Mikkeli"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Finnish title (variant)", () => {
        expect.assertions(2);
        const parsed = new Name("presidentti Pihla Viitala Mikkeli", {locale: 'fi-FI'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "presidentti",
            givenName: "Pihla",
            middleName : "Viitala",
            familyName: "Mikkeli"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a second Finnish title", () => {
        expect.assertions(2);
        const parsed = new Name("Herra ja Neiti Mikkeli", {locale: 'fi-FI'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "Herra ja Neiti",
            familyName: "Mikkeli"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Finnish title with family name and adjunct", () => {
        expect.assertions(2);

        let name = new Name({
            prefix: "presidentti",
            givenName: "Pihla",
            middleName : "Viitala",
            familyName: "Mikkeli",
            suffix: "vanhempi"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'fi-FI'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "presidentti Pihla Viitala Mikkeli vanhempi";

        expect(formatted).toBe(expected);
    });

    test("should parse a Finnish name with a compound honorific", () => {
        expect.assertions(2);
        const parsed = new Name("presidentti Mikkeli", {locale: 'fi-FI'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "presidentti",
            familyName: "Mikkeli"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Finnish name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Pihla",
            middleName : "Viitala",
            familyName: "Mikkeli"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'fi-FI'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Pihla Mikkeli";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Finnish name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Pihla",
            middleName : "Viitala",
            familyName: "Mikkeli"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'fi-FI'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Pihla Viitala Mikkeli";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Finnish name in full style", () => {
        expect.assertions(2);
        let name = new Name({

            givenName: "Pihla",
            middleName : "Viitala",
            familyName: "Mikkeli",
            suffix: "vanhempi"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'fi-FI'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Pihla Viitala Mikkeli vanhempi";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Finnish name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            suffix: "vanhempi",
            givenName: "Pihla",
            middleName : "Viitala",
            familyName: "Mikkeli"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'fi-FI'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Pihla Mikkeli";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style with Finnish formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'fi-FI'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style with Finnish formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'fi-FI'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

});
