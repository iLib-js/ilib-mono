/*
 * testMetaXmlFileType.js - test the MetaXml file type handler object.
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

if (!MetaXmlFileType) {
    var MetaXmlFileType = require("../MetaXmlFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    id: "webapp",
    name: "webapp",
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"]
});


module.exports.javafiletype = {
    testMetaXmlFileTypeConstructor: function(test) {
        test.expect(1);

        var mxft = new MetaXmlFileType(p);

        test.ok(mxft);

        test.done();
    },

    testMetaXmlFileTypeHandlesMetaXmlTrue: function(test) {
        test.expect(2);

        var mxft = new MetaXmlFileType(p);
        test.ok(mxft);

        test.ok(mxft.handles("x.foo-meta.xml"));

        test.done();
    },

    testMetaXmlFileTypeHandlesFieldsMetaXmlTrue: function(test) {
        test.expect(2);

        var mxft = new MetaXmlFileType(p);
        test.ok(mxft);

        test.ok(mxft.handles("foo.field-meta.xml"));

        test.done();
    },

    testMetaXmlFileTypeHandlesClassMetaXmlTrue: function(test) {
        test.expect(2);

        var mxft = new MetaXmlFileType(p);
        test.ok(mxft);

        test.ok(mxft.handles("foo.cls-meta.xml"));

        test.done();
    },

    testMetaXmlFileTypeHandlesObjectMetaXmlTrue: function(test) {
        test.expect(2);

        var mxft = new MetaXmlFileType(p);
        test.ok(mxft);

        test.ok(mxft.handles("foo.object-meta.xml"));

        test.done();
    },

    testMetaXmlFileTypeHandlesAnythingMetaXmlTrue: function(test) {
        test.expect(2);

        var mxft = new MetaXmlFileType(p);
        test.ok(mxft);

        test.ok(mxft.handles("foo.anything-meta.xml"));

        test.done();
    },

    testMetaXmlFileTypeHandlesMetaXmlFalseClose: function(test) {
        test.expect(2);

        var mxft = new MetaXmlFileType(p);
        test.ok(mxft);

        test.ok(!mxft.handles("foometa.xml"));

        test.done();
    },

    testMetaXmlFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var mxft = new MetaXmlFileType(p);
        test.ok(mxft);

        test.ok(!mxft.handles("foo.html"));

        test.done();
    },

    testMetaXmlFileTypeHandlesMetaXmlTrueWithDir: function(test) {
        test.expect(2);

        var mxft = new MetaXmlFileType(p);
        test.ok(mxft);

        test.ok(mxft.handles("force-app/main/default/classes/Utils.cls-meta.xml"));

        test.done();
    },

    testMetaXmlFileTypeGetResourceFilePathDefaultLocaleForLanguage: function(test) {
        test.expect(2);

        var mxft = new MetaXmlFileType(p);
        test.ok(mxft);

        test.equal(mxft.getResourceFilePath("de-DE", "force-app/main/default/objects/SourceFile.object-meta.xml"), "force-app/main/default/objectTranslations/SourceFile-de.objectTranslation-meta.xml");

        test.done();
    },

    testMetaXmlFileTypeGetResourceFilePathNonDefaultLocaleForLanguage: function(test) {
        test.expect(2);

        var mxft = new MetaXmlFileType(p);
        test.ok(mxft);

        test.equal(mxft.getResourceFilePath("de-AT", "force-app/main/default/objects/SourceFile.object-meta.xml"), "force-app/main/default/objectTranslations/SourceFile-de_AT.objectTranslation-meta.xml");

        test.done();
    },

    testMetaXmlFileTypeGetResourceFilePathObjectWithSubdir: function(test) {
        test.expect(2);

        var mxft = new MetaXmlFileType(p);
        test.ok(mxft);

        test.equal(mxft.getResourceFilePath("de-DE", "force-app/main/default/objects/Account/SourceFile.object-meta.xml"), "force-app/main/default/objectTranslations/Account-de/SourceFile.objectTranslation-meta.xml");

        test.done();
    },

    testMetaXmlFileTypeGetResourceFilePathFieldWithSubdir: function(test) {
        test.expect(2);

        var mxft = new MetaXmlFileType(p);
        test.ok(mxft);

        test.equal(mxft.getResourceFilePath("de-DE", "force-app/main/default/objects/Account/fields/field1__c.field-meta.xml"), "force-app/main/default/objectTranslations/Account-de/field1__c.fieldTranslation-meta.xml");

        test.done();
    },

    testMetaXmlFileTypeGetResourceFilePathListviewWithSubdir: function(test) {
        test.expect(2);

        var mxft = new MetaXmlFileType(p);
        test.ok(mxft);

        test.equal(mxft.getResourceFilePath("de-DE", "force-app/main/default/objects/Account/listViews/All.listView-meta.xml"), "force-app/main/default/objectTranslations/Account-de/All.listViewTranslation-meta.xml");

        test.done();
    },

};
