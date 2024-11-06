/*
 * XmlFileType.test.js - test the XML file type handler object.
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

var path = require("path");

if (!XmlFileType) {
    var XmlFileType = require("../XmlFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    sourceLocale: "en-US",
    plugins: [
        path.join(process.cwd(), "XmlFileType")
    ]
}, "./testfiles", {
    locales:["en-GB"],
    xml: {
        "schemas": ["./test/testfiles/schemas"],
        "mappings": {
            "strings.xml": {
                "schema": "http://www.lge.com/xml/strings",
                "method": "copy",
                "template": "resources/[localeDir]/strings2.xml"
            },
            "resources/en/US/strings.xml": {
                "schema": "http://www.lge.com/xml/strings",
                "method": "copy",
                "template": "resources/[localeDir]/strings.xml"
            },
            "**/messages.xml": {
                "schema": "http://www.lge.com/xml/messages",
                "method": "copy",
                "template": "resources/[localeDir]/messages.xml"
            },
            "**/test/str.xml": {
                "schema": "http://www.lge.com/xml/str",
                "method": "copy",
                "template": "[dir]/[localeDir]/str.xml"
            },
            "**/*.properties": {
                "schema": "properties-schema",
                "method": "copy",
                "template": "[dir]/[basename]_[localeUnder].[extension]"
            },
            "**/*.docx": {
                "schema": "properties-schema",
                "method": "copy",
                "template": "[dir]/[basename]_[locale].[extension]"
            },
            "**/*.xlsx": {
                "schema": "properties-schema",
                "method": "copy",
                "template": "[dir]/[basename]_[locale].[extension]"
            }
        }
    }
});


var p2 = new CustomProject({
    sourceLocale: "en-US",
    plugins: [
        path.join(process.cwd(), "XmlFileType")
    ]
}, "./testfiles", {
    locales:["en-GB"],
    xml: {
        "schemas": ["./test/testfiles/schemas"],
        "mappings": {
            "**/strings.xml": {
                "schema": "http://www.lge.com/xml/strings",
                "method": "copy",
                "template": "resources/[localeDir]/strings.xml"
            }
        }
    }
});


