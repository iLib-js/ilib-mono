/*
 * MergedDataCache.js - manages parsed locale data and merged locale data caching
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

import ParsedDataCache from './ParsedDataCache.js';
import DataCache from './DataCache.js';
import { JSUtils, Utils } from 'ilib-common';
import Locale from 'ilib-locale';

/**
 * MergedDataCache manages parsed locale data and merged locale data caching.
 *
 * This class operates at two levels:
 * 1. Parsed Data Cache: Uses ParsedDataCache to store parsed data separated by locale and basename
 * 2. Merged Data Cache: Stores the final merged result for a specific locale
 *
 * The parsed data cache allows sharing of common locale data (e.g., "root" and "en"
 * data shared between "en-US" and "en-GB"), while the merged data cache avoids
 * re-merging the same locale data multiple times.
 */
class MergedDataCache {
    /**
     * Create a new MergedDataCache instance
     * @param {Object} loader - The loader instance for file operations
     * @param {Object} options - Configuration options
     * @param {boolean} options.mostSpecific - When true, only return most specific locale data
     * @param {boolean} options.returnOne - When true, return only the data for the most locale-specific file found
     * @param {boolean} options.crossRoots - When true, merge data across all roots
     */
    constructor(loader, options = {}) {
        this.loader = loader;
        this.dataCache = DataCache.getDataCache();
        this.parsedDataCache = new ParsedDataCache(loader);

        // Set merge options with defaults
        this.mostSpecific = options.mostSpecific || false;
        this.returnOne = options.returnOne || false;
        this.crossRoots = options.crossRoots || false;
    }

    /**
     * Load all locale-specific data files for a locale asynchronously and cache the parsed data.
     * This method looks for files named [locale].js or [locale].json in the specified roots,
     * loads and parses them, and caches all the data for future use.
     *
     * The files should contain data structured with sublocales as top-level keys, and basenames
     * as second-level keys. For example:
     * {
     *   "root": { "phonefmt": {...}, "localeinfo": {...} },
     *   "en": { "localeinfo": {...} },
     *   "en-US": { "phonefmt": {...} }
     * }
     *
     * @param {string|Locale} locale - The locale to load data for
     * @param {Array.<string>} roots - Array of root directories to search
     * @returns {Promise<boolean>} Promise that resolves to true if any data was loaded and cached, false otherwise
     */
    async loadLocaleData(locale, roots) {
        // Validate parameters
        if ((typeof locale !== 'string' && typeof locale !== 'object') || locale === undefined || locale === "") {
            throw new Error('Locale parameter is required');
        }
        if (!Array.isArray(roots) || roots.length === 0) {
            throw new Error('Roots parameter must be a non-empty array');
        }

        // Convert string locale to Locale object if needed
        const loc = (typeof locale === 'string') ? new Locale(locale) : locale;
        if (loc !== null && typeof loc.getSpec !== 'function') {
            throw new Error('Invalid locale parameter');
        }

        const localeSpec = loc.getSpec();
        let dataLoaded = false;

        // Only load the exact locale file, not iterate through sublocales
        // This is required by ensureLocale() which should only load [locale].js or [locale].json files
        for (const root of roots) {
            // Try .js files first (multiple extensions)
            const jsExtensions = ['.js', '.cjs', '.mjs'];
            for (const ext of jsExtensions) {
                const jsPath = `${root}/${localeSpec}${ext}`;
                const parsedData = await this.parsedDataCache.loadAndParseFile(jsPath, root);
                if (parsedData) {
                    dataLoaded = true;
                    break; // Found data, move to next root
                }
            }
            
            if (dataLoaded) {
                break; // Found data, move to next root
            }

            // Try .json file as fallback
            const jsonPath = `${root}/${localeSpec}.json`;
            const parsedData = await this.parsedDataCache.loadAndParseFile(jsonPath, root);
            if (parsedData) {
                dataLoaded = true;
                break; // Found data, move to next root
            }
        }

        return dataLoaded;
    }

