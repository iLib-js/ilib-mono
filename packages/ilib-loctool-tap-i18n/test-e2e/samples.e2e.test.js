/*
 * samples.e2e.test.js - E2E tests for ilib-loctool-tap-i18n samples
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

const path = require("path");
const fs = require("fs");
const { expectFileToMatchSnapshot, LoctoolRunner } = require("ilib-internal");

describe("samples", () => {
    describe("tap-i18n", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "tap-i18n");
        const xliffPath = path.resolve(projectPath, "sample-tap-i18n-extracted.xliff");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        afterAll(() => {
            // Clean up all generated files and directories
            const filesToClean = [
                xliffPath, // sample-tap-i18n-extracted.xliff
                path.resolve(projectPath, "sample-tap-i18n-new-ko-KR.xliff"),
                path.resolve(projectPath, "sample-tap-i18n-new-nl-NL.xliff"),
                path.resolve(projectPath, "languages/ko-KR.i18n.yml"),
                path.resolve(projectPath, "languages/nl-NL.i18n.yml")
            ];
            
            filesToClean.forEach(file => {
                if (fs.existsSync(file)) {
                    if (fs.statSync(file).isDirectory()) {
                        fs.rmSync(file, { recursive: true, force: true });
                    } else {
                        fs.unlinkSync(file);
                    }
                }
            });
        });

        it("should produce an extracted XLIFF file", () => {
            expectFileToMatchSnapshot(xliffPath);
        });
    });
});
