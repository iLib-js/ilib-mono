/*
 * ResourceFix.test.js - test the resource fix
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

import { ResourceString, ResourcePlural, ResourceArray } from "ilib-tools-common";

import ResourceStringLocator from "../../../src/plugins/resource/ResourceStringLocator.js";

import ResourceFix from "../../../src/plugins/resource/ResourceFix.js";
import ResourceMetadataFixCommand from "../../../src/plugins/resource/ResourceMetadataFixCommand.js";
import ResourceStringFixCommand from "../../../src/plugins/resource/ResourceStringFixCommand.js";

describe("test ResourceFix", () => {
    test("ResourceFix basic constructor", () => {
        expect.assertions(2);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target",
        });
        const locator = new ResourceStringLocator(resource);

        const fix = new ResourceFix(locator, [new ResourceMetadataFixCommand({ name: "name", value: "value" })]);

        expect(fix).toBeDefined();
        expect(fix.type).toBe("resource");
    });

    test("ResourceFix constructor with no commands", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target",
        });
        const locator = new ResourceStringLocator(resource);

        // should throw an error if no commands are provided
        expect(() => {
            const fix = new ResourceFix(locator, []);
        }).toThrow();
    });

    test("ResourceFix constructor with no locator", () => {
        expect.assertions(1);

        // should throw an error if no locator is provided
        expect(() => {
            // @ts-ignore
            const fix = new ResourceFix(null, [new ResourceMetadataFixCommand({ name: "name", value: "value" })]);
        }).toThrow();
    });

    test("ResourceFix create a fix with a plural resource", () => {
        expect.assertions(2);

        const resource = new ResourcePlural({
            key: "key",
            source: {
                one: "singular",
                other: "plural",
            },
            target: {
                one: "einsellig",
                other: "mehrzellig",
            },
        });
        const locator = new ResourceStringLocator(resource, undefined, "one");

        const fix = new ResourceFix(locator, [new ResourceMetadataFixCommand({ name: "name", value: "value" })]);

        expect(fix).toBeDefined();
        expect(fix.type).toBe("resource");
    });

    test("ResourceFix create a fix with an array resource", () => {
        expect.assertions(2);

        const resource = new ResourceArray({
            key: "key",
            source: ["one", "two"],
            target: ["uno", "dos"],
        });
        const locator = new ResourceStringLocator(resource, undefined, undefined, 1);

        const fix = new ResourceFix(locator, [new ResourceMetadataFixCommand({ name: "name", value: "value" })]);

        expect(fix).toBeDefined();
        expect(fix.type).toBe("resource");
    });

    test("ResourceFix return the locator correctly", () => {
        expect.assertions(2);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target",
        });
        const locator = new ResourceStringLocator(resource);

        const fix = new ResourceFix(locator, [new ResourceMetadataFixCommand({ name: "name", value: "value" })]);

        expect(fix).toBeDefined();
        expect(fix.locator).toBe(locator);
    });

    test("ResourceFix return the commands correctly", () => {
        expect.assertions(2);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target",
        });
        const locator = new ResourceStringLocator(resource);

        const command = new ResourceMetadataFixCommand({
            name: "name",
            value: "value",
        });
        const fix = new ResourceFix(locator, [command]);

        expect(fix).toBeDefined();
        expect(fix.commands).toHaveLength(1);
    });

    test("ResourceFix return multiple commands correctly", () => {
        expect.assertions(5);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target",
        });
        const locator = new ResourceStringLocator(resource);

        const command1 = new ResourceMetadataFixCommand({
            name: "name",
            value: "value",
        });
        const command2 = ResourceStringFixCommand.replaceAfter(0, 2, "b");
        const command3 = new ResourceMetadataFixCommand({
            name: "otherName",
            value: "otherValue",
        });
        const fix = new ResourceFix(locator, [command1, command2, command3]);

        expect(fix).toBeDefined();
        const commands = fix.commands;
        expect(commands).toHaveLength(3);
        expect(commands[0]).toBe(command1);
        expect(commands[1]).toBe(command2);
        expect(commands[2]).toBe(command3);
    });

    test("ResourceFix create a fix with overlapping metadata commands", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target",
        });
        const locator = new ResourceStringLocator(resource);
        const command1 = new ResourceMetadataFixCommand({
            name: "name",
            value: "value",
        });
        const command2 = new ResourceMetadataFixCommand({
            name: "name",
            value: "value",
        });
        expect(() => {
            const fix = new ResourceFix(locator, [command1, command2]);
        }).toThrow("Cannot create a fix because some of the commands overlap with each other");
    });

    test("ResourceFix create a fix with overlapping string commands", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target",
        });
        const locator = new ResourceStringLocator(resource);
        const command1 = ResourceStringFixCommand.replaceAfter(0, 2, "b");
        const command2 = ResourceStringFixCommand.replaceAfter(1, 2, "x");
        expect(() => {
            const fix = new ResourceFix(locator, [command1, command2]);
        }).toThrow("Cannot create a fix because some of the commands overlap with each other");
    });

    test("ResourceFix correctly detects overlapping metadata fixes", () => {
        expect.assertions(3);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target",
        });
        const locator = new ResourceStringLocator(resource);
        const command1 = new ResourceMetadataFixCommand({
            name: "name",
            value: "value",
        });
        const command2 = new ResourceMetadataFixCommand({
            name: "name",
            value: "value",
        });

        const fix1 = new ResourceFix(locator, [command1]);
        const fix2 = new ResourceFix(locator, [command2]);

        expect(fix1).toBeDefined();
        expect(fix2).toBeDefined();

        expect(fix1.overlaps(fix2)).toBe(true);
    });

    test("ResourceFix correctly detects overlapping string fixes", () => {
        expect.assertions(3);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target",
        });
        const locator = new ResourceStringLocator(resource);
        const command1 = ResourceStringFixCommand.replaceAfter(0, 2, "b");
        const command2 = ResourceStringFixCommand.replaceAfter(1, 2, "x");

        const fix1 = new ResourceFix(locator, [command1]);
        const fix2 = new ResourceFix(locator, [command2]);

        expect(fix1).toBeDefined();
        expect(fix2).toBeDefined();

        expect(fix1.overlaps(fix2)).toBe(true);
    });

    test("ResourceFix detects no overlap between metadata and string fixes", () => {
        expect.assertions(3);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target",
        });
        const locator = new ResourceStringLocator(resource);
        const command1 = new ResourceMetadataFixCommand({
            name: "name",
            value: "value",
        });
        const command2 = ResourceStringFixCommand.replaceAfter(0, 2, "b");

        const fix1 = new ResourceFix(locator, [command1]);
        const fix2 = new ResourceFix(locator, [command2]);

        expect(fix1).toBeDefined();
        expect(fix2).toBeDefined();

        expect(fix1.overlaps(fix2)).toBe(false);
    });

    test("ResourceFix detects no overlap between two different metadata fixes", () => {
        expect.assertions(3);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target",
        });
        const locator = new ResourceStringLocator(resource);
        const command1 = new ResourceMetadataFixCommand({
            name: "name",
            value: "value",
        });
        const command2 = new ResourceMetadataFixCommand({
            name: "otherName",
            value: "otherValue",
        });

        const fix1 = new ResourceFix(locator, [command1]);
        const fix2 = new ResourceFix(locator, [command2]);

        expect(fix1).toBeDefined();
        expect(fix2).toBeDefined();

        expect(fix1.overlaps(fix2)).toBe(false);
    });

    test("ResourceFix detects no overlap between two different string fixes", () => {
        expect.assertions(3);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target",
        });
        const locator = new ResourceStringLocator(resource);
        const command1 = ResourceStringFixCommand.replaceAfter(0, 2, "b");
        const command2 = ResourceStringFixCommand.replaceAfter(2, 2, "x");

        const fix1 = new ResourceFix(locator, [command1]);
        const fix2 = new ResourceFix(locator, [command2]);

        expect(fix1).toBeDefined();
        expect(fix2).toBeDefined();

        expect(fix1.overlaps(fix2)).toBe(false);
    });
});
