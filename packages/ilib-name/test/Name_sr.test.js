/*
 * testname_sr_Cyrl_RS.js - test the name object in Serbian
 *
 * Copyright © 2013-2015,2017, JEгосподинSoft
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

describe("Name_sr", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            await LocaleData.ensureLocale("sr-Cyrl-RS");
        }
    });

    test("should parse a simple Serbian name", () => {
        expect.assertions(2);
        const parsed = new Name("Александар Дероко", {locale: 'sr-Cyrl-RS'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Александар",
            familyName: "Дероко"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Serbian name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("Александар Дероко млађи", {locale: 'sr-Cyrl-RS'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "млађи",
            givenName: "Александар",
            familyName: "Дероко"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Serbian title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("господин. Дероко", {locale: 'sr-Cyrl-RS'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "господин.",
            familyName: "Дероко"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a complete Serbian name", () => {
        expect.assertions(2);
        const parsed = new Name("господин. и госпођа. Дероко", {locale: 'sr-Cyrl-RS'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "господин. и госпођа.",
            familyName: "Дероко"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Serbian name with a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("господин. Александар Дероко", {locale: 'sr-Cyrl-RS'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "господин.",
            givenName: "Александар",
            familyName: "Дероко"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Serbian name with prefix and suffix", () => {
        expect.assertions(2);
        const parsed = new Name("заменик председника Александар Дероко млађи", {locale: 'sr-Cyrl-RS'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "заменик председника",
            givenName: "Александар",
            familyName: "Дероко",
            suffix:"млађи"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Serbian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Александар",
            familyName: "Дероко"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Александар Дероко";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Serbian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Александар",
            familyName: "Дероко"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Александар Дероко";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Serbian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "Александар",
            familyName: "Дероко",
            suffix: "asdf"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Александар Дероко";

        expect(formatted).toBe(expected);
    });

    test("should format a Serbian surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "господин. и госпођа.",
            familyName: "Дероко"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "господин. и госпођа. Дероко";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Serbian name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "председавајућа",
            givenName: "Александар",
            familyName: "Дероко",
            suffix: "млађи"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "председавајућа Александар Дероко млађи";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Serbian name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "председавајућа",
            givenName: "Александар",
            familyName: "Дероко"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Александар Дероко";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Serbian name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "председавајућа",
            givenName: "Александар",
            familyName: "Дероко"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "Александар Дероко";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Serbian name in long style", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "председавајућа",
            givenName: "Александар",
            familyName: "Дероко"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'sr-Cyrl-RS'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "председавајућа Александар Дероко";

        expect(formatted).toBe(expected);
    });
});
