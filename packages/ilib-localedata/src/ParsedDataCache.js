/*
 * ParsedDataCache.js - Cache for parsed locale data
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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import DataCache from './DataCache.js';
import FileCache from './FileCache.js';
import JSON5 from 'json5';
import { JSUtils, Utils, Path } from 'ilib-common';
import Locale from 'ilib-locale';

/**
 * Parse raw data from files into structured locale data
 * @private
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
                // For JS files, the object IS the data
                // For JSON files, the object IS also the data
                localeData = data;
            }
            break;
        case 'string':
            localeData = JSON5.parse(data);
            break;
    }

    return localeData;
}

/**
 * ParsedDataCache manages parsed locale data caching.
 * 
 * This class operates at the parsed data level, caching parsed data separated by locale and basename.
 * It uses FileCache to ensure shared promises for file loading, preventing race conditions.
 */
class ParsedDataCache {
    /**
     * Create a new ParsedDataCache instance
     * @param {Object} loader - The loader instance for file operations
     */
    constructor(loader) {
        this.loader = loader;
        this.fileCache = new FileCache(loader);
        this.dataCache = DataCache.getDataCache();
    }

    /**
     * Get parsed data for a locale and basename, loading and parsing files if necessary
     * 
     * @param {string|Locale} locale - The locale to get data for
     * @param {Array.<string>} roots - Array of root directories to search
     * @param {string} basename - The basename of the data to load
     * @returns {Promise<Object|undefined>} Promise that resolves to the parsed data, or undefined if not found
     */
    async getParsedData(locale, roots, basename) {
        
        // Validate parameters
        if (!locale || !Array.isArray(roots) || roots.length === 0 || !basename) {
            return undefined;
        }

        // Convert string locale to Locale object if needed
        const loc = (typeof locale === 'string') ? new Locale(locale) : locale;
        if (typeof loc.getSpec !== 'function') {
            return undefined;
        }


        // First check if we already have the data cached
        const cachedData = this._getCachedDataForLocale(loc, roots, basename);
        if (cachedData) {
            return cachedData;
        }


        // If not cached, try to load from .js files first
        const jsData = await this._loadFromJsFiles(loc, roots, basename);
        if (jsData) {
            return jsData;
        }


        // Fallback to loading from individual .json files
        const jsonData = await this._loadFromJsonFiles(loc, roots, basename);
        if (jsonData) {
            return jsonData;
        }

        return undefined;
    }

    /**
     * Get parsed data for a locale and basename synchronously
     * 
     * @param {string|Locale} locale - The locale to get data for
     * @param {Array.<string>} roots - Array of root directories to search
     * @param {string} basename - The basename of the data to load
     * @returns {Object|undefined} The parsed data, or undefined if not found
     */
    getParsedDataSync(locale, roots, basename) {
        // Validate parameters
        if (!locale || !Array.isArray(roots) || roots.length === 0 || !basename) {
            return undefined;
        }

        // Convert string locale to Locale object if needed
        const loc = (typeof locale === 'string') ? new Locale(locale) : locale;
        if (typeof loc.getSpec !== 'function') {
            return undefined;
        }

        // First check if we already have the data cached
        const cachedData = this._getCachedDataForLocale(loc, roots, basename);
        if (cachedData) {
            return cachedData;
        }

        // If not cached, try to load from .js files first
        const jsData = this._loadFromJsFilesSync(loc, roots, basename);
        if (jsData) {
            return jsData;
        }

        // Fallback to loading from individual .json files
        return this._loadFromJsonFilesSync(loc, roots, basename);
    }

    /**
     * Common method to parse and cache .js file data
     * @private
     * 
     * @param {string} rawData - The raw file content
     * @param {string} filePath - The path to the file
     * @param {string} root - The root directory for this data
     * @returns {Object|undefined} The parsed data object, or undefined if parsing failed
     */
    _parseAndCacheJsFile(rawData, filePath, root) {
        try {
            const parsedData = parseData(rawData, filePath);
            if (parsedData) {
                // Store each locale's data separately in the parsed data cache
                // For JS files, always store all basenames to avoid re-parsing later
                for (const [localeSpec, localeData] of Object.entries(parsedData)) {
                    if (localeData && typeof localeData === 'object') {
                        // Store each basename separately
                        for (const [basenameKey, basenameData] of Object.entries(localeData)) {
                            // Use string-based locale identifiers instead of Locale objects
                            // Always use "root" as the string key, never null
                            this.dataCache.storeData(root, basenameKey, localeSpec, basenameData);
                        }
                    }
                }
                
                return parsedData;
            }
        } catch (error) {
            // Parsing failed
        }
        return undefined;
    }

