/*
 * ResourceKebabCase.test.js
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

import {Result, Fix} from "ilib-lint-common";
import {ResourceString} from "ilib-tools-common";

import ResourceKebabCase from "../../src/rules/ResourceKebabCase.js";
import ResourceFixer from "../../src/plugins/resource/ResourceFixer.js";

describe("ResourceKebabCase", () => {
    test("creates ResourceKebabCase rule instance", () => {
        const rule = new ResourceKebabCase({})

        expect(rule).toBeInstanceOf(ResourceKebabCase);
        expect(rule.getName()).toBe("resource-kebab-case");
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
        const rule = new ResourceKebabCase({param: {except: Array.isArray(invalidExcept) ? invalidExcept : undefined}});

        const resource = createTestResourceString({source: "kebab-case-exception", target: "some-kebab-case-target"});
        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        expect(result.rule).toBeInstanceOf(ResourceKebabCase);
        expect(result.severity).toEqual("error");
    });

    test.each([
        {source: ""},
        {source: undefined},
        {source: null},
    ])("returns `undefined` if source string is empty ($source)", ({source}) => {
        const rule = new ResourceKebabCase({});
        const resource = createTestResourceString({source, target: "some-target"});

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
        const rule = new ResourceKebabCase({});
        const resource = createTestResourceString({source: "some-source", target});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns `undefined` if source string is an exception", () => {
        const options = {param: {except: ["kebab-case-exception"]}}
        const rule = new ResourceKebabCase(options);
        const resource = createTestResourceString({source: "kebab-case-exception", target: "some-target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns `undefined` if source string is NOT in kebab case", () => {
        const rule = new ResourceKebabCase({});
        const resource = createTestResourceString({source: "some source", target: "some target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns `undefined` if source is in kebab case and target is the same", () => {
        const rule = new ResourceKebabCase({});
        const resource = createTestResourceString({source: "kebab-case", target: "kebab-case"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns error if source is in kebab case and target is different", () => {
        const rule = new ResourceKebabCase({});
        const resource = createTestResourceString({source: "kebab-case", target: "different-target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        expect(result.rule).toBeInstanceOf(ResourceKebabCase);
        expect(result.severity).toEqual("error");
        expect(result.fix).toBeDefined();
    });

    test("provides fix that replaces target with source", () => {
        const rule = new ResourceKebabCase({});
        const resource = createTestResourceString({source: "kebab-case", target: "different-target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

            const fix = result.fix;
            expect(fix).toBeInstanceOf(Fix);
            expect(fix.commands).toHaveLength(1);

            const command = fix.commands[0];
            expect(command.stringFix).toEqual({
                position: 0,
                deleteCount: resource.target.length,
                insertContent: resource.source
            });
    });
});

describe('ResourceKebabCase.isKebabCase', () => {
    test.each(
        [
            {name: "simple kebab case", source: "kebab-case"},
            {name: "multiple hyphens", source: "kebab-case-with-multiple-words"},
            {name: "mixed case", source: "Kebab-Case-Mixed"},
            {name: "upper case", source: "KEBAB-CASE-UPPER"},
            {name: "with digits", source: "kebab-case-123"},
            {name: "with leading and trailing whitespace", source: " kebab-case "},
            {name: "with trailing hyphen", source: "kebab-case-"},
            {name: "with leading hyphen", source: "-kebab-case"},
        ]
    )("returns `true` if source string is $name", ({source}) => {
        const rule = new ResourceKebabCase({});

        const result = rule.isKebabCase(source);

        expect(result).toBe(true);
    });

    test.each([
        {name: "whitespace solely", source: " "},
        {name: "digits solely", source: "123"},
        {name: "lowercase letters word solely", source: "word"},
        {name: "uppercase letters word solely", source: "WORD"},
        {name: "uppercase letters word solely", source: "Word"},

        {name: "text and whitespace", source: "kebab case"},
        {name: "camel case and text", source: "kebab-case and kebab"},

        {name: "text with underscores", source: "kebab_case"},
        {name: "text with dots", source: "kebab.case"},
        {name: "text with consecutive hyphens", source: "kebab--case"},
    ])("returns `false` if source string is $name", ({source}) => {
        const rule = new ResourceKebabCase({});

        const result = rule.isKebabCase(source);

        expect(result).toBe(false);
    });
});

function createTestResourceString({source, target}) {
    return new ResourceString({
        source,
        target,
        key: "kebab.case.test.string.id",
        targetLocale: "xd-XD",
        pathName: "tests/for/kebabCase.xliff"
    });
} 
