/*
 * XmlFile.test.js - test the XML file handler object.
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
var fs = require("fs");

if (!XmlFile) {
    var XmlFile = require("../XmlFile.js");
    var XmlFileType = require("../XmlFileType.js");

    var CustomProject =  require("loctool/lib/CustomProject.js");
    var TranslationSet =  require("loctool/lib/TranslationSet.js");
    var ContextResourceString =  require("loctool/lib/ContextResourceString.js");
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
    sourceLocale: "en-US",
    plugins: [
        path.join(process.cwd(), "XmlFileType")
    ]
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
            "xml/values/*.xml": {
                "schema": "android-resource-schema",
                "method": "sparse",
                "template": "resources/values-[language]-r[region]/[filename]"
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
            /*
            not implemented yet
            "** /spread.xml": {
                "schema": "strings-schema",
                "method": "spread",
                "template": "resources/[localeDir]/spread.xml"
            },
            */
            "**/deep.xml": {
                "schema": "http://github.com/ilib-js/deep.json",
                "method": "copy",
                "flavor": "chocolate",
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
                "template": "resources/[localeDir]/arrays.xml",
                "localeMap": {
                    "de-DE": "de",
                    "fr-FR": "fr",
                    "sv-SE": "sv",
                    "en-001": "en-GB"
                }
            },
            "**/arrays-sparse.xml": {
                "schema": "http://github.com/ilib-js/arrays.json",
                "method": "sparse",
                "template": "resources/[localeDir]/arrays.xml"
            },
            "**/array-refs.xml": {
                "schema": "http://github.com/ilib-js/array-refs.json",
                "method": "copy",
                "template": "resources/[localeDir]/array-refs.xml"
            },
            "**/*.translation-meta.xml": {
                "schema": "translations-meta-schema",
                "method": "copy",
                "template": "[dir]/[basename]-[localeUnder].[extension]"
            }
        }
    }
});
var t = new XmlFileType(p);

