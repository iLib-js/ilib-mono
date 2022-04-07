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

    testLocaleDataGetRoots: function(test) {
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

    testLocaleDataAddRoot: function(test) {
        test.expect(2);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);
        locData.clearRoots();

        locData.addRoot("foobar/asf");

        test.deepEqual(locData.getRoots(), ["foobar/asf", "./test/files"]);

        test.done();
    },

    testLocaleDataAddRootMultiple: function(test) {
        test.expect(2);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);
        locData.clearRoots();

        locData.addRoot("foobar/asf");
        locData.addRoot("a/b/c");

        test.deepEqual(locData.getRoots(), ["a/b/c", "foobar/asf", "./test/files"]);

        test.done();
    },

    testLocaleDataAddRootUndefined: function(test) {
        test.expect(2);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);
        locData.clearRoots();

        locData.addRoot("foobar/asf");
        locData.addRoot(undefined);

        test.deepEqual(locData.getRoots(), ["foobar/asf", "./test/files"]);

        test.done();
    },

    testLocaleDataAddRootNull: function(test) {
        test.expect(2);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);
        locData.clearRoots();

        locData.addRoot("foobar/asf");
        locData.addRoot(null);

        test.deepEqual(locData.getRoots(), ["foobar/asf", "./test/files"]);

        test.done();
    },

    testLocaleDataAddRootNumber: function(test) {
        test.expect(2);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);
        locData.clearRoots();

        locData.addRoot("foobar/asf");
        locData.addRoot(3);

        test.deepEqual(locData.getRoots(), ["foobar/asf", "./test/files"]);

        test.done();
    },

    testLocaleDataClearRoots: function(test) {
        test.expect(2);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);

        locData.addRoot("foobar/asf");
        locData.addRoot("a/b/c");

        locData.clearRoots();

        // should only have the path of the caller left over
        test.deepEqual(locData.getRoots(), ["./test/files"]);

        test.done();
    },

    testLocaleDataRemoveRoot: function(test) {
        test.expect(3);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);
        locData.clearRoots();

        locData.addRoot("foobar/asf");
        locData.addRoot("a/b/c");

        test.deepEqual(locData.getRoots(), ["a/b/c", "foobar/asf", "./test/files"]);

        locData.removeRoot("foobar/asf");

        test.deepEqual(locData.getRoots(), ["a/b/c", "./test/files"]);
        test.done();
    },

    testLocaleDataRemoveRootMultiple: function(test) {
        test.expect(3);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);
        locData.clearRoots();

        locData.addRoot("foobar/asf");
        locData.addRoot("a/b/c");
        locData.addRoot("x/y");
        locData.addRoot("man/woman");

        test.deepEqual(locData.getRoots(), ["man/woman", "x/y", "a/b/c", "foobar/asf", "./test/files"]);

        locData.removeRoot("foobar/asf");
        locData.removeRoot("x/y");

        test.deepEqual(locData.getRoots(), ["man/woman", "a/b/c", "./test/files"]);
        test.done();
    },

    testLocaleDataRemoveRootNotThere: function(test) {
        test.expect(3);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);
        locData.clearRoots();

        locData.addRoot("foobar/asf");
        locData.addRoot("a/b/c");

        test.deepEqual(locData.getRoots(), ["a/b/c", "foobar/asf", "./test/files"]);

        locData.removeRoot("ff");

        test.deepEqual(locData.getRoots(), ["a/b/c", "foobar/asf", "./test/files"]);
        test.done();
    },

    testLocaleDataRemoveRootUndefined: function(test) {
        test.expect(3);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);
        locData.clearRoots();

        locData.addRoot("foobar/asf");
        locData.addRoot("a/b/c");

        test.deepEqual(locData.getRoots(), ["a/b/c", "foobar/asf", "./test/files"]);

        locData.removeRoot(undefined);

        test.deepEqual(locData.getRoots(), ["a/b/c", "foobar/asf", "./test/files"]);
        test.done();
    },

    testLocaleDataRemoveRootNull: function(test) {
        test.expect(3);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);
        locData.clearRoots();

        locData.addRoot("foobar/asf");
        locData.addRoot("a/b/c");

        test.deepEqual(locData.getRoots(), ["a/b/c", "foobar/asf", "./test/files"]);

        locData.removeRoot(null);

        test.deepEqual(locData.getRoots(), ["a/b/c", "foobar/asf", "./test/files"]);
        test.done();
    },

    testLocaleDataRemoveRootNumber: function(test) {
        test.expect(3);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);
        locData.clearRoots();

        locData.addRoot("foobar/asf");
        locData.addRoot("a/b/c");

        test.deepEqual(locData.getRoots(), ["a/b/c", "foobar/asf", "./test/files"]);

        locData.removeRoot(1);

        test.deepEqual(locData.getRoots(), ["a/b/c", "foobar/asf", "./test/files"]);
        test.done();
    },

    testLocaleDataRemoveRootCantRemoveBasePath: function(test) {
        test.expect(3);

        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            name: "test",
            sync: false
        });
        test.ok(locData);
        locData.clearRoots();

        locData.addRoot("foobar/asf");
        locData.addRoot("a/b/c");

        test.deepEqual(locData.getRoots(), ["a/b/c", "foobar/asf", "./test/files"]);

        locData.removeRoot("./test/files");

        test.deepEqual(locData.getRoots(), ["a/b/c", "foobar/asf", "./test/files"]);
        test.done();
    },

};
