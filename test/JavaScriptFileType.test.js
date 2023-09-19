/*
 * JavaScriptFileType.test.js - test the HTML template file type handler object.
 *
 * Copyright © 2019, 2022-2023 Box, Inc.
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
if (!JavaScriptFileType) {
    var JavaScriptFileType = require("../JavaScriptFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
    var JavaScriptResourceFileType = require("ilib-loctool-javascript-resource");
    var JsonFileType = require("ilib-loctool-json");
}
var p = new CustomProject({
    id: "app",
    plugins: [require.resolve("../.")],
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});
// trying using ilib-loctool-json as the output for resource files
var p2 = new CustomProject({
    id: "app",
    resourceFileTypes: { "javascript": "ilib-loctool-json" },
    plugins: [require.resolve("../."), "ilib-loctool-json"],
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB", "de-DE", "fr-FR"]
});
describe("javascriptfiletype", function() {
    test("JavaScriptFileTypeConstructor", function() {
        expect.assertions(1);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesJSTrue", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(jtf.handles("foo.js")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesJSXTrue", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(jtf.handles("foo.jsx")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesHamlTrue", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(jtf.handles("foo.html.haml")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesTemplatesTrue", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(jtf.handles("foo.tmpl.html")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesJSFalseClose", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("foojs")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesHamlFalseClose", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("foohtml.haml")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesTemplateFalseClose", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("footmpl.html")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesFalse", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("foo.html")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesJSTrueWithDir", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(jtf.handles("a/b/c/foo.js")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesHamlTrueWithDir", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(jtf.handles("a/b/c/foo.html.haml")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesHamlTrueSourceLocale", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(jtf.handles("a/b/c/foo.en-US.html.haml")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesTemplateSourceLocale", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(jtf.handles("a/b/c/strings.en-US.tmpl.html")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesHamlTrueWithDir", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(jtf.handles("a/b/c/foo.tmpl.html")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesJSAlreadyLocalizedGB", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("a/b/c/strings.en-GB.js")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesHamlAlreadyLocalizedGB", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("a/b/c/strings.en-GB.html.haml")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesTemplateAlreadyLocalizedGB", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("a/b/c/strings.en-GB.tmpl.html")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesJSAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("a/b/c/strings.zh-Hans-CN.js")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandleHamlAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("a/b/c/strings.zh-Hans-CN.html.haml")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandleTemplateAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("a/b/c/strings.zh-Hans-CN.tmpl.html")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandleTemplateAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("a/b/c/strings.zh-Hans-CN.tmpl.html")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandleTemplateAlreadyLocalizedES", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("a/b/c/strings.es-US.tmpl.html")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandleTemplateAlreadyLocalizedES", function() {
        expect.assertions(2);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("a/b/c/strings.es-US.tmpl.html")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesJSAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var p = new CustomProject({
            plugins: ["../."],
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("a/b/c/strings.en-ZA-ASDF.js")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesHamlAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var p = new CustomProject({
            plugins: ["../."],
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("a/b/c/strings.en-ZA-ASDF.html.haml")).toBeTruthy();
    });
    test("JavaScriptFileTypeHandlesTemplateAlreadyLocalizedGB", function() {
        expect.assertions(2);
        var p = new CustomProject({
            plugins: ["../."],
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        expect(!jtf.handles("a/b/c/strings.en-ZA-ASDF.tmpl.html")).toBeTruthy();
    });
    test("JavaScriptFileTypeGetResourceFile", function() {
        debugger;
        expect.assertions(3);
        var jtf = new JavaScriptFileType(p);
        expect(jtf).toBeTruthy();
        var resFileType = p.getResourceFileType("javascript");
        expect(resFileType instanceof JavaScriptResourceFileType).toBeTruthy();
        var resfile = resFileType.getResourceFile("de-DE");
        expect(resfile).toBeTruthy();
        expect(resfile.locale.getSpec()).toBe("de-DE");
    });
    test("JavaScriptFileTypeGetResourceFile", function() {
        expect.assertions(4);
        p2.defineFileTypes();
        var jtf = new JavaScriptFileType(p2);
        expect(jtf).toBeTruthy();
        var resFileType = p2.getResourceFileType("javascript");
        expect(resFileType instanceof JsonFileType).toBeTruthy();
        var resfile = resFileType.getResourceFile("de-DE");
        expect(resfile).toBeTruthy();
        expect(resfile.locale.getSpec()).toBe("de-DE");
    });
    test("JavaScriptFileTypeGetResourceFileSameForSameLocale", function() {
        expect.assertions(5);
        p2.defineFileTypes();
        var jtf = new JavaScriptFileType(p2);
        expect(jtf).toBeTruthy();
        var resFileType = p2.getResourceFileType("javascript");
        expect(resFileType instanceof JsonFileType).toBeTruthy();
        var resfile1 = resFileType.getResourceFile("de-DE");
        expect(resfile1).toBeTruthy();
        var resfile2 = resFileType.getResourceFile("de-DE");
        expect(resfile2).toBeTruthy();
        expect(resfile1).toBe(resfile2);
    });
    test("JavaScriptFileTypeGetResourceFileDifferentForDifferentLocales", function() {
        expect.assertions(5);
        p2.defineFileTypes();
        var jtf = new JavaScriptFileType(p2);
        expect(jtf).toBeTruthy();
        var resFileType = p2.getResourceFileType("javascript");
        expect(resFileType instanceof JsonFileType).toBeTruthy();
        var resfile1 = resFileType.getResourceFile("de-DE");
        expect(resfile1).toBeTruthy();
        var resfile2 = resFileType.getResourceFile("fr-FR");
        expect(resfile2).toBeTruthy();
        expect(resfile1).not.toBe(resfile2);
    });
});
