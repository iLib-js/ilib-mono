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
 * LocaleInfo.weekend.test.js - LocaleInfo Jest tests
 */
import LocaleInfo from '../src/index.js';
import { setupLocaleInfoTests } from './setup.js';

describe("LocaleInfo.weekend", () => {

    setupLocaleInfoTests();

    test("should get the weekend for the US locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("en-US");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(6)
        expect(info.getWeekEndEnd()).toBe(0)
    });

    test("should get the weekend for the DE locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("de-DE");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(6)
        expect(info.getWeekEndEnd()).toBe(0)
    });

    test("should get the weekend for the FR locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("fr-FR");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(6)
        expect(info.getWeekEndEnd()).toBe(0)
    });

    test("should get the weekend for the AE locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-AE");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(6)
        expect(info.getWeekEndEnd()).toBe(0)
    });

    test("should get the weekend for the BH locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-BH");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(5)
        expect(info.getWeekEndEnd()).toBe(6)
    });

    test("should get the weekend for the DZ locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-DZ");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(5)
        expect(info.getWeekEndEnd()).toBe(6)
    });

    test("should get the weekend for the EG locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-EG");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(5)
        expect(info.getWeekEndEnd()).toBe(6)
    });

    test("should get the weekend for the IL locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("he-IL");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(5)
        expect(info.getWeekEndEnd()).toBe(6)
    });

    test("should get the weekend for the IQ locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-IQ");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(5)
        expect(info.getWeekEndEnd()).toBe(6)
    });

    test("should get the weekend for the JO locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-JO");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(5)
        expect(info.getWeekEndEnd()).toBe(6)
    });

    test("should get the weekend for the KW locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-KW");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(5)
        expect(info.getWeekEndEnd()).toBe(6)
    });

    test("should get the weekend for the LY locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-LY");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(5)
        expect(info.getWeekEndEnd()).toBe(6)
    });

    test("should get the weekend for the MA locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-MA");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(6)
        expect(info.getWeekEndEnd()).toBe(0)
    });

    test("should get the weekend for the OM locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-OM");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(5)
        expect(info.getWeekEndEnd()).toBe(6)
    });

    test("should get the weekend for the QA locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-QA");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(5)
        expect(info.getWeekEndEnd()).toBe(6)
    });

    test("should get the weekend for the SA locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-SA");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(5)
        expect(info.getWeekEndEnd()).toBe(6)
    });

    test("should get the weekend for the SD locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-SD");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(5)
        expect(info.getWeekEndEnd()).toBe(6)
    });

    test("should get the weekend for the SY locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-SY");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(5)
        expect(info.getWeekEndEnd()).toBe(6)
    });

    test("should get the weekend for the TN locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-TN");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(6)
        expect(info.getWeekEndEnd()).toBe(0)
    });

    test("should get the weekend for the YE locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ar-YE");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(5)
        expect(info.getWeekEndEnd()).toBe(6)
    });

    test("should get the weekend for the AF locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("ps-AF");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(4)
        expect(info.getWeekEndEnd()).toBe(5)
    });

    test("should get the weekend for the IR locale", () => {
        expect.assertions(3);
        const info = new LocaleInfo("fa-IR");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(5)
        expect(info.getWeekEndEnd()).toBe(5)
    });

    test("should get the weekend for hi-IN", () => {
        expect.assertions(3);
        const info = new LocaleInfo("hi-IN");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(0)
        expect(info.getWeekEndEnd()).toBe(0)
    });

    test("should get the weekend for az-Latn-AZ", () => {
        expect.assertions(3);
        const info = new LocaleInfo("az-Latn-AZ");
        expect(info).not.toBeNull()

        expect(info.getWeekEndStart()).toBe(6)
        expect(info.getWeekEndEnd()).toBe(0)
    });
});
