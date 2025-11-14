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
import type { Parent as UnistParent, Node as UnistNode } from "unist";
import mapTree from "unist-util-map";
import { ComponentAst } from "./ComponentAst";
import { cloneNodeWithoutChildren } from "./unistUtil";

/**
 * Given an arbitrary Unist tree, maps every node to a Component AST node using the provided map function.
 */
export const mapToComponentAst = (
    tree: UnistParent,
    mapFunction: (node: UnistNode) => ComponentAst.Node
): ComponentAst.Component => {
    return mapTree(tree, (node) => {
        const mappedNode = mapFunction(node);
        // create clones of the original nodes to avoid unexpected side effects
        if (mappedNode.type === "component" && mappedNode.originalNodes) {
            mappedNode.originalNodes = mappedNode.originalNodes.map(cloneNodeWithoutChildren);
        }
        return mappedNode;
    }) as ComponentAst.Component;
};

/**
 * Given a Component AST with injected original nodes, reconstructs the original Unist tree
 * by mapping each Component AST node to a Unist node using the provided map function.
 */
export const mapFromComponentAst = (
    tree: ComponentAst.Component,
    mapFunction: (node: ComponentAst.Node) => UnistNode
): UnistParent => {
    return mapTree(tree, (node) => {
        return cloneNodeWithoutChildren(
            mapFunction(
                // @ts-expect-error mapTree is not generic,
                // but we know that ComponentAst.Component tree can only contain ComponentAst.Node nodes
                node
            )
        );
    }) as UnistParent;
};
