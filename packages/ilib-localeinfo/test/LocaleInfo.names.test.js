/*
 * Copyright © 2022-2026 JEDLSoft
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
 *
 * LocaleInfo.names.test.js - LocaleInfo Jest tests
 */
import LocaleInfo from '../src/index.js';
import { setLocale, getPlatform } from 'ilib-env';
import { LocaleData } from 'ilib-localedata';
import { localeList } from './locales.js';

describe("LocaleInfo.names", () => {

    beforeAll(async () => {
        setLocale("en-US");
        if (getPlatform() === "browser") {
            // Browser does not support sync locale loads; preload locales used by tests.
            for (const locale of localeList.locales) {
                await LocaleData.ensureLocale(locale);
            }
        }
    });

    beforeEach(() => {
        setLocale("en-US");
    });

    test("should get the language name for he-IL", () => {
        expect.assertions(2);
        var li = new LocaleInfo("he-IL");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getLanguageName()).toBe("Hebrew")
    });

    test("should get the language name for es-MX", () => {
        expect.assertions(2);
        var li = new LocaleInfo("es-MX");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getLanguageName()).toBe("Spanish")
    });

    test("should get the language name for asa-TZ", () => {
        expect.assertions(2);
        var li = new LocaleInfo("asa-TZ");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getLanguageName()).toBe("Asu")
    });

    test("should get the language name for mus", () => {
        expect.assertions(2);
        var li = new LocaleInfo("mus");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getLanguageName()).toBe("Muscogee")
    });

    test("should get the language name for cic", () => {
        expect.assertions(2);
        var li = new LocaleInfo("cic");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getLanguageName()).toBe("Chickasaw")
    });

    test("should get the language name for na", () => {
        // the country was renamed to Naoero, but the language name is unchanged
        expect.assertions(2);
        var li = new LocaleInfo("na");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getLanguageName()).toBe("Nauru")
    });

    test("should get the region name for he-IL", () => {
        expect.assertions(2);
        var li = new LocaleInfo("he-IL");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getRegionName()).toBe("Israel")
    });

    test("should get the region name for es-MX", () => {
        expect.assertions(2);
        var li = new LocaleInfo("es-MX");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getRegionName()).toBe("Mexico")
    });

    test("should get the region name for asa-TZ", () => {
        expect.assertions(2);
        var li = new LocaleInfo("asa-TZ");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getRegionName()).toBe("Tanzania")
    });

    test("should get the region name for MK", () => {
        expect.assertions(2);
        var li = new LocaleInfo("MK");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getRegionName()).toBe("North Macedonia")
    });

    test("should get the region name for MO", () => {
        expect.assertions(2);
        var li = new LocaleInfo("MO");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getRegionName()).toBe("Macao SAR China")
    });

    test("should get the region name for SZ", () => {
        expect.assertions(2);
        var li = new LocaleInfo("SZ");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getRegionName()).toBe("Eswatini")
    });

    test("should get the region name for XX", () => {
        expect.assertions(2);
        var li = new LocaleInfo("XX");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getRegionName()).toBe("Unknown")
    });

    test("should get the region name for XA", () => {
        expect.assertions(2);
        var li = new LocaleInfo("XA");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getRegionName()).toBe("Pseudo-Accents")
    });

    test("should get the region name for XB", () => {
        expect.assertions(2);
        var li = new LocaleInfo("XB");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getRegionName()).toBe("Pseudo-Bidi")
    });

    test("should get the region name for NR", () => {
        expect.assertions(2);
        var li = new LocaleInfo("NR");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getRegionName()).toBe("Naoero")
    });
});
