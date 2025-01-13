/*
 * currencyasync.test.js - test the currency routines
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

import Currency from "../src/Currency.js";

describe("testcurrencypromise", () => {
    test("CurrencyAsyncDefaults", () => {
        expect.assertions(7);
        return Currency.create({
            sync: false
        }).then(cur => {
            expect(cur !== null).toBeTruthy();

            expect(cur.getCode()).toBe("USD");
            expect(cur.getFractionDigits()).toBe(2);
            expect(cur.getSign()).toBe("$");
            expect(cur.getName()).toBe("US Dollar");
            const locale = cur.getLocale();
            expect(typeof(locale) !== "undefined").toBeTruthy();
            expect(locale.toString()).toBe("en-US");
        });
    });

    test("CurrencyAsyncGetByCode1", () => {
        expect.assertions(6);
        return Currency.create({
            code: "EUR",
            sync: false
        }).then(cur => {
            expect(cur !== null).toBeTruthy();

            expect(cur.getCode()).toBe("EUR");
            expect(cur.getFractionDigits()).toBe(2);
            expect(cur.getSign()).toBe("€");
            expect(cur.getName()).toBe("Euro");
            const locale = cur.getLocale();
            expect(locale.toString()).toBe("en-US");
        });
    });

    test("CurrencyAsyncGetByCodeUnknown", () => {
        return Currency.create({
            code: "xxx",
            sync: false
        }).then(cur => {
            expect(!cur).toBeTruthy();
        });
    });

    test("CurrencyAsyncGetBySignUnambiguous", () => {
        expect.assertions(6);
        return Currency.create({
            sign: "€",
            sync: false
        }).then(cur => {
            expect(cur !== null).toBeTruthy();

            expect(cur.getCode()).toBe("EUR");
            expect(cur.getFractionDigits()).toBe(2);
            expect(cur.getSign()).toBe("€");
            expect(cur.getName()).toBe("Euro");
            const locale = cur.getLocale();
            expect(locale.toString()).toBe("en-US");
        });
    });

    test("CurrencyAsync", () => {
        expect.assertions(6);
        return Currency.create({
            locale: "en-GB",
            sign: "$",
            sync: false
        }).then(cur => {
            expect(cur !== null).toBeTruthy();

            expect(cur.getCode()).toBe("USD");
            expect(cur.getFractionDigits()).toBe(2);
            expect(cur.getSign()).toBe("$");
            expect(cur.getName()).toBe("US Dollar");
            const locale = cur.getLocale();
            expect(locale.toString()).toBe("en-GB");
        });
    });
});
