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

    test("we got the right escaper for the style", () => {
        expect.assertions(4);

        const escaper = escaperFactory("php-single");
        expect(escaper).toBeTruthy();
        expect(escaper.getStyle()).toBe("php-single");
        expect(escaper.getName()).toBe("php-escaper");
        expect(escaper.getDescription()).toBe("Escapes and unescapes various types of strings in PHP");
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

    test("that javascript is an alias for js", () => {
        expect.assertions(2);

        const escaper = escaperFactory("javascript");
        expect(escaper).toBeTruthy();
        expect(escaper.getStyle()).toBe("js");
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

    test("the php double escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("php-double");
        expect(escaper.escape("abc 'd' \"e\" $\n\r\t\u001B\f\v\x54\u{317d} ㅽr𝄞")).toBe("abc 'd' \\\"e\\\" \\$\\n\\r\\t\\e\\f\\vT\\u{317D} \\u{317D}r\\u{1D11E}");
    });

    test("the php double unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("php-double");
        expect(escaper.unescape("abc 'd' \\\"e\\\" \\$\\n\\r\\t\\e\\f\\vT\\u{317D} \\u{317D}r\\u{1D11E}")).toBe("abc 'd' \"e\" $\n\r\t\u001B\f\v\x54\u{317d} ㅽr𝄞");
    });

    test("the php single escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("php-single");
        expect(escaper.escape("abc 'd' \\ \"e\" $\n\r\t\e\f\v\x54\\u{317d} ㅽr𝄞")).toBe("abc \\'d\\' \\\\ \"e\" $\n\r\t\e\f\v\x54\\\\u{317d} ㅽr𝄞");
    });

    test("the php single unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("php-single");
        expect(escaper.unescape("abc \\'d\\' \\\\ \"e\" $\n\r\t\e\f\v\x54\\u{317d} ㅽr𝄞")).toBe("abc 'd' \\ \"e\" $\n\r\t\e\f\v\x54\\u{317d} ㅽr𝄞");
    });

    test("the php heredoc escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("php-heredoc");
        expect(escaper.escape("abc 'd' \"e\" $\n\r\t\u001B\f\v\x54\u{317d} ㅽr𝄞")).toBe("abc 'd' \"e\" \\$\\n\\r\\t\\e\\f\\vT\\u{317D} \\u{317D}r\\u{1D11E}");
    });

    test("the php heredoc unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("php-heredoc");
        expect(escaper.unescape("abc 'd' \\\"e\\\" \\$\\n\\r\\t\\e\\f\\vT\\u{317D} \\u{317D}r\\u{1D11E}")).toBe("abc 'd' \\\"e\\\" $\n\r\t\u001B\f\v\x54\u{317d} ㅽr𝄞");
    });

    test("the php nowdoc escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("php-nowdoc");
        expect(escaper.escape("abc 'd' \\ \"e\" $\n\r\t\e\f\v\x54\\u{317d} ㅽr𝄞")).toBe("abc 'd' \\ \"e\" $\n\r\t\e\f\v\x54\\u{317d} ㅽr𝄞");
    });

    test("the php nowdoc unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("php-nowdoc");
        expect(escaper.unescape("abc \\'d\\' \\\\ \"e\" $\n\r\t\e\f\v\x54\\u{317d} ㅽr𝄞")).toBe("abc \\'d\\' \\\\ \"e\" $\n\r\t\e\f\v\x54\\u{317d} ㅽr𝄞");
    });

    test("that php is an alias for php-double", () => {
        expect.assertions(2);

        const escaper = escaperFactory("php");
        expect(escaper).toBeTruthy();
        expect(escaper.getStyle()).toBe("php-double");
    });

    test("the Smarty double escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("smarty-double");
        expect(escaper.escape("abc 'd' \"e\" $\n\r\t\u001B\f\v\x54\u{317d} ㅽr𝄞")).toBe("abc 'd' \\\"e\\\" \\$\\n\\r\\t\\e\\f\\vTㅽ ㅽr𝄞");
    });

    test("the Smarty double unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("smarty-double");
        expect(escaper.unescape("abc 'd' \\\"e\\\" \\$\\n\\r\\t\\e\\f\\vT\\u{317D} \\u{317D}r\\u{1D11E}")).toBe("abc 'd' \"e\" $\n\r\t\u001B\f\vT\\u{317D} \\u{317D}r\\u{1D11E}");
    });

    test("the Smarty single escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("smarty-single");
        expect(escaper.escape("abc 'd' \\ \"e\" $\n\r\t\e\f\v\x54\\u{317d} ㅽr𝄞")).toBe("abc \\'d\\' \\\\ \"e\" $\n\r\t\e\f\v\x54\\\\u{317d} ㅽr𝄞");
    });

    test("the Smarty single unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("smarty-single");
        expect(escaper.unescape("abc \\'d\\' \\\\ \"e\" $\n\r\t\e\f\v\x54\\u{317d} ㅽr𝄞")).toBe("abc 'd' \\ \"e\" $\n\r\t\e\f\v\x54\\u{317d} ㅽr𝄞");
    });

    test("that smarty is an alias for smarty-double", () => {
        expect.assertions(2);

        const escaper = escaperFactory("smarty");
        expect(escaper).toBeTruthy();
        expect(escaper.getStyle()).toBe("smarty-double");
    });

    test("the python regular string escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("python");
        expect(escaper.escape("abc 'd' \"e\" \\ \n\r\t\x08\f\v\x07\x54\u317d 𝄞")).toBe("abc \\'d\\' \\\"e\\\" \\\\ \\n\\r\\t\\b\\f\\v\\aT\\u317D \\U0001D11E");
    });

    test("the python regular string unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("python");
        expect(escaper.unescape("abc \\'d\\' \\\"e\\\" \\\\ \\n\\r\\t\\b\\f\\v\\aT\\u317D \\U0001D11E")).toBe("abc 'd' \"e\" \\ \n\r\t\x08\f\v\x07Tㅽ 𝄞");
    });

    test("the python raw string escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("python-raw");
        expect(escaper.escape("abc 'd' \"e\" \\ \n\r\t\x08\f\v\x07\x54ㅽ 𝄞")).toBe("abc \\'d\\' \"e\" \\\\ \n\r\t\x08\f\v\x07\x54ㅽ 𝄞");
    });

    test("the python raw string unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("python-raw");
        expect(escaper.unescape("abc \\'d\\' \"e\" \\\\ \n\r\t\x08\f\v\x07\x54ㅽ 𝄞")).toBe("abc 'd' \"e\" \\ \n\r\t\x08\f\v\x07\x54ㅽ 𝄞");
    });

    test("the python byte string escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("python-byte");
        expect(escaper.escape("abc 'd' \"e\" \\ \n\r\t\x08\f\v\x07\x54ㅽ 𝄞")).toBe("abc \\'d\\' \"e\" \\\\ \n\r\t\x08\f\v\x07\x54ㅽ 𝄞");
    });

    test("the python byte string unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("python-byte");
        expect(escaper.unescape("abc \\'d\\' \"e\" \\\\ \n\r\t\x08\f\v\x07\x54ㅽ 𝄞")).toBe("abc 'd' \"e\" \\ \n\r\t\x08\f\v\x07\x54ㅽ 𝄞");
    });

    test("the python multi-line string escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("python-multi");
        expect(escaper.escape("abc 'd' \"e\" \\ \n\r\t\x08\f\v\x07\x54\u317d 𝄞")).toBe("abc 'd' \\\"e\\\" \\\\ \\n\\r\\t\\b\\f\\v\\aT\\u317D \\U0001D11E");
    });

    test("the python multi-line string unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("python-multi");
        expect(escaper.unescape("abc 'd' \\\"e\\\" \\\\ \\n\\r\\t\\b\\f\\v\\aT\\u317D \\U0001D11E")).toBe("abc 'd' \"e\" \\ \n\r\t\x08\f\v\x07Tㅽ 𝄞");
    });
});
