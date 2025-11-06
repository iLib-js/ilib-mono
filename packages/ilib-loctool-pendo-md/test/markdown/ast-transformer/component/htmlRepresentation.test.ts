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

import u from "unist-builder";
import {
    componentNodesToHtmlNodes,
    htmlNodesToComponentNodes,
} from "../../../../src/markdown/ast-transformer/component/htmlRepresentation";

describe("ast-transformer-component/htmlRepresentation", () => {
    describe("componentNodesToHtmlNodes", () => {
        it("converts a component node", () => {
            const ast = u("root", [
                u("component", { componentIndex: 0, children: [u("text", "text1"), u("text", "text2")] }),
            ]);
            const actual = componentNodesToHtmlNodes(ast as any);
            // opening and closing tags with children spread between them as siblings
            const expected = u("root", [u("html", "<c0>"), u("text", "text1"), u("text", "text2"), u("html", "</c0>")]);
            expect(actual).toEqual(expected);
        });

        it("converts a component node with no children", () => {
            const ast = u("root", [u("component", { componentIndex: 0, children: [] })]);
            const actual = componentNodesToHtmlNodes(ast as any);
            // self-closing tag
            const expected = u("root", [u("html", "<c0/>")]);
            expect(actual).toEqual(expected);
        });

        it("ignores non-component nodes", () => {
            const ast = u("root", [u("text", "text")]);
            const actual = componentNodesToHtmlNodes(ast as any);
            const expected = u("root", [u("text", "text")]);
            expect(actual).toEqual(expected);
        });

        it("converts nested component nodes", () => {
            const ast = u("root", [
                u("component", {
                    componentIndex: 0,
                    children: [u("component", { componentIndex: 1, children: [u("text", "text")] })],
                }),
            ]);
            const actual = componentNodesToHtmlNodes(ast as any);
            const expected = u("root", [
                u("html", "<c0>"),
                u("html", "<c1>"),
                u("text", "text"),
                u("html", "</c1>"),
                u("html", "</c0>"),
            ]);
            expect(actual).toEqual(expected);
        });

        it("reflects the component index in the HTML node name", () => {
            const ast = u("root", [u("component", { componentIndex: 1, children: [u("text", "text")] })]);
            const actual = componentNodesToHtmlNodes(ast as any);
            const expected = u("root", [u("html", "<c1>"), u("text", "text"), u("html", "</c1>")]);
            expect(actual).toEqual(expected);
        });
    });

    describe("htmlNodesToComponentNodes", () => {
        it("backconverts a component node", () => {
            const ast = u("root", [u("html", "<c0>"), u("text", "text"), u("html", "</c0>")]);
            const actual = htmlNodesToComponentNodes(ast as any);
            const expected = u("root", [u("component", { componentIndex: 0, children: [u("text", "text")] })]);
            expect(actual).toEqual(expected);
        });

        it("backconverts a self-closing component node", () => {
            const ast = u("root", [u("html", "<c0/>")]);
            const actual = htmlNodesToComponentNodes(ast as any);
            const expected = u("root", [u("component", { componentIndex: 0, children: [] })]);
            expect(actual).toEqual(expected);
        });

        it("backconverts nested component nodes", () => {
            const ast = u("root", [
                u("html", "<c0>"),
                u("html", "<c1>"),
                u("text", "text"),
                u("html", "</c1>"),
                u("html", "</c0>"),
            ]);
            const actual = htmlNodesToComponentNodes(ast as any);
            const expected = u("root", [
                u("component", {
                    componentIndex: 0,
                    children: [u("component", { componentIndex: 1, children: [u("text", "text")] })],
                }),
            ]);
            expect(actual).toEqual(expected);
        });

        it("ignores non-HTML nodes", () => {
            const ast = u("root", [u("text", "text")]);
            const actual = htmlNodesToComponentNodes(ast as any);
            const expected = u("root", [u("text", "text")]);
            expect(actual).toEqual(expected);
        });

        it("ignores non-component HTML nodes", () => {
            const ast = u("root", [u("text", "text"), u("html", "<foo>"), u("text", "text")]);
            const actual = htmlNodesToComponentNodes(ast as any);
            const expected = u("root", [u("text", "text"), u("html", "<foo>"), u("text", "text")]);
            expect(actual).toEqual(expected);
        });

        it("backconverts a component node with correct component index", () => {
            const ast = u("root", [u("html", "<c99>"), u("text", "text"), u("html", "</c99>")]);
            const actual = htmlNodesToComponentNodes(ast as any);
            const expected = u("root", [u("component", { componentIndex: 99, children: [u("text", "text")] })]);
            expect(actual).toEqual(expected);
        });

        it("backconverts a self-closing component node with correct component index", () => {
            const ast = u("root", [u("html", "<c99/>")]);
            const actual = htmlNodesToComponentNodes(ast as any);
            const expected = u("root", [u("component", { componentIndex: 99, children: [] })]);
            expect(actual).toEqual(expected);
        });

        it("backconverts adjacent component nodes", () => {
            /**
             * ```markdown
             * <c0/><c1/>
             * ```
             * note: micromark correctly parses this as two separate HTML nodes
             * (rather than single HTML node with concatenated value `<c0/><c1/>`)
             */
            const ast = u("root", [u("html", "<c0/>"), u("html", "<c1/>")]);
            const actual = htmlNodesToComponentNodes(ast as any);
            const expected = u("root", [
                u("component", { componentIndex: 0, children: [] }),
                u("component", { componentIndex: 1, children: [] }),
            ]);
            expect(actual).toEqual(expected);
        });

        describe("error handling", () => {
            it("ignores a component node if the closing component tag is missing", () => {
                const ast = u("root", [u("html", "<c0>"), u("text", "text")]);
                const actual = htmlNodesToComponentNodes(ast as any);
                const expected = u("root", [u("html", "<c0>"), u("text", "text")]);
                expect(actual).toEqual(expected);
            });

            it("ignores a component node if the opening component tag is missing", () => {
                const ast = u("root", [u("text", "text"), u("html", "</c0>")]);
                const actual = htmlNodesToComponentNodes(ast as any);
                const expected = u("root", [u("text", "text"), u("html", "</c0>")]);
                expect(actual).toEqual(expected);
            });

            it("correctly handles next component if the one before it is missing a closing tag", () => {
                const ast = u("root", [
                    u("html", "<c0>"),
                    u("text", "text"),
                    u("html", "<c1>"),
                    u("text", "text"),
                    u("html", "</c1>"),
                ]);
                const actual = htmlNodesToComponentNodes(ast as any);
                const expected = u("root", [
                    u("html", "<c0>"),
                    u("text", "text"),
                    u("component", { componentIndex: 1, children: [u("text", "text")] }),
                ]);
                expect(actual).toEqual(expected);
            });

            it("ignores a component node if the closing component tag is not a matching closing tag", () => {
                const ast = u("root", [u("html", "<c0>"), u("text", "text"), u("html", "</c1>")]);
                const actual = htmlNodesToComponentNodes(ast as any);
                const expected = u("root", [u("html", "<c0>"), u("text", "text"), u("html", "</c1>")]);
                expect(actual).toEqual(expected);
            });

            it("recovers some interleaved components", () => {
                const ast = u("root", [
                    u("html", "<c0>"),
                    u("text", "text"),
                    u("html", "<c1>"),
                    u("text", "text"),
                    u("html", "</c0>"),
                    u("html", "</c1>"),
                ]);
                const actual = htmlNodesToComponentNodes(ast as any);
                const expected = u("root", [
                    u("component", {
                        componentIndex: 0,
                        children: [u("text", "text"), u("html", "<c1>"), u("text", "text")],
                    }),
                    u("html", "</c1>"),
                ]);
                expect(actual).toEqual(expected);
            });
        });
    });
});
