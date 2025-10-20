/*
 * LocaleData.js - utility class to load ilib locale data from a list
 * of root directories
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
import JSON5 from 'json5';

import { getPlatform, getLocale, top } from 'ilib-env';
import LoaderFactory from 'ilib-loader';
import { Utils, JSUtils, Path } from 'ilib-common';
import Locale from 'ilib-locale';
import LocaleMatcher from 'ilib-localematcher';

import DataCache from './DataCache.js';
import FileCache from './FileCache.js';
import MergedDataCache from './MergedDataCache.js';

/**
 * @private
 */
function getIlib() {
    var globalScope = top();
    if (!globalScope.ilib) {
        globalScope.ilib = {};
    }
    return globalScope.ilib;
}

/**
 * @private
 * Get a shared MergedDataCache instance for static methods
 */
function getSharedMergedDataCache() {
    const loader = LoaderFactory();
    if (!loader) {
        return null;
    }
    return new MergedDataCache(loader);
}

/**
 * @class A locale data instance.
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
 * data singleton.<p>
 *
 * Packages should not attempt to load any
 * locale data of another package. The other package may change what
 * data it stores, or how it is stored or encoded, without notice,
 * so depending
 * on another package's data is dangerous. Instead, that other package should
 * be designed to provide a stable API for the current package to get
 * any information that it may need.<p>
 *
 * <h2>Finding Data</h2>
 *
 * This class finds locale data in multiple ways:
 *
 * <ol>
 * <li>by looking in the cache. If the required data is already loaded, it is
 * returned immediately. When loading data asynchronously, if the data is
 * found in the cache, a promise is
 * still returned, even though is resolved immediately.
 * <li>by looking for files that contain data about an entire locale.
 * <li>by looking for files that contain data about parts of a locale.
 * </ol>
 *
 * <h2>Locale Data Files</h2>
 *
 * Files containing locale data can be encoded in two ways:
 *
 * <ol>
 * <li>JSON files. Data can be encoded as JSON files in JSON5 format.
 * <li>JS files. Data can be encoded inside of JS files that contain a
 * module that returns the locale data. These type of files may be loaded
 * dynamically when needed using "import", but are only available in
 * async mode.
 * </ol>
 *
 * All files need to be encoded in UTF-8.
 *
 * <h2>Roots</h2>
 *
 * Files are loaded from a list of roots. The locale data loader looks in
 * each root in order to find the locale data. When the file is
 * found, the locale data loader will stop looking in subsequent roots for
 * more data. The last root in the list is typically the "locale" directory
 * within the package itself and contains the locale data that the package
 * was originally shipped with. In
 * this way, locale data that comes with a package can be overridden by
 * other data that is perhaps customized by the app or the operating system
 * or it might be updated from what is in the original package.<p>
 *
 * The list of roots is global, shared by all instances of the locale data
 * class no matter what type of data is being loaded. In this way, an app
 * can set the roots once and all locale data
 * instances will use the same list. There are a number of static methods
 * on the locale data class to manage the list of roots.<p>
 *
 * For optimization, a root may contain a file named "ilibmanifest.json".
 * If it is there, it will be loaded first. It should list all of the
 * contents of that root, and is used to prevent the loader from needing to
 * test whether files exist in the file system. That makes the file loader
 * a little faster since only the files that actually exist will be read.
 * For example, let's say we are attempting to load the locale data for
 * number formatting, but this root does not have any such data, the locale
 * data instance can avoid checking multiple directories/files inside that
 * root for the existance of that data, and skip directly on to the next root.<p>
 *
 * <h2>Locale Data Files</h2>
 *
 * The locale data loader will look in each root for data about a particular
 * locale. There are two styles of locale data:
 *
 * <ol>
 * <li>Locale data for an entire locale at once
 * <li>Locale data split into constituent locale parts and data types
 * </ol>
 *
 * Files named for the entire locale appear in the top of the root and have
 * the form "[locale-spec].json" or "[locale-spec].js". For example, data for
 * the Danish locale for Denmark would appear in "[root]/da-DK.json" file,
 * and would contain data for multiple data types.<p>
 *
 * Data that is split in to its locale parts exists in directories named after
 * the locale parts in files of the form "[basename].json" or "[basename].js".
 * For example, data for number formatting in the locale Danish for Denmark
 * would appear in the file "[root]/da/DK/numfmt.json".<p>
 *
 * The purpose for splitting the locale data into separate parts is so that the various
 * parts can be
 * cobbled together to support any arbitrary locale. For example, Vietnamese is
 * spoken by a minority of people in the United States, but the the locale
 * "vi-US" is not one that is normally specified. Yet that locale can be supported
 * simply by
 * combining the locale data for the Vietnamese language and the locale data
 * for the US region.<p>
 *
 * The data can be split into various parts based on which part of the locale
 * that the data is dependent upon. Some data is dependent on the language, some
 * on the region, some the script, and some on any combination of language, script,
 * or region. When the locale data class loads this data, it starts
 * off with the most generic information, which is the world-wide "root" locale,
 * and progressively overrides it with more specific info if it exists.
 * For example, number formatting is dependent on
 * both language and region. In Italian, the number grouping separator character is
 * a regular period. But Italian as spoken in Switzerland uses the
 * apostrophe ’ character instead. In this case, the "it-CH" locale would use most
 * of the settings from the root or the "it" language except for the grouping character,
 * which uses the more specific data of the apostrophe for the grouping character.<p>
 *
 * <ul>
 * <li> [root]/numfmt.json -> contains grouping separator character is comma "," which is
 *  default for the world. eg. 100,000
 * <li>[root]/it/numfmt.json -> contains the grouping separator char period "." for any
 * place that speaks Italian, including Italy, Switzerland, San Marino, and Vatican City
 * as well as small parts of Austria, Slovenia, and Croatia. eg. 100.000
 * <li>[root]/it/CH/numfmt.json -> contains the grouping separator char apostrophe "’"
 * specifically for Italian as it is spoken in Switzerland. eg. 100’000
 * </ul>
 *
 * <h2>Order of Specificity</h2>
 *
 * Locale data that is split based on locale parts are merged together to form the data
 * for the whole locale. It is merged starting with the least specific data (ie. default
 * data for the whole world) and going to the most specific data (ie. data that is
 * dependent on all of the specified locale parts.). The following list defines the
 * order in which the parts are merged:
 *
 * <ol>
 * <li> "root" (default for the whole world)
 * <li> language
 * <li> und/region
 * <li> language/script
 * <li> language/region
 * <li> region/variant
 * <li> language/script/region
 * <li> language/region/variant
 * <li> language/script/region/variant
 * </ol>
 *
 * If a file does not exist that contains locale data for that part of the locale, it will
 * simply be skipped. Note in the above, region-specific data appears under "und/region"
 * as the language is the minimum locale part and is required. The tag "und" stands for
 * the "undefined" language, which ilib uses to mean "all languages".
 *
 * <h2>Synchronicity and Caching</h2>
 *
 * Data is loaded using an instance of a Loader from the ilib-loader package.
 * All locale data can be imported asynchronously, as every loader must support
 * asynchronous operation. Some loaders, such as the one for Node.js can also support
 * synchronous operation. When the LocaleData instance is created, you can request to
 * use synchronous operation, but the loader may not support it. Call the `isSync` method
 * after the LocaleData instance is created to find out whether or not you can operate
 * in synchronous mode.<p>
 *
 * The LocaleData instance can return data synchronously, even in asynchronous mode, if
 * the data is already cached. The data can get into the cache in multiple ways:
 *
 * <ul>
 * <li>Using `ensureLocale`. Some locale data can be pre-loaded from js files using the
 * `ensureLocale` method which will load the files asynchronously.
 *
 * <li>Using `cacheData`. Data can be explicitly cached as well if you have some statically
 * loaded data in your
 * application and you wish to add it to the cache. Use the `cacheData` method to add
 * it to the cache.
 *
 * <li>With a previous asynchronous call. If you create an ilib class asynchronously, its
 * data will be loaded into the cache for the requested locale. After the asynchronous call
 * completes, you can then create other instances for the same locale synchronously. For
 * example, if you load a date formatter for locale "de-DE" that formats the date and time
 * together, you can then synchronously create another data formatter for the same "de-DE"
 * locale that only formats the date or the time by itself, since they rely on the same
 * date formatting data.
 * </ul>
 *
 * The cache for locale data is shared amongst all instances of LocaleData in the global
 * scope. This means that if you have 2 copies of an ilib class loaded into your app,
 * they will share the same cache. Having 2 copies happens under nodejs for example if
 * those two copies are located in different paths with your application or if there are
 * two slightly different versions of the same ilib class.<p>
 *
 * If you are not sure whether or not data for your ilib class has been loaded yet, you
 * can use the `checkData` method to check. Ilib classes will use this method as well
 * to check if they can operate synchronously at the moment, even when the loader is in
 * asynchronous mode, because the locale data they need is already cached.
 *
 */
