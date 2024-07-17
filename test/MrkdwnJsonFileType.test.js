/*
 * MrkdwnJsonFileType.test.js - test the Mrkdwn file type handler object.
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
var fs = require("fs");
if (!MrkdwnJsonFileType) {
    var MrkdwnJsonFileType = require("../MrkdwnJsonFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
    var ProjectFactory =  require("loctool/lib/ProjectFactory.js");
}
var p = new CustomProject({
    sourceLocale: "en-US",
    plugins: ["../."]
}, "./test/testfiles", {
    locales:["en-GB"],
    mrkdwn: {
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
    mrkdwn: {
        fullyTranslated: true
    }
});
describe("mrkdwnfiletype", function() {
    test("MrkdwnJsonFileTypeConstructor", function() {
        expect.assertions(1);
        var mdft = new MrkdwnJsonFileType(p);
        expect(mdft).toBeTruthy();
    });
     test("MrkdwnJsonFileTypeGetMapping1", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.getMapping("x/y/messages.md")).toStrictEqual({
            "template": "resources/[localeDir]/messages.md"
        });
    });
     test("MrkdwnJsonFileTypeGetMapping2", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.getMapping("resources/en/US/file.md")).toStrictEqual({
            "template": "resources/[localeDir]/file.md"
        });
    });
     test("MrkdwnJsonFileTypeGetMappingNoMatch", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p);
        expect(mdft).toBeTruthy();
        expect(!mdft.getMapping("x/y/msg.mdx")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeHandlesMD", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.md")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeHandlesMrkdwn", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.mrkdwn")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeHandlesMdown", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.mdown")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeHandlesMkd", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.mkd")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeHandlesRst", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.rst")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeHandlesRmd", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("foo.rmd")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeHandlesFalseClose", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p);
        expect(mdft).toBeTruthy();
        expect(!mdft.handles("foo.tml")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("a/b/c/foo.md")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeHandlesAlreadyLocalizedGB", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p);
        expect(mdft).toBeTruthy();
        expect(!mdft.handles("en-GB/a/b/c/foo.md")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeHandlesAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p);
        expect(mdft).toBeTruthy();
        expect(!mdft.handles("zh-Hans-CN/a/b/c/foo.md")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeHandlesAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p2);
        expect(mdft).toBeTruthy();
        expect(!mdft.handles("en-ZA-ASDF/a/b/c/foo.md")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeHandleszhHKAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p2);
        expect(mdft).toBeTruthy();
        expect(!mdft.handles("zh-Hant-HK-ASDF/a/b/c/foo.md")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeHandlesSourceDirIsNotLocalized", function() {
        expect.assertions(2);
        var mdft = new MrkdwnJsonFileType(p2);
        expect(mdft).toBeTruthy();
        expect(mdft.handles("en-US/a/b/c/foo.md")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeProjectCloseFullyTranslatedOn", function() {
        expect.assertions(3);
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mrkdwn: {
                fullyTranslated: true
            }
        });
        var mdft = new MrkdwnJsonFileType(p2);
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
    test("MrkdwnJsonFileTypeProjectCloseFullyTranslatedOff", function() {
        expect.assertions(3);
        // clean up first
        fs.unlinkSync("./test/testfiles/subproject/translation-status.json");
        expect(!fs.existsSync("./test/testfiles/subproject/translation-status.json")).toBeTruthy();
        var p2 = ProjectFactory("./test/testfiles/subproject", {});
        var mdft = new MrkdwnJsonFileType(p2);
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
});
