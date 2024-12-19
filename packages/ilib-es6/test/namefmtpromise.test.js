/*
 * namefmtasync.test.js - test the name formatter object
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

import NameFmt from "../src/NameFmt.js";
import Name from "../src/Name.js";

describe("testnamefmtpromise", () => {
    test("NameFmtAsyncConstructor", () => {
        expect.assertions(1);
        return NameFmt.create({
            sync: false
        }).then(fmt => {
            expect(typeof(fmt) !== "undefined").toBeTruthy();
        });
    });

    test("NameFmtAsyncGetBogus", () => {
        expect.assertions(1);
        return NameFmt.create({
            locale: "ii-II",
            sync: false
        }).then(fmt => {
            expect(fmt.getLocale().getSpec()).toBe("ii-II");
        });
    });

    test("NameFmtAsyncENFull", () => {
        expect.assertions(1);
        return Name.create({
            prefix: "Mr.",
            givenName: "John",
            middleName: "Kevin",
            familyName: "Smith",
            suffix: "Phd."
        }, {
            sync: false
        }).then(name => {
            return NameFmt.create({
                style: "full",
                sync: false
            }).then(fmt => {
                expect(fmt.format(name)).toBe("Mr. John Kevin Smith Phd.");
            });
        });
    });

    test("NameFmtAsyncDEFull", () => {
        expect.assertions(1);
        return Name.create({
            prefix: "Hr.",
            givenName: "Andreas",
            middleName: "Helmut",
            familyName: "Schmidt",
            suffix: "MdB"
        }, {
            locale: "de-DE",
            sync: false
        }).then(name => {
            return NameFmt.create({
                style: "full",
                locale: "de-DE",
                sync: false
            }).then(fmt => {
                expect(fmt.format(name)).toBe("Hr. Andreas Helmut Schmidt MdB");
            });
        });
    });

    test("NameFmtAsyncZHFormalLong", () => {
        expect.assertions(1);
        return Name.create({
            honorific: "医生",
            givenName: "芳",
            familyName: "李"
        }, {
            locale: "zh-Hans-CN",
            sync: false
        }).then(name => {
            return NameFmt.create({
                style: "formal_long",
                locale: "zh-Hans-CN",
                sync: false
            }).then(fmt => {
                expect(fmt.format(name)).toBe("李芳医生");
            });
        });
    });

    test("NameFmtAsyncZHFormalLong", () => {
        expect.assertions(1);
        return Name.create({
            honorific: "닥터",
            givenName: "은성",
            familyName: "박"
        }, {
            locale: "ko-KR",
            sync: false
        }).then(name => {
            return NameFmt.create({
                style: "formal_long",
                locale: "ko-KR",
                sync: false
            }).then(fmt => {
                expect(fmt.format(name)).toBe("닥터 박은성");
            });
        });
    });
});
