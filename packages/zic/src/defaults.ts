/*
 * defaults.ts - hard-coded timezone metadata overrides from gentzinfo.js
 *
 * Copyright © 2013-2015, 2018, 2020-2022, 2026 JEDLSoft
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

/**
 * Zones not listed properly in IANA `zone.tab` that still need a country.
 * Ported from `ilib/tools/cldr/gentzinfo.js`.
 */
export const COUNTRY_EXCEPTIONS: Record<string, string> = {
    "America/Coral_Harbour": "CA",
    "Atlantic/Jan_Mayen": "NO",
    "America/Virgin": "TT",
};

/**
 * Backwards-compatibility zone ids that belong to a different country than
 * their modern target would imply. Ported from gentzinfo.js.
 */
export const BACKWARDS_EXCEPTIONS: Record<string, string> = {
    Iceland: "IS",
    "Pacific/Ponape": "FM",
    "Pacific/Truk": "FM",
    "Pacific/Yap": "FM",
};

/**
 * Legacy POSIX / Factory-style zone ids that are Links onto a real zone but
 * are not country-local names. They must not inherit `c`, must not appear in
 * `countryToZones` / zonetab under the target's country, and must not copy
 * Windows `n` from the link target (e.g. EST → America/Panama).
 */
export const POSIX_ZONE_IDS: ReadonlySet<string> = new Set([
    "EST",
    "CET",
    "EET",
    "MET",
    "MST",
    "HST",
    "WET",
]);

/**
 * Preferred default timezone for multi-zone countries.
 * Ported from gentzinfo.js.
 */
export const DEFAULT_TIMEZONE_ID: Record<string, string> = {
    AU: "Australia/Sydney",
    BR: "America/Sao_Paulo",
    CA: "America/Toronto",
    CL: "America/Santiago",
    CY: "Asia/Nicosia",
    ES: "Europe/Madrid",
    FM: "Pacific/Pohnpei",
    GL: "America/Nuuk",
    KI: "Pacific/Kiritimati",
    MH: "Pacific/Majuro",
    MN: "Asia/Ulaanbaatar",
    MX: "America/Mexico_City",
    PF: "Pacific/Tahiti",
    PG: "Pacific/Port_Moresby",
    PT: "Europe/Lisbon",
    RU: "Europe/Moscow",
    US: "America/New_York",
};
