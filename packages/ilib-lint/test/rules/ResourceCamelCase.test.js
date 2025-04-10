/*
 * ResourceCamelCase.test.js
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

import {Result} from "ilib-lint-common";
import {ResourceString} from "ilib-tools-common";

import ResourceCamelCase from "../../src/rules/ResourceCamelCase.js";

describe("ResourceCamelCase", () => {
    test("creates ResourceCamelCase rule instance", () => {
        const rule = new ResourceCamelCase({})

        expect(rule).toBeInstanceOf(ResourceCamelCase);
        expect(rule.getName()).toBe("resource-camel-case");
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
        const rule = new ResourceCamelCase({param: {except: invalidExcept}});

        const resource = createTestResourceString({source: "camelCaseException", target: "someCamelCaseTarget"});
        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        expect(result.rule).toBeInstanceOf(ResourceCamelCase);
        expect(result.severity).toEqual("error");
    });

    test.each([
        {source: ""},
        {source: undefined},
        {source: null},
    ])("returns `undefined` if source string is empty ($source)", ({source}) => {
        const rule = new ResourceCamelCase({});
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
        const rule = new ResourceCamelCase({});
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
        const options = {param: {except: ["camelCaseException"]}}
        const rule = new ResourceCamelCase(options);
        const resource = createTestResourceString({source: "camelCaseException", target: "some_target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns `undefined` if source string is NOT in camel case", () => {
        const rule = new ResourceCamelCase({});
        const resource = createTestResourceString({source: "some source", target: "some target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns `undefined` if source is in camel case and target is the same", () => {
        const rule = new ResourceCamelCase({});
        const resource = createTestResourceString({source: "camelCase", target: "camelCase"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns error if source is in camel case and target is different", () => {
        const rule = new ResourceCamelCase({});
        const resource = createTestResourceString({source: "camelCase", target: "differentTarget"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        expect(result.rule).toBeInstanceOf(ResourceCamelCase);
        expect(result.severity).toEqual("error");
    });
});

describe('ResourceCamelCase.isCamelCase', () => {
    test.each(
        [
            {name: "lower camel case", source: "camelCase"},
            {name: "upper camel case a.k.a. pascal case", source: "PascalCase"},
            {name: "randomly mixed camel case", source: "cAmelCaSe"},

            {name: "any camel case with leading and trailing whitespace", source: " AnyCamelCase "},
            {name: "any camel case with digits at any position", source: "C4m3lC4s3W1thD1g1ts"},
        ]
    )("returns `true` if source string is $name", ({source}) => {
        const rule = new ResourceCamelCase({});

        const result = rule.isCamelCase(source);

        expect(result).toBe(true);
    });

    test.each([
        {name: "whitespace solely", source: " "},
        {name: "digits solely", source: "123"},
        {name: "lowercase letters word solely", source: "word"},
        {name: "uppercase letters word solely", source: "WORD"},
        {name: "uppercase letters word solely", source: "Word"},

        {name: "text and whitespace", source: "camel Case"},
        {name: "camel case and text", source: "camelCase and text"},

        {name: "trailing capitalized letter", source: "CamelCasE"},
        {name: "multiple consecutive uppercase letters", source: "CAmelCase"},
    ])("returns `false` if source string is $name", ({source}) => {
        const rule = new ResourceCamelCase({});

        const result = rule.isCamelCase(source);

        expect(result).toBe(false);
    });
});

function createTestResourceString({source, target}) {
    return new ResourceString({
        source,
        target,
        key: "camel.case.test.string.id",
        targetLocale: "xd-XD",
        pathName: "tests/for/camelCase.xliff"
    });
}
