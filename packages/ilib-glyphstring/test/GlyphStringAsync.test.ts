/*
 * GlyphStringAsync.test.ts - test the async glyph iteration routines
 *
 * Copyright © 2018, 2024, 2026 JEDLSoft
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

import GlyphString from "../src/index";

describe("testglyphstrasync", () => {
    test("GlyphStrAsyncCharIteratorNormal", () => {
        expect.assertions(8);
        // the A umlaut is a decomposed char
        return GlyphString.create("aÄa").then((s) => {
            const it = s.charIterator();

            expect(it.hasNext()).toBeTruthy();
            expect(it.next()).toBe("a");
            expect(it.hasNext()).toBeTruthy();
            expect(it.next()).toBe("Ä");
            expect(it.hasNext()).toBeTruthy();
            expect(it.next()).toBe("a");
            expect(!it.hasNext()).toBeTruthy();
            expect(it.next()).toBe(undefined);
        });
    });
    test("GlyphStrAsyncCharIteratorEmpty", () => {
        expect.assertions(2);
        return GlyphString.create("").then((s) => {
            const it = s.charIterator();

            expect(!it.hasNext()).toBeTruthy();
            expect(it.next()).toBe(undefined);
        });
    });
    test("GlyphStrAsyncCharIteratorMultipleDecomposed", () => {
        expect.assertions(8);
        // the accented A is a decomposed char with 2 accents
        return GlyphString.create("aẬa").then((s) => {
            const it = s.charIterator();

            expect(it.hasNext()).toBeTruthy();
            expect(it.next()).toBe("a");
            expect(it.hasNext()).toBeTruthy();
            expect(it.next()).toBe("Ậ");
            expect(it.hasNext()).toBeTruthy();
            expect(it.next()).toBe("a");
            expect(!it.hasNext()).toBeTruthy();
            expect(it.next()).toBe(undefined);
        });
    });
    test("GlyphStrAsyncTruncateWithCombiningAccentsWholeGlyphs", () => {
        expect.assertions(1);
        // the accented A is a decomposed char with 2 accents
        return GlyphString.create("aẬbẬcẬdẬe").then((s) => {
            expect(s.truncate(4)).toBe("aẬbẬ");
        });
    });
    test("GlyphStrAsyncTruncateThai", () => {
        expect.assertions(1);
        return GlyphString.create("สวัุสดีคุณเป็นอย่างไรบ้าง").then((s) => {
            // this tests non-spacing marks that are also non-combining
            expect(s.truncate(4)).toBe("สวัุสดี");
        });
    });
    test("GlyphStrAsyncTruncateDevanagari1", () => {
        expect.assertions(1);
        return GlyphString.create("हैलो, आप कैसे हैं?").then((s) => {
            // if the 2nd base character has combining spacing accents on it,
            // then it will not fit in the two spaces available, so the base
            // and all its combining spacing accents have to be removed.
            expect(s.truncate(2)).toBe("है");
        });
    });
    test("GlyphStrAsyncEllipsizeDevanagari2", () => {
        expect.assertions(1);
        return GlyphString.create("हैलो, आप कैसे हैं?").then((s) => {
            expect(s.ellipsize(8)).toBe("हैलो, आप …");
        });
    });
    test("GlyphStrAsyncEllipsizeJapanese", () => {
        expect.assertions(1);
        return GlyphString.create("ェドイン").then((s) => {
            expect(s.ellipsize(3)).toBe("ェド…");
        });
    });
});
