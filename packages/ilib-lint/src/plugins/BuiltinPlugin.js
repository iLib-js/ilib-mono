/*
 * BuiltinPlugin.js - plugin that houses all of the built-in
 * rules and parsers
 *
 * Copyright © 2022-2024 JEDLSoft
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
import LineParser from './LineParser.js';
import StringParser from './string/StringParser.js';
import AnsiConsoleFormatter from '../formatters/AnsiConsoleFormatter.js';
import ResourceICUPlurals from '../rules/ResourceICUPlurals.js';
import ResourceICUPluralTranslation from '../rules/ResourceICUPluralTranslation.js';
import ResourceQuoteStyle from '../rules/ResourceQuoteStyle.js';
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

// built-in declarative rules
export const regexRules = [
    {
        type: "resource-matcher",
        name: "resource-url-match",
        description: "Ensure that URLs that appear in the source string are also used in the translated string",
        note: "URL '{matchString}' from the source string does not appear in the target string",
        regexps: [ "((https?|github|ftps?|mailto|file|data|irc):\\/\\/)([\\da-zA-Z\\.-]+)\\.([a-zA-Z\\.]{2,6})([\\/\w\\.-]*)*\\/?" ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-url-match.md"
    },
    {
        type: "resource-matcher",
        name: "resource-named-params",
        description: "Ensure that named parameters that appear in the source string are also used in the translated string",
        note: "The named parameter '{matchString}' from the source string does not appear in the target string",
        regexps: [ "\\{\\w+\\}" ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-named-params.md"
    },
    {
        type: "resource-target",
        name: "resource-no-fullwidth-latin",
        description: "Ensure that the target does not contain any full-width Latin characters.",
        note: "The full-width characters '{matchString}' are not allowed in the target string. Use ASCII letters instead.",
        regexps: [ "[\\uFF21-\\uFF3A\\uFF41-\\uFF5A]+" ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-no-fullwidth-latin.md"
    },
    {
        type: "resource-target",
        name: "resource-no-fullwidth-digits",
        description: "Ensure that the target does not contain any full-width digits.",
        note: "The full-width characters '{matchString}' are not allowed in the target string. Use ASCII digits instead.",
        regexps: [ "[\\uFF10-\\uFF19]+" ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-no-fullwidth-digits.md"
    },
    {
        type: "resource-target",
        name: "resource-no-fullwidth-punctuation-subset",
        description: "Ensure that the target does not contain specific full-width punctuation: percent sign, question mark, or exclamation mark.",
        note: "The full-width characters '{matchString}' are not allowed in the target string. Use ASCII symbols instead.",
        regexps: [ "[\\uFF01\\uFF05\\uFF1F]+" ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-no-fullwidth-punctuation-subset.md",
        locales: "ja"
    },
        {
        type: "resource-target",
        name: "resource-no-space-between-double-and-single-byte-character",
        description: "Ensure that the target does not contain a space character between a double-byte and single-byte character.",
        note: "The space character is not allowed in the target string between a double- and single-byte character. Remove the space character.",
        regexps: [ "[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF]\\s+[\\x00-\\x20\\x30-\\x39\\x41-\\x5A\\x61-\\x7A\\x8A\\x8C\\x8E\\x9A\\x9C\\x9E\\x9F\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF]|[\\x00-\\x20\\x30-\\x39\\x41-\\x5A\\x61-\\x7A\\x8A\\x8C\\x8E\\x9A\\x9C\\x9E\\x9F\\xC0-\\xD6\\xD8-\\xF6\\xF8-\\xFF]\\s+[\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FAF]" ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-no-space-between-double-and-single-byte-character.md",
        severity: "warning",
        locales: "ja"
    },
    {
        type: "resource-target",
        name: "resource-no-halfwidth-kana-characters",
        description: "Ensure that the target does not contain half-width kana characters.",
        note: "The half-width kana characters are not allowed in the target string. Use full-width characters.",
        regexps: [ "[ｧ-ﾝﾞﾟ]+" ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-no-halfwidth-kana-characters.md",
        severity: "warning"
    },
    {
        type: "resource-target",
        name: "resource-no-double-byte-space",
        description: "Ensure that the target does not contain double-byte space characters.",
        note: "Double-byte space characters should not be used in the target string. Use ASCII symbols instead.",
        // per https://en.wikipedia.org/wiki/Whitespace_character
        regexps: [ "[\\u1680\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200A\\u2028\\u2029\\u202F\\u205F\\u3000]+" ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-no-double-byte-space.md",
        severity: "warning",
        locales: "ja"
    },
    {
        type: "resource-target",
        name: "resource-no-space-with-fullwidth-punctuation",
        description: "Ensure that there is no whitespace adjacent to the fullwidth punctuation characters.",
        note: "There should be no space adjacent to fullwidth punctuation characters '{matchString}'. Remove it.",
        regexps: [ "(\\s+[\\u3001\\u3002\\u3008-\\u3011\\u3014-\\u301B]|[\\u3001\\u3002\\u3008-\\u3011\\u3014-\\u301B]\\s+)" ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-no-space-with-fullwidth-punctuation.md",
        severity: "warning",
        locales: "ja"
    },
    {
        type: "resource-source",
        name: "source-no-escaped-curly-braces",
        description: "Ensure that there are no replacement variables surrounded by single quotes which escape them in the source strings.",
        note: "There should be no escaped replacement parameters. Use Unicode quotes ‘like this’ (U+2018 and U+2019) or double quotes instead.",
        regexps: [ "(?:^|[^'])(?<match>''?\\{.*?\\}''?)" ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/source-no-escaped-curly-braces.md",
        severity: "error",
        useStripped: false
    },
    {
        type: "resource-target",
        name: "resource-no-escaped-curly-braces",
        description: "Ensure that there are no replacement variables surrounded by single quotes which escape them in the target strings.",
        note: "There should be no escaped replacement parameters in the translation. Use quotes that are native for the target language or use tripled single-quotes instead.",
        regexps: [ "(?:^|[^'])(?<match>''?\\{.*?\\}''?)" ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-no-escaped-curly-braces.md",
        severity: "error",
        useStripped: false
    },
    {
        type: "resource-source",
        name: "source-no-dashes-in-replacement-params",
        description: "Ensure that source strings do not contain dashes in the replacement parameters.",
        note: "Dashes are not allowed in replacement parameters. Use a different character such as underscore.",
        regexps: [ "(?:^|[^'])(?<match>\\{[^}]*?-[^}]*\\})" ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/source-no-dashes-in-replacement-params.md",
        severity: "error"
    },
    {
        type: "resource-source",
        name: "source-no-lazy-plurals",
        description: "Ensure that source strings do not contain the (s) construct to indicate a possible plural. That is not translatable to many languages.",
        note: "The (s) construct is not allowed in source strings. Use real plural syntax instead.",
        regexps: [ "(?<match>\\w+\\(s\\))(?:\\s|\\p{P}|$)" ],  // \p{P} means punctuation
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/source-no-lazy-plurals.md",
        severity: "warning"
    },
    {
        type: "resource-source",
        name: "source-no-manual-percentage-formatting",
        description: "Ensure that source strings do not contain percentage formatting. Percentages should be formatted using a locale-sensitive number formatter instead.",
        note: "Do not format percentages in English strings. Use a locale-sensitive number formatter and substitute the result of that into this string.",
        regexps: [ "(?<match>\\{[\\w_.$0-9]+\\}\\s*%)(\\s|$)" ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/source-no-manual-percentage-formatting.md",
        severity: "warning"
    },
    {
        type: "resource-source",
        name: "source-no-noun-replacement-params",
        description: "Ensure that source strings do not contain replacement parameters that are nouns or adjectives.",
        note: "Do not substitute nouns into UI strings. Use separate strings for each noun instead.",
        regexps: [ "\\b(?<match>([Aa][Nn]?|[Tt][Hh][Ee])\\s+\\{.*?\\})" ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/source-no-noun-replacement-params.md",
        severity: "error",
        useStripped: false
    },
    {
        type: "resource-source",
        name: "source-no-manual-currency-formatting",
        description: "Ensure that source strings do not contain currency formatting. Currencies should be formatted using a locale-sensitive number formatter instead.",
        note: "Do not format currencies in English strings. Use a locale-sensitive number formatter and substitute the result of that into this string.",
        regexps: [ "(?<match>\\$\\s*\\{[\\w_.$0-9]+\\})" ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/source-no-manual-currency-formatting.md",
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
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/source-no-manual-date-formatting.md",
        severity: "error"
    },
    {
        type: "resource-matcher",
        name: "resource-snake-case",
        description: "Ensure that when source strings contain only snake case (words and/or numbers separeated by underscores) and no whitespace, then the targets are the same",
        note: "Do not translate the source string if it consists solely of snake-cased strings and/or digits. Please update the target string so it matches the source string.",
        regexps: [
            "^\\s*[a-zA-Z0-9]*(_[a-zA-Z0-9]+)+\\s*$",
            "^\\s*[a-zA-Z0-9]+(_[a-zA-Z0-9]+)*_\\s*$"
        ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-snake-case.md",
        severity: "error"
    },
    {
        type: "resource-matcher",
        name: "resource-camel-case",
        description: "Ensure that when source strings contain only camel case and no whitespace, then the targets are the same",
        note: "Do not translate the source string if it consists solely of camel-cased strings and/or digits. Please update the target string so it matches the source string.",
        regexps: [
            "^\\s*[a-z\\d]+([A-Z][a-z\\d]+)+\\s*$", // camelCase and 6amelCaseWithD1g1t3
            "^\\s*[A-Z][a-z\\d]+([A-Z][a-z\\d]+)+\\s*$", // PascalCase and 4ascalCaseWithD1g1t3
        ],
        link: "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-camel-case.md",
        severity: "error"
    },
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
        "resource-snake-case": true,
        "resource-camel-case": true,
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
        return [XliffParser, LineParser, StringParser];
    }

    /**
     * @override
     */
    getRules() {
        return [
            ResourceICUPlurals,
            ResourceICUPluralTranslation,
            ResourceQuoteStyle,
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
        return [AnsiConsoleFormatter];
    }

    getFixers() {
        return [];
    }
};

export default BuiltinPlugin;
