/*
 * durfmtasync.test.js - test the duration formatter object
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

import DurationFmt from "../src/DurationFmt.js";

describe("testdurfmtpromise", () => {
    test("DurFmtAsyncConstructorEmpty", () => {
        expect.assertions(1);
        return DurationFmt.create({
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();
        });

    });

    test("DurFmtAsyncGetLocale", () => {
        expect.assertions(2);
        return DurationFmt.create({
            locale: "de-DE",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            expect(fmt.getLocale().toString()).toBe("de-DE");
        });
    });

    test("DurFmtAsyncGetLocaleBogus", () => {
        expect.assertions(2);
        return DurationFmt.create({
            locale: "zyy-XX",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            expect(fmt.getLocale().toString()).toBe("zyy-XX");
        });
    });

    test("DurFmtAsyncFormatShortText", () => {
        expect.assertions(2);
        return DurationFmt.create({
            length: "short",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            const duration = fmt.format({
                year: 1,
                month: 1,
                week: 1,
                day: 1,
                hour: 1,
                minute: 1,
                second: 1,
                millisecond: 1
            });
            expect(duration.toString()).toBe("1y 1m 1w 1d 1h 1m 1s 1ms");
        });
    });

    test("DurFmtAsyncFormatLongSingle", () => {
        expect.assertions(2);
        return DurationFmt.create({
            length: "long",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            const duration = fmt.format({
                year: 1,
                month: 1,
                week: 1,
                day: 1,
                hour: 1,
                minute: 1,
                second: 1,
                millisecond: 1
            });
            expect(duration.toString()).toBe("1 yr, 1 mth, 1 wk, 1 day, 1 hr, 1 min, 1 sec, 1 ms");
        });
    });

    test("DurFmtAsyncFormatFullPlural", () => {
        expect.assertions(2);
        return DurationFmt.create({
            length: "full",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            const duration = fmt.format({
                year: 2,
                month: 2,
                week: 2,
                day: 2,
                hour: 2,
                minute: 2,
                second: 2,
                millisecond: 2
            });
            expect(duration.toString()).toBe("2 years, 2 months, 2 weeks, 2 days, 2 hours, 2 minutes, 2 seconds, 2 milliseconds");
        });
    });

    test("DurFmtAsyncFormatShortDEDefaultStyle", () => {
        expect.assertions(2);
        return DurationFmt.create({
            locale: "de-DE",
            length: "short",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();
            const duration = fmt.format({
                year: 1,
                month: 1,
                week: 1,
                day: 1,
                hour: 1,
                minute: 1,
                second: 1,
                millisecond: 1
            });
            expect(duration.toString()).toBe("1 J, 1 M, 1 W, 1 T, 1 Std., 1 Min., 1 Sek., 1 ms");
        });
    });

    test("DurFmtAsyncFormatFullDESingle", () => {
        expect.assertions(2);
        return DurationFmt.create({
            locale: "de-DE",
            length: "full",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            const duration = fmt.format({
                year: 1,
                month: 1,
                week: 1,
                day: 1,
                hour: 1,
                minute: 1,
                second: 1,
                millisecond: 1
            });
            expect(duration.toString()).toBe("1 Jahr, 1 Monat, 1 Woche, 1 Tag, 1 Stunde, 1 Minute, 1 Sekunde und 1 Millisekunde");
        });
    });

    test("DurFmtAsyncFormatShortZHText", () => {
        expect.assertions(2);
        return DurationFmt.create({
            locale: "zh-Hans-CN",
            length: "short",
            style: "text",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            const duration = fmt.format({
                year: 1,
                month: 1,
                week: 1,
                day: 1,
                hour: 1,
                minute: 1,
                second: 1,
                millisecond: 1
            });
            expect(duration.toString()).toBe("1年1个月1周1天1小时1分钟1秒1毫秒");
        });
    });

    test("DurFmtAsyncFormatShortZHClock", () => {
        expect.assertions(2);
        return DurationFmt.create({
            locale: "zh-Hans-CN",
            length: "short",
            style: "clock",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            const duration = fmt.format({
                year: 1,
                month: 1,
                week: 1,
                day: 1,
                hour: 1,
                minute: 1,
                second: 1,
                millisecond: 1
            });
            expect(duration.toString()).toBe("1年1个月1周1天01:01:01");
        });
    });

    test("DurFmtAsyncFormatFullZH", () => {
        expect.assertions(2);
        return DurationFmt.create({
            locale: "zh-Hans-CN",
            length: "full",
            sync: false
        }).then(fmt => {
            expect(fmt !== null).toBeTruthy();

            const duration = fmt.format({
                year: 1,
                month: 1,
                week: 1,
                day: 1,
                hour: 1,
                minute: 1,
                second: 1,
                millisecond: 1
            });
            expect(duration.toString()).toBe("1年1个月1周1天1小时1分钟1秒钟1毫秒");
        });
    });
});
