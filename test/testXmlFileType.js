/*
 * testXmlFileType.js - test the XML file type handler object.
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

if (!XmlFileType) {
    var XmlFileType = require("../XmlFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"],
    xml: {
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
            }
        }
    }
});


var p2 = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"],
    xml: {
        mappings: {
            "**/strings.xml": {
                "schema": "http://www.lge.com/xml/strings",
                "method": "copy",
                "template": "resources/[localeDir]/strings.xml"
            }
        }
    }
});


module.exports.xmlfiletype = {
    testXmlFileTypeConstructor: function(test) {
        test.expect(1);

        var xft = new XmlFileType(p);

        test.ok(xft);

        test.done();
    },

     testXmlFileTypeGetMapping1: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.deepEqual(xft.getMapping("x/y/messages.xml"), {
            "schema": "http://www.lge.com/xml/messages",
            "method": "copy",
            "template": "resources/[localeDir]/messages.xml"
        });

        test.done();
    },

     testXmlFileTypeGetMapping2: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.deepEqual(xft.getMapping("resources/en/US/strings.xml"), {
            "schema": "http://www.lge.com/xml/strings",
            "method": "copy",
            "template": "resources/[localeDir]/strings.xml"
        });

        test.done();
    },

     testXmlFileTypeGetMappingNoMatch: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(!xft.getMapping("x/y/msg.xml"));

        test.done();
    },

    testXmlFileTypeHandlesExtensionTrue: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(xft.handles("strings.xml"));

        test.done();
    },

    testXmlFileTypeHandlesExtensionFalse: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(!xft.handles("strings.xmlhandle"));

        test.done();
    },

    testXmlFileTypeHandlesNotSource: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(!xft.handles("foo.xml"));

        test.done();
    },

    testXmlFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(xft.handles("x/y/z/messages.xml"));

        test.done();
    },

    testXmlFileTypeHandlesFalseWrongDir: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(!xft.handles("x/y/z/str.xml"));

        test.done();
    },

    testXmlFileTypeHandlesFalseRightDir: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(xft.handles("x/y/z/test/str.xml"));

        test.done();
    },

    testXmlFileTypeHandlesTrueSourceLocale: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        test.ok(xft.handles("resources/en/US/messages.xml"));

        test.done();
    },

    testXmlFileTypeHandlesAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        // This matches one of the templates, but thge locale is
        // not the source locale, so we don't need to
        // localize it again.
        test.ok(!xft.handles("resources/en/GB/messages.xml"));

        test.done();
    },

    testXmlFileTypeHandlesAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        // This matches one of the templates, but thge locale is
        // not the source locale, so we don't need to
        // localize it again.
        test.ok(!xft.handles("resources/zh/Hans/CN/messages.xml"));

        test.done();
    },

    testXmlFileTypeHandlesNotAlreadyLocalizedenUS: function(test) {
        test.expect(2);

        var xft = new XmlFileType(p);
        test.ok(xft);

        // we figure this out from the template
        test.ok(xft.handles("resources/en/US/messages.xml"));

        test.done();
    },

    testXmlFileTypeRejectInvalidSchema: function(test) {
        test.expect(1);

        test.throws(function(test) {
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
        });

        test.done();
    }
};
