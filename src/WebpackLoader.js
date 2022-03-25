/*
 * WebpackLoader.js - Loader implementation for webpack'ed ilib on the web
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

import Loader from './Loader';

/**
 * Class that loads files under nodejs.
 *
 * All loaders must support asynchronous operation. That is, they take
 * a file name or a list of file names and return a promise to load
 * them. Some loader may optionally also support synchronous operation
 * as well if the locale files are located locally.
 *
 * @extends Loader
 */
class WebpackLoader extends Loader {
    /**
     * Create a loader instance.
     *
     * @param {Object} options
     * @constructor
     */
    constructor(options) {
        super(options);

        this.logger = log4js.getLogger("ilib-loader");
    }

    /**
     * Return an array of platform names for the platforms that this
     * loader supports.
     * @returns {Array.<string>} the names of the platform.
     */
    getPlatforms() {
        return ["browser"];
    }

    /**
     * Return a string identifying this type of loader.
     * @returns {string} the name of this type of loader
     */
    getName() {
        return "Webpack Loader";
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
     * @param {string} pathName a file name to load
     * @param {Object} options options guiding the load, as per above
     * @returns {Promise|undefined} A promise to load the file contents
     * in async mode. If this method returns undefined or the promise resolves
     * to the value undefined, this indicates that the file did not exist or
     * could not be loaded.
     */
    loadFile(pathName, options) {
        if (!pathName) return undefined;
        this.logger.trace(`Loading file ${pathName} from webpack`);

        let promise;

        switch (pathName) {
            // This special macro will get replaced in the ilibdata-webpack-loader with
            // case statements for each locale js file so that webpack can make separate
            // bundles for each one of those files when in dynamic load mode. In static
            // (assembled) mode, this will get replaced with require calls that cause
            // the data to be put into one giant webpack bundle.

            // !loadLocaleData

            default:
                // This is just here to prevent webpack from removing the contents if
                // there are no cases. Otherwise, it will think this switch statement
                // is "unused" or "dead" code.
                this.logger.warn("WebpackLoader.loadFile: Should never happen");
                break;
        }

        return promise;
    }
};

export default WebpackLoader;