class LocaleData {
    /**
     * Create a locale data instance.
     *
     * @param {string} packageName the unique name of the calling package. (eg. "LocaleInfo")
     * @param {Object} options options controlling the operation of this locale data
     * instance
     * @param {string} options.path (required) - The path to the local package's locale data on disk
     * @param {boolean} [options.sync=false] - whether this locale data instance should operate in synchronous
     * mode by default. The loader for the platform must support synchronous operation for this to work.
     * @param {Object} [options.mergeOptions] - options for merging locale data
     * @param {boolean} [options.mergeOptions.mostSpecific] - if true, return the most specific data available
     * @param {boolean} [options.mergeOptions.returnOne] - if true, return only the most locale-specific data available instead of merging
     * @param {boolean} [options.mergeOptions.crossRoots] - if true, merge data across all roots
     * @constructor
     */
    constructor(options) {
        if (!options || !options.path) {
            throw "Missing options to LocaleData constructor";
        }
        let {
            sync = false,
            path,
            mergeOptions = {}
        } = options;

        this.loader = LoaderFactory();
        this.sync = typeof(sync) === "boolean" && sync && (this.loader && this.loader.supportsSync());
        this.cache = DataCache.getDataCache();
        this.logger = log4js.getLogger("ilib-localedata");
        this.path = path;

        // Create MergedDataCache instance with the merge options
        this.mergedDataCache = new MergedDataCache(this.loader, mergeOptions);
    }

