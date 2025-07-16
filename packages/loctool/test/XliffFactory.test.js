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

var XliffFactory = require("../lib/XliffFactory.js");
var Xliff = require("../lib/Xliff.js");
var webOSXliff = require("../lib/webOSXliff.js");

describe("XliffFactory", function() {
    test("XliffFactory_default", function() {
        expect.assertions(2);
        var xf = XliffFactory();
        expect(xf).toBeTruthy();
        expect(xf instanceof Xliff).toBeTruthy();
    });
    test("XliffFactory_default2", function() {
        expect.assertions(2);
        var xf = XliffFactory({});
        expect(xf).toBeTruthy();
        expect(xf instanceof Xliff).toBeTruthy();
    });
    test("XliffFactory_default_Style", function() {
        expect.assertions(1);
        expect(XliffFactory.defaultStyle).toBe("standard");
    });
    test("XliffFactory_getAllStyles", function() {
        expect.assertions(1);
        var list = ['default', 'standard', 'webOS'];
        expect(XliffFactory.getAllStyles()).toEqual(list);
    });
    test("XliffFactory_style_standard", function() {
        expect.assertions(2);
        var xf = XliffFactory({
            style: "standard"
        });
        expect(xf).toBeTruthy();
        expect(xf instanceof Xliff).toBeTruthy();
    });
    test("XliffFactory_style_webOS", function() {
        expect.assertions(2);
        var xf = XliffFactory({
            style: "webOS"
        });
        expect(xf).toBeTruthy();
        expect(xf instanceof webOSXliff).toBeTruthy();
    });
});