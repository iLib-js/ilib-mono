/*
 * ResourceFixer.test.js - test the fixer for resource files
 *
 * Copyright © 2025 JEDLSoft
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

import { ResourceString, ResourcePlural, ResourceArray } from 'ilib-tools-common';

import { IntermediateRepresentation, SourceFile } from "ilib-lint-common";

import ResourceStringLocator from "../../../src/plugins/resource/ResourceStringLocator.js";

import ResourceFixer from "../../../src/plugins/resource/ResourceFixer.js";
import ResourceFix from "../../../src/plugins/resource/ResourceFix.js";
import ResourceFixCommand from "../../../src/plugins/resource/ResourceFixCommand.js";
import ResourceMetadataFixCommand from '../../../src/plugins/resource/ResourceMetadataFixCommand.js';
import ResourceStringFixCommand from '../../../src/plugins/resource/ResourceStringFixCommand.js';

describe("test ResourceFixer", () => {
    test("ResourceFixer basic constructor", () => {
        expect.assertions(3);

        const fixer = new ResourceFixer();

        expect(fixer).toBeDefined();
        expect(fixer).toBeInstanceOf(ResourceFixer);
        expect(fixer.getType()).toBe("resource");
    });

    test("ResourceFixer create a fix", () => {
        expect.assertions(3);

        const fixer = new ResourceFixer();

        const fix = fixer.createFix({
            resource: new ResourceString({
                key: "key",
                source: "source",
                target: "target"
            }),
            commands: []
        });

        expect(fix).toBeDefined();
        expect(fix).toBeInstanceOf(ResourceFix);
        expect(fix.getCommands()).toHaveLength(0);
    });

    test("ResourceFixer create a fix with a plural resource", () => {
        expect.assertions(3);

        const fixer = new ResourceFixer();

        const fix = fixer.createFix({
            resource: new ResourcePlural({
                key: "key",
                source: {
                    one: "singular",
                    other: "plural"
                },
                target: {
                    one: "Zingular",
                    other: "Zplural"
                },
            }),
            category: "one",
            commands: []
        });

        expect(fix).toBeDefined();
        expect(fix).toBeInstanceOf(ResourceFix);
        expect(fix.getCommands()).toHaveLength(0);
    });

    test("ResourceFixer create a fix with an array resource", () => {
        expect.assertions(3);

        const fixer = new ResourceFixer();

        const fix = fixer.createFix({
            resource: new ResourceArray({
                key: "key",
                source: ["one", "two"],
                target: ["Zone", "Ztwo"]
            }),
            index: 1,
            commands: []
        });

        expect(fix).toBeDefined();
        expect(fix).toBeInstanceOf(ResourceFix);
        expect(fix.getCommands()).toHaveLength(0);
    });

    test("ResourceFixer create a fix with multiple commands", () => {
        expect.assertions(4);

        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });

        const fix = fixer.createFix({
            resource,
            commands: [
                fixer.createMetadataCommand(resource, "targetLocale", "de-DE"),
                fixer.createStringCommand(resource, 0, 2, "b", undefined, undefined, true)
            ]
        });
        expect(fix).toBeDefined();

        const commands = fix.getCommands();
        expect(commands).toHaveLength(2);
        expect(commands[0]).toBeInstanceOf(ResourceMetadataFixCommand);
        expect(commands[1]).toBeInstanceOf(ResourceStringFixCommand);
    });

    test("ResourceFixer create a fix with a command for the wrong resource", () => {
        expect.assertions(1);

        const fixer = new ResourceFixer();

        const resource1 = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const resource2 = new ResourceString({
            key: "key2",
            source: "source2",
            target: "target2"
        });

        expect(() => {
            const fix = fixer.createFix({
                resource: resource1,
                commands: [
                    fixer.createMetadataCommand(resource2, "targetLocale", "de-DE"),
                    fixer.createStringCommand(resource1, 0, 2, "b", undefined, undefined, true)
                ]
            });
        }).toThrow("All commands in a ResourceFix must apply to the same resource instance");
    });

    test("ResourceFixer create a fix with overlapping commands", () => {
        expect.assertions(1);

        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });

        expect(() => {
            fixer.createFix({
                resource,
                commands: [
                    fixer.createStringCommand(resource, 1, 2, "x"),
                    fixer.createStringCommand(resource, 0, 2, "b")
                ]
            });
        }).toThrow("Cannot create a fix because some of the commands overlap with each other");
    });

    test("ResourceFixer apply fixes", () => {
        expect.assertions(6);

        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });

        const source = new SourceFile("test.xliff", {
            sourceLocale: "en-US",
            type: "resource"
        });

        const ir = new IntermediateRepresentation({
            sourceFile: source,
            type: "resource",
            ir: [resource],
            dirty: false
        });

        const fix = fixer.createFix({
            resource,
            commands: [
                fixer.createMetadataCommand(resource, "targetLocale", "de-DE"),
                fixer.createStringCommand(resource, 0, 2, "fo", undefined, undefined, true)
            ]
        });

        fixer.applyFixes(ir, [fix]);

        // these things should have been applied to the resource
        expect(resource.getTarget()).toBe("forget");
        expect(resource.getTargetLocale()).toBe("de-DE");
        expect(resource.isDirty()).toBe(true);

        // these things should be the same as before
        expect(resource.getSource()).toBe("source");
        expect(resource.getSourceLocale()).toBe("en-US");
        expect(resource.getKey()).toBe("key");
    });

    test("ResourceFixer apply multiple fixes", () => {
        expect.assertions(6);

        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });

        const source = new SourceFile("test.xliff", {
            sourceLocale: "en-US",
            type: "resource"
        });

        const ir = new IntermediateRepresentation({
            sourceFile: source,
            type: "resource",
            ir: [resource],
            dirty: false
        });

        const fix1 = fixer.createFix({
            resource,
            commands: [
                fixer.createMetadataCommand(resource, "targetLocale", "de-DE"),
                fixer.createStringCommand(resource, 0, 2, "fo", undefined, undefined, true)
            ]
        });

        const fix2 = fixer.createFix({
            resource,
            commands: [
                fixer.createMetadataCommand(resource, "sourceLocale", "en"),
                fixer.createStringCommand(resource, 4, 1, "o", undefined, undefined, true),
                fixer.createStringCommand(resource, 6, 0, "ten", undefined, undefined, true)
            ]
        });

        fixer.applyFixes(ir, [fix1, fix2]);

        // these things should have been applied to the resource
        expect(resource.getTarget()).toBe("forgotten");
        expect(resource.getTargetLocale()).toBe("de-DE");
        expect(resource.getSourceLocale()).toBe("en");
        expect(resource.isDirty()).toBe(true);

        // these things should be the same as before
        expect(resource.getSource()).toBe("source");
        expect(resource.getKey()).toBe("key");
    });

    test("ResourceFixer apply fixes but not the overlapping commands within them", () => {
        expect.assertions(6);

        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });

        const source = new SourceFile("test.xliff", {
            sourceLocale: "en-US",
            type: "resource"
        });

        const ir = new IntermediateRepresentation({
            sourceFile: source,
            type: "resource",
            ir: [resource],
            dirty: false
        });

        const fix1 = fixer.createFix({
            resource,
            commands: [
                fixer.createMetadataCommand(resource, "targetLocale", "de-DE"),
                fixer.createStringCommand(resource, 0, 2, "fo", undefined, undefined, true)
            ]
        });

        const fix2 = fixer.createFix({
            resource,
            commands: [
                fixer.createMetadataCommand(resource, "sourceLocale", "en"),
                // this first string command overlaps with the first fix so it should not be applied
                fixer.createStringCommand(resource, 0, 2, "x", undefined, undefined, true),
                fixer.createStringCommand(resource, 4, 1, "o", undefined, undefined, true),
                fixer.createStringCommand(resource, 6, 0, "ten", undefined, undefined, true),
            ]
        });

        // the second fix has overlapping commands with the first one
        fixer.applyFixes(ir, [fix1, fix2]);

        // these things should have been applied to the resource
        expect(resource.getTarget()).toBe("forgotten");
        expect(resource.getTargetLocale()).toBe("de-DE");
        expect(resource.getSourceLocale()).toBe("en");
        expect(resource.isDirty()).toBe(true);

        // these things should be the same as before
        expect(resource.getSource()).toBe("source");
        expect(resource.getKey()).toBe("key");
    });

    test("ResourceFixer apply fixes and make sure commands have the right applied flags afterwards", () => {
        expect.assertions(6);

        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });

        const source = new SourceFile("test.xliff", {
            sourceLocale: "en-US",
            type: "resource"
        });

        const ir = new IntermediateRepresentation({
            sourceFile: source,
            type: "resource",
            ir: [resource],
            dirty: false
        });

        const fix1 = fixer.createFix({
            resource,
            commands: [
                fixer.createMetadataCommand(resource, "targetLocale", "de-DE"),
                fixer.createStringCommand(resource, 0, 2, "fo", undefined, undefined, true)
            ]
        });

        const fix2 = fixer.createFix({
            resource,
            commands: [
                fixer.createMetadataCommand(resource, "sourceLocale", "en"),
                // this first string command overlaps with the first fix so it should not be applied
                fixer.createStringCommand(resource, 0, 2, "x", undefined, undefined, true),
                fixer.createStringCommand(resource, 4, 1, "o", undefined, undefined, true),
                fixer.createStringCommand(resource, 6, 0, "ten", undefined, undefined, true),
            ]
        });

        // the second fix has overlapping commands with the first one
        fixer.applyFixes(ir, [fix1, fix2]);

        const fix1commands = fix1.getCommands();
        expect(fix1commands[0].getApplied()).toBe(true); // metadata command
        expect(fix1commands[1].getApplied()).toBe(true); // string command

        const fix2commands = fix2.getCommands();
        expect(fix2commands[0].getApplied()).toBe(true); // metadata command
        expect(fix2commands[1].getApplied()).toBe(false); // overlapping string command
        expect(fix2commands[2].getApplied()).toBe(true); // string command
        expect(fix2commands[3].getApplied()).toBe(true); // string command
    });

    test("ResourceFixer apply fixes but make sure it skips already-applied commands", () => {
        expect.assertions(6);

        const fixer = new ResourceFixer();

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });

        const source = new SourceFile("test.xliff", {
            sourceLocale: "en-US",
            type: "resource"
        });

        const ir = new IntermediateRepresentation({
            sourceFile: source,
            type: "resource",
            ir: [resource],
            dirty: false
        });

        const fix1 = fixer.createFix({
            resource,
            commands: [
                fixer.createMetadataCommand(resource, "targetLocale", "de-DE"),
                fixer.createStringCommand(resource, 0, 2, "fo", undefined, undefined, true)
            ]
        });

        const fix1commands = fix1.getCommands();
        // mark the first command (the metadata one) as already applied so it should not get applied again
        fix1commands[0].setApplied(true);

        const fix2 = fixer.createFix({
            resource,
            commands: [
                fixer.createMetadataCommand(resource, "sourceLocale", "en"),
                // this first string command overlaps with a command in the first fix so it should not be applied
                fixer.createStringCommand(resource, 0, 2, "x", undefined, undefined, true),
                fixer.createStringCommand(resource, 4, 1, "o", undefined, undefined, true),
                fixer.createStringCommand(resource, 6, 0, "ten", undefined, undefined, true),
            ]
        });

        const fix2commands = fix2.getCommands();
        // mark the last command (the string one) as already applied so it should not get applied again
        fix2commands[3].setApplied(true);

        // fixes are applied to the IR iteratively, so we don't want to reapply the already-applied commands
        fixer.applyFixes(ir, [fix1, fix2]);

        // these things should have been applied to the resource
        expect(resource.getTarget()).toBe("forgot");
        expect(resource.getSourceLocale()).toBe("en");
        expect(resource.isDirty()).toBe(true);

        // these things should be the same as before
        expect(resource.getSource()).toBe("source");
        expect(resource.getKey()).toBe("key");
        expect(resource.getTargetLocale()).toBeUndefined();
    });

});