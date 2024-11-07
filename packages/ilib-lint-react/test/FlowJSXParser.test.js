/*
 * FlowParser.test.js - test the React JSX + flow parser
 *
 * Copyright © 2023-2024 Box, Inc.
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
import { ResourceString } from 'ilib-tools-common';

// the flow parser can parse JS or JSX, so we don't need a separate
// parser for JSX
import FlowParser from '../src/parsers/FlowParser.js';

import { Result, SourceFile } from 'ilib-lint-common';

describe("test the flow parser with jsx code", () => {
    test("empty flow parser constructor", () => {
        expect.assertions(1);

        const parser = new FlowParser();
        expect(parser).toBeTruthy();
    });

    test("Flow parser constructor with path", () => {
        expect.assertions(1);

        const parser = new FlowParser({
            filePath: "./test/testfiles/testfile.jsx"
        });
        expect(parser).toBeTruthy();
    });

    test("Flow parser GetDescription", () => {
        expect.assertions(2);

        const parser = new FlowParser();
        expect(parser).toBeTruthy();

        expect(parser.getDescription()).toBe("A parser for JS and JSX files with flow type definitions.");
    });

    test("Flow parser GetName", () => {
        expect.assertions(2);

        const parser = new FlowParser();
        expect(parser).toBeTruthy();

        expect(parser.getName()).toBe("FlowParser");
    });

    test("Flow parser GetExtensions", () => {
        expect.assertions(2);

        const parser = new FlowParser();
        expect(parser).toBeTruthy();

        expect(parser.getExtensions()).toStrictEqual([ "js", "jsx" ]);
    });

    xit("Flow parser simple", () => {
        expect.assertions(3);

        const parser = new FlowParser();
        expect(parser).toBeTruthy();

        const sourceFile = new SourceFile("x/y", {});
        const actual = parser.parseString(
            `// @flow
            import foo from '../src/index.js';
            export default function pathToFile(): string {
                return foo('x/y');
            }
            `, sourceFile);
        expect(actual).toBeTruthy();
        const actualSimplified = JSON.parse(JSON.stringify(actual));

        expect(actualSimplified).toMatchSnapshot();
    });

    xit("Flow parser more complex", () => {
        expect.assertions(3);

        const parser = new FlowParser();
        expect(parser).toBeTruthy();

        const sourceFile = new SourceFile("x/y", {});
        const actual = parser.parseString(
            `// @flow

            import foo from '../src/index.js';

            const str: React$Element<'b'> = <b>String</b>;
            `, sourceFile);
        expect(actual).toBeTruthy();
        const actualSimplified = JSON.parse(JSON.stringify(actual));

        expect(actualSimplified).toMatchSnapshot();
    });

    xit("JSX with a high-order component in it", () => {
        expect.assertions(3);

        const parser = new FlowParser();
        expect(parser).toBeTruthy();

        const sourceFile = new SourceFile("x/y", {});
        const actual = parser.parseString(
            `// @flow

            import * as React from 'react';

            type DisplayTitleProps = {
                title: string,
            };

            const DisplayTitle = ({ title }: DisplayTitleProps) => {
                return <h1>{title}</h1>;
            };

            type WithTitleProps = {
                title: string,
            };

            const withTitle = <Props: {}>(
                WrappedComponent: React.ComponentType<Props>,
                title: string
            ): React.ComponentType<Props & WithTitleProps> => {
                return class WithTitle extends React.Component<Props & WithTitleProps> {
                    render() {
                        // Spread the existing props and add the "title" prop
                        return <WrappedComponent {...this.props} title={title} />;
                    }
                };
            };

            const DisplayTitleWithEnhancement = withTitle(DisplayTitle, 'My Enhanced Title');

            const App = () => {
                return <DisplayTitleWithEnhancement />;
            };

            export default App;`, sourceFile);
        expect(actual).toBeTruthy();
        const actualSimplified = JSON.parse(JSON.stringify(actual));

        expect(actualSimplified).toMatchSnapshot();
    });
});

