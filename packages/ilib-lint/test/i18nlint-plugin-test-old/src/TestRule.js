/*
 * TestRule.js - test an ilib-lint Rule plugin
 *
 * Copyright © 2022 JEDLSoft
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

import { Rule, Result } from 'i18nlint-common';

/**
 * @class Represent an ilib-lint rule.
 */
class TestRule extends Rule {
    constructor(options) {
        super(options);
        this.name = "resource-test";
        this.description = "Test for the existence of the word 'test' in the strings.";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
    }

    getRuleType() {
        return "resource";
    }

    checkString(src, tar, file, resource, sourceLocale, targetLocale, lineNumber) {
        // just as a very simplistic test if the source contains the word "test", then give a warning
        // If the target contains the word "test", then give an error
        let problems = [];
        const srcStart = src.indexOf("test");
        const tarStart = tar.indexOf("test");

        if (srcStart > -1) {
            let value = {
                severity: "warning",
                description: `Source string should not contain the word "test"`,
                rule: this,
                id: resource.getKey(),
                highlight: `Source: ${src.substring(0, srcStart)}<e0>${src.substring(srcStart, srcStart+4)}</e0>${src.substring(srcStart+4)}`,
                pathName: file
            };
            if (typeof(lineNumber) !== 'undefined') {
                value.lineNumber = lineNumber + e.location.end.line - 1;
            }
            problems.push(new Result(value));
        }
        if (tarStart > -1) {
            let value = {
                severity: "error",
                description: `Target string should not contain the word "test"`,
                rule: this,
                id: resource.getKey(),
                source: src,
                highlight: `Target: ${tar.substring(0, tarStart)}<e0>${tar.substring(tarStart, tarStart+4)}</e0>${tar.substring(tarStart+4)}`,
                pathName: file
            };
            if (typeof(lineNumber) !== 'undefined') {
                value.lineNumber = lineNumber + e.location.end.line - 1;
            }
            problems.push(new Result(value));
        }
        return problems.length < 2 ? problems[0] : problems;
    }

    /**
     * @override
     */
    match(options) {
        const { resource, file, locale } = options;
        const sourceLocale = this.sourceLocale;
        let problems = [];

        switch (resource.getType()) {
            case 'string':
                const tarString = resource.getTarget() || "";
                return this.checkString(resource.getSource(), tarString, file, resource, sourceLocale, options.locale, options.lineNumber);

            case 'array':
                const srcArray = resource.getSource();
                const tarArray = resource.getTarget() || [];
                return srcArray.map((item, i) => {
                    return this.checkString(srcArray[i], tarArray[i], file, resource, sourceLocale, options.locale, options.lineNumber);
                }).filter(element => element);

            case 'plural':
                const srcPlural = resource.getSource();
                const tarPlural = resource.getTarget() || {};
                return categories.map(category => {
                    return this.checkString(srcPlural.other, tarPlural[category], file, resource, sourceLocale, options.locale, options.lineNumber);
                });
        }
    }

    // no match
    return;
}

export default TestRule;