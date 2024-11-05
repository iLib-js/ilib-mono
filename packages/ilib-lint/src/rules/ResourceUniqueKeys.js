/*
 * ResourceUniqueKeys.js - rule to check quotes in the target string
 *
 * Copyright © 2022-2024 JEDLSoft
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
import { TranslationSet } from 'ilib-tools-common';

import { Rule, Result } from 'ilib-lint-common';

const logger = log4js.getLogger("ilib-lint.Rule.ResourceUniqueKeys");

/**
 * @class Represent an ilib-lint rule.
 */
class ResourceUniqueKeys extends Rule {
    /**
     * Make a new rule instance.
     * @param {Object} options options as documented above
     * @constructor
     */
    constructor(options) {
        super(options);
        this.name = "resource-unique-keys";
        this.description = "Ensure that the keys are unique within a locale across all resource files";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
        this.link = "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-unique-keys.md";
        this.ts = new TranslationSet();
    }

    getRuleType() {
        return "resource";
    }

    /**
     * @override
     */
    match(options = {}) {
        const { ir, file } = options;

        // we can only process resource representations
        if (!ir || ir.getType() !== "resource") return;

        const resources = ir.getRepresentation();

        const results = resources.flatMap(resource => {
            const hash = resource.hashKey();
            const locale = resource.getTargetLocale();
            const other = this.ts.get(hash);

            if (other) {
                logger.trace(`hash '${hash}' already found in the translation set!`);
                let value = {
                    severity: "error",
                    id: resource.getKey(),
                    rule: this,
                    pathName: file,
                    highlight: `Key is also defined in this file: ${other.resfile}`,
                    description: `Key is not unique within locale ${locale}.`,
                    locale
                };
                if (typeof(resource.lineNumber) !== 'undefined') {
                    resource.lineNumber = resource.lineNumber;
                }
                return new Result(value);
            }

            resource.resfile = file;
            this.ts.add(resource);

            // no result
            return;
        }).filter(result => result);
        return results?.length ? results : undefined;
    }
}

export default ResourceUniqueKeys;