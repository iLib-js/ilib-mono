/*
 * JsonFile.test.js - test the json file handler object.
 *
 * Copyright © 2021-2024 Box, Inc.
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

var JsonFile = require("../JsonFile.js");
var JsonFileType = require("../JsonFileType.js");

var CustomProject =  require("loctool/lib/CustomProject.js");
var TranslationSet =  require("loctool/lib/TranslationSet.js");
var ResourceString =  require("loctool/lib/ResourceString.js");
var ResourcePlural =  require("loctool/lib/ResourcePlural.js");
var ResourceArray =  require("loctool/lib/ResourceArray.js");

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
            "**/arrays2.json": {
                "schema": "http://github.com/ilib-js/arrays2.json",
                "method": "copy",
                "template": "resources/[localeDir]/arrays2.json"
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

function rmrf(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

afterEach(function() {
    [
        "test/testfiles/resources/de/DE/messages.json",
        "test/testfiles/resources/de/DE/sparse2.json",
        "test/testfiles/resources/fr/FR/messages.json",
        "test/testfiles/resources/fr/FR/str.json",
        "test/testfiles/resources/fr/FR/sparse2.json",
        "test/testfiles/resources/deep_de-DE.json",
        "test/testfiles/resources/deep_fr-FR.json"
    ].forEach(rmrf);
});

describe("jsonfile", function() {
    test("JsonFileConstructor", function() {
        expect.assertions(1);

        var jf = new JsonFile({project: p, type: t});
        expect(jf).toBeTruthy();
    });

    test("JsonFileConstructorParams", function() {
        expect.assertions(1);

        var jf = new JsonFile({
            project: p,
            pathName: "./testfiles/json/messages.json",
            type: t
        });

        expect(jf).toBeTruthy();
    });

    test("JsonFileConstructorNoFile", function() {
        expect.assertions(1);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        expect(jf).toBeTruthy();
    });

    test("JsonFileEscapeProp", function() {
        expect.assertions(1);

        expect(JsonFile.escapeProp("escape/tilde~tilde")).toBe("escape~1tilde~0tilde");
    });

    test("JsonFileEscapePropNoChange", function() {
        expect.assertions(1);

        expect(JsonFile.escapeProp("permissions")).toBe("permissions");
    });

    test("JsonFileEscapePropDontEscapeOthers", function() {
        expect.assertions(1);

        expect(JsonFile.escapeProp("permissions% \" ^ | \\")).toBe("permissions% \" ^ | \\");
    });

    test("JsonFileUnescapeProp", function() {
        expect.assertions(1);

        expect(JsonFile.unescapeProp("escape~1tilde~0tilde")).toBe("escape/tilde~tilde");
    });

    test("JsonFileUnescapePropTricky", function() {
        expect.assertions(1);

        expect(JsonFile.unescapeProp("escape~3tilde~4tilde")).toBe("escape~3tilde~4tilde");
    });

    test("JsonFileUnescapePropNoChange", function() {
        expect.assertions(1);

        expect(JsonFile.unescapeProp("permissions")).toBe("permissions");
    });

    test("JsonFileUnescapePropDontEscapeOthers", function() {
        expect.assertions(1);

        expect(JsonFile.unescapeProp("permissions% \" ^ | \\")).toBe("permissions% \" ^ | \\");
    });

    test("JsonFileEscapeRef", function() {
        expect.assertions(1);

        expect(JsonFile.escapeRef("escape/tilde~tilde")).toBe("escape~1tilde~0tilde");
    });

    test("JsonFileEscapeRefNoChange", function() {
        expect.assertions(1);

        expect(JsonFile.escapeRef("permissions")).toBe("permissions");
    });

    test("JsonFileEscapeRefDontEscapeOthers", function() {
        expect.assertions(1);

        expect(JsonFile.escapeRef("permissions% \" ^ | \\")).toBe("permissions%25%20%22%20%5E%20%7C%20%5C");
    });

    test("JsonFileUnescapeRef", function() {
        expect.assertions(1);

        expect(JsonFile.unescapeRef("escape~1tilde~0tilde")).toBe("escape/tilde~tilde");
    });

    test("JsonFileUnescapeRefTricky", function() {
        expect.assertions(1);

        expect(JsonFile.unescapeRef("escape~3tilde~4tilde")).toBe("escape~3tilde~4tilde");
    });

    test("JsonFileUnescapeRefNoChange", function() {
        expect.assertions(1);

        expect(JsonFile.unescapeRef("permissions")).toBe("permissions");
    });

    test("JsonFileUnescapeRefDontEscapeOthers", function() {
        expect.assertions(1);

        expect(JsonFile.unescapeRef("permissions%25%20%22%20%5E%20%7C%20%5C")).toBe("permissions% \" ^ | \\");
    });

    test("JsonFileParseSimpleGetByKey", function() {
        expect.assertions(5);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        expect(jf).toBeTruthy();

        jf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var set = jf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ResourceString.hashKey("foo", "en-US", "string 1", "json"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("this is string one");
        expect(r.getKey()).toBe("string 1");
    });

    test("JsonFileParseSimpleRightStrings", function() {
        expect.assertions(8);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        expect(jf).toBeTruthy();

        jf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var set = jf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("this is string one");
        expect(resources[0].getKey()).toBe("string 1");

        expect(resources[1].getSource()).toBe("this is string two");
        expect(resources[1].getKey()).toBe("string 2");
    });

    test("JsonFileParseSimpleDontExtractEmpty", function() {
        expect.assertions(6);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        expect(jf).toBeTruthy();

        jf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": ""\n' +
           '}\n');

        var set = jf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("this is string one");
        expect(resources[0].getKey()).toBe("string 1");
    });

    test("JsonFileParseEscapeStringKeys", function() {
        expect.assertions(8);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        expect(jf).toBeTruthy();

        jf.parse(
           '{\n' +
           '    "/user": "this is string one",\n' +
           '    "~tilde": "this is string two"\n' +
           '}\n');

        var set = jf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("this is string one");
        expect(resources[0].getKey()).toBe("/user");

        expect(resources[1].getSource()).toBe("this is string two");
        expect(resources[1].getKey()).toBe("~tilde");
    });

    test("JsonFileParseSimpleRejectThingsThatAreNotInTheSchema", function() {
        expect.assertions(6);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        expect(jf).toBeTruthy();

        jf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": {\n' +
           '        "asdf": "asdf"\n' +
           '    }\n' +
           '}\n');

        var set = jf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("this is string one");
        expect(resources[0].getKey()).toBe("string 1");
    });

    test("JsonFileParseComplexRightSize", function() {
        expect.assertions(3);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/messages.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(4);
    });

    test("JsonFileParseComplexRightStrings", function() {
        expect.assertions(26);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/messages.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(4);
        var resources = set.getAll();
        expect(resources.length).toBe(4);

        expect(resources[0].getType()).toBe("plural");
        expect(resources[0].getKey()).toBe("plurals/bar");
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
        expect(resources[1].getKey()).toBe("strings/a");

        expect(resources[2].getType()).toBe("string");
        expect(resources[2].getSource()).toBe("d");
        expect(resources[2].getKey()).toBe("strings/c");

        expect(resources[3].getType()).toBe("array");
        expect(resources[3].getKey()).toBe("arrays/asdf");
        var arrayStrings = resources[3].getSourceArray();
        expect(arrayStrings).toBeTruthy();
        expect(arrayStrings.length).toBe(3);
        expect(arrayStrings[0]).toBe("string 1");
        expect(arrayStrings[1]).toBe("string 2");
        expect(arrayStrings[2]).toBe("string 3");
    });

    test("JsonFileParseComplexRightStringsTranslated", function() {
        expect.assertions(38);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "resources/de/DE/messages.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(4);
        var resources = set.getAll();
        expect(resources.length).toBe(4);

        expect(resources[0].getType()).toBe("plural");
        expect(resources[0].getKey()).toBe("plurals/bar");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getTargetLocale()).toBe("de-DE");
        expect(resources[0].getSourcePlurals()).toStrictEqual({});
        var pluralStrings = resources[0].getTargetPlurals();
        expect(pluralStrings).toBeTruthy();
        expect(pluralStrings.one).toBe("eins");
        expect(pluralStrings.many).toBe("vielen");
        expect(pluralStrings.other).toBe("mehrere");
        expect(!pluralStrings.zero).toBeTruthy();
        expect(!pluralStrings.two).toBeTruthy();
        expect(!pluralStrings.few).toBeTruthy();

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getSourceLocale()).toBe("en-US");
        expect(resources[1].getTargetLocale()).toBe("de-DE");
        expect(!resources[1].getSource()).toBeTruthy();
        expect(resources[1].getTarget()).toBe("b");
        expect(resources[1].getKey()).toBe("strings/a");

        expect(resources[2].getType()).toBe("string");
        expect(resources[2].getSourceLocale()).toBe("en-US");
        expect(resources[2].getTargetLocale()).toBe("de-DE");
        expect(!resources[2].getSource()).toBeTruthy();
        expect(resources[2].getTarget()).toBe("d");
        expect(resources[2].getKey()).toBe("strings/c");

        expect(resources[3].getType()).toBe("array");
        expect(resources[3].getSourceLocale()).toBe("en-US");
        expect(resources[3].getTargetLocale()).toBe("de-DE");
        expect(resources[3].getKey()).toBe("arrays/asdf");
        expect(resources[3].getSourceArray()).toStrictEqual([]);
        var arrayStrings = resources[3].getTargetArray();
        expect(arrayStrings).toBeTruthy();
        expect(arrayStrings.length).toBe(3);
        expect(arrayStrings[0]).toBe("Zeichenfolge 1");
        expect(arrayStrings[1]).toBe("Zeichenfolge 2");
        expect(arrayStrings[2]).toBe("Zeichenfolge 3");
    });

    test("JsonFileParseArrayOfStrings", function() {
        expect.assertions(11);

        // when it's named arrays.json, it should apply the arrays schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        expect(jf).toBeTruthy();

        jf.parse('{\n' +
                '  "strings": [\n' +
                '    "string 1",\n' +
                '    "string 2",\n' +
                '    "string 3"\n' +
                '  ]\n' +
                '}\n');

        var set = jf.getTranslationSet();
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

    test("JsonFileParseArrayOfNumbers", function() {
        expect.assertions(12);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        expect(jf).toBeTruthy();

        jf.parse('{\n' +
                '  "numbers": [\n' +
                '    15,\n' +
                '    -3,\n' +
                '    1.18,\n' +
                '    0\n' +
                '  ]\n' +
                '}\n');

        var set = jf.getTranslationSet();
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

    test("JsonFileParseArrayOfBooleans", function() {
        expect.assertions(10);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        expect(jf).toBeTruthy();

        jf.parse('{\n' +
                '  "booleans": [\n' +
                '    true,\n' +
                '    false\n' +
                '  ]\n' +
                '}\n');

        var set = jf.getTranslationSet();
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

    test("JsonFileParseArrayOfObjects", function() {
        expect.assertions(13);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);

        var resources = set.getAll();
        expect(resources.length).toBe(3);
        expect(resources[0].getType()).toBe('string');
        expect(resources[0].getKey()).toBe('objects/item_0/name');
        expect(resources[0].getSource()).toBe('First Object');

        expect(resources[1].getType()).toBe('string');
        expect(resources[1].getKey()).toBe('objects/item_1/name');
        expect(resources[1].getSource()).toBe('Second Object');

        expect(resources[2].getType()).toBe('string');
        expect(resources[2].getKey()).toBe('objects/item_1/description');
        expect(resources[2].getSource()).toBe('String property');
    });

    test("JsonFileParseArrayOfStringsInsideOfAnyOf", function() {
        expect.assertions(14);

        // when it's named arrays.json, it should apply the arrays schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays2.json",
            type: t
        });
        expect(jf).toBeTruthy();

        jf.parse(
            '[\n' +
            '    {\n' +
            '        "strings": "test string"\n' +
            '    },\n' +
            '    {\n' +
            '        "strings": [\n' +
            '            "string 4",\n' +
            '            "string 5",\n' +
            '            "string 6"\n' +
            '        ]\n' +
            '    }\n' +
            ']\n'
            );

        var set = jf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);

        var resources = set.getAll();
        expect(resources.length).toBe(2);
        expect(resources[0].getType()).toBe('string');
        expect(resources[0].getKey()).toBe('item_0/strings');

        expect(resources[0].getSource()).toBe("test string");

        expect(resources[1].getType()).toBe('array');
        expect(resources[1].getKey()).toBe('item_1/strings');

        arrayStrings = resources[1].getSourceArray();
        expect(arrayStrings).toBeTruthy();
        expect(arrayStrings.length).toBe(3);
        expect(arrayStrings[0]).toBe("string 4");
        expect(arrayStrings[1]).toBe("string 5");
        expect(arrayStrings[2]).toBe("string 6");
    });

    test("JsonFileParseArrayWithRef", function() {
        expect.assertions(10);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/array-refs.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);

        var resources = set.getAll();
        expect(resources.length).toBe(2);
        expect(resources[0].getType()).toBe('string');
        expect(resources[0].getKey()).toBe('itemsArray/item_0/itemField');
        expect(resources[0].getSource()).toBe('First item');

        expect(resources[1].getType()).toBe('string');
        expect(resources[1].getKey()).toBe('itemsArray/item_1/itemField');
        expect(resources[1].getSource()).toBe('Second item');
    });

    test("JsonFileParseDeepRightSize", function() {
        expect.assertions(3);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/deep.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(3);
    });

    test("JsonFileParseDeepRightStrings", function() {
        expect.assertions(19);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/deep.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(3);
        var resources = set.getAll();
        expect(resources.length).toBe(3);

        expect(resources[0].getType()).toBe("plural");
        expect(resources[0].getKey()).toBe("x/y/plurals/bar");
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
        expect(resources[1].getKey()).toBe("a/b/strings/a");

        expect(resources[2].getType()).toBe("string");
        expect(resources[2].getSource()).toBe("d");
        expect(resources[2].getKey()).toBe("a/b/strings/c");
    });

    test("JsonFileParseTestInvalidJson", function() {
        expect.assertions(2);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/deep.json",
            type: t
        });
        expect(jf).toBeTruthy();

        expect(function(test) {
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
        }).toThrow();
    });

    test("JsonFileParseRefsRightSize", function() {
        expect.assertions(3);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/refs.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(3);
    });

    test("JsonFileParseRefsRightStrings", function() {
        expect.assertions(13);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/refs.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(3);
        var resources = set.getAll();
        expect(resources.length).toBe(3);

        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getSource()).toBe("Mobile");
        expect(resources[0].getKey()).toBe("owner/phone/type");

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getSource()).toBe("Home");
        expect(resources[1].getKey()).toBe("customer1/phone/type");

        expect(resources[2].getType()).toBe("string");
        expect(resources[2].getSource()).toBe("Work");
        expect(resources[2].getKey()).toBe("customer2/phone/type");
    });

    test("JsonFileParseDefaultSchema", function() {
        expect.assertions(5);

        var jf = new JsonFile({
            project: p,
            pathName: "a/b/c/str.json",
            type: t
        });
        expect(jf).toBeTruthy();

        jf.parse(
           '{\n' +
           '    "string 1": "this is string one",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var set = jf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ResourceString.hashKey("foo", "en-US", "string 1", "json"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("this is string one");
        expect(r.getKey()).toBe("string 1");
    });

/*
    can't do comments yet

    test("JsonFileParseExtractComments", function() {
        expect.assertions(8);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        expect(jf).toBeTruthy();

        jf.parse(
           '{\n' +
           '    // comment for string 1\,' +
           '    "string 1": "this is string one",\n' +
           '    // comment for string 2\,' +
           '    "string 2": "this is string two"\n' +
           '}\n');

        var set = jf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("this is string one");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getNote()).toBe("comment for string 1");

        expect(resources[1].getSource()).toBe("this is string two");
        expect(resources[1].getKey()).toBe("string 2");
    });

*/

    test("JsonFileExtractFile", function() {
        expect.assertions(28);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/messages.json",
            type: t
        });
        expect(jf).toBeTruthy();

        // should read the file
        jf.extract();

        var set = jf.getTranslationSet();

        expect(set.size()).toBe(5);

        var resources = set.getAll();
        expect(resources.length).toBe(5);

        expect(resources[0].getType()).toBe("plural");
        var categories = resources[0].getSourcePlurals();
        expect(categories).toBeTruthy();
        expect(categories.one).toBe("one");
        expect(categories.other).toBe("other");
        expect(resources[0].getKey()).toBe("plurals/bar");

        expect(resources[1].getType()).toBe("array");
        var arr = resources[1].getSourceArray();
        expect(arr).toBeTruthy();
        expect(arr.length).toBe(3);
        expect(arr[0]).toBe("value 1");
        expect(arr[1]).toBe("value 2");
        expect(arr[2]).toBe("value 3");
        expect(resources[1].getKey()).toBe("arrays/asdf");

        expect(resources[2].getType()).toBe("array");
        var arr = resources[2].getSourceArray();
        expect(arr).toBeTruthy();
        expect(arr.length).toBe(3);
        expect(arr[0]).toBe("1");
        expect(arr[1]).toBe("2");
        expect(arr[2]).toBe("3");
        expect(resources[2].getKey()).toBe("arrays/asdfasdf");

        expect(resources[3].getType()).toBe("string");
        expect(resources[3].getSource()).toBe("b");
        expect(resources[3].getKey()).toBe("strings/a");

        expect(resources[4].getType()).toBe("string");
        expect(resources[4].getSource()).toBe("d");
        expect(resources[4].getKey()).toBe("strings/c");
    });

    test("JsonFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        expect(jf).toBeTruthy();

        // should attempt to read the file and not fail
        jf.extract();

        var set = jf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("JsonFileExtractBogusFile", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/bogus.json",
            type: t
        });
        expect(jf).toBeTruthy();

        // should attempt to read the file and not fail
        jf.extract();

        var set = jf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("JsonFileLocalizeTextSimple", function() {
        expect.assertions(2);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("JsonFileLocalizeTextWithSchema", function() {
        expect.assertions(2);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/messages.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("JsonFileLocalizeTextMethodSparse", function() {
        expect.assertions(2);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/sparse.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("JsonFileLocalizeTextWithSchemaSparseComplex", function() {
        expect.assertions(2);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/sparse2.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("JsonFileLocalizeArrayOfStrings", function() {
        expect.assertions(2);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("JsonFileLocalizeArrayOfNumbers", function() {
        expect.assertions(2);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("JsonFileLocalizeArrayOfBooleans", function() {
        expect.assertions(2);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("JsonFileLocalizeArrayOfObjects", function() {
        expect.assertions(2);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("JsonFileLocalizeArrayOfObjectsWithBooleansOnly", function() {
        expect.assertions(2);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("Localize an array of objects that includes an empty object", function() {
        expect.assertions(2);

        var jf = new JsonFile({
            project: p,
            pathName: "i18n/arrays.json",
            type: t
        });
        expect(jf).toBeTruthy();

        jf.parse('{\n' +
                '  "objects": [\n' +
                '    {},\n' +
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
            key: "objects/item_1/name",
            source: "First Object",
            sourceLocale: "en-US",
            target: "Premier objet",
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "objects/item_2/name",
            source: "Second Object",
            sourceLocale: "en-US",
            target: "Deuxième objet",
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "objects/item_2/description",
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
                '        {},\n' +
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
        expect(actual).toBe(expected);
    });

    test("JsonFileLocalizeTextUsePseudoForMissing", function() {
        expect.assertions(2);

        var jf = new JsonFile({
            project: p2,
            pathName: "./json/messages.json",
            type: t2
        });
        expect(jf).toBeTruthy();

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
           '            "one": "[šíñğüľàŕ3210]",\n' +
           '            "many": "[màñÿ10]",\n' +
           '            "other": "[þľüŕàľ210]"\n' +
           '        }\n' +
           '    },\n' +
           '    "strings": {\n' +
           '        "a": "[b0]",\n' +
           '        "c": "[ð0]"\n' +
           '    },\n' +
           '    "arrays": {\n' +
           '        "asdf": [\n' +
           '            "[šţŕíñğ 13210]",\n' +
           '            "[šţŕíñğ 23210]",\n' +
           '            "[šţŕíñğ 33210]"\n' +
           '        ]\n' +
           '    },\n' +
           '    "others": {\n' +
           '        "first": "abc",\n' +
           '        "second": "bcd"\n' +
           '    }\n' +
           '}\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

/*
    not implemented yet

    test("JsonFileLocalizeTextMethodSpread", function() {
        expect.assertions(2);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/spread.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("JsonFileLocalizeTextMethodSpreadMultilingual", function() {
        expect.assertions(2);

        var jf = new JsonFile({
            project: p,
            pathName: "./json/spread.json",
            type: t
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });
*/

    test("JsonFileLocalize", function() {
        expect.assertions(7);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/messages.json"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/messages.json"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.json"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.json"))).toBeTruthy();

        var jf = new JsonFile({
            project: p,
            pathName: "./json/messages.json",
            type: t
        });
        expect(jf).toBeTruthy();

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

        expect(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.json"))).toBeTruthy();

        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/messages.json"), "utf-8");

        var expected =
           '{\n' +
           '    "plurals": {\n' +
           '        "foo": "asdf",\n' +     // this line is not localized
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
        expect(content).toBe(expected);

        content = fs.readFileSync(path.join(base, "testfiles/resources/de/DE/messages.json"), "utf-8");

        var expected =
           '{\n' +
           '    "plurals": {\n' +
           '        "foo": "asdf",\n' +     // this line is not localized
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
        expect(content).toBe(expected);
    });

    test("JsonFileLocalizeNoTranslations", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/messages.json"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/messages.json"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.json"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.json"))).toBeTruthy();

        var jf = new JsonFile({
            project: p,
            pathName: "./json/messages.json",
            type: t
        });
        expect(jf).toBeTruthy();

        // should read the file
        jf.extract();

        var translations = new TranslationSet();

        jf.localize(translations, ["fr-FR", "de-DE"]);

        // should produce the files, even if there is nothing to localize in them
        expect(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.json"))).toBeTruthy();
    });

    test("JsonFileLocalizeMethodSparse", function() {
        expect.assertions(7);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/sparse2.json"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.json"))).toBeTruthy();

        var jf = new JsonFile({
            project: p,
            pathName: "./json/sparse2.json",
            type: t
        });
        expect(jf).toBeTruthy();

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

        expect(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.json"))).toBeTruthy();

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
        expect(content).toBe(expected);

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
        expect(content).toBe(expected);
    });

    test("JsonFileLocalizeExtractNewStrings", function() {
        expect.assertions(43);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/sparse2.json"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.json"))).toBeTruthy();

        var jf = new JsonFile({
            project: p,
            pathName: "./json/sparse2.json",
            type: t
        });
        expect(jf).toBeTruthy();

        // make sure we start off with no new strings
        t.newres.clear();
        expect(t.newres.size()).toBe(0);

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

        expect(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.json"))).toBeTruthy();

        // now verify that the strings which did not have translations show up in the
        // new strings translation set
        expect(t.newres.size()).toBe(7);
        var resources = t.newres.getAll();
        expect(resources.length).toBe(7);

        expect(resources[0].getType()).toBe("plural");
        expect(resources[0].getKey()).toBe("plurals/bar");
        expect(resources[0].getTargetLocale()).toBe("fr-FR");
        var pluralStrings = resources[0].getSourcePlurals();
        expect(pluralStrings).toBeTruthy();
        expect(pluralStrings.one).toBe("one");
        expect(pluralStrings.other).toBe("other");
        pluralStrings = resources[0].getTargetPlurals();
        expect(pluralStrings).toBeTruthy();
        expect(pluralStrings.one).toBe("one");
        expect(pluralStrings.other).toBe("other");

        expect(resources[1].getType()).toBe("array");
        expect(resources[1].getKey()).toBe("arrays/asdf");
        expect(resources[1].getTargetLocale()).toBe("fr-FR");
        var arrayStrings = resources[1].getSourceArray();
        expect(arrayStrings).toBeTruthy();
        expect(arrayStrings[0]).toBe("value 1");
        expect(arrayStrings[1]).toBe("value 2");
        expect(arrayStrings[2]).toBe("value 3");
        arrayStrings = resources[1].getTargetArray();
        expect(arrayStrings).toBeTruthy();
        expect(arrayStrings[0]).toBe("value 1");
        expect(arrayStrings[1]).toBe("value 2");
        expect(arrayStrings[2]).toBe("value 3");

        expect(resources[2].getType()).toBe("array");
        expect(resources[2].getKey()).toBe("arrays/asdfasdf");
        expect(resources[2].getTargetLocale()).toBe("fr-FR");
        var arrayStrings = resources[2].getSourceArray();
        expect(arrayStrings).toBeTruthy();
        expect(arrayStrings[0]).toBe("1");
        expect(arrayStrings[1]).toBe("2");
        expect(arrayStrings[2]).toBe("3");
        arrayStrings = resources[2].getTargetArray();
        expect(arrayStrings).toBeTruthy();
        expect(arrayStrings[0]).toBe("1");
        expect(arrayStrings[1]).toBe("2");
        expect(arrayStrings[2]).toBe("3");

        expect(resources[3].getType()).toBe("string");
        expect(resources[3].getSource()).toBe("d");
        expect(resources[3].getKey()).toBe("strings/c");
        expect(resources[3].getTargetLocale()).toBe("fr-FR");
    });

    test("JsonFileLocalizeWithAlternateFileNameTemplate", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/deep_fr-FR.json"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.json"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/deep_de-DE.json"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.json"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.json"))).toBeTruthy();

        var jf = new JsonFile({
            project: p,
            pathName: "./json/deep.json",
            type: t
        });
        expect(jf).toBeTruthy();

        // should read the file
        jf.extract();

        // only translate some of the strings
        var translations = new TranslationSet();

        jf.localize(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.json"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.json"))).toBeTruthy();
    });

    test("JsonFileLocalizeDefaultMethodAndTemplate", function() {
        expect.assertions(4);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "x/y/str.json",
            type: t
        });
        expect(jf).toBeTruthy();

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

        expect(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/str.json"))).toBeTruthy();

        jf.localize(translations, ["fr-FR"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/str.json"))).toBeTruthy();

        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/str.json"), "utf-8");

        // default method is copy so this should be the whole file
        var expected =
           '{\n' +
           '    "string 1": "C\'est la chaîne numéro 1",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("JsonFileGetLocalizedTextGeneratedString", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "x/y/str.json",
            type: t,
            locale: "fr-FR"
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("JsonFileGetLocalizedTextGeneratedPlural", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "x/y/str.json",
            type: t,
            locale: "fr-FR"
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("JsonFileGetLocalizedTextGeneratedArray", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "x/y/str.json",
            type: t,
            locale: "fr-FR"
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("JsonFileGetLocalizedTextGeneratedAll", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "x/y/str.json",
            type: t,
            locale: "fr-FR"
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

    test("JsonFileGetLocalizedTextGeneratedEscapeDoubleQuotes", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var jf = new JsonFile({
            project: p,
            pathName: "x/y/str.json",
            type: t,
            locale: "fr-FR"
        });
        expect(jf).toBeTruthy();

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
        expect(actual).toBe(expected);
    });

});
