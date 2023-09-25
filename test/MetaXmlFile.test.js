/*
 * MetaXmlFile.test.js - test the MetaXml file handler object.
 *
 * Copyright © 2021, 2023 Box, Inc.
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

if (!MetaXmlFile) {
    var MetaXmlFile = require("../MetaXmlFile.js");
    var MetaXmlFileType = require("../MetaXmlFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
    var ContextResourceString =  require("loctool/lib/ContextResourceString.js");
    var ResourcePlural =  require("loctool/lib/ResourcePlural.js");
    var TranslationSet =  require("loctool/lib/TranslationSet.js");
}

function diff(a, b) {
    if (!a && !b) return;
    if (!a) {
        console.log("Found difference at character 0");
        console.log("a: undefined");
        console.log("b: " + b.substring(i));
        return;
    }
    if (!b) {
        console.log("Found difference at character 0");
        console.log("a: " + a.substring(i));
        console.log("b: undefined");
        return;
    }

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
    id: "forceapp",
    sourceLocale: "en-US",
    pseudoLocale: "de-DE",
    plugins: [
        path.join(process.cwd(), "MetaXmlFileType")
    ]
}, "./test/testfiles", {
    locales:["en-GB"]
});

var mxft = new MetaXmlFileType(p);

var p2 = new CustomProject({
    name: "forceapp",
    id: "forceapp",
    sourceLocale: "en-US",
    plugins: [
        path.join(process.cwd(), "MetaXmlFileType")
    ]
}, "./test/testfiles", {
    locales:["en-GB"],
    identify: true,
    nopseudo: true,
    metaxml: {
        resourceFile: "force-app/main/default/translations/[localeUnder].translation-meta.xml"
    }
});

var mxft2 = new MetaXmlFileType(p2);

beforeAll(function() {
    p.init(function() {
        p2.init(function() {
        });
    });
});

describe("metaxmlfile", function() {
    test("MetaXmlFileConstructor", function() {
        expect.assertions(1);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft
        });
        expect(mxf).toBeTruthy();
    });

    test("MetaXmlFileConstructorParams", function() {
        expect.assertions(1);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./testfiles/force-app/main/default/translations/en_US.translation-meta.xml",
            type: mxft
        });

        expect(mxf).toBeTruthy();
    });

    test("MetaXmlFileConstructorNoFile", function() {
        expect.assertions(1);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();
    });

    test("MetaXmlFileMakeKey", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("This is a test")).toBe("r654479252");
    });

    test("MetaXmlFileMakeKeySimpleTexts1", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("Preferences in your profile")).toBe("r372802078");;
        expect(mxf.makeKey("All settings")).toBe("r725930887");;
        expect(mxf.makeKey("Colour scheme")).toBe("r734599412");;
        expect(mxf.makeKey("Experts")).toBe("r343852585");;
    });

    test("MetaXmlFileMakeKeyUnescaped", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("foo \\n \\t bar")).toBe("r1056543475");;
        expect(mxf.makeKey("\\n \\t bar")).toBe("r755240053");;
        expect(mxf.makeKey("The \\'Dude\\' played by Jeff Bridges")).toBe("r600298088");;
        expect(mxf.makeKey("\\'Dude\\'")).toBe("r6259609");;
    });

    test("MetaXmlFileMakeKeySimpleTexts2", function() {
        expect.assertions(6);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("Procedures")).toBe("r807691021");;
        expect(mxf.makeKey("Mobile Apps")).toBe("r898923204");;
        expect(mxf.makeKey("Settings in your profile")).toBe("r618035987");;
        expect(mxf.makeKey("Product Reviews")).toBe("r175350918");;
        expect(mxf.makeKey("Answers")).toBe("r221604632");;
    });

    test("MetaXmlFileMakeKeySimpleTexts3", function() {
        expect.assertions(9);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("Private Profile")).toBe("r314592735");;
        expect(mxf.makeKey("People you are connected to")).toBe("r711926199");;
        expect(mxf.makeKey("Notifications")).toBe("r284964820");;
        expect(mxf.makeKey("News")).toBe("r613036745");;
        expect(mxf.makeKey("More Tips")).toBe("r216617786");;
        expect(mxf.makeKey("Filters")).toBe("r81370429");;
        expect(mxf.makeKey("Referral Link")).toBe("r140625167");;
        expect(mxf.makeKey("Questions")).toBe("r256277957");;
    });

    test("MetaXmlFileMakeKeyEscapes", function() {
        expect.assertions(3);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("Can\'t find id")).toBe("r743945592");;
        expect(mxf.makeKey("Can\'t find an application for SMS")).toBe("r909283218");;
    });

    test("MetaXmlFileMakeKeyPunctuation", function() {
        expect.assertions(8);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("{name}({generic_name})")).toBe("r300446104");;
        expect(mxf.makeKey("{name}, {sharer_name} {start}found this interesting{end}")).toBe("r8321889");;
        expect(mxf.makeKey("{sharer_name} {start}found this interesting{end}")).toBe("r639868344");;
        expect(mxf.makeKey("Grow your Network")).toBe("r895214324");;
        expect(mxf.makeKey("Failed to send connection request!")).toBe("r1015770123");;
        expect(mxf.makeKey("{goal_name} Goals")).toBe("r993422001");;
        expect(mxf.makeKey("Connection link copied!")).toBe("r180897411");;
    });

    test("MetaXmlFileMakeKeySameStringMeansSameKey", function() {
        expect.assertions(3);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("This is a test")).toBe("r654479252");
        expect(mxf.makeKey("This is a test")).toBe("r654479252");
    });

    test("MetaXmlFileMakeKeyCompressWhiteSpace", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("Can\'t find  id")).toBe("r743945592");
        expect(mxf.makeKey("Can\'t    find               id")).toBe("r743945592");

        expect(mxf.makeKey("Can\'t find an application for SMS")).toBe("r909283218");
        expect(mxf.makeKey("Can\'t   \t\n \t   find an    \t \n \r   application for SMS")).toBe("r909283218");
    });

    test("MetaXmlFileMakeKeyTrimWhiteSpace", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("Can\'t find  id")).toBe("r743945592");
        expect(mxf.makeKey("      Can\'t find  id ")).toBe("r743945592");

        expect(mxf.makeKey("Can\'t find an application for SMS")).toBe("r909283218");
        expect(mxf.makeKey(" \t\t\n\r    Can\'t find an application for SMS   \n \t \r")).toBe("r909283218");
    });

    test("MetaXmlFileMakeKeyNewLines", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        expect(mxf.makeKey("A \n B")).toBe("r191336864");;
    });

    test("MetaXmlFileMakeKeyEscapeN", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        expect(mxf.makeKey("A \\n B")).toBe("r191336864");;
    });

    test("MetaXmlFileMakeKeyTabs", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft
        });

        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("A \t B")).toBe("r191336864");;
    });

    test("MetaXmlFileMakeKeyEscapeT", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft
        });

        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("A \\t B")).toBe("r191336864");;
    });

    test("MetaXmlFileMakeKeyQuotes", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft
        });

        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("A \\'B\\' C")).toBe("r935639115");;
    });

    test("MetaXmlFileMakeKeyInterpretEscapedUnicodeChars", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft
        });

        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("\\u00A0 \\u0023")).toBe("r2293235");;
    });

    test("MetaXmlFileMakeKeyInterpretEscapedSpecialChars2", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft
        });

        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("Talk to a support representative live 24/7 via video or \u00a0 text\u00a0chat")).toBe("r969175354");;
    });

    test("MetaXmlFileMakeKeyInterpretEscapedOctalChars", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft
        });

        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("A \\40 \\011 B")).toBe("r191336864");;
    });

    test("MetaXmlFileMakeKeyMetaXmlEscapeSequences", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft
        });

        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("A \\b\\t\\n\\f\\r B")).toBe("r191336864");;
    });

    test("MetaXmlFileMakeKeyCheckRubyCompatibility", function() {
        expect.assertions(13);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft
        });

        expect(mxf).toBeTruthy();

        expect(mxf.makeKey("This has \\\"double quotes\\\" in it.")).toBe("r487572481");;
        expect(mxf.makeKey('This has \\\"double quotes\\\" in it.')).toBe("r487572481");;
        expect(mxf.makeKey("This has \\\'single quotes\\\' in it.")).toBe("r900797640");;
        expect(mxf.makeKey('This has \\\'single quotes\\\' in it.')).toBe("r900797640");;
        expect(mxf.makeKey("This is a double quoted string")).toBe("r494590307");;
        expect(mxf.makeKey('This is a single quoted string')).toBe("r683276274");;
        expect(mxf.makeKey("This is a double quoted string with \\\"quotes\\\" in it.")).toBe("r246354917");;
        expect(mxf.makeKey('This is a single quoted string with \\\'quotes\\\' in it.')).toBe("r248819747");;
        expect(mxf.makeKey("This is a double quoted string with \\n return chars in it")).toBe("r1001831480");;
        expect(mxf.makeKey('This is a single quoted string with \\n return chars in it')).toBe("r147719125");;
        expect(mxf.makeKey("This is a double quoted string with \\t tab chars in it")).toBe("r276797171");;
        expect(mxf.makeKey('This is a single quoted string with \\t tab chars in it')).toBe("r303137748");;
    });

    test("MetaXmlFileParseSimpleGetByKey", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>Password</label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Password");
        expect(r.getKey()).toBe("Test");
    });

    test("MetaXmlFileParseCommentOnly", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test", "xml"));
        expect(r).toBeTruthy();

        expect(!r.getSource()).toBeTruthy();
        expect(r.getKey()).toBe("Test");
    });

    test("MetaXmlFileParseEmpty", function() {
        expect.assertions(6);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label></label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test", "xml"));
        expect(r).toBeTruthy();

        expect(!r.getSource()).toBeTruthy();
        expect(r.getKey()).toBe("Test");
    });

    test("MetaXmlFileParseSimplePreserveWhitespace", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>    Enter Your Password \r \n  </label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test", "xml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("    Enter Your Password \r \n  ");
        expect(r.getKey()).toBe("Test");
    });

    test("MetaXmlFileParseSimpleRightSize", function() {
        expect.assertions(4);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        var set = mxf.getTranslationSet();
        expect(set.size()).toBe(0);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>Password</label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);
    });

    test("MetaXmlFileParseCustomApplications", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>Password</label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Password");
        expect(r.getKey()).toBe("Test");
    });

    test("MetaXmlFileParseCustomLabels", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customLabels>\n' +
            '        <label>Password</label>\n' +
            '        <name>Test</name>\n' +
            '    </customLabels>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Password");
        expect(r.getKey()).toBe("Test");
    });

    test("MetaXmlFileParseCustomTabs", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customTabs>\n' +
            '        <label>Password</label>\n' +
            '        <name>Test</name>\n' +
            '    </customTabs>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Password");
        expect(r.getKey()).toBe("Test");
    });

    test("MetaXmlFileParseQuickActions", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "force-app/main/default/translations/en-US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <quickActions>\n' +
            '        <label>Password</label>\n' +
            '        <name>Test</name>\n' +
            '    </quickActions>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Password");
        expect(r.getKey()).toBe("Test");
    });

    test("MetaXmlFileParseReportTypes", function() {
        expect.assertions(8);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "force-app/main/default/translations/en-US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <reportTypes>\n' +
            '        <label>Screen Flows</label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <name>Test1</name>\n' +
            '            <label>Flow Interview Log Entries</label>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "screen_flows_prebuilt_crt", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Screen Flows");
        expect(r.getKey()).toBe("screen_flows_prebuilt_crt");

        r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test1", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Flow Interview Log Entries");
        expect(r.getKey()).toBe("Test1");
    });

    test("MetaXmlFileParseReportTypesMultiple", function() {
        expect.assertions(11);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "force-app/main/default/translations/en-US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <reportTypes>\n' +
            '        <description>Screen Flows</description>\n' +
            '        <label>Screen Flows</label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <label>Flow Interview Log Entries</label>\n' +
            '            <name>Test1</name>\n' +
            '        </sections>\n' +
            '        <sections>\n' +
            '            <label>Flow Interview Logs</label>\n' +
            '            <name>Test2</name>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "screen_flows_prebuilt_crt", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Screen Flows");
        expect(r.getKey()).toBe("screen_flows_prebuilt_crt");

        r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test1", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Flow Interview Log Entries");
        expect(r.getKey()).toBe("Test1");

        r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test2", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Flow Interview Logs");
        expect(r.getKey()).toBe("Test2");
    });

    test("MetaXmlFileParseReportTypesRightSize", function() {
        expect.assertions(3);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "force-app/main/default/translations/en-US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <reportTypes>\n' +
            '        <description>Screen Flows</description>\n' +
            '        <label>Screen Flows</label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <label>Flow Interview Log Entries</label>\n' +
            '            <name>Test1</name>\n' +
            '        </sections>\n' +
            '        <sections>\n' +
            '            <label>Flow Interview Logs</label>\n' +
            '            <name>Test2</name>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(3);
    });

    test("MetaXmlFileParseReportTypesWithDescription", function() {
        expect.assertions(9);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "force-app/main/default/translations/en-US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <reportTypes>\n' +
            '        <description>Screen Flows Description</description>\n' +
            '        <label>Screen Flows</label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <label>Flow Interview Log Entries</label>\n' +
            '            <name>Test1</name>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "screen_flows_prebuilt_crt", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Screen Flows");
        expect(r.getKey()).toBe("screen_flows_prebuilt_crt");
        expect(r.getComment()).toBe("Screen Flows Description");

        r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test1", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Flow Interview Log Entries");
        expect(r.getKey()).toBe("Test1");
    });

    test("MetaXmlFileParseWithDups", function() {
        expect.assertions(6);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "force-app/main/default/translations/en-US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customLabels>\n' +
            '        <label>Password</label>\n' +
            '        <name>Test</name>\n' +
            '    </customLabels>\n' +
            '    <customLabels>\n' +
            '        <label>Password</label>\n' +
            '        <name>Test</name>\n' +
            '    </customLabels>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Password");
        expect(r.getKey()).toBe("Test");

        expect(set.size()).toBe(1);
    });

    test("MetaXmlFileParseWithDupsWithDifferentKeys", function() {
        expect.assertions(9);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "force-app/main/default/translations/en-US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customLabels>\n' +
            '        <label>Password</label>\n' +
            '        <name>Test1</name>\n' +
            '    </customLabels>\n' +
            '    <customLabels>\n' +
            '        <label>Password</label>\n' +
            '        <name>Test2</name>\n' +
            '    </customLabels>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test1", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Password");
        expect(r.getKey()).toBe("Test1");

        r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test2", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Password");
        expect(r.getKey()).toBe("Test2");

        expect(set.size()).toBe(2);
    });


    test("MetaXmlFileParseCustomApplication", function() {
        expect.assertions(11);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "foo/bar/foo.app-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<CustomApplication xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <defaultLandingTab>x</defaultLandingTab>\n' +
            '    <description>Screen Flows Description</description>\n' +
            '    <isNavAutoTempTabsDisabled>false</isNavAutoTempTabsDisabled>\n' +
            '    <isNavPersonalizationDisabled>false</isNavPersonalizationDisabled>\n' +
            '    <label>Screen Flows</label>\n' +
            '    <logo>screen_flow.png</logo>\n' +
            '    <tabs>x</tabs>\n' +
            '    <tabs>y</tabs>\n' +
            '    <tabs>z</tabs>\n' +
            '</CustomApplication>\n'
        );

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();

        expect(set.size()).toBe(1);

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "foo", "xml"));
        expect(r).toBeTruthy();

        expect(r.getSource()).toBe("Screen Flows");
        expect(r.getKey()).toBe("foo");
        expect(r.getComment()).toBe("Screen Flows Description");
        expect(r.getSourceLocale()).toBe("en-US");
        expect(r.getType()).toBe("string");
        expect(!r.getTarget()).toBeTruthy();
        expect(!r.getTargetLocale()).toBeTruthy();
    });

    test("MetaXmlFileExtractFile", function() {
        expect.assertions(11);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/translations/en_US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        var set = mxf.getTranslationSet();

        expect(set.size()).toBe(13);

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "String_only_in_translations_meta_xml", "xml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Translations Only String");
        expect(r.getKey()).toBe("String_only_in_translations_meta_xml");

        r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Retry_Count__c", "xml"));
        expect(r).toBeTruthy();
        expect(!r.getSource()).toBeTruthy();
        expect(r.getKey()).toBe("Retry_Count__c");

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "MyApp_Files2", "xml"));
        expect(r).toBeTruthy();
        expect(!r.getSource()).toBeTruthy();
        expect(r.getKey()).toBe("MyApp_Files2");
    });

    test("MetaXmlFileExtractUndefinedFile", function() {

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // should attempt to read the file and not fail
        mxf.extract();

        var set = mxf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("MetaXmlFileExtractBogusFile", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translations-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // should attempt to read the file and not fail
        mxf.extract();

        var set = mxf.getTranslationSet();

        expect(set.size()).toBe(0);
    });

    test("MetaXmlFileExtractLabelsFile", function() {
        expect.assertions(10);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/all/labels/MyLabels.labels-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        var set = mxf.getTranslationSet();

        expect(set.size()).toBe(2);

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Show_Sender_in_Recipient_List", "xml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Show Sender in Recipient List");
        expect(r.getKey()).toBe("Show_Sender_in_Recipient_List");
        expect(r.getComment()).toBe("Whether or not the sender should be shown in the recipient list of the email.");

        r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "Test_of_emergency_warning_system", "xml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Test of the emergency warning system.");
        expect(r.getKey()).toBe("Test_of_emergency_warning_system");
        expect(r.getComment()).toBe("Had this been a real test, you would have been instructed to calmly leave the building.");
    });

    test("MetaXmlFileExtractObjectFile", function() {
        expect.assertions(10);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/objects/Foo__c/Foo__c.object-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        var set = mxf.getTranslationSet();

        expect(set.size()).toBe(2);

        var r = set.get(ResourcePlural.hashKey("forceapp", undefined, "en-US", "Foo__c"));
        expect(r).toBeTruthy();
        var strings = r.getSourcePlurals();
        expect(strings).toBeTruthy();
        expect(strings.one).toBe("Lead Convert Queue");
        expect(strings.other).toBe("Lead Convert Queue Entries");

        expect(r.getKey()).toBe("Foo__c");

        r = set.get(ContextResourceString.hashKey("forceapp", "CustomObject/nameField/label/_text", "en-US", "Foo__c", "xml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Lead Convert Queue Name");
        expect(r.getKey()).toBe("Foo__c");
    });

    test("MetaXmlFileExtractApplicationFile", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/application/MyApp.app-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        var set = mxf.getTranslationSet();

        expect(set.size()).toBe(1);

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "MyApp", "xml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("My Application");
        expect(r.getKey()).toBe("MyApp");
    });


    test("MetaXmlFileExtractMetadataFile", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/customMetadata/MyApp_Setting.Default_Configuration.md-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        var set = mxf.getTranslationSet();

        expect(set.size()).toBe(1);

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "MyApp_Setting", "xml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Default Configuration");
        expect(r.getKey()).toBe("MyApp_Setting");
    });

    test("MetaXmlFileExtractCustomPermissionsFile", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/customPermissions/MyApp_Admin.customPermissions-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        var set = mxf.getTranslationSet();

        expect(set.size()).toBe(1);

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "MyApp_Admin", "xml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("MyApp Admin Settings");
        expect(r.getKey()).toBe("MyApp_Admin");
    });

    test("MetaXmlFileExtractFieldFile", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/objects/Foo__c/fields/AccessToken_Expr__c.field-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        var set = mxf.getTranslationSet();

        expect(set.size()).toBe(1);

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "AccessToken_Expr__c", "xml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Access token expired");
        expect(r.getKey()).toBe("AccessToken_Expr__c");
    });

    test("MetaXmlFileExtractListViewFile", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/objects/Foo__c/listviews/ListView.listView-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        var set = mxf.getTranslationSet();

        expect(set.size()).toBe(1);

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "All", "xml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("All items");
        expect(r.getKey()).toBe("All");
    });

    test("MetaXmlFileExtractPermissionsetFile", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/permissionsets/Standard.permissionset-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        var set = mxf.getTranslationSet();

        expect(set.size()).toBe(1);

        var r = set.get(ContextResourceString.hashKey("forceapp", "Foo__c", "en-US", "Standard", "xml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("MyApp Standard");
        expect(r.getKey()).toBe("Standard");
    });

    test("MetaXmlFileExtractQuickActionsFile", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/quickActions/SendEmail.quickAction-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        var set = mxf.getTranslationSet();

        expect(set.size()).toBe(1);

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "SendEmail", "xml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("Send Email");
        expect(r.getKey()).toBe("SendEmail");
    });

    test("MetaXmlFileExtractTabsFile", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/tabs/MyApp_Files2.tab-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        var set = mxf.getTranslationSet();

        expect(set.size()).toBe(1);

        var r = set.get(ContextResourceString.hashKey("forceapp", undefined, "en-US", "MyApp_Files2", "xml"));
        expect(r).toBeTruthy();
        expect(r.getSource()).toBe("My Application Files");
        expect(r.getKey()).toBe("MyApp_Files2");
    });

    test("MetaXmlFileGetLocalizedPathSimple", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // resource file template is in the settings.metaxml.resourceFile property
        expect(mxf.getLocalizedPath("de-DE")).toBe("force-app/main/default/translations/de.translation-meta.xml");
    });

    test("MetaXmlFileGetLocalizedPathWithPath", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "src/translations/en_US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.getLocalizedPath("de-DE")).toBe("force-app/main/default/translations/de.translation-meta.xml");
    });

    test("MetaXmlFileGetLocalizedPathNonDefault", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.getLocalizedPath("de-AT")).toBe("force-app/main/default/translations/de_AT.translation-meta.xml");
    });


    test("MetaXmlFileGetLocalizedPathSpecialMappingNB", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.getLocalizedPath("nb-NO")).toBe("force-app/main/default/translations/no.translation-meta.xml");
    });

    test("MetaXmlFileGetLocalizedPathSpecialMappingChinese", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.getLocalizedPath("zh-Hans-CN")).toBe("force-app/main/default/translations/zh_CN.translation-meta.xml");
    });

    test("MetaXmlFileGetLocalizedPathSpecialMappingLatAmSpanish", function() {
        expect.assertions(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.getLocalizedPath("es-419")).toBe("force-app/main/default/translations/es_MX.translation-meta.xml");
    });

    test("MetaXmlFileGetLocalizedPathSpecialMappingPortugueseNoDefault", function() {
        expect.assertions(3);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.getLocalizedPath("pt-PT")).toBe("force-app/main/default/translations/pt_PT.translation-meta.xml");
        expect(mxf.getLocalizedPath("pt-BR")).toBe("force-app/main/default/translations/pt_BR.translation-meta.xml");
    });

    test("MetaXmlFileGetLocalizedPath", function() {
        expect.assertions(3);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        expect(mxf.getLocalizedPath("pt-PT")).toBe("force-app/main/default/translations/pt_PT.translation-meta.xml");
        expect(mxf.getLocalizedPath("pt-BR")).toBe("force-app/main/default/translations/pt_BR.translation-meta.xml");
    });

    test("MetaXmlFileAddResource", function() {
        expect.assertions(4);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft,
            locale: "de-DE"
        });
        expect(mxf).toBeTruthy();

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);

        mxf.addResource(new ContextResourceString({
            project: "forceapp",
            key: 'Test',
            source: 'Password',
            comment: "comment",
            datatype: "xml",
            target: "Passwort",
            targetLocale: "de-DE"
        }));

        expect(set.size()).toBe(1);
    });

    test("MetaXmlFileAddMultipleResources", function() {
        expect.assertions(4);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft,
            locale: "de-DE"
        });
        expect(mxf).toBeTruthy();

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);

        mxf.addResource(new ContextResourceString({
            project: "forceapp",
            key: 'Test',
            source: 'Password',
            comment: "comment",
            datatype: "xml",
            target: "Passwort",
            targetLocale: "de-DE"
        }));
        mxf.addResource(new ContextResourceString({
            project: "forceapp",
            key: 'user',
            source: 'Username',
            comment: "comment",
            datatype: "xml",
            target: "Benutzername",
            targetLocale: "de-DE"
        }));

        expect(set.size()).toBe(2);
    });

    test("MetaXmlFileAddResourceNoSourceInExtracted", function() {
        expect.assertions(14);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft,
            locale: "de-DE"
        });
        expect(mxf).toBeTruthy();

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '    <customApplications>\n' +
            '        <label><!-- username --></label>\n' +
            '        <name>user</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        expect(set.size()).toBe(2);

        var resources = set.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);

        expect(resources[0].getKey()).toBe("Test");
        expect(!resources[0].getSource()).toBeTruthy();
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getState()).toBe("new");

        expect(resources[1].reskey).toBe("user");
        expect(!resources[1].getSource()).toBeTruthy();
        expect(resources[1].sourceLocale).toBe("en-US");
        expect(resources[1].state).toBe("new");
    });

    test("MetaXmlFileAddResourceAddSourceExtractedFromOtherResources", function() {
        expect.assertions(14);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft
        });
        expect(mxf).toBeTruthy();

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '    <customApplications>\n' +
            '        <label><!-- username --></label>\n' +
            '        <name>user</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        expect(set.size()).toBe(2);

        mxf.addResource(new ContextResourceString({
            project: "forceapp",
            key: 'Test',
            sourceLocale: "en-US",
            source: "Password",
            comment: "comment1",
            datatype: "xml",
            pathName: "force-app/main/apps/main.application-meta.xml"
        }));
        mxf.addResource(new ContextResourceString({
            project: "forceapp",
            key: 'user',
            sourceLocale: "en-US",
            source: "User Name",
            comment: "comment2",
            datatype: "xml",
            pathName: "force-app/main/apps/main2.application-meta.xml"
        }));

        // should add the source strings to the existing resources

        var resources = set.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(2);

        expect(resources[0].getKey()).toBe("Test");
        expect(resources[0].getSource()).toBe("Password");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(resources[0].getState()).toBe("new");

        expect(resources[1].reskey).toBe("user");
        expect(resources[1].getSource()).toBe("User Name");
        expect(resources[1].sourceLocale).toBe("en-US");
        expect(resources[1].state).toBe("new");
    });

    test("MetaXmlFileLocalizeTextSimpleNoSource", function() {
        expect.assertions(5);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft,
            locale: "de-DE"
        });
        expect(mxf).toBeTruthy();

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '    <customApplications>\n' +
            '        <label><!-- username --></label>\n' +
            '        <name>user</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        expect(set.size()).toBe(2);

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test',
            source: 'Password',
            sourceLocale: "en-US",
            comment: "comment",
            datatype: "xml",
            target: "Passwort",
            targetLocale: "de-DE",
            pathName: "force-app/main/default/translations/en_US.translation-meta.xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'user',
            source: 'Username',
            sourceLocale: "en-US",
            comment: "comment",
            datatype: "xml",
            target: "Benutzername",
            targetLocale: "de-DE",
            pathName: "force-app/main/default/translations/en_US.translation-meta.xml"
        }));

        // should translate anyways, despite having no source strings
        var actual = mxf.localizeText(translations, "de-DE");
        var expected =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>Passwort</label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '    <customApplications>\n' +
            '        <label>Benutzername</label>\n' +
            '        <name>user</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MetaXmlFileLocalizeTextNewResourcesRightContent", function() {
        expect.assertions(6);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft,
            locale: "de-DE"
        });
        expect(mxf).toBeTruthy();

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);

        set = mxft.getNew();
        expect(set.size()).toBe(0);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '    <customApplications>\n' +
            '        <label><!-- username --></label>\n' +
            '        <name>user</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        set = mxf.getTranslationSet();
        expect(set.size()).toBe(2);

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test',
            source: 'Password',
            sourceLocale: "en-US",
            comment: "comment",
            datatype: "xml",
            target: "Passwort",
            targetLocale: "de-DE",
            pathName: "force-app/main/default/translations/en_US.translation-meta.xml"
        }));

        // should translate anyways, despite having no source strings
        var actual = mxf.localizeText(translations, "de-DE");
        var expected =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>Passwort</label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '    <customApplications>\n' +
            '        <name>user</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n';

        diff(actual, expected);
        expect(actual).toBe(expected);
    });

    test("MetaXmlFileLocalizeTextNewResourcesRightSize", function() {
        expect.assertions(6);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft,
            locale: "de-DE"
        });
        expect(mxf).toBeTruthy();

        var set = mxf.getTranslationSet();
        expect(set).toBeTruthy();
        expect(set.size()).toBe(0);

        set = mxft.getNew();
        set.clear();
        expect(set.size()).toBe(0);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '    <customApplications>\n' +
            '        <label><!-- username --></label>\n' +
            '        <name>user</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        set = mxf.getTranslationSet();
        expect(set.size()).toBe(2);

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test',
            source: 'Password',
            sourceLocale: "en-US",
            comment: "comment",
            datatype: "xml",
            target: "Passwort",
            targetLocale: "de-DE",
            pathName: "force-app/main/default/translations/en_US.translation-meta.xml"
        }));

        // should put 1 string into the new set because 1 translation is missing
        mxf.localizeText(translations, "de-DE");

        set = mxft.getNew();
        expect(set.size()).toBe(1);
    });

    test("MetaXmlFileLocalizeTextNewResourcesRightResources", function() {
        expect.assertions(8);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft,
            locale: "de-DE"
        });
        expect(mxf).toBeTruthy();

        set = mxft.getNew();
        set.clear();
        expect(set.size()).toBe(0);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '    <customApplications>\n' +
            '        <label><!-- username --></label>\n' +
            '        <name>user</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test',
            source: '',
            sourceLocale: "en-US",
            comment: "comment",
            datatype: "xml",
            target: "Passwort",
            targetLocale: "de-DE",
            pathName: "force-app/main/default/translations/en_US.translation-meta.xml"
        }));

        // should put the untranslated string in the new set
        mxf.localizeText(translations, "de-DE");

        var resources = set.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);

        expect(resources[0].getKey()).toBe("user");
        expect(resources[0].getProject()).toBe("forceapp");
        expect(!resources[0].getSource()).toBeTruthy();
        expect(resources[0].getSourceLocale()).toBe("en-US");
    });

    test("MetaXmlFileLocalizeTextNewResourcesAddSourceStrings", function() {
        expect.assertions(8);

        var mxf = new MetaXmlFile({
            project: p,
            type: mxft,
            locale: "de-DE"
        });
        expect(mxf).toBeTruthy();

        set = mxft.getNew();
        set.clear();
        expect(set.size()).toBe(0);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '    <customApplications>\n' +
            '        <label><!-- username --></label>\n' +
            '        <name>user</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        // fill in the source strings
        mxf.addResource(new ContextResourceString({
            project: "forceapp",
            key: 'Test',
            sourceLocale: "en-US",
            source: "Password",
            comment: "comment1",
            datatype: "xml",
            pathName: "force-app/main/apps/main.application-meta.xml"
        }));
        mxf.addResource(new ContextResourceString({
            project: "forceapp",
            key: 'user',
            sourceLocale: "en-US",
            source: "User Name",
            comment: "comment2",
            datatype: "xml",
            pathName: "force-app/main/apps/main2.application-meta.xml"
        }));

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test',
            source: '',
            sourceLocale: "en-US",
            comment: "comment",
            datatype: "xml",
            target: "Passwort",
            targetLocale: "de-DE",
            pathName: "force-app/main/default/translations/en_US.translation-meta.xml"
        }));

        // should put the untranslated string in the new set
        mxf.localizeText(translations, "de-DE");

        var resources = set.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(1);

        expect(resources[0].getKey()).toBe("user");
        expect(resources[0].getProject()).toBe("forceapp");
        expect(resources[0].getSource()).toBe("User Name");
        expect(resources[0].getSourceLocale()).toBe("en-US");
    });

/*
    test("MetaXmlFileLocalize", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/translations/en_US.translation-meta.xml",
            type: mxft
        });
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test',
            source: 'Test',
            target: 'Testez',
            targetLocale: "fr-FR",
            datatype: "xml",
            context: "customApplications"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Force_com',
            source: 'Force.com',
            target: 'Force.fr',
            targetLocale: "fr-FR",
            datatype: "xml",
            context: "customApplications"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Account',
            source: 'Text Account',
            target: 'Compte de texte',
            targetLocale: "fr-FR",
            datatype: "xml",
            context: "customLabels"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Files2',
            source: 'Files online',
            target: 'Fichiers en ligne',
            targetLocale: "fr-FR",
            datatype: "xml",
            context: "customTabs"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'LogACall',
            source: 'LogACall',
            target: 'EnregistrerUnAppel',
            targetLocale: "fr-FR",
            datatype: "xml",
            context: "quickActions"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt',
            source: 'Screen Flows',
            target: "Coule d'écran",
            targetLocale: "fr-FR",
            datatype: "xml",
            context: "reportTypes"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.description',
            source: 'Screen Flows Description',
            target: "Description de coule d'écran",
            targetLocale: "fr-FR",
            datatype: "xml",
            context: "reportTypes"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.Flow Interview Log Entries',
            source: 'Flow Interview Log Entries',
            target: "Entrées de journal pour coule de entretien",
            targetLocale: "fr-FR",
            datatype: "xml",
            context: "reportTypes.sections"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.Flow Interview Logs',
            source: 'Flow Interview Logs',
            target: "Journals pour coule de entretien",
            targetLocale: "fr-FR",
            datatype: "xml",
            context: "reportTypes.sections"
        }));

        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test',
            source: 'Test',
            target: 'Testen',
            targetLocale: "de-DE",
            datatype: "xml",
            context: "customApplications"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Force_com',
            source: 'Force.com',
            target: 'Force.de',
            targetLocale: "de-DE",
            datatype: "xml",
            context: "customApplications"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Account',
            source: 'Text Account',
            target: 'Texteskonto',
            targetLocale: "de-DE",
            datatype: "xml",
            context: "customLabels"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Files2',
            source: 'Files online',
            target: 'Dateien online',
            targetLocale: "de-DE",
            datatype: "xml",
            context: "customTabs"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'LogACall',
            source: 'LogACall',
            target: 'EinenAnrufProtokollieren',
            targetLocale: "de-DE",
            datatype: "xml",
            context: "quickActions"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt',
            source: 'Screen Flows',
            target: "Bildschirmsflussen",
            targetLocale: "de-DE",
            datatype: "xml",
            context: "reportTypes"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.description',
            source: 'Screen Flows Description',
            target: "Beschreibung des Bildschirmsflussen",
            targetLocale: "de-DE",
            datatype: "xml",
            context: "reportTypes"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.Flow Interview Log Entries',
            source: 'Flow Interview Log Entries',
            target: "Protokolleinträge von Flussinterviews",
            targetLocale: "de-DE",
            datatype: "xml",
            context: "reportTypes.sections"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.Flow Interview Logs',
            source: 'Flow Interview Logs',
            target: "Protokollen von Flussinterviews",
            targetLocale: "de-DE",
            datatype: "xml",
            context: "reportTypes.sections"
        }));

        mxf.localize(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/force-app/main/default/translations/fr.translation-meta.xml"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/force-app/main/default/translations/de.translation-meta.xml"))).toBeTruthy();

        var content = fs.readFileSync(path.join(base, "testfiles/force-app/main/default/translations/fr.translation-meta.xml"), "UTF-8");

        var expected =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>Testez</label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '    <customApplications>\n' +
            '        <label>Force.fr</label>\n' +
            '        <name>Force_com</name>\n' +
            '    </customApplications>\n' +
            '    <customLabels>\n' +
            '        <label>Compte de texte</label>\n' +
            '        <name>Account</name>\n' +
            '    </customLabels>\n' +
            '    <customTabs>\n' +
            '        <label>Fichiers en ligne</label>\n' +
            '        <name>Files2</name>\n' +
            '    </customTabs>\n' +
            '    <quickActions>\n' +
            '        <label>EnregistrerUnAppel</label>\n' +
            '        <name>LogACall</name>\n' +
            '    </quickActions>\n' +
            '    <reportTypes>\n' +
            '        <description>Description de coule d\'écran</description>\n' +
            '        <label>Coule d\'écran</label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <label>Entrées de journal pour coule de entretien</label>\n' +
            '            <name>Flow Interview Log Entries</name>\n' +
            '        </sections>\n' +
            '        <sections>\n' +
            '            <label>Journals pour coule de entretien</label>\n' +
            '            <name>Flow Interview Logs</name>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n';

        diff(content, expected);
        expect(content).toBe(expected);

        content = fs.readFileSync(path.join(base, "testfiles/force-app/main/default/translations/de.translation-meta.xml"), "UTF-8");

        var expected =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>Testen</label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '    <customApplications>\n' +
            '        <label>Force.de</label>\n' +
            '        <name>Force_com</name>\n' +
            '    </customApplications>\n' +
            '    <customLabels>\n' +
            '        <label>Texteskonto</label>\n' +
            '        <name>Account</name>\n' +
            '    </customLabels>\n' +
            '    <customTabs>\n' +
            '        <label>Dateien online</label>\n' +
            '        <name>Files2</name>\n' +
            '    </customTabs>\n' +
            '    <quickActions>\n' +
            '        <label>EinenAnrufProtokollieren</label>\n' +
            '        <name>LogACall</name>\n' +
            '    </quickActions>\n' +
            '    <reportTypes>\n' +
            '        <description>Beschreibung des Bildschirmsflussen</description>\n' +
            '        <label>Bildschirmsflussen</label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <label>Protokolleinträge von Flussinterviews</label>\n' +
            '            <name>Flow Interview Log Entries</name>\n' +
            '        </sections>\n' +
            '        <sections>\n' +
            '            <label>Protokollen von Flussinterviews</label>\n' +
            '            <name>Flow Interview Logs</name>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });
*/

    test("MetaXmlFileLocalizeWrite", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        var mxf = mxft.newFile("./force-app/main/default/translations/en_US.translation-meta.xml");
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        // now read the other xml files to find the source strings
        [
            "./force-app/all/labels/MyLabels.labels-meta.xml",
            "./force-app/main/default/application/MyApp.app-meta.xml",
            "./force-app/main/default/customMetadata/MyApp_Setting.Default_Configuration.md-meta.xml",
            "./force-app/main/default/customPermissions/MyApp_Admin.customPermissions-meta.xml",
            "./force-app/main/default/objects/Foo__c/fields/AccessToken_Expr__c.field-meta.xml",
            "./force-app/main/default/objects/Foo__c/fields/Allocation_status__c.field-meta.xml",
            "./force-app/main/default/objects/Foo__c/fields/Collaboration__c.field-meta.xml",
            "./force-app/main/default/objects/Foo__c/fields/Retry_Count__c.field-meta.xml",
            "./force-app/main/default/objects/Foo__c/listviews/ListView.listView-meta.xml",
            "./force-app/main/default/objects/Foo__c/Foo__c.object-meta.xml",
            "./force-app/main/default/quickActions/SendEmail.quickAction-meta.xml",
            "./force-app/main/default/tabs/MyApp_Files2.tab-meta.xml"
        ].forEach(function(pathName) {
            var sourceXml = mxft.newFile(pathName);
            sourceXml.extract();
            mxf.addSet(sourceXml.getTranslationSet());
        });

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'MyApp',
            source: '',
            target: 'MonApp',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'AccessToken_Expr__c',
            source: '',
            target: 'Jetons d\'accès',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Allocation_status__c',
            source: '',
            target: 'Statut d\'attribution',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Collaboration__c',
            source: '',
            target: 'Collaborations',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Retry_Count__c',
            source: '',
            target: 'Nombre de tentatives',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Show_Sender_in_Recipient_List',
            source: '',
            target: 'Afficher l\'expéditeur dans la liste des destinataires',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test_of_emergency_warning_system',
            source: '',
            target: 'Test du système d\'accès d\'urgence',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'String_only_in_translations_meta_xml',
            source: 'Translations Only String',
            target: 'Chaîne qui se trouve uniquement dans les traductions',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'MyApp_Files2',
            source: '',
            target: 'Onglet Fichiers',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'LogACall',
            source: '',
            target: 'EnregistrerUnAppel',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt',
            source: '',
            target: "Coule d'écran",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.description',
            source: '',
            target: "Description de coule d'écran",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Log Entries',
            source: '',
            target: "Entrées de journal pour coule de entretien",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Logs',
            source: '',
            target: "Journals pour coule de entretien",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'MyApp',
            source: '',
            target: 'MeineApp',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'AccessToken_Expr__c',
            source: '',
            target: 'Zugriffstoken',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Allocation_status__c',
            source: '',
            target: 'Zuordnungsstatus',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Collaboration__c',
            source: '',
            target: 'Zusammenarbeit',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Retry_Count__c',
            source: '',
            target: 'Anzahl der Wiederholungen',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Show_Sender_in_Recipient_List',
            source: '',
            target: 'Den Absender in der Empfängerliste anzeigen',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test_of_emergency_warning_system',
            source: '',
            target: 'Test des Notzugangssystems',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'String_only_in_translations_meta_xml',
            source: 'Translations Only String',
            target: 'String, der nur in den Übersetzungen vorkommt',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'MyApp_Files2',
            source: '',
            target: 'Registerkarte Dateien',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'LogACall',
            source: '',
            target: 'Anruf protokollieren',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt',
            source: 'Screen Flows',
            target: "Bildschirmsflussen",
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Log Entries',
            source: 'Flow Interview Log Entries',
            target: "Protokolleinträge von Flussinterviews",
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Logs',
            source: 'Flow Interview Logs',
            target: "Protokollen von Flussinterviews",
            targetLocale: "de-DE",
            datatype: "xml"
        }));

        // now cause the localization by asking the filetype object to write
        // out all of them
        mxft.write(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/force-app/main/default/translations/fr.translation-meta.xml"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/force-app/main/default/translations/de.translation-meta.xml"))).toBeTruthy();

        var content = fs.readFileSync(path.join(base, "testfiles/force-app/main/default/translations/fr.translation-meta.xml"), "UTF-8");

        var expected =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>MonApp</label>\n' +
            '        <name>MyApp</name>\n' +
            '    </customApplications>\n' +
            '    <customField>\n' +
            '        <label>Jetons d\'accès</label>\n' +
            '        <name>AccessToken_Expr__c</name>\n' +
            '    </customField>\n' +
            '    <customField>\n' +
            '        <label>Statut d\'attribution</label>\n' +
            '        <name>Allocation_status__c</name>\n' +
            '    </customField>\n' +
            '    <customField>\n' +
            '        <label>Collaborations</label>\n' +
            '        <name>Collaboration__c</name>\n' +
            '    </customField>\n' +
            '    <customField>\n' +
            '        <label>Nombre de tentatives</label>\n' +
            '        <name>Retry_Count__c</name>\n' +
            '    </customField>\n' +
            '    <customLabels>\n' +
            '        <label>Afficher l\'expéditeur dans la liste des destinataires</label>\n' +
            '        <name>Show_Sender_in_Recipient_List</name>\n' +
            '    </customLabels>\n' +
            '    <customLabels>\n' +
            '        <label>Test du système d\'accès d\'urgence</label>\n' +
            '        <name>Test_of_emergency_warning_system</name>\n' +
            '    </customLabels>\n' +
            '    <customLabels>\n' +
            '        <label>Chaîne qui se trouve uniquement dans les traductions</label>\n' +
            '        <name>String_only_in_translations_meta_xml</name>\n' +
            '    </customLabels>\n' +
            '    <customTabs>\n' +
            '        <label>Onglet Fichiers</label>\n' +
            '        <name>MyApp_Files2</name>\n' +
            '    </customTabs>\n' +
            '    <quickActions>\n' +
            '        <label>EnregistrerUnAppel</label>\n' +
            '        <name>LogACall</name>\n' +
            '    </quickActions>\n' +
            '    <reportTypes>\n' +
            '        <label>Coule d\'écran</label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <label>Entrées de journal pour coule de entretien</label>\n' +
            '            <name>Flow Interview Log Entries</name>\n' +
            '        </sections>\n' +
            '        <sections>\n' +
            '            <label>Journals pour coule de entretien</label>\n' +
            '            <name>Flow Interview Logs</name>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n';

        diff(content, expected);
        expect(content).toBe(expected);

        content = fs.readFileSync(path.join(base, "testfiles/force-app/main/default/translations/de.translation-meta.xml"), "UTF-8");

        var expected =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>MeineApp</label>\n' +
            '        <name>MyApp</name>\n' +
            '    </customApplications>\n' +
            '    <customField>\n' +
            '        <label>Zugriffstoken</label>\n' +
            '        <name>AccessToken_Expr__c</name>\n' +
            '    </customField>\n' +
            '    <customField>\n' +
            '        <label>Zuordnungsstatus</label>\n' +
            '        <name>Allocation_status__c</name>\n' +
            '    </customField>\n' +
            '    <customField>\n' +
            '        <label>Zusammenarbeit</label>\n' +
            '        <name>Collaboration__c</name>\n' +
            '    </customField>\n' +
            '    <customField>\n' +
            '        <label>Anzahl der Wiederholungen</label>\n' +
            '        <name>Retry_Count__c</name>\n' +
            '    </customField>\n' +
            '    <customLabels>\n' +
            '        <label>Den Absender in der Empfängerliste anzeigen</label>\n' +
            '        <name>Show_Sender_in_Recipient_List</name>\n' +
            '    </customLabels>\n' +
            '    <customLabels>\n' +
            '        <label>Test des Notzugangssystems</label>\n' +
            '        <name>Test_of_emergency_warning_system</name>\n' +
            '    </customLabels>\n' +
            '    <customLabels>\n' +
            '        <label>String, der nur in den Übersetzungen vorkommt</label>\n' +
            '        <name>String_only_in_translations_meta_xml</name>\n' +
            '    </customLabels>\n' +
            '    <customTabs>\n' +
            '        <label>Registerkarte Dateien</label>\n' +
            '        <name>MyApp_Files2</name>\n' +
            '    </customTabs>\n' +
            '    <quickActions>\n' +
            '        <label>Anruf protokollieren</label>\n' +
            '        <name>LogACall</name>\n' +
            '    </quickActions>\n' +
            '    <reportTypes>\n' +
            '        <label>Bildschirmsflussen</label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <label>Protokolleinträge von Flussinterviews</label>\n' +
            '            <name>Flow Interview Log Entries</name>\n' +
            '        </sections>\n' +
            '        <sections>\n' +
            '            <label>Protokollen von Flussinterviews</label>\n' +
            '            <name>Flow Interview Logs</name>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("MetaXmlFileLocalizeWithNoSourceStrings", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        var mxf = mxft.newFile("./force-app/main/default/translations/en_US.translation-meta.xml");
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'MyApp',
            source: '',
            target: 'MonApp',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'AccessToken_Expr__c',
            source: '',
            target: 'Jetons d\'accès',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Allocation_status__c',
            source: '',
            target: 'Statut d\'attribution',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Collaboration__c',
            source: '',
            target: 'Collaborations',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Retry_Count__c',
            source: '',
            target: 'Nombre de tentatives',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Show_Sender_in_Recipient_List',
            source: '',
            target: 'Afficher l\'expéditeur dans la liste des destinataires',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test_of_emergency_warning_system',
            source: '',
            target: 'Test du système d\'accès d\'urgence',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'String_only_in_translations_meta_xml',
            source: 'Translations Only String',
            target: 'Chaîne qui se trouve uniquement dans les traductions',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'MyApp_Files2',
            source: '',
            target: 'Onglet Fichiers',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'LogACall',
            source: '',
            target: 'EnregistrerUnAppel',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt',
            source: '',
            target: "Coule d'écran",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.description',
            source: '',
            target: "Description de coule d'écran",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Log Entries',
            source: '',
            target: "Entrées de journal pour coule de entretien",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Logs',
            source: '',
            target: "Journals pour coule de entretien",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'MyApp',
            source: '',
            target: 'MeineApp',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'AccessToken_Expr__c',
            source: '',
            target: 'Zugriffstoken',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Allocation_status__c',
            source: '',
            target: 'Zuordnungsstatus',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Collaboration__c',
            source: '',
            target: 'Zusammenarbeit',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Retry_Count__c',
            source: '',
            target: 'Anzahl der Wiederholungen',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Show_Sender_in_Recipient_List',
            source: '',
            target: 'Den Absender in der Empfängerliste anzeigen',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test_of_emergency_warning_system',
            source: '',
            target: 'Test des Notzugangssystems',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'String_only_in_translations_meta_xml',
            source: 'Translations Only String',
            target: 'String, der nur in den Übersetzungen vorkommt',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'MyApp_Files2',
            source: '',
            target: 'Registerkarte Dateien',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'LogACall',
            source: '',
            target: 'Anruf protokollieren',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt',
            source: 'Screen Flows',
            target: "Bildschirmsflussen",
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Log Entries',
            source: 'Flow Interview Log Entries',
            target: "Protokolleinträge von Flussinterviews",
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Logs',
            source: 'Flow Interview Logs',
            target: "Protokollen von Flussinterviews",
            targetLocale: "de-DE",
            datatype: "xml"
        }));

        // now cause the localization by asking the filetype object to write
        // out all of them. This should work despite the lack of source strings.
        mxft.write(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/force-app/main/default/translations/fr.translation-meta.xml"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/force-app/main/default/translations/de.translation-meta.xml"))).toBeTruthy();

        var content = fs.readFileSync(path.join(base, "testfiles/force-app/main/default/translations/fr.translation-meta.xml"), "UTF-8");

        var expected =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>MonApp</label>\n' +
            '        <name>MyApp</name>\n' +
            '    </customApplications>\n' +
            '    <customField>\n' +
            '        <label>Jetons d\'accès</label>\n' +
            '        <name>AccessToken_Expr__c</name>\n' +
            '    </customField>\n' +
            '    <customField>\n' +
            '        <label>Statut d\'attribution</label>\n' +
            '        <name>Allocation_status__c</name>\n' +
            '    </customField>\n' +
            '    <customField>\n' +
            '        <label>Collaborations</label>\n' +
            '        <name>Collaboration__c</name>\n' +
            '    </customField>\n' +
            '    <customField>\n' +
            '        <label>Nombre de tentatives</label>\n' +
            '        <name>Retry_Count__c</name>\n' +
            '    </customField>\n' +
            '    <customLabels>\n' +
            '        <label>Afficher l\'expéditeur dans la liste des destinataires</label>\n' +
            '        <name>Show_Sender_in_Recipient_List</name>\n' +
            '    </customLabels>\n' +
            '    <customLabels>\n' +
            '        <label>Test du système d\'accès d\'urgence</label>\n' +
            '        <name>Test_of_emergency_warning_system</name>\n' +
            '    </customLabels>\n' +
            '    <customLabels>\n' +
            '        <label>Chaîne qui se trouve uniquement dans les traductions</label>\n' +
            '        <name>String_only_in_translations_meta_xml</name>\n' +
            '    </customLabels>\n' +
            '    <customTabs>\n' +
            '        <label>Onglet Fichiers</label>\n' +
            '        <name>MyApp_Files2</name>\n' +
            '    </customTabs>\n' +
            '    <quickActions>\n' +
            '        <label>EnregistrerUnAppel</label>\n' +
            '        <name>LogACall</name>\n' +
            '    </quickActions>\n' +
            '    <reportTypes>\n' +
            '        <label>Coule d\'écran</label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <label>Entrées de journal pour coule de entretien</label>\n' +
            '            <name>Flow Interview Log Entries</name>\n' +
            '        </sections>\n' +
            '        <sections>\n' +
            '            <label>Journals pour coule de entretien</label>\n' +
            '            <name>Flow Interview Logs</name>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n';

        diff(content, expected);
        expect(content).toBe(expected);

        content = fs.readFileSync(path.join(base, "testfiles/force-app/main/default/translations/de.translation-meta.xml"), "UTF-8");

        var expected =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>MeineApp</label>\n' +
            '        <name>MyApp</name>\n' +
            '    </customApplications>\n' +
            '    <customField>\n' +
            '        <label>Zugriffstoken</label>\n' +
            '        <name>AccessToken_Expr__c</name>\n' +
            '    </customField>\n' +
            '    <customField>\n' +
            '        <label>Zuordnungsstatus</label>\n' +
            '        <name>Allocation_status__c</name>\n' +
            '    </customField>\n' +
            '    <customField>\n' +
            '        <label>Zusammenarbeit</label>\n' +
            '        <name>Collaboration__c</name>\n' +
            '    </customField>\n' +
            '    <customField>\n' +
            '        <label>Anzahl der Wiederholungen</label>\n' +
            '        <name>Retry_Count__c</name>\n' +
            '    </customField>\n' +
            '    <customLabels>\n' +
            '        <label>Den Absender in der Empfängerliste anzeigen</label>\n' +
            '        <name>Show_Sender_in_Recipient_List</name>\n' +
            '    </customLabels>\n' +
            '    <customLabels>\n' +
            '        <label>Test des Notzugangssystems</label>\n' +
            '        <name>Test_of_emergency_warning_system</name>\n' +
            '    </customLabels>\n' +
            '    <customLabels>\n' +
            '        <label>String, der nur in den Übersetzungen vorkommt</label>\n' +
            '        <name>String_only_in_translations_meta_xml</name>\n' +
            '    </customLabels>\n' +
            '    <customTabs>\n' +
            '        <label>Registerkarte Dateien</label>\n' +
            '        <name>MyApp_Files2</name>\n' +
            '    </customTabs>\n' +
            '    <quickActions>\n' +
            '        <label>Anruf protokollieren</label>\n' +
            '        <name>LogACall</name>\n' +
            '    </quickActions>\n' +
            '    <reportTypes>\n' +
            '        <label>Bildschirmsflussen</label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <label>Protokolleinträge von Flussinterviews</label>\n' +
            '            <name>Flow Interview Log Entries</name>\n' +
            '        </sections>\n' +
            '        <sections>\n' +
            '            <label>Protokollen von Flussinterviews</label>\n' +
            '            <name>Flow Interview Logs</name>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("MetaXmlFileLocalizeNoStrings", function() {
        expect.assertions(5);

        var base = path.dirname(module.id);

        var mxf = mxft2.newFile("./xml/en-US.translation-meta.xml");
        expect(mxf).toBeTruthy();

        // set up
        if (fs.existsSync(path.join(base, "testfiles/xml/de.translation-meta.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/xml/de.translation-meta.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/xml/fr.translation-meta.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/xml/fr.translation-meta.xml"));
        }

        expect(!fs.existsSync(path.join(base, "testfiles/xml/de.translation-meta.xml"))).toBeTruthy();
        expect(!fs.existsSync(path.join(base, "testfiles/xml/fr.translation-meta.xml"))).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>Password</label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        var translations = new TranslationSet();
        // some other translations that don't apply to the file above
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'r308704783',
            source: 'Get insurance quotes for free!',
            target: 'Obtenez des devis d\'assurance gratuitement!',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'r308704783',
            source: 'Get insurance quotes for free!',
            target: 'Kostenlosen Versicherungs-Angebote erhalten!',
            targetLocale: "de-DE",
            datatype: "xml"
        }));

        mxft2.write(translations, ["fr-FR", "de-DE"]);

        // should produce the files, even if there is nothing to localize in them
        expect(fs.existsSync(path.join(base, "testfiles/xml/de.translation-meta.xml"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/xml/fr.translation-meta.xml"))).toBeTruthy();

        if (fs.existsSync(path.join(base, "testfiles/xml/de.translation-meta.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/xml/de.translation-meta.xml"));
        }
        if (fs.existsSync(path.join(base, "testfiles/xml/fr.translation-meta.xml"))) {
            fs.unlinkSync(path.join(base, "testfiles/xml/fr.translation-meta.xml"));
        }
    });

    test("MetaXmlFileLocalizeNewStringsNoSources", function() {
        expect.assertions(26);

        var base = path.dirname(module.id);

        // clear the existing files and strings first
        mxft.files = {};
        var newStrings = mxft.getNew();
        newStrings.clear();
        expect(newStrings.size()).toBe(0);

        var mxf = mxft.newFile("./force-app/main/default/translations/en_US.translation-meta.xml");
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Collaboration__c',
            source: '',
            target: 'Collaborations',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Retry_Count__c',
            source: '',
            target: 'Nombre de tentatives',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Show_Sender_in_Recipient_List',
            source: '',
            target: 'Afficher l\'expéditeur dans la liste des destinataires',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test_of_emergency_warning_system',
            source: '',
            target: 'Test du système d\'accès d\'urgence',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'String_only_in_translations_meta_xml',
            source: 'Translations Only String',
            target: 'Chaîne qui se trouve uniquement dans les traductions',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'MyApp_Files2',
            source: '',
            target: 'Onglet Fichiers',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'LogACall',
            source: '',
            target: 'EnregistrerUnAppel',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt',
            source: '',
            target: "Coule d'écran",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.description',
            source: '',
            target: "Description de coule d'écran",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Log Entries',
            source: '',
            target: "Entrées de journal pour coule de entretien",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Logs',
            source: '',
            target: "Journals pour coule de entretien",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Collaboration__c',
            source: '',
            target: 'Zusammenarbeit',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Retry_Count__c',
            source: '',
            target: 'Anzahl der Wiederholungen',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Show_Sender_in_Recipient_List',
            source: '',
            target: 'Den Absender in der Empfängerliste anzeigen',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test_of_emergency_warning_system',
            source: '',
            target: 'Test des Notzugangssystems',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'String_only_in_translations_meta_xml',
            source: 'Translations Only String',
            target: 'String, der nur in den Übersetzungen vorkommt',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'MyApp_Files2',
            source: '',
            target: 'Registerkarte Dateien',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'LogACall',
            source: '',
            target: 'Anruf protokollieren',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt',
            source: 'Screen Flows',
            target: "Bildschirmsflussen",
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Log Entries',
            source: 'Flow Interview Log Entries',
            target: "Protokolleinträge von Flussinterviews",
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Logs',
            source: 'Flow Interview Logs',
            target: "Protokollen von Flussinterviews",
            targetLocale: "de-DE",
            datatype: "xml"
        }));

        // now cause the localization by asking the filetype object to write
        // out all of them. This should work despite the lack of source strings.
        mxft.write(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/force-app/main/default/translations/fr.translation-meta.xml"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/force-app/main/default/translations/de.translation-meta.xml"))).toBeTruthy();

        newStrings = mxft.getNew();
        expect(newStrings).toBeTruthy();
        expect(newStrings.size()).toBe(6);

        var resources = newStrings.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(6);

        expect(resources[0].getKey()).toBe("MyApp");
        expect(!resources[0].getSource()).toBeTruthy();
        expect(resources[0].getTargetLocale()).toBe("fr-FR");

        expect(resources[1].getKey()).toBe("AccessToken_Expr__c");
        expect(!resources[1].getSource()).toBeTruthy();
        expect(resources[1].getTargetLocale()).toBe("fr-FR");

        expect(resources[2].getKey()).toBe("Allocation_status__c");
        expect(!resources[2].getSource()).toBeTruthy();
        expect(resources[2].getTargetLocale()).toBe("fr-FR");

        expect(resources[3].getKey()).toBe("MyApp");
        expect(!resources[3].getSource()).toBeTruthy();
        expect(resources[3].getTargetLocale()).toBe("de-DE");

        expect(resources[4].getKey()).toBe("AccessToken_Expr__c");
        expect(!resources[4].getSource()).toBeTruthy();
        expect(resources[4].getTargetLocale()).toBe("de-DE");

        expect(resources[5].getKey()).toBe("Allocation_status__c");
        expect(!resources[5].getSource()).toBeTruthy();
        expect(resources[5].getTargetLocale()).toBe("de-DE");
    });

    test("MetaXmlFileLocalizeNewStringsWithSources", function() {
        expect.assertions(26);

        var base = path.dirname(module.id);

        // clear the existing files and strings first
        mxft.files = {};
        var newStrings = mxft.getNew();
        newStrings.clear();
        expect(newStrings.size()).toBe(0);

        var mxf = mxft.newFile("./force-app/main/default/translations/en_US.translation-meta.xml");
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        // now read the other xml files to find the source strings
        [
            "./force-app/all/labels/MyLabels.labels-meta.xml",
            "./force-app/main/default/application/MyApp.app-meta.xml",
            "./force-app/main/default/customMetadata/MyApp_Setting.Default_Configuration.md-meta.xml",
            "./force-app/main/default/customPermissions/MyApp_Admin.customPermissions-meta.xml",
            "./force-app/main/default/objects/Foo__c/fields/AccessToken_Expr__c.field-meta.xml",
            "./force-app/main/default/objects/Foo__c/fields/Allocation_status__c.field-meta.xml",
            "./force-app/main/default/objects/Foo__c/fields/Collaboration__c.field-meta.xml",
            "./force-app/main/default/objects/Foo__c/fields/Retry_Count__c.field-meta.xml",
            "./force-app/main/default/objects/Foo__c/listviews/ListView.listView-meta.xml",
            "./force-app/main/default/objects/Foo__c/Foo__c.object-meta.xml",
            "./force-app/main/default/quickActions/SendEmail.quickAction-meta.xml",
            "./force-app/main/default/tabs/MyApp_Files2.tab-meta.xml"
        ].forEach(function(pathName) {
            var sourceXml = mxft.newFile(pathName);
            sourceXml.extract();
            mxf.addSet(sourceXml.getTranslationSet());
        });

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Collaboration__c',
            source: '',
            target: 'Collaborations',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Retry_Count__c',
            source: '',
            target: 'Nombre de tentatives',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Show_Sender_in_Recipient_List',
            source: '',
            target: 'Afficher l\'expéditeur dans la liste des destinataires',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test_of_emergency_warning_system',
            source: '',
            target: 'Test du système d\'accès d\'urgence',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'String_only_in_translations_meta_xml',
            source: 'Translations Only String',
            target: 'Chaîne qui se trouve uniquement dans les traductions',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'MyApp_Files2',
            source: '',
            target: 'Onglet Fichiers',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'LogACall',
            source: '',
            target: 'EnregistrerUnAppel',
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt',
            source: '',
            target: "Coule d'écran",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.description',
            source: '',
            target: "Description de coule d'écran",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Log Entries',
            source: '',
            target: "Entrées de journal pour coule de entretien",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Logs',
            source: '',
            target: "Journals pour coule de entretien",
            targetLocale: "fr-FR",
            datatype: "xml"
        }));

        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Collaboration__c',
            source: '',
            target: 'Zusammenarbeit',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Retry_Count__c',
            source: '',
            target: 'Anzahl der Wiederholungen',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Show_Sender_in_Recipient_List',
            source: '',
            target: 'Den Absender in der Empfängerliste anzeigen',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test_of_emergency_warning_system',
            source: '',
            target: 'Test des Notzugangssystems',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'String_only_in_translations_meta_xml',
            source: 'Translations Only String',
            target: 'String, der nur in den Übersetzungen vorkommt',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'MyApp_Files2',
            source: '',
            target: 'Registerkarte Dateien',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'LogACall',
            source: '',
            target: 'Anruf protokollieren',
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt',
            source: 'Screen Flows',
            target: "Bildschirmsflussen",
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Log Entries',
            source: 'Flow Interview Log Entries',
            target: "Protokolleinträge von Flussinterviews",
            targetLocale: "de-DE",
            datatype: "xml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Flow Interview Logs',
            source: 'Flow Interview Logs',
            target: "Protokollen von Flussinterviews",
            targetLocale: "de-DE",
            datatype: "xml"
        }));

        // now cause the localization by asking the filetype object to write
        // out all of them. This should work despite the lack of source strings.
        mxft.write(translations, ["fr-FR", "de-DE"]);

        expect(fs.existsSync(path.join(base, "testfiles/force-app/main/default/translations/fr.translation-meta.xml"))).toBeTruthy();
        expect(fs.existsSync(path.join(base, "testfiles/force-app/main/default/translations/de.translation-meta.xml"))).toBeTruthy();

        newStrings = mxft.getNew();
        expect(newStrings).toBeTruthy();
        expect(newStrings.size()).toBe(6);

        var resources = newStrings.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(6);

        expect(resources[0].getKey()).toBe("MyApp");
        expect(resources[0].getSource()).toBe("My Application");
        expect(resources[0].getTargetLocale()).toBe("fr-FR");

        expect(resources[1].getKey()).toBe("AccessToken_Expr__c");
        expect(resources[1].getSource()).toBe("Access token expired");
        expect(resources[1].getTargetLocale()).toBe("fr-FR");

        expect(resources[2].getKey()).toBe("Allocation_status__c");
        expect(resources[2].getSource()).toBe("Allocation status");
        expect(resources[2].getTargetLocale()).toBe("fr-FR");

        expect(resources[3].getKey()).toBe("MyApp");
        expect(resources[3].getSource()).toBe("My Application");
        expect(resources[3].getTargetLocale()).toBe("de-DE");

        expect(resources[4].getKey()).toBe("AccessToken_Expr__c");
        expect(resources[4].getSource()).toBe("Access token expired");
        expect(resources[4].getTargetLocale()).toBe("de-DE");

        expect(resources[5].getKey()).toBe("Allocation_status__c");
        expect(resources[5].getSource()).toBe("Allocation status");
        expect(resources[5].getTargetLocale()).toBe("de-DE");
    });

    test("MetaXmlFileLocalizeRightNewStrings", function() {
        expect.assertions(8);

        var base = path.dirname(module.id);

        var mxft2 = new MetaXmlFileType(p2);
        var mxf = new MetaXmlFile({
            project: p2,
            pathName: "./force-app/main/default/translations/en_US.translation-meta.xml",
            type: mxft2
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>Password</label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'foo',
            source: 'bar',
            target: 'asdf',
            targetLocale: "de-DE",
            datatype: "xml",
            context: "customApplications"
        }));

        content = mxf.localizeText(translations, "de-DE");

        var expected =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>Password</label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n';

        diff(content, expected);
        expect(content).toBe(expected);

        var newSet = mxft2.getNew();

        expect(newSet.size()).toBe(1);
        var res = newSet.getAll();
        expect(res[0].reskey).toBe("Test");
        expect(res[0].source).toBe("Password");
        expect(res[0].sourceLocale).toBe("en-US");
        expect(res[0].targetLocale).toBe("de-DE");
        expect(res[0].state).toBe("new");
    });

    test("MetaXmlFileLocalizeWithPseudo", function() {
        expect.assertions(2);

        var base = path.dirname(module.id);

        var p3 = new CustomProject({
            name: "forceapp",
            id: "forceapp",
            sourceLocale: "en-US",
            plugins: [
                path.join(process.cwd(), "MetaXmlFileType")
            ]
        }, "./test/testfiles", {
            locales:["en-GB"],
            targetDir: "testfiles"
        });

        var t2 = new MetaXmlFileType(p3);
        var mxf = new MetaXmlFile({
            project: p3,
            pathName: "./xml/en.translation-meta.xml",
            type: t2
        });
        expect(mxf).toBeTruthy();

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>Password</label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'foo',
            source: 'bar',
            target: 'asdf',
            targetLocale: "de-DE",
            datatype: "xml",
            context: "customLabels"
        }));

        content = mxf.localizeText(translations, "de-DE");

        // missing translations replaced with pseudo!
        var expected =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>Pàššŵõŕð3210</label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n';

        diff(content, expected);
        expect(content).toBe(expected);
    });

    test("MetaXmlFileLocalizeExtractedStringsWithSources", function() {
        expect.assertions(17);

        var base = path.dirname(module.id);

        // clear the existing files and strings first
        mxft.files = {};

        var mxf = mxft.newFile("./force-app/main/default/translations/en_US.translation-meta.xml");
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        // now read the other xml files to find the source strings
        [
            "./force-app/all/labels/MyLabels.labels-meta.xml",
            "./force-app/main/default/application/MyApp.app-meta.xml",
            "./force-app/main/default/customMetadata/MyApp_Setting.Default_Configuration.md-meta.xml",
            "./force-app/main/default/customPermissions/MyApp_Admin.customPermissions-meta.xml",
            "./force-app/main/default/objects/Foo__c/fields/AccessToken_Expr__c.field-meta.xml",
            "./force-app/main/default/objects/Foo__c/fields/Allocation_status__c.field-meta.xml",
            "./force-app/main/default/objects/Foo__c/fields/Collaboration__c.field-meta.xml",
            "./force-app/main/default/objects/Foo__c/fields/Retry_Count__c.field-meta.xml",
            "./force-app/main/default/objects/Foo__c/listviews/ListView.listView-meta.xml",
            "./force-app/main/default/objects/Foo__c/Foo__c.object-meta.xml",
            "./force-app/main/default/quickActions/SendEmail.quickAction-meta.xml",
            "./force-app/main/default/tabs/MyApp_Files2.tab-meta.xml"
        ].forEach(function(pathName) {
            var sourceXml = mxft.newFile(pathName);
            sourceXml.extract();
            mxf.addSet(sourceXml.getTranslationSet());
        });

        // there are 13 resources + 5 unused source strings from
        // the other meta.xml files
        extracted = mxf.getTranslationSet();
        expect(extracted).toBeTruthy();
        expect(extracted.size()).toBe(18);

        var resources = extracted.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(18);

        expect(resources[0].getKey()).toBe("MyApp");
        expect(resources[0].getSource()).toBe("My Application");
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(!resources[0].getTargetLocale()).toBeTruthy();

        expect(resources[1].getKey()).toBe("AccessToken_Expr__c");
        expect(resources[1].getSource()).toBe("Access token expired");
        expect(resources[1].getSourceLocale()).toBe("en-US");
        expect(!resources[1].getTargetLocale()).toBeTruthy();

        expect(resources[2].getKey()).toBe("Allocation_status__c");
        expect(resources[2].getSource()).toBe("Allocation status");
        expect(resources[2].getSourceLocale()).toBe("en-US");
        expect(!resources[2].getTargetLocale()).toBeTruthy();
    });

    test("MetaXmlFileLocalizeExtractedStringsWithoutSources", function() {
        expect.assertions(17);

        var base = path.dirname(module.id);

        // clear the existing files and strings first
        mxft.files = {};

        var mxf = mxft.newFile("./force-app/main/default/translations/en_US.translation-meta.xml");
        expect(mxf).toBeTruthy();

        // should read the file
        mxf.extract();

        // there are 13 resources
        extracted = mxf.getTranslationSet();
        expect(extracted).toBeTruthy();
        expect(extracted.size()).toBe(13);

        var resources = extracted.getAll();
        expect(resources).toBeTruthy();
        expect(resources.length).toBe(13);

        expect(resources[0].getKey()).toBe("MyApp");
        expect(!resources[0].getSource()).toBeTruthy();
        expect(resources[0].getSourceLocale()).toBe("en-US");
        expect(!resources[0].getTargetLocale()).toBeTruthy();

        expect(resources[1].getKey()).toBe("AccessToken_Expr__c");
        expect(!resources[1].getSource()).toBeTruthy();
        expect(resources[1].getSourceLocale()).toBe("en-US");
        expect(!resources[1].getTargetLocale()).toBeTruthy();

        expect(resources[2].getKey()).toBe("Allocation_status__c");
        expect(!resources[2].getSource()).toBeTruthy();
        expect(resources[2].getSourceLocale()).toBe("en-US");
        expect(!resources[2].getTargetLocale()).toBeTruthy();
    });
});
