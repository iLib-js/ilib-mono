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

import StringFixCommand from "../string/StringFixCommand.js";
import ResourceFixCommand from "./ResourceFixCommand.js";

/**
 * Class representing a command to fix a string within a resource.
 */
class ResourceStringFixCommand extends ResourceFixCommand {
    /**
     * The command to apply.
     * @readonly
     * @type {StringFixCommand}
     */
    stringFix;

    /**
     * Contains information about a transformation that should be applied to the string content
     * within the given resource.
     *
     * @param {StringFixCommand} stringFix the command to apply
     */
    constructor(stringFix) {
        super();
        this.stringFix = stringFix;
    }

    /**
     * @override
     * @param {ResourceFixCommand} other
     * @returns {boolean} true if the ranges overlap, false otherwise
     */
    overlaps(other) {
        return other instanceof ResourceStringFixCommand && this.stringFix.overlaps(other.stringFix);
    }

    /**
     * Creates a command to insert a given string `content` after a character at `position` in a string
     *
     * Example:
     * `"example"` & `insertAfter(1, "EEE")` => `"eEEExample"`
     *
     * @param {number} position position in string after which the operation should be performed
     * @param {string} newContent string that should be inserted
     * @returns {ResourceStringFixCommand}
     */
    static insertAfter(position, newContent) {
        return new ResourceStringFixCommand(StringFixCommand.insertAfter(position, newContent));
    }
    /**
     * Creates a command to delete a `count` characters after a character at `position` in a string
     *
     * Example:
     * `"example"` & `deleteAfter(2, 2)` => `"exple"`
     *
     * @param {number} position position in string after which the operation should be performed
     * @param {number} count count of characters that should be deleted
     * @returns {ResourceStringFixCommand}
     */
    static deleteAfter(position, count) {
        return new ResourceStringFixCommand(StringFixCommand.deleteAfter(position, count));
    }
    /**
     * Creates a command to delete a `count` characters after a character at `position` in a string,
     * and then insert string `content` in there
     *
     * Example:
     * `"example"` & `replaceAfter(3, 2, "EXAMPLE")` => `"exaEXAMPLEle"`
     *
     * @param {number} position position in string after which the operation should be performed
     * @param {number} count count of characters that should be deleted
     * @param {string} newContent string that should be inserted
     * @returns {ResourceStringFixCommand}
     */
    static replaceAfter(position, count, newContent) {
        return new ResourceStringFixCommand(StringFixCommand.replaceAfter(position, count, newContent));
    }
}

export default ResourceStringFixCommand;
