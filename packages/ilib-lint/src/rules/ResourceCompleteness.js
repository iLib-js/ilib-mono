/*
 * ResourceCompleteness.js - rule to check that a resource has both source and target elements
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

import { Result } from "ilib-lint-common";
import Locale from "ilib-locale";

import ResourceRule from './ResourceRule.js';

/** Rule to check that a resource has both source and target elements */
class ResourceCompleteness extends ResourceRule {
    /** @readonly */ name = "resource-completeness";
    /** @readonly */ description = "Ensure that resources are complete, i.e. have both source and target elements.";
    /** @readonly */ link = "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-completeness.md";

    constructor(options) {
        super(options);
    }

    /**
     * Check that a given resource has both source and target tags set
     * @override
     * @param {Object} params a parameters object
     * @param {string} params.source the source string
     * @param {string} params.target the target string
     * @param {import("ilib-tools-common").Resource} params.resource the resource being checked
     * @param {string} params.file the file where the resource came from
     * @returns {Array.<Result>|undefined} the results
     */
    matchString({ source, target, resource, file }) {
        // note: language specifiers for comparison - "en-US" should match "en-GB" (same language, only different region)
        const sourceLangSpec = new Locale(resource.sourceLocale).getLangSpec();
        const targetLangSpec = new Locale(resource.targetLocale).getLangSpec();

        const resultMetaProps = {
            id: resource.getKey(),
            rule: this,
            pathName: file,
            source,
            locale: resource.getTargetLocale()
        };

        // for each source string, a translation must be provided
        if (undefined === target && undefined !== source
            // unless the target language is the same as source language
            && (sourceLangSpec !== targetLangSpec)
            ) {
            return new Result({
                ...resultMetaProps,
                severity: "error",
                description: "Missing target string in resource"
            });
        }
        // if there's an extra translation string for which there is no source, just warn
        else if (undefined !== target && undefined === source) {
            return new Result({
                ...resultMetaProps,
                severity: "warning",
                description: "Extra target string in resource",
                highlight: `<e0>${target}</e0>`
            });
        }
        else return /* no error */;
    }
}

export default ResourceCompleteness;
