/*
 * ParserManager.js - Factory to create and return the right parser for the file
 *
 * Copyright © 2022-2024 JEDLSoft
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

import log4js from 'log4js';

import { Parser } from 'ilib-lint-common';

const logger = log4js.getLogger("ilib-lint.ParserManager");

function getSuperClassName(obj) {
    return Object.getPrototypeOf(Object.getPrototypeOf(obj)).constructor.name;
}

/**
 * @class Manages a collection of parsers that this instance of ilib-lint
 * knows about.
 */
class ParserManager {
    /**
     * Create a new parser manager instance.
     * @params {Object} options options controlling the construction of this object
     * @constructor
     */
    constructor(options) {
        this.parserCache = {};
        this.parserByName = {};
        this.descriptions = {};
    }

    /**
     * Return a list of parsers for the given file name extension
     *
     * @param {String} extension the extension to get the parsers for
     * @returns {Array.<Parser>} the array of parsers that handle
     * the given type of file
     */
    get(extension) {
        // the '*' extension means any extension, which gives all the
        // parsers that can handle any text file
        return this.parserCache[extension] || this.parserCache['*'] || [];
    }

    /**
     * Return the parser with the given name.
     * @param {String} name the name of the parser being sought
     * @returns {Parser|undefined} the parser with the given name or undefined if
     * none was found with that name.
     */
    getByName(name) {
        return this.parserByName[name];
    }

    /**
     * Add a list of parsers to this factory so that other code
     * can find them.
     *
     * @param {Array.<Parser>} parsers the list of parsers to add
     */
    add(parsers) {
        if (!parsers || !Array.isArray(parsers)) return;
        for (const parser of parsers) {
            if (parser && typeof(parser) === 'function' && Object.getPrototypeOf(parser).name === "Parser") {
                const p = new parser({
                    getLogger: log4js.getLogger.bind(log4js)
                });
                for (const extension of p.getExtensions()) {
                    if (!this.parserCache[extension]) {
                        this.parserCache[extension] = [];
                    }
                    this.parserCache[extension].push(p);
                }
                this.descriptions[p.getName()] = p.getDescription();
                this.parserByName[p.getName()] = p;

                logger.trace(`Added parser to the parser manager.`);
            } else {
                logger.debug("Attempt to add parser that does not inherit from Parser to the parser manager");
            }
        }
    };

    /**
     * Return an object where the properties are the parser names and the
     * values are the parser descriptions.
     *
     * @returns {Object} the parser names and descriptions
     */
    getDescriptions() {
        return this.descriptions;
    }

    // for use with the unit tests
    clear() {
        this.parserCache = {};
    }
}

export default ParserManager;