    /**
     * Load merged locale data asynchronously for a specific basename.
     *
     * @param {string|Locale} locale - The locale to load data for
     * @param {Array.<string>} roots - Array of root directories to search
     * @param {string} basename - The basename of the data to load (e.g., "ResBundle")
     * @returns {Promise<Object>} Promise that resolves to the merged locale data for the specified basename
     */
    async loadMergedData(locale, roots, basename) {
        // Validate parameters
        if ((typeof locale !== 'string' && typeof locale !== 'object') || locale === undefined || locale === "") {
            throw new Error('Locale parameter is required');
        }
        if (!Array.isArray(roots) || roots.length === 0) {
            throw new Error('Roots parameter must be a non-empty array');
        }

        // Convert string locale to Locale object if needed
        const loc = (typeof locale === 'string') ? new Locale(locale) : locale;
        if (loc !== null && typeof loc.getSpec !== 'function') {
            throw new Error('Invalid locale parameter');
        }

        // Create cache key for merged data
        const mergedCacheKey = this._createMergedCacheKey(loc, roots, basename);

        // First check: if merged data is already cached, return it
        const cachedMergedData = this.dataCache.getFileData(mergedCacheKey);
        if (cachedMergedData) {
            return cachedMergedData;
        }

        // Get parsed data from ParsedDataCache by iterating through all locales
        // ParsedDataCache now only loads data for specific locales, so we need to iterate
        const localeSpec = loc === null ? 'root' : loc.getSpec();
        const sublocales = Utils.getSublocales(localeSpec);
        
        // Load data for each locale (including parent locales)
        for (const sublocale of sublocales) {
            const sublocaleObj = sublocale === 'root' ? null : new Locale(sublocale);
            await this.parsedDataCache.getParsedData(sublocaleObj, roots, basename);
        }

        // Second check: another caller might have merged while we awaited
        const cachedMergedDataAgain = this.dataCache.getFileData(mergedCacheKey);
        if (cachedMergedDataAgain) {
            return cachedMergedDataAgain;
        }


        // No merged data in the cache, so that means we're the first to get to this code, so we should do the merge
        const mergedData = this._mergeParsedData(loc, basename, roots);

        // Only cache the merged result if it's not undefined
        if (mergedData !== undefined) {
            this.dataCache.setFileData(mergedCacheKey, mergedData);
        }

        return mergedData;
    }

    /**
     * Load all locale-specific data files for a locale synchronously and cache the parsed data.
     * This method looks for files named [locale].js or [locale].json in the specified roots,
     * loads and parses them, and caches all the data for future use.
     *
     * Note: This method can only load CommonJS modules and JSON files synchronously.
     * ESM modules cannot be loaded synchronously and will be skipped.
     *
     * @param {string|Locale} locale - The locale to load data for
     * @param {Array.<string>} roots - Array of root directories to search
     * @returns {boolean} true if any data was loaded and cached, false otherwise
     */
    loadLocaleDataSync(locale, roots) {
        // Validate parameters
        if ((typeof locale !== 'string' && typeof locale !== 'object') || locale === undefined || locale === "") {
            throw new Error('Locale parameter is required');
        }
        if (!Array.isArray(roots) || roots.length === 0) {
            throw new Error('Roots parameter must be a non-empty array');
        }

        // Convert string locale to Locale object if needed
        const loc = (typeof locale === 'string') ? new Locale(locale) : locale;
        if (loc !== null && typeof loc.getSpec !== 'function') {
            throw new Error('Invalid locale parameter');
        }

        const localeSpec = loc.getSpec();
        let dataLoaded = false;

        // Only load the exact locale file, not iterate through sublocales
        // This is required by ensureLocale() which should only load [locale].js or [locale].json files
        for (const root of roots) {
            // Try .js files first (only CommonJS modules in sync mode)
            const jsExtensions = ['.js', '.cjs'];
            for (const ext of jsExtensions) {
                const jsPath = `${root}/${localeSpec}${ext}`;
                const parsedData = this.parsedDataCache.loadAndParseFileSync(jsPath, root);
                if (parsedData) {
                    dataLoaded = true;
                    break; // Found data, move to next root
                }
            }
            
            if (dataLoaded) {
                break; // Found data, move to next root
            }

            // Try .json file as fallback
            const jsonPath = `${root}/${localeSpec}.json`;
            const parsedData = this.parsedDataCache.loadAndParseFileSync(jsonPath, root);
            if (parsedData) {
                dataLoaded = true;
                break; // Found data, move to next root
            }
        }

        return dataLoaded;
    }

