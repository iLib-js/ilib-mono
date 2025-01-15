/*
 * listfmtasync.test.js - test the list formatter object
 *
 * Copyright © 2018, 2022, 2024 JEDLSoft
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSe-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import ListFmt from "../src/ListFmt.js";

describe("testlistfmtpromise", () => {
    test("ListFmtAsyncConstructorEmpty", () => {
        return ListFmt.create({
            sync: false
        }).then(fmt => {
            expect.assertions(1);
            expect(fmt !== null).toBeTruthy();
        });
    });

    test("ListFmtAsyncTestPropertyTwo", () => {
        return ListFmt.create({
            sync: false
        }).then(fmt => {
            expect.assertions(2);
            expect(fmt !== null).toBeTruthy();
            expect(fmt.format(["true", "false"])).toBe("true & false");
        });
    });

    test("ListFmtAsyncbnINNumberFormatFour", () => {
        return ListFmt.create({
            locale: "bn-IN",
            sync: false
        }).then(fmt => {
            expect.assertions(2);
            expect(fmt !== null).toBeTruthy();
            expect(fmt.format(["এক", "দুই", "তিন", "চার"])).toBe("এক, দুই, তিন এবং চার");
        });
    });

    test("ListFmtAsynckoKRNumberFormatThree", () => {
        return ListFmt.create({
            locale: "ko-KR",
            sync: false
        }).then(fmt => {
            expect.assertions(2);
            expect(fmt !== null).toBeTruthy();
            expect(fmt.format(["하나", "둘", "셋"])).toBe("하나, 둘 및 셋");
        });
    });
});
