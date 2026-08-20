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
 * LocaleInfo.delimiters.test.js - LocaleInfo Jest tests
 */
import LocaleInfo from '../src/index.js';
import { setupLocaleInfoTests } from './setup.js';

describe("LocaleInfo.delimiters", () => {

    setupLocaleInfoTests();

    test("should get quotation delimiters for en-US", () => {
        expect.assertions(1);
        const info = new LocaleInfo("en-US");
        expect(info).not.toBeNull()
    });

    test("should get quotation delimiters for ko-KR", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ko-KR");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("“")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
    });

    test("should get quotation delimiters for es-ES", () => {
        expect.assertions(3);
        const info = new LocaleInfo("es-ES");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("“")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
    });

    test("should get quotation delimiters for zh-CN", () => {
        expect.assertions(3);
        const info = new LocaleInfo("zh-CN");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("“")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
    });

    test("should get quotation delimiters for fa-IR", () => {
        expect.assertions(3);
        const info = new LocaleInfo("fa-IR");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("«")
        expect(info.getDelimiterQuotationEnd()).toBe("»")
    });

    test("should get quotation delimiters for de-DE", () => {
        expect.assertions(3);
        const info = new LocaleInfo("de-DE");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("„")
        expect(info.getDelimiterQuotationEnd()).toBe("“")
    });

    test("should get quotation delimiters for pt-BR", () => {
        expect.assertions(3);
        const info = new LocaleInfo("pt-BR");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("“")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
    });

    test("should get quotation delimiters for hy-AM", () => {
        expect.assertions(3);
        const info = new LocaleInfo("hy-AM");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("«")
        expect(info.getDelimiterQuotationEnd()).toBe("»")
    });

    test("should get quotation delimiters for ur-IN", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ur-IN");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("”")
        expect(info.getDelimiterQuotationEnd()).toBe("“")
    });

    test("should get quotation delimiters for fr-CA", () => {
        expect.assertions(3);
        const info = new LocaleInfo("fr-CA");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("«")
        expect(info.getDelimiterQuotationEnd()).toBe("»")
    });

    test("should get quotation delimiters for he-IL", () => {
        expect.assertions(3);
        const info = new LocaleInfo("he-IL");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("”")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
    });

    test("should get quotation delimiters for uz-Latn-UZ", () => {
        expect.assertions(3);
        const info = new LocaleInfo("uz-Latn-UZ");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("“")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
    });

    test("should get quotation delimiters for ro-RO", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ro-RO");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("„")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
    });

    test("should get quotation delimiters for bs-BA", () => {
        expect.assertions(3);
        const info = new LocaleInfo("bs-BA");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("„")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
    });

    test("should get quotation delimiters for el-CY", () => {
        expect.assertions(3);
        const info = new LocaleInfo("el-CY");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("«")
        expect(info.getDelimiterQuotationEnd()).toBe("»")
    });

    test("should get quotation delimiters for kk-KZ", () => {
        expect.assertions(3);
        const info = new LocaleInfo("kk-KZ");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("«")
        expect(info.getDelimiterQuotationEnd()).toBe("»")
    });

    test("should get quotation delimiters for az-Latn-AZ", () => {
        expect.assertions(3);
        const info = new LocaleInfo("az-Latn-AZ");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("“")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
    });

    test("should get quotation delimiters for de-CH", () => {
        expect.assertions(3);
        const info = new LocaleInfo("de-CH");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("„")
        expect(info.getDelimiterQuotationEnd()).toBe("“")
    });

    test("should get quotation delimiters for ka-GE", () => {
        expect.assertions(4);
        const info = new LocaleInfo("ka-GE");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("„")
        expect(info.getDelimiterQuotationEnd()).toBe("“")
        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get quotation delimiters for be-BY", () => {
        expect.assertions(4);
        const info = new LocaleInfo("be-BY");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("«")
        expect(info.getDelimiterQuotationEnd()).toBe("»")
        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get quotation delimiters for lo-LA", () => {
        expect.assertions(4);
        const info = new LocaleInfo("lo-LA");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("“")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get quotation delimiters for ky-KG", () => {
        expect.assertions(4);
        const info = new LocaleInfo("ky-KG");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("«")
        expect(info.getDelimiterQuotationEnd()).toBe("»")
        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get quotation delimiters and paper size for hy-AM", () => {
        expect.assertions(4);
        const info = new LocaleInfo("hy-AM");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("«")
        expect(info.getDelimiterQuotationEnd()).toBe("»")
        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get quotation delimiters for gl-ES", () => {
        expect.assertions(4);
        const info = new LocaleInfo("gl-ES");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("“")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get quotation delimiters for eu-ES", () => {
        expect.assertions(4);
        const info = new LocaleInfo("eu-ES");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("«")
        expect(info.getDelimiterQuotationEnd()).toBe("»")
        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get quotation delimiters for my-MM", () => {
        expect.assertions(4);
        const info = new LocaleInfo("my-MM");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("“")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get quotation delimiters for ne-NP", () => {
        expect.assertions(4);
        const info = new LocaleInfo("ne-NP");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("“")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get quotation delimiters for wo-SN", () => {
        expect.assertions(4);
        const info = new LocaleInfo("wo-SN");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("“")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get quotation delimiters for tk-TM", () => {
        expect.assertions(4);
        const info = new LocaleInfo("tk-TM");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("“")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get quotation delimiters for tg-TJ", () => {
        expect.assertions(4);
        const info = new LocaleInfo("tg-TJ");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("»")
        expect(info.getDelimiterQuotationEnd()).toBe("«")
        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get quotation delimiters for mt-MT", () => {
        expect.assertions(4);
        const info = new LocaleInfo("mt-MT");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("“")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get quotation delimiters for zu-ZA", () => {
        expect.assertions(4);
        const info = new LocaleInfo("zu-ZA");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("“")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get quotation delimiters for lb-LU", () => {
        expect.assertions(4);
        const info = new LocaleInfo("lb-LU");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("„")
        expect(info.getDelimiterQuotationEnd()).toBe("“")
        expect(info.getPaperSize()).toBe("A4")
    });

    test("should get quotation delimiters for ig-NG", () => {
        expect.assertions(4);
        const info = new LocaleInfo("ig-NG");
        expect(info).not.toBeNull()

        expect(info.getDelimiterQuotationStart()).toBe("“")
        expect(info.getDelimiterQuotationEnd()).toBe("”")
        expect(info.getPaperSize()).toBe("A4")
    });

    // Formerly misnamed as GetNegativeCurrencyFormat_zh_TW(_Hant) duplicates;
    // bodies actually assert quotation delimiters.
    test("should get quotation delimiters for zh-Hant-TW", () => {
        expect.assertions(3);
        const info = new LocaleInfo("zh-Hant-TW");
        expect(info).not.toBeNull();

        expect(info.getDelimiterQuotationStart()).toBe("「");
        expect(info.getDelimiterQuotationEnd()).toBe("」");
    });

    test("should get quotation delimiters for zh-TW", () => {
        expect.assertions(3);
        const info = new LocaleInfo("zh-TW");
        expect(info).not.toBeNull();

        expect(info.getDelimiterQuotationStart()).toBe("「");
        expect(info.getDelimiterQuotationEnd()).toBe("」");
    });
});
