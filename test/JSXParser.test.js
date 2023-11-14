/*
 * JSXParser.test.js - test the React JSX parser
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
import { ResourceString } from 'ilib-tools-common';

import JSXParser from '../src/parsers/JSXParser.js';

import { Result } from 'i18nlint-common';

describe("testJSXParser", () => {
    test("JSXParserConstructorEmpty", () => {
        expect.assertions(1);

        const parser = new JSXParser();
        expect(parser).toBeTruthy();
    });

    test("JSXParserConstructorPath", () => {
        expect.assertions(1);

        const parser = new JSXParser({
            filePath: "./test/testfiles/testfile.jsx"
        });
        expect(parser).toBeTruthy();
    });

    test("JSXParserGetDescription", () => {
        expect.assertions(2);

        const parser = new JSXParser();
        expect(parser).toBeTruthy();

        expect(parser.getDescription()).toBe("A parser for React JSX files.");
    });

    test("JSXParserGetName", () => {
        expect.assertions(2);

        const parser = new JSXParser();
        expect(parser).toBeTruthy();

        expect(parser.getName()).toBe("jsx");
    });

    test("JSXParserGetExtensions", () => {
        expect.assertions(2);

        const parser = new JSXParser();
        expect(parser).toBeTruthy();

        expect(parser.getExtensions()).toStrictEqual([ "jsx" ]);
    });

    test("JSXParserSimple", () => {
        expect.assertions(3);

        const parser = new JSXParser();
        expect(parser).toBeTruthy();

        const actual = parser.parseString("import foo from '../src/index.js';", "x/y");
        expect(actual).toBeTruthy();
        const actualSimplified = JSON.parse(JSON.stringify(actual));

        expect(actualSimplified).toMatchSnapshot();
    });

    test("JSXParserMoreComplex", () => {
        expect.assertions(3);

        const parser = new JSXParser();
        expect(parser).toBeTruthy();

        const actual = parser.parseString(
            `// comment
            import foo from '../src/index.js';

            const str = <b>String</b>;
            `, "x/y");
        expect(actual).toBeTruthy();
        const actualSimplified = JSON.parse(JSON.stringify(actual));

        expect(actualSimplified).toMatchSnapshot();
    });
    
    test("JSX with a high-order component in it", () => {
        expect.assertions(3);

        const parser = new JSXParser();
        expect(parser).toBeTruthy();

        const actual = parser.parseString(
            `import React, { Component } from 'react';

            // A Higher-Order Component (HOC) that adds a "title" prop to the wrapped component
            const withTitle = (WrappedComponent, title) => {
              return class WithTitle extends Component {
                render() {
                  return <WrappedComponent {...this.props} title={title} />;
                }
              };
            };
            
            // A component that displays a title
            const DisplayTitle = ({ title }) => {
              return <h1>{title}</h1>;
            };
            
            // Using the HOC to create a new component
            const DisplayTitleWithEnhancement = withTitle(DisplayTitle, 'My Enhanced Title');
            
            // App component using the enhanced component
            const App = () => {
              return <DisplayTitleWithEnhancement />;
            };
            
            export default App;`, "x/y");
        expect(actual).toBeTruthy();
        const actualSimplified = JSON.parse(JSON.stringify(actual));

        expect(actualSimplified).toMatchSnapshot();
    });
});

