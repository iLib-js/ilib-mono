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
import structuredClone from "@ungap/structured-clone";

import { isUnistComponent, type UnistComponent } from "./unistComponent";

import type { HTML, Root } from "mdast";

/**
 * Create a transformed copy of AST
 * converting {@link UnistComponent} nodes to {@link HTML} node(s)
 * in the form of `<c0>...</c0>` or `<c0/>`
 * spreading children nodes between opening and closing tag if any are present.
 *
 * For example, given the following AST:
 * ```
 * [
 *   { type: "component", componentIndex: 0, children: [ { type: "text", value: "Bold" } ] },
 *   { type: "text", value: " regular" },
 * ]
 * ```
 * it produces the following AST:
 * ```
 * [
 *   { type: "html", value: "<c0>" },
 *   { type: "text", value: "Bold" },
 *   { type: "html", value: "</c0>" },
 *   { type: "text", value: " regular" },
 * ]
 * ```
 */
export const componentNodesToHtmlNodes = (tree: Root): Root => {
    // clone the tree to avoid modifying original
    const clone = structuredClone(tree);

    visit(clone, "component", (node, index, parent) => {
        // only process if the node is a child
        if (!parent) {
            return visit.CONTINUE;
        }

        // only process component nodes
        if (!isUnistComponent(node)) {
            return visit.CONTINUE;
        }

        const hasChildren = node.children.length > 0;
        let span;
        if (hasChildren) {
            const opening: HTML = { type: "html", value: `<c${node.componentIndex}>` };
            const closing: HTML = { type: "html", value: `</c${node.componentIndex}>` };
            span = [opening, ...node.children, closing];
        } else {
            const selfClosing: HTML = { type: "html", value: `<c${node.componentIndex}/>` };
            span = [selfClosing];
        }
        parent.children.splice(index, 1, ...span);

        return visit.CONTINUE;
    });

    return clone;
};

/**
 * Extracts data about a component from its HTML representation
 * `<c0>`, `</c0>`, `<c0/>`:
 * - 0 is the component index
 * - leading `/` indicates a closing component tag
 * - trailing `/` indicates a self-closing component tag
 */
const parseComponentFromHtml = (html: string) => {
    const match = html.match(/^<(?<closing>\/)?c(?<componentIndex>\d+)(?<selfClosing>\/)?>$/);
    if (!match || !match.groups) {
        return null;
    }

    const componentIndex = parseInt(match.groups.componentIndex, 10);
    const isClosing = match.groups.closing !== undefined;
    const isSelfClosing = match.groups.selfClosing !== undefined;
    return { componentIndex, isClosing, isSelfClosing };
};

/**
 * Create a transformed copy of AST
 * discovering {@link HTML} nodes that match component node format `<c0>`, `</c0>`, `<c0/>`
 * and backconverting them into {@link ComponentNode},
 * consuming any siblings between the opening and closing tags as children of the component node.
 */
export const htmlNodesToComponentNodes = (tree: Root): Root => {
    // clone the tree to avoid modifying original
    const clone = structuredClone(tree);

    visit(clone, "html", (node: HTML, index, parent) => {
        // only process if the node is a child
        if (!parent) {
            return visit.CONTINUE;
        }

        const htmlComponent = parseComponentFromHtml(node.value);
        if (!htmlComponent) {
            return visit.CONTINUE;
        }

        const { componentIndex } = htmlComponent;

        // unexpectedly encountered a closing component tag -
        // this should not happen as closing tags should be consumed immediately after
        // encountering an opening tag (code below); this might mean that
        // the components have been accidentally swapped
        if (htmlComponent.isClosing) {
            return visit.CONTINUE;
        }

        const componentNode: UnistComponent = {
            type: "component",
            componentIndex,
            children: [],
        };

        // self-closing component means no children,
        // so just replace the node with the newly created component node and return
        if (htmlComponent.isSelfClosing) {
            parent.children.splice(index, 1, componentNode);
            return visit.CONTINUE;
        }

        // otherwise it's an opening tag, so find the matching closing tag among siblings
        const closingNodeIndex = parent.children.findIndex((sibling, i) => {
            // only consider siblings after the current node
            if (i <= index) {
                return false;
            }

            // only consider HTML nodes
            if (sibling.type !== "html") {
                return false;
            }
            if (!("value" in sibling) || typeof sibling.value !== "string") {
                return false;
            }
            const htmlValue = sibling.value;

            // check if the HTML value is a matching closing component node
            const closingHtmlComponent = parseComponentFromHtml(htmlValue);
            if (!closingHtmlComponent) {
                return false;
            }

            if (!closingHtmlComponent.isClosing) {
                return false;
            }

            // ensure the html component index matches
            return closingHtmlComponent.componentIndex === componentIndex;
        });

        // don't replace this component due to missing closing tag
        // @TODO warn about missing closing tag
        if (closingNodeIndex === -1) {
            return visit.CONTINUE;
        }

        // unspread the children between the opening and closing tags
        const nodesBetween = parent.children.slice(index + 1, closingNodeIndex);
        componentNode.children = nodesBetween;

        // replace the whole span of nodes starting from the opening tag
        // up to and including the closing tag with the component node
        parent.children.splice(index, closingNodeIndex - index + 1, componentNode);

        // make sure to descend into the children of the newly inserted node
        // (note this does not suffer from a bug of traversing children of the original node,
        // because this node we've just replaced did not have any children to begin with)
        return index;
    });

    return clone;
};
