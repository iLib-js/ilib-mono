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

import { ResourceString, ResourcePlural, ResourceArray } from 'ilib-tools-common';

import ResourceStringLocator from "../../../src/plugins/resource/ResourceStringLocator.js";

import ResourceFixer from "../../../src/plugins/resource/ResourceFixer.js";
import ResourceFix from "../../../src/plugins/resource/ResourceFix.js";
import ResourceFixCommand from "../../../src/plugins/resource/ResourceFixCommand.js";
import ResourceMetadataFixCommand from '../../../src/plugins/resource/ResourceMetadataFixCommand.js';
import ResourceStringFixCommand from '../../../src/plugins/resource/ResourceStringFixCommand.js';

describe("test ResourceFix", () => {
    test("ResourceFix basic constructor", () => {
        expect.assertions(2);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);

        const fix = new ResourceFix(locator, []);

        expect(fix).toBeDefined();
        expect(fix.getType()).toBe("resource");
    });

    test("ResourceFix create a fix with a plural resource", () => {
        expect.assertions(2);

        const resource = new ResourcePlural({
            key: "key",
            source: {
                one: "singular",
                other: "plural"
            },
            target: {
                one: "einsellig",
                other: "mehrzellig"
            },
        });
        const locator = new ResourceStringLocator(resource, undefined, "one");

        const fix = new ResourceFix(locator, []);

        expect(fix).toBeDefined();
        expect(fix.getType()).toBe("resource");
    });

    test("ResourceFix create a fix with an array resource", () => {
        expect.assertions(2);

        const resource = new ResourceArray({
            key: "key",
            source: ["one", "two"],
            target: ["uno", "dos"],
        });
        const locator = new ResourceStringLocator(resource, undefined, undefined, 1);

        const fix = new ResourceFix(locator, []);

        expect(fix).toBeDefined();
        expect(fix.getType()).toBe("resource");
    });

    test("ResourceFix return the locator correctly", () => {
        expect.assertions(2);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);

        const fix = new ResourceFix(locator, []);

        expect(fix).toBeDefined();
        expect(fix.getLocator()).toBe(locator);
    });

    test("ResourceFix return the commands correctly", () => {
        expect.assertions(2);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);

        const command = new ResourceMetadataFixCommand({
            locator,
            name: "name",
            value: "value"
        });
        const fix = new ResourceFix(locator, [command]);

        expect(fix).toBeDefined();
        expect(fix.getCommands()).toHaveLength(1);
    });

    test("ResourceFix create a fix with overlapping metadata commands", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);
        const command1 = new ResourceMetadataFixCommand({
            locator,
            name: "name",
            value: "value"
        });
        const command2 = new ResourceMetadataFixCommand({
            locator,
            name: "name",
            value: "value"
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
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);
        const command1 = new ResourceStringFixCommand({
            locator,
            position: 0,
            deleteCount: 2,
            insertContent: "b"
        });
        const command2 = new ResourceStringFixCommand({
            locator,
            position: 1,
            deleteCount: 2,
            insertContent: "x"
        });
        expect(() => {
            const fix = new ResourceFix(locator, [command1, command2]);
        }).toThrow("Cannot create a fix because some of the commands overlap with each other");
    });

    test("ResourceFix correctly detects overlapping metadata fixes", () => {
        expect.assertions(3);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);
        const command1 = new ResourceMetadataFixCommand({
            locator,
            name: "name",
            value: "value"
        });
        const command2 = new ResourceMetadataFixCommand({
            locator,
            name: "name",
            value: "value"
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
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);
        const command1 = new ResourceStringFixCommand({
            locator,
            position: 0,
            deleteCount: 2,
            insertContent: "b"
        });
        const command2 = new ResourceStringFixCommand({
            locator,
            position: 1,
            deleteCount: 2,
            insertContent: "x"
        });

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
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);
        const command1 = new ResourceMetadataFixCommand({
            locator,
            name: "name",
            value: "value"
        });
        const command2 = new ResourceStringFixCommand({
            locator,
            position: 0,
            deleteCount: 2,
            insertContent: "b"
        });

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
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);
        const command1 = new ResourceMetadataFixCommand({
            locator,
            name: "name",
            value: "value"
        });
        const command2 = new ResourceMetadataFixCommand({
            locator,
            name: "otherName",
            value: "otherValue"
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
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);
        const command1 = new ResourceStringFixCommand({
            locator,
            position: 0,
            deleteCount: 2,
            insertContent: "b"
        });
        const command2 = new ResourceStringFixCommand({
            locator,
            position: 2,
            deleteCount: 2,
            insertContent: "x"
        });

        const fix1 = new ResourceFix(locator, [command1]);
        const fix2 = new ResourceFix(locator, [command2]);

        expect(fix1).toBeDefined();
        expect(fix2).toBeDefined();

        expect(fix1.overlaps(fix2)).toBe(false);
    });

    test("ResourceFix detects no overlap between two fixes for different locators", () => {
        expect.assertions(3);

        const resource1 = new ResourceString({
            key: "key1",
            source: "source1",
            target: "target1"
        });
        const locator1 = new ResourceStringLocator(resource1);
        const command1 = new ResourceMetadataFixCommand({
            locator: locator1,
            name: "name",
            value: "value"
        });

        const resource2 = new ResourceString({
            key: "key2",
            source: "source2",
            target: "target2"
        });
        const locator2 = new ResourceStringLocator(resource2);
        const command2 = new ResourceMetadataFixCommand({
            locator: locator2,
            name: "name",
            value: "value"
        });

        const fix1 = new ResourceFix(locator1, [command1]);
        const fix2 = new ResourceFix(locator2, [command2]);

        expect(fix1).toBeDefined();
        expect(fix2).toBeDefined();

        expect(fix1.overlaps(fix2)).toBe(false);
    });
});