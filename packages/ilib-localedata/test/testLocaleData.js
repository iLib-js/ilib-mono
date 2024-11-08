/*
 * testLocaleData.js - test the locale data class
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

import { setPlatform, getPlatform } from 'ilib-env';
import { registerLoader } from 'ilib-loader';

import MockLoader from './MockLoader.js';
import LocaleData from '../src/LocaleData.js';

export const testLocaleData = {
    testLocaleDataConstructor: function(test) {
        test.expect(1);
        const locData = new LocaleData({
            path: "./test/files",
            name: "test"
        });
        test.ok(locData);
        test.done();
    },

    testLocaleDataConstructorNoPath: function(test) {
        test.expect(1);
        test.throws((test) => {
            new LocaleData({
                name: "test"
            });
        });
        test.done();
    },

    testLocaleDataConstructorNoSync: function(test) {
        test.expect(1);
        const locData = new LocaleData({
            path: "./test/files",
            name: "test"
        });
        test.ok(!locData.isSync());

        test.done();
    },

    testLocaleDataConstructorLoaderDoesntSupportSync: function(test) {
        test.expect(1);
        registerLoader(MockLoader);
        setPlatform("mock");

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        test.ok(!locData.isSync());

        // clean up
        setPlatform(undefined);

        test.done();
    },

    testLocaleDataGetGlobalRootsEmpty: function(test) {
        setPlatform();
        test.expect(1);

        LocaleData.clearGlobalRoots();

        // should be empty now
        test.deepEqual(LocaleData.getGlobalRoots(), []);

        test.done();
    },


    testLocaleDataGetRootsEmpty: function(test) {
        test.expect(2);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });
        test.ok(locData);

        // should have the path of caller in it only
        test.deepEqual(locData.getRoots(), ["./test/files"]);

        test.done();
    },

    testLocaleDataAddGlobalRoot: function(test) {
        test.expect(1);

        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");

        test.deepEqual(LocaleData.getGlobalRoots(), ["foobar/asf"]);

        test.done();
    },

    testLocaleDataAddGlobalRootTwice: function(test) {
        test.expect(1);

        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        // should not add the second one because it's already there
        LocaleData.addGlobalRoot("foobar/asf");

        test.deepEqual(LocaleData.getGlobalRoots(), ["foobar/asf"]);

        test.done();
    },

    testLocaleDataAddGlobalRootInLocData: function(test) {
        test.expect(2);

        setPlatform();

        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });
        test.ok(locData);

        LocaleData.addGlobalRoot("foobar/asf");

        test.deepEqual(locData.getRoots(), ["foobar/asf", "./test/files"]);

        test.done();
    },

    testLocaleDataAddGlobalRootMultiple: function(test) {
        test.expect(1);

        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        // in reverse order
        test.deepEqual(LocaleData.getGlobalRoots(), ["a/b/c", "foobar/asf"]);

        test.done();
    },

    testLocaleDataAddGlobalRootUndefined: function(test) {
        test.expect(1);

        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot(undefined);

        test.deepEqual(LocaleData.getGlobalRoots(), ["foobar/asf"]);

        test.done();
    },

    testLocaleDataAddGlobalRootNull: function(test) {
        test.expect(1);

        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot(null);

        test.deepEqual(LocaleData.getGlobalRoots(), ["foobar/asf"]);

        test.done();
    },

    testLocaleDataAddGlobalRootNumber: function(test) {
        test.expect(1);

        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot(3);

        test.deepEqual(LocaleData.getGlobalRoots(), ["foobar/asf"]);

        test.done();
    },

    testLocaleDataClearGlobalRoot: function(test) {
        test.expect(1);

        setPlatform();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        LocaleData.clearGlobalRoots();

        // should only have the path of the caller left over
        test.deepEqual(LocaleData.getGlobalRoots(), []);

        test.done();
    },

    testLocaleDataRemoveGlobalRoot: function(test) {
        test.expect(2);

        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        test.deepEqual(LocaleData.getGlobalRoots(), ["a/b/c", "foobar/asf"]);

        LocaleData.removeGlobalRoot("foobar/asf");

        test.deepEqual(LocaleData.getGlobalRoots(), ["a/b/c"]);
        test.done();
    },

    testLocaleDataRemoveGlobalRootMultiple: function(test) {
        test.expect(2);

        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");
        LocaleData.addGlobalRoot("x/y");
        LocaleData.addGlobalRoot("man/woman");

        test.deepEqual(LocaleData.getGlobalRoots(), ["man/woman", "x/y", "a/b/c", "foobar/asf"]);

        LocaleData.removeGlobalRoot("foobar/asf");
        LocaleData.removeGlobalRoot("x/y");

        test.deepEqual(LocaleData.getGlobalRoots(), ["man/woman", "a/b/c"]);
        test.done();
    },

    testLocaleDataRemoveGlobalRootNotThere: function(test) {
        test.expect(2);

        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        test.deepEqual(LocaleData.getGlobalRoots(), ["a/b/c", "foobar/asf"]);

        LocaleData.removeGlobalRoot("ff");

        test.deepEqual(LocaleData.getGlobalRoots(), ["a/b/c", "foobar/asf"]);
        test.done();
    },

    testLocaleDataRemoveGlobalRootUndefined: function(test) {
        test.expect(2);

        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        test.deepEqual(LocaleData.getGlobalRoots(), ["a/b/c", "foobar/asf"]);

        LocaleData.removeGlobalRoot(undefined);

        test.deepEqual(LocaleData.getGlobalRoots(), ["a/b/c", "foobar/asf"]);
        test.done();
    },

    testLocaleDataRemoveGlobalRootNull: function(test) {
        test.expect(2);

        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        test.deepEqual(LocaleData.getGlobalRoots(), ["a/b/c", "foobar/asf"]);

        LocaleData.removeGlobalRoot(null);

        test.deepEqual(LocaleData.getGlobalRoots(), ["a/b/c", "foobar/asf"]);
        test.done();
    },

    testLocaleDataRemoveGlobalRootNumber: function(test) {
        test.expect(2);

        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        test.deepEqual(LocaleData.getGlobalRoots(), ["a/b/c", "foobar/asf"]);

        LocaleData.removeGlobalRoot(1);

        test.deepEqual(LocaleData.getGlobalRoots(), ["a/b/c", "foobar/asf"]);
        test.done();
    },

    testLocaleDataRemoveGlobalRootCantRemoveBasePath: function(test) {
        test.expect(3);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });
        test.ok(locData);
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");
        LocaleData.addGlobalRoot("a/b/c");

        test.deepEqual(locData.getRoots(), ["a/b/c", "foobar/asf", "./test/files"]);

        // can't remove this because it's not a global root
        LocaleData.removeGlobalRoot("./test/files");

        test.deepEqual(locData.getRoots(), ["a/b/c", "foobar/asf", "./test/files"]);
        test.done();
    },

    testLocaleDataEnsureLocale: function(test) {
        test.expect(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        LocaleData.ensureLocale("en-US").then(result => {
            test.ok(result);
            test.done();
        });
    },

    testLocaleDataEnsureLocaleNoDataAvailable: function(test) {
        test.expect(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        LocaleData.ensureLocale("nl-NL").then(result => {
            // there is no nl-NL file there
            test.ok(result);
            test.done();
        });
    },

    testLocaleDataEnsureLocaleDataIsCached: function(test) {
        test.expect(14);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        LocaleData.ensureLocale("en-US").then(result => {
            test.ok(result);

            test.ok(LocaleData.checkCache("en-US", "info"));
            test.ok(LocaleData.checkCache("en-US", "foo"));
            test.ok(!LocaleData.checkCache("de-DE", "info"));
            test.ok(!LocaleData.checkCache("de-DE", "foo"));
            test.ok(!LocaleData.checkCache("fr-FR", "info"));
            test.ok(!LocaleData.checkCache("fr-FR", "foo"));

            LocaleData.ensureLocale("de-DE").then(result2 => {
                test.ok(result2);

                // make sure the English is still there after loading the German too
                test.ok(LocaleData.checkCache("en-US", "info"));
                test.ok(LocaleData.checkCache("en-US", "foo"));
                test.ok(LocaleData.checkCache("de-DE", "info"));
                test.ok(LocaleData.checkCache("de-DE", "foo"));
                test.ok(!LocaleData.checkCache("fr-FR", "info"));
                test.ok(!LocaleData.checkCache("fr-FR", "foo"));
                test.done();
            });
        });
    },

    testLocaleDataEnsureLocaleRightDataAsync: function(test) {
        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        LocaleData.ensureLocale("en-US").then(result => {
            test.ok(result);

            const locData = new LocaleData({
                path: "./test/files",
                sync: false
            });

            locData.loadData({
                sync: false,
                locale: "en-US",
                basename: "info"
            }).then(data => {
                test.deepEqual(data, {
                    "a": "b en",
                    "c": "d en"
                });
                test.done();
            });
        });
    },

    testLocaleDataEnsureLocaleRightDataSync: function(test) {
        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        LocaleData.ensureLocale("en-US").then(result => {
            test.ok(result);

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

            test.deepEqual(data, {
                "a": "b en",
                "c": "d en"
            });
            test.done();
        });
    },

    testLocaleDataEnsureLocaleNonExistantLocaleMeansNothingCached: function(test) {
        test.expect(13);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        test.ok(!LocaleData.checkCache("en-US", "info"));
        test.ok(!LocaleData.checkCache("en-US", "foo"));
        test.ok(!LocaleData.checkCache("de-DE", "info"));
        test.ok(!LocaleData.checkCache("de-DE", "foo"));
        test.ok(!LocaleData.checkCache("fr-FR", "info"));
        test.ok(!LocaleData.checkCache("fr-FR", "foo"));

        LocaleData.addGlobalRoot("./test/files3");
        LocaleData.ensureLocale("fr-FR").then(result => {
            // true because root was loaded
            test.ok(result);

            // still no locale data because there was none to load
            test.ok(!LocaleData.checkCache("en-US", "info"));
            test.ok(!LocaleData.checkCache("en-US", "foo"));
            test.ok(!LocaleData.checkCache("de-DE", "info"));
            test.ok(!LocaleData.checkCache("de-DE", "foo"));
            test.ok(LocaleData.checkCache("fr-FR", "info"));
            test.ok(LocaleData.checkCache("fr-FR", "foo"));
            test.done();
        });
    },

    testLocaleDataEnsureLocaleNonExistantDataUsesRoot: function(test) {
        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        LocaleData.ensureLocale("fr-FR").then(result => {
            test.ok(result);

            const locData = new LocaleData({
                path: "./test/files",
                sync: false
            });

            // loads the root data only because fr-FR does
            // not exist
            let data = locData.loadData({
                sync: true,
                locale: "fr-FR",
                basename: "info"
            });

            test.deepEqual(data, {
                "a": "b root",
                "c": "d root"
            });
            test.done();
        });
    },

    testLocaleDataEnsureLocaleUndefined: function(test) {
        test.expect(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        test.throws(() => {
            LocaleData.ensureLocale().then(result => {
                test.fail();
            });
        });
        test.done();
    },

    testLocaleDataEnsureLocaleNull: function(test) {
        test.expect(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        test.throws(() => {
            LocaleData.ensureLocale(null).then(result => {
                test.fail();
            });
        });
        test.done();
    },

    testLocaleDataEnsureLocaleBoolean: function(test) {
        test.expect(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        test.throws(() => {
            LocaleData.ensureLocale(true).then(result => {
                test.fail();
            });
        });
        test.done();
    },

    testLocaleDataEnsureLocaleNumber: function(test) {
        test.expect(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        test.throws(() => {
            LocaleData.ensureLocale(4).then(result => {
                test.fail();
            });
        });
        test.done();
    },

    testLocaleDataEnsureLocaleJson: function(test) {
        test.expect(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        LocaleData.ensureLocale("ja-JP").then(result => {
            test.ok(result);
            test.done();
        });
    },

    testLocaleDataEnsureLocaleJsonNoDataAvailable: function(test) {
        test.expect(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        LocaleData.ensureLocale("nl-NL").then(result => {
            // there is no nl-NL file there
            test.ok(result);
            test.done();
        });
    },

    testLocaleDataEnsureLocaleJsonDataIsCached: function(test) {
        test.expect(14);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        LocaleData.ensureLocale("ja-JP").then(result => {
            test.ok(result);

            test.ok(LocaleData.checkCache("ja-JP", "info"));
            test.ok(LocaleData.checkCache("ja-JP", "foo"));
            test.ok(!LocaleData.checkCache("zh-Hans-CN", "info"));
            test.ok(!LocaleData.checkCache("zh-Hans-CN", "foo"));
            test.ok(!LocaleData.checkCache("fr-FR", "info"));
            test.ok(!LocaleData.checkCache("fr-FR", "foo"));

            LocaleData.ensureLocale("zh-Hans-CN").then(result2 => {
                test.ok(result2);

                // make sure the English is still there after loading the German too
                test.ok(LocaleData.checkCache("ja-JP", "info"));
                test.ok(LocaleData.checkCache("ja-JP", "foo"));
                test.ok(LocaleData.checkCache("zh-Hans-CN", "info"));
                test.ok(LocaleData.checkCache("zh-Hans-CN", "foo"));
                test.ok(!LocaleData.checkCache("fr-FR", "info"));
                test.ok(!LocaleData.checkCache("fr-FR", "foo"));
                test.done();
            });
        });
    },

    testLocaleDataEnsureLocaleJsonRightDataAsync: function(test) {
        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        LocaleData.ensureLocale("ja-JP").then(result => {
            test.ok(result);

            const locData = new LocaleData({
                path: "./test/files3"
            });

            locData.loadData({
                sync: false,
                locale: "ja-JP",
                basename: "info"
            }).then(data => {
                test.deepEqual(data, {
                    "a": "b ja",
                    "c": "d ja"
                });
                test.done();
            });
        });
    },

    testLocaleDataEnsureLocaleJsonRightDataSync: function(test) {
        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/files3");
        LocaleData.ensureLocale("ja-JP").then(result => {
            test.ok(result);

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

            test.deepEqual(data, {
                "a": "b ja",
                "c": "d ja"
            });
            test.done();
        });
    }
};
