/*
 * BanFormattedCompMessage.js
 *
 * Copyright © 2023 Box, Inc.
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

import { Result, Rule } from "i18nlint-common";
import jsonpath from "jsonpath";
import { distinct } from "../../test/utils.js";

// type imports
/** @typedef {import("i18nlint-common").IntermediateRepresentation} IntermediateRepresentation */

export class BanFormattedCompMessage extends Rule {
    /** @readonly */
    name = "ban-formattedcompmessage";

    /** @readonly */
    description = "Disallow usage of deprecated FormattedCompMessage component";

    /** @readonly */
    link =
        "https://github.com/ilib-js/ilib-lint-react/blob/main/docs/ban-formattedcompmessage.md";

    /** @readonly */
    type = "ast-jstree";

    /** @override */
    match(/** @type {{ ir: IntermediateRepresentation }} */ { ir }) {
        if (ir.type !== this.type) {
            throw new Error(`Unexpected representation type!`);
        }

        const /** @type {unknown} */ tree = ir.getRepresentation();

        // find JSX Opening elements with matching name
        const jsxElements = /** @type {unknown[]} */ (
            jsonpath.query(
                tree,
                "$..[?(@.type == 'JSXOpeningElement' && @.name.name == 'FormattedCompMessage')]"
            )
        );

        // find every non-JSX identifier with matching name (catch all kinds of imports and requires);
        // avoid duplicate matches (e.g. an import statement outputs two identifiers in the same range)
        const identifiers = distinct(
            /** @type {unknown[]} */ (
                jsonpath.query(
                    tree,
                    "$..[?(@.type == 'Identifier' && @.name == 'FormattedCompMessage')]"
                )
            ),
            (one, other) => rangesEqual(getRange(one), getRange(other))
        );

        return [...jsxElements, ...identifiers]
            .map((node) => getRange(node))
            .sort((a, b) => rangesCompare(a, b))
            .map((range) => {
                return new Result({
                    pathName: ir.filePath,
                    severity: "error",
                    rule: this,
                    description: `Do not use deprecated FormattedCompMessage component.`,
                    id: undefined,
                    // @TODO make a real highlight once IR contains raw content of the linted source file
                    highlight: `Range: <e0>${range[0]}:${range[1]}</e0>`
                });
            });
    }
}

/** @typedef {{ range: [number, number] }} FlowRange */
const isFlowRange = /** @type {(node: any) => node is FlowRange} */ (node) => {
    return (
        "range" in node &&
        Array.isArray(node.range) &&
        node.range.length === 2 &&
        !node.range.some((/** @type {any} */ idx) => "number" !== typeof idx)
    );
};

/** @typedef {{ start: number; end: number }} AcornRange */
const isAcornRange = /** @type {(node: any) => node is AcornRange} */ (
    node
) => {
    return "number" === typeof node.start && "number" === typeof node.end;
};

/** @typedef {[number, number]} Range */
const getRange = /** @type {(node: any) => Range} */ (node) => {
    if (isFlowRange(node)) {
        return node.range;
    }
    if (isAcornRange(node)) {
        return [node.start, node.end];
    }
    throw new Error(`Unexpected AST node shape: missing range`);
};

const rangesEqual = (/** @type {Range} */ one, /** @type {Range} */ other) => {
    return rangesCompare(one, other) === 0;
};

const rangesCompare = (
    /** @type {Range} */ one,
    /** @type {Range} */ other
) => {
    return one[0] === other[0] ? one[0] - other[0] : one[1] - other[1];
};

export default BanFormattedCompMessage;
