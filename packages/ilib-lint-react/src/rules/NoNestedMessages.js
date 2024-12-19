/*
 * NoNestedMessages.js - check for FormatMessage instances nested inside
 * each other
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

import { Result, Rule } from "ilib-lint-common";
import { localizableAttributes } from 'ilib-tools-common';

import _traverse from "@babel/traverse";
const traverse = _traverse.default;
import _generate from "@babel/generator";
const generate = _generate.default;

// type imports
/** @ignore @typedef {import("ilib-lint-common").IntermediateRepresentation} IntermediateRepresentation */
/** @ignore @typedef {import("@babel/parser").ParseResult<import("@babel/types").File>} ParseResult */

class NoNestedMessages extends Rule {
    /** @readonly */
    name = "no-nested-messages";

    /** @readonly */
    description = "Disallow use of one FormattedMessage component instance inside of another";

    /** @readonly */
    link =
        "https://github.com/iLib-js/ilib-mono/tree/main/packages/ilib-lint-react/docs/no-nested-messages.md";

    /** @readonly */
    type = "babel-ast";

    /** @override */
    match({ ir }) {
        if (ir.type !== this.type) {
            throw new Error(`Unexpected representation type!`);
        }

        const tree = ir.getRepresentation();
        const results = [];

        traverse(tree, {
            // for Flow/imperative React
            CallExpression(path) {
                const callee = path.node.callee;
                // only check the parents of calls to intl.formatMessage()
                if (callee?.object?.name === "intl" &&
                        callee.property?.name === "formatMessage" &&
                        path.node?.arguments.length > 0) {
                    const parent = path.findParent(ancestor => {
                        return (ancestor.node.type === "JSXOpeningElement" &&
                                ancestor.node.name?.name === "FormattedMessage");
                    });
                    if (parent) {
                        results.push({
                            pathName: ir.sourceFile.getPath(),
                            severity: "error",
                            description: `Found a call to intl.formatMessage() inside of a FormattedMessage component. This indicates a broken string.`,
                            id: undefined,
                            lineNumber: path.node.loc.start.line,
                            charNumber: path.node.loc.start.column,
                            endLineNumber: path.node.loc.end.line,
                            endCharNumber: path.node.loc.end.column,
                            // @TODO make a real highlight once IR contains raw content of the linted source file
                            highlight: `<e0>${generate(path.node).code}</e0>`
                        });
                    }
                }
            },

            JSXOpeningElement(path) {
                const nameNode = path.node.name;
                if (nameNode.type === "JSXIdentifier" &&
                        nameNode.name === "FormattedMessage") {
                    const parent = path.findParent(ancestor => {
                        return (ancestor.node.type === "JSXOpeningElement" &&
                                ancestor.node.name?.name === "FormattedMessage");
                    });
                    if (parent) {
                        results.push({
                            pathName: ir.sourceFile.getPath(),
                            severity: "error",
                            description: `Found a FormattedMessage component inside of another FormattedMessage component. This indicates a broken string.`,
                            id: undefined,
                            lineNumber: path.node.loc.start.line,
                            charNumber: path.node.loc.start.column,
                            endLineNumber: path.node.loc.end.line,
                            endCharNumber: path.node.loc.end.column,
                            // @TODO make a real highlight once IR contains raw content of the linted source file
                            highlight: `<e0>${generate(path.node).code}</e0>`
                        });
                    }
                }
            }
        });

        return results.map(result => new Result({...result, rule: this}));
    }
}

export default NoNestedMessages;
