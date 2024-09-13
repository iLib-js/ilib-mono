/*
 * MrkdwnJsFileType.test.js - test the Mrkdwn file type handler object.
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
if (!MrkdwnJsFileType) {
    var MrkdwnJsFileType = require("../MrkdwnJsFileType.js");
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
            "file.js": {
                "template": "resources/[localeDir]/file.js"
            },
            "resources/en/US/file.js": {
                "template": "resources/[localeDir]/file.js"
            },
            "**/messages.js": {
                "template": "resources/[localeDir]/messages.js"
            },
            "**/test/str.js": {
                "template": "[dir]/[localeDir]/str.js"
            },
            "**/*.js": {
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
    test("MrkdwnJsFileTypeConstructor", function() {
        expect.assertions(1);
        var mdjft = new MrkdwnJsFileType(p);
        expect(mdjft).toBeTruthy();
    });
     test("MrkdwnJsFileTypeGetMapping1", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.getMapping("x/y/messages.js")).toStrictEqual({
            "template": "resources/[localeDir]/messages.js"
        });
    });
     test("MrkdwnJsFileTypeGetMapping2", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.getMapping("resources/en/US/file.js")).toStrictEqual({
            "template": "resources/[localeDir]/file.js"
        });
    });
     test("MrkdwnJsFileTypeGetMappingNoMatch", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.getMapping("x/y/msg.jsx")).toBeFalsy();
    });

    test("MrkdwnJsFileTypeHandles js with mrkdwn", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.js")).toBeTruthy();
    });

    test("MrkdwnJsFileTypeHandles json with mrkdwn with Windows file name extension", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.jsn")).toBeTruthy();
    });

    test("MrkdwnJsFileTypeHandlesMrkdwn", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.mrkdwn")).toBeFalsy();
    });
    test("MrkdwnJsFileTypeHandlesMdown", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.jsown")).toBeFalsy();
    });
    test("MrkdwnJsFileTypeHandlesMkd", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.mkd")).toBeFalsy();
    });
    test("MrkdwnJsFileTypeHandlesRst", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.rst")).toBeFalsy();
    });
    test("MrkdwnJsFileTypeHandlesRmd", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.rmd")).toBeFalsy();
    });
    test("MrkdwnJsFileTypeHandlesFalseClose", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("foo.tml")).toBeFalsy();
    });
    test("MrkdwnJsFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("a/b/c/foo.js")).toBeTruthy();
    });
    test("MrkdwnJsFileTypeHandlesAlreadyLocalizedGB", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("en-GB/a/b/c/foo.js")).toBeFalsy();
    });
    test("MrkdwnJsFileTypeHandlesAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("zh-Hans-CN/a/b/c/foo.js")).toBeFalsy();
    });
    test("MrkdwnJsFileTypeHandlesAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p2);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("en-ZA-ASDF/a/b/c/foo.js")).toBeFalsy();
    });
    test("MrkdwnJsFileTypeHandleszhHKAlreadyLocalizedWithFlavor", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p2);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("zh-Hant-HK-ASDF/a/b/c/foo.js")).toBeFalsy();
    });
    test("MrkdwnJsFileTypeHandlesSourceDirIsNotLocalized", function() {
        expect.assertions(2);
        var mdjft = new MrkdwnJsFileType(p2);
        expect(mdjft).toBeTruthy();
        expect(mdjft.handles("en-US/a/b/c/foo.js")).toBeTruthy();
    });
});
