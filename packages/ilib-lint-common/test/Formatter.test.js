/*
 * Formatter.test.js - test the formatter superclass object
 *
 * Copyright © 2022-2023 JEDLSoft
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

import Formatter from '../src/Formatter.js';

class MockFormatter extends Formatter {
    constructor() {
        super();
        this.name = "mock";
        this.description = "asdf asdf";
    }
}

describe("testFormatter", () => {
    test("FormatterNormal", () => {
        expect.assertions(1);

        const formatter = new MockFormatter();

        expect(formatter).toBeTruthy();
    });

    test("FormatterCannotInstantiateAbstractClass", () => {
        expect.assertions(1);

        expect(() => {
            new Formatter();
        }).toThrow();
    });

    test("FormatterGetName", () => {
        expect.assertions(2);

        const formatter = new MockFormatter();

        expect(formatter).toBeTruthy();

        expect(formatter.getName()).toBe("mock");
    });

    test("FormatterGetDescription", () => {
        expect.assertions(2);

        const formatter = new MockFormatter();

        expect(formatter).toBeTruthy();

        expect(formatter.getDescription()).toBe("asdf asdf");
    });
});

