/*
 * timezone.test.js - test the timezone static methods synchronously
 *
 * Copyright © 2024 JEDLSoft
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

import ilib from '../src/ilib.js';
import TimeZone from "../src/TimeZone.js";

describe("test timezone synchronously", () => {
    beforeEach(() => {
        ilib.clearCache();
    });

    test("TZAsyncGetAvailableIds", () => {
        expect.assertions(2);
        const zones = TimeZone.getAvailableIds();
        expect(typeof(zones) !== "undefined").toBeTruthy();

        expect(zones.length > 0).toBeTruthy();
    });

    test("TZAsyncGetAvailableIdsRightValues", () => {
        expect.assertions(2);
        const zones = TimeZone.getAvailableIds();
        expect(typeof(zones) !== "undefined").toBeTruthy();

        // not the full list, but the array should at least contain these
        const expected = [
            "Europe/London",
            "America/Los_Angeles",
            "Australia/Sydney",
            "Asia/Tokyo",
            "Africa/Cairo"
        ];

        expect(zones).toEqual(expect.arrayContaining(expected));
    });

    test("TZAsyncGetAvailableIdsNoFilterContainsLocal", () => {
        expect.assertions(2);
        const zones = TimeZone.getAvailableIds();
        expect(typeof(zones) !== "undefined").toBeTruthy();

        expect(zones.indexOf("local") != -1).toBeTruthy();
    });

    test("TZAsyncGetAvailableIdsByCountryRightLength", () => {
        expect.assertions(2);
        const zones = TimeZone.getAvailableIds("US");
        expect(typeof(zones) !== "undefined").toBeTruthy();

        expect(zones.length).toBe(48);
    });

    test("TZAsyncGetAvailableIdsWithFilterContainsNoLocal", () => {
        try {
            const zones = TimeZone.getAvailableIds("US");
            expect(typeof(zones) !== "undefined").toBeTruthy();

            expect(zones.indexOf("local") == -1).toBeTruthy();
        } catch (e) {
            expect(typeof(e) !== "undefined").toBeTruthy();
        }
    });

    test("TZAsyncGetAvailableIdsByCountryRightContents", () => {
        expect.assertions(2);
        const zones = TimeZone.getAvailableIds("US");
        expect(typeof(zones) !== "undefined").toBeTruthy();

        const expected = [
            "America/New_York",
            "America/Detroit",
            "America/Kentucky/Louisville",
            "America/Kentucky/Monticello",
            "America/Indiana/Indianapolis",
            "America/Indiana/Vincennes",
            "America/Indiana/Winamac",
            "America/Indiana/Marengo",
            "America/Indiana/Petersburg",
            "America/Indiana/Vevay",
            "America/Chicago",
            "America/Indiana/Tell_City",
            "America/Indiana/Knox",
            "America/Menominee",
            "America/North_Dakota/Center",
            "America/North_Dakota/New_Salem",
            "America/North_Dakota/Beulah",
            "America/Denver",
            "America/Boise",
            "America/Phoenix",
            "America/Los_Angeles",
            "America/Anchorage",
            "America/Juneau",
            "America/Sitka",
            "America/Metlakatla",
            "America/Yakutat",
            "America/Nome",
            "America/Adak",
            "Pacific/Honolulu",
            "America/Atka",
            "America/Fort_Wayne",
            "America/Indianapolis",
            "America/Knox_IN",
            "America/Louisville",
            "America/Shiprock",
            "Navajo",
            "Pacific/Johnston",
            "US/Alaska",
            "US/Aleutian",
            "US/Arizona",
            "US/Central",
            "US/East-Indiana",
            "US/Eastern",
            "US/Hawaii",
            "US/Indiana-Starke",
            "US/Michigan",
            "US/Mountain",
            "US/Pacific"
        ];

        expect(zones).toEqual(expect.arrayContaining(expected));
    });

    test("TZAsyncGetAvailableIdsByCountry2RightLength", () => {
        expect.assertions(2);
        const zones = TimeZone.getAvailableIds("SG");
        expect(typeof(zones) !== "undefined").toBeTruthy();

        expect(zones.length).toBe(2);
    });

    test("TZAsyncGetAvailableIdsByCountry2RightContents", () => {
        expect.assertions(2);
        const zones = TimeZone.getAvailableIds("SG");
        expect(typeof(zones) !== "undefined").toBeTruthy();

        const expected = [
            "Asia/Singapore",
            "Singapore"        // legacy tz
        ];

        expect(zones).toEqual(expect.arrayContaining(expected));
    });
});
