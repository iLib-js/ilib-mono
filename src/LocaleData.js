/*
 * LocaleData.js - utility class to load ilib locale data from a list
 * of root directories
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

import { getPlatform, getLocale, top } from 'ilib-env';
import LoaderFactory from 'ilib-loader';
import { Utils, JSUtils, Path } from 'ilib-common';
import JSON5 from 'json5';

import DataCache from './DataCache';

function getIlib() {
    var globalScope = top();
    if (!globalScope.ilib) {
        globalScope.ilib = {};
    }
    return globalScope.ilib;
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
 * <h2>Caching</h2>
 *
 * The cache can be filled in two ways:
 *
 * <ol>
 * <li>By explicitly calling the `cacheData()` method. This will prepopulate
 * the cache using statically loaded data for later use. See the `cacheData`
 * method docs for information on the format.
 * <li>When a file is loaded and parsed, the results are stored in the
 * the cache so that subsequent requests for the same data are relatively
 * fast.
 * </ol>
 *
 * The cache contains information about various types of data, as well as
 * various locales. Files that contain data about an entire locale would
 * typically contain multiple types of data. The data in them would be cached
 * and returned to the right caller.
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
 * <li>Locale data split into constiuent locale parts and data types
 * </ol>
 *
 * Files named for the entire locale appear in the top of the root and have
 * the form "<locale-spec>.json" or "<locale-spec>.js". For example, data for
 * the Danish locale for Denmark would appear in "<root>/da-DK.json" file,
 * and would contain data for multiple data types.<p>
 *
 * Data that is split in to its locale parts exists in directories named after
 * the locale parts in files of the form "<datatype>.json" or "<datatype>.js".
 * For example, data for number formatting in the locale Danish for Denmark
 * would appear in the file "<root>/da/DK/numfmt.json".<p>
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
 * <li> &lt;root>/numfmt.json -> contains grouping separator character is comma "," which is
 *  default for the world. eg. 100,000
 * <li>&lt;root>/it/numfmt.json -> contains the grouping separator char period "." for any
 * place that speaks Italian, including Italy, Switzerland, San Marino, and Vatican City
 * as well as small parts of Austria, Slovenia, and Croatia. eg. 100.000
 * <li>&lt;root>/it/CH/numfmt.json -> contains the grouping separator char apostrophe "’"
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
     * The options can contain the following properties:
     *
     * <ul>
     * <li>path {string} (required) - The path to the local package's locale data on disk
     * <li>sync {boolean} - whether this locale data instance should operate in synchronous
     * mode by default. (Default value: false)
     * <li>useCache {boolean} - whether this locale data instance should use the locale
     * data cache or it should load the data each time. Specifying `false` for this option
     * will slow down constructors as it loads the same files again and again but it reduces
     * the memory footprint which may be more important than speed for small low-memory
     * devices. Default value: true
     * </ul>
     *
     * @param {string} packageName the unique name of the calling package. (eg. "LocaleInfo")
     * @param {Object} options options controlling the operation of this locale data
     * instance, as detailed above
     * @constructor
     */
    constructor(packageName, options) {
        if (!options || !options.path || !packageName) {
            throw "Missing options to LocaleData constructor";
        }
        let {
            sync = false,
            path
        } = options;

        this.loader = LoaderFactory();
        this.sync = typeof(sync) === "boolean" && sync && (!this.loader || this.loader.supportsSync());
        this.cache = new DataCache({packageName});
        this.logger = log4js.getLogger("ilib-localedata");
        this.path = path;
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
     * Find locale data or load it in. If the data with the given name is preassembled, it will
     * find the data in ilib.data. If the data is not preassembled but there is a loader function,
     * this function will call it to load the data. Otherwise, the callback will be called with
     * undefined as the data. This function will create a cache under the given class object.
     * If data was successfully loaded, it will be set into the cache so that future access to
     * the same data for the same locale is much quicker.<p>
     *
     * The parameters can specify any of the following properties:<p>
     *
     * <ul>
     * <li><i>basename</i> - String. The base name of the file being loaded. Default: ResBundle
     * <li><i>locale</i> - Locale. The locale for which data is loaded. Default is the current locale.
     * <li><i>replace</i> - boolean. When merging json objects, this parameter controls whether to merge arrays
     * or have arrays replace each other. If true, arrays in child objects replace the arrays in parent
     * objects. When false, the arrays in child objects are concatenated with the arrays in parent objects.
     * <li><i>returnOne</i> - return only the first file found. Do not merge many locale data files into one.
     * <li><i>sync</i> - boolean. Whether or not to load the data synchronously
     * </ul>
     *
     * @param {Object} params Parameters configuring how to load the files (see above)
     * @returns {Promise|Object} the requested data or a promise to load the requested data
     * @fulfil {Object} the locale data
     * @reject {Error} if the data could not be loaded
     */
    loadData(params) {
        const {
            sync = this.sync,
            locale = getLocale(),
            basename
        } = params || {};

        // first check if it's in the cache
        // const locales = Utils.getSublocales(locale).map((sublocale) => { locale: sublocale });

        // then check how to load it
        // then load it
        const files = Utils.getLocFiles(locale, basename + ".json").map(
            file => {
                return {
                    name: file
                };
            }
        );
        const roots = this.getRoots(); // includes this.path at the end of it
        let promise;

        if (sync) {
            roots.forEach((root) => {
                const count = files.filter(file => !file.data).length;
                if (count) {
                    const fileNames = files.map((file) => {
                        return file.data ? undefined : Path.join(root, file.name);
                    });
                    const data = this.loader.loadFiles(fileNames, {sync});
                    data.forEach((datum, i) => {
                        if (datum) {
                            files[i].data = JSON5.parse(datum);
                        }
                    });
                }
            });

            const merged = files.map(file => file.data).reduce((previous, current) => {
                return JSUtils.merge(previous, current || {});
            }, {});

            return merged;
        } else {
            promise = Promise.resolve(true);
            roots.forEach((root) => {
                promise = promise.then(() => {
                    const count = files.filter(file => !file.data).length;
                    if (count) {
                        const fileNames = files.map((file) => {
                            return file.data ? undefined : Path.join(root, file.name);
                        });
                        return this.loader.loadFiles(fileNames, {sync}).then((data) => {
                            data.forEach((datum, i) => {
                                if (datum) {
                                    files[i].data = JSON5.parse(datum);
                                }
                            });
                        });
                    }
                });
            });
            return promise.then(() => {
                return files.map(file => file.data).reduce((previous, current) => {
                    return JSUtils.merge(previous, current || {});
                }, {});
            });
        }

        // then cache it
        // extract the relevants parts and return it
    };

    getRoots() {
        // this.path always goes at the end
        return LocaleData.getGlobalRoots().concat([this.path]);
    }

    static getGlobalRoots() {
        var ilib = getIlib();
        if (!ilib.roots) {
            ilib.roots = [];
        }
        // this.path always goes at the end
        return ilib.roots;
    }

    static addGlobalRoot(pathName) {
        if (typeof(pathName) !== 'string') return;
        var ilib = getIlib();
        if (!ilib.roots) {
            ilib.roots = [];
        }
        // prepend it
        ilib.roots = [pathName].concat(ilib.roots);
    }

    static removeGlobalRoot(pathName) {
        if (typeof(pathName) !== 'string') return;
        var ilib = getIlib();
        if (!ilib.roots) {
            ilib.roots = [];
            return;
        }
        const element = ilib.roots.indexOf(pathName);
        if (element > -1) {
            ilib.roots.splice(element, 1);
        }
    }

    static clearGlobalRoots() {
        var ilib = getIlib();
        ilib.roots = [];
    }

    /**
     * Ensure that the data for a particular locale is loaded into the
     * cache so that it is available for future synchronous use.<p>
     *
     * If the method completes successfully, future callers are not required
     * to call `loadData` asynchronously, even though the loader does not
     * support synchronous loading. If the loader for the current platform
     * supports synchronous loading, this method will return a Promise that
     * resolves to true immediately because `loadData` can return the data
     * on-demand and it does not need to be pre-loaded.<p>
     *
     * This method will look for files that are named [locale].js or
     * [locale].json where the locale is given as the full locale
     * specification. It looks for these files in the same list of roots
     * that `loadData` uses and merges the data it finds together. Data
     * from roots earlier in the list take precedence over data from roots
     * later in the list.<p>
     *
     * The files named for the locale should contain the data of multiple
     * types. The first level of properties in the data should be the basename
     * for the type of data, and the value of that property is the actual
     * locale data. For javascript files, the file should be a commonjs or
     * ESM style module that exports a function that takes no parameters.
     * This function should return this type of data.<p>
     *
     * If the data is loaded successfully, the Promise will resolve to `true`.
     * If there was an error loading the files, or if no files were found to
     * load, the Promise will resolve to `false`.<p>
     *
     * @param {Locale|string} locale the Locale object or a string containing
     * the locale spec
     * @returns {Promise} a promise to load the data with the resolved
     * value of true if the load was successful, and false if not
     */
    static ensureLocale(locale) {
        if (this.loader.isSync()) {
            return Promise.resolve(true);
        }
        // TODO: not implemented yet
        return Promise.resolve(false);
    }

    /**
     * Check to see if the given data type for the given locale is available in the cache.
     *
     * @param {string} packageName
     * @param {string} locale
     * @param {string} basename
     * @returns {boolean} true if the data is available, false otherwise
     */
    static checkCache(packageName, locale, basename) {
        // TODO: not implemented yet
        return true;
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
     */
    static cacheData(data) {
        // TODO: not implemented yet
    }

    /**
     * Clear the locale data cache. This function is intended to be used by unit testing
     * to guarantee that the cache is clear before starting a new test.
     */
    static clearCache() {
        // TODO: not implemented yet
    }
}

export default LocaleData;
