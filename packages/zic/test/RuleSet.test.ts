/*
 * RuleSet.test.ts - unit tests for RuleSet
 *
 * Copyright © 2026 JEDLSoft
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

import { Rule } from "../src/Rule";
import { RuleSet } from "../src/RuleSet";

describe("RuleSet", () => {
    test("starts empty with a null name", () => {
        expect.assertions(2);
        const ruleSet = new RuleSet();
        expect(ruleSet.getName()).toBeNull();
        expect(ruleSet.getRules()).toEqual([]);
    });

    test("setName and getName round-trip", () => {
        expect.assertions(2);
        const ruleSet = new RuleSet();
        ruleSet.setName("US");
        expect(ruleSet.getName()).toBe("US");
        expect(ruleSet.name).toBe("US");
    });

    test("add appends rules in insertion order", () => {
        expect.assertions(3);
        const ruleSet = new RuleSet();
        const older = new Rule(
            "Rule\tUS\t1967\t2006\t-\tOct\tlastSun\t2:00\t0\tS"
        );
        const newer = new Rule(
            "Rule\tUS\t2007\tmax\t-\tNov\tSun>=1\t2:00\t0\tS"
        );

        ruleSet.add(older);
        ruleSet.add(newer);

        const rules = ruleSet.getRules();
        expect(rules.length).toBe(2);
        expect(rules[0]).toBe(older);
        expect(rules[1]).toBe(newer);
    });

    test("sortRules orders by end year ascending", () => {
        expect.assertions(4);
        const ruleSet = new RuleSet();
        const max = new Rule(
            "Rule\tUS\t2007\tmax\t-\tNov\tSun>=1\t2:00\t0\tS"
        );
        const mid = new Rule(
            "Rule\tUS\t1967\t2006\t-\tOct\tlastSun\t2:00\t0\tS"
        );
        const only = new Rule(
            "Rule\tUS\t1920\tonly\t-\tMar\tlastSun\t2:00\t1:00\tD"
        );

        ruleSet.add(max);
        ruleSet.add(mid);
        ruleSet.add(only);
        ruleSet.sortRules();

        const rules = ruleSet.getRules();
        expect(rules.length).toBe(3);
        expect(rules[0]).toBe(only);
        expect(rules[1]).toBe(mid);
        expect(rules[2]).toBe(max);
    });

    test("getRules returns the live internal list", () => {
        expect.assertions(2);
        const ruleSet = new RuleSet();
        const rule = new Rule(
            "Rule\tUS\t2007\tmax\t-\tMar\tSun>=8\t2:00\t1:00\tD"
        );
        ruleSet.add(rule);

        const first = ruleSet.getRules();
        const second = ruleSet.getRules();
        expect(first).toBe(second);
        expect(first[0]).toBe(rule);
    });
});
