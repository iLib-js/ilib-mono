/*
 * ResourceSnakeCase.test.js
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

import {ResourceString} from 'ilib-tools-common';
import {Result} from 'ilib-lint-common';

import ResourceSnakeCase from "../../src/rules/ResourceSnakeCase.js";

describe("ResourceSnakeCase", () => {
    test("creates ResourceSnakeCase rule instance", () => {
        const rule = new ResourceSnakeCase({});

        expect(rule).toBeInstanceOf(ResourceSnakeCase);
        expect(rule.getName()).toEqual("resource-snake-case");
    });

    test.each([
        undefined,
        null,
        true,
        100,
        'string',
        {},
        () => {},
    ])("handles invalid `except` parameter gracefully (and does not break in runtime)", (invalidExcept) => {
        const rule = new ResourceSnakeCase({param: {except: invalidExcept}});

        const resource = createTestResourceString({source: "snake_case_exception", target: "some_target"});
        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        expect(result.rule).toBeInstanceOf(ResourceSnakeCase);
        expect(result.severity).toEqual("error");
    });

    test.each([
        {source: ""},
        {source: undefined},
        {source: null},
    ])("returns `undefined` if source string is empty ($source)", ({source}) => {
        const rule = new ResourceSnakeCase({});
        const resource = createTestResourceString({source, target: "some_target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();

    });

    test.each([
        {target: ""},
        {target: undefined},
        {target: null},
    ])("returns `undefined` if target string is empty ($target)", ({target}) => {
        const rule = new ResourceSnakeCase({});
        const resource = createTestResourceString({source: "some_source", target});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns `undefined` if source string is an exception", () => {
        const options = {param: {except: ["snake_case_exception"]}}
        const rule = new ResourceSnakeCase(options);
        const resource = createTestResourceString({source: "snake_case_exception", target: "some_target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns `undefined` if source string is NOT in snake case", () => {
        const rule = new ResourceSnakeCase({});
        const resource = createTestResourceString({source: "some source", target: "some target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns `undefined` if source is in snake case and target is the same", () => {
        const rule = new ResourceSnakeCase({});
        const resource = createTestResourceString({source: "snake_case", target: "snake_case"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns error if source is in snake case and target is different", () => {
        const rule = new ResourceSnakeCase({});
        const resource = createTestResourceString({source: "snake_case", target: "different_target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        expect(result.rule).toBeInstanceOf(ResourceSnakeCase);
        expect(result.severity).toEqual("error");
    });
});

describe('ResourceSnakeCase.isSnakeCase', () => {
    test.each(
        [
            {name: "snake case", source: "snake_case"},
            {name: "snake case with leading and trailing whitespace", source: " snake_case "},
            {name: "snake case with numbers (123)", source: " snake_case123 "},
            {name: "snake case with underscored numbers (_123)", source: " snake_case_123 "},

            {name: "screaming snake case", source: "SOME_SCREAMING_SNAKE_CASE"},
            {name: "screaming snake case with leading and trailing whitespace", source: " SOME_SCREAMING_SNAKE_CASE "},
            {name: "screaming snake case with numbers", source: "SOME_SCREAMING_SNAKE_CASE123 "},
            {name: "screaming snake case with underscored numbers", source: "SOME_SCREAMING_SNAKE_CASE_123 "},

            {name: "camel snake case", source: "camel_Snake_Case"},
            {name: "came snake case with leading and trailing whitespace", source: " camel_Snake_Case "},
            {name: "camel snake case with numbers", source: "camel_Snake_Case123 "},
            {name: "camel snake case with underscored numbers", source: "camel_Snake_Case_123 "},
        ]
    )("returns `true` if source string is $name", ({source}) => {
        const rule = new ResourceSnakeCase({});

        const result = rule.isSnakeCase(source);

        expect(result).toBe(true);
    });

    test.each(
        [
            {name: "whitespace (solely)", source: " "},
            {name: "text and whitespace", source: "snake case"},
            {name: "snake case and text", source: "snake_case and text"},
            {name: "screaming snake case and text", source: "SCREAMING_SNAKE_CASE and text"},
            {name: "mixed case", source: "mixed_CASE"},
        ]
    )("returns `false` if string is $name", ({name, source}) => {
        const rule = new ResourceSnakeCase({});
        const resource = createTestResourceString({source, target: "does not matter"});

        const result = rule.matchString({source: resource.source});

        expect(result).toBeUndefined();
    });
});

function createTestResourceString({source, target}) {
    return new ResourceString({
        source,
        target,
        key: "snake.case.test.string.id",
        targetLocale: "xd-XD",
        pathName: "tests/for/snake_case.xliff"
    });
}