    /**
     * Common method to parse and cache .json file data
     * @private
     * 
     * @param {string} rawData - The raw file content
     * @param {string} filePath - The path to the file
     * @param {string} root - The root directory for this data
     * @returns {Object|undefined} The parsed data object, or undefined if parsing failed
     */
    _parseAndCacheJsonFile(rawData, filePath, root) {
        try {
            const parsedData = parseData(rawData, filePath);
            if (parsedData) {
                // Store each locale's data separately in the parsed data cache
                // For JSON files, always store all basenames to avoid re-parsing later
                for (const [localeSpec, localeData] of Object.entries(parsedData)) {
                    if (localeData && typeof localeData === 'object') {
                        // Store each basename separately
                        for (const [basenameKey, basenameData] of Object.entries(localeData)) {
                            // Use string-based locale identifiers instead of Locale objects
                            // Always use "root" as the string key, never null
                            const localeKey = localeSpec === 'root' ? 'root' : localeSpec;

                            this.dataCache.storeData(root, basenameKey, localeKey, basenameData);
                        }
                    }
                }
                return parsedData;
            }
        } catch (error) {
            // Parsing failed
        }
        return undefined;
    }

    /**
     * Parse and cache hierarchical JSON file data
     * @private
     * 
     * @param {string} rawData - The raw file content
     * @param {string} filePath - The path to the file
     * @param {string} root - The root directory for this data
     * @param {string} basename - The basename for this data
     * @param {string} locFile - The relative path from root (e.g., "en/US/merge.json")
     * @returns {Object|undefined} The parsed data object, or undefined if parsing failed
     */
    _parseAndCacheHierarchicalJsonFile(rawData, filePath, root, basename, locFile) {
        const dirPath = Path.dirname(locFile);
        const hierarchicalLocale = (dirPath === '.') ? 'root' : dirPath.replace(/\//g, '-');            
        try {
            const parsedData = parseData(rawData, filePath) ?? null;
            this.dataCache.storeData(root, basename, hierarchicalLocale, parsedData);
            return parsedData;
        } catch (error) {
            // Parsing failed so store null to indicate we checked
            this.dataCache.storeData(root, basename, hierarchicalLocale, null);
        }
        return undefined;
    }

    /**
     * Parse and store unparsed data in memory as if it came from a .js file
     * 
     * @param {Object|string|function} unparsedData - The unparsed data to process
     * @param {string} root - The root directory for this data
     * @returns {Object|undefined} The parsed data object, or undefined if parsing failed
     */
    storeData(unparsedData, root) {
        return this._parseAndCacheJsFile(unparsedData, "memory.js", root);
    }

    /**
     * Check if we already have cached data for a locale and basename
     * @private
     * 
     * @param {Locale} locale - The locale object
     * @param {Array.<string>} roots - Array of root directories
     * @param {string} basename - The basename to check
     * @returns {Object|undefined} The cached data if found, undefined otherwise
     */
    _getCachedDataForLocale(locale, roots, basename) {
        // Check if we have data for this exact locale and basename in any root
        for (const root of roots) {
            // Map null locale requests to "root" cache key
            const localeKey = (locale === null || !locale.getSpec()) ? 'root' : locale.getSpec();
            const data = this.dataCache.getData(root, basename, localeKey);
            // Return the data if found, but skip null values (which indicate "tried to load but found nothing")
            if (data) {
                return data;
            }
        }
        return undefined;
    }

    /**
     * Determine the appropriate file extension to try for JS files based on package.json
     * @private
     * 
     * @param {string} root - The root directory
     * @returns {Array.<string>} Array of file extensions to try in order
     */
    _getJsFileExtensions(root) {
        try {
            // Check if there's a package.json in the root
            const packageJsonPath = `${root}/package.json`;
            const packageJson = this.fileCache.loadFileSync(packageJsonPath);
            if (packageJson) {
                const pkg = JSON.parse(packageJson);
                if (pkg.type === 'module') {
                    // If package.json says "type": "module", .js files are ESM and can't be loaded sync
                    // Try .cjs first (CommonJS), then .js (ESM for async only)
                    return ['.cjs', '.js'];
                } else {
                    // If package.json says "type": "commonjs" or no type, .js files are CommonJS
                    // Try .js first, then .cjs
                    return ['.js', '.cjs'];
                }
            }
        } catch (error) {
            // If we can't read package.json, assume .js files are CommonJS
        }
        // Default: assume .js files are CommonJS
        return ['.js', '.cjs'];
    }

    /**
     * Load data from .js files for a locale and basename
     * @private
     * 
     * @param {Locale} locale - The locale object
     * @param {Array.<string>} roots - Array of root directories
     * @param {string} basename - The basename to load
     * @returns {Promise<Object|undefined>} Promise that resolves to the parsed data, or undefined if not found
     */
    async _loadFromJsFiles(locale, roots, basename) {
        // Try to load from .js files in each root
        for (const root of roots) {
            const extensions = this._getJsFileExtensions(root);
            
            // First try to load the specific locale file
            for (const ext of extensions) {
                try {
                    const jsPath = `${root}/${locale.getSpec()}${ext}`;
                    const rawData = await this.fileCache.loadFile(jsPath);
                    if (rawData) {
                        const parsedData = this._parseAndCacheJsFile(rawData, jsPath, root);
                        
                        if (parsedData) {
                            // Return the data for the specific basename and locale
                            const extractedData = this._extractBasenameData(parsedData, basename, locale);
                            
                            if (extractedData) {
                                return extractedData;
                            }
                        }
                    }
                } catch (error) {
                    // Continue to next extension
                    continue;
                }
            }
            // File doesn't exist with any of the extensions, so store null to indicate we checked
            this.dataCache.storeData(root, basename, locale.getSpec(), null);
        }
        return undefined;
    }

    /**
     * Load data from .js files for a locale and basename synchronously
     * @private
     * 
     * @param {Locale} locale - The locale object
     * @param {Array.<string>} roots - Array of root directories
     * @param {string} basename - The basename to load
     * @returns {Object|undefined} The parsed data, or undefined if not found
     */
    _loadFromJsFilesSync(locale, roots, basename) {
        // Try to load from .js files in each root
        for (const root of roots) {
            const extensions = this._getJsFileExtensions(root);
            for (const ext of extensions) {
                try {
                    const jsPath = `${root}/${locale.getSpec()}${ext}`;
                    const rawData = this.fileCache.loadFileSync(jsPath);
                    if (rawData) {
                        const parsedData = this._parseAndCacheJsFile(rawData, jsPath, root);
                        if (parsedData) {
                            // Return the data for the specific basename and locale
                            const extractedData = this._extractBasenameData(parsedData, basename, locale);
                            
                            if (extractedData) {
                                return extractedData;
                            }
                            
                            // If we loaded the file but didn't find data for the requested locale,
                            // store null to indicate we checked
                            this.dataCache.storeData(root, basename, locale.getSpec(), null);
                        }
                    }
                } catch (error) {
                    // Continue to next extension
                    continue;
                }
            }
            // File doesn't exist with any of the extensions, so store null to indicate we checked
            this.dataCache.storeData(root, basename, locale.getSpec(), null);
        }
        return undefined;
    }

    /**
     * Load data from individual .json files for a locale and basename
     * @private
     * 
     * @param {Locale} locale - The locale object
     * @param {Array.<string> roots - Array of root directories
     * @param {string} basename - The basename to load
     * @returns {Promise<Object|undefined>} Promise that resolves to the parsed data, or undefined if not found
     */
    async _loadFromJsonFiles(locale, roots, basename) {
        // ASYNC VERSION - Try to load from flat .json files first (current behavior)
        for (const root of roots) {
            try {
                const jsonPath = `${root}/${locale.getSpec()}.json`;
                const rawData = await this.fileCache.loadFile(jsonPath);
                if (rawData) {
                    const parsedData = this._parseAndCacheJsonFile(rawData, jsonPath, root);
                    if (parsedData) {
                        // Return the data for the specific basename and locale
                        return this._extractBasenameData(parsedData, basename, locale);
                    }
                    
                    // If we loaded the file but didn't find data for the requested locale,
                    // store null to indicate we checked
                    this.dataCache.storeData(root, basename, locale.getSpec(), null);
                } else {
                    // File doesn't exist, store null to indicate we checked
                    this.dataCache.storeData(root, basename, locale.getSpec(), null);
                }
            } catch (error) {
                // Continue to next root
            }
        }

        // Get the list of hierarchical file paths to try
        const locFiles = Utils.getLocFiles(locale, `${basename}.json`);

        // Fall back to hierarchical .json files using Utils.getLocFiles
        for (const root of roots) {
            try {
                // Load all files for the locale - MergedDataCache will handle merging
                for (const locFile of locFiles) {
                    const jsonPath = `${root}/${locFile}`;
                    const rawData = await this.fileCache.loadFile(jsonPath);
                    // For hierarchical files, parse and cache the data directly
                    this._parseAndCacheHierarchicalJsonFile(rawData, jsonPath, root, basename, locFile);
                }
            } catch (error) {
                // Continue to next root
            }
        }
        
        // Return the data specifically for the requested locale/basename
        // Check all roots for cached data
        return this._getCachedDataForLocale(locale, roots, basename);
    }

    /**
     * Load data from individual .json files for a locale and basename synchronously
     * @private
     * 
     * @param {Locale} locale - the locale object
     * @param {Array.<string>} roots - Array of root directories
     * @param {string} basename - The basename to load
     * @returns {Object|undefined} The parsed data, or undefined if not found
     */
    _loadFromJsonFilesSync(locale, roots, basename) {
        // SYNC VERSION - Try to load from flat .json files first (current behavior)
        for (const root of roots) {
            try {
                const jsonPath = `${root}/${locale.getSpec()}.json`;
                const rawData = this.fileCache.loadFileSync(jsonPath);
                if (rawData) {
                    const parsedData = this._parseAndCacheJsonFile(rawData, jsonPath, root);
                    if (parsedData) {
                        // Return the data for the specific basename and locale
                        return this._extractBasenameData(parsedData, basename, locale);
                    }
                    
                    // If we loaded the file but didn't find data for the requested locale,
                    // store null to indicate we checked
                    this.dataCache.storeData(root, basename, locale.getSpec(), null);
                } else {
                    // File doesn't exist, store null to indicate we checked
                    this.dataCache.storeData(root, basename, locale.getSpec(), null);
                }
            } catch (error) {
                // Continue to next root
            }
        }

        // Get the list of hierarchical file paths to try
        const locFiles = Utils.getLocFiles(locale, `${basename}.json`);

        // Fall back to hierarchical .json files using Utils.getLocFiles
        for (const root of roots) {
            try {
                // Load all files for the locale - MergedDataCache will handle merging
                for (const locFile of locFiles) {
                    const jsonPath = `${root}/${locFile}`;
                    const rawData = this.fileCache.loadFileSync(jsonPath);
                    // For hierarchical files, parse and cache the data directly
                    this._parseAndCacheHierarchicalJsonFile(rawData, jsonPath, root, basename, locFile);
                }
            } catch (error) {
                // Continue to next root
            }
        }
        
        // Return the data specifically for the requested locale/basename
        // Check all roots for cached data
        return this._getCachedDataForLocale(locale, roots, basename);
    }

    /**
     * Extract data for a specific basename from parsed data
     * @private
     * 
     * @param {Object} parsedData - The parsed data object
     * @param {string} basename - The basename to extract
     * @param {Locale} locale - The locale object to get data for
     * @returns {Object|undefined} The data for the basename, or undefined if not found
     */
    _extractBasenameData(parsedData, basename, locale) {
        // Only return data for the exact requested locale - no fallbacks
        const localeSpec = locale.getSpec();
        
        if (parsedData[localeSpec] && parsedData[localeSpec][basename]) {
            return parsedData[localeSpec][basename];
        }
        
        return undefined;
    }

    /**
     * Get cached data for a specific root, basename, and locale without loading from files
     *
     * @param {string} root - The root directory
     * @param {string} basename - The basename of the data
     * @param {string|null} locale - The locale identifier, or null for root
     * @returns {Object|undefined} The cached data, or undefined if not found
     */
    getCachedData(root, basename, locale) {
        if (!root || !basename) {
            return undefined;
        }

        if (locale === null) {
            locale = 'root';
        }
        return this.dataCache.getData(root, basename, locale);
    }

    /**
     * Check if parsed data exists for a specific root, basename, and locale
     *
     * @param {string} root - The root directory
     * @param {string} basename - The basename of the data
     * @param {string|null} locale - The locale identifier, or null for root
     * @returns {boolean} True if the data exists, false otherwise
     */
    hasParsedData(root, basename, locale) {
        if (!root || !basename) {
            return false;
        }

        if (locale === null) {
            locale = 'root';
        }
        const data = this.dataCache.getData(root, basename, locale);
        return data !== undefined;
    }

    /**
     * Store parsed data for a specific root, basename, and locale
     *
     * @param {string} root - The root directory
     * @param {string} basename - The basename of the data
     * @param {string|null} locale - The locale identifier, or null for root
     * @param {Object} data - The parsed data to store
     */
    storeParsedData(root, basename, locale, data) {
        if (!root || !basename) {
            return;
        }

        if (locale === null) {
            locale = 'root';
        }
        this.dataCache.storeData(root, basename, locale, data);
    }

    /**
     * Remove parsed data for a specific root, basename, and locale
     *
     * @param {string} root - The root directory
     * @param {string} basename - The basename of the data
     * @param {string|null} locale - The locale identifier, or null for root
     */
    removeParsedData(root, basename, locale) {
        if (!root || !basename) {
            return;
        }

        if (locale === null) {
            locale = 'root';
        }
        this.dataCache.removeData(root, basename, locale);
    }

    /**
     * Clear all parsed data from the cache
     */
    clearAllParsedData() {
        this.dataCache.clearData();
    }

    /**
     * Get the count of cached parsed data entries
     * 
     * @returns {number} The number of cached parsed data entries
     */
    getParsedDataCount() {
        return this.dataCache.size();
    }
}

export default ParsedDataCache;
