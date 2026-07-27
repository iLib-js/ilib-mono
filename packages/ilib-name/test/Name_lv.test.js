/*
 * Name_lv.test.js - test the name object in Latvian
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

describe("Name_lv", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("lv-LV");
        }
    });

    test("should parse a simple Latvian name", () => {
        expect.assertions(2);
        const parsed = new Name("Mikhail Baryshnikov", {locale: 'lv-LV'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Mikhail",
            familyName: "Baryshnikov"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a simple name with a middle name", () => {
        expect.assertions(2);
        const parsed = new Name("Sergei M. Eisenstein", {locale: 'lv-LV'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Sergei",
            middleName: "M.",
            familyName: "Eisenstein"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title", () => {
        expect.assertions(2);
        const parsed = new Name("Mikhail Baryshnikov vecākais", {locale: 'lv-LV'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "vecākais",
            givenName: "Mikhail",
            familyName: "Baryshnikov"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("priekšsēdētāja Baryshnikov", {locale: 'lv-LV'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "priekšsēdētāja",
            familyName: "Baryshnikov"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a name with everything", () => {
        expect.assertions(2);
        const parsed = new Name("kungs un kundze Baryshnikov", {locale: 'lv-LV'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "kungs un kundze",
            familyName: "Baryshnikov"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("kungs Mikhail Baryshnikov", {locale: 'lv-LV'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "kungs",
            givenName: "Mikhail",
            familyName: "Baryshnikov"
        };

        expect(parsed).toMatchObject(expected);
    });

    /*
     * Format Tests
     */

    test("should format a simple name short", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Mikhail",
            familyName: "Baryshnikov"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'lv-LV'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Mikhail Baryshnikov";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name medium", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Mikhail",
            familyName: "Baryshnikov"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'lv-LV'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Mikhail Baryshnikov";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name long", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Mikhail",
            familyName: "Baryshnikov",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'lv-LV'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Mikhail Baryshnikov";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name with middle name full", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Sergei",
            middleName: "M.",
            familyName: "Eisenstein",
            suffix: "pūt"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'lv-LV'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Sergei M. Eisenstein pūt";

        expect(formatted).toBe(expected);
    });

    test("should format a surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "kungs un kundze",
            familyName: "Baryshnikov"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'lv-LV'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "kungs un kundze Baryshnikov";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name full", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "priekšsēdētājs",
            givenName: "Mikhail",
            familyName: "Baryshnikov",
            suffix: "jaunākais"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'lv-LV'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "priekšsēdētājs Mikhail Baryshnikov jaunākais";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "priekšsēdētājs",
            givenName: "Mikhail",
            familyName: "Baryshnikov"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'lv-LV'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Mikhail Baryshnikov";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name medium", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "priekšsēdētājs",
            givenName: "Mikhail",
            familyName: "Baryshnikov"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'lv-LV'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Mikhail Baryshnikov";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name long", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "priekšsēdētājs",
            givenName: "Mikhail",
            familyName: "Baryshnikov"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'lv-LV'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "priekšsēdētājs Mikhail Baryshnikov";

        expect(formatted).toBe(expected);
    });

});
