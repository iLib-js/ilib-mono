/*
 * locale.test.js - test the locale object
 *
 * Copyright © 2012-2015, 2017-2018, 2020-2023, 2025-2026 JEDLSoft
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
import * as ilibEnv from 'ilib-env';

import Locale from '../src/Locale.js';

describe("testLocale", () => {
    test("LocaleConstructor", () => {
        expect.assertions(1);
        let loc = new Locale();

        expect(loc !== null).toBeTruthy();
    });

    test("LocaleConstructorBrowser", () => {
        if (ilibEnv.getPlatform() !== "browser") {
            return;
        }
        // make sure it picks it up from the right place
        ilibEnv.clearCache();
        // cheating to make this test work!
        Object.defineProperty(navigator, "language", {
            writable: true
        });
        navigator.language = "ko-KR";
        expect.assertions(4);

        let loc = new Locale(); // gives locale of the host JS engine

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("ko");
        expect(loc.getRegion()).toBe("KR");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
        navigator.language = undefined;
    });

    test("LocaleConstructorBrowserCLocale", () => {
        if (ilibEnv.getPlatform() !== "browser") {
            return;
        }
        // make sure it picks it up from the right place
        ilibEnv.clearCache();
        // cheating to make this test work!
        Object.defineProperty(navigator, "language", {
            writable: true
        });
        navigator.language = "C";
        expect.assertions(4);

        let loc = new Locale(); // gives locale of the host JS engine

        expect(loc !== null).toBeTruthy();

        // make sure we map "C" locale to "en-US"
        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
        navigator.language = undefined;
    });

    test("LocaleConstructorBrowserLanguageOnly", () => {
        if (ilibEnv.getPlatform() !== "browser") {
            return;
        }
        // make sure it picks it up from the right place
        ilibEnv.clearCache();
        // cheating to make this test work!
        Object.defineProperty(navigator, "language", {
            writable: true
        });
        navigator.language = "de";
        expect.assertions(4);

        let loc = new Locale(); // gives locale of the host JS engine

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("de");
        expect(!loc.getRegion()).toBeTruthy();
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
        navigator.language = undefined;
    });

    test("LocaleConstructorBrowserNoLocale", () => {
        if (ilibEnv.getPlatform() !== "browser") {
            return;
        }
        // make sure it picks it up from the right place
        ilibEnv.clearCache();
        // cheating to make this test work!
        Object.defineProperty(navigator, "language", {
            writable: true
        });
        navigator.language = undefined;
        expect.assertions(4);

        let loc = new Locale(); // gives locale of the host JS engine

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
        navigator.language = undefined;
    });

    test("LocaleConstructorNode", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            return;
        }
        // make sure it picks it up from the right place
        ilibEnv.clearCache();
        global.process.env.LANG = "en_US";
        expect.assertions(4);

        let loc = new Locale(); // gives locale of the host JS engine

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
        global.process.env.LANG = "";
    });

    test("LocaleConstructorNodeNonEnglish", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            return;
        }
        // make sure it picks it up from the right place
        ilibEnv.clearCache();
        global.process.env.LANG = "ko_KR";
        expect.assertions(4);

        let loc = new Locale(); // gives locale of the host JS engine

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("ko");
        expect(loc.getRegion()).toBe("KR");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
        global.process.env.LANG = "";
    });

    test("LocaleConstructorNodeLocaleWithCharset", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            return;
        }
        // make sure it picks it up from the right place
        ilibEnv.clearCache();
        global.process.env.LANG = "de_DE.UTF8";
        expect.assertions(4);

        let loc = new Locale(); // gives locale of the host JS engine

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("de");
        expect(loc.getRegion()).toBe("DE");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
        global.process.env.LANG = "";
    });

    test("LocaleConstructorNodeCLocale", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            return;
        }
        // make sure it picks it up from the right place
        ilibEnv.clearCache();
        global.process.env.LANG = "C";
        expect.assertions(4);

        let loc = new Locale(); // gives locale of the host JS engine

        expect(loc !== null).toBeTruthy();

        // converts "C" to "en-US"
        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
        global.process.env.LANG = "";
    });

    test("LocaleConstructorNodeCLocaleWithCharset", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            return;
        }
        // make sure it picks it up from the right place
        ilibEnv.clearCache();
        global.process.env.LANG = "C.UTF8";
        expect.assertions(4);

        let loc = new Locale(); // gives locale of the host JS engine

        expect(loc !== null).toBeTruthy();

        // converts "C" to "en-US"
        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
        global.process.env.LANG = "";
    });

    test("LocaleConstructorNodeLangOnly", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            return;
        }
        // make sure it picks it up from the right place
        ilibEnv.clearCache();
        global.process.env.LANG = "es";
        expect.assertions(4);

        let loc = new Locale(); // gives locale of the host JS engine

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("es");
        expect(!loc.getRegion()).toBeTruthy();
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
        global.process.env.LANG = "";
    });

    test("LocaleConstructorNodeNoPlatformSetting", () => {
        if (ilibEnv.getPlatform() !== "nodejs") {
            return;
        }
        // make sure it picks it up from the right place
        ilibEnv.clearCache();
        global.process.env.LANG = "";
        expect.assertions(4);

        let loc = new Locale(); // gives locale of the host JS engine

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
        global.process.env.LANG = "";
    });

    test("LocaleCopyConstructor", () => {
        expect.assertions(4);
        let loc2 = new Locale("de", "DE");
        let loc = new Locale(loc2);

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("de");
        expect(loc.getRegion()).toBe("DE");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorFull", () => {
        expect.assertions(4);
        let loc = new Locale("en", "US", "Midwest");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(loc.getVariant()).toBe("Midwest");
    });

    test("LocaleConstructorSpecWithVariant", () => {
        expect.assertions(5);
        let loc = new Locale("en-US-Midwest");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(loc.getVariant()).toBe("Midwest");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorSpecWithScript", () => {
        expect.assertions(5);
        let loc = new Locale("en-US-Latn");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(loc.getScript()).toBe("Latn");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorPartial", () => {
        expect.assertions(4);
        let loc = new Locale("en", "US");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorSpecPartial", () => {
        expect.assertions(4);
        let loc = new Locale("en-US");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorSpecWithUnderscores1", () => {
        expect.assertions(5);
        // some locales like those in java properties file names
        // or in gnu gettext libraries are specified with underscores
        let loc = new Locale("zh_Hans_CN");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("zh");
        expect(loc.getRegion()).toBe("CN");
        expect(loc.getScript()).toBe("Hans");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorSpecWithUnderscores2", () => {
        expect.assertions(4);
        // some locales like those in java properties file names
        // or in gnu gettext libraries are specified with underscores
        let loc = new Locale("en_US");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorShort", () => {
        expect.assertions(4);
        let loc = new Locale("en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(typeof(loc.getRegion()) === "undefined").toBeTruthy();
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorUpperCaseLanguage", () => {
        expect.assertions(4);
        let loc = new Locale("EN", "US");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorLowerCaseRegion", () => {
        expect.assertions(4);
        let loc = new Locale("en", "us");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorSpecMissingRegion", () => {
        expect.assertions(5);
        let loc = new Locale("en--Midwest");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(typeof(loc.getRegion()) === "undefined").toBeTruthy();
        expect(loc.getVariant()).toBe("Midwest");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorSpecMissingLanguage", () => {
        expect.assertions(5);
        let loc = new Locale("-US-Midwest");

        expect(loc !== null).toBeTruthy();

        expect(typeof(loc.getLanguage()) === "undefined").toBeTruthy();
        expect(loc.getRegion()).toBe("US");
        expect(loc.getVariant()).toBe("Midwest");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
    });

    test("LocaleConstructorSpecMissingLanguageAndVariant", () => {
        expect.assertions(5);
        let loc = new Locale("-US");

        expect(loc !== null).toBeTruthy();

        expect(typeof(loc.getLanguage()) === "undefined").toBeTruthy();
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
    });

    test("LocaleEqualsTrue", () => {
        expect.assertions(3);
        let loc1 = new Locale("en-US"),
            loc2 = new Locale("en", "US");

        expect(loc1 !== null).toBeTruthy();
        expect(loc2 !== null).toBeTruthy();

        expect(loc1.equals(loc2)).toBeTruthy();
    });

    test("LocaleEqualsFalse", () => {
        expect.assertions(3);
        let loc1 = new Locale("en-US"),
            loc2 = new Locale("en", "CA");

        expect(loc1 !== null).toBeTruthy();
        expect(loc2 !== null).toBeTruthy();

        expect(!loc1.equals(loc2)).toBeTruthy();
    });

    test("LocaleEqualsMissing", () => {
        expect.assertions(3);
        let loc1 = new Locale("en-US"),
            loc2 = new Locale("en", "US", "govt");

        expect(loc1 !== null).toBeTruthy();
        expect(loc2 !== null).toBeTruthy();

        expect(!loc1.equals(loc2)).toBeTruthy();
    });

    test("LocaleEqualsTrueFull", () => {
        expect.assertions(3);
        let loc1 = new Locale("en-US-govt"),
            loc2 = new Locale("en", "US", "govt");

        expect(loc1 !== null).toBeTruthy();
        expect(loc2 !== null).toBeTruthy();

        expect(loc1.equals(loc2)).toBeTruthy();
    });

    test("LocaleEqualsTrueShort", () => {
        expect.assertions(3);
        let loc1 = new Locale("en"),
            loc2 = new Locale("en");

        expect(loc1 !== null).toBeTruthy();
        expect(loc2 !== null).toBeTruthy();

        expect(loc1.equals(loc2)).toBeTruthy();
    });

    test("LocaleGetSpecLangOnly", () => {
        expect.assertions(2);
        let loc = new Locale("en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en");
    });

    test("LocaleGetSpecRegionOnly", () => {
        expect.assertions(2);
        let loc = new Locale("CA");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("CA");
    });

    test("LocaleGetSpecScriptOnly", () => {
        expect.assertions(2);
        let loc = new Locale("Latn");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("Latn");
    });

    test("LocaleGetSpecVariantOnly", () => {
        expect.assertions(2);
        let loc = new Locale("asdfasdf");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("asdfasdf");
    });

    test("LocaleGetSpecLangAndScript", () => {
        expect.assertions(2);
        let loc = new Locale("Latn-en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-Latn");
    });

    test("LocaleGetSpecLangAndRegion", () => {
        expect.assertions(2);
        let loc = new Locale("CA-en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-CA");
    });

    test("LocaleGetSpecLangAndVariant", () => {
        expect.assertions(2);
        let loc = new Locale("asdf-en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-asdf");
    });

    test("LocaleGetSpecScriptAndRegion", () => {
        expect.assertions(2);
        let loc = new Locale("CA-Latn");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("Latn-CA");
    });

    test("LocaleGetSpecScriptAndVariant", () => {
        expect.assertions(2);
        let loc = new Locale("asdf-Latn");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("Latn-asdf");
    });

    test("LocaleGetSpecRegionAndVariant", () => {
        expect.assertions(2);
        let loc = new Locale("asdf-CA");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("CA-asdf");
    });

    test("LocaleGetSpecLangScriptRegion", () => {
        expect.assertions(2);
        let loc = new Locale("CA-en-Latn");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-Latn-CA");
    });

    test("LocaleGetSpecScriptRegionVariant", () => {
        expect.assertions(2);
        let loc = new Locale("CA-asdf-Latn");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("Latn-CA-asdf");
    });

    test("LocaleGetSpecLangScriptVariant", () => {
        expect.assertions(2);
        let loc = new Locale("asdf-Latn-en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-Latn-asdf");
    });

    test("LocaleGetSpecLangRegionVariant", () => {
        expect.assertions(2);
        let loc = new Locale("asdf-CA-en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-CA-asdf");
    });

    test("LocaleGetSpecAll", () => {
        expect.assertions(2);
        let loc = new Locale("asdf-CA-Latn-en");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-Latn-CA-asdf");
    });

    test("LocaleM49RegionCodeGetParts", () => {
        expect.assertions(4);
        let loc = new Locale("en-001");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("001");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleM49RegionCodeGetParts2", () => {
        expect.assertions(4);
        let loc = new Locale("en-150");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("150");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("LocaleM49RegionCodeGetSpec", () => {
        expect.assertions(2);
        let loc = new Locale("en-001");

        expect(loc !== null).toBeTruthy();

        expect(loc.getSpec()).toBe("en-001");
    });

    test("LocaleNoLocale", () => {
        expect.assertions(6);
        let loc = new Locale("-");

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
        let loc = new Locale("en-US");

        expect(loc !== null).toBeTruthy();
        expect(loc.getLanguageAlpha3()).toBe("eng");
    });

    test("LocaleGetLanguageAlpha3_2", () => {
        expect.assertions(2);
        let loc = new Locale("ru-RU");

        expect(loc !== null).toBeTruthy();
        expect(loc.getLanguageAlpha3()).toBe("rus");
    });

    test("LocaleGetLanguageAlpha3_3", () => {
        expect.assertions(2);
        let loc = new Locale("gv-GB");

        expect(loc !== null).toBeTruthy();
        expect(loc.getLanguageAlpha3()).toBe("glv");
    });

    test("LocaleGetLanguageAlpha3NoLanguage", () => {
        expect.assertions(2);
        let loc = new Locale("GB");

        expect(loc !== null).toBeTruthy();
        expect(typeof(loc.getLanguageAlpha3()) === "undefined").toBeTruthy();
    });

    test("LocaleGetRegionAlpha3_1", () => {
        expect.assertions(2);
        let loc = new Locale("en-US");

        expect(loc !== null).toBeTruthy();
        expect(loc.getRegionAlpha3()).toBe("USA");
    });

    test("LocaleGetRegionAlpha3_2", () => {
        expect.assertions(2);
        let loc = new Locale("ru-RU");

        expect(loc !== null).toBeTruthy();
        expect(loc.getRegionAlpha3()).toBe("RUS");
    });

    test("LocaleGetRegionAlpha3_3", () => {
        expect.assertions(2);
        let loc = new Locale("gv-GB");

        expect(loc !== null).toBeTruthy();
        expect(loc.getRegionAlpha3()).toBe("GBR");
    });

    test("LocaleGetRegionAlpha3NoRegion", () => {
        expect.assertions(2);
        let loc = new Locale("en");

        expect(loc !== null).toBeTruthy();
        expect(typeof(loc.getRegionAlpha3()) === "undefined").toBeTruthy();
    });

    test("LocaleGetLanguageSpecSimple", () => {
        expect.assertions(2);

        let loc = new Locale("en");
        expect(loc !== null).toBeTruthy();
        expect(loc.getLangSpec()).toBe("en");
    });

    test("LocaleGetLanguageSpecLeaveOutRegionAndVariant", () => {
        expect.assertions(2);

        let loc = new Locale("en-US-MILITARY");
        expect(loc !== null).toBeTruthy();
        expect(loc.getLangSpec()).toBe("en");
    });

    test("LocaleGetLanguageSpecIncludeScript", () => {
        expect.assertions(2);

        let loc = new Locale("zh-Hans");
        expect(loc !== null).toBeTruthy();
        expect(loc.getLangSpec()).toBe("zh-Hans");
    });

    test("LocaleGetLanguageSpecIncludeScriptButNotOthers", () => {
        expect.assertions(2);

        let loc = new Locale("zh-Hans-CN-GOVT");
        expect(loc !== null).toBeTruthy();
        expect(loc.getLangSpec()).toBe("zh-Hans");
    });

    test("LocaleGetLanguageSpecLanguageAndScriptMissing", () => {
        expect.assertions(2);

        let loc = new Locale("CN");
        expect(loc !== null).toBeTruthy();
        expect(loc.getLangSpec()).toBe("");
    });

    test("LocaleGetLanguageSpecNoScriptWithoutLanguage", () => {
        expect.assertions(2);

        let loc = new Locale("Hans-CN");
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

    test("LocaleIsValidLocaleTrueFull", () => {
        expect.assertions(2);

        let loc = new Locale("zh-Hans-CN");
        expect(loc !== null).toBeTruthy();
        expect(loc.isValid()).toBeTruthy();
    });

    test("LocaleIsValidLocaleTrueLang", () => {
        expect.assertions(2);

        let loc = new Locale("de");
        expect(loc !== null).toBeTruthy();
        expect(loc.isValid()).toBeTruthy();
    });

    test("LocaleIsValidLocaleTrueScript", () => {
        expect.assertions(2);

        let loc = new Locale("Latn");
        expect(loc !== null).toBeTruthy();
        expect(loc.isValid()).toBeTruthy();
    });

    test("LocaleIsValidLocaleTrueRegion", () => {
        expect.assertions(2);

        let loc = new Locale("BE");
        expect(loc !== null).toBeTruthy();
        expect(loc.isValid()).toBeTruthy();
    });

    test("LocaleIsValidLocaleFalseScript", () => {
        expect.assertions(2);

        let loc = new Locale("zh-Hank-CN");
        expect(loc !== null).toBeTruthy();
        expect(!loc.isValid()).toBeTruthy();
    });

    test("LocaleIsValidLocaleFalseLanguage", () => {
        expect.assertions(2);

        let loc = new Locale("zz-Hans-CN");
        expect(loc !== null).toBeTruthy();
        expect(!loc.isValid()).toBeTruthy();
    });

    test("LocaleIsValidLocaleFalseRegion", () => {
        expect.assertions(2);

        let loc = new Locale("zh-Hans-CQ");
        expect(loc !== null).toBeTruthy();
        expect(!loc.isValid()).toBeTruthy();
    });

    test("LocaleIsValidLocaleTrueWithVariant", () => {
        expect.assertions(2);

        let loc = new Locale("zh-Hans-CN-SHANGHAI");
        expect(loc !== null).toBeTruthy();
        expect(loc.isValid()).toBeTruthy();
    });

    test("LocaleIsValidLocaleFalseEmpty", () => {
        expect.assertions(2);

        let loc = new Locale(" ");
        expect(loc !== null).toBeTruthy();
        expect(!loc.isValid()).toBeTruthy();
    });

    test("LocaleIsValidLocaleTrueParts", () => {
        expect.assertions(2);

        let loc = new Locale("zh", "CN", "Hans");
        expect(loc !== null).toBeTruthy();
        expect(loc.isValid()).toBeTruthy();
    });

    test("LocaleParsePrivateUseSubtag", () => {
        expect.assertions(5);
        // BCP-47 private use subtag "x-pseudo" should become the variant
        let loc = new Locale("en-x-pseudo");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(typeof(loc.getRegion()) === "undefined").toBeTruthy();
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        expect(loc.getVariant()).toBe("x-pseudo");
    });

    test("LocaleParsePrivateUseSubtagLonger", () => {
        expect.assertions(5);
        // BCP-47 private use subtag "x-sort-phonebook" should become the variant
        let loc = new Locale("en-x-sort-phonebook");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(typeof(loc.getRegion()) === "undefined").toBeTruthy();
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        expect(loc.getVariant()).toBe("x-sort-phonebook");
    });

    test("LocaleParseUnicodeExtensionSubtag", () => {
        expect.assertions(5);
        // BCP-47 Unicode extension "u-co-phonebk" for phonebook collation
        let loc = new Locale("de-DE-u-co-phonebk");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("de");
        expect(loc.getRegion()).toBe("DE");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        // The "u" extension should be preserved as the variant
        expect(loc.getVariant()).toBe("u-co-phonebk");
    });

    test("LocaleParseUnicodeExtensionSubtagWithScript", () => {
        expect.assertions(5);
        // BCP-47 Unicode extension with script included
        let loc = new Locale("zh-Hans-CN-u-nu-hanidec");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("zh");
        expect(loc.getScript()).toBe("Hans");
        expect(loc.getRegion()).toBe("CN");
        // The "u" extension for numbering system should be preserved
        expect(loc.getVariant()).toBe("u-nu-hanidec");
    });

    test("LocaleParseTransformedExtensionSubtag", () => {
        expect.assertions(5);
        // BCP-47 "t" extension for transformed content
        let loc = new Locale("en-t-ja");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("en");
        expect(typeof(loc.getRegion()) === "undefined").toBeTruthy();
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        // The "t" extension should be preserved as the variant
        expect(loc.getVariant()).toBe("t-ja");
    });

    test("LocaleParseMultipleVariants", () => {
        expect.assertions(5);
        // BCP-47 allows multiple variant subtags
        let loc = new Locale("sl-IT-nedis-rozaj");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("sl");
        expect(loc.getRegion()).toBe("IT");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        // Both variants should be preserved
        expect(loc.getVariant()).toBe("nedis-rozaj");
    });

    test("LocaleParseVariantWithExtension", () => {
        expect.assertions(5);
        // Combination of variant and extension
        let loc = new Locale("ca-ES-valencia-u-co-trad");

        expect(loc !== null).toBeTruthy();

        expect(loc.getLanguage()).toBe("ca");
        expect(loc.getRegion()).toBe("ES");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        // Both the variant "valencia" and the extension should be preserved
        expect(loc.getVariant()).toBe("valencia-u-co-trad");
    });

    test("LocaleGetSpecPrivateUseSubtag", () => {
        expect.assertions(2);
        let loc = new Locale("en-x-pseudo");

        expect(loc !== null).toBeTruthy();
        expect(loc.getSpec()).toBe("en-x-pseudo");
    });

    test("LocaleGetSpecPrivateUseSubtagLonger", () => {
        expect.assertions(2);
        let loc = new Locale("en-x-sort-phonebook");

        expect(loc !== null).toBeTruthy();
        expect(loc.getSpec()).toBe("en-x-sort-phonebook");
    });

    test("LocaleGetSpecPrivateUseWithRegion", () => {
        expect.assertions(2);
        let loc = new Locale("en-US-x-military");

        expect(loc !== null).toBeTruthy();
        expect(loc.getSpec()).toBe("en-US-x-military");
    });

    test("LocaleGetSpecUnicodeExtension", () => {
        expect.assertions(2);
        let loc = new Locale("de-DE-u-co-phonebk");

        expect(loc !== null).toBeTruthy();
        expect(loc.getSpec()).toBe("de-DE-u-co-phonebk");
    });

    test("LocaleGetSpecUnicodeExtensionWithScript", () => {
        expect.assertions(2);
        let loc = new Locale("zh-Hans-CN-u-nu-hanidec");

        expect(loc !== null).toBeTruthy();
        expect(loc.getSpec()).toBe("zh-Hans-CN-u-nu-hanidec");
    });

    test("LocaleGetSpecTransformedExtension", () => {
        expect.assertions(2);
        let loc = new Locale("en-t-ja");

        expect(loc !== null).toBeTruthy();
        expect(loc.getSpec()).toBe("en-t-ja");
    });

    test("LocaleGetSpecMultipleVariants", () => {
        expect.assertions(2);
        let loc = new Locale("sl-IT-nedis-rozaj");

        expect(loc !== null).toBeTruthy();
        expect(loc.getSpec()).toBe("sl-IT-nedis-rozaj");
    });

    test("LocaleGetSpecVariantWithExtension", () => {
        expect.assertions(2);
        let loc = new Locale("ca-ES-valencia-u-co-trad");

        expect(loc !== null).toBeTruthy();
        expect(loc.getSpec()).toBe("ca-ES-valencia-u-co-trad");
    });
});

describe("testPosixLocale", () => {
    // Tests for Locale.isPosixLocale()

    test("IsPosixLocaleSimple", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale("en_US")).toBe(true);
    });

    test("IsPosixLocaleWithCodeset", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale("en_US.UTF-8")).toBe(true);
    });

    test("IsPosixLocaleWithModifier", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale("de_DE@euro")).toBe(true);
    });

    test("IsPosixLocaleWithCodesetAndModifier", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale("sr_RS.UTF-8@latin")).toBe(true);
    });

    test("IsPosixLocaleLanguageOnly", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale("en")).toBe(true);
    });

    test("IsPosixLocaleThreeLetterLanguage", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale("deu_DE")).toBe(true);
    });

    test("IsPosixLocaleSpecialCaseC", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale("C")).toBe(true);
    });

    test("IsPosixLocaleSpecialCasePOSIX", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale("POSIX")).toBe(true);
    });

    test("IsPosixLocaleSpecialCaseCWithCodeset", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale("C.UTF-8")).toBe(true);
    });

    test("IsPosixLocaleFalseUndefined", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale(undefined)).toBe(false);
    });

    test("IsPosixLocaleFalseNull", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale(null)).toBe(false);
    });

    test("IsPosixLocaleFalseEmpty", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale("")).toBe(false);
    });

    test("IsPosixLocaleFalseBCP47", () => {
        expect.assertions(1);
        // BCP-47 uses dashes, not underscores, and no codeset
        expect(Locale.isPosixLocale("en-US")).toBe(false);
    });

    test("IsPosixLocaleFalseBCP47WithScript", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale("zh-Hans-CN")).toBe(false);
    });

    test("IsPosixLocaleFalseInvalidLanguage", () => {
        expect.assertions(1);
        // Language should be lowercase
        expect(Locale.isPosixLocale("EN_US")).toBe(false);
    });

    test("IsPosixLocaleFalseInvalidTerritory", () => {
        expect.assertions(1);
        // Territory should be uppercase
        expect(Locale.isPosixLocale("en_us")).toBe(false);
    });

    test("IsPosixLocaleFalseTooLongLanguage", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale("engl_US")).toBe(false);
    });

    test("IsPosixLocaleFalseTooShortLanguage", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale("e_US")).toBe(false);
    });

    test("IsPosixLocaleFalseMalformed", () => {
        expect.assertions(1);
        expect(Locale.isPosixLocale("en__US")).toBe(false);
    });

    test("IsPosixLocaleNumericTerritory", () => {
        expect.assertions(1);
        // M.49 3-digit region codes should be valid
        expect(Locale.isPosixLocale("en_001")).toBe(true);
    });

    // Tests for Locale.fromPosix()

    test("FromPosixSimple", () => {
        expect.assertions(5);
        let loc = Locale.fromPosix("en_US");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("FromPosixLanguageOnly", () => {
        expect.assertions(5);
        let loc = Locale.fromPosix("de");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getLanguage()).toBe("de");
        expect(typeof(loc.getRegion()) === "undefined").toBeTruthy();
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("FromPosixThreeLetterLanguage", () => {
        expect.assertions(5);
        let loc = Locale.fromPosix("deu_DE");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getLanguage()).toBe("deu");
        expect(loc.getRegion()).toBe("DE");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("FromPosixWithCodeset", () => {
        expect.assertions(5);
        // Codeset should be preserved as x-encoding- private use subtag
        let loc = Locale.fromPosix("en_US.UTF-8");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        expect(loc.getVariant()).toBe("x-encoding-utf8");
    });

    test("FromPosixWithModifierAsVariant", () => {
        expect.assertions(5);
        // Modifier that doesn't map to a script becomes a variant
        let loc = Locale.fromPosix("de_DE@euro");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getLanguage()).toBe("de");
        expect(loc.getRegion()).toBe("DE");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        expect(loc.getVariant()).toBe("euro");
    });

    test("FromPosixWithModifierAsScriptLatin", () => {
        expect.assertions(5);
        // @latin should map to script "Latn"
        let loc = Locale.fromPosix("sr_RS@latin");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getLanguage()).toBe("sr");
        expect(loc.getRegion()).toBe("RS");
        expect(loc.getScript()).toBe("Latn");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("FromPosixWithModifierAsScriptCyrillic", () => {
        expect.assertions(5);
        // @cyrillic should map to script "Cyrl"
        let loc = Locale.fromPosix("sr_RS@cyrillic");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getLanguage()).toBe("sr");
        expect(loc.getRegion()).toBe("RS");
        expect(loc.getScript()).toBe("Cyrl");
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("FromPosixWithCodesetAndModifier", () => {
        expect.assertions(5);
        let loc = Locale.fromPosix("sr_RS.UTF-8@latin");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getLanguage()).toBe("sr");
        expect(loc.getRegion()).toBe("RS");
        expect(loc.getScript()).toBe("Latn");
        expect(loc.getVariant()).toBe("x-encoding-utf8");
    });

    test("FromPosixSpecialCaseC", () => {
        expect.assertions(5);
        // "C" locale should map to en-US
        let loc = Locale.fromPosix("C");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("FromPosixSpecialCasePOSIX", () => {
        expect.assertions(5);
        // "POSIX" locale should map to en-US
        let loc = Locale.fromPosix("POSIX");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("FromPosixSpecialCaseCWithCodeset", () => {
        expect.assertions(5);
        // "C.UTF-8" should map to en-US with encoding preserved
        let loc = Locale.fromPosix("C.UTF-8");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("US");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        expect(loc.getVariant()).toBe("x-encoding-utf8");
    });

    test("FromPosixInvalidReturnsUndefined", () => {
        expect.assertions(1);
        let loc = Locale.fromPosix("not-a-valid-posix-locale");

        expect(loc).toBeUndefined();
    });

    test("FromPosixBCP47ReturnsUndefined", () => {
        expect.assertions(1);
        // BCP-47 format should not be accepted
        let loc = Locale.fromPosix("en-US");

        expect(loc).toBeUndefined();
    });

    test("FromPosixEmptyReturnsUndefined", () => {
        expect.assertions(1);
        let loc = Locale.fromPosix("");

        expect(loc).toBeUndefined();
    });

    test("FromPosixUndefinedReturnsUndefined", () => {
        expect.assertions(1);
        let loc = Locale.fromPosix(undefined);

        expect(loc).toBeUndefined();
    });

    test("FromPosixNullReturnsUndefined", () => {
        expect.assertions(1);
        let loc = Locale.fromPosix(null);

        expect(loc).toBeUndefined();
    });

    test("FromPosixNumericTerritory", () => {
        expect.assertions(5);
        // M.49 3-digit region codes
        let loc = Locale.fromPosix("en_001");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getLanguage()).toBe("en");
        expect(loc.getRegion()).toBe("001");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        expect(typeof(loc.getVariant()) === "undefined").toBeTruthy();
    });

    test("FromPosixChineseSimplified", () => {
        expect.assertions(5);
        let loc = Locale.fromPosix("zh_CN.GB18030");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getLanguage()).toBe("zh");
        expect(loc.getRegion()).toBe("CN");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        expect(loc.getVariant()).toBe("x-encoding-gb18030");
    });

    test("FromPosixCodesetWithHyphens", () => {
        expect.assertions(5);
        // Codeset with hyphens should be normalized (hyphens removed, lowercase)
        let loc = Locale.fromPosix("de_DE.ISO-8859-1");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getLanguage()).toBe("de");
        expect(loc.getRegion()).toBe("DE");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        expect(loc.getVariant()).toBe("x-encoding-iso88591");
    });

    test("FromPosixCodesetWithModifierVariant", () => {
        expect.assertions(5);
        // Both codeset and modifier (as variant) should be preserved
        let loc = Locale.fromPosix("de_DE.UTF-8@euro");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getLanguage()).toBe("de");
        expect(loc.getRegion()).toBe("DE");
        expect(typeof(loc.getScript()) === "undefined").toBeTruthy();
        // Variant should include both the modifier and the encoding
        expect(loc.getVariant()).toBe("euro-x-encoding-utf8");
    });

    test("FromPosixGetSpec", () => {
        expect.assertions(2);
        let loc = Locale.fromPosix("en_US.UTF-8");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getSpec()).toBe("en-US-x-encoding-utf8");
    });

    test("FromPosixWithScriptGetSpec", () => {
        expect.assertions(2);
        let loc = Locale.fromPosix("sr_RS@latin");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getSpec()).toBe("sr-Latn-RS");
    });

    test("FromPosixWithVariantGetSpec", () => {
        expect.assertions(2);
        let loc = Locale.fromPosix("de_DE@euro");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getSpec()).toBe("de-DE-euro");
    });

    // Tests for various script name recognition from generated scriptNameToCode mapping

    test("FromPosixScriptBraille", () => {
        expect.assertions(3);
        let loc = Locale.fromPosix("fr_FR@braille");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getScript()).toBe("Brai");
        expect(loc.getSpec()).toBe("fr-Brai-FR");
    });

    test("FromPosixScriptKhmer", () => {
        expect.assertions(3);
        let loc = Locale.fromPosix("km_KH@khmer");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getScript()).toBe("Khmr");
        expect(loc.getSpec()).toBe("km-Khmr-KH");
    });

    test("FromPosixScriptMyanmar", () => {
        expect.assertions(3);
        let loc = Locale.fromPosix("my_MM@myanmar");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getScript()).toBe("Mymr");
        expect(loc.getSpec()).toBe("my-Mymr-MM");
    });

    test("FromPosixScriptMandaic", () => {
        expect.assertions(3);
        let loc = Locale.fromPosix("ar_IQ@mandaic");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getScript()).toBe("Mand");
        expect(loc.getSpec()).toBe("ar-Mand-IQ");
    });

    test("FromPosixScriptHanunoo", () => {
        expect.assertions(3);
        let loc = Locale.fromPosix("tl_PH@hanunoo");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getScript()).toBe("Hano");
        expect(loc.getSpec()).toBe("tl-Hano-PH");
    });

    test("FromPosixScriptTaiAhom", () => {
        expect.assertions(3);
        let loc = Locale.fromPosix("aho_IN@taiahom");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getScript()).toBe("Ahom");
        expect(loc.getSpec()).toBe("aho-Ahom-IN");
    });

    test("FromPosixScriptOldPersian", () => {
        expect.assertions(3);
        let loc = Locale.fromPosix("fa_IR@oldpersian");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getScript()).toBe("Xpeo");
        expect(loc.getSpec()).toBe("fa-Xpeo-IR");
    });

    test("FromPosixScriptVithkuqi", () => {
        expect.assertions(3);
        let loc = Locale.fromPosix("sq_AL@vithkuqi");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getScript()).toBe("Vith");
        expect(loc.getSpec()).toBe("sq-Vith-AL");
    });

    test("FromPosixScriptSantali", () => {
        expect.assertions(3);
        let loc = Locale.fromPosix("sat_IN@santali");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getScript()).toBe("Olck");
        expect(loc.getSpec()).toBe("sat-Olck-IN");
    });

    test("FromPosixScriptGeorgian", () => {
        expect.assertions(3);
        let loc = Locale.fromPosix("ka_GE@georgian");

        expect(loc !== undefined).toBeTruthy();
        expect(loc.getScript()).toBe("Geor");
        expect(loc.getSpec()).toBe("ka-Geor-GE");
    });
});
