/*
 * testHamlFileType.js - test the Haml template file type handler object.
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

if (!HamlFileType) {
    var HamlFileType = require("../HamlFileType.js");
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


module.exports.hamlfiletype = {
    testHamlFileTypeConstructor: function(test) {
        test.expect(1);

        var htf = new HamlFileType(p);

        test.ok(htf);

        test.done();
    },

    testHamlFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var htf = new HamlFileType(p);
        test.ok(htf);

        test.ok(htf.handles("foo.html.haml"));

        test.done();
    },

    testHamlFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var htf = new HamlFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.tml.haml"));

        test.done();
    },

    testHamlFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var htf = new HamlFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("foo.haml"));

        test.done();
    },

    testHamlFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var htf = new HamlFileType(p);
        test.ok(htf);

        test.ok(htf.handles("a/b/c/foo.html.haml"));

        test.done();
    },

    testHamlFileTypeHandlesAlreadyLocalizedGB: function(test) {
        test.expect(2);

        var htf = new HamlFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.en-GB.html.haml"));

        test.done();
    },

    testHamlFileTypeHandlesAlreadyLocalizedES: function(test) {
        test.expect(2);

        var htf = new HamlFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.es-US.html.haml"));

        test.done();
    },

    testHamlFileTypeHandlesAlreadyLocalizedCN: function(test) {
        test.expect(2);

        var htf = new HamlFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.zh-Hans-CN.html.haml"));

        test.done();
    },

    testHamlFileTypeHandlesAlreadyLocalizedCN2: function(test) {
        test.expect(2);

        var htf = new HamlFileType(p);
        test.ok(htf);

        test.ok(!htf.handles("app/views/who_we_are/press.zh-Hans-CN.html.haml"));

        test.done();
    },

    testHamlFileTypeHandlesAlreadyLocalizedWithFlavor: function(test) {
        test.expect(2);

        var htf = new HamlFileType(p2);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.en-ZA-ASDF.html.haml"));

        test.done();
    },
    
    testHamlFileTypeHandlesAlreadyLocalizedHKWithFlavor: function(test) {
        test.expect(2);

        var htf = new HamlFileType(p2);
        test.ok(htf);

        test.ok(!htf.handles("a/b/c/foo.zh-Hant-HK-ASDF.html.haml"));

        test.done();
    }
};
