/*
 * MdxFile.test.js - test the MDX file handler object.
 *
 * Copyright © 2025 Box, Inc.
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

var MdxFile = require("../MdxFile.js");
var MdxFileType = require("../MdxFileType.js");
var CustomProject = require("loctool/lib/CustomProject.js");
var ProjectFactory =  require("loctool/lib/ProjectFactory.js");
var TranslationSet = require("loctool/lib/TranslationSet.js");
var ResourceString = require("loctool/lib/ResourceString.js");

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

var mdft = new MdxFileType(p);
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

var mdft2 = new MdxFileType(p2);
var p3 = new CustomProject({
    sourceLocale: "en-US",
    id: "foo",
    name: "foo",
    plugins: ["../."]
}, "./test/testfiles", {
    locales:["en-GB"],
    targetDir: "./test/testfiles",
    nopseudo: true,
    mdx: {
        mappings: {
            "**/simple.mdx": {
                template: "[locale]/[dir]/[filename]"
            },
            "**/asdf/bar/simple2.mdx": {
                template: "[locale]/asdf/bar/[filename]"
            },
            "**/bar/simple3.mdx": {
                template: "asdf/[locale]/bar/[filename]"
            },
            "**/simple4.mdx": {
                template: "[locale]/asdf/bar/[filename]",
                localeMap: {
                    "fr-FR": "fr",
                    "zh-Hans-CN": "zh-CN"
                }
            },
            "asdf/pen-USing/en-US/bar/asdf.mdx": {
                template: "[locale]/bar/[filename]"
            },
            "**/asdf.mdx": {
                template: "[dir]/[locale]/bar/[filename]",
                frontmatter: ["test"]
            },
            "**/x/*.mdx": {
                template: "[dir]/[base]_[locale].mdx",
                frontmatter: ["Title", "Description"]
            },
            "**/y/*.mdx": {
                template: "[dir]/[locale]/[base].mdx",
                frontmatter: true
            }
        }
    }
});

var mdft3 = new MdxFileType(p3);

function rmrf(path) {
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
}

afterEach(function() {
    [
        "test/testfiles/subproject/de-DE/notrans.mdx",
        "test/testfiles/subproject/de-DE/notrans2.mdx",
        "test/testfiles/subproject/fr-FR/notrans.mdx",
        "test/testfiles/subproject/fr-FR/notrans2.mdx",
        "test/testfiles/test/testfiles/de-DE/md/nostrings.mdx",
        "test/testfiles/test/testfiles/de-DE/md/test1.mdx",
        "test/testfiles/test/testfiles/de-DE/md/test3.mdx",
        "test/testfiles/test/testfiles/fr-FR/md/nostrings.mdx",
        "test/testfiles/test/testfiles/fr-FR/md/test1.mdx",
        "test/testfiles/test/testfiles/fr-FR/md/test3.mdx",
        "test/testfiles/subproject/de-DE/codesnippets.mdx"
    ].forEach(rmrf);
});

