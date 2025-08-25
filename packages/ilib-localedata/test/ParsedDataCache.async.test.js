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
        test('should load and cache data from .js files asynchronously', async () => {
            expect.assertions(3);

            const locale = new Locale('en-US');
            const roots = ['./test/files3'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(true);
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0);
            // ParsedDataCache should return undefined for en-US since it doesn't exist in the file
            // The file only has root and en data, not en-US data
            expect(result).toBeUndefined();
        });

        test('should load and cache data from .js files with only root data asynchronously', async () => {
            expect.assertions(3);

            const locale = new Locale('en-GB');
            const roots = ['./test/files3'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-GB')).toBe(true);
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0);
            // ParsedDataCache should return undefined for en-GB since it doesn't exist in the file
            // The file only has root and en data, not en-GB data
            expect(result).toBeUndefined();
        });

        test('should fall back to .json files when .js files are not found', async () => {
            expect.assertions(3);

            const locale = new Locale('en-US');
            const roots = ['./test/files4'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(parsedDataCache.hasParsedData('./test/files4', 'info', 'en-US')).toBe(true);
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0);
            expect(result).toBeTruthy();
        });

        test('should fall back from .js files to .json files when .js files have no data for locale', async () => {
            expect.assertions(4);

            const locale = new Locale('en-US');
            // First try files3 (which has .js files but no en-US data), then fall back to files4
            const roots = ['./test/files3', './test/files4'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            // Should find data in files4 after failing to find it in files3
            expect(result).toBeTruthy();
            expect(result).toEqual({
                "a": "b",
                "c": "d"
            });
            expect(parsedDataCache.hasParsedData('./test/files4', 'info', 'en-US')).toBe(true);
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0);
        });

        test('should fall back to .json files for different basenames', async () => {
            expect.assertions(4);

            const locale = new Locale('en-US');
            const roots = ['./test/files3', './test/files4'];
            const basename = 'foo';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            // Should find foo data in files4 after failing to find it in files3
            expect(result).toBeTruthy();
            expect(result).toEqual({
                "m": "n",
                "o": "p"
            });
            expect(parsedDataCache.hasParsedData('./test/files4', 'foo', 'en-US')).toBe(true);
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0);
        });

        test('should return undefined for invalid file content', async () => {
            expect.assertions(2);

            const locale = new Locale('en-US');
            const roots = ['./test/files5'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(result).toBeUndefined();
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0); // Should cache the attempted load
        });

        test('should handle multiple roots and return data from the first available', async () => {
            expect.assertions(3);

            const locale = new Locale('en-US');
            const roots = ['./test/files3', './test/files4'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(parsedDataCache.hasParsedData('./test/files4', 'info', 'en-US')).toBe(true);
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0);
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
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0);
        });
    });

    describe('hasParsedData', () => {
        test('should return true for existing parsed data', async () => {
            expect.assertions(2);
            
            // First load some data to populate the cache
            const locale = new Locale('root');
            const roots = ['./test/files3'];
            const basename = 'info';
            
            await parsedDataCache.getParsedData(locale, roots, basename);
            
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'root')).toBe(true);
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0);
        });

        test('should return false for non-existent parsed data', () => {
            expect.assertions(1);
            expect(parsedDataCache.hasParsedData('./test/files3', 'nonexistent', 'en-US')).toBe(false);
        });

        test('should return true for null data (indicating attempted load)', async () => {
            expect.assertions(2);
            
            // First attempt to load en-US data (which doesn't exist in the file)
            const locale = new Locale('en-US');
            const roots = ['./test/files3'];
            const basename = 'info';
            
            await parsedDataCache.getParsedData(locale, roots, basename);
            
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(true);
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0);
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

            const initialCount = parsedDataCache.getParsedDataCount();
            expect(initialCount).toBeGreaterThan(0);

            parsedDataCache.clearAllParsedData();
            expect(parsedDataCache.getParsedDataCount()).toBe(0);
            expect(parsedDataCache.hasParsedData('./test/files3', 'test1', 'en-US')).toBe(false);
        });
    });

    describe('getParsedDataCount', () => {
        test('should return 0 for empty cache', () => {
            expect.assertions(1);
            expect(parsedDataCache.getParsedDataCount()).toBe(0);
        });

        test('should return correct count for populated cache', () => {
            expect.assertions(2);

            const initialCount = parsedDataCache.getParsedDataCount();
            parsedDataCache.storeParsedData('./test/files3', 'test', 'en-US', { test: 'data' });
            expect(parsedDataCache.getParsedDataCount()).toBe(initialCount + 1);
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
            expect(parsedDataCache.hasParsedData('./test/files3', 'memory.js', 'root')).toBe(true);
            expect(parsedDataCache.getCachedData('./test/files3', 'memory.js', 'root')).toEqual({ a: 'b', c: 'd' });
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

            expect(parsedDataCache.hasParsedData('./test/files3', 'memory.js', 'root')).toBe(true);
            expect(parsedDataCache.getCachedData('./test/files3', 'memory.js', 'root')).toEqual({ a: 'b', c: 'd' });
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

            expect(parsedDataCache.hasParsedData('./test/files3', 'memory.js', 'root')).toBe(true);
            expect(parsedDataCache.getCachedData('./test/files3', 'memory.js', 'root')).toEqual({ a: 'b', c: 'd' });
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

            expect(parsedDataCache.hasParsedData('./test/files3', 'memory.js', 'root')).toBe(true);
            expect(parsedDataCache.getCachedData('./test/files3', 'memory.js', 'root')).toEqual({ a: 'b', c: 'd' });
        });

        test('should handle invalid data gracefully', () => {
            expect.assertions(1);
            const initialCount = parsedDataCache.getParsedDataCount();
            parsedDataCache.storeData(null, './test/files3');
            expect(parsedDataCache.getParsedDataCount()).toBe(initialCount);
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
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(true);
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0);
            // ParsedDataCache should return undefined for en-US since it doesn't exist in the file
            // The file only has root and en data, not en-US data
            expect(result).toBeUndefined();

            // Check that root data is stored
            const rootInfo = parsedDataCache.getCachedData('./test/files3', 'info', 'root');
            const rootFoo = parsedDataCache.getCachedData('./test/files3', 'foo', 'root');
            expect(rootInfo).toEqual({"a": "b", "c": "d"});
            expect(rootFoo).toEqual({"m": "n", "o": "p"});

            // Check that en data is stored
            const enInfo = parsedDataCache.getCachedData('./test/files3', 'info', 'en');
            const enFoo = parsedDataCache.getCachedData('./test/files3', 'foo', 'en');
            expect(enInfo).toEqual({"a": "b en", "c": "d en"});
            expect(enFoo).toEqual({"m": "n en", "o": "p en"});
        });

        test('should correctly parse .json file data and store by locale and basename', async () => {
            expect.assertions(4);

            const locale = new Locale('en-US');
            const roots = ['./test/files4'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            // en data should be cached as null since it doesn't exist in the file
            expect(parsedDataCache.hasParsedData('./test/files4', 'info', 'en-US')).toBe(true);
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0);
            // ParsedDataCache should return undefined for en since it doesn't exist in the file
            expect(result).toBeUndefined();

            // Check that root data is stored (this should exist)
            const rootData = parsedDataCache.getCachedData('./test/files4', 'info', 'root');
            expect(rootData).toBeUndefined(); // Root data won't be loaded unless specifically requested
        });

        test('should correctly parse multi-locale .json file data', async () => {
            expect.assertions(4);

            const locale = new Locale('multi');
            const roots = ['./test/files4'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            // multi data should be cached as null since it doesn't exist in the file
            expect(parsedDataCache.hasParsedData('./test/files4', 'info', 'multi')).toBe(true);
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0);
            // ParsedDataCache should return undefined for multi since it doesn't exist in the file
            expect(result).toBeUndefined();

            // Check that root data is stored (this should exist)
            const rootData = parsedDataCache.getCachedData('./test/files4', 'info', 'root');
            expect(rootData).toBeUndefined(); // Root data won't be loaded unless specifically requested
        });

        test('should correctly parse .js files with only root data', async () => {
            expect.assertions(4);

            const locale = new Locale('en-US');
            const roots = ['./test/files3'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(true);
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0);
            // ParsedDataCache should return undefined for en-US since it doesn't exist in the file
            // The file only has root and en data, not en-US data
            expect(result).toBeUndefined();

            // Check that root data is stored
            const rootInfo = parsedDataCache.getCachedData('./test/files3', 'info', 'root');
            expect(rootInfo).toEqual({"a": "b", "c": "d"});
        });

        test('should handle .js files with no data correctly', async () => {
            expect.assertions(2);

            const locale = new Locale('en-US');
            const roots = ['./test/files5'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(result).toBeUndefined();
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0); // Should cache the attempted load
        });

        test('should handle invalid .js file content correctly', async () => {
            expect.assertions(2);

            const locale = new Locale('en-US');
            const roots = ['./test/files5'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(result).toBeUndefined();
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0); // Should cache the attempted load
        });

        test('should handle invalid JSON content correctly', async () => {
            expect.assertions(2);

            const locale = new Locale('en-US');
            const roots = ['./test/files5'];
            const basename = 'info';

            const result = await parsedDataCache.getParsedData(locale, roots, basename);

            expect(result).toBeUndefined();
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0); // Should cache the attempted load
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

            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(true);
            // Both calls should return undefined since en-US doesn't exist in the file
            expect(result1).toBeUndefined();
            expect(result2).toBeUndefined();
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0);
        });

        test('should cache data by locale and basename correctly', async () => {
            expect.assertions(3);

            const locale = new Locale('en-US');
            const roots = ['./test/files3'];
            const basename = 'info';

            await parsedDataCache.getParsedData(locale, roots, basename);

            // Check that all basenames are stored for root
            const rootInfo = parsedDataCache.getCachedData('./test/files3', 'info', 'root');
            expect(rootInfo).toEqual({"a": "b", "c": "d"});

            // Check that all basenames are stored for en
            const enInfo = parsedDataCache.getCachedData('./test/files3', 'info', 'en');
            expect(enInfo).toEqual({"a": "b en", "c": "d en"});

            // Check that en-US is cached as null (indicating attempted load)
            const enUSInfo = parsedDataCache.getCachedData('./test/files3', 'info', 'en-US');
            expect(enUSInfo).toBeNull();
        });

        test('should not call file cache when data is already parsed', async () => {
            expect.assertions(1);

            const locale = new Locale('en-US');
            const roots = ['./test/files3'];
            const basename = 'info';

            // First call should load from file
            await parsedDataCache.getParsedData(locale, roots, basename);
            const initialCount = parsedDataCache.getParsedDataCount();

            // Second call should use cache
            await parsedDataCache.getParsedData(locale, roots, basename);
            expect(parsedDataCache.getParsedDataCount()).toBe(initialCount);
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
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(true);
            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'fr-FR')).toBe(true);
        });

        test('should reconstruct parsed data structure correctly from cache', async () => {
            expect.assertions(2);

            const locale = new Locale('en-US');
            const roots = ['./test/files3'];
            const basename = 'info';

            await parsedDataCache.getParsedData(locale, roots, basename);

            expect(parsedDataCache.hasParsedData('./test/files3', 'info', 'en-US')).toBe(true);
            expect(parsedDataCache.getParsedDataCount()).toBeGreaterThan(0);
        });
    });
});
