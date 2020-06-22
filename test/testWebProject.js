/*
 * testWebProject.js - test the Web Project class.
 *
 * Copyright © 2017, 2020 HealthTap, Inc.
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

if (!WebProject) {
    var WebProject = require("../lib/WebProject.js");
    var YamlResourceFileType = require("../lib/YamlResourceFileType.js");
    var JavaScriptResourceFileType = require("../lib/JavaScriptResourceFileType.js");
}

module.exports.webproject = {
    testWebProjectConstructor: function(test) {
        test.expect(1);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.done();
    },

    testWebProjectRightResourceTypeRuby: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        var rt = p.getResourceFileType("ruby");

        test.ok(rt instanceof YamlResourceFileType);

        test.done();
    },

    testWebProjectRightResourceTypeJS: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        var rt = p.getResourceFileType("js");

        test.ok(rt instanceof JavaScriptResourceFileType);

        test.done();
    },

    testWebProjectGotFlavors: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["VANILLA", "CHOCOLATE"]
        });

        test.ok(p);

        test.ok(p.flavors);

        test.done();
    },

    testWebProjectGotRightFlavors: function(test) {
        test.expect(3);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"],
            flavors: ["VANILLA", "CHOCOLATE"]
        });

        test.ok(p);
        test.ok(p.flavors);
        test.deepEqual(p.flavors, ["VANILLA", "CHOCOLATE"]);

        test.done();
    },

    testWebProjectGetResourceDirsString: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "a/b/c"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.deepEqual(p.getResourceDirs("yml"), ["a/b/c"]);

        test.done();
    },

    testWebProjectGetResourceDirsNotThere: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": "a/b/c"
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.deepEqual(p.getResourceDirs("java"), []);

        test.done();
    },

    testWebProjectGetResourceDirsNoneSpecified: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US"
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.deepEqual(p.getResourceDirs("java"), []);

        test.done();
    },

    testWebProjectGetResourceDirsArray: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.deepEqual(p.getResourceDirs("yml"), ["a/b/c", "d/e/f"]);

        test.done();
    },

    testWebProjectIsResourcePathPositive: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.ok(p.isResourcePath("yml", "testfiles/a/b/c/x.yml"));

        test.done();
    },

    testWebProjectIsResourcePathNegative: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.ok(!p.isResourcePath("yml", "testfiles/a/c/x.yml"));

        test.done();
    },

    testWebProjectIsResourcePathPositive2: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.ok(p.isResourcePath("yml", "testfiles/d/e/f/x.yml"));

        test.done();
    },

    testWebProjectIsResourcePathSubdirectory: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.ok(p.isResourcePath("yml", "testfiles/d/e/f/m/n/o/x.yml"));

        test.done();
    },

    testWebProjectIsResourcePathDirOnly: function(test) {
        test.expect(2);

        var p = new WebProject({
            id: "web",
            sourceLocale: "en-US",
            resourceDirs: {
                "yml": ["a/b/c", "d/e/f"]
            }
        }, "./testfiles", {
            locales:["en-GB"]
        });

        test.ok(p);

        test.ok(p.isResourcePath("yml", "testfiles/d/e/f"));

        test.done();
    }
};
