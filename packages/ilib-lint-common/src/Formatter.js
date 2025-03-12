/*
 * Formatter.js - Formats result output
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

/**
 * @class Represent an output formatter
 * @abstract
 */
class Formatter {
    /**
     * Construct an formatter instance. Formatters and formatter plugins
     * should implement this abstract class.
     *
     * @param {Object} [options] options to the constructor
     * @param {Function} options.getLogger a callback function provided by
     * the linter to retrieve the log4js logger
     */
    constructor(options) {
        /*if (this.constructor === Formatter) {
            throw new Error("Cannot instantiate abstract class Formatter!");
        }*/
    }

    /**
     * Get the name of the formatter. This should be a unique string.
     *
     * @returns {String} the name of this formatter
     */
    getName() {
        // make sure to define this.name in your implementation
        return this.name;
    }

    /**
     * Return a general description of the formatter for use in help output.
     *
     * @returns {String} a general description of the formatter
     */
    getDescription() {
        return this.description;
    }

    /**
     * Format the given result with the current formatter and return the
     * formatted string.
     *
     * @abstract
     * @param {Result} result the result to format
     * @returns {String} the formatted result
     */
    format(result) {
    }
    /**
     * Provide the information for the formatter as an object and
     * return the formatted string that contains a lot of information
     * according to the formatter's needs.
     *
     * The method supposed to format the entire output, including headers,
     * footers and summaries and formatted Result instances.
     * If the formatOutput is defined, the linter does not call format()
     * directly and it is up to formatOutput to do so. If formatOutput
     * is not defined in a Formatter plugin, then ilib-lint will use its
     * own default headers and footers and will call format to format each Result.
     *
     * @abstract
     * @param {Object} [options] Information that the method can use to format the output
     * @param {string} [options.name] name of the this project
     * @param {FileStats} [options.fileStats] The stats information of the file
     * @param {Object} [options.resultStats] Information about the lint result of the  file
     * @param {Object} [options.results] list containing all issues in this project
     * @param {Number} [options.score] I18N score for this project
     * @param {Number} [options.totalTime] Total elapsed time by the tool for this project
     * @param {Boolean} [options.errorOnly] true, if only errors are displayed
     * @returns {String} the formatted result
     */
    formatOutput(options) {
    }
}

export default Formatter;
