/*
 * Rule.ts - models a particular time-change rule from tzdata
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

/**
 * Models a particular time change rule (for example, start or end of DST).
 */
export class Rule {
    /**
     * Name of the {@link RuleSet} this rule belongs to.
     */
    ruleSetName: string | null = null;

    /**
     * First year this rule applies. `Number.MIN_SAFE_INTEGER` means `min`
     * in tzdata; `-1` means unset.
     */
    startYear = -1;

    /**
     * Last year this rule applies. `Number.MAX_SAFE_INTEGER` means `max`;
     * equal to {@link startYear} when the line said `only`; `-1` means unset.
     */
    endYear = -1;

    /**
     * Optional rule type letter from tzdata, or `null` when `-`.
     */
    type: string | null = null;

    /**
     * When within the year the transition occurs.
     */
    transitionTime: RelativeDate | null = null;

    /**
     * DST savings hours to apply after the transition (`-1` if unset).
     */
    saveHours = -1;

    /**
     * DST savings minutes to apply after the transition (`-1` if unset).
     */
    saveMinutes = -1;

    /**
     * DST savings seconds to apply after the transition (`-1` if unset).
     */
    saveSeconds = -1;

    /**
     * Abbreviation character substituted for `%s` in zone formats
     * (for example `"D"` or `"S"`).
     */
    character: string | null = null;

    /**
     * Create an empty rule, or parse a `Rule` line from tzdata.
     *
     * @param line Full `Rule …` line; omit for an empty rule
     * @throws {ParseException} If `line` does not have enough fields
     */
    constructor(line?: string) {
        if (line === undefined) {
            return;
        }

        const fields = line.split(/[ \t]+/);

        if (fields.length < 10) {
            throw new ParseException(
                "Bad rule definition. Not enough fields (" +
                    fields.length +
                    ") in " +
                    line
            );
        }

        this.ruleSetName = fields[1];
        if (fields[2].toLowerCase() === "min") {
            this.startYear = Number.MIN_SAFE_INTEGER;
        } else {
            this.startYear = parseInt(fields[2], 10);
        }
        if (fields[3].toLowerCase() === "only") {
            this.endYear = this.startYear;
        } else if (fields[3].toLowerCase() === "max") {
            this.endYear = Number.MAX_SAFE_INTEGER;
        } else {
            this.endYear = parseInt(fields[3], 10);
        }
        if (fields[4] !== "-") {
            this.type = fields[4];
        }

        this.transitionTime = new RelativeDate();
        this.transitionTime.parse(fields, 4);

        if (fields[8].length > 0) {
            // IANA SAVE of `-` means zero savings (not "unset")
            if (fields[8].trim() === "-") {
                this.saveHours = 0;
                this.saveMinutes = 0;
                this.saveSeconds = 0;
            } else {
                const parts = fields[8].trim().split(":");
                if (parts.length > 0) {
                    this.saveHours = parseInt(parts[0], 10);
                    if (parts.length > 1) {
                        this.saveMinutes = parseInt(parts[1], 10);
                        if (parts.length > 2) {
                            this.saveSeconds = parseInt(parts[2], 10);
                        }
                    }
                }
            }
        }

        this.character = fields[9];
    }

    /**
     * @returns `true` if this rule applies a non-zero DST savings (positive
     *     or negative; e.g. Europe/Dublin winter SAVE of `-1:00`)
     */
    hasSavings(): boolean {
        // Constructor defaults leave all three at -1 ("unset"). After a
        // successful parse of `-1:00`, saveHours is -1 with saveMinutes 0 —
        // that is a real negative one-hour SAVE, not unset.
        if (
            this.saveHours === -1 &&
            this.saveMinutes === -1 &&
            this.saveSeconds === -1
        ) {
            return false;
        }
        const hours = !Number.isFinite(this.saveHours) ? 0 : this.saveHours;
        const minutes =
            this.saveMinutes === -1 || !Number.isFinite(this.saveMinutes)
                ? 0
                : this.saveMinutes;
        const seconds =
            this.saveSeconds === -1 || !Number.isFinite(this.saveSeconds)
                ? 0
                : this.saveSeconds;
        return hours !== 0 || minutes !== 0 || seconds !== 0;
    }

    /**
     * Compare by end year. `MIN` sorts first; `MAX` sorts last.
     *
     * @param other Rule to compare against
     * @returns Negative if this ends earlier, positive if later, else `0`
     */
    compareTo(other: Rule): number {
        if (this.endYear === Number.MIN_SAFE_INTEGER) {
            return other.endYear === Number.MIN_SAFE_INTEGER ? 0 : -1;
        } else if (other.endYear === Number.MIN_SAFE_INTEGER) {
            return 1;
        }
        if (this.endYear === Number.MAX_SAFE_INTEGER) {
            return other.endYear === Number.MAX_SAFE_INTEGER ? 0 : 1;
        } else if (other.endYear === Number.MAX_SAFE_INTEGER) {
            return -1;
        }
        return this.endYear - other.endYear;
    }

    /**
     * Serialize this rule to the compact JSON shape used in zoneinfo.
     *
     * @param currentOnly When true, omit start/end year fields
     * @returns JSON object for embedding under a zone's `s` / `e` keys
     */
    getJson(currentOnly: boolean): Record<string, unknown> {
        const json: Record<string, unknown> = {};

        if (!currentOnly) {
            json.s = this.startYear;
            json.e = this.endYear;
        }
        if (this.type !== null && this.type !== "-") {
            json.p = this.type;
        }

        if (this.transitionTime) {
            this.transitionTime.addJson(json);
        }

        // zero savings is implied by omitting "v"; include negative SAVE
        // (e.g. Ireland `-1:00`) so consumers see the real offset delta
        if (this.hasSavings()) {
            const hours = this.saveHours;
            const minutes = this.saveMinutes === -1 ? 0 : this.saveMinutes;
            let save = String(hours) + ":" + String(minutes);
            if (this.saveSeconds !== -1 && this.saveSeconds !== 0) {
                save +=
                    ":" +
                    (this.saveSeconds < 10
                        ? "0" + this.saveSeconds
                        : String(this.saveSeconds));
            }
            json.v = save;
        }
        if (this.character !== null && this.character !== "-") {
            json.c = this.character;
        }
        return json;
    }

    /**
     * @returns A deep copy of this rule (including transition time)
     */
    clone(): Rule {
        const ret = new Rule();
        ret.character = this.character;
        ret.endYear = this.endYear;
        ret.ruleSetName = this.ruleSetName;
        ret.saveHours = this.saveHours;
        ret.saveMinutes = this.saveMinutes;
        ret.saveSeconds = this.saveSeconds;
        ret.startYear = this.startYear;
        ret.transitionTime = this.transitionTime
            ? this.transitionTime.clone()
            : null;
        ret.type = this.type;
        return ret;
    }
}
