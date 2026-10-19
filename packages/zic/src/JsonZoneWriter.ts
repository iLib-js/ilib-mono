/*
 * JsonZoneWriter.ts - write compiled zone info as JSON files
 *
 * Copyright © 2014, 2020, 2026 JEDLSoft
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

import { Zone } from "./Zone";
import { ZoneWriter } from "./ZoneWriter";

/**
 * Writes one JSON file per zone under the configured output directory.
 */
export class JsonZoneWriter extends ZoneWriter {
    /**
     * Root directory under which zone JSON files are written
     * (for example `America/New_York.json` relative to this path).
     */
    private readonly outputDir: string;

    /**
     * When true, log progress and warnings to the console.
     */
    private readonly verbose: boolean;

    /**
     * @param outputDir Directory to write zone JSON files into
     * @param verbose Whether to log progress
     */
    constructor(outputDir: string, verbose = false) {
        super();
        this.outputDir = outputDir;
        this.verbose = verbose;
    }

    /**
     * Write a single zone's JSON payload to disk.
     *
     * Creates parent directories as needed. Does nothing when `json` is
     * `null` (optionally warning when verbose).
     *
     * @param zoneName IANA zone id (path segments separated by `/`)
     * @param json Zone payload to serialize, or `null` to skip
     */
    writeZone(zoneName: string, json: Record<string, unknown> | null): void {
        if (json === null) {
            if (this.verbose) {
                console.warn("Zone " + zoneName + " has no json.");
            }
            return;
        }
        const file = path.join(this.outputDir, zoneName + ".json");
        const dir = path.dirname(file);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        if (this.verbose) {
            console.log("Writing output file " + file);
        }
        fs.writeFileSync(file, JSON.stringify(json, null, 4), "utf-8");
    }

    /**
     * Write every named zone in the map.
     *
     * Empty zone names are skipped and do not count toward the return value.
     *
     * @param zones Map of zone id to {@link Zone}
     * @param currentOnly Passed through to {@link Zone.getJson}
     * @returns Number of named zones processed
     */
    writeZones(zones: Map<string, Zone>, currentOnly: boolean): number {
        let count = 0;
        for (const [zoneName, zone] of zones) {
            if (zoneName && zoneName.length > 0) {
                if (this.verbose) {
                    console.log("Processing zone " + zoneName);
                }
                this.writeZone(zoneName, zone.getJson(currentOnly));
                count++;
            }
        }
        return count;
    }
}
