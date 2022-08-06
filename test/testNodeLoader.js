/*
 * testNodeloader.js - test the loader on nodejs
 *
 * Copyright © 2022 JEDLSoft
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

import { setPlatform } from 'ilib-env';
import LoaderFactory, { registerLoader } from '../src/index.js';

export const testNodeLoader = {
    setUp: function(callback) {
        setPlatform("nodejs");
        callback();
    },

    testLoaderGetName: function(test) {
        test.expect(1);
        var loader = LoaderFactory();
        test.equal(loader.getName(), "Nodejs Loader");
        test.done();
    },

    testLoaderSupportsSync: function(test) {
        test.expect(1);
        var loader = LoaderFactory();
        test.ok(loader.supportsSync());
        test.done();
    },

    testLoadFileSync: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var content = loader.loadFile("./test/files/test.json", {sync: true});
        test.equal(content,
`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`        );
        test.done();
    },

    testLoadFileSyncUndefinedFileName: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var content = loader.loadFile(undefined, {sync: true});
        test.ok(!content);
        test.done();
    },

    testLoadFileSyncEmptyFileName: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var content = loader.loadFile("", {sync: true});
        test.ok(!content);
        test.done();
    },

    testLoadFileSyncUnknownFileName: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var content = loader.loadFile("unknown.json", {sync: true});
        test.ok(!content);
        test.done();
    },

    testLoadFileAsync: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var promise = loader.loadFile("./test/files/test.json", {sync: false});
        promise.then((content) => {
            test.equal(content, 
`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`            );
            test.done();
        });
    },

    testLoadFileAsyncDefault: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var promise = loader.loadFile("./test/files/test.json");
        promise.then((content) => {
            test.equal(content, 
`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`            );
            test.done();
        });
    },

    testLoadFilesSync: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var content = loader.loadFiles([
            "./test/files/test.json",
            "./test/files/a/asdf.json"
        ], {sync: true});
        test.equalIgnoringOrder(content, [
`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`,
`{
    "name": "foo",
    "value": "asdf"
}`        ]);
        test.done();
    },

    testLoadFilesAsync: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var promise = loader.loadFiles([
            "./test/files/test.json",
            "./test/files/a/asdf.json"
        ], {sync: false});
        promise.then((content) => {
            test.equalIgnoringOrder(content, [
`{
    "test": "this is a test",
    "test2": {
        "test3": "this is only a test"
    }
}`,
`{
    "name": "foo",
    "value": "asdf"
}`            ]);
            test.done();
        });
    },

    testLoadFilesSyncUndefinedFileName: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var content = loader.loadFiles([
            "./test/files/test.json",
            undefined,
            "./test/files/a/asdf.json"
        ], {sync: true});
        test.equalIgnoringOrder(content, [
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
}`        ]);
        test.done();
    },

    testLoadFilesSyncEmptyFileName: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var content = loader.loadFiles([
            "./test/files/test.json",
            "",
            "./test/files/a/asdf.json"
        ], {sync: true});
        test.equalIgnoringOrder(content, [
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
}`        ]);
        test.done();
    },

    testLoadFilesAsyncUndefinedFileName: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var promise = loader.loadFiles([
            "./test/files/test.json",
            undefined,
            "./test/files/a/asdf.json"
        ], {sync: false});
        promise.then((content) => {
            test.equalIgnoringOrder(content, [
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
}`            ]);
            test.done();
        });
    },

    testLoadFilesAsyncEmptyFileName: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var promise = loader.loadFiles([
            "./test/files/test.json",
            "",
            "./test/files/a/asdf.json"
        ], {sync: false});
        promise.then((content) => {
            test.equalIgnoringOrder(content, [
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
}`            ]);
            test.done();
        });
    },

    testLoadFilesSyncUnknownFileName: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var content = loader.loadFiles([
            "./test/files/test.json",
            "./test/files/testasdf.json",
            "./test/files/a/asdf.json"
        ], {sync: true});
        test.equalIgnoringOrder(content, [
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
}`        ]);
        test.done();
    },

    testLoadFilesAsyncUnknownFileName: function(test) {
        test.expect(1);

        var loader = LoaderFactory();

        var promise = loader.loadFiles([
            "./test/files/test.json",
            "./test/files/testasdf.json",
            "./test/files/a/asdf.json"
        ], {sync: false});
        promise.then((content) => {
            test.equalIgnoringOrder(content, [
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
}`            ]);
            test.done();
        });
    },

    testLoadFilesSyncMode: function(test) {
        test.expect(1);

        var loader = LoaderFactory();
        loader.setSyncMode();

        var content = loader.loadFiles([
            "./test/files/test.json",
            "./test/files/testasdf.json",
            "./test/files/a/asdf.json"
        ]);
        test.equalIgnoringOrder(content, [
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

        test.done();
    },

    testLoadFilesAsync: function(test) {
        test.expect(1);

        var loader = LoaderFactory();
        loader.setAsyncMode();

        var promise = loader.loadFiles([
            "./test/files/test.json",
            "./test/files/testasdf.json",
            "./test/files/a/asdf.json"
        ]);
        promise.then((content) => {
            test.equalIgnoringOrder(content, [
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
            test.done();
        });
    },

    testLoadFilesJsSyncModeRightTypeCommonJs: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        loader.setSyncMode();

        var content = loader.loadFiles([
            "./test/files/test.cjs"
        ]);
        test.equal(content.length, 1);
        test.equal(typeof(content[0]), 'function');

        test.done();
    },

    testLoadFilesJsSyncModeRightTypeESModule: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        loader.setSyncMode();

        var content = loader.loadFiles([
            "./test/files/a/asdf.mjs"
        ]);
        test.equal(content.length, 1);
        test.equal(typeof(content[0]), 'function');

        test.done();
    },

    testLoadFilesJsSyncModeNonExistantFile: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        loader.setSyncMode();

        var content = loader.loadFiles([
            "./test/files/testasdf.js"
        ]);
        test.equal(content.length, 1);
        test.equal(typeof(content[0]), 'undefined');

        test.done();
    },

    testLoadFilesJsSyncModeRightTypesMultiple: function(test) {
        test.expect(3);

        var loader = LoaderFactory();
        loader.setSyncMode();

        var content = loader.loadFiles([
            "./test/files/test.cjs",
            "./test/files/a/asdf.mjs"
        ]);
        test.equal(content.length, 2);
        test.equal(typeof(content[0]), 'function');
        test.equal(typeof(content[1]), 'function');

        test.done();
    },

    testLoadFilesJsSyncModeRightContent: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        loader.setSyncMode();

        var content = loader.loadFiles([
            "./test/files/test.cjs",
            "./test/files/testasdf.js",
            "./test/files/a/asdf.mjs"
        ]);
        test.deepEqual(content[0](), {
            "test": "this is a test",
            "test2": {
                "test3": "this is only a test"
            }
        });
        test.deepEqual(content[2](), {
            "name": "foo",
            "value": "asdf"
        });

        test.done();
    },

    testLoadFilesJsAsyncRightTypesMultiple: function(test) {
        test.expect(3);

        var loader = LoaderFactory();
        loader.setAsyncMode();

        loader.loadFiles([
            "./test/files/test.cjs",
            "./test/files/a/asdf.mjs"
        ]).then(content => {
            test.equal(content.length, 2);
            test.equal(typeof(content[0]), 'object');

            // transpiled by babel into an esModule structure
            // instead of a function
            test.equal(typeof(content[1]), 'object');

            test.done();
        });
    },

    testLoadFilesJsAsyncRightContent: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        loader.setAsyncMode();

        var content = loader.loadFiles([
            "./test/files/test.cjs",
            "./test/files/testasdf.js",
            "./test/files/a/asdf.mjs"
        ]).then(content => {
            test.deepEqual(content[0].default(), {
                "test": "this is a test",
                "test2": {
                    "test3": "this is only a test"
                }
            });
            test.deepEqual(content[2].default(), {
                "name": "foo",
                "value": "asdf"
            });

            test.done();
        });
    }
};
