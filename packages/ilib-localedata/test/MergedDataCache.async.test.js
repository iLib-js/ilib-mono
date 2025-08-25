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

            const result = await mergedDataCache.loadMergedData("en", ["./test/files4"], "info");

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

        test('should reject promise when no data can be loaded', async () => {
            expect.assertions(1);

            await expect(
                mergedDataCache.loadMergedData("invalid", ["./test/files3"], "info")
            ).rejects.toThrow();
        });

        test('should handle locale with only root data available', async () => {
            expect.assertions(2);

            const result = await mergedDataCache.loadMergedData("root", ["./test/files3"], "info");

            expect(result).toBeDefined();
            expect(result).toEqual({ "a": "b", "c": "d" });
        });

        test('should merge multiple basenames correctly', async () => {
            expect.assertions(2);

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "foo");

            expect(result).toBeDefined();
            expect(result).toEqual({ "m": "n en", "o": "p en" });
        });

        test('should handle partial locale data with root fallback', async () => {
            expect.assertions(2);

            const result = await mergedDataCache.loadMergedData("en", ["./test/files3"], "info");

            expect(result).toBeDefined();
            expect(result).toEqual({ "a": "b en", "c": "d en" });
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
            const result = await cache.loadMergedData("en-US", ["./test/files3"], "info");

            expect(result).toBeDefined();
            expect(result).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should handle crossRoots option', async () => {
            expect.assertions(2);

            const cache = new MergedDataCache(loader, { crossRoots: true });
            const result = await cache.loadMergedData("en-US", ["./test/files3"], "info");

            expect(result).toBeDefined();
            expect(result).toEqual({ "a": "b en", "c": "d en" });
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
            expect.assertions(3);

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
            expect.assertions(3);

            expect(mergedDataCache.getMergedDataCount()).toBe(0);

            await mergedDataCache.loadMergedData("en-US", ["./test/files3"], "info");
            await mergedDataCache.loadMergedData("en-GB", ["./test/files3"], "info");

            expect(mergedDataCache.getMergedDataCount()).toBeGreaterThan(0);
        });
    });

    describe('edge cases', () => {
        test('should handle empty locale data gracefully', async () => {
            expect.assertions(1);

            await expect(
                mergedDataCache.loadMergedData("", ["./test/files3"], "info")
            ).rejects.toThrow();
        });

        test('should handle null/undefined locale gracefully', async () => {
            expect.assertions(2);

            await expect(
                mergedDataCache.loadMergedData(null, ["./test/files3"], "info")
            ).rejects.toThrow();

            await expect(
                mergedDataCache.loadMergedData(undefined, ["./test/files3"], "info")
            ).rejects.toThrow();
        });

        test('should handle invalid root paths gracefully', async () => {
            expect.assertions(1);

            await expect(
                mergedDataCache.loadMergedData("en-US", ["./invalid/path"], "info")
            ).rejects.toThrow();
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

    describe('storeData', () => {
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
