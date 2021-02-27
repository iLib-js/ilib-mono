/*
 * testJsonFile.js - test the json file handler object.
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

if (!JsonFile) {
    var JsonFile = require("../JsonFile.js");
    var JsonFileType = require("../JsonFileType.js");

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
    targetDir: "testfiles",
    nopseudo: true,
    json: {
        schemas: [
            "./test/testfiles/schemas"
        ],
        mappings: {
            "resources/en/US/strings.json": {
                "schema": "./testfiles/schema/strings-schema.json",
                "method": "copy",
                "template": "resources/[localeDir]/strings.json"
            },
            "**/messages.json": {
                "schema": "http://github.com/ilib-js/messages.json",
                "method": "copy",
                "template": "resources/[localeDir]/messages.json"
            },
            "**/deep.json": {
                "schema": "http://github.com/ilib-js/deep.json",
                "method": "copy",
                "template": "resources/deep_[locale].json"
            },
            "**/refs.json": {
                "schema": "http://github.com/ilib-js/refs.json",
                "method": "copy",
                "template": "resources/[locale]/refs.json"
            }
        }
    }
});
var t = new JsonFileType(p);

var p2 = new CustomProject({
    name: "foo",
    id: "foo",
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"],
    identify: true,
    targetDir: "testfiles"
});

var t2 = new JsonFileType(p2);

