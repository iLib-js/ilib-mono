/*
 * NameAsync.test.js - test the name object
 *
 * Copyright © 2018,2026 JEDLSoft
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
import { setLocale } from 'ilib-env';

describe("NameAsync", () => {
    beforeEach(() => {
        setLocale("en-US");
        LocaleData.clearCache();
    });

    test("should asynchronously create a name with an empty constructor", async () => {
        expect.assertions(1);
        const name = await Name.create();
        expect(typeof(name) !== "undefined").toBeTruthy();
    });

    test("should asynchronously create a name with a copy constructor", async () => {
        expect.assertions(2);
        const name = await Name.create({
            prefix: "a",
            givenName: "b",
            middleName: "c",
            familyName: "d",
            suffix: "e",
            honorific: "x"
        }, {});
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ prefix: "a", givenName: "b", middleName: "c", familyName: "d", suffix: "e", honorific: "x"});
    });

    test("should asynchronously parse a German name with multiple prefixes", async () => {
        expect.assertions(2);
        const name = await Name.create("Herr Dr. Josef Hans Jürgen Herzheim", {
            locale: "de-DE"
        });
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ prefix: "Herr Dr.", givenName: "Josef", middleName: "Hans Jürgen", familyName: "Herzheim" });
    });

    test("should asynchronously parse a full Spanish name", async () => {
        expect.assertions(2);
        const name = await Name.create("Juan Carlos Maria León Arroyo", {
            locale: "es-ES"
        });
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ givenName: "Juan", middleName: "Carlos Maria", familyName: "León Arroyo" });
    });

    test("should asynchronously parse a Chinese name with an honorific", async () => {
        expect.assertions(2);
        const name = await Name.create("堂哥胡锦涛", {
            locale: "zh-CN"
        });
        expect(typeof(name) !== "undefined").toBeTruthy();

        expect(name).toMatchObject({ prefix: "堂哥", givenName: "锦涛", familyName: "胡" });
    });
});
