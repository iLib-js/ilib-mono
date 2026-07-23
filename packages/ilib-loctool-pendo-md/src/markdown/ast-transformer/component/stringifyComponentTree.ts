/**
 * Copyright © 2025, Box, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licensefs/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { ComponentAst, ROOT_COMPONENT_INDEX } from "./ComponentAst";

/**
 * Stringify a Component AST to a Pendo MD string.
 *
 * Given a Component AST like:
 * ```js
 * {
 *     type: "component",
 *     componentIndex: ROOT_COMPONENT_INDEX,
 *     children: [
 *         { type: "component", componentIndex: 0, children: [{ type: "text", value: "pizza" }] },
 *         { type: "text", value: "spaghetti" },
 *     ],
 * }
 * ```
 * it will stringify it to an escaped string like:
 * ```text
 * <c0>pizza</c0> spaghetti
 * ```
 *
 * Node that the root component is not rendered in the escaped string to simplify it for translators.
 *
 * @param node - The Component AST node to stringify.
 * @returns The escaped string.
 */
export const stringifyComponentTree = (node: ComponentAst.Node): string => {
    if (node.type === "text") {
        return node.value;
    }
    if (node.type !== "component") {
        // @ts-expect-error this should be exhaustive
        throw new TypeError(`Unexpected node type: ${node.type}`);
    }
    if (node.componentIndex === undefined) {
        throw new Error(`Component index is undefined`);
    }
    if (node.children === undefined || node.children.length === 0) {
        return `<c${node.componentIndex}/>`;
    }
    const childrenString = node.children.map(stringifyComponentTree).join("");

    // don't stringify the root component
    if (node.componentIndex < 0) {
        return childrenString;
    }

    return `<c${node.componentIndex}>` + childrenString + `</c${node.componentIndex}>`;
};

/**
 * Find the first occurrence of a component tag (<c0>, <c0/>, </c0>) in a string starting at a given index.
 */
const findComponentTag = (string: string, startIndex: number) => {
    const regexp = /<(?<closing>\/)?c(?<componentIndex>\d+)(?<selfClosing>\/)?>/g;
    regexp.lastIndex = startIndex;
    const match = regexp.exec(string);
    if (!match || !match.groups) {
        return null;
    }
    const componentIndex = parseInt(match.groups.componentIndex, 10);
    const isClosing = match.groups.closing !== undefined;
    const isSelfClosing = match.groups.selfClosing !== undefined;
    return { componentIndex, position: match.index, length: match[0].length, isClosing, isSelfClosing };
};

/**
 * Parse an escaped string into a Component AST.
 *
 * Given an escaped string like
 *
 * ```text
 * <c0>pizza</c0> spaghetti
 * ```
 *
 * it will parse it into a Component AST like:
 *
 * ```js
 * {
 *     type: "component",
 *     componentIndex: ROOT_COMPONENT_INDEX,
 *     children: [
 *         { type: "component", componentIndex: 0, children: [{ type: "text", value: "pizza" }] },
 *         { type: "text", value: "spaghetti" },
 *     ],
 * }
 * ```
 *
 * @param string - The escaped string to parse into a Component AST.
 * @returns The Component AST.
 */
export const parseComponentString = (string: string) => {
    const tree: ComponentAst.Root = {
        type: "component",
        componentIndex: ROOT_COMPONENT_INDEX,
        children: [],
    };

    const stack: ComponentAst.Component[] = [tree];
    const currentComponent = () => stack[stack.length - 1];

    let position = 0;
    while (position < string.length) {
        const componentTag = findComponentTag(string, position);

        // extract text span between the current index and the component match index
        const textSpan = string.slice(position, componentTag?.position);
        if (textSpan) {
            let children = currentComponent().children;
            if (!children) {
                children = [];
                currentComponent().children = children;
            }
            children.push({ type: "text", value: textSpan });
        }

        if (!componentTag) {
            break;
        }

        // advance search position to after the found component
        position = componentTag.position + componentTag.length;

        if (componentTag.isClosing) {
            if (currentComponent().componentIndex !== componentTag.componentIndex) {
                throw new Error(
                    `Closing component tag mismatch at position ${componentTag.position}: expected </${
                        currentComponent().componentIndex
                    }> but got </c${componentTag.componentIndex}>`
                );
            }
            stack.pop();
            continue;
        }

        const newComponent: ComponentAst.Component = {
            type: "component",
            componentIndex: componentTag.componentIndex,
        };

        let children = currentComponent().children;
        if (!children) {
            children = [];
            currentComponent().children = children;
        }
        children.push(newComponent);

        if (!componentTag.isSelfClosing) {
            stack.push(newComponent);
        }
    }

    if (stack.length !== 1) {
        throw new Error(
            `Unbalanced component tags: failed to find closing tag for component ${currentComponent().componentIndex}`
        );
    }

    return tree;
};
