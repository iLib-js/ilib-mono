/*
 * ResourceTargetChecker.js - implement a declarative rule to check
 * target strings for problems
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
import ResourceFixer from '../plugins/resource/ResourceFixer.js';

/**
 * @class Resource checker class that checks that any regular expressions
 * that matches in the target causes a Result to be created.
 */
class ResourceTargetChecker extends DeclarativeResourceRule {
    /**
     * Construct a new regular expression-based resource checker.
     *
     * @param {Object} options options as documented above
     * @param {string} options.name a unique name for this rule
     * @param {string} options.description - a one-line description of what this rule checks for.
     *   Example: "Check that URLs in the target are valid."
     * @param {string} options.note - a one-line note that will be printed on screen when the
     *   check fails. Example: "The URL {matchString} is not valid."
     *   (Currently, matchString is the only replacement
     *   param that is supported.)
     * @param {Array<string>} options.regexps an array of strings that encode regular expressions to
     *   look for
     * @constructor
     */
    constructor(options) {
        super(options);
    }

    /**
     * @override
     */
    checkString({re, source, target, file, resource}) {
        re.lastIndex = 0;
        let matches = [];
        const strippedTar = this.useStripped ? stripPlurals(target) : target;
        let text, startIndex, endIndex;

        // check the target only, but we need the source in order
        // to construct a Result if necessary
        re.lastIndex = 0;
        let match = re.exec(strippedTar);
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
            let fix = undefined;
            if (this.fixDefinitions) {
                let commands = [];
                // the declarative fix definitions array is really an array of commands to apply,
                // so we need to convert the search/replace pairs into commands
                this.fixDefinitions.forEach(fixDefinition => {
                    const regex = new RegExp(fixDefinition.search, fixDefinition.flags);
                    const match = regex.exec(text);
                    if (!match) return;

                    const original = match[0];
                    const start = startIndex+match.index;
                    const len = original.length;
                    const replacementText = original.replace(new RegExp(fixDefinition.search, fixDefinition.flags), fixDefinition.replace || '');

                    commands.push(ResourceFixer.createStringCommand(
                        start,
                        len,
                        replacementText
                    ));
                });
                if (commands.length > 0) {
                    fix = ResourceFixer.createFix({
                        resource,
                        commands
                    });
                }
            }
            let value = {
                severity: this.severity,
                id: resource.getKey(),
                source,
                rule: this,
                pathName: file,
                highlight: `Target: ${target.substring(0, startIndex)}<e0>${text}</e0>${target.substring(endIndex)}`,
                description: this.note.replace(/\{matchString\}/g, text),
                locale: resource.getTargetLocale()
            };
            if (fix) {
                value.fix = fix;
            }
            if (typeof(resource.lineNumber) !== 'undefined') {
                value.lineNumber = resource.lineNumber;
            }
            matches.push(new Result(value));

            match = re.exec(strippedTar);
        }

        return matches;
    }
}

export default ResourceTargetChecker;
