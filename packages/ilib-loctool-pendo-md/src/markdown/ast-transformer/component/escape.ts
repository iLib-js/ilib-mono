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
import structuredClone from "@ungap/structured-clone";

import type { Node } from "unist";
import type { HTML } from "mdast";

/**
 * Mdast HTML component with component metadata injected.
 */
interface BaseComponentNode extends Node {
    type: "component";
    componentNode: string;
    componentIndex: number;
}

/**
 * `<c0>`
 */
interface ComponentOpen extends BaseComponentNode {
    componentNode: "open";
}

/**
 * `</c0>`
 */
interface ComponentClose extends BaseComponentNode {
    componentNode: "close";
}

/**
 * `<c0/>`
 */
interface ComponentSelfClosing extends BaseComponentNode {
    componentNode: "self-closing";
}

/**
 * Internal representation of a component within the markdown string
 */
type ComponentNode = ComponentOpen | ComponentClose | ComponentSelfClosing;

/**
 * Check if an arbitrary AST node is a {@link ComponentNode}
 */
const isComponentNode = (node: Node): node is ComponentNode =>
    node.type === "component" &&
    "componentNode" in node &&
    (node.componentNode === "open" || node.componentNode === "close" || node.componentNode === "self-closing") &&
    "componentIndex" in node &&
    typeof node.componentIndex === "number";

/**
 * Create a transformed copy of AST
 * discovering {@link HTML} nodes that match component node format `<c0>`, `</c0>`, `<c0/>`
 * and converting them into {@link ComponentNode} (by inserting additional component metadata into them).
 *
 * This should be applied after localized string with components like
 * ```markdown
 * localized <c0>text</c0>
 * ```
 * as been parsed into regular markdown AST:
 * ```
 * - text value: localized
 * - html value: <c0>
 * - text value: text
 * - html value: </c0>
 * ```
 * to transform existing regular HTML nodes into ComponentNodes:
 * ```
 * - text value: localized
 * - componentOpen value: <c0> componentIndex: 0, componentNode: open
 * - text value: text
 * - componentClose value: </c0> componentIndex: 0, componentNode: close
 * ```
 */
const htmlNodesToComponentNodes = <T extends Node>(tree: T): T => {
    // clone the tree to avoid modifying original
    const clone = structuredClone(tree);

    visit(clone, "html", (node: HTML, index, parent) => {
        // only process if the node is a child
        if (!parent) {
            return visit.CONTINUE;
        }

        const match = node.value.match(/^<(?<closing>\/)?c(?<componentIndex>\d+)(?<selfClosing>\/)?>$/);
        if (!match || !match.groups) {
            return visit.CONTINUE;
        }

        const componentIndex = match.groups.componentIndex;
        const closing = match.groups.closing !== undefined;
        const selfClosing = match.groups.selfClosing !== undefined;

        // replace the node with a ComponentNode
        const componentNode: ComponentNode = {
            type: "component",
            componentNode: selfClosing ? "self-closing" : closing ? "close" : "open",
            componentIndex: parseInt(componentIndex),
        };
        parent.children.splice(index, 1, componentNode);

        return visit.CONTINUE;
    });

    return clone;
};

/**
 * Create a transformed copy of AST
 * backconverting {@link ComponentNode} to regular {@link HTML} (stripping component metadata).
 * This is the reverse operation of {@link htmlNodesToComponentNodes}.
 *
 * This should be applied after the AST has been processed by {@link htmlNodesToComponentNodes}.
 */
const componentNodesToHtmlNodes = <T extends Node>(tree: T): T => {
    // clone the tree to avoid modifying original
    const clone = structuredClone(tree);

    visit(clone, (node: Node, index, parent) => {
        // only process if the node is a child
        if (!parent) {
            return visit.CONTINUE;
        }

        if (!isComponentNode(node)) {
            return visit.CONTINUE;
        }

        // replace the node with a regular HTML node
        const htmlValue = (() => {
            switch (node.componentNode) {
                case "open":
                    return `<c${node.componentIndex}>`;
                case "close":
                    return `</c${node.componentIndex}>`;
                case "self-closing":
                    return `<c${node.componentIndex}/>`;
            }
        })();
        const htmlNode: HTML = {
            type: "html",
            value: htmlValue,
        };
        parent.children.splice(index, 1, htmlNode);

        return visit.CONTINUE;
    });

    return clone;
};

/**
 * Given a normal mdast tree, traverse it looking for
 * Nodes which need to be substituted.
 *
 * Transform the tree by replacing all such nodes
 * with Component nodes (i.e. HTML components `<c0>, </c0>` or `<c0/>`).
 *
 * Additionally, keep track of replaced {@link ComponentData} types in a map,
 * so that they can be backconverted to mdast nodes later.
 *
 * For example, the following markdown:
 * ```markdown
 * text **bold** [linklabel](https://example.com) *italic*
 * ```
 *
 * will be transformed to
 * ```markdown
 * text <c0>bold</c0> <c1>linklabel</c1> <c2>italic</c2>
 * ```
 *
 * and produce the following components:
 * ```typescript
 * [
 *    { type: "strong" },
 *    { type: "link", url: "https://example.com" },
 *    { type: "emphasis" }
 * ]
 * ```
 *
 * @returns A tuple containing the transformed mdast tree and the substituted components.
 */
