/*
 * ObjectiveCFileType.test.js - test the Objective C file type handler object.
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

if (!ObjectiveCFileType) {
    var ObjectiveCFileType = require("../ObjectiveCFileType.js");
    var CustomProject =  require("loctool/lib/CustomProject.js");
}

var p = new CustomProject({
    id: "webapp",
    sourceLocale: "en-US"
}, "./test/testfiles", {
    locales:["en-GB"]
});

describe("objectivecfiletype", function() {
    test("ObjectiveCFileTypeConstructor", function() {
        expect.assertions(1);

        var ocft = new ObjectiveCFileType(p);

        expect(ocft).toBeTruthy();
    });

    test("ObjectiveCFileTypeHandlesTrue", function() {
        expect.assertions(2);

        var ocft = new ObjectiveCFileType(p);
        expect(ocft).toBeTruthy();

        expect(ocft.handles("foo.m")).toBeTruthy();
    });

    test("ObjectiveCFileTypeHandlesHeaderFileTrue", function() {
        expect.assertions(2);

        var ocft = new ObjectiveCFileType(p);
        expect(ocft).toBeTruthy();

        expect(ocft.handles("foo.h")).toBeTruthy();
    });

    test("ObjectiveCFileTypeHandlesFalseClose", function() {
        expect.assertions(2);

        var ocft = new ObjectiveCFileType(p);
        expect(ocft).toBeTruthy();

        expect(!ocft.handles("foo.cm")).toBeTruthy();
    });

    test("ObjectiveCFileTypeHandlesFalse", function() {
        expect.assertions(2);

        var ocft = new ObjectiveCFileType(p);
        expect(ocft).toBeTruthy();

        expect(!ocft.handles("foo.html")).toBeTruthy();
    });

    test("ObjectiveCFileTypeHandlesTrueWithDir", function() {
        expect.assertions(2);

        var ocft = new ObjectiveCFileType(p);
        expect(ocft).toBeTruthy();

        expect(ocft.handles("a/b/c/foo.m")).toBeTruthy();
    });
});
