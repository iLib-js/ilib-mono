/*
 * ResourceICUPluralTranslation.js - rule to check formatjs/ICU style plurals
 * in the target string actually have translations
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

import log4js from 'log4js';
import { IntlMessageFormat } from 'intl-messageformat';
import Locale from 'ilib-locale';
import { Result } from 'ilib-lint-common';

import ResourceRule from './ResourceRule.js';

const logger = log4js.getLogger("ilib-lint.ResourceICUPluralTranslation");

/**
 * @class Represent an ilib-lint rule.
 */
class ResourceICUPluralTranslation extends ResourceRule {
    /**
     * Make a new rule instance.
     * @constructor
     */
    constructor(options) {
        super(options);
        this.name = "resource-icu-plurals-translated";
        this.description = "Ensure that plurals in translated resources are also translated";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
        this.link = "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-icu-plurals-translated.md";

        // Initialize exceptions from configuration
        this.exceptions = {};

        if (options && options.exceptions) {
            if (typeof options.exceptions === 'object' && !Array.isArray(options.exceptions)) {
                // exceptions is an object with locale codes as keys and arrays of exception words/phrases as values
                // Validate locales and store by language only
                for (const [locale, exceptionList] of Object.entries(options.exceptions)) {
                    if (Array.isArray(exceptionList)) {
                        const localeObj = new Locale(locale);
                        if (localeObj.isValid()) {
                            const language = localeObj.getLanguage();
                            if (language) {
                                if (!this.exceptions[language]) {
                                    this.exceptions[language] = new Set();
                                }
                                exceptionList.forEach(exception =>
                                    this.exceptions[language].add(exception.toLowerCase().trim())
                                );
                            }
                        } else {
                            // Skip invalid locales
                            logger.warn(`Invalid locale in exceptions configuration: ${locale}`);
                        }
                    }
                }
            }
        }
    }

    /**
     * Check if the given text contains any exceptions for the given locale.
     * @private
     * @param {string} text the text to check
     * @param {string} locale the locale to check against
     * @returns {boolean} true if the text contains any exceptions
     */
    containsExceptions(text, locale) {
        try {
            const localeObj = new Locale(locale);
            if (!localeObj.isValid()) {
                return false;
            }
            const language = localeObj.getLanguage();
            if (!language || !this.exceptions[language]) {
                return false;
            }

            const languageExceptions = this.exceptions[language];
            if (!languageExceptions) {
                return false;
            }
            const normalizedText = text.toLowerCase().trim();

            // Check if any exception exactly matches the text
            return languageExceptions.has(normalizedText);
        } catch (e) {
            return false;
        }
    }

    /**
     * Given some ast nodes, reconstruct the string that it came from, glossing
     * over the plurals and selects, which will be compared separately anyways.
     * Add spaces in between the parts so that later we can compress all the
     * spaces to normalize them. The idea is that we can show the following
     * have equivalent text in them:
     * "x" + "y" vs. " x" + " y "
     * Without adding the spaces and then compressing them before comparison,
     * the two would not be the same, even though the actual translatable text
     * in them is the same, which is what we were trying to get at.
     * @private
     */
    reconstruct(nodes) {
        let result = "";

        for (let i = 0; i < nodes.length; i++) {
            switch (nodes[i].type) {
                case 1:
                    result += ` {${nodes[i].value}} `;
                    break;

                case 2:
                    result += ` {${nodes[i].value}, number, ${nodes[i].style}} `;
                    break;

                case 3:
                    result += ` {${nodes[i].value}, date, ${nodes[i].style}} `;
                    break;

                case 4:
                    result += ` {${nodes[i].value}, time, ${nodes[i].style}} `;
                    break;

                // for select ordinals and plurals, replace them with a fixed string
                // so that we don't match on the details of those subparts
                case 5:
                    result += ` {selectordinal} `;
                    break;

                case 6:
                    result += ` {plural} `;
                    break;

                case 7:
                    result += " # ";
                    break;

                case 8:
                    result += `<${nodes[i].value}/>`;
                    break;

                default:
                    result += nodes[i].value;
                    break;
            }
        }

        return result;
    }

    /**
     * Reconstruct the string but only give the text nodes of the given tree so we can
     * see if there is anything to translate.
     * @private
     * @param {Object} nodes the top of the tree to reconstruct
     * @returns {string} the text of the tree
     */
    textNodes(nodes) {
        let result = "";

        for (let i = 0; i < nodes.length; i++) {
            if (nodes[i].type === 0) {
                result += nodes[i].value;
            }
        }

        return result.trim();
    }