    /**
     * Whether or not this locale data instance is loaded synchronously or not.
     * The default is for asynchronous operation. If the "sync" option is given
     * to the constructor with a truthy value, but the loader for the platform
     * does not synchronous operation, this locale data will still operate
     * asynchronously.
     * @returns {boolean} whether or not the default for this local data instance
     * loads data synchronously
     */
    isSync() {
        return this.sync;
    }

    /**
     * Return the path that this LocaleData instance is using to load data.
     *
     * @returns {string} the path
     */
    getPath() {
        return this.path;
    }

    /**
     * Find locale data or load it in. <p>
     *
     * The data may be loaded from different sources:
     *
     * <ul>
     * <li>From a preassembled data file. This is a file that contains the locale data for a single locale
     * and includes all of the data for all of the basenames and all of the sublocales. The idea is that
     * you only need to load one file for a locale and all of the data will be loaded into the cache in one
     * operation. The preassembled data files are typically named [locale].js. They are
     * created using the [ilib-assemble tool](https://github.com/ilib-js/ilib-mono/tree/main/packages/ilib-assemble).
     * They are intended for use in browser environments where the data is loaded from a bundle rather than
     * from the file system. They have the advantage of only containing the data for basenames and locales
     * that your app actually needs instead of the many megabytes of data that are available for all locales
     * and basenames because the ilib-assemble tool scans your app's code for references to ilib classes
     * and their methods and calculates from there exactly what data is needed.
     * <li>From individual json data files. These are the files that contain the locale data for a single
     * basename and a single sublocale. The files are named [basename].json. They are typically created
     * by generating the locale data in various ways, such as from the Unicode CLDR data. For example,
     * translations in your app's resource bundles are typically generated
     * with the [loctool](https://github.com/ilib-js/ilib-mono/tree/main/packages/loctool) tool. In environments
     * where the data can be loaded directly from the file system, these files are typically stored in the
     * "locale" directory in the root of the package. These json files are usually the source of the data for the
     * preassembled data files.
     * </ul>
     *
     * The data is loaded from the [Loader instance](https://github.com/ilib-js/ilib-mono/tree/main/packages/ilib-loader)
     * in the order of the roots. This method will look through the roots for the requested locale data until it
     * finds it. If the "crossRoots" flag is given in the parameters, then the data is merged across all the roots.
     * The last root in the list is typically the "locale" directory within the package
     * itself and contains the locale data that the package was originally shipped with. In this way, locale data
     * that comes with a package can be overridden by other data that is perhaps customized by the app or the
     * operating system or it might be updated from what is in the original package.
     *
     * The loadData method relies on a Loader instance to load the data. The Loader instance knows how to load the data
     * from where it is stored. This may be from the file system if the code is running in an environment
     * that supports file system access, or it may be from another part of a bundle such as those constructed by
     * webpack or rollup. The Loader instance also knows how to load the data from the preassembled
     * data file.
     *
     * Regardless of how the data is loaded, the data for a particular basename is merged into a single object for the requested locale. The
     * requested locale is first decomposed into a hierarchy of sublocales. Generally, the data starts at the "root" locale
     * which is a sublocale shared by all locales. On top of the root data, it merges the the data from the less
     * specific sublocales to the more specific sublocales until the requested locale is reached. For example,
     * if the requested locale is "en-US", and the locale data loaded has information about the "root", the "en",
     * the "und-US", and the "en-US", the data will be merged in the following order:
     *
     * <ol>
     * <li>root
     * <li>en
     * <li>und-US
     * <li>en-US
     * </ol>
     *
     * See the [Utils.getSublocales](https://github.com/ilib-js/ilib-mono/tree/main/packages/ilib-common#utilsgetsublocales)
     * method for more details on how the sublocales are calculated.
     *
     * The merging is done according to the flags specified in the parameters. The default is to merge the data
     * for all the sublocales in order. If the `mostSpecific` flag is true, only the most specific locale data is
     * returned. If the `returnOne` flag is true, only the most locale-specific file found is returned. If the `crossRoots` flag
     * is true, the data is merged across all the roots. Once the data is merged, it is returned as a single object.
     * It is also cached in the cache for future use so that future calls to this method for the same locale and
     * basename will not need to load or merge the data again.
     *
     * If the "sync" flag is true, the data is loaded synchronously. This is useful in environments where the
     * loader supports synchronous operation such as nodejs. If the "sync" flag is false, the data is loaded asynchronously.
     * This is useful in all environments, as asynchronous loading is supported by all loaders. If the loader does
     * not support synchronous operation, but the "sync" flag is true anyways, then this method will first check the cache
     * for the data. If the data is already in the cache, for example because the ensureLocale method was previously
     * called and completed successfully, then the data will be returned immediately. If the data is not in the cache,
     * then this method will throw an error because synchronous loading is not supported.
     *
     * @param {Object} params parameters controlling the data loading
     * @param {string|Locale} params.locale the locale to load data for
     * @param {string} params.basename the basename of the data to load
     * @param {boolean} [params.sync] whether to load the data synchronously or asynchronously
     * @param {boolean} [params.mostSpecific] if true, only return the most specific locale data
     * @param {boolean} [params.returnOne] if true, only return the data for the most locale-specific file found
     * @param {boolean} [params.crossRoots] if true, merge data across all roots. Default is false.
     * @returns {Object|Promise.<Object>} the locale data if sync is true, or a promise to the locale data if sync is false
     * @throws {Error} if the data could not be loaded
     */
    loadData(params) {
        const {
            sync = this.sync,
            locale = getLocale(),
            basename,
            mostSpecific,
            returnOne,
            crossRoots
        } = params || {};

        // first check if it's in the cache
        // normalize the spec
        let loc = new Locale(locale);
        if (locale && locale !== "root" && !loc.getLanguage()) {
            loc = new Locale("und", loc.getRegion(), loc.getVariant(), loc.getScript());
        }

        if (sync && !this.loader.supportsSync() && !LocaleData.checkCache(loc.getSpec(), basename)) {
            const lm = new LocaleMatcher({
                locale: loc.getSpec(),
                sync: true
            });
            loc = new Locale(lm.getLikelyLocale());
            if (!LocaleData.checkCache(loc.getSpec(), basename)) {
                throw "Synchronous load was requested with a loader that does not support synchronous operation" +
                    " and the requested locale data was not already available in the cache.";
            }
        }

        // Get the list of roots to search
        const roots = this.getRoots(); // includes this.path at the end of it

        // Determine which MergedDataCache instance to use
        let mergedDataCache = this.mergedDataCache;
        const hasRuntimeOptions = mostSpecific !== undefined || returnOne !== undefined || crossRoots !== undefined;

        if (hasRuntimeOptions) {
            // Create a new instance with runtime merge options
            mergedDataCache = new MergedDataCache(this.loader, {
                mostSpecific,
                returnOne,
                crossRoots
            });
        }

        if (sync) {
            // Try to load data synchronously
            const result = mergedDataCache.loadMergedDataSync(loc.getSpec(), roots, basename);
            if (result === undefined) {
                throw new Error(`No locale data found for locale ${loc.getSpec()}`);
            }
            return result;
        } else {
            // Load data asynchronously
            return mergedDataCache.loadMergedData(loc.getSpec(), roots, basename);
        }
    }

