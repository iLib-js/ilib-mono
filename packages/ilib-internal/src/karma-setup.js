/*
 * karma-setup.js - set up the karma testing environment before
 * running the tests
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

/*
 * Add missing Jest functions. This is a workaround to allow Karma to run Jest tests
 * using the Jasmine framework. Jest and Jasmine's expect libraries are closely
 * related, but not identical. This shim allows us to use the Jest syntax in our unit
 * tests and share those tests between Jest on Nodejs and Jasmine on a browser.
 */
window.test = window.it;
/**
 * Minimal Jest-compatible test.each. Supports:
 * - array rows: test.each([[a, b]])("...", (a, b) => ...)
 * - object rows: test.each([{ a, b }])("... $a", ({ a, b }) => ...)
 */
window.test.each = (inputs) => (testName, testFn) =>
    inputs.forEach((args) => {
        if (Array.isArray(args)) {
            window.it(testName, () => testFn(...args));
            return;
        }
        const name =
            args != null && typeof args === "object"
                ? testName.replace(/\$(\w+)/g, (_, key) =>
                      Object.prototype.hasOwnProperty.call(args, key)
                          ? String(args[key])
                          : "$" + key
                  )
                : testName;
        window.it(name, () => testFn(args));
    });
window.test.todo = function () {
    return undefined;
};

window.expect.assertions = (num) => {
    return undefined;
};
