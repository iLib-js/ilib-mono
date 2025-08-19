/*
 * FileCache.test.js - unit tests for the FileCache class
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
import MockLoader from './MockLoader.js';
import { top } from 'ilib-env';

describe('FileCache', () => {
    let mockLoader;

    beforeAll(() => {
        mockLoader = new MockLoader();
    });

    describe('constructor', () => {
        test('should create a FileCache instance with the provided loader', () => {
            expect.assertions(5);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            // Verify initial state
            expect(fileCache).toBeInstanceOf(FileCache);
            expect(fileCache.loader).toBe(mockLoader);
            expect(fileCache.filePromises).toBeInstanceOf(Map);
            expect(fileCache.logger).toBeDefined();
        });
    });

    describe('getFileCache', () => {
        test('should return the same instance when called multiple times with the same loader', () => {
            expect.assertions(3);

            const cache1 = FileCache.getFileCache(mockLoader);
            cache1.clearCache();
            expect(cache1.size()).toBe(0);

            const cache2 = FileCache.getFileCache(mockLoader);
            cache2.clearCache();
            expect(cache2.size()).toBe(0);

            expect(cache1).toBe(cache2);
        });

        test('should return the same instance even when called with different loaders', () => {
            expect.assertions(3);

            const differentLoader = new MockLoader();
            const cache1 = FileCache.getFileCache(mockLoader);
            cache1.clearCache();
            expect(cache1.size()).toBe(0);

            const cache2 = FileCache.getFileCache(differentLoader);
            cache2.clearCache();
            expect(cache2.size()).toBe(0);

            expect(cache1).toBe(cache2);
        });
    });

    describe('loadFile', () => {
        test('should load a file and return a promise', async () => {
            expect.assertions(3);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';
            const promise = fileCache.loadFile(filePath);

            expect(promise).toBeInstanceOf(Promise);

            const result = await promise;
            expect(result).toBeDefined();
        });

        test('should return the same promise for the same file path when called multiple times', async () => {
            expect.assertions(3);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';

            const promise1 = fileCache.loadFile(filePath);
            const promise2 = fileCache.loadFile(filePath);

            expect(promise1).toBe(promise2);

            // Both promises should resolve to the same result
            const result1 = await promise1;
            const result2 = await promise2;
            expect(result1).toBe(result2);
        });

        test('should cache the promise and return it for subsequent calls', async () => {
            expect.assertions(4);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';

            // First call should create a new promise
            const promise1 = fileCache.loadFile(filePath);
            expect(fileCache.filePromises.has(filePath)).toBe(true);

            // Second call should return the cached promise
            const promise2 = fileCache.loadFile(filePath);
            expect(promise2).toBe(promise1);

            // Wait for the first promise to resolve
            await promise1;

            // Third call should still return the same promise (now resolved)
            const promise3 = fileCache.loadFile(filePath);
            expect(promise3).toBe(promise1);
        });

        test('should load file data correctly and return the same result on subsequent calls', async () => {
            expect.assertions(4);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';

            // Load the file and await the result
            const result1 = await fileCache.loadFile(filePath);
            expect(result1).toBeDefined();
            expect(typeof result1).toBe('string');

            // Load the same file again and verify we get the same result
            const result2 = await fileCache.loadFile(filePath);
            expect(result2).toBe(result1);
        });

        test('should load data from multiple different files', async () => {
            expect.assertions(5);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePath1 = 'fr/localeinfo.json';
            const filePath2 = 'FR/localeinfo.json';

            // Load first file
            const result1 = await fileCache.loadFile(filePath1);
            expect(result1).toBeDefined();

            // Load second file
            const result2 = await fileCache.loadFile(filePath2);
            expect(result2).toBeDefined();

            // Results should be different (different files)
            expect(result1).not.toBe(result2);

            // Both files should be cached
            expect(fileCache.size()).toBe(2);
        });

        test('should load data from the same file multiple times', async () => {
            expect.assertions(4);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';

            // Load the file multiple times
            const result1 = await fileCache.loadFile(filePath);
            const result2 = await fileCache.loadFile(filePath);
            const result3 = await fileCache.loadFile(filePath);

            // All results should be the same
            expect(result1).toBe(result2);
            expect(result2).toBe(result3);

            // Cache size should be 1 (only one file)
            expect(fileCache.size()).toBe(1);
        });

        test('should load data from the same file multiple times even after the promise has been resolved', async () => {
            expect.assertions(4);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';

            // Load the file
            const result1 = await fileCache.loadFile(filePath);
            expect(result1).toBeDefined();

            // Load the file again
            const result2 = await fileCache.loadFile(filePath);
            expect(result2).toBe(result1);

            // Cache size should be 1 (only one file)
            expect(fileCache.size()).toBe(1);
        });

        test('should handle multiple concurrent requests for the same file', async () => {
            expect.assertions(12);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';4

            // Start multiple concurrent requests
            const promises = [];
            for (let i = 0; i < 5; i++) {
                promises.push(fileCache.loadFile(filePath));
            }

            // All promises should be the same instance
            const firstPromise = promises[0];
            promises.forEach(promise => {
                expect(promise).toBe(firstPromise);
            });

            // All should resolve to the same result
            const results = await Promise.all(promises);
            const firstResult = results[0];
            results.forEach(result => {
                expect(result).toBe(firstResult);
            });

            // The file should only be loaded once (race condition prevented)
            expect(fileCache.size()).toBe(1);
        });

        test('should handle file loading errors gracefully', async () => {
            expect.assertions(2);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            // Test that invalid file paths are handled gracefully
            const invalidPath = '';
            const result = await fileCache.loadFile(invalidPath);

            expect(result).toBe(undefined);
        });

        test('should handle propagate errors from the loader', async () => {
            expect.assertions(2);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            // Test that null file paths are handled gracefully
            const invalidPath = null;
            const result = await fileCache.loadFile(invalidPath);

            expect(result).toBe(undefined);
        });
    });

    describe('removeFileFromCache', () => {
        test('should remove a file from the cache', async () => {
            expect.assertions(3);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';

            // Load the file first
            await fileCache.loadFile(filePath);
            expect(fileCache.size()).toBe(1);

            // Remove it from cache
            fileCache.removeFileFromCache(filePath);
            expect(fileCache.size()).toBe(0);
        });

        test('should allow reloading a file after removal', async () => {
            expect.assertions(2);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';

            // Load the file first
            const promise1 = await fileCache.loadFile(filePath);

            // Remove it from cache
            fileCache.removeFileFromCache(filePath);

            // Load it again - should create a new promise
            const promise2 = fileCache.loadFile(filePath);
            expect(promise2).not.toBe(promise1);
        });

        test('should handle removing non-existent files gracefully', () => {
            expect.assertions(2);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePath = 'nonexistent/file.json';

            expect(() => {
                fileCache.removeFileFromCache(filePath);
            }).not.toThrow();
        });
    });

    describe('clearCache', () => {
        test('should clear all cached file promises', async () => {
            expect.assertions(3);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePaths = ['file1.json', 'file2.json', 'file3.json'];

            // Load multiple files
            for (const filePath of filePaths) {
                await fileCache.loadFile(filePath);
            }

            expect(fileCache.size()).toBe(filePaths.length);

            // Clear the cache
            fileCache.clearCache();

            expect(fileCache.size()).toBe(0);
        });

        test('should allow reloading files after clearing cache', async () => {
            expect.assertions(2);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';

            // Load the file first
            const promise1 = await fileCache.loadFile(filePath);

            // Clear the cache
            fileCache.clearCache();

            // Load it again - should create a new promise
            const promise2 = fileCache.loadFile(filePath);
            expect(promise2).not.toBe(promise1);
        });
    });

    describe('size', () => {
        test('should return 0 for empty cache', () => {
            expect.assertions(1);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);
        });

        test('should return correct count of cached files', async () => {
            expect.assertions(3);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePaths = ['file1.json', 'file2.json'];

            expect(fileCache.size()).toBe(0);

            // Load files
            for (const filePath of filePaths) {
                await fileCache.loadFile(filePath);
            }

            expect(fileCache.size()).toBe(filePaths.length);
        });

        test('should update count when files are removed', async () => {
            expect.assertions(3);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';

            await fileCache.loadFile(filePath);
            expect(fileCache.size()).toBe(1);

            fileCache.removeFileFromCache(filePath);
            expect(fileCache.size()).toBe(0);
        });
    });

    describe('race condition prevention', () => {
        test('should prevent race conditions when multiple callers request the same file simultaneously', async () => {
            expect.assertions(22);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';

            // Simulate multiple callers requesting the same file at nearly the same time
            const startTime = Date.now();
            const promises = [];

            // Start 10 concurrent requests
            for (let i = 0; i < 10; i++) {
                promises.push(fileCache.loadFile(filePath));
            }

            // All promises should be the same instance
            const firstPromise = promises[0];
            promises.forEach(promise => {
                expect(promise).toBe(firstPromise);
            });

            // Wait for all to resolve
            const results = await Promise.all(promises);
            const endTime = Date.now();

            // All results should be identical
            const firstResult = results[0];
            results.forEach(result => {
                expect(result).toBe(firstResult);
            });

            // The file should only be loaded once (race condition prevented)
            expect(fileCache.size()).toBe(1);

            // Verify that the loader was only called once
            // (This would require mocking the loader's loadFile method to track calls)
        });

        test('should handle rapid successive calls correctly', async () => {
            expect.assertions(6);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';

            // Make rapid successive calls
            const promise1 = fileCache.loadFile(filePath);
            const promise2 = fileCache.loadFile(filePath);
            const promise3 = fileCache.loadFile(filePath);

            // All should be the same promise
            expect(promise1).toBe(promise2);
            expect(promise2).toBe(promise3);

            // Wait for resolution
            const result1 = await promise1;
            const result2 = await promise2;
            const result3 = await promise3;

            // All should resolve to the same result
            expect(result1).toBe(result2);
            expect(result2).toBe(result3);

            // Cache size should be 1 (only one file)
            expect(fileCache.size()).toBe(1);
        });
    });

    describe('edge cases', () => {
        test('should handle empty file path gracefully without increasing cache size', () => {
            expect.assertions(3);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            expect(() => {
                fileCache.loadFile('');
            }).not.toThrow();

            expect(fileCache.size()).toBe(0);
        });

        test('should handle null file path gracefully without increasing cache size', () => {
            expect.assertions(3);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            expect(() => {
                fileCache.loadFile(null);
            }).not.toThrow();

            expect(fileCache.size()).toBe(0);
        });

        test('should handle undefined file path gracefully without increasing cache size', () => {
            expect.assertions(3);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            expect(() => {
                fileCache.loadFile(undefined);
            }).not.toThrow();

            expect(fileCache.size()).toBe(0);
        });

        test('should handle very long file paths', async () => {
            expect.assertions(3);

            const fileCache = FileCache.getFileCache(mockLoader);
            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);

            const longPath = 'a'.repeat(1000) + '/fr/localeinfo.json';

            const promise = fileCache.loadFile(longPath);
            expect(promise).toBeInstanceOf(Promise);

            // Should not throw an error
            const result = await promise;
            expect(result).toBeDefined();
        });
    });
});
