/*
 * PositionalFixCommand.test.js
 *
 * Copyright © 2023, 2025 JEDLSoft
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

import { PositionalFixCommand } from "../../../src/plugins/positional/PositionalFixCommand.js";

/** @template T */
const concatArrays = (/** @type {T[][]} */ ...arrays) => arrays.flat(1);

describe("testCreation", () => {
    test("PositionalFixCommandShouldConstruct", () => {
        expect.assertions(1);
        expect(new PositionalFixCommand(0, 1, ["a"])).toBeTruthy();
    });

    test("PositionalFixCommandCtorShouldThrowPositionNegative", () => {
        expect.assertions(1);
        // can't insert before content start
        expect(() => new PositionalFixCommand(-1, 0, ["a"])).toThrow();
    });

    test("PositionalFixCommandCtorShouldThrowPositionNonInteger", () => {
        expect.assertions(1);
        // can't insert in the middle of an element
        expect(() => new PositionalFixCommand(0.5, 0, ["a"])).toThrow();
    });

    test("PositionalFixCommandCtorShouldThrowDeleteCountNegative", () => {
        expect.assertions(1);
        // can't delete backwards
        expect(() => new PositionalFixCommand(0, -1)).toThrow();
    });

    test("PositionalFixCommandCtorShouldThrowDeleteCountNonInteger", () => {
        expect.assertions(1);
        // can't delete half an element
        expect(() => new PositionalFixCommand(0, 0.5)).toThrow();
    });
});

describe("testOverlap", () => {
    test("PositionalFixCommandShouldDetectOverlapInOverlappingReplacements", () => {
        expect.assertions(2);
        // command that modifies range [0,2] overlaps
        // another that modifies range [1,3]
        const one = new PositionalFixCommand(0, 2, ["a", "b"]);
        const other = new PositionalFixCommand(1, 2, ["c", "d"]);
        expect(one.overlaps(other)).toBeTruthy();
        expect(other.overlaps(one)).toBeTruthy();
    });

    test("PositionalFixCommandShouldNotDetectOverlapInDistinctReplacements", () => {
        expect.assertions(2);
        // command that modifies range [0,2] does not overlap
        // another that modifies range [3,4]
        // "example" & replace(0, 2, "**") & replace(2, 3, "??") => "**??le"
        const one = new PositionalFixCommand(0, 2, ["a", "b"]);
        const other = new PositionalFixCommand(3, 2, ["c", "d"]);
        expect(one.overlaps(other)).toBeFalsy();
        expect(other.overlaps(one)).toBeFalsy();
    });

    test("PositionalFixCommandShouldNotDetectOverlapInAdjacentReplacements", () => {
        expect.assertions(2);
        // command that modifies range [0,2] does not overlap
        // another that modifies range [2,3]
        // "example" & replace(0, 2, "**") & replace(2, 3, "??") => "**??le"
        const one = new PositionalFixCommand(0, 2, ["*", "*"]);
        const other = new PositionalFixCommand(2, 2, ["?", "?"]);
        expect(one.overlaps(other)).toBeFalsy();
        expect(other.overlaps(one)).toBeFalsy();
    });

    test("PositionalFixCommandShouldDetectOverlapInSamePositionInsertions", () => {
        expect.assertions(2);
        // insertion starting from 0 does overlap another insertion starting from 0
        // because the outcome would depend on the order of execution
        // "example" & replace(0, 0, "*") & replace(0, 0, "?") => "*?example"
        // but
        // "example" & replace(0, 0, "?") & replace(0, 0, "*") => "?*example"
        const one = new PositionalFixCommand(0, 0, ["*"]);
        const other = new PositionalFixCommand(0, 0, ["?"]);
        expect(one.overlaps(other)).toBeTruthy();
        expect(other.overlaps(one)).toBeTruthy();
    });

    test("PositionalFixCommandShouldNotDetectOverlapInSamePositionInsertionAndDeletion", () => {
        expect.assertions(2);
        // insertion of a char before first char of original string does not overlap
        // the removal of the first char of the original string
        // because the outcome is the same regardless of execution order
        // "example" & replace(0, 0, "*") & replace(0, 1, undefined) => "*xample"
        // and
        // "example" & replace(0, 1, undefined) & replace(0, 0, "*") => "*xample"
        const one = new PositionalFixCommand(0, 0, ["*"]);
        /** @type {PositionalFixCommand<string[]>} */
        const other = new PositionalFixCommand(0, 1);
        expect(one.overlaps(other)).toBeFalsy();
        expect(other.overlaps(one)).toBeFalsy();
    });

    test("PositionalFixCommandShouldDetectOverlapInInsertionWithinReplacement", () => {
        expect.assertions(2);
        // insertion after 1st char overlaps a replacement (or deletion) of first 2 chars
        const one = new PositionalFixCommand(1, 0, ["*"]);
        const other = new PositionalFixCommand(0, 2, ["?", "?"]);
        expect(one.overlaps(other)).toBeTruthy();
        expect(other.overlaps(one)).toBeTruthy();
    });

    test("PositionalFixCommandShouldNotDetectOverlapInAdjacentDeletionThenInsertion", () => {
        expect.assertions(2);
        // deletion of a first char of the original string does not overlap
        // the insertion of the first char of the original string
        // because the outcome is the same regardless of execution order
        // "example" & replace(0, 0, "*") & replace(0, 1, undefined) => "*xample"
        // and
        // "example" & replace(0, 1, undefined) & replace(0, 0, "*") => "*xample"
        const one = new PositionalFixCommand(0, 0, ["*"]);
        /** @type {PositionalFixCommand<string[]>} */
        const other = new PositionalFixCommand(0, 1);
        expect(one.overlaps(other)).toBeFalsy();
        expect(other.overlaps(one)).toBeFalsy();
    });

    test("PositionalFixCommandShouldDetectOverlapInSamePlaceDeletions", () => {
        expect.assertions(2);
        // deletion starting from 0 overlaps another deletion starting from 0
        const one = new PositionalFixCommand(0, 1);
        const other = new PositionalFixCommand(0, 2);
        expect(one.overlaps(other)).toBeTruthy();
        expect(other.overlaps(one)).toBeTruthy();
    });
});

