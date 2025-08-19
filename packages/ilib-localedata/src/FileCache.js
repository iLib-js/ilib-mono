/*
 * FileCache.js - class to cache file loading promises to prevent race conditions
 * when multiple callers try to load the same locale data files simultaneously
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
import { top } from 'ilib-env';

/** @ignore @typedef {import('ilib-loader').Loader} Loader */

/**
 * @class A file loading cache that prevents race conditions by caching promises.
 *
 * This class is responsible for managing the loading of locale data files and
 * preventing race conditions when multiple callers attempt to load the same
 * files simultaneously. Instead of caching the loaded data, it caches the
 * promises to load the data, ensuring that concurrent requests for the same
 * files wait for the same promise to resolve.
 *
 * The FileCache class should not be instantiated directly. Instead, use the
 * `getFileCache()` factory method, which returns a file cache singleton.
 */
class FileCache {
    /**
     * Create a file cache instance.
     *
     * @param {Loader} loader a function that returns a promise to load the file
     * @private
     * @constructor
     */
    constructor(loader) {
        this.logger = log4js.getLogger("ilib-localedata");
        this.logger.trace("new FileCache instance");

        // Map of file paths to promises that will resolve to the loaded data
        this.filePromises = new Map();
        this.loader = loader;
    }

    /**
     * Factory method to create a new FileCache singleton.
     *
     * @param {Loader} loader a class that loads files
     * @returns {FileCache} the file cache singleton
     */
    static getFileCache(loader) {
        const globalScope = top();

        if (!globalScope.ilib) {
            globalScope.ilib = {};
        }

        if (!globalScope.ilib.fileCache) {
            globalScope.ilib.fileCache = new FileCache(loader);
        }

        return globalScope.ilib.fileCache;
    }

    /**
     * Create a promise to load the data of a specific file and cache it, or
     * return the cached promise if it already exists.
     *
     * The data is loaded using the loader instance passed to the constructor.
     * If the file is already being loaded, the cached promise is returned.
     * If the promise is already resolved, the loaded data is returned immediately
     * from the promise. If the promise is rejected, the error is propagated and
     * the caller can handle the error by removing the file from the cache and
     * trying again.
     *
     * @param {string} filePath the path to the file to load
     * @returns {Promise} a promise that will resolve to the loaded file data
     */
    loadFile(filePath) {
        // Don't cache invalid file paths
        if (!filePath || typeof filePath !== 'string' || filePath.trim() === '') {
            return Promise.resolve(undefined);
        }

        // Check if we already have a promise for this file
        if (this.filePromises.has(filePath)) {
            return this.filePromises.get(filePath);
        }

        // Create a new promise to load the file
        const loadPromise = this.loader.loadFile(filePath);

        // Cache the promise
        this.filePromises.set(filePath, loadPromise);

        return loadPromise;
    }

    /**
     * Remove a file from the cache. This is useful for testing or when
     * files need to be reloaded.
     *
     * @param {string} filePath the path to the file to remove from cache
     */
    removeFileFromCache(filePath) {
        if (filePath && typeof filePath === 'string') {
            this.filePromises.delete(filePath);
        }
    }

    /**
     * Clear all cached file promises and loaded file information.
     * This is mostly intended to be used by unit testing.
     */
    clearCache() {
        this.filePromises.clear();
    }

    /**
     * Get the number of files currently being tracked by this cache.
     * This includes both files being loaded and files that have been loaded.
     *
     * @returns {number} the number of files being tracked
     */
    size() {
        return this.filePromises.size;
    }
}

export default FileCache;
