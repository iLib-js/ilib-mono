/*
 * istring-async.test.js - test the IString class async functionality
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
import { LocaleData } from 'ilib-localedata';

describe("IString Async", () => {
    beforeEach(() => {
        setLocale("en-US");
        LocaleData.clearCache();
    });

    describe("Factory", () => {
        test("should create IString instance with factory", async () => {
            const str = await IString.create();
            expect(str).toBeTruthy();
        });

        test("should create empty IString instance with factory", async () => {
            const str = await IString.create();
            expect(str).toBeTruthy();
            expect(str.length).toBe(0);
            expect(str.toString()).toBe("");
        });

        test("should create IString instance with full string using factory", async () => {
            const str = await IString.create("test test test");
            expect(str).toBeTruthy();
            expect(str.length).toBe(14);
            expect(str.toString()).toBe("test test test");
        });
    });

    describe("Format Async", () => {
        test("should format string with arg using factory", async () => {
            const str = await IString.create("Format {size} string.");
            expect(str).toBeTruthy();
            expect(str.format({size: "medium"})).toBe("Format medium string.");
        });
    });

    describe("Format Choice Async", () => {
        test("should format choice with simple index using factory", async () => {
            const str = await IString.create("1#first string|2#second string");
            expect(str).toBeTruthy();
            expect(str.formatChoice(1)).toBe("first string");
        });

        test("should format choice with multiple indexes with classes RU 0", async () => {
            const str = await IString.create(
                "0,0#{num} items on {pages} pages.|one,one#{num} item on {pages} page.|few,one#{num} items (few) on {pages} page.|many,one#{num} items (many) on {pages} page.|one,few#{num} item (one) on {pages} pages (few).|few,few#{num} items (few) on {pages} pages (few).|many,few#{num} items (many) on {pages} pages (few).|one,many#{num} item (one) on {pages} pages (many).|few,many#{num} items (few) on {pages} pages (many).|many,many#{num} items (many) on {pages} pages (many).",
                {locale: "ru-RU"}
            );
            expect(str).toBeTruthy();

            const params = {
                num: 0,
                pages: 0
            };

            expect(str.formatChoice([params.num,params.pages], params)).toBe("0 items on 0 pages.");
        });

        test("should format choice with multiple indexes with classes RU 1", async () => {
            const str = await IString.create(
                "0,0#{num} items on {pages} pages.|one,one#{num} item on {pages} page.|few,one#{num} items (few) on {pages} page.|many,one#{num} items (many) on {pages} page.|one,few#{num} item (one) on {pages} pages (few).|few,few#{num} items (few) on {pages} pages (few).|many,few#{num} items (many) on {pages} pages (few).|one,many#{num} item (one) on {pages} pages (many).|few,many#{num} items (few) on {pages} pages (many).|many,many#{num} items (many) on {pages} pages (many).",
                {locale: "ru-RU"}
            );
            expect(str).toBeTruthy();

            const params = {
                num: 1,
                pages: 1
            };

            expect(str.formatChoice([params.num,params.pages], params)).toBe("1 item on 1 page.");
        });

        test("should format choice with multiple indexes with classes RU 2", async () => {
            const str = await IString.create(
                "0,0#{num} items on {pages} pages.|one,one#{num} item on {pages} page.|few,one#{num} items (few) on {pages} page.|many,one#{num} items (many) on {pages} page.|one,few#{num} item (one) on {pages} pages (few).|few,few#{num} items (few) on {pages} pages (few).|many,few#{num} items (many) on {pages} pages (few).|one,many#{num} item (one) on {pages} pages (many).|few,many#{num} items (few) on {pages} pages (many).|many,many#{num} items (many) on {pages} pages (many).",
                {locale: "ru-RU"}
            );
            expect(str).toBeTruthy();

            const params = {
                num: 3,
                pages: 1
            };

            expect(str.formatChoice([params.num,params.pages], params)).toBe("3 items (few) on 1 page.");
        });

        test("should format choice with multiple indexes with classes PT 1", async () => {
            const str = await IString.create(
                "0,0#{num} items on {pages} pages.|one,one#{num} item on {pages} page.|one,many#{num} item on {pages} pages (many).|few,one#{num} items (few) on {pages} page.|many,one#{num} items (many) on {pages} page.|one,few#{num} item (one) on {pages} pages (few).|few,few#{num} items (few) on {pages} pages (few).|many,few#{num} items (many) on {pages} pages (few).|one,many#{num} item (one) on {pages} pages (many).|few,many#{num} items (few) on {pages} pages (many).|many,many#{num} items (many) on {pages} pages (many).|other,other#{num} items (other) on {pages} pages (other).",
                {locale: "pt-PT"}
            );
            expect(str).toBeTruthy();

            const params = {
                num: 0,
                pages: 5
            };
            expect(str.formatChoice([params.num,params.pages], params)).toBe("0 items (other) on 5 pages (other).");
        });
    });

    describe("String Delegation Async", () => {
        test("should delegate indexOf using factory", async () => {
            const str = await IString.create("abcdefghijklmnopqrstuvwxyz");
            expect(str).toBeTruthy();
            expect(str.indexOf("lmno")).toBe(11);
        });
    });

    describe("Iterator Async", () => {
        test("should handle complex iterator with surrogates", async () => {
            const str = await IString.create("a\uD800\uDF02b\uD800\uDC00");
            const it = str.iterator();
            expect(it.hasNext()).toBe(true);
            expect(it.next()).toBe(0x0061);
            expect(it.hasNext()).toBe(true);
            expect(it.next()).toBe(0x10302);
            expect(it.hasNext()).toBe(true);
            expect(it.next()).toBe(0x0062);
            expect(it.hasNext()).toBe(true);
            expect(it.next()).toBe(0x10000);
            expect(it.hasNext()).toBe(false);
            expect(it.next()).toBe(-1);
        });

        test("should handle code point length with surrogates", async () => {
            const str = await IString.create("a\uD800\uDF02b\uD800\uDC00");
            expect(str.codePointLength()).toBe(4);
            expect(str.length).toBe(6);
        });

        test("should handle string iterator with of operator", async () => {
            const str = await IString.create("test test test");
            const expected = [
                "t",
                "e",
                "s",
                "t",
                " ",
                "t",
                "e",
                "s",
                "t",
                " ",
                "t",
                "e",
                "s",
                "t"
            ];
            let index = 0;
            for (const ch of str) {
                expect(ch).toBe(expected[index++]);
            }
            expect(index).toBe(14);
        });

        test("should handle string iterator with of operator with surrogates", async () => {
            const str = await IString.create("a\uD800\uDF02b\uD800\uDC00");
            const expected = [
                "a",
                "\uD800\uDF02",
                "b",
                "\uD800\uDC00"
            ];
            let index = 0;
            for (const ch of str) {
                expect(ch).toBe(expected[index++]);
            }
            expect(index).toBe(4);
        });

        test("should handle string iterator with spread operator", async () => {
            const str = await IString.create("test test test");
            const actual = [...str];
            const expected = [
                "t",
                "e",
                "s",
                "t",
                " ",
                "t",
                "e",
                "s",
                "t",
                " ",
                "t",
                "e",
                "s",
                "t"
            ];
            expect(actual).toEqual(expected);
        });

        test("should handle string iterator with spread operator with surrogates", async () => {
            const str = await IString.create("a\uD800\uDF02b\uD800\uDC00");
            const actual = [...str];
            const expected = [
                "a",
                "\uD800\uDF02",
                "b",
                "\uD800\uDC00"
            ];
            expect(actual).toEqual(expected);
        });
    });
}); 