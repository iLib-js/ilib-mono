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
        // astral plane characters are represented as surrogate pairs in Java
        expect(escaper.escape("fo\"o'b\\aㅽr𝄞")).toBe("fo\\\"o\\'b\\\\a\\u317Dr\\uD834\\uDD1E");
    });

    test("the java unescaper works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("java");
        expect(escaper.unescape("fo\\\"o\\'b\\\\a\\u317dr\\uD834\\uDD1E")).toBe("fo\"o'b\\aㅽr𝄞");
    });

    test("the java escape does not croak on invalid input", () => {
        expect.assertions(1);

        const escaper = escaperFactory("java");
        // should return the empty string if we pass in undefined
        expect(escaper.escape()).toBe("");
    });

    test("the java escape does not croak on empty input", () => {
        expect.assertions(1);

        const escaper = escaperFactory("java");
        // should return the empty string if we pass in the empty string
        expect(escaper.escape("")).toBe("");
    });

    test("the java unescaper does not croak on invalid input", () => {
        expect.assertions(1);

        const escaper = escaperFactory("java");
        // should return the empty string if we pass in undefined
        expect(escaper.unescape()).toBe("");
    });

    test("the java unescaper does not croak on empty input", () => {
        expect.assertions(1);

        const escaper = escaperFactory("java");
        // should return the empty string if we pass in the empty string
        expect(escaper.unescape("")).toBe("");
    });

    test("the java raw escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("java-raw");
        expect(escaper.escape("fo\"o'b\\n\u317D")).toBe("fo\"o'b\\n\\u317D");
    });

    test("the java raw unescaper works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("java-raw");
        expect(escaper.unescape("fo\"o'b\\n\\u317D")).toBe("fo\"o'b\\n\u317D");
    });

    test("the java raw unescaper handles line continuations properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("java-raw");
        expect(escaper.unescape("fo\"o'b\\\n\\u317D")).toBe("fo\"o'b\u317D");
    });

    test("the kotlin escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("kotlin");
        expect(escaper.escape("fo\"o'b\\aㅽr𝄞")).toBe("fo\\\"o\\'b\\\\a\\u317Dr\\uD834\\uDD1E");
    });

    test("the kotlin unescaper works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("kotlin");
        expect(escaper.unescape("fo\\\"o\\'b\\\\a\\u317dr\\uD834\\uDD1E")).toBe("fo\"o'b\\aㅽr𝄞");
    });

    test("the kotlin raw escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("kotlin-raw");
        // does absolutely nothing at all to the string
        expect(escaper.escape("fo\"o'b\\n\u317D")).toBe("fo\"o'b\\n\u317D");
    });

    test("the kotlin raw unescaper works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("kotlin-raw");
        // does absolutely nothing at all to the string
        expect(escaper.unescape("fo\"o'b\\n\u317D")).toBe("fo\"o'b\\n\u317D");
    });

    test("the javascript escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("js");
        expect(escaper.escape("fo\"o'b`\\aㅽr𝄞")).toBe("fo\\\"o\\\'b`\\\\a\\u317Dr\\u{1D11E}");
    });

    test("the javascript unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("js");
        expect(escaper.unescape("fo\\\"o\\\'b`\\\\a\\u317dr\\u{1d11e}")).toBe("fo\"o'b`\\aㅽr𝄞");
    });

    test("the javascript unescape works with line continuation characters", () => {
        expect.assertions(1);

        const escaper = escaperFactory("js");
        expect(escaper.unescape("test \\\ntest test")).toBe("test test test");
    });

    test("the javascript template escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("js-template");
        // escape should not escape the single and double quotes
        expect(escaper.escape(`fo"o'b\`\f\r\t
ㅽr𝄞`)).toBe(`fo"o'b\\\`\\f\\r\\t
\\u317Dr\\u{1D11E}`);
    });

    test("the javascript template unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("js-template");
        // unescape should not unescape the single and double quotes
        expect(escaper.unescape(`fo\\"o\\'b\\\`\\f\\r\\t
\\u317Dr\\u{1D11E}`)).toBe(`fo"o'b\`\f\r\t
ㅽr𝄞`);
    });

    test("that javascript is an alias for js", () => {
        expect.assertions(12);

        const escaper = escaperFactory("javascript");
        expect(escaper).toBeTruthy();
        expect(escaper.getStyle()).toBe("js");
        expect(escaper.getName()).toBe("javascript-escaper");

        const escaper2 = escaperFactory("js");
        expect(escaper2).toBeTruthy();
        expect(escaper2.getStyle()).toBe("js");
        expect(escaper2.getName()).toBe("javascript-escaper");

        const escaper3 = escaperFactory("javascript-template");
        expect(escaper3).toBeTruthy();
        expect(escaper3.getStyle()).toBe("js-template");
        expect(escaper3.getName()).toBe("javascript-escaper");

        const escaper4 = escaperFactory("js-template");
        expect(escaper4).toBeTruthy();
        expect(escaper4.getStyle()).toBe("js-template");
        expect(escaper4.getName()).toBe("javascript-escaper");
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

    test("the xml escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("xml");
        expect(escaper.escape("This is <b>bold</b> & uses \'single\' and \"double\" quotes")).toBe("This is &lt;b&gt;bold&lt;/b&gt; &amp; uses &apos;single&apos; and &quot;double&quot; quotes");
    });

    test("the xml unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("xml");
        expect(escaper.unescape("This is &lt;b&gt;bold&lt;/b&gt; &amp; uses &apos;single&apos; and &quot;double&quot; quotes")).toBe("This is <b>bold</b> & uses 'single' and \"double\" quotes");
    });

    test("the xml attribute escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("xml-attr");
        expect(escaper.escape("This is <b>bold</b> & uses \'single\' and \"double\" quotes. Now some chars \n\r\t\x08\f\v")).toBe("This is &lt;b&gt;bold&lt;/b&gt; &amp; uses &apos;single&apos; and &quot;double&quot; quotes. Now some chars \\n\\r\\t\\b\\f\\v");
    });

    test("the xml attribute unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("xml-attr");
        expect(escaper.unescape("This is &lt;b&gt;bold&lt;/b&gt; &amp; uses &apos;single&apos; and &quot;double&quot; quotes. Now some chars \\n\\r\\t\\b\\f\\v")).toBe("This is <b>bold</b> & uses \'single\' and \"double\" quotes. Now some chars \n\r\t\x08\f\v");
    });

    test("that html is an alias for xml", () => {
        expect.assertions(2);

        const escaper = escaperFactory("html");
        expect(escaper).toBeTruthy();
        expect(escaper.getStyle()).toBe("xml");
    });

    test("the swift escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("swift");
        expect(escaper.escape("This string uses all the escapes! \'single\' \"double\" \\ \n\r\t\x00 \u{1D11E}")).toBe("This string uses all the escapes! \\\'single\\\' \\\"double\\\" \\\\ \\n\\r\\t\\0 \\u{1D11E}");
    });

    test("the swift unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("swift");
        expect(escaper.unescape("This string uses all the escapes! \\\'single\\\' \\\"double\\\" \\\\ \\n\\r\\t\\0 \\u{1D11E}")).toBe("This string uses all the escapes! \'single\' \"double\" \\ \n\r\t\x00 \u{1D11E}");
    });

    test("the swift multiline escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("swift-multi");
        // does not escape the \n or \r needlessly
        expect(escaper.escape("This string uses all the escapes!\n\'single\' \"double\" \\ \n\r\t\x00 \u{1D11E}")).toBe("This string uses all the escapes!\n\'single\' \"double\" \\\\ \n\r\t\x00 \u{1D11E}");
    });

    test("the swift multiline unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("swift-multi");
        // does unescape the \n or \r because they are okay in the unescaped string
        expect(escaper.unescape("This string uses all the escapes!\\n\\'single\\' \\\"double\\\" \\\\ \n\\r\\t\\0 \u{1D11E}\\u{1D11E}")).toBe("This string uses all the escapes!\n\'single\' \"double\" \\ \n\r\t\x00 \u{1D11E}\u{1D11E}");
    });

    test("the swift multiline escape properly unindents", () => {
        expect.assertions(1);

        const escaper = escaperFactory("swift-multi");
        expect(escaper.unescape("     five spaces\n   three spaces\n    four spaces")).toBe("  five spaces\nthree spaces\n four spaces");
    });

    test("the swift multiline escape properly unindents with tabs", () => {
        expect.assertions(1);

        const escaper = escaperFactory("swift-multi");
        expect(escaper.unescape("\t\t\t\t\tfive spaces\n\t\t\tthree spaces\n\t\t\t\tfour spaces")).toBe("\t\tfive spaces\nthree spaces\n\tfour spaces");
    });

    test("the swift multiline escape properly removes line continuations", () => {
        expect.assertions(1);

        const escaper = escaperFactory("swift-multi");
        expect(escaper.unescape("five spaces\\\nthree spaces\\\nfour spaces")).toBe("five spacesthree spacesfour spaces");
    });

    test("the swift extended escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("swift-extended");
        expect(escaper.escape("This string uses all the escapes! \'single\' \"double\" \\ \n\r\t\x00 \u{1D11E}")).toBe("This string uses all the escapes! \'single\' \"double\" \\ \n\r\t\x00 \u{1D11E}");
    });

    test("the swift extended unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("swift-extended");
        expect(escaper.unescape("This string uses all the escapes! \\#'single\\#' \\#\"double\\#\" \\#\\ \\#n\\#r\\#t\\#0 \u{1D11E}")).toBe("This string uses all the escapes! \'single\' \"double\" \\ \n\r\t\x00 \u{1D11E}");
    });

    test("the swift extended unescape does not unescape things without hashes", () => {
        expect.assertions(1);

        const escaper = escaperFactory("swift-extended");
        expect(escaper.unescape("This string uses all the escapes! 'single' \"double\" \\ \n\r\t\x00 \u{1D11E}")).toBe("This string uses all the escapes! 'single' \"double\" \\ \n\r\t\x00 \u{1D11E}");
    });

    test("the swift extended properly removes line continations", () => {
        expect.assertions(1);

        const escaper = escaperFactory("swift-extended");
        expect(escaper.unescape("five spaces\\#\nthree spaces\\#\nfour spaces")).toBe("five spacesthree spacesfour spaces");
    });

    test("the swift extended properly unindents", () => {
        expect.assertions(1);

        const escaper = escaperFactory("swift-extended");
        expect(escaper.unescape("     five spaces\n   three spaces\n    four spaces")).toBe("  five spaces\nthree spaces\n four spaces");
    });

    test("the c# escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("csharp");
        expect(escaper.escape("This string uses all the escapes! \'single\' \"double\" \\ \x00\x07\x08\x1B\f\n\r\t\v \u317D \u{1D11E}")).toBe("This string uses all the escapes! \\\'single\\\' \\\"double\\\" \\\\ \\0\\a\\b\\e\\f\\n\\r\\t\\v \\u317D \\U0001D11E");
    });

    test("the c# unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("csharp");
        expect(escaper.unescape("This string uses all the escapes! \\\'single\\\' \\\"double\\\" \\\\ \\0\\a\\b\\e\\f\\n\\r\\t\\v \\x54 \\u317D \\U0001D11E")).toBe("This string uses all the escapes! \'single\' \"double\" \\ \x00\x07\x08\x1B\f\n\r\t\v T \u317D 𝄞");
    });

    test("the c# raw escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("csharp-raw");
        // only Unicode characters are escaped
        expect(escaper.escape("This string uses\nall the escapes! \'single\' \"double\" \\ \x00\x07\x08\x1B\f\n\r\t\v \u317D \u{1D11E}")).toBe("This string uses\nall the escapes! \'single\' \"double\" \\ \x00\x07\x08\x1B\f\n\r\t\v \\u317D \\U0001D11E");
    });

    test("the c# raw unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("csharp-raw");
        // only Unicode characters are unescaped
        expect(escaper.unescape("This string uses\nall the escapes! \'single\' \"double\" \\ \x00\x07\x08\x1B\f\n\r\t\v \\u317D \\U0001D11E")).toBe("This string uses\nall the escapes! \'single\' \"double\" \\ \x00\x07\x08\x1B\f\n\r\t\v \u317D \u{1D11E}");
    });

    test("the c# raw unescape unindents properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("csharp-raw");
        expect(escaper.unescape("     five spaces\n      six spaces\n    four spaces")).toBe(" five spaces\n  six spaces\nfour spaces");
    });

    test("the c# raw unescape unindents properly if the last line with the closing quotes is also indented", () => {
        expect.assertions(1);

        const escaper = escaperFactory("csharp-raw");
        expect(escaper.unescape("     five spaces\n      six spaces\n    four spaces\n   ")).toBe("  five spaces\n   six spaces\n four spaces\n");
    });

    test("the c# verbatim escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("csharp-verbatim");
        // nothing is escaped except double quotes
        expect(escaper.escape("This string uses\nall the escapes! \'single\' \"double\" \\ \x00\x07\x08\x1B\f\n\r\t\v \u317D \u{1D11E}")).toBe("This string uses\nall the escapes! \'single\' \"\"double\"\" \\ \x00\x07\x08\x1B\f\n\r\t\v \u317D \u{1D11E}");
    });

    test("the c# verbatim unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("csharp-verbatim");
        // nothing is unescaped except double quotes
        expect(escaper.unescape("This string uses\nall the escapes! \'single\' \"\"double\"\" \\ \x00\x07\x08\x1B\f\n\r\t\v \u317D \u{1D11E}")).toBe("This string uses\nall the escapes! \'single\' \"double\" \\ \x00\x07\x08\x1B\f\n\r\t\v \u317D \u{1D11E}");
    });

    test("that c# is an alias for csharp", () => {
        expect.assertions(6);

        let escaper = escaperFactory("c#");
        expect(escaper).toBeTruthy();
        expect(escaper.getStyle()).toBe("csharp");

        escaper = escaperFactory("c#-raw");
        expect(escaper).toBeTruthy();
        expect(escaper.getStyle()).toBe("csharp-raw");

        escaper = escaperFactory("c#-verbatim");
        expect(escaper).toBeTruthy();
        expect(escaper.getStyle()).toBe("csharp-verbatim");
    });

    test("the URI escape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("uri");
        expect(escaper.escape("https://github.com/ilib-js/ilib-mono?q=foo bar&\u317D=\u{1D11E}&ü=ue#ł")).toBe("https://github.com/ilib-js/ilib-mono?q=foo%20bar&%E3%85%BD=%F0%9D%84%9E&%C3%BC=ue#%C5%82");
    });

    test("the URI unescape works properly", () => {
        expect.assertions(1);

        const escaper = escaperFactory("uri");
        expect(escaper.unescape("https://github.com/ilib-js/ilib-mono?q=foo%20bar&%E3%85%BD=%F0%9D%84%9E&%C3%BC=ue#%C5%82")).toBe("https://github.com/ilib-js/ilib-mono?q=foo bar&\u317D=\u{1D11E}&ü=ue#ł");
    });

    test("test that url is an alias for uri", () => {
        expect.assertions(2);

        const escaper = escaperFactory("url");
        expect(escaper).toBeTruthy();
        expect(escaper.getStyle()).toBe("uri");
    });

    test.each([
        { style: "csharp", str: "This string uses all the escapes! \\\'single\\\' \\\"double\\\" \\\\ \\0\\a\\b\\e\\f\\n\\r\\t\\v \\u317D \\U0001D11E" },
        { style: "csharp-raw", str: "This string uses\nall the escapes! \'single\' \"double\" \\ \x00\x07\x08\x1B\f\n\r\t\v \\u317D \\U0001D11E" },
        { style: "csharp-verbatim", str: "This string uses\nall the escapes! \'single\' \"\"double\"\" \\ \x00\x07\x08\x1B\f\n\r\t\v \u317D \u{1D11E}" },
        { style: "java", str: "fo\\\"o\\'b\\\\a\\u317Dr\\uD834\\uDD1E" },
        { style: "java-raw", str: "fo\"o'b\\n\\u317D" },
        { style: "json", str: "abc \\\\ \\0\\f\\n\\b\\t\\v\\reㅽr𝄞" },
        { style: "js", str: "fo\\\"o\\'b`\\\\a\\u317Dr\\u{1D11E}" },
        { style: "js-template", str: "fo\"o'b\\`\\f\\r\\t\n\\u317Dr\\u{1D11E}" },
        { style: "kotlin", str: "fo\\\"o\\'b\\\\a\\u317Dr\\uD834\\uDD1E" },
        { style: "kotlin-raw", str: "fo\"o'b\\n\\u317D" },
        { style: "php-double", str: "abc 'd' \\\"e\\\" \\$\\n\\r\\t\\e\\f\\vT\\u{317D} \\u{317D}r\\u{1D11E}" },
        { style: "php-single", str: "abc \\'d\\' \\\\ \"e\" $\n\r\t\e\f\v\x54\\\\u{317d} ㅽr𝄞" },
        { style: "php-heredoc", str: "abc 'd' \"e\" \\$\\n\\r\\t\\e\\f\\vT\\u{317D} \\u{317D}r\\u{1D11E}" },
        { style: "php-nowdoc", str: "abc \\'d\\' \\\\ \"e\" $\n\r\t\e\f\v\x54\\u{317d} ㅽr𝄞" },
        { style: "python", str: "abc \\'d\\' \\\"e\\\" \\\\ \\n\\r\\t\\b\\f\\v\\aT\\u317D \\U0001D11E" },
        { style: "python-raw", str: "abc \\'d\\' \"e\" \\\\ \n\r\t\x08\f\v\x07\x54ㅽ 𝄞" },
        { style: "python-byte", str: "abc \\'d\\' \"e\" \\\\ \n\r\t\x08\f\v\x07\x54ㅽ 𝄞" },
        { style: "python-multi", str: "abc 'd' \\\"e\\\" \\\\ \\n\\r\\t\\b\\f\\v\\aT\\u317D \\U0001D11E" },
        { style: "smarty-double", str: "abc 'd' \\\"e\\\" \\$\\n\\r\\t\\e\\f\\vTㅽ ㅽr𝄞" },
        { style: "smarty-single", str: "abc \\'d\\' \\\\ \"e\" $\n\r\t\e\f\v\x54\\\\u{317d} ㅽr𝄞" },
        { style: "swift", str: "This string uses all the escapes! \\\'single\\\' \\\"double\\\" \\\\ \\n\\r\\t\\0 \\u{1D11E}" },
        { style: "swift-multi", str: "This string uses all the escapes!\n\'single\' \"double\" \\\\ \n\r\t\x00 \u317D \u{1D11E}" },
        { style: "swift-extended", str: "This string uses all the escapes! \'single\' \"double\" \\\\ \n\r\t\x00 \u{1D11E}" },
        { style: "uri", str: "https://github.com/ilib-js/ilib-mono?q=foo%20bar&%E3%85%BD=%F0%9D%84%9E&%C3%BC=ue#%C5%82" },
        { style: "xml", str: "This is &lt;b&gt;bold&lt;/b&gt; &amp; uses &apos;single&apos; and &quot;double&quot; quotes" },
        { style: "xml-attr", str: "This is &lt;b&gt;bold&lt;/b&gt; &amp; uses &apos;single&apos; and &quot;double&quot; quotes. Now some chars \\n\\r\\t\\b\\f\\v" },
    ])("$style unescaping and re-escaping should give you back the same string for any chars that should be escaped", ({style, str}) => {
        expect.assertions(1);

        const escaper = escaperFactory(style);
        expect(escaper.escape(escaper.unescape(str))).toBe(str);
    });
});
