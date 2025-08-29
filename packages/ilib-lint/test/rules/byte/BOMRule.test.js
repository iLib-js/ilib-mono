/*
 * BOMRule.test.js - test the UTF-8 BOM rule
 *
 * Copyright © 2025 Box, Inc.
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
import BOMRule from "../../../src/rules/byte/BOMRule.js";
import ByteFix from "../../../src/plugins/byte/ByteFix.js";
import PositionalFixCommand from "../../../src/plugins/positional/PositionalFixCommand.js";

// ESM support
const jest = import.meta.jest;

const UTF8_BOM = Buffer.from([0xef, 0xbb, 0xbf]);

describe("BOMRule", () => {
    describe("constructor", () => {
        test("creates BOMRule instance", () => {
            const rule = new BOMRule();
            expect(rule).toBeInstanceOf(BOMRule);
            expect(rule.type).toBe("byte");
            expect(rule.name).toBe("utf-bom");
            expect(rule.description).toBe("Check that the file does not start with a UTF-8 BOM");
        });
    });

    describe("match", () => {
        const fakePath = "/test/file/path";
        const fakeFile = /** @type {SourceFile} */ ({});

        test("does not produce a Result if the file does not start with a UTF-8 BOM", () => {
            const content = "Hello, world!";
            const bytes = Buffer.from(content, "utf-8");
            const ir = new IntermediateRepresentation({
                type: "byte",
                ir: bytes,
                sourceFile: fakeFile,
            });

            const rule = new BOMRule();
            expect(rule.match({ ir, file: fakePath })).toBeUndefined();
        });

        test("produces an error Result if the file starts with a UTF-8 BOM", () => {
            const bytes = Buffer.concat([UTF8_BOM, Buffer.from("Hello, world!")]);

            const ir = new IntermediateRepresentation({
                type: "byte",
                ir: bytes,
                sourceFile: fakeFile,
            });

            const rule = new BOMRule();
            const maybeResult = rule.match({ ir, file: fakePath });
            expect(maybeResult).toBeInstanceOf(Result);
            const result = /** @type {Result} */ (maybeResult);

            expect(result.rule).toBeInstanceOf(BOMRule);
            expect(result.severity).toBe("error");
            expect(result.description).toBe("File must not start with a UTF-8 BOM");
            expect(result.pathName).toBe(fakePath);
            expect(result.highlight).toBe("");

            // fix should remove the initial 3 bytes of the file, which is the UTF-8 BOM
            const maybeFix = result.fix;
            expect(maybeFix).toBeInstanceOf(ByteFix);
            const fix = /** @type {ByteFix} */ (maybeFix);
            expect(fix.commands).toHaveLength(1);
            expect(fix.commands[0]).toBeInstanceOf(PositionalFixCommand);
            expect(fix.commands[0].position).toBe(0);
            expect(fix.commands[0].deleteCount).toBe(3);
            expect(fix.commands[0].insertContent).toBe(undefined);
        });

        test("does not produce a Result if the file is empty", () => {
            const ir = new IntermediateRepresentation({
                type: "byte",
                ir: Buffer.from([]),
                sourceFile: fakeFile,
            });

            const rule = new BOMRule();
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

            const rule = new BOMRule();
            expect(() => rule.match({ ir, file: fakePath })).toThrow();
        });
    });
});
