/*
 * ILibPluralCategoriesChecker - Check whether the target plural has
 * the right plural categories in it for the locale
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

import Locale from 'ilib-locale';
import { Result, Rule } from 'ilib-lint-common';
import { getLanguagePluralCategories } from 'ilib-tools-common';

import { isPluralString, isValidPluralString, convertPluralStringToObject } from './ILibPluralString.js';

/**
 * Get the difference of two sets. That is, return a set that contains
 * all the items in set1 that are not in set2.
 * @private
 * @param {Set<string>} set1 The first set
 * @param {Set<string>} set2 The second set
 * @returns {Set<string>} The difference of the two sets
 */
function difference(set1, set2) {
    const result = new Set();
    set1.forEach(item => {
        if (!set2.has(item)) {
            result.add(item);
        }
    });
    return result;
}

/**
 * Get the union of two sets. That is, return a set that contains
 * all the items in set1 and set2.
 * @private
 * @param {Set<string>} set1 The first set
 * @param {Set<string>} set2 The second set
 * @returns {Set<string>} The union of the two sets
 */
function union(set1, set2) {
    const result = new Set(set1);
    set2.forEach(item => {
        result.add(item);
    });
    return result;
}


/**
 * @classdesc Class representing a check for ilib-style plural categories.
 * @class
 */
class ILibPluralCategoriesChecker extends Rule {
    constructor(options) {
        super(options);
        this.name = "resource-ilib-plural-categories-checker";
        this.description = "Test that the ilib-style plural categories of the target plural are correct.";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
        this.link = "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-javascript/docs/resource-ilib-plural-categories-checker.md";
    }

    getRuleType() {
        return "resource";
    }

    /**
     * Check the nodes of the source and target plural categories for equality.
     * @private
     * @param {Object} source The source categories object
     * @param {Object} target The target categories object
     * @param {Locale} locale The target locale
     * @param {Resource} resource The resource being checked
     * @returns {Result[]} An array of Result objects representing the problems found
     */
    matchCategories(source, target, locale, resource) {
        let problems = [];
        const srcLocale = new Locale(resource.getSourceLocale());

        // categories that are required according to the language rules
        let requiredSourceCategories, requiredTargetCategories;

        requiredSourceCategories = new Set(getLanguagePluralCategories(srcLocale.getLanguage()));
        requiredTargetCategories = new Set(getLanguagePluralCategories(locale.getLanguage()));

        const allSourceCategories = new Set(Object.keys(source));
        let actualNonrequiredSourceCategories = difference(allSourceCategories, requiredSourceCategories);

        const allTargetCategories = new Set(Object.keys(target));
        let actualNonrequiredTargetCategories = difference(allTargetCategories, requiredTargetCategories);

        // first check the required plural categories
        let missing = Array.from(requiredTargetCategories).filter(category => {
            if (!target[category]) {
                // if the required category doesn't exist in the target, check if it is required
                // in the source. If it is required in the source and does not exist there, then
                // there is an error in the source and we don't need to register a result for the
                // target -- the source needs to be fixed first. If it is required in the source
                // and exists in the source, then produce a result because it should also be there
                // in the target. If it is not required in the source, then produce a result because
                // it is required in the target language and it doesn't matter about the source
                // language.
                if (!requiredSourceCategories.has(category) || source[category]) {
                    return true;
                }
            }
            return false;
        });
        if (missing.length) {
            let opts = {
                severity: "error",
                rule: this,
                description: `Missing categories in target string: ${missing.join(", ")}. Expecting these: ${Array.from(union(requiredTargetCategories, actualNonrequiredSourceCategories)).join(", ")}`,
                id: resource.getKey(),
                highlight: `<e0>${resource.getTarget()}</e0>`,
                pathName: resource.getPath(),
                source: resource.getSource(),
                locale: resource.getTargetLocale()
            };
            problems.push(new Result(opts));
        }

        // now deal with the missing non-required categories
        missing = Array.from(actualNonrequiredSourceCategories).filter(category => {
            // if it is in the source, but it is not required, it should also be in the target
            // so give a warning
            return !allTargetCategories.has(category);
        });
        if (missing.length) {
            let opts = {
                severity: "warning", // non-required categories get a warning
                rule: this,
                description: `Missing categories in target string: ${missing.join(", ")}. Expecting these: ${Array.from(union(requiredTargetCategories, actualNonrequiredSourceCategories)).join(", ")}`,
                id: resource.getKey(),
                highlight: `<e0>${resource.getTarget()}</e0>`,
                pathName: resource.getPath(),
                source: resource.getSource(),
                locale: resource.getTargetLocale()
            };
            problems.push(new Result(opts));
        }

        // now deal with non-required categories that are in the target but not the source
        const extra = Array.from(actualNonrequiredTargetCategories).filter(category => {
            return !allSourceCategories.has(category);
        });
        if (extra.length) {
            let highlightIndex = 0;
            const highlight = Object.keys(target).map(key => {
                let choice = `${key}#${target[key]}`;
                if (extra.includes(key)) {
                    // if the target has a extra category that is not in the source,
                    // then we need to highlight it in the target string
                    choice = `<e${highlightIndex}>${choice}</e${highlightIndex}>`;
                    highlightIndex++;
                }
                return choice;
            }).join("|");
            let opts = {
                severity: "warning",
                rule: this,
                description: `Extra categories in target string: ${extra.join(", ")}. Expecting only these: ${Array.from(union(requiredTargetCategories, actualNonrequiredSourceCategories)).join(", ")}`,
                id: resource.getKey(),
                highlight: `${highlight}`,
                pathName: resource.getPath(),
                source: resource.getSource(),
                locale: resource.getTargetLocale()
            };
            problems.push(new Result(opts));
        }

        return problems;
    }

