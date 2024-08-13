/*
 * localematch.test.js - test the locale matcher object
 *
 * Copyright © 2012-2015,2017,2019- 2022-2023JEDLSoft
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

import LocaleMatcher from '../src/LocaleMatcher.js';

describe("testLocaleMatch", () => {
    test("LocaleMatcherConstructor", () => {
        expect.assertions(1);
        var loc = new LocaleMatcher();

        expect(loc !== null).toBeTruthy();
    });

    test("LocaleMatcherGetLikelyLocaleByLanguage1", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "uz"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("uz-Latn-UZ");
    });

    test("LocaleMatcherGetLikelyLocaleByLanguage2", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "alt"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("alt-Cyrl-RU");
    });

    test("LocaleMatcherGetLikelyLocaleByLanguage3", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "gv"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("gv-Latn-IM");
    });

    test("LocaleMatcherGetLikelyLocaleByLanguage4", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ia"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ia-Latn-001");
    });
    test("LocaleMatcherGetLikelyLocaleByLanguage5", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "sd"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("sd-Arab-PK");
    });
    test("LocaleMatcherGetLikelyLocaleByLanguage6", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "dz"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("dz-Tibt-BT");
    });
    test("LocaleMatcherGetLikelyLocaleByLanguage7", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "an"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("an-Latn-ES");
    });
    test("LocaleMatcherGetLikelyLocaleByLanguage_tk", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "tk"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("tk-Latn-TM");
    });
    test("LocaleMatcherGetLikelyLocaleByLanguage8", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "mt"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("mt-Latn-MT");
    });
    test("LocaleMatcherGetLikelyLocaleByRegion", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "UZ"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("uz-Latn-UZ");
    });
    test("LocaleMatcherGetLikelyLocaleByRegion_TM", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "TM"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("tk-Latn-TM");
    });
    test("LocaleMatcherGetLikelyLocaleByRegion2", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "MT"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();

        expect(locale.getSpec()).toBe("mt-Latn-MT");
    });
    test("LocaleMatcherGetLikelyLocaleByScript1", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "Arab"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ar-Arab-EG");
    });

    test("LocaleMatcherGetLikelyLocaleByScript2", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "Aran"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("fa-Aran-IR");
    });
    test("LocaleMatcherGetLikelyLocaleByScript3", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "Elym"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("arc-Elym-IR");
    });

    test("LocaleMatcherGetLikelyLocaleByLanguageAndScript1", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "pa-Arab"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("pa-Arab-PK");
    });

    test("LocaleMatcherGetLikelyLocaleByLanguageAndScript2", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "Cyrl-BY"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("be-Cyrl-BY");
    });

    test("LocaleMatcherGetLikelyLocaleByLanguageAndScript3", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ar-Hebr"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ar-Hebr-IL");
    });

    test("LocaleMatcherGetLikelyLocaleByLanguageAndScriptUnknownCombo", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "Cyrl-PL"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("pl-Latn-PL"); // default to country's locale
    });

    test("LocaleMatcherGetLikelyLocaleByLanguageAndScriptOriya", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "or-Orya"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("or-Orya-IN");
    });

    test("LocaleMatcherGetLikelyLocaleByLanguageOriya", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "or"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("or-Orya-IN");
    });

    test("LocaleMatcherGetLikelyLocaleByScriptOriya", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "Orya"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("or-Orya-IN");
    });

    test("LocaleMatcherGetLikelyLocaleByLanguageAndRegion", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "uz-AF"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("uz-Arab-AF");
    });

    test("LocaleMatcherGetLikelyLocaleByRegionAndScript", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "MA-Latn"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("fr-Latn-MA");
    });

    test("LocaleMatcherGetLikelyLocaleAlreadySpecified", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-CA-Latn"  // non-standard order of components
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-CA");
    });

    test("LocaleMatcherGetLikelyLocaleByLanguageMissing", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "zxx"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("zxx-Latn-XX");
    });

    test("LocaleMatcherGetLikelyLocaleByLanguageAndRegionMissing", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-GB"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-GB");
    });

    test("LocaleMatcherGetLikelyLocaleByLocaleRegionCodeAF", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "af-ZA"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("af-Latn-ZA");
    });

    test("LocaleMatcherGetLikelyLocaleByLocaleCodeAF", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "af"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("af-Latn-ZA");
    });

    test("LocaleMatcherGetLikelyLocaleByLocaleRegionCodeAF", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "af-NA"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("af-Latn-NA");
    });

    test("LocaleMatcherGetLikelyLocaleByLocaleRegionCodeET", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "am-ET"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("am-Ethi-ET");
    });

    test("LocaleMatcherGetLikelyLocaleByLocaleCodeET", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "am"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("am-Ethi-ET");
    });
    /*Hausa */
    test("LocaleMatcherGetLikelyLocaleByLocaleRegionCodeHANG", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ha"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ha-Latn-NG");
    });

    test("LocaleMatcherGetLikelyLocaleByLocaleCodeHANG", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ha-NG"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ha-Latn-NG");
    });

    test("LocaleMatcherGetLikelyLocaleByLocaleCodeHANE", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ha-NE"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ha-Latn-NE");
    });

    test("LocaleMatcherGetLikelyLocaleByLocaleCodeGH", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ha-GH"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ha-Latn-NG");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode1", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "fr-CA"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("fr-Latn-CA");
    });

    test("LocaleMatcherGetLikelyLocaleByLocaleCode2", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ar-DJ"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ar-Arab-DJ");
    });

    test("LocaleMatcherGetLikelyLocaleByLocaleCode3", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "bs-BA"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("bs-Latn-BA");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode4", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "de-AT"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("de-Latn-AT");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode5", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "de-LU"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("de-Latn-LU");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode6", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "el-GR"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("el-Grek-GR");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode7", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-AM"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-AM");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode8", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-AZ"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-AZ");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode9", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-CN"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-CN");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode10", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-ET"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-ET");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode11", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-GE"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-GE");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode12", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-IS"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-IS");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode13", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-JP"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-JP");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode14", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-LK"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-LK");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode15", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-MM"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-MM");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode16", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-MX"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-MX");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode17", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-MY"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-MY");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode18", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-PH"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-PH");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode19", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-PK"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-PK");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode20", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-PR"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-PR");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode21", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-RW"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-RW");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode22", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-SD"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-SD");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode23", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-TW"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-TW");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode24", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "uz-UZ"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("uz-Latn-UZ");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode25", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-TZ"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-TZ");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode26", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "sv-SE"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("sv-Latn-SE");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode27", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "es-CA"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("es-Latn-CA");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode28", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "es-PH"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("es-Latn-PH");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode29", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "es-US"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("es-Latn-US");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode30", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "sv-FI"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("sv-Latn-FI");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode31", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "et-EE"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("et-Latn-EE");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode32", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "fr-BE"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("fr-Latn-BE");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode33", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "fr-RW"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("fr-Latn-RW");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode34", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "fr-CH"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("fr-Latn-CH");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode35", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "fr-GQ"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("fr-Latn-GQ");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode36", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "fr-DZ"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("fr-Latn-DZ");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode37", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "fr-LB"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("fr-Latn-LB");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode38", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "fr-DJ"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("fr-Latn-DJ");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode39", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "kk-KZ"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("kk-Cyrl-KZ");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode40", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ha-NG"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ha-Latn-NG");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode41", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "it-CH"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("it-Latn-CH");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode42", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ms-MY"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ms-Latn-MY");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode43", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ms-SG"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ms-Latn-SG");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode44", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "nl-BE"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("nl-Latn-BE");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode45", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "pa-IN"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("pa-Guru-IN");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode46", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "pt-GQ"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("pt-Latn-GQ");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode47", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ru-BY"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ru-Cyrl-BY");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode48", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ru-GE"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ru-Cyrl-GE");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode49", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ru-KG"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ru-Cyrl-KG");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode50", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ru-UA"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ru-Cyrl-UA");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode51", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "sq-ME"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("sq-Latn-ME");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode52", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "tr-AM"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("tr-Latn-AM");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode53", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "tr-AZ"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("tr-Latn-AZ");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode54", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "tr-CY"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("tr-Latn-CY");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode55", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "uk-UA"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("uk-Cyrl-UA");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode56", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ur-IN"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ur-Arab-IN");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode57", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ur-PK"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ur-Arab-PK");
    });

    test("LocaleMatcherGetLikelyLocaleByLocaleCode58", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "hr-ME"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("hr-Latn-ME");
    });

    test("LocaleMatcherGetLikelyLocaleByLocaleCode59", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "Latn-ME"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("sr-Latn-ME");
    });

    test("LocaleMatcherGetLikelyLocaleByLocaleCode60", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ka-GE"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ka-Geor-GE");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode61", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "GE"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ka-Geor-GE");
    });

    test("LocaleMatcherGetLikelyLocaleByLocaleCode62", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ka"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ka-Geor-GE");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode63", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "be-BY"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("be-Cyrl-BY");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode64", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "be"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("be-Cyrl-BY");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode65", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "BY"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("be-Cyrl-BY");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_lo", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "lo"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("lo-Laoo-LA");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_ky", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ky"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ky-Cyrl-KG");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_zu", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "zu"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("zu-Latn-ZA");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_ZA", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ZA"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-ZA");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_KG", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "KG"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ky-Cyrl-KG");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_ca", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ca"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ca-Latn-ES");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_bn_IN", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "bn-IN"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("bn-Beng-IN");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_en_KR", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-KR"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Latn-KR");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_hr_HU", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "hr-HU"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("hr-Latn-HU");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_ka_IR", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ka-IR"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ka-Geor-IR");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_ku_IQ", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ku-IQ"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ku-Arab-IQ");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_ps_PK", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ps-PK"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ps-Arab-PK");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_pt_MO", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "pt-MO"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("pt-Latn-MO");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCodehy", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "hy"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("hy-Armn-AM");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCodehy2", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "AM"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("hy-Armn-AM");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCodehy3", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "Armn-AM"
            });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("hy-Armn-AM");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode68", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "gl-ES"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("gl-Latn-ES");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode69", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "gl"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("gl-Latn-ES");
    });
   test("LocaleMatcherGetLikelyLocaleByLocaleCode66", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "eu-ES"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("eu-Latn-ES");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode67", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "eu"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("eu-Latn-ES");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_my_MM", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "my-MM"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("my-Mymr-MM");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_my", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "my"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("my-Mymr-MM");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_ne", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ne"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ne-Deva-NP");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_ne_NP", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ne-NP"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ne-Deva-NP");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_wo", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "wo"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("wo-Latn-SN");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_wo_SN", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "wo-SN"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("wo-Latn-SN");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_tg", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "tg"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("tg-Cyrl-TJ");
    });
    test("LocaleMatcherGetLikelyLocaleByLocaleCode_tg_TJ", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "tg-TJ"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocale();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("tg-Cyrl-TJ");
    });
    test("LocaleMatcherMatchExactFullLocale", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "zh-Hans-CN"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("zh-Hans-CN")).toBe(100);
    });

    test("LocaleMatcherMatchExactLangRegion", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "en-US"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("en-US")).toBe(100);
    });

    test("LocaleMatcherMatchExactLang", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "en"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("en")).toBe(100);
    });

    test("LocaleMatcherMatchExactLangScript", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "zh-Hans"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("zh-Hans")).toBe(100);
    });

    test("LocaleMatcherMatchExactRegion", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "US"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("US")).toBe(100);
    });

    test("LocaleMatcherMatchExactDefaultScript", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "zh-Hans-CN"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("zh-CN")).toBe(100);
    });

    test("LocaleMatcherMatchExactDefaultScript", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "en-Latn-US"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("en-US")).toBe(100);
    });

    test("LocaleMatcherMatchExactDefaultRegion", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "ja-JP"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("ja")).toBe(100);
    });

    test("LocaleMatcherMatchExactDefaultRegionReverse", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "ja"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("ja-JP")).toBe(100);
    });

    test("LocaleMatcherMatchFullLocaleDifferentRegion", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "zh-Hans-CN"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("zh-Hans-SG")).toBe(79);
    });

    test("LocaleMatcherMatchFullLocaleDifferentScript", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "zh-Hans-HK"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("zh-Hant-HK")).toBe(80);
    });

    test("LocaleMatcherMatchFullLocaleDifferentLanguage", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "en-Latn-US"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("de-Latn-US")).toBe(50);
    });

    test("LocaleMatcherMatchFullLocaleDifferentVariant", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "en-US-VARIANT"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("en-US")).toBe(95);
    });

    test("LocaleMatcherMatchMutuallyIntelligibleLanguages", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "da-DK"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("no-NO")).toBe(49);
    });

    test("LocaleMatcherMatchMutuallyIntelligibleLanguagesAsymetric", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "no-NO"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("da-DK")).toBe(59);
    });


    test("LocaleMatcherGetMacroLanguageZH", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "zh-Hans-CN"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.getMacroLanguage()).toBe("zh");
    });

    test("LocaleMatcherGetMacroLanguageCMN", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "cmn-Hans-CN"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.getMacroLanguage()).toBe("zh");
    });

    test("LocaleMatcherGetMacroLanguageNO", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "nn-NO"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.getMacroLanguage()).toBe("no");
    });

    test("LocaleMatcherGetMacroLanguageNoChange", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "en-US"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.getMacroLanguage()).toBe("en");
    });

    test("LocaleMatcherMatchMacroLanguagesNO", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "nn-NO"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("no-NO")).toBe(95);
    });

    test("LocaleMatcherMatchMacroLanguagesZH", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "zh-Hans-CN"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("cmn-Hans-CN")).toBe(95);
    });

    test("LocaleMatcherMatchMacroLanguagesZH2", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "yue-Hans-CN"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.match("cmn-Hans-CN")).toBe(95);
    });

    test("LocaleMatcherGetMacroLanguageNO", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "nn-NO"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        expect(lm.getMacroLanguage()).toBe("no");
    });

    test("LocaleMatcherGetRegionContainmentNO", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "nn-NO"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        // northern europe, europe, world
        expect(lm.getRegionContainment()).toEqual(["154", "150", "UN", "001"]);
    });

    test("LocaleMatcherGetRegionContainmentDA", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "da-DK"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        // northern europe, european union, europe, world
        expect(lm.getRegionContainment()).toEqual(["154", "150", "EU", "UN", "001"]);
    });

    test("LocaleMatcherGetRegionContainmentUS", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "en-US"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        // northern north america, north america, world
        expect(lm.getRegionContainment()).toEqual(["021", "003", "019", "UN", "001"]);
    });

    test("LocaleMatcherGetRegionContainmentUsingMostLikelyRegion", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "ja"  // most likely region is "JP" for Japan
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        // western asia, asia, world
        expect(lm.getRegionContainment()).toEqual(["030", "142", "UN", "001"]);
    });

    test("LocaleMatcherSmallestCommonRegionUSCA", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "en-US"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        // northern north america
        expect(lm.smallestCommonRegion("CA")).toBe("021");
    });

    test("LocaleMatcherSmallestCommonRegionUSJM", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "en-US"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        // north america
        expect(lm.smallestCommonRegion("JM")).toBe("003");
    });

    test("LocaleMatcherSmallestCommonRegionUSGB", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "en-US"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        // world
        expect(lm.smallestCommonRegion("GB")).toBe("UN");
    });

    test("LocaleMatcherSmallestCommonRegionNLDK", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "nl-NL"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        // world
        expect(lm.smallestCommonRegion("DK")).toBe("150");
    });

    test("LocaleMatcherSmallestCommonRegionUndefined", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "nl-NL"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        // world
        expect(lm.smallestCommonRegion(undefined)).toBe("001");
    });

    test("LocaleMatcherSmallestCommonRegionWithMostLikelyRegions", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "ja"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        // eastern asia
        expect(lm.smallestCommonRegion("zh")).toBe("030");
    });

    test("LocaleMatcherSmallestCommonRegionWithMostLikelyRegions2", () => {
        expect.assertions(2);
        var lm = new LocaleMatcher({
            locale: "hi"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();

        // asia
        expect(lm.smallestCommonRegion("ja")).toBe("142");
    });

    test("LocaleMatcherGetLikelyLocaleMinimalByLanguage1", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-US");
    });

    test("LocaleMatcherGetLikelyLocaleMinimalByLanguage2", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "fr"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("fr-FR");
    });

    test("LocaleMatcherGetLikelyLocaleMinimalByLanguage3", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ja"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ja-JP");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalByLanguage4", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ka"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ka-GE");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalByLanguage4", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "be"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("be-BY");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalByLanguage_ky", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ky"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ky-Cyrl-KG");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalByLanguage6", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "gl"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("gl-ES");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalByLanguage5", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "eu"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("eu-ES");
    });

    test("LocaleMatcherGetLikelyLocaleMinimalUzbek", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "uz"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("uz-Latn-UZ"); // Uzbek always uses the script
    });

    test("LocaleMatcherGetLikelyLocaleMinimalChinese", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "zh"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("zh-Hans-CN"); // Chinese always uses the script
    });

    test("LocaleMatcherGetLikelyLocaleMinimalKazakh", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "kk"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("kk-Cyrl-KZ"); // Kazakh always uses the script
    });

    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForLanguage", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "sv"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("sv-SE"); // default is Latin
    });

    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForLanguage_ne", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ne"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ne-NP");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForLanguage_tk", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "tk"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("tk-TM");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForLanguage_tg", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "tg"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("tg-Cyrl-TJ");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForLanguage_mt", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "mt"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("mt-MT");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForLanguage_zu", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "zu"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("zu-ZA");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForCountry", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "FI"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("fi-FI"); // default is Latin
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForCountry_NP", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "NP"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ne-NP");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForCountry_MT", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "MT"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("mt-MT");
    });

    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForCountry_LA", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "LA"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("lo-LA");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalNonDefaultScriptForLanguage1", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "sr-ME"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("sr-Latn-ME"); // default is Cyrillic, so we have to put "Latn" explicitly
    });

    test("LocaleMatcherGetLikelyLocaleMinimalNonDefaultScriptForLanguage2", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "sr-Latn-RS"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("sr-Latn-RS"); // default is Cyrillic, so we have to put "Latn" explicitly
    });

    test("LocaleMatcherGetLikelyLocaleMinimalNonDefaultScriptForLanguage3", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "zh-TW"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("zh-Hant-TW"); // Chinese always uses the script
    });

    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForCountry1", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "US"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-US");
    });

    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForCountry2", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "HK"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("zh-Hant-HK"); // Chinese always uses the script
    });

    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForCountry3", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "RU"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ru-RU");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForCountry4", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "GE"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ka-GE");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForCountry_MM", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "MM"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("my-MM");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForCountry_TJ", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "TJ"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("tg-Cyrl-TJ");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForCountry_KG", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "KG"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ky-Cyrl-KG");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForCountry_SN", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "SN"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("fr-SN");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForCountry_AD", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "AD"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ca-AD");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForCountry_TM", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "TM"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("tk-TM");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultScriptForCountry_ZA", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ZA"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-ZA");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalDefaultLocaleForScript1", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "Latn"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-US");
    });

    test("LocaleMatcherGetLikelyLocaleMinimalDefaultLocaleForScript2", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "Jpan"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ja-JP");
    });

    test("LocaleMatcherGetLikelyLocaleMinimalDefaultLocaleForScript3", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "Hans"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("zh-Hans-CN");
    });

    test("LocaleMatcherGetLikelyLocaleMinimalDefaultLocaleForScript4", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "Geor"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ka-GE");
    });

    test("LocaleMatcherGetLikelyLocaleMinimalNonDefaultLocaleForScript1", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "Hira"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ja-Hira-JP");
    });

    test("LocaleMatcherGetLikelyLocaleMinimalNonDefaultLocaleForScript_Laoo", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "Laoo"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("lo-LA");
    });

    test("LocaleMatcherGetLikelyLocaleMinimalDefaultLocaleForLangScript1", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "uz-Latn"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("uz-Latn-UZ"); // Uzbek always uses the script
    });

    test("LocaleMatcherGetLikelyLocaleMinimalDefaultLocaleForLangScript2", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ru-Cyrl"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ru-RU");
    });

    test("LocaleMatcherGetLikelyLocaleMinimalDefaultLocaleForLangScript3", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "no-Latn"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("no-NO");
    });

    test("LocaleMatcherGetLikelyLocaleMinimalNonDefaultLocaleForLangScript1", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "en-Dsrt"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("en-Dsrt-US");
    });

    test("LocaleMatcherGetLikelyLocaleMinimalNonDefaultLocaleForLangScript2", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ar-Hebr"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ar-Hebr-IL");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalNonDefaultLocaleForLangScript_my_Mymr", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "my-Mymr"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("my-MM");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalNonDefaultLocaleForLangScript_Mymr", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "Mymr"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("my-MM");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalNonDefaultLocaleForLangScript_ne_Deva", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "ne-Deva"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("ne-NP");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalNonDefaultLocaleForLangScript_laoo", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "lo-Laoo"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("lo-LA");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalNonDefaultLocalehyAM", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "hy-AM"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("hy-AM");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalNonDefaultLocalehyAM2", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "hy-Armn"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("hy-AM");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalNonDefaultLocale_wo_SN", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "wo-SN"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("wo-SN");
    });
    test("LocaleMatcherGetLikelyLocaleMinimalNonDefaultLocale_wo_SN2", () => {
        expect.assertions(3);
        var lm = new LocaleMatcher({
            locale: "wo-Latn"
        });
        expect(typeof(lm) !== "undefined").toBeTruthy();
        var locale = lm.getLikelyLocaleMinimal();
        expect(typeof(locale) !== "undefined").toBeTruthy();
        expect(locale.getSpec()).toBe("wo-SN");
    });
});
