/*
 * Name_mr.test.js - test the name object in Marathi
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

describe("Name_mr", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("mr-IN");
        }
    });

    test("should parse a simple Marathi name", () => {
        expect.assertions(2);
        const parsed = new Name("सचिन तेंडुलकर", {locale: 'mr-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title", () => {
        expect.assertions(2);
        const parsed = new Name("सचिन तेंडुलकर ज्येष्ठ", {locale: 'mr-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "ज्येष्ठ",
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("श्रीयुत तेंडुलकर", {locale: 'mr-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "श्रीयुत",
            familyName: "तेंडुलकर"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a name with everything", () => {
        expect.assertions(2);
        const parsed = new Name("श्रीयुत आणि मिसेस तेंडुलकर", {locale: 'mr-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "श्रीयुत आणि मिसेस",
            familyName: "तेंडुलकर"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("श्रीयुत सचिन तेंडुलकर", {locale: 'mr-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "श्रीयुत",
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        };

        expect(parsed).toMatchObject(expected);
    });

    /*
     * Format Tests
     */

    test("should format a simple name short", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "सचिन तेंडुलकर";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name medium", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "सचिन तेंडुलकर";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name long", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "सचिन तेंडुलकर";

        expect(formatted).toBe(expected);
    });

    test("should format a surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "श्रीयुत आणि मिसेस",
            familyName: "तेंडुलकर"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "श्रीयुत आणि मिसेस तेंडुलकर";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name full", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "डॉक्टर",
            givenName: "सचिन",
            familyName: "तेंडुलकर",
            suffix: "वरिष्ठ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "डॉक्टर सचिन तेंडुलकर वरिष्ठ";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "डॉक्टर",
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "सचिन तेंडुलकर";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name medium", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "डॉक्टर",
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "सचिन तेंडुलकर";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name long", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "डॉक्टर",
            givenName: "सचिन",
            familyName: "तेंडुलकर"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'mr-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "डॉक्टर सचिन तेंडुलकर";

        expect(formatted).toBe(expected);
    });

});
