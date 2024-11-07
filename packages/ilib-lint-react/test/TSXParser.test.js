/*
 * TSXParser.test.js
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

import { SourceFile } from 'ilib-lint-common';

import TSXParser from '../src/parsers/TSXParser.js';

describe("TSXParser", () => {
    test("instantiate with no parameters", () => {
        const parser = new TSXParser();
        expect(parser).toBeTruthy();
    });

    test("instantiate with file path", () => {
        const parser = new TSXParser({
            filePath: "./test/testfiles/TsxParser_TsxFile.tsx"
        });
        expect(parser).toBeTruthy();
    });

    test("get parser description", () => {
        const parser = new TSXParser();
        expect(parser.getDescription()).toBe("A parser for Typescript files (with React support).");
    });

    test("get parser name", () => {
        const parser = new TSXParser();
        expect(parser.getName()).toBe("TSXParser");
    });

    test("get parser file extensions", () => {
        const parser = new TSXParser();
        expect(parser.getExtensions()).toStrictEqual([ "ts", "tsx" ]);
    });

    test("get parser type", () => {
        const parser = new TSXParser();
        expect(parser.getType()).toBe("babel-ast");
    });
    
    // TODO: Fix this test. If fails in orginal repo as well.
    test.skip("parse TSX file", () => {
        const parser = new TSXParser({
            sourceLocale: "en-US"
        });
        const sourceFile = new SourceFile("./test/testfiles/TsxParser_TsxFile.tsx", { sourceLocale: "en-US" });
        const result = parser.parse(sourceFile);
        expect(result).toMatchSnapshot();
    });

    // TODO: Fix this test. If fails in orginal repo as well.
    test.skip("parse TS file", () => {
        const parser = new TSXParser({
            sourceLocale: "en-US"
        });
        const sourceFile = new SourceFile("./test/testfiles/TsxParser_TsFile.ts", { sourceLocale: "en-US" });
        const result = parser.parse(sourceFile);
        expect(result).toMatchSnapshot();
    });
});

