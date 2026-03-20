/*
 * JsonFileType.test.js - test the json file type handler object.
 *
 * Copyright © 2021-2023, 2026 Box, Inc.
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

var path = require("path");

if (!JsonFileType) {
    var JsonFileType = require("../JsonFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"],
    json: {
        "mappings": {
            "strings.json": {
                "schema": "http://www.lge.com/json/strings",
                "method": "copy",
                "template": "resources/[localeDir]/strings2.json"
            },
            "resources/en/US/strings.json": {
                "schema": "http://www.lge.com/json/strings",
                "method": "copy",
                "template": "resources/[localeDir]/strings.json"
            },
            "**/messages.json": {
                "schema": "http://www.lge.com/json/messages",
                "method": "copy",
                "template": "resources/[localeDir]/messages.json"
            },
            "**/test/str.jsn": {
                "schema": "http://www.lge.com/json/str",
                "method": "copy",
                "template": "[dir]/[localeDir]/str.json"
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
    json: {
        mappings: {
            "**/strings.json": {
                "schema": "http://www.lge.com/json/strings",
                "method": "copy",
                "template": "resources/[localeDir]/strings.json"
            }
        }
    }
});


describe("jsonfiletype", function() {
    test("JsonFileTypeConstructor", function() {
        expect.assertions(1);

        var jft = new JsonFileType(p);

        expect(jft).toBeTruthy();
    });

    test("JsonFileTypeGetLocalizedPathLocaleDir", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template: 'resources/[localeDir]/strings.json'}, "x/y/strings.json", "de-DE")).toBe("resources/de/DE/strings.json");
    });

    test("JsonFileTypeGetLocalizedPathDir", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template: '[dir]/[localeDir]/strings.json'}, "x/y/strings.json", "de-DE")).toBe("x/y/de/DE/strings.json");
    });

    test("POFileTypeGetLocalizedPathDirWithLocaleMap", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({
            template:'[dir]/[localeDir]/strings.json',
            localeMap: {
                "de-DE": "de"
            }
        }, "x/y/strings.json", "de-DE")).toBe("x/y/de/strings.json");
    });

    test("POFileTypeGetLocalizedPathDirWithLocaleMapNotMapped", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({
            template:'[dir]/[localeDir]/strings.json',
            localeMap: {
                "de-DE": "de"
            }
        }, "x/y/strings.json", "fr-FR")).toBe("x/y/fr/FR/strings.json");
    });

    test("POFileTypeGetLocalizedPathDirWithGlobalLocaleMap", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p2);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({
            template: '[dir]/[localeDir]/strings.json'
        }, "x/y/strings.json", "de-DE")).toBe("x/y/de/strings.json");
    });

    test("POFileTypeGetLocalizedPathDirWithGlobalLocaleMapNotMapped", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p2);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({
            template: '[dir]/[localeDir]/strings.json'
        }, "x/y/strings.json", "fr-FR")).toBe("x/y/fr/FR/strings.json");
    });

    test("JsonFileTypeGetLocalizedPathBasename", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template: '[localeDir]/tr-[basename].j'}, "x/y/strings.json", "de-DE")).toBe("de/DE/tr-strings.j");
    });

    test("JsonFileTypeGetLocalizedPathFilename", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template: '[localeDir]/tr-[filename]'}, "x/y/strings.json", "de-DE")).toBe("de/DE/tr-strings.json");
    });

    test("JsonFileTypeGetLocalizedPathExtension", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template: '[localeDir]/tr-foobar.[extension]'}, "x/y/strings.jsn", "de-DE")).toBe("de/DE/tr-foobar.jsn");
    });

    test("JsonFileTypeGetLocalizedPathLocale", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template: '[dir]/[locale]/strings.json'}, "x/y/strings.json", "de-DE")).toBe("x/y/de-DE/strings.json");
    });

    test("JsonFileTypeGetLocalizedPathLanguage", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template: '[dir]/[language]/strings.json'}, "x/y/strings.json", "de-DE")).toBe("x/y/de/strings.json");
    });

    test("JsonFileTypeGetLocalizedPathRegion", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template: '[dir]/[region]/strings.json'}, "x/y/strings.json", "de-DE")).toBe("x/y/DE/strings.json");
    });

    test("JsonFileTypeGetLocalizedPathScript", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template: '[dir]/[script]/strings.json'}, "x/y/strings.json", "zh-Hans-CN")).toBe("x/y/Hans/strings.json");
    });

    test("JsonFileTypeGetLocalizedPathLocaleUnder", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({template: '[dir]/strings_[localeUnder].json'}, "x/y/strings.json", "zh-Hans-CN")).toBe("x/y/strings_zh_Hans_CN.json");
    });

    test("JsonFileTypeGetLocalizedPathNullMappingUsesDefaultTemplate", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath(undefined, "pkg/foo.json", "de-DE")).toBe(
            path.normalize("resources/de/DE/foo.json")
        );
    });

    test("JsonFileTypeGetLocalizedPathEmptyMappingUsesDefaultTemplate", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath({}, "pkg/foo.json", "ja-JP")).toBe(
            path.normalize("resources/ja/JP/foo.json")
        );
    });

    test("JsonFileTypeGetLocalizedPathDefaultTemplateRespectsProjectLocaleMap", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p2);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath(undefined, "pkg/foo.json", "de-DE")).toBe(
            path.normalize("resources/de/foo.json")
        );
    });

    test("JsonFileTypeGetLocalizedPathSourceAtRepoRoot", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getLocalizedPath(
            { template: "resources/[localeDir]/strings2.json" },
            "strings.json",
            "de-DE"
        )).toBe(path.normalize("resources/de/DE/strings2.json"));
    });

    test("JsonFileTypeGetLocalizedPathWhenSourcePathDoesNotMatchTemplateShape", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        // Default template is resources/[localeDir]/[filename]. parsePath may not match
        // (e.g. src/t1.js), but formatPath still needs sourcepath for [filename] — see
        // samples/js-json with resourceFileTypes javascript -> ilib-loctool-json.
        expect(jft.getLocalizedPath(undefined, "src/t1.js", "ko-KR")).toBe(
            path.normalize("resources/ko/KR/t1.js")
        );
    });

    test("JsonFileTypeGetOutputLocaleFromMappingLocaleMap", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getOutputLocale({ localeMap: { "de-DE": "de-AT" } }, "de-DE").getSpec()).toBe("de-AT");
    });

    test("JsonFileTypeGetOutputLocaleMappingOverridesProjectLocaleMap", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p2);
        expect(jft).toBeTruthy();

        expect(jft.getOutputLocale({ localeMap: { "de-DE": "de-AT" } }, "de-DE").getSpec()).toBe("de-AT");
    });

    test("JsonFileTypeGetOutputLocaleFallsThroughToProjectLocaleMap", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p2);
        expect(jft).toBeTruthy();

        expect(jft.getOutputLocale({ template: "[dir]/[localeDir]/strings.json" }, "de-DE").getSpec()).toBe("de");
    });

    test("JsonFileTypeGetOutputLocaleUndefinedMappingUsesProjectLocaleMap", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p2);
        expect(jft).toBeTruthy();

        expect(jft.getOutputLocale(undefined, "de-DE").getSpec()).toBe("de");
    });

    test("JsonFileTypeGetOutputLocaleUndefinedMappingNoProjectMap", function() {
        expect.assertions(3);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getOutputLocale(undefined, "fr-FR").getSpec()).toBe("fr-FR");
        expect(jft.getOutputLocale(null, "fr-FR").getSpec()).toBe("fr-FR");
    });

     test("JsonFileTypeGetMapping1", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getMapping("x/y/messages.json")).toStrictEqual({
            "schema": "http://www.lge.com/json/messages",
            "method": "copy",
            "template": "resources/[localeDir]/messages.json"
        });
    });

     test("JsonFileTypeGetMapping2", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getMapping("resources/en/US/strings.json")).toStrictEqual({
            "schema": "http://www.lge.com/json/strings",
            "method": "copy",
            "template": "resources/[localeDir]/strings.json"
        });
    });

     test("JsonFileTypeGetMapping3", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.getMapping("./messages.json")).toStrictEqual({
            "schema": "http://www.lge.com/json/messages",
            "method": "copy",
            "template": "resources/[localeDir]/messages.json"
        });
    });

     test("JsonFileTypeGetMappingNoMatch", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(!jft.getMapping("x/y/msg.jso")).toBeTruthy();
    });

    test("JsonFileTypeHandlesExtensionTrue", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.handles("strings.json")).toBeTruthy();
    });

    test("JsonFileTypeHandlesExtensionFalse", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(!jft.handles("strings.jsonhandle")).toBeTruthy();
    });

    test("JsonFileTypeHandlesNotSource", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(!jft.handles("foo.json")).toBeTruthy();
    });

    test("JsonFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.handles("x/y/z/messages.json")).toBeTruthy();
    });

    test("JsonFileTypeHandlesTrueWithDotDir", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.handles("./messages.json")).toBeTruthy();
    });

    test("JsonFileTypeHandlesFalseWrongDir", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(!jft.handles("x/y/z/str.jsn")).toBeTruthy();
    });

    test("JsonFileTypeHandlesFalseRightDir", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.handles("x/y/z/test/str.jsn")).toBeTruthy();
    });

    test("JsonFileTypeHandlesTrueSourceLocale", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        expect(jft.handles("resources/en/US/messages.json")).toBeTruthy();
    });

    test("JsonFileTypeHandlesAlternateExtensionTrue", function() {
        expect.assertions(3);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        // windows?
        expect(jft.handles("strings.jsn")).toBeTruthy();
        expect(jft.handles("strings.jso")).toBeTruthy();
    });

    test("JsonFileTypeHandlesAlreadyLocalizedGB", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        // This matches one of the templates, but thge locale is
        // not the source locale, so we don't need to
        // localize it again.
        expect(!jft.handles("resources/en/GB/messages.json")).toBeTruthy();
    });

    test("JsonFileTypeHandlesAlreadyLocalizedCN", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        // This matches one of the templates, but thge locale is
        // not the source locale, so we don't need to
        // localize it again.
        expect(!jft.handles("resources/zh/Hans/CN/messages.json")).toBeTruthy();
    });

    test("JsonFileTypeHandlesNotAlreadyLocalizedenUS", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        expect(jft).toBeTruthy();

        // we figure this out from the template
        expect(jft.handles("resources/en/US/messages.json")).toBeTruthy();
    });

    test("JsonFileTypeGetResourceFileUsesLocalizedPath", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        var rf = jft.getResourceFile("de-DE", "x/y/z/messages.json");

        expect(rf.pathName).toBe(path.normalize("resources/de/DE/messages.json"));
        expect(rf.localeSpec).toBe("de-DE");
    });

    test("JsonFileTypeGetResourceFileUsesLocalizedPathAlternateExtension", function() {
        expect.assertions(1);

        var jft = new JsonFileType(p);
        var rf = jft.getResourceFile("de-DE", "x/y/z/test/str.jsn");

        expect(rf.pathName).toBe(path.normalize("x/y/z/test/de/DE/str.json"));
    });

    test("JsonFileTypeGetResourceFileCachesPerLocale", function() {
        expect.assertions(2);

        var jft = new JsonFileType(p);
        var rf1 = jft.getResourceFile("de-DE", "x/y/z/messages.json");
        var rf2 = jft.getResourceFile("de-DE", "a/b/messages.json");

        expect(rf1).toBe(rf2);
        expect(rf1.pathName).toBe(path.normalize("resources/de/DE/messages.json"));
    });

    test("JsonFileTypeGetResourceFileUsesSourceLocaleWhenLocaleOmitted", function() {
        expect.assertions(1);

        var jft = new JsonFileType(p);
        var rf = jft.getResourceFile(undefined, "x/y/z/messages.json");

        expect(rf.pathName).toBe(path.normalize("resources/en/US/messages.json"));
    });

    test("JsonFileTypeRejectInvalidSchema", function() {
        expect.assertions(1);

        expect(function(test) {
            var mockproject = {
                getAPI: p.getAPI.bind(p),
                getSourceLocale: p.getSourceLocale.bind(p),
                settings: {
                    locales:["en-GB"],
                    targetDir: "testfiles",
                    nopseudo: true,
                    json: {
                        schemas: [
                            "./test/testfiles/invalid.json"
                        ],
                        mappings: {
                            "**/invalid.json": {
                                "schema": "http://github.com/ilib-js/invalid.json",
                                "method": "copy",
                                "template": "resources/invalid_[locale].json"
                            }
                        }
                    }
                }
            };

            // should throw an exception while trying to parse the invalid.json
            var jft = new JsonFileType(mockproject);
        }).toThrow();
    });
});
