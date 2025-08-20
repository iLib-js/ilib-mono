/*
 * ParserManager.js - Factory to create and return the right parser for the file
 *
 * Copyright © 2022-2025 JEDLSoft
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

import log4js from "log4js";

import { Parser } from "ilib-lint-common";

const logger = log4js.getLogger("ilib-lint.ParserManager");

/**
 * @class Manages a collection of parsers that this instance of ilib-lint
 * knows about.
 */
class ParserManager {
    /**
     * Information about the parsers that this instance of ilib-lint knows about.
     * Each entry in the object is a parser name and the value is an object
     * with the properties:
     * <ul>
     * <li>description - a description of the parser</li>
     * <li>type - the type of parser</li>
     * <li>extensions - an array of file name extensions that this parser can handle</li>
     * </ul>
     *
     * @type {Record<string, { description: string, type: string, extensions: string[] }>}
     * @private
     */
    parserInfo = {};

    /** @type {Record<string, Parser[]>} */
    parserCache = {};

    /** @type {Record<string, Parser>} */
    parserByName = {};

    /**
     * Create a new parser manager instance.
     * @constructor
     */
    constructor() {}

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
        return this.parserCache[extension] || this.parserCache["*"] || [];
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
     * @param {Array.<typeof Parser>} parsers the list of parsers to add
     */
    add(parsers) {
        if (!parsers || !Array.isArray(parsers)) return;
        for (const parser of parsers) {
            if (parser && typeof parser === "function" && Object.getPrototypeOf(parser).name === "Parser") {
                const p = new parser({
                    getLogger: log4js.getLogger.bind(log4js),
                });
                const name = p.getName();
                if (this.parserInfo[name]) {
                    logger.debug(`Parser ${name} already exists. Cannot add twice. Ignoring.`);
                    continue;
                }
                this.parserInfo[name] = {
                    description: p.getDescription(),
                    type: p.getType(),
                    extensions: p.getExtensions(),
                };
                for (const extension of p.getExtensions()) {
                    if (!this.parserCache[extension]) {
                        this.parserCache[extension] = [];
                    }
                    this.parserCache[extension].push(p);
                }
                this.parserByName[p.getName()] = p;

                logger.trace(`Added parser to the parser manager.`);
            } else {
                logger.debug("Attempt to add parser that does not inherit from Parser to the parser manager");
            }
        }
    }

    /**
     * Return an object where the properties are the parser names and the
     * values are the parser descriptions.
     *
     * @returns {Record<string, string>} the parser names and descriptions
     */
    getDescriptions() {
        /** @type {Record<string, string>} */
        let json = {};
        Object.keys(this.parserInfo).forEach((name) => {
            json[name] = this.parserInfo[name].description;
        });
        return json;
    }

    /**
     * Return the type of the parser with the given name. The type is
     * the type of intermediate represetnation that the parser produces.
     *
     * @param {String} name the name of the parser to get the type for
     * @returns {String} the type of parser with the given name
     */
    getType(name) {
        return this.parserInfo[name].type;
    }
}

export default ParserManager;
