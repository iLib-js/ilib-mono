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

var PREVIOUS_XLIFF = "test/testfiles/xliff20/compare/previous.xliff";
var CURRENT_XLIFF = "test/testfiles/xliff20/compare/current.xliff";
var WEBOS_PREVIOUS_XLIFF = "test/testfiles/xliff20/compare/webos_previous.xliff";
var WEBOS_CURRENT_XLIFF = "test/testfiles/xliff20/compare/webos_current.xliff";
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

describe("xliffcompare", function() {
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

    test("XliffCompare_missing_previous_file_returns_undefined", function() {
        expect.assertions(1);
        var result = XliffCompare({
            xliffVersion: 2,
            infiles: ["nonexistent/path/previous.xliff", CURRENT_XLIFF]
        });
        expect(result).toBeUndefined();
    });

    test("XliffCompare_missing_current_file_returns_undefined", function() {
        expect.assertions(1);
        var result = XliffCompare({
            xliffVersion: 2,
            infiles: [PREVIOUS_XLIFF, "nonexistent/path/current.xliff"]
        });
        expect(result).toBeUndefined();
    });

    test("XliffCompare_modified", function() {
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            infiles: [PREVIOUS_XLIFF, CURRENT_XLIFF]
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        expect(result.modified.length).toBe(1);
        expect(result.modified[0].source).toBe("Hello");
    });

    test("XliffCompare_modified_target_is_new_value", function() {
        expect.assertions(2);
        var settings = {
            xliffVersion: 2,
            infiles: [PREVIOUS_XLIFF, CURRENT_XLIFF]
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        expect(result.modified[0].target).toBe("안녕하세요");
    });

    test("XliffCompare_added", function() {
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            infiles: [PREVIOUS_XLIFF, CURRENT_XLIFF]
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
            infiles: [PREVIOUS_XLIFF, CURRENT_XLIFF]
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
            infiles: [PREVIOUS_XLIFF, CURRENT_XLIFF]
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
            infiles: [PREVIOUS_XLIFF, CURRENT_XLIFF],
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
            infiles: [PREVIOUS_XLIFF, PREVIOUS_XLIFF],
            outfile: OUT_DIR
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        XliffCompare.write(result, settings);
        expect(fs.existsSync(path.join(OUT_DIR, "modified.xliff"))).toBeFalsy();
        expect(fs.existsSync(path.join(OUT_DIR, "added.xliff"))).toBeFalsy();
        expect(fs.existsSync(path.join(OUT_DIR, "deleted.xliff"))).toBeFalsy();
    });

    // webOS style (-2 --xliffStyle webOS)

    test("XliffCompare_webOS_modified", function() {
        expect.assertions(4);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_PREVIOUS_XLIFF, WEBOS_CURRENT_XLIFF]
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        expect(result.modified.length).toBe(2);
        var helloUnit = result.modified.find(function(u) { return u.source === "Hello"; });
        expect(helloUnit).toBeDefined();
        expect(helloUnit.target).toBe("안녕하세요");
    });

    test("XliffCompare_webOS_added", function() {
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_PREVIOUS_XLIFF, WEBOS_CURRENT_XLIFF]
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        expect(result.added.length).toBe(1);
        expect(result.added[0].source).toBe("Yes");
    });

    test("XliffCompare_webOS_deleted", function() {
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_PREVIOUS_XLIFF, WEBOS_CURRENT_XLIFF]
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        expect(result.deleted.length).toBe(1);
        expect(result.deleted[0].source).toBe("Goodbye");
    });

    test("XliffCompare_webOS_metadata_change_categorized_as_modified", function() {
        expect.assertions(5);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_PREVIOUS_XLIFF, WEBOS_CURRENT_XLIFF]
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();

        var metadataUnit = result.modified.find(function(u) {
            return u.source === "%deviceType% {arg1}.";
        });

        expect(metadataUnit).toBeDefined();
        expect(result.modified.length).toBe(2);
        expect(result.added.length).toBe(1);
        expect(result.deleted.length).toBe(1);
    });

    test("XliffCompare_webOS_write_creates_files", function() {
        expect.assertions(4);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_PREVIOUS_XLIFF, WEBOS_CURRENT_XLIFF],
            outfile: OUT_DIR
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        XliffCompare.write(result, settings);
        expect(fs.existsSync(path.join(OUT_DIR, "modified.xliff"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUT_DIR, "added.xliff"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUT_DIR, "deleted.xliff"))).toBeTruthy();
    });

    test("XliffCompare_webOS_write_skips_empty_categories", function() {
        expect.assertions(4);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_PREVIOUS_XLIFF, WEBOS_PREVIOUS_XLIFF],
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
