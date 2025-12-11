/*
 * JavaScriptResourceFile.test.js - test the JavaScript file handler object.
 *
 * Copyright © 2019-2020, 2023, 2025 Box, Inc.
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

if (!JavaScriptResourceFile) {
    var JavaScriptResourceFile = require("../JavaScriptResourceFile.js");
    var CustomProject = require("loctool/lib/CustomProject.js");
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
    id: "webapp",
    sourceLocale: "en-US",
    resourceDirs: {
        "js": "localized_js"
    }
}, "./testfiles", {
    locales:["en-GB"]
});

var p2 = new CustomProject({
    id: "webapp",
    sourceLocale: "en-US",
    resourceDirs: {
        "js": "localized_js"
    }
}, "./testfiles", {
    locales:["en-GB", "de-DE", "de-AT"],
    localeDefaults: {
        "en": {
            def: "en-US",
            spec: "en"
        },
        "es": {
            def: "es-US",
            spec: "es"
        },
        "de": {
            def: "de-DE",
            spec: "de"
        },
        "zh-Hans": {
            def: "zh-Hans-CN",
            spec: "zh"
        },
        "zh-Hant": {
            def: "zh-Hant-HK",
            spec: "zh-Hant"
        }
    },
    identify: true
});

var p3 = new CustomProject({
    id: "webapp",
    sourceLocale: "en-US",
    resourceDirs: {
        "js": "localized_js"
    }
}, "./testfiles", {
    locales:["en-GB", "de-DE", "de-AT"],
    javascript: {
        header: "/* This is a generated file. DO NOT EDIT THIS. */\n\nimport type ReactString from './types.d.ts';\n\nconst strings_[localeUnder] = ",
        footer: ";\n\nexport default strings_[localeUnder];\n"
    },
    identify: true
});

var p4 = new CustomProject({
    id: "webapp",
    sourceLocale: "en-US",
    resourceDirs: {
        "js": "localized_js"
    }
}, "./testfiles", {
    locales:["en-GB", "de-DE", "de-AT"],
    localeDefaults: {
        "en": {
            def: "en-US",
            spec: "en"
        },
        "es": {
            def: "es-US",
            spec: "es"
        },
        "de": {
            def: "de-DE",
            spec: "de"
        },
        "zh-Hans": {
            def: "zh-Hans-CN",
            spec: "zh"
        },
        "zh-Hant": {
            def: "zh-Hant-HK",
            spec: "zh-Hant"
        }
    },
    javascript: {
        header: "/* This is a generated file. DO NOT EDIT THIS. */\n\nimport type ReactString from './types.d.ts';\n\nconst strings_[localeUnder] = ",
        footer: ";\n\nexport default strings_[localeUnder];\n"
    },
    identify: true
});

var p5 = new CustomProject({
    id: "webapp",
    sourceLocale: "en-US",
    resourceDirs: {
        "js": "localized_js"
    }
}, "./testfiles", {
    locales:["en-GB", "de-DE", "de-AT"],
    javascript: {
        header: "/* This is a generated file. DO NOT EDIT THIS. */\n\nimport type ReactString from './types.d.ts';\n\nconst strings = ",
        footer: ";\n\nexport default strings;\n"
    },
    identify: true
});

// Project with a line comment header (starts with //)
var p6 = new CustomProject({
    id: "webapp",
    sourceLocale: "en-US",
    resourceDirs: {
        "js": "localized_js"
    }
}, "./testfiles", {
    locales:["en-GB", "de-DE", "de-AT"],
    javascript: {
        header: "// This is a generated file. DO NOT MODIFY BY HAND\nexport default ",
        footer: ";\n"
    },
    identify: true
});

