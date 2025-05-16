/*
 * AnsiConsoleFormatter.test.js
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

import {Result} from 'ilib-lint-common';
import dedent from 'dedent';

import AnsiConsoleFormatter from '../../src/formatters/AnsiConsoleFormatter.js';
import ResourceMatcher from "../../src/rules/ResourceMatcher.js";

describe('Ansi Console Formatter', () => {
    test('formatting a result with ANSI colors', () => {
        expect.assertions(1);

        const formatter = new AnsiConsoleFormatter();

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

        const esc = "\u001B";
        const expected =
              dedent`
                     test.txt(123):
                       ${esc}[91mA description for testing purposes${esc}[0m
                       Key: test.id
                       Source: test
                       This is just ${esc}[91mme${esc}[0m testing.
                       Auto-fix: unavailable
                       Rule (testRule): Rule for testing purposes
                       Locale: de-DE
                       More info: https://example.com/test` + "\n";

        expect(result).toBe(expected);
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
