/*
 * nameasync.test.js - test the name object
 *
 * Copyright © 2018, 2022, 2024 JEDLSoft
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

import Name from "../src/Name.js";

describe("testnameasync", () => {
    test("NameAsyncEmptyConstructor", () => {
        expect.assertions(1);
        new Name(undefined, {
            sync: false,
            onLoad: name => {
                expect(typeof(name) === "undefined").toBeTruthy();
            }
        });
    });

    test("NameAsyncCopyConstructor", () => {
        expect.assertions(2);
        new Name({
            prefix: "a",
            givenName: "b",
            middleName: "c",
            familyName: "d",
            suffix: "e",
            honorific: "x"
        }, {
            sync: false,
            onLoad: name => {
                expect(typeof(name) !== "undefined").toBeTruthy();

                expect(name).toEqual(expect.objectContaining({
                    prefix: "a",
                    givenName: "b",
                    middleName: "c",
                    familyName: "d",
                    suffix: "e",
                    honorific: "x"
                }));
            }
        });
    });

    test("NameAsyncDEWithMultiplePrefixes", () => {
        expect.assertions(2);
        new Name("Herr Dr. Josef Hans Jürgen Herzheim", {
            locale: "de-DE",
            sync: false,
            onLoad: name => {
                expect(typeof(name) !== "undefined").toBeTruthy();

                expect(name).toEqual(expect.objectContaining({
                    prefix: "Herr Dr.",
                    givenName: "Josef",
                    middleName: "Hans Jürgen",
                    familyName: "Herzheim"
                }));
            }
        });
    });

    test("NameAsyncESFull", () => {
        expect.assertions(2);
        new Name("Juan Carlos Maria León Arroyo", {
            locale: "es-ES",
            sync: false,
            onLoad: name => {
                expect(typeof(name) !== "undefined").toBeTruthy();

                expect(name).toEqual(expect.objectContaining({
                    givenName: "Juan",
                    middleName: "Carlos Maria",
                    familyName: "León Arroyo"
                }));
            }
        });
    });

    test("NameAsyncZHHonorific", () => {
        expect.assertions(2);
        new Name("堂哥胡锦涛", {
            locale: "zh-CN",
            sync: false,
            onLoad: name => {
                expect(typeof(name) !== "undefined").toBeTruthy();

                expect(name).toEqual(expect.objectContaining({
                    prefix: "堂哥",
                    givenName: "锦涛",
                    familyName: "胡"
                }));
            }
        });
    });
});
