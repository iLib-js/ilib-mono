/*
 * datefmtpromise.test.js - test the date formatter object asynchronously
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

import ilib from "../src/ilib.js";
import ThaiSolarDate from "../src/ThaiSolarDate.js";
import PersianDate from "../src/PersianDate.js";
import IslamicDate from "../src/IslamicDate.js";
import HebrewDate from "../src/HebrewDate.js";
import GregorianDate from "../src/GregorianDate.js";
import JulianDate from "../src/JulianDate.js";
import DateFmt from "../src/DateFmt.js";
import DateFactory from "../src/DateFactory.js";

describe("testdatefmtpromise", () => {
    test("DateFmtConstructorEmpty", () => {
        expect.assertions(1);
        return DateFmt.create({
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();
        });
    });

    test("DateFmtGetCalendarExplicit", () => {
        expect.assertions(3);
        return DateFmt.create({
            calendar: "julian",
            sync: false
        }).then(fmt => {
            expect(fmt).toBeTruthy();
            const cal = fmt.getCalendar();
            expect(cal).toBeTruthy();

            expect(cal).toBe("julian");
        });
    });

    test("DateFmtGetCalendarNotInThisLocale", () => {
        return DateFmt.create({
            calendar: "arabic",
            locale: 'en-US',
            sync: false
        }).then(fmt => {
            // "No formats available for calendar arabic in locale en-US"
            expect(!fmt).toBeTruthy();
        });
    });

    test("DateFmtGetTimeZoneDefault", () => {
        expect.assertions(2);
        ilib.tz = undefined;    // just in case
        if (ilib._getPlatform() === "nodejs") {
            process.env.TZ = "";
        }

        return DateFmt.create({
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            expect(fmt.getTimeZone().getId()).toBe("local");
        });
    });

    test("DateFmtGetTimeZone", () => {
        expect.assertions(2);
        return DateFmt.create({
            timezone: "Europe/Paris",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            expect(fmt.getTimeZone().getId()).toBe("Europe/Paris");
        });
    });

    test("DateFmtUseTemplateNonEmptyCalendar", () => {
        expect.assertions(2);
        return DateFmt.create({
            calendar: 'julian',
            template: "EEE 'the' DD 'of' MM, yyyy G",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            expect(fmt.getCalendar()).toBe("julian");
        });
    });

    test("DateFmtUseTemplateNonEmptyLocale", () => {
        expect.assertions(2);
        return DateFmt.create({
            locale: 'de-DE',
            template: "EEE 'the' DD 'of' MM, yyyy G",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            expect(fmt.getLocale().toString()).toBe("de-DE");
        });
    });

    test("DateFmtFormatJSDate1", () => {
        expect.assertions(2);
        return DateFmt.create({
            type: "time",
            length: "short",
            timezone: "America/Los_Angeles",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            // test formatting a javascript date. It should be converted to
            // an ilib date object automatically and then formatted
            const datMyBday = new Date("Fri Aug 13 1982 13:37:35 GMT-0700");
            expect(fmt.format(datMyBday)).toBe("1:37 PM");
        });
    });

    test("DateFmtFormatJSDateRightTimeZone1", () => {
        expect.assertions(2);
        return DateFmt.create({
            type: "date",
            length: "full",
            date: "w",
            timezone: "America/Los_Angeles",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            // test formatting a javascript date. It should be converted to
            // an ilib date object automatically and then formatted
            const datMyBday = new Date("Wed May 14 2014 23:37:35 GMT-0700");
            expect(fmt.format(datMyBday)).toBe("Wednesday");
        });
    });

    test("DateFmtGetMonthsOfYearThai", () => {
        expect.assertions(2);
        // uses ThaiSolar calendar
        return DateFmt.create({
            locale: "th-TH",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            const arrMonths = fmt.getMonthsOfYear({length: "long"});

            const expected = [undefined, "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
            expect(arrMonths).toStrictEqual(expected);
        });
    });

    test("DateFmtFormatRelativeWithinMinuteAfter", () => {
        expect.assertions(1);
        return DateFmt.create({
            length: "full",
            sync: false
        }).then(fmt => {
            GregorianDate.create({
                year: 2011,
                month: 11,
                day: 20,
                hour: 13,
                minute: 45,
                second: 0,
                millisecond: 0,
                sync: false
            }).then(reference => {
                GregorianDate.create({
                    year: 2011,
                    month: 11,
                    day: 20,
                    hour: 13,
                    minute: 45,
                    second: 30,
                    millisecond: 0,
                    sync: false
                }).then(date => {
                    expect(fmt.formatRelative(reference, date)).toBe("in 30 seconds");
                });
            });
        });
    });

    test("DateFmtConvertToGMT", () => {
        expect.assertions(2);
        return DateFmt.create({
            length: "short",
            type: "datetime",
            timezone: "Europe/London",
            locale: "en-GB",
            time: "hmaz",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            GregorianDate.create({
                year: 2011,
                month: 9,
                day: 20,
                hour: 13,
                minute: 45,
                second: 0,
                millisecond: 0,
                timezone: "America/Los_Angeles",
                locale: "en-US",
                sync: false
            }).then(date => {
                expect(fmt.format(date)).toBe("20/09/2011, 21:45 GMT/BST");
            });
        });
    });

    test("DateFmtConvertToOtherTimeZone", () => {
        expect.assertions(2);
        return DateFmt.create({
            length: "short",
            type: "datetime",
            timezone: "Australia/Sydney",
            locale: "en-AU",
            time: "hmaz",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            GregorianDate.create({
                year: 2011,
                month: 9,
                day: 20,
                hour: 13,
                minute: 45,
                second: 0,
                millisecond: 0,
                timezone: "America/Los_Angeles",
                locale: "en-US",
                sync: false
            }).then(date => {
                expect(fmt.format(date)).toBe("21/9/11, 6:45 am AEST");
            });
        });
    });

    test("DateFmtGetMeridiemsRangeName_with_am_ET_locale", () => {
        expect.assertions(2);
        return DateFmt.getMeridiemsRange({
            locale: "am-ET",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();
            expect(fmt[0].name).toBe("ጥዋት");
        });
    });

    test("DateFmtGetMeridiemsRangeName_with_am_ET_locale_gregorian_meridiems", () => {
        expect.assertions(2);
        return DateFmt.getMeridiemsRange({
            locale: "am-ET",
            meridiems: "gregorian",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();
            expect(fmt[0].name).toBe("ጥዋት");
        });
    });

    test("DateFmtGetMeridiemsRangeName_with_zh_CN_locale", () => {
        expect.assertions(2);
        return DateFmt.getMeridiemsRange({
            locale: "zh-CN",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();
            expect(fmt[0].name).toBe("上午");
        });
    });

    test("DateFmtGetMeridiemsRangeName_with_zh_CN_locale_chinese_meridiems", () => {
        expect.assertions(2);
        return DateFmt.getMeridiemsRange({
            locale: "zh-CN",
            meridiems: "chinese",
            sync: false,
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();
            expect(fmt[0].name).toBe("凌晨");
        });
    });
});