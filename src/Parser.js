/*
 * Parser.js - common SPI for parser plugins
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
 * @class common SPI for parser plugins
 * @abstract
 */
class Parser {
    /**
     * Construct a new plugin.
     *
     * @param {Object|undefined} options options for this instance of the
     * parser from the config file, if any
     */
    constructor(options) {
        if (this.constructor === Parser) {
            throw new Error("Cannot instantiate abstract class Plugin directly!");
        }
    }

    /**
     * Initialize the current plugin,
     * @abstract
     */
    init() {}

    /**
     * Return the name of this type of parser.
     * Subclasses should assign `this.name` in their constructor.
     *
     * @returns {String} return the name of this type of parser
     */
    getName() {
        return this.name;
    }

    /**
     * Return a description of what this parser does and what kinds of files it
     * handles for users who are trying to discover whether or not to use it.
     *
     * @returns {String} a description of this parser.
     */
    getDescription() {
        return this.description;
    }

    /**
     * Return the list of extensions of the files that this parser handles.
     * The extensions are listed without the dot. eg. ["json", "jsn"].
     * Subclasses should assign `this.extensions` in their constructor.
     *
     * @returns {Array.<String>} a list of file name extensions
     */
    getExtensions() {
        return this.extensions;
    }

    /**
     * Parse the current file into an intermediate representation.
     */
    parse() {}

    /**
     * For a "resource" type of plugin, this returns a list of Resource instances
     * that result from parsing the file.
     *
     * @returns {Array.<Resource>} list of Resource instances in this file
     */
    getResources() {
        return [];
    }
};

export default Parser;
