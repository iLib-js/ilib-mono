/*
 * Name_nb.test.js - test the name object in Norwegian Bokmal
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

describe("Name_nb", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("nb-NO");
        }
    });

    test("should parse a simple Norwegian Bokmål name", () => {
        expect.assertions(2);
        const parsed = new Name("Maria Bonnevie", {locale: 'nb-NO'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Maria",
            familyName: "Bonnevie"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title", () => {
        expect.assertions(2);
        const parsed = new Name("Maria Bonnevie pensjonert", {locale: 'nb-NO'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "pensjonert",
            givenName: "Maria",
            familyName: "Bonnevie"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("Mrs. Bonnevie", {locale: 'nb-NO'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Mrs.",
            familyName: "Bonnevie"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a name with everything", () => {
        expect.assertions(2);
        const parsed = new Name("Mr. og Mrs. Bonnevie", {locale: 'nb-NO'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Mr. og Mrs.",
            familyName: "Bonnevie"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("Mrs. Maria Bonnevie", {locale: 'nb-NO'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Mrs.",
            givenName: "Maria",
            familyName: "Bonnevie"
        };

        expect(parsed).toMatchObject(expected);
    });

    /*
     * Format Tests
     */

    test("should format a simple name short", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Maria",
            familyName: "Bonnevie"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'nb-NO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Maria Bonnevie";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name medium", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Maria",
            familyName: "Bonnevie"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'nb-NO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Maria Bonnevie";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name long", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Maria",
            familyName: "Bonnevie",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'nb-NO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Maria Bonnevie";

        expect(formatted).toBe(expected);
    });

    test("should format a surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Mr. og Mrs.",
            familyName: "Bonnevie"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'nb-NO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Mr. og Mrs. Bonnevie";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name full", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "vice president",
            givenName: "Maria",
            familyName: "Bonnevie",
            suffix: "pensjonert"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'nb-NO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "vice president Maria Bonnevie pensjonert";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "vice president",
            givenName: "Maria",
            familyName: "Bonnevie"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'nb-NO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Maria Bonnevie";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name medium", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "vice president",
            givenName: "Maria",
            familyName: "Bonnevie"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'nb-NO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Maria Bonnevie";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name long", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "vice president",
            givenName: "Maria",
            familyName: "Bonnevie"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'nb-NO'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "vice president Maria Bonnevie";

        expect(formatted).toBe(expected);
    });

});
