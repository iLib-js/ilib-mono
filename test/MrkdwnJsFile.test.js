/*
 * MrkdwnJsFile.test.js - test the Mrkdwn file handler object.
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
var path = require("path");
var fs = require("fs");

if (!MrkdwnJsFile) {
    var MrkdwnJsFile = require("../MrkdwnJsFile.js");
    var MrkdwnJsFileType = require("../MrkdwnJsFileType.js");
    var CustomProject = require("loctool/lib/CustomProject.js");
    var ProjectFactory =  require("loctool/lib/ProjectFactory.js");
    var TranslationSet = require("loctool/lib/TranslationSet.js");
    var ResourceString = require("loctool/lib/ResourceString.js");
}

var p = new CustomProject({
    name: "foo",
    id: "foo",
    plugins: ["../."],
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"]
});

var mdft = new MrkdwnJsFileType(p);
var base = path.dirname(module.id);

var p2 = new CustomProject({
    sourceLocale: "en-US",
    id: "foo",
    name: "foo",
    plugins: ["../."]
}, "./test/testfiles", {
    locales:["en-GB"],
    identify: true
});

var mdft2 = new MrkdwnJsFileType(p2);
var p3 = new CustomProject({
    sourceLocale: "en-US",
    id: "foo",
    name: "foo",
    plugins: ["../."]
}, "./test/testfiles", {
    locales:["en-GB"],
    nopseudo: true,
    mrkdwn: {
        mappings: {
            "**/simple.js": {
                template: "[locale]/[dir]/[filename]"
            },
            "**/asdf/bar/simple2.js": {
                template: "[locale]/asdf/bar/[filename]"
            },
            "**/bar/simple3.js": {
                template: "asdf/[locale]/bar/[filename]"
            },
            "**/simple4.js": {
                template: "[locale]/asdf/bar/[filename]",
                localeMap: {
                    "fr-FR": "fr",
                    "zh-Hans-CN": "zh-CN"
                }
            },
            "asdf/pen-USing/en-US/bar/asdf.js": {
                template: "[locale]/bar/[filename]"
            },
            "**/asdf.js": {
                template: "[dir]/[locale]/bar/[filename]"
            },
            "**/x/*.js": {
                template: "[dir]/[basename]_[locale].js"
            },
            "**/y/*.js": {
                template: "[dir]/[locale]/[basename].js"
            }
        }
    }
});

var mdft3 = new MrkdwnJsFileType(p3);

