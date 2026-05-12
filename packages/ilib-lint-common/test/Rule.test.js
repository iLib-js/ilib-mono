/*
 * Rule.test.js - test the rule superclass object
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

import Rule from '../src/Rule.js';

class MockRule extends Rule {
    constructor(options) {
        super(options);
        this.name = "mock";
        this.description = "asdf asdf";
        this.link = "https://github.com/docs/rule.md";
    }
}

describe("testRule", () => {
    test("RuleNormal", () => {
        expect.assertions(1);

        const rule = new MockRule();

        expect(rule).toBeTruthy();
    });

    test("RuleCannotInstantiateAbstractClass", () => {
        expect.assertions(1);

        expect(() => {
            new Rule();
        }).toThrow();
    });

    test("RuleGetName", () => {
        expect.assertions(2);

        const rule = new MockRule();

        expect(rule).toBeTruthy();

        expect(rule.getName()).toBe("mock");
    });

    test("RuleGetExtensions", () => {
        expect.assertions(2);

        const rule = new MockRule();

        expect(rule).toBeTruthy();

        expect(rule.getDescription()).toBe("asdf asdf");
    });

    test("RuleGetSourceLocaleDefault", () => {
        expect.assertions(2);

        const rule = new MockRule();

        expect(rule).toBeTruthy();

        expect(rule.getSourceLocale()).toBe("en-US");
    });

    test("RuleGetSourceLocaleExplicit", () => {
        expect.assertions(2);

        const rule = new MockRule({
            sourceLocale: "de-DE"
        });

        expect(rule).toBeTruthy();

        expect(rule.getSourceLocale()).toBe("de-DE");
    });

    test("RuleGetRuleType", () => {
        expect.assertions(2);

        const rule = new MockRule();

        expect(rule).toBeTruthy();

        expect(rule.getRuleType()).toBe("string");
    });

    test("RuleGetLink", () => {
        expect.assertions(2);

        const rule = new MockRule();

        expect(rule).toBeTruthy();

        expect(rule.getLink()).toBe("https://github.com/docs/rule.md");
    });

    test("RuleGetParamDefault", () => {
        expect.assertions(2);

        const rule = new MockRule();

        expect(rule).toBeTruthy();

        expect(rule.getParam()).toBeUndefined();
    });

    test("RuleGetParamString", () => {
        expect.assertions(2);

        const rule = new MockRule({
            param: "signed-off"
        });

        expect(rule).toBeTruthy();

        expect(rule.getParam()).toBe("signed-off");
    });

    test("RuleGetParamArray", () => {
        expect.assertions(2);

        const rule = new MockRule({
            param: ["translated", "needs-review"]
        });

        expect(rule).toBeTruthy();

        expect(rule.getParam()).toEqual(["translated", "needs-review"]);
    });

});

