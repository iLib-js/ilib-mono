/*
 * Name_mn_Cyrl.test.js - test the name object in Arabic
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

describe("Name_mn_Cyrl", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("mn-Cyrl-MN");
        }
    });

    test("should parse a simple Mongolian Cyrillic name", () => {
        expect.assertions(2);
        const parsed = new Name("Цахиагийн Элбэгдорж", {locale: 'mn-Cyrl-MN'});
        expect(parsed).toBeTruthy();

        const expected =   {
            givenName: "Цахиагийн",
            familyName: "Элбэгдорж"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse adjunct names", () => {
        expect.assertions(2);
        const parsed = new Name("Ноён ба Хатагтай Элбэгдорж", {locale: 'mn-Cyrl-MN'});
        expect(parsed).toBeTruthy();

        const expected =  {
            prefix: "Ноён ба Хатагтай",
            familyName: "Элбэгдорж"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("хатагтай Элбэгдорж", {locale: 'mn-Cyrl-MN'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "хатагтай",
            familyName: "Элбэгдорж"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title", () => {
        expect.assertions(2);
        const parsed = new Name("Цахиагийн Элбэгдорж 9-р", {locale: 'mn-Cyrl-MN'});
        expect(parsed).toBeTruthy();

        const expected =    {
            suffix: "9-р",
            givenName: "Цахиагийн",
            familyName: "Элбэгдорж"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a name with everything", () => {
        expect.assertions(2);
        const parsed = new Name("ц.э Цахиагийн Элбэгдорж ерөнхийлөгч", {locale: 'mn-Cyrl-MN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "ц.э",
            suffix: "ерөнхийлөгч",
            givenName: "Цахиагийн",
            familyName: "Элбэгдорж"
        };

        expect(parsed).toMatchObject(expected);
    });

    /*
     * Format Tests
     */

    test("should format a simple name full", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "mонгол Улсын Ерөнхийлөгч",
            givenName: "Цахиагийн",
            familyName: "Элбэгдорж",
            suffix: "9-р"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'mn-Cyrl-MN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "mонгол Улсын Ерөнхийлөгч Цахиагийн Элбэгдорж 9-р";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "mонгол Улсын Ерөнхийлөгч",
            givenName: "Цахиагийн",
            familyName: "Элбэгдорж"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'mn-Cyrl-MN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Цахиагийн Элбэгдорж";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name medium", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "mонгол Улсын Ерөнхийлөгч",
            givenName: "Цахиагийн",
            familyName: "Элбэгдорж"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'mn-Cyrl-MN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Цахиагийн Элбэгдорж";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name long", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "mонгол Улсын Ерөнхийлөгч",
            givenName: "Цахиагийн",
            familyName: "Элбэгдорж"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'mn-Cyrl-MN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "mонгол Улсын Ерөнхийлөгч Цахиагийн Элбэгдорж";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'mn-Cyrl-MN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name medium", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'mn-Cyrl-MN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name long", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'mn-Cyrl-MN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸";

        expect(formatted).toBe(expected);
    });

});
