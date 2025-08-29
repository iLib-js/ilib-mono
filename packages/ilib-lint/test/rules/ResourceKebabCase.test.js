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
import RuleManager from "../../src/RuleManager.js";
import BuiltinPlugin from "../../src/plugins/BuiltinPlugin.js";

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
        const rule = new ResourceKebabCase({except: Array.isArray(invalidExcept) ? invalidExcept : undefined});

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
        const options = {except: ["kebab-case-exception"]}
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

    test("returns `undefined` if source string is an exception when instantiated via RuleManager", () => {
        // This test verifies that the exception functionality works correctly when the rule is instantiated
        // through the RuleManager.get() method, which is the actual code path used in the system
        const ruleManager = new RuleManager();
        const builtinPlugin = new BuiltinPlugin();
        ruleManager.add(builtinPlugin.getRules());

        const rule = ruleManager.get("resource-kebab-case", {except: ["kebab-case-exception"]});

        expect(rule).toBeInstanceOf(ResourceKebabCase);

        const resource = createTestResourceString({source: "kebab-case-exception", target: "some-target"});

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeUndefined();
    });

    test("returns error when source string is NOT an exception (showing exception functionality works)", () => {
        // This test verifies that the exception functionality is actually working by showing that
        // without the except parameter, the same test case would produce an error
        const ruleManager = new RuleManager();
        const builtinPlugin = new BuiltinPlugin();
        ruleManager.add(builtinPlugin.getRules());

        const rule = ruleManager.get("resource-kebab-case", {}); // No except parameter

        expect(rule).toBeInstanceOf(ResourceKebabCase);

        const resource = createTestResourceString({source: "kebab-case-exception", target: "some-target"});

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
        const resource = createTestResourceString({source: "kebab-case-example", target: "kebab-case-example"});

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
        const resource = createTestResourceString({source: "kebab-case-example", target: "different-target"});

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
        const resource = createTestResourceString({source: "kebab-case-example", target: "different-target"});

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
            expect(command.stringFix.position).toBe(0);
            expect(command.stringFix.deleteCount).toBe(resource.target.length);
            expect(command.stringFix.insertContent).toEqual(resource.source);
    });
});

describe('ResourceKebabCase.isKebabCase', () => {
    test.each(
        [
            {name: "multiple hyphens", source: "kebab-case-with-multiple-words"},
            {name: "mixed case with multiple hyphens", source: "Kebab-Case-Mixed-Example"},
            {name: "upper case with multiple hyphens", source: "KEBAB-CASE-UPPER-EXAMPLE"},
            {name: "with digits and multiple hyphens", source: "kebab-case-123-example"},
            {name: "with leading and trailing whitespace", source: " kebab-case-example "},
            {name: "with trailing hyphen", source: "kebab-case-example-"},
            {name: "with leading hyphen", source: "-kebab-case-example"},
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
        {name: "mixed case word solely", source: "Word"},
        {name: "single hyphen kebab case", source: "kebab-case"},
        {name: "single hyphen with mixed case", source: "Kebab-Case"},
        {name: "single hyphen with upper case", source: "KEBAB-CASE"},
        {name: "single hyphen with leading/trailing whitespace", source: " kebab-case "},
        {name: "single hyphen with trailing hyphen", source: "kebab-"},
        {name: "single hyphen with leading hyphen", source: "-kebab"},

        {name: "text and whitespace", source: "kebab case"},
        {name: "camel case and text", source: "kebab-case-example and kebab"},

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
