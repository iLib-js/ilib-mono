/*
 * ResourceKotlinParams.js - Check for Kotlin string template parameters in resources
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

import { Result, Rule } from 'ilib-lint-common';

/**
 * @classdesc Class representing a check for Kotlin string template parameters.
 * @class
 */
class ResourceKotlinParams extends Rule {
    constructor(options) {
        super(options);
        this.name = "resource-kotlin-params";
        this.description = "Check that Kotlin string template parameters in source strings are properly matched in target strings.";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
        this.link = "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-java/docs/resource-kotlin-params.md";
    }

    getRuleType() {
        return "resource";
    }

    /**
     * Extract Kotlin string template parameters from a string
     * @param {string} str - The string to extract parameters from
     * @returns {Array<string>} Array of parameter names (e.g., ["name", "count"])
     */
    extractKotlinParams(str) {
        if (!str || typeof str !== 'string') return [];

        const params = [];

        // Match simple variable interpolation: $variable
        // This regex matches $ followed by a valid Kotlin identifier, but not preceded by ${{
        const simpleParamRegex = /\$([a-zA-Z_][a-zA-Z0-9_]*)\b(?![\w.]*\})/g;
        let match;

        while ((match = simpleParamRegex.exec(str)) !== null) {
            params.push(match[1]); // Extract the variable name
        }

        // Match expression interpolation: ${expression}
        // This regex matches ${...} where ... can contain anything except }
        const expressionParamRegex = /\$\{([^}]+)\}/g;

        while ((match = expressionParamRegex.exec(str)) !== null) {
            const expression = match[1].trim();
            params.push(expression);
        }

        return [...new Set(params)]; // Remove duplicates
    }

    /**
     * Check if target parameters include all required source parameters
     * @param {Array<string>} sourceParams - Source parameters
     * @param {Array<string>} targetParams - Target parameters
     * @returns {boolean} True if target has all required parameters
     */
    hasAllRequiredParams(sourceParams, targetParams) {
        // Check if all source parameters are present in target
        return sourceParams.every(param => targetParams.includes(param));
    }

    /**
     * Check parameters and return any errors or warnings
     * @param {string} source - Source string
     * @param {string} target - Target string
     * @param {Object} resource - Resource object
     * @param {Object} ir - Intermediate representation
     * @param {Object} options - Options object
     * @param {string} context - Context string for error messages (e.g., "array item [0]", "plural (other)")
     * @returns {Array<Result>} Array of Result objects (errors and warnings)
     */
    checkParameters(source, target, resource, ir, options, context = '') {
        const results = [];
        const sourceParams = this.extractKotlinParams(source);
        const targetParams = this.extractKotlinParams(target);

        // Check for missing parameters (error)
        if (sourceParams.length > 0) {
            if (!this.hasAllRequiredParams(sourceParams, targetParams)) {
                const missingParams = sourceParams.filter(param =>
                    !targetParams.includes(param)
                );

                const description = context
                    ? `Missing Kotlin string template parameters in target ${context}: $${missingParams.join(', $')}`
                    : `Missing Kotlin string template parameters in target: $${missingParams.join(', $')}`;

                const highlight = context
                    ? `${context} <e0>${target}</e0>`
                    : `<e0>${target}</e0>`;

                results.push(new Result({
                    severity: "error",
                    id: resource.getKey(),
                    source,
                    description,
                    rule: this,
                    locale: resource.sourceLocale,
                    pathName: ir.sourceFile.getPath(),
                    highlight,
                    lineNumber: options.lineNumber
                }));
            }
        }

        // Check for extra parameters (warning)
        const extraParams = targetParams.filter(param => !sourceParams.includes(param));
        if (extraParams.length > 0) {
            let highlightedTarget = target;
            extraParams.forEach((param, index) => {
                // Highlight the specific extra parameter in the target string
                if (typeof target === 'string') {
                    // For simple parameters ($variable), find and replace
                    const simpleParam = `$${param}`;
                    const simpleParamIndex = highlightedTarget.indexOf(simpleParam);
                    if (simpleParamIndex !== -1) {
                        highlightedTarget = highlightedTarget.substring(0, simpleParamIndex) +
                                          `<e${index}>${simpleParam}</e${index}>` +
                                          highlightedTarget.substring(simpleParamIndex + simpleParam.length);
                    } else {
                        // For expression parameters (${expression}), find and replace
                        const expressionParam = `\${${param}}`;
                        const expressionParamIndex = highlightedTarget.indexOf(expressionParam);
                        if (expressionParamIndex !== -1) {
                            highlightedTarget = highlightedTarget.substring(0, expressionParamIndex) +
                                              `<e${index}>${expressionParam}</e${index}>` +
                                              highlightedTarget.substring(expressionParamIndex + expressionParam.length);
                        }
                    }
                }
            });

            const description = context
                ? `Extra Kotlin string template parameters in target ${context}: $${extraParams.join(', $')}`
                : `Extra Kotlin string template parameters in target: $${extraParams.join(', $')}`;

            const highlight = context
                ? `${context} ${highlightedTarget}`
                : highlightedTarget;

            results.push(new Result({
                severity: "warning",
                id: resource.getKey(),
                source,
                description,
                rule: this,
                locale: resource.sourceLocale,
                pathName: ir.sourceFile.getPath(),
                highlight,
                lineNumber: options.lineNumber
            }));
        }

        return results;
    }

    /**
     * @override
     */
    match(options) {
        const { ir, locale } = options;

        if (ir.getType() !== "resource") return;  // we can only process resources
        const resources = ir.getRepresentation();

        const results = resources.flatMap(resource => {
            switch (resource.getType()) {
                case 'string':
                    const source = resource.getSource();
                    const target = resource.getTarget();

                    if (source && target) {
                        return this.checkParameters(source, target, resource, ir, options);
                    }
                    break;

                case 'array':
                    const srcArray = resource.getSource();
                    const tarArray = resource.getTarget();
                    if (tarArray) {
                        return srcArray.flatMap((item, i) => {
                            if (i < tarArray.length && tarArray[i]) {
                                return this.checkParameters(item, tarArray[i], resource, ir, options, `array item [${i}]`);
                            }
                            return [];
                        });
                    }
                    break;

                case 'plural':
                    const srcPlural = resource.getSource();
                    const tarPlural = resource.getTarget();
                    if (tarPlural) {
                        const categories = Array.from(new Set(Object.keys(tarPlural)).values());
                        return categories.flatMap(category => {
                            const item = srcPlural[category] || srcPlural.other;
                            if (item && tarPlural[category]) {
                                return this.checkParameters(item, tarPlural[category], resource, ir, options, `plural (${category})`);
                            }
                            return [];
                        });
                    }
                    break;
            }

            return [];
        });

        return results.length > 1 ? results : results[0];
    }
}

export default ResourceKotlinParams;