/*
 * SourceRegexpChecker.js - rule to check if regexps match in the source
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

import { Rule, Result } from 'ilib-lint-common';

/**
 * @class Source checker class that checks for regular expressions
 * that match in source code. This rule is a file checker that checks
 * the text of a file without really parsing it.
 */
class SourceRegexpChecker extends Rule {
    /**
     * Construct a new declarative regular expression-based source checker.
     *
     * The options must contain the following required properties:
     *
     * - name - a unique name for this rule
     * - description - a one-line description of what this rule checks for.
     *   Example: "Check that the source does not contain calls to function X"
     * - note - a one-line note that will be printed on screen when the
     *   regexp matches (ie. the check fails). Example: "The file foo.java contained
     *   a call to function X, which is deprecated."
     *   (Currently, 'matchString' is the only replacement
     *   param that is supported.)
     * - sourceLocale - locale (if any) of the source
     * - link - an URL to a document that explains this rule in more detail
     * - severity - severity of the results of this rule. This should be one of
     *   "error", "warning", or "suggestion".
     * - regexps - an array of strings that encode regular expressions to
     *   look for
     * @param {Object} options options as documented above
     * @constructor
     */
    constructor(options) {
        super(options);

        if (!options || !options.name || !options.description || !options.note || !options.regexps) {
            throw "Missing required options for the SourceRegexpChecker constructor";
        }
        ["name", "description", "regexps", "note", "sourceLocale", "link", "severity"].forEach(prop => {
            this[prop] = options[prop];
        });
        this.sourceLocale = this.sourceLocale || "en-US";
        this.severity = this.severity || "error";

        // this may throw if you got to the regexp syntax wrong:
        this.re = this.regexps.map(regexp => new RegExp(regexp, "g"));
    }

    getRuleType() {
        // this rule processes files as whole strings using regular expressions
        return "string";
    }

    /**
     * @private
     */
    checkString(re, src, ir) {
        re.lastIndex = 0;
        let results = [];
        let lineNumber = 1; // line numbers are 1-based, not 0-based
        let lastCharChecked = 0;

        let match = re.exec(src);
        while (match) {
            let snippet = "";
            if (typeof(match.index) !== 'undefined') {
                // find the current line number
                for (let i = lastCharChecked; i < match.index; i++) {
                    if (src[i] === '\n') lineNumber++;
                }
                lastCharChecked = match.index;

                // work backwards and forwards to find the start and end of the line, with reasonable limits
                let start = match.index;
                let count = 0;

                // look back for the beginning of the line with a max of 100 chars
                while (start >= 0 && src[start] !== '\n' && count < 100) {
                    start--;
                    count++;
                }
                if (count >= 100) {
                    snippet += "...";
                }
                snippet += src.substring(start+1, match.index);
                snippet += "<e0>";
                snippet += match[0];
                snippet += "</e0>";

                // look forward for the end of the line with a max of 100 chars
                let end = match.index + match[0].length;
                count = 0;
                while (end < src.length && src[end] !== '\n' && count < 100) {
                    end++;
                    count++;
                }
                snippet += src.substring(match.index + match[0].length, end);

                if (count >= 100) {
                    snippet += "...";
                }
            } else {
                snippet = match[0];
            }

            results.push(new Result({
                severity: this.severity,
                rule: this,
                pathName: ir.getSourceFile().getPath(),
                highlight: snippet,
                description: this.note.replace(/\{matchString\}/g, match[0]),
                lineNumber
            }));
            match = re.exec(src);
        }
        return results;
    }

    /**
     * @override
     */
    match(options = {}) {
        const { ir } = options;

        // different type means no checking and no results
        if (!ir || ir.getType() !== "string") return;

        let results = [];
        this.re.forEach(re => {
            results = results.concat(this.checkString(re, ir.getRepresentation(), ir));
        });
        results = results.filter(result => result);
        return results && results.length ? results : undefined;
    }
}

export default SourceRegexpChecker;
