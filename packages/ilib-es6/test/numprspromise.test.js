/*
 * numprsasync.test.js - test the number parsing routines
 *
 * Copyright © 2012-2018, 2022, 2024 JEDLSoft
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

import INumber from "../src/INumber.js";

describe("testnumprspromise", () => {
    test("NumberAsyncConstructorDefault", () => {
        expect.assertions(2);
        return INumber.create("3.4", {
            sync: false
        }).then(num => {
            expect(num !== null).toBeTruthy();
            expect(num.valueOf()).toBe(3.4);
        });
    });

    test("NumberAsyncConstructorWithIlibNumber", () => {
        expect.assertions(2);
        return INumber.create("3.4", {
            sync: false
        }).then(num => {
            return INumber.create(num, {
                sync: false
            }).then(num2 => {
                expect(num2 !== null).toBeTruthy();
                expect(num2.valueOf()).toBe(3.4);
            });
        });
    });

    test("NumberAsyncGetLocaleOther", () => {
        expect.assertions(3);
        return INumber.create("3,4", {
            locale: "de-DE",
            sync: false
        }).then(num => {
            expect(num !== null).toBeTruthy();

            expect(num.getLocale().getSpec()).toBe("de-DE");
            expect(num.valueOf()).toBe(3.4);
        });
    });

    test("NumberAsyncPercentage", () => {
        expect.assertions(2);
        return INumber.create("58.3%", {
            type: "percentage",
            sync: false
        }).then(num => {
            expect(num !== null).toBeTruthy();

            expect(num.valueOf()).toBe(0.583);
        });
    });

    test("NumberAsyncCurrencyValue", () => {
        expect.assertions(2);
        return INumber.create("$5.80", {
            type: "currency",
            sync: false
        }).then(num => {
            expect(num !== null).toBeTruthy();

            expect(num.valueOf()).toBe(5.80);
        });
    });

    test("NumberAsyncCurrencyForLocale", () => {
        expect.assertions(3);
        return INumber.create("£5.80", {
            type: "currency",
            sync: false
        }).then(num => {
            expect(num !== null).toBeTruthy();

            const cur = num.getCurrency();
            expect(typeof(cur) !== "undefined").toBeTruthy();
            expect(cur.getCode()).toBe("GBP");
        });
    });

    test("NumberAsyncParseNonLatinDigits", () => {
        expect.assertions(2);

        // tests that the CType isDigit data is loaded
        return INumber.create("১২৩.৪৫৬", {
            locale: "bn-IN",
            sync: false
        }).then(num => {
            expect(num !== null).toBeTruthy();
            expect(num.valueOf()).toBe(123.456);
        });
    });

    test("NumberAsyncParseWithSpaces", () => {
        expect.assertions(2);

        // tests that CType isSpace data is loaded
        return INumber.create("1 234 567,745", {
            locale: "fr-FR",
            sync: false
        }).then(num => {
            expect(num !== null).toBeTruthy();
            expect(num.valueOf()).toBe(1234567.745);
        });
    });
});
