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

import FileStats from "./FileStats.js";

/**
 * @class Representation of parser results
 */
class IntermediateRepresentation {
    /**
     * Construct a new intermediate representation of a parsed file.
     *
     * @param {Object} params parameters for this representation
     * @param {String} params.type a unique name for this type of representation
     * @param {any} params.ir the intermediate representation of this file
     * @param {String} params.filePath the path to the current file
     * @param {FileStats} [params.stats] statistics about the file that was parsed
     */
    constructor(params) {
        const requiredFields = ["type", "ir", "filePath"];
        const missing = requiredFields.filter(field => undefined === params[field]);
        if (missing.length) {
            throw new Error("Missing required parameters in the IntermediateRepresentation constructor: " + missing.join(", "));
        }

        this.type = params.type;
        this.ir = params.ir;
        this.filePath = params.filePath;
        this.stats = params.stats;
    }

    /** 
     * A unique name for this type of representation
     * @type {string}
     * @readonly
     */
    type;

    /**
     * Return the type of this representation.
     *
     * @returns {String} The type of this representation
     */
    getType() {
        return this.type;
    }

    /** 
     * Representation that was parsed from the file
     * @type {any}
     */
    ir;

    /**
     * Return the representation that was parsed from the file.
     *
     * @returns {any} the representation
     */
    getRepresentation() {
        return this.ir;
    }

    /**
     * Path to the file that was parsed
     * @type {string}
     * @readonly
     */
    filePath;

    /**
     * Return the file path to the file that was parsed.
     *
     * @returns {String} the path to the file that was parsed
     */
    getPath() {
        return this.filePath;
    }

    /** 
     * Statistics about the file that was parsed
     * @type {FileStats | undefined}
     * @readonly
     */
    stats;
}

export default IntermediateRepresentation;
