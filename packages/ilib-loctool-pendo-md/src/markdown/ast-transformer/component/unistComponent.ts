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

import type { Node as UnistNode, Parent as UnistParent } from "unist";

/**
 * Unist (**NOT** mdast!) node which represents a Component i.e. element that was substituted.
 *
 * This is a _temporary_ node type which is used to represent a Component
 * i.e. a substitution of a Markdown syntax.
 *
 * This kind of node cannot be rendered as Markdown text,
 * so later it should be converted into HTML representation in the form of `<c0>...</c0>` or `<c0/>`.
 */
export interface UnistComponent<ChildNode extends UnistNode<object> = UnistNode> extends UnistParent<ChildNode> {
    type: "component";
    componentIndex: number;
    children: ChildNode[];
}

/**
 * Checks if a node is a {@link UnistComponent}.
 */
export const isUnistComponent = (node: UnistNode): node is UnistComponent =>
    node.type === "component" && "componentIndex" in node && "children" in node && Array.isArray(node.children);
