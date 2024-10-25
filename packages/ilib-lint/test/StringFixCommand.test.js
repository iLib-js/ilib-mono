/*
 * StringFixCommand.test.js
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

import StringFixCommand from "../src/plugins/string/StringFixCommand.js";

describe("testCreation", () => {
    test("StringFixCommandShouldConstruct", () => {
        expect.assertions(1);
        expect(new StringFixCommand(0, 1, "test")).toBeTruthy();
    });

    test("StringFixCommandCtorShouldThrowPositionNegative", () => {
        expect.assertions(1);
        // can't insert before string start
        expect(() => new StringFixCommand(-1, 0, "")).toThrow();
    });

    test("StringFixCommandCtorShouldThrowPositionNonInteger", () => {
        expect.assertions(1);
        // can't insert in the middle of a character
        expect(() => new StringFixCommand(0.5, 0, "")).toThrow();
    });

    test("StringFixCommandCtorShouldThrowDeleteCountNegative", () => {
        expect.assertions(1);
        // can't delete backwards
        expect(() => new StringFixCommand(0, -1, "")).toThrow();
    });

    test("StringFixCommandCtorShouldThrowDeleteCountNonInteger", () => {
        expect.assertions(1);
        // can't delete half a character
        expect(() => new StringFixCommand(0, 0.5, "")).toThrow();
    });

    test("StringFixCommandFactoryMethodShouldCreateReplacementCommand", () => {
        expect.assertions(1);
        const expected = new StringFixCommand(0, 1, "test");
        const actual = StringFixCommand.replaceAfter(0, 1, "test");
        expect(actual).toStrictEqual(expected);
    });

    test("StringFixCommandFactoryMethodShouldCreateInsertionCommand", () => {
        expect.assertions(1);
        const expected = new StringFixCommand(0, 0, "test");
        const actual = StringFixCommand.insertAfter(0, "test");
        expect(actual).toStrictEqual(expected);
    });

    test("StringFixCommandFactoryMethodShouldCreateDeletionCommand", () => {
        expect.assertions(1);
        const expected = new StringFixCommand(0, 1, "");
        const actual = StringFixCommand.deleteAfter(0, 1);
        expect(actual).toStrictEqual(expected);
    });
});

describe("testOverlap", () => {
    test("StringFixCommandShouldDetectOverlapInOverlappingReplacements", () => {
        expect.assertions(2);
        // command that modifies range [0,2] overlaps
        // another that modifies range [1,3]
        const one = StringFixCommand.replaceAfter(0, 2, "**");
        const other = StringFixCommand.replaceAfter(1, 2, "??");
        expect(one.overlaps(other)).toBeTruthy();
        expect(other.overlaps(one)).toBeTruthy();
    });

    test("StringFixCommandShouldNotDetectOverlapInDistinctReplacements", () => {
        expect.assertions(2);
        // command that modifies range [0,2] does not overlap
        // another that modifies range [3,4]
        // "example" & r 0 2 "**" & r 2 3 "??" => "**??le"
        const one = StringFixCommand.replaceAfter(0, 2, "**");
        const other = StringFixCommand.replaceAfter(3, 2, "??");
        expect(one.overlaps(other)).toBeFalsy();
        expect(other.overlaps(one)).toBeFalsy();
    });

    test("StringFixCommandShouldNotDetectOverlapInAdjacentReplacements", () => {
        expect.assertions(2);
        // command that modifies range [0,2] does not overlap
        // another that modifies range [2,3]
        // "example" & r 0 2 "**" & r 2 3 "??" => "**??le"
        const one = StringFixCommand.replaceAfter(0, 2, "**");
        const other = StringFixCommand.replaceAfter(2, 2, "??");
        expect(one.overlaps(other)).toBeFalsy();
        expect(other.overlaps(one)).toBeFalsy();
    });

    test("StringFixCommandShouldDetectOverlapInSamePositionInsertions", () => {
        expect.assertions(2);
        // insertion starting from 0 does overlap another insertion starting from 0
        // because the outcome would depend on the order of execution
        // "example" & i 0 "*" & i 0 "?" => "*?example"
        // but
        // "example" & i 0 "?" & i 0 "*" => "?*example"
        const one = StringFixCommand.insertAfter(0, "*");
        const other = StringFixCommand.insertAfter(0, "?");
        expect(one.overlaps(other)).toBeTruthy();
        expect(other.overlaps(one)).toBeTruthy();
    });

    test("StringFixCommandShouldNotDetectOverlapInSamePositionInsertionAndDeletion", () => {
        expect.assertions(2);
        // insertion of a char before first char of original string does not overlap
        // the removal of the first char of the original string
        // because the outcome is the same regardless of execution order
        // "example" & i 0 "*" & d 0 1 => "*xample"
        // and
        // "example" & d 0 1 & i 0 "*" => "*xample"
        const one = StringFixCommand.insertAfter(0, "*");
        const other = StringFixCommand.deleteAfter(0, 1);
        expect(one.overlaps(other)).toBeFalsy();
        expect(other.overlaps(one)).toBeFalsy();
    });

    test("StringFixCommandShouldDetectOverlapInInsertionWithinReplacement", () => {
        expect.assertions(2);
        // insertion after 1st char overlaps a replacement (or deletion) of first 2 chars
        const one = StringFixCommand.insertAfter(1, "*");
        const other = StringFixCommand.replaceAfter(0, 2, "??");
        expect(one.overlaps(other)).toBeTruthy();
        expect(other.overlaps(one)).toBeTruthy();
    });

    test("StringFixCommandShouldNotDetectOverlapInAdjacentDeletionThenInsertion", () => {
        expect.assertions(2);
        // deletion of a first char of the original string does not overlap
        // the insertion of the first char of the original string
        // because the outcome is the same regardless of execution order
        // "example" & i 0 "*" & d 0 1 => "*xample"
        // and
        // "example" & d 0 1 & i 0 "*" => "*xample"
        const one = StringFixCommand.insertAfter(0, "*");
        const other = StringFixCommand.deleteAfter(0, 1);
        expect(one.overlaps(other)).toBeFalsy();
        expect(other.overlaps(one)).toBeFalsy();
    });

    test("StringFixCommandShouldDetectOverlapInSamePlaceDeletions", () => {
        expect.assertions(2);
        // deletion starting from 0 overlaps another deletion starting from 0
        const one = StringFixCommand.deleteAfter(0, 1);
        const other = StringFixCommand.deleteAfter(0, 2);
        expect(one.overlaps(other)).toBeTruthy();
        expect(other.overlaps(one)).toBeTruthy();
    });
});

describe("testApply", () => {
    test("StringFixCommandApplyShouldInsert", () => {
        expect.assertions(1);
        const input = "example";
        // insert "*" after 1st char
        const command = StringFixCommand.insertAfter(1, "*");
        const modified = StringFixCommand.applyCommands(input, [command]);
        expect(modified).toBe("e*xample");
    });

    test("StringFixCommandApplyShouldDelete", () => {
        expect.assertions(1);
        const input = "example";
        // delete 2nd char
        const command = StringFixCommand.deleteAfter(1, 1);
        const modified = StringFixCommand.applyCommands(input, [command]);
        expect(modified).toBe("eample");
    });

    test("StringFixCommandApplyShouldReplace", () => {
        expect.assertions(1);
        const input = "example";
        // replace 2nd char to "X"
        const command = StringFixCommand.replaceAfter(1, 1, "X");
        const modified = StringFixCommand.applyCommands(input, [command]);
        expect(modified).toBe("eXample");
    });

    test("StringFixCommandApplyShouldInsertLonger", () => {
        expect.assertions(1);
        const input = "example";
        // insert "**" after 1st char
        const command = StringFixCommand.insertAfter(1, "**");
        const modified = StringFixCommand.applyCommands(input, [command]);
        expect(modified).toBe("e**xample");
    });

    test("StringFixCommandApplyShouldDeleteLonger", () => {
        expect.assertions(1);
        const input = "example";
        // delete 3rd and 4th char
        const command = StringFixCommand.deleteAfter(1, 2);
        const modified = StringFixCommand.applyCommands(input, [command]);
        expect(modified).toBe("emple");
    });

    test("StringFixCommandApplyShouldReplaceShorterToLonger", () => {
        expect.assertions(1);
        const input = "example";
        // replace 3rd and 4th char with a shorter sequence "*"
        const command = StringFixCommand.replaceAfter(1, 2, "*");
        const modified = StringFixCommand.applyCommands(input, [command]);
        expect(modified).toBe("e*mple");
    });

    test("StringFixCommandApplyShouldReplaceLongerToShorter", () => {
        expect.assertions(1);
        const input = "example";
        // replace 2nd char with longer sequence "**"
        const command = StringFixCommand.replaceAfter(1, 1, "**");
        const modified = StringFixCommand.applyCommands(input, [command]);
        expect(modified).toBe("e**ample");
    });

    test("StringFixCommandApplyShouldApplyMultiple", () => {
        expect.assertions(1);
        const input = "example";
        const commands = [
            // replace 2nd char with "?"
            StringFixCommand.replaceAfter(1, 1, "?"),
            // replace last char with "*"
            StringFixCommand.replaceAfter(6, 1, "*"),
        ];
        const modified = StringFixCommand.applyCommands(input, commands);
        expect(modified).toBe("e?ampl*");
    });

    test("StringFixCommandApplyShouldApplyMultipleUnordered", () => {
        expect.assertions(1);
        const input = "example";
        // input not ordered by position
        const commands = [
            // replace last char with "*"
            StringFixCommand.replaceAfter(6, 1, "*"),
            // replace 2nd char with "?"
            StringFixCommand.replaceAfter(1, 1, "?"),
        ];
        const modified = StringFixCommand.applyCommands(input, commands);
        expect(modified).toBe("e?ampl*");
    });

    test("StringFixCommandApplyShouldApplyMultipleWithInsertion", () => {
        expect.assertions(1);
        const input = "example";
        const commands = [
            // insert "*" after 1st char
            StringFixCommand.insertAfter(1, "*"),
            // replace 2nd and 3rd char with "??"
            StringFixCommand.replaceAfter(1, 2, "??"),
        ];
        const modified = StringFixCommand.applyCommands(input, commands);
        expect(modified).toBe("e*??mple");
    });

    test("StringFixCommandApplyShouldApplyMultipleWithInsertionUnordered", () => {
        expect.assertions(1);
        const input = "example";
        // input not ordered by position
        const commands = [
            // replace 2nd and 3rd char with "??"
            StringFixCommand.replaceAfter(1, 2, "??"),
            // insert "*" after 1st char
            StringFixCommand.insertAfter(1, "*"),
        ];
        const modified = StringFixCommand.applyCommands(input, commands);
        expect(modified).toBe("e*??mple");
    });

    test("StringFixCommandApplyShouldThrowOnOverlap", () => {
        expect.assertions(1);
        const input = "example";
        // overlapping commands
        const commands = [
            // replace 1st and 2nd char with "**"
            StringFixCommand.replaceAfter(0, 2, "**"),
            // replace 1st char with "?"
            StringFixCommand.replaceAfter(1, 1, "?"),
        ];
        expect(() => StringFixCommand.applyCommands(input, commands)).toThrow();
    });

    test("StringFixCommandApplyShouldThrowOnReplacementOutOfBounds", () => {
        expect.assertions(1);
        const input = "example";
        // out of bounds
        const commands = [
            StringFixCommand.replaceAfter(99, 1, "*"),
        ];
        expect(() => StringFixCommand.applyCommands(input, commands)).toThrow();
    });

    test("StringFixCommandApplyShouldThrowOnInsertionOutOfBounds", () => {
        expect.assertions(1);
        const input = "example";
        // out of bounds
        const commands = [
            StringFixCommand.insertAfter(99, "*"),
        ];
        expect(() => StringFixCommand.applyCommands(input, commands)).toThrow();
    });

    test("StringFixCommandApplyShouldThrowOnDeletionOutOfBounds", () => {
        expect.assertions(1);
        const input = "example";
        // out of bounds
        const commands = [
            StringFixCommand.deleteAfter(99, 1),
        ];
        expect(() => StringFixCommand.applyCommands(input, commands)).toThrow();
    });

    test("StringFixCommandApplyShouldThrowOnReplacementOutOfBoundsByOne", () => {
        expect.assertions(1);
        const input = "example";
        // out of bounds by 1
        const commands = [
            StringFixCommand.replaceAfter(7, 1, "*"),
        ];
        expect(() => StringFixCommand.applyCommands(input, commands)).toThrow();
    });

    test("StringFixCommandApplyShouldPrepend", () => {
        expect.assertions(1);
        const input = "example";
        // insert "***" before 1st char
        const command = StringFixCommand.insertAfter(0, "***");
        const modified = StringFixCommand.applyCommands(input, [command]);
        expect(modified).toBe("***example");
    });

    test("StringFixCommandApplyShouldAppend", () => {
        expect.assertions(1);
        const input = "example";
        // insert "***" after last char
        const command = StringFixCommand.insertAfter(7, "***");
        const modified = StringFixCommand.applyCommands(input, [command]);
        expect(modified).toBe("example***");
    });

    test("StringFixCommandApplyShouldThrowOnDeletionOutOfBoundsByOne", () => {
        expect.assertions(1);
        const input = "example";
        // out of bounds by 1
        const commands = [
            StringFixCommand.deleteAfter(7, 1),
        ];
        expect(() => StringFixCommand.applyCommands(input, commands)).toThrow();
    });
});
