/*
 * testname_uz_Latn.js - test the name object in Uzbek
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

describe("Name_uz_Latn", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("uz-Latn-UZ");
        }
    });

    test("should parse a simple Latin Uzbek name", () => {
        expect.assertions(2);
        const parsed = new Name("Anastasia Gimazetdinova", {locale: 'uz-Latn-UZ'});
        expect(parsed).toBeTruthy();

        const expected =   {
            givenName: "Anastasia",
            familyName: "Gimazetdinova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse Latin Uzbek adjunct names", () => {
        expect.assertions(2);
        const parsed = new Name("Anastasia Gimazetdinova", {locale: 'uz-Latn-UZ'});
        expect(parsed).toBeTruthy();

        const expected =  {
            givenName: "Anastasia",
            familyName: "Gimazetdinova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Latin Uzbek name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Janob va xonim Gimazetdinova", {locale: 'uz-Latn-UZ'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "Janob va xonim",
            familyName: "Gimazetdinova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Latin Uzbek name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Anastasia Gimazetdinova katta", {locale: 'uz-Latn-UZ'});
        expect(parsed).toBeTruthy();

        const expected =    {
            suffix: "katta",
            givenName: "Anastasia",
            familyName: "Gimazetdinova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Latin Uzbek title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("janob Gimazetdinova", {locale: 'uz-Latn-UZ'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "janob",
            familyName: "Gimazetdinova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Latin Uzbek name", () => {
        expect.assertions(2);
        const parsed = new Name("janob Anastasia Gimazetdinova", {locale: 'uz-Latn-UZ'});
        expect(parsed).toBeTruthy();

        const expected =    {
            prefix: "janob",
            givenName: "Anastasia",
            familyName: "Gimazetdinova"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Latin Uzbek name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Anastasia",
            familyName: "Gimazetdinova"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'uz-Latn-UZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Anastasia Gimazetdinova";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Latin Uzbek name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Anastasia",
            familyName: "Gimazetdinova"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'uz-Latn-UZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Anastasia Gimazetdinova";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Latin Uzbek name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Anastasia",
            familyName: "Gimazetdinova",
            suffix: "kichik"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'uz-Latn-UZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Anastasia Gimazetdinova";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Latin Uzbek name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "xonim",
            givenName: "Anastasia",
            familyName: "Gimazetdinova",
            suffix: "kichik"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'uz-Latn-UZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "xonim Anastasia Gimazetdinova kichik";

        expect(formatted).toBe(expected);
    });
});
