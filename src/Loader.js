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

/**
 * @class
 * Superclass of the loader classes that contains shared functionality.
 *
 * All loaders must support asynchronous operation. That is, they take
 * a file name or a list of file names and return a promise to load
 * them. Some loader may optionally also support synchronous operation
 * as well if the locale files are located locally.
 *
 * @private
 * @constructor
 */
export default class Loader {
    /**
     * Create a loader instance.
     *
     * @param {Object} options
     */
    constructor(options) {
        // console.log("new Loader instance");
        this.protocol = "file://";
        let { paths } = options || {};
        this.paths = paths;
    }

    /**
     * @abstract
     * Return an array of platform names for the platforms that this
     * loader supports.
     * @returns {Array.<string>} the names of the platform.
     */
    getPlatforms() {
        return [];
    }

    /**
     * @abstract
     * Return a string identifying this type of loader.
     * @returns {string} the name of this type of loader
     */
    getName() {
    }

    /**
     * @abstract
     * Return true if this loader supports synchronous operation.
     * Loaders for particular platforms should override this
     * method if they support synchronous and return true.
     *
     * @returns {boolean} true if this loader supports synchronous
     * operation, or false otherwise.
     */
    supportsSync() {
        return false;
    }

    /**
     * Add an array of paths to search for files.
     * @param {Array.<string>} paths to search
     */
    addPaths(paths) {
        this.paths = this.paths.concat(paths);
    }

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
     * @param {Array.<string>} paths an array of file names to load
     * @param {Object} options options guiding the load, as per above
     * @returns {Array.<string|undefined>} An array where each element is either
     * a string which is the contents of a file, or undefined to indicate that
     * the file did not exist or could not be loaded.
     */
    loadFiles(paths, options) {
        const { sync } = options;
        let values = [];
        if (paths) {
            if (typeof(sync) === "boolean" && sync) {
                for (var i = 0; i < paths.length; i++) {
                    try {
                        values[i] = this.loadFile(paths[i], options);
                    } catch (e) {
                        // ignore for now
                    }
                }
                return values;
            } else {
                return Promise.allSettled(paths.map((path) => {
                    // should return a Promise
                    return this.loadFile(path, options);
                })).then((values) => {
                    return values.map((value) => {
                        return (value.status === "fulfilled") ? value.value : undefined;
                    });
                });
            }
        }
    }

    listAvailableFiles() {
    }
};
