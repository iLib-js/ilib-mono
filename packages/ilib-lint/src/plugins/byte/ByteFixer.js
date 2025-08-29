/*
 * ByteFixer.js
 *
 * Copyright © 2025 Box, Inc.
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
import ByteParser from "./ByteParser.js";
import { ByteFix } from "./ByteFix.js";
import { PositionalFixCommand } from "../positional/PositionalFixCommand.js";

export class ByteFixer extends Fixer {
    /**
     * @override
     * Matches IRs produced by {@link ByteParser}
     */
    type = "byte";

    /**
     * @overide
     * @param {IntermediateRepresentation} ir
     * @param {ByteFix[]} fixes
     */
    applyFixes(ir, fixes) {
        const content = ir.ir;
        if (!(content instanceof Buffer)) {
            throw new Error("ByteFixer can only be applied to a Buffer");
        }

        // skip fix if there is any overlap with
        // the fixes that have already been enqueued for processing
        let enqueued = fixes.reduce((queue, fix) => {
            if (!queue.some((enqueued) => fix.overlaps(enqueued))) {
                queue.push(fix);
            }
            return queue;
        }, /** @type {ByteFix[]} */ ([]));

        const commands = enqueued.flatMap((fix) => fix.commands);
        const modifiedContent = PositionalFixCommand.applyCommands(content, commands, (...chunks) =>
            Buffer.concat(chunks)
        );
        ir.ir = modifiedContent;

        // mark the fixes as applied only after the content has been modified successfully
        enqueued.forEach((fix) => {
            fix.applied = true;
        });
    }
}

export default ByteFixer;
