/*
 * DataCache.js - class to cache locale data so that we are not
 * constantly loading the same files over and over again
 *
 * Copyright © 2022, 2025 JEDLSoft
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

import log4js from '@log4js-node/log4js-api';

import { Path } from 'ilib-common';
import { top } from 'ilib-env';
import Locale from 'ilib-locale';

/**
 * @private
 */
function getLocaleSpec(locale) {
    if (!locale) return "root";
    
    // Handle string-based locale identifiers
    if (typeof locale === 'string') {
        return locale === "root" ? "root" : locale;
    }
    
    // Handle Locale objects
    if (typeof locale === 'object' && locale.getRegion && locale.getSpec) {
        return locale.getRegion() === "001" ? "root" : locale.getSpec();
    }
    
    // Fallback to string representation
    return String(locale);
}

/**
 * @class A locale data cache.
 *
 * This class is a repository for locale-sensitive data only. For
 * non-locale data (ie. data that is not specific to a particular
 * locale), a class should load that data directly using a regular
 * javascript `import` statement or the asynchronous `import()`
 * function. This allows packagers like webpack
 * to include that data directly into the bundle.<p>
 *
 * Locale data instances should not be created directly. Instead,
 * use the `getLocaleData()` factory method, which returns a locale
 * data singleton specific to the caller's package. The caller must
 * pass in its unique package name and the path to the module so
 * that the locale data class can load data from it.<p>
 *
 * Any classes within
 * the same package can share the same locale data. For example, within
 * the ilib-phone package, both the phone number parser and formatter
 * need information about numbering plans, so they can share the
 * locale data about those plans.<p>
 */
class DataCache {
    /**
     * Create a locale data cache.
     *
     * @private
     * @constructor
     */
    constructor() {
        this.logger = log4js.getLogger("ilib-localedata");

        this.logger.trace("new DataCache instance");

        this.count = 0;
        this.data = {};
        this.loaded = new Set();

        // File-level caching for FileCache integration
        this.fileData = new Map(); // filename -> data (object, null, or undefined)
        this.filePromises = new Map(); // filename -> Promise
    }

    /**
     * Factory method to create a new DataCache singleton.
     * @returns {DataCache} the data cache for the given package
     */
    static getDataCache() {
        const globalScope = top();

        if (!globalScope.ilib) {
            globalScope.ilib = {};
        }

        if (!globalScope.ilib.dataCache) {
            globalScope.ilib.dataCache = new DataCache();
        }

        return globalScope.ilib.dataCache;
    }

    /**
     * Clear the data cache. This clears the cached data for all packages at
     * once.
     */
    static clearDataCache() {
        const cache = DataCache.getDataCache();
        cache.clearData();
    }

    /**
     * Get the data for the given locale from the given root. The data
     * is returned as it was stored, which means it could be undefined
     * if no data was stored for that locale.
     *
     * @param {string} root the root from which the data was loaded
     * @param {string} basename the base name of this type of data
     * @param {Locale|string|null} locale the full or partial locale of this data, or "root" for root data
     * @returns {Object|undefined} the data for this locale or undefined if none was stored
     */
    getData(root, basename, locale) {
        if (!root || !basename) {
            return undefined;
        }

        let localeSpec = getLocaleSpec(locale);

        if (!this.data?.[root]?.[localeSpec] || !(basename in this.data[root][localeSpec])) {
            return undefined;
        }

        return basename ? this.data[root][localeSpec][basename] : this.data[root][localeSpec];
    }

    /**
     * Store the given data for the given full or partial locale. The data may be given
     * as null to indicate explicitly that there is no data for this locale of the the
     * given type. This may be because of various reasons. For example, there is no locale
     * data file for the locale.
     *
     * @param {string} root the root from which the data was loaded
     * @param {string} basename the base name of this type of data
     * @param {Locale|string|null} locale the full or partial locale of this data, or "root" for root data
     * @param {Object} data the data to store for this locale
     */
    storeData(root, basename, locale, data) {
        const localeSpec = getLocaleSpec(locale);
        this.logger.trace(`Storing data for ${basename} locale ${localeSpec} in the cache.`);
        if (!basename) {
            this.logger.info(`Attempt to store data in the cache with no basename.`);
            return;
        }

        if ( !this.data[root] ) {
            this.data[root] = {};
        }
        if ( !this.data[root][localeSpec] ) {
            this.data[root][localeSpec] = {};
        }

        if (basename in this.data[root][localeSpec]) {
            if (typeof(data) === 'undefined') {
                // setting to undefined is the same as removing
                this.count--;
            }
        } else if (typeof(data) !== 'undefined') {
            this.count++;
        }

        // don't overwrite existing data with a null value
        if (data !== null || typeof(this.data[root][localeSpec][basename]) === 'undefined') {
            this.data[root][localeSpec][basename] = data;
        }
    }

