/*
 * BOMRule.js - rule to ensure that the file does not start with a UTF-8 BOM
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

import { Rule, Result, IntermediateRepresentation } from "ilib-lint-common";
import ByteFix from "../../plugins/byte/ByteFix.js";
import PositionalFixCommand from "../../plugins/positional/PositionalFixCommand.js";

/** Byte order mark for UTF-8 */
const UTF8_BOM = Buffer.from([0xef, 0xbb, 0xbf]);

/**
 * Rule that checks if the file starts with a UTF-8 BOM
 */
class BOMRule extends Rule {
    /**
     * @param {ConstructorParameters<typeof Rule>[0]} [options] options to the constructor
     */
    constructor(options = {}) {
        super(options);

        this.type = "byte";
        this.name = "utf-bom";
        this.description = "Check that the file does not start with a UTF-8 BOM";
    }

    /**
     * @param {Object} options options to the match method
     * @param {IntermediateRepresentation} options.ir the intermediate representation of the file to check
     * @param {string} options.file the file where the resource came from
     * @param {string} [options.locale] the locale against which this rule should be checked. Some rules
     * are locale-sensitive, others not.
     * @returns {Result|Array.<Result>|undefined} a Result instance describing the problem if
     * the rule check fails for this locale, or an array of such Result instances if
     * there are multiple problems with the same input, or `undefined` if there is no
     * problem found (ie. the rule does not match).
     */
    match({ ir, file }) {
        if (ir.type !== this.type) {
            throw new Error(`Unexpected intermediate representation type: [${ir.type}]`);
        }

        const bytes = ir.getRepresentation();
        if (!(bytes instanceof Buffer)) {
            throw new Error(`Unexpected intermediate representation content`);
        }

        if (bytes.length < UTF8_BOM.length) {
            return undefined;
        }

        // check if the file starts with a UTF-8 BOM
        const maybeBOM = bytes.slice(0, UTF8_BOM.length);
        if (maybeBOM.equals(UTF8_BOM)) {
            // if it does, return a Result with a fix to remove it
            return new Result({
                rule: this,
                severity: "error",
                description: `File must not start with a UTF-8 byte order mark (BOM)`,
                pathName: file,
                highlight: "",
                fix: new ByteFix(BOMRule.removeBOMCommand()),
            });
        }

        return undefined;
    }

    /**
     * @private
     * @returns {PositionalFixCommand<Buffer>} a command to remove the UTF-8 BOM
     */
    static removeBOMCommand() {
        return new PositionalFixCommand(0, UTF8_BOM.length);
    }
}

export default BOMRule;
