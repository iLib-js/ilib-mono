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

import { isKababCase, isCamelCase, isSnakeCase, withVisibleWhitespace } from '../src/utils.js';

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

    testIsKababCaseTrue: function(test) {
        test.expect(1);

        test.ok(isKababCase("This-is-Kabab-case"));

        test.done();
    },

    testIsKababCaseDegenerate: function(test) {
        test.expect(1);

        test.ok(isKababCase("this"));

        test.done();
    },

    testIsKababCaseFalse: function(test) {
        test.expect(1);

        test.ok(!isKababCase("this-is not kabab-case despite-the-various-dashes"));

        test.done();
    },

    testIsKababCaseFalse2: function(test) {
        test.expect(1);

        test.ok(!isKababCase("this-is,not-kabab-case-either"));

        test.done();
    },

    testIsKababCaseUndefined: function(test) {
        test.expect(1);

        test.ok(!isKababCase());

        test.done();
    },

    testIsKababCaseEmpty: function(test) {
        test.expect(1);

        test.ok(!isKababCase(""));

        test.done();
    },

    testIsKababCaseNonString: function(test) {
        test.expect(4);

        test.ok(!isKababCase(false));
        test.ok(!isKababCase(["foo"]));
        test.ok(!isKababCase({property: "foo"}));
        test.ok(!isKababCase(() => "1"));

        test.done();
    },

    testIsCamelCaseTrue: function(test) {
        test.expect(1);

        test.ok(isCamelCase("thisIsCamelCase"));

        test.done();
    },

    testIsCamelCaseDegenerate: function(test) {
        test.expect(1);

        test.ok(isCamelCase("this"));

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

        test.ok(isSnakeCase("this_is_kabab_case"));

        test.done();
    },

    testIsSnakeCaseDegenerate: function(test) {
        test.expect(1);

        test.ok(isSnakeCase("this"));

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

