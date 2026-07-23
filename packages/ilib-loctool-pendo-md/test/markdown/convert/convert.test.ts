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

import dedent from "dedent";
import { backconvert, convert } from "../../../src/markdown/convert";
import type { ComponentData } from "../../../src/markdown/ast-transformer/component/ComponentData";
import u from "unist-builder";

describe("markdown/convert", () => {
    describe("roundtrip", () => {
        it.each([
            ["root emphasis", "*text*"],
            ["root delete", "~~text~~"],
            ["root underline", "++text++"],
            ["root color", "{color: #FF0000}text{/color}"],
            ["root link", "[link](https://example.com)"],
        ])("should roundtrip markdown string with one root-level component %s", (_desc, markdown) => {
            const [escaped, components] = convert(markdown);
            const backconverted = backconvert(escaped, components);
            expect(backconverted).toBe(markdown);
        });

        it.each([
            ["one emphasis", "text *emphasis* text"],
            ["one delete", "text ~~delete~~ text"],
            ["one underline", "text ++underline++ text"],
            ["one color", "text {color: #FF0000}colored text{/color} text"],
            ["one link", "text [link](https://example.com) text"],
        ])("should roundtrip markdown string with one paragraph non-root-level components %s", (_desc, markdown) => {
            const [escaped, components] = convert(markdown);
            const backconverted = backconvert(escaped, components);
            expect(backconverted).toBe(markdown);
        });

        it.each([
            ["two emphases", "text *emphasis* text *emphasis* text"],
            ["two deletes", "text ~~delete~~ text ~~delete~~ text"],
            ["two underlines", "text ++underline++ text ++underline++ text"],
            ["two colors", "text {color: #FF0000}colored text{/color} text {color: #FF0000}colored text{/color} text"],
            ["two links", "text [link](https://example.com) text [link](https://example.com) text"],
        ])("should roundtrip markdown string with two paragraph non-root-level components %s", (_desc, markdown) => {
            const [escaped, components] = convert(markdown);
            const backconverted = backconvert(escaped, components);
            expect(backconverted).toBe(markdown);
        });

        it("should roundtrip markdown multiple paragraphs", () => {
            const markdown = dedent`
            text *emphasis* text *emphasis* text

            text *emphasis* text *emphasis* text
            `;
            const [escaped, components] = convert(markdown);
            const backconverted = backconvert(escaped, components);
            expect(backconverted).toBe(markdown);
        });

        it("should roundtrip markdown with nested components", () => {
            const markdown = dedent`
            text ++underline *emphasis ~~delete~~*++ text

            text ++underline *emphasis ~~delete~~*++ text
            `;
            const [escaped, components] = convert(markdown);
            const backconverted = backconvert(escaped, components);
            expect(backconverted).toBe(markdown);
        });

        it("should roundtrip markdown unordered lists", () => {
            const markdown = dedent`
            Some paragraph text:

            *   **FOO** foo
            *   bar **BAR**
            *   **BAZ** baz
            
            Some more paragraph text
            `;

            const [escaped, components] = convert(markdown);
            const backconverted = backconvert(escaped, components);
            expect(backconverted).toBe(markdown);
        });
    });

    describe("convert", () => {
        describe("escape", () => {
            it("should escape markdown syntax using components", () => {
                const markdown = `string with *emphasis*, ++underline++, {color: #FF0000}colored text{/color} and [a link](https://example.com)`;
                const [escaped, _] = convert(markdown);

                expect(escaped).toBe(
                    `string with <c0>emphasis</c0>, <c1>underline</c1>, <c2>colored text</c2> and <c3>a link</c3>`
                );
            });

            it.each([
                ["root emphasis", "*text*", "text"],
                ["root delete", "~~text~~", "text"],
                ["root underline", "++text++", "text"],
                ["root color", "{color: #FF0000}text{/color}", "text"],
                ["root link", "[link](https://example.com)", "link"],
            ])("should escape markdown string with one root-level component %s", (_desc, markdown, expected) => {
                const [escaped, _components] = convert(markdown);
                expect(escaped).toBe(expected);
            });

            it.each([
                ["one emphasis", "text *emphasis* text", "text <c0>emphasis</c0> text"],
                ["one delete", "text ~~delete~~ text", "text <c0>delete</c0> text"],
                ["one underline", "text ++underline++ text", "text <c0>underline</c0> text"],
                ["one color", "text {color: #FF0000}colored text{/color} text", "text <c0>colored text</c0> text"],
                ["one link", "text [link](https://example.com) text", "text <c0>link</c0> text"],
            ])(
                "should escape markdown string with one paragraph non-root-level components %s",
                (_desc, markdown, expected) => {
                    const [escaped, _components] = convert(markdown);
                    expect(escaped).toBe(expected);
                }
            );

            it.each([
                [
                    "two emphases",
                    "text *emphasis* text *emphasis* text",
                    "text <c0>emphasis</c0> text <c1>emphasis</c1> text",
                ],
                [
                    "two deletes",
                    "text ~~delete~~ text ~~delete~~ text",
                    "text <c0>delete</c0> text <c1>delete</c1> text",
                ],
                [
                    "two underlines",
                    "text ++underline++ text ++underline++ text",
                    "text <c0>underline</c0> text <c1>underline</c1> text",
                ],
                [
                    "two colors",
                    "text {color: #FF0000}colored text{/color} text {color: #FF0000}colored text{/color} text",
                    "text <c0>colored text</c0> text <c1>colored text</c1> text",
                ],
                [
                    "two links",
                    "text [link](https://example.com) text [link](https://example.com) text",
                    "text <c0>link</c0> text <c1>link</c1> text",
                ],
            ])(
                "should escape markdown string with two paragraph non-root-level components %s",
                (_desc, markdown, expected) => {
                    const [escaped, _components] = convert(markdown);
                    expect(escaped).toBe(expected);
                }
            );

            it("should escape markdown multiple paragraphs", () => {
                const markdown = dedent`
            text *emphasis* text *emphasis* text

            text *emphasis* text *emphasis* text
            `;

                const expected =
                    "<c0>text <c1>emphasis</c1> text <c2>emphasis</c2> text</c0><c3>text <c4>emphasis</c4> text <c5>emphasis</c5> text</c3>";
                const [escaped, _components] = convert(markdown);
                expect(escaped).toBe(expected);
            });

            it("should escape markdown unordered lists", () => {
                const markdown = dedent`
                Some paragraph text:

                *   **FOO** foo
                *   bar **BAR**
                *   **BAZ** baz
                
                Some more paragraph text
                `;

                const expected = dedent`
                <c0>Some paragraph text:</c0><c1><c2><c3>FOO</c3> foo</c2><c4>bar <c5>BAR</c5></c4><c6><c7>BAZ</c7> baz</c6></c1><c8>Some more paragraph text</c8>
                `;

                const [escaped, _components] = convert(markdown);
                expect(escaped).toBe(expected);
            });
        });

        describe("component data", () => {
            it("should output data about components", () => {
                const markdown = `string with *emphasis*, ++underline++, {color: #FF0000}colored text{/color} and [a link](https://example.com)`;
                const [_, components] = convert(markdown);

                expect(components).toEqual(
                    new Map([
                        [-1, [u("root", []), u("paragraph", [])]],
                        [0, [u("emphasis", [])]],
                        [1, [u("underline", [])]],
                        [2, [u("color", { value: "#FF0000" }, [])]],
                        [3, [u("link", { url: "https://example.com", title: null }, [])]],
                    ])
                );
            });
        });
    });

    describe("backconvert", () => {
        it("should backconvert escaped string to markdown syntax", () => {
            const escaped = `string with <c0>emphasis</c0>, <c1>underline</c1>, <c2>colored text</c2> and <c3>a link</c3>`;
            const components: ComponentData = new Map([
                [-1, [u("root", []), u("paragraph", [])]],
                [0, [u("emphasis", [])]],
                [1, [u("underline", [])]],
                [2, [u("color", { value: "#FF0000" }, [])]],
                [3, [u("link", { url: "https://example.com", title: null }, [])]],
            ]);

            const backconverted = backconvert(escaped, components);

            expect(backconverted).toBe(
                `string with *emphasis*, ++underline++, {color: #FF0000}colored text{/color} and [a link](https://example.com)`
            );
        });

        it("should backconvert shuffled escaped string to markdown syntax", () => {
            // components parsed from markdown string
            // string with *emphasis*, ++underline++, {color: #FF0000}colored text{/color} and [a link](https://example.com)
            const components: ComponentData = new Map([
                [-1, [u("root", []), u("paragraph", [])]],
                [0, [u("emphasis", [])]],
                [1, [u("underline", [])]],
                [2, [u("color", { value: "#FF0000" }, [])]],
                [3, [u("link", { url: "https://example.com", title: null }, [])]],
            ]);

            // escaped string with shuffled order (as if it came from translation)
            const escapedShuffled = `string with <c2>colored text</c2>, <c1>underline</c1>, <c0>emphasis</c0> and <c3>a link</c3>`;

            const backconverted = backconvert(escapedShuffled, components);

            expect(backconverted).toBe(
                `string with {color: #FF0000}colored text{/color}, ++underline++, *emphasis* and [a link](https://example.com)`
            );
        });
    });
});
