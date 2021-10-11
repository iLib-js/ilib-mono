/*
 * testXmlFile.js - test the XML file handler object.
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

var path = require("path");
var fs = require("fs");

if (!XmlFile) {
    var XmlFile = require("../XmlFile.js");
    var XmlFileType = require("../XmlFileType.js");

    var CustomProject =  require("loctool/lib/CustomProject.js");
    var TranslationSet =  require("loctool/lib/TranslationSet.js");
    var ResourceString =  require("loctool/lib/ResourceString.js");
    var ResourcePlural =  require("loctool/lib/ResourcePlural.js");
    var ResourceArray =  require("loctool/lib/ResourceArray.js");
}

function diff(a, b) {
    var min = Math.min(a.length, b.length);

    for (var i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    }
}

var p = new CustomProject({
    name: "foo",
    id: "foo",
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"],
    targetDir: ".",
    nopseudo: true,
    xml: {
        schemas: [
            "./test/testfiles/schemas"
        ],
        mappings: {
            "resources/en/US/strings.xml": {
                "schema": "./testfiles/schema/strings-schema.json",
                "method": "copy",
                "template": "resources/[localeDir]/strings.xml"
            },
            "**/messages.xml": {
                "schema": "http://github.com/ilib-js/messages.json",
                "method": "copy",
                "template": "resources/[localeDir]/messages.xml"
            },
            "**/sparse.xml": {
                "schema": "strings-schema",
                "method": "sparse",
                "template": "resources/[localeDir]/sparse.xml"
            },
            "**/sparse2.xml": {
                "schema": "http://github.com/ilib-js/messages.json",
                "method": "sparse",
                "template": "resources/[localeDir]/sparse2.xml"
            },
            "**/spread.xml": {
                "schema": "strings-schema",
                "method": "spread",
                "template": "resources/[localeDir]/spread.xml"
            },
            "**/deep.xml": {
                "schema": "http://github.com/ilib-js/deep.json",
                "method": "copy",
                "template": "resources/deep_[locale].xml"
            },
            "**/refs.xml": {
                "schema": "http://github.com/ilib-js/refs.json",
                "method": "copy",
                "template": "resources/[locale]/refs.xml"
            },
            "**/str.xml": {},
            "**/arrays.xml": {
                "schema": "http://github.com/ilib-js/arrays.json",
                "method": "copy",
                "template": "resources/[localeDir]/arrays.xml"
            },
            "**/array-refs.xml": {
                "schema": "http://github.com/ilib-js/array-refs.json",
                "method": "copy",
                "template": "resources/[localeDir]/array-refs.xml"
            }
        }
    }
});
var t = new XmlFileType(p);

var p2 = new CustomProject({
    name: "foo",
    id: "foo",
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"],
    identify: true,
    targetDir: "testfiles",
    nopseudo: false,
    xml: {
        schemas: [
            "./test/testfiles/schemas"
        ],
        mappings: {
            "**/messages.xml": {
                "schema": "http://github.com/ilib-js/messages.json",
                "method": "copy",
                "template": "resources/[localeDir]/messages.xml"
            }
        }
    }
});

var t2 = new XmlFileType(p2);

