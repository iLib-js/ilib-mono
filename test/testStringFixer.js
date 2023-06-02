/*
 * testStringFixer.js
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

import { IntermediateRepresentation } from "i18nlint-common";
import StringFixer from "../src/plugins/string/StringFixer.js";
import StringFix from "../src/plugins/string/StringFix.js";
import StringFixCommand from "../src/plugins/string/StringFixCommand.js";

export const testStringFixer = {
    stringFixerShouldReplace: function (test) {
        test.expect(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            filePath: "test/file.txt",
            ir: "abcdef",
        });
        const fixer = new StringFixer();
        const fix = new StringFix(StringFixCommand.replaceAfter(2, 1, "C"));
        fixer.applyFixes(subject, [fix]);
        test.equal(subject.ir, "abCdef");
        test.done();
    },
    
    stringFixerShouldInsert: function (test) {
        test.expect(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            filePath: "test/file.txt",
            ir: "abcdef",
        });
        const fixer = new StringFixer();
        const fix = new StringFix(StringFixCommand.insertAfter(2, "!"));
        fixer.applyFixes(subject, [fix]);
        test.equal(subject.ir, "ab!cdef");
        test.done();
    },

    stringFixerShouldDelete: function (test) {
        test.expect(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            filePath: "test/file.txt",
            ir: "abcdef",
        });
        const fixer = new StringFixer();
        const fix = new StringFix(StringFixCommand.deleteAfter(2, 1));
        fixer.applyFixes(subject, [fix]);
        test.equal(subject.ir, "abdef");
        test.done();
    },

    stringFixerShouldReplaceMultiple: function (test) {
        test.expect(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            filePath: "test/file.txt",
            ir: "abcdef",
        });
        const fixer = new StringFixer();
        // produced by rule "uppercase the vowels"
        const fix = new StringFix(StringFixCommand.replaceAfter(0, 1, "A"), StringFixCommand.replaceAfter(4, 1, "E"));
        fixer.applyFixes(subject, [fix]);
        test.equal(subject.ir, "AbcdEf");
        test.done();
    },

    stringFixerShouldInsertMultiple: function (test) {
        test.expect(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            filePath: "test/file.txt",
            ir: "abcdef",
        });
        const fixer = new StringFixer();
        // produced by rule "always quote"
        const fix = new StringFix(StringFixCommand.insertAfter(0, "\""), StringFixCommand.insertAfter(6, "\""));
        fixer.applyFixes(subject, [fix]);
        test.equal(subject.ir, "\"abcdef\"");
        test.done();
    },

    stringFixerShouldDeleteMultiple: function (test) {
        test.expect(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            filePath: "test/file.txt",
            ir: "abcdef",
        });
        const fixer = new StringFixer();
        // produced by rule "disallow vowels"
        const fix = new StringFix(StringFixCommand.deleteAfter(0, 1), StringFixCommand.deleteAfter(4, 1));
        fixer.applyFixes(subject, [fix]);
        test.equal(subject.ir, "bcdf");
        test.done();
    },

    stringFixerShouldFixMultipleFixes: function (test) {
        test.expect(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            filePath: "test/file.txt",
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
        test.equal(subject.ir, "Abcdef!");
        test.done();
    },

    stringFixerShouldFixMultipleFixesMultipleCommands: function (test) {
        test.expect(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            filePath: "test/file.txt",
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
        test.equal(subject.ir, "\"bcdf\"");
        test.done();
    },

    stringFixerShouldFlagAppliedFixes: function (test) {
        test.expect(1);
        const subject = new IntermediateRepresentation({
            type: "string",
            filePath: "test/file.txt",
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
        test.equal(fixes.every(f => f.applied), true);
        test.done();
    },

    stringFixerShouldSkipOverlappingFix: function (test) {
        test.expect(2);
        const subject = new IntermediateRepresentation({
            type: "string",
            filePath: "test/file.txt",
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
        
        test.equal(alwaysShoutFix.applied, true);
        test.equal(alwaysAskFix.applied, false);

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

        test.done();
    },
};
