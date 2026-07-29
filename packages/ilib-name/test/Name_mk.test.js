/*
 * Name_mk.test.js - test the name object in Macedonian
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

describe("Name_mk", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("mk-MK");
        }
    });

    test("should parse a simple Macedonian name", () => {
        expect.assertions(2);
        const parsed = new Name("Љубunша Самарџunќ", {locale: 'mk-MK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a simple name with a hyphen", () => {
        expect.assertions(2);
        const parsed = new Name("Nikola-Kole Angelovski", {locale: 'mk-MK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Nikola-Kole",
            familyName: "Angelovski"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title", () => {
        expect.assertions(2);
        const parsed = new Name("Љубunша Самарџunќ високи", {locale: 'mk-MK'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "високи",
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("г-дин Самарџunќ", {locale: 'mk-MK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "г-дин",
            familyName: "Самарџunќ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a name with everything", () => {
        expect.assertions(2);
        const parsed = new Name("г-дин и г-ѓа Самарџunќ", {locale: 'mk-MK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "г-дин и г-ѓа",
            familyName: "Самарџunќ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("г-дин Љубunша Самарџunќ", {locale: 'mk-MK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "г-дин",
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        };

        expect(parsed).toMatchObject(expected);
    });

    /*
     * Format Tests
     */

    test("should format a simple name short", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Љубunша Самарџunќ";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name medium", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Љубunша Самарџunќ";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name long", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Љубunша",
            familyName: "Самарџunќ",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Љубunша Самарџunќ";

        expect(formatted).toBe(expected);
    });

    test("should format a surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "г-дunн и kundze",
            familyName: "Самарџunќ"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "г-дunн и kundze Самарџunќ";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name full", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "претседател",
            givenName: "Љубunша",
            familyName: "Самарџunќ",
            suffix: "помладun"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "претседател Љубunша Самарџunќ помладun";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "претседател",
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Љубunша Самарџunќ";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name medium", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "претседател",
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Љубunша Самарџunќ";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name long", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "претседател",
            givenName: "Љубunша",
            familyName: "Самарџunќ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'mk-MK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "претседател Љубunша Самарџunќ";

        expect(formatted).toBe(expected);
    });

});
