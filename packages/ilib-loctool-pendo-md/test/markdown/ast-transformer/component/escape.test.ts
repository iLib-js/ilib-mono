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
import { fromComponents, toComponents } from "../escape";

import type { Node } from "unist";

// Mock AST nodes

interface Unit extends Node {
    type: "unit";
    value: string;
}

interface Wrapping extends Node {
    type: "wrapping";
    children: Node[];
}

interface WrappingWithAttribute extends Node {
    type: "wrapping-attr";
    value: string;
    children: Node[];
}

// Mappings between mock AST nodes and escaped component data

const mapNodeToComponentData = (node: Node) => {
    switch (node.type) {
        case "wrapping":
            return { type: "wrapping" as const };
        case "wrapping-attr":
            return { type: "wrapping-attr" as const, value: (node as WrappingWithAttribute).value };
        case "unit":
            return { type: "unit" as const, value: (node as Unit).value };
        default:
            return null;
    }
};

const mapComponentDataToNode = (component: NonNullable<ReturnType<typeof mapNodeToComponentData>>) => {
    switch (component.type) {
        case "wrapping":
            return u("wrapping", []) as Wrapping;
        case "wrapping-attr":
            return u("wrapping-attr", { value: component.value }, []) as WrappingWithAttribute;
        case "unit":
            return u("unit", { value: component.value }) as Unit;
        default:
            // @ts-expect-error this should be exhaustive mapping
            throw new Error(`Unknown test component type: ${component.type}`);
    }
};

