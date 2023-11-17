/*
 * FlowParser.test.js - test the React JS + flow parser
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

import FlowParser from '../src/parsers/FlowParser.js';

import { Result, IntermediateRepresentation } from 'i18nlint-common';

describe("testFlowParser", () => {
    test("Flow parser empty constructor", () => {
        expect.assertions(1);

        const parser = new FlowParser();
        expect(parser).toBeTruthy();
    });

    test("Flow parser constructor with path", () => {
        expect.assertions(1);

        const parser = new FlowParser({
            filePath: "./test/testfiles/testfile.js"
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

        expect(parser.getName()).toBe("js");
    });

    test("Flow parser GetExtensions", () => {
        expect.assertions(2);

        const parser = new FlowParser();
        expect(parser).toBeTruthy();

        expect(parser.getExtensions()).toStrictEqual([ "js", "jsx" ]);
    });

    test("Flow parser simple", () => {
        expect.assertions(3);

        const parser = new FlowParser();
        expect(parser).toBeTruthy();

        const actual = parser.parseString(
            `// @flow
            import foo from '../src/index.js';
            export default function pathToFile(): string {
                return foo('x/y');
            }
            `, "x/y");
        expect(actual).toBeTruthy();
        const actualSimplified = JSON.parse(JSON.stringify(actual));

        expect(actualSimplified).toMatchSnapshot();
    });

    test("Flow parser more complex example", () => {
        expect.assertions(3);

        const parser = new FlowParser();
        expect(parser).toBeTruthy();

        const actual = parser.parseString(
            `// comment
            import foo from '../src/index.js';

            const str: string = "String";

            export default str;
            `, "x/y");
        expect(actual).toBeTruthy();
        const actualSimplified = JSON.parse(JSON.stringify(actual));

        expect(actualSimplified).toMatchSnapshot();
    });
});

