/*
 * PropertiesFile.test.js - test the Java file handler object.
 *
 * Copyright © 2019, 2023 JEDLSoft
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

if (!PropertiesFile) {
    var PropertiesFile = require("../PropertiesFile.js");
    var PropertiesFileType = require("../PropertiesFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
    var ResourceString =  require("loctool/lib/ResourceString.js");
}

var p = new CustomProject({
    id: "webapp",
    sourceLocale: "en-US",
    pseudoLocale: "de-DE"
}, "./test/testfiles", {
    locales:["en-GB"]
});

var pft = new PropertiesFileType(p);

describe("propertiesfile", function() {
    test("PropertiesFileConstructor", function() {
        expect.assertions(1);

        var j = new PropertiesFile({
            project: p
        });
        expect(j).toBeTruthy();
    });

    test("PropertiesFileConstructorParams", function() {
        expect.assertions(1);

        var j = new PropertiesFile({
            project: p,
            pathName: "./testfiles/java/t1.properties",
            type: pft
        });

        expect(j).toBeTruthy();
    });

    test("PropertiesFileConstructorNoFile", function() {
        expect.assertions(1);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();
    });

    test("PropertiesFileParseSimpleGetByKey", function() {
        expect.assertions(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('test1=This is a test\n');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "test1", "properties"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("test1");
    });

    test("PropertiesFileParseSimpleGetBySource", function() {
        expect.assertions(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('test1=This is a test\n');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("test1");
    });

    test("PropertiesFileParseWithColon", function() {
        expect.assertions(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('test1: This is a test\n');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "test1", "properties"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("test1");
    });

    test("PropertiesFileParseWithNonLetterKeys", function() {
        expect.assertions(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('test1.foo.bar: This is a test\n');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "test1.foo.bar", "properties"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("test1.foo.bar");
    });

    test("PropertiesFileParseIgnoreEmpty", function() {
        expect.assertions(3);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('\n\n');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("PropertiesFileParseSimpleIgnoreWhitespace", function() {
        expect.assertions(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('  \t test1  \t\t  =   This is a test     \n  ');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test     ");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test     ");
        expect(r.getKey()).toBe("test1");
    });

    test("PropertiesFileParseSimpleWithTranslatorComment", function() {
        expect.assertions(6);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('test1 = This is a test # i18n: this is a translator\'s comment\n\t# This is not\n');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test ");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test ");
        expect(r.getKey()).toBe("test1");
        expect(r.getComment()).toBe("this is a translator's comment");
    });

    test("PropertiesFileParseWithEmbeddedDoubleQuotes", function() {
        expect.assertions(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('test1 = This is a \\\"test\\\"\n');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a \"test\"");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a \"test\"");
        expect(r.getKey()).toBe("test1");
    });

    test("PropertiesFileParseWithEmbeddedEscapedSingleQuotes", function() {
        expect.assertions(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('test1 = This is a \\\'test\\\'\n');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a 'test'");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a 'test'");
        expect(r.getKey()).toBe("test1");
    });

    test("PropertiesFileParseWithEmbeddedUnescapedSingleQuotes", function() {
        expect.assertions(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('test1 = This is a \'test\'\n');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a 'test'");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a 'test'");
        expect(r.getKey()).toBe("test1");
    });

    test("PropertiesFileParseWithEmbeddedUnicodeEscape", function() {
        expect.assertions(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('test1 = This is a t\\u011Bst\n');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a těst");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a těst");
        expect(r.getKey()).toBe("test1");
    });

    test("PropertiesFileParseMultiple", function() {
        expect.assertions(8);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('test1 = This is a test\ntest2 = This is another test\n\t\ttest3 = This is also a test\n');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("test1");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("test3");
    });

    test("PropertiesFileParseMultipleWithComments", function() {
        expect.assertions(10);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('test1 = This is a test # i18n: foo\n\ttest2 = This is another test\n\t\ttest3 = This is also a test# i18n: bar\n');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test ");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test ");
        expect(r.getKey()).toBe("test1");
        expect(r.getComment()).toBe("foo");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("test3");
        expect(r.getComment()).toBe("bar");
    });

    test("PropertiesFileParseMultipleWithCommentsOnLineBefore", function() {
        expect.assertions(10);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('# i18n: foo\ntest1 = This is a test\n\ttest2 = This is another test\n\n# i18n: bar\n\n\t\ttest3 = This is also a test\n');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("test1");
        expect(r.getComment()).toBe("foo");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("test3");
        expect(r.getComment()).toBe("bar");
    });

    test("PropertiesFileParseDupsDifferingByKeyOnly", function() {
        expect.assertions(8);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('test1 = This is a test\n\ttest2 = This is another test\n\t\ttest3 = This is a test\n');

        var set = j.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("test3");

        r = set.get(ResourceString.hashKey("webapp", "en-US", "test3", "properties"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("test3");
    });

    test("PropertiesFileParseDupsDifferingByValue", function() {
        expect.assertions(2);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        expect(function() {
            j.parse('test1 = This is a test\n\ttest2 = This is another test\n\t\ttest1 = Alternate source\n');
        }).toThrow();
    });

    test("PropertiesFileParseEmptyKey", function() {
        expect.assertions(2);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        j.parse('= This is a test\n');

        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("PropertiesFileExtractFile", function() {
        expect.assertions(8);

        var j = new PropertiesFile({
            project: p,
            pathName: "./java/t1.properties",
            type: pft
        });
        expect(j).toBeTruthy();

        // should read the file
        j.extract();

        var set = j.getTranslationSet();

        expect(set.size()).toBe(2);

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("test1");

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "id1", "properties"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test with a unique id");
        expect(r.getKey()).toBe("id1");
    });

    test("PropertiesFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        expect(j).toBeTruthy();

        // should attempt to read the file and not fail
        j.extract();

        var set = j.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("PropertiesFileExtractBogusFile", function() {
        expect.assertions(2);

        var j = new PropertiesFile({
            project: p,
            pathName: "./java/foo.properties",
            type: pft
        });
        expect(j).toBeTruthy();

        // should attempt to read the file and not fail
        j.extract();

        var set = j.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("PropertiesFileExtractFile2", function() {
        expect.assertions(14);

        var j = new PropertiesFile({
            project: p,
            pathName: "./java/t2.properties",
            type: pft
        });
        expect(j).toBeTruthy();

        // should read the file
        j.extract();

        var set = j.getTranslationSet();

        expect(set.size()).toBe(3);

        var r = set.getBySource("Can't find a group?");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Can't find a group?");
        expect(r.getKey()).toBe("group.question1");
        expect(r.getComment()).toBe("used on the home page");

        r = set.getBySource("Can't find a friend?");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Can't find a friend?");
        expect(r.getKey()).toBe("friend.question1");
        expect(!r.getComment()).toBeTruthy();

        r = set.getBySource("Invite them to Myproduct");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Invite them to Myproduct");
        expect(r.getKey()).toBe("call-to-action");
        expect(!r.getComment()).toBeTruthy();
    });
});

