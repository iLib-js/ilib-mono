/*
 * RegexFileType.test.js - test the regex file type handler object.
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

var JavaScriptResourceFileType = require("ilib-loctool-javascript-resource");

var RegexFileType = require("../RegexFileType.js");
var CustomProject =  require("loctool/lib/CustomProject.js");

var p = new CustomProject({
    id: "app",
    plugins: [
        require.resolve("../.")
    ],
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"],
    resourceFileTypes: {
        "javascript": "ilib-loctool-javascript-resource"
    },
    regex: {
        mappings: {
            "**/*.js": {
                "resourceFileType": "javascript",
                "template": "resources/strings_[locale].json",
                "sourceLocale": "en-US",
                "expressions": [
                    {
                        "expression": "\b\\$t\\s*\\(\"(?<source>[^\"]*)\"\\)",
                        "flags": "g",
                        "datatype": "javascript",
                        "resourceType": "string",
                        "keyStrategy": "hash"
                    }
                ]
            },
            "**/*.tmpl": {
                "resourceFileType": "javascript",
                "template": "resources/template_[locale].json",
                "sourceLocale": "en-US",
                "expressions": [
                    {
                        // example:
                        // {* @L10N The message shown to users whose passwords have just been changed *}
                        // {'Your password was changed. Please log in again.'|f:'login_success_password_changed'}
                        "expression": "\\{.*@L10N\\s*(?<comment>[^*]*)\\*\\}.*\\{.*'(?<source>[^']*)'\\s*\\|\\s*f:\\s*'(?<key>[^']*)'.*\\}",
                        "flags": "g",
                        "datatype": "template",
                        "resourceType": "string"
                    }
                ]
            }
        }
    }
});


beforeAll(function() {
    p.defineFileTypes();
});

describe("javascriptfiletype", function() {
    test("RegexFileTypeConstructor", function() {
        expect.assertions(1);

        var rft = new RegexFileType(p);

        expect(rft).toBeTruthy();
    });

    test("RegexFileType gives the right set of extensions", function() {
        expect.assertions(2);

        var rft = new RegexFileType(p);
        expect(rft).toBeTruthy();

        var exts = rft.getExtensions();
        exts.sort();
        // should automatically calculate the extensions from the mappings
        expect(exts).toEqual([".js", ".tmpl"]);
    });

    test("RegexFileType handles JS files", function() {
        expect.assertions(2);

        var rft = new RegexFileType(p);
        expect(rft).toBeTruthy();

        expect(rft.handles("foo.js")).toBeTruthy();
    });

    test("RegexFileType does not handle JSX files", function() {
        expect.assertions(2);

        var rft = new RegexFileType(p);
        expect(rft).toBeTruthy();

        expect(rft.handles("foo.jsx")).toBeFalsy();
    });

    test("RegexFileType handles template files", function() {
        expect.assertions(2);

        var rft = new RegexFileType(p);
        expect(rft).toBeTruthy();

        expect(rft.handles("foo.tmpl")).toBeTruthy();
    });

    test("RegexFileType does not handle JS that is missing the dot", function() {
        expect.assertions(2);

        var rft = new RegexFileType(p);
        expect(rft).toBeTruthy();

        // no dot in the extension
        expect(rft.handles("foojs")).toBeFalsy();
    });

    test("RegexFileType does not handle other random file types", function() {
        expect.assertions(2);

        var rft = new RegexFileType(p);
        expect(rft).toBeTruthy();

        expect(rft.handles("foo.html")).toBeFalsy();
    });

    test("RegexFileType handles js with a directory", function() {
        expect.assertions(2);


        var rft = new RegexFileType(p);
        expect(rft).toBeTruthy();

        expect(rft.handles("a/b/c/foo.js")).toBeTruthy();
    });

    test("RegexFileType handles template files with a directory", function() {
        expect.assertions(2);


        var rft = new RegexFileType(p);
        expect(rft).toBeTruthy();

        expect(rft.handles("a/b/c/foo.tmpl")).toBeTruthy();
    });

    test("RegexFileType does not handle resource files", function() {
        expect.assertions(2);


        var rft = new RegexFileType(p);
        expect(rft).toBeTruthy();

        expect(rft.handles("resources/strings_de-DE.json")).toBeFalsy();
    });

    test("RegexFileType get the right resource file type for a js file", function() {
        expect.assertions(4);

        var rft = new RegexFileType(p);
        expect(rft).toBeTruthy();

        var resFileType = rft.getResourceFileTypeForPath("a/b/c/foo.js");
        expect(resFileType instanceof JavaScriptResourceFileType).toBeTruthy();

        var resfile = resFileType.getResourceFile({ locale: "de-DE" });

        expect(resfile).toBeTruthy();
        expect(resfile.locale.getSpec()).toBe("de-DE");
    });

    test("RegexFileType get the right resource file type for template files", function() {
        expect.assertions(4);

        var rft = new RegexFileType(p);
        expect(rft).toBeTruthy();

        var resFileType = rft.getResourceFileTypeForPath("a/b/c/foo.tmpl");
        expect(resFileType instanceof JavaScriptResourceFileType).toBeTruthy();

        var resfile = resFileType.getResourceFile({ locale: "de-DE" });

        expect(resfile).toBeTruthy();
        expect(resfile.locale.getSpec()).toBe("de-DE");
    });

    test("RegexFileTypeGetResourceFileSameForSameLocale", function() {
        expect.assertions(5);

        var rft = new RegexFileType(p);
        expect(rft).toBeTruthy();

        var resFileType = rft.getResourceFileTypeForPath("x/y/z/foo.js");
        expect(resFileType instanceof JavaScriptResourceFileType).toBeTruthy();

        var resfile1 = resFileType.getResourceFile({ locale: "de-DE" });

        expect(resfile1).toBeTruthy();

        var resfile2 = resFileType.getResourceFile({ locale: "de-DE" });

        expect(resfile2).toBeTruthy();

        expect(resfile1).toBe(resfile2);
    });

    test("RegexFileTypeGetResourceFileDifferentForDifferentLocales", function() {
        expect.assertions(5);

        var rft = new RegexFileType(p);
        expect(rft).toBeTruthy();

        var resFileType = rft.getResourceFileTypeForPath("m/n/o/foo.js");
        expect(resFileType instanceof JavaScriptResourceFileType).toBeTruthy();

        var resfile1 = resFileType.getResourceFile({ locale: "de-DE" });

        expect(resfile1).toBeTruthy();

        var resfile2 = resFileType.getResourceFile({ locale: "fr-FR" });

        expect(resfile2).toBeTruthy();

        expect(resfile1).not.toBe(resfile2);
    });
});
