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

import { fromComponents as baseFromComponents, toComponents as baseToComponents } from "./escape";
import { mapNodeToComponentData, mapComponentDataToNode } from "./mapping";

import type { Parent } from "mdast";
import type { ComponentData, ComponentList } from "./componentData";

// inject the component mapping into ast transform
const toComponents = <T extends Parent>(ast: T) => baseToComponents(ast, mapNodeToComponentData);
const fromComponents = <T extends Parent>(ast: T, components: ComponentList) =>
    baseFromComponents(ast, components, mapComponentDataToNode);

export { ComponentData, ComponentList };
export default {
    fromComponents,
    toComponents,
};
