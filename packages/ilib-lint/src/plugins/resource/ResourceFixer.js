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
    createFix(params) {
        const { resource, target, category, index } = params;
        let { commands } = params;
        const locator = new ResourceStringLocator(resource, target, category, index);
        commands = commands ?? [];
        if (commands.some(command => command.getLocator().getHash() !== locator.getHash())) {
            throw new Error("All commands in a ResourceFix must apply to the same resource instance");
        }
        return new ResourceFix(locator, commands);
    }

    /**
     * Factory method to create a new command to modify the metadata of a resource.
     *
     * @param {Resource} resource the resource to which the metadata applies
     * @param {string} name the name of the metadata field to modify
     * @param {string} value the value to set for the metadata field
     * @returns {ResourceFixCommand} the command to modify the metadata
     */
    createMetadataCommand(resource, name, value) {
        const locator = new ResourceStringLocator(resource);
        return new ResourceMetadataFixCommand({locator, name, value});
    }

    /**
     * Factory method to create a new command to modify the content of a resource.
     *
     * @param {Resource} resource the resource to which the content applies
     * @param {number} position the position in the content to start modifying
     * @param {number} deleteCount the number of characters to delete from the content
     * @param {string} insertContent the content to insert at the specified position
     * @param {string} [category] the plural category of the string for plural resources
     * @param {number} [index] the index of the string in the resource for array resources
     * @param {boolean} [target] true if the locator is for the target string, false if it
     * is for the source string
     * @returns {ResourceFixCommand} the command to modify the content
     */
    createStringCommand(resource, position, deleteCount, insertContent, category, index, target) {
        const locator = new ResourceStringLocator(resource, target, category, index);
        return new ResourceStringFixCommand({locator, position, deleteCount, insertContent});
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

        const /** @type {ResourceMetadataFixCommand[]} */ metadataFixCommands = fixes.flatMap(fix => {
            return fix.getCommands().filter(command => (command instanceof ResourceMetadataFixCommand) && !command.getApplied());
        });

        // figure out which commands overlap with each other and only apply the first one
        metadataFixCommands.forEach((command, index) => {
            const other = metadataFixCommands.slice(0, index).find(other => command.overlaps(other));
            if (!other) {
                command.apply();
            }
        });

        // fixes already have a reference to the resource they are modifying, so we just need
        // to collect the commands for each resource and then apply them all at once
        const fixCommandCache = {};
        fixes.forEach(fix => {
            const locator = fix.getLocator();
            const commands = fix.getCommands();
            const hash = locator.getHash();
            if (!fixCommandCache[hash]) {
                fixCommandCache[hash] = [];
            }

            // skip fix if there is any overlap with
            // the fixes that have already been enqueued for processing
            fixCommandCache[hash] = commands.reduce((queue, command) => {
                if (!queue.some((/** @type {ResourceFixCommand} */ previousCommand) => command.overlaps(previousCommand))) {
                    queue.push(command);
                } else {
                    command.setApplied(false);
                }
                return queue;
            }, fixCommandCache[hash]);
        });

        // this keeps track of which locators have already been processed
        const locatorSet = new Set();

        // apply the string fixes to the resources
        fixes.forEach(fix => {
            const locator = fix.getLocator();
            const hash = locator.getHash();
            if (locatorSet.has(hash)) {
                // already processed the commands for this locator, so skip it
                return;
            }
            // map to string fix commands so we can depend on the StringFixCommand to process them
            // correctly. Why reinvent the wheel?
            const commands = fixCommandCache[hash].filter(command =>
                    (command instanceof ResourceStringFixCommand) &&
                    !command.getApplied() &&
                    !command.getHasOverlap());
            const stringCommands = commands.map(command => command.getStringFixCommand());

            let content = locator.getContent();
            const modified = StringFixCommand.applyCommands(content, stringCommands);
            locator.setContent(modified);
            locatorSet.add(hash);

            commands.forEach(command => {
                command.setApplied(true);
            });
        });
    }
}

export default ResourceFixer;
