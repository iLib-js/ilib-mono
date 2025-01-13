/*
 * datefmtrangepromise.test.js - test the date range formatter object
 *
 * Copyright © 2018-2019, 2024 JEDLSoft
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

import LocaleInfo from "../src/LocaleInfo.js";
import GregorianDate from "../src/GregorianDate.js";
import DateRngFmt from "../src/DateRngFmt.js";
import DateFmt from "../src/DateFmt.js";

describe("testdatefmtrangepromise", () => {
    test("DateRngFmtConstructorEmpty", () => {
        expect.assertions(1);
        return DateRngFmt.create({
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();
        });

    });

    test("DateRngFmtGetCalendarExplicit", () => {
        expect.assertions(3);
        return DateRngFmt.create({
            calendar: "julian",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();
            const cal = fmt.getCalendar();
            expect(cal !== null).toBeTruthy();

            expect(cal).toBe("julian");
        });
    });

    test("DateRngFmtGetCalendarNotInThisLocale", () => {
        return DateRngFmt.create({
            calendar: "arabic",
            locale: 'en-US',
            sync: false
        }).then(fmt => {
            // "No formats available for calendar arabic in locale en-US"
            expect(!fmt).toBeTruthy();
        });
    });

    test("DateRngFmtGetLocale", () => {
        expect.assertions(2);
        return DateRngFmt.create({
            locale: "de-DE",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            expect(fmt.getLocale().toString()).toBe("de-DE");
        });
    });

    test("DateRngFmtGetTimeZone", () => {
        expect.assertions(2);
        return DateRngFmt.create({
            timezone: "Europe/Paris",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            const tz = fmt.getTimeZone();
            expect(tz.getId()).toBe("Europe/Paris");
        });
    });

    test("DateRngFmtGetDefaultLocale", () => {
        expect.assertions(2);
        return DateRngFmt.create({
            locale: "yy-YY",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            expect(fmt.getLocale().toString()).toBe("yy-YY");
        });
    });

    //Miscellaneous UnitTest

    test("DateRngFmtesPAMultiDayMedium", () => {
        expect.assertions(2);
        return DateRngFmt.create({
            locale: "es-PA",
            length: "medium",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            GregorianDate.create({
                year: 2011,
                month: 6,
                day: 20,
                hour: 13,
                minute: 45,
                second: 0,
                millisecond: 0,
                sync: false
            }).then(start => {
                GregorianDate.create({
                    year: 2011,
                    month: 6,
                    day: 28,
                    hour: 14,
                    minute: 5,
                    second: 30,
                    millisecond: 0,
                    sync: false
                }).then(end => {
                    expect(fmt.format(start, end)).toBe("06/20 – 28/2011");
                });
            });
        });
    });

    test("DateRngFmtesPRNextMonthMedium", () => {
        expect.assertions(2);
        return DateRngFmt.create({
            locale: "es-PR",
            length: "medium",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            GregorianDate.create({
                year: 2011,
                month: 6,
                day: 20,
                hour: 13,
                minute: 45,
                second: 0,
                millisecond: 0,
                sync: false
            }).then(start => {
                GregorianDate.create({
                    year: 2011,
                    month: 11,
                    day: 28,
                    hour: 14,
                    minute: 30,
                    second: 0,
                    millisecond: 0,
                    sync: false
                }).then(end => {
                    expect(fmt.format(start, end)).toBe("06/20 – 11/28/2011");
                });
            });
        });
    });

    test("DateRngFmtAcceptJSIntrisicDates", () => {
        expect.assertions(2);
        return DateRngFmt.create({
            locale: "en-US",
            length: "short",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            const start = new Date(2011, 5, 20, 13, 45, 0);
            const end = new Date(2012, 4, 26, 16, 30, 0);
            expect(fmt.format(start, end)).toBe("6/20/11 – 5/26/12");
        });
    });

    test("DateRngFmtAcceptUnixTimes", () => {
        expect.assertions(2);
        return DateRngFmt.create({
            locale: "en-US",
            length: "short",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            const start = 1308602700000;
            const end = 1338075000000;
            expect(fmt.format(start, end)).toBe("6/20/11 – 5/26/12");
        });
    });
});
