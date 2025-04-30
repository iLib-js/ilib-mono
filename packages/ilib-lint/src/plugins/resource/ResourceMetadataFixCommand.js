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

import ResourceFixCommand from "./ResourceFixCommand.js";
import ResourceStringLocator from "./ResourceStringLocator.js";

/**
 * Class representing a command to change value of the metadata field of a resource.
 */
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
     * @param {Object} params parameters for this command
     * @param {string} params.name name of the metadata field to be modified
     * @param {string} params.value value to be set in the metadata field
     */
    constructor(params) {
        super();
        if (!params || !params.name || typeof params.name !== "string") {
            throw new Error("ResourceMetadataFixCommand requires a name");
        }

        this.name = params.name;
        this.value = params.value;
    }

    /**
     * Determines if this command attempts to modify the same metadata field as another command.
     *
     * @param {ResourceFixCommand} other
     * @returns {boolean} true if the commands overlap, false otherwise
     */
    overlaps(other) {
        return other instanceof ResourceMetadataFixCommand && this.name === other.name;
    }

    /**
     * Apply this command to the resource.
     * @param {ResourceStringLocator} locator location of the resource to apply this command to
     * @returns {boolean} true if the command was successfully applied, false otherwise
     */
    apply(locator) {
        const resource = locator.getResource();
        resource[this.name] = this.value;
        return true;
    }
}

export default ResourceMetadataFixCommand;
