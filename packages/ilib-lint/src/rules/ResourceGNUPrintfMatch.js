/*
 * ResourceGNUPrintfMatch.js - rule to check if GNU printf-style parameters in the source string
 * also appear in the target string with the same format specifiers
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

import { Result } from 'ilib-lint-common';
import { Resource } from 'ilib-tools-common';
import ResourceRule from './ResourceRule.js';

/**
 * @class Represent an ilib-lint rule.
 */
class ResourceGNUPrintfMatch extends ResourceRule {
    /**
     * Make a new rule instance.
     * @constructor
     */
    constructor(options) {
        super(options);
        this.name = "resource-gnu-printf-match";
        this.description = "Test that GNU printf-style substitution parameters match in the source and target strings.";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
        this.link = "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-gnu-printf-match.md";
    }

    /**
     * Extract GNU printf-style parameters from a string.
     * Supports positional parameters (%1$s, %2$d), width/precision from arguments (%*s, %.*f),
     * and GNU extensions (%m, %'d, %I, etc.) as well as Swift/Objective-C %@ specifiers
     * @private
     * @param {string} str the string to extract parameters from
     * @returns {Array<string>} array of parameter strings found
     */
    extractParameters(str) {
        if (!str || typeof str !== 'string') return [];

        // GNU printf regex pattern:
        // % - literal percent
        // (?:(\d+)\$)? - optional positional parameter (1$, 2$, etc.)
        // (?:(\d+))? - optional width/precision from argument (*)
        // (?:\.(?:\*|\d+))? - optional precision (.* or .123)
        // (?:[hlL]|hh|ll)? - optional length modifier (h, l, L, hh, ll)
        // [diouxXfFeEgGaAcCsSpn%m'#0I@] - format specifier including GNU extensions and Swift/Objective-C @
        const gnuPrintfRegex =
            /%(?:(\d+)\$)?(?:(\*))?(?:\.(?:\*|\d+))?(?:[hlL]|hh|ll)?[diouxXfFeEgGaAcCsSpn%m'#0I@]/g;

        const matches = [];
        let match;

        while ((match = gnuPrintfRegex.exec(str)) !== null) {
            matches.push(match[0]);
        }

        return matches;
    }

    /**
     * Check a string pair for GNU printf parameter mismatches.
     * @override
     * @param {Object} params parameters for the string matching
     * @param {String|undefined} params.source the source string to match against
     * @param {String|undefined} params.target the target string to match
     * @param {String} params.file the file path where the resources came from
     * @param {Resource} params.resource the resource that contains the source and/or target string
     * @param {number} [params.index] if the resource being tested is an array resource, this represents the index of this string in the array
     * @param {string} [params.category] if the resource being tested is a plural resource, this represents the plural category of this string
     * @returns {Result|Array.<Result>|undefined} any results found in this string or undefined if no problems were found
     */
    matchString({source, target, file, resource, index, category}) {
        if (!source || !target) return;

        const sourceParams = this.extractParameters(source);
        const targetParams = this.extractParameters(target);

        if (sourceParams.length === 0 && targetParams.length === 0) return;

        const results = [];

        // Ensure required fields are available
        const resourceKey = resource.getKey();
        if (!resourceKey) {
            return;
        }
        if (!file) {
            return;
        }

        // Get location information from the resource
        const location = resource.getLocation();
        const lineNumber = location?.line;
        const charNumber = location?.char;

        // Count occurrences of each parameter
        function countParams(params) {
            const counts = {};
            for (const param of params) {
                counts[param] = (counts[param] || 0) + 1;
            }
            return counts;
        }
        const sourceCounts = countParams(sourceParams);
        const targetCounts = countParams(targetParams);

        // Check for missing parameters in target (by count)
        // Create separate Result for each different missing parameter
        for (const param of Object.keys(sourceCounts)) {
            const missingCount = sourceCounts[param] - (targetCounts[param] || 0);
            if (missingCount > 0) {
                const resultFields = {
                    severity: /** @type {const} */ ("error"),
                    description: `Source string GNU printf parameter ${param} not found in the target string.`,
                    rule: this,
                    id: resourceKey,
                    source: source,
                    highlight: `<e0>${target}</e0>`,
                    pathName: file,
                    lineNumber: lineNumber,
                    charNumber: charNumber,
                };
                results.push(new Result(resultFields));
            }
        }

        // Check for extra parameters in target (by count)
        // Group extra parameters by type to handle multiple of same type together
        const extraParamsByType = {};
        for (const param of Object.keys(targetCounts)) {
            const extraCount = targetCounts[param] - (sourceCounts[param] || 0);
            if (extraCount > 0) {
                extraParamsByType[param] = extraCount;
            }
        }

        // Create separate Result for each different extra parameter type
        for (const [param, extraCount] of Object.entries(extraParamsByType)) {
            let highlight = target;

            if (extraCount === 1) {
                // Single extra parameter - highlight the rightmost occurrence
                const lastIndex = highlight.lastIndexOf(param);
                if (lastIndex !== -1) {
                    highlight =
                        highlight.substring(0, lastIndex) +
                        `<e0>${param}</e0>` +
                        highlight.substring(lastIndex + param.length);
                }
            } else {
                // Multiple extra parameters of same type - highlight only the last N occurrences (left-to-right)
                // Find all indices of the param in the string
                let allIndices = [];
                let searchStart = 0;
                while (true) {
                    const idx = highlight.indexOf(param, searchStart);
                    if (idx === -1) break;
                    allIndices.push(idx);
                    searchStart = idx + param.length;
                }
                // Only tag the last 'extraCount' occurrences
                const indices = allIndices.slice(-extraCount);
                // Apply tags in left-to-right order, adjusting for offset as we insert tags
                let offset = 0;
                for (let i = 0; i < indices.length; i++) {
                    const idx = indices[i] + offset;
                    const tag = `<e${i}>${param}</e${i}>`;
                    highlight =
                        highlight.substring(0, idx) +
                        tag +
                        highlight.substring(idx + param.length);
                    offset += tag.length - param.length;
                }
            }

            const resultFields = {
                severity: /** @type {const} */ ("error"),
                description: `Extra target string GNU printf parameter ${param} not found in the source string.`,
                rule: this,
                id: resourceKey,
                source: source,
                highlight: highlight,
                pathName: file,
                lineNumber: lineNumber,
                charNumber: charNumber,
            };
            results.push(new Result(resultFields));
        }

        return results.length > 0 ? results : undefined;
    }
}

export default ResourceGNUPrintfMatch;
