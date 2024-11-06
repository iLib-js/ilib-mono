/*
 * ResourceStateChecker.js - rule to check that state field of a
 *   resource has a particular value
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

import { Rule, Result } from 'ilib-lint-common';

/**
 * @class Represent an ilib-lint rule.
 */
class ResourceStateChecker extends Rule {
    /**
     * Make a new rule instance. The options parameter can have
     * a "param" property in it that will contain one of the
     * following types of values:
     *
     * - string - all Resource instances should have a state value
     *   equal to this value
     * - array of string - all Resource instances should have
     *   a state value that is one of the values contained in
     *   this array
     *
     * If there is no "param" property (ie. the user just put
     * `"resource-state-checker": true,` into their ruleset
     * configuration), then this checker will check that all
     * Resource instances have the state field value of
     * "translated".
     *
     * @param {Object} options options as documented above
     * @constructor
     */
    constructor(options) {
        super(options);
        this.name = "resource-state-checker";
        this.description = "Ensure that resources have a particular state.";
        this.sourceLocale = (options && options.sourceLocale) || "en-US";
        this.link = "https://github.com/ilib-js/ilib-lint/blob/main/docs/resource-state-checker.md";

        if (options) {
            if (typeof(options.param) === "string") {
                // enforce the given string as the only state allowed
                this.states = [ options.param ];
            } else if (Array.isArray(options.param)) {
                this.states = options.param;
            }
        }
        if (!this.states) {
            this.states = [ "translated" ];
        }
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
            if (!resource.getTarget()) return; // no target? no check!
            const state = resource.getState()?.toLowerCase();
            const locale = resource.getTargetLocale();

            if (state && this.states.indexOf(state) > -1) {
                // recognized state, so return no results
                return;
            }

            // oh oh, bad state!
            let value = {
                severity: "error",
                id: resource.getKey(),
                rule: this,
                pathName: file,
                highlight: state ? `Resource found with disallowed state: <e0>${state}</e0>` : "Resource found with no state.",
                description: (this.states.length > 1) ?
                    `Resources must have one of the following states: ${this.states.join(", ")}` :
                    `Resources must have the following state: ${this.states[0]}`,
                locale,
                source: resource.getSource()
            };
            if (typeof(resource.lineNumber) !== 'undefined') {
                value.lineNumber = resource.lineNumber;
                value.charNumber = resource.charNumber;
            }
            return new Result(value);
        }).filter(result => result);
        return results?.length > 1 ? results : (results?.length === 1 ? results[0] : undefined);
    }
}

export default ResourceStateChecker;
