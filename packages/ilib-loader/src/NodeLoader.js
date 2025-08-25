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
import path from 'path';
import log4js from '@log4js-node/log4js-api';
import Loader from './Loader.js';
import { requireShim } from './shim/RequireShim.js';

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

        this.logger = log4js.getLogger("ilib-loader");

        // make sure this works on all versions of node
        try {
            // modern versions of node have the promise code already in it
            const fsPromise = require("fs/promises");
            this.readFile = fsPromise.readFile;
        } catch(e) {
            this.logger.trace(e);
            this.logger.trace("Using polyfill for readFile instead");

            // polyfill for older versions of node
            this.readFile = (...arg) => new Promise((resolve, reject) => {
                fs.readFile(...arg, (err, data) => {
                    if (err) {
                        this.logger.debug("Could not load file.");
                    }
                    return err ? reject(err) : resolve(data)
                })
            });
        }
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
        if (!pathName) return undefined;
        let { sync } = options || {};
        sync = typeof(sync) === "boolean" ? sync : this.sync;
        const isJs = pathName.endsWith(".js") || pathName.endsWith(".mjs") || pathName.endsWith(".cjs");
        const fullPath = isJs && pathName[0] !== "/" ? path.join(process.cwd(), pathName) : pathName;

        if (sync) {
            try {
                this.logger.trace(`loadFile: loading file ${pathName} synchronously.`);
                if (!fs.existsSync(fullPath)) {
                    return undefined;
                }
                if (isJs) {
                    if (pathName.endsWith(".mjs")) {
                        // cannot load ESM modules synchronously
                        return undefined;
                    } else {
                        return requireShim(fullPath);
                    }
                } else {
                    return fs.readFileSync(pathName, "utf-8");
                }
            } catch (e) {
                this.logger.trace(e);
                return undefined;
            }
        }
        this.logger.trace(`loadFile: loading file ${pathName} asynchronously.`);
        return (isJs ? import(fullPath) : this.readFile(pathName, "utf-8")).catch((e) => {
            this.logger.trace(e);
            return undefined;
        });
    }
};

export default NodeLoader;