/*
 * numfmtasync.test.js - test the number formatter object
 *
 * Copyright © 2018, 2022, 2024 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSe-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import NumFmt from "../src/NumFmt.js";

describe("testnumfmtpromise", () => {
    test("NumFmtAsyncDefaults", () => {
        expect.assertions(7);
        return NumFmt.create({
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            expect(fmt.getType()).toBe("number");
            expect(fmt.getMaxFractionDigits()).toBe(-1);
            expect(fmt.getMinFractionDigits()).toBe(-1);
            expect(fmt.isGroupingUsed()).toBeTruthy();
            expect(fmt.getRoundingMode()).toBe("halfdown");
            expect(typeof(fmt.getCurrency()) === "undefined").toBeTruthy();
        });

    });

    test("NumFmtAsyncNumberFormatSimple", () => {
        expect.assertions(2);
        return NumFmt.create({
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            expect(fmt.format(1.745)).toBe("1.745");
        });
    });

    test("NumFmtAsyncNumberStyleStringArgument", () => {
        expect.assertions(2);
        return NumFmt.create({
            style: "standard",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            // should work with string arguments
            expect(fmt.format("2345678901234567.0")).toBe("2,345,678,901,234,567");
        });
    });

    test("NumFmtAsyncFormatNativeDefaultTrue", () => {
        expect.assertions(2);
        return NumFmt.create({
            locale: "bn-IN",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            expect(fmt.format(123.456)).toBe("১২৩.৪৫৬");
        });
    });

    test("NumFmtAsyncCurrencyFormatUS", () => {
        expect.assertions(2);
        return NumFmt.create({
            type: "currency",
            currency: "USD",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            expect(fmt.format(57.3467)).toBe("$57.35");
        });
    });

    test("NumFmtAsyncCurrencyGetFractionDigitsOtherCurrency", () => {
        expect.assertions(3);
        return NumFmt.create({
            type: "currency",
            currency: "JPY",  // Japanese yen
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            expect(fmt.getMaxFractionDigits()).toBe(0);
            expect(fmt.getMinFractionDigits()).toBe(0);
        });
    });

    test("NumFmtAsyncPercentageFormatRegular_kn_IN", () => {
        expect.assertions(2);
        return NumFmt.create({
            locale: "kn-IN",
            useNative: true,
            type: "percentage",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            expect(fmt.format(57.8)).toBe("೫೭.೮%");
        });
    });
});
