/*
 * tolower.test.js - Test the lower-casing mapper
 *
 * Copyright © 2014-2015, 2017, 2023 2023 JEDLSoft
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
import CaseMapper from '../src/CaseMapper.js';

describe("testToLower", function() {
    test("ToLowerFromLower_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower"
        });
        expect(mapper.map("this is a string")).toBe("this is a string");
    });

    test("ToLowerFromUpper_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower"
        });
        expect(mapper.map("THIS IS A STRING")).toBe("this is a string");
    });

    test("ToLowerFromMixed_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower"
        });
        expect(mapper.map("This is a String")).toBe("this is a string");
    });

    test("ToLowerFromPunctuationUnchanged_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower"
        });
        expect(mapper.map("!@#$%^&*()")).toBe("!@#$%^&*()");
    });

    test("ToLowerFromNonLatinUnchanged_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower"
        });
        expect(mapper.map("演蟻人 道格拉斯最老英雄")).toBe("演蟻人 道格拉斯最老英雄");
    });

    test("ToLowerFromExtendedLatin_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower"
        });
        expect(mapper.map("ÃÉÌÔÜ")).toBe("ãéìôü");
    });

    test("ToLowerCyrillic_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower"
        });
        expect(mapper.map("ПРАЗЛ")).toBe("празл");
    });

    test("ToLowerGreek_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower"
        });
        expect(mapper.map("ΑΒΓΔΕΖΗΘ")).toBe("αβγδεζηθ");
    });

    test("ToLowerGreekSigma_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower"
        });
        expect(mapper.map("ΙΑΣΑΣ ΙΑΣΑΣ")).toBe("ιασας ιασας");
    });

    test("ToLowerCoptic_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower"
        });
        expect(mapper.map("ⲀⲂⲄⲆⲈⲊⲌⲎⲐⲒⲔⲖ")).toBe("ⲁⲃⲅⲇⲉⲋⲍⲏⲑⲓⲕⲗ");
    });

    test("ToLowerArmenian_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower"
        });
        expect(mapper.map("ԱԲԳԴԵԶԷԸԹ")).toBe("աբգդեզէըթ");
    });

    test("ToLowerGeorgian_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower"
        });
        expect(mapper.map("ႠႡႢႣႤႥႦႧႨႩ")).toBe("ⴀⴁⴂⴃⴄⴅⴆⴇⴈⴉ");
    });

    /* Azeri tests */
    test("ToLower_az_AZ", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "az-AZ"
        });
        expect(mapper.map("Iİ")).toBe("ıi");
    });

    /* Turkish tests */
    test("ToLower_tr_TR", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "tr-TR"
        });
        expect(mapper.map("Iİ")).toBe("ıi");
    });

    /* Crimean Tatar tests */
    test("ToLower_crh_Latn_UK", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "crh-Latn-UK"
        });
        expect(mapper.map("Iİ")).toBe("ıi");
    });

    /* Kazakh tests */
    test("ToLower_kk_Latn_KK", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "kk-Latn-KK"
        });
        expect(mapper.map("Iİ")).toBe("ıi");
    });

    /* Tatar tests */
    test("ToLower_tt_Latn_RU", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "tt-Latn-RU"
        });
        expect(mapper.map("Iİ")).toBe("ıi");
    });

    /* Karachay-Balkar tests */
    test("ToLower_krc_Latn_RU", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "krc-Latn-RU"
        });
        expect(mapper.map("Iİ")).toBe("ıi");
    });

    /* German tests */
    test("ToLowerDoubleS_de_DE", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "de-DE"
        });
        expect(mapper.map("GROSS")).toBe("gross");
    });

    test("ToLowerWithSZ_de_DE", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "de-DE"
        });
        expect(mapper.map("GROß")).toBe("groß");
    });


    /* Russian tests */
    test("ToLowerLowerPalochka_ru_RU", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "ru-RU"
        });
        expect(mapper.map("ӏ")).toBe("ӏ");
    });

    test("ToLowerUpperPalochka_ru_RU", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "ru-RU"
        });
        expect(mapper.map("Ӏ")).toBe("Ӏ");
    });

    /* Greek tests */
    test("ToLower_el_GR", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "el-GR"
        });
        expect(mapper.map("ΙΑΣΑΣ ΙΑΣΑΣ")).toBe("ιασας ιασας");
    });

    /* French tests */
    test("ToLowerNoAccents_fr_FR", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "fr-FR"
        });
        expect(mapper.map("TETE-A-TETE")).toBe("tete-a-tete");
    });
    test("ToLowerWithAccents_fr_FR", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "fr-FR"
        });
        expect(mapper.map("TÊTE-À-TÊTE")).toBe("tête-à-tête");
    });
    test("ToLowerMixedWithAccents_fr_FR", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "fr-FR"
        });
        expect(mapper.map("Tête-à-Tête")).toBe("tête-à-tête");
    });

    /* French Canadian tests */
    test("ToLower_fr_CA", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "fr-CA"
        });
        expect(mapper.map("TÊTE-À-TÊTE")).toBe("tête-à-tête");
    });

    //make sure it is not broken in Lithuanian
    test("ToLower_lt", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "lt-LT"
        });
        expect(mapper.map("AĄBCČDEĘĖFGHIĮYJKLMNOPRSŠTUŲŪVZŽ")).toBe("aąbcčdeęėfghiįyjklmnoprsštuųūvzž");
    });

    /*Afrikaan Test cases*/
    test("ToLower_af_ZA1", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "af-ZA"
        });
        expect(mapper.map("AÁÄBCDEÊËÉÈFG")).toBe("aáäbcdeêëéèfg");
    });

    test("ToLower_af_ZA2", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "af-ZA"
        });
        expect(mapper.map("HIÎÏÍJKLMNOÔÖÓPQRSTUÛÜÚVWXYZ")).toBe("hiîïíjklmnoôöópqrstuûüúvwxyz");
    });

    test("ToLowerMixed_af_ZA3", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "af-ZA"
        });
        expect(mapper.map("Hiî - ÏÍjkL")).toBe("hiî - ïíjkl");
    });


    test("ToLower_af_NA1", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "af-NA"
        });
        expect(mapper.map("AÁÄBCDEÊËÉÈFG")).toBe("aáäbcdeêëéèfg");
    });

    test("ToLower_af_NA2", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "af-NA"
        });
        expect(mapper.map("HIÎÏÍJKLMNOÔÖÓPQRSTUÛÜÚVWXYZ")).toBe("hiîïíjklmnoôöópqrstuûüúvwxyz");
    });

    test("ToLowerMixed_af_NA3", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "af-NA"
        });
        expect(mapper.map("Hiî - ÏÍjkL")).toBe("hiî - ïíjkl");
    });

    /*Hausa */
    test("ToLower_ha_GH1", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "ha-GH"
        });
        expect(mapper.map("ABƁCDƊEFGHIJKƘLMNORSTUWYƳZ")).toBe("abɓcdɗefghijkƙlmnorstuwyƴz");
    });

    test("ToLower_ha_NE1", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "ha-NE"
        });
         expect(mapper.map("ABƁCDƊEFGHIJKƘLMNORSTUWYƳZ")).toBe("abɓcdɗefghijkƙlmnorstuwyƴz");
    });

    test("ToLower_ha_NG1", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "tolower",
            locale: "ha-NG"
        });
         expect(mapper.map("ABƁCDƊEFGHIJKƘLMNORSTUWYƳZ")).toBe("abɓcdɗefghijkƙlmnorstuwyƴz");
    });

});
