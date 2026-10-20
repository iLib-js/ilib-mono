/*
 * types.ts - shared types for compiled and enriched timezone data
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

/**
 * DST start/end rule fields as stored in ilib zoneinfo JSON.
 */
export interface DstRuleInfo {
    /** Abbreviation letter (for example `"D"` or `"S"`). */
    c?: string;
    /** Month number (1-12). */
    m?: number;
    /** Relative day rule (for example `"0>8"` or `"l0"`). */
    r?: string;
    /** Wall time (`H:M`). */
    t?: string;
    /** DST savings (`H:M`). */
    v?: string;
    /** Optional rule type letter from tzdata. */
    p?: string;
}

/**
 * Per-zone JSON payload used by ilib at runtime.
 *
 * Compiler phase fills `o` / `f` / `s` / `e`. Enricher adds `c` / `n`.
 */
export interface ZoneInfo {
    /** GMT offset (`H:M`, for example `"-5:0"`). */
    o: string;
    /**
     * Abbreviation format for runtime:
     * - `%s` → `{c}` (letter from DST rules, e.g. `E{c}T`)
     * - `%z` → numeric UT offset(s), e.g. `-03` or `-03/-02` (std/DST)
     * - fixed / slash forms left as in tzdata when already explicit
     */
    f: string;
    /** Current DST start rule, when applicable. */
    s?: DstRuleInfo;
    /** Current DST end rule, when applicable. */
    e?: DstRuleInfo;
    /** ISO country code. */
    c?: string;
    /** Windows / CLDR long display name (`Standard` → `{c}`). */
    n?: string;
}

/**
 * Contents of a `timezone.jf` file.
 */
export interface LocaleTimezoneInfo {
    timezone: string;
}

/**
 * In-memory model after {@link ZoneInfoEnricher.enrich}.
 */
export interface EnrichedTzData {
    /** Zone id → zone info (includes `c` / `n` when known). */
    zones: Record<string, ZoneInfo>;
    /** ISO country code → sorted list of zone ids. */
    countryToZones: Record<string, string[]>;
    /** Root `timezone.jf` payload (`Etc/UTC`). */
    rootTimezone: LocaleTimezoneInfo;
    /** Per-country `und/<CC>/timezone.jf` payloads. */
    countryTimezones: Record<string, LocaleTimezoneInfo>;
}

/**
 * Minimal CLDR windowsZones shape used by the enricher.
 *
 * Matches both `@type`/`@other` (JSON-LD style) and `_type`/`_other`
 * (attribute style) field names from `cldr-core`.
 */
export interface WindowsZoneMapZone {
    "@type"?: string;
    "_type"?: string;
    "@other"?: string;
    "_other"?: string;
}

/**
 * Injected or loaded windowsZones supplemental data.
 */
export interface WindowsZonesData {
    supplemental?: {
        windowsZones?: {
            mapTimezones?: Array<{ mapZone: WindowsZoneMapZone }>;
        };
    };
    windowsZones?: {
        mapTimezones?: Array<{ mapZone: WindowsZoneMapZone }>;
    };
}
