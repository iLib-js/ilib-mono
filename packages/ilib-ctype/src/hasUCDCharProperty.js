/*
 * hasUCDCharProperty.js - test a code point against a UCD general category
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

import { JSUtils } from "ilib-common";

import { inRange } from "./CType.js";
import { ctype_c } from "./ctype_c.js";
import { ctype_l } from "./ctype_l.js";
import { ctype_m } from "./ctype_m.js";
import { ctype_n } from "./ctype_n.js";
import { ctype_p } from "./ctype_p.js";
import { ctype_s } from "./ctype_s.js";
import { ctype_z } from "./ctype_z.js";

/**
 * Map from general-category aliases (lower-cased) to the short property
 * codes used as keys inside the ctype_* data tables.
 *
 * Callers may pass either the short code ("Mn") or the long Unicode name
 * ("Nonspacing_Mark"); both resolve to the same internal lookup.
 */
const propertyAliases = {
    // short codes
    cn: "Cn",
    lu: "Lu",
    ll: "Ll",
    lt: "Lt",
    lm: "Lm",
    lo: "Lo",
    mn: "Mn",
    me: "Me",
    mc: "Mc",
    nd: "Nd",
    nl: "Nl",
    no: "No",
    zs: "Zs",
    zl: "Zl",
    zp: "Zp",
    cc: "Cc",
    cf: "Cf",
    co: "Co",
    cs: "Cs",
    pd: "Pd",
    ps: "Ps",
    pe: "Pe",
    pc: "Pc",
    po: "Po",
    sm: "Sm",
    sc: "Sc",
    sk: "Sk",
    so: "So",
    pi: "Pi",
    pf: "Pf",
    // long Unicode general-category names
    unassigned: "Cn",
    uppercase_letter: "Lu",
    lowercase_letter: "Ll",
    titlecase_letter: "Lt",
    modifier_letter: "Lm",
    other_letter: "Lo",
    nonspacing_mark: "Mn",
    enclosing_mark: "Me",
    spacing_mark: "Mc",
    decimal_number: "Nd",
    letter_number: "Nl",
    other_number: "No",
    space_separator: "Zs",
    line_separator: "Zl",
    paragraph_separator: "Zp",
    control: "Cc",
    format: "Cf",
    private_use: "Co",
    surrogate: "Cs",
    dash_punctuation: "Pd",
    open_punctuation: "Ps",
    close_punctuation: "Pe",
    connector_punctuation: "Pc",
    other_punctuation: "Po",
    math_symbol: "Sm",
    currency_symbol: "Sc",
    modifier_symbol: "Sk",
    other_symbol: "So",
    initial_punctuation: "Pi",
    final_punctuation: "Pf"
};

/**
 * General-category data tables keyed by the first letter of the short
 * property code (L, M, N, Z, C, P, S). Kept private so the on-disk /
 * in-memory format can change without breaking callers.
 */
const categoryTables = {
    L: ctype_l,
    M: ctype_m,
    N: ctype_n,
    Z: ctype_z,
    C: ctype_c,
    P: ctype_p,
    S: ctype_s
};

/**
 * Resolve a user-supplied property name to the short general-category
 * code used as a key in the ctype_* tables.
 *
 * @param {string} propertyType short code or long Unicode name
 * @return {string|undefined} short code such as "Mn", or undefined if unknown
 */
function resolvePropertyCode(propertyType) {
    if (!propertyType || typeof propertyType !== "string") {
        return undefined;
    }
    return propertyAliases[propertyType.toLowerCase()];
}

/**
 * Return whether a character has the given Unicode general-category
 * property. Callers do not pass or see the underlying data tables.
 *
 * The property names are taken from Unicode DerivedGeneralCategory
 * (http://www.unicode.org/Public/UNIDATA/extracted/DerivedGeneralCategory.txt).
 * Either the short code or the long name may be used:
 *
 * <ul>
 * <li>Cn / Unassigned
 * <li>Lu / Uppercase_Letter
 * <li>Ll / Lowercase_Letter
 * <li>Lt / Titlecase_Letter
 * <li>Lm / Modifier_Letter
 * <li>Lo / Other_Letter
 * <li>Mn / Nonspacing_Mark
 * <li>Me / Enclosing_Mark
 * <li>Mc / Spacing_Mark
 * <li>Nd / Decimal_Number
 * <li>Nl / Letter_Number
 * <li>No / Other_Number
 * <li>Zs / Space_Separator
 * <li>Zl / Line_Separator
 * <li>Zp / Paragraph_Separator
 * <li>Cc / Control
 * <li>Cf / Format
 * <li>Co / Private_Use
 * <li>Cs / Surrogate
 * <li>Pd / Dash_Punctuation
 * <li>Ps / Open_Punctuation
 * <li>Pe / Close_Punctuation
 * <li>Pc / Connector_Punctuation
 * <li>Po / Other_Punctuation
 * <li>Sm / Math_Symbol
 * <li>Sc / Currency_Symbol
 * <li>Sk / Modifier_Symbol
 * <li>So / Other_Symbol
 * <li>Pi / Initial_Punctuation
 * <li>Pf / Final_Punctuation
 * </ul>
 *
 * @static
 * @param {string|number|Object} ch character, code point, or IString to examine
 * @param {string} propertyType short general-category code or long Unicode name
 * @return {boolean} true if the character has the named property
 */
export default function hasUCDCharProperty(ch, propertyType) {
    const code = resolvePropertyCode(propertyType);
    if (!code) {
        return false;
    }

    const table = categoryTables[code.charAt(0)];
    if (!table) {
        return false;
    }

    var num;
    switch (typeof(ch)) {
        case 'number':
            num = ch;
            break;
        case 'string':
            num = JSUtils.toCodePoint(ch, 0);
            break;
        case 'undefined':
            return false;
        default:
            num = ch._toCodePoint(0);
            break;
    }

    return inRange(num, code, table);
}
