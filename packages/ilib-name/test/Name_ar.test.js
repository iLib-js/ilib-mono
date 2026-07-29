/*
 * Name_ar.test.js - test the name object in Arabic
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

describe("Name_ar", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("ar-SA");
        }
    });

    test("should parse a simple Arabic name", () => {
        expect.assertions(2);
        const parsed = new Name("ابن سعود", {locale: 'ar-SA'});
        expect(parsed).toBeTruthy();

        const expected =   {
            givenName: "ابن",
            familyName: "سعود"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an Arabic name with an adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("ابن سعود", {locale: 'ar-SA'});
        expect(parsed).toBeTruthy();

        const expected =  {
            givenName: "ابن",
            familyName: "سعود"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Arabic name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("السيد و السيدة سعود", {locale: 'ar-SA'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "السيد و السيدة",
            familyName: "سعود"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an Arabic name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("ابن سعود كبار", {locale: 'ar-SA'});
        expect(parsed).toBeTruthy();

        const expected =    {
            suffix: "كبار",
            givenName: "ابن",
            familyName: "سعود"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an Arabic title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("الملك سعود", {locale: 'ar-SA'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "الملك",
            familyName: "سعود"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Arabic name", () => {
        expect.assertions(2);
        const parsed = new Name("الملك ابن سعود", {locale: 'ar-SA'});
        expect(parsed).toBeTruthy();

        const expected =    {
            prefix: "الملك",
            givenName: "ابن",
            familyName: "سعود"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Arabic name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "ابن",
            familyName: "سعود"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ابن سعود";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Arabic name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "ابن",
            familyName: "سعود"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ابن سعود";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Arabic name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "ابن",

            familyName: "سعود",
            suffix: "كبار"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ابن سعود";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Arabic name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "الملك",
            givenName: "ابن",
            familyName: "سعود",
            suffix: "كبار"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "الملك ابن سعود كبار";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Arabic name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "الملك",
            givenName: "ابن",
            familyName: "سعود"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ابن سعود";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Arabic name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "الملك",
            givenName: "ابن",
            familyName: "سعود"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ابن سعود";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Arabic name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "الملك",
            givenName: "ابن",
            familyName: "سعود"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "الملك ابن سعود";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in short style with Arabic formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style with Arabic formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style with Arabic formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ar-SA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸";

        expect(formatted).toBe(expected);
    });

});
