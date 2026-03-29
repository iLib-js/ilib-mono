/*
 * ResourceStateChecker.test.js - test the rule that checks each resource's
 * state attribute
 *
 * Copyright © 2022-2025 JEDLSoft
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
import { ResourceArray, ResourcePlural, ResourceString } from 'ilib-tools-common';
import { Result, IntermediateRepresentation, SourceFile } from 'ilib-lint-common';

import ResourceStateChecker from '../../src/rules/ResourceStateChecker.js';
import ResourceFixer from '../../src/plugins/resource/ResourceFixer.js';

const sourceFile = new SourceFile("a/b/c.xliff", {});

// can be used with all tests below
const fixer = new ResourceFixer();

describe("testResourceStateChecker", () => {
    test("should not report error when resource has correct state", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker({ param: "translated" });
        expect(rule).toBeTruthy();

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {This is singular} other {This is plural}}',
                    targetLocale: "de-DE",
                    target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
                    pathName: "a/b/c.xliff",
                    state: "translated"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("should not report error when resource has one of multiple allowed states", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker({ param: [ "translated", "needs-review" ] });
        expect(rule).toBeTruthy();

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {This is singular} other {This is plural}}',
                    targetLocale: "de-DE",
                    target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
                    pathName: "a/b/c.xliff",
                    state: "needs-review"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("should report error when resource has wrong state", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker({ param: "translated" });
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            targetLocale: "de-DE",
            target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
            pathName: "a/b/c.xliff",
            state: "new"
        })
        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [resource],
                sourceFile
            })
        });
        const fix = ResourceFixer.createFix({
            resource,
            commands: [
                ResourceFixer.createMetadataCommand("state", "translated")
            ]
        });
        const expected = new Result({
            severity: "error",
            description: "Resources must have the following state: translated",
            id: "plural.test",
            highlight: 'Resource found with disallowed state: <e0>new</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            fix
        });
        expect(actual).toStrictEqual(expected);
    });

    test("should report error when resource has wrong state with multiple allowed states", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker({ param: [ "translated", "needs-review" ] });
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            targetLocale: "de-DE",
            target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
            pathName: "a/b/c.xliff",
            state: "new"
        });
        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [resource],
                sourceFile
            })
        });
        const fix = ResourceFixer.createFix({
            resource,
            commands: [
                ResourceFixer.createMetadataCommand("state", "translated")
            ]
        });
        const expected = new Result({
            severity: "error",
            description: "Resources must have one of the following states: translated, needs-review",
            id: "plural.test",
            highlight: 'Resource found with disallowed state: <e0>new</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            fix
        });
        expect(actual).toEqual(expected);
    });

    test("should not report error when resource has default translated state", () => {
        expect.assertions(2);

        // @ts-ignore
        const rule = new ResourceStateChecker();
        expect(rule).toBeTruthy();

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {This is singular} other {This is plural}}',
                    targetLocale: "de-DE",
                    target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
                    pathName: "a/b/c.xliff",
                    state: "translated"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("should report error when resource has wrong state with default configuration", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            targetLocale: "de-DE",
            target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
            pathName: "a/b/c.xliff",
            state: "new"
        });
        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [resource],
                sourceFile
            })
        });
        const fix = ResourceFixer.createFix({
            resource,
            commands: [
                ResourceFixer.createMetadataCommand("state", "translated")
            ]
        });
        const expected = new Result({
            severity: "error",
            description: "Resources must have the following state: translated",
            id: "plural.test",
            highlight: 'Resource found with disallowed state: <e0>new</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            fix
        });
        expect(actual).toStrictEqual(expected);
    });

    test("should report error when resource has no state", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker({ param: [ "translated" ] });
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            targetLocale: "de-DE",
            target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
            pathName: "a/b/c.xliff"
        });
        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [resource],
                sourceFile
            })
        });
        const fix = ResourceFixer.createFix({
            resource,
            commands: [
                ResourceFixer.createMetadataCommand("state", "translated")
            ]
        });
        const expected = new Result({
            severity: "error",
            description: "Resources must have the following state: translated",
            id: "plural.test",
            highlight: 'Resource found with no state.',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            fix
        });
        expect(actual).toStrictEqual(expected);
    });

    test("should apply fix to correct the state", () => {
        expect.assertions(4);

        const rule = new ResourceStateChecker({ param: "translated" });
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            targetLocale: "de-DE",
            target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
            pathName: "a/b/c.xliff",
            state: "new"
        });
        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [resource],
                sourceFile
            })
        });
        const fix = ResourceFixer.createFix({
            resource,
            commands: [
                ResourceFixer.createMetadataCommand("state", "translated")
            ]
        });
        const expected = new Result({
            severity: "error",
            description: "Resources must have the following state: translated",
            id: "plural.test",
            highlight: 'Resource found with disallowed state: <e0>new</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            fix
        });
        expect(actual).toStrictEqual(expected);

        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff"),
            dirty: false
        });

        fixer.applyFixes(ir, [actual.fix]);

        const fixedResource = ir.getRepresentation()[0];
        expect(fixedResource).toBeTruthy();
        expect(fixedResource.getState()).toBe("translated");
    });

    test("should not report error when resource has signed-off state", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker({ param: "signed-off" });
        expect(rule).toBeTruthy();

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {This is singular} other {This is plural}}',
                    targetLocale: "de-DE",
                    target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
                    pathName: "a/b/c.xliff",
                    state: "signed-off"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("should report error when resource has wrong state for signed-off configuration", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker({ param: "signed-off" });
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            targetLocale: "de-DE",
            target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
            pathName: "a/b/c.xliff",
            state: "translated"
        });
        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [resource],
                sourceFile
            })
        });
        const fix = ResourceFixer.createFix({
            resource,
            commands: [
                ResourceFixer.createMetadataCommand("state", "signed-off")
            ]
        });
        const expected = new Result({
            severity: "error",
            description: "Resources must have the following state: signed-off",
            id: "plural.test",
            highlight: 'Resource found with disallowed state: <e0>translated</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            fix
        });
        expect(actual).toStrictEqual(expected);
    });

    test("should not report error when resource has custom x-prefixed state", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker({ param: "x-custom-state" });
        expect(rule).toBeTruthy();

        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [new ResourceString({
                    key: "plural.test",
                    sourceLocale: "en-US",
                    source: '{count, plural, one {This is singular} other {This is plural}}',
                    targetLocale: "de-DE",
                    target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
                    pathName: "a/b/c.xliff",
                    state: "x-custom-state"
                })],
                sourceFile
            })
        });
        expect(!actual).toBeTruthy();
    });

    test("should report error when resource has wrong state for custom x-prefixed configuration", () => {
        expect.assertions(2);

        const rule = new ResourceStateChecker({ param: "x-custom-state" });
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "plural.test",
            sourceLocale: "en-US",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            targetLocale: "de-DE",
            target: "{count, plural, one {Dies ist einzigartig} other {Dies ist mehrerartig}}",
            pathName: "a/b/c.xliff",
            state: "translated"
        });
        const actual = rule.match({
            file: "a/b/c.xliff",
            ir: new IntermediateRepresentation({
                type: "resource",
                ir: [resource],
                sourceFile
            })
        });
        const fix = ResourceFixer.createFix({
            resource,
            commands: [
                ResourceFixer.createMetadataCommand("state", "x-custom-state")
            ]
        });
        const expected = new Result({
            severity: "error",
            description: "Resources must have the following state: x-custom-state",
            id: "plural.test",
            highlight: 'Resource found with disallowed state: <e0>translated</e0>',
            rule,
            pathName: "a/b/c.xliff",
            locale: "de-DE",
            source: '{count, plural, one {This is singular} other {This is plural}}',
            fix
        });
        expect(actual).toStrictEqual(expected);
    });

    test("should not accept invalid state with typo in constructor", () => {
        expect.assertions(1);

        // should throw when the state has a typo
        expect(() => {
            new ResourceStateChecker({ param: "translted" });
        }).toThrow('Invalid state "translted" in resource-state-checker configuration. Valid states are: accepted, approved, final, fuzzy, initial, needs-adaptation, needs-approval, needs-l10n, needs-review, needs-review-adaptation, needs-review-l10n, needs-review-translation, needs-translation, new, rejected, reviewed, signed-off, translated or custom states with "x-" prefix.');
    });

    test("should not accept invalid state with double x prefix in constructor", () => {
        expect.assertions(1);

        // should throw when the state has a double x prefix
        expect(() => {
            new ResourceStateChecker({ param: "xx-state" });
        }).toThrow('Invalid state "xx-state" in resource-state-checker configuration. Valid states are: accepted, approved, final, fuzzy, initial, needs-adaptation, needs-approval, needs-l10n, needs-review, needs-review-adaptation, needs-review-l10n, needs-review-translation, needs-translation, new, rejected, reviewed, signed-off, translated or custom states with "x-" prefix.');
    });

    test("should not accept unrecognized state in constructor", () => {
        expect.assertions(1);

        // should throw when the state is not recognized
        expect(() => {
            new ResourceStateChecker({ param: "mystate" });
        }).toThrow('Invalid state "mystate" in resource-state-checker configuration. Valid states are: accepted, approved, final, fuzzy, initial, needs-adaptation, needs-approval, needs-l10n, needs-review, needs-review-adaptation, needs-review-l10n, needs-review-translation, needs-translation, new, rejected, reviewed, signed-off, translated or custom states with "x-" prefix.');
    });

    test("should accept Mojito accepted state", () => {
        const checker = new ResourceStateChecker({ param: "accepted" });
        expect(checker.states).toEqual(["accepted"]);
    });

    test("should accept Mojito rejected state", () => {
        const checker = new ResourceStateChecker({ param: "rejected" });
        expect(checker.states).toEqual(["rejected"]);
    });

    test("should accept Mojito approved state", () => {
        const checker = new ResourceStateChecker({ param: "approved" });
        expect(checker.states).toEqual(["approved"]);
    });

    test("should accept Mojito needs-approval state", () => {
        const checker = new ResourceStateChecker({ param: "needs-approval" });
        expect(checker.states).toEqual(["needs-approval"]);
    });

    test("should accept array of Mojito states", () => {
        const checker = new ResourceStateChecker({ param: ["accepted", "rejected", "approved"] });
        expect(checker.states).toEqual(["accepted", "rejected", "approved"]);
    });
});
