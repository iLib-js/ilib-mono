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
import { TextDecoder, types } from "util";

/**
 * @typedef {Object} FileEncodingRuleOptions
 * @property {string} [encoding] expected encoding of the file; defaults to "utf-8";
 *     full list of supported encodings: https://nodejs.org/docs/latest-v14.x/api/util.html#util_whatwg_supported_encodings
 */

/**
 * Rule that checks if the encoding of a text file is correct
 */
class FileEncodingRule extends Rule {
    /** @override */
    type = "byte";

    /** @override */
    name = "file-encoding";

    /** @override */
    description = "Check that the file encoding is correct";

    /** @override */
    link = "https://github.com/ilib-js/ilib-mono/blob/main/packages/ilib-lint/docs/file-encoding.md";

    /**
     * Expected encoding of the file
     * @type {string}
     * @readonly
     */
    encoding = "utf-8";

    /**
     * @type {TextDecoder}
     * @private
     * @readonly
     */
    decoder;

    /**
     * @param {ConstructorParameters<typeof Rule>[0] & FileEncodingRuleOptions} [options] options to the constructor
     */
    constructor(options = {}) {
        super(options);

        if (options?.encoding) {
            this.encoding = options.encoding;
        }

        this.decoder = new TextDecoder(this.encoding, { fatal: true });
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

        try {
            this.decoder.decode(bytes);
        } catch (error) {
            // TextDecoder({ fatal: true }).decode() throws a TypeError if the encoding is invalid
            if (types.isNativeError(error) && error.name === "TypeError") {
                return new Result({
                    rule: this,
                    severity: "error",
                    description: `File cannot be decoded using the expected encoding: ${this.encoding}`,
                    pathName: file,
                    highlight: "",
                });
            }
            throw error;
        }

        return undefined;
    }
}

export default FileEncodingRule;
