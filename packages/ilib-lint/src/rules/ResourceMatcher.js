/*
 * ResourceMatcher.js - rule to check if regexps in the source string also
 * appear in the target string
 *
 * Copyright © 2022-2023 JEDLSoft
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

function findMissing(source, target) {
    let missing = [];
    for (var i = 0; i < source.length; i++) {
        if (target.indexOf(source[i]) < 0) {
            missing.push(source[i]);
        }
    }
    return missing;
}

function getHighlight(resource, index, category, target) {
    if (resource.getType() === 'array') {
        return `Target[${index}]: ${target}<e0></e0>`;
    } else if (resource.getType() === 'plural') {
        return `Target(${category}): ${target}<e0></e0>`;
    } else {
        return `Target: ${target}<e0></e0>`;
    }
}

/**
 * @class Resource checker class that checks that any regular expressions
 * that matches in the source also appears in the translation.
 */
class ResourceMatcher extends DeclarativeResourceRule {
    /**
     * Construct a new regular expression-based resource checker.
     *
     * @param {Object} options options as documented above
     * @param {string} options.name a unique name for this rule
     * @param {string} options.description a one-line description of what this rule checks for.
     *   Example: "Check that URLs in the source also appear in the target"
     * @param {string} options.note a one-line note that will be printed on screen when the
     *   check fails. Example: "The URL {matchString} did not appear in the
     *   the target." (Currently, matchString is the only replacement
     *   param that is supported.)
     * @param {string} options.sourceLocale locale (if any) of the source
     * @param {string} options.link an URL to a document that explains this rule in more detail
     * @param {string} options.severity severity of the results of this rule. This should be one of
     *   "error", "warning", or "suggestion".
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
    checkString({re, source, target, file, resource, index, category}) {
        re.lastIndex = 0;
        let sourceMatches = [];
        const strippedSrc = stripPlurals(source);
        const strippedTar = stripPlurals(target);

        let match = re.exec(strippedSrc);
        while (match) {
            sourceMatches.push(match?.groups?.match ?? match[0]);
            match = re.exec(strippedSrc);
        }

        if (sourceMatches.length > 0) {
            // contains the things we are looking for, so check the target
            re.lastIndex = 0;
            let targetMatches = [];
            match = re.exec(strippedTar);
            while (match) {
                targetMatches.push(match?.groups?.match ?? match[0]);
                match = re.exec(strippedTar);
            }
            const missing = findMissing(sourceMatches, targetMatches);
            if (missing.length > 0) {
                return missing.map(missing => {
                    let value = {
                        severity: this.severity,
                        id: resource.getKey(),
                        source: source,
                        rule: this,
                        pathName: file,
                        highlight: getHighlight(resource, index, category, target),
                        description: this.note.replace(/\{matchString\}/g, missing),
                        locale: resource.getTargetLocale()
                    };
                    if (typeof(resource.lineNumber) !== 'undefined') {
                        value.lineNumber = resource.lineNumber;
                    }
                    return new Result(value);
                });
            }
        }
    }
}

export default ResourceMatcher;