describe("javascriptresourcefile", function() {
    test("JavaScriptResourceFileConstructor", function() {
        expect.assertions(1);

        var jsrf = new JavaScriptResourceFile({
            project: p
        });
        expect(jsrf).toBeTruthy();
    });

    test("JavaScriptResourceFileConstructorParams", function() {
        expect.assertions(1);

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "localized_js/en-US.js",
            locale: "en-US"
        });

        expect(jsrf).toBeTruthy();
    });

    test("JavaScriptResourceFileIsDirty", function() {
        expect.assertions(3);

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        expect(jsrf).toBeTruthy();
        expect(!jsrf.isDirty()).toBeTruthy();

        [
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        expect(jsrf.isDirty()).toBeTruthy();
    });

    test("JavaScriptResourceFileRightContents", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        expect(jsrf).toBeTruthy();

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        expect(jsrf.getContent()).toBe('ilib.data.strings_de_DE = {\n' +
            '    "more source text": "mehr Quellentext",\n' +
            '    "source text": "Quellentext",\n' +
            '    "yet more source text": "noch mehr Quellentext"\n' +
            '};\n'
        );
    });

    test("JavaScriptResourceFileGetContentsNoContent", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        expect(jsrf).toBeTruthy();

        expect(jsrf.getContent()).toBe('ilib.data.strings_de_DE = {};\n'
        );
    });

    test("JavaScriptResourceFileEscapeDoubleQuotes", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        expect(jsrf).toBeTruthy();
        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen\"text"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellen\"text"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        expect(jsrf.getContent()).toBe('ilib.data.strings_de_DE = {\n' +
            '    "more source text": "mehr Quellen\\"text",\n' +
            '    "source text": "Quellen\\"text"\n' +
            '};\n'
        );
    });

    test("JavaScriptResourceFileDontEscapeSingleQuotes", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        expect(jsrf).toBeTruthy();
        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellen'text"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellen'text"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        expect(jsrf.getContent()).toBe('ilib.data.strings_de_DE = {\n' +
            '    "more source text": "mehr Quellen\'text",\n' +
            '    "source text": "Quellen\'text"\n' +
            '};\n'
        );
    });

    test("JavaScriptResourceFileIdentifyResourceIds", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            pathName: "localized_js/de-DE.js",
            locale: "de-DE"
        });

        expect(jsrf).toBeTruthy();

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        var expected =
            'ilib.data.strings_de_DE = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        expect(actual).toBe(expected);
    });

    test("JavaScriptResourceFileGetResourceFilePathDefaultLocaleForLanguage", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "de-DE"
        });

        expect(jsrf).toBeTruthy();

        expect(jsrf.getResourceFilePath()).toBe("testfiles/localized_js/de.js");
    });

    test("JavaScriptResourceFileGetResourceFilePathDefaultLocaleForLanguageNoDefaultAvailable", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "de-DE"
        });

        expect(jsrf).toBeTruthy();

        expect(jsrf.getResourceFilePath()).toBe("testfiles/localized_js/de-DE.js");
    });

    test("JavaScriptResourceFileGetResourceFilePathNonDefaultLocaleForLanguage", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "de-AT"
        });

        expect(jsrf).toBeTruthy();

        expect(jsrf.getResourceFilePath()).toBe("testfiles/localized_js/de-AT.js");
    });

    test("JavaScriptResourceFileGetResourceFilePathDefaultLocaleForLanguageWithFlavor", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "de-DE-ASDF"
        });

        expect(jsrf).toBeTruthy();

        expect(jsrf.getResourceFilePath()).toBe("testfiles/localized_js/de-DE-ASDF.js");
    });

    test("JavaScriptResourceFileGetResourceFilePathNonDefaultLocaleForLanguageWithFlavor", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "de-AT-ASDF"
        });

        expect(jsrf).toBeTruthy();

        expect(jsrf.getResourceFilePath()).toBe("testfiles/localized_js/de-AT-ASDF.js");
    });

    test("JavaScriptResourceFileGetResourceFilePathDefaultLocaleForLanguageZH", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "zh-Hans-CN"
        });

        expect(jsrf).toBeTruthy();

        expect(jsrf.getResourceFilePath()).toBe("testfiles/localized_js/zh.js");
    });

    test("JavaScriptResourceFileGetResourceFilePathDefaultLocaleForLanguageZHNoDefaultsAvailable", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p,
            locale: "zh-Hans-CN"
        });

        expect(jsrf).toBeTruthy();

        expect(jsrf.getResourceFilePath()).toBe("testfiles/localized_js/zh-Hans-CN.js");
    });

    test("JavaScriptResourceFileGetResourceFilePathDefaultLocaleForLanguageZH", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "zh-Hant-HK"
        });

        expect(jsrf).toBeTruthy();

        expect(jsrf.getResourceFilePath()).toBe("testfiles/localized_js/zh-Hant.js");
    });

    test("JavaScriptResourceFileGetResourceFilePathNonDefaultLocaleForLanguageZH2", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "zh-Hans-SG"
        });

        expect(jsrf).toBeTruthy();

        expect(jsrf.getResourceFilePath()).toBe("testfiles/localized_js/zh-Hans-SG.js");
    });

    test("JavaScriptResourceFileGetResourceFilePathNonDefaultLocaleForLanguageZH3", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "zh-Hant-TW"
        });

        expect(jsrf).toBeTruthy();

        expect(jsrf.getResourceFilePath()).toBe("testfiles/localized_js/zh-Hant-TW.js");
    });

    test("JavaScriptResourceFileGetResourceFilePathDefaultLocale", function() {
        expect.assertions(2);

        // should default to English/US
        var jsrf = new JavaScriptResourceFile({
            project: p2
        });

        expect(jsrf).toBeTruthy();

        expect(jsrf.getResourceFilePath()).toBe("testfiles/localized_js/en.js");
    });

    test("JavaScriptResourceFileGetResourceFilePathAlreadyHasPath", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "de-AT",
            pathName: "path/to/foo.js"
        });

        expect(jsrf).toBeTruthy();

        expect(jsrf.getResourceFilePath()).toBe("path/to/foo.js");
    });

    test("JavaScriptResourceFileGetContentDefaultLocale", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "de-DE"
        });

        expect(jsrf).toBeTruthy();

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            'ilib.data.strings_de = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        expect(actual).toBe(expected);
    });

    test("JavaScriptResourceFileGetContentDefaultLocaleNoDefaultsAvailable", function() {
        expect.assertions(2);

        var p3 = new CustomProject({
            id: "webapp",
            sourceLocale: "en-US",
            resourceDirs: {
                "js": "localized_js"
            }
        }, "./testfiles", {
            locales:["en-GB", "de-DE", "de-AT"],
            identify: true
        });

        var jsrf = new JavaScriptResourceFile({
            project: p3,
            locale: "de-DE"
        });

        expect(jsrf).toBeTruthy();

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the full locale spec in the first line
        var expected =
            'ilib.data.strings_de_DE = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        expect(actual).toBe(expected);
    });

    test("JavaScriptResourceFileGetContentNonDefaultLocale", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "de-AT"
        });

        expect(jsrf).toBeTruthy();

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-AT",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-AT",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-AT",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the full locale spec in the first line
        var expected =
            'ilib.data.strings_de_AT = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        expect(actual).toBe(expected);
    });

    test("JavaScriptResourceFileGetContentDefaultLocaleZH", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "zh-Hans-CN"
        });

        expect(jsrf).toBeTruthy();

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hans-CN",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hans-CN",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hans-CN",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            'ilib.data.strings_zh = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        expect(actual).toBe(expected);
    });

    test("JavaScriptResourceFileGetContentDefaultLocaleZH2", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "zh-Hant-HK"
        });

        expect(jsrf).toBeTruthy();

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hant-HK",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hant-HK",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hant-HK",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            'ilib.data.strings_zh_Hant = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        expect(actual).toBe(expected);
    });

    test("JavaScriptResourceFileGetContentNonDefaultLocaleZH", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "zh-Hans-SG"
        });

        expect(jsrf).toBeTruthy();

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hans-SG",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hans-SG",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hans-SG",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            'ilib.data.strings_zh_Hans_SG = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        expect(actual).toBe(expected);
    });

    test("JavaScriptResourceFileGetContentNonDefaultLocaleZH2", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "zh-Hant-TW"
        });

        expect(jsrf).toBeTruthy();

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hant-TW",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hant-TW",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "zh-Hant-TW",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            'ilib.data.strings_zh_Hant_TW = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        expect(actual).toBe(expected);
    });

    test("JavaScriptResourceFileGetContentDefaultLocaleWithFlavor", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "de-DE-ASDF"
        });

        expect(jsrf).toBeTruthy();

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            'ilib.data.strings_de_DE_ASDF = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        expect(actual).toBe(expected);
    });

    test("JavaScriptResourceFileGetContentNonDefaultLocaleWithFlavor", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p2,
            locale: "de-DE-ASDF"
        });

        expect(jsrf).toBeTruthy();

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE-ASDF",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            'ilib.data.strings_de_DE_ASDF = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        expect(actual).toBe(expected);
    });

    test("JavaScriptResourceFile test that we can set a custom header and footer with no replacements", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p5,
            locale: "de-DE"
        });

        expect(jsrf).toBeTruthy();

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '/* This is a generated file. DO NOT EDIT THIS. */\n\n' +
            "import type ReactString from './types.d.ts';\n\n" +
            'const strings = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n\n' +
            'export default strings;\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        expect(actual).toBe(expected);
    });

    test("JavaScriptResourceFile test that we can set a custom header and footer with replacements", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p3,
            locale: "de-DE"
        });

        expect(jsrf).toBeTruthy();

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '/* This is a generated file. DO NOT EDIT THIS. */\n\n' +
            "import type ReactString from './types.d.ts';\n\n" +
            'const strings_de_DE = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n\n' +
            'export default strings_de_DE;\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        expect(actual).toBe(expected);
    });
    
    test("JavaScriptResourceFile test that we can set a custom header and footer with default locales", function() {
        expect.assertions(2);
    
        var jsrf = new JavaScriptResourceFile({
            project: p4,
            locale: "de-DE"
        });

        expect(jsrf).toBeTruthy();

        [
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "source text",
                sourceLocale: "en-US",
                source: "source text",
                target: "Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "more source text",
                sourceLocale: "en-US",
                source: "more source text",
                target: "mehr Quellentext"
            }),
            p2.getAPI().newResource({
                type: "string",
                project: "webapp",
                targetLocale: "de-DE",
                key: "yet more source text",
                sourceLocale: "en-US",
                source: "yet more source text",
                target: "noch mehr Quellentext"
            })
        ].forEach(function(res) {
            jsrf.addResource(res);
        });

        // should use the default locale spec in the first line
        var expected =
            '/* This is a generated file. DO NOT EDIT THIS. */\n\n' +
            "import type ReactString from './types.d.ts';\n\n" +
            'const strings_de = {\n' +
            '    "more source text": "<span loclang=\\"javascript\\" locid=\\"more source text\\">mehr Quellentext</span>",\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>",\n' +
            '    "yet more source text": "<span loclang=\\"javascript\\" locid=\\"yet more source text\\">noch mehr Quellentext</span>"\n' +
            '};\n\n' +
            'export default strings_de;\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        expect(actual).toBe(expected);
    });

    test("JavaScriptResourceFile test header with line comment starting with double slash", function() {
        expect.assertions(2);

        var jsrf = new JavaScriptResourceFile({
            project: p6,
            locale: "de-DE"
        });

        expect(jsrf).toBeTruthy();

        jsrf.addResource(p6.getAPI().newResource({
            type: "string",
            project: "webapp",
            sourceLocale: "en-US",
            source: "source text",
            targetLocale: "de-DE",
            key: "source text",
            target: "Quellentext"
        }));

        // The header starts with "// This is..." - the first slash should be preserved
        var expected =
            '// This is a generated file. DO NOT MODIFY BY HAND\n' +
            'export default {\n' +
            '    "source text": "<span loclang=\\"javascript\\" locid=\\"source text\\">Quellentext</span>"\n' +
            '};\n';

        var actual = jsrf.getContent();
        diff(actual, expected);

        expect(actual).toBe(expected);
    });
});