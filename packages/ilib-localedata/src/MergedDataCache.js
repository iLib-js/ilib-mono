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
     * @param {boolean} options.returnOne - When true, return only first file found
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
     * Load merged locale data asynchronously
     * @param {string|Locale} locale - The locale to load data for
     * @param {Array.<string>} roots - Array of root directories to search
     * @param {string} basename - The basename of the data to load (e.g., "ResBundle")
     * @returns {Promise<Object>} Promise that resolves to the merged locale data
     */
    async loadMergedData(locale, roots, basename) {
        // Validate parameters
        if (!locale) {
            throw new Error('Locale parameter is required');
        }
        if (!Array.isArray(roots) || roots.length === 0) {
            throw new Error('Roots parameter must be a non-empty array');
        }

        // Convert string locale to Locale object if needed
        const loc = (typeof locale === 'string') ? new Locale(locale) : locale;
        if (typeof loc.getSpec !== 'function') {
            throw new Error('Invalid locale parameter');
        }

        // Create cache key for merged data
        const mergedCacheKey = this._createMergedCacheKey(loc, roots, basename);

        // Check if we already have cached merged data
        const cachedMergedData = this.dataCache.getFileData(mergedCacheKey);
        if (cachedMergedData) {
            // Return cached data directly
            return cachedMergedData;
        }

        // Check if we already have a cached promise for this request
        const cachedPromise = this.dataCache.getFilePromise(mergedCacheKey);
        if (cachedPromise) {
            // Await the existing promise and return its result
            return await cachedPromise;
        }

        // Create a promise for this loading operation and cache it permanently
        const loadPromise = this._loadMergedDataInternal(loc, roots, basename, mergedCacheKey);
        this.dataCache.setFilePromise(mergedCacheKey, loadPromise);

        // Await the promise and return its result
        return await loadPromise;
    }

    /**
     * Load merged locale data synchronously.
     *
     * If the data is loaded successfully, it will be cached. This method will
     * check the cache for the data and return it if it is found. If not, it will
     * load the data synchronously and cache it before returning it.
     *
     * @param {string|Locale} locale - The locale to load data for
     * @param {Array.<string>} roots - Array of root directories to search
     * @param {string} basename - The basename of the data to load
     * @returns {Object|undefined} The merged locale data if available, undefined if not
     */
    loadMergedDataSync(locale, roots, basename) {
        // Validate parameters
        if (!locale) {
            return undefined;
        }
        if (!Array.isArray(roots) || roots.length === 0) {
            return undefined;
        }

        // Convert string locale to Locale object if needed
        const loc = (typeof locale === 'string') ? new Locale(locale) : locale;
        if (typeof loc.getSpec !== 'function') {
            return undefined;
        }

        // Create cache key and check if merged data exists
        const mergedCacheKey = this._createMergedCacheKey(loc, roots, basename);
        const cachedMergedData = this.dataCache.getFileData(mergedCacheKey);
        if (cachedMergedData) {
            // Return cached data directly
            return cachedMergedData;
        }

        // If not cached, load the data synchronously
        try {
            return this._loadMergedDataSyncInternal(loc, roots, basename, mergedCacheKey);
        } catch (error) {
            // If synchronous loading fails, return undefined
            return undefined;
        }
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
        if (this.dataCache.getFileData(mergedCacheKey) !== undefined) {
            return true;
        }

        // If no merged data is cached, check if parsed data exists for this basename
        // This handles the case where ensureLocale loaded a JS file with multiple basenames
        const subLocales = this._getSublocales(loc);
        for (const root of roots) {
            for (const sublocale of subLocales) {
                const localeObj = sublocale === 'root' ? null : new Locale(sublocale);
                const data = this.dataCache.getData(root, basename, localeObj);
                if (data !== undefined) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Clear all cached merged data
     */
    clearMergedData() {
        this.dataCache.clearFileCache();
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
     * Internal method to load and merge locale data
     * @private
     */
    async _loadMergedDataInternal(loc, roots, basename, mergedCacheKey) {
        // Get the list of sublocales for this locale
        const subLocales = this._getSublocales(loc);

        // Try to load from .js files first (pre-assembled data)
        let jsDataFound = false;
        for (let i = 0; i < roots.length; i++) {
            const root = roots[i];
            try {
                const parsedData = await this.parsedDataCache.getParsedData(loc, [root], basename);
                // Parse and store the data, but don't return immediately
                // We need to collect data from all roots before merging
                if (parsedData) {
                    jsDataFound = true;
                }
            } catch (error) {
                // Continue to next root or fallback to .json files
            }
        }

        // If we found .js data, merge it and return
        if (jsDataFound) {
            // Store null for any sublocales that don't have data
            this._storeNullForMissingSublocales(subLocales, roots, basename);

            const mergedData = this._mergeParsedData(subLocales, basename, roots);

            // Store the merged result for the requested locale
            this.dataCache.setFileData(mergedCacheKey, mergedData);

            // Return the merged data directly
            return mergedData;
        }

        // Fallback to loading individual .json files
        // Use ParsedDataCache to get the data for the requested locale and basename
        const parsedData = await this.parsedDataCache.getParsedData(loc, roots, basename);
        if (parsedData) {
            // Store null for any sublocales that don't have data
            this._storeNullForMissingSublocales(subLocales, roots, basename);

            // Merge the data using the instance's merge preferences
            const mergedData = this._mergeParsedData(subLocales, basename, roots);

            // Cache the merged result
            this.dataCache.setFileData(mergedCacheKey, mergedData);

            // Return the merged data directly
            return mergedData;
        }

        // Store null for any sublocales that don't have data
        this._storeNullForMissingSublocales(subLocales, roots, basename);

        // Merge the data using the instance's merge preferences
        const mergedData = this._mergeParsedData(subLocales, basename, roots);

        // Cache the merged result
        this.dataCache.setFileData(mergedCacheKey, mergedData);

        // Return the merged data directly
        return mergedData;
    }

    /**
     * Internal method to load and merge locale data synchronously
     * @private
     */
    _loadMergedDataSyncInternal(loc, roots, basename, mergedCacheKey) {
        // Get the list of sublocales for this locale
        const subLocales = this._getSublocales(loc);

        // Try to load from .js files first (pre-assembled data)
        let jsDataFound = false;
        for (let i = 0; i < roots.length; i++) {
            const root = roots[i];
            try {
                const parsedData = this.parsedDataCache.getParsedDataSync(loc, [root], basename);
                // Parse and store the data, but don't return immediately
                // We need to collect data from all roots before merging
                if (parsedData) {
                    jsDataFound = true;
                }
            } catch (error) {
                // Continue to next root or fallback to .json files
            }
        }

        // If we found .js data, merge it and return
        if (jsDataFound) {
            // Store null for any sublocales that don't have data
            this._storeNullForMissingSublocales(subLocales, roots, basename);

            const mergedData = this._mergeParsedData(subLocales, basename, roots);

            // Store the merged result for the requested locale
            this.dataCache.setFileData(mergedCacheKey, mergedData);

            // Return the merged data directly
            return mergedData;
        }

        // Fallback to loading individual .json files
        // Use ParsedDataCache to get the data for the requested locale and basename
        let parsedData = this.parsedDataCache.getParsedDataSync(loc, roots, basename);

        // Store null for any sublocales that don't have data
        this._storeNullForMissingSublocales(subLocales, roots, basename);

        // Check if any data was loaded
        if (!parsedData) {
            // Check if we have at least root data available from previous operations
            const hasRootData = this._checkForRootData(roots, basename);
            if (!hasRootData) {
                throw new Error(`No locale data found for locale ${loc.getSpec()}`);
            }
        }

        // Merge the data using the instance's merge preferences
        const mergedData = this._mergeParsedData(subLocales, basename, roots);

        // Store the merged result for the requested locale
        this.dataCache.setFileData(mergedCacheKey, mergedData);

        // Return the merged data directly
        return mergedData;
    }



    /**
     * Parse and cache pre-assembled data
     * @private
     */
    _parseAndCachePreassembledData(jsData, jsPath, root) {
        if (jsData) {
            // Store parsed data in the parsed data cache for all basenames
            this.parsedDataCache.storeData(jsData, root);
            return jsData;
        }
        return null;
    }

    /**
     * Store parsed data in the parsed data cache
     * @private
     */
    _storeParsedData(parsedData, root) {
        // The parsed data contains multiple locales (e.g., root, en, en-US)
        // Store each locale's data separately in the parsed data cache
        for (const [localeSpec, localeData] of Object.entries(parsedData)) {
            if (localeData && typeof localeData === 'object') {
                // Store each basename separately
                for (const [basenameKey, basenameData] of Object.entries(localeData)) {
                    const localeObj = localeSpec === 'root' ? null : new Locale(localeSpec);
                    this.parsedDataCache.storeParsedData(root, basenameKey, localeObj, basenameData);
                }
            }
        }
    }

    /**
     * Merge parsed data according to merge preferences
     * @private
     */
    _mergeParsedData(subLocales, basename, roots = ["./locale"]) {
        const files = [];

        // Build list of files to merge based on merge preferences
        if (this.crossRoots) {
            // Merge across all roots
            for (const sublocale of subLocales) {
                for (const root of roots) {
                    const localeObj = sublocale === 'root' ? null : new Locale(sublocale);
                    const data = this.dataCache.getData(root, basename, localeObj);
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
                    const data = this.dataCache.getData(root, basename, localeObj);
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

        // Apply merge strategy based on preferences
        if (this.mostSpecific) {
            const result = files.reduce((previous, current) => {
                return (current && current.data !== null) ? current.data : previous;
            }, {});
            return result;
        }

        if (this.returnOne) {
            const found = files.map(file => file.data).find(file => file !== null);
            return found || {};
        }

        // Default: merge all data in sublocale order
        const result = files.map(file => file.data || {}).reduce((previous, current) => {
            return JSUtils.merge(previous, current);
        }, {});
        return result;
    }

    /**
     * Store null for any sublocales that don't have data
     * @private
     */
    _storeNullForMissingSublocales(subLocales, roots, basename) {
        for (const sublocale of subLocales) {
            let hasData = false;
            for (const root of roots) {
                const localeObj = sublocale === 'root' ? null : new Locale(sublocale);
                const data = this.dataCache.getData(root, basename, localeObj);
                if (data !== undefined) {
                    hasData = true;
                    break;
                }
            }
            if (!hasData) {
                // Store null for this sublocale if no data was found
                for (const root of roots) {
                    const localeObj = sublocale === 'root' ? null : new Locale(sublocale);
                    this.dataCache.storeData(root, basename, localeObj, null);
                }
            }
        }
    }

    /**
     * Check if root data is available for a basename in any of the roots
     * @private
     */
    _checkForRootData(roots, basename) {
        for (const root of roots) {
            const rootData = this.dataCache.getData(root, basename, null);
            if (rootData !== undefined) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get sublocales for a locale (e.g., "en-US" -> ["root", "en", "en-US"])
     * @private
     */
    _getSublocales(locale) {
        const sublocales = ["root"];
        const spec = locale.getSpec();

        if (spec === "root") {
            return sublocales;
        }

        // Add language part
        const language = locale.getLanguage();
        if (language && language !== "root") {
            sublocales.push(language);
        }

        // Add full locale spec if different from language
        if (spec !== language) {
            sublocales.push(spec);
        }

        return sublocales;
    }

    /**
     * Create cache key for merged data
     * @private
     */
    _createMergedCacheKey(locale, roots, basename) {
        const localeSpec = locale.getSpec();
        const rootsHash = roots.join('|');
        return `merged:${localeSpec}:${basename}:${rootsHash}`;
    }

    /**
     * Cache merged data for all basenames found in JS files
     * @private
     *
     * @param {Array.<string>} subLocales - Array of sublocale identifiers
     * @param {Array.<string>} roots - Array of root directories
     */
    _cacheAllBasenamesFromJsFiles(subLocales, roots) {
        // Get all basenames that have been cached in ParsedDataCache
        const allBasenames = new Set();

        for (const root of roots) {
            for (const sublocale of subLocales) {
                // Get all basenames for this root and sublocale
                const basenames = this.dataCache.getBasenamesForLocale(root, sublocale);
                if (basenames) {
                    basenames.forEach(basename => allBasenames.add(basename));
                }
            }
        }

        // Cache merged data for each basename
        for (const basename of allBasenames) {
            const mergedData = this._mergeParsedData(subLocales, basename, roots);
            if (mergedData && Object.keys(mergedData).length > 0) {
                // Create cache key for this basename
                const cacheKey = this._createMergedCacheKeyForBasename(subLocales, roots, basename);
                this.dataCache.setFileData(cacheKey, mergedData);
            }
        }
    }

    /**
     * Create cache key for merged data for a specific basename
     * @private
     *
     * @param {Array.<string>} subLocales - Array of sublocale identifiers
     * @param {Array.<string>} roots - Array of root directories
     * @param {string} basename - The basename
     * @returns {string} The cache key
     */
    _createMergedCacheKeyForBasename(subLocales, roots, basename) {
        const rootsHash = JSUtils.hashCode(roots.join(','));
        return `merged:${subLocales.join(',')}:${basename}:${rootsHash}`;
    }
}

export default MergedDataCache;
