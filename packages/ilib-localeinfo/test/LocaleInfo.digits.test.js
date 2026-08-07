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
 * LocaleInfo.digits.test.js - LocaleInfo Jest tests
 */
import LocaleInfo from '../src/index.js';
import { setLocale, getPlatform } from 'ilib-env';
import { LocaleData } from 'ilib-localedata';
import { localeList } from './locales.js';

describe("LocaleInfo.digits", () => {

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

    test("should leave digits undefined for western locales", () => {
        expect.assertions(2);
        var li = new LocaleInfo("en-US");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(typeof(li.getDigits()) === "undefined").toBeTruthy()
    });

    test("should leave native digits undefined for western locales", () => {
        expect.assertions(2);
        var li = new LocaleInfo("en-US");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(typeof(li.getDigits()) === "undefined").toBeTruthy()
    });

    test("should leave digits undefined when non-western digits are optional", () => {
        expect.assertions(2);
        var li = new LocaleInfo("hi-IN");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(typeof(li.getDigits()) === "undefined").toBeTruthy()
    });

    test("should get native digits for a non-western locale", () => {
        expect.assertions(2);
        var li = new LocaleInfo("hi-IN");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getNativeDigits()).toBe("०१२३४५६७८९")
    });

    test("should get usual non-western digits", () => {
        expect.assertions(2);
        var li = new LocaleInfo("bn-IN");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getDigits()).toBe("০১২৩৪৫৬৭৮৯")
    });

    test("should get usual native non-western digits", () => {
        expect.assertions(2);
        var li = new LocaleInfo("bn-IN");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getNativeDigits()).toBe("০১২৩৪৫৬৭৮৯")
    });

    test("should get the western digits style", () => {
        expect.assertions(2);
        var li = new LocaleInfo("en-US");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getDigitsStyle()).toBe("western")
    });

    test("should get the optional digits style", () => {
        expect.assertions(2);
        var li = new LocaleInfo("hi-IN");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getDigitsStyle()).toBe("optional")
    });

    test("should get the native digits style", () => {
        expect.assertions(2);
        var li = new LocaleInfo("bn-IN");
        expect(typeof(li) !== "undefined").toBeTruthy()
        expect(li.getDigitsStyle()).toBe("native")
    });
});
