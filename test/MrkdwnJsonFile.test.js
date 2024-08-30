/*
 * MrkdwnJsonFile.test.js - test the Mrkdwn file handler object.
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

if (!MrkdwnJsonFile) {
    var MrkdwnJsonFile = require("../MrkdwnJsonFile.js");
    var MrkdwnJsonFileType = require("../MrkdwnJsonFileType.js");
    var CustomProject = require("loctool/lib/CustomProject.js");
    var ProjectFactory =  require("loctool/lib/ProjectFactory.js");
    var TranslationSet = require("loctool/lib/TranslationSet.js");
    var ResourceString = require("loctool/lib/ResourceString.js");
}

function diff(a, b) {
    var min = Math.min(a.length, b.length);
    for (var i = 0; i < min; i++) {
        if (a[i] !== b[i]) {
            console.log("Found difference at character " + i);
            console.log("a: " + a.substring(i));
            console.log("b: " + b.substring(i));
            break;
        }
    }
}
var p = new CustomProject({
    name: "foo",
    id: "foo",
    plugins: ["../."],
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"],
    targetDir: "./test/testfiles"
});

var mdft = new MrkdwnJsonFileType(p);
var base = path.dirname(module.id);

var p2 = new CustomProject({
    sourceLocale: "en-US",
    id: "foo",
    name: "foo",
    plugins: ["../."]
}, "./test/testfiles", {
    locales:["en-GB"],
    targetDir: "./test/testfiles",
    identify: true
});

var mdft2 = new MrkdwnJsonFileType(p2);
var p3 = new CustomProject({
    sourceLocale: "en-US",
    id: "foo",
    name: "foo",
    plugins: ["../."]
}, "./test/testfiles", {
    locales:["en-GB"],
    targetDir: "./test/testfiles",
    nopseudo: true,
    mrkdwn: {
        mappings: {
            "**/simple.json": {
                template: "[locale]/[dir]/[filename]"
            },
            "**/asdf/bar/simple2.json": {
                template: "[locale]/asdf/bar/[filename]"
            },
            "**/bar/simple3.json": {
                template: "asdf/[locale]/bar/[filename]"
            },
            "**/simple4.json": {
                template: "[locale]/asdf/bar/[filename]",
                localeMap: {
                    "fr-FR": "fr",
                    "zh-Hans-CN": "zh-CN"
                }
            },
            "asdf/pen-USing/en-US/bar/asdf.json": {
                template: "[locale]/bar/[filename]"
            },
            "**/asdf.json": {
                template: "[dir]/[locale]/bar/[filename]",
                frontmatter: ["test"]
            },
            "**/x/*.json": {
                template: "[dir]/[base]_[locale].json",
                frontmatter: ["Title", "Description"]
            },
            "**/y/*.json": {
                template: "[dir]/[locale]/[base].json",
                frontmatter: true
            }
        }
    }
});

var mdft3 = new MrkdwnJsonFileType(p3);

