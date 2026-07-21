/*
 * GlyphString.ts - ilib string subclass that allows you to access
 * whole glyphs at a time
 *
 * Copyright © 2015-2018, 2023-2024, 2026 JEDLSoft
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

import { GlyphIterator } from "./GlyphIterator";

/** Options for constructing a {@link GlyphString}. */
export interface GlyphStringOptions {
    /** Locale of this string (passed through to IString). */
    locale?: string;
    /**
     * Callback invoked when the instance is ready. With static ccc/nfc
     * data this fires synchronously from the constructor.
     */
    onLoad?: (gstr: GlyphString) => void;
    /** @internal Skip IString initialization (used by {@link GlyphString.create}). */
    _noinit?: boolean;
}

/**
 * Iterator returned by {@link GlyphString.charIterator}.
 * Steps through whole on-screen glyphs (base + combining marks).
 */
export interface GlyphCharIterator {
    hasNext(): boolean;
    next(): string | undefined;
    /**
     * True if the last glyph returned by {@link next} included spacing
     * combining marks (Unicode general category Mc).
     */
    wasSpacingCombining(): boolean;
}

/**
 * Create a new glyph string instance. This string inherits from
 * the IString class, and adds methods that allow you to access
 * whole glyphs at a time.
 *
 * In Unicode, various accented characters can be created by using
 * a base character and one or more combining characters following
 * it. These appear on the screen to the user as a single glyph.
 * For example, the Latin character "a" (U+0061) followed by the
 * combining diaresis character "¨" (U+0308) combine together to
 * form the "a with diaresis" glyph "ä", which looks like a single
 * character on the screen.
 *
 * The big problem with combining characters for web developers is
 * that many CSS engines do not ellipsize text between glyphs. They
 * only deal with single Unicode characters. So if a particular space
 * only allows for 4 characters, the CSS engine will truncate a
 * string at 4 Unicode characters and then add the ellipsis (...)
 * character. What if the fourth Unicode character is the "a" and
 * the fifth one is the diaresis? Then a string like "xxxäxxx" that
 * is ellipsized at 4 characters will appear as "xxxa..." on the
 * screen instead of "xxxä...".
 *
 * In the Latin script as it is commonly used, it is not so common
 * to form accented characters using combining accents, so the above
 * example is mostly for illustrative purposes. It is not unheard of
 * however. The situation is much, much worse in scripts such as Thai and
 * Devanagari that normally make very heavy use of combining characters.
 * These scripts do so because Unicode does not include pre-composed
 * versions of the accented characters like it does for Latin, so
 * combining accents are the only way to create these accented and
 * combined versions of the characters.
 *
 * The solution to this problem is not to use the the CSS property
 * "text-overflow: ellipsis" in your web site, ever. Instead, use
 * a glyph string to truncate text between glyphs dynamically,
 * rather than truncating between Unicode characters using CSS.
 *
 * Glyph strings are also useful for truncation, hyphenation, and
 * line wrapping, as all of these should be done between glyphs instead
 * of between characters.
 */
export class GlyphString extends IString {
    /**
     * Create a new ilib glyph string instance.
     *
     * @param string initialize this instance with this string
     * @param options options governing the construction of this instance
     */
    constructor(string?: string | IString, options?: GlyphStringOptions) {
        super(string, options);

        // ccc and nfc are imported statically — no async locale load needed.
        if (options && typeof options.onLoad === "function") {
            options.onLoad(this);
        }
    }

    /**
     * Factory method to create a new instance of GlyphString asynchronously.
     * Awaits IString's plural-data initialization, then resolves with the
     * ready instance. (Glyph ccc/nfc data is already static.)
     *
     * @param string initialize this instance with this string
     * @param options the same objects you would send to a constructor
     */
    static create(
        string?: string | IString,
        options?: GlyphStringOptions
    ): Promise<GlyphString> {
        const gstr = new GlyphString(undefined, { ...options, _noinit: true });
        return Promise.resolve(gstr.init(string, options, false)).then(() => {
            if (options && typeof options.onLoad === "function") {
                options.onLoad(gstr);
            }
            return gstr;
        });
    }

    /**
     * Return an iterator that will step through all of the characters
     * in the string one at a time, taking care to step through decomposed
     * characters and through surrogate pairs in the UTF-16 encoding
     * as single characters.
     *
     * The GlyphString class will return decomposed Unicode characters
     * as a single unit that a user might see on the screen as a single
     * glyph. If the next character in the iteration is a base character
     * and it is followed by combining characters, the base and all its
     * following combining characters are returned as a single unit.
     *
     * The standard Javascript String's charAt() method only
     * returns information about a particular 16-bit character in the
     * UTF-16 encoding scheme.
     * If the index is pointing to a low- or high-surrogate character,
     * it will return that surrogate character rather
     * than the surrogate pair which represents a character
     * in the supplementary planes.
     *
     * The iterator instance returned has two methods, hasNext() which
     * returns true if the iterator has more characters to iterate through,
     * and next() which returns the next character. It also has
     * wasSpacingCombining() for truncation.
     */
    override charIterator(): GlyphCharIterator {
        return new GlyphIterator(this);
    }

    /**
     * Truncate the current string at the given number of whole glyphs and return
     * the resulting string.
     *
     * @param length the number of whole glyphs to keep in the string
     * @return a string truncated to the requested number of glyphs
     */
    truncate(length: number): string {
        const it = this.charIterator();
        let tr = "";
        let i = 0;
        for (; i < length - 1 && it.hasNext(); i++) {
            tr += it.next();
        }

        /*
         * handle the last character separately. If it contains spacing combining
         * accents, then we must assume that it uses up more horizontal space on
         * the screen than just the base character by itself, and therefore this
         * method will not truncate enough characters to fit in the given length.
         * In this case, we have to chop off not only the combining characters,
         * but also the base character as well because the base without the
         * combining accents is considered a different character.
         */
        if (i < length && it.hasNext()) {
            const c = it.next();
            if (!it.wasSpacingCombining()) {
                tr += c;
            }
        }
        return tr;
    }

    /**
     * Truncate the current string at the given number of glyphs and add an ellipsis
     * to indicate that is more to the string. The ellipsis forms the last character
     * in the string, so the string is actually truncated at length-1 glyphs.
     *
     * @param length the number of whole glyphs to keep in the string
     * including the ellipsis
     * @return a string truncated to the requested number of glyphs
     * with an ellipsis
     */
    ellipsize(length: number): string {
        return this.truncate(length > 0 ? length - 1 : 0) + "…";
    }
}

export default GlyphString;
