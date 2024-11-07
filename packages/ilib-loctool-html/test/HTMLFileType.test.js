/*
 * HTMLFileType.test.js - test the HTML file type handler object.
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
if (!HTMLFileType) {
    var HTMLFileType = require("../HTMLFileType.js");
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
describe("htmlfiletype", function() {
    test("HTMLFileTypeConstructor", function() {
        expect.assertions(1);
        var htf = new HTMLFileType(p);
        expect(htf).toBeTruthy();
    });
    test("HTMLFileTypeHandlesTrue", function() {
        expect.assertions(2);
        var htf = new HTMLFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("foo.html")).toBeTruthy();
    });
    test("HTMLFileTypeHandlesFalseClose", function() {
        expect.assertions(2);
        var htf = new HTMLFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("foo.tml")).toBeTruthy();
    });
    test("HTMLFileTypeHandlesTrue", function() {
        expect.assertions(2);
        var htf = new HTMLFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("foo.html")).toBeTruthy();
    });
    test("HTMLFileTypeHandlesAlternateExtensionTrue", function() {
        expect.assertions(2);
        var htf = new HTMLFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("foo.htm")).toBeTruthy();
    });
    test("HTMLFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);
        var htf = new HTMLFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("a/b/c/foo.html")).toBeTruthy();
    });
    test("HTMLFileTypeHandlesAlreadyLocalizedGB", function() {
        expect.assertions(2);
        var htf = new HTMLFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/foo.en-GB.html")).toBeTruthy();
    });
    test("HTMLFileTypeHandlesAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var htf = new HTMLFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/foo.zh-Hans-CN.html")).toBeTruthy();
    });
    test("HTMLFileTypeHandlesAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var htf = new HTMLFileType(p2);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/foo.en-ZA-ASDF.html")).toBeTruthy();
    });
    test("HTMLFileTypeHandleszhHKAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var htf = new HTMLFileType(p2);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/foo.zh-Hant-HK-ASDF.html")).toBeTruthy();
    });
});
