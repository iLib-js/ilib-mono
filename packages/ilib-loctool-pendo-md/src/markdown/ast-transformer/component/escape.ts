/**
 * Copyright © 2024, Box, Inc.
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

import structuredClone from "@ungap/structured-clone";
import type { Content, Root } from "mdast";
import visit from "unist-util-visit";

import { mapComponentDataToNode, mapNodeToComponentData, type ComponentData } from "./mdastMapping";
import { htmlNodesToComponentNodes } from "./htmlRepresentation";
import { isUnistComponent } from "./unistComponent";

/**
 * Traverses the AST and replaces nodes that should be escaped with component nodes,
 * also keeping track of the component data for later backconversion.
 */
export const toComponents = (tree: Root) => {
    // copy the tree to avoid modifying original
    const clone = structuredClone(tree);

    // sequence of components which are substituted
    const components: ComponentData[] = [];

    visit(clone, (node, index, parent) => {
        // only process if the node is a child
        if (!parent) {
            return visit.CONTINUE;
        }

        const result = mapNodeToComponentData(node as Content, components.length);

        // if no mapping is found, continue
        if (!result) {
            return visit.CONTINUE;
        }

        const { component, data } = result;

        // store component data for the node
        components.push(data);

        // replace the original node with the component node
        parent.children.splice(index, 1, component);

        // don't descend into children of the old node
        // but visit the newly inserted node
        return [visit.SKIP, index];
    });

    return { tree: clone, components };
};

/**
 * Backconverts the AST with components to the unescaped AST
 * recreating mdast nodes from previously substituted components.
 */
export const fromComponents = (tree: Root, components: ComponentData[]): Root => {
    // create a transformed copy of the AST
    // discovering and transforming any HTML node that matches the component node format
    const clone = htmlNodesToComponentNodes(tree);

    visit(clone, (node, index, parent) => {
        // only process if the node is a child
        if (!parent) {
            return visit.CONTINUE;
        }

        // only process component nodes
        if (!isUnistComponent(node)) {
            return visit.CONTINUE;
        }

        const { componentIndex } = node;

        if (!components[componentIndex]) {
            // @TODO warn about missing component

            // don't replace this component because it's missing
            return visit.CONTINUE;
        }

        // recreate the original mdast node from component data
        const recreatedNode = mapComponentDataToNode(node, components[componentIndex]);

        // replace the component node with the recreated mdast node
        parent.children.splice(index, 1, recreatedNode);

        // don't descend into children of the old node
        // but visit the newly inserted node
        return [visit.SKIP, index];
    });

    return clone;
};
