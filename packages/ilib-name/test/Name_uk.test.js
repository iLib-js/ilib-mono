/*
 * testname_uk_UA.js - test the name object in Ukrainian
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

describe("Name_uk", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("uk-UA");
        }
    });

    test("should parse a simple Ukrainian name", () => {
        expect.assertions(2);
        const parsed = new Name("Міла Куніс", {locale: 'uk-UA'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Міла",
            familyName: "Куніс"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Ukrainian name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Міла Куніс відставку", {locale: 'uk-UA'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "відставку",
            givenName: "Міла",
            familyName: "Куніс"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Ukrainian title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("г-н Куніс", {locale: 'uk-UA'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "г-н",
            familyName: "Куніс"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Ukrainian name", () => {
        expect.assertions(2);
        const parsed = new Name("г-н і г-жа Куніс", {locale: 'uk-UA'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "г-н і г-жа",
            familyName: "Куніс"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Ukrainian name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("г-н Міла Куніс", {locale: 'uk-UA'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "г-н",
            givenName: "Міла",
            familyName: "Куніс"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Ukrainian name with prefix and suffix", () => {
        expect.assertions(2);
        const parsed = new Name("міністр Міла Куніс відставку", {locale: 'uk-UA'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "міністр",
            givenName: "Міла",
            familyName: "Куніс",
            suffix:"відставку"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Ukrainian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Міла",
            familyName: "Куніс"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Міла Куніс";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Ukrainian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Міла",
            familyName: "Куніс"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Міла Куніс";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Ukrainian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Міла",
            familyName: "Куніс",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Міла Куніс";

        expect(formatted).toBe(expected);
    });

    test("should format a Ukrainian surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "г-н i г-жа",
            familyName: "Куніс"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "г-н i г-жа Куніс";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Ukrainian name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "шеф-кухар",
            givenName: "Міла",
            familyName: "Куніс",
            suffix: "відставку"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "шеф-кухар Міла Куніс відставку";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Ukrainian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "шеф-кухар",
            givenName: "Міла",
            familyName: "Куніс"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Міла Куніс";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Ukrainian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "шеф-кухар",
            givenName: "Міла",
            familyName: "Куніс"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Міла Куніс";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Ukrainian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "шеф-кухар",
            givenName: "Міла",
            familyName: "Куніс"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'uk-UA'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "шеф-кухар Міла Куніс";

        expect(formatted).toBe(expected);
    });
});
