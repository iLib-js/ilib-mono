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

import MockLoader from './MockLoader';
import LocaleData from '../src/LocaleData';

module.exports.testLocaleData = {
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

    testLocaleDataConstructorNoPackage: function(test) {
        test.expect(1);
        test.throws(() => {
            new LocaleData({
                path: "./test/files"
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
            name: "test",
            sync: true
        });
        test.ok(!locData.isSync());

        // clean up
        setPlatform(undefined);

        test.done();
    },

    testLocaleDataNodeSyncRoot: function(test) {
       test.expect(3);

       setPlatform();

        // only do this test on nodejs
        if (getPlatform() !== "nodejs") {
            test.done();
            return;
        }
        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: true
        });

        test.ok(locData);
        const actual = locData.loadData({
            basename: "tester",
            locale: "root"
        });

        test.deepEqual(actual, {
            "a": "b",
            "c": "d",
            "x": {
               "m": "n",
               "o": "p"
            }
        });
        test.done();
    },

    testLocaleDataNodeSyncen: function(test) {
        test.expect(3);

        setPlatform();

        // only do this test on nodejs
        if (getPlatform() !== "nodejs") {
            test.done();
            return;
        }
        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: true
        });

        test.ok(locData);
        const actual = locData.loadData({
            basename: "tester",
            locale: "en"
        });

        test.deepEqual(actual, {
            "a": "b en",
            "c": "d",
            "x": {
               "m": "n",
               "o": "p en"
            }
        });
        test.done();
    },

    testLocaleDataNodeSyncenUS: function(test) {
        test.expect(3);

        setPlatform();

        // only do this test on nodejs
        if (getPlatform() !== "nodejs") {
            test.done();
            return;
        }
        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: true
        });

        test.ok(locData);
        const actual = locData.loadData({
            basename: "tester",
            locale: "en-US"
        });

        test.deepEqual(actual, {
            "a": "b en",
            "c": "d en-US",
            "x": {
               "m": "n",
               "o": "p en-US"
            }
        });
        test.done();
    },

    testLocaleDataNodeAsyncRoot: function(test) {
        test.expect(3);

        setPlatform();

        // only do this test on nodejs
        if (getPlatform() !== "nodejs") {
            test.done();
            return;
        }
        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });

        test.ok(locData);
        locData.loadData({
            basename: "tester",
            locale: "root"
        }).then((actual) => {
            test.deepEqual(actual, {
                "a": "b",
                "c": "d",
                "x": {
                   "m": "n",
                   "o": "p"
                }
            });
            test.done();
        });
    },

    testLocaleDataNodeAsyncen: function(test) {
        test.expect(3);

        setPlatform();

        // only do this test on nodejs
        if (getPlatform() !== "nodejs") {
            test.done();
            return;
        }
        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });

        test.ok(locData);
        locData.loadData({
            basename: "tester",
            locale: "en"
        }).then((actual) => {
            test.deepEqual(actual, {
                "a": "b en",
                "c": "d",
                "x": {
                   "m": "n",
                   "o": "p en"
                }
            });
            test.done();
        });
    },

    testLocaleDataNodeAsyncenUS: function(test) {
        test.expect(3);

        setPlatform();

        // only do this test on nodejs
        if (getPlatform() !== "nodejs") {
            test.done();
            return;
        }
        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);

        locData.loadData({
            basename: "tester",
            locale: "en-US"
        }).then((actual) => {
            test.deepEqual(actual, {
                "a": "b en",
                "c": "d en-US",
                "x": {
                   "m": "n",
                   "o": "p en-US"
                }
            });
            test.done();
        });
    },

    testLocaleDataGetGlobalRootsEmpty: function(test) {
        test.expect(1);

        setPlatform();

        // should have the path of caller in it only
        test.deepEqual(LocaleData.getGlobalRoots(), []);

        test.done();
    },


    testLocaleDataGetRootsEmpty: function(test) {
        test.expect(2);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);

        // should have the path of caller in it only
        test.deepEqual(locData.getRoots(), ["./test/files"]);

        test.done();
    },

    testLocaleDataAddGlobalRoot: function(test) {
        test.expect(2);

        setPlatform();

        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("foobar/asf");

        test.deepEqual(LocaleData.getGlobalRoots(), ["foobar/asf"]);

        test.done();
    },

    testLocaleDataAddGlobalRoot: function(test) {
        test.expect(2);

        setPlatform();

        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
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
            name: "test",
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

    testLocaleDataNodeSyncWithRoots: function(test) {
        test.expect(3);

        setPlatform();

        // only do this test on nodejs
        if (getPlatform() !== "nodejs") {
            test.done();
            return;
        }
        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: true
        });
        LocaleData.addGlobalRoot("./test/files2");

        test.ok(locData);
        const actual = locData.loadData({
            basename: "tester",
            locale: "en-US"
        });


        test.deepEqual(actual, {
            "a": "b en from files2",
            "c": "d en-US",
            "x": {
               "m": "n",
               "o": "p en-US"
            }
        });
        test.done();
    },

    testLocaleDataNodeAsyncWithRoots: function(test) {
        test.expect(3);

        setPlatform();

        // only do this test on nodejs
        if (getPlatform() !== "nodejs") {
            test.done();
            return;
        }
        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);

        LocaleData.addGlobalRoot("./test/files2");

        locData.loadData({
            basename: "tester",
            locale: "en-US"
        }).then((actual) => {
            test.deepEqual(actual, {
                "a": "b en from files2",
                "c": "d en-US",
                "x": {
                   "m": "n",
                   "o": "p en-US"
                }
            });
            test.done();
        });
    },

    testLocaleDataNodeSyncWithRootsjaJP: function(test) {
        test.expect(3);

        setPlatform();

        // only do this test on nodejs
        if (getPlatform() !== "nodejs") {
            test.done();
            return;
        }
        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: true
        });
        LocaleData.addGlobalRoot("./test/files2");

        test.ok(locData);
        const actual = locData.loadData({
            basename: "tester",
            locale: "ja-JP"
        });


        test.deepEqual(actual, {
            "a": "b ja-JP from files2",
            "c": "d ja",
            "x": {
               "m": "n ja-JP from files2",
               "o": "p ja"
            }
        });
        test.done();
    },

    testLocaleDataNodeAsyncWithRootsjaJP: function(test) {
        test.expect(3);

        setPlatform();

        // only do this test on nodejs
        if (getPlatform() !== "nodejs") {
            test.done();
            return;
        }
        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);

        LocaleData.addGlobalRoot("./test/files2");

        locData.loadData({
            basename: "tester",
            locale: "ja-JP"
        }).then((actual) => {
            test.deepEqual(actual, {
                "a": "b ja-JP from files2",
                "c": "d ja",
                "x": {
                   "m": "n ja-JP from files2",
                   "o": "p ja"
                }
            });
            test.done();
        });
    },

};