    /**
     * Return the list of roots that this LocaleData instance is using to load data.
     * The roots returned by this method always has the package path at the end of
     * it as the last-chance fallback for locale data. All the other roots override
     * it.
     *
     * @returns {Array.<string>} the list of roots, in order
     */
    getRoots() {
        // this.path always goes at the end
        return LocaleData.getGlobalRoots().concat([this.path]);
    }

    /**
     * Return the list of roots shared by all of the instances of LocaleData. Entries
     * earlier in the list take precedence over entries later in the list.
     *
     * @static
     * @returns {Array.<string>} the list of roots shared by all instances of LocaleData
     */
    static getGlobalRoots() {
        var ilib = getIlib();
        if (!ilib.roots) {
            ilib.roots = [];
        }
        // this.path always goes at the end
        return ilib.roots;
    }

    /**
     * Add the path name to the beginning of the list of roots shared by all instances of
     * LocaleData. This method is static so that you can call it right at the beginning
     * of your app without creating an instance of LocaleData for any package.
     *
     * @param {string} the path to add at the beginning of the list
     */
    static addGlobalRoot(pathName) {
        if (typeof(pathName) !== 'string') return;
        var ilib = getIlib();
        if (!ilib.roots) {
            ilib.roots = [];
        } else {
            if (ilib.roots.indexOf(pathName) > -1) {
                // Already there. Don't need to add it again.
                return;
            }
        }
        // prepend it
        ilib.roots = [pathName].concat(ilib.roots);
    }

