/*
 * DataCache.test.js - test the data cache class
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

import Locale from 'ilib-locale';

import DataCache from '../src/DataCache.js';

describe("DataCache", () => {
    beforeEach(() => {
        // Clear the singleton cache before each test
        DataCache.clearDataCache();
    });
    test("should create DataCache instance", () => {
        expect.assertions(1);
        let cache = DataCache.getDataCache();

        expect(cache.size()).toBe(0);
    });

    test("should return global singleton instance", () => {
        expect.assertions(1);
        let cache1 = DataCache.getDataCache();

        let cache2 = DataCache.getDataCache();

        // should be the exact same instance
        expect(cache1).toBe(cache2);
    });

    test("should get empty data", () => {
        expect.assertions(1);
        let cache = DataCache.getDataCache();

        const data = cache.getData("root", "basename", new Locale("en-US"));

        // undefined = no cached information exists
        expect(typeof(data)).toBe('undefined');
    });

    test("should store and retrieve data", () => {
        expect.assertions(2);
        let cache = DataCache.getDataCache();

        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        const data = cache.getData("root", "basename", new Locale("en-US"));

        expect(data).toBeTruthy();
        expect(data).toEqual({ x: "string" });
    });

    test("should clear data", () => {
        expect.assertions(2);
        let cache = DataCache.getDataCache();

        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        let data = cache.getData("root", "basename", new Locale("en-US"));
        expect(data).toBeTruthy();

        cache.clearData();

        data = cache.getData("root", "basename", new Locale("en-US"));

        expect(!data).toBe(true);
    });

    test("should clear multiple data entries", () => {
        expect.assertions(12);
        let cache = DataCache.getDataCache();
        cache.clearData();

        expect(cache.size()).toBe(0);
        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });
        cache.storeData("root", "basename", new Locale("da-DK"), { x: "string" });
        cache.storeData("root", "basename", new Locale("ja"), { x: "string" });
        expect(cache.size()).toBe(3);

        let data = cache.getData("root", "basename", new Locale("en-US"));
        expect(data).toBeTruthy();
        expect(data).toEqual({ x: "string" });
        data = cache.getData("root", "basename", new Locale("da-DK"));
        expect(data).toBeTruthy();
        expect(data).toEqual({ x: "string" });
        data = cache.getData("root", "basename", new Locale("ja"));
        expect(data).toBeTruthy();
        expect(data).toEqual({ x: "string" });

        cache.clearData();
        expect(cache.size()).toBe(0);

        data = cache.getData("root", "basename", new Locale("en-US"));
        expect(typeof(data)).toBe('undefined');
        data = cache.getData("root", "basename", new Locale("da-DK"));
        expect(typeof(data)).toBe('undefined');
        data = cache.getData("root", "basename", new Locale("ja"));
        expect(typeof(data)).toBe('undefined');
    });

    test("should clear data with correct size", () => {
        expect.assertions(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        expect(cache.size()).toBe(0);
        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });
        cache.storeData("root", "basename", new Locale("da-DK"), { x: "string" });
        cache.storeData("root", "basename", new Locale("ja"), { x: "string" });
        expect(cache.size()).toBe(3);

        cache.clearData();
        expect(cache.size()).toBe(0);
    });

    test("should store data for different locales", () => {
        expect.assertions(4);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });
        cache.storeData("root", "basename", new Locale("en"), { y: "string1" });

        let data = cache.getData("root", "basename", new Locale("en-US"));

        expect(data).toBeTruthy();
        expect(data).toEqual({ x: "string" });

        data = cache.getData("root", "basename", new Locale("en"));

        expect(data).toBeTruthy();
        expect(data).toEqual({ y: "string1" });
    });

    test("should store data for different basenames", () => {
        expect.assertions(4);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.storeData("root", "basename1", new Locale("en-US"), { x: "string" });
        cache.storeData("root", "basename2", new Locale("en-US"), { y: "string1" });

        let data = cache.getData("root", "basename1", new Locale("en-US"));

        expect(data).toBeTruthy();
        expect(data).toEqual({ x: "string" });

        data = cache.getData("root", "basename2", new Locale("en-US"));

        expect(data).toBeTruthy();
        expect(data).toEqual({ y: "string1" });
    });

    test("should store data for different roots", () => {
        expect.assertions(4);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.storeData("root1", "basename", new Locale("en-US"), { x: "string" });
        cache.storeData("root2", "basename", new Locale("en-US"), { y: "string1" });

        let data = cache.getData("root1", "basename", new Locale("en-US"));

        expect(data).toBeTruthy();
        expect(data).toEqual({ x: "string" });

        data = cache.getData("root2", "basename", new Locale("en-US"));

        expect(data).toBeTruthy();
        expect(data).toEqual({ y: "string1" });
    });

    test("should not store data without basename", () => {
        expect.assertions(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        expect(cache.size()).toBe(0);
        cache.storeData("root", undefined, new Locale("en-US"), { x: "string" });
        expect(cache.size()).toBe(0);

        const data = cache.getData("root", undefined, new Locale("en-US"));

        expect(typeof(data)).toBe('undefined');
    });

    test("should store data without locale as root", () => {
        expect.assertions(4);
        let cache = DataCache.getDataCache();
        cache.clearData();

        expect(cache.size()).toBe(0);
        // empty locale = root
        cache.storeData("root", "basename", undefined, { x: "string" });
        expect(cache.size()).toBe(1);

        const data = cache.getData("root", "basename", undefined);

        expect(data).toBeTruthy();
        expect(data).toEqual({ x: "string" });
    });

    test("should store null data", () => {
        expect.assertions(2);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.storeData("root", "basename", new Locale("en-US"), null);

        const data = cache.getData("root", "basename", new Locale("en-US"));

        // null = files for this locale do not exist
        expect(typeof(data) !== 'undefined').toBe(true);
        expect(data).toEqual(null);
    });

    test("should store data with correct size", () => {
        expect.assertions(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        expect(cache.size()).toBe(0);
        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });
        expect(cache.size()).toBe(1);
        cache.storeData("root", "basename", new Locale("en-CA"), { x: "string" });
        expect(cache.size()).toBe(2);
    });

    test("should override stored data", () => {
        expect.assertions(4);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        let data = cache.getData("root", "basename", new Locale("en-US"));

        expect(data).toBeTruthy();
        expect(data).toEqual({ x: "string" });

        cache.storeData("root", "basename", new Locale("en-US"), { z: true });

        data = cache.getData("root", "basename", new Locale("en-US"));

        expect(data).toBeTruthy();
        expect(data).toEqual({ z: true });
    });

    test("should override data with correct size", () => {
        expect.assertions(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        expect(cache.size()).toBe(0);
        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        expect(cache.size()).toBe(1);

        cache.storeData("root", "basename", new Locale("en-US"), { z: true });

        // overrides do not increase the size
        expect(cache.size()).toBe(1);
    });

    test("should remove data", () => {
        expect.assertions(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        let data = cache.getData("root", "basename", new Locale("en-US"));

        expect(data).toBeTruthy();
        expect(data).toEqual({ x: "string" });

        cache.removeData("root", "basename", new Locale("en-US"));

        data = cache.getData("root", "basename", new Locale("en-US"));

        expect(typeof(data)).toBe('undefined');
    });

    test("should remove data with correct size", () => {
        expect.assertions(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        expect(cache.size()).toBe(0);
        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        expect(cache.size()).toBe(1);

        cache.removeData("root", "basename", new Locale("en-US"));

        expect(cache.size()).toBe(0);
    });

    test("should not remove data without basename", () => {
        expect.assertions(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        expect(cache.size()).toBe(0);
        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        expect(cache.size()).toBe(1);

        cache.removeData("root", undefined, new Locale("en-US"));

        expect(cache.size()).toBe(1);
    });

    test("should not remove data without locale", () => {
        expect.assertions(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        expect(cache.size()).toBe(0);
        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        expect(cache.size()).toBe(1);

        cache.removeData("root", "basename");

        expect(cache.size()).toBe(1);
    });

    test("should remove root locale data", () => {
        expect.assertions(5);
        let cache = DataCache.getDataCache();
        cache.clearData();

        expect(cache.size()).toBe(0);
        cache.storeData("root", "basename", undefined, { x: "string" });

        expect(cache.size()).toBe(1);
        let data = cache.getData("root", "basename", undefined);

        expect(data).toEqual({ x: 'string' });

        cache.removeData("root", "basename");

        expect(cache.size()).toBe(0);

        data = cache.getData("root", "basename", new Locale("en-US"));

        expect(typeof(data)).toBe('undefined');
    });

    test("should mark file as loaded", () => {
        expect.assertions(2);
        let cache = DataCache.getDataCache();
        cache.clearData();

        expect(!cache.isLoaded("a")).toBe(true);

        cache.markFileAsLoaded("a");

        expect(cache.isLoaded("a")).toBe(true);
    });

    test("should clear loaded file markers", () => {
        expect.assertions(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        expect(!cache.isLoaded("a")).toBe(true);

        cache.markFileAsLoaded("a");

        expect(cache.isLoaded("a")).toBe(true);

        cache.clearData();
        expect(!cache.isLoaded("a")).toBe(true);
    });

    test("should not mark empty file as loaded", () => {
        expect.assertions(1);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.markFileAsLoaded("");

        expect(!cache.isLoaded("")).toBe(true);
    });

    test("should not mark undefined file as loaded", () => {
        expect.assertions(1);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.markFileAsLoaded();

        expect(!cache.isLoaded()).toBe(true);
    });

    test("should not mark non-string file as loaded", () => {
        expect.assertions(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.markFileAsLoaded(2);
        cache.markFileAsLoaded(true);
        cache.markFileAsLoaded(function() { return true; });

        expect(!cache.isLoaded(2)).toBe(true);
        expect(!cache.isLoaded(true)).toBe(true);
        expect(!cache.isLoaded(function() { return true; })).toBe(true);
    });

    test("should not store null data over existing data", () => {
        expect.assertions(4);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        let data = cache.getData("root", "basename", new Locale("en-US"));

        expect(data).toBeTruthy();
        expect(data).toEqual({ x: "string" });

        cache.storeData("root", "basename", new Locale("en-US"), null);

        data = cache.getData("root", "basename", new Locale("en-US"));

        expect(data).toBeTruthy();
        expect(data).toEqual({ x: "string" });
    });

    test("should store null data over undefined data", () => {
        expect.assertions(1);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.storeData("root", "basename", new Locale("en-US"), undefined);
        cache.storeData("root", "basename", new Locale("en-US"), null);

        const data = cache.getData("root", "basename", new Locale("en-US"));

        expect(data).toBeNull();
   });

    // File-level caching methods for FileCache integration
    describe("File-level caching", () => {
        test("should get undefined for non-existent file data", () => {
            expect.assertions(1);
            let cache = DataCache.getDataCache();
            cache.clearData();

            const data = cache.getFileData("nonexistent.json");
            expect(data).toBeUndefined();
        });

        test("should set and get file data", () => {
            expect.assertions(2);
            let cache = DataCache.getDataCache();
            cache.clearData();

            const testData = { content: "test data" };
            cache.setFileData("test.json", testData);

            const retrievedData = cache.getFileData("test.json");
            expect(retrievedData).toBe(testData);
            expect(cache.getFileDataCount()).toBe(1);
        });

        test("should set null file data for failed loads", () => {
            expect.assertions(2);
            let cache = DataCache.getDataCache();
            cache.clearData();

            cache.setFileData("failed.json", null);

            const retrievedData = cache.getFileData("failed.json");
            expect(retrievedData).toBeNull();
            expect(cache.getFileDataCount()).toBe(1);
        });

        test("should remove file data", () => {
            expect.assertions(3);
            let cache = DataCache.getDataCache();
            cache.clearData();

            cache.setFileData("test.json", { content: "test" });
            expect(cache.getFileDataCount()).toBe(1);

            cache.removeFileData("test.json");
            expect(cache.getFileDataCount()).toBe(0);
            expect(cache.getFileData("test.json")).toBeUndefined();
        });

        test("should handle invalid file paths gracefully", () => {
            expect.assertions(3);
            let cache = DataCache.getDataCache();
            cache.clearData();

            cache.setFileData("", { content: "test" });
            cache.setFileData(null, { content: "test" });
            cache.setFileData(undefined, { content: "test" });

            expect(cache.getFileDataCount()).toBe(0);
            expect(cache.getFileData("")).toBeUndefined();
            expect(cache.getFileData(null)).toBeUndefined();
        });

        test("should get undefined for non-existent file promise", () => {
            expect.assertions(1);
            let cache = DataCache.getDataCache();
            cache.clearData();

            const promise = cache.getFilePromise("nonexistent.json");
            expect(promise).toBeUndefined();
        });

        test("should set and get file promise", () => {
            expect.assertions(2);
            let cache = DataCache.getDataCache();
            cache.clearData();

            const testPromise = Promise.resolve("test data");
            cache.setFilePromise("test.json", testPromise);

            const retrievedPromise = cache.getFilePromise("test.json");
            expect(retrievedPromise).toBe(testPromise);
            expect(cache.getFilePromiseCount()).toBe(1);
        });

        test("should remove file promise", () => {
            expect.assertions(3);
            let cache = DataCache.getDataCache();
            cache.clearData();

            const testPromise = Promise.resolve("test data");
            cache.setFilePromise("test.json", testPromise);
            expect(cache.getFilePromiseCount()).toBe(1);

            cache.removeFilePromise("test.json");
            expect(cache.getFilePromiseCount()).toBe(0);
            expect(cache.getFilePromise("test.json")).toBeUndefined();
        });

        test("should handle invalid file paths for promises gracefully", () => {
            expect.assertions(3);
            let cache = DataCache.getDataCache();
            cache.clearData();

            const testPromise = Promise.resolve("test data");
            cache.setFilePromise("", testPromise);
            cache.setFilePromise(null, testPromise);
            cache.setFilePromise(undefined, testPromise);

            expect(cache.getFilePromiseCount()).toBe(0);
            expect(cache.getFilePromise("")).toBeUndefined();
            expect(cache.getFilePromise(null)).toBeUndefined();
        });

        test("should clear file cache", () => {
            expect.assertions(4);
            let cache = DataCache.getDataCache();
            cache.clearData();

            // Add some file data and promises
            cache.setFileData("data1.json", { content: "data1" });
            cache.setFileData("data2.json", { content: "data2" });
            cache.setFilePromise("promise1.json", Promise.resolve("promise1"));
            cache.setFilePromise("promise2.json", Promise.resolve("promise2"));

            expect(cache.getFileDataCount()).toBe(2);
            expect(cache.getFilePromiseCount()).toBe(2);

            cache.clearFileCache();

            expect(cache.getFileDataCount()).toBe(0);
            expect(cache.getFilePromiseCount()).toBe(0);
        });

        test("should get correct file promise count", () => {
            expect.assertions(4);
            let cache = DataCache.getDataCache();
            cache.clearData();

            expect(cache.getFilePromiseCount()).toBe(0);

            cache.setFilePromise("file1.json", Promise.resolve("data1"));
            expect(cache.getFilePromiseCount()).toBe(1);

            cache.setFilePromise("file2.json", Promise.resolve("data2"));
            expect(cache.getFilePromiseCount()).toBe(2);

            cache.removeFilePromise("file1.json");
            expect(cache.getFilePromiseCount()).toBe(1);
        });

        test("should get correct file data count", () => {
            expect.assertions(4);
            let cache = DataCache.getDataCache();
            cache.clearData();

            expect(cache.getFileDataCount()).toBe(0);

            cache.setFileData("file1.json", { content: "data1" });
            expect(cache.getFileDataCount()).toBe(1);

            cache.setFileData("file2.json", { content: "data2" });
            expect(cache.getFileDataCount()).toBe(2);

            cache.removeFileData("file1.json");
            expect(cache.getFileDataCount()).toBe(1);
        });

        test("should clear file cache when clearing all data", () => {
            expect.assertions(4);
            let cache = DataCache.getDataCache();
            cache.clearData();

            // Add some file data and promises
            cache.setFileData("data.json", { content: "test" });
            cache.setFilePromise("promise.json", Promise.resolve("test"));

            expect(cache.getFileDataCount()).toBe(1);
            expect(cache.getFilePromiseCount()).toBe(1);

            cache.clearData();

            expect(cache.getFileDataCount()).toBe(0);
            expect(cache.getFilePromiseCount()).toBe(0);
        });
    });

    describe('getBasenamesForLocale', () => {
        test('should return empty array for invalid parameters', () => {
            expect.assertions(4);
            let cache = DataCache.getDataCache();
            cache.clearData();

            // Test with null root
            expect(cache.getBasenamesForLocale(null, 'en-US')).toEqual([]);

            // Test with null locale
            expect(cache.getBasenamesForLocale('./test', null)).toEqual([]);

            // Test with undefined root
            expect(cache.getBasenamesForLocale(undefined, 'en-US')).toEqual([]);

            // Test with undefined locale
            expect(cache.getBasenamesForLocale('./test', undefined)).toEqual([]);
        });

        test('should return empty array for non-existent root', () => {
            expect.assertions(1);
            let cache = DataCache.getDataCache();
            cache.clearData();

            expect(cache.getBasenamesForLocale('./nonexistent', 'en-US')).toEqual([]);
        });

        test('should return empty array for non-existent locale', () => {
            expect.assertions(1);
            let cache = DataCache.getDataCache();
            cache.clearData();

            // Add some data for a different locale
            cache.storeData('./test', 'info', 'en', { a: 'b' });

            expect(cache.getBasenamesForLocale('./test', 'fr-FR')).toEqual([]);
        });

        test('should return basenames for existing locale', () => {
            expect.assertions(2);
            let cache = DataCache.getDataCache();
            cache.clearData();

            // Add data for multiple basenames
            cache.storeData('./test', 'info', 'en-US', { a: 'b' });
            cache.storeData('./test', 'numbers', 'en-US', { c: 'd' });
            cache.storeData('./test', 'dates', 'en-US', { e: 'f' });

            const basenames = cache.getBasenamesForLocale('./test', 'en-US');
            expect(basenames).toHaveLength(3);
            expect(basenames.sort()).toEqual(['dates', 'info', 'numbers']);
        });

        test('should handle Locale objects', () => {
            expect.assertions(1);
            let cache = DataCache.getDataCache();
            cache.clearData();

            // Add data using Locale object
            const locale = new Locale('en-US');
            cache.storeData('./test', 'info', locale, { a: 'b' });
            cache.storeData('./test', 'numbers', locale, { c: 'd' });

            const basenames = cache.getBasenamesForLocale('./test', locale);
            expect(basenames.sort()).toEqual(['info', 'numbers']);
        });

        test('should handle root locale', () => {
            expect.assertions(1);
            let cache = DataCache.getDataCache();
            cache.clearData();

            // Add data for root locale
            cache.storeData('./test', 'info', 'root', { a: 'b' });
            cache.storeData('./test', 'numbers', 'root', { c: 'd' });

            const basenames = cache.getBasenamesForLocale('./test', 'root');
            expect(basenames.sort()).toEqual(['info', 'numbers']);
        });
    });
});
