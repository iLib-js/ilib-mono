/*
 * testname_en.js - test the name object in Japanese
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

describe("Name_et", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("et-EE");
        }
    });

    test("should parse a simple Estonian name", () => {
        expect.assertions(2);
        const parsed = new Name("Kertu-Triin Sepp", {locale: 'et-EE'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Kertu-Triin",
            familyName: "Sepp"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an Estonian name with a professor prefix", () => {
        expect.assertions(2);
        const parsed = new Name("professor Kertu Sepp", {locale: 'et-EE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "professor",
            givenName: "Kertu",
            familyName: "Sepp"

        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Estonian name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Kertu-Triin Sepp jr.", {locale: 'et-EE'});
        expect(parsed).toBeTruthy();

        const expected = {
             suffix : "jr.",
            givenName: "Kertu-Triin",
            familyName: "Sepp"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an Estonian title (variant)", () => {
        expect.assertions(2);
        const parsed = new Name("Hr. Kertu-Triin Sepp", {locale: 'et-EE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "Hr.",
            givenName: "Kertu-Triin",
            familyName: "Sepp"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a second Estonian title", () => {
        expect.assertions(2);
        const parsed = new Name("Prl. Kertu-Triin Sepp", {locale: 'et-EE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "Prl.",
            givenName: "Kertu-Triin",
            familyName: "Sepp"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an Estonian title with family name and adjunct", () => {
        expect.assertions(2);

        let name = new Name({
            prefix: "Hr.",
            givenName: "Kertu-Triin",
            familyName: "Sepp",
            suffix: "pensionile"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'et-EE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Hr. Kertu-Triin Sepp pensionile";

        expect(formatted).toBe(expected);
    });

    test("should parse an Estonian title with family name and adjunct (extra)", () => {
        expect.assertions(2);
        const parsed = new Name("inspektor Kertu-Triin Sepp pensionile", {locale: 'et-EE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "inspektor",
            givenName: "Kertu-Triin",
            familyName: "Sepp",
            suffix : "pensionile"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an Estonian name with a compound honorific", () => {
        expect.assertions(2);
        const parsed = new Name("Hr. Sepp", {locale: 'et-EE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Hr.",
            familyName: "Sepp"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Estonian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Kertu-Triin",
            familyName: "Sepp"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'et-EE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Kertu-Triin Sepp";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Estonian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Kertu-Triin",
            familyName: "Sepp"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'et-EE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Kertu-Triin Sepp";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Estonian name in full style", () => {
        expect.assertions(2);
        let name = new Name({

            givenName: "Kertu-Triin",
            familyName: "Sepp",
            suffix: "pensionile"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'et-EE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Kertu-Triin Sepp pensionile";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Estonian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            suffix: "pensionile",
            givenName: "Kertu-Triin",
            familyName: "Sepp"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'et-EE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Kertu-Triin Sepp";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style with Estonian formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'et-EE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style with Estonian formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'et-EE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

});
