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
     * type when reporting issues in the source files. The fields can
     * contain any of the following properties:
     *
     * - severity {String}: the severity of the problem found (required)
     *     - suggestion - a suggestion of a better way to do things. The current way is
     *       not incorrect, but probably not optimal
     *     - warning - a problem that should be fixed, but which does not prevent
     *       your app from operating internationally. This is more severe than a suggestion.
     *     - error - a problem that must be fixed. This type of problem will prevent
     *       your app from operating properly internationally and could possibly even
     *       crash your app in some cases.
     * - description {String}: description of the problem in the source file
     *   (required). In order to make the ilib-lint output useful, this description should
     *   attempt to make the following things clear:
     *     - What part is wrong
     *     - Why it is wrong
     *     - Suggestions on how to fix it
     * - pathName {String}: name of the file that the issue was found in (required)
     * - rule {Rule}: the rule that generated this issue (required)
     * - id {String}: key of a resource being checked
     * - source {String}: for resource problems, this is the original source string
     * - highlight {String}: highlighted text from the source file indicating
     *   where the issue was. For resources, this is either the source or target
     *   string, where-ever the problem occurred
     * - lineNumber {Number}: line number in the source fie where the issue
     *   was found
     * - locale {String}: locale of associated with this issue
     *
     * For the `highlight` property, a snippet of the input that has a problem is reproduced
     * with XML tags around the problem part, if it is known. The tags are of the form
     * &lt;eX&gt; where X is a digit starting with 0 and progressing to 9 for each
     * subsequent problem. If the file type is XML already, the rest of the line will
     * be XML-escaped first.<p>
     *
     * Example:<p>
     *
     * "const str = rb.getString(<e0>id</e0>);"<p>
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
     * properties are optional.
     *
     * @param {Object} fields result fields
     */
    constructor(fields) {
        if (!fields || !fields.severity || !fields.description || !fields.pathName || !fields.rule) {
            throw "Missing fields in Result constructor";
        }
        this.severity = (fields.severity === "error" || fields.severity === "warning") ?
            fields.severity :
            "warning";
        ["description", "pathName", "rule", "id", "highlight", "lineNumber", "locale", "source"].forEach(property => {
            if (fields[property]) this[property] = fields[property];
        });
    }
}

export default Result;