    /**
     * Load merged locale data synchronously for a specific basename.
     *
     * @param {string|Locale} locale - The locale to load data for
     * @param {Array.<string>} roots - Array of root directories to search
     * @param {string} basename - The basename of the data to load
     * @returns {Object|undefined} The merged locale data if available, undefined if not
     */
    loadMergedDataSync(locale, roots, basename) {
        // Validate parameters
        if (typeof locale !== 'string' && typeof locale !== 'object') {
            return undefined;
        }
        if (!Array.isArray(roots) || roots.length === 0) {
            return undefined;
        }

        // Convert string locale to Locale object if needed
        const loc = (typeof locale === 'string') ? new Locale(locale) : locale;
        if (loc !== null && typeof loc.getSpec !== 'function') {
            return undefined;
        }

        // Create cache key for merged data
        const mergedCacheKey = this._createMergedCacheKey(loc, roots, basename);
        const cachedMergedData = this.dataCache.getFileData(mergedCacheKey);
        if (cachedMergedData) {
            return cachedMergedData;
        }

        // Get parsed data from ParsedDataCache by iterating through all locales
        // ParsedDataCache now only loads data for specific locales, so we need to iterate
        const localeSpec = loc === null ? 'root' : loc.getSpec();
        const sublocales = Utils.getSublocales(localeSpec);
        
        // Load data for each locale (including parent locales)
        for (const sublocale of sublocales) {
            const sublocaleObj = sublocale === 'root' ? null : new Locale(sublocale);
            this.parsedDataCache.getParsedDataSync(sublocaleObj, roots, basename);
        }

        // Merge the parsed data
        const mergedData = this._mergeParsedData(loc, basename, roots);

        // Only cache the merged result if it's not undefined
        if (mergedData !== undefined) {
            this.dataCache.setFileData(mergedCacheKey, mergedData);
        }

        return mergedData;
    }

    /**
     * Check if merged data is available for a locale
     * @param {string|Locale} locale - The locale to check
     * @param {Array.<string>} roots - Array of root directories
     * @param {string} basename - The basename of the data
     * @returns {boolean} True if merged data is cached
     */
    hasMergedData(locale, roots, basename) {
        // Validate parameters
        if (!locale) {
            return false;
        }
        if (!Array.isArray(roots) || roots.length === 0) {
            return false;
        }

        // Convert string locale to Locale object if needed
        const loc = (typeof locale === 'string') ? new Locale(locale) : locale;
        if (typeof loc.getSpec !== 'function') {
            return false;
        }

        // Create cache key and check if data exists
        const mergedCacheKey = this._createMergedCacheKey(loc, roots, basename);
        return this.dataCache.getFileData(mergedCacheKey) !== undefined;
    }

    /**
     * Clear all cached data (both merged and parsed data)
     */
    clearMergedData() {
        this.dataCache.clearFileCache();
        this.parsedDataCache.clearAllParsedData();
    }

