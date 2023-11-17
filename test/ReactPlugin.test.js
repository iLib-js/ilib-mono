/*
 * ReactPlugin.test.js - test the Javascript plugin
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

describe("testReactPlugin", () => {
    test("ReactPlugin", () => {
        expect.assertions(1);

        const jp = new ReactPlugin();
        expect(jp).toBeTruthy();
    });

    test("ReactPluginGetParsers", () => {
        expect.assertions(3);

        const jp = new ReactPlugin();
        expect(jp).toBeTruthy();

        const parsers = jp.getParsers();
        expect(parsers).toBeTruthy();
        expect(parsers.length).toBe(4);
    });

    test("ReactPluginGetRules", () => {
        expect.assertions(3);

        const jp = new ReactPlugin();
        expect(jp).toBeTruthy();

        const rules = jp.getRules();
        expect(rules).toBeTruthy();
        expect(rules.length).toBe(0);
    });

    test("ReactPluginGetFormatters", () => {
        expect.assertions(3);

        const jp = new ReactPlugin();
        expect(jp).toBeTruthy();

        const formatters = jp.getFormatters();
        expect(formatters).toBeTruthy();
        expect(formatters.length).toBe(0);
    });

    test("ReactPluginGetRulesets", () => {
        expect.assertions(2);

        const jp = new ReactPlugin();
        expect(jp).toBeTruthy();

        const sets = jp.getRuleSets();
        expect(!sets).toBeTruthy();
        /*
        expect(sets.react).toBeTruthy();
        expect(Object.keys(sets.react).length).toBe(0);
        */
    });
});
