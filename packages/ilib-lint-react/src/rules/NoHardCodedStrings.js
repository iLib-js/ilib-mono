/*
 * NoHardCodedStrings.js - check for hard-coded (and therefore unlocalizable) strings
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
import { Utils } from 'ilib-common';
import { localizableAttributes } from 'ilib-tools-common';

import _traverse from "@babel/traverse";
const traverse = _traverse.default;
import _generate from "@babel/generator";
const generate = _generate.default;

function isAttributeLocalizable(tagName, attributeName) {
    return (typeof(localizableAttributes[tagName]) !== 'undefined' &&
        localizableAttributes[tagName][attributeName]) ||
        localizableAttributes["*"][attributeName];
}

// these ones are supposed to have text in them
const skipComponents = new Set([
    "FormattedCompMessage",
    "FormattedMessage"
]);

// type imports
/** @ignore @typedef {import("ilib-lint-common").IntermediateRepresentation} IntermediateRepresentation */
/** @ignore @typedef {import("@babel/parser").ParseResult<import("@babel/types").File>} ParseResult */

class NoHardCodedStrings extends Rule {
    /** @readonly */
    name = "no-hard-coded-strings";

    /** @readonly */
    description = "Disallow hard-coded strings in between components and in certain HTML attributes";

    /** @readonly */
    link =
        "https://github.com/iLib-js/ilib-mono/tree/main/packages/ilib-lint-react/docs/no-hard-coded-strings.md";

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
            JSXElement(path) {
                const nameNode = path.node?.openingElement.name;
                if (nameNode?.type === "JSXIdentifier" && skipComponents.has(nameNode?.name)) {
                    // skip components that are allowed to have text in them
                    path.skip();
                }
            },

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
                                        attribute.value.type === "StringLiteral" &&
                                        attribute.value.value.trim().length > 0) {
                                    results.push({
                                        pathName: ir.sourceFile.getPath(),
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
                                    pathName: ir.sourceFile.getPath(),
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
                if (nameNode.type === "JSXIdentifier") {
                    const tagName = nameNode.name;
                    path.node.attributes.forEach(attribute => {
                        if (attribute.type === "JSXAttribute" &&
                                attribute.name?.type === "JSXIdentifier" &&
                                isAttributeLocalizable(tagName, attribute.name.name) &&
                                attribute.value?.type === "StringLiteral" &&
                                attribute.value.value.trim().length > 0) {
                            results.push({
                                pathName: ir.sourceFile.getPath(),
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
            },

            JSXText(path) {
                const text = path.node;
                // don't report on all whitespace strings!
                if (text?.value.trim() !== "") {
                    results.push({
                        pathName: ir.sourceFile.getPath(),
                        severity: "error",
                        description: `Found unlocalizable hard-coded string. Use a FormattedMessage component instead.`,
                        id: undefined,
                        lineNumber: text.loc.start.line,
                        charNumber: text.loc.start.column,
                        endLineNumber: text.loc.end.line,
                        endCharNumber: text.loc.end.column,
                        // @TODO make a real highlight once IR contains raw content of the linted source file
                        highlight: `<e0>${text.value.trim()}</e0>`
                    });
                }
            }
        });

        return results.map(result => new Result({...result, rule: this}));
    }
}

export default NoHardCodedStrings;
