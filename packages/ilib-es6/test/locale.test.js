/*
 * locale.test.js - test the locale object
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

import ilib from "../src/ilib.js";
import Locale from "../src/Locale.js";

describe("testlocale", () => {
    beforeAll(() => {
        ilib.clearCache();
    });

    test("LocaleConstructor", () => {
        expect.assertions(1);
        const loc = new Locale();

        expect(loc !== null).toBeTruthy();
    });

    test("LocaleConstructorCurrent", () => {
        expect.assertions(4);
        if (ilib._getPlatform() === "browser") {
            // make sure it picks it up from the right place
            navigator.language = "en-US";
        }

        const loc = new Locale(); // gives locale of the host JS engine

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorDefault", () => {
        expect.assertions(4);
        ilib.setLocale("it-IT");

        const loc = new Locale();

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("it");
        expect(loc.getRegion()).toBe("IT");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();

        delete ilib.locale;
    });

    test("LocaleCopyConstructor", () => {
        expect.assertions(4);
        const loc2 = new Locale("de", "DE");
        const loc = new Locale(loc2);

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("de");
        expect(loc.getRegion()).toBe("DE");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorFull", () => {
        expect.assertions(4);
        const loc = new Locale("en", "US", "Midwest");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(loc.getVariant()).toBe("Midwest");
    });

    test("LocaleConstructorSpecWithVariant", () => {
        expect.assertions(5);
        const loc = new Locale("en-US-Midwest");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(loc.getVariant()).toBe("Midwest");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorSpecWithScript", () => {
        expect.assertions(5);
        const loc = new Locale("en-US-Latn");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(loc.getScript()).toBe("Latn");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorPartial", () => {
        expect.assertions(4);
        const loc = new Locale("en", "US");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorSpecPartial", () => {
        expect.assertions(4);
        const loc = new Locale("en-US");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorShort", () => {
        expect.assertions(4);
        const loc = new Locale("en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(typeof(loc.getRegion()) === "undefined").toBeTruthy();
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorUpperCaseLanguage", () => {
        expect.assertions(4);
        const loc = new Locale("EN", "US");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorLowerCaseRegion", () => {
        expect.assertions(4);
        const loc = new Locale("en", "us");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorSpecMissingRegion", () => {
        expect.assertions(5);
        const loc = new Locale("en--Midwest");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(typeof(loc.getRegion()) === "undefined").toBeTruthy();
        expect(loc.getVariant()).toBe("Midwest");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorSpecMissingLanguage", () => {
        expect.assertions(5);
        const loc = new Locale("-US-Midwest");

        expect(loc !== null).toBeTruthy();

        expect(typeof(loc.getLanguage()) === "undefined").toBeTruthy();
        expect(loc.getRegion()).toBe("US");
        expect(loc.getVariant()).toBe("Midwest");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorSpecMissingLanguageAndVariant", () => {
        expect.assertions(5);
        const loc = new Locale("-US");

        expect(loc !== null).toBeTruthy();

        expect(typeof(loc.getLanguage()) === "undefined").toBeTruthy();
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
    });

    test("LocaleEqualsTrue", () => {
        expect.assertions(3);
        const loc1 = new Locale("en-US"),
            loc2 = new Locale("en", "US");

        expect(loc1 !== null).toBeTruthy();
        expect(loc2 !== null).toBeTruthy();

        expect(loc1.equals(loc2)).toBeTruthy();
    });

    test("LocaleEqualsFalse", () => {
        expect.assertions(3);
        const loc1 = new Locale("en-US"),
            loc2 = new Locale("en", "CA");

        expect(loc1 !== null).toBeTruthy();
        expect(loc2 !== null).toBeTruthy();

        expect(!loc1.equals(loc2)).toBeTruthy();
    });

    test("LocaleEqualsMissing", () => {
        expect.assertions(3);
        const loc1 = new Locale("en-US"),
            loc2 = new Locale("en", "US", "govt");

        expect(loc1 !== null).toBeTruthy();
        expect(loc2 !== null).toBeTruthy();

        expect(!loc1.equals(loc2)).toBeTruthy();
    });

    test("LocaleEqualsTrueFull", () => {
        expect.assertions(3);
        const loc1 = new Locale("en-US-govt"),
            loc2 = new Locale("en", "US", "govt");

        expect(loc1 !== null).toBeTruthy();
        expect(loc2 !== null).toBeTruthy();

        expect(loc1.equals(loc2)).toBeTruthy();
    });

    test("LocaleEqualsTrueShort", () => {
        expect.assertions(3);
        const loc1 = new Locale("en"),
            loc2 = new Locale("en");

        expect(loc1 !== null).toBeTruthy();
        expect(loc2 !== null).toBeTruthy();

        expect(loc1.equals(loc2)).toBeTruthy();
    });

    test("LocaleIsPseudoTrue", () => {
        expect.assertions(2);
        const loc = new Locale("zxx-XX");

        expect(loc !== null).toBeTruthy();

        expect(loc.isPseudo(loc)).toBeTruthy();
    });

    test("LocaleIsPseudoFalse", () => {
        expect.assertions(2);
        const loc = new Locale("en-US");

        expect(loc !== null).toBeTruthy();

        expect(!loc.isPseudo(loc)).toBeTruthy();
    });

    test("LocaleIsPseudoFalseButClosLang", () => {
        expect.assertions(2);
        const loc = new Locale("zxx-US");

        expect(loc !== null).toBeTruthy();

        expect(!loc.isPseudo(loc)).toBeTruthy();
    });

    test("LocaleIsPseudoFalse", () => {
        expect.assertions(2);
        const loc = new Locale("en-XX");

        expect(loc !== null).toBeTruthy();

        expect(!loc.isPseudo(loc)).toBeTruthy();
    });


    test("LocaleGetSpecLangOnly", () => {
        expect.assertions(2);
        const loc = new Locale("en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en");
    });

    test("LocaleGetSpecRegionOnly", () => {
        expect.assertions(2);
        const loc = new Locale("CA");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("CA");
    });

    test("LocaleGetSpecScriptOnly", () => {
        expect.assertions(2);
        const loc = new Locale("Latn");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("Latn");
    });

    test("LocaleGetSpecVariantOnly", () => {
        expect.assertions(2);
        const loc = new Locale("asdfasdf");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("asdfasdf");
    });

    test("LocaleGetSpecLangAndScript", () => {
        expect.assertions(2);
        const loc = new Locale("Latn-en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-Latn");
    });

    test("LocaleGetSpecLangAndRegion", () => {
        expect.assertions(2);
        const loc = new Locale("CA-en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-CA");
    });

    test("LocaleGetSpecLangAndVariant", () => {
        expect.assertions(2);
        const loc = new Locale("asdf-en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-asdf");
    });

    test("LocaleGetSpecScriptAndRegion", () => {
        expect.assertions(2);
        const loc = new Locale("CA-Latn");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("Latn-CA");
    });

    test("LocaleGetSpecScriptAndVariant", () => {
        expect.assertions(2);
        const loc = new Locale("asdf-Latn");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("Latn-asdf");
    });

    test("LocaleGetSpecRegionAndVariant", () => {
        expect.assertions(2);
        const loc = new Locale("asdf-CA");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("CA-asdf");
    });

    test("LocaleGetSpecLangScriptRegion", () => {
        expect.assertions(2);
        const loc = new Locale("CA-en-Latn");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-Latn-CA");
    });

    test("LocaleGetSpecScriptRegionVariant", () => {
        expect.assertions(2);
        const loc = new Locale("CA-asdf-Latn");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("Latn-CA-asdf");
    });

    test("LocaleGetSpecLangScriptVariant", () => {
        expect.assertions(2);
        const loc = new Locale("asdf-Latn-en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-Latn-asdf");
    });

    test("LocaleGetSpecLangRegionVariant", () => {
        expect.assertions(2);
        const loc = new Locale("asdf-CA-en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-CA-asdf");
    });

    test("LocaleGetSpecAll", () => {
        expect.assertions(2);
        const loc = new Locale("asdf-CA-Latn-en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-Latn-CA-asdf");
    });

    test("LocaleM49RegionCodeGetParts", () => {
        expect.assertions(4);
        const loc = new Locale("en-001");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("001");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleM49RegionCodeGetParts2", () => {
        expect.assertions(4);
        const loc = new Locale("en-150");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("150");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleM49RegionCodeGetSpec", () => {
        expect.assertions(2);
        const loc = new Locale("en-001");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-001");
    });

    test("LocaleNoLocale", () => {
        expect.assertions(6);
        const loc = new Locale("-");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("");
        expect(typeof(loc.getLanguage()) === "undefined").toBeTruthy();
        expect(typeof(loc.getRegion()) === "undefined").toBeTruthy();
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });


    test("LocaleRegionMap1", () => {
        expect.assertions(1);
        expect(Locale.regionAlpha2ToAlpha3("SG")).toBe("SGP");
    });

    test("LocaleRegionMap2", () => {
        expect.assertions(1);
        expect(Locale.regionAlpha2ToAlpha3("VN")).toBe("VNM");
    });

    test("LocaleRegionMap3", () => {
        expect.assertions(1);
        expect(Locale.regionAlpha2ToAlpha3("KR")).toBe("KOR");
    });

    test("LocaleRegionMapEmpty", () => {
        expect.assertions(1);
        expect(Locale.regionAlpha2ToAlpha3("")).toBe("");
    });

    test("LocaleRegionMapUnknown", () => {
        expect.assertions(1);
        expect(Locale.regionAlpha2ToAlpha3("QQ")).toBe("QQ");
    });

    test("LocaleRegionMapWrongCase", () => {
        expect.assertions(1);
        expect(Locale.regionAlpha2ToAlpha3("sg")).toBe("sg");
    });

    test("LocaleRegionMapUndefined", () => {
        expect.assertions(1);
        expect(typeof(Locale.regionAlpha2ToAlpha3(undefined)) === "undefined").toBeTruthy();
    });

    test("LocaleLanguageMap1", () => {
        expect.assertions(1);
        expect(Locale.languageAlpha1ToAlpha3("ko")).toBe("kor");
    });

    test("LocaleLanguageMap2", () => {
        expect.assertions(1);
        expect(Locale.languageAlpha1ToAlpha3("th")).toBe("tha");
    });

    test("LocaleLanguageMap3", () => {
        expect.assertions(1);
        expect(Locale.languageAlpha1ToAlpha3("hr")).toBe("hrv");
    });

    test("LocaleLanguageMapEmpty", () => {
        expect.assertions(1);
        expect(Locale.languageAlpha1ToAlpha3("")).toBe("");
    });

    test("LocaleLanguageMapUnknown", () => {
        expect.assertions(1);
        expect(Locale.languageAlpha1ToAlpha3("qq")).toBe("qq");
    });

    test("LocaleLanguageMapWrongCase", () => {
        expect.assertions(1);
        expect(Locale.languageAlpha1ToAlpha3("EN")).toBe("EN");
    });

    test("LocaleLanguageMapUndefined", () => {
        expect.assertions(1);
        expect(typeof(Locale.languageAlpha1ToAlpha3(undefined)) === "undefined").toBeTruthy();
    });

    test("LocaleGetLanguageAlpha3_1", () => {
        expect.assertions(2);
        const loc = new Locale("en-US");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguageAlpha3()).toBe("eng");
    });

    test("LocaleGetLanguageAlpha3_2", () => {
        expect.assertions(2);
        const loc = new Locale("ru-RU");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguageAlpha3()).toBe("rus");
    });

    test("LocaleGetLanguageAlpha3_3", () => {
        expect.assertions(2);
        const loc = new Locale("gv-GB");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguageAlpha3()).toBe("glv");
    });

    test("LocaleGetLanguageAlpha3NoLanguage", () => {
        expect.assertions(2);
        const loc = new Locale("GB");

        expect(loc !== null).toBeTruthy();

        expect(typeof(loc.getLanguageAlpha3()) === "undefined").toBeTruthy();
    });

    test("LocaleGetRegionAlpha3_1", () => {
        expect.assertions(2);
        const loc = new Locale("en-US");

        expect(loc !== null).toBeTruthy();

        expect(loc.getRegionAlpha3()).toBe("USA");
    });

    test("LocaleGetRegionAlpha3_2", () => {
        expect.assertions(2);
        const loc = new Locale("ru-RU");

        expect(loc !== null).toBeTruthy();

        expect(loc.getRegionAlpha3()).toBe("RUS");
    });

    test("LocaleGetRegionAlpha3_3", () => {
        expect.assertions(2);
        const loc = new Locale("gv-GB");

        expect(loc !== null).toBeTruthy();

        expect(loc.getRegionAlpha3()).toBe("GBR");
    });

    test("LocaleGetRegionAlpha3NoRegion", () => {
        expect.assertions(2);
        const loc = new Locale("en");

        expect(loc !== null).toBeTruthy();

        expect(typeof(loc.getRegionAlpha3()) === "undefined").toBeTruthy();
    });

    test("LocaleGetAvailableLocalesDefault", () => {
        expect.assertions(2);
        const locales = Locale.getAvailableLocales();
        expect(typeof(locales) !== "undefined").toBeTruthy();
        expect(locales.length > 0).toBeTruthy();
    });

    test("LocaleGetAvailableLocalesCallback", () => {
        expect.assertions(2);
        Locale.getAvailableLocales(true, locales => {
            expect(typeof(locales) !== "undefined").toBeTruthy();
            expect(locales.length > 0).toBeTruthy();
        });
    });

    test("LocaleGetLanguageSpecSimple", () => {
        expect.assertions(2);

        const loc = new Locale("en");
        expect(loc !== null).toBeTruthy();

        expect(loc.getLangSpec()).toBe("en");
    });

    test("LocaleGetLanguageSpecLeaveOutRegionAndVariant", () => {
        expect.assertions(2);

        const loc = new Locale("en-US-MILITARY");
        expect(loc !== null).toBeTruthy();

        expect(loc.getLangSpec()).toBe("en");
    });

    test("LocaleGetLanguageSpecIncludeScript", () => {
        expect.assertions(2);

        const loc = new Locale("zh-Hans");
        expect(loc !== null).toBeTruthy();

        expect(loc.getLangSpec()).toBe("zh-Hans");
    });

    test("LocaleGetLanguageSpecIncludeScriptButNotOthers", () => {
        expect.assertions(2);

        const loc = new Locale("zh-Hans-CN-GOVT");
        expect(loc !== null).toBeTruthy();

        expect(loc.getLangSpec()).toBe("zh-Hans");
    });

    test("LocaleGetLanguageSpecLanguageAndScriptMissing", () => {
        expect.assertions(2);

        const loc = new Locale("CN");
        expect(loc !== null).toBeTruthy();

        expect(loc.getLangSpec()).toBe("");
    });

    test("LocaleGetLanguageSpecNoScriptWithoutLanguage", () => {
        expect.assertions(2);

        const loc = new Locale("Hans-CN");
        expect(loc !== null).toBeTruthy();

        expect(loc.getLangSpec()).toBe("");
    });

    test("LocaleConstructorCalledWithNonStrings", () => {
        expect.assertions(8);

        function a(a) { return a; }

        try {
            let loc = new Locale(true, true, false, true);
            expect(loc.getLangSpec()).toBe("");
            loc = new Locale(a, a, a, a);
            expect(loc.getSpec()).toBe("");
            loc = new Locale(4, 4, 4, 4);
            expect(loc.getSpec()).toBe("");
            loc = new Locale({}, {}, {}, {});
            expect(loc.getSpec()).toBe("");

            loc = new Locale(true);
            expect(loc.getSpec()).toBe("");
            loc = new Locale(a);
            expect(loc.getSpec()).toBe("");
            loc = new Locale(4);
            expect(loc.getSpec()).toBe("");
            loc = new Locale({});
            expect(loc.getSpec()).toBe("");
        } catch (e) {
            test.fail();
        }
    });
});