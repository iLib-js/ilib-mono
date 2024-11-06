/*
 * RuleSet.test.js - test the built-in rules
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

import ResourceQuoteStyle from '../src/rules/ResourceQuoteStyle.js';
import ResourceICUPlurals from '../src/rules/ResourceICUPlurals.js';
import RuleSet from '../src/RuleSet.js';

describe("testRuleSet", () => {
    test("RuleSet", () => {
        expect.assertions(2);

        const ruleset = new RuleSet();
        expect(ruleset).toBeTruthy();
        expect(ruleset.getSize()).toBe(0);
    });

    test("RuleSetConstructor", () => {
        expect.assertions(2);

        const rule1 = new ResourceQuoteStyle();

        const ruleset = new RuleSet([rule1]);
        expect(ruleset).toBeTruthy();
        expect(ruleset.getSize()).toBe(1);
    });

    test("RuleSetConstructorMultiple", () => {
        expect.assertions(2);

        const rule1 = new ResourceQuoteStyle();
        const rule2 = new ResourceICUPlurals();

        const ruleset = new RuleSet([rule1, rule2]);
        expect(ruleset).toBeTruthy();
        expect(ruleset.getSize()).toBe(2);
    });

    test("RuleSetGetByName", () => {
        expect.assertions(4);

        const rule1 = new ResourceQuoteStyle();
        const rule2 = new ResourceICUPlurals();

        const ruleset = new RuleSet([rule1, rule2]);
        expect(ruleset).toBeTruthy();
        expect(ruleset.getSize()).toBe(2);

        let rule = ruleset.getRule("resource-quote-style");
        expect(rule).toBe(rule1);
        rule = ruleset.getRule("resource-icu-plurals");
        expect(rule).toBe(rule2);
    });

    test("RuleSetGetByNameNotExist", () => {
        expect.assertions(3);

        const rule1 = new ResourceQuoteStyle();
        const rule2 = new ResourceICUPlurals();

        const ruleset = new RuleSet([rule1, rule2]);
        expect(ruleset).toBeTruthy();
        expect(ruleset.getSize()).toBe(2);

        let rule = ruleset.getRule("asdf");
        expect(!rule).toBeTruthy();
    });

    test("RuleSetGetByType", () => {
        expect.assertions(5);

        const rule1 = new ResourceQuoteStyle();
        const rule2 = new ResourceICUPlurals();

        const ruleset = new RuleSet([rule1, rule2]);
        expect(ruleset).toBeTruthy();
        expect(ruleset.getSize()).toBe(2);

        const rules = ruleset.getRules("resource");
        expect(rules).toBeTruthy();
        expect(rules.length).toBe(2);
        expect(rules).toEqual([rule1, rule2]);
    });

    test("RuleSetGetByTypeNonExistant", () => {
        expect.assertions(4);

        const rule1 = new ResourceQuoteStyle();
        const rule2 = new ResourceICUPlurals();

        const ruleset = new RuleSet([rule1, rule2]);
        expect(ruleset).toBeTruthy();
        expect(ruleset.getSize()).toBe(2);

        const rules = ruleset.getRules("asdf");
        expect(typeof(rules) !== 'undefined').toBeTruthy();
        expect(rules.length).toBe(0);
    });

    test("RuleSetAddRuleSize", () => {
        expect.assertions(3);

        const ruleset = new RuleSet();
        expect(ruleset).toBeTruthy();
        expect(ruleset.getSize()).toBe(0);

        const rule1 = new ResourceQuoteStyle();

        ruleset.addRule(rule1);
        expect(ruleset.getSize()).toBe(1);
    });

    test("RuleSetAddRuleContent", () => {
        expect.assertions(2);

        const ruleset = new RuleSet();
        expect(ruleset).toBeTruthy();

        const rule1 = new ResourceQuoteStyle();

        ruleset.addRule(rule1);

        let rule = ruleset.getRule("resource-quote-style");
        expect(rule).toBe(rule1);
    });

    test("RuleSetAddSize", () => {
        expect.assertions(3);

        const ruleset = new RuleSet();
        expect(ruleset).toBeTruthy();
        expect(ruleset.getSize()).toBe(0);

        const rule1 = new ResourceQuoteStyle();
        const rule2 = new ResourceICUPlurals();

        ruleset.add([rule1, rule2]);
        expect(ruleset.getSize()).toBe(2);
    });

    test("RuleSetAddContent", () => {
        expect.assertions(3);

        const ruleset = new RuleSet();
        expect(ruleset).toBeTruthy();

        const rule1 = new ResourceQuoteStyle();
        const rule2 = new ResourceICUPlurals();

        ruleset.add([rule1, rule2]);

        let rule = ruleset.getRule("resource-quote-style");
        expect(rule).toBe(rule1);
        rule = ruleset.getRule("resource-icu-plurals");
        expect(rule).toBe(rule2);
    });

    test("RuleSet remove a rule", () => {
        expect.assertions(6);

        const rule1 = new ResourceQuoteStyle();
        const rule2 = new ResourceICUPlurals();

        const ruleset = new RuleSet([rule1, rule2]);
        expect(ruleset).toBeTruthy();
        expect(ruleset.getSize()).toBe(2);

        let rule = ruleset.getRule("resource-quote-style");
        expect(rule).toBe(rule1);
        rule = ruleset.getRule("resource-icu-plurals");
        expect(rule).toBe(rule2);

        ruleset.removeRule("resource-icu-plurals");

        rule = ruleset.getRule("resource-quote-style");
        expect(rule).toBe(rule1);
        rule = ruleset.getRule("resource-icu-plurals");
        expect(rule).toBeUndefined();
    });

    test("RuleSet remove a rule with no name", () => {
        expect.assertions(5);

        const rule1 = new ResourceQuoteStyle();
        const rule2 = new ResourceICUPlurals();

        const ruleset = new RuleSet([rule1, rule2]);
        expect(ruleset).toBeTruthy();
        expect(ruleset.getSize()).toBe(2);

        // shouldn't do anything
        ruleset.removeRule();

        expect(ruleset.getSize()).toBe(2);
        let rule = ruleset.getRule("resource-quote-style");
        expect(rule).toBe(rule1);
        rule = ruleset.getRule("resource-icu-plurals");
        expect(rule).toBe(rule2);
    });

    test("RuleSet remove a rule that is not already in the set", () => {
        expect.assertions(5);

        const rule1 = new ResourceQuoteStyle();
        const rule2 = new ResourceICUPlurals();

        const ruleset = new RuleSet([rule1, rule2]);
        expect(ruleset).toBeTruthy();
        expect(ruleset.getSize()).toBe(2);

        // shouldn't do anything
        ruleset.removeRule("foobar-foo");

        expect(ruleset.getSize()).toBe(2);
        let rule = ruleset.getRule("resource-quote-style");
        expect(rule).toBe(rule1);
        rule = ruleset.getRule("resource-icu-plurals");
        expect(rule).toBe(rule2);
    });

    test("RuleSet remove a rule called with the incorrect parameter type", () => {
        expect.assertions(5);

        const rule1 = new ResourceQuoteStyle();
        const rule2 = new ResourceICUPlurals();

        const ruleset = new RuleSet([rule1, rule2]);
        expect(ruleset).toBeTruthy();
        expect(ruleset.getSize()).toBe(2);

        // shouldn't do anything
        ruleset.removeRule(true);

        expect(ruleset.getSize()).toBe(2);
        let rule = ruleset.getRule("resource-quote-style");
        expect(rule).toBe(rule1);
        rule = ruleset.getRule("resource-icu-plurals");
        expect(rule).toBe(rule2);
    });

});

