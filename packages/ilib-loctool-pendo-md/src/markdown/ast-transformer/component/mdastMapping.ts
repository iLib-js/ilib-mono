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

import type { Link, List, HTML, Strong, Delete, Emphasis, Content, ListItem } from "mdast";
import type { Node as UnistNode } from "unist";

import type { Color } from "../color/color";
import type { Underline } from "../../micromark-plugin/underline";

import { mapListItemWithWorkaround } from "./mapListItemWithWorkaround";
import type { UnistComponent } from "./unistComponent";

/**
 * Structure to hold data about the original node that was transformed into a component node.
 */
export interface BaseComponentData<NodeType extends string = string> {
    /**
     * Type of the original node. Used to recreate the original node from the component data.
     */
    type: NodeType;
}

// Simple node should be transformed into a UnistComponent node and return base data about the original

type MdastSimpleNode = Strong | Emphasis | Underline | Delete | ListItem;

// BaseComponentData mapped over MdastBasicNode
export type SimpleNodeData = MdastSimpleNode extends infer N
    ? N extends { type: infer T }
        ? BaseComponentData<T & string>
        : never
    : never;

// Nodes with additional data should also be transformed into a component node
// and return complex data about the original;

export interface LinkData extends BaseComponentData<Link["type"]> {
    /** Value of the URL attribute of the original link node. */
    url: string;
}

export interface ColorData extends BaseComponentData<Color["type"]> {
    /** Value of the color attribute of the original color node. */
    value: string;
}

export interface HTMLData extends BaseComponentData<HTML["type"]> {
    /** Value of the HTML attribute of the original HTML node. */
    value: string;
}

export interface ListData extends BaseComponentData<List["type"]> {
    /** Value of the ordered attribute of the original list node. */
    ordered?: boolean | null;
    /** Value of the spread attribute of the original list node. */
    spread?: boolean | null;
}

// Collected component datas
export type ComponentData = SimpleNodeData | LinkData | ListData | ColorData | HTMLData;

/**
 * Convert a mdast node to an escaped representation (typically a Component node) and its data representation.
 * Returns null if the node has no mapping.
 */
export const mapNodeToComponentData = (
    node: Content,
    componentIndex: number
): {
    component: UnistNode;
    data: ComponentData;
} | null => {
    const component = {
        type: "component",
        componentIndex,
        children: "children" in node ? node.children : [],
    } satisfies UnistComponent;

    // simple nodes
    if (
        node.type === "strong" ||
        node.type === "emphasis" ||
        node.type === "underline" ||
        node.type === "delete" ||
        node.type === "listItem"
    ) {
        const data: SimpleNodeData = { type: node.type };
        return { component, data };
    }

    if (node.type === "link") {
        const data: LinkData = { type: node.type, url: node.url };
        return { component, data };
    }

    if (node.type === "list") {
        const data: ListData = { type: node.type, ordered: node.ordered, spread: node.spread };
        return { component, data };
    }

    if (node.type === "color") {
        const data: ColorData = { type: node.type, value: node.value };
        return { component, data };
    }

    if (node.type === "html") {
        const data: HTMLData = { type: node.type, value: node.value };
        return { component, data };
    }

    // no mapping for other nodes
    return null;
};

// now the other way around - we encounter a Component node and need to recreate the original mdast node from the component data

/**
 * Recreate a Component node from its mapped representation.
 */
export const mapComponentDataToNode = (component: UnistComponent, data: ComponentData): Content => {
    if (data.type === "strong" || data.type === "emphasis" || data.type === "underline" || data.type === "delete") {
        return { type: data.type, children: component.children as any };
    }

    if (data.type === "link") {
        return { type: data.type, url: data.url, children: component.children as any };
    }

    if (data.type === "list") {
        return { type: data.type, spread: data.spread, ordered: data.ordered, children: component.children as any };
    }

    if (data.type === "listItem") {
        return mapListItemWithWorkaround(component);
    }

    if (data.type === "color") {
        return { type: data.type, value: data.value, children: component.children as any };
    }

    if (data.type === "html") {
        return { type: data.type, value: data.value };
    }

    // @ts-expect-error this should be exhaustive mapping
    throw new Error(`Unknown component data type: ${data.type}`);
};
