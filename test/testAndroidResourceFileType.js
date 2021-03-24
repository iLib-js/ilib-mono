/*
 * testAndroidResourceFileType.js - test the Android resource file type handler object.
 *
 * Copyright © 2020-2021, JEDLSoft
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

module.exports.androidresourcefiletype = {
    testAndroidResourceFileTypeConstructor: function(test) {
        test.expect(1);

        var arft = new AndroidResourceFileType(p);

        test.ok(arft);

        test.done();
    },

    testAndroidResourceFileTypeHandlesXmlFalse: function(test) {
        test.expect(2);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        test.ok(!arft.handles("foo.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesResfileTrue: function(test) {
        test.expect(2);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        test.ok(arft.handles("android/res/values/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesMenuFalse: function(test) {
        test.expect(2);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        test.ok(!arft.handles("android/res/menu/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesXmlDirFalse: function(test) {
        test.expect(2);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        test.ok(!arft.handles("android/res/xml/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesOtherTypeFalse: function(test) {
        test.expect(2);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        test.ok(!arft.handles("android/res/values/strings.html"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesResfileAlreadyLocalizedES: function(test) {
        test.expect(2);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        test.ok(!arft.handles("android/res/values-es/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesResfileAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        test.ok(!arft.handles("android/res/values-zh/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesResfileAlreadyLocalizedENGB: function(test) {
        test.expect(2);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        test.ok(!arft.handles("android/res/values-en-rGB/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesResfileAlreadyLocalizedModernFullLocale: function(test) {
        test.expect(2);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        test.ok(!arft.handles("android/res/values-b+zh+Hans+CN/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandlesResfileAlreadyLocalizedModernFullLocaleWithContext: function(test) {
        test.expect(2);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        test.ok(!arft.handles("android/res/values-b+zh+Hans+CN-hdmi/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandleContext: function(test) {
        test.expect(2);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        test.ok(arft.handles("android/res/values-foo/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandleContextLocalizedES: function(test) {
        test.expect(2);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        test.ok(!arft.handles("android/res/values-es-foo/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandleContextLocalizeCN: function(test) {
        test.expect(2);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        test.ok(!arft.handles("android/res/values-zh-foo/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeHandleContextLocalizedENGB: function(test) {
        test.expect(2);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        test.ok(!arft.handles("android/res/values-en-rGB-foo/strings.xml"));

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileStrings: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile("", "es-US", "strings", "src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "android/res/values-es/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFilePlurals: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile("", "es-US", "plurals", "src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "android/res/values-es/plurals.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileArray: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile("", "es-US", "arrays", "src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "android/res/values-es/arrays.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileEnglishUS: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile("", "en-US", "strings", "src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "android/res/values/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileEnglishHK: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile("", "en-HK", "strings", "src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "android/res/values-en-rHK/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileEnglishGB: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile("", "en-GB", "strings", "src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "android/res/values-en-rGB/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileChineseSimp: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile("", "zh-Hans-CN", "strings", "src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "android/res/values-zh/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileChineseTrad: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile("", "zh-Hant-HK", "strings", "src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "android/res/values-zh-rHK/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileNotDefaultLocale: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile("", "es-ES", "strings", "src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "android/res/values-es-rES/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileNoDefaultForLanguage: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile("", "ko-KR", "strings", "src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "android/res/values-ko/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileEnglishWithContext: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile("context", "en-US", "strings", "src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "android/res/values-context/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileSpanishWithContext: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile("context", "es-US", "strings", "src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "android/res/values-es-context/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileChineseTradWithContext: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile("context", "zh-Hant-HK", "strings", "src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "android/res/values-zh-rHK-context/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileInFlavorA: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile(undefined, "en-US", "strings", "test/testfiles/flavors/a/src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "flavors/a/res/values/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileInFlavorB: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile(undefined, "en-US", "strings", "test/testfiles/flavors/bproj/src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "flavors/bproj/res/values/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileInFlavorC: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile(undefined, "en-US", "strings", "test/testfiles/flavors/xXx/src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "flavors/xXx/res/values/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileInFlavorALayout: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile(undefined, "en-US", "strings", "test/testfiles/flavors/a/res/layouts/testlayout.xml");
        test.ok(rf);

        test.equal(rf.getPath(), "flavors/a/res/values/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileNotInFlavorA: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile(undefined, "en-US", "strings", "test/testfiles/flavors/d/src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "android/res/values/strings.xml")

        test.done();
    },

    testAndroidResourceFileTypeGetResourceFileInFlavorAWithContextChineseTrad: function(test) {
        test.expect(3);

        var arft = new AndroidResourceFileType(p);
        test.ok(arft);

        var rf = arft.getResourceFile("context", "zh-Hant-HK", "strings", "test/testfiles/flavors/a/src/java/com/myproduct/Test.java");
        test.ok(rf);

        test.equal(rf.getPath(), "flavors/a/res/values-zh-rHK-context/strings.xml")

        test.done();
    }
};
