/*
 * RegexFile.test.js - test the Regex file handler object.
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

var RegexFile = require("../RegexFile.js");
var RegexFileType = require("../RegexFileType.js");
var CustomProject =  require("loctool/lib/CustomProject.js");

var p = new CustomProject({
    id: "app",
    plugins: [require.resolve("../.")],
    sourceLocale: "en-US"
}, "./test/testfiles", {
    "locales":["en-GB", "de-DE", "fr-FR", "ja-JP"],
    "regex": {
        "mappings": {
            "**/*.js": {
                "resourceFileType": "ilib-loctool-javascript-resource",
                "template": "resources/strings_[locale].json",
                "sourceLocale": "en-US",
                "expressions": [
                    {
                        "expression": "\b\\$t\\s*\\(\"(?<source>[^\"]*)\"\\)",
                        "flags": "g",
                        "datatype": "javascript",
                        "resourceType": "string",
                        "keyStrategy": "hash"
                    }
                ]
            },
            "**/*.tmpl": {
                "resourceFileType": "ilib-loctool-php-resource",
                "template": "resources/Translation[locale].json",
                "sourceLocale": "en-US",
                "expressions": [
                    {
                        // example:
                        // {* @L10N The message shown to users whose passwords have just been changed *}
                        // {'Your password was changed. Please log in again.'|f:'login_success_password_changed'}
                        "expression": "\\{.*@L10N\\s*(?<comment>[^*]*)\\*\\}.*\\{.*'(?<source>[^']*)'\\s*\\|\\s*f:\\s*'(?<key>[^']*)'.*\\}",
                        "flags": "g",
                        "datatype": "template",
                        "resourceType": "string"
                    }
                ]
            }
        }
    },
    "php": {
        "localeMap": {
            "en-US": "EnUS",
            "en-GB": "EnGB",
            "de-DE": "DeDE",
            "fr-FR": "FrFR",
            "ja-JP": "JaJP"
        },
        "sourceLocale": "en-US"
    }
});

var rft = new RegexFileType(p);

// test a different wrapper
var p2 = new CustomProject({
    id: "app",
    plugins: [require.resolve("../.")],
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"],
    javascript: {
        wrapper: "(^r|\\Wr)b\\s*\\.\\s*getString(JS)?"
    }
});

var rft2 = new RegexFileType(p2);

