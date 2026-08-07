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
 * LocaleInfo.meridiems.test.js - LocaleInfo Jest tests
 */
import LocaleInfo from '../src/index.js';
import { setLocale, getPlatform } from 'ilib-env';
import { LocaleData } from 'ilib-localedata';
import { localeList } from './locales.js';

describe("LocaleInfo.meridiems", () => {

    beforeAll(async () => {
        setLocale("en-US");
        if (getPlatform() === "browser") {
            // Browser does not support sync locale loads; preload locales used by tests.
            for (const locale of localeList.locales) {
                await LocaleData.ensureLocale(locale);
            }
        }
    });

    beforeEach(() => {
        setLocale("en-US");
    });

    test("should get the meridiems style for the default locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo();
        expect(info !== null).toBeTruthy()

        expect(info.getMeridiemsStyle()).toBe("gregorian")
    });

    test("should get the meridiems style for the US locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo("en-US");
        expect(info !== null).toBeTruthy()

        expect(info.getMeridiemsStyle()).toBe("gregorian")
    });

    test("should get the meridiems style for am-ET", () => {
        expect.assertions(2);
        var info = new LocaleInfo("am-ET");
        expect(info !== null).toBeTruthy()

        expect(info.getMeridiemsStyle()).toBe("ethiopic")
    });

    test("should get the meridiems style for zh-Hans-CN", () => {
        expect.assertions(2);
        var info = new LocaleInfo("zh-Hans-CN");
        expect(info !== null).toBeTruthy()

        // Even for the Chinese locales, the default is
        // Gregorian style. To format with Chinese style,
        // you have to explicitly request it when constructing
        // the date formatter instance.
        expect(info.getMeridiemsStyle()).toBe("gregorian")
    });
});
