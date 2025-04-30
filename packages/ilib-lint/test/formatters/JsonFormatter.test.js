/*
 * JsonFormatter.test.js
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

import { Result } from 'ilib-lint-common';
import dedent from 'dedent';

import JsonFormatter from '../../src/formatters/JsonFormatter.js';
import ResourceMatcher from "../../src/rules/ResourceMatcher.js";

describe('JsonFormatter', () => {
    it.each([
        {
            testName: "format a single result",
            name: "ios-app",
            results: [
                new Result({
                    description: "A description for testing purposes",
                    highlight: "This is just <e0>me</e0> testing.",
                    id: "test.id",
                    lineNumber: 123,
                    pathName: "test.txt",
                    rule: getTestRule(),
                    severity: "error",
                    source: "test",
                    locale: "en-US"
                })
            ],
            resultStats: undefined,
            expected: `{"ios-app":{"stats":{},"results":[{"pathName":"test.txt","rule":"testRule","severity":"error","locale":"en-US"}]}}`+"\n"
        },
        {
            testName: "format a single result with stats",
            name: "ios-app",
            results: [
                new Result({
                    description: "A description for testing purposes",
                    highlight: "This is just <e0>me</e0> testing.",
                    id: "test.id",
                    lineNumber: 123,
                    pathName: "test.txt",
                    rule: getTestRule(),
                    severity: "error",
                    source: "test",
                    locale: "de-DE"
                })
            ],
            resultStats: {
                errors: 1,
                warnings: 0,
                suggestions: 0
            },
            expected:`{"ios-app":{"stats":{"errors":1,"warnings":0,"suggestions":0},"results":[{"pathName":"test.txt","rule":"testRule","severity":"error","locale":"de-DE"}]}}`+"\n"
        },
        {
            testName: "format a single result with file stats",
            name: "ios-app",
            results: [
                new Result({
                    description: "A description for testing purposes",
                    highlight: "This is just <e0>me</e0> testing.",
                    id: "test.id",
                    lineNumber: 123,
                    pathName: "test.txt",
                    rule: getTestRule(),
                    severity: "error",
                    source: "test",
                    locale: "fr-FR"
                })
            ],
            fileStats: {
                files: 1,
                lines: 10,
                bytes: 100,
                modules: 1,
                words: 50
            },
            expected:`{"ios-app":{"stats":{"files":1,"lines":10,"bytes":100,"modules":1,"words":50},"results":[{"pathName":"test.txt","rule":"testRule","severity":"error","locale":"fr-FR"}]}}`+"\n"
        },
        {
            testName: "format a single result with file and result stats",
            name: "ios-app",
            results: [
                new Result({
                    description: "A description for testing purposes",
                    highlight: "This is just <e0>me</e0> testing.",
                    id: "test.id",
                    lineNumber: 123,
                    pathName: "test.txt",
                    rule: getTestRule(),
                    severity: "error",
                    source: "test",
                    locale: "es-ES"
                })
            ],
            resultStats: {
                errors: 1,
                warnings: 0,
                suggestions: 0
            },
            fileStats: {
                files: 1,
                lines: 10,
                bytes: 100,
                modules: 1,
                words: 50
            },
            expected:`{"ios-app":{"stats":{"errors":1,"warnings":0,"suggestions":0,"files":1,"lines":10,"bytes":100,"modules":1,"words":50},"results":[{"pathName":"test.txt","rule":"testRule","severity":"error","locale":"es-ES"}]}}`+"\n"
        },
        {
            testName: "format multiple results",
            name: "ios-app",
            results: [
                new Result({
                    description: "A description for testing purposes",
                    highlight: "This is just <e0>me</e0> testing.",
                    id: "test.id",
                    lineNumber: 123,
                    pathName: "test.txt",
                    rule: getTestRule(),
                    severity: "error",
                    source: "test",
                    locale: "en-US"
                }),
                new Result({
                    description: "Another description for testing purposes",
                    highlight: "This is just <e0>another</e0> test.",
                    id: "test.id.2",
                    lineNumber: 456,
                    pathName: "test2.txt",
                    rule: getTestRule(),
                    severity: "warning",
                    source: "test",
                    locale: "en-US"
                })
            ],
            expected:`{"ios-app":{"stats":{},"results":[{"pathName":"test.txt","rule":"testRule","severity":"error","locale":"en-US"},{"pathName":"test2.txt","rule":"testRule","severity":"warning","locale":"en-US"}]}}`+"\n"
        },
        {
            testName: "format multiple results with stats",
            name: "ios-app",
            results: [
                new Result({
                    description: "A description for testing purposes",
                    highlight: "This is just <e0>me</e0> testing.",
                    id: "test.id",
                    lineNumber: 123,
                    pathName: "test.txt",
                    rule: getTestRule(),
                    severity: "error",
                    source: "test"
                }),
                new Result({
                    description: "Another description for testing purposes",
                    highlight: "This is just <e0>another</e0> test.",
                    id: "test.id.2",
                    lineNumber: 456,
                    pathName: "test2.txt",
                    rule: getTestRule(),
                    severity: "warning",
                    source: "test"
                })
            ],
            resultStats: {
                errors: 1,
                warnings: 1,
                suggestions: 0
            },
            expected:`{"ios-app":{"stats":{"errors":1,"warnings":1,"suggestions":0},"results":[{"pathName":"test.txt","rule":"testRule","severity":"error"},{"pathName":"test2.txt","rule":"testRule","severity":"warning"}]}}`+"\n"
        }
    ])('$testName', ({name, results, resultStats, fileStats, expected}) => {
        const formatter = new JsonFormatter();

        const actual = formatter.formatOutput({
            name,
            results,
            resultStats,
            fileStats
        });

        expect(actual).toBe(expected);
    });
});

function getTestRule() {
    return new ResourceMatcher({
        "name": "testRule",
        "description": "Rule for testing purposes",
        "regexps": ["test"],
        "note": "test",
        "sourceLocale": "en-US",
        "link": ""
    });
}
