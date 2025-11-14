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
    flattenComponentTree,
    unflattenComponentTree,
} from "../../../../src/markdown/ast-transformer/component/flattenComponentTree";
import type { ComponentAst } from "../../../../src/markdown/ast-transformer/component/ComponentAst";
import { ROOT_COMPONENT_INDEX } from "../../../../src/markdown/ast-transformer/component/ComponentAst";
import u from "unist-builder";

describe("flattenComponentTree", () => {
    describe("flattenComponentTree", () => {
        it("should flatten a chain of one-child nested components", () => {
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
                                children: [
                                    {
                                        type: "component",
                                        originalNodes: [u("delete", [])],
                                        children: [{ type: "text", value: "some text" }],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };

            const result = flattenComponentTree(tree);

            const expectedTree = {
                type: "component",
                originalNodes: [u("root", []), u("paragraph", []), u("emphasis", []), u("delete", [])],
                children: [{ type: "text", value: "some text" }],
            };

            expect(result).toEqual(expectedTree);
        });

        it("should not flatten components with multiple children", () => {
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
                                children: [
                                    {
                                        type: "component",
                                        originalNodes: [u("delete", [])],
                                        children: [{ type: "text", value: "some text" }],
                                    },
                                    { type: "text", value: " some text" },
                                ],
                            },
                            { type: "text", value: " some text " },
                            {
                                type: "component",
                                originalNodes: [u("emphasis", [])],
                                children: [
                                    {
                                        type: "component",
                                        originalNodes: [u("delete", [])],
                                        children: [{ type: "text", value: "some text" }],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };

            const result = flattenComponentTree(tree);

            const expected = {
                type: "component",
                originalNodes: [u("root", []), u("paragraph", [])],
                children: [
                    {
                        type: "component",
                        originalNodes: [u("emphasis", [])],
                        children: [
                            {
                                type: "component",
                                originalNodes: [u("delete", [])],
                                children: [{ type: "text", value: "some text" }],
                            },
                            { type: "text", value: " some text" },
                        ],
                    },
                    { type: "text", value: " some text " },
                    {
                        type: "component",
                        originalNodes: [u("emphasis", []), u("delete", [])],
                        children: [{ type: "text", value: "some text" }],
                    },
                ],
            };
            expect(result).toEqual(expected);
        });

        it("should flatten components with one component child even if that child has text", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("paragraph", [])],
                children: [
                    {
                        type: "component",
                        originalNodes: [u("emphasis", [])],
                        children: [{ type: "text", value: "text" }],
                    },
                ],
            };

            const result = flattenComponentTree(tree);

            expect(result.originalNodes).toEqual([u("paragraph", []), u("emphasis", [])]);
            expect(result.children).toEqual([{ type: "text", value: "text" }]);
        });

        it("should not flatten components with no children", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("html", "<br/>")],
            };

            const result = flattenComponentTree(tree);

            expect(result.originalNodes).toEqual([u("html", "<br/>")]);
            expect(result.children).toBeUndefined();
        });

        it("should flatten multiple nested chains", () => {
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
                                originalNodes: [u("list", [])],
                                children: [{ type: "text", value: "item 1" }],
                            },
                        ],
                    },
                    {
                        type: "component",
                        originalNodes: [u("paragraph", [])],
                        children: [
                            {
                                type: "component",
                                originalNodes: [u("list", [])],
                                children: [{ type: "text", value: "item 2" }],
                            },
                        ],
                    },
                ],
            };

            const result = flattenComponentTree(tree);

            expect((result.children?.[0] as ComponentAst.Component).originalNodes).toEqual([
                u("paragraph", []),
                u("list", []),
            ]);
            expect((result.children?.[1] as ComponentAst.Component).originalNodes).toEqual([
                u("paragraph", []),
                u("list", []),
            ]);
        });

        it("should throw an error if originalNodes is missing", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                children: [
                    {
                        type: "component",
                        children: [{ type: "text", value: "text" }],
                    },
                ],
            };

            expect(() => flattenComponentTree(tree)).toThrow("Invalid tree state: missing original nodes array");
        });

        it("should not mutate the original tree", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("paragraph", [])],
                children: [
                    {
                        type: "component",
                        originalNodes: [u("list", [])],
                        children: [{ type: "text", value: "item 1" }],
                    },
                ],
            };

            const originalLength = tree.originalNodes!.length;

            const result = flattenComponentTree(tree);

            expect(result).not.toBe(tree);
            // Verify the result has the expected flattened structure
            expect(result.originalNodes).toHaveLength(2);
            // Verify the original tree is not mutated
            expect(tree.originalNodes).toHaveLength(originalLength);
        });

        it("should flatten a component tree with nested components", () => {
            const firstPassAst = {
                type: "component",
                originalNodes: [{ type: "root", children: [] }],
                children: [
                    {
                        type: "component",
                        originalNodes: [{ type: "paragraph", children: [] }],
                        children: [
                            {
                                type: "component",
                                originalNodes: [{ type: "html", value: "<br/>" }],
                                children: [],
                            },
                            { type: "text", value: " regular " },
                            {
                                type: "component",
                                originalNodes: [{ type: "delete", children: [] }],
                                children: [
                                    {
                                        type: "component",
                                        originalNodes: [{ type: "emphasis", children: [] }],
                                        children: [{ type: "text", value: "italic striketrough" }],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };

            const flattenedAst = flattenComponentTree(firstPassAst as any);

            const expected = {
                type: "component",
                originalNodes: [
                    { type: "root", children: [] },
                    { type: "paragraph", children: [] },
                ],
                children: [
                    {
                        type: "component",
                        originalNodes: [{ type: "html", value: "<br/>" }],
                        children: [],
                    },
                    { type: "text", value: " regular " },
                    {
                        type: "component",
                        originalNodes: [
                            { type: "delete", children: [] },
                            { type: "emphasis", children: [] },
                        ],
                        children: [{ type: "text", value: "italic striketrough" }],
                    },
                ],
            };
            expect(flattenedAst).toEqual(expected);
        });
    });

    describe("unflattenComponentTree", () => {
        it("should unflatten a flattened component tree", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("paragraph", []), u("list", [])],
                children: [{ type: "text", value: "item 1" }],
            };

            const result = unflattenComponentTree(tree);

            expect(result.originalNodes).toEqual([u("paragraph", [])]);
            expect(result.children?.[0].type).toBe("component");
            expect((result.children?.[0] as ComponentAst.Component).originalNodes).toEqual([u("list", [])]);
            expect((result.children?.[0] as ComponentAst.Component).children).toEqual([
                { type: "text", value: "item 1" },
            ]);
        });

        it("should unflatten a component with multiple original nodes", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("paragraph", []), u("list", []), u("listItem", [])],
                children: [{ type: "text", value: "item 1" }],
            };

            const result = unflattenComponentTree(tree);

            expect(result.originalNodes).toEqual([u("paragraph", [])]);
            const firstChild = result.children?.[0] as ComponentAst.Component;
            expect(firstChild.originalNodes).toEqual([u("list", [])]);
            const secondChild = firstChild.children?.[0] as ComponentAst.Component;
            expect(secondChild.originalNodes).toEqual([u("listItem", [])]);
            expect(secondChild.children).toEqual([{ type: "text", value: "item 1" }]);
        });

        it("should not unflatten a component with a single original node", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("paragraph", [])],
                children: [{ type: "text", value: "text" }],
            };

            const result = unflattenComponentTree(tree);

            expect(result.originalNodes).toEqual([u("paragraph", [])]);
            expect(result.children).toEqual([{ type: "text", value: "text" }]);
        });

        it("should handle nested flattened components", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("root", [])],
                children: [
                    {
                        type: "component",
                        originalNodes: [u("paragraph", []), u("list", [])],
                        children: [{ type: "text", value: "item 1" }],
                    },
                ],
            };

            const result = unflattenComponentTree(tree);

            expect(result.originalNodes).toEqual([u("root", [])]);
            const child = result.children?.[0] as ComponentAst.Component;
            expect(child.originalNodes).toEqual([u("paragraph", [])]);
            expect(child.children?.[0].type).toBe("component");
        });

        it("should throw an error if originalNodes is missing", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                children: [{ type: "text", value: "text" }],
            };

            expect(() => unflattenComponentTree(tree)).toThrow("Invalid tree state: missing original nodes array");
        });

        it("should not mutate the original tree", () => {
            const tree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("paragraph", []), u("list", [])],
                children: [{ type: "text", value: "item 1" }],
            };
            const originalLength = tree.originalNodes!.length;

            const result = unflattenComponentTree(tree);

            expect(result).not.toBe(tree);
            // The original tree should remain unchanged (originalNodes array might be shared, so check the result instead)
            expect(result.originalNodes).toHaveLength(1);
            // Verify the original tree is not mutated
            expect(tree.originalNodes).toHaveLength(originalLength);
        });

        it("should unflatten a component tree with multiple original nodes", () => {
            const flattenedTree = {
                type: "component",
                componentIndex: ROOT_COMPONENT_INDEX,
                originalNodes: [
                    { type: "root", children: [] },
                    { type: "paragraph", children: [] },
                ],
                children: [
                    {
                        type: "component",
                        componentIndex: 0,
                        originalNodes: [{ type: "html", value: "<br/>" }],
                        children: [],
                    },
                    { type: "text", value: " regular " },
                    {
                        type: "component",
                        componentIndex: 1,
                        originalNodes: [
                            { type: "delete", children: [] },
                            { type: "emphasis", children: [] },
                        ],
                        children: [{ type: "text", value: "italic striketrough" }],
                    },
                ],
            };

            const unflattenedTree = unflattenComponentTree(flattenedTree as any);

            const expected = {
                type: "component",
                componentIndex: ROOT_COMPONENT_INDEX,
                originalNodes: [{ type: "root", children: [] }],
                children: [
                    {
                        type: "component",
                        originalNodes: [{ type: "paragraph", children: [] }],
                        children: [
                            {
                                type: "component",
                                componentIndex: 0,
                                originalNodes: [{ type: "html", value: "<br/>" }],
                                children: [],
                            },
                            { type: "text", value: " regular " },
                            {
                                type: "component",
                                componentIndex: 1,
                                originalNodes: [{ type: "delete", children: [] }],
                                children: [
                                    {
                                        type: "component",
                                        originalNodes: [{ type: "emphasis", children: [] }],
                                        children: [{ type: "text", value: "italic striketrough" }],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };

            expect(unflattenedTree).toEqual(expected);
        });
    });
});
