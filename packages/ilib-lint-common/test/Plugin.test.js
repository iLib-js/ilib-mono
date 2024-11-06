/*
 * Plugin.test.js - test the plugin superclass object
 *
 * Copyright © 2022-2023 JEDLSoft
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

import Plugin from '../src/Plugin.js';

import {describe, expect, test} from '@jest/globals';

/**
 * @jest-environment node
 */

class MockPlugin extends Plugin {
    constructor() {
        super();
    }
}

describe("testPlugin", () => {
    test("PluginNormal", () => {
        expect.assertions(1);

        const plugin = new MockPlugin();

        expect(plugin).toBeTruthy();
    });

    test("PluginCannotInstantiateAbstractClass", () => {
        expect.assertions(1);

        expect(() => {
            new Plugin();
        }).toThrow();
    });

    test("PluginGetRulesDefault", () => {
        expect.assertions(3);

        const plugin = new MockPlugin();

        expect(plugin).toBeTruthy();

        const rules = plugin.getRules();
        expect(rules).toBeTruthy();
        expect(rules.length).toBe(0);
    });

    test("PluginGetRuleSetsDefault", () => {
        expect.assertions(3);

        const plugin = new MockPlugin();

        expect(plugin).toBeTruthy();

        const sets = plugin.getRuleSets();
        expect(sets).toBeTruthy();
        expect(sets).toStrictEqual({});
    });

    test("PluginGetFormattersDefault", () => {
        expect.assertions(3);

        const plugin = new MockPlugin();

        expect(plugin).toBeTruthy();

        const formatters = plugin.getFormatters();
        expect(formatters).toBeTruthy();
        expect(formatters.length).toBe(0);
    });

    test("PluginGetParsersDefault", () => {
        expect.assertions(3);

        const plugin = new MockPlugin();

        expect(plugin).toBeTruthy();

        const parsers = plugin.getParsers();
        expect(parsers).toBeTruthy();
        expect(parsers.length).toBe(0);
    });

    test("Plugin GetTransformers default", () => {
        expect.assertions(3);

        const plugin = new MockPlugin();

        expect(plugin).toBeTruthy();

        const transformers = plugin.getTransformers();
        expect(transformers).toBeTruthy();
        expect(transformers.length).toBe(0);
    });

    test("Plugin GetSerializers default", () => {
        expect.assertions(3);

        const plugin = new MockPlugin();

        expect(plugin).toBeTruthy();

        const serializers = plugin.getSerializers();
        expect(serializers).toBeTruthy();
        expect(serializers.length).toBe(0);
    });
});

