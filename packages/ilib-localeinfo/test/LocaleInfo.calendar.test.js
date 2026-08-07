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
 * LocaleInfo.calendar.test.js - LocaleInfo Jest tests
 */
import LocaleInfo from '../src/index.js';
import { setLocale, getPlatform } from 'ilib-env';
import { LocaleData } from 'ilib-localedata';
import { localeList } from './locales.js';

describe("LocaleInfo.calendar", () => {
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

    test("should get the clock for the US locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo("en-US");
        expect(info !== null).toBeTruthy()

        expect(info.getClock()).toBe("12")
    });

    test("should get the clock for the CA locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo("en-CA");
        expect(info !== null).toBeTruthy()

        expect(info.getClock()).toBe("12")
    });

    test("should get the clock for the GB locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo("en-GB");
        expect(info !== null).toBeTruthy()

        expect(info.getClock()).toBe("24")
    });

    test("should get the clock for the DE locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo("de-DE");
        expect(info !== null).toBeTruthy()

        expect(info.getClock()).toBe("24")
    });

    test("should get the calendar for the US locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo("en-US");
        expect(info !== null).toBeTruthy()

        expect(info.getCalendar()).toBe("gregorian")
    });

    test("should get the calendar for the DE locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo("de-DE");
        expect(info !== null).toBeTruthy()

        expect(info.getCalendar()).toBe("gregorian")
    });

    test("should get the units for the US locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo("en-US");
        expect(info !== null).toBeTruthy()

        expect(info.getUnits()).toBe("uscustomary")
    });

    test("should get the units for the CA locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo("en-CA");
        expect(info !== null).toBeTruthy()

        expect(info.getUnits()).toBe("metric")
    });

    test("should get the units for the GB locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo("en-GB");
        expect(info !== null).toBeTruthy()

        expect(info.getUnits()).toBe("metric")
    });

    test("should get the units for the DE locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo("de-DE");
        expect(info !== null).toBeTruthy()

        expect(info.getUnits()).toBe("metric")
    });

    test("should get the first day of the week for the US locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo("en-US");
        expect(info !== null).toBeTruthy()

        expect(info.getFirstDayOfWeek()).toBe(0)
    });

    test("should get the first day of the week for the DE locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo("de-DE");
        expect(info !== null).toBeTruthy()

        expect(info.getFirstDayOfWeek()).toBe(1)
    });

    test("should get the first day of the week for the FR locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo("fr-FR");
        expect(info !== null).toBeTruthy()

        expect(info.getFirstDayOfWeek()).toBe(1)
    });

    test("should get the rounding mode for the default locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo();
        expect(info !== null).toBeTruthy()

        expect(info.getRoundingMode()).toBe("halfdown")
    });

    test("should get the rounding mode for the yy locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo("yy-YY");
        expect(info !== null).toBeTruthy()

        expect(info.getRoundingMode()).toBe("halfdown")
    });
});
