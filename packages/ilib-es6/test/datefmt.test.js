/*
 * datefmt.test.js - test the date formatter static functions
 *
 * Copyright © 2024 JEDLSoft
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

import DateFmt from "../src/DateFmt.js";

describe("testdatefmt", () => {
     test("DateFmtGetMeridiemsRangeName_with_am_ET_locale", () => {
        expect.assertions(2);
        const fmt = DateFmt.getMeridiemsRange({ locale: "am-ET"});
        expect(fmt !== null).toBeTruthy();

        expect(fmt[0].name).toBe("ጥዋት");
    });

    test("DateFmtGetMeridiemsRangeName_with_am_ET_locale_gregorian_meridiems", () => {
        expect.assertions(2);
        const fmt = DateFmt.getMeridiemsRange({ locale: "am-ET", meridiems: "gregorian"});
        expect(fmt !== null).toBeTruthy();

        expect(fmt[0].name).toBe("ጥዋት");
    });

    test("DateFmtGetMeridiemsRangeName_with_zh_CN_locale", () => {
        expect.assertions(2);
        const fmt = DateFmt.getMeridiemsRange({ locale: "zh-CN"});
        expect(fmt !== null).toBeTruthy();

        expect(fmt[0].name).toBe("上午");
    });

    test("DateFmtGetMeridiemsRangeName_with_zh_CN_locale_chinese_meridiems", () => {
        expect.assertions(2);
        const fmt = DateFmt.getMeridiemsRange({ locale: "zh-CN", meridiems: "chinese"});
        expect(fmt !== null).toBeTruthy();

        expect(fmt[0].name).toBe("凌晨");
    });
});
