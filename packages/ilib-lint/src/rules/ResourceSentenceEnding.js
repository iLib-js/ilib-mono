/*
 * ResourceSentenceEnding.js - rule to check sentence-ending punctuation in the target string
 *
 * Copyright © 2025 JEDLSoft
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

/**
 * ResourceSentenceEnding - Checks that sentence-ending punctuation is appropriate for the target locale
 *
 * This rule checks if the source string ends with certain punctuation marks and ensures
 * the target uses the locale-appropriate equivalent.
 *
 * Examples:
 * - English period (.) should become Japanese maru (。) in Japanese
 * - English question mark (?) should become Japanese question mark (？) in Japanese
 * - English exclamation mark (!) should become Japanese exclamation mark (！) in Japanese
 * - English ellipsis (...) should become Japanese ellipsis (…) in Japanese
 * - English colon (:) should become Japanese colon (：) in Japanese
 */

import { Result } from 'ilib-lint-common';
import ResourceRule from './ResourceRule.js';
import Locale from 'ilib-locale';
import LocaleInfo from 'ilib-localeinfo';
import ResourceFixer from '../plugins/resource/ResourceFixer.js';
import { isPunct, isSpace } from 'ilib-ctype';

/** @ignore @typedef {import("ilib-tools-common").Resource} Resource */
/** @ignore @typedef {import("ilib-lint-common").Fix} Fix */

/** @ignore
 * Default punctuation for each punctuation type
 */
const defaults = {
    'period': '.',
    'question': '?',
    'exclamation': '!',
    'ellipsis': '…',
    'colon': ':'
};

/** @ignore
 * Punctuation map for each language, with default punctuation for each punctuation type
 */
const punctuationMap = {
    'ja': { 'period': '。', 'question': '？', 'exclamation': '！', 'ellipsis': '…', 'colon': '：' },
    'zh': { 'period': '。', 'question': '？', 'exclamation': '！', 'ellipsis': '…', 'colon': '：' },
    'el': { 'period': '.', 'question': ';', 'exclamation': '!', 'ellipsis': '...', 'colon': ':' },
    'ar': { 'period': '.', 'question': '؟', 'exclamation': '!', 'ellipsis': '…', 'colon': ':' },
    'bo': { 'period': '།', 'question': '།', 'exclamation': '།', 'ellipsis': '…', 'colon': '།' },
    'am': { 'period': '።', 'question': '፧', 'exclamation': '!', 'ellipsis': '…', 'colon': ':' },
    'ur': { 'period': '۔', 'question': '؟', 'exclamation': '!', 'ellipsis': '…', 'colon': ':' },
    'as': { 'period': '।', 'question': '?', 'exclamation': '!', 'ellipsis': '…', 'colon': ':' },
    'hi': { 'period': '।', 'question': '?', 'exclamation': '!', 'ellipsis': '…', 'colon': ':' },
    'or': { 'period': '।', 'question': '?', 'exclamation': '!', 'ellipsis': '…', 'colon': ':' },
    'pa': { 'period': '।', 'question': '?', 'exclamation': '!', 'ellipsis': '…', 'colon': ':' },
    'kn': { 'period': '।', 'question': '?', 'exclamation': '!', 'ellipsis': '…', 'colon': ':' },
    'km': { 'period': '។', 'question': '?', 'exclamation': '!', 'ellipsis': '…', 'colon': ':' },
    'bn': { 'period': '।', 'question': '?', 'exclamation': '!', 'ellipsis': '…', 'colon': ':' }
};

/**
 * @class ResourceSentenceEnding
 * @extends ResourceRule
 */
class ResourceSentenceEnding extends ResourceRule {
    constructor(options) {
        super(options);
        this.name = "resource-sentence-ending";
        this.description = "Checks that sentence-ending punctuation is appropriate for the locale of the target string and matches the punctuation in the source string";
        this.link = "https://github.com/iLib-js/ilib-lint/blob/main/docs/resource-sentence-ending.md";

        // Initialize custom punctuation mappings from configuration
        this.customPunctuationMap = {};
        if (options && typeof options === 'object' && !Array.isArray(options)) {
                    // options is an object with locale codes as keys and punctuation mappings as values
        // Merge the default punctuation with the custom punctuation so that the custom
        // punctuation overrides the default and we don't have to specify all punctuation types.
        // Custom maps are stored by language, not locale, so that they apply to all locales of
        // that language.
        for (const locale in options) {
            const localeObj = new Locale(locale);

            // only process config for valid locales
            if (localeObj.isValid()) {
                const language = localeObj.getLanguage();
                // locale must have a language code
                if (!language) continue;
                // Apply locale-specific defaults for any locale that usesthis language
                const localeDefaults = this.getLocaleDefaults(language);
                this.customPunctuationMap[language] = {
                    ...localeDefaults,
                    ...options[locale]
                };
            }
        }
        }

        // Build the set of sentence-ending punctuation characters dynamically
        this.sentenceEndingPunctuationSet = this.buildSentenceEndingPunctuationSet();
    }

