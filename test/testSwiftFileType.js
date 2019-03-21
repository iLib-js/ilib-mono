/*
 * testSwiftFileTypeType.js - test the Swift file type handler object.
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

if (!SwiftFileType) {
    var SwiftFileType = require("../SwiftFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var path = require("path");

var p = new CustomProject({
    id: "iosapp",
    sourceLocale: "en-US",
    resourceDirs: {
        swift: "a/b"
    },
    plugins: [
        path.join(process.cwd(), "SwiftFileType")
    ]
}, "./test/testfiles", {
    locales:["en-GB"],
    nopseudo: true,
    targetDir: "testfiles"
});

module.exports.swiftfiletype = {
    testSwiftFileTypeConstructor: function(test) {
        test.expect(1);

        var stf = new SwiftFileType(p);

        test.ok(stf);

        test.done();
    },

    testSwiftFileTypeHandlesTrue: function(test) {
        test.expect(2);

        var stf = new SwiftFileType(p);
        test.ok(stf);

        test.ok(stf.handles("foo.swift"));

        test.done();
    },

    testSwiftFileTypeHandlesHeaderFileTrue: function(test) {
        test.expect(2);

        var stf = new SwiftFileType(p);
        test.ok(stf);

        test.ok(stf.handles("foo.h"));

        test.done();
    },

    testSwiftFileTypeHandlesFalseClose: function(test) {
        test.expect(2);

        var stf = new SwiftFileType(p);
        test.ok(stf);

        test.ok(!stf.handles("fooswift"));

        test.done();
    },

    testSwiftFileTypeHandlesFalse: function(test) {
        test.expect(2);

        var stf = new SwiftFileType(p);
        test.ok(stf);

        test.ok(!stf.handles("foo.html"));

        test.done();
    },

    testSwiftFileTypeHandlesTrueWithDir: function(test) {
        test.expect(2);

        var stf = new SwiftFileType(p);
        test.ok(stf);

        test.ok(stf.handles("a/b/c/foo.swift"));

        test.done();
    }
};
