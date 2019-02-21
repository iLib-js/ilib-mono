/*
 * testJavaScriptResourceFileType.js - test the HTML template file type handler object.
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

if (!JavaScriptResourceFileType) {
    var JavaScriptResourceFileType = require("../JavaScriptResourceFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    sourceLocale: "en-US"
}, "./testfiles", {
    locales:["en-GB"]
});

module.exports.javascriptresourcefiletype = {
    testJavaScriptResourceFileTypeConstructor: function(test) {
        test.expect(1);

        var htf = new JavaScriptResourceFileType(p);

        test.ok(htf);

        test.done();
    },

    testJavaScriptResourceFileTypeHandlesJS: function(test) {
        test.expect(2);

        var htf = new JavaScriptResourceFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.js"));

        test.done();
    },

    testJavaScriptResourceFileTypeHandlesActualJSResFile: function(test) {
        test.expect(2);

        var htf = new JavaScriptResourceFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("localized_js/de-DE.js"));

        test.done();
    },

    testJavaScriptResourceFileTypeHandlesAnythingFalse: function(test) {
        test.expect(4);

        var htf = new JavaScriptResourceFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.tmpl.html"));
        test.ok(!htf.handles("foo.html.haml"));
        test.ok(!htf.handles("foo.yml"));

        test.done();
    },

    testJavaScriptResourceFileTypeGetResourceFile: function(test) {
        test.expect(2);

        var htf = new JavaScriptResourceFileType(p);
        test.ok(htf);

        var jsrf = htf.getResourceFile("fr-FR");

        test.equal(jsrf.getLocale(), "fr-FR");

        test.done();
    },

    testJavaScriptResourceFileTypeGetResourceFileSameOneEachTime: function(test) {
        test.expect(4);

        var htf = new JavaScriptResourceFileType(p);
        test.ok(htf);

        var jsrf1 = htf.getResourceFile("fr-FR");
        test.equal(jsrf1.getLocale(), "fr-FR");

        var jsrf2 = htf.getResourceFile("fr-FR");
        test.equal(jsrf2.getLocale(), "fr-FR");

        test.deepEqual(jsrf1, jsrf2);

        test.done();
    }
};
