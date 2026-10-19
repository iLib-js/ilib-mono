/*
 * ZoneWriter.ts - abstract writer for compiled zone info
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

import { Zone } from "./Zone";

/**
 * Base type for writers that emit compiled zone info.
 */
export abstract class ZoneWriter {
    /**
     * Write all zones from the map to the configured output.
     *
     * @param zones Map of zone id to {@link Zone}
     * @param currentOnly When true, emit only the currently applicable
     *     offset and DST rules for each zone
     * @returns Number of named zones processed
     */
    abstract writeZones(
        zones: Map<string, Zone>,
        currentOnly: boolean
    ): number;
}
