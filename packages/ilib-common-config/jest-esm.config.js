/*
 * jest-esm.config.js - shared Jest configuration for ESM packages
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

import baseConfig from '../../jest.config.js';

const config = {
    ...baseConfig,
    // ESM-specific overrides for ilib packages
    testPathIgnorePatterns: [
        "/node_modules/",
        "/tools/",
        "/coverage/"
    ],
    // ESM module file extensions
    moduleFileExtensions: ['js', 'jsx', 'json'],
    // ESM transform configuration
    transform: {
        '^.+\\.js$': ['babel-jest', {
            presets: [['@babel/preset-env', { modules: 'commonjs' }]]
        }]
    },
    // ESM transform ignore patterns
    transformIgnorePatterns: [
        '/node_modules/(?!(ilib-.*)/)'
    ],
    // ESM module directories
    moduleDirectories: ['node_modules', 'src']
};

export default config;