var p2 = new CustomProject({
    name: "foo",
    id: "foo",
    sourceLocale: "en-US",
    plugins: [
        path.join(process.cwd(), "XmlFileType")
    ]
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

beforeAll(function() {
    // initialize so we get the right resource string type
    p.init(function() {
        p2.init(function() {
        });
    });
});

function rmrf(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

afterEach(function() {
    [
        "./test/testfiles/resources/ja/JP/messages.xml",
        "./test/testfiles/resources/ru/RU/messages.xml",
        "./test/testfiles/resources/de/DE/sparse2.xml",
        "./test/testfiles/resources/de/DE/messages.xml",
        "./test/testfiles/resources/fr/FR/sparse2.xml",
        "./test/testfiles/resources/fr/FR/messages.xml",
        "./test/testfiles/resources/deep_de-DE.xml",
        "./test/testfiles/resources/deep_fr-FR.xml",
        "./test/testfiles/x/y/nomatch-ja_JP.xml",
        "./test/testfiles/x/y/nomatch-fr_FR.xml",
        "./test/testfiles/x/y/nomatch-ru_RU.xml"
    ].forEach(rmrf);
});

describe("xmlfile", function() {
    test("XmlFileConstructor", function() {
        expect.assertions(1);

        var xf = new XmlFile({project: p, type: t});
        expect(xf).toBeTruthy();
    });

    test("XmlFileConstructorParams", function() {
        expect.assertions(1);

        var xf = new XmlFile({
            project: p,
            pathName: "./testfiles/xml/messages.xml",
            type: t
        });

        expect(xf).toBeTruthy();
    });

    test("XmlFileConstructorNoFile", function() {
        expect.assertions(1);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        expect(xf).toBeTruthy();
    });

    test("XmlFileEscapeProp", function() {
        expect.assertions(1);

        expect(XmlFile.escapeProp("escape/tilde~tilde")).toBe("escape~1tilde~0tilde");
    });

    test("XmlFileEscapePropNoChange", function() {
        expect.assertions(1);

        expect(XmlFile.escapeProp("permissions")).toBe("permissions");
    });

    test("XmlFileEscapePropDontEscapeOthers", function() {
        expect.assertions(1);

        expect(XmlFile.escapeProp("permissions% \" ^ | \\")).toBe("permissions% \" ^ | \\");
    });

    test("XmlFileUnescapeProp", function() {
        expect.assertions(1);

        expect(XmlFile.unescapeProp("escape~0tilde~1tilde")).toBe("escape~tilde/tilde");
    });

    test("XmlFileUnescapePropTricky", function() {
        expect.assertions(1);

        expect(XmlFile.unescapeProp("escape~3tilde~4tilde")).toBe("escape~3tilde~4tilde");
    });

    test("XmlFileUnescapePropNoChange", function() {
        expect.assertions(1);

        expect(XmlFile.unescapeProp("permissions")).toBe("permissions");
    });

    test("XmlFileUnescapePropDontEscapeOthers", function() {
        expect.assertions(1);

        expect(XmlFile.unescapeProp("permissions% \" ^ | \\")).toBe("permissions% \" ^ | \\");
    });

    test("XmlFileEscapeRef", function() {
        expect.assertions(1);

        expect(XmlFile.escapeRef("escape/tilde~tilde")).toBe("escape~1tilde~0tilde");
    });

    test("XmlFileEscapeRefNoChange", function() {
        expect.assertions(1);

        expect(XmlFile.escapeRef("permissions")).toBe("permissions");
    });

    test("XmlFileEscapeRefDontEscapeOthers", function() {
        expect.assertions(1);

        expect(XmlFile.escapeRef("permissions% \" ^ | \\")).toBe("permissions%25%20%22%20%5E%20%7C%20%5C");
    });

    test("XmlFileUnescapeRef", function() {
        expect.assertions(1);

        expect(XmlFile.unescapeRef("escape~0tilde~1tilde")).toBe("escape~tilde/tilde");
    });

    test("XmlFileUnescapeRefTricky", function() {
        expect.assertions(1);

        expect(XmlFile.unescapeRef("escape~3tilde~4tilde")).toBe("escape~3tilde~4tilde");
    });

    test("XmlFileUnescapeRefNoChange", function() {
        expect.assertions(1);

        expect(XmlFile.unescapeRef("permissions")).toBe("permissions");
    });

    test("XmlFileUnescapeRefDontEscapeOthers", function() {
        expect.assertions(1);

        expect(XmlFile.unescapeRef("permissions%25%20%22%20%5E%20%7C%20%5C")).toBe("permissions% \" ^ | \\");
    });

    test("XmlFileParseSimpleGetByKey", function() {
        expect.assertions(5);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("foo", undefined, "en-US", "string 1", "xml", undefined));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("this is string one");
        expect(r.getKey()).toBe("string 1");
    });

    test("XmlFileParseSimpleRightStrings", function() {
        expect.assertions(8);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("this is string one");
        expect(resources[0].getKey()).toBe("string 1");

        expect(resources[1].getSource()).toBe("this is string two");
        expect(resources[1].getKey()).toBe("string 2");
    });

    test("XmlFileParseSimpleExtractEmpty", function() {
        expect.assertions(10);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2"></string>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("this is string one");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getType()).toBe("string");

        expect(resources[1].getSource()).toBe("");
        expect(resources[1].getKey()).toBe("string 2");
        expect(resources[1].getType()).toBe("string");
    });

    test("XmlFileParseAllFields", function() {
        expect.assertions(16);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1" i18n="this is comment 1" locale="de-DE" context="fooasdf" formatted="true">this is string one</string>\n' +
            '    <string name="string 2" i18n="this is comment 2" locale="zh-Hans-CN" context="badda bing" formatted="false">this is string two</string>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("this is string one");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getComment()).toBe("this is comment 1");
        expect(resources[0].getSourceLocale()).toBe("de-DE");
        expect(resources[0].getContext()).toBe("fooasdf");
        expect(resources[0].formatted).toBeTruthy();

        expect(resources[1].getSource()).toBe("this is string two");
        expect(resources[1].getKey()).toBe("string 2");
        expect(resources[1].getComment()).toBe("this is comment 2");
        expect(resources[1].getSourceLocale()).toBe("zh-Hans-CN");
        expect(resources[1].getContext()).toBe("badda bing");
        expect(!resources[1].formatted).toBeTruthy();
    });

    test("XmlFileParseNormalizeLocale", function() {
        expect.assertions(7);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1" locale="de_DE">this is string one</string>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("this is string one");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getSourceLocale()).toBe("de-DE");
    });

    test("XmlFileParseEscapeStringKeys", function() {
        expect.assertions(8);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string &lt; 1">this is string one</string>\n' +
            '    <string name="string &amp; 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("this is string one");
        expect(resources[0].getKey()).toBe("string < 1");

        expect(resources[1].getSource()).toBe("this is string two");
        expect(resources[1].getKey()).toBe("string & 2");
    });

    test("XmlFileParseSimpleRejectThingsThatAreNotInTheSchema", function() {
        expect.assertions(6);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
             '<resources>\n' +
             '    <string name="string 1">this is string one</string>\n' +
             '    <borky>\n' +
             '        <string name="string 2">this is string two</string>\n' +
             '    </borky>\n' +
             '</resources>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("this is string one");
        expect(resources[0].getKey()).toBe("string 1");
    });

    test("XmlFileParseAllAttributes", function() {
        expect.assertions(8);

        // should default to the android strings schema
        var xf = new XmlFile({
            project: p,
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1" i18n="comment" formatted="true" context="asdf">this is string one</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("foo", "asdf", "en-US", "string 1", "xml", undefined));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("this is string one");
        expect(r.getKey()).toBe("string 1");
        expect(r.getContext()).toBe("asdf");
        expect(r.getComment()).toBe("comment");
        expect(r.formatted).toBeTruthy();
    });

    test("XmlFileParseComplexRightSize", function() {
        expect.assertions(3);

        // when it's named messages.xml, it should apply the messages-schema schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/messages.xml",
            type: t
        });
        expect(xf).toBeTruthy();

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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(4);
    });

    test("XmlFileParseComplexRightStrings", function() {
        expect.assertions(26);

        // when it's named messages.xml, it should apply the messages-schema schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/messages.xml",
            type: t
        });
        expect(xf).toBeTruthy();

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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(4);
        var resources = set.getAll();
        expect(resources.length).toBe(4);

        expect(resources[0].getType()).toBe("plural");
        expect(resources[0].getKey()).toBe("bar");
        var pluralStrings = resources[0].getSourcePlurals();
        expect(pluralStrings).toBeTruthy();
        expect(pluralStrings.one).toBe("singular");
        expect(pluralStrings.many).toBe("many");
        expect(pluralStrings.other).toBe("plural");
        expect(!pluralStrings.zero).toBeTruthy();
        expect(!pluralStrings.two).toBeTruthy();
        expect(!pluralStrings.few).toBeTruthy();

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getSource()).toBe("b");
        expect(resources[1].getKey()).toBe("a");

        expect(resources[2].getType()).toBe("string");
        expect(resources[2].getSource()).toBe("d");
        expect(resources[2].getKey()).toBe("c");

        expect(resources[3].getType()).toBe("array");
        expect(resources[3].getKey()).toBe("asdf");
        var arrayStrings = resources[3].getSourceArray();
        expect(arrayStrings).toBeTruthy();
        expect(arrayStrings.length).toBe(3);
        expect(arrayStrings[0]).toBe("value 1");
        expect(arrayStrings[1]).toBe("value 2");
        expect(arrayStrings[2]).toBe("value 3");
    });

    test("XmlFileParseComplexNestedStrings", function() {
        expect.assertions(10);

        // when it's named messages.xml, it should apply the messages-schema schema
        var xf = new XmlFile({
            project: p,
            pathName: "force-app/default/main/translations/app.translation-meta.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<Translations>\n' +
            '    <reportTypes>\n' +
            '        <name>Report1</name>\n' +
            '        <label>Report One</label>\n' +
            '        <sections>\n' +
            '            <name>Section1</name>\n' +
            '            <label>Section One</label>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getSource()).toBe("Section One");
        expect(resources[0].getKey()).toBe("Section1");

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getKey()).toBe("Report1");
        expect(resources[1].getSource()).toBe("Report One");
    });

    test("XmlFileParseArrayOfStrings", function() {
        expect.assertions(11);

        // when it's named arrays.xml, it should apply the arrays schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        expect(xf).toBeTruthy();

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
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);

        var resources = set.getAll();
        expect(resources.length).toBe(1);
        expect(resources[0].getType()).toBe('array');
        expect(resources[0].getKey()).toBe('strings');

        var arrayStrings = resources[0].getSourceArray();
        expect(arrayStrings).toBeTruthy();
        expect(arrayStrings.length).toBe(3);
        expect(arrayStrings[0]).toBe("string 1");
        expect(arrayStrings[1]).toBe("string 2");
        expect(arrayStrings[2]).toBe("string 3");
    });

    test("XmlFileParseArrayOfNumbers", function() {
        expect.assertions(12);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        expect(xf).toBeTruthy();

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
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);

        var resources = set.getAll();
        expect(resources.length).toBe(1);
        expect(resources[0].getType()).toBe('array');
        expect(resources[0].getKey()).toBe('numbers');

        var arrayNumbers = resources[0].getSourceArray();
        expect(arrayNumbers).toBeTruthy();
        expect(arrayNumbers.length).toBe(4);
        expect(arrayNumbers[0]).toBe("15");
        expect(arrayNumbers[1]).toBe("-3");
        expect(arrayNumbers[2]).toBe("1.18");
        expect(arrayNumbers[3]).toBe("0");
    });

    test("XmlFileParseArrayOfBooleans", function() {
        expect.assertions(10);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <booleans name="booleans">\n' +
            '        <item>true</item>\n' +
            '        <item>false</item>\n' +
            '    </booleans>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);

        var resources = set.getAll();
        expect(resources.length).toBe(1);
        expect(resources[0].getType()).toBe('array');
        expect(resources[0].getKey()).toBe('booleans');

        var arrayBooleans = resources[0].getSourceArray();
        expect(arrayBooleans).toBeTruthy();
        expect(arrayBooleans.length).toBe(2);
        expect(arrayBooleans[0]).toBe("true");
        expect(arrayBooleans[1]).toBe("false");
    });

    test("XmlFileParseWithBasename", function() {
        expect.assertions(8);

        // when it's named messages.xml, it should apply the messages-schema schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/messages.xml",
            type: t
        });
        expect(xf).toBeTruthy();

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
            '        <a basename="testing the basename">b</a>\n' +
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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(4);
        var resources = set.getAll();
        expect(resources.length).toBe(4);

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getSource()).toBe("b");
        expect(resources[1].getKey()).toBe("a");
        // basename of the path to this xml file with no extensions
        expect(resources[1].getContext()).toBe("messages");
    });

    test("XmlFileParseWithPathname", function() {
        expect.assertions(8);

        // when it's named messages.xml, it should apply the messages-schema schema
        var xf = new XmlFile({
            project: p,
            pathName: "i18n/messages.xml",
            type: t
        });
        expect(xf).toBeTruthy();

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
            '        <a pathname="testing the pathname">b</a>\n' +
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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(4);
        var resources = set.getAll();
        expect(resources.length).toBe(4);

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getSource()).toBe("b");
        expect(resources[1].getKey()).toBe("a");
        // the path to the file
        expect(resources[1].getContext()).toBe("i18n/messages.xml");
    });

    test("XmlFileParseDeepRightSize", function() {
        expect.assertions(3);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/deep.xml",
            type: t
        });
        expect(xf).toBeTruthy();

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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(3);
    });

    test("XmlFileParseDeepRightStrings", function() {
        expect.assertions(22);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/deep.xml",
            type: t
        });
        expect(xf).toBeTruthy();

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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(3);
        var resources = set.getAll();
        expect(resources.length).toBe(3);

        expect(resources[0].getType()).toBe("plural");
        expect(resources[0].getKey()).toBe("bar");
        var pluralStrings = resources[0].getSourcePlurals();
        expect(pluralStrings).toBeTruthy();
        expect(pluralStrings.one).toBe("singular");
        expect(pluralStrings.many).toBe("many");
        expect(pluralStrings.other).toBe("plural");
        expect(!pluralStrings.zero).toBeTruthy();
        expect(!pluralStrings.two).toBeTruthy();
        expect(!pluralStrings.few).toBeTruthy();
        expect(resources[0].flavor).toBe("chocolate");

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getSource()).toBe("b");
        expect(resources[1].getKey()).toBe("a");
        expect(resources[1].flavor).toBe("chocolate");

        expect(resources[2].getType()).toBe("string");
        expect(resources[2].getSource()).toBe("d");
        expect(resources[2].getKey()).toBe("c");
        expect(resources[2].flavor).toBe("chocolate");
    });

    test("XmlFileParseTestInvalidXml", function() {
        expect.assertions(2);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/deep.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        expect(function(test) {
            xf.parse(
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
            );
         }).toThrow();
    });

    test("XmlFileParseRefsRightSize", function() {
        expect.assertions(3);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/refs.xml",
            type: t
        });
        expect(xf).toBeTruthy();

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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(3);
    });

    test("XmlFileParseRefsRightStrings", function() {
        expect.assertions(13);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/refs.xml",
            type: t
        });
        expect(xf).toBeTruthy();

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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(3);
        var resources = set.getAll();
        expect(resources.length).toBe(3);

        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getSource()).toBe("Mobile");
        expect(resources[0].getKey()).toBe("root/owner/phone/type");

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getSource()).toBe("Home");
        expect(resources[1].getKey()).toBe("root/customer1/phone/type");

        expect(resources[2].getType()).toBe("string");
        expect(resources[2].getSource()).toBe("Work");
        expect(resources[2].getKey()).toBe("root/customer2/phone/type");
    });

    test("XmlFileParseDefaultSchema", function() {
        expect.assertions(5);

        var xf = new XmlFile({
            project: p,
            pathName: "a/b/c/str.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("foo", undefined, "en-US", "string 1", "xml", undefined));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("this is string one");
        expect(r.getKey()).toBe("string 1");
    });

    test("XmlFileParseExtractComments", function() {
        expect.assertions(10);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1" i18n="comment for string 1">this is string one</string>\n' +
            '    <string name="string 2" i18n="comment for string 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("this is string one");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getComment()).toBe("comment for string 1");

        expect(resources[1].getSource()).toBe("this is string two");
        expect(resources[1].getKey()).toBe("string 2");
        expect(resources[1].getComment()).toBe("comment for string 2");
    });

    test("XmlFileParseArraysOfArrays", function() {
        expect.assertions(18);

        var xf = new XmlFile({
            project: p,
            pathName: "xml/values/arrays.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
             '<resources>\n' +
             '    <string-array name="array1">\n' +
             '        <item>array 1 item 1</item>\n' +
             '        <item>array 1 item 2</item>\n' +
             '        <item>array 1 item 3</item>\n' +
             '    </string-array>\n' +
             '    <string-array name="array2">\n' +
             '        <item>array 2 item 1</item>\n' +
             '        <item>array 2 item 2</item>\n' +
             '        <item>array 2 item 3</item>\n' +
             '    </string-array>\n' +
             '</resources>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getType()).toBe("array");
        expect(resources[0].getKey()).toBe("array1");
        var arr = resources[0].getSourceArray();
        expect(arr).toBeTruthy();
        expect(arr.length).toBe(3);
        expect(arr[0]).toBe("array 1 item 1");
        expect(arr[1]).toBe("array 1 item 2");
        expect(arr[2]).toBe("array 1 item 3");

        expect(resources[1].getType()).toBe("array");
        expect(resources[1].getKey()).toBe("array2");
        arr = resources[1].getSourceArray();
        expect(arr).toBeTruthy();
        expect(arr.length).toBe(3);
        expect(arr[0]).toBe("array 2 item 1");
        expect(arr[1]).toBe("array 2 item 2");
        expect(arr[2]).toBe("array 2 item 3");
    });

    test("XmlFileParseArraysOfPlurals", function() {
        expect.assertions(16);

        var xf = new XmlFile({
            project: p,
            pathName: "xml/values/plurals.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
             '<resources>\n' +
             '    <plurals name="plural1">\n' +
             '        <item quantity="one">plural 1 item 1</item>\n' +
             '        <item quantity="many">plural 1 item 2</item>\n' +
             '        <item quantity="other">plural 1 item 3</item>\n' +
             '    </plurals>\n' +
             '    <plurals name="plural2">\n' +
             '        <item quantity="one">plural 2 item 1</item>\n' +
             '        <item quantity="many">plural 2 item 2</item>\n' +
             '        <item quantity="other">plural 2 item 3</item>\n' +
             '    </plurals>\n' +
             '</resources>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getType()).toBe("plural");
        expect(resources[0].getKey()).toBe("plural1");
        var plural = resources[0].getSourcePlurals();
        expect(plural).toBeTruthy();
        expect(plural.one).toBe("plural 1 item 1");
        expect(plural.many).toBe("plural 1 item 2");
        expect(plural.other).toBe("plural 1 item 3");

        expect(resources[1].getType()).toBe("plural");
        expect(resources[1].getKey()).toBe("plural2");
        plural = resources[1].getSourcePlurals();
        expect(plural).toBeTruthy();
        expect(plural.one).toBe("plural 2 item 1");
        expect(plural.many).toBe("plural 2 item 2");
        expect(plural.other).toBe("plural 2 item 3");
    });

    test("XmlFileParseArraysOfStrings", function() {
        expect.assertions(10);

        var xf = new XmlFile({
            project: p,
            pathName: "xml/values/strings.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
             '<resources>\n' +
             '    <string name="string1">This is string1</string>\n' +
             '    <string name="string2">This is string2</string>\n' +
             '</resources>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getKey()).toBe("string1");
        expect(resources[0].getSource()).toBe("This is string1");

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getKey()).toBe("string2");
        expect(resources[1].getSource()).toBe("This is string2");
    });

    test("XmlFileExtractFile", function() {
        expect.assertions(46);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/messages.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        // should read the file
        xf.extract();

        var set = xf.getTranslationSet();

        expect(set.size()).toBe(9);

        var resources = set.getAll();
        expect(resources.length).toBe(9);

        expect(resources[0].getType()).toBe("plural");
        var categories = resources[0].getSourcePlurals();
        expect(categories).toBeTruthy();
        expect(categories.other).toBe("asdf");
        expect(!categories.many).toBeTruthy();
        expect(!categories.one).toBeTruthy();
        expect(resources[0].getKey()).toBe("foo");

        expect(resources[1].getType()).toBe("plural");
        categories = resources[1].getSourcePlurals();
        expect(categories).toBeTruthy();
        expect(categories.one).toBe("one");
        expect(categories.many).toBe("many");
        expect(categories.other).toBe("other");
        expect(resources[1].getKey()).toBe("bar");

        expect(resources[2].getType()).toBe("plural");
        categories = resources[2].getSourcePlurals();
        expect(categories).toBeTruthy();
        expect(categories.one).toBe("one");
        expect(categories.many).toBe("many");
        expect(categories.other).toBe("other");
        expect(resources[2].getKey()).toBe("attribute");

        expect(resources[3].getType()).toBe("plural");
        categories = resources[3].getSourcePlurals();
        expect(categories).toBeTruthy();
        expect(categories.one).toBe("one");
        expect(categories.many).toBe("many");
        expect(categories.other).toBe("other");
        expect(resources[3].getKey()).toBe("hybrid");

        expect(resources[4].getType()).toBe("array");
        var arr = resources[4].getSourceArray();
        expect(arr).toBeTruthy();
        expect(arr.length).toBe(3);
        expect(arr[0]).toBe("value 1");
        expect(arr[1]).toBe("value 2");
        expect(arr[2]).toBe("value 3");
        expect(resources[4].getKey()).toBe("asdf");

        expect(resources[5].getType()).toBe("string");
        expect(resources[5].getSource()).toBe("b");
        expect(resources[5].getKey()).toBe("a");

        expect(resources[6].getType()).toBe("string");
        expect(resources[6].getSource()).toBe("d");
        expect(resources[6].getKey()).toBe("c");

        expect(resources[7].getType()).toBe("string");
        expect(resources[7].getSource()).toBe("f");
        expect(resources[7].getKey()).toBe("key1");

        expect(resources[8].getType()).toBe("string");
        expect(resources[8].getSource()).toBe("g");
        expect(resources[8].getKey()).toBe("key2");
    });

    test("XmlFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        expect(xf).toBeTruthy();

        // should attempt to read the file and not fail
        xf.extract();

        var set = xf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("XmlFileExtractBogusFile", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/bogus.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        // should attempt to read the file and not fail
        xf.extract();

        var set = xf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("XmlFileLocalizeTextSimple", function() {
        expect.assertions(2);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
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
        expect(actual).toBe(expected);
    });

    test("XmlFileLocalizeTextRemoveComments", function() {
        expect.assertions(2);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1"><!-- test1 -->this is string one</string>\n' +
            '    <string name="string 2"><!-- test2 -->this is string two</string>\n' +
            '</resources>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
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
        expect(actual).toBe(expected);
    });

    test("XmlFileLocalizeWithEmptyStringInFile", function() {
        expect.assertions(2);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2"></string>\n' +
            '</resources>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
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
            '    <string name="string 2"/>\n' +
            '</resources>\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("XmlFileLocalizeTheEmptyString", function() {
        expect.assertions(2);

        var xf = new XmlFile({
            project: p,
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2"></string>\n' +
            '</resources>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 2",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
            '<resources>\n' +
            '    <string name="string 1">C\'est la chaîne numéro 1</string>\n' +
            '    <string name="string 2">C\'est la chaîne numéro 2</string>\n' +
            '</resources>\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("XmlFileLocalizeTextWithSchema", function() {
        expect.assertions(2);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/messages.xml",
            type: t
        });
        expect(xf).toBeTruthy();

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
            key: "bar",
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
        translations.add(new ContextResourceString({
            project: "foo",
            key: "a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "c",
            source: "d",
            sourceLocale: "en-US",
            target: "la d",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceArray({
            project: "foo",
            key: "asdf",
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
        expect(actual).toBe(expected);
    });

    test("XmlFileLocalizeTextMethodSparse", function() {
        expect.assertions(2);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/sparse.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
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
        expect(actual).toBe(expected);
    });

    test("XmlFileLocalizeTextWithSchemaSparseComplex", function() {
        expect.assertions(2);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/sparse2.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
             '<messages>\n' +
             '    <plurals>\n' +
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
             '    <string-array name="asdf">\n' +
             '        <item>string 1</item>\n' +
             '        <item>string 2</item>\n' +
             '        <item>string 3</item>\n' +
             '    </string-array>\n' +
             '</messages>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "bar",
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
        translations.add(new ContextResourceString({
            project: "foo",
            key: "a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        var actual = xf.localizeText(translations, "fr-FR");
        var expected =
             '<messages>\n' +
             '    <plurals>\n' +
             '        <bar>\n' +
             '            <one>singulaire</one>\n' +
             '            <many>plupart</many>\n' +
             '            <other>autres</other>\n' +
             '        </bar>\n' +
             '    </plurals>\n' +
             '    <strings>\n' +
             '        <a>la b</a>\n' +
             '    </strings>\n' +
             '</messages>\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("XmlFileLocalizeArrayOfStrings", function() {
        expect.assertions(2);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
             '    <strings name="strings">\n' +
             '        <item>string 1</item>\n' +
             '        <item>string 2</item>\n' +
             '        <item>string 3</item>\n' +
             '    </strings>\n' +
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
             '    <strings name="strings">\n' +
             '        <item>chaîne 1</item>\n' +
             '        <item>chaîne 2</item>\n' +
             '        <item>chaîne 3</item>\n' +
             '    </strings>\n' +
             '</resources>\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("XmlFileLocalizeArrayOfStringsSparse", function() {
        expect.assertions(6);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays-sparse.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <strings name="strings">\n' +
            '        <item>string 1</item>\n' +
            '        <item>string 2</item>\n' +
            '        <item>string 3</item>\n' +
            '    </strings>\n' +
            '    <strings name="strings2">\n' +
            '        <item>a1</item>\n' +
            '        <item>b2</item>\n' +
            '        <item>c3</item>\n' +
            '    </strings>\n' +
            '</resources>\n'
        );

        var set = xf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);

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
             '    <strings name="strings">\n' +
             '        <item>chaîne 1</item>\n' +
             '        <item>chaîne 2</item>\n' +
             '        <item>chaîne 3</item>\n' +
             '    </strings>\n' +
             '</resources>\n';

        set = xf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("XmlFileLocalizeArrayOfNumbers", function() {
        expect.assertions(2);

        var xf = new XmlFile({
            project: p,
            pathName: "i18n/arrays.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <strings name="numbers">\n' +
            '        <item>15</item>\n' +
            '        <item>-3</item>\n' +
            '        <item>1.18</item>\n' +
            '        <item>0</item>\n' +
            '    </strings>\n' +
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
            '    <strings name="numbers">\n' +
            '        <item>29</item>\n' +
            '        <item>12</item>\n' +
            '        <item>-17.3</item>\n' +
            '        <item>0</item>\n' +
            '    </strings>\n' +
            '</resources>\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("XmlFileLocalizeTextUsePseudoForMissing", function() {
        expect.assertions(2);

        var xf = new XmlFile({
            project: p2,
            pathName: "./xml/messages.xml",
            type: t2
        });
        expect(xf).toBeTruthy();

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
            '            <one>[šíñğüľàŕ3210]</one>\n' +
            '            <many>[màñÿ10]</many>\n' +
            '            <other>[þľüŕàľ210]</other>\n' +
            '        </bar>\n' +
            '    </plurals>\n' +
            '    <strings>\n' +
            '        <a>[b0]</a>\n' +
            '        <c>[ð0]</c>\n' +
            '    </strings>\n' +
            '    <arrays>\n' +
            '        <asdf i18n="comment">\n' +
            '            <item>[Šţŕíñğ 13210]</item>\n' +
            '            <item>[Šţŕíñğ 23210]</item>\n' +
            '            <item>[Šţŕíñğ 33210]</item>\n' +
            '        </asdf>\n' +
            '    </arrays>\n' +
            '</messages>\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

/*
    not implemented yet

    test("XmlFileLocalizeTextMethodSpread", function() {
        expect.assertions(2);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/spread.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '{\n' +
            '    "string 1": "this is string one",\n' +
            '    "string 2": "this is string two"\n' +
            '}\n');

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
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
        expect(actual).toBe(expected);
    });

    test("XmlFileLocalizeTextMethodSpreadMultilingual", function() {
        expect.assertions(2);

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/spread.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '{\n' +
            '    "string 1": "this is string one",\n' +
            '    "string 2": "this is string two"\n' +
            '}\n');

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "this is string two",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 2",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "Dies ist die Zeichenfolge 1",
            targetLocale: "de",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
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
        expect(actual).toBe(expected);
    });
*/

    test("XmlGetLocalizedPath", function() {
        expect.assertions(4);

        // mapping contains a locale map
        var xf = new XmlFile({
            project: p,
            pathName: "./xml/arrays.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        expect(xf.getLocalizedPath("de-DE")).toBe("resources/de/arrays.xml");
        expect(xf.getLocalizedPath("fr-FR")).toBe("resources/fr/arrays.xml");
        expect(xf.getLocalizedPath("en-001")).toBe("resources/en/GB/arrays.xml");
    });

    test("XmlGetLocalizedPathNonMapping", function() {
        expect.assertions(3);

        // mapping contains a locale map
        var xf = new XmlFile({
            project: p,
            pathName: "./xml/arrays.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        // non-mappings
        expect(xf.getLocalizedPath("da")).toBe("resources/da/arrays.xml");
        expect(xf.getLocalizedPath("en-CA")).toBe("resources/en/CA/arrays.xml");
    });

    test("XmlGetLocalizedPathNoLocaleMap", function() {
        expect.assertions(4);

        // mapping does not contain a locale map
        var xf = new XmlFile({
            project: p,
            pathName: "xml/values/strings.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        expect(xf.getLocalizedPath("de-DE")).toBe("resources/values-de-rDE/strings.xml");
        expect(xf.getLocalizedPath("fr-FR")).toBe("resources/values-fr-rFR/strings.xml");
        expect(xf.getLocalizedPath("en-001")).toBe("resources/values-en-r001/strings.xml");
    });

    test("XmlFileLocalize", function() {
        expect.assertions(7);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/messages.xml"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml"))).toBeTruthy();

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/messages.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        // should read the file
        xf.extract();

        var translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "bar",
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
        translations.add(new ContextResourceString({
            project: "foo",
            key: "a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "c",
            source: "d",
            sourceLocale: "en-US",
            target: "la d",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ResourceArray({
            project: "foo",
            key: "asdf",
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
            key: "bar",
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
        translations.add(new ContextResourceString({
            project: "foo",
            key: "a",
            source: "b",
            sourceLocale: "en-US",
            target: "Die b",
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "c",
            source: "d",
            sourceLocale: "en-US",
            target: "Der d",
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ResourceArray({
            project: "foo",
            key: "asdf",
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

        expect(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml"))).toBeTruthy();

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
        expect(content).toBe(expected);

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
        expect(content).toBe(expected);
    });

    test("XmlFileLocalizeNoTranslations", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/messages.xml"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml"))).toBeTruthy();

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/messages.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        // should read the file
        xf.extract();

        var translations = new TranslationSet();

        xf.localize(translations, ["fr-FR", "de-DE"]);

        // should produce the files, even if there is nothing to localize in them
        expect(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.xml"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.xml"))).toBeTruthy();
    });

    test("XmlFileLocalizeMethodSparse", function() {
        expect.assertions(7);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"))).toBeTruthy();

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/sparse2.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        // should read the file
        xf.extract();

        // only translate some of the strings
        var translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "bar",
            sourceStrings: {
                "one": "singular",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "singulaire",
                "other": "autres"
            },
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        translations.add(new ResourcePlural({
            project: "foo",
            key: "bar",
            sourceStrings: {
                "one": "singular",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "einslige",
                "other": "andere"
            },
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "a",
            source: "b",
            sourceLocale: "en-US",
            target: "Die b",
            targetLocale: "de-DE",
            datatype: "xml"
        }));

        xf.localize(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"))).toBeTruthy();

        // should only contain the things that were actually translated
        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"), "utf-8");

        var expected =
             '<messages>\n' +
             '    <plurals>\n' +
             '        <bar>\n' +
             '            <one>singulaire</one>\n' +
             '            <other>autres</other>\n' +
             '        </bar>\n' +
             '    </plurals>\n' +
             '    <strings>\n' +
             '        <a>la b</a>\n' +
             '    </strings>\n' +
             '</messages>\n';

        diff(content, expected);
        expect(content).toBe(expected);

        content = fs.readFileSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"), "utf-8");

        var expected =
             '<messages>\n' +
             '    <plurals>\n' +
             '        <bar>\n' +
             '            <one>einslige</one>\n' +
             '            <other>andere</other>\n' +
             '        </bar>\n' +
             '    </plurals>\n' +
             '    <strings>\n' +
             '        <a>Die b</a>\n' +
             '    </strings>\n' +
             '</messages>\n';
        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("XmlFileLocalizeExtractNewStrings", function() {
        expect.assertions(65);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"))).toBeTruthy();

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/sparse2.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        // make sure we start off with no new strings
        t.newres.clear();
        expect(t.newres.size()).toBe(0);

        // should read the file
        xf.extract();

        // only translate some of the strings
        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        translations.add(new ResourcePlural({
            project: "foo",
            key: "bar",
            sourceStrings: {
                "one": "singular",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "einslige",
                "other": "andere"
            },
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "a",
            source: "b",
            sourceLocale: "en-US",
            target: "Die b",
            targetLocale: "de-DE",
            datatype: "xml"
        }));

        xf.localize(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.xml"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.xml"))).toBeTruthy();

        // now verify that the strings which did not have translations show up in the
        // new strings translation set
        expect(t.newres.size()).toBe(7);
        var resources = t.newres.getAll();
        expect(resources.length).toBe(7);

        expect(resources[0].getType()).toBe("plural");
        expect(resources[0].getKey()).toBe("foo");
        expect(resources[0].getTargetLocale()).toBe("fr-FR");
        var pluralStrings = resources[0].getSourcePlurals();
        expect(pluralStrings).toBeTruthy();
        expect(!pluralStrings.one).toBeTruthy();
        expect(pluralStrings.other).toBe("asdf");
        pluralStrings = resources[0].getTargetPlurals();
        expect(pluralStrings).toBeTruthy();
        expect(!pluralStrings.one).toBeTruthy();
        expect(pluralStrings.other).toBe("asdf");

        expect(resources[1].getType()).toBe("plural");
        expect(resources[1].getKey()).toBe("bar");
        expect(resources[1].getTargetLocale()).toBe("fr-FR");
        var pluralStrings = resources[1].getSourcePlurals();
        expect(pluralStrings).toBeTruthy();
        expect(pluralStrings.one).toBe("one");
        expect(pluralStrings.other).toBe("other");
        pluralStrings = resources[1].getTargetPlurals();
        expect(pluralStrings).toBeTruthy();
        expect(pluralStrings.one).toBe("one");
        expect(pluralStrings.other).toBe("other");

        expect(resources[2].getType()).toBe("array");
        expect(resources[2].getKey()).toBe("asdf");
        expect(resources[2].getTargetLocale()).toBe("fr-FR");
        var arrayStrings = resources[2].getSourceArray();
        expect(arrayStrings).toBeTruthy();
        expect(arrayStrings[0]).toBe("value 1");
        expect(arrayStrings[1]).toBe("value 2");
        expect(arrayStrings[2]).toBe("value 3");
        arrayStrings = resources[2].getTargetArray();
        expect(arrayStrings).toBeTruthy();
        expect(arrayStrings[0]).toBe("value 1");
        expect(arrayStrings[1]).toBe("value 2");
        expect(arrayStrings[2]).toBe("value 3");

        expect(resources[3].getType()).toBe("string");
        expect(resources[3].getSource()).toBe("d");
        expect(resources[3].getKey()).toBe("c");
        expect(resources[3].getTargetLocale()).toBe("fr-FR");

        expect(resources[4].getType()).toBe("plural");
        expect(resources[4].getKey()).toBe("foo");
        expect(resources[4].getTargetLocale()).toBe("de-DE");
        var pluralStrings = resources[4].getSourcePlurals();
        expect(pluralStrings).toBeTruthy();
        expect(!pluralStrings.one).toBeTruthy();
        expect(pluralStrings.other).toBe("asdf");
        pluralStrings = resources[4].getTargetPlurals();
        expect(pluralStrings).toBeTruthy();
        expect(!pluralStrings.one).toBeTruthy();
        expect(pluralStrings.other).toBe("asdf");

        expect(resources[5].getType()).toBe("array");
        expect(resources[5].getKey()).toBe("asdf");
        expect(resources[5].getTargetLocale()).toBe("de-DE");
        var arrayStrings = resources[5].getSourceArray();
        expect(arrayStrings).toBeTruthy();
        expect(arrayStrings[0]).toBe("value 1");
        expect(arrayStrings[1]).toBe("value 2");
        expect(arrayStrings[2]).toBe("value 3");
        arrayStrings = resources[5].getTargetArray();
        expect(arrayStrings).toBeTruthy();
        expect(arrayStrings[0]).toBe("value 1");
        expect(arrayStrings[1]).toBe("value 2");
        expect(arrayStrings[2]).toBe("value 3");

        expect(resources[6].getType()).toBe("string");
        expect(resources[6].getSource()).toBe("d");
        expect(resources[6].getKey()).toBe("c");
        expect(resources[6].getTargetLocale()).toBe("de-DE");
    });

    test("XmlFileLocalizeWithAlternateFileNameTemplate", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/deep_fr-FR.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/deep_de-DE.xml"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.xml"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.xml"))).toBeTruthy();

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/deep.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        // should read the file
        xf.extract();

        // only translate some of the strings
        var translations = new TranslationSet();

        xf.localize(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.xml"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.xml"))).toBeTruthy();
    });

    test("XmlFileLocalizeDefaultMethodAndTemplate", function() {
        expect.assertions(4);

        var base = path.dirname(module.id);

        var xf = new XmlFile({
            project: p,
            pathName: "x/y/nomatch.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        // default template is "[dir]/[basename]-[localeUnder].[extension]"
        if (fs.existsSync(path.join(base, "testfiles/x/y/nomatch-fr_FR.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/x/y/nomatch-fr_FR.xml"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/x/y/nomatch-fr_FR.xml"))).toBeTruthy();

        xf.localize(translations, ["fr-FR"]);

        expect(fs.existsSync(path.join(base, "testfiles/x/y/nomatch-fr_FR.xml"))).toBeTruthy();

        var content = fs.readFileSync(path.join(base, "testfiles/x/y/nomatch-fr_FR.xml"), "utf-8");

        // default method is copy so this should be the whole file
        var expected =
            '<resources>\n' +
            '    <string name="string 1">C\'est la chaîne numéro 1</string>\n' +
            '    <string name="string 2">this is string two</string>\n' +
            '</resources>\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("XmlFileLocalizeWithRussianPlurals", function() {
        expect.assertions(4);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/ru/RU/messages.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/ru/RU/messages.xml"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/ru/RU/messages.xml"))).toBeTruthy();

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/messages.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        // should read the file
        xf.extract();

        var translations = new TranslationSet();
        // more plurals than the original source to test expanding plurals
        // and changing their form
        translations.add(new ResourcePlural({
            project: "foo",
            key: "bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "единственное число",
                "few": "двойной",
                "many": "много",
                "other": "Другие"
            },
            targetLocale: "ru-RU",
            datatype: "xml"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "foo",
            sourceStrings: {
                "other": "asdf"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "единственное число",
                "few": "двойной",
                "many": "много",
                "other": "Другие"
            },
            targetLocale: "ru-RU",
            datatype: "xml"
        }));

        xf.localize(translations, ["ru-RU"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/ru/RU/messages.xml"))).toBeTruthy();

        var content = fs.readFileSync(path.join(base, "testfiles/resources/ru/RU/messages.xml"), "utf-8");

        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<messages>\n' +
            '    <plurals>\n' +
            '        <foo>\n' +
            '            <one>единственное число</one>\n' +
            '            <few>двойной</few>\n' +
            '            <many>много</many>\n' +
            '            <other>Другие</other>\n' +
            '        </foo>\n' +
            '        <bar comment="translator comment">\n' +
            '            <one>единственное число</one>\n' +
            '            <few>двойной</few>\n' +
            '            <many>много</many>\n' +
            '            <other>Другие</other>\n' +
            '        </bar>\n' +
            '        <attribute one="one" few="few" many="many" other="other"/>\n' +
            '        <hybrid one="one" few="few" many="many">other</hybrid>\n' +
            '    </plurals>\n' +
            '    <arrays>\n' +
            '        <asdf i18n="comment">\n' +
            '            <item>value 1</item>\n' +
            '            <item>value 2</item>\n' +
            '            <item>value 3</item>\n' +
            '        </asdf>\n' +
            '        <asdfasdf key="key">\n' +
            '            <item>1</item>\n' +
            '            <item>2</item>\n' +
            '            <item>3</item>\n' +
            '        </asdfasdf>\n' +
            '    </arrays>\n' +
            '    <strings>\n' +
            '        <a>b</a>\n' +
            '        <c>d</c>\n' +
            '        <e key="key1">f</e>\n' +
            '        <e key="key2" value="g"/>\n' +
            '    </strings>\n' +
            '</messages>\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("XmlFileLocalizeWithJapanesePlurals", function() {
        expect.assertions(4);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/ja/JP/messages.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/ja/JP/messages.xml"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/ja/JP/messages.xml"))).toBeTruthy();

        var xf = new XmlFile({
            project: p,
            pathName: "./xml/messages.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        // should read the file
        xf.extract();

        var translations = new TranslationSet();
        // less plurals than the original source to test contracting plurals
        // and changing their forms
        translations.add(new ResourcePlural({
            project: "foo",
            key: "bar",
            sourceStrings: {
                "one": "singular",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "other": "複数"
            },
            targetLocale: "ja-JP",
            datatype: "xml"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "attribute",
            sourceStrings: {
                "one": "singular",
                "few": "few",
                "many": "many",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "other": "複数"
            },
            targetLocale: "ja-JP",
            datatype: "xml"
        }));

        xf.localize(translations, ["ja-JP"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/ja/JP/messages.xml"))).toBeTruthy();

        var content = fs.readFileSync(path.join(base, "testfiles/resources/ja/JP/messages.xml"), "utf-8");

        var expected =
            '<?xml version="1.0" encoding="utf-8"?>\n' +
            '<messages>\n' +
            '    <plurals>\n' +
            '        <foo>asdf</foo>\n' +
            '        <bar comment="translator comment">\n' +
            '            <other>複数</other>\n' +
            '        </bar>\n' +
            '        <attribute other="複数"/>\n' +
            '        <hybrid one="one" few="few" many="many">other</hybrid>\n' +
            '    </plurals>\n' +
            '    <arrays>\n' +
            '        <asdf i18n="comment">\n' +
            '            <item>value 1</item>\n' +
            '            <item>value 2</item>\n' +
            '            <item>value 3</item>\n' +
            '        </asdf>\n' +
            '        <asdfasdf key="key">\n' +
            '            <item>1</item>\n' +
            '            <item>2</item>\n' +
            '            <item>3</item>\n' +
            '        </asdfasdf>\n' +
            '    </arrays>\n' +
            '    <strings>\n' +
            '        <a>b</a>\n' +
            '        <c>d</c>\n' +
            '        <e key="key1">f</e>\n' +
            '        <e key="key2" value="g"/>\n' +
            '    </strings>\n' +
            '</messages>\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("XmlFileLocalizeDefaultSchemaAndroidPluralTemplate", function() {
        expect.assertions(4);

        var base = path.dirname(module.id);

        var xf = new XmlFile({
            project: p,
            pathName: "x/y/nomatch.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <plurals name="plural 1" i18n="comment">\n' +
            '        <item quantity="one">singular</item>\n' +
            '        <item quantity="other">plural</item>\n' +
            '    </plurals>\n' +
            '</resources>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "Это строка первая.",
            targetLocale: "ru-RU",
            datatype: "xml"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "plural 1",
            sourceStrings: {
                "one": "singular",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "один",
                "few": "немного",
                "other": "много"
            },
            targetLocale: "ru-RU",
            datatype: "xml"
        }));


        // default template is "[dir]/[basename]-[localeUnder].[extension]"
        if (fs.existsSync(path.join(base, "testfiles/x/y/nomatch-ru_RU.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/x/y/nomatch-ru_RU.xml"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/x/y/nomatch-ru_RU.xml"))).toBeTruthy();

        xf.localize(translations, ["ru-RU"]);

        expect(fs.existsSync(path.join(base, "testfiles/x/y/nomatch-ru_RU.xml"))).toBeTruthy();

        var content = fs.readFileSync(path.join(base, "testfiles/x/y/nomatch-ru_RU.xml"), "utf-8");

        // default method is copy so this should be the whole file
        var expected =
            '<resources>\n' +
            '    <string name="string 1">Это строка первая.</string>\n' +
            '    <plurals name="plural 1" i18n="comment">\n' +
            '        <item quantity="one">один</item>\n' +
            '        <item quantity="few">немного</item>\n' +
            '        <item quantity="other">много</item>\n' +
            '    </plurals>\n' +
            '</resources>\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("XmlFileLocalizeDefaultSchemaAndroidPluralTemplateJA", function() {
        expect.assertions(4);

        var base = path.dirname(module.id);

        var xf = new XmlFile({
            project: p,
            pathName: "x/y/nomatch.xml",
            type: t
        });
        expect(xf).toBeTruthy();

        xf.parse(
            '<resources>\n' +
            '    <string name="string 1">this is string one</string>\n' +
            '    <plurals name="plural 1" i18n="comment">\n' +
            '        <item quantity="one">singular</item>\n' +
            '        <item quantity="other">plural</item>\n' +
            '    </plurals>\n' +
            '</resources>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "これは文字列1です。",
            targetLocale: "ja-JP",
            datatype: "xml"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "plural 1",
            sourceStrings: {
                "one": "singular",
                "other": "plural"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "other": "多くの"
            },
            targetLocale: "ja-JP",
            datatype: "xml"
        }));


        // default template is "[dir]/[basename]-[localeUnder].[extension]"
        if (fs.existsSync(path.join(base, "testfiles/x/y/nomatch-ja_JP.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/x/y/nomatch-ja_JP.xml"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/x/y/nomatch-ja_JP.xml"))).toBeTruthy();

        xf.localize(translations, ["ja-JP"]);

        expect(fs.existsSync(path.join(base, "testfiles/x/y/nomatch-ja_JP.xml"))).toBeTruthy();

        var content = fs.readFileSync(path.join(base, "testfiles/x/y/nomatch-ja_JP.xml"), "utf-8");

        // default method is copy so this should be the whole file
        var expected =
            '<resources>\n' +
            '    <string name="string 1">これは文字列1です。</string>\n' +
            '    <plurals name="plural 1" i18n="comment">\n' +
            '        <item quantity="other">多くの</item>\n' +
            '    </plurals>\n' +
            '</resources>\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });
});
