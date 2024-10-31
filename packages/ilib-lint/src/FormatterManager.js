/*
 * FormatterManager.js - Factory to create and return the right formatter
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

import { Formatter } from 'ilib-lint-common';

import AnsiConsoleFormatter from './formatters/AnsiConsoleFormatter.js';
import { ConfigBasedFormatter } from './formatters/ConfigBasedFormatter.js';

const logger = log4js.getLogger("ilib-lint.FormatterManager");

/**
 * @class Manages a collection of formatters that this instance of ilib-lint
 * knows about.
 */
class FormatterManager {
    /**
     * Create a new formatter manager instance.
     * @params {Object} options options controlling the construction of this object
     * @constructor
     */
    constructor(options) {
        this.formatterCache = {};
        this.descriptions = {};
        this.add([AnsiConsoleFormatter]);
        if (options) {
            if (options.formatters) {
                this.add(options.formatters);
            }
        }
    }

    /**
     * Return a formatter instance with the given name for use in
     * formatting the output.
     *
     * @param {String} name name of the formatter to return
     * @param {Object|undefined} options options for this instance of the
     * formatter from the config file, if any
     * @returns {Formatter} the formatter to use
     */
    get(name, options) {
        const formatConfig = this.formatterCache[name];
        if (!formatConfig) return;

        if (typeof(formatConfig) === 'object') {
            return new ConfigBasedFormatter({
                ...formatConfig,
                ...options,
                getLogger: log4js.getLogger.bind(log4js)
            });
        }
        return formatConfig ? new formatConfig({
            ...options,
            getLogger: log4js.getLogger.bind(log4js)
        }) : undefined;
    }

    /**
     * Add a list of formatter classes to this factory so that other code
     * can find them.
     *
     * @param {Array.<Class|Object>} formatters the list of formatter classes
     * or definitions to add
     */
    add(formatters) {
        if (!formatters || !Array.isArray(formatters)) return;
        for (const fmt of formatters) {
            let formatter;
            if (fmt) {
                if (typeof(fmt) === 'function' && Object.getPrototypeOf(fmt).name === "Formatter") {
                    formatter = new fmt({
                        getLogger: log4js.getLogger.bind(log4js)
                    });
                    this.formatterCache[formatter.getName()] = fmt;
                    this.descriptions[formatter.getName()] = formatter.getDescription();
                    logger.trace(`Added programmatic formatter ${formatter.getName()} to the formatter manager`);
                } else if (typeof(fmt) === 'object') {
                    formatter = fmt;
                    this.formatterCache[fmt.name] = fmt;
                    this.descriptions[fmt.name] = fmt.description;
                    logger.trace(`Added declarative formatter ${fmt.name} to the formatter manager`);
                }
            }
            if (!formatter) {
                logger.debug(`Attempt to add a non-formatter to the formatter manager`);
                if (typeof(formatter.getName) === 'function') logger.debug(`Name is ${formatter.getName()}`);
            }
        }
    }

    /**
     * Return an object where the properties are the formatter names and the
     * values are the formatter descriptions.
     *
     * @returns {Object} the formatter names and descriptions
     */
    getDescriptions() {
        return this.descriptions;
    }

    /**
     * Return how many rules this manager knows about.
     * @returns {Number} the number of rules this manager knows about.
     */
    size() {
        return Object.keys(this.formatterCache).length;
    }

    // for use with the unit tests
    clear() {
        this.formatterCache = {};
    }
}

export default FormatterManager;