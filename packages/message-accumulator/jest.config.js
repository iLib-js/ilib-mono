/*
 * jest.config.js - jest configuration script
 *
 * Copyright © 2024 JEDLSoft
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
var semver = require('semver');

var settings = semver.major(process.versions.node) < 14 ?
    {
        transformIgnorePatterns: ['/node_modules/'],

        moduleDirectories: ['node_modules', 'src']
    } :
    {
        moduleFileExtensions: ['js', 'jsx', 'json'],

        transform: {},

        transformIgnorePatterns: ['/node_modules/'],

        moduleDirectories: ['node_modules', 'src']
    };

module.exports = settings;
