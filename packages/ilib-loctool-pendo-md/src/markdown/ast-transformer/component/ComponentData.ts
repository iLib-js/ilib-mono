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
import type { Node as UnistNode } from "unist";
import visit from "unist-util-visit";

import { ComponentAst, isComponentNode, ROOT_COMPONENT_INDEX } from "./ComponentAst";
import { cloneTree } from "./unistUtil";

/**
 * Holds copies of the original Unist nodes which were escaped using Components.
 * Key is the component index.
 * Note that the root component is indexed as -1 (see {@link ROOT_COMPONENT_INDEX})
 * as it's not meant to be rendered in the escaped string.
 */
export type ComponentData = Map<number, UnistNode[]>;

/**
 * Extracts the original Unist nodes attached to each component in a Component AST.
 * @param tree - The Component AST tree to extract the original Unist nodes from.
 * @returns A map of component indices to their original Unist nodes.
 */
export const extractComponentData = <Tree extends ComponentAst.Component = ComponentAst.Component>(tree: Tree) => {
    const data: ComponentData = new Map();
    visit(tree, isComponentNode, (node) => {
        if (node.componentIndex === undefined) {
            throw new Error(`Component index is undefined`);
        }

        if (!node.originalNodes) {
            throw new Error("Invalid tree state: missing original nodes array");
        }
        data.set(node.componentIndex, node.originalNodes);
        return visit.CONTINUE;
    });
    return data;
};

/**
 * Attaches the provided original Unist nodes to each component in a Component AST respective to their component index.
 * @param tree - The Component AST tree to attach the original Unist nodes to.
 * @param componentData - A map of component indices to their original Unist nodes.
 * @returns The Component AST tree with the original Unist nodes attached to each component.
 */
export const injectComponentData = (tree: ComponentAst.Root, componentData: ComponentData) => {
    const clone = cloneTree(tree);
    visit(clone, isComponentNode, (node) => {
        if (node.componentIndex === undefined) {
            throw new Error(`Invalid tree state: component index is undefined`);
        }
        const data = componentData.get(node.componentIndex);
        if (!data) {
            throw new Error(`Missing component data for component index ${node.componentIndex}`);
        }
        node.originalNodes = data;
        return visit.CONTINUE;
    });
    return clone;
};

/**
 * Assigns a component index to each component in a Component AST.
 * The root component is indexed as -1 (see {@link ROOT_COMPONENT_INDEX}).
 * @param tree - The Component AST tree to enumerate the components of.
 * @returns The Component AST tree with the component indices attached to each component.
 */
export const enumerateComponents = (tree: ComponentAst.Component): ComponentAst.Root => {
    const clone = cloneTree(tree);
    let componentIndex: number = ROOT_COMPONENT_INDEX;
    visit(clone, isComponentNode, (node) => {
        node.componentIndex = componentIndex++;
        return visit.CONTINUE;
    });
    return clone as ComponentAst.Root;
};
