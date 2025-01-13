/*
 * datepromise.test.js - test the date object asynchronously
 *
 * Copyright © 2018, 2022, 2024 JEDLSoft
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

import GregorianDate from "../src/GregorianDate.js";
import DateFmt from "../src/DateFmt.js";
import DateFactory, {DateFactoryAsync} from "../src/DateFactory.js";

describe("testdatepromise", () => {
    test("DateConstructor", () => {
        expect.assertions(1);
        return DateFactoryAsync().then(gd => {
            expect(gd !== null).toBeTruthy();
        });
    });

    test("DateConstructorFull", () => {
        expect.assertions(8);
        return DateFactoryAsync({
            year: 2011,
            month: 9,
            day: 23,
            hour: 16,
            minute: 7,
            second: 12,
            millisecond: 123
        }).then(gd => {
            expect(gd !== null).toBeTruthy();

            expect(gd.getYears()).toBe(2011);
            expect(gd.getMonths()).toBe(9);
            expect(gd.getDays()).toBe(23);
            expect(gd.getHours()).toBe(16);
            expect(gd.getMinutes()).toBe(7);
            expect(gd.getSeconds()).toBe(12);
            expect(gd.getMilliseconds()).toBe(123);
        });
    });

    test("DateFactoryRightType", () => {
        expect.assertions(2);
        return DateFactoryAsync({
            type: "gregorian"
        }).then(gd => {
            expect(gd !== null).toBeTruthy();
            expect(gd.getCalendar()).toBe("gregorian");
        });
    });

    test("DateFactoryNonGregorian", () => {
        expect.assertions(2);
        return DateFactoryAsync({
            type: "hebrew"
        }).then(hd => {
            expect(hd !== null).toBeTruthy();
            expect(hd.getCalendar()).toBe("hebrew");
        });
    });

    test("DateFactoryNonGregorianWithCalendar", () => {
        expect.assertions(2);
        return DateFactoryAsync({
            calendar: "hebrew"
        }).then(hd => {
            expect(hd !== null).toBeTruthy();
            expect(hd.getCalendar()).toBe("hebrew");
        });
    });

    test("DateFactoryBogus", () => {
        expect.assertions(1);
        return DateFactoryAsync({
            type: "asdf"
        }).then(gd => {
            expect(typeof(gd) === "undefined").toBeTruthy();
        });
    });

    test("DateToIlibDate", () => {
        expect.assertions(1);
        const datMyBday = new Date("Fri Aug 13 1982 13:37:35 GMT-0700");
        return DateFactoryAsync({
            year: 1982,
            month: 8,
            day: 13,
            hour: 13,
            minute: 37,
            second: 35,
            timezone: "America/Los_Angeles"
        }).then(ildMyBday => {
            return DateFmt.create({
                length: "full",
                sync: false
            }).then(fmt => {
                expect(fmt.format(DateFactory._dateToIlib(datMyBday))).toBe(fmt.format(ildMyBday));
            });
        });
    });

    test("DstStartBoundary_Azores", () => {
        expect.assertions(1);
        return DateFactoryAsync({
            year: 2019,
            month: 3,
            day: 31,
            hour: 0,
            minute: 0,
            second: 0,
            timezone: "Atlantic/Azores"
        }).then(boundaryiLib => {
            // we can't set time zone to Date object, so compare with constant value
            // 1553994000000: new Date(2019, 2, 31, 0, 0, 0).getTime() with Azores local time
            expect(boundaryiLib.getTimeExtended()).toBe(1553994000000);
        });
    });

    test("DstEndBoundary_Azores", () => {
        expect.assertions(1);
        return DateFactoryAsync({
            year: 2019,
            month: 10,
            day: 27,
            hour: 1,
            minute: 0,
            second: 0,
            timezone: "Atlantic/Azores"
        }).then(boundaryiLib => {
            // we can't set time zone to Date object, so compare with constant value
            // 1572141600000: new Date(2019, 9, 27, 1, 0, 0).getTime() with Azores local time
            expect(boundaryiLib.getTimeExtended()).toBe(1572141600000);
        });
    });
});
