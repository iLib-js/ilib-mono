/*
 * karma.conf.js - configure the karma testing environment
 * This package uses the shared karma configuration from ilib-internal
 *
 * Copyright © 2023, JEDLSoft
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

const { createKarmaConfig } = require("ilib-internal");

module.exports = function (config) {
    config.set(
        createKarmaConfig({
            // Package-specific files to load (shared karma-setup.js is added automatically)
            files: ["./test/**/*.test.js"],

            // Package-specific preprocessors
            preprocessors: {
                "./test/**/*.test.js": ["webpack"],
            },
        })
    );
};
