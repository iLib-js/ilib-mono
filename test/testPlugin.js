/*
 * testPlugin.js - test the plugin superclass object
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

import Plugin from '../src/Plugin.js';

class MockPlugin extends Plugin {
    constructor() {
        super();
        this.type = "resource";
    }
}

export const testPlugin = {
    testPluginNormal: function(test) {
        test.expect(1);

        const plugin = new MockPlugin();

        test.ok(plugin);

        test.done();
    },

    testPluginCannotInstantiateAbstractClass: function(test) {
        test.expect(1);

        test.throws(() => {
            new Plugin();
        });

        test.done();
    },

    testPluginGetType: function(test) {
        test.expect(2);

        const plugin = new MockPlugin();

        test.ok(plugin);

        test.equal(plugin.getType(), "resource");

        test.done();
    },

    testPluginGetRulesDefault: function(test) {
        test.expect(3);

        const plugin = new MockPlugin();

        test.ok(plugin);

        const rules = plugin.getRules();
        test.ok(rules);
        test.equal(rules.length, 0);

        test.done();
    },

    testPluginGetFormattersDefault: function(test) {
        test.expect(3);

        const plugin = new MockPlugin();

        test.ok(plugin);

        const formatters = plugin.getFormatters();
        test.ok(formatters);
        test.equal(formatters.length, 0);

        test.done();
    },

    testPluginGetParsersDefault: function(test) {
        test.expect(3);

        const plugin = new MockPlugin();

        test.ok(plugin);

        const parsers = plugin.getParsers();
        test.ok(parsers);
        test.equal(parsers.length, 0);

        test.done();
    }
};

