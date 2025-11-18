/*
 * MarkdownFileType.test.js - test the Markdown file type handler object.
 *
 * Copyright © 2019-2021, 2023 Box, Inc.
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
if (!MarkdownFileType) {
    var MarkdownFileType = require("../MarkdownFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
    var ProjectFactory =  require("loctool/lib/ProjectFactory.js");
}
var p = new CustomProject({
    sourceLocale: "en-US",
    plugins: ["../."]
}, "./test/testfiles", {
    locales:["en-GB"],
    markdown: {
        "mappings": {
            "file.md": {
                "template": "resources/[localeDir]/file.md"
            },
            "resources/en/US/file.md": {
                "template": "resources/[localeDir]/file.md"
            },
            "**/messages.md": {
                "template": "resources/[localeDir]/messages.md"
            },
            "**/test/str.md": {
                "template": "[dir]/[localeDir]/str.md"
            },
            "**/*.md": {
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
    markdown: {
        fullyTranslated: true
    }
});
describe("markdownfiletype", function() {
    test("MarkdownFileTypeConstructor", function() {
        expect.assertions(1);
        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();
    });
     test("MarkdownFileTypeGetMapping1", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.getMapping("x/y/messages.md")).toStrictEqual({
            "template": "resources/[localeDir]/messages.md"
        });
    });
     test("MarkdownFileTypeGetMapping2", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.getMapping("resources/en/US/file.md")).toStrictEqual({
            "template": "resources/[localeDir]/file.md"
        });
    });
     test("MarkdownFileTypeGetMappingNoMatch", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();
        expect(!mdft.getMapping("x/y/msg.mdx")).toBeTruthy();
    });
    test("MarkdownFileTypeHandlesMD", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.md")).toBeTruthy();
    });
    test("MarkdownFileTypeHandlesMarkdown", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.markdown")).toBeTruthy();
    });
    test("MarkdownFileTypeHandlesMdown", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.mdown")).toBeTruthy();
    });
    test("MarkdownFileTypeHandlesMkd", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.mkd")).toBeTruthy();
    });
    test("MarkdownFileTypeHandlesRst", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.rst")).toBeTruthy();
    });
    test("MarkdownFileTypeHandlesRmd", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.rmd")).toBeTruthy();
    });
    test("MarkdownFileTypeHandlesFalseClose", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();
        expect(!mdft.handles("foo.tml")).toBeTruthy();
    });
    test("MarkdownFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("a/b/c/foo.md")).toBeTruthy();
    });
    test("MarkdownFileTypeHandlesAlreadyLocalizedGB", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();
        expect(!mdft.handles("en-GB/a/b/c/foo.md")).toBeTruthy();
    });
    test("MarkdownFileTypeHandlesAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p);
        expect(mdft).toBeTruthy();
        expect(!mdft.handles("zh-Hans-CN/a/b/c/foo.md")).toBeTruthy();
    });
    test("MarkdownFileTypeHandlesAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p2);
        expect(mdft).toBeTruthy();
        expect(!mdft.handles("en-ZA-ASDF/a/b/c/foo.md")).toBeTruthy();
    });
    test("MarkdownFileTypeHandleszhHKAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p2);
        expect(mdft).toBeTruthy();
        expect(!mdft.handles("zh-Hant-HK-ASDF/a/b/c/foo.md")).toBeTruthy();
    });
    test("MarkdownFileTypeHandlesSourceDirIsNotLocalized", function() {
        expect.assertions(2);
        var mdft = new MarkdownFileType(p2);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("en-US/a/b/c/foo.md")).toBeTruthy();
    });
    test("MarkdownFileTypeProjectCloseFullyTranslatedOn", function() {
        expect.assertions(3);
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            markdown: {
                fullyTranslated: true
            }
        });
        var mdft = new MarkdownFileType(p2);
        expect(mdft).toBeTruthy();
        var statii = [
            {path: "fr-FR/a/b/c.md", locale: "fr-FR", fullyTranslated: false},
            {path: "de-DE/a/b/c.md", locale: "de-DE", fullyTranslated: true},
            {path: "ja-JP/a/b/c.md", locale: "ja-JP", fullyTranslated: false},
            {path: "fr-FR/x/y.md", locale: "fr-FR", fullyTranslated: true},
            {path: "de-DE/x/y.md", locale: "de-DE", fullyTranslated: false},
            {path: "ja-JP/x/y.md", locale: "ja-JP", fullyTranslated: true}
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
                "de-DE/a/b/c.md",
                "fr-FR/x/y.md",
                "ja-JP/x/y.md"
            ],
            untranslated: [
                "fr-FR/a/b/c.md",
                "ja-JP/a/b/c.md",
                "de-DE/x/y.md"
            ]
        };
        expect(actual).toStrictEqual(expected);
    });
    test("MarkdownFileTypeProjectCloseFullyTranslatedOff", function() {
        expect.assertions(3);
        // clean up first
        fs.unlinkSync("./test/testfiles/subproject/translation-status.json");
        expect(!fs.existsSync("./test/testfiles/subproject/translation-status.json")).toBeTruthy();
        var p2 = ProjectFactory("./test/testfiles/subproject", {});
        var mdft = new MarkdownFileType(p2);
        expect(mdft).toBeTruthy();
        var statii = [
            {path: "fr-FR/a/b/c.md", locale: "fr-FR", fullyTranslated: false},
            {path: "de-DE/a/b/c.md", locale: "de-DE", fullyTranslated: true},
            {path: "ja-JP/a/b/c.md", locale: "ja-JP", fullyTranslated: false},
            {path: "fr-FR/x/y.md", locale: "fr-FR", fullyTranslated: true},
            {path: "de-DE/x/y.md", locale: "de-DE", fullyTranslated: false},
            {path: "ja-JP/x/y.md", locale: "ja-JP", fullyTranslated: true}
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
            markdown: {
                mappings: {
                    "**/*.mdx": {
                        "template": "[localeDir]/[filename]"
                    }
                }
            }
        });
        var mdft = new MarkdownFileType(p3);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.mdx")).toBeTruthy();
        var extensions = mdft.getExtensions();
        expect(extensions.indexOf(".mdx") > -1).toBeTruthy();
    });

    test("should include .mdx in default extensions", function() {
        expect.assertions(8);
        var p3 = new CustomProject({
            sourceLocale: "en-US",
            plugins: ["../."]
        }, "./test/testfiles", {
            locales:["en-GB"],
            markdown: {
                mappings: {
                    "**/*.md": {
                        "template": "[localeDir]/[filename]"
                    }
                }
            }
        });
        var mdft = new MarkdownFileType(p3);
        expect(mdft).toBeTruthy();
        var extensions = mdft.getExtensions();
        // check that default extensions are present, including .mdx
        expect(extensions.indexOf(".md") > -1).toBeTruthy();
        expect(extensions.indexOf(".markdown") > -1).toBeTruthy();
        expect(extensions.indexOf(".mdown") > -1).toBeTruthy();
        expect(extensions.indexOf(".mkd") > -1).toBeTruthy();
        expect(extensions.indexOf(".rst") > -1).toBeTruthy();
        expect(extensions.indexOf(".rmd") > -1).toBeTruthy();
        expect(extensions.indexOf(".mdx") > -1).toBeTruthy();
    });

    test("should handle .mdx files with mapping patterns", function() {
        expect.assertions(3);
        var p3 = new CustomProject({
            sourceLocale: "en-US",
            plugins: ["../."]
        }, "./test/testfiles", {
            locales:["en-GB"],
            markdown: {
                mappings: {
                    "**/*.mdx": {
                        "template": "[localeDir]/[filename]"
                    }
                }
            }
        });
        var mdft = new MarkdownFileType(p3);
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
            markdown: {
                mappings: {
                    "**/*.md": {
                        "template": "[localeDir]/[filename]"
                    }
                }
            }
        });
        var mdft = new MarkdownFileType(p3);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.mdoc")).toBeFalsy();
    });
});
