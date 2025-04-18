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
});