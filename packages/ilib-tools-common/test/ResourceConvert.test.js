/*
 * ResourceConvert.test.js - test the resource conversion functions.
 *
 * Copyright © 2024-2025 Box, Inc.
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

import ResourcePlural from "../src/ResourcePlural.js";
import ResourceString from "../src/ResourceString.js";
import ResourceArray from "../src/ResourceArray.js";
import { convertPluralResToICU, convertICUToPluralRes } from "../src/ResourceConvert.js";

describe("resource conversion functions", function() {
    test("convert plural source to string", function() {
        expect.assertions(2);

        const plural = new ResourcePlural({
            sourceLocale: "en-US",
            source: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            },
            targetLocale: "de-DE",
            target: {
                one: "Es gibt {n} Zeichenfolge.",
                other: "Es gibt {n} Zeichenfolgen.",
            },
            pivots: ["n"]
        });

        const string = convertPluralResToICU(plural);
        const expected = "{n, plural, one {There is {n} string.} other {There are {n} strings.}}";
        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
    });

    test("convert plural source to string without pivots", function() {
        expect.assertions(2);

        const plural = new ResourcePlural({
            sourceLocale: "en-US",
            source: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            },
            targetLocale: "de-DE",
            target: {
                one: "Es gibt {n} Zeichenfolge.",
                other: "Es gibt {n} Zeichenfolgen.",
            }
        });

        const string = convertPluralResToICU(plural);
        // "count" is the default pivot name
        const expected = "{count, plural, one {There is {n} string.} other {There are {n} strings.}}";
        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
    });

    test("convert plural source to string in a source-only resource", function() {
        expect.assertions(5);

        const plural = new ResourcePlural({
            sourceLocale: "en-US",
            source: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            },
            pivots: ["n"]
        });

        const string = convertPluralResToICU(plural);
        const expected = "{n, plural, one {There is {n} string.} other {There are {n} strings.}}";
        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
        expect(string.getSourceLocale()).toBe("en-US");

        expect(string.getTarget()).toBeUndefined();
        expect(string.getTargetLocale()).toBeUndefined();
    });

    test("convert plural target to string", function() {
        expect.assertions(2);

        const plural = new ResourcePlural({
            sourceLocale: "en-US",
            source: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            },
            targetLocale: "de-DE",
            target: {
                one: "Es gibt {n} Zeichenfolge.",
                other: "Es gibt {n} Zeichenfolgen.",
            },
            pivots: ["n"]
        });

        const string = convertPluralResToICU(plural);
        const expected = "{n, plural, one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}";
        expect(string.getType()).toBe("string");
        expect(string.getTarget()).toBe(expected);
    });

    test("convert plural source to string when the target has more plural categories than the source", function() {
        expect.assertions(2);

        const plural = new ResourcePlural({
            sourceLocale: "en-US",
            source: {
                one: "There is {n} item.",
                other: "There are {n} items."
            },
            targetLocale: "pl-PL",
            target: {
                one: "Jest {n} pozycja.",
                few: "Jest {n} pozycje.",
                other: "Jest {n} pozycji.",
            },
            pivots: ["n"]
        });

        const string = convertPluralResToICU(plural);
        const expected = "{n, plural, one {There is {n} item.} other {There are {n} items.}}";
        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
    });

    test("convert plural target to string when the target has more plural categories than the source", function() {
        expect.assertions(2);

        const plural = new ResourcePlural({
            sourceLocale: "en-US",
            source: {
                one: "There is {n} item.",
                other: "There are {n} items."
            },
            targetLocale: "pl-PL",
            target: {
                one: "Jest {n} pozycja.",
                few: "Jest {n} pozycje.",
                other: "Jest {n} pozycji.",
            },
            pivots: ["n"]
        });

        const string = convertPluralResToICU(plural);
        const expected = "{n, plural, one {Jest {n} pozycja.} few {Jest {n} pozycje.} other {Jest {n} pozycji.}}";
        expect(string.getType()).toBe("string");
        expect(string.getTarget()).toBe(expected);
    });

    test("convert plural source to string when the target has less plural categories than the source", function() {
        expect.assertions(2);

        const plural = new ResourcePlural({
            sourceLocale: "en-US",
            source: {
                one: "There is {n} item.",
                other: "There are {n} items."
            },
            targetLocale: "ja-JP",
            target: {
                other: "{n}1件の商品があります。",
            },
            pivots: ["n"]
        });

        const string = convertPluralResToICU(plural);
        const expected = "{n, plural, one {There is {n} item.} other {There are {n} items.}}";
        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
    });

    test("convert plural target to string when the target has less plural categories than the source", function() {
        expect.assertions(2);

        const plural = new ResourcePlural({
            sourceLocale: "en-US",
            source: {
                one: "There is {n} item.",
                other: "There are {n} items."
            },
            targetLocale: "ja-JP",
            target: {
                other: "{n}1件の商品があります。",
            },
            pivots: ["n"]
        });

        const string = convertPluralResToICU(plural);
        const expected = "{n, plural, other {{n}1件の商品があります。}}";
        expect(string.getType()).toBe("string");
        expect(string.getTarget()).toBe(expected);
    });

    test("don't convert array resources to a string", function() {
        expect.assertions(1);

        const plural = new ResourceArray({
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

        const string = convertPluralResToICU(plural);

        expect(string).toBeUndefined(); // no conversino
    });

    test("don't convert string resources to a different string", function() {
        expect.assertions(1);

        const plural = new ResourceString({
            sourceLocale: "en-US",
            source: "There is 1 string.",
            targetLocale: "de-DE",
            target: "Es gibt 1 Zeichenfolge."
        });

        const string = convertPluralResToICU(plural);

        expect(string).toBeUndefined(); // no conversino
    });

    test("convert string source to plural", function() {
        expect.assertions(3);

        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "{count, plural, one {There is {count} string.} other {There are {count} strings.}}",
            targetLocale: "de-DE",
            target: "{count, plural, one {Es gibt {count} Zeichenfolge.} other {Es gibt {count} Zeichenfolgen.}}",
        });

        const expected = {
            one: "There is {count} string.",
            other: "There are {count} strings."
        };
        const plural = convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getSource()).toStrictEqual(expected);
        expect(plural.getPivots()).toStrictEqual(["count"]);
    });

    test("convert string source to plural in a source-only resource", function() {
        expect.assertions(5);

        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "{n, plural, one {There is {n} string.} other {There are {n} strings.}}"
        });

        const expected = {
            one: "There is {n} string.",
            other: "There are {n} strings."
        };
        const plural = convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getSource()).toStrictEqual(expected);
        expect(plural.getSourceLocale()).toBe("en-US");

        expect(plural.getTarget()).toBeUndefined();
        expect(plural.getTargetLocale()).toBeUndefined();
    });

    test("convert plural source to string preserves all other fields", function() {
        expect.assertions(9);

        const plural = new ResourcePlural({
            sourceLocale: "en-US",
            source: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            },
            targetLocale: "de-DE",
            target: {
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

        const string = convertPluralResToICU(plural);
        const expected = "{count, plural, one {There is {n} string.} other {There are {n} strings.}}";
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

    test("convert string target to plural", function() {
        expect.assertions(2);

        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "{n, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "de-DE",
            target: "{n, plural, one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}",
            pivots: ["n"]
        });

        const expected = {
            one: "Es gibt {n} Zeichenfolge.",
            other: "Es gibt {n} Zeichenfolgen.",
        };
        const plural = convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getTarget()).toStrictEqual(expected);
    });

    test("convert string source to plural when the target has more plural categories than the source", function() {
        expect.assertions(3);

        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "{n, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "pl-PL",
            target: "{n, plural, one {Jest {n} pozycja.} few {Jest {n} pozycje.} other {Jest {n} pozycji.}}"
        });

        const expected = {
            one: "There is {n} string.",
            other: "There are {n} strings."
        };

        const plural = convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getSource()).toStrictEqual(expected);
        expect(plural.getPivots()).toStrictEqual(["n"]);
    });

    test("convert string target to plural when the target has more plural categories than the source", function() {
        expect.assertions(2);

        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "{n, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "pl-PL",
            target: "{n, plural, one {Jest {n} pozycja.} few {Jest {n} pozycje.} other {Jest {n} pozycji.}}"
        });

        const expected = {
            one: "Jest {n} pozycja.",
            few: "Jest {n} pozycje.",
            other: "Jest {n} pozycji.",
        };

        const plural = convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getTarget()).toStrictEqual(expected);
    });

    test("convert string source to plural when the target has less plural categories than the source", function() {
        expect.assertions(2);

        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "{n, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "ja-JP",
            target: "{n, plural, other {{n}1件の商品があります。}}"
        });

        const expected = {
            one: "There is {n} string.",
            other: "There are {n} strings."
        };

        const plural = convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getSource()).toStrictEqual(expected);
    });

    test("convert string target to plural when the target has less plural categories than the source", function() {
        expect.assertions(2);

        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "{n, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "ja-JP",
            target: "{n, plural, other {{n}1件の商品があります。}}"
        });

        const expected = {
            other: "{n}1件の商品があります。",
        };

        const plural = convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getTarget()).toStrictEqual(expected);
    });

    test("convert string target to plural, preserving all other fields", function() {
        expect.assertions(9);

        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "{n, plural, one {There is {n} string.} other {There are {n} strings.}}",
            targetLocale: "de-DE",
            target: "{n, plural,  one {Es gibt {n} Zeichenfolge.} other {Es gibt {n} Zeichenfolgen.}}",
            key: "asdf",
            project: "project",
            pathName: "a/b/c.xliff",
            datatype: "json",
            flavor: "chocolate",
            comment: "no comment",
            state: "new"
        });

        const expected = {
            one: "Es gibt {n} Zeichenfolge.",
            other: "Es gibt {n} Zeichenfolgen.",
        };
        const plural = convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getTarget()).toStrictEqual(expected);
        expect(string.getKey()).toBe("asdf");
        expect(string.getProject()).toBe("project");
        expect(string.getPath()).toBe("a/b/c.xliff");
        expect(string.getDataType()).toBe("json");
        expect(string.getFlavor()).toBe("chocolate");
        expect(string.getComment()).toBe("no comment");
        expect(string.getState()).toBe("new");
    });

    test("don't convert non-plural string to plural", function() {
        expect.assertions(1);

        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "There is 1 string.",
            targetLocale: "de-DE",
            target: "Es gibt 1 Zeichenfolge."
        });

        const plural = convertICUToPluralRes(string);
        expect(plural).toBeUndefined();
    });

    test("don't convert array to plural", function() {
        expect.assertions(1);

        const array = new ResourceArray({
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

        const plural = convertICUToPluralRes(array);
        expect(plural).toBeUndefined();
    });

    test("don't convert plural to another plural", function() {
        expect.assertions(1);

        const plural = new ResourcePlural({
            key: "a",
            sourceLocale: "en-US",
            source: {
                one: "There is {n} string.",
                other: "There are {n} strings."
            },
            targetLocale: "de-DE",
            target: {
                one: "Es gibt {n} Zeichenfolge.",
                other: "Es gibt {n} Zeichenfolgen.",
            }
        });

        const plural2 = convertICUToPluralRes(plural);
        expect(plural2).toBeUndefined();
    });

    test("convert an ICU plural source string with text outside the plural into a plural resource", function() {
        expect.assertions(3);

        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "There {count, plural, one {is # item} other {are # items}} in your cart."
        });
        const expected = {
            one: "There is {count} item in your cart.",
            other: "There are {count} items in your cart."
        };
        const plural = convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getSource()).toStrictEqual(expected);
        expect(plural.getPivots()).toStrictEqual(["count"]);
    });

    test("convert an ICU plural target string with text outside the plural into a plural resource", function() {
        expect.assertions(3);
        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "There {count, plural, one {is # item} other {are # items}} in your cart.",
            targetLocale: "de-DE",
            target: "Es gibt {count, plural, one {# Objekt} other {# Objekte}} in Ihrem Warenkorb."
        });
        const expected = {
            one: "Es gibt {count} Objekt in Ihrem Warenkorb.",
            other: "Es gibt {count} Objekte in Ihrem Warenkorb."
        };
        const plural = convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getTarget()).toStrictEqual(expected);
        expect(plural.getPivots()).toStrictEqual(["count"]);
    });

    test("convert an ICU plural source string with other nodes outside the plural into a plural resource", function() {
        expect.assertions(2);
        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "Hello {username}, total files: {count, number}. There {count, plural, one {is # file} other {are # files}} ready for download.",
            key: "asdf",
        });
        const expected = {
            one: "Hello {username}, total files: {count, number}. There is {count} file ready for download.",
            other: "Hello {username}, total files: {count, number}. There are {count} files ready for download."
        };
        const plural = convertICUToPluralRes(string);
        expect(plural.getSource()).toStrictEqual(expected);
        expect(plural.getPivots()).toStrictEqual(["count"]);
    });

    test("convert an ICU plural target string with other nodes outside the plural into a plural resource", function() {
        expect.assertions(2);
        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "Hello {username}, total files: {count, number}. There {count, plural, one {is # file} other {are # files}} ready for download.",
            targetLocale: "de-DE",
            target: "Hallo {username}, Gesamtdateien: {count, number}. Es gibt {count, plural, one {# Datei} other {# Dateien}} zum Herunterladen.",
            key: "asdf",
        });
        const expected = {
            one: "Hallo {username}, Gesamtdateien: {count, number}. Es gibt {count} Datei zum Herunterladen.",
            other: "Hallo {username}, Gesamtdateien: {count, number}. Es gibt {count} Dateien zum Herunterladen."
        };
        const plural = convertICUToPluralRes(string);
        expect(plural.getTarget()).toStrictEqual(expected);
        expect(plural.getPivots()).toStrictEqual(["count"]);
    });

    test("convert an ICU plural source string with stuff outside the plural into a plural resource, preserving all other fields", function() {
        expect.assertions(9);
        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "Hello {username}, total files: {count, number}. There {count, plural, one {is # file} other {are # files}} ready for download.",
            targetLocale: "de-DE",
            target: "Hallo {username}, Gesamtdateien: {count, number}. Es gibt {count, plural, one {# Datei} other {# Dateien}} zum Herunterladen.",
            key: "asdf",
            project: "project",
            pathName: "a/b/c.xliff",
            datatype: "json",
            flavor: "chocolate",
            comment: "no comment",
            state: "new"
        });
        const expected = {
            one: "Hello {username}, total files: {count, number}. There is {count} file ready for download.",
            other: "Hello {username}, total files: {count, number}. There are {count} files ready for download."
        };
        const plural = convertICUToPluralRes(string);
        expect(plural.getType()).toBe("plural");
        expect(plural.getSource()).toStrictEqual(expected);
        expect(string.getKey()).toBe("asdf");
        expect(string.getProject()).toBe("project");
        expect(string.getPath()).toBe("a/b/c.xliff");
        expect(string.getDataType()).toBe("json");
        expect(string.getFlavor()).toBe("chocolate");
        expect(string.getComment()).toBe("no comment");
        expect(string.getState()).toBe("new");
    });

    test("convert an ICU plural source string with two plurals and text outside of each into a plural resource", function() {
        expect.assertions(2);

        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "Hello {username}, total files: {count, number}. There {filesCount, plural, one {is {filesCount} file} other {are {filesCount} files}} ready for download. You have {notificationCount, plural, one {{notificationCount} notification} other {{notificationCount} notifications}}."
        });
        // use a multi-key plural resource
        const expected = {
            "one,one": "Hello {username}, total files: {count, number}. There is {filesCount} file ready for download. You have {notificationCount} notification.",
            "one,other": "Hello {username}, total files: {count, number}. There is {filesCount} file ready for download. You have {notificationCount} notifications.",
            "other,one": "Hello {username}, total files: {count, number}. There are {filesCount} files ready for download. You have {notificationCount} notification.",
            "other,other": "Hello {username}, total files: {count, number}. There are {filesCount} files ready for download. You have {notificationCount} notifications."
        };
        const plural = convertICUToPluralRes(string);
        expect(plural.getSource()).toStrictEqual(expected);
        expect(plural.getPivots()).toStrictEqual(["filesCount", "notificationCount"]);
    });

    test("convert an ICU plural source string with two plurals and text outside of each with hash replacement parameters into a plural resource", function() {
        expect.assertions(2);
        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "Hello {username}, total files: {count, number}. There {filesCount, plural, one {is # file} other {are # files}} ready for download. You have {notificationCount, plural, one {# notification} other {# notifications}}."
        });
        // use a multi-key plural resource, and make sure to convert the # into {variable} so that we can distinguish between the two plural variables
        const expected = {
            "one,one": "Hello {username}, total files: {count, number}. There is {filesCount} file ready for download. You have {notificationCount} notification.",
            "one,other": "Hello {username}, total files: {count, number}. There is {filesCount} file ready for download. You have {notificationCount} notifications.",
            "other,one": "Hello {username}, total files: {count, number}. There are {filesCount} files ready for download. You have {notificationCount} notification.",
            "other,other": "Hello {username}, total files: {count, number}. There are {filesCount} files ready for download. You have {notificationCount} notifications."
        };
        const plural = convertICUToPluralRes(string);
        expect(plural.getSource()).toStrictEqual(expected);
        expect(plural.getPivots()).toStrictEqual(["filesCount", "notificationCount"]);
    });

    test("convert an ICU plural source string with one plurals nested inside of the other into a plural resource", function() {
        expect.assertions(2);

        const string = new ResourceString({
            sourceLocale: "en-US",
            source: "Hello {username}, there {fileCount, plural, one {is # file and {dirCount, plural, one {# directory} other {# directories}}} other {are # files and {dirCount, plural, one {# directory} other {# directories}}}} ready for download."
        });

        // convert to two serial plurals, and then use a multi-key plural resource
        const expected = {
            "one,one": "Hello {username}, there is {fileCount} file and {dirCount} directory ready for download.",
            "one,other": "Hello {username}, there is {fileCount} file and {dirCount} directories ready for download.",
            "other,one": "Hello {username}, there are {fileCount} files and {dirCount} directory ready for download.",
            "other,other": "Hello {username}, there are {fileCount} files and {dirCount} directories ready for download."
        };
        const plural = convertICUToPluralRes(string);
        expect(plural.getSource()).toStrictEqual(expected);
        expect(plural.getPivots()).toStrictEqual(["fileCount", "dirCount"]);
    });

    test("Convert a multi-key source-only plural resource to an ICU plural string", function() {
        expect.assertions(2);
        const plural = new ResourcePlural({
            sourceLocale: "en-US",
            source: {
                "one,one": "There is {fileCount} file and {dirCount} directory.",
                "one,other": "There is {fileCount} file and {dirCount} directories.",
                "other,one": "There are {fileCount} files and {dirCount} directory.",
                "other,other": "There are {fileCount} files and {dirCount} directories."
            },
            pivots: ["fileCount", "dirCount"]
        });
        const string = convertPluralResToICU(plural);
        const expected = "{fileCount, plural, one {{dirCount, plural, one {There is {fileCount} file and {dirCount} directory.} other {There is {fileCount} file and {dirCount} directories.}}} other {{dirCount, plural, one {There are {fileCount} files and {dirCount} directory.} other {There are {fileCount} files and {dirCount} directories.}}}}";
        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
    });

    test("Convert a multi-key source-only plural resource to an ICU plural string with missing pivots", function() {
        expect.assertions(2);
        const plural = new ResourcePlural({
            sourceLocale: "en-US",
            source: {
                "one,one": "There is {fileCount} file and {dirCount} directory.",
                "one,other": "There is {fileCount} file and {dirCount} directories.",
                "other,one": "There are {fileCount} files and {dirCount} directory.",
                "other,other": "There are {fileCount} files and {dirCount} directories."
            }
        });
        const string = convertPluralResToICU(plural);
        const expected = "{count, plural, one {{count, plural, one {There is {fileCount} file and {dirCount} directory.} other {There is {fileCount} file and {dirCount} directories.}}} other {{count, plural, one {There are {fileCount} files and {dirCount} directory.} other {There are {fileCount} files and {dirCount} directories.}}}}";
        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);
    });

    test("Convert a multi-key full plural resource to an ICU plural string", function() {
        expect.assertions(3);

        const plural = new ResourcePlural({
            sourceLocale: "en-US",
            source: {
                "one,one": "There is {fileCount} file and {dirCount} directory.",
                "one,other": "There is {fileCount} file and {dirCount} directories.",
                "other,one": "There are {fileCount} files and {dirCount} directory.",
                "other,other": "There are {fileCount} files and {dirCount} directories."
            },
            targetLocale: "de-DE",
            target: {
                "one,one": "Es gibt {fileCount} Datei und {dirCount} Verzeichnis.",
                "one,other": "Es gibt {fileCount} Datei und {dirCount} Verzeichnisse.",
                "other,one": "Es gibt {fileCount} Dateien und {dirCount} Verzeichnis.",
                "other,other": "Es gibt {fileCount} Dateien und {dirCount} Verzeichnisse."
            },
            pivots: ["fileCount", "dirCount"]
        });
        const string = convertPluralResToICU(plural);
        let expected = "{fileCount, plural, one {{dirCount, plural, one {There is {fileCount} file and {dirCount} directory.} other {There is {fileCount} file and {dirCount} directories.}}} other {{dirCount, plural, one {There are {fileCount} files and {dirCount} directory.} other {There are {fileCount} files and {dirCount} directories.}}}}";
        expect(string.getType()).toBe("string");
        expect(string.getSource()).toBe(expected);

        expected = "{fileCount, plural, one {{dirCount, plural, one {Es gibt {fileCount} Datei und {dirCount} Verzeichnis.} other {Es gibt {fileCount} Datei und {dirCount} Verzeichnisse.}}} other {{dirCount, plural, one {Es gibt {fileCount} Dateien und {dirCount} Verzeichnis.} other {Es gibt {fileCount} Dateien und {dirCount} Verzeichnisse.}}}}";
        expect(string.getTarget()).toBe(expected);
    });
});

