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
 * LocaleInfo.timezone.test.js - LocaleInfo Jest tests
 */
import LocaleInfo from '../src/index.js';
import { setupLocaleInfoTests } from './setup.js';

describe("LocaleInfo.timezone", () => {

    setupLocaleInfoTests();

    test("should get the time zone for the US locale", () => {
        expect.assertions(2);
        const info = new LocaleInfo("en-US");
        expect(info).not.toBeNull()

        expect(info.getTimeZone()).toBe("America/New_York")
    });

    test("should get the time zone for the DE locale", () => {
        expect.assertions(2);
        const info = new LocaleInfo("de-DE");
        expect(info).not.toBeNull()

        expect(info.getTimeZone()).toBe("Europe/Berlin")
    });

    test("should get the time zone for the ES locale", () => {
        expect.assertions(2);
        const info = new LocaleInfo("es-ES");
        expect(info).not.toBeNull()

        expect(info.getTimeZone()).toBe("Europe/Madrid")
    });

    test("should get the time zone for the MM locale", () => {
        expect.assertions(2);
        const info = new LocaleInfo("my-MM");
        expect(info).not.toBeNull()
        expect(info.getTimeZone()).toBe("Asia/Yangon")
    });

    test("should get the time zone for the CA locale", () => {
        expect.assertions(2);
        const info = new LocaleInfo("en-CA");
        expect(info).not.toBeNull()
        expect(info.getTimeZone()).toBe("America/Toronto")
    });

    test("should get the time zone for the CH locale", () => {
        expect.assertions(2);
        const info = new LocaleInfo("de-CH");
        expect(info).not.toBeNull()
        expect(info.getTimeZone()).toBe("Europe/Zurich")
    });

    test("should get the time zone for the KR locale", () => {
        expect.assertions(2);
        const info = new LocaleInfo("ko-KR");
        expect(info).not.toBeNull()
        expect(info.getTimeZone()).toBe("Asia/Seoul")
    });

    test("should get the time zone for the BT locale", () => {
        expect.assertions(2);
        const info = new LocaleInfo("dz-BT");
        expect(info).not.toBeNull()
        expect(info.getTimeZone()).toBe("Asia/Thimphu")
    });

    test("should get the time zone for the FO locale", () => {
        expect.assertions(2);
        const info = new LocaleInfo("fo-FO");
        expect(info).not.toBeNull()
        expect(info.getTimeZone()).toBe("Atlantic/Faroe")
    });

    test("should get the time zone for the FM locale", () => {
        expect.assertions(2);
        const info = new LocaleInfo("en-FM");
        expect(info).not.toBeNull()
        expect(info.getTimeZone()).toBe("Pacific/Pohnpei")
    });

    test("should get the time zone for the default locale", () => {
        expect.assertions(2);
        const info = new LocaleInfo("zz-ZZ");
        expect(info).not.toBeNull()

        expect(info.getTimeZone()).toBe("Etc/UTC")
    });
});
