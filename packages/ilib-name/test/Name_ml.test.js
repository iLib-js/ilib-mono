/*
 * Name_ml.test.js - test the name object in Malalyam
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

describe("Name_ml", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("ml-IN");
        }
    });

    test("should parse a simple Malayalam name", () => {
        expect.assertions(2);
        const parsed = new Name("മോഹന ലള", {locale: 'ml-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "മോഹന",
            familyName: "ലള"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title", () => {
        expect.assertions(2);
        const parsed = new Name("മോഹന ലള ജൂനിയര്‍", {locale: 'ml-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "ജൂനിയര്‍",
            givenName: "മോഹന",
            familyName: "ലള"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a title with family name only", () => {
        expect.assertions(2);
        const parsed = new Name("മിസ്റ്റര്‍ ലള", {locale: 'ml-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "മിസ്റ്റര്‍",
            familyName: "ലള"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a name with everything", () => {
        expect.assertions(2);
        const parsed = new Name("മിസ്റ്റര്‍ ആന്‍ഡ് മാഡം ലള", {locale: 'ml-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "മിസ്റ്റര്‍ ആന്‍ഡ് മാഡം",
            familyName: "ലള"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a prefix", () => {
        expect.assertions(2);
        const parsed = new Name("മിസ്റ്റര്‍ മോഹന ലള", {locale: 'ml-IN'});
        expect(parsed).toBeTruthy();

        const expected = {
            prefix: "മിസ്റ്റര്‍",
            givenName: "മോഹന",
            familyName: "ലള"
        };

        expect(parsed).toMatchObject(expected);
    });

    /*
     * Format Tests
     */

    test("should format a simple name short", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "മോഹന",
            familyName: "ലള"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ml-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "മോഹന ലള";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name medium", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "മോഹന",
            familyName: "ലള"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ml-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "മോഹന ലള";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name long", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "മോഹന",
            familyName: "ലള"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ml-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "മോഹന ലള";

        expect(formatted).toBe(expected);
    });

    test("should format a surname", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "മിസ്റ്റര്‍ ആന്‍ഡ് മാഡം",
            familyName: "ലള"
        });
        let fmt = new NameFmt({
            style: "long",
            locale: 'ml-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "മിസ്റ്റര്‍ ആന്‍ഡ് മാഡം ലള";

        expect(formatted).toBe(expected);
    });

    test("should format a simple name full", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ഡോക്ടര്‍",
            givenName: "മോഹന",
            familyName: "ലള",
            suffix: "ജൂനിയര്‍"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ml-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ഡോക്ടര്‍ മോഹന ലള ജൂനിയര്‍";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name short", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ഡോക്ടര്‍",
            givenName: "മോഹന",
            familyName: "ലള"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ml-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "മോഹന ലള";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name medium", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ഡോക്ടര്‍",
            givenName: "മോഹന",
            familyName: "ലള"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ml-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "മോഹന ലള";

        expect(formatted).toBe(expected);
    });

    test("should format a complex name long", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "ഡോക്ടര്‍",
            givenName: "മോഹന",
            familyName: "ലള"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ml-IN'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "ഡോക്ടര്‍ മോഹന ലള";

        expect(formatted).toBe(expected);
    });

});
