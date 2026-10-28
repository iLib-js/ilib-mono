/*
 * ZoneInfoPipeline.ts - compile, enrich, and write timezone locale data
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

import * as path from "path";

import { LocaleDataWriter } from "./LocaleDataWriter";
import type { WindowsZonesData } from "./types";
import { ZoneInfoCompiler } from "./ZoneInfoCompiler";
import { ZoneInfoEnricher } from "./ZoneInfoEnricher";

/**
 * Options for {@link ZoneInfoPipeline}.
 */
export interface ZoneInfoPipelineOptions {
    /**
     * Directory containing unpacked IANA tzdata sources.
     */
    srcDir: string;

    /**
     * Locale data root where `zoneinfo/`, `timezone.jf`, and `und/`
     * will be written.
     */
    localeDir: string;

    /**
     * When true, emit progress messages to stdout.
     */
    verbose?: boolean;

    /**
     * When true, skip enrichment and write only raw compiler zone JSON
     * under `localeDir/zoneinfo/`.
     */
    compileOnly?: boolean;

    /**
     * Optional CLDR windowsZones data passed through to the enricher.
     */
    windowsZones?: WindowsZonesData;
}

/**
 * Summary of a successful pipeline run.
 */
export interface PipelineResult {
    /** Number of zone JSON files written. */
    zoneCount: number;
    /** Absolute path to the locale root. */
    localeDir: string;
    /** Whether enrichment was skipped. */
    compileOnly: boolean;
}

/**
 * Orchestrates {@link ZoneInfoCompiler} → {@link ZoneInfoEnricher} →
 * {@link LocaleDataWriter} so timezone locale data is written once.
 */
export class ZoneInfoPipeline {
    private readonly srcDir: string;
    private readonly localeDir: string;
    private readonly verbose: boolean;
    private readonly compileOnly: boolean;
    private readonly windowsZones: WindowsZonesData | undefined;

    /**
     * @param options Pipeline configuration
     */
    constructor(options: ZoneInfoPipelineOptions) {
        if (!options || !options.srcDir || !options.localeDir) {
            throw new Error("srcDir and localeDir are required");
        }
        this.srcDir = options.srcDir;
        this.localeDir = options.localeDir;
        this.verbose = Boolean(options.verbose);
        this.compileOnly = Boolean(options.compileOnly);
        this.windowsZones = options.windowsZones;
    }

    /**
     * Run compile → (optional enrich) → write.
     *
     * @returns Summary of the run
     * @throws Error when `srcDir` is missing or not a directory
     * @throws Error when enrichment runs and `zone.tab` is missing
     * @throws Error when `localeDir` exists but is not a directory
     */
    run(): PipelineResult {
        const compiled = new ZoneInfoCompiler({
            srcDir: this.srcDir,
            verbose: this.verbose,
        }).compile();

        const writer = new LocaleDataWriter({
            localeDir: this.localeDir,
            verbose: this.verbose,
        });

        if (this.compileOnly) {
            const zoneCount = writer.writeZonesOnly(compiled.zones);
            return {
                zoneCount,
                localeDir: path.resolve(this.localeDir),
                compileOnly: true,
            };
        }

        const enriched = new ZoneInfoEnricher({
            tzDataDir: this.srcDir,
            verbose: this.verbose,
            windowsZones: this.windowsZones,
        }).enrich(compiled.zones);

        const result = writer.write(enriched);
        return {
            zoneCount: result.zoneCount,
            localeDir: result.localeDir,
            compileOnly: false,
        };
    }
}
