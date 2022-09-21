/*
 * testLocaleData.js - test the locale data class on nodejs
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

import LocaleData from '../src/LocaleData.js';

export const testLocaleDataNode = {
    testLocaleDataNodeSyncRoot: function(test) {
        setPlatform();

        test.expect(2);

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
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

        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files",
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

        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files",
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

        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files",
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

        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files",
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

        test.expect(2);

        const locData = new LocaleData({
            path: "./test/files",
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

    testLocaleDataNodeSyncWithRoots: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
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
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
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
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
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
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
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

    testLocaleDataCacheData: function(test) {
        setPlatform();

        test.expect(3);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        test.ok(locData);
        LocaleData.addGlobalRoot("./test/files2");

        let actual = locData.loadData({
            basename: "tester",
            locale: "de-DE"
        });

        // root data because there is no de-DE data
        test.deepEqual(actual, {
            "a": "b",
            "c": "d",
            "x": {
                "m": "n",
                "o": "p"
            }
        });

        LocaleData.cacheData({
            "de": {
                "tester": {
                    "a": "b de",
                    "x": {
                        "m": "n de",
                    }
                }
            },
            "de-DE": {
                "tester": {
                    "a": "b de-DE",
                    "x": {
                        "o": "p de-DE"
                    }
                }
            }
        }, "./test/files2");

        // make sure it used the cache
        actual = locData.loadData({
            basename: "tester",
            locale: "de-DE"
        });

        test.deepEqual(actual, {
            "a": "b de-DE",
            "c": "d",
            "x": {
                "m": "n de",
                "o": "p de-DE"
            }
        });
        test.done();
    },

    testLocaleDataCheckCache: function(test) {
        setPlatform();

        test.expect(3);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        test.ok(locData);
        LocaleData.addGlobalRoot("./test/files2");

        // there is no de-DE data, but there is root data which we
        // should ignore for the purposes of cache checking
        test.ok(!LocaleData.checkCache("de-DE", "tester"));

        LocaleData.cacheData({
            "de": {
                "tester": {
                    "a": "b de",
                    "x": {
                        "m": "n de",
                    }
                }
            },
            "de-DE": {
                "tester": {
                    "a": "b de-DE",
                    "x": {
                        "o": "p de-DE"
                    }
                }
            }
        }, "./test/files2");

        test.ok(LocaleData.checkCache("de-DE", "tester"));

        test.done();
    },

    testLocaleDataCheckCacheLoadingFilesFillsCache: function(test) {
        setPlatform();

        test.expect(4);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        LocaleData.addGlobalRoot("./test/files2");

        // there is no en-US data, but there is root data which we
        // should ignore for the purposes of cache checking
        test.ok(!LocaleData.checkCache("en-US", "tester"));

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

        // the loadData above should have populated the cache
        test.ok(LocaleData.checkCache("en-US", "tester"));

        test.done();
    },

    testLocaleDataCheckCacheDataLoadedButNoContentAvailable: function(test) {
        setPlatform();

        test.expect(3);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        test.ok(locData);
        LocaleData.addGlobalRoot("./test/files2");

        // there is no de-DE data, but there is root data which we
        // should ignore for the purposes of cache checking
        test.ok(!LocaleData.checkCache("de-DE", "tester"));

        // null indicates that we attempted to load the data, but there
        // isn't any to load, so we shouldn't try again
        LocaleData.cacheData({
            "de": {
                "tester": null
            },
            "de-DE": {
                "tester": null
            }
        }, "./test/files2");

        // true = everything that can be loaded is loaded
        test.ok(LocaleData.checkCache("de-DE", "tester"));

        test.done();
    },

    testLocaleDataDataIsCached: function(test) {
        setPlatform();

        test.expect(4);
        LocaleData.clearCache();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        LocaleData.addGlobalRoot("./test/files2");

        test.ok(locData);
        let actual = locData.loadData({
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

        const locData2 = new LocaleData({
            path: "./test/files",
            sync: true
        });
        LocaleData.addGlobalRoot("./test/files2");

        test.ok(locData);

        actual = locData.loadData({
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

    testLocaleDataClearCache: function(test) {
        setPlatform();

        test.expect(4);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        test.ok(locData);
        LocaleData.addGlobalRoot("./test/files2");

        // there is no de-DE data, but there is root data which we
        // should ignore for the purposes of cache checking
        test.ok(!LocaleData.checkCache("de-DE", "tester"));

        LocaleData.cacheData({
            "de": {
                "tester": {
                    "a": "b de",
                    "x": {
                        "m": "n de",
                    }
                }
            },
            "de-DE": {
                "tester": {
                    "a": "b de-DE",
                    "x": {
                        "o": "p de-DE"
                    }
                }
            }
        }, "./test/files2");

        test.ok(LocaleData.checkCache("de-DE", "tester"));

        // dangerous: clears the cache for all the packages!
        LocaleData.clearCache();

        test.ok(!LocaleData.checkCache("de-DE", "tester"));

        test.done();
    },

    testLocaleDataCheckCacheNoBasename: function(test) {
        setPlatform();

        test.expect(3);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        test.ok(locData);
        LocaleData.addGlobalRoot("./test/files2");

        // there is no de-DE data, but there is root data which we
        // should ignore for the purposes of cache checking
        test.ok(!LocaleData.checkCache("de-DE"));

        LocaleData.cacheData({
            "de": {
                "tester": {
                    "a": "b de",
                    "x": {
                        "m": "n de",
                    }
                }
            },
            "de-DE": {
                "tester": {
                    "a": "b de-DE",
                    "x": {
                        "o": "p de-DE"
                    }
                }
            }
        }, "./test/files2");

        // should work even without the basename by checking for
        // any data for any basename
        test.ok(LocaleData.checkCache("de-DE"));

        test.done();
    },


    testLocaleDataNodeSyncMostSpecificFullLocale: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });

        test.ok(locData);
        const actual = locData.loadData({
            basename: "tester",
            locale: "ja-JP",
            mostSpecific: true
        });

        // should not merge. It should only get the most specific
        // file
        test.deepEqual(actual, {
            "a": "b ja-JP",
            "x": {
               "m": "n ja-JP"
            }
        });
        test.done();
    },

    testLocaleDataNodeSyncMostSpecificPartLocale: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });

        test.ok(locData);
        const actual = locData.loadData({
            basename: "tester",
            locale: "ja",
            mostSpecific: true
        });

        // should not merge. It should only get the most specific
        // file
        test.deepEqual(actual, {
            "a": "b ja",
            "c": "d ja",
            "x": {
               "m": "n ja",
               "o": "p ja"
            }
        });
        test.done();
    },

    testLocaleDataNodeAsyncMostSpecific: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });

        test.ok(locData);

        // should not merge. It should only get the most specific
        // file
        locData.loadData({
            basename: "tester",
            locale: "ja-JP",
            mostSpecific: true
        }).then((actual) => {
            test.deepEqual(actual, {
                "a": "b ja-JP",
                "x": {
                   "m": "n ja-JP"
                }
            });
            test.done();
        });
    },

    testLocaleDataNodeAsyncMostSpecificPartLocale: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });

        test.ok(locData);

        // should not merge. It should only get the most specific
        // file
        locData.loadData({
            basename: "tester",
            locale: "ja",
            mostSpecific: true
        }).then((actual) => {
            test.deepEqual(actual, {
                "a": "b ja",
                "c": "d ja",
                "x": {
                   "m": "n ja",
                   "o": "p ja"
                }
            });
            test.done();
        });
    },

    testLocaleDataNodeSyncReturnOneFullLocale: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });

        test.ok(locData);
        const actual = locData.loadData({
            basename: "tester",
            locale: "ja-JP",
            returnOne: true
        });

        // should not merge. It should only get the root file
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

    testLocaleDataNodeSyncReturnOnePartLocale: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });

        test.ok(locData);
        const actual = locData.loadData({
            basename: "tester",
            locale: "ja",
            returnOne: true
        });

        // should not merge. It should only return the root
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

    testLocaleDataNodeAsyncReturnOne: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });

        test.ok(locData);

        // should not merge. It should only get the most specific
        // file
        locData.loadData({
            basename: "tester",
            locale: "ja-JP",
            returnOne: true
        }).then((actual) => {
            // should not merge. It should only get the root file
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

    testLocaleDataNodeAsyncReturnOnePartLocale: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });

        test.ok(locData);

        // should not merge. It should only get the most specific
        // file
        locData.loadData({
            basename: "tester",
            locale: "ja",
            returnOne: true
        }).then((actual) => {
            // should not merge. It should only get the root file
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

    testLocaleDataEnsureLocaleBadRoot: function(test) {
        setPlatform();

        // webpack loader does not use roots, so we don't need this test
        // on the browser

        test.expect(1);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/filesasfdasfd");
        LocaleData.ensureLocale("ja-JP").then(result => {
            test.ok(!result);
            test.done();
        });
    },

    testLocaleDataNodeSyncWithCrossRoots: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        LocaleData.addGlobalRoot("./test/files2");

        test.ok(locData);
        const actual = locData.loadData({
            basename: "merge",
            locale: "en-US",
            crossRoots: true
        });

        test.deepEqual(actual, {
            "a": "a from files2 en-US",
            "b": "b from files en-US",
            "c": "c from files en",
            "d": "d from files2 en-US",
            "e": "e from files2 en"
        });
        test.done();
    },

    testLocaleDataNodeSyncWithCrossRootsOnlyRootLocale: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        LocaleData.addGlobalRoot("./test/files2");

        test.ok(locData);
        const actual = locData.loadData({
            basename: "merge2",
            locale: "en-US",
            crossRoots: true
        });

        test.deepEqual(actual, {
            "a": "a from files2",
            "b": "b from files",
            "c": "c from files2",
            "d": "d from files2"
        });
        test.done();
    },

    testLocaleDataNodeSyncWithCrossRootsNoOverride: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        LocaleData.addGlobalRoot("./test/files2");

        test.ok(locData);
        const actual = locData.loadData({
            basename: "merge3",
            locale: "en-US",
            crossRoots: true
        });

        test.deepEqual(actual, {
            "a": "a from files",
            "b": "b from files"
        });
        test.done();
    },

    testLocaleDataNodeAsyncWithCrossRoots: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });
        LocaleData.addGlobalRoot("./test/files2");

        test.ok(locData);
        locData.loadData({
            basename: "merge",
            locale: "en-US",
            crossRoots: true
        }).then((actual) => {
            test.deepEqual(actual, {
                "a": "a from files2 en-US",
                "b": "b from files en-US",
                "c": "c from files en",
                "d": "d from files2 en-US",
                "e": "e from files2 en"
            });
            test.done();
        });
    },

    testLocaleDataNodeASyncWithCrossRootsJS: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files3",
            sync: false
        });
        LocaleData.addGlobalRoot("./test/files5");

        test.ok(locData);
        locData.loadData({
            basename: "info",
            locale: "en-US",
            crossRoots: true
        }).then((actual) => {
            test.deepEqual(actual, {
                "a": "b en",
                "n": "m from files5",
                "c": "d en",
                "x": "y from files5"
            });
            test.done();
        });
    },


    testLocaleDataNodeAsyncWithCrossRootsOnlyRootLocale: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });
        LocaleData.addGlobalRoot("./test/files2");

        test.ok(locData);
        locData.loadData({
            basename: "merge2",
            locale: "en-US",
            crossRoots: true
        }).then((actual) => {
            test.deepEqual(actual, {
                "a": "a from files2",
                "b": "b from files",
                "c": "c from files2",
                "d": "d from files2"
            });
            test.done();
        });
    },

    testLocaleDataNodeAsyncWithCrossRootsNoOverride: function(test) {
        setPlatform();

        test.expect(2);
        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });
        LocaleData.addGlobalRoot("./test/files2");

        test.ok(locData);
        locData.loadData({
            basename: "merge3",
            locale: "en-US",
            crossRoots: true
        }).then((actual) => {
            test.deepEqual(actual, {
                "a": "a from files",
                "b": "b from files"
            });
            test.done();
        });
    }

};
