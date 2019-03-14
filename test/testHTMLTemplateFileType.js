/*
 * testHTMLTemplateFileType.js - test the HTML template file type handler object.
 *
 * Copyright © 2019, Box, Inc.
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

if (!HTMLTemplateFileType) {
    var HTMLTemplateFileType = require("../HTMLTemplateFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});

var p2 = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"],
    flavors: ["ASDF"]
});

module.exports.htmltemplatefiletype = {
    testHTMLTemplateFileTypeConstructor: function(test) {
        test.expect(1);

        var htf = new HTMLTemplateFileType(p);

        test.ok(htf);

        test.done();
    },

    testHTMLTemplateFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.tmpl.html"));

        test.done();
    },

    testHTMLTemplateFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.tml"));

        test.done();
    },

    testHTMLTemplateFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.html"));

        test.done();
    },

    testHTMLTemplateFileTypeHandlesAlternateExtensionTrue: function(test) {
        test.expect(2);

        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.htm"));

        test.done();
    },

    testHTMLTemplateFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/c/foo.tmpl.html"));

        test.done();
    },

    testHTMLTemplateFileTypeHandlesAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.en-GB.tmpl.html"));

        test.done();
    },

    testHTMLTemplateFileTypeHandlesAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var htf = new HTMLTemplateFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.zh-Hans-CN.tmpl.html"));

        test.done();
    },

    testHTMLTemplateFileTypeHandlesAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var htf = new HTMLTemplateFileType(p2);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.en-ZA-ASDF.tmpl.html"));

        test.done();
    },

    testHTMLTemplateFileTypeHandleszhHKAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var htf = new HTMLTemplateFileType(p2);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.zh-Hant-HK-ASDF.tmpl.html"));

        test.done();
    }
};
