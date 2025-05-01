/*
 * ResourceFixer.js
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

import { Fixer, IntermediateRepresentation } from "ilib-lint-common";
import { Resource } from "ilib-tools-common";

import StringFixCommand from "../string/StringFixCommand.js";

import ResourceFixCommand from "./ResourceFixCommand.js";
import ResourceMetadataFixCommand from "./ResourceMetadataFixCommand.js";
import ResourceStringFixCommand from "./ResourceStringFixCommand.js";
import ResourceFix from "./ResourceFix.js";
import ResourceStringLocator from "./ResourceStringLocator.js";

class ResourceFixer extends Fixer {
    /**
     * @override
     * Matches IRs produced by {@link StringParser}
     */
    type = "resource";

    constructor() {
        super();
    }

    /**
     * Returns the type of this fixer. This is used to determine if the fixer can
     * be applied to the given intermediate representation.
     *
     * @returns {string} the type of this fixer
     */
    getType() {
        return this.type;
    }

    /**
     * Factory method to create a new fix to apply. This is a collection of commands that can be applied
     * to the resource. All of the fixes in this collection must be applied to the same resource instance.
     *
     * @param {Object} params the parameters to pass to the fix
     * @param {Resource} params.resource the resource to which the fix applies
     * @param {string} [params.category] the plural category of the string for plural resources
     * @param {number} [params.index] the index of the string in the resource for array resources
     * @param {boolean} [params.target] true if the locator is for the target string, false if it
     * @param {ResourceFixCommand[]} params.commands the commands to apply for this fix
     * @returns {ResourceFix} a new fix to apply
     */
    static createFix(params) {
        const { resource, target, category, index, commands } = params;
        const locator = new ResourceStringLocator(resource, target, category, index);
        if (commands.length === 0) {
            throw new Error("Cannot create a fix with no commands");
        }
        return new ResourceFix(locator, commands);
    }

    /**
     * Factory method to create a new command to modify the metadata of a resource.
     *
     * @param {string} name the name of the metadata field to modify
     * @param {string} value the value to set for the metadata field
     * @returns {ResourceFixCommand} the command to modify the metadata
     */
    static createMetadataCommand(name, value) {
        return new ResourceMetadataFixCommand({name, value});
    }

    /**
     * Factory method to create a new command to modify the content of a resource.
     *
     * @param {number} position the position in the content to start modifying
     * @param {number} deleteCount the number of characters to delete from the content
     * @param {string} insertContent the content to insert at the specified position
     * @returns {ResourceFixCommand} the command to modify the content
     */
    static createStringCommand(position, deleteCount, insertContent) {
        return new ResourceStringFixCommand({position, deleteCount, insertContent});
    }

    /**
     * @overide
     * @param {IntermediateRepresentation} ir
     * @param {ResourceFix[]} fixes
     */
    applyFixes(ir, fixes) {
        // if the IR is not for the resource type or if there are no fixes, skip it
        if (ir.getType() !== "resource" || fixes.length === 0) {
            return;
        }

        // first partition the fixes by resource locator and also determine which ones
        // we can apply because they do not overlap with other fixes for the same locator.
        /** @type {Record<string, ResourceFix[]>} */
        const fixCache = {};
        fixes.forEach(fix => {
            if (fix.applied) {
                // if the fix has already been applied, skip it
                // this should probably never happen, but just in case
                return;
            }
            const locator = fix.locator;
            const hash = locator.getHash();
            if (!fixCache[hash]) {
                fixCache[hash] = [];
            }
            if (fixCache[hash].every(existingFix => {
                // if the fix overlaps with any existing fix, we cannot apply it
                return !fix.overlaps(existingFix);
            })) {
                fixCache[hash].push(fix);
            } // else we don't apply and we skip it
        });

        // now we have a cache of fixes that do not overlap with each other, so we can apply them
        Object.values(fixCache).forEach(fixesForLocator => {
            // every given cache bucket should have at least one fix and all fixes in this cache
            // bucket should have the same locator, so we can safely assume that the first fix
            // has the correct locator for all fixes
            const locator = fixesForLocator[0].locator;

            const commands = fixesForLocator.flatMap(fix => fix.commands);

            // first metadata fixes
            commands.
                filter(command => command instanceof ResourceMetadataFixCommand).
                forEach(command => {
                    // apply metadata fixes directly to the resource
                    command.apply(locator);
                });

            // now find the content/string fixes. Must apply all of them at once so that
            // the indexes into the content are correct.
            const stringCommands = commands.
                filter(command => command instanceof ResourceStringFixCommand).
                map(command => command.stringFix);

            // if there are no string commands, skip it
            if (stringCommands.length > 0) {
                // apply the string commands to the resource content all at once
                const content = locator.getContent();
                const modified = StringFixCommand.applyCommands(content, stringCommands);
                locator.setContent(modified);
            }

            fixesForLocator.forEach(fix => {
                fix.applied = true;
            });
        });
    }
}

export default ResourceFixer;
