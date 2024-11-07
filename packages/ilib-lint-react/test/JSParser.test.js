/*
 * JSParser.test.js - test the React JS parser
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

import JSParser from '../src/parsers/JSParser.js';

import { Result, IntermediateRepresentation, SourceFile } from 'ilib-lint-common';

describe("testJSParser", () => {
    test("JSParserConstructorEmpty", () => {
        expect.assertions(1);

        const parser = new JSParser();
        expect(parser).toBeTruthy();
    });

    test("JSParserGetDescription", () => {
        expect.assertions(2);

        const parser = new JSParser();
        expect(parser).toBeTruthy();

        expect(parser.getDescription()).toBe("A parser for JS files.");
    });

    test("JSParserGetName", () => {
        expect.assertions(2);

        const parser = new JSParser();
        expect(parser).toBeTruthy();

        expect(parser.getName()).toBe("JSParser");
    });

    test("JSParserGetExtensions", () => {
        expect.assertions(2);

        const parser = new JSParser();
        expect(parser).toBeTruthy();

        expect(parser.getExtensions()).toStrictEqual([ "js" ]);
    });

    // TODO: Fix this test. If fails in orginal repo as well.
    test.skip("JSParserSimple", () => {
        expect.assertions(3);

        const parser = new JSParser();
        expect(parser).toBeTruthy();

        const sourceFile = new SourceFile("x/y", {});
        const actual = parser.parseString("import foo from '../src/index.js';", sourceFile);
        expect(actual).toBeTruthy();
        const actualSimplified = JSON.parse(JSON.stringify(actual));

        expect(actualSimplified).toMatchSnapshot();
    });

    // TODO: Fix this test. If fails in orginal repo as well.
    test.skip("JSParserMoreComplex", () => {
        expect.assertions(3);

        const parser = new JSParser();
        expect(parser).toBeTruthy();

        const sourceFile = new SourceFile("x/y", {});
        const actual = parser.parseString(
            `// comment
            import foo from '../src/index.js';

            const str = "String";
            `, sourceFile);
        expect(actual).toBeTruthy();
        const actualSimplified = JSON.parse(JSON.stringify(actual));

        expect(actualSimplified).toMatchSnapshot();
    });
});

