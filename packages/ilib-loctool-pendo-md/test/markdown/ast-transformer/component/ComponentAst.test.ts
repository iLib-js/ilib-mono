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

import { isComponentNode, ROOT_COMPONENT_INDEX } from "../../../../src/markdown/ast-transformer/component/ComponentAst";
import type { ComponentAst } from "../../../../src/markdown/ast-transformer/component/ComponentAst";
import u from "unist-builder";

describe("ComponentAst", () => {
    describe("ROOT_COMPONENT_INDEX", () => {
        it("should be -1", () => {
            expect(ROOT_COMPONENT_INDEX).toBe(-1);
        });
    });

    describe("isComponentNode", () => {
        it("should return true for a valid component node", () => {
            const node: ComponentAst.Component = {
                type: "component",
            };
            expect(isComponentNode(node)).toBe(true);
        });

        it("should return true for a component node with children", () => {
            const node: ComponentAst.Component = {
                type: "component",
                children: [{ type: "text", value: "test" }],
            };
            expect(isComponentNode(node)).toBe(true);
        });

        it("should return true for a component node with componentIndex", () => {
            const node: ComponentAst.Component = {
                type: "component",
                componentIndex: 0,
            };
            expect(isComponentNode(node)).toBe(true);
        });

        it("should return true for a component node with originalNodes", () => {
            const node: ComponentAst.Component = {
                type: "component",
                originalNodes: [u("paragraph", [])],
            };
            expect(isComponentNode(node)).toBe(true);
        });

        it("should return true for a component node with all properties", () => {
            const node: ComponentAst.Component = {
                type: "component",
                componentIndex: 0,
                originalNodes: [u("paragraph", [])],
                children: [{ type: "text", value: "test" }],
            };
            expect(isComponentNode(node)).toBe(true);
        });

        it("should return false for a text node", () => {
            const node: ComponentAst.Text = {
                type: "text",
                value: "test",
            };
            expect(isComponentNode(node)).toBe(false);
        });

        it.each([
            ["null", null],
            ["undefined", undefined],
            ["a string", "string"],
            ["a number", 123],
            ["an object without type", { value: "test" }],
            ["an object with wrong type", { type: "text", value: "test" }],
            ["a component node with invalid componentIndex", { type: "component", componentIndex: "0" }],
            ["a component node with invalid children", { type: "component", children: "invalid" }],
            ["a component node with invalid originalNodes", { type: "component", originalNodes: "invalid" }],
        ])("should return false for %s", (_desc, input) => {
            expect(isComponentNode(input)).toBe(false);
        });
    });
});
