/*
 * testPropertiesFile.js - test the Java file handler object.
 *
 * Copyright © 2019, JEDLSoft
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

module.exports.propertiesfile = {
    testPropertiesFileConstructor: function(test) {
        test.expect(1);

        var j = new PropertiesFile({
            project: p
        });
        test.ok(j);

        test.done();
    },

    testPropertiesFileConstructorParams: function(test) {
        test.expect(1);

        var j = new PropertiesFile({
            project: p,
            pathName: "./testfiles/java/t1.properties",
            type: pft
        });

        test.ok(j);

        test.done();
    },

    testPropertiesFileConstructorNoFile: function(test) {
        test.expect(1);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        test.done();
    },

    testPropertiesFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('test1=This is a test\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "test1", "properties"));
        test.ok(r);

        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "test1");

        test.done();
    },

    testPropertiesFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('test1=This is a test\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "test1");

        test.done();
    },

    testPropertiesFileParseWithColon: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('test1: This is a test\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "test1", "properties"));
        test.ok(r);

        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "test1");

        test.done();
    },

    testPropertiesFileParseWithNonLetterKeys: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('test1.foo.bar: This is a test\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "test1.foo.bar", "properties"));
        test.ok(r);

        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "test1.foo.bar");

        test.done();
    },

    testPropertiesFileParseIgnoreEmpty: function(test) {
        test.expect(3);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('\n\n');

        var set = j.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 0);

        test.done();
    },

    testPropertiesFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('  \t test1  \t\t  =   This is a test     \n  ');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test     ");
        test.ok(r);
        test.equal(r.getSource(), "This is a test     ");
        test.equal(r.getKey(), "test1");

        test.done();
    },

    testPropertiesFileParseSimpleWithTranslatorComment: function(test) {
        test.expect(6);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('test1 = This is a test # i18n: this is a translator\'s comment\n\t# This is not\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test ");
        test.ok(r);
        test.equal(r.getSource(), "This is a test ");
        test.equal(r.getKey(), "test1");
        test.equal(r.getComment(), "this is a translator's comment");

        test.done();
    },

    testPropertiesFileParseWithEmbeddedDoubleQuotes: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('test1 = This is a \\\"test\\\"\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a \"test\"");
        test.ok(r);
        test.equal(r.getSource(), "This is a \"test\"");
        test.equal(r.getKey(), "test1");

        test.done();
    },

    testPropertiesFileParseWithEmbeddedEscapedSingleQuotes: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('test1 = This is a \\\'test\\\'\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a 'test'");
        test.ok(r);
        test.equal(r.getSource(), "This is a 'test'");
        test.equal(r.getKey(), "test1");

        test.done();
    },

    testPropertiesFileParseWithEmbeddedUnescapedSingleQuotes: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('test1 = This is a \'test\'\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a 'test'");
        test.ok(r);
        test.equal(r.getSource(), "This is a 'test'");
        test.equal(r.getKey(), "test1");

        test.done();
    },

    testPropertiesFileParseWithEmbeddedUnicodeEscape: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('test1 = This is a t\\u011Bst\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a těst");
        test.ok(r);
        test.equal(r.getSource(), "This is a těst");
        test.equal(r.getKey(), "test1");

        test.done();
    },

    testPropertiesFileParseMultiple: function(test) {
        test.expect(8);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('test1 = This is a test\ntest2 = This is another test\n\t\ttest3 = This is also a test\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "test1");

        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "test3");

        test.done();
    },

    testPropertiesFileParseMultipleWithComments: function(test) {
        test.expect(10);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('test1 = This is a test # i18n: foo\n\ttest2 = This is another test\n\t\ttest3 = This is also a test# i18n: bar\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test ");
        test.ok(r);
        test.equal(r.getSource(), "This is a test ");
        test.equal(r.getKey(), "test1");
        test.equal(r.getComment(), "foo");

        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "test3");
        test.equal(r.getComment(), "bar");

        test.done();
    },

    testPropertiesFileParseMultipleWithCommentsOnLineBefore: function(test) {
        test.expect(10);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('# i18n: foo\ntest1 = This is a test\n\ttest2 = This is another test\n\n# i18n: bar\n\n\t\ttest3 = This is also a test\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "test1");
        test.equal(r.getComment(), "foo");

        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "test3");
        test.equal(r.getComment(), "bar");

        test.done();
    },

    testPropertiesFileParseWithDups: function(test) {
        test.expect(6);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('test1 = This is a test\n\ttest2 = This is another test.\n\t\ttest1 = This is a test\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "test1");

        test.equal(set.size(), 2);

        test.done();
    },

    testPropertiesFileParseDupsDifferingByKeyOnly: function(test) {
        test.expect(8);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('test1 = This is a test\n\ttest2 = This is another test\n\t\ttest3 = This is a test\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "test1");

        r = set.get(ResourceString.hashKey("webapp", "en-US", "test3", "properties"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "test3");

        test.done();
    },

    testPropertiesFileParseEmptyKey: function(test) {
        test.expect(2);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        j.parse('= This is a test\n');

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testPropertiesFileExtractFile: function(test) {
        test.expect(8);

        var j = new PropertiesFile({
            project: p,
            pathName: "./java/t1.properties",
            type: pft
        });
        test.ok(j);

        // should read the file
        j.extract();

        var set = j.getTranslationSet();

        test.equal(set.size(), 2);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "test1");

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "id1", "properties"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test with a unique id");
        test.equal(r.getKey(), "id1");

        test.done();
    },

    testPropertiesFileExtractUndefinedFile: function(test) {
        test.expect(2);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: pft
        });
        test.ok(j);

        // should attempt to read the file and not fail
        j.extract();

        var set = j.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testPropertiesFileExtractBogusFile: function(test) {
        test.expect(2);

        var j = new PropertiesFile({
            project: p,
            pathName: "./java/foo.properties",
            type: pft
        });
        test.ok(j);

        // should attempt to read the file and not fail
        j.extract();

        var set = j.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testPropertiesFileExtractFile2: function(test) {
        test.expect(14);

        var j = new PropertiesFile({
            project: p,
            pathName: "./java/t2.properties",
            type: pft
        });
        test.ok(j);

        // should read the file
        j.extract();

        var set = j.getTranslationSet();

        test.equal(set.size(), 3);

        var r = set.getBySource("Can't find a group?");
        test.ok(r);
        test.equal(r.getSource(), "Can't find a group?");
        test.equal(r.getKey(), "group.question1");
        test.equal(r.getComment(), "used on the home page");

        r = set.getBySource("Can't find a friend?");
        test.ok(r);
        test.equal(r.getSource(), "Can't find a friend?");
        test.equal(r.getKey(), "friend.question1");
        test.ok(!r.getComment());

        r = set.getBySource("Invite them to Myproduct");
        test.ok(r);
        test.equal(r.getSource(), "Invite them to Myproduct");
        test.equal(r.getKey(), "call-to-action");
        test.ok(!r.getComment());

        test.done();
    }
};
