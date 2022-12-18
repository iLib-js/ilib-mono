/*
 * testRule.js - test the rule superclass object
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

import Rule from '../src/Rule.js';

class MockRule extends Rule {
    constructor(options) {
        super(options);
        this.name = "mock";
        this.description = "asdf asdf";
    }
}

export const testRule = {
    testRuleNormal: function(test) {
        test.expect(1);

        const rule = new MockRule();

        test.ok(rule);

        test.done();
    },

    testRuleCannotInstantiateAbstractClass: function(test) {
        test.expect(1);

        test.throws(() => {
            new Rule();
        });

        test.done();
    },

    testRuleGetName: function(test) {
        test.expect(2);

        const rule = new MockRule();

        test.ok(rule);

        test.equal(rule.getName(), "mock");

        test.done();
    },

    testRuleGetExtensions: function(test) {
        test.expect(2);

        const rule = new MockRule();

        test.ok(rule);

        test.equal(rule.getDescription(), "asdf asdf");

        test.done();
    },

    testRuleGetSourceLocaleDefault: function(test) {
        test.expect(2);

        const rule = new MockRule();

        test.ok(rule);

        test.equal(rule.getSourceLocale(), "en-US");

        test.done();
    },

    testRuleGetSourceLocaleExplicit: function(test) {
        test.expect(2);

        const rule = new MockRule({
            sourceLocale: "de-DE"
        });

        test.ok(rule);

        test.equal(rule.getSourceLocale(), "de-DE");

        test.done();
    },

    testRuleGetRuleType: function(test) {
        test.expect(2);

        const rule = new MockRule();

        test.ok(rule);

        test.equal(rule.getRuleType(), "line");

        test.done();
    }
};

