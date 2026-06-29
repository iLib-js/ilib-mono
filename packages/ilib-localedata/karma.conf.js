/*
 * karma.conf.js - configure the karma testing environment
 *
 * Copyright © 2025, JEDLSoft
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
const path = require("path");
const { createKarmaConfig } = require("ilib-internal");

module.exports = function (config) {
    config.set(createKarmaConfig({
        // list of files to exclude - Node Only tests should not run in the browser
        // Sync tests are excluded because the WebpackLoader does not support sync mode.
        exclude: [
            "./test/LocaleDataNode.test.js",
            // Sync tests - browsers don't support sync file loading
            "./test/FileCache.sync.test.js",
            "./test/ParsedDataCache.sync.test.js",
            "./test/MergedDataCache.sync.test.js",
            "./test/GetLocaleData.sync.test.js",
            // FileCache.async tests expect raw strings but webpack parses JSON automatically
            // FileCache is the boundary layer where Node/browser behavior differs
            "./test/FileCache.async.test.js"
        ],

        webpack: {
            // Note: __CALLING_MODULE_PATH__ is NOT defined here.
            // The WebpackLoader uses a heuristic fallback that looks for
            // common root directory patterns like 'files*', 'locale', 'data', 'resources'
            resolve: {
                fallback: {
                    buffer: require.resolve("buffer")
                },
                alias: {
                    // Point to the testfiles directory which contains all test data
                    "calling-module": path.resolve(__dirname, "./test/testfiles"),
                    "ilib-loader": "ilib-loader/browser",
                    "fs": false,
                    "path": false
                }
            },
        }
    }));
};
