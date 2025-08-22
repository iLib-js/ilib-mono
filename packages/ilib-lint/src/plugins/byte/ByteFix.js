/*
 * StringFix.js
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

import { Fix } from "ilib-lint-common";
import PositionalFixCommand from "../positional/PositionalFixCommand.js";

export class ByteFix extends Fix {
    /**
     * @override
     * Matches IRs produced by {@link ByteParser}
     */
    type = "byte";

    /**
     * @readonly
     * @type {PositionalFixCommand<number[]>[]}
     */
    commands = [];

    constructor(/** @type {PositionalFixCommand<number[]>[]} */ ...commands) {
        super();
        if (commands.some((one, idx) => commands.slice(idx + 1).some((other) => one.overlaps(other)))) {
            throw new Error("Cannot create a fix because some of the commands overlap with each other");
        }
        this.commands = commands;
    }

    /**
     * Determines if two instances intend to modify the same range of the original string
     * @param {ByteFix} other
     */
    overlaps(other) {
        return this.commands.some((thisCommand) =>
            other.commands.some((otherCommand) => thisCommand.overlaps(otherCommand))
        );
    }
}

export default ByteFix;
