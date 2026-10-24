/*
 * Offset.ts - models a GMT offset for a zone in a particular time frame
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

import { ParseException } from "./ParseException";
import { RelativeDate } from "./RelativeDate";
import { Rule } from "./Rule";
import { RuleSet } from "./RuleSet";

/**
 * Models an offset from GMT in a particular time frame, optionally with
 * a shared daylight-savings rule set.
 */
export class Offset {
    /**
     * Hours component of the GMT offset (may be negative).
     */
    offsetHours = 0;

    /**
     * Minutes component of the GMT offset.
     */
    offsetMinutes = 0;

    /**
     * Seconds component of the GMT offset.
     */
    offsetSeconds = 0;

    /**
     * Named DST rule set referenced by this offset, or `null` when none
     * (`-` in tzdata).
     */
    rules: RuleSet | null = null;

    /**
     * Abbreviation format string from tzdata FORMAT column
     * (for example `"E%sT"`, `"%z"`, `"GMT"`, or `"-03/-02"`).
     *
     * When serializing, `%s` becomes `{c}` and `%z` becomes a numeric
     * UT-offset abbreviation (`-03` or `-03/-02` for std/DST), matching
     * IANA zic's `abbroffset` rules.
     */
    format: string | null = null;

    /**
     * When this offset stops applying. `null` means it is still current
     * (no until fields on the zone line).
     */
    endDate: RelativeDate | null = null;

    /**
     * Create an empty offset, or parse fields from a Zone / continuation line.
     *
     * @param line Line text to parse (zone name may occupy `fields[0]`)
     * @param ruleSets Shared map of named rule sets
     * @param timeZoneName Zone id (kept for API parity; unused in parsing)
     */
    constructor(
        line?: string,
        ruleSets?: Map<string, RuleSet>,
        timeZoneName?: string
    ) {
        if (line !== undefined && ruleSets !== undefined) {
            this.setFields(line, ruleSets, timeZoneName || "");
        }
    }

    /**
     * Populate this offset from a split Zone or continuation line.
     *
     * Always reads the numeric GMT offset from `fields[1]` after splitting
     * on whitespace (matching the Java port).
     *
     * @param line Source line text
     * @param ruleSets Shared map of named rule sets (created on demand)
     * @param _timeZoneName Unused; retained for call-site compatibility
     * @throws {ParseException} If the line does not have enough fields
     */
    setFields(
        line: string,
        ruleSets: Map<string, RuleSet>,
        _timeZoneName: string
    ): void {
        const fields = line.split(/[ \t]+/);

        if (fields.length < 4) {
            throw new ParseException(
                "Bad offset definition. Not enough fields (" +
                    fields.length +
                    ") in " +
                    line
            );
        }

        const parts = fields[1].trim().split(":");
        if (parts.length > 0) {
            this.offsetHours = parseInt(parts[0], 10);
            if (parts.length > 1) {
                this.offsetMinutes = parseInt(parts[1], 10);
                if (parts.length > 2) {
                    this.offsetSeconds = parseInt(parts[2], 10);
                }
            }
        }

        if (fields[2].length > 0 && fields[2] !== "-") {
            let rules = ruleSets.get(fields[2]);
            if (!rules) {
                rules = new RuleSet();
                rules.setName(fields[2]);
                ruleSets.set(fields[2], rules);
            }
            this.rules = rules;
        }

        if (fields[3].length > 0) {
            this.format = fields[3];
        }

        if (fields.length >= 4) {
            this.endDate = new RelativeDate();
            this.endDate.parse(fields, 4);
        }
    }

    /**
     * Compare by end date. An offset with no end date (current) sorts last.
     *
     * @param other Offset to compare against
     * @returns Negative if this ends earlier, positive if later, else `0`
     */
    compareTo(other: Offset): number {
        // no end date means the offset is current
        if (this.endDate === null) {
            return other.endDate === null ? 0 : 1;
        }
        if (other.endDate === null) {
            return -1;
        }
        return this.endDate.compareTo(other.endDate);
    }

