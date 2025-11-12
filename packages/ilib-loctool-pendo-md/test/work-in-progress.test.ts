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
    mdastToComponentAst,
    flattenComponentNodes,
    enumerateComponents,
    stringifyComponentAst,
    extractComponentData,
    ROOT_COMPONENT_INDEX,
    parseComponentString,
} from "../src/work-in-progress";

describe("work-in-progress", () => {
    test("mdast to component ast", () => {
        // markdown: <br/> regular ~*italic strikethrough*~\n\n <br/> regular ~*italic strikethrough*~
        // prettier-ignore
        const mdast = u("root", [
            u("paragraph", [
                u("html", "<br/>"),
                u("text", " regular "),
                u("delete", [
                    u("emphasis", [
                        u("text", "italic striketrough"),
                    ]),
                ]),
            ]),
            u("paragraph", [
                u("html", "<br/>"),
                u("text", " regular "),
                u("delete", [
                    u("emphasis", [
                        u("text", "italic striketrough"),
                    ]),
                ]),
            ]),
        ]);
        const componentAst = mdastToComponentAst(mdast);

        const expected = {
            type: "component",
            originalNodes: [{ type: "root", children: [] }],
            children: [
                {
                    type: "component",
                    originalNodes: [{ type: "paragraph", children: [] }],
                    children: [
                        {
                            type: "component",
                            originalNodes: [{ type: "html", value: "<br/>" }],
                            children: [],
                        },
                        { type: "text", value: " regular " },
                        {
                            type: "component",
                            originalNodes: [{ type: "delete", children: [] }],
                            children: [
                                {
                                    type: "component",
                                    originalNodes: [{ type: "emphasis", children: [] }],
                                    children: [{ type: "text", value: "italic striketrough" }],
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "component",
                    originalNodes: [{ type: "paragraph", children: [] }],
                    children: [
                        {
                            type: "component",
                            originalNodes: [{ type: "html", value: "<br/>" }],
                            children: [],
                        },
                        { type: "text", value: " regular " },
                        {
                            type: "component",
                            originalNodes: [{ type: "delete", children: [] }],
                            children: [
                                {
                                    type: "component",
                                    originalNodes: [{ type: "emphasis", children: [] }],
                                    children: [{ type: "text", value: "italic striketrough" }],
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        expect(componentAst).toEqual(expected);
    });

    test("minimize component nodes", () => {
        const firstPassAst = {
            type: "component",
            originalNodes: [{ type: "root", children: [] }],
            children: [
                {
                    type: "component",
                    originalNodes: [{ type: "paragraph", children: [] }],
                    children: [
                        {
                            type: "component",
                            originalNodes: [{ type: "html", value: "<br/>" }],
                            children: [],
                        },
                        { type: "text", value: " regular " },
                        {
                            type: "component",
                            originalNodes: [{ type: "delete", children: [] }],
                            children: [
                                {
                                    type: "component",
                                    originalNodes: [{ type: "emphasis", children: [] }],
                                    children: [{ type: "text", value: "italic striketrough" }],
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        const minimizedAst = flattenComponentNodes(firstPassAst as any);

        const expected = {
            type: "component",
            originalNodes: [
                { type: "root", children: [] },
                { type: "paragraph", children: [] },
            ],
            children: [
                {
                    type: "component",
                    originalNodes: [{ type: "html", value: "<br/>" }],
                    children: [],
                },
                { type: "text", value: " regular " },
                {
                    type: "component",
                    originalNodes: [
                        { type: "delete", children: [] },
                        { type: "emphasis", children: [] },
                    ],
                    children: [{ type: "text", value: "italic striketrough" }],
                },
            ],
        };
        expect(minimizedAst).toEqual(expected);
    });

    test("enumerate components", () => {
        const minimizedAst = {
            type: "component",
            originalNodes: [
                { type: "root", children: [] },
                { type: "paragraph", children: [] },
            ],
            children: [
                {
                    type: "component",
                    originalNodes: [{ type: "html", value: "<br/>" }],
                    children: [],
                },
                { type: "text", value: " regular " },
                {
                    type: "component",
                    originalNodes: [
                        { type: "delete", children: [] },
                        { type: "emphasis", children: [] },
                    ],
                    children: [{ type: "text", value: "italic striketrough" }],
                },
            ],
        };

        const enumeratedAst = enumerateComponents(minimizedAst as any);

        const expected = {
            type: "component",
            // root component won't actually be displayed in the translatable string
            componentIndex: -1,
            originalNodes: [
                { type: "root", children: [] },
                { type: "paragraph", children: [] },
            ],
            children: [
                {
                    type: "component",
                    componentIndex: 0,
                    originalNodes: [{ type: "html", value: "<br/>" }],
                    children: [],
                },
                { type: "text", value: " regular " },
                {
                    type: "component",
                    componentIndex: 1,
                    originalNodes: [
                        { type: "delete", children: [] },
                        { type: "emphasis", children: [] },
                    ],
                    children: [{ type: "text", value: "italic striketrough" }],
                },
            ],
        };

        expect(enumeratedAst).toEqual(expected);
    });

    test("stringify component ast", () => {
        const enumeratedAst = {
            type: "component",
            // root component won't actually be displayed in the translatable string
            componentIndex: -1,
            originalNodes: [
                { type: "root", children: [] },
                { type: "paragraph", children: [] },
            ],
            children: [
                {
                    type: "component",
                    componentIndex: 0,
                    originalNodes: [{ type: "html", value: "<br/>" }],
                    children: [],
                },
                { type: "text", value: " regular " },
                {
                    type: "component",
                    componentIndex: 1,
                    originalNodes: [
                        { type: "delete", children: [] },
                        { type: "emphasis", children: [] },
                    ],
                    children: [{ type: "text", value: "italic striketrough" }],
                },
            ],
        };

        const stringified = stringifyComponentAst(enumeratedAst as any);

        const expected = "<c0/> regular <c1>italic striketrough</c1>";

        expect(stringified).toEqual(expected);
    });

    test("extract component data", () => {
        const enumeratedAst = {
            type: "component",
            // root component won't actually be displayed in the translatable string
            componentIndex: -1,
            originalNodes: [
                { type: "root", children: [] },
                { type: "paragraph", children: [] },
            ],
            children: [
                {
                    type: "component",
                    componentIndex: 0,
                    originalNodes: [{ type: "html", value: "<br/>" }],
                    children: [],
                },
                { type: "text", value: " regular " },
                {
                    type: "component",
                    componentIndex: 1,
                    originalNodes: [
                        { type: "delete", children: [] },
                        { type: "emphasis", children: [] },
                    ],
                    children: [{ type: "text", value: "italic striketrough" }],
                },
            ],
        };

        const componentData = extractComponentData(enumeratedAst as any);

        const expected = {
            [ROOT_COMPONENT_INDEX]: [
                { type: "root", children: [] },
                { type: "paragraph", children: [] },
            ],
            0: [{ type: "html", value: "<br/>" }],
            1: [
                { type: "delete", children: [] },
                { type: "emphasis", children: [] },
            ],
        };

        expect(componentData).toEqual(expected);
    });

    test("parse component string", () => {
        const string = "<c0/> regular <c1>italic striketrough</c1>";
        const parsed = parseComponentString(string);

        const expected = {
            type: "component",
            componentIndex: ROOT_COMPONENT_INDEX,
            originalNodes: [],
            children: [
                {
                    type: "component",
                    componentIndex: 0,
                    originalNodes: [],
                    children: [],
                },
                { type: "text", value: " regular " },
                {
                    type: "component",
                    componentIndex: 1,
                    originalNodes: [],
                    children: [{ type: "text", value: "italic striketrough" }],
                },
            ],
        };

        expect(parsed).toEqual(expected);
    });
});
