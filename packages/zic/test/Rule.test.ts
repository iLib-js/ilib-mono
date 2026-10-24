/*
 * Rule.test.ts - unit tests for Rule
 *
 * Copyright © 2014, 2026 JEDLSoft
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

import { RelativeDate, StartRule } from "../src/RelativeDate";
import { Rule } from "../src/Rule";

describe("Rule", () => {
    test("constructor empty", () => {
        expect.assertions(9);
        const rule = new Rule();
        expect(rule.ruleSetName).toBeNull();
        expect(rule.character).toBeNull();
        expect(rule.startYear).toBe(-1);
        expect(rule.endYear).toBe(-1);
        expect(rule.saveHours).toBe(-1);
        expect(rule.saveMinutes).toBe(-1);
        expect(rule.saveSeconds).toBe(-1);
        expect(rule.transitionTime).toBeNull();
        expect(rule.type).toBeNull();
    });

    test("constructor full spaces", () => {
        expect.assertions(9);
        const rule = new Rule(
            "Rule  Chicago 1922    1966    -   Apr lastSun 2:00    1:00    D"
        );
        expect(rule.ruleSetName).toBe("Chicago");
        expect(rule.character).toBe("D");
        expect(rule.startYear).toBe(1922);
        expect(rule.endYear).toBe(1966);
        expect(rule.saveHours).toBe(1);
        expect(rule.saveMinutes).toBe(0);
        expect(rule.saveSeconds).toBe(-1);
        expect(rule.transitionTime).not.toBeNull();
        expect(rule.type).toBeNull();
    });

    test("constructor full right start date", () => {
        expect.assertions(9);
        const rule = new Rule(
            "Rule  Chicago 1922    1966    -   Apr lastSun 2:00    1:00    D"
        );
        const rd = rule.transitionTime as RelativeDate;
        expect(rd.year).toBe(-1);
        expect(rd.month).toBe(3);
        expect(rd.dayOfMonth).toBe(-1);
        expect(rd.dayOfWeek).toBe(0);
        expect(rd.hour).toBe(2);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.LAST);
    });

    test("constructor full tabs", () => {
        expect.assertions(9);
        const rule = new Rule(
            "Rule\tChicago\t1922\t1966\t-\tApr\tlastSun\t2:00\t1:00\tD"
        );
        expect(rule.ruleSetName).toBe("Chicago");
        expect(rule.character).toBe("D");
        expect(rule.startYear).toBe(1922);
        expect(rule.endYear).toBe(1966);
        expect(rule.saveHours).toBe(1);
        expect(rule.saveMinutes).toBe(0);
        expect(rule.saveSeconds).toBe(-1);
        expect(rule.transitionTime).not.toBeNull();
        expect(rule.type).toBeNull();
    });

    test("constructor only", () => {
        expect.assertions(9);
        const rule = new Rule(
            "Rule\tChicago\t1922\tonly\t-\tApr\tlastSun\t2:00\t1:00\tD"
        );
        expect(rule.ruleSetName).toBe("Chicago");
        expect(rule.character).toBe("D");
        expect(rule.startYear).toBe(1922);
        expect(rule.endYear).toBe(1922);
        expect(rule.saveHours).toBe(1);
        expect(rule.saveMinutes).toBe(0);
        expect(rule.saveSeconds).toBe(-1);
        expect(rule.transitionTime).not.toBeNull();
        expect(rule.type).toBeNull();
    });

    test("constructor with type", () => {
        expect.assertions(9);
        const rule = new Rule(
            "Rule\tChicago\t1922\t1966\tfoo\tApr\tlastSun\t2:00\t1:00\tD"
        );
        expect(rule.ruleSetName).toBe("Chicago");
        expect(rule.character).toBe("D");
        expect(rule.startYear).toBe(1922);
        expect(rule.endYear).toBe(1966);
        expect(rule.saveHours).toBe(1);
        expect(rule.saveMinutes).toBe(0);
        expect(rule.saveSeconds).toBe(-1);
        expect(rule.transitionTime).not.toBeNull();
        expect(rule.type).toBe("foo");
    });

    test("constructor with seconds", () => {
        expect.assertions(9);
        const rule = new Rule(
            "Rule\tChicago\t1922\t1966\t-\tApr\tlastSun\t2:00:30\t1:30:30\tD"
        );
        expect(rule.ruleSetName).toBe("Chicago");
        expect(rule.character).toBe("D");
        expect(rule.startYear).toBe(1922);
        expect(rule.endYear).toBe(1966);
        expect(rule.saveHours).toBe(1);
        expect(rule.saveMinutes).toBe(30);
        expect(rule.saveSeconds).toBe(30);
        expect(rule.transitionTime).not.toBeNull();
        expect(rule.type).toBeNull();
    });

    test("constructor with zone char", () => {
        expect.assertions(9);
        const rule = new Rule(
            "Rule\tChicago\t1922\t1966\t-\tApr\tlastSun\t2:00u\t1:00\tD"
        );
        const rd = rule.transitionTime as RelativeDate;
        expect(rd.year).toBe(-1);
        expect(rd.month).toBe(3);
        expect(rd.dayOfMonth).toBe(-1);
        expect(rd.dayOfWeek).toBe(0);
        expect(rd.hour).toBe(2);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("u");
        expect(rd.rule).toBe(StartRule.LAST);
    });

    test("compare less than", () => {
        expect.assertions(1);
        const rule1 = new Rule();
        const rule2 = new Rule();
        rule1.endYear = 1980;
        rule2.endYear = 1990;
        expect(rule1.compareTo(rule2)).toBeLessThan(0);
    });

    test("compare greater than", () => {
        expect.assertions(1);
        const rule1 = new Rule();
        const rule2 = new Rule();
        rule1.endYear = 1980;
        rule2.endYear = 1990;
        expect(rule2.compareTo(rule1)).toBeGreaterThan(0);
    });

    test("compare equal", () => {
        expect.assertions(2);
        const rule1 = new Rule();
        const rule2 = new Rule();
        rule1.endYear = 1990;
        rule2.endYear = 1990;
        expect(rule2.compareTo(rule1)).toBe(0);
        expect(rule1.compareTo(rule2)).toBe(0);
    });

    test("compare less than max", () => {
        expect.assertions(1);
        const rule1 = new Rule();
        const rule2 = new Rule();
        rule1.endYear = 1980;
        rule2.endYear = Number.MAX_SAFE_INTEGER;
        expect(rule1.compareTo(rule2)).toBeLessThan(0);
    });

    test("compare greater than min", () => {
        expect.assertions(1);
        const rule1 = new Rule();
        const rule2 = new Rule();
        rule1.endYear = Number.MIN_SAFE_INTEGER;
        rule2.endYear = 1990;
        expect(rule1.compareTo(rule2)).toBeLessThan(0);
    });

    test("compare equal max", () => {
        expect.assertions(2);
        const rule1 = new Rule();
        const rule2 = new Rule();
        rule1.endYear = Number.MAX_SAFE_INTEGER;
        rule2.endYear = Number.MAX_SAFE_INTEGER;
        expect(rule2.compareTo(rule1)).toBe(0);
        expect(rule1.compareTo(rule2)).toBe(0);
    });

    test("compare equal min", () => {
        expect.assertions(2);
        const rule1 = new Rule();
        const rule2 = new Rule();
        rule1.endYear = Number.MIN_SAFE_INTEGER;
        rule2.endYear = Number.MIN_SAFE_INTEGER;
        expect(rule2.compareTo(rule1)).toBe(0);
        expect(rule1.compareTo(rule2)).toBe(0);
    });

    test("compare by sorting", () => {
        expect.assertions(11);
        const rules: Rule[] = [];
        for (let i = 0; i < 11; i++) {
            const rule = new Rule();
            rule.endYear = 2000 - i;
            rules.push(rule);
        }
        rules.sort((a, b) => a.compareTo(b));
        for (let i = 0; i < 11; i++) {
            expect(rules[i].endYear).toBe(1990 + i);
        }
    });

    test("compare by sorting with max", () => {
        expect.assertions(12);
        const rules: Rule[] = [];
        const maxRule = new Rule();
        maxRule.endYear = Number.MAX_SAFE_INTEGER;
        rules.push(maxRule);
        for (let i = 0; i < 11; i++) {
            const rule = new Rule();
            rule.endYear = 2000 - i;
            rules.push(rule);
        }
        rules.sort((a, b) => a.compareTo(b));
        for (let i = 0; i < 11; i++) {
            expect(rules[i].endYear).toBe(1990 + i);
        }
        expect(rules[11].endYear).toBe(Number.MAX_SAFE_INTEGER);
    });

    test("compare by sorting with min", () => {
        expect.assertions(12);
        const rules: Rule[] = [];
        for (let i = 0; i < 11; i++) {
            const rule = new Rule();
            rule.endYear = 2000 - i;
            rules.push(rule);
        }
        const minRule = new Rule();
        minRule.endYear = Number.MIN_SAFE_INTEGER;
        rules.push(minRule);
        rules.sort((a, b) => a.compareTo(b));
        expect(rules[0].endYear).toBe(Number.MIN_SAFE_INTEGER);
        for (let i = 0; i < 11; i++) {
            expect(rules[i + 1].endYear).toBe(1990 + i);
        }
    });

    test("clone", () => {
        expect.assertions(14);
        const rule = new Rule(
            "Rule  Chicago 1922    1966    -   Apr lastSun 2:00    1:00    D"
        );
        expect(rule.ruleSetName).toBe("Chicago");
        expect(rule.character).toBe("D");
        expect(rule.startYear).toBe(1922);
        expect(rule.endYear).toBe(1966);
        expect(rule.saveHours).toBe(1);
        expect(rule.saveMinutes).toBe(0);
        expect(rule.saveSeconds).toBe(-1);

        const other = rule.clone();
        expect(other.ruleSetName).toBe("Chicago");
        expect(other.character).toBe("D");
        expect(other.startYear).toBe(1922);
        expect(other.endYear).toBe(1966);
        expect(other.saveHours).toBe(1);
        expect(other.saveMinutes).toBe(0);
        expect(other.saveSeconds).toBe(-1);
    });

    test("clone transition rule", () => {
        expect.assertions(18);
        const rule = new Rule(
            "Rule  Chicago 1922    1966    -   Apr lastSun 2:00    1:00    D"
        );
        const rd = rule.transitionTime as RelativeDate;
        expect(rd.year).toBe(-1);
        expect(rd.month).toBe(3);
        expect(rd.dayOfMonth).toBe(-1);
        expect(rd.dayOfWeek).toBe(0);
        expect(rd.hour).toBe(2);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.LAST);

        const other = rule.clone();
        const otherrd = other.transitionTime as RelativeDate;
        expect(otherrd.year).toBe(-1);
        expect(otherrd.month).toBe(3);
        expect(otherrd.dayOfMonth).toBe(-1);
        expect(otherrd.dayOfWeek).toBe(0);
        expect(otherrd.hour).toBe(2);
        expect(otherrd.minute).toBe(0);
        expect(otherrd.second).toBe(-1);
        expect(otherrd.zoneChar).toBe("w");
        expect(otherrd.rule).toBe(StartRule.LAST);
    });

    test("clone transition rule is cloned too", () => {
        expect.assertions(1);
        const rule = new Rule(
            "Rule  Chicago 1922    1966    -   Apr lastSun 2:00    1:00    D"
        );
        const rd = rule.transitionTime;
        const other = rule.clone();
        expect(rd).not.toBe(other.transitionTime);
    });

    test("hasSavings is false for an empty rule", () => {
        expect.assertions(1);
        expect(new Rule().hasSavings()).toBe(false);
    });

    test("hasSavings is false for zero SAVE", () => {
        expect.assertions(1);
        const rule = new Rule(
            "Rule\tUS\t2007\tmax\t-\tNov\tSun>=1\t2:00\t0\tS"
        );
        expect(rule.hasSavings()).toBe(false);
    });

    test("hasSavings is true for positive SAVE", () => {
        expect.assertions(1);
        const rule = new Rule(
            "Rule\tUS\t2007\tmax\t-\tMar\tSun>=8\t2:00\t1:00\tD"
        );
        expect(rule.hasSavings()).toBe(true);
    });

    test("hasSavings is true for negative SAVE (Ireland-style)", () => {
        expect.assertions(3);
        const rule = new Rule(
            "Rule\tEire\t1996\tmax\t-\tOct\tlastSun\t1:00u\t-1:00\t-"
        );
        expect(rule.saveHours).toBe(-1);
        expect(rule.saveMinutes).toBe(0);
        expect(rule.hasSavings()).toBe(true);
    });

    test("getJson includes negative SAVE in v", () => {
        expect.assertions(1);
        const rule = new Rule(
            "Rule\tEire\t1996\tmax\t-\tOct\tlastSun\t1:00u\t-1:00\t-"
        );
        expect(rule.getJson(true).v).toBe("-1:0");
    });

    test("SAVE of dash means zero savings", () => {
        expect.assertions(4);
        const rule = new Rule(
            "Rule\tEire\t1981\tmax\t-\tMar\tlastSun\t1:00u\t-\t-"
        );
        expect(rule.saveHours).toBe(0);
        expect(rule.saveMinutes).toBe(0);
        expect(rule.saveSeconds).toBe(0);
        expect(rule.hasSavings()).toBe(false);
    });
});
