/*
 * ResourceConvert.test.js - test the resource conversion functions.
 *
 * Copyright © 2024 Box, Inc.
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

var ResourcePlural = require("../lib/ResourcePlural.js");
var ResourceString = require("../lib/ResourceString.js");
var ResourceArray = require("../lib/ResourceArray.js");
var convert = require("../lib/ResourceConvert.js");

describe("convertPluralResToICU", function () {
    test("converts plural source to string", function () {
        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            },
            targetLocale: "de-DE",
            targetStrings: {
                one: "Es gibt {n} Zeichenfolge.",
                other: "Es gibt {n} Zeichenfolgen.",
            }
        });
        var expected = "{count, plural, one {There is {n} string.} other {There are {n} strings.}}";

        var string = convert.convertPluralResToICU(plural);

        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
    });

    test("converts plural source to string in a source-only resource", function () {
        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            }
        });
        var expected = "{count, plural, one {There is {n} string.} other {There are {n} strings.}}";

        var string = convert.convertPluralResToICU(plural);

        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
        expect(string.getSourceLocale()).toBe("en-US");
        expect(string.getTarget()).toBeUndefined();
        expect(string.getTargetLocale()).toBeUndefined();
    });

    test("converts plural target to string", function () {
        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            },
            targetLocale: "de-DE",
            targetStrings: {
                one: "Es gibt {n} Zeichenfolge.",
                other: "Es gibt {n} Zeichenfolgen.",
            }
        });
        var expected = "{count, plural, one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}";

        var string = convert.convertPluralResToICU(plural);

        expect(string.getType()).toBe("string");
        expect(string.getTarget()).toBe(expected);
    });

    test("converts plural source to string when the target has more plural categories than the source", function () {
        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} item.",
                other: "There are {n} items."
            },
            targetLocale: "pl-PL",
            targetStrings: {
                one: "Jest {n} pozycja.",
                few: "Jest {n} pozycje.",
                other: "Jest {n} pozycji.",
            }
        });
        var expected = "{count, plural, one {There is {n} item.} other {There are {n} items.}}";

        var string = convert.convertPluralResToICU(plural);

        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
    });

    test("converts plural target to string when the target has more plural categories than the source", function () {
        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} item.",
                other: "There are {n} items."
            },
            targetLocale: "pl-PL",
            targetStrings: {
                one: "Jest {n} pozycja.",
                few: "Jest {n} pozycje.",
                other: "Jest {n} pozycji.",
            }
        });
        var expected = "{count, plural, one {Jest {n} pozycja.} few {Jest {n} pozycje.} other {Jest {n} pozycji.}}";

        var string = convert.convertPluralResToICU(plural);

        expect(string.getType()).toBe("string");
        expect(string.getTarget()).toBe(expected);
    });

    test("converts plural source to string when the target has less plural categories than the source", function () {
        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} item.",
                other: "There are {n} items."
            },
            targetLocale: "ja-JP",
            targetStrings: {
                other: "{n}1件の商品があります。",
            }
        });
        var expected = "{count, plural, one {There is {n} item.} other {There are {n} items.}}";

        var string = convert.convertPluralResToICU(plural);

        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
    });

    test("converts plural target to string when the target has less plural categories than the source", function () {
        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} item.",
                other: "There are {n} items."
            },
            targetLocale: "ja-JP",
            targetStrings: {
                other: "{n}1件の商品があります。",
            }
        });
        var expected = "{count, plural, other {{n}1件の商品があります。}}";

        var string = convert.convertPluralResToICU(plural);

        expect(string.getType()).toBe("string");
        expect(string.getTarget()).toBe(expected);
    });

    test("don't convert array resources to a string", function () {
        var plural = new ResourceArray({
            sourceLocale: "en-US",
            sourceArray: [
                "There is 1 string.",
                "There are 2 strings."
            ],
            targetLocale: "de-DE",
            targetArray: [
                "Es gibt 1 Zeichenfolge.",
                "Es gibt 2 Zeichenfolgen.",
            ]
        });

        var string = convert.convertPluralResToICU(plural);

        expect(string).toBeUndefined(); // no conversion
    });

    test("don't convert string resources to a different string", function () {
        var plural = new ResourceString({
            sourceLocale: "en-US",
            source: "There is 1 string.",
            targetLocale: "de-DE",
            target: "Es gibt 1 Zeichenfolge."
        });

        var string = convert.convertPluralResToICU(plural);

        expect(string).toBeUndefined(); // no conversion
    });

    test("converts string source to plural", function () {
        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "de-DE",
            target: "{count, plural, one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}",
        });
        var expected = {
            one: "There is {n} string.",
            other: "There are {n} strings."
        };

        var plural = convert.convertICUToPluralRes(string);

        expect(plural.getType()).toBe("plural");
        expect(plural.getSourcePlurals()).toStrictEqual(expected);
    });

    test("converts string source to plural in a source-only resource", function () {
        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}"
        });
        var expected = {
            one: "There is {n} string.",
            other: "There are {n} strings."
        };

        var plural = convert.convertICUToPluralRes(string);

        expect(plural.getType()).toBe("plural");
        expect(plural.getSourcePlurals()).toStrictEqual(expected);
        expect(plural.getSourceLocale()).toBe("en-US");
        expect(plural.getTargetPlurals()).toBeUndefined();
        expect(plural.getTargetLocale()).toBeUndefined();
    });

    test("converts plural source to string preserves all other fields", function () {
        var plural = new ResourcePlural({
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            },
            targetLocale: "de-DE",
            targetStrings: {
                one: "Es gibt {n} Zeichenfolge.",
                other: "Es gibt {n} Zeichenfolgen.",
            },
            key: "asdf",
            project: "project",
            pathName: "a/b/c.xliff",
            datatype: "json",
            flavor: "chocolate",
            comment: "no comment",
            state: "new"
        });
        var expected = "{count, plural, one {There is {n} string.} other {There are {n} strings.}}";

        var string = convert.convertPluralResToICU(plural);

        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
        expect(string.getKey()).toBe("asdf");
        expect(string.getProject()).toBe("project");
        expect(string.getPath()).toBe("a/b/c.xliff");
        expect(string.getDataType()).toBe("json");
        expect(string.getFlavor()).toBe("chocolate");
        expect(string.getComment()).toBe("no comment");
        expect(string.getState()).toBe("new");
    });
});

describe("convertICUToPluralRes", () => {
    test("converts string target to plural", function () {
        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "de-DE",
            target: "{count, plural,  one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}",
        });
        var expected = {
            one: "Es gibt {n} Zeichenfolge.",
            other: "Es gibt {n} Zeichenfolgen.",
        };

        var plural = convert.convertICUToPluralRes(string);

        expect(plural.getType()).toBe("plural");
        expect(plural.getTargetPlurals()).toStrictEqual(expected);
    });

    test.each([
        {
            name: "flat tags",
            source: "{count, plural, one {There is {n} <b>string</b>.} other {There are {n} <b>strings</b>.}}",
            target: "{count, plural,  one {Es gibt {n} <b>Zeichenfolge</b>.} other {Es gibt {n} <b>Zeichenfolgen</b>.}}",
            expected: {
                one: "Es gibt {n} <b>Zeichenfolge</b>.",
                other: "Es gibt {n} <b>Zeichenfolgen</b>.",
            }
        },
        {
            name: "self-closing tags",
            source: "{count, plural, one {There is {n} <img/>string.} other {There are {n} <img/>strings.}}",
            target: "{count, plural,  one {Es gibt {n} <img/>Zeichenfolge.} other {Es gibt {n} <img/>Zeichenfolgen.}}",
            expected: {
                one: "Es gibt {n} <img/>Zeichenfolge.",
                other: "Es gibt {n} <img/>Zeichenfolgen.",
            }
        },
        {
            name: "open-close tags with no child node",
            source: "{count, plural, one {There is {n} <b></b>string.} other {There are {n} <b></b>strings.}}",
            target: "{count, plural,  one {Es gibt {n} <b></b>Zeichenfolge.} other {Es gibt {n} <b></b>Zeichenfolgen.}}",
            expected: {
                one: "Es gibt {n} <b></b>Zeichenfolge.",
                other: "Es gibt {n} <b></b>Zeichenfolgen.",
            }
        },
        {
            name: "nested tags",
            source: "{count, plural, one {There is {n} <span><b>string</b></span>.} other {There are {n} <span><b>strings</b></span>.}}",
            target: "{count, plural,  one {Es gibt {n} <span><b>Zeichenfolge</b></span>.} other {Es gibt {n} <span><b>Zeichenfolgen</b></span>.}}",
            expected: {
                one: "Es gibt {n} <span><b>Zeichenfolge</b></span>.",
                other: "Es gibt {n} <span><b>Zeichenfolgen</b></span>.",
            }
        },
    ])("converts string target to plural when it contains $name", function ({source, target, expected}) {
        var string = new ResourceString({
            sourceLocale: "en-US",
            source,
            targetLocale: "de-DE",
            target,
        });

        var plural = convert.convertICUToPluralRes(string);

        expect(plural.getType()).toBe("plural");
        expect(plural.getTargetPlurals()).toStrictEqual(expected);
    });

    test("throws SyntaxError when converting string target with unclosed tag to plural ", () => {
        var consoleSpy = jest.spyOn(console, "log").mockImplementationOnce(() => {
        });
        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} <b>string.} other {There are {n} <b>strings.}}",
            targetLocale: "de-DE",
            target: "{count, plural,  one {Es gibt {n} <b>Zeichenfolge.} other {Es gibt {n} <b>Zeichenfolgen.}}"
        });

        convert.convertICUToPluralRes(string);

        expect(consoleSpy).toHaveBeenCalledWith(expect.any(SyntaxError));
        expect(consoleSpy).toHaveBeenCalledWith(expect.objectContaining({message: "UNCLOSED_TAG"}));

        consoleSpy.mockRestore();
    });

    test("converts string source to plural when the target has more plural categories than the source", function () {
        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "pl-PL",
            target: "{count, plural, one {Jest {n} pozycja.} few {Jest {n} pozycje.} other {Jest {n} pozycji.}}"
        });
        var expected = {
            one: "There is {n} string.",
            other: "There are {n} strings."
        };

        var plural = convert.convertICUToPluralRes(string);

        expect(plural.getType()).toBe("plural");
        expect(plural.getSourcePlurals()).toStrictEqual(expected);
    });

    test("converts string target to plural when the target has more plural categories than the source", function () {
        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "pl-PL",
            target: "{count, plural, one {Jest {n} pozycja.} few {Jest {n} pozycje.} other {Jest {n} pozycji.}}"
        });
        var expected = {
            one: "Jest {n} pozycja.",
            few: "Jest {n} pozycje.",
            other: "Jest {n} pozycji.",
        };

        var plural = convert.convertICUToPluralRes(string);

        expect(plural.getType()).toBe("plural");
        expect(plural.getTargetPlurals()).toStrictEqual(expected);
    });

    test("converts string source to plural when the target has less plural categories than the source", function () {
        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "ja-JP",
            target: "{count, plural, other {{n}1件の商品があります。}}"
        });
        var expected = {
            one: "There is {n} string.",
            other: "There are {n} strings."
        };

        var plural = convert.convertICUToPluralRes(string);

        expect(plural.getType()).toBe("plural");
        expect(plural.getSourcePlurals()).toStrictEqual(expected);
    });

    test("converts string target to plural when the target has less plural categories than the source", function () {
        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "ja-JP",
            target: "{count, plural, other {{n}1件の商品があります。}}"
        });
        var expected = {
            other: "{n}1件の商品があります。",
        };

        var plural = convert.convertICUToPluralRes(string);

        expect(plural.getType()).toBe("plural");
        expect(plural.getTargetPlurals()).toStrictEqual(expected);
    });

    test("converts string target to plural, preserving all other fields", function () {
        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "de-DE",
            target: "{count, plural,  one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}",
            key: "asdf",
            project: "project",
            pathName: "a/b/c.xliff",
            datatype: "json",
            flavor: "chocolate",
            comment: "no comment",
            state: "new"
        });
        var expected = {
            one: "Es gibt {n} Zeichenfolge.",
            other: "Es gibt {n} Zeichenfolgen.",
        };

        var plural = convert.convertICUToPluralRes(string);

        expect(plural.getType()).toBe("plural");
        expect(plural.getTargetPlurals()).toStrictEqual(expected);
        expect(string.getKey()).toBe("asdf");
        expect(string.getProject()).toBe("project");
        expect(string.getPath()).toBe("a/b/c.xliff");
        expect(string.getDataType()).toBe("json");
        expect(string.getFlavor()).toBe("chocolate");
        expect(string.getComment()).toBe("no comment");
        expect(string.getState()).toBe("new");
    });

    test("does not convert non-plural string to plural", function () {
        var string = new ResourceString({
            sourceLocale: "en-US",
            source: "There is 1 string.",
            targetLocale: "de-DE",
            target: "Es gibt 1 Zeichenfolge."
        });

        var plural = convert.convertICUToPluralRes(string);

        expect(plural).toBeUndefined();
    });

    test("does not convert array to plural", function () {
        var array = new ResourceArray({
            key: "c",
            sourceLocale: "en-US",
            sourceArray: [
                "one",
                "two",
                "three"
            ],
            targetLocale: "de-DE",
            targetArray: [
                "eins",
                "zwei",
                "drei"
            ]
        });

        var plural = convert.convertICUToPluralRes(array);

        expect(plural).toBeUndefined();
    });

    test("does not convert plural to another plural", function () {
        var plural = new ResourcePlural({
            key: "a",
            sourceLocale: "en-US",
            sourceStrings: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            },
            targetLocale: "de-DE",
            targetStrings: {
                one: "Es gibt {n} Zeichenfolge.",
                other: "Es gibt {n} Zeichenfolgen.",
            }
        });

        plural = convert.convertICUToPluralRes(plural);

        expect(plural).toBeUndefined();
    });
})
