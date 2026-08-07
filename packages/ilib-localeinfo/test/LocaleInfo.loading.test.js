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
 * LocaleInfo.loading.test.js - locale data loading LocaleInfo Jest tests
 *
 * These were commented out in the former nodeunit suite (legacy global `ilib.*`
 * loader APIs). Converted here and left skipped so they can be re-enabled once
 * updated for the current LocaleData / MockLoader loading model.
 */

import LocaleInfo from '../src/index.js';
import { setLocale, getPlatform, setPlatform } from 'ilib-env';
import { registerLoader } from 'ilib-loader';
import { LocaleData } from 'ilib-localedata';
import MockLoader from './MockLoader.js';
import { localeList } from './locales.js';

describe("LocaleInfo.loading", () => {

    beforeAll(async () => {
        setLocale("en-US");
        if (getPlatform() === "browser") {
            for (const locale of localeList.locales) {
                await LocaleData.ensureLocale(locale);
            }
        }
    });

    beforeEach(() => {
        setLocale("en-US");
    });

    // Formerly testLocaleInfoLoadMissingDataAsynch
    test.skip("should load missing locale data asynchronously", async () => {
        expect.assertions(5);
        LocaleData.clearCache();
        registerLoader(MockLoader);
        setPlatform("mock");

        const info = await LocaleInfo.create("yyy-ZX");
        expect(info !== null).toBeTruthy();
        expect(info.getCurrencyFormats().iso).toBe("iso {s} {n}");
        expect(info.getFirstDayOfWeek()).toBe(4);
        expect(info.getPercentageSymbol()).toBe("%");
        // final null-check from the original suite
        expect(info).toBeTruthy();
    });

    // Formerly testLocaleInfoLoadMissingDataSync
    test.skip("should load missing locale data synchronously", () => {
        expect.assertions(4);
        LocaleData.clearCache();
        registerLoader(MockLoader);
        setPlatform("mock");

        const info = new LocaleInfo("yyy-ZX");
        expect(info !== null).toBeTruthy();
        expect(info.getCurrencyFormats().iso).toBe("iso {s} {n}");
        expect(info.getFirstDayOfWeek()).toBe(4);
        expect(info.getPercentageSymbol()).toBe("%");
    });

    // Formerly testLocaleInfoLoadMissingDataAsynchNoData
    test.skip("should load asynchronously when no locale data is available", async () => {
        expect.assertions(5);
        LocaleData.clearCache();
        registerLoader(MockLoader);
        setPlatform("mock");

        const info = await LocaleInfo.create("qq-QQ");
        expect(typeof(info) !== "undefined").toBeTruthy();
        // should return the shared data only
        expect(info.getCurrencyFormats().common).toBe("{s}{n}");
        expect(info.getFirstDayOfWeek()).toBe(1);
        expect(info.getPercentageSymbol()).toBe("%");
        expect(info !== null).toBeTruthy();
    });

    // Formerly testLocaleInfoMissingDataSynchNoDataNoLoader
    test.skip("should fall back synchronously with no data and no loader", () => {
        expect.assertions(5);
        LocaleData.clearCache();
        // Original cleared the loader callback entirely; with no mock loader,
        // missing locale parts should fall back to shared/default data.
        const info = new LocaleInfo("xxx-QQ");
        expect(typeof(info) !== "undefined").toBeTruthy();
        // should return the shared data only
        expect(info.getCurrencyFormats().common).toBe("{s} {n}");
        expect(info.getFirstDayOfWeek()).toBe(1);
        expect(info.getPercentageSymbol()).toBe("%");
        expect(info !== null).toBeTruthy();
    });

    // Formerly testLocaleInfoLoadMissingDataSyncNoData
    test.skip("should load synchronously when no locale data is available", () => {
        expect.assertions(4);
        LocaleData.clearCache();
        registerLoader(MockLoader);
        setPlatform("mock");

        const li = new LocaleInfo("qq-QQ");
        expect(typeof(li) !== "undefined").toBeTruthy();
        // should return the shared data only
        expect(li.getCurrencyFormats().common).toBe("{s}{n}");
        expect(li.getFirstDayOfWeek()).toBe(1);
        expect(li.getPercentageSymbol()).toBe("%");
    });

    // Formerly testLocaleInfoLoadPreassembledDataAsynch
    test.skip("should load preassembled locale data asynchronously", async () => {
        expect.assertions(6);
        registerLoader(MockLoader);
        setPlatform("mock");

        const info = await LocaleInfo.create("fr-FR");
        expect(typeof(info) !== "undefined").toBeTruthy();
        expect(info.getCurrency()).toBe("EUR");
        expect(info.getFirstDayOfWeek()).toBe(1);
        expect(info.info.locale).toBe("FR");
        expect(info.getTimeZone()).toBe("Europe/Paris");
        expect(info !== null).toBeTruthy();
    });

    // Formerly testLocaleInfoLoadMissingLocaleParts
    // Relies on non-standard locale data for fr-FR-overseas (see commented
    // ilib.data.localeinfo_fr_FR_overseas stub in the old suite).
    test.skip("should load a locale with missing parts from assembled data", () => {
        expect.assertions(5);
        const li = new LocaleInfo("fr-FR-overseas");
        expect(typeof(li) !== "undefined").toBeTruthy();
        expect(li.getCurrency()).toBe("USD");
        expect(li.getFirstDayOfWeek()).toBe(1);
        expect(li.info.locale).toBe("fr-FR-overseas");
        expect(li.getTimeZone()).toBe("Pacific/Tahiti");
    });
});
