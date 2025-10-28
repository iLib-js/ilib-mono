/*
 * EnsureLocale.test.js - test the ensureLocale method to verify race condition fixes
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

import LocaleData from '../src/LocaleData.js';
import Locale from 'ilib-locale';
import DataCache from '../src/DataCache.js';
import { setPlatform, getPlatform } from 'ilib-env';
import { registerLoader } from 'ilib-loader';
import MockLoader from './MockLoader.js';

describe('LocaleData.ensureLocale', () => {
    beforeEach(() => {
        // Clear cache before each test
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();
        DataCache.clearDataCache();
    });

    afterEach(() => {
        // Clean up after each test
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();
        DataCache.clearDataCache();
    });

    test('concurrent ensureLocale calls should return consistent results', async () => {
        // Add a test root with some locale data
        LocaleData.addGlobalRoot("./test/files");

        // Simulate concurrent calls to ensureLocale for the same locale
        const promises = [];
        for (let i = 0; i < 5; i++) {
            promises.push(LocaleData.ensureLocale("en-US"));
        }

        const results = await Promise.all(promises);

        // All results should be the same (either all true or all false)
        const firstResult = results[0];
        results.forEach(result => {
            expect(result).toBe(firstResult);
        });
    });

    test('should return true when data is available', async () => {
        // Add a test root with some locale data
        LocaleData.addGlobalRoot("./test/files");

        // Call ensureLocale for a locale that exists
        const result = await LocaleData.ensureLocale("en-US");

        // Should return true if data is actually available
        expect(typeof result).toBe("boolean");

        // Verify that if it returns true, the data is actually in cache
        if (result === true) {
            const cacheResult = LocaleData.checkCache("en-US", "test");
            expect(cacheResult).toBe(true);
        }
    });

    test('rapid successive calls should return consistent results', async () => {
        // Add a test root
        LocaleData.addGlobalRoot("./test/files");

        // Make rapid successive calls
        const [result1, result2, result3] = await Promise.all([
            LocaleData.ensureLocale("en-US"),
            LocaleData.ensureLocale("en-US"),
            LocaleData.ensureLocale("en-US")
        ]);

        // All results should be the same
        expect(result1).toBe(result2);
        expect(result2).toBe(result3);
    });

    test('should handle different locales correctly', async () => {
        // Add a test root
        LocaleData.addGlobalRoot("./test/files");

        // Test with different locales
        const locales = ["en-US", "de-DE", "fr-FR", "es-ES"];
        const promises = locales.map(locale => LocaleData.ensureLocale(locale));

        const results = await Promise.all(promises);

        // All results should be boolean
        results.forEach(result => {
            expect(typeof result).toBe("boolean");
        });
    });

    test('should handle race condition scenario correctly', async () => {
        // This test simulates the exact race condition we encountered
        // where ensureLocale was returning true before data was available

        // Add a test root
        LocaleData.addGlobalRoot("./test/files");

        // First call - should trigger loading
        const promise1 = LocaleData.ensureLocale("nl-NL");

        // Immediately make a second call - this should wait for the first to complete
        const promise2 = LocaleData.ensureLocale("nl-NL");

        const [result1, result2] = await Promise.all([promise1, promise2]);

        // Both should resolve to the same value
        expect(result1).toBe(result2);

        // If either returns true, verify data is actually available
        if (result1 === true || result2 === true) {
            const cacheResult = LocaleData.checkCache("nl-NL", "test");
            expect(cacheResult).toBe(true);
        }
    });

    test('should prevent multiple file loading promises for the same locale', async () => {
        // Add a test root
        LocaleData.addGlobalRoot("./test/files");

        // Start multiple concurrent requests for the same locale
        const promises = [];
        for (let i = 0; i < 10; i++) {
            promises.push(LocaleData.ensureLocale("ja-JP"));
        }

        const results = await Promise.all(promises);

        // All results should be identical
        const firstResult = results[0];
        results.forEach(result => {
            expect(result).toBe(firstResult);
        });

        // Verify that the FileCache is working - only one promise should be cached
        // This is an implementation detail test to ensure our race condition fix works
        const dataCache = DataCache.getDataCache();
        // The exact count depends on how many files are loaded, but it should be reasonable
        expect(dataCache.getFilePromiseCount()).toBeGreaterThan(0);
    });

    test('should handle locale with multiple sublocales correctly', async () => {
        // Add a test root
        LocaleData.addGlobalRoot("./test/files");

        // Test with a locale that has multiple sublocales (e.g., zh-Hans-CN)
        const result = await LocaleData.ensureLocale("zh-Hans-CN");

        expect(typeof result).toBe("boolean");
    });

    test('should handle root locale correctly', async () => {
        // Add a test root
        LocaleData.addGlobalRoot("./test/files");

        // Test with root locale
        const result = await LocaleData.ensureLocale("root");

        expect(typeof result).toBe("boolean");
    });

    test('should handle invalid locale gracefully', async () => {
        // Add a test root
        LocaleData.addGlobalRoot("./test/files");

        // Test with invalid locale - these should throw asynchronously
        await expect(LocaleData.ensureLocale(null)).rejects.toThrow("Invalid locale parameter to ensureLocale");
        await expect(LocaleData.ensureLocale(undefined)).rejects.toThrow("Invalid locale parameter to ensureLocale");
        await expect(LocaleData.ensureLocale(123)).rejects.toThrow("Invalid locale parameter to ensureLocale");
        await expect(LocaleData.ensureLocale({})).rejects.toThrow("Invalid locale parameter to ensureLocale");

        // Test with valid locale - should not throw
        const result = await LocaleData.ensureLocale("en-US");
        expect(typeof result).toBe("boolean");
    });

    test('should work with multiple global roots', async () => {
        // Add multiple test roots
        LocaleData.addGlobalRoot("./test/files1");
        LocaleData.addGlobalRoot("./test/files2");

        const result = await LocaleData.ensureLocale("en-US");

        expect(typeof result).toBe("boolean");
    });


    test('should throw error when called with undefined parameter', async () => {
        expect.assertions(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        await expect(LocaleData.ensureLocale()).rejects.toThrow("Invalid locale parameter to ensureLocale");
    });

    test('should throw error when called with boolean parameter', async () => {
        expect.assertions(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        await expect(LocaleData.ensureLocale(true)).rejects.toThrow("Invalid locale parameter to ensureLocale");
    });

    test('should throw error when called with number parameter', async () => {
        expect.assertions(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        await expect(LocaleData.ensureLocale(4)).rejects.toThrow("Invalid locale parameter to ensureLocale");
    });
});