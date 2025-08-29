/*
 * ByteFixer.test.js
 *
 * Copyright © 2023-2025 JEDLSoft
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

import { IntermediateRepresentation, SourceFile } from "ilib-lint-common";
import ByteFixer from "../../../src/plugins/byte/ByteFixer.js";
import ByteFix from "../../../src/plugins/byte/ByteFix.js";
import PositionalFixCommand from "../../../src/plugins/positional/PositionalFixCommand.js";

const sourceFile = new SourceFile("test/file.txt", {});

describe("ByteFixer", () => {
    test("should replace a byte", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "byte",
            sourceFile,
            ir: Buffer.from("abcdef"),
        });
        const fixer = new ByteFixer();
        const fix = new ByteFix(new PositionalFixCommand(2, 1, Buffer.from("C")));
        fixer.applyFixes(subject, [fix]);
        expect(subject.ir).toEqual(Buffer.from("abCdef"));
    });

    test("should insert a byte", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "byte",
            sourceFile,
            ir: Buffer.from("abcdef"),
        });
        const fixer = new ByteFixer();
        const fix = new ByteFix(new PositionalFixCommand(2, 0, Buffer.from("!")));
        fixer.applyFixes(subject, [fix]);
        expect(subject.ir).toEqual(Buffer.from("ab!cdef"));
    });

    test("should delete a byte", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "byte",
            sourceFile,
            ir: Buffer.from("abcdef"),
        });
        const fixer = new ByteFixer();
        const fix = new ByteFix(new PositionalFixCommand(2, 1, Buffer.from([])));
        fixer.applyFixes(subject, [fix]);
        expect(subject.ir).toEqual(Buffer.from("abdef"));
    });

    test("should replace multiple bytes", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "byte",
            sourceFile,
            ir: Buffer.from("abcdef"),
        });
        const fixer = new ByteFixer();
        // produced by rule "uppercase the vowels"
        const fix = new ByteFix(
            new PositionalFixCommand(0, 1, Buffer.from("A")),
            new PositionalFixCommand(4, 1, Buffer.from("E"))
        );
        fixer.applyFixes(subject, [fix]);
        expect(subject.ir).toEqual(Buffer.from("AbcdEf"));
    });

    test("should insert multiple bytes", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "byte",
            sourceFile,
            ir: Buffer.from("abcdef"),
        });
        const fixer = new ByteFixer();
        // produced by rule "always quote"
        const fix = new ByteFix(
            new PositionalFixCommand(0, 0, Buffer.from('"')),
            new PositionalFixCommand(6, 0, Buffer.from('"'))
        );
        fixer.applyFixes(subject, [fix]);
        expect(subject.ir).toEqual(Buffer.from('"abcdef"'));
    });

    test("should delete multiple bytes", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "byte",
            sourceFile,
            ir: Buffer.from("abcdef"),
        });
        const fixer = new ByteFixer();
        // produced by rule "disallow vowels"
        const fix = new ByteFix(
            new PositionalFixCommand(0, 1, Buffer.from([])),
            new PositionalFixCommand(4, 1, Buffer.from([]))
        );
        fixer.applyFixes(subject, [fix]);
        expect(subject.ir).toEqual(Buffer.from("bcdf"));
    });

    test("should apply multiple fixes", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "byte",
            sourceFile,
            ir: Buffer.from("abcdef"),
        });
        const fixer = new ByteFixer();
        const fixes = [
            // produced by rule "sentence case"
            new ByteFix(new PositionalFixCommand(0, 1, Buffer.from("A"))),
            // produced by rule "always shout"
            new ByteFix(new PositionalFixCommand(6, 0, Buffer.from("!"))),
        ];
        fixer.applyFixes(subject, fixes);
        expect(subject.ir).toEqual(Buffer.from("Abcdef!"));
    });

    test("should apply multiple fixes with multiple commands", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "byte",
            sourceFile,
            ir: Buffer.from("abcdef"),
        });
        const fixer = new ByteFixer();
        const fixes = [
            // produced by rule "always quote"
            new ByteFix(
                new PositionalFixCommand(0, 0, Buffer.from('"')),
                new PositionalFixCommand(6, 0, Buffer.from('"'))
            ),
            // produced by rule "disallow vowels"
            new ByteFix(
                new PositionalFixCommand(0, 1, Buffer.from([])),
                new PositionalFixCommand(4, 1, Buffer.from([]))
            ),
        ];
        fixer.applyFixes(subject, fixes);
        expect(subject.ir).toEqual(Buffer.from('"bcdf"'));
    });

    test("should mark applied fixes as applied", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "byte",
            sourceFile,
            ir: Buffer.from("abcdef"),
        });
        const fixer = new ByteFixer();
        // no overlap
        const fixes = [
            // produced by rule "sentence case"
            new ByteFix(new PositionalFixCommand(0, 1, Buffer.from("A"))),
            // produced by rule "always shout"
            new ByteFix(new PositionalFixCommand(6, 0, Buffer.from("!"))),
        ];
        fixer.applyFixes(subject, fixes);
        expect(fixes.every((f) => f.applied)).toBe(true);
    });

    test("should not mark overlapping fixes as applied", () => {
        expect.assertions(2);
        const subject = new IntermediateRepresentation({
            type: "byte",
            sourceFile,
            ir: Buffer.from("abcdef"),
        });
        const fixer = new ByteFixer();

        // overlap

        // produced by rule "always shout"
        const alwaysShoutFix = new ByteFix(new PositionalFixCommand(6, 0, Buffer.from("!")));
        // produced by rule "always ask"
        const alwaysAskFix = new ByteFix(new PositionalFixCommand(6, 0, Buffer.from("?")));

        fixer.applyFixes(subject, [alwaysShoutFix, alwaysAskFix]);

        // Fixer cannot apply both fixes, because there is partial command overlap
        // (unable to tell which is more important:
        // should there always be exclamation mark or the question mark at the end?)
        // so it should skip one of the fixes (the one which was further in the queue)

        expect(alwaysShoutFix.applied).toBe(true);
        expect(alwaysAskFix.applied).toBe(false);
    });

    test("should not apply any commands of a skipped fix", () => {
        expect.assertions(4);
        const subject = new IntermediateRepresentation({
            type: "byte",
            sourceFile,
            ir: Buffer.from("abcdef"),
        });
        const fixer = new ByteFixer();

        // overlap

        // produced by rule "always ask"
        const alwaysAskFix = new ByteFix(new PositionalFixCommand(6, 0, Buffer.from("?")));
        // produced by rule "always shout in Spanish"
        const alwaysShoutFix = new ByteFix(
            new PositionalFixCommand(0, 0, Buffer.from("¡")),
            new PositionalFixCommand(6, 0, Buffer.from("!"))
        );
        // produced by rule "uppercase B and D"
        const uppercaseSelectedFix = new ByteFix(
            new PositionalFixCommand(1, 1, Buffer.from("B")),
            new PositionalFixCommand(3, 1, Buffer.from("D"))
        );

        fixer.applyFixes(subject, [alwaysAskFix, alwaysShoutFix, uppercaseSelectedFix]);

        // Fixer cannot apply all fixes, because
        // there is partial command overlap between "always ask in Spanish" and "always shout";
        // since always shout came later, always ask should be applied fully, while always shout
        // should be skipped and none of its commands should be executed;
        // uppercase b and d should be applied because it has no overlap with other fixes

        expect(alwaysAskFix.applied).toBe(true);
        expect(alwaysShoutFix.applied).toBe(false);
        expect(uppercaseSelectedFix.applied).toBe(true);

        expect(subject.ir).toEqual(Buffer.from("aBcDef?"));
    });
});