export const toComponents = <C, T extends Node>(
    tree: T,
    mapNodeToComponentData: (node: Node) => C | null,
): readonly [T, C[]] => {
    // copy the tree to avoid modifying original
    const clone = structuredClone(tree);

    // sequence of components which are substituted
    const components = [] as C[];

    visit(clone, (node, index, parent) => {
        // only process if the node is a child
        if (!parent) {
            return visit.CONTINUE;
        }

        // don't replace Component nodes which have already been inserted as part of the transformation
        if (isComponentNode(node)) {
            return visit.CONTINUE;
        }

        const component = mapNodeToComponentData(node);

        // no mapping needed for this node
        if (!component) {
            return visit.CONTINUE;
        }

        // store component data for the node
        components.push(component);
        const componentIndex = components.length - 1;

        // if current node has any children,
        // replace it with a span of the form <c0>...</c0>
        // i.e. [ HTML opening node, ...children, HTML closing node ]
        let span;

        if ("children" in node && Array.isArray(node.children) && node.children.length > 0) {
            const open: ComponentOpen = {
                type: "component",
                componentNode: "open",
                componentIndex,
            };
            const close: ComponentClose = {
                type: "component",
                componentNode: "close",
                componentIndex,
            };
            span = [open, ...(node.children as Node[]), close];
        }
        // otherwise use a self-closing tag
        else {
            const selfClosing: ComponentSelfClosing = {
                type: "component",
                componentNode: "self-closing",
                componentIndex,
            };
            span = [selfClosing];
        }

        // replace the node with node span
        parent.children.splice(index, 1, ...span);

        // make sure to avoid processing children of the original node
        return visit.SKIP;
    });

    // obtain plain mdast tree by backconverting any remaining Component nodes into regular HTML nodes
    // (this should only be the case if the component was not replaced due to missing closing tag or missing component data)
    const cloneNoComponents = componentNodesToHtmlNodes(clone);

    return [cloneNoComponents, components];
};

/**
 * Backconverts the escaped AST (parsed from a string with components) to the original AST
 * using previosly substituted components.
 */
export const fromComponents = <C, T extends Node>(
    tree: T,
    components: C[],
    mapComponentDataToNode: (componentData: C) => Node,
): T => {
    // create a transformed copy of the AST
    // discovering and transforming any HTML node that matches the component node format
    const cloneWithComponents = htmlNodesToComponentNodes(tree);

    visit(cloneWithComponents, (node: Node, index, parent) => {
        // only process if the node is a child
        if (!parent) {
            return visit.CONTINUE;
        }

        // ensure this is either a component open or self closing node
        if (!isComponentNode(node) || node.componentNode === "close") {
            return visit.CONTINUE;
        }

        const { componentIndex } = node;

        if (!components[componentIndex]) {
            // @TODO warn about missing component

            // don't replace this component because it's missing
            return visit.CONTINUE;
        }

        // recreate the original mdast node from component data
        const originalNode = mapComponentDataToNode(components[componentIndex]);

        // self-closing component means no children
        if (node.componentNode === "self-closing") {
            // replace the self-closing HTML component with the original mdast node
            parent.children.splice(index, 1, originalNode);

            return visit.CONTINUE;
        }

        // otherwise it's an opening node, so locate the matching closing node
        const closingNodeIndex = parent.children.findIndex(
            (child, i) =>
                i > index &&
                isComponentNode(child) &&
                child.componentNode === "close" &&
                child.componentIndex === componentIndex,
        );

        if (closingNodeIndex === -1) {
            // @TODO warn about missing closing tag

            // don't replace this component due to missing closing tag
            return visit.CONTINUE;
        }

        // make sure that original component allows children
        // (this should hold true as long as a self-closing tag was not manually replaced with wrapping tags)
        if (!("children" in originalNode)) {
            // @TODO warn about component not allowing children

            // don't replace this component becase it's not supposed to have children
            return visit.CONTINUE;
        }

        // replace HTML nodes span with the original mdast node
        // and put nodes from between the opening and closing tags
        originalNode.children = parent.children.slice(index + 1, closingNodeIndex);
        parent.children.splice(index, closingNodeIndex - index + 1, originalNode);

        // make sure to descend into the children of the newly inserted node
        // (note this does not suffer from a bug of traversing children of the original node,
        // because this node we've just replaced did not have any children to begin with)
        return index;
    });

    // backconversion is complete, so remove any remaining Component nodes
    // in case they were not replaced due to missing closing tag or missing component data
    const cloneNoComponents = componentNodesToHtmlNodes(cloneWithComponents);

    return cloneNoComponents;
};
