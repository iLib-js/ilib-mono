/*
 * ResourceSourceICUPluralParams.js
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
import log4js from 'log4js';

const logger = log4js.getLogger("ilib-lint.ResourceSourceICUPluralParams");

/**
 * Verifies that the "one" category of an ICU plural in a Resource's source
 * contains a replacement parameter. If it does not, it makes it more difficult
 * to translate to languages where there are more than one number in the "one"
 * category, such as Russian.
 */
export class ResourceSourceICUPluralParams extends ResourceRule {
    /** @override */
    name = "source-icu-plural-params";
    /** @override */
    description = "Verify that the 'one' category of an ICU plural contains the same replacement parameters as the 'other' category.";
    /** @override */
    link = "https://github.com/ilib-js/ilib-lint/blob/main/docs/source-icu-plural-params.md";

    /**
     * @param {any} [opts]
     */
    constructor(opts) {
        super(opts);
    }

    findReplacementParams(children) {
        let params = {};
        for (let i = 0; i < children.length; i++) {
            // type 1 is a replacement param
            const type = children[i].type;
            if (type === 1) {
                params[children[i].value] = true;
            }
            if (type === 7) {
                params["#"] = true;
            }
        }
        return params;
    }

    /**
     * @private
     */
    checkCategories(/** @type {PluralElement} */ element) {
        if (element.pluralType !== "cardinal" || !element?.options?.other) return;
        const otherParams = this.findReplacementParams(element.options.other.value);

        // if the other category does not contain the name of the variable we are
        // switching on then just skip the rest of this check
        if (!otherParams[element.value] && !otherParams["#"]) return;

        if (element.options.one) {
            const oneParams = this.findReplacementParams(element.options.one.value);
            if (!oneParams[element.value] && !oneParams["#"]) {
                return {
                    severity: "error",
                    description: `Missing replacement param "${element.value}" in the "one" category`,
                    location: element.location,
                };
            }
        }
        return undefined;
    }

    /**
     * @param {Object} params
     * @param {string | undefined} params.source
     * @param {Resource} params.resource
     * @param {string} params.file
     * @returns {Result | undefined}
     */
    matchString({ source, resource, file }) {
        if (!source) return; // no source, no checks needed
        const sourceLocale = new Locale(resource.getSourceLocale() ?? this.sourceLocale).getSpec();

        // attempt to parse the source string as IntlMessage and output any encoutnered errors
        try {
            const ast = new IntlMessageFormat(source, sourceLocale, undefined, { captureLocation: true }).getAst();

            // recursively search for all ICU plurals in the string
            const selects = this.recursiveFindSelects(ast);

            // run checks on all found plurals
            const resultArray = selects.flatMap((select) => {
                const partialResult = this.checkCategories(select);
                // wrap results into Result instances
                if (partialResult) {
                    return new Result({
                        rule: this,
                        id: resource.getKey(),
                        pathName: resource.getPath(),
                        source,
                        highlight: `<e0>${this.substringForLocation(source, partialResult.location)}</e0>`,
                        severity: partialResult.severity,
                        description: partialResult.description,
                    });
                }
                return undefined;
            }).filter(result => result);
            return resultArray?.length > 1 ? resultArray : (resultArray?.length === 1 ? resultArray[0] : undefined);
        } catch (e) {
            // this rule does not report on syntax errors in the source. Other rules do that,
            // so we can ignore this exception
            logger.debug(e);
        }
        return undefined;
    }

    /**
     * @private
     * @param {MessageFormatElement[]} ast
     */
    recursiveFindSelects(ast) {
        const /** @type {PluralElement[]} */ selects = [];
        for (const node of ast) {
            switch (node.type) {
                // case 5: // selectordinal
                case 6: // plural/select
                    const catContents = Object.values(node.options);
                    selects.push(node, ...this.recursiveFindSelects(catContents.flatMap((cat) => cat.value)));
                    break;
                default:
                    break;
            }
        }
        return selects;
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

    /**
     * @private
     */
    substringForLocation(/** @type {string} */ source, /** @type {Location | undefined} */ location) {
        return (location && source.slice(location.start.offset, location.end.offset)) || source;
    }
}

export default ResourceSourceICUPluralParams;
