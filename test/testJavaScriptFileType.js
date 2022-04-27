/*
 * testJavaScriptFileType.js - test the HTML template file type handler object.
 *
 * Copyright © 2019, 2022 Box, Inc.
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

module.exports.javascriptfiletype = {
    testJavaScriptFileTypeConstructor: function(test) {
        test.expect(1);

        var jtf = new JavaScriptFileType(p);

        test.ok(jtf);

        test.done();
    },

    testJavaScriptFileTypeHandlesJSTrue: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(jtf.handles("foo.js"));

        test.done();
    },

    testJavaScriptFileTypeHandlesJSXTrue: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(jtf.handles("foo.jsx"));

        test.done();
    },

    testJavaScriptFileTypeHandlesHamlTrue: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(jtf.handles("foo.html.haml"));

        test.done();
    },

    testJavaScriptFileTypeHandlesTemplatesTrue: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(jtf.handles("foo.tmpl.html"));

        test.done();
    },

    testJavaScriptFileTypeHandlesJSFalseClose: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("foojs"));

        test.done();
    },

    testJavaScriptFileTypeHandlesHamlFalseClose: function(test) {
        test.expect(2);


        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("foohtml.haml"));

        test.done();
    },

    testJavaScriptFileTypeHandlesTemplateFalseClose: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("footmpl.html"));

        test.done();
    },

    testJavaScriptFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("foo.html"));

        test.done();
    },

    testJavaScriptFileTypeHandlesJSTrueWithDir: function(test) {
        test.expect(2);


        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(jtf.handles("a/b/c/foo.js"));

        test.done();
    },

    testJavaScriptFileTypeHandlesHamlTrueWithDir: function(test) {
        test.expect(2);


        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(jtf.handles("a/b/c/foo.html.haml"));

        test.done();
    },

    testJavaScriptFileTypeHandlesHamlTrueSourceLocale: function(test) {
        test.expect(2);


        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(jtf.handles("a/b/c/foo.en-US.html.haml"));

        test.done();
    },

    testJavaScriptFileTypeHandlesTemplateSourceLocale: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(jtf.handles("a/b/c/strings.en-US.tmpl.html"));

        test.done();
    },

    testJavaScriptFileTypeHandlesHamlTrueWithDir: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(jtf.handles("a/b/c/foo.tmpl.html"));

        test.done();
    },

    testJavaScriptFileTypeHandlesJSAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("a/b/c/strings.en-GB.js"));

        test.done();
    },

    testJavaScriptFileTypeHandlesHamlAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("a/b/c/strings.en-GB.html.haml"));

        test.done();
    },

    testJavaScriptFileTypeHandlesTemplateAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("a/b/c/strings.en-GB.tmpl.html"));

        test.done();
    },

    testJavaScriptFileTypeHandlesJSAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("a/b/c/strings.zh-Hans-CN.js"));

        test.done();
    },

    testJavaScriptFileTypeHandleHamlAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("a/b/c/strings.zh-Hans-CN.html.haml"));

        test.done();
    },

    testJavaScriptFileTypeHandleTemplateAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("a/b/c/strings.zh-Hans-CN.tmpl.html"));

        test.done();
    },

    testJavaScriptFileTypeHandleTemplateAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("a/b/c/strings.zh-Hans-CN.tmpl.html"));

        test.done();
    },

    testJavaScriptFileTypeHandleTemplateAlreadyLocalizedES: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("a/b/c/strings.es-US.tmpl.html"));

        test.done();
    },

    testJavaScriptFileTypeHandleTemplateAlreadyLocalizedES: function(test) {
        test.expect(2);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("a/b/c/strings.es-US.tmpl.html"));

        test.done();
    },

    testJavaScriptFileTypeHandlesJSAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var p = new CustomProject({
            plugins: ["../."],
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("a/b/c/strings.en-ZA-ASDF.js"));

        test.done();
    },

    testJavaScriptFileTypeHandlesHamlAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var p = new CustomProject({
            plugins: ["../."],
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("a/b/c/strings.en-ZA-ASDF.html.haml"));

        test.done();
    },

    testJavaScriptFileTypeHandlesTemplateAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var p = new CustomProject({
            plugins: ["../."],
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["ASDF"]
        });

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        test.ok(!jtf.handles("a/b/c/strings.en-ZA-ASDF.tmpl.html"));

        test.done();
    },

    testJavaScriptFileTypeGetResourceFile: function(test) {
        test.expect(3);

        var jtf = new JavaScriptFileType(p);
        test.ok(jtf);

        var resFileType = p.getResourceFileType("javascript");
        test.ok(resFileType instanceof JavaScriptResourceFileType);

        var resfile = resFileType.getResourceFile("de-DE");

        test.ok(resfile);
        test.equal(resfile.locale.getSpec(), "de-DE");
        test.done();
    },

    testJavaScriptFileTypeGetResourceFile: function(test) {
        test.expect(4);

        p2.defineFileTypes();
        var jtf = new JavaScriptFileType(p2);
        test.ok(jtf);

        var resFileType = p2.getResourceFileType("javascript");
        test.ok(resFileType instanceof JsonFileType);

        var resfile = resFileType.getResourceFile("de-DE");

        test.ok(resfile);
        test.equal(resfile.locale.getSpec(), "de-DE");
        test.done();
    },

    testJavaScriptFileTypeGetResourceFileSameForSameLocale: function(test) {
        test.expect(5);

        p2.defineFileTypes();
        var jtf = new JavaScriptFileType(p2);
        test.ok(jtf);

        var resFileType = p2.getResourceFileType("javascript");
        test.ok(resFileType instanceof JsonFileType);

        var resfile1 = resFileType.getResourceFile("de-DE");

        test.ok(resfile1);

        var resfile2 = resFileType.getResourceFile("de-DE");

        test.ok(resfile2);

        test.equal(resfile1, resfile2);

        test.done();
    },

    testJavaScriptFileTypeGetResourceFileDifferentForDifferentLocales: function(test) {
        test.expect(5);

        p2.defineFileTypes();
        var jtf = new JavaScriptFileType(p2);
        test.ok(jtf);

        var resFileType = p2.getResourceFileType("javascript");
        test.ok(resFileType instanceof JsonFileType);

        var resfile1 = resFileType.getResourceFile("de-DE");

        test.ok(resfile1);

        var resfile2 = resFileType.getResourceFile("fr-FR");

        test.ok(resfile2);

        test.notEqual(resfile1, resfile2);

        test.done();
    }
};
