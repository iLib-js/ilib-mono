/*
 * testMetaXmlFile.js - test the MetaXml file handler object.
 *
 * Copyright © 2021, Box, Inc.
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
    var TranslationSet =  require("loctool/lib/TranslationSet.js");
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
    targetDir: "testfiles"
});

var t = new MetaXmlFileType(p2);

module.exports.metaxmlfile = {
    // make sure to initialize the file types so that the tests below can use
    // a ContextResourceString instead of a regular ContextResourceString
    testMetaXmlInit: function(test) {
        p.init(function() {
            p2.init(function() {
                test.done();
            });
        });
    },

    testMetaXmlFileConstructor: function(test) {
        test.expect(1);

        var mxf = new MetaXmlFile({
            project: p
        });
        test.ok(mxf);

        test.done();
    },

    testMetaXmlFileConstructorParams: function(test) {
        test.expect(1);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./testfiles/force-app/main/default/translations/en_US.translation-meta.xml",
            type: mxft
        });

        test.ok(mxf);

        test.done();
    },

    testMetaXmlFileConstructorNoFile: function(test) {
        test.expect(1);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        test.done();
    },

    testMetaXmlFileMakeKey: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        test.equal(mxf.makeKey("This is a test"), "r654479252");

        test.done();
    },

    testMetaXmlFileMakeKeySimpleTexts1: function(test) {
        test.expect(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        test.equals(mxf.makeKey("Preferences in your profile"), "r372802078");
        test.equals(mxf.makeKey("All settings"), "r725930887");
        test.equals(mxf.makeKey("Colour scheme"), "r734599412");
        test.equals(mxf.makeKey("Experts"), "r343852585");

        test.done();
    },

    testMetaXmlFileMakeKeyUnescaped: function(test) {
        test.expect(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        test.equals(mxf.makeKey("foo \\n \\t bar"), "r1056543475");
        test.equals(mxf.makeKey("\\n \\t bar"), "r755240053");
        test.equals(mxf.makeKey("The \\'Dude\\' played by Jeff Bridges"), "r600298088");
        test.equals(mxf.makeKey("\\'Dude\\'"), "r6259609");

        test.done();
    },

    testMetaXmlFileMakeKeySimpleTexts2: function(test) {
        test.expect(6);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        test.equals(mxf.makeKey("Procedures"), "r807691021");
        test.equals(mxf.makeKey("Mobile Apps"), "r898923204");
        test.equals(mxf.makeKey("Settings in your profile"), "r618035987");
        test.equals(mxf.makeKey("Product Reviews"), "r175350918");
        test.equals(mxf.makeKey("Answers"), "r221604632");

        test.done();
    },

    testMetaXmlFileMakeKeySimpleTexts3: function(test) {
        test.expect(9);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        test.equals(mxf.makeKey("Private Profile"), "r314592735");
        test.equals(mxf.makeKey("People you are connected to"), "r711926199");
        test.equals(mxf.makeKey("Notifications"), "r284964820");
        test.equals(mxf.makeKey("News"), "r613036745");
        test.equals(mxf.makeKey("More Tips"), "r216617786");
        test.equals(mxf.makeKey("Filters"), "r81370429");
        test.equals(mxf.makeKey("Referral Link"), "r140625167");
        test.equals(mxf.makeKey("Questions"), "r256277957");

        test.done();
    },

    testMetaXmlFileMakeKeyEscapes: function(test) {
        test.expect(3);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        test.equals(mxf.makeKey("Can\'t find id"), "r743945592");
        test.equals(mxf.makeKey("Can\'t find an application for SMS"), "r909283218");

        test.done();
    },

    testMetaXmlFileMakeKeyPunctuation: function(test) {
        test.expect(8);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        test.equals(mxf.makeKey("{name}({generic_name})"), "r300446104");
        test.equals(mxf.makeKey("{name}, {sharer_name} {start}found this interesting{end}"), "r8321889");
        test.equals(mxf.makeKey("{sharer_name} {start}found this interesting{end}"), "r639868344");
        test.equals(mxf.makeKey("Grow your Network"), "r895214324");
        test.equals(mxf.makeKey("Failed to send connection request!"), "r1015770123");
        test.equals(mxf.makeKey("{goal_name} Goals"), "r993422001");
        test.equals(mxf.makeKey("Connection link copied!"), "r180897411");

        test.done();
    },

    testMetaXmlFileMakeKeySameStringMeansSameKey: function(test) {
        test.expect(3);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        test.equal(mxf.makeKey("This is a test"), "r654479252");
        test.equal(mxf.makeKey("This is a test"), "r654479252");

        test.done();
    },

    testMetaXmlFileMakeKeyCompressWhiteSpace: function(test) {
        test.expect(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        test.equal(mxf.makeKey("Can\'t find  id"), "r743945592");
        test.equal(mxf.makeKey("Can\'t    find               id"), "r743945592");

        test.equal(mxf.makeKey("Can\'t find an application for SMS"), "r909283218");
        test.equal(mxf.makeKey("Can\'t   \t\n \t   find an    \t \n \r   application for SMS"), "r909283218");

        test.done();
    },

    testMetaXmlFileMakeKeyTrimWhiteSpace: function(test) {
        test.expect(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        test.equal(mxf.makeKey("Can\'t find  id"), "r743945592");
        test.equal(mxf.makeKey("      Can\'t find  id "), "r743945592");

        test.equal(mxf.makeKey("Can\'t find an application for SMS"), "r909283218");
        test.equal(mxf.makeKey(" \t\t\n\r    Can\'t find an application for SMS   \n \t \r"), "r909283218");

        test.done();
    },

    testMetaXmlFileMakeKeyNewLines: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({project: p});
        test.ok(mxf);

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equals(mxf.makeKey("A \n B"), "r191336864");

        test.done();
    },

    testMetaXmlFileMakeKeyEscapeN: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({project: p});
        test.ok(mxf);

        // makeKey is used for double-quoted strings, which ruby interprets before it is used
        test.equals(mxf.makeKey("A \\n B"), "r191336864");

        test.done();
    },

    testMetaXmlFileMakeKeyTabs: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({project: p});
        test.ok(mxf);

        test.equals(mxf.makeKey("A \t B"), "r191336864");

        test.done();
    },

    testMetaXmlFileMakeKeyEscapeT: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({project: p});
        test.ok(mxf);

        test.equals(mxf.makeKey("A \\t B"), "r191336864");

        test.done();
    },

    testMetaXmlFileMakeKeyQuotes: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({project: p});
        test.ok(mxf);

        test.equals(mxf.makeKey("A \\'B\\' C"), "r935639115");

        test.done();
    },

    testMetaXmlFileMakeKeyInterpretEscapedUnicodeChars: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({project: p});
        test.ok(mxf);

        test.equals(mxf.makeKey("\\u00A0 \\u0023"), "r2293235");

        test.done();
    },

    testMetaXmlFileMakeKeyInterpretEscapedSpecialChars2: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({project: p});
        test.ok(mxf);

        test.equals(mxf.makeKey("Talk to a support representative live 24/7 via video or \u00a0 text\u00a0chat"), "r969175354");

        test.done();
    },

    testMetaXmlFileMakeKeyInterpretEscapedOctalChars: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({project: p});
        test.ok(mxf);

        test.equals(mxf.makeKey("A \\40 \\011 B"), "r191336864");

        test.done();
    },

    testMetaXmlFileMakeKeyMetaXmlEscapeSequences: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({project: p});
        test.ok(mxf);

        test.equals(mxf.makeKey("A \\b\\t\\n\\f\\r B"), "r191336864");

        test.done();
    },

    testMetaXmlFileMakeKeyCheckRubyCompatibility: function(test) {
        test.expect(13);

        var mxf = new MetaXmlFile({project: p});
        test.ok(mxf);

        test.equals(mxf.makeKey("This has \\\"double quotes\\\" in it."), "r487572481");
        test.equals(mxf.makeKey('This has \\\"double quotes\\\" in it.'), "r487572481");
        test.equals(mxf.makeKey("This has \\\'single quotes\\\' in it."), "r900797640");
        test.equals(mxf.makeKey('This has \\\'single quotes\\\' in it.'), "r900797640");
        test.equals(mxf.makeKey("This is a double quoted string"), "r494590307");
        test.equals(mxf.makeKey('This is a single quoted string'), "r683276274");
        test.equals(mxf.makeKey("This is a double quoted string with \\\"quotes\\\" in it."), "r246354917");
        test.equals(mxf.makeKey('This is a single quoted string with \\\'quotes\\\' in it.'), "r248819747");
        test.equals(mxf.makeKey("This is a double quoted string with \\n return chars in it"), "r1001831480");
        test.equals(mxf.makeKey('This is a single quoted string with \\n return chars in it'), "r147719125");
        test.equals(mxf.makeKey("This is a double quoted string with \\t tab chars in it"), "r276797171");
        test.equals(mxf.makeKey('This is a single quoted string with \\t tab chars in it'), "r303137748");

        test.done();
    },

    testMetaXmlFileParseSimpleGetByKey: function(test) {
        test.expect(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

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
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("forceapp", "customApplications", "en-US", "Test", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "Test");

        test.done();
    },

    testMetaXmlFileParseIgnoreEmpty: function(test) {
        test.expect(3);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

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
        test.ok(set);

        test.equal(set.size(), 0);

        test.done();
    },

    testMetaXmlFileParseSimpleIgnoreWhitespace: function(test) {
        test.expect(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label><!--    Enter Your Password \r \n  --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("forceapp", "customApplications", "en-US", "Test", "metaxml"));
        test.ok(r);
        test.equal(r.getSource(), "Enter Your Password");
        test.equal(r.getKey(), "Test");

        test.done();
    },

    testMetaXmlFileParseSimpleRightSize: function(test) {
        test.expect(4);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        var set = mxf.getTranslationSet();
        test.equal(set.size(), 0);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        test.ok(set);

        test.equal(set.size(), 1);

        test.done();
    },

    testMetaXmlFileParseCustomApplications: function(test) {
        test.expect(6);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

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
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("forceapp", "customApplications", "en-US", "Test", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "Test");
        test.equal(r.getContext(), "customApplications");

        test.done();
    },

    testMetaXmlFileParseCustomLabels: function(test) {
        test.expect(6);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customLabels>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customLabels>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("forceapp", "customLabels", "en-US", "Test", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "Test");
        test.equal(r.getContext(), "customLabels");

        test.done();
    },

    testMetaXmlFileParseCustomTabs: function(test) {
        test.expect(6);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customTabs>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customTabs>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("forceapp", "customTabs", "en-US", "Test", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "Test");
        test.equal(r.getContext(), "customTabs");

        test.done();
    },

    testMetaXmlFileParseQuickActions: function(test) {
        test.expect(6);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <quickActions>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </quickActions>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("forceapp", "quickActions", "en-US", "Test", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "Test");
        test.equal(r.getContext(), "quickActions");

        test.done();
    },

    testMetaXmlFileParseReportTypes: function(test) {
        test.expect(10);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <reportTypes>\n' +
            '        <label><!-- Screen Flows --></label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <label><!-- Flow Interview Log Entries --></label>\n' +
            '            <name>Test1</name>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("forceapp", "reportTypes", "en-US", "screen_flows_prebuilt_crt", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Screen Flows");
        test.equal(r.getKey(), "screen_flows_prebuilt_crt");
        test.equal(r.getContext(), "reportTypes");

        r = set.get(ContextResourceString.hashKey("forceapp", "reportTypes.sections", "en-US", "screen_flows_prebuilt_crt.Test1", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Flow Interview Log Entries");
        test.equal(r.getKey(), "screen_flows_prebuilt_crt.Test1");
        test.equal(r.getContext(), "reportTypes.sections");

        test.done();
    },

    testMetaXmlFileParseReportTypesMultiple: function(test) {
        test.expect(14);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <reportTypes>\n' +
            '        <description><!-- Screen Flows --></description>\n' +
            '        <label><!-- Screen Flows --></label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <label><!-- Flow Interview Log Entries --></label>\n' +
            '            <name>Test1</name>\n' +
            '        </sections>\n' +
            '        <sections>\n' +
            '            <label><!-- Flow Interview Logs --></label>\n' +
            '            <name>Test2</name>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("forceapp", "reportTypes", "en-US", "screen_flows_prebuilt_crt", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Screen Flows");
        test.equal(r.getKey(), "screen_flows_prebuilt_crt");
        test.equal(r.getContext(), "reportTypes");

        r = set.get(ContextResourceString.hashKey("forceapp", "reportTypes.sections", "en-US", "screen_flows_prebuilt_crt.Test1", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Flow Interview Log Entries");
        test.equal(r.getKey(), "screen_flows_prebuilt_crt.Test1");
        test.equal(r.getContext(), "reportTypes.sections");

        r = set.get(ContextResourceString.hashKey("forceapp", "reportTypes.sections", "en-US", "screen_flows_prebuilt_crt.Test2", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Flow Interview Logs");
        test.equal(r.getKey(), "screen_flows_prebuilt_crt.Test2");
        test.equal(r.getContext(), "reportTypes.sections");

        test.done();
    },

    testMetaXmlFileParseReportTypesRightSize: function(test) {
        test.expect(3);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <reportTypes>\n' +
            '        <description><!-- Screen Flows --></description>\n' +
            '        <label><!-- Screen Flows --></label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <label><!-- Flow Interview Log Entries --></label>\n' +
            '            <name>Test1</name>\n' +
            '        </sections>\n' +
            '        <sections>\n' +
            '            <label><!-- Flow Interview Logs --></label>\n' +
            '            <name>Test2</name>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        test.equal(set.size(), 4);

        test.done();
    },

    testMetaXmlFileParseReportTypesWithDescription: function(test) {
        test.expect(14);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <reportTypes>\n' +
            '        <description><!-- Screen Flows Description --></description>\n' +
            '        <label><!-- Screen Flows --></label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <label><!-- Flow Interview Log Entries --></label>\n' +
            '            <name>Test1</name>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("forceapp", "reportTypes", "en-US", "screen_flows_prebuilt_crt", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Screen Flows");
        test.equal(r.getKey(), "screen_flows_prebuilt_crt");
        test.equal(r.getContext(), "reportTypes");

        r = set.get(ContextResourceString.hashKey("forceapp", "reportTypes", "en-US", "screen_flows_prebuilt_crt.description", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Screen Flows Description");
        test.equal(r.getKey(), "screen_flows_prebuilt_crt.description");
        test.equal(r.getContext(), "reportTypes");

        r = set.get(ContextResourceString.hashKey("forceapp", "reportTypes.sections", "en-US", "screen_flows_prebuilt_crt.Test1", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Flow Interview Log Entries");
        test.equal(r.getKey(), "screen_flows_prebuilt_crt.Test1");
        test.equal(r.getContext(), "reportTypes.sections");

        test.done();
    },

    testMetaXmlFileParseWithDups: function(test) {
        test.expect(7);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customLabels>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customLabels>\n' +
            '    <customLabels>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customLabels>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("forceapp", "customLabels", "en-US", "Test", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "Test");
        test.equal(r.getContext(), "customLabels");

        test.equal(set.size(), 1);

        test.done();
    },

    testMetaXmlFileParseWithDupsWithDifferentKeys: function(test) {
        test.expect(11);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customLabels>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test1</name>\n' +
            '    </customLabels>\n' +
            '    <customLabels>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test2</name>\n' +
            '    </customLabels>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.get(ContextResourceString.hashKey("forceapp", "customLabels", "en-US", "Test1", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "Test1");
        test.equal(r.getContext(), "customLabels");

        r = set.get(ContextResourceString.hashKey("forceapp", "customLabels", "en-US", "Test2", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "Test2");
        test.equal(r.getContext(), "customLabels");

        test.equal(set.size(), 2);

        test.done();
    },

    testMetaXmlFileExtractFile: function(test) {
        test.expect(14);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/translations/en_US.translation-meta.xml",
            type: mxft
        });
        test.ok(mxf);

        // should read the file
        mxf.extract();

        var set = mxf.getTranslationSet();

        test.equal(set.size(), 9);

        var r = set.get(ContextResourceString.hashKey("forceapp", "customApplications", "en-US", "Test", "metaxml"));
        test.ok(r);
        test.equal(r.getSource(), "Test");
        test.equal(r.getKey(), "Test");
        test.equal(r.getContext(), "customApplications");

        r = set.get(ContextResourceString.hashKey("forceapp", "customApplications", "en-US", "Force_com", "metaxml"));
        test.ok(r);
        test.equal(r.getSource(), "Force.com");
        test.equal(r.getKey(), "Force_com");
        test.equal(r.getContext(), "customApplications");

        var r = set.get(ContextResourceString.hashKey("forceapp", "reportTypes.sections", "en-US", "screen_flows_prebuilt_crt.Flow Interview Log Entries", "metaxml"));
        test.ok(r);
        test.equal(r.getSource(), "Flow Interview Log Entries");
        test.equal(r.getKey(), "screen_flows_prebuilt_crt.Flow Interview Log Entries");
        test.equal(r.getContext(), "reportTypes.sections");

        test.done();
    },

    testMetaXmlFileExtractUndefinedFile: function(test) {

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        // should attempt to read the file and not fail
        mxf.extract();

        var set = mxf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testMetaXmlFileExtractBogusFile: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translations-meta.xml",
            type: mxft
        });
        test.ok(mxf);

        // should attempt to read the file and not fail
        mxf.extract();

        var set = mxf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testMetaXmlFileGetLocalizedPathSimple: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translation-meta.xml",
            type: mxft
        });
        test.ok(mxf);

        test.equal(mxf.getLocalizedPath("de-DE"), "de.translation-meta.xml");
        test.done();
    },

    testMetaXmlFileGetLocalizedPathWithPath: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "src/translations/en_US.translation-meta.xml",
            type: mxft
        });
        test.ok(mxf);

        test.equal(mxf.getLocalizedPath("de-DE"), "src/translations/de.translation-meta.xml");
        test.done();
    },

    testMetaXmlFileGetLocalizedPathNonDefault: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translation-meta.xml",
            type: mxft
        });
        test.ok(mxf);

        test.equal(mxf.getLocalizedPath("de-AT"), "de_AT.translation-meta.xml");
        test.done();
    },


    testMetaXmlFileGetLocalizedPathSpecialMappingNB: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translation-meta.xml",
            type: mxft
        });
        test.ok(mxf);

        test.equal(mxf.getLocalizedPath("nb-NO"), "no.translation-meta.xml");
        test.done();
    },

    testMetaXmlFileGetLocalizedPathSpecialMappingChinese: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translation-meta.xml",
            type: mxft
        });
        test.ok(mxf);

        test.equal(mxf.getLocalizedPath("zh-Hans-CN"), "zh_CN.translation-meta.xml");
        test.done();
    },

    testMetaXmlFileGetLocalizedPathSpecialMappingOldHebrew: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translation-meta.xml",
            type: mxft
        });
        test.ok(mxf);

        test.equal(mxf.getLocalizedPath("he-IL"), "iw.translation-meta.xml");
        test.done();
    },

    testMetaXmlFileGetLocalizedPathSpecialMappingLatAmSpanish: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translation-meta.xml",
            type: mxft
        });
        test.ok(mxf);

        test.equal(mxf.getLocalizedPath("es-419"), "es_MX.translation-meta.xml");
        test.done();
    },

    testMetaXmlFileGetLocalizedPathSpecialMappingPortugueseNoDefault: function(test) {
        test.expect(3);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./en_US.translation-meta.xml",
            type: mxft
        });
        test.ok(mxf);

        test.equal(mxf.getLocalizedPath("pt_PT"), "pt_PT.translation-meta.xml");
        test.equal(mxf.getLocalizedPath("pt_BR"), "pt_BR.translation-meta.xml");
        test.done();
    },

    testMetaXmlFileLocalizeSimple: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/translations/en_US.translation-meta.xml",
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test',
            source: 'Password',
            target: 'Passwort',
            targetLocale: "de-DE",
            datatype: "metaxml",
            context: "customApplications"
        }));

        content = mxf.localizeText(translations, "de-DE");

        var expected =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>Passwort</label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n';

        diff(content, expected);
        test.equal(content, expected);

        test.done();
    },

    testMetaXmlFileLocalizeTextEscapeXmlSyntax: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/translations/en_US.translation-meta.xml",
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label><!-- Password <name> &uuml; --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test',
            source: 'Password <name> &uuml;',
            target: 'Passwort <name> &uuml;',
            targetLocale: "de-DE",
            datatype: "metaxml",
            context: "customApplications"
        }));

        content = mxf.localizeText(translations, "de-DE");

        var expected =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label>Passwort &lt;name&gt; &amp;uuml;</label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n';

        diff(content, expected);
        test.equal(content, expected);

        test.done();
    },

    testMetaXmlFileLocalizeReportTypes: function(test) {
        test.expect(2);

        var base = path.dirname(module.id);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/translations/en_US.translation-meta.xml",
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <reportTypes>\n' +
            '        <description><!-- Screen Flows Description --></description>\n' +
            '        <label>Coule d\'écran</label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <label>Entrées de journal pour coule de entretien</label>\n' +
            '            <name>Flow Interview Log Entries</name>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt',
            source: 'Screen Flows',
            target: "Coule d'écran",
            targetLocale: "fr-FR",
            datatype: "metaxml",
            context: "reportTypes"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.description',
            source: 'Screen Flows Description',
            target: "Description de coule d'écran",
            targetLocale: "fr-FR",
            datatype: "metaxml",
            context: "reportTypes"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.Flow Interview Log Entries',
            source: 'Flow Interview Log Entries',
            target: "Entrées de journal pour coule de entretien",
            targetLocale: "fr-FR",
            datatype: "metaxml",
            context: "reportTypes.sections"
        }));

        content = mxf.localizeText(translations, "fr-FR");

        var expected =
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <reportTypes>\n' +
            '        <description>Description de coule d\'écran</description>\n' +
            '        <label>Coule d\'écran</label>\n' +
            '        <name>screen_flows_prebuilt_crt</name>\n' +
            '        <sections>\n' +
            '            <label>Entrées de journal pour coule de entretien</label>\n' +
            '            <name>Flow Interview Log Entries</name>\n' +
            '        </sections>\n' +
            '    </reportTypes>\n' +
            '</Translations>\n';

        diff(content, expected);
        test.equal(content, expected);

        test.done();
    },

    testMetaXmlFileLocalize: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/translations/en_US.translation-meta.xml",
            type: mxft
        });
        test.ok(mxf);

        // should read the file
        mxf.extract();

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test',
            source: 'Test',
            target: 'Testez',
            targetLocale: "fr-FR",
            datatype: "metaxml",
            context: "customApplications"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Force_com',
            source: 'Force.com',
            target: 'Force.fr',
            targetLocale: "fr-FR",
            datatype: "metaxml",
            context: "customApplications"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Account',
            source: 'Text Account',
            target: 'Compte de texte',
            targetLocale: "fr-FR",
            datatype: "metaxml",
            context: "customLabels"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Files2',
            source: 'Files online',
            target: 'Fichiers en ligne',
            targetLocale: "fr-FR",
            datatype: "metaxml",
            context: "customTabs"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'LogACall',
            source: 'LogACall',
            target: 'EnregistrerUnAppel',
            targetLocale: "fr-FR",
            datatype: "metaxml",
            context: "quickActions"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt',
            source: 'Screen Flows',
            target: "Coule d'écran",
            targetLocale: "fr-FR",
            datatype: "metaxml",
            context: "reportTypes"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.description',
            source: 'Screen Flows Description',
            target: "Description de coule d'écran",
            targetLocale: "fr-FR",
            datatype: "metaxml",
            context: "reportTypes"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.Flow Interview Log Entries',
            source: 'Flow Interview Log Entries',
            target: "Entrées de journal pour coule de entretien",
            targetLocale: "fr-FR",
            datatype: "metaxml",
            context: "reportTypes.sections"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.Flow Interview Logs',
            source: 'Flow Interview Logs',
            target: "Journals pour coule de entretien",
            targetLocale: "fr-FR",
            datatype: "metaxml",
            context: "reportTypes.sections"
        }));

        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Test',
            source: 'Test',
            target: 'Testen',
            targetLocale: "de-DE",
            datatype: "metaxml",
            context: "customApplications"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Force_com',
            source: 'Force.com',
            target: 'Force.de',
            targetLocale: "de-DE",
            datatype: "metaxml",
            context: "customApplications"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Account',
            source: 'Text Account',
            target: 'Texteskonto',
            targetLocale: "de-DE",
            datatype: "metaxml",
            context: "customLabels"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'Files2',
            source: 'Files online',
            target: 'Dateien online',
            targetLocale: "de-DE",
            datatype: "metaxml",
            context: "customTabs"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'LogACall',
            source: 'LogACall',
            target: 'EinenAnrufProtokollieren',
            targetLocale: "de-DE",
            datatype: "metaxml",
            context: "quickActions"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt',
            source: 'Screen Flows',
            target: "Bildschirmsflussen",
            targetLocale: "de-DE",
            datatype: "metaxml",
            context: "reportTypes"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.description',
            source: 'Screen Flows Description',
            target: "Beschreibung des Bildschirmsflussen",
            targetLocale: "de-DE",
            datatype: "metaxml",
            context: "reportTypes"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.Flow Interview Log Entries',
            source: 'Flow Interview Log Entries',
            target: "Protokolleinträge von Flussinterviews",
            targetLocale: "de-DE",
            datatype: "metaxml",
            context: "reportTypes.sections"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'screen_flows_prebuilt_crt.Flow Interview Logs',
            source: 'Flow Interview Logs',
            target: "Protokollen von Flussinterviews",
            targetLocale: "de-DE",
            datatype: "metaxml",
            context: "reportTypes.sections"
        }));

        mxf.localize(translations, ["fr-FR", "de-DE"]);

        test.ok(fs.existsSync(path.join(base, "testfiles/force-app/main/default/translations/fr.translation-meta.xml")));
        test.ok(fs.existsSync(path.join(base, "testfiles/force-app/main/default/translations/de.translation-meta.xml")));

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
        test.equal(content, expected);

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
        test.equal(content, expected);

        test.done();
    },

    testMetaXmlFileLocalizeNoStrings: function(test) {
        test.expect(5);

        var base = path.dirname(module.id);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./html/nostrings.html",
            type: t
        });
        test.ok(mxf);

        // set up
        if (fs.existsSync(path.join(base, "./testfiles/html/de.translation-meta.xml"))) {
            fs.unlinkSync(path.join(base, "./testfiles/html/de.translation-meta.xml"));
        }
        if (fs.existsSync(path.join(base, "./testfiles/html/fr.translation-meta.xml"))) {
            fs.unlinkSync(path.join(base, "./testfiles/html/fr.translation-meta.xml"));
        }

        test.ok(!fs.existsSync(path.join(base, "./testfiles/html/de.translation-meta.xml")));
        test.ok(!fs.existsSync(path.join(base, "./testfiles/html/fr.translation-meta.xml")));

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customApplications>\n' +
            '</Translations>\n'
        );

        var translations = new TranslationSet();
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'r308704783',
            source: 'Get insurance quotes for free!',
            target: 'Obtenez des devis d\'assurance gratuitement!',
            targetLocale: "fr-FR",
            datatype: "metaxml"
        }));
        translations.add(new ContextResourceString({
            project: "forceapp",
            key: 'r308704783',
            source: 'Get insurance quotes for free!',
            target: 'Kostenlosen Versicherungs-Angebote erhalten!',
            targetLocale: "de-DE",
            datatype: "metaxml"
        }));

        mxf.localize(translations, ["fr-FR", "de-DE"]);

        // should produce the files, even if there is nothing to localize in them
        test.ok(fs.existsSync(path.join(base, "./testfiles/html/de.translation-meta.xml")));
        test.ok(fs.existsSync(path.join(base, "./testfiles/html/fr.translation-meta.xml")));

        test.done();
    },

    testMetaXmlFileLocalizeRightNewStrings: function(test) {
        test.expect(8);

        var base = path.dirname(module.id);

        var mxft2 = new MetaXmlFileType(p);
        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./force-app/main/default/translations/en_US.translation-meta.xml",
            type: mxft2
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label><!-- Password --></label>\n' +
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
            datatype: "metaxml",
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
        test.equal(content, expected);

        var newSet = mxft2.getNew();

        test.equal(newSet.size(), 1);
        var res = newSet.getAll();
        test.equal(res[0].reskey, "Test");
        test.equal(res[0].source, "Password");
        test.equal(res[0].sourceLocale, "en-US");
        test.equal(res[0].targetLocale, "de-DE");
        test.equal(res[0].state, "new");

        test.done();
    },

    testMetaXmlFileLocalizeWithPseudo: function(test) {
        test.expect(2);

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
            pathName: "./html/en.translation-meta.xml",
            type: t2
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<Translations xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <customApplications>\n' +
            '        <label><!-- Password --></label>\n' +
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
            datatype: "metaxml",
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
        test.equal(content, expected);

        test.done();
    }
};
