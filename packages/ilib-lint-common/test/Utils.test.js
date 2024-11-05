/*
 * Utils.test.js - test utility functions
 *
 * Copyright © 2023 JEDLSoft
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

import { isKebabCase, isCamelCase, isSnakeCase, withVisibleWhitespace } from '../src/utils.js';

describe("testUtils", () => {
    test("VisibleWhitespaceRepresentExplicit", () => {
        expect.assertions(1);
        const subject = "\u0020\u00a0\t\r\n\v";
        const result = withVisibleWhitespace(subject);
        expect(result).toBe("⎵⍽→␍␊␋");
    });

    test("VisibleWhitespaceRepresentNonExplicit", () => {
        expect.assertions(1);
        const subject = "\u3000";
        const result = withVisibleWhitespace(subject);
        expect(result).toBe("[U+3000]");
    });

    test("VisibleWhitespaceNonString", () => {
        expect.assertions(5);

        expect(withVisibleWhitespace(undefined)).toBe("");
        expect(withVisibleWhitespace(false)).toBe("");
        expect(withVisibleWhitespace(["foo"])).toBe("");
        expect(withVisibleWhitespace({property: "foo"})).toBe("");
        expect(withVisibleWhitespace(() => "1")).toBe("");
    });

    test("IsKebabCaseTrue", () => {
        expect.assertions(1);

        expect(isKebabCase("This-is-Kebab-case")).toBeTruthy();
    });

    test("IsKebabCaseDegenerate", () => {
        expect.assertions(1);

        expect(!isKebabCase("this")).toBeTruthy();
    });

    test("IsKebabCaseMinimal", () => {
        expect.assertions(1);

        expect(isKebabCase("t-")).toBeTruthy();
    });

    test("IsKebabCaseMultipleDashes", () => {
        expect.assertions(1);

        expect(isKebabCase("this--is--kebab--case--still")).toBeTruthy();
    });

    test("IsKebabCaseFalse", () => {
        expect.assertions(1);

        expect(!isKebabCase("this-is not kebab-case despite-the-various-dashes")).toBeTruthy();
    });

    test("IsKebabCaseFalse2", () => {
        expect.assertions(1);

        expect(!isKebabCase("this-is,not-kebab-case-either")).toBeTruthy();
    });

    test("IsKebabCaseFalse3", () => {
        expect.assertions(1);

        expect(!isKebabCase("this-is_not-kebab-case-either")).toBeTruthy();
    });

    test("IsKebabCaseFalse4", () => {
        expect.assertions(1);

        expect(!isKebabCase("-t")).toBeTruthy();
    });

    test("IsKebabCaseUndefined", () => {
        expect.assertions(1);

        expect(!isKebabCase()).toBeTruthy();
    });

    test("IsKebabCaseEmpty", () => {
        expect.assertions(1);

        expect(!isKebabCase("")).toBeTruthy();
    });

    test("IsKebabCaseNonString", () => {
        expect.assertions(4);

        expect(!isKebabCase(false)).toBeTruthy();
        expect(!isKebabCase(["foo"])).toBeTruthy();
        expect(!isKebabCase({property: "foo"})).toBeTruthy();
        expect(!isKebabCase(() => "1")).toBeTruthy();
    });

    test("IsCamelCaseTrue", () => {
        expect.assertions(1);

        expect(isCamelCase("thisIsCamelCase")).toBeTruthy();
    });

    test("IsCamelCaseDegenerate", () => {
        expect.assertions(1);

        expect(!isCamelCase("this")).toBeTruthy();
    });

    test("IsCamelCaseMinimal", () => {
        expect.assertions(3);

        expect(isCamelCase("aC")).toBeTruthy();
        expect(isCamelCase("aCa")).toBeTruthy();
        expect(isCamelCase("CaC")).toBeTruthy();
    });

    test("IsCamelCaseSingleCaps", () => {
        expect.assertions(1);

        expect(isCamelCase("thisIsACamelCaseString")).toBeTruthy();
    });

    test("IsCamelCaseFalse", () => {
        expect.assertions(1);

        expect(!isCamelCase("thisIsNot CamelCaseDespite theForm")).toBeTruthy();
    });

    test("IsCamelCaseFalse2", () => {
        expect.assertions(1);

        expect(!isCamelCase("thisIsNot,CamelCaseEither")).toBeTruthy();
    });

    test("IsCamelCaseFalse3", () => {
        expect.assertions(1);

        expect(!isCamelCase("thisIsNot_CamelCaseEither")).toBeTruthy();
    });

    test("IsCamelCaseFalse4", () => {
        expect.assertions(2);

        expect(!isCamelCase("CC")).toBeTruthy();
        expect(!isCamelCase("Casdf")).toBeTruthy();
    });

    test("IsCamelCaseUndefined", () => {
        expect.assertions(1);

        expect(!isCamelCase()).toBeTruthy();
    });

    test("IsCamelCaseEmpty", () => {
        expect.assertions(1);

        expect(!isCamelCase("")).toBeTruthy();
    });

    test("IsCamelCaseNonString", () => {
        expect.assertions(4);

        expect(!isCamelCase(false)).toBeTruthy();
        expect(!isCamelCase(["foo"])).toBeTruthy();
        expect(!isCamelCase({property: "foo"})).toBeTruthy();
        expect(!isCamelCase(() => "1")).toBeTruthy();
    });

    test("IsSnakeCaseTrue", () => {
        expect.assertions(1);

        expect(isSnakeCase("this_is_snake_case")).toBeTruthy();
    });

    test("IsSnakeCaseDegenerate", () => {
        expect.assertions(1);

        expect(!isSnakeCase("this")).toBeTruthy();
    });

    test("IsSnakeCaseMinimal", () => {
        expect.assertions(2);

        expect(isSnakeCase("_t")).toBeTruthy();
        expect(isSnakeCase("t_")).toBeTruthy();
    });

    test("IsSnakeCaseNodeBuiltins", () => {
        expect.assertions(2);

        expect(isSnakeCase("__LINE__")).toBeTruthy();
        expect(isSnakeCase("__FILE__")).toBeTruthy();
    });

    test("IsSnakeCaseMultipleUnderscores", () => {
        expect.assertions(1);

        expect(isSnakeCase("this__is__still__a__snake__case__string")).toBeTruthy();
    });

    test("IsSnakeCaseFalse", () => {
        expect.assertions(1);

        expect(!isSnakeCase("this_is not snake_case despite_the_various_underscores")).toBeTruthy();
    });

    test("IsSnakeCaseFalse2", () => {
        expect.assertions(1);

        expect(!isSnakeCase("this_is_not,snake_case_either")).toBeTruthy();
    });

    test("IsSnakeCaseFalse3", () => {
        expect.assertions(1);

        expect(!isSnakeCase("this_is_not-snake_case_either")).toBeTruthy();
    });

    test("IsSnakeCaseUndefined", () => {
        expect.assertions(1);

        expect(!isSnakeCase()).toBeTruthy();
    });

    test("IsSnakeCaseEmpty", () => {
        expect.assertions(1);

        expect(!isSnakeCase("")).toBeTruthy();
    });

    test("IsSnakeCaseNonString", () => {
        expect.assertions(4);

        expect(!isSnakeCase(false)).toBeTruthy();
        expect(!isSnakeCase(["foo"])).toBeTruthy();
        expect(!isSnakeCase({property: "foo"})).toBeTruthy();
        expect(!isSnakeCase(() => "1")).toBeTruthy();
    });
});

