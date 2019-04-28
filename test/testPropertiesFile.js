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

var jft = new PropertiesFileType(p);

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
            type: jft
        });

        test.ok(j);

        test.done();
    },

    testPropertiesFileConstructorNoFile: function(test) {
        test.expect(1);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        test.done();
    },

    testPropertiesFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
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
            type: jft
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

    testPropertiesFileParseSimpleColon: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
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

    testPropertiesFileParseIgnoreEmpty: function(test) {
        test.expect(3);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
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
            type: jft
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
            type: jft
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
            type: jft
        });
        test.ok(j);

        j.parse('\tRB.getString("This is a \\\"test\\\".");');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a \"test\".");
        test.ok(r);
        test.equal(r.getSource(), "This is a \"test\".");
        test.equal(r.getKey(), "r446151779");

        test.done();
    },

    testPropertiesFileParseWithEmbeddedEscapedSingleQuotes: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('\tRB.getString("This is a \\\'test\\\'.");');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a 'test'.");
        test.ok(r);
        test.equal(r.getSource(), "This is a 'test'.");
        test.equal(r.getKey(), "r531222461");

        test.done();
    },

    testPropertiesFileParseWithEmbeddedUnescapedSingleQuotes: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('\tRB.getString("This is a \'test\'.");');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a 'test'.");
        test.ok(r);
        test.equal(r.getSource(), "This is a 'test'.");
        test.equal(r.getKey(), "r531222461");

        test.done();
    },

    testPropertiesFileParseWithKey: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString("This is a test", "unique_id")');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "unique_id", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "unique_id");

        test.done();
    },

    testPropertiesFileParseWithKeyIgnoreWhitespace: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString("   \t\n This is a test       ", "unique_id")');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "unique_id", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "unique_id");

        test.done();
    },

    testPropertiesFileParseWithKeyCantGetBySource: function(test) {
        test.expect(3);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString("This is a test", "unique_id")');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(!r);

        test.done();
    },

    testPropertiesFileParseMultiple: function(test) {
        test.expect(8);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "r999080996");

        test.done();
    },

    testPropertiesFileParseMultipleWithKey: function(test) {
        test.expect(10);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString("This is a test", "x");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "y");');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "x", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getAutoKey());
        test.equal(r.getKey(), "x");

        r = set.get(ResourceString.hashKey("webapp", "en-US", "y", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getAutoKey());
        test.equal(r.getKey(), "y");

        test.done();
    },

    testPropertiesFileParseMultipleOnSameLine: function(test) {
        test.expect(8);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString("This is a test");  a.parse("This is another test."); RB.getString("This is another test");\n');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.ok(r.getAutoKey());

        r = set.getBySource("This is another test");
        test.ok(r);
        test.equal(r.getSource(), "This is another test");
        test.ok(r.getAutoKey());

        test.done();
    },

    testPropertiesFileParseMultipleWithComments: function(test) {
        test.expect(10);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString("This is a test");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");\t// i18n: bar');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        test.equal(r.getComment(), "foo");

        r = set.getBySource("This is also a test");
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "r999080996");
        test.equal(r.getComment(), "bar");

        test.done();
    },

    testPropertiesFileParseMultipleWithUniqueIdsAndComments: function(test) {
        test.expect(10);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString("This is a test", "asdf");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test", "kdkdkd");\t// i18n: bar');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "asdf", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "asdf");
        test.equal(r.getComment(), "foo");

        r = set.get(ResourceString.hashKey("webapp", "en-US", "kdkdkd", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "kdkdkd");
        test.equal(r.getComment(), "bar");

        test.done();
    },

    testPropertiesFileParseWithDups: function(test) {
        test.expect(6);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test");');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.equal(set.size(), 1);

        test.done();
    },

    testPropertiesFileParseDupsDifferingByKeyOnly: function(test) {
        test.expect(8);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "unique_id");');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        r = set.get(ResourceString.hashKey("webapp", "en-US", "unique_id", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "unique_id");

        test.done();
    },

    testPropertiesFileParseBogusConcatenation: function(test) {
        test.expect(2);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString("This is a test" + " and this isnt");');

        var set = j.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testPropertiesFileParseBogusConcatenation2: function(test) {
        test.expect(2);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString("This is a test" + foobar);');

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testPropertiesFileParseBogusNonStringParam: function(test) {
        test.expect(2);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString(foobar);');

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testPropertiesFileParseEmptyParams: function(test) {
        test.expect(2);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString();');

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testPropertiesFileParseWholeWord: function(test) {
        test.expect(2);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('EPIRB.getString("This is a test");');

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testPropertiesFileParseSubobject: function(test) {
        test.expect(2);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('App.RB.getString("This is a test");');

        var set = j.getTranslationSet();
        test.equal(set.size(), 1);

        test.done();
    },

    testPropertiesFileExtractFile: function(test) {
        test.expect(8);

        var j = new PropertiesFile({
            project: p,
            pathName: "./java/t1.java",
            type: jft
        });
        test.ok(j);

        // should read the file
        j.extract();

        var set = j.getTranslationSet();

        test.equal(set.size(), 2);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        var r = set.get(ResourceString.hashKey("webapp", "en-US", "id1", "java"));
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
            type: jft
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
            pathName: "./java/foo.java",
            type: jft
        });
        test.ok(j);

        // should attempt to read the file and not fail
        j.extract();

        var set = j.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testPropertiesFileExtractFile2: function(test) {
        test.expect(11);

        var j = new PropertiesFile({
            project: p,
            pathName: "./java/AskPickerSearchFragment.java",
            type: jft
        });
        test.ok(j);

        // should read the file
        j.extract();

        var set = j.getTranslationSet();

        test.equal(set.size(), 3);

        var r = set.getBySource("Can't find a group?");
        test.ok(r);
        test.equal(r.getSource(), "Can't find a group?");
        test.equal(r.getKey(), "r315749545");

        r = set.getBySource("Can't find a friend?");
        test.ok(r);
        test.equal(r.getSource(), "Can't find a friend?");
        test.equal(r.getKey(), "r23431269");

        r = set.getBySource("Invite them to Myproduct");
        test.ok(r);
        test.equal(r.getSource(), "Invite them to Myproduct");
        test.equal(r.getKey(), "r245047512");

        test.done();
    }
};
