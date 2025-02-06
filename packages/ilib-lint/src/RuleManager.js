/*
 * RuleManager.js - Manage a collection of ilib-lint rules
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

import { Rule } from 'ilib-lint-common';
import log4js from 'log4js';

import ResourceMatcher from './rules/ResourceMatcher.js';
import ResourceSourceChecker from './rules/ResourceSourceChecker.js';
import ResourceTargetChecker from './rules/ResourceTargetChecker.js';
import SourceRegexpChecker from './rules/SourceRegexpChecker.js';

import ResourceICUPlurals from './rules/ResourceICUPlurals.js';
import ResourceQuoteStyle from './rules/ResourceQuoteStyle.js';
import ResourceUniqueKeys from './rules/ResourceUniqueKeys.js';

const logger = log4js.getLogger("ilib-lint.RuleManager");

/**
 * Map the types in the declarative rules to a Rule subclass that handles
 * that type.
 */
const typeMap = {
    "resource-matcher": ResourceMatcher,
    "resource-source": ResourceSourceChecker,
    "resource-target": ResourceTargetChecker,
    "source-checker": SourceRegexpChecker
};

/**
 * @class a class to manage all the possible rules
 */
class RuleManager {
    /**
     * Create new Rule manager instance.
     *
     * There are two types of Rules out there: declarative and programmatic.
     * Declarative rules are based on regular expressions and are configured
     * through a simple json file which specifies the regular expressions and
     * some metadata. Programmatic rules are a little more complicated and
     * are declared through plugin code.
     *
     * This factory function can create Rule instances out for any type of
     * rule.
     * @params {Object} options options controlling the construction of this object
     * @constructor
     */
    constructor(options) {
        this.ruleCache = {};
        this.ruleDefs = {};
        this.descriptions = {};
        this.sourceLocale = options && options.sourceLocale;

        // some built-in default rules
        this.addRule(ResourceICUPlurals);
        this.addRule(ResourceQuoteStyle);
        this.addRule(ResourceUniqueKeys);
    }

    /**
     * Return a rule instance for the given name.
     *
     * @param {String} name name of the rule to return
     * @param {Object|undefined} options options for this instance of the
     * rule from the config file, if any
     * @returns {Rule|undefined} an instance of the required rule or undefined if
     * the rule cannot be found
     */
    get(name, options) {
        const ruleConfig = this.ruleCache[name];
        if (!name || !ruleConfig) return;

        if (typeof(ruleConfig) === 'object') {
            const ruleClass = typeMap[ruleConfig.type];
            return new ruleClass({
                ...ruleConfig,
                ...options,
                sourceLocale: this.sourceLocale,
                getLogger: log4js.getLogger.bind(log4js)
            });
        } else {
            return new ruleConfig({
                ...options,
                sourceLocale: this.sourceLocale,
                getLogger: log4js.getLogger.bind(log4js)
            });
        }
    }

    /**
     * Recursively look up the inheritance tree to see if this rule eventually
     * inherited from the Rule class somewhere along the way. We finish looking
     * if we get to the top-level "Object" class and we didn't find any
     * Rule class.
     * @private
     */
    inheritsFromRule(object) {
        const proto = Object.getPrototypeOf(object);
        if (proto.name === "Rule") return true;
        if (proto.name === "Object") return false;
        return this.inheritsFromRule(proto);
    }

    /**
     * @private
     */
    addRule(rule) {
        if (rule) {
            if (typeof(rule) === 'function' && this.inheritsFromRule(rule)) {
                const p = new rule({
                    sourceLocale: this.sourceLocale,
                    getLogger: log4js.getLogger.bind(log4js)
                });
                this.ruleCache[p.getName()] = rule;
                this.descriptions[p.getName()] = p.getDescription();
                logger.trace(`Added rule ${p.getName()} to the rule manager.`);
            } else if (typeof(rule) === 'object') {
                if (typeof(rule.type) !== 'string' || typeof(rule.name) !== 'string' ||
                    typeof(rule.description) !== 'string' || typeof(rule.note) !== 'string' ||
                    !typeMap[rule.type]) {
                    throw "Insufficient or incorrect arguments to register declarative rule";
                }
                this.ruleCache[rule.name] = rule;
                logger.trace(`Added rule ${rule.name} to the rule manager.`);
                this.descriptions[rule.name] = rule.description;
            } else {
                logger.debug("Attempt to add a rule that is not declarative nor a class that inherits from Rule");
                throw "Attempt to add a rule that is not declarative nor a class that inherits from Rule";
            }
        } else {
            throw "Cannot add empty rule";
        }
    }

