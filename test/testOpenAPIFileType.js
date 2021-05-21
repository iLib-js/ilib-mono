/*
 * testOpenAPIFileType.js - test the Markdown file type handler object.
 *
 * Copyright © 2021, Box, Inc.
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

if (!OpenAPIFileType) {
    var OpenAPIFileType = require("../OpenAPIFileType");
    var CustomProject = require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    sourceLocale: "en-US",
    plugins: ["../."]
}, "./test/testfiles", {
    locales: ["en-GB"],
    openapi: {
        mappings: {
            "openapi.json": {
                schema: "openapi-schema",
                method: "copy",
                template: "resources/[localeDir]/openapi.json"
            },
            "resources/en/US/openapi.json": {
                schema: 'openapi-schema',
                method: 'copy',
                template: 'resources/[localeDir]/openapi.json'
            },
            "**/api.json": {
                schema: 'api-schema',
                method: 'copy',
                template: 'resources/[localeDir]/api.json'
            },
            "**/test/openapi.jsn": {
                schema: 'openapi-schema',
                method: 'copy',
                template: '[dir]/[localeDir]/openapi.json'
            }
        }
    }
});

module.exports.openapifiletype = {
    testConstructor: function(test) {
        test.expect(1);

        var oaft = new OpenAPIFileType(p);

        test.ok(oaft);

        test.done();
    },

    getLocalizedPath: {
        testGetLocalizedPathLocaleDir: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);

            test.ok(oaft);

            test.equals(
                oaft.getLocalizedPath('resources/[localeDir]/openapi.json', 'dirA/dirB/openapi.json', 'de-DE'),
                'resources/de/DE/openapi.json'
            );

            test.done();
        },

        testGetLocalizedPathDir: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(
                oaft.getLocalizedPath('[dir]/[localeDir]/openapi.json', "dirA/dirB/openapi.json", "de-DE"),
                "dirA/dirB/de/DE/openapi.json"
            );

            test.done();
        },

        testGetLocalizedPathBasename: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(
                oaft.getLocalizedPath('[localeDir]/tr-[basename].j', "dirA/dirB/openapi.json", "de-DE"),
                "de/DE/tr-openapi.j"
            );

            test.done();
        },

        testGetLocalizedPathFilename: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(
                oaft.getLocalizedPath('[localeDir]/tr-[filename]', "dirA/dirB/openapi.json", "de-DE"),
                "de/DE/tr-openapi.json"
            );

            test.done();
        },

        testGetLocalizedPathExtension: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(
                oaft.getLocalizedPath('[localeDir]/tr-foobar.[extension]', "dirA/dirB/openapi.jsn", "de-DE"),
                "de/DE/tr-foobar.jsn"
            );

            test.done();
        },

        testGetLocalizedPathLocale: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(
                oaft.getLocalizedPath('[dir]/[locale]/openapi.json', "dirA/dirB/openapi.json", "de-DE"),
                "dirA/dirB/de-DE/openapi.json"
            );

            test.done();
        },

        testGetLocalizedPathLanguage: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocalizedPath(
                '[dir]/[language]/openapi.json', "dirA/dirB/openapi.json", "de-DE"),
                "dirA/dirB/de/openapi.json"
            );

            test.done();
        },

        testGetLocalizedPathRegion: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(
                oaft.getLocalizedPath('[dir]/[region]/openapi.json', "dirA/dirB/openapi.json", "de-DE"),
                "dirA/dirB/DE/openapi.json"
            );

            test.done();
        },

        testGetLocalizedPathScript: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(
                oaft.getLocalizedPath('[dir]/[script]/openapi.json', "dirA/dirB/openapi.json", "zh-Hans-CN"),
                "dirA/dirB/Hans/openapi.json"
            );

            test.done();
        },

        testGetLocalizedPathLocaleUnder: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(
                oaft.getLocalizedPath('[dir]/openapi_[localeUnder].json', "dirA/dirB/openapi.json", "zh-Hans-CN"),
                "dirA/dirB/openapi_zh_Hans_CN.json"
            );

            test.done();
        }
    },

    getLocaleFromPath: {
        testGetLocaleFromPathDir: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[dir]/openapi.json', "dirA/dirB/openapi.json"), "");

            test.done();
        },

        testGetLocaleFromPathBasename: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[dir]/[basename].json', "dirA/dirB/openapi.json"), "");

            test.done();
        },

        testGetLocaleFromPathFilename: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[dir]/[filename]', "dirA/dirB/openapi.json"), "");

            test.done();
        },

        testGetLocaleFromPathLocale: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[dir]/[locale]/openapi.json', "dirA/dirB/de-DE/openapi.json"), "de-DE");

            test.done();
        },

        testGetLocaleFromPathLocaleLong: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[dir]/[locale]/openapi.json', "dirA/dirB/zh-Hans-CN/openapi.json"), "zh-Hans-CN");

            test.done();
        },

        testGetLocaleFromPathLocaleShort: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[dir]/[locale]/openapi.json', "dirA/dirB/fr/openapi.json"), "fr");

            test.done();
        },

        testGetLocaleFromPathLanguage: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[dir]/[language]/openapi.json', "dirA/dirB/de/openapi.json"), "de");

            test.done();
        },

        testGetLocaleFromPathScript: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[dir]/[language]-[script]/openapi.json', "dirA/dirB/zh-Hans/openapi.json"), "zh-Hans");

            test.done();
        },

        testGetLocaleFromPathRegion: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[dir]/[region]/openapi.json', "dirA/dirB/JP/openapi.json"), "JP");

            test.done();
        },

        testGetLocaleFromPathLocaleDir: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[dir]/[localeDir]/openapi.json', "dirA/dirB/de/DE/openapi.json"), "de-DE");

            test.done();
        },

        testGetLocaleFromPathLocaleDirShort: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[dir]/[localeDir]/openapi.json', "dirA/dirB/de/openapi.json"), "de");

            test.done();
        },

        testGetLocaleFromPathLocaleDirLong: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[dir]/[localeDir]/openapi.json', "dirA/dirB/zh/Hans/CN/openapi.json"), "zh-Hans-CN");

            test.done();
        },

        testGetLocaleFromPathLocaleDirStart: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[localeDir]/openapi.json', "de/DE/openapi.json"), "de-DE");

            test.done();
        },

        testGetLocaleFromPathLocaleUnder: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[dir]/openapi_[localeUnder].json', "dirA/dirB/openapi_de_DE.json"), "de-DE");

            test.done();
        },

        testGetLocaleFromPathLocaleUnderShort: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[dir]/openapi_[localeUnder].json', "dirA/dirB/openapi_de.json"), "de");

            test.done();
        },

        testGetLocaleFromPathLocaleUnderLong: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.equals(oaft.getLocaleFromPath('[dir]/openapi_[localeUnder].json', "dirA/dirB/openapi_zh_Hans_CN.json"), "zh-Hans-CN");

            test.done();
        }
    },

    getMapping: {
        testGetMapping1: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.deepEqual(
                oaft.getMapping("dirA/dirB/api.json"),
                {
                    schema: 'api-schema',
                    method: 'copy',
                    template: 'resources/[localeDir]/api.json'
                }
            );

            test.done();
        },

        testGetMapping2: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.deepEqual(
                oaft.getMapping('resources/en/US/openapi.json'),
                {
                    schema: 'openapi-schema',
                    method: 'copy',
                    template: 'resources/[localeDir]/openapi.json'
                }
            );

            test.done();
        },

        testGetMappingNoMatch: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.ok(!oaft.getMapping("dirA/dirB/msg.jso"));

            test.done();
        }
    },

    handles: {
        testHandlesExtensionTrue: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.ok(oaft.handles('openapi.json'));

            test.done();
        },

        testHandlesExtensionFalse: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.ok(!oaft.handles('openapi.jsonhandle'));

            test.done();
        },

        testHandlesNotSource: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.ok(!oaft.handles('foo.json'));

            test.done();
        },

        testHandlesTrueWithDir: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.ok(oaft.handles('dirA/dirB/dirC/api.json'));

            test.done();
        },

        testHandlesFalseWrongDir: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.ok(!oaft.handles('dirA/dirB/dirC/openapi.jsn'));

            test.done();
        },

        testHandlesFalseRightDir: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.ok(oaft.handles('dirA/dirB/dirC/test/openapi.jsn'));

            test.done();
        },

        testHandlesTrueSourceLocale: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            test.ok(oaft.handles('resources/en/US/api.json'));

            test.done();
        },

        testHandlesAlternateExtensionTrue: function(test) {
            test.expect(3);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            // windows?
            test.ok(oaft.handles('openapi.jsn'));
            test.ok(oaft.handles('openapi.jso'));

            test.done();
        },

        testHandlesAlreadyLocalizedGB: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            // This matches one of the templates, but the locale is
            // not the source locale, so we don't need to
            // localize it again.
            test.ok(!oaft.handles('resources/en/GB/openapi.json'));

            test.done();
        },

        testHandlesAlreadyLocalizedCN: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            // This matches one of the templates, but the locale is
            // not the source locale, so we don't need to
            // localize it again.
            test.ok(!oaft.handles('resources/zh/Hans/CN/openapi.json'));

            test.done();
        },

        testHandlesNotAlreadyLocalizedenUS: function(test) {
            test.expect(2);

            var oaft = new OpenAPIFileType(p);
            test.ok(oaft);

            // we figure this out from the template
            test.ok(oaft.handles('resources/en/US/api.json'));

            test.done();
        }
    }
}
