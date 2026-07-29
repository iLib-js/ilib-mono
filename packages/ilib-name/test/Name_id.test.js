/*
 * Name_id.test.js - test the name object in Indonesian
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

describe("Name_id", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("id-ID");
        }
    });

    test("should parse a simple Indonesian name", () => {
        expect.assertions(2);
        const parsed = new Name("Mahyadi Panggabean", {locale: 'id-ID'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Mahyadi",
            middleName: "Panggabean"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a simple Indonesian name (1)", () => {
        expect.assertions(2);
        const parsed = new Name("Bapak. Abdul Panggabean", {locale: 'id-ID'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "Bapak.",
            givenName: "Abdul",
            middleName: "Panggabean"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a simple Indonesian name (2)", () => {
        expect.assertions(2);
        const parsed = new Name("Ibu. Mahyadi Panggabean", {locale: 'id-ID'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "Ibu.",
            givenName: "Mahyadi",
            middleName: "Panggabean"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Indonesian name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Mahyadi Krupuk muda", {locale: 'id-ID'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix : "muda",
            givenName: "Mahyadi",
            middleName : "Krupuk"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an Indonesian name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("perdana menteri Mahyadi Krupuk", {locale: 'id-ID'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "perdana menteri",
            givenName: "Mahyadi",
            middleName : "Krupuk"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Indonesian name with a title (second form)", () => {
        expect.assertions(2);
        const parsed = new Name("Ibu. dan Bapak. Panggabean", {locale: 'id-ID'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "Ibu. dan Bapak.",
            givenName: "Panggabean"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Indonesian title with family name only and adjunct", () => {
        expect.assertions(2);

        let name = new Name({
            prefix: "presiden",
            givenName: "Mahyadi",
            middleName : "Krupuk",
            suffix: "mundur"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'id-ID'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "presiden Mahyadi Krupuk mundur";

        expect(formatted).toBe(expected);
    });

    test("should parse a Indonesian compound honorific", () => {
        expect.assertions(2);
        const parsed = new Name("melayani Panggabean", {locale: 'id-ID'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "melayani",
            givenName: "Panggabean"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Indonesian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Mahyadi",
            middleName : "Krupuk"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'id-ID'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Mahyadi";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Indonesian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Mahyadi",
            middleName : "Krupuk"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'id-ID'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Mahyadi Krupuk";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Indonesian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            suffix: "mirovini",
            givenName: "Mahyadi",
            middleName: "Panggabean"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'id-ID'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Mahyadi Panggabean";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style for Indonesian", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            middleName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'id-ID'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "獸地";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style for Indonesian", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            middleName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'id-ID'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小獸地太太";

        expect(formatted).toBe(expected);
    });

});
