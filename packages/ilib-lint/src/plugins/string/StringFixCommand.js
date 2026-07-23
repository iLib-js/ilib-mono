/*
 * StringFixCommand.js
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

import PositionalFixCommand from "../positional/PositionalFixCommand.js";

export class StringFixCommand {
    /**
     * @type {PositionalFixCommand<string>}
     * @private
     * @readonly
     */
    positionalFixCommand;

    /**
     * Contains information about a transformation that should be applied to a string.
     *
     * @param {number} position position in string after which the operation should be performed
     * @param {number} deleteCount count of characters that should be deleted
     * @param {string} insertContent string that should be inserted
     */
    constructor(position, deleteCount, insertContent) {
        this.positionalFixCommand = new PositionalFixCommand(position, deleteCount, insertContent);
    }

    /**
     * position in content from which the operation should be performed
     */
    get position() {
        return this.positionalFixCommand.position;
    }

    /**
     * number of elements that should be deleted starting from {@link position}
     */
    get deleteCount() {
        return this.positionalFixCommand.deleteCount;
    }

    /**
     * content that should be inserted at {@link position}
     */
    get insertContent() {
        return this.positionalFixCommand.insertContent;
    }

    /**
     * Range of the original string which this command intends to modify
     */
    get range() {
        return this.positionalFixCommand.range;
    }

    /**
     * @param {StringFixCommand} other
     * @returns {boolean}
     */
    overlaps(other) {
        return this.positionalFixCommand.overlaps(other.positionalFixCommand);
    }

    /**
     * Creates a command to insert a given string `content` after a character at `position` in a string
     *
     * Example:
     * `"example"` & `insertAfter(1, "EEE")` => `"eEEExample"`
     *
     * @param {number} position position in string after which the operation should be performed
     * @param {string} newContent string that should be inserted
     * @returns {StringFixCommand}
     */
    static insertAfter(position, newContent) {
        return new StringFixCommand(position, 0, newContent);
    }
    /**
     * Creates a command to delete a `count` characters after a character at `position` in a string
     *
     * Example:
     * `"example"` & `deleteAfter(2, 2)` => `"exple"`
     *
     * @param {number} position position in string after which the operation should be performed
     * @param {number} count count of characters that should be deleted
     * @returns {StringFixCommand}
     */
    static deleteAfter(position, count) {
        return new StringFixCommand(position, count, "");
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
     * @returns {StringFixCommand}
     */
    static replaceAfter(position, count, newContent) {
        return new StringFixCommand(position, count, newContent);
    }

    /**
     * Apply multiple StringFixCommands to a supplied string
     *
     * @throws when some of the provided commands overlap (as defined in {@link StringFixCommand.overlaps})
     * @throws when some of the provided commands intend to modify range outside of input string bounds
     *
     * @param {string} content string to apply commands to
     * @param {StringFixCommand[]} commands commands that should be applied to the content string
     * @return {string} modified content
     */
    static applyCommands(content, commands) {
        return PositionalFixCommand.applyCommands(
            content,
            commands.map((command) => command.positionalFixCommand),
            (...chunks) => chunks.join("")
        );
    }
}

export default StringFixCommand;
