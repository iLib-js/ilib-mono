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

import type { ComponentList } from "../../ast-transformer/component";
import { backconvert, convert } from "../convert";

describe("markdown/convert", () => {
    describe("convert", () => {
        it("should escape markdown syntax using components", () => {
            const markdown = `string with *emphasis*, ++underline++, {color: #FF0000}colored text{/color} and [a link](https://example.com)`;
            const [escaped, _] = convert(markdown);

            expect(escaped).toBe(
                `string with <c0>emphasis</c0>, <c1>underline</c1>, <c2>colored text</c2> and <c3>a link</c3>`,
            );
        });

        it("should output data about components", () => {
            const markdown = `string with *emphasis*, ++underline++, {color: #FF0000}colored text{/color} and [a link](https://example.com)`;
            const [_, components] = convert(markdown);

            expect(components).toEqual([
                { type: "emphasis" },
                {
                    type: "underline",
                },
                {
                    type: "color",
                    value: "#FF0000",
                },
                {
                    type: "link",
                    url: "https://example.com",
                },
            ]);
        });
    });

    describe("backconvert", () => {
        it("should backconvert escaped string to markdown syntax", () => {
            const escaped = `string with <c0>emphasis</c0>, <c1>underline</c1>, <c2>colored text</c2> and <c3>a link</c3>`;
            const components: ComponentList = [
                { type: "emphasis" },
                {
                    type: "underline",
                },
                {
                    type: "color",
                    value: "#FF0000",
                },
                {
                    type: "link",
                    url: "https://example.com",
                },
            ];

            const backconverted = backconvert(escaped, components);

            expect(backconverted).toBe(
                `string with *emphasis*, ++underline++, {color: #FF0000}colored text{/color} and [a link](https://example.com)`,
            );
        });

        it("should backconvert shuffled escaped string to markdown syntax", () => {
            // components parsed from markdown string
            // string with *emphasis*, ++underline++, {color: #FF0000}colored text{/color} and [a link](https://example.com)
            const components: ComponentList = [
                { type: "emphasis" },
                {
                    type: "underline",
                },
                {
                    type: "color",
                    value: "#FF0000",
                },
                {
                    type: "link",
                    url: "https://example.com",
                },
            ];

            // escaped string with shuffled order (as if it came from translation)
            const escapedShuffled = `string with <c2>colored text</c2>, <c1>underline</c1>, <c0>emphasis</c0> and <c3>a link</c3>`;

            const backconverted = backconvert(escapedShuffled, components);

            expect(backconverted).toBe(
                `string with {color: #FF0000}colored text{/color}, ++underline++, *emphasis* and [a link](https://example.com)`,
            );
        });
    });
});