describe("ast-transformer-component/escape", () => {
    describe("toComponents", () => {
        describe("wrapping node", () => {
            it("escapes wrapping node with a component with children", () => {
                /**
                 * ```markdown
                 * *text*
                 * ```
                 */
                const ast = u("root", [u("wrapping", [u("text", "text")])]);
                const [actualAst, actualComponents] = toComponents(ast, mapNodeToComponentData);
                /**
                 * ```markdown
                 * <c0>text</c0>
                 * ```
                 */
                const expectedAst = u("root", [u("html", "<c0>"), u("text", "text"), u("html", "</c0>")]);
                const expectedComponents = [{ type: "wrapping" }];
                expect(actualAst).toEqual(expectedAst);
                expect(actualComponents).toEqual(expectedComponents);
            });

            it("escapes multiple wrapping nodes", () => {
                /**
                 * ```markdown
                 * *text* _text_
                 * ```
                 */
                const ast = u("root", [
                    u("wrapping", [u("text", "text")]),
                    u("text", " "),
                    u("wrapping", [u("text", "text")]),
                ]);
                const [actualAst, actualComponents] = toComponents(ast, mapNodeToComponentData);
                /**
                 * ```markdown
                 * <c0>text</c0> <c1>text</c1>
                 * ```
                 */
                const expectedAst = u("root", [
                    u("html", "<c0>"),
                    u("text", "text"),
                    u("html", "</c0>"),
                    u("text", " "),
                    u("html", "<c1>"),
                    u("text", "text"),
                    u("html", "</c1>"),
                ]);
                const expectedComponents = [{ type: "wrapping" }, { type: "wrapping" }];
                expect(actualAst).toEqual(expectedAst);
                expect(actualComponents).toEqual(expectedComponents);
            });
        });

        describe("wrapping node with attributes", () => {
            it("escapes wrapping node preserving attributes in component data", () => {
                /**
                 * ```markdown
                 * [link title](example.com)
                 * ```
                 */
                const ast = u("root", [u("wrapping-attr", { value: "example.com" }, [u("text", "link title")])]);
                const [actualAst, actualComponents] = toComponents(ast, mapNodeToComponentData);
                /**
                 * ```markdown
                 * <c0>link title</c0>
                 * ```
                 */
                const expectedAst = u("root", [u("html", "<c0>"), u("text", "link title"), u("html", "</c0>")]);
                const expectedComponents = [{ type: "wrapping-attr", value: "example.com" }];
                expect(actualAst).toEqual(expectedAst);
                expect(actualComponents).toEqual(expectedComponents);
            });

            it("escapes multiple wrapping nodes preserving attributes in component data", () => {
                /**
                 * ```markdown
                 * {color: #000000}black{/color} {color: #FFFFFF}white{/color}
                 * ```
                 */
                const ast = u("root", [
                    u("wrapping-attr", { value: "#000000" }, [u("text", "black")]),
                    u("text", " "),
                    u("wrapping-attr", { value: "#FFFFFF" }, [u("text", "white")]),
                ]);
                const [actualAst, actualComponents] = toComponents(ast, mapNodeToComponentData);
                /**
                 * ```markdown
                 * <c0>black</c0> <c1>white</c1>
                 * ```
                 */
                const expectedAst = u("root", [
                    u("html", "<c0>"),
                    u("text", "black"),
                    u("html", "</c0>"),
                    u("text", " "),
                    u("html", "<c1>"),
                    u("text", "white"),
                    u("html", "</c1>"),
                ]);
                const expectedComponents = [
                    { type: "wrapping-attr", value: "#000000" },
                    { type: "wrapping-attr", value: "#FFFFFF" },
                ];
                expect(actualAst).toEqual(expectedAst);
                expect(actualComponents).toEqual(expectedComponents);
            });
        });

        describe("unit node", () => {
            it("escapes unit node with a self-closing component", () => {
                /**
                 * ```markdown
                 * `code`
                 * ```
                 */
                const ast = u("root", [u("unit", { value: "code" })]);
                const [actualAst, actualComponents] = toComponents(ast, mapNodeToComponentData);
                /**
                 * ```markdown
                 * <c0/>
                 * ```
                 */
                const expectedAst = u("root", [u("html", "<c0/>")]);
                const expectedComponents = [{ type: "unit", value: "code" }];
                expect(actualAst).toEqual(expectedAst);
                expect(actualComponents).toEqual(expectedComponents);
            });

            it("escapes multiple unit nodes", () => {
                /**
                 * ```markdown
                 * `code` <html>
                 */
                const ast = u("root", [u("unit", { value: "code" }), u("text", " "), u("unit", { value: "<html>" })]);
                const [actualAst, actualComponents] = toComponents(ast, mapNodeToComponentData);
                /**
                 * ```markdown
                 * <c0/> <c1/>
                 */
                const expectedAst = u("root", [u("html", "<c0/>"), u("text", " "), u("html", "<c1/>")]);
                const expectedComponents = [
                    { type: "unit", value: "code" },
                    { type: "unit", value: "<html>" },
                ];
                expect(actualAst).toEqual(expectedAst);
                expect(actualComponents).toEqual(expectedComponents);
            });
        });

        describe("nested nodes", () => {
            it("escapes nested wrapping nodes", () => {
                /**
                 * ```markdown
                 * **bold _italic_**
                 * ```
                 */
                const ast = u("root", [u("wrapping", [u("text", "bold "), u("wrapping", [u("text", "italic")])])]);
                const [actualAst, actualComponents] = toComponents(ast, mapNodeToComponentData);
                /**
                 * ```markdown
                 * <c0>bold <c1>italic</c1></c0>
                 * ```
                 */
                const expectedAst = u("root", [
                    u("html", "<c0>"),
                    u("text", "bold "),
                    u("html", "<c1>"),
                    u("text", "italic"),
                    u("html", "</c1>"),
                    u("html", "</c0>"),
                ]);
                const expectedComponents = [{ type: "wrapping" }, { type: "wrapping" }];
                expect(actualAst).toEqual(expectedAst);
                expect(actualComponents).toEqual(expectedComponents);
            });

            it("escapes multiple levels of nesting", () => {
                /**
                 * ```markdown
                 * - list item **bold _italic_**
                 * ```
                 */
                const ast = u("root", [
                    u("wrapping", [
                        u("wrapping", [
                            u("text", "list item "),
                            u("wrapping", [u("text", "bold "), u("wrapping", [u("text", "italic")])]),
                        ]),
                    ]),
                ]);
                const [actualAst, actualComponents] = toComponents(ast, mapNodeToComponentData);
                /**
                 * ```markdown
                 * <c0><c1>list item <c2>bold <c3>italic</c3></c2></c1></c0>
                 * ```
                 */
                const expectedAst = u("root", [
                    u("html", "<c0>"),
                    u("html", "<c1>"),
                    u("text", "list item "),
                    u("html", "<c2>"),
                    u("text", "bold "),
                    u("html", "<c3>"),
                    u("text", "italic"),
                    u("html", "</c3>"),
                    u("html", "</c2>"),
                    u("html", "</c1>"),
                    u("html", "</c0>"),
                ]);
                const expectedComponents = [
                    { type: "wrapping" }, // list
                    { type: "wrapping" }, // list item
                    { type: "wrapping" }, // bold
                    { type: "wrapping" }, // italic
                ];
                expect(actualAst).toEqual(expectedAst);
                expect(actualComponents).toEqual(expectedComponents);
            });
        });

        describe("non-mapped nodes", () => {
            it("does not modify non-mapped wrapping node", () => {
                /**
                 * ```markdown
                 * > text
                 * ```
                 */
                const ast = u("root", [u("non-mapped-wrapping", [u("text", "text")])]);

                const [actualAst, actualComponents] = toComponents(ast, mapNodeToComponentData);

                expect(actualAst).toEqual(ast);
                expect(actualComponents).toEqual([]);
            });

            it("does not modify non-mapped wrapping node with attributes", () => {
                /**
                 * ```markdown
                 * # text
                 * ```
                 */
                const ast = u("root", [u("non-mapped-wrapping-attr", { value: "1" }, [u("text", "text")])]);

                const [actualAst, actualComponents] = toComponents(ast, mapNodeToComponentData);

                expect(actualAst).toEqual(ast);
                expect(actualComponents).toEqual([]);
            });

            it("does not modify non-mapped unit node", () => {
                /**
                 * ````markdown
                 * ```
                 * codeblock
                 * ```
                 * ````
                 */
                const ast = u("root", [u("non-mapped-unit", { value: "codeblock" })]);

                const [actualAst, actualComponents] = toComponents(ast, mapNodeToComponentData);

                expect(actualAst).toEqual(ast);
                expect(actualComponents).toEqual([]);
            });
        });
    });

    describe("fromComponents", () => {
        describe("wrapping node", () => {
            it("backconverts wrapping node from a component with children", () => {
                /**
                 * ```markdown
                 * <c0>text</c0>
                 * ```
                 */
                const ast = u("root", [u("html", "<c0>"), u("text", "text"), u("html", "</c0>")]);
                const actualAst = fromComponents(ast, [{ type: "wrapping" }], mapComponentDataToNode);
                /**
                 * ```markdown
                 * *text*
                 * ```
                 */
                const expectedAst = u("root", [u("wrapping", [u("text", "text")])]);
                expect(actualAst).toEqual(expectedAst);
            });

            it("backconverts multiple wrapping nodes", () => {
                /**
                 * ```markdown
                 * <c0>text</c0> <c1>text</c1>
                 * ```
                 */
                const ast = u("root", [
                    u("html", "<c0>"),
                    u("text", "text"),
                    u("html", "</c0>"),
                    u("text", " "),
                    u("html", "<c1>"),
                    u("text", "text"),
                    u("html", "</c1>"),
                ]);
                const actualAst = fromComponents(
                    ast,
                    [{ type: "wrapping" }, { type: "wrapping" }],
                    mapComponentDataToNode,
                );
                /**
                 * ```markdown
                 * *text* _text_
                 * ```
                 */
                const expectedAst = u("root", [
                    u("wrapping", [u("text", "text")]),
                    u("text", " "),
                    u("wrapping", [u("text", "text")]),
                ]);
                expect(actualAst).toEqual(expectedAst);
            });

            it("backconverts adjacent wrapping nodes", () => {
                /**
                 * ```markdown
                 * <c0>text</c0><c1>text</c1>
                 * ```
                 * note: micromark correctly adjacent tags as separate HTML nodes
                 * (rather than inserting a single HTML node with concatenated value `</c0><c1>`)
                 */
                const ast = u("root", [
                    u("html", "<c0>"),
                    u("text", "text"),
                    u("html", "</c0>"),
                    u("html", "<c1>"),
                    u("text", "text"),
                    u("html", "</c1>"),
                ]);
                const actualAst = fromComponents(
                    ast,
                    [{ type: "wrapping" }, { type: "wrapping" }],
                    mapComponentDataToNode,
                );
                /**
                 * ```markdown
                 * *text*_text_
                 * ```
                 */
                const expectedAst = u("root", [u("wrapping", [u("text", "text")]), u("wrapping", [u("text", "text")])]);
                expect(actualAst).toEqual(expectedAst);
            });
        });

        describe("wrapping node with attributes", () => {
            it("backconverts wrapping node restoring attributes from component data", () => {
                /**
                 * ```markdown
                 * <c0>link title</c0>
                 * ```
                 */
                const ast = u("root", [u("html", "<c0>"), u("text", "link title"), u("html", "</c0>")]);
                const actualAst = fromComponents(
                    ast,
                    [{ type: "wrapping-attr", value: "example.com" }],
                    mapComponentDataToNode,
                );
                /**
                 * ```markdown
                 * [link title](example.com)
                 * ```
                 */
                const expectedAst = u("root", [
                    u("wrapping-attr", { value: "example.com" }, [u("text", "link title")]),
                ]);
                expect(actualAst).toEqual(expectedAst);
            });

            it("backconverts multiple wrapping nodes restoring attributes from component data", () => {
                /**
                 * ```markdown
                 * <c0>black</c0> <c1>white</c1>
                 * ```
                 */
                const ast = u("root", [
                    u("html", "<c0>"),
                    u("text", "black"),
                    u("html", "</c0>"),
                    u("text", " "),
                    u("html", "<c1>"),
                    u("text", "white"),
                    u("html", "</c1>"),
                ]);
                const actualAst = fromComponents(
                    ast,
                    [
                        { type: "wrapping-attr", value: "#000000" },
                        { type: "wrapping-attr", value: "#FFFFFF" },
                    ],
                    mapComponentDataToNode,
                );
                /**
                 * ```markdown
                 * {color: #000000}black{/color} {color: #FFFFFF}white{/color}
                 * ```
                 */
                const expectedAst = u("root", [
                    u("wrapping-attr", { value: "#000000" }, [u("text", "black")]),
                    u("text", " "),
                    u("wrapping-attr", { value: "#FFFFFF" }, [u("text", "white")]),
                ]);
                expect(actualAst).toEqual(expectedAst);
            });
        });

        describe("unit node", () => {
            it("backconverts unit node from a self-closing component", () => {
                /**
                 * ```markdown
                 * <c0/>
                 * ```
                 */
                const ast = u("root", [u("html", "<c0/>")]);
                const actualAst = fromComponents(ast, [{ type: "unit", value: "code" }], mapComponentDataToNode);
                /**
                 * ```markdown
                 * `code`
                 * ```
                 */
                const expectedAst = u("root", [u("unit", { value: "code" })]);
                expect(actualAst).toEqual(expectedAst);
            });

            it("backconverts multiple unit nodes", () => {
                /**
                 * ```markdown
                 * <c0/> <c1/>
                 * ```
                 */
                const ast = u("root", [u("html", "<c0/>"), u("text", " "), u("html", "<c1/>")]);
                const actualAst = fromComponents(
                    ast,
                    [
                        { type: "unit", value: "code" },
                        { type: "unit", value: "<html>" },
                    ],
                    mapComponentDataToNode,
                );
                /**
                 * ```markdown
                 * `code` <html>
                 * ```
                 */
                const expectedAst = u("root", [
                    u("unit", { value: "code" }),
                    u("text", " "),
                    u("unit", { value: "<html>" }),
                ]);
                expect(actualAst).toEqual(expectedAst);
            });

            it("backconverts adjacent unit nodes", () => {
                /**
                 * ```markdown
                 * <c0/><c1/>
                 * ```
                 * note: micromark correctly parses this as two separate HTML nodes
                 * (rather than single HTML node with concatenated value `<c0/><c1/>`)
                 */
                const ast = u("root", [u("html", "<c0/>"), u("html", "<c1/>")]);
                const actualAst = fromComponents(
                    ast,
                    [
                        { type: "unit", value: "code" },
                        { type: "unit", value: "<html>" },
                    ],
                    mapComponentDataToNode,
                );
                /**
                 * ```markdown
                 * `code`<html>
                 * ```
                 */
                const expectedAst = u("root", [u("unit", { value: "code" }), u("unit", { value: "<html>" })]);
                expect(actualAst).toEqual(expectedAst);
            });
        });

        describe("nested nodes", () => {
            it("backconverts nested wrapping nodes", () => {
                /**
                 * ```markdown
                 * <c0>bold <c1>italic</c1></c0>
                 * ```
                 */
                const ast = u("root", [
                    u("html", "<c0>"),
                    u("text", "bold "),
                    u("html", "<c1>"),
                    u("text", "italic"),
                    u("html", "</c1>"),
                    u("html", "</c0>"),
                ]);
                const actualAst = fromComponents(
                    ast,
                    [{ type: "wrapping" }, { type: "wrapping" }],
                    mapComponentDataToNode,
                );
                /**
                 * ```markdown
                 * **bold _italic_**
                 * ```
                 */
                const expectedAst = u("root", [
                    u("wrapping", [u("text", "bold "), u("wrapping", [u("text", "italic")])]),
                ]);
                expect(actualAst).toEqual(expectedAst);
            });

            it("backconverts multiple levels of nesting", () => {
                /**
                 * ```markdown
                 * <c0><c1>list item <c2>bold <c3>italic</c3></c2></c1></c0>
                 * ```
                 */
                const ast = u("root", [
                    u("html", "<c0>"),
                    u("html", "<c1>"),
                    u("text", "list item "),
                    u("html", "<c2>"),
                    u("text", "bold "),
                    u("html", "<c3>"),
                    u("text", "italic"),
                    u("html", "</c3>"),
                    u("html", "</c2>"),
                    u("html", "</c1>"),
                    u("html", "</c0>"),
                ]);
                const actualAst = fromComponents(
                    ast,
                    [
                        { type: "wrapping" }, // list
                        { type: "wrapping" }, // list item
                        { type: "wrapping" }, // bold
                        { type: "wrapping" }, // italic
                    ],
                    mapComponentDataToNode,
                );
                /**
                 * ```markdown
                 * - list item **bold _italic_**
                 * ```
                 */
                const expectedAst = u("root", [
                    u("wrapping", [
                        u("wrapping", [
                            u("text", "list item "),
                            u("wrapping", [u("text", "bold "), u("wrapping", [u("text", "italic")])]),
                        ]),
                    ]),
                ]);
                expect(actualAst).toEqual(expectedAst);
            });
        });

        describe("shuffled components", () => {
            it("backconverts from strings with shuffled components", () => {
                /**
                 * Original string was
                 * ```markdown
                 * {color: #000000}black{/color} {color: #FFFFFF}white{/color}
                 * ```
                 * and string before translation was
                 * ```markdown
                 * <c0>black</c0> <c1>white</c1>
                 * ```
                 */
                const components = [
                    { type: "wrapping-attr" as const, value: "#000000" }, // {color: #000000}
                    { type: "wrapping-attr" as const, value: "#FFFFFF" }, // {color: #FFFFFF}
                ];

                /** String after translation is shuffled
                 * ```markdown
                 * <c1>white</c1> <c0>black</c0>
                 * ```
                 */
                const ast = u("root", [
                    u("html", "<c1>"),
                    u("text", "white"),
                    u("html", "</c1>"),
                    u("text", " "),
                    u("html", "<c0>"),
                    u("text", "black"),
                    u("html", "</c0>"),
                ]);

                const actualAst = fromComponents(ast, components, mapComponentDataToNode);

                /**
                 * Backconverted should be
                 * ```markdown
                 * {color: #FFFFFF}white{/color} {color: #000000}black{/color}
                 */
                const expectedAst = u("root", [
                    u("wrapping-attr", { value: "#FFFFFF" }, [u("text", "white")]),
                    u("text", " "),
                    u("wrapping-attr", { value: "#000000" }, [u("text", "black")]),
                ]);
                expect(actualAst).toEqual(expectedAst);
            });
        });

        describe("malformed components", () => {
            it("ignores components for which there is no component data", () => {
                /**
                 * Original string was
                 * ```markdown
                 * {color: #000000}black{/color} {color: #FFFFFF}white{/color}
                 * ```
                 * and string before translation was
                 * ```markdown
                 * <c0>black</c0> <c1>white</c1>
                 * ```
                 */
                const components = [
                    { type: "wrapping-attr" as const, value: "#000000" }, // {color: #000000}
                    { type: "wrapping-attr" as const, value: "#FFFFFF" }, // {color: #FFFFFF}
                ];

                /** String after translation is malformed
                 * ```markdown
                 * <c1>white</c1> <c0>black</c0> <c2>extra</c2>
                 * ```
                 */
                const ast = u("root", [
                    u("html", "<c1>"),
                    u("text", "white"),
                    u("html", "</c1>"),
                    u("text", " "),
                    u("html", "<c0>"),
                    u("text", "black"),
                    u("html", "</c0>"),
                    u("text", " "),
                    u("html", "<c2>"),
                    u("text", "extra"),
                    u("html", "</c2>"),
                ]);

                const actualAst = fromComponents(ast, components, mapComponentDataToNode);

                /**
                 * Backconverted should be
                 * ```markdown
                 * {color: #FFFFFF}white{/color} {color: #000000}black{/color} <c2>extra</c2>
                 * ```
                 */
                const expectedAst = u("root", [
                    u("wrapping-attr", { value: "#FFFFFF" }, [u("text", "white")]),
                    u("text", " "),
                    u("wrapping-attr", { value: "#000000" }, [u("text", "black")]),
                    u("text", " "),
                    u("html", "<c2>"),
                    u("text", "extra"),
                    u("html", "</c2>"),
                ]);
                expect(actualAst).toEqual(expectedAst);
            });

            it("ignores component opening tag without matching closing tag", () => {
                /**
                 * Original string was
                 * ```markdown
                 * {color: #000000}black{/color} {color: #FFFFFF}white{/color}
                 * ```
                 * and string before translation was
                 * ```markdown
                 * <c0>black</c0> <c1>white</c1>
                 * ```
                 */
                const components = [
                    { type: "wrapping-attr" as const, value: "#000000" }, // {color: #000000}
                    { type: "wrapping-attr" as const, value: "#FFFFFF" }, // {color: #FFFFFF}
                ];

                /**
                 * String after translation is malformed
                 * ```markdown
                 * <c1>white</c1> <c0>black
                 * ```
                 */
                const ast = u("root", [
                    u("html", "<c1>"),
                    u("text", "white"),
                    u("html", "</c1>"),
                    u("text", " "),
                    u("html", "<c0>"),
                    u("text", "black"),
                ]);

                const actualAst = fromComponents(ast, components, mapComponentDataToNode);

                /**
                 * Backconverted should be
                 * ```markdown
                 * {color: #FFFFFF}white{/color} <c0>black
                 * ```
                 */
                const expectedAst = u("root", [
                    u("wrapping-attr", { value: "#FFFFFF" }, [u("text", "white")]),
                    u("text", " "),
                    u("html", "<c0>"),
                    u("text", "black"),
                ]);
                expect(actualAst).toEqual(expectedAst);
            });

            it("ignores component closing tag without matching opening tag", () => {
                /**
                 * Original string was
                 * ```markdown
                 * {color: #000000}black{/color} {color: #FFFFFF}white{/color}
                 * ```
                 * and string before translation was
                 * ```markdown
                 * <c0>black</c0> <c1>white</c1>
                 * ```
                 */
                const components = [
                    { type: "wrapping-attr" as const, value: "#000000" }, // {color: #000000}
                    { type: "wrapping-attr" as const, value: "#FFFFFF" }, // {color: #FFFFFF}
                ];

                /**
                 * String after translation is malformed
                 * ```markdown
                 * <c1>white</c1> black</c0>
                 * ```
                 */
                const ast = u("root", [
                    u("html", "<c1>"),
                    u("text", "white"),
                    u("html", "</c1>"),
                    u("text", " black"),
                    u("html", "</c0>"),
                ]);

                const actualAst = fromComponents(ast, components, mapComponentDataToNode);

                /**
                 * Backconverted should be
                 * ```markdown
                 * {color: #FFFFFF}white{/color} black</c0>
                 * ```
                 */
                const expectedAst = u("root", [
                    u("wrapping-attr", { value: "#FFFFFF" }, [u("text", "white")]),
                    u("text", " black"),
                    u("html", "</c0>"),
                ]);
                expect(actualAst).toEqual(expectedAst);
            });

            it("ignores component closing tag swapped with opening tag", () => {
                /**
                 * Original string was
                 * ```markdown
                 * {color: #000000}black{/color}
                 * ```
                 * and string before translation was
                 * ```markdown
                 * <c0>black</c0>
                 */
                const components = [
                    { type: "wrapping-attr" as const, value: "#000000" }, // {color: #000000}
                ];

                /**
                 * String after translation is malformed
                 * ```markdown
                 * </c0>black<c0>
                 * ```
                 */
                const ast = u("root", [u("html", "</c0>"), u("text", "black"), u("html", "<c0>")]);

                const actualAst = fromComponents(ast, components, mapComponentDataToNode);

                /**
                 * Backconverted should be
                 * ```markdown
                 * </c0>black<c0>
                 * ```
                 */
                const expectedAst = u("root", [u("html", "</c0>"), u("text", "black"), u("html", "<c0>")]); // no change

                expect(actualAst).toEqual(expectedAst);
            });

            it("ignores dual component open tags", () => {
                /**
                 * Original string was
                 * ```markdown
                 * {color: #000000}black{/color}
                 * ```
                 * and string before translation was
                 * ```markdown
                 * <c0>black</c0>
                 */
                const components = [
                    { type: "wrapping-attr" as const, value: "#000000" }, // {color: #000000}
                ];

                /**
                 * String after translation is malformed
                 * ```markdown
                 * <c0>black<c0>
                 * ```
                 */
                const ast = u("root", [u("html", "<c0>"), u("text", "black"), u("html", "<c0>")]);

                const actualAst = fromComponents(ast, components, mapComponentDataToNode);

                /**
                 * Backconverted should be
                 * ```markdown
                 * <c0>black<c0>
                 * ```
                 */
                const expectedAst = u("root", [u("html", "<c0>"), u("text", "black"), u("html", "<c0>")]); // no change

                expect(actualAst).toEqual(expectedAst);
            });

            it("ignores dual component close tags", () => {
                /**
                 * Original string was
                 * ```markdown
                 * {color: #000000}black{/color}
                 * ```
                 * and string before translation was
                 * ```markdown
                 * <c0>black</c0>
                 */
                const components = [
                    { type: "wrapping-attr" as const, value: "#000000" }, // {color: #000000}
                ];

                /**
                 * String after translation is malformed
                 * ```markdown
                 * <c0/>black</c0>
                 * ```
                 */
                const ast = u("root", [u("html", "</c0>"), u("text", "black"), u("html", "</c0>")]);

                const actualAst = fromComponents(ast, components, mapComponentDataToNode);

                /**
                 * Backconverted should be
                 * ```markdown
                 * </c0>black</c0>
                 * ```
                 */
                const expectedAst = u("root", [u("html", "</c0>"), u("text", "black"), u("html", "</c0>")]); // no change

                expect(actualAst).toEqual(expectedAst);
            });

            it("recovers some interleaved components", () => {
                /**
                 * Original string was
                 * ```markdown
                 * {color: #000000}black{/color} {color: #FFFFFF}white{/color}
                 * ```
                 * and string before translation was
                 * ```markdown
                 * <c0>black</c0> <c1>white</c1>
                 * ```
                 */
                const components = [
                    { type: "wrapping-attr" as const, value: "#000000" }, // {color: #000000}
                    { type: "wrapping-attr" as const, value: "#FFFFFF" }, // {color: #FFFFFF}
                ];

                /**
                 * String after translation is malformed
                 * ```markdown
                 * <c1>white<c0></c1> black</c0>
                 * ```
                 */
                const ast = u("root", [
                    u("html", "<c1>"),
                    u("text", "white"),
                    u("html", "<c0>"),
                    u("html", "</c1>"),
                    u("text", " black"),
                    u("html", "</c0>"),
                ]);

                const actualAst = fromComponents(ast, components, mapComponentDataToNode);

                /**
                 * Backconverted should be
                 * ```markdown
                 * {color: #FFFFFF}white<c0>{/color} black</c0>
                 * ```
                 */
                const expectedAst = u("root", [
                    u("wrapping-attr", { value: "#FFFFFF" }, [u("text", "white"), u("html", "<c0>")]),
                    u("text", " black"),
                    u("html", "</c0>"),
                ]);

                expect(actualAst).toEqual(expectedAst);
            });
        });
    });
});
