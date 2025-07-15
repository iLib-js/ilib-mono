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

import { fromColorNodes, toColorNodes } from "../color";
import u from "unist-builder";

describe("ast-transformer-color", () => {
    describe("toColorNodes", () => {
        it("should not modify the AST if there are no color nodes", () => {
            /**
             * ```markdown
             * normal text
             * ```
             */
            const ast = u("root", [u("paragraph", [u("text", "normal text")])]);

            const actual = toColorNodes(ast);

            expect(actual).toEqual(ast);
        });

        it("should reduce HTML color nodes span to a custom Color node", () => {
            /**
             * ```markdown
             * normal text <color value="#000000">colored text</color> normal text
             * ```
             */
            const ast = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("html", '<color value="#000000">'),
                    u("text", "colored text"),
                    u("html", "</color>"),
                    u("text", " normal text"),
                ]),
            ]);

            const expected = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("color", { value: "#000000" }, [u("text", "colored text")]),
                    u("text", " normal text"),
                ]),
            ]);

            const actual = toColorNodes(ast);

            expect(actual).toEqual(expected);
        });

        it("should handle multiple color nodes", () => {
            /**
             * ```markdown
             * normal text <color value="#000000">black text</color> normal text <color value="#ffffff">white text</color> normal text
             * ```
             */
            const ast = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("html", '<color value="#000000">'),
                    u("text", "black text"),
                    u("html", "</color>"),
                    u("text", " normal text "),
                    u("html", '<color value="#ffffff">'),
                    u("text", "white text"),
                    u("html", "</color>"),
                    u("text", " normal text"),
                ]),
            ]);

            const expected = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("color", { value: "#000000" }, [u("text", "black text")]),
                    u("text", " normal text "),
                    u("color", { value: "#ffffff" }, [u("text", "white text")]),
                    u("text", " normal text"),
                ]),
            ]);

            const actual = toColorNodes(ast);

            expect(actual).toEqual(expected);
        });

        // not sure if nesting is actully supported in Pendo
        it("should handle nested color nodes", () => {
            /**
             * ```markdown
             * normal text <color value="#000000">black text <color value="#ffffff">white text</color></color> normal text
             * ```
             */
            const ast = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("html", '<color value="#000000">'),
                    u("text", "black text "),
                    u("html", '<color value="#ffffff">'),
                    u("text", "white text"),
                    u("html", "</color>"),
                    u("html", "</color>"),
                    u("text", " normal text"),
                ]),
            ]);

            const expected = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("color", { value: "#000000" }, [
                        u("text", "black text "),
                        u("color", { value: "#ffffff" }, [u("text", "white text")]),
                    ]),
                    u("text", " normal text"),
                ]),
            ]);

            const actual = toColorNodes(ast);

            expect(actual).toEqual(expected);
        });

        it("should handle adjacent color nodes", () => {
            /**
             * ```markdown
             * normal text <color value="#000000">black text</color><color value="#ffffff">white text</color> normal text
             * ```
             */
            const ast = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("html", '<color value="#000000">'),
                    u("text", "black text"),
                    u("html", "</color>"),
                    u("html", '<color value="#ffffff">'),
                    u("text", "white text"),
                    u("html", "</color>"),
                    u("text", " normal text"),
                ]),
            ]);

            const expected = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("color", { value: "#000000" }, [u("text", "black text")]),
                    u("color", { value: "#ffffff" }, [u("text", "white text")]),
                    u("text", " normal text"),
                ]),
            ]);

            const actual = toColorNodes(ast);

            expect(actual).toEqual(expected);
        });
    });

    describe("fromColorNodes", () => {
        it("should not modify the AST if there are no color nodes", () => {
            /**
             * ```markdown
             * normal text
             * ```
             */
            const ast = u("root", [u("paragraph", [u("text", "normal text")])]);

            const actual = fromColorNodes(ast);

            expect(actual).toEqual(ast);
        });

        it("should backconvert custom Color nodes to HTML color nodes", () => {
            /**
             * ```markdown
             * normal text <color value="#000000">colored text</color> normal text
             * ```
             */
            const astWithColorNodes = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("color", { value: "#000000" }, [u("text", "colored text")]),
                    u("text", " normal text"),
                ]),
            ]);

            const expected = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("html", '<color value="#000000">'),
                    u("text", "colored text"),
                    u("html", "</color>"),
                    u("text", " normal text"),
                ]),
            ]);

            const actual = fromColorNodes(astWithColorNodes);

            expect(actual).toEqual(expected);
        });

        it("should backconvert multiple color nodes", () => {
            /**
             * ```markdown
             * normal text <color value="#000000">black text</color> normal text <color value="#ffffff">white text</color> normal text
             * ```
             */
            const astWithColorNodes = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("color", { value: "#000000" }, [u("text", "black text")]),
                    u("text", " normal text "),
                    u("color", { value: "#ffffff" }, [u("text", "white text")]),
                    u("text", " normal text"),
                ]),
            ]);

            const expected = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("html", '<color value="#000000">'),
                    u("text", "black text"),
                    u("html", "</color>"),
                    u("text", " normal text "),
                    u("html", '<color value="#ffffff">'),
                    u("text", "white text"),
                    u("html", "</color>"),
                    u("text", " normal text"),
                ]),
            ]);

            const actual = fromColorNodes(astWithColorNodes);

            expect(actual).toEqual(expected);
        });

        // not sure if nesting is actully supported in Pendo
        it("should handle nested color nodes", () => {
            /**
             * ```markdown
             * normal text <color value="#000000">black text <color value="#ffffff">white text</color></color> normal text
             * ```
             */
            const astWithColorNodes = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("color", { value: "#000000" }, [
                        u("text", "black text "),
                        u("color", { value: "#ffffff" }, [u("text", "white text")]),
                    ]),
                    u("text", " normal text"),
                ]),
            ]);

            const expected = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("html", '<color value="#000000">'),
                    u("text", "black text "),
                    u("html", '<color value="#ffffff">'),
                    u("text", "white text"),
                    u("html", "</color>"),
                    u("html", "</color>"),
                    u("text", " normal text"),
                ]),
            ]);

            const actual = fromColorNodes(astWithColorNodes);

            expect(actual).toEqual(expected);
        });

        it("should handle adjacent color nodes", () => {
            /**
             * ```markdown
             * normal text <color value="#000000">black text</color><color value="#ffffff">white text</color> normal text
             * ```
             */
            const astWithColorNodes = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("color", { value: "#000000" }, [u("text", "black text")]),
                    u("color", { value: "#ffffff" }, [u("text", "white text")]),
                    u("text", " normal text"),
                ]),
            ]);

            const expected = u("root", [
                u("paragraph", [
                    u("text", "normal text "),
                    u("html", '<color value="#000000">'),
                    u("text", "black text"),
                    u("html", "</color>"),
                    u("html", '<color value="#ffffff">'),
                    u("text", "white text"),
                    u("html", "</color>"),
                    u("text", " normal text"),
                ]),
            ]);

            const actual = fromColorNodes(astWithColorNodes);

            expect(actual).toEqual(expected);
        });
    });
});
