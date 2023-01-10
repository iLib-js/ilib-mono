/*
 * testJsonFile.js - test the json file handler object.
 *
 * Copyright © 2021-2022, Box, Inc.
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
    targetDir: ".",
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
            "**/sparse.json": {
                "schema": "strings-schema",
                "method": "sparse",
                "template": "resources/[localeDir]/sparse.json"
            },
            "**/sparse2.json": {
                "schema": "http://github.com/ilib-js/messages.json",
                "method": "sparse",
                "template": "resources/[localeDir]/sparse2.json"
            },
            "**/spread.json": {
                "schema": "strings-schema",
                "method": "spread",
                "template": "resources/[localeDir]/spread.json"
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
            },
            "**/str.json": {},
            "**/arrays.json": {
                "schema": "http://github.com/ilib-js/arrays.json",
                "method": "copy",
                "template": "resources/[localeDir]/arrays.json"
            },
            "**/array-refs.json": {
                "schema": "http://github.com/ilib-js/array-refs.json",
                "method": "copy",
                "template": "resources/[localeDir]/array-refs.json"
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
    targetDir: "testfiles",
    nopseudo: false,
    json: {
        schemas: [
            "./test/testfiles/schemas"
        ],
        mappings: {
            "**/messages.json": {
                "schema": "http://github.com/ilib-js/messages.json",
                "method": "copy",
                "template": "resources/[localeDir]/messages.json"
            }
        }
    }
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

    testJsonFileParseComplexRightStringsTranslated: function(test) {
        test.expect(38);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "resources/de/DE/messages.json",
            type: t
        });
        test.ok(jf);

        jf.parse(
           '{\n' +
           '   "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "eins",\n' +
           '            "many": "vielen",\n' +
           '            "other": "mehrere"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "b",\n' +
           '        "c": "d"\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "Zeichenfolge 1",\n' +
           '            "Zeichenfolge 2",\n' +
           '            "Zeichenfolge 3"\n' +
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
        test.equal(resources[0].getSourceLocale(), "en-US");
        test.equal(resources[0].getTargetLocale(), "de-DE");
        test.deepEqual(resources[0].getSourcePlurals(), {});
        var pluralStrings = resources[0].getTargetPlurals();
        test.ok(pluralStrings);
        test.equal(pluralStrings.one, "eins");
        test.equal(pluralStrings.many, "vielen");
        test.equal(pluralStrings.other, "mehrere");
        test.ok(!pluralStrings.zero);
        test.ok(!pluralStrings.two);
        test.ok(!pluralStrings.few);

        test.equal(resources[1].getType(), "string");
        test.equal(resources[1].getSourceLocale(), "en-US");
        test.equal(resources[1].getTargetLocale(), "de-DE");
        test.ok(!resources[1].getSource());
        test.equal(resources[1].getTarget(), "b");
        test.equal(resources[1].getKey(), "strings/a");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getSourceLocale(), "en-US");
        test.equal(resources[2].getTargetLocale(), "de-DE");
        test.ok(!resources[2].getSource());
        test.equal(resources[2].getTarget(), "d");
        test.equal(resources[2].getKey(), "strings/c");

        test.equal(resources[3].getType(), "array");
        test.equal(resources[3].getSourceLocale(), "en-US");
        test.equal(resources[3].getTargetLocale(), "de-DE");
        test.equal(resources[3].getKey(), "arrays/asdf");
        test.deepEqual(!resources[3].getSourceArray(), []);
        var arrayStrings = resources[3].getTargetArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings.length, 3);
        test.equal(arrayStrings[0], "Zeichenfolge 1");
        test.equal(arrayStrings[1], "Zeichenfolge 2");
        test.equal(arrayStrings[2], "Zeichenfolge 3");

        test.done();
    },

    testJsonFileParseArrayOfStrings: function(test) {
        test.expect(11);

        // when it's named arrays.json, it should apply the arrays schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        test.ok(jf);

        jf.parse('{\n' +
                '  "strings": [\n' +
                '    "string 1",\n' +
                '    "string 2",\n' +
                '    "string 3"\n' +
                '  ]\n' +
                '}\n');

        var set = jf.getTranslationSet();
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

    testJsonFileParseArrayOfNumbers: function(test) {
        test.expect(12);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        test.ok(jf);

        jf.parse('{\n' +
                '  "numbers": [\n' +
                '    15,\n' +
                '    -3,\n' +
                '    1.18,\n' +
                '    0\n' +
                '  ]\n' +
                '}\n');

        var set = jf.getTranslationSet();
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

    testJsonFileParseArrayOfBooleans: function(test) {
        test.expect(10);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        test.ok(jf);

        jf.parse('{\n' +
                '  "booleans": [\n' +
                '    true,\n' +
                '    false\n' +
                '  ]\n' +
                '}\n');

        var set = jf.getTranslationSet();
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

    testJsonFileParseArrayOfObjects: function(test) {
        test.expect(13);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        test.ok(jf);

        jf.parse('{\n' +
                '  "objects": [\n' +
                '    {\n' +
                '      "name": "First Object",\n' +
                '      "randomProp": "Non-translatable"\n' +
                '    },\n' +
                '    {\n' +
                '      "name": "Second Object",\n' +
                '      "description": "String property"\n' +
                '    }\n' +
                '  ]\n' +
                '}\n');

        var set = jf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 3);

        var resources = set.getAll();
        test.equal(resources.length, 3);
        test.equal(resources[0].getType(), 'string');
        test.equal(resources[0].getKey(), 'objects/item_0/name');
        test.equal(resources[0].getSource(), 'First Object');

        test.equal(resources[1].getType(), 'string');
        test.equal(resources[1].getKey(), 'objects/item_1/name');
        test.equal(resources[1].getSource(), 'Second Object');

        test.equal(resources[2].getType(), 'string');
        test.equal(resources[2].getKey(), 'objects/item_1/description');
        test.equal(resources[2].getSource(), 'String property');

        test.done();
    },

    testJsonFileParseArrayWithRef: function(test) {
        test.expect(10);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/array-refs.json",
            type: t
        });
        test.ok(jf);

        jf.parse('{\n' +
                '  "itemsArray": [\n' +
                '    {\n' +
                '      "itemField": "First item",\n' +
                '      "itemFieldIgnore": "Non-translatable"\n' +
                '    },\n' +
                '    {\n' +
                '      "itemField": "Second item",\n' +
                '      "itemFieldIgnore": "Non-translatable"\n' +
                '    }\n' +
                '  ]\n' +
                '}\n');

        var set = jf.getTranslationSet();
        test.ok(set);
        test.equal(set.size(), 2);

        var resources = set.getAll();
        test.equal(resources.length, 2);
        test.equal(resources[0].getType(), 'string');
        test.equal(resources[0].getKey(), 'itemsArray/item_0/itemField');
        test.equal(resources[0].getSource(), 'First item');

        test.equal(resources[1].getType(), 'string');
        test.equal(resources[1].getKey(), 'itemsArray/item_1/itemField');
        test.equal(resources[1].getSource(), 'Second item');

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

    testJsonFileParseDefaultSchema: function(test) {
        test.expect(5);

        var jf = new JsonFile({
            project: p,
            pathName: "a/b/c/str.json",
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
           '    },\n' +
           '    "others": {\n' +
           '        "first": "abc",\n' +
           '        "second": "bcd"\n' +
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
           '    },\n' +
           '    "others": {\n' +
           '        "first": "abc",\n' +
           '        "second": "bcd"\n' +
           '    }\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testJsonFileLocalizeTextMethodSparse: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/sparse.json",
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
           '    "string 1": "C\'est la chaîne numéro 1"\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testJsonFileLocalizeTextWithSchemaSparseComplex: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/sparse2.json",
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
           '        "a": "la b"\n' +
           '    }\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testJsonFileLocalizeArrayOfStrings: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        test.ok(jf);

        jf.parse('{\n' +
                '  "strings": [\n' +
                '    "string 1",\n' +
                '    "string 2",\n' +
                '    "string 3"\n' +
                '  ]\n' +
                '}\n');

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
            datatype: "json"
        }));

        var actual = jf.localizeText(translations, "fr-FR");
        var expected =
                '{\n' +
                '    "strings": [\n' +
                '        "chaîne 1",\n' +
                '        "chaîne 2",\n' +
                '        "chaîne 3"\n' +
                '    ]\n' +
                '}\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testJsonFileLocalizeArrayOfNumbers: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        test.ok(jf);

        jf.parse('{\n' +
                '  "numbers": [\n' +
                '    15,\n' +
                '    -3,\n' +
                '    1.18,\n' +
                '    0\n' +
                '  ]\n' +
                '}\n');

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
            datatype: "json"
        }));

        var actual = jf.localizeText(translations, "fr-FR");
        var expected =
                '{\n' +
                '    "numbers": [\n' +
                '        29,\n' +
                '        12,\n' +
                '        -17.3,\n' +
                '        0\n' +
                '    ]\n' +
                '}\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testJsonFileLocalizeArrayOfBooleans: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        test.ok(jf);

        jf.parse('{\n' +
                '  "booleans": [\n' +
                '    true,\n' +
                '    false\n' +
                '  ]\n' +
                '}\n');

        var translations = new TranslationSet('en-US');
        translations.add(new ResourceArray({
            project: "foo",
            key: "booleans",
            sourceArray: [
                "true",
                "false"
            ],
            sourceLocale: "en-US",
            targetArray: [
                "false",
                "true"
            ],
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        var actual = jf.localizeText(translations, "fr-FR");
        var expected =
                '{\n' +
                '    "booleans": [\n' +
                '        false,\n' +
                '        true\n' +
                '    ]\n' +
                '}\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testJsonFileLocalizeArrayOfObjects: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        test.ok(jf);

        jf.parse('{\n' +
                '  "objects": [\n' +
                '    {\n' +
                '      "name": "First Object",\n' +
                '      "randomProp": "Non-translatable"\n' +
                '    },\n' +
                '    {\n' +
                '      "name": "Second Object",\n' +
                '      "description": "String property"\n' +
                '    }\n' +
                '  ]\n' +
                '}\n');

        var translations = new TranslationSet('en-US');
        translations.add(new ResourceString({
            project: "foo",
            key: "objects/item_0/name",
            source: "First Object",
            sourceLocale: "en-US",
            target: "Premier objet",
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "objects/item_1/name",
            source: "Second Object",
            sourceLocale: "en-US",
            target: "Deuxième objet",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        translations.add(new ResourceString({
            project: "foo",
            key: "objects/item_1/description",
            source: "String Property",
            sourceLocale: "en-US",
            target: "Propriété String",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        var actual = jf.localizeText(translations, "fr-FR");
        var expected =
                '{\n' +
                '    "objects": [\n' +
                '        {\n' +
                '            "name": "Premier objet",\n' +
                '            "randomProp": "Non-translatable"\n' +
                '        },\n' +
                '        {\n' +
                '            "name": "Deuxième objet",\n' +
                '            "description": "Propriété String"\n' +
                '        }\n' +
                '    ]\n' +
                '}\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testJsonFileLocalizeArrayOfObjectsWithBooleansOnly: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        test.ok(jf);

        jf.parse('{\n' +
            '  "objects": [\n' +
            '    {\n' +
            '      "nullable": false\n' +
            '    },\n' +
            '    {\n' +
            '      "nullable": true\n' +
            '    }\n' +
            '  ]\n' +
            '}\n');

        var translations = new TranslationSet('en-US');

        var actual = jf.localizeText(translations, "fr-FR");
        var expected =
            '{\n' +
            '    "objects": [\n' +
            '        {\n' +
            '            "nullable": false\n' +
            '        },\n' +
            '        {\n' +
            '            "nullable": true\n' +
            '        }\n' +
            '    ]\n' +
            '}\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testJsonFileLocalizeTextUsePseudoForMissing: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p2,
            pathName: "./json/messages.json",
            type: t2
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
           '    },\n' +
           '    "others": {\n' +
           '        "first": "abc",\n' +
           '        "second": "bcd"\n' +
           '    }\n' +
           '}\n');

        var translations = new TranslationSet();

        var actual = jf.localizeText(translations, "fr-FR");
        var expected =
           '{\n' +
           '    "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "šíñğüľàŕ3210",\n' +
           '            "many": "màñÿ10",\n' +
           '            "other": "þľüŕàľ210"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "b0",\n' +
           '        "c": "ð0"\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "šţŕíñğ 13210",\n' +
           '            "šţŕíñğ 23210",\n' +
           '            "šţŕíñğ 33210"\n' +
           '        ]\n' +
           '    },\n' +
           '    "others": {\n' +
           '        "first": "abc",\n' +
           '        "second": "bcd"\n' +
           '    }\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

/*
    not implemented yet

    testJsonFileLocalizeTextMethodSpread: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/spread.json",
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
        translations.add(new ResourceString({
            project: "foo",
            key: "string 2",
            source: "this is string two",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 2",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        var actual = jf.localizeText(translations, "fr-FR");
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

    testJsonFileLocalizeTextMethodSpreadMultilingual: function(test) {
        test.expect(2);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/spread.json",
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
        translations.add(new ResourceString({
            project: "foo",
            key: "string 2",
            source: "this is string two",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 2",
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "Dies ist die Zeichenfolge 1",
            targetLocale: "de",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "string 2",
            source: "this is string two",
            sourceLocale: "en-US",
            target: "Dies ist die Zeichenfolge 2",
            targetLocale: "de",
            datatype: "json"
        }));

        var actual = jf.localizeText(translations, ["fr-FR", "de"]);
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

    testJsonFileLocalize: function(test) {
        test.expect(7);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/messages.json"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/messages.json"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.json")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.json")));

        var jf = new JsonFile({
            project: p,
            pathName: "./json/messages.json",
            type: t
        });
        test.ok(jf);

        // should read the file
        jf.extract();

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
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "Die b",
            targetLocale: "de-DE",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/c",
            source: "d",
            sourceLocale: "en-US",
            target: "Der d",
            targetLocale: "de-DE",
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
                "Zeichenfolge 1",
                "Zeichenfolge 2",
                "Zeichenfolge 3"
            ],
            targetLocale: "de-DE",
            datatype: "json"
        }));

        jf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.json")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.json")));

        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/messages.json"), "utf-8");

        var expected =
           '{\n' +
           '    "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "singulaire",\n' +
           '            "many": "plupart",\n' +
           '            "other": "autres"\n' +
           '        }\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "chaîne 1",\n' +
           '            "chaîne 2",\n' +
           '            "chaîne 3"\n' +
           '        ],\n' +
           '        "asdfasdf": [\n' +
           '            "1",\n' +
           '            "2",\n' +
           '            "3"\n' +
           '        ]\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "la b",\n' +
           '        "c": "la d"\n' +
           '    }\n' +
           '}\n';

        diff(content, expected);
        test.equal(content, expected);

        content = fs.readFileSync(path.join(base, "testfiles/resources/de/DE/messages.json"), "utf-8");

        var expected =
           '{\n' +
           '    "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "einslige",\n' +
           '            "many": "mehrere",\n' +
           '            "other": "andere"\n' +
           '        }\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "Zeichenfolge 1",\n' +
           '            "Zeichenfolge 2",\n' +
           '            "Zeichenfolge 3"\n' +
           '        ],\n' +
           '        "asdfasdf": [\n' +
           '            "1",\n' +
           '            "2",\n' +
           '            "3"\n' +
           '        ]\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "Die b",\n' +
           '        "c": "Der d"\n' +
           '    }\n' +
           '}\n';
        diff(content, expected);
        test.equal(content, expected);

        test.done();
    },

    testJsonFileLocalizeNoTranslations: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/messages.json"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/messages.json"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.json")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.json")));

        var jf = new JsonFile({
            project: p,
            pathName: "./json/messages.json",
            type: t
        });
        test.ok(jf);

        // should read the file
        jf.extract();

        var translations = new TranslationSet();

        jf.localize(translations, ["fr-FR", "de-DE"]);

        // should produce the files, even if there is nothing to localize in them
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.json")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.json")));

        test.done();
    },

    testJsonFileLocalizeMethodSparse: function(test) {
        test.expect(7);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/sparse2.json"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.json")));

        var jf = new JsonFile({
            project: p,
            pathName: "./json/sparse2.json",
            type: t
        });
        test.ok(jf);

        // should read the file
        jf.extract();

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
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "Die b",
            targetLocale: "de-DE",
            datatype: "json"
        }));

        jf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.json")));

        // should only contain the things that were actually translated
        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json"), "utf-8");

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
           '        "a": "la b"\n' +
           '    }\n' +
           '}\n';

        diff(content, expected);
        test.equal(content, expected);

        content = fs.readFileSync(path.join(base, "testfiles/resources/de/DE/sparse2.json"), "utf-8");

        var expected =
           '{\n' +
           '    "plurals": {\n' +
           '        "bar": {\n' +
           '            "one": "einslige",\n' +
           '            "many": "mehrere",\n' +
           '            "other": "andere"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "Die b"\n' +
           '    }\n' +
           '}\n';
        diff(content, expected);
        test.equal(content, expected);

        test.done();
    },

    testJsonFileLocalizeExtractNewStrings: function(test) {
        test.expect(43);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/sparse2.json"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.json")));

        var jf = new JsonFile({
            project: p,
            pathName: "./json/sparse2.json",
            type: t
        });
        test.ok(jf);

        // make sure we start off with no new strings
        t.newres.clear();
        test.equal(t.newres.size(), 0);

        // should read the file
        jf.extract();

        // only translate some of the strings
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "json"
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
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "Die b",
            targetLocale: "de-DE",
            datatype: "json"
        }));

        jf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.json")));

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

    testJsonFileLocalizeWithAlternateFileNameTemplate: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/deep_fr-FR.json"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/deep_de-DE.json"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.json")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.json")));

        var jf = new JsonFile({
            project: p,
            pathName: "./json/deep.json",
            type: t
        });
        test.ok(jf);

        // should read the file
        jf.extract();

        // only translate some of the strings
        var translations = new TranslationSet();

        jf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.json")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.json")));

        test.done();
    },

    testJsonFileLocalizeDefaultMethodAndTemplate: function(test) {
        test.expect(4);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "x/y/str.json",
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

        // default template is resources/[localeDir]/[filename]
        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/str.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/str.json"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/str.json")));

        jf.localize(translations, ["fr-FR"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/str.json")));

        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/str.json"), "utf-8");

        // default method is copy so this should be the whole file
        var expected =
           '{\n' +
           '    "string 1": "C\'est la chaîne numéro 1",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n';

        diff(content, expected);
        test.equal(content, expected);

        test.done();
    },

    testJsonFileGetLocalizedTextGeneratedString: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "x/y/str.json",
            type: t,
            locale: "fr-FR"
        });
        test.ok(jf);

        jf.addResource(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        var actual = jf.localizeText(undefined, "fr-FR");

        var expected =
           '{\n' +
           '    "string 1": "C\'est la chaîne numéro 1"\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testJsonFileGetLocalizedTextGeneratedPlural: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "x/y/str.json",
            type: t,
            locale: "fr-FR"
        });
        test.ok(jf);

        jf.addResource(new ResourcePlural({
            project: "foo",
            key: "string 1",
            sourceStrings: {
                "one": "this is the one string",
                "few": "this is the few string",
                "other": "this is the other string"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "Ceci est la chaîne 'one'",
                "few": "Ceci est la chaîne 'few'",
                "other": "Ceci est la chaîne 'other'"
            },
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        var actual = jf.localizeText(undefined, "fr-FR");

        var expected =
           '{\n' +
           '    "string 1": "one#Ceci est la chaîne \'one\'|few#Ceci est la chaîne \'few\'|#Ceci est la chaîne \'other\'"\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testJsonFileGetLocalizedTextGeneratedArray: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "x/y/str.json",
            type: t,
            locale: "fr-FR"
        });
        test.ok(jf);

        jf.addResource(new ResourceArray({
            project: "foo",
            key: "string 1",
            sourceArray: [
                "this is string one",
                "this is string two",
                "this is string three"
            ],
            sourceLocale: "en-US",
            targetArray: [
                "C'est la chaîne numéro 1",
                "C'est la chaîne numéro 2",
                "C'est la chaîne numéro 3"
            ],
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        var actual = jf.localizeText(undefined, "fr-FR");

        var expected =
           '{\n' +
           '    "string 1": [\n' +
           '        "C\'est la chaîne numéro 1",\n' +
           '        "C\'est la chaîne numéro 2",\n' +
           '        "C\'est la chaîne numéro 3"\n' +
           '    ]\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testJsonFileGetLocalizedTextGeneratedAll: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "x/y/str.json",
            type: t,
            locale: "fr-FR"
        });
        test.ok(jf);

        jf.addResource(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        jf.addResource(new ResourcePlural({
            project: "foo",
            key: "string 2",
            sourceStrings: {
                "one": "this is the one string",
                "few": "this is the few string",
                "other": "this is the other string"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "Ceci est la chaîne 'one'",
                "few": "Ceci est la chaîne 'few'",
                "other": "Ceci est la chaîne 'other'"
            },
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        jf.addResource(new ResourceArray({
            project: "foo",
            key: "string 3",
            sourceArray: [
                "this is string one",
                "this is string two",
                "this is string three"
            ],
            sourceLocale: "en-US",
            targetArray: [
                "C'est la chaîne numéro 1",
                "C'est la chaîne numéro 2",
                "C'est la chaîne numéro 3"
            ],
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        var actual = jf.localizeText(undefined, "fr-FR");

        var expected =
           '{\n' +
           '    "string 1": "C\'est la chaîne numéro 1",\n' +
           '    "string 2": "one#Ceci est la chaîne \'one\'|few#Ceci est la chaîne \'few\'|#Ceci est la chaîne \'other\'",\n' +
           '    "string 3": [\n' +
           '        "C\'est la chaîne numéro 1",\n' +
           '        "C\'est la chaîne numéro 2",\n' +
           '        "C\'est la chaîne numéro 3"\n' +
           '    ]\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    },

    testJsonFileGetLocalizedTextGeneratedEscapeDoubleQuotes: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "x/y/str.json",
            type: t,
            locale: "fr-FR"
        });
        test.ok(jf);

        jf.addResource(new ResourceString({
            project: "foo",
            key: "string 1",
            source: "this is string one",
            sourceLocale: "en-US",
            target: "C'est la \"chaîne\" numéro 1",
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        jf.addResource(new ResourcePlural({
            project: "foo",
            key: "string 2",
            sourceStrings: {
                "one": "this is the one string",
                "few": "this is the few string",
                "other": "this is the other string"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "Ceci est la chaîne \"one\"",
                "few": "Ceci est la chaîne \"few\"",
                "other": "Ceci est la chaîne \"other\""
            },
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        jf.addResource(new ResourceArray({
            project: "foo",
            key: "string 3",
            sourceArray: [
                "this is string one",
                "this is string two",
                "this is string three"
            ],
            sourceLocale: "en-US",
            targetArray: [
                "C'est la chaîne numéro \"1\"",
                "C'est la chaîne numéro \"2\"",
                "C'est la chaîne numéro \"3\""
            ],
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        var actual = jf.localizeText(undefined, "fr-FR");

        // need to escape the double quotes for json syntax
        var expected =
           '{\n' +
           '    "string 1": "C\'est la \\\"chaîne\\\" numéro 1",\n' +
           '    "string 2": "one#Ceci est la chaîne \\\"one\\\"|few#Ceci est la chaîne \\\"few\\\"|#Ceci est la chaîne \\\"other\\\"",\n' +
           '    "string 3": [\n' +
           '        "C\'est la chaîne numéro \\\"1\\\"",\n' +
           '        "C\'est la chaîne numéro \\\"2\\\"",\n' +
           '        "C\'est la chaîne numéro \\\"3\\\""\n' +
           '    ]\n' +
           '}\n';

        diff(actual, expected);
        test.equal(actual, expected);

        test.done();
    }

};
