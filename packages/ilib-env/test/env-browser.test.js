/*
 * env-browser.test.js - test the environment detection functions (browser-specific tests)
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

describe("testEnvBrowser", () => {
    beforeEach(() => {
        // make sure we start with a clean slate
        ilibEnv.clearCache();
    });

    test("GetTimeZoneBrowserWithoutIntl", () => {
        if (ilibEnv.getPlatform() !== "browser" || ilibEnv.globalVar("Intl")) {
            // only testable on a browser without the Intl object available
            return;
        }

        ilibEnv.clearCache();

        navigator.timezone = "America/New_York";

        expect.assertions(1);
        expect(ilibEnv.getTimeZone()).toBe("America/New_York");

        ilibEnv.clearCache();
    });

    test("GetLocaleBrowser", () => {
        if (ilibEnv.getPlatform() !== "browser") {
            // only test this in a real browser
            return;
        }
        ilibEnv.clearCache();

        var loc = "";

        if (navigator.language.length > 5) {
            var l = navigator.language;
            loc = l.substring(0,3) + l.charAt(3).toUpperCase() + l.substring(4,8).toLowerCase() + l.substring(8).toUpperCase();
        } else if (navigator.language.length > 2) {
            loc = navigator.language.substring(0,3) + navigator.language.substring(3).toUpperCase();
        } else {
            loc = navigator.language;
        }
        if (loc === "en") {
            loc = "en-US";
        }
        expect.assertions(1);
        expect(ilibEnv.getLocale()).toBe(loc);
    });
}); 