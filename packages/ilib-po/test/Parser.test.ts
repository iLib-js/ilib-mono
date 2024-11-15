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


// @ts-ignore
import { ResourceString } from "ilib-tools-common";
import { describe, test, expect } from "@jest/globals";

import Parser from "../src/Parser";
import { CommentType } from "../src/utils";

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

        const r = set.get(ResourceString.hashKey("foo", "en-US", "string 1", "po"));
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

        const r = set.get(ResourceString.hashKey("foo", "en-US", "string 1", "po", undefined, "context 1"));
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

    test("ParserParsePluralString", function() {
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
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n'
        );

        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        const resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getType()).toBe("plural");
        const strings = resources[0].getSource();
        expect(strings.one).toBe("one object");
        expect(strings.other).toBe("{$count} objects");
        expect(resources[0].getKey()).toBe("one object");
        expect(resources[0].getTarget()).toBeFalsy();
    });

    test("ParserParsePluralStringWithTranslations", function() {
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
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n' +
            'msgstr[0] "Ein Objekt"\n' +
            'msgstr[1] "{$count} Objekten"\n'
        );
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        const resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getType()).toBe("plural");
        let strings = resources[0].getSource();
        expect(strings.one).toBe("one object");
        expect(strings.other).toBe("{$count} objects");
        expect(resources[0].getKey()).toBe("one object");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        strings = resources[0].getTarget();
        expect(strings.one).toBe("Ein Objekt");
        expect(strings.other).toBe("{$count} Objekten");
        expect(resources[0].getTargetLocale()).toBe("de-DE");
    });

    test("ParserParsePluralStringWithEmptyTranslations", function() {
        expect.assertions(11);

        const parser = new Parser({
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n' +
            'msgstr[0] ""\n' +
            'msgstr[1] ""\n'
        );
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        const resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getType()).toBe("plural");
        const strings = resources[0].getSource();
        expect(strings.one).toBe("one object");
        expect(strings.other).toBe("{$count} objects");
        expect(resources[0].getKey()).toBe("one object");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getTarget()).toBeFalsy();
        expect(resources[0].getTargetLocale()).toBeFalsy();
    });

    test("ParserParsePluralStringWithTranslationsRussian", function() {
        expect.assertions(13);

        const parser = new Parser({
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "ru-RU",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
            'msgid "one object"\n' +
            'msgid_plural "{$count} objects"\n' +
            'msgstr[0] "{$count} объект"\n' +
            'msgstr[1] "{$count} объекта"\n' +
            'msgstr[2] "{$count} объектов"\n'
        );
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        const resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getType()).toBe("plural");
        let strings = resources[0].getSource();
        expect(strings.one).toBe("one object");
        expect(strings.other).toBe("{$count} objects");
        expect(resources[0].getKey()).toBe("one object");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        strings = resources[0].getTarget();
        expect(strings.one).toBe("{$count} объект");
        expect(strings.few).toBe("{$count} объекта");
        expect(strings.other).toBe("{$count} объектов");
        expect(resources[0].getTargetLocale()).toBe("ru-RU");
    });

    test("ParserParseSimpleLineContinuations", function() {
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
            'msgid "string 1"\n' +
            '" and more string 1"\n' +
            'msgstr "this is string one "\n' +
            '"or the translation thereof. "\n' +
            '"Next line."\n'
        );
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        const resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1 and more string 1");
        expect(resources[0].getKey()).toBe("string 1 and more string 1");
        expect(resources[0].getTarget()).toBe("this is string one or the translation thereof. Next line.");
    });

    test("ParserParseSimpleLineContinuationsWithEmptyString", function() {
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
            'msgid ""\n' +
            '"string 1"\n' +
            '" and more string 1"\n' +
            'msgstr ""\n' +
            '"this is string one "\n' +
            '"or the translation thereof. "\n' +
            '"Next line."\n'
        );
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        const resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1 and more string 1");
        expect(resources[0].getKey()).toBe("string 1 and more string 1");
        expect(resources[0].getTarget()).toBe("this is string one or the translation thereof. Next line.");
    });

    test("ParserParseEscapedQuotes", function() {
        expect.assertions(6);

        const parser = new Parser({
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
            'msgid "string \\"quoted\\" 1"\n');
        expect(set).toBeTruthy();

        const r = set.get(ResourceString.hashKey("foo", "en-US", 'string "quoted" 1', "po"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe('string "quoted" 1');
        expect(r.getKey()).toBe('string "quoted" 1');
        expect(r.getType()).toBe('string');
    });

    test("ParserParseEmptyTranslation", function() {
        expect.assertions(12);

        const parser = new Parser({
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        // only source strings
        const set = parser.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        const resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getTarget()).toBeFalsy();
        expect(resources[0].getTargetLocale()).toBeFalsy();

        expect(resources[1].getSource()).toBe("string 2");
        expect(resources[1].getKey()).toBe("string 2");
        expect(resources[1].getTarget()).toBeFalsy();
        expect(resources[1].getTargetLocale()).toBeFalsy();
    });

    test("ParserParseEmptySource", function() {
        expect.assertions(3);

        const parser = new Parser({
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
            'msgid ""\n' +
            'msgstr "string 1"\n' +
            '\n' +
            'msgid ""\n' +
            'msgstr "string 2"\n'
        );
        expect(set).toBeTruthy();

        // no source = no string to translate!
        expect(set.size()).toBe(0);
    });

    test("ParserParseFileHeader", function() {
        expect.assertions(3);

        const parser = new Parser({
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
            '#, fuzzy\n' +
            'msgid ""\n' +
            'msgstr ""\n' +
            '"#-#-#-#-#  messages.pot  #-#-#-#-#\\n"\n' +
            '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
            '"Content-Transfer-Encoding: 8bit\\n"\n' +
            '"Generated-By: loctool\\n"\n' +
            '"Project-Id-Version: 1\\n"\n'
        );
        expect(set).toBeTruthy();

        // no source = no string to translate!
        expect(set.size()).toBe(0);
    });

    test("ParserParseDupString", function() {
        expect.assertions(8);

        const parser = new Parser({
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        // only source strings
        const set = parser.parse(
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n'
        );
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        const resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getTarget()).toBeFalsy();
        expect(resources[0].getTargetLocale()).toBeFalsy();
    });

    test("ParserParseSameStringDifferentContext", function() {
        expect.assertions(14);

        const parser = new Parser({
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        // only source strings
        const set = parser.parse(
            'msgctxt "context 1"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgctxt "context 2"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n'
        );
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        const resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getContext()).toBe("context 1");
        expect(resources[0].getTarget()).toBeFalsy();
        expect(resources[0].getTargetLocale()).toBeFalsy();

        expect(resources[1].getSource()).toBe("string 1");
        expect(resources[1].getKey()).toBe("string 1");
        expect(resources[1].getContext()).toBe("context 2");
        expect(resources[1].getTarget()).toBeFalsy();
        expect(resources[1].getTargetLocale()).toBeFalsy();
    });

    test("ParserParseSameStringContextInKey", function() {
        expect.assertions(14);

        const parser = new Parser({
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po",
            contextInKey: true
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
            'msgctxt "context 1"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            'msgctxt "context 2"\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n'
        );
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        const resources = set.getAll();
        expect(resources.length).toBe(2);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1 --- context 1");
        expect(resources[0].getContext()).toBe("context 1");
        expect(resources[0].getTarget()).toBeFalsy();
        expect(resources[0].getTargetLocale()).toBeFalsy();

        expect(resources[1].getSource()).toBe("string 1");
        expect(resources[1].getKey()).toBe("string 1 --- context 2");
        expect(resources[1].getContext()).toBe("context 2");
        expect(resources[1].getTarget()).toBeFalsy();
        expect(resources[1].getTargetLocale()).toBeFalsy();
    });

    test("ParserParseTestInvalidPO", function() {
        expect.assertions(2);

        // when it's named messages.po, it should apply the messages-schema schema
        const parser = new Parser({
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        expect(() => {
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
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        const resources = set.getAll();
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
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
            '#: src/foo.html src/bar.html\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n' +
            '#: src/bar.html\n' +
            'msgid "string 2"\n' +
            'msgstr ""\n'
        );
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        const resources = set.getAll();
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
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);
        const resources = set.getAll();
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
        expect(resources[1].getComment()).toBeFalsy();
        expect(resources[1].getPath()).toBeFalsy();
    });

    test("ParserParseExtractMultiplePaths", function() {
        expect.assertions(8);

        const parser = new Parser({
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po"
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
            '#: src/foo.html:32\n' +
            '#: src/bar.html:32\n' +
            '#: src/asdf.html:32\n' +
            '#: src/xyz.html:32\n' +
            '#: src/abc.html:32\n' +
            'msgid "string 1"\n' +
            'msgstr ""\n' +
            '\n'
        );
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        const resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getComment()).toBe('{"paths":["src/foo.html:32","src/bar.html:32","src/asdf.html:32","src/xyz.html:32","src/abc.html:32"]}');
        expect(resources[0].getPath()).toBe("src/foo.html");
    });

    test("ParserParseExtractMultipleComments", function() {
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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        const resources = set.getAll();
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
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po",
            ignoreComments: new Set([CommentType.FLAGS, CommentType.PATHS])
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        const resources = set.getAll();
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
            pathName: "./testfiles/po/messages.po",
            sourceLocale: "en-US",
            targetLocale: "de-DE",
            projectName: "foo",
            datatype: "po",
            ignoreComments: true
        });
        expect(parser).toBeTruthy();

        const set = parser.parse(
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
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
        const resources = set.getAll();
        expect(resources.length).toBe(1);

        expect(resources[0].getSource()).toBe("string 1");
        expect(resources[0].getKey()).toBe("string 1");
        expect(resources[0].getComment()).toBeFalsy();
    });
});
