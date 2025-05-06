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

import { ResourceString } from "ilib-tools-common";

import ResourceStringLocator from "../../../src/plugins/resource/ResourceStringLocator.js";

import ResourceMetadataFixCommand from "../../../src/plugins/resource/ResourceMetadataFixCommand.js";
import ResourceStringFixCommand from "../../../src/plugins/resource/ResourceStringFixCommand.js";
import StringFixCommand from "../../../src/plugins/string/StringFixCommand.js";

describe("test ResourceMetadataFixCommand", () => {
    test("ResourceMetadataFixCommand basic constructor", () => {
        expect.assertions(3);

        const command = new ResourceMetadataFixCommand({
            name: "name",
            value: "value",
        });

        expect(command).toBeDefined();
        expect(command.name).toBe("name");
        expect(command.value).toBe("value");
    });

    test("ResourceMetadataFixCommand constructor with no name", () => {
        expect.assertions(1);

        expect(() => {
            // @ts-ignore
            new ResourceMetadataFixCommand({
                value: "value",
            });
        }).toThrow();
    });

    test("ResourceMetadataFixCommand applying the fix works", () => {
        expect.assertions(1);

        const resource = new ResourceString({
            key: "key",
            source: "source",
            target: "target",
        });
        const locator = new ResourceStringLocator(resource);
        const command = new ResourceMetadataFixCommand({
            name: "targetLocale",
            value: "de-DE",
        });

        command.apply(locator);
        expect(resource.getTargetLocale()).toBe("de-DE");
    });
});

describe("test ResourceStringFixCommand", () => {
    test("ResourceStringFixCommand basic constructor", () => {
        expect.assertions(5);

        const command = new ResourceStringFixCommand(new StringFixCommand(0, 0, "content"));

        expect(command).toBeDefined();

        const stringFixCommand = command.stringFix;
        expect(stringFixCommand).toBeDefined();
        expect(stringFixCommand.position).toBe(0);
        expect(stringFixCommand.deleteCount).toBe(0);
        expect(stringFixCommand.insertContent).toBe("content");
    });

    test("ResourceStringFixCommand overlaps with itself", () => {
        expect.assertions(1);

        const command = ResourceStringFixCommand.replaceAfter(0, 0, "content");

        expect(command.overlaps(command)).toBe(true);
    });

    test("ResourceStringFixCommand overlaps with another command", () => {
        expect.assertions(1);

        const command1 = ResourceStringFixCommand.replaceAfter(0, 2, "content");
        const command2 = ResourceStringFixCommand.replaceAfter(1, 2, "content");

        expect(command1.overlaps(command2)).toBe(true);
    });

    test("ResourceStringFixCommand does not overlap with another command", () => {
        expect.assertions(1);

        const command1 = ResourceStringFixCommand.replaceAfter(0, 2, "content");
        const command2 = ResourceStringFixCommand.replaceAfter(3, 2, "content");

        expect(command1.overlaps(command2)).toBe(false);
    });

    test("ResourceStringFixCommand overlaps with another command with the same position", () => {
        expect.assertions(1);

        const command1 = ResourceStringFixCommand.replaceAfter(0, 2, "content");
        const command2 = ResourceStringFixCommand.replaceAfter(0, 2, "content");

        expect(command1.overlaps(command2)).toBe(true);
    });

    test("ResourceStringFixCommand overlaps with another command with the same position and no deleteCount", () => {
        expect.assertions(1);

        const command1 = ResourceStringFixCommand.replaceAfter(1, 0, "content");
        const command2 = ResourceStringFixCommand.replaceAfter(0, 2, "content");

        expect(command1.overlaps(command2)).toBe(true);
    });

    test("ResourceStringFixCommand range is correct", () => {
        expect.assertions(1);

        const command = ResourceStringFixCommand.replaceAfter(0, 2, "content");

        expect(command.stringFix.range).toEqual([0, 2]);
    });

    test("ResourceStringFixCommand range is correct with no deleteCount", () => {
        expect.assertions(1);

        const command = ResourceStringFixCommand.replaceAfter(0, 0, "content");

        expect(command.stringFix.range).toEqual([0, 0]);
    });
});
