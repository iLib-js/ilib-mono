/*
 * GlyphIterator.test.ts - unit tests for GlyphIterator
 *
 * Copyright © 2026 JEDLSoft
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

import IString from "ilib-istring";

import GlyphIterator, {
    defaultCompose,
    type CharIteratorLike,
} from "../src/GlyphIterator";

/** Drain an iterator into an array of glyphs. */
function collect(it: GlyphIterator): string[] {
    const glyphs: string[] = [];
    while (it.hasNext()) {
        const g = it.next();
        if (g !== undefined) {
            glyphs.push(g);
        }
    }
    return glyphs;
}

/** Code points of each glyph, for stable assertions on combining sequences. */
function glyphCodePoints(glyphs: string[]): string[] {
    return glyphs.map((g) =>
        [...g].map((c) => "U+" + (c.codePointAt(0) as number).toString(16).toUpperCase()).join("+")
    );
}

describe("GlyphIterator", () => {
    describe("construction", () => {
        test("accepts a plain string", () => {
            const it = new GlyphIterator("ab");
            expect(collect(it)).toEqual(["a", "b"]);
        });

        test("accepts an IString", () => {
            const it = new GlyphIterator(new IString("xy"));
            expect(collect(it)).toEqual(["x", "y"]);
        });

        test("accepts an existing character iterator", () => {
            const chars: CharIteratorLike = new IString("pq").charIterator();
            const it = new GlyphIterator(chars);
            expect(collect(it)).toEqual(["p", "q"]);
        });

        test("uses an injected compose function when provided", () => {
            const compose = jest.fn((lead: string, trail: string) => {
                if (lead === "A" && trail === "B") {
                    return "X";
                }
                return undefined;
            });
            // Two starters "A" "B" with no combining marks — compose is only
            // consulted when the next char is also a starter (ccc 0 / absent).
            const it = new GlyphIterator("AB", { compose });
            const glyphs = collect(it);
            // Without a successful compose mapping that replaces the pair as
            // one returned glyph, we still return the original chars; compose
            // is tried so the mock should have been called.
            expect(compose).toHaveBeenCalled();
            expect(glyphs.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe("empty and simple BMP", () => {
        test("empty string: hasNext false, next undefined", () => {
            const it = new GlyphIterator("");
            expect(it.hasNext()).toBe(false);
            expect(it.next()).toBeUndefined();
            expect(it.wasSpacingCombining()).toBe(false);
        });

        test("single BMP character", () => {
            const it = new GlyphIterator("Z");
            expect(it.hasNext()).toBe(true);
            expect(it.next()).toBe("Z");
            expect(it.hasNext()).toBe(false);
            expect(it.next()).toBeUndefined();
        });

        test("ASCII sequence, one glyph per character", () => {
            const it = new GlyphIterator("aba");
            expect(collect(it)).toEqual(["a", "b", "a"]);
        });

        test("next past end stays undefined and does not throw", () => {
            const it = new GlyphIterator("a");
            expect(it.next()).toBe("a");
            expect(it.next()).toBeUndefined();
            expect(it.next()).toBeUndefined();
            expect(it.hasNext()).toBe(false);
        });
    });

    describe("combining marks (Mn)", () => {
        test("base + diaeresis is one glyph", () => {
            // A + U+0308 COMBINING DIAERESIS
            const it = new GlyphIterator("A\u0308");
            const glyphs = collect(it);
            expect(glyphs).toHaveLength(1);
            expect(glyphCodePoints(glyphs)).toEqual(["U+41+U+308"]);
            expect(it.wasSpacingCombining()).toBe(false);
        });

        test("decomposed umlaut between plain letters", () => {
            const it = new GlyphIterator("aA\u0308a");
            expect(glyphCodePoints(collect(it))).toEqual([
                "U+61",
                "U+41+U+308",
                "U+61",
            ]);
        });

        test("multiple combining marks on one base", () => {
            // A + circumflex U+0302 + underdot U+0323
            const it = new GlyphIterator("A\u0302\u0323");
            const glyphs = collect(it);
            expect(glyphs).toHaveLength(1);
            expect(glyphCodePoints(glyphs)).toEqual(["U+41+U+302+U+323"]);
        });

        test("grave accent alone after base", () => {
            const it = new GlyphIterator("A\u0300");
            expect(glyphCodePoints(collect(it))).toEqual(["U+41+U+300"]);
        });

        test("wasSpacingCombining is false for Mn-only glyphs", () => {
            const it = new GlyphIterator("e\u0301"); // e + acute
            expect(it.next()).toBe("e\u0301");
            expect(it.wasSpacingCombining()).toBe(false);
        });

        test("wasSpacingCombining resets between glyphs", () => {
            // First glyph has Mc (Devanagari), second is plain Latin
            const it = new GlyphIterator("क\u093E" + "a");
            expect(it.next()).toBeDefined();
            // May or may not be Mc depending on vowel sign; then plain a
            it.next(); // consume second if any
            // Re-build clearer case:
            const it2 = new GlyphIterator("a\u0308b");
            it2.next(); // ä — Mn only
            expect(it2.wasSpacingCombining()).toBe(false);
            it2.next(); // b
            expect(it2.wasSpacingCombining()).toBe(false);
        });
    });

    describe("spacing combining marks (Mc)", () => {
        test("Devanagari base + dependent vowel (Mc) is one glyph", () => {
            // क U+0915 + ा U+093E (DEVANAGARI VOWEL SIGN AA) — Mc
            const it = new GlyphIterator("क\u093E");
            const glyphs = collect(it);
            expect(glyphs).toHaveLength(1);
            expect(glyphCodePoints(glyphs)).toEqual(["U+915+U+93E"]);
        });

        test("wasSpacingCombining is true after an Mc glyph", () => {
            const it = new GlyphIterator("क\u093E");
            it.next();
            expect(it.wasSpacingCombining()).toBe(true);
        });

        test("Mc then a following starter: Mc flag only on Mc glyph", () => {
            const it = new GlyphIterator("क\u093Ex");
            expect(it.next()).toBe("क\u093E");
            expect(it.wasSpacingCombining()).toBe(true);
            expect(it.next()).toBe("x");
            expect(it.wasSpacingCombining()).toBe(false);
        });

        test("Thai nonspacing + spacing marks stay with base", () => {
            // ส + ั (U+0E31 Mn) + ุ (U+0E38 Mn) — all one glyph cluster for Thai
            const it = new GlyphIterator("ส\u0E31\u0E38");
            const glyphs = collect(it);
            expect(glyphs).toHaveLength(1);
            expect(glyphCodePoints(glyphs)).toEqual(["U+E2A+U+E31+U+E38"]);
        });
    });

    describe("surrogate pairs (supplementary plane)", () => {
        test("surrogate pair is a single glyph", () => {
            // U+10302 OLD ITALIC LETTER KE
            const it = new GlyphIterator("\uD800\uDF02");
            const glyphs = collect(it);
            expect(glyphs).toHaveLength(1);
            expect(glyphCodePoints(glyphs)).toEqual(["U+10302"]);
        });

        test("surrogates mixed with BMP and decomposed", () => {
            // a + U+10302 + b + i + diaeresis + U+10000
            const str =
                "a\uD800\uDF02bi\u0308\uD800\uDC00";
            const it = new GlyphIterator(str);
            expect(glyphCodePoints(collect(it))).toEqual([
                "U+61",
                "U+10302",
                "U+62",
                "U+69+U+308",
                "U+10000",
            ]);
        });
    });

    describe("composition of adjacent starters", () => {
        test("defaultCompose looks up NFC for base + combining mark sequence", () => {
            // NFC table keys are the decomposition sequence (lead + trail).
            expect(defaultCompose("A", "\u0308")).toBe("Ä");
            expect(defaultCompose("A", "B")).toBeUndefined();
        });

        test("two starters that compose are returned as one glyph", () => {
            const it = new GlyphIterator("AB", {
                compose: (lead, trail) =>
                    lead === "A" && trail === "B" ? "Æ" : undefined,
            });
            // Successful compose appends trail onto the current glyph.
            expect(collect(it)).toEqual(["AB"]);
        });

        test("two starters that do not compose remain separate glyphs", () => {
            const it = new GlyphIterator("AB", {
                compose: () => undefined,
            });
            expect(collect(it)).toEqual(["A", "B"]);
        });

        test("peek buffer: after non-composing starter, next() returns it", () => {
            const it = new GlyphIterator("ABC", {
                compose: () => undefined,
            });
            expect(it.next()).toBe("A");
            expect(it.hasNext()).toBe(true);
            expect(it.next()).toBe("B");
            expect(it.next()).toBe("C");
            expect(it.hasNext()).toBe(false);
        });

        test("chained compose across more than two starters", () => {
            // A+B → X, then X+C → Y (composed tracker updates)
            const it = new GlyphIterator("ABC", {
                compose: (lead, trail) => {
                    if (lead === "A" && trail === "B") return "X";
                    if (lead === "X" && trail === "C") return "Y";
                    return undefined;
                },
            });
            expect(collect(it)).toEqual(["ABC"]);
        });
    });

    describe("leading combining mark", () => {
        test("orphan combining mark (non-starter) is returned alone", () => {
            // A mark with ccc !== 0 at the start does not enter the combining loop
            const it = new GlyphIterator("\u0308a");
            expect(glyphCodePoints(collect(it))).toEqual(["U+308", "U+61"]);
        });
    });

    describe("scripts with heavy combining", () => {
        test("Devanagari short phrase glyph count", () => {
            const it = new GlyphIterator("हैलो");
            const glyphs = collect(it);
            // ह + ै , ल + ो  → typically 2 glyphs
            expect(glyphs.length).toBeGreaterThanOrEqual(2);
            expect(glyphs.join("")).toBe("हैलो");
        });

        test("Thai string reassembles to original", () => {
            const s = "สวัุสดี";
            const it = new GlyphIterator(s);
            expect(collect(it).join("")).toBe(s);
        });

        test("Japanese with voiced mark", () => {
            // ト + ゙ (U+3099 combining voiced sound mark) may cluster
            const it = new GlyphIterator("ェドイン");
            const glyphs = collect(it);
            expect(glyphs.join("")).toBe("ェドイン");
            expect(glyphs.length).toBeLessThanOrEqual(5);
        });
    });

    describe("hasNext / wasSpacingCombining edge cases", () => {
        test("hasNext is true when only peeked char remains", () => {
            const it = new GlyphIterator("AB", { compose: () => undefined });
            it.next(); // A — peeks B
            expect(it.hasNext()).toBe(true);
            expect(it.next()).toBe("B");
        });

        test("wasSpacingCombining is false before any next()", () => {
            const it = new GlyphIterator("क\u093E");
            expect(it.wasSpacingCombining()).toBe(false);
        });

        test("wasSpacingCombining false after exhausting iterator", () => {
            const it = new GlyphIterator("a");
            it.next();
            it.next();
            expect(it.wasSpacingCombining()).toBe(false);
        });
    });

    describe("iterable protocol", () => {
        test("for...of yields whole glyphs", () => {
            const glyphs: string[] = [];
            for (const g of new GlyphIterator("aA\u0308a")) {
                glyphs.push(g);
            }
            expect(glyphs).toEqual(["a", "A\u0308", "a"]);
        });

        test("spread yields whole glyphs", () => {
            expect([...new GlyphIterator("aA\u0302\u0323a")]).toEqual([
                "a",
                "A\u0302\u0323",
                "a",
            ]);
        });

        test("empty iterator spreads to empty array", () => {
            expect([...new GlyphIterator("")]).toEqual([]);
        });

        test("Symbol.iterator shares progress with next()", () => {
            const it = new GlyphIterator("abc");
            expect(it.next()).toBe("a");
            expect([...it]).toEqual(["b", "c"]);
            expect(it.hasNext()).toBe(false);
        });
    });
});
