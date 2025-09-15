/*
 * Loader.js - shared data loader implementation
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
import allSettled from 'promise.allsettled';

/**
 * @class Superclass of the loader classes that contains shared functionality.
 *
 * Loaders are the layer of code that knows how to load files from where-ever
 * they are stored based on the platform and environment. They do not know
 * anything about the file contents other than that they are in plain text
 * and they are encoded in UTF-8.<p>
 *
 * All loaders must support asynchronous operation. That is, they take
 * a file name or a list of file names and return a promise to load
 * them. Some loader may optionally also support synchronous operation
 * as well if the locale files are located locally and the platform supports
 * it.<p>
 */
class Loader {
    /**
     * Create a loader instance.
     *
     * @param {Object} options
     * @constructor
     */
    constructor(options) {
        // console.log("new Loader instance");
        this.protocol = "file://";
        let { paths } = options || {};
        this.sync = false;
        this.paths = paths;

        this.logger = log4js.getLogger("ilib-loader");
    }

    /**
     * Return an array of platform names for the platforms that this
     * loader supports.
     * @abstract
     * @returns {Array.<string>} the names of the platform.
     */
    getPlatforms() {
        return [];
    }

    /**
     * Return a string identifying this type of loader.
     * @abstract
     * @returns {string} the name of this type of loader
     */
    getName() {}

    /**
     * Return true if this loader supports synchronous operation.
     * Loaders for particular platforms should override this
     * method if they support synchronous and return true.
     *
     * @abstract
     * @returns {boolean} true if this loader supports synchronous
     * operation, or false otherwise.
     */
    supportsSync() {
        return false;
    }

    /**
     * Set synchronous mode for loaders that support it. In synchronous
     * mode, loading a file will be done synchronously if the "sync"
     * option is not explicitly given to loadFile or loadFiles. For
     * loaders that do not support synchronous loading, this method has
     * no effect. Files will continue to be loaded asynchronously.
     */
    setSyncMode() {
        if (this.supportsSync()) {
            this.sync = true;
        }
    }

    /**
     * Set asynchronous mode. In asynchronous
     * mode, loading a file will be done asynchronously if the "sync"
     * option is not explicitly given to loadFile or loadFiles. This
     * is the default behaviour, and loaders will behave this way when
     * they are first created.
     */
    setAsyncMode() {
        this.sync = false;
    }

    /**
     * Return the current sync mode.
     * @returns {boolean} true if the loader is in synchronous mode, false otherwise.
     */
    getSyncMode() {
        return this.sync;
    }

    /**
     * Add an array of paths to search for files.
     * @param {Array.<string>} paths to search
     */
    addPaths(paths) {
        this.paths = this.paths.concat(paths);
    }

    /**
     * Load an individual file specified by the path name, and return its
     * content. If the file does not exist or could not be loaded, this method
     * will return undefined.<p>
     *
     * The options object may contain any of these properties:
     * <ul>
     * <li>sync {boolean} - when true, load the file synchronously, else load
     * it asynchronously. Loaders that do not support synchronous loading will
     * ignore this option.
     * </ul>
     *
     * For files that end with a ".js" or ".mjs" extension, this method should
     * treat the file as a Javascript module and load it accordingly. All other
     * file types will be loaded as UTF-8 text.<p>
     *
     * For Javascript modules, the module is returned from this method. This
     * may either be a function exported from the module, or an object containing
     * a "default" property which is a function exported from the module. This
     * exported function should be called with no arguments and should return
     * the locale data for the locale.
     *
     * @abstract
     * @param {string} pathName a file name to load
     * @param {Object} options options guiding the load, as per above
     * @returns {Promise|string|undefined} A promise to load the file contents
     * in async mode or a string which is the contents of the file in sync mode.
     * If this method returns undefined or the promise resolves to the value
     * undefined, this indicates that the file did not exist or could not be
     * loaded.
     */
    loadFile(pathName, options) {}

    /**
     * Load a number of files specified by an array of file names, and return an
     * array of content. The array of content is in the same order as the file
     * names such that the n'th element of the return array is the content
     * of the file with the n'th file name in the paths parameter. If any
     * particular file does not exist or could not be loaded, that entry in the
     * return array will be undefined.<p>
     *
     * The options object may contain any of these properties:
     * <ul>
     * <li>sync {boolean} - when true, load the files synchronously, else load
     * them asynchronously. Loaders that do not support synchronous loading will
     * ignore this option.
     * </ul>
     *
     * The loadFiles method depends on the subclass to implement the abstract
     * method loadFile to load individual files.
     *
     * @param {Array.<string>} paths an array of file names to load
     * @param {Object} options options guiding the load, as per above
     * @returns {Promise|Array.<string>|undefined} A promise to load the
     * array of files or an array where each element is either
     * a string which is the contents of a file. If any element of the returned
     * array or the array that that the promise resolves to is undefined, this
     * indicates that that particular file did not exist or could not be loaded.
     */
    loadFiles(paths, options) {
        let { sync } = options || {};
        if (typeof(sync) === "boolean" && sync && !this.sync) {
            throw new Error("This loader does not support synchronous loading of data.");
        }
        sync = typeof(sync) === "boolean" ? sync : this.sync;
        let values = [];
        if (paths) {
            if (typeof(sync) === "boolean" && sync) {
                for (var i = 0; i < paths.length; i++) {
                    try {
                        values[i] = this.loadFile(paths[i], options);
                    } catch (e) {
                        // ignore for now
                        this.logger.trace(e);
                    }
                }
                return values;
            } else {
                return allSettled(paths.map((path) => {
                    // should return a Promise
                    return path ? this.loadFile(path, options) : undefined;
                })).then((values) => {
                    return values.map((value) => {
                        return (value.status === "fulfilled") ? value.value : undefined;
                    });
                });
            }
        }
    }
};

export default Loader;