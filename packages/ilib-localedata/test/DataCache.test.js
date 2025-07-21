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
});