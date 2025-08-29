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
import { CharmapFactory } from "ilib-es6";
import { TextDecoder } from "util";

import FileEncodingRule from "../../../src/rules/byte/FileEncodingRule.js";

// ESM support
const jest = import.meta.jest;

/**
 * @param {string} str
 * @param {string} encoding
 * @returns {Buffer}
 */
const encodeString = (str, encoding) => {
    return Buffer.from(new CharmapFactory({ name: encoding }).mapToNative(str));
};

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
            const bytes = encodeString("Ħéłļö, wørľð!", "utf-8");
            const ir = new IntermediateRepresentation({
                type: "byte",
                ir: bytes,
                sourceFile: fakeFile,
            });

            const rule = new FileEncodingRule({ encoding: "utf-8" });
            expect(rule.match({ ir, file: fakePath })).toBeUndefined();
        });

        test("produces an error Result if encoding is not correct", () => {
            const bytes = encodeString("Witaj, świecie!", "iso-8859-2");

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

        test("does not produce a Result if the file is empty", () => {
            const ir = new IntermediateRepresentation({
                type: "byte",
                ir: Buffer.from([]),
                sourceFile: fakeFile,
            });

            const rule = new FileEncodingRule();
            const maybeResult = rule.match({ ir, file: fakePath });
            expect(maybeResult).toBeUndefined();
        });

        test("throws an error if the intermediate representation type is not 'byte'", () => {
            const ir = new IntermediateRepresentation({
                type: "string",
                ir: "not a Buffer",
                sourceFile: fakeFile,
            });
        });

        test("throws an error if the intermediate representation is not a Buffer", () => {
            const ir = new IntermediateRepresentation({
                type: "byte",
                ir: "not a Buffer",
                sourceFile: fakeFile,
            });

            const rule = new FileEncodingRule();
            expect(() => rule.match({ ir, file: fakePath })).toThrow();
        });

        test("rethrows an error if the decoding fails for unrelated reasons", () => {
            const ir = new IntermediateRepresentation({
                type: "byte",
                ir: Buffer.from([0x00, 0x01, 0x02]),
                sourceFile: fakeFile,
            });

            const decodeSpy = jest.spyOn(TextDecoder.prototype, "decode");
            decodeSpy.mockImplementationOnce(() => {
                throw new Error("Unexpected error");
            });

            const rule = new FileEncodingRule();
            expect(() => rule.match({ ir, file: fakePath })).toThrow();

            decodeSpy.mockRestore();
        });
    });
});
