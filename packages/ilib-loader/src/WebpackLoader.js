/*
 * WebpackLoader.js - Loader implementation for webpack'ed ilib
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

import Loader from './Loader.js';

/**
 * Class that loads files under Webpack.
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

        this.sync = false;
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
     * There are no options that this loader uses, so the options parameter is
     * ignored.<p>
     *
     * The file loaded must be a javascript file named for the full BCP-47 locale
     * spec (eg. "zh-Hans-CN.js") or "root.js" for the generic shared data. The
     * files should be constructed before webpack is
     * called. In order to include the data file automatically in webpack, you must
     * create a resolver alias called "calling-module" to point to the location where
     * the file was generated. Example setting in webpack.config.js
     *
     * <code>
     *    "resolve": {
     *        "alias": {
     *            "calling-module": "my-module/locale"
     *        }
     *    }
     * </code>
     *
     * The value may be the name of your module with an optional subpath, or the
     * absolute path to the directory where the files are stored. Without this alias,
     * no files will be included and the webpack build will fail.<p>
     *
     * For files that end with a ".js" or ".mjs" extension, this method should
     * treat the file as a Javascript module and load it accordingly. All other
     * file types will be loaded as UTF-8 text.
     *
     * @param {string} pathName a file name to load
     * @param {Object} options options guiding the load, as per above
     * @returns {Promise|undefined} A promise to load the file contents
     * in async mode. If this method returns undefined or the promise resolves
     * to the value undefined, this indicates that the file did not exist or
     * could not be loaded.
     */
    loadFile(pathName, options) {
        if (!pathName || typeof(pathName) !== 'string') return undefined;
        const { sync } = options || {};
        if (typeof(sync) === "boolean" && sync && !this.sync) {
            throw new Error("This loader does not support synchronous loading of data.");
        }
        this.logger.trace(`Loading file ${pathName} from webpack asynchronously`);

        const fileName = Path.basename(pathName);

        return import(
            /* webpackInclude: /([a-z][a-z](-[A-Z][a-z][a-z][a-z])?(-[A-Z][A-Z])?|root).js(on)?$/ */
            /* webpackChunkName: "ilib.[request]" */
            /* webpackMode: "lazy" */
            `calling-module/${fileName}`
        ).catch((e) => {
            this.logger.trace(e);
            return undefined;
        });
    }
};

export default WebpackLoader;