    /**
     * @override
     */
    match(options) {
        const { ir, locale } = options;

        if (ir.getType() !== "resource") return;  // we can only process resources
        const resources = ir.getRepresentation();
        const targetLocale = new Locale(locale);

        const results = resources.flatMap(resource => {
            switch (resource.getType()) {
                case 'string':
                    const source = resource.getSource();
                    const target = resource.getTarget();
                    if (isPluralString(source) && isValidPluralString(target)) {
                        const sourcePlurals = convertPluralStringToObject(source);
                        const targetPlurals = convertPluralStringToObject(target);

                        return this.matchCategories(sourcePlurals, targetPlurals, targetLocale, resource);
                    }
                    break;

                case 'array':
                    const srcArray = resource.getSource();
                    const tarArray = resource.getTarget();
                    if (tarArray) {
                        return srcArray.flatMap((item, i) => {
                            if (i < tarArray.length && tarArray[i]) {
                                if (isPluralString(item) && !isValidPluralString(tarArray[i])) {
                                    const sourcePlurals = convertPluralStringToObject(item);
                                    const targetPlurals = convertPluralStringToObject(tarArray[i]);

                                    return this.matchCategories(sourcePlurals, targetPlurals, targetLocale, resource);
                                }
                            }
                            return [];
                        }).filter(element => element);
                    }
                    break;

                case 'plural':
                    const srcPlural = resource.getSource();
                    const tarPlural = resource.getTarget();
                    // it would be very odd to have an ilib-style plural inside of a plural resource,
                    // but it is possible, so we check for it here
                    if (tarPlural) {
                        const categories = Array.from(new Set(Object.keys(tarPlural)).values());
                        return categories.flatMap(category => {
                            const item = srcPlural[category] || srcPlural.other;
                            if (isPluralString(item) && !isValidPluralString(tarPlural[category])) {
                                const sourcePlurals = convertPluralStringToObject(item);
                                const targetPlurals = convertPluralStringToObject(tarPlural[category]);

                                return this.matchCategories(sourcePlurals, targetPlurals, targetLocale, resource);
                            }
                        });
                    }
                    break;
            }

            return [];
        }).filter(element => element);
        return results.length > 1 ? results : results[0];
    }
}

export default ILibPluralCategoriesChecker;
