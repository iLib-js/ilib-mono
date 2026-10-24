/*
 * ZoneInfoCompiler.test.ts - unit tests for ZoneInfoCompiler
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

import { ZoneInfoCompiler } from "../src/ZoneInfoCompiler";
import { makeTempRoot, writeTzDataDir } from "./helpers/tzFixtures";

describe("ZoneInfoCompiler", () => {
    let root: string;

    beforeEach(() => {
        root = makeTempRoot("zic-compile-");
    });

    afterEach(() => {
        fs.rmSync(root, { recursive: true, force: true });
    });

    describe("negative cases", () => {
        test("requires an options object", () => {
            expect.assertions(2);
            expect(
                () => new ZoneInfoCompiler(undefined as unknown as { srcDir: string })
            ).toThrow(/srcDir/);
            expect(
                () => new ZoneInfoCompiler(null as unknown as { srcDir: string })
            ).toThrow(/srcDir/);
        });

        test("requires srcDir", () => {
            expect.assertions(2);
            expect(() => new ZoneInfoCompiler({ srcDir: "" })).toThrow(/srcDir/);
            expect(
                () =>
                    new ZoneInfoCompiler({
                        srcDir: undefined as unknown as string,
                    })
            ).toThrow(/srcDir/);
        });

        test("compile throws when srcDir does not exist", () => {
            expect.assertions(1);
            const compiler = new ZoneInfoCompiler({
                srcDir: path.join(root, "does-not-exist"),
            });
            expect(() => compiler.compile()).toThrow(/not a directory/);
        });

        test("compile throws when srcDir is a file, not a directory", () => {
            expect.assertions(1);
            const filePath = path.join(root, "not-a-dir");
            fs.writeFileSync(filePath, "zone data\n", "utf-8");
            const compiler = new ZoneInfoCompiler({ srcDir: filePath });
            expect(() => compiler.compile()).toThrow(/not a directory/);
        });
    });

    test("compile returns zones in memory and does not write files", () => {
        expect.assertions(6);
        const srcDir = writeTzDataDir(root, {
            // No Link aliases — this test only covers the Zone path
            backward: "# no links\n",
            sources: {
                northamerica: [
                    "# sample fixture",
                    "Rule\tUS\t2007\tmax\t-\tMar\tSun>=8\t2:00\t1:00\tD",
                    "Rule\tUS\t2007\tmax\t-\tNov\tSun>=1\t2:00\t0\tS",
                    "Zone\tAmerica/New_York\t-5:00\tUS\tE%sT",
                ].join("\n"),
            },
        });
        const localeDir = path.join(root, "locale");
        fs.mkdirSync(localeDir);

        const compiler = new ZoneInfoCompiler({ srcDir });
        const result = compiler.compile();

        expect(result.zoneCount).toBe(1);
        expect(Object.keys(result.zones)).toEqual(["America/New_York"]);
        expect(result.zones["America/New_York"].o).toBe("-5:0");
        expect(result.zones["America/New_York"].f).toBe("E{c}T");
        expect(result.zones["America/New_York"].s).toBeDefined();
        expect(fs.readdirSync(localeDir)).toEqual([]);
    });

    test("compile skips files that have extensions", () => {
        expect.assertions(1);
        const srcDir = writeTzDataDir(root, {
            backward: "# no links\n",
            sources: {
                "readme.txt": "Zone\tFake/Zone\t0:00\t-\tGMT\n",
                northamerica: "Zone\tAmerica/New_York\t-5:00\t-\tEST\n",
            },
        });

        const result = new ZoneInfoCompiler({ srcDir }).compile();
        expect(Object.keys(result.zones).sort()).toEqual(["America/New_York"]);
    });

    test("compile with currentOnly false omits zones that have no historical JSON", () => {
        expect.assertions(2);
        const srcDir = writeTzDataDir(root, {
            sources: {
                etcetera: "Zone\tEtc/UTC\t0:00\t-\tUTC\n",
            },
        });

        const result = new ZoneInfoCompiler({
            srcDir,
            currentOnly: false,
        }).compile();

        expect(result.zoneCount).toBe(0);
        expect(result.zones).toEqual({});
    });

    test("compile expands %z FORMAT to -03/-02 style f for Brazil-like zone", () => {
        expect.assertions(2);
        // Mini excerpt patterned on tzdata2026e America/Sao_Paulo (main form uses %z)
        const srcDir = writeTzDataDir(root, {
            sources: {
                southamerica: [
                    "Rule\tBrazil\t2007\tmax\t-\tOct\tSun>=15\t0:00\t1:00\t-",
                    "Rule\tBrazil\t2007\tmax\t-\tFeb\tSun>=15\t0:00\t0\t-",
                    "Zone\tAmerica/Sao_Paulo\t-3:00\tBrazil\t%z",
                ].join("\n"),
            },
        });

        const result = new ZoneInfoCompiler({ srcDir }).compile();
        expect(result.zones["America/Sao_Paulo"]).toBeDefined();
        expect(result.zones["America/Sao_Paulo"].f).toBe("-03/-02");
    });

    test("compile applies Link aliases even when backward is parsed before the target file", () => {
        expect.assertions(4);
        // Alphabetical readdir processes `backward` before `northamerica`.
        // Links must be deferred until all Zone lines are loaded.
        const srcDir = writeTzDataDir(root, {
            backward: "Link\tAmerica/New_York\tUS/Eastern\n",
            sources: {
                northamerica: [
                    "Rule\tUS\t2007\tmax\t-\tMar\tSun>=8\t2:00\t1:00\tD",
                    "Rule\tUS\t2007\tmax\t-\tNov\tSun>=1\t2:00\t0\tS",
                    "Zone\tAmerica/New_York\t-5:00\tUS\tE%sT",
                ].join("\n"),
            },
        });

        const result = new ZoneInfoCompiler({ srcDir }).compile();
        expect(result.zoneCount).toBe(2);
        expect(Object.keys(result.zones).sort()).toEqual([
            "America/New_York",
            "US/Eastern",
        ]);
        expect(result.zones["US/Eastern"]).toEqual(
            result.zones["America/New_York"]
        );
        expect(result.zones["US/Eastern"].f).toBe("E{c}T");
    });

    test("compile warns on parse errors even when verbose is false", () => {
        expect.assertions(3);
        const srcDir = writeTzDataDir(root, {
            backward: "# no links\n",
            sources: {
                // Not enough fields → ParseException while parsing the Zone line
                broken: "Zone\tToo/Short\t-5:00\n",
                northamerica: "Zone\tAmerica/New_York\t-5:00\t-\tEST\n",
            },
        });
        const warn = jest.spyOn(console, "warn").mockImplementation(() => {});

        try {
            const result = new ZoneInfoCompiler({
                srcDir,
                verbose: false,
            }).compile();
            expect(Object.keys(result.zones)).toEqual(["America/New_York"]);
            expect(warn).toHaveBeenCalled();
            expect(String(warn.mock.calls[0][0])).toMatch(/Skipping file/);
        } finally {
            warn.mockRestore();
        }
    });

    test("compile emits both s and e for negative-SAVE zones like Europe/Dublin", () => {
        expect.assertions(5);
        // Patterned on IANA Eire rules: zone base is IST (+1), winter SAVE is -1:00
        const srcDir = writeTzDataDir(root, {
            sources: {
                europe: [
                    "Rule\tEire\t1981\tmax\t-\tMar\tlastSun\t1:00u\t0\t-",
                    "Rule\tEire\t1996\tmax\t-\tOct\tlastSun\t1:00u\t-1:00\t-",
                    "Zone\tEurope/Dublin\t1:00\tEire\tIST/GMT",
                ].join("\n"),
            },
        });

        const result = new ZoneInfoCompiler({ srcDir }).compile();
        const dublin = result.zones["Europe/Dublin"];
        expect(dublin).toBeDefined();
        expect(dublin.o).toBe("1:0");
        expect(dublin.f).toBe("IST/GMT");
        expect(dublin.s).toBeDefined();
        expect(dublin.e).toBeDefined();
    });
});
