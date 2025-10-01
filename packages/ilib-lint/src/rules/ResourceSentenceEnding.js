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

/*
 * ResourceSentenceEnding - Checks that sentence-ending punctuation is appropriate for the target locale
 *
 * This rule checks if the source string ends with certain punctuation marks and ensures
 * the target uses the locale-appropriate equivalent.
 *
 * Features:
 * - Configurable minimum length threshold to skip short strings (abbreviations)
 * - Automatic skipping of strings with no spaces (non-sentences)
 * - Custom punctuation mappings per locale
 * - Exception lists to skip specific source strings
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
import ResourceFixer from '../plugins/resource/ResourceFixer.js';
import { isSpace } from 'ilib-ctype';

/**
 * @ignore
 * @typedef {import("ilib-tools-common").Resource} Resource
 */
/**
 * @ignore
 * @typedef {import("ilib-lint-common").Fix} Fix
 */
/**
 * @ignore
 * @typedef {import("../plugins/resource/ResourceFix.js").default} ResourceFix
 */

/*
 * Default punctuation for each punctuation type
 */
const defaults = {
    'period': '.',
    'question': '?',
    'exclamation': '!',
    'ellipsis': '…',
    'colon': ':'
};

/*
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
 * @ignore
 * @typedef {{period?: string, question?: string, exclamation?: string, ellipsis?: string, colon?: string, exceptions?: string[]}} LocaleOptions
 * @property {string} [period] - Custom period punctuation for this locale
 * @property {string} [question] - Custom question mark punctuation for this locale
 * @property {string} [exclamation] - Custom exclamation mark punctuation for this locale
 * @property {string} [ellipsis] - Custom ellipsis punctuation for this locale
 * @property {string} [colon] - Custom colon punctuation for this locale
 * @property {string[]} [exceptions] - Array of source strings to skip checking for this locale.
 *   Useful for handling special cases like abbreviations that should not be checked for sentence-ending punctuation.
 */

/**
 * @ignore
 * @typedef {{minimumLength?: number}} ResourceSentenceEndingFixedOptions
 * @property {number} [minimumLength=10] - Minimum length of source string before the rule is applied.
 *   Strings shorter than this length will be skipped (useful for avoiding false positives on abbreviations).
 */

/**
 * @ignore
 * @typedef {ResourceSentenceEndingFixedOptions | Record<string, LocaleOptions>} ResourceSentenceEndingOptions
 */

/**
 * @class ResourceSentenceEnding
 * @extends ResourceRule
 */
