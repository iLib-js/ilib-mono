/*
 * Name_pa.test.js - test the name object in Panjabi
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

describe("Name_pa", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("pa-IN");
        }
    });

    test("should parse a simple Punjabi name", () => {
        expect.assertions(2);
        const parsed = new Name("ਹਰਭਜਨ ਸਿੰਘ", {locale: 'pa-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title", () => {
        expect.assertions(2);
        const parsed = new Name("ਹਰਭਜਨ ਸਿੰਘ ਸੇਨਿਓਰ", {locale: 'pa-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "ਸੇਨਿਓਰ",
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("ਦਰ ਸਿੰਘ", {locale: 'pa-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "ਦਰ",
            familyName: "ਸਿੰਘ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a name with everything", () => {
        expect.assertions(2);
        const parsed = new Name("ਦਰ ਏੰਡ ਮਰ ਸਿੰਘ", {locale: 'pa-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "ਦਰ ਏੰਡ ਮਰ",
            familyName: "ਸਿੰਘ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("ਦਰ ਹਰਭਜਨ ਸਿੰਘ", {locale: 'pa-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "ਦਰ",
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        };

        expect(parsed).toMatchObject(expected);
    });

    /*
     * Format Tests
     */

    test("should format a simple name short", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ਹਰਭਜਨ ਸਿੰਘ";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name medium", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ਹਰਭਜਨ ਸਿੰਘ";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name long", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ਹਰਭਜਨ ਸਿੰਘ";

        expect(formatted).toBe(expected);
    });

    test("should format a surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ਦਰ ਏੰਡ ਮਰ",
            familyName: "ਸਿੰਘ"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ਦਰ ਏੰਡ ਮਰ ਸਿੰਘ";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name full", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ਡਾਕ੍ਟਰ",
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ",
            suffix: "ਸੇਨਿਓਰ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ਡਾਕ੍ਟਰ ਹਰਭਜਨ ਸਿੰਘ ਸੇਨਿਓਰ";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ਡਾਕ੍ਟਰ",
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ਹਰਭਜਨ ਸਿੰਘ";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name medium", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ਡਾਕ੍ਟਰ",
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ਹਰਭਜਨ ਸਿੰਘ";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name long", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ਡਾਕ੍ਟਰ",
            givenName: "ਹਰਭਜਨ",
            familyName: "ਸਿੰਘ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'pa-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ਡਾਕ੍ਟਰ ਹਰਭਜਨ ਸਿੰਘ";

        expect(formatted).toBe(expected);
    });

});
