/*
 * ResourceNoTranslation.js - rule to check whether Resources have proper
 * translations
 *
 * Copyright © 2023 JEDLSoft
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

import { Rule, Result, isKababCase, isCamelCase, isSnakeCase } from 'i18nlint-common';

/**
 * @class Represent an ilib-lint rule.
 */
class ResourceNoTranslation extends Rule {
    #name = "resource-no-translation";
    #description = "Ensure that each resource in a resource file has a proper translation";
    #link = "https://github.com/ilib-js/i18nlint/blob/main/docs/resource-no-translation.md";

    /**
     * Make a new rule instance.
     * @param {Object} options options as documented above
     * @constructor
     */
    constructor(options) {
        super(options);
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
    }

    getRuleType() {
        return "resource";
    }

    /**
     * @override
     */
    match({ locale, resource, file, lineNumber }) {
        const source = resource.getSource();
        const target = resource.getTarget();
        const sourceLocale = new Locale(resource.getSourceLocale());
        const targetLocale = new Locale(resource.getTargetLocale());

        if (    !source ||
                isKababCase(source) ||
                isCamelCase(source) ||
                isSnakeCase(source) ||
                resource.dnt ||
                (target && sourceLocale.getLangSpec() === targetLocale.getLangSpec())) {
            // in all these cases the source and target are allowed to be the
            // same or different, so we don't even need to check
            return;
        }

        // if the source & target are the same or they are the same after normalizing the
        // whitespace, then produce a warning
        if (!target || source === target || source.replace(/\s+/g, "") === target.replace(/\s+/g, "")) {
            let value = {
                severity: "warning",
                id: resource.getKey(),
                rule: this,
                pathName: file,
                highlight: `Target: <e0>${target || ""}</e0>`,
                description: `Target string is the same as the source string. This is probably an untranslated resource.`,
                source,
                locale
            };
            if (typeof(lineNumber) !== 'undefined') {
                value.lineNumber = lineNumber;
            }
            return new Result(value);
        }

        // no result, no problem!
        return;
    }
}

export default ResourceNoTranslation;
