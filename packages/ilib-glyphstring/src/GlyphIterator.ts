/*
 * GlyphIterator.ts - iterate over each whole glyph in a string
 *
 * Copyright © 2024, 2026 JEDLSoft
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
import { hasUCDCharProperty } from "ilib-ctype";

import { ccc } from "./ccc";
import { nfc } from "./nfc";

/** Minimal character-iterator interface used as GlyphIterator input. */
export interface CharIteratorLike {
    hasNext(): boolean;
    next(): string | undefined;
}

/**
 * Compose a leading character with a trailing character when a mapping
 * exists (NFC table or algorithmic Hangul Jamo composition).
 */
export type ComposeFn = (lead: string, trail: string) => string | undefined;

/** Options for constructing a {@link GlyphIterator}. */
export interface GlyphIteratorOptions {
    /**
     * Optional composition function. Defaults to NFC + Hangul Jamo
     * composition used by GlyphString.
     */
    compose?: ComposeFn;
}

// Hangul Jamo composition constants
const syllableBase = 0xac00;
const leadingJamoCount = 19;
const vowelJamoCount = 21;
const trailingJamoCount = 28;
const syllableCount = leadingJamoCount * vowelJamoCount * trailingJamoCount;

function isJamoL(n: number): boolean {
    return n >= 0x1100 && n <= 0x1112;
}

function isJamoV(n: number): boolean {
    return n >= 0x1161 && n <= 0x1175;
}

function isJamoT(n: number): boolean {
    return n >= 0x11a8 && n <= 0x11c2;
}

function isJamoLV(n: number): boolean {
    const syllableIndex = n - syllableBase;
    if (0 <= syllableIndex && syllableIndex < syllableCount) {
        return syllableIndex % trailingJamoCount === 0;
    }
    return false;
}

function composeJamoLV(lead: number, trail: number): string {
    const lindex = lead - 0x1100;
    const vindex = trail - 0x1161;
    return IString.fromCodePoint(0xac00 + (lindex * 21 + vindex) * 28);
}

function composeJamoLVT(lead: number, trail: number): string {
    return IString.fromCodePoint(lead + (trail - 0x11a7));
}

/**
 * Default compose: Hangul Jamo algorithmically, otherwise NFC table lookup.
 */
export function defaultCompose(lead: string, trail: string): string | undefined {
    const first = lead.charCodeAt(0);
    const last = trail.charCodeAt(0);
    if (isJamoLV(first) && isJamoT(last)) {
        return composeJamoLVT(first, last);
    }
    if (isJamoL(first) && isJamoV(last)) {
        return composeJamoLV(first, last);
    }
    return nfc[lead + trail];
}

function toCharIterator(source: string | IString | CharIteratorLike): CharIteratorLike {
    if (typeof source === "string") {
        return new IString(source).charIterator();
    }
    if (typeof (source as IString).charIterator === "function") {
        // IString (or GlyphString) — use code-point char iterator, not glyph
        return IString.prototype.charIterator.call(source);
    }
    return source as CharIteratorLike;
}

/**
 * Iterate through a string one whole glyph at a time.
 *
 * A glyph is a base character plus any following combining marks (and,
 * when composition applies, recomposed starters). Surrogate pairs are
 * treated as single characters via the underlying code-point iterator.
 */
export class GlyphIterator {
    private readonly it: CharIteratorLike;
    private readonly compose: ComposeFn;
    private peeked: string | undefined = undefined;
    private spacingCombining = false;

    /**
     * @param source a string, an IString, or an existing character iterator
     * @param options optional compose override
     */
    constructor(
        source: string | IString | CharIteratorLike,
        options?: GlyphIteratorOptions
    ) {
        this.it = toCharIterator(source);
        this.compose = (options && options.compose) || defaultCompose;
    }

    /**
     * @returns true if there is at least one more glyph to return
     */
    hasNext(): boolean {
        return this.peeked !== undefined || this.it.hasNext();
    }

    /**
     * @returns the next whole glyph, or undefined if exhausted
     */
    next(): string | undefined {
        let ch = this.peeked !== undefined ? this.peeked : this.it.next();
        let prevCcc = ch !== undefined ? ccc[ch] : undefined;
        let composed = ch;

        this.peeked = undefined;
        this.spacingCombining = false;

        if (ch === undefined) {
            return undefined;
        }

        if (typeof prevCcc === "undefined" || prevCcc === 0) {
            // Starter: gather following non-starters (and possibly the next
            // starter when it recomposes with this one).
            let notdone = true;
            while (this.it.hasNext() && notdone) {
                this.peeked = this.it.next();
                const nextCcc =
                    this.peeked !== undefined ? ccc[this.peeked] : undefined;
                const codePoint = IString.toCodePoint(this.peeked as string, 0);
                // Mn = nonspacing mark; Mc = spacing combining mark
                const isMn = hasUCDCharProperty(codePoint, "Nonspacing_Mark");
                const isMc = hasUCDCharProperty(codePoint, "Spacing_Mark");
                if (
                    isMn ||
                    isMc ||
                    (typeof nextCcc !== "undefined" && nextCcc !== 0)
                ) {
                    if (isMc) {
                        this.spacingCombining = true;
                    }
                    ch += this.peeked;
                    this.peeked = undefined;
                } else {
                    const testChar = this.compose(
                        composed as string,
                        this.peeked as string
                    );
                    // Missing CCC means starter (ccc 0), same as an explicit 0.
                    if (
                        (typeof prevCcc === "undefined" || prevCcc === 0) &&
                        typeof testChar !== "undefined"
                    ) {
                        composed = testChar;
                        ch += this.peeked;
                        this.peeked = undefined;
                    } else {
                        // Leave peeked for the next next() call
                        notdone = false;
                    }
                }
                prevCcc = nextCcc;
            }
        }

        return ch;
    }

    /**
     * @returns true if the last glyph from {@link next} included spacing
     * combining marks (Unicode Mc). Used by truncation to decide whether
     * a glyph fits in the remaining space.
     */
    wasSpacingCombining(): boolean {
        return this.spacingCombining;
    }
}

export default GlyphIterator;
