/*
 * XliffHeaderEncoding.test.js - test the XLIFF header encoding rule
 *
 * Copyright © 2025 JEDLSoft
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

import { IntermediateRepresentation, Result, SourceFile } from "ilib-lint-common";
import XliffHeaderEncoding from "../../../src/rules/string/XliffHeaderEncoding.js";
import dedent from "dedent";

// ESM support
const jest = import.meta.jest;

describe("XliffHeaderEncoding", () => {
    describe("constructor", () => {
        test("creates XliffHeaderEncoding instance", () => {
            const rule = new XliffHeaderEncoding();
            expect(rule).toBeInstanceOf(XliffHeaderEncoding);
            expect(rule.type).toBe("string");
            expect(rule.name).toBe("xliff-header-encoding");
            expect(rule.description).toBe("Check that the encoding specified in the XLIFF header is correct");
        });

        test("uses utf-8 as default encoding", () => {
            const rule = new XliffHeaderEncoding();
            expect(rule.encoding).toBe("utf-8");
        });

        test.each(["ascii", "utf8", "utf-8", "ucs-2", "latin1"])("accepts encoding option", (encoding) => {
            const rule = new XliffHeaderEncoding({ encoding });
            expect(rule).toBeInstanceOf(XliffHeaderEncoding);
            expect(rule.encoding).toBe(encoding);
        });
    });

    describe("match", () => {
        const fakePath = "/test/file/path";
        const fakeFile = /** @type {SourceFile} */ ({});

        test("does not produce a Result if encoding is correct", () => {
            const content = dedent`
                <?xml version="1.0" encoding="UTF-8"?>
                <xliff></xliff>
            `;

            const ir = new IntermediateRepresentation({
                type: "string",
                ir: content,
                sourceFile: fakeFile,
            });

            const rule = new XliffHeaderEncoding({ encoding: "utf-8" });
            expect(rule.match({ ir, file: fakePath })).toBeUndefined();
        });

        test.each([
            ["UTF-8", "utf-8"],
            ["utf-8", "UTF-8"],
            ["ISO-8859-2", "iso-8859-2"],
            ["iso-8859-2", "ISO-8859-2"],
        ])("normalizes the encoding case for comparison", (declared, expected) => {
            const content = dedent`
                <?xml version="1.0" encoding="${declared}"?>
                <xliff></xliff>
            `;

            const ir = new IntermediateRepresentation({
                type: "string",
                ir: content,
                sourceFile: fakeFile,
            });

            const rule = new XliffHeaderEncoding({ encoding: expected });
            expect(rule.match({ ir, file: fakePath })).toBeUndefined();
        });

        test("produces an error Result if encoding is not correct", () => {
            const content = dedent`
                <?xml version="1.0" encoding="ISO-8859-2"?>
                <xliff></xliff>
            `;

            const ir = new IntermediateRepresentation({
                type: "string",
                ir: content,
                sourceFile: fakeFile,
            });

            const rule = new XliffHeaderEncoding({ encoding: "utf-8" });
            const maybeResult = rule.match({ ir, file: fakePath });
            expect(maybeResult).toBeInstanceOf(Result);
            const result = /** @type {Result} */ (maybeResult);

            expect(result.rule).toBeInstanceOf(XliffHeaderEncoding);
            expect(result.severity).toBe("error");
            expect(result.description).toBe("The encoding specified in the XLIFF header is incorrect");
            expect(result.pathName).toBe(fakePath);
            expect(result.highlight).toBe("Expected utf-8, found iso-8859-2");
        });

        test("does not produce a Result if the file is empty", () => {
            const ir = new IntermediateRepresentation({
                type: "string",
                ir: "",
                sourceFile: fakeFile,
            });

            const rule = new XliffHeaderEncoding();
            const maybeResult = rule.match({ ir, file: fakePath });
            expect(maybeResult).toBeUndefined();
        });

        test("does not produce a Result if the file does not contain an XML header", () => {
            const content = dedent`
                <xliff></xliff>
            `;

            const ir = new IntermediateRepresentation({
                type: "string",
                ir: content,
                sourceFile: fakeFile,
            });

            const rule = new XliffHeaderEncoding();
            const maybeResult = rule.match({ ir, file: fakePath });
            expect(maybeResult).toBeUndefined();
        });

        test("throws an error if the intermediate representation type is not 'string'", () => {
            const ir = new IntermediateRepresentation({
                type: "byte",
                ir: Buffer.from([]),
                sourceFile: fakeFile,
            });

            const rule = new XliffHeaderEncoding();
            expect(() => rule.match({ ir, file: fakePath })).toThrow();
        });

        test("throws an error if the intermediate representation is not a string", () => {
            const ir = new IntermediateRepresentation({
                type: "string",
                ir: 123,
                sourceFile: fakeFile,
            });

            const rule = new XliffHeaderEncoding();
            expect(() => rule.match({ ir, file: fakePath })).toThrow();
        });
    });
});
