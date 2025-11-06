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

import u from "unist-builder";
import { toComponents } from "../../../../src/markdown/ast-transformer/component/escape";

describe("ast-transformer-component/escape", () => {
    describe("toComponents", () => {
        it.each(["strong", "emphasis", "underline", "delete", "listItem"])("escapes a wrapping node", (nodeType) => {
            const ast = u("root", [u(nodeType, [u("text", "text")])]);
            const actual = toComponents(ast as any);
            const expected = {
                tree: u("root", [u("component", { componentIndex: 0, children: [u("text", "text")] })]),
                components: [{ type: nodeType }],
            };
            expect(actual).toEqual(expected);
        });

        it("escapes a link node", () => {
            const ast = u("root", [u("link", { url: "http://example.com" }, [u("text", "text")])]);
            const actual = toComponents(ast as any);
            const expected = {
                tree: u("root", [u("component", { componentIndex: 0, children: [u("text", "text")] })]),
                components: [{ type: "link", url: "http://example.com" }],
            };
            expect(actual).toEqual(expected);
        });

        it("escapes a list node", () => {
            const ast = u("root", [u("list", { ordered: true }, [u("text", "text")])]);
            const actual = toComponents(ast as any);
            const expected = {
                tree: u("root", [u("component", { componentIndex: 0, children: [u("text", "text")] })]),
                components: [{ type: "list", ordered: true }],
            };
            expect(actual).toEqual(expected);
        });

        it("escapes a color node", () => {
            const ast = u("root", [u("color", { value: "#FF0000" }, [u("text", "text")])]);
            const actual = toComponents(ast as any);
            const expected = {
                tree: u("root", [u("component", { componentIndex: 0, children: [u("text", "text")] })]),
                components: [{ type: "color", value: "#FF0000" }],
            };
            expect(actual).toEqual(expected);
        });

        it("escapes a html node", () => {
            const ast = u("root", [u("html", { value: "<foo>" })]);
            const actual = toComponents(ast as any);
            const expected = {
                tree: u("root", [u("component", { componentIndex: 0, children: [] })]),
                components: [{ type: "html", value: "<foo>" }],
            };
            expect(actual).toEqual(expected);
        });

        it("ignores a node with no mapping", () => {
            const ast = u("root", [u("paragraph", [u("text", "text")])]);
            const actual = toComponents(ast as any);
            const expected = {
                tree: u("root", [u("paragraph", [u("text", "text")])]),
                components: [],
            };
            expect(actual).toEqual(expected);
        });

        it("escapes nested nodes", () => {
            const ast = u("root", [u("strong", [u("emphasis", [u("text", "text")])])]);
            const actual = toComponents(ast as any);
            const expected = {
                tree: u("root", [
                    u("component", {
                        componentIndex: 0,
                        children: [u("component", { componentIndex: 1, children: [u("text", "text")] })],
                    }),
                ]),
                components: [{ type: "strong" }, { type: "emphasis" }],
            };
            expect(actual).toEqual(expected);
        });

        it("escapes multiple levels of nesting", () => {
            const ast = u("root", [
                u("strong", [u("emphasis", [u("text", "text1")])]),
                u("underline", [u("text", "text2")]),
            ]);
            const actual = toComponents(ast as any);
            const expected = {
                tree: u("root", [
                    u("component", {
                        componentIndex: 0,
                        children: [u("component", { componentIndex: 1, children: [u("text", "text1")] })],
                    }),
                    u("component", { componentIndex: 2, children: [u("text", "text2")] }),
                ]),
                components: [{ type: "strong" }, { type: "emphasis" }, { type: "underline" }],
            };
            expect(actual).toEqual(expected);
        });
    });
});