    /**
     * Serialize this offset to the compact JSON shape used in zoneinfo.
     *
     * When `currentOnly` is true and rules are present, also emits wall-time
     * DST start (`s`) and end (`e`) rules for the current year.
     *
     * @param currentOnly Whether to include current DST start/end rules
     * @returns JSON object with keys such as `o`, `f`, `s`, and `e`
     */
    getJson(currentOnly: boolean): Record<string, unknown> {
        const json: Record<string, unknown> = {};

        json.o = this.offsetHours + ":" + this.offsetMinutes;
        const format = this.format || "";
        json.f = format.replace("%s", "{c}");

        let startRule: Rule | null = null;
        let endRule: Rule | null = null;
        let lastRule: Rule | undefined;

        if (currentOnly && this.rules !== null) {
            const year = new Date().getFullYear();
            const rulesList = this.rules.getRules();
            lastRule = rulesList[rulesList.length - 1];

            for (let i = 0; i < rulesList.length; i++) {
                const rule = rulesList[i];
                // year-1 handles southern hemisphere where the end rule
                // happens before the start rule each year
                if (
                    rule.startYear <= year &&
                    year - 1 <= rule.endYear
                ) {
                    if (rule.hasSavings()) {
                        startRule = rule;
                    } else {
                        endRule = rule;
                    }
                }
            }

            if (startRule !== null) {
                const wallTime = startRule.clone();
                const rd = wallTime.transitionTime;
                if (rd) {
                    rd.offsetToWallTime(
                        this.offsetHours,
                        this.offsetMinutes,
                        0,
                        0
                    );
                }
                json.s = wallTime.getJson(currentOnly);
            }
            if (endRule !== null) {
                const wallTime = endRule.clone();
                const rd = wallTime.transitionTime;
                if (rd) {
                    if (startRule !== null) {
                        rd.offsetToWallTime(
                            this.offsetHours,
                            this.offsetMinutes,
                            startRule.saveHours,
                            startRule.saveMinutes
                        );
                    }
                }
                json.e = wallTime.getJson(currentOnly);
            }

            if (format.trim() === "%s" && lastRule) {
                json.f = lastRule.character;
            } else if (
                format.indexOf("%s") !== -1 &&
                startRule === null &&
                endRule === null
            ) {
                // no DST — replace stray %s with S for Standard time
                json.f = format.replace("%s", "S");
            }
        }

        if (format.trim() === "%z" || format.indexOf("%z") !== -1) {
            json.f = this.formatPercentZ(startRule);
        }

        return json;
    }

    /**
     * Expand IANA `%z` FORMAT using zic's `abbroffset` rules:
     * `±hh`, `±hhmm`, or `±hhmmss` (shortest form that keeps precision).
     * With a DST savings rule, emit `std/dst` slash form (e.g. `-03/-02`).
     *
     * @param startRule Current DST-start rule with savings, if any
     * @returns Numeric abbreviation string for `f`
     */
    private formatPercentZ(startRule: Rule | null): string {
        const stdSeconds = offsetComponentsToSeconds(
            this.offsetHours,
            this.offsetMinutes,
            this.offsetSeconds
        );
        const stdAbbrev = abbroffset(stdSeconds);
        if (startRule !== null && startRule.hasSavings()) {
            // Preserve negative SAVE (e.g. Ireland `-1:00`); treat the
            // constructor "unset" sentinel (-1 on minutes/seconds only when
            // that component was omitted) as zero for that component.
            const saveHours = startRule.saveHours;
            const saveMinutes =
                startRule.saveMinutes === -1 ? 0 : startRule.saveMinutes;
            const saveSecondsComp =
                startRule.saveSeconds === -1 ? 0 : startRule.saveSeconds;
            const saveSeconds = offsetComponentsToSeconds(
                saveHours,
                saveMinutes,
                saveSecondsComp
            );
            return stdAbbrev + "/" + abbroffset(stdSeconds + saveSeconds);
        }
        return stdAbbrev;
    }
}

/**
 * Convert signed hours plus unsigned minutes/seconds to total seconds.
 */
function offsetComponentsToSeconds(
    hours: number,
    minutes: number,
    seconds: number
): number {
    const h = hours || 0;
    const m = minutes > 0 ? minutes : 0;
    const s = seconds > 0 ? seconds : 0;
    const sign = h < 0 ? -1 : 1;
    return sign * (Math.abs(h) * 3600 + m * 60 + s);
}

/**
 * Port of zic.c `abbroffset`: format a UT offset as a numeric abbreviation.
 *
 * @param offsetSeconds Offset east of UT in seconds
 * @returns Abbreviation such as `-03`, `+0530`, or `+0545`
 */
function abbroffset(offsetSeconds: number): string {
    const sign = offsetSeconds < 0 ? "-" : "+";
    let abs = Math.abs(offsetSeconds);
    const hours = Math.floor(abs / 3600);
    abs -= hours * 3600;
    const minutes = Math.floor(abs / 60);
    const seconds = abs - minutes * 60;
    let out =
        sign +
        String(Math.floor(hours / 10)) +
        String(hours % 10);
    if (minutes !== 0 || seconds !== 0) {
        out +=
            String(Math.floor(minutes / 10)) + String(minutes % 10);
        if (seconds !== 0) {
            out +=
                String(Math.floor(seconds / 10)) + String(seconds % 10);
        }
    }
    return out;
}
