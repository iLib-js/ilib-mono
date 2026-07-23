/*
 * XliffCompare.test.js - test the compare of Xliff objects.
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
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var fs = require("fs");
var path = require("path");
var XliffCompare = require("../lib/XliffCompare.js");

var FROM_XLIFF = "test/testfiles/xliff20/compare/from.xliff";
var TO_XLIFF = "test/testfiles/xliff20/compare/to.xliff";
var OUT_DIR = "test/testfiles/xliff20/compare/output";

function rmrf(p) {
    if (fs.existsSync(p)) {
        if (fs.lstatSync(p).isDirectory()) {
            fs.readdirSync(p).forEach(function(f) { rmrf(path.join(p, f)); });
            fs.rmdirSync(p);
        } else {
            fs.unlinkSync(p);
        }
    }
}

afterEach(function() {
    rmrf(OUT_DIR);
});

describe("XliffCompare", function() {
    test("XliffCompareNoParameter", function() {
        expect.assertions(1);
        var result = XliffCompare();
        expect(!result).toBeTruthy();
    });

    test("XliffCompareWriteNoParameter", function() {
        expect.assertions(1);
        var result = XliffCompare.write();
        expect(!result).toBeTruthy();
    });

    test("XliffCompare_missing_from_file_returns_undefined", function() {
        expect.assertions(1);
        var result = XliffCompare({
            xliffVersion: 2,
            infiles: ["nonexistent/path/from.xliff", TO_XLIFF]
        });
        expect(result).toBeUndefined();
    });

    test("XliffCompare_missing_to_file_returns_undefined", function() {
        expect.assertions(1);
        var result = XliffCompare({
            xliffVersion: 2,
            infiles: [FROM_XLIFF, "nonexistent/path/to.xliff"]
        });
        expect(result).toBeUndefined();
    });

    test("XliffCompare_modified", function() {
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            infiles: [FROM_XLIFF, TO_XLIFF],
            outfile: OUT_DIR
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        XliffCompare.write(result, settings);
        expect(result.modified.length).toBe(1);
        expect(fs.existsSync(path.join(OUT_DIR, "modified.xliff"))).toBeTruthy();
    });

    test("XliffCompare_modified_output_matches_expected", function() {
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            infiles: [FROM_XLIFF, TO_XLIFF],
            outfile: OUT_DIR
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        XliffCompare.write(result, settings);

        var actual = fs.readFileSync(path.join(OUT_DIR, "modified.xliff"), "utf-8");
        var expected =
        '<?xml version="1.0" encoding="utf-8"?>\n' +
        '<xliff version="2.0" srcLang="en-KR" trgLang="ko-KR" xmlns:l="http://ilib-js.com/loctool">\n' +
        '  <file original="app1" l:project="app1">\n' +
        '    <group id="group_1" name="javascript">\n' +
        '      <unit id="app1_1" name="String 1" type="res:string" l:datatype="javascript">\n' +
        '        <segment>\n' +
        '          <source>Hello</source>\n' +
        '          <target>안녕하세요</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>\n';

        expect(result.modified.length).toBe(1);
        expect(actual.trim()).toBe(expected.trim());
    });

    test("XliffCompare_added", function() {
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            infiles: [FROM_XLIFF, TO_XLIFF]
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        expect(result.added.length).toBe(1);
        expect(result.added[0].source).toBe("Yes");
    });

    test("XliffCompare_deleted", function() {
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            infiles: [FROM_XLIFF, TO_XLIFF]
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        expect(result.deleted.length).toBe(1);
        expect(result.deleted[0].source).toBe("Goodbye");
    });

    test("XliffCompare_unchanged_not_in_any_category", function() {
        expect.assertions(4);
        var settings = {
            xliffVersion: 2,
            infiles: [FROM_XLIFF, TO_XLIFF]
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        // "Thank you" is unchanged — should not appear in any category
        var allUnits = [...result.modified, ...result.added, ...result.deleted];
        var unchanged = allUnits.find(function(u) { return u.source === "Thank you"; });
        expect(unchanged).toBeUndefined();
        expect(result.modified.length).toBe(1);
        expect(result.added.length + result.deleted.length).toBe(2);
    });

    test("XliffCompare_write_creates_files", function() {
        expect.assertions(5);
        var settings = {
            xliffVersion: 2,
            infiles: [FROM_XLIFF, TO_XLIFF],
            outfile: OUT_DIR
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        var writeResult = XliffCompare.write(result, settings);
        expect(writeResult).toBe(true);
        expect(fs.existsSync(path.join(OUT_DIR, "modified.xliff"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUT_DIR, "added.xliff"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUT_DIR, "deleted.xliff"))).toBeTruthy();
    });

    test("XliffCompare_write_skips_empty_categories", function() {
        expect.assertions(4);
        // Use same file for both old and new → no differences
        var settings = {
            xliffVersion: 2,
            infiles: [FROM_XLIFF, FROM_XLIFF],
            outfile: OUT_DIR
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        XliffCompare.write(result, settings);
        expect(fs.existsSync(path.join(OUT_DIR, "modified.xliff"))).toBeFalsy();
        expect(fs.existsSync(path.join(OUT_DIR, "added.xliff"))).toBeFalsy();
        expect(fs.existsSync(path.join(OUT_DIR, "deleted.xliff"))).toBeFalsy();
    });

});
