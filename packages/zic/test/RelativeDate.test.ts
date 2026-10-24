/*
 * RelativeDate.test.ts - unit tests for RelativeDate
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

import { ParseException } from "../src/ParseException";
import { RelativeDate, StartRule } from "../src/RelativeDate";

function expectEmptyDefaults(rd: RelativeDate): void {
    expect(rd.year).toBe(-1);
    expect(rd.month).toBe(-1);
    expect(rd.dayOfMonth).toBe(-1);
    expect(rd.dayOfWeek).toBe(-1);
    expect(rd.hour).toBe(-1);
    expect(rd.minute).toBe(-1);
    expect(rd.second).toBe(-1);
    expect(rd.zoneChar).toBe("w");
    expect(rd.rule).toBe(StartRule.EQUAL);
}

describe("RelativeDate", () => {
    test("constructor", () => {
        expect.assertions(1);
        expect(new RelativeDate()).toBeDefined();
    });

    test("parse year", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920"], 0);
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

    test("parse nothing", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse([], 0);
        expectEmptyDefaults(rd);
    });

    test("parse empty", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["", "", "", ""], 0);
        expectEmptyDefaults(rd);
    });

    test("parse year month", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb"], 0);
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

    test("parse year month day", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "20"], 0);
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

    test("parse year month day time short", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "20", "2:00"], 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(20);
        expect(rd.dayOfWeek).toBe(-1);
        expect(rd.hour).toBe(2);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.EQUAL);
    });

    test("parse year month day time empty", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "20", ""], 0);
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

    test("parse year month day time long", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "20", "2:00:23"], 0);
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

    test("parse year month day time long UTC", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "20", "2:00:23u"], 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(20);
        expect(rd.dayOfWeek).toBe(-1);
        expect(rd.hour).toBe(2);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(23);
        expect(rd.zoneChar).toBe("u");
        expect(rd.rule).toBe(StartRule.EQUAL);
    });

    test("parse last weekday", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "lastWed"], 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(-1);
        expect(rd.dayOfWeek).toBe(3);
        expect(rd.hour).toBe(-1);
        expect(rd.minute).toBe(-1);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.LAST);
    });

    test("parse first weekday", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "firstThu"], 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(-1);
        expect(rd.dayOfWeek).toBe(4);
        expect(rd.hour).toBe(-1);
        expect(rd.minute).toBe(-1);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.FIRST);
    });

    test("parse greater", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "Thu>=8"], 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(8);
        expect(rd.dayOfWeek).toBe(4);
        expect(rd.hour).toBe(-1);
        expect(rd.minute).toBe(-1);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.GREATER);
    });

    test("parse less", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "Thu<=8"], 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(8);
        expect(rd.dayOfWeek).toBe(4);
        expect(rd.hour).toBe(-1);
        expect(rd.minute).toBe(-1);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.LESS);
    });

    test("parse no year month day time long", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["", "Feb", "20", "2:00:23"], 0);
        expect(rd.year).toBe(-1);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(20);
        expect(rd.dayOfWeek).toBe(-1);
        expect(rd.hour).toBe(2);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(23);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.EQUAL);
    });

    test("parse greater no year", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["", "Feb", "Thu>=8"], 0);
        expect(rd.year).toBe(-1);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(8);
        expect(rd.dayOfWeek).toBe(4);
        expect(rd.hour).toBe(-1);
        expect(rd.minute).toBe(-1);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.GREATER);
    });

    test("compare less/greater/equal year month day hour minute second", () => {
        expect.assertions(14);
        const make = (
            y: number,
            m: number,
            d: number,
            h: number,
            mi: number,
            s: number
        ) => {
            const rd = new RelativeDate();
            rd.year = y;
            rd.month = m;
            rd.dayOfMonth = d;
            rd.hour = h;
            rd.minute = mi;
            rd.second = s;
            return rd;
        };
        const base = make(1968, 7, 23, 8, 30, 10);
        expect(base.compareTo(make(1969, 7, 23, 8, 30, 10))).toBeLessThan(0);
        expect(make(1969, 7, 23, 8, 30, 10).compareTo(base)).toBeGreaterThan(0);
        expect(base.compareTo(make(1968, 8, 23, 8, 30, 10))).toBeLessThan(0);
        expect(make(1968, 8, 23, 8, 30, 10).compareTo(base)).toBeGreaterThan(0);
        expect(base.compareTo(make(1968, 7, 24, 8, 30, 10))).toBeLessThan(0);
        expect(make(1968, 7, 24, 8, 30, 10).compareTo(base)).toBeGreaterThan(0);
        expect(base.compareTo(make(1968, 7, 23, 9, 30, 10))).toBeLessThan(0);
        expect(make(1968, 7, 23, 9, 30, 10).compareTo(base)).toBeGreaterThan(0);
        expect(base.compareTo(make(1968, 7, 23, 8, 31, 10))).toBeLessThan(0);
        expect(make(1968, 7, 23, 8, 31, 10).compareTo(base)).toBeGreaterThan(0);
        expect(base.compareTo(make(1968, 7, 23, 8, 30, 11))).toBeLessThan(0);
        expect(make(1968, 7, 23, 8, 30, 11).compareTo(base)).toBeGreaterThan(0);
        expect(base.compareTo(make(1968, 7, 23, 8, 30, 10))).toBe(0);
        expect(make(1968, 7, 23, 8, 30, 10).compareTo(base)).toBe(0);
    });

    test("compare with empty", () => {
        expect.assertions(4);
        const rd1 = new RelativeDate();
        rd1.year = 1968;
        rd1.month = 7;
        rd1.dayOfMonth = 23;
        rd1.hour = 8;
        rd1.minute = 30;
        rd1.second = 10;
        const rd2 = new RelativeDate();
        expect(rd2.compareTo(rd1)).toBeGreaterThan(0);
        expect(rd1.compareTo(rd2)).toBeLessThan(0);
        const empty1 = new RelativeDate();
        const empty2 = new RelativeDate();
        expect(empty2.compareTo(empty1)).toBe(0);
        expect(empty1.compareTo(empty2)).toBe(0);
    });

    test("clone", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "20", "2:00:23u"], 0);
        const newrd = rd.clone();
        expect(newrd.year).toBe(1920);
        expect(newrd.month).toBe(1);
        expect(newrd.dayOfMonth).toBe(20);
        expect(newrd.dayOfWeek).toBe(-1);
        expect(newrd.hour).toBe(2);
        expect(newrd.minute).toBe(0);
        expect(newrd.second).toBe(23);
        expect(newrd.zoneChar).toBe("u");
        expect(newrd.rule).toBe(StartRule.EQUAL);
    });

    test("clone with rule", () => {
        expect.assertions(9);
        const oldrd = new RelativeDate();
        oldrd.parse(["1920", "Feb", "Thu<=8"], 0);
        const rd = oldrd.clone();
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(8);
        expect(rd.dayOfWeek).toBe(4);
        expect(rd.hour).toBe(-1);
        expect(rd.minute).toBe(-1);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.LESS);
    });

    test("offsetToWallTime hours only", () => {
        expect.assertions(18);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "20", "20:00:23u"], 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(20);
        expect(rd.dayOfWeek).toBe(-1);
        expect(rd.hour).toBe(20);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(23);
        expect(rd.zoneChar).toBe("u");
        expect(rd.rule).toBe(StartRule.EQUAL);

        rd.offsetToWallTime(2, 0, 0, 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(20);
        expect(rd.dayOfWeek).toBe(-1);
        expect(rd.hour).toBe(22);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(23);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.EQUAL);
    });

    test("offsetToWallTime hours and minutes", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "20", "20:00:00u"], 0);
        rd.offsetToWallTime(2, 15, 0, 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(20);
        expect(rd.dayOfWeek).toBe(-1);
        expect(rd.hour).toBe(22);
        expect(rd.minute).toBe(15);
        expect(rd.second).toBe(0);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.EQUAL);
    });

    test("offsetToWallTime next day", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "20", "20:00:00u"], 0);
        rd.offsetToWallTime(8, 0, 0, 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(21);
        expect(rd.dayOfWeek).toBe(-1);
        expect(rd.hour).toBe(4);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(0);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.EQUAL);
    });

    test("offsetToWallTime next month", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1921", "Feb", "28", "20:00:00u"], 0);
        rd.offsetToWallTime(8, 0, 0, 0);
        expect(rd.year).toBe(1921);
        expect(rd.month).toBe(2);
        expect(rd.dayOfMonth).toBe(1);
        expect(rd.dayOfWeek).toBe(-1);
        expect(rd.hour).toBe(4);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(0);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.EQUAL);
    });

    test("offsetToWallTime next year", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1921", "Dec", "31", "20:00:00u"], 0);
        rd.offsetToWallTime(8, 0, 0, 0);
        expect(rd.year).toBe(1922);
        expect(rd.month).toBe(0);
        expect(rd.dayOfMonth).toBe(1);
        expect(rd.dayOfWeek).toBe(-1);
        expect(rd.hour).toBe(4);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(0);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.EQUAL);
    });

    test("offsetToWallTime last rule", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "lastWed"], 0);
        rd.offsetToWallTime(8, 0, 0, 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(-1);
        expect(rd.dayOfWeek).toBe(3);
        expect(rd.hour).toBe(-1);
        expect(rd.minute).toBe(-1);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.LAST);
    });

    test("offsetToWallTime last rule with bogus zonechar", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "lastWed"], 0);
        rd.zoneChar = "u";
        rd.offsetToWallTime(8, 0, 0, 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(-1);
        expect(rd.dayOfWeek).toBe(3);
        expect(rd.hour).toBe(-1);
        expect(rd.minute).toBe(-1);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.LAST);
    });

    test("offsetToWallTime last rule with UTC zonechar", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "lastWed", "2:00u"], 0);
        rd.offsetToWallTime(1, 0, 0, 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(-1);
        expect(rd.dayOfWeek).toBe(3);
        expect(rd.hour).toBe(3);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.LAST);
    });

    test("offsetToWallTime last rule with UTC zonechar prev day", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "lastWed", "2:00u"], 0);
        rd.offsetToWallTime(-4, 0, 0, 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(-1);
        expect(rd.dayOfWeek).toBe(2);
        expect(rd.hour).toBe(22);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.LAST);
    });

    test("offsetToWallTime last rule UTC wrap down", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "lastSun", "2:00u"], 0);
        rd.offsetToWallTime(-4, 0, 0, 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(-1);
        expect(rd.dayOfWeek).toBe(6);
        expect(rd.hour).toBe(22);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.LAST);
    });

    test("offsetToWallTime last rule UTC wrap up", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["1920", "Feb", "lastSat", "22:00u"], 0);
        rd.offsetToWallTime(4, 0, 0, 0);
        expect(rd.year).toBe(1920);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(-1);
        expect(rd.dayOfWeek).toBe(0);
        expect(rd.hour).toBe(2);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.LAST);
    });

    test("offsetToWallTime relative rule", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["", "Feb", "Thu>=8"], 0);
        rd.offsetToWallTime(8, 0, 0, 0);
        expect(rd.year).toBe(-1);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(8);
        expect(rd.dayOfWeek).toBe(4);
        expect(rd.hour).toBe(-1);
        expect(rd.minute).toBe(-1);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.GREATER);
    });

    test("offsetToWallTime relative rule with standard zone char", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["", "Feb", "Thu>=8", "1:00s"], 0);
        rd.offsetToWallTime(8, 0, 1, 0);
        expect(rd.year).toBe(-1);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(8);
        expect(rd.dayOfWeek).toBe(4);
        expect(rd.hour).toBe(2);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.GREATER);
    });

    test("offsetToWallTime relative rule with UTC zone char", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["", "Feb", "Thu>=8", "1:00u"], 0);
        rd.offsetToWallTime(1, 0, 0, 0);
        expect(rd.year).toBe(-1);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(8);
        expect(rd.dayOfWeek).toBe(4);
        expect(rd.hour).toBe(2);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.GREATER);
    });

    test("offsetToWallTime relative rule with UTC zone char prev day", () => {
        expect.assertions(9);
        const rd = new RelativeDate();
        rd.parse(["", "Feb", "Thu>=8", "2:00u"], 0);
        rd.offsetToWallTime(-8, 0, 0, 0);
        expect(rd.year).toBe(-1);
        expect(rd.month).toBe(1);
        expect(rd.dayOfMonth).toBe(7);
        expect(rd.dayOfWeek).toBe(4);
        expect(rd.hour).toBe(18);
        expect(rd.minute).toBe(0);
        expect(rd.second).toBe(-1);
        expect(rd.zoneChar).toBe("w");
        expect(rd.rule).toBe(StartRule.GREATER);
    });

    test("parse throws ParseException on unrecognized month", () => {
        expect.assertions(2);
        const rd = new RelativeDate();
        expect(() => rd.parse(["1920", "Foo"], 0)).toThrow(ParseException);
        expect(() => rd.parse(["1920", "Foo"], 0)).toThrow(
            /Unrecognized month token "Foo"/
        );
    });

    test("parse throws ParseException on unrecognized weekday", () => {
        expect.assertions(2);
        const rd = new RelativeDate();
        expect(() => rd.parse(["1920", "Feb", "lastXxx"], 0)).toThrow(
            ParseException
        );
        expect(() => rd.parse(["1920", "Feb", "lastXxx"], 0)).toThrow(
            /Unrecognized weekday token "Xxx"/
        );
    });
});
