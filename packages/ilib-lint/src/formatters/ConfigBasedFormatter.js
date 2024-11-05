/*
 * ConfigBasedFormatter.js - Formats result output
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
import log4js from 'log4js';

import { Formatter, Result } from 'ilib-lint-common';

var logger = log4js.getLogger("ilib-lint.formatters.ConfigBasedFormatter");

export const requiredFields = [
    "name",
    "description",
    "template",
    "highlightStart",
    "highlightEnd"
];

const resultFields = [
    "severity",
    "pathName",
    "lineNumber",
    "description",
    "source",
    "highlight",
    "id"
];

/**
 * @class Represent an output formatter for an ANSI console/terminal
 */
export class ConfigBasedFormatter extends Formatter {
    /**
     * Construct an formatter instance.
     * @constructor
     */
    constructor(options) {
        super(options);
        
        if (!options) {
            throw "Attempt to create a ConfigBasedFormatter without options";
        }

        for (let prop of requiredFields) {
            if (typeof(options[prop]) === 'undefined') {
                throw `Missing ${prop} field for a ConfigBasedFormatter`;
            }
            this[prop] = options[prop];
        }
    }

    /**
     * Format the given result with the current formatter and return the
     * formatted string.
     *
     * @param {Result} result the result to format
     * @returns {String} the formatted result
     */
    format(result) {
        if (!result) return "";
        let output = this.template;
        
        for (let prop of resultFields) {
            output = output.replace(new RegExp(`{${prop}}`, "g"), result[prop] || "");
        }
        output = output.replace(new RegExp("{fixStatus}", "g"), result.fix === undefined ? "unavailable" : result.fix.applied ? "applied" : "not applied");
        output = output.replace(new RegExp("{ruleName}", "g"), result.rule.getName());
        output = output.replace(new RegExp("{ruleDescription}", "g"), result.rule.getDescription());

        output = output.replace(/<e\d><\/e\d>/g, `${this.highlightStart}${this.highlightEnd}`);
        output = output.replace(/<e\d>/g, this.highlightStart);
        output = output.replace(/<\/e\d>/g, this.highlightEnd);

        let link = "";
        if (typeof(result.rule.getLink) === 'function') {
            link = result.rule.getLink() || "";
        }
        output = output.replace(new RegExp("{ruleLink}", "g"), link);

        output = output
        return output;
    }
}
