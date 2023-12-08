/*
 * Nodeloader.test.js - test the loader on nodejs
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

import { getPlatform } from 'ilib-env';
import LoaderFactory, { registerLoader } from '../src/index.js';

describe("testNodeLoader", () => {
    if (getPlatform() === "nodejs") {
        test("LoaderGetName", () => {
            expect.assertions(1);
            var loader = LoaderFactory();
            expect(loader.getName()).toBe("Nodejs Loader");
        });

        test("LoaderSupportsSync", () => {
            expect.assertions(1);
            var loader = LoaderFactory();
            expect(loader.supportsSync()).toBeTruthy();
        });

        test("LoadFileSync", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var content = loader.loadFile("./test/files/test.json", {sync: true});
            expect(content).toBe(`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`
            );
        });

        test("LoadFileSyncUndefinedFileName", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var content = loader.loadFile(undefined, {sync: true});
            expect(!content).toBeTruthy();
        });

        test("LoadFileSyncEmptyFileName", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var content = loader.loadFile("", {sync: true});
            expect(!content).toBeTruthy();
        });

        test("LoadFileSyncUnknownFileName", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var content = loader.loadFile("unknown.json", {sync: true});
            expect(!content).toBeTruthy();
        });

        test("LoadFileAsync", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var promise = loader.loadFile("./test/files/test.json", {sync: false});
            return promise.then((content) => {
                expect(content).toBe(`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`
                );
            });
        });

        test("LoadFileAsyncDefault", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var promise = loader.loadFile("./test/files/test.json");
            return promise.then((content) => {
                expect(content).toBe(`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`
                );
            });
        });

        test("LoadFilesSync", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var content = loader.loadFiles([
                "./test/files/test.json",
                "./test/files/a/asdf.json"
            ], {sync: true});
            expect(content).toEqual([
`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`,
`{
    "name": "foo",
    "value": "asdf"
}`
            ]);
        });

        test("LoadFilesAsync", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var promise = loader.loadFiles([
                "./test/files/test.json",
                "./test/files/a/asdf.json"
            ], {sync: false});
            return promise.then((content) => {
                expect(content).toEqual([
`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`,
`{
    "name": "foo",
    "value": "asdf"
}`
                ]);
            });
        });

        test("LoadFilesSyncUndefinedFileName", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var content = loader.loadFiles([
                "./test/files/test.json",
                undefined,
                "./test/files/a/asdf.json"
            ], {sync: true});
            expect(content).toEqual([
`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`,
                undefined,
`{
    "name": "foo",
    "value": "asdf"
}`
            ]);
        });

        test("LoadFilesSyncEmptyFileName", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var content = loader.loadFiles([
                "./test/files/test.json",
                "",
                "./test/files/a/asdf.json"
            ], {sync: true});
            expect(content).toEqual([
`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`,
                undefined,
`{
    "name": "foo",
    "value": "asdf"
}`
            ]);
        });

        test("LoadFilesAsyncUndefinedFileName", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var promise = loader.loadFiles([
                "./test/files/test.json",
                undefined,
                "./test/files/a/asdf.json"
            ], {sync: false});
            return promise.then((content) => {
                expect(content).toEqual([
`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`,
                undefined,
`{
    "name": "foo",
    "value": "asdf"
}`
                ]);
            });
        });

        test("LoadFilesAsyncEmptyFileName", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var promise = loader.loadFiles([
                "./test/files/test.json",
                "",
                "./test/files/a/asdf.json"
            ], {sync: false});
            return promise.then((content) => {
                expect(content).toEqual([
`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`,
                undefined,
`{
    "name": "foo",
    "value": "asdf"
}`
                ]);
            });
        });

        test("LoadFilesSyncUnknownFileName", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var content = loader.loadFiles([
                "./test/files/test.json",
                "./test/files/asdf.test.json",
                "./test/files/a/asdf.json"
            ], {sync: true});
            expect(content).toEqual([
`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`,
                undefined,
`{
    "name": "foo",
    "value": "asdf"
}`
            ]);
        });

        test("LoadFilesAsyncUnknownFileName", () => {
            expect.assertions(1);

            var loader = LoaderFactory();

            var promise = loader.loadFiles([
                "./test/files/test.json",
                "./test/files/asdf.test.json",
                "./test/files/a/asdf.json"
            ], {sync: false});
            return promise.then((content) => {
                expect(content).toEqual([
`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`,
                undefined,
`{
    "name": "foo",
    "value": "asdf"
}`
                ]);
            });
        });

        test("LoadFilesSyncMode", () => {
            expect.assertions(1);

            var loader = LoaderFactory();
            loader.setSyncMode();

            var content = loader.loadFiles([
                "./test/files/test.json",
                "./test/files/asdf.test.json",
                "./test/files/a/asdf.json"
            ]);
            expect(content).toEqual([
`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`,
                undefined,
`{
    "name": "foo",
    "value": "asdf"
}`
            ]);
        });

        test("LoadFilesAsync", () => {
            expect.assertions(1);

            var loader = LoaderFactory();
            loader.setAsyncMode();

            var promise = loader.loadFiles([
                "./test/files/test.json",
                "./test/files/asdf.test.json",
                "./test/files/a/asdf.json"
            ]);
            return promise.then((content) => {
                expect(content).toEqual([
`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`,
                    undefined,
`{
    "name": "foo",
    "value": "asdf"
}`
                ]);
            });
        });

        test("LoadFilesJsSyncModeRightTypeCommonJs", () => {
            expect.assertions(2);

            var loader = LoaderFactory();
            loader.setSyncMode();

            var content = loader.loadFiles([
                "./test/files/testcommon.js"
            ]);
            expect(content.length).toBe(1);
            expect(typeof(content[0])).toBe('function');
        });

        test("LoadFilesJsSyncModeRightTypeESModule", () => {
            expect.assertions(2);

            var loader = LoaderFactory();
            loader.setSyncMode();

            var content = loader.loadFiles([
                "./test/files/a/asdf.mjs"
            ]);
            expect(content.length).toBe(1);

            // cannot load ES modules synchronously
            expect(typeof(content[0])).toBe('undefined');
        });

        test("LoadFilesJsSyncModeNonExistantFile", () => {
            expect.assertions(2);

            var loader = LoaderFactory();
            loader.setSyncMode();

            var content = loader.loadFiles([
                "./test/files/asdf.test.js"
            ]);
            expect(content.length).toBe(1);
            expect(typeof(content[0])).toBe('undefined');
        });

        test("LoadFilesJsSyncModeRightTypesMultiple", () => {
            expect.assertions(4);

            var loader = LoaderFactory();
            loader.setSyncMode();

            var content = loader.loadFiles([
                "./test/files/testcommon.js",
                "./test/files/test.cjs",
                "./test/files/a/asdf.mjs"
            ]);
            expect(content.length).toBe(3);
            expect(typeof(content[0])).toBe('function');
            expect(typeof(content[1])).toBe('function');
            expect(typeof(content[2])).toBe('undefined');
        });

        test("LoadFilesJsSyncModeRightContent", () => {
            expect.assertions(1);

            var loader = LoaderFactory();
            loader.setSyncMode();

            var content = loader.loadFiles([
                "./test/files/testcommon.js",
                "./test/files/asdf.test.js"
            ]);
            expect(content[0]()).toStrictEqual({
                "test": "this is a test",
                "test2": {
                    "test3": "this is only a test"
                }
            });
        });

        test("LoadFilesJsAsyncRightTypesMultiple", () => {
            expect.assertions(3);

            var loader = LoaderFactory();
            loader.setAsyncMode();

            return loader.loadFiles([
                "./test/files/testcommon.js",
                "./test/files/a/asdf.mjs"
            ]).then(content => {
                expect(content.length).toBe(2);
                expect(typeof(content[0])).toBe('object');

                // ES modules can be loaded asynchronously
                expect(typeof(content[1])).toBe('object');
            });
        });

        test("LoadFilesJsAsyncRightContent", () => {
            expect.assertions(2);

            var loader = LoaderFactory();
            loader.setAsyncMode();

            return loader.loadFiles([
                "./test/files/testcommon.js",
                "./test/files/asdf.test.js",
                "./test/files/a/asdf.mjs"
            ]).then(content => {
                expect(content[0].default()).toStrictEqual({
                    "test": "this is a test",
                    "test2": {
                        "test3": "this is only a test"
                    }
                });
                // ES modules can be loaded asynchronously
                expect(content[2].default()).toStrictEqual({
                    "name": "foo",
                    "value": "asdf"
                });
            });
        });
    } else {
        test("fake", () => {
            expect(1+1).toBe(2);
        });
    }
});
