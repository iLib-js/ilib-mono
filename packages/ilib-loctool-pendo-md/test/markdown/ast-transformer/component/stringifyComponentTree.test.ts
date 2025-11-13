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
    stringifyComponentTree,
    parseComponentString,
} from "../../../../src/markdown/ast-transformer/component/stringifyComponentTree";
import { ROOT_COMPONENT_INDEX } from "../../../../src/markdown/ast-transformer/component/ComponentAst";
import type { ComponentAst } from "../../../../src/markdown/ast-transformer/component/ComponentAst";

describe("stringifyComponentTree", () => {
    describe("stringifyComponentTree", () => {
        it("should stringify a text node", () => {
            const node: ComponentAst.Text = {
                type: "text",
                value: "hello world",
            };

            const result = stringifyComponentTree(node);

            expect(result).toBe("hello world");
        });

        it("should stringify a simple component tree", () => {
            const node: ComponentAst.Component = {
                type: "component",
                componentIndex: ROOT_COMPONENT_INDEX,
                children: [
                    {
                        type: "component",
                        componentIndex: 0,
                        children: [{ type: "text", value: "pizza" }],
                    },
                    { type: "text", value: " spaghetti" },
                ],
            };

            const result = stringifyComponentTree(node);

            expect(result).toBe("<c0>pizza</c0> spaghetti");
        });

        it("should stringify a self-closing component", () => {
            const node: ComponentAst.Component = {
                type: "component",
                componentIndex: 0,
            };

            const result = stringifyComponentTree(node);

            expect(result).toBe("<c0/>");
        });

        it("should not stringify the root component", () => {
            const node: ComponentAst.Component = {
                type: "component",
                componentIndex: ROOT_COMPONENT_INDEX,
                children: [
                    { type: "text", value: "text" },
                    {
                        type: "component",
                        componentIndex: 0,
                        children: [{ type: "text", value: "pizza" }],
                    },
                ],
            };

            const result = stringifyComponentTree(node);

            expect(result).toBe("text<c0>pizza</c0>");
        });

        it("should stringify nested components", () => {
            const node: ComponentAst.Component = {
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
                                children: [{ type: "text", value: "nested" }],
                            },
                        ],
                    },
                ],
            };

            const result = stringifyComponentTree(node);

            expect(result).toBe("<c0><c1>nested</c1></c0>");
        });

        it("should stringify multiple components", () => {
            const node: ComponentAst.Component = {
                type: "component",
                componentIndex: ROOT_COMPONENT_INDEX,
                children: [
                    {
                        type: "component",
                        componentIndex: 0,
                        children: [{ type: "text", value: "first" }],
                    },
                    { type: "text", value: " " },
                    {
                        type: "component",
                        componentIndex: 1,
                        children: [{ type: "text", value: "second" }],
                    },
                ],
            };

            const result = stringifyComponentTree(node);

            expect(result).toBe("<c0>first</c0> <c1>second</c1>");
        });

        it("should throw an error if component index is undefined", () => {
            const node: ComponentAst.Component = {
                type: "component",
            };

            expect(() => stringifyComponentTree(node)).toThrow("Component index is undefined");
        });

        it("should throw an error for unexpected node type", () => {
            const node = {
                type: "unexpected",
            } as any;

            expect(() => stringifyComponentTree(node)).toThrow("Unexpected node type: unexpected");
        });
    });

    describe("parseComponentString", () => {
        it("should parse a simple component string", () => {
            const string = "<c0>pizza</c0> spaghetti";

            const result = parseComponentString(string);

            expect(result.type).toBe("component");
            expect(result.componentIndex).toBe(ROOT_COMPONENT_INDEX);
            expect(result.children).toHaveLength(2);
            expect(result.children?.[0].type).toBe("component");
            expect((result.children?.[0] as ComponentAst.Component).componentIndex).toBe(0);
            expect(result.children?.[1]).toEqual({ type: "text", value: " spaghetti" });
        });

        it("should parse a self-closing component", () => {
            const string = "<c0/>";

            const result = parseComponentString(string);

            expect(result.type).toBe("component");
            expect(result.componentIndex).toBe(ROOT_COMPONENT_INDEX);
            expect(result.children).toHaveLength(1);
            expect(result.children?.[0].type).toBe("component");
            expect((result.children?.[0] as ComponentAst.Component).componentIndex).toBe(0);
            expect((result.children?.[0] as ComponentAst.Component).children).toBeUndefined();
        });

        it("should parse nested components", () => {
            const string = "<c0><c1>nested</c1></c0>";

            const result = parseComponentString(string);

            expect(result.type).toBe("component");
            expect(result.componentIndex).toBe(ROOT_COMPONENT_INDEX);
            const firstChild = result.children?.[0] as ComponentAst.Component;
            expect(firstChild.componentIndex).toBe(0);
            const nestedChild = firstChild.children?.[0] as ComponentAst.Component;
            expect(nestedChild.componentIndex).toBe(1);
            expect(nestedChild.children?.[0]).toEqual({ type: "text", value: "nested" });
        });

        it("should parse multiple components", () => {
            const string = "<c0>first</c0> <c1>second</c1>";

            const result = parseComponentString(string);

            expect(result.children).toHaveLength(3);
            expect((result.children?.[0] as ComponentAst.Component).componentIndex).toBe(0);
            expect(result.children?.[1]).toEqual({ type: "text", value: " " });
            expect((result.children?.[2] as ComponentAst.Component).componentIndex).toBe(1);
        });

        it("should parse text-only string", () => {
            const string = "just text";

            const result = parseComponentString(string);

            expect(result.type).toBe("component");
            expect(result.componentIndex).toBe(ROOT_COMPONENT_INDEX);
            expect(result.children).toHaveLength(1);
            expect(result.children?.[0]).toEqual({ type: "text", value: "just text" });
        });

        it("should parse empty string", () => {
            const string = "";

            const result = parseComponentString(string);

            expect(result.type).toBe("component");
            expect(result.componentIndex).toBe(ROOT_COMPONENT_INDEX);
            expect(result.children).toEqual([]);
        });

        it("should parse text before and after components", () => {
            const string = "before <c0>middle</c0> after";

            const result = parseComponentString(string);

            expect(result.children).toHaveLength(3);
            expect(result.children?.[0]).toEqual({ type: "text", value: "before " });
            expect((result.children?.[1] as ComponentAst.Component).componentIndex).toBe(0);
            expect(result.children?.[2]).toEqual({ type: "text", value: " after" });
        });

        it("should throw an error for mismatched closing tags", () => {
            const string = "<c0>text</c1>";

            expect(() => parseComponentString(string)).toThrow("Closing component tag mismatch");
        });

        it("should throw an error for unbalanced tags", () => {
            const string = "<c0>text";

            expect(() => parseComponentString(string)).toThrow("Unbalanced component tags");
        });

        it("should parse components with large indices", () => {
            const string = "<c10>text</c10>";

            const result = parseComponentString(string);

            expect((result.children?.[0] as ComponentAst.Component).componentIndex).toBe(10);
        });

        it("should handle adjacent components", () => {
            const string = "<c0/> <c1>text</c1>";

            const result = parseComponentString(string);

            expect(result.children).toHaveLength(3);
            expect((result.children?.[0] as ComponentAst.Component).componentIndex).toBe(0);
            expect(result.children?.[1]).toEqual({ type: "text", value: " " });
            expect((result.children?.[2] as ComponentAst.Component).componentIndex).toBe(1);
        });
    });

    describe("round-trip stringification", () => {
        it("should stringify and parse a simple tree correctly", () => {
            const node: ComponentAst.Component = {
                type: "component",
                componentIndex: ROOT_COMPONENT_INDEX,
                children: [
                    {
                        type: "component",
                        componentIndex: 0,
                        children: [{ type: "text", value: "pizza" }],
                    },
                    { type: "text", value: " spaghetti" },
                ],
            };

            const stringified = stringifyComponentTree(node);
            const parsed = parseComponentString(stringified);

            expect(parsed).toEqual(node);
        });

        it("should stringify and parse nested components correctly", () => {
            const node: ComponentAst.Component = {
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
                                children: [{ type: "text", value: "nested" }],
                            },
                        ],
                    },
                ],
            };

            const stringified = stringifyComponentTree(node);
            const parsed = parseComponentString(stringified);

            expect(parsed).toEqual(node);
        });

        it("should stringify and parse self-closing components correctly", () => {
            const node: ComponentAst.Component = {
                type: "component",
                componentIndex: ROOT_COMPONENT_INDEX,
                children: [
                    {
                        type: "component",
                        componentIndex: 0,
                    },
                ],
            };

            const stringified = stringifyComponentTree(node);
            const parsed = parseComponentString(stringified);

            expect(parsed).toEqual(node);
        });
    });
});

