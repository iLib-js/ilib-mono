/*
 * Name_ku_Arab.test.js - test the name object in Kurdish
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

describe("Name_ku_Arab", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("ku-Arab-IQ");
        }
    });

    test("should parse a simple Kurdish Arabic-script name", () => {
        expect.assertions(2);
        const parsed = new Name("جەلال تاڵەبانی", {locale: 'ku-Arab-IQ'});
        expect(parsed).toBeTruthy();

        const expected =   {
            givenName: "جەلال",
            familyName: "تاڵەبانی"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Kurdish Arabic-script name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("بەڕێز و خاتوو تاڵەبانی", {locale: 'ku-Arab-IQ'});
        expect(parsed).toBeTruthy();

        const expected =  {
            prefix: "بەڕێز و خاتوو",
            familyName: "تاڵەبانی"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Kurdish Arabic-script name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("جەلال تاڵەبانی کوڕ", {locale: 'ku-Arab-IQ'});
        expect(parsed).toBeTruthy();

        const expected =    {
            suffix: "کوڕ",
            givenName: "جەلال",
            familyName: "تاڵەبانی"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a full Kurdish Arabic-script name", () => {
        expect.assertions(2);
        const parsed = new Name("بەڕێز جەلال تاڵەبانی", {locale: 'ku-Arab-IQ'});
        expect(parsed).toBeTruthy();

        const expected =    {
            prefix: "بەڕێز",
            givenName: "جەلال",
            familyName: "تاڵەبانی"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Kurdish Arabic-script name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "جەلال",
            familyName: "تاڵەبانی"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ku-Arab-IQ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "جەلال تاڵەبانی";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Kurdish Arabic-script name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "جەلال",
            familyName: "تاڵەبانی"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ku-Arab-IQ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "جەلال تاڵەبانی";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Kurdish Arabic-script name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "جەلال",

            familyName: "تاڵەبانی",
            suffix: "کوڕ"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ku-Arab-IQ'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "جەلال تاڵەبانی کوڕ";

        expect(formatted).toBe(expected);
    });

});
