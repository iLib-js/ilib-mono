/*
 * OpenAPIFileType.test.js - test the Markdown file type handler object.
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

describe("openapifiletype", function() {
    test("Constructor", function() {
        expect.assertions(1);

        var oaft = new OpenAPIFileType(p);

        expect(oaft).toBeTruthy();
    });

    describe("getLocalizedPath", function() {
        test("GetLocalizedPathLocaleDir", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);

            expect(oaft).toBeTruthy();

            expect(
                oaft.getLocalizedPath('resources/[localeDir]/openapi.json', 'dirA/dirB/openapi.json', 'de-DE')
            ).toBe('resources/de/DE/openapi.json');
        });

        test("GetLocalizedPathDir", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(
                oaft.getLocalizedPath('[dir]/[localeDir]/openapi.json', "dirA/dirB/openapi.json", "de-DE")
            ).toBe("dirA/dirB/de/DE/openapi.json");
        });

        test("GetLocalizedPathBasename", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(
                oaft.getLocalizedPath('[localeDir]/tr-[basename].j', "dirA/dirB/openapi.json", "de-DE")
            ).toBe("de/DE/tr-openapi.j");
        });

        test("GetLocalizedPathFilename", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(
                oaft.getLocalizedPath('[localeDir]/tr-[filename]', "dirA/dirB/openapi.json", "de-DE")
            ).toBe("de/DE/tr-openapi.json");
        });

        test("GetLocalizedPathExtension", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(
                oaft.getLocalizedPath('[localeDir]/tr-foobar.[extension]', "dirA/dirB/openapi.jsn", "de-DE")
            ).toBe("de/DE/tr-foobar.jsn");
        });

        test("GetLocalizedPathLocale", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(
                oaft.getLocalizedPath('[dir]/[locale]/openapi.json', "dirA/dirB/openapi.json", "de-DE")
            ).toBe("dirA/dirB/de-DE/openapi.json");
        });

        test("GetLocalizedPathLanguage", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocalizedPath(
                '[dir]/[language]/openapi.json', "dirA/dirB/openapi.json", "de-DE")
            ).toBe("dirA/dirB/de/openapi.json");
        });

        test("GetLocalizedPathRegion", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(
                oaft.getLocalizedPath('[dir]/[region]/openapi.json', "dirA/dirB/openapi.json", "de-DE")
            ).toBe("dirA/dirB/DE/openapi.json");
        });

        test("GetLocalizedPathScript", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(
                oaft.getLocalizedPath('[dir]/[script]/openapi.json', "dirA/dirB/openapi.json", "zh-Hans-CN")
            ).toBe("dirA/dirB/Hans/openapi.json");
        });

        test("GetLocalizedPathLocaleUnder", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(
                oaft.getLocalizedPath('[dir]/openapi_[localeUnder].json', "dirA/dirB/openapi.json", "zh-Hans-CN")
            ).toBe("dirA/dirB/openapi_zh_Hans_CN.json");
        });
    });

    describe("getLocaleFromPath", function() {
        test("GetLocaleFromPathDir", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[dir]/openapi.json', "dirA/dirB/openapi.json")).toBe("");
        });

        test("GetLocaleFromPathBasename", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[dir]/[basename].json', "dirA/dirB/openapi.json")).toBe("");
        });

        test("GetLocaleFromPathFilename", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[dir]/[filename]', "dirA/dirB/openapi.json")).toBe("");
        });

        test("GetLocaleFromPathLocale", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[dir]/[locale]/openapi.json', "dirA/dirB/de-DE/openapi.json")).toBe("de-DE");
        });

        test("GetLocaleFromPathLocaleLong", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[dir]/[locale]/openapi.json', "dirA/dirB/zh-Hans-CN/openapi.json")).toBe("zh-Hans-CN");
        });

        test("GetLocaleFromPathLocaleShort", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[dir]/[locale]/openapi.json', "dirA/dirB/fr/openapi.json")).toBe("fr");
        });

        test("GetLocaleFromPathLanguage", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[dir]/[language]/openapi.json', "dirA/dirB/de/openapi.json")).toBe("de");
        });

        test("GetLocaleFromPathScript", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[dir]/[language]-[script]/openapi.json', "dirA/dirB/zh-Hans/openapi.json")).toBe("zh-Hans");
        });

        test("GetLocaleFromPathRegion", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[dir]/[region]/openapi.json', "dirA/dirB/JP/openapi.json")).toBe("JP");
        });

        test("GetLocaleFromPathLocaleDir", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[dir]/[localeDir]/openapi.json', "dirA/dirB/de/DE/openapi.json")).toBe("de-DE");
        });

        test("GetLocaleFromPathLocaleDirShort", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[dir]/[localeDir]/openapi.json', "dirA/dirB/de/openapi.json")).toBe("de");
        });

        test("GetLocaleFromPathLocaleDirLong", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[dir]/[localeDir]/openapi.json', "dirA/dirB/zh/Hans/CN/openapi.json")).toBe("zh-Hans-CN");
        });

        test("GetLocaleFromPathLocaleDirStart", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[localeDir]/openapi.json', "de/DE/openapi.json")).toBe("de-DE");
        });

        test("GetLocaleFromPathLocaleUnder", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[dir]/openapi_[localeUnder].json', "dirA/dirB/openapi_de_DE.json")).toBe("de-DE");
        });

        test("GetLocaleFromPathLocaleUnderShort", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[dir]/openapi_[localeUnder].json', "dirA/dirB/openapi_de.json")).toBe("de");
        });

        test("GetLocaleFromPathLocaleUnderLong", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.getLocaleFromPath('[dir]/openapi_[localeUnder].json', "dirA/dirB/openapi_zh_Hans_CN.json")).toBe("zh-Hans-CN");
        });
    });

    describe("getMapping", function() {
        test("GetMapping1", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(
                oaft.getMapping("dirA/dirB/api.json")
            ).toStrictEqual(
                {
                    schema: 'api-schema',
                    method: 'copy',
                    template: 'resources/[localeDir]/api.json'
                }
            );
        });

        test("GetMapping2", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(
                oaft.getMapping('resources/en/US/openapi.json')
            ).toStrictEqual(
                {
                    schema: 'openapi-schema',
                    method: 'copy',
                    template: 'resources/[localeDir]/openapi.json'
                }
            );
        });

        test("GetMappingNoMatch", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(!oaft.getMapping("dirA/dirB/msg.jso")).toBeTruthy();
        });
    });

    describe("handles", function() {
        test("HandlesExtensionTrue", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.handles('openapi.json')).toBeTruthy();
        });

        test("HandlesExtensionFalse", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(!oaft.handles('openapi.jsonhandle')).toBeTruthy();
        });

        test("HandlesNotSource", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(!oaft.handles('foo.json')).toBeTruthy();
        });

        test("HandlesTrueWithDir", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.handles('dirA/dirB/dirC/api.json')).toBeTruthy();
        });

        test("HandlesFalseWrongDir", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(!oaft.handles('dirA/dirB/dirC/openapi.jsn')).toBeTruthy();
        });

        test("HandlesFalseRightDir", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.handles('dirA/dirB/dirC/test/openapi.jsn')).toBeTruthy();
        });

        test("HandlesTrueSourceLocale", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            expect(oaft.handles('resources/en/US/api.json')).toBeTruthy();
        });

        test("HandlesAlternateExtensionTrue", function() {
            expect.assertions(3);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            // windows?
            expect(oaft.handles('openapi.jsn')).toBeTruthy();
            expect(oaft.handles('openapi.jso')).toBeTruthy();
        });

        test("HandlesAlreadyLocalizedGB", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            // This matches one of the templates, but the locale is
            // not the source locale, so we don't need to
            // localize it again.
            expect(!oaft.handles('resources/en/GB/openapi.json')).toBeTruthy();
        });

        test("HandlesAlreadyLocalizedCN", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            // This matches one of the templates, but the locale is
            // not the source locale, so we don't need to
            // localize it again.
            expect(!oaft.handles('resources/zh/Hans/CN/openapi.json')).toBeTruthy();
        });

        test("HandlesNotAlreadyLocalizedenUS", function() {
            expect.assertions(2);

            var oaft = new OpenAPIFileType(p);
            expect(oaft).toBeTruthy();

            // we figure this out from the template
            expect(oaft.handles('resources/en/US/api.json')).toBeTruthy();
        });
    });
});
