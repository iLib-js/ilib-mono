/*
 * StringFixer.test.js
 *
 * Copyright © 2023-2024 JEDLSoft
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
import StringFixer from "../src/plugins/string/StringFixer.js";
import StringFix from "../src/plugins/string/StringFix.js";
import StringFixCommand from "../src/plugins/string/StringFixCommand.js";

const sourceFile = new SourceFile("test/file.txt", {});

describe("testStringFixer", () => {
    test("StringFixerShouldReplace", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            sourceFile,
            ir: "abcdef",
        });
        const fixer = new StringFixer();
        const fix = new StringFix(StringFixCommand.replaceAfter(2, 1, "C"));
        fixer.applyFixes(subject, [fix]);
        expect(subject.ir).toBe("abCdef");
    });

    test("StringFixerShouldInsert", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            sourceFile,
            ir: "abcdef",
        });
        const fixer = new StringFixer();
        const fix = new StringFix(StringFixCommand.insertAfter(2, "!"));
        fixer.applyFixes(subject, [fix]);
        expect(subject.ir).toBe("ab!cdef");
    });

    test("StringFixerShouldDelete", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            sourceFile,
            ir: "abcdef",
        });
        const fixer = new StringFixer();
        const fix = new StringFix(StringFixCommand.deleteAfter(2, 1));
        fixer.applyFixes(subject, [fix]);
        expect(subject.ir).toBe("abdef");
    });

    test("StringFixerShouldReplaceMultiple", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            sourceFile,
            ir: "abcdef",
        });
        const fixer = new StringFixer();
        // produced by rule "uppercase the vowels"
        const fix = new StringFix(StringFixCommand.replaceAfter(0, 1, "A"), StringFixCommand.replaceAfter(4, 1, "E"));
        fixer.applyFixes(subject, [fix]);
        expect(subject.ir).toBe("AbcdEf");
    });

    test("StringFixerShouldInsertMultiple", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            sourceFile,
            ir: "abcdef",
        });
        const fixer = new StringFixer();
        // produced by rule "always quote"
        const fix = new StringFix(StringFixCommand.insertAfter(0, "\""), StringFixCommand.insertAfter(6, "\""));
        fixer.applyFixes(subject, [fix]);
        expect(subject.ir).toBe("\"abcdef\"");
    });

    test("StringFixerShouldDeleteMultiple", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            sourceFile,
            ir: "abcdef",
        });
        const fixer = new StringFixer();
        // produced by rule "disallow vowels"
        const fix = new StringFix(StringFixCommand.deleteAfter(0, 1), StringFixCommand.deleteAfter(4, 1));
        fixer.applyFixes(subject, [fix]);
        expect(subject.ir).toBe("bcdf");
    });

    test("StringFixerShouldFixMultipleFixes", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            sourceFile,
            ir: "abcdef",
        });
        const fixer = new StringFixer();
        const fixes = [
            // produced by rule "sentence case"
            new StringFix(StringFixCommand.replaceAfter(0, 1, "A")),
            // produced by rule "always shout"
            new StringFix(StringFixCommand.insertAfter(6, "!")),
        ];
        fixer.applyFixes(subject, fixes);
        expect(subject.ir).toBe("Abcdef!");
    });

    test("StringFixerShouldFixMultipleFixesMultipleCommands", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            sourceFile,
            ir: "abcdef",
        });
        const fixer = new StringFixer();
        const fixes = [
            // produced by rule "always quote"
            new StringFix(StringFixCommand.insertAfter(0, "\""), StringFixCommand.insertAfter(6, "\"")),
            // produced by rule "disallow vowels"
            new StringFix(StringFixCommand.deleteAfter(0, 1), StringFixCommand.deleteAfter(4, 1)),
        ];
        fixer.applyFixes(subject, fixes);
        expect(subject.ir).toBe("\"bcdf\"");
    });

    test("StringFixerShouldFlagAppliedFixes", () => {
        expect.assertions(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            sourceFile,
            ir: "abcdef",
        });
        const fixer = new StringFixer();
        // no overlap
        const fixes = [
            // produced by rule "sentence case"
            new StringFix(StringFixCommand.replaceAfter(0, 1, "A")),
            // produced by rule "always shout"
            new StringFix(StringFixCommand.insertAfter(6, "!")),
        ];
        fixer.applyFixes(subject, fixes);
        expect(fixes.every(f => f.applied)).toBe(true);
    });

    test("StringFixerShouldNotMarkOverlappingFixAsApplied", () => {
        expect.assertions(2);
        const subject = new IntermediateRepresentation({
            type: "string",
            sourceFile,
            ir: "abcdef",
        });
        const fixer = new StringFixer();

        // overlap

        // produced by rule "always shout"
        const alwaysShoutFix = new StringFix(StringFixCommand.insertAfter(6, "!"));
        // produced by rule "always ask"
        const alwaysAskFix = new StringFix(StringFixCommand.insertAfter(6, "?"));

        fixer.applyFixes(subject, [alwaysShoutFix, alwaysAskFix]);

        // Fixer cannot apply both fixes, because there is partial command overlap
        // (unable to tell which is more important:
        // should there always be exclamation mark or the question mark at the end?)
        // so it should skip one of the fixes (the one which was further in the queue)

        expect(alwaysShoutFix.applied).toBe(true);
        expect(alwaysAskFix.applied).toBe(false);

        // @TODO note for future - this is a good example of infinite loop during naive
        // attempt to exhaustively apply all auto-fixes by reparsing until no fixes are available:
        // in first parsing and autofixing iteration, always-shout fix would append ! to the string
        // and always-ask would be skipped; after reparsing, always-shout would be satisfied
        // but always-ask would complain again, so its fix would append ?; in third iteration,
        // always-shout would again notice missing ! at the end etc.
        //
        // one idea other than simply placing a hard iteration limit is:
        // if during any iteration the rule did not produce a Result, this means that
        // any Results produced by it in subsequent iterations would only come from errors introduced
        // by errors in other Rules; hence, after no errors were found the Rule get disabled
        // for the subsequent iterations
        // or it could keep running (so that the final report would still contain a note about the issue)
        // but become banned from producing autofixes
    });

    test("StringFixerShouldNotApplyAnyCommandsOfASkippedFix", () => {
        expect.assertions(4);
        const subject = new IntermediateRepresentation({
            type: "string",
            sourceFile,
            ir: "abcdef",
        });
        const fixer = new StringFixer();

        // overlap

        // produced by rule "always ask"
        const alwaysAskFix = new StringFix(StringFixCommand.insertAfter(6, "?"));
        // produced by rule "always shout in Spanish"
        const alwaysShoutFix = new StringFix(StringFixCommand.insertAfter(0, "¡"), StringFixCommand.insertAfter(6, "!"));
        // produced by rule "uppercase B and D"
        const uppercaseSelectedFix = new StringFix(StringFixCommand.replaceAfter(1, 1, "B"), StringFixCommand.replaceAfter(3, 1, "D"));

        fixer.applyFixes(subject, [alwaysAskFix, alwaysShoutFix, uppercaseSelectedFix]);

        // Fixer cannot apply all fixes, because
        // there is partial command overlap between "always ask in Spanish" and "always shout";
        // since always shout came later, always ask should be applied fully, while always shout
        // should be skipped and none of its commands should be executed;
        // uppercase b and d should be applied because it has no overlap with other fixes

        expect(alwaysAskFix.applied).toBe(true);
        expect(alwaysShoutFix.applied).toBe(false);
        expect(uppercaseSelectedFix.applied).toBe(true);

        expect(subject.ir).toBe("aBcDef?");
    });
});
