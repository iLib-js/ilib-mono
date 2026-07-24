#!/usr/bin/env node

/*
 * index.ts - command-line demo of the ilib-glyphstring library
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

/*
 * This sample takes a string on the command line, uses a GlyphString to
 * segment it into whole glyphs (a base character plus any combining marks
 * that attach to it), and prints each glyph on its own line along with the
 * Unicode code points that make it up.
 */

import GlyphString from "ilib-glyphstring";

/**
 * Format a single code point as "U+XXXX" (at least 4 hex digits).
 */
function toUnicodeNotation(codePoint: number): string {
    return "U+" + codePoint.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Return the array of code points that make up a glyph, each formatted
 * as "U+XXXX". Iterating the string with for..of yields whole code points,
 * so surrogate pairs are handled correctly.
 */
function codePointsOf(glyph: string): string[] {
    const codePoints: string[] = [];
    for (const ch of glyph) {
        codePoints.push(toUnicodeNotation(ch.codePointAt(0) as number));
    }
    return codePoints;
}

function main(): void {
    const input = process.argv[2];

    if (typeof input === "undefined" || input === "--help" || input === "-h") {
        console.log("Usage: pnpm run:sample <string>");
        console.log('Example: pnpm run:sample "á马👍"');
        return;
    }

    // This is the core of the demo: wrap the string in a GlyphString and
    // ask it for an iterator over whole glyphs. next() returns undefined
    // once the iterator is exhausted, so checking it here narrows the type
    // to a string inside the loop.
    const gs = new GlyphString(input);
    const it = gs.charIterator();

    let glyph: string | undefined;
    while ((glyph = it.next()) !== undefined) {
        console.log(glyph + "\t[" + codePointsOf(glyph).join(", ") + "]");
    }
}

main();