    /**
     * Build a set of all sentence-ending punctuation characters from all locale configurations
     * This ensures that when new languages are added, their punctuation is automatically
     * included without needing to manually update this method.
     *
     * The set includes:
     * - Default Western punctuation: . ? ! … :
     * - Japanese/Chinese: 。 ？ ！ … ：
     * - Arabic: ؟
     * - Amharic: ። ፧
     * - Urdu: ۔
     * - Indic scripts: । ᠀
     * - Khmer: ។
     * - Tibetan: །
     * - And any custom punctuation from configuration
     *
     * @returns {Set} - Set of all sentence-ending punctuation characters
     */
    buildSentenceEndingPunctuationSet() {
        const punctuationSet = new Set();

        // Add default punctuation
        Object.values(defaults).forEach(punct => {
            if (punct) punctuationSet.add(punct);
        });

        // Add punctuation from all locale configurations
        for (const language in this.customPunctuationMap) {
            Object.values(this.customPunctuationMap[language]).forEach(punct => {
                if (punct) punctuationSet.add(punct);
            });
        }

        // Add punctuation from all built-in locale defaults
        // Get the languages from the punctuationMap in getLocaleDefaults
        const allLanguages = Object.keys(punctuationMap);
        allLanguages.forEach(language => {
            const localeDefaults = this.getLocaleDefaults(language);
            Object.values(localeDefaults).forEach(punct => {
                if (punct) punctuationSet.add(punct);
            });
        });

        return punctuationSet;
    }

    /**
     * Check if a character is sentence-ending punctuation
     * @param {string} char - The character to check
     * @returns {boolean} - True if the character is sentence-ending punctuation
     */
    isSentenceEndingPunctuation(char) {
        // Only these characters are considered sentence-ending punctuation
        // This excludes: { } ( ) [ ] < > , ; % - etc.
        return this.sentenceEndingPunctuationSet.has(char);
    }

    /**
     * Check if the given string ends with any of the configured punctuation patterns
     * @param {string} str - The string to check
     * @param {Locale} locale - The locale code of the string
     * @returns {Object|null} - Object with type and original punctuation, or null if no match
     */
    getEndingPunctuation(str, locale) {
        if (!str || typeof str !== 'string') return null;

        const trimmed = str.trim();
        if (!trimmed) return null;

        // Strip trailing quotes and whitespace to find the actual ending punctuation
        const stripped = ResourceSentenceEnding.stripTrailingQuotesAndWhitespace(trimmed);
        if (!stripped) return null;

        // Check for ellipsis first (three dots or Unicode ellipsis)
        if (stripped.endsWith('...')) {
            return { type: 'ellipsis', original: '...' };
        }
        if (stripped.endsWith('…')) {
            return { type: 'ellipsis', original: '…' };
        }

        // Check if the last character is sentence-ending punctuation
        const lastChar = stripped.charAt(stripped.length - 1);
        if (!this.isSentenceEndingPunctuation(lastChar)) return null;

        // Determine the punctuation type based on the character
        let type = 'period'; // default
        let original = lastChar;

        // Check for specific punctuation types
        if (lastChar === this.getExpectedPunctuation(locale, 'question')) {
            type = 'question';
        } else if (lastChar === this.getExpectedPunctuation(locale, 'exclamation')) {
            type = 'exclamation';
        } else if (lastChar === this.getExpectedPunctuation(locale, 'colon')) {
            type = 'colon';
        } else if (lastChar === this.getExpectedPunctuation(locale, 'period')) {
            type = 'period';
        } else {
            type = 'unknown';
        }

        return { type, original };
    }

    /**
     * Get the expected punctuation for the given locale and punctuation type
     * @param {Locale} localeObj - The parsed locale object
     * @param {string} type - The punctuation type
     * @returns {string|null} - The expected punctuation for the locale, or null if punctuation is optional
     */
    getExpectedPunctuation(localeObj, type) {
        const language = localeObj.getLanguage();
        if (!language) return null;
        // Custom config
        if (this.customPunctuationMap[language] && this.customPunctuationMap[language][type]) {
            return this.customPunctuationMap[language][type];
        }
        // For English ellipsis, only accept the default (Unicode ellipsis) in the target
        if (language === 'en' && type === 'ellipsis') {
            return defaults['ellipsis'];
        }
        // Get locale-specific defaults for this language
        const localeDefaults = this.getLocaleDefaults(language);
        const result = localeDefaults[type] || this.getDefaultPunctuation(type);
        return result;
    }

    /**
     * Get locale-specific defaults for a given language
     * @param {string} language - The language code
     * @returns {Object} - The locale-specific defaults for the language
     */
    getLocaleDefaults(language) {
        return punctuationMap[language] || defaults;
    }

    /**
     * Get a regex that matches all expected punctuation for a given locale
     * @param {Locale} localeObj locale of the punctuation
     * @returns {string} regex string that matches all expected punctuation for the locale
     */
    getExpectedPunctuationRegex(localeObj) {
        const language = localeObj.getLanguage();
        let config;
        if (language) {
            config = this.customPunctuationMap[language];
            if (!config) {
                config = this.getLocaleDefaults(language);
            }
        } else {
            config = defaults;
        }
        return Object.values(config).join('').replace(/\./g, '\\.').replace(/\?/g, '\\?');
    }

