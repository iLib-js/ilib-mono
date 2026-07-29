/*
 * Name_fa.test.js - test the name object in Farsi
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

describe("Name_fa", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("fa-IR");
        }
    });

    test("should parse a simple Persian name", () => {
        expect.assertions(2);
        const parsed = new Name("لیلا میلانی", {locale: 'fa-IR'});
        expect(parsed).toBeTruthy();

        const expected =   {
            givenName: "لیلا",
            familyName: "میلانی"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Persian name with an adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("لیلا میلانی", {locale: 'fa-IR'});
        expect(parsed).toBeTruthy();

        const expected =  {
            givenName: "لیلا",
            familyName: "میلانی"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Persian name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("آقای ﻭ خانم میلانی", {locale: 'fa-IR'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "آقای ﻭ خانم",
            familyName: "میلانی"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Persian name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("لیلا میلانی ﺙﺎﻠﺛﺍ", {locale: 'fa-IR'});
        expect(parsed).toBeTruthy();

        const expected =    {
            suffix: "ﺙﺎﻠﺛﺍ",
            givenName: "لیلا",
            familyName: "میلانی"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Persian title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("خانم میلانی", {locale: 'fa-IR'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "خانم",
            familyName: "میلانی"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Persian name", () => {
        expect.assertions(2);
        const parsed = new Name("خانم لیلا میلانی", {locale: 'fa-IR'});
        expect(parsed).toBeTruthy();

        const expected =    {
            prefix: "خانم",
            givenName: "لیلا",
            familyName: "میلانی"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Persian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "لیلا",
            familyName: "میلانی"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'fa-IR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "لیلا میلانی";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Persian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "لیلا",
            familyName: "میلانی"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'fa-IR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "لیلا میلانی";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Persian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "لیلا",
            familyName: "میلانی",
            suffix: "ﺙﺎﻠﺛﺍ"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'fa-IR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "لیلا میلانی";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Persian name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "خانم",
            givenName: "لیلا",
            familyName: "میلانی",
            suffix: "ﺙﺎﻠﺛﺍ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'fa-IR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "خانم لیلا میلانی ﺙﺎﻠﺛﺍ";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Persian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "خانم",
            givenName: "لیلا",
            familyName: "میلانی"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'fa-IR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "لیلا میلانی";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Persian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "خانم",
            givenName: "لیلا",
            familyName: "میلانی"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'fa-IR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "لیلا میلانی";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Persian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "خانم",
            givenName: "لیلا",
            familyName: "میلانی"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'fa-IR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "خانم لیلا میلانی";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in short style with Persian formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'fa-IR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style with Persian formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'fa-IR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style with Persian formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'fa-IR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸";

        expect(formatted).toBe(expected);
    });

});
