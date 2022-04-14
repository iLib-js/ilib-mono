/*
 * testDataCache.js - test the data cache class
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

import Locale from 'ilib-locale';

import DataCache from '../src/DataCache';

module.exports.testDataCache = {
    testDataCacheConstructor: function(test) {
        test.expect(2);
        let cache = new DataCache({packageName: "test"});

        test.equal(cache.getPackage(), "test");
        test.equal(cache.size(), 0);

        test.done();
    },

    testDataCacheGetDataEmpty: function(test) {
        test.expect(1);
        let cache = new DataCache({packageName: "test"});

        const data = cache.getData("basename", new Locale("en-US"));

        // undefined = no cached information exists
        test.equal(typeof(data), 'undefined');

        test.done();
    },

    testDataCacheStoreData: function(test) {
        test.expect(2);
        let cache = new DataCache({packageName: "test"});

        cache.storeData("basename", new Locale("en-US"), { x: "string" });

        const data = cache.getData("basename", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { x: "string" });

        test.done();
    },

    testDataCacheStoreDataDifferentLocales: function(test) {
        test.expect(4);
        let cache = new DataCache({packageName: "test"});

        cache.storeData("basename", new Locale("en-US"), { x: "string" });
        cache.storeData("basename", new Locale("en"), { y: "string1" });

        let data = cache.getData("basename", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { x: "string" });

        data = cache.getData("basename", new Locale("en"));

        test.ok(data);
        test.deepEqual(data, { y: "string1" });

        test.done();
    },

    testDataCacheStoreDataDifferentBasenames: function(test) {
        test.expect(4);
        let cache = new DataCache({packageName: "test"});

        cache.storeData("basename1", new Locale("en-US"), { x: "string" });
        cache.storeData("basename2", new Locale("en-US"), { y: "string1" });

        let data = cache.getData("basename1", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { x: "string" });

        data = cache.getData("basename2", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { y: "string1" });

        test.done();
    },

    testDataCacheStoreDataNoBasename: function(test) {
        test.expect(3);
        let cache = new DataCache({packageName: "test"});

        test.equal(cache.size(), 0);
        cache.storeData(undefined, new Locale("en-US"), { x: "string" });
        test.equal(cache.size(), 0);

        const data = cache.getData(undefined, new Locale("en-US"));

        test.equal(typeof(data), 'undefined');

        test.done();
    },

    testDataCacheStoreDataNoLocaleMeansRoot: function(test) {
        test.expect(4);
        let cache = new DataCache({packageName: "test"});

        test.equal(cache.size(), 0);
        // empty locale = root
        cache.storeData("basename", undefined, { x: "string" });
        test.equal(cache.size(), 1);

        const data = cache.getData("basename", undefined);

        test.ok(data);
        test.deepEqual(data, { x: "string" });

        test.done();
    },

    testDataCacheStoreDataNull: function(test) {
        test.expect(2);
        let cache = new DataCache({packageName: "test"});

        cache.storeData("basename", new Locale("en-US"), null);

        const data = cache.getData("basename", new Locale("en-US"));

        // null = files for this locale do not exist
        test.ok(typeof(data) != 'undefined');
        test.deepEqual(data, null);

        test.done();
    },

    testDataCacheStoreDataRightSize: function(test) {
        test.expect(3);
        let cache = new DataCache({packageName: "test"});

        test.equal(cache.size(), 0);
        cache.storeData("basename", new Locale("en-US"), { x: "string" });
        test.equal(cache.size(), 1);
        cache.storeData("basename", new Locale("en-CA"), { x: "string" });
        test.equal(cache.size(), 2);

        test.done();
    },

    testDataCacheStoreDataOverride: function(test) {
        test.expect(4);
        let cache = new DataCache({packageName: "test"});

        cache.storeData("basename", new Locale("en-US"), { x: "string" });

        let data = cache.getData("basename", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { x: "string" });

        cache.storeData("basename", new Locale("en-US"), { z: true });

        data = cache.getData("basename", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { z: true });

        test.done();
    },

    testDataCacheStoreDataOverrideRightSize: function(test) {
        test.expect(3);
        let cache = new DataCache({packageName: "test"});

        test.equal(cache.size(), 0);
        cache.storeData("basename", new Locale("en-US"), { x: "string" });

        test.equal(cache.size(), 1);

        cache.storeData("basename", new Locale("en-US"), { z: true });

        // overrides do not increase the size
        test.equal(cache.size(), 1);

        test.done();
    },

    testDataCacheRemoveData: function(test) {
        test.expect(3);
        let cache = new DataCache({packageName: "test"});

        cache.storeData("basename", new Locale("en-US"), { x: "string" });

        let data = cache.getData("basename", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { x: "string" });

        cache.removeData("basename", new Locale("en-US"));

        data = cache.getData("basename", new Locale("en-US"));

        test.equal(typeof(data), 'undefined');

        test.done();
    },

    testDataCacheRemoveDataRightSize: function(test) {
        test.expect(3);
        let cache = new DataCache({packageName: "test"});

        test.equal(cache.size(), 0);
        cache.storeData("basename", new Locale("en-US"), { x: "string" });

        test.equal(cache.size(), 1);

        cache.removeData("basename", new Locale("en-US"));

        test.equal(cache.size(), 0);

        test.done();
    },

    testDataCacheRemoveDataNoBasename: function(test) {
        test.expect(3);
        let cache = new DataCache({packageName: "test"});

        test.equal(cache.size(), 0);
        cache.storeData("basename", new Locale("en-US"), { x: "string" });

        test.equal(cache.size(), 1);

        cache.removeData(undefined, new Locale("en-US"));

        test.equal(cache.size(), 1);

        test.done();
    },

    testDataCacheRemoveDataNoLocale: function(test) {
        test.expect(3);
        let cache = new DataCache({packageName: "test"});

        test.equal(cache.size(), 0);
        cache.storeData("basename", new Locale("en-US"), { x: "string" });

        test.equal(cache.size(), 1);

        cache.removeData("basename");

        test.equal(cache.size(), 1);

        test.done();
    },

    testDataCacheRemoveDataRootLocale: function(test) {
        test.expect(5);
        let cache = new DataCache({packageName: "test"});

        test.equal(cache.size(), 0);
        cache.storeData("basename", undefined, { x: "string" });

        test.equal(cache.size(), 1);
        let data = cache.getData("basename", undefined);

        test.deepEqual(data, { x: 'string' });

        cache.removeData("basename");

        test.equal(cache.size(), 0);

        data = cache.getData("basename", new Locale("en-US"));

        test.equal(typeof(data), 'undefined');

        test.done();
    },

    testDataCacheClearData: function(test) {
        test.expect(12);
        let cache = new DataCache({packageName: "test"});

        test.equal(cache.size(), 0);
        cache.storeData("basename", new Locale("en-US"), { x: "string" });
        cache.storeData("basename", new Locale("da-DK"), { x: "string" });
        cache.storeData("basename", new Locale("ja"), { x: "string" });
        test.equal(cache.size(), 3);

        let data = cache.getData("basename", new Locale("en-US"));
        test.ok(data);
        test.deepEqual(data, { x: "string" });
        data = cache.getData("basename", new Locale("da-DK"));
        test.ok(data);
        test.deepEqual(data, { x: "string" });
        data = cache.getData("basename", new Locale("ja"));
        test.ok(data);
        test.deepEqual(data, { x: "string" });

        cache.clearData();
        test.equal(cache.size(), 0);

        data = cache.getData("basename", new Locale("en-US"));
        test.equal(typeof(data), 'undefined');
        data = cache.getData("basename", new Locale("da-DK"));
        test.equal(typeof(data), 'undefined');
        data = cache.getData("basename", new Locale("ja"));
        test.equal(typeof(data), 'undefined');

        test.done();
    },

    testDataCacheClearDataRightSize: function(test) {
        test.expect(3);
        let cache = new DataCache({packageName: "test"});

        test.equal(cache.size(), 0);
        cache.storeData("basename", new Locale("en-US"), { x: "string" });
        cache.storeData("basename", new Locale("da-DK"), { x: "string" });
        cache.storeData("basename", new Locale("ja"), { x: "string" });
        test.equal(cache.size(), 3);

        cache.clearData();
        test.equal(cache.size(), 0);

        test.done();
    }
};