    /**
     * Get default punctuation (Western/English style)
     * @param {string} type - The punctuation type
     * @returns {string} - The default punctuation
     */
    getDefaultPunctuation(type) {
        return defaults[type] || defaults['period'];
    }

    // Superset of quote characters from ResourceQuoteStyle.js, plus ASCII quotes
    static allQuoteChars = '"' + "'" + "«»‘“”„「」’‚‹›『』";

    /**
     * Find the last non-quote, non-whitespace character, and return the substring up to and including it.
     * This is used to check the actual sentence-ending punctuation before any trailing quotes or spaces.
     * @param {string} str
     * @returns {string}
     */
    static stripTrailingQuotesAndWhitespace(str) {
        if (!str) return str;
        // Find the last non-quote, non-whitespace character
        const quoteChars = ResourceSentenceEnding.allQuoteChars;
        // This regex matches trailing quotes and whitespace
        const regex = new RegExp(`[${quoteChars.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\s]+$`, 'u');
        // Remove trailing quotes/whitespace
        let trimmed = str.replace(regex, '');
        // Now, find the last non-quote, non-whitespace character
        let i = trimmed.length - 1;
        while (i >= 0 && (quoteChars.includes(trimmed[i]) || /\s/.test(trimmed[i]))) {
            i--;
        }
        return trimmed.substring(0, i + 1);
    }

    /**
     * Check if the target string has the expected ending punctuation
     * @param {string} target - The target string
     * @param {string|string[]} expected - The expected punctuation(s)
     * @param {string} original - The original punctuation from source
     * @returns {boolean} - True if the target has the expected ending
     */
    hasExpectedEnding(target, expected, original) {
        if (!target || typeof target !== 'string') return false;
        const stripped = target.trim();
        if (!stripped) return false;
        if (Array.isArray(expected)) {
            return expected.some(e => stripped.endsWith(e));
        }
        return stripped.endsWith(expected);
    }

    /**
     * Get the last quoted string in the input, or null if none found.
     * Handles all quote types in allQuoteChars.
     * @param {string} str
     * @returns {string|null}
     */
    static getLastQuotedString(str) {
        if (!str) return null;
        const quoteChars = ResourceSentenceEnding.allQuoteChars;
        let lastOpen = -1, lastClose = -1;
        for (let i = str.length - 1; i >= 0; i--) {
            if (quoteChars.includes(str[i])) {
                lastClose = i;
                // Find the matching opening quote
                for (let j = i - 1; j >= 0; j--) {
                    if (quoteChars.includes(str[j])) {
                        lastOpen = j;
                        break;
                    }
                }
                break;
            }

        }
        if (lastOpen !== -1 && lastClose !== -1 && lastOpen < lastClose) {
            return str.substring(lastOpen + 1, lastClose);
        }
        return null;
    }

    /**
     * Get the last sentence from a string, handling quoted content.
     * For source strings: only return quoted content if the string ends with a quote; otherwise return the full string.
     * For target strings: return the last quoted content anywhere in the string, or the full string if no quotes.
     * @param {string} str
     * @param {boolean} isSource - true if this is a source string, false if target string
     * @param {Locale} targetLocaleObj - locale of the punctuation
     * @returns {string}
     */
    getLastSentence(str, isSource, targetLocaleObj) {
        if (!str) return str;
        const quoteChars = ResourceSentenceEnding.allQuoteChars;
        const trimmedStr = str.trim();

        const lastQuotedString = ResourceSentenceEnding.getLastQuotedString(trimmedStr);
        if (lastQuotedString !== null) {
            return lastQuotedString;
        } else {
            return this.getLastSentenceFromContent(trimmedStr, targetLocaleObj);
        }
    }

    /**
     * Get the last sentence from content without considering outer quotes
     * @param {string} content
     * @param {Locale} targetLocaleObj
     * @returns {string}
     */
    getLastSentenceFromContent(content, targetLocaleObj) {
        if (!content) return content;
        // Only treat .!?。？！ as sentence-ending punctuation, not ¿ or ¡
        const allSentenceEnding = this.getExpectedPunctuationRegex(targetLocaleObj);
        const sentenceEndingRegex = new RegExp(`[^${allSentenceEnding}]+\\p{P}?\\w*$`, 'gu');
        const match = sentenceEndingRegex.exec(content);
        if (match !== null && match.length > 0) {
            let lastSentence = match[0].trim();
            const quoteChars = ResourceSentenceEnding.allQuoteChars;
            const lastChar = lastSentence.charAt(lastSentence.length - 1);
            // If the last sentence ends with a quote, try to extract the last quoted segment
            if (quoteChars.includes(lastChar)) {
                // Find the last matching opening quote
                for (let i = lastSentence.length - 2; i >= 0; i--) {
                    if (quoteChars.includes(lastSentence.charAt(i))) {
                        // Extract content inside the last pair of quotes
                        return lastSentence.substring(i + 1, lastSentence.length - 1);
                    }
                }
            }
            // If the last sentence is entirely quoted, extract the content inside the quotes
            const firstChar = lastSentence.charAt(0);
            if (quoteChars.includes(firstChar) && quoteChars.includes(lastChar) && lastSentence.length > 1) {
                lastSentence = lastSentence.substring(1, lastSentence.length - 1);
            }
            return lastSentence;
        }
        // If not matched, return the whole string
        return content.trim();
    }

