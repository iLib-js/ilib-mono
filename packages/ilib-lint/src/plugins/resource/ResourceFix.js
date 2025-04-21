/*
 * ResourceFix.js
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

import { Fix } from "ilib-lint-common";

import ResourceStringLocator from "./ResourceStringLocator.js";
import ResourceFixCommand from "./ResourceFixCommand.js";

/**
 * Represents a fix that can be applied to a resource instance.
 * This is a collection of commands that can be applied to the resource
 * to fix issues found in the resource. All of the fixes in this collection
 * must be applied to the same resource instance.
 *
 * @extends Fix
 */
class ResourceFix extends Fix {
    /**
     * @override
     * Matches IRs produced by {@link XliffParser} or any other resource file parser that produces
     * instances of Resource.
     */
    type = "resource";

    /**
     * @readonly
     * @type {ResourceStringLocator}
     */
    locator;

    /**
     * @readonly
     * @type {ResourceFixCommand[]}
     */
    commands = [];

    /**
     * Create a new resource fix.
     *
     * @param {ResourceStringLocator} locator the locator to use
     * @param {ResourceFixCommand[]} commands the commands to apply for this fix
     * @throws {Error} if any of the commands overlap with each other
     */
    constructor(locator, commands) {
        super();
        if (commands.some((one, idx) => commands.slice(idx + 1).some((other) => one.overlaps(other)))) {
            throw new Error("Cannot create a fix because some of the commands overlap with each other");
        }
        this.locator = locator;
        this.commands = commands;
    }

    /**
     * Return the type of this fix. This is used to determine if the fix can
     * be applied to the given intermediate representation.
     *
     * @returns {string} the type of this fix
     */
    getType() {
        return this.type;
    }

    /**
     * Return the list of commands that this fix applies. This can be a mix of metadata commands
     * and string commands.
     * @returns {ResourceFixCommand[]} the list of commands that this fix applies
     */
    getCommands() {
        return this.commands;
    }

    /**
     * Return the locator that this fix applies to. This is the resource instance
     * that the fix applies to.
     * @returns {ResourceStringLocator} the locator that this fix applies to
     */
    getLocator() {
        return this.locator;
    }

    /**
     * Determines if two instances intend to modify the same range of the original string
     * @param {ResourceFix} other
     */
    overlaps(other) {
        return this.locator.isSameAs(other.locator) &&
            this.commands.some((thisCommand) =>
                other.commands.some((otherCommand) => thisCommand.overlaps(otherCommand))
            );
    }

    /**
     * Return whether or not this fix has been applied to the resource.
     * @returns {boolean} true if the fix has been applied, false otherwise
     */
    getApplied() {
        this.applied = this.commands.some(command => command.getApplied());
        return this.applied;
    }
}

export default ResourceFix;