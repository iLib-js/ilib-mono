/*
 * ResourceStringLocator.test.js - test the object that helps you locate a string to fix
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

describe("test ResourceStringLocator", () => {
    test("ResourceStringLocator basic string constructor", () => {
        expect.assertions(1);

        const rsl = new ResourceStringLocator(
            new ResourceString({
                key: "unique.key",
                path: "x/y/z.js",
                resfile: "a/b/c/resources.xliff",
                source: "This is the source string",
                sourceLocale: "en-US",
                target: "This is the target string",
                targetLocale: "de-DE"
            })
        );

        expect(rsl).toBeDefined();
    });

    test("ResourceStringLocator gives back the right fields", () => {
        expect.assertions(5);

        const res = new ResourceString({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: "This is the source string",
            sourceLocale: "en-US",
            target: "This is the target string",
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res);
        expect(rsl).toBeDefined();

        expect(rsl.resource).toBe(res);
        expect(rsl.category).toBeUndefined();
        expect(rsl.index).toBeUndefined();
        expect(rsl.target).toBeTruthy();
    });

    test("ResourceStringLocator string constructor for a source string", () => {
        expect.assertions(5);

        const res = new ResourceString({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: "This is the source string",
            sourceLocale: "en-US",
            target: "This is the target string",
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res, false);
        expect(rsl).toBeDefined();

        expect(rsl.resource).toBe(res);
        expect(rsl.category).toBeUndefined();
        expect(rsl.index).toBeUndefined();
        expect(rsl.target).toBeFalsy();
    });

    test("ResourceStringLocator basic plural constructor", () => {
        expect.assertions(1);

        const res = new ResourcePlural({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: {
                one: "This is the singular source string",
                other: "This is the plural source string"
            },
            sourceLocale: "en-US",
            target: {
                one: "This is the singular target string",
                other: "This is the plural target string"
            },
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res, undefined, "one");
        expect(rsl).toBeDefined();
    });

    test("ResourceStringLocator plural constructor returns the right fields", () => {
        expect.assertions(5);

        const res = new ResourcePlural({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: {
                one: "This is the singular source string",
                other: "This is the plural source string"
            },
            sourceLocale: "en-US",
            target: {
                one: "This is the singular target string",
                other: "This is the plural target string"
            },
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res, undefined, "one");
        expect(rsl).toBeDefined();

        expect(rsl.resource).toBe(res);
        expect(rsl.category).toBe("one");
        expect(rsl.index).toBeUndefined();
        expect(rsl.target).toBeTruthy();
    });

    test("ResourceStringLocator full plural constructor returns the right fields", () => {
        expect.assertions(5);

        const res = new ResourcePlural({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: {
                one: "This is the singular source string",
                other: "This is the plural source string"
            },
            sourceLocale: "en-US",
            target: {
                one: "This is the singular target string",
                other: "This is the plural target string"
            },
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res, false, "one");
        expect(rsl).toBeDefined();

        expect(rsl.resource).toBe(res);
        expect(rsl.category).toBe("one");
        expect(rsl.index).toBeUndefined();
        expect(rsl.target).toBeFalsy();
    });

    test("ResourceStringLocator plural constructor throws if you don't give the plural category", () => {
        expect.assertions(1);

        const res = new ResourcePlural({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: {
                one: "This is the singular source string",
                other: "This is the plural source string"
            },
            sourceLocale: "en-US",
            target: {
                one: "This is the singular target string",
                other: "This is the plural target string"
            },
            targetLocale: "de-DE"
        });

        expect(() => {
            new ResourceStringLocator(res);
        }).toThrow("Cannot create a ResourceStringLocator for a plural resource without a plural category");
    });

    test("ResourceStringLocator basic array constructor", () => {
        expect.assertions(1);

        const res = new ResourceArray({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: [
                "This is the first source string",
                "This is the second source string"
            ],
            sourceLocale: "en-US",
            target: [
                "This is the first target string",
                "This is the second target string"
            ],
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res, undefined, undefined, 0);
        expect(rsl).toBeDefined();
    });

    test("ResourceStringLocator array constructor returns the right fields", () => {
        expect.assertions(5);

        const res = new ResourceArray({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: [
                "This is the first source string",
                "This is the second source string"
            ],
            sourceLocale: "en-US",
            target: [
                "This is the first target string",
                "This is the second target string"
            ],
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res, undefined, undefined, 0);
        expect(rsl).toBeDefined();

        expect(rsl.resource).toBe(res);
        expect(rsl.category).toBeUndefined();
        expect(rsl.index).toBe(0);
        expect(rsl.target).toBeTruthy();
    });

    test("ResourceStringLocator string locator gets right target content", () => {
        expect.assertions(2);

        const res = new ResourceString({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: "This is the source string",
            sourceLocale: "en-US",
            target: "This is the target string",
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res);
        expect(rsl).toBeDefined();

        expect(rsl.getContent()).toBe("This is the target string");
    });

    test("ResourceStringLocator array constructor throws if the array index was not given", () => {
        expect.assertions(1);

        const res = new ResourceArray({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: [
                "This is the first source string",
                "This is the second source string"
            ],
            sourceLocale: "en-US",
            target: [
                "This is the first target string",
                "This is the second target string"
            ],
            targetLocale: "de-DE"
        });

        expect(() => {
            new ResourceStringLocator(res);
        }).toThrow("Cannot create a ResourceStringLocator for an array resource without an index");
    });

    test("ResourceStringLocator string locator gets right source content", () => {
        expect.assertions(2);

        const res = new ResourceString({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: "This is the source string",
            sourceLocale: "en-US",
            target: "This is the target string",
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res, false);
        expect(rsl).toBeDefined();

        expect(rsl.getContent()).toBe("This is the source string");
    });

    test("ResourceStringLocator plural locator gets right target content", () => {
        expect.assertions(2);

        const res = new ResourcePlural({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: {
                one: "This is the singular source string",
                other: "This is the plural source string"
            },
            sourceLocale: "en-US",
            target: {
                one: "This is the singular target string",
                other: "This is the plural target string"
            },
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res, undefined, "other");
        expect(rsl).toBeDefined();

        expect(rsl.getContent()).toBe("This is the plural target string");
    });

    test("ResourceStringLocator plural locator gets right source content", () => {
        expect.assertions(2);

        const res = new ResourcePlural({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: {
                one: "This is the singular source string",
                other: "This is the plural source string"
            },
            sourceLocale: "en-US",
            target: {
                one: "This is the singular target string",
                other: "This is the plural target string"
            },
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res, false, "other");
        expect(rsl).toBeDefined();

        expect(rsl.getContent()).toBe("This is the plural source string");
    });

    test("ResourceStringLocator array locator gets right target content", () => {
        expect.assertions(2);

        const res = new ResourceArray({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: [
                "This is the first source string",
                "This is the second source string"
            ],
            sourceLocale: "en-US",
            target: [
                "This is the first target string",
                "This is the second target string"
            ],
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res, undefined, undefined, 1);
        expect(rsl).toBeDefined();

        expect(rsl.getContent()).toBe("This is the second target string");
    });

    test("ResourceStringLocator array locator gets right source content", () => {
        expect.assertions(2);

        const res = new ResourceArray({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: [
                "This is the first source string",
                "This is the second source string"
            ],
            sourceLocale: "en-US",
            target: [
                "This is the first target string",
                "This is the second target string"
            ],
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res, false, undefined, 1);
        expect(rsl).toBeDefined();

        expect(rsl.getContent()).toBe("This is the second source string");
    });

    test("ResourceStringLocator string locator sets the right target content", () => {
        expect.assertions(5);

        const res = new ResourceString({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: "This is the source string",
            sourceLocale: "en-US",
            target: "This is the target string",
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res);
        expect(rsl).toBeDefined();

        expect(rsl.getContent()).toBe("This is the target string");
        expect(rsl.setContent("This is the new target string")).toBeTruthy();
        expect(rsl.getContent()).toBe("This is the new target string");

        expect(res.getTarget()).toBe("This is the new target string");
    });

    test("ResourceStringLocator string locator sets the right source content", () => {
        expect.assertions(5);

        const res = new ResourceString({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: "This is the source string",
            sourceLocale: "en-US",
            target: "This is the target string",
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res, false);
        expect(rsl).toBeDefined();

        expect(rsl.getContent()).toBe("This is the source string");
        expect(rsl.setContent("This is the new source string")).toBeTruthy();
        expect(rsl.getContent()).toBe("This is the new source string");

        expect(res.getSource()).toBe("This is the new source string");
    });

    test("ResourceStringLocator plural locator sets the right target content", () => {
        expect.assertions(5);

        const res = new ResourceArray({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: [
                "This is the first source string",
                "This is the second source string"
            ],
            sourceLocale: "en-US",
            target: [
                "This is the first target string",
                "This is the second target string"
            ],
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res, undefined, undefined, 0);
        expect(rsl).toBeDefined();
        expect(rsl.getContent()).toBe("This is the first target string");
        expect(rsl.setContent("This is the new first target string")).toBeTruthy();
        expect(rsl.getContent()).toBe("This is the new first target string");

        expect(res.getTarget()[0]).toBe("This is the new first target string");
    });

    test("ResourceStringLocator plural locator sets the right source content", () => {
        expect.assertions(5);

        const res = new ResourceArray({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: [
                "This is the first source string",
                "This is the second source string"
            ],
            sourceLocale: "en-US",
            target: [
                "This is the first target string",
                "This is the second target string"
            ],
            targetLocale: "de-DE"
        });

        const rsl = new ResourceStringLocator(res, false, undefined, 0);
        expect(rsl).toBeDefined();
        expect(rsl.getContent()).toBe("This is the first source string");
        expect(rsl.setContent("This is the new first source string")).toBeTruthy();
        expect(rsl.getContent()).toBe("This is the new first source string");

        expect(res.getSource()[0]).toBe("This is the new first source string");
    });


    test("ResourceStringLocator isSameAs works when the two locators are actually the same resource strings", () => {
        expect.assertions(3);

        const res = new ResourceString({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: "This is the source string",
            sourceLocale: "en-US",
            target: "This is the target string",
            targetLocale: "de-DE"
        });

        const rsl1 = new ResourceStringLocator(res);
        expect(rsl1).toBeDefined();
        const rsl2 = new ResourceStringLocator(res);
        expect(rsl2).toBeDefined();

        expect(rsl1.isSameAs(rsl2)).toBeTruthy();
    });

    test("ResourceStringLocator isSameAs works when the two locators are actually the same resource plurals", () => {
        expect.assertions(3);

        const res = new ResourcePlural({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: {
                one: "This is the singular source string",
                other: "This is the plural source string"
            },
            sourceLocale: "en-US",
            target: {
                one: "This is the singular target string",
                other: "This is the plural target string"
            },
            targetLocale: "de-DE"
        });

        const rsl1 = new ResourceStringLocator(res, undefined, "other");
        expect(rsl1).toBeDefined();
        const rsl2 = new ResourceStringLocator(res, undefined, "other");
        expect(rsl2).toBeDefined();

        expect(rsl1.isSameAs(rsl2)).toBeTruthy();
    });

    test("ResourceStringLocator isSameAs works when the two locators are actually the same resource arrays", () => {
        expect.assertions(3);

        const res = new ResourceArray({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: [
                "This is the first source string",
                "This is the second source string"
            ],
            sourceLocale: "en-US",
            target: [
                "This is the first target string",
                "This is the second target string"
            ],
            targetLocale: "de-DE"
        });

        const rsl1 = new ResourceStringLocator(res, undefined, undefined, 0);
        expect(rsl1).toBeDefined();
        const rsl2 = new ResourceStringLocator(res, undefined, undefined, 0);
        expect(rsl2).toBeDefined();

        expect(rsl1.isSameAs(rsl2)).toBeTruthy();
    });

    test("ResourceStringLocator isSameAs works when the two locators are different instances of the same resource strings", () => {
        expect.assertions(3);

        const res1 = new ResourceString({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: "This is the source string",
            sourceLocale: "en-US",
            target: "This is the target string",
            targetLocale: "de-DE"
        });

        // same as the above
        const res2 = new ResourceString({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: "This is the source string",
            sourceLocale: "en-US",
            target: "This is the target string",
            targetLocale: "de-DE"
        });

        const rsl1 = new ResourceStringLocator(res1);
        expect(rsl1).toBeDefined();
        const rsl2 = new ResourceStringLocator(res2);
        expect(rsl2).toBeDefined();

        expect(rsl1.isSameAs(rsl2)).toBeTruthy();
    });

    test("ResourceStringLocator isSameAs works when the two locators are different instances of the same resource plurals", () => {
        expect.assertions(3);

        const res1 = new ResourcePlural({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: {
                one: "This is the singular source string",
                other: "This is the plural source string"
            },
            sourceLocale: "en-US",
            target: {
                one: "This is the singular target string",
                other: "This is the plural target string"
            },
            targetLocale: "de-DE"
        });

        // same as the above
        const res2 = new ResourcePlural({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: {
                one: "This is the singular source string",
                other: "This is the plural source string"
            },
            sourceLocale: "en-US",
            target: {
                one: "This is the singular target string",
                other: "This is the plural target string"
            },
            targetLocale: "de-DE"
        });

        const rsl1 = new ResourceStringLocator(res1, undefined, "other");
        expect(rsl1).toBeDefined();
        const rsl2 = new ResourceStringLocator(res2, undefined, "other");
        expect(rsl2).toBeDefined();

        expect(rsl1.isSameAs(rsl2)).toBeTruthy();
    });

    test("ResourceStringLocator isSameAs works when the two locators are different instances of the same resource arrays", () => {
        expect.assertions(3);

        const res1 = new ResourceArray({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: [
                "This is the first source string",
                "This is the second source string"
            ],
            sourceLocale: "en-US",
            target: [
                "This is the first target string",
                "This is the second target string"
            ],
            targetLocale: "de-DE"
        });

        // same as the above
        const res2 = new ResourceArray({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: [
                "This is the first source string",
                "This is the second source string"
            ],
            sourceLocale: "en-US",
            target: [
                "This is the first target string",
                "This is the second target string"
            ],
            targetLocale: "de-DE"
        });

        const rsl1 = new ResourceStringLocator(res1, undefined, undefined, 0);
        expect(rsl1).toBeDefined();
        const rsl2 = new ResourceStringLocator(res2, undefined, undefined, 0);
        expect(rsl2).toBeDefined();

        expect(rsl1.isSameAs(rsl2)).toBeTruthy();
    });

    test("ResourceStringLocator isSameAs returns false when the two locators are different resource strings", () => {
        expect.assertions(3);

        const res1 = new ResourceString({
            key: "unique.key1",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: "This is the source string",
            sourceLocale: "en-US",
            target: "This is the target string",
            targetLocale: "de-DE"
        });

        const res2 = new ResourceString({
            key: "unique.key2",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: "This is the source string of key2",
            sourceLocale: "en-US",
            target: "This is the target string of key2",
            targetLocale: "de-DE"
        });

        const rsl1 = new ResourceStringLocator(res1);
        expect(rsl1).toBeDefined();
        const rsl2 = new ResourceStringLocator(res2);
        expect(rsl2).toBeDefined();

        expect(rsl1.isSameAs(rsl2)).toBeFalsy();
    });

    test("ResourceStringLocator isSameAs returns false when the two locators are different resource plurals", () => {
        expect.assertions(3);

        const res1 = new ResourcePlural({
            key: "unique.key1",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: {
                one: "This is the singular source string",
                other: "This is the plural source string"
            },
            sourceLocale: "en-US",
            target: {
                one: "This is the singular target string",
                other: "This is the plural target string"
            },
            targetLocale: "de-DE"
        });

        // same as the above
        const res2 = new ResourcePlural({
            key: "unique.key2",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: {
                one: "This is the singular source string for key2",
                other: "This is the plural source string for key2"
            },
            sourceLocale: "en-US",
            target: {
                one: "This is the singular target string for key2",
                other: "This is the plural target string for key2"
            },
            targetLocale: "de-DE"
        });

        const rsl1 = new ResourceStringLocator(res1, undefined, "other");
        expect(rsl1).toBeDefined();
        const rsl2 = new ResourceStringLocator(res2, undefined, "other");
        expect(rsl2).toBeDefined();

        expect(rsl1.isSameAs(rsl2)).toBeFalsy();
    });

    test("ResourceStringLocator isSameAs returns false when the two locators are different resource arrays", () => {
        expect.assertions(3);

        const res1 = new ResourceArray({
            key: "unique.key1",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: [
                "This is the first source string",
                "This is the second source string"
            ],
            sourceLocale: "en-US",
            target: [
                "This is the first target string",
                "This is the second target string"
            ],
            targetLocale: "de-DE"
        });

        // same as the above
        const res2 = new ResourceArray({
            key: "unique.key2",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: [
                "This is the first source string for key2",
                "This is the second source string for key2"
            ],
            sourceLocale: "en-US",
            target: [
                "This is the first target string for key2",
                "This is the second target string for key2"
            ],
            targetLocale: "de-DE"
        });

        const rsl1 = new ResourceStringLocator(res1, undefined, undefined, 0);
        expect(rsl1).toBeDefined();
        const rsl2 = new ResourceStringLocator(res2, undefined, undefined, 0);
        expect(rsl2).toBeDefined();

        expect(rsl1.isSameAs(rsl2)).toBeFalsy();
    });

    test("ResourceStringLocator isSameAs is false when the two locators differ on the source/target", () => {
        expect.assertions(3);

        const res1 = new ResourceString({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: "This is the source string",
            sourceLocale: "en-US",
            target: "This is the target string",
            targetLocale: "de-DE"
        });

        // same as the above
        const res2 = new ResourceString({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: "This is the source string",
            sourceLocale: "en-US",
            target: "This is the target string",
            targetLocale: "de-DE"
        });

        const rsl1 = new ResourceStringLocator(res1, true);
        expect(rsl1).toBeDefined();
        const rsl2 = new ResourceStringLocator(res2, false);
        expect(rsl2).toBeDefined();

        expect(rsl1.isSameAs(rsl2)).toBeFalsy();
    });

    test("ResourceStringLocator isSameAs is false when the two locators differ on the resource type", () => {
        expect.assertions(3);

        const res1 = new ResourceString({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: "This is the source string",
            sourceLocale: "en-US",
            target: "This is the target string",
            targetLocale: "de-DE"
        });

        const res2 = new ResourceArray({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: [
                "This is the first source string",
                "This is the second source string"
            ],
            sourceLocale: "en-US",
            target: [
                "This is the first target string",
                "This is the second target string"
            ],
            targetLocale: "de-DE"
        });

        const rsl1 = new ResourceStringLocator(res1, undefined, undefined, 0);
        expect(rsl1).toBeDefined();
        const rsl2 = new ResourceStringLocator(res2, undefined, undefined, 0);
        expect(rsl2).toBeDefined();

        // different resource types
        expect(rsl1.isSameAs(rsl2)).toBeFalsy();
    });


    test("ResourceStringLocator isSameAs is false when the two locators differ on the plural category", () => {
        expect.assertions(3);

        const res1 = new ResourcePlural({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: {
                one: "This is the singular source string",
                other: "This is the plural source string"
            },
            sourceLocale: "en-US",
            target: {
                one: "This is the singular target string",
                other: "This is the plural target string"
            },
            targetLocale: "de-DE"
        });

        // same as the above
        const res2 = new ResourcePlural({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: {
                one: "This is the singular source string",
                other: "This is the plural source string"
            },
            sourceLocale: "en-US",
            target: {
                one: "This is the singular target string",
                other: "This is the plural target string"
            },
            targetLocale: "de-DE"
        });

        const rsl1 = new ResourceStringLocator(res1, undefined, "one");
        expect(rsl1).toBeDefined();
        const rsl2 = new ResourceStringLocator(res2, undefined, "other");
        expect(rsl2).toBeDefined();

        // different resource types
        expect(rsl1.isSameAs(rsl2)).toBeFalsy();
    });

    test("ResourceStringLocator isSameAs is false when the two locators differ on the array index", () => {
        const res1 = new ResourceArray({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: [
                "This is the first source string",
                "This is the second source string"
            ],
            sourceLocale: "en-US",
            target: [
                "This is the first target string",
                "This is the second target string"
            ],
            targetLocale: "de-DE"
        });

        // same as the above
        const res2 = new ResourceArray({
            key: "unique.key",
            path: "x/y/z.js",
            resfile: "a/b/c/resources.xliff",
            source: [
                "This is the first source string",
                "This is the second source string"
            ],
            sourceLocale: "en-US",
            target: [
                "This is the first target string",
                "This is the second target string"
            ],
            targetLocale: "de-DE"
        });

        const rsl1 = new ResourceStringLocator(res1, undefined, undefined, 0);
        expect(rsl1).toBeDefined();
        const rsl2 = new ResourceStringLocator(res2, undefined, undefined, 1);
        expect(rsl2).toBeDefined();

        // different resource types
        expect(rsl1.isSameAs(rsl2)).toBeFalsy();
    });

});