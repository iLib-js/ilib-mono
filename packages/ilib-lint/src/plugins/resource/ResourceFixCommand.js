/*
 * ResourceFixCommand.js - class representing a command to fix a resource string
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

import { Resource } from 'ilib-tools-common';

import ResourceStringLocator from './ResourceStringLocator.js';
import ResourceMetadataFixCommand from './ResourceMetadataFixCommand.js';

/**
 * @abstract
 * @class Representation of a command to fix a resource
 */
export class ResourceFixCommand {
    constructor() {}

    /**
     * Modify the content of a resource based on the provided locator.
     * @param {ResourceStringLocator} locator the locator to identify the content to modify
     * @param {number} position the position in the content to start modifying
     * @param {number} deleteCount the number of characters to delete from the content
     * @param {string} insertContent the content to insert at the specified position
     * @returns {ResourceFixCommand} the command to modify the content
     */
    static modifyContent(locator, position, deleteCount, insertContent) {
        return new ResourceFixCommand({
            locator,
            position,
            deleteCount,
            insertContent
        });
    }

    /**
     * Create a new command to fix the metadata of a resource.
     * @param {Resource} resource the resource to which the command applies
     * @param {string} name the name of the metadata field to modify
     * @param {string} value the value to set for the metadata field
     * @return {ResourceFixCommand} the command to fix the metadata
     */
    static updateMetadata(resource, name, value) {
        return new ResourceMetadataFixCommand(resource, name, value);
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

    /**
     * Apply multiple ResourceFixCommands to a supplied string
     *
     * @throws when the fix commands do not apply to the same content (ie. same resource and same
     *         category/index/target within that resource)
     * @throws when some of the provided commands overlap (as defined in {@link ResourceFixCommand.overlaps})
     * @throws when some of the provided commands intend to modify range outside of input string bounds
     *
     * @param {Object} params parameters for this command
     * @param {ResourceContent} params.resourceContent Resource content to apply commands to
     * @param {ResourceFixCommand[]} params.commands commands that should be applied to the content string
     * @return {string} modified content
     */
    static applyCommands(params) {
        const { resourceContent, commands } = params;
        const pivot = commands[0];
        if (!commands.every((command) => command.getResourceContent().isSameAs(pivot.getResourceContent()))) {
            throw new Error("Cannot apply the commands because they do not all apply to the same resource contents");
        }

        let content = resourceContent.getContent();
        if (!content) {
            throw new Error("Cannot apply the fix commands because the resource content is empty");
        }

        if (commands.some((one, idx) => commands.slice(idx + 1).some((other) => one.overlaps(other)))) {
            throw new Error("Cannot apply the commands because some of them overlap with each other");
        }
        if (commands.some((command) => command.range[1] > content.length)) {
            throw new Error("Cannot apply the commands because some of them exceed range of the string to modify");
        }

        // sort the commands by the position in which they should be applied
        const sortedCommands = [...commands].sort((a, b) => a.range[0] - b.range[0] || a.range[1] - b.range[1]);

        // extract those pieces of the original that should be preserved

        // calculate complement ranges for preservation
        // i.e. for a string of length 10 where range [4,6] should be modified,
        // complement ranges for preservation are [0,4] and [6,10]
        const complementRanges =
            // get all range edges: 0, 4, 6, 10
            [0, ...sortedCommands.flatMap((c) => c.range), content.length].
                // bucket them into chunks of 2 items: [0,4], [6,10]
                reduce((chunks, element, elementIdx) => {
                    const chunkIdx = Math.floor(elementIdx / 2);
                    if (chunks[chunkIdx] === undefined) {
                        chunks[chunkIdx] = [];
                    }
                    chunks[chunkIdx].push(element);
                    return chunks;
                }, /** @type {number[][]} */ ([]));
        // use complement ranges to extract chunks for preservation
        const preservedChunks = complementRanges.map((range) => content.slice(...range));

        // create modified string by interlacing the preserved chunks of original with the replacement contents from each command
        content = preservedChunks.flatMap((_, idx) => [
            preservedChunks[idx],
            // there is always 1 more of chunks preserved than of commands to apply
            sortedCommands[idx]?.insertContent ?? ""
        ]).join("");

        resourceContent.setContent(content);

        // return the modified content
        return content;
    }
}

export default ResourceFixCommand;
