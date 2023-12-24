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
    });
});
