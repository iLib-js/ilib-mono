/*
 * ResourceICUPlurals.js - rule to check formatjs/ICU style plurals in the target string
 *
 * Copyright © 2022-2023, 2025 JEDLSoft
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

import { IntlMessageFormat } from 'intl-messageformat';
import Locale from 'ilib-locale';
import { Result } from 'ilib-lint-common';
import { getLanguagePluralCategories } from 'ilib-tools-common';

import ResourceRule from './ResourceRule.js';

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
 * @class Represent an ilib-lint rule.
 */
class ResourceICUPlurals extends ResourceRule {
    /**
     * Make a new rule instance.
     * @constructor
     */
    constructor(options) {
        super(options);
        this.name = "resource-icu-plurals";
        this.description = "Ensure that plurals in translated resources have the correct syntax";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
        this.link = "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-icu-plurals.md";
    }

    matchCategories(sourceSelect, targetSelect, locale, resource) {
        let problems = [];
        const srcLocale = new Locale(resource.getSourceLocale());

        // categories that are required according to the language rules
        let requiredSourceCategories, requiredTargetCategories;

        if (sourceSelect.node.pluralType === "cardinal") {
            requiredSourceCategories = new Set(getLanguagePluralCategories(srcLocale.getLanguage()));
            requiredTargetCategories = new Set(getLanguagePluralCategories(locale.getLanguage()));
        } else {
            // for select or selectordinal, only the "other" category is required
            requiredSourceCategories = new Set([ "other" ]);
            requiredTargetCategories = new Set([ "other" ]);
        }

        const allSourceCategories = new Set(Object.keys(sourceSelect.node.options));
        let actualNonrequiredSourceCategories = difference(allSourceCategories, requiredSourceCategories);

        const allTargetCategories = new Set(Object.keys(targetSelect.node.options));
        if (sourceSelect.node.pluralType !== "cardinal") {
            // for select and selectordinal, the target should always have all of the same categories as the source
            requiredTargetCategories = allSourceCategories;
        }
        let actualNonrequiredTargetCategories = difference(allTargetCategories, requiredTargetCategories);

        // first check the required plural categories
        let missing = Array.from(requiredTargetCategories).filter(category => {
            if (!targetSelect.node.options[category]) {
                // if the required category doesn't exist in the target, check if it is required
                // in the source. If it is required in the source and does not exist there, then
                // there is an error in the source and we don't need to register a result for the
                // target -- the source needs to be fixed first. If it is required in the source
                // and exists in the source, then produce a result because it should also be there
                // in the target. If it is not required in the source, then produce a result because
                // it is required in the target language and it doesn't matter about the source
                // language.
                if (!requiredSourceCategories.has(category) || sourceSelect.node.options[category]) {
                    return true;
                }
            } else if (sourceSelect.node.options[category]) {
                // if both the target and source category exists, we can check the
                // whether the nodes match
                problems = problems.concat(this.checkNodes(
                    sourceSelect.node.options[category].value,
                    targetSelect.node.options[category].value,
                    locale,
                    resource
                ));
            } else if (category === "few" || category === "many" || category === "two") {
                // target exists, but source does not -> if it is a plural category,
                // we can check it against the source "other" category
                problems = problems.concat(this.checkNodes(
                    sourceSelect.node.options.other.value,
                    targetSelect.node.options[category].value,
                    locale,
                    resource
                ));
            }
            return false;
        });
        if (missing.length) {
            let opts = {
                severity: "error",
                rule: this,
                description: `Missing categories in target string: ${missing.join(", ")}. Expecting these: ${Array.from(union(requiredTargetCategories, actualNonrequiredSourceCategories)).join(", ")}`,
                id: resource.getKey(),
                highlight: `Target: ${resource.getTarget()}<e0></e0>`,
                pathName: resource.getPath(),
                source: resource.getSource(),
                locale: resource.getTargetLocale()
            };
            problems.push(new Result(opts));
        }

        // now deal with the missing non-required categories
        if (sourceSelect.node.pluralType === "cardinal") {
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
                    highlight: `Target: ${resource.getTarget()}<e0></e0>`,
                    pathName: resource.getPath(),
                    source: resource.getSource(),
                    locale: resource.getTargetLocale()
                };
                problems.push(new Result(opts));
            }
        } // else the source categories are already required in the target, so we don't need to check them again

        // now deal with non-required categories that are in the target but not the source
        const extra = Array.from(actualNonrequiredTargetCategories).filter(category => {
            return !allSourceCategories.has(category);
        });
        if (extra.length) {
            const highlight = resource.getTarget().replace(new RegExp(`(${extra.join("|")})\\s*\\{`, "g"), "<e0>$1</e0> {");
            let opts = {
                severity: "warning",
                rule: this,
                description: `Extra categories in target string: ${extra.join(", ")}. Expecting only these: ${Array.from(union(requiredTargetCategories, actualNonrequiredSourceCategories)).join(", ")}`,
                id: resource.getKey(),
                highlight: `Target: ${highlight}`,
                pathName: resource.getPath(),
                source: resource.getSource(),
                locale: resource.getTargetLocale()
            };
            problems.push(new Result(opts));
        }

        return problems;
    }

    findSelects(ast) {
        let selects = {};

        ast.forEach(node => {
            // selectordinal || plural/select
            if (node.type === 5 || node.type === 6) {
                // make sure the name is unique
                let name = node.value;
                let index = 0;
                while (selects[name]) {
                    name = node.value + index++;
                }
                selects[name] = {
                    node,
                    categories: Object.keys(node.options)
                };
            }
        });

        return selects;
    }

    checkNodes(sourceAst, targetAst, locale, resource) {
        const sourceSelects = this.findSelects(sourceAst);
        const targetSelects = this.findSelects(targetAst);
        let problems = [];

        Object.keys(targetSelects).forEach(select => {
            const targetSelect = targetSelects[select];
            if (sourceSelects[select]) {
                problems = problems.concat(this.matchCategories(sourceSelects[select], targetSelect, locale, resource));
            } else {
                const targetSnippet = resource.getTarget().replace(new RegExp(`(\\{\\s*${select})`, "g"), "<e0>$1</e0>");
                let opts = {
                    severity: "error",
                    rule: this,
                    description: `Select or plural with pivot variable ${targetSelects[select].node.value} does not exist in the source string. Possible translated variable name.`,
                    id: resource.getKey(),
                    highlight: `Target: ${targetSnippet}`,
                    pathName: resource.getPath(),
                    source: resource.getSource(),
                    locale: resource.getTargetLocale()
                };
                problems.push(new Result(opts));
            }
        });

        return problems;
    }

    matchString({source, target, file, resource}) {
        if (!target) return; // can't check "nothing" !

        const sLoc = new Locale(resource.getSourceLocale());
        const tLoc = new Locale(resource.getTargetLocale());
        let sourceAst;
        let targetAst;
        let problems = [];

        try {
            const imf = new IntlMessageFormat(source, sLoc.getSpec(), undefined, {captureLocation: true});
            // look in the abstract syntax tree for the categories that were parsed out and make
            // sure the required ones are there
            sourceAst = imf.getAst();
        } catch (e) {
            // if there are problems in the source string, do not check the target string because we
            // do not have anything good to match against
            return undefined;
        }
        try {
            const imf = new IntlMessageFormat(target, tLoc.getSpec(), undefined, {captureLocation: true});
            targetAst = imf.getAst();

            problems = this.checkNodes(sourceAst, targetAst, tLoc, resource);
        } catch (e) {
            let value = {
                severity: "error",
                description: `Incorrect plural or select syntax in target string: ${e}`,
                rule: this,
                id: resource.getKey(),
                source,
                highlight: `Target: ${target.substring(0, e?.location?.end?.offset)}<e0>${target.substring(e?.location?.end?.offset)}</e0>`,
                pathName: file,
                locale: tLoc.getSpec()
            };
            if (typeof(resource.lineNumber) !== 'undefined') {
                value.lineNumber = resource.lineNumber + e.location.end.line - 1;
            }
            problems.push(new Result(value));
        }
        return problems.length < 2 ? problems[0] : problems;
    }
}

export default ResourceICUPlurals;
