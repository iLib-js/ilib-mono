/*
 * ILibPluralSyntaxChecker - Check the syntax of a plural string from ilib
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

import { isPluralString, isValidPluralString } from './ILibPluralString.js';

/**
 * @classdesc Class representing a check for ilib-style plural syntax.
 * @class
 */
class ILibPluralSyntaxChecker extends Rule {
    constructor(options) {
        super(options);
        this.name = "resource-ilib-plural-syntax-checker";
        this.description = "Test that the ilib-style plural syntax of the target plural is correct.";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
        this.link = "https://github.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint-javascript/docs/resource-ilib-plural-syntax-checker.md";
    }
    
    getRuleType() {
        return "resource";
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
                    if (isPluralString(source) && !isValidPluralString(target)) {
                        return [new Result({
                            severity: "error",
                            id: resource.getKey(),
                            source,
                            description: "The plural syntax of the target string is incorrect.",
                            rule: this,
                            locale: resource.sourceLocale,
                            pathName: ir.sourceFile.getPath(),
                            highlight: `<e0>${target}</e0>`,
                            lineNumber: options.lineNumber
                        })];
                    }
                    break;
    
                case 'array':
                    const srcArray = resource.getSource();
                    const tarArray = resource.getTarget();
                    if (tarArray) {
                        return srcArray.flatMap((item, i) => {
                            if (i < tarArray.length && tarArray[i]) {
                                if (isPluralString(item) && !isValidPluralString(tarArray[i])) {
                                    return new Result({
                                        severity: "error",
                                        id: resource.getKey(),
                                        source: item,
                                        description: "The plural syntax of a string in the target array is incorrect.",
                                        rule: this,
                                        locale: resource.sourceLocale,
                                        pathName: ir.sourceFile.getPath(),
                                        highlight: `[${i}] <e0>${tarArray[i]}</e0>`,
                                        lineNumber: options.lineNumber
                                    });
                                }
                            }
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
                                return new Result({
                                    severity: "error",
                                    id: resource.getKey(),
                                    source: item,
                                    description: "The plural syntax of a string in the target plural is incorrect.",
                                    rule: this,
                                    locale: resource.sourceLocale,
                                    pathName: ir.sourceFile.getPath(),
                                    highlight: `(${category}) <e0>${tarPlural[category]}</e0>`,
                                    lineNumber: options.lineNumber
                                });
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

export default ILibPluralSyntaxChecker;
