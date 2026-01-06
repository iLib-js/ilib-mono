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
    test("should throw when creating LocaleData with sync when web loader doesn't support it", () => {
        expect.assertions(1);

        try {
            new LocaleData({
                path: "./test/testfiles/files3",
                sync: true
            });
            fail("Expected LocaleData constructor to throw");
        } catch (e) {
            expect(e.message).toBe("Synchronous mode is requested but the loader does not support synchronous operation");
        }
    });

    test("should create LocaleData in async mode by default", () => {
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
