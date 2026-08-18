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
import { setupLocaleInfoTests } from './setup.js';

describe("LocaleInfo.names", () => {

    setupLocaleInfoTests();

    test("should get the language name for he-IL", () => {
        expect.assertions(2);
        const li = new LocaleInfo("he-IL");
        expect(li).not.toBeUndefined()
        expect(li.getLanguageName()).toBe("Hebrew")
    });

    test("should get the language name for es-MX", () => {
        expect.assertions(2);
        const li = new LocaleInfo("es-MX");
        expect(li).not.toBeUndefined()
        expect(li.getLanguageName()).toBe("Spanish")
    });

    test("should get the language name for asa-TZ", () => {
        expect.assertions(2);
        const li = new LocaleInfo("asa-TZ");
        expect(li).not.toBeUndefined()
        expect(li.getLanguageName()).toBe("Asu")
    });

    test("should get the language name for mus", () => {
        expect.assertions(2);
        const li = new LocaleInfo("mus");
        expect(li).not.toBeUndefined()
        expect(li.getLanguageName()).toBe("Muscogee")
    });

    test("should get the language name for cic", () => {
        expect.assertions(2);
        const li = new LocaleInfo("cic");
        expect(li).not.toBeUndefined()
        expect(li.getLanguageName()).toBe("Chickasaw")
    });

    test("should get the region name for he-IL", () => {
        expect.assertions(2);
        const li = new LocaleInfo("he-IL");
        expect(li).not.toBeUndefined()
        expect(li.getRegionName()).toBe("Israel")
    });

    test("should get the region name for es-MX", () => {
        expect.assertions(2);
        const li = new LocaleInfo("es-MX");
        expect(li).not.toBeUndefined()
        expect(li.getRegionName()).toBe("Mexico")
    });

    test("should get the region name for asa-TZ", () => {
        expect.assertions(2);
        const li = new LocaleInfo("asa-TZ");
        expect(li).not.toBeUndefined()
        expect(li.getRegionName()).toBe("Tanzania")
    });

    test("should get the region name for MK", () => {
        expect.assertions(2);
        const li = new LocaleInfo("MK");
        expect(li).not.toBeUndefined()
        expect(li.getRegionName()).toBe("North Macedonia")
    });

    test("should get the region name for MO", () => {
        expect.assertions(2);
        const li = new LocaleInfo("MO");
        expect(li).not.toBeUndefined()
        expect(li.getRegionName()).toBe("Macao SAR China")
    });

    test("should get the region name for SZ", () => {
        expect.assertions(2);
        const li = new LocaleInfo("SZ");
        expect(li).not.toBeUndefined()
        expect(li.getRegionName()).toBe("Eswatini")
    });

    test("should get the region name for XX", () => {
        expect.assertions(2);
        const li = new LocaleInfo("XX");
        expect(li).not.toBeUndefined()
        expect(li.getRegionName()).toBe("Unknown")
    });

    test("should get the region name for XA", () => {
        expect.assertions(2);
        const li = new LocaleInfo("XA");
        expect(li).not.toBeUndefined()
        expect(li.getRegionName()).toBe("Pseudo-Accents")
    });

    test("should get the region name for XB", () => {
        expect.assertions(2);
        const li = new LocaleInfo("XB");
        expect(li).not.toBeUndefined()
        expect(li.getRegionName()).toBe("Pseudo-Bidi")
    });
});
