/*
 * JavaScriptFile.test.js - test the JavaScript file handler object.
 *
 * Copyright © 2019, 2023  2022-2023 Box, Inc.
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
if (!JavaScriptFile) {
    var JavaScriptFile = require("../JavaScriptFile.js");
    var JavaScriptFileType = require("../JavaScriptFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}
var p = new CustomProject({
    id: "app",
    plugins: [require.resolve("../.")],
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"]
});
var jsft = new JavaScriptFileType(p);
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
var jsft2 = new JavaScriptFileType(p2);
describe("javascriptfile", function() {
    test("JavaScriptFileConstructor", function() {
        expect.assertions(1);
        var j = new JavaScriptFile({
            project: p,
            type: jsft
        });
        expect(j).toBeTruthy();
    });
    test("JavaScriptFileConstructorParams", function() {
        expect.assertions(1);
        var j = new JavaScriptFile({
            project: p,
            pathName: "./testfiles/js/t1.js",
            type: jsft
        });
        expect(j).toBeTruthy();
    });
    test("JavaScriptFileConstructorNoFile", function() {
        expect.assertions(1);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
    });
    test("JavaScriptFileMakeKey", function() {
        expect.assertions(2);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        expect(j.makeKey("This is a test")).toBe("This is a test");
    });
    test("JavaScriptFileParseSimpleGetByKey", function() {
        expect.assertions(5);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getString("This is a test")');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "This is a test"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("This is a test");
    });
    test("JavaScriptFileParseSimpleGetBySource", function() {
        expect.assertions(5);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getString("This is a test")');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("JavaScriptFileParseJSSimpleGetBySource", function() {
        expect.assertions(5);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getStringJS("This is a test")');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("JavaScriptFileParseSimpleSingleQuotes", function() {
        expect.assertions(5);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse("RB.getString('This is a test')");
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("JavaScriptFileParseJSSimpleSingleQuotes", function() {
        expect.assertions(5);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse("RB.getStringJS('This is a test')");
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("JavaScriptFileParseMoreComplexSingleQuotes", function() {
        expect.assertions(5);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse("if (subcat == 'Has types') {title = RB.getString('Types of {topic}').format({topic: topic.attribute.name})}");
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("Types of {topic}");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Types of {topic}");
        expect(r.getKey()).toBe("Types of {topic}");
    });
    test("JavaScriptFileParseSimpleIgnoreWhitespace", function() {
        expect.assertions(5);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('   RB.getString  (    \t "This is a test"    );  ');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
    });
    test("JavaScriptFileParseJSCompressWhitespaceInKey", function() {
        expect.assertions(5);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getStringJS("\t\t This \\n \n is \\\n\t a    test")');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("\t\t This \\n \n is \t a    test");
    });
    test("JavaScriptFileParseSimpleRightSize", function() {
        expect.assertions(4);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
        j.parse('RB.getString("This is a test")');
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
    });
    test("JavaScriptFileParseSimpleWithTranslatorComment", function() {
        expect.assertions(6);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('\tRB.getString("This is a test"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("this is a translator's comment");
    });
    test("JavaScriptFileParseSingleQuotesWithTranslatorComment", function() {
        expect.assertions(6);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse("\tRB.getString('This is a test'); // i18n: this is a translator\'s comment\n\tfoo('This is not');");
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(r.getComment()).toBe("this is a translator's comment");
    });
    test("JavaScriptFileParseSingleQuotesWithEmbeddedSingleQuotes", function() {
        expect.assertions(5);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse(
            '    RB.getString(\'We\\\'ll notify you when {prefix}{last_name} accepts you as a friend!\').format({\n' +
            '        prefix: detail.name_prefix,\n' +
            '        last_name: detail.last_name\n' +
            '    });'
        );
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("We'll notify you when {prefix}{last_name} accepts you as a friend!");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("We'll notify you when {prefix}{last_name} accepts you as a friend!");
        expect(r.getKey()).toBe("We'll notify you when {prefix}{last_name} accepts you as a friend!");
    });
    test("JavaScriptFileParseSingleQuotesWithEmbeddedDoubleQuotes", function() {
        expect.assertions(5);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse(
            '    RB.getString("We\\"ll notify you when {prefix}{last_name} accepts you as a friend!").format({\n' +
            '        prefix: detail.name_prefix,\n' +
            '        last_name: detail.last_name\n' +
            '    });'
        );
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource('We"ll notify you when {prefix}{last_name} accepts you as a friend!');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('We"ll notify you when {prefix}{last_name} accepts you as a friend!');
        expect(r.getKey()).toBe('We"ll notify you when {prefix}{last_name} accepts you as a friend!');
    });
    test("JavaScriptFileParseSimpleWithUniqueIdAndTranslatorComment", function() {
        expect.assertions(6);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('\tRB.getString("This is a test", "foobar"); // i18n: this is a translator\'s comment\n\tfoo("This is not");');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "foobar"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("foobar");
        expect(r[0].getComment()).toBe("this is a translator's comment");
    });
    test("JavaScriptFileParseWithKey", function() {
        expect.assertions(5);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getString("This is a test", "unique_id")');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });
    test("JavaScriptFileParseJSWithKey", function() {
        expect.assertions(5);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getStringJS("This is a test", "unique_id")');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });
    test("JavaScriptFileParseWithKeySingleQuotes", function() {
        expect.assertions(5);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse("RB.getString('This is a test', 'unique_id')");
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });
    test("JavaScriptFileParseJSWithKeySingleQuotes", function() {
        expect.assertions(5);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse("RB.getStringJS('This is a test', 'unique_id')");
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBy({
            reskey: "unique_id"
        });
        expect(r).toBeTruthy();
        expect(r[0].getSource()).toBe("This is a test");
        expect(r[0].getKey()).toBe("unique_id");
    });
    test("JavaScriptFileParseWithKeyCantGetBySource", function() {
        expect.assertions(3);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getString("This is a test", "unique_id")');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(!r).toBeTruthy();
    });
    test("JavaScriptFileParseMultiple", function() {
        expect.assertions(8);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");');
        var set = j.getTranslationSet();
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
    test("JavaScriptFileParseMultipleWithKey", function() {
        expect.assertions(10);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getString("This is a test", "x");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "y");');
        var set = j.getTranslationSet();
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
    test("JavaScriptFileParseMultipleSameLine", function() {
        expect.assertions(12);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getString("This is a test"), RB.getString("This is a second test"), RB.getString("This is a third test")');
        var set = j.getTranslationSet();
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
    test("JavaScriptFileParseMultipleWithComments", function() {
        expect.assertions(10);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getString("This is a test");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test");\t// i18n: bar');
        var set = j.getTranslationSet();
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
    test("JavaScriptFileParseMultipleWithUniqueIdsAndComments", function() {
        expect.assertions(10);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getString("This is a test", "asdf");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test", "kdkdkd");\t// i18n: bar');
        var set = j.getTranslationSet();
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
    test("JavaScriptFileParseWithDups", function() {
        expect.assertions(6);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test");');
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("This is a test");
        expect(set.size()).toBe(1);
    });
    test("JavaScriptFileParseDupsDifferingByKeyOnly", function() {
        expect.assertions(8);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "unique_id");');
        var set = j.getTranslationSet();
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
    test("JavaScriptFileParseBogusConcatenation", function() {
        expect.assertions(2);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getString("This is a test" + " and this isnt");');
        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("JavaScriptFileParseBogusConcatenation2", function() {
        expect.assertions(2);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getString("This is a test" + foobar);');
        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("JavaScriptFileParseBogusNonStringParam", function() {
        expect.assertions(2);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getString(foobar);');
        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("JavaScriptFileParseEmptyParams", function() {
        expect.assertions(2);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('RB.getString();');
        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("JavaScriptFileParseWholeWord", function() {
        expect.assertions(2);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('EPIRB.getString("This is a test");');
        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("JavaScriptFileParseSubobject", function() {
        expect.assertions(2);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse('App.RB.getString("This is a test");');
        var set = j.getTranslationSet();
        expect(set.size()).toBe(1);
    });
    test("JavaScriptFileParsePunctuationBeforeRB", function() {
        expect.assertions(9);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse(
            "        <%\n" +
            "        var listsOver4 = false;\n" +
            "        var seemoreLen = 0;\n" +
            "        var subcats = [RB.getStringJS('Personal'), RB.getStringJS('Smart Watches')];\n" +
            "        _.each(subcats, function(subcat, j){\n" +
            "            var list = topic.attribute.kb_attribute_relationships[subcat] || [];\n" +
            "            if (list.length > 0) {\n" +
            "        %>\n");
        var set = j.getTranslationSet();
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
    test("JavaScriptFileParseEmptyString", function() {
        expect.assertions(3);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse("var subcats = [RB.getStringJS(''), RB.getString(''), RB.getStringJS('', 'foo')];\n");
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("JavaScriptFileParseNonString", function() {
        expect.assertions(3);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        j.parse("var subcats = [\n" +
        "    RB.getStringJS(variableName),\n" +
        "    RB.getString(undefined),\n" +
        "    RB.getStringJS(variableName, 'foo')\n" +
        "    RB.getString(function(x) {\n" +
        "       return foo.getId(x);\n" +
        "    }),\n" +
        "];\n");
        var set = j.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });
    test("JavaScriptFileExtractFile", function() {
        expect.assertions(8);
        var j = new JavaScriptFile({
            project: p,
            pathName: "./js/t1.js",
            type: jsft
        });
        expect(j).toBeTruthy();
        // should read the file
        j.extract();
        var set = j.getTranslationSet();
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
    test("JavaScriptFileExtractTemplateFile", function() {
        expect.assertions(11);
        var j = new JavaScriptFile({
            project: p,
            pathName: "./tmpl/topic_types.tmpl.html",
            type: jsft
        });
        expect(j).toBeTruthy();
        // should read the file
        j.extract();
        var set = j.getTranslationSet();
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
    test("JavaScriptFileExtractUndefinedFile", function() {
        expect.assertions(2);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        // should attempt to read the file and not fail
        j.extract();
        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("JavaScriptFileExtractBogusFile", function() {
        expect.assertions(2);
        var j = new JavaScriptFile({
            project: p,
            pathName: "./java/foo.js",
            type: jsft
        });
        expect(j).toBeTruthy();
        // should attempt to read the file and not fail
        j.extract();
        var set = j.getTranslationSet();
        expect(set.size()).toBe(0);
    });
    test("JavaScriptFileParseWithAlternateWrapper", function() {
        expect.assertions(9);
        var j = new JavaScriptFile({
            project: p2,
            pathName: undefined,
            type: jsft2
        });
        expect(j).toBeTruthy();
        j.parse(
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
        var set = j.getTranslationSet();
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
    test("JavaScriptFileParseWithAlternateWrapperAndEmbeddedQuote", function() {
        expect.assertions(9);
        var j = new JavaScriptFile({
            project: p2,
            pathName: undefined,
            type: jsft2
        });
        expect(j).toBeTruthy();
        j.parse(
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
        var set = j.getTranslationSet();
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
    test("JavaScriptFileParseParametersWithExtraTrailingCommas", function() {
        expect.assertions(9);
        var j = new JavaScriptFile({
            project: p,
            pathName: undefined,
            type: jsft
        });
        expect(j).toBeTruthy();
        // eslint has this nasty habit of inserting useless extra commas at the end
        // of parameter lists
        j.parse(
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
        var set = j.getTranslationSet();
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
