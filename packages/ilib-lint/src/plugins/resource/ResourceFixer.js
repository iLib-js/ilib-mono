/*
 * ResourceFixer.js
 *
 * Copyright © 2023-2024 JEDLSoft
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

import StringFixer from "../string/StringFixer.js";

import ResourceFixCommand from "./ResourceFixCommand.js";
import ResourceMetadataFixCommand from "./ResourceMetadataFixCommand.js";
import ResourceStringFixCommand from "./ResourceStringFixCommand.js";
import { ResourceFix } from "./ResourceFix.js";
import ResourceStringLocator from "./ResourceStringLocator.js";

export class ResourceFixer extends Fixer {
    /**
     * @override
     * Matches IRs produced by {@link StringParser}
     */
    type = "resource";

    /**
     * Create a new resource string locator instance.
     * @param {Resource} resource the resource to which the locator applies
     * @param {string | undefined} category the plural category of the string for plural resources
     * @param {number | undefined} index the index of the string in the resource for array resources
     * @param {boolean | undefined} target true if the locator is for the target string, false if it
     * is for the source string
     * @returns {ResourceStringLocator} the new resource string locator
     */
    newLocator(resource, category, index, target) {
        return new ResourceStringLocator(resource, category, index, target);
    }

    /**
     * @override
     * @param {Object} params the parameters to pass to the fix
     * @param {ResourceStringLocator} params.locator the locator to use
     * @param {ResourceFixCommand[]} params.commands the commands to apply for this fix
     * @returns {ResourceFix} a new fix to apply
     */
    createFix(params) {
        const { locator, commands } = params;
        return new ResourceFix(locator, commands);
    }

    /**
     * Factory method to create a new command to modify the metadata of a resource.
     *
     * @param {string} name the name of the metadata field to modify
     * @param {string} value the value to set for the metadata field
     * @returns {ResourceFixCommand} the command to modify the metadata
     */
    createMetadataCommand(name, value) {
        return new ResourceMetadataFixCommand(name, value);
    }

    /**
     * Factory method to create a new command to modify the content of a resource.
     *
     * @param {ResourceStringLocator} locator the locator to identify the content to modify
     * @param {number} position the position in the content to start modifying
     * @param {number} deleteCount the number of characters to delete from the content
     * @param {string} insertContent the content to insert at the specified position
     * @returns {ResourceFixCommand} the command to modify the content
     */
    createStringCommand(position, deleteCount, insertContent) {
        return new ResourceStringFixCommand(position, deleteCount, insertContent);
    }

    /**
     * @overide
     * @param {IntermediateRepresentation} ir
     * @param {ResourceFix[]} fixes
     */
    applyFixes(ir, fixes) {
        // skip fix if there is any overlap with
        // the fixes that have already been enqueued for processing
        let enqueued = fixes.reduce((queue, fix) => {
            if (!queue.some((enqueued) => fix.overlaps(enqueued))) {
                queue.push(fix);
            }
            return queue;
        }, /** @type {ResourceFix[]} */ ([]));

        enqueued.forEach((fix) => {
            fix.applied = true;
        });

        ir.ir = ResourceFixCommand.applyCommands(
            ir.ir,
            enqueued.flatMap((fix) => fix.commands)
        );
    }
}

export default ResourceFixer;
