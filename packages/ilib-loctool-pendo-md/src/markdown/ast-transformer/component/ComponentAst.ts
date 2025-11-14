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
import type { enumerateComponents } from "./ComponentData";
import type { parseComponentString } from "./stringifyComponentTree";
import type { flattenComponentTree } from "./flattenComponentTree";

export declare namespace ComponentAst {
    /** Text literal node of the Component AST. */
    export interface Text {
        type: "text";
        value: string;
    }

    /** Component node of the Component AST. */
    export interface Component {
        type: "component";
        children?: Node[];

        /**
         * Index of the component in the Component AST.
         * This can be set by the {@link enumerateComponents} function,
         * or while parsing an escaped string with {@link parseComponentString}.
         */
        componentIndex?: number;

        /**
         * Original Unist nodes which were escaped using Components.
         * There can be one or more of those, depending on whether the tree
         * was flattened with {@link flattenComponentTree}.
         */
        originalNodes?: UnistNode[];
    }

    /**
     * Index of the root component in the Component AST.
     * Set to -1, as it's not meant to be rendered in the escaped string.
     */
    export type RootComponentIndex = typeof ROOT_COMPONENT_INDEX;

    export interface Root extends Component {
        componentIndex: RootComponentIndex;
        children: NonNullable<Component["children"]>;
    }

    /**
     * Union type of all allowed nodes in the Component AST.
     */
    export type Node = Root | Component | Text;
}

/**
 * Index of the root component in the Component AST.
 * See {@link ComponentAst.RootComponentIndex}
 */
export const ROOT_COMPONENT_INDEX = -1 as const;

/**
 * Checks if a provided object is a Component AST node.
 * @param node - The object to check.
 * @returns Whether the object is a Component AST node.
 */
export const isComponentNode = (node: unknown): node is ComponentAst.Component => {
    if (typeof node !== "object" || node === null) {
        return false;
    }
    if (!("type" in node) || node.type !== "component") {
        return false;
    }
    if ("componentIndex" in node && typeof node.componentIndex !== "number") {
        return false;
    }
    if ("children" in node && !Array.isArray(node.children)) {
        return false;
    }
    if ("originalNodes" in node && !Array.isArray(node.originalNodes)) {
        return false;
    }
    return true;
};
