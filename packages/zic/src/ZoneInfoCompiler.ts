/*
 * ZoneInfoCompiler.ts - compile IANA tzdata into in-memory zoneinfo JSON
 *
 * Copyright © 2014, 2026 JEDLSoft
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

import { RuleSet } from "./RuleSet";
import type { ZoneInfo } from "./types";
import { Zone } from "./Zone";
import { ZoneInfoFile } from "./ZoneInfoFile";

/**
 * Options for {@link ZoneInfoCompiler}.
 */
export interface ZoneInfoCompilerOptions {
    /**
     * Directory containing unpacked IANA tzdata source files
     * (for example `africa`, `europe`, `northamerica`).
     */
    srcDir: string;

    /**
     * When true, emit progress messages to stdout.
     */
    verbose?: boolean;

    /**
     * When true (default), only emit the currently applicable offset and
     * DST rules for each zone, not historical offsets.
     */
    currentOnly?: boolean;
}

/**
 * In-memory result of a successful compile run.
 *
 * No files are written; use {@link LocaleDataWriter} after enrichment.
 */
export interface CompileResult {
    /** Zone id → compiler JSON (`o`, `f`, optional `s`/`e`). */
    zones: Record<string, ZoneInfo>;

    /** Number of zones in {@link CompileResult.zones}. */
    zoneCount: number;
}

/**
 * Compiles IANA tzdata zone sources into an in-memory zoneinfo map.
 *
 * TypeScript port of the Java tool in `com.ilib.tools.zic.ZoneInfoCompiler`
 * from the monolithic ilib package. Writing is intentionally separate so
 * enrichment can run before any disk I/O.
 */
export class ZoneInfoCompiler {
    private readonly srcDir: string;

    /**
     * When true, emit progress messages to stdout.
     */
    private readonly verbose: boolean;
    private readonly currentOnly: boolean;

    /**
     * Create a new compiler instance.
     *
     * @param options Source directory and compile flags
     */
    constructor(options: ZoneInfoCompilerOptions) {
        if (!options || !options.srcDir) {
            throw new Error("srcDir is required");
        }
        this.srcDir = options.srcDir;
        this.verbose = Boolean(options.verbose);
        this.currentOnly =
            options.currentOnly === undefined ? true : Boolean(options.currentOnly);
    }

    /**
     * Parse tzdata sources and return zone JSON in memory.
     *
     * Does not create directories or write files. Zones whose
     * `getJson(currentOnly)` returns `null` are omitted.
     *
     * @returns Compiled zone map and count
     * @throws Error when `srcDir` is missing or is not a directory
     */
    compile(): CompileResult {
        const infoDir = path.resolve(this.srcDir);

        if (this.verbose) {
            console.log("Reading zone info directory: " + infoDir);
            console.log("Only output current rules: " + this.currentOnly);
        }

        if (!fs.existsSync(infoDir) || !fs.statSync(infoDir).isDirectory()) {
            throw new Error(infoDir + " is not a directory.");
        }

        const zones = new Map<string, Zone>();
        const ruleSets = new Map<string, RuleSet>();

        const infoFiles = fs.readdirSync(infoDir);
        for (const name of infoFiles) {
            // skip files with extensions — they are not zone info files
            if (name.indexOf(".") !== -1) {
                continue;
            }
            const filePath = path.join(infoDir, name);
            if (!fs.statSync(filePath).isFile()) {
                continue;
            }
            try {
                const zif = new ZoneInfoFile(filePath);
                zif.parse(zones, ruleSets);
                zif.close();
            } catch (e) {
                if (this.verbose) {
                    console.warn(
                        "Skipping file " +
                            filePath +
                            ": " +
                            (e instanceof Error ? e.message : e)
                    );
                }
            }
        }

        const resultZones: Record<string, ZoneInfo> = {};
        for (const [zoneName, zone] of zones) {
            if (!zoneName) {
                continue;
            }
            const json = zone.getJson(this.currentOnly);
            if (json !== null) {
                resultZones[zoneName] = json as unknown as ZoneInfo;
            }
        }

        return {
            zones: resultZones,
            zoneCount: Object.keys(resultZones).length,
        };
    }
}
