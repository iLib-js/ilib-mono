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
    var ContextResourceString =  require("loctool/lib/ContextResourceString.js");
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

        var j = new PropertiesFile(p);
        test.ok(j);

        test.done();
    },

    testPropertiesFileConstructorParams: function(test) {
        test.expect(1);

        var j = new PropertiesFile({
            project: p,
            pathName: "./testfiles/java/t1.java",
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

    testPropertiesFileMakeKey: function(test) {
        test.expect(2);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        test.equal(j.makeKey("This is a test"), "r654479252");

        test.done();
    },

    testPropertiesFileMakeKeySimpleTexts1: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        test.equals(j.makeKey("Preferences in your profile"), "r372802078");
        test.equals(j.makeKey("All settings"), "r725930887");
        test.equals(j.makeKey("Colour scheme"), "r734599412");
        test.equals(j.makeKey("Experts"), "r343852585");

        test.done();
    },

    testPropertiesFileMakeKeyUnescaped: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        test.equals(j.makeKey("foo \\n \\t bar"), "r1056543475");
        test.equals(j.makeKey("\\n \\t bar"), "r755240053");
        test.equals(j.makeKey("The \\'Dude\\' played by Jeff Bridges"), "r600298088");
        test.equals(j.makeKey("\\'Dude\\'"), "r6259609");

        test.done();
    },

    testPropertiesFileMakeKeySimpleTexts2: function(test) {
        test.expect(6);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        test.equals(j.makeKey("Procedures"), "r807691021");
        test.equals(j.makeKey("Mobile Apps"), "r898923204");
        test.equals(j.makeKey("Settings in your profile"), "r618035987");
        test.equals(j.makeKey("Product Reviews"), "r175350918");
        test.equals(j.makeKey("Answers"), "r221604632");

        test.done();
    },

    testPropertiesFileMakeKeySimpleTexts3: function(test) {
        test.expect(9);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        test.equals(j.makeKey("Private Profile"), "r314592735");
        test.equals(j.makeKey("People you are connected to"), "r711926199");
        test.equals(j.makeKey("Notifications"), "r284964820");
        test.equals(j.makeKey("News"), "r613036745");
        test.equals(j.makeKey("More Tips"), "r216617786");
        test.equals(j.makeKey("Filters"), "r81370429");
        test.equals(j.makeKey("Referral Link"), "r140625167");
        test.equals(j.makeKey("Questions"), "r256277957");

        test.done();
    },

    testPropertiesFileMakeKeyEscapes: function(test) {
        test.expect(3);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        test.equals(j.makeKey("Can\'t find id"), "r743945592");
        test.equals(j.makeKey("Can\'t find an application for SMS"), "r909283218");

        test.done();
    },

    testPropertiesFileMakeKeyPunctuation: function(test) {
        test.expect(8);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        test.equals(j.makeKey("{name}({generic_name})"), "r300446104");
        test.equals(j.makeKey("{name}, {sharer_name} {start}found this interesting{end}"), "r8321889");
        test.equals(j.makeKey("{sharer_name} {start}found this interesting{end}"), "r639868344");
        test.equals(j.makeKey("Grow your Network"), "r895214324");
        test.equals(j.makeKey("Failed to send connection request!"), "r1015770123");
        test.equals(j.makeKey("{goal_name} Goals"), "r993422001");
        test.equals(j.makeKey("Connection link copied!"), "r180897411");

        test.done();
    },

    testPropertiesFileMakeKeySameStringMeansSameKey: function(test) {
        test.expect(3);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        test.equal(j.makeKey("This is a test"), "r654479252");
        test.equal(j.makeKey("This is a test"), "r654479252");

        test.done();
    },

    testPropertiesFileMakeKeyCompressWhiteSpace: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        test.equal(j.makeKey("Can\'t find  id"), "r743945592");
        test.equal(j.makeKey("Can\'t    find               id"), "r743945592");

        test.equal(j.makeKey("Can\'t find an application for SMS"), "r909283218");
        test.equal(j.makeKey("Can\'t   \t\n \t   find an    \t \n \r   application for SMS"), "r909283218");

        test.done();
    },

    testPropertiesFileMakeKeyTrimWhiteSpace: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        test.equal(j.makeKey("Can\'t find  id"), "r743945592");
        test.equal(j.makeKey("      Can\'t find  id "), "r743945592");

        test.equal(j.makeKey("Can\'t find an application for SMS"), "r909283218");
        test.equal(j.makeKey(" \t\t\n\r    Can\'t find an application for SMS   \n \t \r"), "r909283218");

        test.done();
    },

    testPropertiesFileMakeKeyNewLines: function(test) {
        test.expect(2);

        var jf = new PropertiesFile(p);
        test.ok(jf);

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equals(jf.makeKey("A \n B"), "r191336864");

        test.done();
    },

    testPropertiesFileMakeKeyEscapeN: function(test) {
        test.expect(2);

        var jf = new PropertiesFile(p);
        test.ok(jf);

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equals(jf.makeKey("A \\n B"), "r191336864");

        test.done();
    },

    testPropertiesFileMakeKeyTabs: function(test) {
        test.expect(2);

        var jf = new PropertiesFile(p);
        test.ok(jf);

        test.equals(jf.makeKey("A \t B"), "r191336864");

        test.done();
    },

    testPropertiesFileMakeKeyEscapeT: function(test) {
        test.expect(2);

        var jf = new PropertiesFile(p);
        test.ok(jf);

        test.equals(jf.makeKey("A \\t B"), "r191336864");

        test.done();
    },

    testPropertiesFileMakeKeyQuotes: function(test) {
        test.expect(2);

        var jf = new PropertiesFile(p);
        test.ok(jf);

        test.equals(jf.makeKey("A \\'B\\' C"), "r935639115");

        test.done();
    },

    testPropertiesFileMakeKeyInterpretEscapedUnicodeChars: function(test) {
        test.expect(2);

        var jf = new PropertiesFile(p);
        test.ok(jf);

        test.equals(jf.makeKey("\\u00A0 \\u0023"), "r2293235");

        test.done();
    },

    testPropertiesFileMakeKeyInterpretEscapedSpecialChars2: function(test) {
        test.expect(2);

        var jf = new PropertiesFile(p);
        test.ok(jf);

        test.equals(jf.makeKey("Talk to a support representative live 24/7 via video or \u00a0 text\u00a0chat"), "r969175354");

        test.done();
    },

    testPropertiesFileMakeKeyInterpretEscapedOctalChars: function(test) {
        test.expect(2);

        var jf = new PropertiesFile(p);
        test.ok(jf);

        test.equals(jf.makeKey("A \\40 \\011 B"), "r191336864");

        test.done();
    },

    testPropertiesFileMakeKeyJavaEscapeSequences: function(test) {
        test.expect(2);

        var jf = new PropertiesFile(p);
        test.ok(jf);

        test.equals(jf.makeKey("A \\b\\t\\n\\f\\r B"), "r191336864");

        test.done();
    },

    testPropertiesFileMakeKeyCheckRubyCompatibility: function(test) {
        test.expect(13);

        var jf = new PropertiesFile(p);
        test.ok(jf);

        test.equals(jf.makeKey("This has \\\"double quotes\\\" in it."), "r487572481");
        test.equals(jf.makeKey('This has \\\"double quotes\\\" in it.'), "r487572481");
        test.equals(jf.makeKey("This has \\\'single quotes\\\' in it."), "r900797640");
        test.equals(jf.makeKey('This has \\\'single quotes\\\' in it.'), "r900797640");
        test.equals(jf.makeKey("This is a double quoted string"), "r494590307");
        test.equals(jf.makeKey('This is a single quoted string'), "r683276274");
        test.equals(jf.makeKey("This is a double quoted string with \\\"quotes\\\" in it."), "r246354917");
        test.equals(jf.makeKey('This is a single quoted string with \\\'quotes\\\' in it.'), "r248819747");
        test.equals(jf.makeKey("This is a double quoted string with \\n return chars in it"), "r1001831480");
        test.equals(jf.makeKey('This is a single quoted string with \\n return chars in it'), "r147719125");
        test.equals(jf.makeKey("This is a double quoted string with \\t tab chars in it"), "r276797171");
        test.equals(jf.makeKey('This is a single quoted string with \\t tab chars in it'), "r303137748");

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

        j.parse('RB.getString("This is a test")');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "r654479252", "java"));
        test.ok(r);

        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

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

        j.parse('RB.getString("This is a test")');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

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

        j.parse('RB.getString("")');

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

        j.parse('   RB.getString  (    \t "This is a test"    );  ');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },

    testPropertiesFileParseIgnoreLeadingAndTrailingWhitespace: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString("  \t \n  This is a test\n\n\t   ");');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },

    testPropertiesFileParseDoubleEscapedWhitespace: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('ssb.append(RB.getString("\\\\nTry a Virtual Consult ›"));');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Try a Virtual Consult ›");
        test.ok(r);
        test.equal(r.getSource(), "Try a Virtual Consult ›");
        test.equal(r.getKey(), "r682432029");

        test.done();
    },

    testPropertiesFileParseIgnoreEscapedLeadingAndTrailingWhitespace: function(test) {
        test.expect(5);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('RB.getString("  \\t \\n  This is a test\\n\\n\\t   ");');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.done();
    },


    testPropertiesFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        var set = j.getTranslationSet();
        test.equal(set.size(), 0);

        j.parse('RB.getString("This is a test")');

        test.ok(set);

        test.equal(set.size(), 1);

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

        j.parse('\tRB.getString("This is a test"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        test.equal(r.getComment(), "this is a translator's comment");

        test.done();
    },

    testPropertiesFileParseSimpleWithUniqueIdAndTranslatorComment: function(test) {
        test.expect(6);

        var j = new PropertiesFile({
            project: p,
            pathName: undefined,
            type: jft
        });
        test.ok(j);

        j.parse('\tRB.getString("This is a test", "foobar"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');

        var set = j.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "foobar", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "foobar");
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

        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "unique_id", "java"));
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

        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "unique_id", "java"));
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

        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "x", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.ok(!r.getAutoKey());
        test.equal(r.getKey(), "x");

        r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "y", "java"));
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

        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "asdf", "java"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "asdf");
        test.equal(r.getComment(), "foo");

        r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "kdkdkd", "java"));
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

        r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "unique_id", "java"));
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

        var r = set.get(ContextResourceString.hashKey("webapp", undefined, "en-US", "id1", "java"));
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
