/*
 * testname_de.js - test the name object in Bulgarian
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

describe("Name_bg", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("bg-BG");
        }
    });

    test("should parse a simple Bulgarian name", () => {
        expect.assertions(2);
        const parsed = new Name("Мария Георгиева", {locale: 'bg-BG'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Мария",
            familyName: "Георгиева"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Bulgarian name with an adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Стоян Драганов", {locale: 'bg-BG'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Стоян",
            familyName: "Драганов"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Bulgarian name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("сестра Драганов", {locale: 'bg-BG'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "сестра",
            familyName: "Драганов"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Bulgarian name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Мария Георгиева младши", {locale: 'bg-BG'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "младши",
            givenName: "Мария",
            familyName: "Георгиева"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Bulgarian title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("сестра. Георгиева", {locale: 'bg-BG'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "сестра.",
            familyName: "Георгиева"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Bulgarian name", () => {
        expect.assertions(2);
        const parsed = new Name("баба Мария Георгиева", {locale: 'bg-BG'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "баба",
            givenName: "Мария",
            familyName: "Георгиева"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Bulgarian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Мария",
            familyName: "Георгиева"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Мария Георгиева";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Bulgarian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Мария",

            familyName: "Георгиева"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Мария Георгиева";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Bulgarian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Мария",

            familyName: "Георгиева",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Мария Георгиева";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Bulgarian name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "лекар",
            givenName: "Мария",

            familyName: "Георгиева",
            suffix: " MdB"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "лекар Мария Георгиева MdB";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Bulgarian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "лекар",
            givenName: "Мария",
            familyName: "Георгиева"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Мария Георгиева";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Bulgarian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "лекар",
            givenName: "Мария",
            familyName: "Георгиева"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Мария Георгиева";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Bulgarian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "лекар",
            givenName: "Мария",
            familyName: "Георгиева"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "лекар Мария Георгиева";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in short style with Bulgarian formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style with Bulgarian formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style with Bulgarian formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'bg-BG'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸";

        expect(formatted).toBe(expected);
    });

});
