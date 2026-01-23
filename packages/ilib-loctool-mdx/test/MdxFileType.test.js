/*
 * MdxFileType.test.js - test the MDX file type handler object.
 *
 * Copyright © 2025 Box, Inc.
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
if (!MdxFileType) {
    var MdxFileType = require("../MdxFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
    var ProjectFactory =  require("loctool/lib/ProjectFactory.js");
}
var p = new CustomProject({
    sourceLocale: "en-US",
    plugins: ["../."]
}, "./test/testfiles", {
    locales:["en-GB"],
    mdx: {
        "mappings": {
            "file.mdx": {
                "template": "resources/[localeDir]/file.mdx"
            },
            "resources/en/US/file.mdx": {
                "template": "resources/[localeDir]/file.mdx"
            },
            "**/messages.mdx": {
                "template": "resources/[localeDir]/messages.mdx"
            },
            "**/test/str.mdx": {
                "template": "[dir]/[localeDir]/str.mdx"
            },
            "**/*.mdx": {
                "template": "[localeDir]/[filename]"
            }
        }
    }
});
var p2 = new CustomProject({
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"],
    flavors: ["ASDF"],
    mdx: {
        fullyTranslated: true
    }
});

describe("mdxfiletype", function() {
    // Initialize the parser once before all tests (required for remark-mdx ESM module)
    // The parser is shared at the module level, so we only need to initialize it once
    beforeAll(function(done) {
        var mdft = new MdxFileType(p);
        mdft.init(function(err) {
            if (err) {
                done(err);
            } else {
                done();
            }
        });
    }, 30000); // 30 second timeout for loading ESM module
    test("MdxFileTypeConstructor", function() {
        expect.assertions(1);
        var mdft = new MdxFileType(p);
        expect(mdft).toBeTruthy();
    });
     test("MdxFileTypeGetMapping1", function() {
        expect.assertions(2);
        var mdft = new MdxFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.getMapping("x/y/messages.mdx")).toStrictEqual({
            "template": "resources/[localeDir]/messages.mdx"
        });
    });
     test("MdxFileTypeGetMapping2", function() {
        expect.assertions(2);
        var mdft = new MdxFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.getMapping("resources/en/US/file.mdx")).toStrictEqual({
            "template": "resources/[localeDir]/file.mdx"
        });
    });
     test("MdxFileTypeGetMappingNoMatch", function() {
        expect.assertions(2);
        var mdft = new MdxFileType(p);
        expect(mdft).toBeTruthy();
        expect(!mdft.getMapping("x/y/msg.mdxx")).toBeTruthy();
    });
    test("MdxFileTypeHandlesMDX", function() {
        expect.assertions(2);
        var mdft = new MdxFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.mdx")).toBeTruthy();
    });
    test("MdxFileTypeDoesNotHandle plain markdown", function() {
        expect.assertions(2);
        var mdft = new MdxFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.md")).toBeFalsy();
    });
    test("MdxFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);
        var mdft = new MdxFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("a/b/c/foo.mdx")).toBeTruthy();
    });
    test("MdxFileTypeHandlesAlreadyLocalizedGB", function() {
        expect.assertions(2);
        var mdft = new MdxFileType(p);
        expect(mdft).toBeTruthy();
        expect(!mdft.handles("en-GB/a/b/c/foo.mdx")).toBeTruthy();
    });
    test("MdxFileTypeHandlesAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var mdft = new MdxFileType(p);
        expect(mdft).toBeTruthy();
        expect(!mdft.handles("zh-Hans-CN/a/b/c/foo.mdx")).toBeTruthy();
    });
    test("MdxFileTypeHandlesAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var mdft = new MdxFileType(p2);
        expect(mdft).toBeTruthy();
        expect(!mdft.handles("en-ZA-ASDF/a/b/c/foo.mdx")).toBeTruthy();
    });
    test("MdxFileTypeHandleszhHKAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var mdft = new MdxFileType(p2);
        expect(mdft).toBeTruthy();
        expect(!mdft.handles("zh-Hant-HK-ASDF/a/b/c/foo.mdx")).toBeTruthy();
    });
    test("MdxFileTypeHandlesSourceDirIsNotLocalized", function() {
        expect.assertions(2);
        var mdft = new MdxFileType(p2);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("en-US/a/b/c/foo.mdx")).toBeTruthy();
    });
    test("MdxFileTypeProjectCloseFullyTranslatedOn", function() {
        expect.assertions(3);
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mdx: {
                fullyTranslated: true
            }
        });
        var mdft = new MdxFileType(p2);
        expect(mdft).toBeTruthy();
        var statii = [
            {path: "fr-FR/a/b/c.mdx", locale: "fr-FR", fullyTranslated: false},
            {path: "de-DE/a/b/c.mdx", locale: "de-DE", fullyTranslated: true},
            {path: "ja-JP/a/b/c.mdx", locale: "ja-JP", fullyTranslated: false},
            {path: "fr-FR/x/y.mdx", locale: "fr-FR", fullyTranslated: true},
            {path: "de-DE/x/y.mdx", locale: "de-DE", fullyTranslated: false},
            {path: "ja-JP/x/y.mdx", locale: "ja-JP", fullyTranslated: true}
        ];
        statii.forEach(function(status) {
            mdft.addTranslationStatus(status);
        });
        mdft.projectClose();
        expect(fs.existsSync("./test/testfiles/subproject/translation-status.json")).toBeTruthy();
        var contents = fs.readFileSync("./test/testfiles/subproject/translation-status.json", "utf-8");
        var actual = JSON.parse(contents);
        var expected = {
            translated: [
                "de-DE/a/b/c.mdx",
                "fr-FR/x/y.mdx",
                "ja-JP/x/y.mdx"
            ],
            untranslated: [
                "fr-FR/a/b/c.mdx",
                "ja-JP/a/b/c.mdx",
                "de-DE/x/y.mdx"
            ]
        };
        expect(actual).toStrictEqual(expected);
    });
    test("MdxFileTypeProjectCloseFullyTranslatedOff", function() {
        expect.assertions(3);
        // clean up first
        fs.unlinkSync("./test/testfiles/subproject/translation-status.json");
        expect(!fs.existsSync("./test/testfiles/subproject/translation-status.json")).toBeTruthy();
        var p2 = ProjectFactory("./test/testfiles/subproject", {});
        var mdft = new MdxFileType(p2);
        expect(mdft).toBeTruthy();
        var statii = [
            {path: "fr-FR/a/b/c.mdx", locale: "fr-FR", fullyTranslated: false},
            {path: "de-DE/a/b/c.mdx", locale: "de-DE", fullyTranslated: true},
            {path: "ja-JP/a/b/c.mdx", locale: "ja-JP", fullyTranslated: false},
            {path: "fr-FR/x/y.mdx", locale: "fr-FR", fullyTranslated: true},
            {path: "de-DE/x/y.mdx", locale: "de-DE", fullyTranslated: false},
            {path: "ja-JP/x/y.mdx", locale: "ja-JP", fullyTranslated: true}
        ];
        statii.forEach(function(status) {
            mdft.addTranslationStatus(status);
        });
        mdft.projectClose();
        expect(!fs.existsSync("./test/testfiles/subproject/translation-status.json")).toBeTruthy();
    });

    test("should handle .mdx files as a default extension", function() {
        expect.assertions(3);
        var p3 = new CustomProject({
            sourceLocale: "en-US",
            plugins: ["../."]
        }, "./test/testfiles", {
            locales:["en-GB"],
            mdx: {
                mappings: {
                    "**/*.mdx": {
                        "template": "[localeDir]/[filename]"
                    }
                }
            }
        });
        var mdft = new MdxFileType(p3);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.mdx")).toBeTruthy();
        var extensions = mdft.getExtensions();
        expect(extensions.indexOf(".mdx") > -1).toBeTruthy();
    });

    test("should include .mdx in default extensions", function() {
        expect.assertions(2);
        var p3 = new CustomProject({
            sourceLocale: "en-US",
            plugins: ["../."]
        }, "./test/testfiles", {
            locales:["en-GB"],
            mdx: {
                mappings: {
                    "**/*.mdx": {
                        "template": "[localeDir]/[filename]"
                    }
                }
            }
        });
        var mdft = new MdxFileType(p3);
        expect(mdft).toBeTruthy();
        var extensions = mdft.getExtensions();
        // check that default extensions are present - only .mdx, not .md
        expect(extensions).toStrictEqual([".mdx"]);
    });

    test("should handle .mdx files with mapping patterns", function() {
        expect.assertions(3);
        var p3 = new CustomProject({
            sourceLocale: "en-US",
            plugins: ["../."]
        }, "./test/testfiles", {
            locales:["en-GB"],
            mdx: {
                mappings: {
                    "**/*.mdx": {
                        "template": "[localeDir]/[filename]"
                    }
                }
            }
        });
        var mdft = new MdxFileType(p3);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.mdx")).toBeTruthy();
        expect(mdft.handles("a/b/c/bar.mdx")).toBeTruthy();
    });

    test("should not handle extensions not in the default list", function() {
        expect.assertions(2);
        var p3 = new CustomProject({
            sourceLocale: "en-US",
            plugins: ["../."]
        }, "./test/testfiles", {
            locales:["en-GB"],
            mdx: {
                mappings: {
                    "**/*.mdx": {
                        "template": "[localeDir]/[filename]"
                    }
                }
            }
        });
        var mdft = new MdxFileType(p3);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.mdoc")).toBeFalsy();
    });
});
