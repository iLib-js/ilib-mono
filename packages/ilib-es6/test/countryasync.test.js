/*
 * countryasync.test.js - test the country routines
 *
 * Copyright © 2018, 2024 LGE
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

import Country from "../src/Country.js";

describe("testcountryasync", () => {
    test("CountryAsyncConstructorEmpty", () => {
        expect.assertions(1);
        new Country({
            sync: false,
            onLoad: ctry => {
                expect(ctry !== null).toBeTruthy();
            }
        });
    });

    test("CountryAsyncLocale1", () => {
        expect.assertions(4);
        new Country({
            locale: "ko-KR",
            sync: false,
            onLoad: ctry => {
                expect(ctry !== null).toBeTruthy();

                expect(ctry.getName("CD")).toBe("콩고-킨샤사");
                expect(ctry.getCode("콩고-킨샤사")).toBe("CD");
                const locale = ctry.getLocale();
                expect(locale.toString()).toBe("ko-KR");
            }
        });
    });

    test("CountryAsyncLocale2", () => {
        expect.assertions(4);
        new Country({
            locale: "en-US",
            sync: false,
            onLoad: ctry => {
                expect(ctry !== null).toBeTruthy();

                expect(ctry.getName("CD")).toBe("Congo - Kinshasa");
                expect(ctry.getCode("Congo - Kinshasa")).toBe("CD");
                const locale = ctry.getLocale();
                expect(locale.toString()).toBe("en-US");
            }
        });
    });

    test("CountryAsyncGetByCodeUnknown", () => {
        new Country({
            locale: "en-US",
            sync: false,
            onLoad: ctry => {
                try {
                    ctry.getName('xxx');
                    test.fail();
                } catch (e) {
                    expect(e).toBe("Country xxx is unknown");
                }
            }
        });
    });

    test("CountryAsyncJP", () => {
        expect.assertions(4);
        new Country({
            locale: "ja-JP",
            sync: false,
            onLoad: ctry => {
                expect(ctry !== null).toBeTruthy();

                expect(ctry.getName("JP")).toBe("日本");
                expect(ctry.getCode("日本")).toBe("JP");
                const locale = ctry.getLocale();
                expect(locale.toString()).toBe("ja-JP");
            }
        });
    });
});
