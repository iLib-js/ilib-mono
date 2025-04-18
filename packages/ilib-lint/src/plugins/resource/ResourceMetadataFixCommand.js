/*
 * ResourceMetadataFixCommand.js - class representing a command to fix the metadata
 * of a resource
 *
 * Copyright © 2025 JEDLSoft
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

import ResourceStringLocator from './ResourceStringLocator.js';
import ResourceFixCommand from './ResourceFixCommand.js';

class ResourceMetadataFixCommand extends ResourceFixCommand {
    /**
     * The name of the metadata field to be modified.
     *
     * @type {string}
     * @readonly
     */
    name;

    /**
     * The value to be set in the metadata field.
     *
     * @type {string}
     * @readonly
     */
    value;

    /**
     * Contains information about a transformation that should be applied to a string.
     *
     * @param {Object} params parameters for this command
     * @param {ResourceStringLocator} params.locator the locator to use
     * @param {string} params.name name of the metadata field to be modified
     * @param {string} params.value value to be set in the metadata field
     */
    constructor(params) {
        super(params);
        if (!params || !params.locator || !params.name) {
            throw new Error("ResourceMetadataFixCommand requires a locator and a name");
        }
        this.name = params.name;
        this.value = params.value;
    }

    /**
     * Determines if the ranges of two fix commands have any overlap
     * i.e. if they attempt to modify the same characters of a given string
     *
     * @note
     * Comparison is performed as if the ranges were left-closed, right-open intervals
     * (replacement of 1st and 2nd char has range `[0,2)`,
     * replacement of the 3rd and 4th char has range `[2, 4)` and they don't overlap)
     *
     * **with the exception of** 0-length replacements, i.e. pure insertion commands
     * which (even though mathematically `[1,1)` would be empty interval):
     * - overlap with different commands from the left side (i.e. insertion at 1 overlaps removal `[0,2)`,
     * but not removal `[0,1)`)
     * - overlap with each other when their position is the same (this is because the outcome
     * of multiple insertions in the same place would depend on the order of execution)
     *
     * @param {ResourceFixCommand} other
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    overlaps(other) {
        return other instanceof ResourceMetadataFixCommand &&
            this.locator.isSameAs(other.locator) &&
            this.name === other.name;
    }

    /**
     * Apply this command to the resource.
     */
    apply() {
        const res = this.locator.getResource();
        res[this.name] = this.value;
        this.applied = true;
    }
}

export default ResourceMetadataFixCommand;
