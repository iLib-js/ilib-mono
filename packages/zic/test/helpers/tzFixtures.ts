/*
 * tzFixtures.ts - shared temp-dir helpers for timezone pipeline tests
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
import * as os from "os";
import * as path from "path";

import type { WindowsZonesData, ZoneInfo } from "../../src/types";

/**
 * Create a unique temp directory for a test.
 */
export function makeTempRoot(prefix = "ilib-zic-"): string {
    return fs.mkdtempSync(path.join(os.tmpdir(), prefix));
}

/**
 * Write a minimal tzdata directory with zone.tab, backward, and optional
 * extensionless zone source files.
 *
 * Default `zone.tab` / `backward` rows are a **hand-curated subset** of real
 * IANA tzdata (same columns and Link semantics as
 * https://www.iana.org/time-zones). Coordinates and zone ids were copied from
 * IANA-style lines for the zones the enricher tests need (US/FR/JP/CA/IS/FM
 * and the backwards aliases exercised by gentzinfo exceptions). This is not a
 * dump of a full release.
 *
 * `sources` (extensionless zone files) are supplied by each test when needed;
 * those strings are usually invented mini fixtures or excerpts patterned on
 * `samples/cli/data` (itself excerpted from tzdata2026e).
 */
export function writeTzDataDir(
    root: string,
    options: {
        zoneTab?: string;
        backward?: string;
        sources?: Record<string, string>;
    } = {}
): string {
    const tzDataDir = path.join(root, "tzdata");
    fs.mkdirSync(tzDataDir, { recursive: true });

    // Curated from IANA zone.tab (country, coords, zone id) — not generated.
    fs.writeFileSync(
        path.join(tzDataDir, "zone.tab"),
        options.zoneTab ??
            [
                "# country\tcoords\tzone",
                "US\t+404251-0740023\tAmerica/New_York",
                "FR\t+4852+00220\tEurope/Paris",
                "JP\t+353916+1394441\tAsia/Tokyo",
                "BR\t-2332-04637\tAmerica/Sao_Paulo",
                "CA\t+4339-07923\tAmerica/Toronto",
                "IS\t+6409-02151\tAtlantic/Reykjavik",
                "FM\t+0725+15147\tPacific/Pohnpei",
            ].join("\n") + "\n",
        "utf-8"
    );

    // Curated from IANA `backward` Link lines (Target ← Link-Name).
    // Chosen to cover COUNTRY_EXCEPTIONS / BACKWARDS_EXCEPTIONS paths.
    fs.writeFileSync(
        path.join(tzDataDir, "backward"),
        options.backward ??
            [
                "# Link\tTarget\tLink-Name",
                "Link\tAmerica/Toronto\tAmerica/Coral_Harbour",
                "Link\tAtlantic/Reykjavik\tIceland",
                "Link\tPacific/Pohnpei\tPacific/Ponape",
                "Link\tAmerica/New_York\tUS/Eastern",
            ].join("\n") + "\n",
        "utf-8"
    );

    if (options.sources) {
        for (const [name, contents] of Object.entries(options.sources)) {
            fs.writeFileSync(path.join(tzDataDir, name), contents, "utf-8");
        }
    }

    return tzDataDir;
}

/**
 * In-memory compiler output for enricher/writer tests (no disk compile).
 *
 * **Provenance:** hand-built fixtures, not a verbatim extract.
 *
 * - Shape and field names match ilib zoneinfo JSON (`o`/`f`/`s`/`e`) as in
 *   `~/src/ilib/js/data/locale/zoneinfo` (e.g. America/New_York, Europe/Paris,
 *   Asia/Tokyo). Values for NY/Paris/Tokyo were patterned on those checked-in
 *   files (and on what `Zone.getJson` emits), then simplified where tests do
 *   not need full DST detail.
 * - `America/Sao_Paulo` is the `%z` example: tzdata main form uses FORMAT `%z`;
 *   after compile, `f` is the expanded numeric slash form `-03/-02` (same as
 *   checked-in ilib zoneinfo / zic `abbroffset`).
 * - Extra zones (Toronto, Coral_Harbour, Iceland, Ponape, US/Eastern, etc.)
 *   are stubs with plausible `o`/`f` only, invented so enricher tests can
 *   cover backwards aliases and country exceptions without compiling full
 *   tzdata.
 */
