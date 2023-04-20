/*
 * testUtils.js - test utility functions
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

export const testUtils = {
    testVisibleWhitespaceRepresentExplicit: function(test) {
        test.expect(1);
        const subject = "\u0020\u00a0\t\r\n\v";
        const result = withVisibleWhitespace(subject);
        test.equal(result, "⎵⍽→␍␊␋");
        test.done();
    },
    
    testVisibleWhitespaceRepresentNonExplicit: function(test) {
        test.expect(1);
        const subject = "\u3000";
        const result = withVisibleWhitespace(subject);
        test.equal(result, "[U+3000]");
        test.done();
    },

    testVisibleWhitespaceNonString: function(test) {
        test.expect(5);

        test.equals("", withVisibleWhitespace(undefined));
        test.equals("", withVisibleWhitespace(false));
        test.equals("", withVisibleWhitespace(["foo"]));
        test.equals("", withVisibleWhitespace({property: "foo"}));
        test.equals("", withVisibleWhitespace(() => "1"));

        test.done();
    },

    testIsKebabCaseTrue: function(test) {
        test.expect(1);

        test.ok(isKebabCase("This-is-Kebab-case"));

        test.done();
    },

    testIsKebabCaseDegenerate: function(test) {
        test.expect(1);

        test.ok(!isKebabCase("this"));

        test.done();
    },

    testIsKebabCaseMinimal: function(test) {
        test.expect(1);

        test.ok(isKebabCase("t-"));

        test.done();
    },

    testIsKebabCaseMultipleDashes: function(test) {
        test.expect(1);

        test.ok(isKebabCase("this--is--kebab--case--still"));

        test.done();
    },

    testIsKebabCaseFalse: function(test) {
        test.expect(1);

        test.ok(!isKebabCase("this-is not kebab-case despite-the-various-dashes"));

        test.done();
    },

    testIsKebabCaseFalse2: function(test) {
        test.expect(1);

        test.ok(!isKebabCase("this-is,not-kebab-case-either"));

        test.done();
    },

    testIsKebabCaseFalse3: function(test) {
        test.expect(1);

        test.ok(!isKebabCase("this-is_not-kebab-case-either"));

        test.done();
    },

    testIsKebabCaseFalse4: function(test) {
        test.expect(1);

        test.ok(!isKebabCase("-t"));

        test.done();
    },

    testIsKebabCaseUndefined: function(test) {
        test.expect(1);

        test.ok(!isKebabCase());

        test.done();
    },

    testIsKebabCaseEmpty: function(test) {
        test.expect(1);

        test.ok(!isKebabCase(""));

        test.done();
    },

    testIsKebabCaseNonString: function(test) {
        test.expect(4);

        test.ok(!isKebabCase(false));
        test.ok(!isKebabCase(["foo"]));
        test.ok(!isKebabCase({property: "foo"}));
        test.ok(!isKebabCase(() => "1"));

        test.done();
    },

    testIsCamelCaseTrue: function(test) {
        test.expect(1);

        test.ok(isCamelCase("thisIsCamelCase"));

        test.done();
    },

    testIsCamelCaseDegenerate: function(test) {
        test.expect(1);

        test.ok(!isCamelCase("this"));

        test.done();
    },

    testIsCamelCaseMinimal: function(test) {
        test.expect(3);

        test.ok(isCamelCase("aC"));
        test.ok(isCamelCase("aCa"));
        test.ok(isCamelCase("CaC"));

        test.done();
    },

    testIsCamelCaseSingleCaps: function(test) {
        test.expect(1);

        test.ok(isCamelCase("thisIsACamelCaseString"));

        test.done();
    },

    testIsCamelCaseFalse: function(test) {
        test.expect(1);

        test.ok(!isCamelCase("thisIsNot CamelCaseDespite theForm"));

        test.done();
    },

    testIsCamelCaseFalse2: function(test) {
        test.expect(1);

        test.ok(!isCamelCase("thisIsNot,CamelCaseEither"));

        test.done();
    },

    testIsCamelCaseFalse3: function(test) {
        test.expect(1);

        test.ok(!isCamelCase("thisIsNot_CamelCaseEither"));

        test.done();
    },

    testIsCamelCaseFalse4: function(test) {
        test.expect(2);

        test.ok(!isCamelCase("CC"));
        test.ok(!isCamelCase("Casdf"));

        test.done();
    },

    testIsCamelCaseUndefined: function(test) {
        test.expect(1);

        test.ok(!isCamelCase());

        test.done();
    },

    testIsCamelCaseEmpty: function(test) {
        test.expect(1);

        test.ok(!isCamelCase(""));

        test.done();
    },

    testIsCamelCaseNonString: function(test) {
        test.expect(4);

        test.ok(!isCamelCase(false));
        test.ok(!isCamelCase(["foo"]));
        test.ok(!isCamelCase({property: "foo"}));
        test.ok(!isCamelCase(() => "1"));

        test.done();
    },

    testIsSnakeCaseTrue: function(test) {
        test.expect(1);

        test.ok(isSnakeCase("this_is_snake_case"));

        test.done();
    },

    testIsSnakeCaseDegenerate: function(test) {
        test.expect(1);

        test.ok(!isSnakeCase("this"));

        test.done();
    },

    testIsSnakeCaseMinimal: function(test) {
        test.expect(2);

        test.ok(isSnakeCase("_t"));
        test.ok(isSnakeCase("t_"));

        test.done();
    },

    testIsSnakeCaseNodeBuiltins: function(test) {
        test.expect(2);

        test.ok(isSnakeCase("__LINE__"));
        test.ok(isSnakeCase("__FILE__"));

        test.done();
    },

    testIsSnakeCaseMultipleUnderscores: function(test) {
        test.expect(1);

        test.ok(isSnakeCase("this__is__still__a__snake__case__string"));

        test.done();
    },

    testIsSnakeCaseFalse: function(test) {
        test.expect(1);

        test.ok(!isSnakeCase("this_is not snake_case despite_the_various_underscores"));

        test.done();
    },

    testIsSnakeCaseFalse2: function(test) {
        test.expect(1);

        test.ok(!isSnakeCase("this_is_not,snake_case_either"));

        test.done();
    },

    testIsSnakeCaseFalse3: function(test) {
        test.expect(1);

        test.ok(!isSnakeCase("this_is_not-snake_case_either"));

        test.done();
    },

    testIsSnakeCaseUndefined: function(test) {
        test.expect(1);

        test.ok(!isSnakeCase());

        test.done();
    },

    testIsSnakeCaseEmpty: function(test) {
        test.expect(1);

        test.ok(!isSnakeCase(""));

        test.done();
    },

    testIsSnakeCaseNonString: function(test) {
        test.expect(4);

        test.ok(!isSnakeCase(false));
        test.ok(!isSnakeCase(["foo"]));
        test.ok(!isSnakeCase({property: "foo"}));
        test.ok(!isSnakeCase(() => "1"));

        test.done();
    }
};