describe("xmlfiletype", function() {
    test("XmlFileTypeConstructor", function() {
        expect.assertions(1);

        var xft = new XmlFileType(p);

        expect(xft).toBeTruthy();
    });

     test("XmlFileTypeGetMapping1", function() {
        expect.assertions(2);

        var xft = new XmlFileType(p);
        expect(xft).toBeTruthy();

        expect(xft.getMapping("x/y/messages.xml")).toStrictEqual({
            "schema": "http://www.lge.com/xml/messages",
            "method": "copy",
            "template": "resources/[localeDir]/messages.xml"
        });
    });

     test("XmlFileTypeGetMapping2", function() {
        expect.assertions(2);

        var xft = new XmlFileType(p);
        expect(xft).toBeTruthy();

        expect(xft.getMapping("resources/en/US/strings.xml")).toStrictEqual({
            "schema": "http://www.lge.com/xml/strings",
            "method": "copy",
            "template": "resources/[localeDir]/strings.xml"
        });
    });

     test("XmlFileTypeGetMappingNoMatch", function() {
        expect.assertions(2);

        var xft = new XmlFileType(p);
        expect(xft).toBeTruthy();

        expect(!xft.getMapping("x/y/msg.xml")).toBeTruthy();
    });

    test("XmlFileTypeHandlesExtensionTrue", function() {
        expect.assertions(5);

        var xft = new XmlFileType(p);
        expect(xft).toBeTruthy();

        expect(xft.handles("strings.xml")).toBeTruthy();
        expect(xft.handles("strings.properties")).toBeTruthy();
        expect(xft.handles("strings.xlsx")).toBeTruthy();
        expect(xft.handles("strings.docx")).toBeTruthy();
    });

    test("XmlFileTypeHandlesExtensionFalse", function() {
        expect.assertions(4);

        var xft = new XmlFileType(p);
        expect(xft).toBeTruthy();

        expect(!xft.handles("strings.xmlhandle")).toBeTruthy();

        // handled, but no mappings, so we don't read them
        expect(!xft.handles("strings.uml")).toBeTruthy();
        expect(!xft.handles("strings.iml")).toBeTruthy();
    });

    test("XmlFileTypeHandlesNotSource", function() {
        expect.assertions(2);

        var xft = new XmlFileType(p);
        expect(xft).toBeTruthy();

        expect(!xft.handles("foo.xml")).toBeTruthy();
    });

    test("XmlFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);

        var xft = new XmlFileType(p);
        expect(xft).toBeTruthy();

        expect(xft.handles("x/y/z/messages.xml")).toBeTruthy();
    });

    test("XmlFileTypeHandlesFalseWrongDir", function() {
        expect.assertions(2);

        var xft = new XmlFileType(p);
        expect(xft).toBeTruthy();

        expect(!xft.handles("x/y/z/str.xml")).toBeTruthy();
    });

    test("XmlFileTypeHandlesFalseRightDir", function() {
        expect.assertions(2);

        var xft = new XmlFileType(p);
        expect(xft).toBeTruthy();

        expect(xft.handles("x/y/z/test/str.xml")).toBeTruthy();
    });

    test("XmlFileTypeHandlesTrueSourceLocale", function() {
        expect.assertions(4);

        var xft = new XmlFileType(p);
        expect(xft).toBeTruthy();

        expect(xft.handles("resources/en/US/messages.xml")).toBeTruthy();
        expect(xft.handles("resources/messages_en_US.properties")).toBeTruthy();
        expect(xft.handles("file_en-US.docx")).toBeTruthy();
    });

    test("XmlFileTypeHandlesAlreadyLocalizedGB", function() {
        expect.assertions(4);

        var xft = new XmlFileType(p);
        expect(xft).toBeTruthy();

        // This matches one of the templates, but the locale is
        // not the source locale, so we don't need to
        // localize it again.
        expect(!xft.handles("resources/en/GB/messages.xml")).toBeTruthy();
        expect(!xft.handles("props/messages_en_GB.properties")).toBeTruthy();
        expect(!xft.handles("files/file_en-GB.docx")).toBeTruthy();
    });

    test("XmlFileTypeHandlesAlreadyLocalizedCN", function() {
        expect.assertions(2);

        var xft = new XmlFileType(p);
        expect(xft).toBeTruthy();

        // This matches one of the templates, but thge locale is
        // not the source locale, so we don't need to
        // localize it again.
        expect(!xft.handles("resources/zh/Hans/CN/messages.xml")).toBeTruthy();
    });

    test("XmlFileTypeHandlesNotAlreadyLocalizedenUS", function() {
        expect.assertions(2);

        var xft = new XmlFileType(p);
        expect(xft).toBeTruthy();

        // we figure this out from the template
        expect(xft.handles("resources/en/US/messages.xml")).toBeTruthy();
    });

    test("XmlFileTypeRejectInvalidSchema", function() {
        expect.assertions(1);

        expect(function(test) {
            var mockproject = {
                getAPI: p.getAPI.bind(p),
                getSourceLocale: p.getSourceLocale.bind(p),
                settings: {
                    locales:["en-GB"],
                    targetDir: "testfiles",
                    nopseudo: true,
                    xml: {
                        schemas: [
                            "./test/testfiles/invalid.json"
                        ],
                        mappings: {
                            "**/invalid.xml": {
                                "schema": "http://github.com/ilib-js/invalid.json",
                                "method": "copy",
                                "template": "resources/invalid_[locale].xml"
                            }
                        }
                    }
                }
            };

            // should throw an exception while trying to parse the invalid.json
            var xft = new XmlFileType(mockproject);
        }).toThrow();
    });
});
