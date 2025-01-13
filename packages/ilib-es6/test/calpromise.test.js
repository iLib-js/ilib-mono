/*
 * calpromise.test.js - test the calendar objects asynchronously with promises
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

import CalendarFactory, {CalendarFactoryAsync} from "../src/CalendarFactory.js";
import CopticDate from "../src/CopticDate.js";
import EthiopicDate from "../src/EthiopicDate.js";
import GregorianDate from "../src/GregorianDate.js";
import HanDate from "../src/HanDate.js";
import HebrewDate from "../src/HebrewDate.js";
import IslamicDate from "../src/IslamicDate.js";
import JulianDate from "../src/JulianDate.js";
import PersianAlgoDate from "../src/PersianAlgoDate.js";
import PersianDate from "../src/PersianDate.js";
import ThaiSolarDate from "../src/ThaiSolarDate.js";

describe("testcalpromise", () => {
    test("CalendarPromiseFactoryAsyncDefault", () => {
        expect.assertions(1);
        return CalendarFactoryAsync().then(cal => {
            expect(typeof(cal) !== "undefined").toBeTruthy();
        });
    });

    test("CalendarPromiseFactoryAsyncSpecific", () => {
        expect.assertions(2);
        return CalendarFactoryAsync({
            type: "julian"
        }).then(cal => {
            expect(typeof(cal) !== "undefined").toBeTruthy();

            expect(cal.getType()).toBe("julian");
        });
    });

    test("CalendarPromiseFactoryAsyncUnknown", () => {
        expect.assertions(1);
        return CalendarFactoryAsync({
            type: "asdf"
        }).then(cal => {
            expect(typeof(cal) === "undefined").toBeTruthy();
        }).catch(e => {
            test.fail();
            console.log("caught: " + e);
        });
    });

    test("CalendarPromiseFactoryAsyncDefaultForLocale", () => {
        expect.assertions(2);
        return CalendarFactoryAsync({
            locale: "fa-IR"
        }).then(cal => {
            expect(typeof(cal) !== "undefined").toBeTruthy();

            expect(cal.getType()).toBe("persian");
        });
    });

    test("CalendarPromiseFactoryAsyncDefaultForLocaleOther", () => {
        expect.assertions(2);
        return CalendarFactoryAsync({
            locale: "th-TH"
        }).then(cal => {
            expect(typeof(cal) !== "undefined").toBeTruthy();

            expect(cal.getType()).toBe("thaisolar");
        });
    });

    test("CalendarPromiseFactoryAsyncOverrideLocale", () => {
        expect.assertions(2);
        return CalendarFactoryAsync({
            locale: "fa-IR",
            type: "gregorian"
        }).then(cal => {
            expect(typeof(cal) !== "undefined").toBeTruthy();

            expect(cal.getType()).toBe("gregorian");
        });
    });

    test("CopticDatePromiseConstructorFull", () => {
        expect.assertions(8);
        try {
            return CopticDate.create({
                year: 1735,
                month: 9,
                day: 23,
                hour: 16,
                minute: 7,
                second: 12,
                millisecond: 123,
                timezone: "Etc/UTC",
                sync: false
            }).then(cd => {
                expect(cd !== null).toBeTruthy();

                expect(cd.getYears()).toBe(1735);
                expect(cd.getMonths()).toBe(9);
                expect(cd.getDays()).toBe(23);
                expect(cd.getHours()).toBe(16);
                expect(cd.getMinutes()).toBe(7);
                expect(cd.getSeconds()).toBe(12);
                expect(cd.getMilliseconds()).toBe(123);
            }).catch(err => {
                console.log("Error: " + err);
                test.fail();
            });
        } catch (e) {
            console.log("Got exception: " + e);
        }
    });

    test("EthiopicDatePromiseConstructorFull", () => {
        expect.assertions(8);
        return EthiopicDate.create({
            year: 2011,
            month: 9,
            day: 23,
            hour: 16,
            minute: 7,
            second: 12,
            millisecond: 123,
            timezone: "Etc/UTC",
            sync: false
        }).then(ed => {
            expect(ed !== null).toBeTruthy();

            expect(ed.getYears()).toBe(2011);
            expect(ed.getMonths()).toBe(9);
            expect(ed.getDays()).toBe(23);
            expect(ed.getHours()).toBe(16);
            expect(ed.getMinutes()).toBe(7);
            expect(ed.getSeconds()).toBe(12);
            expect(ed.getMilliseconds()).toBe(123);
        });
    });

    test("GregDatePromiseConstructorFull", () => {
        expect.assertions(8);
        return GregorianDate.create({
            year: 2011,
            month: 9,
            day: 23,
            hour: 16,
            minute: 7,
            second: 12,
            millisecond: 123,
            sync: false
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

    test("HanDatePromiseConstructorFull", () => {
        expect.assertions(10);
        return HanDate.create({
            year: 4711,
            month: 9,
            day: 23,
            hour: 16,
            minute: 7,
            second: 12,
            millisecond: 123,
            timezone: "Etc/UTC",
            sync: false
        }).then(hd => {
            expect(hd !== null).toBeTruthy();

            expect(hd.getYears()).toBe(4711);
            expect(hd.getMonths()).toBe(9);
            expect(hd.getDays()).toBe(23);
            expect(hd.getHours()).toBe(16);
            expect(hd.getMinutes()).toBe(7);
            expect(hd.getSeconds()).toBe(12);
            expect(hd.getMilliseconds()).toBe(123);
            expect(hd.getCycles()).toBe(78);
            expect(hd.getCycleYears()).toBe(31);
        });

    });

    test("HebrewDatePromiseConstructorFull", () => {
        expect.assertions(8);
        return HebrewDate.create({
            year: 2011,
            month: 9,
            day: 23,
            hour: 16,
            minute: 7,
            second: 12,
            millisecond: 123,
            timezone: "Etc/UTC",
            sync: false
        }).then(hd => {
            expect(hd !== null).toBeTruthy();

            expect(hd.getYears()).toBe(2011);
            expect(hd.getMonths()).toBe(9);
            expect(hd.getDays()).toBe(23);
            expect(hd.getHours()).toBe(16);
            expect(hd.getMinutes()).toBe(7);
            expect(hd.getSeconds()).toBe(12);
            expect(hd.getMilliseconds()).toBe(123);
        });

    });

    test("IslamicDatePromiseConstructorFull", () => {
        expect.assertions(8);
        return IslamicDate.create({
            year: 2011,
            month: 9,
            day: 23,
            hour: 16,
            minute: 7,
            second: 12,
            millisecond: 123,
            timezone: "Etc/UTC",
            sync: false
        }).then(id => {
            expect(id !== null).toBeTruthy();

            expect(id.getYears()).toBe(2011);
            expect(id.getMonths()).toBe(9);
            expect(id.getDays()).toBe(23);
            expect(id.getHours()).toBe(16);
            expect(id.getMinutes()).toBe(7);
            expect(id.getSeconds()).toBe(12);
            expect(id.getMilliseconds()).toBe(123);
        });

    });

    test("JulDatePromiseConstructorFull", () => {
        expect.assertions(8);
        return JulianDate.create({
            year: 2011,
            month: 9,
            day: 23,
            hour: 16,
            minute: 7,
            second: 12,
            millisecond: 123,
            timezone: "Etc/UTC",
            sync: false
        }).then(jul => {
            expect(jul !== null).toBeTruthy();

            expect(jul.getYears()).toBe(2011);
            expect(jul.getMonths()).toBe(9);
            expect(jul.getDays()).toBe(23);
            expect(jul.getHours()).toBe(16);
            expect(jul.getMinutes()).toBe(7);
            expect(jul.getSeconds()).toBe(12);
            expect(jul.getMilliseconds()).toBe(123);
        });

    });

    test("PersAlgoDatePromiseConstructorFull", () => {
        expect.assertions(8);
        return PersianAlgoDate.create({
            year: 1392,
            month: 9,
            day: 23,
            hour: 16,
            minute: 7,
            second: 12,
            millisecond: 123,
            timezone: "Etc/UTC",
            sync: false
        }).then(pd => {
            expect(pd !== null).toBeTruthy();

            expect(pd.getYears()).toBe(1392);
            expect(pd.getMonths()).toBe(9);
            expect(pd.getDays()).toBe(23);
            expect(pd.getHours()).toBe(16);
            expect(pd.getMinutes()).toBe(7);
            expect(pd.getSeconds()).toBe(12);
            expect(pd.getMilliseconds()).toBe(123);
        });

    });

    test("PersDateAstroAsyncConstructorFull", () => {
        expect.assertions(8);
        return PersianDate.create({
            year: 1392,
            month: 9,
            day: 23,
            hour: 16,
            minute: 7,
            second: 12,
            millisecond: 123,
            timezone: "Etc/UTC",
            sync: false
        }).then(pd => {
            expect(pd !== null).toBeTruthy();

            expect(pd.getYears()).toBe(1392);
            expect(pd.getMonths()).toBe(9);
            expect(pd.getDays()).toBe(23);
            expect(pd.getHours()).toBe(16);
            expect(pd.getMinutes()).toBe(7);
            expect(pd.getSeconds()).toBe(12);
            expect(pd.getMilliseconds()).toBe(123);
        });

    });

    test("ThaiSolarDatePromiseConstructorFull", () => {
        expect.assertions(8);
        return ThaiSolarDate.create({
            year: 2553,
            month: 9,
            day: 23,
            hour: 16,
            minute: 7,
            second: 12,
            millisecond: 123,
            timezone: "Etc/UTC",
            sync: false
        }).then(td => {
            expect(td !== null).toBeTruthy();

            expect(td.getYears()).toBe(2553);
            expect(td.getMonths()).toBe(9);
            expect(td.getDays()).toBe(23);
            expect(td.getHours()).toBe(16);
            expect(td.getMinutes()).toBe(7);
            expect(td.getSeconds()).toBe(12);
            expect(td.getMilliseconds()).toBe(123);
        });
    });

    test("CalendarPromiseFactoryAsync", () => {
        expect.assertions(2);
        return CalendarFactoryAsync({
            locale: "th-TH"
        }).then(cal => {
            expect(typeof(cal) !== "undefined").toBeTruthy();

            expect(cal.getType()).toBe("thaisolar");
        });
    });
});