    /**
     * Remove the path from the list of roots shared by all instances of LocaleData.
     * If the path appears in the middle of the list, it will be removed from there
     * and the rest of the array will move down one.
     *
     * @param {string} the path to remove
     */
    static removeGlobalRoot(pathName) {
        if (typeof(pathName) !== 'string') return;
        var ilib = getIlib();
        if (!ilib.roots) {
            ilib.roots = [];
            return;
        }
        const element = ilib.roots.indexOf(pathName);
        if (element > -1) {
            return ilib.roots.splice(element, 1);
        }
    }

    /**
     * Clear the list of roots shared by all instances of LocaleData.
     */
    static clearGlobalRoots() {
        var ilib = getIlib();
        ilib.roots = [];
    }

    /**
     * Ensure that the data for a particular locale is loaded into the
     * cache asynchronously so that it is available for future synchronous use.<p>
     *
     * If the promise fulfills successfully, the data is cached in the
     * same caching object as if the data was loaded with `loadData` method.
     * Because of this, future callers are not required
     * to call `loadData` asynchronously, even when the loader does not
     * support synchronous loading because the data is already cached.
     * The idea behind `ensureLocale` is to pre-load the data into the
     * cache so that it is available for future synchronous use.<p>
     *
     * This method will look for files that are named [locale].js or
     * [locale].json where the locale is given as the full locale
     * specification. It looks for these files in the same list of roots
     * that `loadData` uses and merges the data it finds together. Data
     * from roots earlier in the list take precedence over data from roots
     * later in the list.<p>
     *
     * The files named for the locale should contain the data of multiple
     * types. The first level of properties in the data should be the sublocales
     * of the locale. Within the sublocale property is the the basename
     * of the data. Any properties within the basename property are the actual
     * locale data. For javascript files, the file should be either a commonjs or
     * ESM style module that exports a single default function that takes no
     * parameters. This function should return the type of data described above.<p>
     *
     * Example file "de-DE.js":
     *
     * <code>
     * export default function getLocaleData() {
     *     return {
     *         "root": {
     *             "phonefmt": {
     *                 "default": {
     *                     "example": "+1 211 555 1212",
     *                     etc.
     *                 }
     *             }
     *          },
     *          "de": {
     *             "localeinfo": {
     *                 "clock": "24",
     *                 etc.
     *             }
     *          },
     *          "und-DE": {
     *             "phonefmt": {
     *                 "default": {
     *                     "example": "030 12 34 56 78",
     *                 }
     *             },
     *             "numplan": {
     *                 "region": "DE",
     *                 "countryCode": "+49",
     *                 etc.
     *             }
     *          }
     *          "de-DE": {}
     *     };
     * };
     * </code>
     *
     * The idea behind the sublocales is that the data for each sublocale can
     * be cached separately so that if a locale is requested that uses that
     * sublocale, it is available. For example, if the "de-DE" locale is
     * loaded with this method (as in the example above), the code may request
     * locale data for the "de" locale or the "und-DE" locale separately and it
     * will get the right data. Most
     * usefully, the root locale is given separately, so any requested locale
     * that does not match any of the sublocales can use the root locale data.<p>
     *
     * If the data is loaded successfully, the Promise returned from this method
     * will resolve to `true`.
     * If there was an error loading the files, or if no files were found to
     * load, the Promise will resolve to `false`. Both results are stored in
     * the cache so that future calls to this method for the same locale will
     * not need to load the data again.<p>
     *
     * @param {Locale|string} locale the Locale object or a string containing
     * the locale spec
     * @param {Array.<string>=} otherRoots an array of extra roots to search (other than
     * the global roots) or undefined for no other roots
     * @returns {Promise} a promise to load the data with the resolved
     * value of true if the load was successful, and false if not
     * @fulfil {boolean} true if the locale data was successfully loaded or
     * false if it could be found
     * @reject {Error} if there was an error while loading the data
     */
    static ensureLocale(locale, otherRoots) {
        // Validate parameters - throw Error objects for invalid parameters
        if (locale === null) {
            throw new Error("Invalid locale parameter to ensureLocale");
        }
        if (locale === undefined) {
            throw new Error("Invalid parameter to ensureLocale");
        }
        if (typeof(locale) !== 'string' && typeof(locale) !== 'object') {
            throw new Error("Invalid parameter to ensureLocale");
        }

        // Return async implementation
        return this._ensureLocaleAsync(locale, otherRoots);
    }

