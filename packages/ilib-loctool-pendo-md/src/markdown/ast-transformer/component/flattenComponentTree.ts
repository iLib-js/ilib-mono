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
import visit from "unist-util-visit";
import { ComponentAst, isComponentNode } from "./ComponentAst";
import { cloneTree } from "./unistUtil";

/**
 * Flattens a Component AST i.e. combines chains of one-child nested components into a single component.
 *
 * A chain of one-child nested components can be produced by e.g. escaping the following mdast subtree:
 *
 * ```
 * paragraph: [
 *     list: [
 *         listItem: [
 *             paragraph: [
 *                 text: "item 1",
 *             ],
 *         ],
 *         listItem: [
 *             paragraph: [
 *                 text: "item 2",
 *             ],
 *         ],
 *     ],
 * ]
 * ```
 *
 * Direct mapping to a Component AST will produce the following tree:
 *
 * ```
 * component(paragraph): [
 *     component(list): [
 *         component(listItem): [
 *             component(paragraph): [
 *                 text: "item 1",
 *             ],
 *         ],
 *         component(listItem): [
 *             component(paragraph): [
 *                 text: "item 2",
 *             ],
 *         ],
 *     ],
 * ]
 * ```
 *
 * this would be annoying to translate:
 *
 * ```
 * <c0><c1><c2><c3>item 1</c3></c2><c4><c5>item 2</c5></c4></c1></c0>
 * ```
 *
 * Flattening the tree will produce the following tree:
 *
 * ```
 * component([paragraph, list]): [
 *     component([listItem, paragraph]): [
 *         text("item 1"),
 *     ],
 *     component([listItem, paragraph]): [
 *         text("item 2"),
 *     ],
 * ]
 * ```
 *
 * which can be stringified to something much cleaner:
 *
 * ```
 * <c0><c1>item 1</c1><c2>item 2</c2></c0>
 * ```
 */
export const flattenComponentTree = (tree: ComponentAst.Component): ComponentAst.Component => {
    const clone = cloneTree(tree);
    visit(clone, isComponentNode, (node) => {
        let child;
        while (node.children?.length === 1) {
            child = node.children[0];
            if (!isComponentNode(child)) {
                break;
            }
            if (!node.originalNodes || !child.originalNodes) {
                throw new Error("Invalid tree state: missing original nodes array");
            }
            node.originalNodes.push(...child.originalNodes);
            node.children = child.children;
        }
        return visit.CONTINUE;
    });
    return clone;
};

/**
 * Unflattens a Component AST i.e. reconstructs nested one-child component chains from a single flattened component.
 *
 * This is the inverse of {@link flattenComponentTree}.
 */
export const unflattenComponentTree = <Tree extends ComponentAst.Component = ComponentAst.Component>(
    tree: Tree
): Tree => {
    const clone = cloneTree(tree);
    visit(clone, isComponentNode, (node) => {
        if (!node.originalNodes) {
            throw new Error("Invalid tree state: missing original nodes array");
        }

        while (node.originalNodes.length > 1) {
            node.children = [
                {
                    type: "component",
                    children: node.children,
                    originalNodes: [node.originalNodes.pop()!],
                },
            ];
        }

        return visit.CONTINUE;
    });
    return clone;
};
