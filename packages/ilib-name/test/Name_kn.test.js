/*
 * Name_kn.test.js - test the name object in Kannada
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

describe("Name_kn", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("kn-IN");
        }
    });

    test("should parse a simple Kannada name", () => {
        expect.assertions(2);
        const parsed = new Name("ಮಂಜುನಾಥ ಗೌಡ", {locale: 'kn-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "ಮಂಜುನಾಥ",
            familyName: "ಗೌಡ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Kannada name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("ಮಂಜುನಾಥ ಗೌಡ ಹಿರಿಯ", {locale: 'kn-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "ಹಿರಿಯ",
            givenName: "ಮಂಜುನಾಥ",
            familyName: "ಗೌಡ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Kannada title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("ವೈದ್ಯರು ಗೌಡ", {locale: 'kn-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "ವೈದ್ಯರು",
            familyName: "ಗೌಡ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a full Kannada name", () => {
        expect.assertions(2);
        const parsed = new Name("ಶ್ರೀ ಮತ್ತು ಶ್ರೀಮತಿ ಗೌಡ", {locale: 'kn-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "ಶ್ರೀ ಮತ್ತು ಶ್ರೀಮತಿ",
            familyName: "ಗೌಡ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Kannada name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("ಶ್ರೀ ಮಂಜುನಾಥ ಗೌಡ", {locale: 'kn-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "ಶ್ರೀ",
            givenName: "ಮಂಜುನಾಥ",
            familyName: "ಗೌಡ"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Kannada name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "ಮಂಜುನಾಥ",
            familyName: "ಗೌಡ"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'kn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ಮಂಜುನಾಥ ಗೌಡ";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Kannada name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "ಮಂಜುನಾಥ",

            familyName: "ಗೌಡ"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'kn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ಮಂಜುನಾಥ ಗೌಡ";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Kannada name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "ಮಂಜುನಾಥ",

            familyName: "ಗೌಡ"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'kn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ಮಂಜುನಾಥ ಗೌಡ";

        expect(formatted).toBe(expected);
    });

    test("should format a Kannada surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ಶ್ರೀ ಮತ್ತು ಶ್ರೀಮತಿ",
            familyName: "ಗೌಡ"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'kn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ಶ್ರೀ ಮತ್ತು ಶ್ರೀಮತಿ ಗೌಡ";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Kannada name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ವೈದ್ಯರು",
            givenName: "ಮಂಜುನಾಥ",

            familyName: "ಗೌಡ",
            suffix: "ಕಿರಿಯ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'kn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ವೈದ್ಯರು ಮಂಜುನಾಥ ಗೌಡ ಕಿರಿಯ";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Kannada name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ವೈದ್ಯರು",
            givenName: "ಮಂಜುನಾಥ",
            familyName: "ಗೌಡ"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'kn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ಮಂಜುನಾಥ ಗೌಡ";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Kannada name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ವೈದ್ಯರು",
            givenName: "ಮಂಜುನಾಥ",
            familyName: "ಗೌಡ"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'kn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ಮಂಜುನಾಥ ಗೌಡ";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Kannada name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ವೈದ್ಯರು",
            givenName: "ಮಂಜುನಾಥ",
            familyName: "ಗೌಡ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'kn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ವೈದ್ಯರು ಮಂಜುನಾಥ ಗೌಡ";

        expect(formatted).toBe(expected);
    });

});