module.exports.xmlfile = {
    testXmlFileConstructor: function(test) {
        test.expect(1);

        var xf = new XmlFile({project: p, type: t});
        test.ok(xf);

        test.done();
    },

    testXmlFileConstructorParams: function(test) {
        test.expect(1);

        var xf = new XmlFile({
            project: p,
            pathName: "./testfiles/xml/messages.xml",
            type: t
        });

        test.ok(xf);

        test.done();
    },

    testXmlFileConstructorNoFile: function(test) {
        test.expect(1);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        test.done();
    },

    testXmlFileEscapeProp: function(test) {
        test.expect(1);

        test.ok(XmlFile.escapeProp("escape/tilde~tilde"), "escape~0tilde~1tilde");

        test.done();
    },

    testXmlFileEscapePropNoChange: function(test) {
        test.expect(1);

        test.ok(XmlFile.escapeProp("permissions"), "permissions");

        test.done();
    },

    testXmlFileEscapePropDontEscapeOthers: function(test) {
        test.expect(1);

        test.ok(XmlFile.escapeProp("permissions% \" ^ | \\"), "permissions% \" ^ | \\");

        test.done();
    },

    testXmlFileUnescapeProp: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeProp("escape~0tilde~1tilde"), "escape/tilde~tilde");

        test.done();
    },

    testXmlFileUnescapePropTricky: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeProp("escape~3tilde~4tilde"), "escape~3tilde~4tilde");

        test.done();
    },

    testXmlFileUnescapePropNoChange: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeProp("permissions"), "permissions");

        test.done();
    },

    testXmlFileUnescapePropDontEscapeOthers: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeProp("permissions% \" ^ | \\"), "permissions% \" ^ | \\");

        test.done();
    },

    testXmlFileEscapeRef: function(test) {
        test.expect(1);

        test.ok(XmlFile.escapeRef("escape/tilde~tilde"), "escape~0tilde~1tilde");

        test.done();
    },

    testXmlFileEscapeRefNoChange: function(test) {
        test.expect(1);

        test.ok(XmlFile.escapeRef("permissions"), "permissions");

        test.done();
    },

    testXmlFileEscapeRefDontEscapeOthers: function(test) {
        test.expect(1);

        test.ok(XmlFile.escapeRef("permissions% \" ^ | \\"), "permissions%25%20%22%20%5E%20%7C%20%5C");

        test.done();
    },

    testXmlFileUnescapeRef: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeRef("escape~0tilde~1tilde"), "escape/tilde~tilde");

        test.done();
    },

    testXmlFileUnescapeRefTricky: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeRef("escape~3tilde~4tilde"), "escape~3tilde~4tilde");

        test.done();
    },

    testXmlFileUnescapeRefNoChange: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeRef("permissions"), "permissions");

        test.done();
    },

    testXmlFileUnescapeRefDontEscapeOthers: function(test) {
        test.expect(1);

        test.ok(XmlFile.unescapeRef("permissions%25%20%22%20%5E%20%7C%20%5C"), "permissions% \" ^ | \\");

        test.done();
    },

    testXmlFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("foo", "en-US", "string 1", "xml"));
        test.ok(r);

        test.equal(r.getSource(), "this is string one");
        test.equal(r.getKey(), "string 1");

        test.done();
    },

    testXmlFileParseSimpleRightStrings: function(test) {
        test.expect(8);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.equal(resources.length, 2);

        test.equal(resources[0].getSource(), "this is string one");
        test.equal(resources[0].getKey(), "string 1");

        test.equal(resources[1].getSource(), "this is string two");
        test.equal(resources[1].getKey(), "string 2");

        test.done();
    },

    testXmlFileParseSimpleDontExtractEmpty: function(test) {
        test.expect(6);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2"></string>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getSource(), "this is string one");
        test.equal(resources[0].getKey(), "string 1");

        test.done();
    },

    testXmlFileParseEscapeStringKeys: function(test) {
        test.expect(8);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<resources>\n' +
            '    <string name="string &lt; 1">this is string one</string>\n' +
            '    <string name="string &amp; 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.equal(resources.length, 2);

        test.equal(resources[0].getSource(), "this is string one");
        test.equal(resources[0].getKey(), "string < 1");

        test.equal(resources[1].getSource(), "this is string two");
        test.equal(resources[1].getKey(), "string & 2");

        test.done();
    },

    testXmlFileParseSimpleRejectThingsThatAreNotInTheSchema: function(test) {
        test.expect(6);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        xf.parse(
             '<resources>\n' +
             '    <string name="string 1">this is string one</string>\n' +
             '    <borky>\n' +
             '        <string name="string 2">this is string two</string>\n' +
             '    </borky>\n' +
             '</resources>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getSource(), "this is string one");
        test.equal(resources[0].getKey(), "string 1");

        test.done();
    },

    testXmlFileParseComplexRightSize: function(test) {
        test.expect(3);

        // when it's named messages.xml, it should apply the messages-schema schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/messages.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<messages>\n' +
            '    <plurals name="foo">\n' +
            '        <bar>\n' +
            '            <one>singular</one>\n' +
            '            <many>many</many>\n' +
            '            <other>plural</other>\n' +
            '        </bar>\n' +
            '    </plurals>\n' +
            '    <strings>\n' +
            '        <a>b</a>\n' +
            '        <c>d</c>\n' +
            '    </strings>\n' +
            '    <arrays>\n' +
            '        <asdf i18n="comment">\n' +
            '            <item>value 1</item>\n' +
            '            <item>value 2</item>\n' +
            '            <item>value 3</item>\n' +
            '        </asdf>\n' +
            '    </arrays>\n' +
            '</messages>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 4);
        test.done();
    },

    testXmlFileParseComplexRightStrings: function(test) {
        test.expect(26);

        // when it's named messages.xml, it should apply the messages-schema schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/messages.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<messages>\n' +
            '    <plurals name="foo">\n' +
            '        <bar>\n' +
            '            <one>singular</one>\n' +
            '            <many>many</many>\n' +
            '            <other>plural</other>\n' +
            '        </bar>\n' +
            '    </plurals>\n' +
            '    <strings>\n' +
            '        <a>b</a>\n' +
            '        <c>d</c>\n' +
            '    </strings>\n' +
            '    <arrays>\n' +
            '        <asdf i18n="comment">\n' +
            '            <item>value 1</item>\n' +
            '            <item>value 2</item>\n' +
            '            <item>value 3</item>\n' +
            '        </asdf>\n' +
            '    </arrays>\n' +
            '</messages>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 4);
        var resources = set.getAll();
        test.equal(resources.length, 4);

        test.equal(resources[0].getType(), "plural");
        test.equal(resources[0].getKey(), "bar");
        var pluralStrings = resources[0].getSourcePlurals();
        test.ok(pluralStrings);
        test.equal(pluralStrings.one, "singular");
        test.equal(pluralStrings.many, "many");
        test.equal(pluralStrings.other, "plural");
        test.ok(!pluralStrings.zero);
        test.ok(!pluralStrings.two);
        test.ok(!pluralStrings.few);

        test.equal(resources[1].getType(), "string");
        test.equal(resources[1].getSource(), "b");
        test.equal(resources[1].getKey(), "a");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getSource(), "d");
        test.equal(resources[2].getKey(), "c");

        test.equal(resources[3].getType(), "array");
        test.equal(resources[3].getKey(), "asdf");
        var arrayStrings = resources[3].getSourceArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings.length, 3);
        test.equal(arrayStrings[0], "value 1");
        test.equal(arrayStrings[1], "value 2");
        test.equal(arrayStrings[2], "value 3");

        test.done();
    },

    testXmlFileParseArrayOfStrings: function(test) {
        test.expect(11);

        // when it's named arrays.xml, it should apply the arrays schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<resources>\n' +
             '    <strings name="strings">\n' +
             '        <item>string 1</item>\n' +
             '        <item>string 2</item>\n' +
             '        <item>string 3</item>\n' +
             '    </strings>\n' +
             '</resources>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);

        var resources = set.getAll();
        test.equal(resources.length, 1);
        test.equal(resources[0].getType(), 'array');
        test.equal(resources[0].getKey(), 'strings');

        var arrayStrings = resources[0].getSourceArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings.length, 3);
        test.equal(arrayStrings[0], "string 1");
        test.equal(arrayStrings[1], "string 2");
        test.equal(arrayStrings[2], "string 3");

        test.done();
    },

    testXmlFileParseArrayOfNumbers: function(test) {
        test.expect(12);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
             '<resources>\n' +
            '    <numbers name="numbers">\n' +
            '        <item>15</item>\n' +
            '        <item>-3</item>\n' +
            '        <item>1.18</item>\n' +
            '        <item>0</item>\n' +
            '    </numbers>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);

        var resources = set.getAll();
        test.equal(resources.length, 1);
        test.equal(resources[0].getType(), 'array');
        test.equal(resources[0].getKey(), 'numbers');

        var arrayNumbers = resources[0].getSourceArray();
        test.ok(arrayNumbers);
        test.equal(arrayNumbers.length, 4);
        test.equal(arrayNumbers[0], "15");
        test.equal(arrayNumbers[1], "-3");
        test.equal(arrayNumbers[2], "1.18");
        test.equal(arrayNumbers[3], "0");

        test.done();
    },

    testXmlFileParseArrayOfBooleans: function(test) {
        test.expect(10);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<resources>\n' +
            '    <booleans name="booleans">\n' +
            '        <item>true</item>\n' +
            '        <item>false</item>\n' +
            '    </booleans>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 1);

        var resources = set.getAll();
        test.equal(resources.length, 1);
        test.equal(resources[0].getType(), 'array');
        test.equal(resources[0].getKey(), 'booleans');

        var arrayBooleans = resources[0].getSourceArray();
        test.ok(arrayBooleans);
        test.equal(arrayBooleans.length, 2);
        test.equal(arrayBooleans[0], "true");
        test.equal(arrayBooleans[1], "false");

        test.done();
    },

    testXmlFileParseDeepRightSize: function(test) {
        test.expect(3);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/deep.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
             '<root>\n' +
             '    <x>\n' +
             '        <y>\n' +
             '            <plurals>\n' +
             '                <bar>\n' +
             '                    <one>singular</one>\n' +
             '                    <many>many</many>\n' +
             '                    <other>plural</other>\n' +
             '                </bar>\n' +
             '            </plurals>\n' +
             '        </y>\n' +
             '    </x>\n' +
             '    <a>\n' +
             '        <b>\n' +
             '            <strings>\n' +
             '                <a>b</a>\n' +
             '                <c>d</c>\n' +
             '            </strings>\n' +
             '        </b>\n' +
             '    </a>\n' +
             '</root>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        test.done();
    },

    testXmlFileParseDeepRightStrings: function(test) {
        test.expect(19);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/deep.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
             '<root>\n' +
             '    <x>\n' +
             '        <y>\n' +
             '            <plurals>\n' +
             '                <bar>\n' +
             '                    <one>singular</one>\n' +
             '                    <many>many</many>\n' +
             '                    <other>plural</other>\n' +
             '                </bar>\n' +
             '            </plurals>\n' +
             '        </y>\n' +
             '    </x>\n' +
             '    <a>\n' +
             '        <b>\n' +
             '            <strings>\n' +
             '                <a>b</a>\n' +
             '                <c>d</c>\n' +
             '            </strings>\n' +
             '        </b>\n' +
             '    </a>\n' +
             '</root>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        var resources = set.getAll();
        test.equal(resources.length, 3);

        test.equal(resources[0].getType(), "plural");
        test.equal(resources[0].getKey(), "x/y/plurals/bar");
        var pluralStrings = resources[0].getSourcePlurals();
        test.ok(pluralStrings);
        test.equal(pluralStrings.one, "singular");
        test.equal(pluralStrings.many, "many");
        test.equal(pluralStrings.other, "plural");
        test.ok(!pluralStrings.zero);
        test.ok(!pluralStrings.two);
        test.ok(!pluralStrings.few);

        test.equal(resources[1].getType(), "string");
        test.equal(resources[1].getSource(), "b");
        test.equal(resources[1].getKey(), "a/b/strings/a");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getSource(), "d");
        test.equal(resources[2].getKey(), "a/b/strings/c");

        test.done();
    },

    testXmlFileParseTestInvalidXml: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/deep.xml",
            type: t
        });
        test.ok(xf);

        test.throws(function(test) {
             '<root>\n' +
             '    <x>\n' +
             '        <y><z>\n' +
             '            <plurals>\n' +
             '                <bar>\n' +
             '                    <one>singular</one>\n' +
             '                    <many>many</many>\n' +
             '                    <other>plural</other>\n' +
             '                </bar>\n' +
             '            </plurals>\n' +
             '        </y>\n' +
             '    </x>\n' +
             '    <a>\n' +
             '        <b>\n' +
             '            <strings>\n' +
             '                <a>b</a>\n' +
             '                <c>d</c>\n' +
             '            </strings>\n' +
             '        </b>\n' +
             '    </a>\n' +
             '</root>\n'
         });

        test.done();
    },

    testXmlFileParseRefsRightSize: function(test) {
        test.expect(3);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/refs.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
             '<root>\n' +
             '    <owner>\n' +
             '        <name>Foo Bar</name>\n' +
             '        <phone>\n' +
             '            <number>1-555-555-1212</number>\n' +
             '            <type>Mobile</type>\n' +
             '        </phone>\n' +
             '    </owner>\n' +
             '    <customer1>\n' +
             '        <name>Foo Bar</name>\n' +
             '        <phone>\n' +
             '            <number>1-555-555-1212</number>\n' +
             '            <type>Home</type>\n' +
             '        </phone>\n' +
             '    </customer1>\n' +
             '    <customer2>\n' +
             '        <name>Foo Bar</name>\n' +
             '        <phone>\n' +
             '            <number>1-555-555-1212</number>\n' +
             '            <type>Work</type>\n' +
             '        </phone>\n' +
             '    </customer2>\n' +
             '</root>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        test.done();
    },

    testXmlFileParseRefsRightStrings: function(test) {
        test.expect(13);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/refs.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
             '<root>\n' +
             '    <owner>\n' +
             '        <name>Foo Bar</name>\n' +
             '        <phone>\n' +
             '            <number>1-555-555-1212</number>\n' +
             '            <type>Mobile</type>\n' +
             '        </phone>\n' +
             '    </owner>\n' +
             '    <customer1>\n' +
             '        <name>Foo Bar</name>\n' +
             '        <phone>\n' +
             '            <number>1-555-555-1212</number>\n' +
             '            <type>Home</type>\n' +
             '        </phone>\n' +
             '    </customer1>\n' +
             '    <customer2>\n' +
             '        <name>Foo Bar</name>\n' +
             '        <phone>\n' +
             '            <number>1-555-555-1212</number>\n' +
             '            <type>Work</type>\n' +
             '        </phone>\n' +
             '    </customer2>\n' +
             '</root>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        var resources = set.getAll();
        test.equal(resources.length, 3);

        test.equal(resources[0].getType(), "string");
        test.equal(resources[0].getSource(), "Mobile");
        test.equal(resources[0].getKey(), "owner/phone/type");

        test.equal(resources[1].getType(), "string");
        test.equal(resources[1].getSource(), "Home");
        test.equal(resources[1].getKey(), "customer1/phone/type");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getSource(), "Work");
        test.equal(resources[2].getKey(), "customer2/phone/type");

        test.done();
    },

    testXmlFileParseDefaultSchema: function(test) {
        test.expect(5);

        var xf = new XmlFile({
            project: p,
            pathName: "a/b/c/str.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("foo", "en-US", "string 1", "xml"));
        test.ok(r);

        test.equal(r.getSource(), "this is string one");
        test.equal(r.getKey(), "string 1");

        test.done();
    },

    testXmlFileParseExtractComments: function(test) {
        test.expect(8);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1" i18n="comment for string 1">this is string one</string>\n' +
            '    <string name="string 2" i18n="comment for string 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.equal(resources.length, 2);

        test.equal(resources[0].getSource(), "this is string one");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getNote(), "comment for string 1");

        test.equal(resources[1].getSource(), "this is string two");
        test.equal(resources[1].getKey(), "string 2");

        test.done();
    },


    testXmlFileExtractFile: function(test) {
        test.expect(28);

        var base = path.dirname(module.id);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/messages.xml",
            type: t
        });
        test.ok(xf);

        // should read the file
        xf.extract();

        var set = xf.getTranslationSet();

        test.equal(set.size(), 5);

        var resources = set.getAll();
        test.equal(resources.length, 5);

        test.equal(resources[0].getType(), "plural");
        var categories = resources[0].getSourcePlurals();
        test.ok(categories);
        test.equal(categories.one, "one");
        test.equal(categories.other, "other");
        test.equal(resources[0].getKey(), "plurals/bar");

        test.equal(resources[1].getType(), "array");
        var arr = resources[1].getSourceArray();
        test.ok(arr);
        test.equal(arr.length, 3);
        test.equal(arr[0], "value 1");
        test.equal(arr[1], "value 2");
        test.equal(arr[2], "value 3");
        test.equal(resources[1].getKey(), "arrays/asdf");

        test.equal(resources[2].getType(), "array");
        var arr = resources[2].getSourceArray();
        test.ok(arr);
        test.equal(arr.length, 3);
        test.equal(arr[0], "1");
        test.equal(arr[1], "2");
        test.equal(arr[2], "3");
        test.equal(resources[2].getKey(), "arrays/asdfasdf");

        test.equal(resources[3].getType(), "string");
        test.equal(resources[3].getSource(), "b");
        test.equal(resources[3].getKey(), "strings/a");

        test.equal(resources[4].getType(), "string");
        test.equal(resources[4].getSource(), "d");
        test.equal(resources[4].getKey(), "strings/c");

        test.done();
    },

    testXmlFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        // should attempt to read the file and not fail
        xf.extract();

        var set = xf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testXmlFileExtractBogusFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/bogus.xml",
            type: t
        });
        test.ok(xf);

        // should attempt to read the file and not fail
        xf.extract();

        var set = xf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testXmlFileLocalizeTextSimple: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
            '<resources>\n' +
            '    <string name="string 1">C\'est la chaîne numéro 1</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXmlFileLocalizeTextWithSchema: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/messages.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<messages>\n' +
            '    <plurals name="foo">\n' +
            '        <bar>\n' +
            '            <one>singular</one>\n' +
            '            <many>many</many>\n' +
            '            <other>plural</other>\n' +
            '        </bar>\n' +
            '    </plurals>\n' +
            '    <strings>\n' +
            '        <a>b</a>\n' +
            '        <c>d</c>\n' +
            '    </strings>\n' +
            '    <arrays>\n' +
            '        <asdf i18n="comment">\n' +
            '            <item>string 1</item>\n' +
            '            <item>string 2</item>\n' +
            '            <item>string 3</item>\n' +
            '        </asdf>\n' +
            '    </arrays>\n' +
            '</messages>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "plurals/bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "singulaire",
                "many": "plupart",
                "other": "autres"
            },
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/c",
            source: "d",
            sourceLocale: "en-US",
            target: "la d",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceArray({
            project: "foo",
            key: "arrays/asdf",
            sourceArray: [
                "string 1",
                "string 2",
                "string 3"
            ],
            sourceLocale: "en-US",
            targetArray: [
                "chaîne 1",
                "chaîne 2",
                "chaîne 3"
            ],
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
            '<messages>\n' +
            '    <plurals name="foo">\n' +
            '        <bar>\n' +
            '            <one>singulaire</one>\n' +
            '            <many>plupart</many>\n' +
            '            <other>autres</other>\n' +
            '        </bar>\n' +
            '    </plurals>\n' +
            '    <strings>\n' +
            '        <a>la b</a>\n' +
            '        <c>la d</c>\n' +
            '    </strings>\n' +
            '    <arrays>\n' +
            '        <asdf i18n="comment">\n' +
            '            <item>chaîne 1</item>\n' +
            '            <item>chaîne 2</item>\n' +
            '            <item>chaîne 3</item>\n' +
            '        </asdf>\n' +
            '    </arrays>\n' +
            '</messages>\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXmlFileLocalizeTextMethodSparse: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/sparse.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
            '<resources>\n' +
            '    <string name="string 1">C\'est la chaîne numéro 1</string>\n' +
            '</resources>\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXmlFileLocalizeTextWithSchemaSparseComplex: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/sparse2.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
             '<resources>\n' +
             '    <plurals name="bar">\n' +
             '        <item quantity="one">singular</item>\n' +
             '        <item quantity="many">many</item>\n' +
             '        <item quantity="other">plural</item>\n' +
             '    </plurals>\n' +
             '    <strings>\n' +
             '        <string name="a">b</string>\n' +
             '        <string name="c">d</string>\n' +
             '    </strings>\n' +
             '    <string-array name="asdf">\n' +
             '        <item>string 1</item>\n' +
             '        <item>string 2</item>\n' +
             '        <item>string 3</item>\n' +
             '    </string-array>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "plurals/bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "singulaire",
                "many": "plupart",
                "other": "autres"
            },
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
             '<resources>\n' +
             '    <plurals name="bar">\n' +
             '        <item quantity="one">singulaire</item>\n' +
             '        <item quantity="many">plupart</item>\n' +
             '        <item quantity="other">autres</item>\n' +
             '    </plurals>\n' +
             '    <strings>\n' +
             '        <string name="a">la b</string>\n' +
             '    </strings>\n' +
             '</resources>\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXmlFileLocalizeArrayOfStrings: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<resources>\n' +
             '    <string-array name="strings">\n' +
             '        <item>string 1</item>\n' +
             '        <item>string 2</item>\n' +
             '        <item>string 3</item>\n' +
             '    </string-array>\n' +
             '</resources>\n'
        );

        var translations = new TranslationSet('en-US');
        translations.add(new ResourceArray({
            project: "foo",
            key: "strings",
            sourceArray: [
                "string 1",
                "string 2",
                "string 3"
            ],
            sourceLocale: "en-US",
            targetArray: [
                "chaîne 1",
                "chaîne 2",
                "chaîne 3"
            ],
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
            '<resources>\n' +
             '    <string-array name="strings">\n' +
             '        <item>chaîne 1</item>\n' +
             '        <item>chaîne 2</item>\n' +
             '        <item>chaîne 3</item>\n' +
             '    </string-array>\n' +
             '</resources>\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXmlFileLocalizeArrayOfNumbers: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<resources>\n' +
            '    <string-array name="numbers">\n' +
            '        <item>15</item>\n' +
            '        <item>-3</item>\n' +
            '        <item>1.18</item>\n' +
            '        <item>0</item>\n' +
            '    </string-array>\n' +
            '</resources>\n'
        );

        var translations = new TranslationSet('en-US');
        translations.add(new ResourceArray({
            project: "foo",
            key: "numbers",
            sourceArray: [
                "15",
                "-3",
                "1.18",
                "0"
            ],
            sourceLocale: "en-US",
            targetArray: [
                "29",
                "12",
                "-17.3",
                "0"
            ],
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        // should work fine because numbers are treated like regular
        // strings in XML
        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
            '<resources>\n' +
            '    <string-array name="numbers">\n' +
            '        <item>29</item>\n' +
            '        <item>12</item>\n' +
            '        <item>-17.3</item>\n' +
            '        <item>0</item>\n' +
            '    </string-array>\n' +
            '</resources>\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testXmlFileLocalizeTextUsePseudoForMissing: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p2,
            pathName: "./xml/messages.xml",
            type: t2
        });
        test.ok(xf);

        xf.parse(
            '<messages>\n' +
            '    <plurals name="foo">\n' +
            '        <bar>\n' +
            '            <one>singular</one>\n' +
            '            <many>many</many>\n' +
            '            <other>plural</other>\n' +
            '        </bar>\n' +
            '    </plurals>\n' +
            '    <strings>\n' +
            '        <a>b</a>\n' +
            '        <c>d</c>\n' +
            '    </strings>\n' +
            '    <arrays>\n' +
            '        <asdf i18n="comment">\n' +
            '            <item>String 1</item>\n' +
            '            <item>String 2</item>\n' +
            '            <item>String 3</item>\n' +
            '        </asdf>\n' +
            '    </arrays>\n' +
            '</messages>\n'
        );

        var translations = new TranslationSet();

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
            '<messages>\n' +
            '    <plurals name="foo">\n' +
            '        <bar>\n' +
            '            <one>šíñğüľàŕ3210</one>\n' +
            '            <many>màñÿ10</many>\n' +
            '            <other>þľüŕàľ210</other>\n' +
            '        </bar>\n' +
            '    </plurals>\n' +
            '    <strings>\n' +
            '        <a>b0</a>\n' +
            '        <c>ð0</c>\n' +
            '    </strings>\n' +
            '    <arrays>\n' +
            '        <asdf i18n="comment">\n' +
            '            <item>šţŕíñğ 13210</item>\n' +
            '            <item>šţŕíñğ 23210</item>\n' +
            '            <item>šţŕíñğ 33210</item>\n' +
            '        </asdf>\n' +
            '    </arrays>\n' +
            '</messages>\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

/*
    not implemented yet

    testXmlFileLocalizeTextMethodSpread: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/spread.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
            '{\n' +
            '    "string 1": "this is string one",\n' +
            '    "string 2": "this is string two"\n' +
            '}\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 2",
            source: "this is string two",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 2",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
            '{\n' +
            '    "string 1": {\n' +
            '        "fr-FR": "C\'est la chaîne numéro 1",\n' +
            '    },\n' +
            '    "string 2": {\n' +
            '        "fr-FR": "C\'est la chaîne numéro 2"\n' +
            '    },\n' +
            '}\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testXmlFileLocalizeTextMethodSpreadMultilingual: function(test) {
        test.expect(2);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/spread.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
            '{\n' +
            '    "string 1": "this is string one",\n' +
            '    "string 2": "this is string two"\n' +
            '}\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 2",
            source: "this is string two",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 2",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "Dies ist die Zeichenfolge 1",
            targetLocale: "de",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 2",
            source: "this is string two",
            sourceLocale: "en-US",
            target: "Dies ist die Zeichenfolge 2",
            targetLocale: "de",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, ["fr-FR", "de"]);
        var expected =
            '{\n' +
            '    "string 1": {\n' +
            '        "fr-FR": "C\'est la chaîne numéro 1",\n' +
            '        "de": "Dies ist die Zeichenfolge 1",\n' +
            '    },\n' +
            '    "string 2": {\n' +
            '        "fr-FR": "C\'est la chaîne numéro 2"\n' +
            '        "de": "Dies ist die Zeichenfolge 2"\n' +
            '    },\n' +
            '}\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },
*/

    testXmlFileLocalize: function(test) {
        test.expect(7);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/messages.xml"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml")));

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/messages.xml",
            type: t
        });
        test.ok(xf);

        // should read the file
        xf.extract();

        var translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "plurals/bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "singulaire",
                "many": "plupart",
                "other": "autres"
            },
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/c",
            source: "d",
            sourceLocale: "en-US",
            target: "la d",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceArray({
            project: "foo",
            key: "arrays/asdf",
            sourceArray: [
                "string 1",
                "string 2",
                "string 3"
            ],
            sourceLocale: "en-US",
            targetArray: [
                "chaîne 1",
                "chaîne 2",
                "chaîne 3"
            ],
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        translations.add(new ResourcePlural({
            project: "foo",
            key: "plurals/bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "einslige",
                "many": "mehrere",
                "other": "andere"
            },
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "Die b",
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/c",
            source: "d",
            sourceLocale: "en-US",
            target: "Der d",
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ResourceArray({
            project: "foo",
            key: "arrays/asdf",
            sourceArray: [
                "string 1",
                "string 2",
                "string 3"
            ],
            sourceLocale: "en-US",
            targetArray: [
                "Zeichenfolge 1",
                "Zeichenfolge 2",
                "Zeichenfolge 3"
            ],
            targetLocale: "de-DE",
            datatype: "xml"
        }));

        xf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml")));

        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"), "utf-8");

        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<messages>\n' +
            '    <plurals>\n' +
            '        <foo>asdf</foo>\n' +
            '        <bar comment="translator comment">\n' +
            '            <one>singulaire</one>\n' +
            '            <many>plupart</many>\n' +
            '            <other>autres</other>\n' +
            '        </bar>\n' +
            '        <attribute one="one" few="few" many="many" other="other"/>\n' +
            '        <hybrid one="one" few="few" many="many">other</hybrid>\n' +
            '    </plurals>\n' +
            '    <arrays>\n' +
            '        <asdf i18n="comment">\n' +
            '            <item>chaîne 1</item>\n' +
            '            <item>chaîne 2</item>\n' +
            '            <item>chaîne 3</item>\n' +
            '        </asdf>\n' +
            '        <asdfasdf key="key">\n' +
            '            <item>1</item>\n' +
            '            <item>2</item>\n' +
            '            <item>3</item>\n' +
            '        </asdfasdf>\n' +
            '    </arrays>\n' +
            '    <strings>\n' +
            '        <a>la b</a>\n' +
            '        <c>la d</c>\n' +
            '        <e key="key1">f</e>\n' +
            '        <e key="key2" value="g"/>\n' +
            '    </strings>\n' +
            '</messages>\n';


        diff(content, expected);
        test.equal(content, expected);

        content = fs.readFileSync(path.join(base, "testfiles/resources/de/DE/messages.xml"), "utf-8");

        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<messages>\n' +
            '    <plurals>\n' +
            '        <foo>asdf</foo>\n' +
            '        <bar comment="translator comment">\n' +
            '            <one>einslige</one>\n' +
            '            <many>mehrere</many>\n' +
            '            <other>andere</other>\n' +
            '        </bar>\n' +
            '        <attribute one="one" few="few" many="many" other="other"/>\n' +
            '        <hybrid one="one" few="few" many="many">other</hybrid>\n' +
            '    </plurals>\n' +
            '    <arrays>\n' +
            '        <asdf i18n="comment">\n' +
            '            <item>Zeichenfolge 1</item>\n' +
            '            <item>Zeichenfolge 2</item>\n' +
            '            <item>Zeichenfolge 3</item>\n' +
            '        </asdf>\n' +
            '        <asdfasdf key="key">\n' +
            '            <item>1</item>\n' +
            '            <item>2</item>\n' +
            '            <item>3</item>\n' +
            '        </asdfasdf>\n' +
            '    </arrays>\n' +
            '    <strings>\n' +
            '        <a>Die b</a>\n' +
            '        <c>Der d</c>\n' +
            '        <e key="key1">f</e>\n' +
            '        <e key="key2" value="g"/>\n' +
            '    </strings>\n' +
            '</messages>\n';

        diff(content, expected);
        test.equal(content, expected);

        test.done();
    },

    testXmlFileLocalizeNoTranslations: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/messages.xml"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml")));

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/messages.xml",
            type: t
        });
        test.ok(xf);

        // should read the file
        xf.extract();

        var translations = new TranslationSet();

        xf.localize(translations, ["fr-FR", "de-DE"]);

        // should produce the files, even if there is nothing to localize in them
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml")));

        test.done();
    },

    testXmlFileLocalizeMethodSparse: function(test) {
        test.expect(7);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml")));

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/sparse2.xml",
            type: t
        });
        test.ok(xf);

        // should read the file
        xf.extract();

        // only translate some of the strings
        var translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "plurals/bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "singulaire",
                "many": "plupart",
                "other": "autres"
            },
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        translations.add(new ResourcePlural({
            project: "foo",
            key: "plurals/bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "einslige",
                "many": "mehrere",
                "other": "andere"
            },
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "Die b",
            targetLocale: "de-DE",
            datatype: "xml"
        }));

        xf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml")));

        // should only contain the things that were actually translated
        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"), "utf-8");

        var expected =
             '<resources>\n' +
             '    <plurals name="bar">\n' +
             '        <item quantity="one">singulaire</item>\n' +
             '        <item quantity="many">plupart</item>\n' +
             '        <item quantity="other">autres</item>\n' +
             '    </plurals>\n' +
             '    <strings>\n' +
             '        <string name="a">la b</string>\n' +
             '    </strings>\n' +
             '</resources>\n';

        diff(content, expected);
        test.equal(content, expected);

        content = fs.readFileSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"), "utf-8");

        var expected =
             '<resources>\n' +
             '    <plurals name="bar">\n' +
             '        <item quantity="one">einslige</item>\n' +
             '        <item quantity="many">mehrere</item>\n' +
             '        <item quantity="other">andere</item>\n' +
             '    </plurals>\n' +
             '    <strings>\n' +
             '        <string name="a">Die b</string>\n' +
             '    </strings>\n' +
             '</resources>\n';
        diff(content, expected);
        test.equal(content, expected);

        test.done();
    },

    testXmlFileLocalizeExtractNewStrings: function(test) {
        test.expect(43);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml")));

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/sparse2.xml",
            type: t
        });
        test.ok(xf);

        // make sure we start off with no new strings
        t.newres.clear();
        test.equal(t.newres.size(), 0);

        // should read the file
        xf.extract();

        // only translate some of the strings
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        translations.add(new ResourcePlural({
            project: "foo",
            key: "plurals/bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "einslige",
                "many": "mehrere",
                "other": "andere"
            },
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "Die b",
            targetLocale: "de-DE",
            datatype: "xml"
        }));

        xf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml")));

        // now verify that the strings which did not have translations show up in the
        // new strings translation set
        test.equal(t.newres.size(), 7);
        var resources = t.newres.getAll();
        test.equal(resources.length, 7);

        test.equal(resources[0].getType(), "plural");
        test.equal(resources[0].getKey(), "plurals/bar");
        test.equal(resources[0].getTargetLocale(), "fr-FR");
        var pluralStrings = resources[0].getSourcePlurals();
        test.ok(pluralStrings);
        test.equal(pluralStrings.one, "one");
        test.equal(pluralStrings.other, "other");
        pluralStrings = resources[0].getTargetPlurals();
        test.ok(pluralStrings);
        test.equal(pluralStrings.one, "one");
        test.equal(pluralStrings.other, "other");

        test.equal(resources[1].getType(), "array");
        test.equal(resources[1].getKey(), "arrays/asdf");
        test.equal(resources[1].getTargetLocale(), "fr-FR");
        var arrayStrings = resources[1].getSourceArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings[0], "value 1");
        test.equal(arrayStrings[1], "value 2");
        test.equal(arrayStrings[2], "value 3");
        arrayStrings = resources[1].getTargetArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings[0], "value 1");
        test.equal(arrayStrings[1], "value 2");
        test.equal(arrayStrings[2], "value 3");

        test.equal(resources[2].getType(), "array");
        test.equal(resources[2].getKey(), "arrays/asdfasdf");
        test.equal(resources[2].getTargetLocale(), "fr-FR");
        var arrayStrings = resources[2].getSourceArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings[0], "1");
        test.equal(arrayStrings[1], "2");
        test.equal(arrayStrings[2], "3");
        arrayStrings = resources[2].getTargetArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings[0], "1");
        test.equal(arrayStrings[1], "2");
        test.equal(arrayStrings[2], "3");

        test.equal(resources[3].getType(), "string");
        test.equal(resources[3].getSource(), "d");
        test.equal(resources[3].getKey(), "strings/c");
        test.equal(resources[3].getTargetLocale(), "fr-FR");

        test.done();
    },

    testXmlFileLocalizeWithAlternateFileNameTemplate: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/deep_fr-FR.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/deep_de-DE.xml"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.xml")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.xml")));

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/deep.xml",
            type: t
        });
        test.ok(xf);

        // should read the file
        xf.extract();

        // only translate some of the strings
        var translations = new TranslationSet();

        xf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.xml")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.xml")));

        test.done();
    },

    testXmlFileLocalizeDefaultMethodAndTemplate: function(test) {
        test.expect(4);

        var base = path.dirname(module.id);

        var xf = new XmlFile({
            project: p,
            pathName: "x/y/str.xml",
            type: t
        });
        test.ok(xf);

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        // default template is resources/[localeDir]/[filename]
        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/str.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/str.xml"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/str.xml")));

        xf.localize(translations, ["fr-FR"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/str.xml")));

        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/str.xml"), "utf-8");

        // default method is copy so this should be the whole file
        var expected =
            '<resources>\n' +
            '    <string name="string 1">C\'est la chaîne numéro 1</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n';

        diff(content, expected);
        test.equal(content, expected);

        test.done();
    }
};
