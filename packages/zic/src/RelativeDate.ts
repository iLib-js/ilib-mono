/*
 * RelativeDate.ts - models a relative date specification from tzdata
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

import { isDigit } from "ilib-ctype";

import { ParseException } from "./ParseException";

/**
 * How a day-of-week rule locates a calendar day within a month.
 */
export enum StartRule {
    /** First occurrence of the given weekday in the month. */
    FIRST = "f",
    /** Last occurrence of the given weekday in the month. */
    LAST = "l",
    /** First weekday on or after a given day of month. */
    GREATER = ">",
    /** First weekday on or before a given day of month. */
    LESS = "<",
    /** Exact calendar day of the month (no weekday rule). */
    EQUAL = "=",
}

/**
 * Abbreviated English month name → zero-based month index.
 */
const months: Record<string, number> = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
};

/**
 * Abbreviated English weekday name → day-of-week index (Sunday = 0).
 */
const weekDays: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
};

/**
 * Models a relative date as used in IANA tzdata Rule and Zone lines.
 *
 * Supported forms:
 * - first DOW of the month
 * - last DOW of the month
 * - first DOW on or after a given date
 * - first DOW on or before a given date
 * - a specific day of the month
 */
export class RelativeDate {
    /**
     * How {@link dayOfWeek} relates to {@link dayOfMonth} within the month.
     */
    rule: StartRule = StartRule.EQUAL;

    /**
     * Calendar year, or `-1` if not specified.
     */
    year = -1;

    /**
     * Zero-based month (January = 0), or `-1` if not specified.
     */
    month = -1;

    /**
     * Day of week (Sunday = 0), or `-1` if not specified.
     */
    dayOfWeek = -1;

    /**
     * Day of month (1–31), or `-1` if not specified.
     */
    dayOfMonth = -1;

    /**
     * Hour of day, or `-1` if not specified.
     */
    hour = -1;

    /**
     * Minute of hour, or `-1` if not specified.
     */
    minute = -1;

    /**
     * Second of minute, or `-1` if not specified.
     */
    second = -1;

    /**
     * Time-of-day basis from tzdata: `w` wall, `s` standard, or `u` UTC.
     */
    zoneChar = "w";

    /**
     * Create a relative date, optionally seeding rule and day fields.
     *
     * @param rule How the weekday relates to the day of month
     * @param dayOfWeek Weekday index (Sunday = 0)
     * @param dayOfMonth Day of month (1–31)
     * @param month Zero-based month index
     */
    constructor(
        rule?: StartRule,
        dayOfWeek?: number,
        dayOfMonth?: number,
        month?: number
    ) {
        if (rule !== undefined) {
            this.rule = rule;
        }
        if (dayOfWeek !== undefined) {
            this.dayOfWeek = dayOfWeek;
        }
        if (dayOfMonth !== undefined) {
            this.dayOfMonth = dayOfMonth;
        }
        if (month !== undefined) {
            this.month = month;
        }
    }

