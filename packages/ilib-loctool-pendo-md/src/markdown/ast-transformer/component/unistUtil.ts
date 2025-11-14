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
import structuredClone from "@ungap/structured-clone";
/**
 * Deep clone a Unist node except for its children.
 * This is useful to avoid unexpected side effects when modifying the tree.
 */
export const cloneNodeWithoutChildren = (node: UnistNode): UnistNode => {
    let shallowClone = { ...node };
    if ("children" in shallowClone && Array.isArray(shallowClone.children)) {
        shallowClone.children = [];
    }
    return structuredClone(shallowClone);
};

/**
 * Deep clone a Unist tree.
 */
export const cloneTree = <T extends UnistNode>(tree: T): T => {
    return structuredClone(tree);
};
