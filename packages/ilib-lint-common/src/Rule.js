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

import IntermediateRepresentation from "./IntermediateRepresentation.js";
import NotImplementedError from "./NotImplementedError.js";
import Result from "./Result.js";

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
     * @param {String} [options.sourceLocale] the source locale of the files
     * being linted
     * @param {Function} [options.getLogger] a callback function provided by
     * the linter to retrieve the log4js logger
     * @constructor
     */
    constructor(options) {
        if (this.constructor === Rule) {
            throw new Error("Cannot instantiate abstract class Rule directly!");
        }
        this.getLogger = options?.getLogger;
        this.sourceLocale = options?.sourceLocale || "en-US";
    }

    /** a callback function provided by
     * the linter to retrieve the log4js logger
     * @type {Function | undefined}
     * @private
     */
    getLogger;

    /** name of the rule. This should be a string with a dash-separated
     * set of words (kebab or dash case). Example: "resource-match-whitespace"
     *
     * Subclass must define this property.
     * @readonly
     * @abstract
     * @type {string}
     */
    // @ts-expect-error: subclass must define this property
    name;

    /**
     * Get the name of the rule. This should be a string with a dash-separated
     * set of words (kebab or dash case). Example: "resource-match-whitespace"
     *
     * Subclass must define {@link Rule.name}.
     *
     * @returns {String} the name of this rule
     */
    getName() {
        // make sure to define this.name in your implementation
        return this.name;
    }

    /** General description of the type of problems that this rule is
     * testing for. This description is not related to particular matches, so
     * it cannot be more specific. Examples:
     *
     * - "translation should use the appropriate quote style"
     * - "parameters to the translation wrapper function must not be concatenated"
     * - "translation should match the whitespace of the source string"
     *
     * Subclass must define this property.
     * @readonly
     * @type {string}
     * @abstract
     */
    // @ts-expect-error: subclass must define this property
    description;

    /**
     * Return a general description of the type of problems that this rule is
     * testing for. This description is not related to particular matches, so
     * it cannot be more specific. Examples:
     *
     * - "translation should use the appropriate quote style"
     * - "parameters to the translation wrapper function must not be concatenated"
     * - "translation should match the whitespace of the source string"
     *
     * Subclass must define {@link Rule.description}.
     *
     * @returns {String} a general description of the type of problems that this rule is
     * testing for
     */
    getDescription() {
        return this.description;
    }

    /** Optional web link that gives more complete explanation about the Rule
     * and how to resolve the problem.
     *
     * Subclass should define this property.
     * @readonly
     * @type {string | undefined}
     */
    link = undefined;

    /**
     * Return the optional web link that gives more complete explanation about the Rule
     * and how to resolve the problem.
     *
     * Subclass should define {@link Rule.link}.
     *
     * @returns {String | undefined} an URL to a web page that explains the problem this rule checks for
     */
    getLink() {
        return this.link;
    }

    /**
     * Type of intermediate representation that this rule can process. Rules can
     * be any type as long as there is a parser that produces that type. By convention,
     * there are a few types that are already defined:
     *
     * - resource - This checks a translated Resource instance with a source string
     *   and a translation string for a given locale. For example, a rule that checks that
     *   substitution parameters that exist in the source string also are
     *   given in the target string. Typically, resource files like po, properties, or xliff
     *   are parsed into an array of Resource instances as its intermediate representations.
     * - line - This rule checks single lines of a file. eg. a rule to
     *   check the parameters to a function call.
     * - string - This rule checks the entire file as a single string. Often, this type
     *   of representation is used with source code files that are checked with regular
     *   expressions, which often mean declarative rules.
     * - {other} - You can choose to return any other string here that uniquely identifies the
     *   representation that a parser produces.
     *
     * Typically, a full parser for a programming language will return something like
     * an abstract syntax tree as an intermediate format. For example, the acorn parser
     * for javascript returns an abstract syntax tree in JSTree format. The parser may
     * choose to return the string "ast-jstree" as its identifier, as long as there are
     * rules that are looking for that same string. The parser can return any string it
     * likes just as long as there are rules that know how to check it.
     *
     * Subclass should define this property to indicate that
     * it's meant for a specific type of representation (unless it's meant for the default "string").
     * @readonly
     * @type {string}
     */
    // default representation type. If your rule is different, override this method
    type = "string";

    /**
     * Type of intermediate representation that this rule can process. Rules can
     * be any type as long as there is a parser that produces that type.
     *
     * @see {@link Rule.type}
     *
     * Subclass should define {@link Rule.type}.
     *
     * @returns {String} a string that names the type of intermediate representation
     * that this rule knows how to check
     */
    getRuleType() {
        return this.type;
    }

    /** Source locale for this rule.
     * @readonly
     * @type {string}
     */
    sourceLocale;

    /**
     * Get the source locale for this rule.
     *
     * @returns {String} the source locale for this rule
     */
    getSourceLocale() {
        return this.sourceLocale;
    }

    /**
     * Test whether or not this rule matches the input. If so, produce {@link Result} instances
     * that document what the problems are.
     *
     * @abstract
     * @param {Object} options The options object as per the description
     * @param {IntermediateRepresentation} options.ir The intermediate representation of the file to check
     * @param {string} options.file the file where the resource came from
     * @param {String} [options.locale] the locale against which this rule should be checked. Some rules
     * are locale-sensitive, others not.
     * @param {object} [options.parameters] optional additional parameters for this rule from the configuration file
     * @returns {Result|Array.<Result>|undefined} a Result instance describing the problem if
     * the rule check fails for this locale, or an array of such Result instances if
     * there are multiple problems with the same input, or `undefined` if there is no
     * problem found (ie. the rule does not match).
     */
    match(options) {
        throw new NotImplementedError();
    }
}

export default Rule;
