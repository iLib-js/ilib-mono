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

import { getLocFiles, Path } from 'ilib-common';
import { top } from 'ilib-env';

/**
 * @private
 */
function getLocaleSpec(locale) {
    if (!locale) {
        return "root";
    } else {
        return [locale.getLanguage(), locale.getScript(), locale.getRegion(), locale.getVariant()].join('_');
    }
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
 *
 * Packages should not attempt to load any
 * locale data of another package. The other package may change what
 * data it stores, or how it is stored or encoded, without notice,
 * so depending
 * on another package's data is dangerous. Instead, that other package should
 * be designed to provide a stable API for the current package to get
 * any information that it may need.<p>
 */
class DataCache {
    /**
     * Create a locale data cache.
     *
     * The options may contain any of the following properties:
     *
     * <ul>
     * <li>packageName. The unique name of the package for which the locale
     * data is being cached.
     * </ul>
     *
     * @private
     * @param {string} name the unique name for this type of locale data
     * @param {Object} options Options governing the construction of this
     * cache
     * @constructor
     */
    constructor(options) {
        this.logger = log4js.getLogger("ilib-localedata");
        let {
            packageName
        } = options || {};

        this.packageName = packageName;
        this.logger.trace("new DataCache instance");

        this.count = 0;
        this.data = {};
    }

    static getDataCache(options) {
        if (!options || typeof(options.packageName) !== 'string') return;

        const globalScope = top();

        if (!globalScope.ilib) {
            globalScope.ilib = {};
        }

        if (!globalScope.ilib.dataCache) {
            globalScope.ilib.dataCache = {};
        }

        if (!globalScope.ilib.dataCache[options.packageName]) {
            globalScope.ilib.dataCache[options.packageName] = new DataCache(options);
        }

        return globalScope.ilib.dataCache[options.packageName];
    }

    /**
     * Return the name of the package for which this is a cache.
     * @returns {string} the package name
     */
    getPackage() {
        return this.packageName;
    }

    /**
     * Get locale data from the cache or information about data that may be missing.<p>
     *
     * @param {string} basename the base name of this type of data
     * @param {Locale} locale the full or partial locale for this particular data
     * @returns {Object|null|undefined} the requested data, or null to explicitly indicate
     * that no data of this type exists for this locale, or undefined to indicate that the
     * cache has no information about this type of data for that locale
     */
    getData(basename, locale) {
        this.logger.trace(`Getting data for ${basename} locale ${locale ? locale.getSpec() : "root"} in the cache.`);
        if (!basename) {
            this.logger.info(`Attempt to get data from the cache with no basename.`);
            return;
        }

        if ( !this.data[basename] ) {
            return undefined;
        }

        let localeSpec = getLocaleSpec(locale);

        return this.data[basename][localeSpec];
    };

    /**
     * Store the given data for the given full or partial locale. The data may be given
     * as null to indicate explicitly that there is no data for this locale of the the
     * given type. This may be because of various reasons. For example, there is no locale
     * data file for the locale.
     *
     * @param {string} basename the base name of this type of data
     * @param {Locale} locale the full or partial locale of this data
     * @param {Object} data the data to store for this locale
     */
    storeData(basename, locale, data) {
        this.logger.trace(`Storing data for ${basename} locale ${locale ? locale.getSpec() : "root"} in the cache.`);
        if (!basename) {
            this.logger.info(`Attempt to store data in the cache with no basename.`);
            return;
        }

        if ( !this.data[basename] ) {
            this.data[basename] = {};
        }

        let localeSpec = getLocaleSpec(locale);

        if (this.data[basename][localeSpec]) {
            if (typeof(data) === 'undefined') {
                // setting to undefined is the same as removing
                this.count--;
            }
        } else if (typeof(data) !== 'undefined') {
            this.count++;
        }

        this.data[basename][localeSpec] = data;
    }

    /**
     * Store the given data for the given full or partial locale. The data may be given
     * as null to indicate explicitly that there is no data for this locale of the the
     * given type. This may be because of various reasons. For example, there is no locale
     * data file for the locale.
     *
     * @param {string} basename the base name of this type of data
     * @param {Locale} locale the full or partial locale of this data
     */
    removeData(basename, locale) {
        this.logger.trace(`Removing data for ${basename} locale ${locale ? locale.getSpec() : "root"} in the cache.`);
        this.storeData(basename, locale, undefined);
    }

    /**
     * Return how many items are stored in this cache.
     * @returns {number} how many items are stored in this cache
     */
    size() {
        return this.count;
    }

    /**
     * Clear all the data from this cache. This is mostly intended to be used by unit
     * testing.
     */
    clearData() {
        this.logger.trace(`The data cache has been cleared.`);
        this.count = 0;
        this.data = {};
    }
}

export default DataCache;
