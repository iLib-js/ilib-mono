/*
 * ZoneWriterFactory.ts - create ZoneWriter instances by output format
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

import { JsonZoneWriter } from "./JsonZoneWriter";
import { ZoneWriter } from "./ZoneWriter";

/**
 * Create a {@link ZoneWriter} for the given output format.
 *
 * @param type Output format name (currently only `"json"`)
 * @param outputDir Directory to write zone files into
 * @param verbose Whether to log progress
 * @returns A writer, or `null` if the type is unsupported
 */
export function createZoneWriter(
    type: string,
    outputDir: string,
    verbose = false
): ZoneWriter | null {
    if (type.toLowerCase() === "json") {
        return new JsonZoneWriter(outputDir, verbose);
    }
    return null;
}
