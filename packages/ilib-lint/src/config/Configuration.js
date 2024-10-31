/*
 * Configuration.js - Configuration of the linter
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
/**
 * Configuration for a project
 *
 * @typedef Configuration
 * @property {string} name Name of this project
 * @property {string[]} locales That name the default set of locales for the
 *   whole project if they are not configured by each path
 * @property {string} [sourceLocale="en-US"] Name the locale for source strings
 *   in this app. Default if not specified is "en-US". Default is `"en-US"`
 * @property {string[]} [excludes] An array of micromatch expressions for files
 *   or folders in the project to exclude from the recursive search.
 * @property {DeclarativeRuleDefinition[]} [rules] An array of declarative
 *   regular-expression-based rules to use with this project
 * @property {DeclarativeFormatterDefinition[]} [formatters] An array of
 *   declarative output formatters
 * @property {Record<string, Ruleset>} [rulesets] Named sets of rules. Some
 *   rules can be shared between file types and others are more specific to the
 *   file type. As such, it is sometimes convenient to to name a set of rules
 *   and refer to the whole set by its name instead of listing them all out.
 * @property {Record<string, Filetype>} filetypes A set of configurations for
 *   various file types. The file types are given dash-separated names such as
 *   "python-source-files" so that they can be referred to in the paths object
 *   below. Properties in the filetypes object are the name of the file type,
 *   and the values are an object that gives the settings for that file type
 * @property {Record<string, string | Filetype>} paths This maps sets of files
 *   to file types. The properties in this object are
 *   [micromatch](https://github.com/micromatch/micromatch) glob expressions
 *   that select a subset of files within the current project. The glob
 *   expressions can only be relative to the root of the project. The value of
 *   each glob expression property should be either a string that names a file
 *   type for files that match the glob expression, or an on-the-fly unnamed
 *   definition of the file type. If you specify the file type directly, it
 *   cannot be shared with other mappings, so it is usually a good idea to
 *   define a named file type in the "filetypes" property first.
 * @property {boolean} [autofix]
 */

/**
 * @typedef DeclarativeFormatterDefinition
 * @property {string} name A unique name for this formatter
 * @property {string} description A description of this formatter to show to
 *   users
 * @property {string} template A template string that shows how the various
 *   fields of a Result instance should be formatted, plus two extras that come
 *   from the rule: ruleName and ruleDescription
 * @property {string} highlightStart String to use as the highlight starting
 *   marker in the highlight string
 * @property {string} highlightEnd String to use as the highlight ending marker
 *   in the highlight string
 */

/**
 * @typedef {Record<string, any>} Ruleset Some rules can be shared between file
 *   types and others are more specific to the file type. As such, it is
 *   sometimes convenient to to name a set of rules and refer to the whole set
 *   by its name instead of listing them all out. Ruleset is an object that
 *   configures each rule that should be included in that set. The rules are
 *   turned on with a value "true" or with a rule-specific option. They are
 *   turned off with a falsy value.
 */

/**
 * @typedef Filetype
 * @property {string} template A template that can be used to parse the file
 *   name for the locale of that file.
 * @property {string[]} [locales] A set of locales that override the global
 *   locales list. If not specified, the file type uses the global set of
 *   locales.
 * @property {string | string[] | Ruleset} ruleset Name the rule set or list of
 *   rule sets to use with files of this type if the value is a string or an
 *   array of strings. When the value is a list of strings, the rules are a
 *   superset of all of the rules in the named rule sets. If the value is an
 *   object, then it is considered to be an on-the-fly unnamed rule set defined
 *   directly.
 */

/**
 * @typedef DeclarativeRuleDefinition
 * @property {DeclarativeRuleType} type The type of this rule
 * @property {string} name A unique dash-separated name of this rule. eg.
 *   "resource-url-match"
 * @property {string} description A description of what this rule is trying to
 *   do. eg. "Ensure that URLs that appear in the source string are also used in
 *   the translated string"
 * @property {string} note String to use when the regular expression check
 *   fails. eg. "URL '{matchString}' from the source string does not appear in
 *   the target string". Note that you can use `{matchString}` to show the user
 *   the string that the regular expression matched in the source but not in the
 *   target.
 * @property {string[]} regexps An array of regular expressions to match in the
 *   source and target strings. If any one of those expressions matches in the
 *   source, but not the target, the rule will create a Result that will be
 *   formatted for the user.
 * @property {string} [link] The URL to a web page that explains this rule in
 *   more detail
 */

/**
 * @ignore @typedef {typeof DeclarativeRuleTypes[keyof typeof
 *   DeclarativeRuleTypes]} DeclarativeRuleType
 */

/** Allowed types of a declarative rule */
export const DeclarativeRuleTypes = {
    /**
     * Check resources in a resource file. The regular expressions that match in
     * the source strings must also match in the target string
     */
    "resource-matcher": /** @type {const} */ ("resource-matcher"),
    /**
     * Check resources in a resource file. If the regular expressions match in
     * the source string of a resource, a result will be generated
     */
    "resource-source": /** @type {const} */ ("resource-source"),
    /**
     * Check resources in a resource file. If the regular expressions match in
     * the target string of a resource, a result will be generated
     */
    "resource-target": /** @type {const} */ ("resource-target"),
    /**
     * Check the text in a source file, such as a java file or a python file.
     * Regular expressions that match in the source file will generate results
     */
    sourcefile: /** @type {const} */ ("sourcefile")
};

export default {};
