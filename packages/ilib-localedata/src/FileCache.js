/*
 * FileCache.js - class to handle file loading and caching to prevent race conditions
 * and avoid re-attempting failed file loads
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
            // Return resolved promise with existing data
            const promise = Promise.resolve(existingData);
            this.dataCache.setFilePromise(filePath, promise);
            return promise;
        }

        // Start loading the file
        const loadPromise = this.loader.loadFile(filePath)
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
            return existingData;
        }

        // Check if the loader supports sync operations
        if (!this.loader.supportsSync()) {
            this.logger.warn(`Loader does not support sync operations for file ${filePath}`);
            // Store null to indicate we attempted but can't load
            this.dataCache.setFileData(filePath, null);
            return undefined;
        }

        try {
            // Attempt to load the file synchronously
            const data = this.loader.loadFile(filePath, { sync: true });

            if (data) {
                // Store successful load in DataCache
                this.dataCache.setFileData(filePath, data);
                return data;
            } else {
                // Store no-data result in DataCache
                this.dataCache.setFileData(filePath, null);
                return undefined;
            }
        } catch (error) {
            // Store failed load in DataCache
            this.dataCache.setFileData(filePath, null);
            this.logger.warn(`Failed to load file ${filePath} synchronously: ${error.message}`);
            return undefined;
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
     * Clear all cached file data and promises.
     * This is mostly intended to be used by unit testing.
     */
    clearCache() {
        this.dataCache.clearFileCache();
    }

    /**
     * Return the number of files currently being loaded (promises in flight).
     *
     * @returns {number} The number of files currently being loaded
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
