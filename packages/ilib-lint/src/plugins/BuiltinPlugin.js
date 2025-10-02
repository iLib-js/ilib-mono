/*
 * BuiltinPlugin.js - plugin that houses all of the built-in
 * rules and parsers
 *
 * Copyright © 2022-2025 JEDLSoft
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

import { Plugin } from 'ilib-lint-common';
import XliffParser from './XliffParser.js';
import XliffSerializer from './XliffSerializer.js';
import LineParser from './LineParser.js';
import LineSerializer from './LineSerializer.js';
import StringParser from './string/StringParser.js';
import ErrorFilterTransformer from './ErrorFilterTransformer.js';
import StringSerializer from './string/StringSerializer.js';
import AnsiConsoleFormatter from '../formatters/AnsiConsoleFormatter.js';
import JsonFormatter from '../formatters/JsonFormatter.js';
import ResourceICUPlurals from '../rules/ResourceICUPlurals.js';
import ResourceICUPluralTranslation from '../rules/ResourceICUPluralTranslation.js';
import ResourceQuoteStyle from '../rules/ResourceQuoteStyle.js';
import ResourceSentenceEnding from '../rules/ResourceSentenceEnding.js';
import ResourceUniqueKeys from '../rules/ResourceUniqueKeys.js';
import ResourceEdgeWhitespace from '../rules/ResourceEdgeWhitespace.js';
import ResourceCompleteness from '../rules/ResourceCompleteness.js';
import ResourceDNTTerms from '../rules/ResourceDNTTerms.js';
import ResourceNoTranslation from '../rules/ResourceNoTranslation.js';
import ResourceStateChecker from '../rules/ResourceStateChecker.js';
import ResourceSourceICUPluralSyntax from '../rules/ResourceSourceICUPluralSyntax.js';
import ResourceSourceICUPluralParams from '../rules/ResourceSourceICUPluralParams.js';
import ResourceSourceICUPluralCategories from '../rules/ResourceSourceICUPluralCategories.js';
import ResourceSourceICUUnexplainedParams from '../rules/ResourceSourceICUUnexplainedParams.js';
import ResourceXML from '../rules/ResourceXML.js';
import ResourceCamelCase from '../rules/ResourceCamelCase.js';
import ResourceSnakeCase from '../rules/ResourceSnakeCase.js';
import ResourceKebabCase from '../rules/ResourceKebabCase.js';
import ResourceAllCaps from '../rules/ResourceAllCaps.js';
import ResourceGNUPrintfMatch from '../rules/ResourceGNUPrintfMatch.js';
import ResourceReturnChar from '../rules/ResourceReturnChar.js';
import StringFixer from './string/StringFixer.js';
import ResourceFixer from './resource/ResourceFixer.js';
import ByteParser from './byte/ByteParser.js';
import FileEncodingRule from '../rules/byte/FileEncodingRule.js';
import XliffHeaderEncoding from '../rules/string/XliffHeaderEncoding.js';
import BOMRule from '../rules/byte/BOMRule.js';
import ByteFixer from './byte/ByteFixer.js';

// built-in declarative rules
export const regexRules = [
    {
        type: "resource-matcher",
        name: "resource-url-match",
        description: "Ensure that URLs that appear in the source string are also used in the translated string",
        note: "URL '{matchString}' from the source string does not appear in the target string",
        regexps: [ "((https?|github|ftps?|mailto|file|data|irc):\\/\\/)([\\da-zA-Z\\.-]+)\\.([a-zA-Z\\.]{2,6})([\\/#\\?=%&\\w\\.-]*)*[\\/#\\?=%&\\w-]" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-url-match.md"
    },
    {
        type: "resource-matcher",
        name: "resource-named-params",
        description: "Ensure that named parameters that appear in the source string are also used in the translated string",
        note: "The named parameter '{matchString}' from the source string does not appear in the target string",
        regexps: [ "\\{\\w+\\}" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-named-params.md"
    },
    {
        type: "resource-target",
        name: "resource-no-fullwidth-latin",
        description: "Ensure that the target does not contain any full-width Latin characters.",
        note: "The full-width characters '{matchString}' are not allowed in the target string. Use ASCII letters instead.",
        regexps: [ "[\\uFF21-\\uFF3A\\uFF41-\\uFF5A]+" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-no-fullwidth-latin.md",
        fixes: [
            // Uppercase A-Z
            { search: "\\uFF21", replace: "A" }, { search: "\\uFF22", replace: "B" },
            { search: "\\uFF23", replace: "C" }, { search: "\\uFF24", replace: "D" },
            { search: "\\uFF25", replace: "E" }, { search: "\\uFF26", replace: "F" },
            { search: "\\uFF27", replace: "G" }, { search: "\\uFF28", replace: "H" },
            { search: "\\uFF29", replace: "I" }, { search: "\\uFF2A", replace: "J" },
            { search: "\\uFF2B", replace: "K" }, { search: "\\uFF2C", replace: "L" },
            { search: "\\uFF2D", replace: "M" }, { search: "\\uFF2E", replace: "N" },
            { search: "\\uFF2F", replace: "O" }, { search: "\\uFF30", replace: "P" },
            { search: "\\uFF31", replace: "Q" }, { search: "\\uFF32", replace: "R" },
            { search: "\\uFF33", replace: "S" }, { search: "\\uFF34", replace: "T" },
            { search: "\\uFF35", replace: "U" }, { search: "\\uFF36", replace: "V" },
            { search: "\\uFF37", replace: "W" }, { search: "\\uFF38", replace: "X" },
            { search: "\\uFF39", replace: "Y" }, { search: "\\uFF3A", replace: "Z" },
            // Lowercase a-z
            { search: "\\uFF41", replace: "a" }, { search: "\\uFF42", replace: "b" },
            { search: "\\uFF43", replace: "c" }, { search: "\\uFF44", replace: "d" },
            { search: "\\uFF45", replace: "e" }, { search: "\\uFF46", replace: "f" },
            { search: "\\uFF47", replace: "g" }, { search: "\\uFF48", replace: "h" },
            { search: "\\uFF49", replace: "i" }, { search: "\\uFF4A", replace: "j" },
            { search: "\\uFF4B", replace: "k" }, { search: "\\uFF4C", replace: "l" },
            { search: "\\uFF4D", replace: "m" }, { search: "\\uFF4E", replace: "n" },
            { search: "\\uFF4F", replace: "o" }, { search: "\\uFF50", replace: "p" },
            { search: "\\uFF51", replace: "q" }, { search: "\\uFF52", replace: "r" },
            { search: "\\uFF53", replace: "s" }, { search: "\\uFF54", replace: "t" },
            { search: "\\uFF55", replace: "u" }, { search: "\\uFF56", replace: "v" },
            { search: "\\uFF57", replace: "w" }, { search: "\\uFF58", replace: "x" },
            { search: "\\uFF59", replace: "y" }, { search: "\\uFF5A", replace: "z" }
        ]
    },
    {
        type: "resource-target",
        name: "resource-no-fullwidth-digits",
        description: "Ensure that the target does not contain any full-width digits.",
        note: "The full-width characters '{matchString}' are not allowed in the target string. Use ASCII digits instead.",
        regexps: [ "[\\uFF10-\\uFF19]+" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-no-fullwidth-digits.md",
        fixes: [
            { search: "\\uFF10", replace: "0" },
            { search: "\\uFF11", replace: "1" },
            { search: "\\uFF12", replace: "2" },
            { search: "\\uFF13", replace: "3" },
            { search: "\\uFF14", replace: "4" },
            { search: "\\uFF15", replace: "5" },
            { search: "\\uFF16", replace: "6" },
            { search: "\\uFF17", replace: "7" },
            { search: "\\uFF18", replace: "8" },
            { search: "\\uFF19", replace: "9" }
        ]
    },
    {
        type: "resource-target",
        name: "resource-no-fullwidth-punctuation-subset",
        description: "Ensure that the target does not contain specific full-width punctuation: percent sign, question mark, or exclamation mark.",
        note: "The full-width characters '{matchString}' are not allowed in the target string. Use ASCII symbols instead.",
        regexps: [ "[\\uFF01\\uFF05\\uFF1F]+" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-no-fullwidth-punctuation-subset.md",
        locales: "ja",
        fixes: [
            { search: "\\uFF01", replace: "!" },
            { search: "\\uFF05", replace: "%" },
            { search: "\\uFF1F", replace: "?" }
        ]
    },
        {
        type: "resource-target",
        name: "resource-no-space-between-double-and-single-byte-character",
        description: "Ensure that the target does not contain a space character between a double-byte and single-byte character.",
        note: "The space character is not allowed in the target string between a double- and single-byte character. Remove the space character.",
        regexps: [ "[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF]\\s+[\\x00-\\x20\\x30-\\x39\\x41-\\x5A\\x61-\\x7A\\x8A\\x8C\\x8E\\x9A\\x9C\\x9E\\x9F\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF]|[\\x00-\\x20\\x30-\\x39\\x41-\\x5A\\x61-\\x7A\\x8A\\x8C\\x8E\\x9A\\x9C\\x9E\\x9F\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF]\\s+[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF]" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-no-space-between-double-and-single-byte-character.md",
        severity: "warning",
        locales: "ja",
        fixes: [
            { search: "([\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF])\\s+", replace: "$1" },
            { search: "\\s+([\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF])", replace: "$1" }
        ]
    },
    {
        type: "resource-target",
        name: "resource-apostrophe",
        description: "Ensure that the target uses proper Unicode apostrophes instead of ASCII straight quotes.",
        note: "The word \"{matchString}\" contains an ASCII straight quote used as an apostrophe. Use the Unicode apostrophe character instead.",
        regexps: [ 
            "(\\p{L}+('\\p{L}+)+)"         // word boundary + word chars + quote + word chars + word boundary (e.g., it's, don't, d'l'homme)
        ],
        link: "https://github.com/iLib-js/ilib-lint/blob/main/docs/resource-apostrophe.md",
        fixes: [
            { search: "'", replace: "\u2019" }
        ]
    },
    {
        type: "resource-target",
        name: "resource-no-halfwidth-kana-characters",
        description: "Ensure that the target does not contain half-width kana characters.",
        note: "The half-width kana characters are not allowed in the target string. Use full-width characters.",
        regexps: [ "[ｧ-ﾝﾞﾟ]+" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-no-halfwidth-kana-characters.md",
        severity: "warning",
        fixes: [
            { search: "ｧ", replace: "ァ" },
            { search: "ｨ", replace: "ィ" },
            { search: "ｩ", replace: "ゥ" },
            { search: "ｪ", replace: "ェ" },
            { search: "ｫ", replace: "ォ" },
            { search: "ｬ", replace: "ャ" },
            { search: "ｭ", replace: "ュ" },
            { search: "ｮ", replace: "ョ" },
            { search: "ｯ", replace: "ッ" },
            { search: "ｰ", replace: "ー" },
            { search: "ｱ", replace: "ア" },
            { search: "ｲ", replace: "イ" },
            { search: "ｳ", replace: "ウ" },
            { search: "ｴ", replace: "エ" },
            { search: "ｵ", replace: "オ" },
            { search: "ｶ", replace: "カ" },
            { search: "ｷ", replace: "キ" },
            { search: "ｸ", replace: "ク" },
            { search: "ｹ", replace: "ケ" },
            { search: "ｺ", replace: "コ" },
            { search: "ｻ", replace: "サ" },
            { search: "ｼ", replace: "シ" },
            { search: "ｽ", replace: "ス" },
            { search: "ｾ", replace: "セ" },
            { search: "ｿ", replace: "ソ" },
            { search: "ﾀ", replace: "タ" },
            { search: "ﾁ", replace: "チ" },
            { search: "ﾂ", replace: "ツ" },
            { search: "ﾃ", replace: "テ" },
            { search: "ﾄ", replace: "ト" },
            { search: "ﾅ", replace: "ナ" },
            { search: "ﾆ", replace: "ニ" },
            { search: "ﾇ", replace: "ヌ" },
            { search: "ﾈ", replace: "ネ" },
            { search: "ﾉ", replace: "ノ" },
            { search: "ﾊ", replace: "ハ" },
            { search: "ﾋ", replace: "ヒ" },
            { search: "ﾌ", replace: "フ" },
            { search: "ﾍ", replace: "ヘ" },
            { search: "ﾎ", replace: "ホ" },
            { search: "ﾏ", replace: "マ" },
            { search: "ﾐ", replace: "ミ" },
            { search: "ﾑ", replace: "ム" },
            { search: "ﾒ", replace: "メ" },
            { search: "ﾓ", replace: "モ" },
            { search: "ﾗ", replace: "ラ" },
            { search: "ﾘ", replace: "リ" },
            { search: "ﾙ", replace: "ル" },
            { search: "ﾚ", replace: "レ" },
            { search: "ﾛ", replace: "ロ" },
            { search: "ﾜ", replace: "ワ" },
            { search: "ｦ", replace: "ヲ" },
            { search: "ﾝ", replace: "ン" }
        ]
    },
    {
        type: "resource-target",
        name: "resource-no-double-byte-space",
        description: "Ensure that the target does not contain double-byte space characters.",
        note: "Double-byte space characters should not be used in the target string. Use ASCII symbols instead.",
        // per https://en.wikipedia.org/wiki/Whitespace_character
        regexps: [ "[\\u1680\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u2028\\u2029\\u202F\\u205F\\u3000]+" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-no-double-byte-space.md",
        severity: "warning",
        locales: "ja",
        fixes: [
            { search: "[\\u1680\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u202F\\u205F\\u3000]", replace: " " },
            { search: "[\\u2028]", replace: "\n" },   // U+2028 is LINE SEPARATOR
            { search: "[\\u2029]", replace: "\n\n" }, // U+2029 is PARAGRAPH SEPARATOR
        ]
    },
    {
        type: "resource-target",
        name: "resource-no-space-with-fullwidth-punctuation",
        description: "Ensure that there is no whitespace adjacent to the fullwidth punctuation characters.",
        note: "There should be no space adjacent to fullwidth punctuation characters '{matchString}'. Remove it.",
        regexps: [ "(\\s+[\\u3001\\u3002\\u3008-\\u3011\\u3014-\\u301B]|[\\u3001\\u3002\\u3008-\\u3011\\u3014-\\u301B]\\s+)" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-no-space-with-fullwidth-punctuation.md",
        severity: "warning",
        locales: "ja",
        fixes: [
            { search: "\\s+([\\u3001\\u3002\\u3008-\\u3011\\u3014-\\u301B])", replace: "$1" },
            { search: "([\\u3001\\u3002\\u3008-\\u3011\\u3014-\\u301B])\\s+", replace: "$1" }
        ]
    },
    {
        type: "resource-source",
        name: "source-no-escaped-curly-braces",
        description: "Ensure that there are no replacement variables surrounded by single quotes which escape them in the source strings.",
        note: "There should be no escaped replacement parameters. Use Unicode quotes ‘like this’ (U+2018 and U+2019) or double quotes instead.",
        regexps: [ "(?:^|[^'])(?<match>''?\\{.*?\\}''?)" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/source-no-escaped-curly-braces.md",
        severity: "error",
        useStripped: false
    },
    {
        type: "resource-target",
        name: "resource-no-escaped-curly-braces",
        description: "Ensure that there are no replacement variables surrounded by single quotes which escape them in the target strings.",
        note: "There should be no escaped replacement parameters in the translation. Use quotes that are native for the target language or use tripled single-quotes instead.",
        regexps: [ "(?:^|[^'])(?<match>''?\\{.*?\\}''?)" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-no-escaped-curly-braces.md",
        severity: "error",
        useStripped: false
    },
    {
        type: "resource-source",
        name: "source-no-dashes-in-replacement-params",
        description: "Ensure that source strings do not contain dashes in the replacement parameters.",
        note: "Dashes are not allowed in replacement parameters. Use a different character such as underscore.",
        regexps: [ "(?:^|[^'])(?<match>\\{[^}]*?-[^}]*\\})" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/source-no-dashes-in-replacement-params.md",
        severity: "error"
    },
    {
        type: "resource-source",
        name: "source-no-lazy-plurals",
        description: "Ensure that source strings do not contain the (s) construct to indicate a possible plural. That is not translatable to many languages.",
        note: "The (s) construct is not allowed in source strings. Use real plural syntax instead.",
        regexps: [ "(?<match>\\w+\\(s\\))(?:\\s|\\p{P}|$)" ],  // \p{P} means punctuation
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/source-no-lazy-plurals.md",
        severity: "warning"
    },
    {
        type: "resource-source",
        name: "source-no-manual-percentage-formatting",
        description: "Ensure that source strings do not contain percentage formatting. Percentages should be formatted using a locale-sensitive number formatter instead.",
        note: "Do not format percentages in English strings. Use a locale-sensitive number formatter and substitute the result of that into this string.",
        regexps: [ "(?<match>\\{[\\w_.$0-9]+\\}\\s*%)(\\s|$)" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/source-no-manual-percentage-formatting.md",
        severity: "warning"
    },
    {
        type: "resource-source",
        name: "source-no-noun-replacement-params",
        description: "Ensure that source strings do not contain replacement parameters that are nouns or adjectives.",
        note: "Do not substitute nouns into UI strings. Use separate strings for each noun instead.",
        regexps: [ "\\b(?<match>([Aa][Nn]?|[Tt][Hh][Ee])\\s+\\{.*?\\})" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/source-no-noun-replacement-params.md",
        severity: "error",
        useStripped: false
    },
    {
        type: "resource-source",
        name: "source-no-manual-currency-formatting",
        description: "Ensure that source strings do not contain currency formatting. Currencies should be formatted using a locale-sensitive number formatter instead.",
        note: "Do not format currencies in English strings. Use a locale-sensitive number formatter and substitute the result of that into this string.",
        regexps: [ "(?<match>\\$\\s*\\{[\\w_.$0-9]+\\})" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/source-no-manual-currency-formatting.md",
        severity: "error"
    },
    {
        type: "resource-source",
        name: "source-no-manual-date-formatting",
        description: "Ensure that source strings do not contain manually formatted dates or times. Dates and times should be formatted using a locale-sensitive date formatter instead.",
        note: "Do not format dates or times in English strings. Use a locale-sensitive date formatter and substitute the result of that into this string.",
        regexps: [
            "\\{years?\\}[/\\-\\. ]\\{months?\\}[/\\-\\. ]\\{days?\\}",
            "\\{[Yy][Yy]([Yy][Yy])?\\}[/\\-\\. ]\\{[Mm]{2,4}\\}[/\\-\\. ]\\{[Dd][Dd]?\\}",

            "\\{months?\\}[/\\-\\. ]\\{days?\\}[/\\-\\. ]\\{years?\\}",
            "\\{months?\\} \\{days?\\}, \\{years?\\}",
            "\\{[Mm]{2,4}\\}[/\\-\\.]\\{[Dd][Dd]?\\}[/\\-\\.]\\{[Yy][Yy]([Yy][Yy])?\\}",
            "\\{[Mm]{2,4}\\} \\{[Dd][Dd]?\\}, \\{[Yy][Yy]([Yy][Yy])?\\}",

            "\\{days?\\}[/\\-\\. ]\\{months?\\}[/\\-\\. ]\\{years?\\}",
            "\\{days?\\} \\{months?\\}, \\{years?\\}",
            "\\{[Dd][Dd]?\\}[/\\-\\.]\\{[Mm]{2,4}\\}[/\\-\\.]\\{[Yy][Yy]([Yy][Yy])?\\}",
            "\\{[Dd][Dd]?\\} \\{[Mm]{2,4}\\}, \\{[Yy][Yy]([Yy][Yy])?\\}",

            "\\{years?\\}[/\\-\\. ]\\{months?\\}",
            "\\{[Yy][Yy]([Yy][Yy])?\\}[/\\-\\. ]\\{[Mm]{2,4}\\}",

            "\\{months?\\}[/\\-\\. ]\\{years?\\}",
            "\\{months?\\}, \\{years?\\}",
            "\\{[Mm]{2,4}\\}[/\\-\\. ]\\{[Yy][Yy]([Yy][Yy])?\\}",
            "\\{[Mm]{2,4}\\}, \\{[Yy][Yy]([Yy][Yy])?\\}",

            "\\{months?\\}[/\\-\\. ]\\{days?\\}",
            "\\{[Mm]{2,4}\\}[/\\-\\. ]\\{[Dd][Dd]?\\}",

            "\\{days?\\}[/\\-\\. ]\\{months?\\}",
            "\\{[Dd][Dd]?\\}[/\\-\\. ]\\{[Mm]{2,4}\\}",

            "\\{hours?\\}:\\{min(utes?)?\\}:\\{sec(onds?)?\\}",
            "\\{hours?\\}:\\{min(utes?)?\\}",
            "\\{[Hh][Hh]?\\}:\\{[Mm][Mm]?\\}:\\{[Ss][Ss]?\\}",
            "\\{[Hh][Hh]?\\}:\\{[Mm][Mm]?\\}"
        ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/source-no-manual-date-formatting.md",
        severity: "error"
    },
    {
        type: "resource-matcher",
        name: "resource-angular-named-params",
        description: "Ensure that named parameters in Angular that appear in the source string are also used in the translated string",
        note: "The named parameter '{{{matchString}}}' from the source string does not appear in the target string",
        regexps: [ "\\{\\{\\s*(?<match>[^}]+?)\\s*\\}\\}" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-javascript/docs/resource-angular-named-params.md"
    },
    {
        type: "resource-matcher",
        name: "resource-csharp-numbered-params",
        description: "Ensure that numbered parameters in C# that appear in the source string are also used in the translated string",
        note: "The numbered parameter '{{matchString}}' from the source string does not appear in the target string",
        regexps: [ "\\{\\s*(?<match>\\d[^}]*?)\\s*\\}" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-javascript/docs/resource-csharp-numbered-params.md"
    },
    {
        type: "resource-matcher",
        name: "resource-tap-named-params",
        description: "Ensure that named parameters in Tap I18n that appear in the source string are also used in the translated string",
        note: "The named parameter '__{matchString}__' from the source string does not appear in the target string",
        regexps: [ "__(?<match>[a-zA-Z_][a-zA-Z0-9_.]*?)__" ],
        link: "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-tap-named-params.md"
    }
];

// built-in ruleset that contains all the built-in rules
export const builtInRulesets = {
    generic: {
        // programmatic rules
        "resource-icu-plurals": true,
        "resource-quote-style": true,
        "resource-state-checker": true,
        "resource-unique-keys": true,
        "resource-edge-whitespace": true,
        "resource-completeness": true,
        "resource-no-translation": true,
        "resource-icu-plurals-translated": true,
        "resource-xml": true,
        "resource-snake-case": true,
        "resource-camel-case": true,
        "resource-kebab-case": true,

        // declarative rules from above
        "resource-url-match": true,
        "resource-named-params": true,
        "resource-no-escaped-curly-braces": true,
        "resource-no-fullwidth-latin": true,
        "resource-no-fullwidth-digits": true,
        "resource-no-fullwidth-punctuation-subset": true,
        "resource-no-space-between-double-and-single-byte-character": true,
        "resource-no-halfwidth-kana-characters": true,
        "resource-no-double-byte-space": true,
        "resource-no-space-with-fullwidth-punctuation": true,
        "resource-apostrophe": true,
    },

    xliff: {
        "file-encoding": true,
        "xliff-header-encoding": true,
        "utf-bom": true,
    },

    gnu: {
        // GNU printf style parameter matching
        "resource-gnu-printf-match": true,
    },

    source: {
        "resource-source-icu-plural-syntax": true,
        "resource-source-icu-plural-categories": true,
        "source-no-escaped-curly-braces": true,
        "source-no-dashes-in-replacement-params": true,
        "source-no-lazy-plurals": true,
        "source-no-manual-percentage-formatting": true,
        "source-no-noun-replacement-params": true,
        "source-no-manual-currency-formatting": true,
        "source-icu-plural-params": true,
        "source-icu-unexplained-params": true
    },
    "angular": {
        "resource-angular-named-params": true
    },
    "vue": {
        "resource-angular-named-params": true
    },
    "csharp": {
        "resource-csharp-numbered-params": true
    },
    "windows": {
        "resource-return-char": true
    },
    "punctuation-checks": {
        "resource-sentence-ending": true
    },
    "tap": {
        "resource-tap-named-params": true
    }
};

/**
 * @class ilib-lint plugin that can parse XLIFF files
 */
