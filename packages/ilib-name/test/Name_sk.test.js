/*
 * testname_sk_SK.js - test the name object in Slovak
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

describe("Name_sk", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("sk-SK");
        }
    });

    test("should parse a simple Slovak name", () => {
        expect.assertions(2);
        const parsed = new Name("Iveta Stan", {locale: 'sk-SK'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Iveta",
            familyName: "Stan"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Slovak name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Iveta Stan dôchodku", {locale: 'sk-SK'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "dôchodku",
            givenName: "Iveta",
            familyName: "Stan"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Slovak title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("Pán. Stan", {locale: 'sk-SK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Pán.",
            familyName: "Stan"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Slovak name", () => {
        expect.assertions(2);
        const parsed = new Name("Pán. a pani. Stan", {locale: 'sk-SK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Pán. a pani.",
            familyName: "Stan"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Slovak name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("Pán. Iveta Stan", {locale: 'sk-SK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Pán.",
            givenName: "Iveta",
            familyName: "Stan"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Slovak name with prefix and suffix", () => {
        expect.assertions(2);
        const parsed = new Name("Viceprezident Iveta Stan dôchodku", {locale: 'sk-SK'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "Viceprezident",
            givenName: "Iveta",
            familyName: "Stan",
            suffix:"dôchodku"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Slovak name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Iveta",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Iveta Stan";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Slovak name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Iveta",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Iveta Stan";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Slovak name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Iveta",
            familyName: "Stan",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Iveta Stan";

        expect(formatted).toBe(expected);
    });

    test("should format a Slovak surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "Pán. a pani.",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Pán. a pani. Stan";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Slovak name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "princezná",
            givenName: "Iveta",
            familyName: "Stan",
            suffix: "dôchodku"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "princezná Iveta Stan dôchodku";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Slovak name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "princezná",
            givenName: "Iveta",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Iveta Stan";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Slovak name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "princezná",
            givenName: "Iveta",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Iveta Stan";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Slovak name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "princezná",
            givenName: "Iveta",
            familyName: "Stan"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sk-SK'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "princezná Iveta Stan";

        expect(formatted).toBe(expected);
    });
});
