/*
 * ConfigBasedFormatter.test.js
 *
 * Copyright © 2024-2025 JEDLSoft
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

import {Result} from 'ilib-lint-common';
import dedent from 'dedent';

import {ConfigBasedFormatter} from '../../src/formatters/ConfigBasedFormatter.js';
import ResourceMatcher from "../../src/rules/ResourceMatcher.js";

describe('ConfigBasedFormatter', () => {
    it.each([
        {
            name: "a pair of opening and closing tags <eX></eX>",
            highlight: "This is just <e0>me</e0> testing.",
            expected: "This is just >>me<< testing."
        },
        {
            name: "multiple pairs of opening and closing tags <eX></eX>",
            highlight: "This is just <e0>me</e0> <e1>testing</e1>.",
            expected: "This is just >>me<< >>testing<<."
        },
        {
            name: "a self-closing tag <eX/>",
            highlight: "This is just me testing.<e0/>",
            expected: "This is just me testing.>><<"
        },
        {
            name: "an opening tag <eX>",
            highlight: "This is just me testing.<e0>",
            expected: "This is just me testing.>>"
        },
        {
            name: "a closing tag </eX>",
            highlight: "This is just me testing.</e0>",
            expected: "This is just me testing.<<"
        },
    ])('replaces $name with highlight markers', ({highlight, expected}) => {
        expect.assertions(1);

        const formatter = new ConfigBasedFormatter({
            "name": "test-formatter",
            "description": "A formatter for testing purposes",
            "template": "{highlight}",
            "highlightStart": ">>",
            "highlightEnd": "<<"
        })

        const result = formatter.format(new Result({
            description: "A description for testing purposes",
            highlight,
            id: "test.id",
            lineNumber: 123,
            pathName: "test.txt",
            rule: getTestRule(),
            severity: "error",
            source: "test",
            locale: "de-DE"
        }));

        expect(result).toBe(expected);
    });

    test('formatting all fields of a result', () => {
        expect.assertions(1);

        const formatter = new ConfigBasedFormatter({
            "name": "test-formatter",
            "description": "A formatter for testing purposes",
            "template":
                dedent`{severity}: {pathName}({lineNumber}):
                         {description}
                         Highlight: {highlight}
                         Key: {id}
                         Source: {source}
                         Locale: {locale}
                         Auto-fix: {fixStatus}
                         Rule ({ruleName}): {ruleDescription}
                         More info: {ruleLink}
                      `,
            "highlightStart": ">>",
            "highlightEnd": "<<"
        });

        const result = formatter.format(new Result({
            description: "A description for testing purposes",
            highlight: "This is just <e0>me</e0> testing.",
            id: "test.id",
            lineNumber: 123,
            pathName: "test.txt",
            rule: getTestRule(),
            severity: "error",
            source: "test",
            locale: "de-DE"
        }));

        expect(result).toBe(
            dedent`error: test.txt(123):
                     A description for testing purposes
                     Highlight: This is just >>me<< testing.
                     Key: test.id
                     Source: test
                     Locale: de-DE
                     Auto-fix: unavailable
                     Rule (testRule): Rule for testing purposes
                     More info: https://example.com/test
                  `);
    });
});

function getTestRule() {
    return new ResourceMatcher({
        "name": "testRule",
        "description": "Rule for testing purposes",
        "regexps": ["test"],
        "note": "test",
        "sourceLocale": "en-US",
        "link": "https://example.com/test",
    });
}
