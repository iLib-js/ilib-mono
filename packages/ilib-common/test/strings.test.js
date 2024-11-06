/*
 * strings.test.js - test the String object
 *
 * Copyright © 2012-2021, 2023 JEDLSoft
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

import * as JSUtils from '../src/JSUtils.js';

describe("testStrings", () => {
    test("CodePointToUTF", () => {
        expect.assertions(3);
        var str = JSUtils.fromCodePoint(0x10302);

        expect(str.length).toBe(2);
        expect(str.charCodeAt(0)).toBe(0xD800);
        expect(str.charCodeAt(1)).toBe(0xDF02);
    });

    test("CodePointToUTFLast", () => {
        expect.assertions(3);
        var str = JSUtils.fromCodePoint(0x10FFFD);

        expect(str.length).toBe(2);
        expect(str.charCodeAt(0)).toBe(0xDBFF);
        expect(str.charCodeAt(1)).toBe(0xDFFD);
    });

    test("CodePointToUTFFirst", () => {
        expect.assertions(3);
        var str = JSUtils.fromCodePoint(0x10000);

        expect(str.length).toBe(2);
        expect(str.charCodeAt(0)).toBe(0xD800);
        expect(str.charCodeAt(1)).toBe(0xDC00);
    });

    test("CodePointToUTFBeforeFirst", () => {
        expect.assertions(2);
        var str = JSUtils.fromCodePoint(0xFFFF);

        expect(str.length).toBe(1);
        expect(str.charCodeAt(0)).toBe(0xFFFF);
    });

    test("CodePointToUTFNotSupplementary", () => {
        expect.assertions(2);
        var str = JSUtils.fromCodePoint(0x0302);

        expect(str.length).toBe(1);
        expect(str.charCodeAt(0)).toBe(0x0302);
    });
});