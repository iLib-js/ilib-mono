/*
 * FileCache.async.test.js - async unit tests for the FileCache class (Node and Browser)
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

import FileCache from '../src/FileCache.js';
import LoaderFactory from 'ilib-loader';
import DataCache from '../src/DataCache.js';

describe('FileCache Async Tests (Node and Browser)', () => {
    let loader;
    let fileCache;
    let dataCache;

    beforeEach(() => {
        // Clear any existing data cache
        DataCache.clearDataCache();
        loader = LoaderFactory();
        fileCache = new FileCache(loader);
        dataCache = DataCache.getDataCache();
    });

    afterEach(() => {
        // Clean up after each test
        DataCache.clearDataCache();
    });

    describe('loadFile (async behavior)', () => {
        test('should load file data correctly and return the same result on subsequent calls', async () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);

            const filePath = 'test/files/fr/localeinfo.json';
            const result1 = await fileCache.loadFile(filePath);
            const result2 = await fileCache.loadFile(filePath);

            expect(typeof result1).toBe('string');
            expect(result1).toBe(result2);
            expect(fileCache.size()).toBe(1); // Promise remains in cache as marker
        });

        test('should load data from multiple different files', async () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);

            const filePath1 = 'test/files/file1.json';
            const filePath2 = 'test/files/file2.json';

            const result1 = await fileCache.loadFile(filePath1);
            const result2 = await fileCache.loadFile(filePath2);

            expect(typeof result1).toBe('string');
            expect(typeof result2).toBe('string');
            expect(result1).not.toBe(result2);
        });

        test('should load data from the same file multiple times', async () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);

            const filePath = 'test/files/fr/localeinfo.json';
            const result1 = await fileCache.loadFile(filePath);
            const result2 = await fileCache.loadFile(filePath);

            expect(typeof result1).toBe('string');
            expect(result1).toBe(result2);
            expect(fileCache.size()).toBe(1);
        });

        test('should load data from the same file multiple times even after the promise has been resolved', async () => {
            expect.assertions(5);

            expect(fileCache.size()).toBe(0);

            const filePath = 'test/files/fr/localeinfo.json';
            const result1 = await fileCache.loadFile(filePath);
            expect(typeof result1).toBe('string');
            expect(fileCache.size()).toBe(1);

            // Load again after the first promise has resolved
            const result2 = await fileCache.loadFile(filePath);
            expect(result2).toBe(result1);
            expect(fileCache.size()).toBe(1);
        });

        test('should handle multiple concurrent requests for the same file', async () => {
            expect.assertions(6);

            expect(fileCache.size()).toBe(0);

            const filePath = 'test/files/fr/localeinfo.json';

            // Start multiple concurrent requests
            const promise1 = fileCache.loadFile(filePath);
            const promise2 = fileCache.loadFile(filePath);
            const promise3 = fileCache.loadFile(filePath);

            // All should return the same promise
            expect(promise1).toBe(promise2);
            expect(promise2).toBe(promise3);
            expect(fileCache.size()).toBe(1);

            // All should resolve to the same result
            const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3]);
            expect(result1).toBe(result2);
            expect(result2).toBe(result3);
        });

        test('should handle rapid successive calls correctly', async () => {
            expect.assertions(4);

            const filePath = 'test/files/fr/localeinfo.json';
            const promises = [];

            // Make 10 rapid successive calls
            for (let i = 0; i < 10; i++) {
                promises.push(fileCache.loadFile(filePath));
            }

            expect(fileCache.size()).toBe(1); // Should only have one cached promise

            const results = await Promise.all(promises);
            
            // All results should be the same
            const firstResult = results[0];
            expect(typeof firstResult).toBe('string');
            
            // Check that all results are identical
            expect(results.every(result => result === firstResult)).toBe(true);
            
            expect(fileCache.size()).toBe(1); // Promise should remain in cache
        });

        test('should handle file loading errors gracefully', async () => {
            expect.assertions(2);

            const filePath = 'nonexistent/file.json';
            const result = await fileCache.loadFile(filePath);

            expect(result).toBeUndefined();
            expect(fileCache.attemptCount()).toBe(1);
        });

        test('should handle propagate errors from the loader', async () => {
            expect.assertions(2);

            // Use a path that will cause the loader to fail
            const filePath = 'test/files/nonexistent.json';
            const result = await fileCache.loadFile(filePath);

            expect(result).toBeUndefined();
            expect(fileCache.attemptCount()).toBe(1);
        });
    });

    describe('removeFileFromCache (async)', () => {
        test('should allow reloading a file after removal', async () => {
            expect.assertions(5);

            const filePath = 'test/files/fr/localeinfo.json';
            
            // Load file first time
            const result1 = await fileCache.loadFile(filePath);
            expect(typeof result1).toBe('string');
            expect(fileCache.size()).toBe(1);

            // Remove from cache
            fileCache.removeFileFromCache(filePath);
            expect(fileCache.size()).toBe(0);

            // Load file again - should work
            const result2 = await fileCache.loadFile(filePath);
            expect(result2).toBe(result1);
            expect(fileCache.size()).toBe(1);
        });
    });

    describe('clearCache (async)', () => {
        test('should allow reloading files after clearing cache', async () => {
            expect.assertions(6);

            const filePath1 = 'test/files/fr/localeinfo.json';
            const filePath2 = 'test/files/FR/localeinfo.json';

            // Load files
            const result1 = await fileCache.loadFile(filePath1);
            const result2 = await fileCache.loadFile(filePath2);
            expect(typeof result1).toBe('string');
            expect(typeof result2).toBe('string');
            expect(fileCache.size()).toBe(2);

            // Clear cache
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            // Should be able to load again
            const result3 = await fileCache.loadFile(filePath1);
            expect(result3).toBe(result1);
            expect(fileCache.size()).toBe(1);
        });
    });

    describe('race condition prevention', () => {
        test('should prevent race conditions when multiple callers request the same file simultaneously', async () => {
            expect.assertions(7);

            const filePath = 'test/files/fr/localeinfo.json';
            
            // Simulate multiple callers requesting the same file at the same time
            const promises = [
                fileCache.loadFile(filePath),
                fileCache.loadFile(filePath),
                fileCache.loadFile(filePath),
                fileCache.loadFile(filePath),
                fileCache.loadFile(filePath)
            ];

            // All promises should be the same instance
            expect(promises[0]).toBe(promises[1]);
            expect(promises[1]).toBe(promises[2]);
            expect(promises[2]).toBe(promises[3]);
            expect(promises[3]).toBe(promises[4]);

            // Only one promise should be cached
            expect(fileCache.size()).toBe(1);

            // All should resolve to the same result
            const results = await Promise.all(promises);
            expect(results.every(result => result === results[0])).toBe(true);
            expect(fileCache.attemptCount()).toBe(1); // Only one actual load attempt
        });

        test('should handle rapid successive calls correctly', async () => {
            expect.assertions(3);

            const filePath = 'test/files/fr/localeinfo.json';
            const numCalls = 100;
            const promises = [];

            // Make many rapid calls
            for (let i = 0; i < numCalls; i++) {
                promises.push(fileCache.loadFile(filePath));
            }

            expect(fileCache.size()).toBe(1); // Should only cache one promise

            const results = await Promise.all(promises);
            
            // All results should be identical
            expect(results.every(result => result === results[0])).toBe(true);
            expect(fileCache.attemptCount()).toBe(1); // Only one actual load attempt
        });
    });

    describe('edge cases (async)', () => {
        test('should handle very long file paths', async () => {
            expect.assertions(2);

            const longPath = 'a'.repeat(1000) + '/file.json';
            const result = await fileCache.loadFile(longPath);

            expect(result).toBeUndefined();
            expect(fileCache.attemptCount()).toBe(1);
        });
    });

    describe('ESM module loading (files3)', () => {
        test('should load ESM modules asynchronously and return module object', async () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);

            const filePath = 'test/files3/en-US.js';
            const result = await fileCache.loadFile(filePath);

            expect(typeof result).toBe('object');
            expect(fileCache.size()).toBe(1);
            expect(result).toHaveProperty('default');
        });

        test('should handle ESM modules with default export function', async () => {
            expect.assertions(4);

            const filePath = 'test/files3/en-US.js';
            const result = await fileCache.loadFile(filePath);

            expect(typeof result).toBe('object');
            expect(result).toHaveProperty('default');
            expect(typeof result.default).toBe('function');
            
            // Call the function to get the actual data
            const data = result.default();
            expect(data).toHaveProperty('en');
        });

        test('should cache ESM module results correctly', async () => {
            expect.assertions(4);

            const filePath = 'test/files3/en-US.js';
            
            // First call - should load from file
            const result1 = await fileCache.loadFile(filePath);
            expect(typeof result1).toBe('object');
            expect(fileCache.size()).toBe(1);

            // Second call - should return cached result
            const result2 = await fileCache.loadFile(filePath);
            expect(result2).toBe(result1);
            expect(fileCache.size()).toBe(1); // Should not increase
        });

        test('should handle ESM modules with different locales', async () => {
            expect.assertions(4);

            const enUSPath = 'test/files3/en-US.js';
            const enGBPath = 'test/files3/en-GB.js';

            const enUSResult = await fileCache.loadFile(enUSPath);
            const enGBResult = await fileCache.loadFile(enGBPath);

            expect(typeof enUSResult).toBe('object');
            expect(typeof enGBResult).toBe('object');
            expect(fileCache.size()).toBe(2);
            expect(enUSResult).not.toBe(enGBResult);
        });
    });

    describe('CommonJS file loading (files7)', () => {
        test('should load CommonJS files asynchronously and return module object', async () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);

            const filePath = 'test/files7/en-US.js';
            const result = await fileCache.loadFile(filePath);

            expect(typeof result).toBe('object');
            expect(fileCache.size()).toBe(1);
            expect(result).toHaveProperty('default');
        });

        test('should handle CommonJS files with default export function', async () => {
            expect.assertions(4);

            const filePath = 'test/files7/en-US.js';
            const result = await fileCache.loadFile(filePath);

            expect(typeof result).toBe('object');
            expect(result).toHaveProperty('default');
            expect(typeof result.default).toBe('function');
            
            // Call the function to get the actual data
            const data = result.default();
            expect(data).toHaveProperty('en');
        });

        test('should cache CommonJS file results correctly', async () => {
            expect.assertions(4);

            const filePath = 'test/files7/en-US.js';
            
            // First call - should load from file
            const result1 = await fileCache.loadFile(filePath);
            expect(typeof result1).toBe('object');
            expect(fileCache.size()).toBe(1);

            // Second call - should return cached result
            const result2 = await fileCache.loadFile(filePath);
            expect(result2).toBe(result1);
            expect(fileCache.size()).toBe(1); // Should not increase
        });

        test('should handle CommonJS files with different locales', async () => {
            expect.assertions(4);

            const enUSPath = 'test/files7/en-US.js';
            const enGBPath = 'test/files7/en-GB.js';

            const enUSResult = await fileCache.loadFile(enUSPath);
            const enGBResult = await fileCache.loadFile(enGBPath);

            expect(typeof enUSResult).toBe('object');
            expect(typeof enGBResult).toBe('object');
            expect(fileCache.size()).toBe(2);
            expect(enUSResult).not.toBe(enGBResult);
        });

        test('should verify CommonJS files have proper module structure', async () => {
            expect.assertions(3);

            const filePath = 'test/files7/en-US.js';
            const result = await fileCache.loadFile(filePath);

            // Verify it's an object with the expected structure
            expect(typeof result).toBe('object');
            expect(result).toHaveProperty('default');
            expect(typeof result.default).toBe('function');
        });
    });
});
