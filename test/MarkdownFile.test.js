/*
 * MarkdownFile.test.js - test the Markdown file handler object.
 *
 * Copyright © 2019-2023 Box, Inc.
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

if (!MarkdownFile) {
    var MarkdownFile = require("../MarkdownFile.js");
    var MarkdownFileType = require("../MarkdownFileType.js");
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

var mdft = new MarkdownFileType(p);
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

var mdft2 = new MarkdownFileType(p2);
var p3 = new CustomProject({
    sourceLocale: "en-US",
    id: "foo",
    name: "foo",
    plugins: ["../."]
}, "./test/testfiles", {
    locales:["en-GB"],
    targetDir: "./test/testfiles",
    nopseudo: true,
    markdown: {
        mappings: {
            "**/simple.md": {
                template: "[locale]/[dir]/[filename]"
            },
            "**/asdf/bar/simple2.md": {
                template: "[locale]/asdf/bar/[filename]"
            },
            "**/bar/simple3.md": {
                template: "asdf/[locale]/bar/[filename]"
            },
            "**/simple4.md": {
                template: "[locale]/asdf/bar/[filename]",
                localeMap: {
                    "fr-FR": "fr",
                    "zh-Hans-CN": "zh-CN"
                }
            },
            "asdf/pen-USing/en-US/bar/asdf.md": {
                template: "[locale]/bar/[filename]"
            },
            "**/asdf.md": {
                template: "[dir]/[locale]/bar/[filename]",
                frontmatter: ["test"]
            },
            "**/x/*.md": {
                template: "[dir]/[base]_[locale].md",
                frontmatter: ["Title", "Description"]
            },
            "**/y/*.md": {
                template: "[dir]/[locale]/[base].md",
                frontmatter: true
            }
        }
    }
});

var mdft3 = new MarkdownFileType(p3);

