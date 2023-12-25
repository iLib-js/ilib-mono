/*
 * NoNestedMessages.test.js
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
import JSXParser from "../../src/parsers/JSXParser.js";
import NoNestedMessages from "../../src/rules/NoNestedMessages.js";
import { trimIndent } from "../utils.js";

/** @typedef {import("i18nlint-common").IntermediateRepresentation} IntermediateRepresentation */

describe("No Nested FormattedMessage components rule", () => {
    describe("Flow JSX", () => {
        const getFlowJsxIr = (filePath, content) => {
            const parser = new FlowParser();
            parser.data = trimIndent(content);
            parser.path = filePath;
            const [ir] = parser.parse();
            return ir;
        };

        test("Nested FormattedMessage inside of another", () => {
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
                                <FormattedMessage
                                    id="unique.id"
                                    defaultMessage="You agree to the {termsAndConditions} by using this product."
                                    description="translator's note"
                                    values={{
                                        termsAndConditions:
                                            <a href="terms.html">
                                                <FormattedMessage
                                                    id="another.id"
                                                    defaultMessage="terms and conditions"
                                                    description="terms and conditions"
                                                />
                                            </a>
                                    }}
                                />
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoNestedMessages();

            const result = rule.match({ ir });

            const expected = [
                new Result({
                    severity: "error",
                    description:
                        "Found a FormattedMessage component inside of another FormattedMessage component. This indicates a broken string.",
                    pathName: "x/y.js",
                    rule,
                    highlight: `<e0><FormattedMessage id="another.id" defaultMessage="terms and conditions" description="terms and conditions" /></e0>`,
                    lineNumber: 17,
                    charNumber: 32,
                    endLineNumber: 21,
                    endCharNumber: 34,
                })
            ];

            expect(result).toStrictEqual(expected);
        });

        test("Nested FormattedMessage inside of another, using ids instead of the string directly in the code", () => {
            const ir = getFlowJsxIr(
                "x/y.js",
                `
                // @flow
                import * as React from "react";
                import { Button, Link, FormattedCompMessage } from "components";
                import messages from './messages.js';

                export class CustomComponent extends React.Component {
                    render() {
                        return (
                            <>
                                <FormattedMessage {...messages.unique_id} 
                                    values={{
                                        termsAndConditions:
                                            <a href="terms.html">
                                                <FormattedMessage {...messages.terms.and.conditions} />
                                            </a>
                                    }}
                                />
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoNestedMessages();

            const result = rule.match({ ir });

            const expected = [
                new Result({
                    severity: "error",
                    description:
                        "Found a FormattedMessage component inside of another FormattedMessage component. This indicates a broken string.",
                    pathName: "x/y.js",
                    rule,
                    highlight: `<e0><FormattedMessage {...messages.terms.and.conditions} /></e0>`,
                    lineNumber: 15,
                    charNumber: 32,
                    endLineNumber: 15,
                    endCharNumber: 87,
                })
            ];

            expect(result).toStrictEqual(expected);
        });

        test("No nested FormattedMessage inside of another", () => {
            // this is the recommended rich text way of doing it
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
                                <FormattedMessage
                                    id="unique.id"
                                    defaultMessage="You agree to the <a>terms and conditions</a> by using this product."
                                    description="translator's note"
                                    values={{
                                        termsAndConditions: chunks => <a href="terms.html">{...chunks}</a>
                                    }}
                                />
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoNestedMessages();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });

        test("No FormattedMessage at all", () => {
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
                                <span>You agree to the <a href="terms.html">terms and conditions</a> by using this product.</span>
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoNestedMessages();

            const result = rule.match({ ir });

            expect(result.length).toEqual(0);
        });

        test("Nested intl.formatMessage inside of a FormattedMessage", () => {
            const ir = getFlowJsxIr(
                "x/y.js",
                `
                // @flow
                import * as React from "react";
                import { Button, Link, FormattedCompMessage } from "components";
                import messages from './messages.js';

                export class CustomComponent extends React.Component {
                    render() {
                        return (
                            <>
                                <FormattedMessage
                                    id="unique.id"
                                    defaultMessage="You agree to the {termsAndConditions} by using this product."
                                    description="translator's note"
                                    values={{
                                        termsAndConditions:
                                            <a href="terms.html">
                                                {intl.formatMessage(messages.unique_id)}
                                            </a>
                                    }}
                                />
                            </>
                        );
                    }
                }
                `
            );

            const rule = new NoNestedMessages();

            const result = rule.match({ ir });

            const expected = [
                new Result({
                    severity: "error",
                    description:
                        "Found a call to intl.formatMessage() inside of a FormattedMessage component. This indicates a broken string.",
                    pathName: "x/y.js",
                    rule,
                    highlight: `<e0>intl.formatMessage(messages.unique_id)</e0>`,
                    lineNumber: 18,
                    charNumber: 33,
                    endLineNumber: 18,
                    endCharNumber: 71,
                })
            ];

            expect(result).toStrictEqual(expected);
        });

    });

});
