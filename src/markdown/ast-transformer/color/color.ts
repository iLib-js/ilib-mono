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

import visit from "unist-util-visit";
import { htmlRegex } from "../../string-transformer/color";
import structuredClone from "@ungap/structured-clone";

import type { Node } from "unist";
import type { Content, Parent, HTML } from "mdast";

/**
 * Pendo markdown extension to represent a span of color.
 */
export interface Color extends Parent {
    type: "color";
    value: string;
}

const openingNodeRegex = new RegExp(`^${htmlRegex.opening.source}$`);
const closingNodeRegex = new RegExp(`^${htmlRegex.closing.source}$`);

/**
 * Transform AST to create custom {@link Color} nodes by consuming
 * nodes between specified {@link HTML} nodes.
 *
 * Given the following markdown string:
 * ```markdown
 * normal text <color value="#000000">colored text</color> normal text
 * ```
 * parser produces inline {@link HTML} nodes for the <color> opening and closing tags.
 *
 * This function transforms AST by reducing siblings between HTML opening and closing nodes
 * into a single custom node {@link Color}. All siblings between the opening and closing nodes
 * become nested children of the new node.
 */
export const toColorNodes = <T extends Node>(tree: T): T => {
    // copy the tree to avoid modifying original
    const clone = structuredClone(tree);

    visit(clone, "html", (node: HTML, index, parent) => {
        // only process if the node is a child
        if (!parent) {
            return visit.CONTINUE;
        }

        // only process after encountering an opening tag
        if (!openingNodeRegex.test(node.value)) {
            return visit.CONTINUE;
        }
        const colorValue = node.value.match(openingNodeRegex)![1];

        // locate the matching closing tag sibling
        let closingIndex = undefined;

        // make sure to find the balanced closing tag
        // by increasing the nested level for each opening tag (starting from 1)
        // and decreasing it for each closing tag
        // when the level reaches 0, we have found the sibling index for matching closing tag
        // with that we can create a new Color node whose children are all the nodes between the opening and closing tags
        // (excluding the opening and closing tags)
        // potential inner color tags will be processed recursively
        // @TODO performance could be improved since deep nesting will result in multiple passes
        let level = 1;
        let i = index;
        while (++i < parent.children.length) {
            const nextNode = parent.children[i];
            // verify that the next node is an HTML node
            if (nextNode.type !== "html") {
                continue;
            }

            const nextValue = (nextNode as HTML).value;

            // check if it is another opening tag
            if (openingNodeRegex.test(nextValue)) {
                level++;
                continue;
            }

            // check if it is a closing tag
            if (closingNodeRegex.test(nextValue)) {
                level--;
                if (level === 0) {
                    // found the matching closing tag
                    closingIndex = i;
                    break;
                }
            }
        }

        // @TODO warn about unbalanced tags
        // if (closingIndex === null) {
        // }

        // create a new Color node
        // when closingIndex is undefined, it means the closing tag was not found
        // we'll recover by consuming all the remaining siblings
        const children = parent.children.slice(index + 1, closingIndex) as Content[];
        const colorNode: Color = {
            type: "color",
            children,
            value: colorValue,
        };

        // replace all the nodes between the opening and closing tags with the new Color node
        const deleteCount =
            1 + // opening tag
            children.length + // children nodes
            (closingIndex === undefined ? 0 : 1); // closing tag

        parent.children.splice(index, deleteCount, colorNode);

        // recurse into the newly created Color node to process any nested color tags
        return index;
    });

    return clone;
};

/**
 * Backward transformation of custom Color nodes to HTML nodes.
 *
 * @see toColorNodes
 */
export const fromColorNodes = <T extends Node>(tree: T): T => {
    // copy the tree to avoid modifying original
    const clone = structuredClone(tree);

    visit(clone, "color", (node: Color, index, parent) => {
        // only process if the node is a child
        if (!parent) {
            return visit.CONTINUE;
        }

        // replace the Color node with HTML opening and closing tags
        const openingTag = `<color value="${node.value}">`;
        const closingTag = "</color>";

        parent.children.splice(index, 1, { type: "html", value: openingTag } as HTML, ...node.children, {
            type: "html",
            value: closingTag,
        } as HTML);

        // recurse into the newly created Color node to process any nested color tags
        return index;
    });

    return clone;
};
