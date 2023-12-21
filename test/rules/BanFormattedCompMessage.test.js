/*
 * BanFormattedCompMessage.test.js
 *
 * Copyright © 2023 Box, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Result } from "i18nlint-common";
import FlowParser from "../../src/parsers/FlowParser.js";
import JSParser from "../../src/parsers/JSParser.js";
import JSXParser from "../../src/parsers/JSXParser.js";
import BanFormattedCompMessage from "../../src/rules/BanFormattedCompMessage.js";
import { trimIndent } from "../utils.js";

/** @typedef {import("i18nlint-common").IntermediateRepresentation} IntermediateRepresentation */

describe("BanFormattedCompMessage", () => {
    describe("Flow JSX", () => {
        const getFlowJsxIr = (
            /** @type {string} */ filePath,
            /** @type {string} */ content
        ) => {
            const parser = new FlowParser();
            parser.data = trimIndent(content);
            parser.path = filePath;
            const [ir] = parser.parse();
            return ir;
        };

        test("component used in file", () => {
            const ir = getFlowJsxIr(
                "x/y.js",
                `
                // @flow
                import * as React from "react";
                import { Button, Link, FormattedCompMessage } from "components";
                
                export class CustomComponent extends React.Component {
                    render() {
                        return (
                            <>
                                <FormattedCompMessage id="some.id" description="Some message description">
                                    Some message with <Link href="example.com">link text</Link> and more text.
                                </FormattedCompMessage>
                                <Button className="some-button" type="button">
                                    Click me
                                </Button>
                            </>
                        );
                    }
                }
                `
            );

            const rule = new BanFormattedCompMessage();

            const result = rule.match({ ir });

            const expected = [
                new Result({
                    severity: "error",
                    description:
                        "Do not use deprecated FormattedCompMessage component.",
                    pathName: "x/y.js",
                    rule,
                    highlight: "Range: <e0>65:85</e0>"
                }),
                new Result({
                    severity: "error",
                    description:
                        "Do not use deprecated FormattedCompMessage component.",
                    pathName: "x/y.js",
                    rule,
                    highlight: "Range: <e0>227:247</e0>"
                })
            ];

            expect(result).toStrictEqual(expected);
        });

        test("component not used in file", () => {
            const ir = getFlowJsxIr(
                "x/y.js",
                `
                // @flow
                import * as React from "react";
                import { Button, Link, FormattedMessage } from "components";

                export class CustomComponent extends React.Component {
                    render() {
                        return (
                            <>
                                <FormattedMessage
                                    id="some.id"
                                    description="Some message description"
                                    defaultMessage="Some message with <Link>link text</Link> and more text."
                                    values={{
                                        Link: (chunks) => <Link href="example.com">{...chunks}</Link>,
                                    }}
                                />
                                <Button className="some-button" type="button">
                                    Click me
                                </Button>
                            </>
                        );
                    }
                }

                `
            );

            const rule = new BanFormattedCompMessage();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });
    });

    describe("JSX", () => {
        const getJsxIr = (
            /** @type {string} */ filePath,
            /** @type {string} */ content
        ) => {
            const parser = new JSXParser();
            parser.data = trimIndent(content);
            parser.path = filePath;
            const [ir] = parser.parse();
            return ir;
        };

        test("component used in file", () => {
            const ir = getJsxIr(
                "x/y.js",
                `
                import * as React from "react";
                import { Button, Link, FormattedCompMessage } from "components";
                
                export class CustomComponent extends React.Component {
                    render() {
                        return (
                            <>
                                <FormattedCompMessage id="some.id" description="Some message description">
                                    Some message with <Link href="example.com">link text</Link> and more text.
                                </FormattedCompMessage>
                                <Button className="some-button" type="button">
                                    Click me
                                </Button>
                            </>
                        );
                    }
                }
                `
            );

            const rule = new BanFormattedCompMessage();

            const result = rule.match({ ir });

            const expected = [
                new Result({
                    severity: "error",
                    description:
                        "Do not use deprecated FormattedCompMessage component.",
                    pathName: "x/y.js",
                    rule,
                    highlight: "Range: <e0>56:76</e0>"
                }),
                new Result({
                    severity: "error",
                    description:
                        "Do not use deprecated FormattedCompMessage component.",
                    pathName: "x/y.js",
                    rule,
                    highlight: "Range: <e0>218:238</e0>"
                })
            ];

            expect(result).toStrictEqual(expected);
        });

        test("component not used in file", () => {
            const ir = getJsxIr(
                "x/y.js",
                `
                import * as React from "react";
                import { Button, Link, FormattedMessage } from "components";

                export class CustomComponent extends React.Component {
                    render() {
                        return (
                            <>
                                <FormattedMessage
                                    id="some.id"
                                    description="Some message description"
                                    defaultMessage="Some message with <Link>link text</Link> and more text."
                                    values={{
                                        Link: (chunks) => <Link href="example.com">{...chunks}</Link>,
                                    }}
                                />
                                <Button className="some-button" type="button">
                                    Click me
                                </Button>
                            </>
                        );
                    }
                }

                `
            );

            const rule = new BanFormattedCompMessage();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });
    });

    describe("Flow", () => {
        const getFlowIr = (
            /** @type {string} */ filePath,
            /** @type {string} */ content
        ) => {
            const parser = new FlowParser();
            parser.data = trimIndent(content);
            parser.path = filePath;
            const [ir] = parser.parse();
            return ir;
        };

        test("component used in file", () => {
            const ir = getFlowIr(
                "x/y.js",
                `
                // @flow
                import * as React from "react";
                import { Button, Link, FormattedCompMessage } from "components";

                export class CustomComponent extends React.Component {
                    render() {
                        return React.createElement(
                            React.Fragment,
                            {},
                            React.createElement(
                                FormattedCompMessage,
                                { id: "some.id", description: "Some message description" },
                                "Some message with ",
                                React.createElement(Link, { href: "example.com" }, "link text"),
                                " and more text."
                            ),
                            React.createElement(Button, { className: "some-button", type: "button" }, "Click me")
                        );
                    }
                }
                `
            );

            const rule = new BanFormattedCompMessage();

            const result = rule.match({ ir });

            const expected = [
                new Result({
                    severity: "error",
                    description:
                        "Do not use deprecated FormattedCompMessage component.",
                    pathName: "x/y.js",
                    rule,
                    highlight: "Range: <e0>65:85</e0>"
                }),
                new Result({
                    severity: "error",
                    description:
                        "Do not use deprecated FormattedCompMessage component.",
                    pathName: "x/y.js",
                    rule,
                    highlight: "Range: <e0>307:327</e0>"
                })
            ];

            expect(result).toStrictEqual(expected);
        });

        test("component not used in file", () => {
            const ir = getFlowIr(
                "x/y.js",
                `
                // @flow
                import * as React from "react";
                import { Button, Link, FormattedMessage } from "components";

                export class CustomComponent extends React.Component {
                    render() {
                        return React.createElement(
                            React.Fragment,
                            {},
                            React.createElement(FormattedMessage, {
                                id: "some.id",
                                description: "Some message description",
                                defaultMessage: "Some message with <Link>link text</Link> and more text.",
                                values: {
                                    Link: (chunks) => React.createElement(Link, { href: "example.com" }, ...chunks),
                                },
                            }),
                            React.createElement(Button, { className: "some-button", type: "button" }, "Click me")
                        );
                    }
                }
                `
            );

            const rule = new BanFormattedCompMessage();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });
    });

    describe("JS", () => {
        const getJsIr = (
            /** @type {string} */ filePath,
            /** @type {string} */ content
        ) => {
            const parser = new JSParser();
            parser.data = trimIndent(content);
            parser.path = filePath;
            const [ir] = parser.parse();
            return ir;
        };

        test("component used in file", () => {
            const ir = getJsIr(
                "x/y.js",
                `
                import * as React from "react";
                import { Button, Link, FormattedCompMessage } from "components";

                export class CustomComponent extends React.Component {
                    render() {
                        return React.createElement(
                            React.Fragment,
                            {},
                            React.createElement(
                                FormattedCompMessage,
                                { id: "some.id", description: "Some message description" },
                                "Some message with ",
                                React.createElement(Link, { href: "example.com" }, "link text"),
                                " and more text."
                            ),
                            React.createElement(Button, { className: "some-button", type: "button" }, "Click me")
                        );
                    }
                }
                `
            );

            const rule = new BanFormattedCompMessage();

            const result = rule.match({ ir });

            const expected = [
                new Result({
                    severity: "error",
                    description:
                        "Do not use deprecated FormattedCompMessage component.",
                    pathName: "x/y.js",
                    rule,
                    highlight: "Range: <e0>56:76</e0>"
                }),
                new Result({
                    severity: "error",
                    description:
                        "Do not use deprecated FormattedCompMessage component.",
                    pathName: "x/y.js",
                    rule,
                    highlight: "Range: <e0>298:318</e0>"
                })
            ];

            expect(result).toStrictEqual(expected);
        });

        test("component not used in file", () => {
            const ir = getJsIr(
                "x/y.js",
                `
                import * as React from "react";
                import { Button, Link, FormattedMessage } from "components";

                export class CustomComponent extends React.Component {
                    render() {
                        return React.createElement(
                            React.Fragment,
                            {},
                            React.createElement(FormattedMessage, {
                                id: "some.id",
                                description: "Some message description",
                                defaultMessage: "Some message with <Link>link text</Link> and more text.",
                                values: {
                                    Link: (chunks) => React.createElement(Link, { href: "example.com" }, ...chunks),
                                },
                            }),
                            React.createElement(Button, { className: "some-button", type: "button" }, "Click me")
                        );
                    }
                }
                `
            );

            const rule = new BanFormattedCompMessage();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });
    });
});