describe("testApply", () => {
    test("PositionalFixCommandApplyShouldInsert", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // insert "*" after 1st element
        const command = new PositionalFixCommand(1, 0, ["*"]);
        const modified = PositionalFixCommand.applyCommands(input, [command], concatArrays);
        expect(modified).toStrictEqual(["e", "*", "x", "a", "m", "p", "l", "e"]);
    });

    test("PositionalFixCommandApplyShouldDelete", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // delete 2nd element
        /** @type {PositionalFixCommand<string[]>} */
        const command = new PositionalFixCommand(1, 1);
        const modified = PositionalFixCommand.applyCommands(input, [command], concatArrays);
        expect(modified).toStrictEqual(["e", "a", "m", "p", "l", "e"]);
    });

    test("PositionalFixCommandApplyShouldReplace", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // replace 2nd element to "X"
        const command = new PositionalFixCommand(1, 1, ["X"]);
        const modified = PositionalFixCommand.applyCommands(input, [command], concatArrays);
        expect(modified).toStrictEqual(["e", "X", "a", "m", "p", "l", "e"]);
    });

    test("PositionalFixCommandApplyShouldInsertLonger", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // insert "**" after 1st element
        const command = new PositionalFixCommand(1, 0, ["**"]);
        const modified = PositionalFixCommand.applyCommands(input, [command], concatArrays);
        expect(modified).toStrictEqual(["e", "**", "x", "a", "m", "p", "l", "e"]);
    });

    test("PositionalFixCommandApplyShouldDeleteLonger", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // delete 3rd and 4th element
        /** @type {PositionalFixCommand<string[]>} */
        const command = new PositionalFixCommand(1, 2);
        const modified = PositionalFixCommand.applyCommands(input, [command], concatArrays);
        expect(modified).toStrictEqual(["e", "m", "p", "l", "e"]);
    });

    test("StringFixCommandApplyShouldReplaceShorterToLonger", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // replace 3rd and 4th element with a shorter sequence ["*"]
        const command = new PositionalFixCommand(2, 2, ["*"]);
        const modified = PositionalFixCommand.applyCommands(input, [command], concatArrays);
        expect(modified).toStrictEqual(["e", "x", "*", "p", "l", "e"]);
    });

    test("PositionalFixCommandApplyShouldReplaceLongerToShorter", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // replace 2nd element with longer sequence "**"
        const command = new PositionalFixCommand(1, 1, ["**"]);
        const modified = PositionalFixCommand.applyCommands(input, [command], concatArrays);
        expect(modified).toStrictEqual(["e", "**", "a", "m", "p", "l", "e"]);
    });

    test("PositionalFixCommandApplyShouldApplyMultiple", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        const commands = [
            // replace 2nd element with "?"
            new PositionalFixCommand(1, 1, ["?"]),
            // replace last element with "*"
            new PositionalFixCommand(6, 1, ["*"]),
        ];
        const modified = PositionalFixCommand.applyCommands(input, commands, concatArrays);
        expect(modified).toStrictEqual(["e", "?", "a", "m", "p", "l", "*"]);
    });

    test("PositionalFixCommandApplyShouldApplyMultipleUnordered", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // input not ordered by position
        const commands = [
            // replace last element with "*"
            new PositionalFixCommand(6, 1, ["*"]),
            // replace 2nd element with "?"
            new PositionalFixCommand(1, 1, ["?"]),
        ];
        const modified = PositionalFixCommand.applyCommands(input, commands, concatArrays);
        expect(modified).toStrictEqual(["e", "?", "a", "m", "p", "l", "*"]);
    });

    test("PositionalFixCommandApplyShouldApplyMultipleWithInsertion", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        const commands = [
            // insert "*" after 1st element
            new PositionalFixCommand(1, 0, ["*"]),
            // replace 2nd and 3rd element with "??"
            new PositionalFixCommand(1, 2, ["?", "?"]),
        ];
        const modified = PositionalFixCommand.applyCommands(input, commands, concatArrays);
        expect(modified).toStrictEqual(["e", "*", "?", "?", "m", "p", "l", "e"]);
    });

    test("PositionalFixCommandApplyShouldApplyMultipleWithInsertionUnordered", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // input not ordered by position
        const commands = [
            // replace 2nd and 3rd element with "??"
            new PositionalFixCommand(1, 2, ["?", "?"]),
            // insert "*" after 1st element
            new PositionalFixCommand(1, 0, ["*"]),
        ];
        const modified = PositionalFixCommand.applyCommands(input, commands, concatArrays);
        expect(modified).toStrictEqual(["e", "*", "?", "?", "m", "p", "l", "e"]);
    });

    test("PositionalFixCommandApplyShouldThrowOnOverlap", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // overlapping commands
        const commands = [
            // replace 1st and 2nd element with "**"
            new PositionalFixCommand(0, 2, ["*", "*"]),
            // replace 1st element with "?"
            new PositionalFixCommand(1, 1, ["?"]),
        ];
        expect(() => PositionalFixCommand.applyCommands(input, commands, concatArrays)).toThrow();
    });

    test("PositionalFixCommandApplyShouldThrowOnReplacementOutOfBounds", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // out of bounds
        const commands = [new PositionalFixCommand(99, 1, ["*"])];
        expect(() => PositionalFixCommand.applyCommands(input, commands, concatArrays)).toThrow();
    });

    test("PositionalFixCommandApplyShouldThrowOnInsertionOutOfBounds", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // out of bounds
        const commands = [new PositionalFixCommand(99, 0, ["*"])];
        expect(() => PositionalFixCommand.applyCommands(input, commands, concatArrays)).toThrow();
    });

    test("PositionalFixCommandApplyShouldThrowOnDeletionOutOfBounds", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // out of bounds
        /** @type {PositionalFixCommand<string[]>[]} */
        const commands = [new PositionalFixCommand(99, 1)];
        expect(() => PositionalFixCommand.applyCommands(input, commands, concatArrays)).toThrow();
    });

    test("PositionalFixCommandApplyShouldThrowOnReplacementOutOfBoundsByOne", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // out of bounds by 1
        const commands = [new PositionalFixCommand(7, 1, ["*"])];
        expect(() => PositionalFixCommand.applyCommands(input, commands, concatArrays)).toThrow();
    });

    test("PositionalFixCommandApplyShouldPrepend", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // insert "***" before 1st element
        const command = new PositionalFixCommand(0, 0, ["***"]);
        const modified = PositionalFixCommand.applyCommands(input, [command], concatArrays);
        expect(modified).toStrictEqual(["***", "e", "x", "a", "m", "p", "l", "e"]);
    });

    test("PositionalFixCommandApplyShouldAppend", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // insert "***" after last element
        const command = new PositionalFixCommand(7, 0, ["***"]);
        const modified = PositionalFixCommand.applyCommands(input, [command], concatArrays);
        expect(modified).toStrictEqual(["e", "x", "a", "m", "p", "l", "e", "***"]);
    });

    test("PositionalFixCommandApplyShouldThrowOnDeletionOutOfBoundsByOne", () => {
        expect.assertions(1);
        const input = ["e", "x", "a", "m", "p", "l", "e"];
        // out of bounds by 1
        /** @type {PositionalFixCommand<string[]>[]} */
        const commands = [new PositionalFixCommand(7, 1)];
        expect(() => PositionalFixCommand.applyCommands(input, commands, concatArrays)).toThrow();
    });
});
