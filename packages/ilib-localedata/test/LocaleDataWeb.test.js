/*
 * LocaleDataWeb.test.js - test the locale data class synchronously
 * on a browser
 *
 * Copyright © 2022, 2025-2026 JEDLSoft
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

import { setPlatform, getPlatform } from 'ilib-env';
import { registerLoader } from 'ilib-loader';

import LocaleData from '../src/LocaleData.js';

describe("LocaleDataWeb", () => {
    test("should create LocaleData in async mode when web loader doesn't support sync", () => {
        expect.assertions(1);

        // browsers cannot load synchronously, so the instance falls back to async
        // instead of throwing. Preassembled data can still be read synchronously
        // through loadData, which is how ilib classes work in a browser.
        const locData = new LocaleData({
            path: "./test/testfiles/files3",
            sync: true
        });

        expect(locData.isSync()).toBe(false);
    });

    test("should create LocaleData in async mode by default", async () => {
        expect.assertions(2);

        const locData = new LocaleData({
            path: "./test/testfiles/files3"
        });
        expect(!locData.isSync()).toBe(true);

        // should use async mode
        const actual = locData.loadData({
            basename: "info",
            locale: "root"
        });

        expect(actual instanceof Promise).toBe(true);

        // the load writes into the globally shared cache when it settles, so it
        // must finish inside this test instead of landing in a later one
        await actual;
    });

    test("should throw error when sync loading not supported", () => {
        expect.assertions(3);

        const locData = new LocaleData({
            path: "./test/testfiles/files3"
        });

        expect(locData).toBeTruthy();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();
        LocaleData.addGlobalRoot("./test/testfiles/files3");

        expect(!locData.checkCache("de-DE", "info")).toBe(true);

        // we request sync loading but the loader does
        // not support it and the data is not already
        // previously loaded, so it should throw an
        // exception because the data cannot be loaded
        try {
            locData.loadData({
                basename: "info",
                locale: "de-DE",
                sync: true
            });
            fail("Expected loadData to throw");
        } catch (e) {
            expect(e).toBeDefined();
        }
    });

    test("should load sync data previously loaded", async () => {
        expect.assertions(6);

        const locData = new LocaleData({
            path: "./test/testfiles/files3"
        });

        expect(locData).toBeTruthy();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();
        LocaleData.addGlobalRoot("./test/testfiles/files3");

        // First load the data asynchronously to populate the merged cache
        const firstLoad = await locData.loadData({
            basename: "info",
            locale: "de-DE"
        });
        expect(firstLoad).toBeDefined();
        expect(locData.checkCache("de-DE", "info")).toBe(true);

        // Now subsequent loads should return the cached merged data directly
        // even when sync is requested (because data is already in merged cache)
        const actual = locData.loadData({
            basename: "info",
            locale: "de-DE",
            sync: true
        });
        expect(!!actual).toBe(true);
        expect(typeof(actual)).toBe("object");

        const expected = {
            "a": "b de files3",
            "c": "d de files3"
        };
        expect(actual).toEqual(expected);
    });

    test("should load sync data that ensureLocale preloaded", async () => {
        expect.assertions(3);

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();
        LocaleData.addGlobalRoot("./test/testfiles/files3");

        const locData = new LocaleData({
            path: "./test/testfiles/files3",
            sync: true
        });

        // this is how ilib classes work in a browser: preload the whole locale
        // from a preassembled file, then read it synchronously afterwards
        expect(await LocaleData.ensureLocale("de-DE")).toBe(true);
        expect(locData.checkCache("de-DE", "foo")).toBe(true);

        // the data was never merged before, so this must merge it out of the
        // preloaded data rather than trying to load anything synchronously
        const actual = locData.loadData({
            basename: "foo",
            locale: "de-DE",
            sync: true
        });

        expect(actual).toEqual({
            "m": "n de",
            "o": "p de",
            "q": "r de"
        });
    });

    test("should load sync data that ensureLocale preloaded from the default root", async () => {
        expect.assertions(3);

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        // this is how a browser app is set up: the package has its own path, and
        // the preassembled files live in the directory that the bundler points at,
        // so ensureLocale finds them under its default root instead
        const locData = new LocaleData({
            path: "./test/testfiles/files3",
            sync: true
        });

        expect(await LocaleData.ensureLocale("fr-FR")).toBe(true);
        expect(locData.checkCache("fr-FR", "foo")).toBe(true);

        const actual = locData.loadData({
            basename: "foo",
            locale: "fr-FR",
            sync: true
        });

        expect(actual).toEqual({
            "m": "n fr",
            "o": "p root",
            "q": "r fr"
        });
    });

    test("should ensure locale json right data sync no roots", async () => {
        setPlatform();

        // only do this test on browsers with webpack -- nodejs always
        // requires a global root so we know where to load files from
        expect.assertions(3);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/testfiles/files3"
        });

        // First load asynchronously to populate merged cache
        const firstLoad = await locData.loadData({
            locale: "ja-JP",
            basename: "info"
        });
        expect(firstLoad).toBeDefined();
        expect(locData.checkCache("ja-JP", "info")).toBe(true);

        // Now can load synchronously because data is in merged cache
        let data = locData.loadData({
            sync: true,
            locale: "ja-JP",
            basename: "info"
        });

        expect(data).toEqual({
            "a": "b ja",
            "c": "d ja"
        });
    });
});
