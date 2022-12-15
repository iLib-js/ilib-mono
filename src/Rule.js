/*
 * Rule.js - Represent an i18nlint rule
 *
 * Copyright © 2022 JEDLSoft
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
 * @class Represent an i18nlint rule.
 * @abstract
 */
class Rule {
    /**
     * Construct an i18nlint rule. Rules in plugins should implement this
     * abstract class.
     */
    constructor() {
        if (this.constructor === Rule) {
            throw new Error("Cannot instantiate abstract class Rule!");
        }
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
     * "translation should use the appropriate quote style"
     * "parameters to the translation wrapper function must not be concatenated"
     * "translation should match the whitespace of the source string"
     *
     * @returns {String} a general description of the type of problems that this rule is
     * testing for
     */
    getDescription() {
        return this.description;
    }

    /**
     * Return the type of this rule. Rules can be organized into the following
     * types:
     *
     * - A resource rule. This checks a translated resource with a source string
     *   and a translation to a given locale. eg. a rule that checks that
     *   substitution parameters that exist in the source string also are
     *   given in the target string.
     * - A line rule. This rule checks single lines of a file. eg. a rule to
     *   check the parameters to a function call.
     * - A multiline rule. This rule checks multiple lines at once to find
     *   problems that may span multiple lines. For example, a rule to enforce
     *   a policy that all translatable strings in a source file have an appropriate
     *   translator's comment on them.
     * - A multifile rule. This rule checks problems across multiple files. eg.
     *   a rule to check that ids for translatable strings are unique across all
     *   files.
     *
     * @returns {String} a string with either "resource", "line", "multiline", or
     * "multifile".
     */
    getRuleType() {
        // default rule type. If your rule is different, override this method.
        return "line";
    }

    getSourceLocale() {
        return this.sourceLocale || "en-US";
    }

    /**
     * Return whether or not this rule matches the input. The options object can
     * contain any of the following properties:
     *
     * <ul>
     * <li>locale - the locale against which this rule should be checked. Some rules
     * are locale-sensitive, others not.
     * <li>resource - the resource to test this rule against. For resource rules, this
     * is a required property.
     * <li>line - a single line of a file to test this rule against (for line rules)
     * <li>lines - all the lines of a file to test this rule against (for multiline rules
     * and multifile rules)
     * <li>pathName - the name of the current file being matched in multifile rules.
     * <li>parameters - (optional) parameters for this rule from the configuration file
     * </ul>
     *
     * The return value from this method when a rule matches is an object with the
     * following properties:
     *
     * <ul>
     * <li>severity - the severity of this match. This can be one of the following:
     *   <ul>
     *   <li>suggestion - a suggestion of a better way to do things. The current way is
     *   not incorrect, but probably not optimal
     *   <li>warning - a problem that should be fixed, but which does not prevent
     *   your app from operating internationally. This is more severe than a suggestion.
     *   <li>error - a problem that must be fixed. This type of problem will prevent
     *   your app from operating properly internationally and could possibly even
     *   crash your app in some cases.
     *   </ul>
     * <li>description - a description of the problem to display to the user. In order
     * to make the i18nlint output useful, this description should attempt to make the
     * following things clear:
     *   <ul>
     *   <li>What part is wrong
     *   <li>Why it is wrong
     *   <li>Suggestions on how to fix it
     *   </ul>
     * <li>lineNumber - the line number where the match occurred in multiline rules
     * <li>highlight - the line where the problem occurred, highlighted with XML syntax
     * (see below)
     * </ul>
     *
     * For the `highlight` property, the line that has a problem is reproduced with
     * XML tags around the problem part, if it is known. The tags are of the form
     * &lt;eX&gt; where X is a digit starting with 0 and progressing to 9 for each
     * subsequent problem. If the file type is XML already, the rest of the line will
     * be XML-escaped first.<p>
     *
     * Example:<p>
     *
     * "const str = rb.getString(<e0>id</e0>);"<p>
     *
     * In this rule, `getString()` must be called with a static string in order for the
     * loctool to be able to extract that string. The line above calls `getString()`
     * with a variable named "id" as a parameter. The variable is highlighted with the
     * e0 tag. Callers can then translate the open and close tags appropriately for
     * the output device, such as ASCII escapes for a regular terminal, or HTML tags
     * for a web-based device.
     *
     * @param {Object} options The options object as per the description above
     * @returns {Result|Array.<Result>|undefined} an object describing the problem if the rule
     * does match for this locale, or an array of such Objects if there are multiple
     * problems with the same input, or undefined if the rule does not match
     */
    match(options) {
        throw new Error("Cannot call Rule.match() directly.");
    }
}

export default Rule;