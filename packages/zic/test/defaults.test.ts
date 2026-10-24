/*
 * defaults.test.ts - unit tests for hard-coded gentzinfo overrides
 *
 * Copyright © 2026 JEDLSoft
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

import {
    BACKWARDS_EXCEPTIONS,
    COUNTRY_EXCEPTIONS,
    DEFAULT_TIMEZONE_ID,
    POSIX_ZONE_IDS,
} from "../src/defaults";

describe("defaults", () => {
    test("COUNTRY_EXCEPTIONS matches gentzinfo hard-coded zones", () => {
        expect.assertions(3);
        expect(COUNTRY_EXCEPTIONS["America/Coral_Harbour"]).toBe("CA");
        expect(COUNTRY_EXCEPTIONS["Atlantic/Jan_Mayen"]).toBe("NO");
        expect(COUNTRY_EXCEPTIONS["America/Virgin"]).toBe("TT");
    });

    test("BACKWARDS_EXCEPTIONS matches gentzinfo hard-coded aliases", () => {
        expect.assertions(4);
        expect(BACKWARDS_EXCEPTIONS.Iceland).toBe("IS");
        expect(BACKWARDS_EXCEPTIONS["Pacific/Ponape"]).toBe("FM");
        expect(BACKWARDS_EXCEPTIONS["Pacific/Truk"]).toBe("FM");
        expect(BACKWARDS_EXCEPTIONS["Pacific/Yap"]).toBe("FM");
    });

    test("DEFAULT_TIMEZONE_ID includes multi-zone country preferences", () => {
        expect.assertions(5);
        expect(DEFAULT_TIMEZONE_ID.US).toBe("America/New_York");
        expect(DEFAULT_TIMEZONE_ID.CA).toBe("America/Toronto");
        expect(DEFAULT_TIMEZONE_ID.AU).toBe("Australia/Sydney");
        expect(DEFAULT_TIMEZONE_ID.RU).toBe("Europe/Moscow");
        expect(DEFAULT_TIMEZONE_ID.FM).toBe("Pacific/Pohnpei");
    });

    test("POSIX_ZONE_IDS lists factory-style Links that are not country-local", () => {
        expect.assertions(3);
        expect(POSIX_ZONE_IDS.has("EST")).toBe(true);
        expect(POSIX_ZONE_IDS.has("CET")).toBe(true);
        expect(POSIX_ZONE_IDS.has("NZ")).toBe(false);
    });
});
