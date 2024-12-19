/*
 * localeinfoasync.test.js - test the locale info object
 *
 * Copyright © 2018-2019, 2024 JEDLSoft
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

import LocaleInfo from "../src/LocaleInfo.js";

describe("testlocaleinfopromise", () => {
    test("LocaleInfoAsyncConstructor", () => {
        expect.assertions(5);
        return LocaleInfo.create(undefined, {
            sync: false
        }).then(info => {
            expect(info !== null).toBeTruthy();

            const loc = info.getLocale();
            expect(loc !== null).toBeTruthy();

            expect(loc.getLanguage()).toBe("en");
            expect(loc.getRegion()).toBe("US");
            expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
        });
    });

    test("LocaleInfoAsyncConstructorGivenLocale", () => {
        expect.assertions(4);
        return LocaleInfo.create("de-DE", {
            sync: false
        }).then(info => {
            expect(info !== null).toBeTruthy();

            const loc = info.getLocale();

            expect(loc.getLanguage()).toBe("de");
            expect(loc.getRegion()).toBe("DE");
            expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
        });
    });

    test("LocaleInfoAsyncGetTimeZoneDefault", () => {
        expect.assertions(2);
        return LocaleInfo.create("zz-ZZ", {
            sync: false
        }).then(info => {
            expect(info !== null).toBeTruthy();

            expect(info.getTimeZone()).toBe("Etc/UTC");
        });
    });

    test("LocaleInfoAsyncGetCurrencyUnknown", () => {
        expect.assertions(2);
        return LocaleInfo.create("zxx-XX", {
            sync: false
        }).then(info => {
            expect(info !== null).toBeTruthy();

            expect(info.getCurrency()).toBe("USD");
        });
    });

    test("LocaleInfoAsyncGetDecimalSeparatorfor_ko_KR", () => {
        expect.assertions(5);
        return LocaleInfo.create("ko-KR", {
            sync: false
        }).then(info => {
            expect(info !== null).toBeTruthy();
            expect(info.getDecimalSeparator()).toBe(".");
            expect(info.getGroupingSeparator()).toBe(",");
            expect(info.getPercentageFormat()).toBe("{n}%");
            expect(info.getCurrencyFormats().common).toBe("{s}{n}");
        });
    });

    test("LocaleInfoAsyncGetDecimalSeparatorfor_fr_FR", () => {
        expect.assertions(5);
        return LocaleInfo.create("fr-FR", {
            sync: false
        }).then(info => {
            expect(info !== null).toBeTruthy();
            expect(info.getDecimalSeparator()).toBe(",");
            expect(info.getGroupingSeparator()).toBe(" ");
            expect(info.getPercentageFormat()).toBe("{n} %");
            expect(info.getCurrencyFormats().common).toBe("{n} {s}");
        });
    });

    test("LocaleInfoAsyncGetDecimalSeparatorfor_zh_Hant_US", () => {
        expect.assertions(5);
        // test mixing locale parts for a non-standard locale
        return LocaleInfo.create("zh-Hant-US", {
            sync: false
        }).then(info => {
            expect(info !== null).toBeTruthy();
            expect(info.getDecimalSeparator()).toBe(".");
            expect(info.getGroupingSeparator()).toBe(",");
            expect(info.getRoundingMode()).toBe("halfdown");
            expect(info.getCurrency()).toBe("USD");
        });
    });
});
