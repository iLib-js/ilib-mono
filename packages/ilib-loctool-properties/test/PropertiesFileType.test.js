/*
 * PropertiesFileType.test.js - test the Java properties file type handler object.
 *
 * Copyright © 2019, 2023 JEDLSoft
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

describe("propertiesfiletype", function() {
    test("PropertiesFileTypeConstructor", function() {
        expect.assertions(1);

        var pft = new PropertiesFileType(p);

        expect(pft).toBeTruthy();
    });

    test("PropertiesFileTypeHandlesPropertiesTrue", function() {
        expect.assertions(2);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        expect(pft.handles("foo.properties")).toBeTruthy();
    });

    test("PropertiesFileTypeHandlesPropertiesFalseClose", function() {
        expect.assertions(2);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        expect(!pft.handles("fooproperties")).toBeTruthy();
    });

    test("PropertiesFileTypeHandlesFalse", function() {
        expect.assertions(2);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        expect(!pft.handles("foo.html")).toBeTruthy();
    });

    test("PropertiesFileTypeHandlesXmlFalse", function() {
        expect.assertions(2);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        expect(!pft.handles("foo.xml")).toBeTruthy();
    });

    test("PropertiesFileTypeHandlesAlreadyLocalized", function() {
        expect.assertions(3);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        expect(!pft.handles("foo_de.properties")).toBeTruthy();
        expect(!pft.handles("foo_de_DE.properties")).toBeTruthy();
    });

    test("PropertiesFileTypeHandlesSourceLocale", function() {
        expect.assertions(2);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        expect(pft.handles("foo_en_US.properties")).toBeTruthy();
    });

    test("PropertiesFileTypeHandlesAlmostSourceLocale", function() {
        expect.assertions(2);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        expect(!pft.handles("foo_en.properties")).toBeTruthy();
    });

    test("PropertiesFileTypeHandlesPropertiesTrueWithDir", function() {
        expect.assertions(2);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        expect(pft.handles("a/b/c/foo.properties")).toBeTruthy();
    });

    test("PropertiesFileTypeHandlesPropertiesAlreadyLocalizeWithDir", function() {
        expect.assertions(2);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        expect(!pft.handles("a/b/c/foo_de_DE.properties")).toBeTruthy();
    });

    test("PropertiesFileTypeGetResourceFilePathDefaultLocaleForLanguage", function() {
        expect.assertions(2);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        expect(pft.getResourceFilePath("de-DE", "asdf/bar/SourceFile.properties")).toBe("asdf/bar/SourceFile_de.properties");
    });

    test("PropertiesFileTypeGetResourceFilePathNonDefaultLocaleForLanguage", function() {
        expect.assertions(2);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        expect(pft.getResourceFilePath("de-AT", "asdf/bar/SourceFile.properties")).toBe("asdf/bar/SourceFile_de_AT.properties");
    });

    test("PropertiesFileTypeGetResourceFilePathSourceLocale", function() {
        expect.assertions(2);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        expect(pft.getResourceFilePath("en-US", "asdf/bar/SourceFile.properties")).toBe("asdf/bar/SourceFile.properties");
    });

    test("PropertiesFileTypeGetResourceFilePathNonUSEnglish", function() {
        expect.assertions(2);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        expect(pft.getResourceFilePath("en-CA", "asdf/bar/SourceFile.properties")).toBe("asdf/bar/SourceFile_en_CA.properties");
    });

    test("PropertiesFileTypeGetResourceFilePathEnglishGB", function() {
        expect.assertions(2);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        // default for English after US English
        expect(pft.getResourceFilePath("en-GB", "asdf/bar/SourceFile.properties")).toBe("asdf/bar/SourceFile_en.properties");
    });

    test("PropertiesFileTypeGetResourceFileEnglishGB", function() {
        expect.assertions(3);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        var res = new ResourceString({
            project: p,
            locale: "en-GB",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })
        var rf = pft.getResourceFile({ resource: res });
        expect(rf).toBeTruthy();

        // default for non-US English locales
        expect(rf.getPath()).toBe("src/myproduct/Test_en.properties")
    });

    test("PropertiesFileTypeGetResourceFileEnglishUS", function() {
        expect.assertions(3);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        var res = new ResourceString({
            project: p,
            locale: "en-US",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })

        var rf = pft.getResourceFile({ resource: res });
        expect(rf).toBeTruthy();

        // default for the source locale
        expect(rf.getPath()).toBe("src/myproduct/Test.properties")
    });

    test("PropertiesFileTypeGetResourceFileChineseCN", function() {
        expect.assertions(3);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        var res = new ResourceString({
            project: p,
            locale: "zh-Hans-CN",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })

        var rf = pft.getResourceFile({ resource: res });
        expect(rf).toBeTruthy();

        // default for Chinese
        expect(rf.getPath()).toBe("src/myproduct/Test_zh.properties")
    });

    test("PropertiesFileTypeGetResourceFileChineseHK", function() {
        expect.assertions(3);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        var res = new ResourceString({
            project: p,
            locale: "zh-Hant-HK",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })

        var rf = pft.getResourceFile({ resource: res });
        expect(rf).toBeTruthy();

        // default for Chinese traditional
        expect(rf.getPath()).toBe("src/myproduct/Test_zh_Hant.properties")
    });

    test("PropertiesFileTypeGetResourceFileChineseMY", function() {
        expect.assertions(3);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        var res = new ResourceString({
            project: p,
            locale: "zh-Hans-MY",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })

        var rf = pft.getResourceFile({ resource: res });
        expect(rf).toBeTruthy();

        // non default locale
        expect(rf.getPath()).toBe("src/myproduct/Test_zh_Hans_MY.properties")
    });

    test("PropertiesFileTypeGetResourceFileSpanishUS", function() {
        expect.assertions(3);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        var res = new ResourceString({
            project: p,
            locale: "es-US",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })

        var rf = pft.getResourceFile({ resource: res });
        expect(rf).toBeTruthy();

        // for default locales that are not English, use only the language
        expect(rf.getPath()).toBe("src/myproduct/Test_es.properties")
    });

    test("PropertiesFileTypeGetResourceFileEnglishNZ", function() {
        expect.assertions(3);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        var res = new ResourceString({
            project: p,
            locale: "en-NZ",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })

        var rf = pft.getResourceFile({ resource: res });
        expect(rf).toBeTruthy();

        // for non-default locales, use all the locale parts
        expect(rf.getPath()).toBe("src/myproduct/Test_en_NZ.properties")
    });

    test("PropertiesFileTypeGetResourceFileUnknownLocale", function() {
        expect.assertions(3);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        var res = new ResourceString({
            project: p,
            locale: "sv-SE",
            pathName: "src/myproduct/Test.properties",
            datatype: pft.datatype
        })

        var rf = pft.getResourceFile({ resource: res });
        expect(rf).toBeTruthy();

        // when unknown, only use the language part
        expect(rf.getPath()).toBe("src/myproduct/Test_sv.properties")
    });

    test("PropertiesFileTypeGetResourceFileEnglishGBFlavor", function() {
        expect.assertions(3);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        var res = new ResourceString({
            project: p,
            locale: "es-AR",
            pathName: "foo/QHC.properties",
            datatype: pft.datatype,
            flavor: "chocolate"
        });

        var rf = pft.getResourceFile({ resource: res });
        expect(rf).toBeTruthy();

        expect(rf.getPath()).toBe("foo/QHC_es_AR_CHOCOLATE.properties")
    });

    test("PropertiesFileTypeGetResourceFileChineseCNFlavor", function() {
        expect.assertions(3);

        var pft = new PropertiesFileType(p);
        expect(pft).toBeTruthy();

        var res = new ResourceString({
            project: p,
            locale: "zh-Hans-CN",
            pathName: "foo/QHC.properties",
            datatype: pft.datatype,
            flavor: "chocolate"
        });

        var rf = pft.getResourceFile({ resource: res });
        expect(rf).toBeTruthy();

        expect(rf.getPath()).toBe("foo/QHC_zh_CHOCOLATE.properties")
    });
});

