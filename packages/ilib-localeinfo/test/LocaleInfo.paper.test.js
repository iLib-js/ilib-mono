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
import { setupLocaleInfoTests } from './setup.js';

describe("LocaleInfo.paper", () => {

    setupLocaleInfoTests();

    test("should get the paper size for the default locale", () => {
        expect.assertions(2);
        const info = new LocaleInfo();
        expect(info).not.toBeNull()

        // If locale is not specified, default locale would be return as "en-US".
        expect(info.getPaperSize()).toBe("8x11")
    });

    test("should get the paper size for en-US", () => {
        expect.assertions(2);
        const info = new LocaleInfo("en-US");
        expect(info).not.toBeNull()

        expect(info.getPaperSize()).toBe("8x11")
    });

    test("should get the paper size for ko-KR", () => {
        expect.assertions(2);
        const info = new LocaleInfo("ko-KR");
        expect(info).not.toBeNull()

        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get the paper size for es-MX", () => {
        expect.assertions(2);
        const info = new LocaleInfo("es-MX");
        expect(info).not.toBeNull()

        expect(info.getPaperSize()).toBe("8x11")
    });

    test("should get the paper size for es-SV", () => {
        expect.assertions(2);
        const info = new LocaleInfo("es-SV");
        expect(info).not.toBeNull()

        expect(info.getPaperSize()).toBe("8x11")
    });

    test("should get the paper size for es-PR", () => {
        expect.assertions(2);
        const info = new LocaleInfo("es-PR");
        expect(info).not.toBeNull()

        expect(info.getPaperSize()).toBe("8x11")
    });

    test("should get the paper size for es-VE", () => {
        expect.assertions(2);
        const info = new LocaleInfo("es-VE");
        expect(info).not.toBeNull()

        expect(info.getPaperSize()).toBe("8x11")
    });

    test("should get the paper size for fr-FR", () => {
        expect.assertions(2);
        const info = new LocaleInfo("fr-FR");
        expect(info).not.toBeNull()

        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get the paper size for de-DE", () => {
        expect.assertions(2);
        const info = new LocaleInfo("de-DE");
        expect(info).not.toBeNull()

        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get the paper size for it-IT", () => {
        expect.assertions(2);
        const info = new LocaleInfo("it-IT");
        expect(info).not.toBeNull()

        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get the paper size for zh-CN", () => {
        expect.assertions(2);
        const info = new LocaleInfo("zh-CN");
        expect(info).not.toBeNull()

        expect(info.getPaperSize()).toBe("A4")
    });
});