class BuiltinPlugin extends Plugin {
    /**
     * Create a new xliff plugin instance.
     * @constructor
     */
    constructor(options) {
        super(options);
    }

    /**
     * For a "parser" type of plugin, this returns a list of Parser classes
     * that this plugin implements.
     *
     * @returns {Array.<Parser>} list of Parser classes implemented by this
     * plugin
     */
    getParsers() {
        return [XliffParser, LineParser, StringParser, ByteParser];
    }

    /**
     * For a "transformer" type of plugin, this returns a list of Transformer classes
     * that this plugin implements.
     *
     * @returns {Array.<Transformer>} list of Transformer classes implemented by this
     * plugin
     */
    getTransformers() {
        return [ErrorFilterTransformer];
    }

    /**
     * For a "serializer" type of plugin, this returns a list of Serializer classes
     * that this plugin implements.
     *
     * @returns {Array.<Serializer>} list of Serializer classes implemented by this
     * plugin
     */
    getSerializers() {
        return [XliffSerializer, LineSerializer, StringSerializer];
    }

    /**
     * @override
     */
    getRules() {
        return [
            ResourceICUPlurals,
            ResourceICUPluralTranslation,
            ResourceQuoteStyle,
            ResourceSentenceEnding,
            ResourceUniqueKeys,
            ResourceEdgeWhitespace,
            ResourceCompleteness,
            ResourceDNTTerms,
            ResourceNoTranslation,
            ResourceStateChecker,
            ResourceSourceICUPluralSyntax,
            ResourceSourceICUPluralParams,
            ResourceSourceICUPluralCategories,
            ResourceSourceICUUnexplainedParams,
            ResourceXML,
            ResourceCamelCase,
            ResourceSnakeCase,
            ResourceKebabCase,
            ResourceAllCaps,
            ResourceGNUPrintfMatch,
            ResourceReturnChar,
            FileEncodingRule,
            XliffHeaderEncoding,
            BOMRule,
            ...regexRules
        ];
    }

    /**
     * @override
     */
    getRuleSets() {
        return builtInRulesets;
    }

    /**
     * @override
     */
    getFormatters() {
        return [AnsiConsoleFormatter, JsonFormatter];
    }

    getFixers() {
        return [
            StringFixer,
            ResourceFixer,
            ByteFixer
        ];
    }
};

export default BuiltinPlugin;
