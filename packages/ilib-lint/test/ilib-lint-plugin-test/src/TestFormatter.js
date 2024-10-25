/*
 * TestFormatter.js - test an ilib-lint Formatter plugin
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

import { Formatter } from 'ilib-lint-common';

class TestFormatter extends Formatter {
    constructor(options) {
        super(options);
        this.name = "formatter-test";
        this.description = "A test formatter that formats results with underscores instead of spaces";
    }

    format(result) {
        if (!result) return;
        let output = "";
        output += `${result.pathName}${typeof(result.lineNumber) === "number" ? ('(' + result.lineNumber + ')') : ""}:
  ${result.description}\n`;
        if (result.id) {
            output += `  Key: ${result.id}\n`;
        }
        if (result.source) {
            output += `  Source: ${result.source}\n`;
        }
        output += `  ${result.highlight}
  Rule (${result.rule.getName()}): ${result.rule.getDescription()}
`;
        // output ascii terminal escape sequences
        output = output.replace(/<e\d><\/e\d>/g, ">> <<");
        output = output.replace(/<e\d>/g, ">>");
        output = output.replace(/<\/e\d>/g, "<<");

        return output.replace(/ /g, "_");
    }
}

export default TestFormatter;
