/*
 * ResourceSourceChecker.js - implement a declarative rule to check
 * source strings for problems
 *
 * Copyright © 2022-2025 JEDLSoft
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

import { Result } from 'ilib-lint-common';
import DeclarativeResourceRule from './DeclarativeResourceRule.js';
import { stripPlurals } from './utils.js';

/**
 * @class Resource checker class that checks that any regular expressions
 * that matches in the source causes a result to be returned.
 */
class ResourceSourceChecker extends DeclarativeResourceRule {
    /**
     * Construct a new regular expression-based resource checker.
     *
     * @param {Object} options options as documented above
     * @param {string} options.name a unique name for this rule
     * @param {string} options.description a one-line description of what this rule checks for.
     *   Example: "Check that URLs in the source conform to proper URL syntax"
     * @param {string} options.note a one-line note that will be printed on screen when the
     *   check fails. Example: "The URL {matchString} is not well-formed."
     *   (Currently, matchString is the only replacement
     *   param that is supported.)
     * @param {string[]} options.regexps an array of strings that encode regular expressions to
     *   look for
     * @constructor
     */
    constructor(options) {
        super(options);
    }

    /**
     * @override
     */
    checkString({re, source, file, resource}) {
        re.lastIndex = 0;
        let matches = [];
        const strippedSrc = this.useStripped ? stripPlurals(source) : source;
        let text, startIndex, endIndex;

        // check the source only
        re.lastIndex = 0;
        let match = re.exec(strippedSrc);
        while (match) {
            if (match?.groups?.match) {
                text = match.groups.match;
                if (match.indices) {
                    // node > 18
                    startIndex = match.indices.groups.match[0];
                    endIndex = match.indices.groups.match[1];
                } else {
                    // node 12-17
                    let offset = match[0].indexOf(text);
                    startIndex = match.index + offset;
                    endIndex = match.index + offset + text.length;
                }
            } else {
                // node < 12
                text = match[0];
                startIndex = match.index;
                endIndex = match.index+match[0].length;
            }
            let value = {
                severity: this.severity,
                id: resource.getKey(),
                rule: this,
                pathName: file,
                highlight: `Source: ${source.substring(0, startIndex)}<e0>${text}</e0>${source.substring(endIndex)}`,
                description: this.note.replace(/\{matchString\}/g, text),
                locale: resource.getSourceLocale()
            };
            if (typeof(resource.lineNumber) !== 'undefined') {
                value.lineNumber = resource.lineNumber;
            }
            matches.push(new Result(value));

            match = re.exec(strippedSrc);
        }

        return matches;
    }
}

export default ResourceSourceChecker;
