/*
 * FileEncodingRule.test.js - test the file encoding rule
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
import FileEncodingRule from "../../../src/rules/byte/FileEncodingRule.js";

describe("FileEncodingRule", () => {
    describe("constructor", () => {
        test("creates FileEncodingRule instance", () => {
            const rule = new FileEncodingRule();
            expect(rule).toBeInstanceOf(FileEncodingRule);
            expect(rule.type).toBe("byte");
            expect(rule.name).toBe("file-encoding");
            expect(rule.description).toBe("Check that the file encoding is correct");
        });

        test("uses utf-8 as default encoding", () => {
            const rule = new FileEncodingRule();
            expect(rule.encoding).toBe("utf-8");
        });

        test.each(["ascii", "utf8", "utf-8", "ucs-2", "latin1"])("accepts encoding option", (encoding) => {
            const rule = new FileEncodingRule({ encoding });
            expect(rule).toBeInstanceOf(FileEncodingRule);
            expect(rule.encoding).toBe(encoding);
        });

        test("throws error if encoding option is invalid", () => {
            expect(() => new FileEncodingRule({ encoding: "invalid" })).toThrow();
        });
    });

    describe("match", () => {
        const fakePath = "/test/file/path";
        const fakeFile = /** @type {SourceFile} */ ({});

        test("does not produce a Result if encoding is correct", () => {
            const content = "Hello, world!";
            const bytes = Buffer.from(content, "utf-8");
            const ir = new IntermediateRepresentation({
                type: "byte",
                ir: bytes,
                sourceFile: fakeFile,
            });

            const rule = new FileEncodingRule({ encoding: "utf-8" });
            expect(rule.match({ ir, file: fakePath })).toBeUndefined();
        });

        test("produces an error Result if encoding is not correct", () => {
            // "Witaj, świecie!" encoded in ISO-8859-2
            const base64Content = "V2l0YWosILZ3aWVjaWUh";
            const bytes = Buffer.from(base64Content, "base64");

            const ir = new IntermediateRepresentation({
                type: "byte",
                ir: bytes,
                sourceFile: fakeFile,
            });

            const rule = new FileEncodingRule({ encoding: "utf-8" });
            const maybeResult = rule.match({ ir, file: fakePath });
            expect(maybeResult).toBeInstanceOf(Result);
            const result = /** @type {Result} */ (maybeResult);

            expect(result.rule).toBeInstanceOf(FileEncodingRule);
            expect(result.severity).toBe("error");
            expect(result.description).toBe("File cannot be decoded using the expected encoding: utf-8");
            expect(result.pathName).toBe(fakePath);
            expect(result.highlight).toBe("");
        });
    });
});
