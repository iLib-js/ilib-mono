/*
 * Offset.test.ts - unit tests for Offset
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

import { Offset } from "../src/Offset";
import { RelativeDate, StartRule } from "../src/RelativeDate";
import { Rule } from "../src/Rule";
import { RuleSet } from "../src/RuleSet";

describe("Offset", () => {
    test("constructor", () => {
        expect.assertions(1);
        const o = new Offset();
        expect(o).toBeDefined();
    });

    test("setFields regular fields", () => {
        expect.assertions(4);
        const o = new Offset();
        const ruleSets = new Map<string, RuleSet>();
        o.setFields("\t\t-5:00\tUS\tE%sT\t1920", ruleSets, "America/New_York");
        expect(o.offsetHours).toBe(-5);
        expect(o.offsetMinutes).toBe(0);
        expect(o.offsetSeconds).toBe(0);
        expect(o.format).toBe("E%sT");
    });

    test("setFields end date optional", () => {
        expect.assertions(9);
        const o = new Offset();
        const ruleSets = new Map<string, RuleSet>();
        o.setFields("\t\t-5:00\tUS\tE%sT", ruleSets, "America/New_York");
        const rd = o.endDate as RelativeDate;
        expect(rd.year).toBe(-1);
        expect(rd.month).toBe(-1);
        expect(rd.dayOfMonth).toBe(-1);
        expect(rd.dayOfWeek).toBe(-1);
        expect(rd.hour).toBe(-1);
        expect(rd.minute).toBe(-1);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.EQUAL);
    });

    test("setFields end date year only", () => {
        expect.assertions(9);
        const o = new Offset();
        const ruleSets = new Map<string, RuleSet>();
        o.setFields("\t\t-5:00\tUS\tE%sT\t1920", ruleSets, "America/New_York");
        const rd = o.endDate as RelativeDate;
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(-1);
        expect(rd.dayOfMonth).toBe(-1);
        expect(rd.dayOfWeek).toBe(-1);
        expect(rd.hour).toBe(-1);
        expect(rd.minute).toBe(-1);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.EQUAL);
    });

    test("setFields end date year month", () => {
        expect.assertions(9);
        const o = new Offset();
        const ruleSets = new Map<string, RuleSet>();
        o.setFields(
            "\t\t-5:00\tUS\tE%sT\t1920\tFeb",
            ruleSets,
            "America/New_York"
        );
        const rd = o.endDate as RelativeDate;
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(-1);
        expect(rd.dayOfWeek).toBe(-1);
        expect(rd.hour).toBe(-1);
        expect(rd.minute).toBe(-1);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.EQUAL);
    });

    test("setFields end date year month day", () => {
        expect.assertions(9);
        const o = new Offset();
        const ruleSets = new Map<string, RuleSet>();
        o.setFields(
            "\t\t-5:00\tUS\tE%sT\t1920\tFeb\t20",
            ruleSets,
            "America/New_York"
        );
        const rd = o.endDate as RelativeDate;
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(20);
        expect(rd.dayOfWeek).toBe(-1);
        expect(rd.hour).toBe(-1);
        expect(rd.minute).toBe(-1);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.EQUAL);
    });

    test("setFields end date year month day time", () => {
        expect.assertions(9);
        const o = new Offset();
        const ruleSets = new Map<string, RuleSet>();
        o.setFields(
            "\t\t-5:00\tUS\tE%sT\t1920\tFeb\t20\t2:00:23",
            ruleSets,
            "America/New_York"
        );
        const rd = o.endDate as RelativeDate;
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(20);
        expect(rd.dayOfWeek).toBe(-1);
        expect(rd.hour).toBe(2);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(23);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.EQUAL);
    });

    test("setFields rules", () => {
        expect.assertions(1);
        const o = new Offset();
        const ruleSets = new Map<string, RuleSet>();
        o.setFields("\t\t-5:00\tUS\tE%sT\t1920", ruleSets, "America/New_York");
        expect(o.rules!.getName()).toBe("US");
    });

    test("setFields rules none", () => {
        expect.assertions(1);
        const o = new Offset();
        const ruleSets = new Map<string, RuleSet>();
        o.setFields("\t\t-5:00\t-\tE%sT\t1920", ruleSets, "America/New_York");
        expect(o.rules).toBeNull();
    });

    test("compare less than", () => {
        expect.assertions(1);
        const o1 = new Offset();
        const o2 = new Offset();
        const endDate1 = new RelativeDate();
        const endDate2 = new RelativeDate();
        endDate1.year = 1968;
        endDate2.year = 1969;
        o1.endDate = endDate1;
        o2.endDate = endDate2;
        expect(o1.compareTo(o2)).toBe(-1);
    });

    test("compare greater than", () => {
        expect.assertions(1);
        const o1 = new Offset();
        const o2 = new Offset();
        const endDate1 = new RelativeDate();
        const endDate2 = new RelativeDate();
        endDate1.year = 1968;
        endDate2.year = 1969;
        o1.endDate = endDate1;
        o2.endDate = endDate2;
        expect(o2.compareTo(o1)).toBe(1);
    });

    test("compare equal", () => {
        expect.assertions(1);
        const o1 = new Offset();
        const o2 = new Offset();
        const endDate1 = new RelativeDate();
        const endDate2 = new RelativeDate();
        endDate1.year = 1968;
        endDate2.year = 1968;
        o1.endDate = endDate1;
        o2.endDate = endDate2;
        expect(o2.compareTo(o1)).toBe(0);
    });

    test("compare less than with null", () => {
        expect.assertions(1);
        const o1 = new Offset();
        const o2 = new Offset();
        const endDate1 = new RelativeDate();
        endDate1.year = 1968;
        o1.endDate = endDate1;
        expect(o1.compareTo(o2)).toBeLessThan(0);
    });

    test("compare greater than with null", () => {
        expect.assertions(1);
        const o1 = new Offset();
        const o2 = new Offset();
        const endDate1 = new RelativeDate();
        endDate1.year = 1968;
        o1.endDate = endDate1;
        expect(o2.compareTo(o1)).toBeGreaterThan(0);
    });

    test("compare equal with null", () => {
        expect.assertions(1);
        const o1 = new Offset();
        const o2 = new Offset();
        expect(o2.compareTo(o1)).toBe(0);
    });

    test("compare by sorting", () => {
        expect.assertions(11);
        const offsets: Offset[] = [];
        for (let i = 0; i < 11; i++) {
            const offset = new Offset();
            const endDate = new RelativeDate();
            endDate.year = 1980 - i;
            offset.endDate = endDate;
            offsets.push(offset);
        }
        offsets.sort((a, b) => a.compareTo(b));
        for (let i = 0; i < 11; i++) {
            expect(offsets[i].endDate!.year).toBe(1970 + i);
        }
    });

    test("compare by sorting with null", () => {
        expect.assertions(23);
        const offsets: Offset[] = [];
        offsets.push(new Offset());
        for (let i = 0; i < 11; i++) {
            const offset = new Offset();
            const endDate = new RelativeDate();
            endDate.year = 1980 - i;
            offset.endDate = endDate;
            offsets.push(offset);
        }
        offsets.sort((a, b) => a.compareTo(b));
        for (let i = 0; i < 11; i++) {
            expect(offsets[i].endDate).not.toBeNull();
            expect(offsets[i].endDate!.year).toBe(1970 + i);
        }
        expect(offsets[11].endDate).toBeNull();
    });

    test("compare by sorting with empty end date", () => {
        expect.assertions(24);
        const offsets: Offset[] = [];
        const empty = new Offset();
        empty.endDate = new RelativeDate();
        offsets.push(empty);
        for (let i = 0; i < 11; i++) {
            const offset = new Offset();
            const endDate = new RelativeDate();
            endDate.year = 1980 - i;
            offset.endDate = endDate;
            offsets.push(offset);
        }
        offsets.sort((a, b) => a.compareTo(b));
        for (let i = 0; i < 11; i++) {
            expect(offsets[i].endDate).not.toBeNull();
            expect(offsets[i].endDate!.year).toBe(1970 + i);
        }
        expect(offsets[11].endDate).not.toBeNull();
        expect(offsets[11].endDate!.year).toBe(-1);
    });

    describe("abbreviation format %z", () => {
        /**
         * Build an offset like America/Sao_Paulo's current line:
         * `-3:00 Brazil %z` with DST rules that apply through `max`.
         */
        function saoPauloStyleOffset(): Offset {
            const ruleSets = new Map<string, RuleSet>();
            const offset = new Offset(
                "\t\t-3:00\tBrazil\t%z",
                ruleSets,
                "America/Sao_Paulo"
            );
            const brazil = ruleSets.get("Brazil")!;
            // LETTER is "-" (unused when FORMAT is %z); SAVE drives the abbrev
            brazil.add(
                new Rule(
                    "Rule\tBrazil\t2007\tmax\t-\tOct\tSun>=15\t0:00\t1:00\t-"
                )
            );
            brazil.add(
                new Rule(
                    "Rule\tBrazil\t2007\tmax\t-\tFeb\tSun>=15\t0:00\t0\t-"
                )
            );
            return offset;
        }

        test("expands %z with DST to std/dst slash form like -03/-02", () => {
            expect.assertions(2);
            const json = saoPauloStyleOffset().getJson(true);
            // zic abbroffset: -3h → "-03"; -3h+1h → "-02"
            expect(json.f).toBe("-03/-02");
            expect(json.o).toBe("-3:0");
        });

        test("expands %z without rules to a single numeric abbrev", () => {
            expect.assertions(1);
            const ruleSets = new Map<string, RuleSet>();
            const offset = new Offset(
                "\t\t-3:00\t-\t%z",
                ruleSets,
                "America/Argentina/Salta"
            );
            expect(offset.getJson(true).f).toBe("-03");
        });

        test("expands %z with positive offset and minutes like +0530", () => {
            expect.assertions(1);
            const ruleSets = new Map<string, RuleSet>();
            const offset = new Offset(
                "\t\t5:30\t-\t%z",
                ruleSets,
                "Asia/Colombo"
            );
            expect(offset.getJson(true).f).toBe("+0530");
        });

        test("expands %z with DST and minutes to slash form like +1245/+1345", () => {
            expect.assertions(1);
            const ruleSets = new Map<string, RuleSet>();
            const offset = new Offset(
                "\t\t12:45\tChatham\t%z",
                ruleSets,
                "Pacific/Chatham"
            );
            const chatham = ruleSets.get("Chatham")!;
            chatham.add(
                new Rule(
                    "Rule\tChatham\t2007\tmax\t-\tSep\tlastSun\t2:45\t1:00\t-"
                )
            );
            chatham.add(
                new Rule(
                    "Rule\tChatham\t2008\tmax\t-\tApr\tSun>=1\t2:45\t0\t-"
                )
            );
            expect(offset.getJson(true).f).toBe("+1245/+1345");
        });

        test("still converts %s to {c} when FORMAT is letter-based", () => {
            expect.assertions(1);
            const ruleSets = new Map<string, RuleSet>();
            const offset = new Offset(
                "\t\t-5:00\tUS\tE%sT",
                ruleSets,
                "America/New_York"
            );
            const us = ruleSets.get("US")!;
            us.add(
                new Rule(
                    "Rule\tUS\t2007\tmax\t-\tMar\tSun>=8\t2:00\t1:00\tD"
                )
            );
            us.add(
                new Rule(
                    "Rule\tUS\t2007\tmax\t-\tNov\tSun>=1\t2:00\t0\tS"
                )
            );
            expect(offset.getJson(true).f).toBe("E{c}T");
        });
    });
});
