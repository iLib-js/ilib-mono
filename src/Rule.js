/*
 * Rule.js - Represent an ilib-lint rule
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

/**
 * @class Represent an ilib-lint rule.
 * @abstract
 */
class Rule {
    /**
     * Construct an ilib-lint rule. Rules in plugins should implement this
     * abstract class.
     *
     * @param {Object} [options] options to the constructor
     * @param {String} options.sourceLocale the source locale of the files
     * being linted
     * @param {LintAPI} options.API the callback API provided by the linter
     */
    constructor(options) {
        if (this.constructor === Rule) {
            throw new Error("Cannot instantiate abstract class Rule directly!");
        }
        if (!options) return;
        this.sourceLocale = options.sourceLocale;
        this.API = options.API;
    }

    /**
     * Get the name of the rule. This should be a string with a dash-separated
     * set of words (kebab or dash case). Example: "resource-match-whitespace"
     *
     * @returns {String} the name of this rule
     */
    getName() {
        // make sure to define this.name in your implementation
        return this.name;
    }

    /**
     * Return a general description of the type of problems that this rule is
     * testing for. This description is not related to particular matches, so
     * it cannot be more specific. Examples:
     *
     * <ul>
     * <li>"translation should use the appropriate quote style"
     * <li>"parameters to the translation wrapper function must not be concatenated"
     * <li>"translation should match the whitespace of the source string"
     * </ul>
     *
     * @returns {String} a general description of the type of problems that this rule is
     * testing for
     */
    getDescription() {
        return this.description;
    }

    /**
     * Return the optional web link that gives more complete explanation about the Rule
     * and how to resolve the problem.
     *
     * @returns {String} an URL to a web page that explains the problem this rule checks for
     */
    getLink() {
        return this.link;
    }

    /**
     * Return the type of intermediate representation that this rule can process. Rules can
     * be any type as long as there is a parser that produces that type. By convention,
     * there are a few types that are already defined:<p>
     *
     * <ul>
     * <li>resource - This checks a translated Resource instance with a source string
     *   and a translation string for a given locale. For example, a rule that checks that
     *   substitution parameters that exist in the source string also are
     *   given in the target string. Typically, resource files like po, properties, or xliff
     *   are parsed into an array of Resource instances as its intermediate representations.
     * <li>line - This rule checks single lines of a file. eg. a rule to
     *   check the parameters to a function call.
     * <li>string - This rule checks the entire file as a single string. Often, this type
     *   of representation is used with source code files that are checked with regular
     *   expressions, which often mean declarative rules.
     * <li>{other} - You can choose to return any other string here that uniquely identifies the
     *   representation that a parser produces.
     * </ul>
     *
     * Typically, a full parser for a programming language will return something like
     * an abstract syntax tree as an intermediate format. For example, the acorn parser
     * for javascript returns an abstract syntax tree in JSTree format. The parser may
     * choose to return the string "ast-jstree" as its identifier, as long as there are
     * rules that are looking for that same string. The parser can return any string it
     * likes just as long as there are rules that know how to check it.
     *
     * @returns {String} a string that names the type of intermediate representation
     * that this rule knows how to check
     */
    getRuleType() {
        // default representation type. If your rule is different, override this method.
        return "string";
    }

    /**
     * Get the source locale for this rule.
     *
     * @returns {String} the source locale for this rule
     */
    getSourceLocale() {
        return this.sourceLocale || "en-US";
    }

    /**
     * Test whether or not this rule matches the input. If so, produce {@see Result} instances
     * that document what the problems are.<p>
     *
     * @abstract
     * @param {Object} options The options object as per the description above
     * @param {*} options.ir The intermediate representation of the file to check
     * @param {String} options.locale the locale against which this rule should be checked. Some rules
     * are locale-sensitive, others not.
     * @param {*} [options.parameters] parameters for this rule from the configuration file
     * @returns {Result|Array.<Result>|undefined} a Result instance describing the problem if
     * the rule check fails for this locale, or an array of such Result instances if
     * there are multiple problems with the same input, or `undefined` if there is no
     * problem found (ie. the rule does not match).
     */
    match(options) {
        throw new Error("Cannot call Rule.match() directly.");
    }
}

export default Rule;