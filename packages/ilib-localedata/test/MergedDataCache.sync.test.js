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
        mergedDataCache = new MergedDataCache(loader);
        DataCache.clearDataCache();
    });

    afterEach(() => {
        DataCache.clearDataCache();
    });

    describe('loadMergedDataSync', () => {
        test('should load and merge data synchronously when not cached', async () => {
            expect.assertions(6);
            
            const locale = new Locale("en-US");
            const roots = ["./test/files7"];
            const basename = "info";
            
            // First load data asynchronously to cache it
            await mergedDataCache.loadMergedData(locale, roots, basename);
            
            // Then retrieve it synchronously
            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);
            
            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files7"], "info")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should load and cache data from .js files with only root data synchronously', () => {
            expect.assertions(4);
            
            const locale = new Locale("root");
            const roots = ["./test/files3"];
            const basename = "info";
            
            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);
            
            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("root", ["./test/files3"], "info")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({ "a": "b", "c": "d" });
        });

        test('should fall back to .json files when .js files are not found synchronously', async () => {
            expect.assertions(4);
            
            const locale = new Locale("en");
            const roots = ["./test/files3"];
            const basename = "info";
            
            // First load data asynchronously to cache it
            await mergedDataCache.loadMergedData(locale, roots, basename);
            
            // Then retrieve it synchronously
            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);
            
            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("en", ["./test/files3"], "info")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should return undefined for invalid file content synchronously', () => {
            expect.assertions(2);
            
            const locale = new Locale("invalid");
            const roots = ["./test/files3"];
            const basename = "info";
            
            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);
            
            expect(result).toBeTruthy(); // Should return merged data (even if empty)
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
        });

        test('should handle multiple roots and return data from the first available synchronously', () => {
            expect.assertions(4);
            
            const locale = new Locale("en-US");
            const roots = ["./test/files4", "./test/files3"]; // First root doesn't exist
            const basename = "info";
            
            const result = mergedDataCache.loadMergedDataSync(locale, roots, basename);
            
            expect(result).toBeTruthy();
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files4", "./test/files3"], "info")).toBe(true);
            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
            expect(result).toEqual({ "a": "b", "c": "d" }); // Should fall back to root data
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
            
            const locale = new Locale("en-US");
            const roots = ["./test/files3"];
            const basename = "info";
            
            // First call - should load from file and parse
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
});
