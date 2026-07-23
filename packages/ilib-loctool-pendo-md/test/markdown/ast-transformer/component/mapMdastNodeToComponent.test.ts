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

import { mapMdastNode, unmapMdastNode } from "../../../../src/markdown/ast-transformer/component/mapMdastNodeToComponent";
import type { ComponentAst } from "../../../../src/markdown/ast-transformer/component/ComponentAst";
import u from "unist-builder";

describe("mapMdastNodeToComponent", () => {
    describe("mapMdastNode", () => {
        it("should map a text node to a Component AST text node", () => {
            const mdastNode = u("text", "hello world");

            const result = mapMdastNode(mdastNode);

            expect(result).toEqual({ type: "text", value: "hello world" });
        });

        it("should map a paragraph node to a component node", () => {
            const mdastNode = u("paragraph", []);

            const result = mapMdastNode(mdastNode);

            expect(result).toEqual({
                type: "component",
                originalNodes: [mdastNode],
                children: [],
            });
        });

        it("should map an HTML node to a component node", () => {
            const mdastNode = u("html", "<br/>");

            const result = mapMdastNode(mdastNode);

            expect(result).toEqual({
                type: "component",
                originalNodes: [mdastNode],
            });
        });

        it("should map a node with children to a component node with empty children array", () => {
            const mdastNode = u("paragraph", [u("text", "hello")]);

            const result = mapMdastNode(mdastNode);

            expect(result).toEqual({
                type: "component",
                originalNodes: [mdastNode],
                children: [],
            });
        });

        it("should map a root node to a component node", () => {
            const mdastNode = u("root", []);

            const result = mapMdastNode(mdastNode);

            expect(result).toEqual({
                type: "component",
                originalNodes: [mdastNode],
                children: [],
            });
        });

        it("should map an emphasis node to a component node", () => {
            const mdastNode = u("emphasis", []);

            const result = mapMdastNode(mdastNode);

            expect(result).toEqual({
                type: "component",
                originalNodes: [mdastNode],
                children: [],
            });
        });

        it("should map a delete node to a component node", () => {
            const mdastNode = u("delete", []);

            const result = mapMdastNode(mdastNode);

            expect(result).toEqual({
                type: "component",
                originalNodes: [mdastNode],
                children: [],
            });
        });
    });

    describe("unmapMdastNode", () => {
        it("should unmap a Component AST text node to an Mdast text node", () => {
            const componentNode: ComponentAst.Text = { type: "text", value: "hello world" };

            const result = unmapMdastNode(componentNode);

            expect(result).toEqual({ type: "text", value: "hello world" });
        });

        it("should unmap a component node to an Mdast node", () => {
            const mdastNode = u("paragraph", []);
            const componentNode: ComponentAst.Component = {
                type: "component",
                originalNodes: [mdastNode],
            };

            const result = unmapMdastNode(componentNode);

            expect(result).toEqual(mdastNode);
        });

        it("should unmap a component node with HTML to an Mdast HTML node", () => {
            const mdastNode = u("html", "<br/>");
            const componentNode: ComponentAst.Component = {
                type: "component",
                originalNodes: [mdastNode],
            };

            const result = unmapMdastNode(componentNode);

            expect(result).toEqual(mdastNode);
        });

        it("should throw an error if originalNodes is missing", () => {
            const componentNode: ComponentAst.Component = {
                type: "component",
            };

            expect(() => unmapMdastNode(componentNode)).toThrow("Invalid tree state: missing original nodes array");
        });

        it("should throw an error if originalNodes has multiple nodes", () => {
            const componentNode: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("paragraph", []), u("list", [])],
            };

            expect(() => unmapMdastNode(componentNode)).toThrow("Invalid tree state: multiple original nodes");
        });

        it("should throw an error for unexpected node type", () => {
            const componentNode = {
                type: "unexpected",
            } as any;

            expect(() => unmapMdastNode(componentNode)).toThrow("Unexpected node type: unexpected");
        });
    });

    describe("round-trip mapping", () => {
        it("should map and unmap a text node correctly", () => {
            const mdastNode = u("text", "hello world");

            const mapped = mapMdastNode(mdastNode);
            const unmapped = unmapMdastNode(mapped);

            expect(unmapped).toEqual(mdastNode);
        });

        it("should map and unmap a paragraph node correctly", () => {
            const mdastNode = u("paragraph", []);

            const mapped = mapMdastNode(mdastNode);
            const unmapped = unmapMdastNode(mapped);

            expect(unmapped).toEqual(mdastNode);
        });

        it("should map and unmap an HTML node correctly", () => {
            const mdastNode = u("html", "<br/>");

            const mapped = mapMdastNode(mdastNode);
            const unmapped = unmapMdastNode(mapped);

            expect(unmapped).toEqual(mdastNode);
        });
    });
});

