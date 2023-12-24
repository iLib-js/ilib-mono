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

import { Result, Rule } from "i18nlint-common";
import { localizableAttributes } from 'ilib-tools-common';

import _traverse from "@babel/traverse";
const traverse = _traverse.default;
import _generate from "@babel/generator";
const generate = _generate.default;

// type imports
/** @typedef {import("i18nlint-common").IntermediateRepresentation} IntermediateRepresentation */
/** @typedef {import("@babel/parser").ParseResult<import("@babel/types").File>} ParseResult */

class NoNestedMessages extends Rule {
    /** @readonly */
    name = "no-nested-messages";

    /** @readonly */
    description = "Disallow use of one FormattedMessage component instance inside of another";

    /** @readonly */
    link =
        "https://github.com/ilib-js/ilib-lint-react/blob/main/docs/no-nested-messages.md";

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
                // only check arguments to the calls to React.createElement()
                if (callee?.object?.name === "React" &&
                        callee.property?.name === "createElement" &&
                        path.node?.arguments.length > 0) {
                    const args = path.node.arguments;
                    if (args[0].type === "Identifier") {
                        const name = args[0].name;

                        if (skipComponents.has(name)) {
                            // skip components that are allowed to have text in them
                            path.skip();
                            return;
                        }

                        args.shift();

                        const attributes = args[0];
                        if (attributes.type === "ObjectExpression") {
                            attributes.properties.forEach(attribute => {
                                if (isAttributeLocalizable(name, attribute.key.name) &&
                                        attribute.value.type === "StringLiteral") {
                                    results.push({
                                        pathName: ir.filePath,
                                        severity: "error",
                                        description: `Found unlocalizable hard-coded attribute value. Use intl.formatMessage() instead.`,
                                        id: undefined,
                                        lineNumber: attribute.loc.start.line,
                                        charNumber: attribute.loc.start.column,
                                        endLineNumber: attribute.loc.end.line,
                                        endCharNumber: attribute.loc.end.column,
                                        // @TODO make a real highlight once IR contains raw content of the linted source file
                                        highlight: `<e0>${generate(attribute).code}</e0>`
                                    });
                                }
                            });
                        }

                        args.shift();

                        args.forEach(argument => {
                            if (argument.type === "StringLiteral") {
                                results.push({
                                    pathName: ir.filePath,
                                    severity: "error",
                                    description: `Found unlocalizable hard-coded string. Use intl.formatMessage() instead.`,
                                    id: undefined,
                                    lineNumber: argument.loc.start.line,
                                    charNumber: argument.loc.start.column,
                                    endLineNumber: argument.loc.end.line,
                                    endCharNumber: argument.loc.end.column,
                                    // @TODO make a real highlight once IR contains raw content of the linted source file
                                    highlight: `<e0>${argument.value.trim()}</e0>`
                                });
                            }
                        });
                    }
                }
            },

            JSXOpeningElement(path) {
                const nameNode = path.node.name;
debugger;
                if (nameNode.type === "JSXIdentifier" &&
                        nameNode.name === "FormattedMessage") {
                    const parent = path.findParent(ancestor => {
                        return (ancestor.node.type === "JSXOpeningElement" &&
                                ancestor.node.name?.name === "FormattedMessage");
                    });
                    if (parent) {
                        results.push({
                            pathName: ir.filePath,
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
