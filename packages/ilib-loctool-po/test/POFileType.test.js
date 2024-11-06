/*
 * POFileType.test.js - test the po file type handler object.
 *
 * Copyright © 2021, 2023 Box, Inc.
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

if (!POFileType) {
    var POFileType = require("../POFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"],
    po: {
        "mappings": {
            "en.pot": {
                "template": "[dir]/[locale].po"
            },
            "resources/en/US/strings.po": {
                "template": "resources/[localeDir]/strings.po"
            },
            "**/messages.po": {
                "template": "resources/[localeDir]/messages.po"
            },
            "**/test/str.pot": {
                "template": "[dir]/[localeDir]/str.po"
            },
            "*.po": {
                "template": "[dir]/[locale].po"
            },
            "**/*.pot": {
                "template": "[dir]/[locale].po"
            }
        }
    }
});


var p2 = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"],
    localeMap: {
        "de-DE": "de"
    },
    po: {
        mappings: {
            "**/strings.po": {
                "method": "copy",
                "template": "resources/[localeDir]/strings.po"
            }
        }
    }
});


describe("pofiletype", function() {
    test("POFileTypeConstructor", function() {
        expect.assertions(1);

        var jft = new POFileType(p);

        expect(jft).toBeTruthy();
    });

    test("POFileTypeGetLocalizedPathLocaleDir", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template:'resources/[localeDir]/strings.po'}, "x/y/strings.po", "de-DE")).toBe("resources/de/DE/strings.po");
    });

    test("POFileTypeGetLocalizedPathDir", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template:'[dir]/[localeDir]/strings.po'}, "x/y/strings.po", "de-DE")).toBe("x/y/de/DE/strings.po");
    });

    test("POFileTypeGetLocalizedPathDirWithLocaleMap", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({
            template:'[dir]/[localeDir]/strings.po',
            localeMap: {
                "de-DE": "de"
            }
        }, "x/y/strings.po", "de-DE")).toBe("x/y/de/strings.po");
    });

    test("POFileTypeGetLocalizedPathDirWithLocaleMap", function() {
        expect.assertions(2);

        var jft = new POFileType(p2);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template:'[dir]/[localeDir]/strings.po'}, "x/y/strings.po", "de-DE")).toBe("x/y/de/strings.po");
    });

    test("POFileTypeGetLocalizedPathBasename", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template:'[localeDir]/tr-[basename].j'}, "x/y/strings.po", "de-DE")).toBe("de/DE/tr-strings.j");
    });

    test("POFileTypeGetLocalizedPathFilename", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template:'[localeDir]/tr-[filename]'}, "x/y/strings.po", "de-DE")).toBe("de/DE/tr-strings.po");
    });

    test("POFileTypeGetLocalizedPathExtension", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template:'[localeDir]/tr-foobar.[extension]'}, "x/y/strings.jsn", "de-DE")).toBe("de/DE/tr-foobar.jsn");
    });

    test("POFileTypeGetLocalizedPathLocale", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template:'[dir]/[locale]/strings.po'}, "x/y/strings.po", "de-DE")).toBe("x/y/de-DE/strings.po");
    });

    test("POFileTypeGetLocalizedPathLocaleWithLocaleMap", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({
            template: '[dir]/[locale]/strings.po',
            localeMap: {
                "de-DE": "de"
            }
        }, "x/y/strings.po", "de-DE")).toBe("x/y/de/strings.po");
    });

    test("POFileTypeGetLocalizedPathLocaleWithLocaleMap", function() {
        expect.assertions(2);

        var jft = new POFileType(p2);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template:'[dir]/[locale]/strings.po'}, "x/y/strings.po", "de-DE")).toBe("x/y/de/strings.po");
    });

    test("POFileTypeGetLocalizedPathLanguage", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template:'[dir]/[language]/strings.po'}, "x/y/strings.po", "de-DE")).toBe("x/y/de/strings.po");
    });

    test("POFileTypeGetLocalizedPathLanguageWithLocaleMap", function() {
        expect.assertions(2);

        var jft = new POFileType(p2);
        expect(jft).toBeTruthy();

        // no change
        expect(jft.getLocalizedPath({template:'[dir]/[language]/strings.po'}, "x/y/strings.po", "de-DE")).toBe("x/y/de/strings.po");
    });

    test("POFileTypeGetLocalizedPathRegion", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template:'[dir]/[region]/strings.po'}, "x/y/strings.po", "de-DE")).toBe("x/y/DE/strings.po");
    });

    test("POFileTypeGetLocalizedPathRegionWithLocaleMap", function() {
        expect.assertions(2);

        var jft = new POFileType(p2);
        expect(jft).toBeTruthy();

        // no region after the mapping, so it should skip the parts that don't exist
        expect(jft.getLocalizedPath({template:'[dir]/[region]/strings.po'}, "x/y/strings.po", "de-DE")).toBe("x/y/strings.po");
    });

    test("POFileTypeGetLocalizedPathScript", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template:'[dir]/[script]/strings.po'}, "x/y/strings.po", "zh-Hans-CN")).toBe("x/y/Hans/strings.po");
    });

    test("POFileTypeGetLocalizedPathLocaleUnder", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template:'[dir]/strings_[localeUnder].po'}, "x/y/strings.po", "zh-Hans-CN")).toBe("x/y/strings_zh_Hans_CN.po");
    });

    test("POFileTypeGetLocalizedPathLocaleUnderWithLocaleMap", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({
            template: '[dir]/strings_[localeUnder].po',
            localeMap: {
                "zh-Hans-CN": "zh-CN"
            }
        }, "x/y/strings.po", "zh-Hans-CN")).toBe("x/y/strings_zh_CN.po");
    });

     test("POFileTypeGetMapping1", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getMapping("x/y/messages.po")).toStrictEqual({
            "template": "resources/[localeDir]/messages.po"
        });
    });

     test("POFileTypeGetMapping2", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getMapping("resources/en/US/strings.po")).toStrictEqual({
            "template": "resources/[localeDir]/strings.po"
        });
    });

     test("POFileTypeGetMappingNoMatch", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(!jft.getMapping("x/y/msg.pso")).toBeTruthy();
    });

    test("POFileTypeHandlesExtensionPOTrue", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.handles("en-US.po")).toBeTruthy();
    });

    test("POFileTypeHandlesExtensionPOTTrue", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.handles("strings.pot")).toBeTruthy();
    });

    test("POFileTypeHandlesExtensionFalse", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(!jft.handles("en-US.pohandle")).toBeTruthy();
    });

    test("POFileTypeHandlesNotSource", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(!jft.handles("de.po")).toBeTruthy();
    });

    test("POFileTypeHandlesSource", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.handles("en-US.po")).toBeTruthy();
    });

    test("POFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.handles("x/y/z/messages.pot")).toBeTruthy();
    });

    test("POFileTypeHandlesWrongDir", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(!jft.handles("x/y/z/test/de-DE.pot")).toBeTruthy();
    });

    test("POFileTypeHandlesRightDir", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.handles("x/y/z/test/str.pot")).toBeTruthy();
    });

    test("POFileTypeHandlesTrueSourceLocale", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.handles("resources/en/US/messages.pot")).toBeTruthy();
    });

    test("POFileTypeHandlesAlternateExtensionTrue", function() {
        expect.assertions(3);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.handles("en-US.po")).toBeTruthy();
        expect(jft.handles("en-US.pot")).toBeTruthy();
    });

    test("POFileTypeHandlesAlreadyLocalizedGB", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        // This matches one of the templates, but thge locale is
        // not the source locale, so we don't need to
        // localize it again.
        expect(!jft.handles("resources/en/GB/messages.po")).toBeTruthy();
    });

    test("POFileTypeHandlesAlreadyLocalizedCN", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        // This matches one of the templates, but thge locale is
        // not the source locale, so we don't need to
        // localize it again.
        expect(!jft.handles("resources/zh/Hans/CN/messages.po")).toBeTruthy();
    });

    test("POFileTypeHandlesNotAlreadyLocalizedenUS", function() {
        expect.assertions(2);

        var jft = new POFileType(p);
        expect(jft).toBeTruthy();

        // we figure this out from the template
        expect(jft.handles("resources/en/US/messages.po")).toBeTruthy();
    });
});