    /**
     * Traverse an array of ast nodes to find any embedded selects or plurals
     * or tags, and then process those separately.
     * @private
     */
    traverse(resource, file, source, target) {
        let sourcePlurals = {};
        let targetPlurals = {};
        let sourceTags = {};
        let targetTags = {};

        // Find the plurals and tags in this string and remember them according to their
        // unique name. We do this because the order of plurals and tags may change in
        // translations, so we have to go by the only part that doesn't change -- the name
        for (let i = 0; i < source.length; i++) {
            // selectordinal or plural
            if (source[i].type === 5 || source[i].type === 6) {
                sourcePlurals[source[i].value] = source[i];
            } else if (source[i].type === 8) {
                sourceTags[source[i].value] = source[i];
            }
        }
        for (let i = 0; i < target.length; i++) {
            if (target[i].type === 5 || target[i].type === 6) {
                targetPlurals[target[i].value] = target[i];
            } else if (target[i].type === 8) {
                targetTags[target[i].value] = target[i];
            }
        }

        // for each plural, try to match it up with the target plural by name and check if
        // there is a translation
        let results = Object.keys(sourcePlurals).flatMap(name => {
            const sourcePlural = sourcePlurals[name];
            const targetPlural = targetPlurals[name];
            if (!targetPlural) {
                // missing target plurals are for a different rule, so don't report it here
                return;
            }
            return Object.keys(targetPlural.options).flatMap(category => {
                const sourceCategory = sourcePlural.options[category] ? category : "other";
                const sourcePluralCat = sourcePlural.options[sourceCategory];
                if (!sourcePluralCat) return []; // nothing to check!

                // Only compare the source and target if there is some text there to
                // translate. This will avoid the false positives for the situation where
                // the only thing in the plural category string is just a {variable}.
                if (this.textNodes(sourcePluralCat.value).length === 0) return [];

                const sourceStr = this.reconstruct(sourcePluralCat.value).replace(/\s+/g, " ").trim();
                const targetStr = this.reconstruct(targetPlural.options[category].value).replace(/\s+/g, " ").trim();
                let result = [];

                // use case- and whitespace-insensitive match. Also, don't produce a result
                // if the source string is empty
                if (sourceStr.length && sourceStr.toLowerCase() === targetStr.toLowerCase()) {
                    // Check if this text contains any exceptions for the target locale
                    const targetLocale = resource.getTargetLocale();
                    const hasExceptions = this.containsExceptions(sourceStr, targetLocale);
                    if (!hasExceptions) {
                        let value = {
                            severity: /** @type {"warning"} */ ("warning"),
                            description: `Translation of the category \'${category}\' is the same as the source.`,
                            rule: this,
                            id: resource.getKey(),
                            source: `${sourceCategory} {${sourceStr}}`,
                            highlight: `Target: <e0>${category} {${targetStr}}</e0>`,
                            pathName: file,
                            locale: targetLocale
                        };
                        if (typeof(resource.lineNumber) !== 'undefined') {
                            value.lineNumber = resource.lineNumber;
                        }
                        result.push(new Result(value));
                    }
                }

                // now the plurals may have plurals nested in them, so recursively check them too
                return result.concat(this.traverse(resource, file, sourcePluralCat.value, targetPlural.options[category].value));
             });
        });

        // now recursively handle the tags
        results = results.concat(Object.keys(sourceTags).flatMap(name => {
            const sourceTag = sourceTags[name];
            const targetTag = targetTags[name];
            if (!targetTag) {
                // missing target tags are for a different rule, so don't report it here
                return;
            }
            return this.traverse(resource, file, sourceTag.children, targetTag.children);
        }));
        return results;
    }

    /**
     * Check a string in a resource for missing translations of plurals or selects.
     * @override
     */
    matchString({source, target, file, resource}) {
        const sLoc = new Locale(resource.getSourceLocale());
        const tLoc = new Locale(resource.getTargetLocale());

        // same language and script means that the translations are allowed to be the same as
        // the source
        if (sLoc.getLangSpec() === tLoc.getLangSpec()) return;

        // don't need to check target if there is no source
        if (!source || !source.length) return;

        let sourceAst;
        let targetAst;
        try {
            let imf = new IntlMessageFormat(source, sLoc.getSpec());
            sourceAst = imf.getAst();

            imf = new IntlMessageFormat(target, tLoc.getSpec());
            targetAst = imf.getAst();
        } catch (e) {
            // ignore plural syntax errors -- that's a different rule
            return;
        }

        const results = this.traverse(resource, file, sourceAst, targetAst).filter(result => result);

        return results;
    }
}

export default ResourceICUPluralTranslation;