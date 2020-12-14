/*
 * testMetaXmlFile.js - test the MetaXml file handler object.
 *
 * Copyright © 2020, Box, Inc.
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
            pathName: "./testfiles/force-app/main/default/object/Utils.object-meta.xml",
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
            '<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <fullName>Password__c</fullName>\n' +
            '    <externalId>false</externalId>\n' +
            '    <label>Password</label>\n' +
            '    <length>255</length>\n' +
            '    <required>false</required>\n' +
            '    <trackHistory>false</trackHistory>\n' +
            '    <type>Text</type>\n' +
            '    <unique>false</unique>\n' +
            '</CustomField>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "r92231204", "metaxml"));
        test.ok(r);

        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "r92231204");

        test.done();
    },

    testMetaXmlFileParseSimpleGetBySource: function(test) {
        test.expect(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <fullName>Password__c</fullName>\n' +
            '    <externalId>false</externalId>\n' +
            '    <label>Password</label>\n' +
            '    <length>255</length>\n' +
            '    <required>false</required>\n' +
            '    <trackHistory>false</trackHistory>\n' +
            '    <type>Text</type>\n' +
            '    <unique>false</unique>\n' +
            '</CustomField>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Password");
        test.ok(r);
        test.equal(r.getSource(), "Password");
        test.equal(r.getKey(), "r92231204");

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
            '<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <fullName>Password__c</fullName>\n' +
            '    <externalId>false</externalId>\n' +
            '    <label></label>\n' +
            '    <length>255</length>\n' +
            '    <required>false</required>\n' +
            '    <trackHistory>false</trackHistory>\n' +
            '    <type>Text</type>\n' +
            '    <unique>false</unique>\n' +
            '</CustomField>\n'
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
            '<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <fullName>Password__c</fullName>\n' +
            '    <externalId>false</externalId>\n' +
            '    <label>  \n   This is a test      \n\r\t\t</label>\n' +
            '    <length>255</length>\n' +
            '    <required>false</required>\n' +
            '    <trackHistory>false</trackHistory>\n' +
            '    <type>Text</type>\n' +
            '    <unique>false</unique>\n' +
            '</CustomField>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

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
            '<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <fullName>Password__c</fullName>\n' +
            '    <externalId>false</externalId>\n' +
            '    <label>This is a test</label>\n' +
            '    <length>255</length>\n' +
            '    <required>false</required>\n' +
            '    <trackHistory>false</trackHistory>\n' +
            '    <type>Text</type>\n' +
            '    <unique>false</unique>\n' +
            '</CustomField>\n'
        );

        test.ok(set);

        test.equal(set.size(), 1);

        test.done();
    },

    testMetaXmlFileParseSimpleWithTranslatorComment: function(test) {
        test.expect(6);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <fullName>Password__c</fullName>\n' +
            '    <externalId>false</externalId>\n' +
            '    <label x-i18n="this is a translator\'s comment">This is a test</label>\n' +
            '    <length>255</length>\n' +
            '    <required>false</required>\n' +
            '    <trackHistory>false</trackHistory>\n' +
            '    <type>Text</type>\n' +
            '    <unique>false</unique>\n' +
            '</CustomField>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");
        test.equal(r.getComment(), "this is a translator's comment");

        test.done();
    },

    testMetaXmlFileParseSimpleWithUniqueIdAndTranslatorComment: function(test) {
        test.expect(6);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <fullName>Password__c</fullName>\n' +
            '    <externalId>false</externalId>\n' +
            '    <label x-id="foobar" x-i18n="this is a translator\'s comment">This is a test</label>\n' +
            '    <length>255</length>\n' +
            '    <required>false</required>\n' +
            '    <trackHistory>false</trackHistory>\n' +
            '    <type>Text</type>\n' +
            '    <unique>false</unique>\n' +
            '</CustomField>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "foobar", "metaxml"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "foobar");
        test.equal(r.getComment(), "this is a translator's comment");

        test.done();
    },

    testMetaXmlFileParseWithKey: function(test) {
        test.expect(5);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <fullName>Password__c</fullName>\n' +
            '    <externalId>false</externalId>\n' +
            '    <label x-id="unique_id">This is a test</label>\n' +
            '    <length>255</length>\n' +
            '    <required>false</required>\n' +
            '    <trackHistory>false</trackHistory>\n' +
            '    <type>Text</type>\n' +
            '    <unique>false</unique>\n' +
            '</CustomField>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "unique_id", "metaxml"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "unique_id");

        test.done();
    },

    testMetaXmlFileParseMultiple: function(test) {
        test.expect(8);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <fullName>Allocation_status__c</fullName>\n' +
            '    <externalId>false</externalId>\n' +
            '    <label>Allocation status</label>\n' +
            '    <required>false</required>\n' +
            '    <trackHistory>false</trackHistory>\n' +
            '    <type>Picklist</type>\n' +
            '    <valueSet>\n' +
            '        <restricted>true</restricted>\n' +
            '        <valueSetDefinition>\n' +
            '            <sorted>false</sorted>\n' +
            '            <value>\n' +
            '                <fullName>Allocate</fullName>\n' +
            '                <default>false</default>\n' +
            '                <label>Allocate</label>\n' +
            '            </value>\n' +
            '            <value>\n' +
            '                <fullName>Assigned</fullName>\n' +
            '                <default>false</default>\n' +
            '                <label>Assigned</label>\n' +
            '            </value>\n' +
            '        </valueSetDefinition>\n' +
            '    </valueSet>\n' +
            '</CustomField>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Allocate");
        test.ok(r);
        test.equal(r.getSource(), "Allocate");
        test.equal(r.getKey(), "r228180217");

        r = set.getBySource("Assigned");
        test.ok(r);
        test.equal(r.getSource(), "Assigned");
        test.equal(r.getKey(), "r762953066");

        test.done();
    },

    testMetaXmlFileParseMultipleWithKey: function(test) {
        test.expect(10);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <fullName>Allocation_status__c</fullName>\n' +
            '    <externalId>false</externalId>\n' +
            '    <label>Allocation status</label>\n' +
            '    <required>false</required>\n' +
            '    <trackHistory>false</trackHistory>\n' +
            '    <type>Picklist</type>\n' +
            '    <valueSet>\n' +
            '        <restricted>true</restricted>\n' +
            '        <valueSetDefinition>\n' +
            '            <sorted>false</sorted>\n' +
            '            <value>\n' +
            '                <fullName>Allocate</fullName>\n' +
            '                <default>false</default>\n' +
            '                <label x-id="x">Allocate</label>\n' +
            '            </value>\n' +
            '            <value>\n' +
            '                <fullName>Assigned</fullName>\n' +
            '                <default>false</default>\n' +
            '                <label x-id="y">Assigned</label>\n' +
            '            </value>\n' +
            '        </valueSetDefinition>\n' +
            '    </valueSet>\n' +
            '</CustomField>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Allocate");
        test.ok(r);

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "x", "metaxml"));
        test.ok(r);
        test.equal(r.getSource(), "Allocate");
        test.ok(!r.getAutoKey());
        test.equal(r.getKey(), "x");

        r = set.get(ResourceString.hashKey("forceapp", "en-US", "y", "metaxml"));
        test.ok(r);
        test.equal(r.getSource(), "Assigned");
        test.ok(!r.getAutoKey());
        test.equal(r.getKey(), "y");

        test.done();
    },

    testMetaXmlFileParseMultipleWithComments: function(test) {
        test.expect(10);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse(
            '<?xml version="1.0" encoding="UTF-8"?>\n' +
            '<CustomField xmlns="http://soap.sforce.com/2006/04/metadata">\n' +
            '    <fullName>Allocation_status__c</fullName>\n' +
            '    <externalId>false</externalId>\n' +
            '    <label>Allocation status</label>\n' +
            '    <required>false</required>\n' +
            '    <trackHistory>false</trackHistory>\n' +
            '    <type>Picklist</type>\n' +
            '    <valueSet>\n' +
            '        <restricted>true</restricted>\n' +
            '        <valueSetDefinition>\n' +
            '            <sorted>false</sorted>\n' +
            '            <value>\n' +
            '                <fullName>Allocate</fullName>\n' +
            '                <default>false</default>\n' +
            '                <label x-i18n="foo">Allocate</label>\n' +
            '            </value>\n' +
            '            <value>\n' +
            '                <fullName>Assigned</fullName>\n' +
            '                <default>false</default>\n' +
            '                <label x-i18n="bar">Assigned</label>\n' +
            '            </value>\n' +
            '        </valueSetDefinition>\n' +
            '    </valueSet>\n' +
            '</CustomField>\n'
        );

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("Allocate");
        test.ok(r);
        test.equal(r.getSource(), "Allocate");
        test.equal(r.getKey(), "r228180217");
        test.equal(r.getComment(), "foo");

        r = set.getBySource("Assigned");
        test.ok(r);
        test.equal(r.getSource(), "Assigned");
        test.equal(r.getKey(), "r762953066");
        test.equal(r.getComment(), "bar");

        test.done();
    },

/*
    testMetaXmlFileParseMultipleWithUniqueIdsAndComments: function(test) {
        test.expect(10);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse('RB.getString("This is a test", "asdf");   // i18n: foo\n\ta.parse("This is another test.");\n\t\tRB.getString("This is also a test", "kdkdkd");\t// i18n: bar');

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "asdf", "metaxml"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "asdf");
        test.equal(r.getComment(), "foo");

        r = set.get(ResourceString.hashKey("forceapp", "en-US", "kdkdkd", "metaxml"));
        test.ok(r);
        test.equal(r.getSource(), "This is also a test");
        test.equal(r.getKey(), "kdkdkd");
        test.equal(r.getComment(), "bar");

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

        mxf.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test");');

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        test.equal(set.size(), 1);

        test.done();
    },

    testMetaXmlFileParseDupsDifferingByKeyOnly: function(test) {
        test.expect(8);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse('RB.getString("This is a test");\n\ta.parse("This is another test.");\n\t\tRB.getString("This is a test", "unique_id");');

        var set = mxf.getTranslationSet();
        test.ok(set);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        r = set.get(ResourceString.hashKey("forceapp", "en-US", "unique_id", "metaxml"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "unique_id");

        test.done();
    },

    testMetaXmlFileParseBogusConcatenation: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse('RB.getString("This is a test" + " and this isnt");');

        var set = mxf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testMetaXmlFileParseBogusConcatenation2: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse('RB.getString("This is a test" + foobar);');

        var set = mxf.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testMetaXmlFileParseBogusNonStringParam: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse('RB.getString(foobar);');

        var set = mxf.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testMetaXmlFileParseEmptyParams: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse('RB.getString();');

        var set = mxf.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testMetaXmlFileParseWholeWord: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse('EPIRB.getString("This is a test");');

        var set = mxf.getTranslationSet();
        test.equal(set.size(), 0);

        test.done();
    },

    testMetaXmlFileParseSubobject: function(test) {
        test.expect(2);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: undefined,
            type: mxft
        });
        test.ok(mxf);

        mxf.parse('App.RB.getString("This is a test");');

        var set = mxf.getTranslationSet();
        test.equal(set.size(), 1);

        test.done();
    },

    testMetaXmlFileExtractFile: function(test) {
        test.expect(8);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./java/t1.java",
            type: mxft
        });
        test.ok(mxf);

        // should read the file
        mxf.extract();

        var set = mxf.getTranslationSet();

        test.equal(set.size(), 2);

        var r = set.getBySource("This is a test");
        test.ok(r);
        test.equal(r.getSource(), "This is a test");
        test.equal(r.getKey(), "r654479252");

        var r = set.get(ResourceString.hashKey("forceapp", "en-US", "id1", "metaxml"));
        test.ok(r);
        test.equal(r.getSource(), "This is a test with a unique id");
        test.equal(r.getKey(), "id1");

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
            pathName: "./java/foo.java",
            type: mxft
        });
        test.ok(mxf);

        // should attempt to read the file and not fail
        mxf.extract();

        var set = mxf.getTranslationSet();

        test.equal(set.size(), 0);

        test.done();
    },

    testMetaXmlFileExtractFile2: function(test) {
        test.expect(11);

        var mxf = new MetaXmlFile({
            project: p,
            pathName: "./java/AskPickerSearchFragment.java",
            type: mxft
        });
        test.ok(mxf);

        // should read the file
        mxf.extract();

        var set = mxf.getTranslationSet();

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
    */
};
