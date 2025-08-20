/*
 * FileCache.test.js - unit tests for the FileCache class
 *
 * Copyright © 2022 JEDLSoft
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
import DataCache from '../src/DataCache.js';

describe('FileCache', () => {
    let mockLoader;
    let fileCache;
    let dataCache;

    beforeEach(() => {
        // Clear any existing data cache
        DataCache.clearDataCache();
        mockLoader = new MockLoader();
        fileCache = new FileCache(mockLoader);
        dataCache = DataCache.getDataCache();
    });

    afterEach(() => {
        // Clean up after each test
        DataCache.clearDataCache();
    });

    describe('constructor', () => {
        test('should create a FileCache instance with the provided loader', () => {
            expect.assertions(3);

            expect(fileCache.loader).toBe(mockLoader);
            expect(fileCache.dataCache).toBeDefined();
            expect(fileCache.dataCache).toBe(dataCache);
        });
    });

    describe('loadFile', () => {
        test('should load a file and return a promise', () => {
            expect.assertions(3);

            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';
            const promise = fileCache.loadFile(filePath);

            expect(promise).toBeInstanceOf(Promise);
            expect(fileCache.size()).toBe(1);
        });

        test('should return the same promise for the same file path when called multiple times', () => {
            expect.assertions(3);

            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';
            const promise1 = fileCache.loadFile(filePath);
            const promise2 = fileCache.loadFile(filePath);

            expect(promise1).toBe(promise2);
            expect(fileCache.size()).toBe(1);
        });

        test('should cache the promise and return it for subsequent calls', () => {
            expect.assertions(2);

            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';
            fileCache.loadFile(filePath);
            fileCache.loadFile(filePath);

            expect(fileCache.size()).toBe(1);
        });

        test('should load file data correctly and return the same result on subsequent calls', async () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';
            const result1 = await fileCache.loadFile(filePath);
            const result2 = await fileCache.loadFile(filePath);

            expect(typeof result1).toBe('string');
            expect(result1).toBe(result2);
            expect(fileCache.size()).toBe(1); // Promise remains in cache as marker
        });

        test('should load data from multiple different files', async () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);

            const filePath1 = 'fr/localeinfo.json';
            const filePath2 = 'FR/localeinfo.json';

            const result1 = await fileCache.loadFile(filePath1);
            const result2 = await fileCache.loadFile(filePath2);

            expect(typeof result1).toBe('string');
            expect(typeof result2).toBe('string');
            expect(result1).not.toBe(result2);
        });

        test('should load data from the same file multiple times', async () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';
            const result1 = await fileCache.loadFile(filePath);
            const result2 = await fileCache.loadFile(filePath);

            expect(typeof result1).toBe('string');
            expect(result1).toBe(result2);
            expect(fileCache.size()).toBe(1); // Promise remains in cache as marker
        });

        test('should load data from the same file multiple times even after the promise has been resolved', async () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';
            const result1 = await fileCache.loadFile(filePath);
            // Wait a bit to ensure promise cleanup
            await new Promise(resolve => setTimeout(resolve, 10));
            const result2 = await fileCache.loadFile(filePath);

            expect(typeof result1).toBe('string');
            expect(result1).toBe(result2);
            expect(fileCache.size()).toBe(1); // Promise remains in cache as marker
        });

        test('should handle multiple concurrent requests for the same file', async () => {
            expect.assertions(22);

            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';

            // Start multiple concurrent requests
            const promises = [];
            for (let i = 0; i < 10; i++) {
                promises.push(fileCache.loadFile(filePath));
            }

            // All promises should resolve to the same data
            const results = await Promise.all(promises);
            results.forEach(result => {
                expect(typeof result).toBe('string');
                expect(result).toBe(results[0]);
            });

            // Only one file should have been loaded
            expect(fileCache.size()).toBe(1); // Promise remains in cache as marker
        });

        test('should handle rapid successive calls correctly', async () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';

            // Make rapid successive calls
            const promise1 = fileCache.loadFile(filePath);
            const promise2 = fileCache.loadFile(filePath);
            const promise3 = fileCache.loadFile(filePath);

            expect(fileCache.size()).toBe(1);

            const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3]);
            expect(result1).toBe(result2);
            expect(result2).toBe(result3);
        });

        test('should handle file loading errors gracefully', async () => {
            expect.assertions(2);

            expect(fileCache.size()).toBe(0);

            // Test that invalid file paths are handled gracefully
            const invalidPath = '';
            const result = await fileCache.loadFile(invalidPath);

            expect(result).toBe(undefined);
        });

        test('should handle propagate errors from the loader', async () => {
            expect.assertions(2);

            expect(fileCache.size()).toBe(0);

            // Test that null file paths are handled gracefully
            const invalidPath = null;
            const result = await fileCache.loadFile(invalidPath);

            expect(result).toBe(undefined);
        });
    });

    describe('loadFileSync', () => {
        test('should load a file synchronously and return data', () => {
            expect.assertions(3);

            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';
            const result = fileCache.loadFileSync(filePath);

            expect(typeof result).toBe('string');
            expect(fileCache.attemptCount()).toBe(1);
        });

        test('should return undefined for invalid file paths', () => {
            expect.assertions(2);

            expect(fileCache.size()).toBe(0);

            const result = fileCache.loadFileSync('');
            expect(result).toBe(undefined);
        });

        test('should return cached result for previously loaded files', () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';
            const result1 = fileCache.loadFileSync(filePath);
            const result2 = fileCache.loadFileSync(filePath);

            expect(typeof result1).toBe('string');
            expect(result1).toBe(result2);
            expect(fileCache.attemptCount()).toBe(1);
        });

        test('should handle files that return no data', () => {
            expect.assertions(3);

            expect(fileCache.size()).toBe(0);

            // Mock a file that returns no data
            const noDataLoader = {
                loadFile: (path, options) => {
                    if (options && options.sync) {
                        return undefined;
                    }
                    return Promise.resolve(undefined);
                },
                supportsSync: true
            };

            const fileCache2 = new FileCache(noDataLoader);
            const result = fileCache2.loadFileSync('nonexistent.json');

            expect(result).toBe(undefined);
            expect(fileCache2.attemptCount()).toBe(1);
        });
    });

    describe('removeFileFromCache', () => {
        test('should remove a file from the cache', () => {
            expect.assertions(3);

            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';
            fileCache.loadFile(filePath);
            expect(fileCache.size()).toBe(1);

            fileCache.removeFileFromCache(filePath);
            expect(fileCache.size()).toBe(0);
        });

        test('should allow reloading a file after removal', async () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';
            const result1 = await fileCache.loadFile(filePath);
            fileCache.removeFileFromCache(filePath);

            const result2 = await fileCache.loadFile(filePath);
            expect(typeof result1).toBe('string');
            expect(typeof result2).toBe('string');
            expect(result1).toBe(result2);
        });

        test('should handle removing non-existent files gracefully', () => {
            expect.assertions(2);

            expect(fileCache.size()).toBe(0);

            fileCache.removeFileFromCache('nonexistent.json');
            expect(fileCache.size()).toBe(0);
        });
    });

    describe('clearCache', () => {
        test('should clear all cached file promises', () => {
            expect.assertions(3);

            expect(fileCache.size()).toBe(0);

            fileCache.loadFile('fr/localeinfo.json');
            fileCache.loadFile('FR/localeinfo.json');
            expect(fileCache.size()).toBe(2);

            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);
        });

        test('should allow reloading files after clearing cache', async () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';
            const result1 = await fileCache.loadFile(filePath);
            fileCache.clearCache();

            const result2 = await fileCache.loadFile(filePath);
            expect(typeof result1).toBe('string');
            expect(typeof result2).toBe('string');
            expect(result1).toBe(result2);
        });
    });

    describe('size', () => {
        test('should return 0 for empty cache', () => {
            expect.assertions(2);

            expect(fileCache.size()).toBe(0);

            expect(fileCache.size()).toBe(0);
        });

        test('should return correct count of cached files', () => {
            expect.assertions(2);

            expect(fileCache.size()).toBe(0);

            fileCache.loadFile('fr/localeinfo.json');
            expect(fileCache.size()).toBe(1);
        });

        test('should update count when files are removed', () => {
            expect.assertions(3);

            expect(fileCache.size()).toBe(0);

            fileCache.loadFile('fr/localeinfo.json');
            expect(fileCache.size()).toBe(1);

            fileCache.removeFileFromCache('fr/localeinfo.json');
            expect(fileCache.size()).toBe(0);
        });
    });

    describe('attemptCount', () => {
        test('should return 0 for no loading attempts', () => {
            expect.assertions(2);

            expect(fileCache.size()).toBe(0);

            expect(fileCache.attemptCount()).toBe(0);
        });

        test('should track successful loading attempts', () => {
            expect.assertions(2);

            expect(fileCache.size()).toBe(0);

            fileCache.loadFileSync('fr/localeinfo.json');
            expect(fileCache.attemptCount()).toBe(1);
        });

        test('should track failed loading attempts', () => {
            expect.assertions(2);

            expect(fileCache.size()).toBe(0);

            // Test with a loader that throws an error
            const errorLoader = {
                loadFile: (path, options) => {
                    if (options && options.sync) {
                        throw new Error('Test error');
                    }
                    return Promise.reject(new Error('Test error'));
                },
                supportsSync: true
            };

            const fileCache2 = new FileCache(errorLoader);
            fileCache2.loadFileSync('test.json');
            expect(fileCache2.attemptCount()).toBe(1);
        });

        test('should not increase count for duplicate attempts', () => {
            expect.assertions(3);

            expect(fileCache.size()).toBe(0);

            fileCache.loadFileSync('fr/localeinfo.json');
            expect(fileCache.attemptCount()).toBe(1);

            fileCache.loadFileSync('fr/localeinfo.json');
            expect(fileCache.attemptCount()).toBe(1);
        });
    });

    describe('race condition prevention', () => {
        test('should prevent race conditions when multiple callers request the same file simultaneously', async () => {
            expect.assertions(22);

            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';

            // Start multiple concurrent requests
            const promises = [];
            for (let i = 0; i < 10; i++) {
                promises.push(fileCache.loadFile(filePath));
            }

            // All promises should resolve to the same data
            const results = await Promise.all(promises);
            results.forEach(result => {
                expect(typeof result).toBe('string');
                expect(result).toBe(results[0]);
            });

            // Only one file should have been loaded
            expect(fileCache.size()).toBe(1); // Promise remains in cache as marker
        });

        test('should handle rapid successive calls correctly', async () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);

            const filePath = 'fr/localeinfo.json';

            // Make rapid successive calls
            const promise1 = fileCache.loadFile(filePath);
            const promise2 = fileCache.loadFile(filePath);
            const promise3 = fileCache.loadFile(filePath);

            expect(fileCache.size()).toBe(1);

            const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3]);
            expect(result1).toBe(result2);
            expect(result2).toBe(result3);
        });
    });

    describe('edge cases', () => {
        test('should handle empty file path gracefully without increasing cache size', () => {
            expect.assertions(3);

            expect(fileCache.size()).toBe(0);

            const result = fileCache.loadFileSync('');
            expect(result).toBe(undefined);
            expect(fileCache.size()).toBe(0);
        });

        test('should handle null file path gracefully without increasing cache size', () => {
            expect.assertions(3);

            expect(fileCache.size()).toBe(0);

            const result = fileCache.loadFileSync(null);
            expect(result).toBe(undefined);
            expect(fileCache.size()).toBe(0);
        });

        test('should handle undefined file path gracefully without increasing cache size', () => {
            expect.assertions(3);

            expect(fileCache.size()).toBe(0);

            const result = fileCache.loadFileSync(undefined);
            expect(result).toBe(undefined);
            expect(fileCache.size()).toBe(0);
        });

        test('should handle very long file paths', async () => {
            expect.assertions(3);

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
