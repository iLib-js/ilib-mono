/*
 * Escaper.test.js - test the escaper class and its subclasses
 *
 * Copyright © 2025, JEDLSoft
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

import escaperFactory from "../src/EscaperFactory.js";

describe("test the Escaper class and its subclasses", () => {
    test("we get a valid escaper", () => {
        expect.assertions(1);

        const escaper = escaperFactory("js");
        expect(escaper).toBeTruthy();
    });

    test("we get undefined if the style is unknown", () => {
        expect.assertions(1);

        const escaper = escaperFactory("foobarfoo");
        expect(escaper).toBeUndefined();
    });

    test("the java escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("java");
        expect(escaper.escape("fo\"o'b\\aㅽr𝄞")).toBe("fo\\\"o\\'b\\\\a\\u317Dr\\u1D11E");
    });

    test("the java unescaper works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("java");
        expect(escaper.unescape("fo\\\"o\\'b\\\\a\\u317dr\\u1d11e")).toBe("fo\"o'b\\aㅽr𝄞");
    });

    test("the javascript escape works properly", () => {
        expect.assertions(1);
        
        const escaper = escaperFactory("js");
        expect(escaper.escape("fo\"o'b\\aㅽr𝄞")).toBe("fo\\\"o\\\'b\\\\a\\u317Dr\\u{1D11E}");
    });

    test("the javascript unescape works properly", () => {
        expect.assertions(2);

        const escaper = escaperFactory("js");
        expect(escaper.unescape("fo\\\"o\\\'b\\\\a\\u317dr\\u{1d11e}")).toBe("fo\"o'b\\aㅽr𝄞");
        expect(escaper.unescape("test \\\ntest test")).toBe("test test test");
    });
    
    test("the json escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("json");
        expect(escaper.escape("abc \\ \0\f\n\b\t\v\r\x65ㅽr𝄞")).toBe("abc \\\\ \\0\\f\\n\\b\\t\\v\\reㅽr𝄞");
    });
    
    test("the json unescape works properly", () => {
        expect.assertions(2);

        const escaper = escaperFactory("json");
        expect(escaper.unescape("abc \\\\ \\u0000\\f\\n\\b\\t\\u000b\\rㅽr𝄞")).toBe('abc \\ \0\f\n\b\t\v\rㅽr𝄞');
        expect(escaper.unescape("abc \\\\ \\0\\f\\n\\b\\t\\v\\rㅽr𝄞")).toBe('abc \\ \0\f\n\b\t\v\rㅽr𝄞');
    });
});
