/*
 * RuleManager.test.js - test the rule manager
 *
 * Copyright © 2022-2024 JEDLSoft
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
import { Rule } from 'ilib-lint-common';

import RuleManager from '../src/RuleManager.js';
import ResourceMatcher from '../src/rules/ResourceMatcher.js';

class MockRule extends Rule {
    constructor(options) {
        super(options);
        this.name = "resource-mock-programmatic";
        this.description = "Mock programmatic rule to test the rule manager";
        if (options && options.style) {
            this.style = options.style;
        }
    }

    getRuleType() {
        return "resource";
    }

    /**
     * @override
     */
    match(options) {
        const { locale, resource, file } = options || {};
        return new Result({
            severity: "warning",
            id: resource.getKey(),
            source: resource.getSource(),
            rule: this,
            pathName: file,
            highlight: `Target: ${tar.replace(/test/g, "<e0>$1</e0>")}`,
            description: `Target should not contain the word "test"`
        });
    }
}

describe("testRuleManager", () => {
    test("RuleManagerConstructor", () => {
        expect.assertions(1);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();
    });

    test("RuleManagerNormal", () => {
        expect.assertions(3);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();

        const rule = mgr.get("resource-icu-plurals");

        expect(rule).toBeTruthy();
        expect(rule instanceof Rule).toBeTruthy();
    });

    test("RuleManagerNotFound", () => {
        expect.assertions(2);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();
        const rule = mgr.get("non-existent");

        expect(!rule).toBeTruthy();
    });

    test("RuleManagerAddRuleRightNumbers", () => {
        expect.assertions(3);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();

        expect(mgr.size()).toBe(3);
        mgr.add(MockRule);
        expect(mgr.size()).toBe(4);
    });

    test("RuleManagerAddRuleRightTypeProgrammatic", () => {
        expect.assertions(4);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();

        expect(mgr.size()).toBe(3);
        mgr.add(MockRule);

        const rule = mgr.get("resource-mock-programmatic");

        expect(rule).toBeTruthy();
        expect(rule instanceof Rule).toBeTruthy();
    });

    test("RuleManagerAddRuleRightOptionsProgrammatic", () => {
        expect.assertions(4);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();

        expect(mgr.size()).toBe(3);
        mgr.add(MockRule);

        const rule = mgr.get("resource-mock-programmatic", {
            style: "style2"
        });

        expect(rule).toBeTruthy();
        expect(rule.style).toBe("style2");
    });

    test("RuleManagerAddRuleRightOptionsProgrammaticMultiple", () => {
        expect.assertions(6);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();

        expect(mgr.size()).toBe(3);
        mgr.add(MockRule);

        let rule = mgr.get("resource-mock-programmatic", {
            style: "style2"
        });

        expect(rule).toBeTruthy();
        expect(rule.style).toBe("style2");

        rule = mgr.get("resource-mock-programmatic", {
            style: "style15"
        });

        expect(rule).toBeTruthy();
        expect(rule.style).toBe("style15");
    });

    test("RuleManagerAddRuleRightNumbersDeclarative", () => {
        expect.assertions(3);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();

        expect(mgr.size()).toBe(3);
        mgr.add({
            type: "resource-matcher",
            name: "resource-mock-declarative",
            description: "Mock declarative ruile",
            note: "Word '{matchString}' from the source string does not appear in the target string",
            regexps: [ "test", "foobar" ]
        });
        expect(mgr.size()).toBe(4);
    });

    test("RuleManagerAddRuleRightTypeDeclarative", () => {
        expect.assertions(4);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();

        expect(mgr.size()).toBe(3);
        mgr.add({
            type: "resource-matcher",
            name: "resource-mock-declarative",
            description: "Mock declarative ruile",
            note: "Word '{matchString}' from the source string does not appear in the target string",
            regexps: [ "test", "foobar" ]
        });

        const rule = mgr.get("resource-mock-declarative");

        expect(rule).toBeTruthy();
        expect(rule instanceof ResourceMatcher).toBeTruthy();
    });

    test("RuleManagerAddRuleRightNumbersMultiple", () => {
        expect.assertions(3);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();

        expect(mgr.size()).toBe(3);
        mgr.add([
            MockRule,
            {
                type: "resource-matcher",
                name: "resource-mock-declarative",
                description: "Mock declarative ruile",
                note: "Word '{matchString}' from the source string does not appear in the target string",
                regexps: [ "test", "foobar" ]
            }
        ]);
        expect(mgr.size()).toBe(5);
    });

    test("RuleManagerAddRuleSetDefinitionSize", () => {
        expect.assertions(3);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();
        const expected = {
            "resource-mock-programmatic": true,
            "resource-mock-declarative": true
        };
        expect(mgr.sizeRuleSetDefinitions()).toBe(0);
        mgr.addRuleSetDefinition("foo", expected);
        expect(mgr.sizeRuleSetDefinitions()).toBe(1);
    });

    test("RuleManagerAddRuleSetDefinitionContents", () => {
        expect.assertions(2);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();
        const expected = {
            "resource-mock-programmatic": true,
            "resource-mock-declarative": true
        };

        mgr.addRuleSetDefinition("foo", expected);

        const rules = mgr.getRuleSetDefinition("foo");
        expect(rules).toStrictEqual(expected);
    });

    test("RuleManagerAddRuleSetDefinitionEmptySize", () => {
        expect.assertions(3);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();

        expect(mgr.sizeRuleSetDefinitions()).toBe(0);
        mgr.addRuleSetDefinition("foo", undefined);
        expect(mgr.sizeRuleSetDefinitions()).toBe(0);
    });

    test("RuleManagerAddRuleSetDefinitionEmptyContent", () => {
        expect.assertions(2);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();

        mgr.addRuleSetDefinition("foo", undefined);
        const rules = mgr.getRuleSetDefinition("foo");
        expect(!rules).toBeTruthy();
    });

    test("RuleManagerAddRuleSetDefinitionNonobjectSize", () => {
        expect.assertions(3);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();

        expect(mgr.sizeRuleSetDefinitions()).toBe(0);
        mgr.addRuleSetDefinition("foo", "asdf");
        expect(mgr.sizeRuleSetDefinitions()).toBe(0);
    });

    test("RuleManagerAddRuleSetDefinitionNonobjectContent", () => {
        expect.assertions(2);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();

        mgr.addRuleSetDefinition("foo", "asdf");
        const rules = mgr.getRuleSetDefinition("foo");
        expect(!rules).toBeTruthy();
    });

    test("RuleManagerAddRuleSetDefinitionWithParamsSize", () => {
        expect.assertions(3);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();
        const expected = {
            "resource-mock-programmatic": {
                "style": "funky"
            },
            "resource-mock-declarative": true
        };
        expect(mgr.sizeRuleSetDefinitions()).toBe(0);
        mgr.addRuleSetDefinition("foo", expected);
        expect(mgr.sizeRuleSetDefinitions()).toBe(1);
    });

    test("RuleManagerAddRuleSetDefinitionWithParamsContents", () => {
        expect.assertions(2);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();
        const expected = {
            "resource-mock-programmatic": {
                "style": "funky"
            },
            "resource-mock-declarative": true
        };
        mgr.addRuleSetDefinition("foo", expected);
        const rules = mgr.getRuleSetDefinition("foo");
        expect(rules["resource-mock-programmatic"]).toStrictEqual({
            "style": "funky"
        });
    });

    test("RuleManagerAddRuleSetDefinitionsWithParamsSize", () => {
        expect.assertions(3);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();
        const ruleDefs = {
            "foo": {
                "resource-mock-programmatic": {
                    "style": "funky"
                },
                "resource-mock-declarative": true
            },
            "bar": {
                "resource-icu-plurals": true,
                "resource-unique-keys": true
            }
        };
        expect(mgr.sizeRuleSetDefinitions()).toBe(0);
        mgr.addRuleSetDefinitions(ruleDefs);
        expect(mgr.sizeRuleSetDefinitions()).toBe(2);
    });

    test("RuleManagerAddRuleSetDefinitionsWithParamsSize", () => {
        expect.assertions(2);

        const mgr = new RuleManager();
        expect(mgr).toBeTruthy();
        const ruleDefs = {
            "foo": {
                "resource-mock-programmatic": {
                    "style": "funky"
                },
                "resource-mock-declarative": true
            },
            "bar": {
                "resource-icu-plurals": true,
                "resource-unique-keys": true
            }
        };
        mgr.addRuleSetDefinitions(ruleDefs);

        const rules = mgr.getRuleSetDefinition("foo");
        const expected = {
            "resource-mock-programmatic": {
                "style": "funky"
            },
            "resource-mock-declarative": true
        };
        expect(rules).toStrictEqual(expected);
    });
});