    /**
     * Check if data is available for a locale and basename in the specified roots
     * @param {string|Locale} locale - The locale to check
     * @param {Array.<string>} roots - Array of root directories
     * @param {string} basename - The basename to check
     * @returns {boolean} True if data is available for the locale and basename, false otherwise
     */
    hasLocaleData(locale, roots, basename) {
        // Validate parameters
        if (!locale) {
            return false;
        }
        if (!Array.isArray(roots) || roots.length === 0) {
            return false;
        }
        if (!basename) {
            return false;
        }

        // Convert string locale to Locale object if needed
        const loc = (typeof locale === 'string') ? new Locale(locale) : locale;
        if (typeof loc.getSpec !== 'function') {
            return false;
        }

        // Check if data exists for this locale and basename in any of the roots
        for (const root of roots) {
            if (this.parsedDataCache.hasParsedData(root, basename, loc.getSpec())) {
                return true;
            }
            // Also check for root locale data
            if (this.parsedDataCache.hasParsedData(root, basename, null)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get the count of cached merged data entries
     * @returns {number} The number of cached entries
     */
    getMergedDataCount() {
        // Count only merged data entries (keys starting with "merged:")
        let count = 0;
        for (const [key] of this.dataCache.fileData) {
            if (key.startsWith('merged:')) {
                count++;
            }
        }
        return count;
    }

    /**
     * Store pre-populated data in the cache. The data should have the structure:
     * {
     *   "locale": {
     *     "basename": {
     *       [ ... whatever data ... ]
     *     }
     *   }
     * }
     *
     * This method defers to ParsedDataCache for data interpretation and storage.
     * No merging is performed - that will happen later when loadMergedData is called.
     *
     * @param {Object} data - The locale data in the above format
     * @param {string} root - The root from which this data was loaded
     */
    storeData(data, root) {
        if (typeof(data) !== 'object' || !data) {
            return;
        }

        this.parsedDataCache.storeData(data, root);
        return;
    }

    /**
     * Get cached merged data for a locale
     * @param {string|Locale} locale - The locale to get data for
     * @param {Array.<string>} roots - Array of root directories
     * @param {string} basename - The basename of the data
     * @returns {Object|undefined} The cached merged data, or undefined if not cached
     */
    getCachedData(locale, roots, basename) {
        // Validate parameters
        if (typeof locale === 'undefined' || (typeof locale === 'string' && locale === '')) {
            return undefined;
        }
        if (!Array.isArray(roots) || roots.length === 0) {
            return undefined;
        }

        // Convert string locale to Locale object if needed
        const loc = (typeof locale === 'string') ? new Locale(locale) : locale;
        if (loc !== null && typeof loc.getSpec !== 'function') {
            return undefined;
        }

        // Create cache key and check if merged data exists
        const mergedCacheKey = this._createMergedCacheKey(loc, roots, basename);
        return this.dataCache.getFileData(mergedCacheKey);
    }






    /**
     * Merge parsed data according to merge preferences
     * @private
     */
    _mergeParsedData(locale, basename, roots = ["./locale"]) {
        const files = [];

        const subLocales = locale === null || locale.getSpec() === 'root' ? ['root'] : ['root', ...Utils.getSublocales(locale.getSpec())];

        // Build list of files to merge based on merge preferences
        if (this.crossRoots) {
            // Merge across all roots
            for (const sublocale of subLocales) {
                for (const root of roots) {
                    const localeObj = sublocale === 'root' ? null : new Locale(sublocale);
                    const data = this.parsedDataCache.getCachedData(root, basename, localeObj);
                    if (data !== undefined) {
                        files.push({
                            data,
                            locale: new Locale(sublocale),
                            root: root
                        });
                    }
                }
            }
        } else {
            // Only use first root where data is found
            for (const sublocale of subLocales) {
                for (const root of roots) {
                    const localeObj = sublocale === 'root' ? null : new Locale(sublocale);
                    const data = this.parsedDataCache.getCachedData(root, basename, localeObj);
                    if (data !== undefined) {
                        files.push({
                            data,
                            locale: new Locale(sublocale),
                            root: root
                        });
                        break; // Only use first root for this sublocale
                    }
                }
            }
        }

        // If no files were found, return undefined
        if (files.length === 0) {
            return undefined;
        }

        // Apply merge strategy based on preferences
        if (this.mostSpecific) {
            const result = files.reduce((previous, current) => {
                return (current && current.data !== null) ? current.data : previous;
            }, {});
            return result;
        }

        if (this.returnOne) {
            // reverse the list so that the most specific locale data is found first
            const found = files.map(file => file.data).reverse().find(file => file !== null);
            return found || {};
        }

        // Default: merge all data in sublocale order
        const result = files.map(file => file.data || {}).reduce((previous, current) => {
            return JSUtils.merge(previous, current);
        }, {});
        return result;
    }


    /**
     * Create cache key for merged data
     * @private
     */
    _createMergedCacheKey(locale, roots, basename) {
        const localeSpec = locale === null ? 'root' : locale.getSpec();
        const optionsHash = `${this.mostSpecific ? '1' : '0'}:${this.returnOne ? '1' : '0'}:${this.crossRoots ? '1' : '0'}`;
        const rootsHash = roots.join('|');
        return `merged:${localeSpec}:${basename}:${rootsHash}:${optionsHash}`;
    }
}

export default MergedDataCache;
