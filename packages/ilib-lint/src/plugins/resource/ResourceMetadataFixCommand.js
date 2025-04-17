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

import { Resource } from 'ilib-tools-common';

import ResourceContent from './ResourceContent.js';
import ResourceFixCommand from './ResourceFixCommand.js';

export class ResourceMetadataFixCommand {
    /**
      * The resource to which the command should be applied
      *
      * @type {ResourceContent}
      */
    resourceContent;

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
     * @param {Resource} resource resource to which the command should be applied
     * @param {string} name name of the metadata field to be modified
     * @param {string} value value to be set in the metadata field
     */
    constructor(resource, name, value) {
        this.resource = resource;
        this.name = name;
        this.value = value;
    }

    /**
     * The resource to which the command should be applied.
     *
     * @returns {Resource} resource to which the command should be applied
     */
    getResource() {
        return this.resource;
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
     * @param {ResourceContent} other
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    overlaps(other) {
        return this.resource === other.resource && this.name === other.name;
    }

    /**
     * Apply multiple ResourceMetadataFixCommands to a supplied string
     *
     * @throws when the fix commands do not apply to the same content (ie. same resource and same
     *         category/index/target within that resource)
     * @throws when some of the provided commands overlap (as defined in {@link ResourceMetadataFixCommand.overlaps})
     * @throws when some of the provided commands intend to modify range outside of input string bounds
     *
     * @param {Object} params parameters for this command
     * @param {ResourceContent} params.resourceContent Resource content to apply commands to
     * @param {ResourceMetadataFixCommand[]} params.commands commands that should be applied to the content string
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

export default ResourceMetadataFixCommand;
