/*
 * Name_es.test.js - test the name object in Spanish
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

describe("Name_es", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("es-ES");
        }
    });

    test("should parse a simple Spanish name", () => {
        expect.assertions(2);
        const parsed = new Name("Joaquin Cebolla", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Joaquin",
            familyName: "Cebolla"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Spanish name with given, middle, and family parts", () => {
    expect.assertions(2);
        const parsed = new Name("Joaquin Zaragoza Cebolla", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Joaquin",
            familyName: "Zaragoza Cebolla"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Spanish name with an adjunct", () => {
    expect.assertions(2);
        const parsed = new Name("Mario de Sevilla", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Mario",
            familyName: "de Sevilla"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Spanish name with multiple adjuncts", () => {
        expect.assertions(2);
        const parsed = new Name("Mario de las Pulgas", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Mario",
            familyName: "de las Pulgas"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a hyphenated Spanish name", () => {
    expect.assertions(2);
        const parsed = new Name("Joaquin Johnson-Cebolla", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Joaquin",
            familyName: "Johnson-Cebolla"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Spanish name with four parts", () => {
    expect.assertions(2);
        const parsed = new Name("Joaquin Michael de los Cruzes Cebolla", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Joaquin",
            middleName: "Michael",
            familyName: "de los Cruzes Cebolla"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Spanish name with multiple multi-part family names", () => {
       expect.assertions(2);
        const parsed = new Name("Joaquin Michael de los Cruzes de Namur", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Joaquin",
            middleName: "Michael",
            familyName: "de los Cruzes de Namur"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Spanish name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Dr. Joaquin Cebolla", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Dr.",
            givenName: "Joaquin",
            familyName: "Cebolla"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Spanish name with an honorific", () => {
    expect.assertions(2);
        const parsed = new Name("Doña Julia Maria Lopez Ortiz", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Doña",
            givenName: "Julia",
            middleName: "Maria",
            familyName: "Lopez Ortiz"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Spanish name", () => {
    expect.assertions(2);
        const parsed = new Name("Doña Julia Maria Consuela de las Piñas Ortiz III", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Doña",
            givenName: "Julia",
            middleName: "Maria Consuela",
            familyName: "de las Piñas Ortiz",
            suffix: "III"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Spanish name with conjunction (1)", () => {
    expect.assertions(2);
        const parsed = new Name("Rodrigo y Gabriella", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Rodrigo y Gabriella"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Spanish name with conjunction (2)", () => {
    expect.assertions(2);
        const parsed = new Name("Rodrigo y Gabriella Cortez", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Rodrigo y Gabriella",
            familyName: "Cortez"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Spanish name with conjunction (3)", () => {
    expect.assertions(2);
        const parsed = new Name("Rodrigo y Gabriella Cortez Colón", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Rodrigo y Gabriella",
            familyName: "Cortez Colón"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Spanish name with conjunction (4)", () => {
    expect.assertions(2);
        const parsed = new Name("Miguel, Rodrigo, y Gabriella Cortez Colón", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Miguel, Rodrigo, y Gabriella",
            familyName: "Cortez Colón"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Spanish family name", () => {
        expect.assertions(2);
        const parsed = new Name("Los Hernandez", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Los",
            familyName: "Hernandez"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Spanish name with a compound honorific", () => {
        expect.assertions(2);
        const parsed = new Name("Sr. y Sra. Hernandez", {locale: 'es-ES'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Sr. y Sra.",
            familyName: "Hernandez"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Spanish name in short style", () => {
       expect.assertions(2);
        let name = new Name({
            givenName: "Joaquin",
            middleName: "Michael",
            familyName: "Cebolla"
        });
        let fmt = new NameFmt({style: "short", locale: 'es-ES'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Joaquin Cebolla";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Spanish name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Joaquin",
            middleName: "Michael",
            familyName: "Cebolla"
        });
        let fmt = new NameFmt({style: "medium", locale: 'es-ES'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Joaquin Michael Cebolla";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Spanish name in long style", () => {
      expect.assertions(2);
        let name = new Name({
            givenName: "Joaquin",
            middleName: "Michael",
            familyName: "Cebolla"
        });
        let fmt = new NameFmt({style: "long", locale: 'es-ES'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Joaquin Michael Cebolla";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Spanish name in full style", () => {
      expect.assertions(2);
        let name = new Name({
            givenName: "Joaquin",
            middleName: "Michael",
            familyName: "Cebolla"
        });
        let fmt = new NameFmt({style: "full", locale: 'es-ES'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Joaquin Michael Cebolla";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Spanish name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Doña",
            givenName: "Julia",
            middleName: "Maria Consuela",
            familyName: "de las Piñas Ortiz",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "short", locale: 'es-ES'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Julia de las Piñas";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Spanish name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Doña",
            givenName: "Julia",
            middleName: "Maria Consuela",
            familyName: "de las Piñas Ortiz",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "medium", locale: 'es-ES'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Julia Maria Consuela de las Piñas";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Spanish name in long style", () => {
       expect.assertions(2);
        let name = new Name({
            prefix: "Doña",
            givenName: "Julia",
            middleName: "Maria Consuela",
            familyName: "de las Piñas Ortiz",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "long", locale: 'es-ES'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Doña Julia Maria Consuela de las Piñas Ortiz";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Spanish name in full style", () => {
       expect.assertions(2);
        let name = new Name({
            prefix: "Doña",
            givenName: "Julia",
            middleName: "Maria Consuela",
            familyName: "de las Piñas Ortiz",
            suffix: "III"
        });
        let fmt = new NameFmt({style: "full", locale: 'es-ES'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Doña Julia Maria Consuela de las Piñas Ortiz III";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in short style with Spanish formatter", () => {
      expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "short", locale: 'es-MX'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style with Spanish formatter", () => {
       expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "medium", locale: 'es-MX'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style with Spanish formatter", () => {
     expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "long", locale: 'es-MX'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in full style with Spanish formatter", () => {
     expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({style: "full", locale: 'es-MX'});
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

});
