/*
 * testPythonGnuPlugin.js - test the Xliff plugin
 *
 * Copyright © 2022 JEDLSoft
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
import { Parser } from 'i18nlint-common';

import PythonPlugin from '../src/index.js';

export const testPythonGnuPlugin = {
    testPythonPlugin: function(test) {
        test.expect(1);

        const xp = new PythonPlugin();
        test.ok(xp);

        test.done();
    },

    testPythonPluginGetParsers: function(test) {
        test.expect(3);

        const xp = new PythonPlugin();
        test.ok(xp);

        const parsers = xp.getParsers();
        test.ok(parsers);
        test.equal(parsers.length, 1);

        test.done();
    },

    testPythonPluginGetRules: function(test) {
        test.expect(3);

        const xp = new PythonPlugin();
        test.ok(xp);

        const rules = xp.getRules();
        test.ok(rules);
        test.equal(rules.length, 1);

        test.done();
    },

    testPythonPluginGetFormatters: function(test) {
        test.expect(3);

        const xp = new PythonPlugin();
        test.ok(xp);

        const formatters = xp.getFormatters();
        test.ok(formatters);
        test.equal(formatters.length, 0);

        test.done();
    }
};
