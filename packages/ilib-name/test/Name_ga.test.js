/*
 * Name_ga.test.js - test the name object in Gaelic
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

describe("Name_ga", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("ga-IE");
        }
    });

    test("should parse a simple Gaelic name", () => {
        expect.assertions(2);
        const parsed = new Name("Daniel O'Reilly", {locale: 'ga-IE'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Daniel",
            familyName: "O'Reilly"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Gaelic name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("An tUasal. Kertu O'Reilly", {locale: 'ga-IE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "An tUasal.",
            givenName: "Kertu",
            familyName: "O'Reilly"

        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Gaelic name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("Daniel O'Reilly sóisearach", {locale: 'ga-IE'});
        expect(parsed).toBeTruthy();

        const expected = {
             suffix : "sóisearach",
            givenName: "Daniel",
            familyName: "O'Reilly"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Gaelic name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("príomh-aire Daniel O'Reilly", {locale: 'ga-IE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "príomh-aire",
            givenName: "Daniel",
            familyName: "O'Reilly"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Gaelic name with a title (second form)", () => {
        expect.assertions(2);
        const parsed = new Name("An tUasal. agus Mrs. O'Reilly", {locale: 'ga-IE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix : "An tUasal. agus Mrs.",
            familyName: "O'Reilly"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Gaelic title with family name only and adjunct", () => {
        expect.assertions(2);

        let name = new Name({
            prefix: "príomh-aire",
            givenName: "Daniel",
            familyName: "O'Reilly",
            suffix: "scor"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ga-IE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "príomh-aire Daniel O'Reilly scor";

        expect(formatted).toBe(expected);
    });

    test("should parse a Gaelic compound honorific", () => {
        expect.assertions(2);
        const parsed = new Name("príomh-aire O'Reilly", {locale: 'ga-IE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "príomh-aire",
            familyName: "O'Reilly"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Gaelic name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Daniel",
            familyName: "O'Reilly"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ga-IE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Daniel O'Reilly";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Gaelic name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Daniel",
            familyName: "O'Reilly"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ga-IE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Daniel O'Reilly";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Gaelic name in full style", () => {
        expect.assertions(2);
        let name = new Name({

            givenName: "Daniel",
            familyName: "O'Reilly",
            suffix: "scor"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ga-IE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Daniel O'Reilly scor";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Gaelic name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            suffix: "scor",
            givenName: "Daniel",
            familyName: "O'Reilly"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ga-IE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Daniel O'Reilly";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style for Gaelic", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ga-IE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style for Gaelic", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ga-IE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

});
