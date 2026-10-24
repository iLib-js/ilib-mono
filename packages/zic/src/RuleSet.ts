/*
 * RuleSet.ts - named collection of DST start/end rules
 *
 * Copyright © 2014, 2026 JEDLSoft
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

import { Rule } from "./Rule";

/**
 * A named set of rules documenting when to observe daylight savings time.
 */
export class RuleSet {
    /**
     * Name of this rule set as referenced from Zone/Offset lines
     * (for example `"US"` or `"EU"`).
     */
    name: string | null = null;

    /**
     * Rules belonging to this set, in insertion order.
     */
    private rules: Rule[] = [];

    /**
     * @returns The rule-set name, or `null` if unset
     */
    getName(): string | null {
        return this.name;
    }

    /**
     * @param name Name used by Zone lines to reference this rule set
     */
    setName(name: string): void {
        this.name = name;
    }

    /**
     * Append a rule to this set.
     *
     * @param rule Rule to add
     */
    add(rule: Rule): void {
        this.rules.push(rule);
    }

    /**
     * @returns The live internal list of rules (not a copy)
     */
    getRules(): Rule[] {
        return this.rules;
    }
}
