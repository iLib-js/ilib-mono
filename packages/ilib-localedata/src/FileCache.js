/*
 * FileCache.js - class to handle file loading and caching to prevent race conditions
 * and avoid re-attempting failed file loads
 *
 * Copyright © 2025-2026 JEDLSoft
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
import DataCache from './DataCache.js';

/**
 * @class A file cache that handles both synchronous and asynchronous file loading
 * to prevent race conditions and avoid re-attempting failed file loads.
 *
 * This class caches promises for async file loading to prevent multiple
 * concurrent requests for the same file from triggering multiple loads.
 * It also tracks loading attempts to avoid re-attempting files that
 * failed to load or had no data.
 *
 * The FileCache uses DataCache to store the actual file data and promises,
 * making it possible to share loaded data across various modules in their own scopes.
 *
 * @private
 */
class FileCache {
    /**
     * The logger for this class.
     * @private
     * @type {Object}
     */
    logger;

    /**
     * The loader used to read files from wherever they are stored.
     * @private
     * @type {Object}
     */
    loader;

    /**
     * The shared data cache where the file contents and the promises for the
     * files that are currently loading are stored.
     * @private
     * @type {DataCache}
     */
    dataCache;

    /**
     * Create a new FileCache instance.
     *
     * @param {Object} loader - The loader instance to use for file loading
     * @constructor
     */
    constructor(loader) {
        this.logger = log4js.getLogger("ilib-localedata");
        this.logger.trace("new FileCache instance");
        this.loader = loader;
        this.dataCache = DataCache.getDataCache();
    }

    /**
     * Load a file asynchronously. If the file is already being loaded,
     * returns the existing promise to prevent race conditions.
     *
     * @param {string} filePath - The path to the file to load
     * @returns {Promise<Object|undefined>} A promise that resolves to the file data
     *          or undefined if the file could not be loaded or had no data
     */
    loadFile(filePath) {
        if (!filePath || typeof filePath !== 'string' || filePath.trim() === '') {
            return Promise.resolve(undefined);
        }

        // Check if we already have a promise for this file in DataCache
        const existingPromise = this.dataCache.getFilePromise(filePath);
        if (existingPromise) {
            return existingPromise;
        }

        // Check if we already have the data in DataCache
        const existingData = this.dataCache.getFileData(filePath);
        if (existingData !== undefined) {
            // a null entry records a load that already happened and found nothing.
            // Callers see that the same way as a first-time failure, as undefined
            const promise = Promise.resolve(existingData === null ? undefined : existingData);
            this.dataCache.setFilePromise(filePath, promise);
            return promise;
        }

        // Start loading the file. In this case, we don't want to use "await"
        // because we want to cache the promise itself
        const loadPromise = this.loader.loadFile(filePath, { sync: false })
            .then(data => {
                if (data) {
                    // Store successful load in DataCache
                    this.dataCache.setFileData(filePath, data);
                    return data;
                } else {
                    // Store no-data result in DataCache
                    this.dataCache.setFileData(filePath, null);
                    return undefined;
                }
            })
            .catch(error => {
                // Store failed load in DataCache
                this.dataCache.setFileData(filePath, null);
                this.logger.warn(`Failed to load file ${filePath}: ${error.message}`);
                return undefined;
            });
        // Note: We don't remove the promise from DataCache after resolution
        // It serves as a marker that the file has already been loaded

        // Store the promise in DataCache BEFORE returning it
        this.dataCache.setFilePromise(filePath, loadPromise);
        return loadPromise;
    }

    /**
     * Load a file synchronously. If the file is already loaded or attempted,
     * returns the cached result. Otherwise, attempts to load the file.
     *
     * @param {string} filePath - The path to the file to load
     * @returns {Object|undefined} The file data or undefined if the file could not be loaded
     */
    loadFileSync(filePath) {
        if (!filePath || typeof filePath !== 'string' || filePath.trim() === '') {
            return undefined;
        }

        // Check if we already have the data in DataCache
        const existingData = this.dataCache.getFileData(filePath);
        if (existingData !== undefined) {
            // a null entry records a load that already happened and found nothing.
            // Callers see that the same way as a first-time failure, as undefined
            return existingData === null ? undefined : existingData;
        }

        // Check if the loader supports sync operations. Nothing is attempted in that
        // case, so the file must not be recorded as tried, or a later asynchronous
        // load would skip it and report that there is no data for it.
        if (!this.loader.getSyncMode()) {
            this.logger.warn(`Loader does not support sync operations for file ${filePath}`);
            throw new Error(`Loader does not support sync operations for file ${filePath}`);
        }

        try {
            // Attempt to load the file synchronously
            const data = this.loader.loadFile(filePath, { sync: true });

            this.recordLoad(filePath, data || null);
            return data || undefined;
        } catch (error) {
            // Store failed load in DataCache
            this.recordLoad(filePath, null);
            this.logger.warn(`Failed to load file ${filePath} synchronously: ${error.message}`);
            throw error;
        }
    }

    /**
     * Record the result of a synchronous load. The cached promise doubles as the
     * marker that a file has already been loaded, so a synchronous load has to
     * record one as well. Without it, the same cached file would be counted
     * differently depending on which method happened to load it first.
     *
     * @private
     * @param {string} filePath - The path to the file that was loaded
     * @param {Object|null} data - The file data, or null if there was none
     */
    recordLoad(filePath, data) {
        this.dataCache.setFileData(filePath, data);
        // an asynchronous load of the same file may already be in flight, and its
        // promise is the one that its callers are waiting on, so leave it alone
        if (!this.dataCache.getFilePromise(filePath)) {
            this.dataCache.setFilePromise(filePath, Promise.resolve(data === null ? undefined : data));
        }
    }

    /**
     * Remove a file from the cache. This will allow the file to be
     * reloaded on the next request.
     *
     * @param {string} filePath - The path to the file to remove from cache
     */
    removeFileFromCache(filePath) {
        if (filePath && typeof filePath === 'string') {
            this.dataCache.removeFileData(filePath);
            this.dataCache.removeFilePromise(filePath);
        }
    }

    /**
     * Get the cached data for a file.
     * @param {string} filePath - The path to the file to get the cached data for
     * @returns {Object|null|undefined} The cached data or null if failed/no data, undefined
     * if the code has not attempted to load the file yet
     */
    getCachedData(filePath) {
        return this.dataCache.getFileData(filePath);
    }

    /**
     * Clear all cached file data and promises.
     * This is mostly intended to be used by unit testing.
     */
    clearCache() {
        this.dataCache.clearFileCache();
    }

    /**
     * Return the number of files that this cache has loaded or is loading. Files
     * loaded synchronously count the same as files loaded asynchronously, so this
     * does not depend on which method a caller used.
     *
     * @returns {number} The number of files loaded or loading
     */
    size() {
        return this.dataCache.getFilePromiseCount();
    }

    /**
     * Return the number of files that have been attempted to load.
     *
     * @returns {number} The number of files that have been attempted to load
     */
    attemptCount() {
        return this.dataCache.getFileDataCount();
    }
}

export default FileCache;
