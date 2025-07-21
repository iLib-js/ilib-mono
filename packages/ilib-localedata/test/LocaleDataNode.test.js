/*
 * LocaleDataNode.test.js - test the locale data class on nodejs
 *
 * Copyright © 2022, 2025 JEDLSoft
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

describe("LocaleDataNode", () => {
    test("should load sync root data", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });

        expect(locData).toBeTruthy();
        const actual = locData.loadData({
            basename: "tester",
            locale: "root"
        });

        expect(actual).toEqual({
            "a": "b",
            "c": "d",
            "x": {
                "m": "n",
                "o": "p"
            }
        });
    });

    test("should load sync en data", () => {
        expect.assertions(2);
        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });

        expect(locData).toBeTruthy();
        const actual = locData.loadData({
            basename: "tester",
            locale: "en"
        });

        expect(actual).toEqual({
            "a": "b en",
            "c": "d",
            "x": {
                "m": "n",
                "o": "p en"
            }
        });
    });

    test("should load sync en-US data", () => {
        expect.assertions(2);
        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });

        expect(locData).toBeTruthy();
        const actual = locData.loadData({
            basename: "tester",
            locale: "en-US"
        });

        expect(actual).toEqual({
            "a": "b en",
            "c": "d en-US",
            "x": {
                "m": "n",
                "o": "p en-US"
            }
        });
    });

    test("should load async root data", async () => {
        expect.assertions(2);
        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });

        expect(locData).toBeTruthy();
        const actual = await locData.loadData({
            basename: "tester",
            locale: "root"
        });

        expect(actual).toEqual({
            "a": "b",
            "c": "d",
            "x": {
                "m": "n",
                "o": "p"
            }
        });
    });

    test("should load async en data", async () => {
        expect.assertions(2);
        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });

        expect(locData).toBeTruthy();
        const actual = await locData.loadData({
            basename: "tester",
            locale: "en"
        });

        expect(actual).toEqual({
            "a": "b en",
            "c": "d",
            "x": {
                "m": "n",
                "o": "p en"
            }
        });
    });

    test("should load async en-US data", async () => {
        expect.assertions(2);
        setPlatform();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });
        expect(locData).toBeTruthy();

        const actual = await locData.loadData({
            basename: "tester",
            locale: "en-US"
        });

        expect(actual).toEqual({
            "a": "b en",
            "c": "d en-US",
            "x": {
                "m": "n",
                "o": "p en-US"
            }
        });
    });

    test("should load sync data with roots", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        LocaleData.addGlobalRoot("./test/files2");

        expect(locData).toBeTruthy();
        const actual = locData.loadData({
            basename: "tester",
            locale: "en-US"
        });

        expect(actual).toEqual({
            "a": "b en from files2",
            "c": "d en-US",
            "x": {
                "m": "n",
                "o": "p en-US"
            }
        });
    });

    test("should load async data with roots", async () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });
        expect(locData).toBeTruthy();

        LocaleData.addGlobalRoot("./test/files2");

        const actual = await locData.loadData({
            basename: "tester",
            locale: "en-US"
        });

        expect(actual).toEqual({
            "a": "b en from files2",
            "c": "d en-US",
            "x": {
                "m": "n",
                "o": "p en-US"
            }
        });
    });

    test("should load sync data with roots for ja-JP", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        LocaleData.addGlobalRoot("./test/files2");

        expect(locData).toBeTruthy();
        const actual = locData.loadData({
            basename: "tester",
            locale: "ja-JP"
        });

        expect(actual).toEqual({
            "a": "b ja-JP from files2",
            "c": "d ja",
            "x": {
                "m": "n ja-JP from files2",
                "o": "p ja"
            }
        });
    });

    test("should load async data with roots for ja-JP", async () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });
        expect(locData).toBeTruthy();

        LocaleData.addGlobalRoot("./test/files2");

        const actual = await locData.loadData({
            basename: "tester",
            locale: "ja-JP"
        });

        expect(actual).toEqual({
            "a": "b ja-JP from files2",
            "c": "d ja",
            "x": {
                "m": "n ja-JP from files2",
                "o": "p ja"
            }
        });
    });

    test("should cache data", () => {
        expect.assertions(3);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        expect(locData).toBeTruthy();
        LocaleData.addGlobalRoot("./test/files2");

        let actual = locData.loadData({
            basename: "tester",
            locale: "de-DE"
        });

        // root data because there is no de-DE data
        expect(actual).toEqual({
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

        expect(actual).toEqual({
            "a": "b de-DE",
            "c": "d",
            "x": {
                "m": "n de",
                "o": "p de-DE"
            }
        });
    });

    test("should check cache", () => {
        expect.assertions(3);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        expect(locData).toBeTruthy();
        LocaleData.addGlobalRoot("./test/files2");

        // there is no de-DE data, but there is root data which we
        // should ignore for the purposes of cache checking
        expect(LocaleData.checkCache("de-DE", "tester")).toBe(false);

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

        expect(LocaleData.checkCache("de-DE", "tester")).toBe(true);
    });

    test("should check cache loading files fills cache", () => {
        expect.assertions(4);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        LocaleData.addGlobalRoot("./test/files2");

        // there is no en-US data, but there is root data which we
        // should ignore for the purposes of cache checking
        expect(LocaleData.checkCache("en-US", "tester")).toBe(false);

        expect(locData).toBeTruthy();
        const actual = locData.loadData({
            basename: "tester",
            locale: "en-US"
        });

        expect(actual).toEqual({
            "a": "b en from files2",
            "c": "d en-US",
            "x": {
                "m": "n",
                "o": "p en-US"
            }
        });

        // the loadData above should have populated the cache
        expect(LocaleData.checkCache("en-US", "tester")).toBe(true);
    });

    test("should check cache data loaded but no content available", () => {
        expect.assertions(3);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        expect(locData).toBeTruthy();
        LocaleData.addGlobalRoot("./test/files2");

        // there is no de-DE data, but there is root data which we
        // should ignore for the purposes of cache checking
        expect(LocaleData.checkCache("de-DE", "tester")).toBe(false);

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
        expect(LocaleData.checkCache("de-DE", "tester")).toBe(true);
    });

    test("should cache data", () => {
        expect.assertions(4);
        setPlatform();

        LocaleData.clearCache();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        LocaleData.addGlobalRoot("./test/files2");

        expect(locData).toBeTruthy();
        let actual = locData.loadData({
            basename: "tester",
            locale: "ja-JP"
        });

        expect(actual).toEqual({
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

        expect(locData).toBeTruthy();

        actual = locData.loadData({
            basename: "tester",
            locale: "ja-JP"
        });

        expect(actual).toEqual({
            "a": "b ja-JP from files2",
            "c": "d ja",
            "x": {
               "m": "n ja-JP from files2",
               "o": "p ja"
            }
        });
    });

    test("should clear cache", () => {
        expect.assertions(4);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        expect(locData).toBeTruthy();
        LocaleData.addGlobalRoot("./test/files2");

        // there is no de-DE data, but there is root data which we
        // should ignore for the purposes of cache checking
        expect(LocaleData.checkCache("de-DE", "tester")).toBe(false);

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

        expect(LocaleData.checkCache("de-DE", "tester")).toBe(true);

        // dangerous: clears the cache for all the packages!
        LocaleData.clearCache();

        expect(LocaleData.checkCache("de-DE", "tester")).toBe(false);
    });

    test("should check cache no basename", () => {
        expect.assertions(3);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        expect(locData).toBeTruthy();
        LocaleData.addGlobalRoot("./test/files2");

        // there is no de-DE data, but there is root data which we
        // should ignore for the purposes of cache checking
        expect(LocaleData.checkCache("de-DE")).toBe(false);

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
        expect(LocaleData.checkCache("de-DE")).toBe(true);
    });

    test("should load sync most specific full locale", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });

        expect(locData).toBeTruthy();
        const actual = locData.loadData({
            basename: "tester",
            locale: "ja-JP",
            mostSpecific: true
        });

        // should not merge. It should only get the most specific
        // file
        expect(actual).toEqual({
            "a": "b ja-JP",
            "x": {
               "m": "n ja-JP"
            }
        });
    });

    test("should load sync most specific part locale", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });

        expect(locData).toBeTruthy();
        const actual = locData.loadData({
            basename: "tester",
            locale: "ja",
            mostSpecific: true
        });

        // should not merge. It should only get the most specific
        // file
        expect(actual).toEqual({
            "a": "b ja",
            "c": "d ja",
            "x": {
               "m": "n ja",
               "o": "p ja"
            }
        });
    });

    test("should load async most specific", async () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });

        expect(locData).toBeTruthy();

        // should not merge. It should only get the most specific
        // file
        const actual = await locData.loadData({
            basename: "tester",
            locale: "ja-JP",
            mostSpecific: true
        });

        expect(actual).toEqual({
            "a": "b ja-JP",
            "x": {
               "m": "n ja-JP"
            }
        });
    });

    test("should load async most specific part locale", async () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });

        expect(locData).toBeTruthy();

        // should not merge. It should only get the most specific
        // file
        const actual = await locData.loadData({
            basename: "tester",
            locale: "ja",
            mostSpecific: true
        });

        expect(actual).toEqual({
            "a": "b ja",
            "c": "d ja",
            "x": {
               "m": "n ja",
               "o": "p ja"
            }
        });
    });

    test("should load sync return one full locale", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });

        expect(locData).toBeTruthy();
        const actual = locData.loadData({
            basename: "tester",
            locale: "ja-JP",
            returnOne: true
        });

        // should not merge. It should only get the root file
        expect(actual).toEqual({
            "a": "b",
            "c": "d",
            "x": {
               "m": "n",
               "o": "p"
            }
        });
    });

    test("should load sync return one part locale", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });

        expect(locData).toBeTruthy();
        const actual = locData.loadData({
            basename: "tester",
            locale: "ja",
            returnOne: true
        });

        // should not merge. It should only return the root
        expect(actual).toEqual({
            "a": "b",
            "c": "d",
            "x": {
               "m": "n",
               "o": "p"
            }
        });
    });

    test("should load async return one", async () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });

        expect(locData).toBeTruthy();

        // should not merge. It should only get the most specific
        // file
        const actual = await locData.loadData({
            basename: "tester",
            locale: "ja-JP",
            returnOne: true
        });

        // should not merge. It should only get the root file
        expect(actual).toEqual({
            "a": "b",
            "c": "d",
            "x": {
               "m": "n",
               "o": "p"
            }
        });
    });

    test("should load async return one part locale", async () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });

        expect(locData).toBeTruthy();

        // should not merge. It should only get the most specific
        // file
        const actual = await locData.loadData({
            basename: "tester",
            locale: "ja",
            returnOne: true
        });

        // should not merge. It should only get the root file
        expect(actual).toEqual({
            "a": "b",
            "c": "d",
            "x": {
               "m": "n",
               "o": "p"
            }
        });
    });

    test("should ensure locale bad root", async () => {
        expect.assertions(1);
        setPlatform();

        // webpack loader does not use roots, so we don't need this test
        // on the browser

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        LocaleData.addGlobalRoot("./test/filesasfdasfd");
        const result = await LocaleData.ensureLocale("ja-JP");
        expect(!result).toBe(true);
    });

    test("should load sync with cross roots", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        LocaleData.addGlobalRoot("./test/files2");

        expect(locData).toBeTruthy();
        const actual = locData.loadData({
            basename: "merge",
            locale: "en-US",
            crossRoots: true
        });

        expect(actual).toEqual({
            "a": "a from files2 en-US",
            "b": "b from files en-US",
            "c": "c from files en",
            "d": "d from files2 en-US",
            "e": "e from files2 en"
        });
    });

    test("should load sync with cross roots only root locale", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        LocaleData.addGlobalRoot("./test/files2");

        expect(locData).toBeTruthy();
        const actual = locData.loadData({
            basename: "merge2",
            locale: "en-US",
            crossRoots: true
        });

        expect(actual).toEqual({
            "a": "a from files2",
            "b": "b from files",
            "c": "c from files2",
            "d": "d from files2"
        });
    });

    test("should load sync with cross roots no override", () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: true
        });
        LocaleData.addGlobalRoot("./test/files2");

        expect(locData).toBeTruthy();
        const actual = locData.loadData({
            basename: "merge3",
            locale: "en-US",
            crossRoots: true
        });

        expect(actual).toEqual({
            "a": "a from files",
            "b": "b from files"
        });
    });

    test("should load async with cross roots", async () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });
        LocaleData.addGlobalRoot("./test/files2");

        expect(locData).toBeTruthy();
        const actual = await locData.loadData({
            basename: "merge",
            locale: "en-US",
            crossRoots: true
        });

        expect(actual).toEqual({
            "a": "a from files2 en-US",
            "b": "b from files en-US",
            "c": "c from files en",
            "d": "d from files2 en-US",
            "e": "e from files2 en"
        });
    });

    test("should load async with cross roots JS", async () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files3",
            sync: false
        });
        LocaleData.addGlobalRoot("./test/files5");

        expect(locData).toBeTruthy();
        const actual = await locData.loadData({
            basename: "info",
            locale: "en-US",
            crossRoots: true
        });

        expect(actual).toEqual({
            "a": "b en",
            "n": "m from files5",
            "c": "d en",
            "x": "y from files5"
        });
    });

    test("should load async with cross roots only root locale", async () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });
        LocaleData.addGlobalRoot("./test/files2");

        expect(locData).toBeTruthy();
        const actual = await locData.loadData({
            basename: "merge2",
            locale: "en-US",
            crossRoots: true
        });

        expect(actual).toEqual({
            "a": "a from files2",
            "b": "b from files",
            "c": "c from files2",
            "d": "d from files2"
        });
    });

    test("should load async with cross roots no override", async () => {
        expect.assertions(2);
        setPlatform();

        LocaleData.clearCache();
        LocaleData.clearGlobalRoots();

        const locData = new LocaleData({
            path: "./test/files",
            sync: false
        });
        LocaleData.addGlobalRoot("./test/files2");

        expect(locData).toBeTruthy();
        const actual = await locData.loadData({
            basename: "merge3",
            locale: "en-US",
            crossRoots: true
        });

        expect(actual).toEqual({
            "a": "a from files",
            "b": "b from files"
        });
    });
});