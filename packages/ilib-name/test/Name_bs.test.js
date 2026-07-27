/*
 * Name_bs.test.js - test the name object in Bosnian
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

describe("Name_bs", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("bs-BA");
        }
    });

    test("should parse a simple Bosnian name", () => {
        expect.assertions(2);
        const parsed = new Name("Derviš Sušić", {locale: 'bs-BA'});
        expect(parsed).toBeTruthy();

        const expected =   {
            givenName: "Derviš",
            familyName: "Sušić"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Bosnian name with an adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Derviš Sušić", {locale: 'bs-BA'});
        expect(parsed).toBeTruthy();

        const expected =  {
            givenName: "Derviš",
            familyName: "Sušić"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Bosnian name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Gospodin i Gospođica Sušić", {locale: 'bs-BA'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "Gospodin i Gospođica",
            familyName: "Sušić"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Bosnian name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Derviš Sušić viši", {locale: 'bs-BA'});
        expect(parsed).toBeTruthy();

        const expected =    {
            suffix: "viši",
            givenName: "Derviš",
            familyName: "Sušić"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Bosnian title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("predsjednik Sušić", {locale: 'bs-BA'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "predsjednik",
            familyName: "Sušić"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Bosnian name", () => {
        expect.assertions(2);
        const parsed = new Name("predsjednik Derviš Sušić", {locale: 'bs-BA'});
        expect(parsed).toBeTruthy();

        const expected =    {
            prefix: "predsjednik",
            givenName: "Derviš",
            familyName: "Sušić"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Bosnian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Derviš",
            familyName: "Sušić"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'bs-BA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Derviš Sušić";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Bosnian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Derviš",
            familyName: "Sušić"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'bs-BA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Derviš Sušić";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Bosnian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Derviš",

            familyName: "Sušić"  ,
            suffix: "viši"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'bs-BA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Derviš Sušić";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Bosnian name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Gospodin",
            givenName: "Derviš",
            familyName: "Sušić"  ,
            suffix: "viši"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'bs-BA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Gospodin Derviš Sušić viši";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Bosnian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Gospodin",
            givenName: "Derviš",
            familyName: "Sušić"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'bs-BA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Derviš Sušić";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Bosnian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Gospodin",
            givenName: "Derviš",
            familyName: "Sušić"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'bs-BA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Derviš Sušić";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Bosnian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Gospodin",
            givenName: "Derviš",
            familyName: "Sušić"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'bs-BA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Gospodin Derviš Sušić";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in short style with Bosnian formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'bs-BA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style with Bosnian formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'bs-BA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style with Bosnian formatter", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'bs-BA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸";

        expect(formatted).toBe(expected);
    });

});
