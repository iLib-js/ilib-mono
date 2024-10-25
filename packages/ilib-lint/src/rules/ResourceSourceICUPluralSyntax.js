/*
 * ResourceSourceICUPluralSyntax.js
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

import { Result } from "ilib-lint-common";
import { Resource } from "ilib-tools-common";
import ResourceRule from "./ResourceRule.js";
import Locale from "ilib-locale";
import { IntlMessageFormat } from "intl-messageformat";

/**
 * Verifies that syntax of an ICU plural in a Resource's source is valid
 */
export class ResourceSourceICUPluralSyntax extends ResourceRule {
    /** @override */
    name = "resource-source-icu-plural-syntax";
    /** @override */
    description = "Verify that syntax of an ICU plural in the source of a Resource is valid";
    /** @override */
    link = "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-icu-plurals.md";

    /**
     * @param {any} [opts]
     */
    constructor(opts) {
        super(opts);
    }

    /**
     * @param {Object} params
     * @param {string | undefined} params.source
     * @param {Resource} params.resource
     * @param {string} params.file
     * @returns {Result | undefined}
     */
    matchString({ source: maybeSource, resource, file }) {
        const source = maybeSource ?? "";
        const sourceLocale = new Locale(resource.getSourceLocale() ?? this.sourceLocale).getSpec();

        // attempt to parse the source string as IntlMessage and output any encoutnered errors
        try {
            new IntlMessageFormat(source, sourceLocale, undefined, { captureLocation: true }).getAst();
        } catch (e) {
            // capture location of the issue
            const location = this.getErrorLocationInString(e) ?? { start: 0, end: source.length };
            const lineNumber = this.getErrorLineNumberInFile(e, resource);

            return new Result({
                severity: "error",
                description: `Incorrect ICU plural syntax in source string: ${e}`,
                source,
                highlight:
                    source.substring(0, location.start) +
                    "<e0>" +
                    source.substring(location.start, location.end) +
                    "</e0>" +
                    source.substring(location.end),
                rule: this,
                id: resource.getKey(),
                pathName: file,
                lineNumber,
            });
        }
        return undefined;
    }

    /** Read offsets which indicate where error ocurred in the source string
     * @private
     */
    getErrorLocationInString(/** @type {any} */ parseError) {
        // capture parse error location if it's available in the thrown error
        let location = {
            /** @type {number} */ start: parseError?.location?.start?.offset,
            /** @type {number} */ end: parseError?.location?.end?.offset,
        };
        if ("number" !== typeof location.start || "number" !== typeof location.end) {
            return undefined;
        }
        return location;
    }

    /** Get file line in which the error occurred
     * @private
     */
    getErrorLineNumberInFile(/** @type {any} */ parseError, /** @type {Resource} */ resource) {
        // try to calculate line number from resource line number and line number of the thrown error
        let /** @type {number | undefined} */ lineNumber = undefined;
        if (
            "number" === typeof (/** @type {any} */ (resource).lineNumber) &&
            "number" === typeof parseError?.location?.end?.line
        ) {
            lineNumber = /** @type {any} */ (resource).lineNumber + parseError?.location.end.line - 1;
        }
        return lineNumber;
    }
}

export default ResourceSourceICUPluralSyntax;
