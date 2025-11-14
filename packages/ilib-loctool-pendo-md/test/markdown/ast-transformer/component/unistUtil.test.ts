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

import { cloneNodeWithoutChildren, cloneTree } from "../../../../src/markdown/ast-transformer/component/unistUtil";
import u from "unist-builder";

describe("unistUtil", () => {
    describe("shallowCloneNode", () => {
        it("should clone a text node", () => {
            const node = u("text", "hello");

            const result = cloneNodeWithoutChildren(node);

            expect(result).toEqual(node);
            expect(result).not.toBe(node);
        });

        it("should shallow clone a node with children, omitting children", () => {
            const node = u("paragraph", [u("text", "hello")]);

            const result = cloneNodeWithoutChildren(node);

            expect(result.type).toBe("paragraph");
            expect((result as any).children).toEqual([]);
            expect(result).not.toBe(node);
        });

        it("should preserve node properties", () => {
            const node = u("html", "<br/>");

            const result = cloneNodeWithoutChildren(node);

            expect(result).toEqual(node);
            expect(result).not.toBe(node);
        });

        it("should handle a node with additional properties", () => {
            const node = {
                type: "custom",
                value: "test",
                data: { custom: true },
            } as any;

            const result = cloneNodeWithoutChildren(node);

            expect(result.type).toBe("custom");
            expect((result as any).value).toBe("test");
            expect((result as any).data).toEqual({ custom: true });
            expect(result).not.toBe(node);
        });

        it("should handle a root node", () => {
            const node = u("root", []);

            const result = cloneNodeWithoutChildren(node);

            expect(result.type).toBe("root");
            expect((result as any).children).toEqual([]);
            expect(result).not.toBe(node);
        });

        it("should deep clone node properties", () => {
            const node = {
                type: "custom",
                data: { elements: ["a", "b", "c"] },
            } as any;

            const result = cloneNodeWithoutChildren(node);
            // mutate the clone
            (result.data?.elements as string[]).push("d");
            expect(result.data?.elements).toEqual(["a", "b", "c", "d"]);

            // verify the original is not mutated
            expect(node.data?.elements).toEqual(["a", "b", "c"]);
        });
    });

    describe("cloneTree", () => {
        it("should clone a simple tree", () => {
            const tree = u("root", [u("paragraph", [u("text", "hello")])]);

            const result = cloneTree(tree);

            expect(result).toEqual(tree);
            expect(result).not.toBe(tree);
        });

        it("should deep clone a nested tree", () => {
            const tree = u("root", [u("paragraph", [u("text", "hello "), u("emphasis", [u("text", "world")])])]);

            const result = cloneTree(tree);

            expect(result).toEqual(tree);
            expect(result).not.toBe(tree);
            expect(result.children?.[0]).not.toBe(tree.children?.[0]);
        });

        it("should clone a tree with multiple children", () => {
            const tree = u("root", [u("paragraph", [u("text", "first")]), u("paragraph", [u("text", "second")])]);

            const result = cloneTree(tree);

            expect(result).toEqual(tree);
            expect(result).not.toBe(tree);
            expect(result.children?.[0]).not.toBe(tree.children?.[0]);
            expect(result.children?.[1]).not.toBe(tree.children?.[1]);
        });

        it("should clone an empty tree", () => {
            const tree = u("root", []);

            const result = cloneTree(tree);

            expect(result).toEqual(tree);
            expect(result).not.toBe(tree);
        });

        it("should clone a tree with HTML nodes", () => {
            const tree = u("root", [u("paragraph", [u("html", "<br/>"), u("text", "text")])]);

            const result = cloneTree(tree);

            expect(result).toEqual(tree);
            expect(result).not.toBe(tree);
        });

        it("should not mutate the original tree when modifying the clone", () => {
            const tree = u("root", [u("paragraph", [u("text", "hello")])]);

            const result = cloneTree(tree);
            (result.children?.[0] as any).children = [];

            expect(tree.children?.[0].children).toHaveLength(1);
            expect(result.children?.[0].children).toHaveLength(0);
        });

        it("should preserve node properties", () => {
            const tree = {
                type: "root",
                children: [
                    {
                        type: "paragraph",
                        children: [
                            {
                                type: "text",
                                value: "hello",
                                data: { custom: true },
                            },
                        ],
                    },
                ],
            } as any;

            const result = cloneTree(tree);

            expect(result).toEqual(tree);
            expect(result).not.toBe(tree);
            expect((result.children?.[0] as any).children[0].data).toEqual({ custom: true });
        });

        it("should deep clone node properties", () => {
            const tree = {
                type: "root",
                children: [
                    {
                        type: "paragraph",
                        children: [
                            {
                                type: "text",
                                value: "hello",
                                data: { elements: ["a", "b", "c"] },
                            },
                        ],
                    },
                ],
            } as any;

            const result = cloneTree(tree);
            // mutate the clone
            (result.children?.[0] as any).children[0].data?.elements.push("d");
            expect((result.children?.[0] as any).children[0].data?.elements).toEqual(["a", "b", "c", "d"]);

            // verify the original is not mutated
            expect(tree.children?.[0].children[0].data?.elements).toEqual(["a", "b", "c"]);
        });
    });
});
