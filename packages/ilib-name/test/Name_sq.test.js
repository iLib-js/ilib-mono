/*
 * testname_sq_AL.js - test the name object in Albanian
 *
 * Copyright © 2013-2015,2017, JEDLSoft
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

describe("Name_sq", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("sq-AL");
        }
    });

    test("should parse a simple Albanian name", () => {
        expect.assertions(2);
        const parsed = new Name("James Belushi", {locale: 'sq-AL'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "James",
            familyName: "Belushi"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Albanian name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("James Belushi njom", {locale: 'sq-AL'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "njom",
            givenName: "James",
            familyName: "Belushi"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Albanian title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("Zoti. Belushi", {locale: 'sq-AL'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Zoti.",
            familyName: "Belushi"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Albanian name", () => {
        expect.assertions(2);
        const parsed = new Name("Zoti. dhe Zonja. Belushi", {locale: 'sq-AL'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Zoti. dhe Zonja.",
            familyName: "Belushi"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Albanian name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("Zoti. James Belushi", {locale: 'sq-AL'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Zoti.",
            givenName: "James",
            familyName: "Belushi"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Albanian name with prefix and suffix", () => {
        expect.assertions(2);
        const parsed = new Name("Zëvendëspresident James Belushi njom", {locale: 'sq-AL'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Zëvendëspresident",
            givenName: "James",
            familyName: "Belushi",
            suffix:"njom"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Albanian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "James",
            familyName: "Belushi"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "James Belushi";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Albanian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "James",
            familyName: "Belushi"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "James Belushi";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Albanian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "James",
            familyName: "Belushi",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "James Belushi";

        expect(formatted).toBe(expected);
    });

    test("should format a Albanian surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Zoti. dhe Zonja.",
            familyName: "Belushi"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Zoti. dhe Zonja. Belushi";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Albanian name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Guvernator",
            givenName: "James",
            familyName: "Belushi",
            suffix: "njom"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Guvernator James Belushi njom";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Albanian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Guvernator",
            givenName: "James",
            familyName: "Belushi"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "James Belushi";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Albanian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Guvernator",
            givenName: "James",
            familyName: "Belushi"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "James Belushi";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Albanian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Guvernator",
            givenName: "James",
            familyName: "Belushi"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sq-AL'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Guvernator James Belushi";

        expect(formatted).toBe(expected);
    });
});