    /**
     * Get Unicode code for a character
     * @param {string} char - The character to get the Unicode code for
     * @returns {string} - The Unicode code in format "U+XXXX"
     */
    static getUnicodeCode(char) {
        if (!char || char.length === 0) return '';
        const code = char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0');
        return `U+${code}`;
    }

    /**
     * Get Unicode codes for a string
     * @param {string} str - The string to get Unicode codes for
     * @returns {string} - The Unicode codes in format "U+XXXX U+YYYY U+ZZZZ"
     */
    static getUnicodeCodes(str) {
        if (!str) return '';
        return str.split('').map(char => ResourceSentenceEnding.getUnicodeCode(char)).join(' ');
    }

    /**
     * Check if Spanish target has the correct inverted punctuation at the beginning of the last sentence
     * @param {string} lastSentence - The last sentence of the target string (already stripped of quotes)
     * @param {string} sourceEndingType - The type of ending punctuation in source
     * @returns {boolean} - True if Spanish target has correct inverted punctuation at start of last sentence
     */
    hasCorrectSpanishInvertedPunctuation(lastSentence, sourceEndingType) {
        if (!lastSentence || typeof lastSentence !== 'string') return false;
        // Only check for questions and exclamations
        if (sourceEndingType !== 'question' && sourceEndingType !== 'exclamation') {
            return true; // Not applicable for other punctuation types
        }
        // Strip any leading quote characters before checking for inverted punctuation
        const quoteChars = ResourceSentenceEnding.allQuoteChars;
        let strippedSentence = lastSentence;
        while (strippedSentence.length > 0 && (quoteChars.includes(strippedSentence.charAt(0)) || isSpace(strippedSentence.charAt(0)))) {
            strippedSentence = strippedSentence.slice(1);
        }
        // Check for inverted punctuation at the beginning of the stripped last sentence
        const expectedInverted = sourceEndingType === 'question' ? '¿' : '¡';
        return strippedSentence.startsWith(expectedInverted);
    }

    /**
     * Find the position of the incorrect punctuation in the target string
     * @param {string} target - The target string
     * @param {string} lastSentence - The last sentence from the target
     * @param {string} incorrectPunctuation - The incorrect punctuation to find
     * @returns {Object|null} - Object with position and length, or null if not found
     */
    findIncorrectPunctuationPosition(target, lastSentence, incorrectPunctuation) {
        if (!target || !lastSentence || !incorrectPunctuation) return null;

        // Find the position of the incorrect punctuation in the last sentence
        const punctuationLength = incorrectPunctuation.length;
        const endPosition = lastSentence.trimEnd().length - punctuationLength;

        if (endPosition >= 0 && lastSentence.trimEnd().substring(endPosition) === incorrectPunctuation) {
            // Find the position of the last sentence within the target string
            const lastSentenceStart = target.lastIndexOf(lastSentence);
            if (lastSentenceStart !== -1) {
                return {
                    position: lastSentenceStart + endPosition,
                    length: punctuationLength
                };
            }
        }

        return null;
    }

    /**
     * Create a fix to replace the incorrect punctuation with the correct one
     * @param {Resource} resource - The resource object
     * @param {string} target - The target string
     * @param {string} incorrectPunctuation - The incorrect punctuation
     * @param {string} correctPunctuation - The correct punctuation
     * @returns {Fix|undefined} - The fix object or undefined if no fix can be created
     */
    createPunctuationFix(resource, target, incorrectPunctuation, correctPunctuation, index, category, targetLocaleObj) {
        // Get the last sentence to find the position
        const lastSentence = this.getLastSentence(target, false, targetLocaleObj);

        // If we're adding punctuation (incorrectPunctuation is empty), add it at the end
        if (!incorrectPunctuation && correctPunctuation) {
            return this.createInsertCharacterFix(resource, target, target.length, correctPunctuation, index, category);
        }

        // If we're removing punctuation (correctPunctuation is empty), remove it
        if (incorrectPunctuation && !correctPunctuation) {
            const positionInfo = this.findIncorrectPunctuationPosition(target, lastSentence, incorrectPunctuation);
            if (!positionInfo) return undefined;

            return ResourceFixer.createFix({
                resource,
                index,
                category,
                commands: [
                    ResourceFixer.createStringCommand(
                        positionInfo.position,
                        positionInfo.length,
                        correctPunctuation
                    )
                ]
            });
        }

        // Normal case: replacing punctuation
        const positionInfo = this.findIncorrectPunctuationPosition(target, lastSentence, incorrectPunctuation);
        if (!positionInfo) return undefined;

        return ResourceFixer.createFix({
            resource,
            index,
            category,
            commands: [
                ResourceFixer.createStringCommand(
                    positionInfo.position,
                    positionInfo.length,
                    correctPunctuation
                )
            ]
        });
    }

