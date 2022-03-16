/*
 * testSuiteFiles.js - list the test files in this directory
 *
 * Copyright © 2022, JEDLSoft
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

var files = [
    "testLoaderFactory.js",
    "testLoader.js",
];

console.log("testSuiteFiles: Platform reported by ilib-env is " + ilibEnv.getPlatform());

// add platform-specific loaders here so that we only test it on that
// particular platform

if (ilibEnv.getPlatform() === "nodejs") {
    files.push("testNodeLoader.js");
}

module.exports = { files };
