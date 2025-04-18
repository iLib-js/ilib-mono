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

import ResourceStringLocator from './ResourceStringLocator.js';

/**
 * @abstract
 * @class Representation of a command to fix a resource
 */
export class ResourceFixCommand {
    /**
     * The resource string locator to which the command applies.
     * @type {ResourceStringLocator}
     * @readonly
     */
    locator;

    /**
     * The command has been applied to the resource.
     * @type {boolean}
     */
    applied = false;

    /**
     * The command overlaps with some other command and will not be applied later.
     * @type {boolean}
     */
    hasOverlap = false;

    /**
     * Make a new ResourceFixCommand instance.
     *
     * @param {Object} params parameters for this command
     * @param {ResourceStringLocator} params.locator the locator to use
     */
    constructor(params) {
        this.locator = params.locator;
    }

    /**
     * Return the locator for this command.
     * @returns {ResourceStringLocator} the locator for this command
     */
    getLocator() {
        return this.locator;
    }

    /**
     * Return true if the command has been applied to the resource.
     * @returns {boolean} true if the command has been applied, false otherwise
     */
    getApplied() {
        return this.applied;
    }

    /**
     * Set the applied flag to true to indicate that the command has been applied.
     * @param {boolean} applied true if the command has been applied, false otherwise
     */
    setApplied(applied) {
        this.applied = applied;
    }

    /**
     * Return whether or not the command overlaps with a previously applied command
     * and will not be applied later.
     *
     * @returns {boolean} true if the command has an overlap and will not be applied, false otherwise
     */
    getHasOverlap() {
        return this.hasOverlap;
    }

    /**
     * Set the hasOverlap flag to true to indicate that the command has an overlap
     * with a previous command and will not be applied.
     * @param {boolean} overlap true if the command has an overlap with a previous command and will
     * not be applied
     */
    setOverlap(overlap) {
        this.hasOverlap = overlap;
    }

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
