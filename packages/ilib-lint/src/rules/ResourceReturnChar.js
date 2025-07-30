/*
 * ResourceReturnChar.js - Rule to check that return character counts match between source and target
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

import ResourceRule from './ResourceRule.js';

/**
 * Rule to check that the number of return characters (CR, LF, CRLF) in the source
 * string matches the number in the target string. This is important for Windows
 * applications where return characters are used for formatting output.
 *
 * @example
 * // Source: "Line 1\nLine 2\nLine 3" (2 newlines)
 * // Target: "Line 1\nLine 2" (1 newline) - ERROR
 * // Target: "Line 1\nLine 2\nLine 3" (2 newlines) - OK
 */
export default class ResourceReturnChar extends ResourceRule {
    constructor(options) {
        super(options);
        this.name = "resource-return-char";
        this.description = "Checks that the number of return characters (CR, LF, CRLF) in the source matches the target";
        this.link = "https://github.com/iLib-js/ilib-lint/blob/main/docs/resource-return-char.md";
        this.type = "resource";
    }

    /**
     * Count return characters in a string, handling CR, LF, and CRLF sequences
     * @param {string} str - The string to count return characters in
     * @returns {number} - The number of return characters
     */
    countReturnChars(str) {
        if (!str) return 0;

        let count = 0;
        let i = 0;

        while (i < str.length) {
            if (str[i] === '\r' && i + 1 < str.length && str[i + 1] === '\n') {
                // CRLF sequence
                count++;
                i += 2;
            } else if (str[i] === '\r' || str[i] === '\n') {
                // Single CR or LF
                count++;
                i++;
            } else {
                i++;
            }
        }

        return count;
    }

    /**
     * Match a resource string to check if return character counts match
     * @param {Object} params - Parameters for the match
     * @param {string} params.source - The source string
     * @param {string} params.target - The target string
     * @param {Object} params.resource - The resource object
     * @param {string} params.file - The file path
     * @returns {Object|undefined} - Result object if there's a mismatch, undefined otherwise
     */
    matchString({ source, target, resource, file }) {
        if (!source || !target) {
            return;
        }

        const sourceReturns = this.countReturnChars(source);
        const targetReturns = this.countReturnChars(target);

        if (sourceReturns !== targetReturns) {
            return {
                rule: this,
                severity: "error",
                id: "return-char-count-mismatch",
                pathName: file,
                source: source,
                target: target,
                highlight: `Source has ${sourceReturns} return character(s), target has ${targetReturns}`,
                description: `Return character count mismatch: source has ${sourceReturns} return character(s), target has ${targetReturns}. This may cause formatting issues in Windows applications.`,
                lineNumber: resource?.lineNumber,
                charNumber: resource?.charNumber,
                endLineNumber: resource?.endLineNumber,
                endCharNumber: resource?.endCharNumber,
                locale: resource?.targetLocale
            };
        }

        return;
    }
}