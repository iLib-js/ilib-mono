/*
 * Result.js - Represent an ilib-lint rule check result
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

import Rule from "./Rule.js";
import Fixer from "./Fixer.js";
import Fix from "./Fix.js";

/**
 * @class Represent an ilib-lint rule check result
 */
class Result {
    /**
     * Construct an ilib-lint rule check result. Rules should return this
     * type when reporting issues in the source files.
     *
     * Some extra notes about the properties in the fields parameter:
     *
     * - severity: Should have one of the following values:
     *     - suggestion - a suggestion of a better way to do things. The current way is
     *       not incorrect, but probably not optimal
     *     - warning - a problem that should be fixed, but which does not prevent
     *       your app from operating internationally. This is more severe than a suggestion.
     *     - error - a problem that must be fixed. This type of problem will prevent
     *       your app from operating properly internationally and could possibly even
     *       crash your app in some cases.
     * - description: In order to make the ilib-lint output useful, this description should
     *   attempt to make the following things clear:
     *     - What part is wrong
     *     - Why it is wrong
     *     - Suggestions on how to fix it
     *
     * For the `highlight` property, a snippet of the input that has a problem is reproduced
     * with XML tags around the problem part, if it is known. The tags are of the form
     * &lt;eX&gt; where X is a digit starting with 0 and progressing to 9 for each
     * subsequent problem. If the file type is XML already, the rest of the line will
     * be XML-escaped first.
     *
     * Example:
     *
     * "const str = rb.getString(&lt;e0>id&lt;/e0>);"
     *
     * In this example rule, `getString()` must be called with a static string in order for
     * the loctool to be able to extract that string. The line above calls `getString()`
     * with a variable named "id" as a parameter instead of a static string, so it fails this
     * check. The variable is then highlighted with the e0 tag and put into the `highlight`
     * field of the Result instance. Callers can then translate the open and close tags
     * appropriately for the output device, such as ASCII escapes for a regular terminal, or
     * HTML tags for a web-based device.
     *
     * Only the severity, description, pathName, and rule are required. All other
     * properties are optional. All fields are stored in this result and are public.
     *
     * @param {Object} fields result fields
     * @param {("error"|"warning"|"suggestion")} fields.severity one of "error", "warning", or "suggestion"
     * @param {String} fields.description description of the problem in the source file
     * @param {String} fields.pathName name of the file that the issue was found in
     * @param {Rule} fields.rule the rule that generated this result
     * @param {String} [fields.highlight] highlighted text from the source file indicating
     * where the issue was optionally including some context. For resources, this is
     * either the source or target string, where-ever the problem occurred.
     * @param {String} [fields.id] for rule that check resources, this is the id of
     * of the resource that generated this result
     * @param {String} [fields.source] for rule that check resources, this is the source
     * string of the resource that generated this result
     * @param {Number} [fields.lineNumber] if the parser included location information
     * in the intermediate representation, this gives the line number in the source file
     * where the problem occurred
     * @param {Number} [fields.charNumber] if the parser included location information
     * in the intermediate representation, this gives the character number within the line
     * in the source file where the problem occurred
     * @param {Number} [fields.endLineNumber] if the parser included location information
     * in the intermediate representation, this gives the last line number in the source file
     * where the problem occurred
     * @param {Number} [fields.endCharNumber] if the parser included location information
     * in the intermediate representation, this gives the last character number within the line
     * in the source file where the problem occurred
     * @param {String} [fields.locale] for locale-sensitive rules, this gives an indication
     * of which locale generated this result
     * @param {Fix} [fields.fix] object which contains info needed by the {@link Fixer} to perform the fix for this result
     * @constructor
     */
    constructor(fields) {
        if (!fields || !fields.severity || !fields.description || !fields.pathName || !fields.rule) {
            throw "Missing fields in Result constructor";
        }
        this.severity = (fields.severity === "error" || fields.severity === "warning" || fields.severity === "suggestion") ?
            fields.severity :
            "warning";
        this.description = fields.description;
        this.pathName = fields.pathName;
        this.rule = fields.rule;
        this.id = fields.id;
        this.highlight = fields.highlight;
        this.lineNumber = fields.lineNumber;
        this.charNumber = fields.charNumber;
        this.endLineNumber = fields.endLineNumber;
        this.endCharNumber = fields.endCharNumber;
        this.locale = fields.locale;
        this.source = fields.source;
        this.fix = fields.fix;
    }

    /**
     * One of the following:
     * - suggestion - a suggestion of a better way to do things. The current way is
     *   not incorrect, but probably not optimal
     * - warning - a problem that should be fixed, but which does not prevent
     *   your app from operating internationally. This is more severe than a suggestion.
     * - error - a problem that must be fixed. This type of problem will prevent
     *   your app from operating properly internationally and could possibly even
     *   crash your app in some cases.
     *
     * @type {("error"|"warning"|"suggestion")}
     */
    severity;

    /**
     * description of the problem in the source file
     * @type {String}
     */
    description;

    /**
     * name of the file that the issue was found in
     * @type {String}
     */
    pathName;

    /**
     * the rule that generated this result
     * @type {Rule}
     */
    rule;

    /**
     * highlighted text from the source file indicating where the issue was optionally including some context. For resources, this is either the source or target string, where-ever the problem occurred.
     * @type {String | undefined}
     */
    highlight;

    /**
     * for rule that check resources, this is the id of of the resource that generated this result
     * @type {String | undefined}
     */
    id;

    /**
     * for rule that check resources, this is the source string of the resource that generated this result
     * @type {String | undefined}
     */
    source;

    /**
     * if the parser included location information in the intermediate representation, this gives the line number in the source file where the problem occurred
     * @type {Number | undefined}
     */
    lineNumber;

    /**
     * if the parser included location information in the intermediate representation, this gives the character number within the line in the source file where the problem occurred
     * @type {Number | undefined}
     */
    charNumber;

    /**
     * if the parser included location information in the intermediate representation, this gives the last line number in the source file where the problem occurred
     * @type {Number | undefined}
     */
    endLineNumber;

    /**
     * if the parser included location information in the intermediate representation, this gives the last character number within the line in the source file where the problem occurred
     * @type {Number | undefined}
     */
    endCharNumber;

    /**
     * for locale-sensitive rules, this gives an indication of which locale generated this result
     * @type {String | undefined}
     */
    locale;

    /**
     * An object which contains info needed for the {@link Fixer} to perform the fix for this result
     * @type {Fix | undefined}
     */
    fix;
}

export default Result;
