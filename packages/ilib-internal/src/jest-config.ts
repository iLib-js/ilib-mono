/*
 * jest.config.js - shared Jest configuration for CommonJS packages
 *
 * Copyright © 2025 JEDLSoft
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

import type { Config } from "jest";

const config: Config = {
    // Base configuration from root jest.config.js
    displayName: "ilib-mono repo",
    coverageReporters: ["html", "json-summary", ["text", { file: "../coverage.txt" }]],
    reporters: ["default", ["jest-junit", { outputName: "junit.xml" }]],
    testMatch: ["**/test/**/?(*.)+(spec|test).?([mc])[jt]s?(x)"],
    // Common overrides for ilib packages
    testPathIgnorePatterns: [
        "/node_modules/",
        "/tools/",
        "/coverage/"
    ],
    // Standard module file extensions for ilib packages
    moduleFileExtensions: ['js', 'json'],
    // Common transform ignore patterns
    transformIgnorePatterns: [
        '/node_modules/(?!(ilib-.*)/)'
    ]
};

export default config;
