/*
 * Name_kk.test.js - test the name object in Kazahk
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

describe("Name_kk", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("kk-KZ");
        }
    });

    test("should parse a simple Kazakh name", () => {
        expect.assertions(2);
        const parsed = new Name("Джордж Буш", {locale: 'kk-KZ'});
        expect(parsed).toBeTruthy();

        const expected =   {
            givenName: "Джордж",
            familyName: "Буш"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Kazakh name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("үлкен Буш", {locale: 'kk-KZ'});
        expect(parsed).toBeTruthy();

        const expected =   {
            prefix: "үлкен",
            familyName: "Буш"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Kazakh name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Джордж Буш 2-ші", {locale: 'kk-KZ'});
        expect(parsed).toBeTruthy();

        const expected =    {
            suffix: "2-ші",
            givenName: "Джордж",
            familyName: "Буш"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a full Kazakh name", () => {
        expect.assertions(2);
        const parsed = new Name("үлкен Джордж Буш 2-ші", {locale: 'kk-KZ'});
        expect(parsed).toBeTruthy();

        const expected =    {
            prefix: "үлкен",
            givenName: "Джордж",
            familyName: "Буш",
            suffix: "2-ші"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Kazakh name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Джордж",
            familyName: "Буш"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'kk-KZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Джордж Буш";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Kazakh name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Джордж",
            familyName: "Буш"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'kk-KZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Джордж Буш";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Kazakh name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Джордж",
            familyName: "Буш",
            suffix: "2-ші"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'kk-KZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Джордж Буш";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Kazakh name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "үлкен",
            givenName: "Джордж",
            familyName: "Буш",
            suffix: "2-ші"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'kk-KZ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "үлкен Джордж Буш 2-ші";

        expect(formatted).toBe(expected);
    });

});
