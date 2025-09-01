/*
 * Xliff.test.js - test the xliff superclass object
 *
 * Copyright © 2025 JEDLSoft
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

import { Xliff } from '../src/index.js';

class MockXliff extends Xliff {
    constructor() {
        super();
    }
}

class MockXliff2 extends Xliff {
    constructor() {
        super();
        this.version = "2.0";
        this.sourceLocale = "en-KR";
    }
}

describe("testXliff", () => {
    test("XliffNormal", () => {
        expect.assertions(1);
        const mf = new MockXliff();
        expect(mf).toBeTruthy();
    });
    test("XliffCannotInstantiateAbstractClass", () => {
        expect.assertions(1);
        expect(() => {
            new Xliff();
        }).toThrow();
    });
    test("mockXliffInstance", () => {
        expect.assertions(3);
        const mf = new MockXliff();
        expect(mf).toBeTruthy();
        expect(mf.version).toBe("1.2");
        expect(mf.sourceLocale).toBe("en-US");
    });
    test("mockXliffInstance", () => {
        expect.assertions(3);
        const mf = new MockXliff2();
        expect(mf).toBeTruthy();
        expect(mf.version).toBe("2.0");
        expect(mf.sourceLocale).toBe("en-KR");
    });
});