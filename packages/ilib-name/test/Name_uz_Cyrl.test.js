/*
 * testname_uz_Cyrl.js - test the name object in Uzbek
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

describe("Name_uz_Cyrl", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("uz-Cyrl-UZ");
        }
    });

    test("should parse a simple Cyrillic Uzbek name", () => {
        expect.assertions(2);
        const parsed = new Name("Бобур Мирзаев", {locale: 'uz-Cyrl-UZ'});
        expect(parsed).toBeTruthy();

        const expected =   {
            givenName:"Бобур",
            familyName: "Мирзаев"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Cyrillic Uzbek name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("жаноб ва хоним Мирзаев", {locale: 'uz-Cyrl-UZ'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "жаноб ва хоним",
            familyName: "Мирзаев"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Cyrillic Uzbek name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Бобур Мирзаев кичик", {locale: 'uz-Cyrl-UZ'});
        expect(parsed).toBeTruthy();

        const expected =    {
            suffix: "кичик",
            givenName:"Бобур",
            familyName: "Мирзаев"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Cyrillic Uzbek title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("доктор Мирзаев", {locale: 'uz-Cyrl-UZ'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "доктор",
            familyName: "Мирзаев"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Cyrillic Uzbek name", () => {
        expect.assertions(2);
        const parsed = new Name("доктор Бобур Мирзаев", {locale: 'uz-Cyrl-UZ'});
        expect(parsed).toBeTruthy();

        const expected =    {
            prefix: "доктор",
            givenName: "Бобур",
            familyName: "Мирзаев"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Cyrillic Uzbek name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Бобур",
            familyName: "Мирзаев"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'uz-Cyrl-UZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Бобур Мирзаев";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Cyrillic Uzbek name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Бобур",
            familyName: "Мирзаев"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'uz-Cyrl-UZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Бобур Мирзаев";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Cyrillic Uzbek name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "доктор",
            givenName: "Бобур",
            familyName: "Мирзаев",
            suffix: "2-чи"
           });
        let fmt = new NameFmt({
            style: "full",
            locale: 'uz-Cyrl-UZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "доктор Бобур Мирзаев 2-чи";

        expect(formatted).toBe(expected);
    });
});
