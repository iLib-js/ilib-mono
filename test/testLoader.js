/*
 * testloader.js - test the loader
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
import LoaderFactory, { registerLoader } from '../src/index';
import MockLoader from './MockLoader';

module.exports.testLoader = {
    setUp: function(callback) {
        registerLoader(MockLoader);
        setPlatform("mock");
        callback();
    },

    testLoaderGetName: function(test) {
        test.expect(1);
        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");
        test.done();
    },

    testLoaderSupportsSync: function(test) {
        test.expect(1);
        var loader = LoaderFactory();
        test.ok(loader.supportsSync());
        test.done();
    },

    testLoadFileSync: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");

        var content = loader.loadFile("foobar.json", {sync: true});
        test.equal(content, "foobar.json");
        test.done();
    },

    testLoadFileSyncUndefinedFileName: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");

        var content = loader.loadFile(undefined, {sync: true});
        test.ok(!content);
        test.done();
    },

    testLoadFileSyncEmptyFileName: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");

        var content = loader.loadFile("", {sync: true});
        test.ok(!content);
        test.done();
    },

    testLoadFileSyncUnknownFileName: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");

        var content = loader.loadFile("unknown.json", {sync: true});
        test.ok(!content);
        test.done();
    },

    testLoadFileAsync: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");

        var promise = loader.loadFile("foobar.json", {sync: false});
        promise.then((content) => {
            test.equal(content, "foobar.json");
            test.done();
        });
    },

    testLoadFileAsyncDefault: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");

        var promise = loader.loadFile("foobar.json");
        promise.then((content) => {
            test.equal(content, "foobar.json");
            test.done();
        });
    },

    testLoadFilesSync: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");

        var content = loader.loadFiles([
            "foobar.json",
            "asdf.json",
            "blah.json"
        ], {sync: true});
        test.equalIgnoringOrder(content, [
            "foobar.json",
            "asdf.json",
            "blah.json"
        ]);
        test.done();
    },

    testLoadFilesAsync: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");

        var promise = loader.loadFiles([
            "foobar.json",
            "asdf.json",
            "blah.json"
        ], {sync: false});
        promise.then((content) => {
            test.equalIgnoringOrder(content, [
                "foobar.json",
                "asdf.json",
                "blah.json"
            ]);
            test.done();
        });
    },

    testLoadFilesSyncUndefinedFileName: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");

        var content = loader.loadFiles([
            "foobar.json",
            undefined,
            "blah.json"
        ], {sync: true});
        test.equalIgnoringOrder(content, [
            "foobar.json",
            undefined,
            "blah.json"
        ]);
        test.done();
    },

    testLoadFilesSyncEmptyFileName: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");

        var content = loader.loadFiles([
            "foobar.json",
            "",
            "blah.json"
        ], {sync: true});
        test.equalIgnoringOrder(content, [
            "foobar.json",
            undefined,
            "blah.json"
        ]);
        test.done();
    },

    testLoadFilesAsyncUndefinedFileName: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");

        var promise = loader.loadFiles([
            "foobar.json",
            undefined,
            "blah.json"
        ], {sync: false});
        promise.then((content) => {
            test.equalIgnoringOrder(content, [
                "foobar.json",
                undefined,
                "blah.json"
            ]);
            test.done();
        });
    },

    testLoadFilesAsyncEmptyFileName: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");

        var promise = loader.loadFiles([
            "foobar.json",
            "",
            "blah.json"
        ], {sync: false});
        promise.then((content) => {
            test.equalIgnoringOrder(content, [
                "foobar.json",
                undefined,
                "blah.json"
            ]);
            test.done();
        });
    },

    testLoadFilesSyncUnknownFileName: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");

        var content = loader.loadFiles([
            "foobar.json",
            "unknown.json",
            "blah.json"
        ], {sync: true});
        test.equalIgnoringOrder(content, [
            "foobar.json",
            undefined,
            "blah.json"
        ]);
        test.done();
    },

    testLoadFilesAsyncUnknownFileName: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");

        var promise = loader.loadFiles([
            "foobar.json",
            "unknown.json",
            "blah.json"
        ], {sync: false});
        promise.then((content) => {
            test.equalIgnoringOrder(content, [
                "foobar.json",
                undefined,
                "blah.json"
            ]);
            test.done();
        });
    },

    testLoadFilesSyncMode: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");
        loader.setSyncMode();

        var content = loader.loadFiles([
            "foobar.json",
            "asdf.json",
            "blah.json"
        ]);
        test.equalIgnoringOrder(content, [
            "foobar.json",
            "asdf.json",
            "blah.json"
        ]);
        test.done();
    },

    testLoadFilesAsync: function(test) {
        test.expect(2);

        var loader = LoaderFactory();
        test.equal(loader.getName(), "Mock Loader");
        loader.setAsyncMode();

        var promise = loader.loadFiles([
            "foobar.json",
            "asdf.json",
            "blah.json"
        ]);
        promise.then((content) => {
            test.equalIgnoringOrder(content, [
                "foobar.json",
                "asdf.json",
                "blah.json"
            ]);
            test.done();
        });
    }
};