module.exports.jsonfile = {
    testJsonFileConstructor: function(test) {
        test.expect(1);

        var jf = new JsonFile({project: p, type: t});
        test.ok(jf);

        test.done();
    },

    testJsonFileConstructorParams: function(test) {
        test.expect(1);

        var jf = new JsonFile({
            project: p,
            pathName: "./testfiles/json/messages.json",
            type: t
        });

        test.ok(jf);

        test.done();
    },

    testJsonFileConstructorNoFile: function(test) {
        test.expect(1);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        test.done();
    },

    testJsonFileEscapeProp: function(test) {
        test.expect(1);

        test.ok(JsonFile.escapeProp("escape/tilde~tilde"), "escape~0tilde~1tilde");

        test.done();
    },

    testJsonFileEscapePropNoChange: function(test) {
        test.expect(1);

        test.ok(JsonFile.escapeProp("permissions"), "permissions");

        test.done();
    },

    testJsonFileEscapePropDontEscapeOthers: function(test) {
        test.expect(1);

        test.ok(JsonFile.escapeProp("permissions% \" ^ | \\"), "permissions% \" ^ | \\");

        test.done();
    },

    testJsonFileUnescapeProp: function(test) {
        test.expect(1);

        test.ok(JsonFile.unescapeProp("escape~0tilde~1tilde"), "escape/tilde~tilde");

        test.done();
    },

    testJsonFileUnescapePropTricky: function(test) {
        test.expect(1);

        test.ok(JsonFile.unescapeProp("escape~3tilde~4tilde"), "escape~3tilde~4tilde");

        test.done();
    },

    testJsonFileUnescapePropNoChange: function(test) {
        test.expect(1);

        test.ok(JsonFile.unescapeProp("permissions"), "permissions");

        test.done();
    },

    testJsonFileUnescapePropDontEscapeOthers: function(test) {
        test.expect(1);

        test.ok(JsonFile.unescapeProp("permissions% \" ^ | \\"), "permissions% \" ^ | \\");

        test.done();
    },

    testJsonFileEscapeRef: function(test) {
        test.expect(1);

        test.ok(JsonFile.escapeRef("escape/tilde~tilde"), "escape~0tilde~1tilde");

        test.done();
    },

    testJsonFileEscapeRefNoChange: function(test) {
        test.expect(1);

        test.ok(JsonFile.escapeRef("permissions"), "permissions");

        test.done();
    },

    testJsonFileEscapeRefDontEscapeOthers: function(test) {
        test.expect(1);

        test.ok(JsonFile.escapeRef("permissions% \" ^ | \\"), "permissions%25%20%22%20%5E%20%7C%20%5C");

        test.done();
    },

    testJsonFileUnescapeRef: function(test) {
        test.expect(1);

        test.ok(JsonFile.unescapeRef("escape~0tilde~1tilde"), "escape/tilde~tilde");

        test.done();
    },

    testJsonFileUnescapeRefTricky: function(test) {
        test.expect(1);

        test.ok(JsonFile.unescapeRef("escape~3tilde~4tilde"), "escape~3tilde~4tilde");

        test.done();
    },

    testJsonFileUnescapeRefNoChange: function(test) {
        test.expect(1);

        test.ok(JsonFile.unescapeRef("permissions"), "permissions");

        test.done();
    },

    testJsonFileUnescapeRefDontEscapeOthers: function(test) {
        test.expect(1);

        test.ok(JsonFile.unescapeRef("permissions%25%20%22%20%5E%20%7C%20%5C"), "permissions% \" ^ | \\");

        test.done();
    },

    testJsonFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var set = jf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("foo", "en-US", "string 1", "json"));
        test.ok(r);

        test.equal(r.getSource(), "this is string one");
        test.equal(r.getKey(), "string 1");

        test.done();
    },

    testJsonFileParseSimpleRightStrings: function(test) {
        test.expect(8);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var set = jf.getTranslationSet();
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

    testJsonFileParseSimpleDontExtractEmpty: function(test) {
        test.expect(6);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": ""\n' +
           '}\n');

        var set = jf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getSource(), "this is string one");
        test.equal(resources[0].getKey(), "string 1");

        test.done();
    },

    testJsonFileParseEscapeStringKeys: function(test) {
        test.expect(8);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse(
           '{\n' +
           '    "/user": "this is string one",\n' +
           '    "~tilde": "this is string two"\n' +
           '}\n');

        var set = jf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.equal(resources.length, 2);

        test.equal(resources[0].getSource(), "this is string one");
        test.equal(resources[0].getKey(), "/user");

        test.equal(resources[1].getSource(), "this is string two");
        test.equal(resources[1].getKey(), "~tilde");

        test.done();
    },

    testJsonFileParseSimpleRejectThingsThatAreNotInTheSchema: function(test) {
        test.expect(6);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": {\n' +
           '        "asdf": "asdf"\n' +
           '    }\n' +
           '}\n');

        var set = jf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getSource(), "this is string one");
        test.equal(resources[0].getKey(), "string 1");

        test.done();
    },

    testJsonFileParseComplexRightSize: function(test) {
        test.expect(3);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/messages.json",
            type: t
        });
        test.ok(jf);

        jf.parse(
           '{\n' +
           '   "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "singular",\n' +
           '            "many": "many",\n' +
           '            "other": "plural"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "b",\n' +
           '        "c": "d"\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "string 1",\n' +
           '            "string 2",\n' +
           '            "string 3"\n' +
           '        ]\n' +
           '    }\n' +
           '}\n');

        var set = jf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 4);
        test.done();
    },

    testJsonFileParseComplexRightStrings: function(test) {
        test.expect(26);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/messages.json",
            type: t
        });
        test.ok(jf);

        jf.parse(
           '{\n' +
           '   "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "singular",\n' +
           '            "many": "many",\n' +
           '            "other": "plural"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "b",\n' +
           '        "c": "d"\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "string 1",\n' +
           '            "string 2",\n' +
           '            "string 3"\n' +
           '        ]\n' +
           '    }\n' +
           '}\n');

        var set = jf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 4);
        var resources = set.getAll();
        test.equal(resources.length, 4);

        test.equal(resources[0].getType(), "plural");
        test.equal(resources[0].getKey(), "plurals/bar");
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
        test.equal(resources[1].getKey(), "strings/a");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getSource(), "d");
        test.equal(resources[2].getKey(), "strings/c");

        test.equal(resources[3].getType(), "array");
        test.equal(resources[3].getKey(), "arrays/asdf");
        var arrayStrings = resources[3].getSourceArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings.length, 3);
        test.equal(arrayStrings[0], "string 1");
        test.equal(arrayStrings[1], "string 2");
        test.equal(arrayStrings[2], "string 3");

        test.done();
    },

    testJsonFileParseDeepRightSize: function(test) {
        test.expect(3);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/deep.json",
            type: t
        });
        test.ok(jf);

        jf.parse(
           '{\n' +
           '    "x": {\n' +
           '        "y": {\n' +
           '            "plurals": {\n' +
           '                "bar": {\n' +
           '                    "one": "singular",\n' +
           '                    "many": "many",\n' +
           '                    "other": "plural"\n' +
           '                 }\n' +
           '            }\n' +
           '        }\n' +
           '    },\n' +
           '    "a": {\n' +
           '        "b": {\n' +
           '            "strings": {\n' +
           '                "a": "b",\n' +
           '                "c": "d"\n' +
           '            }\n' +
           '        }\n' +
           '    }\n' +
           '}\n');

        var set = jf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        test.done();
    },

    testJsonFileParseDeepRightStrings: function(test) {
        test.expect(19);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/deep.json",
            type: t
        });
        test.ok(jf);

        jf.parse(
           '{\n' +
           '    "x": {\n' +
           '        "y": {\n' +
           '            "plurals": {\n' +
           '                "bar": {\n' +
           '                    "one": "singular",\n' +
           '                    "many": "many",\n' +
           '                    "other": "plural"\n' +
           '                 }\n' +
           '            }\n' +
           '        }\n' +
           '    },\n' +
           '    "a": {\n' +
           '        "b": {\n' +
           '            "strings": {\n' +
           '                "a": "b",\n' +
           '                "c": "d"\n' +
           '            }\n' +
           '        }\n' +
           '    }\n' +
           '}\n');

        var set = jf.getTranslationSet();
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

    testJsonFileParseTestInvalidJson: function(test) {
        test.expect(2);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/deep.json",
            type: t
        });
        test.ok(jf);

        test.throws(function(test) {
            jf.parse(
               '{\n' +
               '    "x": {\n' +
               '        "y": {,@#\n' +
               '            "plurals": {\n' +
               '                "bar": {\n' +
               '                    "one": "singular",\n' +
               '                    "many": "many",\n' +
               '                    "other": "plural"\n' +
               '                 }\n' +
               '            }\n' +
               '        }\n' +
               '    },\n' +
               '    "a": {\n' +
               '        "b": {\n' +
               '            "strings": {\n' +
               '                "a": "b",\n' +
               '                "c": "d"\n' +
               '            }\n' +
               '        }\n' +
               '    }\n' +
               '}\n');
        });

        test.done();
    },

    testJsonFileParseRefsRightSize: function(test) {
        test.expect(3);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/refs.json",
            type: t
        });
        test.ok(jf);

        jf.parse(
           '{\n' +
           '    "owner": {\n' +
           '        "name": "Foo Bar",\n' +
           '        "phone": {\n' +
           '            "number": "1-555-555-1212",\n' +
           '            "type": "Mobile"\n' +
           '        }\n' +
           '    },\n' +
           '    "customer1": {\n' +
           '        "name": "Customer One",\n' +
           '        "phone": {\n' +
           '            "number": "1-555-555-1212",\n' +
           '            "type": "Home"\n' +
           '        }\n' +
           '    },\n' +
           '    "customer2": {\n' +
           '        "name": "Customer Two",\n' +
           '        "phone": {\n' +
           '            "number": "1-555-555-1212",\n' +
           '            "type": "Work"\n' +
           '        }\n' +
           '    }\n' +
           '}\n');

        var set = jf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 3);
        test.done();
    },

    testJsonFileParseRefsRightStrings: function(test) {
        test.expect(13);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/refs.json",
            type: t
        });
        test.ok(jf);

        jf.parse(
           '{\n' +
           '    "owner": {\n' +
           '        "name": "Foo Bar",\n' +
           '        "phone": {\n' +
           '            "number": "1-555-555-1212",\n' +
           '            "type": "Mobile"\n' +
           '        }\n' +
           '    },\n' +
           '    "customer1": {\n' +
           '        "name": "Customer One",\n' +
           '        "phone": {\n' +
           '            "number": "1-555-555-1212",\n' +
           '            "type": "Home"\n' +
           '        }\n' +
           '    },\n' +
           '    "customer2": {\n' +
           '        "name": "Customer Two",\n' +
           '        "phone": {\n' +
           '            "number": "1-555-555-1212",\n' +
           '            "type": "Work"\n' +
           '        }\n' +
           '    }\n' +
           '}\n');

        var set = jf.getTranslationSet();
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
/*
    can't do comments yet

    testJsonFileParseExtractComments: function(test) {
        test.expect(8);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse(
           '{\n' +
           '    // comment for string 1\,' +
           '    "string 1": "this is string one",\n' +
           '    // comment for string 2\,' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var set = jf.getTranslationSet();
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

*/

    testJsonFileExtractFile: function(test) {
        test.expect(28);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/messages.json",
            type: t
        });
        test.ok(jf);

        // should read the file
        jf.extract();

        var set = jf.getTranslationSet();

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

    testJsonFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        // should attempt to read the file and not fail
        jf.extract();

        var set = jf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testJsonFileExtractBogusFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/bogus.json",
            type: t
        });
        test.ok(jf);

        // should attempt to read the file and not fail
        jf.extract();

        var set = jf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testJsonFileLocalizeTextSimple: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse(
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
            datatype: "json"
        }));

        var actual = jf.localizeText(translations, "fr-FR");
        var expected =
           '{\n' +
           '    "string 1": "C\'est la chaîne numéro 1",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testJsonFileLocalizeTextWithSchema: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/messages.json",
            type: t
        });
        test.ok(jf);

        jf.parse(
           '{\n' +
           '   "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "singular",\n' +
           '            "many": "many",\n' +
           '            "other": "plural"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "b",\n' +
           '        "c": "d"\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "string 1",\n' +
           '            "string 2",\n' +
           '            "string 3"\n' +
           '        ]\n' +
           '    }\n' +
           '}\n');

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
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/c",
            source: "d",
            sourceLocale: "en-US",
            target: "la d",
            targetLocale: "fr-FR",
            datatype: "json"
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
            datatype: "json"
        }));

        var actual = jf.localizeText(translations, "fr-FR");
        var expected =
           '{\n' +
           '    "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "singulaire",\n' +
           '            "many": "plupart",\n' +
           '            "other": "autres"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "la b",\n' +
           '        "c": "la d"\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "chaîne 1",\n' +
           '            "chaîne 2",\n' +
           '            "chaîne 3"\n' +
           '        ]\n' +
           '    }\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

