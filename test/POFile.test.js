/*
 * POFile.test.js - test the po and pot file handler object.
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

if (!POFile) {
    var POFile = require("../POFile.js");
    var POFileType = require("../POFileType.js");

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
        path.join(process.cwd(), "POFileType")
    ]
}, "./test/testfiles", {
    locales:["en-GB"],
    targetDir: ".",
    nopseudo: true,
    localeMap: {
        "nb-NO": "nb"
    },
    po: {
        mappings: {
            "**/messages.po": {
                "template": "resources/[locale].po"
            },
            "**/template.po": {
                "template": "resources/template_[locale].po",
                "headerLocale": "abbreviated"
            },
            "**/*.pot": {
                "template": "[dir]/[locale].po",
                "headerLocale": "full",
                "localeMap": {
                    "ru-RU": "ru",
                    "fr-FR": "fr"
                }
            },
            "**/ignore1.po": {
                "template": "[dir]/[locale].po",
                "ignoreComments": true
            },
            "**/ignore2.po": {
                "template": "[dir]/[locale].po",
                "ignoreComments": ["paths", "flags"]
            },
            "**/context.po": {
                "template": "[dir]/[locale].po",
                "contextInKey": true
            },
            "**/*.po": {
                "template": "[dir]/[locale].po",
                "localeMap": {
                    "nb-NO": "no",
                    "zh-Hant-TW": "zh-Hant",
                    "zh-Hant-HK": "zh-HK",
                    "fr-FR": "fr_Latn_FR"
                }
            }
        }
    }
});
var t = new POFileType(p);

var p2 = new CustomProject({
    name: "foo",
    id: "foo",
    sourceLocale: "en-US",
    plugins: [
        path.join(process.cwd(), "POFileType")
    ]
}, "./test/testfiles", {
    locales:["en-GB"],
    identify: true,
    targetDir: "testfiles",
    nopseudo: false,
    po: {
        mappings: {
            "**/messages.po": {
                "template": "resources/[locale].po"
            }
        }
    }
});

var t2 = new POFileType(p2);

