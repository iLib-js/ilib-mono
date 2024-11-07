/*
 * AndroidResourceFileType.test.js - test the Android resource file type handler object.
 *
 * Copyright © 2020-2021, 2023 JEDLSoft
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
if (!AndroidResourceFileType) {
    var AndroidResourceFileType = require("../AndroidResourceFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}
var settings = {
    "locales": ["en-GB"],
    "AndroidResourceFile": {
        "alternateDirs": {
            "zh-Hans-CN": ["-b+zh+Hans+HK"],
            "zh-Hant-HK": ["-b+zh+Hant+HK", "-zh-rTW"]
        },
        "defaultLocales": {
            "en": "en-US",
            "es": "es-US",
            "zh": "zh-Hans-CN"
        }
    },
    "build.gradle": "build1.gradle"
};
var p = new CustomProject({
    sourceLocale: "en-US",
    "resourceDirs": {
        "java": "android/res"
    },
    plugins: [
        path.join(process.cwd(), "AndroidResourceFileType")
    ]
}, "./test/testfiles", settings);
describe("androidresourcefiletype", function() {
    test("AndroidResourceFileTypeConstructor", function() {
        expect.assertions(1);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
    });
    test("AndroidResourceFileTypeHandlesXmlFalse", function() {
        expect.assertions(2);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        expect(!arft.handles("foo.xml")).toBeTruthy();
    });
    test("AndroidResourceFileTypeHandlesResfileTrue", function() {
        expect.assertions(2);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        expect(arft.handles("android/res/values/strings.xml")).toBeTruthy();
    });
    test("AndroidResourceFileTypeHandlesMenuFalse", function() {
        expect.assertions(2);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        expect(!arft.handles("android/res/menu/strings.xml")).toBeTruthy();
    });
    test("AndroidResourceFileTypeHandlesXmlDirFalse", function() {
        expect.assertions(2);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        expect(!arft.handles("android/res/xml/strings.xml")).toBeTruthy();
    });
    test("AndroidResourceFileTypeHandlesOtherTypeFalse", function() {
        expect.assertions(2);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        expect(!arft.handles("android/res/values/strings.html")).toBeTruthy();
    });
    test("AndroidResourceFileTypeHandlesResfileAlreadyLocalizedES", function() {
        expect.assertions(2);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        expect(!arft.handles("android/res/values-es/strings.xml")).toBeTruthy();
    });
    test("AndroidResourceFileTypeHandlesResfileAlreadyLocalizedCN", function() {
        expect.assertions(2);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        expect(!arft.handles("android/res/values-zh/strings.xml")).toBeTruthy();
    });
    test("AndroidResourceFileTypeHandlesResfileAlreadyLocalizedENGB", function() {
        expect.assertions(2);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        expect(!arft.handles("android/res/values-en-rGB/strings.xml")).toBeTruthy();
    });
    test("AndroidResourceFileTypeHandlesResfileAlreadyLocalizedModernFullLocale", function() {
        expect.assertions(2);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        expect(!arft.handles("android/res/values-b+zh+Hans+CN/strings.xml")).toBeTruthy();
    });
    test("AndroidResourceFileTypeHandlesResfileAlreadyLocalizedModernFullLocaleWithContext", function() {
        expect.assertions(2);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        expect(!arft.handles("android/res/values-b+zh+Hans+CN-hdmi/strings.xml")).toBeTruthy();
    });
    test("AndroidResourceFileTypeHandleContext", function() {
        expect.assertions(2);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        expect(arft.handles("android/res/values-foo/strings.xml")).toBeTruthy();
    });
    test("AndroidResourceFileTypeHandleContextLocalizedES", function() {
        expect.assertions(2);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        expect(!arft.handles("android/res/values-es-foo/strings.xml")).toBeTruthy();
    });
    test("AndroidResourceFileTypeHandleContextLocalizeCN", function() {
        expect.assertions(2);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        expect(!arft.handles("android/res/values-zh-foo/strings.xml")).toBeTruthy();
    });
    test("AndroidResourceFileTypeHandleContextLocalizedENGB", function() {
        expect.assertions(2);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        expect(!arft.handles("android/res/values-en-rGB-foo/strings.xml")).toBeTruthy();
    });
    test("AndroidResourceFileTypeGetResourceFileStrings", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile("", "es-US", "strings", "src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("android/res/values-es/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFilePlurals", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile("", "es-US", "plurals", "src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("android/res/values-es/plurals.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileArray", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile("", "es-US", "arrays", "src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("android/res/values-es/arrays.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileEnglishUS", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile("", "en-US", "strings", "src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("android/res/values/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileEnglishHK", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile("", "en-HK", "strings", "src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("android/res/values-en-rHK/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileEnglishGB", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile("", "en-GB", "strings", "src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("android/res/values-en-rGB/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileChineseSimp", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile("", "zh-Hans-CN", "strings", "src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("android/res/values-zh/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileChineseTrad", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile("", "zh-Hant-HK", "strings", "src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("android/res/values-zh-rHK/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileNotDefaultLocale", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile("", "es-ES", "strings", "src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("android/res/values-es-rES/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileNoDefaultForLanguage", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile("", "ko-KR", "strings", "src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("android/res/values-ko/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileEnglishWithContext", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile("context", "en-US", "strings", "src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("android/res/values-context/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileSpanishWithContext", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile("context", "es-US", "strings", "src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("android/res/values-es-context/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileChineseTradWithContext", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile("context", "zh-Hant-HK", "strings", "src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("android/res/values-zh-rHK-context/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileInFlavorA", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile(undefined, "en-US", "strings", "test/testfiles/flavors/a/src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("flavors/a/res/values/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileInFlavorB", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile(undefined, "en-US", "strings", "test/testfiles/flavors/bproj/src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("flavors/bproj/res/values/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileInFlavorC", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile(undefined, "en-US", "strings", "test/testfiles/flavors/xXx/src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("flavors/xXx/res/values/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileInFlavorALayout", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile(undefined, "en-US", "strings", "test/testfiles/flavors/a/res/layouts/testlayout.xml");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("flavors/a/res/values/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileNotInFlavorA", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile(undefined, "en-US", "strings", "test/testfiles/flavors/d/src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("android/res/values/strings.xml")
    });
    test("AndroidResourceFileTypeGetResourceFileInFlavorAWithContextChineseTrad", function() {
        expect.assertions(3);
        var arft = new AndroidResourceFileType(p);
        expect(arft).toBeTruthy();
        var rf = arft.getResourceFile("context", "zh-Hant-HK", "strings", "test/testfiles/flavors/a/src/java/com/myproduct/Test.java");
        expect(rf).toBeTruthy();
        expect(rf.getPath()).toBe("flavors/a/res/values-zh-rHK-context/strings.xml")
    });
});
