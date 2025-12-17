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

var CustomProject = require("loctool/lib/CustomProject.js");
var TranslationSet = require("loctool/lib/TranslationSet.js");
var ResourceString = require("loctool/lib/ResourceString.js");
var ResourcePlural = require("loctool/lib/ResourcePlural.js");
var ResourceArray = require("loctool/lib/ResourceArray.js");

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

function rmrf(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

afterEach(function () {
    [
        "test/testfiles/resources/de/DE/messages.json",
        "test/testfiles/resources/de/DE/sparse2.json",
        "test/testfiles/resources/fr/FR/messages.json",
        "test/testfiles/resources/fr/FR/str.json",
        "test/testfiles/resources/fr/FR/sparse2.json",
        "test/testfiles/resources/deep_de-DE.json",
        "test/testfiles/resources/deep_fr-FR.json",
    ].forEach(rmrf);
});

describe("jsonfile", function () {
    // older tests use a single, shared project
    var p, t, p2, t2;

    function setupTest({ mappings, pathName }) {
        const project = new CustomProject(
            {
                name: "foo",
                id: "foo",
                sourceLocale: "en-US",
            },
            "./test/testfiles",
            {
                locales: ["en-GB"],
                targetDir: ".",
                nopseudo: true,
                json: {
                    schemas: ["./schemas"],
                    mappings,
                },
            }
        );
        const jsonFileType = new JsonFileType(project);
        const jsonFile = new JsonFile({
            project: project,
            type: jsonFileType,
            pathName,
        });

        return jsonFile;
    }

    beforeAll(function () {
        // TODO: break this apart
        p = new CustomProject(
            {
                name: "foo",
                id: "foo",
                sourceLocale: "en-US",
            },
            "./test/testfiles",
            {
                locales: ["en-GB"],
                targetDir: ".",
                nopseudo: true,
                json: {
                    schemas: ["./schemas"],
                    mappings: {
                        "resources/en/US/strings.json": {
                            schema: "./testfiles/schema/strings-schema.json",
                            method: "copy",
                            template: "resources/[localeDir]/strings.json",
                        },
                        "**/messages.json": {
                            schema: "http://github.com/ilib-js/messages.json",
                            method: "copy",
                            template: "resources/[localeDir]/messages.json",
                        },
                        "**/sparse.json": {
                            schema: "strings-schema",
                            method: "sparse",
                            template: "resources/[localeDir]/sparse.json",
                        },
                        "**/sparse2.json": {
                            schema: "http://github.com/ilib-js/messages.json",
                            method: "sparse",
                            template: "resources/[localeDir]/sparse2.json",
                        },
                        "**/spread.json": {
                            schema: "strings-schema",
                            method: "spread",
                            template: "resources/[localeDir]/spread.json",
                        },
                        "**/deep.json": {
                            schema: "http://github.com/ilib-js/deep.json",
                            method: "copy",
                            template: "resources/deep_[locale].json",
                        },
                        "**/refs.json": {
                            schema: "http://github.com/ilib-js/refs.json",
                            method: "copy",
                            template: "resources/[locale]/refs.json",
                        },
                        "**/str.json": {},
                        "**/arrays.json": {
                            schema: "http://github.com/ilib-js/arrays.json",
                            method: "copy",
                            template: "resources/[localeDir]/arrays.json",
                        },
                        "**/arrays2.json": {
                            schema: "http://github.com/ilib-js/arrays2.json",
                            method: "copy",
                            template: "resources/[localeDir]/arrays2.json",
                        },
                        "**/array-refs.json": {
                            schema: "http://github.com/ilib-js/array-refs.json",
                            method: "copy",
                            template: "resources/[localeDir]/array-refs.json",
                        },
                    },
                },
            }
        );
        t = new JsonFileType(p);

        p2 = new CustomProject(
            {
                name: "foo",
                id: "foo",
                sourceLocale: "en-US",
            },
            "./test/testfiles",
            {
                locales: ["en-GB"],
                identify: true,
                targetDir: "testfiles",
                nopseudo: false,
                json: {
                    schemas: ["./schemas"],
                    mappings: {
                        "**/messages.json": {
                            schema: "http://github.com/ilib-js/messages.json",
                            method: "copy",
                            template: "resources/[localeDir]/messages.json",
                        },
                    },
                },
            }
        );

        t2 = new JsonFileType(p2);
    });

    test("JsonFileConstructor", function () {
        expect.assertions(1);

        var jf = new JsonFile({project: p, type: t});
        expect(jf).toBeTruthy();
    });

    test("JsonFileConstructorParams", function () {
        expect.assertions(1);

        var jf = new JsonFile({
            project: p,
            pathName: "./testfiles/json/messages.json",
            type: t
        });

        expect(jf).toBeTruthy();
    });

    test("JsonFileConstructorNoFile", function () {
        expect.assertions(1);

        var jf = new JsonFile({
            project: p,
            type: t
        });
        expect(jf).toBeTruthy();
    });

    test("JsonFileEscapeProp", function () {
        expect.assertions(1);

        expect(JsonFile.escapeProp("escape/tilde~tilde")).toBe("escape~1tilde~0tilde");
    });

    test("JsonFileEscapePropNoChange", function () {
        expect.assertions(1);

        expect(JsonFile.escapeProp("permissions")).toBe("permissions");
    });

    test("JsonFileEscapePropDontEscapeOthers", function () {
        expect.assertions(1);

        expect(JsonFile.escapeProp("permissions% \" ^ | \\")).toBe("permissions% \" ^ | \\");
    });

    test("JsonFileUnescapeProp", function () {
        expect.assertions(1);

        expect(JsonFile.unescapeProp("escape~1tilde~0tilde")).toBe("escape/tilde~tilde");
    });

    test("JsonFileUnescapePropTricky", function () {
        expect.assertions(1);

        expect(JsonFile.unescapeProp("escape~3tilde~4tilde")).toBe("escape~3tilde~4tilde");
    });

    test("JsonFileUnescapePropNoChange", function () {
        expect.assertions(1);

        expect(JsonFile.unescapeProp("permissions")).toBe("permissions");
    });

    test("JsonFileUnescapePropDontEscapeOthers", function () {
        expect.assertions(1);

        expect(JsonFile.unescapeProp("permissions% \" ^ | \\")).toBe("permissions% \" ^ | \\");
    });

    test("JsonFileEscapeRef", function () {
        expect.assertions(1);

        expect(JsonFile.escapeRef("escape/tilde~tilde")).toBe("escape~1tilde~0tilde");
    });

    test("JsonFileEscapeRefNoChange", function () {
        expect.assertions(1);

        expect(JsonFile.escapeRef("permissions")).toBe("permissions");
    });

    test("JsonFileEscapeRefDontEscapeOthers", function () {
        expect.assertions(1);

        expect(JsonFile.escapeRef("permissions% \" ^ | \\")).toBe("permissions%25%20%22%20%5E%20%7C%20%5C");
    });

    test("JsonFileUnescapeRef", function () {
        expect.assertions(1);

        expect(JsonFile.unescapeRef("escape~1tilde~0tilde")).toBe("escape/tilde~tilde");
    });

    test("JsonFileUnescapeRefTricky", function () {
        expect.assertions(1);

        expect(JsonFile.unescapeRef("escape~3tilde~4tilde")).toBe("escape~3tilde~4tilde");
    });

    test("JsonFileUnescapeRefNoChange", function () {
        expect.assertions(1);

        expect(JsonFile.unescapeRef("permissions")).toBe("permissions");
    });

    test("JsonFileUnescapeRefDontEscapeOthers", function () {
        expect.assertions(1);

        expect(JsonFile.unescapeRef("permissions%25%20%22%20%5E%20%7C%20%5C")).toBe("permissions% \" ^ | \\");
    });

    test("JsonFileParseSimpleGetByKey", function () {
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

    test("JsonFileParseSimpleRightStrings", function () {
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

    test("JsonFileParseSimpleDontExtractEmpty", function () {
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

    test("JsonFileParseEscapeStringKeys", function () {
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

    test("JsonFileParseSimpleRejectThingsThatAreNotInTheSchema", function () {
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

    test("JsonFileParseComplexRightSize", function () {
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

    test("JsonFileParseComplexRightStrings", function () {
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

    test("JsonFileParseComplexRightStringsTranslated", function () {
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

    test("JsonFileParseArrayOfStrings", function () {
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

    test("JsonFileParseArrayOfNumbers", function () {
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

    test("JsonFileParseArrayOfBooleans", function () {
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

    test("JsonFileParseArrayOfObjects", function () {
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

    test("JsonFileParseArrayOfStringsInsideOfAnyOf", function () {
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

    test("JsonFileParseArrayWithRef", function () {
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

    test("JsonFileParseDeepRightSize", function () {
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

    test("JsonFileParseDeepRightStrings", function () {
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

    test("JsonFileParseTestInvalidJson", function () {
        expect.assertions(2);

        // when it's named messages.json, it should apply the messages-schema schema
        var jf = new JsonFile({
            project: p,
            pathName: "i18n/deep.json",
            type: t
        });
        expect(jf).toBeTruthy();

        expect(function (test) {
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

    test("JsonFileParseRefsRightSize", function () {
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

    test("JsonFileParseRefsRightStrings", function () {
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

    test("JsonFileParseDefaultSchema", function () {
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

    test("JsonFileExtractFile", function () {
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

    test("JsonFileExtractUndefinedFile", function () {
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

    test("JsonFileExtractBogusFile", function () {
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

    test("JsonFileLocalizeTextSimple", function () {
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

        expect(actual).toMatchSnapshot();
    });

    test("JsonFileLocalizeTextWithSchema", function () {
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

        expect(actual).toMatchSnapshot();
    });

    test("JsonFileLocalizeTextMethodSparse", function () {
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

        expect(actual).toMatchSnapshot();
    });

    test("JsonFileLocalizeTextWithSchemaSparseComplex", function () {
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

        expect(actual).toMatchSnapshot();
    });

    test("JsonFileLocalizeArrayOfStrings", function () {
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

        expect(actual).toMatchSnapshot();
    });

    test("JsonFileLocalizeArrayOfNumbers", function () {
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

        expect(actual).toMatchSnapshot();
    });

    test("JsonFileLocalizeArrayOfBooleans", function () {
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

        expect(actual).toMatchSnapshot();
    });

    test("JsonFileLocalizeArrayOfObjects", function () {
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

        expect(actual).toMatchSnapshot();
    });

    test("JsonFileLocalizeArrayOfObjectsWithBooleansOnly", function () {
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

        expect(actual).toMatchSnapshot();
    });

    test("Localizing an empty object should return an empty object", function () {
        const jsonFile = setupTest({
            mappings: {
                "json/empty-object.json": {
                    schema: "strings-schema",
                    method: "copy",
                    template: "resources/[localeDir]/empty-object.json",
                },
            },
            pathName: "json/empty-object.json",
        });

        jsonFile.extract();

        const translations = new TranslationSet();

        const actual = jsonFile.localizeText(translations, "xx-YY");

        expect(actual).toMatchSnapshot();
    });

    test("Localize an array of objects that includes an empty object", function () {
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

        expect(actual).toMatchSnapshot();
    });

    test("JsonFileLocalizeTextUsePseudoForMissing", function () {
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

        expect(actual).toMatchSnapshot();
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

    test("JsonFileLocalize", function () {
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

        var frContent = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/messages.json"), "utf-8");
        var deContent = fs.readFileSync(path.join(base, "testfiles/resources/de/DE/messages.json"), "utf-8");

        expect(frContent).toMatchSnapshot();
        expect(deContent).toMatchSnapshot();
    });

    test("JsonFileLocalizeNoTranslations", function () {
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

    test("JsonFileLocalizeMethodSparse", function () {
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
        var frContent = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/sparse2.json"), "utf-8");
        var deContent = fs.readFileSync(path.join(base, "testfiles/resources/de/DE/sparse2.json"), "utf-8");

        expect(frContent).toMatchSnapshot();
        expect(deContent).toMatchSnapshot();
    });

    test("Nested empty values should be preserved in default method", function () {
        const jsonFile = setupTest({
            mappings: {
                "json/nested-empty-items.json": {
                    schema: "nested-empty-items-schema",
                    method: "copy",
                    template: "resources/[localeDir]/nested-empty-items.json",
                },
            },
            pathName: "json/nested-empty-items.json",
        });

        jsonFile.extract();

        const translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "nonEmptyString",
            source: "string to localize",
            sourceLocale: "en-US",
            target: "a localized string",
            targetLocale: "xx-YY",
            datatype: "json",
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "nonEmptyObject/nonEmptyString",
            source: "string to localize",
            sourceLocale: "en-US",
            target: "a localized string",
            targetLocale: "xx-YY",
            datatype: "json",
        }));

        const actual = jsonFile.localizeText(translations, ["xx-YY"]);
        const actualObj = JSON.parse(actual);
        const expectedObj = {
            "aNull": null,
            "aNumber": 0,
            "aBoolean": false,
            "emptyString": "",
            "nonEmptyString": "a localized string",
            "emptyObject": {},
            "emptyArray": [],
            "nonEmptyObject": {
                "aNull": null,
                "aNumber": 0,
                "aBoolean": false,
                "emptyString": "",
                "nonEmptyString": "a localized string",
                "emptyObject": {},
                "emptyArray": []
            }
        };

        expect(actualObj).toEqual(expectedObj);
    });

    test("Nested empty values should be removed in sparse method", function () {
        const jsonFile = setupTest({
            mappings: {
                "json/nested-empty-items.json": {
                    schema: "nested-empty-items-schema",
                    method: "sparse",
                    template: "resources/[localeDir]/nested-empty-items.json",
                },
            },
            pathName: "json/nested-empty-items.json",
        });

        jsonFile.extract();

        const translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "nonEmptyString",
            source: "string to localize",
            sourceLocale: "en-US",
            target: "a localized string",
            targetLocale: "xx-YY",
            datatype: "json",
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "nonEmptyObject/nonEmptyString",
            source: "string to localize",
            sourceLocale: "en-US",
            target: "a localized string",
            targetLocale: "xx-YY",
            datatype: "json",
        }));

        const actual = jsonFile.localizeText(translations, ["xx-YY"]);
        const actualObj = JSON.parse(actual);
        const expectedObj = {
            nonEmptyString: "a localized string",
            nonEmptyObject: {
                nonEmptyString: "a localized string",
            }
        };

        expect(actualObj).toEqual(expectedObj);
    });

    test("JsonFileLocalizeExtractNewStrings", function () {
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

    test("JsonFileLocalizeWithAlternateFileNameTemplate", function () {
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

    test("JsonFileLocalizeDefaultMethodAndTemplate", function () {
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

        expect(content).toMatchSnapshot();
    });

    test("JsonFileGetLocalizedTextGeneratedString", function () {
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

        expect(actual).toMatchSnapshot();
    });

    test("JsonFileGetLocalizedTextGeneratedPlural", function () {
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

        expect(actual).toMatchSnapshot();
    });

    test("JsonFileGetLocalizedTextGeneratedArray", function () {
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

        expect(actual).toMatchSnapshot();
    });

    test("JsonFileGetLocalizedTextGeneratedAll", function () {
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

        expect(actual).toMatchSnapshot();
    });

    test("JsonFileGetLocalizedTextGeneratedEscapeDoubleQuotes", function () {
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

        expect(actual).toMatchSnapshot();
    });

});

describe("schema 'localizable'", () => {
    function setupTest({ schema }) {
        const project = new CustomProject(
            {
                name: "localizable-test",
                id: "localizable-test",
                sourceLocale: "en-US",
            },
            "./test/testfiles",
            {
                locales: ["en-GB"],
                targetDir: ".",
                nopseudo: true,
                json: {
                    schemas: ["./schemas"],
                    mappings: {
                        "**/localizable.json": {
                            schema: schema,
                            method: "copy",
                            template: "resources/[localeDir]/localizable.json",
                        },
                    },
                },
            }
        );
        const jsonFileType = new JsonFileType(project);
        const jsonFile = new JsonFile({
            project: project,
            type: jsonFileType,
            pathName: "./json/localizable.json",
        });

        return { jsonFile };
    }

    const base = path.dirname(module.id);
    const paths = [
        `${base}/testfiles/resources/mi/MI/localizable.json`
    ];

    afterEach(() => {
        paths.forEach((path) => fs.existsSync(path) && fs.unlinkSync(path));
    });

    test("supports 'localizable: key' property", () => {
        const {jsonFile} = setupTest({schema: "localizable-schema"});
        jsonFile.parse(`{
             "project.whateverModal.saveButton": {
                "defaultMessage": "Save",
                "description": "Button text for save"
            }
        }`);

        const set = jsonFile.getTranslationSet();
        const resource = set.get(ResourceString.hashKey("localizable-test", "en-US", "project.whateverModal.saveButton", "json"));

        expect(resource.getKey()).toBe("project.whateverModal.saveButton");
    });

    test("supports 'localizable: source' property", () => {
        const {jsonFile} = setupTest({schema: "localizable-schema"});
        jsonFile.parse(`{
             "project.whateverModal.saveButton": {
                "defaultMessage": "Save",
                "description": "Button text for save"
            }
        }`);

        const set = jsonFile.getTranslationSet();
        const resource = set.get(ResourceString.hashKey("localizable-test", "en-US", "project.whateverModal.saveButton", "json"));

        expect(resource.getSource()).toBe("Save");
    });

    test("supports 'localizable: comment' property", () => {
        const {jsonFile} = setupTest({schema: "localizable-schema"});
        jsonFile.parse(`{
             "project.whateverModal.saveButton": {
                "defaultMessage": "Save",
                "description": "Button text for save"
            }
        }`);

        const set = jsonFile.getTranslationSet();
        const resource = set.get(ResourceString.hashKey("localizable-test", "en-US", "project.whateverModal.saveButton", "json"));

        expect(resource.getComment()).toBe("Button text for save");
    });

    test("supports 'localizable: true' property (backward compatible)", () => {
        const {jsonFile} = setupTest({schema: "localizable-schema-backward-compatible"});
        jsonFile.parse(`{
             "project.whateverModal.saveButton": {
                "defaultMessage": "Save",
                "description": "Button text for save"
            }
        }`);

        const set = jsonFile.getTranslationSet();
        const resource = set.get(ResourceString.hashKey("localizable-test", "en-US", "project.whateverModal.saveButton", "json"));

        expect(resource.getSource()).toBe("Save");
    });

    test("extracts resources from JSON file using 'localizable' schema properties", () => {
        const {jsonFile} = setupTest({schema: "localizable-schema"});

        expect(() => {jsonFile.extract()}).not.toThrow();

        const translationSet = jsonFile.getTranslationSet();
        const keys = translationSet.getAll().map(resource => resource.getKey());

        expect(translationSet.size()).toEqual(4)
        expect(keys).toEqual(["project.whateverModal.saveButton", "project.whateverModal.createButton", "project.whateverModal.invalid", "project.whateverModal.nameLabel"]);
    });

    test("applies translations to JSON file using 'localizable' schema properties", function () {
        const {jsonFile} = setupTest({schema: "localizable-schema"});

        jsonFile.extract();

        const translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "localizable-test",
            key: "project.whateverModal.saveButton",
            source: "Save",
            sourceLocale: "en-US",
            target: "Save-a!",
            targetLocale: "mi-MI",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "localizable-test",
            key: "project.whateverModal.createButton",
            source: "Create",
            comment: "Button text for create",
            sourceLocale: "en-US",
            target: "Krayto",
            targetLocale: "mi-MI",
            datatype: "json"
        }));

        jsonFile.localize(translations, ["mi-MI"]);

        const content = fs.readFileSync(path.join(base, "testfiles/resources/mi/MI/localizable.json"), "utf-8");

        expect(content).toMatchSnapshot();
    });
});

describe("resourceFileTypes delegation", () => {
    var base = path.dirname(module.id);
    var outputPaths = [];

    afterEach(() => {
        // Clean up any output files
        outputPaths.forEach(function(p) {
            if (fs.existsSync(p)) {
                fs.unlinkSync(p);
            }
        });
        outputPaths = [];
    });

    function setupTestWithResourceFileType(options) {
        var projectConfig = {
            name: "resfiletype-test",
            id: "resfiletype-test",
            sourceLocale: "en-US",
            resourceDirs: {
                "json": "resources"
            }
        };

        // Configure resourceFileTypes like a real project.json would
        if (options.useResourceFileType) {
            projectConfig.resourceFileTypes = {
                "json": "ilib-loctool-json-resource"
            };
        }

        var projectSettings = {
            locales: ["fr-FR", "de-DE"],
            targetDir: ".",
            nopseudo: true,
            json: {
                schemas: ["./schemas"],
                mappings: options.mappings || {
                    "**/strings.json": {
                        schema: "strings-schema",
                        method: "copy",
                        template: "resources/[localeDir]/strings.json"
                    }
                }
            },
            "json-resource": {
                header: "// HEADER: AUTO-GENERATED\n",
                footer: "\n// FOOTER: END OF FILE\n"
            }
        };

        var project = new CustomProject(projectConfig, "./test/testfiles", projectSettings);

        // Call defineFileTypes to let loctool load plugins from resourceFileTypes config
        // This is normally called by project.init()
        project.defineFileTypes();

        var jsonFileType = new JsonFileType(project);
        var jsonFile = new JsonFile({
            project: project,
            type: jsonFileType,
            pathName: options.pathName || "json/strings.json"
        });

        // Get the resource file type that loctool loaded
        var resFileType = project.getResourceFileType("json");

        return { project, jsonFileType, jsonFile, resFileType };
    }

    test("JsonFile localize delegates to resourceFileType and writes file with header/footer", function () {
        expect.assertions(2);

        var { jsonFile, resFileType } = setupTestWithResourceFileType({
            pathName: "json/strings.json",
            useResourceFileType: true,
            mappings: {
                "**/strings.json": {
                    schema: "strings-schema",
                    method: "copy",
                    template: "resources/[localeDir]/strings.json"
                }
            }
        });

        jsonFile.parse('{\n' +
            '    "greeting": "Hello",\n' +
            '    "farewell": "Goodbye"\n' +
            '}');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "resfiletype-test",
            key: "greeting",
            source: "Hello",
            sourceLocale: "en-US",
            target: "Bonjour",
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "resfiletype-test",
            key: "farewell",
            source: "Goodbye",
            sourceLocale: "en-US",
            target: "Au revoir",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        jsonFile.localize(translations, ["fr-FR"]);

        // Now write out the resource files
        resFileType.write();

        // When delegating to resourceFileType, the resource file type determines the output path
        // based on its own configuration (resourceDirs + locale), not the JSON mapping template
        var outputPath = path.join(base, "testfiles/resources/fr-FR.json");
        outputPaths.push(outputPath);

        expect(fs.existsSync(outputPath)).toBe(true);

        var content = fs.readFileSync(outputPath, "utf-8");

        expect(content).toMatchSnapshot();
    });

    test("JsonFile localize writes directly when no resourceFileType configured", function () {
        expect.assertions(2);

        var { jsonFile } = setupTestWithResourceFileType({
            pathName: "json/strings.json",
            useResourceFileType: false,
            mappings: {
                "**/strings.json": {
                    schema: "strings-schema",
                    method: "copy",
                    template: "resources/[localeDir]/strings.json"
                }
            }
        });

        jsonFile.parse('{\n' +
            '    "greeting": "Hello"\n' +
            '}');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "resfiletype-test",
            key: "greeting",
            source: "Hello",
            sourceLocale: "en-US",
            target: "Bonjour",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        jsonFile.localize(translations, ["fr-FR"]);

        var outputPath = path.join(base, "testfiles/resources/fr/FR/strings.json");
        outputPaths.push(outputPath);

        expect(fs.existsSync(outputPath)).toBe(true);

        var content = fs.readFileSync(outputPath, "utf-8");

        expect(content).toMatchSnapshot();
    });

    test("JsonFile localize skips source locale when using resourceFileType", function () {
        expect.assertions(2);

        var { jsonFile, resFileType } = setupTestWithResourceFileType({
            pathName: "json/strings.json",
            useResourceFileType: true,
            mappings: {
                "**/strings.json": {
                    schema: "strings-schema",
                    method: "copy",
                    template: "resources/[localeDir]/strings.json"
                }
            }
        });

        jsonFile.parse('{\n' +
            '    "greeting": "Hello"\n' +
            '}');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "resfiletype-test",
            key: "greeting",
            source: "Hello",
            sourceLocale: "en-US",
            target: "Bonjour",
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        // Include the source locale - it should be skipped
        jsonFile.localize(translations, ["en-US", "fr-FR"]);

        // Now write out the resource files
        resFileType.write();

        // fr-FR file should exist (resource file type determines path)
        var frPath = path.join(base, "testfiles/resources/fr-FR.json");
        outputPaths.push(frPath);
        expect(fs.existsSync(frPath)).toBe(true);

        // en-US file should NOT exist (source locale skipped)
        var enPath = path.join(base, "testfiles/resources/en-US.json");
        outputPaths.push(enPath);
        expect(fs.existsSync(enPath)).toBe(false);
    });

    test("JsonFile localize with resourceFileType handles multiple locales", function () {
        expect.assertions(4);

        var { jsonFile, resFileType } = setupTestWithResourceFileType({
            pathName: "json/strings.json",
            useResourceFileType: true,
            mappings: {
                "**/strings.json": {
                    schema: "strings-schema",
                    method: "copy",
                    template: "resources/[localeDir]/strings.json"
                }
            }
        });

        jsonFile.parse('{\n' +
            '    "greeting": "Hello"\n' +
            '}');

        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "resfiletype-test",
            key: "greeting",
            source: "Hello",
            sourceLocale: "en-US",
            target: "Bonjour",
            targetLocale: "fr-FR",
            datatype: "json"
        }));
        translations.add(new ResourceString({
            project: "resfiletype-test",
            key: "greeting",
            source: "Hello",
            sourceLocale: "en-US",
            target: "Hallo",
            targetLocale: "de-DE",
            datatype: "json"
        }));

        jsonFile.localize(translations, ["fr-FR", "de-DE"]);

        resFileType.write();

        // Resource file type determines paths based on its configuration
        var frPath = path.join(base, "testfiles/resources/fr-FR.json");
        var dePath = path.join(base, "testfiles/resources/de-DE.json");
        outputPaths.push(frPath);
        outputPaths.push(dePath);

        expect(fs.existsSync(frPath)).toBe(true);
        expect(fs.existsSync(dePath)).toBe(true);

        var frContent = fs.readFileSync(frPath, "utf-8");
        var deContent = fs.readFileSync(dePath, "utf-8");

        expect(frContent).toMatchSnapshot();
        expect(deContent).toMatchSnapshot();
    });

    test("JsonFile localize delegates ResourcePlural to resourceFileType", function () {
        expect.assertions(2);

        var { jsonFile, resFileType } = setupTestWithResourceFileType({
            pathName: "json/messages.json",
            useResourceFileType: true,
            mappings: {
                "**/messages.json": {
                    schema: "http://github.com/ilib-js/messages.json",
                    method: "copy",
                    template: "resources/[localeDir]/messages.json"
                }
            }
        });

        // JSON structure must match the messages-schema.json which expects plurals under "plurals" property
        jsonFile.parse('{\n' +
            '    "plurals": {\n' +
            '        "items": {\n' +
            '            "one": "one item",\n' +
            '            "other": "many items"\n' +
            '        }\n' +
            '    }\n' +
            '}');

        var translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "resfiletype-test",
            key: "plurals/items",
            sourceStrings: {
                "one": "one item",
                "other": "many items"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "un élément",
                "other": "plusieurs éléments"
            },
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        jsonFile.localize(translations, ["fr-FR"]);

        resFileType.write();

        // Resource file type determines path based on its configuration
        var outputPath = path.join(base, "testfiles/resources/fr-FR.json");
        outputPaths.push(outputPath);

        expect(fs.existsSync(outputPath)).toBe(true);

        var content = fs.readFileSync(outputPath, "utf-8");

        // Verify plural translations are present
        expect(content).toMatchSnapshot();
    });

    test("JsonFile localize delegates ResourceArray to resourceFileType", function () {
        expect.assertions(2);

        var { jsonFile, resFileType } = setupTestWithResourceFileType({
            pathName: "json/arrays.json",
            useResourceFileType: true,
            mappings: {
                "**/arrays.json": {
                    schema: "http://github.com/ilib-js/arrays.json",
                    method: "copy",
                    template: "resources/[localeDir]/arrays.json"
                }
            }
        });

        // JSON structure must match the arrays-schema.json which expects arrays under "strings" property
        jsonFile.parse('{\n' +
            '    "strings": ["red", "green", "blue"]\n' +
            '}');

        var translations = new TranslationSet();
        translations.add(new ResourceArray({
            project: "resfiletype-test",
            key: "strings",
            sourceArray: ["red", "green", "blue"],
            sourceLocale: "en-US",
            targetArray: ["rouge", "vert", "bleu"],
            targetLocale: "fr-FR",
            datatype: "json"
        }));

        jsonFile.localize(translations, ["fr-FR"]);

        resFileType.write();

        // Resource file type determines path based on its configuration
        var outputPath = path.join(base, "testfiles/resources/fr-FR.json");
        outputPaths.push(outputPath);

        expect(fs.existsSync(outputPath)).toBe(true);

        var content = fs.readFileSync(outputPath, "utf-8");

        expect(content).toMatchSnapshot();
    });

    test("JsonFile localize with resourceFileType falls back to source for missing plural translation", function () {
        expect.assertions(2);

        var { jsonFile, resFileType } = setupTestWithResourceFileType({
            pathName: "json/messages.json",
            useResourceFileType: true,
            mappings: {
                "**/messages.json": {
                    schema: "http://github.com/ilib-js/messages.json",
                    method: "copy",
                    template: "resources/[localeDir]/messages.json"
                }
            }
        });

        // JSON structure must match the messages-schema.json
        jsonFile.parse('{\n' +
            '    "plurals": {\n' +
            '        "items": {\n' +
            '            "one": "one item",\n' +
            '            "other": "many items"\n' +
            '        }\n' +
            '    }\n' +
            '}');

        // Empty translation set - no translations available
        var translations = new TranslationSet();

        jsonFile.localize(translations, ["fr-FR"]);

        resFileType.write();

        // Resource file type determines path based on its configuration
        var outputPath = path.join(base, "testfiles/resources/fr-FR.json");
        outputPaths.push(outputPath);

        expect(fs.existsSync(outputPath)).toBe(true);

        var content = fs.readFileSync(outputPath, "utf-8");

        expect(content).toMatchSnapshot();
    });

    test("JsonFile localize with resourceFileType falls back to source for missing array translation", function () {
        expect.assertions(2);

        var { jsonFile, resFileType } = setupTestWithResourceFileType({
            pathName: "json/arrays.json",
            useResourceFileType: true,
            mappings: {
                "**/arrays.json": {
                    schema: "http://github.com/ilib-js/arrays.json",
                    method: "copy",
                    template: "resources/[localeDir]/arrays.json"
                }
            }
        });

        // JSON structure must match the arrays-schema.json
        jsonFile.parse('{\n' +
            '    "strings": ["red", "green", "blue"]\n' +
            '}');

        // Empty translation set - no translations available
        var translations = new TranslationSet();

        jsonFile.localize(translations, ["fr-FR"]);

        resFileType.write();

        // Resource file type determines path based on its configuration
        var outputPath = path.join(base, "testfiles/resources/fr-FR.json");
        outputPaths.push(outputPath);

        expect(fs.existsSync(outputPath)).toBe(true);

        var content = fs.readFileSync(outputPath, "utf-8");

        expect(content).toMatchSnapshot();
    });

});
