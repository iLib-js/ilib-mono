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

import type { Node as MNode } from "unist";
import type {
    Link as MLink,
    List as MList,
    HTML as MHTML,
    Emphasis as MEmphasis,
    Strong as MStrong,
    Delete as MDelete,
    ListItem as MListItem,
} from "mdast";

import type { Color as MColor } from "../color/color";
import type { Underline as MUnderline } from "../../micromark-plugin/underline";
import { ComponentData } from ".";

/**
 * Create a component data representation from a mdast node.
 *
 * This is used to remember what markdown syntax was escaped
 * by mapping from {@link MNode.type} to {@link ComponentData.type}. It also allows
 * to store additional data (like URL value for links) which should be blocked from translation
 * (i.e. not present in the escaped string).
 */
export const mapNodeToComponentData = (node: MNode): ComponentData | null => {
    switch (node.type) {
        // basic wrapping nodes
        case "strong":
        case "emphasis":
        case "underline":
        case "delete":
            return { type: node.type };
        // link node is also wrapping (over the link label), but we need to keep the URL -
        case "link":
            return { type: "link", url: (node as MLink).url };
        // list nodes are block-level, so they should become `<c0><c1>item</c1></c0>`
        case "list":
            return { type: "list", ordered: (node as MList).ordered ?? false };
        // list items only wrap the content, so they should become `<c0>item</c0>`
        case "listItem":
            return { type: "listItem" };
        // color node is a span-level node, so it should become `<c0>text</c0>` with a color attribute
        case "color":
            return { type: "color", value: (node as MColor).value };
        case "html":
            return { type: "html", value: (node as MHTML).value };
        // ignore other nodes
        default:
            return null;
    }
};

/**
 * Recreate a mdast node from a component data representation.
 *
 * This is used to convert the escaped syntax back to a proper mdast tree node.
 * It is the inverse of {@link mapNodeToComponentData}.
 */
export const mapComponentDataToNode = (component: ComponentData) => {
    switch (component.type) {
        case "strong":
            return { type: "strong", children: [] } as MStrong;
        case "emphasis":
            return { type: "emphasis", children: [] } as MEmphasis;
        case "underline":
            return { type: "underline", children: [] } as MUnderline;
        case "delete":
            return { type: "delete", children: [] } as MDelete;
        case "link":
            return { type: "link", url: component.url, children: [] } as MLink;
        case "list":
            return { type: "list", ordered: component.ordered, children: [] } as MList;
        case "listItem":
            return { type: "listItem", children: [] } as MListItem;
        case "color":
            return { type: "color", value: component.value, children: [] } as MColor;
        case "html":
            return { type: "html", value: component.value } as MHTML;
        default:
            // @ts-expect-error this should be an exhaustive check
            throw new Error(`Unknown component type: ${component.type}`);
    }
};
