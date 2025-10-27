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

describe("samples", () => {
    describe("pendo-md", () => {
        let fsSnapshot: FSSnapshot;
        const projectPath = path.resolve(__dirname, "..", "samples", "pendo");
        const pathInProject = (p: string) => path.resolve(projectPath, p);

        const projectFiles = {
            loctool: {
                extracted: pathInProject("ilib-loctool-pendo-md-test-extracted.xliff"),
                new: pathInProject("ilib-loctool-pendo-md-test-new.xliff"),
            },
            pendo: {
                source: pathInProject("l10n/xliff/guides/A000A00Aaa0aaa-AaaaAaa00A0a_en-US.xliff"),
                localized: pathInProject("l10n/xliff/guides/A000A00Aaa0aaa-AaaaAaa00A0a_en-US_pl-PL.xliff"),
            },
        };

        beforeAll(async () => {
            const filesToSnapshot = Object.values(projectFiles).flatMap((f) => Object.values(f));
            fsSnapshot = FSSnapshot.create(filesToSnapshot);

            // run loctool
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        afterAll(() => {
            fsSnapshot.restore();
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
