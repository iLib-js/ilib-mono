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
                    source: "test"
                })
            ],
            resultStats: undefined,
            expected: `{"ios-app":{"stats":{},"results":[{"pathName":"test.txt","rule":"testRule","severity":"error"}]}}`+"\n"
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
                    source: "test"
                })
            ],
            resultStats: {
                errors: 1,
                warnings: 0,
                suggestions: 0
            },
            expected:`{"ios-app":{"stats":{"errors":1,"warnings":0,"suggestions":0},"results":[{"pathName":"test.txt","rule":"testRule","severity":"error"}]}}`+"\n"
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
                    source: "test"
                })
            ],
            fileStats: {
                files: 1,
                lines: 10,
                bytes: 100,
                modules: 1
            },
            expected:`{"ios-app":{"stats":{"files":1,"lines":10,"bytes":100,"modules":1},"results":[{"pathName":"test.txt","rule":"testRule","severity":"error"}]}}`+"\n"
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
                    source: "test"
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
                modules: 1
            },
            expected:`{"ios-app":{"stats":{"errors":1,"warnings":0,"suggestions":0,"files":1,"lines":10,"bytes":100,"modules":1},"results":[{"pathName":"test.txt","rule":"testRule","severity":"error"}]}}`+"\n"
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
            expected:`{"ios-app":{"stats":{},"results":[{"pathName":"test.txt","rule":"testRule","severity":"error"},{"pathName":"test2.txt","rule":"testRule","severity":"warning"}]}}`+"\n"
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
        },
        {
            testName: "format a single result with a fix that is applied",
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
                    fix: {
                        type: "resource",
                        applied: true
                    }
                })
            ],
            fileStats: {
                files: 1,
                lines: 10,
                bytes: 100,
                modules: 1
            },
            expected:`{"ios-app":{"stats":{"files":1,"lines":10,"bytes":100,"modules":1},"results":[{"pathName":"test.txt","rule":"testRule","severity":"error","fix":true,"fixApplied":true}]}}`+"\n"
        },
        {
            testName: "format a single result with a fix that is not applied",
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
                    fix: {
                        type: "resource",
                        applied: false
                    }
                })
            ],
            fileStats: {
                files: 1,
                lines: 10,
                bytes: 100,
                modules: 1
            },
            expected:`{"ios-app":{"stats":{"files":1,"lines":10,"bytes":100,"modules":1},"results":[{"pathName":"test.txt","rule":"testRule","severity":"error","fix":true,"fixApplied":false}]}}`+"\n"
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
