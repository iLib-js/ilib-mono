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
import * as os from "os";
import * as path from "path";

import { ZoneInfoCompiler } from "../src/ZoneInfoCompiler";

describe("ZoneInfoCompiler", () => {
    test("requires srcDir and destDir", () => {
        expect.assertions(2);
        expect(() => new ZoneInfoCompiler({ srcDir: "", destDir: "out" })).toThrow(
            /srcDir and destDir/
        );
        expect(
            () =>
                new ZoneInfoCompiler({
                    srcDir: "in",
                    destDir: "",
                })
        ).toThrow(/srcDir and destDir/);
    });

    test("compile writes zone json from a minimal tzdata fixture", () => {
        expect.assertions(4);
        const root = fs.mkdtempSync(path.join(os.tmpdir(), "zic-"));
        const srcDir = path.join(root, "tzdata");
        const destDir = path.join(root, "zoneinfo");
        fs.mkdirSync(srcDir);

        fs.writeFileSync(
            path.join(srcDir, "northamerica"),
            [
                "# sample fixture",
                "Rule\tUS\t2007\tmax\t-\tMar\tSun>=8\t2:00\t1:00\tD",
                "Rule\tUS\t2007\tmax\t-\tNov\tSun>=1\t2:00\t0\tS",
                "Zone\tAmerica/New_York\t-5:00\tUS\tE%sT",
            ].join("\n"),
            "utf-8"
        );

        try {
            const compiler = new ZoneInfoCompiler({
                srcDir,
                destDir,
            });
            const result = compiler.compile();
            expect(result.zoneCount).toBe(1);
            expect(result.destDir).toBe(path.resolve(destDir));

            const outFile = path.join(destDir, "America", "New_York.json");
            expect(fs.existsSync(outFile)).toBe(true);
            const json = JSON.parse(fs.readFileSync(outFile, "utf-8"));
            expect(json.o).toBe("-5:0");
        } finally {
            fs.rmSync(root, { recursive: true, force: true });
        }
    });
});
