/*
 * karma-setup.js - set up the karma testing environment before
 * running the tests
 *
 * Copyright © 2022, 2025 JEDLSoft
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

var ilibEnv = require('ilib-env');

// Add missing Jest functions for browser compatibility
window.test = window.it;
window.test.each = function(inputs) {
    return function(testName, test) {
        inputs.forEach(function(args) {
            window.it(testName, function() {
                test.apply(this, args);
            });
        });
    };
};
window.test.todo = function() {
    return undefined;
};

window.expect.assertions = function(num) {
    return undefined;
};

// Set locale for testing
ilibEnv.setLocale("en-US");
