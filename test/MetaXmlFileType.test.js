/*
 * MetaXmlFileType.test.js - test the MetaXml file type handler object.
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


describe("metaxmlfiletype", function() {
    test("MetaXmlFileTypeConstructor", function() {
        expect.assertions(1);

        var mxft = new MetaXmlFileType(p);

        expect(mxft).toBeTruthy();
    });

    test("MetaXmlFileTypeHandlesMetaXmlTrue", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(mxft.handles("translations/en_US.translation-meta.xml")).toBeTruthy();
    });

    test("MetaXmlFileTypeHandlesMetaXmlNotInTranslationsDir", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(!mxft.handles("foo/en_US.translation-meta.xml")).toBeTruthy();
    });

    test("MetaXmlFileTypeHandlesMetaXmlFalseNotENUS", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(!mxft.handles("translations/en.translation-meta.xml")).toBeTruthy();
    });

    test("MetaXmlFileTypeHandlesMetaXmlFalseClose", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(!mxft.handles("translations/foo.translation-meta.xml")).toBeTruthy();
    });

    test("MetaXmlFileTypeHandlesMetaXmlFalseClose2", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(!mxft.handles("translations/en_US.translate-meta.xml")).toBeTruthy();
    });

    test("MetaXmlFileTypeHandlesFalse", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(!mxft.handles("translations/foo.html")).toBeTruthy();
    });

    test("MetaXmlFileTypeHandlesMetaXmlTrueWithDir", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(mxft.handles("force-app/main/default/translations/en_US.translation-meta.xml")).toBeTruthy();
    });

    test("MetaXmlFileTypeHandlesMetaXmlDontTranslateAlreadyTranslatedFiles", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(!mxft.handles("force-app/main/default/translations/de.translation-meta.xml")).toBeTruthy();
    });

    test("MetaXmlFileTypeGetResourceFilePathDefaultLocaleForLanguage", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(mxft.getResourceFilePath("de-DE", "force-app/main/default/translations/en_US.translation-meta.xml")).toBe("force-app/main/default/translations/de.translation-meta.xml");
    });

    test("MetaXmlFileTypeGetResourceFilePathNonDefaultLocaleForLanguage", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(mxft.getResourceFilePath("de-AT", "force-app/main/default/translations/en_US.translation-meta.xml")).toBe("force-app/main/default/translations/de_AT.translation-meta.xml");
    });

    test("MetaXmlFileTypeGetResourceFilePathNonTranslationFile", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(mxft.getResourceFilePath("de-DE", "force-app/main/default/fields/Foo__c/Foo__c.field-meta.xml")).toBe("force-app/main/default/translations/de.translation-meta.xml");
    });

    test("MetaXmlFileTypeGetResourceFilePathEnUS", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(mxft.getResourceFilePath("en-US", "force-app/main/default/translations/en_US.translation-meta.xml")).toBe("force-app/main/default/translations/en_US.translation-meta.xml");
    });

    test("MetaXmlFileTypeGetResourceFilePathEnUSNonTranslationFile", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(mxft.getResourceFilePath("en-US", "force-app/main/default/fields/Foo__c/Foo__c.field-meta.xml")).toBe("force-app/main/default/translations/en_US.translation-meta.xml");
    });

    test("MetaXmlFileTypeHandlesCustomApplicationFile", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(mxft.handles("force-app/main/default/app/myapp.app-meta.xml")).toBeTruthy();
    });

    test("MetaXmlFileTypeHandlesCustomFieldFile", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(mxft.handles("force-app/main/default/app/Field__c.field-meta.xml")).toBeTruthy();
    });

    test("MetaXmlFileTypeHandlesLabelsFile", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(mxft.handles("force-app/main/default/app/Field__c.labels-meta.xml")).toBeTruthy();
    });

    test("MetaXmlFileTypeHandlesCustomMetadataFile", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(mxft.handles("force-app/main/default/app/myapp.md-meta.xml")).toBeTruthy();
    });

    test("MetaXmlFileTypeHandlesCustomObjectFile", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(mxft.handles("force-app/main/default/app/myapp.object-meta.xml")).toBeTruthy();
    });

    test("MetaXmlFileTypeHandlesCustomPermissionsFile", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(mxft.handles("force-app/main/default/app/myapp.customPermission-meta.xml")).toBeTruthy();
    });

    test("MetaXmlFileTypeHandlesCustomTabFile", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(mxft.handles("force-app/main/default/app/myapp.tab-meta.xml")).toBeTruthy();
    });

    test("MetaXmlFileTypeHandlesQuickActionFile", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(mxft.handles("force-app/main/default/app/myapp.quickAction-meta.xml")).toBeTruthy();
    });

    test("MetaXmlFileTypeDoesNotHandleOtherFiles", function() {
        expect.assertions(2);

        var mxft = new MetaXmlFileType(p);
        expect(mxft).toBeTruthy();

        expect(!mxft.handles("force-app/main/default/app/myapp.page-meta.xml")).toBeTruthy();
    });
});
