/*
 * Name_it.test.js - test the name object in Italian
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

describe("Name_it", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("it-IT");
        }
    });

    test("should parse a simple Italian name", () => {
        expect.assertions(2);
        const parsed = new Name("Leonardo DiCaprio", {locale: 'it-IT'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Leonardo",
            familyName: "DiCaprio"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Italian name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Leonardo DiCaprio", {locale: 'it-IT'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Leonardo",
            familyName: "DiCaprio"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Italian title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("ingegnere. DiCaprio", {locale: 'it-IT'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "ingegnere.",
            familyName: "DiCaprio"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a full Italian name", () => {
        expect.assertions(2);
        const parsed = new Name("ingegnere Leonardo DiCaprio", {locale: 'it-IT'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "ingegnere",
            givenName: "Leonardo",
            familyName: "DiCaprio"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Italian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Leonardo",
            familyName: "DiCaprio"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'it-IT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Leonardo DiCaprio";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Italian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Leonardo",

            familyName: "DiCaprio"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'it-IT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Leonardo DiCaprio";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Italian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Leonardo",

            familyName: "DiCaprio",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'it-IT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Leonardo DiCaprio";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Italian name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "dottore",
            givenName: "Leonardo",

            familyName: "DiCaprio"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'it-IT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "dottore Leonardo DiCaprio";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Italian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "dottore",
            givenName: "Leonardo",
            familyName: "DiCaprio"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'it-IT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Leonardo DiCaprio";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Italian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "dottore",
            givenName: "Leonardo",
            familyName: "DiCaprio"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'it-IT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Leonardo DiCaprio";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Italian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "dottore",
            givenName: "Leonardo",
            familyName: "DiCaprio"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'it-IT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "dottore Leonardo DiCaprio";

        expect(formatted).toBe(expected);
    });

});
