/*
 * imsiasync.test.js - Test the parseImsi() function.
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

import PhoneNumber from "../src/PhoneNumber.js";

describe("imsiasync", () => {
    test("RegularImsi3DigitMNC", () => {
        expect.assertions(1);
        const imsi = "31003014084567890"
        const expected = {
            mcc: "310",
            mnc: "030",
            msin: "14084567890"
        };

        PhoneNumber.parseImsi(imsi, {
            sync: false,
            onLoad: actual => {
                expect(actual).toStrictEqual(expected);
            }
        })
    });

    test("SpecialImsi1", () => {
        expect.assertions(1);
        const imsi = "31000201234567"
        const expected = {
            mcc: "310",
            mnc: "00",
            msin: "201234567"
        };

        PhoneNumber.parseImsi(imsi, {
            sync: false,
            onLoad: actual => {
                expect(actual).toStrictEqual(expected);
            }
        });
    });

    test("BrokenMCC", () => {
        expect.assertions(1);
        const imsi = "32000414084567890"
        const expected = {
            mcc: "320",
            mnc: "004",
            msin: "14084567890"
        };

        // should default to a 3 digit mnc
        PhoneNumber.parseImsi(imsi, {
            sync: false,
            onLoad: actual => {
                expect(actual).toStrictEqual(expected);
            }
        });
    });

    test("BrokenMNC", () => {
        expect.assertions(1);
        const imsi = "31014114084567890"
        const expected = {
            mcc: "310",
            mnc: "141",
            msin: "14084567890"
        };

        // should default to a 3 digit mnc
        PhoneNumber.parseImsi(imsi, {
            sync: false,
            onLoad: actual => {
                expect(actual).toStrictEqual(expected);
            }
        });
    });

    test("TooShort", () => {
        expect.assertions(1);
        const imsi = "31";
        PhoneNumber.parseImsi(imsi, {
            sync: false,
            onLoad: actual => {
                expect(actual).toBeFalsy();
            }
        });
    });

    test("Undefined", () => {
        expect.assertions(1);
        PhoneNumber.parseImsi(undefined, {
            sync: false,
            onLoad: actual => {
                expect(actual).toBeFalsy();
            }
        });
    });
});
