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
     * Get parsed data for a locale and basename, loading and parsing files if necessary. This method can
     * load ESM modules with .js or .mjs extensions, and CommonJS modules with .js or .cjs extensions (depending
     * on the module type in the package.json file). It can also load flat .json files and hierarchical .json files.
     *
     * @param {string|Locale} locale - The locale to get data for
     * @param {Array.<string>} roots - Array of root directories to search
     * @param {string} basename - The basename of the data to load
     * @returns {Promise<Object|undefined>} Promise that resolves to the parsed data, or undefined if not found
     */
    async getParsedData(locale, roots, basename) {
        // Validate parameters
        if ((typeof locale !== 'string' && typeof locale !== 'object') || !Array.isArray(roots) || roots.length === 0 || !basename) {
            return undefined;
        }

        // Convert string locale to Locale object if needed
        const loc = (typeof locale === 'string') ? new Locale(locale) : locale;
        if (loc !== null && typeof loc.getSpec !== 'function') {
            return undefined;
        }


        // First check if we already have the data cached
        const cachedData = this._getCachedDataForLocale(loc, roots, basename);
        if (cachedData) {
            return cachedData;
        }

        await Promise.all([
            this._loadFromJsFiles(loc, roots, basename),
            this._loadFromJsonFiles(loc, roots, basename)
        ]);

        return this._getCachedDataForLocale(loc, roots, basename);
    }

    /**
     * Get parsed data for a locale and basename synchronously. This method cannot load ESM modules, as Javascript does
     * not support synchronous loading of ESM modules. It can load CommonJS modules with .js or .cjs extensions (depending
     * on the module type in the package.json file). It can also load flat .json files and hierarchical .json files.
     *
     * @param {string|Locale} locale - The locale to get data for
     * @param {Array.<string>} roots - Array of root directories to search
     * @param {string} basename - The basename of the data to load
     * @returns {Object|undefined} The parsed data, or undefined if not found
     */
    getParsedDataSync(locale, roots, basename) {
        // Validate parameters
        if ((typeof locale !== 'string' && typeof locale !== 'object') || !Array.isArray(roots) || roots.length === 0 || !basename) {
            return undefined;
        }

        // Convert string locale to Locale object if needed
        const loc = (typeof locale === 'string') ? new Locale(locale) : locale;
        if (loc !== null && typeof loc.getSpec !== 'function') {
            return undefined;
        }

        // First check if we already have the data cached
        const cachedData = this._getCachedDataForLocale(loc, roots, basename);
        if (cachedData) {
            return cachedData;
        }

        this._loadFromJsFilesSync(loc, roots, basename);
        this._loadFromJsonFilesSync(loc, roots, basename);

        return this._getCachedDataForLocale(loc, roots, basename);
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
     * Common method to parse and cache flat .json file data
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
            // Parsing failed -- ignore
        }
        return undefined;
    }

    /**
     * Load and parse a specific file, caching the results.
     * This is a low-level method that ParsedDataCache provides for higher layers.
     *
     * @param {string} filePath - The path to the file to load
     * @param {string} root - The root directory for this data
     * @returns {Promise<Object|undefined>} Promise that resolves to the parsed data, or undefined if not found
     */
    async loadAndParseFile(filePath, root) {
        try {
            const rawData = await this.fileCache.loadFile(filePath);
            if (rawData) {
                // Determine file type and parse accordingly
                if (filePath.endsWith('.json')) {
                    return this._parseAndCacheJsonFile(rawData, filePath, root);
                } else {
                    return this._parseAndCacheJsFile(rawData, filePath, root);
                }
            }
        } catch (error) {
            // File not found or other error
        }
        return undefined;
    }

    /**
     * Load and parse a specific file synchronously, caching the results.
     * This is a low-level method that ParsedDataCache provides for higher layers.
     *
     * @param {string} filePath - The path to the file to load
     * @param {string} root - The root directory for this data
     * @returns {Object|undefined} The parsed data, or undefined if not found
     */
    loadAndParseFileSync(filePath, root) {
        try {
            const rawData = this.fileCache.loadFileSync(filePath);
            if (rawData) {
                // Determine file type and parse accordingly
                if (filePath.endsWith('.json')) {
                    return this._parseAndCacheJsonFile(rawData, filePath, root);
                } else {
                    return this._parseAndCacheJsFile(rawData, filePath, root);
                }
            }
        } catch (error) {
            // File not found or other error
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
     * Determine the module type of a root directory based on package.json
     * @private
     *
     * @param {string} root - The root directory
     * @returns {string} The module type, either 'module' or 'commonjs'
     */
    _getModuleTypeSync(root) {
        const packageJsonPath = `${root}/package.json`;
        const packageJson = this.fileCache.loadFileSync(packageJsonPath);
        if (packageJson) {
            const pkg = JSON.parse(packageJson);
            return pkg.type;
        }
        return 'commonjs';
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
            const moduleType = this._getModuleTypeSync(root);
            // Check if there's a package.json in the root
            if (moduleType === 'module') {
                return ['.cjs', '.js'];
            } else {
                return ['.js', '.cjs'];
            }
        } catch (error) {
            // If we can't read package.json, assume .js files are CommonJS
            return ['.js', '.cjs'];
        }
    }

    /**
     * Load data from .js files for a specific locale only (no parent locale iteration)
     * @private
     */
    async _loadSpecificLocaleFromJsFiles(locale, roots, basename) {
        const localeSpec = locale === null ? 'root' : locale.getSpec();

        for (const root of roots) {
            // Try to load the specific locale file
            const extensions = ['.mjs', '.js', '.cjs'];

            for (const ext of extensions) {
                try {
                    const jsPath = `${root}/${localeSpec}${ext}`;
                    const rawData = await this.fileCache.loadFile(jsPath);
                    if (rawData) {
                        // Parse and cache data from this file
                        this._parseAndCacheJsFile(rawData, jsPath, root);
                        return; // Found data, no need to try other roots
                    }
                } catch (error) {
                    // Continue to next extension
                    continue;
                }
            }
        }
    }

    /**
     * Load data from .json files for a specific locale only (no parent locale iteration)
     * @private
     */
    async _loadSpecificLocaleFromJsonFiles(locale, roots, basename) {
        const localeSpec = locale === null ? 'root' : locale.getSpec();

        for (const root of roots) {
            // Try to load the specific locale file
            try {
                const jsonPath = `${root}/${localeSpec}.json`;
                const rawData = await this.fileCache.loadFile(jsonPath);
                if (rawData) {
                    // Parse and cache data from this file
                    this._parseAndCacheJsonFile(rawData, jsonPath, root);
                    return; // Found data, no need to try other roots
                }
            } catch (error) {
                // Continue to next root
                continue;
            }
        }
    }

    /**
     * Load data from .js files for a specific locale only (no parent locale iteration) - sync version
     * @private
     */
    _loadSpecificLocaleFromJsFilesSync(locale, roots, basename) {
        const localeSpec = locale === null ? 'root' : locale.getSpec();

        for (const root of roots) {
            // Try to load the specific locale file
            const moduleType = this._getModuleTypeSync(root);
            const extensions = (moduleType === 'module') ? ['.cjs'] : ['.js', '.cjs'];

            for (const ext of extensions) {
                try {
                    const jsPath = `${root}/${localeSpec}${ext}`;
                    const rawData = this.fileCache.loadFileSync(jsPath);
                    if (rawData) {
                        // Parse and cache data from this file
                        this._parseAndCacheJsFile(rawData, jsPath, root);
                        return; // Found data, no need to try other roots
                    }
                } catch (error) {
                    // Continue to next extension
                    continue;
                }
            }
        }
    }

    /**
     * Load data from .json files for a specific locale only (no parent locale iteration) - sync version
     * @private
     */
    _loadSpecificLocaleFromJsonFilesSync(locale, roots, basename) {
        const localeSpec = locale === null ? 'root' : locale.getSpec();

        for (const root of roots) {
            // Try to load the specific locale file
            try {
                const jsonPath = `${root}/${localeSpec}.json`;
                const rawData = this.fileCache.loadFileSync(jsonPath);
                if (rawData) {
                    // Parse and cache data from this file
                    this._parseAndCacheJsonFile(rawData, jsonPath, root);
                    return; // Found data, no need to try other roots
                }
            } catch (error) {
                // Continue to next root
                continue;
            }
        }
    }

    /**
     * Load data from .js files for a locale and basename (with parent locale iteration)
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
            // in async mode, we can load ESM modules using import() with .js or .mjs extensions, and CommonJS
            // modules using import() with .cjs extensions. As such, we don't need to know the module type to load the files.
            const extensions = ['.mjs', '.js', '.cjs'];

            // First try to load the specific locale file
            for (const ext of extensions) {
                try {
                    const localeSpec = locale === null ? 'root' : locale.getSpec();
                    const jsPath = `${root}/${localeSpec}${ext}`;
                    const rawData = await this.fileCache.loadFile(jsPath);
                    if (rawData) {
                        // Parse and cache all data from this file
                        this._parseAndCacheJsFile(rawData, jsPath, root);
                    }
                } catch (error) {
                    // Continue to next extension
                    continue;
                }
            }
        }

        // Now get the specific data we need from the cache
        return this._getCachedDataForLocale(locale, roots, basename);
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
            // in sync mode, we cannot load ESM modules with import() or require(), so only try .cjs files which
            // can be loaded synchronously. CommonJS modules can be loaded with require() without any issues.
            const moduleType = this._getModuleTypeSync(root);
            const extensions = (moduleType === 'module') ? ['.cjs'] : ['.js', '.cjs'];

            for (const ext of extensions) {
                try {
                    const localeSpec = locale === null ? 'root' : locale.getSpec();
                    const jsPath = `${root}/${localeSpec}${ext}`;
                    const rawData = this.fileCache.loadFileSync(jsPath);
                    if (rawData) {
                        // Parse and cache all data from this file
                        this._parseAndCacheJsFile(rawData, jsPath, root);
                    }
                } catch (error) {
                    // Continue to next extension
                    continue;
                }
            }
        }

        // Now get the specific data we need from the cache
        return this._getCachedDataForLocale(locale, roots, basename);
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
                const localeSpec = locale === null ? 'root' : locale.getSpec();
                const jsonPath = `${root}/${localeSpec}.json`;
                const rawData = await this.fileCache.loadFile(jsonPath);
                if (rawData) {
                    // Parse and cache all data from this file
                    this._parseAndCacheJsonFile(rawData, jsonPath, root);
                }
            } catch (error) {
                // Continue to next root
            }
        }

        // Get the list of hierarchical file paths to try
        const locFiles = locale === null ? ['${basename}.json'] : Utils.getLocFiles(locale, `${basename}.json`);

        // Fall back to hierarchical .json files using Utils.getLocFiles
        for (const root of roots) {
            try {
                // Load all files for the locale - MergedDataCache will handle merging
                for (const locFile of locFiles) {
                    const jsonPath = `${root}/${locFile}`;
                    const rawData = await this.fileCache.loadFile(jsonPath);
                    // For hierarchical files, parse and cache the data directly
                    if (rawData) {
                        this._parseAndCacheHierarchicalJsonFile(rawData, jsonPath, root, basename, locFile);
                    }
                }
            } catch (error) {
                // Continue to next root
            }
        }

        // Now get the specific data we need from the cache
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
                const localeSpec = locale === null ? 'root' : locale.getSpec();
                const jsonPath = `${root}/${localeSpec}.json`;
                const rawData = this.fileCache.loadFileSync(jsonPath);
                if (rawData) {
                    // Parse and cache all data from this file
                    this._parseAndCacheJsonFile(rawData, jsonPath, root);
                }
            } catch (error) {
                // Continue to next root
            }
        }

        // Get the list of hierarchical file paths to try
        const locFiles = locale === null ? ['${basename}.json'] : Utils.getLocFiles(locale, `${basename}.json`);

        // Fall back to hierarchical .json files using Utils.getLocFiles
        for (const root of roots) {
            try {
                // Load all files for the locale - MergedDataCache will handle merging
                for (const locFile of locFiles) {
                    const jsonPath = `${root}/${locFile}`;
                    const rawData = this.fileCache.loadFileSync(jsonPath);
                    // For hierarchical files, parse and cache the data directly
                    if (rawData) {
                        this._parseAndCacheHierarchicalJsonFile(rawData, jsonPath, root, basename, locFile);
                    }
                }
            } catch (error) {
                // Continue to next root
            }
        }

        // Now get the specific data we need from the cache
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
        const localeSpec = locale === null ? 'root' : locale.getSpec();

        if (parsedData[localeSpec] && parsedData[localeSpec][basename]) {
            return parsedData[localeSpec][basename];
        }

        return undefined;
    }

    /**
     * Get cached data for a specific root, basename, and locale without loading from files.
     * If the code has never attempted to load the data or if it did not find the data,
     * this method will return undefined to indicate that the data is not available.
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
        const data = this.dataCache.getData(root, basename, locale);
        // If the data is null, it indicates that the code attempted to load the data but it was not found
        // If the data is undefined, it indicates that the code did not attempt to load the data
        // In either case, the data is not available and cannot be returned
        return data || undefined;
    }

    /**
     * Check if parsed data exists for a specific root, basename, and locale.
     * If the underlying files do not exist, it will return false.
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

        // If the data is null, it indicates that the code attempted to load the data but it was not found
        // If the data is undefined, it indicates that the code did not attempt to load the data
        // In either case, the data is not available and cannot be returned
        return data !== undefined && data !== null;
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
     * Get the count of cached entries (including null entries for failed attempts)
     *
     * @returns {number} The number of cached entries
     */
    getCachedEntryCount() {
        return this.dataCache.size();
    }
}

export default ParsedDataCache;
