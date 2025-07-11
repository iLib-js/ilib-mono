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
import ResourceFixer from '../plugins/resource/ResourceFixer.js';

/** @ignore @typedef {import("ilib-tools-common").Resource} Resource */

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

/**
 * @class ResourceSentenceEnding
 * @extends ResourceRule
 */
class ResourceSentenceEnding extends ResourceRule {
    constructor(options) {
        super(options);
        this.name = "resource-sentence-ending";
        this.description = "Checks that sentence-ending punctuation is appropriate for the target locale";
        this.link = "https://github.com/iLib-js/ilib-lint/blob/main/docs/resource-sentence-ending.md";

        // Initialize custom punctuation mappings from configuration
        this.customPunctuationMap = {};

        if (options && options.param) {
            if (typeof options.param === 'object' && !Array.isArray(options.param)) {
                // param is an object with locale codes as keys and punctuation mappings as values
                // Merge the default punctuation with the custom punctuation so that the custom
                // punctuation overrides the default and we don't have to specify all punctuation types.
                this.customPunctuationMap = {
                    ...defaults,
                    ...options.param
                };
            }
        }
    }

    /**
     * Check if the given string ends with any of the specified punctuation patterns
     * @param {string} str - The string to check
     * @returns {Object|null} - Object with type and original punctuation, or null if no match
     */
    getEndingPunctuation(str) {
        if (!str || typeof str !== 'string') return null;

        const trimmed = str.trim();
        if (!trimmed) return null;

        // Patterns to match, in order of specificity (longer patterns first)
        const patterns = [
            // Ellipsis patterns (three dots or Unicode ellipsis)
            { regex: /\.{3}$/, type: 'ellipsis', original: '...' },
            { regex: /…$/, type: 'ellipsis', original: '…' },

            // Punctuation followed by quotes
            { regex: /\.["']$/, type: 'period', original: trimmed.slice(-2) },
            { regex: /\?["']$/, type: 'question', original: trimmed.slice(-2) },
            { regex: /!["']$/, type: 'exclamation', original: trimmed.slice(-2) },
            { regex: /:["']$/, type: 'colon', original: trimmed.slice(-2) },

            // Single punctuation marks
            { regex: /\.$/, type: 'period', original: '.' },
            { regex: /\?$/, type: 'question', original: '?' },
            { regex: /!$/, type: 'exclamation', original: '!' },
            { regex: /:$/, type: 'colon', original: ':' }
        ];

        for (const pattern of patterns) {
            if (pattern.regex.test(trimmed)) {
                return pattern;
            }
        }

        return null;
    }

    /**
     * Get the expected punctuation for the given locale and punctuation type
     * @param {Locale} localeObj - The parsed locale object
     * @param {string} type - The punctuation type
     * @returns {string|null} - The expected punctuation for the locale, or null if punctuation is optional
     */
    getExpectedPunctuation(localeObj, type) {
        const baseLocale = localeObj.getLanguage();
        if (!baseLocale) return null;
        // Custom config
        if (this.customPunctuationMap[baseLocale] && this.customPunctuationMap[baseLocale][type]) {
            return this.customPunctuationMap[baseLocale][type];
        }
        // For English ellipsis, only accept the default (Unicode ellipsis) in the target
        if (baseLocale === 'en' && type === 'ellipsis') {
            return '…';
        }
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
            'kn': { 'period': '।', 'question': '?', 'exclamation': '!', 'ellipsis': '…', 'colon': ':' }
        };
        const result = punctuationMap[baseLocale]?.[type] || this.getDefaultPunctuation(type);
        return result;
    }

    /**
     * Get default punctuation (Western/English style)
     * @param {string} type - The punctuation type
     * @returns {string} - The default punctuation
     */
    getDefaultPunctuation(type) {
        return defaults[type] || '.';
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
     * Get the last sentence from a string, using period, question, exclamation, or colon as delimiters.
     * For quoted content, extract the actual sentence within the quotes.
     * @param {string} str
     * @returns {string}
     */
    static getLastSentence(str) {
        if (!str) return str;

        // If there's a trailing quote, search backwards for the matching start quote
        const quoteChars = ResourceSentenceEnding.allQuoteChars;
        const trimmedStr = str.trim();
        const lastChar = trimmedStr.charAt(trimmedStr.length - 1);

        if (quoteChars.includes(lastChar)) {
            // Find the last matching opening quote
            for (let i = trimmedStr.length - 2; i >= 0; i--) {
                if (quoteChars.includes(trimmedStr.charAt(i))) {
                    // Extract content inside the last pair of quotes
                    const quotedContent = trimmedStr.substring(i + 1, trimmedStr.length - 1);
                    // Now find the last sentence within the quoted content
                    return ResourceSentenceEnding.getLastSentenceFromContent(quotedContent);
                }
            }
        }

        // If no quotes, use the current algorithm directly
        return ResourceSentenceEnding.getLastSentenceFromContent(trimmedStr);
    }

    /**
     * Get the last sentence from content without considering outer quotes
     * @param {string} content
     * @returns {string}
     */
    static getLastSentenceFromContent(content) {
        if (!content) return content;
        // Only treat .!?。？！ as sentence-ending punctuation, not ¿ or ¡
        const sentences = content.match(/[^.!?。？！]+[.!?。？！]+(?:\s+|$)/gu);
        if (sentences && sentences.length > 0) {
            let lastSentence = sentences[sentences.length - 1].trim();
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
     * Check if Spanish target has the correct inverted punctuation at the beginning of the last sentence
     * @param {string} source - The source string
     * @param {string} lastSentence - The last sentence of the target string (already stripped of quotes)
     * @param {string} sourceEndingType - The type of ending punctuation in source
     * @returns {boolean} - True if Spanish target has correct inverted punctuation at start of last sentence
     */
    hasCorrectSpanishInvertedPunctuation(source, lastSentence, sourceEndingType) {
        if (!source || !lastSentence || typeof lastSentence !== 'string') return false;
        // Only check for questions and exclamations
        if (sourceEndingType !== 'question' && sourceEndingType !== 'exclamation') {
            return true; // Not applicable for other punctuation types
        }
        // Strip any leading quote characters before checking for inverted punctuation
        const quoteChars = ResourceSentenceEnding.allQuoteChars;
        let strippedSentence = lastSentence;
        while (strippedSentence.length > 0 && quoteChars.includes(strippedSentence.charAt(0))) {
            strippedSentence = strippedSentence.slice(1);
        }
        // Check for inverted punctuation at the beginning of the stripped last sentence
        const expectedInverted = sourceEndingType === 'question' ? '¿' : '¡';
        return strippedSentence.startsWith(expectedInverted);
    }

    /**
     * Find the position of the incorrect punctuation in the target string
     * @param {string} target - The target string
     * @param {string} incorrectPunctuation - The incorrect punctuation to find
     * @returns {Object|null} - Object with position and length, or null if not found
     */
    findIncorrectPunctuationPosition(target, incorrectPunctuation) {
        if (!target || !incorrectPunctuation) return null;

        const stripped = ResourceSentenceEnding.stripTrailingQuotesAndWhitespace(target.trim());
        if (!stripped) return null;

        // Find the position of the incorrect punctuation at the end
        const punctuationLength = incorrectPunctuation.length;
        const endPosition = stripped.length - punctuationLength;

        if (endPosition >= 0 && stripped.substring(endPosition) === incorrectPunctuation) {
            // Calculate the position in the original target string
            const originalEndPosition = target.length - (target.trim().length - stripped.length) - punctuationLength;
            return {
                position: originalEndPosition,
                length: punctuationLength
            };
        }

        return null;
    }

    /**
     * Create a fix to replace the incorrect punctuation with the correct one
     * @param {Resource} resource - The resource object
     * @param {string} target - The target string
     * @param {string} incorrectPunctuation - The incorrect punctuation
     * @param {string} correctPunctuation - The correct punctuation
     * @returns {Object|null} - The fix object or null if no fix can be created
     */
    createPunctuationFix(resource, target, incorrectPunctuation, correctPunctuation) {
        const positionInfo = this.findIncorrectPunctuationPosition(target, incorrectPunctuation);
        if (!positionInfo) return null;

        return ResourceFixer.createFix({
            resource,
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
     * Match the source and target strings for sentence ending punctuation issues
     * @param {Object} params - Parameters object
     * @param {string} params.source - The source string
     * @param {string} params.target - The target string
     * @param {Resource} params.resource - The resource object
     * @param {string} params.file - The file path
     * @returns {Result|undefined} - A Result object if there's an issue, undefined otherwise
     */
    matchString({ source, target, resource, file }) {
        if (!source || !target || !resource) return undefined;
        const sourceEnding = this.getEndingPunctuation(source);
        if (!sourceEnding) return undefined;
        const targetLocale = resource.getTargetLocale();
        if (!targetLocale) return undefined;
        const localeObj = new Locale(targetLocale);
        const baseLocale = localeObj.getLanguage();
        if (!baseLocale) return undefined;
        const optionalPunctuationLanguages = ['th', 'lo', 'my', 'km'];
        if (optionalPunctuationLanguages.includes(baseLocale)) return undefined;
        // Pass sourceEnding.original to getExpectedPunctuation for ellipsis
        const expectedPunctuation = this.getExpectedPunctuation(localeObj, sourceEnding.type);
        if (!expectedPunctuation) return undefined;

        const strippedTarget = ResourceSentenceEnding.stripTrailingQuotesAndWhitespace(target.trim());
        if (this.hasExpectedEnding(strippedTarget, expectedPunctuation, sourceEnding.original)) {
            if (baseLocale !== 'es') {
                return undefined;
            }

            // For Spanish, also check for inverted punctuation at the beginning of the last sentence
            // Call getLastSentence with the original target to properly handle quoted content
            const lastSentence = ResourceSentenceEnding.getLastSentence(target);
            if (this.hasCorrectSpanishInvertedPunctuation(source, lastSentence, sourceEnding.type)) {
                return undefined;
            }

            // Spanish target is missing inverted punctuation at the beginning
            return new Result({
                rule: this,
                severity: "warning",
                id: "sentence-ending-punctuation",
                description: `Spanish ${sourceEnding.type} should start with "${sourceEnding.type === 'question' ? '¿' : '¡'}" for ${targetLocale} locale`,
                source: source,
                highlight: `Spanish ${sourceEnding.type} should start with "${sourceEnding.type === 'question' ? '¿' : '¡'}"`,
                pathName: file,
                lineNumber: typeof(resource['lineNumber']) !== 'undefined' ? resource['lineNumber'] : undefined
            });
        }
        let actualPunctuation = null;
        const patterns = [
            { regex: /\.{3}$/, punctuation: '...' },
            { regex: /…$/, punctuation: '…' },
            { regex: /\.$/, punctuation: '.' },
            { regex: /\?$/, punctuation: '?' },
            { regex: /!$/, punctuation: '!' },
            { regex: /:$/, punctuation: ':' }
        ];
        for (const pattern of patterns) {
            if (pattern.regex.test((target || '').trim())) {
                actualPunctuation = pattern.punctuation;
                break;
            }
        }
        // For English ellipsis, prefer the form used in the source for the fix
        let fix = null;
        if (actualPunctuation && actualPunctuation !== expectedPunctuation) {
            fix = this.createPunctuationFix(resource, target, actualPunctuation, expectedPunctuation);
        }

        return new Result({
            rule: this,
            severity: "warning",
            id: "sentence-ending-punctuation",
            description: `Sentence ending punctuation should be "${expectedPunctuation}" for ${targetLocale} locale, not "${(actualPunctuation ?? sourceEnding.original)}"`,
            source: source,
            highlight: '',
            pathName: file,
            fix,
            lineNumber: typeof(resource['lineNumber']) !== 'undefined' ? resource['lineNumber'] : undefined
        });
    }
}

export default ResourceSentenceEnding;