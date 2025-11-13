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
import { Parent as MdastParent, Content as MdastContent } from "mdast";
import { ComponentAst } from "./ComponentAst";

/**
 * Maps an Mdast node to a Component AST node.
 *
 * This function converts Mdast nodes to Component AST nodes by:
 * - mapping text literal nodes to Component AST text nodes
 * - escaping any other nodes as Components
 */
export const mapMdastNode = (node: MdastParent | MdastContent): ComponentAst.Node => {
    if (node.type === "text" && !("children" in node)) {
        const text: ComponentAst.Text = { type: "text", value: node.value };
        return text;
    }

    const component: ComponentAst.Component = { type: "component", originalNodes: [node] };

    if ("children" in node) {
        component.children = [];
    }

    return component;
};

/**
 * Recreates an Mdast node from a Component AST node.
 *
 * This is the inverse of {@link mapMdastNode}.
 */
export const unmapMdastNode = (node: ComponentAst.Node): MdastParent | MdastContent => {
    if (node.type === "text") {
        return { type: "text", value: node.value };
    }

    if (node.type !== "component") {
        // @ts-expect-error this should be exhaustive
        throw new Error(`Unexpected node type: ${node.type}`);
    }

    if (!node.originalNodes) {
        throw new Error("Invalid tree state: missing original nodes array");
    }

    if (node.originalNodes.length !== 1) {
        throw new Error("Invalid tree state: multiple original nodes");
    }

    // we don't have a way to preserve the exact type of the original node
    return node.originalNodes[0] as any;
};
