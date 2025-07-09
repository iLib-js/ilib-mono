/*
 * ResourceGNUPrintfMatch.js - rule to check if GNU printf-style parameters in the source string
 * also appear in the target string with the same format specifiers
 *
 * Copyright © 2023-2025 JEDLSoft
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
     * and GNU extensions (%m, %'d, %I, etc.)
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
        // [diouxXfFeEgGaAcCsSpn%m'#0I] - format specifier including GNU extensions
        const gnuPrintfRegex = /%(?:(\d+)\$)?(?:(\*))?(?:\.(?:\*|\d+))?(?:[hlL]|hh|ll)?[diouxXfFeEgGaAcCsSpn%m'#0I]/g;

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

        // Check for missing parameters in target
        const missingInTarget = sourceParams.filter(param => !targetParams.includes(param));
        if (missingInTarget.length > 0) {
            const highlight = `<e0>${target}</e0>`;
            missingInTarget.forEach(param => {
                const resultFields = {
                    severity: /** @type {const} */ ("error"),
                    description: `Source string GNU printf parameter ${param} not found in the target string.`,
                    rule: this,
                    id: resourceKey,
                    source: source,
                    highlight: highlight,
                    pathName: file,
                    lineNumber: lineNumber,
                    charNumber: charNumber
                };
                results.push(new Result(resultFields));
            });
        }

        // Check for extra parameters in target
        const extraInTarget = targetParams.filter(param => !sourceParams.includes(param));
        if (extraInTarget.length > 0) {
            extraInTarget.forEach(param => {
                // Highlight only the first occurrence of the extra param in the target string
                let highlight;
                if (typeof target === 'string') {
                    const re = new RegExp(param.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
                    highlight = target.replace(re, '<e0>' + param + '</e0>');
                } else {
                    highlight = `<e0>${param}</e0>`;
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
                    charNumber: charNumber
                };
                results.push(new Result(resultFields));
            });
        }

        return results.length > 0 ? results : undefined;
    }
}

export default ResourceGNUPrintfMatch;