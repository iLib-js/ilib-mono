/*
 * ZoneInfoEnricher.test.ts - unit tests for ZoneInfoEnricher
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

import { ZoneInfoEnricher } from "../src/ZoneInfoEnricher";
import type { ZoneInfo } from "../src/types";
import {
    makeTempRoot,
    sampleCompiledZones,
    sampleWindowsZones,
    writeTzDataDir,
} from "./helpers/tzFixtures";

describe("ZoneInfoEnricher", () => {
    let root: string;
    let tzDataDir: string;

    beforeEach(() => {
        root = makeTempRoot("zic-enrich-");
        tzDataDir = writeTzDataDir(root);
    });

    afterEach(() => {
        fs.rmSync(root, { recursive: true, force: true });
    });

    function enrich(
        zones: Record<string, ZoneInfo> = sampleCompiledZones(),
        overrides: { tzDataDir?: string; verbose?: boolean } = {}
    ) {
        return new ZoneInfoEnricher({
            tzDataDir: overrides.tzDataDir ?? tzDataDir,
            verbose: overrides.verbose,
            windowsZones: sampleWindowsZones(),
        }).enrich(zones);
    }

    describe("negative cases", () => {
        test("requires an options object", () => {
            expect.assertions(2);
            expect(
                () =>
                    new ZoneInfoEnricher(
                        undefined as unknown as { tzDataDir: string }
                    )
            ).toThrow(/tzDataDir/);
            expect(
                () =>
                    new ZoneInfoEnricher(
                        null as unknown as { tzDataDir: string }
                    )
            ).toThrow(/tzDataDir/);
        });

        test("requires tzDataDir", () => {
            expect.assertions(2);
            expect(() => new ZoneInfoEnricher({ tzDataDir: "" })).toThrow(
                /tzDataDir/
            );
            expect(
                () =>
                    new ZoneInfoEnricher({
                        tzDataDir: undefined as unknown as string,
                    })
            ).toThrow(/tzDataDir/);
        });

        test("enrich throws when tzDataDir does not exist", () => {
            expect.assertions(1);
            const enricher = new ZoneInfoEnricher({
                tzDataDir: path.join(root, "missing"),
                windowsZones: sampleWindowsZones(),
            });
            expect(() => enricher.enrich({})).toThrow(
                /tzdata|directory|access/i
            );
        });

        test("enrich throws when tzDataDir is a file, not a directory", () => {
            expect.assertions(1);
            const filePath = path.join(root, "not-a-dir");
            fs.writeFileSync(filePath, "not a directory\n", "utf-8");
            const enricher = new ZoneInfoEnricher({
                tzDataDir: filePath,
                windowsZones: sampleWindowsZones(),
            });
            expect(() => enricher.enrich({})).toThrow(
                /tzdata|directory|access/i
            );
        });

        test("enrich throws when zone.tab is missing", () => {
            expect.assertions(1);
            const emptyTz = path.join(root, "no-zonetab");
            fs.mkdirSync(emptyTz);
            fs.writeFileSync(path.join(emptyTz, "backward"), "", "utf-8");
            const enricher = new ZoneInfoEnricher({
                tzDataDir: emptyTz,
                windowsZones: sampleWindowsZones(),
            });
            expect(() => enricher.enrich({})).toThrow(/zone\.tab/i);
        });

        test("enrich throws when backward is missing", () => {
            expect.assertions(1);
            const emptyTz = path.join(root, "no-backward");
            fs.mkdirSync(emptyTz);
            fs.writeFileSync(
                path.join(emptyTz, "zone.tab"),
                "US\t+404251-0740023\tAmerica/New_York\n",
                "utf-8"
            );
            const enricher = new ZoneInfoEnricher({
                tzDataDir: emptyTz,
                windowsZones: sampleWindowsZones(),
            });
            expect(() => enricher.enrich({})).toThrow(/backward/i);
        });

        test("enrich throws when zones argument is missing or not an object", () => {
            expect.assertions(3);
            const enricher = new ZoneInfoEnricher({
                tzDataDir,
                windowsZones: sampleWindowsZones(),
            });
            expect(() =>
                enricher.enrich(undefined as unknown as Record<string, ZoneInfo>)
            ).toThrow(/zones/i);
            expect(() =>
                enricher.enrich(null as unknown as Record<string, ZoneInfo>)
            ).toThrow(/zones/i);
            expect(() =>
                enricher.enrich("America/New_York" as unknown as Record<
                    string,
                    ZoneInfo
                >)
            ).toThrow(/zones/i);
        });
    });

    test("assigns country codes from zone.tab", () => {
        expect.assertions(3);
        const result = enrich();
        expect(result.zones["America/New_York"].c).toBe("US");
        expect(result.zones["Europe/Paris"].c).toBe("FR");
        expect(result.zones["Asia/Tokyo"].c).toBe("JP");
    });

    test("applies COUNTRY_EXCEPTIONS for zones missing from zone.tab", () => {
        expect.assertions(1);
        const result = enrich();
        expect(result.zones["America/Coral_Harbour"].c).toBe("CA");
    });

    test("resolves country for backwards aliases via the modern target", () => {
        expect.assertions(1);
        const result = enrich();
        // US/Eastern → America/New_York → US
        expect(result.zones["US/Eastern"].c).toBe("US");
    });

    test("leaves zones without a resolvable country without c", () => {
        expect.assertions(1);
        const zones = sampleCompiledZones();
        zones["Fake/Nowhere"] = { o: "0:0", f: "X" };
        const result = enrich(zones);
        expect(result.zones["Fake/Nowhere"].c).toBeUndefined();
    });

    test("does not mutate the input zones object or its values", () => {
        expect.assertions(3);
        const zones = sampleCompiledZones();
        const before = JSON.stringify(zones["America/New_York"]);
        const result = enrich(zones);

        expect(zones["America/New_York"]).toEqual(JSON.parse(before));
        expect(result.zones["America/New_York"]).not.toBe(
            zones["America/New_York"]
        );
        expect(result.zones["America/New_York"].c).toBe("US");
    });

    test("sets Windows long names with Standard replaced by {c}", () => {
        expect.assertions(3);
        const result = enrich();
        expect(result.zones["America/New_York"].n).toBe("Eastern {c} Time");
        expect(result.zones["Europe/Paris"].n).toBe("W. Europe {c} Time");
        expect(result.zones["Asia/Tokyo"].n).toBe("Tokyo {c} Time");
    });

    test("applies Windows names to both listed and backwards-linked zone ids", () => {
        expect.assertions(2);
        const result = enrich();
        expect(result.zones["America/New_York"].n).toBe("Eastern {c} Time");
        expect(result.zones["US/Eastern"].n).toBe("Eastern {c} Time");
    });

    test("copies Windows n from modern target onto Link aliases not listed in CLDR", () => {
        expect.assertions(2);
        // Real CLDR lists America/Toronto but not America/Montreal (a Link).
        // Montreal must still get the same display name as Toronto.
        const customTz = writeTzDataDir(path.join(root, "lost-n"), {
            zoneTab: "CA\t+4339-07923\tAmerica/Toronto\n",
            backward: "Link\tAmerica/Toronto\tAmerica/Montreal\n",
        });
        const windowsZones = {
            supplemental: {
                windowsZones: {
                    mapTimezones: [
                        {
                            mapZone: {
                                "@other": "Eastern Standard Time",
                                "@type": "America/Toronto",
                            },
                        },
                    ],
                },
            },
        };
        const result = new ZoneInfoEnricher({
            tzDataDir: customTz,
            windowsZones,
        }).enrich({
            "America/Toronto": { o: "-5:0", f: "E{c}T" },
            "America/Montreal": { o: "-5:0", f: "E{c}T" },
        });

        expect(result.zones["America/Toronto"].n).toBe("Eastern {c} Time");
        expect(result.zones["America/Montreal"].n).toBe("Eastern {c} Time");
    });

    test("does not copy Windows n across countries for cross-country Link aliases", () => {
        // Real IANA consolidations: alias stays associated with its home
        // country (zone.tab / COUNTRY_EXCEPTIONS / BACKWARDS_EXCEPTIONS) but
        // Links onto another country's zone. Must not inherit that target's
        // Windows display name.
        expect.assertions(9);
        const customTz = writeTzDataDir(path.join(root, "cross-n"), {
            zoneTab: [
                "CA\t+484531-0913718\tAmerica/Atikokan",
                "CA\t+4339-07923\tAmerica/Toronto",
                "CI\t+0519-00402\tAfrica/Abidjan",
                "DE\t+5230+01322\tEurope/Berlin",
                "ER\t+1520+03853\tAfrica/Asmara",
                "FM\t+0725+15147\tPacific/Chuuk",
                "FM\t+0658+15813\tPacific/Pohnpei",
                "IS\t+6409-02151\tAtlantic/Reykjavik",
                "KE\t-0117+03649\tAfrica/Nairobi",
                "NO\t+5955+01045\tEurope/Oslo",
                "PA\t+0858-07932\tAmerica/Panama",
                "PG\t-0930+14710\tPacific/Port_Moresby",
                "PR\t+182806-0660622\tAmerica/Puerto_Rico",
                "SB\t-0932+16012\tPacific/Guadalcanal",
            ].join("\n"),
            backward: [
                "Link\tAfrica/Nairobi\tAfrica/Asmara",
                "Link\tAmerica/Panama\tAmerica/Atikokan",
                "Link\tAmerica/Puerto_Rico\tAmerica/Virgin",
                "Link\tEurope/Berlin\tAtlantic/Jan_Mayen",
                "Link\tAfrica/Abidjan\tIceland",
                "Link\tPacific/Port_Moresby\tPacific/Chuuk",
                "Link\tPacific/Guadalcanal\tPacific/Pohnpei",
                "Link\tPacific/Port_Moresby\tPacific/Yap",
                // same-country control: still copies
                "Link\tAmerica/Toronto\tAmerica/Montreal",
            ].join("\n"),
        });
        const windowsZones = {
            supplemental: {
                windowsZones: {
                    mapTimezones: [
                        {
                            mapZone: {
                                "@other": "E. Africa Standard Time",
                                "@type": "Africa/Nairobi",
                            },
                        },
                        {
                            mapZone: {
                                "@other": "SA Pacific Standard Time",
                                "@type": "America/Panama",
                            },
                        },
                        {
                            mapZone: {
                                "@other": "SA Western Standard Time",
                                "@type": "America/Puerto_Rico",
                            },
                        },
                        {
                            mapZone: {
                                "@other": "W. Europe Standard Time",
                                "@type": "Europe/Berlin",
                            },
                        },
                        {
                            mapZone: {
                                "@other": "Greenwich Standard Time",
                                "@type": "Africa/Abidjan",
                            },
                        },
                        {
                            mapZone: {
                                "@other": "West Pacific Standard Time",
                                "@type": "Pacific/Port_Moresby",
                            },
                        },
                        {
                            mapZone: {
                                "@other": "Central Pacific Standard Time",
                                "@type": "Pacific/Guadalcanal",
                            },
                        },
                        {
                            mapZone: {
                                "@other": "Eastern Standard Time",
                                "@type": "America/Toronto",
                            },
                        },
                    ],
                },
            },
        };
        const zones: Record<string, ZoneInfo> = {
            "Africa/Nairobi": { o: "3:0", f: "EAT" },
            "Africa/Asmara": { o: "3:0", f: "EAT" },
            "America/Panama": { o: "-5:0", f: "EST" },
            "America/Atikokan": { o: "-5:0", f: "EST" },
            "America/Puerto_Rico": { o: "-4:0", f: "AST" },
            "America/Virgin": { o: "-4:0", f: "AST" },
            "Europe/Berlin": { o: "1:0", f: "CE{c}T" },
            "Atlantic/Jan_Mayen": { o: "1:0", f: "CE{c}T" },
            "Africa/Abidjan": { o: "0:0", f: "GMT" },
            Iceland: { o: "0:0", f: "GMT" },
            "Pacific/Port_Moresby": { o: "10:0", f: "+10" },
            "Pacific/Chuuk": { o: "10:0", f: "+10" },
            "Pacific/Yap": { o: "10:0", f: "+10" },
            "Pacific/Guadalcanal": { o: "11:0", f: "+11" },
            "Pacific/Pohnpei": { o: "11:0", f: "+11" },
            "America/Toronto": { o: "-5:0", f: "E{c}T" },
            "America/Montreal": { o: "-5:0", f: "E{c}T" },
            "Europe/Oslo": { o: "1:0", f: "CE{c}T" },
            "Atlantic/Reykjavik": { o: "0:0", f: "GMT" },
        };
        const result = new ZoneInfoEnricher({
            tzDataDir: customTz,
            windowsZones,
        }).enrich(zones);

        // Cross-country: must NOT inherit target's Windows name
        expect(result.zones["Africa/Asmara"].n).toBeUndefined();
        expect(result.zones["America/Atikokan"].n).toBeUndefined();
        expect(result.zones["America/Virgin"].n).toBeUndefined();
        expect(result.zones["Atlantic/Jan_Mayen"].n).toBeUndefined();
        expect(result.zones.Iceland.n).toBeUndefined();
        expect(result.zones["Pacific/Chuuk"].n).toBeUndefined();
        expect(result.zones["Pacific/Pohnpei"].n).toBeUndefined();
        expect(result.zones["Pacific/Yap"].n).toBeUndefined();
        // Same-country control still copies
        expect(result.zones["America/Montreal"].n).toBe("Eastern {c} Time");
    });

    test("does not assign country c to POSIX Link ids (EST), but does for NZ-style aliases", () => {
        expect.assertions(4);
        // IANA: Link America/Panama EST — must not pick up Panama's country.
        // Link Pacific/Auckland NZ — still inherits NZ (legacy alias, not POSIX).
        const customTz = writeTzDataDir(path.join(root, "gained-c"), {
            zoneTab: [
                "PA\t+0858-07932\tAmerica/Panama",
                "CA\t+4339-07923\tAmerica/Toronto",
                "NZ\t-3652+17446\tPacific/Auckland",
            ].join("\n"),
            backward: [
                "Link\tAmerica/Panama\tEST",
                "Link\tAmerica/Toronto\tAmerica/Montreal",
                "Link\tPacific/Auckland\tNZ",
            ].join("\n"),
        });
        const result = new ZoneInfoEnricher({
            tzDataDir: customTz,
            windowsZones: sampleWindowsZones(),
        }).enrich({
            "America/Panama": { o: "-5:0", f: "EST" },
            EST: { o: "-5:0", f: "EST" },
            "America/Toronto": { o: "-5:0", f: "E{c}T" },
            "America/Montreal": { o: "-5:0", f: "E{c}T" },
            "Pacific/Auckland": { o: "12:0", f: "NZ{c}T" },
            NZ: { o: "12:0", f: "NZ{c}T" },
        });

        expect(result.zones["America/Panama"].c).toBe("PA");
        expect(result.zones.EST.c).toBeUndefined();
        expect(result.zones["America/Montreal"].c).toBe("CA");
        expect(result.zones.NZ.c).toBe("NZ");
    });

    test("does not copy Windows n onto POSIX Link ids", () => {
        expect.assertions(3);
        // EST → Panama must not get "SA Pacific {c} Time"; Montreal still copies.
        const customTz = writeTzDataDir(path.join(root, "posix-n"), {
            zoneTab: [
                "PA\t+0858-07932\tAmerica/Panama",
                "CA\t+4339-07923\tAmerica/Toronto",
            ].join("\n"),
            backward: [
                "Link\tAmerica/Panama\tEST",
                "Link\tAmerica/Toronto\tAmerica/Montreal",
            ].join("\n"),
        });
        const windowsZones = {
            supplemental: {
                windowsZones: {
                    mapTimezones: [
                        {
                            mapZone: {
                                "@other": "SA Pacific Standard Time",
                                "@type": "America/Panama",
                            },
                        },
                        {
                            mapZone: {
                                "@other": "Eastern Standard Time",
                                "@type": "America/Toronto",
                            },
                        },
                    ],
                },
            },
        };
        const result = new ZoneInfoEnricher({
            tzDataDir: customTz,
            windowsZones,
        }).enrich({
            "America/Panama": { o: "-5:0", f: "EST" },
            EST: { o: "-5:0", f: "EST" },
            "America/Toronto": { o: "-5:0", f: "E{c}T" },
            "America/Montreal": { o: "-5:0", f: "E{c}T" },
        });

        expect(result.zones["America/Panama"].n).toBe("SA Pacific {c} Time");
        expect(result.zones.EST.n).toBeUndefined();
        expect(result.zones["America/Montreal"].n).toBe("Eastern {c} Time");
    });

    test("does not add POSIX Link ids to countryToZones / zonetab lists", () => {
        expect.assertions(3);
        const customTz = writeTzDataDir(path.join(root, "posix-zonetab"), {
            zoneTab: [
                "PA\t+0858-07932\tAmerica/Panama",
                "NZ\t-3652+17446\tPacific/Auckland",
            ].join("\n"),
            backward: [
                "Link\tAmerica/Panama\tEST",
                "Link\tPacific/Auckland\tNZ",
            ].join("\n"),
        });
        const result = new ZoneInfoEnricher({
            tzDataDir: customTz,
            windowsZones: sampleWindowsZones(),
        }).enrich({
            "America/Panama": { o: "-5:0", f: "EST" },
            EST: { o: "-5:0", f: "EST" },
            "Pacific/Auckland": { o: "12:0", f: "NZ{c}T" },
            NZ: { o: "12:0", f: "NZ{c}T" },
        });

        expect(result.countryToZones.PA).toEqual(["America/Panama"]);
        expect(result.countryToZones.PA).not.toContain("EST");
        expect(result.countryToZones.NZ).toEqual(
            expect.arrayContaining(["Pacific/Auckland", "NZ"])
        );
    });

    test("countryTimezone prefers a zone.tab entry over an exception alias that sorts first", () => {
        expect.assertions(1);
        // Atlantic/Jan_Mayen is COUNTRY_EXCEPTIONS→NO and sorts before Europe/Oslo.
        // und/NO/timezone.jf must stay Europe/Oslo (the zone.tab primary).
        const customTz = writeTzDataDir(path.join(root, "no-default"), {
            zoneTab: "NO\t+5955+01045\tEurope/Oslo\n",
            // Link target in another country — same shape as IANA Jan_Mayen→Berlin
            backward: "Link\tEurope/Berlin\tAtlantic/Jan_Mayen\n",
        });
        const result = new ZoneInfoEnricher({
            tzDataDir: customTz,
            windowsZones: sampleWindowsZones(),
        }).enrich({
            "Europe/Oslo": { o: "1:0", f: "CE{c}T" },
            "Europe/Berlin": { o: "1:0", f: "CE{c}T" },
            "Atlantic/Jan_Mayen": { o: "1:0", f: "CE{c}T" },
        });

        expect(result.countryTimezones.NO).toEqual({
            timezone: "Europe/Oslo",
        });
    });

    test("preserves UTC display name without forcing {c}", () => {
        expect.assertions(1);
        const result = enrich();
        expect(result.zones["Etc/UTC"].n).toBe("UTC");
    });

    test("builds countryToZones from zone.tab entries", () => {
        expect.assertions(3);
        const result = enrich();
        expect(result.countryToZones.US).toEqual(
            expect.arrayContaining(["America/New_York"])
        );
        expect(result.countryToZones.FR).toEqual(["Europe/Paris"]);
        expect(result.countryToZones.JP).toEqual(["Asia/Tokyo"]);
    });

    test("adds backwards aliases into the modern zone's country list", () => {
        expect.assertions(1);
        const result = enrich();
        expect(result.countryToZones.US).toEqual(
            expect.arrayContaining(["America/New_York", "US/Eastern"])
        );
    });

    test("honours BACKWARDS_EXCEPTIONS for country lists", () => {
        expect.assertions(2);
        const result = enrich();
        expect(result.countryToZones.IS).toEqual(
            expect.arrayContaining(["Iceland", "Atlantic/Reykjavik"])
        );
        expect(result.countryToZones.FM).toEqual(
            expect.arrayContaining(["Pacific/Ponape", "Pacific/Pohnpei"])
        );
    });

    test("sorts each countryToZones list alphabetically", () => {
        expect.assertions(1);
        const result = enrich();
        const unsorted = Object.values(result.countryToZones).filter(
            (zones) => zones.join("\0") !== [...zones].sort().join("\0")
        );
        expect(unsorted).toEqual([]);
    });

    test("rootTimezone is Etc/UTC", () => {
        expect.assertions(1);
        const result = enrich();
        expect(result.rootTimezone).toEqual({ timezone: "Etc/UTC" });
    });

    test("uses DEFAULT_TIMEZONE_ID for multi-zone countries", () => {
        expect.assertions(2);
        const result = enrich();
        expect(result.countryTimezones.US).toEqual({
            timezone: "America/New_York",
        });
        expect(result.countryTimezones.CA).toEqual({
            timezone: "America/Toronto",
        });
    });

    test("falls back to the first sorted zone when no default is configured", () => {
        expect.assertions(1);
        const result = enrich();
        expect(result.countryTimezones.FR).toEqual({
            timezone: "Europe/Paris",
        });
    });

    test("resolves a same-country backwards rename when the old id sorts first", () => {
        expect.assertions(1);
        // zone.tab has the modern id; backward adds an old alias that sorts
        // first alphabetically — prefer the modern name still in this country.
        const customTz = writeTzDataDir(path.join(root, "custom"), {
            zoneTab:
                "# country\tcoords\tzone\nXX\t+0000+0000\tModern/Zone\n",
            backward: "Link\tModern/Zone\tAaa/Old_Zone\n",
        });
        const zones: Record<string, ZoneInfo> = {
            "Aaa/Old_Zone": { o: "0:0", f: "X" },
            "Modern/Zone": { o: "0:0", f: "X" },
        };
        const result = new ZoneInfoEnricher({
            tzDataDir: customTz,
            windowsZones: sampleWindowsZones(),
        }).enrich(zones);

        expect(result.countryTimezones.XX).toEqual({
            timezone: "Modern/Zone",
        });
    });

    test("does not follow a cross-country consolidation for timezone.jf", () => {
        expect.assertions(2);
        // IANA links America/Antigua → America/Puerto_Rico (different CC).
        // und/AG/timezone.jf must stay America/Antigua, not Puerto_Rico.
        const customTz = writeTzDataDir(path.join(root, "cross-country"), {
            zoneTab: [
                "AG\t+1703-06148\tAmerica/Antigua",
                "PR\t+182806-0660622\tAmerica/Puerto_Rico",
            ].join("\n"),
            backward: "Link\tAmerica/Puerto_Rico\tAmerica/Antigua\n",
        });
        const zones: Record<string, ZoneInfo> = {
            "America/Antigua": { o: "-4:0", f: "AST" },
            "America/Puerto_Rico": { o: "-4:0", f: "AST" },
        };
        const result = new ZoneInfoEnricher({
            tzDataDir: customTz,
            windowsZones: sampleWindowsZones(),
        }).enrich(zones);

        expect(result.countryTimezones.AG).toEqual({
            timezone: "America/Antigua",
        });
        expect(result.countryTimezones.PR).toEqual({
            timezone: "America/Puerto_Rico",
        });
    });

    test("keeps compiler fields (o/f/s/e) intact while adding c/n", () => {
        expect.assertions(4);
        const result = enrich();
        const ny = result.zones["America/New_York"];
        expect(ny.o).toBe("-5:0");
        expect(ny.f).toBe("E{c}T");
        expect(ny.s).toEqual({
            c: "D",
            m: 3,
            r: "0>8",
            t: "2:0",
            v: "1:0",
        });
        expect(ny.e).toEqual({ c: "S", m: 11, r: "0>1", t: "2:0" });
    });

    test("ignores comments and blank lines in zone.tab", () => {
        expect.assertions(1);
        const customTz = writeTzDataDir(path.join(root, "comments"), {
            zoneTab: [
                "# comment",
                "",
                "US\t+404251-0740023\tAmerica/New_York",
            ].join("\n"),
            backward: "",
        });
        const result = new ZoneInfoEnricher({
            tzDataDir: customTz,
            windowsZones: sampleWindowsZones(),
        }).enrich({
            "America/New_York": { o: "-5:0", f: "E{c}T" },
        });
        expect(result.zones["America/New_York"].c).toBe("US");
    });
});
