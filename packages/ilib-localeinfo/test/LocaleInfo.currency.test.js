/*
 * Copyright © 2022-2026 JEDLSoft
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
 *
 * LocaleInfo.currency.test.js - LocaleInfo Jest tests
 */
import LocaleInfo from '../src/index.js';
import { setupLocaleInfoTests } from './setup.js';

describe("LocaleInfo.currency", () => {

    setupLocaleInfoTests();

    test("should get the currency", () => {
        expect.assertions(2);
        const info = new LocaleInfo("en-US");
        expect(info).not.toBeNull()

        expect(info.getCurrency()).toBe("USD")
    });

    test("should get the currency for the DE locale", () => {
        expect.assertions(2);
        const info = new LocaleInfo("de-DE");
        expect(info).not.toBeNull()

        expect(info.getCurrency()).toBe("EUR")
    });

    test("should get the currency for the GB locale", () => {
        expect.assertions(2);
        const info = new LocaleInfo("en-GB");
        expect(info).not.toBeNull()

        expect(info.getCurrency()).toBe("GBP")
    });

    test("should get the currency for an unknown locale", () => {
        expect.assertions(2);
        const info = new LocaleInfo("zxx-XX");
        expect(info).not.toBeNull()

        expect(info.getCurrency()).toBe("USD")
    });
});
