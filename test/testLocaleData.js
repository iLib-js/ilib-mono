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

        test.equal(actual, {
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

        test.equal(actual, {
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

        test.equal(actual, {
            "a": "b en",
            "c": "d en-US",
            "x": {
               "m": "n",
               "o": "p en-US"
            }
        });
        test.done();
    },
};
