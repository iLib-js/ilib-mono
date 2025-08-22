/*
 * FileEncodingRule.js - rule to check if the encoding of a text file is correct
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

/**
 * @typedef {Object} FileEncodingRuleOptions
 * @property {string} [encoding] expected encoding of the file
 */

/**
 * Rule that checks if the encoding of a text file is correct
 */
class FileEncodingRule extends Rule {
    /**
     * Expected encoding of the file
     * @type {BufferEncoding}
     * @private
     * @readonly
     */
    encoding = "utf-8";

    /**
     * @param {ConstructorParameters<typeof Rule>[0] & FileEncodingRuleOptions} options options to the constructor
     */
    constructor(options) {
        super(options);

        this.type = "byte";
        this.name = "file-encoding";
        this.description = "Check that the file encoding is correct";

        if (options?.encoding) {
            if (!Buffer.isEncoding(options.encoding)) {
                throw new Error(`Invalid encoding: ${options.encoding}`);
            }
            this.encoding = options.encoding;
        }
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
        /** @type {Buffer} */
        const bytes = ir.getRepresentation();
        try {
            bytes.toString(this.encoding);
        } catch (_) {
            return new Result({
                rule: this,
                severity: "error",
                description: `File cannot be decoded using the expected encoding: ${this.encoding}`,
                pathName: file,
                highlight: "",
            });
        }

        return undefined;
    }
}

export default FileEncodingRule;
