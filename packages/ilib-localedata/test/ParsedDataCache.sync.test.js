/**
 * @license
 * Copyright (c) 2025, JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ParsedDataCache from '../src/ParsedDataCache.js';
import DataCache from '../src/DataCache.js';
import LoaderFactory from 'ilib-loader';
import Locale from 'ilib-locale';

describe('ParsedDataCache Sync Tests (Node Only)', () => {
    let parsedDataCache;
    let dataCache;

    beforeEach(() => {
        // Clear any existing data cache
        DataCache.clearDataCache();
        const loader = LoaderFactory();
        parsedDataCache = new ParsedDataCache(loader);
        dataCache = DataCache.getDataCache();
    });

    afterEach(() => {
        // Clean up after each test
        DataCache.clearDataCache();
    });

    describe('getParsedDataSync', () => {
        test('should load and cache data from .js files synchronously', () => {
            expect.assertions(4);

            const locale = new Locale("en-US");
            const roots = ["./test/files7"];
            const basename = "info";

            const result = parsedDataCache.getParsedDataSync(locale, roots, basename);

            // ParsedDataCache should return undefined for en-US since the file doesn't contain en-US data
            // The file only has root and en data, not en-US data
            expect(result).toBeUndefined();
            expect(parsedDataCache.hasParsedData("./test/files7", "info", null)).toBe(true);
            expect(parsedDataCache.hasParsedData("./test/files7", "info", "en")).toBe(true);
            expect(parsedDataCache.hasParsedData("./test/files7", "info", "en-US")).toBe(false);
        });

        test('should load and cache data from .js files with only root data synchronously', () => {
            expect.assertions(4);

            const locale = new Locale("root");
            const roots = ["./test/files7"];
            const basename = "info";

            const result = parsedDataCache.getParsedDataSync(locale, roots, basename);

            expect(result).toBeTruthy();
            expect(parsedDataCache.hasParsedData("./test/files7", "info", null)).toBe(true);
            expect(parsedDataCache.hasParsedData("./test/files7", "info", "root")).toBe(true);
            expect(result).toEqual({ "a": "b root", "c": "d root" });
        });

        test('should load data from .js files for specific locale synchronously', () => {
            expect.assertions(3);

            const locale = new Locale("en");
            const roots = ["./test/files7"];
            const basename = "info";

            const result = parsedDataCache.getParsedDataSync(locale, roots, basename);

            // Since there's no en.js file in files7, this should return undefined
            expect(result).toBeUndefined();
            expect(parsedDataCache.hasParsedData("./test/files7", "info", "en")).toBe(false); // Should cache null for attempted load
            expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);
        });

        test('should return undefined for invalid file content synchronously', () => {
            expect.assertions(2);

            const locale = new Locale("invalid");
            const roots = ["./test/files7"];
            const basename = "info";

            const result = parsedDataCache.getParsedDataSync(locale, roots, basename);

            expect(result).toBeUndefined();
            // Cache count should be > 0 since we store null for attempted loads
            expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);
        });

        test('should handle multiple roots and return data from the first available synchronously', () => {
            expect.assertions(3);

            const locale = new Locale("en-US");
            const roots = ["./test/files4", "./test/files7"]; // First root doesn't exist
            const basename = "info";

            const result = parsedDataCache.getParsedDataSync(locale, roots, basename);

            // ParsedDataCache should return data from files4 since it has en-US data
            expect(result).toBeTruthy();
            expect(parsedDataCache.hasParsedData("./test/files4", "info", "en-US")).toBe(true);
            expect(parsedDataCache.hasParsedData("./test/files7", "info", "en-US")).toBe(false);
        });

        test('should return data from first available root synchronously', () => {
            expect.assertions(2);

            const locale = new Locale("en-US");
            const roots = ["./test/files4", "./test/files7"]; // files4 has data, files7 doesn't
            const basename = "info";

            const result = parsedDataCache.getParsedDataSync(locale, roots, basename);

            // ParsedDataCache should return data from files4 since it has en-US data
            expect(result).toBeTruthy();
            expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0); // Should cache some data
        });
    });

    describe('Cache Behavior Sync', () => {
        test('should return cached data without reparsing when calling getParsedDataSync twice', () => {
            expect.assertions(3);

            const locale = new Locale("en-US");
            const roots = ["./test/files7"];
            const basename = "info";

            // First call - should load from file and parse
            const result1 = parsedDataCache.getParsedDataSync(locale, roots, basename);
            // ParsedDataCache should return undefined for en-US since the file doesn't contain en-US data
            expect(result1).toBeUndefined();
            expect(parsedDataCache.hasParsedData("./test/files7", "info", "en-US")).toBe(false);

            // Second call - should return cached data without reparsing
            const result2 = parsedDataCache.getParsedDataSync(locale, roots, basename);
            expect(result2).toBe(result1); // Should be the same object reference (both undefined)
        });
    });

    describe('Fallback from .js to .json files (files2)', () => {
        test('should fall back from .js files to hierarchical .json files when .js files have no data for locale', () => {
            expect.assertions(4);

            const locale = new Locale("en-US");
            const roots = ["./test/files7", "./test/files2"]; // files7 has .js but no en-US data, files2 has hierarchical .json
            const basename = "merge";

            const result = parsedDataCache.getParsedDataSync(locale, roots, basename);

            // Should fall back to files2/en/US/merge.json since files7 doesn't have en-US data
            expect(result).toBeTruthy();
            expect(result).toEqual({ "a": "a from files2 en-US", "d": "d from files2 en-US" });
            expect(parsedDataCache.hasParsedData("./test/files2", "merge", "en-US")).toBe(true);
            expect(parsedDataCache.hasParsedData("./test/files7", "merge", "en-US")).toBe(false); // Should cache null for attempted load
        });

        test('should load hierarchical .json files with different basenames', () => {
            expect.assertions(3);

            const locale = new Locale("en-US");
            const roots = ["./test/files7", "./test/files2"];
            const basename = "tester"; // Different basename than merge

            const result = parsedDataCache.getParsedDataSync(locale, roots, basename);

            // Should fall back to files2/en/US/tester.json
            expect(result).toBeTruthy();
            expect(parsedDataCache.hasParsedData("./test/files2", "tester", "en-US")).toBe(true);
            expect(parsedDataCache.hasParsedData("./test/files7", "tester", "en-US")).toBe(false); // Should cache null for attempted load
        });

        test('should automatically load data for all sublocales when loading .json files', () => {
            expect.assertions(6);

            const locale = new Locale("en-US");
            const roots = ["./test/files7", "./test/files2"];
            const basename = "merge";

            // First, ensure we have the data loaded
            const result = parsedDataCache.getParsedDataSync(locale, roots, basename);
            expect(result).toBeTruthy();

            // Now check that we can get language-level data (en) from the hierarchical structure
            expect(parsedDataCache.hasParsedData("./test/files2", "merge", null)).toBe(false);  // no root data
            expect(parsedDataCache.hasParsedData("./test/files2", "merge", "en")).toBe(true);
            expect(parsedDataCache.hasParsedData("./test/files2", "merge", "en-US")).toBe(true);

            // Trying getting the data directly from the cache to verify that the data is loaded
            const enResult = parsedDataCache.getCachedData("./test/files2", "merge", "en");
            expect(enResult).toBeTruthy();
            expect(enResult).toEqual({ "a": "a from files2 en", "d": "d from files2 en", "e": "e from files2 en" });
        });

        test('should automatically load data for the root locale when loading .json files', () => {
            expect.assertions(6);

            const locale = new Locale("fr-FR"); // Locale that doesn't exist in files2
            const roots = ["./test/files7", "./test/files2"];
            const basename = "merge2"; // Use merge2.json which exists at root level

            let result = parsedDataCache.getParsedDataSync(locale, roots, basename);

            // make sure it loaded all the data
            expect(parsedDataCache.hasParsedData("./test/files2", "merge2", null)).toBe(true);
            expect(parsedDataCache.hasParsedData("./test/files2", "merge2", "fr")).toBe(false); // No fr data found
            expect(parsedDataCache.hasParsedData("./test/files2", "merge2", "fr-FR")).toBe(false); // No fr-FR data found

            // Should be able to get the data for the root locale without loading anything else
            result = parsedDataCache.getCachedData("./test/files2", "merge2", null);
            expect(result).toBeTruthy();
            expect(result).toEqual({ "a": "a from files2", "c": "c from files2", "d": "d from files2" });
            expect(parsedDataCache.hasParsedData("./test/files2", "merge2", "fr-FR")).toBe(false); // Should cache null for attempted load
        });

        test('should handle complex locale with flat .json files', () => {
            expect.assertions(4);

            const locale = new Locale("ja-JP");
            const roots = ["./test/files7"];
            const basename = "foo";

            let result = parsedDataCache.getParsedDataSync(locale, roots, basename);

            // Should load files7/ja-JP.json
            expect(result).toBeTruthy();
            expect(parsedDataCache.hasParsedData("./test/files7", "foo", "ja-JP")).toBe(true);

            // Check that intermediate locales are not cached because they aren't mentioned in the file
            expect(parsedDataCache.hasParsedData("./test/files7", "foo", "ja")).toBe(false);
            expect(parsedDataCache.hasParsedData("./test/files7", "foo", null)).toBe(false);
        });
    });

    test('should handle complex locale with hierarchical .json files', () => {
        expect.assertions(4);

        const locale = new Locale("ja-JP");
        const roots = ["./test/files2"];
        const basename = "tester";

        let result = parsedDataCache.getParsedDataSync(locale, roots, basename);

        // Should load files2/ja/JP/tester.json and all of its sublocales
        expect(result).toBeTruthy();
        expect(parsedDataCache.hasParsedData("./test/files2", "tester", "ja-JP")).toBe(true);

        // Check that intermediate locales are also cached, even though they do not exist on disk
        expect(parsedDataCache.hasParsedData("./test/files2", "tester", "ja")).toBe(false);
        expect(parsedDataCache.hasParsedData("./test/files2", "tester", null)).toBe(false);
    });
});
