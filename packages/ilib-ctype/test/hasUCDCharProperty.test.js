/*
 * hasUCDCharProperty.test.js - test hasUCDCharProperty
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

import hasUCDCharProperty from "../src/hasUCDCharProperty.js";

/**
 * One representative code point per Unicode general category supported
 * by hasUCDCharProperty. Values are numbers so supplementary / surrogate
 * code points do not need to be encoded as JS strings.
 */
const categories = [
    // short, long, codePoint
    ["Cn", "Unassigned", 0x0378],
    ["Lu", "Uppercase_Letter", 0x0041], // A
    ["Ll", "Lowercase_Letter", 0x0061], // a
    ["Lt", "Titlecase_Letter", 0x01C5], // ǅ
    ["Lm", "Modifier_Letter", 0x02B0], // ʰ
    ["Lo", "Other_Letter", 0x00AA], // ª
    ["Mn", "Nonspacing_Mark", 0x0300], // combining grave
    ["Me", "Enclosing_Mark", 0x0488], // combining cyrillic hundred thousands sign
    ["Mc", "Spacing_Mark", 0x0903], // Devanagari sign visarga
    ["Nd", "Decimal_Number", 0x0030], // 0
    ["Nl", "Letter_Number", 0x16EE], // runic arlaug
    ["No", "Other_Number", 0x00B2], // ²
    ["Zs", "Space_Separator", 0x0020], // space
    ["Zl", "Line_Separator", 0x2028],
    ["Zp", "Paragraph_Separator", 0x2029],
    ["Cc", "Control", 0x0000], // NUL
    ["Cf", "Format", 0x00AD], // soft hyphen
    ["Co", "Private_Use", 0xE000],
    ["Cs", "Surrogate", 0xD800],
    ["Pd", "Dash_Punctuation", 0x002D], // -
    ["Ps", "Open_Punctuation", 0x0028], // (
    ["Pe", "Close_Punctuation", 0x0029], // )
    ["Pc", "Connector_Punctuation", 0x005F], // _
    ["Po", "Other_Punctuation", 0x0021], // !
    ["Sm", "Math_Symbol", 0x002B], // +
    ["Sc", "Currency_Symbol", 0x0024], // $
    ["Sk", "Modifier_Symbol", 0x005E], // ^
    ["So", "Other_Symbol", 0x00A6], // ¦
    ["Pi", "Initial_Punctuation", 0x00AB], // «
    ["Pf", "Final_Punctuation", 0x00BB] // »
];

describe("testhasUCDCharProperty", function() {
    test.each(categories.map(function(row) {
        return {
            shortCode: row[0],
            longName: row[1],
            codePoint: row[2],
            hex: row[2].toString(16).toUpperCase().padStart(4, "0")
        };
    }))(
        "supports category $shortCode / $longName (U+$hex)",
        function({ shortCode, longName, codePoint }) {
            expect.assertions(3);
            expect(hasUCDCharProperty(codePoint, shortCode)).toBe(true);
            expect(hasUCDCharProperty(codePoint, longName)).toBe(true);
            // long names are case-insensitive
            expect(hasUCDCharProperty(codePoint, longName.toLowerCase())).toBe(true);
        }
    );

    test("HasUCDCharPropertyNegative", function() {
        expect.assertions(3);
        expect(hasUCDCharProperty("A", "Mn")).toBe(false);
        expect(hasUCDCharProperty("\u0308", "Mc")).toBe(false);
        expect(hasUCDCharProperty("A", "NotARealProperty")).toBe(false);
    });

    test("HasUCDCharPropertyUndefined", function() {
        expect.assertions(2);
        expect(hasUCDCharProperty(undefined, "Mn")).toBe(false);
        expect(hasUCDCharProperty("a", undefined)).toBe(false);
    });
});
