/*
 * Copyright © 2022-2026 JEDLSoft
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
  *
 * LocaleInfoAsync.test.js - async LocaleInfo Jest tests
 */

import LocaleInfo from '../src/index.js';
import { setupLocaleInfoTests } from './setup.js';

describe("LocaleInfoAsync", () => {

    setupLocaleInfoTests();

    test("should construct a LocaleInfo instance asynchronously", () => {
        expect.assertions(5);
        return LocaleInfo.create(undefined).then((info) => {
            expect(info).not.toBeNull()

            const loc = info.getLocale();
            expect(loc).not.toBeNull()

            expect(loc.getLanguage()).toBe("en")
            expect(loc.getRegion()).toBe("US")
            expect(loc.getVariant()).toBeUndefined()

        });
    });

    test("should construct a LocaleInfo for a given locale asynchronously", () => {
        expect.assertions(4);
        return LocaleInfo.create("de-DE").then((info) => {
            expect(info).not.toBeNull()

            const loc = info.getLocale();

            expect(loc.getLanguage()).toBe("de")
            expect(loc.getRegion()).toBe("DE")
            expect(loc.getVariant()).toBeUndefined()

        });
    });

    test("should get the time zone for the default locale asynchronously", () => {
        expect.assertions(2);
        return LocaleInfo.create("zz-ZZ").then((info) => {
            expect(info).not.toBeNull()

            expect(info.getTimeZone()).toBe("Etc/UTC")

        });
    });

    test("should get the currency for an unknown locale asynchronously", () => {
        expect.assertions(2);
        return LocaleInfo.create("zxx-XX").then((info) => {
            expect(info).not.toBeNull()

            expect(info.getCurrency()).toBe("USD")

        });
    });

    test("should get the decimal separator for ko-KR asynchronously", () => {
        expect.assertions(5);
        return LocaleInfo.create("ko-KR").then((info) => {
            expect(info).not.toBeNull()
            expect(info.getDecimalSeparator()).toBe(".")
            expect(info.getGroupingSeparator()).toBe(",")
            expect(info.getPercentageFormat()).toBe("{n}%")
            expect(info.getCurrencyFormats().common).toBe("{s}{n}")

        });
    });

    test("should get the decimal separator for fr-FR asynchronously", () => {
        expect.assertions(5);
        return LocaleInfo.create("fr-FR").then((info) => {
            expect(info).not.toBeNull()
            expect(info.getDecimalSeparator()).toBe(",")
            expect(info.getGroupingSeparator()).toBe(' ')
            expect(info.getPercentageFormat()).toBe("{n} %")
            expect(info.getCurrencyFormats().common).toBe("{n} {s}")

        });
    });

    test("should get the decimal separator for zh-Hant-US asynchronously", () => {
        expect.assertions(5);
        // test mixing locale parts for a non-standard locale
        return LocaleInfo.create("zh-Hant-US").then((info) => {
            expect(info).not.toBeNull()
            expect(info.getDecimalSeparator()).toBe(".")
            expect(info.getGroupingSeparator()).toBe(",")
            expect(info.getRoundingMode()).toBe("halfdown")
            expect(info.getCurrency()).toBe("USD")

        });
    });
});
