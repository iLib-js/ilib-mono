/*
 * samples.e2e.test.js - E2E tests for ilib-loctool-php-resource samples
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
    describe("php-resource", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "php-resource");
        const xliffPath = path.resolve(projectPath, "sample-php-resource-extracted.xliff");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        afterAll(() => {
            // Clean up all generated files and directories
            const filesToClean = [
                xliffPath, // sample-php-resource-extracted.xliff
                path.resolve(projectPath, "sample-php-resource-new-de-DE.xliff"),
                path.resolve(projectPath, "sample-php-resource-new-ko-KR.xliff"),
                path.resolve(projectPath, "resources")
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
    describe("regex", () => {
        const projectPath = path.resolve(__dirname, "..", "samples", "regex");
        const xliffPath = path.resolve(projectPath, "sample-regex-extracted.xliff");

        beforeAll(async () => {
            const loctool = new LoctoolRunner(projectPath);
            await loctool.run("localize");
        });

        afterAll(() => {
            // Clean up all generated files and directories
            const filesToClean = [
                xliffPath, // sample-regex-extracted.xliff
                path.resolve(projectPath, "sample-regex-new-de-DE.xliff"),
                path.resolve(projectPath, "sample-regex-new-ko-KR.xliff")
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
