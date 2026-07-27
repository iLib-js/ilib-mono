/*
 * Name_ja.test.js - test the name object in Japanese
 *
 * Copyright © 2013-2015,2017,2022 JEDLSoft
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

import NameFmt from '../src/NameFmt.js';
import Name from '../src/Name.js';
import { LocaleData } from 'ilib-localedata';
import { getPlatform } from 'ilib-env';

describe("Name_ja", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            await LocaleData.ensureLocale("ja-JP");
        }
    });

    test("should parse a simple European-style Japanese name", () => {
        expect.assertions(2);
        const parsed = new Name("Takuya Kimura", {locale: 'ja-JP'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "Takuya",
            familyName: "Kimura"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a simple Asian-style Japanese name", () => {
        expect.assertions(2);
        const parsed = new Name("高橋弘樹", {locale: 'ja-JP'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName: "弘樹",
            familyName: "高橋"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a single Japanese name with prefix and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("高橋弘樹さん", {locale: 'ja-JP'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix : "さん",
            givenName: "弘樹",
            familyName: "高橋"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Japanese name with a title", () => {
        expect.assertions(2);
        const parsed = new Name("高橋弘樹知事", {locale: 'ja-JP'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "知事",
            givenName: "弘樹",
            familyName: "高橋"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Japanese title with family name only and adjunct", () => {
        expect.assertions(2);
        const parsed = new Name("高橋弘樹教授", {locale: 'ja-JP'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "教授",
            givenName: "弘樹",
            familyName: "高橋"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Japanese compound honorific", () => {
        expect.assertions(2);
        const parsed = new Name("高橋教授", {locale: 'ja-JP'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix: "教授",
            familyName: "高橋"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Japanese compound honorific (1)", () => {
        expect.assertions(2);
        const parsed = new Name("高橋総裁", {locale: 'ja-JP'});
        expect(parsed).toBeTruthy();

        const expected = {
            suffix : "総裁",
            familyName: "高橋"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a Japanese family name", () => {
        expect.assertions(2);
        const parsed = new Name("佐々木主浩", {locale: 'ja-JP'});
        expect(parsed).toBeTruthy();

        const expected = {
            givenName : "主浩",
            familyName: "佐々木"
        };

        expect(parsed).toMatchObject(expected);
    });

    test("should parse a long mixed Japanese name", () => {
        expect.assertions(2);
        const parsed = new Name("佐々木主浩/Software Engineer", {locale: "ja-JP"});
        expect(parsed).toBeTruthy();
        const expected = {
            givenName : "主浩",
            familyName: "佐々木",
            suffix: "/Software Engineer"
        };
        expect(parsed).toMatchObject(expected);
    });

    test("should format a simple Japanese name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "弘樹",
            familyName: "高橋"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ja-JP'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "高橋弘樹";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Japanese name in medium style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "弘樹",
            familyName: "高橋"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ja-JP'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "高橋弘樹";

        expect(formatted).toBe(expected);
    });

    test("should format a simple Japanese name in full style", () => {
        expect.assertions(2);
        let name = new Name({
            givenName: "弘樹",
            familyName: "高橋",
            suffix: "副大統領ご"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ja-JP'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "高橋弘樹副大統領ご";

        expect(formatted).toBe(expected);
    });

    test("should format a complex Japanese name in short style", () => {
        expect.assertions(2);
        let name = new Name({
            suffix: "きゅう",
            givenName: "弘樹",
            familyName: "高橋"
        });
        let fmt = new NameFmt({
            style: "short",
            locale: 'ja-JP'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "高橋弘樹";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in medium style for Japanese", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "medium",
            locale: 'ja-JP'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "地獸";

        expect(formatted).toBe(expected);
    });

    test("should format an Asian name in long style for Japanese", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "小",
            givenName: "獸",
            familyName: "地",
            suffix: "太太"
        });
        let fmt = new NameFmt({
            style: "full",
            locale: 'ja-JP'
        });
        let formatted = fmt.format(name);
        expect(formatted).toBeTruthy();

        const expected = "小地獸太太";

        expect(formatted).toBe(expected);
    });

});
