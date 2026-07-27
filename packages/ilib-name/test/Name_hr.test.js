/*
 * Name_hr.test.js - test the name object in Croation
 *
 * Copyright © 2013-2015,2017,2022 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICJASE-2.0
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

describe("Name_hr", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("hr-HR");
        }
    });

    test("should parse a simple Croatian name", () => {
        expect.assertions(2);
        const parsed = new Name("Antonio Pavlović", {locale: 'hr-HR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Antonio",
            familyName: "Pavlović"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a simple Croatian name", () => {
        expect.assertions(2);
        const parsed = new Name("G. Kertu Pavlović", {locale: 'hr-HR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "G.",
            givenName: "Kertu",
            familyName: "Pavlović"

        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a simple Croatian name", () => {
        expect.assertions(2);
        const parsed = new Name("Gospođa. Kertu Pavlović", {locale: 'hr-HR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "Gospođa.",
            givenName: "Kertu",
            familyName: "Pavlović"

        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Croatian name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Antonio Vesna Pavlović mlađi", {locale: 'hr-HR'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix : "mlađi",
            givenName: "Antonio",
                middleName : "Vesna",
            familyName: "Pavlović"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Croatian name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("predsjednik Antonio Vesna Pavlović", {locale: 'hr-HR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "predsjednik",
            givenName: "Antonio",
                middleName : "Vesna",
            familyName: "Pavlović"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Croatian name with a title (second form)", () => {
        expect.assertions(2);
        const parsed = new Name("G. i Gospođa. Pavlović", {locale: 'hr-HR'});
        expect(parsed).toBeTruthy();

        const expected = {
            familyName: "Pavlović"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Croatian title with family name only and adjunct", () => {
        expect.assertions(2);

        let name = new Name({
            prefix: "predsjednik",
            givenName: "Antonio",
            middleName : "Vesna",
            familyName: "Pavlović",
            suffix: "mirovini"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'hr-HR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "predsjednik Antonio Vesna Pavlović mirovini";

        expect(formatted).toBe(expected);
    });

    test("should parse a Croatian compound honorific", () => {
        expect.assertions(2);
        const parsed = new Name("predsjednik Pavlović", {locale: 'hr-HR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "predsjednik",
            familyName: "Pavlović"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Croatian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Antonio",
            middleName : "Vesna",
            familyName: "Pavlović"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'hr-HR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Antonio Pavlović";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Croatian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Antonio",
            middleName : "Vesna",
            familyName: "Pavlović"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'hr-HR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Antonio Vesna Pavlović";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Croatian name in full style", () => {
        expect.assertions(2);
        let name = new Name({

            givenName: "Antonio",
            middleName : "Vesna",
            familyName: "Pavlović",
            suffix: "mirovini"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'hr-HR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Antonio Vesna Pavlović mirovini";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Croatian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            suffix: "mirovini",
            givenName: "Antonio",
            middleName : "Vesna",
            familyName: "Pavlović"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'hr-HR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Antonio Pavlović";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style for Croatian", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'hr-HR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style for Croatian", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'hr-HR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

});
