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
    mapToComponentAst,
    mapFromComponentAst,
} from "../../../../src/markdown/ast-transformer/component/mapUnistToComponentTree";
import {
    mapMdastNode,
    unmapMdastNode,
} from "../../../../src/markdown/ast-transformer/component/mapMdastNodeToComponent";
import u from "unist-builder";
import type { ComponentAst } from "../../../../src/markdown/ast-transformer/component/ComponentAst";
import type { Parent as UnistParent } from "unist";

describe("mapUnistToComponentTree", () => {
    describe("mapToComponentAst", () => {
        it("should map a simple Unist tree to a Component AST", () => {
            const unistTree = u("root", [u("paragraph", [u("text", "hello")])]);

            const result = mapToComponentAst(unistTree, mapMdastNode as any);

            expect(result.type).toBe("component");
            expect(result.originalNodes).toBeDefined();
            expect(result.originalNodes?.[0].type).toBe("root");
            expect(result.children).toHaveLength(1);
            expect(result.children?.[0].type).toBe("component");
        });

        it("should map a tree with nested nodes", () => {
            const unistTree = u("root", [u("paragraph", [u("text", "hello "), u("emphasis", [u("text", "world")])])]);

            const result = mapToComponentAst(unistTree, mapMdastNode as any);

            expect(result.type).toBe("component");
            expect(result.children?.[0].type).toBe("component");
            const paragraphChildren = (result.children?.[0] as ComponentAst.Component).children;
            expect(paragraphChildren).toHaveLength(2);
            expect(paragraphChildren?.[0].type).toBe("text");
            expect(paragraphChildren?.[1].type).toBe("component");
        });

        it("should map a tree with HTML nodes", () => {
            const unistTree = u("root", [u("paragraph", [u("html", "<br/>"), u("text", "text")])]);

            const result = mapToComponentAst(unistTree, mapMdastNode as any);

            expect(result.type).toBe("component");
            const paragraphChildren = (result.children?.[0] as ComponentAst.Component).children;
            expect(paragraphChildren?.[0].type).toBe("component");
            expect(paragraphChildren?.[1].type).toBe("text");
        });

        it("should clone original nodes to avoid side effects", () => {
            const unistTree = u("root", [u("paragraph", [])]);

            const result = mapToComponentAst(unistTree, mapMdastNode as any);

            expect(result.originalNodes?.[0]).not.toBe(unistTree);
            // The cloned node should have the same type but children are emptied by shallowCloneNode
            expect(result.originalNodes?.[0].type).toBe(unistTree.type);
            expect((result.originalNodes?.[0] as any).children).toEqual([]);
        });

        it("should handle an empty root", () => {
            const unistTree = u("root", []);

            const result = mapToComponentAst(unistTree, mapMdastNode as any);

            expect(result.type).toBe("component");
            expect(result.originalNodes).toEqual([unistTree]);
            expect(result.children).toEqual([]);
        });

        it("should handle multiple top-level nodes", () => {
            const unistTree = u("root", [u("paragraph", [u("text", "first")]), u("paragraph", [u("text", "second")])]);

            const result = mapToComponentAst(unistTree, mapMdastNode as any);

            expect(result.children).toHaveLength(2);
            expect(result.children?.[0].type).toBe("component");
            expect(result.children?.[1].type).toBe("component");
        });

        it("should map mdast with HTML and nested formatting to component ast", () => {
            // markdown: <br/> regular ~*italic strikethrough*~
            // prettier-ignore
            const mdast = u("root", [
                u("paragraph", [
                    u("html", "<br/>"),
                    u("text", " regular "),
                    u("delete", [
                        u("emphasis", [
                            u("text", "italic striketrough"),
                        ]),
                    ]),
                ])
            ]);
            const componentAst = mapToComponentAst(mdast, mapMdastNode as any);

            const expected = {
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

            expect(componentAst).toEqual(expected);
        });
    });

    describe("mapFromComponentAst", () => {
        it("should map a Component AST to a Unist tree", () => {
            const componentTree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("root", [])],
                children: [
                    {
                        type: "component",
                        originalNodes: [u("paragraph", [])],
                        children: [{ type: "text", value: "hello" }],
                    },
                ],
            };

            const result = mapFromComponentAst(componentTree, unmapMdastNode);

            expect(result.type).toBe("root");
            expect(result.children).toHaveLength(1);
            expect(result.children?.[0].type).toBe("paragraph");
        });

        it("should map a Component AST with nested components", () => {
            const componentTree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("root", [])],
                children: [
                    {
                        type: "component",
                        originalNodes: [u("paragraph", [])],
                        children: [
                            { type: "text", value: "hello " },
                            {
                                type: "component",
                                originalNodes: [u("emphasis", [])],
                                children: [{ type: "text", value: "world" }],
                            },
                        ],
                    },
                ],
            };

            const result = mapFromComponentAst(componentTree, unmapMdastNode);

            expect(result.type).toBe("root");
            const paragraph = result.children?.[0] as UnistParent;
            expect(paragraph?.type).toBe("paragraph");
            expect(paragraph?.children).toHaveLength(2);
        });

        it("should map a Component AST with HTML nodes", () => {
            const componentTree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("root", [])],
                children: [
                    {
                        type: "component",
                        originalNodes: [u("paragraph", [])],
                        children: [
                            {
                                type: "component",
                                originalNodes: [u("html", "<br/>")],
                            },
                            { type: "text", value: "text" },
                        ],
                    },
                ],
            };

            const result = mapFromComponentAst(componentTree, unmapMdastNode);

            expect(result.type).toBe("root");
            const paragraph = result.children?.[0] as UnistParent;
            expect(paragraph?.children?.[0].type).toBe("html");
            expect(paragraph?.children?.[1].type).toBe("text");
        });

        it("should clone nodes to avoid side effects", () => {
            const componentTree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("root", [])],
                children: [
                    {
                        type: "component",
                        originalNodes: [u("paragraph", [])],
                        children: [{ type: "text", value: "hello" }],
                    },
                ],
            };

            const result = mapFromComponentAst(componentTree, unmapMdastNode);

            expect(result).not.toBe(componentTree.originalNodes?.[0]);
        });

        it("should handle an empty Component AST", () => {
            const componentTree: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("root", [])],
                children: [],
            };

            const result = mapFromComponentAst(componentTree, unmapMdastNode);

            expect(result.type).toBe("root");
            expect(result.children).toEqual([]);
        });

        it("should reconstruct unist tree from component ast", () => {
            const unflattenedTree = {
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

            const reconstructedTree = mapFromComponentAst(unflattenedTree as any, unmapMdastNode);

            const expected = u("root", [
                u("paragraph", [
                    u("html", "<br/>"),
                    u("text", " regular "),
                    u("delete", [u("emphasis", [u("text", "italic striketrough")])]),
                ]),
            ]);

            expect(reconstructedTree).toEqual(expected);
        });
    });

    describe("round-trip mapping", () => {
        it("should map and unmap a simple tree correctly", () => {
            const unistTree = u("root", [u("paragraph", [u("text", "hello")])]);

            const componentTree = mapToComponentAst(unistTree, mapMdastNode as any);
            const reconstructedTree = mapFromComponentAst(componentTree, unmapMdastNode);

            expect(reconstructedTree).toEqual(unistTree);
        });

        it("should map and unmap a nested tree correctly", () => {
            const unistTree = u("root", [u("paragraph", [u("text", "hello "), u("emphasis", [u("text", "world")])])]);

            const componentTree = mapToComponentAst(unistTree, mapMdastNode as any);
            const reconstructedTree = mapFromComponentAst(componentTree, unmapMdastNode);

            expect(reconstructedTree).toEqual(unistTree);
        });

        it("should map and unmap a tree with HTML correctly", () => {
            const unistTree = u("root", [u("paragraph", [u("html", "<br/>"), u("text", "text")])]);

            const componentTree = mapToComponentAst(unistTree, mapMdastNode as any);
            const reconstructedTree = mapFromComponentAst(componentTree, unmapMdastNode);

            expect(reconstructedTree).toEqual(unistTree);
        });
    });
});
