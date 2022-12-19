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
     * - severity {String}: "warning" or "error" (required)
     * - description {String}: description of the problem in the source file
     *   (required)
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