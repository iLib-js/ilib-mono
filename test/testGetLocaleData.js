/*
 * testGetLocaleData.js - test the locale data factory method
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
import getLocaleData, { clearLocaleData } from '../src/index.js';

export const testGetLocaleData = {
    testGetLocaleData: function(test) {
        test.expect(1);
        const locData = getLocaleData({
            path: "./test/files"
        });
        test.ok(locData);
        test.done();
    },

    testGetLocaleDataNoPath: function(test) {
        test.expect(1);
        test.throws((test) => {
            getLocaleData({
                name: "test"
            });
        });
        test.done();
    },

    testGetLocaleDataNoOptions: function(test) {
        test.expect(1);
        test.throws(() => {
            getLocaleData();
        });
        test.done();
    },

    testGetLocaleDataEmptyPath: function(test) {
        test.expect(1);
        test.throws((test) => {
            getLocaleData({
                path: "",
                name: "test"
            });
        });
        test.done();
    },

    testGetLocaleDataNullPath: function(test) {
        test.expect(1);
        test.throws((test) => {
            getLocaleData({
                path: null,
                name: "test"
            });
        });
        test.done();
    },

    testGetLocaleDataNoSync: function(test) {
        test.expect(1);

        clearLocaleData();

        const locData = getLocaleData({
            path: "./test/files",
        });

        test.ok(!locData.isSync());
        test.done();
    },

    testGetLocaleDataSync: function(test) {
        test.expect(2);

        setPlatform("nodejs");
        clearLocaleData();

        const locData = getLocaleData({
            path: "./test/files",
            sync: true
        });

        test.ok(locData);
        test.ok(locData.isSync());

        setPlatform(undefined);
        test.done();
    },

    testLocaleDataSingleton: function(test) {
        test.expect(3);
        clearLocaleData();

        const locData1 = getLocaleData({
            path: "./test/files",
            sync: false
        });
        test.ok(locData1);

        // same params means same instance
        const locData2 = getLocaleData({
            path: "./test/files",
            sync: false
        });
        test.ok(locData2);

        test.equal(locData1, locData2);
        test.done();
    },

    testLocaleDataSingletonPerPath: function(test) {
        test.expect(5);
        clearLocaleData();

        const locData1 = getLocaleData({
            path: "./test/files",
            sync: false
        });
        test.ok(locData1);

        // different params means different instance
        const locData2 = getLocaleData({
            path: "./test/files2",
            sync: false
        });
        test.ok(locData2);

        test.equal(locData1.getPath(), "./test/files");
        test.equal(locData2.getPath(), "./test/files2");
        test.notEqual(locData1, locData2);
        test.done();
    }
};
