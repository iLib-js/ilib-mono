/*
 * Loader.js - a loader for running under Nodejs
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

import fs from 'fs';
import { readFileSync } from 'fs';
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
class NodeLoader extends Loader {
    /**
     * Create a loader instance.
     *
     * @param {Object} options
     * @constructor
     */
    constructor(options) {
        super(options);

        // make sure this works on all versions of node
        try {
            // modern versions of node have the promise code already in it
            fsPromise = require("fs/promise");
            this.readFile = fsPromise.readFile;
        } catch(e) {
            // polyfill for older versions of node
            this.readFile = (...arg) => new Promise((resolve, reject) => {
                fs.readFile(...arg, (err, data) => err ? reject(err) : resolve(data))
            });
        }

        this.logger = log4js.getLogger("ilib-loader");
    }

    /**
     * Return an array of platform names for the platforms that this
     * loader supports.
     * @returns {Array.<string>} the names of the platform.
     */
    getPlatforms() {
        return ["nodejs", "webos"];
    }

    /**
     * Return a string identifying this type of loader.
     * @returns {string} the name of this type of loader
     */
    getName() {
        return "Nodejs Loader";
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
     * @param {string} pathName a file name to load
     * @param {Object} options options guiding the load, as per above
     * @returns {Promise|string|undefined} A promise to load the file contents
     * in async mode or a string which is the contents of the file in sync mode.
     * If this method returns undefined or the promise resolves to the value
     * undefined, this indicates that the file did not exist or could not be
     * loaded.
     */
    loadFile(pathName, options) {
        if (!pathName) return undefined;
        let { sync } = options || {};
        sync = typeof(sync) === "boolean" ? sync : this.sync;

        if (sync) {
            try {
                var text = readFileSync(pathName, "utf-8");
                return text;
            } catch (e) {
                return undefined;
            }
        }
        return this.readFile(pathName, "utf-8").catch((e) => {
            this.logger.trace(e);
        });
    }
};

export default NodeLoader;