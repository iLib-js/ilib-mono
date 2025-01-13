/*
 * normasync.test.js - test the Unicode Normalization Algorithm routines
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

import NormString from "../src/NormString.js";

function toHexString(string) {
    let i, result = "";

    if (!string) {
        return "";
    }
    for (i = 0; i < string.length; i++) {
        const ch = string.charCodeAt(i).toString(16);
        result += "0000".substring(0, 4-ch.length) + ch;
        if (i < string.length - 1) {
            result += " ";
        }
    }
    return result.toUpperCase();
}


describe("testnormasync", () => {
    test("NormStringAsyncNormalizeNFD", () => {
        expect.assertions(1);

        new NormString("ᄀ각ᆨ", {
            sync: false,
            onLoad: str => {
                expect(str.normalize("nfd").toString()).toBe("ᄀ각ᆨ");
            }
        });
    });

    test("NormStringAsyncNormalizeNFKD", () => {
        expect.assertions(1);
        new NormString("ᄀ각ᆨ", {
            sync: false,
            onLoad: str => {
                expect(str.normalize("nfkd").toString()).toBe("ᄀ각ᆨ");
            }
        });
    });

    test("NormStringAsyncNormalizeNFC", () => {
        expect.assertions(1);
        new NormString("ᄀ각ᆨ", {
            sync: false,
            onLoad: str => {
                expect(str.normalize("nfc").toString()).toBe("ᄀ각ᆨ");
            }
        });
    });

    test("NormStringAsyncNormalizeNFKC", () => {
        expect.assertions(1);
        new NormString("ᄀ각ᆨ", {
            sync: false,
            onLoad: str => {
                expect(str.normalize("nfkc").toString()).toBe("ᄀ각ᆨ");
            }
        });
    });

    test("NormStringAsyncCharIteratorDecomposed", () => {
        expect.assertions(8);
        const s = new NormString("aÄa", { // the A umlaut is a decomposed char
            sync: false,
            onLoad: str => {
                const it = str.charIterator();

                expect(it.hasNext()).toBeTruthy();
                expect(it.next()).toBe("a");
                expect(it.hasNext()).toBeTruthy();
                expect(it.next()).toBe("Ä");
                expect(it.hasNext()).toBeTruthy();
                expect(it.next()).toBe("a");
                expect(!it.hasNext()).toBeTruthy();
                expect(it.next()).toBe(undefined);
            }
        });
    });
});
