/*
 * GlyphIterator.js - an iterator that allows you to iterate over each
 * glyph in a string
 *
 * Copyright © 2024 JEDLSoft
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
import { CharIterator } from 'ilib-istring';

class GlyphIterator extends CharIterator {
    constructor(istring) {
        super(istring);

        this.index = 0;
        this.nextChar = undefined;
        this.spacingCombining = false;
    }

    hasNext() {
        return !!this.nextChar || it.hasNext();
    }

    next() {
        var ch = this.nextChar || it.next(),
            prevCcc = ilib.data.ccc[ch],
            nextCcc,
            composed = ch;

        this.nextChar = undefined;
        this.spacingCombining = false;

        if (ilib.data.ccc &&
                (typeof(ilib.data.ccc[ch]) === 'undefined' || ilib.data.ccc[ch] === 0)) {
            // found a starter... find all the non-starters until the next starter. Must include
            // the next starter because under some odd circumstances, two starters sometimes recompose
            // together to form another character
            var notdone = true;
            while (it.hasNext() && notdone) {
                this.nextChar = it.next();
                nextCcc = ilib.data.ccc[this.nextChar];
                var codePoint = IString.toCodePoint(this.nextChar, 0);
                // Mn characters are Marks that are non-spacing. These do not take more room than an accent, so they should be
                // considered part of the on-screen glyph, even if they are non-combining. Mc are marks that are spacing
                // and combining, which means they are part of the glyph, but they cause the glyph to use up more space than
                // just the base character alone.
                var isMn = CType._inRange(codePoint, "Mn", ilib.data.ctype_m);
                var isMc = CType._inRange(codePoint, "Mc", ilib.data.ctype_m);
                if (isMn || isMc || (typeof(nextCcc) !== 'undefined' && nextCcc !== 0)) {
                    if (isMc) {
                        this.spacingCombining = true;
                    }
                    ch += this.nextChar;
                    this.nextChar = undefined;
                } else {
                    // found the next starter. See if this can be composed with the previous starter
                    var testChar = GlyphString._compose(composed, this.nextChar);
                    if (prevCcc === 0 && typeof(testChar) !== 'undefined') {
                        // not blocked and there is a mapping
                        composed = testChar;
                        ch += this.nextChar;
                        this.nextChar = undefined;
                    } else {
                        // finished iterating, leave this.nextChar for the next next() call
                        notdone = false;
                    }
                }
                prevCcc = nextCcc;
            }
        }
        return ch;
    }

    /**
     * Returns true if the last character returned by the "next" method included
     * spacing combining characters. If it does, then the character was wider than
     * just the base character alone, and the truncation code will not add it.
     * @returns {boolean} true if last character included spacing combining chars
     */
    wasSpacingCombining() {
        return this.spacingCombining;
    }
}

export default GlyphIterator;
