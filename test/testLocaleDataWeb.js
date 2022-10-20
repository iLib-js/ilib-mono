/*
 * testLocaleDataWeb.js - test the locale data class synchronously
 * on a browser
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

import LocaleData from '../src/LocaleData.js';

export const testLocaleDataWeb = {
    testLocaleDataConstructorWebLoaderDoesntSupportSync: function(test) {
        test.expect(1);

        const locData = new LocaleData({
            path: "./test/files3",
            sync: true
        });
        test.ok(!locData.isSync());

        test.done();
    },

    testLocaleDataDoesntSupportSyncTestLoad: function(test) {
        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files3",
            sync: true
        });
        test.ok(!locData.isSync());

        // should use the default synchronicity, which is async
        const actual = locData.loadData({
            basename: "info",
            locale: "root"
        });

        test.ok(actual instanceof Promise);

        test.done();
    },

    testLocaleDataNodeSyncRoot: function(test) {
        test.expect(3);

        const locData = new LocaleData({
            path: "./test/files3"
        });

        test.ok(locData);

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();
        LocaleData.addGlobalRoot("./test/files3");

        test.ok(!LocaleData.checkCache("de-DE", "info"));

        // we request sync loading but the loader does
        // not support it and the data is not already
        // previously loaded, so it should throw an
        // exception because the data cannot be loaded
        test.throws(() => {
            const actual = locData.loadData({
                basename: "info",
                locale: "de-DE",
                sync: true
            });
        });

        test.done();
    },

    testLocaleDataNodeSyncRootPreviouslyLoaded: function(test) {
        test.expect(6);

        const locData = new LocaleData({
            path: "./test/files3"
        });

        test.ok(locData);

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();
        LocaleData.addGlobalRoot("./test/files3");

        LocaleData.ensureLocale("de-DE").then(() => {
            test.ok(LocaleData.checkCache("de-DE", "info"));

            // we request sync loading but the loader does
            // not support it. But, the data is already
            // previously loaded, so it should succeed based
            // on the cached data alone
            const actual = locData.loadData({
                basename: "info",
                locale: "de-DE",
                sync: true
            });
            test.ok(!!actual);
            test.equal(typeof(actual), "object");
            test.ok(!(actual instanceof Promise));

            const expected = {
                "a": "b de",
                "c": "d de"
            };
            test.deepEqual(actual, expected);

            test.done();
        });
    },

    testLocaleDataEnsureLocaleJsonRightDataSyncNoRoots: function(test) {
        setPlatform();

        // only do this test on browsers with webpack -- nodejs always
        // requires a global root so we know where to load files from
        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

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
