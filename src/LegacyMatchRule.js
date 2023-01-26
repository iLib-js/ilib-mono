/*
 * TestRule.js - test an i18nlint Rule plugin
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

import Locale from 'ilib-locale';
import { Rule, Result } from 'i18nlint-common';

// from https://pubs.opengroup.org/onlinepubs/007904975/functions/fprintf.html
const printfRegExp = /%\(\w+\)?[\-\+ #0']*[\d\*]?(\.(\d*|\*))?(hh?|ll?|j|z|t|L)?[diouxXfFeEgGaAcCsSpn]/g;

/**
 * @class Represent an i18nlint rule.
 */
class LegacyMatchRule extends Rule {
    constructor(options) {
        super(options);
        this.name = "resource-python-legacy-match";
        this.description = "Test that the legacy substitution parameters match in the source and target strings.";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
    }

    getRuleType() {
        return "resource";
    }

    checkString(src, tar, file, resource, sourceLocale, targetLocale, lineNumber) {
        if (!tar) {
            // no target string means we don't have to do the matching
            return undefined;
        }
        const sLoc = new Locale(sourceLocale);
        const tLoc = new Locale(targetLocale);
        let results, match;
        let problems = [];
        let sourceParams = [];
        let targetParams = [];

        // find the source parameters
        printfRegExp.lastIndex = 0;
        match = printfRegExp.exec(src);
        while (match) {
            sourceParams.push({
                text: match[0],
                number: match[1]
            });
            match = printfRegExp.exec(src);
        }

        // now find the target parameters
        printfRegExp.lastIndex = 0;
        match = printfRegExp.exec(tar);
        while (match) {
            targetParams.push({
                text: match[0],
                number: match[1]
            });
            match = printfRegExp.exec(tar);
        }

        // check the source against the target and then vice versa
        for (let i = 0; i < sourceParams.length; i++) {
            const srcParam = sourceParams[i];
            let found = false;
            for (let j = 0; j < targetParams.length; j++) {
                const tarParam = targetParams[j];
                if (tarParam.text === srcParam.text && tarParam.number === srcParam.number) {
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
                const re = new RegExp(tarParam.text.replace(/\(/g, "\\(").replace(/\)/g, "\\)"), "g");
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
                const tarString = resource.getTarget();
                if (tarString) {
                    return this.checkString(resource.getSource(), tarString, file, resource, sourceLocale, options.locale, options.lineNumber);
                }
                break;

            case 'array':
                const srcArray = resource.getSource();
                const tarArray = resource.getTarget();
                if (tarArray) {
                    return srcArray.map((item, i) => {
                        if (i < tarArray.length && tarArray[i]) {
                            return this.checkString(srcArray[i], tarArray[i], file, resource, sourceLocale, options.locale, options.lineNumber);
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
                    return categories.map(category => {
                        return this.checkString(srcPlural.other, tarPlural[category], file, resource, sourceLocale, options.locale, options.lineNumber);
                    });
                }
                break;
        }
    }

    // no match
    return;
}

export default LegacyMatchRule;