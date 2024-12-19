/*
 * collationpromise.test.js - test the Collator object asynchronously
 *
 * Copyright © 2018, 2022, 2024 JEDLSoft
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
import Collator from "../src/Collator.js";

describe("testcollationpromise", () => {
    test("CollatorAsyncConstructorNative", () => {
        expect.assertions(1);
        return Collator.create({
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();
        });

    });

    test("CollatorAsyncDefaultNative", () => {
        expect.assertions(5);
        return Collator.create({
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();

            // should compare in English
            expect(col.compare("string", "string")).toBe(0);
            expect(col.compare("a", "b") < 0).toBeTruthy();
            expect(col.compare("b", "c") < 0).toBeTruthy();
            expect(col.compare("c", "z") < 0).toBeTruthy();
        });

    });

    test("CollatorAsyncDefaultCase", () => {
        expect.assertions(5);
        return Collator.create({
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();
            // netscape and ie do not work properly on some platforms
            const browser = ilib._getBrowser();
            if ((browser === "firefox" &&
                navigator &&
                navigator.userAgent &&
                navigator.userAgent.indexOf("Android")) ||
                browser === "ie" || browser === "Edge" || browser === "iOS") {
                // should compare lower-case first within a base character
                expect(col.compare("a", "A") < 0).toBeTruthy();
                expect(col.compare("b", "B") < 0).toBeTruthy();
                expect(col.compare("a", "Z") < 0).toBeTruthy();
                expect(col.compare("a", "Á") < 0).toBeTruthy();
            } else {
                // should compare upper-case first within a base character
                expect(col.compare("A", "a") < 0).toBeTruthy();
                expect(col.compare("B", "b") < 0).toBeTruthy();
                expect(col.compare("a", "Z") < 0).toBeTruthy();
                expect(col.compare("A", "a") < 0).toBeTruthy(); // accent is more important than case
            }
        });
    });

    test("CollatorAsyncGetComparator", () => {
        expect.assertions(3);
        return Collator.create({
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();

            // should compare in English
            const func = col.getComparator();
            expect(typeof(func) !== "undefined").toBeTruthy();
            expect(typeof(func)).toBe("function");
        });
    });


    test("CollatorAsyncConstructorJS", () => {
        expect.assertions(1);
        return Collator.create({
            useNative: false,
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();
        });

    });

    test("CollatorAsyncDefaultJS", () => {
        expect.assertions(5);
        return Collator.create({
            useNative: false,
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();

            // should compare in English
            expect(col.compare("string", "string")).toBe(0);
            expect(col.compare("a", "b") < 0).toBeTruthy();
            expect(col.compare("b", "c") < 0).toBeTruthy();
            expect(col.compare("c", "z") < 0).toBeTruthy();
        });

    });


    test("CollatorAsyncGetComparatorWorksWithCaseJS", () => {
        expect.assertions(6);
        return Collator.create({
            useNative: false,
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();

            const func = col.getComparator();
            expect(typeof(func) !== "undefined").toBeTruthy();

            // should compare upper-case first
            expect(func("A", "a") < 0).toBeTruthy();
            expect(func("B", "b") < 0).toBeTruthy();
            expect(func("a", "Z") < 0).toBeTruthy();
            expect(func("A", "a") < 0).toBeTruthy();
        });

    });


    test("CollatorAsyncGetSortKeyNative", () => {
        if (typeof(Intl) === 'undefined' && Intl) {
            return;
        }
        return Collator.create({
            sync: false
        }).then(col => {
            expect.assertions(2);
            expect(typeof(col) !== "undefined").toBeTruthy();

            // no sort key available when using native...
            expect(col.sortKey("string")).toBe("string");
        });

    });

    test("CollatorAsyncGetSortKeySimpleUpper", () => {
        expect.assertions(2);
        return Collator.create({
            useNative: false,
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();

            expect(col.sortKey("ABCDEF")).toBe("4204404604804a04c0");
        });

    });

    test("CollatorAsyncGetSortKeyMixed", () => {
        expect.assertions(2);
        return Collator.create({
            useNative: false,
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();

            expect(col.sortKey("String")).toBe("6606826425225c24e2");
        });

    });

    test("CollatorAsyncWithSort", () => {
        expect.assertions(2);
        return Collator.create({
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();

            const input = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];

            input.sort(col.getComparator());

            const expected = ["e", "i", "o", "p", "q", "r", "t", "u", "w", "y"];

            expect(input).toStrictEqual(expected);
        });
    });

    test("CollatorAsyncWithSortJS", () => {
        expect.assertions(2);
        return Collator.create({
            useNative: false,
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();

            const input = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];

            input.sort(col.getComparator());

            const expected = ["e", "i", "o", "p", "q", "r", "t", "u", "w", "y"];

            expect(input).toStrictEqual(expected);
        });
    });

    test("CollatorAsyncWithSortUpperFirstJS", () => {
        expect.assertions(2);
        return Collator.create({
            upperFirst: true,
            useNative: false,
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();

            const input = ["q", "I", "e", "r", "T", "U", "i", "E", "o", "p"];

            input.sort(col.getComparator());

            const expected = ["E", "e", "I", "i", "o", "p", "q", "r", "T", "U"];

            expect(input).toStrictEqual(expected);
        });
    });

    test("CollatorAsyncGetAvailableScripts", () => {
        expect.assertions(1);
        expect(Collator.getAvailableScripts()).toStrictEqual(["Latn"]);
    });

    test("CollatorAsyncGetAvailableStyles", () => {
        expect.assertions(1);
        expect(Collator.getAvailableStyles()).toStrictEqual(["standard"]);
    });

    test("CollatorAsyncPhonebookQuatAE_de", () => {
        expect.assertions(5);
        return Collator.create({
            locale: "de-DE",
            useNative: false,
            sensitivity: "quaternary",
            style: "phonebook",
            usage: "search",
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();

            // aa ae äa äz af
            expect(col.compare("aa", "ae") < 0).toBeTruthy();
            expect(col.compare("ae", "äa") < 0).toBeTruthy();
            expect(col.compare("äa", "äz") < 0).toBeTruthy();
            expect(col.compare("äz", "af") < 0).toBeTruthy();
        });

    });

    test("CollatorAsyncQuat_el", () => {
        expect.assertions(91);
        return Collator.create({
            locale: "el-GR",
            useNative: false,
            sensitivity: "quaternary",
            usage: "search",
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();

            // Α α Ά Ά ά ά Β β Γ γ Δ δ Ε ε Έ Έ έ έ Ζ ζ Η η Ή Ή ή ή Θ θ Ι ι Ί Ί ί ί Ϊ Ϊ ϊ ϊ ΐ ΐ ί̈ Κ κ Λ λ Μ μ Ν ν Ξ ξ Ο ο Ό Ό ό ό Π π Ρ ρ Σ σ ς Τ τ Υ υ Ύ Ύ ύ ύ Ϋ Ϋ ϋ ϋ ΰ ΰ ύ̈ Φ φ Χ χ Ψ ψ Ω ω Ώ Ώ ώ ώ

            expect(col.compare("Α", "α") < 0).toBeTruthy();
            expect(col.compare("α", "Ά") < 0).toBeTruthy();
            expect(col.compare("Ά", "Ά") < 0).toBeTruthy();
            expect(col.compare("Ά", "ά") < 0).toBeTruthy();
            expect(col.compare("ά", "ά") < 0).toBeTruthy();
            expect(col.compare("ά", "Β") < 0).toBeTruthy();
            expect(col.compare("Β", "β") < 0).toBeTruthy();
            expect(col.compare("β", "Γ") < 0).toBeTruthy();
            expect(col.compare("Γ", "γ") < 0).toBeTruthy();
            expect(col.compare("γ", "Δ") < 0).toBeTruthy();
            expect(col.compare("Δ", "δ") < 0).toBeTruthy();
            expect(col.compare("δ", "Ε") < 0).toBeTruthy();
            expect(col.compare("Ε", "ε") < 0).toBeTruthy();
            expect(col.compare("ε", "Έ") < 0).toBeTruthy();
            expect(col.compare("Έ", "Έ") < 0).toBeTruthy();
            expect(col.compare("Έ", "έ") < 0).toBeTruthy();
            expect(col.compare("έ", "έ") < 0).toBeTruthy();
            expect(col.compare("έ", "Ζ") < 0).toBeTruthy();
            expect(col.compare("Ζ", "ζ") < 0).toBeTruthy();
            expect(col.compare("ζ", "Η") < 0).toBeTruthy();
            expect(col.compare("Η", "η") < 0).toBeTruthy();
            expect(col.compare("η", "Ή") < 0).toBeTruthy();
            expect(col.compare("Ή", "Ή") < 0).toBeTruthy();
            expect(col.compare("Ή", "ή") < 0).toBeTruthy();
            expect(col.compare("ή", "ή") < 0).toBeTruthy();
            expect(col.compare("ή", "Θ") < 0).toBeTruthy();
            expect(col.compare("Θ", "θ") < 0).toBeTruthy();
            expect(col.compare("θ", "Ι") < 0).toBeTruthy();
            expect(col.compare("Ι", "ι") < 0).toBeTruthy();
            expect(col.compare("ι", "Ί") < 0).toBeTruthy();
            expect(col.compare("Ί", "Ί") < 0).toBeTruthy();
            expect(col.compare("Ί", "ί") < 0).toBeTruthy();
            expect(col.compare("ί", "ί") < 0).toBeTruthy();
            expect(col.compare("ί", "Ϊ") < 0).toBeTruthy();
            expect(col.compare("Ϊ", "Ϊ") < 0).toBeTruthy();
            expect(col.compare("Ϊ", "ϊ") < 0).toBeTruthy();
            expect(col.compare("ϊ", "ϊ") < 0).toBeTruthy();
            expect(col.compare("ϊ", "ΐ") < 0).toBeTruthy();
            expect(col.compare("ΐ", "ΐ") < 0).toBeTruthy();
            expect(col.compare("ΐ", "ί̈") < 0).toBeTruthy();
            expect(col.compare("ί̈", "Κ") < 0).toBeTruthy();
            expect(col.compare("Κ", "κ") < 0).toBeTruthy();
            expect(col.compare("κ", "Λ") < 0).toBeTruthy();
            expect(col.compare("Λ", "λ") < 0).toBeTruthy();
            expect(col.compare("λ", "Μ") < 0).toBeTruthy();
            expect(col.compare("Μ", "μ") < 0).toBeTruthy();
            expect(col.compare("μ", "Ν") < 0).toBeTruthy();
            expect(col.compare("Ν", "ν") < 0).toBeTruthy();
            expect(col.compare("ν", "Ξ") < 0).toBeTruthy();
            expect(col.compare("Ξ", "ξ") < 0).toBeTruthy();
            expect(col.compare("ξ", "Ο") < 0).toBeTruthy();
            expect(col.compare("Ο", "ο") < 0).toBeTruthy();
            expect(col.compare("ο", "Ό") < 0).toBeTruthy();
            expect(col.compare("Ό", "Ό") < 0).toBeTruthy();
            expect(col.compare("Ό", "ό") < 0).toBeTruthy();
            expect(col.compare("ό", "ό") < 0).toBeTruthy();
            expect(col.compare("ό", "Π") < 0).toBeTruthy();
            expect(col.compare("Π", "π") < 0).toBeTruthy();
            expect(col.compare("π", "Ρ") < 0).toBeTruthy();
            expect(col.compare("Ρ", "ρ") < 0).toBeTruthy();
            expect(col.compare("ρ", "Σ") < 0).toBeTruthy();
            expect(col.compare("Σ", "σ") < 0).toBeTruthy();
            expect(col.compare("σ", "ς") < 0).toBeTruthy();
            expect(col.compare("ς", "Τ") < 0).toBeTruthy();
            expect(col.compare("Τ", "τ") < 0).toBeTruthy();
            expect(col.compare("τ", "Υ") < 0).toBeTruthy();
            expect(col.compare("Υ", "υ") < 0).toBeTruthy();
            expect(col.compare("υ", "Ύ") < 0).toBeTruthy();
            expect(col.compare("Ύ", "Ύ") < 0).toBeTruthy();
            expect(col.compare("Ύ", "ύ") < 0).toBeTruthy();
            expect(col.compare("ύ", "ύ") < 0).toBeTruthy();
            expect(col.compare("ύ", "Ϋ") < 0).toBeTruthy();
            expect(col.compare("Ϋ", "Ϋ") < 0).toBeTruthy();
            expect(col.compare("Ϋ", "ϋ") < 0).toBeTruthy();
            expect(col.compare("ϋ", "ϋ") < 0).toBeTruthy();
            expect(col.compare("ϋ", "ΰ") < 0).toBeTruthy();
            expect(col.compare("ΰ", "ΰ") < 0).toBeTruthy();
            expect(col.compare("ΰ", "ύ̈") < 0).toBeTruthy();
            expect(col.compare("ύ̈", "Φ") < 0).toBeTruthy();
            expect(col.compare("Φ", "φ") < 0).toBeTruthy();
            expect(col.compare("φ", "Χ") < 0).toBeTruthy();
            expect(col.compare("Χ", "χ") < 0).toBeTruthy();
            expect(col.compare("χ", "Ψ") < 0).toBeTruthy();
            expect(col.compare("Ψ", "ψ") < 0).toBeTruthy();
            expect(col.compare("ψ", "Ω") < 0).toBeTruthy();
            expect(col.compare("Ω", "ω") < 0).toBeTruthy();
            expect(col.compare("ω", "Ώ") < 0).toBeTruthy();
            expect(col.compare("Ώ", "Ώ") < 0).toBeTruthy();
            expect(col.compare("Ώ", "ώ") < 0).toBeTruthy();
            expect(col.compare("ώ", "ώ") < 0).toBeTruthy();
        });

    });

    test("CollatorAsyncPriL_ko", () => {
        expect.assertions(5);
        return Collator.create({
            locale: "ko-KR",
            useNative: false,
            sensitivity: "primary",
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();

            // 가까나다따
            expect(col.compare("가", "까") < 0).toBeTruthy();
            expect(col.compare("까", "나") < 0).toBeTruthy();
            expect(col.compare("나", "다") < 0).toBeTruthy();
            expect(col.compare("다", "따") < 0).toBeTruthy();
        });

    });

    test("CollatorAsyncQuatHanzi_zh_Hans", () => {
        expect.assertions(21);
        return Collator.create({
            locale: "zh-Hans-CN",
            useNative: false,
            sensitivity: "quaternary",
            usage: "search",
            sync: false
        }).then(col => {
            // Hanzi are all primary differences from each other

            expect(typeof(col) !== "undefined").toBeTruthy();

            expect(col.compare("阿", "拜") < 0).toBeTruthy();
            expect(col.compare("拜", "𩑻") < 0).toBeTruthy();
            expect(col.compare("𩑻", "䯋") < 0).toBeTruthy();
            expect(col.compare("䯋", "𧀱") < 0).toBeTruthy();
            expect(col.compare("𧀱", "捶") < 0).toBeTruthy();
            expect(col.compare("捶", "峒") < 0).toBeTruthy();
            expect(col.compare("峒", "㶥") < 0).toBeTruthy();
            expect(col.compare("㶥", "㜳") < 0).toBeTruthy();
            expect(col.compare("㜳", "䌸") < 0).toBeTruthy();
            expect(col.compare("䌸", "䢧") < 0).toBeTruthy();
            expect(col.compare("䢧", "苜") < 0).toBeTruthy();
            expect(col.compare("苜", "肶") < 0).toBeTruthy();
            expect(col.compare("肶", "埁") < 0).toBeTruthy();
            expect(col.compare("埁", "泩") < 0).toBeTruthy();
            expect(col.compare("泩", "窱") < 0).toBeTruthy();
            expect(col.compare("窱", "扤") < 0).toBeTruthy();
            expect(col.compare("扤", "辥") < 0).toBeTruthy();
            expect(col.compare("辥", "䓰") < 0).toBeTruthy();
            expect(col.compare("䓰", "赵") < 0).toBeTruthy();
            expect(col.compare("赵", "蓙") < 0).toBeTruthy();
        });

    });

    test("CollatorAsyncTraditionalQuatCH_es", () => {
        expect.assertions(6);
        return Collator.create({
            locale: "es-ES",
            useNative: false,
            sensitivity: "quaternary",
            style: "traditional",
            sync: false
        }).then(col => {
            expect(typeof(col) !== "undefined").toBeTruthy();

            // a b c ch d
            expect(col.compare("a", "b") < 0).toBeTruthy();
            expect(col.compare("b", "c") < 0).toBeTruthy();
            expect(col.compare("ca", "ch") < 0).toBeTruthy();
            expect(col.compare("cz", "ch") < 0).toBeTruthy();
            expect(col.compare("ch", "d") < 0).toBeTruthy();
        });
    });
});