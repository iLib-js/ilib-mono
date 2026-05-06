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

var OLD_XLIFF = "test/testfiles/xliff20/compare/old.xliff";
var NEW_XLIFF = "test/testfiles/xliff20/compare/new.xliff";
var WEBOS_OLD_XLIFF = "test/testfiles/xliff20/compare/webos_old.xliff";
var WEBOS_NEW_XLIFF = "test/testfiles/xliff20/compare/webos_new.xliff";
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

    test("XliffCompare_modified", function() {
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            infiles: [OLD_XLIFF, NEW_XLIFF]
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
            infiles: [OLD_XLIFF, NEW_XLIFF]
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        expect(result.modified[0].target).toBe("안녕하세요");
    });

    test("XliffCompare_added", function() {
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            infiles: [OLD_XLIFF, NEW_XLIFF]
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
            infiles: [OLD_XLIFF, NEW_XLIFF]
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
            infiles: [OLD_XLIFF, NEW_XLIFF]
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
        expect.assertions(4);
        var settings = {
            xliffVersion: 2,
            infiles: [OLD_XLIFF, NEW_XLIFF],
            outfile: OUT_DIR
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        XliffCompare.write(result, settings);
        expect(fs.existsSync(path.join(OUT_DIR, "modified.xliff"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUT_DIR, "added.xliff"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUT_DIR, "deleted.xliff"))).toBeTruthy();
    });

    test("XliffCompare_write_skips_empty_categories", function() {
        expect.assertions(3);
        // Use same file for both old and new → no differences
        var settings = {
            xliffVersion: 2,
            infiles: [OLD_XLIFF, OLD_XLIFF],
            outfile: OUT_DIR
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        XliffCompare.write(result, settings);
        expect(fs.existsSync(path.join(OUT_DIR, "modified.xliff"))).toBeFalsy();
        expect(fs.existsSync(path.join(OUT_DIR, "added.xliff"))).toBeFalsy();
    });

    // webOS style (-2 --xliffStyle webOS)

    test("XliffCompare_webOS_modified", function() {
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_OLD_XLIFF, WEBOS_NEW_XLIFF]
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        expect(result.modified.length).toBe(1);
        expect(result.modified[0].target).toBe("안녕하세요");
    });

    test("XliffCompare_webOS_added", function() {
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_OLD_XLIFF, WEBOS_NEW_XLIFF]
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
            infiles: [WEBOS_OLD_XLIFF, WEBOS_NEW_XLIFF]
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        expect(result.deleted.length).toBe(1);
        expect(result.deleted[0].source).toBe("Goodbye");
    });

    test("XliffCompare_webOS_write_creates_files", function() {
        expect.assertions(4);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_OLD_XLIFF, WEBOS_NEW_XLIFF],
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
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_OLD_XLIFF, WEBOS_OLD_XLIFF],
            outfile: OUT_DIR
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        XliffCompare.write(result, settings);
        expect(fs.existsSync(path.join(OUT_DIR, "modified.xliff"))).toBeFalsy();
        expect(fs.existsSync(path.join(OUT_DIR, "added.xliff"))).toBeFalsy();
    });
});
