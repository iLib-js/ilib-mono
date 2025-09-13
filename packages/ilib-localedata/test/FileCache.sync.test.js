/*
 * FileCache.sync.test.js - sync unit tests for the FileCache class (Node only)
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

describe('FileCache Sync Tests (Node Only)', () => {
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

    describe('constructor', () => {
        test('should create a FileCache instance with the provided loader', () => {
            expect.assertions(3);

            expect(fileCache.loader).toBe(loader);
            expect(fileCache.dataCache).toBeDefined();
            expect(fileCache.dataCache).toBe(dataCache);
        });
    });

    describe('loadFile (sync behavior)', () => {
        test('should load a file and return a promise', () => {
            expect.assertions(3);

            expect(fileCache.size()).toBe(0);

            const filePath = 'test/files/fr/localeinfo.json';
            const promise = fileCache.loadFile(filePath);

            expect(promise).toBeInstanceOf(Promise);
            expect(fileCache.size()).toBe(1);
        });

        test('should return the same promise for the same file path when called multiple times', () => {
            expect.assertions(3);

            expect(fileCache.size()).toBe(0);

            const filePath = 'test/files/fr/localeinfo.json';
            const promise1 = fileCache.loadFile(filePath);
            const promise2 = fileCache.loadFile(filePath);

            expect(promise1).toBe(promise2);
            expect(fileCache.size()).toBe(1);
        });

        test('should cache the promise and return it for subsequent calls', () => {
            expect.assertions(2);

            expect(fileCache.size()).toBe(0);

            const filePath = 'test/files/fr/localeinfo.json';
            fileCache.loadFile(filePath);
            fileCache.loadFile(filePath);

            expect(fileCache.size()).toBe(1);
        });
    });

    describe('loadFileSync', () => {
        test('should load a file synchronously and return data', () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);
            expect(fileCache.attemptCount()).toBe(0);

            const filePath = 'test/files/fr/localeinfo.json';
            const result = fileCache.loadFileSync(filePath);

            expect(typeof result).toBe('string');
            expect(fileCache.attemptCount()).toBe(1);
        });

        test('should return undefined for invalid file paths', () => {
            expect.assertions(2);

            const result = fileCache.loadFileSync('nonexistent/file.json');

            expect(result).toBeUndefined();
            expect(fileCache.attemptCount()).toBe(1);
        });

        test('should return cached result for previously loaded files', () => {
            expect.assertions(4);

            const filePath = 'test/files/fr/localeinfo.json';
            
            // First call - should load from file
            const result1 = fileCache.loadFileSync(filePath);
            expect(typeof result1).toBe('string');
            expect(fileCache.attemptCount()).toBe(1);

            // Second call - should return cached result
            const result2 = fileCache.loadFileSync(filePath);
            expect(result2).toBe(result1);
            expect(fileCache.attemptCount()).toBe(1); // Should not increase
        });

        test('should handle files that return no data', () => {
            expect.assertions(2);

            // Use a file path that exists but returns no data
            const filePath = 'test/files/empty.json';
            const result = fileCache.loadFileSync(filePath);

            expect(result).toBeUndefined();
            expect(fileCache.attemptCount()).toBe(1);
        });
    });

    describe('removeFileFromCache', () => {
        test('should remove a file from the cache', () => {
            expect.assertions(3);

            const filePath = 'test/files/fr/localeinfo.json';
            fileCache.loadFile(filePath);
            expect(fileCache.size()).toBe(1);

            fileCache.removeFileFromCache(filePath);
            expect(fileCache.size()).toBe(0);

            // Should be able to load again
            fileCache.loadFile(filePath);
            expect(fileCache.size()).toBe(1);
        });

        test('should handle removing non-existent files gracefully', () => {
            expect.assertions(2);

            expect(fileCache.size()).toBe(0);
            fileCache.removeFileFromCache('nonexistent/file.json');
            expect(fileCache.size()).toBe(0);
        });
    });

    describe('clearCache', () => {
        test('should clear all cached file promises', () => {
            expect.assertions(3);

            fileCache.loadFile('test/files/fr/localeinfo.json');
            fileCache.loadFile('test/files/FR/localeinfo.json');
            expect(fileCache.size()).toBe(2);

            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);
            expect(fileCache.attemptCount()).toBe(0);
        });
    });

    describe('size', () => {
        test('should return 0 for empty cache', () => {
            expect.assertions(1);

            expect(fileCache.size()).toBe(0);
        });

        test('should return correct count of cached files', () => {
            expect.assertions(3);

            expect(fileCache.size()).toBe(0);
            fileCache.loadFile('test/files/fr/localeinfo.json');
            expect(fileCache.size()).toBe(1);
            fileCache.loadFile('test/files/FR/localeinfo.json');
            expect(fileCache.size()).toBe(2);
        });

        test('should update count when files are removed', () => {
            expect.assertions(4);

            fileCache.loadFile('test/files/fr/localeinfo.json');
            fileCache.loadFile('test/files/FR/localeinfo.json');
            expect(fileCache.size()).toBe(2);

            fileCache.removeFileFromCache('test/files/fr/localeinfo.json');
            expect(fileCache.size()).toBe(1);

            fileCache.clearCache();
            expect(fileCache.size()).toBe(0);
            expect(fileCache.attemptCount()).toBe(0);
        });
    });

    describe('attemptCount', () => {
        test('should return 0 for no loading attempts', () => {
            expect.assertions(1);

            expect(fileCache.attemptCount()).toBe(0);
        });

        test('should track successful loading attempts', () => {
            expect.assertions(2);

            fileCache.loadFileSync('test/files/fr/localeinfo.json');
            expect(fileCache.attemptCount()).toBe(1);

            fileCache.loadFileSync('test/files/FR/localeinfo.json');
            expect(fileCache.attemptCount()).toBe(2);
        });

        test('should track failed loading attempts', () => {
            expect.assertions(2);

            fileCache.loadFileSync('nonexistent/file1.json');
            expect(fileCache.attemptCount()).toBe(1);

            fileCache.loadFileSync('nonexistent/file2.json');
            expect(fileCache.attemptCount()).toBe(2);
        });

        test('should not increase count for duplicate attempts', () => {
            expect.assertions(3);

            const filePath = 'test/files/fr/localeinfo.json';
            fileCache.loadFileSync(filePath);
            expect(fileCache.attemptCount()).toBe(1);

            // Second attempt should not increase count
            fileCache.loadFileSync(filePath);
            expect(fileCache.attemptCount()).toBe(1);

            // Different file should increase count
            fileCache.loadFileSync('test/files/FR/localeinfo.json');
            expect(fileCache.attemptCount()).toBe(2);
        });
    });

    describe('edge cases', () => {
        test('should handle empty file path gracefully without increasing cache size', () => {
            expect.assertions(3);

            const result = fileCache.loadFileSync('');
            expect(result).toBeUndefined();
            expect(fileCache.size()).toBe(0);
            expect(fileCache.attemptCount()).toBe(0);
        });

        test('should handle null file path gracefully without increasing cache size', () => {
            expect.assertions(3);

            const result = fileCache.loadFileSync(null);
            expect(result).toBeUndefined();
            expect(fileCache.size()).toBe(0);
            expect(fileCache.attemptCount()).toBe(0);
        });

        test('should handle undefined file path gracefully without increasing cache size', () => {
            expect.assertions(3);

            const result = fileCache.loadFileSync(undefined);
            expect(result).toBeUndefined();
            expect(fileCache.size()).toBe(0);
            expect(fileCache.attemptCount()).toBe(0);
        });
    });

    describe('CommonJS file loading (files7)', () => {
        test('should load CommonJS files synchronously and return function', () => {
            expect.assertions(4);

            expect(fileCache.size()).toBe(0);
            expect(fileCache.attemptCount()).toBe(0);

            const filePath = 'test/files7/en-US.js';
            const result = fileCache.loadFileSync(filePath);

            expect(typeof result).toBe('function');
            expect(fileCache.attemptCount()).toBe(1);
        });

        test('should handle CommonJS files that return data functions', () => {
            expect.assertions(3);

            const filePath = 'test/files7/en-US.js';
            const result = fileCache.loadFileSync(filePath);

            expect(typeof result).toBe('function');
            
            // Call the function to get the actual data
            const data = result();
            expect(data).toBeDefined();
            expect(data.en).toBeDefined();
        });

        test('should verify CommonJS files return functions with proper structure', () => {
            expect.assertions(4);

            const filePath = 'test/files7/en-US.js';
            const result = fileCache.loadFileSync(filePath);

            // Verify it's a function
            expect(typeof result).toBe('function');
            
            // Verify the function has the expected properties
            expect(result.name).toBe('getLocaleData');
            expect(result.length).toBe(0); // No parameters expected
            
            // Verify calling the function returns the expected data structure
            const data = result();
            expect(data).toHaveProperty('root');
        });

        test('should cache CommonJS file results correctly', () => {
            expect.assertions(4);

            const filePath = 'test/files7/en-US.js';
            
            // First call - should load from file
            const result1 = fileCache.loadFileSync(filePath);
            expect(typeof result1).toBe('function');
            expect(fileCache.attemptCount()).toBe(1);

            // Second call - should return cached result
            const result2 = fileCache.loadFileSync(filePath);
            expect(result2).toBe(result1);
            expect(fileCache.attemptCount()).toBe(1); // Should not increase
        });

        test('should handle invalid file paths gracefully', () => {
            expect.assertions(4);

            // Test with null file path
            const nullResult = fileCache.loadFileSync(null);
            expect(nullResult).toBeUndefined();

            // Test with undefined file path
            const undefinedResult = fileCache.loadFileSync(undefined);
            expect(undefinedResult).toBeUndefined();

            // Test with empty string
            const emptyResult = fileCache.loadFileSync('');
            expect(emptyResult).toBeUndefined();

            // Test with whitespace-only string
            const whitespaceResult = fileCache.loadFileSync('   ');
            expect(whitespaceResult).toBeUndefined();
        });

        test('should handle non-string file paths', () => {
            expect.assertions(3);

            // Test with number
            const numberResult = fileCache.loadFileSync(123);
            expect(numberResult).toBeUndefined();

            // Test with object
            const objectResult = fileCache.loadFileSync({ path: 'test' });
            expect(objectResult).toBeUndefined();

            // Test with boolean
            const booleanResult = fileCache.loadFileSync(true);
            expect(booleanResult).toBeUndefined();
        });

        test('should handle file loading errors gracefully', () => {
            expect.assertions(2);

            // Test with non-existent file
            const nonExistentResult = fileCache.loadFileSync('test/nonexistent/file.json');
            expect(nonExistentResult).toBeUndefined();

            // Test with invalid file path that might cause errors
            const invalidPathResult = fileCache.loadFileSync('test/files/../invalid/../../path.json');
            expect(invalidPathResult).toBeUndefined();
        });
    });
});
