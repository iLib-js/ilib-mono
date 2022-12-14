/*
 * Formatter.js - Formats result output
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
 * @class Represent an output formatter
 * @abstract
 */
class Formatter {
    /**
     * Construct an formatter instance. Formatters and formatter plugins
     * should implement this abstract class.
     */
    constructor() {
        if (this.constructor === Formatter) {
            throw new Error("Cannot instantiate abstract class Formatter!");
        }
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
}

export default Formatter;
