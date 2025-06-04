/*
 * XliffFactory.test.js - test the xliff factory object.
 *
 * Copyright © 2025 JEDLSoft
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

if (!XliffFactory) {
    var XliffFactory = require("../lib/XliffFactory.js");
    var Xliff = require("../lib/Xliff.js");
    var webOSXliff = require("../lib/webOSXliff.js");
}

describe("ResourceFactory", function() {
    test("ResourceFactoryString", function() {
        expect.assertions(2);
        var ra = XliffFactory({});
        expect(ra).toBeTruthy();
        expect(ra instanceof Xliff).toBeTruthy();
    });
    test("ResourceFactoryArray", function() {
        expect.assertions(2);
        var ra = XliffFactory({
            xliffStyle: "standard"
        });
        expect(ra).toBeTruthy();
        expect(ra instanceof Xliff).toBeTruthy();
    });
    test("ResourceFactoryArray", function() {
        expect.assertions(2);
        var ra = XliffFactory({
            xliffStyle: "webOS"
        });
        expect(ra).toBeTruthy();

        expect(ra instanceof webOSXliff).toBeTruthy();
    });
});
