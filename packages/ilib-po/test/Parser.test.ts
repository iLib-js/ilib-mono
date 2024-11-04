/*
 * Parser.test.ts - test the po and pot file parser
 *
 * Copyright © 2024 Box, Inc.
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

import path from "node:path";
import fs from "node:fs";

// @ts-ignore
import { Resource, ResourceString, ResourcePlural, ResourceArray } from "ilib-tools-common";
import { describe, test, expect } from "@jest/globals";

import Parser from "../src/Parser";

describe("parser", function() {
    test("Parser Constructor no args", function() {
        expect.assertions(1);

        expect(() => {
            // @ts-ignore
            const parser = new Parser();
        }).toThrow();
    });

    test("Parser parse simple", function() {
        expect.assertions(7);

        const parser = new Parser({
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
            'msgid "string 1"\n');

        expect(set).toBeTruthy();

        const r = set.get(ResourceString.hashKey("foo", "de-DE", "string 1", "po"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("string 1");
        expect(r.getSourceLocale()).toBe("en-US");
        expect(r.getKey()).toBe("string 1");
        expect(r.getType()).toBe("string");
    });

    test("Parser parse with context", function() {
        expect.assertions(7);

        const parser = new Parser({
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
            'msgctxt "context 1"\n' +
            'msgid "string 1"\n'
        );

        expect(set).toBeTruthy();

        var r = set.get(ResourceString.hashKey("foo", "de-DE", "string 1", "po", undefined, "context 1"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("string 1");
        expect(r.getKey()).toBe("string 1");
        expect(r.getType()).toBe("string");
        expect(r.getContext()).toBe("context 1");
    });

    test("Parser parse simple with translation", function() {
        expect.assertions(9);

        const parser = new Parser({
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
            'msgid "string 1"\n' +
            'msgstr "this is string one"\n');

        expect(set).toBeTruthy();

        const r = set.get(ResourceString.hashKey("foo", "de-DE", "string 1", "po"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("string 1");
        expect(r.getSourceLocale()).toBe("en-US");
        expect(r.getKey()).toBe("string 1");
        expect(r.getTarget()).toBe("this is string one");
        expect(r.getTargetLocale()).toBe("de-DE");
        expect(r.getType()).toBe("string");
    });

    test("Parser parse simple right strings", function() {
        expect.assertions(12);

        const parser = new Parser({
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
            'msgid "string 1"\n' +
            'msgstr "this is string one"\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr "this is string two"\n'
        );

        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        const resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getTarget()).toBe("this is string one");
        expect(resources[0].getTargetLocale()).toBe("de-DE");

        expect(resources[1].getSource()).toBe("string 2");
        expect(resources[1].getKey()).toBe("string 2");
        expect(resources[1].getTarget()).toBe("this is string two");
        expect(resources[1].getTargetLocale()).toBe("de-DE");
    });

/*
    test("ParserParsePluralString", function() {
        expect.assertions(9);

        const parser = new Parser({
            project: p,
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n'
        );

        var set = parser.getTranslationSet();
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

    test("ParserParsePluralStringWithTranslations", function() {
        expect.assertions(12);

        const parser = new Parser({
            project: p,
            locale: "de-DE",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n' +
            'msgstr[0] "Ein Objekt"\n' +
            'msgstr[1] "{$count} Objekten"\n'
        );

        var set = parser.getTranslationSet();
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

    test("ParserParsePluralStringWithEmptyTranslations", function() {
        expect.assertions(11);

        const parser = new Parser({
            project: p,
            locale: "de-DE",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n' +
            'msgstr[0] ""\n' +
            'msgstr[1] ""\n'
        );

        var set = parser.getTranslationSet();
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

    test("ParserParsePluralStringWithTranslationsRussian", function() {
        expect.assertions(13);

        const parser = new Parser({
            project: p,
            locale: "ru-RU",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n' +
            'msgstr[0] "{$count} объект"\n' +
            'msgstr[1] "{$count} объекта"\n' +
            'msgstr[2] "{$count} объектов"\n'
        );

        var set = parser.getTranslationSet();
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

    test("ParserParseSimpleLineContinuations", function() {
        expect.assertions(7);

        const parser = new Parser({
            project: p,
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
            'msgid "string 1"\n' +
            '" and more string 1"\n' +
            'msgstr "this is string one "\n' +
            '"or the translation thereof. "\n' +
            '"Next line."\n'
        );

        var set = parser.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1 and more string 1");
        expect(resources[0].getKey()).toBe("string 1 and more string 1");
        expect(resources[0].getTarget()).toBe("this is string one or the translation thereof. Next line.");
    });

    test("ParserParseSimpleLineContinuationsWithEmptyString", function() {
        expect.assertions(7);

        const parser = new Parser({
            project: p,
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
            'msgid ""\n' +
            '"string 1"\n' +
            '" and more string 1"\n' +
            'msgstr ""\n' +
            '"this is string one "\n' +
            '"or the translation thereof. "\n' +
            '"Next line."\n'
        );

        var set = parser.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1 and more string 1");
        expect(resources[0].getKey()).toBe("string 1 and more string 1");
        expect(resources[0].getTarget()).toBe("this is string one or the translation thereof. Next line.");
    });

    test("ParserParseEscapedQuotes", function() {
        expect.assertions(6);

        const parser = new Parser({
            project: p,
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
            'msgid "string \\"quoted\\" 1"\n');

        var set = parser.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("foo", "", "en-US", 'string "quoted" 1', "po"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe('string "quoted" 1');
        expect(r.getKey()).toBe('string "quoted" 1');
        expect(r.getType()).toBe('string');
    });

    test("ParserParseEmptyTranslation", function() {
        expect.assertions(12);

        const parser = new Parser({
            project: p,
            type: t
        });
        expect(parser).toBeTruthy();

        // only source strings
        parser.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var set = parser.getTranslationSet();
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

    test("ParserParseEmptySource", function() {
        expect.assertions(3);

        const parser = new Parser({
            project: p,
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
            'msgid ""\n' +
            'msgstr "string 1"\n' +
            '\n' +
            'msgid ""\n' +
            'msgstr "string 2"\n'
        );

        var set = parser.getTranslationSet();
        expect(set).toBeTruthy();

        // no source = no string to translate!
        expect(set.size()).toBe(0);
    });

    test("ParserParseFileHeader", function() {
        expect.assertions(3);

        const parser = new Parser({
            project: p,
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
            '#, fuzzy\n' +
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  messages.pot  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n'
        );

        var set = parser.getTranslationSet();
        expect(set).toBeTruthy();

        // no source = no string to translate!
        expect(set.size()).toBe(0);
    });

    test("ParserParseDupString", function() {
        expect.assertions(8);

        const parser = new Parser({
            project: p,
            type: t
        });
        expect(parser).toBeTruthy();

        // only source strings
        parser.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n'
        );

        var set = parser.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(!resources[0].getTarget()).toBeTruthy();
        expect(!resources[0].getTargetLocale()).toBeTruthy();
    });

    test("ParserParseSameStringDifferentContext", function() {
        expect.assertions(14);

        const parser = new Parser({
            project: p,
            type: t
        });
        expect(parser).toBeTruthy();

        // only source strings
        parser.parse(
            'msgctxt "context 1"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgctxt "context 2"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n'
        );

        var set = parser.getTranslationSet();
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

    test("ParserParseSameStringContextInKey", function() {
        expect.assertions(14);

        const parser = new Parser({
            project: p,
            pathName: "foo/bar/context.po",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
            'msgctxt "context 1"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgctxt "context 2"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n'
        );

        var set = parser.getTranslationSet();
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

    test("ParserParseTestInvalidPO", function() {
        expect.assertions(2);

        // when it's named messages.po, it should apply the messages-schema schema
        const parser = new Parser({
            project: p,
            pathName: "i18n/deep.po",
            type: t
        });
        expect(parser).toBeTruthy();

        expect(function(test) {
            // that's not a po file!
            parser.parse(
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

    test("ParserParseExtractComments", function() {
        expect.assertions(12);

        const parser = new Parser({
            project: p,
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var set = parser.getTranslationSet();
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

    test("ParserParseExtractFileNameNoLineNumbers", function() {
        expect.assertions(12);

        const parser = new Parser({
            project: p,
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
            '#: src/foo.html src/bar.html\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            '#: src/bar.html\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );

        var set = parser.getTranslationSet();
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

    test("ParserParseClearComments", function() {
        expect.assertions(12);

        const parser = new Parser({
            project: p,
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var set = parser.getTranslationSet();
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

    test("ParserParseExtractMultiplePaths", function() {
        expect.assertions(8);

        const parser = new Parser({
            project: p,
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
            '#: src/foo.html:32\n' +
            '#: src/bar.html:32\n' +
            '#: src/asdf.html:32\n' +
            '#: src/xyz.html:32\n' +
            '#: src/abc.html:32\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n'
        );

        var set = parser.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getComment()).toBe('{"paths":["src/foo.html:32","src/bar.html:32","src/asdf.html:32","src/xyz.html:32","src/abc.html:32"]}');
        expect(resources[0].getPath()).toBe("src/foo.html");
    });

    test("ParserParseExtractMultipleComments", function() {
        expect.assertions(7);

        const parser = new Parser({
            project: p,
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var set = parser.getTranslationSet();
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

    test("ParserParseIgnoreComments", function() {
        expect.assertions(7);

        const parser = new Parser({
            project: p,
            type: t,
            pathName: "foo/bar/ignore2.po"   // picks the right mapping
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var set = parser.getTranslationSet();
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

    test("ParserParseIgnoreAllComments", function() {
        expect.assertions(7);

        const parser = new Parser({
            project: p,
            type: t,
            pathName: "foo/bar/ignore1.po"   // picks the right mapping
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var set = parser.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        var resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(!resources[0].getComment()).toBeTruthy();
    });

    test("ParserExtractFile", function() {
        expect.assertions(17);

        var base = path.dirname(module.id);

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

        var set = parser.getTranslationSet();

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

    test("ParserExtractUndefinedFile", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        const parser = new Parser({
            project: p,
            type: t
        });
        expect(parser).toBeTruthy();

        // should attempt to read the file and not fail
        parser.extract();

        var set = parser.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("ParserExtractBogusFile", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        const parser = new Parser({
            project: p,
            pathName: "./po/bogus.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should attempt to read the file and not fail
        parser.extract();

        var set = parser.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("ParserLocalizeTextSimple", function() {
        expect.assertions(2);

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var actual = parser.localizeText(translations, "fr-FR");
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

    test("ParserLocalizeTextMultiple", function() {
        expect.assertions(2);

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var actual = parser.localizeText(translations, "fr-FR");
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

    test("ParserLocalizeTextPreserveComments", function() {
        expect.assertions(2);

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var actual = parser.localizeText(translations, "fr-FR");
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

    test("ParserLocalizeTextPreserveMultipleComments", function() {
        expect.assertions(2);

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var actual = parser.localizeText(translations, "fr-FR");
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

    test("ParserLocalizeTextWithEscapedQuotes", function() {
        expect.assertions(2);

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var actual = parser.localizeText(translations, "fr-FR");
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

    test("ParserLocalizeTextWithContext", function() {
        expect.assertions(2);

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var actual = parser.localizeText(translations, "fr-FR");
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

    test("ParserLocalizeTextWithContextInKey", function() {
        expect.assertions(2);

        const parser = new Parser({
            project: p,
            pathName: "./po/context.po",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var actual = parser.localizeText(translations, "fr-FR");
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

    test("ParserLocalizeTextWithNoActualTranslation", function() {
        expect.assertions(2);

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var actual = parser.localizeText(translations, "fr-FR");
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

    test("ParserLocalizeTextUsePseudoForMissingTranslations", function() {
        expect.assertions(2);

        const parser = new Parser({
            project: p2,
            pathName: "./po/messages.po",
            type: t2
        });
        expect(parser).toBeTruthy();

        parser.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgid_plural "string 2 plural"\n'
        );

        var translations = new TranslationSet();

        var actual = parser.localizeText(translations, "fr-FR");
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

    test("ParserLocalizeTextWithExistingTranslations", function() {
        expect.assertions(2);

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var actual = parser.localizeText(translations, "fr-FR");
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

    test("ParserLocalizeTextPluralsWithNoActualTranslation", function() {
        expect.assertions(2);

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var actual = parser.localizeText(translations, "fr-FR");
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

    test("ParserLocalizeTextHeaderLocaleFull", function() {
        expect.assertions(2);

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.pot",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var actual = parser.localizeText(translations, "fr-FR");
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

    test("ParserLocalizeTextHeaderLocaleAbbreviated", function() {
        expect.assertions(2);

        const parser = new Parser({
            project: p,
            pathName: "./po/template.po",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var actual = parser.localizeText(translations, "fr-FR");
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

    test("ParserLocalizeTextHeaderLocaleMapped", function() {
        expect.assertions(2);

        const parser = new Parser({
            project: p,
            pathName: "./po/foo.po",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        var actual = parser.localizeText(translations, "fr-FR");
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

    test("ParserLocalize", function() {
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

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

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

        parser.localize(translations, ["fr-FR", "de-DE"]);

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

    test("ParserLocalizeNoTranslations", function() {
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

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

        var translations = new TranslationSet();

        parser.localize(translations, ["fr-FR", "de-DE"]);

        // should produce the files, even if there is nothing to localize in them
        expect(fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))).toBeTruthy();
    });

    test("ParserLocalizeExtractNewStrings", function() {
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

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // make sure we start off with no new strings
        t.newres.clear();
        expect(t.newres.size()).toBe(0);

        // should read the file
        parser.extract();

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

        parser.localize(translations, ["fr-FR", "de-DE"]);

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

    test("ParserLocalizeWithAlternateFileNameTemplate", function() {
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

        const parser = new Parser({
            project: p,
            pathName: "./po/template.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

        // only translate some of the strings
        var translations = new TranslationSet();

        parser.localize(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/template_fr-FR.po"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/template_de-DE.po"))).toBeTruthy();
    });

    test("ParserLocalizeWithAlternateLocaleMapping", function() {
        expect.assertions(3);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "./testfiles/po/no.po"))) {
            fs.unlinkSync(path.join(base, "./testfiles/po/no.po"));
        }

        expect(!fs.existsSync(path.join(base, "./testfiles/po/no.po"))).toBeTruthy();

        const parser = new Parser({
            project: p,
            pathName: "./po/foo.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

        var translations = new TranslationSet();

        // should use the locale map in the mapping rather than the shared one
        parser.localize(translations, ["nb-NO"]);

        expect(fs.existsSync(path.join(base, "./testfiles/po/no.po"))).toBeTruthy();
    });

    test("ParserLocalizeWithAlternateLocaleMappingRightContents", function() {
        expect.assertions(4);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "./testfiles/po/no.po"))) {
            fs.unlinkSync(path.join(base, "./testfiles/po/no.po"));
        }

        expect(!fs.existsSync(path.join(base, "./testfiles/po/no.po"))).toBeTruthy();

        const parser = new Parser({
            project: p,
            pathName: "./po/foo.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

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
        parser.localize(translations, ["nb-NO"]);

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

    test("ParserLocalizeWithSharedLocaleMapping", function() {
        expect.assertions(3);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/template_nb.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/template_nb.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/template_nb.po"))).toBeTruthy();

        const parser = new Parser({
            project: p,
            pathName: "./po/template.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

        var translations = new TranslationSet();

        // should use the shared locale map because there isn't one in the mapping
        parser.localize(translations, ["nb-NO"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/template_nb.po"))).toBeTruthy();
    });

    test("ParserLocalizeWithSharedLocaleMappingRightContents", function() {
        expect.assertions(4);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/template_nb.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/template_nb.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/template_nb.po"))).toBeTruthy();

        const parser = new Parser({
            project: p,
            pathName: "./po/template.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

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
        parser.localize(translations, ["nb-NO"]);

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

    test("ParserLocalizeDefaultTemplate", function() {
        expect.assertions(4);

        var base = path.dirname(module.id);

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(parser).toBeTruthy();

        parser.parse(
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

        parser.localize(translations, ["fr-FR"]);

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

    test("ParserExtractLocalizedFiles", function() {
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

        const parser = new Parser({
            project: p,
            pathName: "./po/messages.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

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

        parser.localize(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/resources/fr-FR.po"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/resources/de-DE.po"))).toBeTruthy();

        parser = new Parser({
            project: p,
            pathName: "./resources/fr-FR.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

        // now verify that the resources it created have the right target locale
        // based on the file name

        var set = parser.getTranslationSet();

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

        parser = new Parser({
            project: p,
            pathName: "./resources/de-DE.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

        // now verify that the resources it created have the right target locale
        // based on the file name

        var set = parser.getTranslationSet();

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

    test("ParserExtractLocalizedFilesNoMappings", function() {
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
                path.join(process.cwd(), "ParserType")
            ]
        }, "./test/testfiles", {
            locales:["en-GB"],
            targetDir: ".",
        });
        var t2 = new ParserType(p2);

        const parser = new Parser({
            project: p2,
            pathName: "./po/messages.po",
            type: t2
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

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

        parser.localize(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/po/fr-FR.po"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/po/de-DE.po"))).toBeTruthy();

        parser = new Parser({
            project: p,
            pathName: "./po/fr-FR.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

        // now verify that the resources it created have the right target locale
        // based on the file name

        var set = parser.getTranslationSet();

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

        parser = new Parser({
            project: p,
            pathName: "./po/de-DE.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

        // now verify that the resources it created have the right target locale
        // based on the file name

        var set = parser.getTranslationSet();

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

    test("ParserExtractLocalizedFilesNoMappingsRussian", function() {
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
                path.join(process.cwd(), "ParserType")
            ]
        }, "./test/testfiles", {
            locales:["en-GB"],
            targetDir: ".",
        });
        var t2 = new ParserType(p2);

        const parser = new Parser({
            project: p2,
            pathName: "./po/messages.po",
            type: t2
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

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

        parser.localize(translations, ["ru-RU"]);

        expect(fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        parser = new Parser({
            project: p,
            pathName: "./po/ru-RU.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

        // now verify that the resources it created have the right target locale
        // based on the file name

        var set = parser.getTranslationSet();

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

    test("ParserWriteSourceOnly", function() {
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
                path.join(process.cwd(), "ParserType")
            ]
        }, "./test/testfiles", {
            locales:["en-GB"],
            targetDir: ".",
        });
        var t2 = new ParserType(p2);

        const parser = new Parser({
            project: p2,
            pathName: "./po/ru-RU.po",
            type: t2,
            locale: "ru-RU"
        });
        expect(parser).toBeTruthy();


        parser.addResource(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            datatype: "po"
        }));
        parser.addResource(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            datatype: "po"
        }));
        parser.addResource(new ResourcePlural({
            project: "foo",
            key: "one string",
            sourceStrings: {
                "one": "one string",
                "other": "{$count} strings"
            },
            sourceLocale: "en-US",
            datatype: "po"
        }));
        parser.addResource(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            datatype: "po"
        }));

        expect(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        parser.write();

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

    test("ParserWriteWithTranslation", function() {
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
                path.join(process.cwd(), "ParserType")
            ]
        }, "./test/testfiles", {
            locales:["en-GB"],
            targetDir: ".",
        });
        var t2 = new ParserType(p2);

        const parser = new Parser({
            project: p2,
            pathName: "./po/ru-RU.po",
            type: t2,
            locale: "ru-RU"
        });
        expect(parser).toBeTruthy();


        parser.addResource(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "строка 1",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        parser.addResource(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "строка 2",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        parser.addResource(new ResourcePlural({
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
        parser.addResource(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            target: "строка 3 и 4",
            targetLocale: "ru-RU",
            datatype: "po"
        }));

        expect(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        parser.write();

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

    test("ParserWriteWithMissingTranslations", function() {
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
                path.join(process.cwd(), "ParserType")
            ]
        }, "./test/testfiles", {
            locales:["en-GB"],
            targetDir: ".",
        });
        var t2 = new ParserType(p2);

        const parser = new Parser({
            project: p2,
            pathName: "./po/ru-RU.po",
            type: t2,
            locale: "ru-RU"
        });
        expect(parser).toBeTruthy();


        parser.addResource(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "строка 1",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        parser.addResource(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        parser.addResource(new ResourcePlural({
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
        parser.addResource(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            targetLocale: "ru-RU",
            datatype: "po"
        }));

        expect(!fs.existsSync(path.join(base, "testfiles/po/ru-RU.po"))).toBeTruthy();

        parser.write();

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

    test("ParserWriteWrongTargetLocale", function() {
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
                path.join(process.cwd(), "ParserType")
            ]
        }, "./test/testfiles", {
            locales:["en-GB"],
            targetDir: ".",
        });
        var t2 = new ParserType(p2);

        const parser = new Parser({
            project: p2,
            pathName: "./po/de-DE.po",
            type: t2,
            locale: "de-DE"
        });
        expect(parser).toBeTruthy();

        // should add these as source-only resources
        parser.addResource(new ContextResourceString({
            project: "foo",
            key: "string 1",
            source: "string 1",
            sourceLocale: "en-US",
            target: "строка 1",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        parser.addResource(new ContextResourceString({
            project: "foo",
            key: "string 2",
            source: "string 2",
            sourceLocale: "en-US",
            target: "строка 2",
            targetLocale: "ru-RU",
            datatype: "po"
        }));
        parser.addResource(new ResourcePlural({
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
        parser.addResource(new ContextResourceString({
            project: "foo",
            key: "string 3 and 4",
            source: "string 3 and 4",
            sourceLocale: "en-US",
            target: "строка 3 и 4",
            targetLocale: "ru-RU",
            datatype: "po"
        }));

        expect(!fs.existsSync(path.join(base, "testfiles/po/de-DE.po"))).toBeTruthy();

        parser.write();

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

    test("ParserLocalizeWithHeaderLocaleFull", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/po/ru.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/po/ru.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/po/ru.po"))).toBeTruthy();

        const parser = new Parser({
            project: p,
            pathName: "./po/template.pot",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

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

        parser.localize(translations, ["ru-RU"]);

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

    test("ParserLocalizeWithHeaderLocaleAbbreviated", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        if (fs.existsSync(path.join(base, "testfiles/resources/template_ru-RU.po"))) {
            fs.unlinkSync(path.join(base, "testfiles/resources/template_ru-RU.po"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/resources/template_ru-RU.po"))).toBeTruthy();

        const parser = new Parser({
            project: p,
            pathName: "./po/template.po",
            type: t
        });
        expect(parser).toBeTruthy();

        // should read the file
        parser.extract();

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

        parser.localize(translations, ["ru-RU"]);

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
    */
});
