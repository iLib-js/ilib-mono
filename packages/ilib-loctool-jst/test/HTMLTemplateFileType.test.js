/*
 * HTMLTemplateFileType.test.js - test the HTML template file type handler object.
 *
 * Copyright © 2019, 2023 Box, Inc.
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

if (!HTMLTemplateFileType) {
    var HTMLTemplateFileType = require("../HTMLTemplateFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});

var p2 = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"],
    flavors: ["ASDF"]
});

describe("htmltemplatefiletype", function() {
    test("HTMLTemplateFileTypeConstructor", function() {
        expect.assertions(1);

        var htf = new HTMLTemplateFileType(p);

        expect(htf).toBeTruthy();
    });

    test("HTMLTemplateFileTypeHandlesTrue", function() {
        expect.assertions(2);

        var htf = new HTMLTemplateFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("foo.tmpl.html")).toBeTruthy();
    });

    test("HTMLTemplateFileTypeHandlesFalseClose", function() {
        expect.assertions(2);

        var htf = new HTMLTemplateFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("foo.tml")).toBeTruthy();
    });

    test("HTMLTemplateFileTypeHandlesFalse", function() {
        expect.assertions(2);

        var htf = new HTMLTemplateFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("foo.html")).toBeTruthy();
    });

    test("HTMLTemplateFileTypeHandlesAlternateExtensionTrue", function() {
        expect.assertions(2);

        var htf = new HTMLTemplateFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("foo.htm")).toBeTruthy();
    });

    test("HTMLTemplateFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);

        var htf = new HTMLTemplateFileType(p);
        expect(htf).toBeTruthy();

        expect(htf.handles("a/b/c/foo.tmpl.html")).toBeTruthy();
    });

    test("HTMLTemplateFileTypeHandlesAlreadyLocalizedGB", function() {
        expect.assertions(2);

        var htf = new HTMLTemplateFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/foo.en-GB.tmpl.html")).toBeTruthy();
    });

    test("HTMLTemplateFileTypeHandlesAlreadyLocalizedCN", function() {
        expect.assertions(2);

        var htf = new HTMLTemplateFileType(p);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/foo.zh-Hans-CN.tmpl.html")).toBeTruthy();
    });

    test("HTMLTemplateFileTypeHandlesAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);

        var htf = new HTMLTemplateFileType(p2);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/foo.en-ZA-ASDF.tmpl.html")).toBeTruthy();
    });

    test("HTMLTemplateFileTypeHandleszhHKAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);

        var htf = new HTMLTemplateFileType(p2);
        expect(htf).toBeTruthy();

        expect(!htf.handles("a/b/c/foo.zh-Hant-HK-ASDF.tmpl.html")).toBeTruthy();
    });
});
