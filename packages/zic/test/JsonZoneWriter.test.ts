/*
 * JsonZoneWriter.test.ts - unit tests for JsonZoneWriter
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

import { JsonZoneWriter } from "../src/JsonZoneWriter";
import { RuleSet } from "../src/RuleSet";
import { Zone } from "../src/Zone";

describe("JsonZoneWriter", () => {
    let root: string;
    let outputDir: string;

    beforeEach(() => {
        root = fs.mkdtempSync(path.join(os.tmpdir(), "ilib-zic-writer-"));
        outputDir = path.join(root, "zoneinfo");
        fs.mkdirSync(outputDir);
    });

    afterEach(() => {
        fs.rmSync(root, { recursive: true, force: true });
    });

    test("writeZone writes pretty-printed JSON under nested dirs", () => {
        expect.assertions(3);
        const writer = new JsonZoneWriter(outputDir);
        writer.writeZone("America/New_York", { o: "-5:0", f: "E{c}T" });

        const outFile = path.join(outputDir, "America", "New_York.json");
        expect(fs.existsSync(outFile)).toBe(true);
        const contents = fs.readFileSync(outFile, "utf-8");
        expect(JSON.parse(contents)).toEqual({ o: "-5:0", f: "E{c}T" });
        expect(contents).toContain("\n");
    });

    test("writeZone ignores null json", () => {
        expect.assertions(1);
        const writer = new JsonZoneWriter(outputDir);
        writer.writeZone("Etc/UTC", null);
        expect(fs.existsSync(path.join(outputDir, "Etc", "UTC.json"))).toBe(
            false
        );
    });

    test("writeZone warns when verbose and json is null", () => {
        expect.assertions(1);
        const warn = jest
            .spyOn(console, "warn")
            .mockImplementation(() => undefined);
        try {
            const writer = new JsonZoneWriter(outputDir, true);
            writer.writeZone("Etc/UTC", null);
            expect(warn).toHaveBeenCalledWith("Zone Etc/UTC has no json.");
        } finally {
            warn.mockRestore();
        }
    });

    test("writeZone logs the output path when verbose", () => {
        expect.assertions(1);
        const log = jest
            .spyOn(console, "log")
            .mockImplementation(() => undefined);
        try {
            const writer = new JsonZoneWriter(outputDir, true);
            writer.writeZone("UTC", { o: "0:0" });
            const outFile = path.join(outputDir, "UTC.json");
            expect(log).toHaveBeenCalledWith("Writing output file " + outFile);
        } finally {
            log.mockRestore();
        }
    });

    test("writeZones writes each named zone and returns the count", () => {
        expect.assertions(4);
        const ruleSets = new Map<string, RuleSet>();
        const zones = new Map<string, Zone>();
        zones.set(
            "Africa/Lome",
            new Zone("Zone\tAfrica/Lome\t0:00\t-\tGMT", ruleSets)
        );
        zones.set(
            "Etc/UTC",
            new Zone("Zone\tEtc/UTC\t0:00\t-\tUTC", ruleSets)
        );
        zones.set("", new Zone());

        const writer = new JsonZoneWriter(outputDir);
        const count = writer.writeZones(zones, true);

        expect(count).toBe(2);
        expect(
            fs.existsSync(path.join(outputDir, "Africa", "Lome.json"))
        ).toBe(true);
        expect(fs.existsSync(path.join(outputDir, "Etc", "UTC.json"))).toBe(
            true
        );

        const lome = JSON.parse(
            fs.readFileSync(path.join(outputDir, "Africa", "Lome.json"), "utf-8")
        );
        expect(lome.o).toBe("0:0");
    });

    test("writeZones with currentOnly false skips writing when getJson is null", () => {
        expect.assertions(2);
        const ruleSets = new Map<string, RuleSet>();
        const zones = new Map<string, Zone>();
        zones.set(
            "Etc/UTC",
            new Zone("Zone\tEtc/UTC\t0:00\t-\tUTC", ruleSets)
        );

        const writer = new JsonZoneWriter(outputDir);
        const count = writer.writeZones(zones, false);

        expect(count).toBe(1);
        expect(fs.existsSync(path.join(outputDir, "Etc", "UTC.json"))).toBe(
            false
        );
    });
});
