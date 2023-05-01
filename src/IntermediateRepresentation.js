/*
 * IntermediateRepresentation.js - representation of the results of parsing
 * an input file 
 *
 * Copyright © 2023 JEDLSoft
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
 * @class Representation of parser results
 * @abstract
 */
class IntermediateRepresentation {
    /**
     * Construct a new intermediate representation of a parsed file.
     *
     * The params object can include the following properties:
     *
     * - type {String} a unique name for this type of representation (required)
     * - ir {Object} the intermediate representation of this file (required)
     * - filePath {String} the path to the current file (required)
     *
     * @param {Object|undefined} params parameters for this representation
     */
    constructor(params) {
        const requiredFields = ["type", "ir", "filePath"];
        const missing = requiredFields.filter(p => {
            if (typeof(params[p]) !== "undefined") {
                this[p] = params[p];
                return false;
            }
            return true;
        });
        // logger.trace("params is " + JSON.stringify(params));
        if (missing.length) {
            throw new Error("Missing required parameters in the IntermediateRepresentation constructor: " + missing.join(", "));
        }
    }

    /**
     * Return the type of this representation.
     *
     * @returns {String} The type of this representation
     */
    getType() {
        return this.type;
    }

    /**
     * Return the representation that was parsed from the file.
     *
     * @returns {Object} the representation
     */
    getRepresentation() {
        return this.ir;
    }

    /**
     * Return the file path to the file that was parsed.
     *
     * @returns {String} the path to the file that was parsed
     */
    getPath() {
        return this.filePath;
    }
};

export default IntermediateRepresentation;