describe("markdown", function() {
    test("MarkdownFileConstructor", function() {
        expect.assertions(1);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
    });

    test("MarkdownFileConstructorParams", function() {
        expect.assertions(1);
        var mf = new MarkdownFile({
            project: p,
            pathName: "./testfiles/md/test1.md",
            type: mdft
        });
        expect(mf).toBeTruthy();
    });

    test("MarkdownFileConstructorNoFile", function() {
        expect.assertions(1);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
    });

    test("MarkdownFileMakeKey", function() {
        expect.assertions(2);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("This is a test")).toBe("r654479252");
    });

    test("MarkdownFileMakeKeySimpleTexts1", function() {
        expect.assertions(5);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("Preferences in your profile")).toBe("r372802078");
        expect(mdf.makeKey("All settings")).toBe("r725930887");
        expect(mdf.makeKey("Colour scheme")).toBe("r734599412");
        expect(mdf.makeKey("Experts")).toBe("r343852585");
    });

    test("MarkdownFileMakeKeyUnescaped", function() {
        expect.assertions(5);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("foo \\n \\t bar")).toBe("r206710698");
        expect(mdf.makeKey("\\n \\t bar")).toBe("r601615571");
        expect(mdf.makeKey("The \\'Dude\\' played by Jeff Bridges")).toBe("r600298088");
        expect(mdf.makeKey("\\'Dude\\'")).toBe("r6259609");
    });

    test("MarkdownFileMakeKeySimpleTexts2", function() {
        expect.assertions(6);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("Procedures")).toBe("r807691021");
        expect(mdf.makeKey("Mobile Apps")).toBe("r898923204");
        expect(mdf.makeKey("Settings in your profile")).toBe("r618035987");
        expect(mdf.makeKey("Product Reviews")).toBe("r175350918");
        expect(mdf.makeKey("Answers")).toBe("r221604632");
    });

    test("MarkdownFileMakeKeySimpleTexts3", function() {
        expect.assertions(9);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("Private Profile")).toBe("r314592735");
        expect(mdf.makeKey("People you are connected to")).toBe("r711926199");
        expect(mdf.makeKey("Notifications")).toBe("r284964820");
        expect(mdf.makeKey("News")).toBe("r613036745");
        expect(mdf.makeKey("More Tips")).toBe("r216617786");
        expect(mdf.makeKey("Filters")).toBe("r81370429");
        expect(mdf.makeKey("Referral Link")).toBe("r140625167");
        expect(mdf.makeKey("Questions")).toBe("r256277957");
    });

    test("MarkdownFileMakeKeyEscapes", function() {
        expect.assertions(3);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("Can\'t find id")).toBe("r743945592");
        expect(mdf.makeKey("Can\'t find an application for SMS")).toBe("r909283218");
    });

    test("MarkdownFileMakeKeyPunctuation", function() {
        expect.assertions(8);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("{name}({generic_name})")).toBe("r300446104");
        expect(mdf.makeKey("{name}, {sharer_name} {start}found this interesting{end}")).toBe("r8321889");
        expect(mdf.makeKey("{sharer_name} {start}found this interesting{end}")).toBe("r639868344");
        expect(mdf.makeKey("Grow your Network")).toBe("r895214324");
        expect(mdf.makeKey("Failed to send connection request!")).toBe("r1015770123");
        expect(mdf.makeKey("{goal_name} Goals")).toBe("r993422001");
        expect(mdf.makeKey("Connection link copied!")).toBe("r180897411");
    });

    test("MarkdownFileMakeKeySameStringMeansSameKey", function() {
        expect.assertions(3);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("This is a test")).toBe("r654479252");
        expect(mdf.makeKey("This is a test")).toBe("r654479252");
    });

    test("MarkdownFileMakeKeyCompressWhiteSpace", function() {
        expect.assertions(5);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("Can\'t find  id")).toBe("r743945592");
        expect(mdf.makeKey("Can\'t    find               id")).toBe("r743945592");
        expect(mdf.makeKey("Can\'t find an application for SMS")).toBe("r909283218");
        expect(mdf.makeKey("Can\'t   \t\n \t   find an    \t \n \r   application for SMS")).toBe("r909283218");
    });

    test("MarkdownFileMakeKeyTrimWhiteSpace", function() {
        expect.assertions(5);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("Can\'t find  id")).toBe("r743945592");
        expect(mdf.makeKey("      Can\'t find  id ")).toBe("r743945592");
        expect(mdf.makeKey("Can\'t find an application for SMS")).toBe("r909283218");
        expect(mdf.makeKey(" \t\t\n\r    Can\'t find an application for SMS   \n \t \r")).toBe("r909283218");
    });

    test("MarkdownFileMakeKeyNewLines", function() {
        expect.assertions(2);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        expect(mdf.makeKey("A \n B")).toBe("r191336864");
    });

    test("MarkdownFileMakeKeyEscapeN", function() {
        expect.assertions(2);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        // \n is not a return character in MD. It is just an escaped "n"
        expect(mdf.makeKey("A \\n B")).toBe("r968833504");
    });

    test("MarkdownFileMakeKeyTabs", function() {
        expect.assertions(2);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("A \t B")).toBe("r191336864");
    });

    test("MarkdownFileMakeKeyEscapeT", function() {
        expect.assertions(2);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        // \t is not a tab character in MD. It is just an escaped "t"
        expect(mdf.makeKey("A \\t B")).toBe("r215504705");
    });

    test("MarkdownFileMakeKeyQuotes", function() {
        expect.assertions(2);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("A \\'B\\' C")).toBe("r935639115");
    });

    test("MarkdownFileMakeKeyInterpretEscapedUnicodeChars", function() {
        expect.assertions(2);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("&#x00A0; &#x0023;")).toBe("r2293235");
    });

    test("MarkdownFileMakeKeyInterpretEscapedSpecialChars2", function() {
        expect.assertions(2);
        var mdf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("Talk to a support representative live 24/7 via video or &#x00a0; text&#x00a0;chat")).toBe("r969175354");
    });

    test("MarkdownFileParseSimpleGetByKey", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test\n\nThis is a test too\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ResourceString.hashKey("foo", "en-US", "r654479252", "markdown"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("MarkdownFileParseSimpleGetBySource", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test\n\nThis is a test too\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("MarkdownFileParseSimpleIgnoreWhitespace", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test            \t   \t     \n\nThis is a test too\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("MarkdownFileParseDontExtractUnicodeWhitespace", function() {
        expect.assertions(3);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // contains U+00A0 non-breaking space and other Unicode space characters
        mf.parse('            ​‌‍ \n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });

    test("MarkdownFileParseDontExtractNbspEntity", function() {
        expect.assertions(3);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('&nbsp; &#xA0; \n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });

    test("MarkdownFileParseDoExtractOtherEntities", function() {
        expect.assertions(3);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('&uuml;\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
    });

    test("MarkdownFileParseEmpty", function() {
        expect.assertions(3);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(' \n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });

    test("MarkdownFileParseSkipHeader", function() {
        expect.assertions(3);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('---\ntitle: "foo"\nexcerpt: ""\n---\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });

    test("MarkdownFileParseSkipHeaderAndParseRest", function() {
        expect.assertions(6);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('---\ntitle: "foo"\nexcerpt: ""\n---\n\nThis is a test\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("MarkdownFileParseNoStrings", function() {
        expect.assertions(3);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('\n     \n\t\t\t\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });

    test("MarkdownFileParseSimpleRightSize", function() {
        expect.assertions(4);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        var set = mf.getTranslationSet();
        expect(set.size()).toBe(0);
        mf.parse('This is a test\n\n');
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
    });

    test("MarkdownFileParseMultiple", function() {
        expect.assertions(8);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test\n\n' +
                  'This is also a test\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("r999080996");
    });

    test("MarkdownFileParseContinuedParagraph", function() {
        expect.assertions(7);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test.\n' +
                  'This is also a test.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test.\nThis is also a test.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test.\nThis is also a test.");
        expect(r.getKey()).toBe("r770271164");
        r = set.getBySource("This is a test.");
        expect(!r).toBeTruthy();
        r = set.getBySource("This is also a test.");
        expect(!r).toBeTruthy();
    });

    test("MarkdownFileParseWithDups", function() {
        expect.assertions(6);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test\n\n' +
                  'This is also a test\n\n' +
                  'This is a test\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
        expect(set.size()).toBe(2);
    });

    test("MarkdownFileParseEscapeInvalidChars", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is also a &#x3; test\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // should use html entities to represent the invalid control chars
        var r = set.getBySource("This is also a &#3; test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a &#3; test");
        expect(r.getKey()).toBe("r1041204778");
    });

    test("MarkdownFileParseDontEscapeWhitespaceChars", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is also a &#x000C; test\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // leave the whitespace control chars alone
        var r = set.getBySource("This is also a \u000C test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a \u000C test");
        expect(r.getKey()).toBe("r999080996");
    });

    test("MarkdownFileParseNonBreakingEmphasis", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a *test* of the emergency parsing system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r.getKey()).toBe("r306365966");
    });

    test("MarkdownFileParseNestedNonBreakingEmphasis", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This _is a *test* of the emergency parsing_ system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This <c0>is a <c1>test</c1> of the emergency parsing</c0> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This <c0>is a <c1>test</c1> of the emergency parsing</c0> system.");
        expect(r.getKey()).toBe("r96403243");
    });

    test("MarkdownFileParseNestedAndSequentialNonBreakingEmphasis", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This _is a *test* of the_ *emergency parsing* system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This <c0>is a <c1>test</c1> of the</c0> <c2>emergency parsing</c2> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This <c0>is a <c1>test</c1> of the</c0> <c2>emergency parsing</c2> system.");
        expect(r.getKey()).toBe("r456647808");
    });

    test("MarkdownFileParseNonBreakingLinks", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the [emergency parsing](http://foo.com/bar/asdf.html) system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0>emergency parsing</c0> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0>emergency parsing</c0> system.");
        expect(r.getKey()).toBe("r848003676");
    });

    test("MarkdownFileParseReferenceLinksWithTitle", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the [emergency parsing][emer_sys] system.\n\n' +
            '[emer_sys]: http://www.test.com/\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0>emergency parsing</c0> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0>emergency parsing</c0> system.");
        expect(r.getKey()).toBe("r848003676");
    });

    test("MarkdownFileParseReferenceLinksWithoutTitle", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the [emergency parsing] system.\n\n' +
            '[emergency parsing]: http://www.test.com/\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0>emergency parsing</c0> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0>emergency parsing</c0> system.");
        expect(r.getKey()).toBe("r848003676");
    });

    test("MarkdownFileParseDontExtractURLOnlyLinks", function() {
        expect.assertions(7);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'Here are some links:\n\n' +
            '* [http://www.box.com/foobar](http://www.box.com/foobar)\n' +
            '* [http://www.box.com/asdf](http://www.box.com/asdf)\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getBySource("Here are some links:");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Here are some links:");
        expect(r.getKey()).toBe("r539503678");
        // the URLs should not be extracted if they are the only thing in the string
        r = set.getBySource("http://www.box.com/foobar");
        expect(!r).toBeTruthy();
    });

    test("MarkdownFileParseTurnOnURLOnlyLinks", function() {
        expect.assertions(12);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'Here are some links:\n\n' +
            '<!-- i18n-enable localize-links -->\n' +
            '* [http://www.box.com/foobar](http://www.box.com/foobar)\n' +
            '* [http://www.box.com/asdf](http://www.box.com/asdf)\n' +
            '<!-- i18n-disable localize-links -->\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var r = set.getBySource("Here are some links:");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Here are some links:");
        expect(r.getKey()).toBe("r539503678");
        // the URLs should be extracted because we turned on link localization
        r = set.getBySource("http://www.box.com/foobar");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("http://www.box.com/foobar");
        expect(r.getKey()).toBe("r803907207");
        r = set.getBySource("http://www.box.com/asdf");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("http://www.box.com/asdf");
        expect(r.getKey()).toBe("r247450278");
    });

    test("MarkdownFileParseTurnOnDirectLinks", function() {
        expect.assertions(18);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'Here are some links:\n\n' +
            '<!-- i18n-enable localize-links -->\n' +
            '* This is [foobar](http://www.box.com/foobar)\n' +
            '* And here is [asdf](http://www.box.com/asdf)\n' +
            '<!-- i18n-disable localize-links -->\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(5);
        var r = set.getBySource("Here are some links:");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Here are some links:");
        expect(r.getKey()).toBe("r539503678");
        // the URLs should be extracted because we turned on link localization
        r = set.getBySource("This is <c0>foobar</c0>");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is <c0>foobar</c0>");
        expect(r.getKey()).toBe("r924705194");
        r = set.getBySource("And here is <c0>asdf</c0>");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("And here is <c0>asdf</c0>");
        expect(r.getKey()).toBe("r655195000");
        r = set.getBySource("http://www.box.com/foobar");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("http://www.box.com/foobar");
        expect(r.getKey()).toBe("r803907207");
        r = set.getBySource("http://www.box.com/asdf");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("http://www.box.com/asdf");
        expect(r.getKey()).toBe("r247450278");
    });

    test("MarkdownFileParseDoExtractURLLinksMidString", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency parsing [http://www.box.com/foobar](http://www.box.com/foobar) system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the emergency parsing <c0>http://www.box.com/foobar</c0> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing <c0>http://www.box.com/foobar</c0> system.");
        expect(r.getKey()).toBe("r598935364");
    });

    test("MarkdownFileParseReferences", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency parsing [C1] system.\n\n' +
                '[C1]: http://www.box.com/foobar\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the emergency parsing <c0>C1</c0> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing <c0>C1</c0> system.");
        expect(r.getKey()).toBe("r475244008");
    });

    test("MarkdownFileParseFootnotes", function() {
        expect.assertions(8);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency parsing [^1] system.\n\n' +
                '[^1]: well, not really\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the emergency parsing <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing <c0/> system.");
        expect(r.getKey()).toBe("r1010312382");
        var r = set.getBySource("well, not really");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("well, not really");
        expect(r.getKey()).toBe("r472274968");
    });

    test("MarkdownFileParseFootnotesLongname", function() {
        expect.assertions(8);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency parsing [^longname] system.\n\n' +
                '[^longname]: well, not really\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the emergency parsing <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing <c0/> system.");
        expect(r.getKey()).toBe("r1010312382");
        var r = set.getBySource("well, not really");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("well, not really");
        expect(r.getKey()).toBe("r472274968");
    });

    test("MarkdownFileParseNonBreakingInlineCode", function() {
        expect.assertions(6);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the `inline code` system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0/> system.");
        expect(r.getComment()).toBe("c0 will be replaced with the inline code `inline code`.");
        expect(r.getKey()).toBe("r405516144");
    });

    test("MarkdownFileParseMultipleNonBreakingInlineCodes", function() {
        expect.assertions(6);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a `test` of the `inline code` system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a <c0/> of the <c1/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a <c0/> of the <c1/> system.");
        expect(r.getComment()).toBe("c0 will be replaced with the inline code `test`. c1 will be replaced with the inline code `inline code`.");
        expect(r.getKey()).toBe("r960448365");
    });

    test("MarkdownFileParseInlineCodeByItself", function() {
        expect.assertions(9);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'This is a test of the inline code system.\n' +
            '\n' +
            '`inline code`\n' +
            '\n' +
            'Sentence after.');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        // should not extract the inline code by itself
        var r = set.getBySource("This is a test of the inline code system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the inline code system.");
        expect(r.getKey()).toBe("r41637229");
        r = set.getBySource("Sentence after.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Sentence after.");
        expect(r.getKey()).toBe("r16227039");
    });

    test("MarkdownFileParseNonBreakingHTMLTags", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a <em>test</em> of the emergency parsing system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a <c0>test</c0> of the emergency parsing system.");
        expect(r.getKey()).toBe("r306365966");
    });

    test("MarkdownFileParseNonBreakingHTMLTagsOutside", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('<em>This is a test of the emergency parsing system.</em>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // should not pick up the emphasis marker because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
    });

    test("MarkdownFileParseNonBreakingSelfClosingHTMLTags", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('<em>This is a test of the <br> emergency parsing system.</em>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // should not pick up the emphasis marker because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the <c0/> emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0/> emergency parsing system.");
        expect(r.getKey()).toBe("r1070934855");
    });

    test("MarkdownFileParseBreakingSelfClosedHTMLTags", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('<em>This is a test of the <p/> emergency parsing system.</em>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // should not pick up the emphasis marker because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the");
        expect(r.getKey()).toBe("r593084440");
    });

    test("MarkdownFileParseBreakingNotClosedHTMLTags", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('<em>This is a test of the <p> emergency parsing system.</em>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // should not pick up the emphasis marker because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the");
        expect(r.getKey()).toBe("r593084440");
    });

    test("MarkdownFileParseNonBreakingSelfClosedHTMLTags", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('<em>This is a test of the <br/> emergency parsing system.</em>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // should not pick up the emphasis marker because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the <c0/> emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the <c0/> emergency parsing system.");
        expect(r.getKey()).toBe("r1070934855");
    });

    test("MarkdownFileParseNonBreakingIgnoreComplexIrrelevant", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('*_ <span class="test"> <span id="foo"></span></span>  This is a test of the emergency parsing system.   _*\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // should not pick up any of the non-breaking tags because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
    });

    test("MarkdownFileParseHTMLWithValuelessAttributes", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('<span class="foo" checked>This is a test of the emergency parsing system.</span>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // should not pick up any of the non-breaking tags because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
    });

    test("MarkdownFileParseWithFlowStyleHTMLTags", function() {
        expect.assertions(6);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            "<message a='b'>\n" +
            "This is a string that should be extracted.\n" +
            "</message>\n"
        );
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        r = set.getBySource("This is a string that should be extracted.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a string that should be extracted.");
        expect(r.getKey()).toBe("r134469253");
    });

    test("MarkdownFileParseWithFlowStyleHTMLTagsMultiple", function() {
        expect.assertions(9);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            "<message a='b'>\n" +
            "This is a string that should be extracted.\n" +
            "</message>\n" +
            "<asdf>\n" +
            "This is another string that should be extracted.\n" +
            "</message>\n"
        );
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        r = set.getBySource("This is a string that should be extracted.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a string that should be extracted.");
        expect(r.getKey()).toBe("r134469253");
        r = set.getBySource("This is another string that should be extracted.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is another string that should be extracted.");
        expect(r.getKey()).toBe("r142202207");
    });

    test("MarkdownFileParseWithFlowStyleHTMLTagsMultipleWithTextInBetween", function() {
        expect.assertions(12);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            "<message a='b'>\n" +
            "This is a string that should be extracted.\n" +
            "</message>\n" +
            "ab\n" +
            "<asdf>\n" +
            "This is another string that should be extracted.\n" +
            "</message>\n"
        );
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        r = set.getBySource("This is a string that should be extracted.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a string that should be extracted.");
        expect(r.getKey()).toBe("r134469253");
        r = set.getBySource("ab");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("ab");
        expect(r.getKey()).toBe("r889488492");
        r = set.getBySource("This is another string that should be extracted.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is another string that should be extracted.");
        expect(r.getKey()).toBe("r142202207");
    });

    test("MarkdownFileParseWithFlowStyleHTMLTagsAndEmbeddedHTML", function() {
        expect.assertions(6);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            "<message a='b'>\n" +
            "This is a <em>string</em> that should be extracted.\n" +
            "</message>\n"
        );
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        r = set.getBySource("This is a <c0>string</c0> that should be extracted.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a <c0>string</c0> that should be extracted.");
        expect(r.getKey()).toBe("r625837512");
    });

    test("MarkdownFileParseWithFlowStyleHTMLTagsAndEmbeddedMarkdown", function() {
        expect.assertions(6);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            "<message a='b'>\n" +
            "This is a `string` that *should be* extracted.\n" +
            "</message>\n"
        );
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        r = set.getBySource("This is a <c0/> that <c1>should be</c1> extracted.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a <c0/> that <c1>should be</c1> extracted.");
        expect(r.getKey()).toBe("r177384086");
    });

    test("MarkdownFileParseWithIndentedHTMLTags", function() {
        expect.assertions(21);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(`
## This is a header

Follow these steps:

1. First point:

\`\`\`json
{
  "template_id": "6ae28666-03c4-4ac1-80db-06a90d3b1361",
}
\`\`\`



1. Second point:

\`\`\`json
   {
  "template_id": "6ae28666-03c4-4ac1-80db-06a90d3b1361",
}
\`\`\`



1. Third point:
   
   <Message>

   Test test test

   </Message>

\`\`\`json
{
  "template_id": "6ae28666-03c4-4ac1-80db-06a90d3b1361",
}
\`\`\`

`
        );

        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(6);

        r = set.getBySource("This is a header");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a header");
        expect(r.getKey()).toBe("r655736675");

        r = set.getBySource("Follow these steps:");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Follow these steps:");
        expect(r.getKey()).toBe("r449239371");

        r = set.getBySource("First point:");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("First point:");
        expect(r.getKey()).toBe("r996315725");

        r = set.getBySource("Second point:");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Second point:");
        expect(r.getKey()).toBe("r15205890");

        r = set.getBySource("Third point:");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Third point:");
        expect(r.getKey()).toBe("r924843090");

        r = set.getBySource("Test test test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Test test test");
        expect(r.getKey()).toBe("r13589298");
    });

    test("MarkdownFileParseLists", function() {
        expect.assertions(12);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            '* This is a test of the emergency parsing system.\n' +
            '* This is another test.\n' +
            '* And finally, the last test.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
        var r = set.getBySource("This is another test.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is another test.");
        expect(r.getKey()).toBe("r139148599");
        var r = set.getBySource("And finally, the last test.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("And finally, the last test.");
        expect(r.getKey()).toBe("r177500258");
    });

    test("MarkdownFileParseListWithTextBefore", function() {
        expect.assertions(9);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'This is text before the list.\n' +
            '* This is a test of the emergency parsing system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
        var r = set.getBySource("This is text before the list.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is text before the list.");
        expect(r.getKey()).toBe("r254971181");
    });

    test("MarkdownFileParseListWithTextAfter", function() {
        expect.assertions(9);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            '* This is a test of the emergency parsing system.\n\n' +
            'This is text after the list.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
        var r = set.getBySource("This is text after the list.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is text after the list.");
        expect(r.getKey()).toBe("r607073205");
    });

    test("MarkdownFileParseListWithTextAfter2", function() {
        expect.assertions(9);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'The viewer can be embedded in an IFrame, or linked directly. The URL pattern for the viewer is:\n\n' +
            '* **https://cloud.app.box.com/viewer/{FileID}?options**\n\n' +
            'The File ID can be obtained from the API or from the web application user interface.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var r = set.getBySource("The viewer can be embedded in an IFrame, or linked directly. The URL pattern for the viewer is:");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("The viewer can be embedded in an IFrame, or linked directly. The URL pattern for the viewer is:");
        expect(r.getKey()).toBe("r220720707");
        var r = set.getBySource("The File ID can be obtained from the API or from the web application user interface.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("The File ID can be obtained from the API or from the web application user interface.");
        expect(r.getKey()).toBe("r198589153");
    });

    test("MarkdownFileParseNonBreakingEmphasisOutside", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('*This is a test of the emergency parsing system.*\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // should pick up the emphasis markers
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
    });

    test("MarkdownFileParseNonBreakingHTMLTagsInside", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // should pick up the span tag because there is localizable text
        // before it and after it
        var r = set.getBySource('This is <c0> a test of the emergency parsing </c0> system.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <c0> a test of the emergency parsing </c0> system.');
        expect(r.getKey()).toBe('r124733470');
    });

    test("MarkdownFileParseNonBreakingHTMLTagsInsideMultiple", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // tags should be nestable
        var r = set.getBySource('This is <c0> a test of the <c1>emergency</c1> parsing </c0> system.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <c0> a test of the <c1>emergency</c1> parsing </c0> system.');
        expect(r.getKey()).toBe('r772812508');
    });

    test("MarkdownFileParseNonBreakingTagsNotWellFormed", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // the end span tag should automatically end the em tag
        var r = set.getBySource('This is <c0> a test of the <c1>emergency parsing </c1></c0> system.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <c0> a test of the <c1>emergency parsing </c1></c0> system.');
        expect(r.getKey()).toBe('r417724998');
    });

    test("MarkdownFileParseNonBreakingTagsTagStackIsReset", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('<span>This is <span id="foo" class="bar"> a test of the <em>emergency parsing</em> system.</span>\n\n' +
                  'This is <b>another test</b> of the emergency parsing </span> system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // the end div tag ends all the other tags
        var r = set.getBySource('This is <c0>another test</c0> of the emergency parsing');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <c0>another test</c0> of the emergency parsing');
        expect(r.getKey()).toBe('r2117084');
    });

    test("MarkdownFileParseLocalizableTitle", function() {
        expect.assertions(8);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('<div title="This value is localizable">\n\n' +
                'This is a test\n\n' +
                '</div>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
        r = set.getBySource("This value is localizable");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This value is localizable");
        expect(r.getKey()).toBe("r922503175");
    });

    test("MarkdownFileParseLocalizableTitleWithSingleQuotes", function() {
        expect.assertions(8);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse("<div title='This value is localizable'>\n\n" +
                'This is a test\n\n' +
                '</div>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
        r = set.getBySource("This value is localizable");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This value is localizable");
        expect(r.getKey()).toBe("r922503175");
    });

    test("MarkdownFileParseLocalizableAttributes", function() {
        expect.assertions(8);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test\n' +
                '<input type="text" placeholder="localizable placeholder here"></input>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
        r = set.getBySource("localizable placeholder here");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("localizable placeholder here");
        expect(r.getKey()).toBe("r734414247");
    });

    test("MarkdownFileParseLocalizableAttributesSkipEmpty", function() {
        expect.assertions(6);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test\n' +
                '<input type="text" placeholder=""></input>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("MarkdownFileParseLocalizableAttributesAndNonBreakingTags", function() {
        expect.assertions(8);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is <a href="foo.html" title="localizable title">a test</a> of non-breaking tags.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource('This is <c0>a test</c0> of non-breaking tags.');
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe('This is <c0>a test</c0> of non-breaking tags.');
        expect(r.getKey()).toBe('r1063253939');
        r = set.getBySource("localizable title");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("localizable title");
        expect(r.getKey()).toBe("r160369622");
    });

    test("MarkdownFileParseI18NComments", function() {
        expect.assertions(10);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('<!-- i18n this describes the text below -->\n' +
                'This is a test of the emergency parsing system.\n\n' +
                'But not this text\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
        expect(r.getComment()).toBe("this describes the text below");
        r = set.getBySource("But not this text");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("But not this text");
        expect(r.getKey()).toBe("r492109677");
        expect(!r.getComment()).toBeTruthy();
    });

    test("MarkdownFileParseIgnoreTags", function() {
        expect.assertions(6);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            '<script type="javascript">\n' +
            'if (window) {\n' +
            '  $(".foo").class("asdf");\n' +
            '}\n' +
            '</script>\n' +
            '<style>\n' +
            '  .activity_title{\n' +
            '    font-size: 18px;\n' +
            '    font-weight: 300;\n' +
            '    color: #777;\n' +
            '    line-height: 40px;\n' +
            '  }\n' +
            '</style>\n' +
            '<span class="foo">foo</span>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getBySource("foo");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("foo");
        expect(r.getKey()).toBe("r941132140");
    });

    test("MarkdownFileParseWithFrontMatterNotParsed", function() {
        expect.assertions(10);
        var mf = new MarkdownFile({
            project: p3,
            type: mdft3,
            pathName: "foo/bar.md"  // no frontmatter config
        });
        expect(mf).toBeTruthy();
        mf.parse(
            '---\n' +
            'test: This is a test of the front matter\n' +
            'description: another front matter description\n' +
            '---\n\n' +
            'This is a test\n\n' +
            'This is also a test\n'
        );
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
        r = set.getBySource("This is also a test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a test");
        expect(r.getKey()).toBe("r999080996");
        // the front matter should be ignored
        r = set.getBySource("This is a test of the front matter");
        expect(!r).toBeTruthy();
        r = set.getBySource("test: This is a test of the front matter");
        expect(!r).toBeTruthy();
    });

    test("MarkdownFileParseWithFrontMatterExtracted", function() {
        expect.assertions(14);
        var mf = new MarkdownFile({
            project: p3,
            type: mdft3,
            pathName: "foo/bar/x/foo.md"
        });
        expect(mf).toBeTruthy();
        mf.parse(
            '---\n' +
            'Title: This is a test of the front matter\n' +
            'Description: |\n' +
            '  another front matter description\n' +
            '  with extended text\n' +
            '---\n\n' +
            'This is a test\n\n' +
            'This is also a test\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // the front matter should be extracted because p3 has fm settings
        // turned on. The front matter is in yaml format
        var r = set.getBySource("This is a test of the front matter");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the front matter");
        expect(r.getSourceLocale()).toBe("en-US");
        expect(r.getKey()).toBe("r777132775.Title");
        expect(r.getPath()).toBe("foo/bar/x/foo.md"); // should come from this file
        expect(r.getDataType()).toBe("x-yaml");
        expect(r.getProject()).toBe("foo");
        expect(r.getType()).toBe("string");
        r = set.getBySource("another front matter description\nwith extended text\n");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("another front matter description\nwith extended text\n");
        expect(r.getKey()).toBe("r777132775.Description");
        expect(r.getPath()).toBe("foo/bar/x/foo.md"); // should come from this file
    });

    test("MarkdownFileParseWithFrontMatterExtractAll", function() {
        expect.assertions(11);
        var mf = new MarkdownFile({
            project: p3,
            type: mdft3,
            pathName: "foo/bar/y/foo.md" // extracts all front matter fields
        });
        expect(mf).toBeTruthy();
        mf.parse(
            '---\n' +
            'Title: This is a test of the front matter\n' +
            'Description: |\n' +
            '  another front matter description\n' +
            '  with extended text\n' +
            'Foobar: asdf asdf asdf\n' +
            '---\n\n' +
            'This is a test\n\n' +
            'This is also a test\n');
        set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // the front matter should be extracted because p3 has fm settings.
        // the front matter is in yaml format
        var r = set.getBySource("This is a test of the front matter");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the front matter");
        expect(r.getKey()).toBe("r318739619.Title");
        r = set.getBySource("another front matter description\nwith extended text\n");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("another front matter description\nwith extended text\n");
        expect(r.getKey()).toBe("r318739619.Description");
        r = set.getBySource("asdf asdf asdf");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("asdf asdf asdf");
        expect(r.getKey()).toBe("r318739619.Foobar");
    });

    test("MarkdownFileParseWithFrontMatterExtractedTwoFiles", function() {
        expect.assertions(21);
        mdft3.getExtracted().clear();
        expect(mdft3.getExtracted().size()).toBe(0);
        var mf = new MarkdownFile({
            project: p3,
            type: mdft3,
            pathName: "foo/bar/x/foo.md"
        });
        expect(mf).toBeTruthy();
        mf.parse(
            '---\n' +
            'Title: This is a test of the front matter\n' +
            'Description: |\n' +
            '  another front matter description\n' +
            '  with extended text\n' +
            '---\n\n' +
            'This is a test\n\n' +
            'This is also a test\n');
        mdft3.addSet(mf.getTranslationSet());
        mf = new MarkdownFile({
            project: p3,
            type: mdft3,
            pathName: "foo/bar/x/foobar.md"
        });
        expect(mf).toBeTruthy();
        mf.parse(
            '---\n' +
            'Title: This is another test of the front matter\n' +
            'Description: |\n' +
            '  another front matter description\n' +
            '  with extended text\n' +
            '---\n\n' +
            'This is a test\n\n' +
            'This is also a test\n');
        mdft3.addSet(mf.getTranslationSet());
        var set = mdft3.getExtracted();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(6);
        // the front matter should be extracted because p3 has fm settings
        // turned on. The front matter is in yaml format
        var r = set.getBySource("This is a test of the front matter");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the front matter");
        expect(r.getSourceLocale()).toBe("en-US");
        expect(r.getKey()).toBe("r777132775.Title");
        expect(r.getPath()).toBe("foo/bar/x/foo.md"); // should come from this file
        expect(r.getDataType()).toBe("x-yaml");
        expect(r.getProject()).toBe("foo");
        expect(r.getType()).toBe("string");
        r = set.getBySource("This is another test of the front matter");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is another test of the front matter");
        expect(r.getSourceLocale()).toBe("en-US");
        expect(r.getKey()).toBe("r456669421.Title");
        expect(r.getPath()).toBe("foo/bar/x/foobar.md"); // should come from this file
        expect(r.getDataType()).toBe("x-yaml");
        expect(r.getProject()).toBe("foo");
        expect(r.getType()).toBe("string");
    });

    test("MarkdownFileParseTable", function() {
        expect.assertions(21);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            "|                   |                 |\n" +
            "|-------------------|-----------------|\n" +
            "| Query description | Returns column  |\n" +
            "| asdf              | fdsa            |\n" +
            "| foo               | bar             |\n");
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(6);
        var r = set.getBySource("Query description");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Query description");
        expect(r.getKey()).toBe("r744039504");
        r = set.getBySource("Returns column");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Returns column");
        expect(r.getKey()).toBe("r595024848");
        r = set.getBySource("asdf");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("asdf");
        expect(r.getKey()).toBe("r976104267");
        r = set.getBySource("fdsa");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("fdsa");
        expect(r.getKey()).toBe("r486555110");
        r = set.getBySource("foo");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("foo");
        expect(r.getKey()).toBe("r941132140");
        r = set.getBySource("bar");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("bar");
        expect(r.getKey()).toBe("r755240053");
    });

    test("MarkdownFileParseTableWithInlineCode", function() {
        expect.assertions(15);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            "|                   |                 |\n" +
            "|-------------------|-----------------|\n" +
            "| Query description | Returns column  |\n" +
            "| `asdf`            | `fdsa`          |\n" +
            "| foo               | bar             |\n");
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(4);
        var r = set.getBySource("Query description");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Query description");
        expect(r.getKey()).toBe("r744039504");
        r = set.getBySource("Returns column");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Returns column");
        expect(r.getKey()).toBe("r595024848");
        r = set.getBySource("foo");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("foo");
        expect(r.getKey()).toBe("r941132140");
        r = set.getBySource("bar");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("bar");
        expect(r.getKey()).toBe("r755240053");
    });

    test("MarkdownFileParseTableWithInlineCodeAndTextAfterwards", function() {
        expect.assertions(15);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            "|                   |                 |\n" +
            "|-------------------|-----------------|\n" +
            "| Query description | Returns column  |\n" +
            "| `order_by`        | `field_key`     |\n" +
            "\n" +
            "## Heading Title\n" +
            "\n" +
            "Text body.\n");
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(4);
        var r = set.getBySource("Query description");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Query description");
        expect(r.getKey()).toBe("r744039504");
        r = set.getBySource("Returns column");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Returns column");
        expect(r.getKey()).toBe("r595024848");
        r = set.getBySource("Heading Title");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Heading Title");
        expect(r.getKey()).toBe("r931719890");
        r = set.getBySource("Text body.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Text body.");
        expect(r.getKey()).toBe("r443039973");
    });

    test("MarkdownFileExtractFile", function() {
        expect.assertions(14);
        var base = path.dirname(module.id);
        var mf = new MarkdownFile({
            project: p,
            pathName: "./md/test1.md",
            type: mdft
        });
        expect(mf).toBeTruthy();
        // should read the file
        mf.extract();
        var set = mf.getTranslationSet();
        expect(set.size()).toBe(4);
        var r = set.getBySource("This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        expect(r.getKey()).toBe("r548615397");
        r = set.getBySource("This is some text. This is more text. Pretty, pretty text.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is some text. This is more text. Pretty, pretty text.");
        expect(r.getKey()).toBe("r777006502");
        r = set.getBySource("This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        expect(r.getKey()).toBe("r112215756");
        r = set.getBySource("This is the last bit of localizable text.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is the last bit of localizable text.");
        expect(r.getKey()).toBe("r260813817");
    });

    test("MarkdownFileExtractFile2", function() {
        expect.assertions(11);
        var base = path.dirname(module.id);
        var mf = new MarkdownFile({
            project: p,
            pathName: "./md/test2.md",
            type: mdft
        });
        expect(mf).toBeTruthy();
        // should read the file
        mf.extract();
        var set = mf.getTranslationSet();
        expect(set.size()).toBe(3);
        var r = set.getBySource("This is text with a <c0>link</c0> in it.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is text with a <c0>link</c0> in it.");
        expect(r.getKey()).toBe("r717941707");
        r = set.getBySource("This is text with <c0>some emphasis <c1>on the wrong</c1> syllable</c0>. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is text with <c0>some emphasis <c1>on the wrong</c1> syllable</c0>. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.");
        expect(r.getKey()).toBe("r736057533");
        r = set.getBySource("This is a Heading");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a Heading");
        expect(r.getKey()).toBe("r728092714");
    });

    test("MarkdownFileExtractUndefinedFile", function() {
        expect.assertions(2);
        var base = path.dirname(module.id);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // should attempt to read the file and not fail
        mf.extract();
        var set = mf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("MarkdownFileExtractBogusFile", function() {
        expect.assertions(2);
        var base = path.dirname(module.id);
        var mf = new MarkdownFile({
            project: p,
            pathName: "./md/bogus.md",
            type: mdft
        });
        expect(mf).toBeTruthy();
        // should attempt to read the file and not fail
        mf.extract();
        var set = mf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("MarkdownFileLocalizeText", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        var actual = mf.localizeText(translations, "fr-FR");
        var expected = 'Ceci est un essai\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeTextPreserveWhitespace", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test    \n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un essai    \n');
    });

    test("MarkdownFileLocalizeTextMultiple", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test\n\n' +
                'This is also a test\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r654479252",
            source: "This is a test",
            sourceLocale: "en-US",
            target: "Ceci est un essai",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un essai\n\n' +
                'Ceci est aussi un essai\n');
    });

    test("MarkdownFileLocalizeTextWithDups", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test\n\n' +
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
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un essai\n\n' +
                'Ceci est aussi un essai\n\n' +
                'Ceci est un essai\n');
    });

    test("MarkdownFileLocalizeTextSkipScript", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('<script>\n' +
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
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('<script>\n' +
            '// comment text\n' +
            'if (locales.contains[thisLocale]) {\n' +
            '    document.write("<input id=\"locale\" class=\"foo\" title=\"bar\"></input>");\n' +
            '}\n' +
            '</script>\n' +
            '\n' +
            'Ceci est un essai\n');
    });

    test("MarkdownFileLocalizeTextWithLinks", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a [test](http://www.test.com/) of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un [essai](http://www.test.com/) du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MarkdownFileLocalizeTextWithLinksNotTranslated", function() {
        expect.assertions(6);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // make sure there are no new strings before we start
        mdft.newres.clear();
        expect(mdft.newres.size()).toBe(0);
        expect(mf.getTranslationSet().size()).toBe(0);
        mf.parse('This is a [test](http://www.test.com/) of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un [essai](http://www.test.com/) du système d\'analyse syntaxique de l\'urgence.\n');
        // the set of new translations should be empty because we did not extract the link
        var newSet = mdft.getNew();
        expect(newSet.size()).toBe(0);
        expect(mf.getTranslationSet().size()).toBe(1);
    });

    test("MarkdownFileLocalizeTextWithLinksTranslatedNew", function() {
        expect.assertions(7);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // make sure there are no new strings before we start
        mdft.newres.clear();
        expect(mdft.newres.size()).toBe(0);
        expect(mf.getTranslationSet().size()).toBe(0);
        mf.parse(
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
            datatype: "markdown"
        }));
        // no translation available for the link itself
        expect(mf.localizeText(translations, "fr-FR")).toBe('<!-- i18n-enable localize-links -->\n\n' +
            'Ceci est un [essai](http://www.test.com/) du système d\'analyse syntaxique de l\'urgence.\n\n' +
            '<!-- i18n-disable localize-links -->\n'
        );
        // the set of new translations should now contain the link
        var newSet = mdft.getNew();
        expect(newSet.size()).toBe(1);
        var resources = newSet.getAll();
        expect(resources[0].getSource()).toBe("http://www.test.com/");
        expect(mf.getTranslationSet().size()).toBe(2);
    });

    test("MarkdownFileLocalizeTextWithLinksTranslated", function() {
        expect.assertions(6);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // make sure there are no new strings before we start
        mdft.newres.clear();
        expect(mdft.newres.size()).toBe(0);
        expect(mf.getTranslationSet().size()).toBe(0);
        mf.parse(
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
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r474012543",
            source: "http://www.test.com/",
            sourceLocale: "en-US",
            target: "http://www.test.com/fr",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        // no translation available for the link itself
        expect(mf.localizeText(translations, "fr-FR")).toBe('<!-- i18n-enable localize-links -->\n\n' +
            'Ceci est un [essai](http://www.test.com/fr) du système d\'analyse syntaxique de l\'urgence.\n\n' +
            '<!-- i18n-disable localize-links -->\n'
        );
        // the set of new translations should not contain the link because it was already translated
        var newSet = mdft.getNew();
        expect(newSet.size()).toBe(0);
        expect(mf.getTranslationSet().size()).toBe(2);
    });

    test("MarkdownFileLocalizeTextWithInlineCode", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a `test` of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r879023644",
            source: "This is a <c0/> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0/> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un `test` du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MarkdownFileLocalizeTextWithInlineCodeAtTheEnd", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('Delete the file with this command: `git rm filename`\n');
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
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Avec cette commande `git rm filename`, vous pouvez supprimer le fichier.\n');
    });

    test("MarkdownFileLocalizeInlineCodeByItself", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
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
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r16227039",
            source: "Sentence after.",
            sourceLocale: "en-US",
            target: "La phrase denier.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe("Ceci est un teste de la systeme 'inline code'.\n" +
            '\n' +
            '`inline code`\n' +
            '\n' +
            'La phrase denier.\n');
    });

    test("MarkdownFileLocalizeTextWithLinkReference", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency [C1] parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r1017266258",
            source: "This is a test of the emergency <c0>C1</c0> parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse syntaxique de l'urgence <c0>C1</c0>.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un test du système d\'analyse syntaxique de l\'urgence [C1][C1].\n');
    });

    test("MarkdownFileLocalizeTextWithMultipleLinkReferences", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency [C1] parsing system [R1].\n\n[C1]: https://www.box.com/test1\n[R1]: http://www.box.com/about.html\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r817759238",
            source: "This is a test of the emergency <c0>C1</c0> parsing system <c1>R1</c1>.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse syntaxique <c1>Reponse1</c1> de l'urgence <c0>teste</c0>.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un test du système d\'analyse syntaxique [Reponse1][R1] de l\'urgence [teste][C1].\n\n[C1]: https://www.box.com/test1\n\n[R1]: http://www.box.com/about.html\n');
    });

    test("MarkdownFileLocalizeTextWithMultipleLocalizableLinkReferences", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency [C1] parsing system [R1].\n\n' +
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
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r647537837",
            source: "https://www.box.com/test1",
            sourceLocale: "en-US",
            target: "https://www.box.com/fr/test1",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r448858983",
            source: "http://www.box.com/about.html",
            sourceLocale: "en-US",
            target: "http://www.box.com/fr/about.html",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un test du système d\'analyse syntaxique [Reponse1][R1] de l\'urgence [teste][C1].\n\n' +
            '<!-- i18n-enable localize-links -->\n\n' +
            '[C1]: https://www.box.com/fr/test1\n\n' +
            '[R1]: http://www.box.com/fr/about.html\n\n' +
            '<!-- i18n-disable localize-links -->\n');
    });

    test("MarkdownFileLocalizeTextWithFootnotes", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency parsing [^1] system.\n\n' +
            '[^1]: well, not really\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r1010312382",
            source: "This is a test of the emergency parsing <c0/> system.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse syntaxique <c0/> de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r472274968",
            source: "well, not really",
            sourceLocale: "en-US",
            target: "normalement, c'est pas vrai",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un test du système d\'analyse syntaxique [^1] de l\'urgence.\n\n' +
            '[^1]: normalement, c\'est pas vrai\n');
    });

    test("MarkdownFileLocalizeTextWithFootnotesLongName", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency parsing [^longname] system.\n\n' +
            '[^longname]: well, not really\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r1010312382",
            source: "This is a test of the emergency parsing <c0/> system.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse syntaxique <c0/> de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r472274968",
            source: "well, not really",
            sourceLocale: "en-US",
            target: "normalement, c'est pas vrai",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un test du système d\'analyse syntaxique [^longname] de l\'urgence.\n\n' +
            '[^longname]: normalement, c\'est pas vrai\n');
    });

    test("MarkdownFileLocalizeTextNonBreakingTags", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a <em>test</em> of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un <em>essai</em> du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MarkdownFileLocalizeTextNonBreakingTagsOutside", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('*This is a test of the emergency parsing system.*\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r699762575",
            source: "This is a test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('_Ceci est un essai du système d\'analyse syntaxique de l\'urgence._\n');
    });

    test("MarkdownFileLocalizeTextNonBreakingTagsBeforeAndAfter", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('*_ <span class="test"> <span id="foo"></span></span>  This is a test of the emergency parsing system.   _*\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r699762575",
            source: "This is a test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('__ <span class="test"> <span id="foo"></span></span>  Ceci est un essai du système d\'analyse syntaxique de l\'urgence.   __\n');
    });

    test("MarkdownFileLocalizeTextNonBreakingTagsInside", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is <span id="foo" class="bar"> a test of the emergency parsing </span> system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r124733470',
            source: 'This is <c0> a test of the emergency parsing </c0> system.',
            target: 'Ceci est <c0> un essai du système d\'analyse syntaxique de l\'urgence. </c0>',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de l\'urgence. </span>\n');
    });

    test("MarkdownFileLocalizeTextNonBreakingTagsInsideMultiple", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is <span id="foo" class="bar"> a test of the <em>emergency</em> parsing </span> system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r772812508',
            source: 'This is <c0> a test of the <c1>emergency</c1> parsing </c0> system.',
            target: 'Ceci est <c0> un essai du système d\'analyse syntaxique de <c1>l\'urgence</c1>.</c0>',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence</em>.</span>\n');
    });

    test("MarkdownFileLocalizeTextNonBreakingTagsNotWellFormed", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r417724998',
            source: 'This is <c0> a test of the <c1>emergency parsing </c1></c0> system.',
            target: 'Ceci est <c0> un essai du système d\'analyse syntaxique de <c1>l\'urgence.</c1></c0>',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence.</em></span>\n');
    });

    test("MarkdownFileLocalizeTextBreakingTags", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a <p>test of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r21364457",
            source: "This is a",
            sourceLocale: "en-US",
            target: "Ceci est un",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r787549036",
            source: "test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un <p>essai du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MarkdownFileLocalizeTextSelfClosedBreakingTags", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a <p/>test of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r21364457",
            source: "This is a",
            sourceLocale: "en-US",
            target: "Ceci est un",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r787549036",
            source: "test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un <p/>essai du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MarkdownFileLocalizeTextSelfClosingNonBreakingTags", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a <br>test of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r292870472",
            source: "This is a <c0/>test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0/>essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un <br>essai du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MarkdownFileLocalizeTextSelfClosedNonBreakingTags", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a <br/>test of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r292870472",
            source: "This is a <c0/>test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0/>essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un <br/>essai du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MarkdownFileLocalizeTextMismatchedNumberOfComponents", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a <em>test</em> of the emergency parsing system.\n');
        var translations = new TranslationSet();
        // there is no c1 in the source, so this better not throw an exception
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse <c1>syntaxique</c1> de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        // Should ignore the c1 as if it weren't there
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un <em>essai</em> du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MarkdownFileLocalizeTextMismatchedNumberOfComponentsSelfClosing", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a <em>test</em> of the emergency parsing system.\n');
        var translations = new TranslationSet();
        // there is no c1 in the source, so this better not throw an exception
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse <c1/> syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        // Should ignore the c1 as if it weren't there
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un <em>essai</em> du système d\'analyse  syntaxique de l\'urgence.\n');
    });

    test("MarkdownFileLocalizeTextLocalizableTitle", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('Markdown text <div title="This value is localizable">This is a test</div>\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r922503175',
            source: 'This value is localizable',
            target: 'Cette valeur est localisable',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r654479252',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('\\[Màŕķðõŵñ ţëxţ6543210] <div title="Cette valeur est localisable">Ceci est un essai</div>\n');
    });

    test("MarkdownFileLocalizeTextLocalizableTitleSingleQuotes", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse("Markdown text <div title='This value is localizable'>This is a test</div>\n");
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            key: 'r922503175',
            project: "foo",
            source: 'This value is localizable',
            target: 'Cette valeur est localisable',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r654479252',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('\\[Màŕķðõŵñ ţëxţ6543210] <div title="Cette valeur est localisable">Ceci est un essai</div>\n');
    });

    test("MarkdownFileLocalizeTextLocalizableAttributes", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('![Alternate text](http://www.test.test/foo.png "title here")\n' +
                'This is a test\n' +
                '<input type="text" placeholder="localizable placeholder here">\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1051764073',
            source: 'Alternate text',
            target: 'Texte alternative',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r625153591',
            source: 'title here',
            target: 'titre ici',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r654479252',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r734414247',
            source: 'localizable placeholder here',
            target: 'espace réservé localisable ici',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('![Texte alternative](http://www.test.test/foo.png "titre ici")\n' +
            'Ceci est un essai\n' +
            '<input type="text" placeholder="espace réservé localisable ici">\n');
    });

    test("MarkdownFileLocalizeTextLocalizableAttributesAndNonBreakingTags", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is <a href="foo.html" title="localizable title">a test</a> of non-breaking tags.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1063253939',
            source: 'This is <c0>a test</c0> of non-breaking tags.',
            target: 'Ceci est <c0>un essai</c0> des balises non-ruptures.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r160369622',
            source: 'localizable title',
            target: 'titre localisable',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est <a href="foo.html" title="titre localisable">un essai</a> des balises non-ruptures.\n');
    });

    test("MarkdownFileLocalizeTextLocalizableValuelessAttributes", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is <a href="foo.html" checked title="localizable title">a test</a> of non-breaking tags.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1063253939',
            source: 'This is <c0>a test</c0> of non-breaking tags.',
            target: 'Ceci est <c0>un essai</c0> des balises non-ruptures.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r160369622',
            source: 'localizable title',
            target: 'titre localisable',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est <a href="foo.html" checked title="titre localisable">un essai</a> des balises non-ruptures.\n');
    });

    test("MarkdownFileLocalizeTextI18NComments", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('<!-- i18n: this describes the text below -->\n' +
                'This is a test of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r699762575',
            source: 'This is a test of the emergency parsing system.',
            target: 'Ceci est un essai du système d\'analyse syntaxique de l\'urgence.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('<!-- i18n: this describes the text below -->\n\n' +
            'Ceci est un essai du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MarkdownFileLocalizeTextIdentifyResourceIds", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p2,
            type: mdft2
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test\n\n' +
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
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        var expected =
            '<span x-locid="r654479252">Ceci est un essai</span>\n\n' +
            '<span x-locid="r999080996">Ceci est aussi un essai</span>\n\n' +
            '<span x-locid="r654479252">Ceci est un essai</span>\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeHTMLWithValuelessAttributes", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('<span class="foo" checked>This is a test of the emergency parsing system.</span>\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r699762575",
            source: "This is a test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse d'urgence.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        var expected =
            '<span class="foo" checked>Ceci est un test du système d\'analyse d\'urgence.</span>\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeFlowStyleHTML", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
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
            datatype: "markdown"
        }));
        var expected =
            '<span class="foo" checked>\n' +
            'Ceci est un test du système d\'analyse d\'urgence.\n' +
            '</span>\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeFlowStyleHTMLMultiple", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
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
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r299977686",
            source: "This is translatable.",
            sourceLocale: "en-US",
            target: "Ceci est traduitable.",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        var expected =
            '<span class="foo" checked>\n' +
            'Ceci est un test du système d\'analyse d\'urgence.\n' +
            '</span>\n' +
            '<message>\n' +
            'Ceci est traduitable.\n' +
            '</message>\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeFlowStyleHTMLMultipleWithTextInBetween", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
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
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r299977686",
            source: "This is translatable.",
            sourceLocale: "en-US",
            target: "Ceci est traduitable.",
            targetLocale: "fr-FR",
            datatype: "markdown"
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
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeFlowStyleHTMLWithEmbeddedHTML", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
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
            datatype: "markdown"
        }));
        var expected =
            '<span class="foo" checked>\n' +
            'Ceci est un <b>test</b> du système d\'analyse d\'urgence.\n' +
            '</span>\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeFlowStyleHTMLWithEmbeddedMarkdown", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
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
            datatype: "markdown"
        }));
        var expected =
            '<span class="foo" checked>\n' +
            'Ceci est un `test` du _système d\'analyse d\'urgence_.\n' +
            '</span>\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeTextIgnoreFrontMatter", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
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
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        // should ignore the front matter and leave it unlocalized
        var expected =
            '---\n' +
            'test: This is a test\n' +
            '---\n' +
            'Ceci est un essai\n\n' +
            'Ceci est aussi un essai\n\n' +
            'Ceci est un essai\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeTextProcessFrontMatter", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p3,
            type: mdft3,
            pathName: "a/b/x/foo.md"
        });
        expect(mf).toBeTruthy();
        mf.parse(
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
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "markdown"
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
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeTextProcessFrontMatterProcessNewStrings", function() {
        expect.assertions(12);
        var mf = new MarkdownFile({
            project: p3,
            type: mdft3,
            pathName: "a/b/x/foo.md"
        });
        expect(mf).toBeTruthy();
        mdft3.newres.clear();
        mf.parse(
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
            datatype: "markdown"
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
        var actual = mf.localizeText(translations, "fr-FR");
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

    test("MarkdownFileLocalizeTextProcessFrontMatterSkipUnknownFields", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p3,
            type: mdft3,
            pathName: "a/b/x/foo.md"
        });
        expect(mf).toBeTruthy();
        mf.parse(
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
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "markdown"
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
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeTextProcessFrontMatterLocalizeAll", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p3,
            type: mdft3,
            pathName: "a/b/y/foo.md" // localizes all frontmatter fields
        });
        expect(mf).toBeTruthy();
        mf.parse(
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
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "markdown"
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
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileGetLocalizedPathSimple", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            pathName: "simple.md",
            type: mdft
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr-FR/simple.md");
    });

    test("MarkdownFileGetLocalizedPathComplex", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            pathName: "./asdf/bar/simple2.md",
            type: mdft
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.md");
    });

    test("MarkdownFileGetLocalizedPathRegularMarkdownFileName", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            pathName: "./asdf/bar/simple2.md",
            type: mdft
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.md");
    });

    test("MarkdownFileGetLocalizedPathNotEnoughParts", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            pathName: "./asdf/bar/simple",
            type: mdft
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple");
    });

    test("MarkdownFileGetLocalizedPathAlreadyHasSourceLocale", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p3,
            pathName: "./en-US/asdf/bar/simple2.md",
            type: mdft3
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.md");
    });

    test("MarkdownFileGetLocalizedPathSourceLocaleInMidPath", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p3,
            pathName: "./asdf/en-US/bar/simple3.md",
            type: mdft3
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("asdf/fr-FR/bar/simple3.md");
    });

    test("MarkdownFileGetLocalizedPathSourceLocaleInBeginningPath", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p3,
            pathName: "en-US/asdf/bar/simple2.md",
            type: mdft3
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.md");
    });

    test("MarkdownFileGetLocalizedPathSourceLocaleInMidPathOnlyWholeLocale", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p3,
            pathName: "./asdf/pen-USing/en-US/bar/asdf.md",
            type: mdft3
        });
        expect(mf).toBeTruthy();
        // should leave "pen-USing" alone and only get the "en-US" path component
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr-FR/bar/asdf.md");
    });

    test("MarkdownFileGetLocalizedPathWithLocaleMap", function() {
        expect.assertions(3);
        var mf = new MarkdownFile({
            project: p3,
            pathName: "simple4.md",
            type: mdft3
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr/asdf/bar/simple4.md");
        expect(mf.getLocalizedPath("zh-Hans-CN")).toBe("zh-CN/asdf/bar/simple4.md");
    });

    test("MarkdownFileLocalizeFile", function() {
        expect.assertions(5);
        var base = path.dirname(module.id);
        var mf = new MarkdownFile({
            project: p,
            pathName: "./md/test1.md",
            type: mdft
        });
        expect(mf).toBeTruthy();
        // should read the file
        mf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        mf.localize(translations, ["fr-FR", "de-DE"]);
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

    test("MarkdownFileLocalizeFileWithFrontMatter", function() {
        expect.assertions(5);
        var base = path.dirname(module.id);
        var mf = new MarkdownFile({
            project: p,
            pathName: "./md/test3.md",
            type: mdft
        });
        expect(mf).toBeTruthy();
        // should read the file
        mf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        mf.localize(translations, ["fr-FR", "de-DE"]);
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

    test("MarkdownFileLocalizeFileWithFrontMatterNotFullyTranslated", function() {
        expect.assertions(5);
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            markdown: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MarkdownFileType(p2);
        var mf = new MarkdownFile({
            project: p2,
            pathName: "./notrans2.md",
            type: mdft2
        });
        expect(mf).toBeTruthy();
        // should read the file
        mf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        mf.localize(translations, ["fr-FR", "de-DE"]);
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

    test("MarkdownFileLocalizeFileWithFrontMatterFullyTranslated", function() {
        expect.assertions(5);
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            markdown: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MarkdownFileType(p2);
        var mf = new MarkdownFile({
            project: p2,
            pathName: "./notrans2.md",
            type: mdft2
        });
        expect(mf).toBeTruthy();
        // should read the file
        mf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        mf.localize(translations, ["fr-FR", "de-DE"]);
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

    test("MarkdownFileLocalizeFileWithNoFrontMatterAlreadyFullyTranslated", function() {
        expect.assertions(5);
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            markdown: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MarkdownFileType(p2);
        var mf = new MarkdownFile({
            project: p2,
            pathName: "./notrans.md",
            type: mdft2
        });
        expect(mf).toBeTruthy();
        // should read the file
        mf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        mf.localize(translations, ["fr-FR", "de-DE"]);
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

    test("MarkdownFileLocalizeNoStrings", function() {
        expect.assertions(3);
        var base = path.dirname(module.id);
        var mf = new MarkdownFile({
            project: p,
            pathName: "./md/nostrings.md",
            type: mdft
        });
        expect(mf).toBeTruthy();
        // should read the file
        mf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r308704783',
            source: 'Get insurance quotes for free!',
            target: 'Obtenez des devis d\'assurance gratuitement!',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r308704783',
            source: 'Get insurance quotes for free!',
            target: 'Kostenlosen Versicherungs-Angebote erhalten!',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        mf.localize(translations, ["fr-FR", "de-DE"]);
        // should produce the files, even if there is nothing to localize in them
        expect(fs.existsSync(path.join(p.target, "fr-FR/md/nostrings.md"))).toBeTruthy();
        expect(fs.existsSync(path.join(p.target, "de-DE/md/nostrings.md"))).toBeTruthy();
    });

    test("MarkdownFileExtractFileNewResources", function() {
        expect.assertions(16);
        var base = path.dirname(module.id);
        var t = new MarkdownFileType(p);
        var mf = new MarkdownFile({
            project: p,
            pathName: "./md/mode.md",
            type: t
        });
        expect(mf).toBeTruthy();
        mf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r950833718",
            source: "Choose a meeting method",
            sourceLocale: "en-US",
            target: "Choisissez une méthode de réunion d'affaires",
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        var actual = mf.localizeText(translations, "fr-FR");
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

    test("MarkdownFileLocalizeTextHeaderWithNoSpace", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
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
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r836504731',
            source: 'Other Bad Header',
            target: 'Autre entête mal',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('# Entête mal\n\n' +
            '## Autre entête mal\n\n' +
            '# Entête mal\n');
    });

    test("MarkdownFileParseMultipleMDComponents", function() {
        expect.assertions(9);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'Integration samples include: \n' +
            '* **[File Workflow with Webhooks](/docs/file-workflow-with-webhooks)**: Creating file task automation with webhooks.\n');
        var set = mf.getTranslationSet();
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

    test("MarkdownFileParseWithLinkReferenceWithText", function() {
        expect.assertions(6);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '- [Ask on Twitter][twitter]: For general questions and support.\n' +
            '\n' +
            '[twitter]: https://twitter.com/OurPlatform\n'
        );
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(2);
        var resources = set.getAll();
        expect(resources.length).toBe(2);
        expect(resources[0].getSource()).toBe("For developer support, please reach out to us via one of our channels:");
        expect(resources[1].getSource()).toBe("<c0>Ask on Twitter</c0>: For general questions and support.");
    });

    test("MarkdownFileParseWithLinkReferenceToExtractedURL", function() {
        expect.assertions(8);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            '- [Ask on Twitter][twitter]: For general questions and support.\n' +
            '- [Ask on Facebook][facebook]: For general questions and support.\n' +
            '\n' +
            '<!-- i18n-enable localize-links -->\n' +
            '[twitter]: https://twitter.com/OurPlatform\n' +
            '[facebook]: http://www.facebook.com/OurPlatform\n' +
            '<!-- i18n-disable localize-links -->'
        );
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(4);
        var resources = set.getAll();
        expect(resources.length).toBe(4);
        expect(resources[0].getSource()).toBe("<c0>Ask on Twitter</c0>: For general questions and support.");
        expect(resources[1].getSource()).toBe("<c0>Ask on Facebook</c0>: For general questions and support.");
        expect(resources[2].getSource()).toBe("https://twitter.com/OurPlatform");
        expect(resources[3].getSource()).toBe("http://www.facebook.com/OurPlatform");
    });

    test("MarkdownFileParseWithLinkReferenceWithLinkTitle", function() {
        expect.assertions(7);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'Regular service will be [available][exception].\n' +
            '\n' +
            '<!-- i18n-enable localize-links -->\n' +
            '[exception]: http://a.com/ "link title"\n' +
            '<!-- i18n-disable localize-links -->'
        );
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var resources = set.getAll();
        expect(resources.length).toBe(3);
        expect(resources[0].getSource()).toBe("Regular service will be <c0>available</c0>.");
        expect(resources[1].getSource()).toBe("http://a.com/");
        expect(resources[2].getSource()).toBe("link title");
    });

    test("MarkdownFileParseWithLinkReferenceToExtractedURLNotAfterTurnedOff", function() {
        expect.assertions(7);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            '- [Ask on Twitter][twitter]: For general questions and support.\n' +
            '- [Ask on Facebook][facebook]: For general questions and support.\n' +
            '\n' +
            '<!-- i18n-enable localize-links -->\n' +
            '[twitter]: https://twitter.com/OurPlatform\n' +
            '<!-- i18n-disable localize-links -->' +
            '[facebook]: http://www.facebook.com/OurPlatform\n'
        );
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(3);
        var resources = set.getAll();
        expect(resources.length).toBe(3);
        expect(resources[0].getSource()).toBe("<c0>Ask on Twitter</c0>: For general questions and support.");
        expect(resources[1].getSource()).toBe("<c0>Ask on Facebook</c0>: For general questions and support.");
        expect(resources[2].getSource()).toBe("https://twitter.com/OurPlatform");
    });

    test("MarkdownFileParseWithMultipleLinkReferenceWithText", function() {
        expect.assertions(8);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
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
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(4);
        var resources = set.getAll();
        expect(resources.length).toBe(4);
        expect(resources[0].getSource()).toBe("For developer support, please reach out to us via one of our channels:");
        expect(resources[1].getSource()).toBe("<c0>Ask on Twitter</c0>: For general questions and support.");
        expect(resources[2].getSource()).toBe("<c0>Ask in email</c0>: For specific questions and support.");
        expect(resources[3].getSource()).toBe("<c0>Ask on stack overflow</c0>: For community answers and support.");
    });

    test("MarkdownFileLocalizeReferenceLinksWithLinkId", function() {
        expect.assertions(3);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '- [Ask on Twitter][twitter]: For general questions and support.\n' +
            '\n' +
            '[twitter]: https://twitter.com/OurPlatform\n'
        );
        expect(mf).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r816306377',
            source: 'For developer support, please reach out to us via one of our channels:',
            target: 'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r293599939',
            source: '<c0>Ask on Twitter</c0>: For general questions and support.',
            target: '<c0>Auf Twitter stellen</c0>: Für allgemeine Fragen und Unterstützung.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        var actual = mf.localizeText(translations, "de-DE");
        var expected =
            'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:\n' +
            '\n' +
            '* [Auf Twitter stellen][twitter]: Für allgemeine Fragen und Unterstützung.\n' +
            '\n' +
            '[twitter]: https://twitter.com/OurPlatform\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeReferenceLinksWithoutLinkId", function() {
        expect.assertions(3);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '- [Ask on Twitter] For general questions and support.\n' +
            '\n' +
            '[Ask on Twitter]: https://twitter.com/OurPlatform\n'
        );
        expect(mf).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r816306377',
            source: 'For developer support, please reach out to us via one of our channels:',
            target: 'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1030328207',
            source: '<c0>Ask on Twitter</c0> For general questions and support.',
            target: '<c0>Auf Twitter stellen</c0> für allgemeine Fragen und Unterstützung.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        var actual = mf.localizeText(translations, "de-DE");
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

    test("MarkdownFileLocalizeReferenceLinksWithLinkTitle", function() {
        expect.assertions(3);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '- [Ask on Twitter][twitter] For general questions and support.\n' +
            '\n' +
            '<!-- i18n-enable localize-links -->\n' +
            '[twitter]: https://twitter.com/OurPlatform "Our Platform"\n' +
            '<!-- i18n-disable localize-links -->\n'
        );
        expect(mf).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r816306377',
            source: 'For developer support, please reach out to us via one of our channels:',
            target: 'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1030328207',
            source: '<c0>Ask on Twitter</c0> For general questions and support.',
            target: '<c0>Auf Twitter stellen</c0> für allgemeine Fragen und Unterstützung.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r85880207',
            source: 'https://twitter.com/OurPlatform',
            target: 'https://de.twitter.com/OurPlatform',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r504251007',
            source: 'Our Platform',
            target: 'Unsere Platformen',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        var actual = mf.localizeText(translations, "de-DE");
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

    test("MarkdownFileLocalizeDirectLinksTurnedOff", function() {
        expect.assertions(3);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '<!-- i18n-disable localize-links -->\n' +
            '\n' +
            '- [Ask on Twitter](https://twitter.com/OurPlatform) for general questions and support.\n'
        );
        expect(mf).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r816306377',
            source: 'For developer support, please reach out to us via one of our channels:',
            target: 'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r629827996',
            source: '<c0>Ask on Twitter</c0> for general questions and support.',
            target: '<c0>Auf Twitter stellen</c0> für allgemeine Fragen und Unterstützung.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r85880207',
            source: 'https://twitter.com/OurPlatform',
            target: 'https://de.twitter.com/OurPlatform',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        var actual = mf.localizeText(translations, "de-DE");
        var expected =
            'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:\n' +
            '\n' +
            '<!-- i18n-disable localize-links -->\n' +
            '\n' +
            '* [Auf Twitter stellen](https://twitter.com/OurPlatform) für allgemeine Fragen und Unterstützung.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeDirectLinksTurnedOn", function() {
        expect.assertions(3);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '<!-- i18n-enable localize-links -->\n' +
            '\n' +
            '- [Ask on Twitter](https://twitter.com/OurPlatform) for general questions and support.\n' +
            '\n' +
            '<!-- i18n-disable localize-links -->\n'
        );
        expect(mf).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r816306377',
            source: 'For developer support, please reach out to us via one of our channels:',
            target: 'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r629827996',
            source: '<c0>Ask on Twitter</c0> for general questions and support.',
            target: '<c0>Auf Twitter stellen</c0> für allgemeine Fragen und Unterstützung.',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r85880207',
            source: 'https://twitter.com/OurPlatform',
            target: 'https://de.twitter.com/OurPlatform',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        var actual = mf.localizeText(translations, "de-DE");
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

    test("MarkdownFileParseHTMLComments", function() {
        expect.assertions(5);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a <!-- comment -->test of the emergency parsing system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
    });

    test("MarkdownFileParseHTMLCommentsWithIndent", function() {
        expect.assertions(8);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency parsing system.\n  <!-- comment -->\nA second string\n');
        var set = mf.getTranslationSet();
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

    test("MarkdownFileLocalizeHTMLCommentsWithIndent", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency parsing system.\n  <!-- comment -->\nA second string\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r699762575',
            source: 'This is a test of the emergency parsing system.',
            target: 'This is a test of the emergency parsing system... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r772298159',
            source: 'A second string',
            target: 'A second string... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        var actual = mf.localizeText(translations, "de-DE");
        var expected =
            'This is a test of the emergency parsing system... in GERMAN!\n\n  <!-- comment -->\n\nA second string... in GERMAN!\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeTable", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
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
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r595024848',
            source: 'Returns column',
            target: 'Returns column... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r941132140',
            source: 'foo',
            target: 'foo... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r755240053',
            source: 'bar',
            target: 'bar... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        var actual = mf.localizeText(translations, "de-DE");
        var expected =
            "|                                 |                              |\n" +
            "| ------------------------------- | ---------------------------- |\n" +
            "| Query description... in GERMAN! | Returns column... in GERMAN! |\n" +
            "| foo... in GERMAN!               | bar... in GERMAN!            |\n";
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeTableWithInlineCode", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
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
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r595024848',
            source: 'Returns column',
            target: 'Returns column... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r941132140',
            source: 'foo',
            target: 'foo... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r755240053',
            source: 'bar',
            target: 'bar... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        var actual = mf.localizeText(translations, "de-DE");
        var expected =
            "|                                 |                              |\n" +
            "| ------------------------------- | ---------------------------- |\n" +
            "| Query description... in GERMAN! | Returns column... in GERMAN! |\n" +
            "| `code`                          | `more code`                  |\n" +
            "| foo... in GERMAN!               | bar... in GERMAN!            |\n";
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MarkdownFileLocalizeTableWithInlineCodeAndTextAfter", function() {
        expect.assertions(2);
        var mf = new MarkdownFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
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
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r595024848',
            source: 'Returns column',
            target: 'Returns column... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1037333769',
            source: 'Header Title',
            target: 'Header Title... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r521829558',
            source: 'Body text.',
            target: 'Body text... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "markdown"
        }));
        var actual = mf.localizeText(translations, "de-DE");
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

    test("MarkdownFileLocalizeFileFullyTranslatedFlag", function() {
        expect.assertions(3);
        // this subproject has the "fullyTranslated" flag set to true
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            markdown: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MarkdownFileType(p2);
        var mf = new MarkdownFile({
            project: p2,
            pathName: "./notrans.md",
            type: mdft2
        });
        expect(mf).toBeTruthy();
        // should read the file
        mf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        mf.localize(translations, ["fr-FR"]);
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

    test("MarkdownFileLocalizeFileFullyTranslatedFlagNoTranslations", function() {
        expect.assertions(3);
        // this subproject has the "fullyTranslated" flag set to true
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            markdown: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MarkdownFileType(p2);
        var mf = new MarkdownFile({
            project: p2,
            pathName: "./notrans.md",
            type: mdft2
        });
        expect(mf).toBeTruthy();
        // should read the file
        mf.extract();
        var translations = new TranslationSet();
        mf.localize(translations, ["fr-FR"]);
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

    test("MarkdownFileLocalizeFileFullyTranslatedFlagNotFullyTranslated", function() {
        expect.assertions(3);
        // this subproject has the "fullyTranslated" flag set to true
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            markdown: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MarkdownFileType(p2);
        var mf = new MarkdownFile({
            project: p2,
            pathName: "./notrans.md",
            type: mdft2
        });
        expect(mf).toBeTruthy();
        // should read the file
        mf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "markdown"
        }));
        mf.localize(translations, ["fr-FR"]);
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
});
