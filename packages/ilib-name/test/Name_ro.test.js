/*
 * Name_ro.test.js - test the name object in Romanian
 *
 * Copyright © 2013-2015,2017,2022 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * unless required by applicable law or agreed to in writing, software
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

describe("Name_ro", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("ro-RO");
        }
    });

    test("should parse a simple Romanian name", () => {
        expect.assertions(2);
        const parsed = new Name("Sebastian Stan", {locale: 'ro-RO'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Sebastian",
            familyName: "Stan"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a simple name with a middle name", () => {
        expect.assertions(2);
        const parsed = new Name("Alexandra Maria Lara", {locale: 'ro-RO'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Alexandra",
            middleName: "Maria",
            familyName: "Lara"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title", () => {
        expect.assertions(2);
        const parsed = new Name("Sebastian Stan doctorand", {locale: 'ro-RO'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "doctorand",
            givenName: "Sebastian",
            familyName: "Stan"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("Dl. Stan", {locale: 'ro-RO'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Dl.",
            familyName: "Stan"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a name with everything", () => {
        expect.assertions(2);
        const parsed = new Name("Dl. și D-na. Stan", {locale: 'ro-RO'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Dl. și D-na.",
            familyName: "Stan"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("Dl. Sebastian Stan", {locale: 'ro-RO'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Dl.",
            givenName: "Sebastian",
            familyName: "Stan"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a prefix and suffix", () => {
        expect.assertions(2);
        const parsed = new Name("Vice-presedinte Sebastian Stan retras", {locale: 'ro-RO'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Vice-presedinte",
            givenName: "Sebastian",
            familyName: "Stan",
            suffix:"retras"
        };

        expect(parsed).toMatchObject(expected);
    });

    /*
         * Format Tests
         */

    test("should format a simple name short", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Sebastian",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Sebastian Stan";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name medium", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Sebastian",

            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Sebastian Stan";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name long", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Sebastian",

            familyName: "Stan",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Sebastian Stan";

        expect(formatted).toBe(expected);
    });

    test("should format a surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dl. i D-na.",

            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Dl. i D-na. Stan";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name full", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Administrator",
            givenName: "Sebastian",

            familyName: "Stan",
            suffix: "doctorand"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Administrator Sebastian Stan doctorand";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Administrator",
            givenName: "Sebastian",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Sebastian Stan";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name medium", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Administrator",
            givenName: "Sebastian",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Sebastian Stan";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name long", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Administrator",
            givenName: "Sebastian",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ro-RO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Administrator Sebastian Stan";

        expect(formatted).toBe(expected);
    });

});
