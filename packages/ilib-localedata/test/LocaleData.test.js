/*
 * LocaleData.test.js - test the locale data class
 *
 * Copyright © 2022, 2025 JEDLSoft
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

import { setPlatform, getPlatform } from 'ilib-env';
import { registerLoader } from 'ilib-loader';

import MockLoader from './MockLoader.js';
import LocaleData from '../src/LocaleData.js';
import { clearLocaleData } from '../src/index.js';

describe("LocaleData", () => {
    beforeEach(() => {
        // Clear the locale data cache before each test
        clearLocaleData();
        LocaleData.clearGlobalRoots();
    });
    test("should create LocaleData instance with constructor", () => {
        expect.assertions(1);
        const locData = new LocaleData({
            path: "./test/files",
            name: "test"
        });
        expect(locData).toBeTruthy();
    });

    test("should throw error when constructor called without path", () => {
        expect.assertions(1);
        expect(() => {
            new LocaleData({
                name: "test"
            });
        }).toThrow();
    });

    test("should create LocaleData instance without sync", () => {
        expect.assertions(1);
        const locData = new LocaleData({
            path: "./test/files",
            name: "test"
        });
        expect(!locData.isSync()).toBe(true);
    });

    test("should create LocaleData instance when loader doesn't support sync", () => {
        expect.assertions(1);
        registerLoader(MockLoader);
        setPlatform("mock");

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        expect(!locData.isSync()).toBe(true);

        // clean up
        setPlatform(undefined);
    });

    test("should get empty global roots", () => {
        expect.assertions(1);
        setPlatform();

        LocaleData.clearGlobalRoots();

        // should be empty now
        expect(LocaleData.getGlobalRoots()).toEqual([]);
    });

    test("should get roots empty", () => {
        expect.assertions(2);
        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });
        expect(locData).toBeTruthy();

        // should have the path of caller in it only
        expect(locData.getRoots()).toEqual(["./test/files"]);
    });

    test("should add global root", () => {
        expect.assertions(1);
        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");

        expect(LocaleData.getGlobalRoots()).toEqual(["foobar/asf"]);
    });

    test("should not add global root twice", () => {
        expect.assertions(1);
        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        // should not add the second one because it's already there
        LocaleData.addGlobalRoot("foobar/asf");

        expect(LocaleData.getGlobalRoots()).toEqual(["foobar/asf"]);
    });

    test("should add global root in LocData", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });
        expect(locData).toBeTruthy();

        LocaleData.addGlobalRoot("foobar/asf");

        expect(locData.getRoots()).toEqual(["foobar/asf", "./test/files"]);
    });

    test("should add multiple global roots", () => {
        expect.assertions(1);
        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        // in reverse order
        expect(LocaleData.getGlobalRoots()).toEqual(["a/b/c", "foobar/asf"]);
    });

    test("should not add undefined global root", () => {
        expect.assertions(1);
        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot(undefined);

        expect(LocaleData.getGlobalRoots()).toEqual(["foobar/asf"]);
    });

    test("should not add null global root", () => {
        expect.assertions(1);
        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot(null);

        expect(LocaleData.getGlobalRoots()).toEqual(["foobar/asf"]);
    });

    test("should not add number global root", () => {
        expect.assertions(1);
        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot(3);

        expect(LocaleData.getGlobalRoots()).toEqual(["foobar/asf"]);
    });

    test("should clear global roots", () => {
        expect.assertions(1);
        setPlatform();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        LocaleData.clearGlobalRoots();

        // should only have the path of the caller left over
        expect(LocaleData.getGlobalRoots()).toEqual([]);
    });

    test("should remove global root", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        expect(LocaleData.getGlobalRoots()).toEqual(["a/b/c", "foobar/asf"]);

        LocaleData.removeGlobalRoot("foobar/asf");

        expect(LocaleData.getGlobalRoots()).toEqual(["a/b/c"]);
    });

    test("should remove multiple global roots", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");
        LocaleData.addGlobalRoot("x/y");
        LocaleData.addGlobalRoot("man/woman");

        expect(LocaleData.getGlobalRoots()).toEqual(["man/woman", "x/y", "a/b/c", "foobar/asf"]);

        LocaleData.removeGlobalRoot("foobar/asf");
        LocaleData.removeGlobalRoot("x/y");

        expect(LocaleData.getGlobalRoots()).toEqual(["man/woman", "a/b/c"]);
    });

    test("should not remove non-existent global root", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        expect(LocaleData.getGlobalRoots()).toEqual(["a/b/c", "foobar/asf"]);

        LocaleData.removeGlobalRoot("ff");

        expect(LocaleData.getGlobalRoots()).toEqual(["a/b/c", "foobar/asf"]);
    });

    test("should not remove undefined global root", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        expect(LocaleData.getGlobalRoots()).toEqual(["a/b/c", "foobar/asf"]);

        LocaleData.removeGlobalRoot(undefined);

        expect(LocaleData.getGlobalRoots()).toEqual(["a/b/c", "foobar/asf"]);
    });

    test("should not remove null global root", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        expect(LocaleData.getGlobalRoots()).toEqual(["a/b/c", "foobar/asf"]);

        LocaleData.removeGlobalRoot(null);

        expect(LocaleData.getGlobalRoots()).toEqual(["a/b/c", "foobar/asf"]);
    });

    test("should not remove number global root", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        expect(LocaleData.getGlobalRoots()).toEqual(["a/b/c", "foobar/asf"]);

        LocaleData.removeGlobalRoot(1);

        expect(LocaleData.getGlobalRoots()).toEqual(["a/b/c", "foobar/asf"]);
    });

    test("should not remove base path from global roots", () => {
        expect.assertions(3);
        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });
        expect(locData).toBeTruthy();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        expect(locData.getRoots()).toEqual(["a/b/c", "foobar/asf", "./test/files"]);

        // can't remove this because it's not a global root
        LocaleData.removeGlobalRoot("./test/files");

        expect(locData.getRoots()).toEqual(["a/b/c", "foobar/asf", "./test/files"]);
    });

    test("should ensure locale", async () => {
        expect.assertions(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        const result = await LocaleData.ensureLocale("en-US");
        expect(result).toBeTruthy();
    });

    test("should ensure locale with no data available", async () => {
        expect.assertions(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        const result = await LocaleData.ensureLocale("nl-NL");
        // there is no nl-NL file there
        expect(result).toBeTruthy();
    });

    test("should ensure locale data is cached", async () => {
        expect.assertions(14);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        const result = await LocaleData.ensureLocale("en-US");
        expect(result).toBeTruthy();

        expect(LocaleData.checkCache("en-US", "info")).toBe(true);
        expect(LocaleData.checkCache("en-US", "foo")).toBe(true);
        expect(LocaleData.checkCache("de-DE", "info")).toBe(false);
        expect(LocaleData.checkCache("de-DE", "foo")).toBe(false);
        expect(LocaleData.checkCache("fr-FR", "info")).toBe(false);
        expect(LocaleData.checkCache("fr-FR", "foo")).toBe(false);

        const result2 = await LocaleData.ensureLocale("de-DE");
        expect(result2).toBeTruthy();

        // make sure the English is still there after loading the German too
        expect(LocaleData.checkCache("en-US", "info")).toBe(true);
        expect(LocaleData.checkCache("en-US", "foo")).toBe(true);
        expect(LocaleData.checkCache("de-DE", "info")).toBe(true);
        expect(LocaleData.checkCache("de-DE", "foo")).toBe(true);
        expect(LocaleData.checkCache("fr-FR", "info")).toBe(false);
        expect(LocaleData.checkCache("fr-FR", "foo")).toBe(false);
    });

    test("should ensure locale right data async", async () => {
        expect.assertions(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        const result = await LocaleData.ensureLocale("en-US");
        expect(result).toBeTruthy();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });

        const data = await locData.loadData({
            sync: false,
            locale: "en-US",
            basename: "info"
        });
        expect(data).toEqual({
            "a": "b en",
            "c": "d en"
        });
    });

    test("should ensure locale right data sync", async () => {
        expect.assertions(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        const result = await LocaleData.ensureLocale("en-US");
        expect(result).toBeTruthy();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });

        // can load synchronously after the ensureLocale
        // is done, even though the loader does not support
        // synchronous operation because the data is cached
        let data = locData.loadData({
            sync: true,
            locale: "en-US",
            basename: "info"
        });

        expect(data).toEqual({
            "a": "b en",
            "c": "d en"
        });
    });

    test("should ensure locale non-existent locale means nothing cached", async () => {
        expect.assertions(13);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        expect(LocaleData.checkCache("en-US", "info")).toBe(false);
        expect(LocaleData.checkCache("en-US", "foo")).toBe(false);
        expect(LocaleData.checkCache("de-DE", "info")).toBe(false);
        expect(LocaleData.checkCache("de-DE", "foo")).toBe(false);
        expect(LocaleData.checkCache("fr-FR", "info")).toBe(false);
        expect(LocaleData.checkCache("fr-FR", "foo")).toBe(false);

        LocaleData.addGlobalRoot("./test/files3");
        const result = await LocaleData.ensureLocale("fr-FR");
        // true because root was loaded
        expect(result).toBeTruthy();

        // still no locale data because there was none to load
        expect(LocaleData.checkCache("en-US", "info")).toBe(false);
        expect(LocaleData.checkCache("en-US", "foo")).toBe(false);
        expect(LocaleData.checkCache("de-DE", "info")).toBe(false);
        expect(LocaleData.checkCache("de-DE", "foo")).toBe(false);
        expect(LocaleData.checkCache("fr-FR", "info")).toBe(true);
        expect(LocaleData.checkCache("fr-FR", "foo")).toBe(true);
    });

    test("should ensure locale non-existent data uses root when root data is pre-loaded", async () => {
        expect.assertions(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        // Set up MockLoader for this test
        registerLoader(MockLoader);
        setPlatform("mock");

        // First, load en-US data which will populate the cache with root data
        LocaleData.addGlobalRoot("./test/files3");
        const enUSResult = await LocaleData.ensureLocale("en-US");
        expect(enUSResult).toBeTruthy();

        // Now try to load fr-FR data - it should succeed by returning the cached root data
        const frFRResult = await LocaleData.ensureLocale("fr-FR");
        expect(frFRResult).toBeTruthy();

        // Verify that fr-FR data returns root data
        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });

        let data = locData.loadData({
            sync: true,
            locale: "fr-FR",
            basename: "info"
        });

        expect(data).toEqual({
            "a": "b root",
            "c": "d root"
        });

        // Clean up
        setPlatform(undefined);
    });

    test("should ensure locale non-existent data returns nothing when no root data is pre-loaded", async () => {
        expect.assertions(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        // Set up MockLoader for this test
        registerLoader(MockLoader);
        setPlatform("mock");

        // Try to load fr-FR data with no pre-loaded data
        LocaleData.addGlobalRoot("./test/files3");
        const result = await LocaleData.ensureLocale("fr-FR");
        expect(result).toBeFalsy();

        // Verify that loadData returns nothing
        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });

        let data = locData.loadData({
            sync: true,
            locale: "fr-FR",
            basename: "info"
        });

        expect(data).toBeUndefined();

        // Clean up
        setPlatform(undefined);
    });

    test("should throw error when ensure locale called with undefined", async () => {
        expect.assertions(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        await expect(LocaleData.ensureLocale()).rejects.toThrow("Invalid parameter to ensureLocale");
    });

    test("should throw error when ensure locale called with null", async () => {
        expect.assertions(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        await expect(LocaleData.ensureLocale(null)).rejects.toThrow("Invalid parameter to ensureLocale");
    });

    test("should throw error when ensure locale called with boolean", async () => {
        expect.assertions(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        await expect(LocaleData.ensureLocale(true)).rejects.toThrow("Invalid parameter to ensureLocale");
    });

    test("should throw error when ensure locale called with number", async () => {
        expect.assertions(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        await expect(LocaleData.ensureLocale(4)).rejects.toThrow("Invalid parameter to ensureLocale");
    });

    test("should ensure locale json", async () => {
        expect.assertions(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        const result = await LocaleData.ensureLocale("ja-JP");
        expect(result).toBeTruthy();
    });

    test("should ensure locale json no data available", async () => {
        expect.assertions(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        const result = await LocaleData.ensureLocale("nl-NL");
        // there is no nl-NL file there
        expect(result).toBeTruthy();
    });

    test("should ensure locale json data is cached", async () => {
        expect.assertions(14);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        const result = await LocaleData.ensureLocale("ja-JP");
        expect(result).toBeTruthy();

        expect(LocaleData.checkCache("ja-JP", "info")).toBe(true);
        expect(LocaleData.checkCache("ja-JP", "foo")).toBe(true);
        expect(LocaleData.checkCache("zh-Hans-CN", "info")).toBe(false);
        expect(LocaleData.checkCache("zh-Hans-CN", "foo")).toBe(false);
        expect(LocaleData.checkCache("fr-FR", "info")).toBe(false);
        expect(LocaleData.checkCache("fr-FR", "foo")).toBe(false);

        const result2 = await LocaleData.ensureLocale("zh-Hans-CN");
        expect(result2).toBeTruthy();

        // make sure the English is still there after loading the German too
        expect(LocaleData.checkCache("ja-JP", "info")).toBe(true);
        expect(LocaleData.checkCache("ja-JP", "foo")).toBe(true);
        expect(LocaleData.checkCache("zh-Hans-CN", "info")).toBe(true);
        expect(LocaleData.checkCache("zh-Hans-CN", "foo")).toBe(true);
        expect(LocaleData.checkCache("fr-FR", "info")).toBe(false);
        expect(LocaleData.checkCache("fr-FR", "foo")).toBe(false);
    });

    test("should ensure locale json right data async", async () => {
        expect.assertions(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        const result = await LocaleData.ensureLocale("ja-JP");
        expect(result).toBeTruthy();

        const locData = new LocaleData({
            path: "./test/files3"
        });

        const data = await locData.loadData({
            sync: false,
            locale: "ja-JP",
            basename: "info"
        });
        expect(data).toEqual({
            "a": "b ja",
            "c": "d ja"
        });
    });

    test("should ensure locale json right data sync", async () => {
        expect.assertions(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        const result = await LocaleData.ensureLocale("ja-JP");
        expect(result).toBeTruthy();

        const locData = new LocaleData({
            path: "./test/files3"
        });

        // can load synchronously after the ensureLocale
        // is done, even though the loader does not support
        // synchronous operation because the data is cached
        let data = locData.loadData({
            sync: true,
            locale: "ja-JP",
            basename: "info"
        });

        expect(data).toEqual({
            "a": "b ja",
            "c": "d ja"
        });
    });
});
