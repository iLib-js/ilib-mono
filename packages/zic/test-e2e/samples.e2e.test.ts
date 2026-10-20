/*
 * samples.e2e.test.ts - E2E tests for the ilib-zic CLI sample
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

import { execFile } from "child_process";
import * as path from "path";
import { promisify } from "util";

import { expectFileToMatchSnapshot, FSSnapshot } from "ilib-internal";

const execFileAsync = promisify(execFile);

const sampleDir = path.resolve(__dirname, "..", "samples", "cli");
const localeDir = path.join(sampleDir, "locale");
const zoneinfoDir = path.join(localeDir, "zoneinfo");

describe("samples", () => {
    describe("cli", () => {
        let fsSnapshot: FSSnapshot;

        beforeAll(async () => {
            fsSnapshot = FSSnapshot.create([localeDir]);

            // Ensure the package lib/ matches src/ before the sample imports it.
            await execFileAsync("pnpm", ["build"], {
                cwd: path.resolve(__dirname, ".."),
                env: { ...process.env },
            });

            const { stdout, stderr } = await execFileAsync(
                "pnpm",
                ["run:sample"],
                {
                    cwd: sampleDir,
                    env: { ...process.env },
                }
            );

            expect(stderr).toBe("");
            expect(stdout).toContain("Wrote 4 zone(s)");
        }, 120000);

        afterAll(() => {
            fsSnapshot.restore();
        });

        it("should produce America/New_York.json", () => {
            expectFileToMatchSnapshot(
                path.join(zoneinfoDir, "America", "New_York.json")
            );
        });

        it("should produce Europe/Paris.json", () => {
            expectFileToMatchSnapshot(
                path.join(zoneinfoDir, "Europe", "Paris.json")
            );
        });

        it("should produce Asia/Tokyo.json", () => {
            expectFileToMatchSnapshot(
                path.join(zoneinfoDir, "Asia", "Tokyo.json")
            );
        });

        it("should produce America/Sao_Paulo.json with %z expanded", () => {
            expectFileToMatchSnapshot(
                path.join(zoneinfoDir, "America", "Sao_Paulo.json")
            );
        });

        it("should produce zonetab.json", () => {
            expectFileToMatchSnapshot(path.join(zoneinfoDir, "zonetab.json"));
        });

        it("should produce root timezone.jf", () => {
            expectFileToMatchSnapshot(path.join(localeDir, "timezone.jf"));
        });

        it("should produce und/US/timezone.jf", () => {
            expectFileToMatchSnapshot(
                path.join(localeDir, "und", "US", "timezone.jf")
            );
        });
    });
});