    /**
     * Store the given data for the given full or partial locale. The data may be given
     * as null to indicate explicitly that there is no data for this locale of the the
     * given type. This may be because of various reasons. For example, there is no locale
     * data file for the locale.
     *
     * @param {string} root the root from which the data was loaded
     * @param {string} basename the base name of this type of data
     * @param {Locale|string|null} locale the full or partial locale of this data, or "root" for root data
     */
    removeData(root, basename, locale) {
        const localeSpec = getLocaleSpec(locale);
        this.logger.trace(`Removing data for ${basename} locale ${localeSpec} in the cache.`);
        this.storeData(root, basename, locale, undefined);
    }

    /**
     * Return how many items are stored in this cache.
     * @returns {number} how many items are stored in this cache
     */
    size() {
        return this.count;
    }

    /**
     * Clear all the data from this cache instance. This is mostly intended to be used by unit
     * testing.
     */
    clearData() {
        this.logger.trace(`The data cache has been cleared.`);
        this.count = 0;
        this.data = {};
        this.loaded.clear();
        this.fileData.clear();
        this.filePromises.clear();
    }

    /**
     * Record that the given file name has already been loaded.
     * @param {string} fileName the path to the file that has been loaded
     */
    markFileAsLoaded(fileName) {
        if (!fileName || typeof(fileName) !== "string") return;
        this.loaded.add(fileName);
    }

    /**
     * Return true if the file has already been loaded before.
     * @return {boolean} true if the file has already been loaded
     */
    isLoaded(fileName) {
        if (!fileName || typeof(fileName) !== "string") return false;
        return this.loaded.has(fileName);
    }

    // File-level caching methods for FileCache integration

    /**
     * Get file data from the cache.
     * @param {string} filePath the path to the file
     * @returns {Object|null|undefined} the file data, null if failed/no data, undefined if not attempted
     */
    getFileData(filePath) {
        if (!filePath || typeof filePath !== 'string') return undefined;
        return this.fileData.get(filePath);
    }

    /**
     * Set file data in the cache.
     * @param {string} filePath the path to the file
     * @param {Object|null} data the file data or null if failed/no data
     */
    setFileData(filePath, data) {
        if (!filePath || typeof filePath !== 'string') return;
        this.fileData.set(filePath, data);
    }

    /**
     * Remove file data from the cache.
     * @param {string} filePath the path to the file
     */
    removeFileData(filePath) {
        if (!filePath || typeof filePath !== 'string') return;
        this.fileData.delete(filePath);
    }

    /**
     * Get file promise from the cache.
     * @param {string} filePath the path to the file
     * @returns {Promise|undefined} the promise for the file or undefined if not loading
     */
    getFilePromise(filePath) {
        if (!filePath || typeof filePath !== 'string') return undefined;
        return this.filePromises.get(filePath);
    }

    /**
     * Set file promise in the cache.
     * @param {string} filePath the path to the file
     * @param {Promise} promise the promise for the file
     */
    setFilePromise(filePath, promise) {
        if (!filePath || typeof filePath !== 'string' || !promise) return;
        this.filePromises.set(filePath, promise);
    }

    /**
     * Remove file promise from the cache.
     * @param {string} filePath the path to the file
     */
    removeFilePromise(filePath) {
        if (!filePath || typeof filePath !== 'string') return;
        this.filePromises.delete(filePath);
    }

    /**
     * Clear all file cache data and promises.
     */
    clearFileCache() {
        this.fileData.clear();
        this.filePromises.clear();
    }

    /**
     * Get the count of file promises currently in flight.
     * @returns {number} the number of file promises
     */
    getFilePromiseCount() {
        return this.filePromises.size;
    }

    /**
     * Get the count of files that have been attempted to load.
     * @returns {number} the number of files with data
     */
    getFileDataCount() {
        return this.fileData.size;
    }
}

export default DataCache;
