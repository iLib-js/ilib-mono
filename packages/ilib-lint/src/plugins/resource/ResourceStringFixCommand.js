/*
 * ResourceStringFixCommand.js - class representing a command to fix a resource string
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

import { Resource } from 'ilib-tools-common';

import StringFixCommand from '../string/StringFixCommand.js';

import ResourceFixCommand from './ResourceFixCommand.js';
import ResourceStringLocator from './ResourceStringLocator.js';

class ResourceStringFixCommand extends ResourceFixCommand {
    /**
     * Contains information about a transformation that should be applied to the string content
     * within the given resource.
     *
     * @param {ResourceStringLocator} locator resource to which the command should be applied
     * @param {number} position position in string after which the operation should be performed
     * @param {number} deleteCount count of characters that should be deleted
     * @param {string} insertContent string that should be inserted
     */
    constructor(locator, position, deleteCount, insertContent) {
        super();
        if (typeof locator !== "object" || !(locator instanceof ResourceStringLocator)) {
            throw new Error("ResourceStringFixCommand resource must be called with an instance of ResourceStringLocator");
        }
        if (!Number.isInteger(position) || position < 0) {
            throw new Error("ResourceStringFixCommand position must be non-negative integer");
        }
        if (!Number.isInteger(deleteCount) || deleteCount < 0) {
            throw new Error("ResourceStringFixCommand deleteCount must be non-negative integer");
        }
        this.locator = locator;
        this.stringFix = new StringFixCommand(position, deleteCount, insertContent);
    }

    /**
     * Range of the original string which this command intends to modify
     *
     * @see {@link ResourceStringFixCommand.overlaps}
     */
    get range() {
        return this.stringFix.range;
    }

    /**
     * The resource string locator to which the command should be applied.
     *
     * @returns {ResourceStringLocator} resource string locator to which the command should be applied
     */
    getLocator() {
        return this.locator;
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
     * @param {ResourceStringFixCommand} other
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    overlaps(other) {
        const thisRange = this.range;
        const otherRange = other.range;
        return (
            this.locator.isSameAs(other.locator) &&
            (thisRange[0] < otherRange[1] && otherRange[0] < thisRange[1]) ||
            (thisRange[0] === otherRange[0] && this.stringFix.deleteCount === 0 && other.stringFix.deleteCount === 0)
        );
    }
}

export default ResourceStringFixCommand;
