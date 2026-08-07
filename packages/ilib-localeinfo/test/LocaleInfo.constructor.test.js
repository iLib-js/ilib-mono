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
 * LocaleInfo.constructor.test.js - LocaleInfo Jest tests
 */
import LocaleInfo from '../src/index.js';
import { setLocale, getPlatform } from 'ilib-env';
import { LocaleData } from 'ilib-localedata';
import { localeList } from './locales.js';

describe("LocaleInfo.constructor", () => {

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

    test("should construct a LocaleInfo instance", () => {
        expect.assertions(1);
        var loc = new LocaleInfo();
        expect(loc !== null).toBeTruthy()
    });

    test("should construct a LocaleInfo for the current locale", () => {
        expect.assertions(4);
        setLocale(undefined);
        var loc, info = new LocaleInfo(); // gives locale of the host JS engine

        expect(info !== null).toBeTruthy()

        loc = info.getLocale();

        expect(loc.getLanguage()).toBe("en")
        expect(loc.getRegion()).toBe("US")
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy()
    });

    test("should construct a LocaleInfo for a given locale", () => {
        expect.assertions(4);
        var loc, info = new LocaleInfo("de-DE");

        expect(info !== null).toBeTruthy()

        loc = info.getLocale();

        expect(loc.getLanguage()).toBe("de")
        expect(loc.getRegion()).toBe("DE")
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy()
    });
});