    static async _ensureLocaleAsync(locale, otherRoots) {

        let loc = (typeof(locale) === 'string') ? new Locale(locale) : locale;
        if (locale && locale !== "root" && !loc.getLanguage()) {
            loc = new Locale("und", loc.getRegion(), loc.getVariant(), loc.getScript());
        }

        // Validate that we have a valid locale object
        if (!loc || typeof loc.getSpec !== 'function') {
            throw new Error("Invalid locale parameter to ensureLocale");
        }

        // Get the list of roots to search
        const roots = LocaleData.getGlobalRoots().concat(otherRoots || []);
        if (roots.length === 0) {
            roots.push("./locale");
        }

        // Get shared MergedDataCache instance for this operation
        const mergedDataCache = getSharedMergedDataCache();
        if (!mergedDataCache) {
            throw new Error("No loader available for this platform");
        }

        try {
            // Use MergedDataCache to load all locale-specific data for the locale
            // This will look for [locale].js and [locale].json files and cache all the data
            const result = await mergedDataCache.loadLocaleData(loc.getSpec(), roots);

            // Return true if any data was loaded and cached
            return result;
        } catch (error) {
            // If MergedDataCache failed to load the data, return false
            // MergedDataCache should handle the case where no locale-specific files are found
            if (error.message && error.message.includes("No locale data found")) {
                return false;
            }

            // Re-throw unexpected errors
            throw error;
        }
    }