/*
    testJsonFileLocalizeTextPreserveWhitespace: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '<body>\n' +
                '     This is a test    \n' +
                '</body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
            '<json>\n' +
            '<body>\n' +
            '     Ceci est un essai    \n' +
            '</body>\n' +
            '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextPreserveSelfClosingTags: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '<body>\n' +
                '     <div class="foo"/>\n' +
                '     This is a test    \n' +
                '</body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
            '<json>\n' +
            '<body>\n' +
            '     <div class="foo"/>\n' +
            '     Ceci est un essai    \n' +
            '</body>\n' +
            '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextMultiple: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       This is a test\n' +
                '       <div id="foo">\n' +
                '           This is also a test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
                '<json>\n' +
                '   <body>\n' +
                '       Ceci est un essai\n' +
                '       <div id="foo">\n' +
                '           Ceci est aussi un essai\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextWithDups: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       This is a test\n' +
                '       <div id="foo">\n' +
                '           This is also a test\n' +
                '       </div>\n' +
                '       This is a test\n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
                '<json>\n' +
                '   <body>\n' +
                '       Ceci est un essai\n' +
                '       <div id="foo">\n' +
                '           Ceci est aussi un essai\n' +
                '       </div>\n' +
                '       Ceci est un essai\n' +
                '   </body>\n' +
                '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextWithDoctypeTag: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse(
            '<!DOCTYPE json PUBLIC "-//W3C//DTD XJson 1.0 Strict//EN" "http://www.w3.org/TR/xjson1/DTD/xjson1-strict.dtd">\n' +
            '<json>\n' +
            '   <body>\n' +
            '       This is a test\n' +
            '       <div id="foo">\n' +
            '           This is also a test\n' +
            '       </div>\n' +
            '   </body>\n' +
            '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
            '<!DOCTYPE json PUBLIC "-//W3C//DTD XJson 1.0 Strict//EN" "http://www.w3.org/TR/xjson1/DTD/xjson1-strict.dtd">\n' +
            '<json>\n' +
            '   <body>\n' +
            '       Ceci est un essai\n' +
            '       <div id="foo">\n' +
            '           Ceci est aussi un essai\n' +
            '       </div>\n' +
            '   </body>\n' +
            '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextSkipScript: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <head>\n' +
                '   <script>\n' +
                '// comment text\n' +
                'if (locales.contains[thisLocale]) {\n' +
                '    document.write("<input id=\"locale\" class=\"foo\" title=\"bar\"></input>");\n' +
                '}\n' +
                '   </head>\n' +
                '   </script>\n' +
                '   <body>\n' +
                '       This is a test\n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
            '<json>\n' +
            '   <head>\n' +
            '   <script>\n' +
            '// comment text\n' +
            'if (locales.contains[thisLocale]) {\n' +
            '    document.write("<input id=\"locale\" class=\"foo\" title=\"bar\"></input>");\n' +
            '}\n' +
            '   </head>\n' +
            '   </script>\n' +
            '   <body>\n' +
            '       Ceci est un essai\n' +
            '   </body>\n' +
            '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextNonBreakingTags: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       This is a <em>test</em> of the emergency parsing system.  \n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
            '<json>\n' +
            '   <body>\n' +
            '       Ceci est un <em>essai</em> du système d\'analyse syntaxique de l\'urgence.  \n' +
            '   </body>\n' +
            '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextNonBreakingTagsOutside: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       <span id="foo" class="bar">  This is a test of the emergency parsing system.  </span>\n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r699762575",
            source: "This is a test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
            '<json>\n' +
            '   <body>\n' +
            '       <span id="foo" class="bar">  Ceci est un essai du système d\'analyse syntaxique de l\'urgence.  </span>\n' +
            '   </body>\n' +
            '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextNonBreakingTagsInside: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.\n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r124733470',
            source: 'This is <c0> a test of the emergency parsing </c0> system.',
            target: 'Ceci est <c0> un essai du système d\'analyse syntaxique de l\'urgence.</c0>',
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
            '<json>\n' +
            '   <body>\n' +
            '       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de l\'urgence.</span>\n' +
            '   </body>\n' +
            '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextNonBreakingTagsInsideMultiple: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.\n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r772812508',
            source: 'This is <c0> a test of the <c1>emergency</c1> parsing </c0> system.',
            target: 'Ceci est <c0> un essai du système d\'analyse syntaxique de <c1>l\'urgence</c1>.</c0>',
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
            '<json>\n' +
            '   <body>\n' +
            '       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence</em>.</span>\n' +
            '   </body>\n' +
            '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextNonBreakingTagsNotWellFormed: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.\n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r417724998',
            source: 'This is <c0> a test of the <c1>emergency parsing </c1></c0> system.',
            target: 'Ceci est <c0> un essai du système d\'analyse syntaxique de <c1>l\'urgence.</c1></c0>',
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
                '<json>\n' +
                '   <body>\n' +
                '       Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence.</em></span>\n' +
                '   </body>\n' +
                '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextNonBreakingTagsNotWellFormedWithTerminatorTag: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       <div>This is <span id="foo" class="bar"> a test of the <em>emergency parsing </div> system.\n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r215850552',
            source: 'This is <c0> a test of the <c1>emergency parsing </c1></c0>',
            target: 'Ceci est <c0> un essai du système <c1>d\'analyse syntaxique </c1></c0>',
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
                '<json>\n' +
                '   <body>\n' +
                '       <div>Ceci est <span id="foo" class="bar"> un essai du système <em>d\'analyse syntaxique </em></span></div> system.\n' +
                '   </body>\n' +
                '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextLocalizableTitle: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       <div title="This value is localizable">\n' +
                '           This is a test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r922503175',
            source: 'This value is localizable',
            target: 'Cette valeur est localisable',
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r654479252',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
                '<json>\n' +
                '   <body>\n' +
                '       <div title="Cette valeur est localisable">\n' +
                '           Ceci est un essai\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextLocalizableAttributes: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       <img src="http://www.test.test/foo.png" alt="Alternate text">\n' +
                '       This is a test\n' +
                '       <input type="text" placeholder="localizable placeholder here">\n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1051764073',
            source: 'Alternate text',
            target: 'Texte alternative',
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r654479252',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r734414247',
            source: 'localizable placeholder here',
            target: 'espace réservé localisable ici',
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
                '<json>\n' +
                '   <body>\n' +
                '       <img src="http://www.test.test/foo.png" alt="Texte alternative">\n' +
                '       Ceci est un essai\n' +
                '       <input type="text" placeholder="espace réservé localisable ici">\n' +
                '   </body>\n' +
                '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextLocalizableAttributesAndNonBreakingTags: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       This is <a href="foo.json" title="localizable title">a test</a> of non-breaking tags.\n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1063253939',
            source: 'This is <c0>a test</c0> of non-breaking tags.',
            target: 'Ceci est <c0>un essai</c0> des balises non-ruptures.',
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r160369622',
            source: 'localizable title',
            target: 'titre localisable',
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
                '<json>\n' +
                '   <body>\n' +
                '       Ceci est <a href="foo.json" title="titre localisable">un essai</a> des balises non-ruptures.\n' +
                '   </body>\n' +
                '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextI18NComments: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       <!-- i18n: this describes the text below -->\n' +
                '       This is a test of the emergency parsing system.  \n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r699762575',
            source: 'This is a test of the emergency parsing system.',
            target: 'Ceci est un essai du système d\'analyse syntaxique de l\'urgence.',
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        test.equal(jf.localizeText(translations, "fr-FR"),
                '<json>\n' +
                '   <body>\n' +
                '       \n' +
                '       Ceci est un essai du système d\'analyse syntaxique de l\'urgence.  \n' +
                '   </body>\n' +
                '</json>\n');

        test.done();
    },

    testJsonFileLocalizeTextIdentifyResourceIds: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p2,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       This is a test\n' +
                '       <div id="foo">\n' +
                '           This is also a test\n' +
                '       </div>\n' +
                '       This is a test\n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        var expected =
            '<json>\n' +
            '   <body>\n' +
            '       <span loclang="json" x-locid="r654479252">Ceci est un essai</span>\n' +
            '       <div id="foo">\n' +
            '           <span loclang="json" x-locid="r999080996">Ceci est aussi un essai</span>\n' +
            '       </div>\n' +
            '       <span loclang="json" x-locid="r654479252">Ceci est un essai</span>\n' +
            '   </body>\n' +
            '</json>\n';
           var actual = jf.localizeText(translations, "fr-FR");

           diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testJsonFileLocalizeTextIdentifyResourceIdsWithAttributes: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p2,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       <area alt="placeholder text">This is a test</area>\n' +
                '       <div id="foo">\n' +
                '           This is also a test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r561033628",
            source: "placeholder text",
            sourceLocale: "en-US",
            target: "Texte de l'espace réservé",
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r654479252',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        var expected =
            '<json>\n' +
            '   <body>\n' +
            '       <area alt="&lt;span loclang=&quot;json&quot; x-locid=&quot;r561033628&quot;&gt;Texte de l&apos;espace réservé&lt;/span&gt;"><span loclang="json" x-locid="r654479252">Ceci est un essai</span></area>\n' +
            '       <div id="foo">\n' +
            '           <span loclang="json" x-locid="r999080996">Ceci est aussi un essai</span>\n' +
            '       </div>\n' +
            '   </body>\n' +
            '</json>\n';
           var actual = jf.localizeText(translations, "fr-FR");

           diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testJsonFileLocalizeTextIdentifyResourceIdsWithEmbeddedAttributes: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p2,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       This <span title="placeholder text">is a test</span>\n' +
                '       <div id="foo">\n' +
                '           This is also a test\n' +
                '       </div>\n' +
                '   </body>\n' +
                '</json>\n');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r561033628",
            source: "placeholder text",
            sourceLocale: "en-US",
            target: "Texte de l'espace réservé",
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r325440473',
            source: 'This <c0>is a test</c0>',
            sourceLocale: "en-US",
            target: 'Ceci <c0>est un essai</c0>',
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        var expected =
            '<json>\n' +
            '   <body>\n' +
            '       <span loclang="json" x-locid="r325440473">Ceci <span title="Texte de l&apos;espace réservé">est un essai</span></span>\n' +
            '       <div id="foo">\n' +
            '           <span loclang="json" x-locid="r999080996">Ceci est aussi un essai</span>\n' +
            '       </div>\n' +
            '   </body>\n' +
            '</json>\n';
           var actual = jf.localizeText(translations, "fr-FR");

           diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testJsonFileGetLocalizedPathSimple: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            pathName: "simple.json",
            type: t
        });
        test.ok(jf);

        test.equal(jf.getLocalizedPath("fr-FR"), "simple.fr-FR.json");

        test.done();
    },

    testJsonFileGetLocalizedPathComplex: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            pathName: "./asdf/bar/simple.json",
            type: t
        });
        test.ok(jf);

        test.equal(jf.getLocalizedPath("fr-FR"), "asdf/bar/simple.fr-FR.json");

        test.done();
    },

    testJsonFileGetLocalizedPathRegularJsonFileName: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            pathName: "./asdf/bar/simple.json",
            type: t
        });
        test.ok(jf);

        test.equal(jf.getLocalizedPath("fr-FR"), "asdf/bar/simple.fr-FR.json");

        test.done();
    },

    testJsonFileGetLocalizedPathNotEnoughParts: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            pathName: "./asdf/bar/simple",
            type: t
        });
        test.ok(jf);

        test.equal(jf.getLocalizedPath("fr-FR"), "asdf/bar/simple.fr-FR");

        test.done();
    },

    testJsonFileGetLocalizedSourceLocale: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            pathName: "./asdf/bar/simple.en-US.json",
            type: t
        });
        test.ok(jf);

        test.equal(jf.getLocalizedPath("fr-FR"), "asdf/bar/simple.fr-FR.json");

        test.done();
    },

    testJsonFileLocalize: function(test) {
        test.expect(7);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/testfiles/json/CookieFlow.fr-FR.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/testfiles/json/CookieFlow.fr-FR.json"));
        }
        if (fs.existsSync(path.join(base, "testfiles/testfiles/json/CookieFlow.de-DE.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/testfiles/json/CookieFlow.de-DE.json"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/testfiles/json/CookieFlow.fr-FR.json")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/testfiles/json/CookieFlow.de-DE.json")));

        var jf = new JsonFile({
            project: p,
            pathName: "./json/CookieFlow.json",
            type: t
        });
        test.ok(jf);

        // should read the file
        jf.extract();

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r308704783',
            source: 'Get insurance quotes for free!',
            target: 'Obtenez des devis d\'assurance gratuitement!',
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r400586044',
            source: 'Talk',
            target: 'Consultee',
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r30868880',
            source: 'Ask',
            target: 'Poser un question',
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r458583963',
            source: 'Send question',
            target: 'Envoyer la question',
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        translations.add(new ResourceString({
            project: "foo",
            key: 'r308704783',
            source: 'Get insurance quotes for free!',
            target: 'Kostenlosen Versicherungs-Angebote erhalten!',
            targetLocale: "de-DE",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r400586044',
            source: 'Talk',
            target: 'Beratung',
            targetLocale: "de-DE",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r30868880',
            source: 'Ask',
            target: 'Eine Frage stellen',
            targetLocale: "de-DE",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r458583963',
            source: 'Send question',
            target: 'Frage abschicken',
            targetLocale: "de-DE",
            datatype: "json"
        }));

        jf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/testfiles/json/CookieFlow.fr-FR.json")));
        test.ok(fs.existsSync(path.join(base, "testfiles/testfiles/json/CookieFlow.de-DE.json")));

        var content = fs.readFileSync(path.join(base, "testfiles/testfiles/json/CookieFlow.fr-FR.json"), "utf-8");

        var expected =
            '<div class="upsell-ad-item clearfix">  \n' +
            '    <div class="modal_x"></div>\n' +
            '    <div class="upsell-ad-content">\n' +
            '      <div class="upsell-ad-header">\n' +
            '        <div class="big cookie-flow"></div>\n' +
            '        <span class="upsell-header-bold"></span>\n' +
            '        Obtenez des devis d\'assurance gratuitement!\n' +
            '      </div>\n' +
            '      <div class="upsell-ad-wrapper" style="padding-left: 0">\n' +
            '        <a class="specialist-avatar" href="/specialists/234" style="background-image: url(http://foo.com/bar.png);"></a>\n' +
            '        <input class="askInputArea-cookie desktop" maxlength="150">\n' +
            '        <span class="askSendArea-cookie">\n' +
            '          <a class="askSendBtn-cookie" href="/message?from_seo=1">\n' +
            '            <div class="desktop-btn">Envoyer la question</div>\n' +
            '            <div class="mobile-btn">Poser un question</div>\n' +
            '          </a>\n' +
            '        </span>\n' +
            '      </div>\n' +
            '    </div>\n' +
            '</div>';

        diff(content, expected);
        test.equal(content, expected);

        content = fs.readFileSync(path.join(base, "testfiles/testfiles/json/CookieFlow.de-DE.json"), "utf-8");

        test.equal(content,
            '<div class="upsell-ad-item clearfix">  \n' +
            '    <div class="modal_x"></div>\n' +
            '    <div class="upsell-ad-content">\n' +
            '      <div class="upsell-ad-header">\n' +
            '        <div class="big cookie-flow"></div>\n' +
            '        <span class="upsell-header-bold"></span>\n' +
            '        Kostenlosen Versicherungs-Angebote erhalten!\n' +
            '      </div>\n' +
            '      <div class="upsell-ad-wrapper" style="padding-left: 0">\n' +
            '        <a class="specialist-avatar" href="/specialists/234" style="background-image: url(http://foo.com/bar.png);"></a>\n' +
            '        <input class="askInputArea-cookie desktop" maxlength="150">\n' +
            '        <span class="askSendArea-cookie">\n' +
            '          <a class="askSendBtn-cookie" href="/message?from_seo=1">\n' +
            '            <div class="desktop-btn">Frage abschicken</div>\n' +
            '            <div class="mobile-btn">Eine Frage stellen</div>\n' +
            '          </a>\n' +
            '        </span>\n' +
            '      </div>\n' +
            '    </div>\n' +
            '</div>'
        );

        test.done();
    },

    testJsonFileLocalizeNoStrings: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/testfiles/json/nostrings.fr-FR.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/testfiles/json/nostrings.fr-FR.json"));
        }
        if (fs.existsSync(path.join(base, "testfiles/testfiles/json/nostrings.de-DE.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/testfiles/json/nostrings.de-DE.json"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/testfiles/json/nostrings.fr-FR.json")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/testfiles/json/nostrings.de-DE.json")));

        var jf = new JsonFile({
            project: p,
            pathName: "./json/nostrings.json",
            type: t
        });
        test.ok(jf);

        // should read the file
        jf.extract();

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r308704783',
            source: 'Get insurance quotes for free!',
            target: 'Obtenez des devis d\'assurance gratuitement!',
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r308704783',
            source: 'Get insurance quotes for free!',
            target: 'Kostenlosen Versicherungs-Angebote erhalten!',
            targetLocale: "de-DE",
            datatype: "json"
        }));

        jf.localize(translations, ["fr-FR", "de-DE"]);

        // should produce the files, even if there is nothing to localize in them
        test.ok(fs.existsSync(path.join(base, "testfiles/testfiles/json/nostrings.fr-FR.json")));
        test.ok(fs.existsSync(path.join(base, "testfiles/testfiles/json/nostrings.de-DE.json")));

        test.done();
    },

    testJsonFileLocalizeTextNonTemplateTagsInsideTags: function(test) {
        test.expect(6);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json>\n' +
                '   <body>\n' +
                '       <span class="foo" <span class="bar"> Mr. Smith is not available.</span></span>\n' +
                '   </body>\n' +
                '</json>\n');

        var set = jf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource('Mr. Smith is not available.');
        test.ok(r);
        test.equal(r.getSource(), 'Mr. Smith is not available.');
        test.equal(r.getKey(), 'r41505278');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r41505278',
            source: 'Mr. Smith is not available.',
            target: 'Mssr. Smith n\'est pas disponible.',
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        var actual = jf.localizeText(translations, "fr-FR");
        var expected =
                '<json>\n' +
                '   <body>\n' +
                '       <span class="foo" span="" class="bar"> Mssr. Smith n\'est pas disponible.</span></span>\n' +
                '   </body>\n' +
                '</json>\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testJsonFileLocalizeTextEscapeDoubleQuotes: function(test) {
        test.expect(3);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('  <span class="foo" onclick=\'javascript:var a = "foo", b = "bar";\'>foo</span>');

        var set = jf.getTranslationSet();
        test.ok(set);

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r941132140',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        diff(jf.localizeText(translations, "fr-FR"),
                '  <span class="foo" onclick=\'javascript:var a = &quot;foo&quot;, b = &quot;bar&quot;;\'>asdf</span>');

        test.equal(jf.localizeText(translations, "fr-FR"),
                '  <span class="foo" onclick=\'javascript:var a = &quot;foo&quot;, b = &quot;bar&quot;;\'>asdf</span>');

        test.done();
    },

    testJsonFileLocalizeTextIgnoreScriptTags: function(test) {
        test.expect(3);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json><body><script type="javascript">\n' +
               '  foo\n' +
            '</script>\n' +
            '<span class="foo">foo</span>\n' +
            '<div></div><script>foo</script><div></div>\n' +
            '</body></json>');

        var set = jf.getTranslationSet();
        test.ok(set);

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r941132140',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        var expected =
            '<json><body><script type="javascript">\n' +
            '  foo\n' +
            '</script>\n' +
            '<span class="foo">asdf</span>\n' +
            '<div></div><script>foo</script><div></div>\n' +
            '</body></json>';

        diff(jf.localizeText(translations, "fr-FR"), expected);

        test.equal(jf.localizeText(translations, "fr-FR"), expected);

        test.done();
    },

    testJsonFileLocalizeTextIgnoreStyleTags: function(test) {
        test.expect(3);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse('<json><body><style>\n' +
               '  foo\n' +
            '</style>\n' +
            '<span class="foo">foo</span>\n' +
            '<div></div><style>foo</style><div></div>\n' +
            '</body></json>');

        var set = jf.getTranslationSet();
        test.ok(set);

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r941132140',
            source: 'foo',
            target: 'asdf',
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        var expected =
            '<json><body><style>\n' +
            '  foo\n' +
            '</style>\n' +
            '<span class="foo">asdf</span>\n' +
            '<div></div><style>foo</style><div></div>\n' +
            '</body></json>';

        diff(jf.localizeText(translations, "fr-FR"), expected);

        test.equal(jf.localizeText(translations, "fr-FR"), expected);

        test.done();
    },

    testJsonFileExtractFileFullyExtracted: function(test) {
        test.expect(17);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/meeting_panel.json",
            type: t
        });
        test.ok(jf);

        // should read the file
        jf.extract();

        var set = jf.getTranslationSet();

        test.equal(set.size(), 5);

        var r = set.getBySource("Upcoming Appointments");
        test.ok(r);
        test.equal(r.getSource(), "Upcoming Appointments");
        test.equal(r.getKey(), "r110253465");

        r = set.getBySource("Completed Meetings");
        test.ok(r);
        test.equal(r.getSource(), "Completed Meetings");
        test.equal(r.getKey(), "r163355880");

        r = set.getBySource("Get help");
        test.ok(r);
        test.equal(r.getSource(), "Get help");
        test.equal(r.getKey(), "r1035647778");

        r = set.getBySource("Colleagues are standing by to help");
        test.ok(r);
        test.equal(r.getSource(), "Colleagues are standing by to help");
        test.equal(r.getKey(), "r688256348");

        r = set.getBySource("Ask your co-workers now");
        test.ok(r);
        test.equal(r.getSource(), "Ask your co-workers now");
        test.equal(r.getKey(), "r575590209");

        test.done();
    },

    testJsonFileExtractFileFullyExtracted2: function(test) {
        test.expect(11);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/mode.json",
            type: t
        });
        test.ok(jf);

        // should read the file
        jf.extract();

        var set = jf.getTranslationSet();

        test.equal(set.size(), 3);

        var r = set.getBySource("Choose a meeting method");
        test.ok(r);
        test.equal(r.getSource(), "Choose a meeting method");
        test.equal(r.getKey(), "r950833718");

        r = set.getBySource("Test phrase");
        test.ok(r);
        test.equal(r.getSource(), "Test phrase");
        test.equal(r.getKey(), "r103886803");

        r = set.getBySource("In Person Mode");
        test.ok(r);
        test.equal(r.getSource(), "In Person Mode");
        test.equal(r.getKey(), "r251839517");

        test.done();
    },

    testJsonFileExtractFileNewResources: function(test) {
        test.expect(16);

        var base = path.dirname(module.id);

        var p3 = new CustomProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US"
        }, "./test/testfiles", {
            locales:["en-GB"],
            targetDir: "testfiles"
        });

        var t2 = new JsonFileType(p3);
        var jf = new JsonFile({
            project: p3,
            pathName: "./json/mode.json",
            type: t2
        });
        test.ok(jf);

        jf.extract();

        var translations = new TranslationSet();

        translations.add(new ResourceString({
            project: "foo",
            key: "r950833718",
            source: "Choose a meeting method",
            sourceLocale: "en-US",
            target: "Choisissez une méthode de réunion d'affaires",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        var actual = jf.localizeText(translations, "fr-FR");
        var expected =
            '<div class="askHeader">\n' +
            '  <h3>Choisissez une méthode de réunion d\'affaires</h3>\n' +
            '</div>\n' +
            '<div id="chooseMode">\n' +
            '  <div class="askContent">\n' +
            '    <div class="specialistInfo">\n' +
            '      <div class="portraitContainer">\n' +
            '        <div class="portrait">\n' +
            '          <img src="http://foo.com/photo.png" height="86px" width="86px"/>\n' +
            '        </div>\n' +
            '        <div class="dot on"></div>\n' +
            '      </div>\n' +
            '      <div class="rating">\n' +
            '      </div>\n' +
            '      <div class="name"></div>\n' +
            '      <div class="specialty"></div>\n' +
            '      Ťëšţ þĥŕàšë543210\n' +
            '    </div>\n' +
            '    <div class="modeSelection">\n' +
            '      <div class="modeContents">\n' +
            '        <h4>Ïñ Pëŕšõñ Mõðë6543210</h4>\n' +
            '        <p class="description"></p>\n' +
            '      </div>\n' +
            '    </div><div class="divider"></div>\n' +
            '  </div>\n' +
            '</div>\n';

        diff(actual, expected);
        test.equal(actual, expected);

        var set = t2.newres;
        var resources = set.getAll();

        test.equal(resources.length, 2);

        var r = set.getBySource("Choose a meeting method");
        test.ok(!r);

        r = set.getBySource("Test phrase");
        test.ok(r);
        test.equal(resources[0].getKey(), "r103886803");
        test.equal(resources[0].getSource(), "Test phrase");
        test.equal(resources[0].getSourceLocale(), "en-US");
        test.equal(resources[0].getTarget(), "Test phrase");
        test.equal(resources[0].getTargetLocale(), "fr-FR");

        r = set.getBySource("In Person Mode");
        test.ok(r);
        test.equal(resources[1].getKey(), "r251839517");
        test.equal(resources[1].getSource(), "In Person Mode");
        test.equal(resources[1].getSourceLocale(), "en-US");
        test.equal(resources[1].getTarget(), "In Person Mode");
        test.equal(resources[1].getTargetLocale(), "fr-FR");

        test.done();
    }
    */
};
