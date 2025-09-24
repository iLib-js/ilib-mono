/*
 * ts-jest.config.js - shared ts-jest configuration for ilib packages
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

const config = {
    // Base configuration from root jest.config.js
    displayName: "ilib-mono repo",
    coverageReporters: ["html", "json-summary", ["text", { file: "../coverage.txt" }]],
    reporters: ["default", ["jest-junit", { outputName: "junit.xml" }]],
    preset: 'ts-jest',
    testMatch: [
        "**/test/**/*.test.ts",
        "**/test/**/*.test.js"
    ],
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: {
                types: ['jest', 'node'],
                module: 'CommonJS',
                moduleResolution: 'node'
            }
        }]
    }
};

export default config;
