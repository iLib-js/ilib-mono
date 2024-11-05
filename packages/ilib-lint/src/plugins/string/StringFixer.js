/*
 * StringFixer.js
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
import StringParser from "./StringParser.js";
import StringFixCommand from "./StringFixCommand.js";
import { StringFix } from "./StringFix.js";

export class StringFixer extends Fixer {
    /**
     * @override
     * Matches IRs produced by {@link StringParser}
     */
    type = "string";

    /**
     * @overide
     * @param {IntermediateRepresentation} ir
     * @param {StringFix[]} fixes
     */
    applyFixes(ir, fixes) {
        // skip fix if there is any overlap with
        // the fixes that have already been enqueued for processing
        let enqueued = fixes.reduce((queue, fix) => {
            if (!queue.some((enqueued) => fix.overlaps(enqueued))) {
                queue.push(fix);
            }
            return queue;
        }, /** @type {StringFix[]} */ ([]));

        enqueued.forEach((fix) => {
            fix.applied = true;
        });

        ir.ir = StringFixCommand.applyCommands(
            ir.ir,
            enqueued.flatMap((fix) => fix.commands)
        );
    }
}

export default StringFixer;
