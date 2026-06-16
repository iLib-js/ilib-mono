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
import LoaderFactory from 'ilib-loader';

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
            path: "./test/testfiles/files",
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
            path: "./test/testfiles/files",
            name: "test"
        });
        expect(!locData.isSync()).toBe(true);
    });

    test("should create LocaleData instance when loader doesn't support sync", () => {
        expect.assertions(1);
        registerLoader(MockLoader);
        setPlatform("mock");

        // Get the loader instance and temporarily disable sync support for this test
        const loader = LoaderFactory();
        if (loader && loader.setMockSyncSupport) {
            loader.setMockSyncSupport(false);
        }

        try {
            new LocaleData({
                path: "./test/testfiles/files",
                sync: true
            });
            fail("Expected LocaleData constructor to throw");
        } catch (e) {
            expect(e.message).toBe("Synchronous mode is requested but the loader does not support synchronous operation");
        }

        // Restore sync support
        if (loader && loader.setMockSyncSupport) {
            loader.setMockSyncSupport(true);
        }

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
            path: "./test/testfiles/files",
            sync: false
        });
        expect(locData).toBeTruthy();

        // should have the path of caller in it only
        expect(locData.getRoots()).toEqual(["./test/testfiles/files"]);
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
            path: "./test/testfiles/files",
            sync: false
        });
        expect(locData).toBeTruthy();

        LocaleData.addGlobalRoot("foobar/asf");

        expect(locData.getRoots()).toEqual(["foobar/asf", "./test/testfiles/files"]);
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
            path: "./test/testfiles/files",
            sync: false
        });
        expect(locData).toBeTruthy();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        expect(locData.getRoots()).toEqual(["a/b/c", "foobar/asf", "./test/testfiles/files"]);

        // can't remove this because it's not a global root
        LocaleData.removeGlobalRoot("./test/testfiles/files");

        expect(locData.getRoots()).toEqual(["a/b/c", "foobar/asf", "./test/testfiles/files"]);
    });

});
