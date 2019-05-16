/*
 * testPropertiesFileType.js - test the Java properties file type handler object.
 *
 * Copyright © 2019, JEDLSoft
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

if (!PropertiesFileType) {
    var PropertiesFileType = require("../PropertiesFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
    var ResourceString =  require("loctool/lib/ResourceString.js");
}

var p = new CustomProject({
    id: "webapp",
    name: "webapp",
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"]
});

module.exports.propertiesfiletype = {
    testPropertiesFileTypeConstructor: function(test) {
        test.expect(1);

        var pft = new PropertiesFileType(p);

        test.ok(pft);

        test.done();
    },

    testPropertiesFileTypeHandlesPropertiesTrue: function(test) {
        test.expect(2);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        test.ok(pft.handles("foo.properties"));

        test.done();
    },

    testPropertiesFileTypeHandlesPropertiesFalseClose: function(test) {
        test.expect(2);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        test.ok(!pft.handles("fooproperties"));

        test.done();
    },

    testPropertiesFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        test.ok(!pft.handles("foo.html"));

        test.done();
    },

    testPropertiesFileTypeHandlesXmlFalse: function(test) {
        test.expect(2);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        test.ok(!pft.handles("foo.xml"));

        test.done();
    },

    testPropertiesFileTypeHandlesAlreadyLocalized: function(test) {
        test.expect(3);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        test.ok(!pft.handles("foo_de.properties"));
        test.ok(!pft.handles("foo_de_DE.properties"));

        test.done();
    },

    testPropertiesFileTypeHandlesSourceLocale: function(test) {
        test.expect(2);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        test.ok(pft.handles("foo_en_US.properties"));

        test.done();
    },

    testPropertiesFileTypeHandlesAlmostSourceLocale: function(test) {
        test.expect(2);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        test.ok(!pft.handles("foo_en.properties"));

        test.done();
    },

    testPropertiesFileTypeHandlesPropertiesTrueWithDir: function(test) {
        test.expect(2);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        test.ok(pft.handles("a/b/c/foo.properties"));

        test.done();
    },

    testPropertiesFileTypeHandlesPropertiesAlreadyLocalizeWithDir: function(test) {
        test.expect(2);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        test.ok(!pft.handles("a/b/c/foo_de_DE.properties"));

        test.done();
    },

    testPropertiesFileTypeGetResourceFilePathDefaultLocaleForLanguage: function(test) {
        test.expect(2);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        test.equal(pft.getResourceFilePath("de-DE", "asdf/bar/SourceFile.properties"), "asdf/bar/SourceFile_de.properties");

        test.done();
    },

    testPropertiesFileTypeGetResourceFilePathNonDefaultLocaleForLanguage: function(test) {
        test.expect(2);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        test.equal(pft.getResourceFilePath("de-AT", "asdf/bar/SourceFile.properties"), "asdf/bar/SourceFile_de_AT.properties");

        test.done();
    },

    testPropertiesFileTypeGetResourceFilePathSourceLocale: function(test) {
        test.expect(2);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        test.equal(pft.getResourceFilePath("en-US", "asdf/bar/SourceFile.properties"), "asdf/bar/SourceFile.properties");

        test.done();
    },

    testPropertiesFileTypeGetResourceFilePathNonUSEnglish: function(test) {
        test.expect(2);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        test.equal(pft.getResourceFilePath("en-CA", "asdf/bar/SourceFile.properties"), "asdf/bar/SourceFile_en_CA.properties");

        test.done();
    },

    testPropertiesFileTypeGetResourceFilePathEnglishGB: function(test) {
        test.expect(2);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        // default for English after US English
        test.equal(pft.getResourceFilePath("en-GB", "asdf/bar/SourceFile.properties"), "asdf/bar/SourceFile_en.properties");

        test.done();
    },

    testPropertiesFileTypeGetResourceFileEnglishGB: function(test) {
        test.expect(3);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        var res = new ResourceString({
            project: p,
            locale: "en-GB",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })
        var rf = pft.getResourceFile(res);
        test.ok(rf);

        // default for non-US English locales
        test.equal(rf.getPath(), "src/myproduct/Test_en.properties")

        test.done();
    },

    testPropertiesFileTypeGetResourceFileEnglishUS: function(test) {
        test.expect(3);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        var res = new ResourceString({
            project: p,
            locale: "en-US",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })

        var rf = pft.getResourceFile(res);
        test.ok(rf);

        // default for the source locale
        test.equal(rf.getPath(), "src/myproduct/Test.properties")

        test.done();
    },

    testPropertiesFileTypeGetResourceFileChineseCN: function(test) {
        test.expect(3);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        var res = new ResourceString({
            project: p,
            locale: "zh-Hans-CN",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })

        var rf = pft.getResourceFile(res);
        test.ok(rf);

        // default for Chinese
        test.equal(rf.getPath(), "src/myproduct/Test_zh.properties")

        test.done();
    },

    testPropertiesFileTypeGetResourceFileChineseHK: function(test) {
        test.expect(3);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        var res = new ResourceString({
            project: p,
            locale: "zh-Hant-HK",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })

        var rf = pft.getResourceFile(res);
        test.ok(rf);

        // default for Chinese traditional
        test.equal(rf.getPath(), "src/myproduct/Test_zh_Hant.properties")

        test.done();
    },

    testPropertiesFileTypeGetResourceFileChineseMY: function(test) {
        test.expect(3);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        var res = new ResourceString({
            project: p,
            locale: "zh-Hans-MY",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })

        var rf = pft.getResourceFile(res);
        test.ok(rf);

        // non default locale
        test.equal(rf.getPath(), "src/myproduct/Test_zh_Hans_MY.properties")

        test.done();
    },

    testPropertiesFileTypeGetResourceFileSpanishUS: function(test) {
        test.expect(3);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        var res = new ResourceString({
            project: p,
            locale: "es-US",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })

        var rf = pft.getResourceFile(res);
        test.ok(rf);

        // for default locales that are not English, use only the language
        test.equal(rf.getPath(), "src/myproduct/Test_es.properties")

        test.done();
    },

    testPropertiesFileTypeGetResourceFileEnglishNZ: function(test) {
        test.expect(3);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        var res = new ResourceString({
            project: p,
            locale: "en-NZ",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })

        var rf = pft.getResourceFile(res);
        test.ok(rf);

        // for non-default locales, use all the locale parts
        test.equal(rf.getPath(), "src/myproduct/Test_en_NZ.properties")

        test.done();
    },

    testPropertiesFileTypeGetResourceFileUnknownLocale: function(test) {
        test.expect(3);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        var res = new ResourceString({
            project: p,
            locale: "sv-SE",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })

        var rf = pft.getResourceFile(res);
        test.ok(rf);

        // when unknown, only use the language part
        test.equal(rf.getPath(), "src/myproduct/Test_sv.properties")

        test.done();
    },

    testPropertiesFileTypeGetResourceFileEnglishGBFlavor: function(test) {
        test.expect(3);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        var res = new ResourceString({
            project: p,
            locale: "es-AR",
            pathName: "foo/QHC.properties",
            datatype: pft.datatype,
            flavor: "chocolate"
        });

        var rf = pft.getResourceFile(res);
        test.ok(rf);

        test.equal(rf.getPath(), "foo/QHC_es_AR_CHOCOLATE.properties")

        test.done();
    },

    testPropertiesFileTypeGetResourceFileChineseCNFlavor: function(test) {
        test.expect(3);

        var pft = new PropertiesFileType(p);
        test.ok(pft);

        var res = new ResourceString({
            project: p,
            locale: "zh-Hans-CN",
            pathName: "foo/QHC.properties",
            datatype: pft.datatype,
            flavor: "chocolate"
        });

        var rf = pft.getResourceFile(res);
        test.ok(rf);

        test.equal(rf.getPath(), "foo/QHC_zh_CHOCOLATE.properties")

        test.done();
    }
};
