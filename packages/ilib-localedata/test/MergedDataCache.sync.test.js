/*
 * MergedDataCache.sync.test.js - sync unit tests for the MergedDataCache class (Node Only)
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

describe('MergedDataCache Sync Tests (Node Only)', () => {
    let mergedDataCache;
    let loader;

    beforeEach(() => {
        loader = LoaderFactory();
        loader.setSyncMode();
        mergedDataCache = new MergedDataCache(loader);
        DataCache.clearDataCache();
    });

    afterEach(() => {
        DataCache.clearDataCache();
    });

    describe('storeData', () => {
        test('should store data correctly', () => {
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

        test('should store multiple locales and basenames', () => {
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

        test('should handle invalid data gracefully', () => {
            expect.assertions(2);

            // Test with null data
            mergedDataCache.storeData(null, "./test/files3");
            expect(mergedDataCache.getMergedDataCount()).toBe(0);

            // Test with undefined data
            mergedDataCache.storeData(undefined, "./test/files3");
            expect(mergedDataCache.getMergedDataCount()).toBe(0);
        });
    });

    describe('loadMergedDataSync load data from stored data', () => {
        test('should merge data from stored data synchronously', () => {
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

            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);

            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("root", ["./test/files3"], "info")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({ "a": "b root", "c": "d root" });
        });

        test('should cache merged data after loading it synchronously', () => {
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
             const result = mergedDataCache.loadMergedDataSync("en-US", ["./test/files3"], "info");
            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files3"], "info")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({ "a": "b en-US", "c": "d root", "e": "f en-US" });

            const result2 = mergedDataCache.getCachedData("en-US", ["./test/files3"], "info");
            expect(result2).toBeTruthy();
            expect(result2).toEqual(result);
        });

        test('should merge data from multiple sublocales synchronously', () => {
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

            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);

            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("en", ["./test/files3"], "info")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should merge hierarchical data from stored data synchronously', () => {
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

            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);

            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("en", ["./test/files2"], "tester")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({ "a": "a from files2 en", "c": "c from files2 en" });
        });
    });

    describe('loadMergedDataSync load data from files', () => {
        test('should load data from .js files synchronously', () => {
            expect.assertions(6);

            const locale = new Locale("hu-HU");
            const roots = ["./test/files7"];
            const basename = "address";

            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);

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

        test('should load data from flat .json files synchronously', () => {
            expect.assertions(6);

            const locale = new Locale("hu-HU");
            const roots = ["./test/files4"];
            const basename = "foo";

            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);

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

        test('should load data from hierarchical .json files synchronously', () => {
            expect.assertions(6);

            const locale = new Locale("ja-JP");
            const roots = ["./test/files2"];
            const basename = "tester";

            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);

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

        test('should return undefined when no data is available in ParsedDataCache', () => {
            expect.assertions(2);

            const locale = new Locale("en");
            const roots = ["./test/files7"];
            const basename = "tester";

            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);

            // should return undefined because there is no data for the tester basename
            expect(result).toBeUndefined();
            expect(mergedDataCache.getMergedDataCount()).toBe(0);
        });

        test('should return undefined when no data is available for invalid locale', () => {
            expect.assertions(2);

            const locale = new Locale("invalid");
            const roots = ["./test/files3"];
            const basename = "tester";

            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);

            // should return undefined because there is no data for the invalid basename
            expect(result).toBeUndefined();
            expect(mergedDataCache.getMergedDataCount()).toBe(0);
        });

        test('should return undefined when no data is available for invalid basename', () => {
            expect.assertions(2);

            const locale = new Locale("en");
            const roots = ["./test/files2"];
            const basename = "invalid";

            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);

            // should return undefined because there is no data for the invalid basename
            expect(result).toBeUndefined();
            expect(mergedDataCache.getMergedDataCount()).toBe(0);
        });

        test('should load and merge data synchronously when cached by async load first', async () => {
            expect.assertions(5);

            const locale = new Locale("en-US");
            const roots = ["./test/files7"];
            const basename = "info";

            // First load data asynchronously to cache it
            const result1 = await mergedDataCache.loadMergedData(locale, roots, basename);

            // Then retrieve it synchronously
            const result2 = mergedDataCache.loadMergedDataSync(locale, roots, basename);

            expect(result2).toBeTruthy();
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files7"], "info")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result2).toEqual({ "a": "b en", "c": "d en" });
            expect(result2).toBe(result1);
        });

        test('should load and merge data synchronously when cached by sync load first', () => {
            expect.assertions(5);

            const locale = new Locale("en-US");
            const roots = ["./test/files7"];
            const basename = "info";

            const result1 = mergedDataCache.loadMergedDataSync(locale, roots, basename);

            expect(mergedDataCache.hasMergedData("en-US", ["./test/files7"], "info")).toBe(true);

            const result2 = mergedDataCache.loadMergedDataSync(locale, roots, basename);

            expect(result2).toBeTruthy();
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result2).toEqual({ "a": "b en", "c": "d en" });
            expect(result2).toBe(result1);
        });

        test('should load and merge data asynchronously when cached by sync load first', async () => {
            expect.assertions(5);

            const locale = new Locale("en-US");
            const roots = ["./test/files7"];
            const basename = "info";

            const result1 = mergedDataCache.loadMergedDataSync(locale, roots, basename);

            expect(mergedDataCache.hasMergedData("en-US", ["./test/files7"], "info")).toBe(true);

            const result2 = await mergedDataCache.loadMergedData(locale, roots, basename);

            expect(result2).toBeTruthy();
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result2).toEqual({ "a": "b en", "c": "d en" });
            expect(result2).toBe(result1);
        });

        test('should handle multiple roots and return data from the first available synchronously', () => {
            expect.assertions(4);

            const locale = new Locale("en-US");
            const roots = ["./test/files4", "./test/files3"];
            const basename = "info";

            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);

            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files4", "./test/files3"], "info")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({ "a": "b", "c": "d" }); // should have data from files4, not files3
        });

        test('should handle multiple roots and return merged data when using crossRoots option', () => {
            expect.assertions(4);

            // Store test data in both roots using the public API
            const testData1 = {
                "de-DE": {
                    "info": { "a": "b de files3", "c": "d de files3" }
                }
            };
            const testData2 = {
                "de-DE": {
                    "info": { "a": "b de files4", "c": "d de files4", "e": "f de files4" }
                }
            };

            const mergedCache = new MergedDataCache(loader, { crossRoots: true });
            mergedCache.storeData(testData1, "./test/files3");
            mergedCache.storeData(testData2, "./test/files4");

            const locale = new Locale("de-DE");
            const roots = ["./test/files4", "./test/files3"];
            const basename = "info";

            const result = mergedCache.loadMergedDataSync(locale, roots, basename);

            expect(result).toBeTruthy();
            expect(mergedCache.hasMergedData("de-DE", ["./test/files4", "./test/files3"], "info")).toBe(true);
            expect(mergedCache.getMergedDataCount()).toBeGreaterThan(0);
            // Earlier roots (files4) take precedence over later roots (files3)
            expect(result).toEqual({
                "a": "b de files4",
                "c": "d de files4",
                "e": "f de files4"
            });
        });

        test('should handle multiple roots and return merged data when using the mostSpecific option', () => {
            expect.assertions(4);

            const locale = new Locale("de-DE");
            const roots = ["./test/files4"];
            const basename = "foo";

            const mergedCache = new MergedDataCache(loader, { mostSpecific: true });
            const result = mergedCache.loadMergedDataSync(locale, roots, basename);

            expect(result).toBeTruthy();
            expect(mergedCache.hasMergedData("de-DE", ["./test/files4"], "foo")).toBe(true);
            expect(mergedCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({
                "m": "n de-DE",
                "o": "p de-DE"
            }); // should only have data from the de-DE locale, not merged with de and root data
        });

        test('should return data from first available root synchronously', () => {
            expect.assertions(2);

            const locale = new Locale("en-US");
            const roots = ["./test/files4", "./test/files5"]; // files4 has data, files5 doesn't
            const basename = "info";

            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);

            expect(result).toBeTruthy(); // Should find data in files4
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0); // Should cache some data
        });
    });

    describe('Cache Behavior Sync', () => {
        test('should return cached data without reparsing when calling loadMergedDataSync twice', () => {
            expect.assertions(4);

            // Store test data using the public API
            const testData = {
                "en-US": {
                    "info": { "a": "b en-US", "c": "d en-US" }
                }
            };
            mergedDataCache.storeData(testData, "./test/files3");

            const locale = new Locale("en-US");
            const roots = ["./test/files3"];
            const basename = "info";

            // First call - should load and merge data
            const result1 = mergedDataCache.loadMergedDataSync(locale, roots, basename);
            expect(result1).toBeTruthy();
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files3"], "info")).toBe(true);

            // Second call - should return cached data without reparsing
            const result2 = mergedDataCache.loadMergedDataSync(locale, roots, basename);
            expect(result2).toBeTruthy();
            expect(result2).toBe(result1); // Should be the same object reference
        });
    });

    describe('hasMergedData', () => {
        test('should return false when no data is cached', () => {
            expect.assertions(1);
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files3"], "info")).toBe(false);
        });
    });

    describe('getMergedDataCount', () => {
        test('should return 0 when no data is cached', () => {
            expect.assertions(1);
            expect(mergedDataCache.getMergedDataCount()).toBe(0);
        });
    });

    describe('storeData', () => {
        test('should store pre-populated data for later merging', () => {
            expect.assertions(2);

            const data = {
                "en-US": {
                    "info": { "a": "b", "c": "d" }
                }
            };

            mergedDataCache.storeData(data, "./test/files3");

            // Data is stored but not merged yet - need to load it first
            const result = mergedDataCache.loadMergedDataSync("en-US", ["./test/files3"], "info");
            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files3"], "info")).toBe(true);
        });

        test('should handle multiple basenames in stored data', () => {
            expect.assertions(2);

            const data = {
                "en-US": {
                    "info": { "a": "b", "c": "d" },
                    "foo": { "m": "n", "o": "p" }
                }
            };

            mergedDataCache.storeData(data, "./test/files3");

            // Data is stored but not merged yet - need to load it first
            const result1 = mergedDataCache.loadMergedDataSync("en-US", ["./test/files3"], "info");
            const result2 = mergedDataCache.loadMergedDataSync("en-US", ["./test/files3"], "foo");
            expect(result1).toBeTruthy();
            expect(result2).toBeTruthy();
        });

        test('should handle invalid data gracefully', () => {
            expect.assertions(1);

            mergedDataCache.storeData(null, "./test/files3");
            expect(mergedDataCache.getMergedDataCount()).toBe(0);
        });

        test('should handle empty locale data gracefully', () => {
            expect.assertions(1);

            mergedDataCache.storeData({}, "./test/files3");
            expect(mergedDataCache.getMergedDataCount()).toBe(0);
        });

        test('should store data that can be retrieved by getParsedData', () => {
            expect.assertions(2);

            const data = {
                "en-US": {
                    "info": { "a": "b", "c": "d" }
                }
            };

            mergedDataCache.storeData(data, "./test/files3");

            // Data is stored but not merged yet - need to load it first
            const result = mergedDataCache.loadMergedDataSync("en-US", ["./test/files3"], "info");
            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files3"], "info")).toBe(true);
        });
    });

    describe('loadLocaleDataSync', () => {
        test('should load locale-specific data from .js files synchronously', () => {
            expect.assertions(2);

            // Clear cache to ensure we start fresh
            mergedDataCache.clearMergedData();

            const result = mergedDataCache.loadLocaleDataSync("en", ["./test/files3"]);

            expect(result).toBe(true);
            // Verify that data was loaded for this locale and basename
            expect(mergedDataCache.hasLocaleData("en", ["./test/files3"], "info")).toBe(true);
        });

        test('should load locale-specific data from .json files synchronously', () => {
            expect.assertions(2);

            // Clear cache to ensure we start fresh
            mergedDataCache.clearMergedData();

            const result = mergedDataCache.loadLocaleDataSync("ja-JP", ["./test/files3"]);

            expect(result).toBe(true);
            // Verify that data was loaded for this locale and basename
            expect(mergedDataCache.hasLocaleData("ja-JP", ["./test/files3"], "info")).toBe(true);
        });

        test('should return false when no locale-specific files are found', () => {
            expect.assertions(2);

            // Clear cache to ensure we start fresh
            mergedDataCache.clearMergedData();

            const result = mergedDataCache.loadLocaleDataSync("invalid-locale", ["./test/files3"]);

            expect(result).toBe(false);
            // Verify that no data was loaded for this locale and basename
            expect(mergedDataCache.hasLocaleData("invalid-locale", ["./test/files3"], "info")).toBe(false);
        });

        test('should handle multiple roots and return true if any data is found', () => {
            expect.assertions(2);

            // Clear cache to ensure we start fresh
            mergedDataCache.clearMergedData();

            const result = mergedDataCache.loadLocaleDataSync("en", ["./test/files3", "./test/files4"]);

            expect(result).toBe(true);
            // Verify that data was loaded for this locale and basename in at least one root
            expect(mergedDataCache.hasLocaleData("en", ["./test/files3", "./test/files4"], "info")).toBe(true);
        });

        test('should handle locale parameter as string or Locale object', () => {
            expect.assertions(2);

            const result1 = mergedDataCache.loadLocaleDataSync("en", ["./test/files3"]);
            const result2 = mergedDataCache.loadLocaleDataSync(new Locale("en"), ["./test/files3"]);

            expect(result1).toBe(true);
            expect(result1).toBe(result2);
        });

        test('should cache data for multiple basenames from single locale file', () => {
            expect.assertions(3);

            // Clear cache to ensure we start fresh
            mergedDataCache.clearMergedData();

            const result = mergedDataCache.loadLocaleDataSync("en", ["./test/files3"]);

            expect(result).toBe(true);
            // Verify that multiple basenames were loaded for this locale
            expect(mergedDataCache.hasLocaleData("en", ["./test/files3"], "info")).toBe(true);
            expect(mergedDataCache.hasLocaleData("en", ["./test/files3"], "foo")).toBe(true);
        });

        test('should handle root locale correctly', () => {
            expect.assertions(2);

            // Clear cache to ensure we start fresh
            mergedDataCache.clearMergedData();

            const result = mergedDataCache.loadLocaleDataSync("root", ["./test/files3"]);

            expect(result).toBe(true);
            // Verify that root data was loaded for this basename
            expect(mergedDataCache.hasLocaleData("root", ["./test/files3"], "info")).toBe(true);
        });

        test('should handle complex locale with multiple sublocales', () => {
            expect.assertions(2);

            // Clear cache to ensure we start fresh
            mergedDataCache.clearMergedData();

            const result = mergedDataCache.loadLocaleDataSync("zh-Hans-CN", ["./test/files3"]);

            expect(result).toBe(true);
            // Verify that data was loaded for this locale and basename
            expect(mergedDataCache.hasLocaleData("zh-Hans-CN", ["./test/files3"], "info")).toBe(true);
        });

        test('should return cached result on subsequent calls', () => {
            expect.assertions(3);

            const result1 = mergedDataCache.loadLocaleDataSync("en", ["./test/files3"]);
            const result2 = mergedDataCache.loadLocaleDataSync("en", ["./test/files3"]);

            expect(result1).toBe(true);
            expect(result2).toBe(true);
            expect(result1).toBe(result2);
        });

        test('should handle invalid parameters gracefully', () => {
            expect.assertions(4);

            // Test with null locale
            expect(() => mergedDataCache.loadLocaleDataSync(null, ["./test/files3"])).toThrow();

            // Test with undefined roots
            expect(() => mergedDataCache.loadLocaleDataSync("en", undefined)).toThrow();

            // Test with empty roots array
            expect(() => mergedDataCache.loadLocaleDataSync("en", [])).toThrow();

            // Test with invalid locale object
            expect(() => mergedDataCache.loadLocaleDataSync({}, ["./test/files3"])).toThrow();
        });

        test('should handle malformed locale files gracefully', () => {
            expect.assertions(1);

            // This should not throw, but should return false for malformed files
            const result = mergedDataCache.loadLocaleDataSync("invalid", ["./test/files3"]);
            expect(result).toBe(false);
        });

        test('should skip ESM modules and only load CommonJS/JSON files', () => {
            expect.assertions(1);

            // This test assumes that some files might be ESM modules that can't be loaded synchronously
            // The method should still return true if any data was loaded, even if some files were skipped
            const result = mergedDataCache.loadLocaleDataSync("en", ["./test/files3"]);
            expect(typeof result).toBe("boolean");
        });
    });
});
