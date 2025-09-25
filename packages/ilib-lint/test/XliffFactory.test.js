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

import XliffFactory from '../src/plugins/XliffFactory.js';
import { Xliff } from "ilib-xliff";
import { webOSXliff } from "ilib-xliff-webos";

describe("XliffFactory", function() {
    test("XliffFactory_default", function() {
        expect.assertions(2);
        const xf = XliffFactory();
        expect(xf).toBeTruthy();
        expect(xf instanceof Xliff).toBeTruthy();
    });
    test("XliffFactory_default2", function() {
        expect.assertions(2);
        const xf = XliffFactory({});
        expect(xf).toBeTruthy();
        expect(xf instanceof Xliff).toBeTruthy();
    });
    test("XliffFactory_default_Style", function() {
        expect.assertions(1);
        expect(XliffFactory.defaultStyle).toBe("standard");
    });
    test("XliffFactory_getAllStyles", function() {
        expect.assertions(1);
        var list = ['1', '1.2', '2', '2.0', 'default', 'standard', 'webOS'];
        expect(XliffFactory.getAllStyles().sort()).toEqual(list);
    });
    test("XliffFactory_style_standard", function() {
        expect.assertions(2);
        const xf = XliffFactory({
            style: "standard"
        });
        expect(xf).toBeTruthy();
        expect(xf instanceof Xliff).toBeTruthy();
    });
    test("XliffFactory_style_webOS", function() {
        expect.assertions(2);
        const xf = XliffFactory({
            style: "webOS"
        });
        expect(xf).toBeTruthy();
        expect(xf instanceof webOSXliff).toBeTruthy();
    });
    test("XliffFactory_style_12", function() {
        expect.assertions(2);
        const xf = XliffFactory({
            style: "1.2"
        });
        expect(xf).toBeTruthy();
        expect(xf instanceof Xliff).toBeTruthy();
    });
    test("XliffFactory_style_20", function() {
        expect.assertions(2);
        const xf = XliffFactory({
            style: "2.0"
        });
        expect(xf).toBeTruthy();
        expect(xf instanceof Xliff).toBeTruthy();
    });
    test("XliffFactory_style_1", function() {
        expect.assertions(2);
        const xf = XliffFactory({
            style: "1"
        });
        expect(xf).toBeTruthy();
        expect(xf instanceof Xliff).toBeTruthy();
    });
    test("XliffFactory_style_2", function() {
        expect.assertions(2);
        const xf = XliffFactory({
            style: "2"
        });
        expect(xf).toBeTruthy();
        expect(xf instanceof Xliff).toBeTruthy();
    });
});