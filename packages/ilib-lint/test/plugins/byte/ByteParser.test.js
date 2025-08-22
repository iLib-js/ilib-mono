/*
 * ByteParser.test.js - test the byte parser
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

import fs from "node:fs";
import { IntermediateRepresentation, SourceFile } from "ilib-lint-common";
import ByteParser from "../../../src/plugins/byte/ByteParser.js";

// ESM support
const jest = import.meta.jest;

describe("ByteParser", () => {
    describe("constructor", () => {
        test("creates ByteParser instance", () => {
            const parser = new ByteParser();
            expect(parser).toBeInstanceOf(ByteParser);
            expect(parser.getType()).toBe("byte");
        });

        test.each([
            {},
            {
                some: "option",
            },
            {
                options: {
                    some: "option",
                },
            },
        ])("accepts generic Parser constructor options at runtime as per convention", (options) => {
            const parser = new ByteParser(
                // @ts-expect-error: we're testing
                options
            );
            expect(parser).toBeInstanceOf(ByteParser);
            expect(parser.getType()).toBe("byte");
            expect(parser.getExtensions()).toEqual(["*"]);
            expect(parser.getName()).toBe("byte");
            expect(parser.getDescription()).toBe("A parser that treats the whole file as a sequence of bytes");
        });
    });

    describe("parse", () => {
        test.each(
            /** @type {const} */ ([
                "ascii",
                "utf8",
                "utf-8",
                "utf16le",
                "ucs2",
                "ucs-2",
                "base64",
                "base64url",
                "latin1",
                "binary",
                "hex",
            ])
        )("parses a %s encoded file", (encoding) => {
            const file = new SourceFile("/test/file/path");
            const content = Buffer.from("Hello, world!", encoding);
            jest.spyOn(fs, "readFileSync").mockReturnValueOnce(content);

            const parser = new ByteParser();
            const [result] = parser.parse(file);

            expect(result).toBeInstanceOf(IntermediateRepresentation);
            expect(result.type).toBe("byte");
            expect(result.ir).toBe(content);
            expect(result.sourceFile).toBe(file);
        });
    });
});
