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
            "file.json": {
                "template": "resources/[localeDir]/file.json"
            },
            "resources/en/US/file.json": {
                "template": "resources/[localeDir]/file.json"
            },
            "**/messages.json": {
                "template": "resources/[localeDir]/messages.json"
            },
            "**/test/str.json": {
                "template": "[dir]/[localeDir]/str.json"
            },
            "**/*.json": {
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
    }
});
describe("mrkdwnfiletype", function() {
    test("MrkdwnJsonFileTypeConstructor", function() {
        expect.assertions(1);
        var mdjft = new MrkdwnJsonFileType(p);
        expect(mdjft).toBeTruthy();
    });
     test("MrkdwnJsonFileTypeGetMapping1", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.getMapping("x/y/messages.json")).toStrictEqual({
            "template": "resources/[localeDir]/messages.json"
        });
    });
     test("MrkdwnJsonFileTypeGetMapping2", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.getMapping("resources/en/US/file.json")).toStrictEqual({
            "template": "resources/[localeDir]/file.json"
        });
    });
     test("MrkdwnJsonFileTypeGetMappingNoMatch", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.getMapping("x/y/msg.jsonx")).toBeFalsy();
    });

    test("MrkdwnJsonFileTypeHandles json with mrkdwn", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.json")).toBeTruthy();
    });

    test("MrkdwnJsonFileTypeHandles json with mrkdwn with Windows file name extension", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.jsn")).toBeTruthy();
    });

    test("MrkdwnJsonFileTypeHandlesMrkdwn", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.mrkdwn")).toBeFalsy();
    });
    test("MrkdwnJsonFileTypeHandlesMdown", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.jsonown")).toBeFalsy();
    });
    test("MrkdwnJsonFileTypeHandlesMkd", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.mkd")).toBeFalsy();
    });
    test("MrkdwnJsonFileTypeHandlesRst", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.rst")).toBeFalsy();
    });
    test("MrkdwnJsonFileTypeHandlesRmd", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.rmd")).toBeFalsy();
    });
    test("MrkdwnJsonFileTypeHandlesFalseClose", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.tml")).toBeFalsy();
    });
    test("MrkdwnJsonFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("a/b/c/foo.json")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeHandlesAlreadyLocalizedGB", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("en-GB/a/b/c/foo.json")).toBeFalsy();
    });
    test("MrkdwnJsonFileTypeHandlesAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("zh-Hans-CN/a/b/c/foo.json")).toBeFalsy();
    });
    test("MrkdwnJsonFileTypeHandlesAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p2);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("en-ZA-ASDF/a/b/c/foo.json")).toBeFalsy();
    });
    test("MrkdwnJsonFileTypeHandleszhHKAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p2);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("zh-Hant-HK-ASDF/a/b/c/foo.json")).toBeFalsy();
    });
    test("MrkdwnJsonFileTypeHandlesSourceDirIsNotLocalized", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsonFileType(p2);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("en-US/a/b/c/foo.json")).toBeTruthy();
    });
    test("MrkdwnJsonFileTypeProjectCloseFullyTranslatedOn", function() {
        expect.assertions(3);
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mrkdwn: {
                fullyTranslated: true
            }
        });
        var mdjft = new MrkdwnJsonFileType(p2);
        expect(mdjft).toBeTruthy();
        var statii = [
            {path: "fr-FR/a/b/c.json", locale: "fr-FR", fullyTranslated: false},
            {path: "de-DE/a/b/c.json", locale: "de-DE", fullyTranslated: true},
            {path: "ja-JP/a/b/c.json", locale: "ja-JP", fullyTranslated: false},
            {path: "fr-FR/x/y.json", locale: "fr-FR", fullyTranslated: true},
            {path: "de-DE/x/y.json", locale: "de-DE", fullyTranslated: false},
            {path: "ja-JP/x/y.json", locale: "ja-JP", fullyTranslated: true}
        ];
        statii.forEach(function(status) {
            mdjft.addTranslationStatus(status);
        });
        mdjft.projectClose();
        expect(fs.existsSync("./test/testfiles/subproject/translation-status.json")).toBeTruthy();
        var contents = fs.readFileSync("./test/testfiles/subproject/translation-status.json", "utf-8");
        var actual = JSON.parse(contents);
        var expected = {
            translated: [
                "de-DE/a/b/c.json",
                "fr-FR/x/y.json",
                "ja-JP/x/y.json"
            ],
            untranslated: [
                "fr-FR/a/b/c.json",
                "ja-JP/a/b/c.json",
                "de-DE/x/y.json"
            ]
        };
        expect(actual).toStrictEqual(expected);
    });
    test("MrkdwnJsonFileTypeProjectCloseFullyTranslatedOff", function() {
        expect.assertions(3);
        // clean up first
        fs.unlinkSync("./test/testfiles/subproject/translation-status.json");
        expect(fs.existsSync("./test/testfiles/subproject/translation-status.json")).toBeFalsy();
        var p2 = ProjectFactory("./test/testfiles/subproject", {});
        var mdjft = new MrkdwnJsonFileType(p2);
        expect(mdjft).toBeTruthy();
        var statii = [
            {path: "fr-FR/a/b/c.json", locale: "fr-FR", fullyTranslated: false},
            {path: "de-DE/a/b/c.json", locale: "de-DE", fullyTranslated: true},
            {path: "ja-JP/a/b/c.json", locale: "ja-JP", fullyTranslated: false},
            {path: "fr-FR/x/y.json", locale: "fr-FR", fullyTranslated: true},
            {path: "de-DE/x/y.json", locale: "de-DE", fullyTranslated: false},
            {path: "ja-JP/x/y.json", locale: "ja-JP", fullyTranslated: true}
        ];
        statii.forEach(function(status) {
            mdjft.addTranslationStatus(status);
        });
        mdjft.projectClose();
        expect(fs.existsSync("./test/testfiles/subproject/translation-status.json")).toBeFalsy();
    });
});
