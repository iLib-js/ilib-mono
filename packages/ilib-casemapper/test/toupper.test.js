/*
 * toupper.test.js - Test the upper-casing mapper
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

describe("testToUpper", function() {
    test("ToUpperFromLower_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper();
        expect(mapper.map("this is a string")).toBe("THIS IS A STRING");
    });

    test("ToUpperFromUpper_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper();
        expect(mapper.map("THIS IS A STRING")).toBe("THIS IS A STRING");
    });

    test("ToUpperFromMixed_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper();
        expect(mapper.map("This is a String")).toBe("THIS IS A STRING");
    });

    test("ToUpperFromLowerExplicitDirection_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "toupper"
        });
        expect(mapper.map("this is a string")).toBe("THIS IS A STRING");
    });

    test("ToUpperFromUpperExplicitDirection_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "toupper"
        });
        expect(mapper.map("THIS IS A STRING")).toBe("THIS IS A STRING");
    });

    test("ToUpperFromMixedExplicitDirection_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "toupper"
        });
        expect(mapper.map("This is a String")).toBe("THIS IS A STRING");
    });

    test("ToUpperFromPunctuationUnchanged_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper();
        expect(mapper.map("!@#$%^&*()")).toBe("!@#$%^&*()");
    });

    test("ToUpperFromNonLatinUnchanged_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper();
        expect(mapper.map("演蟻人 道格拉斯最老英雄")).toBe("演蟻人 道格拉斯最老英雄");
    });

    test("ToUpperFromExtendedLatin_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper();
        expect(mapper.map("ãéìôü")).toBe("ÃÉÌÔÜ");
    });

    test("ToUpperCyrillic_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper();
        expect(mapper.map("празл")).toBe("ПРАЗЛ");
    });

    test("ToUpperGreek_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper();
        expect(mapper.map("αβγδεζηθ")).toBe("ΑΒΓΔΕΖΗΘ");
    });

    test("ToUpperGreekSigma_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper();
        expect(mapper.map("ιασας ιασας")).toBe("ΙΑΣΑΣ ΙΑΣΑΣ");
    });

    test("ToUpperCoptic_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper();
        expect(mapper.map("ⲁⲃⲅⲇⲉⲋⲍⲏⲑⲓⲕⲗ")).toBe("ⲀⲂⲄⲆⲈⲊⲌⲎⲐⲒⲔⲖ");
    });

    test("ToUpperArmenian_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper();
        expect(mapper.map("աբգդեզէըթ")).toBe("ԱԲԳԴԵԶԷԸԹ");
    });

    test("ToUpperGeorgian_default", function() {
        expect.assertions(1);
        var mapper = new CaseMapper();
        expect(mapper.map("ⴀⴁⴂⴃⴄⴅⴆⴇⴈⴉ")).toBe("ႠႡႢႣႤႥႦႧႨႩ");
    });

    /* Azeri tests */
    test("ToUpper_az_AZ", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            locale: "az-AZ"
        });
        expect(mapper.map("ıi")).toBe("Iİ");
    });

    /* Turkish tests */
    test("ToUpper_tr_TR", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            locale: "tr-TR"
        });
        expect(mapper.map("ıi")).toBe("Iİ");
    });

    /* Crimean Tatar tests */
    test("ToUpper_crh_Latn_UK", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            locale: "crh-Latn-UK"
        });
        expect(mapper.map("ıi")).toBe("Iİ");
    });

    /* Kazakh tests */
    test("ToUpper_kk_Latn_KK", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            locale: "kk-Latn-KK"
        });
        expect(mapper.map("ıi")).toBe("Iİ");
    });

    /* Tatar tests */
    test("ToUpper_tt_Latn_RU", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            locale: "tt-Latn-RU"
        });
        expect(mapper.map("ıi")).toBe("Iİ");
    });

    /* Karachay-Balkar tests */
    test("ToUpper_krc_Latn_RU", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            locale: "krc-Latn-RU"
        });
        expect(mapper.map("ıi")).toBe("Iİ");
    });

    /* German tests */
    test("ToUpper_de_DE", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            locale: "de-DE"
        });
        expect(mapper.map("groß")).toBe("GROSS");
    });

    /* Russian tests */
    test("ToUpperLowerPalochka_ru_RU", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            locale: "ru-RU"
        });
        expect(mapper.map("ӏ")).toBe("Ӏ");
    });

    test("ToUpperUpperPalochka_ru_RU", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            locale: "ru-RU"
        });
        expect(mapper.map("Ӏ")).toBe("Ӏ");
    });

    /* Greek tests */
    test("ToUpper_el_GR", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            locale: "el-GR"
        });
        expect(mapper.map("ιασας ιασας")).toBe("ΙΑΣΑΣ ΙΑΣΑΣ");
    });

    test("ToUpperAccents_el_GR", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            locale: "el-GR"
        });
        expect(mapper.map("άέήίΰϊϋόύώΐ")).toBe("ΑΕΗΙΥΙΥΟΥΩΙ");
    });

    /* French tests */
    test("ToUpper_fr_FR", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            locale: "fr-FR"
        });
        expect(mapper.map("Tête-à-tête")).toBe("TÊTE-À-TÊTE");
    });

    /* French Canadian tests */
    test("ToUpper_fr_CA", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            locale: "fr-CA"
        });
        expect(mapper.map("Tête-à-tête")).toBe("TÊTE-À-TÊTE");
    });

    // make sure it is not broken in Lithuanian
    test("ToUpper_lt", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            locale: "lt-LT"
        });
        expect(mapper.map("aąbcčdeęėfghiįyjklmnoprsštuųūvzž")).toBe("AĄBCČDEĘĖFGHIĮYJKLMNOPRSŠTUŲŪVZŽ");
    });

    /*Afrikaans Test cases*/
    test("ToUpper_af_ZA1", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "toupper",
            locale: "af-ZA"
        });
        expect(mapper.map("aáäbcdeêëéèfg")).toBe("AÁÄBCDEÊËÉÈFG");
    });

    test("ToUpper_af_ZA2", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "toupper",
            locale: "af-ZA"
        });
        expect(mapper.map("hiîïíjklmnoôöópqrstuûüúvwxyz")).toBe("HIÎÏÍJKLMNOÔÖÓPQRSTUÛÜÚVWXYZ");
    });

    test("ToUpperMixed_af_ZA3", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "toupper",
            locale: "af-ZA"
        });
        expect(mapper.map("hiî - ïíjkl")).toBe("HIÎ - ÏÍJKL");
    });


    test("ToUpper_af_NA1", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "toupper",
            locale: "af-NA"
        });
        expect(mapper.map("aáäbcdeêëéèfg")).toBe("AÁÄBCDEÊËÉÈFG");
    });

    test("ToUpper_af_NA2", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "toupper",
            locale: "af-NA"
        });
        expect(mapper.map("hiîïíjklmnoôöópqrstuûüúvwxyz")).toBe("HIÎÏÍJKLMNOÔÖÓPQRSTUÛÜÚVWXYZ");
    });

    test("ToUpperMixed_af_NA3", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "toupper",
            locale: "af-NA"
        });
        expect(mapper.map("hiî - ïíjkl")).toBe("HIÎ - ÏÍJKL");
    });
    /*Hausa */
    test("ToUpper_ha_GH1", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "toupper",
            locale: "ha-GH"
        });
        expect(mapper.map("abɓcdɗefghijkƙlmnorstuwyƴz")).toBe("ABƁCDƊEFGHIJKƘLMNORSTUWYƳZ");
    });

    test("ToUpper_ha_NE1", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "toupper",
            locale: "ha-NE"
        });
        expect(mapper.map("abɓcdɗefghijkƙlmnorstuwyƴz")).toBe("ABƁCDƊEFGHIJKƘLMNORSTUWYƳZ");
    });

    test("ToUpper_ha_NG1", function() {
        expect.assertions(1);
        var mapper = new CaseMapper({
            direction: "toupper",
            locale: "ha-NG"
        });
        expect(mapper.map("abɓcdɗefghijkƙlmnorstuwyƴz")).toBe("ABƁCDƊEFGHIJKƘLMNORSTUWYƳZ");
    });
});
