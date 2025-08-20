/*
 * Copyright 2025, JEDLSoft
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

import MergedDataCache from '../src/MergedDataCache.js';
import DataCache from '../src/DataCache.js';
import MockLoader from './MockLoader.js';
import Locale from 'ilib-locale';

describe('MergedDataCache', () => {
    let mergedDataCache;
    let mockLoader;

    beforeEach(() => {
        mockLoader = new MockLoader();
        mergedDataCache = new MergedDataCache(mockLoader);
        DataCache.clearDataCache();
    });

    afterEach(() => {
        DataCache.clearDataCache();
    });

    describe('constructor', () => {
        test('should create a MergedDataCache instance with the provided loader', () => {
            expect.assertions(2);
            expect(mergedDataCache).toBeDefined();
            expect(mergedDataCache.loader).toBe(mockLoader);
        });

        test('should initialize with DataCache instance', () => {
            expect.assertions(1);
            expect(mergedDataCache.dataCache).toBeDefined();
        });

        test('should set merge options correctly in constructor', () => {
            expect.assertions(3);

            const cache = new MergedDataCache(mockLoader, {
                mostSpecific: true,
                returnOne: false,
                crossRoots: true
            });

            expect(cache.mostSpecific).toBe(true);
            expect(cache.returnOne).toBe(false);
            expect(cache.crossRoots).toBe(true);
        });

        test('should use default merge options when none provided', () => {
            expect.assertions(3);

            const cache = new MergedDataCache(mockLoader);

            expect(cache.mostSpecific).toBe(false);
            expect(cache.returnOne).toBe(false);
            expect(cache.crossRoots).toBe(false);
        });
    });

    describe('loadMergedData', () => {
        test('should load and cache merged data from .js file', async () => {
            expect.assertions(2);

            // Mock the MockLoader to return a .js file with locale data
            mockLoader.loadFile = jest.fn().mockResolvedValue({
                default: () => ({
                    "root": {
                        "info": { "a": "b", "c": "d" }
                    },
                    "en": {
                        "info": { "a": "b en", "c": "d en" }
                    }
                })
            });

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);

            // The merged result should be flattened with en data overriding root data
            expect(result).toBeDefined();
            expect(result.info).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should fall back to individual .json files when .js file not found', async () => {
            expect.assertions(2);

            // Mock the MockLoader to fail on .js file but succeed on .json files
            mockLoader.loadFile = jest.fn()
                .mockRejectedValueOnce(new Error('File not found')) // .js file fails
                .mockResolvedValueOnce('{"root": {"info": {"a": "b", "c": "d"}}}') // root.json
                .mockResolvedValueOnce('{"en": {"info": {"a": "b en", "c": "d en"}}}'); // en.json

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);

            // The merged result should be flattened with en data overriding root data
            expect(result).toBeDefined();
            expect(result.info).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should handle fallback to .json files with partial data', async () => {
            expect.assertions(1);

            // Mock the MockLoader to fail on .js file but succeed on .json files
            // This tests the scenario where individual .json files have different properties
            mockLoader.loadFile = jest.fn()
                .mockRejectedValueOnce(new Error('File not found')) // .js file fails
                .mockResolvedValueOnce('{"root": {"info": {"a": "b", "c": "d", "e": "f"}}}') // root.json
                .mockResolvedValueOnce('{"en": {"info": {"a": "b en", "x": "y en"}}}'); // en.json

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);

            // Should merge: en overrides root for "a", en adds "x", root provides "c" and "e"
            expect(result.info).toEqual({
                "a": "b en",  // from en (overrides root)
                "c": "d",     // from root (en doesn't have it)
                "e": "f",     // from root (en doesn't have it)
                "x": "y en"   // from en (new property)
            });
        });

        test('should return cached data if already loaded', async () => {
            expect.assertions(2);

            // First call loads and caches data
            mockLoader.loadFile = jest.fn().mockResolvedValue({
                default: () => ({
                    "root": {
                        "info": { "a": "b", "c": "d" }
                    },
                    "en": {
                        "info": { "a": "b en", "c": "d en" }
                    }
                })
            });

            const result1 = await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);
            expect(result1.info).toEqual({ "a": "b en", "c": "d en" });

            // Second call should use cached data (loader should not be called again)
            mockLoader.loadFile.mockClear();
            const result2 = await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);

            expect(mockLoader.loadFile).not.toHaveBeenCalled();
        });

        test('should handle locale parameter as string or Locale object', async () => {
            expect.assertions(2);

            mockLoader.loadFile = jest.fn().mockResolvedValue({
                default: () => ({
                    "root": {
                        "info": { "a": "b", "c": "d" }
                    },
                    "en": {
                        "info": { "a": "b en", "c": "d en" }
                    }
                })
            });

            // Test with string
            const result1 = await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);
            expect(result1.info).toEqual({ "a": "b en", "c": "d en" });

            // Test with Locale object
            const result2 = await mergedDataCache.loadMergedData(new Locale("en-US"), ["./test/files3"]);
            expect(result2.info).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should reject promise when no data can be loaded', async () => {
            expect.assertions(1);

            mockLoader.loadFile = jest.fn().mockRejectedValue(new Error('File not found'));

            await expect(mergedDataCache.loadMergedData("en-US", ["./test/files3"]))
                .rejects.toThrow('File not found');
        });

        test('should handle locale with only root data available', async () => {
            expect.assertions(2);

            // Mock the MockLoader to return only root data
            mockLoader.loadFile = jest.fn().mockResolvedValue({
                default: () => ({
                    "root": {
                        "info": { "a": "b root", "c": "d root" }
                    }
                })
            });

            const result = await mergedDataCache.loadMergedData("fr-FR", ["./test/files3"]);

            // Should return root data when no locale-specific data exists
            expect(result).toBeDefined();
            expect(result.info).toEqual({ "a": "b root", "c": "d root" });
        });

        test('should merge multiple basenames correctly', async () => {
            expect.assertions(3);

            mockLoader.loadFile = jest.fn().mockResolvedValue({
                default: () => ({
                    "root": {
                        "info": { "a": "b", "c": "d" },
                        "foo": { "m": "n", "o": "p" }
                    },
                    "en": {
                        "info": { "a": "b en", "c": "d en" },
                        "foo": { "m": "n en", "o": "p en" }
                    }
                })
            });

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);

            // Both basenames should be merged correctly
            expect(result.info).toEqual({ "a": "b en", "c": "d en" });
            expect(result.foo).toEqual({ "m": "n en", "o": "p en" });
        });

        test('should handle partial locale data with root fallback', async () => {
            expect.assertions(1);

            // Root has more properties than locale data
            mockLoader.loadFile = jest.fn().mockResolvedValue({
                default: () => ({
                    "root": {
                        "info": {
                            "a": "b",
                            "c": "d",
                            "e": "f",
                            "g": "h"
                        }
                    },
                    "en": {
                        "info": {
                            "a": "b en",  // overrides root
                            "c": "d en"   // overrides root
                            // missing "e" and "g" - should fall back to root
                        }
                    }
                })
            });

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);

            // Should merge: locale overrides root, missing properties fall back to root
            expect(result.info).toEqual({
                "a": "b en",  // from en
                "c": "d en",  // from en
                "e": "f",     // from root (fallback)
                "g": "h"      // from root (fallback)
            });
        });

        test('should handle locale data with new properties not in root', async () => {
            expect.assertions(1);

            mockLoader.loadFile = jest.fn().mockResolvedValue({
                default: () => ({
                    "root": {
                        "info": {
                            "a": "b",
                            "c": "d"
                        }
                    },
                    "en": {
                        "info": {
                            "a": "b en",  // overrides root
                            "c": "d en",  // overrides root
                            "x": "y en",  // new property from locale
                            "z": "w en"   // new property from locale
                        }
                    }
                })
            });

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);

            // Should include all properties: overridden, fallback, and new
            expect(result.info).toEqual({
                "a": "b en",  // from en (overrides root)
                "c": "d en",  // from en (overrides root)
                "x": "y en",  // from en (new)
                "z": "w en"   // from en (new)
            });
        });

        test('should handle multiple locale layers with cascading priority', async () => {
            expect.assertions(1);

            // Multiple locale layers: root -> zh -> zh-Hans -> zh-Hans-CN
            // More specific locales should override less specific ones
            mockLoader.loadFile = jest.fn().mockResolvedValue({
                default: () => ({
                    "root": {
                        "info": {
                            "a": "b root",
                            "c": "d root",
                            "e": "f root"
                        }
                    },
                    "zh": {
                        "info": {
                            "a": "b zh",      // overrides root
                            "c": "d zh",      // overrides root
                            "g": "h zh"       // new property
                        }
                    },
                    "zh-Hans": {
                        "info": {
                            "a": "b zh-Hans", // overrides zh
                            "d": "d zh-Hans", // overrides zh
                            "i": "j zh-Hans"  // new property
                        }
                    },
                    "zh-Hans-CN": {
                        "info": {
                            "a": "b zh-Hans-CN", // overrides zh-Hans
                            "k": "l zh-Hans-CN"  // new property
                        }
                    }
                })
            });

            const result = await mergedDataCache.loadMergedData("zh-Hans-CN", ["./test/files3"]);

            // Should merge with most specific locale taking priority
            expect(result.info).toEqual({
                "a": "b zh-Hans-CN",  // from zh-Hans-CN (most specific)
                "c": "d zh",           // from zh (zh-Hans-CN doesn't override)
                "d": "d zh-Hans",      // from zh-Hans (zh-Hans-CN doesn't override)
                "e": "f root",         // from root (no locale overrides)
                "g": "h zh",           // from zh (no locale overrides)
                "i": "j zh-Hans",      // from zh-Hans (no locale overrides)
                "k": "l zh-Hans-CN"   // from zh-Hans-CN (new)
            });
        });

        test('should handle locale parameter as Locale object directly', async () => {
            expect.assertions(1);

            mockLoader.loadFile = jest.fn().mockResolvedValue({
                default: () => ({
                    "root": {
                        "info": { "a": "b", "c": "d" }
                    },
                    "en": {
                        "info": { "a": "b en", "c": "d en" }
                    }
                })
            });

            // Test with Locale object directly (no need for dynamic import)
            const result = await mergedDataCache.loadMergedData(new Locale("en-US"), ["./test/files3"]);
            expect(result.info).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should handle multiple roots with override precedence', async () => {
            expect.assertions(1);

            // Mock the MockLoader to return different data for different roots
            mockLoader.loadFile = jest.fn()
                .mockImplementation((path) => {
                    if (path.includes('./test/files3')) {
                        // Primary root (ilib package) - contains base data
                        return Promise.resolve({
                            default: () => ({
                                "root": {
                                    "info": {
                                        "a": "b ilib",
                                        "c": "d ilib",
                                        "e": "f ilib"
                                    }
                                },
                                "en": {
                                    "info": {
                                        "a": "b en ilib",
                                        "c": "d en ilib"
                                    }
                                }
                            })
                        });
                    } else if (path.includes('./test/custom')) {
                        // Secondary root (company customizations) - overrides some data
                        return Promise.resolve({
                            default: () => ({
                                "en": {
                                    "info": {
                                        "a": "b en custom",  // overrides ilib
                                        "x": "y custom"      // new property
                                    }
                                }
                            })
                        });
                    }
                    return Promise.reject(new Error('File not found'));
                });

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3", "./test/custom"]);

            // Should merge with custom root taking precedence over ilib root
            expect(result.info).toEqual({
                "a": "b en custom",  // from custom (overrides ilib)
                "c": "d en ilib",    // from ilib (custom doesn't override)
                "e": "f ilib",       // from ilib (custom doesn't override)
                "x": "y custom"      // from custom (new property)
            });
        });

        describe('merge options', () => {
            test('should handle mostSpecific option', async () => {
                expect.assertions(1);

                // Create a new instance with mostSpecific: true
                const mostSpecificCache = new MergedDataCache(mockLoader, { mostSpecific: true });

                mockLoader.loadFile = jest.fn().mockResolvedValue({
                    default: () => ({
                        "root": {
                            "info": { "a": "b root", "c": "d root" }
                        },
                        "en": {
                            "info": { "a": "b en", "c": "d en" }
                        },
                        "en-US": {
                            "info": { "a": "b en-US", "x": "y en-US" }
                        }
                    })
                });

                const result = await mostSpecificCache.loadMergedData("en-US", ["./test/files3"]);

                // Should only return the most specific locale data (en-US), not merged
                expect(result.info).toEqual({ "a": "b en-US", "x": "y en-US" });
            });

            test('should handle returnOne option', async () => {
                expect.assertions(1);

                // Create a new instance with returnOne: true
                const returnOneCache = new MergedDataCache(mockLoader, { returnOne: true });

                mockLoader.loadFile = jest.fn().mockResolvedValue({
                    default: () => ({
                        "root": {
                            "info": { "a": "b root", "c": "d root" }
                        },
                        "en": {
                            "info": { "a": "b en", "c": "d en" }
                        }
                    })
                });

                const result = await returnOneCache.loadMergedData("en-US", ["./test/files3"]);

                // Should return only the first file found (root), not merged
                expect(result.info).toEqual({ "a": "b root", "c": "d root" });
            });

            test('should handle crossRoots option', async () => {
                expect.assertions(1);

                // Create a new instance with crossRoots: true
                const crossRootsCache = new MergedDataCache(mockLoader, { crossRoots: true });

                // Mock the MockLoader to return different data for different roots
                mockLoader.loadFile = jest.fn()
                    .mockImplementation((path) => {
                        if (path.includes('./test/files3')) {
                            // First root - contains some data
                            return Promise.resolve({
                                default: () => ({
                                    "en": {
                                        "info": { "a": "b first", "c": "d first" }
                                    }
                                })
                            });
                        } else if (path.includes('./test/custom')) {
                            // Second root - contains some data
                            return Promise.resolve({
                                default: () => ({
                                    "en": {
                                        "info": { "a": "b second", "e": "f second" }
                                    }
                                })
                            });
                        }
                        return Promise.reject(new Error('File not found'));
                    });

                const result = await crossRootsCache.loadMergedData("en-US", ["./test/files3", "./test/custom"]);

                // Should merge data across all roots with later roots taking precedence
                expect(result.info).toEqual({
                    "a": "b second",  // from second root (overrides first)
                    "c": "d first",   // from first root (second doesn't override)
                    "e": "f second"   // from second root (new property)
                });
            });

            test('should handle crossRoots: false (default behavior)', async () => {
                expect.assertions(1);

                // Create a new instance with crossRoots: false (explicit)
                const noCrossRootsCache = new MergedDataCache(mockLoader, { crossRoots: false });

                // Mock the MockLoader to return different data for different roots
                mockLoader.loadFile = jest.fn()
                    .mockImplementation((path) => {
                        if (path.includes('./test/files3')) {
                            // First root - contains data
                            return Promise.resolve({
                                default: () => ({
                                    "en": {
                                        "info": { "a": "b first", "c": "d first" }
                                    }
                                })
                            });
                        } else if (path.includes('./test/custom')) {
                            // Second root - contains data but should be ignored
                            return Promise.resolve({
                                default: () => ({
                                    "en": {
                                        "info": { "a": "b second", "e": "f second" }
                                    }
                                })
                            });
                        }
                        return Promise.reject(new Error('File not found'));
                    });

                const result = await noCrossRootsCache.loadMergedData("en-US", ["./test/files3", "./test/custom"]);

                // Should only use data from the first root where it's found
                expect(result.info).toEqual({ "a": "b first", "c": "d first" });
            });

            test('should share cached data between instances with same options', async () => {
                expect.assertions(2);

                // Create two instances with the same options
                const cache1 = new MergedDataCache(mockLoader, { crossRoots: true });
                const cache2 = new MergedDataCache(mockLoader, { crossRoots: true });

                mockLoader.loadFile = jest.fn().mockResolvedValue({
                    default: () => ({
                        "en": {
                            "info": { "a": "b", "c": "d" }
                        }
                    })
                });

                // Load data with first instance
                const result1 = await cache1.loadMergedData("en-US", ["./test/files3"]);
                expect(result1.info).toEqual({ "a": "b", "c": "d" });

                // Clear the mock to ensure it's not called again
                mockLoader.loadFile.mockClear();

                // Load same data with second instance - should use cached data
                const result2 = await cache2.loadMergedData("en-US", ["./test/files3"]);
                expect(result2.info).toEqual({ "a": "b", "c": "d" });

                // Mock should not have been called again since data was cached
                expect(mockLoader.loadFile).not.toHaveBeenCalled();
            });
        });
    });

    describe('loadMergedDataSync', () => {
        test('should return cached data if already available', async () => {
            expect.assertions(1);

            // First ensure data is cached
            mockLoader.loadFile = jest.fn().mockResolvedValue({
                default: () => ({
                    "root": {
                        "info": { "a": "b", "c": "d" }
                    },
                    "en": {
                        "info": { "a": "b en", "c": "d en" }
                    }
                })
            });

            // Load data asynchronously first to cache it
            await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);

            // Now try to load synchronously
            const result = mergedDataCache.loadMergedDataSync("en-US", ["./test/files3"]);
            expect(result.info).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should load and merge data synchronously when not cached', () => {
            expect.assertions(1);

            mockLoader.loadFile = jest.fn().mockImplementation((path, options) => {
                if (options && options.sync) {
                    if (path.endsWith('.js')) {
                        return {
                            default: () => ({
                                "root": {
                                    "info": { "a": "b", "c": "d" }
                                },
                                "en": {
                                    "info": { "a": "b en", "c": "d en" }
                                }
                            })
                        };
                    } else if (path.endsWith('.json')) {
                        return '{"en": {"info": {"a": "b en", "c": "d en"}}}';
                    }
                }
                throw new Error('Sync not supported');
            });

            const result = mergedDataCache.loadMergedDataSync("en-US", ["./test/files3"]);
            expect(result.info).toEqual({ "a": "b en", "c": "d en" });
        });

        test('should return undefined when no data can be loaded synchronously', () => {
            expect.assertions(1);

            mockLoader.loadFile = jest.fn().mockImplementation(() => {
                throw new Error('File not found');
            });

            const result = mergedDataCache.loadMergedDataSync("en-US", ["./test/files3"]);
            expect(result).toBeUndefined();
        });
    });

    describe('hasMergedData', () => {
        test('should return false when no data is cached', () => {
            expect.assertions(1);

            const result = mergedDataCache.hasMergedData("en-US", ["./test/files3"]);
            expect(result).toBe(false);
        });

        test('should return true when data is cached', async () => {
            expect.assertions(2);

            mockLoader.loadFile = jest.fn().mockResolvedValue({
                default: () => ({
                    "root": {
                        "info": { "a": "b", "c": "d" }
                    },
                    "en": {
                        "info": { "a": "b en", "c": "d en" }
                    }
                })
            });

            // Initially no data
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files3"])).toBe(false);

            // Load data to cache it
            await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);

            // Now data should be available
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files3"])).toBe(true);
        });
    });

    describe('clearMergedData', () => {
        test('should clear all cached merged data', async () => {
            expect.assertions(3);

            mockLoader.loadFile = jest.fn().mockResolvedValue({
                default: () => ({
                    "root": {
                        "info": { "a": "b", "c": "d" }
                    },
                    "en": {
                        "info": { "a": "b en", "c": "d en" }
                    }
                })
            });

            // Load data to cache it
            await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files3"])).toBe(true);

            // Clear the cache
            mergedDataCache.clearMergedData();

            // Data should no longer be available
            expect(mergedDataCache.hasMergedData("en-US", ["./test/files3"])).toBe(false);
            expect(mergedDataCache.getMergedDataCount()).toBe(0);
        });
    });

    describe('getMergedDataCount', () => {
        test('should return 0 when no data is cached', () => {
            expect.assertions(1);

            const count = mergedDataCache.getMergedDataCount();
            expect(count).toBe(0);
        });

        test('should return correct count when data is cached', async () => {
            expect.assertions(2);

            mockLoader.loadFile = jest.fn().mockResolvedValue({
                default: () => ({
                    "root": {
                        "info": { "a": "b", "c": "d" }
                    },
                    "en": {
                        "info": { "a": "b en", "c": "d en" }
                    }
                })
            });

            // Initially no data
            expect(mergedDataCache.getMergedDataCount()).toBe(0);

            // Load data to cache it
            await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);

            // Should have one cached entry
            expect(mergedDataCache.getMergedDataCount()).toBe(1);
        });

        test('should handle multiple cached entries', async () => {
            expect.assertions(3);

            mockLoader.loadFile = jest.fn().mockResolvedValue({
                default: () => ({
                    "root": {
                        "info": { "a": "b", "c": "d" }
                    },
                    "en": {
                        "info": { "a": "b en", "c": "d en" }
                    }
                })
            });

            // Load data for multiple locales
            await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);
            await mergedDataCache.loadMergedData("de-DE", ["./test/files3"]);
            await mergedDataCache.loadMergedData("fr-FR", ["./test/files3"]);

            expect(mergedDataCache.getMergedDataCount()).toBe(3);
        });
    });

    describe('edge cases', () => {
        test('should handle empty locale data gracefully', async () => {
            expect.assertions(1);

            mockLoader.loadFile = jest.fn().mockResolvedValue({
                default: () => ({})
            });

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);
            expect(result).toEqual({});
        });

        test('should handle null/undefined locale gracefully', async () => {
            expect.assertions(2);

            await expect(mergedDataCache.loadMergedData(null, ["./test/files3"]))
                .rejects.toThrow();

            await expect(mergedDataCache.loadMergedData(undefined, ["./test/files3"]))
                .rejects.toThrow();
        });

        test('should handle invalid root paths gracefully', async () => {
            expect.assertions(1);

            mockLoader.loadFile = jest.fn().mockRejectedValue(new Error('Invalid path'));

            await expect(mergedDataCache.loadMergedData("en-US", [""]))
                .rejects.toThrow('Invalid path');
        });
    });

    describe('integration with FileCache', () => {
        test('should use FileCache for individual file loading in fallback mode', async () => {
            expect.assertions(2);

            // Mock the MockLoader to fail on .js file but succeed on .json files
            mockLoader.loadFile = jest.fn()
                .mockRejectedValueOnce(new Error('File not found')) // .js file fails
                .mockResolvedValueOnce('{"en": {"info": {"a": "b en", "c": "d en"}}}'); // en.json succeeds

            const result = await mergedDataCache.loadMergedData("en-US", ["./test/files3"]);

            expect(result).toBeDefined();
            expect(mockLoader.loadFile).toHaveBeenCalledTimes(2); // .js then .json
        });
    });
});
