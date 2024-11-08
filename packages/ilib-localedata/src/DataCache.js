/*
 * DataCache.js - class to cache locale data so that we are not
 * constantly loading the same files over and over again
 *
 * Copyright © 2022 JEDLSoft
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

/**
 * @private
 */
function getLocaleSpec(locale) {
    return !locale || locale.getRegion() === "001" ? "root" : locale.getSpec();
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
     * @param {string} name the unique name for this type of locale data
     * @constructor
     */
    constructor() {
        this.logger = log4js.getLogger("ilib-localedata");

        this.logger.trace("new DataCache instance");

        this.count = 0;
        this.data = {};
        this.loaded = new Set();
    }

    /**
     * Factory method to create a new DataCache singleton.
     * @param {Object} options options to pass to the constructor. (See
     * the constructor's documentation for details.
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
     * Get locale data from the cache or information about data that may be missing.
     * If the basename is missing, get all the data for the locale.
     *
     * @param {string} root the root from which the data was loaded
     * @param {string|undefined} basename the base name of this type of data. If this
     * is undefined, return all basenames for the locale
     * @param {Locale} locale the full or partial locale for this particular data
     * @returns {Object|null|undefined} the requested data, or null to explicitly indicate
     * that no data of this type exists for this locale, or undefined to indicate that the
     * cache has no information about this type of data for that locale
     */
    getData(root, basename, locale) {
        this.logger.trace(`Getting data for ${basename} locale ${locale ? locale.getSpec() : "root"} in the cache.`);

        let localeSpec = getLocaleSpec(locale);

        if ( !this.data[root] ) {
            this.data[root] = {};
        }
        if ( !this.data[root][localeSpec] ) {
            return undefined;
        }

        return basename ? this.data[root][localeSpec][basename] : this.data[root][localeSpec];
    };

    /**
     * Store the given data for the given full or partial locale. The data may be given
     * as null to indicate explicitly that there is no data for this locale of the the
     * given type. This may be because of various reasons. For example, there is no locale
     * data file for the locale.
     *
     * @param {string} root the root from which the data was loaded
     * @param {string} basename the base name of this type of data
     * @param {Locale} locale the full or partial locale of this data
     * @param {Object} data the data to store for this locale
     */
    storeData(root, basename, locale, data) {
        this.logger.trace(`Storing data for ${basename} locale ${locale ? locale.getSpec() : "root"} in the cache.`);
        if (!basename) {
            this.logger.info(`Attempt to store data in the cache with no basename.`);
            return;
        }

        let localeSpec = getLocaleSpec(locale);

        if ( !this.data[root] ) {
            this.data[root] = {};
        }
        if ( !this.data[root][localeSpec] ) {
            this.data[root][localeSpec] = {};
        }


        if (this.data[root][localeSpec][basename]) {
            if (typeof(data) === 'undefined') {
                // setting to undefined is the same as removing
                this.count--;
            }
        } else if (typeof(data) !== 'undefined') {
            this.count++;
        }

        this.data[root][localeSpec][basename] = data;
    }

    /**
     * Store the given data for the given full or partial locale. The data may be given
     * as null to indicate explicitly that there is no data for this locale of the the
     * given type. This may be because of various reasons. For example, there is no locale
     * data file for the locale.
     *
     * @param {string} root the root from which the data was loaded
     * @param {string} basename the base name of this type of data
     * @param {Locale} locale the full or partial locale of this data
     */
    removeData(root, basename, locale) {
        this.logger.trace(`Removing data for ${basename} locale ${locale ? locale.getSpec() : "root"} in the cache.`);
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
}

export default DataCache;
