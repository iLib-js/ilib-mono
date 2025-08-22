/*
 * XliffHeaderEncoding.js - rule to check that the encoding specified in the XLIFF header is correct
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

import { IntermediateRepresentation, Result, Rule } from "ilib-lint-common";

/**
 * @typedef {Object} XliffHeaderEncodingOptions
 * @property {string} [encoding] expected encoding of the file; defaults to "utf-8"
 */

class XliffHeaderEncoding extends Rule {
    /**
     * Expected encoding of the file
     * @type {string}
     * @readonly
     */
    encoding = "utf-8";

    /**
     * @param {ConstructorParameters<typeof Rule>[0] & XliffHeaderEncodingOptions} [options] options to the constructor
     */
    constructor(options = {}) {
        super(options);

        this.type = "string";
        this.name = "xliff-header-encoding";
        this.description = "Check that the encoding specified in the XLIFF header is correct";

        if (options?.encoding) {
            this.encoding = options.encoding.toLowerCase();
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
        if (ir.type !== this.type) {
            throw new Error(`Unexpected intermediate representation type: [${ir.type}]`);
        }

        const text = ir.getRepresentation();
        if (typeof text !== "string") {
            throw new Error(`Unexpected intermediate representation content`);
        }

        const xmlHeader = text.trimStart().split("\n")[0];
        if (!xmlHeader) {
            // no lines in the file
            return undefined;
        }

        if (!xmlHeader.startsWith("<?xml")) {
            // not an XML file header
            return undefined;
        }

        // search for `encoding="UTF-8"` and extract the value
        const foundEncoding = xmlHeader.match(/encoding="([^"]+)"/)?.[1];
        if (!foundEncoding) {
            // no encoding specified in the header
            return undefined;
        }

        const normalizedEncoding = XliffHeaderEncoding.normalizeEncoding(foundEncoding);
        if (normalizedEncoding !== this.encoding) {
            return new Result({
                rule: this,
                severity: "error",
                description: `The encoding specified in the XLIFF header is incorrect`,
                pathName: file,
                highlight: `Expected ${this.encoding}, found ${normalizedEncoding}`,
            });
        }

        return undefined;
    }

    /**
     * Normalize the encoding for comparison
     * @param {string} encoding
     * @returns {string}
     */
    static normalizeEncoding(encoding) {
        return encoding.toLowerCase().trim();
    }
}

export default XliffHeaderEncoding;
