/*
 * Name_hu.test.js - test the name object in Hungarian
 *
 * Copyright © 2013-2015,2017,2022 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICJASE-2.0
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

describe("Name_hu", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("hu-HU");
        }
    });

    test("should parse a simple Hungarian name", () => {
        expect.assertions(2);
        const parsed = new Name("Halász Dorottya", {locale: 'hu-HU'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Dorottya",
            familyName: "Halász"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a simple Hungarian name (1)", () => {
        expect.assertions(2);
        const parsed = new Name("úr. Halász Dorottya", {locale: 'hu-HU'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "úr.",
            givenName: "Dorottya",
            familyName: "Halász"

        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a simple women's Hungarian name", () => {
        expect.assertions(2);
        const parsed = new Name("Kisasszony. Kovács Lajos", {locale: 'hu-HU'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "Kisasszony.",
            givenName: "Lajos",
            familyName: "Kovács"

        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Hungarian name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Halász Dorottya jr.", {locale: 'hu-HU'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix : "jr.",
            givenName: "Dorottya",
            familyName: "Halász"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Hungarian name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("alelnöke Halász Dorottya", {locale: 'hu-HU'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "alelnöke",
                familyName: "Halász",
            givenName: "Dorottya"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Hungarian name with a title (second form)", () => {
        expect.assertions(2);
        const parsed = new Name("Úr. és Kisasszony. Halász", {locale: 'hu-HU'});
        expect(parsed).toBeTruthy();

        const expected = {
            familyName: "Halász",
            prefix: "Úr. és Kisasszony."
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Hungarian title with family name only and adjunct", () => {
        expect.assertions(2);

        let name = new Name({
            prefix: "alelnöke",
            givenName: "Dorottya",

            familyName: "Halász",
            suffix: "idősebb"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'hu-HU'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "alelnöke Halász Dorottya idősebb";

        expect(formatted).toBe(expected);
    });

    test("should parse a Hungarian compound honorific", () => {
        expect.assertions(2);
        const parsed = new Name("alelnöke Halász", {locale: 'hu-HU'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "alelnöke",
            familyName: "Halász"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Hungarian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Dorottya",
            familyName: "Halász"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'hu-HU'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Halász Dorottya";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Hungarian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Dorottya",
            familyName: "Halász"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'hu-HU'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Halász Dorottya";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Hungarian name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Dorottya",
            familyName: "Halász",
            suffix: "idősebb"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'hu-HU'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Halász Dorottya idősebb";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Hungarian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            suffix: "idősebb",
            givenName: "Dorottya",
            familyName: "Halász"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'hu-HU'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Halász Dorottya";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style for Hungarian", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'hu-HU'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style for Hungarian", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'hu-HU'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

});
