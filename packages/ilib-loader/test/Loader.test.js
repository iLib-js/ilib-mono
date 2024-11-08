/*
 * loader.test.js - test the loader
 *
 * Copyright © 2022-2023 JEDLSoft
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

import { setPlatform, clearCache } from 'ilib-env';
import LoaderFactory, { registerLoader } from '../src/index.js';
import MockLoader from './MockLoader.js';

describe("testLoader", () => {
    beforeEach(() => {
        registerLoader(MockLoader);
        setPlatform("mock");
    });

    afterAll(() => {
        // clean up and reset the environment to its pristine state
        clearCache();
    });

    test("LoaderGetName", () => {
        expect.assertions(1);
        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");
    });

    test("LoaderSupportsSync", () => {
        expect.assertions(1);
        const loader = LoaderFactory();
        expect(loader.supportsSync()).toBeTruthy();
    });

    test("LoadFileSync", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");

        const content = loader.loadFile("foobar.json", {sync: true});
        expect(content).toBe("foobar.json");
    });

    test("LoadFileSyncUndefinedFileName", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");

        const content = loader.loadFile(undefined, {sync: true});
        expect(!content).toBeTruthy();
    });

    test("LoadFileSyncEmptyFileName", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");

        const content = loader.loadFile("", {sync: true});
        expect(!content).toBeTruthy();
    });

    test("LoadFileSyncUnknownFileName", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");

        const content = loader.loadFile("unknown.json", {sync: true});
        expect(!content).toBeTruthy();
    });

    test("LoadFileAsync", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");

        const promise = loader.loadFile("foobar.json", {sync: false});
        return promise.then((content) => {
            expect(content).toBe("foobar.json");
        });
    });

    test("LoadFileAsyncDefault", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");

        const promise = loader.loadFile("foobar.json");
        return promise.then((content) => {
            expect(content).toBe("foobar.json");
        });
    });

    test("LoadFilesSync", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");

        const content = loader.loadFiles([
            "foobar.json",
            "asdf.json",
            "blah.json"
        ], {sync: true});
        expect(content).toEqual([
            "foobar.json",
            "asdf.json",
            "blah.json"
        ]);
    });

    test("LoadFilesAsync", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");

        const promise = loader.loadFiles([
            "foobar.json",
            "asdf.json",
            "blah.json"
        ], {sync: false});
        return promise.then((content) => {
            expect(content).toEqual([
                "foobar.json",
                "asdf.json",
                "blah.json"
            ]);
        });
    });

    test("LoadFilesSyncUndefinedFileName", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");

        const content = loader.loadFiles([
            "foobar.json",
            undefined,
            "blah.json"
        ], {sync: true});
        expect(content).toEqual([
            "foobar.json",
            undefined,
            "blah.json"
        ]);
    });

    test("LoadFilesSyncEmptyFileName", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");

        const content = loader.loadFiles([
            "foobar.json",
            "",
            "blah.json"
        ], {sync: true});
        expect(content).toEqual([
            "foobar.json",
            undefined,
            "blah.json"
        ]);
    });

    test("LoadFilesAsyncUndefinedFileName", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");

        const promise = loader.loadFiles([
            "foobar.json",
            undefined,
            "blah.json"
        ], {sync: false});
        return promise.then((content) => {
            expect(content).toEqual([
                "foobar.json",
                undefined,
                "blah.json"
            ]);
        });
    });

    test("LoadFilesAsyncEmptyFileName", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");

        const promise = loader.loadFiles([
            "foobar.json",
            "",
            "blah.json"
        ], {sync: false});
        return promise.then((content) => {
            expect(content).toEqual([
                "foobar.json",
                undefined,
                "blah.json"
            ]);
        });
    });

    test("LoadFilesSyncUnknownFileName", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");

        const content = loader.loadFiles([
            "foobar.json",
            "unknown.json",
            "blah.json"
        ], {sync: true});
        expect(content).toEqual([
            "foobar.json",
            undefined,
            "blah.json"
        ]);
    });

    test("LoadFilesAsyncUnknownFileName", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");

        const promise = loader.loadFiles([
            "foobar.json",
            "unknown.json",
            "blah.json"
        ], {sync: false});
        return promise.then((content) => {
            expect(content).toEqual([
                "foobar.json",
                undefined,
                "blah.json"
            ]);
        });
    });

    test("LoadFilesSyncMode", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");
        loader.setSyncMode();

        const content = loader.loadFiles([
            "foobar.json",
            "asdf.json",
            "blah.json"
        ]);
        expect(content).toEqual([
            "foobar.json",
            "asdf.json",
            "blah.json"
        ]);
    });

    test("LoadFilesAsync", () => {
        expect.assertions(2);

        const loader = LoaderFactory();
        expect(loader.getName()).toBe("Mock Loader");
        loader.setAsyncMode();

        const promise = loader.loadFiles([
            "foobar.json",
            "asdf.json",
            "blah.json"
        ]);
        return promise.then((content) => {
            expect(content).toEqual([
                "foobar.json",
                "asdf.json",
                "blah.json"
            ]);
        });
    });
});
