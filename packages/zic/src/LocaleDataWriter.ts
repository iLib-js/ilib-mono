/*
 * LocaleDataWriter.ts - write enriched timezone locale data once
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

import * as fs from "fs";
import * as path from "path";

import stringify from "json-stable-stringify";
import { Utils } from "ilib-data-utils";

import type { EnrichedTzData, ZoneInfo } from "./types";

/**
 * Options for {@link LocaleDataWriter}.
 */
export interface LocaleDataWriterOptions {
    /**
     * Locale data root directory (parent of `zoneinfo/`, also receives
     * `timezone.jf` and `und/<CC>/timezone.jf`).
     */
    localeDir: string;

    /**
     * When true, emit progress messages to stdout.
     */
    verbose?: boolean;
}

/**
 * Summary of a successful write.
 */
export interface WriteResult {
    /** Number of per-zone JSON files written under `zoneinfo/`. */
    zoneCount: number;
    /** Number of `und/<CC>/timezone.jf` files written. */
    countryTimezoneCount: number;
    /** Absolute path to the locale root. */
    localeDir: string;
}

/**
 * Writes enriched timezone data to an ilib locale directory tree.
 *
 * Output layout matches `ilib/js/data/locale`:
 * - `zoneinfo/<Continent>/<City>.json`
 * - `zoneinfo/zonetab.json`
 * - `timezone.jf`
 * - `und/<CC>/timezone.jf`
 *
 * JSON is pretty-printed with 4-space indent and stable key ordering
 * (via `json-stable-stringify`).
 */
export class LocaleDataWriter {
    private readonly localeDir: string;
    private readonly verbose: boolean;

    /**
     * @param options Writer configuration
     */
    constructor(options: LocaleDataWriterOptions) {
        if (!options || !options.localeDir) {
            throw new Error("localeDir is required");
        }
        this.localeDir = options.localeDir;
        this.verbose = Boolean(options.verbose);
    }

    /**
     * Persist a full enriched model under {@link LocaleDataWriterOptions.localeDir}.
     *
     * @param data Enriched zones and metadata from {@link ZoneInfoEnricher}
     * @returns Write summary
     * @throws Error when `data` is null/undefined/not an object, or when
     *     `zones`, `countryToZones`, `rootTimezone`, or `countryTimezones`
     *     are missing
     * @throws Error when `localeDir` exists but is not a directory
     */
    write(data: EnrichedTzData): WriteResult {
        if (data === null || data === undefined || typeof data !== "object") {
            throw new Error("data must be an object");
        }
        if (data.zones === undefined) {
            throw new Error("data.zones is required");
        }
        if (data.countryToZones === undefined) {
            throw new Error("data.countryToZones is required");
        }
        if (data.rootTimezone === undefined) {
            throw new Error("data.rootTimezone is required");
        }
        if (data.countryTimezones === undefined) {
            throw new Error("data.countryTimezones is required");
        }

        const localeDir = this.ensureLocaleDir();
        const zoneinfoDir = path.join(localeDir, "zoneinfo");
        Utils.makeDirs(zoneinfoDir);

        let zoneCount = 0;
        for (const zoneId of Object.keys(data.zones)) {
            this.writeJsonFile(
                path.join(zoneinfoDir, zoneId + ".json"),
                data.zones[zoneId]
            );
            zoneCount++;
        }

        this.writeJsonFile(
            path.join(zoneinfoDir, "zonetab.json"),
            data.countryToZones
        );
        this.writeJsonFile(
            path.join(localeDir, "timezone.jf"),
            data.rootTimezone
        );

        let countryTimezoneCount = 0;
        for (const cc of Object.keys(data.countryTimezones)) {
            const dir = path.join(localeDir, "und", cc);
            Utils.makeDirs(dir);
            this.writeJsonFile(
                path.join(dir, "timezone.jf"),
                data.countryTimezones[cc]
            );
            countryTimezoneCount++;
        }

        return {
            zoneCount,
            countryTimezoneCount,
            localeDir,
        };
    }

    /**
     * Persist compiler-only zone JSON under `localeDir/zoneinfo/`.
     *
     * Used by `--compile-only`: no `c`/`n`, no zonetab, no timezone.jf.
     *
     * @param zones Zone id → compiler output
     * @returns Number of zone files written
     * @throws Error when `zones` is null, undefined, or not an object
     * @throws Error when `localeDir` exists but is not a directory
     */
    writeZonesOnly(zones: Record<string, ZoneInfo>): number {
        if (zones === null || zones === undefined || typeof zones !== "object") {
            throw new Error("zones must be an object");
        }

        const localeDir = this.ensureLocaleDir();
        const zoneinfoDir = path.join(localeDir, "zoneinfo");
        Utils.makeDirs(zoneinfoDir);

        let count = 0;
        for (const zoneId of Object.keys(zones)) {
            this.writeJsonFile(
                path.join(zoneinfoDir, zoneId + ".json"),
                zones[zoneId]
            );
            count++;
        }
        return count;
    }

    /**
     * Resolve and validate the locale root directory.
     */
    private ensureLocaleDir(): string {
        const localeDir = path.resolve(this.localeDir);
        if (fs.existsSync(localeDir)) {
            if (!fs.statSync(localeDir).isDirectory()) {
                throw new Error(localeDir + " is not a directory");
            }
        } else {
            Utils.makeDirs(localeDir);
        }
        return localeDir;
    }

    /**
     * Write pretty-printed, stably keyed JSON.
     */
    private writeJsonFile(filePath: string, value: unknown): void {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            Utils.makeDirs(dir);
        }
        if (this.verbose) {
            console.log("Writing out " + filePath);
        }
        const text = stringify(value, { space: 4 }) ?? "{}";
        fs.writeFileSync(filePath, text, "utf-8");
    }
}
