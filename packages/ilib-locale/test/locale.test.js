/*
 * locale.test.js - test the locale object
 *
 * Copyright © 2012-2015, 2017-2018, 2020-2023 JEDLSoft
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
});
