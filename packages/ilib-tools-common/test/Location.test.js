/*
 * Location.test.js - test the location class
 *
 * Copyright © 2024, JEDLSoft
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

import Location from "../src/Location.js";

describe("testLocation", () => {
    test("with empty constructor", () => {
        expect.assertions(1);

        const loc = new Location();
        expect(loc).toBeTruthy();
    });

    test("with offset location only", () => {
        expect.assertions(2);

        const loc = new Location({
            offset: 34
        });
        expect(loc).toBeTruthy();

        expect(loc.getLocation()).toStrictEqual({
            offset: 34
        });
    });

    test("with line and char location only", () => {
        expect.assertions(2);

        const loc = new Location({
            line: 4,
            char: 3
        });
        expect(loc).toBeTruthy();

        expect(loc.getLocation()).toStrictEqual({
            line: 4,
            char: 3
        });
    });

    test("with offset and line and char location together", () => {
        expect.assertions(2);

        const loc = new Location({
            offset: 43,
            line: 4,
            char: 3
        });
        expect(loc).toBeTruthy();

        expect(loc.getLocation()).toStrictEqual({
            offset: 43,
            line: 4,
            char: 3
        });
    });

    test("with strings instead of numbers", () => {
        expect.assertions(2);

        const loc = new Location({
            offset: "43",
            line: "4",
            char: "3"
        });
        expect(loc).toBeTruthy();

        expect(loc.getLocation()).toStrictEqual({
            offset: 43,
            line: 4,
            char: 3
        });
    });

    test("ignoring extraneous options", () => {
        expect.assertions(2);

        const loc = new Location({
            offset: 43,
            line: 4,
            char: 3,
            foo: 34,
            bar: 1234
        });
        expect(loc).toBeTruthy();

        expect(loc.getLocation()).toStrictEqual({
            offset: 43,
            line: 4,
            char: 3
        });
    });
});
