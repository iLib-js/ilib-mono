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

import { readFile, readFileSync } from 'fs';
import Loader from './Loader';

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
export default class NodeLoader extends Loader {
    /**
     * Create a loader instance.
     *
     * @param {Object} options
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

    loadFile(pathName, options) {
        let { sync } = options || {};
        sync = typeof(sync) === "boolean" ? sync : this.sync;

        if (sync) {
            var text = readFileSync(pathName, "utf-8");
            return text;
        }

        return readFile(pathName, "utf-8");
    }
};
