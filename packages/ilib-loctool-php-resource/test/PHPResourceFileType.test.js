/*
 * PHPResourceFileType.test.js - test the php resource file type
 *
 * Copyright © 2024 Box, Inc.
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

var PHPResourceFileType = require("../PHPResourceFileType.js");
var CustomProject =  require("loctool/lib/CustomProject.js");

var p = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});

describe("PHPresourcefiletype", function() {
    test("PHPResourceFileTypeConstructor", function() {
        expect.assertions(1);

        var ptf = new PHPResourceFileType(p);

        expect(ptf).toBeTruthy();
    });

    test("PHPResourceFileTypeHandlesPHP", function() {
        expect.assertions(2);

        var ptf = new PHPResourceFileType(p);
        expect(ptf).toBeTruthy();

        expect(ptf.handles("foo.php")).toBeFalsy();
    });

    test("PHPResourceFileTypeHandlesActualPHPResFile", function() {
        expect.assertions(2);

        var ptf = new PHPResourceFileType(p);
        expect(ptf).toBeTruthy();

        expect(ptf.handles("localized_js/de-DE.php")).toBeFalsy();
    });

    test("PHPResourceFileTypeHandlesAnythingFalse", function() {
        expect.assertions(4);

        var ptf = new PHPResourceFileType(p);
        expect(ptf).toBeTruthy();

        expect(ptf.handles("foo.tmpl.html")).toBeFalsy();
        expect(ptf.handles("foo.html.haml")).toBeFalsy();
        expect(ptf.handles("foo.yml")).toBeFalsy();
    });

    test("PHPResourceFileTypeGetResourceFile", function() {
        expect.assertions(2);

        var ptf = new PHPResourceFileType(p);
        expect(ptf).toBeTruthy();

        var phprf = ptf.getResourceFile("fr-FR");

        expect(phprf.getLocale().toString()).toBe("fr-FR");
    });

    test("PHPResourceFileTypeGetResourceFileSameOneEachTime", function() {
        expect.assertions(4);

        var ptf = new PHPResourceFileType(p);
        expect(ptf).toBeTruthy();

        var phprf1 = ptf.getResourceFile("fr-FR");
        expect(phprf1.getLocale().toString()).toBe("fr-FR");

        var phprf2 = ptf.getResourceFile("fr-FR");
        expect(phprf2.getLocale().toString()).toBe("fr-FR");

        expect(phprf1).toStrictEqual(phprf2);
    });

    test("PHPResourceFileTypeGetResourceFileDifferentOneForDifferentPaths", function() {
        expect.assertions(4);

        var ptf = new PHPResourceFileType(p);
        expect(ptf).toBeTruthy();

        var phprf1 = ptf.getResourceFile("fr-FR");
        expect(phprf1.getLocale().toString()).toBe("fr-FR");

        var phprf2 = ptf.getResourceFile("fr-FR", "sublibrary/fr/FR/foo.phpon");
        expect(phprf2.getLocale().toString()).toBe("fr-FR");

        expect(phprf1 !== phprf2).toBeTruthy();
    });
});
