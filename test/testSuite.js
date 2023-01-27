/*
 * testSuite.js - test suite for this directory
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

import suites from './testSuiteFiles.js';

import nodeunit from 'nodeunit';
import assert from 'nodeunit/lib/assert.js';
import assertextras from 'assertextras';

assertextras(assert);

const reporter = nodeunit.reporters.minimal;
let modules = {};

let promise = Promise.resolve(true);

suites.forEach(path => {
    promise = promise.then(() => {
        return import("./" + path).then((test) => {
            for (var suite in test) {
                modules[suite] = test[suite];
            }
        });
    });
});

promise.then(() => {
    reporter.run(modules, undefined, function(err) {
        process.exit(err ? 1 : 0);
    });
});