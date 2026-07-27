/*
 * Name_ms.test.js - test the name object in Malaysian
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

describe("Name_ms", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("ms-MY");
        }
    });

    test("should parse a simple Malay name", () => {
        expect.assertions(2);
        const parsed = new Name("Carmen Soo", {locale: 'ms-MY'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Carmen",
            familyName: "Soo"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title", () => {
        expect.assertions(2);
        const parsed = new Name("Carmen Soo bersara", {locale: 'ms-MY'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "bersara",
            givenName: "Carmen",
            familyName: "Soo"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("cik Soo", {locale: 'ms-MY'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "cik",
            familyName: "Soo"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a name with everything", () => {
        expect.assertions(2);
        const parsed = new Name("encik dan cik Soo", {locale: 'ms-MY'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "encik dan cik",
            familyName: "Soo"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("cik Carmen Soo", {locale: 'ms-MY'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "cik",
            givenName: "Carmen",
            familyName: "Soo"
        };

        expect(parsed).toMatchObject(expected);
    });

    /*
     * Format Tests
     */

    test("should format a simple name short", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Carmen",
            familyName: "Soo"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Carmen Soo";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name medium", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Carmen",
            familyName: "Soo"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Carmen Soo";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name long", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Carmen",
            familyName: "Soo",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Carmen Soo";

        expect(formatted).toBe(expected);
    });

    test("should format a surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "encik dan cik",
            familyName: "Soo"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "encik dan cik Soo";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name full", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "pesuruhjaya",
            givenName: "Carmen",
            familyName: "Soo",
            suffix: "bersara"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "pesuruhjaya Carmen Soo bersara";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "pesuruhjaya",
            givenName: "Carmen",
            familyName: "Soo"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Carmen Soo";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name medium", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "pesuruhjaya",
            givenName: "Carmen",
            familyName: "Soo"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Carmen Soo";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name long", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "pesuruhjaya",
            givenName: "Carmen",
            familyName: "Soo"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ms-MY'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "pesuruhjaya Carmen Soo";

        expect(formatted).toBe(expected);
    });

});