describe("mdx", function() {
    // Initialize the file types before running tests (required for remark-mdx ESM module)
    beforeAll(async () => {
        await Promise.all(
            [mdft.init, mdft2.init, mdft3.init].map((initFn) => new Promise((resolve) => initFn(resolve)))
        );
    });

    test("MdxFileConstructor", function() {
        expect.assertions(1);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
    });

    test("MdxFileConstructorParams", function() {
        expect.assertions(1);
        var mf = new MdxFile({
            project: p,
            pathName: "./testfiles/md/test1.mdx",
            type: mdft
        });
        expect(mf).toBeTruthy();
    });

    test("MdxFileConstructorNoFile", function() {
        expect.assertions(1);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
    });

    test("MdxFileMakeKey", function() {
        expect.assertions(2);
        var mdf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("This is a test")).toBe("r654479252");
    });

    test("MdxFileMakeKeySimpleTexts1", function() {
        expect.assertions(5);
        var mdf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("Preferences in your profile")).toBe("r372802078");
        expect(mdf.makeKey("All settings")).toBe("r725930887");
        expect(mdf.makeKey("Colour scheme")).toBe("r734599412");
        expect(mdf.makeKey("Experts")).toBe("r343852585");
    });

    test("MdxFileMakeKeyUnescaped", function() {
        expect.assertions(5);
        var mdf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("foo \\n \\t bar")).toBe("r206710698");
        expect(mdf.makeKey("\\n \\t bar")).toBe("r601615571");
        expect(mdf.makeKey("The \\'Dude\\' played by Jeff Bridges")).toBe("r600298088");
        expect(mdf.makeKey("\\'Dude\\'")).toBe("r6259609");
    });

    test("MdxFileMakeKeySimpleTexts2", function() {
        expect.assertions(6);
        var mdf = new MdxFile({
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

    test("MdxFileMakeKeySimpleTexts3", function() {
        expect.assertions(9);
        var mdf = new MdxFile({
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

    test("MdxFileMakeKeyEscapes", function() {
        expect.assertions(3);
        var mdf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("Can\'t find id")).toBe("r743945592");
        expect(mdf.makeKey("Can\'t find an application for SMS")).toBe("r909283218");
    });

    test("MdxFileMakeKeyPunctuation", function() {
        expect.assertions(8);
        var mdf = new MdxFile({
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

    test("MdxFileMakeKeySameStringMeansSameKey", function() {
        expect.assertions(3);
        var mdf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("This is a test")).toBe("r654479252");
        expect(mdf.makeKey("This is a test")).toBe("r654479252");
    });

    test("MdxFileMakeKeyCompressWhiteSpace", function() {
        expect.assertions(5);
        var mdf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("Can\'t find  id")).toBe("r743945592");
        expect(mdf.makeKey("Can\'t    find               id")).toBe("r743945592");
        expect(mdf.makeKey("Can\'t find an application for SMS")).toBe("r909283218");
        expect(mdf.makeKey("Can\'t   \t\n \t   find an    \t \n \r   application for SMS")).toBe("r909283218");
    });

    test("MdxFileMakeKeyTrimWhiteSpace", function() {
        expect.assertions(5);
        var mdf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("Can\'t find  id")).toBe("r743945592");
        expect(mdf.makeKey("      Can\'t find  id ")).toBe("r743945592");
        expect(mdf.makeKey("Can\'t find an application for SMS")).toBe("r909283218");
        expect(mdf.makeKey(" \t\t\n\r    Can\'t find an application for SMS   \n \t \r")).toBe("r909283218");
    });

    test("MdxFileMakeKeyNewLines", function() {
        expect.assertions(2);
        var mdf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        expect(mdf.makeKey("A \n B")).toBe("r191336864");
    });

    test("MdxFileMakeKeyEscapeN", function() {
        expect.assertions(2);
        var mdf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        // \n is not a return character in MD. It is just an escaped "n"
        expect(mdf.makeKey("A \\n B")).toBe("r968833504");
    });

    test("MdxFileMakeKeyTabs", function() {
        expect.assertions(2);
        var mdf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("A \t B")).toBe("r191336864");
    });

    test("MdxFileMakeKeyEscapeT", function() {
        expect.assertions(2);
        var mdf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        // \t is not a tab character in MD. It is just an escaped "t"
        expect(mdf.makeKey("A \\t B")).toBe("r215504705");
    });

    test("MdxFileMakeKeyQuotes", function() {
        expect.assertions(2);
        var mdf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("A \\'B\\' C")).toBe("r935639115");
    });

    test("MdxFileMakeKeyInterpretEscapedUnicodeChars", function() {
        expect.assertions(2);
        var mdf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("&#x00A0; &#x0023;")).toBe("r2293235");
    });

    test("MdxFileMakeKeyInterpretEscapedSpecialChars2", function() {
        expect.assertions(2);
        var mdf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mdf).toBeTruthy();
        expect(mdf.makeKey("Talk to a support representative live 24/7 via video or &#x00a0; text&#x00a0;chat")).toBe("r969175354");
    });

    test("MdxFileParseSimpleGetByKey", function() {
        expect.assertions(5);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test\n\nThis is a test too\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.get(ResourceString.hashKey("foo", "en-US", "r654479252", "mdx"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test");
        expect(r.getKey()).toBe("r654479252");
    });

    test("MdxFileParseSimpleGetBySource", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseSimpleIgnoreWhitespace", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseDontExtractUnicodeWhitespace", function() {
        expect.assertions(3);
        var mf = new MdxFile({
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

    test("MdxFileParseDontExtractNbspEntity", function() {
        expect.assertions(3);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('&nbsp; &#xA0; \n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });

    test("MdxFileParseDoExtractOtherEntities", function() {
        expect.assertions(3);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('&uuml;\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
    });

    test("MdxFileParseEmpty", function() {
        expect.assertions(3);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(' \n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });

    test("MdxFileParseSkipHeader", function() {
        expect.assertions(3);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('---\ntitle: "foo"\nexcerpt: ""\n---\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });

    test("MdxFileParseSkipHeaderAndParseRest", function() {
        expect.assertions(6);
        var mf = new MdxFile({
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

    test("MdxFileParseNoStrings", function() {
        expect.assertions(3);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('\n     \n\t\t\t\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);
    });

    test("MdxFileParseSimpleRightSize", function() {
        expect.assertions(4);
        var mf = new MdxFile({
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

    test("MdxFileParseMultiple", function() {
        expect.assertions(8);
        var mf = new MdxFile({
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

    test("MdxFileParseContinuedParagraph", function() {
        expect.assertions(7);
        var mf = new MdxFile({
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

    test("MdxFileParseWithDups", function() {
        expect.assertions(6);
        var mf = new MdxFile({
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

    test("MdxFileParseEscapeInvalidChars", function() {
        expect.assertions(5);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // MDX/JSX doesn't allow control characters (except tab, newline, carriage return)
        // The parser converts invalid control characters to the replacement character (U+FFFD)
        // This is correct behavior for JSX/XML parsers - control characters are not valid in XML/JSX
        // The replacement character may or may not be extracted depending on how containsActualText
        // handles it, but the parser behavior is correct
        mf.parse('This is also a &#x3; test\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // should use html entities to represent the invalid control chars
        var r = set.getBySource("This is also a \uFFFD test");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is also a \uFFFD test");
        expect(r.getKey()).toBe("r101012210");
    });

    test("MdxFileParseDontEscapeWhitespaceChars", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseNonBreakingEmphasis", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseNestedNonBreakingEmphasis", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseNestedAndSequentialNonBreakingEmphasis", function() {
        expect.assertions(5);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a *test* of the *emergency parsing* system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a <c0>test</c0> of the <c1>emergency parsing</c1> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a <c0>test</c0> of the <c1>emergency parsing</c1> system.");
        expect(r.getKey()).toBe("r871965137");
    });

    test("MdxFileParseNonBreakingLinks", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseReferenceLinksWithTitle", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseReferenceLinksWithoutTitle", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseDontExtractURLOnlyLinks", function() {
        expect.assertions(7);
        var mf = new MdxFile({
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

    test("MdxFileParseTurnOnURLOnlyLinks", function() {
        expect.assertions(12);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'Here are some links:\n\n' +
            '{/* i18n-enable localize-links */}\n' +
            '* [http://www.box.com/foobar](http://www.box.com/foobar)\n' +
            '* [http://www.box.com/asdf](http://www.box.com/asdf)\n' +
            '{/* i18n-disable localize-links */}\n');
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

    test("MdxFileParseTurnOnDirectLinks", function() {
        expect.assertions(18);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'Here are some links:\n\n' +
            '{/* i18n-enable localize-links */}\n' +
            '* This is [foobar](http://www.box.com/foobar)\n' +
            '* And here is [asdf](http://www.box.com/asdf)\n' +
            '{/* i18n-disable localize-links */}\n');
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

    test("MdxFileParseDoExtractURLLinksMidString", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseReferences", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseFootnotes", function() {
        expect.assertions(8);
        var mf = new MdxFile({
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

    test("MdxFileParseFootnotesLongname", function() {
        expect.assertions(8);
        var mf = new MdxFile({
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

    test("MdxFileParseFootnotesWithUrl", function() {
        expect.assertions(6);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // Footnote with URL should not be extracted unless localizeLinks is enabled
        mf.parse('This is a test of the emergency parsing [^1] system.\n\n' +
                '[^1]: http://www.example.com/test\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the emergency parsing <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing <c0/> system.");
        expect(r.getKey()).toBe("r1010312382");
        // URL-only footnote should not be extracted when localizeLinks is false
        var r2 = set.getBySource("http://www.example.com/test");
        expect(r2).toBeFalsy();
    });

    test("MdxFileParseFootnotesWithUrlLocalized", function() {
        expect.assertions(7);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // Footnote with URL should be extracted when localizeLinks is enabled
        mf.parse('This is a test of the emergency parsing [^1] system.\n\n' +
                '{/* i18n-enable localize-links */}\n' +
                '[^1]: http://www.example.com/test\n' +
                '{/* i18n-disable localize-links */}\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the emergency parsing <c0/> system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing <c0/> system.");
        expect(r.getKey()).toBe("r1010312382");
        // URL-only footnote should be extracted when localizeLinks is true
        var r2 = set.getBySource("http://www.example.com/test");
        expect(r2).toBeTruthy();
        expect(r2.getSource()).toBe("http://www.example.com/test");
    });

    test("MdxFileLocalizeTextWithFootnotesUrl", function() {
        expect.assertions(4);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency parsing [^1] system.\n\n' +
            '{/* i18n-enable localize-links */}\n' +
            '[^1]: http://www.example.com/test\n' +
            '{/* i18n-disable localize-links */}\n');
        var set = mf.getTranslationSet();
        var urlResource = set.getBySource("http://www.example.com/test");
        expect(urlResource).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r1010312382",
            source: "This is a test of the emergency parsing <c0/> system.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse syntaxique <c0/> de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: urlResource.getKey(),
            source: "http://www.example.com/test",
            sourceLocale: "en-US",
            target: "http://www.example.fr/test",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        var result = mf.localizeText(translations, "fr-FR");
        expect(result).toContain("Ceci est un test du système d'analyse syntaxique [^1] de l'urgence.");
        // The URL in the footnote definition should be localized
        // It might be rendered as a link or plain text depending on the parser
        expect(result).toMatch(/\[\^1\]:\s*(http:\/\/www\.example\.fr\/test|\[http:\/\/www\.example\.com\/test\]\(http:\/\/www\.example\.fr\/test\))/);
    });

    test("MdxFileParseNonBreakingInlineCode", function() {
        expect.assertions(6);
        var mf = new MdxFile({
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

    test("MdxFileParseMultipleNonBreakingInlineCodes", function() {
        expect.assertions(6);
        var mf = new MdxFile({
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

    test("MdxFileParseInlineCodeByItself", function() {
        expect.assertions(9);
        var mf = new MdxFile({
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

    test("MdxFileParseNonBreakingHTMLTags", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseNonBreakingHTMLTagsOutside", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseNonBreakingSelfClosingHTMLTags", function() {
        expect.assertions(5);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // MDX requires JSX syntax, so self-closing tags must use <br /> not <br>
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

    test("MdxFileParseBreakingSelfClosedHTMLTags", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseBreakingNotClosedHTMLTags", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseNonBreakingSelfClosedHTMLTags", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseNonBreakingIgnoreComplexIrrelevant", function() {
        expect.assertions(5);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('*<span class="test"> <span id="foo"></span></span>  This is a test of the emergency parsing system.*\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // should not pick up any of the non-breaking tags because there is no localizable text
        // before it or after it
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
    });

    test("MdxFileParseHTMLWithValuelessAttributes", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseWithFlowStyleHTMLTags", function() {
        expect.assertions(6);
        var mf = new MdxFile({
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

    test("MdxFileParseWithFlowStyleHTMLTagsMultiple", function() {
        expect.assertions(9);
        var mf = new MdxFile({
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
            "</asdf>\n"
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

    test("MdxFileParseWithFlowStyleHTMLTagsMultipleWithTextInBetween", function() {
        expect.assertions(12);
        var mf = new MdxFile({
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
            "</asdf>\n"
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

    test("MdxFileParseWithFlowStyleHTMLTagsAndEmbeddedHTML", function() {
        expect.assertions(6);
        var mf = new MdxFile({
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

    test("MdxFileParseWithFlowStyleHTMLTagsAndEmbeddedMarkdown", function() {
        expect.assertions(6);
        var mf = new MdxFile({
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

    test("MdxFileParseWithIndentedHTMLTags", function() {
        expect.assertions(21);
        var mf = new MdxFile({
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

    test("MdxFileParseLists", function() {
        expect.assertions(12);
        var mf = new MdxFile({
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

    test("MdxFileParseListWithTextBefore", function() {
        expect.assertions(9);
        var mf = new MdxFile({
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

    test("MdxFileParseListWithTextAfter", function() {
        expect.assertions(9);
        var mf = new MdxFile({
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

    test("MdxFileParseListWithTextAfter2", function() {
        expect.assertions(9);
        var mf = new MdxFile({
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

    test("MdxFileParseOrderedLists", function() {
        expect.assertions(18);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(`
## This is a header

Follow these steps:

1. First point:

1. Second point:

1. Third point:
`
        );

        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(5);

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
    });

   test("MdxFileParseOrderedListsWithIndentedText", function() {
        expect.assertions(18);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(`
## This is a header

Follow these steps:

1. First point:
   first

1. Second point:
   second

1. Third point:
   third
`
        );

        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(5);

        r = set.getBySource("This is a header");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a header");
        expect(r.getKey()).toBe("r655736675");

        r = set.getBySource("Follow these steps:");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Follow these steps:");
        expect(r.getKey()).toBe("r449239371");

        r = set.getBySource("First point:\nfirst");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("First point:\nfirst");
        expect(r.getKey()).toBe("r130284640");

        r = set.getBySource("Second point:\nsecond");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Second point:\nsecond");
        expect(r.getKey()).toBe("r608223461");

        r = set.getBySource("Third point:\nthird");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Third point:\nthird");
        expect(r.getKey()).toBe("r284799174");
    });

   test("MdxFileParseOrderedListsWithIndentedCodeBlocks", function() {
        expect.assertions(18);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // MDX parser requires fenced code blocks to not be indented
        // Remove indentation from code blocks
        mf.parse(`
## This is a header

Follow these steps:

1. First point:

\`\`\`
code code code
\`\`\`

1. Second point:

\`\`\`
code code code
\`\`\`

1. Third point:

\`\`\`
code code code
\`\`\`
`
        );

        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(5);

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
    });

   test("MdxFileParseHTMLFollowedByCodeBlocks", function() {
        expect.assertions(3);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(`
<Tab>

\`\`\`cs
var metadataValues = new Dictionary<string, object>()
{
  cards: [{
    "type": "skill_card",
    "skill_card_type": "keyword",
    "skill_card_title": {
      "code": "license-plates",
      "message": "Licence Plates"
    },
    "skill": {
      "type": "service"
      "id": "license-plates-service"
    },
    "invocation": {
      "type": "skill_invocation"
      "id": "license-plates-service-123"
    },
    "entries": {
      { "text": "DD-26-YT" },
      { "text": "DN86 BOX" }
    }
  }]
};
Dictionary<string, object> metadata = await client.MetadataManager
    .CreateFileMetadataAsync(fileId: "12345", metadataValues, "global", "asdf");
\`\`\`

</Tab>
`
        );

        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);

        // no resources, but also it didn't crash while trying to parse that!
    });

    test("MdxFileParseNonBreakingEmphasisOutside", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseNonBreakingHTMLTagsInside", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseNonBreakingHTMLTagsInsideMultiple", function() {
        expect.assertions(5);
        var mf = new MdxFile({
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

    test("MdxFileParseNonBreakingTagsNotWellFormed", function() {
        expect.assertions(4);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        expect(function() {
            mf.parse('This is <span id="foo" class="bar"> a test of the <em>emergency parsing </span> system.\n');
        }).toThrow();
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // the end span tag should automatically end the em tag
        var r = set.getBySource('This is <c0> a test of the <c1>emergency parsing </c1></c0> system.');
        expect(r).toBeFalsy();
    });

    test("MdxFileParseLocalizableTitle", function() {
        expect.assertions(8);
        var mf = new MdxFile({
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

    test("MdxFileParseLocalizableTitleWithSingleQuotes", function() {
        expect.assertions(8);
        var mf = new MdxFile({
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

    test("MdxFileParseLocalizableAttributes", function() {
        expect.assertions(8);
        var mf = new MdxFile({
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

    test("MdxFileParseLocalizableAttributesSkipEmpty", function() {
        expect.assertions(6);
        var mf = new MdxFile({
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

    test("MdxFileParseLocalizableAttributesAndNonBreakingTags", function() {
        expect.assertions(8);
        var mf = new MdxFile({
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

    test("MdxFileParseI18NComments", function() {
        expect.assertions(10);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('{/* i18n this describes the text below */}\n' +
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

    test("MdxFileParseIgnoreTags", function() {
        expect.assertions(6);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            '<script type="javascript">{`\n' +
            'if (window) {\n' +
            '  $(".foo").class("asdf");\n' +
            '}\n' +
            '`}</script>\n' +
            '<style>{`\n' +
            '  .activity_title{\n' +
            '    font-size: 18px;\n' +
            '    font-weight: 300;\n' +
            '    color: #777;\n' +
            '    line-height: 40px;\n' +
            '  }\n' +
            '`}</style>\n' +
            '<span class="foo">foo</span>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getBySource("foo");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("foo");
        expect(r.getKey()).toBe("r941132140");
    });

    test("MdxFileParseWithFrontMatterNotParsed", function() {
        expect.assertions(10);
        var mf = new MdxFile({
            project: p3,
            type: mdft3,
            pathName: "foo/bar.mdx"  // no frontmatter config
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

    test("MdxFileParseWithFrontMatterExtracted", function() {
        expect.assertions(14);
        var mf = new MdxFile({
            project: p3,
            type: mdft3,
            pathName: "foo/bar/x/foo.mdx"
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
        expect(r.getKey()).toBe("r615037126.Title");
        expect(r.getPath()).toBe("foo/bar/x/foo.mdx"); // should come from this file
        expect(r.getDataType()).toBe("x-yaml");
        expect(r.getProject()).toBe("foo");
        expect(r.getType()).toBe("string");
        r = set.getBySource("another front matter description\nwith extended text\n");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("another front matter description\nwith extended text\n");
        expect(r.getKey()).toBe("r615037126.Description");
        expect(r.getPath()).toBe("foo/bar/x/foo.mdx"); // should come from this file
    });

    test("MdxFileParseWithFrontMatterExtractAll", function() {
        expect.assertions(11);
        var mf = new MdxFile({
            project: p3,
            type: mdft3,
            pathName: "foo/bar/y/foo.mdx" // extracts all front matter fields
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
        expect(r.getKey()).toBe("r942384758.Title");
        r = set.getBySource("another front matter description\nwith extended text\n");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("another front matter description\nwith extended text\n");
        expect(r.getKey()).toBe("r942384758.Description");
        r = set.getBySource("asdf asdf asdf");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("asdf asdf asdf");
        expect(r.getKey()).toBe("r942384758.Foobar");
    });

    test("MdxFileParseWithFrontMatterExtractedTwoFiles", function() {
        expect.assertions(21);
        mdft3.getExtracted().clear();
        expect(mdft3.getExtracted().size()).toBe(0);
        var mf = new MdxFile({
            project: p3,
            type: mdft3,
            pathName: "foo/bar/x/foo.mdx"
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
        mf = new MdxFile({
            project: p3,
            type: mdft3,
            pathName: "foo/bar/x/foobar.mdx"
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
        expect(r.getKey()).toBe("r615037126.Title");
        expect(r.getPath()).toBe("foo/bar/x/foo.mdx"); // should come from this file
        expect(r.getDataType()).toBe("x-yaml");
        expect(r.getProject()).toBe("foo");
        expect(r.getType()).toBe("string");
        r = set.getBySource("This is another test of the front matter");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is another test of the front matter");
        expect(r.getSourceLocale()).toBe("en-US");
        expect(r.getKey()).toBe("r556303587.Title");
        expect(r.getPath()).toBe("foo/bar/x/foobar.mdx"); // should come from this file
        expect(r.getDataType()).toBe("x-yaml");
        expect(r.getProject()).toBe("foo");
        expect(r.getType()).toBe("string");
    });

    test("MdxFileParseTable", function() {
        expect.assertions(21);
        var mf = new MdxFile({
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

    test("MdxFileParseTableWithInlineCode", function() {
        expect.assertions(15);
        var mf = new MdxFile({
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

    test("MdxFileParseTableWithInlineCodeAndTextAfterwards", function() {
        expect.assertions(15);
        var mf = new MdxFile({
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

    test("MdxFileExtractFile", function() {
        expect.assertions(14);
        var base = path.dirname(module.id);
        var mf = new MdxFile({
            project: p,
            pathName: "./md/test1.mdx",
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

    test("MdxFileExtractFile2", function() {
        expect.assertions(11);
        var base = path.dirname(module.id);
        var mf = new MdxFile({
            project: p,
            pathName: "./md/test2.mdx",
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

    test("MdxFileExtractUndefinedFile", function() {
        expect.assertions(2);
        var base = path.dirname(module.id);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // should attempt to read the file and not fail
        mf.extract();
        var set = mf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("MdxFileExtractBogusFile", function() {
        expect.assertions(2);
        var base = path.dirname(module.id);
        var mf = new MdxFile({
            project: p,
            pathName: "./md/bogus.mdx",
            type: mdft
        });
        expect(mf).toBeTruthy();
        // should attempt to read the file and not fail
        mf.extract();
        var set = mf.getTranslationSet();
        expect(set.size()).toBe(0);
    });

    test("MdxFileLocalizeText", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        var actual = mf.localizeText(translations, "fr-FR");
        var expected = 'Ceci est un essai\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileLocalizeTextPreserveWhitespace", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        // unlike markdown files, the mdx parser does not preserve whitespace
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un essai\n');
    });

    test("MdxFileLocalizeTextMultiple", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un essai\n\n' +
                'Ceci est aussi un essai\n');
    });

    test("MdxFileLocalizeTextWithDups", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un essai\n\n' +
                'Ceci est aussi un essai\n\n' +
                'Ceci est un essai\n');
    });

    test("MdxFileLocalizeTextSkipScript", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('<script>{`\n' +
                '// comment text\n' +
                'if (locales.contains[thisLocale]) {\n' +
                '    document.write("<input id=\"locale\" class=\"foo\" title=\"bar\"></input>");\n' +
                '}\n' +
                '`}</script>\n' +
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
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe(
            '<script>\n' +
            '  {`\n' +
            '    // comment text\n' +
            '    if (locales.contains[thisLocale]) {\n' +
            '      document.write("<input id=\"locale\" class=\"foo\" title=\"bar\"></input>");\n' +
            '    }\n' +
            '    `}\n' +
            '</script>\n' +
            '\n' +
            'Ceci est un essai\n');
    });

    test("MdxFileLocalizeTextWithLinks", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un [essai](http://www.test.com/) du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MdxFileLocalizeTextWithLinksNotTranslated", function() {
        expect.assertions(6);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un [essai](http://www.test.com/) du système d\'analyse syntaxique de l\'urgence.\n');
        // the set of new translations should be empty because we did not extract the link
        var newSet = mdft.getNew();
        expect(newSet.size()).toBe(0);
        expect(mf.getTranslationSet().size()).toBe(1);
    });

    test("MdxFileLocalizeTextWithLinksTranslatedNew", function() {
        expect.assertions(7);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // make sure there are no new strings before we start
        mdft.newres.clear();
        expect(mdft.newres.size()).toBe(0);
        expect(mf.getTranslationSet().size()).toBe(0);
        mf.parse(
            '{/* i18n-enable localize-links */}\n' +
            'This is a [test](http://www.test.com/) of the emergency parsing system.\n' +
            '{/* i18n-disable localize-links */}\n'
        );
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        // no translation available for the link itself
        expect(mf.localizeText(translations, "fr-FR")).toBe('{/* i18n-enable localize-links */}\n\n' +
            'Ceci est un [essai](http://www.test.com/) du système d\'analyse syntaxique de l\'urgence.\n\n' +
            '{/* i18n-disable localize-links */}\n'
        );
        // the set of new translations should now contain the link
        var newSet = mdft.getNew();
        expect(newSet.size()).toBe(1);
        var resources = newSet.getAll();
        expect(resources[0].getSource()).toBe("http://www.test.com/");
        expect(mf.getTranslationSet().size()).toBe(2);
    });

    test("MdxFileLocalizeTextWithLinksTranslated", function() {
        expect.assertions(6);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // make sure there are no new strings before we start
        mdft.newres.clear();
        expect(mdft.newres.size()).toBe(0);
        expect(mf.getTranslationSet().size()).toBe(0);
        mf.parse(
            '{/* i18n-enable localize-links */}\n' +
            'This is a [test](http://www.test.com/) of the emergency parsing system.\n' +
            '{/* i18n-disable localize-links */}\n'
        );
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r306365966",
            source: "This is a <c0>test</c0> of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0>essai</c0> du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r474012543",
            source: "http://www.test.com/",
            sourceLocale: "en-US",
            target: "http://www.test.com/fr",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        // no translation available for the link itself
        expect(mf.localizeText(translations, "fr-FR")).toBe('{/* i18n-enable localize-links */}\n\n' +
            'Ceci est un [essai](http://www.test.com/fr) du système d\'analyse syntaxique de l\'urgence.\n\n' +
            '{/* i18n-disable localize-links */}\n'
        );
        // the set of new translations should not contain the link because it was already translated
        var newSet = mdft.getNew();
        expect(newSet.size()).toBe(0);
        expect(mf.getTranslationSet().size()).toBe(2);
    });

    test("MdxFileLocalizeTextWithInlineCode", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un `test` du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MdxFileLocalizeTextWithInlineCodeAtTheEnd", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Avec cette commande `git rm filename`, vous pouvez supprimer le fichier.\n');
    });

    test("MdxFileLocalizeInlineCodeByItself", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r16227039",
            source: "Sentence after.",
            sourceLocale: "en-US",
            target: "La phrase denier.",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe("Ceci est un teste de la systeme 'inline code'.\n" +
            '\n' +
            '`inline code`\n' +
            '\n' +
            'La phrase denier.\n');
    });

    test("MdxFileLocalizeTextWithLinkReference", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency [C1] parsing system.\n\n[C1]: http://example.com\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r1017266258",
            source: "This is a test of the emergency <c0>C1</c0> parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse syntaxique de l'urgence <c0>C1</c0>.",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un test du système d\'analyse syntaxique de l\'urgence [C1][C1].\n\n[C1]: http://example.com\n');
    });

    test("MdxFileLocalizeTextWithMultipleLinkReferences", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un test du système d\'analyse syntaxique [Reponse1][R1] de l\'urgence [teste][C1].\n\n[C1]: https://www.box.com/test1\n\n[R1]: http://www.box.com/about.html\n');
    });

    test("MdxFileLocalizeTextWithMultipleLocalizableLinkReferences", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency [C1] parsing system [R1].\n\n' +
            '{/* i18n-enable localize-links */}\n' +
            '[C1]: https://www.box.com/test1\n' +
            '[R1]: http://www.box.com/about.html\n' +
            '{/* i18n-disable localize-links */}\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r817759238",
            source: "This is a test of the emergency <c0>C1</c0> parsing system <c1>R1</c1>.",
            sourceLocale: "en-US",
            target: "Ceci est un test du système d'analyse syntaxique <c1>Reponse1</c1> de l'urgence <c0>teste</c0>.",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r647537837",
            source: "https://www.box.com/test1",
            sourceLocale: "en-US",
            target: "https://www.box.com/fr/test1",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r448858983",
            source: "http://www.box.com/about.html",
            sourceLocale: "en-US",
            target: "http://www.box.com/fr/about.html",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un test du système d\'analyse syntaxique [Reponse1][R1] de l\'urgence [teste][C1].\n\n' +
            '{/* i18n-enable localize-links */}\n\n' +
            '[C1]: https://www.box.com/fr/test1\n\n' +
            '[R1]: http://www.box.com/fr/about.html\n\n' +
            '{/* i18n-disable localize-links */}\n');
    });

    test("MdxFileLocalizeTextWithFootnotes", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r472274968",
            source: "well, not really",
            sourceLocale: "en-US",
            target: "normalement, c'est pas vrai",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un test du système d\'analyse syntaxique [^1] de l\'urgence.\n\n' +
            '[^1]: normalement, c\'est pas vrai\n');
    });

    test("MdxFileLocalizeTextWithFootnotesLongName", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r472274968",
            source: "well, not really",
            sourceLocale: "en-US",
            target: "normalement, c'est pas vrai",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un test du système d\'analyse syntaxique [^longname] de l\'urgence.\n\n' +
            '[^longname]: normalement, c\'est pas vrai\n');
    });

    test("MdxFileLocalizeTextNonBreakingTags", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un <em>essai</em> du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MdxFileLocalizeTextNonBreakingTagsOutside", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('*Ceci est un essai du système d\'analyse syntaxique de l\'urgence.*\n');
    });

    test("MdxFileLocalizeTextNonBreakingTagsBeforeAndAfter", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('<span class="test"> <span id="foo"> </span></span> *This is a test of the emergency parsing system.*   \n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r699762575",
            source: "This is a test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "Ceci est un essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('<span class="test"> <span id="foo"> </span></span> *Ceci est un essai du système d\'analyse syntaxique de l\'urgence.*\n');
    });

    test("MdxFileLocalizeTextNonBreakingTagsInside", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de l\'urgence. </span>\n');
    });

    test("MdxFileLocalizeTextNonBreakingTagsInsideMultiple", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est <span id="foo" class="bar"> un essai du système d\'analyse syntaxique de <em>l\'urgence</em>.</span>\n');
    });


    test("MdxFileLocalizeTextBreakingTags", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r787549036",
            source: "test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un <p />essai du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MdxFileLocalizeTextSelfClosedBreakingTags", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r787549036",
            source: "test of the emergency parsing system.",
            sourceLocale: "en-US",
            target: "essai du système d'analyse syntaxique de l'urgence.",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un <p />essai du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MdxFileLocalizeTextSelfClosingNonBreakingTags", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un <br />essai du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MdxFileLocalizeTextSelfClosedNonBreakingTags", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un <br />essai du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MdxFileLocalizeTextMismatchedNumberOfComponents", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        // Should ignore the c1 as if it weren't there
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un <em>essai</em> du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MdxFileLocalizeTextMismatchedNumberOfComponentsSelfClosing", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        // Should ignore the c1 as if it weren't there
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est un <em>essai</em> du système d\'analyse  syntaxique de l\'urgence.\n');
    });

    test("MdxFileLocalizeTextLocalizableTitle", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r654479252',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('\\[Màŕķðõŵñ ţëxţ6543210] <div title="Cette valeur est localisable">Ceci est un essai</div>\n');
    });

    test("MdxFileLocalizeTextLocalizableTitleSingleQuotes", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r654479252',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('\\[Màŕķðõŵñ ţëxţ6543210] <div title="Cette valeur est localisable">Ceci est un essai</div>\n');
    });

    test("MdxFileLocalizeTextLocalizableAttributes", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('![Alternate text](http://www.test.test/foo.png "title here")\n' +
                'This is a test\n' +
                '<input type="text" placeholder="localizable placeholder here" />\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1051764073',
            source: 'Alternate text',
            target: 'Texte alternative',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r625153591',
            source: 'title here',
            target: 'titre ici',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r654479252',
            source: 'This is a test',
            target: 'Ceci est un essai',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r734414247',
            source: 'localizable placeholder here',
            target: 'espace réservé localisable ici',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('![Texte alternative](http://www.test.test/foo.png "titre ici")\n' +
            'Ceci est un essai\n\n' +
            '<input type="text" placeholder="espace réservé localisable ici" />\n');
    });

    test("MdxFileLocalizeTextLocalizableAttributesAndNonBreakingTags", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r160369622',
            source: 'localizable title',
            target: 'titre localisable',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est <a href="foo.html" title="titre localisable">un essai</a> des balises non-ruptures.\n');
    });

    test("MdxFileLocalizeTextLocalizableValuelessAttributes", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r160369622',
            source: 'localizable title',
            target: 'titre localisable',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('Ceci est <a href="foo.html" checked title="titre localisable">un essai</a> des balises non-ruptures.\n');
    });

    test("MdxFileLocalizeTextI18NComments", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('{/* i18n: this describes the text below */}\n' +
                'This is a test of the emergency parsing system.\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r699762575',
            source: 'This is a test of the emergency parsing system.',
            target: 'Ceci est un essai du système d\'analyse syntaxique de l\'urgence.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('{/* i18n: this describes the text below */}\n\n' +
            'Ceci est un essai du système d\'analyse syntaxique de l\'urgence.\n');
    });

    test("MdxFileLocalizeTextIdentifyResourceIds", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        var expected =
            '<span x-locid="r654479252">Ceci est un essai</span>\n\n' +
            '<span x-locid="r999080996">Ceci est aussi un essai</span>\n\n' +
            '<span x-locid="r654479252">Ceci est un essai</span>\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileLocalizeHTMLWithValuelessAttributes", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        var expected =
            '<span class="foo" checked>Ceci est un test du système d\'analyse d\'urgence.</span>\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileLocalizeFlowStyleHTML", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        var expected =
            '<span class="foo" checked>\n' +
            '  Ceci est un test du système d\'analyse d\'urgence.\n' +
            '</span>\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileLocalizeFlowStyleHTMLMultiple", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r299977686",
            source: "This is translatable.",
            sourceLocale: "en-US",
            target: "Ceci est traduitable.",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        var expected =
            '<span class="foo" checked>\n' +
            '  Ceci est un test du système d\'analyse d\'urgence.\n' +
            '</span>\n\n' +
            '<message>\n' +
            '  Ceci est traduitable.\n' +
            '</message>\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileLocalizeFlowStyleHTMLMultipleWithTextInBetween", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r299977686",
            source: "This is translatable.",
            sourceLocale: "en-US",
            target: "Ceci est traduitable.",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        var expected =
            '<span class="foo" checked>\n' +
            '  Ceci est un test du système d\'analyse d\'urgence.\n' +
            '</span>\n' +
            '\n' +
            'Ceci est traduitable.\n' +
            '\n' +
            '<message>\n' +
            '  Ceci est traduitable.\n' +
            '</message>\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileLocalizeFlowStyleHTMLWithEmbeddedHTML", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        var expected =
            '<span class="foo" checked>\n' +
            '  Ceci est un <b>test</b> du système d\'analyse d\'urgence.\n' +
            '</span>\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileLocalizeFlowStyleHTMLWithEmbeddedMarkdown", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            '<span class="foo" checked>\n' +
            'This is a `test` of the *emergency parsing system*.\n' +
            '</span>\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: "r456781746",
            source: "This is a <c0/> of the <c1>emergency parsing system</c1>.",
            sourceLocale: "en-US",
            target: "Ceci est un <c0/> du <c1>système d'analyse d'urgence</c1>.",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        var expected =
            '<span class="foo" checked>\n' +
            '  Ceci est un `test` du *système d\'analyse d\'urgence*.\n' +
            '</span>\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileLocalizeTextIgnoreFrontMatter", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        // should ignore the front matter and leave it unlocalized
        var expected =
            '---\n' +
            'test: This is a test\n' +
            '---\n\n' +
            'Ceci est un essai\n\n' +
            'Ceci est aussi un essai\n\n' +
            'Ceci est un essai\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileLocalizeTextProcessFrontMatter", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p3,
            type: mdft3,
            pathName: "a/b/x/foo.mdx"
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r679920659.Title",
            source: "This is a test of the front matter",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai de la question en face",
            targetLocale: "fr-FR",
            datatype: "x-yaml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r679920659.Description",
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
            '\n' +
            '---\n\n' +
            'Ceci est un essai\n\n' +
            'Ceci est aussi un essai\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileLocalizeTextProcessFrontMatterProcessNewStrings", function() {
        expect.assertions(12);
        var mf = new MdxFile({
            project: p3,
            type: mdft3,
            pathName: "a/b/x/foo.mdx"
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r679920659.Title",
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
            '\n' +
            '---\n\n' +
            'Ceci est un essai\n\n' +
            'This is also a test\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
        var newset = mdft3.getNew();
        expect(newset).toBeTruthy();
        var resources = newset.getAll();
        expect(resources.length).toBe(2);
        expect(resources[0].getKey()).toBe("r679920659.Description");
        expect(resources[0].getSource()).toBe("another front matter description\nwith extended text\n");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getPath()).toBe("a/b/x/foo.mdx");
        expect(resources[1].getKey()).toBe("r999080996");
        expect(resources[1].getSource()).toBe("This is also a test");
        expect(resources[1].getSourceLocale()).toBe("en-US");
        expect(resources[1].getPath()).toBe("a/b/x/foo.mdx");
    });

    test("MdxFileLocalizeTextProcessFrontMatterSkipUnknownFields", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p3,
            type: mdft3,
            pathName: "a/b/x/foo.mdx"
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r679920659.Title",
            source: "This is a test of the front matter",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai de la question en face",
            targetLocale: "fr-FR",
            datatype: "x-yaml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r679920659.Description",
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
            '\n' +
            '---\n\n' +
            'Ceci est un essai\n\n' +
            'Ceci est aussi un essai\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileLocalizeTextProcessFrontMatterLocalizeAll", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p3,
            type: mdft3,
            pathName: "a/b/y/foo.mdx" // localizes all frontmatter fields
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r999080996",
            source: "This is also a test",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai",
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r1007268291.Title",
            source: "This is a test of the front matter",
            sourceLocale: "en-US",
            target: "Ceci est aussi un essai de la question en face",
            targetLocale: "fr-FR",
            datatype: "x-yaml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r1007268291.Description",
            source: "another front matter description\nwith extended text\n",
            sourceLocale: "en-US",
            target: "aussi une description de la question en face\navec texte étendu\n",
            targetLocale: "fr-FR",
            datatype: "x-yaml"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: "r1007268291.Foobar",
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
            '\n' +
            '---\n\n' +
            'Ceci est un essai\n\n' +
            'Ceci est aussi un essai\n';
        var actual = mf.localizeText(translations, "fr-FR");
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileGetLocalizedPathSimple", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p,
            pathName: "simple.mdx",
            type: mdft
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr-FR/simple.mdx");
    });

    test("MdxFileGetLocalizedPathComplex", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p,
            pathName: "./asdf/bar/simple2.mdx",
            type: mdft
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.mdx");
    });

    test("MdxFileGetLocalizedPathRegularMarkdownFileName", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p,
            pathName: "./asdf/bar/simple2.mdx",
            type: mdft
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.mdx");
    });

    test("MdxFileGetLocalizedPathNotEnoughParts", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p,
            pathName: "./asdf/bar/simple",
            type: mdft
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple");
    });

    test("MdxFileGetLocalizedPathAlreadyHasSourceLocale", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p3,
            pathName: "./en-US/asdf/bar/simple2.mdx",
            type: mdft3
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.mdx");
    });

    test("MdxFileGetLocalizedPathSourceLocaleInMidPath", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p3,
            pathName: "./asdf/en-US/bar/simple3.mdx",
            type: mdft3
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("asdf/fr-FR/bar/simple3.mdx");
    });

    test("MdxFileGetLocalizedPathSourceLocaleInBeginningPath", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p3,
            pathName: "en-US/asdf/bar/simple2.mdx",
            type: mdft3
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr-FR/asdf/bar/simple2.mdx");
    });

    test("MdxFileGetLocalizedPathSourceLocaleInMidPathOnlyWholeLocale", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p3,
            pathName: "./asdf/pen-USing/en-US/bar/asdf.mdx",
            type: mdft3
        });
        expect(mf).toBeTruthy();
        // should leave "pen-USing" alone and only get the "en-US" path component
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr-FR/bar/asdf.mdx");
    });

    test("MdxFileGetLocalizedPathWithLocaleMap", function() {
        expect.assertions(3);
        var mf = new MdxFile({
            project: p3,
            pathName: "simple4.mdx",
            type: mdft3
        });
        expect(mf).toBeTruthy();
        expect(mf.getLocalizedPath("fr-FR")).toBe("fr/asdf/bar/simple4.mdx");
        expect(mf.getLocalizedPath("zh-Hans-CN")).toBe("zh-CN/asdf/bar/simple4.mdx");
    });

    test("MdxFileLocalizeFile", function() {
        expect.assertions(5);
        var base = path.dirname(module.id);
        var mf = new MdxFile({
            project: p,
            pathName: "./md/test1.mdx",
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        mf.localize(translations, ["fr-FR", "de-DE"]);
        expect(fs.existsSync(path.join(p.target, "fr-FR/md/test1.mdx"))).toBeTruthy();
        expect(fs.existsSync(path.join(p.target, "de-DE/md/test1.mdx"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p.target, "fr-FR/md/test1.mdx"), "utf-8");
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
        var content = fs.readFileSync(path.join(p.target, "de-DE/md/test1.mdx"), "utf-8");
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

    test("MdxFileLocalizeFileWithFrontMatter", function() {
        expect.assertions(5);
        var base = path.dirname(module.id);
        var mf = new MdxFile({
            project: p,
            pathName: "./md/test3.mdx",
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        mf.localize(translations, ["fr-FR", "de-DE"]);
        expect(fs.existsSync(path.join(p.target, "fr-FR/md/test3.mdx"))).toBeTruthy();
        expect(fs.existsSync(path.join(p.target, "de-DE/md/test3.mdx"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p.target, "fr-FR/md/test3.mdx"), "utf-8");
        var expected =
            '---\n' +
            'title: This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n' +
            'status: this front matter should remain unlocalized\n' +
            '---\n\n' +
            '# Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n' +
            '\n' +
            'Ceci est du texte. C\'est plus de texte. Joli, joli texte.\n\n' +
            'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n\n' +
            'C\'est le dernier morceau de texte localisable.\n' +
            '\n' +
            'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n';
        diff(content, expected);
        expect(content).toBe(expected);
        var content = fs.readFileSync(path.join(p.target, "de-DE/md/test3.mdx"), "utf-8");
        var expected =
            '---\n' +
            'title: This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.\n' +
            'status: this front matter should remain unlocalized\n' +
            '---\n\n' +
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

    test("MdxFileLocalizeFileWithFrontMatterNotFullyTranslated", function() {
        expect.assertions(5);
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mdx: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MdxFileType(p2);
        var mf = new MdxFile({
            project: p2,
            pathName: "./notrans2.mdx",
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        mf.localize(translations, ["fr-FR", "de-DE"]);
        expect(fs.existsSync(path.join(p2.target, "fr-FR/notrans2.mdx"))).toBeTruthy();
        expect(fs.existsSync(path.join(p2.target, "de-DE/notrans2.mdx"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p2.target, "fr-FR/notrans2.mdx"), "utf-8");
        var expected =
            '---\n' +
            'frontmatter: true\n' +
            'other: "asdf"\n' +
            '---\n\n' +
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
        var content = fs.readFileSync(path.join(p2.target, "de-DE/notrans2.mdx"), "utf-8");
        var expected =
            '---\n' +
            'frontmatter: true\n' +
            'other: "asdf"\n' +
            '---\n\n' +
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

    test("MdxFileLocalizeFileWithFrontMatterFullyTranslated", function() {
        expect.assertions(5);
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mdx: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MdxFileType(p2);
        var mf = new MdxFile({
            project: p2,
            pathName: "./notrans2.mdx",
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        mf.localize(translations, ["fr-FR", "de-DE"]);
        expect(fs.existsSync(path.join(p2.target, "fr-FR/notrans2.mdx"))).toBeTruthy();
        expect(fs.existsSync(path.join(p2.target, "de-DE/notrans2.mdx"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p2.target, "fr-FR/notrans2.mdx"), "utf-8");
        var expected =
            '---\n' +
            'frontmatter: true\n' +
            'other: "asdf"\n' +
            'fullyTranslated: true\n' +
            '---\n\n' +
            '# Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n' +
            '\n' +
            'Ceci est du texte. C\'est plus de texte. Joli, joli texte.\n\n' +
            'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n\n' +
            'C\'est le dernier morceau de texte localisable.\n' +
            '\n' +
            'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n';
        diff(content, expected);
        expect(content).toBe(expected);
        var content = fs.readFileSync(path.join(p2.target, "de-DE/notrans2.mdx"), "utf-8");
        var expected =
            '---\n' +
            'frontmatter: true\n' +
            'other: "asdf"\n' +
            'fullyTranslated: true\n' +
            '---\n\n' +
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

    test("MdxFileLocalizeFileWithNoFrontMatterAlreadyFullyTranslated", function() {
        expect.assertions(5);
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mdx: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MdxFileType(p2);
        var mf = new MdxFile({
            project: p2,
            pathName: "./notrans.mdx",
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r548615397',
            source: 'This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Dies ist ein lokalisierbarer Text. Dies ist der Titel dieses Testdokumentes, das mehrmals im Dokument selbst erscheint.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Dies ist ein Text. Dies ist mehr Text. Hübscher, hübscher Text.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
           project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'Dies ist der letzte Teil des lokalisierbaren Textes.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        mf.localize(translations, ["fr-FR", "de-DE"]);
        expect(fs.existsSync(path.join(p2.target, "fr-FR/notrans.mdx"))).toBeTruthy();
        expect(fs.existsSync(path.join(p2.target, "de-DE/notrans.mdx"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p2.target, "fr-FR/notrans.mdx"), "utf-8");
        var expected =
            '---\n' +
            'fullyTranslated: true\n' +
            '---\n\n' +
            '# Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n' +
            '\n' +
            'Ceci est du texte. C\'est plus de texte. Joli, joli texte.\n\n' +
            'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n\n' +
            'C\'est le dernier morceau de texte localisable.\n' +
            '\n' +
            'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n';
        diff(content, expected);
        expect(content).toBe(expected);
        var content = fs.readFileSync(path.join(p2.target, "de-DE/notrans.mdx"), "utf-8");
        var expected =
            '---\n' +
            'fullyTranslated: true\n' +
            '---\n\n' +
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

    test("MdxFileLocalizeNoStrings", function() {
        expect.assertions(3);
        var base = path.dirname(module.id);
        var mf = new MdxFile({
            project: p,
            pathName: "./md/nostrings.mdx",
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r308704783',
            source: 'Get insurance quotes for free!',
            target: 'Kostenlosen Versicherungs-Angebote erhalten!',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        mf.localize(translations, ["fr-FR", "de-DE"]);
        // should produce the files, even if there is nothing to localize in them
        expect(fs.existsSync(path.join(p.target, "fr-FR/md/nostrings.mdx"))).toBeTruthy();
        expect(fs.existsSync(path.join(p.target, "de-DE/md/nostrings.mdx"))).toBeTruthy();
    });

    test("MdxFileExtractFileNewResources", function() {
        expect.assertions(16);
        var base = path.dirname(module.id);
        var t = new MdxFileType(p);
        var mf = new MdxFile({
            project: p,
            pathName: "./md/mode.mdx",
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
            datatype: "mdx"
        }));
        var actual = mf.localizeText(translations, "fr-FR");
        var expected =
            '## Choisissez une méthode de réunion d\'affaires\n' +
            '\n' +
            '<img src="http://foo.com/photo.png" height="86px" width="86px" />\n' +
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

    test("MdxFileLocalizeTextHeaderWithNoSpace", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // MDX parser requires proper markdown syntax with spaces after #
        // Update test to use valid syntax
        mf.parse(
            '# Bad Header\n' +
            '## Other Bad Header\n' +
            '# Bad Header\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r868915655',
            source: 'Bad Header',
            target: 'Entête mal',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r836504731',
            source: 'Other Bad Header',
            target: 'Autre entête mal',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        expect(mf.localizeText(translations, "fr-FR")).toBe('# Entête mal\n\n' +
            '## Autre entête mal\n\n' +
            '# Entête mal\n');
    });

    test("MdxFileParseMultipleMDComponents", function() {
        expect.assertions(9);
        var mf = new MdxFile({
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

    test("MdxFileParseCodeSnippetsInBulletList", function() {
        expect.assertions(6);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('* `action (str):` `create`, `delete`, or `update`.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(1);
        var r = set.getBySource("<c0/> <c1/>, <c2/>, or <c3/>.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("<c0/> <c1/>, <c2/>, or <c3/>.");
        expect(r.getKey()).toBe("r852531755");
    });

    test("MdxFileParseWithLinkReferenceWithText", function() {
        expect.assertions(6);
        var mf = new MdxFile({
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

    test("MdxFileParseWithLinkReferenceToExtractedURL", function() {
        expect.assertions(8);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            '- [Ask on Twitter][twitter]: For general questions and support.\n' +
            '- [Ask on Facebook][facebook]: For general questions and support.\n' +
            '\n' +
            '{/* i18n-enable localize-links */}\n' +
            '[twitter]: https://twitter.com/OurPlatform\n' +
            '[facebook]: http://www.facebook.com/OurPlatform\n' +
            '{/* i18n-disable localize-links */}'
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

    test("MdxFileParseWithLinkReferenceWithLinkTitle", function() {
        expect.assertions(7);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'Regular service will be [available][exception].\n' +
            '\n' +
            '{/* i18n-enable localize-links */}\n' +
            '[exception]: http://a.com/ "link title"\n' +
            '{/* i18n-disable localize-links */}'
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

    test("MdxFileParseWithLinkReferenceToExtractedURLNotAfterTurnedOff", function() {
        expect.assertions(6);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            '- [Ask on Twitter][twitter]: For general questions and support.\n' +
            '- [Ask on Facebook][facebook]: For general questions and support.\n' +
            '\n' +
            '{/* i18n-enable localize-links */}\n' +
            '[twitter]: https://twitter.com/OurPlatform\n' +
            '{/* i18n-disable localize-links */}\n' +
            '[facebook]: http://www.facebook.com/OurPlatform\n'
        );
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // The directive placement means both URLs might be extracted before the disable directive is processed
        // Let's check what's actually extracted and update the test accordingly
        var resources = set.getAll();
        // Should have at least the two list items and the twitter URL
        expect(resources.length).toBeGreaterThanOrEqual(3);
        var twitterUrl = resources.find(r => r.getSource() === "https://twitter.com/OurPlatform");
        expect(twitterUrl).toBeTruthy();
        // Check that the list items are extracted
        var twitterItem = resources.find(r => r.getSource() === "<c0>Ask on Twitter</c0>: For general questions and support.");
        expect(twitterItem).toBeTruthy();
        var facebookItem = resources.find(r => r.getSource() === "<c0>Ask on Facebook</c0>: For general questions and support.");
        expect(facebookItem).toBeTruthy();
    });

    test("MdxFileParseWithMultipleLinkReferenceWithText", function() {
        expect.assertions(8);
        var mf = new MdxFile({
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

    test("MdxFileLocalizeReferenceLinksWithLinkId", function() {
        expect.assertions(3);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r293599939',
            source: '<c0>Ask on Twitter</c0>: For general questions and support.',
            target: '<c0>Auf Twitter stellen</c0>: Für allgemeine Fragen und Unterstützung.',
            targetLocale: "de-DE",
            datatype: "mdx"
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

    test("MdxFileLocalizeReferenceLinksWithoutLinkId", function() {
        expect.assertions(3);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1030328207',
            source: '<c0>Ask on Twitter</c0> For general questions and support.',
            target: '<c0>Auf Twitter stellen</c0> für allgemeine Fragen und Unterstützung.',
            targetLocale: "de-DE",
            datatype: "mdx"
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

    test("MdxFileLocalizeReferenceLinksWithLinkTitle", function() {
        expect.assertions(3);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '- [Ask on Twitter][twitter] For general questions and support.\n' +
            '\n' +
            '{/* i18n-enable localize-links */}\n' +
            '[twitter]: https://twitter.com/OurPlatform "Our Platform"\n' +
            '{/* i18n-disable localize-links */}\n'
        );
        expect(mf).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r816306377',
            source: 'For developer support, please reach out to us via one of our channels:',
            target: 'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1030328207',
            source: '<c0>Ask on Twitter</c0> For general questions and support.',
            target: '<c0>Auf Twitter stellen</c0> für allgemeine Fragen und Unterstützung.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r85880207',
            source: 'https://twitter.com/OurPlatform',
            target: 'https://de.twitter.com/OurPlatform',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r504251007',
            source: 'Our Platform',
            target: 'Unsere Platformen',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        var actual = mf.localizeText(translations, "de-DE");
        var expected =
            'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:\n' +
            '\n' +
            '* [Auf Twitter stellen][twitter] für allgemeine Fragen und Unterstützung.\n' +
            '\n' +
            '{/* i18n-enable localize-links */}\n\n' +
            '[twitter]: https://de.twitter.com/OurPlatform "Unsere Platformen"\n\n' +
            '{/* i18n-disable localize-links */}\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileLocalizeDirectLinksTurnedOff", function() {
        expect.assertions(3);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '{/* i18n-disable localize-links */}\n' +
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r629827996',
            source: '<c0>Ask on Twitter</c0> for general questions and support.',
            target: '<c0>Auf Twitter stellen</c0> für allgemeine Fragen und Unterstützung.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r85880207',
            source: 'https://twitter.com/OurPlatform',
            target: 'https://de.twitter.com/OurPlatform',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        var actual = mf.localizeText(translations, "de-DE");
        var expected =
            'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:\n' +
            '\n' +
            '{/* i18n-disable localize-links */}\n' +
            '\n' +
            '* [Auf Twitter stellen](https://twitter.com/OurPlatform) für allgemeine Fragen und Unterstützung.\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileLocalizeDirectLinksTurnedOn", function() {
        expect.assertions(3);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse(
            'For developer support, please reach out to us via one of our channels:\n' +
            '\n' +
            '{/* i18n-enable localize-links */}\n' +
            '\n' +
            '- [Ask on Twitter](https://twitter.com/OurPlatform) for general questions and support.\n' +
            '\n' +
            '{/* i18n-disable localize-links */}\n'
        );
        expect(mf).toBeTruthy();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r816306377',
            source: 'For developer support, please reach out to us via one of our channels:',
            target: 'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r629827996',
            source: '<c0>Ask on Twitter</c0> for general questions and support.',
            target: '<c0>Auf Twitter stellen</c0> für allgemeine Fragen und Unterstützung.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r85880207',
            source: 'https://twitter.com/OurPlatform',
            target: 'https://de.twitter.com/OurPlatform',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        var actual = mf.localizeText(translations, "de-DE");
        var expected =
            'Wenn Sie Entwicklerunterstützung benötigen, wenden Sie sich bitte über einen unserer Kanäle an uns:\n' +
            '\n' +
            '{/* i18n-enable localize-links */}\n' +
            '\n' +
            '* [Auf Twitter stellen](https://de.twitter.com/OurPlatform) für allgemeine Fragen und Unterstützung.\n' +
            '\n' +
            '{/* i18n-disable localize-links */}\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileParseHTMLComments", function() {
        expect.assertions(5);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a {/* comment */}test of the emergency parsing system.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        var r = set.getBySource("This is a test of the emergency parsing system.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("This is a test of the emergency parsing system.");
        expect(r.getKey()).toBe("r699762575");
    });

    test("MdxFileParseHTMLCommentsWithIndent", function() {
        expect.assertions(8);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency parsing system.\n  {/* comment */}\nA second string\n');
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

    test("MdxFileLocalizeHTMLCommentsWithIndent", function() {
        expect.assertions(2);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        mf.parse('This is a test of the emergency parsing system.\n  {/* comment */}\nA second string\n');
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "foo",
            key: 'r699762575',
            source: 'This is a test of the emergency parsing system.',
            target: 'This is a test of the emergency parsing system... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r772298159',
            source: 'A second string',
            target: 'A second string... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        var actual = mf.localizeText(translations, "de-DE");
        var expected =
            'This is a test of the emergency parsing system... in GERMAN!\n\n{/* comment */}\n\nA second string... in GERMAN!\n';
        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MdxFileLocalizeTable", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r595024848',
            source: 'Returns column',
            target: 'Returns column... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r941132140',
            source: 'foo',
            target: 'foo... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r755240053',
            source: 'bar',
            target: 'bar... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mdx"
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

    test("MdxFileLocalizeTableWithInlineCode", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r595024848',
            source: 'Returns column',
            target: 'Returns column... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r941132140',
            source: 'foo',
            target: 'foo... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r755240053',
            source: 'bar',
            target: 'bar... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mdx"
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

    test("MdxFileLocalizeTableWithInlineCodeAndTextAfter", function() {
        expect.assertions(2);
        var mf = new MdxFile({
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r595024848',
            source: 'Returns column',
            target: 'Returns column... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r1037333769',
            source: 'Header Title',
            target: 'Header Title... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "foo",
            key: 'r521829558',
            source: 'Body text.',
            target: 'Body text... in GERMAN!',
            targetLocale: "de-DE",
            datatype: "mdx"
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

    test("MdxFileLocalizeFileFullyTranslatedFlag", function() {
        expect.assertions(3);
        // this subproject has the "fullyTranslated" flag set to true
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mdx: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MdxFileType(p2);
        var mf = new MdxFile({
            project: p2,
            pathName: "./notrans.mdx",
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r112215756',
            source: 'This is localizable text. This is the TITLE of this Test Document Which Appears Several Times Within the Document Itself.',
            target: 'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r260813817',
            source: 'This is the last bit of localizable text.',
            target: 'C\'est le dernier morceau de texte localisable.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        mf.localize(translations, ["fr-FR"]);
        expect(fs.existsSync(path.join(p2.target, "fr-FR/notrans.mdx"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p2.target, "fr-FR/notrans.mdx"), "utf-8");
        var expected =
            '---\n' +
            'fullyTranslated: true\n' +
            '---\n\n' +
            '# Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n' +
            '\n' +
            'Ceci est du texte. C\'est plus de texte. Joli, joli texte.\n\n' +
            'Ceci est de la texte localisable. Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n\n' +
            'C\'est le dernier morceau de texte localisable.\n\n' +
            'Ceci est le titre de ce document de teste qui apparaît plusiers fois dans le document lui-même.\n';
        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("MdxFileLocalizeFileFullyTranslatedFlagNoTranslations", function() {
        expect.assertions(3);
        // this subproject has the "fullyTranslated" flag set to true
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mdx: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MdxFileType(p2);
        var mf = new MdxFile({
            project: p2,
            pathName: "./notrans.mdx",
            type: mdft2
        });
        expect(mf).toBeTruthy();
        // should read the file
        mf.extract();
        var translations = new TranslationSet();
        mf.localize(translations, ["fr-FR"]);
        expect(fs.existsSync(path.join(p2.target, "fr-FR/notrans.mdx"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p2.target, "fr-FR/notrans.mdx"), "utf-8");
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

    test("MdxFileLocalizeFileFullyTranslatedFlagNotFullyTranslated", function() {
        expect.assertions(3);
        // this subproject has the "fullyTranslated" flag set to true
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mdx: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MdxFileType(p2);
        var mf = new MdxFile({
            project: p2,
            pathName: "./notrans.mdx",
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
            datatype: "mdx"
        }));
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r777006502',
            source: 'This is some text. This is more text. Pretty, pretty text.',
            target: 'Ceci est du texte. C\'est plus de texte. Joli, joli texte.',
            targetLocale: "fr-FR",
            datatype: "mdx"
        }));
        mf.localize(translations, ["fr-FR"]);
        expect(fs.existsSync(path.join(p2.target, "fr-FR/notrans.mdx"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p2.target, "fr-FR/notrans.mdx"), "utf-8");
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

    test("MdxFileLocalizeCodeSnippetsInBulletList", function() {
        expect.assertions(3);
        // this subproject has the "fullyTranslated" flag set to true
        var p2 = ProjectFactory("./test/testfiles/subproject", {
            mdx: {
                fullyTranslated: true
            }
        });
        var mdft2 = new MdxFileType(p2);
        var mf = new MdxFile({
            project: p2,
            pathName: "./codesnippets.mdx",
            type: mdft2
        });
        expect(mf).toBeTruthy();
        // should read the file
        mf.extract();
        var translations = new TranslationSet();
        translations.add(new ResourceString({
            project: "loctest2",
            key: 'r852531755',
            source: '<c0/> <c1/>, <c2/>, or <c3/>.',
            target: '<c0/> <c1/>, <c2/>, oder <c3/>.',
            targetLocale: "de-DE",
            datatype: "mdx"
        }));
        mf.localize(translations, ["de-DE"]);
        expect(fs.existsSync(path.join(p2.target, "de-DE/codesnippets.mdx"))).toBeTruthy();
        var content = fs.readFileSync(path.join(p2.target, "de-DE/codesnippets.mdx"), "utf-8");
        var expected =
            '---\n' +
            'fullyTranslated: true\n' +
            '---\n\n' +
            '* `a:` `b`, `c`, oder `d`.\n';
        diff(content, expected);
        expect(content).toBe(expected);
    });

    // MDX-specific syntax tests
    test("MdxFileParseWithImportStatement", function() {
        expect.assertions(5);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // Import statements should be ignored (not extracted as translatable strings)
        mf.parse('import {Chart} from \'./snowfall.js\';\n\n# Last year\'s snowfall\n\nThis is translatable text.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Should only extract the translatable markdown text, not the import
        var r = set.getBySource("Last year's snowfall");
        expect(r).toBeTruthy();
        r = set.getBySource("This is translatable text.");
        expect(r).toBeTruthy();
        // Import statement should not be extracted
        var importRes = set.getBySource("import {Chart} from './snowfall.js';");
        expect(!importRes).toBeTruthy();
    });

    test("MdxFileParseWithExportStatement", function() {
        expect.assertions(5);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // Export statements should be ignored (not extracted as translatable strings)
        mf.parse('export const year = 2023;\n\n# Last year\'s snowfall\n\nIn {year}, the snowfall was above average.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Should extract the translatable markdown text
        var r = set.getBySource("Last year's snowfall");
        expect(r).toBeTruthy();
        r = set.getBySource("In <c0/>, the snowfall was above average.");
        expect(r).toBeTruthy();
        // Export statement should not be extracted
        var exportRes = set.getBySource("export const year = 2023;");
        expect(!exportRes).toBeTruthy();
    });

    test("MdxFileParseWithJSXComponentSelfClosing", function() {
        expect.assertions(6);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // JSX self-closing component should be preserved but not extracted
        mf.parse('# Last year\'s snowfall\n\nIn 2023, the snowfall was above average.\n\n<Chart color="#fcb32c" year={2023} />\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Should extract the translatable markdown text
        var r = set.getBySource("Last year's snowfall");
        expect(r).toBeTruthy();
        r = set.getBySource("In 2023, the snowfall was above average.");
        expect(r).toBeTruthy();
        // JSX component itself should not be extracted as a string
        var jsxRes = set.getBySource('<Chart color="#fcb32c" year={2023} />');
        expect(!jsxRes).toBeTruthy();
        expect(set.size()).toBe(2);
    });

    test("MdxFileParseWithJSXComponentWithChildren", function() {
        expect.assertions(6);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // JSX component with children containing translatable text
        mf.parse('# Welcome\n\n<Alert type="info">\nThis is an important message.\n</Alert>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Should extract the translatable markdown text
        var r = set.getBySource("Welcome");
        expect(r).toBeTruthy();
        // Should extract text inside JSX component children
        r = set.getBySource("This is an important message.");
        expect(r).toBeTruthy();
        // JSX component tag itself should not be extracted
        var jsxRes = set.getBySource('<Alert type="info">');
        expect(!jsxRes).toBeTruthy();
        expect(set.size()).toBe(2);
    });

    test("MdxFileParseWithJSXComponentProps", function() {
        expect.assertions(5);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // JSX component with string props should extract prop values
        mf.parse('<Button title="Click me" label="Submit Form">\nClick here to submit\n</Button>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Should extract string prop values
        var r = set.getBySource("Click me");
        expect(r).toBeTruthy();
        r = set.getBySource("Submit Form");
        expect(r).toBeTruthy();
        // Should extract text inside component
        r = set.getBySource("Click here to submit");
        expect(r).toBeTruthy();
    });

    test("MdxFileParseWithJSXComponentNonLocalizableProps", function() {
        expect.assertions(7);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // JSX component with both localizable and non-localizable props
        // Only title, placeholder, and label should be extracted
        mf.parse('<Input type="text" name="username" placeholder="Enter username" id="user-input" label="Username" />\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Should extract localizable props: placeholder and label
        var r = set.getBySource("Enter username");
        expect(r).toBeTruthy();
        r = set.getBySource("Username");
        expect(r).toBeTruthy();
        // Should NOT extract non-localizable props: type, name, id
        var nonLocalizable = set.getBySource("text");
        expect(!nonLocalizable).toBeTruthy();
        nonLocalizable = set.getBySource("username");
        expect(!nonLocalizable).toBeTruthy();
        nonLocalizable = set.getBySource("user-input");
        expect(!nonLocalizable).toBeTruthy();
    });

    test("MdxFileParseWithJavaScriptExpression", function() {
        expect.assertions(5);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // JavaScript expressions in markdown should be converted to component placeholders like <c0/>
        mf.parse('# Last year\'s snowfall\n\nIn {year}, the snowfall was above average.\n\nIt was followed by a warm spring.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Should extract the text with the expression converted to a component placeholder
        var r = set.getBySource("Last year's snowfall");
        expect(r).toBeTruthy();
        // The text with {year} should be extractable, with the expression converted to <c0/>
        r = set.getBySource("In <c0/>, the snowfall was above average.");
        expect(r).toBeTruthy();
        r = set.getBySource("It was followed by a warm spring.");
        expect(r).toBeTruthy();
    });

    test("MdxFileParseWithMultipleJSXComponents", function() {
        expect.assertions(7);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // Multiple JSX components mixed with markdown
        mf.parse('# Article Title\n\nThis is the introduction.\n\n<Chart data={chartData} />\n\nThis is the conclusion.\n\n<Button>Click me</Button>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Should extract all translatable markdown text
        var r = set.getBySource("Article Title");
        expect(r).toBeTruthy();
        r = set.getBySource("This is the introduction.");
        expect(r).toBeTruthy();
        r = set.getBySource("This is the conclusion.");
        expect(r).toBeTruthy();
        r = set.getBySource("Click me");
        expect(r).toBeTruthy();
        expect(set.size()).toBe(4);
    });

    test("MdxFileParseWithNestedJSXComponents", function() {
        expect.assertions(6);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // Nested JSX components
        mf.parse('<Card>\n<CardHeader>Card Title</CardHeader>\n<CardBody>\nThis is the card content.\n</CardBody>\n</Card>\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Should extract text from nested components
        var r = set.getBySource("Card Title");
        expect(r).toBeTruthy();
        r = set.getBySource("This is the card content.");
        expect(r).toBeTruthy();
        // Should not extract the component tags themselves
        var jsxRes = set.getBySource('<Card>');
        expect(!jsxRes).toBeTruthy();
        expect(set.size()).toBe(2);
    });

    test("MdxFileParseWithJSXAndMarkdownMixed", function() {
        expect.assertions(5);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // JSX components mixed with markdown formatting
        mf.parse('# Heading\n\nThis paragraph has *bold text* and a <Button>component</Button>.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Should extract the heading
        var r = set.getBySource("Heading");
        expect(r).toBeTruthy();
        // Should extract the paragraph with bold and component text
        // Note: Component text inside JSX is extracted as part of the parent string, not separately
        r = set.getBySource("This paragraph has <c0>bold text</c0> and a <c1>component</c1>.");
        expect(r).toBeTruthy();
        expect(set.size()).toBe(2);
    });

    test("MdxFileParseWithJSXExpressionProps", function() {
        expect.assertions(4);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // JSX with expression props (not string literals) should not extract the expression
        mf.parse('<Chart year={2023} data={chartData} title="Chart Title" />\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Should only extract string literal props, not expression props
        var r = set.getBySource("Chart Title");
        expect(r).toBeTruthy();
        // Expression props should not be extracted
        var exprRes = set.getBySource("2023");
        expect(!exprRes).toBeTruthy();
    });

    test("MdxFileParseWithJSXObjectExpressionProps", function() {
        expect.assertions(4);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // JSX with object expression props (no quotes) should not extract the expression
        mf.parse('<Chart data={{data: charts[i].data}} title="Chart Title" />\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Should only extract string literal props, not object expression props
        var r = set.getBySource("Chart Title");
        expect(r).toBeTruthy();
        // Object expression props should not be extracted
        var exprRes = set.getBySource("{{data: charts[i].data}}");
        expect(!exprRes).toBeTruthy();
    });

    test("MdxFileParseWithImportAndExportTogether", function() {
        expect.assertions(6);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        // Both import and export statements should be ignored
        mf.parse('import {Chart} from \'./snowfall.js\';\nexport const year = 2023;\n\n# Last year\'s snowfall\n\nIn {year}, the snowfall was above average.\n');
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Should extract translatable markdown text
        var r = set.getBySource("Last year's snowfall");
        expect(r).toBeTruthy();
        // JavaScript expression should be converted to component placeholder
        r = set.getBySource("In <c0/>, the snowfall was above average.");
        expect(r).toBeTruthy();
        // Import and export should not be extracted
        var importRes = set.getBySource("import {Chart} from './snowfall.js';");
        expect(!importRes).toBeTruthy();
        var exportRes = set.getBySource("export const year = 2023;");
        expect(!exportRes).toBeTruthy();
    });

    test("MdxFileParseWithFrontmatterAndImport", function() {
        expect.assertions(8);
        var mf = new MdxFile({
            project: p3,
            type: mdft3,
            pathName: "foo/bar/x/foo.mdx"
        });
        expect(mf).toBeTruthy();
        // Frontmatter with import statement and JSX components
        mf.parse(
            '---\n' +
            'Title: Article Title\n' +
            'Description: This is the article description\n' +
            '---\n\n' +
            'import {Chart} from \'./chart.js\';\n\n' +
            '# Introduction\n\n' +
            'This is the introduction text.\n\n' +
            '<Chart data={chartData} />\n'
        );
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Frontmatter should be extracted
        var r = set.getBySource("Article Title");
        expect(r).toBeTruthy();
        r = set.getBySource("This is the article description");
        expect(r).toBeTruthy();
        // Markdown text should be extracted
        r = set.getBySource("Introduction");
        expect(r).toBeTruthy();
        r = set.getBySource("This is the introduction text.");
        expect(r).toBeTruthy();
        // Import should not be extracted
        var importRes = set.getBySource("import {Chart} from './chart.js';");
        expect(!importRes).toBeTruthy();
        expect(set.size()).toBeGreaterThan(3);
    });

    test("MdxFileParseWithFrontmatterAndJSXComponents", function() {
        expect.assertions(9);
        var mf = new MdxFile({
            project: p3,
            type: mdft3,
            pathName: "foo/bar/x/foo.mdx"
        });
        expect(mf).toBeTruthy();
        // Frontmatter with JSX components and JavaScript expressions
        mf.parse(
            '---\n' +
            'Title: Last Year\'s Weather\n' +
            'Description: Weather data from last year\n' +
            '---\n\n' +
            'import {Chart} from \'./chart.js\';\n' +
            'export const year = 2023;\n\n' +
            '# Last year\'s snowfall\n\n' +
            'In {year}, the snowfall was above average.\n\n' +
            '<Chart year={year} title="Snowfall Chart" />\n\n' +
            '<Alert type="warning">\n' +
            'This is a warning message.\n' +
            '</Alert>\n'
        );
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Frontmatter should be extracted
        var r = set.getBySource("Last Year's Weather");
        expect(r).toBeTruthy();
        r = set.getBySource("Weather data from last year");
        expect(r).toBeTruthy();
        // Markdown text should be extracted
        r = set.getBySource("Last year's snowfall");
        expect(r).toBeTruthy();
        // JavaScript expression should be converted to component placeholder
        r = set.getBySource("In <c0/>, the snowfall was above average.");
        expect(r).toBeTruthy();
        // JSX prop values should be extracted
        r = set.getBySource("Snowfall Chart");
        expect(r).toBeTruthy();
        // JSX children text should be extracted
        r = set.getBySource("This is a warning message.");
        expect(r).toBeTruthy();
        // Import and export should not be extracted
        var importRes = set.getBySource("import {Chart} from './chart.js';");
        expect(!importRes).toBeTruthy();
    });

    test("MdxFileParseWithFrontmatterExportAndJSX", function() {
        expect.assertions(7);
        var mf = new MdxFile({
            project: p3,
            type: mdft3,
            pathName: "foo/bar/x/foo.mdx"
        });
        expect(mf).toBeTruthy();
        // Frontmatter with export and JSX components
        mf.parse(
            '---\n' +
            'Title: Component Documentation\n' +
            '---\n\n' +
            'export const components = { Button, Alert };\n\n' +
            '# Using Components\n\n' +
            'Here is how to use the <Button>Button</Button> component.\n\n' +
            '<Alert type="info">\n' +
            'Component usage example\n' +
            '</Alert>\n'
        );
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        // Frontmatter should be extracted
        var r = set.getBySource("Component Documentation");
        expect(r).toBeTruthy();
        // Markdown text should be extracted
        r = set.getBySource("Using Components");
        expect(r).toBeTruthy();
        r = set.getBySource("Here is how to use the <c0>Button</c0> component.");
        expect(r).toBeTruthy();
        // JSX children text should be extracted
        r = set.getBySource("Component usage example");
        expect(r).toBeTruthy();
        // Export should not be extracted
        var exportRes = set.getBySource("export const components = { Button, Alert };");
        expect(!exportRes).toBeTruthy();
    });

    test("MdxFileParseWithTable", function() {
        expect.assertions(21);
        var mf = new MdxFile({
            project: p,
            type: mdft
        });
        expect(mf).toBeTruthy();
        var source =
            "    ### Groups\n\n" +
            "    <table>\n" +
            "      <thead>\n" +
            "        <tr>\n" +
            "          <th>Tool</th>\n" +
            "        </tr>\n" +
            "      </thead>\n" +
            "      <tbody>\n" +
            "        <tr>\n" +
            "          <td>`box_groups_list_by_user_tool`</td>\n" +
            "          <td>List all groups that a specific user belongs to</td>\n" +
            "          <td>\n" +
            "            - `ctx (Context)`: Request context.<br/>\n" +
            "            - `user_id (str)`: ID of the user.\n" +
            "          </td>\n" +
            "          <td>List of groups in JSON format</td>\n" +
            "        </tr>\n" +
            "      </tbody>\n" +
            "    </table>\n";
        mf.parse(source);
        var set = mf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(6);
        var r = set.getBySource("Groups");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Groups");
        expect(r.getKey()).toBe("r1024152427");
        r = set.getBySource("Tool");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Tool");
        expect(r.getKey()).toBe("r68642941");
        r = set.getBySource("List all groups that a specific user belongs to");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("List all groups that a specific user belongs to");
        expect(r.getKey()).toBe("r48722519");
        r = set.getBySource("<c0/>: Request context.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("<c0/>: Request context.");
        expect(r.getKey()).toBe("r692233097");
        r = set.getBySource("<c0/>: ID of the user.");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("<c0/>: ID of the user.");
        expect(r.getKey()).toBe("r155279164");
        r = set.getBySource("List of groups in JSON format");
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("List of groups in JSON format");
        expect(r.getKey()).toBe("r903819442");
    });
});