describe("mrkdwn", function() {
    test("MrkdwnJsFileConstructor", function() {
        expect.assertions(1);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
    });

    test("MrkdwnJsFileConstructorParams", function() {
        expect.assertions(1);
        var mjf = new MrkdwnJsFile({
            project: p,
            pathName: "./testfiles/md/test1.js",
            type: mdft
        });
        expect(mjf).toBeTruthy();
    });

    test("MrkdwnJsFileConstructorNoFile", function() {
        expect.assertions(1);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
    });

    test("MrkdwnJsFileParseSimpleGetByKey", function() {
        expect.assertions(5);

        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a test",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ResourceString.hashKey("foo", "en-US", "id1", "mrkdwn"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileParseSimpleGetBySource", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a test",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileParseEmpty", function() {
        expect.assertions(3);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });

    test("MrkdwnJsFileParseSimpleRightSize", function() {
        expect.assertions(4);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        var set = mjf.getTranslationSet();
        expect(set.size()).toBe(0);
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a test"\n' +
            '};\n'
        );
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
    });

    test("MrkdwnJsFileParseMultiple", function() {
        expect.assertions(8);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });

        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a test",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("id1");
        r = set.getBySource("This is a test too");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test too");
        expect(r.getKey()).toBe("id2");
    });

    test("MrkdwnJsFileParseMultiple with single quotes", function() {
        expect.assertions(8);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });

        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            "    'id1': 'This is a test',\n" +
            "    'id2': 'This is a test too'\n" +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("id1");
        r = set.getBySource("This is a test too");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test too");
        expect(r.getKey()).toBe("id2");
    });

    test("MrkdwnJsFileParseNonBreakingEmphasis", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a *test* of the emergency parsing system.",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        mjf.parse('This is a *test* of the emergency parsing system.\n');
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileParseNonBreaking Italic", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a _test_ of the emergency parsing system.",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        mjf.parse('This is a *test* of the emergency parsing system.\n');
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileParseNonBreaking StrikeThrough", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a ~test~ of the emergency parsing system.",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        mjf.parse('This is a *test* of the emergency parsing system.\n');
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileParseNestedNonBreakingEmphasis", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This _is a *test* of the emergency parsing_ system.",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This <c0>is a <c1>test</c1> of the emergency parsing</c0> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This <c0>is a <c1>test</c1> of the emergency parsing</c0> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileParseNestedAndSequentialNonBreakingEmphasis", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This _is a *test* of the_ *emergency parsing* system.",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This <c0>is a <c1>test</c1> of the</c0> <c2>emergency parsing</c2> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This <c0>is a <c1>test</c1> of the</c0> <c2>emergency parsing</c2> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileParse text with newlines", function() {
        expect.assertions(5);

        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a test of the\\nemergency parsing system.",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the\nemergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the\nemergency parsing system.");
        expect(r.getKey()).toBe("id1");
    });

    /*
    slack parser library does not support blockquotes yet
    test("MrkdwnJsFileParse text with a blockquote in the middle of it", function() {
        expect.assertions(10);

        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is text\\n> This is quoted text\\n>This is still quoted\\nThis is unquoted.",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(3);

        expect(r[0].getSource()).toBe("This is a text");
        expect(r[0].getKey()).toBe("id1");
        expect(r[1].getSource()).toBe("This is quoted text\nThis is still quoted");
        expect(r[1].getKey()).toBe("id1_1");
        expect(r[2].getSource()).toBe("This is unquoted");
        expect(r[2].getKey()).toBe("id1_2");
    });
    */

    test("MrkdwnJsFileParse text with inline code", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "The expression `E = mc^2` was Einstein\\\'s greatest achievement",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("The expression <c0/> was Einstein\'s greatest achievement");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("The expression <c0/> was Einstein\'s greatest achievement");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileParse text with multiline code", function() {
        expect.assertions(4);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "```\n  const x = obj.getX();\n  console.log(x);\n```",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(1);
    });

    test("MrkdwnJsFileParse text with multiline code snippet plus other text", function() {
        expect.assertions(8);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "Text before the code\\n\\n```\\n  const x = obj.getX();\\n  console.log(x);\\n```\\n\\nText after the code",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(2);

        expect(r[0].getSource()).toBe("Text before the code\n\n<c0/>\n\nText after the code");
        expect(r[0].getKey()).toBe("id1");
        expect(r[1].getSource()).toBe("This is a test too");
        expect(r[1].getKey()).toBe("id2");
    });

    test("MrkdwnJsFileParse non breaking links with no text", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a test of the <http://foo.com/bar/asdf.html> system.",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0/> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileParse non breaking links with text", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a test of the <http://foo.com/bar/asdf.html|emergency parsing> system.",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0>emergency parsing</c0> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0>emergency parsing</c0> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileParse non breaking links to channels with no text", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a test of the <#parsing_channel> system.",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0/> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileParse non breaking links to channels using channel id in hex and with no text", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a test of the <#C234AF56> system.",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0/> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileParse non breaking links to special mentions", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a test of the <!here> system.",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0/> system.");
        expect(r.getKey()).toBe("id1");
    });


    test("MrkdwnJsFileParse non breaking emojis", function() {
        expect.assertions(5);

        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a test of the :emergency: system.",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0/> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileParse non breaking links to date formats without fallback text", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a test of the <!date^1392734382^Posted {date_num} {time_secs}> system.",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0/> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileParse non breaking links to date formats with fallback text", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a test of the <!date^1392734382^Posted {date_num} {time_secs}|emergency> system.",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0>emergency</c0> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0>emergency</c0> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileParseNonBreakingEmphasisOutside", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "*This is a test of the emergency parsing system.*",\n' +
            '    "id2": "This is a test too"\n' +
            '};\n'
        );
        mjf.parse('*This is a test of the emergency parsing system.*\n');
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        // should only get the text inside the emphasis markers
        var r = set.getBySource("<c0>This is a test of the emergency parsing system.</c0>");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("<c0>This is a test of the emergency parsing system.</c0>");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileExtractFile", function() {
        expect.assertions(14);
        var base = path.dirname(module.id);
        var mjf = new MrkdwnJsFile({
            project: p,
            pathName: "./js/test1.js",
            type: mdft
        });
        expect(mjf).toBeTruthy();
        // should read the file
        mjf.extract();
        var set = mjf.getTranslationSet();
        expect(set.size()).toBe(4);
        var r = set.getBySource("This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        expect(r.getKey()).toBe("id1");
        r = set.getBySource("This is some text. This is more text. Pretty, pretty text.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is some text. This is more text. Pretty, pretty text.");
        expect(r.getKey()).toBe("id2");
        r = set.getBySource("This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        expect(r.getKey()).toBe("id3");
        r = set.getBySource("This is the last bit of localizable text.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is the last bit of localizable text.");
        expect(r.getKey()).toBe("id4");
    });

    test("MrkdwnJsFileExtractFile2", function() {
        expect.assertions(11);
        var base = path.dirname(module.id);
        var mjf = new MrkdwnJsFile({
            project: p,
            pathName: "./js/test2.js",
            type: mdft
        });
        expect(mjf).toBeTruthy();
        // should read the file
        mjf.extract();
        var set = mjf.getTranslationSet();
        expect(set.size()).toBe(3);
        var r = set.getBySource("This is text with a <c0>link</c0> in it.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is text with a <c0>link</c0> in it.");
        expect(r.getKey()).toBe("id2");
        r = set.getBySource("This is text with <c0>some emphasis <c1>on the wrong</c1> syllable</c0>. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is text with <c0>some emphasis <c1>on the wrong</c1> syllable</c0>. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        expect(r.getKey()).toBe("id3");
        r = set.getBySource("This is a Heading");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a Heading");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsFileExtractUndefinedFile", function() {
        expect.assertions(2);
        var base = path.dirname(module.id);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        // should attempt to read the file and not fail
        mjf.extract();
        var set = mjf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("MrkdwnJsFileExtractBogusFile", function() {
        expect.assertions(2);
        var base = path.dirname(module.id);
        var mjf = new MrkdwnJsFile({
            project: p,
            pathName: "./js/bogus.js",
            type: mdft
        });
        expect(mjf).toBeTruthy();
        // should attempt to read the file and not fail
        mjf.extract();
        var set = mjf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("MrkdwnJsFileLocalizeText", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });

        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a test",\n' +
            '};\n'
        );
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "id1",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "fr-FR");
        var expected =
            'export default messages = {\n' +
            '    "id1": "Ceci est un essai"\n' +
            '};\n';
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsFileLocalizeText more complicated", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This *is* a test",\n' +
            '};\n'
        );
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "id1",
            source: "This <c0>is</c0> a test",
            sourceLocale: "en-US",
            target: "Ceci <c0>est</c0> un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "fr-FR");
        var expected =
            'export default messages = {\n' +
            '    "id1": "Ceci *est* un essai"\n' +
            '};\n';
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsFileLocalizeTextMultiple", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This *is* a test",\n' +
            '    "id2": "This is _also_ a test"\n' +
            '};\n'
        );
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "id1",
            source: "This <c0>is</c0> a test",
            sourceLocale: "en-US",
            target: "Ceci <c0>est</c0> un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "id2",
            source: "This is <c0>also</c0> a test",
            sourceLocale: "en-US",
            target: "Ceci est <c0>aussi</c0> un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "fr-FR");
        var expected =
            'export default messages = {\n' +
            '    "id1": "Ceci *est* un essai",\n' +
            '    "id2": "Ceci est _aussi_ un essai"\n' +
            '};\n';
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsFileLocalizeTextWithLinks", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a <http://www.test.com/|test> of the emergency parsing system."\n' +
            '};\n'
        );
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "id1",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "fr-FR");
        var expected =
            'export default messages = {\n' +
            '    "id1": "Ceci est un <http://www.test.com/|essai> du système d\'analyse syntaxique de l\'urgence."\n' +
            '};\n';
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsFileLocalizeText with multiple components nested in the same string", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This *is _a_ test*",\n' +
            '};\n'
        );
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "id1",
            source: "This <c0>is <c1>a</c1> test</c0>",
            sourceLocale: "en-US",
            target: "Ceci <c0>est <c1>un</c1> essai</c0>",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "fr-FR");
        var expected =
            'export default messages = {\n' +
            '    "id1": "Ceci *est _un_ essai*"\n' +
            '};\n';
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsFileLocalizeText with multiple components switched order", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This *is* _a_ test",\n' +
            '};\n'
        );
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "id1",
            source: "This <c0>is <c1>a</c1> test</c0>",
            sourceLocale: "en-US",
            target: "Ceci <c1>est</c1> <c0>un</c0> essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "fr-FR");
        var expected =
            'export default messages = {\n' +
            '    "id1": "Ceci _est_ *un* essai"\n' +
            '};\n';
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsFileLocalizeText with multiple components nested switching the nesting", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This *is _a_ test*",\n' +
            '};\n'
        );
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "id1",
            source: "This <c0>is <c1>a</c1> test</c0>",
            sourceLocale: "en-US",
            target: "Ceci <c1>est <c0>un</c0> essai</c1>",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "fr-FR");
        var expected =
            'export default messages = {\n' +
            '    "id1": "Ceci _est *un* essai_"\n' +
            '};\n';
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsFileLocalizeTextWithInlineCode", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a `test` of the emergency parsing system."\n' +
            '};\n'
        );
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "id1",
            source: "This is a <c0/> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0/> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "fr-FR");
        var expected =
            'export default messages = {\n' +
            '    "id1": "Ceci est un `test` du système d\'analyse syntaxique de l\'urgence."\n' +
            '};\n';
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsFileLocalizeText with all the types of syntax", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a <http://link.com> line",\n' +
            '    "id2": "This is a <http://link.com|label> line",\n' +
            '    "id3": "This is a <@user> line",\n' +
            '    "id4": "This is a <@user|label> line",\n' +
            '    "id5": "This is a <#channel> line",\n' +
            '    "id6": "This is a <#channel|label> line",\n' +
            '    "id7": "This is a <!command> line",\n' +
            '    "id8": "This is a <!command^arg1^arg2|label> line",\n' +
            '    "id9": "This is a _italic_ line",\n' +
            '    "id10": "This is a *bold* line",\n' +
            '    "id11": "This is a ~strikeout~ line",\n' +
            '    "id12": "This is a ```\\npretext\\n```\\n line",\n' +
            '    "id13": "This is a :emoji: line",\n' +
            '    "id14": "This is a `code` line"\n' +
            '};\n'
        );
        var translations = new TranslationSet();
        translations.addAll([
            new ResourceString({
                project: "foo",
                key: "id1",
                source: "This is a <c0/> line",
                sourceLocale: "en-US",
                target: "Ceci est un link <c0/>",
                targetLocale: "fr-FR",
                datatype: "mrkdwn"
            }),
            new ResourceString({
                project: "foo",
                key: "id2",
                source: "This is a <c0>label</c0> line",
                sourceLocale: "en-US",
                target: "Ceci est un link avec <c0>un nom</c0>",
                targetLocale: "fr-FR",
                datatype: "mrkdwn"
            }),
            new ResourceString({
                project: "foo",
                key: "id3",
                source: "This is a <c0/> line",
                sourceLocale: "en-US",
                target: "Ceci est un ligne <c0/>",
                targetLocale: "fr-FR",
                datatype: "mrkdwn"
            }),
            new ResourceString({
                project: "foo",
                key: "id4",
                source: "This is a <c0>label</c0> line",
                sourceLocale: "en-US",
                target: "Ceci est un ligne avec <c0>un nom</c0>",
                targetLocale: "fr-FR",
                datatype: "mrkdwn"
            }),
            new ResourceString({
                project: "foo",
                key: "id5",
                source: "This is a <c0/> line",
                sourceLocale: "en-US",
                target: "Ceci est un ligne <c0/>",
                targetLocale: "fr-FR",
                datatype: "mrkdwn"
            }),
            new ResourceString({
                project: "foo",
                key: "id6",
                source: "This is a <c0>label</c0> line",
                sourceLocale: "en-US",
                target: "Ceci est un ligne avec <c0>un nom</c0>",
                targetLocale: "fr-FR",
                datatype: "mrkdwn"
            }),
            new ResourceString({
                project: "foo",
                key: "id7",
                source: "This is a <c0/> line",
                sourceLocale: "en-US",
                target: "Ceci est un ligne <c0/>",
                targetLocale: "fr-FR",
                datatype: "mrkdwn"
            }),
            new ResourceString({
                project: "foo",
                key: "id8",
                source: "This is a <c0>label</c0> line",
                sourceLocale: "en-US",
                target: "Ceci est un ligne avec <c0>un nom</c0>",
                targetLocale: "fr-FR",
                datatype: "mrkdwn"
            }),
            new ResourceString({
                project: "foo",
                key: "id9",
                source: "This is a <c0>italic</c0> line",
                sourceLocale: "en-US",
                target: "Ceci est un ligne avec <c0>italique</c0>",
                targetLocale: "fr-FR",
                datatype: "mrkdwn"
            }),
            new ResourceString({
                project: "foo",
                key: "id9",
                source: "This is a <c0>italic</c0> line",
                sourceLocale: "en-US",
                target: "Ceci est un ligne avec <c0>italique</c0>",
                targetLocale: "fr-FR",
                datatype: "mrkdwn"
            }),
            new ResourceString({
                project: "foo",
                key: "id10",
                source: "This is a <c0>bold</c0> line",
                sourceLocale: "en-US",
                target: "Ceci est un ligne avec <c0>gras</c0>",
                targetLocale: "fr-FR",
                datatype: "mrkdwn"
            }),
            new ResourceString({
                project: "foo",
                key: "id11",
                source: "This is a <c0>strikeout</c0> line",
                sourceLocale: "en-US",
                target: "Ceci est un ligne avec <c0>barré</c0>",
                targetLocale: "fr-FR",
                datatype: "mrkdwn"
            }),
            new ResourceString({
                project: "foo",
                key: "id12",
                source: "This is a <c0/>\\n line",
                sourceLocale: "en-US",
                target: "Ceci est un ligne avec <c0/>",
                targetLocale: "fr-FR",
                datatype: "mrkdwn"
            }),
            new ResourceString({
                project: "foo",
                key: "id13",
                source: "This is a <c0/> line",
                sourceLocale: "en-US",
                target: "Ceci est un ligne avec <c0/>",
                targetLocale: "fr-FR",
                datatype: "mrkdwn"
            }),
            new ResourceString({
                project: "foo",
                key: "id14",
                source: "This is a <c0/> line",
                sourceLocale: "en-US",
                target: "Ceci est un ligne avec <c0/>",
                targetLocale: "fr-FR",
                datatype: "mrkdwn"
            })
        ]);
        var actual = mjf.localizeText(translations, "fr-FR");
        var expected =
            'export default messages = {\n' +
            '    "id1": "Ceci est un link <http://link.com>",\n' +
            '    "id2": "Ceci est un link avec <http://link.com|un nom>",\n' +
            '    "id3": "Ceci est un ligne <@user>",\n' +
            '    "id4": "Ceci est un ligne avec <@user|un nom>",\n' +
            '    "id5": "Ceci est un ligne <#channel>",\n' +
            '    "id6": "Ceci est un ligne avec <#channel|un nom>",\n' +
            '    "id7": "Ceci est un ligne <!command>",\n' +
            '    "id8": "Ceci est un ligne avec <!command^arg1^arg2|un nom>",\n' +
            '    "id9": "Ceci est un ligne avec _italique_",\n' +
            '    "id10": "Ceci est un ligne avec *gras*",\n' +
            '    "id11": "Ceci est un ligne avec ~barré~",\n' +
            '    "id12": "Ceci est un ligne avec ```\\npretext\\n```",\n' +
            '    "id13": "Ceci est un ligne avec :emoji:",\n' +
            '    "id14": "Ceci est un ligne avec `code`"\n' +
            '};\n';
        expect(actual).toBe(expected);
    });


    test("MrkdwnJsFileLocalizeTextNonBreakingTagsOutside", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();

        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "*This is a test of the emergency parsing system.*"\n' +
            '};\n'
        );
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "id1",
            source: "<c0>This is a test of the emergency parsing system.</c0>",
            sourceLocale: "en-US",
            target: "<c0>Ceci est un essai du système d'analyse syntaxique de l'urgence.</c0>",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "fr-FR");
        var expected =
            'export default messages = {\n' +
            '    "id1": "*Ceci est un essai du système d\'analyse syntaxique de l\'urgence.*"\n' +
            '};\n';
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsFileLocalizeTextWithInlineCodeAtTheEnd", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();

        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "Delete the file with this command: `git rm filename`"\n' +
            '};\n'
        );
        // should not optimize out inline code at the end of strings so that it can be
        // part of the text that is translated
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "id1",
            source: "Delete the file with this command: <c0/>",
            sourceLocale: "en-US",
            target: "Avec cette commande <c0/>, vous pouvez supprimer le fichier.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "fr-FR");
        var expected =
            'export default messages = {\n' +
            '    "id1": "Avec cette commande `git rm filename`, vous pouvez supprimer le fichier."\n' +
            '};\n';
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsFileLocalizeTextMismatchedNumberOfComponents", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();

        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a _test_ of the emergency parsing system."\n' +
            '};\n'
        );
        var translations = new TranslationSet();
        // there is no c1 in the source, so this better not throw an exception
        translations.add(new ResourceString({
            project: "foo",
            key: "id1",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse <c1>syntaxique</c1> de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        // Should ignore the c1 as if it weren't there
        var actual = mjf.localizeText(translations, "fr-FR");
        var expected =
            'export default messages = {\n' +
            '    "id1": "Ceci est un _essai_ du système d\'analyse syntaxique de l\'urgence."\n' +
            '};\n';
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsFileLocalizeTextMismatchedNumberOfComponentsSelfClosing", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'export default messages = {\n' +
            '    "id1": "This is a _test_ of the emergency parsing system."\n' +
            '};\n'
        );
        var translations = new TranslationSet();
        // there is no c1 in the source, so this better not throw an exception
        translations.add(new ResourceString({
            project: "foo",
            key: "id1",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse <c1/> syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        // Should ignore the c1 as if it weren't there
        var actual = mjf.localizeText(translations, "fr-FR");
        var expected =
            'export default messages = {\n' +
            '    "id1": "Ceci est un _essai_ du système d\'analyse  syntaxique de l\'urgence."\n' +
            '};\n';
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsFileGetLocalizedPathSimple", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p3,
            pathName: "simple.js",
            type: mdft3
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("fr-FR/simple.js");
    });

    test("MrkdwnJsFileGetLocalizedPathComplex", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p3,
            pathName: "./asdf/bar/simple2.js",
            type: mdft3
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.js");
    });

    test("MrkdwnJsFileGetLocalizedPathRegularMrkdwnJsFileName", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p3,
            pathName: "./asdf/bar/simple2.js",
            type: mdft3
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.js");
    });

    test("MrkdwnJsFileGetLocalizedPathNotEnoughParts", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p3,
            pathName: "./asdf/bar/simple",
            type: mdft3
        });
        expect(mjf).toBeTruthy();

        expect(mjf.getLocalizedPath("fr-FR")).toBe("asdf/bar/simple_fr-FR.js");
    });

    test("MrkdwnJsFileGetLocalizedPathAlreadyHasSourceLocale", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p3,
            pathName: "./en-US/asdf/bar/simple2.js",
            type: mdft3
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.js");
    });

    test("MrkdwnJsFileGetLocalizedPathSourceLocaleInMidPath", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p3,
            pathName: "./asdf/en-US/bar/simple3.js",
            type: mdft3
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("asdf/fr-FR/bar/simple3.js");
    });

    test("MrkdwnJsFileGetLocalizedPathSourceLocaleInBeginningPath", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p3,
            pathName: "en-US/asdf/bar/simple2.js",
            type: mdft3
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.js");
    });

    test("MrkdwnJsFileGetLocalizedPathSourceLocaleInMidPathOnlyWholeLocale", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsFile({
            project: p3,
            pathName: "./asdf/pen-USing/en-US/bar/asdf.js",
            type: mdft3
        });
        expect(mjf).toBeTruthy();
        // should leave "pen-USing" alone and only get the "en-US" path component
        expect(mjf.getLocalizedPath("fr-FR")).toBe("fr-FR/bar/asdf.js");
    });

    test("MrkdwnJsFileGetLocalizedPathWithLocaleMap", function() {
        expect.assertions(3);
        var mjf = new MrkdwnJsFile({
            project: p3,
            pathName: "simple4.js",
            type: mdft3
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("fr/asdf/bar/simple4.js");
        expect(mjf.getLocalizedPath("zh-Hans-CN")).toBe("zh-CN/asdf/bar/simple4.js");
    });

    test("MrkdwnJsFileGetLocalizedPath default mapping", function() {
        expect.assertions(3);
        var mjf = new MrkdwnJsFile({
            project: p,
            pathName: "a/b/c/test.js",
            type: mdft
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("a/b/c/test_fr-FR.js");
        expect(mjf.getLocalizedPath("zh-Hans-CN")).toBe("a/b/c/test_zh-Hans-CN.js");
    });

    test("MrkdwnJsFileLocalizeFile", function() {
        expect.assertions(5);
        var base = path.dirname(module.id);
        var mjf = new MrkdwnJsFile({
            project: p,
            pathName: "./js/test1.js",
            type: mdft
        });
        expect(mjf).toBeTruthy();
        // should read the file
        mjf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'id1',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'id2',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'id3',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'id4',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'id1',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'id2',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'id3',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'id4',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        mjf.localize(translations, ["fr-FR", "de-DE"]);
        expect(fs.existsSync(path.join(p.target, "js/test1_fr-FR.js"))).toBeTruthy();
        expect(fs.existsSync(path.join(p.target, "js/test1_de-DE.js"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p.target, "js/test1_fr-FR.js"), "utf-8");
        var expected =
            'export default messages = {\n' +
            '    "id1": "Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.",\n' +
            '    "id2": "Ceci est du texte. C\'est plus de texte. Joli, joli texte.",\n' +
            '    "id3": "Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.",\n' +
            '    "id4": "C\'est le dernier morceau de texte localisable."\n' +
            '};\n';
        expect(content).toBe(expected);
        var content = fs.readFileSync(path.join(p.target, "js/test1_de-DE.js"), "utf-8");
        var expected =
            'export default messages = {\n' +
            '    "id1": "Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.",\n' +
            '    "id2": "Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.",\n' +
            '    "id3": "Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.",\n' +
            '    "id4": "Dies ist der letzte Teil des lokalisierbaren Textes."\n' +
            '};\n';
        expect(content).toBe(expected);
    });

    test("MrkdwnJsFileLocalizeNoStrings", function() {
        expect.assertions(5);
        var base = path.dirname(module.id);

        var frenchFile = path.join(p.target, "js/nostrings_fr-FR.js");
        var germanFile = path.join(p.target, "js/nostrings_de-DE.js");
        if (fs.existsSync(frenchFile)) {
            fs.unlinkSync(frenchFile);
        }
        if (fs.existsSync(germanFile)) {
            fs.unlinkSync(germanFile);
        }
        expect(fs.existsSync(frenchFile)).toBeFalsy();
        expect(fs.existsSync(germanFile)).toBeFalsy();

        var mjf = new MrkdwnJsFile({
            project: p3,
            pathName: "./js/nostrings.js",
            type: mdft3
        });
        expect(mjf).toBeTruthy();
        // should read the file
        mjf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'id1',
            source: 'Get insurance quotes for free!',
            target: 'Obtenez des devis d\'assurance gratuitement!',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'id1',
            source: 'Get insurance quotes for free!',
            target: 'Kostenlosen Versicherungs-Angebote erhalten!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));

        mjf.localize(translations, ["fr-FR", "de-DE"]);
        // should produce the files, even if there is nothing to localize in them
        expect(fs.existsSync(frenchFile)).toBeTruthy();
        expect(fs.existsSync(germanFile)).toBeTruthy();
    });

    test("MrkdwnJsFileExtractFile get the right new resources", function() {
        expect.assertions(16);
        var base = path.dirname(module.id);
        var t = new MrkdwnJsFileType(p);
        var mjf = new MrkdwnJsFile({
            project: p,
            pathName: "./js/mode.js",
            type: t
        });
        expect(mjf).toBeTruthy();
        mjf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "id1",
            source: "Choose a meeting method",
            sourceLocale: "en-US",
            target: "Choisissez une méthode de réunion d'affaires",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "fr-FR");
        var expected =
            'export default messages = {\n' +
            '    "id1": "Choisissez une méthode de réunion d\'affaires",\n' +
            '    "id2": "[Ťëšţ þĥŕàšë543210]",\n' +
            '    "id3": "[Ïñ Pëŕšõñ Mõðë6543210]"\n' +
            '};\n';
        expect(actual).toBe(expected);
        var set = t.newres;
        var resources = set.getAll();
        expect(resources.length).toBe(2);
        var r = set.getBySource("Choose a meeting method");
        expect(!r).toBeTruthy();
        r = set.getBySource("Test phrase");
        expect(r).toBeTruthy();
        expect(resources[0].getKey()).toBe("id2");
        expect(resources[0].getSource()).toBe("Test phrase");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getTarget()).toBe("Test phrase");
        expect(resources[0].getTargetLocale()).toBe("fr-FR");
        r = set.getBySource("In Person Mode");
        expect(r).toBeTruthy();
        expect(resources[1].getKey()).toBe("id3");
        expect(resources[1].getSource()).toBe("In Person Mode");
        expect(resources[1].getSourceLocale()).toBe("en-US");
        expect(resources[1].getTarget()).toBe("In Person Mode");
        expect(resources[1].getTargetLocale()).toBe("fr-FR");
    });
});
