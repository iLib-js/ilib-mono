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

export interface BaseComponentData {
    type: string;
}

export interface CBold extends BaseComponentData {
    type: "strong";
}

export interface CItalic extends BaseComponentData {
    type: "emphasis";
}

export interface CUnderline extends BaseComponentData {
    type: "underline";
}

export interface CStrikethrough extends BaseComponentData {
    type: "delete";
}

export interface CLink extends BaseComponentData {
    type: "link";
    url: string;
}

export interface CList extends BaseComponentData {
    type: "list";
    ordered: boolean;
}

export interface CListItem extends BaseComponentData {
    type: "listItem";
}

export interface CColor extends BaseComponentData {
    type: "color";
    value: string;
}

export interface CHTML extends BaseComponentData {
    type: "html";
    value: string;
}

/**
 * Possible component data types.
 */
interface ComponentDataMap {
    strong: CBold;
    emphasis: CItalic;
    underline: CUnderline;
    delete: CStrikethrough;
    link: CLink;
    list: CList;
    listItem: CListItem;
    color: CColor;
    html: CHTML;
}

/**
 * Holds data about substituted markdown syntax (i.e. mdast node) which allows it to be recreated later.
 */
export type ComponentData = ComponentDataMap[keyof ComponentDataMap];

/**
 * Sequence of components that were substituted in the mdast tree
 * (in the order of tree traversal).
 */
export type ComponentList = ComponentData[];