class ResourceSentenceEnding extends ResourceRule {
    /**
     * Constructs a new ResourceSentenceEnding rule instance.
     *
     * @param {ResourceSentenceEndingOptions} [options] - Configuration options for the rule
     *
     * @example
     * // Basic usage with default settings
     * const rule = new ResourceSentenceEnding();
     *
     * @example
     * // Custom minimum length
     * const rule = new ResourceSentenceEnding({
     *   minimumLength: 15
     * });
     *
     * @example
     * // Custom punctuation mappings for Japanese
     * const rule = new ResourceSentenceEnding({
     *   'ja-JP': {
     *     period: '。',
     *     question: '？',
     *     exclamation: '！',
     *     ellipsis: '…',
     *     colon: '：'
     *   }
     * });
     *
     * @example
     * // Exception list for German
     * const rule = new ResourceSentenceEnding({
     *   'de-DE': {
     *     exceptions: [
     *       'See the Dr.',
     *       'Visit the Prof.',
     *       'Check with Mr.'
     *     ]
     *   }
     * });
     *
     * @example
     * // Combined configuration
     * const rule = new ResourceSentenceEnding({
     *   minimumLength: 8,
     *   'ja-JP': {
     *     period: '。',
     *     exceptions: ['Loading...', 'Please wait...']
     *   },
     *   'de-DE': {
     *     exceptions: ['See the Dr.', 'Visit the Prof.']
     *   }
     * });
     */
    constructor(options = {}) {
        super(options);
        this.name = "resource-sentence-ending";
        this.description = "Checks that sentence-ending punctuation is appropriate for the locale of the target string and matches the punctuation in the source string";
        this.link = "https://github.com/iLib-js/ilib-lint/blob/main/docs/resource-sentence-ending.md";

        // Initialize minimum length configuration
        this.minimumLength = Math.max(0, options?.minimumLength ?? 10);

        // Initialize custom punctuation mappings from configuration
        this.customPunctuationMap = {};
        // Initialize exception lists from configuration
        this.exceptionsMap = {};

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

                    // Separate punctuation mappings from exceptions
                    const { exceptions, ...punctuationMappings } = options[locale];

                    // Apply locale-specific defaults for any locale that usesthis language
                    const localeDefaults = this.getLocaleDefaults(language);
                    this.customPunctuationMap[language] = {
                        ...localeDefaults,
                        ...punctuationMappings
                    };

                    // Store exceptions separately
                    if (exceptions && Array.isArray(exceptions)) {
                        this.exceptionsMap[language] = exceptions;
                    }
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
     * Get a regex that matches all expected punctuation for a given locale, excluding colons
     * This is used by getLastSentenceFromContent to avoid splitting on colons in the middle of sentences
     * @param {Locale} localeObj locale of the punctuation
     * @returns {string} regex string that matches all expected punctuation for the locale except colons
     */
    getExpectedPunctuationRegexWithoutColons(localeObj) {
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
        // Exclude colons from the punctuation regex
        const punctuationWithoutColons = { ...config };
        delete punctuationWithoutColons.colon;
        return Object.values(punctuationWithoutColons).join('').replace(/\./g, '\\.').replace(/\?/g, '\\?');
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
        // Exclude colons from sentence-ending punctuation for this function because
        // colons in the middle of a sentence should not split the sentence
        const sentenceEndingWithoutColons = this.getExpectedPunctuationRegexWithoutColons(targetLocaleObj);
        // Fix: Use a regex that finds the last sentence, properly handling trailing whitespace
        // First, trim trailing whitespace to avoid matching spaces instead of sentences
        const trimmedContent = content.trim();
        const sentenceEndingRegex = new RegExp(`[^${sentenceEndingWithoutColons}]+\\p{P}?\\w*$`, 'gu');
        const match = sentenceEndingRegex.exec(trimmedContent);
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
     * Check if Spanish target has the correct inverted punctuation in the last sentence
     * @param {string} lastSentence - The last sentence of the target string (already stripped of quotes)
     * @param {string} sourceEndingType - The type of ending punctuation in source
     * @returns {{correct: boolean, position: number}} - position is where inverted punctuation should be
     */
    hasCorrectSpanishInvertedPunctuation(lastSentence, sourceEndingType) {
        if (!lastSentence || typeof lastSentence !== 'string') return { correct: false, position: 0 };
        // Only check for questions and exclamations
        if (sourceEndingType !== 'question' && sourceEndingType !== 'exclamation') {
            return { correct: true, position: 0 }; // Not applicable for other punctuation types
        }
        // Strip any leading quote characters before checking for inverted punctuation
        const quoteChars = ResourceSentenceEnding.allQuoteChars;
        let strippedSentence = lastSentence;
        let strippedOffset = 0;
        while (strippedSentence.length > 0 && (quoteChars.includes(strippedSentence.charAt(0)) || isSpace(strippedSentence.charAt(0)))) {
            strippedSentence = strippedSentence.slice(1);
            strippedOffset++;
        }

        const expectedInverted = sourceEndingType === 'question' ? '¿' : '¡';

        // Search backwards from the end of the sentence
        // If we find the correct inverted punctuation first, it's correct
        // If we find sentence-ending punctuation first, it's incorrect
        for (let i = strippedSentence.length - 1; i >= 0; i--) {
            const char = strippedSentence.charAt(i);

            // If we find the correct inverted punctuation, it's correct
            if (char === expectedInverted) {
                return { correct: true, position: strippedOffset };
            }

            // If we find sentence-ending punctuation (excluding the final one),
            // we've reached the start of this sentence without finding inverted punctuation
            if (char === '.' || char === '!' || char === '?' || char === '。' || char === '！' || char === '？') {
                // Skip the final punctuation at the end
                if (i === strippedSentence.length - 1) {
                    continue;
                }
                // Found sentence-ending punctuation before inverted punctuation
                return { correct: false, position: strippedOffset };
            }
        }

        // If we reach the start without finding either, it's incorrect
        return { correct: false, position: strippedOffset };
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
     * @returns {ResourceFix|undefined} - The fix object or undefined if no fix can be created
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
     * @returns {ResourceFix|undefined} - The fix object or undefined if no fix can be created
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
     * @returns {ResourceFix|undefined} - The fix object or undefined if no fix can be created
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
     * @returns {ResourceFix|undefined} - The fix object or undefined if no fix can be created
     */
    createFixForFrenchNonBreakingSpace(resource, target, position, nonBreakingSpace, index, category) {
        return ResourceFixer.createFix({
            resource,
            index,
            category,
            commands: [
                ResourceFixer.createStringCommand(
                    position,
                    1,
                    nonBreakingSpace
                )
            ]
        });
    }

    /**
     * Create a fix for French spacing issues
     * @param {Resource} resource - The resource object
     * @param {string} target - The target string
     * @param {number} spacePosition - Position of the space (before punctuation)
     * @param {boolean} needsNonBreakingSpace - Whether the final punctuation needs a non-breaking space
     * @param {string} currentSpace - The current space character (or empty string if none)
     * @param {number} [index] - Index for array/plural resources
     * @param {string} [category] - Category for plural resources
     * @returns {ResourceFix|undefined} - The fix object or undefined if no fix is needed
     */
    createFrenchSpacingFix(resource, target, spacePosition, needsNonBreakingSpace, currentSpace, index, category) {
        const regularSpace = ' ';
        const narrowNoBreakSpace = '\u202F';
        const nonBreakingSpace = '\u00A0';

        if (needsNonBreakingSpace) {
            // Target needs a non-breaking space
            if (currentSpace === narrowNoBreakSpace) {
                // Already has the correct thin no-break space, no fix needed
                return undefined;
            } else if (currentSpace === regularSpace) {
                // Has regular space, replace with thin no-break space
                return ResourceFixer.createFix({
                    resource,
                    index,
                    category,
                    commands: [
                        ResourceFixer.createStringCommand(
                            spacePosition,
                            1, // deleteCount: 1 to replace the existing space
                            narrowNoBreakSpace
                        )
                    ]
                });
            } else {
                // No space, insert thin no-break space
                return ResourceFixer.createFix({
                    resource,
                    index,
                    category,
                    commands: [
                        ResourceFixer.createStringCommand(
                            spacePosition,
                            0, // deleteCount: 0 to insert without deleting
                            narrowNoBreakSpace
                        )
                    ]
                });
            }
        } else {
            // Target needs no space
            if (currentSpace === regularSpace || currentSpace === nonBreakingSpace) {
                // Has any type of space, delete it
                return ResourceFixer.createFix({
                    resource,
                    index,
                    category,
                    commands: [
                        ResourceFixer.createStringCommand(
                            spacePosition,
                            1, // deleteCount: 1 to delete the space
                            '' // insertContent: empty string
                        )
                    ]
                });
            } else {
                // No space, no fix needed
                return undefined;
            }
        }
    }

    /**
     * Check if a locale uses French spacing rules (non-breaking spaces before ? ! :)
     * @param {string} locale - The locale to check
     * @returns {boolean} - True if the locale uses French spacing rules
     */
    _usesFrenchSpacingRules(locale) {
        return locale === 'fr-FR' || locale === 'fr-BE' || locale === 'fr-LU' || locale === 'fr-CH';
    }

    /**
     * Add prefix for array/plural resources to the highlight string
     * @param {string} highlight - The highlight string to prefix
     * @param {number|undefined} index - Index for array resources
     * @param {string|undefined} category - Category for plural resources
     * @returns {string} - The highlight string with appropriate prefix
     */
    _addResourcePrefix(highlight, index, category) {
        if (index !== undefined) {
            return `Target[${index}]: ${highlight}`;
        } else if (category) {
            return `Target(${category}): ${highlight}`;
        }
        return highlight;
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

        // Exception 1: Check minimum length
        if (source.length < this.minimumLength) {
            return undefined;
        }

        // Exception 2: Check if source has no spaces AND doesn't end with sentence-ending punctuation (not a sentence)
        if (!source.includes(' ')) {
            const trimmed = source.trim();
            const lastChar = trimmed.charAt(trimmed.length - 1);
            const sentenceEndingChars = ['.', '?', '!', '。', '？', '！', '…', ':'];
            if (!sentenceEndingChars.includes(lastChar)) {
                return undefined; // Not a sentence
            }
        }

        // Exception 3: Check if source is in exception list
        const exceptions = this.exceptionsMap[targetLanguage];
        if (exceptions) {
            if (exceptions.some(exception => exception.toLowerCase().trim() === source.toLowerCase().trim())) {
                return undefined;
            }
        }

        const optionalPunctuationLanguages = ['th', 'lo', 'my', 'km', 'vi', 'id', 'ms', 'tl', 'jv', 'su'];
        const isOptionalPunctuationLanguage = optionalPunctuationLanguages.includes(targetLanguage);

        // Get the ending punctuation from source and target
        const sourceEnding = this.getEndingPunctuation(source, sourceLocaleObj);

        // Determine if the source ends with a quote
        const sourceTrimmed = source?.trim() || '';
        const quoteChars = ResourceSentenceEnding.allQuoteChars;
        const sourceEndsWithQuote = quoteChars.includes(sourceTrimmed.charAt(sourceTrimmed.length - 1));

        const regularSpace = ' ';
        const narrowNoBreakSpace = '\u202F';
        const nonBreakingSpace = '\u00A0';
        let fix;
        let highlight = '';
        let description = '';

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
            if (positionInfo) {
                const beforePunctuation = target.substring(0, positionInfo.position);
                const afterPunctuation = target.substring(positionInfo.position + positionInfo.length);
                highlight = `${beforePunctuation}<e0>${targetEnding.original} (${unicodeCode})</e0>${afterPunctuation}`;
            }

            // Add prefix for array/plural resources
            highlight = this._addResourcePrefix(highlight, index, category);

            return new Result({
                rule: this,
                severity: "warning",
                id: resource.getKey(),
                description: `Sentence ending should be "" for ${targetLocale} locale instead of "${targetEnding.original}" (${unicodeCode})`,
                source,
                highlight,
                pathName: file,
                locale: targetLocale,
                fix: this.createPunctuationFix(resource, target, targetEnding.original, '', index, category, targetLocaleObj),
                lineNumber: resource.getLocation()?.line
            });
        }

        // Case 2: Source has punctuation but target doesn't
        if (sourceEnding && !targetEnding && !isOptionalPunctuationLanguage && sourceEnding.type !== 'unknown') {
            const expectedPunctuation = this.getExpectedPunctuation(targetLocaleObj, sourceEnding.type);
            if (!expectedPunctuation) return undefined;

            highlight = `${lastSentence}<e0/>`;

            let deleteString = '';
            let insertString = expectedPunctuation;
            if (this._usesFrenchSpacingRules(targetLocale)) {
                if (sourceEnding.type === 'question' || sourceEnding.type === 'exclamation' || sourceEnding.type === 'colon') {
                    // For European French-speaking countries (France, Belgium, Luxembourg, Switzerland), we need to insert a non-breaking space before the punctuation
                    insertString = narrowNoBreakSpace + expectedPunctuation;
                    highlight = `${lastSentence}<e0/>`;
                } else {
                    // For European French-speaking countries, periods and ellipses don't need non-breaking spaces
                    insertString = expectedPunctuation;
                    highlight = `${lastSentence}<e0/>`;
                }
            }

            const unicodeCode = ResourceSentenceEnding.getUnicodeCodes(insertString);

            // Add prefix for array/plural resources
            highlight = this._addResourcePrefix(highlight, index, category);

            return new Result({
                rule: this,
                severity: "warning",
                id: resource.getKey(),
                description: `Sentence ending should be "${insertString}" (${unicodeCode}) for ${targetLocale} locale instead of ""`,
                source,
                highlight,
                pathName: file,
                locale: targetLocale,
                fix: this.createPunctuationFix(resource, target, deleteString, insertString, index, category, targetLocaleObj),
                lineNumber: resource.getLocation()?.line
            });
        }

        // Case 3: Both source and target have punctuation, but they don't match
        if (sourceEnding && targetEnding && sourceEnding.type !== 'unknown') {
            const expectedPunctuation = this.getExpectedPunctuation(targetLocaleObj, sourceEnding.type);
            if (!expectedPunctuation) return undefined;

            // For Spanish, check for inverted punctuation at the beginning
            if (targetLanguage === 'es' && (sourceEnding.type === 'question' || sourceEnding.type === 'exclamation')) {
                // For Spanish inverted punctuation, we need to check the appropriate part of the target:
                // - If source ends with quote, check the quoted content (lastSentence already contains this)
                // - If source doesn't end with quote, check the full target string
                // - However, if lastSentence is the result of getLastSentenceFromContent (which extracts
                //   only the part after the last sentence-ending punctuation), we should check the full target
                //   because inverted punctuation should be at the beginning of the entire sentence
                // For Spanish inverted punctuation, we need to check the appropriate part of the target:
                // - If source ends with quote, check the quoted content (lastSentence already contains this)
                // - If source doesn't end with quote, check the lastSentence (which contains the relevant part)
                //   because inverted punctuation should be at the beginning of the sentence being checked
                const stringToCheck = lastSentence;
                const invertedPunctuationResult = this.hasCorrectSpanishInvertedPunctuation(stringToCheck, sourceEnding.type);
                if (!invertedPunctuationResult.correct) {
                    // Spanish target is missing inverted punctuation at the beginning
                    const quoteChars = ResourceSentenceEnding.allQuoteChars;
                    let quotedContentStart = -1;
                    for (let i = 0; i < target.length; i++) {
                        if (quoteChars.includes(target.charAt(i))) {
                            quotedContentStart = i + 1;
                            break;
                        }
                    }

                    if (quotedContentStart !== -1) {
                        const beforeQuote = target.substring(0, quotedContentStart);
                        const afterQuote = target.substring(quotedContentStart);
                        highlight = `${beforeQuote}<e0/>${afterQuote}`;
                    } else {
                        // For multi-sentence strings, find where the last sentence starts
                        const lastSentenceStart = target.lastIndexOf(lastSentence);
                        if (lastSentenceStart !== -1) {
                            // Use the position from hasCorrectSpanishInvertedPunctuation for more precise highlighting
                            const highlightPosition = lastSentenceStart + invertedPunctuationResult.position;
                            const beforeHighlight = target.substring(0, highlightPosition);
                            const afterHighlight = target.substring(highlightPosition);
                            highlight = `${beforeHighlight}<e0/>${afterHighlight}`;
                        } else {
                            highlight = `<e0/>${target}`;
                        }
                    }

                    // Add prefix for array/plural resources
                    highlight = this._addResourcePrefix(highlight, index, category);

                    const invertedChar = sourceEnding.type === 'question' ? '¿' : '¡';
                    const unicodeCode = ResourceSentenceEnding.getUnicodeCode(invertedChar);
                    return new Result({
                        rule: this,
                        severity: "warning",
                        id: resource.getKey(),
                        description: `Spanish ${sourceEnding.type} should start with "${invertedChar}" (${unicodeCode}) for ${targetLocale} locale`,
                        source,
                        highlight,
                        pathName: file,
                        locale: targetLocale,
                        fix: this.createFixForSpanishInvertedPunctuation(resource, target, lastSentence, invertedChar, index, category, targetLocaleObj),
                        lineNumber: resource.getLocation()?.line
                    });
                }
            }

            // Check if the target punctuation matches the expected punctuation for the locale
            if (targetEnding.type === sourceEnding.type && targetEnding.original === expectedPunctuation) {
                // For European French-speaking countries, check for non-breaking space before sentence-ending punctuation
                if (this._usesFrenchSpacingRules(targetLocale) && (sourceEnding.type === 'question' || sourceEnding.type === 'exclamation' || sourceEnding.type === 'colon')) {
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
                            highlight = `${beforeSpace}<e0> (U+0020)</e0>${afterSpace}`;

                            // Add prefix for array/plural resources
                            highlight = this._addResourcePrefix(highlight, index, category);

                            const unicodeCode = ResourceSentenceEnding.getUnicodeCodes(targetEnding.original);
                            description = `Sentence ending should be "\u202F${targetEnding.original}" (U+202F ${unicodeCode}) for ${targetLocale} locale instead of " ${targetEnding.original}" (U+0020 ${unicodeCode})`;
                            fix = this.createFixForFrenchNonBreakingSpace(resource, target, spacePosition, narrowNoBreakSpace, index, category);
                        } else if (lastCharBeforePunctuation === nonBreakingSpace) {
                            // French target has regular no-break space (U+00A0) instead of narrow no-break space (U+202F)
                            const beforeSpace = target.substring(0, spacePosition);
                            const afterSpace = target.substring(spacePosition + 1);
                            highlight = `${beforeSpace}<e0> (U+00A0)</e0>${afterSpace}`;

                            // Add prefix for array/plural resources
                            highlight = this._addResourcePrefix(highlight, index, category);

                            const unicodeCode = ResourceSentenceEnding.getUnicodeCodes(targetEnding.original);
                            description = `Sentence ending should be "\u202F${targetEnding.original}" (U+202F ${unicodeCode}) for ${targetLocale} locale instead of " ${targetEnding.original}" (U+00A0 ${unicodeCode})`;
                            fix = this.createFixForFrenchNonBreakingSpace(resource, target, spacePosition, narrowNoBreakSpace, index, category);
                        } else if (lastCharBeforePunctuation !== narrowNoBreakSpace) {
                            // French target is missing non-breaking space before punctuation
                            const beforePunctuation = target.substring(0, positionInfo.position);
                            const afterPunctuation = target.substring(positionInfo.position);
                            highlight = `${beforePunctuation}<e0/>${afterPunctuation}`;

                            // Add prefix for array/plural resources
                            highlight = this._addResourcePrefix(highlight, index, category);

                            const unicodeCode = ResourceSentenceEnding.getUnicodeCodes(targetEnding.original);
                            description = `Sentence ending should be "\u202F${targetEnding.original}" (U+202F ${unicodeCode}) for ${targetLocale} locale instead of "${targetEnding.original}" (${unicodeCode})`;
                            fix = this.createFixForFrenchNonBreakingSpace(resource, target, positionInfo.position, narrowNoBreakSpace, index, category);
                        } else {
                            // Target has correct thin no-break space and correct punctuation
                            return undefined;
                        }

                        return new Result({
                            rule: this,
                            severity: "warning",
                            id: resource.getKey(),
                            description,
                            source,
                            highlight,
                            pathName: file,
                            locale: targetLocale,
                            fix,
                            lineNumber: resource.getLocation()?.line
                        });
                    }
                }

                return undefined; // Punctuation matches, no issue
            }

            // Target has different punctuation than expected
            const unicodeCode = ResourceSentenceEnding.getUnicodeCodes(targetEnding.original);
            const expectedUnicode = ResourceSentenceEnding.getUnicodeCodes(expectedPunctuation);
            const positionInfo = this.findIncorrectPunctuationPosition(target, lastSentence, targetEnding.original);

            description = `Sentence ending should be "${expectedPunctuation}" (${expectedUnicode}) for ${targetLocale} locale instead of "${targetEnding.original}" (${unicodeCode})`;

            if (positionInfo) {
                const beforePunctuation = target.substring(0, positionInfo.position);
                const afterPunctuation = target.substring(positionInfo.position + positionInfo.length);

                if (this._usesFrenchSpacingRules(targetLocale)) {
                    // For European French-speaking countries, handle spacing and punctuation as separate issues
                    // Check if the target has no punctuation at all (missing punctuation case)
                    if (targetEnding.original === '') {
                        // Target is missing punctuation entirely - just create a punctuation fix with correct spacing
                        const needsNonBreakingSpace = expectedPunctuation === '?' || expectedPunctuation === '!' || expectedPunctuation === ':';
                        const expectedWithSpace = needsNonBreakingSpace ? narrowNoBreakSpace + expectedPunctuation : expectedPunctuation;
                        const expectedUnicodeWithSpace = ResourceSentenceEnding.getUnicodeCodes(expectedWithSpace);

                        highlight = `${beforePunctuation}<e0/>`;
                        description = `Sentence ending should be "${expectedWithSpace}" (${expectedUnicodeWithSpace}) for ${targetLocale} locale instead of ""`;
                        fix = this.createPunctuationFix(resource, target, '', expectedWithSpace, index, category, targetLocaleObj);
                    } else {
                        // Target has some punctuation - check for spacing issues
                        const spacePosition = positionInfo.position - 1;
                        const lastCharBeforePunctuation = target.charAt(spacePosition);
                        const needsNonBreakingSpace = expectedPunctuation === '?' || expectedPunctuation === '!' || expectedPunctuation === ':';

                        const spacingFix = this.createFrenchSpacingFix(resource, target, spacePosition, needsNonBreakingSpace, lastCharBeforePunctuation, index, category);
                        const punctuationFix = this.createPunctuationFix(resource, target, targetEnding.original, expectedPunctuation, index, category, targetLocaleObj);

                    // Combine fixes if both are needed
                    if (spacingFix && punctuationFix) {
                        fix = ResourceFixer.createFix({
                            resource,
                            index,
                            category,
                            commands: [...spacingFix.commands, ...punctuationFix.commands]
                        });
                    } else if (spacingFix) {
                        fix = spacingFix;
                    } else if (punctuationFix) {
                        fix = punctuationFix;
                    }

                    // Create appropriate highlight and description
                    if (spacingFix && punctuationFix) {
                        // Both spacing and punctuation are wrong
                        if (lastCharBeforePunctuation === regularSpace) {
                            // For European French-speaking countries, if the expected punctuation needs a non-breaking space, include it in the description
                            const expectedWithSpace = needsNonBreakingSpace ? narrowNoBreakSpace + expectedPunctuation : expectedPunctuation;
                            const expectedUnicodeWithSpace = ResourceSentenceEnding.getUnicodeCodes(expectedWithSpace);

                            highlight = `${beforePunctuation.substring(0, beforePunctuation.length - 1)}<e0> ${targetEnding.original} (U+0020 ${unicodeCode})</e0>${afterPunctuation}`;
                            description = `Sentence ending should be "${expectedWithSpace}" (${expectedUnicodeWithSpace}) for ${targetLocale} locale instead of " ${targetEnding.original}" (U+0020 ${unicodeCode})`;
                        } else if (lastCharBeforePunctuation !== narrowNoBreakSpace) {
                            // For European French-speaking countries, if the expected punctuation needs a non-breaking space, include it in the description
                            const expectedWithSpace = needsNonBreakingSpace ? narrowNoBreakSpace + expectedPunctuation : expectedPunctuation;
                            const expectedUnicodeWithSpace = ResourceSentenceEnding.getUnicodeCodes(expectedWithSpace);

                            highlight = `${beforePunctuation}<e0>${targetEnding.original} (${unicodeCode})</e0>${afterPunctuation}`;
                            description = `Sentence ending should be "${expectedWithSpace}" (${expectedUnicodeWithSpace}) for ${targetLocale} locale instead of "${targetEnding.original}" (${unicodeCode})`;
                        } else if (lastCharBeforePunctuation === narrowNoBreakSpace && !needsNonBreakingSpace) {
                            // For European French-speaking countries, if the target has a non-breaking space but the expected punctuation doesn't need one
                            // (e.g., period or ellipsis), highlight both the space and punctuation
                            const beforeSpace = beforePunctuation.substring(0, beforePunctuation.length - 1);
                            highlight = `${beforeSpace}<e0>\u202F${targetEnding.original} (U+202F ${unicodeCode})</e0>${afterPunctuation}`;
                            description = `Sentence ending should be "${expectedPunctuation}" (${expectedUnicode}) for ${targetLocale} locale instead of "\u202F${targetEnding.original}" (U+202F ${unicodeCode})`;
                        }
                    } else if (spacingFix) {
                        fix = spacingFix;
                        // Only spacing is wrong
                        if (lastCharBeforePunctuation === regularSpace) {
                            highlight = `${beforePunctuation.substring(0, beforePunctuation.length - 1)}<e0> ${targetEnding.original} (U+0020 ${unicodeCode})</e0>${afterPunctuation}`;
                            description = `Sentence ending should be "\u202F${targetEnding.original}" (U+202F ${unicodeCode}) for ${targetLocale} locale instead of " ${targetEnding.original}" (U+0020 ${unicodeCode})`;
                        } else if (lastCharBeforePunctuation !== narrowNoBreakSpace) {
                            // For European French-speaking countries, if the expected punctuation needs a non-breaking space, include it in the description
                            const expectedWithSpace = needsNonBreakingSpace ? narrowNoBreakSpace + targetEnding.original : targetEnding.original;
                            const expectedUnicodeWithSpace = ResourceSentenceEnding.getUnicodeCodes(expectedWithSpace);

                            highlight = `${beforePunctuation}<e0>${targetEnding.original} (${unicodeCode})</e0>${afterPunctuation}`;
                            description = `Sentence ending should be "${expectedWithSpace}" (${expectedUnicodeWithSpace}) for ${targetLocale} locale instead of "${targetEnding.original}" (${unicodeCode})`;
                        }
                    } else if (punctuationFix) {
                        // Only punctuation is wrong, but for French locales, we need to consider the spacing context
                        if (lastCharBeforePunctuation === narrowNoBreakSpace) {
                            // Target has correct thin no-break space but wrong punctuation
                            // For French locales, we need to check if the expected punctuation needs this spacing
                            const needsNonBreakingSpace = expectedPunctuation === '?' || expectedPunctuation === '!' || expectedPunctuation === ':';

                            if (!needsNonBreakingSpace) {
                                // Expected punctuation doesn't need non-breaking space, so we need to remove it
                                // Create a combined fix: remove space + replace punctuation
                                const spaceFix = ResourceFixer.createFix({
                                    resource,
                                    index,
                                    category,
                                    commands: [
                                        ResourceFixer.createStringCommand(
                                            spacePosition,
                                            1, // deleteCount: 1 to delete the non-breaking space
                                            '' // insertContent: empty string
                                        )
                                    ]
                                });

                                fix = ResourceFixer.createFix({
                                    resource,
                                    index,
                                    category,
                                    commands: [...spaceFix.commands, ...punctuationFix.commands]
                                });
                            } else {
                                // Expected punctuation needs non-breaking space, so keep it
                                fix = punctuationFix;
                            }

                            // Highlight both the space and punctuation together
                            const beforeSpace = beforePunctuation.substring(0, beforePunctuation.length - 1);
                            highlight = `${beforeSpace}<e0>\u202F${targetEnding.original} (U+202F ${unicodeCode})</e0>${afterPunctuation}`;
                        } else {
                            // Target has wrong punctuation without special spacing considerations
                            highlight = `${beforePunctuation}<e0>${targetEnding.original} (${unicodeCode})</e0>${afterPunctuation}`;
                            fix = punctuationFix;
                        }
                    }
                    }

                    // If no fixes are needed, continue to general case
                } else {
                    // Non-European French-speaking target just has wrong punctuation
                    highlight = `${beforePunctuation}<e0>${targetEnding.original} (${unicodeCode})</e0>${afterPunctuation}`;
                    fix = this.createPunctuationFix(resource, target, targetEnding.original, expectedPunctuation, index, category, targetLocaleObj);
                }
            } else {
                fix = this.createPunctuationFix(resource, target, targetEnding.original, expectedPunctuation, index, category, targetLocaleObj);
            }

            // Add prefix for array/plural resources
            highlight = this._addResourcePrefix(highlight, index, category);

            return new Result({
                rule: this,
                severity: "warning",
                id: resource.getKey(),
                description,
                source,
                highlight,
                pathName: file,
                locale: targetLocale,
                fix,
                lineNumber: resource.getLocation()?.line
            });
        }

        return undefined;
    }
}

export default ResourceSentenceEnding;
