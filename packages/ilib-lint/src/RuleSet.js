/*
 * RuleSet.js - Represent a set of ilib-lint rule instances
 *
 * Copyright © 2022-2023 JEDLSoft
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

const logger = log4js.getLogger("ilib-lint.RuleSet");

/**
 * @class Represent a set of ilib-lint rules. The rule manager keeps
 * track of all the rules that are known to this run of the linter,
 * and a RuleSet is a named set of rule instances that have been
 * initialized with certain options for some or all of those rules.
 */
class RuleSet {
    /**
     * Construct an ilib-lint rule set.
     *
     * @constructor
     * @param {Array.<Rule>} rules a list of rules to initialize
     * this set
     */
    constructor(rules) {
        this.rules = {};
        if (rules) {
            this.add(rules);
        }
    }

    /**
     * Add a rule instnace to this rule set.
     * @param {Rule} rule the instance to add
     */
    addRule(rule) {
        if (!rule || typeof(rule) !== 'object' || !rule.getName()) return;
        logger.trace(`Adding rule ${rule.getName()} to the set`);
        this.rules[rule.getName()] = rule;
    }

    /**
     * Add rule instances to this rule set.
     * If a rule is added that already exists in the set, it will
     * override the previous definition. This way, the rule is
     * only ever added once.
     *
     * @param {Array.<Rule>} rules a list of rule instances to add
     */
    add(rules) {
        if (!rules || typeof(rules) !== 'object' || !Array.isArray(rules)) return;
        rules.forEach(this.addRule.bind(this));
    }

    /**
     * Remove a rule from the set. This might happen if a user explicitly sets
     * a rule to "false" in the set in order to turn off a rule that was turned
     * on by a different set.
     * @param {String} name unique name of the rule to remove
     */
    removeRule(name) {
        if (typeof(name) !== 'string' || !this.rules[name]) return;
        this.rules[name] = undefined;
    }

    /**
     * Return the rule instance with the given name.
     *
     * @param {String} name unique name of the rule
     * @returns {Rule} a rule instance with the given name, or undefined
     * if the rule is not part of this set
     */
    getRule(name) {
        return this.rules[name];
    }

    /**
     * Return a list of rule instances in this set.
     *
     * @param {String} type optional parameter that restricts
     * the type of rules returned. If no type is specified,
     * all rules are returned.
     *
     * @returns {Array.<Rule>} a list of rule instances
     */
    getRules(type) {
        return Object.values(this.rules).filter(rule => {
            return (!type || rule.getRuleType() === type) ? rule : undefined;
        });
    }

    /**
     * Return the number of rules in this set.
     * @returns {Number} the number of rules in this set
     */
    getSize() {
        return Object.keys(this.rules).length;
    }
};

export default RuleSet;
