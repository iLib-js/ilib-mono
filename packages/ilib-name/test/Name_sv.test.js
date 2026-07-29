/*
 * testname_sv_SE.js - test the name object in Swedish
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

describe("Name_sv", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("sv-SE");
        }
    });

    test("should parse a simple Swedish name", () => {
        expect.assertions(2);
        const parsed = new Name("Maud Adams", {locale: 'sv-SE'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Maud",
            familyName: "Adams"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Swedish name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Maud Adams pension", {locale: 'sv-SE'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "pension",
            givenName: "Maud",
            familyName: "Adams"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Swedish title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("herr Adams", {locale: 'sv-SE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "herr",
            familyName: "Adams"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Swedish name", () => {
        expect.assertions(2);
        const parsed = new Name("herr och fru Adams", {locale: 'sv-SE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "herr och fru",
            familyName: "Adams"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Swedish name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("herr Maud Adams", {locale: 'sv-SE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "herr",
            givenName: "Maud",
            familyName: "Adams"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Swedish name with prefix and suffix", () => {
        expect.assertions(2);
        const parsed = new Name("premiärminister Maud Adams pension", {locale: 'sv-SE'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "premiärminister",
            givenName: "Maud",
            familyName: "Adams",
            suffix:"pension"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Swedish name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Maud",
            familyName: "Adams"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sv-SE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Maud Adams";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Swedish name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Maud",
            familyName: "Adams"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sv-SE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Maud Adams";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Swedish name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Maud",
            familyName: "Adams",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sv-SE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Maud Adams";

        expect(formatted).toBe(expected);
    });

    test("should format a Swedish surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "herr och fru",
            familyName: "Adams"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sv-SE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "herr och fru Adams";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Swedish name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "guvernör",
            givenName: "Maud",
            familyName: "Adams",
            suffix: "pension"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sv-SE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "guvernör Maud Adams pension";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Swedish name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "guvernör",
            givenName: "Maud",
            familyName: "Adams"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sv-SE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Maud Adams";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Swedish name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "guvernör",
            givenName: "Maud",
            familyName: "Adams"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sv-SE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Maud Adams";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Swedish name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "guvernör",
            givenName: "Maud",
            familyName: "Adams"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sv-SE'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "guvernör Maud Adams";

        expect(formatted).toBe(expected);
    });
});
