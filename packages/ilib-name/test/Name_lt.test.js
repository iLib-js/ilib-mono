/*
 * Name_lt.test.js - test the name object in Lithunaian
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

describe("Name_lt", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("lt-LT");
        }
    });

    test("should parse a simple Lithuanian name", () => {
        expect.assertions(2);
        const parsed = new Name("Gediminas Baravykas", {locale: 'lt-LT'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Gediminas",
            familyName: "Baravykas"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title", () => {
        expect.assertions(2);
        const parsed = new Name("Gediminas Baravykas jaunesnysis", {locale: 'lt-LT'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "jaunesnysis",
            givenName: "Gediminas",
            familyName: "Baravykas"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("inspektorius Baravykas", {locale: 'lt-LT'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "inspektorius",
            familyName: "Baravykas"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a name with everything", () => {
        expect.assertions(2);
        const parsed = new Name("ponas ir ponia Baravykas", {locale: 'lt-LT'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "ponas ir ponia",
            familyName: "Baravykas"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("ponas Gediminas Baravykas", {locale: 'lt-LT'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "ponas",
            givenName: "Gediminas",
            familyName: "Baravykas"
        };

        expect(parsed).toMatchObject(expected);
    });

    /*
     * Format Tests
     */

    test("should format a simple name short", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Gediminas",
            familyName: "Baravykas"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Gediminas Baravykas";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name medium", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Gediminas",
            familyName: "Baravykas"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Gediminas Baravykas";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name long", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Gediminas",
            familyName: "Baravykas",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Gediminas Baravykas";

        expect(formatted).toBe(expected);
    });

    test("should format a surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ponas ir ponia",
            familyName: "Baravykas"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ponas ir ponia Baravykas";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name full", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "profesorius",
            givenName: "Gediminas",
            familyName: "Baravykas",
            suffix: "daktaro"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "profesorius Gediminas Baravykas daktaro";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "profesorius",
            givenName: "Gediminas",
            familyName: "Baravykas"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Gediminas Baravykas";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name medium", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "profesorius",
            givenName: "Gediminas",
            familyName: "Baravykas"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Gediminas Baravykas";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name long", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "profesorius",
            givenName: "Gediminas",
            familyName: "Baravykas"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'lt-LT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "profesorius Gediminas Baravykas";

        expect(formatted).toBe(expected);
    });

});
