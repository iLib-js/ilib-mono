/*
 * ZoneInfoEnricher.ts - decorate compiled zoneinfo with country and names
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

import * as fs from "fs";
import * as path from "path";

import { UnicodeFile } from "ilib-data-utils";

import {
    BACKWARDS_EXCEPTIONS,
    COUNTRY_EXCEPTIONS,
    DEFAULT_TIMEZONE_ID,
    POSIX_ZONE_IDS,
} from "./defaults";
import { loadJsonFile } from "./loadJson";
import type {
    EnrichedTzData,
    LocaleTimezoneInfo,
    WindowsZonesData,
    ZoneInfo,
} from "./types";

/**
 * Locate `cldr-core/.../windowsZones.json` by walking up from this module
 * until a matching `node_modules` entry is found (pnpm / npm layouts).
 */
function resolveWindowsZonesJsonPath(): string {
    let dir = __dirname;
    for (let i = 0; i < 8; i++) {
        const candidate = path.join(
            dir,
            "node_modules",
            "cldr-core",
            "supplemental",
            "windowsZones.json"
        );
        if (fs.existsSync(candidate)) {
            return candidate;
        }
        const parent = path.dirname(dir);
        if (parent === dir) {
            break;
        }
        dir = parent;
    }
    throw new Error(
        "Could not find cldr-core/supplemental/windowsZones.json"
    );
}

/**
 * Options for {@link ZoneInfoEnricher}.
 */
export interface ZoneInfoEnricherOptions {
    /**
     * Directory containing unpacked IANA tzdata (`zone.tab`, `backward`).
     */
    tzDataDir: string;

    /**
     * When true, emit progress messages to stdout.
     */
    verbose?: boolean;

    /**
     * Optional CLDR windowsZones data. When omitted, the implementation
     * loads `cldr-core/supplemental/windowsZones.json`.
     */
    windowsZones?: WindowsZonesData;
}

/**
 * Enriches compiled zone JSON with country codes, Windows display names,
 * zonetab groupings, and per-country default timezone ids.
 *
 * TypeScript port of `ilib/tools/cldr/gentzinfo.js`, operating on an
 * in-memory zone map instead of scanning zoneinfo files on disk.
 */
export class ZoneInfoEnricher {
    private readonly tzDataDir: string;
    private readonly verbose: boolean;
    private readonly windowsZones: WindowsZonesData | undefined;

    /**
     * @param options Enricher configuration
     */
    constructor(options: ZoneInfoEnricherOptions) {
        if (!options || !options.tzDataDir) {
            throw new Error("tzDataDir is required");
        }
        this.tzDataDir = options.tzDataDir;
        this.verbose = Boolean(options.verbose);
        this.windowsZones = options.windowsZones;
    }

