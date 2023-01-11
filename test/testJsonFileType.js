/*
 * testJsonFileType.js - test the json file type handler object.
 *
 * Copyright © 2021-2023, Box, Inc.
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


module.exports.jsonfiletype = {
    testJsonFileTypeConstructor: function(test) {
        test.expect(1);

        var jft = new JsonFileType(p);

        test.ok(jft);

        test.done();
    },

    testJsonFileTypeGetLocalizedPathLocaleDir: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath({template: 'resources/[localeDir]/strings.json'}, "x/y/strings.json", "de-DE"), "resources/de/DE/strings.json");

        test.done();
    },

    testJsonFileTypeGetLocalizedPathDir: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath({template: '[dir]/[localeDir]/strings.json'}, "x/y/strings.json", "de-DE"), "x/y/de/DE/strings.json");

        test.done();
    },

    testPOFileTypeGetLocalizedPathDirWithLocaleMap: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath({
            template:'[dir]/[localeDir]/strings.json',
            localeMap: {
                "de-DE": "de"
            }
        }, "x/y/strings.json", "de-DE"), "x/y/de/strings.json");

        test.done();
    },

    testPOFileTypeGetLocalizedPathDirWithLocaleMapNotMapped: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath({
            template:'[dir]/[localeDir]/strings.json',
            localeMap: {
                "de-DE": "de"
            }
        }, "x/y/strings.json", "fr-FR"), "x/y/fr/FR/strings.json");

        test.done();
    },

    testPOFileTypeGetLocalizedPathDirWithGlobalLocaleMap: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p2);
        test.ok(jft);

        test.equals(jft.getLocalizedPath({
            template: '[dir]/[localeDir]/strings.json'
        }, "x/y/strings.json", "de-DE"), "x/y/de/strings.json");

        test.done();
    },

    testPOFileTypeGetLocalizedPathDirWithGlobalLocaleMapNotMapped: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p2);
        test.ok(jft);

        test.equals(jft.getLocalizedPath({
            template: '[dir]/[localeDir]/strings.json'
        }, "x/y/strings.json", "fr-FR"), "x/y/fr/FR/strings.json");

        test.done();
    },

    testJsonFileTypeGetLocalizedPathBasename: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath({template: '[localeDir]/tr-[basename].j'}, "x/y/strings.json", "de-DE"), "de/DE/tr-strings.j");

        test.done();
    },

    testJsonFileTypeGetLocalizedPathFilename: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath({template: '[localeDir]/tr-[filename]'}, "x/y/strings.json", "de-DE"), "de/DE/tr-strings.json");

        test.done();
    },

    testJsonFileTypeGetLocalizedPathExtension: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath({template: '[localeDir]/tr-foobar.[extension]'}, "x/y/strings.jsn", "de-DE"), "de/DE/tr-foobar.jsn");

        test.done();
    },

    testJsonFileTypeGetLocalizedPathLocale: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath({template: '[dir]/[locale]/strings.json'}, "x/y/strings.json", "de-DE"), "x/y/de-DE/strings.json");

        test.done();
    },

    testJsonFileTypeGetLocalizedPathLanguage: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath({template: '[dir]/[language]/strings.json'}, "x/y/strings.json", "de-DE"), "x/y/de/strings.json");

        test.done();
    },

    testJsonFileTypeGetLocalizedPathRegion: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath({template: '[dir]/[region]/strings.json'}, "x/y/strings.json", "de-DE"), "x/y/DE/strings.json");

        test.done();
    },

    testJsonFileTypeGetLocalizedPathScript: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath({template: '[dir]/[script]/strings.json'}, "x/y/strings.json", "zh-Hans-CN"), "x/y/Hans/strings.json");

        test.done();
    },

    testJsonFileTypeGetLocalizedPathLocaleUnder: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.equals(jft.getLocalizedPath({template: '[dir]/strings_[localeUnder].json'}, "x/y/strings.json", "zh-Hans-CN"), "x/y/strings_zh_Hans_CN.json");

        test.done();
    },

     testJsonFileTypeGetMapping1: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.deepEqual(jft.getMapping("x/y/messages.json"), {
            "schema": "http://www.lge.com/json/messages",
            "method": "copy",
            "template": "resources/[localeDir]/messages.json"
        });

        test.done();
    },

     testJsonFileTypeGetMapping2: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.deepEqual(jft.getMapping("resources/en/US/strings.json"), {
            "schema": "http://www.lge.com/json/strings",
            "method": "copy",
            "template": "resources/[localeDir]/strings.json"
        });

        test.done();
    },

     testJsonFileTypeGetMapping3: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.deepEqual(jft.getMapping("./messages.json"), {
            "schema": "http://www.lge.com/json/messages",
            "method": "copy",
            "template": "resources/[localeDir]/messages.json"
        });

        test.done();
    },

     testJsonFileTypeGetMappingNoMatch: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.ok(!jft.getMapping("x/y/msg.jso"));

        test.done();
    },

    testJsonFileTypeHandlesExtensionTrue: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.ok(jft.handles("strings.json"));

        test.done();
    },

    testJsonFileTypeHandlesExtensionFalse: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.ok(!jft.handles("strings.jsonhandle"));

        test.done();
    },

    testJsonFileTypeHandlesNotSource: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.ok(!jft.handles("foo.json"));

        test.done();
    },

    testJsonFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.ok(jft.handles("x/y/z/messages.json"));

        test.done();
    },

    testJsonFileTypeHandlesTrueWithDotDir: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.ok(jft.handles("./messages.json"));

        test.done();
    },

    testJsonFileTypeHandlesFalseWrongDir: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.ok(!jft.handles("x/y/z/str.jsn"));

        test.done();
    },

    testJsonFileTypeHandlesFalseRightDir: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.ok(jft.handles("x/y/z/test/str.jsn"));

        test.done();
    },

    testJsonFileTypeHandlesTrueSourceLocale: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        test.ok(jft.handles("resources/en/US/messages.json"));

        test.done();
    },

    testJsonFileTypeHandlesAlternateExtensionTrue: function(test) {
        test.expect(3);

        var jft = new JsonFileType(p);
        test.ok(jft);

        // windows?
        test.ok(jft.handles("strings.jsn"));
        test.ok(jft.handles("strings.jso"));

        test.done();
    },

    testJsonFileTypeHandlesAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        // This matches one of the templates, but thge locale is
        // not the source locale, so we don't need to
        // localize it again.
        test.ok(!jft.handles("resources/en/GB/messages.json"));

        test.done();
    },

    testJsonFileTypeHandlesAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        // This matches one of the templates, but thge locale is
        // not the source locale, so we don't need to
        // localize it again.
        test.ok(!jft.handles("resources/zh/Hans/CN/messages.json"));

        test.done();
    },

    testJsonFileTypeHandlesNotAlreadyLocalizedenUS: function(test) {
        test.expect(2);

        var jft = new JsonFileType(p);
        test.ok(jft);

        // we figure this out from the template
        test.ok(jft.handles("resources/en/US/messages.json"));

        test.done();
    },

    testJsonFileTypeRejectInvalidSchema: function(test) {
        test.expect(1);

        test.throws(function(test) {
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
        });

        test.done();
    }
};
