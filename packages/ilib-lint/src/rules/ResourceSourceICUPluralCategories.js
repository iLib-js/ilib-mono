/*
 * ResourceSourceICUPluralCategories.js
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

// type imports
/** @ignore @typedef {import("@formatjs/icu-messageformat-parser").MessageFormatElement} MessageFormatElement */
/** @ignore @typedef {import("@formatjs/icu-messageformat-parser").PluralElement} PluralElement */
// /** @ignore @typedef {import("@formatjs/icu-messageformat-parser").SelectElement} SelectElement */
/** @ignore @typedef {import("@formatjs/icu-messageformat-parser").Location} Location */

/**
 * Verifies that categories of an ICU plural in a Resource's source are valid
 */
export class ResourceSourceICUPluralCategories extends ResourceRule {
    /** @override */
    name = "resource-source-icu-plural-categories";
    /** @override */
    description = "Verify that categories of an ICU plural in the source of a Resource are valid";
    /** @override */
    link = "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-icu-plurals.md";

    /**
     * @param {any} [opts]
     */
    constructor(opts) {
        super(opts);
    }

    /**
     * @private
     */
    checkCategories(/** @type {PluralElement} */ element) {
        let partials = [];

        if (!element.options.other) {
            partials.push({
                severity: /** @type {const} */ ("error"),
                description: `Missing required plural category "other"`,
                location: element.location
            });
        }

        if (!element.options.one) {
            if (element.options["=1"]) {
                partials.push({
                    severity: /** @type {const} */ ("error"),
                    description: `Category "=1" in plural should be "one" instead`,
                    location: element.options["=1"].location
                });
            } else {
                partials.push({
                    severity: /** @type {const} */ ("error"),
                    description: `Missing required plural category "one"`,
                    location: element.location
                });
            }
        }

        return partials;
    }

    /**
     * @param {Object} params
     * @param {string | undefined} params.source
     * @param {Resource} params.resource
     * @param {string} params.file
     * @returns {Result[]}
     */
    matchString({ source: maybeSource, resource, file }) {
        const source = maybeSource ?? "";
        const sourceLocale = new Locale(resource.getSourceLocale() ?? this.sourceLocale).getSpec();

        let ast;
        try {
            ast = new IntlMessageFormat(source, sourceLocale, undefined, { captureLocation: true }).getAst();
        } catch (e) {
            /* ignore parse errors - a different rule handles those */
            return [];
        }

        // recursively search for all ICU plurals in the string
        const selects = this.recursiveFindSelects(ast);

        // run checks on all found plurals
        return selects.flatMap((select) =>
            this.checkCategories(select)
                // wrap results into Result instances
                .map(
                    (partialResult) =>
                        new Result({
                            rule: this,
                            id: resource.getKey(),
                            pathName: resource.getPath(),
                            source,
                            highlight: `<e0>${this.substringForLocation(source, partialResult.location)}</e0>`,
                            severity: partialResult.severity,
                            description: partialResult.description,
                        })
                )
        );
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

    /**
     * @private
     */
    substringForLocation(/** @type {string} */ source, /** @type {Location | undefined} */ location) {
        return (location && source.slice(location.start.offset, location.end.offset)) || source;
    }
}

export default ResourceSourceICUPluralCategories;