describe("mrkdwn", function() {
    test("MrkdwnJsonFileConstructor", function() {
        expect.assertions(1);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
    });

    test("MrkdwnJsonFileConstructorParams", function() {
        expect.assertions(1);
        var mjf = new MrkdwnJsonFile({
            project: p,
            pathName: "./testfiles/md/test1.json",
            type: mdft
        });
        expect(mjf).toBeTruthy();
    });

    test("MrkdwnJsonFileConstructorNoFile", function() {
        expect.assertions(1);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
    });

    test("MrkdwnJsonFileParseSimpleGetByKey", function() {
        expect.assertions(5);

        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is a test",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ResourceString.hashKey("foo", "en-US", "id1", "mrkdwn"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileParseSimpleGetBySource", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is a test",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileParseEmpty", function() {
        expect.assertions(3);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });

    test("MrkdwnJsonFileParseSimpleRightSize", function() {
        expect.assertions(4);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        var set = mjf.getTranslationSet();
        expect(set.size()).toBe(0);
        mjf.parse(
            '{\n' +
            '    "id1": "This is a test"\n' +
            '}\n'
        );
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
    });

    test("MrkdwnJsonFileParseMultiple", function() {
        expect.assertions(8);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is a test",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
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

    test("MrkdwnJsonFileParseNonBreakingEmphasis", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is a *test* of the emergency parsing system.",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        mjf.parse('This is a *test* of the emergency parsing system.\n');
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileParseNonBreaking Italic", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is a _test_ of the emergency parsing system.",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        mjf.parse('This is a *test* of the emergency parsing system.\n');
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileParseNonBreaking StrikeThrough", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is a ~test~ of the emergency parsing system.",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        mjf.parse('This is a *test* of the emergency parsing system.\n');
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileParseNestedNonBreakingEmphasis", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This _is a *test* of the emergency parsing_ system.",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This <c0>is a <c1>test</c1> of the emergency parsing</c0> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This <c0>is a <c1>test</c1> of the emergency parsing</c0> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileParseNestedAndSequentialNonBreakingEmphasis", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This _is a *test* of the_ *emergency parsing* system.",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This <c0>is a <c1>test</c1> of the</c0> <c2>emergency parsing</c2> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This <c0>is a <c1>test</c1> of the</c0> <c2>emergency parsing</c2> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileParse text with newlines", function() {
        expect.assertions(5);

        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is a test of the\\nemergency parsing system.",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the\nemergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the\nemergency parsing system.");
        expect(r.getKey()).toBe("id1");
    });

    /*
    slack parser library does not support blockquotes
    test("MrkdwnJsonFileParse text with a blockquote in the middle of it", function() {
        expect.assertions(10);

        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is text\\n> This is quoted text\\n>This is still quoted\\nThis is unquoted.",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
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

    test("MrkdwnJsonFileParse text with inline code", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "The expression `E = mc^2` was Einstein\\\'s greatest achievement",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("The expression <c0/> was Einstein\'s greatest achievement");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("The expression <c0/> was Einstein\'s greatest achievement");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileParse text with multiline code", function() {
        expect.assertions(4);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "```\n  const x = obj.getX();\n  console.log(x);\n```\n",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(0);
    });

    test("MrkdwnJsonFileParse text with multiline code snippet plus other text", function() {
        expect.assertions(10);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "Text before the code\\n\\n```\\n  const x = obj.getX();\\n  console.log(x);\\n```\\n\\nText after the code",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getAll();
        expect(r).toBeTruthy();
        expect(r.length).toBe(3);

        expect(r[0].getSource()).toBe("Text before the code");
        expect(r[0].getKey()).toBe("id1");
        expect(r[1].getSource()).toBe("Text after the code");
        expect(r[1].getKey()).toBe("id1_1");
        expect(r[2].getSource()).toBe("This is a test too");
        expect(r[2].getKey()).toBe("id2");
    });

    test("MrkdwnJsonFileParse non breaking links with no text", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is a test of the <http://foo.com/bar/asdf.html> system.",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0/> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileParse non breaking links with text", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is a test of the <http://foo.com/bar/asdf.html|emergency parsing> system.",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0>emergency parsing</c0> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0>emergency parsing</c0> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileParse non breaking links to channels with no text", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is a test of the <#parsing_channel> system.",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0/> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileParse non breaking links to channels using channel id in hex and with no text", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is a test of the <#C234AF56> system.",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0/> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileParse non breaking links to special mentions", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is a test of the <!here> system.",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0/> system.");
        expect(r.getKey()).toBe("id1");
    });


    test("MrkdwnJsonFileParse non breaking emojis", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is a test of the :emergency: system.",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0/> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileParse non breaking links to date formats without fallback text", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is a test of the <!date^1392734382^Posted {date_num} {time_secs}> system.",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0/> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileParse non breaking links to date formats with fallback text", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "This is a test of the <!date^1392734382^Posted {date_num} {time_secs}|emergency> system.",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0>emergency</c0> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0>emergency</c0> system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileParseNonBreakingEmphasisOutside", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '{\n' +
            '    "id1": "*This is a test of the emergency parsing system.*",\n' +
            '    "id2": "This is a test too"\n' +
            '}\n'
        );
        mjf.parse('*This is a test of the emergency parsing system.*\n');
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        // should only get the text inside the emphasis markers
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("id1");
    });

    test("MrkdwnJsonFileExtractFile", function() {
        expect.assertions(14);
        var base = path.dirname(module.id);
        var mjf = new MrkdwnJsonFile({
            project: p,
            pathName: "./json/test1.json",
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

    test("MrkdwnJsonFileExtractFile2", function() {
        expect.assertions(11);
        var base = path.dirname(module.id);
        var mjf = new MrkdwnJsonFile({
            project: p,
            pathName: "./json/test2.json",
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

    test("MrkdwnJsonFileExtractUndefinedFile", function() {
        expect.assertions(2);
        var base = path.dirname(module.id);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        // should attempt to read the file and not fail
        mjf.extract();
        var set = mjf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("MrkdwnJsonFileExtractBogusFile", function() {
        expect.assertions(2);
        var base = path.dirname(module.id);
        var mjf = new MrkdwnJsonFile({
            project: p,
            pathName: "./json/bogus.json",
            type: mdft
        });
        expect(mjf).toBeTruthy();
        // should attempt to read the file and not fail
        mjf.extract();
        var set = mjf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

/*
    test("MrkdwnJsonFileLocalizeText", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a test\n');
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
        var expected = 'Ceci est un essai';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeTextPreserveWhitespace", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a test    \n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un essai    \n');
    });

    test("MrkdwnJsonFileLocalizeTextMultiple", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a test\n\n' +
                'This is also a test\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un essai\n\n' +
                'Ceci est aussi un essai\n');
    });

    test("MrkdwnJsonFileLocalizeTextWithDups", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a test\n\n' +
                'This is also a test\n\n' +
                'This is a test\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un essai\n\n' +
                'Ceci est aussi un essai\n\n' +
                'Ceci est un essai\n');
    });

    test("MrkdwnJsonFileLocalizeTextSkipScript", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('<script>\n' +
                '// comment text\n' +
                'if (locales.contains[thisLocale]) {\n' +
                '    document.write("<input id=\"locale\" class=\"foo\" title=\"bar\"></input>");\n' +
                '}\n' +
                '</script>\n' +
                '\n' +
                'This is a test\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('<script>\n' +
            '// comment text\n' +
            'if (locales.contains[thisLocale]) {\n' +
            '    document.write("<input id=\"locale\" class=\"foo\" title=\"bar\"></input>");\n' +
            '}\n' +
            '</script>\n' +
            '\n' +
            'Ceci est un essai\n');
    });

    test("MrkdwnJsonFileLocalizeTextWithLinks", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a [test](http://www.test.com/) of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un [essai](http://www.test.com/) du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MrkdwnJsonFileLocalizeTextWithLinksNotTranslated", function() {
        expect.assertions(6);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        // make sure there are no new strings before we start
        mdft.newres.clear();
        expect(mdft.newres.size()).toBe(0);
        expect(mjf.getTranslationSet().size()).toBe(0);
        mjf.parse('This is a [test](http://www.test.com/) of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un [essai](http://www.test.com/) du système d\'analyse syntaxique de l\'urgence.\n');
        // the set of new translations should be empty because we did not extract the link
        var newSet = mdft.getNew();
        expect(newSet.size()).toBe(0);
        expect(mjf.getTranslationSet().size()).toBe(1);
    });

    test("MrkdwnJsonFileLocalizeTextWithLinksTranslatedNew", function() {
        expect.assertions(7);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        // make sure there are no new strings before we start
        mdft.newres.clear();
        expect(mdft.newres.size()).toBe(0);
        expect(mjf.getTranslationSet().size()).toBe(0);
        mjf.parse(
            '<!-- i18n-enable localize-links -->\n' +
            'This is a [test](http://www.test.com/) of the emergency parsing system.\n' +
            '<!-- i18n-disable localize-links -->\n'
        );
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        // no translation available for the link itself
        expect(mjf.localizeText(translations, "fr-FR")).toBe('<!-- i18n-enable localize-links -->\n\n' +
            'Ceci est un [essai](http://www.test.com/) du système d\'analyse syntaxique de l\'urgence.\n\n' +
            '<!-- i18n-disable localize-links -->\n'
        );
        // the set of new translations should now contain the link
        var newSet = mdft.getNew();
        expect(newSet.size()).toBe(1);
        var resources = newSet.getAll();
        expect(resources[0].getSource()).toBe("http://www.test.com/");
        expect(mjf.getTranslationSet().size()).toBe(2);
    });

    test("MrkdwnJsonFileLocalizeTextWithLinksTranslated", function() {
        expect.assertions(6);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        // make sure there are no new strings before we start
        mdft.newres.clear();
        expect(mdft.newres.size()).toBe(0);
        expect(mjf.getTranslationSet().size()).toBe(0);
        mjf.parse(
            '<!-- i18n-enable localize-links -->\n' +
            'This is a [test](http://www.test.com/) of the emergency parsing system.\n' +
            '<!-- i18n-disable localize-links -->\n'
        );
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r474012543",
            source: "http://www.test.com/",
            sourceLocale: "en-US",
            target: "http://www.test.com/fr",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        // no translation available for the link itself
        expect(mjf.localizeText(translations, "fr-FR")).toBe('<!-- i18n-enable localize-links -->\n\n' +
            'Ceci est un [essai](http://www.test.com/fr) du système d\'analyse syntaxique de l\'urgence.\n\n' +
            '<!-- i18n-disable localize-links -->\n'
        );
        // the set of new translations should not contain the link because it was already translated
        var newSet = mdft.getNew();
        expect(newSet.size()).toBe(0);
        expect(mjf.getTranslationSet().size()).toBe(2);
    });

    test("MrkdwnJsonFileLocalizeTextWithInlineCode", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a `test` of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r879023644",
            source: "This is a <c0/> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0/> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un `test` du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MrkdwnJsonFileLocalizeTextWithInlineCodeAtTheEnd", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('Delete the file with this command: `git rm filename`\n');
        // should not optimize out inline code at the end of strings so that it can be
        // part of the text that is translated
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r66239583",
            source: "Delete the file with this command: <c0/>",
            sourceLocale: "en-US",
            target: "Avec cette commande <c0/>, vous pouvez supprimer le fichier.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Avec cette commande `git rm filename`, vous pouvez supprimer le fichier.\n');
    });

    test("MrkdwnJsonFileLocalizeInlineCodeByItself", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'This is a test of the inline code system.\n' +
            '\n' +
            '`inline code`\n' +
            '\n' +
            'Sentence after.\n');
        // should not optimize out inline code at the end of strings so that it can be
        // part of the text that is translated
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r41637229",
            source: "This is a test of the inline code system.",
            sourceLocale: "en-US",
            target: "Ceci est un teste de la systeme 'inline code'.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r16227039",
            source: "Sentence after.",
            sourceLocale: "en-US",
            target: "La phrase denier.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe("Ceci est un teste de la systeme 'inline code'.\n" +
            '\n' +
            '`inline code`\n' +
            '\n' +
            'La phrase denier.\n');
    });

    test("MrkdwnJsonFileLocalizeTextWithLinkReference", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a test of the emergency [C1] parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r1017266258",
            source: "This is a test of the emergency <c0>C1</c0> parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse syntaxique de l'urgence <c0>C1</c0>.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un test du système d\'analyse syntaxique de l\'urgence [C1][C1].\n');
    });

    test("MrkdwnJsonFileLocalizeTextWithMultipleLinkReferences", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a test of the emergency [C1] parsing system [R1].\n\n[C1]: https://www.box.com/test1\n[R1]: http://www.box.com/about.html\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r817759238",
            source: "This is a test of the emergency <c0>C1</c0> parsing system <c1>R1</c1>.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse syntaxique <c1>Reponse1</c1> de l'urgence <c0>teste</c0>.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un test du système d\'analyse syntaxique [Reponse1][R1] de l\'urgence [teste][C1].\n\n[C1]: https://www.box.com/test1\n\n[R1]: http://www.box.com/about.html\n');
    });

    test("MrkdwnJsonFileLocalizeTextWithMultipleLocalizableLinkReferences", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a test of the emergency [C1] parsing system [R1].\n\n' +
            '<!-- i18n-enable localize-links -->\n' +
            '[C1]: https://www.box.com/test1\n' +
            '[R1]: http://www.box.com/about.html\n' +
            '<!-- i18n-disable localize-links -->\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r817759238",
            source: "This is a test of the emergency <c0>C1</c0> parsing system <c1>R1</c1>.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse syntaxique <c1>Reponse1</c1> de l'urgence <c0>teste</c0>.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r647537837",
            source: "https://www.box.com/test1",
            sourceLocale: "en-US",
            target: "https://www.box.com/fr/test1",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r448858983",
            source: "http://www.box.com/about.html",
            sourceLocale: "en-US",
            target: "http://www.box.com/fr/about.html",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un test du système d\'analyse syntaxique [Reponse1][R1] de l\'urgence [teste][C1].\n\n' +
            '<!-- i18n-enable localize-links -->\n\n' +
            '[C1]: https://www.box.com/fr/test1\n\n' +
            '[R1]: http://www.box.com/fr/about.html\n\n' +
            '<!-- i18n-disable localize-links -->\n');
    });

    test("MrkdwnJsonFileLocalizeTextWithFootnotes", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a test of the emergency parsing [^1] system.\n\n' +
            '[^1]: well, not really\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r1010312382",
            source: "This is a test of the emergency parsing <c0/> system.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse syntaxique <c0/> de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r472274968",
            source: "well, not really",
            sourceLocale: "en-US",
            target: "normalement, c'est pas vrai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un test du système d\'analyse syntaxique [^1] de l\'urgence.\n\n' +
            '[^1]: normalement, c\'est pas vrai\n');
    });

    test("MrkdwnJsonFileLocalizeTextWithFootnotesLongName", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a test of the emergency parsing [^longname] system.\n\n' +
            '[^longname]: well, not really\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r1010312382",
            source: "This is a test of the emergency parsing <c0/> system.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse syntaxique <c0/> de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r472274968",
            source: "well, not really",
            sourceLocale: "en-US",
            target: "normalement, c'est pas vrai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un test du système d\'analyse syntaxique [^longname] de l\'urgence.\n\n' +
            '[^longname]: normalement, c\'est pas vrai\n');
    });

    test("MrkdwnJsonFileLocalizeTextNonBreakingTags", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a <em>test</em> of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un <em>essai</em> du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MrkdwnJsonFileLocalizeTextNonBreakingTagsOutside", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('*This is a test of the emergency parsing system.*\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r699762575",
            source: "This is a test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('_Ceci est un essai du système d\'analyse syntaxique de l\'urgence._\n');
    });

    test("MrkdwnJsonFileLocalizeTextNonBreakingTagsBeforeAndAfter", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('*_ <span class="test"> <span id="foo"></span></span>  This is a test of the emergency parsing system.   _*\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r699762575",
            source: "This is a test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('__ <span class="test"> <span id="foo"></span></span>  Ceci est un essai du système d\'analyse syntaxique de l\'urgence.   __\n');
    });

    test("MrkdwnJsonFileLocalizeTextNonBreakingTagsInside", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r124733470',
            source: 'This is <c0> a test of the emergency parsing </c0> system.',
            target: 'Ceci est <c0> un essai du système d\'analyse syntaxique de l\'urgence. </c0>',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de l\'urgence. </span>\n');
    });

    test("MrkdwnJsonFileLocalizeTextNonBreakingTagsInsideMultiple", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r772812508',
            source: 'This is <c0> a test of the <c1>emergency</c1> parsing </c0> system.',
            target: 'Ceci est <c0> un essai du système d\'analyse syntaxique de <c1>l\'urgence</c1>.</c0>',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence</em>.</span>\n');
    });

    test("MrkdwnJsonFileLocalizeTextNonBreakingTagsNotWellFormed", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r417724998',
            source: 'This is <c0> a test of the <c1>emergency parsing </c1></c0> system.',
            target: 'Ceci est <c0> un essai du système d\'analyse syntaxique de <c1>l\'urgence.</c1></c0>',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence.</em></span>\n');
    });

    test("MrkdwnJsonFileLocalizeTextBreakingTags", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a <p>test of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r21364457",
            source: "This is a",
            sourceLocale: "en-US",
            target: "Ceci est un",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r787549036",
            source: "test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un <p>essai du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MrkdwnJsonFileLocalizeTextSelfClosedBreakingTags", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a <p/>test of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r21364457",
            source: "This is a",
            sourceLocale: "en-US",
            target: "Ceci est un",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r787549036",
            source: "test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un <p/>essai du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MrkdwnJsonFileLocalizeTextSelfClosingNonBreakingTags", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a <br>test of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r292870472",
            source: "This is a <c0/>test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0/>essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un <br>essai du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MrkdwnJsonFileLocalizeTextSelfClosedNonBreakingTags", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a <br/>test of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r292870472",
            source: "This is a <c0/>test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0/>essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un <br/>essai du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MrkdwnJsonFileLocalizeTextMismatchedNumberOfComponents", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a <em>test</em> of the emergency parsing system.\n');
        var translations = new TranslationSet();
        // there is no c1 in the source, so this better not throw an exception
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse <c1>syntaxique</c1> de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        // Should ignore the c1 as if it weren't there
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un <em>essai</em> du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MrkdwnJsonFileLocalizeTextMismatchedNumberOfComponentsSelfClosing", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a <em>test</em> of the emergency parsing system.\n');
        var translations = new TranslationSet();
        // there is no c1 in the source, so this better not throw an exception
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse <c1/> syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        // Should ignore the c1 as if it weren't there
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est un <em>essai</em> du système d\'analyse  syntaxique de l\'urgence.\n');
    });

    test("MrkdwnJsonFileLocalizeTextLocalizableTitle", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('Mrkdwn text <div title="This value is localizable">This is a test</div>\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r922503175',
            source: 'This value is localizable',
            target: 'Cette valeur est localisable',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r654479252',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('\\[Màŕķðõŵñ ţëxţ6543210] <div title="Cette valeur est localisable">Ceci est un essai</div>\n');
    });

    test("MrkdwnJsonFileLocalizeTextLocalizableTitleSingleQuotes", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse("Mrkdwn text <div title='This value is localizable'>This is a test</div>\n");
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            key: 'r922503175',
            project: "foo",
            source: 'This value is localizable',
            target: 'Cette valeur est localisable',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r654479252',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('\\[Màŕķðõŵñ ţëxţ6543210] <div title="Cette valeur est localisable">Ceci est un essai</div>\n');
    });

    test("MrkdwnJsonFileLocalizeTextLocalizableAttributes", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('![Alternate text](http://www.test.test/foo.png "title here")\n' +
                'This is a test\n' +
                '<input type="text" placeholder="localizable placeholder here">\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1051764073',
            source: 'Alternate text',
            target: 'Texte alternative',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r625153591',
            source: 'title here',
            target: 'titre ici',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r654479252',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r734414247',
            source: 'localizable placeholder here',
            target: 'espace réservé localisable ici',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('![Texte alternative](http://www.test.test/foo.png "titre ici")\n' +
            'Ceci est un essai\n' +
            '<input type="text" placeholder="espace réservé localisable ici">\n');
    });

    test("MrkdwnJsonFileLocalizeTextLocalizableAttributesAndNonBreakingTags", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is <a href="foo.html" title="localizable title">a test</a> of non-breaking tags.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1063253939',
            source: 'This is <c0>a test</c0> of non-breaking tags.',
            target: 'Ceci est <c0>un essai</c0> des balises non-ruptures.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r160369622',
            source: 'localizable title',
            target: 'titre localisable',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est <a href="foo.html" title="titre localisable">un essai</a> des balises non-ruptures.\n');
    });

    test("MrkdwnJsonFileLocalizeTextLocalizableValuelessAttributes", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is <a href="foo.html" checked title="localizable title">a test</a> of non-breaking tags.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1063253939',
            source: 'This is <c0>a test</c0> of non-breaking tags.',
            target: 'Ceci est <c0>un essai</c0> des balises non-ruptures.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r160369622',
            source: 'localizable title',
            target: 'titre localisable',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('Ceci est <a href="foo.html" checked title="titre localisable">un essai</a> des balises non-ruptures.\n');
    });

    test("MrkdwnJsonFileLocalizeTextI18NComments", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('<!-- i18n: this describes the text below -->\n' +
                'This is a test of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r699762575',
            source: 'This is a test of the emergency parsing system.',
            target: 'Ceci est un essai du système d\'analyse syntaxique de l\'urgence.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('<!-- i18n: this describes the text below -->\n\n' +
            'Ceci est un essai du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MrkdwnJsonFileLocalizeTextIdentifyResourceIds", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p2,
            type: mdft2
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a test\n\n' +
                'This is also a test\n\n' +
                'This is a test\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var expected =
            '<span x-locid="r654479252">Ceci est un essai</span>\n\n' +
            '<span x-locid="r999080996">Ceci est aussi un essai</span>\n\n' +
            '<span x-locid="r654479252">Ceci est un essai</span>\n';
        var actual = mjf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeHTMLWithValuelessAttributes", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('<span class="foo" checked>This is a test of the emergency parsing system.</span>\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r699762575",
            source: "This is a test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse d'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var expected =
            '<span class="foo" checked>Ceci est un test du système d\'analyse d\'urgence.</span>\n';
        var actual = mjf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeFlowStyleHTML", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '<span class="foo" checked>\n' +
            'This is a test of the emergency parsing system.\n' +
            '</span>\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r699762575",
            source: "This is a test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse d'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var expected =
            '<span class="foo" checked>\n' +
            'Ceci est un test du système d\'analyse d\'urgence.\n' +
            '</span>\n';
        var actual = mjf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeFlowStyleHTMLMultiple", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '<span class="foo" checked>\n' +
            'This is a test of the emergency parsing system.\n' +
            '</span>\n' +
            '<message>\n' +
            'This is translatable.\n' +
            '</message>\n'
            );
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r699762575",
            source: "This is a test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse d'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r299977686",
            source: "This is translatable.",
            sourceLocale: "en-US",
            target: "Ceci est traduitable.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var expected =
            '<span class="foo" checked>\n' +
            'Ceci est un test du système d\'analyse d\'urgence.\n' +
            '</span>\n' +
            '<message>\n' +
            'Ceci est traduitable.\n' +
            '</message>\n';
        var actual = mjf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeFlowStyleHTMLMultipleWithTextInBetween", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '<span class="foo" checked>\n' +
            'This is a test of the emergency parsing system.\n' +
            '</span>\n' +
            '\n' +
            'This is translatable.\n' +
            '\n' +
            '<message>\n' +
            'This is translatable.\n' +
            '</message>\n'
            );
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r699762575",
            source: "This is a test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse d'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r299977686",
            source: "This is translatable.",
            sourceLocale: "en-US",
            target: "Ceci est traduitable.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var expected =
            '<span class="foo" checked>\n' +
            'Ceci est un test du système d\'analyse d\'urgence.\n' +
            '</span>\n' +
            '\n' +
            'Ceci est traduitable.\n' +
            '\n' +
            '<message>\n' +
            'Ceci est traduitable.\n' +
            '</message>\n';
        var actual = mjf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeFlowStyleHTMLWithEmbeddedHTML", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '<span class="foo" checked>\n' +
            'This is a <b>test</b> of the emergency parsing system.\n' +
            '</span>\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>test</c0> du système d'analyse d'urgence.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var expected =
            '<span class="foo" checked>\n' +
            'Ceci est un <b>test</b> du système d\'analyse d\'urgence.\n' +
            '</span>\n';
        var actual = mjf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeFlowStyleHTMLWithEmbeddedMrkdwn", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '<span class="foo" checked>\n' +
            'This is a `test` of the _emergency parsing system_.\n' +
            '</span>\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r456781746",
            source: "This is a <c0/> of the <c1>emergency parsing system</c1>.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0/> du <c1>système d'analyse d'urgence</c1>.",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var expected =
            '<span class="foo" checked>\n' +
            'Ceci est un `test` du _système d\'analyse d\'urgence_.\n' +
            '</span>\n';
        var actual = mjf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeTextIgnoreFrontMatter", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '---\n' +
            'test: This is a test\n' +
            '---\n\n' +
            'This is a test\n\n' +
            'This is also a test\n\n' +
            'This is a test\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        // should ignore the front matter and leave it unlocalized
        var expected =
            '---\n' +
            'test: This is a test\n' +
            '---\n' +
            'Ceci est un essai\n\n' +
            'Ceci est aussi un essai\n\n' +
            'Ceci est un essai\n';
        var actual = mjf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeTextProcessFrontMatter", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p3,
            type: mdft3,
            pathName: "a/b/x/foo.md"
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '---\n' +
            'Title: This is a test of the front matter\n' +
            'Description: |\n' +
            '  another front matter description\n' +
            '  with extended text\n' +
            '---\n\n' +
            'This is a test\n\n' +
            'This is also a test\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r536069958.Title",
            source: "This is a test of the front matter",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai de la question en face",
            targetLocale: "fr-FR",
            datatype: "x-yaml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r536069958.Description",
            source: "another front matter description\nwith extended text\n",
            sourceLocale: "en-US",
            target: "aussi une description de la question en face\navec texte étendu\n",
            targetLocale: "fr-FR",
            datatype: "x-yaml"
        }));
        // should localize the front matter because the mapping includes Title and Description
        var expected =
            '---\n' +
            'Description: |\n' +
            '  aussi une description de la question en face\n' +
            '  avec texte étendu\n' +
            'Title: Ceci est aussi un essai de la question en face\n' +
            '---\n' +
            'Ceci est un essai\n\n' +
            'Ceci est aussi un essai\n';
        var actual = mjf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeTextProcessFrontMatterProcessNewStrings", function() {
        expect.assertions(12);
        var mjf = new MrkdwnJsonFile({
            project: p3,
            type: mdft3,
            pathName: "a/b/x/foo.md"
        });
        expect(mjf).toBeTruthy();
        mdft3.newres.clear();
        mjf.parse(
            '---\n' +
            'Title: This is a test of the front matter\n' +
            'Description: |\n' +
            '  another front matter description\n' +
            '  with extended text\n' +
            '---\n\n' +
            'This is a test\n\n' +
            'This is also a test\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r536069958.Title",
            source: "This is a test of the front matter",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai de la question en face",
            targetLocale: "fr-FR",
            datatype: "x-yaml"
        }));
        // should localize the front matter because the mapping includes Title and Description
        var expected =
            '---\n' +
            'Description: |\n' +
            '  another front matter description\n' +
            '  with extended text\n' +
            'Title: Ceci est aussi un essai de la question en face\n' +
            '---\n' +
            'Ceci est un essai\n\n' +
            'This is also a test\n';
        var actual = mjf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
        var newset = mdft3.getNew();
        expect(newset).toBeTruthy();
        var resources = newset.getAll();
        expect(resources.length).toBe(2);
        expect(resources[0].getKey()).toBe("r536069958.Description");
        expect(resources[0].getSource()).toBe("another front matter description\nwith extended text\n");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getPath()).toBe("a/b/x/foo.md");
        expect(resources[1].getKey()).toBe("r999080996");
        expect(resources[1].getSource()).toBe("This is also a test");
        expect(resources[1].getSourceLocale()).toBe("en-US");
        expect(resources[1].getPath()).toBe("a/b/x/foo.md");
    });

    test("MrkdwnJsonFileLocalizeTextProcessFrontMatterSkipUnknownFields", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p3,
            type: mdft3,
            pathName: "a/b/x/foo.md"
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '---\n' +
            'Title: This is a test of the front matter\n' +
            'Description: |\n' +
            '  another front matter description\n' +
            '  with extended text\n' +
            'Foobar: foo asdf asdf asdf\n' +
            '---\n\n' +
            'This is a test\n\n' +
            'This is also a test\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r536069958.Title",
            source: "This is a test of the front matter",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai de la question en face",
            targetLocale: "fr-FR",
            datatype: "x-yaml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r536069958.Description",
            source: "another front matter description\nwith extended text\n",
            sourceLocale: "en-US",
            target: "aussi une description de la question en face\navec texte étendu\n",
            targetLocale: "fr-FR",
            datatype: "x-yaml"
        }));
        // should ignore the front matter it doesn't recognize and leave it unlocalized
        var expected =
            '---\n' +
            'Description: |\n' +
            '  aussi une description de la question en face\n' +
            '  avec texte étendu\n' +
            'Foobar: foo asdf asdf asdf\n' +
            'Title: Ceci est aussi un essai de la question en face\n' +
            '---\n' +
            'Ceci est un essai\n\n' +
            'Ceci est aussi un essai\n';
        var actual = mjf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeTextProcessFrontMatterLocalizeAll", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p3,
            type: mdft3,
            pathName: "a/b/y/foo.md" // localizes all frontmatter fields
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '---\n' +
            'Title: This is a test of the front matter\n' +
            'Description: |\n' +
            '  another front matter description\n' +
            '  with extended text\n' +
            'Foobar: asdf asdf asdf\n' +
            '---\n\n' +
            'This is a test\n\n' +
            'This is also a test\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r77676802.Title",
            source: "This is a test of the front matter",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai de la question en face",
            targetLocale: "fr-FR",
            datatype: "x-yaml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r77676802.Description",
            source: "another front matter description\nwith extended text\n",
            sourceLocale: "en-US",
            target: "aussi une description de la question en face\navec texte étendu\n",
            targetLocale: "fr-FR",
            datatype: "x-yaml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r77676802.Foobar",
            source: "asdf asdf asdf",
            sourceLocale: "en-US",
            target: "fdsa fdsa fdsa",
            targetLocale: "fr-FR",
            datatype: "x-yaml"
        }));
        // should localize all the front matter
        var expected =
            '---\n' +
            'Description: |\n' +
            '  aussi une description de la question en face\n' +
            '  avec texte étendu\n' +
            'Foobar: fdsa fdsa fdsa\n' +
            'Title: Ceci est aussi un essai de la question en face\n' +
            '---\n' +
            'Ceci est un essai\n\n' +
            'Ceci est aussi un essai\n';
        var actual = mjf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileGetLocalizedPathSimple", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            pathName: "simple.md",
            type: mdft
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("fr-FR/simple.md");
    });

    test("MrkdwnJsonFileGetLocalizedPathComplex", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            pathName: "./asdf/bar/simple2.md",
            type: mdft
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.md");
    });

    test("MrkdwnJsonFileGetLocalizedPathRegularMrkdwnJsonFileName", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            pathName: "./asdf/bar/simple2.md",
            type: mdft
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.md");
    });

    test("MrkdwnJsonFileGetLocalizedPathNotEnoughParts", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            pathName: "./asdf/bar/simple",
            type: mdft
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple");
    });

    test("MrkdwnJsonFileGetLocalizedPathAlreadyHasSourceLocale", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p3,
            pathName: "./en-US/asdf/bar/simple2.md",
            type: mdft3
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.md");
    });

    test("MrkdwnJsonFileGetLocalizedPathSourceLocaleInMidPath", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p3,
            pathName: "./asdf/en-US/bar/simple3.md",
            type: mdft3
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("asdf/fr-FR/bar/simple3.md");
    });

    test("MrkdwnJsonFileGetLocalizedPathSourceLocaleInBeginningPath", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p3,
            pathName: "en-US/asdf/bar/simple2.md",
            type: mdft3
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.md");
    });

    test("MrkdwnJsonFileGetLocalizedPathSourceLocaleInMidPathOnlyWholeLocale", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p3,
            pathName: "./asdf/pen-USing/en-US/bar/asdf.md",
            type: mdft3
        });
        expect(mjf).toBeTruthy();
        // should leave "pen-USing" alone and only get the "en-US" path component
        expect(mjf.getLocalizedPath("fr-FR")).toBe("fr-FR/bar/asdf.md");
    });

    test("MrkdwnJsonFileGetLocalizedPathWithLocaleMap", function() {
        expect.assertions(3);
        var mjf = new MrkdwnJsonFile({
            project: p3,
            pathName: "simple4.md",
            type: mdft3
        });
        expect(mjf).toBeTruthy();
        expect(mjf.getLocalizedPath("fr-FR")).toBe("fr/asdf/bar/simple4.md");
        expect(mjf.getLocalizedPath("zh-Hans-CN")).toBe("zh-CN/asdf/bar/simple4.md");
    });

    test("MrkdwnJsonFileLocalizeFile", function() {
        expect.assertions(5);
        var base = path.dirname(module.id);
        var mjf = new MrkdwnJsonFile({
            project: p,
            pathName: "./md/test1.md",
            type: mdft
        });
        expect(mjf).toBeTruthy();
        // should read the file
        mjf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        mjf.localize(translations, ["fr-FR", "de-DE"]);
        expect(fs.existsSync(path.join(p.target, "fr-FR/md/test1.md"))).toBeTruthy();
        expect(fs.existsSync(path.join(p.target, "de-DE/md/test1.md"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p.target, "fr-FR/md/test1.md"), "utf-8");
        var expected =
            '# Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n' +
            '\n' +
            'Ceci est du texte. C\'est plus de texte. Joli, joli texte.\n\n' +
            'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n\n' +
            'C\'est le dernier morceau de texte localisable.\n' +
            '\n' +
            'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n';
        diff(content, expected);
        expect(content).toBe(expected);
        var content = fs.readFileSync(path.join(p.target, "de-DE/md/test1.md"), "utf-8");
        var expected =
            '# Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n' +
            '\n' +
            'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.\n\n' +
            'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n\n' +
            'Dies ist der letzte Teil des lokalisierbaren Textes.\n' +
            '\n' +
            'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n';
        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeFileWithFrontMatter", function() {
        expect.assertions(5);
        var base = path.dirname(module.id);
        var mjf = new MrkdwnJsonFile({
            project: p,
            pathName: "./md/test3.md",
            type: mdft
        });
        expect(mjf).toBeTruthy();
        // should read the file
        mjf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        mjf.localize(translations, ["fr-FR", "de-DE"]);
        expect(fs.existsSync(path.join(p.target, "fr-FR/md/test3.md"))).toBeTruthy();
        expect(fs.existsSync(path.join(p.target, "de-DE/md/test3.md"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p.target, "fr-FR/md/test3.md"), "utf-8");
        var expected =
            '---\n' +
            'title: This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n' +
            'status: this front matter should remain unlocalized\n' +
            '---\n' +
            '# Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n' +
            '\n' +
            'Ceci est du texte. C\'est plus de texte. Joli, joli texte.\n\n' +
            'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n\n' +
            'C\'est le dernier morceau de texte localisable.\n' +
            '\n' +
            'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n';
        diff(content, expected);
        expect(content).toBe(expected);
        var content = fs.readFileSync(path.join(p.target, "de-DE/md/test3.md"), "utf-8");
        var expected =
            '---\n' +
            'title: This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n' +
            'status: this front matter should remain unlocalized\n' +
            '---\n' +
            '# Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n' +
            '\n' +
            'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.\n\n' +
            'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n\n' +
            'Dies ist der letzte Teil des lokalisierbaren Textes.\n' +
            '\n' +
            'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n';
        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeFileWithFrontMatterNotFullyTranslated", function() {
        expect.assertions(5);
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mrkdwn: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MrkdwnJsonFileType(p2);
        var mjf = new MrkdwnJsonFile({
            project: p2,
            pathName: "./notrans2.md",
            type: mdft2
        });
        expect(mjf).toBeTruthy();
        // should read the file
        mjf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        mjf.localize(translations, ["fr-FR", "de-DE"]);
        expect(fs.existsSync(path.join(p2.target, "fr-FR/notrans2.md"))).toBeTruthy();
        expect(fs.existsSync(path.join(p2.target, "de-DE/notrans2.md"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p2.target, "fr-FR/notrans2.md"), "utf-8");
        var expected =
            '---\n' +
            'frontmatter: true\n' +
            'other: "asdf"\n' +
            '---\n' +
            '# This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n' +
            '\n' +
            'This is some text. This is more text. Pretty, pretty text.\n' +
            '\n' +
            'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n' +
            '\n' +
            'This is the last bit of localizable text.\n' +
            '\n' +
            'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n';
        diff(content, expected);
        expect(content).toBe(expected);
        var content = fs.readFileSync(path.join(p2.target, "de-DE/notrans2.md"), "utf-8");
        var expected =
            '---\n' +
            'frontmatter: true\n' +
            'other: "asdf"\n' +
            '---\n' +
            '# This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n' +
            '\n' +
            'This is some text. This is more text. Pretty, pretty text.\n' +
            '\n' +
            'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n' +
            '\n' +
            'This is the last bit of localizable text.\n' +
            '\n' +
            'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n';
        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeFileWithFrontMatterFullyTranslated", function() {
        expect.assertions(5);
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mrkdwn: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MrkdwnJsonFileType(p2);
        var mjf = new MrkdwnJsonFile({
            project: p2,
            pathName: "./notrans2.md",
            type: mdft2
        });
        expect(mjf).toBeTruthy();
        // should read the file
        mjf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        mjf.localize(translations, ["fr-FR", "de-DE"]);
        expect(fs.existsSync(path.join(p2.target, "fr-FR/notrans2.md"))).toBeTruthy();
        expect(fs.existsSync(path.join(p2.target, "de-DE/notrans2.md"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p2.target, "fr-FR/notrans2.md"), "utf-8");
        var expected =
            '---\n' +
            'frontmatter: true\n' +
            'other: "asdf"\n' +
            'fullyTranslated: true\n' +
            '---\n' +
            '# Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n' +
            '\n' +
            'Ceci est du texte. C\'est plus de texte. Joli, joli texte.\n\n' +
            'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n\n' +
            'C\'est le dernier morceau de texte localisable.\n' +
            '\n' +
            'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n';
        diff(content, expected);
        expect(content).toBe(expected);
        var content = fs.readFileSync(path.join(p2.target, "de-DE/notrans2.md"), "utf-8");
        var expected =
            '---\n' +
            'frontmatter: true\n' +
            'other: "asdf"\n' +
            'fullyTranslated: true\n' +
            '---\n' +
            '# Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n' +
            '\n' +
            'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.\n\n' +
            'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n\n' +
            'Dies ist der letzte Teil des lokalisierbaren Textes.\n' +
            '\n' +
            'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n';
        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeFileWithNoFrontMatterAlreadyFullyTranslated", function() {
        expect.assertions(5);
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mrkdwn: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MrkdwnJsonFileType(p2);
        var mjf = new MrkdwnJsonFile({
            project: p2,
            pathName: "./notrans.md",
            type: mdft2
        });
        expect(mjf).toBeTruthy();
        // should read the file
        mjf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        mjf.localize(translations, ["fr-FR", "de-DE"]);
        expect(fs.existsSync(path.join(p2.target, "fr-FR/notrans.md"))).toBeTruthy();
        expect(fs.existsSync(path.join(p2.target, "de-DE/notrans.md"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p2.target, "fr-FR/notrans.md"), "utf-8");
        var expected =
            '---\n' +
            'fullyTranslated: true\n' +
            '---\n' +
            '# Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n' +
            '\n' +
            'Ceci est du texte. C\'est plus de texte. Joli, joli texte.\n\n' +
            'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n\n' +
            'C\'est le dernier morceau de texte localisable.\n' +
            '\n' +
            'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n';
        diff(content, expected);
        expect(content).toBe(expected);
        var content = fs.readFileSync(path.join(p2.target, "de-DE/notrans.md"), "utf-8");
        var expected =
            '---\n' +
            'fullyTranslated: true\n' +
            '---\n' +
            '# Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n' +
            '\n' +
            'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.\n\n' +
            'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n\n' +
            'Dies ist der letzte Teil des lokalisierbaren Textes.\n' +
            '\n' +
            'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.\n';
        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeNoStrings", function() {
        expect.assertions(3);
        var base = path.dirname(module.id);
        var mjf = new MrkdwnJsonFile({
            project: p,
            pathName: "./md/nostrings.md",
            type: mdft
        });
        expect(mjf).toBeTruthy();
        // should read the file
        mjf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r308704783',
            source: 'Get insurance quotes for free!',
            target: 'Obtenez des devis d\'assurance gratuitement!',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r308704783',
            source: 'Get insurance quotes for free!',
            target: 'Kostenlosen Versicherungs-Angebote erhalten!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        mjf.localize(translations, ["fr-FR", "de-DE"]);
        // should produce the files, even if there is nothing to localize in them
        expect(fs.existsSync(path.join(p.target, "fr-FR/md/nostrings.md"))).toBeTruthy();
        expect(fs.existsSync(path.join(p.target, "de-DE/md/nostrings.md"))).toBeTruthy();
    });

    test("MrkdwnJsonFileExtractFileNewResources", function() {
        expect.assertions(16);
        var base = path.dirname(module.id);
        var t = new MrkdwnJsonFileType(p);
        var mjf = new MrkdwnJsonFile({
            project: p,
            pathName: "./md/mode.md",
            type: t
        });
        expect(mjf).toBeTruthy();
        mjf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r950833718",
            source: "Choose a meeting method",
            sourceLocale: "en-US",
            target: "Choisissez une méthode de réunion d'affaires",
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "fr-FR");
        var expected =
            '## Choisissez une méthode de réunion d\'affaires\n' +
            '\n' +
            '<img src="http://foo.com/photo.png" height="86px" width="86px">\n' +
            '\n' +
            '\\[Ťëšţ þĥŕàšë543210]\n' +
            '\n' +
            '## \\[Ïñ Pëŕšõñ Mõðë6543210]\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
        var set = t.newres;
        var resources = set.getAll();
        expect(resources.length).toBe(2);
        var r = set.getBySource("Choose a meeting method");
        expect(!r).toBeTruthy();
        r = set.getBySource("Test phrase");
        expect(r).toBeTruthy();
        expect(resources[0].getKey()).toBe("r103886803");
        expect(resources[0].getSource()).toBe("Test phrase");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getTarget()).toBe("Test phrase");
        expect(resources[0].getTargetLocale()).toBe("fr-FR");
        r = set.getBySource("In Person Mode");
        expect(r).toBeTruthy();
        expect(resources[1].getKey()).toBe("r251839517");
        expect(resources[1].getSource()).toBe("In Person Mode");
        expect(resources[1].getSourceLocale()).toBe("en-US");
        expect(resources[1].getTarget()).toBe("In Person Mode");
        expect(resources[1].getTargetLocale()).toBe("fr-FR");
    });

    test("MrkdwnJsonFileLocalizeTextHeaderWithNoSpace", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '#Bad Header\n' +
            '##Other Bad Header\n' +
            '# Bad Header\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r868915655',
            source: 'Bad Header',
            target: 'Entête mal',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r836504731',
            source: 'Other Bad Header',
            target: 'Autre entête mal',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        expect(mjf.localizeText(translations, "fr-FR")).toBe('# Entête mal\n\n' +
            '## Autre entête mal\n\n' +
            '# Entête mal\n');
    });

    test("MrkdwnJsonFileParseMultipleMDComponents", function() {
        expect.assertions(9);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'Integration samples include: \n' +
            '* **[File Workflow with Webhooks](/docs/file-workflow-with-webhooks)**: Creating file task automation with webhooks.\n');
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.getBySource("Integration samples include:");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Integration samples include:");
        expect(r.getKey()).toBe("r537538527");
        r = set.getBySource("<c0><c1>File Workflow with Webhooks</c1></c0>: Creating file task automation with webhooks.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("<c0><c1>File Workflow with Webhooks</c1></c0>: Creating file task automation with webhooks.");
        expect(r.getKey()).toBe("r663481768");
    });

    test("MrkdwnJsonFileParseWithLinkReferenceWithText", function() {
        expect.assertions(6);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '- [Ask on Twitter][twitter]: For general questions and support.\n' +
            '\n' +
            '[twitter]: https://twitter.com/OurPlatform\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);
        expect(resources[0].getSource()).toBe("For developer support, please reach out to us via one of our channels:");
        expect(resources[1].getSource()).toBe("<c0>Ask on Twitter</c0>: For general questions and support.");
    });

    test("MrkdwnJsonFileParseWithLinkReferenceToExtractedURL", function() {
        expect.assertions(8);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '- [Ask on Twitter][twitter]: For general questions and support.\n' +
            '- [Ask on Facebook][facebook]: For general questions and support.\n' +
            '\n' +
            '<!-- i18n-enable localize-links -->\n' +
            '[twitter]: https://twitter.com/OurPlatform\n' +
            '[facebook]: http://www.facebook.com/OurPlatform\n' +
            '<!-- i18n-disable localize-links -->'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(4);
        var resources = set.getAll();
        expect(resources.length).toBe(4);
        expect(resources[0].getSource()).toBe("<c0>Ask on Twitter</c0>: For general questions and support.");
        expect(resources[1].getSource()).toBe("<c0>Ask on Facebook</c0>: For general questions and support.");
        expect(resources[2].getSource()).toBe("https://twitter.com/OurPlatform");
        expect(resources[3].getSource()).toBe("http://www.facebook.com/OurPlatform");
    });

    test("MrkdwnJsonFileParseWithLinkReferenceWithLinkTitle", function() {
        expect.assertions(7);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'Regular service will be [available][exception].\n' +
            '\n' +
            '<!-- i18n-enable localize-links -->\n' +
            '[exception]: http://a.com/ "link title"\n' +
            '<!-- i18n-disable localize-links -->'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var resources = set.getAll();
        expect(resources.length).toBe(3);
        expect(resources[0].getSource()).toBe("Regular service will be <c0>available</c0>.");
        expect(resources[1].getSource()).toBe("http://a.com/");
        expect(resources[2].getSource()).toBe("link title");
    });

    test("MrkdwnJsonFileParseWithLinkReferenceToExtractedURLNotAfterTurnedOff", function() {
        expect.assertions(7);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            '- [Ask on Twitter][twitter]: For general questions and support.\n' +
            '- [Ask on Facebook][facebook]: For general questions and support.\n' +
            '\n' +
            '<!-- i18n-enable localize-links -->\n' +
            '[twitter]: https://twitter.com/OurPlatform\n' +
            '<!-- i18n-disable localize-links -->' +
            '[facebook]: http://www.facebook.com/OurPlatform\n'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var resources = set.getAll();
        expect(resources.length).toBe(3);
        expect(resources[0].getSource()).toBe("<c0>Ask on Twitter</c0>: For general questions and support.");
        expect(resources[1].getSource()).toBe("<c0>Ask on Facebook</c0>: For general questions and support.");
        expect(resources[2].getSource()).toBe("https://twitter.com/OurPlatform");
    });

    test("MrkdwnJsonFileParseWithMultipleLinkReferenceWithText", function() {
        expect.assertions(8);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '- [Ask on Twitter][twitter]: For general questions and support.\n' +
            '- [Ask in email][email]: For specific questions and support.\n' +
            '- [Ask on stack overflow][so]: For community answers and support.\n' +
            '\n' +
            '[twitter]: https://twitter.com/OurPlatform\n' +
            '[email]: mailto:support@ourplatform\n' +
            '[so]: http://ourplatform.stackoverflow.com/'
        );
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(4);
        var resources = set.getAll();
        expect(resources.length).toBe(4);
        expect(resources[0].getSource()).toBe("For developer support, please reach out to us via one of our channels:");
        expect(resources[1].getSource()).toBe("<c0>Ask on Twitter</c0>: For general questions and support.");
        expect(resources[2].getSource()).toBe("<c0>Ask in email</c0>: For specific questions and support.");
        expect(resources[3].getSource()).toBe("<c0>Ask on stack overflow</c0>: For community answers and support.");
    });

    test("MrkdwnJsonFileLocalizeReferenceLinksWithLinkId", function() {
        expect.assertions(3);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '- [Ask on Twitter][twitter]: For general questions and support.\n' +
            '\n' +
            '[twitter]: https://twitter.com/OurPlatform\n'
        );
        expect(mjf).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r816306377',
            source: 'For developer support, please reach out to us via one of our channels:',
            target: 'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r293599939',
            source: '<c0>Ask on Twitter</c0>: For general questions and support.',
            target: '<c0>Auf Twitter stellen</c0>: Für allgemeine Fragen und Unterstützung.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "de-DE");
        var expected =
            'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:\n' +
            '\n' +
            '* [Auf Twitter stellen][twitter]: Für allgemeine Fragen und Unterstützung.\n' +
            '\n' +
            '[twitter]: https://twitter.com/OurPlatform\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeReferenceLinksWithoutLinkId", function() {
        expect.assertions(3);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '- [Ask on Twitter] For general questions and support.\n' +
            '\n' +
            '[Ask on Twitter]: https://twitter.com/OurPlatform\n'
        );
        expect(mjf).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r816306377',
            source: 'For developer support, please reach out to us via one of our channels:',
            target: 'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1030328207',
            source: '<c0>Ask on Twitter</c0> For general questions and support.',
            target: '<c0>Auf Twitter stellen</c0> für allgemeine Fragen und Unterstützung.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "de-DE");
        // DON'T localize the label. Instead, add a title that is translated
        var expected =
            'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:\n' +
            '\n' +
            '* [Auf Twitter stellen][Ask on Twitter] für allgemeine Fragen und Unterstützung.\n' +
            '\n' +
            '[Ask on Twitter]: https://twitter.com/OurPlatform\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeReferenceLinksWithLinkTitle", function() {
        expect.assertions(3);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '- [Ask on Twitter][twitter] For general questions and support.\n' +
            '\n' +
            '<!-- i18n-enable localize-links -->\n' +
            '[twitter]: https://twitter.com/OurPlatform "Our Platform"\n' +
            '<!-- i18n-disable localize-links -->\n'
        );
        expect(mjf).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r816306377',
            source: 'For developer support, please reach out to us via one of our channels:',
            target: 'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1030328207',
            source: '<c0>Ask on Twitter</c0> For general questions and support.',
            target: '<c0>Auf Twitter stellen</c0> für allgemeine Fragen und Unterstützung.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r85880207',
            source: 'https://twitter.com/OurPlatform',
            target: 'https://de.twitter.com/OurPlatform',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r504251007',
            source: 'Our Platform',
            target: 'Unsere Platformen',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "de-DE");
        var expected =
            'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:\n' +
            '\n' +
            '* [Auf Twitter stellen][twitter] für allgemeine Fragen und Unterstützung.\n' +
            '\n' +
            '<!-- i18n-enable localize-links -->\n\n' +
            '[twitter]: https://de.twitter.com/OurPlatform "Unsere Platformen"\n\n' +
            '<!-- i18n-disable localize-links -->\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeDirectLinksTurnedOff", function() {
        expect.assertions(3);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '<!-- i18n-disable localize-links -->\n' +
            '\n' +
            '- [Ask on Twitter](https://twitter.com/OurPlatform) for general questions and support.\n'
        );
        expect(mjf).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r816306377',
            source: 'For developer support, please reach out to us via one of our channels:',
            target: 'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r629827996',
            source: '<c0>Ask on Twitter</c0> for general questions and support.',
            target: '<c0>Auf Twitter stellen</c0> für allgemeine Fragen und Unterstützung.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r85880207',
            source: 'https://twitter.com/OurPlatform',
            target: 'https://de.twitter.com/OurPlatform',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "de-DE");
        var expected =
            'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:\n' +
            '\n' +
            '<!-- i18n-disable localize-links -->\n' +
            '\n' +
            '* [Auf Twitter stellen](https://twitter.com/OurPlatform) für allgemeine Fragen und Unterstützung.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeDirectLinksTurnedOn", function() {
        expect.assertions(3);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '<!-- i18n-enable localize-links -->\n' +
            '\n' +
            '- [Ask on Twitter](https://twitter.com/OurPlatform) for general questions and support.\n' +
            '\n' +
            '<!-- i18n-disable localize-links -->\n'
        );
        expect(mjf).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r816306377',
            source: 'For developer support, please reach out to us via one of our channels:',
            target: 'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r629827996',
            source: '<c0>Ask on Twitter</c0> for general questions and support.',
            target: '<c0>Auf Twitter stellen</c0> für allgemeine Fragen und Unterstützung.',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r85880207',
            source: 'https://twitter.com/OurPlatform',
            target: 'https://de.twitter.com/OurPlatform',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "de-DE");
        var expected =
            'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:\n' +
            '\n' +
            '<!-- i18n-enable localize-links -->\n' +
            '\n' +
            '* [Auf Twitter stellen](https://de.twitter.com/OurPlatform) für allgemeine Fragen und Unterstützung.\n' +
            '\n' +
            '<!-- i18n-disable localize-links -->\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileParseHTMLComments", function() {
        expect.assertions(5);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a <!-- comment -->test of the emergency parsing system.\n');
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
    });

    test("MrkdwnJsonFileParseHTMLCommentsWithIndent", function() {
        expect.assertions(8);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a test of the emergency parsing system.\n  <!-- comment -->\nA second string\n');
        var set = mjf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
        var r = set.getBySource("A second string");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("A second string");
        expect(r.getKey()).toBe("r772298159");
    });

    test("MrkdwnJsonFileLocalizeHTMLCommentsWithIndent", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse('This is a test of the emergency parsing system.\n  <!-- comment -->\nA second string\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r699762575',
            source: 'This is a test of the emergency parsing system.',
            target: 'This is a test of the emergency parsing system... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r772298159',
            source: 'A second string',
            target: 'A second string... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "de-DE");
        var expected =
            'This is a test of the emergency parsing system... in GERMAN!\n\n  <!-- comment -->\n\nA second string... in GERMAN!\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeTable", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            "|                   |                 |\n" +
            "|-------------------|-----------------|\n" +
            "| Query description | Returns column  |\n" +
            "| foo               | bar             |\n");
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r744039504',
            source: 'Query description',
            target: 'Query description... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r595024848',
            source: 'Returns column',
            target: 'Returns column... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r941132140',
            source: 'foo',
            target: 'foo... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r755240053',
            source: 'bar',
            target: 'bar... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "de-DE");
        var expected =
            "|                                 |                              |\n" +
            "| ------------------------------- | ---------------------------- |\n" +
            "| Query description... in GERMAN! | Returns column... in GERMAN! |\n" +
            "| foo... in GERMAN!               | bar... in GERMAN!            |\n";
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeTableWithInlineCode", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            "|                   |                 |\n" +
            "|-------------------|-----------------|\n" +
            "| Query description | Returns column  |\n" +
            "| `code`            | `more code`     |\n" +
            "| foo               | bar             |\n");
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r744039504',
            source: 'Query description',
            target: 'Query description... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r595024848',
            source: 'Returns column',
            target: 'Returns column... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r941132140',
            source: 'foo',
            target: 'foo... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r755240053',
            source: 'bar',
            target: 'bar... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "de-DE");
        var expected =
            "|                                 |                              |\n" +
            "| ------------------------------- | ---------------------------- |\n" +
            "| Query description... in GERMAN! | Returns column... in GERMAN! |\n" +
            "| `code`                          | `more code`                  |\n" +
            "| foo... in GERMAN!               | bar... in GERMAN!            |\n";
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeTableWithInlineCodeAndTextAfter", function() {
        expect.assertions(2);
        var mjf = new MrkdwnJsonFile({
            project: p,
            type: mdft
        });
        expect(mjf).toBeTruthy();
        mjf.parse(
            "|                   |                 |\n" +
            "|-------------------|-----------------|\n" +
            "| Query description | Returns column  |\n" +
            "| `code`            | `more code`     |\n" +
            "\n" +
            "## Header Title\n" +
            "\n" +
            "Body text.\n");
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r744039504',
            source: 'Query description',
            target: 'Query description... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r595024848',
            source: 'Returns column',
            target: 'Returns column... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1037333769',
            source: 'Header Title',
            target: 'Header Title... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r521829558',
            source: 'Body text.',
            target: 'Body text... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mrkdwn"
        }));
        var actual = mjf.localizeText(translations, "de-DE");
        var expected =
            "|                                 |                              |\n" +
            "| ------------------------------- | ---------------------------- |\n" +
            "| Query description... in GERMAN! | Returns column... in GERMAN! |\n" +
            "| `code`                          | `more code`                  |\n" +
            "\n" +
            "## Header Title... in GERMAN!\n" +
            "\n" +
            "Body text... in GERMAN!\n";
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeFileFullyTranslatedFlag", function() {
        expect.assertions(3);
        // this subproject has the "fullyTranslated" flag set to true
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mrkdwn: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MrkdwnJsonFileType(p2);
        var mjf = new MrkdwnJsonFile({
            project: p2,
            pathName: "./notrans.md",
            type: mdft2
        });
        expect(mjf).toBeTruthy();
        // should read the file
        mjf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        mjf.localize(translations, ["fr-FR"]);
        expect(fs.existsSync(path.join(p2.target, "fr-FR/notrans.md"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p2.target, "fr-FR/notrans.md"), "utf-8");
        var expected =
            '---\n' +
            'fullyTranslated: true\n' +
            '---\n' +
            '# Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n' +
            '\n' +
            'Ceci est du texte. C\'est plus de texte. Joli, joli texte.\n\n' +
            'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n\n' +
            'C\'est le dernier morceau de texte localisable.\n\n' +
            'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n';
        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeFileFullyTranslatedFlagNoTranslations", function() {
        expect.assertions(3);
        // this subproject has the "fullyTranslated" flag set to true
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mrkdwn: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MrkdwnJsonFileType(p2);
        var mjf = new MrkdwnJsonFile({
            project: p2,
            pathName: "./notrans.md",
            type: mdft2
        });
        expect(mjf).toBeTruthy();
        // should read the file
        mjf.extract();
        var translations = new TranslationSet();
        mjf.localize(translations, ["fr-FR"]);
        expect(fs.existsSync(path.join(p2.target, "fr-FR/notrans.md"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p2.target, "fr-FR/notrans.md"), "utf-8");
        // should not be translated because we didn't have translations for any strings
        var expected =
            '# This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n\n' +
            'This is some text. This is more text. Pretty, pretty text.\n\n' +
            'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n\n' +
            'This is the last bit of localizable text.\n\n' +
            'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n';
        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("MrkdwnJsonFileLocalizeFileFullyTranslatedFlagNotFullyTranslated", function() {
        expect.assertions(3);
        // this subproject has the "fullyTranslated" flag set to true
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mrkdwn: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MrkdwnJsonFileType(p2);
        var mjf = new MrkdwnJsonFile({
            project: p2,
            pathName: "./notrans.md",
            type: mdft2
        });
        expect(mjf).toBeTruthy();
        // should read the file
        mjf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "mrkdwn"
        }));
        mjf.localize(translations, ["fr-FR"]);
        expect(fs.existsSync(path.join(p2.target, "fr-FR/notrans.md"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p2.target, "fr-FR/notrans.md"), "utf-8");
        // should not be translated because we didn't have translations for all strings
        var expected =
            '# This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n\n' +
            'This is some text. This is more text. Pretty, pretty text.\n\n' +
            'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n\n' +
            'This is the last bit of localizable text.\n\n' +
            'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n';
        diff(content, expected);
        expect(content).toBe(expected);
    });
    */
});
