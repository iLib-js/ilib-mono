/*
 * testname_sl_SI.js - test the name object in Slovenian
 *
 * Copyright © 2013-2015,2017, JEGSoft
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

describe("Name_sl", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("sl-SI");
        }
    });

    test("should parse a simple Slovenian name", () => {
        expect.assertions(2);
        const parsed = new Name("Melania Trump", {locale: 'sl-SI'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Melania",
            familyName: "Trump"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Slovenian name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Melania Trump upokojil", {locale: 'sl-SI'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "upokojil",
            givenName: "Melania",
            familyName: "Trump"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Slovenian title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("G. Trump", {locale: 'sl-SI'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "G.",
            familyName: "Trump"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Slovenian name", () => {
        expect.assertions(2);
        const parsed = new Name("G. in Ga. Trump", {locale: 'sl-SI'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "G. in Ga.",
            familyName: "Trump"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Slovenian name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("Ga. Melania Trump", {locale: 'sl-SI'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Ga.",
            givenName: "Melania",
            familyName: "Trump"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Slovenian name with prefix and suffix", () => {
        expect.assertions(2);
        const parsed = new Name("Predsednik Melania Trump upokojil", {locale: 'sl-SI'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Predsednik",
            givenName: "Melania",
            familyName: "Trump",
            suffix:"upokojil"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Slovenian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Melania",
            familyName: "Trump"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sl-SI'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Melania Trump";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Slovenian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Melania",
            familyName: "Trump"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sl-SI'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Melania Trump";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Slovenian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Melania",
            familyName: "Trump",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sl-SI'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Melania Trump";

        expect(formatted).toBe(expected);
    });

    test("should format a Slovenian surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "G. in Ga.",
            familyName: "Trump"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sl-SI'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "G. in Ga. Trump";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Slovenian name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Princeska",
            givenName: "Melania",
            familyName: "Trump",
            suffix: "upokojil"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sl-SI'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Princeska Melania Trump upokojil";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Slovenian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Princeska",
            givenName: "Melania",
            familyName: "Trump"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sl-SI'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Melania Trump";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Slovenian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Princeska",
            givenName: "Melania",
            familyName: "Trump"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sl-SI'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Melania Trump";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Slovenian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Princeska",
            givenName: "Melania",
            familyName: "Trump"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sl-SI'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Princeska Melania Trump";

        expect(formatted).toBe(expected);
    });
});
