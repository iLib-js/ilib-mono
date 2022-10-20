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

import DataCache from '../src/DataCache.js';

export const testDataCache = {
    testDataCacheConstructor: function(test) {
        test.expect(1);
        let cache = DataCache.getDataCache();

        test.equal(cache.size(), 0);

        test.done();
    },

    testDataCacheConstructorIsGlobal: function(test) {
        test.expect(1);
        let cache1 = DataCache.getDataCache();

        let cache2 = DataCache.getDataCache();

        // should be the exact same instance
        test.equal(cache1, cache2);

        test.done();
    },

    testDataCacheGetDataEmpty: function(test) {
        test.expect(1);
        let cache = DataCache.getDataCache();

        const data = cache.getData("root", "basename", new Locale("en-US"));

        // undefined = no cached information exists
        test.equal(typeof(data), 'undefined');

        test.done();
    },

    testDataCacheStoreData: function(test) {
        test.expect(2);
        let cache = DataCache.getDataCache();

        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        const data = cache.getData("root", "basename", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { x: "string" });

        test.done();
    },

    testDataCacheClearData: function(test) {
        test.expect(2);
        let cache = DataCache.getDataCache();

        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        let data = cache.getData("root", "basename", new Locale("en-US"));
        test.ok(data);

        cache.clearData();

        data = cache.getData("root", "basename", new Locale("en-US"));

        test.ok(!data);

        test.done();
    },

    testDataCacheClearDataMultiple: function(test) {
        test.expect(12);
        let cache = DataCache.getDataCache();
        cache.clearData();

        test.equal(cache.size(), 0);
        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });
        cache.storeData("root", "basename", new Locale("da-DK"), { x: "string" });
        cache.storeData("root", "basename", new Locale("ja"), { x: "string" });
        test.equal(cache.size(), 3);

        let data = cache.getData("root", "basename", new Locale("en-US"));
        test.ok(data);
        test.deepEqual(data, { x: "string" });
        data = cache.getData("root", "basename", new Locale("da-DK"));
        test.ok(data);
        test.deepEqual(data, { x: "string" });
        data = cache.getData("root", "basename", new Locale("ja"));
        test.ok(data);
        test.deepEqual(data, { x: "string" });

        cache.clearData();
        test.equal(cache.size(), 0);

        data = cache.getData("root", "basename", new Locale("en-US"));
        test.equal(typeof(data), 'undefined');
        data = cache.getData("root", "basename", new Locale("da-DK"));
        test.equal(typeof(data), 'undefined');
        data = cache.getData("root", "basename", new Locale("ja"));
        test.equal(typeof(data), 'undefined');

        test.done();
    },

    testDataCacheClearDataRightSize: function(test) {
        test.expect(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        test.equal(cache.size(), 0);
        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });
        cache.storeData("root", "basename", new Locale("da-DK"), { x: "string" });
        cache.storeData("root", "basename", new Locale("ja"), { x: "string" });
        test.equal(cache.size(), 3);

        cache.clearData();
        test.equal(cache.size(), 0);

        test.done();
    },

    testDataCacheStoreDataDifferentLocales: function(test) {
        test.expect(4);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });
        cache.storeData("root", "basename", new Locale("en"), { y: "string1" });

        let data = cache.getData("root", "basename", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { x: "string" });

        data = cache.getData("root", "basename", new Locale("en"));

        test.ok(data);
        test.deepEqual(data, { y: "string1" });

        test.done();
    },

    testDataCacheStoreDataDifferentBasenames: function(test) {
        test.expect(4);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.storeData("root", "basename1", new Locale("en-US"), { x: "string" });
        cache.storeData("root", "basename2", new Locale("en-US"), { y: "string1" });

        let data = cache.getData("root", "basename1", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { x: "string" });

        data = cache.getData("root", "basename2", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { y: "string1" });

        test.done();
    },

    testDataCacheStoreDataDifferentRoots: function(test) {
        test.expect(4);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.storeData("root1", "basename", new Locale("en-US"), { x: "string" });
        cache.storeData("root2", "basename", new Locale("en-US"), { y: "string1" });

        let data = cache.getData("root1", "basename", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { x: "string" });

        data = cache.getData("root2", "basename", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { y: "string1" });

        test.done();
    },

    testDataCacheStoreDataNoBasename: function(test) {
        test.expect(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        test.equal(cache.size(), 0);
        cache.storeData("root", undefined, new Locale("en-US"), { x: "string" });
        test.equal(cache.size(), 0);

        const data = cache.getData("root", undefined, new Locale("en-US"));

        test.equal(typeof(data), 'undefined');

        test.done();
    },

    testDataCacheStoreDataNoLocaleMeansRoot: function(test) {
        test.expect(4);
        let cache = DataCache.getDataCache();
        cache.clearData();

        test.equal(cache.size(), 0);
        // empty locale = root
        cache.storeData("root", "basename", undefined, { x: "string" });
        test.equal(cache.size(), 1);

        const data = cache.getData("root", "basename", undefined);

        test.ok(data);
        test.deepEqual(data, { x: "string" });

        test.done();
    },

    testDataCacheStoreDataNull: function(test) {
        test.expect(2);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.storeData("root", "basename", new Locale("en-US"), null);

        const data = cache.getData("root", "basename", new Locale("en-US"));

        // null = files for this locale do not exist
        test.ok(typeof(data) !== 'undefined');
        test.deepEqual(data, null);

        test.done();
    },

    testDataCacheStoreDataRightSize: function(test) {
        test.expect(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        test.equal(cache.size(), 0);
        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });
        test.equal(cache.size(), 1);
        cache.storeData("root", "basename", new Locale("en-CA"), { x: "string" });
        test.equal(cache.size(), 2);

        test.done();
    },

    testDataCacheStoreDataOverride: function(test) {
        test.expect(4);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        let data = cache.getData("root", "basename", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { x: "string" });

        cache.storeData("root", "basename", new Locale("en-US"), { z: true });

        data = cache.getData("root", "basename", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { z: true });

        test.done();
    },

    testDataCacheStoreDataOverrideRightSize: function(test) {
        test.expect(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        test.equal(cache.size(), 0);
        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        test.equal(cache.size(), 1);

        cache.storeData("root", "basename", new Locale("en-US"), { z: true });

        // overrides do not increase the size
        test.equal(cache.size(), 1);

        test.done();
    },

    testDataCacheRemoveData: function(test) {
        test.expect(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        let data = cache.getData("root", "basename", new Locale("en-US"));

        test.ok(data);
        test.deepEqual(data, { x: "string" });

        cache.removeData("root", "basename", new Locale("en-US"));

        data = cache.getData("root", "basename", new Locale("en-US"));

        test.equal(typeof(data), 'undefined');

        test.done();
    },

    testDataCacheRemoveDataRightSize: function(test) {
        test.expect(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        test.equal(cache.size(), 0);
        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        test.equal(cache.size(), 1);

        cache.removeData("root", "basename", new Locale("en-US"));

        test.equal(cache.size(), 0);

        test.done();
    },

    testDataCacheRemoveDataNoBasename: function(test) {
        test.expect(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        test.equal(cache.size(), 0);
        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        test.equal(cache.size(), 1);

        cache.removeData("root", undefined, new Locale("en-US"));

        test.equal(cache.size(), 1);

        test.done();
    },

    testDataCacheRemoveDataNoLocale: function(test) {
        test.expect(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        test.equal(cache.size(), 0);
        cache.storeData("root", "basename", new Locale("en-US"), { x: "string" });

        test.equal(cache.size(), 1);

        cache.removeData("root", "basename");

        test.equal(cache.size(), 1);

        test.done();
    },

    testDataCacheRemoveDataRootLocale: function(test) {
        test.expect(5);
        let cache = DataCache.getDataCache();
        cache.clearData();

        test.equal(cache.size(), 0);
        cache.storeData("root", "basename", undefined, { x: "string" });

        test.equal(cache.size(), 1);
        let data = cache.getData("root", "basename", undefined);

        test.deepEqual(data, { x: 'string' });

        cache.removeData("root", "basename");

        test.equal(cache.size(), 0);

        data = cache.getData("root", "basename", new Locale("en-US"));

        test.equal(typeof(data), 'undefined');

        test.done();
    },

    testDataCachemarkFileAsLoaded: function(test) {
        test.expect(2);
        let cache = DataCache.getDataCache();
        cache.clearData();

        test.ok(!cache.isLoaded("a"));

        cache.markFileAsLoaded("a");

        test.ok(cache.isLoaded("a"));

        test.done();
    },

    testDataCachemarkFileAsLoadedClear: function(test) {
        test.expect(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        test.ok(!cache.isLoaded("a"));

        cache.markFileAsLoaded("a");

        test.ok(cache.isLoaded("a"));

        cache.clearData();
        test.ok(!cache.isLoaded("a"));

        test.done();
    },

    testDataCachemarkFileAsLoadedEmpty: function(test) {
        test.expect(1);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.markFileAsLoaded("");

        test.ok(!cache.isLoaded(""));

        test.done();
    },

    testDataCachemarkFileAsLoadedUndefined: function(test) {
        test.expect(1);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.markFileAsLoaded();

        test.ok(!cache.isLoaded());

        test.done();
    },

    testDataCachemarkFileAsLoadedNonString: function(test) {
        test.expect(3);
        let cache = DataCache.getDataCache();
        cache.clearData();

        cache.markFileAsLoaded(2);
        cache.markFileAsLoaded(true);
        cache.markFileAsLoaded(function() { return true; });

        test.ok(!cache.isLoaded(2));
        test.ok(!cache.isLoaded(true));
        test.ok(!cache.isLoaded(function() { return true; }));

        test.done();
    }
};
