/*
 * testname_bn_IN.js - test the name object in Bengali
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

describe("Name_bn", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("bn-IN");
        }
    });

    test("should parse a simple Bengali name", () => {
        expect.assertions(2);
        const parsed = new Name("শশী ব্যানার্জী", {locale: 'bn-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "শশী",
            familyName: "ব্যানার্জী"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Bengali name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("শশী ব্যানার্জী কনিষ্ঠ", {locale: 'bn-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "কনিষ্ঠ",
            givenName: "শশী",
            familyName: "ব্যানার্জী"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Bengali title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("এমএস ব্যানার্জী", {locale: 'bn-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "এমএস",
            familyName: "ব্যানার্জী"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Bengali name", () => {
        expect.assertions(2);
        const parsed = new Name("মিঃ এবং মিসেস ব্যানার্জী", {locale: 'bn-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "মিঃ এবং মিসেস",
            familyName: "ব্যানার্জী"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Bengali name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("মিঃ শশী ব্যানার্জী", {locale: 'bn-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "মিঃ",
            givenName: "শশী",
            familyName: "ব্যানার্জী"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Bengali name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "শশী",
            familyName: "ব্যানার্জী"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'bn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "শশী ব্যানার্জী";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Bengali name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "শশী",

            familyName: "ব্যানার্জী"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'bn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "শশী ব্যানার্জী";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Bengali name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "শশী",

            familyName: "ব্যানার্জী",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'bn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "শশী ব্যানার্জী";

        expect(formatted).toBe(expected);
    });

    test("should format a Bengali surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "মিঃ এবং মিসেস",

            familyName: "ব্যানার্জী"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'bn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "মিঃ এবং মিসেস ব্যানার্জী";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Bengali name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ডাক্তার",
            givenName: "শশী",

            familyName: "ব্যানার্জী",
            suffix: " वरिष्ठ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'bn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ডাক্তার শশী ব্যানার্জী वरिष्ठ";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Bengali name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ডাক্তার",
            givenName: "শশী",
            familyName: "ব্যানার্জী"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'bn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "শশী ব্যানার্জী";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Bengali name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ডাক্তার",
            givenName: "শশী",
            familyName: "ব্যানার্জী"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'bn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "শশী ব্যানার্জী";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Bengali name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ডাক্তার",
            givenName: "শশী",
            familyName: "ব্যানার্জী"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'bn-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ডাক্তার শশী ব্যানার্জী";

        expect(formatted).toBe(expected);
    });

});
