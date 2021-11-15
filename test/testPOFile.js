/*
 * testPOFile.js - test the po and pot file handler object.
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

module.exports.pofile = {
    testPOInit: function(test) {
        p.init(function() {
            test.done();
        });
    },

    testPOFileConstructor: function(test) {
        test.expect(1);

        var pof = new POFile({project: p, type: t});
        test.ok(pof);

        test.done();
    },

    testPOFileConstructorParams: function(test) {
        test.expect(1);

        var pof = new POFile({
            project: p,
            pathName: "./testfiles/po/messages.po",
            type: t
        });

        test.ok(pof);

        test.done();
    },

    testPOFileConstructorNoFile: function(test) {
        test.expect(1);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

        test.done();
    },

    testPOFileSourceLocaleGiven: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            sourceLocale: "en-US",
            type: t
        });
        test.ok(pof);

        test.equal(pof.getSourceLocale(), "en-US");

        test.done();
    },

    testPOFileSourceLocaleDefault: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

        test.equal(pof.getSourceLocale(), "en-US");

        test.done();
    },

    testPOFileTargetLocaleGiven: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            locale: "de-DE",
            type: t
        });
        test.ok(pof);

        test.equal(pof.getTargetLocale(), "de-DE");

        test.done();
    },

    testPOFileTargetLocaleInferredFromPath: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            pathName: "resources/de-DE.po",
            type: t
        });
        test.ok(pof);

        test.equal(pof.getTargetLocale(), "de-DE");

        test.done();
    },

    testPOFileParseSimple: function(test) {
        test.expect(6);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

        pof.parse(
            'msgid "string 1"\n');

        var set = pof.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("foo", "", "en-US", "string 1", "po"));
        test.ok(r);

        test.equal(r.getSource(), "string 1");
        test.equal(r.getKey(), "string 1");
        test.equal(r.getType(), "string");

        test.done();
    },

    testPOFileParseWithContext: function(test) {
        test.expect(7);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

        pof.parse(
            'msgctxt "context 1"\n' +
            'msgid "string 1"\n'
        );

        var set = pof.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("foo", "context 1", "en-US", "string 1", "po"));
        test.ok(r);

        test.equal(r.getSource(), "string 1");
        test.equal(r.getKey(), "string 1");
        test.equal(r.getType(), "string");
        test.equal(r.getContext(), "context 1");

        test.done();
    },

    testPOFileParseSimpleWithTranslation: function(test) {
        test.expect(9);

        var pof = new POFile({
            project: p,
            locale: "de-DE",
            type: t
        });
        test.ok(pof);

        pof.parse(
            'msgid "string 1"\n' +
            'msgstr "this is string one"\n');

        var set = pof.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("foo", "", "de-DE", "string 1", "po"));
        test.ok(r);

        test.equal(r.getSource(), "string 1");
        test.equal(r.getSourceLocale(), "en-US");
        test.equal(r.getKey(), "string 1");
        test.equal(r.getTarget(), "this is string one");
        test.equal(r.getTargetLocale(), "de-DE");
        test.equal(r.getType(), "string");

        test.done();
    },

    testPOFileParseSimpleRightStrings: function(test) {
        test.expect(10);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

        pof.parse(
            'msgid "string 1"\n' +
            'msgstr "this is string one"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr "this is string two"\n'
        );

        var set = pof.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.equal(resources.length, 2);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getTarget(), "this is string one");

        test.equal(resources[1].getSource(), "string 2");
        test.equal(resources[1].getKey(), "string 2");
        test.equal(resources[1].getTarget(), "this is string two");

        test.done();
    },

    testPOFileParsePluralString: function(test) {
        test.expect(9);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

        pof.parse(
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n'
        );

        var set = pof.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getType(), "plural");
        var strings = resources[0].getSourcePlurals();
        test.equal(strings.one, "one object");
        test.equal(strings.other, "{$count} objects");
        test.equal(resources[0].getKey(), "one object");
        test.ok(!resources[0].getTargetPlurals());

        test.done();
    },

    testPOFileParsePluralStringWithTranslations: function(test) {
        test.expect(12);

        var pof = new POFile({
            project: p,
            locale: "de-DE",
            type: t
        });
        test.ok(pof);

        pof.parse(
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n' +
            'msgstr[0] "Ein Objekt"\n' +
            'msgstr[1] "{$count} Objekten"\n'
        );

        var set = pof.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getType(), "plural");
        var strings = resources[0].getSourcePlurals();
        test.equal(strings.one, "one object");
        test.equal(strings.other, "{$count} objects");
        test.equal(resources[0].getKey(), "one object");
        test.equal(resources[0].getSourceLocale(), "en-US");
        strings = resources[0].getTargetPlurals();
        test.equal(strings.one, "Ein Objekt");
        test.equal(strings.other, "{$count} Objekten");
        test.equal(resources[0].getTargetLocale(), "de-DE");

        test.done();
    },

    testPOFileParsePluralStringWithEmptyTranslations: function(test) {
        test.expect(11);

        var pof = new POFile({
            project: p,
            locale: "de-DE",
            type: t
        });
        test.ok(pof);

        pof.parse(
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n' +
            'msgstr[0] ""\n' +
            'msgstr[1] ""\n'
        );

        var set = pof.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getType(), "plural");
        var strings = resources[0].getSourcePlurals();
        test.equal(strings.one, "one object");
        test.equal(strings.other, "{$count} objects");
        test.equal(resources[0].getKey(), "one object");
        test.equal(resources[0].getSourceLocale(), "en-US");
        test.ok(!resources[0].getTargetPlurals());
        test.ok(!resources[0].getTargetLocale());

        test.done();
    },

    testPOFileParsePluralStringWithTranslationsRussian: function(test) {
        test.expect(13);

        var pof = new POFile({
            project: p,
            locale: "ru-RU",
            type: t
        });
        test.ok(pof);

        pof.parse(
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n' +
            'msgstr[0] "{$count} объект"\n' +
            'msgstr[1] "{$count} объекта"\n' +
            'msgstr[2] "{$count} объектов"\n'
        );

        var set = pof.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getType(), "plural");
        var strings = resources[0].getSourcePlurals();
        test.equal(strings.one, "one object");
        test.equal(strings.other, "{$count} objects");
        test.equal(resources[0].getKey(), "one object");
        test.equal(resources[0].getSourceLocale(), "en-US");
        strings = resources[0].getTargetPlurals();
        test.equal(strings.one, "{$count} объект");
        test.equal(strings.few, "{$count} объекта");
        test.equal(strings.other, "{$count} объектов");
        test.equal(resources[0].getTargetLocale(), "ru-RU");

        test.done();
    },

    testPOFileParseSimpleLineContinuations: function(test) {
        test.expect(7);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

        pof.parse(
            'msgid "string 1"\n' +
            '" and more string 1"\n' +
            'msgstr "this is string one "\n' +
            '"or the translation thereof. "\n' +
            '"Next line."\n'
        );

        var set = pof.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getSource(), "string 1 and more string 1");
        test.equal(resources[0].getKey(), "string 1 and more string 1");
        test.equal(resources[0].getTarget(), "this is string one or the translation thereof. Next line.");

        test.done();
    },

    testPOFileParseSimpleLineContinuationsWithEmptyString: function(test) {
        test.expect(7);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

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
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getSource(), "string 1 and more string 1");
        test.equal(resources[0].getKey(), "string 1 and more string 1");
        test.equal(resources[0].getTarget(), "this is string one or the translation thereof. Next line.");

        test.done();
    },

    testPOFileParseEscapedQuotes: function(test) {
        test.expect(6);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

        pof.parse(
            'msgid "string \\"quoted\\" 1"\n');

        var set = pof.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("foo", "", "en-US", 'string "quoted" 1', "po"));
        test.ok(r);

        test.equal(r.getSource(), 'string "quoted" 1');
        test.equal(r.getKey(), 'string "quoted" 1');
        test.equal(r.getType(), 'string');

        test.done();
    },

    testPOFileParseEmptyTranslation: function(test) {
        test.expect(12);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

        // only source strings
        pof.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var set = pof.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.equal(resources.length, 2);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.ok(!resources[0].getTarget());
        test.ok(!resources[0].getTargetLocale());

        test.equal(resources[1].getSource(), "string 2");
        test.equal(resources[1].getKey(), "string 2");
        test.ok(!resources[1].getTarget());
        test.ok(!resources[1].getTargetLocale());

        test.done();
    },

    testPOFileParseEmptySource: function(test) {
        test.expect(3);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

        pof.parse(
            'msgid ""\n' +
            'msgstr "string 1"\n' +
            '\n' +
            'msgid ""\n' +
            'msgstr "string 2"\n'
        );

        var set = pof.getTranslationSet();
        test.ok(set);

        // no source = no string to translate!
        test.equal(set.size(), 0);

        test.done();
    },

    testPOFileParseFileHeader: function(test) {
        test.expect(3);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

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
        test.ok(set);

        // no source = no string to translate!
        test.equal(set.size(), 0);

        test.done();
    },

    testPOFileParseDupString: function(test) {
        test.expect(8);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

        // only source strings
        pof.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n'
        );

        var set = pof.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.ok(!resources[0].getTarget());
        test.ok(!resources[0].getTargetLocale());

        test.done();
    },

    testPOFileParseSameStringDifferentContext: function(test) {
        test.expect(14);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

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
        test.ok(set);

        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.equal(resources.length, 2);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getContext(), "context 1");
        test.ok(!resources[0].getTarget());
        test.ok(!resources[0].getTargetLocale());

        test.equal(resources[1].getSource(), "string 1");
        test.equal(resources[1].getKey(), "string 1");
        test.equal(resources[1].getContext(), "context 2");
        test.ok(!resources[1].getTarget());
        test.ok(!resources[1].getTargetLocale());

        test.done();
    },

    testPOFileParseSameStringContextInKey: function(test) {
        test.expect(14);

        var pof = new POFile({
            project: p,
            pathName: "foo/bar/context.po",
            type: t
        });
        test.ok(pof);

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
        test.ok(set);

        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.equal(resources.length, 2);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1 --- context 1");
        test.equal(resources[0].getContext(), "context 1");
        test.ok(!resources[0].getTarget());
        test.ok(!resources[0].getTargetLocale());

        test.equal(resources[1].getSource(), "string 1");
        test.equal(resources[1].getKey(), "string 1 --- context 2");
        test.equal(resources[1].getContext(), "context 2");
        test.ok(!resources[1].getTarget());
        test.ok(!resources[1].getTargetLocale());

        test.done();
    },

    testPOFileParseTestInvalidPO: function(test) {
        test.expect(2);

        // when it's named messages.po, it should apply the messages-schema schema
        var pof = new POFile({
            project: p,
            pathName: "i18n/deep.po",
            type: t
        });
        test.ok(pof);

        test.throws(function(test) {
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
        });

        test.done();
    },

    testPOFileParseExtractComments: function(test) {
        test.expect(12);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

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
        test.ok(set);

        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.equal(resources.length, 2);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getComment(),
            '{"translator":["translator\'s comments"],' +
             '"paths":["src/foo.html:32 src/bar.html:234"],' +
             '"extracted":["This is comments from the engineer to the translator for string 1."],' +
             '"flags":["c-format"],' +
             '"previous":["str 1"]}');
        test.equal(resources[0].getPath(), "src/foo.html");

        test.equal(resources[1].getSource(), "string 2");
        test.equal(resources[1].getKey(), "string 2");
        test.equal(resources[1].getComment(),
            '{"translator":["translator\'s comments 2"],' +
             '"paths":["src/bar.html:644 src/asdf.html:232"],' +
             '"extracted":["This is comments from the engineer to the translator for string 2."],' +
             '"flags":["javascript-format,gcc-internal-format"],' +
             '"previous":["str 2"]}');
        test.equal(resources[1].getPath(), "src/bar.html");

        test.done();
    },

    testPOFileParseExtractFileNameNoLineNumbers: function(test) {
        test.expect(12);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

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
        test.ok(set);

        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.equal(resources.length, 2);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getComment(),
            '{"paths":["src/foo.html src/bar.html"]}');
        test.equal(resources[0].getPath(), "src/foo.html");

        test.equal(resources[1].getSource(), "string 2");
        test.equal(resources[1].getKey(), "string 2");
        test.equal(resources[1].getComment(),
            '{"paths":["src/bar.html"]}');
        test.equal(resources[1].getPath(), "src/bar.html");

        test.done();
    },

    testPOFileParseClearComments: function(test) {
        test.expect(12);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

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
        test.ok(set);

        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.equal(resources.length, 2);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getComment(),
            '{"translator":["translator\'s comments"],' +
             '"paths":["src/foo.html:32"],' +
             '"extracted":["This is comments from the engineer to the translator for string 1."],' +
             '"flags":["c-format"],' +
             '"previous":["str 1"]}');
        test.equal(resources[0].getPath(), "src/foo.html");

        // comments for string 1 should not carry over to string 2
        test.equal(resources[1].getSource(), "string 2");
        test.equal(resources[1].getKey(), "string 2");
        test.ok(!resources[1].getComment());
        test.ok(!resources[1].getPath());

        test.done();
    },

    testPOFileParseExtractMultiplePaths: function(test) {
        test.expect(8);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

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
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getComment(), '{"paths":["src/foo.html:32","src/bar.html:32","src/asdf.html:32","src/xyz.html:32","src/abc.html:32"]}');
        test.equal(resources[0].getPath(), "src/foo.html");

        test.done();
    },

    testPOFileParseExtractMultipleComments: function(test) {
        test.expect(7);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

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
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getComment(),
            '{"translator":["translator\'s comments 1","translator\'s comments 2"],' +
             '"extracted":["This is comments from the engineer to the translator for string 1.",'+
             '"This is more comments from the engineer to the translator for string 1."],' +
             '"flags":["c-format","javascript-format"],' +
             '"previous":["str 1","str 2"]}');

        test.done();
    },

    testPOFileParseIgnoreComments: function(test) {
        test.expect(7);

        var pof = new POFile({
            project: p,
            type: t,
            pathName: "foo/bar/ignore2.po"   // picks the right mapping
        });
        test.ok(pof);

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
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getComment(),
            '{"translator":["translator\'s comments 1","translator\'s comments 2"],' +
             '"extracted":["This is comments from the engineer to the translator for string 1.",'+
             '"This is more comments from the engineer to the translator for string 1."],' +
             '"previous":["str 1","str 2"]}');

        test.done();
    },

    testPOFileParseIgnoreAllComments: function(test) {
        test.expect(7);

        var pof = new POFile({
            project: p,
            type: t,
            pathName: "foo/bar/ignore1.po"   // picks the right mapping
        });
        test.ok(pof);

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
        test.ok(set);

        test.equal(set.size(), 1);
        var resources = set.getAll();
        test.equal(resources.length, 1);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.ok(!resources[0].getComment());

        test.done();
    },

    testPOFileExtractFile: function(test) {
        test.expect(17);

        var base = path.dirname(module.id);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(pof);

        // should read the file
        pof.extract();

        var set = pof.getTranslationSet();

        test.equal(set.size(), 4);

        var resources = set.getAll();
        test.equal(resources.length, 4);

        test.equal(resources[0].getType(), "string");
        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");

        test.equal(resources[1].getType(), "plural");
        var categories = resources[1].getSourcePlurals();
        test.ok(categories);
        test.equal(categories.one, "one string");
        test.equal(categories.other, "{$count} strings");
        test.equal(resources[1].getKey(), "one string");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getSource(), "string 2");
        test.equal(resources[2].getKey(), "string 2");

        test.equal(resources[3].getType(), "string");
        test.equal(resources[3].getSource(), "string 3 and 4");
        test.equal(resources[3].getKey(), "string 3 and 4");

        test.done();
    },

    testPOFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var pof = new POFile({
            project: p,
            type: t
        });
        test.ok(pof);

        // should attempt to read the file and not fail
        pof.extract();

        var set = pof.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testPOFileExtractBogusFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var pof = new POFile({
            project: p,
            pathName: "./po/bogus.po",
            type: t
        });
        test.ok(pof);

        // should attempt to read the file and not fail
        pof.extract();

        var set = pof.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testPOFileLocalizeTextSimple: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(pof);

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
        test.equal(actual, expected);
        test.done();
    },

    testPOFileLocalizeTextMultiple: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(pof);

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
        test.equal(actual, expected);
        test.done();
    },

    testPOFileLocalizeTextPreserveComments: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(pof);

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
        test.equal(actual, expected);
        test.done();
    },

    testPOFileLocalizeTextPreserveMultipleComments: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(pof);

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
        test.equal(actual, expected);
        test.done();
    },

    testPOFileLocalizeTextWithEscapedQuotes: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(pof);

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
        test.equal(actual, expected);
        test.done();
    },

    testPOFileLocalizeTextWithContext: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(pof);

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
        test.equal(actual, expected);
        test.done();
    },

    testPOFileLocalizeTextWithContextInKey: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/context.po",
            type: t
        });
        test.ok(pof);

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
        test.equal(actual, expected);
        test.done();
    },

    testPOFileLocalizeTextWithNoActualTranslation: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(pof);

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
        test.equal(actual, expected);
        test.done();
    },

    testPOFileLocalizeTextUsePseudoForMissingTranslations: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p2,
            pathName: "./po/messages.po",
            type: t2
        });
        test.ok(pof);

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
            'msgstr "šţŕíñğ 13210"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgid_plural "string 2 plural"\n' +
            'msgstr[0] "šţŕíñğ 23210"\n' +
            'msgstr[1] "šţŕíñğ 2 þľüŕàľ76543210"\n\n';

        diff(actual, expected);
        test.equal(actual, expected);
        test.done();
    },

    testPOFileLocalizeTextWithExistingTranslations: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(pof);

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
        test.equal(actual, expected);
        test.done();
    },

    testPOFileLocalizeTextPluralsWithNoActualTranslation: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(pof);

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
        test.equal(actual, expected);
        test.done();
    },

    testPOFileLocalizeTextHeaderLocaleFull: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.pot",
            type: t
        });
        test.ok(pof);

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
        test.equal(actual, expected);
        test.done();
    },

    testPOFileLocalizeTextHeaderLocaleAbbreviated: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/template.po",
            type: t
        });
        test.ok(pof);

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
        test.equal(actual, expected);
        test.done();
    },

    testPOFileLocalizeTextHeaderLocaleMapped: function(test) {
        test.expect(2);

        var pof = new POFile({
            project: p,
            pathName: "./po/foo.po",
            type: t
        });
        test.ok(pof);

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
        test.equal(actual, expected);
        test.done();
    },

    testPOFileLocalize: function(test) {
        test.expect(7);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr-FR.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de-DE.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de-DE.po")));

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(pof);

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

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de-DE.po")));

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
        test.equal(content, expected);

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
        test.equal(content, expected);

        test.done();
    },

    testPOFileLocalizeNoTranslations: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr-FR.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de-DE.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de-DE.po")));

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(pof);

        // should read the file
        pof.extract();

        var translations = new TranslationSet();

        pof.localize(translations, ["fr-FR", "de-DE"]);

        // should produce the files, even if there is nothing to localize in them
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de-DE.po")));

        test.done();
    },

    testPOFileLocalizeExtractNewStrings: function(test) {
        test.expect(20);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr-FR.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de-DE.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de-DE.po")));

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(pof);

        // make sure we start off with no new strings
        t.newres.clear();
        test.equal(t.newres.size(), 0);

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

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de-DE.po")));

        // now verify that the strings which did not have translations show up in the
        // new strings translation set
        test.equal(t.newres.size(), 4);
        var resources = t.newres.getAll();
        test.equal(resources.length, 4);

        test.equal(resources[0].getType(), "string");
        test.equal(resources[0].getKey(), "string 2");
        test.equal(resources[0].getTargetLocale(), "fr-FR");

        test.equal(resources[1].getType(), "string");
        test.equal(resources[1].getKey(), "string 3 and 4");
        test.equal(resources[1].getTargetLocale(), "fr-FR");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getKey(), "string 2");
        test.equal(resources[2].getTargetLocale(), "de-DE");

        test.equal(resources[3].getType(), "string");
        test.equal(resources[3].getKey(), "string 3 and 4");
        test.equal(resources[3].getTargetLocale(), "de-DE");

        test.done();
    },

    testPOFileLocalizeWithAlternateFileNameTemplate: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/template_fr-FR.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/template_fr-FR.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/template_de-DE.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/template_de-DE.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/template_fr-FR.po")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/template_de-DE.po")));

        var pof = new POFile({
            project: p,
            pathName: "./po/template.po",
            type: t
        });
        test.ok(pof);

        // should read the file
        pof.extract();

        // only translate some of the strings
        var translations = new TranslationSet();

        pof.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/template_fr-FR.po")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/template_de-DE.po")));

        test.done();
    },

    testPOFileLocalizeWithAlternateLocaleMapping: function(test) {
        test.expect(3);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "./testfiles/po/no.po"))) {
            fs.unlinkSync(path.join(base, "./testfiles/po/no.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "./testfiles/po/no.po")));

        var pof = new POFile({
            project: p,
            pathName: "./po/foo.po",
            type: t
        });
        test.ok(pof);

        // should read the file
        pof.extract();

        var translations = new TranslationSet();

        // should use the locale map in the mapping rather than the shared one
        pof.localize(translations, ["nb-NO"]);

        test.ok(fs.existsSync(path.join(base, "./testfiles/po/no.po")));

        test.done();
    },

    testPOFileLocalizeWithAlternateLocaleMappingRightContents: function(test) {
        test.expect(4);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "./testfiles/po/no.po"))) {
            fs.unlinkSync(path.join(base, "./testfiles/po/no.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "./testfiles/po/no.po")));

        var pof = new POFile({
            project: p,
            pathName: "./po/foo.po",
            type: t
        });
        test.ok(pof);

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

        test.ok(fs.existsSync(path.join(base, "./testfiles/po/no.po")));

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
        test.equal(actual, expected);

        test.done();
    },

    testPOFileLocalizeWithSharedLocaleMapping: function(test) {
        test.expect(3);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/template_nb.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/template_nb.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/template_nb.po")));

        var pof = new POFile({
            project: p,
            pathName: "./po/template.po",
            type: t
        });
        test.ok(pof);

        // should read the file
        pof.extract();

        var translations = new TranslationSet();

        // should use the shared locale map because there isn't one in the mapping
        pof.localize(translations, ["nb-NO"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/template_nb.po")));

        test.done();
    },

    testPOFileLocalizeWithSharedLocaleMappingRightContents: function(test) {
        test.expect(4);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/template_nb.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/template_nb.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/template_nb.po")));

        var pof = new POFile({
            project: p,
            pathName: "./po/template.po",
            type: t
        });
        test.ok(pof);

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

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/template_nb.po")));

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
        test.equal(actual, expected);


        test.done();
    },

    testPOFileLocalizeDefaultTemplate: function(test) {
        test.expect(4);

        var base = path.dirname(module.id);

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(pof);

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

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po")));

        pof.localize(translations, ["fr-FR"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po")));

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
        test.equal(content, expected);

        test.done();
    },

    testPOFileExtractLocalizedFiles: function(test) {
        test.expect(65);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr-FR.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de-DE.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de-DE.po")));

        var pof = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(pof);

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

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de-DE.po")));

        pof = new POFile({
            project: p,
            pathName: "./resources/fr-FR.po",
            type: t
        });
        test.ok(pof);

        // should read the file
        pof.extract();

        // now verify that the resources it created have the right target locale
        // based on the file name

        var set = pof.getTranslationSet();

        test.equal(set.size(), 4);

        var resources = set.getAll();
        test.equal(resources.length, 4);

        test.equal(resources[0].getType(), "string");
        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getSourceLocale(), "en-US");
        test.equal(resources[0].getTarget(), "chaîne 1");
        test.equal(resources[0].getTargetLocale(), "fr-FR");

        test.equal(resources[1].getType(), "plural");
        var categories = resources[1].getSourcePlurals();
        test.ok(categories);
        test.equal(categories.one, "one string");
        test.equal(categories.other, "{$count} strings");
        test.equal(resources[1].getKey(), "one string");
        test.equal(resources[1].getSourceLocale(), "en-US");
        categories = resources[1].getTargetPlurals();
        test.equal(categories.one, "chaîne un");
        test.equal(categories.other, "chaîne {$count}");
        test.equal(resources[1].getTargetLocale(), "fr-FR");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getSource(), "string 2");
        test.equal(resources[2].getKey(), "string 2");
        test.equal(resources[2].getSourceLocale(), "en-US");
        test.equal(resources[2].getTarget(), "chaîne 2");
        test.equal(resources[2].getTargetLocale(), "fr-FR");

        test.equal(resources[3].getType(), "string");
        test.equal(resources[3].getSource(), "string 3 and 4");
        test.equal(resources[3].getKey(), "string 3 and 4");
        test.equal(resources[3].getSourceLocale(), "en-US");
        test.equal(resources[3].getTarget(), "chaîne 3 et 4");
        test.equal(resources[3].getTargetLocale(), "fr-FR");

        pof = new POFile({
            project: p,
            pathName: "./resources/de-DE.po",
            type: t
        });
        test.ok(pof);

        // should read the file
        pof.extract();

        // now verify that the resources it created have the right target locale
        // based on the file name

        var set = pof.getTranslationSet();

        test.equal(set.size(), 4);

        resources = set.getAll();
        test.equal(resources.length, 4);

        test.equal(resources[0].getType(), "string");
        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getSourceLocale(), "en-US");
        test.equal(resources[0].getTarget(), "Zeichenfolge 1");
        test.equal(resources[0].getTargetLocale(), "de-DE");

        test.equal(resources[1].getType(), "plural");
        var categories = resources[1].getSourcePlurals();
        test.ok(categories);
        test.equal(categories.one, "one string");
        test.equal(categories.other, "{$count} strings");
        test.equal(resources[1].getKey(), "one string");
        test.equal(resources[1].getSourceLocale(), "en-US");
        categories = resources[1].getTargetPlurals();
        test.equal(categories.one, "Zeichenfolge eins");
        test.equal(categories.other, "Zeichenfolge {$count}");
        test.equal(resources[1].getTargetLocale(), "de-DE");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getSource(), "string 2");
        test.equal(resources[2].getKey(), "string 2");
        test.equal(resources[2].getSourceLocale(), "en-US");
        test.equal(resources[2].getTarget(), "Zeichenfolge 2");
        test.equal(resources[2].getTargetLocale(), "de-DE");

        test.equal(resources[3].getType(), "string");
        test.equal(resources[3].getSource(), "string 3 and 4");
        test.equal(resources[3].getKey(), "string 3 and 4");
        test.equal(resources[3].getSourceLocale(), "en-US");
        test.equal(resources[3].getTarget(), "Zeichenfolge 3 und 4");
        test.equal(resources[3].getTargetLocale(), "de-DE");

        test.done();
    },

    testPOFileExtractLocalizedFilesNoMappings: function(test) {
        test.expect(67);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/po/fr-FR.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/fr-FR.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/po/de-DE.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/de-DE.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/po/fr-FR.po")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/po/de-DE.po")));

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
        test.ok(pof);

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

        test.ok(!fs.existsSync(path.join(base, "testfiles/po/fr-FR.po")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/po/de-DE.po")));

        pof.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/po/fr-FR.po")));
        test.ok(fs.existsSync(path.join(base, "testfiles/po/de-DE.po")));

        pof = new POFile({
            project: p,
            pathName: "./po/fr-FR.po",
            type: t
        });
        test.ok(pof);

        // should read the file
        pof.extract();

        // now verify that the resources it created have the right target locale
        // based on the file name

        var set = pof.getTranslationSet();

        test.equal(set.size(), 4);

        var resources = set.getAll();
        test.equal(resources.length, 4);

        test.equal(resources[0].getType(), "string");
        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getSourceLocale(), "en-US");
        test.equal(resources[0].getTarget(), "chaîne 1");
        test.equal(resources[0].getTargetLocale(), "fr-FR");

        test.equal(resources[1].getType(), "plural");
        var categories = resources[1].getSourcePlurals();
        test.ok(categories);
        test.equal(categories.one, "one string");
        test.equal(categories.other, "{$count} strings");
        test.equal(resources[1].getKey(), "one string");
        test.equal(resources[1].getSourceLocale(), "en-US");
        categories = resources[1].getTargetPlurals();
        test.equal(categories.one, "chaîne un");
        test.equal(categories.other, "chaîne {$count}");
        test.equal(resources[1].getTargetLocale(), "fr-FR");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getSource(), "string 2");
        test.equal(resources[2].getKey(), "string 2");
        test.equal(resources[2].getSourceLocale(), "en-US");
        test.equal(resources[2].getTarget(), "chaîne 2");
        test.equal(resources[2].getTargetLocale(), "fr-FR");

        test.equal(resources[3].getType(), "string");
        test.equal(resources[3].getSource(), "string 3 and 4");
        test.equal(resources[3].getKey(), "string 3 and 4");
        test.equal(resources[3].getSourceLocale(), "en-US");
        test.equal(resources[3].getTarget(), "chaîne 3 et 4");
        test.equal(resources[3].getTargetLocale(), "fr-FR");

        pof = new POFile({
            project: p,
            pathName: "./po/de-DE.po",
            type: t
        });
        test.ok(pof);

        // should read the file
        pof.extract();

        // now verify that the resources it created have the right target locale
        // based on the file name

        var set = pof.getTranslationSet();

        test.equal(set.size(), 4);

        resources = set.getAll();
        test.equal(resources.length, 4);

        test.equal(resources[0].getType(), "string");
        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getSourceLocale(), "en-US");
        test.equal(resources[0].getTarget(), "Zeichenfolge 1");
        test.equal(resources[0].getTargetLocale(), "de-DE");

        test.equal(resources[1].getType(), "plural");
        var categories = resources[1].getSourcePlurals();
        test.ok(categories);
        test.equal(categories.one, "one string");
        test.equal(categories.other, "{$count} strings");
        test.equal(resources[1].getKey(), "one string");
        test.equal(resources[1].getSourceLocale(), "en-US");
        categories = resources[1].getTargetPlurals();
        test.equal(categories.one, "Zeichenfolge eins");
        test.equal(categories.other, "Zeichenfolge {$count}");
        test.equal(resources[1].getTargetLocale(), "de-DE");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getSource(), "string 2");
        test.equal(resources[2].getKey(), "string 2");
        test.equal(resources[2].getSourceLocale(), "en-US");
        test.equal(resources[2].getTarget(), "Zeichenfolge 2");
        test.equal(resources[2].getTargetLocale(), "de-DE");

        test.equal(resources[3].getType(), "string");
        test.equal(resources[3].getSource(), "string 3 and 4");
        test.equal(resources[3].getKey(), "string 3 and 4");
        test.equal(resources[3].getSourceLocale(), "en-US");
        test.equal(resources[3].getTarget(), "Zeichenfolge 3 und 4");
        test.equal(resources[3].getTargetLocale(), "de-DE");

        test.done();
    },

    testPOFileExtractLocalizedFilesNoMappingsRussian: function(test) {
        test.expect(35);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/ru-RU.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po")));

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
        test.ok(pof);

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

        test.ok(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po")));

        pof.localize(translations, ["ru-RU"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/po/ru-RU.po")));

        pof = new POFile({
            project: p,
            pathName: "./po/ru-RU.po",
            type: t
        });
        test.ok(pof);

        // should read the file
        pof.extract();

        // now verify that the resources it created have the right target locale
        // based on the file name

        var set = pof.getTranslationSet();

        test.equal(set.size(), 4);

        var resources = set.getAll();
        test.equal(resources.length, 4);

        test.equal(resources[0].getType(), "string");
        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");
        test.equal(resources[0].getSourceLocale(), "en-US");
        test.equal(resources[0].getTarget(), "строка 1");
        test.equal(resources[0].getTargetLocale(), "ru-RU");

        test.equal(resources[1].getType(), "plural");
        var categories = resources[1].getSourcePlurals();
        test.ok(categories);
        test.equal(categories.one, "one string");
        test.equal(categories.other, "{$count} strings");
        test.equal(resources[1].getKey(), "one string");
        test.equal(resources[1].getSourceLocale(), "en-US");
        categories = resources[1].getTargetPlurals();
        test.equal(categories.one, "{$count} струна");
        test.equal(categories.few, "{$count} струны");
        test.equal(categories.other, "{$count} струн");
        test.equal(resources[1].getTargetLocale(), "ru-RU");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getSource(), "string 2");
        test.equal(resources[2].getKey(), "string 2");
        test.equal(resources[2].getSourceLocale(), "en-US");
        test.equal(resources[2].getTarget(), "строка 2");
        test.equal(resources[2].getTargetLocale(), "ru-RU");

        test.equal(resources[3].getType(), "string");
        test.equal(resources[3].getSource(), "string 3 and 4");
        test.equal(resources[3].getKey(), "string 3 and 4");
        test.equal(resources[3].getSourceLocale(), "en-US");
        test.equal(resources[3].getTarget(), "строка 3 и 4");
        test.equal(resources[3].getTargetLocale(), "ru-RU");

        test.done();
    },

    testPOFileWriteSourceOnly: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/ru-RU.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po")));

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
        test.ok(pof);


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

        test.ok(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po")));

        pof.write();

        test.ok(fs.existsSync(path.join(base, "testfiles/po/ru-RU.po")));

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
        test.equal(content, expected);

        test.done();
    },

    testPOFileWriteWithTranslation: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/ru-RU.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po")));

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
        test.ok(pof);


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

        test.ok(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po")));

        pof.write();

        test.ok(fs.existsSync(path.join(base, "testfiles/po/ru-RU.po")));

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
        test.equal(content, expected);

        test.done();
    },

    testPOFileWriteWithMissingTranslations: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/ru-RU.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po")));

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
        test.ok(pof);


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

        test.ok(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po")));

        pof.write();

        test.ok(fs.existsSync(path.join(base, "testfiles/po/ru-RU.po")));

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
        test.equal(content, expected);

        test.done();
    },

    testPOFileWriteWrongTargetLocale: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/po/de-DE.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/de-DE.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/po/de-DE.po")));

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
        test.ok(pof);

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

        test.ok(!fs.existsSync(path.join(base, "testfiles/po/de-DE.po")));

        pof.write();

        test.ok(fs.existsSync(path.join(base, "testfiles/po/de-DE.po")));

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
        test.equal(content, expected);

        test.done();
    },

    testPOFileLocalizeWithHeaderLocaleFull: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/po/ru.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/ru.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/po/ru.po")));

        var pof = new POFile({
            project: p,
            pathName: "./po/template.pot",
            type: t
        });
        test.ok(pof);

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

        test.ok(!fs.existsSync(path.join(base, "testfiles/po/ru.po")));

        pof.localize(translations, ["ru-RU"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/po/ru.po")));

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
        test.equal(content, expected);

        test.done();
    },

    testPOFileLocalizeWithHeaderLocaleAbbreviated: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/template_ru-RU.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/template_ru-RU.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/template_ru-RU.po")));

        var pof = new POFile({
            project: p,
            pathName: "./po/template.po",
            type: t
        });
        test.ok(pof);

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

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/template_ru-RU.po")));

        pof.localize(translations, ["ru-RU"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/template_ru-RU.po")));

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
        test.equal(content, expected);

        test.done();
    },
};
