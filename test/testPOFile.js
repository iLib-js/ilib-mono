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
    po: {
        mappings: {
            "**/*.pot": {
                "template": "[dir]/[locale].po"
            },
            "**/messages.pot": {
                "template": "resources/[locale].po"
            },
            "**/en-US.po": {
                "template": "[dir]/[locale].po"
            }
        }
    }
});
var t = new POFileType(p);

var p2 = new CustomProject({
    name: "foo",
    id: "foo",
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"],
    identify: true,
    targetDir: "testfiles"
});

var t2 = new POFileType(p2);

module.exports.pofile = {
    testPOFileConstructor: function(test) {
        test.expect(1);

        var jf = new POFile({project: p, type: t});
        test.ok(jf);

        test.done();
    },

    testPOFileConstructorParams: function(test) {
        test.expect(1);

        var jf = new POFile({
            project: p,
            pathName: "./testfiles/po/messages.pot",
            type: t
        });

        test.ok(jf);

        test.done();
    },

    testPOFileConstructorNoFile: function(test) {
        test.expect(1);

        var jf = new POFile({
            project: p,
            type: t
        });
        test.ok(jf);

        test.done();
    },

    testPOFileParseSimple: function(test) {
        test.expect(5);

        var jf = new POFile({
            project: p,
            locale: "de-DE",
            type: t
        });
        test.ok(jf);

        jf.parse(
            'msgid "string 1"\n');

        var set = jf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("foo", "en-US", "string 1", "po"));
        test.ok(r);

        test.equal(r.getSource(), "string 1");
        test.equal(r.getKey(), "string 1");

        test.done();
    },

    testPOFileParseSimpleWithTranslation: function(test) {
        test.expect(6);

        var jf = new POFile({
            project: p,
            locale: "de-DE",
            type: t
        });
        test.ok(jf);

        jf.parse(
            'msgid "string 1"\n' +
            'msgstr "this is string one"\n');

        var set = jf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("foo", "en-US", "string 1", "po"));
        test.ok(r);

        test.equal(r.getSource(), "string 1");
        test.equal(r.getKey(), "string 1");
        test.equal(r.getTarget(), "this is string one");

        test.done();
    },

    testPOFileParseSimpleRightStrings: function(test) {
        test.expect(8);

        var jf = new POFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse(
            'msgid "string 1"\n' +
            'msgstr "this is string one"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr "this is string two"\n'
        );

        var set = jf.getTranslationSet();
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

    testPOFileParseEmptyTranslation: function(test) {
        test.expect(8);

        var jf = new POFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var set = jf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 2);
        var resources = set.getAll();
        test.equal(resources.length, 2);

        test.equal(resources[0].getSource(), "string 1");
        test.equal(resources[0].getKey(), "string 1");

        test.equal(resources[1].getSource(), "string 2");
        test.equal(resources[1].getKey(), "string 2");

        test.done();
    },

    testPOFileParseEmptySource: function(test) {
        test.expect(3);

        var jf = new POFile({
            project: p,
            type: t
        });
        test.ok(jf);

        jf.parse(
            'msgid ""\n' +
            'msgstr "string 1"\n' +
            '\n' +
            'msgid ""\n' +
            'msgstr "string 2"\n'
        );

        var set = jf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 0);

        test.done();
    },

    testPOFileParseTestInvalidPO: function(test) {
        test.expect(2);

        // when it's named messages.po, it should apply the messages-schema schema
        var jf = new POFile({
            project: p,
            pathName: "i18n/deep.po",
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

    testPOFileParseExtractComments: function(test) {
        test.expect(8);

        var jf = new POFile({
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

    testPOFileExtractFile: function(test) {
        test.expect(28);

        var base = path.dirname(module.id);

        var jf = new POFile({
            project: p,
            pathName: "./po/messages.po",
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

    testPOFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var jf = new POFile({
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

    testPOFileExtractBogusFile: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var jf = new POFile({
            project: p,
            pathName: "./po/bogus.po",
            type: t
        });
        test.ok(jf);

        // should attempt to read the file and not fail
        jf.extract();

        var set = jf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testPOFileLocalizeTextSimple: function(test) {
        test.expect(2);

        var jf = new POFile({
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
            datatype: "po"
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

    testPOFileLocalize: function(test) {
        test.expect(7);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/messages.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/messages.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.po")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.po")));

        var jf = new POFile({
            project: p,
            pathName: "./po/messages.po",
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
            datatype: "po"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "po"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/c",
            source: "d",
            sourceLocale: "en-US",
            target: "la d",
            targetLocale: "fr-FR",
            datatype: "po"
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
            datatype: "po"
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
            datatype: "po"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "Die b",
            targetLocale: "de-DE",
            datatype: "po"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/c",
            source: "d",
            sourceLocale: "en-US",
            target: "Der d",
            targetLocale: "de-DE",
            datatype: "po"
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
            datatype: "po"
        }));

        jf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.po")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.po")));

        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/messages.po"), "utf-8");

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

        content = fs.readFileSync(path.join(base, "testfiles/resources/de/DE/messages.po"), "utf-8");

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

    testPOFileLocalizeNoTranslations: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/messages.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/messages.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.po")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.po")));

        var jf = new POFile({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        test.ok(jf);

        // should read the file
        jf.extract();

        var translations = new TranslationSet();

        jf.localize(translations, ["fr-FR", "de-DE"]);

        // should produce the files, even if there is nothing to localize in them
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/messages.po")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de/DE/messages.po")));

        test.done();
    },

    testPOFileLocalizeExtractNewStrings: function(test) {
        test.expect(34);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/sparse2.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/de/DE/sparse2.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.po")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.po")));

        var jf = new POFile({
            project: p,
            pathName: "./po/sparse2.po",
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
            datatype: "po"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "la b",
            targetLocale: "fr-FR",
            datatype: "po"
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
            datatype: "po"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "strings/a",
            source: "b",
            sourceLocale: "en-US",
            target: "Die b",
            targetLocale: "de-DE",
            datatype: "po"
        }));

        jf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/sparse2.po")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/de/DE/sparse2.po")));

        // now verify that the strings which did not have translations show up in the
        // new strings translation set
        test.equal(t.newres.size(), 6);
        var resources = t.newres.getAll();
        test.equal(resources.length, 6);

        test.equal(resources[0].getType(), "array");
        test.equal(resources[0].getKey(), "arrays/asdf");
        test.equal(resources[0].getTargetLocale(), "fr-FR");
        var arrayStrings = resources[0].getSourceArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings[0], "value 1");
        test.equal(arrayStrings[1], "value 2");
        test.equal(arrayStrings[2], "value 3");
        arrayStrings = resources[0].getTargetArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings[0], "value 1");
        test.equal(arrayStrings[1], "value 2");
        test.equal(arrayStrings[2], "value 3");

        test.equal(resources[1].getType(), "array");
        test.equal(resources[1].getKey(), "arrays/asdfasdf");
        test.equal(resources[1].getTargetLocale(), "fr-FR");
        var arrayStrings = resources[1].getSourceArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings[0], "1");
        test.equal(arrayStrings[1], "2");
        test.equal(arrayStrings[2], "3");
        arrayStrings = resources[1].getTargetArray();
        test.ok(arrayStrings);
        test.equal(arrayStrings[0], "1");
        test.equal(arrayStrings[1], "2");
        test.equal(arrayStrings[2], "3");

        test.equal(resources[2].getType(), "string");
        test.equal(resources[2].getSource(), "d");
        test.equal(resources[2].getKey(), "strings/c");
        test.equal(resources[2].getTargetLocale(), "fr-FR");

        test.done();
    },

    testPOFileLocalizeWithAlternateFileNameTemplate: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/deep_fr-FR.po"));
        }
        if (fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/deep_de-DE.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.po")));
        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.po")));

        var jf = new POFile({
            project: p,
            pathName: "./po/deep.po",
            type: t
        });
        test.ok(jf);

        // should read the file
        jf.extract();

        // only translate some of the strings
        var translations = new TranslationSet();

        jf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/deep_fr-FR.po")));
        test.ok(fs.existsSync(path.join(base, "testfiles/resources/deep_de-DE.po")));

        test.done();
    },

    testPOFileLocalizeDefaultMethodAndTemplate: function(test) {
        test.expect(4);

        var base = path.dirname(module.id);

        var jf = new POFile({
            project: p,
            pathName: "x/y/str.po",
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
            datatype: "po"
        }));

        // default template is resources/[localeDir]/[filename]
        if (fs.existsSync(path.join(base, "testfiles/resources/fr/FR/str.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/fr/FR/str.po"));
        }

        test.ok(!fs.existsSync(path.join(base, "testfiles/resources/fr/FR/str.po")));

        jf.localize(translations, ["fr-FR"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/resources/fr/FR/str.po")));

        var content = fs.readFileSync(path.join(base, "testfiles/resources/fr/FR/str.po"), "utf-8");

        // default method is copy so this should be the whole file
        var expected =
           '{\n' +
           '    "string 1": "C\'est la chaîne numéro 1",\n' +
           '    "string 2": "this is string two"\n' +
           '}\n';

        diff(content, expected);
        test.equal(content, expected);

        test.done();
    }
};
