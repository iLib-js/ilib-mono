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

describe("markdown/convert", () => {
    describe("convert", () => {
        it("should escape markdown syntax using components", () => {
            const markdown = `string with *emphasis*, ++underline++, {color: #FF0000}colored text{/color} and [a link](https://example.com)`;
            const [escaped, _] = convert(markdown);

            expect(escaped).toBe(
                `string with <c0>emphasis</c0>, <c1>underline</c1>, <c2>colored text</c2> and <c3>a link</c3>`
            );
        });

        it("should output data about components", () => {
            const markdown = `string with *emphasis*, ++underline++, {color: #FF0000}colored text{/color} and [a link](https://example.com)`;
            const [_, components] = convert(markdown);

            expect(components).toEqual(
                new Map([
                    [
                        -1,
                        [
                            { type: "root", children: [] },
                            { type: "paragraph", children: [] },
                        ],
                    ],
                    [0, [{ type: "emphasis", children: [] }]],
                    [1, [{ type: "underline", children: [] }]],
                    [2, [{ type: "color", value: "#FF0000", children: [] }]],
                    [3, [{ type: "link", url: "https://example.com", children: [] }]],
                ])
            );
        });
    });

    describe("backconvert", () => {
        it("should backconvert escaped string to markdown syntax", () => {
            const escaped = `string with <c0>emphasis</c0>, <c1>underline</c1>, <c2>colored text</c2> and <c3>a link</c3>`;
            const components: ComponentData = new Map([
                [
                    -1,
                    [
                        { type: "root", children: [] },
                        { type: "paragraph", children: [] },
                    ],
                ],
                [0, [{ type: "emphasis", children: [] }]],
                [1, [{ type: "underline", children: [] }]],
                [2, [{ type: "color", value: "#FF0000", children: [] }]],
                [3, [{ type: "link", url: "https://example.com", children: [] }]],
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
                [
                    -1,
                    [
                        { type: "root", children: [] },
                        { type: "paragraph", children: [] },
                    ],
                ],
                [0, [{ type: "emphasis", children: [] }]],
                [1, [{ type: "underline", children: [] }]],
                [2, [{ type: "color", value: "#FF0000", children: [] }]],
                [3, [{ type: "link", url: "https://example.com", children: [] }]],
            ]);

            // escaped string with shuffled order (as if it came from translation)
            const escapedShuffled = `string with <c2>colored text</c2>, <c1>underline</c1>, <c0>emphasis</c0> and <c3>a link</c3>`;

            const backconverted = backconvert(escapedShuffled, components);

            expect(backconverted).toBe(
                `string with {color: #FF0000}colored text{/color}, ++underline++, *emphasis* and [a link](https://example.com)`
            );
        });
    });

    describe("roundtrip", () => {
        it("should correctly handle markdown unordered lists", () => {
            // prettier-ignore
            const markdown = dedent`
            *   **FOO** foo
            *   bar **BAR**
            *   **BAZ** baz
            `;

            const [escaped, components] = convert(markdown);
            const backconverted = backconvert(escaped, components);
            expect(backconverted).toBe(markdown);
        });
    });

    describe("workaround", () => {
        fit("should handle markdown lists with malformed newlines in translation", () => {
            // prettier-ignore
            const markdown = dedent`
            *   **first** item
            *   second **item**
            *   **third** item
            `;

            const [escaped, components] = convert(markdown);

            const malformedTranslation = escaped.replace(/\n/g, " ");

            const backconverted = backconvert(malformedTranslation, components);
            expect(backconverted).toEqual(
                dedent`
                *   **first** item
                *   second **item**
                *   **third** item`
            );
        });
    });
});
