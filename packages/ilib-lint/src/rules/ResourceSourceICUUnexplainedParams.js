/*
 * ResourceSourceICUUnexplainedParams.js
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
import log4js from "log4js";

// type imports
/** @ignore @typedef {import("@formatjs/icu-messageformat-parser").MessageFormatElement} MessageFormatElement */
/** @ignore @typedef {import("@formatjs/icu-messageformat-parser").ArgumentElement} ArgumentElement */
/** @ignore @typedef {import("@formatjs/icu-messageformat-parser").SelectElement} SelectElement */
/** @ignore @typedef {import("@formatjs/icu-messageformat-parser").PluralElement} PluralElement */
/** @ignore @typedef {import("@formatjs/icu-messageformat-parser").TagElement} TagElement */
/** @ignore @typedef {import("./ResourceSourceICUPluralCategories.js").Location} Location */

const logger = log4js.getLogger("ilib-lint.ResourceSourceICUUnexplainedParams");

/**
 * Check if replacement parameters mentioned in the English source string are
 * mentioned in the description field as well. Translators can do a much better
 * job of translating if they know what each replacement parameter represents.
 */
export class ResourceSourceICUUnexplainedParams extends ResourceRule {
    /** @override */
    name = "source-icu-unexplained-params";
    /** @override */
    description =
        "Check if replacement parameters used in the source string are explained in the comments for translators.";
    /** @override */
    link =
        "https://github.com/ilib-js/ilib-lint/blob/main/docs/source-icu-unexplained-params.md";

    /** @param {any} [opts] */
    constructor(opts) {
        super(opts);
    }

    /**
     * @param {Object} params
     * @param {string | undefined} params.source
     * @param {Resource} params.resource
     * @param {string} params.file
     * @returns {Result[] | undefined}
     * @override
     */
    matchString({ source, resource, file }) {
        if (!source) return; // no source, no checks needed

        const sourceLocale = new Locale(
            resource.getSourceLocale() ?? this.sourceLocale
        ).getSpec();

        const resourceComment = resource.getComment() ?? "";

        // attempt to parse the source string as IntlMessage and output any encountered errors
        let ast;
        try {
            ast = new IntlMessageFormat(source, sourceLocale, undefined, {
                captureLocation: true
            }).getAst();
        } catch (e) {
            // this rule does not report on syntax errors in the source. Other rules do that,
            // so we can ignore this exception
            logger.debug(e);
            return;
        }

        // find parameters we wish to check for
        const /** @type {{ name: String; location: Location | undefined }[]} */ parameters =
                [];
        this.traverseIcuAst(ast, ({ element, parent }) => {
            switch (element.type) {
                case 1: // argument
                    parameters.push({
                        name: element.value,
                        location: element.location
                    });
                    break;
                case 7: // pound
                    // find closest ancestor plural element to take parameter key from it
                    let origin;
                    let ancestor = parent;
                    while (!origin && ancestor) {
                        if (ancestor?.element?.type === 6 /* plural */) {
                            origin = ancestor.element;
                        }
                        ancestor = ancestor.parent;
                    }
                    if (!origin) {
                        throw new Error(
                            `Failed to find ancestor plural for a given pound element`
                        );
                    }
                    parameters.push({
                        name: origin.value,
                        location: element.location
                    });
                    break;
            }
        });

        // flag any replacement parameter whose label
        // does not appear in the description of the resource
        const missing = parameters.filter(
            ({ name }) =>
                !new RegExp(`\\b${this.escapeRegExp(name)}\\b`, "i").test(
                    resourceComment
                )
        );

        return missing.map(
            ({ name, location }) =>
                new Result({
                    rule: this,
                    id: resource.getKey(),
                    pathName: resource.getPath(),
                    source: source,
                    severity: "warning",
                    description: `Replacement parameter "${name}" is not mentioned in the string's comment for translators.`,
                    highlight: this.highlightLocation(source, location)
                })
        );
    }

    /**
     * @typedef {{
     *     element: MessageFormatElement;
     *     parent: undefined | ICUAstNode;
     * }} ICUAstNode
     */

    /**
     * Apply callback to every element of ICU Message including nested elements
     * (i.e. within select, plural, tag) keeping track of parent element
     *
     * @private
     */
    traverseIcuAst(
        /** @type {MessageFormatElement[]} */ message,
        /** @type {(node: ICUAstNode) => void} */ callback,
        /** @type {ICUAstNode | undefined} */ parent
    ) {
        for (const element of message) {
            const node = { element, parent };
            callback(node);
            switch (element.type) {
                case 5: // select
                case 6: // plural
                    this.traverseIcuAst(
                        Object.values(element.options).flatMap(
                            (option) => option.value
                        ),
                        callback,
                        node
                    );
                    break;
                case 8: // tag
                    this.traverseIcuAst(element.children, callback, node);
                    break;
            }
        }
    }

    /** @private */
    highlightLocation(
        /** @type {string} */ source,
        /** @type {Location | undefined} */ location
    ) {
        if (!location) {
            return `<e0>${source}</e0>`;
        }
        return (
            `${source.substring(0, location.start.offset)}` +
            `<e0>${source.substring(
                location.start.offset,
                location.end.offset
            )}</e0>` +
            `${source.substring(location.end.offset)}`
        );
    }

    /**
     * @private
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
     */
    escapeRegExp(/** @type {string} */ string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
}

export default ResourceSourceICUUnexplainedParams;
