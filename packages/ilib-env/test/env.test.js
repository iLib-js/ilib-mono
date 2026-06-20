/*
 * env.test.js - test the environment detection functions (common tests)
 *
 * Copyright © 2021-2023, 2025 JEDLSoft
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

import * as ilibEnv from '../src/index.js';

describe("testEnv", () => {
    beforeEach(() => {
        // make sure we start with a clean slate
        ilibEnv.clearCache();
    });

    test("GetLocaleDefault", () => {
        expect.assertions(1);
        ilibEnv.clearCache();
        expect(ilibEnv.getLocale()).toBe("en-US");
    });

    test("SetLocale", () => {
        expect.assertions(1);
        ilibEnv.setLocale("ja-JP");
        expect(ilibEnv.getLocale()).toBe("ja-JP");
    });

    test("SetLocaleNonString1", () => {
        expect.assertions(1);
        ilibEnv.setLocale("ja-JP");
        ilibEnv.setLocale(true);
        // should not change
        expect(ilibEnv.getLocale()).toBe("ja-JP");
    });

    test("SetLocaleNonString2", () => {
        expect.assertions(1);
        ilibEnv.setLocale("ja-JP");
        ilibEnv.setLocale(4);
        // should not change
        expect(ilibEnv.getLocale()).toBe("ja-JP");
    });

    test("SetLocaleClear", () => {
        expect.assertions(1);
        ilibEnv.setLocale("ja-JP");
        ilibEnv.setLocale();
        // should revert back to the default
        expect(ilibEnv.getLocale()).toBe("en-US");
    });

    test("GetTimeZoneDefaultWithIntl", () => {
        // only test when the Intl object is available
        if (!ilibEnv.globalVar("Intl")) {
            return;
        }

        ilibEnv.clearCache();
        var ro = new Intl.DateTimeFormat().resolvedOptions();
        var expected = ro && ro.timeZone;
        if (expected) {
            expect.assertions(1);
            ilibEnv.clearCache();
            expect(ilibEnv.getTimeZone()).toBe(expected);
        }
    });

    test("SetTimeZone", () => {
        ilibEnv.clearCache();

        expect.assertions(1);

        ilibEnv.setTimeZone("Europe/London");

        expect(ilibEnv.getTimeZone()).toBe("Europe/London");
    });

    test("SetTimeZoneNonString1", () => {
        ilibEnv.clearCache();

        expect.assertions(1);

        let tz = ilibEnv.getTimeZone();

        ilibEnv.setTimeZone(true);

        // should not change
        expect(ilibEnv.getTimeZone()).toBe(tz);
    });

    test("SetTimeZoneNonString2", () => {
        ilibEnv.clearCache();

        expect.assertions(1);

        let tz = ilibEnv.getTimeZone();

        ilibEnv.setTimeZone(2);

        // should not change
        expect(ilibEnv.getTimeZone()).toBe(tz);
    });

    test("SetTimeZoneReset", () => {
        ilibEnv.clearCache();

        expect.assertions(2);

        let tz = ilibEnv.getTimeZone();

        ilibEnv.setTimeZone("Europe/London");

        expect(ilibEnv.getTimeZone()).toBe("Europe/London");

        ilibEnv.setTimeZone();

        // should not change
        expect(ilibEnv.getTimeZone()).toBe(tz);
    });

    test("IsGlobal", () => {
        expect.assertions(1);
        var platform = ilibEnv.getPlatform();
        if (platform === "nodejs" || platform === "trireme" || platform === "rhino") {
            global.testGlobalNumber = 32;
        } else {
            window.testGlobalNumber = 32;
        }
        expect(ilibEnv.isGlobal("testGlobalNumber")).toBeTruthy();
    });

    test("IsGlobalNot", () => {
        expect.assertions(1);
        expect(!ilibEnv.isGlobal("asdfasdfasdf")).toBeTruthy();
    });

    test("Global", () => {
        expect.assertions(1);
        var platform = ilibEnv.getPlatform();
        if (platform !== "nodejs" && platform !== "trireme" && platform !== "rhino") {
            window.testGlobalNumber = 42;
        } else {
            global.testGlobalNumber = 42;
        }
        expect(ilibEnv.globalVar("testGlobalNumber")).toBe(42);
    });

    test("GlobalUndefined", () => {
        expect.assertions(1);
        expect(typeof(ilibEnv.globalVar("testGlobalNumber2")) === "undefined").toBeTruthy();
    });

    test("test clearing the cache", () => {
        expect.assertions(5);

        ilibEnv.setLocale("af-ZA");
        expect(ilibEnv.getLocale()).toBe("af-ZA");
        expect(ilibEnv.isGlobal("locale")).toBeTruthy();
        expect(ilibEnv.globalVar("locale")).toBe("af-ZA");

        ilibEnv.clearCache();

        expect(ilibEnv.isGlobal("locale")).toBeFalsy();
        expect(ilibEnv.globalVar("locale")).toBeUndefined();
    });
});
