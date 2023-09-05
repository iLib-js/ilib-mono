/*
 * testReactPlugin.js - test the Javascript plugin
 *
 * Copyright © 2023 Box, Inc.
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

import ReactPlugin from '../src/index.js';

export const testReactPlugin = {
    testReactPlugin: function(test) {
        test.expect(1);

        const jp = new ReactPlugin();
        test.ok(jp);

        test.done();
    },

    testReactPluginGetParsers: function(test) {
        test.expect(3);

        const jp = new ReactPlugin();
        test.ok(jp);

        const parsers = jp.getParsers();
        test.ok(parsers);
        test.equal(parsers.length, 3);

        test.done();
    },

    testReactPluginGetRules: function(test) {
        test.expect(3);

        const jp = new ReactPlugin();
        test.ok(jp);

        const rules = jp.getRules();
        test.ok(rules);
        test.equal(rules.length, 0);

        test.done();
    },

    testReactPluginGetFormatters: function(test) {
        test.expect(3);

        const jp = new ReactPlugin();
        test.ok(jp);

        const formatters = jp.getFormatters();
        test.ok(formatters);
        test.equal(formatters.length, 0);

        test.done();
    },

    testReactPluginGetRulesets: function(test) {
        test.expect(2);

        const jp = new ReactPlugin();
        test.ok(jp);

        const sets = jp.getRuleSets();
        test.ok(!sets);
        /*
        test.ok(sets.react);
        test.equal(Object.keys(sets.react).length, 0);
        */

        test.done();
    }
};
