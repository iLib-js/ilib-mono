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

import {Result, Fix} from "ilib-lint-common";
import {ResourceString, Location} from "ilib-tools-common";

import ResourceSnakeCase from "../../src/rules/ResourceSnakeCase.js";
import ResourceFixer from "../../src/plugins/resource/ResourceFixer.js";
import RuleManager from "../../src/RuleManager.js";
import BuiltinPlugin from "../../src/plugins/BuiltinPlugin.js";

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
        const rule = new ResourceSnakeCase({except: invalidExcept});

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
        const options = {except: ["snake_case_exception"]}
        const rule = new ResourceSnakeCase({ param: options });
        const resource = createTestResourceString({source: "snake_case_exception", target: "some_target"});

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

        const rule = ruleManager.get("resource-snake-case", {except: ["snake_case_exception"]});

        expect(rule).toBeInstanceOf(ResourceSnakeCase);

        const resource = createTestResourceString({source: "snake_case_exception", target: "some_target"});

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

        const rule = ruleManager.get("resource-snake-case", {}); // No except parameter

        expect(rule).toBeInstanceOf(ResourceSnakeCase);

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
        const resource = createTestResourceString({
            source: "snake_case",
            target: "different_target",
            location: new Location({ line: 41, offset: 0, char: 0 })
        });

        const result = rule.matchString({
            source: resource.source,
            target: resource.target,
            file: resource.pathName,
            resource
        });

        expect(result).toBeInstanceOf(Result);
        expect(result.rule).toBeInstanceOf(ResourceSnakeCase);
        expect(result.severity).toEqual("error");
        expect(result.locale).toBe("xd-XD");
        expect(result.lineNumber).toBe(41);
        expect(result.fix).toBeDefined();
    });

    test("provides fix that replaces target with source", () => {
        const rule = new ResourceSnakeCase({});
        const resource = createTestResourceString({source: "snake_case", target: "different_target"});

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

/**
 * Create a test resource string
 * @private
 * @param {Object} param0 The parameters
 * @param {string} param0.source The source string
 * @param {string} param0.target The target string
 * @param {Location} [param0.location] The location of the resource
 *
 * @returns {ResourceString} The test resource string
 */
function createTestResourceString({source, target, location}) {
    return new ResourceString({
        source,
        target,
        key: "snake.case.test.string.id",
        targetLocale: "xd-XD",
        pathName: "tests/for/snake_case.xliff",
        ...(location && { location })
    });
}

