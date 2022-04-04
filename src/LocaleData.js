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
import { Utils, Path } from 'ilib-common';

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
 * <ol>
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
 * @class
 */
class LocaleData {
    /**
     * Create a locale data instance.
     *
     * @param {Object} options
     * @constructor
     */
    constructor(options) {
        if (!options || !options.path || !options.name) {
            throw "Missing options to LocaleData constructor";
        }
        let {
            sync = false,
            path,
            name
        } = options;

        this.loader = LoaderFactory();
        this.sync = typeof(sync) === "boolean" && sync && (!this.loader || this.loader.supportsSync());
        this.cache = new DataCache({packageName: name});
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
        const files = Utils.getLocFiles(locale, basename).map(
            file => {
                name: file
            }
        ).forEach((file, i) => {
            file.index = i;
        });
        const roots = [this.getRoots(), ...this.path];
        const extensions = [".js", ".json"];
        let promise;

        if (!sync) {
            promise = new Promise((resolve) => {
                resolve(true);
            });
        }
        extensions.forEach((extension) => {
            roots.forEach((root) => {
                const filesNeedingData = files.filter(file => !file.data).map();
                if (filesNeedingData.length < 1) {
                    break;
                }
                const filelist = filesNeedingData.map(file => Path.join(root, file.name + extension));
                if (sync) {
                    const results = this.loader.loadFiles(filelist, {sync});
                    results.forEach((result, i) => {
                        filesNeedingData[i].data = result;
                    });
                } else {
                    promise.then(() => {
                        return this.loader.loadFiles(filelist, {sync}).then((results) => {
                            results.forEach((result, i) => {
                                filesNeedingData[i].data = result;
                            })
                        });
                    });
                }
            });
        });

        // merge the loaded files
        if (sync) {
            const localedata = result.reduce((previous, current) => {
                
            }, {});
        } else {
            result.then();
        }
        
        // then cache it
        // extract the relevants parts and return it
    };

    getRoots() {
        var ilib = getIlib();
        if (!ilib.roots) {
            ilib.roots = [];
        }
        return ilib.roots;
    }

    addRoot(pathName) {
        logger.trace(`Added root ${pathName} to the list of global roots`);
        var ilib = getIlib();
        if (!ilib.roots) {
            ilib.roots = [];
        }
        ilib.roots.push(pathName);
    }

    removeRoot(pathName) {
        var ilib = getIlib();
        if (!ilib.roots) {
            ilib.roots = [];
            return;
        }
        const element = ilib.roots.find((root) => root === pathName);
        if (element) {
            logger.trace(`Removed root ${pathName} from the list of global roots`);
            ilib.roots.splice(element, 1);
        }
    }

    clearRoots() {
        logger.trace(`The list of global roots has been reset.`);
        var ilib = getIlib();
        ilib.roots = [];
    }

    /**
     * The prepopulated data should have the following structure:
     * <code>
     * {
     *    "language: {
     *        "script: {
     *            "region: {
     *                "datatype": {
     *                    [ ... whatever data ... ]
     *                }
     *            }
     *        }
     *    }
     * }
     * </code>
     *
     * Replace the following in the above structure:
     * <ul>
     * <li>language: the language part of the locale specifier. Every piece of locale
     * data needs at least a language. Data that is only dependent on the language, and not
     * the country or region should go into this level.
     * <li>script: the script part of the locale spec. This can be left out if
     * the locale does not have a script in it. eg. "en-US" has no script tag in it,
     * so it should have an "en" language object, with a "US" region object directly
     * inside of it.
     * <li>region: the region part of the locale spec. Thus can be left out if
     * the locale does not have a region in it. (eg. "da" is only a language tag with
     * no region or script in it.) Data that is only dependent on a region and not the language
     * or script, such as the time zone for the region, should use the language tag "und" (meaning
     * "undefined" language). eg. the timezone for the Netherlands should appear in
     * und.NL.timezone.
     * <li>datatype: the type of data. This should be an object that contains the settings
     * for the locale.
     * </ul>
     */
    cacheData(data) {
    }

    /**
     * Clear the locale data cache. This function is intended to be used by unit testing
     * to guarantee that the cache is clear before starting a new test.
     */
    clear() {
    }
}

export default LocaleData;