    /**
     * Check to see if the given data basename for the given locale is available
     * in the cache. This method will return true if the locale data exists in the
     * the cache already or if it is known that the requested data does not exist.<p>
     *
     * The following situations can occur:
     *
     * <ul>
     * <li>Data available. The data for the locale was previously loaded and is
     * available. Returns true.
     * <li>No data. The data for the locale was previously loaded, but there was
     * specific data for this locale. Still returns true.
     * <li>Not available. The data for the locale was not previously loaded by
     * any of the methods and the next call to `loadData` will attempt to load
     * it. Returns false.
     * </ul>
     *
     * Data can be considered to be "previously loaded" through any of the following:
     *
     * <ul>
     * <li>`loadData` already attempted to load it, whether or not that attempt
     * succeeded
     * <li>The entire locale was already loaded using `ensureLocale`
     * <li>All the data was already provided statically from the application
     * using a call to `cacheData`.
     * </ul>
     *
     * @param {string} locale full locale of the data to check
     * @param {string|undefined} basename the basename of the data to check. If
     * undefined, it will check if any data for any basename is available for
     * the given locale
     * @returns {boolean} true if the data is available, false otherwise
     */
    static checkCache(locale, basename) {
        if (typeof(locale) !== 'string' || (basename && typeof(basename) !== 'string')) {
            return false;
        }

        // Get the list of roots to search
        const roots = LocaleData.getGlobalRoots();
        if (roots.length === 0) {
            roots.push("./locale");
        }

        // Get shared MergedDataCache instance for this operation
        const mergedDataCache = getSharedMergedDataCache();
        if (!mergedDataCache) {
            return false;
        }

        // Check if data exists for the specific basename
        return mergedDataCache.hasMergedData(locale, roots, basename);
    }

    /**
     * The prepopulated data should have the following structure:
     *
     * <pre>
     * {
     *    "locale": {
     *        "basename": {
     *            [ ... whatever data ... ]
     *        }
     *    }
     * }
     * </pre>
     *
     * Replace the following in the above structure:
     * <ul>
     * <li>locale: the full locale specifier for the data. The data may have multiple
     * locales at the top level. Data that is only dependent on a region and not the language
     * or script, such as the time zone for the region, should use the language tag "und" (meaning
     * "undefined" language). eg. the timezone for the Netherlands should appear in
     * "und-NL".timezone.
     * <li>basename: the type of this particular data. This should be an object that contains
     * the settings for that locale. A locale property can contain data for multiple base
     * names at the same time. For example, it may contain data about phone number parsing
     * (basename "PhoneNumber") and phone number formatting (base name "PhoneFmt").
     * </ul>
     *
     * @param {Object} data the locale date in the above format
     * @param {string} root the root from which this data was loaded
     */
    static cacheData(data, root) {
        if (typeof(data) !== 'object') {
            return;
        }

        // Get shared MergedDataCache instance for this operation
        const mergedDataCache = getSharedMergedDataCache();
        if (!mergedDataCache) {
            return;
        }

        // Use MergedDataCache.storeData to store the data
        mergedDataCache.storeData(data, root);
    }

    /**
     * Clear the locale data cache. This function is intended to be used by unit testing
     * to guarantee that the cache is clear before starting a new test.
     */
    static clearCache() {
        // Clear MergedDataCache's cache
        const mergedDataCache = getSharedMergedDataCache();
        if (mergedDataCache) {
            mergedDataCache.clearMergedData();
            // Also clear the parsed data cache since cacheData stores data there
            mergedDataCache.parsedDataCache.clearAllParsedData();
        }

        // Also clear the underlying DataCache for backward compatibility
        DataCache.clearDataCache();
    }
}

export default LocaleData;
