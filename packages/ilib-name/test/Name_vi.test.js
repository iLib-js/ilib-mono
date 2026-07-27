/*
 * testname_vi.js - test the name object in Vietnamese
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

describe("Name_vi", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("vi-VN");
        }
    });

    test("should parse a simple Vietnamese name", () => {
        expect.assertions(2);
        const parsed = new Name("Chau-Giang Thi Nguyen", {locale: 'vi-VN'});
        expect(parsed).toBeTruthy();

        const expected =   {
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse Vietnamese adjunct names", () => {
        expect.assertions(2);
        const parsed = new Name("Chau-Giang Thi Nguyen", {locale: 'vi-VN'});
        expect(parsed).toBeTruthy();

        const expected =  {
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Vietnamese name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Ông và Bà Nguyen", {locale: 'vi-VN'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "Ông và Bà",
            familyName: "Nguyen"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Vietnamese name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Chau-Giang Nguyen Cao cấp", {locale: 'vi-VN'});
        expect(parsed).toBeTruthy();

        const expected =    {
            suffix: "Cao cấp",
            givenName: "Chau-Giang",
            familyName: "Nguyen"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Vietnamese title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("Thị trưởng Nguyen", {locale: 'vi-VN'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "Thị trưởng",
            familyName: "Nguyen"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Vietnamese name", () => {
        expect.assertions(2);
        const parsed = new Name("Ông Chau-Giang Thi Nguyen", {locale: 'vi-VN'});
        expect(parsed).toBeTruthy();

        const expected =    {
            prefix: "Ông",
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Vietnamese name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Chau-Giang Nguyen";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Vietnamese name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Chau-Giang Thi Nguyen";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Vietnamese name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen",
            suffix: "Cao cấp"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Chau-Giang Thi Nguyen";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Vietnamese name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Ông",
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen",
            suffix: "Cao cấp"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Ông Chau-Giang Thi Nguyen Cao cấp";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Vietnamese name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Ông",
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Chau-Giang Nguyen";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Vietnamese name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Ông",
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Chau-Giang Thi Nguyen";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Vietnamese name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Ông",
            givenName: "Chau-Giang",
            middleName: "Thi",
            familyName: "Nguyen"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Ông Chau-Giang Thi Nguyen";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian Vietnamese name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian Vietnamese name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian Vietnamese name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'vi-VN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸";

        expect(formatted).toBe(expected);
    });
});
