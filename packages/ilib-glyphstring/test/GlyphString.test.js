/*
 * GlyphString.test.js - test the glyph iteration routines
 *
 * Copyright © 2014-2015, 2017, 2024 JEDLSoft
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

import GlyphString from "../src/index.js";

describe("testglyphstr", () => {
    test("CharIteratorNormal", () => {
        expect.assertions(8);
        const s = new GlyphString("aba");
        const it = s.charIterator();

        expect(it.hasNext()).toBeTruthy();
        expect(it.next()).toBe("a");
        expect(it.hasNext()).toBeTruthy();
        expect(it.next()).toBe("b");
        expect(it.hasNext()).toBeTruthy();
        expect(it.next()).toBe("a");
        expect(!it.hasNext()).toBeTruthy();
        expect(it.next()).toBe(undefined);
    });
    test("CharIteratorDecomposed", () => {
        expect.assertions(8);
        const s = new GlyphString("aÄa"); // the A umlaut is a decomposed char
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
    test("CharIteratorEmpty", () => {
        expect.assertions(2);
        const s = new GlyphString("");
        const it = s.charIterator();

        expect(!it.hasNext()).toBeTruthy();
        expect(it.next()).toBe(undefined);
    });
    test("CharIteratorWithSurrogates", () => {
        expect.assertions(10);
        const str = new GlyphString("a\uD800\uDF02b\uD800\uDC00");

        const it = str.charIterator();
        expect(it.hasNext()).toBeTruthy();
        expect(it.next()).toBe("a");
        expect(it.hasNext()).toBeTruthy();
        expect(it.next()).toBe("\uD800\uDF02");
        expect(it.hasNext()).toBeTruthy();
        expect(it.next()).toBe("b");
        expect(it.hasNext()).toBeTruthy();
        expect(it.next()).toBe("\uD800\uDC00");
        expect(!it.hasNext()).toBeTruthy();
        expect(it.next()).toBe(undefined);
    });
    test("CharIteratorWithSurrogatesAndDecomposedChars", () => {
        expect.assertions(12);
        const str = new GlyphString("a\uD800\uDF02bï\uD800\uDC00"); // the ï is a decomposed i + umlaut

        const it = str.charIterator();
        expect(it.hasNext()).toBeTruthy();
        expect(it.next()).toBe("a");
        expect(it.hasNext()).toBeTruthy();
        expect(it.next()).toBe("\uD800\uDF02");
        expect(it.hasNext()).toBeTruthy();
        expect(it.next()).toBe("b");
        expect(it.hasNext()).toBeTruthy();
        expect(it.next()).toBe("ï");
        expect(it.hasNext()).toBeTruthy();
        expect(it.next()).toBe("\uD800\uDC00");
        expect(!it.hasNext()).toBeTruthy();
        expect(it.next()).toBe(undefined);
    });
    test("CharIteratorMultipleDecomposed", () => {
        expect.assertions(8);
        const s = new GlyphString("aẬa"); // the accented A is a decomposed char with 2 accents
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
    test("CharIteratorAgrave", () => {
        expect.assertions(4);
        const s = new GlyphString("À"); // the accented A is a decomposed char
        const it = s.charIterator();

        expect(it.hasNext()).toBeTruthy();
        expect(it.next()).toBe("À");
        expect(!it.hasNext()).toBeTruthy();
        expect(it.next()).toBe(undefined);
    });
    test("ForEachNormal", () => {
        const s = new GlyphString("aba");

        const expected = ["a", "b", "a"];
        let i = 0;

        s.forEach(ch => {
            expect(ch).toBe(expected[i++]);
        });
    });
    test("ForEachDecomposed", () => {
        const s = new GlyphString("aÄa"); // the A umlaut is a decomposed char

        const expected = ["a", "Ä", "a"];
        let i = 0;

        s.forEach(ch => {
            expect(ch).toBe(expected[i++]);
        });
    });
    test("ForEachEmpty", () => {
        const s = new GlyphString("");

        s.forEach(ch => {
            // should never call this callback
            test.fail();
        });
    });
    test("ForEachWithSurrogates", () => {
        const s = new GlyphString("a\uD800\uDF02b\uD800\uDC00");

        const expected = ["a", "\uD800\uDF02", "b", "\uD800\uDC00"];
        let i = 0;

        s.forEach(ch => {
            expect(ch).toBe(expected[i++]);
        });
    });
    test("ForEachWithSurrogatesAndDecomposedChars", () => {
        const s = new GlyphString("a\uD800\uDF02bï\uD800\uDC00"); // the ï is a decomposed i + umlaut

        const expected = ["a", "\uD800\uDF02", "b", "ï", "\uD800\uDC00"];
        let i = 0;

        s.forEach(ch => {
            expect(ch).toBe(expected[i++]);
        });
    });
    test("ForEachMultipleDecomposed", () => {
        const s = new GlyphString("aẬa"); // the accented A is a decomposed char with 2 accents

        const expected = ["a", "Ậ", "a"];
        let i = 0;

        s.forEach(ch => {
            expect(ch).toBe(expected[i++]);
        });
    });
    test("ForEachAgrave", () => {
        const s = new GlyphString("À"); // the accented A is a decomposed char

        const expected = ["À"];
        let i = 0;

        s.forEach(ch => {
            expect(ch).toBe(expected[i++]);
        });
    });
    test("GlyphStrTruncateSimple", () => {
        expect.assertions(1);
        const s = new GlyphString("abcdefghijklmnop");

        expect(s.truncate(6)).toBe("abcdef");
    });
    test("GlyphStrTruncateWithCombiningAccentsmidGlyphs", () => {
        expect.assertions(1);
        const s = new GlyphString("aẬbẬcẬdẬe"); // the accented A is a decomposed char with 2 accents

        expect(s.truncate(2)).toBe("aẬ");
    });
    test("GlyphStrTruncateWithCombiningAccentsWholeGlyphs", () => {
        expect.assertions(1);
        const s = new GlyphString("aẬbẬcẬdẬe"); // the accented A is a decomposed char with 2 accents

        expect(s.truncate(4)).toBe("aẬbẬ");
    });
    test("GlyphStrTruncateThai", () => {
        expect.assertions(1);
        const s = new GlyphString("สวัุสดีคุณเป็นอย่างไรบ้าง");

        // this tests non-spacing marks that are also non-combining

        expect(s.truncate(4)).toBe("สวัุสดี");
    });
    test("GlyphStrTruncateDevanagari1", () => {
        expect.assertions(1);
        const s = new GlyphString("हैलो, आप कैसे हैं?");

        // if the 2nd base character has combining spacing accents on it,
        // then it will not fit in the two spaces available, so the base
        // and all its combining spacing accents have to be removed.
        expect(s.truncate(2)).toBe("है");
    });
    test("GlyphStrTruncateDevanagari2", () => {
        expect.assertions(1);
        const s = new GlyphString("हैलो, आप कैसे हैं?");

        expect(s.truncate(3)).toBe("हैलो,");
    });
    test("GlyphStrTruncateTamil", () => {
        expect.assertions(1);
        const s = new GlyphString("சொலிறுவெ");

        expect(s.truncate(3)).toBe("சொலி");
    });
    test("GlyphStrTruncateJapanese", () => {
        expect.assertions(1);
        const s = new GlyphString("ェドイン");

        expect(s.truncate(2)).toBe("ェド");
    });
    test("GlyphStrTruncateKannadaNonSpacing", () => {
        expect.assertions(1);
        const s = new GlyphString("ಭೆನಿಬೇನಿೇ");

        expect(s.truncate(2)).toBe("ಭೆನಿ");
    });
    test("GlyphStrTruncateKannadaSkipSpacing3", () => {
        expect.assertions(1);
        const s = new GlyphString("ಭೆನಿಬೇನಿೇ");

        expect(s.truncate(3)).toBe("ಭೆನಿ");
    });
    test("GlyphStrTruncateKannadaSkipSpacing4", () => {
        expect.assertions(1);
        const s = new GlyphString("ಭೆನಿಬೇನಿೇ");

        expect(s.truncate(4)).toBe("ಭೆನಿಬೇ");
    });
    test("GlyphStrTruncateMalayalamNonSpacing", () => {
        expect.assertions(1);
        const s = new GlyphString("ടൢഡൣഖൊഭൈ");

        expect(s.truncate(2)).toBe("ടൢഡൣ");
    });
    test("GlyphStrTruncateMalayalamSkipSpacing3", () => {
        expect.assertions(1);
        const s = new GlyphString("ടൢഡൣഖൊഭൈ");

        expect(s.truncate(3)).toBe("ടൢഡൣ");
    });
    test("GlyphStrTruncateMalayalamSkipSpacing4", () => {
        expect.assertions(1);
        const s = new GlyphString("ടൢഡൣഖൊഭൈ");

        expect(s.truncate(4)).toBe("ടൢഡൣഖൊ");
    });
    test("GlyphStrTruncateSinhalaNonSpacing", () => {
        expect.assertions(1);
        const s = new GlyphString("ච්ගුටෘඋෙ");

        expect(s.truncate(2)).toBe("ච්ගු");
    });
    test("GlyphStrTruncateSinhalaSkipSpacing3", () => {
        expect.assertions(1);
        const s = new GlyphString("ච්ගුටෘඋෙ");

        expect(s.truncate(3)).toBe("ච්ගු");
    });
    test("GlyphStrTruncateSinhalaSkipSpacing4", () => {
        expect.assertions(1);
        const s = new GlyphString("ච්ගුටෘඋෙ");

        expect(s.truncate(4)).toBe("ච්ගුටෘ");
    });
    test("GlyphStrTruncateTeluguNonSpacing", () => {
        expect.assertions(1);
        const s = new GlyphString("ఠౕఌేకౄదూ");

        expect(s.truncate(2)).toBe("ఠౕఌే");
    });
    test("GlyphStrTruncateTeluguSkipSpacing3", () => {
        expect.assertions(1);
        const s = new GlyphString("ఠౕఌేకౄదూ");

        expect(s.truncate(3)).toBe("ఠౕఌే");
    });
    test("GlyphStrTruncateTeluguSkipSpacing4", () => {
        expect.assertions(1);
        const s = new GlyphString("ఠౕఌేకౄదూ");

        expect(s.truncate(4)).toBe("ఠౕఌేకౄ");
    });
    test("GlyphStrTruncateBengaliNonSpacing", () => {
        expect.assertions(1);
        const s = new GlyphString("ঢূতুমৈবো");

        expect(s.truncate(2)).toBe("ঢূতু");
    });
    test("GlyphStrTruncateBengaliSkipSpacing3", () => {
        expect.assertions(1);
        const s = new GlyphString("ঢূতুমৈবো");

        expect(s.truncate(3)).toBe("ঢূতু");
    });
    test("GlyphStrTruncateBengaliSkipSpacing4", () => {
        expect.assertions(1);
        const s = new GlyphString("ঢূতুমৈবো");

        expect(s.truncate(4)).toBe("ঢূতুমৈ");
    });
    test("GlyphStrTruncateGujaratiNonSpacing", () => {
        expect.assertions(1);
        const s = new GlyphString("ઑૄખેઊોઌૉ");

        expect(s.truncate(2)).toBe("ઑૄખે");
    });
    test("GlyphStrTruncateGujaratiSkipSpacing3", () => {
        expect.assertions(1);
        const s = new GlyphString("ઑૄખેઊોઌૉ");

        expect(s.truncate(3)).toBe("ઑૄખે");
    });
    test("GlyphStrTruncateGujaratiSkipSpacing4", () => {
        expect.assertions(1);
        const s = new GlyphString("ઑૄખેઊોઌૉ");

        expect(s.truncate(4)).toBe("ઑૄખેઊો");
    });
    test("GlyphStrTruncateGurmukhiNonSpacing", () => {
        expect.assertions(1);
        const s = new GlyphString("ਕੇਙੋਡਿਜੀ");

        expect(s.truncate(2)).toBe("ਕੇਙੋ");
    });
    test("GlyphStrTruncateGurmukhiSkipSpacing3", () => {
        expect.assertions(1);
        const s = new GlyphString("ਕੇਙੋਡਿਜੀ");

        expect(s.truncate(3)).toBe("ਕੇਙੋ");
    });
    test("GlyphStrTruncateGurmukhiSkipSpacing4", () => {
        expect.assertions(1);
        const s = new GlyphString("ਕੇਙੋਡਿਜੀ");

        expect(s.truncate(4)).toBe("ਕੇਙੋਡਿ");
    });
    test("GlyphStrEllipsizeSimple", () => {
        expect.assertions(1);
        const s = new GlyphString("abcdefghijklmnop");

        expect(s.ellipsize(6)).toBe("abcde…");
    });
    test("GlyphStrEllipsizeWithCombiningAccentsmidGlyphs", () => {
        expect.assertions(1);
        const s = new GlyphString("aẬbẬcẬdẬe"); // the accented A is a decomposed char with 2 accents

        expect(s.ellipsize(3)).toBe("aẬ…");
    });
    test("GlyphStrEllipsizeWithCombiningAccentsWholeGlyphs", () => {
        expect.assertions(1);
        const s = new GlyphString("aẬbẬcẬdẬe"); // the accented A is a decomposed char with 2 accents

        expect(s.ellipsize(4)).toBe("aẬb…");
    });
    test("GlyphStrEllipsizeThai", () => {
        expect.assertions(1);
        const s = new GlyphString("สวัุสดีคุณเป็นอย่างไรบ้าง");

        expect(s.ellipsize(5)).toBe("สวัุสดี…");
    });
    test("GlyphStrEllipsizeDevanagari1", () => {
        expect.assertions(1);
        const s = new GlyphString("हैलो, आप कैसे हैं?");

        expect(s.ellipsize(3)).toBe("है…");
    });
    test("GlyphStrEllipsizeDevanagari2", () => {
        expect.assertions(1);
        const s = new GlyphString("हैलो, आप कैसे हैं?");

        expect(s.ellipsize(8), "हैलो).toBe(आप …");
    });
    test("GlyphStrEllipsizeJapanese", () => {
        expect.assertions(1);
        const s = new GlyphString("ェドイン");

        expect(s.ellipsize(3)).toBe("ェド…");
    });
    test("GlyphStrEllipsizeKannadaNonSpacing", () => {
        expect.assertions(1);
        const s = new GlyphString("ಭೆನಿಬೇನಿೇ");

        expect(s.ellipsize(4)).toBe("ಭೆನಿ…");
    });
    test("GlyphStrEllipsizeKannadaSkipSpacing5", () => {
        expect.assertions(1);
        const s = new GlyphString("ಭೆನಿಬೇನಿೇ");

        expect(s.ellipsize(5)).toBe("ಭೆನಿ…");
    });
    test("GlyphStrEllipsizeKannadaSkipSpacing5", () => {
        expect.assertions(1);
        const s = new GlyphString("ಭೆನಿಬೇನಿೇ");

        expect(s.ellipsize(5)).toBe("ಭೆನಿಬೇ…");
    });
    test("GlyphStrEllipsizeMalayalamNonSpacing", () => {
        expect.assertions(1);
        const s = new GlyphString("ടൢഡൣഖൊഭൈ");

        expect(s.ellipsize(3)).toBe("ടൢഡൣ…");
    });
    test("GlyphStrEllipsizeMalayalamSkipSpacing4", () => {
        expect.assertions(1);
        const s = new GlyphString("ടൢഡൣഖൊഭൈ");

        expect(s.ellipsize(4)).toBe("ടൢഡൣ…");
    });
    test("GlyphStrEllipsizeMalayalamSkipSpacing5", () => {
        expect.assertions(1);
        const s = new GlyphString("ടൢഡൣഖൊഭൈ");

        expect(s.ellipsize(5)).toBe("ടൢഡൣഖൊ…");
    });
    test("GlyphStrEllipsizeSinhalaNonSpacing", () => {
        expect.assertions(1);
        const s = new GlyphString("ච්ගුටෘඋෙ");

        expect(s.ellipsize(3)).toBe("ච්ගු…");
    });
    test("GlyphStrEllipsizeSinhalaSkipSpacing4", () => {
        expect.assertions(1);
        const s = new GlyphString("ච්ගුටෘඋෙ");

        expect(s.ellipsize(4)).toBe("ච්ගු…");
    });
    test("GlyphStrEllipsizeSinhalaSkipSpacing5", () => {
        expect.assertions(1);
        const s = new GlyphString("ච්ගුටෘඋෙ");

        expect(s.ellipsize(5)).toBe("ච්ගුටෘ…");
    });
    test("GlyphStrEllipsizeTeluguNonSpacing", () => {
        expect.assertions(1);
        const s = new GlyphString("ఠౕఌేకౄదూ");

        expect(s.ellipsize(3)).toBe("ఠౕఌే…");
    });
    test("GlyphStrEllipsizeTeluguSkipSpacing4", () => {
        expect.assertions(1);
        const s = new GlyphString("ఠౕఌేకౄదూ");

        expect(s.ellipsize(4)).toBe("ఠౕఌే…");
    });
    test("GlyphStrEllipsizeTeluguSkipSpacing5", () => {
        expect.assertions(1);
        const s = new GlyphString("ఠౕఌేకౄదూ");

        expect(s.ellipsize(5)).toBe("ఠౕఌేకౄ…");
    });
    test("GlyphStrEllipsizeBengaliNonSpacing", () => {
        expect.assertions(1);
        const s = new GlyphString("ঢূতুমৈবো");

        expect(s.ellipsize(3)).toBe("ঢূতু…");
    });
    test("GlyphStrEllipsizeBengaliSkipSpacing4", () => {
        expect.assertions(1);
        const s = new GlyphString("ঢূতুমৈবো");

        expect(s.ellipsize(4)).toBe("ঢূতু…");
    });
    test("GlyphStrEllipsizeBengaliSkipSpacing5", () => {
        expect.assertions(1);
        const s = new GlyphString("ঢূতুমৈবো");

        expect(s.ellipsize(5)).toBe("ঢূতুমৈ…");
    });
    test("GlyphStrEllipsizeGujaratiNonSpacing", () => {
        expect.assertions(1);
        const s = new GlyphString("ઑૄખેઊોઌૉ");

        expect(s.ellipsize(3)).toBe("ઑૄખે…");
    });
    test("GlyphStrEllipsizeGujaratiSkipSpacing4", () => {
        expect.assertions(1);
        const s = new GlyphString("ઑૄખેઊોઌૉ");

        expect(s.ellipsize(4)).toBe("ઑૄખે…");
    });
    test("GlyphStrEllipsizeGujaratiSkipSpacing5", () => {
        expect.assertions(1);
        const s = new GlyphString("ઑૄખેઊોઌૉ");

        expect(s.ellipsize(5)).toBe("ઑૄખેઊો…");
    });
    test("GlyphStrEllipsizeGurmukhiNonSpacing", () => {
        expect.assertions(1);
        const s = new GlyphString("ਕੇਙੋਡਿਜੀ");

        expect(s.ellipsize(3)).toBe("ਕੇਙੋ…");
    });
    test("GlyphStrEllipsizeGurmukhiSkipSpacing4", () => {
        expect.assertions(1);
        const s = new GlyphString("ਕੇਙੋਡਿਜੀ");

        expect(s.ellipsize(4)).toBe("ਕੇਙੋ…");
    });
    test("GlyphStrEllipsizeGurmukhiSkipSpacing5", () => {
        expect.assertions(1);
        const s = new GlyphString("ਕੇਙੋਡਿਜੀ");

        expect(s.ellipsize(5)).toBe("ਕੇਙੋਡਿ…");
    });
});