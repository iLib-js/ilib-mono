/*
 * Name_nl.test.js - test the name object in Dutch
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

describe("Name_nl", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("nl-NL");
        }
    });

    test("should parse a simple Dutch name", () => {
        expect.assertions(2);
        const parsed = new Name("Jan Hoogeboom", {locale: 'nl-NL'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jan",
            familyName: "Hoogeboom"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a triple name", () => {
        expect.assertions(2);
        const parsed = new Name("Jan Michael Hoogeboom", {locale: 'nl-NL'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Hoogeboom"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse adjunct names", () => {
        expect.assertions(2);
        const parsed = new Name("Ludwig Klaus von Beethoven", {locale: 'nl-NL'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Ludwig",
            middleName: "Klaus",
            familyName: "von Beethoven"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse multi-adjunct names", () => {
        expect.assertions(2);
        const parsed = new Name("Geertje van den Bosch", {locale: 'nl-NL'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Geertje",
            familyName: "van den Bosch"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a hyphenated name", () => {
        expect.assertions(2);
        const parsed = new Name("Jan Michael Bergische-Hoogeboom", {locale: 'nl-NL'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Bergische-Hoogeboom"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a quadruple name", () => {
        expect.assertions(2);
        const parsed = new Name("Jan Michael Jürgen Hoogeboom", {locale: 'nl-NL'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Jan",
            middleName: "Michael Jürgen",
            familyName: "Hoogeboom"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title", () => {
        expect.assertions(2);
        const parsed = new Name("Dr. Jan Hoogeboom", {locale: 'nl-NL'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Dr.",
            givenName: "Jan",
            familyName: "Hoogeboom"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse an honorific", () => {
        expect.assertions(2);
        const parsed = new Name("Mvw. Julia Maier", {locale: 'nl-NL'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Mvw.",
            givenName: "Julia",
            familyName: "Maier"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a name with everything", () => {
        expect.assertions(2);
        const parsed = new Name("President Jan Michael Jürgen Hoogeboom Jr.", {locale: 'nl-NL'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "President",
            givenName: "Jan",
            middleName: "Michael Jürgen",
            familyName: "Hoogeboom",
            suffix: "Jr."
        };

        expect(parsed).toMatchObject(expected);
    });

    /*
     * Format Tests
     */

    test("should format a simple name short", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Hoogeboom"
        });
        let fmt = new NameFmt({style: "short", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Jan Hoogeboom";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name medium", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Hoogeboom"
        });
        let fmt = new NameFmt({style: "medium", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Jan Michael Hoogeboom";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name long", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Hoogeboom"
        });
        let fmt = new NameFmt({style: "long", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Jan Michael Hoogeboom";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name full", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Jan",
            middleName: "Michael",
            familyName: "Hoogeboom"
        });
        let fmt = new NameFmt({style: "full", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Jan Michael Hoogeboom";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "van der Smits",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "short", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Jan van der Smits";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name medium", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "van der Smits",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "medium", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Jan Michael Pieter van der Smits";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name long", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "van der Smits",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "long", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Dr. Jan Michael Pieter van der Smits";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name full", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Dr.",
            givenName: "Jan",
            middleName: "Michael Pieter",
            familyName: "van der Smits",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "full", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Dr. Jan Michael Pieter van der Smits III";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "short", locale: 'nl-NL'});
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
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "medium", locale: 'nl-NL'});
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
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "long", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name full", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "full", locale: 'nl-NL'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

});
