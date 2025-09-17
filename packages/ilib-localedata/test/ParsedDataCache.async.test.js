/*
 * ParsedDataCache.async.test.js - async unit tests for the ParsedDataCache class (Node and Browser)
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

import ParsedDataCache from '../src/ParsedDataCache.js';
import LoaderFactory from 'ilib-loader';
import Locale from 'ilib-locale';
import DataCache from '../src/DataCache.js';

describe('ParsedDataCache Async Tests (Node and Browser)', () => {
    let loader;
    let parsedDataCache;

    beforeEach(() => {
        loader = LoaderFactory();
        loader.setSyncMode(); // Enable sync mode for tests that need it
        parsedDataCache = new ParsedDataCache(loader);
    });

    afterEach(() => {
        // Clean up the shared DataCache after each test
        DataCache.clearDataCache();
    });

    describe('Constructor', () => {
        test('should create a ParsedDataCache instance with the provided loader', () => {
            expect.assertions(1);
            expect(parsedDataCache.loader).toBe(loader);
        });

        test('should initialize with a DataCache instance', () => {
            expect.assertions(1);
            expect(parsedDataCache.dataCache).toBeDefined();
        });
    });

    describe('getParsedData', () => {
        describe('Load data from .js files asynchronously', () => {
            test('should load and cache data from .js files asynchronously', async () => {
                expect.assertions(5);

                const locale = new Locale('en-US');
                const roots = ['./test/files3'];
                const basename = 'info';

                const result = await parsedDataCache.getParsedData(locale, roots, basename);

                expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(false);
                expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en')).toBe(true);
                expect(parsedDataCache.hasParsedData('./test/files3', 'info', null)).toBe(true);
                expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);
                // ParsedDataCache should return undefined for en-US since it doesn't exist in the file
                // The file only has root and en data, not en-US data
                expect(result).toBeUndefined();
            });

            test('should load and cache data from .js files with only root data asynchronously', async () => {
                expect.assertions(7);

                const locale = new Locale('en-GB');
                const roots = ['./test/files3'];
                const basename = 'datefmt';

                const result = await parsedDataCache.getParsedData(locale, roots, basename);

                expect(parsedDataCache.hasParsedData('./test/files3', 'datefmt', 'en-GB')).toBe(false);
                expect(parsedDataCache.hasParsedData('./test/files3', 'datefmt', 'en')).toBe(false);
                expect(parsedDataCache.hasParsedData('./test/files3', 'datefmt', null)).toBe(true);
                expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);
                // ParsedDataCache should return undefined for en-GB since it doesn't exist in the file
                // The file only has root and en data, not en-GB data
                expect(result).toBeUndefined();

                // make sure en data is cached as null since it doesn't exist in the file
                expect(parsedDataCache.hasParsedData('./test/files3', 'datefmt', 'en')).toBe(false);
                // make sure root data is cached since it exists in the file
                expect(parsedDataCache.hasParsedData('./test/files3', 'datefmt', null)).toBe(true);
            });

            test('should load and cache data from .js files with only root data asynchronously', async () => {
                expect.assertions(5);

                const locale = new Locale('en-GB');
                const roots = ['./test/files3'];
                const basename = 'address';

                const result = await parsedDataCache.getParsedData(locale, roots, basename);

                expect(parsedDataCache.hasParsedData('./test/files3', 'address', 'en-GB')).toBe(false);
                expect(parsedDataCache.hasParsedData('./test/files3', 'address', 'en')).toBe(true);
                expect(parsedDataCache.hasParsedData('./test/files3', 'address', null)).toBe(true);
                expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);
                // ParsedDataCache should return undefined for en-GB since it doesn't exist in the file
                // The file only has root and en data, not en-GB data
                expect(result).toBeUndefined();
            });

            test('should load data from .js file and return it from the cache', async () => {
                expect.assertions(8);

                const locale = new Locale('en-AU');
                const roots = ['./test/files3'];
                const basename = 'address';

                // first call should load the data from the file
                const result1 = await parsedDataCache.getParsedData(locale, roots, basename);
                expect(result1).toBeTruthy();
                expect(result1).toEqual({
                    "region": "State",
                    "locality": "Township"
                });
                expect(parsedDataCache.hasParsedData('./test/files3', 'address', 'en-AU')).toBe(true);
                expect(parsedDataCache.hasParsedData('./test/files3', 'address', 'en')).toBe(true);
                expect(parsedDataCache.hasParsedData('./test/files3', 'address', null)).toBe(true);
                expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);

                const result2 = parsedDataCache.getCachedData(roots, basename, locale.getSpec());
                expect(result2).toBe(result1);
                expect(parsedDataCache.getCachedEntryCount()).toBe(4); // 2 for the root, 1 for en, 1 for en-AU
            });

            test("should return nothing if the locale's .js file is not found", async () => {
                expect.assertions(5);
            
                const locale = new Locale('kk-KZ');
                const roots = ['./test/files3'];
                const basename = 'address';

                const result = await parsedDataCache.getParsedData(locale, roots, basename);
                expect(result).toBeUndefined();
                expect(parsedDataCache.hasParsedData('./test/files3', 'address', 'kk-KZ')).toBe(false);
                expect(parsedDataCache.hasParsedData('./test/files3', 'address', 'kk')).toBe(false);
                expect(parsedDataCache.hasParsedData('./test/files3', 'address', null)).toBe(false);
                expect(parsedDataCache.getCachedEntryCount()).toBe(0);
            });

            test("should return the cached sublocale data on the second call", async () => {
                expect.assertions(8);

                const locale = new Locale('en-US');
                const roots = ['./test/files3'];
                const basename = 'foo';

                const result = await parsedDataCache.getParsedData(locale, roots, basename);
                expect(result).toBeUndefined();
                expect(parsedDataCache.hasParsedData('./test/files3', 'foo', 'en-US')).toBe(false);
                expect(parsedDataCache.hasParsedData('./test/files3', 'foo', 'en')).toBe(true);
                expect(parsedDataCache.hasParsedData('./test/files3', 'foo', null)).toBe(true);
                expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);

                const result2 = parsedDataCache.getCachedData(roots, basename, 'en');
                // should return the cached data immediately
                expect(result2).toBeTruthy();
                expect(result2).toEqual({
                    "m": "n en",
                    "o": "p en"
                });
                expect(parsedDataCache.getCachedEntryCount()).toBe(4); // 2 for the root, 2 for en
            });
        });

        describe('Load data from flat .json files asynchronously', () => {
            test('should load data from flat .json files asynchronously', async () => {
                expect.assertions(4);

                const locale = new Locale('zh-Hant-TW');
                const roots = ['./test/files4'];
                const basename = 'info';

                const result = await parsedDataCache.getParsedData(locale, roots, basename);

                expect(result).toBeTruthy();
                expect(result).toEqual({
                    "a": "b zh-Hant-TW",
                    "c": "d zh-Hant-TW"
                });
                expect(parsedDataCache.hasParsedData('./test/files4', 'info', 'zh-Hant-TW')).toBe(true);
                expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);
            });

            test('should fall back from .js files to .json files in another root when .js files have no data for locale', async () => {
                expect.assertions(4);

                const locale = new Locale('zh-Hant-TW');
                // First try files3 (which has .js files but no en-US data), then fall back to files4
                const roots = ['./test/files3', './test/files4'];
                const basename = 'info';

                const result = await parsedDataCache.getParsedData(locale, roots, basename);

                // Should find data in files4 after failing to find it in files3
                expect(result).toBeTruthy();
                expect(result).toEqual({
                    "a": "b zh-Hant-TW",
                    "c": "d zh-Hant-TW"
                });
                expect(parsedDataCache.hasParsedData('./test/files4', 'info', 'zh-Hant-TW')).toBe(true);
                expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);
            });

            test('should fall back to .json files for different basenames', async () => {
                expect.assertions(4);

                const locale = new Locale('de-DE');
                const roots = ['./test/files3', './test/files4'];
                const basename = 'bar';

                const result = await parsedDataCache.getParsedData(locale, roots, basename);

                // Should find foo data in files4 after failing to find it in files3
                expect(result).toBeTruthy();
                expect(result).toEqual({
                    "h": "i de",
                    "j": "k de"
                });
                expect(parsedDataCache.hasParsedData('./test/files4', 'bar', 'de-DE')).toBe(true);
                expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);
            });
        });

        describe('Load data from hierarchical .json files asynchronously', () => {
            test('should load and cache data from hierarchical .json files asynchronously', async () => {
                expect.assertions(4);

                const locale = new Locale('en-US');
                const roots = ['./test/files2'];
                const basename = 'merge';

                const result = await parsedDataCache.getParsedData(locale, roots, basename);

                expect(result).toBeTruthy();
                expect(result).toEqual({
                    "a": "a from files2 en-US",
                    "d": "d from files2 en-US"
                });
                expect(parsedDataCache.hasParsedData('./test/files2', 'merge', 'en-US')).toBe(true);
                expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);
            });

            test('should load all sublocales of a hierarchical .json file asynchronously', async () => {
                expect.assertions(5);

                const locale = new Locale('en-US');
                const roots = ['./test/files2'];
                const basename = 'merge';

                const result = await parsedDataCache.getParsedData(locale, roots, basename);

                expect(result).toBeTruthy();
                expect(result).toEqual({
                    "a": "a from files2 en-US",
                    "d": "d from files2 en-US"
                });

                expect(parsedDataCache.hasParsedData('./test/files2', 'merge', 'en-US')).toBe(true);
                expect(parsedDataCache.hasParsedData('./test/files2', 'merge', 'en')).toBe(true);
                expect(parsedDataCache.hasParsedData('./test/files2', 'merge', null)).toBe(false);
            });
        });

        describe('other tests', () => {
            test('should return undefined for invalid file content', async () => {
                expect.assertions(2);

                const locale = new Locale('en-US');
                const roots = ['./test/files5'];
                const basename = 'info';

                const result = await parsedDataCache.getParsedData(locale, roots, basename);

                expect(result).toBeUndefined();
                expect(parsedDataCache.getCachedEntryCount()).toBe(0);
            });

            test('should handle multiple roots and return data from the first available', async () => {
                expect.assertions(3);

                const locale = new Locale('en-US');
                const roots = ['./test/files3', './test/files4'];
                const basename = 'info';

                const result = await parsedDataCache.getParsedData(locale, roots, basename);

                expect(parsedDataCache.hasParsedData('./test/files4', 'info', 'en-US')).toBe(true);
                expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);
                // ParsedDataCache should return the data from files4 since en-US exists there
                expect(result).toEqual({"a": "b", "c": "d"});
            });

            test('should return data from first available root', async () => {
                expect.assertions(2);

                const locale = new Locale('en-US');
                const roots = ['./test/files4', './test/files5'];
                const basename = 'info';

                const result = await parsedDataCache.getParsedData(locale, roots, basename);

                // ParsedDataCache should return the data from files4 since en-US exists there
                expect(result).toEqual({"a": "b", "c": "d"});
                expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);
            });
        });
    });

    describe('hasParsedData', () => {
        test('should return true for existing parsed data', async () => {
            expect.assertions(3);

            // First load some data to populate the cache
            const locale = null;
            const roots = ['./test/files3'];
            const basename = 'info';

            const data = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(parsedDataCache.hasParsedData('./test/files3', 'info', null)).toBe(true);
            expect(parsedDataCache.getCachedEntryCount()).toBe(2);
            expect(data).toBeDefined();
        });

        test('should return false for non-existent parsed data', () => {
            expect.assertions(1);
            expect(parsedDataCache.hasParsedData('./test/files3', 'nonexistent', 'en-US')).toBe(false);
        });

        test('should return false for null data (indicating attempted load)', async () => {
            expect.assertions(2);

            // First attempt to load en-US data (which doesn't exist in the file)
            const locale = new Locale('en-US');
            const roots = ['./test/files3'];
            const basename = 'info';

            await parsedDataCache.getParsedData(locale, roots, basename);

            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(false);
            expect(parsedDataCache.getCachedEntryCount()).toBe(4);
        });
    });

    describe('storeParsedData', () => {
        test('should store parsed data correctly', () => {
            expect.assertions(2);

            const data = { test: 'data' };
            parsedDataCache.storeParsedData('./test/files3', 'test', 'en-US', data);

            expect(parsedDataCache.hasParsedData('./test/files3', 'test', 'en-US')).toBe(true);
            expect(parsedDataCache.getCachedData('./test/files3', 'test', 'en-US')).toBe(data);
        });

        test('should overwrite existing data', () => {
            expect.assertions(2);

            const data1 = { test: 'data1' };
            const data2 = { test: 'data2' };

            parsedDataCache.storeParsedData('./test/files3', 'test', 'en-US', data1);
            parsedDataCache.storeParsedData('./test/files3', 'test', 'en-US', data2);

            expect(parsedDataCache.hasParsedData('./test/files3', 'test', 'en-US')).toBe(true);
            expect(parsedDataCache.getCachedData('./test/files3', 'test', 'en-US')).toBe(data2);
        });
    });

    describe('removeParsedData', () => {
        test('should remove existing parsed data', () => {
            expect.assertions(2);

            const data = { test: 'data' };
            parsedDataCache.storeParsedData('./test/files3', 'test', 'en-US', data);
            expect(parsedDataCache.hasParsedData('./test/files3', 'test', 'en-US')).toBe(true);

            parsedDataCache.removeParsedData('./test/files3', 'test', 'en-US');
            expect(parsedDataCache.hasParsedData('./test/files3', 'test', 'en-US')).toBe(false);
        });

        test('should handle removing non-existent data gracefully', () => {
            expect.assertions(1);
            parsedDataCache.removeParsedData('./test/files3', 'nonexistent', 'en-US');
            expect(parsedDataCache.hasParsedData('./test/files3', 'nonexistent', 'en-US')).toBe(false);
        });
    });

    describe('clearAllParsedData', () => {
        test('should clear all parsed data from the cache', () => {
            expect.assertions(3);

            parsedDataCache.storeParsedData('./test/files3', 'test1', 'en-US', { test: 'data1' });
            parsedDataCache.storeParsedData('./test/files3', 'test2', 'en-GB', { test: 'data2' });

            const initialCount = parsedDataCache.getCachedEntryCount();
            expect(initialCount).toBeGreaterThan(0);

            parsedDataCache.clearAllParsedData();
            expect(parsedDataCache.getCachedEntryCount()).toBe(0);
            expect(parsedDataCache.hasParsedData('./test/files3', 'test1', 'en-US')).toBe(false);
        });
    });

    describe('getCachedEntryCount', () => {
        test('should return 0 for empty cache', () => {
            expect.assertions(1);
            expect(parsedDataCache.getCachedEntryCount()).toBe(0);
        });

        test('should return correct count for populated cache', () => {
            expect.assertions(2);

            const initialCount = parsedDataCache.getCachedEntryCount();
            parsedDataCache.storeParsedData('./test/files3', 'test', 'en-US', { test: 'data' });
            expect(parsedDataCache.getCachedEntryCount()).toBe(initialCount + 1);
            expect(parsedDataCache.hasParsedData('./test/files3', 'test', 'en-US')).toBe(true);
        });
    });

    describe('Integration with DataCache', () => {
        test('should use the shared DataCache instance', () => {
            expect.assertions(1);
            const newParsedDataCache = new ParsedDataCache(loader);
            expect(newParsedDataCache.dataCache).toBe(parsedDataCache.dataCache);
        });

        test('should persist data across ParsedDataCache instances', () => {
            expect.assertions(2);

            const data = { test: 'data' };
            parsedDataCache.storeParsedData('./test/files3', 'test', 'en-US', data);

            const newParsedDataCache = new ParsedDataCache(loader);
            expect(newParsedDataCache.hasParsedData('./test/files3', 'test', 'en-US')).toBe(true);
            expect(newParsedDataCache.getCachedData('./test/files3', 'test', 'en-US')).toBe(data);
        });
    });

    describe('storeData', () => {
        test('should parse and store function-based data correctly', () => {
            expect.assertions(2);

            const functionData = function() {
                return {
                    root: {
                        "memory.js": { a: 'b', c: 'd' }
                    },
                    en: {
                        "memory.js": { a: 'b en', c: 'd en' }
                    }
                };
            };

            parsedDataCache.storeData(functionData, './test/files3');

            // The storeData method stores data with basename "memory.js"
            expect(parsedDataCache.hasParsedData('./test/files3', 'memory.js', null)).toBe(true);
            expect(parsedDataCache.getCachedData('./test/files3', 'memory.js', null)).toEqual({ a: 'b', c: 'd' });
        });

        test('should parse and store object-based data with default property correctly', () => {
            expect.assertions(2);

            const objectData = {
                default: {
                    root: {
                        "memory.js": { a: 'b', c: 'd' }
                    },
                    en: {
                        "memory.js": { a: 'b en', c: 'd en' }
                    }
                }
            };

            parsedDataCache.storeData(objectData, './test/files3');

            expect(parsedDataCache.hasParsedData('./test/files3', 'memory.js', null)).toBe(true);
            expect(parsedDataCache.getCachedData('./test/files3', 'memory.js', null)).toEqual({ a: 'b', c: 'd' });
        });

        test('should parse and store object-based data with getLocaleData method correctly', () => {
            expect.assertions(2);

            const objectData = {
                getLocaleData: function() {
                    return {
                        root: {
                            "memory.js": { a: 'b', c: 'd' }
                        },
                        en: {
                            "memory.js": { a: 'b en', c: 'd en' }
                        }
                    };
                }
            };

            parsedDataCache.storeData(objectData, './test/files3');

            expect(parsedDataCache.hasParsedData('./test/files3', 'memory.js', null)).toBe(true);
            expect(parsedDataCache.getCachedData('./test/files3', 'memory.js', null)).toEqual({ a: 'b', c: 'd' });
        });

        test('should parse and store string-based data correctly', () => {
            expect.assertions(2);

            const stringData = JSON.stringify({
                root: {
                    "memory.js": { a: 'b', c: 'd' }
                },
                en: {
                    "memory.js": { a: 'b en', c: 'd en' }
                }
            });

            parsedDataCache.storeData(stringData, './test/files3');

            expect(parsedDataCache.hasParsedData('./test/files3', 'memory.js', null)).toBe(true);
            expect(parsedDataCache.getCachedData('./test/files3', 'memory.js', null)).toEqual({ a: 'b', c: 'd' });
        });

        test('should handle invalid data gracefully', () => {
            expect.assertions(1);
            const initialCount = parsedDataCache.getCachedEntryCount();
            parsedDataCache.storeData(null, './test/files3');
            expect(parsedDataCache.getCachedEntryCount()).toBe(initialCount);
        });
    });

    describe('Parsing Correctness', () => {
        test('should correctly parse .js file data and store by locale and basename', async () => {
            expect.assertions(7);

            const locale = new Locale('en-US');
            const roots = ['./test/files3'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            // en-US data should be cached as null since it doesn't exist in the file
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(false);
            expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);
            // ParsedDataCache should return undefined for en-US since it doesn't exist in the file
            // The file only has root and en data, not en-US data
            expect(result).toBeUndefined();

            // Check that root data is stored
            const rootInfo = parsedDataCache.getCachedData('./test/files3', 'info', null);
            const rootFoo = parsedDataCache.getCachedData('./test/files3', 'foo', null);
            expect(rootInfo).toEqual({"a": "b", "c": "d"});
            expect(rootFoo).toEqual({"m": "n", "o": "p"});

            // Check that en data is stored
            const enInfo = parsedDataCache.getCachedData('./test/files3', 'info', 'en');
            const enFoo = parsedDataCache.getCachedData('./test/files3', 'foo', 'en');
            expect(enInfo).toEqual({"a": "b en", "c": "d en"});
            expect(enFoo).toEqual({"m": "n en", "o": "p en"});
        });

        test('should correctly parse .json file data and store by locale and basename', async () => {
            expect.assertions(5);

            const locale = new Locale('en-US');
            const roots = ['./test/files4'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(result).toBeTruthy();
            // en data should be cached as null since it doesn't exist in the file
            expect(parsedDataCache.hasParsedData('./test/files4', 'info', 'en-US')).toBe(true);
            expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);
            // ParsedDataCache should return undefined for en since it doesn't exist in the file
            expect(parsedDataCache.hasParsedData('./test/files4', 'info', 'en')).toBe(false);

            // Check that root data is not stored (this file exists but it is not loaded yet)
            const rootData = parsedDataCache.getCachedData('./test/files4', 'info', null);
            expect(rootData).toBeUndefined(); // Root data won't be loaded unless specifically requested
        });

        test('should correctly parse multi-locale .json file data', async () => {
            expect.assertions(4);

            const locale = new Locale('multi');
            const roots = ['./test/files4'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            // ParsedDataCache should return undefined for multi since it doesn't exist in the file
            expect(result).toBeUndefined();
            // multi data should be cached as null since it doesn't exist in the file
            expect(parsedDataCache.hasParsedData('./test/files4', 'info', 'multi')).toBe(false);
            expect(parsedDataCache.getCachedEntryCount()).toBe(0);

            const rootData = parsedDataCache.getCachedData('./test/files4', 'info', null);
            expect(rootData).toBeUndefined(); // Root data won't be loaded unless specifically requested
        });

        test('should correctly parse .js files with only root data', async () => {
            expect.assertions(4);

            const locale = new Locale('en-US');
            const roots = ['./test/files3'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(false);
            expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);
            // ParsedDataCache should return undefined for en-US since it doesn't exist in the file
            // The file only has root and en data, not en-US data
            expect(result).toBeUndefined();

            // Check that root data is stored
            const rootInfo = parsedDataCache.getCachedData('./test/files3', 'info', null);
            expect(rootInfo).toEqual({"a": "b", "c": "d"});
        });

        test('should handle .js files with no data correctly', async () => {
            expect.assertions(2);

            const locale = new Locale('en-US');
            const roots = ['./test/files5'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(result).toBeUndefined();
            expect(parsedDataCache.getCachedEntryCount()).toBe(0);
        });

        test('should handle invalid .js file content correctly', async () => {
            expect.assertions(2);

            const locale = new Locale('en-US');
            const roots = ['./test/files5'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(result).toBeUndefined();
            expect(parsedDataCache.getCachedEntryCount()).toBe(0);
        });

        test('should handle invalid JSON content correctly', async () => {
            expect.assertions(2);

            const locale = new Locale('en-US');
            const roots = ['./test/files5'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(result).toBeUndefined();
            expect(parsedDataCache.getCachedEntryCount()).toBe(0);
        });
    });

    describe('Cache Behavior', () => {
        test('should return cached data without reparsing when calling getParsedData twice', async () => {
            expect.assertions(4);

            const locale = new Locale('en-US');
            const roots = ['./test/files3'];
            const basename = 'info';

            const result1 = await parsedDataCache.getParsedData(locale, roots, basename);
            const result2 = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(false);
            // Both calls should return undefined since en-US doesn't exist in the file
            expect(result1).toBeUndefined();
            expect(result2).toBeUndefined();
            expect(parsedDataCache.getCachedEntryCount()).toBe(4);
        });

        test('should cache data by locale and basename correctly', async () => {
            expect.assertions(3);

            const locale = new Locale('en-US');
            const roots = ['./test/files3'];
            const basename = 'info';

            await parsedDataCache.getParsedData(locale, roots, basename);

            // Check that all basenames are stored for root
            const rootInfo = parsedDataCache.getCachedData('./test/files3', 'info', null);
            expect(rootInfo).toEqual({"a": "b", "c": "d"});

            // Check that all basenames are stored for en
            const enInfo = parsedDataCache.getCachedData('./test/files3', 'info', 'en');
            expect(enInfo).toEqual({"a": "b en", "c": "d en"});

            // Check that en-US is cached as null (indicating attempted load)
            const enUSInfo = parsedDataCache.getCachedData('./test/files3', 'info', 'en-US');
            expect(enUSInfo).toBeUndefined();
        });

        test('should not call file cache when data is already parsed', async () => {
            expect.assertions(1);

            const locale = new Locale('en-US');
            const roots = ['./test/files3'];
            const basename = 'info';

            // First call should load from file
            await parsedDataCache.getParsedData(locale, roots, basename);
            const initialCount = parsedDataCache.getCachedEntryCount();

            // Second call should use cache
            await parsedDataCache.getParsedData(locale, roots, basename);
            expect(parsedDataCache.getCachedEntryCount()).toBe(initialCount);
        });

        test('should handle mixed cache hits and misses correctly', async () => {
            expect.assertions(4);

            const locale1 = new Locale('en-US');
            const locale2 = new Locale('fr-FR');
            const roots = ['./test/files3'];
            const basename = 'info';

            // Load data for en-US
            const result1 = await parsedDataCache.getParsedData(locale1, roots, basename);
            // ParsedDataCache should return undefined for en-US since it doesn't exist in the file
            expect(result1).toBeUndefined();

            // Try to load data for fr-FR (should return undefined since it doesn't exist)
            const result2 = await parsedDataCache.getParsedData(locale2, roots, basename);
            expect(result2).toBeUndefined();

            // Check that both en-US and fr-FR data are cached (as null)
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(false);
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'fr-FR')).toBe(false);
        });

        test('should reconstruct parsed data structure correctly from cache', async () => {
            expect.assertions(2);

            const locale = new Locale('en-US');
            const roots = ['./test/files3'];
            const basename = 'info';

            await parsedDataCache.getParsedData(locale, roots, basename);

            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(false);
            expect(parsedDataCache.getCachedEntryCount()).toBeGreaterThan(0);
        });
    });

    describe('Parameter Validation', () => {
        test('should handle invalid parameters in getParsedData', async () => {
            expect.assertions(6);

            // Test with null locale
            const nullLocaleResult = await parsedDataCache.getParsedData(null, ['./test/files3'], 'info');
            expect(nullLocaleResult).toBeDefined();

            // Test with undefined locale
            const undefinedLocaleResult = await parsedDataCache.getParsedData(undefined, ['./test/files3'], 'info');
            expect(undefinedLocaleResult).toBeUndefined();

            // Test with null roots
            const nullRootsResult = await parsedDataCache.getParsedData(new Locale('en-US'), null, 'info');
            expect(nullRootsResult).toBeUndefined();

            // Test with empty roots array
            const emptyRootsResult = await parsedDataCache.getParsedData(new Locale('en-US'), [], 'info');
            expect(emptyRootsResult).toBeUndefined();

            // Test with null basename
            const nullBasenameResult = await parsedDataCache.getParsedData(new Locale('en-US'), ['./test/files3'], null);
            expect(nullBasenameResult).toBeUndefined();

            // Test with undefined basename
            const undefinedBasenameResult = await parsedDataCache.getParsedData(new Locale('en-US'), ['./test/files3'], undefined);
            expect(undefinedBasenameResult).toBeUndefined();
        });

        test('should handle invalid parameters in getParsedDataSync', () => {
            expect.assertions(6);

            // Test with null locale
            const nullLocaleResult = parsedDataCache.getParsedDataSync(null, ['./test/files3'], 'info');
            expect(nullLocaleResult).toBeDefined();

            // Test with undefined locale
            const undefinedLocaleResult = parsedDataCache.getParsedDataSync(undefined, ['./test/files3'], 'info');
            expect(undefinedLocaleResult).toBeUndefined();

            // Test with null roots
            const nullRootsResult = parsedDataCache.getParsedDataSync(new Locale('en-US'), null, 'info');
            expect(nullRootsResult).toBeUndefined();

            // Test with empty roots array
            const emptyRootsResult = parsedDataCache.getParsedDataSync(new Locale('en-US'), [], 'info');
            expect(emptyRootsResult).toBeUndefined();

            // Test with null basename
            const nullBasenameResult = parsedDataCache.getParsedDataSync(new Locale('en-US'), ['./test/files3'], null);
            expect(nullBasenameResult).toBeUndefined();

            // Test with undefined basename
            const undefinedBasenameResult = parsedDataCache.getParsedDataSync(new Locale('en-US'), ['./test/files3'], undefined);
            expect(undefinedBasenameResult).toBeUndefined();
        });

        test('should handle invalid parameters in hasParsedData', () => {
            expect.assertions(6);

            // Test with null root
            expect(parsedDataCache.hasParsedData(null, 'info', 'en-US')).toBe(false);

            // Test with undefined root
            expect(parsedDataCache.hasParsedData(undefined, 'info', 'en-US')).toBe(false);

            // Test with null basename
            expect(parsedDataCache.hasParsedData('./test/files3', null, 'en-US')).toBe(false);

            // Test with undefined basename
            expect(parsedDataCache.hasParsedData('./test/files3', undefined, 'en-US')).toBe(false);

            // Test with empty string root
            expect(parsedDataCache.hasParsedData('', 'info', 'en-US')).toBe(false);

            // Test with empty string basename
            expect(parsedDataCache.hasParsedData('./test/files3', '', 'en-US')).toBe(false);
        });

        test('should handle invalid parameters in getCachedData', () => {
            expect.assertions(6);

            // Test with null root
            const nullRootResult = parsedDataCache.getCachedData(null, 'info', 'en-US');
            expect(nullRootResult).toBeUndefined();

            // Test with undefined root
            const undefinedRootResult = parsedDataCache.getCachedData(undefined, 'info', 'en-US');
            expect(undefinedRootResult).toBeUndefined();

            // Test with null basename
            const nullBasenameResult = parsedDataCache.getCachedData('./test/files3', null, 'en-US');
            expect(nullBasenameResult).toBeUndefined();

            // Test with undefined basename
            const undefinedBasenameResult = parsedDataCache.getCachedData('./test/files3', undefined, 'en-US');
            expect(undefinedBasenameResult).toBeUndefined();

            // Test with empty string root
            const emptyRootResult = parsedDataCache.getCachedData('', 'info', 'en-US');
            expect(emptyRootResult).toBeUndefined();

            // Test with empty string basename
            const emptyBasenameResult = parsedDataCache.getCachedData('./test/files3', '', 'en-US');
            expect(emptyBasenameResult).toBeUndefined();
        });
    });

    describe('Edge Cases and Error Handling', () => {
        test('should handle invalid JSON data gracefully (line 219)', async () => {
            expect.assertions(1);

            const locale = new Locale('fr-FR'); // Use different locale than en-US
            const roots = ['./test/files3'];
            const basename = 'invalid';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);
            
            // Should return undefined when JSON parsing fails (line 219)
            expect(result).toBeUndefined();
        });

        test('should return correct extensions for ESM modules (line 298)', () => {
            expect.assertions(1);

            const extensions = parsedDataCache._getJsFileExtensions('./test/files3/esm-test');
            
            // Should return ['.cjs', '.js'] for ESM modules (line 298)
            expect(extensions).toEqual(['.cjs', '.js']);
        });

        test('should handle invalid parameters in storeParsedData (lines 583, 587)', () => {
            expect.assertions(4);

            // Test with null root (line 583)
            parsedDataCache.storeParsedData(null, 'info', 'en-US', { test: 'data' });
            expect(parsedDataCache.hasParsedData(null, 'info', 'en-US')).toBe(false);

            // Test with undefined basename (line 583)
            parsedDataCache.storeParsedData('./test/files3', undefined, 'en-US', { test: 'data' });
            expect(parsedDataCache.hasParsedData('./test/files3', undefined, 'en-US')).toBe(false);

            // Test with null locale (line 587)
            parsedDataCache.storeParsedData('./test/files3', 'info', null, { test: 'root data' });
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', null)).toBe(true);

            // Test with empty string root (line 583)
            parsedDataCache.storeParsedData('', 'info', 'en-US', { test: 'data' });
            expect(parsedDataCache.hasParsedData('', 'info', 'en-US')).toBe(false);
        });

        test('should handle invalid parameters in removeParsedData (lines 601, 605)', () => {
            expect.assertions(4);

            // First store some data to remove
            parsedDataCache.storeParsedData('./test/files3', 'info', 'en-US', { test: 'data' });
            parsedDataCache.storeParsedData('./test/files3', 'info', null, { test: 'root data' });

            // Test with null root (line 601)
            parsedDataCache.removeParsedData(null, 'info', 'en-US');
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(true); // Should still exist

            // Test with undefined basename (line 601)
            parsedDataCache.removeParsedData('./test/files3', undefined, 'en-US');
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(true); // Should still exist

            // Test with null locale (line 605) - should remove root data
            parsedDataCache.removeParsedData('./test/files3', 'info', null);
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', null)).toBe(false);

            // Test with empty string root (line 601)
            parsedDataCache.removeParsedData('', 'info', 'en-US');
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(true); // Should still exist
        });
    });

    describe('Multi-root data loading', () => {
        test('should load data from all roots for a given locale', async () => {
            expect.assertions(5);

            // Load data for de-DE from multiple roots
            const result = await parsedDataCache.getParsedData('de-DE', ['./test/files3', './test/files4'], 'foo');

            expect(result).toBeDefined();
            
            // Verify data was loaded from files3
            expect(parsedDataCache.hasParsedData('./test/files3', 'foo', 'de-DE')).toBe(true);
            const files3Data = parsedDataCache.getCachedData('./test/files3', 'foo', 'de-DE');
            expect(files3Data).toEqual({
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

        test('should load data from all roots even when some roots have no data', async () => {
            expect.assertions(5);

            // Load data for en-US from multiple roots (files3 has data, files5 doesn't)
            const result = await parsedDataCache.getParsedData('en-US', ['./test/files3', './test/files5'], 'info');

            expect(result).toBeUndefined(); // should be undefined since en-US doesn't exist in the files5 root
            
            // Verify data was loaded from files3
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(false);
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en')).toBe(true);
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', null)).toBe(true);
            
            // Verify files5 was checked but has no data
            expect(parsedDataCache.hasParsedData('./test/files5', 'info', 'en-US')).toBe(false);
        });

        test('should load root data from all roots', async () => {
            expect.assertions(5);
debugger;
            // Load root data from multiple roots
            const result = await parsedDataCache.getParsedData(null, ['./test/files3', './test/files4'], 'info');

            expect(result).toBeDefined();
            
            // Verify root data was loaded from files3
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', null)).toBe(true);
            const files3RootData = parsedDataCache.getCachedData('./test/files3', 'info', null);
            expect(files3RootData).toEqual({
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

        test('should cache null for missing data in all roots', async () => {
            expect.assertions(3);

            // Try to load non-existent data from multiple roots
            const result = await parsedDataCache.getParsedData('non-existent', ['./test/files3', './test/files4'], 'non-existent');

            expect(result).toBeUndefined();
            
            expect(parsedDataCache.hasParsedData('./test/files3', 'non-existent', 'non-existent')).toBe(false);
            expect(parsedDataCache.hasParsedData('./test/files4', 'non-existent', 'non-existent')).toBe(false);
        });

        test('should load different data formats from different roots', async () => {
            expect.assertions(7);

            // Load data from roots with different file formats (.js and .json)
            const result = await parsedDataCache.getParsedData('en-US', ['./test/files3', './test/files4'], 'info');

            expect(result).toBeDefined();
            
            // Verify .js file data from files3
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(false);
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en')).toBe(true);
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', null)).toBe(true);
            const jsData = parsedDataCache.getCachedData('./test/files3', 'info', 'en');
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

        test('should maintain separate cache entries for each root', async () => {
            expect.assertions(5);

            // Load same locale/basename from different roots
            await parsedDataCache.getParsedData('en-US', ['./test/files3'], 'info');
            await parsedDataCache.getParsedData('en-US', ['./test/files4'], 'info');

            // Verify separate cache entries exist
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en')).toBe(true);
            expect(parsedDataCache.hasParsedData('./test/files4', 'info', 'en-US')).toBe(true);

            // Verify they contain different data
            const files3Data = parsedDataCache.getCachedData('./test/files3', 'info', 'en');
            const files4Data = parsedDataCache.getCachedData('./test/files4', 'info', 'en-US');
            
            expect(files3Data).not.toEqual(files4Data);
            expect(files3Data).toEqual({
                "a": "b en",
                "c": "d en"
            });

            expect(files4Data).toEqual({
                "a": "b",
                "c": "d"
            });
        });
    });
});
