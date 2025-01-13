/*
 * alphaindexasync.test.js - test the Alphabetic Index class asynchronously
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

import AlphabeticIndex from "../src/AlphabeticIndex.js";

describe("testalphaindexasync", () => {
    test("AlphaIndexAsyncConstructor", () => {
        expect.assertions(1);
        new AlphabeticIndex({
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();
            }
        });
    });

    test("AlphaIndexAsyncConstructorWithParams", () => {
        expect.assertions(1);
        new AlphabeticIndex({
            locale: "en-US",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();
            }
        });
    });

    test("AlphaIndexAsyncgetDefaultIndexStyle", () => {
        expect.assertions(2);
        new AlphabeticIndex({
            locale: "en-US",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();
                expect("latin").toBe(ai.getIndexStyle());
            }
        });
    });

    test("AlphaIndexAsyncConstructorWithUnknownLocale", () => {
        expect.assertions(1);
        new AlphabeticIndex({
            locale: "qq-QQ",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();
            }
        });
    });

    test("AlphaIndexAsyncENUSGetBucket", () => {
        expect.assertions(3);

        new AlphabeticIndex({
            locale: "en-US",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();
                expect("B").toBe(ai.getBucket("belarus"));
                expect("B").toBe(ai.getBucket("Belarus"));
            }
        });
    });

    test("AlphaIndexAsyncENUSGetBucket2", () => {
        expect.assertions(3);

        new AlphabeticIndex({
            locale: "en-US",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();

                expect("E").toBe(ai.getBucket("Élan"));
                expect("E").toBe(ai.getBucket("ëieasdf"));
            }
        });
    });

    test("AlphaIndexAsyncENUSGetAllBuckets", () => {
        expect.assertions(2);

        new AlphabeticIndex({
            locale: "en-US",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();

                const items = [
                    "omicron",
                    "beta",
                    "epsilon",
                    "echo",
                    "nu",
                    "iota",
                    "delta",
                    "alpha",
                    "zeta",
                    "Bravo",
                    "eta",
                    "india",
                    "mu",
                    "gamma"
                    ];

                items.forEach(item => {
                    ai.addElement(item);
                });

                const expected = [
                    {
                        label: "A",
                        elements: ["alpha"]
                    },
                    {
                        label: "B",
                        elements: ["beta", "Bravo"]
                    },
                    {
                        label: "D",
                        elements: ["delta"]
                    },
                    {
                        label: "E",
                        elements: ["echo", "epsilon", "eta"]
                    },
                    {
                        label: "G",
                        elements: ["gamma"]
                    },
                    {
                        label: "I",
                        elements: ["india", "iota"]
                    },
                    {
                        label: "M",
                        elements: ["mu"]
                    },
                    {
                        label: "N",
                        elements: ["nu"]
                    },
                    {
                        label: "O",
                        elements: ["omicron"]
                    },
                    {
                        label: "Z",
                        elements: ["zeta"]
                    }
                    ]

                expect(ai.getAllBuckets()).toStrictEqual(expected);
            }
        });
    });

    test("AlphaIndexAsyncENUSGetBucketLabels", () => {
        expect.assertions(2);

        new AlphabeticIndex({
            locale: "en-US",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();

                const items = [
                    "omicron",
                    "beta",
                    "echo",
                    "nu",
                    "iota",
                    "delta",
                    "alpha",
                    "lambda",
                    "alpha", // doubled
                    "theta",
                    "kappa",
                    "chi",
                    "phi",
                    "zeta",
                    "bravo",
                    "epsilon",
                    "eta",
                    "india",
                    "mu",
                    "gamma"
                    ];

                items.forEach(item => {
                    ai.addElement(item);
                });

                const expected = [
                    "A",
                    "B",
                    "C",
                    "D",
                    "E",
                    "G",
                    "I",
                    "K",
                    "L",
                    "M",
                    "N",
                    "O",
                    "P",
                    "T",
                    "Z"
                    ];

                expect(ai.getBucketLabels()).toStrictEqual(expected);
            }
        });

    });

    test("AlphaIndexAsyncUnknowLocaleActsLikeEnglish", () => {
        expect.assertions(2);

        new AlphabeticIndex({
            locale: "qq-QQ",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();

                const items = [
                    "omicron",
                    "beta",
                    "echo",
                    "nu",
                    "iota",
                    "delta",
                    "alpha",
                    "zeta",
                    "bravo",
                    "epsilon",
                    "eta",
                    "india",
                    "mu",
                    "gamma",
                    "ürgen"
                    ];

                items.forEach(item => {
                    ai.addElement(item);
                });

                const expected = [
                    {
                        label: "A",
                        elements: ["alpha"]
                    },
                    {
                        label: "B",
                        elements:["beta", "bravo"]
                    },
                    {
                        label: "D",
                        elements: ["delta"]
                    },
                    {
                        label: "E",
                        elements: ["echo", "epsilon", "eta"]
                    },
                    {
                        label: "G",
                        elements: ["gamma"]
                    },
                    {
                        label: "I",
                        elements: ["india", "iota"]
                    },
                    {
                        label: "M",
                        elements: ["mu"]
                    },
                    {
                        label: "N",
                        elements: ["nu"]
                    },
                    {
                        label: "O",
                        elements: ["omicron"]
                    },
                    {
                        label: "U",
                        elements: ["ürgen"]
                    },
                    {
                        label: "Z",
                        elements: ["zeta"]
                    }
                    ]

                expect(ai.getAllBuckets()).toStrictEqual(expected);
            }
        });
    });

    test("AlphaIndexAsyncConstructorAsync_deDE", () => {
        expect.assertions(1);
        const ai = new AlphabeticIndex({
            locale: "de-DE",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();
            }
        });
    });

    test("AlphaIndexAsyncGetBucket_deDE2", () => {
        expect.assertions(7);

        const ai = new AlphabeticIndex({
            locale: "de-DE",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();

                expect("U").toBe(ai.getBucket("über"));
                expect("A").toBe(ai.getBucket("änderen"));
                expect("O").toBe(ai.getBucket("öffenen"));

                expect("U").toBe(ai.getBucket("Über"));
                expect("A").toBe(ai.getBucket("Änderen"));
                expect("O").toBe(ai.getBucket("Öffenen"));
            }
        });
    });

    test("AlphaIndexAsyncGetBucketAccentInsensitiveSZ_deDE", () => {
        expect.assertions(2);

        const ai = new AlphabeticIndex({
            locale: "de-DE",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();
                // no words start with sz, but handle this just in case
                expect("S").toBe(ai.getBucket("ß"));
            }
        });
    });

    test("AlphaIndexAsyncDEDEPhonebookStyle", () => {
        expect.assertions(2);

        const ai = new AlphabeticIndex({
            locale: "de-DE",
            style: "phonebook",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();

                const items = [
                    "Jürgen",
                    "Georg",
                    "Matthias",
                    "Heinz",
                    "Uelrich",
                    "Fritz",
                    "Hermann",
                    "Josef",
                    "Karl",
                    "Heinrich",
                    "Ülrich",
                    "Ulrich",
                    "Julia",
                    "Juan",
                    "Udrich",
                    "Juergen",
                    "Ualrich",
                    "Judrich"
                    ];

                items.forEach(item => {
                    ai.addElement(item);
                });

                const expected = [
                    {
                        label: "F",
                        elements: ["Fritz"]
                    },
                    {
                        label: "G",
                        elements: ["Georg"]
                    },
                    {
                        label: "H",
                        elements: ["Heinrich", "Heinz", "Hermann"]
                    },
                    {
                        label: "J",
                        elements: ["Josef", "Juan", "Judrich", "Juergen", "Julia", "Jürgen"]
                    },
                    {
                        label: "K",
                        elements: ["Karl"]
                    },
                    {
                        label: "M",
                        elements: ["Matthias"]
                    },
                    {
                        label: "U",
                        elements: ["Ualrich", "Udrich", "Uelrich", "Ülrich", "Ulrich"]
                    }
                    ];

                expect(ai.getAllBuckets()).toStrictEqual(expected);
            }
        });

    });

    test("AlphaIndexAsyncDEDEDictionaryStyle", () => {
        expect.assertions(2);

        const ai = new AlphabeticIndex({
            locale: "de-DE",
            style: "dictionary",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();

                const items = [
                    "Jürgen",
                    "Georg",
                    "Matthias",
                    "Heinz",
                    "Uelrich",
                    "Fritz",
                    "Hermann",
                    "Josef",
                    "Karl",
                    "Heinrich",
                    "Ülrich",
                    "Ulrich",
                    "Julia",
                    "Juan",
                    "Udrich",
                    "Juergen",
                    "Ualrich",
                    "Judrich"
                    ];

                items.forEach(item => {
                    ai.addElement(item);
                });

                const expected = [
                    {
                        label: "F",
                        elements: ["Fritz"]
                    },
                    {
                        label: "G",
                        elements: ["Georg"]
                    },
                    {
                        label: "H",
                        elements: ["Heinrich", "Heinz", "Hermann"]
                    },
                    {
                        label: "J",
                        elements: ["Josef", "Juan", "Judrich", "Juergen", "Julia", "Jürgen"]
                    },
                    {
                        label: "K",
                        elements: ["Karl"]
                    },
                    {
                        label: "M",
                        elements: ["Matthias"]
                    },
                    {
                        label: "U",
                        elements: ["Ualrich", "Udrich", "Uelrich", "Ülrich", "Ulrich"]
                    }
                    ];

                expect(ai.getAllBuckets()).toStrictEqual(expected);
            }
        });
    });

    test("AlphaIndexAsyncConstructorAsync", () => {
        expect.assertions(1);
        const ai = new AlphabeticIndex({
            locale: "ko-KR",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();
            }
        });
    });

    test("AlphaIndexAsyncKOKRMixedScriptTest1", () => {
        expect.assertions(2);

        const ai = new AlphabeticIndex({
            locale: "ko-KR",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();

                const items = [
                    "Apple",
                    "Banana",
                    "김철수",
                    "김영희",
                    "송현경",
                    "이영자",
                    "정경자",
                    "정미경",
                    "서수빈",
                    "최준호",
                    "진현주",
                    "예지원",
                    "장유진",
                    "성수민",
                    "민예은",
                    "하춘자",
                    "강성진",
                    "임성훈",
                    "장은경",
                    "임민성",
                    "주광수",
                    "박세진"
                    ];

                items.forEach(item => {
                    ai.addElement(item);
                });

                const expected = [
                    {
                        label: "ㄱ",
                        elements: ["강성진","김영희","김철수"]
                    },
                    {
                        label: "ㅁ",
                        elements: ["민예은"]
                    },
                    {
                        label: "ㅂ",
                        elements: ["박세진"]
                    },
                    {
                        label: "ㅅ",
                        elements: ["서수빈", "성수민", "송현경"]
                    },
                    {
                        label: "ㅇ",
                        elements: ["예지원","이영자", "임민성", "임성훈"]
                    },
                    {
                        label: "ㅈ",
                        elements: ["장유진", "장은경","정경자", "정미경", "주광수","진현주"]
                    },
                    {
                        label: "ㅊ",
                        elements: ["최준호"]
                    },
                    {
                        label: "ㅎ",
                        elements: ["하춘자"]
                    },
                    {
                        label: "A",
                        elements: ["Apple"]
                    },
                    {
                        label: "B",
                        elements: ["Banana"]
                    }
                    ]

                expect(ai.getAllBuckets()).toStrictEqual(expected);
            }
        });

    });

    test("AlphaIndexAsyncKOKRMixedScriptTest2", () => {
        expect.assertions(2);

        const ai = new AlphabeticIndex({
            locale: "ko-KR",
            sync: false,
            onLoad: ai => {
                expect(ai).toBeTruthy();

                const items = [
                    "Apple",
                    "Banana",
                    "김철수",
                    "りんご",
                    "서수빈",
                    "최준호",
                    "예지원",
                    "장유진",
                    "성수민",
                    "민예은",
                    "하춘자",
                    "강성진",
                    "장은경",
                    "임민성",
                    "박세진"
                    ];

                items.forEach(item => {
                    ai.addElement(item);
                });

                const expected = [
                    {
                        label: "ㄱ",
                        elements: ["강성진", "김철수"]
                    },
                    {
                        label: "ㅁ",
                        elements: ["민예은"]
                    },
                    {
                        label: "ㅂ",
                        elements: ["박세진"]
                    },
                    {
                        label: "ㅅ",
                        elements: ["서수빈", "성수민"]
                    },
                    {
                        label: "ㅇ",
                        elements: ["예지원", "임민성"]
                    },
                    {
                        label: "ㅈ",
                        elements: ["장유진", "장은경"]
                    },
                    {
                        label: "ㅊ",
                        elements: ["최준호"]
                    },
                    {
                        label: "ㅎ",
                        elements: ["하춘자"]
                    },
                    {
                        label: "A",
                        elements: ["Apple"]
                    },
                    {
                        label: "B",
                        elements: ["Banana"]
                    },
                    {
                        label: "#",
                        elements: ["りんご"]
                    }
                    ];

                expect(ai.getAllBuckets()).toStrictEqual(expected);
            }
        });
    });
});