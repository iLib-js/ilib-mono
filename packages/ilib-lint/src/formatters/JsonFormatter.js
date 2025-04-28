/*
 * JsonFormatter.js - Formats result output as a JSON string
 *
 * Copyright © 2025 JEDLSoft
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

var logger = log4js.getLogger("ilib-lint.formatters.JsonFormatter");

/**
 * @class Represent an output formatter for JSON
 */
class JsonFormatter extends Formatter {
    /**
     * Construct an formatter instance.
     * @constructor
     */
    constructor(options) {
        super(options);
        this.name = "json-formatter";
        this.description = "Formats results in json for graphing statistics.";
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
        let obj = {
            pathName: result.pathName,
            rule: result.rule.getName(),
            severity: result.severity
        };

        // write as compressed JSON to save space;
        // the output is intended to be read by a machine, not a human
        return JSON.stringify(obj) + "\n";
    }

    /**
     * Format the whole result set as a JSON string.
     * @override
     */
    formatOutput(options = {}) {
        const { name, fileStats, resultStats, results, score, totalTime, errorOnly } = options;
        const obj = {};
        obj[name] = {
            stats: {
            },
            results: results.map((result) => {
                return {
                    pathName: result.pathName,
                    rule: result.rule.getName(),
                    severity: result.severity,
                    locale: result.locale
                };
            })
        };

        if (resultStats) {
            obj[name].stats.total = resultStats.total;
            obj[name].stats.errors = resultStats.errors;
            obj[name].stats.warnings = resultStats.warnings;
            obj[name].stats.suggestions = resultStats.suggestions;
        }
        if (fileStats) {
            obj[name].stats.files = fileStats.files;
            obj[name].stats.lines = fileStats.lines;
            obj[name].stats.bytes = fileStats.bytes;
            obj[name].stats.modules = fileStats.modules;
            obj[name].stats.words = fileStats.words;
        }

        // write as compressed JSON to save space;
        // the output is intended to be read by a machine, not a human
        return JSON.stringify(obj) + "\n";
    }
}

export default JsonFormatter;
