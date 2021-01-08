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

if (!MetaXmlFile) {
    var MetaXmlFile = require("../MetaXmlFile.js");
    var MetaXmlFileType = require("../MetaXmlFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
    var ResourceString =  require("loctool/lib/ResourceString.js");
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

module.exports.metaxmlfile = {
    // make sure to initialize the file types so that the tests below can use
    // a ResourceString instead of a regular ResourceString
    testMetaXmlInit: function(test) {
        p.init(function() {
            test.done();
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

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "Test", "metaxml", "customApplications"));
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

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "Test", "metaxml", "customApplications"));
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

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "Test", "metaxml", "customApplications"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "Test");
        test.equal(r.getFlavor(), "customApplications");

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

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "Test", "metaxml", "customLabels"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "Test");
        test.equal(r.getFlavor(), "customLabels");

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

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "Test", "metaxml", "customTabs"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "Test");
        test.equal(r.getFlavor(), "customTabs");

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

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "Test", "metaxml", "quickActions"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "Test");
        test.equal(r.getFlavor(), "quickActions");

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

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "screen_flows_prebuilt_crt", "metaxml", "reportTypes"));
        test.ok(r);

        test.equal(r.getSource(), "Screen Flows");
        test.equal(r.getKey(), "screen_flows_prebuilt_crt");
        test.equal(r.getFlavor(), "quickActions");

        r = set.get(ResourceString.hashKey("forceapp", "en-US", "Test1", "metaxml", "reportTypes.sections"));
        test.ok(r);

        test.equal(r.getSource(), "Flow Interview Log Entries");
        test.equal(r.getKey(), "Test1");
        test.equal(r.getFlavor(), "quickActions.sections");

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

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "screen_flows_prebuilt_crt", "metaxml", "reportTypes"));
        test.ok(r);

        test.equal(r.getSource(), "Screen Flows");
        test.equal(r.getKey(), "screen_flows_prebuilt_crt");
        test.equal(r.getFlavor(), "quickActions");

        r = set.get(ResourceString.hashKey("forceapp", "en-US", "screen_flows_prebuilt_crt.Test1", "metaxml", "reportTypes.sections"));
        test.ok(r);

        test.equal(r.getSource(), "Flow Interview Log Entries");
        test.equal(r.getKey(), "Test1");
        test.equal(r.getFlavor(), "quickActions.sections");

        r = set.get(ResourceString.hashKey("forceapp", "en-US", "screen_flows_prebuilt_crt.Test2", "metaxml", "reportTypes.sections"));
        test.ok(r);

        test.equal(r.getSource(), "Flow Interview Logs");
        test.equal(r.getKey(), "Test2");
        test.equal(r.getFlavor(), "quickActions.sections");

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

        test.equal(set.size(), 3);

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

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "screen_flows_prebuilt_crt", "metaxml", "reportTypes"));
        test.ok(r);

        test.equal(r.getSource(), "Screen Flows");
        test.equal(r.getKey(), "screen_flows_prebuilt_crt");
        test.equal(r.getFlavor(), "quickActions");

        r = set.get(ResourceString.hashKey("forceapp", "en-US", "screen_flows_prebuilt_crt.description", "metaxml", "reportTypes"));
        test.ok(r);

        test.equal(r.getSource(), "Screen Flows Description");
        test.equal(r.getKey(), "screen_flows_prebuilt_crt.description");
        test.equal(r.getFlavor(), "quickActions");

        r = set.get(ResourceString.hashKey("forceapp", "en-US", "screen_flows_prebuilt_crt.Test1", "metaxml", "reportTypes.sections"));
        test.ok(r);

        test.equal(r.getSource(), "Flow Interview Log Entries");
        test.equal(r.getKey(), "Test1");
        test.equal(r.getFlavor(), "quickActions.sections");

        test.done();
    },

    testMetaXmlFileParseWithDups: function(test) {
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
            '    <customLabels>\n' +
            '        <label><!-- Password --></label>\n' +
            '        <name>Test</name>\n' +
            '    </customLabels>\n' +
            '</Translations>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "Test", "metaxml", "customLabels"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "Test");
        test.equal(r.getFlavor(), "customLabels");

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

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "Test1", "metaxml", "customLabels"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "Test1");
        test.equal(r.getFlavor(), "customLabels");

        r = set.get(ResourceString.hashKey("forceapp", "en-US", "Test2", "metaxml", "customLabels"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "Test2");
        test.equal(r.getFlavor(), "customLabels");

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

        test.equal(set.size(), 8);

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "Test", "metaxml", "customLabels"));
        test.ok(r);
        test.equal(r.getSource(), "Test");
        test.equal(r.getKey(), "Test");
        test.equal(r.getFlavor(), "customApplications");

        r = set.get(ResourceString.hashKey("forceapp", "en-US", "Force.com", "metaxml", "customLabels"));
        test.ok(r);
        test.equal(r.getSource(), "Force.com");
        test.equal(r.getKey(), "Force.com");
        test.equal(r.getFlavor(), "customApplications");

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "Flow Interview Log Entries", "metaxml", "customLabels"));
        test.ok(r);
        test.equal(r.getSource(), "Flow Interview Log Entries");
        test.equal(r.getKey(), "Flow Interview Log Entries");
        test.equal(r.getFlavor(), "reportTypes.sections");

        test.done();
    },

    testMetaXmlFileExtractUndefinedFile: function(test) {
        test.expect(2);

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
    }
};