    /**
     * Decorate compiled zones and build locale metadata.
     *
     * Does not read or write zoneinfo JSON files. Input zone objects are
     * not mutated; the returned `zones` map contains new/copied objects
     * with `c` / `n` added when known.
     *
     * @param zones Zone id → compiler output (`o`, `f`, optional `s`/`e`)
     * @returns Enriched zones plus zonetab and timezone.jf payloads
     * @throws Error when `tzDataDir` is missing or not a directory
     * @throws Error when `zone.tab` or `backward` is missing under `tzDataDir`
     * @throws Error when `zones` is null, undefined, or not an object
     */
    enrich(zones: Record<string, ZoneInfo>): EnrichedTzData {
        if (zones === null || zones === undefined || typeof zones !== "object") {
            throw new Error("zones must be an object");
        }

        const tzDataDir = path.resolve(this.tzDataDir);
        if (!fs.existsSync(tzDataDir) || !fs.statSync(tzDataDir).isDirectory()) {
            throw new Error(
                "Could not access tzdata directory " + tzDataDir
            );
        }

        const zoneTabPath = path.join(tzDataDir, "zone.tab");
        if (!fs.existsSync(zoneTabPath)) {
            throw new Error("Missing zone.tab in " + tzDataDir);
        }
        const backwardPath = path.join(tzDataDir, "backward");
        if (!fs.existsSync(backwardPath)) {
            throw new Error("Missing backward in " + tzDataDir);
        }

        const backwardsMap: Record<string, string> = {};
        const backwardsFile = new UnicodeFile({
            path: backwardPath,
            splitChar: /\t+/g,
        });
        if (backwardsFile) {
            for (let i = 0; i < backwardsFile.length(); i++) {
                const row = backwardsFile.get(i);
                if (!row || row.length < 3) {
                    continue;
                }
                // Link TARGET LINK_NAME
                const oldId = row[2].trim();
                const modernId = row[1].trim();
                backwardsMap[oldId] = modernId;
                if (this.verbose) {
                    console.log(
                        "mapped old id " + oldId + " to modern " + modernId
                    );
                }
            }
        }

        let countries: Record<string, string> = {};
        const countryToZonesSets: Record<string, Set<string>> = {};
        /** Zone ids that appear as the primary id in `zone.tab` (not aliases). */
        const zoneTabIds = new Set<string>();

        const zoneTab = new UnicodeFile({
            path: zoneTabPath,
            splitChar: /\t+/g,
        });
        if (zoneTab) {
            for (let i = 0; i < zoneTab.length(); i++) {
                const row = zoneTab.get(i);
                if (!row || row.length < 3) {
                    continue;
                }
                const cc = row[0].trim();
                const zoneId = row[2].trim();
                countries[zoneId] = cc;
                zoneTabIds.add(zoneId);
                if (!countryToZonesSets[cc]) {
                    countryToZonesSets[cc] = new Set();
                }
                countryToZonesSets[cc].add(zoneId);
                if (this.verbose) {
                    console.log("map " + zoneId + " to " + cc);
                }
            }
        }

        countries = Object.assign(countries, COUNTRY_EXCEPTIONS);

        const outZones: Record<string, ZoneInfo> = {};
        for (const zoneId of Object.keys(zones)) {
            const copy: ZoneInfo = {
                ...zones[zoneId],
                s: zones[zoneId].s ? { ...zones[zoneId].s } : undefined,
                e: zones[zoneId].e ? { ...zones[zoneId].e } : undefined,
            };
            if (countries[zoneId] !== undefined) {
                copy.c = countries[zoneId];
            } else if (
                // Links inherit the target's country (Montreal→CA, NZ→NZ)
                // except POSIX factory ids (EST→Panama must not get c:"PA").
                !POSIX_ZONE_IDS.has(zoneId) &&
                backwardsMap[zoneId] &&
                countries[backwardsMap[zoneId]] !== undefined
            ) {
                copy.c = countries[backwardsMap[zoneId]];
            }
            outZones[zoneId] = copy;
        }

        for (const oldzone of Object.keys(backwardsMap)) {
            // POSIX ids stay out of zonetab country lists (EST ∉ PA).
            if (POSIX_ZONE_IDS.has(oldzone)) {
                continue;
            }
            const newzone = backwardsMap[oldzone];
            if (
                countries[newzone] &&
                (!countries[oldzone] ||
                    countries[newzone] === countries[oldzone])
            ) {
                if (BACKWARDS_EXCEPTIONS[oldzone]) {
                    const cc = BACKWARDS_EXCEPTIONS[oldzone];
                    if (!countryToZonesSets[cc]) {
                        countryToZonesSets[cc] = new Set();
                    }
                    countryToZonesSets[cc].add(oldzone);
                } else {
                    countryToZonesSets[countries[newzone]].add(oldzone);
                }
            } else if (countries[oldzone]) {
                if (!countryToZonesSets[countries[oldzone]]) {
                    countryToZonesSets[countries[oldzone]] = new Set();
                }
                countryToZonesSets[countries[oldzone]].add(oldzone);
            }
        }

        let windowsData = this.windowsZones;
        if (!windowsData) {
            windowsData = loadJsonFile<WindowsZonesData>(
                resolveWindowsZonesJsonPath()
            );
        }
        if (windowsData.supplemental) {
            windowsData = windowsData.supplemental as WindowsZonesData;
        }
        const mapTimezones =
            windowsData.windowsZones && windowsData.windowsZones.mapTimezones
                ? windowsData.windowsZones.mapTimezones
                : [];

        for (let z = 0; z < mapTimezones.length; z++) {
            const mapZone = mapTimezones[z].mapZone;
            const type = mapZone["@type"] || mapZone["_type"];
            const other = mapZone["@other"] || mapZone["_other"];
            if (!type || !other) {
                continue;
            }
            const longName = other.replace(/[Ss]tandard/, "{c}");
            const zoneNames = type.split(/ /g);
            for (let i = 0; i < zoneNames.length; i++) {
                const zoneName = zoneNames[i];
                const modern = backwardsMap[zoneName];
                if (modern && outZones[modern]) {
                    outZones[modern].n = longName;
                }
                if (outZones[zoneName]) {
                    outZones[zoneName].n = longName;
                }
            }
        }

        // CLDR often lists only the modern zone id. Copy `n` onto geographic
        // Link aliases that still lack a display name (Montreal←Toronto).
        // Skip POSIX ids (EST must not become "SA Pacific {c} Time").
        // Skip cross-country consolidations (America/Atikokan←Panama,
        // Iceland←Abidjan, Pacific/Chuuk←Port_Moresby, …): the alias's home
        // country (zone.tab / COUNTRY_EXCEPTIONS / BACKWARDS_EXCEPTIONS) must
        // match the target's country.
        for (const oldzone of Object.keys(backwardsMap)) {
            if (POSIX_ZONE_IDS.has(oldzone)) {
                continue;
            }
            const newzone = backwardsMap[oldzone];
            const aliasCc =
                BACKWARDS_EXCEPTIONS[oldzone] || countries[oldzone];
            const targetCc = countries[newzone];
            if (
                aliasCc !== undefined &&
                targetCc !== undefined &&
                aliasCc !== targetCc
            ) {
                continue;
            }
            if (
                outZones[oldzone] &&
                outZones[newzone] &&
                outZones[newzone].n &&
                !outZones[oldzone].n
            ) {
                outZones[oldzone].n = outZones[newzone].n;
            }
        }

        const countryToZones: Record<string, string[]> = {};
        for (const cc of Object.keys(countryToZonesSets)) {
            countryToZones[cc] = Array.from(countryToZonesSets[cc]).sort();
        }

        const rootTimezone: LocaleTimezoneInfo = { timezone: "Etc/UTC" };
        const countryTimezones: Record<string, LocaleTimezoneInfo> = {};
        for (const cc of Object.keys(countryToZones)) {
            // Prefer a zone.tab primary so exception aliases that sort first
            // (Atlantic/Jan_Mayen before Europe/Oslo) do not become the
            // country default.
            const tabPrimaries = countryToZones[cc].filter((z) =>
                zoneTabIds.has(z)
            );
            let countryZoneID =
                tabPrimaries.length > 0
                    ? tabPrimaries[0]
                    : countryToZones[cc][0];
            // Follow same-country renames only (e.g. America/Godthab →
            // America/Nuuk, Europe/Kiev → Europe/Kyiv). Do NOT follow IANA
            // consolidations onto another country's zone (America/Antigua →
            // America/Puerto_Rico, Africa/Luanda → Africa/Lagos): und/<CC>/
            // timezone.jf must stay a country-local zone id.
            const modernId = backwardsMap[countryZoneID];
            if (
                modernId !== undefined &&
                countryToZones[cc].indexOf(modernId) !== -1
            ) {
                countryZoneID = modernId;
            }
            countryTimezones[cc] = {
                timezone:
                    DEFAULT_TIMEZONE_ID[cc] !== undefined
                        ? DEFAULT_TIMEZONE_ID[cc]
                        : countryZoneID,
            };
        }

        return {
            zones: outZones,
            countryToZones,
            rootTimezone,
            countryTimezones,
        };
    }
}
