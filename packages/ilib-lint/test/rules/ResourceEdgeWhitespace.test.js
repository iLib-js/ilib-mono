/*
 * ResourceEdgeWhitespace.test.js - test the leading and trailing whitespace
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
import { ResourceString } from 'ilib-tools-common';
import ResourceEdgeWhitespace from '../../src/rules/ResourceEdgeWhitespace.js';

import { IntermediateRepresentation, Result, SourceFile } from 'ilib-lint-common';

describe("testEdgeWhitespace", () => {
    test("ResourceEdgeWhitespaceEdgesMatch", () => {
        expect.assertions(2);

        const rule = new ResourceEdgeWhitespace();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "resource-edge-whitespace.both-edges-match",
            sourceLocale: "en-US",
            source: "Some source string. ",
            targetLocale: "de-DE",
            target: "Some target string. ",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };

        const result = rule.matchString(subject);
        expect(result).toBe(undefined); // for a valid resource match result should not be produced
    });

    test("ResourceEdgeWhitespaceLeadingSpaceMissing", () => {
        expect.assertions(2);

        const rule = new ResourceEdgeWhitespace();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "resource-edge-whitespace.leading-space-missing",
            sourceLocale: "en-US",
            source: " some source string.",
            targetLocale: "de-DE",
            target: "some target string.",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // accidentally ommited space in front of target string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);

        const fix = rule.fixer.createFix({
            resource,
            commands: [
                rule.fixer.createStringCommand(resource, 0, 0, " ")
            ]
        });
        expect(result).toStrictEqual(
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: " some source string.",
                id: "resource-edge-whitespace.leading-space-missing",
                description: "Leading whitespace in target does not match leading whitespace in source",
                highlight: `Source: <e0>⎵</e0>some… Target: <e1></e1>some…`,
                fix
            })
        );
    });

    test("ResourceEdgeWhitespaceLeadingSpaceExtra", () => {
        expect.assertions(2);

        const rule = new ResourceEdgeWhitespace();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "resource-edge-whitespace.leading-space-extra",
            sourceLocale: "en-US",
            source: "Some source string.",
            targetLocale: "de-DE",
            target: " Some target string.",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // accidentally added space in front of target string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);

        const fix = rule.fixer.createFix({
            resource,
            commands: [
                rule.fixer.createStringCommand(resource, 0, 1, "")
            ]
        });
        expect(result).toStrictEqual(
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: "Some source string.",
                id: "resource-edge-whitespace.leading-space-extra",
                description: "Leading whitespace in target does not match leading whitespace in source",
                highlight: `Source: <e0></e0>Some… Target: <e1>⎵</e1>Some…`,
                fix
            })
        );
    });

    test("ResourceEdgeWhitespaceTrailingSpaceMissing", () => {
        expect.assertions(2);

        const rule = new ResourceEdgeWhitespace();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "resource-edge-whitespace.trailing-space-missing",
            sourceLocale: "en-US",
            source: "Some source string ",
            targetLocale: "de-DE",
            target: "Some target string",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // accidentally ommited space in the end of target string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);

        const fix = rule.fixer.createFix({
            resource,
            commands: [
                rule.fixer.createStringCommand(resource, resource.getTarget().length, 0, " ")
            ]
        });
        expect(result).toStrictEqual(
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: "Some source string ",
                id: "resource-edge-whitespace.trailing-space-missing",
                description: "Trailing whitespace in target does not match trailing whitespace in source",
                highlight: `Source: …ring<e0>⎵</e0> Target: …ring<e1></e1>`,
                fix
            })
        );
    });

    test("ResourceEdgeWhitespaceTrailingSpaceExtra", () => {
        expect.assertions(2);

        const rule = new ResourceEdgeWhitespace();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "resource-edge-whitespace.trailing-space-extra",
            sourceLocale: "en-US",
            source: "Some source string.",
            targetLocale: "de-DE",
            target: "Some target string. ",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // accidentally added space in the end of target string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);

        const fix = rule.fixer.createFix({
            resource,
            commands: [
                rule.fixer.createStringCommand(resource, resource.getTarget().length - 1, 1, "")
            ]
        });
        expect(result).toStrictEqual(
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: "Some source string.",
                id: "resource-edge-whitespace.trailing-space-extra",
                description: "Trailing whitespace in target does not match trailing whitespace in source",
                highlight: `Source: …ing.<e0></e0> Target: …ing.<e1>⎵</e1>`,
                fix
            })
        );
    });

    test("ResourceEdgeWhitespaceTrailingSpaceExtraMore", () => {
        expect.assertions(2);

        const rule = new ResourceEdgeWhitespace();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "resource-edge-whitespace.trailing-space-extra-more",
            sourceLocale: "en-US",
            source: "Some source string ",
            targetLocale: "de-DE",
            target: "Some target string  ",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // accidentally added space in the end of target string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);

        const fix = rule.fixer.createFix({
            resource,
            commands: [
                rule.fixer.createStringCommand(resource, resource.getTarget().length - 2, 2, " ")
            ]
        });
        expect(result).toStrictEqual(
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: "Some source string ",
                id: "resource-edge-whitespace.trailing-space-extra-more",
                description: "Trailing whitespace in target does not match trailing whitespace in source",
                highlight: `Source: …ring<e0>⎵</e0> Target: …ring<e1>⎵⎵</e1>`,
                fix
            })
        );
    });

    test("ResourceEdgeWhitespaceBothEdgesSpaceMissing", () => {
        expect.assertions(2);

        const rule = new ResourceEdgeWhitespace();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "resource-edge-whitespace.both-spaces-missing",
            sourceLocale: "en-US",
            source: " some source string ",
            targetLocale: "de-DE",
            target: "some target string",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // accidentally ommited space in front and in the end of target string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);

        const fix1 = rule.fixer.createFix({
            resource,
            commands: [
                rule.fixer.createStringCommand(resource, 0, 0, " ")
            ]
        });
        const fix2 = rule.fixer.createFix({
            resource,
            commands: [
                rule.fixer.createStringCommand(resource, resource.getTarget().length, 0, " ")
            ]
        });
        expect(result).toStrictEqual([
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: " some source string ",
                id: "resource-edge-whitespace.both-spaces-missing",
                description: "Leading whitespace in target does not match leading whitespace in source",
                highlight: `Source: <e0>⎵</e0>some… Target: <e1></e1>some…`,
                fix: fix1
            }),
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: " some source string ",
                id: "resource-edge-whitespace.both-spaces-missing",
                description: "Trailing whitespace in target does not match trailing whitespace in source",
                highlight: `Source: …ring<e0>⎵</e0> Target: …ring<e1></e1>`,
                fix: fix2
            }),
        ]);
    });

    test("ResourceEdgeWhitespaceSpacesOnlyMatch", () => {
        expect.assertions(2);

        const rule = new ResourceEdgeWhitespace();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "resource-edge-whitespace.spaces-only-match",
            sourceLocale: "en-US",
            source: " ",
            targetLocale: "de-DE",
            target: " ",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // all-whitespace string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);
        expect(result).toBe(undefined); // for a valid resource match result should not be produced
    });

    test("ResourceEdgeWhitespaceSpacesOnlyExtra", () => {
        expect.assertions(2);

        const rule = new ResourceEdgeWhitespace();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "resource-edge-whitespace.spaces-only-extra",
            sourceLocale: "en-US",
            source: " ",
            targetLocale: "de-DE",
            target: "  ",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // all-whitespace string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);

        const fix = rule.fixer.createFix({
            resource,
            commands: [
                rule.fixer.createStringCommand(resource, 0, 2, " ")
            ]
        });
        expect(result).toStrictEqual(
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "de-DE",
                source: " ",
                id: "resource-edge-whitespace.spaces-only-extra",
                description: "Leading whitespace in target does not match leading whitespace in source",
                highlight: `Source: <e0>⎵</e0> Target: <e1>⎵⎵</e1>`,
                fix
            })
        );
    });

    test("ResourceEdgeWhitespaceUndefinedSource", () => {
        expect.assertions(2);

        const rule = new ResourceEdgeWhitespace();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "resource-edge-whitespace.undefined-source",
            sourceLocale: "en-US",
            source: undefined,
            targetLocale: "de-DE",
            target: " ",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // missing source
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);
        expect(result).toBe(undefined); // this rule should not process a resource where source is not a string
    });

    test("ResourceEdgeWhitespaceUndefinedTarget", () => {
        expect.assertions(2);

        const rule = new ResourceEdgeWhitespace();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "resource-edge-whitespace.undefined-target",
            sourceLocale: "en-US",
            source: " ",
            targetLocale: "de-DE",
            target: undefined,
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // missing target
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const result = rule.matchString(subject);
        expect(result).toBe(undefined); // this rule should not process a resource where target is not a string
    });

    test("ResourceEdgeWhitespace apply fix to leading and trailing space extra", () => {
        expect.assertions(6);

        const rule = new ResourceEdgeWhitespace();
        expect(rule).toBeTruthy();

        const resource = new ResourceString({
            key: "resource-edge-whitespace.trailing-space-extra",
            sourceLocale: "en-US",
            source: "Some source string.",
            targetLocale: "bn-IN",
            target: " র করতে পারেন। ",
            pathName: "resource-edge-whitespace-test.xliff",
            state: "translated",
        });
        const subject = {
            // accidentally added space in the end of target string
            source: resource.getSource(),
            target: resource.getTarget(),
            resource,
            file: "a/b/c.xliff"
        };
        const results = rule.matchString(subject);

        const fix1 = rule.fixer.createFix({
            resource,
            commands: [
                rule.fixer.createStringCommand(resource, 0, 1, "")
            ]
        });
        const fix2 = rule.fixer.createFix({
            resource,
            commands: [
                rule.fixer.createStringCommand(resource, resource.getTarget().length - 1, 1, "")
            ]
        });
        expect(results).toBeTruthy();
        expect(results).toStrictEqual([
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "bn-IN",
                source: "Some source string.",
                id: "resource-edge-whitespace.trailing-space-extra",
                description: "Leading whitespace in target does not match leading whitespace in source",
                highlight: `Source: <e0></e0>Some… Target: <e1>⎵</e1>র কর…`,
                fix: fix1
            }),
            new Result({
                rule,
                severity: "error",
                pathName: "a/b/c.xliff",
                locale: "bn-IN",
                source: "Some source string.",
                id: "resource-edge-whitespace.trailing-space-extra",
                description: "Trailing whitespace in target does not match trailing whitespace in source",
                highlight: `Source: …ing.<e0></e0> Target: …রেন।<e1>⎵</e1>`,
                fix: fix2
            })
        ]);
        const ir = new IntermediateRepresentation({
            type: "resource",
            ir: [resource],
            sourceFile: new SourceFile("a/b/c.xliff"),
            dirty: false
        });

        expect(rule.fixer.applyFixes(ir, results.map(result => result.fix))).toBe(true);
        const fixedResource = ir.getRepresentation()[0];
        expect(fixedResource).toBeTruthy();
        expect(fixedResource.getTarget()).toBe("র করতে পারেন।");
    });
});