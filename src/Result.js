/*
 * Result.js - Represent an ilib-lint rule check result
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
 * @class Represent an ilib-lint rule check result
 * @abstract
 */
class Result {
    /**
     * Construct an ilib-lint rule check result. Rules should return this
     * type when reporting issues in the source files.<p>
     *
     * Some extra notes about the properties in the fields parameter: <p>
     *
     * <ul>
     * <li>severity: Should have one of the following values:
     *     <ul>
     *     <li>suggestion - a suggestion of a better way to do things. The current way is
     *       not incorrect, but probably not optimal
     *     <li>warning - a problem that should be fixed, but which does not prevent
     *       your app from operating internationally. This is more severe than a suggestion.
     *     <li>error - a problem that must be fixed. This type of problem will prevent
     *       your app from operating properly internationally and could possibly even
     *       crash your app in some cases.
     *     </ul>
     * <li>description: In order to make the ilib-lint output useful, this description should
     *   attempt to make the following things clear:
     *     <ul>
     *     <li>What part is wrong
     *     <li>Why it is wrong
     *     <li>Suggestions on how to fix it
     *     </ul>
     * </ul>
     *
     * For the `highlight` property, a snippet of the input that has a problem is reproduced
     * with XML tags around the problem part, if it is known. The tags are of the form
     * &lt;eX&gt; where X is a digit starting with 0 and progressing to 9 for each
     * subsequent problem. If the file type is XML already, the rest of the line will
     * be XML-escaped first.<p>
     *
     * Example:<p>
     *
     * "const str = rb.getString(&lt;e0>id&lt;/e0>);"<p>
     *
     * In this example rule, `getString()` must be called with a static string in order for
     * the loctool to be able to extract that string. The line above calls `getString()`
     * with a variable named "id" as a parameter instead of a static string, so it fails this
     * check. The variable is then highlighted with the e0 tag and put into the `highlight`
     * field of the Result instance. Callers can then translate the open and close tags
     * appropriately for the output device, such as ASCII escapes for a regular terminal, or
     * HTML tags for a web-based device.<p>
     *
     * Only the severity, description, pathName, and rule are required. All other
     * properties are optional. All fields are stored in this result and are public.<p>
     *
     * @param {Object} fields result fields
     * @param {String} fields.severity one of "error", "warning", or "suggestion"
     * @param {String} fields.description description of the problem in the source file
     * @param {String} fields.pathName name of the file that the issue was found in
     * @param {Rule} fields.rule the rule that generated this result
     * @param {String} fields.highlight highlighted text from the source file indicating
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
     */
    constructor(fields) {
        if (!fields || !fields.severity || !fields.description || !fields.pathName || !fields.rule) {
            throw "Missing fields in Result constructor";
        }
        this.severity = (fields.severity === "error" || fields.severity === "warning") ?
            fields.severity :
            "warning";
        ["description", "pathName", "rule", "id", "highlight", "lineNumber", "charNumber",
         "endLineNumber", "endCharNumber", "locale", "source"].forEach(property => {
            if (typeof(fields[property]) !== 'undefined') this[property] = fields[property];
        });
    }
}

export default Result;
