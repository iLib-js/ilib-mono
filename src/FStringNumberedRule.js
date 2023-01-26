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
const fstringRegExp = /\{(\}\}|[^}])*?\}/g;

/**
 * @class Represent an i18nlint rule.
 */
class FStringNumberedRule extends Rule {
    constructor(options) {
        super(options);
        this.name = "resource-python-fstrings-numbered";
        this.description = "Test that f-string substitution parameters in the source are named or numbered if there are multiple.";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
    }

    getRuleType() {
        return "resource";
    }

    checkString(src, file, resource, lineNumber) {
        let match;
        let problems = [];
        let sourceParams = [];
        let totalParams = 0;

        // find the source parameters
        fstringRegExp.lastIndex = 0;
        match = fstringRegExp.exec(src);
        while (match) {
            totalParams++;
            if (!match[1]) {
                // this one is missing the numbering!
                sourceParams.push(match[0]);
            }
            match = fstringRegExp.exec(src);
        }
        if (totalParams < 2) {
            // only a problem if there are 2 or more params because the
            // translator may have to re-arrange the params and without
            // numbering, they cannot be re-arranged
            return undefined;
        }

        // check for unnumbered params
        for (let i = 0; i < sourceParams.length; i++) {
            const srcParam = sourceParams[i];
            const re = new RegExp(srcParam, "g");
            problems.push(new Result({
                severity: "error",
                rule: this,
                description: `Source string substitution parameter ${srcParam} must be numbered but it is not.`,
                id: resource.getKey(),
                highlight: src.replaceAll(re, `<e0>$&</e0>`),
                pathName: file,
                lineNumber
            }));
        }

        return problems.length < 2 ? problems[0] : problems;
    }

    /**
     * @override
     */
    match(options) {
        const { resource, file } = options;

        switch (resource.getType()) {
            case 'string':
                return this.checkString(resource.getSource(), file, resource, options.lineNumber);
                break;

            case 'array':
                const srcArray = resource.getSource();
                return srcArray.map(item => {
                    return this.checkString(item, file, resource, options.lineNumber);
                }).flat().filter(element => {
                    return element;
                });
                break;

            case 'plural':
                const srcPlural = resource.getSource();
                const categories = Object.keys(srcPlural);
                return categories.map(category => {
                    return this.checkString(srcPlural[category], file, resource, options.lineNumber);
                });
                break;
        }
    }

    // no match
    return;
}

export default FStringNumberedRule;