    /**
     * Register a new rule for the rule factory. The rule can be either declarative
     * or programmatic. If the `ruleConfig` parameter is an object, the rule is
     * considered to be declarative. If it is a function, it is considered to be
     * programmatic.
     *
     * A declarative config for a Rule must contain the following properties:
     *
     * - type - the type of the Rule required. This can be one of the declarative
     *   types. The values for declarative types are limited to the following:
     *     - resource-matcher - Checks resources for matches. Any matches for
     *       the given regular expression the source string must also appear
     *       somewhere in the target string.
     *     - resource-source - Check resources for matches of the regular
     *       expression in the source string. Matches in the source string trigger
     *       issues to be generated.
     *     - resource-target - Check resources for matches of the regular
     *       expression in the target string. Matches in the target string trigger
     *       issues to be generated.
     *     - sourcefile - Check source files for matches of the regular
     *       expression. Matches in the source file trigger issues to be generated.
     * - name - the dash-separated unique name of this Rule, such as
     *   "resource-check-plurals"
     * - description - a general description of what this rule is checking for
     * - note - a one-line note that will be printed on screen when the
     *   check fails. Example: "The URL {matchString} did not appear in the
     *   the target." Currently, {matchString} is the only replacement
     *   param that is supported.
     *
     * An attempt to register a declarative rule that does not have all of the above
     * properties will result in an exception being thrown.
     *
     * A programmatic config must be given as a subclass of the Rule class. The
     * class will be queried for its metadata in order to register it properly.
     *
     * Both the declarative and programmatic rules define a unique name, which is
     * what is used to instantiate the rule using the RuleFactory function.
     *
     * @param {Object|Class|Array.<Object|Class>} ruleConfig the configuration for
     * the new rule or rules to register
     * @throws if the required properties are not given in the declarative config
     * or the Class does not inherit from Rule.
     */
    add(rules) {
        if (!rules || (typeof(rules) !== 'object' && typeof(rules) !== 'function')) {
            logger.debug("Attempt to add a rule to the rule manager a rule that is not declarative or is not a class");
        }

        if (Array.isArray(rules)) {
            rules.forEach(rule => {
                this.addRule(rule);
            });
        } else {
            this.addRule(rules);
        }
    };

    /**
     * Return all the rule classes that this manager knows about.
     *
     * @returns {Array.<Rule>} an array of rule classes that this manager
     * knows about
     */
    getRules() {
        return Object.values(this.ruleCache);
    }

    /**
     * Return an object where the properties are the rule names and the
     * values are the rule descriptions.
     *
     * @returns {Object} the rule names and descriptions
     */
    getDescriptions() {
        return this.descriptions;
    }

    /**
     * Add a ruleset definition to this rule manager.
     *
     * @param {String} name the name of this ruleset definition
     * @param {Object} ruleDefs definitions of rules in this
     * definition and their optional parameters
     */
    addRuleSetDefinition(name, ruleDefs) {
        if (typeof(ruleDefs) !== 'object') return;

        logger.trace(`Added ruleset definition for set ${name}`);
        // this will override any existing one with the same name
        this.ruleDefs[name] = ruleDefs;
    }
    /**
     * Add an object full of ruleset definitions to this rule manager.
     *
     * @param {Object} ruleDefs an object where the properties are
     * the rule name, and the values are the rule definitions.
     */
    addRuleSetDefinitions(ruleDefs) {
        if (typeof(ruleDefs) !== 'object') return;
        for (let name in ruleDefs) {
            this.addRuleSetDefinition(name, ruleDefs[name]);
        }
    }

    /**
     * Return the named ruleset definition.
     *
     * @param {String} name the name of the ruleset definition
     * to return
     * @returns {Object} the ruleset definition
     */
    getRuleSetDefinition(name) {
        return this.ruleDefs[name];
    }

    /**
     * Return all of the ruleset definitions. The definitions are
     * returned as an object where the properties are the name of the
     * ruleset, and the value is an array that names all of the
     * rules in that set.
     *
     * @returns {Object} the ruleset definitions
     */
    getRuleSetDefinitions() {
        const definitions = {};

        for (let name in this.ruleDefs) {
            const definition = this.ruleDefs[name];
            definitions[name] = Object.keys(definition);
        }
        return definitions;
    }

    /**
     * Return the number of named ruleset definitions that are
     * known by this instance of the rule manager.
     *
     * @returns {Number} the number of named ruleset definitions
     */
    sizeRuleSetDefinitions() {
        return Object.keys(this.ruleDefs).length;
    }

    /**
     * Return how many rules this manager knows about.
     * @returns {Number} the number of rules this manager knows about.
     */
    size() {
        return Object.keys(this.ruleCache).length;
    }

    /**
     * for use with the unit tests
     * @private
     */
    clear() {
        this.ruleCache = {};
        this.ruleDefs = {};
    }
}

export default RuleManager;
