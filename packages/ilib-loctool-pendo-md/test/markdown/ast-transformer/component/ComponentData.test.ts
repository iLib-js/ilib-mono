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

import {
    extractComponentData,
    injectComponentData,
    enumerateComponents,
} from "../../../../src/markdown/ast-transformer/component/ComponentData";
import { ROOT_COMPONENT_INDEX } from "../../../../src/markdown/ast-transformer/component/ComponentAst";
import type { ComponentAst } from "../../../../src/markdown/ast-transformer/component/ComponentAst";
import u from "unist-builder";

describe("ComponentData", () => {
    describe("extractComponentData", () => {
        it("should extract component data from a simple tree", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                componentIndex: ROOT_COMPONENT_INDEX,
                originalNodes: [u("root", [])],
                children: [
                    {
                        type: "component",
                        componentIndex: 0,
                        originalNodes: [u("paragraph", [])],
                    },
                ],
            };

            const data = extractComponentData(tree);

            expect(data.size).toBe(2);
            expect(data.get(ROOT_COMPONENT_INDEX)).toEqual([u("root", [])]);
            expect(data.get(0)).toEqual([u("paragraph", [])]);
        });

        it("should extract component data from a nested tree", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                componentIndex: ROOT_COMPONENT_INDEX,
                originalNodes: [u("root", [])],
                children: [
                    {
                        type: "component",
                        componentIndex: 0,
                        originalNodes: [u("paragraph", [])],
                        children: [
                            {
                                type: "component",
                                componentIndex: 1,
                                originalNodes: [u("emphasis", [])],
                                children: [{ type: "text", value: "text" }],
                            },
                        ],
                    },
                ],
            };

            const data = extractComponentData(tree);

            expect(data.size).toBe(3);
            expect(data.get(ROOT_COMPONENT_INDEX)).toEqual([u("root", [])]);
            expect(data.get(0)).toEqual([u("paragraph", [])]);
            expect(data.get(1)).toEqual([u("emphasis", [])]);
        });

        it("should extract component data with multiple original nodes", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                componentIndex: 0,
                originalNodes: [u("paragraph", []), u("list", [])],
            };

            const data = extractComponentData(tree);

            expect(data.size).toBe(1);
            expect(data.get(0)).toEqual([u("paragraph", []), u("list", [])]);
        });

        it("should throw an error if component index is undefined", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("root", [])],
            };

            expect(() => extractComponentData(tree)).toThrow("Component index is undefined");
        });

        it("should throw an error if originalNodes is missing", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                componentIndex: 0,
            };

            expect(() => extractComponentData(tree)).toThrow("Invalid tree state: missing original nodes array");
        });
    });

    describe("injectComponentData", () => {
        it("should inject component data into a tree", () => {
            const tree: ComponentAst.Root = {
                type: "component",
                componentIndex: ROOT_COMPONENT_INDEX,
                children: [
                    {
                        type: "component",
                        componentIndex: 0,
                    },
                ],
            };

            const componentData = new Map([
                [ROOT_COMPONENT_INDEX, [u("root", [])]],
                [0, [u("paragraph", [])]],
            ]);

            const result = injectComponentData(tree, componentData);

            expect(result.originalNodes).toEqual([u("root", [])]);
            expect((result.children?.[0] as ComponentAst.Component).originalNodes).toEqual([u("paragraph", [])]);
        });

        it("should inject component data into a nested tree", () => {
            const tree: ComponentAst.Root = {
                type: "component",
                componentIndex: ROOT_COMPONENT_INDEX,
                children: [
                    {
                        type: "component",
                        componentIndex: 0,
                        children: [
                            {
                                type: "component",
                                componentIndex: 1,
                            },
                        ],
                    },
                ],
            };

            const componentData = new Map([
                [ROOT_COMPONENT_INDEX, [u("root", [])]],
                [0, [u("paragraph", [])]],
                [1, [u("emphasis", [])]],
            ]);

            const result = injectComponentData(tree, componentData);

            expect(result.originalNodes).toEqual([u("root", [])]);
            expect((result.children?.[0] as ComponentAst.Component).originalNodes).toEqual([u("paragraph", [])]);
            expect(
                ((result.children?.[0] as ComponentAst.Component).children?.[0] as ComponentAst.Component).originalNodes
            ).toEqual([u("emphasis", [])]);
        });

        it("should not mutate the original tree", () => {
            const tree: ComponentAst.Root = {
                type: "component",
                componentIndex: ROOT_COMPONENT_INDEX,
                children: [
                    {
                        type: "component",
                        componentIndex: 0,
                    },
                ],
            };

            const componentData = new Map([
                [ROOT_COMPONENT_INDEX, [u("root", [])]],
                [0, [u("paragraph", [])]],
            ]);

            const result = injectComponentData(tree, componentData);

            expect(result).not.toBe(tree);
            expect((tree.children?.[0] as ComponentAst.Component).originalNodes).toBeUndefined();
        });

        it("should throw an error if component index is undefined", () => {
            const tree: ComponentAst.Root = {
                type: "component",
                componentIndex: ROOT_COMPONENT_INDEX,
                children: [
                    {
                        type: "component",
                        // componentIndex is missing
                    },
                ],
            };

            const componentData = new Map([[ROOT_COMPONENT_INDEX, [u("root", [])]]]);

            expect(() => injectComponentData(tree, componentData)).toThrow(
                "Invalid tree state: component index is undefined"
            );
        });

        it("should throw an error if component data is missing", () => {
            const tree: ComponentAst.Root = {
                type: "component",
                componentIndex: ROOT_COMPONENT_INDEX,
                children: [
                    {
                        type: "component",
                        componentIndex: 0,
                    },
                ],
            };

            const componentData = new Map([[ROOT_COMPONENT_INDEX, [u("root", [])]]]);

            expect(() => injectComponentData(tree, componentData)).toThrow(
                "Missing component data for component index 0"
            );
        });
    });

    describe("enumerateComponents", () => {
        it("should enumerate components starting from ROOT_COMPONENT_INDEX", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("root", [])],
                children: [
                    {
                        type: "component",
                        originalNodes: [u("paragraph", [])],
                    },
                    {
                        type: "component",
                        originalNodes: [u("emphasis", [])],
                    },
                ],
            };

            const result = enumerateComponents(tree);

            expect(result.componentIndex).toBe(ROOT_COMPONENT_INDEX);
            expect((result.children?.[0] as ComponentAst.Component).componentIndex).toBe(0);
            expect((result.children?.[1] as ComponentAst.Component).componentIndex).toBe(1);
        });

        it("should enumerate nested components", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("root", [])],
                children: [
                    {
                        type: "component",
                        originalNodes: [u("paragraph", [])],
                        children: [
                            {
                                type: "component",
                                originalNodes: [u("emphasis", [])],
                            },
                        ],
                    },
                ],
            };

            const result = enumerateComponents(tree);

            expect(result.componentIndex).toBe(ROOT_COMPONENT_INDEX);
            expect((result.children?.[0] as ComponentAst.Component).componentIndex).toBe(0);
            expect(
                ((result.children?.[0] as ComponentAst.Component).children?.[0] as ComponentAst.Component)
                    .componentIndex
            ).toBe(1);
        });

        it("should not mutate the original tree", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("root", [])],
                children: [
                    {
                        type: "component",
                        originalNodes: [u("paragraph", [])],
                    },
                ],
            };

            const result = enumerateComponents(tree);

            expect(result).not.toBe(tree);
            expect((tree.children?.[0] as ComponentAst.Component).componentIndex).toBeUndefined();
        });

        it("should handle a tree with only root component", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("root", [])],
                children: [{ type: "text", value: "text" }],
            };

            const result = enumerateComponents(tree);

            expect(result.componentIndex).toBe(ROOT_COMPONENT_INDEX);
            expect(result.children).toEqual([{ type: "text", value: "text" }]);
        });

        it("should handle a tree with text nodes", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("root", [])],
                children: [
                    { type: "text", value: "text1" },
                    {
                        type: "component",
                        originalNodes: [u("paragraph", [])],
                    },
                    { type: "text", value: "text2" },
                ],
            };

            const result = enumerateComponents(tree);

            expect(result.componentIndex).toBe(ROOT_COMPONENT_INDEX);
            expect(result.children?.[0]).toEqual({ type: "text", value: "text1" });
            expect((result.children?.[1] as ComponentAst.Component).componentIndex).toBe(0);
            expect(result.children?.[2]).toEqual({ type: "text", value: "text2" });
        });
    });
});
