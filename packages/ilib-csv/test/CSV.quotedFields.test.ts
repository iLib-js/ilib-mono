/*
 * CSV.quotedFields.test.ts - quoted fields with newlines and whitespace
 *
 * Copyright © 2026 JEDLSoft
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
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CSV } from "../src/index";

/*
 * These tests lock RFC 4180-style quoted fields:
 * - LF, CRLF, and a blank line inside quotes stay one field (not extra records)
 * - escaped quotes plus a line break stay one field
 * - a multi-line field does not shift the following record
 * - TSV (tab separator) behaves the same for multi-line quoted fields
 * - a trailing newline does not invent an empty record
 * - quoted fields keep leading/trailing spaces; unquoted fields are still trimmed
 * - inner whitespace in an unquoted field is kept; only the ends are trimmed
 * - inner whitespace in a quoted field is kept, including padding inside the quotes
 * - unquoted whitespace around a quoted field is trimmed; padding inside quotes is not
 * - generate() then parse() preserves newline, quote, separator, and spaces
 */

describe("quoted fields", () => {
    describe("newlines inside quotes", () => {
        test("parse quoted field with LF", () => {
            const records = new CSV().parse('A,B\nx,"line1\nline2"\n');
            expect(records).toHaveLength(1);
            expect(records[0]).toEqual({ A: "x", B: "line1\nline2" });
        });

        test("parse quoted field with CRLF", () => {
            const records = new CSV().parse('A,B\r\nx,"line1\r\nline2"\r\n');
            expect(records).toHaveLength(1);
            expect(records[0]).toEqual({ A: "x", B: "line1\r\nline2" });
        });

        test("parse quoted field with a blank line inside", () => {
            const records = new CSV().parse('A,B\nx,"para1\n\npara2"\n');
            expect(records).toHaveLength(1);
            expect(records[0]).toEqual({ A: "x", B: "para1\n\npara2" });
        });

        test("parse quoted field with escaped quotes and a line break", () => {
            const records = new CSV().parse(
                'A,B\nx,"has ""quotes""\nand a break"\n'
            );
            expect(records).toHaveLength(1);
            expect(records[0]).toEqual({
                A: "x",
                B: 'has "quotes"\nand a break',
            });
        });

        test("parse multi-line field followed by another record", () => {
            const records = new CSV().parse(
                'A,B\nx,"line1\nline2"\ny,z\n'
            );
            expect(records).toHaveLength(2);
            expect(records[0]).toEqual({ A: "x", B: "line1\nline2" });
            expect(records[1]).toEqual({ A: "y", B: "z" });
        });

        test("parse multi-line field in TSV mode", () => {
            const records = new CSV({ columnSeparator: "\t" }).parse(
                'A\tB\nx\t"line1\nline2"\n'
            );
            expect(records).toHaveLength(1);
            expect(records[0]).toEqual({ A: "x", B: "line1\nline2" });
        });

        test("trailing newline does not produce an extra record", () => {
            const records = new CSV().parse("A,B\nx,y\n");
            expect(records).toHaveLength(1);
            expect(records[0]).toEqual({ A: "x", B: "y" });
        });
    });

    describe("quoted whitespace", () => {
        test("does not trim a quoted field", () => {
            const csv = new CSV({ columns: ["A", "B"] });
            const text = csv.generate([{ A: "x", B: "  padded  " }]);
            expect(text).toContain('"  padded  "');
            expect(new CSV().parse(text)).toEqual([
                { A: "x", B: "  padded  " },
            ]);
        });

        test("still trims unquoted fields", () => {
            const records = new CSV().parse("A,B\n1, foo\n");
            expect(records[0].B).toBe("foo");
        });

        test("preserves inner spaces in an unquoted field", () => {
            const records = new CSV().parse(
                "A,B,C\nfield1,  field2      field2 continued     ,field3\n"
            );
            expect(records).toHaveLength(1);
            expect(records[0]).toEqual({
                A: "field1",
                B: "field2      field2 continued",
                C: "field3",
            });
        });

        test("preserves inner spaces in a quoted field", () => {
            const records = new CSV().parse(
                'A,B,C\nfield1,  "field2      field2 continued"     ,field3\n'
            );
            expect(records).toHaveLength(1);
            expect(records[0]).toEqual({
                A: "field1",
                B: "field2      field2 continued",
                C: "field3",
            });
        });

        test("preserves padding and inner spaces inside quotes", () => {
            const records = new CSV().parse(
                'A,B,C\nfield1,  "  field2      field2 continued     "     ,field3\n'
            );
            expect(records).toHaveLength(1);
            expect(records[0]).toEqual({
                A: "field1",
                B: "  field2      field2 continued     ",
                C: "field3",
            });
        });

        test("trims unquoted spaces around a quoted field", () => {
            const records = new CSV().parse(
                "id,name,description\n" +
                    '26234345,     "name with quotes"  ,     "description with quotes"   \n'
            );
            expect(records).toHaveLength(1);
            expect(records[0]).toEqual({
                id: "26234345",
                name: "name with quotes",
                description: "description with quotes",
            });
        });

        test("trims unquoted spaces around quoted fields that contain a comma", () => {
            const records = new CSV().parse(
                "id,name,description\n" +
                    '2345642, "quoted name with, comma in it" , "description with, comma in it"\n'
            );
            expect(records).toHaveLength(1);
            expect(records[0]).toEqual({
                id: "2345642",
                name: "quoted name with, comma in it",
                description: "description with, comma in it",
            });
        });

        test("trims unquoted spaces around quoted fields in TSV", () => {
            const records = new CSV({ columnSeparator: "\t" }).parse(
                "id\tname\tdescription\n" +
                    '26234345\t     "name with quotes"  \t     "description with quotes"   \n'
            );
            expect(records).toHaveLength(1);
            expect(records[0]).toEqual({
                id: "26234345",
                name: "name with quotes",
                description: "description with quotes",
            });
        });

        test("trims unquoted spaces after a quoted TSV field that contains a tab", () => {
            const records = new CSV({ columnSeparator: "\t" }).parse(
                "id\tname\tdescription\n" +
                    '2345642\t "quoted name with\t tab in it" \t "description with\t tab in it"\n'
            );
            expect(records).toHaveLength(1);
            expect(records[0]).toEqual({
                id: "2345642",
                name: "quoted name with\t tab in it",
                description: "description with\t tab in it",
            });
        });

        test("trims unquoted spaces around quoted fields with CRLF rows", () => {
            const records = new CSV().parse(
                "id,name,description\r\n" +
                    '2345642, "quoted name with, comma in it" , "description with, comma in it"\r\n'
            );
            expect(records).toHaveLength(1);
            expect(records[0]).toEqual({
                id: "2345642",
                name: "quoted name with, comma in it",
                description: "description with, comma in it",
            });
        });
    });

    describe("round-trip", () => {
        test("preserves newline, quote, separator, and surrounding spaces", () => {
            const csv = new CSV({ columns: ["A", "B"] });
            const records = [
                {
                    A: "x",
                    B: '  say "hi",\nand "bye"  ',
                },
            ];
            const text = csv.generate(records);
            expect(new CSV().parse(text)).toEqual(records);
        });
    });
});
