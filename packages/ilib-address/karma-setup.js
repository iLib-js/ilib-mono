/*
 * karma-setup.js - set the browser locale for the tests
 *
 * Copyright © 2025-2026 JEDLSoft
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

var ilibEnv = require("ilib-env");
var LocaleData = require("ilib-localedata").LocaleData;
var locales = require("./locales.json").locales;

// Set locale for testing
ilibEnv.setLocale("en-US");

// Address parsing is synchronous, so preload every assembled locale before
// running the browser suite.
beforeAll(async function () {
    LocaleData.clearGlobalRoots();
    LocaleData.addGlobalRoot("./locale");
    LocaleData.clearCache();
    for (const locale of locales) {
        // Unknown-region tests exercise the fallback path, so do not populate
        // synthetic locale data for them.
        if (locale !== "en-QQ") {
            await LocaleData.ensureLocale(locale);
        }
    }
    LocaleData.cacheData({
        "und-QQ": {
            address: {},
        },
    }, "./locale");
});