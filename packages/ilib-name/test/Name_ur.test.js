/*
 * testname_ur_IN.js - test the name object in Urdu
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

describe("Name_ur", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("ur-IN");
        }
    });

    test("should parse a simple Urdu name", () => {
        expect.assertions(2);
        const parsed = new Name("موہن لال", {locale: 'ur-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "موہن",
            familyName: "لال"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Urdu name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("موہن لال میں", {locale: 'ur-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "میں",
            givenName: "موہن",
            familyName: "لال"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Urdu title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("مسٹر لال", {locale: 'ur-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "مسٹر",
            familyName: "لال"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Urdu name", () => {
        expect.assertions(2);
        const parsed = new Name("مسٹر اور مسز لال", {locale: 'ur-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "مسٹر اور مسز",
            familyName: "لال"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Urdu name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("مسٹر موہن لال", {locale: 'ur-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "مسٹر",
            givenName: "موہن",
            familyName: "لال"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Urdu name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "موہن",
            familyName: "لال"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "موہن لال";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Urdu name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "موہن",
            familyName: "لال"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "موہن لال";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Urdu name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "موہن",
            familyName: "لال"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "موہن لال";

        expect(formatted).toBe(expected);
    });

    test("should format a Urdu surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "مسٹر اور مسز",
            familyName: "لال"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "مسٹر اور مسز لال";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Urdu name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ڈاکٹر",
            givenName: "موہن",
            familyName: "لال",
            suffix: "میں"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ڈاکٹر موہن لال میں";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Urdu name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ڈاکٹر",
            givenName: "موہن",
            familyName: "لال"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "موہن لال";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Urdu name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ڈاکٹر",
            givenName: "موہن",
            familyName: "لال"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "موہن لال";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Urdu name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ڈاکٹر",
            givenName: "موہن",
            familyName: "لال"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ur-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ڈاکٹر موہن لال";

        expect(formatted).toBe(expected);
    });
});
