/*
 * HamlFileType.test.js - test the Haml template file type handler object.
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
if (!HamlFileType) {
    var HamlFileType = require("../HamlFileType.js");
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
describe("hamlfiletype", function() {
    test("HamlFileTypeConstructor", function() {
        expect.assertions(1);
        var htf = new HamlFileType(p);
        expect(htf).toBeTruthy();
    });
    test("HamlFileTypeHandlesTrue", function() {
        expect.assertions(2);
        var htf = new HamlFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("foo.html.haml")).toBeTruthy();
    });
    test("HamlFileTypeHandlesFalseClose", function() {
        expect.assertions(2);
        var htf = new HamlFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("foo.tml.haml")).toBeTruthy();
    });
    test("HamlFileTypeHandlesFalse", function() {
        expect.assertions(2);
        var htf = new HamlFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("foo.haml")).toBeTruthy();
    });
    test("HamlFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);
        var htf = new HamlFileType(p);
        expect(htf).toBeTruthy();
        expect(htf.handles("a/b/c/foo.html.haml")).toBeTruthy();
    });
    test("HamlFileTypeHandlesAlreadyLocalizedGB", function() {
        expect.assertions(2);
        var htf = new HamlFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/foo.en-GB.html.haml")).toBeTruthy();
    });
    test("HamlFileTypeHandlesAlreadyLocalizedES", function() {
        expect.assertions(2);
        var htf = new HamlFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/foo.es-US.html.haml")).toBeTruthy();
    });
    test("HamlFileTypeHandlesAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var htf = new HamlFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/foo.zh-Hans-CN.html.haml")).toBeTruthy();
    });
    test("HamlFileTypeHandlesAlreadyLocalizedCN2", function() {
        expect.assertions(2);
        var htf = new HamlFileType(p);
        expect(htf).toBeTruthy();
        expect(!htf.handles("app/views/who_we_are/press.zh-Hans-CN.html.haml")).toBeTruthy();
    });
    test("HamlFileTypeHandlesAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var htf = new HamlFileType(p2);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/foo.en-ZA-ASDF.html.haml")).toBeTruthy();
    });
    test("HamlFileTypeHandlesAlreadyLocalizedHKWithFlavor", function() {
        expect.assertions(2);
        var htf = new HamlFileType(p2);
        expect(htf).toBeTruthy();
        expect(!htf.handles("a/b/c/foo.zh-Hant-HK-ASDF.html.haml")).toBeTruthy();
    });
});
