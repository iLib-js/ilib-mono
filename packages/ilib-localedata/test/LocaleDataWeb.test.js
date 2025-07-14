/*
 * LocaleDataWeb.test.js - test the locale data class synchronously
 * on a browser
 *
 * Copyright © 2022, 2025 JEDLSoft
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
    test("should create LocaleData instance when web loader doesn't support sync", () => {
        expect.assertions(1);

        const locData = new LocaleData({
            path: "./test/files3",
            sync: true
        });
        expect(!locData.isSync()).toBe(true);
    });

    test("should not support sync test load", () => {
        expect.assertions(2);

        const locData = new LocaleData({
            path: "./test/files3",
            sync: true
        });
        expect(!locData.isSync()).toBe(true);

        // should use the default synchronicity, which is async
        const actual = locData.loadData({
            basename: "info",
            locale: "root"
        });

        expect(actual instanceof Promise).toBe(true);
    });

    test("should throw error when sync loading not supported", () => {
        expect.assertions(3);

        const locData = new LocaleData({
            path: "./test/files3"
        });

        expect(locData).toBeTruthy();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();
        LocaleData.addGlobalRoot("./test/files3");

        expect(!LocaleData.checkCache("de-DE", "info")).toBe(true);

        // we request sync loading but the loader does
        // not support it and the data is not already
        // previously loaded, so it should throw an
        // exception because the data cannot be loaded
        expect(() => {
            const actual = locData.loadData({
                basename: "info",
                locale: "de-DE",
                sync: true
            });
        }).toThrow();
    });

    test("should load sync data previously loaded", async () => {
        expect.assertions(6);

        const locData = new LocaleData({
            path: "./test/files3"
        });

        expect(locData).toBeTruthy();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();
        LocaleData.addGlobalRoot("./test/files3");

        await LocaleData.ensureLocale("de-DE");
        expect(LocaleData.checkCache("de-DE", "info")).toBe(true);

        // we request sync loading but the loader does
        // not support it. But, the data is already
        // previously loaded, so it should succeed based
        // on the cached data alone
        const actual = locData.loadData({
            basename: "info",
            locale: "de-DE",
            sync: true
        });
        expect(!!actual).toBe(true);
        expect(typeof(actual)).toBe("object");
        expect(!(actual instanceof Promise)).toBe(true);

        const expected = {
            "a": "b de",
            "c": "d de"
        };
        expect(actual).toEqual(expected);
    });

    test("should ensure locale json right data sync no roots", async () => {
        setPlatform();

        // only do this test on browsers with webpack -- nodejs always
        // requires a global root so we know where to load files from
        expect.assertions(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const result = await LocaleData.ensureLocale("ja-JP");
        expect(result).toBeTruthy();

        const locData = new LocaleData({
            path: "./test/files3"
        });

        // can load synchronously after the ensureLocale
        // is done, even though the loader does not support
        // synchronous operation because the data is cached
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