describe("regex file tests", function() {
    test("RegexFileConstructor", function() {
        expect.assertions(1);

        var rf = new RegexFile({
            project: p,
            type: rft
        });
        expect(rf).toBeTruthy();
    });

    test("RegexFileConstructorParams", function() {
        expect.assertions(1);

        var rf = new RegexFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: rft
        });

        expect(rf).toBeTruthy();
    });

    test("RegexFileConstructorNoFile", function() {
        expect.assertions(1);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();
    });

    test("RegexFileMakeKey", function() {
        expect.assertions(2);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        expect(rf.makeKey("This is a test")).toBe("This is a test");
    });

    test("RegexFileParseSimpleGetByKey", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getString("This is a test")');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "This is a test"
        });
        expect(r).toBeTruthy();

        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("This is a test");
    });

    test("RegexFileParseSimpleGetBySource", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getString("This is a test")');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });

    test("RegexFileParseJSSimpleGetBySource", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getStringJS("This is a test")');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });

    test("RegexFileParseSimpleSingleQuotes", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("RB.getString('This is a test')");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });

    test("RegexFileParseJSSimpleSingleQuotes", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("RB.getStringJS('This is a test')");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });

    test("RegexFileParseMoreComplexSingleQuotes", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("if (subcat == 'Has types') {title = RB.getString('Types of {topic}').format({topic: topic.attribute.name})}");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("Types of {topic}");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Types of {topic}");
        expect(r.getKey()).toBe("Types of {topic}");
    });

    test("RegexFileParseSimpleIgnoreWhitespace", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('   RB.getString  (    \t "This is a test"    );  ');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });

    test("RegexFileParseJSCompressWhitespaceInKey", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getStringJS("\t\t This \\n \n is \\\n\t a    test")');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("\t\t This \\n \n is \t a    test");
    });

    test("RegexFileParseSimpleRightSize", function() {
        expect.assertions(4);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(0);

        rf.parse('RB.getString("This is a test")');

        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("RegexFileParseSimpleWithTranslatorComment", function() {
        expect.assertions(6);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('\tRB.getString("This is a test"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("this is a translator's comment");
    });

    test("RegexFileParseSingleQuotesWithTranslatorComment", function() {
        expect.assertions(6);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("\tRB.getString('This is a test'); // i18n: this is a translator\'s comment\n\tfoo('This is not');");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("this is a translator's comment");
    });

    test("RegexFileParseSingleQuotesWithEmbeddedSingleQuotes", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse(
            '    RB.getString(\'We\\\'ll notify you when {prefix}{last_name} accepts you as a friend!\').format({\n' +
            '        prefix: detail.name_prefix,\n' +
            '        last_name: detail.last_name\n' +
            '    });'
        );

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("We'll notify you when {prefix}{last_name} accepts you as a friend!");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("We'll notify you when {prefix}{last_name} accepts you as a friend!");
        expect(r.getKey()).toBe("We'll notify you when {prefix}{last_name} accepts you as a friend!");
    });

    test("RegexFileParseSingleQuotesWithEmbeddedDoubleQuotes", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse(
            '    RB.getString("We\\"ll notify you when {prefix}{last_name} accepts you as a friend!").format({\n' +
            '        prefix: detail.name_prefix,\n' +
            '        last_name: detail.last_name\n' +
            '    });'
        );

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource('We"ll notify you when {prefix}{last_name} accepts you as a friend!');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('We"ll notify you when {prefix}{last_name} accepts you as a friend!');
        expect(r.getKey()).toBe('We"ll notify you when {prefix}{last_name} accepts you as a friend!');
    });

    test("RegexFileParseSimpleWithUniqueIdAndTranslatorComment", function() {
        expect.assertions(6);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('\tRB.getString("This is a test", "foobar"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "foobar"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("foobar");
        expect(r[0].getComment()).toBe("this is a translator's comment");
    });

    test("RegexFileParseWithKey", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getString("This is a test", "unique_id")');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });

    test("RegexFileParseJSWithKey", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getStringJS("This is a test", "unique_id")');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });

    test("RegexFileParseWithKeySingleQuotes", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("RB.getString('This is a test', 'unique_id')");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });

    test("RegexFileParseJSWithKeySingleQuotes", function() {
        expect.assertions(5);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("RB.getStringJS('This is a test', 'unique_id')");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });

    test("RegexFileParseWithKeyCantGetBySource", function() {
        expect.assertions(3);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getString("This is a test", "unique_id")');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(!r).toBeTruthy();
    });

    test("RegexFileParseMultiple", function() {
        expect.assertions(8);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("This is also a test");
    });

    test("RegexFileParseMultipleWithKey", function() {
        expect.assertions(10);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getString("This is a test", "x");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "y");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "x"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(!r[0].getAutoKey()).toBeTruthy();
        expect(r[0].getKey()).toBe("x");

        r = set.getBy({
            reskey: "y"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(!r[0].getAutoKey()).toBeTruthy();
        expect(r[0].getKey()).toBe("y");
    });

    test("RegexFileParseMultipleSameLine", function() {
        expect.assertions(12);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getString("This is a test"), RB.getString("This is a second test"), RB.getString("This is a third test")');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(3);

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");

        r = set.getBySource("This is a second test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a second test");
        expect(r.getKey()).toBe("This is a second test");

        r = set.getBySource("This is a third test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a third test");
        expect(r.getKey()).toBe("This is a third test");
    });

    test("RegexFileParseMultipleWithComments", function() {
        expect.assertions(10);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getString("This is a test");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");\t// i18n: bar');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("foo");

        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("This is also a test");
        expect(r.getComment()).toBe("bar");
    });

    test("RegexFileParseMultipleWithUniqueIdsAndComments", function() {
        expect.assertions(10);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getString("This is a test", "asdf");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test", "kdkdkd");\t// i18n: bar');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "asdf"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("asdf");
        expect(r[0].getComment()).toBe("foo");

        r = set.getBy({
            reskey: "kdkdkd"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is also a test");
        expect(r[0].getKey()).toBe("kdkdkd");
        expect(r[0].getComment()).toBe("bar");
    });

    test("RegexFileParseWithDups", function() {
        expect.assertions(6);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");

        expect(set.size()).toBe(1);
    });

    test("RegexFileParseDupsDifferingByKeyOnly", function() {
        expect.assertions(8);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "unique_id");');

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");

        r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });

    test("RegexFileParseBogusConcatenation", function() {
        expect.assertions(2);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getString("This is a test" + " and this isnt");');

        var set = rf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("RegexFileParseBogusConcatenation2", function() {
        expect.assertions(2);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getString("This is a test" + foobar);');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("RegexFileParseBogusNonStringParam", function() {
        expect.assertions(2);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getString(foobar);');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("RegexFileParseEmptyParams", function() {
        expect.assertions(2);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('RB.getString();');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("RegexFileParseWholeWord", function() {
        expect.assertions(2);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('EPIRB.getString("This is a test");');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("RegexFileParseSubobject", function() {
        expect.assertions(2);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse('App.RB.getString("This is a test");');

        var set = rf.getTranslationSet();
        expect(set.size()).toBe(1);
    });

    test("RegexFileParsePunctuationBeforeRB", function() {
        expect.assertions(9);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse(
            "        <%\n" +
            "        var listsOver4 = false;\n" +
            "        var seemoreLen = 0;\n" +
            "        var subcats = [RB.getStringJS('Personal'), RB.getStringJS('Smart Watches')];\n" +
            "        _.each(subcats, function(subcat, j){\n" +
            "            var list = topic.attribute.kb_attribute_relationships[subcat] || [];\n" +
            "            if (list.length > 0) {\n" +
            "        %>\n");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(2);

        var r = set.getBySource("Personal");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Personal");
        expect(r.getKey()).toBe("Personal");

        r = set.getBySource("Smart Watches");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Smart Watches");
        expect(r.getKey()).toBe("Smart Watches");
    });

    test("RegexFileParseEmptyString", function() {
        expect.assertions(3);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("var subcats = [RB.getStringJS(''), RB.getString(''), RB.getStringJS('', 'foo')];\n");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("RegexFileParseNonString", function() {
        expect.assertions(3);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        rf.parse("var subcats = [\n" +
        "    RB.getStringJS(variableName),\n" +
        "    RB.getString(undefined),\n" +
        "    RB.getStringJS(variableName, 'foo')\n" +
        "    RB.getString(function(x) {\n" +
        "       return foo.getId(x);\n" +
        "    }),\n" +
        "];\n");

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(0);
    });

    test("RegexFileExtractFile", function() {
        expect.assertions(8);

        var rf = new RegexFile({
            project: p,
            pathName: "./js/t1.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        // should read the file
        rf.extract();

        var set = rf.getTranslationSet();

        expect(set.size()).toBe(2);

        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");

        var r = set.getBy({
            reskey: "id1"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test with a unique id");
        expect(r[0].getKey()).toBe("id1");
    });

    test("RegexFileExtractTemplateFile", function() {
        expect.assertions(11);

        var rf = new RegexFile({
            project: p,
            pathName: "./tmpl/topic_types.tmpl.html",
            type: rft
        });
        expect(rf).toBeTruthy();

        // should read the file
        rf.extract();

        var set = rf.getTranslationSet();

        expect(set.size()).toBe(4);

        var r = set.getBySource("Hand-held Devices");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Hand-held Devices");
        expect(r.getKey()).toBe("Hand-held Devices");

        r = set.getBySource("Tablets");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Tablets");
        expect(r.getKey()).toBe("Tablets");

        r = set.getBySource("Smart Watches");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Smart Watches");
        expect(r.getKey()).toBe("Smart Watches");
    });

    test("RegexFileExtractUndefinedFile", function() {
        expect.assertions(2);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // should attempt to read the file and not fail
        rf.extract();

        var set = rf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("RegexFileExtractBogusFile", function() {
        expect.assertions(2);

        var rf = new RegexFile({
            project: p,
            pathName: "./java/foo.js",
            type: rft
        });
        expect(rf).toBeTruthy();

        // should attempt to read the file and not fail
        rf.extract();

        var set = rf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("RegexFileParseWithAlternateWrapper", function() {
        expect.assertions(9);

        var rf = new RegexFile({
            project: p2,
            pathName: undefined,
            type: rft2
        });
        expect(rf).toBeTruthy();

        rf.parse(
            "if (subcat === 'Has types') {\n" +
            "    buttonText = rb\n" +
            "                . getStringJS   (\n" +
            "                     'Start Download'\n" +
            "                ) ;\n" +
            "    title = rb\n" +
            "                .  getString (\n" +
            "                     'Types of {topic}',\n" +
            "                     'unique key'\n" +
            "                )\n" +
            "                .format({\n" +
            "                    topic: topic.attribute.name\n" +
            "                });\n" +
            "}\n"
        );

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "unique key"
        });
        expect(r).toBeTruthy();
        expect(r.length).toBe(1);
        expect(r[0].getSource()).toBe("Types of {topic}");
        expect(r[0].getKey()).toBe("unique key");

        r = set.getBySource("Start Download");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Start Download");
        expect(r.getKey()).toBe("Start Download");
    });

    test("RegexFileParseWithAlternateWrapperAndEmbeddedQuote", function() {
        expect.assertions(9);

        var rf = new RegexFile({
            project: p2,
            pathName: undefined,
            type: rft2
        });
        expect(rf).toBeTruthy();

        rf.parse(
            "if (subcat === 'Has types') {\n" +
            "    buttonText = rb\n" +
            "                . getStringJS   (\n" +
            "                     'Start \\\"Download'\n" +
            "                ) ;\n" +
            "    title = rb\n" +
            "                .  getString (\n" +
            "                     'Types of {topic}',\n" +
            "                     'unique key'\n" +
            "                )\n" +
            "                .format({\n" +
            "                    topic: topic.attribute.name\n" +
            "                });\n" +
            "}\n"
        );

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "unique key"
        });
        expect(r).toBeTruthy();
        expect(r.length).toBe(1);
        expect(r[0].getSource()).toBe("Types of {topic}");
        expect(r[0].getKey()).toBe("unique key");

        r = set.getBySource("Start \"Download");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Start \"Download");
        expect(r.getKey()).toBe("Start \"Download");
    });

    test("RegexFileParseParametersWithExtraTrailingCommas", function() {
        expect.assertions(9);

        var rf = new RegexFile({
            project: p,
            pathName: undefined,
            type: rft
        });
        expect(rf).toBeTruthy();

        // eslint has this nasty habit of inserting useless extra commas at the end
        // of parameter lists
        rf.parse(
            "if (subcat === 'Has types') {\n" +
            "    buttonText = RB.getStringJS(\n" +
            "        'Start Download',\n" +
            "    );\n" +
            "    title = RB.getString(\n" +
            "        'Types of {topic}',\n" +
            "        'unique key',\n" +
            "    )\n" +
            "    .format({\n" +
            "        topic: topic.attribute.name\n" +
            "    });\n" +
            "}\n"
        );

        var set = rf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.getBy({
            reskey: "unique key"
        });
        expect(r).toBeTruthy();
        expect(r.length).toBe(1);
        expect(r[0].getSource()).toBe("Types of {topic}");
        expect(r[0].getKey()).toBe("unique key");

        r = set.getBySource("Start Download");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Start Download");
        expect(r.getKey()).toBe("Start Download");
    });
});