    /**
     * Create a generic fix to insert a character at a specific position.
     *
     * @param {Resource} resource - The resource object
     * @param {string} target - The target string
     * @param {number} position - The position where the character should be inserted
     * @param {string} character - The character to insert
     * @param {number} [index] - Index for array/plural resources
     * @param {string} [category] - Category for plural resources
     * @returns {Fix|undefined} - The fix object or undefined if no fix can be created
     */
    createInsertCharacterFix(resource, target, position, character, index, category) {
        return ResourceFixer.createFix({
            resource,
            index,
            category,
            commands: [
                // Insert the character at the specified position
                ResourceFixer.createStringCommand(
                    position,
                    0,
                    character
                )
            ]
        });
    }

    /**
     * Create a fix to insert the correct starting punctuation for a Spanish question or exclamation
     * at the beginning of the last sentence.
     *
     * @param {Resource} resource - The resource object
     * @param {string} target - The target string
     * @param {string} lastSentence - The last sentence from the target
     * @param {string} correctPunctuation - The correct punctuation
     * @param {number} [index] - Index for array/plural resources
     * @param {string} [category] - Category for plural resources
     * @param {Locale} [targetLocaleObj] - The target locale object (unused, kept for compatibility)
     * @returns {Fix|undefined} - The fix object or undefined if no fix can be created
     */
    createFixForSpanishInvertedPunctuation(resource, target, lastSentence, correctPunctuation, index, category, targetLocaleObj) {
        const lastSentenceStart = target.lastIndexOf(lastSentence);
        return this.createInsertCharacterFix(resource, target, lastSentenceStart, correctPunctuation, index, category);
    }

    /**
     * Create a fix to insert or replace a non-breaking space before sentence-ending punctuation for French.
     *
     * @param {Resource} resource - The resource object
     * @param {string} target - The target string
     * @param {number} position - The position where the non-breaking space should be inserted/replaced
     * @param {string} nonBreakingSpace - The non-breaking space character to insert
     * @param {number} [index] - Index for array/plural resources
     * @param {string} [category] - Category for plural resources
     * @returns {Fix|undefined} - The fix object or undefined if no fix can be created
     */
    createFixForFrenchNonBreakingSpace(resource, target, position, nonBreakingSpace, index, category) {
        return this.createInsertCharacterFix(resource, target, position, nonBreakingSpace, index, category);
    }

    /**
     * Create a fix for French wrong punctuation cases that handles both space and punctuation issues.
     *
     * @param {Resource} resource - The resource object
     * @param {string} target - The target string
     * @param {number} punctuationPosition - The position of the punctuation
     * @param {string} expectedPunctuation - The expected punctuation
     * @param {string} nonBreakingSpace - The non-breaking space character
     * @param {boolean} hasRegularSpace - Whether the target has a regular space before punctuation
     * @param {boolean} missingSpace - Whether the target is missing a space before punctuation
     * @param {number} [index] - Index for array/plural resources
     * @param {string} [category] - Category for plural resources
     * @returns {Fix|undefined} - The fix object or undefined if no fix can be created
     */
    createFixForFrenchWrongPunctuation(resource, target, punctuationPosition, expectedPunctuation, nonBreakingSpace, hasRegularSpace, missingSpace, index, category) {
        const commands = [];

        if (hasRegularSpace) {
            // Replace regular space with non-breaking space
            commands.push(
                ResourceFixer.createStringCommand(
                    punctuationPosition - 1,
                    1,
                    nonBreakingSpace
                )
            );
        } else if (missingSpace) {
            // Insert non-breaking space before punctuation
            commands.push(
                ResourceFixer.createStringCommand(
                    punctuationPosition,
                    0,
                    nonBreakingSpace
                )
            );
        }

        // Replace the punctuation
        // If we inserted a space, the punctuation position shifts by 1
        const punctuationReplacementPosition = missingSpace ? punctuationPosition + 1 : punctuationPosition;
        commands.push(
            ResourceFixer.createStringCommand(
                punctuationReplacementPosition,
                1,
                expectedPunctuation
            )
        );

        return ResourceFixer.createFix({
            resource,
            index,
            category,
            commands
        });
    }

