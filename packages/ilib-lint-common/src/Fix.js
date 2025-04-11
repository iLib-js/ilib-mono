/*
 * Fix.js
 *
 * Copyright © 2022 JEDLSoft
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

/**
 * @class Container object through which {@link Rule} can pass
 * instructions (of any kind) which a corresponding {@link Fixer}
 * should follow while modifying the {@link IntermediateRepresentation}
 * to remediate the issue.
 * @abstract
 */
class Fix {
    /**
     * A subclass of Fix can contain any properties - it is up to
     * the corresponding Fixer (i.e. with a matching {@link Fix.type})
     * to interpret them appropriately and apply them
     * to the IntermediateRepresentation.
     *
     * Due to that, a recommended approach is that the Fixer
     * should also be a Fix factory, so that the Rule
     * could only express the Fix instructions with
     * capabilities that the Fixer provides.
     *
     * Example scenario:
     *
     * Take an IntermediateRepresentation with type `string`
     * which stores content of a file verbatim:
     *
     * ```text
     * birds are not real birds are not real birds are not real
     * ```
     *
     * and a Rule (type `string`) which ensures that the word `birds`
     * should always be surrounded by quotes.
     *
     * Rule would produce the following results:
     * 1. birds are not quoted (span 0 - 5)
     * 2. birds are not quoted (span 19 - 24)
     * 3. birds are not quoted (span 38 - 43)
     *
     * To fix each of them, quotes need to be inserted:
     * 1. fix: insert quote at 0 and 5
     * 2. fix: insert quote at 19 and 24
     * 3. fix: insert quote at 38 and 43
     *
     * If there are no Fix and Fixer with type `string`,
     * they could be implemented like in the following example:
     *
     * ```js
     * class StringFixCommand {
     *     commandId;
     *     position;
     * }
     *
     * class InsertCommand extends StringFixCommand {
     *     commandId = "INSERT";
     *     content;
     * }
     *
     * class RemoveCommand extends StringFixCommand {
     *     commandId = "REMOVE";
     *     length;
     * }
     *
     * class StringFix extends Fix {
     *     commands; // StringFixCommand[]
     * }
     *
     * class StringFixer {
     *     applyFixes(representation, fixes) {} // applyFixes(representation: IntermediateRepresentation, fixes: StringFix[]): void
     *     createFix(commands) {}               // createFix(commands: StringFixCommand[]): StringFix
     *     insertStringAt(position, content) {} // insertStringAt(position: number, content: string): InsertCommand
     *     removeStringAt(position, length) {}  // removeStringAt(position: number, length: number): RemoveCommand
     * }
     * ```
     *
     * Rule should then accept an instance of a StringFixer,
     * and for each produced result provide a fix:
     *
     * ```
     * new Result({
     *     // ...
     *     fix: fixer.createFix([fixer.insertStringAt(0, "\""), fixer.insertStringAt(5, "\"")])
     * });
     * ```
     *
     * So that the linter could call
     * ```
     * fixer.applyFixes(ir, results.map(r => r.fix))
     * ```
     * @abstract
     * @constructor
     */
    constructor() {}

    /**
     * Unique identifier which allows to dynamically match
     * the Fix to its corresponding Fixer and IntermediateRepresentation
     * onto which it should be applied.
     *
     * Subclass must define this property.
     * @readonly
     * @type {string}
     * @abstract
     */
    // @ts-expect-error: subclass must define this property
    type;

    /**
     * If the fix had been applied by the fixer.
     * Fixer is expected to set this flag after it had applied the fix.
     *
     * @type {boolean}
     */
    applied = false;
}

export default Fix;
