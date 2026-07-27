/*
 * testname_tr_TR.js - test the name object in Turkish
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

describe("Name_tr", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("tr-TR");
        }
    });

    test("should parse a simple Turkish name", () => {
        expect.assertions(2);
        const parsed = new Name("Kemal Sunal", {locale: 'tr-TR'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Kemal",
            familyName: "Sunal"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Turkish name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Kemal Sunal kıdemli", {locale: 'tr-TR'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "kıdemli",
            givenName: "Kemal",
            familyName: "Sunal"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Turkish title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("Bay Sunal", {locale: 'tr-TR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Bay",
            familyName: "Sunal"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Turkish name", () => {
        expect.assertions(2);
        const parsed = new Name("Bay ve Bayan Sunal", {locale: 'tr-TR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Bay ve Bayan",
            familyName: "Sunal"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Turkish name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("Bay Kemal Sunal", {locale: 'tr-TR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Bay",
            givenName: "Kemal",
            familyName: "Sunal"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Turkish name with prefix and suffix", () => {
        expect.assertions(2);
        const parsed = new Name("belediye başkanı Kemal Sunal kıdemli", {locale: 'tr-TR'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "belediye başkanı",
            givenName: "Kemal",
            familyName: "Sunal",
            suffix:"kıdemli"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Turkish name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Kemal",
            familyName: "Sunal"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'tr-TR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Kemal Sunal";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Turkish name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Kemal",
            familyName: "Sunal"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'tr-TR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Kemal Sunal";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Turkish name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Kemal",
            familyName: "Sunal",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'tr-TR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Kemal Sunal";

        expect(formatted).toBe(expected);
    });

    test("should format a Turkish surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Bay ve Bayan",
            familyName: "Sunal"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'tr-TR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Bay ve Bayan Sunal";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Turkish name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Bakan",
            givenName: "Kemal",
            familyName: "Sunal",
            suffix: "kıdemli"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'tr-TR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Bakan Kemal Sunal kıdemli";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Turkish name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Bakan",
            givenName: "Kemal",
            familyName: "Sunal"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'tr-TR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Kemal Sunal";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Turkish name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Bakan",
            givenName: "Kemal",
            familyName: "Sunal"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'tr-TR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Kemal Sunal";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Turkish name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Bakan",
            givenName: "Kemal",
            familyName: "Sunal"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'tr-TR'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Bakan Kemal Sunal";

        expect(formatted).toBe(expected);
    });
});
