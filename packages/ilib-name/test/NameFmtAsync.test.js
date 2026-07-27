/*
 * NameFmtAsync.test.js - test the name formatter object
 *
 * Copyright © 2018,2026 JEDLSoft
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

import NameFmt from '../src/NameFmt.js';
import Name from '../src/Name.js';
import { LocaleData } from 'ilib-localedata';
import { setLocale } from 'ilib-env';

describe("NameFmtAsync", () => {
    beforeEach(() => {
        setLocale("en-US");
        LocaleData.clearCache();
    });

    test("should asynchronously create a name formatter", async () => {
        expect.assertions(1);
        const fmt = await NameFmt.create();
        expect(typeof(fmt) !== "undefined").toBeTruthy();
    });

    test("should asynchronously return a bogus locale as configured", async () => {
        expect.assertions(1);
        const fmt = await NameFmt.create({
            locale: "ii-II"
        });
        expect(fmt.getLocale().getSpec()).toBe("ii-II");
    });

    test("should asynchronously format an English name in full style", async () => {
        expect.assertions(1);
        const name = await Name.create({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: "Phd."
        }, {
            sync: false,
        });
        const fmt = await NameFmt.create({
            style: "full"
        });
        expect(fmt.format(name)).toBe("Mr. John Kevin Smith Phd.");
    });

    test("should asynchronously format a German name in full style", async () => {
        expect.assertions(1);
        const name = await Name.create({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: "MdB"
        }, {
            locale: "de-DE",
            sync: false,
        });
        const fmt = await NameFmt.create({
            style: "full",
            locale: "de-DE"
        });
        expect(fmt.format(name)).toBe("Hr. Andreas Helmut Schmidt MdB");
    });

    test("should asynchronously format a Chinese name in formal long style", async () => {
        expect.assertions(1);
        const name = await Name.create({
            honorific: "医生",
            givenName: "芳",
            familyName: "李"
        }, {
            locale: "zh-Hans-CN",
            sync: false,
        });
        const fmt = await NameFmt.create({
            style: "formal_long",
            locale: "zh-Hans-CN"
        });
        expect(fmt.format(name)).toBe("李芳医生");
    });

    test("should asynchronously format a Korean name in formal long style", async () => {
        expect.assertions(1);
        const name = await Name.create({
            honorific: "닥터",
            givenName: "은성",
            familyName: "박"
        }, {
            locale: "ko-KR"
        });
        const fmt = await NameFmt.create({
            style: "formal_long",
            locale: "ko-KR"
        });
        expect(fmt.format(name)).toBe("닥터 박은성");
    });
});
