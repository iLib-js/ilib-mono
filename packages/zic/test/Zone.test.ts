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
});
