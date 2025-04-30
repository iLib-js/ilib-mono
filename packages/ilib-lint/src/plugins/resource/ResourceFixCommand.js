/*
 * ResourceFixCommand.js - class representing a command to fix a resource string
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

/**
 * @abstract
 * @class Representation of a command to fix a resource
 */
export class ResourceFixCommand {
    /**
     * The command has been applied to the resource.
     * @type {boolean}
     */
    applied = false;

    /**
     * Return true if the command overlaps with another command.
     * @abstract
     * @param {ResourceFixCommand} other the other command to compare with
     * @returns {boolean} true if the commands overlap, false otherwise
     */
    overlaps(other) {
        throw new Error("overlaps() must be implemented in subclasses");
    }
}

export default ResourceFixCommand;
