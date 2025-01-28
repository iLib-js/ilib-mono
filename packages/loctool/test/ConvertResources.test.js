/*
 * ConvertResources.test.js - test the utility functions for converting resources
 * from one representation to another.
 *
 * Copyright © 2024-2025 Box, Inc.
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

var conv = require("../lib/convertResources.js");
var ToolsCommon = require("ilib-tools-common");
var ResourceFactory = require("../lib/ResourceFactory.js");

describe("test conversions", function() {
    test("Calling the convertResourceToCommon function with no params should return undefined", function() {
        expect.assertions(1);

        var converted = conv.convertResourceToCommon();
        expect(converted).toBeUndefined();
    });

    test("Calling the convertResourceToLoctool function with no params should return undefined", function() {
        expect.assertions(1);

        var converted = conv.convertResourceToLoctool();
        expect(converted).toBeUndefined();
    });

    test("test converting string from common to loctool", function() {
        expect.assertions(15);

        var resource = new ToolsCommon.ResourceString({
            project: "foo",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "resources/en/US/foo.json",
            datatype: "json",
            context: "foo",
            key: "foo",
            source: "bar",
            target: "baz",
            state: "new",
            comment: "foo bar",
            autoKey: false,
            flavor: "ios"
        });

        var converted = conv.convertResourceToLoctool(resource);

        expect(converted).toBeTruthy();
        expect(converted.getProject()).toBe("foo");
        expect(converted.getSourceLocale()).toBe("en-US");
        expect(converted.getTargetLocale()).toBe("fr-FR");
        expect(converted.getPath()).toBe("resources/en/US/foo.json");
        expect(converted.getDataType()).toBe("json");
        expect(converted.getContext()).toBe("foo");
        expect(converted.getKey()).toBe("foo");
        expect(converted.getSource()).toBe("bar");
        expect(converted.getTarget()).toBe("baz");
        expect(converted.getState()).toBe("new");
        expect(converted.getComment()).toBe("foo bar");
        expect(converted.autoKey).toBe(false);
        expect(converted.getType()).toBe("string");
        expect(converted.getFlavor()).toBe("ios");
    });

    test("test converting a plural from common to loctool", function() {
        expect.assertions(15);

        var resource = new ToolsCommon.ResourcePlural({
            project: "foo",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "resources/en/US/foo.json",
            datatype: "json",
            context: "foo",
            key: "foo",
            source: {
                one: "bar",
                other: "baz"
            },
            target: {
                one: "foobar",
                other: "foobaz"
            },
            state: "new",
            comment: "foo bar",
            autoKey: false,
            flavor: "ios"
        });

        var converted = conv.convertResourceToLoctool(resource);

        expect(converted).toBeTruthy();
        expect(converted.getType()).toBe("plural");
        expect(converted.getProject()).toBe("foo");
        expect(converted.getSourceLocale()).toBe("en-US");
        expect(converted.getTargetLocale()).toBe("fr-FR");
        expect(converted.getPath()).toBe("resources/en/US/foo.json");
        expect(converted.getDataType()).toBe("json");
        expect(converted.getContext()).toBe("foo");
        expect(converted.getKey()).toBe("foo");
        expect(converted.getSourcePlurals()).toStrictEqual({
            one: "bar",
            other: "baz"
        });
        expect(converted.getTargetPlurals()).toStrictEqual({
            one: "foobar",
            other: "foobaz"
        });
        expect(converted.getState()).toBe("new");
        expect(converted.getComment()).toBe("foo bar");
        expect(converted.autoKey).toBe(false);
        expect(converted.getFlavor()).toBe("ios");
    });

    test("test converting an array from common to loctool", function() {
        expect.assertions(15);

        var resource = new ToolsCommon.ResourceArray({
            project: "foo",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "resources/en/US/foo.json",
            datatype: "json",
            context: "foo",
            key: "foo",
            source: ["bar", "baz"],
            target: ["foobar", "foobaz"],
            state: "new",
            comment: "foo bar",
            autoKey: false,
            flavor: "ios"
        });

        var converted = conv.convertResourceToLoctool(resource);

        expect(converted).toBeTruthy();
        expect(converted.getType()).toBe("array");
        expect(converted.getProject()).toBe("foo");
        expect(converted.getSourceLocale()).toBe("en-US");
        expect(converted.getTargetLocale()).toBe("fr-FR");
        expect(converted.getPath()).toBe("resources/en/US/foo.json");
        expect(converted.getDataType()).toBe("json");
        expect(converted.getContext()).toBe("foo");
        expect(converted.getKey()).toBe("foo");
        expect(converted.getSourceArray()).toStrictEqual(["bar", "baz"]);
        expect(converted.getTargetArray()).toStrictEqual(["foobar", "foobaz"]);
        expect(converted.getState()).toBe("new");
        expect(converted.getComment()).toBe("foo bar");
        expect(converted.autoKey).toBe(false);
        expect(converted.getFlavor()).toBe("ios");
    });

    test("test converting a string resource from loctool to common", function() {
        expect.assertions(15);

        var resource = ResourceFactory({
            resType: "string",
            project: "foo",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "resources/en/US/foo.json",
            datatype: "json",
            context: "foo",
            key: "foo",
            source: "bar",
            target: "baz",
            state: "new",
            comment: "foo bar",
            autoKey: false,
            flavor: "ios"
        });

        var converted = conv.convertResourceToCommon(resource);

        expect(converted).toBeTruthy();
        expect(converted.getProject()).toBe("foo");
        expect(converted.getSourceLocale()).toBe("en-US");
        expect(converted.getTargetLocale()).toBe("fr-FR");
        expect(converted.getPath()).toBe("resources/en/US/foo.json");
        expect(converted.getDataType()).toBe("json");
        expect(converted.getContext()).toBe("foo");
        expect(converted.getKey()).toBe("foo");
        expect(converted.getSource()).toBe("bar");
        expect(converted.getTarget()).toBe("baz");
        expect(converted.getState()).toBe("new");
        expect(converted.getComment()).toBe("foo bar");
        expect(converted.autoKey).toBe(false);
        expect(converted.getType()).toBe("string");
        expect(converted.getFlavor()).toBe("ios");
    });

    test("test converting a plural resource from loctool to common", function() {
        expect.assertions(15);

        var resource = ResourceFactory({
            resType: "plural",
            project: "foo",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "resources/en/US/foo.json",
            datatype: "json",
            context: "foo",
            key: "foo",
            sourcePlurals: {
                one: "bar",
                other: "baz"
            },
            targetPlurals: {
                one: "foobar",
                other: "foobaz"
            },
            state: "new",
            comment: "foo bar",
            autoKey: false,
            flavor: "ios"
        });

        var converted = conv.convertResourceToCommon(resource);

        expect(converted).toBeTruthy();
        expect(converted.getType()).toBe("plural");
        expect(converted.getProject()).toBe("foo");
        expect(converted.getSourceLocale()).toBe("en-US");
        expect(converted.getTargetLocale()).toBe("fr-FR");
        expect(converted.getPath()).toBe("resources/en/US/foo.json");
        expect(converted.getDataType()).toBe("json");
        expect(converted.getContext()).toBe("foo");
        expect(converted.getKey()).toBe("foo");
        expect(converted.getSource()).toStrictEqual({
            one: "bar",
            other: "baz"
        });
        expect(converted.getTarget()).toStrictEqual({
            one: "foobar",
            other: "foobaz"
        });
        expect(converted.getState()).toBe("new");
        expect(converted.getComment()).toBe("foo bar");
        expect(converted.autoKey).toBe(false);
        expect(converted.getFlavor()).toBe("ios");
    });

    test("test converting an array resource from loctool to common", function() {
        expect.assertions(15);

        var resource = ResourceFactory({
            resType: "array",
            project: "foo",
            sourceLocale: "en-US",
            targetLocale: "fr-FR",
            pathName: "resources/en/US/foo.json",
            datatype: "json",
            context: "foo",
            key: "foo",
            sourceArray: ["bar", "baz"],
            targetArray: ["foobar", "foobaz"],
            state: "new",
            comment: "foo bar",
            autoKey: false,
            flavor: "ios"
        });

        var converted = conv.convertResourceToCommon(resource);

        expect(converted).toBeTruthy();
        expect(converted.getType()).toBe("array");
        expect(converted.getProject()).toBe("foo");
        expect(converted.getSourceLocale()).toBe("en-US");
        expect(converted.getTargetLocale()).toBe("fr-FR");
        expect(converted.getPath()).toBe("resources/en/US/foo.json");
        expect(converted.getDataType()).toBe("json");
        expect(converted.getContext()).toBe("foo");
        expect(converted.getKey()).toBe("foo");
        expect(converted.getSource()).toStrictEqual(["bar", "baz"]);
        expect(converted.getTarget()).toStrictEqual(["foobar", "foobaz"]);
        expect(converted.getState()).toBe("new");
        expect(converted.getComment()).toBe("foo bar");
        expect(converted.autoKey).toBe(false);
        expect(converted.getFlavor()).toBe("ios");
    });
});
