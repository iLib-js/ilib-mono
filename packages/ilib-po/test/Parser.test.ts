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

import { ResourceString } from "ilib-tools-common";

import Parser from "../src/Parser";
import { CommentType } from "../src/utils";

describe("parser", () => {
  test("Parser Constructor no args", () => {
    expect.assertions(1);

    expect(() => {
      // @ts-expect-error -- testing invalid args
      const parser = new Parser();
    }).toThrow();
  });

  test("Parser parse simple", () => {
    expect.assertions(7);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse('msgid "string 1"\n');

    expect(set).toBeTruthy();

    const r = set.get(ResourceString.hashKey("foo", "en-US", "string 1", "po"));
    expect(r).toBeTruthy();

    expect(r.getSource()).toBe("string 1");
    expect(r.getSourceLocale()).toBe("en-US");
    expect(r.getKey()).toBe("string 1");
    expect(r.getType()).toBe("string");
  });

  test("Parser parse with context", () => {
    expect.assertions(7);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse('msgctxt "context 1"\n' + 'msgid "string 1"\n');

    expect(set).toBeTruthy();

    const r = set.get(
      ResourceString.hashKey(
        "foo",
        "en-US",
        "string 1",
        "po",
        undefined,
        "context 1",
      ),
    );
    expect(r).toBeTruthy();

    expect(r.getSource()).toBe("string 1");
    expect(r.getKey()).toBe("string 1");
    expect(r.getType()).toBe("string");
    expect(r.getContext()).toBe("context 1");
  });

  test("Parser parse simple with translation", () => {
    expect.assertions(9);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid "string 1"\n' + 'msgstr "this is string one"\n',
    );

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

  test("Parser parse simple right strings", () => {
    expect.assertions(12);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid "string 1"\n' +
        'msgstr "this is string one"\n' +
        "\n" +
        'msgid "string 2"\n' +
        'msgstr "this is string two"\n',
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

  test("Parser parse strings that have a key that is different than the source", () => {
    expect.assertions(12);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      "#k str1\n" +
        'msgid "string 1"\n' +
        'msgstr "this is string one"\n' +
        "\n" +
        "#k str2\n" +
        'msgid "string 2"\n' +
        'msgstr "this is string two"\n',
    );

    expect(set).toBeTruthy();

    expect(set.size()).toBe(2);
    const resources = set.getAll();
    expect(resources.length).toBe(2);

    expect(resources[0].getSource()).toBe("string 1");
    expect(resources[0].getKey()).toBe("str1");
    expect(resources[0].getTarget()).toBe("this is string one");
    expect(resources[0].getTargetLocale()).toBe("de-DE");

    expect(resources[1].getSource()).toBe("string 2");
    expect(resources[1].getKey()).toBe("str2");
    expect(resources[1].getTarget()).toBe("this is string two");
    expect(resources[1].getTargetLocale()).toBe("de-DE");
  });

  test("Parser parse glean target locale from the parsed file", () => {
    expect.assertions(9);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid ""\n' +
        'msgstr ""\n' +
        '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
        '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
        '"Content-Transfer-Encoding: 8bit\\n"\n' +
        '"Generated-By: loctool\\n"\n' +
        '"Project-Id-Version: 1\\n"\n' +
        '"Language: de-DE\\n"\n' +
        '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
        "\n" +
        'msgid "string 1"\n' +
        'msgstr "this is string one"\n',
    );

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

  test("ParserParsePluralString", () => {
    expect.assertions(9);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid "one object"\n' + 'msgid_plural "{$count} objects"\n',
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

  test("ParserParsePluralStringWithTranslations", () => {
    expect.assertions(12);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid "one object"\n' +
        'msgid_plural "{$count} objects"\n' +
        'msgstr[0] "Ein Objekt"\n' +
        'msgstr[1] "{$count} Objekten"\n',
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

  test("ParserParse plural string with translations and a key that is different than the singular", () => {
    expect.assertions(12);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      "#k plural1\n" +
        'msgid "one object"\n' +
        'msgid_plural "{$count} objects"\n' +
        'msgstr[0] "Ein Objekt"\n' +
        'msgstr[1] "{$count} Objekten"\n',
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(1);
    const resources = set.getAll();
    expect(resources.length).toBe(1);

    expect(resources[0].getType()).toBe("plural");
    let strings = resources[0].getSource();
    expect(strings.one).toBe("one object");
    expect(strings.other).toBe("{$count} objects");
    expect(resources[0].getKey()).toBe("plural1");
    expect(resources[0].getSourceLocale()).toBe("en-US");
    strings = resources[0].getTarget();
    expect(strings.one).toBe("Ein Objekt");
    expect(strings.other).toBe("{$count} Objekten");
    expect(resources[0].getTargetLocale()).toBe("de-DE");
  });

  test("ParserParsePluralStringWithEmptyTranslations", () => {
    expect.assertions(11);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid "one object"\n' +
        'msgid_plural "{$count} objects"\n' +
        'msgstr[0] ""\n' +
        'msgstr[1] ""\n',
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

  test("ParserParsePluralStringWithTranslationsRussian", () => {
    expect.assertions(13);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "ru-RU",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid "one object"\n' +
        'msgid_plural "{$count} objects"\n' +
        'msgstr[0] "{$count} объект"\n' +
        'msgstr[1] "{$count} объекта"\n' +
        'msgstr[2] "{$count} объектов"\n',
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

  test("Parser correctly parses all Polish plural categories from PO file and recognizes them as 'one', 'few', and 'many'", () => {
    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "pl-PL",
      projectName: "boo",
      datatype: "po",
    });

    const set = parser.parse(`
            msgid "Your item"
            msgid_plural "Selected items"
            msgstr[0] "ONE Twój element"
            msgstr[1] "FEW Wybrane elementy"
            msgstr[2] "MANY Wybrane elementy"
        `);

    const resource = set.getAll()[0];
    const type = resource.getType();
    const locale = resource.getTargetLocale();
    const source = resource.getSource();
    const target = resource.getTarget();

    expect(type).toBe("plural");
    expect(locale).toBe("pl-PL");
    expect(source).toEqual({
      one: "Your item",
      other: "Selected items",
    });
    expect(target).toEqual(
      expect.objectContaining({
        one: "ONE Twój element",
        few: "FEW Wybrane elementy",
        many: "MANY Wybrane elementy",
      }),
    );
  });

  test("Parser backfills the plural 'other' category with the 'many' category for the Polish language", () => {
    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "pl-PL",
      projectName: "boo",
      datatype: "po",
    });

    const set = parser.parse(`
            msgid "Your item"
            msgid_plural "Selected items"
            msgstr[0] "ONE Twój element"
            msgstr[1] "FEW Wybrane elementy"
            msgstr[2] "MANY Wybrane elementy"
        `);

    const resource = set.getAll()[0];
    const target = resource.getTarget();

    expect(target.many).toEqual("MANY Wybrane elementy");
    expect(target.other).toEqual(target.many);
  });

  test("ParserParsePluralStringWithTranslations With Locale From Header", () => {
    expect.assertions(13);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid ""\n' +
        'msgstr ""\n' +
        '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
        '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
        '"Content-Transfer-Encoding: 8bit\\n"\n' +
        '"Generated-By: loctool\\n"\n' +
        '"Project-Id-Version: 1\\n"\n' +
        '"Language: ru-RU\\n"\n' +
        '"Plural-Forms: nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;\\n"\n' +
        "\n" +
        'msgid "one object"\n' +
        'msgid_plural "{$count} objects"\n' +
        'msgstr[0] "{$count} объект"\n' +
        'msgstr[1] "{$count} объекта"\n' +
        'msgstr[2] "{$count} объектов"\n',
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

  test("ParserParsePluralStringWithTranslations Skip When Too Many Categories", () => {
    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "ru-RU",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid "one object"\n' +
        'msgid_plural "{$count} objects"\n' +
        'msgstr[0] "{$count} объект"\n' +
        'msgstr[1] "{$count} объекта"\n' +
        'msgstr[2] "{$count} объектов"\n' +
        'msgstr[3] "{$count} fourth-category-translation"\n',
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(0);
    const resources = set.getAll();
    expect(resources.length).toBe(0);
  });

  test("ParserParsePluralString With Unsupported Locale From Header Fallback To English", () => {
    expect.assertions(12);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid ""\n' +
        'msgstr ""\n' +
        '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
        '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
        '"Content-Transfer-Encoding: 8bit\\n"\n' +
        '"Generated-By: loctool\\n"\n' +
        '"Project-Id-Version: 1\\n"\n' +
        '"Language: xx-YY\\n"\n' +
        '"Plural-Forms: nplurals=2; plural=n != 1;\\n"\n' +
        "\n" +
        'msgid "one object"\n' +
        'msgid_plural "{$count} objects"\n' +
        'msgstr[0] "{$count} first-category-translation"\n' +
        'msgstr[1] "{$count} second-category-translation"\n',
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
    expect(strings.one).toBe("{$count} first-category-translation");
    expect(strings.other).toBe("{$count} second-category-translation");
    expect(resources[0].getTargetLocale()).toBe("xx-YY");
  });

  test("ParserParsePluralString With Unsupported Locale From Header With More Categories Than English", () => {
    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid ""\n' +
        'msgstr ""\n' +
        '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
        '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
        '"Content-Transfer-Encoding: 8bit\\n"\n' +
        '"Generated-By: loctool\\n"\n' +
        '"Project-Id-Version: 1\\n"\n' +
        '"Language: yy-ZZ\\n"\n' +
        '"Plural-Forms: nplurals=3; plural=n%3;\\n"\n' +
        "\n" +
        'msgid "one object"\n' +
        'msgid_plural "{$count} objects"\n' +
        'msgstr[0] "{$count} first-category-translation"\n' +
        'msgstr[1] "{$count} second-category-translation"\n' +
        'msgstr[2] "{$count} third-category-translation"\n',
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(0);
    const resources = set.getAll();
    expect(resources.length).toBe(0);
    // skipped because there are too many categories
  });

  test("ParserParseSimpleLineContinuations", () => {
    expect.assertions(7);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid "string 1"\n' +
        '" and more string 1"\n' +
        'msgstr "this is string one "\n' +
        '"or the translation thereof. "\n' +
        '"Next line."\n',
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(1);
    const resources = set.getAll();
    expect(resources.length).toBe(1);

    expect(resources[0].getSource()).toBe("string 1 and more string 1");
    expect(resources[0].getKey()).toBe("string 1 and more string 1");
    expect(resources[0].getTarget()).toBe(
      "this is string one or the translation thereof. Next line.",
    );
  });

  test("ParserParseSimpleLineContinuationsWithEmptyString", () => {
    expect.assertions(7);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid ""\n' +
        '"string 1"\n' +
        '" and more string 1"\n' +
        'msgstr ""\n' +
        '"this is string one "\n' +
        '"or the translation thereof. "\n' +
        '"Next line."\n',
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(1);
    const resources = set.getAll();
    expect(resources.length).toBe(1);

    expect(resources[0].getSource()).toBe("string 1 and more string 1");
    expect(resources[0].getKey()).toBe("string 1 and more string 1");
    expect(resources[0].getTarget()).toBe(
      "this is string one or the translation thereof. Next line.",
    );
  });

  test("ParserParseEscapedQuotes", () => {
    expect.assertions(6);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse('msgid "string \\"quoted\\" 1"\n');
    expect(set).toBeTruthy();

    const r = set.get(
      ResourceString.hashKey("foo", "en-US", 'string "quoted" 1', "po"),
    );
    expect(r).toBeTruthy();

    expect(r.getSource()).toBe('string "quoted" 1');
    expect(r.getKey()).toBe('string "quoted" 1');
    expect(r.getType()).toBe("string");
  });

  test("ParserParseEmptyTranslation", () => {
    expect.assertions(12);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    // only source strings
    const set = parser.parse(
      'msgid "string 1"\n' +
        'msgstr ""\n' +
        "\n" +
        'msgid "string 2"\n' +
        'msgstr ""\n',
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

  test("ParserParseEmptySource", () => {
    expect.assertions(3);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid ""\n' +
        'msgstr "string 1"\n' +
        "\n" +
        'msgid ""\n' +
        'msgstr "string 2"\n',
    );
    expect(set).toBeTruthy();

    // no source = no string to translate!
    expect(set.size()).toBe(0);
  });

  test("ParserParseFileHeader", () => {
    expect.assertions(3);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      "#, fuzzy\n" +
        'msgid ""\n' +
        'msgstr ""\n' +
        '"#-#-#-#-#  messages.pot  #-#-#-#-#\\n"\n' +
        '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
        '"Content-Transfer-Encoding: 8bit\\n"\n' +
        '"Generated-By: loctool\\n"\n' +
        '"Project-Id-Version: 1\\n"\n',
    );
    expect(set).toBeTruthy();

    // no source = no string to translate!
    expect(set.size()).toBe(0);
  });

  test("ParserParseDupString", () => {
    expect.assertions(8);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    // only source strings
    const set = parser.parse(
      'msgid "string 1"\n' +
        'msgstr ""\n' +
        "\n" +
        'msgid "string 1"\n' +
        'msgstr ""\n',
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

  test("ParserParseSameStringDifferentContext", () => {
    expect.assertions(14);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    // only source strings
    const set = parser.parse(
      'msgctxt "context 1"\n' +
        'msgid "string 1"\n' +
        'msgstr ""\n' +
        "\n" +
        'msgctxt "context 2"\n' +
        'msgid "string 1"\n' +
        'msgstr ""\n',
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

  test("ParserParseSameStringContextInKey", () => {
    expect.assertions(14);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
      contextInKey: true,
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgctxt "context 1"\n' +
        'msgid "string 1"\n' +
        'msgstr ""\n' +
        "\n" +
        'msgctxt "context 2"\n' +
        'msgid "string 1"\n' +
        'msgstr ""\n',
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

  test("ParserParseTestInvalidPO", () => {
    expect.assertions(2);

    // when it's named messages.po, it should apply the messages-schema schema
    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    expect(() => {
      // that's not a po file!
      parser.parse(
        "{\n" +
          '    "x": {\n' +
          '        "y": {,@#\n' +
          '            "plurals": {\n' +
          '                "bar": {\n' +
          '                    "one": "singular",\n' +
          '                    "many": "many",\n' +
          '                    "other": "plural"\n' +
          "                 }\n" +
          "            }\n" +
          "        }\n" +
          "    },\n" +
          '    "a": {\n' +
          '        "b": {\n' +
          '            "strings": {\n' +
          '                "a": "b",\n' +
          '                "c": "d"\n' +
          "            }\n" +
          "        }\n" +
          "    }\n" +
          "}\n",
      );
    }).toThrow();
  });

  test("ParserParseExtractComments", () => {
    expect.assertions(12);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      "# translator's comments\n" +
        "#: src/foo.html:32 src/bar.html:234\n" +
        "#. This is comments from the engineer to the translator for string 1.\n" +
        "#, c-format\n" +
        "#| str 1\n" +
        'msgid "string 1"\n' +
        'msgstr ""\n' +
        "\n" +
        "# translator's comments 2\n" +
        "#: src/bar.html:644 src/asdf.html:232\n" +
        "#. This is comments from the engineer to the translator for string 2.\n" +
        "#, javascript-format,gcc-internal-format\n" +
        "#| str 2\n" +
        'msgid "string 2"\n' +
        'msgstr ""\n',
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(2);
    const resources = set.getAll();
    expect(resources.length).toBe(2);

    expect(resources[0].getSource()).toBe("string 1");
    expect(resources[0].getKey()).toBe("string 1");
    expect(resources[0].getComment()).toBe(
      '{"translator":["translator\'s comments"],' +
        '"paths":["src/foo.html:32 src/bar.html:234"],' +
        '"extracted":["This is comments from the engineer to the translator for string 1."],' +
        '"flags":["c-format"],' +
        '"previous":["str 1"]}',
    );
    expect(resources[0].getPath()).toBe("src/foo.html");

    expect(resources[1].getSource()).toBe("string 2");
    expect(resources[1].getKey()).toBe("string 2");
    expect(resources[1].getComment()).toBe(
      '{"translator":["translator\'s comments 2"],' +
        '"paths":["src/bar.html:644 src/asdf.html:232"],' +
        '"extracted":["This is comments from the engineer to the translator for string 2."],' +
        '"flags":["javascript-format,gcc-internal-format"],' +
        '"previous":["str 2"]}',
    );
    expect(resources[1].getPath()).toBe("src/bar.html");
  });

  test("ParserParseExtractComments multiline", () => {
    expect.assertions(12);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      "# translator's comments\n" +
        "#: src/foo.html:32 src/bar.html:234\n" +
        "#. This is comments from the engineer to the translator for string 1 - first line\n" +
        "#. and a second line.\n" +
        "#, c-format\n" +
        "#| str 1\n" +
        'msgid "string 1"\n' +
        'msgstr ""\n' +
        "\n" +
        "# translator's comments 2\n" +
        "#: src/bar.html:644 src/asdf.html:232\n" +
        "#. This is comments from the engineer to the translator for string 2 - first line\n" +
        "#. and a second line.\n" +
        "#, javascript-format,gcc-internal-format\n" +
        "#| str 2\n" +
        'msgid "string 2"\n' +
        'msgstr ""\n',
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(2);
    const resources = set.getAll();
    expect(resources.length).toBe(2);

    expect(resources[0].getSource()).toBe("string 1");
    expect(resources[0].getKey()).toBe("string 1");
    expect(resources[0].getComment()).toBe(
      '{"translator":["translator\'s comments"],' +
        '"paths":["src/foo.html:32 src/bar.html:234"],' +
        '"extracted":["This is comments from the engineer to the translator for string 1 - first line","and a second line."],' +
        '"flags":["c-format"],' +
        '"previous":["str 1"]}',
    );
    expect(resources[0].getPath()).toBe("src/foo.html");

    expect(resources[1].getSource()).toBe("string 2");
    expect(resources[1].getKey()).toBe("string 2");
    expect(resources[1].getComment()).toBe(
      '{"translator":["translator\'s comments 2"],' +
        '"paths":["src/bar.html:644 src/asdf.html:232"],' +
        '"extracted":["This is comments from the engineer to the translator for string 2 - first line","and a second line."],' +
        '"flags":["javascript-format,gcc-internal-format"],' +
        '"previous":["str 2"]}',
    );
    expect(resources[1].getPath()).toBe("src/bar.html");
  });

  test("ParserParseExtractComments with our po extensions", () => {
    expect.assertions(12);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      "# translator's comments\n" +
        "#: src/foo.html:32 src/bar.html:234\n" +
        "#. This is comments from the engineer to the translator for string 1.\n" +
        "#, c-format\n" +
        "#| str 1\n" +
        "#k array1\n" +
        "#d datatype1\n" +
        "#p manhattan\n" +
        "## 0\n" +
        'msgid "string 1"\n' +
        'msgstr "Zeichenfolge 1"\n' +
        "\n" +
        "#k array1\n" +
        "#d datatype1\n" +
        "## 1\n" +
        'msgid "string 2"\n' +
        'msgstr "Zeichenfolge 2"\n',
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(1);
    const resources = set.getAll();
    expect(resources.length).toBe(1);

    expect(resources[0].getType()).toBe("array");
    expect(resources[0].getSource()).toStrictEqual(["string 1", "string 2"]);
    expect(resources[0].getTarget()).toStrictEqual([
      "Zeichenfolge 1",
      "Zeichenfolge 2",
    ]);
    expect(resources[0].getDataType()).toBe("datatype1");
    expect(resources[0].getKey()).toBe("array1");
    // the extension should be ignored in the comment field
    expect(resources[0].getComment()).toBe(
      '{"translator":["translator\'s comments"],' +
        '"paths":["src/foo.html:32 src/bar.html:234"],' +
        '"extracted":["This is comments from the engineer to the translator for string 1."],' +
        '"flags":["c-format"],' +
        '"previous":["str 1"]}',
    );
    expect(resources[0].getPath()).toBe("src/foo.html");
    expect(resources[0].getProject()).toBe("manhattan");
  });

  test("ParserParseExtract with multiple array resources", () => {
    expect.assertions(18);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      "# translator's comments\n" +
        "#: src/foo.html:32 src/bar.html:234\n" +
        "#. This is comments from the engineer to the translator for string 1.\n" +
        "#, c-format\n" +
        "#| str 1\n" +
        "#k array1\n" +
        "#d datatype1\n" +
        "## 0\n" +
        'msgid "string 1"\n' +
        'msgstr "Zeichenfolge 1"\n' +
        "\n" +
        "#k array1\n" +
        "#d datatype1\n" +
        "## 1\n" +
        'msgid "string 2"\n' +
        'msgstr "Zeichenfolge 2"\n' +
        "\n" +
        "#: src/foo.html:39\n" +
        "#k array2\n" +
        "#d datatype2\n" +
        "## 0\n" +
        'msgid "string 3"\n' +
        'msgstr "Zeichenfolge 3"\n' +
        "\n" +
        "#k array2\n" +
        "#d datatype2\n" +
        "## 1\n" +
        'msgid "string 4"\n' +
        'msgstr "Zeichenfolge 4"\n',
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(2);
    const resources = set.getAll();
    expect(resources.length).toBe(2);

    expect(resources[0].getType()).toBe("array");
    expect(resources[0].getSource()).toStrictEqual(["string 1", "string 2"]);
    expect(resources[0].getTarget()).toStrictEqual([
      "Zeichenfolge 1",
      "Zeichenfolge 2",
    ]);
    expect(resources[0].getKey()).toBe("array1");
    expect(resources[0].getDataType()).toBe("datatype1");
    // the extension should be ignored in the comment field
    expect(resources[0].getComment()).toBe(
      '{"translator":["translator\'s comments"],' +
        '"paths":["src/foo.html:32 src/bar.html:234"],' +
        '"extracted":["This is comments from the engineer to the translator for string 1."],' +
        '"flags":["c-format"],' +
        '"previous":["str 1"]}',
    );
    expect(resources[0].getPath()).toBe("src/foo.html");

    expect(resources[1].getType()).toBe("array");
    expect(resources[1].getSource()).toStrictEqual(["string 3", "string 4"]);
    expect(resources[1].getTarget()).toStrictEqual([
      "Zeichenfolge 3",
      "Zeichenfolge 4",
    ]);
    expect(resources[1].getKey()).toBe("array2");
    expect(resources[1].getDataType()).toBe("datatype2");
    expect(resources[1].getPath()).toBe("src/foo.html");
    expect(resources[1].getComment()).toBe('{"paths":["src/foo.html:39"]}');
  });

  test("ParserParseExtractFileNameNoLineNumbers", () => {
    expect.assertions(12);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      "#: src/foo.html src/bar.html\n" +
        'msgid "string 1"\n' +
        'msgstr ""\n' +
        "\n" +
        "#: src/bar.html\n" +
        'msgid "string 2"\n' +
        'msgstr ""\n',
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(2);
    const resources = set.getAll();
    expect(resources.length).toBe(2);

    expect(resources[0].getSource()).toBe("string 1");
    expect(resources[0].getKey()).toBe("string 1");
    expect(resources[0].getComment()).toBe(
      '{"paths":["src/foo.html src/bar.html"]}',
    );
    expect(resources[0].getPath()).toBe("src/foo.html");

    expect(resources[1].getSource()).toBe("string 2");
    expect(resources[1].getKey()).toBe("string 2");
    expect(resources[1].getComment()).toBe('{"paths":["src/bar.html"]}');
    expect(resources[1].getPath()).toBe("src/bar.html");
  });

  test("ParserParseClearComments", () => {
    expect.assertions(12);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      "# translator's comments\n" +
        "#: src/foo.html:32\n" +
        "#. This is comments from the engineer to the translator for string 1.\n" +
        "#, c-format\n" +
        "#| str 1\n" +
        'msgid "string 1"\n' +
        'msgstr ""\n' +
        "\n" +
        'msgid "string 2"\n' +
        'msgstr ""\n',
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(2);
    const resources = set.getAll();
    expect(resources.length).toBe(2);

    expect(resources[0].getSource()).toBe("string 1");
    expect(resources[0].getKey()).toBe("string 1");
    expect(resources[0].getComment()).toBe(
      '{"translator":["translator\'s comments"],' +
        '"paths":["src/foo.html:32"],' +
        '"extracted":["This is comments from the engineer to the translator for string 1."],' +
        '"flags":["c-format"],' +
        '"previous":["str 1"]}',
    );
    expect(resources[0].getPath()).toBe("src/foo.html");

    // comments for string 1 should not carry over to string 2
    expect(resources[1].getSource()).toBe("string 2");
    expect(resources[1].getKey()).toBe("string 2");
    expect(resources[1].getComment()).toBeFalsy();
    expect(resources[1].getPath()).toBeFalsy();
  });

  test("ParserParseExtractMultiplePaths", () => {
    expect.assertions(8);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      "#: src/foo.html:32\n" +
        "#: src/bar.html:32\n" +
        "#: src/asdf.html:32\n" +
        "#: src/xyz.html:32\n" +
        "#: src/abc.html:32\n" +
        'msgid "string 1"\n' +
        'msgstr ""\n' +
        "\n",
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(1);
    const resources = set.getAll();
    expect(resources.length).toBe(1);

    expect(resources[0].getSource()).toBe("string 1");
    expect(resources[0].getKey()).toBe("string 1");
    expect(resources[0].getComment()).toBe(
      '{"paths":["src/foo.html:32","src/bar.html:32","src/asdf.html:32","src/xyz.html:32","src/abc.html:32"]}',
    );
    expect(resources[0].getPath()).toBe("src/foo.html");
  });

  test("ParserParseExtractMultipleComments", () => {
    expect.assertions(7);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      "# translator's comments 1\n" +
        "# translator's comments 2\n" +
        "#. This is comments from the engineer to the translator for string 1.\n" +
        "#. This is more comments from the engineer to the translator for string 1.\n" +
        "#, c-format\n" +
        "#, javascript-format\n" +
        "#| str 1\n" +
        "#| str 2\n" +
        'msgid "string 1"\n' +
        'msgstr ""\n' +
        "\n",
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(1);
    const resources = set.getAll();
    expect(resources.length).toBe(1);

    expect(resources[0].getSource()).toBe("string 1");
    expect(resources[0].getKey()).toBe("string 1");
    expect(resources[0].getComment()).toBe(
      '{"translator":["translator\'s comments 1","translator\'s comments 2"],' +
        '"extracted":["This is comments from the engineer to the translator for string 1.",' +
        '"This is more comments from the engineer to the translator for string 1."],' +
        '"flags":["c-format","javascript-format"],' +
        '"previous":["str 1","str 2"]}',
    );
  });

  test("ParserParseIgnoreComments", () => {
    expect.assertions(7);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
      ignoreComments: new Set([CommentType.FLAGS, CommentType.PATHS]),
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      "# translator's comments 1\n" +
        "# translator's comments 2\n" +
        "#. This is comments from the engineer to the translator for string 1.\n" +
        "#. This is more comments from the engineer to the translator for string 1.\n" +
        "#, c-format\n" +
        "#, javascript-format\n" +
        "#| str 1\n" +
        "#| str 2\n" +
        "#: path1.py:234\n" +
        "#: asdf/path2.py:868\n" +
        'msgid "string 1"\n' +
        'msgstr ""\n' +
        "\n",
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(1);
    const resources = set.getAll();
    expect(resources.length).toBe(1);

    expect(resources[0].getSource()).toBe("string 1");
    expect(resources[0].getKey()).toBe("string 1");
    expect(resources[0].getComment()).toBe(
      '{"translator":["translator\'s comments 1","translator\'s comments 2"],' +
        '"extracted":["This is comments from the engineer to the translator for string 1.",' +
        '"This is more comments from the engineer to the translator for string 1."],' +
        '"previous":["str 1","str 2"]}',
    );
  });

  test("ParserParseIgnoreAllComments", () => {
    expect.assertions(7);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
      ignoreComments: true,
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      "# translator's comments 1\n" +
        "# translator's comments 2\n" +
        "#. This is comments from the engineer to the translator for string 1.\n" +
        "#. This is more comments from the engineer to the translator for string 1.\n" +
        "#, c-format\n" +
        "#, javascript-format\n" +
        "#| str 1\n" +
        "#| str 2\n" +
        "#: path1.py:234\n" +
        "#: asdf/path2.py:868\n" +
        'msgid "string 1"\n' +
        'msgstr ""\n' +
        "\n",
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(1);
    const resources = set.getAll();
    expect(resources.length).toBe(1);

    expect(resources[0].getSource()).toBe("string 1");
    expect(resources[0].getKey()).toBe("string 1");
    expect(resources[0].getComment()).toBeFalsy();
  });

  test("ParserParse use default datatype", () => {
    expect.assertions(33);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid ""\n' +
        'msgstr ""\n' +
        '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
        '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
        '"Content-Transfer-Encoding: 8bit\\n"\n' +
        '"Generated-By: loctool\\n"\n' +
        '"Project-Id-Version: 1\\n"\n' +
        '"Language: fr-FR\\n"\n' + // should override the targetLocale in the constructor
        '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
        '"Data-Type: javascript\\n"\n' +
        "\n" +
        "#: src/foo.html\n" +
        "#k str1\n" +
        'msgid "string 1"\n' +
        'msgstr "chaîne 1"\n' +
        "\n" +
        "#: src/foo.html\n" +
        "#k array1\n" +
        "## 0\n" +
        'msgid "string 1"\n' +
        'msgstr "chaîne 1"\n' +
        "\n" +
        "#k array1\n" +
        "## 1\n" +
        'msgid "string 2"\n' +
        'msgstr "chaîne 2"\n' +
        "\n" +
        "#: src/foo.html\n" +
        "#k plural1\n" +
        'msgid "{$count} object"\n' +
        'msgid_plural "{$count} objects"\n' +
        'msgstr[0] "{$count} objet"\n' +
        'msgstr[1] "{$count} objets"\n',
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(3);
    const resources = set.getAll();
    expect(resources.length).toBe(3);

    expect(resources[0].getType()).toBe("string");
    expect(resources[0].getSource()).toBe("string 1");
    expect(resources[0].getTarget()).toBe("chaîne 1");
    expect(resources[0].getKey()).toBe("str1");
    expect(resources[0].getPath()).toBe("src/foo.html");
    expect(resources[0].getComment()).toBe('{"paths":["src/foo.html"]}');
    expect(resources[0].getDataType()).toBe("javascript");
    expect(resources[0].getSourceLocale()).toBe("en-US");
    expect(resources[0].getTargetLocale()).toBe("fr-FR");

    expect(resources[1].getType()).toBe("array");
    expect(resources[1].getSource()).toStrictEqual(["string 1", "string 2"]);
    expect(resources[1].getTarget()).toStrictEqual(["chaîne 1", "chaîne 2"]);
    expect(resources[1].getKey()).toBe("array1");
    expect(resources[1].getPath()).toBe("src/foo.html");
    expect(resources[1].getComment()).toBe('{"paths":["src/foo.html"]}');
    expect(resources[1].getDataType()).toBe("javascript");
    expect(resources[1].getSourceLocale()).toBe("en-US");
    expect(resources[1].getTargetLocale()).toBe("fr-FR");

    expect(resources[2].getType()).toBe("plural");
    let strings = resources[2].getSource();
    expect(strings.one).toBe("{$count} object");
    expect(strings.other).toBe("{$count} objects");
    strings = resources[2].getTarget();
    expect(strings.one).toBe("{$count} objet");
    expect(strings.other).toBe("{$count} objets");
    expect(resources[2].getKey()).toBe("plural1");
    expect(resources[2].getPath()).toBe("src/foo.html");
    expect(resources[2].getComment()).toBe('{"paths":["src/foo.html"]}');
    expect(resources[2].getDataType()).toBe("javascript");
    expect(resources[2].getSourceLocale()).toBe("en-US");
    expect(resources[2].getTargetLocale()).toBe("fr-FR");
  });

  test("ParserParse use the datatype included in each resource", () => {
    expect.assertions(33);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid ""\n' +
        'msgstr ""\n' +
        '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
        '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
        '"Content-Transfer-Encoding: 8bit\\n"\n' +
        '"Generated-By: loctool\\n"\n' +
        '"Project-Id-Version: 1\\n"\n' +
        '"Language: fr-FR\\n"\n' + // should override the targetLocale in the constructor
        '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
        '"Data-Type: javascript\\n"\n' +
        "\n" +
        "#: src/foo.html\n" +
        "#d asdfasdf\n" +
        "#k str1\n" +
        'msgid "string 1"\n' +
        'msgstr "chaîne 1"\n' +
        "\n" +
        "#: src/foo.html\n" +
        "#d asdfasdf\n" +
        "#k array1\n" +
        "## 0\n" +
        'msgid "string 1"\n' +
        'msgstr "chaîne 1"\n' +
        "\n" +
        "#k array1\n" +
        "## 1\n" +
        'msgid "string 2"\n' +
        'msgstr "chaîne 2"\n' +
        "\n" +
        "#: src/foo.html\n" +
        "#d asdfasdf\n" +
        "#k plural1\n" +
        'msgid "{$count} object"\n' +
        'msgid_plural "{$count} objects"\n' +
        'msgstr[0] "{$count} objet"\n' +
        'msgstr[1] "{$count} objets"\n',
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(3);
    const resources = set.getAll();
    expect(resources.length).toBe(3);

    expect(resources[0].getType()).toBe("string");
    expect(resources[0].getSource()).toBe("string 1");
    expect(resources[0].getTarget()).toBe("chaîne 1");
    expect(resources[0].getKey()).toBe("str1");
    expect(resources[0].getPath()).toBe("src/foo.html");
    expect(resources[0].getComment()).toBe('{"paths":["src/foo.html"]}');
    expect(resources[0].getDataType()).toBe("asdfasdf");
    expect(resources[0].getSourceLocale()).toBe("en-US");
    expect(resources[0].getTargetLocale()).toBe("fr-FR");

    expect(resources[1].getType()).toBe("array");
    expect(resources[1].getSource()).toStrictEqual(["string 1", "string 2"]);
    expect(resources[1].getTarget()).toStrictEqual(["chaîne 1", "chaîne 2"]);
    expect(resources[1].getKey()).toBe("array1");
    expect(resources[1].getPath()).toBe("src/foo.html");
    expect(resources[1].getComment()).toBe('{"paths":["src/foo.html"]}');
    expect(resources[1].getDataType()).toBe("asdfasdf");
    expect(resources[1].getSourceLocale()).toBe("en-US");
    expect(resources[1].getTargetLocale()).toBe("fr-FR");

    expect(resources[2].getType()).toBe("plural");
    let strings = resources[2].getSource();
    expect(strings.one).toBe("{$count} object");
    expect(strings.other).toBe("{$count} objects");
    strings = resources[2].getTarget();
    expect(strings.one).toBe("{$count} objet");
    expect(strings.other).toBe("{$count} objets");
    expect(resources[2].getKey()).toBe("plural1");
    expect(resources[2].getPath()).toBe("src/foo.html");
    expect(resources[2].getComment()).toBe('{"paths":["src/foo.html"]}');
    expect(resources[2].getDataType()).toBe("asdfasdf");
    expect(resources[2].getSourceLocale()).toBe("en-US");
    expect(resources[2].getTargetLocale()).toBe("fr-FR");
  });

  test("ParserParse use the file project name", () => {
    expect.assertions(33);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid ""\n' +
        'msgstr ""\n' +
        '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
        '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
        '"Content-Transfer-Encoding: 8bit\\n"\n' +
        '"Generated-By: loctool\\n"\n' +
        '"Project-Id-Version: 1\\n"\n' +
        '"Language: fr-FR\\n"\n' + // should override the targetLocale in the constructor
        '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
        '"Project: manhattan\\n"\n' + // should override the projectName in the constructor
        "\n" +
        "#: src/foo.html\n" +
        "#k str1\n" +
        'msgid "string 1"\n' +
        'msgstr "chaîne 1"\n' +
        "\n" +
        "#: src/foo.html\n" +
        "#k array1\n" +
        "## 0\n" +
        'msgid "string 1"\n' +
        'msgstr "chaîne 1"\n' +
        "\n" +
        "#k array1\n" +
        "## 1\n" +
        'msgid "string 2"\n' +
        'msgstr "chaîne 2"\n' +
        "\n" +
        "#: src/foo.html\n" +
        "#k plural1\n" +
        'msgid "{$count} object"\n' +
        'msgid_plural "{$count} objects"\n' +
        'msgstr[0] "{$count} objet"\n' +
        'msgstr[1] "{$count} objets"\n',
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(3);
    const resources = set.getAll();
    expect(resources.length).toBe(3);

    expect(resources[0].getType()).toBe("string");
    expect(resources[0].getSource()).toBe("string 1");
    expect(resources[0].getTarget()).toBe("chaîne 1");
    expect(resources[0].getKey()).toBe("str1");
    expect(resources[0].getPath()).toBe("src/foo.html");
    expect(resources[0].getComment()).toBe('{"paths":["src/foo.html"]}');
    expect(resources[0].getProject()).toBe("manhattan");
    expect(resources[0].getSourceLocale()).toBe("en-US");
    expect(resources[0].getTargetLocale()).toBe("fr-FR");

    expect(resources[1].getType()).toBe("array");
    expect(resources[1].getSource()).toStrictEqual(["string 1", "string 2"]);
    expect(resources[1].getTarget()).toStrictEqual(["chaîne 1", "chaîne 2"]);
    expect(resources[1].getKey()).toBe("array1");
    expect(resources[1].getPath()).toBe("src/foo.html");
    expect(resources[1].getComment()).toBe('{"paths":["src/foo.html"]}');
    expect(resources[1].getProject()).toBe("manhattan");
    expect(resources[1].getSourceLocale()).toBe("en-US");
    expect(resources[1].getTargetLocale()).toBe("fr-FR");

    expect(resources[2].getType()).toBe("plural");
    let strings = resources[2].getSource();
    expect(strings.one).toBe("{$count} object");
    expect(strings.other).toBe("{$count} objects");
    strings = resources[2].getTarget();
    expect(strings.one).toBe("{$count} objet");
    expect(strings.other).toBe("{$count} objets");
    expect(resources[2].getKey()).toBe("plural1");
    expect(resources[2].getPath()).toBe("src/foo.html");
    expect(resources[2].getComment()).toBe('{"paths":["src/foo.html"]}');
    expect(resources[2].getProject()).toBe("manhattan");
    expect(resources[2].getSourceLocale()).toBe("en-US");
    expect(resources[2].getTargetLocale()).toBe("fr-FR");
  });

  test("ParserParse use project name in each resource", () => {
    expect.assertions(33);

    const parser = new Parser({
      pathName: "./testfiles/po/messages.po",
      sourceLocale: "en-US",
      targetLocale: "de-DE",
      projectName: "foo",
      datatype: "po",
    });
    expect(parser).toBeTruthy();

    const set = parser.parse(
      'msgid ""\n' +
        'msgstr ""\n' +
        '"#-#-#-#-#  ./po/messages.po  #-#-#-#-#\\n"\n' +
        '"Content-Type: text/plain; charset=UTF-8\\n"\n' +
        '"Content-Transfer-Encoding: 8bit\\n"\n' +
        '"Generated-By: loctool\\n"\n' +
        '"Project-Id-Version: 1\\n"\n' +
        '"Language: fr-FR\\n"\n' + // should override the targetLocale in the constructor
        '"Plural-Forms: nplurals=2; plural=n>1;\\n"\n' +
        '"Project: manhattan\\n"\n' + // should override the projectName in the constructor
        "\n" +
        "#: src/foo.html\n" +
        "#p losangeles\n" +
        "#k str1\n" +
        'msgid "string 1"\n' +
        'msgstr "chaîne 1"\n' +
        "\n" +
        "#: src/foo.html\n" +
        "#p losangeles\n" +
        "#k array1\n" +
        "## 0\n" +
        'msgid "string 1"\n' +
        'msgstr "chaîne 1"\n' +
        "\n" +
        "#k array1\n" +
        "## 1\n" +
        'msgid "string 2"\n' +
        'msgstr "chaîne 2"\n' +
        "\n" +
        "#: src/foo.html\n" +
        "#p losangeles\n" +
        "#k plural1\n" +
        'msgid "{$count} object"\n' +
        'msgid_plural "{$count} objects"\n' +
        'msgstr[0] "{$count} objet"\n' +
        'msgstr[1] "{$count} objets"\n',
    );
    expect(set).toBeTruthy();

    expect(set.size()).toBe(3);
    const resources = set.getAll();
    expect(resources.length).toBe(3);

    expect(resources[0].getType()).toBe("string");
    expect(resources[0].getSource()).toBe("string 1");
    expect(resources[0].getTarget()).toBe("chaîne 1");
    expect(resources[0].getKey()).toBe("str1");
    expect(resources[0].getPath()).toBe("src/foo.html");
    expect(resources[0].getComment()).toBe('{"paths":["src/foo.html"]}');
    expect(resources[0].getProject()).toBe("losangeles");
    expect(resources[0].getSourceLocale()).toBe("en-US");
    expect(resources[0].getTargetLocale()).toBe("fr-FR");

    expect(resources[1].getType()).toBe("array");
    expect(resources[1].getSource()).toStrictEqual(["string 1", "string 2"]);
    expect(resources[1].getTarget()).toStrictEqual(["chaîne 1", "chaîne 2"]);
    expect(resources[1].getKey()).toBe("array1");
    expect(resources[1].getPath()).toBe("src/foo.html");
    expect(resources[1].getComment()).toBe('{"paths":["src/foo.html"]}');
    expect(resources[1].getProject()).toBe("losangeles");
    expect(resources[1].getSourceLocale()).toBe("en-US");
    expect(resources[1].getTargetLocale()).toBe("fr-FR");

    expect(resources[2].getType()).toBe("plural");
    let strings = resources[2].getSource();
    expect(strings.one).toBe("{$count} object");
    expect(strings.other).toBe("{$count} objects");
    strings = resources[2].getTarget();
    expect(strings.one).toBe("{$count} objet");
    expect(strings.other).toBe("{$count} objets");
    expect(resources[2].getKey()).toBe("plural1");
    expect(resources[2].getPath()).toBe("src/foo.html");
    expect(resources[2].getComment()).toBe('{"paths":["src/foo.html"]}');
    expect(resources[2].getProject()).toBe("losangeles");
    expect(resources[2].getSourceLocale()).toBe("en-US");
    expect(resources[2].getTargetLocale()).toBe("fr-FR");
  });
});
