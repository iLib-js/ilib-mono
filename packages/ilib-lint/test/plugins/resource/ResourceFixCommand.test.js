/*
 * ResourceFixCommand.test.js - test the resource fix commands and its subclasses
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

import ResourceMetadataFixCommand from '../../../src/plugins/resource/ResourceMetadataFixCommand.js';
import ResourceStringFixCommand from '../../../src/plugins/resource/ResourceStringFixCommand.js';

describe("test ResourceMetadataFixCommand", () => {
    test("ResourceMetadataFixCommand basic constructor", () => {
        expect.assertions(3);

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

        expect(command).toBeDefined();
        expect(command.name).toBe("name");
        expect(command.value).toBe("value");
    });

    test("ResourceMetadataFixCommand constructor with no locator", () => {
        expect.assertions(1);

        expect(() => {
            // @ts-ignore
            new ResourceMetadataFixCommand({
                name: "name",
                value: "value"
            });
        }).toThrow();
    });

    test("ResourceMetadataFixCommand constructor with no name", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);

        expect(() => {
            // @ts-ignore
            new ResourceMetadataFixCommand({
                locator,
                value: "value"
            });
        }).toThrow();
    });

    test("ResourceMetadataFixCommand applying the fix works", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);
        const command = new ResourceMetadataFixCommand({
            locator,
            name: "targetLocale",
            value: "de-DE"
        });

        command.apply();
        expect(resource.getTargetLocale()).toBe("de-DE");
    });
});

describe("test ResourceStringFixCommand", () => {
    test("ResourceStringFixCommand basic constructor", () => {
        expect.assertions(6);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);
        const command = new ResourceStringFixCommand({
            locator,
            position: 0,
            deleteCount: 0,
            insertContent: "content"
        });

        expect(command).toBeDefined();
        expect(command.getLocator()).toBe(locator);

        const stringFixCommand = command.getStringFixCommand();
        expect(stringFixCommand).toBeDefined();
        expect(stringFixCommand.position).toBe(0);
        expect(stringFixCommand.deleteCount).toBe(0);
        expect(stringFixCommand.insertContent).toBe("content");
    });

    test("ResourceStringFixCommand constructor with no locator", () => {
        expect.assertions(1);

        expect(() => {
            // @ts-ignore
            new ResourceStringFixCommand({
                position: 0,
                deleteCount: 0,
                insertContent: "content"
            });
        }).toThrow();
    });

    test("ResourceStringFixCommand constructor with no position", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);

        expect(() => {
            // @ts-ignore
            new ResourceStringFixCommand({
                locator,
                deleteCount: 0,
                insertContent: "content"
            });
        }).toThrow();
    });

    test("ResourceStringFixCommand constructor with no deleteCount", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);

        expect(() => {
            // @ts-ignore
            new ResourceStringFixCommand({
                locator,
                position: 0,
                insertContent: "content"
            });
        }).toThrow();
    });

    test("ResourceStringFixCommand constructor with negative position", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);

        expect(() => {
            // @ts-ignore
            new ResourceStringFixCommand({
                locator,
                position: -1,
                deleteCount: 0,
                insertContent: "content"
            });
        }).toThrow();
    });

    test("ResourceStringFixCommand constructor with negative deleteCount", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);

        expect(() => {
            // @ts-ignore
            new ResourceStringFixCommand({
                locator,
                position: 0,
                deleteCount: -1,
                insertContent: "content"
            });
        }).toThrow();
    });

    test("ResourceStringFixCommand constructor with a position that is larger than the length of the content", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);

        expect(() => {
            // @ts-ignore
            new ResourceStringFixCommand({
                locator,
                position: 100,
                deleteCount: 0,
                insertContent: "content"
            });
        }).toThrow();
    });

    test("ResourceStringFixCommand constructor with a position + deleteCount that is larger than the length of the content", () => {
        expect.assertions(1);
        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);
        expect(() => {
            // @ts-ignore
            new ResourceStringFixCommand({
                locator,
                position: 0,
                deleteCount: 100,
                insertContent: "content"
            });
        }).toThrow();
    });

    test("ResourceStringFixCommand overlaps with itself", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);
        const command = new ResourceStringFixCommand({
            locator,
            position: 0,
            deleteCount: 0,
            insertContent: "content"
        });

        expect(command.overlaps(command)).toBe(true);
    });

    test("ResourceStringFixCommand overlaps with another command", () => {
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
            insertContent: "content"
        });
        const command2 = new ResourceStringFixCommand({
            locator,
            position: 1,
            deleteCount: 2,
            insertContent: "content"
        });

        expect(command1.overlaps(command2)).toBe(true);
    });

    test("ResourceStringFixCommand does not overlap with another command", () => {
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
            insertContent: "content"
        });
        const command2 = new ResourceStringFixCommand({
            locator,
            position: 3,
            deleteCount: 2,
            insertContent: "content"
        });

        expect(command1.overlaps(command2)).toBe(false);
    });

    test("ResourceStringFixCommand overlaps with another command with the same position", () => {
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
            insertContent: "content"
        });
        const command2 = new ResourceStringFixCommand({
            locator,
            position: 0,
            deleteCount: 2,
            insertContent: "content"
        });

        expect(command1.overlaps(command2)).toBe(true);
    });

    test("ResourceStringFixCommand overlaps with another command with the same position and no deleteCount", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);
        const command1 = new ResourceStringFixCommand({
            locator,
            position: 1,
            deleteCount: 0,
            insertContent: "content"
        });
        const command2 = new ResourceStringFixCommand({
            locator,
            position: 0,
            deleteCount: 2,
            insertContent: "content"
        });

        expect(command1.overlaps(command2)).toBe(true);
    });

    test("ResourceStringFixCommand range is correct", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);
        const command = new ResourceStringFixCommand({
            locator,
            position: 0,
            deleteCount: 2,
            insertContent: "content"
        });

        expect(command.range).toEqual([0, 2]);
    });

    test("ResourceStringFixCommand range is correct with no deleteCount", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target"
        });
        const locator = new ResourceStringLocator(resource);
        const command = new ResourceStringFixCommand({
            locator,
            position: 0,
            deleteCount: 0,
            insertContent: "content"
        });

        expect(command.range).toEqual([0, 0]);
    });
 });