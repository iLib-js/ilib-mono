/*
 * Zone.ts - models a particular time zone and its offset history
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

import { Offset } from "./Offset";
import { ParseException } from "./ParseException";
import { RuleSet } from "./RuleSet";

/**
 * Models a political time zone: a named sequence of GMT offsets and
 * daylight-savings rule references from approximately 1970 to present.
 */
export class Zone {
    /**
     * IANA zone id (for example `"America/New_York"`), or `null` when
     * this instance was constructed empty.
     */
    name: string | null = null;

    /**
     * Historical and current GMT offsets for this zone, in the order they
     * appeared in the source file until sorted by callers.
     */
    private offsets: Offset[] = [];

    /**
     * Create an empty zone, or parse the first `Zone` line of a zone
     * definition.
     *
     * @param line Full `Zone …` line from tzdata; omit for an empty zone
     * @param ruleSets Shared map of named rule sets (mutated when offsets
     *     reference unknown rule names)
     * @throws {ParseException} If `line` does not have enough fields
     */
    constructor(line?: string, ruleSets?: Map<string, RuleSet>) {
        if (line === undefined || ruleSets === undefined) {
            return;
        }

        const fields = line.split(/[ \t]+/);

        if (fields.length < 5) {
            throw new ParseException(
                "Bad zone definition. Not enough fields (" +
                    fields.length +
                    ") in " +
                    line
            );
        }

        if (fields[1].length > 0) {
            this.name = fields[1];
        }

        // strip the leading "Zone" token (5 chars including the separator
        // when the line starts with "Zone "); Offset.setFields then treats
        // fields[1] as the numeric offset (fields[0] is the zone name).
        const offset = new Offset(line.substring(5).trim(), ruleSets, this.name || "");
        this.offsets.push(offset);
    }

    /**
     * @returns The IANA zone id, or `null` if unset
     */
    getName(): string | null {
        return this.name;
    }

    /**
     * Append a continuation-line offset to this zone's history.
     *
     * @param offset Offset parsed from a continuation line
     */
    addOffset(offset: Offset): void {
        this.offsets.push(offset);
    }

    /**
     * Return the offset that is currently in effect (latest / undated).
     *
     * @returns The chronologically last offset
     */
    getCurrentOffset(): Offset {
        const sorted = this.offsets.slice().sort((a, b) => a.compareTo(b));
        return sorted[sorted.length - 1];
    }

    /**
     * @returns The live internal list of offsets (not a copy)
     */
    getOffsets(): Offset[] {
        return this.offsets;
    }

    /**
     * Build the JSON payload for this zone.
     *
     * When `currentOnly` is true, returns the current offset's JSON.
     * Historical mode is not implemented and returns `null`.
     *
     * @param currentOnly Whether to emit only the current offset
     * @returns Zone JSON object, or `null` when historical mode is requested
     */
    getJson(currentOnly: boolean): Record<string, unknown> | null {
        if (currentOnly) {
            const offset = this.getCurrentOffset();
            return offset.getJson(currentOnly);
        }
        return null;
    }
}
