/*
 * FakeLoader.js - a dummy loader for fooling webpack during testing
 *
 * Copyright © 2023 JEDLSoft
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

import Loader from './Loader.js';

/**
 * Class that pretends to be a loader, but really isn't.
 *
 * @extends Loader
 */
class FakeLoader extends Loader {
    /**
     * Create a loader instance.
     *
     * @param {Object} options
     * @constructor
     */
    constructor(options) {
        super(options);
    }

    /**
     * Return an array of platform names for the platforms that this
     * loader supports.
     * @returns {Array.<string>} the names of the platform.
     */
    getPlatforms() {
        return ["mock"];
    }

    /**
     * Return a string identifying this type of loader.
     * @returns {string} the name of this type of loader
     */
    getName() {
        return "Fake Loader";
    }

    /**
     * Return true if this loader supports synchronous operation.
     * Loaders for particular platforms should override this
     * method if they support synchronous and return true.
     *
     * @returns {boolean} true if this loader supports synchronous
     * operation, or false otherwise.
     */
    supportsSync() {
        return true;
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
     * file types will be loaded as UTF-8 text.
     *
     * @param {string} pathName a file name to load
     * @param {Object} options options guiding the load, as per above
     * @returns {Promise|string|undefined} A promise to load the file contents
     * in async mode or a string which is the contents of the file in sync mode.
     * If this method returns undefined or the promise resolves to the value
     * undefined, this indicates that the file did not exist or could not be
     * loaded.
     */
    loadFile(pathName, options) {
    }
};

export default FakeLoader;