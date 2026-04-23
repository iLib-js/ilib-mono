/*
 * samples.e2e.test.js - E2E tests for ilib-loctool-po samples
 *
 * Copyright © 2025, Box, Inc.
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

import path from "path";
import fs from "fs";
import { expectFileToMatchSnapshot, LoctoolRunner, FSSnapshot } from "ilib-internal";

/** Root of the sample project passed to LoctoolRunner (absolute path). */
const sampleProjectRoot = path.join(__dirname, "..", "samples", "pendo-md");

describe("samples", () => {
    describe("pendo-md", () => {
        let fsSnapshot: FSSnapshot | undefined;
        const projectPath = sampleProjectRoot;
        const pathInProject = (p: string) => path.resolve(projectPath, p);

        const projectFiles = {
            loctool: {
                extracted: pathInProject("pendo-md-extracted.xliff"),
                new: pathInProject("pendo-md-new.xliff"),
            },
            pendo: {
                source: pathInProject("l10n/xliff/guides/A000A00Aaa0aaa-AaaaAaa00A0a_en-US.xliff"),
                localized: pathInProject("l10n/xliff/guides/A000A00Aaa0aaa-AaaaAaa00A0a_pl-PL.xliff"),
            },
        };

        beforeAll(async () => {
            // Snapshot the whole sample tree so any file loctool creates or modifies is restored in afterAll.
            fsSnapshot = FSSnapshot.create([sampleProjectRoot]);

            // run loctool
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        afterAll(() => {
            fsSnapshot?.restore();
        });

        it("should produce an extracted Loctool XLIFF file", () => {
            expectFileToMatchSnapshot(projectFiles.loctool.extracted);
        });

        it("should not produce a newly-extracted Loctool XLIFF file", () => {
            expect(fs.existsSync(projectFiles.loctool.new)).toBe(false);
        });

        it("should produce a localized Pendo XLIFF file", () => {
            expectFileToMatchSnapshot(projectFiles.pendo.localized);
        });
    });
});
