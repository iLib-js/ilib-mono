/*
 * LocaleDataWriter.test.ts - unit tests for LocaleDataWriter
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

import { LocaleDataWriter } from "../src/LocaleDataWriter";
import type { EnrichedTzData } from "../src/types";
import { makeTempRoot } from "./helpers/tzFixtures";

describe("LocaleDataWriter", () => {
    let root: string;
    let localeDir: string;

    beforeEach(() => {
        root = makeTempRoot("zic-writer-");
        localeDir = path.join(root, "locale");
    });

    afterEach(() => {
        fs.rmSync(root, { recursive: true, force: true });
    });

    function sampleData(): EnrichedTzData {
        return {
            zones: {
                "America/New_York": {
                    o: "-5:0",
                    f: "E{c}T",
                    c: "US",
                    n: "Eastern {c} Time",
                    s: { c: "D", m: 3, r: "0>8", t: "2:0", v: "1:0" },
                    e: { c: "S", m: 11, r: "0>1", t: "2:0" },
                },
                "Asia/Tokyo": {
                    o: "9:0",
                    f: "JST",
                    c: "JP",
                    n: "Tokyo {c} Time",
                },
            },
            countryToZones: {
                US: ["America/New_York"],
                JP: ["Asia/Tokyo"],
            },
            rootTimezone: { timezone: "Etc/UTC" },
            countryTimezones: {
                US: { timezone: "America/New_York" },
                JP: { timezone: "Asia/Tokyo" },
            },
        };
    }

    describe("negative cases", () => {
        test("requires an options object", () => {
            expect.assertions(2);
            expect(
                () =>
                    new LocaleDataWriter(
                        undefined as unknown as { localeDir: string }
                    )
            ).toThrow(/localeDir/);
            expect(
                () =>
                    new LocaleDataWriter(
                        null as unknown as { localeDir: string }
                    )
            ).toThrow(/localeDir/);
        });

        test("requires localeDir", () => {
            expect.assertions(2);
            expect(() => new LocaleDataWriter({ localeDir: "" })).toThrow(
                /localeDir/
            );
            expect(
                () =>
                    new LocaleDataWriter({
                        localeDir: undefined as unknown as string,
                    })
            ).toThrow(/localeDir/);
        });

        test("write throws when data is missing or not an object", () => {
            expect.assertions(3);
            const writer = new LocaleDataWriter({ localeDir });
            expect(() =>
                writer.write(undefined as unknown as EnrichedTzData)
            ).toThrow(/data/i);
            expect(() =>
                writer.write(null as unknown as EnrichedTzData)
            ).toThrow(/data/i);
            expect(() =>
                writer.write("not-an-object" as unknown as EnrichedTzData)
            ).toThrow(/data/i);
        });

        test("write throws when required EnrichedTzData fields are missing", () => {
            expect.assertions(4);
            const writer = new LocaleDataWriter({ localeDir });
            expect(() =>
                writer.write({} as unknown as EnrichedTzData)
            ).toThrow(/zones|countryToZones|rootTimezone|countryTimezones/i);
            expect(() =>
                writer.write({
                    zones: {},
                    countryToZones: {},
                    rootTimezone: { timezone: "Etc/UTC" },
                } as unknown as EnrichedTzData)
            ).toThrow(/countryTimezones/i);
            expect(() =>
                writer.write({
                    zones: {},
                    countryToZones: {},
                    countryTimezones: {},
                } as unknown as EnrichedTzData)
            ).toThrow(/rootTimezone/i);
            expect(() =>
                writer.write({
                    zones: {},
                    rootTimezone: { timezone: "Etc/UTC" },
                    countryTimezones: {},
                } as unknown as EnrichedTzData)
            ).toThrow(/countryToZones/i);
        });

        test("write throws when localeDir exists as a file", () => {
            expect.assertions(1);
            const filePath = path.join(root, "locale-as-file");
            fs.writeFileSync(filePath, "not a directory\n", "utf-8");
            const writer = new LocaleDataWriter({ localeDir: filePath });
            expect(() => writer.write(sampleData())).toThrow(
                /not a directory|directory/i
            );
        });

        test("writeZonesOnly throws when zones is missing or not an object", () => {
            expect.assertions(3);
            const writer = new LocaleDataWriter({ localeDir });
            expect(() =>
                writer.writeZonesOnly(
                    undefined as unknown as Record<string, never>
                )
            ).toThrow(/zones/i);
            expect(() =>
                writer.writeZonesOnly(null as unknown as Record<string, never>)
            ).toThrow(/zones/i);
            expect(() =>
                writer.writeZonesOnly(
                    "America/New_York" as unknown as Record<string, never>
                )
            ).toThrow(/zones/i);
        });

        test("writeZonesOnly throws when localeDir exists as a file", () => {
            expect.assertions(1);
            const filePath = path.join(root, "locale-as-file-2");
            fs.writeFileSync(filePath, "not a directory\n", "utf-8");
            const writer = new LocaleDataWriter({ localeDir: filePath });
            expect(() =>
                writer.writeZonesOnly({
                    "Asia/Tokyo": { o: "9:0", f: "JST" },
                })
            ).toThrow(/not a directory|directory/i);
        });
    });

    test("write creates the locale tree matching ilib js/data/locale", () => {
        expect.assertions(6);
        const writer = new LocaleDataWriter({ localeDir });
        const result = writer.write(sampleData());

        expect(result.zoneCount).toBe(2);
        expect(result.countryTimezoneCount).toBe(2);
        expect(result.localeDir).toBe(path.resolve(localeDir));

        expect(
            fs.existsSync(
                path.join(localeDir, "zoneinfo", "America", "New_York.json")
            )
        ).toBe(true);
        expect(
            fs.existsSync(path.join(localeDir, "zoneinfo", "zonetab.json"))
        ).toBe(true);
        expect(fs.existsSync(path.join(localeDir, "timezone.jf"))).toBe(true);
    });

    test("write emits enriched zone JSON with stable key order", () => {
        expect.assertions(2);
        new LocaleDataWriter({ localeDir }).write(sampleData());

        const file = path.join(
            localeDir,
            "zoneinfo",
            "America",
            "New_York.json"
        );
        const text = fs.readFileSync(file, "utf-8");
        const json = JSON.parse(text);

        expect(json).toEqual({
            c: "US",
            e: { c: "S", m: 11, r: "0>1", t: "2:0" },
            f: "E{c}T",
            n: "Eastern {c} Time",
            o: "-5:0",
            s: { c: "D", m: 3, r: "0>8", t: "2:0", v: "1:0" },
        });
        // json-stable-stringify alphabetical keys at top level
        expect(text.indexOf('"c"')).toBeLessThan(text.indexOf('"o"'));
    });

    test("write pretty-prints with 4-space indent", () => {
        expect.assertions(1);
        new LocaleDataWriter({ localeDir }).write(sampleData());
        const text = fs.readFileSync(
            path.join(localeDir, "timezone.jf"),
            "utf-8"
        );
        expect(text).toBe('{\n    "timezone": "Etc/UTC"\n}');
    });

    test("write emits zonetab.json from countryToZones", () => {
        expect.assertions(1);
        new LocaleDataWriter({ localeDir }).write(sampleData());
        const zonetab = JSON.parse(
            fs.readFileSync(
                path.join(localeDir, "zoneinfo", "zonetab.json"),
                "utf-8"
            )
        );
        expect(zonetab).toEqual({
            JP: ["Asia/Tokyo"],
            US: ["America/New_York"],
        });
    });

    test("write emits und/<CC>/timezone.jf for each country", () => {
        expect.assertions(2);
        new LocaleDataWriter({ localeDir }).write(sampleData());
        expect(
            JSON.parse(
                fs.readFileSync(
                    path.join(localeDir, "und", "US", "timezone.jf"),
                    "utf-8"
                )
            )
        ).toEqual({ timezone: "America/New_York" });
        expect(
            JSON.parse(
                fs.readFileSync(
                    path.join(localeDir, "und", "JP", "timezone.jf"),
                    "utf-8"
                )
            )
        ).toEqual({ timezone: "Asia/Tokyo" });
    });

    test("write creates localeDir when it does not exist", () => {
        expect.assertions(1);
        const missing = path.join(root, "missing-locale");
        new LocaleDataWriter({ localeDir: missing }).write(sampleData());
        expect(fs.existsSync(path.join(missing, "timezone.jf"))).toBe(true);
    });

    test("writeZonesOnly writes zoneinfo JSON without metadata files", () => {
        expect.assertions(4);
        const writer = new LocaleDataWriter({ localeDir });
        const count = writer.writeZonesOnly({
            "America/New_York": { o: "-5:0", f: "E{c}T" },
        });

        expect(count).toBe(1);
        expect(
            fs.existsSync(
                path.join(localeDir, "zoneinfo", "America", "New_York.json")
            )
        ).toBe(true);
        expect(
            fs.existsSync(path.join(localeDir, "zoneinfo", "zonetab.json"))
        ).toBe(false);
        expect(fs.existsSync(path.join(localeDir, "timezone.jf"))).toBe(false);
    });

    test("writeZonesOnly does not add c or n fields", () => {
        expect.assertions(1);
        new LocaleDataWriter({ localeDir }).writeZonesOnly({
            "Asia/Tokyo": { o: "9:0", f: "JST" },
        });
        const json = JSON.parse(
            fs.readFileSync(
                path.join(localeDir, "zoneinfo", "Asia", "Tokyo.json"),
                "utf-8"
            )
        );
        expect(json).toEqual({ f: "JST", o: "9:0" });
    });
});
