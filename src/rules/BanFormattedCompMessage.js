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

import _traverse from "@babel/traverse";
const traverse = _traverse.default;

// type imports
/** @typedef {import("i18nlint-common").IntermediateRepresentation} IntermediateRepresentation */
/** @typedef {import("@babel/parser").ParseResult<import("@babel/types").File>} ParseResult */

export class BanFormattedCompMessage extends Rule {
    /** @readonly */
    name = "ban-formattedcompmessage";

    /** @readonly */
    description = "Disallow usage of deprecated FormattedCompMessage component";

    /** @readonly */
    link =
        "https://github.com/ilib-js/ilib-lint-react/blob/main/docs/ban-formattedcompmessage.md";

    /** @readonly */
    type = "babel-ast";

    /** @override */
    match(/** @type {{ ir: IntermediateRepresentation }} */ { ir }) {
        if (ir.type !== this.type) {
            throw new Error(`Unexpected representation type!`);
        }

        const /** @type {ParseResult} */ tree = ir.getRepresentation();

        const /** @type {import("@babel/types").JSXIdentifier[]} */ jsxNames =
                [];
        const /** @type {{ [rangeKey: string]: import("@babel/types").Identifier }} */ identifiers =
                {};

        traverse(tree, {
            // find JSX opening elements with matching name
            JSXOpeningElement(path) {
                const nameNode = path.node.name;
                if (
                    nameNode.type === "JSXIdentifier" &&
                    nameNode.name === "FormattedCompMessage"
                ) {
                    jsxNames.push(nameNode);
                }
            },
            // find every non-JSX identifier with matching name (catch all kinds of imports and requires)
            Identifier(path) {
                if (path.node.name === "FormattedCompMessage") {
                    // avoid duplicate matches (e.g. an import statement outputs two identifiers in the same range)
                    const rangeKey = [path.node.start, path.node.end].join(":");
                    if (rangeKey && !(rangeKey in identifiers)) {
                        identifiers[rangeKey] = path.node;
                    }
                }
            }
        });

        const ranges = [...jsxNames, ...Object.values(identifiers)]
            .map((node) => getRange(node))
            .filter(
                /** @type {<T>(e: T | undefined) => e is T} */ (
                    (range) => range !== undefined
                )
            );

        return ranges
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

/** @typedef {readonly [number, number]} Range */

const getRange = (/** @type {import("@babel/types").Node} */ node) =>
    (typeof node.start === "number" &&
        typeof node.end === "number" &&
        /** @type {Range} */ ([node.start, node.end])) ||
    undefined;

const rangesCompare = (
    /** @type {Range} */ one,
    /** @type {Range} */ other
) => {
    const leftDiff = one[0] - other[0];
    if (leftDiff !== 0) return leftDiff;
    const rightDiff = one[1] - other[1];
    return rightDiff;
};

export default BanFormattedCompMessage;
