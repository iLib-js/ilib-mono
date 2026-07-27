/*
 * Name.test.js - test the name object
 *
 * Copyright © 2013-2015,2017,2022,2026 JEDLSoft
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

import Name from '../src/Name.js';
import { LocaleData } from 'ilib-localedata';
import { getPlatform } from 'ilib-env';

describe("Name", () => {
    beforeAll(async () => {
        if (getPlatform() === "browser") {
            // does not support sync, so we have to ensure the locale
            // data is loaded before we can do all these sync tests
            for (const locale of ["en-US", "de-DE", "es-ES", "zh-CN"]) {
                await LocaleData.ensureLocale(locale);
            }
        }
    });

    test("should create a name with an empty constructor", () => {
        expect.assertions(1);
        let name = new Name();

        expect(typeof(name) !== "undefined").toBeTruthy();
    });

    test("should create a name with a copy constructor", () => {
        expect.assertions(2);
        let name = new Name({
            prefix: "a",
            givenName: "b",
            middleName: "c",
            familyName: "d",
            suffix: "e",
            honorific: "x"
        });
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ prefix: "a", givenName: "b", middleName: "c", familyName: "d", suffix: "e", honorific: "x"});
    });

    test("should parse a simple English name", () => {
        expect.assertions(2);
        let name = new Name("John Doe");
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "John", familyName: "Doe" });
    });

    test("should parse a slightly complex English name", () => {
        expect.assertions(2);
        let name = new Name("John Jacob Doe");
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "John", middleName: "Jacob", familyName: "Doe" });
    });

    test("should parse a more complex English name", () => {
        expect.assertions(2);
        let name = new Name("John Jacob Winchester Doe");
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "John", middleName: "Jacob Winchester", familyName: "Doe" });
    });

    test("should parse an English name with a suffix", () => {
        expect.assertions(2);
        let name = new Name("John Jacob Winchester Doe Jr.");
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "John", middleName: "Jacob Winchester", familyName: "Doe", suffix: "Jr." });
    });

    test("should parse an English name with a prefix", () => {
        expect.assertions(2);
        let name = new Name("Mr. John Jacob Winchester Doe");
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ prefix: "Mr.", givenName: "John", middleName: "Jacob Winchester", familyName: "Doe" });
    });

    test("should parse a full English name", () => {
        expect.assertions(2);
        let name = new Name("Dr. John Jacob Winchester Doe, Phd.");
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ prefix: "Dr.", givenName: "John", middleName: "Jacob Winchester", familyName: "Doe", suffix: ", Phd." });
    });

    test("should parse an English name with only a prefix and family name", () => {
        expect.assertions(2);
        let name = new Name("Dr. Winchester");
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ prefix: "Dr.", familyName: "Winchester" });
    });

    test("should parse a single-word English name", () => {
        expect.assertions(2);
        let name = new Name("Sting");
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "Sting" });
    });

    test("should return the sort family name for an English name", () => {
        expect.assertions(2);
        let name = new Name("Jason Smith");
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name.getSortFamilyName()).toBe("Smith");
    });

    test("should return the sort family name for an English name with auxiliaries", () => {
        expect.assertions(2);
        let name = new Name("Jason van der Muiden");
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name.getSortFamilyName()).toBe("van der Muiden");
    });

    test("should parse a simple German name", () => {
        expect.assertions(2);
        let name = new Name("Josef Herzheim", {locale: "de-DE"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "Josef", familyName: "Herzheim" });
    });

    test("should parse a slightly complex German name", () => {
        expect.assertions(2);
        let name = new Name("Josef Jürgen Herzheim", {locale: "de-DE"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "Josef", middleName: "Jürgen", familyName: "Herzheim" });
    });

    test("should parse a more complex German name", () => {
        expect.assertions(2);
        let name = new Name("Josef Hans Jürgen Herzheim", {locale: "de-DE"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "Josef", middleName: "Hans Jürgen", familyName: "Herzheim" });
    });

    test("should parse a German name with a suffix", () => {
        expect.assertions(2);
        let name = new Name("Josef Hans Jürgen Herzheim III", {locale: "de-DE"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "Josef", middleName: "Hans Jürgen", familyName: "Herzheim", suffix: "III" });
    });

    test("should parse a German name with a prefix", () => {
        expect.assertions(2);
        let name = new Name("Herr Josef Hans Jürgen Herzheim", {locale: "de-DE"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ prefix: "Herr", givenName: "Josef", middleName: "Hans Jürgen", familyName: "Herzheim" });
    });

    test("should parse a German name with multiple prefixes", () => {
        expect.assertions(2);
        let name = new Name("Herr Dr. Josef Hans Jürgen Herzheim", {locale: "de-DE"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ prefix: "Herr Dr.", givenName: "Josef", middleName: "Hans Jürgen", familyName: "Herzheim" });
    });

    test("should parse a German name with auxiliaries", () => {
        expect.assertions(2);
        let name = new Name("Ludwig von Beethoven", {locale: "de-DE"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "Ludwig", familyName: "von Beethoven" });
    });

    test("should return the sort family name for a German name", () => {
        expect.assertions(2);
        let name = new Name("Ludwig von Beethoven", {locale: "de-DE"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name.getSortFamilyName()).toBe("Beethoven, von");
    });

    test("should parse a simple Spanish name", () => {
        expect.assertions(2);
        let name = new Name("Juan Arroyo", {locale: "es-ES"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "Juan", familyName: "Arroyo" });
    });

    test("should parse a more complex Spanish name", () => {
        expect.assertions(2);
        let name = new Name("Juan Carlos Arroyo", {locale: "es-ES"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "Juan", familyName: "Carlos Arroyo" });
    });

    test("should parse a full Spanish name", () => {
        expect.assertions(2);
        let name = new Name("Juan Carlos Maria León Arroyo", {locale: "es-ES"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "Juan", middleName: "Carlos Maria", familyName: "León Arroyo" });
    });

    test("should parse a Spanish name with auxiliaries", () => {
        expect.assertions(2);
        let name = new Name("Juan de los Reyes", {locale: "es-ES"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "Juan", familyName: "de los Reyes" });
    });

    test("should parse a full Spanish name with auxiliaries", () => {
        expect.assertions(2);
        let name = new Name("Juan Carlos de los Reyes de León", {locale: "es-ES"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "Juan", middleName: "Carlos", familyName: "de los Reyes de León" });
    });

    test("should parse a simple Chinese name", () => {
        expect.assertions(2);
        let name = new Name("王志成", {locale: "zh-CN"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "志成", familyName: "王" });
    });

    test("should parse a Chinese name with a compound family name", () => {
        expect.assertions(2);
        let name = new Name("南宫志成", {locale: "zh-CN"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "志成", familyName: "南宫" });
    });

    test("should parse a Chinese name with a prefix", () => {
        expect.assertions(2);
        let name = new Name("老王志成", {locale: "zh-CN"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ prefix: "老", givenName: "志成", familyName: "王" });
    });

    test("should parse a Chinese married name with a compound family name", () => {
        expect.assertions(2);
        let name = new Name("王杨凭平", {locale: "zh-CN", compoundFamilyName: true});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "凭平", familyName: "王杨" });
    });

    test("should parse a Chinese name with an honorific", () => {
        expect.assertions(2);
        let name = new Name("堂哥胡锦涛", {locale: "zh-CN"});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ prefix: "堂哥", givenName: "锦涛", familyName: "胡" });
    });
});
