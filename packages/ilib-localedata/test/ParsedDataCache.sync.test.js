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
        loader.setSyncMode();
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
            expect(parsedDataCache.hasParsedData("./test/files7", "info", "en")).toBe(false);
            expect(parsedDataCache.getCachedEntryCount()).toBe(0);
        });

        test('should return undefined for invalid file content synchronously', () => {
            expect.assertions(2);

            const locale = new Locale("invalid");
            const roots = ["./test/files7"];
            const basename = "info";

            const result = parsedDataCache.getParsedDataSync(locale, roots, basename);

            expect(result).toBeUndefined();
            expect(parsedDataCache.getCachedEntryCount()).toBe(0);
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

    describe('Parameter Validation', () => {
        test('should handle invalid parameters in getParsedDataSync', () => {
            expect.assertions(6);

            // Test with null locale
            const nullLocaleResult = parsedDataCache.getParsedDataSync(null, ['./test/files2'], 'tester');
            expect(nullLocaleResult).toBeUndefined();

            // Test with undefined locale
            const undefinedLocaleResult = parsedDataCache.getParsedDataSync(undefined, ['./test/files2'], 'tester');
            expect(undefinedLocaleResult).toBeUndefined();

            // Test with null roots
            const nullRootsResult = parsedDataCache.getParsedDataSync(new Locale('en-US'), null, 'tester');
            expect(nullRootsResult).toBeUndefined();

            // Test with empty roots array
            const emptyRootsResult = parsedDataCache.getParsedDataSync(new Locale('en-US'), [], 'tester');
            expect(emptyRootsResult).toBeUndefined();

            // Test with null basename
            const nullBasenameResult = parsedDataCache.getParsedDataSync(new Locale('en-US'), ['./test/files2'], null);
            expect(nullBasenameResult).toBeUndefined();

            // Test with undefined basename
            const undefinedBasenameResult = parsedDataCache.getParsedDataSync(new Locale('en-US'), ['./test/files2'], undefined);
            expect(undefinedBasenameResult).toBeUndefined();
        });

        test('should handle invalid parameters in hasParsedData', () => {
            expect.assertions(6);

            // Test with null root
            expect(parsedDataCache.hasParsedData(null, 'tester', 'en-US')).toBe(false);

            // Test with undefined root
            expect(parsedDataCache.hasParsedData(undefined, 'tester', 'en-US')).toBe(false);

            // Test with null basename
            expect(parsedDataCache.hasParsedData('./test/files2', null, 'en-US')).toBe(false);

            // Test with undefined basename
            expect(parsedDataCache.hasParsedData('./test/files2', undefined, 'en-US')).toBe(false);

            // Test with empty string root
            expect(parsedDataCache.hasParsedData('', 'tester', 'en-US')).toBe(false);

            // Test with empty string basename
            expect(parsedDataCache.hasParsedData('./test/files2', '', 'en-US')).toBe(false);
        });

        test('should handle invalid parameters in getCachedData', () => {
            expect.assertions(6);

            // Test with null root
            const nullRootResult = parsedDataCache.getCachedData(null, 'tester', 'en-US');
            expect(nullRootResult).toBeUndefined();

            // Test with undefined root
            const undefinedRootResult = parsedDataCache.getCachedData(undefined, 'tester', 'en-US');
            expect(undefinedRootResult).toBeUndefined();

            // Test with null basename
            const nullBasenameResult = parsedDataCache.getCachedData('./test/files2', null, 'en-US');
            expect(nullBasenameResult).toBeUndefined();

            // Test with undefined basename
            const undefinedBasenameResult = parsedDataCache.getCachedData('./test/files2', undefined, 'en-US');
            expect(undefinedBasenameResult).toBeUndefined();

            // Test with empty string root
            const emptyRootResult = parsedDataCache.getCachedData('', 'tester', 'en-US');
            expect(emptyRootResult).toBeUndefined();

            // Test with empty string basename
            const emptyBasenameResult = parsedDataCache.getCachedData('./test/files2', '', 'en-US');
            expect(emptyBasenameResult).toBeUndefined();
        });
    });

    describe('Multi-root data loading', () => {
        test('should load data from all roots for a given locale', () => {
            expect.assertions(5);

            // Load data for de-DE from multiple roots
            const result = parsedDataCache.getParsedDataSync('de-DE', ['./test/files7', './test/files4'], 'foo');

            expect(result).toBeDefined();

            // Verify data was loaded from files7
            expect(parsedDataCache.hasParsedData('./test/files7', 'foo', 'de-DE')).toBe(true);
            const files7Data = parsedDataCache.getCachedData('./test/files7', 'foo', 'de-DE');
            expect(files7Data).toEqual({
                "m": "n de",
                "o": "p de",
                "q": "r de"
            });

            // Verify data was loaded from files4
            expect(parsedDataCache.hasParsedData('./test/files4', 'foo', 'de-DE')).toBe(true);
            const files4Data = parsedDataCache.getCachedData('./test/files4', 'foo', 'de-DE');
            expect(files4Data).toEqual({
                "m": "n de-DE",
                "o": "p de-DE"
            });
        });

        test('should load data from all roots even when some roots have no data', () => {
            expect.assertions(5);

            // Load data for en-US from multiple roots (files7 has data, files5 doesn't)
            const result = parsedDataCache.getParsedDataSync('en-US', ['./test/files7', './test/files5'], 'info');

            expect(result).toBeUndefined();

            // Verify data was loaded from files7
            expect(parsedDataCache.hasParsedData('./test/files7', 'info', 'en-US')).toBe(false);
            expect(parsedDataCache.hasParsedData('./test/files7', 'info', 'en')).toBe(true);
            expect(parsedDataCache.hasParsedData('./test/files7', 'info', null)).toBe(true);

            // Verify files5 was checked but has no data
            expect(parsedDataCache.hasParsedData('./test/files5', 'info', 'en-US')).toBe(false);
        });

        test('should load root data from all roots', () => {
            expect.assertions(5);

            // Load root data from multiple roots
            const result = parsedDataCache.getParsedDataSync(null, ['./test/files7', './test/files4'], 'info');

            expect(result).toBeDefined();

            // Verify root data was loaded from files7
            expect(parsedDataCache.hasParsedData('./test/files7', 'info', null)).toBe(true);
            const files7RootData = parsedDataCache.getCachedData('./test/files7', 'info', null);
            expect(files7RootData).toEqual({
                "a": "b root",
                "c": "d root"
            });

            // Verify root data was loaded from files4
            expect(parsedDataCache.hasParsedData('./test/files4', 'info', null)).toBe(true);
            const files4RootData = parsedDataCache.getCachedData('./test/files4', 'info', null);
            expect(files4RootData).toEqual({
                "a": "b root",
                "c": "d root"
            });
        });

        test('should cache null for missing data in all roots', () => {
            expect.assertions(3);

            // Try to load non-existent data from multiple roots
            const result = parsedDataCache.getParsedDataSync('non-existent', ['./test/files7', './test/files4'], 'non-existent');

            expect(result).toBeUndefined();

            // Verify that null was cached for both roots (indicating attempted load)
            expect(parsedDataCache.hasParsedData('./test/files7', 'non-existent', 'non-existent')).toBe(false);
            expect(parsedDataCache.hasParsedData('./test/files4', 'non-existent', 'non-existent')).toBe(false);
        });

        test('should load different data formats from different roots', () => {
            expect.assertions(7);

            // Load data from roots with different file formats (.js and .json)
            const result = parsedDataCache.getParsedDataSync('en-US', ['./test/files7', './test/files4'], 'info');

            expect(result).toBeDefined();

            // Verify .js file data from files7
            expect(parsedDataCache.hasParsedData('./test/files7', 'info', 'en-US')).toBe(false);
            expect(parsedDataCache.hasParsedData('./test/files7', 'info', 'en')).toBe(true);
            expect(parsedDataCache.hasParsedData('./test/files7', 'info', null)).toBe(true);
            const jsData = parsedDataCache.getCachedData('./test/files7', 'info', 'en');
            expect(jsData).toEqual({
                "a": "b en",
                "c": "d en"
            });

            // Verify .json file data from files4
            expect(parsedDataCache.hasParsedData('./test/files4', 'info', 'en-US')).toBe(true);
            const jsonData = parsedDataCache.getCachedData('./test/files4', 'info', 'en-US');
            expect(jsonData).toEqual({
                "a": "b",
                "c": "d"
            });
        });

        test('should maintain separate cache entries for each root', () => {
            expect.assertions(9);

            // Load same locale/basename from different roots
            parsedDataCache.getParsedDataSync('en-US', ['./test/files7'], 'info');
            parsedDataCache.getParsedDataSync('en-US', ['./test/files4'], 'info');

            // Verify separate cache entries exist
            expect(parsedDataCache.hasParsedData('./test/files7', 'info', 'en-US')).toBe(false);
            expect(parsedDataCache.hasParsedData('./test/files7', 'info', 'en')).toBe(true);
            expect(parsedDataCache.hasParsedData('./test/files7', 'info', null)).toBe(true);
            expect(parsedDataCache.hasParsedData('./test/files4', 'info', 'en-US')).toBe(true);
            expect(parsedDataCache.hasParsedData('./test/files4', 'info', 'en')).toBe(false);
            expect(parsedDataCache.hasParsedData('./test/files4', 'info', null)).toBe(false);

            // Verify they contain different data
            const files7Data = parsedDataCache.getCachedData('./test/files7', 'info', 'en');
            const files4Data = parsedDataCache.getCachedData('./test/files4', 'info', 'en-US');

            expect(files7Data).not.toEqual(files4Data);
            expect(files7Data).toEqual({
                "a": "b en",
                "c": "d en"
            });

            expect(files4Data).toEqual({
                "a": "b",
                "c": "d"
            });
        });

        test('should not load data from ESM modules because they cannot be loaded synchronously in Javascript', () => {
            expect.assertions(4);

            // Load data from an ESM module
            const result = parsedDataCache.getParsedDataSync('en-US', ['./test/files3'], 'info');
            expect(result).toBeUndefined();

            // the file is not loaded because it is an ESM module, so no data should be cached
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(false);
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en')).toBe(false);
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', null)).toBe(false);
        });
    });
});
