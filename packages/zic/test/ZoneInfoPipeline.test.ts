/*
 * ZoneInfoPipeline.test.ts - unit tests for ZoneInfoPipeline
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

import { ZoneInfoPipeline } from "../src/ZoneInfoPipeline";
import {
    makeTempRoot,
    sampleWindowsZones,
    writeTzDataDir,
} from "./helpers/tzFixtures";

describe("ZoneInfoPipeline", () => {
    let root: string;
    let srcDir: string;
    let localeDir: string;

    beforeEach(() => {
        root = makeTempRoot("zic-pipeline-");
        srcDir = writeTzDataDir(root, {
            sources: {
                northamerica: [
                    "Rule\tUS\t2007\tmax\t-\tMar\tSun>=8\t2:00\t1:00\tD",
                    "Rule\tUS\t2007\tmax\t-\tNov\tSun>=1\t2:00\t0\tS",
                    "Zone\tAmerica/New_York\t-5:00\tUS\tE%sT",
                ].join("\n"),
                asia: "Zone\tAsia/Tokyo\t9:00\t-\tJST\n",
            },
        });
        localeDir = path.join(root, "locale");
    });

    afterEach(() => {
        fs.rmSync(root, { recursive: true, force: true });
    });

    describe("negative cases", () => {
        test("requires an options object", () => {
            expect.assertions(2);
            expect(
                () =>
                    new ZoneInfoPipeline(
                        undefined as unknown as {
                            srcDir: string;
                            localeDir: string;
                        }
                    )
            ).toThrow(/srcDir and localeDir/);
            expect(
                () =>
                    new ZoneInfoPipeline(
                        null as unknown as {
                            srcDir: string;
                            localeDir: string;
                        }
                    )
            ).toThrow(/srcDir and localeDir/);
        });

        test("requires srcDir and localeDir", () => {
            expect.assertions(4);
            expect(
                () => new ZoneInfoPipeline({ srcDir: "", localeDir: "out" })
            ).toThrow(/srcDir and localeDir/);
            expect(
                () => new ZoneInfoPipeline({ srcDir: "in", localeDir: "" })
            ).toThrow(/srcDir and localeDir/);
            expect(
                () =>
                    new ZoneInfoPipeline({
                        srcDir: undefined as unknown as string,
                        localeDir: "out",
                    })
            ).toThrow(/srcDir and localeDir/);
            expect(
                () =>
                    new ZoneInfoPipeline({
                        srcDir: "in",
                        localeDir: undefined as unknown as string,
                    })
            ).toThrow(/srcDir and localeDir/);
        });

        test("run throws when srcDir does not exist", () => {
            expect.assertions(1);
            const pipeline = new ZoneInfoPipeline({
                srcDir: path.join(root, "missing-src"),
                localeDir,
                windowsZones: sampleWindowsZones(),
            });
            expect(() => pipeline.run()).toThrow(/not a directory/);
        });

        test("run throws when srcDir is a file, not a directory", () => {
            expect.assertions(1);
            const filePath = path.join(root, "src-as-file");
            fs.writeFileSync(filePath, "not a directory\n", "utf-8");
            const pipeline = new ZoneInfoPipeline({
                srcDir: filePath,
                localeDir,
                windowsZones: sampleWindowsZones(),
            });
            expect(() => pipeline.run()).toThrow(/not a directory/);
        });

        test("run throws when zone.tab is missing from srcDir", () => {
            expect.assertions(1);
            const bareSrc = path.join(root, "bare-src");
            fs.mkdirSync(bareSrc);
            fs.writeFileSync(
                path.join(bareSrc, "northamerica"),
                "Zone\tAmerica/New_York\t-5:00\t-\tEST\n",
                "utf-8"
            );
            const pipeline = new ZoneInfoPipeline({
                srcDir: bareSrc,
                localeDir,
                windowsZones: sampleWindowsZones(),
            });
            expect(() => pipeline.run()).toThrow(/zone\.tab/i);
        });

        test("run throws when localeDir exists as a file", () => {
            expect.assertions(1);
            const filePath = path.join(root, "locale-as-file");
            fs.writeFileSync(filePath, "not a directory\n", "utf-8");
            const pipeline = new ZoneInfoPipeline({
                srcDir,
                localeDir: filePath,
                windowsZones: sampleWindowsZones(),
            });
            expect(() => pipeline.run()).toThrow(/not a directory|directory/i);
        });

        test("compileOnly still throws when srcDir is invalid", () => {
            expect.assertions(1);
            const pipeline = new ZoneInfoPipeline({
                srcDir: path.join(root, "missing-src"),
                localeDir,
                compileOnly: true,
            });
            expect(() => pipeline.run()).toThrow(/not a directory/);
        });
    });

    test("run compiles, enriches, and writes locale data once", () => {
        expect.assertions(6);
        const result = new ZoneInfoPipeline({
            srcDir,
            localeDir,
            windowsZones: sampleWindowsZones(),
        }).run();

        expect(result.compileOnly).toBe(false);
        expect(result.zoneCount).toBeGreaterThanOrEqual(2);
        expect(result.localeDir).toBe(path.resolve(localeDir));

        const ny = JSON.parse(
            fs.readFileSync(
                path.join(localeDir, "zoneinfo", "America", "New_York.json"),
                "utf-8"
            )
        );
        expect(ny.o).toBe("-5:0");
        expect(ny.c).toBe("US");
        expect(ny.n).toBe("Eastern {c} Time");
    });

    test("run writes zonetab and timezone.jf beside zoneinfo", () => {
        expect.assertions(3);
        new ZoneInfoPipeline({
            srcDir,
            localeDir,
            windowsZones: sampleWindowsZones(),
        }).run();

        expect(
            fs.existsSync(path.join(localeDir, "zoneinfo", "zonetab.json"))
        ).toBe(true);
        expect(
            JSON.parse(
                fs.readFileSync(path.join(localeDir, "timezone.jf"), "utf-8")
            )
        ).toEqual({ timezone: "Etc/UTC" });
        expect(
            JSON.parse(
                fs.readFileSync(
                    path.join(localeDir, "und", "US", "timezone.jf"),
                    "utf-8"
                )
            )
        ).toEqual({ timezone: "America/New_York" });
    });

    test("compileOnly skips enrichment metadata", () => {
        expect.assertions(4);
        const result = new ZoneInfoPipeline({
            srcDir,
            localeDir,
            compileOnly: true,
            windowsZones: sampleWindowsZones(),
        }).run();

        expect(result.compileOnly).toBe(true);
        const ny = JSON.parse(
            fs.readFileSync(
                path.join(localeDir, "zoneinfo", "America", "New_York.json"),
                "utf-8"
            )
        );
        expect(ny.c).toBeUndefined();
        expect(ny.n).toBeUndefined();
        expect(fs.existsSync(path.join(localeDir, "timezone.jf"))).toBe(false);
    });

    test("run does not leave intermediate unenriched zone files then rewrite", () => {
        expect.assertions(1);
        // Behavioral contract: after run(), zone files already include c/n.
        // There is no separate "raw then enrich on disk" pass.
        new ZoneInfoPipeline({
            srcDir,
            localeDir,
            windowsZones: sampleWindowsZones(),
        }).run();

        const ny = JSON.parse(
            fs.readFileSync(
                path.join(localeDir, "zoneinfo", "America", "New_York.json"),
                "utf-8"
            )
        );
        expect(ny).toEqual(
            expect.objectContaining({
                c: "US",
                n: "Eastern {c} Time",
                o: "-5:0",
            })
        );
    });
});
