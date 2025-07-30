/*
 * ResourceCamelCase.js - Check that camel cased strings in the source
 * are not translated in the target.
 *
 * Copyright © 2024-2025 JEDLSoft
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

import ResourceRule from './ResourceRule.js';
import {Result} from 'ilib-lint-common';
import ResourceFixer from '../plugins/resource/ResourceFixer.js';

/** @ignore @typedef {import('ilib-tools-common').Resource} Resource */

/**
 * @classdesc Class representing an ilib-lint programmatic rule for linting camel cased strings.
 * @class
 */
class ResourceCamelCase extends ResourceRule {
    /**
     * Create a ResourceCamelCase rule instance.
     * @param {object} options
     * @param {string[]} [options.except] An array of strings to exclude from the rule.
     */
    constructor(options) {
        super(options);

        this.name = "resource-camel-case";
        this.description = "Ensure that when source strings contain only camel case and no whitespace, then the targets are the same";
        this.link = "https://gihub.com/iLib-js/ilib-mono/blob/main/packages/ilib-lint/docs/resource-camel-case.md";
        this.regexps = [
            "^\\s*[a-z\\d]+([A-Z][a-z\\d]+)+\\s*$",
            "^\\s*[A-Z][a-z\\d]+([A-Z][a-z\\d]+)+\\s*$",
        ];
        this.exceptions = Array.isArray(options?.except) ? options.except : [];
    }

    /**
     * Check if a source string is in camel case and if the target string is the same as the source.
     * @override
     * @param {{source: (String|undefined), target: (String|undefined), file: String, resource: Resource}} params
     * @returns {Result|undefined} A Result with severity 'error' if the source string is in camel case and target string is not the same as the source string, otherwise undefined.
     */
    matchString({source, target, file, resource, index, category}) {
        if (!source || !target) {
            return;
        }

        const isException = this.exceptions.includes(source);
        if (isException) {
            return;
        }

        const isCamelCase = this.isCamelCase(source);
        if (!isCamelCase) {
            return;
        }

        if (source !== target) {
            const result = new Result({
                severity: "error",
                id: resource.getKey(),
                source,
                description: "Do not translate the source string if it consists solely of camel cased strings and/or digits. Please update the target string so it matches the source string.",
                rule: this,
                locale: resource.sourceLocale,
                pathName: file,
                highlight: `<e0>${target}</e0>`
            });
            result.fix = this.getFix(resource, source, index, category);

            return result;
        }
    }

    /**
     * Get the fix for ResourceCamelCase rule
     * @param {Resource} resource The resource to fix
     * @param {string} source The source string that should be used in the target
     * @returns {import('../plugins/resource/ResourceFix.js').default} The fix for ResourceCamelCase rule
     */
    getFix(resource, source, index, category) {
        const command = ResourceFixer.createStringCommand(0, resource.getTarget().length, source);

        return ResourceFixer.createFix({
            resource,
            target: true,
            commands: [command],
            category,
            index
        });
    }

    /**
     * @public
     * @param {string} string A non-empty string to check.
     * @returns {boolean} Returns true for a string that is in camel case (matches one of the regular expressions declared in the constructor).
     * Otherwise, returns false.
     */
    isCamelCase(string) {
        const trimmed = string.trim();
        for (const regexp of this.regexps) {
            const match = RegExp(regexp).test(trimmed);

            if (match) {
                return true;
            }
        }
        return false;
    }
}

export default ResourceCamelCase;
