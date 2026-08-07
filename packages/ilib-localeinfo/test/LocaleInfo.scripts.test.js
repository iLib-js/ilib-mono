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
 * LocaleInfo.scripts.test.js - LocaleInfo Jest tests
 */
import LocaleInfo from '../src/index.js';
import { setLocale, getPlatform } from 'ilib-env';
import { LocaleData } from 'ilib-localedata';
import { localeList } from './locales.js';

describe("LocaleInfo.scripts", () => {

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

    test("should get all scripts for a single-script locale", () => {
        expect.assertions(2);
        var li = new LocaleInfo("nl-NL");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect([].concat(li.getAllScripts()).sort()).toEqual([].concat(["Latn"]).sort());
    });

    test("should get all scripts for a multi-script locale (de-DE)", () => {
        expect.assertions(2);
        var li = new LocaleInfo("de-DE");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect([].concat(li.getAllScripts()).sort()).toEqual([].concat(["Latn", "Runr"]).sort());
    });

    test("should get all scripts for a multi-script locale (uz-UZ)", () => {
        expect.assertions(2);
        var li = new LocaleInfo("uz-UZ");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect([].concat(li.getAllScripts()).sort()).toEqual([].concat(["Arab", "Cyrl", "Latn"]).sort());
    });

    test("should get the default script for a single-script locale", () => {
        expect.assertions(2);
        var li = new LocaleInfo("nl-NL");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getDefaultScript()).toBe("Latn")
    });

    test("should get the default script for a multi-script locale", () => {
        expect.assertions(2);
        var li = new LocaleInfo("uz-UZ");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getDefaultScript()).toBe("Arab")
    });

    test("should get the script for a single-script locale", () => {
        expect.assertions(2);
        var li = new LocaleInfo("nl-NL");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getScript()).toBe("Latn")
    });

    test("should get the script for a multi-script locale", () => {
        expect.assertions(2);
        var li = new LocaleInfo("uz-UZ");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getScript()).toBe("Arab")
    });

    test("should get the script for a multi-script locale with a locale override", () => {
        expect.assertions(2);
        var li = new LocaleInfo("uz-Cyrl-UZ");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getScript()).toBe("Cyrl")
    });
});
