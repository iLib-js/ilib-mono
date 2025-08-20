/*
 * Copyright 2025 JEDLSoft
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

import FileCache from './FileCache.js';
import DataCache from './DataCache.js';
import JSON5 from 'json5';
import { JSUtils } from 'ilib-common';

/**
 * Parse locale data from various formats (function, object, string).
 *
 * @param {*} data - The data to parse. Can be a function, object, or string.
 * @param {string} pathName - The path name of the file being parsed.
 * @returns {Object|undefined} The parsed locale data object, or undefined if parsing failed.
 */
function parseData(data, pathName) {
    let localeData;

    switch (typeof(data)) {
        case 'function':
            localeData = data();
            break;
        case 'object':
            if (typeof(data["default"]) !== 'undefined') {
                localeData = (typeof(data["default"]) === 'function') ? data["default"]() : data["default"];
            } else if (typeof(data.getLocaleData) === 'function') {
                localeData = data.getLocaleData();
            } else {
                // if it is a json file we loaded, then this object
                // IS the data
                if (!pathName.endsWith(".js") && !pathName.endsWith(".mjs")) {
                    localeData = data;
                }
                // else nothing to return
            }
            break;
        case 'string':
            localeData = JSON5.parse(data);
            break;
    }

    return localeData;
}



/**
 * @class MergedDataCache
 *
 * This class handles the merged locale layer for locale data. It provides a higher-level
 * abstraction over FileCache by handling .js files that contain pre-assembled data for
 * multiple locales, parsing the data, merging it across multiple roots, and caching
 * the merged results.
 *
 * The MergedDataCache works in two modes:
 * 1. **Merged mode**: Attempts to load a .js file containing all locale data from
 *    multiple roots, parse it, merge it with later roots taking precedence over earlier
 *    ones, and cache the result for fast subsequent access.
 * 2. **Fallback mode**: If no .js file exists, falls back to loading individual .json
 *    files from multiple roots and merging them manually with proper precedence.
 *
 * **Multiple Roots Support**: This class supports multiple root directories to enable
 * data overrides. For example, one root may contain the data that ilib provides, and
 * another root may contain overriding data that the user's company provides. Later
 * roots in the array take precedence over earlier ones, allowing for customization
 * of locale settings.
 *
 * This layer sits above FileCache and provides the merged data that LocaleData needs
 * without having to know about individual file loading or parsing details.
 */
class MergedDataCache {
    /**
     * Create a new MergedDataCache instance.
     *
     * @param {Object} loader - The loader instance to use for file loading operations.
     * @param {Object} options - Options controlling how data is merged:
     * @param {boolean} options.mostSpecific - When true, only return the most specific locale data.
     *                                         Multiple locale data files are not merged into one.
     *                                         Default: false
     * @param {boolean} options.returnOne - When true, return only the first file found.
     *                                      Do not merge many locale data files into one.
     *                                      Default: false
     * @param {boolean} options.crossRoots - When true, merge data across all roots.
     *                                       When false, only use data from the first root where it's found.
     *                                       Default: false
     */
    constructor(loader, options = {}) {
        this.loader = loader;
        this.dataCache = DataCache.getDataCache();

        // Set merge options with defaults
        this.mostSpecific = options.mostSpecific || false;
        this.returnOne = options.returnOne || false;
        this.crossRoots = options.crossRoots || false;
    }

    /**
     * Private method to merge multiple locale data objects together.
     * Uses the instance's merge preferences stored in this.mostSpecific, this.returnOne, and this.crossRoots.
     *
     * @param {Array} files - Array of file objects with data to merge.
     * @returns {Object} The merged locale data object.
     * @private
     */
    _mergeData(files) {
        if (this.mostSpecific) {
            return files.reduce((previous, current) => {
                return (current && current.data) ? current.data : previous;
            }, {});
        }

        if (this.returnOne) {
            return files.map(file => file.data).find(file => file);
        }

        if (this.crossRoots) {
            // merge all data across all roots
            return files.map(file => file.data).reduce((previous, current) => {
                return JSUtils.merge(previous, current || {});
            }, {});
        }

        // else return the data for each sublocale in the first root in which
        // it is found in and ignore the data in the other roots
        let locales = {};
        let dataToMerge = [];
        files.forEach((file) => {
            if (file.data && !locales[file.locale.getSpec()]) {
                locales[file.locale.getSpec()] = true;
                dataToMerge.push(file.data);
            }
        });

        return dataToMerge.reduce((previous, current) => {
            return JSUtils.merge(previous, current || {});
        }, {});
    }

    /**
     * Load merged locale data asynchronously.
     *
     * This method attempts to load a pre-assembled .js file for the given locale
     * from multiple roots. Later roots take precedence over earlier ones, allowing
     * for data overrides (e.g., company customizations overriding ilib defaults).
     * If successful, it parses the data, merges it across all roots, and caches
     * the result. If no .js file exists, it falls back to loading individual
     * .json files and merging them manually.
     *
     * @param {string|Locale} locale - The locale to load data for. Can be a locale
     *                                 string or Locale object.
     * @param {Array.<string>} roots - Array of root directories to search for locale
     *                                  data files, in order of precedence (later = higher priority).
     * @returns {Promise<Object>} A promise that resolves to the merged locale data
     *                            object, or rejects if no data could be loaded.
     */
    async loadMergedData(locale, roots) {
        // TODO: Implementation
    }

    /**
     * Load merged locale data synchronously.
     *
     * This method works similarly to loadMergedData but operates synchronously.
     * It first checks the cache for already-merged data, and if not found,
     * attempts to load and merge the data synchronously across multiple roots.
     * Later roots take precedence over earlier ones.
     *
     * @param {string|Locale} locale - The locale to load data for. Can be a locale
     *                                 string or Locale object.
     * @param {Array.<string>} roots - Array of root directories to search for locale
     *                                  data files, in order of precedence (later = higher priority).
     * @returns {Object|undefined} The merged locale data object if available,
     *                             undefined if no data could be loaded.
     */
    loadMergedDataSync(locale, roots) {
        // TODO: Implementation
    }

    /**
     * Check if merged data is available in the cache for the given locale.
     *
     * @param {string|Locale} locale - The locale to check for cached data.
     * @param {Array.<string>} roots - Array of root directories where the data was cached.
     * @returns {boolean} True if merged data is available in the cache, false otherwise.
     */
    hasMergedData(locale, roots) {
        // TODO: Implementation
    }

    /**
     * Clear all merged data from the cache.
     */
    clearMergedData() {
        // TODO: Implementation
    }

    /**
     * Get the number of merged data entries currently cached.
     *
     * @returns {number} The number of cached merged data entries.
     */
    getMergedDataCount() {
        // TODO: Implementation
    }
}

export default MergedDataCache;