    /**
     * Match the source and target strings for sentence ending punctuation issues
     * @param {Object} params - Parameters object
     * @param {string} params.source - The source string
     * @param {string} params.target - The target string
     * @param {Resource} params.resource - The resource object
     * @param {string} params.file - The file path
     * @param {number} [params.index] - Index for array/plural resources
     * @param {string} [params.category] - Category for plural resources
     * @returns {Result|undefined} - Result object if there's an issue, undefined otherwise
     */
    matchString({ source, target, resource, file, index, category }) {
        if (!source || !target) return undefined;

        const targetLocale = resource.getTargetLocale();
        if (!targetLocale) return undefined;
        const targetLocaleObj = new Locale(targetLocale);
        const targetLanguage = targetLocaleObj.getLanguage();
        if (!targetLanguage) return undefined;

        const sourceLocale = resource.getSourceLocale();
        if (!sourceLocale) return undefined;
        const sourceLocaleObj = new Locale(sourceLocale);
        const sourceLanguage = sourceLocaleObj.getLanguage();
        if (!sourceLanguage) return undefined;

        const optionalPunctuationLanguages = ['th', 'lo', 'my', 'km', 'vi', 'id', 'ms', 'tl', 'jv', 'su'];
        const isOptionalPunctuationLanguage = optionalPunctuationLanguages.includes(targetLanguage);

        // Get the ending punctuation from source and target
        const sourceEnding = this.getEndingPunctuation(source, sourceLocaleObj);

        // Determine if the source ends with a quote
        const sourceTrimmed = source.trim();
        const quoteChars = ResourceSentenceEnding.allQuoteChars;
        const sourceEndsWithQuote = quoteChars.includes(sourceTrimmed.charAt(sourceTrimmed.length - 1));

        const regularSpace = ' ';
        const nonBreakingSpace = '\u00A0';
        let fix;

        let lastSentence;
        if (sourceEndsWithQuote) {
            // Use the last quoted string in the target
            lastSentence = ResourceSentenceEnding.getLastQuotedString(target) || target.trim();
        } else {
            // Use the full target string
            lastSentence = this.getLastSentenceFromContent(target, targetLocaleObj);
        }

        const targetEnding = this.getEndingPunctuation(lastSentence, targetLocaleObj);

        // Case 1: Source has no punctuation but target does
        if (!sourceEnding && targetEnding) {
            const unicodeCode = ResourceSentenceEnding.getUnicodeCodes(targetEnding.original);
            const positionInfo = this.findIncorrectPunctuationPosition(target, lastSentence, targetEnding.original);
            let highlight = '';
            if (positionInfo) {
                const beforePunctuation = target.substring(0, positionInfo.position);
                const afterPunctuation = target.substring(positionInfo.position + positionInfo.length);
                highlight = `${beforePunctuation}<e0>${targetEnding.original} (${unicodeCode})</e0>${afterPunctuation}`;
            }

            // Add prefix for array/plural resources
            if (index !== undefined) {
                highlight = `Target[${index}]: ${highlight}`;
            } else if (category) {
                highlight = `Target(${category}): ${highlight}`;
            }

            return new Result({
                rule: this,
                severity: "warning",
                id: resource.getKey(),
                description: `Extra sentence ending punctuation "${targetEnding.original}" (${unicodeCode}) for ${targetLocale} locale`,
                source: source,
                highlight: highlight,
                pathName: file,
                fix: this.createPunctuationFix(resource, target, targetEnding.original, '', index, category, targetLocaleObj),
                lineNumber: typeof(resource['lineNumber']) !== 'undefined' ? resource['lineNumber'] : undefined
            });
        }

        // Case 2: Source has punctuation but target doesn't
        if (sourceEnding && !targetEnding && !isOptionalPunctuationLanguage && sourceEnding.type !== 'unknown') {
            const expectedPunctuation = this.getExpectedPunctuation(targetLocaleObj, sourceEnding.type);
            if (!expectedPunctuation) return undefined;

            let highlight = `${lastSentence}<e0/>`;

            let deleteString = '';
            let insertString = expectedPunctuation;
            if (targetLanguage === 'fr') {
                if (sourceEnding.type === 'question' || sourceEnding.type === 'exclamation' || sourceEnding.type === 'colon') {
                    // For French, we need to insert a non-breaking space before the punctuation
                    insertString = nonBreakingSpace + expectedPunctuation;
                    highlight = `${lastSentence}<e0/>`;
                } else {
                    // For French periods and ellipses, no non-breaking space is needed
                    insertString = expectedPunctuation;
                    highlight = `${lastSentence}<e0/>`;
                }
            }

            const unicodeCode = ResourceSentenceEnding.getUnicodeCodes(insertString);

            // Add prefix for array/plural resources
            if (index !== undefined) {
                highlight = `Target[${index}]: ${highlight}`;
            } else if (category) {
                highlight = `Target(${category}): ${highlight}`;
            }

            return new Result({
                rule: this,
                severity: "warning",
                id: resource.getKey(),
                description: `Missing sentence ending punctuation for ${targetLocale} locale. It should be "${insertString}" (${unicodeCode})`,
                source: source,
                highlight: highlight,
                pathName: file,
                fix: this.createPunctuationFix(resource, target, deleteString, insertString, index, category, targetLocaleObj),
                lineNumber: typeof(resource['lineNumber']) !== 'undefined' ? resource['lineNumber'] : undefined
            });
        }

        // Case 3: Both source and target have punctuation, but they don't match
        if (sourceEnding && targetEnding && sourceEnding.type !== 'unknown') {
            const expectedPunctuation = this.getExpectedPunctuation(targetLocaleObj, sourceEnding.type);
            if (!expectedPunctuation) return undefined;

            // For Spanish, check for inverted punctuation at the beginning
            if (targetLanguage === 'es' && (sourceEnding.type === 'question' || sourceEnding.type === 'exclamation')) {
                if (!this.hasCorrectSpanishInvertedPunctuation(lastSentence, sourceEnding.type)) {
                    // Spanish target is missing inverted punctuation at the beginning
                    const quoteChars = ResourceSentenceEnding.allQuoteChars;
                    let quotedContentStart = -1;
                    for (let i = 0; i < target.length; i++) {
                        if (quoteChars.includes(target.charAt(i))) {
                            quotedContentStart = i + 1;
                            break;
                        }
                    }

                    let highlight;
                    if (quotedContentStart !== -1) {
                        const beforeQuote = target.substring(0, quotedContentStart);
                        const afterQuote = target.substring(quotedContentStart);
                        highlight = `${beforeQuote}<e0/>${afterQuote}`;
                    } else {
                        highlight = `<e0/>${target}`;
                    }

                    // Add prefix for array/plural resources
                    if (index !== undefined) {
                        highlight = `Target[${index}]: ${highlight}`;
                    } else if (category) {
                        highlight = `Target(${category}): ${highlight}`;
                    }

                    const invertedChar = sourceEnding.type === 'question' ? '¿' : '¡';
                    const unicodeCode = ResourceSentenceEnding.getUnicodeCode(invertedChar);
                    return new Result({
                        rule: this,
                        severity: "warning",
                        id: resource.getKey(),
                        description: `Spanish ${sourceEnding.type} should start with "${invertedChar}" (${unicodeCode}) for ${targetLocale} locale`,
                        source: source,
                        highlight: highlight,
                        pathName: file,
                        fix: this.createFixForSpanishInvertedPunctuation(resource, target, lastSentence, invertedChar, index, category, targetLocaleObj),
                        lineNumber: typeof(resource['lineNumber']) !== 'undefined' ? resource['lineNumber'] : undefined
                    });
                }
            }

            // Check if the target punctuation matches the expected punctuation for the locale
            if (targetEnding.type === sourceEnding.type && targetEnding.original === expectedPunctuation) {
                // For French, check for non-breaking space before sentence-ending punctuation
                if (targetLanguage === 'fr' && (sourceEnding.type === 'question' || sourceEnding.type === 'exclamation' || sourceEnding.type === 'colon')) {
                    // Find the punctuation position first, then calculate the space position
                    const positionInfo = this.findIncorrectPunctuationPosition(target, lastSentence, targetEnding.original);
                    if (positionInfo) {
                        const spacePosition = positionInfo.position - 1;

                        // Check if there's a space before the punctuation
                        const lastCharBeforePunctuation = target.charAt(spacePosition);

                        if (lastCharBeforePunctuation === regularSpace) {
                            // French target has regular space instead of non-breaking space
                            // Build the highlight by replacing the space with the highlighted version
                            const beforeSpace = target.substring(0, spacePosition);
                            const afterSpace = target.substring(spacePosition + 1);
                            let highlight = `${beforeSpace}<e0> (U+0020)</e0>${afterSpace}`;

                            // Add prefix for array/plural resources
                            if (index !== undefined) {
                                highlight = `Target[${index}]: ${highlight}`;
                            } else if (category) {
                                highlight = `Target(${category}): ${highlight}`;
                            }

                            return new Result({
                                rule: this,
                                severity: "warning",
                                id: resource.getKey(),
                                description: `Found regular space character (U+0020) before sentence-ending punctuation. A non-breaking space (U+00A0) is required before sentence-ending punctuation for the ${targetLocale} locale`,
                                source: source,
                                highlight: highlight,
                                pathName: file,
                                fix: this.createFixForFrenchNonBreakingSpace(resource, target, spacePosition, nonBreakingSpace, index, category),
                                lineNumber: typeof(resource['lineNumber']) !== 'undefined' ? resource['lineNumber'] : undefined
                            });
                        } else if (lastCharBeforePunctuation !== nonBreakingSpace) {
                            // French target is missing non-breaking space before punctuation
                            const beforePunctuation = target.substring(0, positionInfo.position);
                            const afterPunctuation = target.substring(positionInfo.position);
                            let highlight = `${beforePunctuation}<e0/>${afterPunctuation}`;

                            // Add prefix for array/plural resources
                            if (index !== undefined) {
                                highlight = `Target[${index}]: ${highlight}`;
                            } else if (category) {
                                highlight = `Target(${category}): ${highlight}`;
                            }

                            return new Result({
                                rule: this,
                                severity: "warning",
                                id: resource.getKey(),
                                description: `Non-breaking space (U+00A0) missing before sentence-ending punctuation for ${targetLocale} locale`,
                                source: source,
                                highlight: highlight,
                                pathName: file,
                                fix: this.createFixForFrenchNonBreakingSpace(resource, target, positionInfo.position, nonBreakingSpace, index, category),
                                lineNumber: typeof(resource['lineNumber']) !== 'undefined' ? resource['lineNumber'] : undefined
                            });
                        }
                    }
                }

                return undefined; // Punctuation matches, no issue
            }



            // Target has different punctuation than expected
            const unicodeCode = ResourceSentenceEnding.getUnicodeCodes(targetEnding.original);
            const expectedUnicode = ResourceSentenceEnding.getUnicodeCodes(expectedPunctuation);
            const positionInfo = this.findIncorrectPunctuationPosition(target, lastSentence, targetEnding.original);
            let highlight = '';

            if (positionInfo) {
                const beforePunctuation = target.substring(0, positionInfo.position);
                const afterPunctuation = target.substring(positionInfo.position + positionInfo.length);

                if (targetLanguage === 'fr' && (sourceEnding.type === 'question' || sourceEnding.type === 'exclamation' || sourceEnding.type === 'colon')) {
                    const spacePosition = positionInfo.position - 1;

                    // Check if there's a space before the punctuation
                    const lastCharBeforePunctuation = target.charAt(spacePosition);
                    if (lastCharBeforePunctuation === regularSpace) {
                        // French target has regular space instead of non-breaking space + wrong punctuation
                        highlight = `${beforePunctuation}<e0> (U+0020)</e0>${targetEnding.original}${afterPunctuation}`;
                        return new Result({
                            rule: this,
                            severity: "warning",
                            id: resource.getKey(),
                            description: `Sentence ending punctuation should be "${expectedPunctuation}" (${expectedUnicode}) for ${targetLocale} locale, not " ${targetEnding.original}" (U+0020 ${unicodeCode})`,
                            source: source,
                            highlight: highlight,
                            pathName: file,
                            fix: this.createFixForFrenchWrongPunctuation(resource, target, positionInfo.position, expectedPunctuation, nonBreakingSpace, true, false, index, category),
                            lineNumber: typeof(resource['lineNumber']) !== 'undefined' ? resource['lineNumber'] : undefined
                        });
                    } else if (lastCharBeforePunctuation !== nonBreakingSpace) {
                        // French target is missing non-breaking space + wrong punctuation
                        highlight = `${beforePunctuation}<e0>${targetEnding.original} (${unicodeCode})</e0>${afterPunctuation}`;
                        return new Result({
                            rule: this,
                            severity: "warning",
                            id: resource.getKey(),
                            description: `Non-breaking space (U+00A0) missing before sentence-ending punctuation and incorrect punctuation type. The punctuation should be "${expectedPunctuation}" (${expectedUnicode}) for the ${targetLocale} locale`,
                            source: source,
                            highlight: highlight,
                            pathName: file,
                            fix: this.createFixForFrenchWrongPunctuation(resource, target, positionInfo.position, expectedPunctuation, nonBreakingSpace, false, true, index, category),
                            lineNumber: typeof(resource['lineNumber']) !== 'undefined' ? resource['lineNumber'] : undefined
                        });
                    } else {
                        // French target has correct non-breaking space but wrong punctuation
                        highlight = `${beforePunctuation}<e0>${targetEnding.original} (${unicodeCode})</e0>${afterPunctuation}`;
                        return new Result({
                            rule: this,
                            severity: "warning",
                            id: resource.getKey(),
                            description: `Sentence ending punctuation should be "${expectedPunctuation}" (${expectedUnicode}) for ${targetLocale} locale, not "${targetEnding.original}" (${unicodeCode})`,
                            source: source,
                            highlight: highlight,
                            pathName: file,
                            fix: this.createPunctuationFix(resource, target, targetEnding.original, expectedPunctuation, index, category, targetLocaleObj),
                            lineNumber: typeof(resource['lineNumber']) !== 'undefined' ? resource['lineNumber'] : undefined
                        });
                    }
                } else {
                    // Non-French target just has wrong punctuation
                    highlight = `${beforePunctuation}<e0>${targetEnding.original} (${unicodeCode})</e0>${afterPunctuation}`;
                }
            }

            // Add prefix for array/plural resources
            if (index !== undefined) {
                highlight = `Target[${index}]: ${highlight}`;
            } else if (category) {
                highlight = `Target(${category}): ${highlight}`;
            }

            return new Result({
                rule: this,
                severity: "warning",
                id: resource.getKey(),
                description: `Sentence ending punctuation should be "${expectedPunctuation}" (${expectedUnicode}) for ${targetLocale} locale, not "${targetEnding.original}" (${unicodeCode})`,
                source: source,
                highlight: highlight,
                pathName: file,
                fix: this.createPunctuationFix(resource, target, targetEnding.original, expectedPunctuation, index, category, targetLocaleObj),
                lineNumber: typeof(resource['lineNumber']) !== 'undefined' ? resource['lineNumber'] : undefined
            });
        }

        return undefined;
    }
}

export default ResourceSentenceEnding;
