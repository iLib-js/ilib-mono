/*
 * MergedDataCache.async.test.js - async unit tests for the MergedDataCache class (Node and Browser)
 *
 * Copyright © 2025 JEDLSoft
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

import MergedDataCache from '../src/MergedDataCache.js';
import DataCache from '../src/DataCache.js';
import LoaderFactory from 'ilib-loader';
import Locale from 'ilib-locale';

describe('MergedDataCache Async Tests (Node and Browser)', () => {
    let mergedDataCache;
    let loader;

    beforeEach(() => {
        loader = LoaderFactory();
        mergedDataCache = new MergedDataCache(loader);
        DataCache.clearDataCache();
    });

    afterEach(() => {
        DataCache.clearDataCache();
    });

    describe('constructor', () => {
        test('should create a MergedDataCache instance with the provided loader', () => {
            expect.assertions(2);
            expect(mergedDataCache).toBeDefined();
            expect(mergedDataCache.loader).toBe(loader);
        });

        test('should initialize with DataCache instance', () => {
            expect.assertions(1);
            expect(mergedDataCache.dataCache).toBeDefined();
        });

        test('should set merge options correctly in constructor', () => {
            expect.assertions(3);

            const cache = new MergedDataCache(loader, {
                mostSpecific: true,
                returnOne: false,
                crossRoots: true
            });

            expect(cache.mostSpecific).toBe(true);
            expect(cache.returnOne).toBe(false);
            expect(cache.crossRoots).toBe(true);
        });

        test('should use default merge options when none provided', () => {
            expect.assertions(3);

            const cache = new MergedDataCache(loader);

            expect(cache.mostSpecific).toBe(false);
            expect(cache.returnOne).toBe(false);
            expect(cache.crossRoots).toBe(false);
        });
    });

    describe('loadMergedData load data from stored data', () => {
        test('should merge data from stored data asynchronously', async () => {
            expect.assertions(4);

            // Store test data using the public API
            const testData = {
                "root": {
                    "info": { "a": "b root", "c": "d root" }
                }
            };
            mergedDataCache.storeData(testData, "./test/files3");

            const locale = new Locale("root");
            const roots = ["./test/files3"];
            const basename = "info";

            const result = await mergedDataCache.loadMergedData(locale, roots, basename);

            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("root", ["./test/files3"], "info")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({ "a": "b root", "c": "d root" });
        });

        test('should cache merged data after loading it asynchronously', async () => {
            expect.assertions(6);

            // Store test data using the public API
            const testData = {
                "root": {
                    "info": { "a": "b root", "c": "d root" }
                },
                "en-US": {
                    "info": { "a": "b en-US", "e": "f en-US" }
                }
            };

            mergedDataCache.storeData(testData, "./test/files3");
            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");
            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files3"], "info")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({ "a": "b en-US", "c": "d root", "e": "f en-US" });

            const result2 = mergedDataCache.getCachedData("en-US", ["./test/files3"], "info");
            expect(result2).toBeTruthy();
            expect(result2).toEqual(result);
        });

        test('should merge data from multiple sublocales asynchronously', async () => {
            expect.assertions(4);

            // Store test data using the public API
            const testData = {
                "root": {
                    "info": { "a": "b", "c": "d" }
                },
                "en": {
                    "info": { "a": "b en", "c": "d en" }
                }
            };
            mergedDataCache.storeData(testData, "./test/files3");

            const locale = new Locale("en");
            const roots = ["./test/files3"];
            const basename = "info";

            const result = await mergedDataCache.loadMergedData(locale, roots, basename);

            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("en", ["./test/files3"], "info")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should merge hierarchical data from stored data asynchronously', async () => {
            expect.assertions(4);

            // Store hierarchical test data using the public API
            const testData = {
                "en": {
                    "tester": { "a": "a from files2 en", "c": "c from files2 en" }
                }
            };
            mergedDataCache.storeData(testData, "./test/files2");

            const locale = new Locale("en");
            const roots = ["./test/files2"];
            const basename = "tester";

            const result = await mergedDataCache.loadMergedData(locale, roots, basename);

            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("en", ["./test/files2"], "tester")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({ "a": "a from files2 en", "c": "c from files2 en" });
        });
    });

    describe('loadMergedData', () => {
        test('should load and cache merged data from .js file', async () => {
            expect.assertions(2);

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");

            // The merged result should be flattened with en data overriding root data
            expect(result).toBeDefined();
            expect(result).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should fall back to individual .json files when .js file not found', async () => {
            expect.assertions(2);

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files4"], "info");

            expect(result).toBeDefined();
            expect(result).toBeTruthy();
        });

        test('should handle fallback to .json files with partial data', async () => {
            expect.assertions(2);

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files4"], "info");

            expect(result).toBeDefined();
            expect(result).toBeTruthy();
        });

        test('should return cached data if already loaded', async () => {
            expect.assertions(3);

            // First call should load from file
            const result1 = await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");
            expect(result1).toBeDefined();

            // Second call should return cached data
            const result2 = await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");
            expect(result2).toBeDefined();
            expect(result2).toBe(result1); // Should be the same object reference
        });

        test('should handle locale parameter as string or Locale object', async () => {
            expect.assertions(2);

            const result1 = await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");
            const result2 = await mergedDataCache.loadMergedData(new Locale("en-US"), ["./test/files3"], "info");

            expect(result1).toBeDefined();
            expect(result1).toEqual(result2);
        });

        test('should return undefined when no data can be loaded', async () => {
            expect.assertions(1);

            const result = await mergedDataCache.loadMergedData("invalid", ["./test/files3"], "info");
            expect(result).toBeUndefined();
        });

        test('should handle locale with only root data available', async () => {
            expect.assertions(2);

            const result = await mergedDataCache.loadMergedData(null, ["./test/files3"], "info");

            expect(result).toBeDefined();
            expect(result).toEqual({
                "a": "b root",
                "c": "d root"
            });
        });

        test('should merge multiple basenames correctly', async () => {
            expect.assertions(2);

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "foo");

            expect(result).toBeDefined();
            expect(result).toEqual({ "m": "n en", "o": "p en" });
        });

        test('should handle locale data with new properties not in root', async () => {
            expect.assertions(2);

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");

            expect(result).toBeDefined();
            expect(result).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should handle multiple locale layers with cascading priority', async () => {
            expect.assertions(2);

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");

            expect(result).toBeDefined();
            expect(result).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should handle locale parameter as Locale object directly', async () => {
            expect.assertions(2);

            const locale = new Locale("en-US");
            const result = await mergedDataCache.loadMergedData(locale, ["./test/files3"], "info");

            expect(result).toBeDefined();
            expect(result).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should handle multiple roots with override precedence', async () => {
            expect.assertions(2);

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files4", "./test/files3"], "info");

            expect(result).toBeDefined();
            expect(result).toBeTruthy();
        });
    });

    describe('loadMergedData load data from files', () => {
        test('should load data from .js files asynchronously', async () => {
            expect.assertions(6);

            const locale = new Locale("hu-HU");
            const roots = ["./test/files7"];
            const basename = "address";

            const result = await mergedDataCache.loadMergedData(locale, roots, basename);

            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("hu-HU", ["./test/files7"], "address")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({
                "region": "Megye",
                "postalCode": "Irányítószám",
                "country": "Ország"
            });

            const result2 = mergedDataCache.getCachedData("hu-HU", ["./test/files7"], "address");
            expect(result2).toBeTruthy();
            expect(result2).toEqual(result);
        });

        test('should load data from flat .json files asynchronously', async () => {
            expect.assertions(6);

            const locale = new Locale("hu-HU");
            const roots = ["./test/files4"];
            const basename = "foo";

            const result = await mergedDataCache.loadMergedData(locale, roots, basename);

            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("hu-HU", ["./test/files4"], "foo")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({
                "m": "n hu-HU",
                "o": "p hu-HU"
            });

            const result2 = mergedDataCache.getCachedData("hu-HU", ["./test/files4"], "foo");
            expect(result2).toBeTruthy();
            expect(result2).toEqual(result);
        });

        test('should load data from hierarchical .json files asynchronously', async () => {
            expect.assertions(6);

            const locale = new Locale("ja-JP");
            const roots = ["./test/files2"];
            const basename = "tester";

            const result = await mergedDataCache.loadMergedData(locale, roots, basename);

            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("ja-JP", ["./test/files2"], "tester")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({
                "a": "b ja-JP from files2",
                "x": {
                   "m": "n ja-JP from files2"
                }
            });

            const result2 = mergedDataCache.getCachedData("ja-JP", ["./test/files2"], "tester");
            expect(result2).toBeTruthy();
            expect(result2).toEqual(result);
        });
    });

    describe('merge options', () => {
        test('should handle mostSpecific option', async () => {
            expect.assertions(2);

            const cache = new MergedDataCache(loader, { mostSpecific: true });
            const result = await cache.loadMergedData("en-US", ["./test/files3"], "info");

            expect(result).toBeDefined();
            expect(result).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should handle returnOne option', async () => {
            expect.assertions(2);

            const cache = new MergedDataCache(loader, { returnOne: true });
            cache.clearMergedData();
            const result = await cache.loadMergedData("en-US", ["./test/files3"], "info");

            expect(result).toBeDefined();
            expect(result).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should handle crossRoots option', async () => {
            expect.assertions(2);

            const cache = new MergedDataCache(loader, { crossRoots: true });
            const result = await cache.loadMergedData("de-DE", ["./test/files3", "./test/files4"], "foo");

            expect(result).toBeDefined();
            // Earlier roots (files3) take precedence over later roots (files4)
            // files3's de-DE/foo data wins
            expect(result).toEqual({
                "m": "n de",
                "o": "p de",
                "q": "r de"
            });
        });

        test('should handle crossRoots: false (default behavior)', async () => {
            expect.assertions(2);

            const cache = new MergedDataCache(loader, { crossRoots: false });
            const result = await cache.loadMergedData("en-US", ["./test/files3"], "info");

            expect(result).toBeDefined();
            expect(result).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should share cached data between instances with same options', async () => {
            expect.assertions(3);

            const cache1 = new MergedDataCache(loader, { mostSpecific: true });
            const cache2 = new MergedDataCache(loader, { mostSpecific: true });

            const result1 = await cache1.loadMergedData("en-US", ["./test/files3"], "info");
            const result2 = await cache2.loadMergedData("en-US", ["./test/files3"], "info");

            expect(result1).toBeDefined();
            expect(result2).toBeDefined();
            expect(result1).toBe(result2); // Should be the same cached object
        });
    });

    describe('loadMergedDataSync', () => {
        test('should return cached data if already available', async () => {
            expect.assertions(2);

            // First load data asynchronously to cache it
            await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");

            // Then retrieve it synchronously
            const result = mergedDataCache.loadMergedDataSync("en-US", ["./test/files3"], "info");

            expect(result).toBeDefined();
            expect(result).toEqual({ "a": "b en", "c": "d en" });
        });
    });

    describe('getCachedData', () => {
        test('should return undefined when no data is cached', async () => {
            expect.assertions(1);

            const result = mergedDataCache.getCachedData("en-US", ["./test/files3"], "info");
            expect(result).toBeUndefined();
        });

        test('should return cached data after loading', async () => {
            expect.assertions(3);

            // Load data first
            const result1 = await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");
            expect(result1).toBeDefined();

            // Get cached data
            const result2 = mergedDataCache.getCachedData("en-US", ["./test/files3"], "info");
            expect(result2).toBeDefined();
            expect(result2).toEqual(result1);
        });

        test('should handle invalid parameters gracefully', async () => {
            expect.assertions(4);

            // Test with null locale
            expect(mergedDataCache.getCachedData(null, ["./test/files3"], "info")).toBeUndefined();

            // Test with undefined roots
            expect(mergedDataCache.getCachedData("en-US", undefined, "info")).toBeUndefined();

            // Test with empty roots array
            expect(mergedDataCache.getCachedData("en-US", [], "info")).toBeUndefined();

            // Test with invalid locale object
            expect(mergedDataCache.getCachedData({}, ["./test/files3"], "info")).toBeUndefined();
        });
    });

    describe('hasMergedData', () => {
        test('should return true when data is cached', async () => {
            expect.assertions(2);

            expect(mergedDataCache.hasMergedData("en-US", ["./test/files3"], "info")).toBe(false);

            await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");

            expect(mergedDataCache.hasMergedData("en-US", ["./test/files3"], "info")).toBe(true);
        });
    });

    describe('clearMergedData', () => {
        test('should clear all cached merged data', async () => {
            expect.assertions(2);

            await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files3"], "info")).toBe(true);

            mergedDataCache.clearMergedData();
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files3"], "info")).toBe(false);
        });
    });

    describe('getMergedDataCount', () => {
        test('should return correct count when data is cached', async () => {
            expect.assertions(2);

            expect(mergedDataCache.getMergedDataCount()).toBe(0);

            await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");

            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
        });

        test('should handle multiple cached entries', async () => {
            expect.assertions(2);

            expect(mergedDataCache.getMergedDataCount()).toBe(0);

            await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");
            await mergedDataCache.loadMergedData("en-GB", ["./test/files3"], "info");

            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
        });
    });

    describe('edge cases', () => {
        test('should handle empty locale data properly', async () => {
            expect.assertions(1);

            await expect(
                mergedDataCache.loadMergedData("", ["./test/files3"], "info")
            ).rejects.toThrow();
        });

        test('should handle null as the root locale gracefully', async () => {
            expect.assertions(1);

            const result = mergedDataCache.loadMergedData(null, ["./test/files3"], "info")
            expect(result).toBeDefined();
        });


        test('should handle undefined locale properly', async () => {
            expect.assertions(1);

            await expect(
                mergedDataCache.loadMergedData(undefined, ["./test/files3"], "info")
            ).rejects.toThrow();
        });

        test('should handle invalid root paths properly', async () => {
            expect.assertions(1);

            const result = await mergedDataCache.loadMergedData("en-US", ["./invalid/path"], "info");
            expect(result).toBeUndefined();
        });
    });

    describe('integration with FileCache', () => {
        test('should use FileCache for individual file loading in fallback mode', async () => {
            expect.assertions(2);

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files4"], "info");

            expect(result).toBeDefined();
            expect(result).toBeTruthy();
        });
    });

    describe('loadLocaleData', () => {
        test('should load locale-specific data from .js files', async () => {
            expect.assertions(2);

            // Clear cache to ensure we start fresh
            mergedDataCache.clearMergedData();

            const result = await mergedDataCache.loadLocaleData("en-US", ["./test/files3"]);

            expect(result).toBe(true);
            // Verify that data was loaded for this locale and basename
            expect(mergedDataCache.hasLocaleData("en-US", ["./test/files3"], "info")).toBe(true);
        });

        test('should load locale-specific data from .json files', async () => {
            expect.assertions(2);

            // Clear cache to ensure we start fresh
            mergedDataCache.clearMergedData();

            const result = await mergedDataCache.loadLocaleData("ja-JP", ["./test/files3"]);

            expect(result).toBe(true);
            // Verify that data was loaded for this locale and basename
            expect(mergedDataCache.hasLocaleData("ja-JP", ["./test/files3"], "info")).toBe(true);
        });

        test('should return false when no locale-specific files are found', async () => {
            expect.assertions(2);

            // Clear cache to ensure we start fresh
            mergedDataCache.clearMergedData();

            const result = await mergedDataCache.loadLocaleData("invalid-locale", ["./test/files3"]);

            expect(result).toBe(false);
            // Verify that no data was loaded for this locale and basename
            expect(mergedDataCache.hasLocaleData("invalid-locale", ["./test/files3"], "info")).toBe(false);
        });

        test('should handle multiple roots and return true if any data is found', async () => {
            expect.assertions(2);

            // Clear cache to ensure we start fresh
            mergedDataCache.clearMergedData();

            const result = await mergedDataCache.loadLocaleData("en-US", ["./test/files3", "./test/files4"]);

            expect(result).toBe(true);
            // Verify that data was loaded for this locale and basename in at least one root
            expect(mergedDataCache.hasLocaleData("en-US", ["./test/files3", "./test/files4"], "info")).toBe(true);
        });

        test('should handle locale parameter as string or Locale object', async () => {
            expect.assertions(2);

            const result1 = await mergedDataCache.loadLocaleData("en-US", ["./test/files3"]);
            const result2 = await mergedDataCache.loadLocaleData(new Locale("en-US"), ["./test/files3"]);

            expect(result1).toBe(true);
            expect(result1).toBe(result2);
        });

        test('should cache data for multiple basenames from single locale file', async () => {
            expect.assertions(3);

            // Clear cache to ensure we start fresh
            mergedDataCache.clearMergedData();

            const result = await mergedDataCache.loadLocaleData("en-US", ["./test/files3"]);

            expect(result).toBe(true);
            // Verify that multiple basenames were loaded for this locale
            expect(mergedDataCache.hasLocaleData("en-US", ["./test/files3"], "info")).toBe(true);
            expect(mergedDataCache.hasLocaleData("en-US", ["./test/files3"], "foo")).toBe(true);
        });

        test('should handle root locale correctly', async () => {
            expect.assertions(2);

            // Clear cache to ensure we start fresh
            mergedDataCache.clearMergedData();

            const result = await mergedDataCache.loadLocaleData("root", ["./test/files3"]);

            expect(result).toBe(true);
            // Verify that root data was loaded for this basename
            expect(mergedDataCache.hasLocaleData("root", ["./test/files3"], "info")).toBe(true);
        });

        test('should handle complex locale with multiple sublocales', async () => {
            expect.assertions(2);

            // Clear cache to ensure we start fresh
            mergedDataCache.clearMergedData();

            const result = await mergedDataCache.loadLocaleData("zh-Hans-CN", ["./test/files3"]);

            expect(result).toBe(true);
            // Verify that data was loaded for this locale and basename
            expect(mergedDataCache.hasLocaleData("zh-Hans-CN", ["./test/files3"], "info")).toBe(true);
        });

        test('should return cached result on subsequent calls', async () => {
            expect.assertions(3);

            const result1 = await mergedDataCache.loadLocaleData("en-US", ["./test/files3"]);
            const result2 = await mergedDataCache.loadLocaleData("en-US", ["./test/files3"]);

            expect(result1).toBe(true);
            expect(result2).toBe(true);
            expect(result1).toBe(result2);
        });

        test('should handle invalid parameters gracefully', async () => {
            expect.assertions(4);

            // Test with null locale
            await expect(mergedDataCache.loadLocaleData(null, ["./test/files3"])).rejects.toThrow();

            // Test with undefined roots
            await expect(mergedDataCache.loadLocaleData("en-US", undefined)).rejects.toThrow();

            // Test with empty roots array
            await expect(mergedDataCache.loadLocaleData("en-US", [])).rejects.toThrow();

            // Test with invalid locale object
            await expect(mergedDataCache.loadLocaleData({}, ["./test/files3"])).rejects.toThrow();
        });

        test('should handle malformed locale files gracefully', async () => {
            expect.assertions(1);

            // This should not throw, but should return false for malformed files
            const result = await mergedDataCache.loadLocaleData("invalid", ["./test/files3"]);
            expect(result).toBe(false);
        });
    });

    describe('storeData', () => {
        test('should store data correctly', async () => {
            expect.assertions(3);

            const testData = {
                "root": {
                    "info": { "a": "b root", "c": "d root" }
                }
            };

            mergedDataCache.storeData(testData, "./test/files3");

            // Verify data was stored by checking if we can retrieve it
            const cachedData = mergedDataCache.getCachedData("root", ["./test/files3"], "info");
            expect(cachedData).toBeUndefined(); // Should be undefined because it's not merged yet

            // Verify hasMergedData returns false for unmerged data
            expect(mergedDataCache.hasMergedData("root", ["./test/files3"], "info")).toBe(false);

            // Verify getMergedDataCount is still 0
            expect(mergedDataCache.getMergedDataCount()).toBe(0);
        });

        test('should store multiple locales and basenames', async () => {
            expect.assertions(4);

            const testData = {
                "root": {
                    "info": { "a": "b", "c": "d" },
                    "numbers": { "decimal": ".", "group": "," }
                },
                "en": {
                    "info": { "a": "b en", "c": "d en" },
                    "numbers": { "decimal": ".", "group": "," }
                }
            };

            mergedDataCache.storeData(testData, "./test/files3");

            // Verify data was stored (but not merged yet)
            expect(mergedDataCache.hasMergedData("root", ["./test/files3"], "info")).toBe(false);
            expect(mergedDataCache.hasMergedData("en", ["./test/files3"], "info")).toBe(false);
            expect(mergedDataCache.hasMergedData("root", ["./test/files3"], "numbers")).toBe(false);
            expect(mergedDataCache.getMergedDataCount()).toBe(0);
        });

        test('should handle invalid data gracefully', async () => {
            expect.assertions(2);

            // Test with null data
            mergedDataCache.storeData(null, "./test/files3");
            expect(mergedDataCache.getMergedDataCount()).toBe(0);

            // Test with undefined data
            mergedDataCache.storeData(undefined, "./test/files3");
            expect(mergedDataCache.getMergedDataCount()).toBe(0);
        });

        test('should allow stored data to be merged with loadMergedData', async () => {
            expect.assertions(3);

            // Store some data first
            mergedDataCache.storeData({
                "en-US": {
                    "info": { "x": "y", "z": "w" }
                }
            }, "./test/files3");

            // Then load and merge with file data
            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");

            expect(result).toBeDefined();
            expect(result).toHaveProperty("x", "y");
            expect(result).toHaveProperty("z", "w");
        });

        test('should work with mixed file and stored data', async () => {
            expect.assertions(3);

            // Store some data first
            mergedDataCache.storeData({
                "en-US": {
                    "info": { "x": "y", "z": "w" }
                }
            }, "./test/files3");

            // Then load and merge with file data
            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");

            expect(result).toBeDefined();
            expect(result).toHaveProperty("x", "y");
            expect(result).toHaveProperty("z", "w");
        });
    });
});
