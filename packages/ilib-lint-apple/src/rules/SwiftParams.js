/*
 * SwiftParams.js - rule to check if Swift string interpolation parameters in the source string
 * also appear in the target string with the same parameter names
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

import { Rule, Result } from 'ilib-lint-common';
import { ResourceString, ResourceArray, ResourcePlural } from 'ilib-tools-common';

/**
 * @class Represent an ilib-lint rule for Swift string interpolation parameters.
 */
class SwiftParams extends Rule {
    /**
     * Make a new rule instance.
     * @constructor
     */
    constructor(options) {
        super(options);
        this.name = "resource-swift-params";
        this.description = "Ensure that Swift string interpolation parameters in source strings also appear in target strings with the same parameter names.";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
        this.link = "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-apple/docs/resource-swift-params.md";
    }

    /**
     * Extract Swift string interpolation parameters from a string.
     * Supports both simple parameters \(name) and complex expressions \(expression)
     * @private
     * @param {string} str the string to extract parameters from
     * @returns {Array<string>} array of parameter strings found
     */
    extractParameters(str) {
        if (!str || typeof str !== 'string') return [];

        // (?:^|[^\\]) - start of string or any character except backslash (captured)
        // (\\\([^)]*\)) - the interpolation
        const swiftInterpolationRegex = /(^|[^\\])(\\\([^)]*\))/g;

        const matches = [];
        let match;

        while ((match = swiftInterpolationRegex.exec(str)) !== null) {
            matches.push(match[2]); // Always push the interpolation part
        }

        return matches;
    }

    /**
     * Check a string pair for Swift parameter mismatches.
     * @private
     * @param {Object} params parameters for the string matching
     * @param {String|undefined} params.source the source string to match against
     * @param {String|undefined} params.target the target string to match
     * @param {String} params.file the file path where the resources came from
     * @param {Resource} params.resource the resource that contains the source and/or target string
     * @param {number} [params.index] if the resource being tested is an array resource, this represents the index of this string in the array
     * @param {string} [params.category] if the resource being tested is a plural resource, this represents the plural category of this string
     * @returns {Result|Array.<Result>|undefined} any results found in this string or undefined if no problems were found
     */
    checkParameters({source, target, file, resource, index, category}) {
        if (!source) return;
        if (!target) {
            // If target is missing, check if source has parameters and report them as missing in target
            const sourceParams = this.extractParameters(source);
            if (sourceParams.length === 0) return; // No parameters to check
            
            const resourceKey = resource.getKey();
            if (!resourceKey || !file) return;
            
            const location = resource.getLocation();
            const lineNumber = location?.line;
            const charNumber = location?.char;
            
            const resultFields = {
                severity: /** @type {const} */ ("error"),
                description: `Source string Swift parameter ${sourceParams[0]} not found in the target string.`,
                rule: this,
                id: resourceKey,
                source: source,
                highlight: `<e0>${target || ''}</e0>`,
                pathName: file,
                lineNumber: lineNumber,
                charNumber: charNumber
            };
            return new Result(resultFields);
        }

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
                    description: `Source string Swift parameter ${param} not found in the target string.`,
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
            extraInTarget.forEach((param, index) => {
                // Highlight the specific extra parameter in the target string
                let highlight;
                if (typeof target === 'string') {
                    // Use a more robust approach to find and replace the parameter
                    const paramIndex = target.indexOf(param);
                    if (paramIndex !== -1) {
                        highlight = target.substring(0, paramIndex) + 
                                  `<e${index}>${param}</e${index}>` + 
                                  target.substring(paramIndex + param.length);
                    } else {
                        highlight = `<e${index}>${param}</e${index}>`;
                    }
                } else {
                    highlight = `<e${index}>${param}</e${index}>`;
                }
                const resultFields = {
                    severity: /** @type {const} */ ("error"),
                    description: `Extra target string Swift parameter ${param} not found in the source string.`,
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

    /**
     * Match this rule against the given intermediate representation.
     * @override
     * @param {Object} params parameters for the matching
     * @param {String} params.locale the locale to match against
     * @param {IntermediateRepresentation} params.ir the intermediate representation to match
     * @returns {Result|Array.<Result>|undefined} a Result instance describing the problem if
     * the rule check fails for this locale, or an array of such Result instances if
     * there are multiple problems with the same input, or `undefined` if there is no
     * problem found (ie. the rule does not match).
     */
    match({locale, ir}) {
        if (!ir || ir.getType() !== "resource") return undefined;

        const resources = ir.getRepresentation();
        const results = [];

        for (const resource of resources) {
            if (resource instanceof ResourceString) {
                const result = this.checkParameters({
                    source: resource.getSource(),
                    target: resource.getTarget(),
                    file: ir.getSourceFile().getPath(),
                    resource: resource
                });
                if (result) {
                    results.push(...(Array.isArray(result) ? result : [result]));
                }
            } else if (resource instanceof ResourceArray) {
                const sourceArray = resource.getSource();
                const targetArray = resource.getTarget();
                
                if (Array.isArray(sourceArray) && Array.isArray(targetArray)) {
                    const maxLength = Math.max(sourceArray.length, targetArray.length);
                    for (let i = 0; i < maxLength; i++) {
                        const source = sourceArray[i];
                        const target = targetArray[i];
                        const result = this.checkParameters({
                            source: source,
                            target: target,
                            file: ir.getSourceFile().getPath(),
                            resource: resource,
                            index: i
                        });
                        if (result) {
                            results.push(...(Array.isArray(result) ? result : [result]));
                        }
                    }
                }
            } else if (resource instanceof ResourcePlural) {
                const sourcePlural = resource.getSource();
                const targetPlural = resource.getTarget();
                
                if (sourcePlural && targetPlural) {
                    const categories = Object.keys(sourcePlural);
                    for (const category of categories) {
                        const source = sourcePlural[category];
                        const target = targetPlural[category];
                        const result = this.checkParameters({
                            source: source,
                            target: target,
                            file: ir.getSourceFile().getPath(),
                            resource: resource,
                            category: category
                        });
                        if (result) {
                            results.push(...(Array.isArray(result) ? result : [result]));
                        }
                    }
                }
            }
        }

        return results.length > 0 ? results : undefined;
    }
}

export default SwiftParams; 