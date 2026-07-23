/*
 * webOSXliffCompare.test.js - test the compare of Xliff objects.
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

var WEBOS_FROM_XLIFF = "test/testfiles/xliff_webOS/compare/webos_from.xliff";
var WEBOS_TO_XLIFF = "test/testfiles/xliff_webOS/compare/webos_to.xliff";
var OUT_DIR = "test/testfiles/xliff_webOS/compare/output";

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

describe("webOSXliffCompare", function() {
    test("webOSXliffCompareNoParameter", function() {
        expect.assertions(1);
        var result = XliffCompare();
        expect(!result).toBeTruthy();
    });

    test("webOSXliffCompareWriteNoParameter", function() {
        expect.assertions(1);
        var result = XliffCompare.write();
        expect(!result).toBeTruthy();
    });

    test("webOSXliffCompare_missing_from_file_returns_undefined", function() {
        expect.assertions(1);
        var result = XliffCompare({
            xliffVersion: 2,
            infiles: ["nonexistent/path/from.xliff", WEBOS_TO_XLIFF]
        });
        expect(result).toBeUndefined();
    });

    test("webOSXliffCompare_missing_to_file_returns_undefined", function() {
        expect.assertions(1);
        var result = XliffCompare({
            xliffVersion: 2,
            infiles: [WEBOS_FROM_XLIFF, "nonexistent/path/to.xliff"]
        });
        expect(result).toBeUndefined();
    });

    test("webOSXliffCompare_webOS_modified", function() {
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_FROM_XLIFF, WEBOS_TO_XLIFF],
            outfile: OUT_DIR
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        XliffCompare.write(result, settings);

        var actual = fs.readFileSync(path.join(OUT_DIR, "modified.xliff"), "utf-8");
        var expected =
        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" xmlns:mda="urn:oasis:names:tc:xliff:metadata:2.0" srcLang="en-KR" trgLang="ko-KR" version="2.0">\n' +
        '  <file id="appA_f1" original="appA">\n' +
        '    <group id="appA_g1" name="javascript">\n' +
        '      <unit id="appA_g1_1">\n' +
        '        <segment>\n' +
        '          <source>Hello</source>\n' +
        '          <target>안녕하세요</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="appA_g1_2">\n' +
        '        <mda:metadata>\n' +
        '          <mda:metaGroup category="device-type">\n' +
        '            <mda:meta type="Monitor">(current) Monitor {arg1}.</mda:meta>\n' +
        '            <mda:meta type="StanbyME">The device {arg1}.</mda:meta>\n' +
        '          </mda:metaGroup>\n' +
        '        </mda:metadata>\n' +
        '        <segment>\n' +
        '          <source>%deviceType% {arg1}.</source>\n' +
        '          <target>%deviceType% {arg1}.</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>\n';

        expect(result.modified.length).toBe(2);
        expect(actual).toBe(expected);
    });

    test("webOSXliffCompare_webOS_added", function() {
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_FROM_XLIFF, WEBOS_TO_XLIFF]
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        expect(result.added.length).toBe(1);
        expect(result.added[0].source).toBe("Yes");
    });

    test("webOSXliffCompare_webOS_deleted", function() {
        expect.assertions(3);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_FROM_XLIFF, WEBOS_TO_XLIFF]
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        expect(result.deleted.length).toBe(1);
        expect(result.deleted[0].source).toBe("Goodbye");
    });

    test("webOSXliffCompare_webOS_unchanged_not_in_any_category", function() {
        expect.assertions(4);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_FROM_XLIFF, WEBOS_TO_XLIFF]
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        // "Thank you" is unchanged — should not appear in any category
        var allUnits = [...result.modified, ...result.added, ...result.deleted];
        var unchanged = allUnits.find(function(u) { return u.source === "Thank you"; });
        expect(unchanged).toBeUndefined();
        expect(result.modified.length).toBe(2);
        expect(result.added.length + result.deleted.length).toBe(2);
    });

    test("webOSXliffCompare_webOS_metadata_change_categorized_as_modified", function() {
        expect.assertions(5);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_FROM_XLIFF, WEBOS_TO_XLIFF],
            outfile: OUT_DIR
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        XliffCompare.write(result, settings);

        var actual = fs.readFileSync(path.join(OUT_DIR, "modified.xliff"), "utf-8");
        var expected =
        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n' +
        '<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" xmlns:mda="urn:oasis:names:tc:xliff:metadata:2.0" srcLang="en-KR" trgLang="ko-KR" version="2.0">\n' +
        '  <file id="appA_f1" original="appA">\n' +
        '    <group id="appA_g1" name="javascript">\n' +
        '      <unit id="appA_g1_1">\n' +
        '        <segment>\n' +
        '          <source>Hello</source>\n' +
        '          <target>안녕하세요</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '      <unit id="appA_g1_2">\n' +
        '        <mda:metadata>\n' +
        '          <mda:metaGroup category="device-type">\n' +
        '            <mda:meta type="Monitor">(current) Monitor {arg1}.</mda:meta>\n' +
        '            <mda:meta type="StanbyME">The device {arg1}.</mda:meta>\n' +
        '          </mda:metaGroup>\n' +
        '        </mda:metadata>\n' +
        '        <segment>\n' +
        '          <source>%deviceType% {arg1}.</source>\n' +
        '          <target>%deviceType% {arg1}.</target>\n' +
        '        </segment>\n' +
        '      </unit>\n' +
        '    </group>\n' +
        '  </file>\n' +
        '</xliff>\n';

        expect(result.modified.length).toBe(2);
        expect(result.added.length).toBe(1);
        expect(result.deleted.length).toBe(1);
        expect(actual).toBe(expected);
    });

    test("webOSXliffCompare_webOS_write_creates_files", function() {
        expect.assertions(4);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_FROM_XLIFF, WEBOS_TO_XLIFF],
            outfile: OUT_DIR
        };
        var result = XliffCompare(settings);
        expect(result).toBeTruthy();
        XliffCompare.write(result, settings);
        expect(fs.existsSync(path.join(OUT_DIR, "modified.xliff"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUT_DIR, "added.xliff"))).toBeTruthy();
        expect(fs.existsSync(path.join(OUT_DIR, "deleted.xliff"))).toBeTruthy();
    });

    test("webOSXliffCompare_webOS_write_skips_empty_categories", function() {
        expect.assertions(4);
        var settings = {
            xliffVersion: 2,
            xliffStyle: "webOS",
            infiles: [WEBOS_FROM_XLIFF, WEBOS_FROM_XLIFF],
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
