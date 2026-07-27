/*
 * Name_he.test.js - test the name object in Hebrew
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

describe("Name_he", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("he-IL");
        }
    });

    test("should parse a simple Hebrew name", () => {
        expect.assertions(2);
        const parsed = new Name("נטלי פורטמן", {locale: 'he-IL'});
        expect(parsed).toBeTruthy();

        const expected =   {
            givenName: "נטלי",
            familyName: "פורטמן"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse Hebrew adjunct names", () => {
        expect.assertions(2);
        const parsed = new Name("נטלי פורטמן", {locale: 'he-IL'});
        expect(parsed).toBeTruthy();

        const expected =  {
            givenName: "נטלי",
            familyName: "פורטמן"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Hebrew name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("מר ו - גברת פורטמן", {locale: 'he-IL'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "מר ו - גברת",
            familyName: "פורטמן"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Hebrew name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("נטלי פורטמן דוקטור", {locale: 'he-IL'});
        expect(parsed).toBeTruthy();

        const expected =    {
            suffix: "דוקטור",
            givenName: "נטלי",
            familyName: "פורטמן"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Hebrew title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("גברת פורטמן", {locale: 'he-IL'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "גברת",
            familyName: "פורטמן"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a full Hebrew name", () => {
        expect.assertions(2);
        const parsed = new Name("גברת נטלי פורטמן", {locale: 'he-IL'});
        expect(parsed).toBeTruthy();

        const expected =    {
            prefix: "גברת",
            givenName: "נטלי",
            familyName: "פורטמן"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Hebrew name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "נטלי",
            familyName: "פורטמן"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "נטלי פורטמן";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Hebrew name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "נטלי",
            familyName: "פורטמן"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "נטלי פורטמן";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Hebrew name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "נטלי",
            familyName: "פורטמן",
            suffix: "דוקטור"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "נטלי פורטמן";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Hebrew name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ראש הממשלה",
            givenName: "נטלי",

            familyName: "פורטמן",
            suffix: "לשעבר"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ראש הממשלה נטלי פורטמן לשעבר";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Hebrew name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ראש הממשלה",
            givenName: "נטלי",

            familyName: "פורטמן",
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "נטלי פורטמן";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Hebrew name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ראש הממשלה",
            givenName: "נטלי",

            familyName: "פורטמן",
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "נטלי פורטמן";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Hebrew name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ראש הממשלה",
            givenName: "נטלי",

            familyName: "פורטמן",
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ראש הממשלה נטלי פורטמן";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in short style for Hebrew", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style for Hebrew", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style for Hebrew", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'he-IL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸";

        expect(formatted).toBe(expected);
    });

});
