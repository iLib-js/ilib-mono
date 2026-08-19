/*
 * istring.test.js - test the IString class
 *
 * Copyright © 2022, 2025 JEDLSoft
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

import IString from '../src/index.js';
import { setLocale } from 'ilib-env';

describe("IString", () => {
    beforeEach(() => {
        setLocale("en-US");
    });

    describe("Constructor", () => {
        test("should create IString instance with default constructor", () => {
            const str = new IString();
            expect(str).toBeTruthy();
        });

        test("should create empty IString instance", () => {
            const str = new IString();
            expect(str).toBeTruthy();
            expect(str.length).toBe(0);
            expect(str.toString()).toBe("");
        });

        test("should create IString instance with full string", () => {
            const str = new IString("test test test");
            expect(str).toBeTruthy();
            expect(str.length).toBe(14);
            expect(str.toString()).toBe("test test test");
        });

        test("should create IString instance with String object", () => {
            const str = new IString(new String("test test test"));
            expect(str).toBeTruthy();
            expect(str.length).toBe(14);
            expect(str.toString()).toBe("test test test");
        });

        test("should create IString instance with IString object", () => {
            const str = new IString(new IString("test test test"));
            expect(str).toBeTruthy();
            expect(str.length).toBe(14);
            expect(str.toString()).toBe("test test test");
        });
    });

    describe("Format", () => {
        test("should format string with no args", () => {
            const str = new IString("Format this string.");
            expect(str).toBeTruthy();
            expect(str.format()).toBe("Format this string.");
        });

        test("should format empty string", () => {
            const str = new IString();
            expect(str).toBeTruthy();
            expect(str.format()).toBe("");
        });

        test("should format empty string with args", () => {
            const str = new IString();
            expect(str).toBeTruthy();
            expect(str.format({test: "Foo"})).toBe("");
        });

        test("should format string with single arg", () => {
            const str = new IString("Format {size} string.");
            expect(str).toBeTruthy();
            expect(str.format({size: "medium"})).toBe("Format medium string.");
        });

        test("should format string with multiple args", () => {
            const str = new IString("Format {size} {object}.");
            expect(str).toBeTruthy();
            expect(str.format({ size: "medium", object: "string" })).toBe("Format medium string.");
        });

        test("should format string with same arg multiple times", () => {
            const str = new IString("Format {size} when {size} is at least {size} big.");
            expect(str).toBeTruthy();
            expect(str.format({ size: "medium" })).toBe("Format medium when medium is at least medium big.");
        });

        test("should format string with missing args", () => {
            const str = new IString("Format {size} {object}.");
            expect(str).toBeTruthy();
            expect(str.format({ object: "string" })).toBe("Format {size} string.");
        });

        test("should format string with empty arg", () => {
            const str = new IString("Format {size} string.");
            expect(str).toBeTruthy();
            expect(str.format({size: ""})).toBe("Format  string.");
        });

        test("should format string with non-ASCII param", () => {
            const str = new IString("Format {size} string.");
            expect(str).toBeTruthy();
            expect(str.format({size: "médïûm"})).toBe("Format médïûm string.");
        });

        test("should format string with non-ASCII replacement", () => {
            const str = new IString("Format {sïzé} string.");
            expect(str).toBeTruthy();
            expect(str.format({"sïzé": "medium"})).toBe("Format medium string.");
        });

        test("should format string with multiple replacements", () => {
            const str = new IString("User {user} has {num} objects in their {container}.");
            expect(str).toBeTruthy();
            expect(str.format({ user: "edwin", num: 2, container: "locker" })).toBe("User edwin has 2 objects in their locker.");
        });
    });

    describe("Format Choice", () => {
        test("should format choice with simple index 1", () => {
            const str = new IString("1#first string|2#second string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(1)).toBe("first string");
        });

        test("should format choice with simple index 2", () => {
            const str = new IString("1#first string|2#second string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(2)).toBe("second string");
        });

        test("should format choice with only one choice positive", () => {
            const str = new IString("1#first string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(1)).toBe("first string");
        });

        test("should format choice with only one choice negative", () => {
            const str = new IString("1#first string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(2)).toBe("");
        });

        test("should format choice with no string", () => {
            const str = new IString("");
            expect(str).toBeTruthy();
            expect(str.formatChoice(2)).toBe("");
        });

        test("should format choice with simple no match", () => {
            const str = new IString("1#first string|2#second string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(3)).toBe("");
        });

        test("should format choice with simple default", () => {
            const str = new IString("1#first string|2#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(3)).toBe("other string");
        });

        test("should format choice with less than or equal positive", () => {
            const str = new IString("<=2#first string|3#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(1)).toBe("first string");
        });

        test("should format choice with less than or equal equal", () => {
            const str = new IString("<=2#first string|3#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(2)).toBe("first string");
        });

        test("should format choice with less than or equal not less than", () => {
            const str = new IString("<=2#first string|3#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(3)).toBe("second string");
        });

        test("should format choice with greater than or equal positive", () => {
            const str = new IString(">=2#first string|1#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(4)).toBe("first string");
        });

        test("should format choice with greater than or equal equal", () => {
            const str = new IString(">=2#first string|1#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(2)).toBe("first string");
        });

        test("should format choice with greater than or equal not less than", () => {
            const str = new IString(">=2#first string|1#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(1)).toBe("second string");
        });

        test("should format choice with less than positive", () => {
            const str = new IString("<2#first string|3#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(1)).toBe("first string");
        });

        test("should format choice with less than equal", () => {
            const str = new IString("<2#first string|3#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(2)).toBe("other string");
        });

        test("should format choice with less than not less than", () => {
            const str = new IString("<2#first string|3#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(3)).toBe("second string");
        });

        test("should format choice with greater than positive", () => {
            const str = new IString(">2#first string|1#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(4)).toBe("first string");
        });

        test("should format choice with greater than equal", () => {
            const str = new IString(">2#first string|1#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(2)).toBe("other string");
        });

        test("should format choice with greater than not less than", () => {
            const str = new IString(">2#first string|1#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(1)).toBe("second string");
        });

        test("should format choice with range 1", () => {
            const str = new IString("1-3#first string|4-6#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(2)).toBe("first string");
        });

        test("should format choice with range 4", () => {
            const str = new IString("1-3#first string|4-6#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(4)).toBe("second string");
        });

        test("should format choice with range 7", () => {
            const str = new IString("1-3#first string|4-6#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(7)).toBe("other string");
        });

        test("should format choice with boolean true", () => {
            const str = new IString("true#first string|false#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(true)).toBe("first string");
        });

        test("should format choice with boolean false", () => {
            const str = new IString("true#first string|false#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(false)).toBe("second string");
        });

        test("should format choice with boolean missing", () => {
            const str = new IString("true#first string|false#second string|#other string");
            expect(str).toBeTruthy();
            expect(() => str.formatChoice(null)).toThrow("syntax error: formatChoice parameter for the argument index cannot be an object");
        });

        test("should format choice with string static A", () => {
            const str = new IString("A#first string|B#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice("A")).toBe("first string");
        });

        test("should format choice with string static B", () => {
            const str = new IString("A#first string|B#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice("B")).toBe("second string");
        });

        test("should format choice with string static C", () => {
            const str = new IString("A#first string|B#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice("C")).toBe("other string");
        });

        test("should format choice with string ignore case", () => {
            const str = new IString("A#first string|B#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice("a")).toBe("first string");
        });

        test("should format choice with regex A", () => {
            const str = new IString("/A/#first string|/B/#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice("A")).toBe("first string");
        });

        test("should format choice with regex B", () => {
            const str = new IString("/A/#first string|/B/#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice("B")).toBe("second string");
        });

        test("should format choice with regex C", () => {
            const str = new IString("/A/#first string|/B/#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice("C")).toBe("other string");
        });

        test("should format choice with regex default", () => {
            const str = new IString("/A/#first string|/B/#second string|#other string");
            expect(str).toBeTruthy();
            expect(str.formatChoice("D")).toBe("other string");
        });

        test("should format choice with regex missing", () => {
            const str = new IString("/A/#first string|/B/#second string|#other string");
            expect(str).toBeTruthy();
            expect(() => str.formatChoice(null)).toThrow("syntax error: formatChoice parameter for the argument index cannot be an object");
        });

        test("should format choice with replacement 0", () => {
            const str = new IString("0#{num} items|1#{num} item|#other");
            expect(str).toBeTruthy();
            expect(str.formatChoice(0, {num: 0})).toBe("0 items");
        });

        test("should format choice with replacement 1", () => {
            const str = new IString("0#{num} items|1#{num} item|#other");
            expect(str).toBeTruthy();
            expect(str.formatChoice(1, {num: 1})).toBe("1 item");
        });

        test("should format choice with replacement 2", () => {
            const str = new IString("0#{num} items|1#{num} item|#other");
            expect(str).toBeTruthy();
            expect(str.formatChoice(2, {num: 2})).toBe("other");
        });

        test("should format choice with multiple replacement 0", () => {
            const str = new IString("0#{num} items on {pages} pages|1#{num} item on {pages} page|#other");
            expect(str).toBeTruthy();
            expect(str.formatChoice(0, {num: 0, pages: 0})).toBe("0 items on 0 pages");
        });

        test("should format choice with multiple replacement 1", () => {
            const str = new IString("0#{num} items on {pages} pages|1#{num} item on {pages} page|#other");
            expect(str).toBeTruthy();
            expect(str.formatChoice(1, {num: 1, pages: 1})).toBe("1 item on 1 page");
        });

        test("should format choice with multiple replacement 2", () => {
            const str = new IString("0#{num} items on {pages} pages|1#{num} item on {pages} page|#other");
            expect(str).toBeTruthy();
            expect(str.formatChoice(2, {num: 2, pages: 2})).toBe("other");
        });

        test("should format choice with multiple indexes 0", () => {
            const str = new IString("0,0#{num} items on {pages} pages|1,1#{num} item on {pages} page|#other");
            expect(str).toBeTruthy();
            expect(str.formatChoice([0, 0], {num: 0, pages: 0})).toBe("0 items on 0 pages");
        });

        test("should format choice with multiple indexes 1", () => {
            const str = new IString("0,0#{num} items on {pages} pages|1,1#{num} item on {pages} page|#other");
            expect(str).toBeTruthy();
            expect(str.formatChoice([1, 1], {num: 1, pages: 1})).toBe("1 item on 1 page");
        });

        test("should format choice with multiple indexes 2", () => {
            const str = new IString("0,0#{num} items on {pages} pages|1,1#{num} item on {pages} page|#other");
            expect(str).toBeTruthy();
            expect(str.formatChoice([2, 2], {num: 2, pages: 2})).toBe("other");
        });

        test("should format choice with multiple indexes 3", () => {
            const str = new IString("0,0#{num} items on {pages} pages|1,1#{num} item on {pages} page|#other");
            expect(str).toBeTruthy();
            expect(str.formatChoice([0, 1], {num: 0, pages: 1})).toBe("other");
        });

        test("should format choice with multiple indexes with empty limits instead of other", () => {
            const str = new IString("0,0#{num} items on {pages} pages|1,1#{num} item on {pages} page");
            expect(str).toBeTruthy();
            expect(str.formatChoice([2, 2], {num: 2, pages: 2})).toBe("");
        });
    });

    describe("String Delegation", () => {
        test("should delegate charAt", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.charAt(0) == "a").toBeTruthy();
        });

        test("should delegate charCodeAt", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.charCodeAt(0)).toBe(97);
        });

        test("should delegate concat", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.concat("123") == "abcdefghijklmnopqrstuvwxyz123").toBeTruthy();
        });

        test("should delegate indexOf", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.indexOf("lmno")).toBe(11);
        });

        test("should delegate indexOf with start position", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.indexOf("lmno", 12)).toBe(-1);
        });

        test("should delegate match", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            const result = str.match(/[a-z]+/);
            expect(result[0]).toBe("abcdefghijklmnopqrstuvwxyz");
        });

        test("should delegate replace", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.replace("abc", "123") == "123defghijklmnopqrstuvwxyz").toBeTruthy();
        });

        test("should delegate search", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.search(/[a-z]+/)).toBe(0);
        });

        test("should delegate split", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            const result = str.split("");
            expect(result.length).toBe(26);
            expect(result[0] == "a").toBeTruthy();
        });

        test("should delegate substr", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.substr(0, 3) == "abc").toBeTruthy();
        });

        test("should delegate substring", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.substring(0, 3) == "abc").toBeTruthy();
        });

        test("should delegate toLowerCase", () => {
            const str = new IString("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
            expect(str).toBeTruthy();
            expect(str.toLowerCase() == "abcdefghijklmnopqrstuvwxyz").toBeTruthy();
        });

        test("should delegate toUpperCase", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.toUpperCase() == "ABCDEFGHIJKLMNOPQRSTUVWXYZ").toBeTruthy();
        });

        test("should delegate length", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.length).toBe(26);
        });

        test("should delegate matchAll", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            const result = Array.from(str.matchAll(/[a-z]/g));
            expect(result.length).toBe(26);
            expect(result[0][0]).toBe("a");
        });

        test("should delegate toLocaleLowerCase", () => {
            const str = new IString("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
            expect(str).toBeTruthy();
            expect(str.toLocaleLowerCase() == "abcdefghijklmnopqrstuvwxyz").toBeTruthy();
        });

        test("should delegate toLocaleUpperCase", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.toLocaleUpperCase() == "ABCDEFGHIJKLMNOPQRSTUVWXYZ").toBeTruthy();
        });

        test("should delegate endsWith true", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.endsWith("xyz")).toBe(true);
        });

        test("should delegate endsWith true with length 1", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.endsWith("a", 1)).toBe(true);
        });

        test("should delegate endsWith true with length 2", () => {
            const str = new IString("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.endsWith("ab", 2)).toBe(true);
        });
    });
}); 