export function sampleCompiledZones(): Record<string, ZoneInfo> {
    return {
        // Patterned on checked-in ilib zoneinfo for America/New_York.json
        "America/New_York": {
            o: "-5:0",
            f: "E{c}T",
            s: { c: "D", m: 3, r: "0>8", t: "2:0", v: "1:0" },
            e: { c: "S", m: 11, r: "0>1", t: "2:0" },
        },
        // Patterned on checked-in Europe/Paris.json (simplified)
        "Europe/Paris": {
            o: "1:0",
            f: "CE{c}T",
            s: { c: "S", m: 3, r: "l0", t: "2:0", v: "1:0" },
            e: { m: 10, r: "l0", t: "3:0" },
        },
        // Patterned on checked-in Asia/Tokyo.json
        "Asia/Tokyo": {
            o: "9:0",
            f: "JST",
        },
        // %z case: tzdata FORMAT was "%z"; compiled f is numeric std/DST
        // (patterned on checked-in America/Sao_Paulo.json / tzdata2026e)
        "America/Sao_Paulo": {
            o: "-3:0",
            f: "-03/-02",
            s: { m: 10, r: "0>15", t: "0:0", v: "1:0" },
            e: { m: 2, r: "0>15", t: "0:0" },
        },
        // Stubs below: invented for enricher coverage (real zone ids, minimal fields)
        "America/Toronto": {
            o: "-5:0",
            f: "E{c}T",
        },
        "America/Coral_Harbour": {
            o: "-5:0",
            f: "E{c}T",
        },
        "Atlantic/Reykjavik": {
            o: "0:0",
            f: "GMT",
        },
        Iceland: {
            o: "0:0",
            f: "GMT",
        },
        "Pacific/Pohnpei": {
            o: "11:0",
            f: "+11",
        },
        "Pacific/Ponape": {
            o: "11:0",
            f: "+11",
        },
        "US/Eastern": {
            o: "-5:0",
            f: "E{c}T",
        },
        "Etc/UTC": {
            o: "0:0",
            f: "UTC",
        },
    };
}

/**
 * Minimal CLDR windowsZones fixture for gentzinfo-style `n` assignment.
 *
 * **Provenance:** hand-built, not loaded from `cldr-core`. Display names and
 * zone lists mirror real CLDR `windowsZones.json` entries (e.g. "Eastern
 * Standard Time" → America/New_York). Both `@other`/`@type` and
 * `_other`/`_type` spellings are included on purpose so tests cover the two
 * attribute styles gentzinfo accepts. Production code loads the full file
 * from `cldr-core` when `windowsZones` is omitted.
 */
export function sampleWindowsZones(): WindowsZonesData {
    return {
        supplemental: {
            windowsZones: {
                mapTimezones: [
                    {
                        mapZone: {
                            "@other": "Eastern Standard Time",
                            "@type": "America/New_York US/Eastern",
                        },
                    },
                    {
                        // `_` attribute style (same data as CLDR XML→JSON alt form)
                        mapZone: {
                            "_other": "W. Europe Standard Time",
                            "_type": "Europe/Paris",
                        },
                    },
                    {
                        mapZone: {
                            "@other": "Tokyo Standard Time",
                            "@type": "Asia/Tokyo",
                        },
                    },
                    {
                        mapZone: {
                            "@other": "E. South America Standard Time",
                            "@type": "America/Sao_Paulo",
                        },
                    },
                    {
                        mapZone: {
                            "@other": "UTC",
                            "@type": "Etc/UTC",
                        },
                    },
                ],
            },
        },
    };
}
