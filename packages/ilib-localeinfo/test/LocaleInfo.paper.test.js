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
 * LocaleInfo.paper.test.js - LocaleInfo Jest tests
 */
import LocaleInfo from '../src/index.js';
import { setLocale, getPlatform } from 'ilib-env';
import { LocaleData } from 'ilib-localedata';
import { localeList } from './locales.js';

describe("LocaleInfo.paper", () => {

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

    test("should get the paper size for the default locale", () => {
        expect.assertions(2);
        var info = new LocaleInfo();
        expect(info !== null).toBeTruthy()

        // If locale is not specified, default locale would be return as "en-US".
        expect(info.getPaperSize()).toBe("8x11")
    });

    test("should get the paper size for en-US", () => {
        expect.assertions(2);
        var info = new LocaleInfo("en-US");
        expect(info !== null).toBeTruthy()

        expect(info.getPaperSize()).toBe("8x11")
    });

    test("should get the paper size for ko-KR", () => {
        expect.assertions(2);
        var info = new LocaleInfo("ko-KR");
        expect(info !== null).toBeTruthy()

        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get the paper size for es-MX", () => {
        expect.assertions(2);
        var info = new LocaleInfo("es-MX");
        expect(info !== null).toBeTruthy()

        expect(info.getPaperSize()).toBe("8x11")
    });

    test("should get the paper size for es-SV", () => {
        expect.assertions(2);
        var info = new LocaleInfo("es-SV");
        expect(info !== null).toBeTruthy()

        expect(info.getPaperSize()).toBe("8x11")
    });

    test("should get the paper size for es-PR", () => {
        expect.assertions(2);
        var info = new LocaleInfo("es-PR");
        expect(info !== null).toBeTruthy()

        expect(info.getPaperSize()).toBe("8x11")
    });

    test("should get the paper size for es-VE", () => {
        expect.assertions(2);
        var info = new LocaleInfo("es-VE");
        expect(info !== null).toBeTruthy()

        expect(info.getPaperSize()).toBe("8x11")
    });

    test("should get the paper size for fr-FR", () => {
        expect.assertions(2);
        var info = new LocaleInfo("fr-FR");
        expect(info !== null).toBeTruthy()

        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get the paper size for de-DE", () => {
        expect.assertions(2);
        var info = new LocaleInfo("de-DE");
        expect(info !== null).toBeTruthy()

        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get the paper size for it-IT", () => {
        expect.assertions(2);
        var info = new LocaleInfo("it-IT");
        expect(info !== null).toBeTruthy()

        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get the paper size for zh-CN", () => {
        expect.assertions(2);
        var info = new LocaleInfo("zh-CN");
        expect(info !== null).toBeTruthy()

        expect(info.getPaperSize()).toBe("A4")
    });
});
