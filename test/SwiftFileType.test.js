/*
 * SwiftFileTypeType.test.js - test the Swift file type handler object.
 *
 * Copyright © 2019, 2023 Box, Inc.
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

describe("swiftfiletype", function() {
    test("SwiftFileTypeConstructor", function() {
        expect.assertions(1);

        var stf = new SwiftFileType(p);

        expect(stf).toBeTruthy();
    });

    test("SwiftFileTypeHandlesTrue", function() {
        expect.assertions(2);

        var stf = new SwiftFileType(p);
        expect(stf).toBeTruthy();

        expect(stf.handles("foo.swift")).toBeTruthy();
    });

    test("SwiftFileTypeHandlesHeaderFileTrue", function() {
        expect.assertions(2);

        var stf = new SwiftFileType(p);
        expect(stf).toBeTruthy();

        expect(stf.handles("foo.h")).toBeTruthy();
    });

    test("SwiftFileTypeHandlesFalseClose", function() {
        expect.assertions(2);

        var stf = new SwiftFileType(p);
        expect(stf).toBeTruthy();

        expect(!stf.handles("fooswift")).toBeTruthy();
    });

    test("SwiftFileTypeHandlesFalse", function() {
        expect.assertions(2);

        var stf = new SwiftFileType(p);
        expect(stf).toBeTruthy();

        expect(!stf.handles("foo.html")).toBeTruthy();
    });

    test("SwiftFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);

        var stf = new SwiftFileType(p);
        expect(stf).toBeTruthy();

        expect(stf.handles("a/b/c/foo.swift")).toBeTruthy();
    });
});