    /**
     * Parse relative-date fields from a split tzdata line.
     *
     * @param fields Tokenized line fields
     * @param startIndex Index of the optional year field
     * @throws {ParseException} If a month or weekday token is unrecognized
     */
    parse(fields: string[], startIndex: number): void {
        if (fields.length <= startIndex) {
            return;
        }

        if (
            fields[startIndex].length > 0 &&
            fields[startIndex] !== "-" &&
            isDigit(fields[startIndex].charAt(0))
        ) {
            this.year = parseInt(fields[startIndex], 10);
        }

        if (fields.length > startIndex + 1 && fields[startIndex + 1].length > 0) {
            const monthToken = fields[startIndex + 1];
            if (!(monthToken in months)) {
                throw new ParseException(
                    "Unrecognized month token \"" +
                        monthToken +
                        "\" in relative date"
                );
            }
            this.month = months[monthToken];

            if (fields.length > startIndex + 2) {
                const dayStr = fields[startIndex + 2];

                if (isDigit(dayStr.charAt(0))) {
                    this.dayOfMonth = parseInt(dayStr, 10);
                } else if (dayStr.startsWith("last")) {
                    this.rule = StartRule.LAST;
                    this.dayOfWeek = this.parseWeekDay(
                        dayStr.substring(4),
                        dayStr
                    );
                } else if (dayStr.startsWith("first")) {
                    this.rule = StartRule.FIRST;
                    this.dayOfWeek = this.parseWeekDay(
                        dayStr.substring(5),
                        dayStr
                    );
                } else {
                    this.dayOfWeek = this.parseWeekDay(
                        dayStr.substring(0, 3),
                        dayStr
                    );
                    if (dayStr.charAt(4) === "=") {
                        this.rule =
                            dayStr.charAt(3) === "<"
                                ? StartRule.LESS
                                : StartRule.GREATER;
                        this.dayOfMonth = parseInt(dayStr.substring(5), 10);
                    }
                }

                if (
                    fields.length > startIndex + 3 &&
                    fields[startIndex + 3].length > 0
                ) {
                    let time = fields[startIndex + 3];
                    if (time !== null && time.length > 0) {
                        const c = time.charAt(time.length - 1);
                        if (!isDigit(c)) {
                            switch (c) {
                                case "s":
                                case "S":
                                    this.zoneChar = "s";
                                    break;
                                case "u":
                                case "U":
                                case "g":
                                case "G":
                                case "z":
                                case "Z":
                                    this.zoneChar = "u";
                                    break;
                                case "w":
                                case "W":
                                default:
                                    this.zoneChar = "w";
                                    break;
                            }
                            time = time.substring(0, time.length - 1);
                        }
                        const timeParts = time.split(":");
                        if (timeParts.length > 0) {
                            this.hour = parseInt(timeParts[0], 10);
                            if (timeParts.length > 1) {
                                this.minute = parseInt(timeParts[1], 10);
                                if (timeParts.length > 2) {
                                    this.second = parseInt(timeParts[2], 10);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * Look up a weekday abbreviation (`Sun`…`Sat`) or throw.
     *
     * @param token Weekday abbreviation extracted from an ON field
     * @param dayStr Full ON field (for the error message)
     * @returns Zero-based weekday index (Sunday = 0)
     * @throws {ParseException} If `token` is not a known weekday
     */
    private parseWeekDay(token: string, dayStr: string): number {
        if (!(token in weekDays)) {
            throw new ParseException(
                "Unrecognized weekday token \"" +
                    token +
                    "\" in relative date ON field \"" +
                    dayStr +
                    "\""
            );
        }
        return weekDays[token];
    }

    /**
     * Convert a non-wall-time relative date to wall time.
     *
     * If the zone char is not `w`, the transition was given as standard
     * time (`s`) or UTC (`u`). ilib needs wall time for rule calculations.
     *
     * @param offsetHour Offset from UTC in hours
     * @param offsetMinute Offset from UTC in minutes
     * @param savingsHour DST savings in hours
     * @param savingsMinute DST savings in minutes
     */
    offsetToWallTime(
        offsetHour: number,
        offsetMinute: number,
        savingsHour: number,
        savingsMinute: number
    ): void {
        // Use a UTC Date and mutate via setUTC* so DST of the host never
        // interferes (matches Java GregorianCalendar with Etc/UTC).
        const date = new Date(
            Date.UTC(
                this.year === -1 ? 1970 : this.year,
                this.month === -1 ? 0 : this.month,
                this.dayOfMonth === -1 ? 1 : this.dayOfMonth,
                this.hour === -1 ? 0 : this.hour,
                this.minute === -1 ? 0 : this.minute,
                0
            )
        );

        switch (this.zoneChar) {
            case "u":
                date.setUTCHours(date.getUTCHours() + offsetHour);
                date.setUTCMinutes(date.getUTCMinutes() + offsetMinute);
                date.setUTCHours(date.getUTCHours() + savingsHour);
                date.setUTCMinutes(date.getUTCMinutes() + savingsMinute);
                break;
            case "s":
                date.setUTCHours(date.getUTCHours() + savingsHour);
                date.setUTCMinutes(date.getUTCMinutes() + savingsMinute);
                break;
        }

        if (this.year !== -1) {
            this.year = date.getUTCFullYear();
        }
        if (
            this.month !== -1 &&
            this.rule !== StartRule.FIRST &&
            this.rule !== StartRule.LAST
        ) {
            this.month = date.getUTCMonth();
        }
        if (
            this.dayOfWeek !== -1 &&
            (this.rule === StartRule.FIRST || this.rule === StartRule.LAST) &&
            1 !== date.getUTCDate() &&
            this.hour !== -1
        ) {
            // If the offset put us on the next or previous day, adjust
            // first/last rules to the adjacent day of week.
            this.dayOfWeek +=
                (offsetHour + savingsHour) * 60 + offsetMinute + savingsMinute >
                0
                    ? 1
                    : -1;
            this.dayOfWeek %= 7;
            if (this.dayOfWeek < 0) {
                this.dayOfWeek += 7;
            }
        }
        if (this.dayOfMonth !== -1) {
            this.dayOfMonth = date.getUTCDate();
        }
        if (this.hour !== -1) {
            this.hour = date.getUTCHours();
        }
        if (this.minute !== -1) {
            this.minute = date.getUTCMinutes();
        }

        this.zoneChar = "w";
    }

    /**
     * @returns A human-readable summary of this relative date
     */
    toString(): string {
        let sb = "";
        switch (this.rule) {
            case StartRule.LAST:
                sb += "last " + this.dayOfWeek;
                break;
            case StartRule.FIRST:
                sb += "first " + this.dayOfWeek;
                break;
            case StartRule.LESS:
                sb += this.dayOfWeek + "<=" + this.dayOfMonth;
                break;
            case StartRule.GREATER:
                sb += this.dayOfWeek + ">=" + this.dayOfMonth;
                break;
            case StartRule.EQUAL:
                if (this.dayOfMonth !== -1) {
                    sb += String(this.dayOfMonth);
                }
                break;
        }
        if (this.month !== -1) {
            sb += " " + this.month;
        }
        if (this.year !== -1) {
            sb += " " + this.year;
        }
        if (this.hour !== -1) {
            sb += " " + this.hour;
            if (this.minute !== -1) {
                sb += ":" + this.minute;
                if (this.second !== -1) {
                    sb += ":" + this.second;
                }
            } else {
                sb += ":00";
            }
        }
        return sb;
    }

    /**
     * Compare chronological order. Undated (year === -1) sorts after dated.
     *
     * @param other Relative date to compare against
     * @returns Negative if this is earlier, positive if later, else `0`
     */
    compareTo(other: RelativeDate): number {
        if (this.year === -1) {
            if (other.year !== -1) {
                return 1;
            }
        } else if (other.year === -1) {
            return -1;
        }

        let temp = this.year - other.year;
        if (temp !== 0) {
            return temp;
        }
        temp = this.month - other.month;
        if (temp !== 0) {
            return temp;
        }
        temp = this.dayOfMonth - other.dayOfMonth;
        if (temp !== 0) {
            return temp;
        }
        temp = this.hour - other.hour;
        if (temp !== 0) {
            return temp;
        }
        temp = this.minute - other.minute;
        if (temp !== 0) {
            return temp;
        }
        temp = this.second - other.second;
        if (temp !== 0) {
            return temp;
        }
        return 0;
    }

    /**
     * Add JSON properties describing this relative date onto `json`.
     *
     * Uses compact keys: `y`, `m` (1-based), `r`, `t`, and optional `z`.
     *
     * @param json Object to mutate
     * @returns The same `json` object for chaining
     */
    addJson(json: Record<string, unknown>): Record<string, unknown> {
        if (this.year !== -1) {
            json.y = this.year;
        }
        if (this.month !== -1) {
            // months in ilib/JS are 1-based
            json.m = this.month + 1;
        }

        let temp = "";
        switch (this.rule) {
            case StartRule.LESS:
            case StartRule.GREATER:
                temp =
                    String(this.dayOfWeek) +
                    this.rule +
                    String(this.dayOfMonth);
                break;
            case StartRule.FIRST:
            case StartRule.LAST:
                temp = this.rule + String(this.dayOfWeek);
                break;
            case StartRule.EQUAL:
                temp = String(this.dayOfMonth);
                break;
        }
        json.r = temp;

        if (this.hour !== -1) {
            let time = String(this.hour);
            if (this.minute !== -1) {
                time += ":" + this.minute;
                if (this.second !== -1) {
                    time += ":" + this.second;
                }
            }
            json.t = time;
        }
        if (this.zoneChar !== "w") {
            json.z = this.zoneChar;
        }
        return json;
    }

    /**
     * @returns A shallow field-wise copy of this relative date
     */
    clone(): RelativeDate {
        const ret = new RelativeDate();
        ret.dayOfMonth = this.dayOfMonth;
        ret.dayOfWeek = this.dayOfWeek;
        ret.hour = this.hour;
        ret.minute = this.minute;
        ret.month = this.month;
        ret.rule = this.rule;
        ret.second = this.second;
        ret.year = this.year;
        ret.zoneChar = this.zoneChar;
        return ret;
    }
}