describe("pofile", function() {
    test("POInit", function() {
        p.init(function() {
        });
    });

    test("POFileConstructor", function() {
        expect.assertions(1);

        var pof = new POFile({project: p, type: t});
        expect(pof).toBeTruthy();
    });

    test("POFileConstructorParams", function() {
        expect.assertions(1);

        var pof = new POFile({
            project: p,
            pathName: "./testfiles/po/messages.po",
            type: t
        });

        expect(pof).toBeTruthy();
    });

    test("POFileConstructorNoFile", function() {
        expect.assertions(1);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();
    });

    test("POFileSourceLocaleGiven", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            sourceLocale: "en-US",
            type: t
        });
        expect(pof).toBeTruthy();

        expect(pof.getSourceLocale()).toBe("en-US");
    });

    test("POFileSourceLocaleDefault", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        expect(pof.getSourceLocale()).toBe("en-US");
    });

    test("POFileTargetLocaleGiven", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            locale: "de-DE",
            type: t
        });
        expect(pof).toBeTruthy();

        expect(pof.getTargetLocale()).toBe("de-DE");
    });

    test("POFileTargetLocaleInferredFromPath", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            pathName: "resources/de-DE.po",
            type: t
        });
        expect(pof).toBeTruthy();

        expect(pof.getTargetLocale()).toBe("de-DE");
    });

    test("POFileParseSimple", function() {
        expect.assertions(6);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string 1"\n');

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("foo", "", "en-US", "string 1", "po"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("string 1");
        expect(r.getKey()).toBe("string 1");
        expect(r.getType()).toBe("string");
    });

    test("POFileParseWithContext", function() {
        expect.assertions(7);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgctxt "context 1"\n' +
            'msgid "string 1"\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("foo", "context 1", "en-US", "string 1", "po"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("string 1");
        expect(r.getKey()).toBe("string 1");
        expect(r.getType()).toBe("string");
        expect(r.getContext()).toBe("context 1");
    });

    test("POFileParseSimpleWithTranslation", function() {
        expect.assertions(9);

        var pof = new POFile({
            project: p,
            locale: "de-DE",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string 1"\n' +
            'msgstr "this is string one"\n');

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("foo", "", "de-DE", "string 1", "po"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("string 1");
        expect(r.getSourceLocale()).toBe("en-US");
        expect(r.getKey()).toBe("string 1");
        expect(r.getTarget()).toBe("this is string one");
        expect(r.getTargetLocale()).toBe("de-DE");
        expect(r.getType()).toBe("string");
    });

    test("POFileParseSimpleRightStrings", function() {
        expect.assertions(10);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string 1"\n' +
            'msgstr "this is string one"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr "this is string two"\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getTarget()).toBe("this is string one");

        expect(resources[1].getSource()).toBe("string 2");
        expect(resources[1].getKey()).toBe("string 2");
        expect(resources[1].getTarget()).toBe("this is string two");
    });

    test("POFileParsePluralString", function() {
        expect.assertions(9);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getType()).toBe("plural");
        var strings = resources[0].getSourcePlurals();
        expect(strings.one).toBe("one object");
        expect(strings.other).toBe("{$count} objects");
        expect(resources[0].getKey()).toBe("one object");
        expect(!resources[0].getTargetPlurals()).toBeTruthy();
    });

    test("POFileParsePluralStringWithTranslations", function() {
        expect.assertions(12);

        var pof = new POFile({
            project: p,
            locale: "de-DE",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n' +
            'msgstr[0] "Ein Objekt"\n' +
            'msgstr[1] "{$count} Objekten"\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getType()).toBe("plural");
        var strings = resources[0].getSourcePlurals();
        expect(strings.one).toBe("one object");
        expect(strings.other).toBe("{$count} objects");
        expect(resources[0].getKey()).toBe("one object");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        strings = resources[0].getTargetPlurals();
        expect(strings.one).toBe("Ein Objekt");
        expect(strings.other).toBe("{$count} Objekten");
        expect(resources[0].getTargetLocale()).toBe("de-DE");
    });

    test("POFileParsePluralStringWithEmptyTranslations", function() {
        expect.assertions(11);

        var pof = new POFile({
            project: p,
            locale: "de-DE",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n' +
            'msgstr[0] ""\n' +
            'msgstr[1] ""\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getType()).toBe("plural");
        var strings = resources[0].getSourcePlurals();
        expect(strings.one).toBe("one object");
        expect(strings.other).toBe("{$count} objects");
        expect(resources[0].getKey()).toBe("one object");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(!resources[0].getTargetPlurals()).toBeTruthy();
        expect(!resources[0].getTargetLocale()).toBeTruthy();
    });

    test("POFileParsePluralStringWithTranslationsRussian", function() {
        expect.assertions(13);

        var pof = new POFile({
            project: p,
            locale: "ru-RU",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n' +
            'msgstr[0] "{$count} объект"\n' +
            'msgstr[1] "{$count} объекта"\n' +
            'msgstr[2] "{$count} объектов"\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getType()).toBe("plural");
        var strings = resources[0].getSourcePlurals();
        expect(strings.one).toBe("one object");
        expect(strings.other).toBe("{$count} objects");
        expect(resources[0].getKey()).toBe("one object");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        strings = resources[0].getTargetPlurals();
        expect(strings.one).toBe("{$count} объект");
        expect(strings.few).toBe("{$count} объекта");
        expect(strings.other).toBe("{$count} объектов");
        expect(resources[0].getTargetLocale()).toBe("ru-RU");
    });

    test("POFileParseSimpleLineContinuations", function() {
        expect.assertions(7);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string 1"\n' +
            '" and more string 1"\n' +
            'msgstr "this is string one "\n' +
            '"or the translation thereof. "\n' +
            '"Next line."\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1 and more string 1");
        expect(resources[0].getKey()).toBe("string 1 and more string 1");
        expect(resources[0].getTarget()).toBe("this is string one or the translation thereof. Next line.");
    });

    test("POFileParseSimpleLineContinuationsWithEmptyString", function() {
        expect.assertions(7);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid ""\n' +
            '"string 1"\n' +
            '" and more string 1"\n' +
            'msgstr ""\n' +
            '"this is string one "\n' +
            '"or the translation thereof. "\n' +
            '"Next line."\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1 and more string 1");
        expect(resources[0].getKey()).toBe("string 1 and more string 1");
        expect(resources[0].getTarget()).toBe("this is string one or the translation thereof. Next line.");
    });

    test("POFileParseEscapedQuotes", function() {
        expect.assertions(6);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string \\"quoted\\" 1"\n');

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("foo", "", "en-US", 'string "quoted" 1', "po"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe('string "quoted" 1');
        expect(r.getKey()).toBe('string "quoted" 1');
        expect(r.getType()).toBe('string');
    });

    test("POFileParseEmptyTranslation", function() {
        expect.assertions(12);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        // only source strings
        pof.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(!resources[0].getTarget()).toBeTruthy();
        expect(!resources[0].getTargetLocale()).toBeTruthy();

        expect(resources[1].getSource()).toBe("string 2");
        expect(resources[1].getKey()).toBe("string 2");
        expect(!resources[1].getTarget()).toBeTruthy();
        expect(!resources[1].getTargetLocale()).toBeTruthy();
    });

    test("POFileParseEmptySource", function() {
        expect.assertions(3);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid ""\n' +
            'msgstr "string 1"\n' +
            '\n' +
            'msgid ""\n' +
            'msgstr "string 2"\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        // no source = no string to translate!
        expect(set.size()).toBe(0);
    });

    test("POFileParseFileHeader", function() {
        expect.assertions(3);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            '#, fuzzy\n' +
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  messages.pot  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        // no source = no string to translate!
        expect(set.size()).toBe(0);
    });

    test("POFileParseDupString", function() {
        expect.assertions(8);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        // only source strings
        pof.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(!resources[0].getTarget()).toBeTruthy();
        expect(!resources[0].getTargetLocale()).toBeTruthy();
    });

    test("POFileParseSameStringDifferentContext", function() {
        expect.assertions(14);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        // only source strings
        pof.parse(
            'msgctxt "context 1"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgctxt "context 2"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getContext()).toBe("context 1");
        expect(!resources[0].getTarget()).toBeTruthy();
        expect(!resources[0].getTargetLocale()).toBeTruthy();

        expect(resources[1].getSource()).toBe("string 1");
        expect(resources[1].getKey()).toBe("string 1");
        expect(resources[1].getContext()).toBe("context 2");
        expect(!resources[1].getTarget()).toBeTruthy();
        expect(!resources[1].getTargetLocale()).toBeTruthy();
    });

    test("POFileParseSameStringContextInKey", function() {
        expect.assertions(14);

        var pof = new POFile({
            project: p,
            pathName: "foo/bar/context.po",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgctxt "context 1"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgctxt "context 2"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1 --- context 1");
        expect(resources[0].getContext()).toBe("context 1");
        expect(!resources[0].getTarget()).toBeTruthy();
        expect(!resources[0].getTargetLocale()).toBeTruthy();

        expect(resources[1].getSource()).toBe("string 1");
        expect(resources[1].getKey()).toBe("string 1 --- context 2");
        expect(resources[1].getContext()).toBe("context 2");
        expect(!resources[1].getTarget()).toBeTruthy();
        expect(!resources[1].getTargetLocale()).toBeTruthy();
    });

    test("POFileParseTestInvalidPO", function() {
        expect.assertions(2);

        // when it's named messages.po, it should apply the messages-schema schema
        var pof = new POFile({
            project: p,
            pathName: "i18n/deep.po",
            type: t
        });
        expect(pof).toBeTruthy();

        expect(function(test) {
            // that's not a po file!
            pof.parse(
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

    test("POFileParseExtractComments", function() {
        expect.assertions(12);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            '# translator\'s comments\n' +
            '#: src/foo.html:32 src/bar.html:234\n' +
            '#. This is comments from the engineer to the translator for string 1.\n' +
            '#, c-format\n' +
            '#| str 1\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            '# translator\'s comments 2\n' +
            '#: src/bar.html:644 src/asdf.html:232\n' +
            '#. This is comments from the engineer to the translator for string 2.\n' +
            '#, javascript-format,gcc-internal-format\n' +
            '#| str 2\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getComment()).toBe('{"translator":["translator\'s comments"],' +
             '"paths":["src/foo.html:32 src/bar.html:234"],' +
             '"extracted":["This is comments from the engineer to the translator for string 1."],' +
             '"flags":["c-format"],' +
             '"previous":["str 1"]}');
        expect(resources[0].getPath()).toBe("src/foo.html");

        expect(resources[1].getSource()).toBe("string 2");
        expect(resources[1].getKey()).toBe("string 2");
        expect(resources[1].getComment()).toBe('{"translator":["translator\'s comments 2"],' +
             '"paths":["src/bar.html:644 src/asdf.html:232"],' +
             '"extracted":["This is comments from the engineer to the translator for string 2."],' +
             '"flags":["javascript-format,gcc-internal-format"],' +
             '"previous":["str 2"]}');
        expect(resources[1].getPath()).toBe("src/bar.html");
    });

    test("POFileParseExtractFileNameNoLineNumbers", function() {
        expect.assertions(12);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            '#: src/foo.html src/bar.html\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            '#: src/bar.html\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getComment()).toBe('{"paths":["src/foo.html src/bar.html"]}');
        expect(resources[0].getPath()).toBe("src/foo.html");

        expect(resources[1].getSource()).toBe("string 2");
        expect(resources[1].getKey()).toBe("string 2");
        expect(resources[1].getComment()).toBe('{"paths":["src/bar.html"]}');
        expect(resources[1].getPath()).toBe("src/bar.html");
    });

    test("POFileParseClearComments", function() {
        expect.assertions(12);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            '# translator\'s comments\n' +
            '#: src/foo.html:32\n' +
            '#. This is comments from the engineer to the translator for string 1.\n' +
            '#, c-format\n' +
            '#| str 1\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getComment()).toBe('{"translator":["translator\'s comments"],' +
             '"paths":["src/foo.html:32"],' +
             '"extracted":["This is comments from the engineer to the translator for string 1."],' +
             '"flags":["c-format"],' +
             '"previous":["str 1"]}');
        expect(resources[0].getPath()).toBe("src/foo.html");

        // comments for string 1 should not carry over to string 2
        expect(resources[1].getSource()).toBe("string 2");
        expect(resources[1].getKey()).toBe("string 2");
        expect(!resources[1].getComment()).toBeTruthy();
        expect(!resources[1].getPath()).toBeTruthy();
    });

    test("POFileParseExtractMultiplePaths", function() {
        expect.assertions(8);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            '#: src/foo.html:32\n' +
            '#: src/bar.html:32\n' +
            '#: src/asdf.html:32\n' +
            '#: src/xyz.html:32\n' +
            '#: src/abc.html:32\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getComment()).toBe('{"paths":["src/foo.html:32","src/bar.html:32","src/asdf.html:32","src/xyz.html:32","src/abc.html:32"]}');
        expect(resources[0].getPath()).toBe("src/foo.html");
    });

    test("POFileParseExtractMultipleComments", function() {
        expect.assertions(7);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            '# translator\'s comments 1\n' +
            '# translator\'s comments 2\n' +
            '#. This is comments from the engineer to the translator for string 1.\n' +
            '#. This is more comments from the engineer to the translator for string 1.\n' +
            '#, c-format\n' +
            '#, javascript-format\n' +
            '#| str 1\n' +
            '#| str 2\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getComment()).toBe('{"translator":["translator\'s comments 1","translator\'s comments 2"],' +
             '"extracted":["This is comments from the engineer to the translator for string 1.",'+
             '"This is more comments from the engineer to the translator for string 1."],' +
             '"flags":["c-format","javascript-format"],' +
             '"previous":["str 1","str 2"]}');
    });

    test("POFileParseIgnoreComments", function() {
        expect.assertions(7);

        var pof = new POFile({
            project: p,
            type: t,
            pathName: "foo/bar/ignore2.po"   // picks the right mapping
        });
        expect(pof).toBeTruthy();

        pof.parse(
            '# translator\'s comments 1\n' +
            '# translator\'s comments 2\n' +
            '#. This is comments from the engineer to the translator for string 1.\n' +
            '#. This is more comments from the engineer to the translator for string 1.\n' +
            '#, c-format\n' +
            '#, javascript-format\n' +
            '#| str 1\n' +
            '#| str 2\n' +
            '#: path1.py:234\n' +
            '#: asdf/path2.py:868\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getComment()).toBe('{"translator":["translator\'s comments 1","translator\'s comments 2"],' +
             '"extracted":["This is comments from the engineer to the translator for string 1.",'+
             '"This is more comments from the engineer to the translator for string 1."],' +
             '"previous":["str 1","str 2"]}');
    });

    test("POFileParseIgnoreAllComments", function() {
        expect.assertions(7);

        var pof = new POFile({
            project: p,
            type: t,
            pathName: "foo/bar/ignore1.po"   // picks the right mapping
        });
        expect(pof).toBeTruthy();

        pof.parse(
            '# translator\'s comments 1\n' +
            '# translator\'s comments 2\n' +
            '#. This is comments from the engineer to the translator for string 1.\n' +
            '#. This is more comments from the engineer to the translator for string 1.\n' +
            '#, c-format\n' +
            '#, javascript-format\n' +
            '#| str 1\n' +
            '#| str 2\n' +
            '#: path1.py:234\n' +
            '#: asdf/path2.py:868\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n'
        );

        var set = pof.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(!resources[0].getComment()).toBeTruthy();
    });

    test("POFileExtractFile", function() {
        expect.assertions(17);

        var base = path.dirname(module.id);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        var set = pof.getTranslationSet();

        expect(set.size()).toBe(4);

        var resources = set.getAll();
        expect(resources.length).toBe(4);

        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");

        expect(resources[1].getType()).toBe("plural");
        var categories = resources[1].getSourcePlurals();
        expect(categories).toBeTruthy();
        expect(categories.one).toBe("one string");
        expect(categories.other).toBe("{$count} strings");
        expect(resources[1].getKey()).toBe("one string");

        expect(resources[2].getType()).toBe("string");
        expect(resources[2].getSource()).toBe("string 2");
        expect(resources[2].getKey()).toBe("string 2");

        expect(resources[3].getType()).toBe("string");
        expect(resources[3].getSource()).toBe("string 3 and 4");
        expect(resources[3].getKey()).toBe("string 3 and 4");
    });

    test("POFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var pof = new POFile({
            project: p,
            type: t
        });
        expect(pof).toBeTruthy();

        // should attempt to read the file and not fail
        pof.extract();

        var set = pof.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("POFileExtractBogusFile", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var pof = new POFile({
            project: p,
            pathName: "./po/bogus.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should attempt to read the file and not fail
        pof.extract();

        var set = pof.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("POFileLocalizeTextSimple", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        var actual = pof.localizeText(translations, "fr-FR");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalizeTextMultiple", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "chaîne numéro 2",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        var actual = pof.localizeText(translations, "fr-FR");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr "chaîne numéro 2"\n\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalizeTextPreserveComments", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            '# note for translators\n' +
            '#: src/a/b/c.js:32\n' +
            '#. extracted comment\n' +
            '#, c-format\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "chaîne numéro 2",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        var actual = pof.localizeText(translations, "fr-FR");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            '# note for translators\n' +
            '#. extracted comment\n' +
            '#: src/a/b/c.js:32\n' +
            '#, c-format\n' +
            'msgid "string 2"\n' +
            'msgstr "chaîne numéro 2"\n\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalizeTextPreserveMultipleComments", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            '# note for translators 1\n' +
            '# note for translators 2\n' +
            '#: src/a/b/c.js:32\n' +
            '#: src/a/b/x.js:32\n' +
            '#. extracted comment 1\n' +
            '#. extracted comment 2\n' +
            '#, c-format\n' +
            '#, javascript-format\n' +
            '#| str2\n' +
            '#| string2\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "chaîne numéro 2",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        var actual = pof.localizeText(translations, "fr-FR");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            '# note for translators 1\n' +
            '# note for translators 2\n' +
            '#. extracted comment 1\n' +
            '#. extracted comment 2\n' +
            '#: src/a/b/c.js:32\n' +
            '#: src/a/b/x.js:32\n' +
            '#, c-format\n' +
            '#, javascript-format\n' +
            '#| str2\n' +
            '#| string2\n' +
            'msgid "string 2"\n' +
            'msgstr "chaîne numéro 2"\n\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalizeTextWithEscapedQuotes", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string \\"quoted\\" 1"\n' +
            'msgstr ""\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: 'string "quoted" 1',
            source: "string 1",
            sourceLocale: "en-US",
            target: 'chaîne "numéro" 1',
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        var actual = pof.localizeText(translations, "fr-FR");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string \\"quoted\\" 1"\n' +
            'msgstr "chaîne \\"numéro\\" 1"\n\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalizeTextWithContext", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgctxt "context 1"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgctxt "context 2"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            context: "context 1",
            sourceLocale: "en-US",
            target: "chaîne numéro 1 contexte 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            context: "context 2",
            sourceLocale: "en-US",
            target: "chaîne numéro 2 contexte 2",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        var actual = pof.localizeText(translations, "fr-FR");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgctxt "context 1"\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1 contexte 1"\n' +
            '\n' +
            'msgctxt "context 2"\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 2 contexte 2"\n\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalizeTextWithContextInKey", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/context.po",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgctxt "context 1"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgctxt "context 2"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1 --- context 1",
            source: "string 1",
            sourceLocale: "en-US",
            context: "context 1",
            target: "chaîne numéro 1 contexte 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1 --- context 2",
            source: "string 1",
            sourceLocale: "en-US",
            context: "context 2",
            target: "chaîne numéro 2 contexte 2",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        var actual = pof.localizeText(translations, "fr-FR");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/context.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgctxt "context 1"\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1 contexte 1"\n' +
            '\n' +
            'msgctxt "context 2"\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 2 contexte 2"\n\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalizeTextWithNoActualTranslation", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "string 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "string 2",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        var actual = pof.localizeText(translations, "fr-FR");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalizeTextUsePseudoForMissingTranslations", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p2,
            pathName: "./po/messages.po",
            type: t2
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgid_plural "string 2 plural"\n'
        );

        var translations = new TranslationSet();

        var actual = pof.localizeText(translations, "fr-FR");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "[šţŕíñğ 13210]"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgid_plural "string 2 plural"\n' +
            'msgstr[0] "[šţŕíñğ 23210]"\n' +
            'msgstr[1] "[šţŕíñğ 2 þľüŕàľ76543210]"\n\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalizeTextWithExistingTranslations", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string 1"\n' +
            'msgstr "string 1"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr "string 2"\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "string 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "string 2",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        var actual = pof.localizeText(translations, "fr-FR");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalizeTextPluralsWithNoActualTranslation", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "{$count} object"\n' +
            'msgid_plural "{$count} objects"\n' +
            '\n' +
            'msgid "{$count} item"\n' +
            'msgid_plural "{$count} items"\n'
        );

        var translations = new TranslationSet();
        translations.add(new ResourcePlural({
            project: "foo",
            key: "{$count} object",
            sourceStrings: {
                one: "{$count} object",
                other: "{$count} objects"
            },
            sourceLocale: "en-US",
            targetStrings: {
                one: "{$count} object",
                other: "{$count} objects"
            },
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "{$count} item",
            sourceStrings: {
                one: "{$count} item",
                other: "{$count} items"
            },
            sourceLocale: "en-US",
            targetStrings: {
                one: "{$count} item",
                other: "{$count} items"
            },
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        var actual = pof.localizeText(translations, "fr-FR");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "{$count} object"\n' +
            'msgid_plural "{$count} objects"\n' +
            'msgstr[0] ""\n' +
            'msgstr[1] ""\n' +
            '\n' +
            'msgid "{$count} item"\n' +
            'msgid_plural "{$count} items"\n' +
            'msgstr[0] ""\n' +
            'msgstr[1] ""\n\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalizeTextHeaderLocaleFull", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.pot",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        var actual = pof.localizeText(translations, "fr-FR");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.pot  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalizeTextHeaderLocaleAbbreviated", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/template.po",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        var actual = pof.localizeText(translations, "fr-FR");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/template.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalizeTextHeaderLocaleMapped", function() {
        expect.assertions(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/foo.po",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        var actual = pof.localizeText(translations, "fr-FR");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/foo.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-Latn-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne numéro 1"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalize", function() {
        expect.assertions(7);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr-FR.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de-DE.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))).toBeTruthy();

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "chaîne 2",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "chaîne un",
                "other": "chaîne {$count}"
            },
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            target: "chaîne 3 et 4",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "Zeichenfolge 1",
            targetLocale: "de-DE",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "Zeichenfolge 2",
            targetLocale: "de-DE",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "Zeichenfolge eins",
                "other": "Zeichenfolge {$count}"
            },
            targetLocale: "de-DE",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            target: "Zeichenfolge 3 und 4",
            targetLocale: "de-DE",
            datatype: "po"
        }));

        pof.localize(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))).toBeTruthy();

        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr-FR.po"), "utf-8");

        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            '#: a/b/c.js:32\n' +
            'msgid "string 1"\n' +
            'msgstr "chaîne 1"\n' +
            '\n' +
            '# a plural string\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] "chaîne un"\n' +
            'msgstr[1] "chaîne {$count}"\n' +
            '\n' +
            '# another string\n' +
            'msgid "string 2"\n' +
            'msgstr "chaîne 2"\n' +
            '\n' +
            '# string with continuation\n' +
            'msgid "string 3 and 4"\n' +
            'msgstr "chaîne 3 et 4"\n\n';

        diff(content, expected);
        expect(content).toBe(expected);

        content = fs.readFileSync(path.join(base, "testfiles/resources/de-DE.po"), "utf-8");

        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: de-DE\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n != 1;\\n"\n' +
            '\n' +
            '#: a/b/c.js:32\n' +
            'msgid "string 1"\n' +
            'msgstr "Zeichenfolge 1"\n' +
            '\n' +
            '# a plural string\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] "Zeichenfolge eins"\n' +
            'msgstr[1] "Zeichenfolge {$count}"\n' +
            '\n' +
            '# another string\n' +
            'msgid "string 2"\n' +
            'msgstr "Zeichenfolge 2"\n' +
            '\n' +
            '# string with continuation\n' +
            'msgid "string 3 and 4"\n' +
            'msgstr "Zeichenfolge 3 und 4"\n\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("POFileLocalizeNoTranslations", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr-FR.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de-DE.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))).toBeTruthy();

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        var translations = new TranslationSet();

        pof.localize(translations, ["fr-FR", "de-DE"]);

        // should produce the files, even if there is nothing to localize in them
        expect(fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))).toBeTruthy();
    });

    test("POFileLocalizeExtractNewStrings", function() {
        expect.assertions(20);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr-FR.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de-DE.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))).toBeTruthy();

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // make sure we start off with no new strings
        t.newres.clear();
        expect(t.newres.size()).toBe(0);

        // should read the file
        pof.extract();

        // only translate some of the strings
        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "chaîne un",
                "other": "chaîne {$count}"
            },
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "Zeichenfolge 1",
            targetLocale: "de-DE",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "Zeichenfolge un",
                "other": "Zeichenfolge {$count}"
            },
            targetLocale: "de-DE",
            datatype: "po"
        }));

        pof.localize(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))).toBeTruthy();

        // now verify that the strings which did not have translations show up in the
        // new strings translation set
        expect(t.newres.size()).toBe(4);
        var resources = t.newres.getAll();
        expect(resources.length).toBe(4);

        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getKey()).toBe("string 2");
        expect(resources[0].getTargetLocale()).toBe("fr-FR");

        expect(resources[1].getType()).toBe("string");
        expect(resources[1].getKey()).toBe("string 3 and 4");
        expect(resources[1].getTargetLocale()).toBe("fr-FR");

        expect(resources[2].getType()).toBe("string");
        expect(resources[2].getKey()).toBe("string 2");
        expect(resources[2].getTargetLocale()).toBe("de-DE");

        expect(resources[3].getType()).toBe("string");
        expect(resources[3].getKey()).toBe("string 3 and 4");
        expect(resources[3].getTargetLocale()).toBe("de-DE");
    });

    test("POFileLocalizeWithAlternateFileNameTemplate", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/template_fr-FR.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/template_fr-FR.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/template_de-DE.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/template_de-DE.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/template_fr-FR.po"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/resources/template_de-DE.po"))).toBeTruthy();

        var pof = new POFile({
            project: p,
            pathName: "./po/template.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        // only translate some of the strings
        var translations = new TranslationSet();

        pof.localize(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/template_fr-FR.po"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/template_de-DE.po"))).toBeTruthy();
    });

    test("POFileLocalizeWithAlternateLocaleMapping", function() {
        expect.assertions(3);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "./testfiles/po/no.po"))) {
            fs.unlinkSync(path.join(base, "./testfiles/po/no.po"));
        }

        expect(!fs.existsSync(path.join(base, "./testfiles/po/no.po"))).toBeTruthy();

        var pof = new POFile({
            project: p,
            pathName: "./po/foo.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        var translations = new TranslationSet();

        // should use the locale map in the mapping rather than the shared one
        pof.localize(translations, ["nb-NO"]);

        expect(fs.existsSync(path.join(base, "./testfiles/po/no.po"))).toBeTruthy();
    });

    test("POFileLocalizeWithAlternateLocaleMappingRightContents", function() {
        expect.assertions(4);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "./testfiles/po/no.po"))) {
            fs.unlinkSync(path.join(base, "./testfiles/po/no.po"));
        }

        expect(!fs.existsSync(path.join(base, "./testfiles/po/no.po"))).toBeTruthy();

        var pof = new POFile({
            project: p,
            pathName: "./po/foo.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "streng en",
            targetLocale: "nb-NO",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "streng to",
            targetLocale: "nb-NO",
            datatype: "po"
        }));

        // should use the locale map in the mapping rather than the shared one
        pof.localize(translations, ["nb-NO"]);

        expect(fs.existsSync(path.join(base, "./testfiles/po/no.po"))).toBeTruthy();

        var actual = fs.readFileSync(path.join(base, "./testfiles/po/no.po"), "utf-8");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/foo.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: no\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n != 1;\\n"\n' +
            '\n' +
            '#: a/b/c.js:32\n' +
            'msgid "string 1"\n' +
            'msgstr "streng en"\n' +
            '\n' +
            '# a plural string\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] ""\n' +
            'msgstr[1] ""\n' +
            '\n' +
            '# another string\n' +
            'msgid "string 2"\n' +
            'msgstr "streng to"\n' +
            '\n' +
            '# string with continuation\n' +
            'msgid "string 3 and 4"\n' +
            'msgstr ""\n\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalizeWithSharedLocaleMapping", function() {
        expect.assertions(3);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/template_nb.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/template_nb.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/template_nb.po"))).toBeTruthy();

        var pof = new POFile({
            project: p,
            pathName: "./po/template.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        var translations = new TranslationSet();

        // should use the shared locale map because there isn't one in the mapping
        pof.localize(translations, ["nb-NO"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/template_nb.po"))).toBeTruthy();
    });

    test("POFileLocalizeWithSharedLocaleMappingRightContents", function() {
        expect.assertions(4);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/template_nb.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/template_nb.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/template_nb.po"))).toBeTruthy();

        var pof = new POFile({
            project: p,
            pathName: "./po/template.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "streng en",
            targetLocale: "nb-NO",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "streng to",
            targetLocale: "nb-NO",
            datatype: "po"
        }));

        // should use the shared locale map because there isn't one in the mapping
        pof.localize(translations, ["nb-NO"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/template_nb.po"))).toBeTruthy();

        var actual = fs.readFileSync(path.join(base, "testfiles/resources/template_nb.po"), "utf-8");
        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/template.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: nb\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n != 1;\\n"\n' +
            '\n' +
            '#: a/b/c.js:32\n' +
            'msgid "string 1"\n' +
            'msgstr "streng en"\n' +
            '\n' +
            '# a plural string\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] ""\n' +
            'msgstr[1] ""\n' +
            '\n' +
            '# another string\n' +
            'msgid "string 2"\n' +
            'msgstr "streng to"\n' +
            '\n' +
            '# string with continuation\n' +
            'msgid "string 3 and 4"\n' +
            'msgstr ""\n\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("POFileLocalizeDefaultTemplate", function() {
        expect.assertions(4);

        var base = path.dirname(module.id);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(pof).toBeTruthy();

        pof.parse(
            'msgid "string 1"\n' +
            '\n' +
            'msgid "string 2"\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "C'est la chaîne numéro 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        // default template is resources/[localeDir]/[filename]
        if (fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr-FR.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))).toBeTruthy();

        pof.localize(translations, ["fr-FR"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))).toBeTruthy();

        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr-FR.po"), "utf-8");

        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: fr-FR\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "C\'est la chaîne numéro 1"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("POFileExtractLocalizedFiles", function() {
        expect.assertions(65);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr-FR.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de-DE.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))).toBeTruthy();

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "chaîne 2",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "chaîne un",
                "other": "chaîne {$count}"
            },
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            target: "chaîne 3 et 4",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "Zeichenfolge 1",
            targetLocale: "de-DE",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "Zeichenfolge 2",
            targetLocale: "de-DE",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "Zeichenfolge eins",
                "other": "Zeichenfolge {$count}"
            },
            targetLocale: "de-DE",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            target: "Zeichenfolge 3 und 4",
            targetLocale: "de-DE",
            datatype: "po"
        }));

        pof.localize(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))).toBeTruthy();

        pof = new POFile({
            project: p,
            pathName: "./resources/fr-FR.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        // now verify that the resources it created have the right target locale
        // based on the file name

        var set = pof.getTranslationSet();

        expect(set.size()).toBe(4);

        var resources = set.getAll();
        expect(resources.length).toBe(4);

        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getTarget()).toBe("chaîne 1");
        expect(resources[0].getTargetLocale()).toBe("fr-FR");

        expect(resources[1].getType()).toBe("plural");
        var categories = resources[1].getSourcePlurals();
        expect(categories).toBeTruthy();
        expect(categories.one).toBe("one string");
        expect(categories.other).toBe("{$count} strings");
        expect(resources[1].getKey()).toBe("one string");
        expect(resources[1].getSourceLocale()).toBe("en-US");
        categories = resources[1].getTargetPlurals();
        expect(categories.one).toBe("chaîne un");
        expect(categories.other).toBe("chaîne {$count}");
        expect(resources[1].getTargetLocale()).toBe("fr-FR");

        expect(resources[2].getType()).toBe("string");
        expect(resources[2].getSource()).toBe("string 2");
        expect(resources[2].getKey()).toBe("string 2");
        expect(resources[2].getSourceLocale()).toBe("en-US");
        expect(resources[2].getTarget()).toBe("chaîne 2");
        expect(resources[2].getTargetLocale()).toBe("fr-FR");

        expect(resources[3].getType()).toBe("string");
        expect(resources[3].getSource()).toBe("string 3 and 4");
        expect(resources[3].getKey()).toBe("string 3 and 4");
        expect(resources[3].getSourceLocale()).toBe("en-US");
        expect(resources[3].getTarget()).toBe("chaîne 3 et 4");
        expect(resources[3].getTargetLocale()).toBe("fr-FR");

        pof = new POFile({
            project: p,
            pathName: "./resources/de-DE.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        // now verify that the resources it created have the right target locale
        // based on the file name

        var set = pof.getTranslationSet();

        expect(set.size()).toBe(4);

        resources = set.getAll();
        expect(resources.length).toBe(4);

        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getTarget()).toBe("Zeichenfolge 1");
        expect(resources[0].getTargetLocale()).toBe("de-DE");

        expect(resources[1].getType()).toBe("plural");
        var categories = resources[1].getSourcePlurals();
        expect(categories).toBeTruthy();
        expect(categories.one).toBe("one string");
        expect(categories.other).toBe("{$count} strings");
        expect(resources[1].getKey()).toBe("one string");
        expect(resources[1].getSourceLocale()).toBe("en-US");
        categories = resources[1].getTargetPlurals();
        expect(categories.one).toBe("Zeichenfolge eins");
        expect(categories.other).toBe("Zeichenfolge {$count}");
        expect(resources[1].getTargetLocale()).toBe("de-DE");

        expect(resources[2].getType()).toBe("string");
        expect(resources[2].getSource()).toBe("string 2");
        expect(resources[2].getKey()).toBe("string 2");
        expect(resources[2].getSourceLocale()).toBe("en-US");
        expect(resources[2].getTarget()).toBe("Zeichenfolge 2");
        expect(resources[2].getTargetLocale()).toBe("de-DE");

        expect(resources[3].getType()).toBe("string");
        expect(resources[3].getSource()).toBe("string 3 and 4");
        expect(resources[3].getKey()).toBe("string 3 and 4");
        expect(resources[3].getSourceLocale()).toBe("en-US");
        expect(resources[3].getTarget()).toBe("Zeichenfolge 3 und 4");
        expect(resources[3].getTargetLocale()).toBe("de-DE");
    });

    test("POFileExtractLocalizedFilesNoMappings", function() {
        expect.assertions(67);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/po/fr-FR.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/fr-FR.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/po/de-DE.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/de-DE.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/po/fr-FR.po"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/po/de-DE.po"))).toBeTruthy();

        // custom project with no mappings should force it to use the default
        // mappings to get the target locale
        var p2 = new CustomProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US",
            plugins: [
                path.join(process.cwd(), "POFileType")
            ]
        }, "./test/testfiles", {
            locales:["en-GB"],
            targetDir: ".",
        });
        var t2 = new POFileType(p2);

        var pof = new POFile({
            project: p2,
            pathName: "./po/messages.po",
            type: t2
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "chaîne 1",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "chaîne 2",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "chaîne un",
                "other": "chaîne {$count}"
            },
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            target: "chaîne 3 et 4",
            targetLocale: "fr-FR",
            datatype: "po"
        }));

        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "Zeichenfolge 1",
            targetLocale: "de-DE",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "Zeichenfolge 2",
            targetLocale: "de-DE",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "Zeichenfolge eins",
                "other": "Zeichenfolge {$count}"
            },
            targetLocale: "de-DE",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            target: "Zeichenfolge 3 und 4",
            targetLocale: "de-DE",
            datatype: "po"
        }));

        expect(!fs.existsSync(path.join(base, "testfiles/po/fr-FR.po"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/po/de-DE.po"))).toBeTruthy();

        pof.localize(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/po/fr-FR.po"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/po/de-DE.po"))).toBeTruthy();

        pof = new POFile({
            project: p,
            pathName: "./po/fr-FR.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        // now verify that the resources it created have the right target locale
        // based on the file name

        var set = pof.getTranslationSet();

        expect(set.size()).toBe(4);

        var resources = set.getAll();
        expect(resources.length).toBe(4);

        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getTarget()).toBe("chaîne 1");
        expect(resources[0].getTargetLocale()).toBe("fr-FR");

        expect(resources[1].getType()).toBe("plural");
        var categories = resources[1].getSourcePlurals();
        expect(categories).toBeTruthy();
        expect(categories.one).toBe("one string");
        expect(categories.other).toBe("{$count} strings");
        expect(resources[1].getKey()).toBe("one string");
        expect(resources[1].getSourceLocale()).toBe("en-US");
        categories = resources[1].getTargetPlurals();
        expect(categories.one).toBe("chaîne un");
        expect(categories.other).toBe("chaîne {$count}");
        expect(resources[1].getTargetLocale()).toBe("fr-FR");

        expect(resources[2].getType()).toBe("string");
        expect(resources[2].getSource()).toBe("string 2");
        expect(resources[2].getKey()).toBe("string 2");
        expect(resources[2].getSourceLocale()).toBe("en-US");
        expect(resources[2].getTarget()).toBe("chaîne 2");
        expect(resources[2].getTargetLocale()).toBe("fr-FR");

        expect(resources[3].getType()).toBe("string");
        expect(resources[3].getSource()).toBe("string 3 and 4");
        expect(resources[3].getKey()).toBe("string 3 and 4");
        expect(resources[3].getSourceLocale()).toBe("en-US");
        expect(resources[3].getTarget()).toBe("chaîne 3 et 4");
        expect(resources[3].getTargetLocale()).toBe("fr-FR");

        pof = new POFile({
            project: p,
            pathName: "./po/de-DE.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        // now verify that the resources it created have the right target locale
        // based on the file name

        var set = pof.getTranslationSet();

        expect(set.size()).toBe(4);

        resources = set.getAll();
        expect(resources.length).toBe(4);

        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getTarget()).toBe("Zeichenfolge 1");
        expect(resources[0].getTargetLocale()).toBe("de-DE");

        expect(resources[1].getType()).toBe("plural");
        var categories = resources[1].getSourcePlurals();
        expect(categories).toBeTruthy();
        expect(categories.one).toBe("one string");
        expect(categories.other).toBe("{$count} strings");
        expect(resources[1].getKey()).toBe("one string");
        expect(resources[1].getSourceLocale()).toBe("en-US");
        categories = resources[1].getTargetPlurals();
        expect(categories.one).toBe("Zeichenfolge eins");
        expect(categories.other).toBe("Zeichenfolge {$count}");
        expect(resources[1].getTargetLocale()).toBe("de-DE");

        expect(resources[2].getType()).toBe("string");
        expect(resources[2].getSource()).toBe("string 2");
        expect(resources[2].getKey()).toBe("string 2");
        expect(resources[2].getSourceLocale()).toBe("en-US");
        expect(resources[2].getTarget()).toBe("Zeichenfolge 2");
        expect(resources[2].getTargetLocale()).toBe("de-DE");

        expect(resources[3].getType()).toBe("string");
        expect(resources[3].getSource()).toBe("string 3 and 4");
        expect(resources[3].getKey()).toBe("string 3 and 4");
        expect(resources[3].getSourceLocale()).toBe("en-US");
        expect(resources[3].getTarget()).toBe("Zeichenfolge 3 und 4");
        expect(resources[3].getTargetLocale()).toBe("de-DE");
    });

    test("POFileExtractLocalizedFilesNoMappingsRussian", function() {
        expect.assertions(35);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/ru-RU.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        // custom project with no mappings should force it to use the default
        // mappings to get the target locale
        var p2 = new CustomProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US",
            plugins: [
                path.join(process.cwd(), "POFileType")
            ]
        }, "./test/testfiles", {
            locales:["en-GB"],
            targetDir: ".",
        });
        var t2 = new POFileType(p2);

        var pof = new POFile({
            project: p2,
            pathName: "./po/messages.po",
            type: t2
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "строка 1",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "строка 2",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "{$count} струна",
                "few": "{$count} струны",
                "other": "{$count} струн"
            },
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            target: "строка 3 и 4",
            targetLocale: "ru-RU",
            datatype: "po"
        }));

        expect(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        pof.localize(translations, ["ru-RU"]);

        expect(fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        pof = new POFile({
            project: p,
            pathName: "./po/ru-RU.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        // now verify that the resources it created have the right target locale
        // based on the file name

        var set = pof.getTranslationSet();

        expect(set.size()).toBe(4);

        var resources = set.getAll();
        expect(resources.length).toBe(4);

        expect(resources[0].getType()).toBe("string");
        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getTarget()).toBe("строка 1");
        expect(resources[0].getTargetLocale()).toBe("ru-RU");

        expect(resources[1].getType()).toBe("plural");
        var categories = resources[1].getSourcePlurals();
        expect(categories).toBeTruthy();
        expect(categories.one).toBe("one string");
        expect(categories.other).toBe("{$count} strings");
        expect(resources[1].getKey()).toBe("one string");
        expect(resources[1].getSourceLocale()).toBe("en-US");
        categories = resources[1].getTargetPlurals();
        expect(categories.one).toBe("{$count} струна");
        expect(categories.few).toBe("{$count} струны");
        expect(categories.other).toBe("{$count} струн");
        expect(resources[1].getTargetLocale()).toBe("ru-RU");

        expect(resources[2].getType()).toBe("string");
        expect(resources[2].getSource()).toBe("string 2");
        expect(resources[2].getKey()).toBe("string 2");
        expect(resources[2].getSourceLocale()).toBe("en-US");
        expect(resources[2].getTarget()).toBe("строка 2");
        expect(resources[2].getTargetLocale()).toBe("ru-RU");

        expect(resources[3].getType()).toBe("string");
        expect(resources[3].getSource()).toBe("string 3 and 4");
        expect(resources[3].getKey()).toBe("string 3 and 4");
        expect(resources[3].getSourceLocale()).toBe("en-US");
        expect(resources[3].getTarget()).toBe("строка 3 и 4");
        expect(resources[3].getTargetLocale()).toBe("ru-RU");
    });

    test("POFileWriteSourceOnly", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/ru-RU.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        // custom project with no mappings should force it to use the default
        // mappings to get the target locale
        var p2 = new CustomProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US",
            plugins: [
                path.join(process.cwd(), "POFileType")
            ]
        }, "./test/testfiles", {
            locales:["en-GB"],
            targetDir: ".",
        });
        var t2 = new POFileType(p2);

        var pof = new POFile({
            project: p2,
            pathName: "./po/ru-RU.po",
            type: t2,
            locale: "ru-RU"
        });
        expect(pof).toBeTruthy();


        pof.addResource(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            datatype: "po"
        }));
        pof.addResource(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            datatype: "po"
        }));
        pof.addResource(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            datatype: "po"
        }));
        pof.addResource(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            datatype: "po"
        }));

        expect(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        pof.write();

        expect(fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        content = fs.readFileSync(path.join(base, "testfiles/po/ru-RU.po"), "utf-8");

        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/ru-RU.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: ru-RU\\n"\n' +
            '"Plural-Forms: nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] ""\n' +
            'msgstr[1] ""\n' +
            'msgstr[2] ""\n' +
            '\n' +
            'msgid "string 3 and 4"\n' +
            'msgstr ""\n\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("POFileWriteWithTranslation", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/ru-RU.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        // custom project with no mappings should force it to use the default
        // mappings to get the target locale
        var p2 = new CustomProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US",
            plugins: [
                path.join(process.cwd(), "POFileType")
            ]
        }, "./test/testfiles", {
            locales:["en-GB"],
            targetDir: ".",
        });
        var t2 = new POFileType(p2);

        var pof = new POFile({
            project: p2,
            pathName: "./po/ru-RU.po",
            type: t2,
            locale: "ru-RU"
        });
        expect(pof).toBeTruthy();


        pof.addResource(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "строка 1",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        pof.addResource(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "строка 2",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        pof.addResource(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "{$count} струна",
                "few": "{$count} струны",
                "other": "{$count} струн"
            },
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        pof.addResource(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            target: "строка 3 и 4",
            targetLocale: "ru-RU",
            datatype: "po"
        }));

        expect(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        pof.write();

        expect(fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        content = fs.readFileSync(path.join(base, "testfiles/po/ru-RU.po"), "utf-8");

        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/ru-RU.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: ru-RU\\n"\n' +
            '"Plural-Forms: nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "строка 1"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr "строка 2"\n' +
            '\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] "{$count} струна"\n' +
            'msgstr[1] "{$count} струны"\n' +
            'msgstr[2] "{$count} струн"\n' +
            '\n' +
            'msgid "string 3 and 4"\n' +
            'msgstr "строка 3 и 4"\n\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("POFileWriteWithMissingTranslations", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/ru-RU.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        // custom project with no mappings should force it to use the default
        // mappings to get the target locale
        var p2 = new CustomProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US",
            plugins: [
                path.join(process.cwd(), "POFileType")
            ]
        }, "./test/testfiles", {
            locales:["en-GB"],
            targetDir: ".",
        });
        var t2 = new POFileType(p2);

        var pof = new POFile({
            project: p2,
            pathName: "./po/ru-RU.po",
            type: t2,
            locale: "ru-RU"
        });
        expect(pof).toBeTruthy();


        pof.addResource(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "строка 1",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        pof.addResource(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        pof.addResource(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "{$count} струна",
                "other": "{$count} струн"
            },
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        pof.addResource(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            targetLocale: "ru-RU",
            datatype: "po"
        }));

        expect(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        pof.write();

        expect(fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        content = fs.readFileSync(path.join(base, "testfiles/po/ru-RU.po"), "utf-8");

        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/ru-RU.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: ru-RU\\n"\n' +
            '"Plural-Forms: nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "строка 1"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] "{$count} струна"\n' +
            'msgstr[1] ""\n' +
            'msgstr[2] "{$count} струн"\n' +
            '\n' +
            'msgid "string 3 and 4"\n' +
            'msgstr ""\n\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("POFileWriteWrongTargetLocale", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/po/de-DE.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/de-DE.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/po/de-DE.po"))).toBeTruthy();

        // custom project with no mappings should force it to use the default
        // mappings to get the target locale
        var p2 = new CustomProject({
            name: "foo",
            id: "foo",
            sourceLocale: "en-US",
            plugins: [
                path.join(process.cwd(), "POFileType")
            ]
        }, "./test/testfiles", {
            locales:["en-GB"],
            targetDir: ".",
        });
        var t2 = new POFileType(p2);

        var pof = new POFile({
            project: p2,
            pathName: "./po/de-DE.po",
            type: t2,
            locale: "de-DE"
        });
        expect(pof).toBeTruthy();

        // should add these as source-only resources
        pof.addResource(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "строка 1",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        pof.addResource(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "строка 2",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        pof.addResource(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "{$count} струна",
                "few": "{$count} струны",
                "other": "{$count} струн"
            },
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        pof.addResource(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            target: "строка 3 и 4",
            targetLocale: "ru-RU",
            datatype: "po"
        }));

        expect(!fs.existsSync(path.join(base, "testfiles/po/de-DE.po"))).toBeTruthy();

        pof.write();

        expect(fs.existsSync(path.join(base, "testfiles/po/de-DE.po"))).toBeTruthy();

        content = fs.readFileSync(path.join(base, "testfiles/po/de-DE.po"), "utf-8");

        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/de-DE.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: de-DE\\n"\n' +
            '"Plural-Forms: nplurals=2; plural=n != 1;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] ""\n' +
            'msgstr[1] ""\n' +
            '\n' +
            'msgid "string 3 and 4"\n' +
            'msgstr ""\n\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("POFileLocalizeWithHeaderLocaleFull", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/po/ru.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/ru.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/po/ru.po"))).toBeTruthy();

        var pof = new POFile({
            project: p,
            pathName: "./po/template.pot",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "строка 1",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "строка 2",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "{$count} струна",
                "few": "{$count} струны",
                "other": "{$count} струн"
            },
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            target: "строка 3 и 4",
            targetLocale: "ru-RU",
            datatype: "po"
        }));

        expect(!fs.existsSync(path.join(base, "testfiles/po/ru.po"))).toBeTruthy();

        pof.localize(translations, ["ru-RU"]);

        expect(fs.existsSync(path.join(base, "testfiles/po/ru.po"))).toBeTruthy();

        content = fs.readFileSync(path.join(base, "testfiles/po/ru.po"), "utf-8");

        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/template.pot  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: ru-RU\\n"\n' +
            '"Plural-Forms: nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;\\n"\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr "строка 1"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr "строка 2"\n' +
            '\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] "{$count} струна"\n' +
            'msgstr[1] "{$count} струны"\n' +
            'msgstr[2] "{$count} струн"\n' +
            '\n' +
            'msgid "string 3 and 4"\n' +
            'msgstr "строка 3 и 4"\n\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("POFileLocalizeWithHeaderLocaleAbbreviated", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/template_ru-RU.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/template_ru-RU.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/template_ru-RU.po"))).toBeTruthy();

        var pof = new POFile({
            project: p,
            pathName: "./po/template.po",
            type: t
        });
        expect(pof).toBeTruthy();

        // should read the file
        pof.extract();

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "строка 1",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "строка 2",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        translations.add(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            targetStrings: {
                "one": "{$count} струна",
                "few": "{$count} струны",
                "other": "{$count} струн"
            },
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        translations.add(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            target: "строка 3 и 4",
            targetLocale: "ru-RU",
            datatype: "po"
        }));

        expect(!fs.existsSync(path.join(base, "testfiles/resources/template_ru-RU.po"))).toBeTruthy();

        pof.localize(translations, ["ru-RU"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/template_ru-RU.po"))).toBeTruthy();

        content = fs.readFileSync(path.join(base, "testfiles/resources/template_ru-RU.po"), "utf-8");

        var expected =
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  ./po/template.po  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n' +
            '"Language: ru\\n"\n' +
            '"Plural-Forms: nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;\\n"\n' +
            '\n' +
            '#: a/b/c.js:32\n' +
            'msgid "string 1"\n' +
            'msgstr "строка 1"\n' +
            '\n' +
            '# a plural string\n' +
            'msgid "one string"\n' +
            'msgid_plural "{$count} strings"\n' +
            'msgstr[0] "{$count} струна"\n' +
            'msgstr[1] "{$count} струны"\n' +
            'msgstr[2] "{$count} струн"\n' +
            '\n' +
            '# another string\n' +
            'msgid "string 2"\n' +
            'msgstr "строка 2"\n' +
            '\n' +
            '# string with continuation\n' +
            'msgid "string 3 and 4"\n' +
            'msgstr "строка 3 и 4"\n\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });
});
