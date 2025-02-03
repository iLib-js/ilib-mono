/*
 * FStringMatchRule.js - implement a rule to match f-string substitution parameters
 *
 * Copyright © 2023-2024 JEDLSoft
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
import { Rule, Result } from 'ilib-lint-common';

// from https://peps.python.org/pep-0498/
const fstringRegExp = /\{\s*((\}\}|[^}])*?)\s*\}/g;

/**
 * @private
 */
function escapeRegex(re) {
    return re.replace(/([\{\}\[\]\.\?\*\+\(\)\|\\])/g, "\\$1");
}

/**
 * @class Represent an i18nlint rule.
 */
class FStringMatchRule extends Rule {
    constructor(options) {
        super(options);
        this.name = "resource-python-fstrings-match";
        this.description = "Test that the f-string substitution parameters match in the source and target strings.";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
    }

    getRuleType() {
        return "resource";
    }

    checkString(src, tar, file, resource, lineNumber) {
        if (!tar) {
            // no target string means we don't have to do the matching
            return undefined;
        }
        let results, match;
        let problems = [];
        let sourceParams = [];
        let targetParams = [];

        // find the source parameters
        fstringRegExp.lastIndex = 0;
        match = fstringRegExp.exec(src);
        while (match) {
            if (!match[0].startsWith("{{")) {
                sourceParams.push({
                    text: match[0],
                    name: match[1],
                    number: match[2]
                });
            }
            match = fstringRegExp.exec(src);
        }
        if (sourceParams.length < 1) {
            // no params to check
            return undefined;
        }

        // now find the target parameters
        fstringRegExp.lastIndex = 0;
        match = fstringRegExp.exec(tar);
        while (match) {
            if (!match[0].startsWith("{{")) {
                targetParams.push({
                    text: match[0],
                    name: match[1],
                    number: match[2]
                });
            }
            match = fstringRegExp.exec(tar);
        }

        // check the source against the target and then vice versa
        for (let i = 0; i < sourceParams.length; i++) {
            const srcParam = sourceParams[i];
            let found = false;
            for (let j = 0; j < targetParams.length; j++) {
                const tarParam = targetParams[j];
                if (tarParam.name === srcParam.name && tarParam.number === srcParam.number) {
                    targetParams.splice(j, 1);
                    found = true;
                    break;
                }
            }
            if (!found) {
                problems.push(new Result({
                    severity: "error",
                    rule: this,
                    description: `Source string substitution parameter ${srcParam.text} not found in the target string.`,
                    id: resource.getKey(),
                    highlight: `<e0>${tar}</e0>`,
                    pathName: file,
                    source: src,
                    lineNumber
                }));
            }
        }
        if (targetParams.length) {
            for (let j = 0; j < targetParams.length; j++) {
                const tarParam = targetParams[j];
                const re = new RegExp(escapeRegex(tarParam.text), "g");
                problems.push(new Result({
                    severity: "error",
                    rule: this,
                    description: `Extra target string substitution parameter ${tarParam.text} not found in the source string.`,
                    id: resource.getKey(),
                    highlight: tar.replace(re, "<e0>$&</e0>"),
                    pathName: file,
                    source: src,
                    lineNumber
                }));
            }
        }

        return problems;
    }

    /**
     * @override
     */
    match(options) {
        const { ir, locale } = options;
        let problems = [];

        if (ir.getType() !== "resource") return;  // we can only process resources
        const resources = ir.getRepresentation();

        const results = resources.flatMap(resource => {
            switch (resource.getType()) {
                case 'string':
                    const tarString = resource.getTarget();
                    if (tarString) {
                        return this.checkString(resource.getSource(), tarString, ir.sourceFile.getPath(), resource, options.lineNumber);
                    }
                    break;

                case 'array':
                    const srcArray = resource.getSource();
                    const tarArray = resource.getTarget();
                    if (tarArray) {
                        return srcArray.flatMap((item, i) => {
                            if (i < tarArray.length && tarArray[i]) {
                                return this.checkString(srcArray[i], tarArray[i], ir.sourceFile.getPath(), resource, options.lineNumber);
                            }
                        }).filter(element => {
                            return element;
                        });
                    }
                    break;

                case 'plural':
                    const srcPlural = resource.getSource();
                    const tarPlural = resource.getTarget();
                    if (tarPlural) {
                        const categories = Array.from(new Set(Object.keys(srcPlural).concat(Object.keys(tarPlural))).values());
                        return categories.flatMap(category => {
                            return this.checkString(srcPlural[category] || srcPlural.other, tarPlural[category] || tarPlural.other, ir.sourceFile.getPath(), resource, options.lineNumber);
                        });
                    }
                    break;
            }

            // no match
            return [];
        });
        return results.length > 1 ? results : results[0];
    }

    testCodeCoverageComment(options) {
        const { ir, locale } = options;
        let problems = [];

        if (ir.getType() !== "resource") return;  // we can only process resources
        const resources = ir.getRepresentation();

        const results = resources.flatMap(resource => {
            switch (resource.getType()) {
                case 'string':
                    const tarString = resource.getTarget();
                    if (tarString) {
                        return this.checkString(resource.getSource(), tarString, ir.sourceFile.getPath(), resource, options.lineNumber);
                    }
                    break;

                case 'array':
                    const srcArray = resource.getSource();
                    const tarArray = resource.getTarget();
                    if (tarArray) {
                        return srcArray.flatMap((item, i) => {
                            if (i < tarArray.length && tarArray[i]) {
                                return this.checkString(srcArray[i], tarArray[i], ir.sourceFile.getPath(), resource, options.lineNumber);
                            }
                        }).filter(element => {
                            return element;
                        });
                    }
                    break;

                case 'plural':
                    const srcPlural = resource.getSource();
                    const tarPlural = resource.getTarget();
                    if (tarPlural) {
                        const categories = Array.from(new Set(Object.keys(srcPlural).concat(Object.keys(tarPlural))).values());
                        return categories.flatMap(category => {
                            return this.checkString(srcPlural[category] || srcPlural.other, tarPlural[category] || tarPlural.other, ir.sourceFile.getPath(), resource, options.lineNumber);
                        });
                    }
                    break;
            }

            // no match
            return [];
        });
        return results.length > 1 ? results : results[0];
    }

}

export default FStringMatchRule;
