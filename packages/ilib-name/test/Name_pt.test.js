/*
 * Name_pt.test.js - test the name object in Portugese
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

describe("Name_pt", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("pt-PT");
        }
    });

    test("should parse a simple Portuguese name", () => {
        expect.assertions(2);
        const parsed = new Name("Cristiano Ronaldo", {locale: 'pt-PT'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Cristiano",
            familyName: "Ronaldo"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a simple name with two family names", () => {
        expect.assertions(2);
        const parsed = new Name("José Eduardo Tavares Silva", {locale: 'pt-PT'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "José",
            middleName: "Eduardo",
            familyName: "Tavares Silva"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title", () => {
        expect.assertions(2);
        const parsed = new Name("Cristiano Ronaldo aposentados", {locale: 'pt-PT'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "aposentados",
            givenName: "Cristiano",
            familyName: "Ronaldo"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("Senhor Ronaldo", {locale: 'pt-PT'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Senhor",
            familyName: "Ronaldo"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a name with everything", () => {
        expect.assertions(2);
        const parsed = new Name("Senhor e Senhora Ronaldo", {locale: 'pt-PT'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Senhor e Senhora",
            familyName: "Ronaldo"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("Senhor Cristiano Ronaldo", {locale: 'pt-PT'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Senhor",
            givenName: "Cristiano",
            familyName: "Ronaldo"
        };

        expect(parsed).toMatchObject(expected);
    });

    /*
     * Format Tests
     */

    test("should format a simple name short", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Cristiano",
            familyName: "Ronaldo"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Cristiano Ronaldo";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name medium", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Cristiano",
            familyName: "Ronaldo"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Cristiano Ronaldo";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name long", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Cristiano",
            familyName: "Ronaldo",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Cristiano Ronaldo";

        expect(formatted).toBe(expected);
    });

    test("should format a surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Senhor e Senhori",
            familyName: "Ronaldo"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Senhor e Senhori Ronaldo";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name full", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "presidente",
            givenName: "Cristiano",
            familyName: "Ronaldo",
            suffix: "aposentados"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "presidente Cristiano Ronaldo aposentados";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "presidente",
            givenName: "Cristiano",
            familyName: "Ronaldo"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Cristiano Ronaldo";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name medium", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "presidente",
            givenName: "Cristiano",
            familyName: "Ronaldo"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Cristiano Ronaldo";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name long", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "presidente",
            givenName: "Cristiano",
            familyName: "Ronaldo"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'pt-PT'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "presidente Cristiano Ronaldo";

        expect(formatted).toBe(expected);
    });

});
