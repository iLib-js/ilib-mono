/*
 * MockLoader.js - a mock loader for unit testing
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

import Loader from '../src/Loader.js';

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
export default class MockLoader extends Loader {
    /**
     * Create a loader instance.
     *
     * @param {Object} options
     */
    constructor(options) {
        super(options);
    }

    getPlatforms() {
        return ["mock"];
    }

    getName() {
        return "Mock Loader";
    }

    supportsSync() {
        return true;
    }

    loadFile(pathName, options) {
        let { sync } = options || {};
        sync = typeof(sync) === "boolean" ? sync : this.sync;

        let text = pathName && pathName.length ? pathName : undefined;
        if (pathName === "unknown.json") {
            text = undefined;
        }

        if (sync) {
            return text;
        }

        return new Promise((resolve, reject) => setTimeout(resolve, 100, text));
    }
};
