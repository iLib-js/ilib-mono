/*
 * Zone.test.ts - unit tests for Zone
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

import { Rule } from "../src/Rule";
import { RuleSet } from "../src/RuleSet";
import { Zone } from "../src/Zone";

describe("Zone", () => {
    test("constructor empty", () => {
        expect.assertions(2);
        const zone = new Zone();
        expect(zone.getName()).toBeNull();
        expect(zone.getOffsets().length).toBe(0);
    });

    test("constructor full spaces", () => {
        expect.assertions(2);
        const ruleSets = new Map<string, RuleSet>();
        const zone = new Zone("Zone  Africa/Lome 0:04:52 -   LMT 1893", ruleSets);
        expect(zone.getName()).toBe("Africa/Lome");
        expect(zone.getOffsets().length).toBe(1);
    });

    test("constructor full spaces right offset", () => {
        expect.assertions(9);
        const ruleSets = new Map<string, RuleSet>();
        const zone = new Zone("Zone  Africa/Lome 0:04:52 -   LMT 1893", ruleSets);
        expect(zone.getName()).toBe("Africa/Lome");
        const offsets = zone.getOffsets();
        expect(offsets.length).toBe(1);
        const offset = offsets[0];
        expect(offset.offsetHours).toBe(0);
        expect(offset.offsetMinutes).toBe(4);
        expect(offset.offsetSeconds).toBe(52);
        expect(offset.rules).toBeNull();
        expect(offset.format).toBe("LMT");
        const rd = offset.endDate;
        expect(rd).not.toBeNull();
        expect(rd!.year).toBe(1893);
    });

    test("constructor full tabs", () => {
        expect.assertions(2);
        const ruleSets = new Map<string, RuleSet>();
        const zone = new Zone(
            "Zone\tAfrica/Lome\t0:04:52\t-\tLMT\t1893",
            ruleSets
        );
        expect(zone.getName()).toBe("Africa/Lome");
        expect(zone.getOffsets().length).toBe(1);
    });

    test("getJson expands %z FORMAT to -03/-02 style for Sao_Paulo-like zone", () => {
        expect.assertions(2);
        // Patterned on tzdata main form: Zone … -3:00 Brazil %z
        const ruleSets = new Map<string, RuleSet>();
        const zone = new Zone(
            "Zone\tAmerica/Sao_Paulo\t-3:00\tBrazil\t%z",
            ruleSets
        );
        const brazil = ruleSets.get("Brazil")!;
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

        const json = zone.getJson(true);
        expect(json).not.toBeNull();
        expect(json!.f).toBe("-03/-02");
    });
});
