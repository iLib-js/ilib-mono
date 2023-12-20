/*
 * NoHardCodedStrings.test.js
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
import NoHardCodedStrings from "../../src/rules/NoHardCodedStrings.js";
import { trimIndent } from "../utils.js";

/** @typedef {import("i18nlint-common").IntermediateRepresentation} IntermediateRepresentation */

describe("NoHardCodedStrings", () => {
    describe("Flow JSX", () => {
        const getFlowJsxIr = (filePath, content) => {
            const parser = new FlowParser();
            parser.data = trimIndent(content);
            parser.path = filePath;
            const [ir] = parser.parse();
            return ir;
        };

        test("hard coded string in Flow JSX", () => {
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
                                <Button className="some-button" type="button">
                                    Click me
                                </Button>
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            const expected = [
                new Result({
                    severity: "error",
                    description:
                        "Found unlocalizable hard-coded string. Use a FormattedMessage component instead.",
                    pathName: "x/y.js",
                    rule,
                    highlight: `<e0>Click me</e0>`,
                    lineNumber: 10,
                    charNumber: 62,
                    endLineNumber: 12,
                    endCharNumber: 16,
                })
            ];

            expect(result).toStrictEqual(expected);
        });

        test("no hard-coded strings used in file", () => {
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
                                <Button title={messages.myString}>
                                </Button>
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });

        test("skipping hard-coded text inside of a FormattedMessage component", () => {
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
                                        Link: (chunks) => <Link href="example.com">chunks</Link>,
                                    }}
                                />
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });

        test("skipping hard-coded text inside of a FormattedCompMessage component", () => {
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
                                <FormattedCompMessage id="some.id" description="Some message description">
                                    Some message with <Link href="example.com">link text</Link> and more text.
                                </FormattedCompMessage>
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });

        test("hard coded string in HTML attribute", () => {
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
                                <input type="button" placeholder = 'Your name' />
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            const expected = [
                new Result({
                    severity: "error",
                    description:
                        "Found unlocalizable hard-coded attribute value. Use intl.formatMessage() instead.",
                    pathName: "x/y.js",
                    rule,
                    highlight: `<e0>placeholder='Your name'</e0>`,
                    lineNumber: 10,
                    charNumber: 37,
                    endLineNumber: 10,
                    endCharNumber: 62,
                })
            ];

            expect(result).toStrictEqual(expected);
        });

        test("no hard coded string in HTML attribute", () => {
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
                                <input type="button" placeholder={intl.formatMessage(...messages.myMessage)} />
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });
    });

    describe("JSX", () => {
        const getJsxIr = (filePath, content) => {
            const parser = new JSXParser();
            parser.data = trimIndent(content);
            parser.path = filePath;
            const [ir] = parser.parse();
            return ir;
        };

        test("hard coded string in JSX", () => {
            const ir = getJsxIr(
                "x/y.js",
                `
                import * as React from "react";
                import { Button, Link, FormattedCompMessage } from "components";

                export class CustomComponent extends React.Component {
                    render() {
                        return (
                            <>
                                <Button className="some-button" type="button">
                                    Click me
                                </Button>
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            const expected = [
                new Result({
                    severity: "error",
                    description:
                        "Found unlocalizable hard-coded string. Use a FormattedMessage component instead.",
                    pathName: "x/y.js",
                    rule,
                    highlight: `<e0>Click me</e0>`,
                    lineNumber: 9,
                    charNumber: 62,
                    endLineNumber: 11,
                    endCharNumber: 16,
                })
            ];

            expect(result).toStrictEqual(expected);
        });

        test("no hard-coded strings used in file", () => {
            const ir = getJsxIr(
                "x/y.js",
                `
                import * as React from "react";
                import { Button, Link, FormattedMessage } from "components";

                export class CustomComponent extends React.Component {
                    render() {
                        return (
                            <>
                                <Button title={messages.myString}>
                                </Button>
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });

        test("skipping hard-coded text inside of a FormattedMessage component", () => {
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
                                        Link: (chunks) => <Link href="example.com">chunks</Link>,
                                    }}
                                />
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });

        test("skipping hard-coded text inside of a FormattedCompMessage component", () => {
            const ir = getJsxIr(
                "x/y.js",
                `
                import * as React from "react";
                import { Button, Link, FormattedMessage } from "components";

                export class CustomComponent extends React.Component {
                    render() {
                        return (
                            <>
                                <FormattedCompMessage id="some.id" description="Some message description">
                                    Some message with <Link href="example.com">link text</Link> and more text.
                                </FormattedCompMessage>
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });

        test("hard coded string in HTML attribute", () => {
            const ir = getJsxIr(
                "x/y.js",
                `
                import * as React from "react";
                import { Button, Link, FormattedCompMessage } from "components";

                export class CustomComponent extends React.Component {
                    render() {
                        return (
                            <>
                                <input type="button" placeholder = 'Your name' />
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            const expected = [
                new Result({
                    severity: "error",
                    description:
                        "Found unlocalizable hard-coded attribute value. Use intl.formatMessage() instead.",
                    pathName: "x/y.js",
                    rule,
                    highlight: `<e0>placeholder='Your name'</e0>`,
                    lineNumber: 9,
                    charNumber: 37,
                    endLineNumber: 9,
                    endCharNumber: 62,
                })
            ];

            expect(result).toStrictEqual(expected);
        });

        test("no hard coded string in HTML attribute", () => {
            const ir = getJsxIr(
                "x/y.js",
                `
                import * as React from "react";
                import { Button, Link, FormattedCompMessage } from "components";

                export class CustomComponent extends React.Component {
                    render() {
                        return (
                            <>
                                <input type="button" placeholder={intl.formatMessage(...messages.myMessage)} />
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });
    });

    describe("Flow", () => {
        const getFlowIr = (filePath, content) => {
            const parser = new FlowParser();
            parser.data = trimIndent(content);
            parser.path = filePath;
            const [ir] = parser.parse();
            return ir;
        };

        test("hard coded string in Flow", () => {
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
                            React.createElement(Button, { className: "some-button", type: "button" }, "Click me")
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            const expected = [
                new Result({
                    severity: "error",
                    description:
                        "Found unlocalizable hard-coded string. Use intl.formatMessage() instead.",
                    pathName: "x/y.js",
                    rule,
                    highlight: `<e0>Click me</e0>`,
                    lineNumber: 11,
                    charNumber: 86,
                    endLineNumber: 11,
                    endCharNumber: 96,
                })
            ];

            expect(result).toStrictEqual(expected);
        });

        test("no hard-coded strings used in file", () => {
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
                            React.createElement(span, {
                                className: "some-class"
                            })
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });

        test("skipping hard-coded text inside of a FormattedMessage component", () => {
            const ir = getFlowIr(
                "x/y.js",
                `
                import * as React from "react";
                import { Button, Link, FormattedCompMessage } from "components";

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
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });

        test("skipping hard-coded text inside of a FormattedCompMessage component", () => {
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
                            )
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });

        test("hard coded string in HTML attribute", () => {
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
                            React.createElement(input, { placeholder: "Your name", type: "button" })
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            const expected = [
                new Result({
                    severity: "error",
                    description:
                        "Found unlocalizable hard-coded attribute value. Use intl.formatMessage() instead.",
                    pathName: "x/y.js",
                    rule,
                    highlight: `<e0>placeholder: "Your name"</e0>`,
                    lineNumber: 11,
                    charNumber: 41,
                    endLineNumber: 11,
                    endCharNumber: 65,
                })
            ];

            expect(result).toStrictEqual(expected);
        });

        test("no hard coded string in HTML attribute", () => {
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
                            React.createElement(input, { placeholder: intl.formatMessage(messages.myMessage), type: "button" })
                        );
                    }
                }
                `
            );

            const rule = new NoHardCodedStrings();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });
    });
});
