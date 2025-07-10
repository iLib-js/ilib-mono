/*
 * ResourceJavaParams.js - Check for Java MessageFormat parameters in resources
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
 * @classdesc Class representing a check for Java MessageFormat parameters.
 * @class
 */
class ResourceJavaParams extends Rule {
    constructor(options) {
        super(options);
        this.name = "resource-java-params";
        this.description = "Check that Java MessageFormat parameters in source strings are properly matched in target strings.";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
        this.link = "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-java/docs/resource-java-params.md";
    }

    getRuleType() {
        return "resource";
    }

    /**
     * Extract Java MessageFormat parameters from a string
     * @param {string} str - The string to extract parameters from
     * @returns {Array<string>} Array of full parameter specifications (e.g., ["{0}", "{1,number,currency}"])
     */
    extractJavaParams(str) {
        if (!str || typeof str !== 'string') return [];
        
        // Match Java MessageFormat parameters: {0}, {1}, {2}, etc.
        // Also handles complex format: {0,number,currency}, {1,date,short}, etc.
        const paramRegex = /\{(\d+)(?:,[^}]*)?\}/g;
        const params = [];
        let match;
        
        while ((match = paramRegex.exec(str)) !== null) {
            params.push(match[0]); // Extract the full parameter specification
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
        const sourceParams = this.extractJavaParams(source);
        const targetParams = this.extractJavaParams(target);
        
        // Check for missing parameters (error)
        if (sourceParams.length > 0) {
            if (!this.hasAllRequiredParams(sourceParams, targetParams)) {
                const missingParams = sourceParams.filter(param => 
                    !targetParams.includes(param)
                );
                
                const description = context 
                    ? `Missing Java MessageFormat parameters in target ${context}: ${missingParams.join(', ')}`
                    : `Missing Java MessageFormat parameters in target: ${missingParams.join(', ')}`;
                
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
            extraParams.forEach(param => {
                // Escape regex special characters in param
                const paramRegex = new RegExp(param.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
                highlightedTarget = highlightedTarget.replace(paramRegex, `<e0>${param}</e0>`);
            });
            
            const description = context 
                ? `Extra Java MessageFormat parameters in target ${context}: ${extraParams.join(', ')}`
                : `Extra Java MessageFormat parameters in target: ${extraParams.join(', ')}`;
            
            const highlight = context 
                ? `${context} <e0>${highlightedTarget}</e0>`
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
                        }).filter(element => element);
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
                        }).filter(element => element);
                    }
                    break;
            }

            return [];
        }).filter(element => element);
        
        return results.length > 0 ? results : undefined;
    }
}

export default ResourceJavaParams; 